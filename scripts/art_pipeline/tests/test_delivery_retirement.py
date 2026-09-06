from __future__ import annotations

import copy
import json
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

PACKAGE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PACKAGE))

from model import ROOT, canonical_generation_batch_paths, canonical_record_paths, read_json
from retirement import (
    EARLY_STATE, RECEIPT_NAME, RETIREMENT_ROOT, derivative_matches,
    load_retirements, previous_delivery_metadata,
)


class DeliveryRetirementTests(unittest.TestCase):
    def setUp(self):
        self.receipt = read_json(ROOT / RETIREMENT_ROOT / RECEIPT_NAME)
        self.ledger = read_json(ROOT / RETIREMENT_ROOT / "asset-retirement-ledger.json")

    def mocked_read(self, path):
        if path.name == RECEIPT_NAME:
            return self.receipt
        if path.name == "asset-retirement-ledger.json":
            return self.ledger
        return read_json(path)

    def test_exact_join_and_absence(self):
        rows = load_retirements()
        self.assertEqual(len(rows), 30)
        self.assertEqual(sum(row["bytes"] for row in rows.values()), 9488260)
        for path in rows:
            self.assertFalse((ROOT / path).exists())

    def test_backup_and_deletion_authority_required(self):
        for key in ("humanConfirmedWholeRepoBackup", "directDeletionApproved"):
            with self.subTest(key=key):
                self.receipt["authorization"][key] = False
                with patch("retirement.read_json", self.mocked_read), self.assertRaises(ValueError):
                    load_retirements()
                self.receipt["authorization"][key] = True

    def test_ledger_without_exact_receipt_is_rejected(self):
        self.receipt["entries"].pop()
        with patch("retirement.read_json", self.mocked_read), self.assertRaises(ValueError):
            load_retirements()

    def test_wrong_hash_and_duplicate_are_rejected(self):
        original = copy.deepcopy(self.receipt)
        self.receipt["entries"][0]["sha256"] = "0" * 64
        with patch("retirement.read_json", self.mocked_read), self.assertRaises(ValueError):
            load_retirements()
        self.receipt = original
        self.receipt["entries"].append(self.receipt["entries"][0])
        with patch("retirement.read_json", self.mocked_read), self.assertRaises(ValueError):
            load_retirements()

    def test_active_and_dormant_cannot_use_retired_exemption(self):
        tombstones = load_retirements()
        path, row = next(iter(tombstones.items()))
        derivative = {key: row[key] for key in (
            "path", "sha256", "bytes", "width", "height", "decodedBytesUpperBound"
        )}
        derivative["runtimeStatus"] = "superseded"
        for status in ("active", "dormant", "deprecated"):
            self.assertFalse(derivative_matches({"recordId": row["recordId"], "runtimeStatus": status}, derivative, tombstones))
        record = {"recordId": row["recordId"], "runtimeStatus": "superseded"}
        self.assertTrue(derivative_matches(record, derivative, tombstones))
        for status in ("active", "dormant", "deprecated"):
            derivative["runtimeStatus"] = status
            self.assertFalse(derivative_matches(record, derivative, tombstones))
        derivative["runtimeStatus"] = "superseded"
        derivative["bytes"] += 1
        self.assertFalse(derivative_matches(record, derivative, tombstones))

    def test_retired_bytes_cannot_silently_reappear_in_delivery(self):
        with patch.object(Path, "exists", return_value=True):
            with self.assertRaisesRegex(ValueError, "Retired delivery bytes reappeared"):
                load_retirements()

    def test_unknown_missing_file_is_not_waived(self):
        with self.assertRaises(FileNotFoundError):
            previous_delivery_metadata(ROOT / "public/assets/not-a-retired-asset.png", load_retirements())

    def test_no_runtime_literals_or_current_build_sources_retired(self):
        tombstones = load_retirements()
        for source in (ROOT / "src").rglob("*"):
            if source.is_file() and source.suffix in {".ts", ".tsx", ".css", ".json"}:
                text = source.read_text(encoding="utf-8")
                for path in tombstones:
                    self.assertNotIn(Path(path).name, text, str(source))
        for path in canonical_record_paths():
            record = read_json(path)
            for source in record.get("sources", []):
                self.assertNotIn(source["path"], tombstones, str(path))
            self.assertNotIn(record.get("build", {}).get("sourcePath"), tombstones, str(path))

    def test_final_plan12_gates_are_not_fabricated(self):
        retired = [row for row in self.ledger["entries"] if row["state"] == EARLY_STATE]
        self.assertEqual(len(retired), 30)
        self.assertTrue(all(not row["eligibleForPlan12"] for row in retired))
        self.assertTrue(all(not row["retirementEvidence"]["tauriOfflinePackagePassed"] for row in retired))

    def test_generation_batch_reference_registry_inputs_are_retained(self):
        retired = load_retirements()
        for path in canonical_generation_batch_paths():
            registry = json.dumps(read_json(path).get("referenceRegistry", {}))
            for asset in retired:
                self.assertNotIn(asset, registry, str(path))


if __name__ == "__main__":
    unittest.main()
