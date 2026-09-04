from __future__ import annotations

import sys
import unittest
from pathlib import Path

from PIL import Image


PACKAGE = Path(__file__).resolve().parents[1]
ROOT = PACKAGE.parents[1]
sys.path.insert(0, str(PACKAGE))

from model import read_json, sha256_file, validate_record_shape


class Plan03R1PublicationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.map_path = ROOT / "docs/source-assets/publication/mgjrpg-02-plan03-r1-runtime-map.json"
        cls.report_path = ROOT / "docs/source-assets/publication/mgjrpg-02-plan03-r1-publication-report.json"
        cls.decision_path = ROOT / "docs/source-assets/calibrations/mgjrpg-02/v09/human-decision.json"
        cls.mapping = read_json(cls.map_path)
        cls.report = read_json(cls.report_path)

    def test_forward_decision_binds_every_approved_source(self) -> None:
        decision = read_json(self.decision_path)
        self.assertEqual(decision["status"], "approved-for-runtime-publication")
        self.assertEqual(len(decision["approvedSources"]), 11)
        for source in decision["approvedSources"]:
            with self.subTest(source=source["id"]):
                path = ROOT / source["path"]
                self.assertTrue(path.is_file())
                self.assertEqual(sha256_file(path), source["sha256"])
                self.assertEqual(path.stat().st_size, source["bytes"])

    def test_publication_map_has_exact_runtime_and_platform_files(self) -> None:
        rows = self.mapping["entries"]
        public = [row for row in rows if row["path"].startswith("public/")]
        platform = [row for row in rows if row["path"].startswith("src-tauri/")]
        self.assertEqual(len(public), 12)
        self.assertEqual(len(platform), 19)
        self.assertEqual(self.mapping["counts"]["runtimeEncodedBytes"], 1708073)
        self.assertEqual(self.mapping["counts"]["runtimeDecodedBytesUpperBound"], 14636960)
        for row in rows:
            with self.subTest(asset=row["stableId"]):
                path = ROOT / row["path"]
                self.assertTrue(path.is_file())
                self.assertEqual(sha256_file(path), row["sha256"])

    def test_navigation_is_one_complete_active_optical_family(self) -> None:
        rows = [row for row in self.mapping["entries"] if row["family"] == "navigation"]
        self.assertEqual({row["stableId"] for row in rows}, {
            "nav-home", "nav-mazes", "nav-book", "nav-help",
            "nav-sound", "nav-muted", "nav-restart",
        })
        self.assertTrue(all(row["runtimeStatus"] == "active" for row in rows))
        self.assertTrue(all((row["width"], row["height"]) == (128, 128) for row in rows))
        self.assertTrue(all(row["geometry"]["borderVisiblePixels"] == 0 for row in rows))

    def test_front_door_lifecycle_and_exact_logo_contract(self) -> None:
        rows = {row["stableId"]: row for row in self.mapping["entries"]}
        self.assertEqual(rows["title-environment"]["runtimeStatus"], "active")
        self.assertEqual(rows["home-hero-splash"]["runtimeStatus"], "dormant")
        self.assertEqual(rows["game-logo-1024"]["runtimeStatus"], "dormant")
        self.assertEqual(rows["game-logo-512"]["runtimeStatus"], "dormant")
        self.assertEqual(rows["app-icon-ame-web"]["runtimeStatus"], "active")
        self.assertEqual(rows["game-logo-1024"]["text"], "Maze so Puzzle")
        self.assertEqual(rows["game-logo-1024"]["artVersion"], 5)
        record = read_json(ROOT / "docs/source-assets/records/game-logo-mgjrpg02-v05-source.json")
        self.assertEqual(validate_record_shape(record, record["recordId"]), [])
        self.assertEqual(record["build"]["backgroundExtraction"], {"mode": "native-alpha"})
        self.assertIn("All Maze so Puzzle edges", record["humanEdits"][0]["description"])

    def test_platform_optical_sizes_have_safe_alpha_borders(self) -> None:
        for size in (16, 32, 48, 64, 128, 256, 512):
            path = ROOT / f"src-tauri/icons/ame-v03/{size}x{size}.png"
            with self.subTest(size=size), Image.open(path) as image:
                self.assertEqual(image.size, (size, size))
                alpha = image.convert("RGBA").getchannel("A")
                borders = (
                    alpha.crop((0, 0, size, 2)),
                    alpha.crop((0, size - 2, size, size)),
                    alpha.crop((0, 0, 2, size)),
                    alpha.crop((size - 2, 0, size, size)),
                )
                self.assertTrue(all(border.getextrema() == (0, 0) for border in borders))

    def test_r1_retirement_rows_are_rollback_holds_only(self) -> None:
        ledger = read_json(ROOT / "docs/source-assets/retirement/asset-retirement-ledger.json")
        rows = [row for row in ledger["entries"] if row["entryId"].startswith("plan03-r1-")]
        self.assertEqual(len(rows), 8)
        for row in rows:
            with self.subTest(asset=row["entryId"]):
                self.assertEqual(row["state"], "rollback-hold")
                self.assertFalse(row["eligibleForPlan12"])
                self.assertTrue((ROOT / row["assetPath"]).is_file())


if __name__ == "__main__":
    unittest.main()
