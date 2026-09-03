from __future__ import annotations

import copy
import json
import sys
import unittest
from pathlib import Path

from jsonschema import Draft202012Validator


PACKAGE = Path(__file__).resolve().parents[1]
ROOT = PACKAGE.parents[1]
sys.path.insert(0, str(PACKAGE))

from builder import _preflight_record, _validate_build_source, _validate_output_policy
from model import SCHEMA_PATH, read_json, record_schema_validator, validate_record_shape


class ProvenanceContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.record = read_json(
            ROOT / "docs" / "source-assets" / "records" / "ame-v02-source.json"
        )

    def test_schema_is_valid_draft_2020_12_and_current_strict_record_passes(self) -> None:
        schema = json.loads(SCHEMA_PATH.read_text(encoding="utf-8-sig"))
        Draft202012Validator.check_schema(schema)
        self.assertEqual(list(record_schema_validator().iter_errors(self.record)), [])
        self.assertEqual(validate_record_shape(self.record, "candidate"), [])

    def test_schema_rejects_extra_properties_and_out_of_range_geometry(self) -> None:
        invalid = copy.deepcopy(self.record)
        invalid["inventedProvenance"] = True
        invalid["geometry"]["pivot"] = [1.2, 0.9]
        messages = "\n".join(validate_record_shape(invalid, "invalid"))
        self.assertIn("Additional properties are not allowed", messages)
        self.assertIn("greater than the maximum", messages)

    def test_outer_contour_recipe_cannot_fall_back_to_builder_defaults(self) -> None:
        invalid = copy.deepcopy(self.record)
        del invalid["build"]["backgroundExtraction"]["barrierMaximumLuminance"]
        messages = "\n".join(validate_record_shape(invalid, "invalid"))
        self.assertIn("barrierMaximumLuminance", messages)
        with self.assertRaisesRegex(ValueError, "Record/schema preflight failed"):
            _preflight_record(
                ROOT / "docs" / "source-assets" / "records" / "ame-v02-source.json",
                invalid,
            )

        missing_extraction = copy.deepcopy(self.record)
        del missing_extraction["build"]["backgroundExtraction"]
        self.assertIn(
            "backgroundExtraction",
            "\n".join(validate_record_shape(missing_extraction, "invalid")),
        )

        ignored_knob = copy.deepcopy(self.record)
        ignored_knob["build"]["backgroundExtraction"]["maximumChroma"] = 20
        self.assertIn(
            "should not be valid",
            "\n".join(validate_record_shape(ignored_knob, "invalid")),
        )

        mislabeled_recipe = copy.deepcopy(self.record)
        mislabeled_recipe["build"]["backgroundExtraction"][
            "barrierMaximumLuminance"
        ] = 179
        with self.assertRaisesRegex(ValueError, "recipeId.*encodes"):
            _preflight_record(
                ROOT / "docs" / "source-assets" / "records" / "ame-v02-source.json",
                mislabeled_recipe,
            )

    def test_approved_status_requires_named_evidence_and_reviewed_rights(self) -> None:
        invalid = copy.deepcopy(self.record)
        invalid["approvalStatus"] = "approved"
        messages = "\n".join(validate_record_shape(invalid, "invalid"))
        self.assertIn("approvalEvidence", messages)
        self.assertIn("reviewed", messages)

    def test_design_approved_status_requires_separate_design_evidence(self) -> None:
        invalid = copy.deepcopy(self.record)
        del invalid["designApprovalEvidence"]
        messages = "\n".join(validate_record_shape(invalid, "invalid"))
        self.assertIn("designApprovalEvidence", messages)

    def test_design_approved_status_requires_exact_prompt_provenance(self) -> None:
        invalid = copy.deepcopy(self.record)
        invalid["promptEvidence"]["fidelity"] = "concise"
        del invalid["promptEvidence"]["promptFile"]
        messages = "\n".join(validate_record_shape(invalid, "invalid"))
        self.assertIn("'exact' was expected", messages)
        self.assertIn("is not valid under any of the given schemas", messages)

    def test_approved_status_requires_exact_prompt_fidelity(self) -> None:
        invalid = copy.deepcopy(self.record)
        invalid["approvalStatus"] = "approved"
        invalid["promptEvidence"]["fidelity"] = "concise"
        invalid["approvalEvidence"] = {
            "approvedBy": "Human reviewer",
            "approvedAt": "2026-09-03T00:00:00+01:00",
            "scope": "runtime-publish",
            "evidencePath": "docs/ART_BIBLE.md",
            "evidenceSha256": "0" * 64,
        }
        invalid["rights"] = {
            **invalid["rights"],
            "licenceStatus": "reviewed",
            "reviewedBy": "Rights reviewer",
        }
        messages = "\n".join(validate_record_shape(invalid, "invalid"))
        self.assertIn("'exact' was expected", messages)
        with self.assertRaisesRegex(ValueError, "exact prompt fidelity"):
            _validate_output_policy(
                invalid,
                ROOT / "public" / "assets" / "candidate.webp",
            )

    def test_build_preflight_rejects_tampered_immutable_source_hash(self) -> None:
        invalid = copy.deepcopy(self.record)
        invalid["sources"][0]["sha256"] = "0" * 64
        with self.assertRaisesRegex(ValueError, "immutable build source SHA-256"):
            _validate_build_source(invalid, invalid["build"])

    def test_design_approved_candidate_can_write_proofs_but_not_runtime(self) -> None:
        self.assertEqual(self.record["approvalStatus"], "design-approved")
        self.assertEqual(
            self.record["designApprovalEvidence"]["scope"],
            "identity-and-construction",
        )
        _validate_output_policy(
            self.record,
            ROOT / "artifacts" / "art-proofs" / "unit" / "candidate.webp",
        )
        with self.assertRaisesRegex(ValueError, "approvalStatus=approved"):
            _validate_output_policy(
                self.record,
                ROOT / "public" / "assets" / "candidate.webp",
            )

    def test_approved_enum_alone_cannot_publish_runtime(self) -> None:
        invalid = copy.deepcopy(self.record)
        invalid["approvalStatus"] = "approved"
        with self.assertRaisesRegex(ValueError, "named Human approval evidence"):
            _validate_output_policy(
                invalid,
                ROOT / "public" / "assets" / "candidate.webp",
            )

    def test_even_approved_art_cannot_publish_outside_explicit_roots(self) -> None:
        invalid = copy.deepcopy(self.record)
        invalid["approvalStatus"] = "approved"
        with self.assertRaisesRegex(ValueError, "restricted to"):
            _validate_output_policy(
                invalid,
                ROOT / "docs" / "source-assets" / "candidate.webp",
            )


if __name__ == "__main__":
    unittest.main()
