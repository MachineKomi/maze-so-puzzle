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
        self.assertEqual(len(owners), 127)
        owner_counts = {
            owner: sum(values == [owner] for values in owners.values())
            for owner in {
                "batch:mgjrpg-02-batch-01",
                "batch:mgjrpg-02-batch-01-r02",
                "batch:mgjrpg-02-batch-02",
                "batch:mgjrpg-02-batch-03-friends",
                "batch:mgjrpg-02-batch-04-mythic-friends",
                "batch:mgjrpg-02-batch-05-weapons",
            }
        }
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-01"], 41)
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-01-r02"], 6)
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-02"], 16)
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-03-friends"], 38)
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-04-mythic-friends"], 16)
        self.assertEqual(owner_counts["batch:mgjrpg-02-batch-05-weapons"], 10)
        self.assertEqual(
            [warning["code"] for warning in warnings],
            [
                "generation-batch-pending",
                "generation-batch-pending",
                "generation-batch-pending",
                "generation-batch-pending",
            ],
        )


if __name__ == "__main__":
    unittest.main()
