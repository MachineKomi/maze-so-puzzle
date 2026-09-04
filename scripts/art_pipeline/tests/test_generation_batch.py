from __future__ import annotations

import copy
import sys
import unittest
from collections import defaultdict
from pathlib import Path


PACKAGE = Path(__file__).resolve().parents[1]
ROOT = PACKAGE.parents[1]
sys.path.insert(0, str(PACKAGE))

from model import read_json, validate_generation_batch_shape
from validate import _validate_generation_batch_documents


BATCH_PATH = (
    ROOT
    / "docs"
    / "source-assets"
    / "production"
    / "mgjrpg-02"
    / "batch-01"
    / "run-record.json"
)

BATCH_22_PATH = (
    ROOT
    / "docs"
    / "source-assets"
    / "production"
    / "mgjrpg-02"
    / "batch-22-achievement-stickers"
    / "run-record.json"
)


class GenerationBatchProvenanceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.batch = read_json(BATCH_PATH)

    def test_batch_record_binds_all_failed_and_selected_generator_originals(self) -> None:
        self.assertEqual(validate_generation_batch_shape(self.batch, "batch"), [])
        runs = self.batch["runs"]
        self.assertEqual(len(runs), 27)
        self.assertEqual(
            sum(run["disposition"]["status"] == "rejected-background-invalid" for run in runs),
            10,
        )
        self.assertEqual(
            sum(run["disposition"]["status"] == "pending-human-batch-review" for run in runs),
            17,
        )
        self.assertEqual(len({run["output"]["path"] for run in runs}), 27)
        self.assertEqual(len({run["output"]["outputId"] for run in runs}), 27)

    def test_shape_rejects_count_drift_unknown_references_and_edit_of_edit(self) -> None:
        invalid = copy.deepcopy(self.batch)
        invalid["counts"]["generatorOriginalEncodedBytes"] -= 1
        invalid["runs"][0]["orderedReferences"][0]["referenceId"] = "unknown"
        invalid["runs"][0]["lineage"]["previousBatchOutputUsed"] = True
        messages = "\n".join(validate_generation_batch_shape(invalid, "invalid"))
        self.assertIn("counts.generatorOriginalEncodedBytes", messages)
        self.assertIn("unknown referenceId", messages)
        self.assertIn("previous Batch output may not be used", messages)

    def test_achievement_sticker_batch_records_every_live_reward_without_runtime_changes(self) -> None:
        batch = read_json(BATCH_22_PATH)
        self.assertEqual(validate_generation_batch_shape(batch, "batch-22"), [])
        self.assertEqual(batch["batchId"], "mgjrpg-02-batch-22-achievement-stickers")
        self.assertEqual(batch["status"], "pending-human-review")
        self.assertEqual(batch["counts"]["runCount"], 17)
        self.assertEqual(batch["counts"]["pendingHumanCandidateCount"], 15)
        self.assertEqual(batch["counts"]["artDirectorRejectedSourceCount"], 2)
        self.assertEqual(
            {run["disposition"]["status"] for run in batch["runs"]},
            {"pending-human-batch-review", "art-director-rejected-source"},
        )
        self.assertEqual(len({run["output"]["path"] for run in batch["runs"]}), 17)
        self.assertEqual(len({run["output"]["outputId"] for run in batch["runs"]}), 17)
        for run in batch["runs"]:
            semantic_reference = run["orderedReferences"][0]["referenceId"]
            self.assertEqual(semantic_reference, f"legacy-{run['identityId']}")
            self.assertTrue(
                batch["referenceRegistry"][semantic_reference]["path"].startswith(
                    "public/assets/"
                )
            )
        self.assertEqual(
            {run["identityId"] for run in batch["runs"]},
            {
                "reward-trail-sticker",
                "reward-animal-friend-sticker",
                "reward-surprise-sparkle-sticker",
                "reward-helping-paw-medal",
                "reward-rainbow-rescue-medal",
                "reward-golden-guardian-medal",
                "badge-pathfinder",
                "badge-maze-mapper",
                "badge-grand-explorer",
                "badge-surprise-scout",
                "badge-mighty-adventurer",
                "badge-twinkle-toes",
                "badge-bunny-buddy",
                "badge-fox-friend",
                "badge-kitten-pal",
            },
        )
        self.assertEqual(
            {
                reference_id: batch["referenceRegistry"][reference_id]["sha256"]
                for reference_id in {
                    "nav-home-v03",
                    "weapon-moon-wand-v02",
                    "friend-bunny-v02-approved-512",
                    "friend-fox-v02-approved-512",
                    "friend-kitten-v02-approved-512",
                }
            },
            {
                "nav-home-v03": "da31adb0827be0149fdad7e00da102d2e248c16a8f809a0e453a0a2e2797204c",
                "weapon-moon-wand-v02": "c1fc091c86c71c42487ed7037cb016ffe763bf09a29557d7a810c98c95ac87dc",
                "friend-bunny-v02-approved-512": "7553bae834919486d19ea5c0ede5a0ca27ab766d1efc72b05fa16615622338b9",
                "friend-fox-v02-approved-512": "5bee37d8c36596fa8d3d25a056b68c64d3b71672e180c27940441e3cf256f74d",
                "friend-kitten-v02-approved-512": "1af17906a7c37a67a65d95c0277485a84c9ca0faf956ffbd89f06d670423343c",
            },
        )
        self.assertTrue(
            all(
                "batch-20-final-coverage" not in reference["path"]
                for run in batch["runs"]
                for reference in (
                    batch["referenceRegistry"][ordered["referenceId"]]
                    for ordered in run["orderedReferences"]
                )
            )
        )
        runs_by_id = {run["runId"]: run for run in batch["runs"]}
        self.assertEqual(
            {
                run_id: runs_by_id[run_id]["disposition"]["reasonCode"]
                for run_id in {
                    "batch-22-reward-animal-friend-sticker-v03-a",
                    "batch-22-reward-golden-guardian-medal-v03-a",
                }
            },
            {
                "batch-22-reward-animal-friend-sticker-v03-a": "art-director-rejected-semantic-collision",
                "batch-22-reward-golden-guardian-medal-v03-a": "art-director-rejected-cutline-defect",
            },
        )
        self.assertEqual(
            {
                run_id: runs_by_id[run_id]["disposition"]["status"]
                for run_id in {
                    "batch-22-reward-animal-friend-sticker-v03-b",
                    "batch-22-reward-golden-guardian-medal-v03-b",
                }
            },
            {
                "batch-22-reward-animal-friend-sticker-v03-b": "pending-human-batch-review",
                "batch-22-reward-golden-guardian-medal-v03-b": "pending-human-batch-review",
            },
        )
        self.assertEqual(
            batch["runtimeImpact"],
            {
                "runtimeAssetWrites": 0,
                "cataloguePointerChanges": 0,
                "runtimeEncodedByteDelta": 0,
                "runtimeDecodedByteDelta": 0,
                "web": "none-source-only",
                "tauri": "none-source-only",
                "ipad": "none-source-only",
                "tv": "none-source-only",
            },
        )

    def test_repository_validator_hashes_every_batch_output_and_claims_sources(self) -> None:
        errors: list[dict[str, str]] = []
        warnings: list[dict[str, str]] = []
        owners: dict[str, list[str]] = defaultdict(list)
        _validate_generation_batch_documents(errors, warnings, owners)
        self.assertEqual(errors, [])
        self.assertEqual(len(owners), 265)
        owner_counts = {
            owner: sum(values == [owner] for values in owners.values())
            for owner in {
                "batch:mgjrpg-02-batch-01",
                "batch:mgjrpg-02-batch-01-r02",
                "batch:mgjrpg-02-batch-02",
                "batch:mgjrpg-02-batch-03-friends",
                "batch:mgjrpg-02-batch-04-mythic-friends",
                "batch:mgjrpg-02-batch-05-weapons",
                "batch:mgjrpg-02-batch-06-cages",
                "batch:mgjrpg-02-batch-07-locks-doors",
                "batch:mgjrpg-02-batch-08-enemy-refresh",
                "batch:mgjrpg-02-batch-09-item-refresh",
                "batch:mgjrpg-02-batch-10-environment-canaries",
                "batch:mgjrpg-02-batch-11-environment-outliers",
                "batch:mgjrpg-02-batch-12-enemy-corrections",
                "batch:mgjrpg-02-batch-13-ui-portals-equipment",
                "batch:mgjrpg-02-batch-14-friend-edge-refinements",
                "batch:mgjrpg-02-batch-15-chests-pickups-hazards",
                "batch:mgjrpg-02-batch-16-environment-completion",
                "batch:mgjrpg-02-batch-17-enemy-catalogue-completion",
                "batch:mgjrpg-02-batch-18-hard-leather-work-boots",
                "batch:mgjrpg-02-batch-19-teleporter-symbol-refinements",
                "batch:mgjrpg-02-batch-20-final-coverage",
                "batch:mgjrpg-02-batch-21-front-door-art",
                "batch:mgjrpg-02-batch-22-achievement-stickers",
            }
        }
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-01"], 41)
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-01-r02"], 6)
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-02"], 17)
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-03-friends"], 38)
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-04-mythic-friends"], 16)
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-05-weapons"], 10)
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-06-cages"], 8)
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-07-locks-doors"], 8)
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-08-enemy-refresh"], 4)
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-09-item-refresh"], 3)
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-10-environment-canaries"], 7)
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-11-environment-outliers"], 6)
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-12-enemy-corrections"], 8)
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-13-ui-portals-equipment"], 11)
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-14-friend-edge-refinements"], 15)
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-15-chests-pickups-hazards"], 13)
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-16-environment-completion"], 11)
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-17-enemy-catalogue-completion"], 6)
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-18-hard-leather-work-boots"], 1)
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-19-teleporter-symbol-refinements"], 3)
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-20-final-coverage"], 6)
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-21-front-door-art"], 10)
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-22-achievement-stickers"], 17)
        self.assertEqual(
            [warning["code"] for warning in warnings],
            [
                "generation-batch-pending",
                "generation-batch-pending",
                "generation-batch-pending",
                "generation-batch-pending",
                "generation-batch-pending",
                "generation-batch-pending",
                "generation-batch-pending",
                "generation-batch-pending",
                "generation-batch-pending",
                "generation-batch-pending",
                "generation-batch-pending",
                "generation-batch-pending",
                "generation-batch-pending",
                "generation-batch-pending",
                "generation-batch-pending",
                "generation-batch-pending",
                "generation-batch-pending",
                "generation-batch-pending",
                "generation-batch-pending",
                "generation-batch-pending",
                "generation-batch-pending",
            ],
        )

    def test_final_static_source_coverage_audit_closes_only_named_gaps(self) -> None:
        audit = read_json(
            ROOT
            / "docs"
            / "source-assets"
            / "production"
            / "mgjrpg-02"
            / "batch-20-final-coverage"
            / "coverage-audit.json"
        )
        self.assertEqual(
            {row["id"] for row in audit["gapsFound"]},
            {
                "enemy-jelly-sorcerer",
                "potion",
                "reward-first-star",
                "goal",
                "ame-portrait",
            },
        )
        self.assertIn("Human review of Batch 19 and Batch 20 candidates", audit["remainingWorkIsNotMissingSourceGeneration"])
        self.assertIn("goblin", audit["deliberatelyRetainedWithoutRegeneration"][0]["ids"])

    def test_human_source_review_v05_names_only_recorded_runs(self) -> None:
        decision = read_json(
            ROOT
            / "docs"
            / "source-assets"
            / "calibrations"
            / "mgjrpg-02"
            / "v05"
            / "human-decision.json"
        )
        batches = {}
        for path in (ROOT / "docs" / "source-assets" / "production" / "mgjrpg-02").glob(
            "batch-*/run-record.json"
        ):
            batch = read_json(path)
            batches[batch["batchId"]] = {
                run["runId"]: run for run in batch["runs"]
            }

        approved = set()
        for batch_id, run_ids in decision["approvedByBatch"].items():
            self.assertIn(batch_id, batches)
            for run_id in run_ids:
                self.assertIn(run_id, batches[batch_id])
                self.assertRegex(batches[batch_id][run_id]["output"]["sha256"], r"^[0-9a-f]{64}$")
                self.assertNotIn(run_id, approved)
                approved.add(run_id)

        rejected = {row["runId"] for row in decision["rejected"]}
        self.assertTrue(rejected.isdisjoint(approved))
        for row in decision["rejected"]:
            self.assertIn(row["batchId"], batches)
            self.assertIn(row["runId"], batches[row["batchId"]])

        taxonomy = decision["taxonomyCorrection"]
        self.assertIn(taxonomy["runId"], approved)
        self.assertEqual(taxonomy["to"], "rescue-and-collect friend")
        self.assertEqual(taxonomy["pixelChange"], "none")

        pending = set(decision["pendingNextReview"])
        self.assertEqual(
            pending,
            {
                "batch-19-clover-v04",
                "batch-19-spade-bloom-v02",
            },
        )


if __name__ == "__main__":
    unittest.main()
