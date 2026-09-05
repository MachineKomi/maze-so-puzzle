"""Candidate delivery must preserve approved sources and semantic registration."""
from __future__ import annotations

import sys
import unittest
from collections import Counter
from pathlib import Path

PACKAGE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PACKAGE))
import ui_actor_presentation_candidates as actors
from model import sha256_file, validate_record_shape


class UiActorPresentationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.report = actors.read_json(actors.REPORT)
        cls.entries = {entry["id"]: entry for entry in cls.report["entries"]}

    def test_current_catalogue_coverage_does_not_include_dormant_enemies(self) -> None:
        self.assertEqual(Counter(entry["family"] for entry in self.entries.values()), {"friend": 32, "enemy": 12})
        self.assertEqual(set(self.entries), {row["stableId"] for _, row, _ in actors.selection()})
        self.assertNotIn("succubus", self.entries)
        self.assertIn("green-tea-skeleton", self.entries)
        self.assertEqual(self.entries["goblin"]["sourceRecordId"], "goblin-mgjrpg02-v02-source")

    def test_candidate_hashes_provenance_and_native_source_resolution(self) -> None:
        for entry in self.entries.values():
            with self.subTest(identity=entry["id"]):
                self.assertGreaterEqual(min(entry["sourceSize"]), 512)
                self.assertTrue(entry["opticalReproduced"])
                for path_key, hash_key in (("path", "sha256"), ("sourcePath", "sourceSha256")):
                    self.assertEqual(sha256_file(actors.ROOT / entry[path_key]), entry[hash_key])
                record = actors.read_json(actors.RECORD_ROOT / f"{entry['candidateRecordId']}.json")
                self.assertEqual(validate_record_shape(record, record["recordId"]), [])
                self.assertEqual(record["geometry"], entry["geometry"])
                self.assertEqual(record["derivatives"][0]["loadingPhase"], "visible-contextual-presentation-only")

    def test_floating_friends_and_mimic_do_not_become_grounded_actors(self) -> None:
        floating = {identity for identity, entry in self.entries.items() if entry["geometry"]["class"] == "floating-actor"}
        self.assertEqual(floating, {"moon-bat", "cloud-gremlin", "pitter-patter-parasol", "lanternling",
            "tessera-dolphin", "mallowmusk-aroma-wisp", "breezeling-sylph", "tidecurl-hippocamp"})
        for identity in floating:
            self.assertEqual(len(self.entries[identity]["geometry"]["floatCenter"]), 2)
        mimic = self.entries["candy-mimic"]["geometry"]
        self.assertEqual(mimic["class"], "item")
        self.assertEqual(mimic["stateFamilyId"], "candy-mimic")
        self.assertEqual(len(mimic["visualCenter"]), 2)
        self.assertEqual(mimic["stateAnchorBox"], [0.0703125, 0.05859375, 0.859375, 0.8828125])

    def test_every_media_byte_is_accounted_and_inherited_overruns_are_explicit(self) -> None:
        self.assertEqual(self.report["runtimeBytes"], sum(entry["bytes"] for entry in self.entries.values()))
        self.assertEqual(self.report["decodedBytesUpperBound"], 44 * 512 * 512 * 4)
        for entry in self.entries.values():
            self.assertEqual(bool(entry["validationErrors"]), entry["bytes"] > entry["inheritedPerFileCeiling"])


if __name__ == "__main__":
    unittest.main()
