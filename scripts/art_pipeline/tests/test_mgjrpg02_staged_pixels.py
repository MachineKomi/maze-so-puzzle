from __future__ import annotations

import sys
import unittest
from pathlib import Path

from PIL import Image


PACKAGE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PACKAGE))

from builder import _validate_mgjrpg02_staged_pixels


class Mgjrpg02StagedPixelTests(unittest.TestCase):
    def test_visible_exact_black_is_rejected_but_transparent_black_is_allowed(self) -> None:
        record = {
            "recipeVersion": "mgjrpg-02",
            "renderingContract": {"treatmentClass": "character-contour"},
        }
        build = {"operation": "cutout-resize"}
        image = Image.new("RGBA", (3, 3), (0, 0, 0, 0))
        image.putpixel((1, 1), (0, 0, 0, 255))
        with self.assertRaisesRegex(ValueError, "forbids visible exact #000000"):
            _validate_mgjrpg02_staged_pixels(record, build, image)

        image.putpixel((1, 1), (52, 32, 63, 255))
        _validate_mgjrpg02_staged_pixels(record, build, image)

    def test_terrain_boundary_requires_opaque_periodic_or_opaque_resize(self) -> None:
        record = {
            "recipeVersion": "mgjrpg-02",
            "renderingContract": {"treatmentClass": "terrain-boundary"},
        }
        opaque = Image.new("RGBA", (4, 4), (92, 74, 105, 255))
        with self.assertRaisesRegex(ValueError, "periodic or opaque-resize"):
            _validate_mgjrpg02_staged_pixels(
                record, {"operation": "cutout-resize"}, opaque
            )

        transparent = opaque.copy()
        transparent.putpixel((0, 0), (92, 74, 105, 0))
        with self.assertRaisesRegex(ValueError, "must be fully opaque"):
            _validate_mgjrpg02_staged_pixels(
                record, {"operation": "periodic"}, transparent
            )

        _validate_mgjrpg02_staged_pixels(
            record, {"operation": "periodic"}, opaque
        )
        _validate_mgjrpg02_staged_pixels(
            record, {"operation": "opaque-resize"}, opaque
        )

    def test_legacy_recipe_does_not_acquire_mgjrpg02_pixel_rules(self) -> None:
        legacy = {
            "recipeVersion": "mgjrpg-01",
            "renderingContract": {"treatmentClass": "terrain-boundary"},
        }
        image = Image.new("RGBA", (2, 2), (0, 0, 0, 255))
        _validate_mgjrpg02_staged_pixels(
            legacy, {"operation": "cutout-resize"}, image
        )


if __name__ == "__main__":
    unittest.main()
