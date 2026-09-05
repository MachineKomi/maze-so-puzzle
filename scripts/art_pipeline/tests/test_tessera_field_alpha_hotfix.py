"""ART-HOTFIX-01 field reconstruction and pointer contracts."""
from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

from PIL import Image

PACKAGE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PACKAGE))
import tessera_field_alpha_hotfix as hotfix
from model import sha256_file, validate_record_shape


class TesseraFieldAlphaHotfixTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.report = hotfix.read_json(hotfix.REPORT)
        cls.record = hotfix.read_json(hotfix.RECORD)

    def test_rebuild_is_exact_and_r01_remains_immutable(self) -> None:
        result = hotfix.run(False)
        self.assertEqual(result["sha256"], "0fa2cd354705e591c3f70fa0f50e050cf3c0e50e78bb6e54fe31b0be0ca4c156")
        self.assertEqual(result["bytes"], 42980)
        self.assertEqual(sha256_file(hotfix.ROOT / hotfix.OLD_RUNTIME), hotfix.OLD_RUNTIME_SHA256)

    def test_source_record_binds_approved_master_and_field_registration(self) -> None:
        self.assertEqual(validate_record_shape(self.record, self.record["recordId"]), [])
        sources = {row["path"]: row for row in self.record["sources"]}
        master_path = hotfix.MASTER.relative_to(hotfix.ROOT).as_posix()
        self.assertEqual(sources[master_path]["sha256"], hotfix.MASTER_SHA256)
        self.assertEqual(self.record["build"]["registration"], hotfix.REGISTRATION)
        prior = hotfix.read_json(hotfix.BASE_RECORD)
        self.assertEqual(self.record["geometry"]["visibleBounds"], prior["geometry"]["visibleBounds"])
        self.assertEqual(self.record["geometry"]["safeInset"], prior["geometry"]["safeInset"])
        self.assertEqual(self.record["geometry"]["pivot"], prior["geometry"]["pivot"])

    def test_repaired_alpha_and_generated_catalogue_are_current(self) -> None:
        comparison = self.report["alphaComparison"]
        self.assertEqual(comparison["oldAlphaBoundsLTRB"], comparison["newAlphaBoundsLTRB"])
        self.assertGreater(comparison["alphaCoveragePixelsAfter"], comparison["alphaCoveragePixelsBefore"])
        self.assertGreater(comparison["opaquePixelsAfter"], comparison["opaquePixelsBefore"])
        with Image.open(hotfix.ROOT / hotfix.RUNTIME) as opened:
            self.assertEqual(opened.size, (256, 256))
            self.assertEqual(opened.mode, "RGBA")
        generated = hotfix.TS_PATH.read_text(encoding="utf-8")
        self.assertEqual(generated, hotfix.patched_catalogue_content(self.report["catalogueOverride"]))
        self.assertIn(self.report["catalogueOverride"]["publicUrl"], generated)
        self.assertIn(hotfix.RECORD_ID, generated)

    def test_write_refuses_unrelated_catalogue_without_mutating_it(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            path = Path(temporary) / "mgjrpg02Art.ts"
            unrelated = "export const MGJRPG02_ART = { unrelated: true };\n"
            path.write_text(unrelated, encoding="utf-8", newline="\n")
            candidate = hotfix.patched_catalogue_content(self.report["catalogueOverride"])
            with self.assertRaisesRegex(ValueError, "unrelated catalogue changes"):
                hotfix.assert_catalogue_write_safe(path, candidate)
            self.assertEqual(path.read_text(encoding="utf-8"), unrelated)


if __name__ == "__main__":
    unittest.main()
