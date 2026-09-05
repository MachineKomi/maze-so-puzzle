"""Exact review authority must survive later metadata regeneration."""
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
import ui_presentation_candidates as publication


class UiPresentationApprovalTests(unittest.TestCase):
    def setUp(self) -> None:
        self.workspace = tempfile.TemporaryDirectory()
        self.root = Path(self.workspace.name)
        self.report = self.root / "docs/source-assets/publication/test-candidates.json"
        self.report.parent.mkdir(parents=True)
        self.report.write_text('{"preparation":"pinned"}\n', encoding="utf-8")
        self.decision_path = self.report.with_name("test-approval.json")
        inventory = publication.read_json(publication.REPORT)
        self.entry = inventory["entries"][0]
        self.record = publication.read_json(publication.RECORD_ROOT / f"{self.entry['candidateRecordId']}.json")
        self.decision = {
            "schema": "maze-ui-presentation-approval/v1", "scope": "runtime-publish",
            "approvedBy": "Test reviewer", "approvedAt": "2026-09-05T00:00:00Z",
            "candidateReportSha256": publication.sha256_file(self.report),
            "entries": [{**{key: self.entry[key] for key in ("id", "path", "sha256", "bytes", "sourceSha256")},
                         "candidateRecordSha256": "a" * 64, "maxEncodedBytes": self.entry["bytes"]}],
        }
        self.patches = patch.multiple(publication, ROOT=self.root, REPORT=self.report, IDS=(self.entry["id"],))
        self.patches.start()

    def tearDown(self) -> None:
        self.patches.stop()
        self.workspace.cleanup()

    def apply(self) -> dict:
        self.decision_path.write_text(json.dumps(self.decision), encoding="utf-8")
        return publication.reviewed_record(copy.deepcopy(self.record), self.entry, candidate_sha256="a" * 64)

    def test_exact_review_promotes_metadata_without_changing_pixels_or_geometry(self) -> None:
        result = self.apply()
        self.assertEqual(result["approvalStatus"], "approved")
        self.assertEqual(result["derivatives"][0]["sha256"], self.record["derivatives"][0]["sha256"])
        self.assertEqual(result["geometry"], self.record["geometry"])
        self.assertEqual(result["approvalEvidence"]["evidenceSha256"], publication.sha256_file(self.decision_path))

    def test_changed_preparation_report_invalidates_approval(self) -> None:
        self.report.write_text('{"preparation":"changed"}', encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "candidate evidence"):
            self.apply()

    def test_changed_candidate_provenance_invalidates_regeneration(self) -> None:
        self.decision["entries"][0]["candidateRecordSha256"] = "b" * 64
        with self.assertRaisesRegex(ValueError, "provenance hash"):
            self.apply()

    def test_wrong_source_or_output_is_not_authorized(self) -> None:
        for key in ("sourceSha256", "sha256", "path"):
            with self.subTest(key=key):
                previous = self.decision["entries"][0][key]
                self.decision["entries"][0][key] = "wrong"
                with self.assertRaisesRegex(ValueError, "mismatch"):
                    self.apply()
                self.decision["entries"][0][key] = previous

    def test_duplicate_or_missing_identity_fails(self) -> None:
        self.decision["entries"].append(copy.deepcopy(self.decision["entries"][0]))
        with self.assertRaisesRegex(ValueError, "identity set"):
            self.apply()

    def test_undersized_ceiling_fails(self) -> None:
        self.decision["entries"][0]["maxEncodedBytes"] = self.entry["bytes"] - 1
        with self.assertRaisesRegex(ValueError, "ceiling"):
            self.apply()
