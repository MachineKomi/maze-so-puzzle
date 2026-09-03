from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

import numpy as np
from PIL import Image


PACKAGE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PACKAGE))

from mgjrpg02_batch01 import (  # noqa: E402
    INK_RGB,
    _transparent_gutter,
    clear_low_alpha,
    discover_batch_assets,
    estimate_uniform_matte,
    extract_uniform_matte,
    matte_key_spill_mask,
    normalize_visible_black,
)
from cutout import dilate_hidden_rgb, register_cutout  # noqa: E402


class Batch01MatteTests(unittest.TestCase):
    def _synthetic_source(self) -> Image.Image:
        matte = np.asarray((249, 4, 247), dtype=np.float32)
        foreground = np.asarray((91, 176, 150), dtype=np.float32)
        pixels = np.broadcast_to(matte, (96, 96, 3)).copy()
        pixels[24:72, 24:72] = foreground
        pixels[23, 25:71] = matte * 0.5 + foreground * 0.5
        pixels[72, 25:71] = matte * 0.5 + foreground * 0.5
        pixels[25:71, 23] = matte * 0.5 + foreground * 0.5
        pixels[25:71, 72] = matte * 0.5 + foreground * 0.5
        pixels[40:44, 40:44] = 0
        return Image.fromarray(np.rint(pixels).astype(np.uint8), "RGB")

    def test_uniform_matte_is_measured_from_four_corners(self) -> None:
        measurement = estimate_uniform_matte(self._synthetic_source())
        self.assertEqual(measurement["rgb"], [249, 4, 247])
        self.assertEqual(measurement["maximumChannelStd"], 0.0)

    def test_textured_corner_matte_is_rejected(self) -> None:
        pixels = np.full((96, 96, 3), (249, 4, 247), dtype=np.uint8)
        pixels[:20, :20:2] = (40, 90, 130)
        with self.assertRaisesRegex(ValueError, "not uniform enough"):
            estimate_uniform_matte(Image.fromarray(pixels, "RGB"))

    def test_unblend_removes_matte_and_normalizes_visible_black(self) -> None:
        source = self._synthetic_source()
        extracted, measurement = extract_uniform_matte(
            source,
            (249, 4, 247),
            clear_distance=20,
            opaque_distance=130,
            minimum_component_pixels=8,
        )
        pixels = np.asarray(extracted)
        self.assertEqual(tuple(pixels[0, 0]), (0, 0, 0, 0))
        self.assertGreater(int(pixels[23, 30, 3]), 0)
        # The recovered semi-transparent edge is green, not magenta-contaminated.
        self.assertGreater(int(pixels[23, 30, 1]), int(pixels[23, 30, 0]))
        self.assertGreater(measurement["exactBlackVisiblePixelsNormalized"], 0)
        visible_black = (pixels[:, :, 3] > 0) & np.all(pixels[:, :, :3] == 0, axis=2)
        self.assertFalse(np.any(visible_black))
        self.assertTrue(np.all(pixels[41, 41, :3] == INK_RGB))

    def test_registered_proof_has_four_pixel_gutter(self) -> None:
        extracted, _ = extract_uniform_matte(
            self._synthetic_source(),
            (249, 4, 247),
            clear_distance=20,
            opaque_distance=130,
            minimum_component_pixels=8,
        )
        registered = register_cutout(
            extracted,
            (96, 96),
            target_box=(0.08, 0.08, 0.92, 0.92),
            align=(0.5, 1.0),
            alpha_threshold=3,
        )
        registered, _ = normalize_visible_black(registered)
        registered = dilate_hidden_rgb(registered, 2)
        gutter = _transparent_gutter(registered)
        self.assertTrue(gutter["atLeastFourPixels"])
        self.assertGreaterEqual(gutter["minimumPixels"], 4)

    def test_low_alpha_resampling_lobes_are_cleared(self) -> None:
        pixels = np.zeros((4, 4, 4), dtype=np.uint8)
        pixels[1, 1] = (249, 4, 247, 7)
        pixels[2, 2] = (80, 60, 90, 12)
        pixels[2, 1] = (80, 60, 90, 13)
        cleaned = np.asarray(clear_low_alpha(Image.fromarray(pixels, "RGBA"), 12))
        self.assertEqual(int(cleaned[1, 1, 3]), 0)
        self.assertEqual(int(cleaned[2, 2, 3]), 0)
        self.assertEqual(int(cleaned[2, 1, 3]), 13)

    def test_impossible_key_spill_is_rejected_but_muted_material_is_kept(self) -> None:
        pixels = np.asarray([[[1, 249, 93], [80, 170, 120]]], dtype=np.uint8)
        spill = matte_key_spill_mask(pixels, (8, 220, 11))
        self.assertTrue(bool(spill[0, 0]))
        self.assertFalse(bool(spill[0, 1]))

    def test_detached_pixel_without_material_donor_does_not_invert_key_hue(self) -> None:
        pixels = np.full((32, 32, 3), (249, 4, 247), dtype=np.uint8)
        pixels[16, 16] = (110, 52, 130)
        extracted, measurement = extract_uniform_matte(
            Image.fromarray(pixels, "RGB"),
            (249, 4, 247),
            clear_distance=20,
            opaque_distance=130,
            minimum_component_pixels=1,
        )
        recovered = np.asarray(extracted)
        self.assertGreater(measurement["fallbackBoundaryPixels"], 0)
        self.assertEqual(tuple(recovered[16, 16, :3]), (110, 52, 130))

    def test_additional_mattes_are_auto_discovered_in_filename_order(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            (root / "enemy-zeta-v01-matte-02-generator-original.png").touch()
            (root / "enemy-alpha-v01-matte-01-generator-original.png").touch()
            assets = discover_batch_assets(root)
        extras = [asset for asset in assets if asset.asset_id in {"enemy-alpha-v01", "enemy-zeta-v01"}]
        self.assertEqual([asset.asset_id for asset in extras], ["enemy-alpha-v01", "enemy-zeta-v01"])
        self.assertEqual(extras[0].label, "Alpha")

    def test_duplicate_attempt_patterns_for_one_asset_are_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            (root / "enemy-unit-v01-matte-01-generator-original.png").touch()
            (root / "enemy-unit-v01-matte-02-generator-original.png").touch()
            with self.assertRaisesRegex(ValueError, "duplicate Batch 01 asset id"):
                discover_batch_assets(root)


if __name__ == "__main__":
    unittest.main()
