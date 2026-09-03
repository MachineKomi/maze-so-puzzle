from __future__ import annotations

import copy
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

import numpy as np
from PIL import Image


PACKAGE = Path(__file__).resolve().parents[1]
ROOT = PACKAGE.parents[1]
sys.path.insert(0, str(PACKAGE))

from model import read_json
from proofs import (
    CONTOUR_ASSAY_BACKGROUNDS,
    CONTOUR_ASSAY_CANVAS,
    CONTOUR_ASSAY_COLUMN_X,
    CONTOUR_ASSAY_CROP_FIRST_Y,
    CONTOUR_ASSAY_REGIONS,
    CONTOUR_ASSAY_SCALE,
    CONTOUR_ASSAY_FULL_Y,
    _candidate_images,
    _candidate_derivative_inventory,
    _contour_edge_proof,
)


class ProofContractTests(unittest.TestCase):
    def test_candidate_proof_preflights_prompt_hash_before_processing(self) -> None:
        record_path = (
            ROOT / "docs" / "source-assets" / "records" / "ame-v02-source.json"
        )
        invalid = copy.deepcopy(read_json(record_path))
        invalid["promptEvidence"]["promptFile"]["sha256"] = "0" * 64
        with patch("proofs.resolve_record", return_value=(record_path, invalid)):
            with self.assertRaisesRegex(ValueError, "evidence SHA-256 differs"):
                _candidate_images()

    def test_candidate_proof_rejects_escaping_derivative_path(self) -> None:
        record_path = (
            ROOT / "docs" / "source-assets" / "records" / "ame-v02-source.json"
        )
        invalid = copy.deepcopy(read_json(record_path))
        invalid["build"]["profiles"][0]["outputPath"] = "../outside.webp"
        with self.assertRaisesRegex(ValueError, "escapes the repository"):
            _candidate_derivative_inventory(invalid, {})

    def test_contour_assay_preserves_exact_one_and_four_times_pixels(self) -> None:
        candidate_pixels = np.zeros((512, 512, 4), dtype=np.uint8)
        yy, xx = np.indices((512, 512))
        candidate_pixels[:, :, 0] = xx % 256
        candidate_pixels[:, :, 1] = yy % 256
        candidate_pixels[:, :, 2] = (xx + yy) % 256
        candidate_pixels[:, :, 3] = ((xx * 3 + yy * 5) % 256).astype(np.uint8)
        candidate = Image.fromarray(candidate_pixels, "RGBA")
        sheet = _contour_edge_proof(
            candidate,
            extraction_recipe_id="unit-contour-recipe",
            derivative_recipe_version="unit-derivative-recipe",
        )
        self.assertEqual(sheet.size, CONTOUR_ASSAY_CANVAS)

        _name, black = CONTOUR_ASSAY_BACKGROUNDS[0]
        expected_full = Image.new("RGBA", (512, 512), black)
        expected_full.alpha_composite(candidate)
        x = CONTOUR_ASSAY_COLUMN_X[0]
        actual_full = sheet.crop(
            (x, CONTOUR_ASSAY_FULL_Y, x + 512, CONTOUR_ASSAY_FULL_Y + 512)
        )
        self.assertTrue(np.array_equal(np.asarray(actual_full), np.asarray(expected_full)))

        _label, crop_box = CONTOUR_ASSAY_REGIONS[0]
        crop_width = (crop_box[2] - crop_box[0]) * CONTOUR_ASSAY_SCALE
        crop_height = (crop_box[3] - crop_box[1]) * CONTOUR_ASSAY_SCALE
        scaled = candidate.crop(crop_box).resize(
            (crop_width, crop_height), Image.Resampling.NEAREST
        )
        expected_crop = Image.new("RGBA", scaled.size, black)
        expected_crop.alpha_composite(scaled)
        actual_crop = sheet.crop(
            (
                x,
                CONTOUR_ASSAY_CROP_FIRST_Y,
                x + crop_width,
                CONTOUR_ASSAY_CROP_FIRST_Y + crop_height,
            )
        )
        self.assertTrue(np.array_equal(np.asarray(actual_crop), np.asarray(expected_crop)))


if __name__ == "__main__":
    unittest.main()
