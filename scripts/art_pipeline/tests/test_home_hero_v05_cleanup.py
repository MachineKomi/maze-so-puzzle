"""The Human's mask authorization cannot spread into approved white materials."""
from __future__ import annotations

import copy
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

import numpy as np
from PIL import Image

PACKAGE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PACKAGE))
import home_hero_v05_cleanup as cleanup


class HomeHeroV05CleanupTests(unittest.TestCase):
    def test_exact_two_alpha_components_preserve_every_other_channel(self) -> None:
        before, after, components = cleanup.clean()
        old, new = np.asarray(before), np.asarray(after)
        changed = old[:, :, 3] != new[:, :, 3]
        self.assertEqual(int(changed.sum()), 579)
        self.assertTrue(np.array_equal(old[:, :, :3], new[:, :, :3]))
        self.assertTrue(np.array_equal(old[~changed], new[~changed]))
        self.assertTrue(np.all(old[changed, 3] == 255))
        self.assertTrue(np.all(new[changed, 3] == 0))
        self.assertEqual([item["pixelsCleared"] for item in components], [417, 162])
        # These pale materials were protected by the prior bounded correction.
        self.assertEqual(after.getpixel((1275, 635)), before.getpixel((1275, 635)))

    def test_component_measurement_drift_fails_closed(self) -> None:
        authority = copy.deepcopy(cleanup.read_json(cleanup.AUTHORITY))
        authority["components"][0]["pixelCount"] += 1
        with patch.object(cleanup, "read_json", return_value=authority):
            with self.assertRaisesRegex(ValueError, "Exact component guard"):
                cleanup.clean()

    def test_unapproved_source_hash_fails_before_processing(self) -> None:
        authority = copy.deepcopy(cleanup.read_json(cleanup.AUTHORITY))
        authority["sourceSha256"] = "0" * 64
        with patch.object(cleanup, "read_json", return_value=authority):
            with self.assertRaisesRegex(ValueError, "source drift"):
                cleanup.clean()

    def test_published_master_matches_exact_cleanup_and_formats_match_pixels(self) -> None:
        _, expected, _ = cleanup.clean()
        with Image.open(cleanup.ROOT / cleanup.MASTER) as master:
            self.assertTrue(np.array_equal(np.asarray(master.convert("RGBA")), np.asarray(expected)))
        with Image.open(cleanup.ROOT / cleanup.WEBP) as webp, Image.open(cleanup.ROOT / cleanup.PNG) as png:
            self.assertEqual(webp.size, (1024, 768))
            self.assertEqual(png.size, webp.size)
            self.assertTrue(np.array_equal(np.asarray(webp.convert("RGBA")), np.asarray(png.convert("RGBA"))))


if __name__ == "__main__":
    unittest.main()
