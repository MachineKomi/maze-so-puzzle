from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw


PACKAGE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PACKAGE))

from mgjrpg02 import (
    CANARIES,
    MINIMUM_RELATIVE_LUMINANCE_DELTA,
    _assay_scores,
    _contour_crop_sheet,
    _imagegen_rejection_sheet,
    _load_canary,
    _local_contour_assay,
    _provisional_threshold_summary,
    _terrain_assay,
    _validate_calibration_provenance,
    _write_once_bytes,
)


class Mgjrpg02ProofTests(unittest.TestCase):
    def test_required_canary_roster_is_complete_and_unique(self) -> None:
        ids = [entry["id"] for entry in CANARIES]
        self.assertEqual(len(ids), len(set(ids)))
        self.assertEqual(
            set(ids),
            {
                "ame-v02-candidate-c",
                "animal-fox",
                "animal-alpaca",
                "enemy-goblin",
                "enemy-jelly-sorcerer",
                "weapon-moon-wand",
                "key-rose-heart",
                "door-rose-heart",
                "portal-rose-heart",
                "reward-first-star",
                "nav-home",
                "nav-help",
                "terrain-sunny-floor",
                "terrain-sunny-wall",
                "terrain-wishing-floor",
                "terrain-wishing-hedge",
                "terrain-wishing-dressing",
                "hazard-water",
                "hazard-lava",
                "hazard-poison",
            },
        )

    def test_contour_assay_preserves_geometry_alpha_and_uses_local_families(self) -> None:
        image = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
        draw = ImageDraw.Draw(image)
        draw.ellipse((12, 18, 69, 112), fill=(246, 206, 84, 255))
        draw.ellipse((59, 18, 116, 112), fill=(95, 174, 134, 255))
        result, metrics = _local_contour_assay(image)
        before = np.asarray(image)
        after = np.asarray(result)
        self.assertTrue(np.array_equal(before[..., 3], after[..., 3]))
        self.assertEqual(metrics["alpha"]["geometryAndAlphaByteExactBetweenBaselineAndAssay"], True)
        self.assertEqual(metrics["assay"]["pureBlackVisibleContourPixels"], 0)
        self.assertIn("transformAssignmentAgreement", metrics["assay"])
        self.assertNotIn("localMaterialFamilyAgreement", metrics["assay"])
        distribution = metrics["assay"]["observedTokenDistribution"]
        self.assertGreater(distribution["warm-gold"], 0.05)
        self.assertGreater(distribution["leaf-plum"], 0.05)

    def test_semantic_cutline_remains_cream_while_inner_contour_changes(self) -> None:
        image = Image.new("RGBA", (96, 96), (0, 0, 0, 0))
        draw = ImageDraw.Draw(image)
        draw.ellipse((4, 4, 92, 92), fill=(250, 239, 211, 255))
        draw.ellipse((13, 13, 83, 83), fill=(143, 102, 190, 255))
        result, metrics = _local_contour_assay(image, semantic_ui=True)
        self.assertEqual(result.getpixel((48, 4))[:3], image.getpixel((48, 4))[:3])
        self.assertTrue(metrics["semanticUiCreamCutlinePreserved"])
        self.assertGreater(
            metrics["semanticUiCreamCutlineEvidence"]["detectedPixels"], 0
        )
        self.assertEqual(
            metrics["semanticUiCreamCutlineEvidence"]["changedPixels"], 0
        )

    def test_semantic_cutline_flag_is_false_without_detected_cream_evidence(self) -> None:
        image = Image.new("RGBA", (96, 96), (0, 0, 0, 0))
        draw = ImageDraw.Draw(image)
        draw.ellipse((4, 4, 92, 92), fill=(143, 102, 190, 255))
        _, metrics = _local_contour_assay(image, semantic_ui=True)
        self.assertFalse(metrics["semanticUiCreamCutlinePreserved"])
        self.assertEqual(
            metrics["semanticUiCreamCutlineEvidence"],
            {"applicable": True, "detectedPixels": 0, "changedPixels": 0},
        )

    def test_all_cutout_crop_contracts_cross_the_exterior_silhouette(self) -> None:
        rows = []
        cutout_ids = {
            entry["id"]
            for entry in CANARIES
            if entry["treatmentClass"] != "terrain-boundary"
        }
        for entry in CANARIES:
            if entry["id"] not in cutout_ids:
                continue
            baseline, _ = _load_canary(entry)
            assay, _ = _local_contour_assay(
                baseline,
                semantic_ui=entry["treatmentClass"] == "semantic-ui-cutout",
            )
            rows.append({**entry, "baseline": baseline, "assay": assay})

        _, contracts = _contour_crop_sheet(rows)
        self.assertEqual({contract["canaryId"] for contract in contracts}, cutout_ids)
        for canary_id in cutout_ids:
            canary_contracts = [
                contract for contract in contracts if contract["canaryId"] == canary_id
            ]
            self.assertEqual(len(canary_contracts), 6)
            crop_boxes = {
                tuple(contract["sourceCropLTRBExclusive"])
                for contract in canary_contracts
            }
            self.assertEqual(len(crop_boxes), 1)
            for contract in canary_contracts:
                evidence = contract["sourceAlphaEvidence"]
                self.assertTrue(evidence["crossesExteriorSilhouette"])
                self.assertGreater(evidence["transparentAlphaZeroPixels"], 0)
                self.assertGreater(evidence["opaqueAlpha255Pixels"], 0)
                self.assertGreater(evidence["exteriorBoundaryPixels"], 0)

    def test_contour_and_alpha_scores_are_not_raised_by_the_transform(self) -> None:
        entry = next(row for row in CANARIES if row["id"] == "animal-alpaca")
        baseline = dict(zip(
            (
                "smallSizeRecognition",
                "largeColourMasses",
                "threeValueGrouping",
                "focalHierarchy",
                "colourAwareContour",
                "materialTruth",
                "mazePaletteMotif",
                "faceExpressionPreservation",
                "familyCoherence",
                "alphaQuality",
                "terrainRepetitionSeams",
                "grayscaleCvdReadability",
            ),
            entry["baseline"],
            strict=True,
        ))
        assay = _assay_scores(entry)
        self.assertEqual(assay["colourAwareContour"], baseline["colourAwareContour"])
        self.assertEqual(assay["alphaQuality"], baseline["alphaQuality"])

    def test_threshold_summary_uses_recipe_contrast_and_names_failures(self) -> None:
        self.assertEqual(MINIMUM_RELATIVE_LUMINANCE_DELTA, 0.12)
        entry = {
            "id": "synthetic-cutout",
            "treatmentClass": "character-contour",
            "sizes": [16, 32],
        }
        alpha = {
            "geometryAndAlphaByteExactBetweenBaselineAndAssay": True,
            "exactEdgeNonzeroAlphaPixels": 0,
        }
        reference = {
            "assay": {
                "outerLineContrastContinuity": 0.96,
                "pureBlackVisibleContourPixels": 0,
            },
            "alpha": alpha,
            "provisionalThresholds": {
                "outerLineContrastContinuityReference": 0.97,
                "outerLineContrastContinuitySmallestDelivery": 0.94,
                "pureBlackVisibleContourPixels": 0,
            },
        }
        deliveries = {
            16: {
                "assay": {
                    "outerLineContrastContinuity": 0.93,
                    "pureBlackVisibleContourPixels": 1,
                },
                "alpha": alpha,
            },
            32: None,
        }
        summary = _provisional_threshold_summary(entry, reference, deliveries)
        self.assertFalse(summary["passed"])
        self.assertEqual(
            summary["failedChecks"],
            ["referenceContinuity", "smallestDeliveryContinuity", "pureBlack"],
        )

    def test_rejected_imagegen_sheet_exposes_boundary_alpha_without_recolour_claim(self) -> None:
        _, contract = _imagegen_rejection_sheet()
        self.assertEqual(contract["sourceCropLTRBExclusive"], [0, 1190, 64, 1254])
        self.assertEqual(contract["cropComposite"], "straight RGBA over opaque magenta")
        diagnostic = contract["binaryAlphaDiagnostic"]
        self.assertFalse(diagnostic["sourceColourPreserved"])
        self.assertGreater(diagnostic["nonzeroAlphaPixels"], 0)
        self.assertGreater(diagnostic["maximumAlpha"], 0)

    def test_terrain_assay_keeps_alpha_and_periodic_edges(self) -> None:
        image = Image.new("RGBA", (64, 64), (0, 0, 0, 255))
        pixels = np.asarray(image).copy()
        yy, xx = np.indices((64, 64))
        pixels[..., 0] = (xx * 7 + yy * 3) % 256
        pixels[..., 1] = (xx * 5 + yy * 5) % 256
        pixels[-1, :, :] = pixels[0, :, :]
        pixels[:, -1, :] = pixels[:, 0, :]
        image = Image.fromarray(pixels, "RGBA")
        result, metrics = _terrain_assay(image)
        self.assertTrue(np.array_equal(np.asarray(image)[..., 3], np.asarray(result)[..., 3]))
        self.assertEqual(metrics["mode"], "material-boundary-no-enclosure")
        self.assertTrue(metrics["assay"]["seams"]["passed"])

    def test_reviewed_packet_bytes_cannot_be_overwritten(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            path = Path(temporary) / "proof.json"
            _write_once_bytes(b"one", path)
            _write_once_bytes(b"one", path)
            with self.assertRaisesRegex(FileExistsError, "increment the packet revision"):
                _write_once_bytes(b"two", path)

    def test_calibration_provenance_hashes_are_current(self) -> None:
        evidence = _validate_calibration_provenance()
        self.assertEqual(evidence["runIds"], ["mgjrpg-02-ame-c-rendering-assay-a"])


if __name__ == "__main__":
    unittest.main()
