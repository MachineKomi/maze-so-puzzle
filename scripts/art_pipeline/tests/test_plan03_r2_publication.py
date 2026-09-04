from __future__ import annotations

import sys
import unittest
from pathlib import Path

from PIL import Image


PACKAGE = Path(__file__).resolve().parents[1]
ROOT = PACKAGE.parents[1]
sys.path.insert(0, str(PACKAGE))

from model import read_json, sha256_file, validate_record_shape


class Plan03R2PublicationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.map_path = ROOT / "docs/source-assets/publication/mgjrpg-02-plan03-r2-home-composition-map.json"
        cls.decision_path = ROOT / "docs/source-assets/calibrations/mgjrpg-02/v10/human-decision.json"
        cls.mapping = read_json(cls.map_path)

    def test_forward_decision_binds_only_the_two_approved_sources(self) -> None:
        decision = read_json(self.decision_path)
        self.assertEqual(decision["status"], "approved-for-runtime-publication")
        self.assertEqual(len(decision["approvedSources"]), 2)
        self.assertEqual(
            {source["runId"] for source in decision["approvedSources"]},
            {
                "batch-26-home-splash-v02-larger-tea-skeleton",
                "batch-24-game-logo-v03-candidate-b-cleanup-edit-02",
            },
        )
        for source in decision["approvedSources"]:
            with self.subTest(source=source["id"]):
                path = ROOT / source["path"]
                self.assertTrue(path.is_file())
                self.assertEqual(sha256_file(path), source["sha256"])
                self.assertEqual(path.stat().st_size, source["bytes"])

    def test_publication_map_binds_three_active_versioned_derivatives(self) -> None:
        rows = self.mapping["entries"]
        self.assertEqual(len(rows), 3)
        self.assertEqual(self.mapping["totals"]["runtimeEncodedBytes"], 1527888)
        self.assertEqual(self.mapping["totals"]["runtimeDecodedBytesUpperBound"], 6641664)
        self.assertTrue(all(row["runtimeStatus"] == "active" for row in rows))
        for row in rows:
            with self.subTest(asset=row["stableId"]):
                path = ROOT / row["path"]
                self.assertTrue(path.is_file())
                self.assertEqual(sha256_file(path), row["sha256"])
                with Image.open(path) as image:
                    self.assertEqual(image.convert("RGBA").getchannel("A").getbbox() is not None, True)

    def test_programmatic_extraction_preserves_clear_borders(self) -> None:
        for row in self.mapping["entries"]:
            with self.subTest(asset=row["stableId"]), Image.open(ROOT / row["path"]) as image:
                rgba = image.convert("RGBA")
                alpha = rgba.getchannel("A")
                width, height = rgba.size
                borders = (
                    alpha.crop((0, 0, width, 2)),
                    alpha.crop((0, height - 2, width, height)),
                    alpha.crop((0, 0, 2, height)),
                    alpha.crop((width - 2, 0, width, height)),
                )
                self.assertTrue(all(border.getextrema() == (0, 0) for border in borders))
                self.assertEqual(row["geometry"]["borderVisiblePixels"], 0)

    def test_strict_source_records_point_to_flat_matte_builds(self) -> None:
        for record_name in (
            "home-hero-splash-mgjrpg02-v02-source.json",
            "game-logo-mgjrpg02-v06-source.json",
        ):
            record = read_json(ROOT / "docs/source-assets/records" / record_name)
            with self.subTest(record=record_name):
                self.assertEqual(validate_record_shape(record, record["recordId"]), [])
                expected_status = (
                    "superseded"
                    if record_name == "home-hero-splash-mgjrpg02-v02-source.json"
                    else "active"
                )
                self.assertEqual(record["runtimeStatus"], expected_status)
                self.assertEqual(record["build"]["backgroundExtraction"]["mode"], "flat-impossible-matte")
                self.assertIn("without generative repainting", record["humanEdits"][0]["description"])

    def test_title_route_uses_visual_logo_with_exact_live_heading(self) -> None:
        app = (ROOT / "src/App.tsx").read_text(encoding="utf-8")
        styles = (ROOT / "src/styles.css").read_text(encoding="utf-8")
        catalogue = (ROOT / "src/generated/mgjrpg02Art.ts").read_text(encoding="utf-8")
        self.assertIn('<h1 id="game-title" className="sr-only">Maze so Puzzle</h1>', app)
        self.assertNotIn("A gentle adventure for Ame", app)
        self.assertNotIn("For Ame to Solve!</p>", app)
        self.assertIn('className="title-logo"', app)
        self.assertIn('className="title-hero"', app)
        self.assertNotIn('className="title-vignette"', app)
        self.assertNotIn(".title-vignette", styles)
        self.assertIn("game-logo-v06-front-door-1024-r01.webp", catalogue)
        self.assertIn("home-hero-splash-v04-front-door-1024-r01.webp", catalogue)
        self.assertIn('className="front-door-screen"', app)

    def test_prior_front_door_files_remain_rollback_holds(self) -> None:
        ledger = read_json(ROOT / "docs/source-assets/retirement/asset-retirement-ledger.json")
        rows = [row for row in ledger["entries"] if row["entryId"].startswith("plan03-r2-")]
        self.assertEqual(len(rows), 3)
        for row in rows:
            with self.subTest(asset=row["entryId"]):
                self.assertEqual(row["state"], "rollback-hold")
                self.assertFalse(row["eligibleForPlan12"])
                self.assertTrue((ROOT / row["assetPath"]).is_file())


if __name__ == "__main__":
    unittest.main()
