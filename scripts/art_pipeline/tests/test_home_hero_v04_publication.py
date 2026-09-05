from __future__ import annotations

import sys
import unittest
from pathlib import Path

from PIL import Image


PACKAGE = Path(__file__).resolve().parents[1]
ROOT = PACKAGE.parents[1]
sys.path.insert(0, str(PACKAGE))

from model import read_json, sha256_file, validate_record_shape


class HomeHeroV04PublicationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.report = read_json(
            ROOT / "docs/source-assets/publication/mgjrpg-02-home-hero-v04-correction-map.json"
        )
        cls.record = read_json(
            ROOT / "docs/source-assets/records/home-hero-splash-mgjrpg02-v04-source.json"
        )

    def test_bounded_transfer_preserves_the_approved_composition(self) -> None:
        transfer = self.report["hornTransfer"]
        self.assertEqual(transfer["changedPixelsOutsideMask"], 0)
        self.assertGreater(transfer["changedPixels"], 0)
        self.assertLess(transfer["changedCanvasFraction"], 0.03)
        self.assertEqual(transfer["maskBoundsLTRB"], [1042, 486, 1311, 688])

    def test_only_the_two_recorded_background_pockets_are_cleared(self) -> None:
        components = self.report["backgroundExtraction"]["enclosedComponents"]
        self.assertEqual([item["seed"] for item in components], [[357, 712], [153, 797]])
        self.assertEqual(sum(item["pixelsCleared"] for item in components), 4914)
        master = ROOT / self.report["entry"]["transparentMaster"]
        with Image.open(master) as opened:
            alpha = opened.convert("RGBA").getchannel("A")
            for item in components:
                self.assertEqual(alpha.getpixel(tuple(item["seed"])), 0)
            # Pale outer-ear fur was lost by the old v03 tolerance. It must stay.
            self.assertEqual(alpha.getpixel((1275, 635)), 255)

    def test_reviewed_v04_is_preserved_and_forward_home_pointer_is_current(self) -> None:
        self.assertEqual(validate_record_shape(self.record, self.record["recordId"]), [])
        self.assertEqual(self.record["runtimeStatus"], "superseded")
        self.assertEqual(self.record["approvalStatus"], "approved")
        self.assertEqual(self.record["artVersion"], 4)
        runtime = ROOT / self.report["entry"]["runtimePath"]
        self.assertTrue(runtime.is_file())
        self.assertEqual(sha256_file(runtime), self.report["entry"]["runtimeSha256"])
        catalogue = (ROOT / "src/generated/mgjrpg02Art.ts").read_text(encoding="utf-8")
        self.assertIn("home-hero-splash-v05-front-door-1024-r01.webp", catalogue)
        self.assertIn("home-hero-splash-mgjrpg02-v05-source", catalogue)
        self.assertIn("home-hero-splash-v05-front-door-1024-r01.png", catalogue)

    def test_previous_runtime_remains_a_rollback_hold(self) -> None:
        previous = read_json(
            ROOT / "docs/source-assets/records/home-hero-splash-mgjrpg02-v03-source.json"
        )
        self.assertEqual(previous["runtimeStatus"], "superseded")
        ledger = read_json(ROOT / "docs/source-assets/retirement/asset-retirement-ledger.json")
        matches = [
            item for item in ledger["entries"]
            if item["entryId"] == "post-v0201-home-hero-v03-prior-runtime"
        ]
        self.assertEqual(len(matches), 1)
        self.assertEqual(matches[0]["state"], "rollback-hold")
        self.assertFalse(matches[0]["eligibleForPlan12"])


if __name__ == "__main__":
    unittest.main()
