from __future__ import annotations

import copy
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch


PACKAGE = Path(__file__).resolve().parents[1]
ROOT = PACKAGE.parents[1]
sys.path.insert(0, str(PACKAGE))

import builder
import model
import validate
from builder import _validate_output_policy
from model import (
    read_json,
    sha256_file,
    validate_recipe_shape,
    validate_record_shape,
    validate_review_shape,
    validate_rights_review_shape,
)


def _recipe() -> dict[str, object]:
    return read_json(ROOT / "docs" / "source-assets" / "recipes" / "mgjrpg-02.json")


class Mgjrpg02RecordContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.v1_record = read_json(
            ROOT / "docs" / "source-assets" / "records" / "ame-v02-source.json"
        )

    def _v2_record(self) -> dict[str, object]:
        record = copy.deepcopy(self.v1_record)
        record["schemaVersion"] = 2
        record["validationProfile"] = "strict-v2"
        record["recipeVersion"] = "mgjrpg-02"
        record["recipeEvidence"] = {
            "recipeId": "mgjrpg-02",
            "path": "docs/source-assets/recipes/mgjrpg-02.json",
            "sha256": "1" * 64,
        }
        record["geometry"]["eyeLine"] = 0.28
        record["geometry"]["groundLine"] = 0.90
        record["generationRuns"] = [
            {
                "runId": "ame-v02-rendering-v01",
                "generator": "OpenAI ImageGen",
                "model": "not-disclosed-by-tool",
                "executedAt": "2026-09-03T12:00:00+01:00",
                "prompt": {
                    "path": "docs/source-assets/calibrations/mgjrpg-02/v01/PROMPTS.md",
                    "sha256": "2" * 64,
                },
                "references": [
                    {
                        "order": 1,
                        "role": "identity-authority",
                        "authorityKind": "immutable-generator-original",
                        "path": "docs/source-assets/characters/ame/v02/ame-v02-candidate-c-generator-original.png",
                        "sha256": "3" * 64,
                    }
                ],
                "outputs": [
                    {
                        "outputId": "exec-unit.png",
                        "path": "docs/source-assets/calibrations/mgjrpg-02/v01/unit.png",
                        "sha256": "4" * 64,
                        "bytes": 1,
                        "disposition": "selected",
                        "reason": "Contract-only unit fixture.",
                    }
                ],
                "lineage": {
                    "editOfEdit": False,
                    "identityAuthorityEligible": True,
                    "renderingAuthorityEligible": False,
                },
                "notes": "Contract-only unit fixture.",
            }
        ]
        selected_output = record["generationRuns"][0]["outputs"][0]
        record["sources"].append(
            {
                "path": selected_output["path"],
                "sha256": selected_output["sha256"],
                "bytes": selected_output["bytes"],
                "relationship": "selected-generator-original",
                "evidence": "Contract-only unit fixture.",
            }
        )
        record["build"]["sourcePath"] = selected_output["path"]
        record["renderingContract"] = {
            "profileId": "storybook-local-contour-v1",
            "recipeId": "mgjrpg-02",
            "treatmentClass": "character-contour",
            "authoredContour": "material-local-color-aware",
            "extractionRole": "alpha-matte-only",
            "stickerCutline": "forbidden",
            "canaryReview": {
                "reviewId": "mgjrpg-02-canary-v01",
                "path": "docs/source-assets/reviews/mgjrpg-02-canary-v01.json",
                "sha256": "5" * 64,
            },
        }
        return record

    def test_all_existing_schema_v1_records_remain_valid(self) -> None:
        for path in sorted((ROOT / "docs" / "source-assets" / "records").glob("*.json")):
            record = read_json(path)
            if record.get("schemaVersion") == 1:
                self.assertEqual(validate_record_shape(record, path.name), [])

    def test_strict_v2_requires_complete_recipe_run_and_rendering_contract(self) -> None:
        record = self._v2_record()
        self.assertEqual(validate_record_shape(record, "v2"), [])
        del record["renderingContract"]
        self.assertIn("renderingContract", "\n".join(validate_record_shape(record, "v2")))

    def test_generation_reference_order_is_exact_and_stable(self) -> None:
        record = self._v2_record()
        record["generationRuns"][0]["references"][0]["order"] = 2
        messages = "\n".join(validate_record_shape(record, "v2"))
        self.assertIn("orders must be exactly [1]", messages)

    def test_generation_reference_role_and_authority_are_closed_vocabularies(self) -> None:
        record = self._v2_record()
        record["generationRuns"][0]["references"][0]["role"] = "whatever-seems-right"
        messages = "\n".join(validate_record_shape(record, "v2"))
        self.assertIn("is not one of", messages)

        record = self._v2_record()
        reference = record["generationRuns"][0]["references"][0]
        reference["authorityKind"] = "runtime-comparison"
        reference["path"] = "public/assets/ame.png"
        messages = "\n".join(validate_record_shape(record, "v2"))
        self.assertIn("comparison evidence as an authority", messages)

    def test_generation_lineage_rejects_edit_of_edit(self) -> None:
        record = self._v2_record()
        record["generationRuns"][0]["lineage"]["editOfEdit"] = True
        messages = "\n".join(validate_record_shape(record, "v2"))
        self.assertIn("False was expected", messages)

    def test_family_selects_treatment_and_terrain_cannot_claim_actor_outline(self) -> None:
        record = self._v2_record()
        record["family"] = "terrain"
        messages = "\n".join(validate_record_shape(record, "v2"))
        self.assertIn("terrain-boundary", messages)

        record["renderingContract"] = {
            "profileId": "storybook-local-contour-v1",
            "recipeId": "mgjrpg-02",
            "treatmentClass": "terrain-boundary",
            "authoredBoundary": "material-local-color-aware",
            "extractionRole": "not-applicable",
            "stickerCutline": "forbidden",
            "enclosingContour": "forbidden",
            "canaryReview": {
                "reviewId": "mgjrpg-02-canary-v01",
                "path": "docs/source-assets/reviews/mgjrpg-02-canary-v01.json",
                "sha256": "5" * 64,
            },
        }
        self.assertEqual(validate_record_shape(record, "v2"), [])

    def test_extraction_cannot_masquerade_as_authored_contour(self) -> None:
        record = self._v2_record()
        record["build"]["backgroundExtraction"]["authoredContour"] = (
            "material-local-color-aware"
        )
        messages = "\n".join(validate_record_shape(record, "v2"))
        self.assertIn("Additional properties are not allowed", messages)

    def test_strict_v2_build_uses_selected_immutable_generator_output(self) -> None:
        record = self._v2_record()
        selected_path = record["generationRuns"][0]["outputs"][0]["path"]
        record["build"]["sourcePath"] = record["sources"][0]["path"]
        messages = "\n".join(validate_record_shape(record, "v2"))
        self.assertIn("build.sourcePath must equal", messages)
        record["build"]["sourcePath"] = selected_path
        self.assertEqual(validate_record_shape(record, "v2"), [])

    def test_recipe_and_review_contracts_allow_additive_score_evidence(self) -> None:
        recipe = _recipe()
        recipe["materialTokens"] = {"hair": "warm-plum"}
        self.assertEqual(validate_recipe_shape(recipe, "recipe"), [])
        review = {
            "schema": "maze-art-canary-review/v1",
            "reviewId": "mgjrpg-02-canary-v01",
            "recipeId": "mgjrpg-02",
            "recipePath": "docs/source-assets/recipes/mgjrpg-02.json",
            "recipeSha256": "a" * 64,
            "scope": "global-runtime-publish-gate",
            "status": "pending-human",
            "evidence": [
                {"path": "artifacts/art-proofs/unit.png", "sha256": "b" * 64, "bytes": 1}
            ],
            "decision": "Awaiting explicit Human rendering approval.",
            "canaryRoster": ["ame"],
            "scorecard": {"recognition": 5},
        }
        self.assertEqual(validate_review_shape(review, "review"), [])

    def test_rights_provenance_review_is_validated_without_canary_fields(self) -> None:
        review = {
            "schema": "maze-art-rights-provenance-review/v1",
            "reviewId": "mgjrpg-02-rights-provenance-v01",
            "reviewedAt": "2026-09-04T00:26:48.234Z",
            "reviewedBy": "Codex Plan 03 provenance audit",
            "licenceStatus": "reviewed",
            "scope": "Approved immutable sources.",
            "evidence": {
                "generationProvider": "Recorded provider.",
                "promptOwnership": "Project-authored prompts.",
                "referenceBoundary": "Project sources only.",
                "forbiddenRequests": "No prohibited imitation request.",
                "humanAuthority": "Human publication direction.",
            },
            "conclusion": "Technically reviewed.",
            "limitations": "Not legal advice.",
            "selectedSourceCount": 144,
        }
        self.assertEqual(validate_rights_review_shape(review, "rights"), [])
        self.assertEqual(validate_review_shape(review, "rights"), [])
        review["selectedSourceCount"] = 0
        self.assertIn("positive integer", "\n".join(validate_review_shape(review, "rights")))

    def test_catalogue_parser_accepts_generated_catalogue_without_legacy_lock_helper(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            catalogue = Path(directory) / "artCatalog.ts"
            catalogue.write_text(
                'const item = { sourceRecordId: "goal-v01-source" };\n'
                'const generated = MGJRPG02_ART["door-blue-star"];\n',
                encoding="utf-8",
            )
            self.assertEqual(validate._catalog_source_record_ids(catalogue), ["goal-v01-source"])


class Mgjrpg02RuntimeGateTests(unittest.TestCase):
    def test_pending_global_review_blocks_runtime_then_approved_review_allows_it(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            recipe_path = root / "docs/source-assets/recipes/mgjrpg-02.json"
            review_path = root / "docs/source-assets/reviews/mgjrpg-02-canary-v01.json"
            approval_path = root / "docs/approval.md"
            runtime_root = root / "public/assets"
            recipe_path.parent.mkdir(parents=True)
            review_path.parent.mkdir(parents=True)
            approval_path.parent.mkdir(parents=True, exist_ok=True)
            runtime_root.mkdir(parents=True)
            candidate_recipe = _recipe()
            candidate_recipe["status"] = "candidate"
            recipe_path.write_text(json.dumps(candidate_recipe), encoding="utf-8")
            approval_path.write_text("approved", encoding="utf-8")
            review = {
                "schema": "maze-art-canary-review/v1",
                "reviewId": "mgjrpg-02-canary-v01",
                "recipeId": "mgjrpg-02",
                "recipePath": "docs/source-assets/recipes/mgjrpg-02.json",
                "recipeSha256": sha256_file(recipe_path),
                "scope": "global-runtime-publish-gate",
                "status": "pending-human",
                "evidence": [
                    {
                        "path": "docs/approval.md",
                        "sha256": sha256_file(approval_path),
                        "bytes": approval_path.stat().st_size,
                    }
                ],
                "decision": "Awaiting explicit Human rendering approval.",
            }
            review_path.write_text(json.dumps(review), encoding="utf-8")
            record = {
                "recordId": "unit-v02-source",
                "schemaVersion": 2,
                "recipeVersion": "mgjrpg-02",
                "approvalStatus": "approved",
                "promptEvidence": {"fidelity": "exact", "exactPrompt": "unit"},
                "approvalEvidence": {
                    "approvedBy": "Unit reviewer",
                    "scope": "runtime-publish",
                    "evidencePath": "docs/approval.md",
                    "evidenceSha256": sha256_file(approval_path),
                },
                "rights": {"licenceStatus": "reviewed", "reviewedBy": "Unit rights"},
                "recipeEvidence": {
                    "recipeId": "mgjrpg-02",
                    "path": "docs/source-assets/recipes/mgjrpg-02.json",
                    "sha256": sha256_file(recipe_path),
                },
                "renderingContract": {
                    "recipeId": "mgjrpg-02",
                    "canaryReview": {
                        "reviewId": "mgjrpg-02-canary-v01",
                        "path": "docs/source-assets/reviews/mgjrpg-02-canary-v01.json",
                        "sha256": sha256_file(review_path),
                    },
                },
            }
            patches = (
                patch.object(builder, "ROOT", root),
                patch.object(builder, "RECIPE_ROOT", recipe_path.parent),
                patch.object(builder, "REVIEW_ROOT", review_path.parent),
                patch.object(builder, "RUNTIME_ROOT", runtime_root),
                patch.object(builder, "DESKTOP_RUNTIME_ROOTS", ()),
                patch.object(model, "ROOT", root),
            )
            with patches[0], patches[1], patches[2], patches[3], patches[4], patches[5]:
                with self.assertRaisesRegex(ValueError, "requires global canary review status=approved"):
                    _validate_output_policy(record, runtime_root / "unit.webp")

                review["status"] = "approved"
                review["reviewedBy"] = "Human reviewer"
                review["reviewedAt"] = "2026-09-03T13:00:00+01:00"
                review["decision"] = "Approved for runtime production."
                review_path.write_text(json.dumps(review), encoding="utf-8")
                record["renderingContract"]["canaryReview"]["sha256"] = sha256_file(review_path)

                with self.assertRaisesRegex(ValueError, "authored recipe status=approved"):
                    _validate_output_policy(record, runtime_root / "unit.webp")

                recipe = _recipe()
                recipe["status"] = "approved"
                recipe_path.write_text(json.dumps(recipe), encoding="utf-8")
                record["recipeEvidence"]["sha256"] = sha256_file(recipe_path)
                review["recipeSha256"] = sha256_file(recipe_path)
                review_path.write_text(json.dumps(review), encoding="utf-8")
                record["renderingContract"]["canaryReview"]["sha256"] = sha256_file(review_path)
                _validate_output_policy(record, runtime_root / "unit.webp")


if __name__ == "__main__":
    unittest.main()
