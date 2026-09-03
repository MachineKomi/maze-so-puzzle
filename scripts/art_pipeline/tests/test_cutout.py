from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

import numpy as np
from PIL import Image


PACKAGE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PACKAGE))

from cutout import (
    alpha_component_sizes,
    dilate_hidden_rgb,
    extract_edge_connected_background,
    extract_outer_contour_background,
    extract_seeded_checkerboard_background,
    premultiplied_resize,
    register_cutout,
    remove_small_alpha_components,
)
from builder import _publish_without_overwrite, alpha_bounds


class CutoutTests(unittest.TestCase):
    def test_edge_extraction_preserves_enclosed_matching_colour(self) -> None:
        image = Image.new("RGBA", (7, 7), (250, 250, 250, 255))
        pixels = np.asarray(image).copy()
        pixels[2:5, 2:5, :3] = (20, 30, 40)
        pixels[3, 3, :3] = (250, 250, 250)
        result = extract_edge_connected_background(Image.fromarray(pixels), (250, 250, 250), 0)
        alpha = np.asarray(result.getchannel("A"))
        self.assertEqual(int(alpha[0, 0]), 0)
        self.assertEqual(int(alpha[3, 3]), 255)

    def test_premultiplied_resize_does_not_bleed_hidden_magenta(self) -> None:
        pixels = np.zeros((4, 4, 4), dtype=np.uint8)
        pixels[:, :, :3] = (255, 0, 255)
        pixels[1:3, 1:3, :3] = (20, 180, 90)
        pixels[1:3, 1:3, 3] = 255
        result = np.asarray(premultiplied_resize(Image.fromarray(pixels), (2, 2)))
        visible = result[:, :, 3] > 0
        self.assertTrue(np.all(result[:, :, 1][visible] > result[:, :, 0][visible]))

    def test_hidden_rgb_dilation_does_not_change_alpha(self) -> None:
        pixels = np.zeros((5, 5, 4), dtype=np.uint8)
        pixels[2, 2] = (17, 91, 203, 255)
        source = Image.fromarray(pixels)
        result = dilate_hidden_rgb(source, 1)
        result_pixels = np.asarray(result)
        self.assertTrue(np.array_equal(result_pixels[:, :, 3], pixels[:, :, 3]))
        self.assertEqual(tuple(result_pixels[2, 1, :3]), (17, 91, 203))

    def test_small_alpha_component_cleanup_preserves_main_subject(self) -> None:
        pixels = np.zeros((20, 20, 4), dtype=np.uint8)
        pixels[3:16, 3:16] = (20, 180, 90, 255)
        pixels[18, 18] = (200, 40, 100, 255)
        cleaned = remove_small_alpha_components(
            Image.fromarray(pixels), minimum_pixels=8, alpha_threshold=3
        )
        self.assertEqual(alpha_component_sizes(cleaned, alpha_threshold=3), [169])
        self.assertEqual(cleaned.getchannel("A").getpixel((18, 18)), 0)

    def test_seeded_checker_protects_white_costume_and_clears_named_hole(self) -> None:
        pixels = np.full((15, 15, 3), 250, dtype=np.uint8)
        pixels[3:12, 3:12] = (30, 180, 90)
        pixels[5:7, 5:7] = (255, 255, 255)
        pixels[8:10, 8:10] = (248, 248, 248)
        result = extract_seeded_checkerboard_background(
            Image.fromarray(pixels),
            maximum_chroma=20,
            foreground_seed_points=((0.25, 0.25),),
            enclosed_seed_points=((8 / 14, 8 / 14),),
            opening_radius=0,
            closing_radius=0,
            subject_grow_radius=0,
            hole_grow_radius=0,
            max_enclosed_component_pixels=8,
        )
        alpha = np.asarray(result.getchannel("A"))
        self.assertEqual(int(alpha[0, 0]), 0)
        self.assertEqual(int(alpha[5, 5]), 255)
        self.assertEqual(int(alpha[8, 8]), 0)

    def test_c20_keeps_a_cream_bridge_that_c35_disconnects(self) -> None:
        pixels = np.full((31, 31, 3), 250, dtype=np.uint8)
        pixels[6:25, 5:19] = (30, 180, 90)
        pixels[13:18, 19:24] = (240, 225, 215)  # chroma 25
        pixels[10:22, 24:29] = (210, 60, 80)
        image = Image.fromarray(pixels)
        common = {
            "foreground_seed_points": ((0.25, 0.5),),
            "opening_radius": 0,
            "closing_radius": 0,
            "subject_grow_radius": 0,
            "hole_grow_radius": 0,
        }
        c20 = extract_seeded_checkerboard_background(
            image,
            maximum_chroma=20,
            **common,
        )
        c35 = extract_seeded_checkerboard_background(
            image,
            maximum_chroma=35,
            **common,
        )
        self.assertEqual(c20.getchannel("A").getpixel((26, 15)), 255)
        self.assertEqual(c35.getchannel("A").getpixel((26, 15)), 0)

    def test_close2_does_not_reconnect_a_separated_coloured_shadow(self) -> None:
        pixels = np.full((61, 61, 3), 250, dtype=np.uint8)
        pixels[10:51, 5:30] = (30, 180, 90)
        pixels[20:41, 38:51] = (90, 30, 120)
        image = Image.fromarray(pixels)
        common = {
            "maximum_chroma": 20,
            "foreground_seed_points": ((0.2, 0.5),),
            "opening_radius": 0,
            "subject_grow_radius": 0,
            "hole_grow_radius": 0,
        }
        close2 = extract_seeded_checkerboard_background(
            image,
            closing_radius=2,
            **common,
        )
        close6 = extract_seeded_checkerboard_background(
            image,
            closing_radius=6,
            **common,
        )
        self.assertEqual(close2.getchannel("A").getpixel((44, 30)), 0)
        self.assertEqual(close6.getchannel("A").getpixel((44, 30)), 255)

    def test_outer_contour_excludes_shadow_and_preserves_white_interior(self) -> None:
        pixels = np.full((41, 41, 3), 250, dtype=np.uint8)
        pixels[7:34, 7:34] = (55, 25, 70)
        pixels[9:32, 9:32] = (30, 180, 90)
        pixels[14:19, 14:19] = (252, 252, 252)
        pixels[22:26, 22:26] = (248, 248, 248)
        pixels[15:27, 38:40] = (90, 30, 120)  # detached coloured shadow
        result = extract_outer_contour_background(
            Image.fromarray(pixels),
            barrier_maximum_luminance=180,
            barrier_minimum_chroma=10,
            barrier_closing_radius=1,
            exterior_trim_minimum_luminance=235,
            exterior_trim_maximum_chroma=20,
            foreground_seed_points=((0.30, 0.50),),
            enclosed_seed_points=((0.575, 0.575),),
            hole_maximum_chroma=20,
            hole_grow_radius=0,
            max_enclosed_component_pixels=32,
        )
        alpha = result.getchannel("A")
        self.assertEqual(alpha.getpixel((0, 0)), 0)
        self.assertEqual(alpha.getpixel((37, 20)), 0)
        self.assertEqual(alpha.getpixel((15, 15)), 255)
        self.assertEqual(alpha.getpixel((23, 23)), 0)

    def test_registration_reports_minimum_top_and_grounded_baseline(self) -> None:
        source = Image.new("RGBA", (20, 30), (0, 0, 0, 0))
        source.paste((30, 180, 90, 255), (4, 3, 16, 27))
        registered = register_cutout(
            source,
            (100, 100),
            target_box=(0.08, 0.085, 0.92, 0.90),
            align=(0.5, 1.0),
            alpha_threshold=3,
        )
        bounds = alpha_bounds(registered, 3)
        normalized = bounds["normalizedLTRB"]
        self.assertGreaterEqual(normalized[1], 0.08)
        self.assertLessEqual(abs(normalized[3] - 0.90), 0.02)

    def test_publish_without_overwrite_never_replaces_existing_file(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            staged = root / "staged.bin"
            destination = root / "output.bin"
            staged.write_bytes(b"new")
            destination.write_bytes(b"existing")
            with self.assertRaises(FileExistsError):
                _publish_without_overwrite(staged, destination)
            self.assertEqual(destination.read_bytes(), b"existing")

            destination.unlink()
            _publish_without_overwrite(staged, destination)
            self.assertEqual(destination.read_bytes(), b"new")


if __name__ == "__main__":
    unittest.main()
