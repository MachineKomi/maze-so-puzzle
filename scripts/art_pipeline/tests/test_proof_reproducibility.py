from __future__ import annotations

import copy
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

PACKAGE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PACKAGE))

import cli
import manifest
import proof_archive
import validate
from model import sha256_file, json_bytes


def fact(root, path):
    return {"path": path.relative_to(root).as_posix(), "bytes": path.stat().st_size, "sha256": sha256_file(path)}


class ProofReproducibilityTests(unittest.TestCase):
    def test_default_check_does_not_select_legacy_audit(self):
        report = {"ok": True, "warnings": []}
        with patch.object(cli, "validate_all", return_value=report) as current, patch.object(cli, "validate_legacy_canary") as old, patch.object(cli, "_print"):
            self.assertEqual(cli.main(["--check"]), 0)
            current.assert_called_once_with()
            old.assert_not_called()
        with patch.object(cli, "validate_all") as current, patch.object(cli, "validate_legacy_canary", return_value={"ok": False}) as old, patch.object(cli, "_print"):
            self.assertEqual(cli.main(["--check-legacy-canary", "current-inputs"]), 1)
            current.assert_not_called()
            old.assert_called_once_with("current-inputs")

    def test_legacy_artifacts_can_be_intact_while_current_source_differs(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            packet = root / "artifacts/art-proofs/canary"
            packet.mkdir(parents=True)
            source = root / "pipeline.py"
            source.write_bytes(b"original\r\n")
            source_fact = fact(root, source)
            self.assertNotEqual(source_fact["sha256"], __import__("hashlib").sha256(b"original\n").hexdigest())
            output = packet / "index.html"
            output.write_bytes(b"historical proof")
            index = {"schema": "maze-art-proof-index/v1", "pipelineInputs": [source_fact], "outputs": [], "candidateDerivatives": [], **{key: fact(root, output) for key in ("html", "browserHarness", "inventory")}}
            (packet / "proof-index.json").write_bytes(json_bytes(index))
            source.write_bytes(b"legitimate new source\n")
            with patch.object(validate, "ROOT", root), patch.object(validate, "PROOF_ROOT", root / "artifacts/art-proofs"), patch.object(validate, "posix_relative", lambda path: path.relative_to(root).as_posix()), patch.object(validate, "inside_root", lambda path, parent=root: path.resolve().is_relative_to(parent.resolve())):
                errors = []
                validate._validate_proof_bundle([], errors, current_inputs=False)
                self.assertEqual(errors, [])
                validate._validate_proof_bundle([], errors, current_inputs=True)
                self.assertIn("proof-file-hash", {row["code"] for row in errors})
                output.write_bytes(b"tampered")
                errors = []
                validate._validate_proof_bundle([], errors, current_inputs=False)
                self.assertIn("proof-file-hash", {row["code"] for row in errors})

    def test_manifest_diff_names_identity_without_array_insertion_noise(self):
        old = {"inputs": [{"path": "a.py", "bytes": 4}, {"path": "c.py", "bytes": 8}]}
        new = {"inputs": [{"path": "a.py", "bytes": 4}, {"path": "b.py", "bytes": 1}, {"path": "c.py", "bytes": 9}]}
        differences = manifest.manifest_field_changes(old, new)
        self.assertEqual([row["field"] for row in differences], ["$.inputs.b.py", "$.inputs.c.py.bytes"])
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "manifest.json"
            path.write_bytes(json_bytes(new).replace(b"\n", b"\r\n"))
            with patch.object(manifest, "MANIFEST_PATH", path), patch.object(manifest, "build_manifest", return_value=(new, [])):
                self.assertIn("byte-format drift", "\n".join(manifest.compare_manifest()))

    def fixture(self, root):
        packet = root / proof_archive.PACKET
        packet.mkdir(parents=True)
        output = packet / "proof.png"
        output.write_bytes(b"original\r\nimage")
        index = packet / "proof-index.json"
        index.write_bytes(json_bytes({"proofFiles": [fact(root, output)]}))
        review = root / proof_archive.REVIEW
        review.parent.mkdir(parents=True)
        review.write_bytes(json_bytes({"evidence": [fact(root, index)]}))
        proof_archive.pack(root)
        return packet, json.loads((root / proof_archive.RECEIPT).read_bytes())

    def test_restore_exact_approved_bytes_and_refuse_local_overwrite(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            packet, receipt = self.fixture(root)
            output = packet / "proof.png"
            original = output.read_bytes()
            output.unlink()
            result = proof_archive.restore_archive(root, receipt, write=False)
            self.assertEqual(result["restored"], 0)
            self.assertFalse(output.exists())
            result = proof_archive.restore_archive(root, receipt, write=True)
            self.assertEqual(result["restored"], 1)
            self.assertEqual(output.read_bytes(), original)
            output.write_bytes(b"different local evidence")
            with self.assertRaises(FileExistsError):
                proof_archive.restore_archive(root, receipt, write=True)
            self.assertEqual(output.read_bytes(), b"different local evidence")

    def test_archive_tampering_and_receipt_rebinding_cannot_pass(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            packet, receipt = self.fixture(root)
            archive = root / proof_archive.ARCHIVE
            original = archive.read_bytes()
            archive.write_bytes(original + b"tampered")
            with self.assertRaisesRegex(ValueError, "Exact bytes differ"):
                proof_archive.restore_archive(root, receipt, write=True)
            archive.write_bytes(original)
            invalid = copy.deepcopy(receipt)
            invalid["files"][0]["sha256"] = "0" * 64
            with self.assertRaisesRegex(ValueError, "Exact bytes differ"):
                proof_archive.restore_archive(root, invalid, write=True)
            (root / proof_archive.REVIEW).write_bytes(b"changed approval")
            with self.assertRaisesRegex(ValueError, "Exact bytes differ"):
                proof_archive.restore_archive(root, receipt, write=True)

    def test_pack_can_resume_after_receipt_interruption_without_overwriting_archive(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            packet, receipt = self.fixture(root)
            archive = root / proof_archive.ARCHIVE
            original = archive.read_bytes()
            (root / proof_archive.RECEIPT).unlink()
            proof_archive.pack(root)
            self.assertEqual(archive.read_bytes(), original)
            self.assertEqual(json.loads((root / proof_archive.RECEIPT).read_bytes()), receipt)
            proof_archive.pack(root)  # Exact-byte idempotent retry.


if __name__ == "__main__":
    unittest.main()
