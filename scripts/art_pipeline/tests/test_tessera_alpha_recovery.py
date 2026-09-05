"""Coral recovery is bounded source extraction, never replacement artwork."""
from __future__ import annotations

import sys
import unittest
from pathlib import Path

import numpy as np
from PIL import Image

PACKAGE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PACKAGE))
import tessera_alpha_recovery as recovery
from model import sha256_file, validate_record_shape


class TesseraAlphaRecoveryTests(unittest.TestCase):
    def test_original_rgb_and_all_pixels_outside_exact_mask_are_preserved(self) -> None:
        report = recovery.read_json(recovery.REPORT)
        entry = report["entries"][0]
        root = recovery.ROOT / recovery.PRODUCTION
        with Image.open(recovery.ROOT / entry["sourcePath"]) as opened:
            raw = np.asarray(opened.convert("RGB"))
        with Image.open(root / "approved-rgb-corrected-alpha-master.png") as opened:
            source_alpha = np.asarray(opened.convert("RGBA"))
        with Image.open(root / "old-extraction.png") as opened:
            old = np.asarray(opened.convert("RGBA"))
        with Image.open(root / "recovered-delivery-master.png") as opened:
            new = np.asarray(opened.convert("RGBA"))
        with Image.open(root / "exact-restored-alpha-mask.png") as opened:
            mask = np.asarray(opened.convert("L")) > 0
        self.assertTrue(np.array_equal(raw, source_alpha[:, :, :3]))
        self.assertTrue(np.array_equal(source_alpha[:, :, 3], new[:, :, 3]))
        self.assertEqual(int(mask.sum()), 81468)
        self.assertTrue(np.array_equal(old[~mask], new[~mask]))
        self.assertTrue(np.all(new[mask, 3] > old[mask, 3]))
        allowed = np.zeros(mask.shape, dtype=np.bool_)
        for left, top, right, bottom in recovery.REGIONS:
            allowed[top:bottom, left:right] = True
        self.assertFalse(np.any(mask & ~allowed))

    def test_corrected_rendition_is_separate_and_preserves_source_and_float_geometry(self) -> None:
        report = recovery.read_json(recovery.REPORT)
        entry = report["entries"][0]
        record = recovery.read_json(recovery.RECORD)
        self.assertEqual(validate_record_shape(record, record["recordId"]), [])
        self.assertEqual(entry["geometry"]["class"], "floating-actor")
        self.assertEqual(record["geometry"], entry["geometry"])
        self.assertEqual(sha256_file(recovery.ROOT / entry["sourcePath"]), entry["sourceSha256"])
        self.assertEqual(sha256_file(recovery.ROOT / entry["path"]), entry["sha256"])
        prior = next(e for e in recovery.read_json(recovery.OLD_REPORT)["entries"] if e["id"] == "tessera-dolphin")
        self.assertNotEqual(entry["path"], prior["path"])
        self.assertEqual(sha256_file(recovery.ROOT / prior["path"]), prior["sha256"])
        self.assertEqual(sha256_file(recovery.ROOT / "public" / entry["opticalUrl"].lstrip("/")), entry["opticalSha256"])


if __name__ == "__main__":
    unittest.main()
