from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch


PACKAGE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PACKAGE))

import validate as art_validate
from model import sha256_file


class Mgjrpg02ProofIntegrityTests(unittest.TestCase):
    @staticmethod
    def _evidence(root: Path, path: Path) -> dict[str, object]:
        return {
            "path": path.relative_to(root).as_posix(),
            "sha256": sha256_file(path),
            "bytes": path.stat().st_size,
        }

    def test_review_recursively_binds_pipeline_delivery_candidates_and_html(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            proof_root = root / "artifacts/art-proofs/mgjrpg-02/v01"
            proof_root.mkdir(parents=True)

            pipeline = root / "scripts/pipeline.py"
            pipeline.parent.mkdir(parents=True)
            pipeline.write_bytes(b"pipeline")
            html_path = proof_root / "index.html"
            html_path.write_bytes(b"<html>review</html>")
            candidate = proof_root / "candidates/canary.png"
            candidate.parent.mkdir()
            candidate.write_bytes(b"candidate")
            baseline = proof_root / "baselines/canary.png"
            baseline.parent.mkdir()
            baseline.write_bytes(b"baseline")
            delivery = proof_root / "delivery/canary/24px.png"
            delivery.parent.mkdir(parents=True)
            delivery.write_bytes(b"delivery")
            background = root / "public/assets/background.png"
            background.parent.mkdir(parents=True)
            background.write_bytes(b"background")
            authority = root / "docs/source-assets/authority.png"
            authority.parent.mkdir(parents=True)
            authority.write_bytes(b"authority")
            rejected = root / "docs/source-assets/rejected.png"
            rejected.write_bytes(b"rejected")

            report_path = proof_root / "mgjrpg-02-report.json"
            report = {
                "packetRevision": "v01",
                "canaries": [
                    {
                        "candidateOutput": self._evidence(root, candidate),
                        "authority": {
                            "proofBaseline": self._evidence(root, baseline)
                        },
                    }
                ],
                "proofContracts": {
                    "representativeBackground": self._evidence(root, background),
                    "imagegenRejectedAssay": {
                        "authority": self._evidence(root, authority),
                        "output": self._evidence(root, rejected),
                    },
                },
            }
            report_path.write_text(json.dumps(report), encoding="utf-8")

            index_path = proof_root / "proof-index.json"
            index = {
                "schema": "maze-art-mgjrpg02-proof-index/v1",
                "packetRevision": "v01",
                "proofRoot": "artifacts/art-proofs/mgjrpg-02/v01",
                "pipelineInputs": [self._evidence(root, pipeline)],
                "outputs": [
                    self._evidence(root, report_path),
                    self._evidence(root, html_path),
                ],
                "deliveryOutputs": [self._evidence(root, delivery)],
            }
            index_path.write_text(json.dumps(index), encoding="utf-8")
            review = {
                "recommendedPacket": {
                    "revision": "v01",
                    "proofRoot": "artifacts/art-proofs/mgjrpg-02/v01",
                },
                "evidence": [self._evidence(root, index_path)],
            }

            with (
                patch.object(art_validate, "ROOT", root),
                patch.object(
                    art_validate,
                    "PROOF_ROOT",
                    root / "artifacts/art-proofs",
                ),
                patch.object(
                    art_validate,
                    "inside_root",
                    lambda path, parent=root: path.resolve().is_relative_to(
                        parent.resolve()
                    ),
                ),
            ):
                clean_errors: list[dict[str, str]] = []
                art_validate._validate_mgjrpg02_proof_bundle(
                    review, "review", clean_errors
                )
                self.assertEqual(clean_errors, [])

                delivery.write_bytes(b"tampered")
                delivery_errors: list[dict[str, str]] = []
                art_validate._validate_mgjrpg02_proof_bundle(
                    review, "review", delivery_errors
                )
                self.assertIn(
                    "hash-mismatch", {row["code"] for row in delivery_errors}
                )
                delivery.write_bytes(b"delivery")

                candidate.unlink()
                candidate_errors: list[dict[str, str]] = []
                art_validate._validate_mgjrpg02_proof_bundle(
                    review, "review", candidate_errors
                )
                self.assertIn(
                    "missing-file", {row["code"] for row in candidate_errors}
                )
                candidate.write_bytes(b"candidate")

                html_path.unlink()
                html_errors: list[dict[str, str]] = []
                art_validate._validate_mgjrpg02_proof_bundle(
                    review, "review", html_errors
                )
                self.assertIn(
                    "missing-file", {row["code"] for row in html_errors}
                )


if __name__ == "__main__":
    unittest.main()
