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

    def test_repository_validator_hashes_every_batch_output_and_claims_sources(self) -> None:
        errors: list[dict[str, str]] = []
        warnings: list[dict[str, str]] = []
        owners: dict[str, list[str]] = defaultdict(list)
        _validate_generation_batch_documents(errors, warnings, owners)
        self.assertEqual(errors, [])
        self.assertEqual(len(owners), 232)
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
            ],
        )

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
