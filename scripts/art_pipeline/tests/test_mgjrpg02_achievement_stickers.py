from __future__ import annotations

import sys
import unittest
from pathlib import Path

import numpy as np


ROOT = Path(__file__).resolve().parents[3]
PIPELINE = ROOT / "scripts" / "art_pipeline"
if str(PIPELINE) not in sys.path:
    sys.path.insert(0, str(PIPELINE))

from mgjrpg02_achievement_stickers import (  # noqa: E402
    ASSETS,
    DELIVERY_SIZES,
    SOURCE_DIR,
    candidate_facts,
    prepare_candidate,
    prepare_optical,
)


class AchievementStickerBatchTests(unittest.TestCase):
    def test_batch_covers_the_complete_adventure_book_shelf(self) -> None:
        self.assertEqual(len(ASSETS), 15)
        self.assertEqual(len({row["id"] for row in ASSETS}), 15)
        self.assertEqual(
            tuple(row["id"] for row in ASSETS),
            (
                "first-star",
                "animal-friend",
                "surprise-sparkle",
                "perfect-rescue-5",
                "perfect-rescue-10",
                "perfect-rescue-15",
                "maze-explorer-5",
                "maze-explorer-10",
                "maze-explorer-20",
                "surprise-explorer-3",
                "mighty-adventurer",
                "twinkle-toes",
                "bunny-buddy-10",
                "fox-friend-10",
                "kitten-pal-10",
            ),
        )
        self.assertEqual(
            [row["kind"] for row in ASSETS].count("Sticker"),
            3,
        )
        self.assertEqual([row["kind"] for row in ASSETS].count("Medal"), 3)
        self.assertEqual([row["kind"] for row in ASSETS].count("Badge"), 9)
        self.assertEqual(DELIVERY_SIZES, (91, 64, 52, 48, 32))
        selected = {row["id"]: row["file"] for row in ASSETS}
        self.assertIn("candidate-b", selected["animal-friend"])
        self.assertIn("candidate-b", selected["perfect-rescue-15"])

    def test_every_generator_original_extracts_to_one_safe_silhouette(self) -> None:
        for row in ASSETS:
            with self.subTest(asset=row["id"]):
                source_path = SOURCE_DIR / row["file"]
                candidate, extraction_facts = prepare_candidate(source_path)
                facts = candidate_facts(source_path, candidate, extraction_facts)
                alpha = np.asarray(candidate.getchannel("A"), dtype=np.uint8)
                self.assertEqual(candidate.size, (512, 512))
                self.assertEqual(int(alpha[0, :].max()), 0)
                self.assertEqual(int(alpha[-1, :].max()), 0)
                self.assertEqual(int(alpha[:, 0].max()), 0)
                self.assertEqual(int(alpha[:, -1].max()), 0)
                self.assertGreater(int(facts["largestAlphaComponentPixels"]), 1000)
                self.assertGreaterEqual(int(facts["transparentGutterPixels"]), 4)
                self.assertEqual(int(facts["exactBlackVisiblePixels"]), 0)
                self.assertEqual(int(facts["visibleMatteLikePixelsWithin24"]), 0)
                for size in DELIVERY_SIZES:
                    optical = prepare_optical(candidate, size)
                    optical_alpha = np.asarray(optical.getchannel("A"), dtype=np.uint8)
                    ys, xs = np.nonzero(optical_alpha >= 3)
                    gutter = min(
                        int(xs.min()),
                        int(ys.min()),
                        int(size - 1 - xs.max()),
                        int(size - 1 - ys.max()),
                    )
                    self.assertGreaterEqual(gutter, 1)


if __name__ == "__main__":
    unittest.main()
