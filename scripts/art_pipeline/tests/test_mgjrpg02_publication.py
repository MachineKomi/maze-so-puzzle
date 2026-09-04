from __future__ import annotations

import sys
import unittest
from math import cos, radians, sin
from pathlib import Path

from jsonschema import Draft202012Validator, FormatChecker
from PIL import Image


PACKAGE = Path(__file__).resolve().parents[1]
ROOT = PACKAGE.parents[1]
sys.path.insert(0, str(PACKAGE))

from model import read_json, sha256_file, validate_record_shape


class Mgjrpg02PublicationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.map_path = (
            ROOT
            / "docs/source-assets/publication/mgjrpg-02-plan03-runtime-map.json"
        )
        cls.report_path = (
            ROOT
            / "docs/source-assets/publication/mgjrpg-02-plan03-publication-report.json"
        )
        cls.decision_path = (
            ROOT
            / "docs/source-assets/calibrations/mgjrpg-02/v06/human-decision.json"
        )
        cls.mapping = read_json(cls.map_path)
        cls.report = read_json(cls.report_path)

    def test_exact_approved_projection_has_one_semantic_authority_per_source(self) -> None:
        rows = self.mapping["entries"]
        self.assertEqual(self.mapping["counts"], {"total": 144, "active": 100, "dormant": 44})
        for field in ("runId", "stableId", "catalogueTarget", "runtimePath", "recordId"):
            values = [row[field] for row in rows]
            self.assertEqual(len(values), len(set(values)), field)
        run_ids = {row["runId"] for row in rows}
        self.assertNotIn("batch-13-app-icon-ame-v03", run_ids)
        self.assertNotIn("batch-20-first-star-optical-v02", run_ids)
        self.assertFalse(any(run_id.startswith("batch-21-") for run_id in run_ids))

    def test_forward_decision_is_bound_to_exact_map(self) -> None:
        decision = read_json(self.decision_path)
        self.assertEqual(decision["selectionMap"]["sha256"], sha256_file(self.map_path))
        self.assertEqual(decision["selectionMap"]["entryCount"], 144)

    def test_runtime_derivatives_and_strict_records_match_report(self) -> None:
        report_rows = {row["stableId"]: row for row in self.report["entries"]}
        self.assertEqual(self.report["counts"]["published"], 144)
        for row in self.mapping["entries"]:
            with self.subTest(asset=row["stableId"]):
                reported = report_rows[row["stableId"]]
                runtime = ROOT / row["runtimePath"]
                record_path = ROOT / "docs/source-assets/records" / f"{row['recordId']}.json"
                self.assertTrue(runtime.is_file())
                self.assertEqual(sha256_file(runtime), reported["runtimeSha256"])
                record = read_json(record_path)
                self.assertEqual(record["validationProfile"], "strict-v2")
                self.assertEqual(record["approvalStatus"], "approved")
                self.assertEqual(record["runtimeStatus"], row["runtimeStatus"])
                self.assertEqual(validate_record_shape(record, row["recordId"]), [])

    def test_taxonomy_and_ring_blade_semantics_are_not_filename_aliases(self) -> None:
        rows = {row["stableId"]: row for row in self.mapping["entries"]}
        self.assertEqual(rows["green-tea-skeleton"]["family"], "friend")
        self.assertEqual(rows["green-tea-skeleton"]["runtimeStatus"], "dormant")
        self.assertEqual(rows["bubble-ring-blade"]["catalogueTarget"], "WEAPON_ART.bubble-ring-blade")
        self.assertFalse(any(row["stableId"] == "bubble-bow" for row in rows.values()))
        self.assertEqual(rows["splash-boots"]["catalogueTarget"], "PICKUP_ART.boots")
        self.assertEqual(rows["splash-boots"]["previousPath"], "/assets/boots.png")
        self.assertNotIn("normal-boots", rows)

    def test_weapon_geometry_is_complete_and_family_registered(self) -> None:
        weapon_rows = [row for row in self.report["entries"] if row["family"] == "weapon"]
        self.assertEqual(len(weapon_rows), 8)
        scales: set[float] = set()
        rotations: set[float] = set()
        for row in weapon_rows:
            geometry = row["geometry"]
            for field in (
                "gripPoint", "forwardAxisDegrees", "heldScale",
                "heldRotationDegrees", "zOrder",
            ):
                self.assertIn(field, geometry, f"{row['stableId']} missing {field}")
            self.assertAlmostEqual(
                geometry["forwardAxisDegrees"] + geometry["heldRotationDegrees"],
                -55.0,
            )
            self.assertGreaterEqual(geometry["heldScale"], 0.5)
            self.assertLessEqual(geometry["heldScale"], 0.7)
            self.assertIn(geometry["zOrder"], (1, 3))
            scales.add(geometry["heldScale"])
            rotations.add(geometry["heldRotationDegrees"])
        self.assertEqual(len(scales), 8)
        self.assertGreater(len(rotations), 4)
        by_id = {row["stableId"]: row for row in weapon_rows}
        self.assertEqual(by_id["bubble-ring-blade"]["geometry"]["zOrder"], 1)

    def test_held_weapon_alpha_extents_fit_every_registered_ame_context(self) -> None:
        contexts = (
            ("field", 0.92, 0.04, 0.09),
            ("battle", 0.94, 0.03, 0.07),
            ("portal", 0.94, 0.03, 0.07),
        )
        for row in (entry for entry in self.report["entries"] if entry["family"] == "weapon"):
            geometry = row["geometry"]
            grip_x, grip_y = geometry["gripPoint"]
            with Image.open(ROOT / row["runtimePath"]) as opened:
                alpha = opened.convert("RGBA").getchannel("A")
                points = [
                    ((x + 0.5) / alpha.width, (y + 0.5) / alpha.height)
                    for y in range(alpha.height)
                    for x in range(alpha.width)
                    if alpha.getpixel((x, y)) >= 16
                ]
            angle = radians(geometry["heldRotationDegrees"])
            cosine, sine = cos(angle), sin(angle)
            for context, actor_scale, actor_left, actor_top in contexts:
                scale = actor_scale * geometry["heldScale"]
                hand_x = actor_left + actor_scale * 0.66
                hand_y = actor_top + actor_scale * 0.58
                transformed = [
                    (
                        hand_x + cosine * ((x - grip_x) * scale) - sine * ((y - grip_y) * scale),
                        hand_y + sine * ((x - grip_x) * scale) + cosine * ((y - grip_y) * scale),
                    )
                    for x, y in points
                ]
                xs = [point[0] for point in transformed]
                ys = [point[1] for point in transformed]
                with self.subTest(asset=row["stableId"], context=context):
                    self.assertGreaterEqual(min(xs), 0.019)
                    self.assertGreaterEqual(min(ys), 0.019)
                    self.assertLessEqual(max(xs), 0.981)
                    self.assertLessEqual(max(ys), 0.981)

    def test_family_specific_geometry_anchors_are_complete_and_measured(self) -> None:
        rows = {row["stableId"]: row for row in self.report["entries"]}
        for stable_id in ("golden-heart", "storybook-wood", "moon-silver", "garden-vine"):
            geometry = rows[stable_id]["geometry"]
            self.assertEqual(geometry["baseline"], 0.94140625)
            self.assertGreaterEqual(geometry["openBay"][2], 0.36)
            self.assertGreaterEqual(geometry["openBay"][3], 0.32)
            self.assertIn("motifBox", geometry)

        for stable_id in ("door-rose-heart", "door-blue-star", "door-sunny-sun"):
            geometry = rows[stable_id]["geometry"]
            self.assertEqual(geometry["baseline"], 0.94140625)
            self.assertIn("motifBox", geometry)

        floor_portals = ("rose-heart", "mint-clover", "sunny-diamond", "violet-spade-bloom")
        for stable_id in (*floor_portals, "goal"):
            geometry = rows[stable_id]["geometry"]
            self.assertIn("apertureBox", geometry)
            self.assertIn("motifBox", geometry)
        for stable_id in floor_portals:
            self.assertEqual(rows[stable_id]["geometry"]["tileFootprint"], [0.0, 0.0, 1.0, 1.0])

        self.assertEqual(
            rows["ground-hole"]["geometry"]["rimBox"],
            rows["ground-hole"]["geometry"]["visibleBounds"],
        )
        self.assertEqual(rows["ground-hole"]["geometry"]["voidBox"], [0.296875, 0.3359375, 0.4296875, 0.4140625])
        self.assertEqual(rows["ground-hole"]["geometry"]["tileFootprint"], [0.0, 0.0, 1.0, 1.0])
        self.assertEqual(rows["floor-spikes-overlay"]["geometry"]["tileFootprint"], [0.0, 0.0, 1.0, 1.0])

        icon_rows = [
            row for row in self.report["entries"]
            if row["family"] in {"navigation", "reward"}
        ]
        self.assertEqual(len(icon_rows), 22)
        for row in icon_rows:
            self.assertEqual(row["geometry"]["opticalBounds"], row["geometry"]["visibleBounds"])
        self.assertEqual(
            rows["nav-muted"]["geometry"]["modifierBox"],
            [0.09375, 0.1484375, 0.7890625, 0.78125],
        )

        periodic_rows = [
            row for row in self.report["entries"]
            if row["family"] in {"terrain", "dressing"}
        ]
        self.assertTrue(periodic_rows)
        self.assertTrue(all("tileFootprint" not in row["geometry"] for row in periodic_rows))

        dressing_rows = [row for row in self.report["entries"] if row["family"] == "dressing"]
        self.assertEqual(len(dressing_rows), 4)
        for row in dressing_rows:
            with Image.open(ROOT / row["runtimePath"]) as opened:
                opened.load()
                self.assertEqual(opened.mode, "RGBA", row["stableId"])
                alpha = opened.getchannel("A")
                self.assertEqual(alpha.getextrema(), (0, 255), row["stableId"])
                bounds = alpha.point(lambda value: 255 if value >= 3 else 0).getbbox()
                self.assertIsNotNone(bounds, row["stableId"])
                assert bounds is not None
                self.assertGreaterEqual(min(bounds[0], bounds[1]), 4, row["stableId"])
                self.assertGreaterEqual(
                    min(opened.width - bounds[2], opened.height - bounds[3]),
                    4,
                    row["stableId"],
                )
            self.assertEqual(row["runtimeAlphaMode"], "straight")
            self.assertTrue(row["seamMetrics"]["passed"])

    def test_mimic_states_share_pixel_measured_registration_envelopes(self) -> None:
        rows = {row["stableId"]: row for row in self.report["entries"]}
        families = {
            "classic-mimic": (
                ("classic-mimic-revealed", "classic-mimic-closed", "classic-mimic-good-open"),
                0.921875,
                [0.078125, 0.078125, 0.84375, 0.84375],
            ),
            "candy-mimic": (
                ("candy-mimic", "candy-mimic-closed", "candy-mimic-good-open"),
                0.94140625,
                [0.0703125, 0.05859375, 0.859375, 0.8828125],
            ),
        }
        for family_id, (stable_ids, baseline, state_anchor) in families.items():
            for stable_id in stable_ids:
                geometry = rows[stable_id]["geometry"]
                self.assertEqual(geometry["class"], "item")
                self.assertEqual(geometry["pivot"], [0.5, baseline])
                self.assertEqual(geometry["baseline"], baseline)
                self.assertEqual(geometry["stateFamilyId"], family_id)
                self.assertEqual(geometry["stateAnchorBox"], state_anchor)
                self.assertAlmostEqual(
                    geometry["visibleBounds"][1] + geometry["visibleBounds"][3],
                    baseline,
                )

    def test_item_visual_centers_equal_visible_alpha_centroids(self) -> None:
        item_rows = [
            row for row in self.report["entries"]
            if row["geometry"]["class"] == "item"
        ]
        self.assertTrue(item_rows)
        for row in item_rows:
            with Image.open(ROOT / row["runtimePath"]) as opened:
                alpha = opened.convert("RGBA").getchannel("A")
                pixels = alpha.load()
                total = 0
                weighted_x = 0.0
                weighted_y = 0.0
                for y in range(alpha.height):
                    for x in range(alpha.width):
                        weight = int(pixels[x, y])
                        if weight <= 3:
                            continue
                        total += weight
                        weighted_x += (x + 0.5) * weight
                        weighted_y += (y + 0.5) * weight
            expected = [
                round(weighted_x / total / alpha.width, 8),
                round(weighted_y / total / alpha.height, 8),
            ]
            self.assertEqual(row["geometry"]["visualCenter"], expected, row["stableId"])

    def test_actor_landmark_authority_is_complete_or_explicitly_deferred(self) -> None:
        rows = {row["stableId"]: row for row in self.report["entries"]}
        self.assertEqual(rows["ame"]["geometry"]["faceBox"], [0.39, 0.19, 0.25, 0.20])
        self.assertEqual(rows["ame"]["geometry"]["eyeLine"], 0.28)
        self.assertEqual(rows["ame"]["geometry"]["groundLine"], 0.90)
        self.assertEqual(rows["ame"]["geometry"]["gripPoint"], [0.66, 0.58])

        floating_ids = {
            "moon-bat", "cloud-gremlin", "pitter-patter-parasol", "lanternling",
            "tessera-dolphin", "mallowmusk-aroma-wisp", "breezeling-sylph",
            "tidecurl-hippocamp",
        }
        actual_floating = {
            row["stableId"] for row in self.report["entries"]
            if row["geometry"]["class"] == "floating-actor"
        }
        self.assertEqual(actual_floating, floating_ids)
        for stable_id in floating_ids:
            geometry = rows[stable_id]["geometry"]
            self.assertEqual(geometry["pivot"], [0.5, 0.84])
            self.assertIn("floatCenter", geometry)

        deferred = self.report["deferredGeometry"]
        deferred_ids = {row["stableId"] for row in deferred}
        expected_deferred = {
            row["stableId"] for row in self.report["entries"]
            if row["stableId"] != "ame"
            and row["geometry"]["class"] in {"grounded-actor", "floating-actor"}
        } | {"goblin"}
        self.assertEqual(deferred_ids, expected_deferred)
        self.assertTrue(all(row["runtimeConsumerDependency"] is False for row in deferred))
        self.assertTrue(all("Plan 05" in row["entryGate"] for row in deferred))

    def test_all_prior_runtime_files_are_retained_for_plan12(self) -> None:
        rows = [row for row in self.mapping["entries"] if row["previousPath"]]
        self.assertEqual(len(rows), 100)
        for row in rows:
            previous = ROOT / "public" / row["previousPath"].lstrip("/")
            self.assertTrue(previous.is_file(), row["previousPath"])
            self.assertEqual(sha256_file(previous), row["previousSha256"])

    def test_retirement_ledger_matches_publication_and_manifest_contracts(self) -> None:
        ledger_path = (
            ROOT
            / "docs/source-assets/retirement/asset-retirement-ledger.json"
        )
        schema_path = (
            ROOT
            / "docs/source-assets/retirement/asset-retirement-ledger.schema.json"
        )
        manifest_path = ROOT / "docs/source-assets/manifest.json"
        ledger = read_json(ledger_path)
        schema = read_json(schema_path)
        manifest = read_json(manifest_path)

        Draft202012Validator.check_schema(schema)
        validator = Draft202012Validator(schema, format_checker=FormatChecker())
        schema_errors = [
            f"{'/'.join(str(part) for part in error.absolute_path)}: {error.message}"
            for error in sorted(
                validator.iter_errors(ledger),
                key=lambda error: tuple(str(part) for part in error.absolute_path),
            )
        ]
        self.assertEqual(schema_errors, [])

        entries = ledger["entries"]
        entries_by_path = {entry["assetPath"]: entry for entry in entries}
        self.assertEqual(len(entries_by_path), len(entries), "duplicate ledger assetPath")
        self.assertEqual(
            ledger["totals"],
            {
                "candidateCount": len(entries),
                "encodedBytes": sum(entry["bytes"] for entry in entries),
                "decodedBytesUpperBound": sum(
                    entry["decodedBytesUpperBound"] for entry in entries
                ),
                "plan12EligibleCount": sum(
                    bool(entry["eligibleForPlan12"]) for entry in entries
                ),
                "soleRepositoryCopyCount": sum(
                    bool(entry["preservation"]["soleRepositoryCopy"])
                    for entry in entries
                ),
                "partialMasterCount": sum(
                    entry["preservation"]["sourceStatus"] == "partial"
                    for entry in entries
                ),
            },
        )

        manifest_superseded = [
            image["path"]
            for image in manifest["runtimeImages"]
            if image["runtimeStatus"] == "superseded"
        ]
        self.assertEqual(
            len(manifest_superseded),
            len(set(manifest_superseded)),
            "duplicate superseded manifest path",
        )
        self.assertEqual(set(entries_by_path), set(manifest_superseded))

        archive_root = ledger["policy"]["archiveRoot"].replace("\\", "/").strip("/")
        self.assertFalse(
            archive_root == "public" or archive_root.startswith("public/"),
            f"archive root must stay outside public/: {archive_root}",
        )
        live_public_root = (ROOT / "public").resolve()
        for entry in entries:
            with self.subTest(asset=entry["assetPath"]):
                asset = ROOT / entry["assetPath"]
                self.assertTrue(asset.is_file())
                self.assertEqual(asset.stat().st_size, entry["bytes"])
                self.assertEqual(sha256_file(asset), entry["sha256"])
                self.assertEqual(entry["state"], "rollback-hold")
                self.assertIs(entry["eligibleForPlan12"], False)
                self.assertEqual(entry["runtimeReferences"], [])
                self.assertTrue(entry["replacementPaths"])
                for replacement_path in entry["replacementPaths"]:
                    self.assertTrue((ROOT / replacement_path).is_file(), replacement_path)

                archive_relative = entry["archiveRelativePath"].replace("\\", "/")
                self.assertFalse(archive_relative.startswith("public/"))
                archive_target = (ROOT / archive_root / archive_relative).resolve()
                self.assertFalse(archive_target.is_relative_to(live_public_root))

        prior_rows = [row for row in self.mapping["entries"] if row["previousPath"]]
        prior_by_path = {
            f"public/{row['previousPath'].lstrip('/')}": row for row in prior_rows
        }
        self.assertEqual(len(prior_by_path), len(prior_rows), "duplicate previousPath")
        self.assertTrue(set(prior_by_path).issubset(entries_by_path))
        for previous_path, row in prior_by_path.items():
            with self.subTest(previous=previous_path, replacement=row["runtimePath"]):
                previous = ROOT / previous_path
                ledger_entry = entries_by_path[previous_path]
                self.assertTrue(previous.is_file())
                self.assertEqual(previous.stat().st_size, row["previousBytes"])
                self.assertEqual(sha256_file(previous), row["previousSha256"])
                self.assertEqual(ledger_entry["bytes"], row["previousBytes"])
                self.assertEqual(ledger_entry["sha256"], row["previousSha256"])
                self.assertIn(row["runtimePath"], ledger_entry["replacementPaths"])


if __name__ == "__main__":
    unittest.main()
