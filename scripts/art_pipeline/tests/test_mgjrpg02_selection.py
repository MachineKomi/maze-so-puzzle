from __future__ import annotations

import hashlib
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from PIL import Image, ImageDraw


PACKAGE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PACKAGE))

from mgjrpg02_selection import (  # noqa: E402
    AME_DELIVERY_SIZES,
    AME_KEYS,
    AUTHORED_INPUTS,
    CALIBRATION_V02_RELATIVE,
    CURRENT_AME_RELATIVE,
    CURRENT_AME_TURNAROUND_RELATIVE,
    EXPECTED_RUN_REFERENCES,
    PACKET_REVISION,
    PACKET_SCHEMA,
    PACKET_STATUS,
    PORTAL_DELIVERY_SIZES,
    PROMPTS_V02_RELATIVE,
    PROMPTS_V03_RELATIVE,
    REFERENCE_INPUTS,
    REPORT_SCHEMA,
    RUN_RECORD_V02_RELATIVE,
    RUN_RECORD_V03_RELATIVE,
    generate_mgjrpg02_selection,
)
import validate as art_validate  # noqa: E402


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _fact(path: Path, root: Path) -> dict[str, object]:
    return {
        "path": path.relative_to(root).as_posix(),
        "sha256": _sha256(path),
        "bytes": path.stat().st_size,
    }


def _draw_rgb(path: Path, colour: tuple[int, int, int], *, seed: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image = Image.new("RGB", (128, 128), (249, 249, 249))
    draw = ImageDraw.Draw(image)
    for y in range(0, 128, 16):
        for x in range(0, 128, 16):
            if (x // 16 + y // 16) % 2:
                draw.rectangle((x, y, x + 15, y + 15), fill=(238, 238, 238))
    inset = 10 + seed % 8
    draw.ellipse((inset, 5, 122 - inset, 121), fill=(85, 44, 91), outline=(121, 71, 110), width=2)
    draw.ellipse((inset + 5, 10, 117 - inset, 116), fill=colour)
    draw.rectangle((43, 51, 85, 93), fill=((colour[1] + 40) % 255, (colour[2] + 70) % 255, (colour[0] + 90) % 255))
    image.save(path, format="PNG", compress_level=9, optimize=False)


def _draw_rgba(path: Path, colour: tuple[int, int, int]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw.ellipse((8, 18, 120, 112), fill=(90, 49, 88, 255))
    draw.ellipse((13, 23, 115, 107), fill=(*colour, 255))
    draw.ellipse((43, 48, 85, 90), fill=(245, 120, 169, 255))
    image.save(path, format="PNG", compress_level=9, optimize=False)


def _make_fixture(root: Path) -> None:
    source_rows: list[tuple[str, tuple[int, int, int], bool]] = [
        (CURRENT_AME_RELATIVE.as_posix(), (245, 196, 69), False),
        (CURRENT_AME_TURNAROUND_RELATIVE.as_posix(), (214, 154, 77), False),
        *((str(row["path"]), (110 + index * 11, 75 + index * 8, 145 + index * 7), row["id"] == "portal-rose-heart-current") for index, row in enumerate(REFERENCE_INPUTS)),
        *((str(row["path"]), (205 - index * 20, 112 + index * 18, 92 + index * 25), False) for index, row in enumerate(AUTHORED_INPUTS)),
    ]
    seen: set[str] = set()
    for seed, (relative, colour, native_alpha) in enumerate(source_rows):
        if relative in seen:
            continue
        seen.add(relative)
        if native_alpha:
            _draw_rgba(root / relative, colour)
        else:
            _draw_rgb(root / relative, colour, seed=seed)
    terrain = root / "public/assets/floor-woodland-dirt-v1.png"
    terrain.parent.mkdir(parents=True, exist_ok=True)
    Image.new("RGB", (64, 64), (105, 127, 77)).save(terrain, format="PNG")

    for path, label in ((PROMPTS_V02_RELATIVE, "v02"), (PROMPTS_V03_RELATIVE, "v03")):
        prompt = root / path
        prompt.parent.mkdir(parents=True, exist_ok=True)
        prompt.write_text(f"# Exact fixture {label} prompts\n", encoding="utf-8")

    prompt_v02 = _fact(root / PROMPTS_V02_RELATIVE, root)
    v02_bound = [
        _fact(root / CURRENT_AME_RELATIVE, root),
        *(
            _fact(root / str(row["path"]), root)
            for row in REFERENCE_INPUTS
            if row["path"] != CURRENT_AME_TURNAROUND_RELATIVE.as_posix()
        ),
    ]
    v02_record = {
        "schema": "maze-art-generation-run/v1",
        "prompt": prompt_v02,
        "boundComparisonInputs": v02_bound,
        "runs": [{"runId": "fixture-v02"}],
    }
    run_v02 = root / RUN_RECORD_V02_RELATIVE
    run_v02.parent.mkdir(parents=True, exist_ok=True)
    run_v02.write_text(json.dumps(v02_record, indent=2) + "\n", encoding="utf-8")

    prompt_v03 = _fact(root / PROMPTS_V03_RELATIVE, root)
    all_facts = {
        CURRENT_AME_RELATIVE.as_posix(): _fact(root / CURRENT_AME_RELATIVE, root),
        **{str(row["path"]): _fact(root / str(row["path"]), root) for row in REFERENCE_INPUTS},
    }
    runs = []
    for row in AUTHORED_INPUTS:
        output_fact = _fact(root / str(row["path"]), root)
        ordered = []
        for order, relative in enumerate(EXPECTED_RUN_REFERENCES[str(row["id"])], start=1):
            ordered.append(
                {
                    "order": order,
                    **all_facts[relative],
                    "role": "fixture-reference-role",
                    "authorityKind": "comparison-only",
                }
            )
        runs.append(
            {
                "runId": f"fixture-{row['id']}",
                "kind": row["kind"],
                "generationMode": "fresh-reference-led-generation",
                "prompt": {**prompt_v03, "blockId": f"fixture-{row['id']}"},
                "orderedReferences": ordered,
                "output": {
                    "immutableGeneratorOriginalPath": output_fact["path"],
                    "sha256": output_fact["sha256"],
                    "bytes": output_fact["bytes"],
                    "outputId": f"fixture-output-{row['id']}",
                },
                "lineage": {
                    "editOfEdit": False,
                    "editTargetPath": None,
                    "mayBeIdentityAuthority": False,
                    "mayBeRenderingAuthority": False,
                    "mayBeFutureEditTarget": False,
                },
            }
        )
    run_v03_record = {
        "schema": "maze-art-generation-run/v1",
        "status": "pending-human-rendering-review",
        "promptFile": prompt_v03,
        "identityAuthority": all_facts[CURRENT_AME_RELATIVE.as_posix()],
        "comparisonOnlyFallback": {
            **all_facts[str(REFERENCE_INPUTS[0]["path"])],
            "role": "human-preferred-ame-rendering-fallback-comparison-only",
            "generationInput": False,
        },
        "referenceInputs": list(all_facts.values()),
        "runs": runs,
    }
    run_v03 = root / RUN_RECORD_V03_RELATIVE
    run_v03.parent.mkdir(parents=True, exist_ok=True)
    run_v03.write_text(json.dumps(run_v03_record, indent=2) + "\n", encoding="utf-8")


class Mgjrpg02SelectionPacketTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.temporary = tempfile.TemporaryDirectory()
        cls.root = Path(cls.temporary.name)
        _make_fixture(cls.root)
        cls.proof_root = cls.root / "artifacts/art-proofs"
        cls.result = generate_mgjrpg02_selection(root=cls.root, proof_root=cls.proof_root)
        cls.packet = cls.proof_root / "mgjrpg-02" / PACKET_REVISION

    @classmethod
    def tearDownClass(cls) -> None:
        cls.temporary.cleanup()

    def test_packet_is_immutable_and_has_zero_runtime_impact(self) -> None:
        index_path = self.packet / "proof-index.json"
        before = index_path.read_bytes()
        with self.assertRaisesRegex(FileExistsError, "increment the packet revision"):
            generate_mgjrpg02_selection(root=self.root, proof_root=self.proof_root)
        self.assertEqual(index_path.read_bytes(), before)
        index = json.loads(before)
        self.assertEqual(index["schema"], PACKET_SCHEMA)
        self.assertEqual(index["status"], PACKET_STATUS)
        self.assertEqual(index["runtimeImpact"], {"files": 0, "encodedBytes": 0, "decodedBytes": 0})

    def test_index_binds_all_sources_provenance_and_outputs(self) -> None:
        index = json.loads((self.packet / "proof-index.json").read_text(encoding="utf-8"))
        self.assertEqual(len(index["authoredInputs"]), 4)
        self.assertEqual(len(index["referenceInputs"]), 10)
        self.assertEqual(len(index["provenanceFiles"]), 4)
        self.assertEqual(len(index["proofFiles"]), 48)
        for fact in [
            index["identityAuthority"],
            *index["referenceInputs"],
            *index["authoredInputs"],
            *index["provenanceFiles"],
            *index["proofFiles"],
        ]:
            path = self.root / fact["path"]
            self.assertTrue(path.is_file(), fact["path"])
            self.assertEqual(_sha256(path), fact["sha256"])
            self.assertEqual(path.stat().st_size, fact["bytes"])

    def test_exact_ame_and_portal_delivery_outputs_exist(self) -> None:
        self.assertTrue(
            (self.packet / "ame-full-sprite-actual-size-backgrounds.png").is_file()
        )
        for key in AME_KEYS:
            self.assertTrue((self.packet / f"derived/ame-{key}-registered-512.png").is_file())
            for size in AME_DELIVERY_SIZES:
                path = self.packet / f"delivery/ame-{key}-{size}.png"
                with Image.open(path) as image:
                    self.assertEqual(image.size, (size, size))
        for key in ("current", "fresh"):
            self.assertTrue((self.packet / f"derived/rose-floor-pad-{key}-registered-512.png").is_file())
            for size in PORTAL_DELIVERY_SIZES:
                path = self.packet / f"delivery/rose-floor-pad-{key}-{size}.png"
                with Image.open(path) as image:
                    self.assertEqual(image.size, (size, size))

    def test_report_denies_authority_and_prior_b_generation_input(self) -> None:
        report = json.loads((self.packet / "mgjrpg-02-selection-report.json").read_text(encoding="utf-8"))
        self.assertEqual(report["schema"], REPORT_SCHEMA)
        self.assertFalse(report["ameProofContract"]["synthesizedContour"])
        self.assertEqual(
            report["ameProofContract"]["fullSpriteBackgroundSizes"],
            [103, 77, 56, 40],
        )
        self.assertEqual(
            report["ameProofContract"]["fullSpriteBackgrounds"],
            ["paper", "ink plum", "magenta QA", "cyan QA", "woodland floor"],
        )
        self.assertFalse(report["portalProofContract"]["synthesizedContour"])
        self.assertFalse(report["freshness"]["priorBAmeUsedAsGenerationInput"])
        self.assertFalse(report["authority"]["runtimePublicationApproved"])
        source = json.dumps(report).lower()
        self.assertNotIn('"recommendation"', source)

    def test_v03_lineage_excludes_prior_b_and_preserves_actual_reference_order(self) -> None:
        run_record = json.loads((self.root / RUN_RECORD_V03_RELATIVE).read_text(encoding="utf-8"))
        prior_b = str(REFERENCE_INPUTS[0]["path"])
        for run in run_record["runs"]:
            paths = [row["path"] for row in run["orderedReferences"]]
            self.assertNotIn(prior_b, paths)
            output_path = run["output"]["immutableGeneratorOriginalPath"]
            source = next(row for row in AUTHORED_INPUTS if row["path"] == output_path)
            self.assertEqual(tuple(paths), EXPECTED_RUN_REFERENCES[str(source["id"])])

    def test_validator_recursively_binds_v14_packet(self) -> None:
        index_path = self.packet / "proof-index.json"
        review = {
            "recommendedPacket": {
                "revision": PACKET_REVISION,
                "proofRoot": index_path.parent.relative_to(self.root).as_posix(),
            },
            "evidence": [_fact(index_path, self.root)],
        }
        with (
            patch.object(art_validate, "ROOT", self.root),
            patch.object(art_validate, "PROOF_ROOT", self.proof_root),
            patch.object(
                art_validate,
                "inside_root",
                lambda path, parent=self.root: path.resolve().is_relative_to(parent.resolve()),
            ),
        ):
            errors: list[dict[str, str]] = []
            art_validate._validate_mgjrpg02_proof_bundle(review, "review", errors)
        self.assertEqual(errors, [])

    def test_validator_detects_tampered_delivery_proof(self) -> None:
        index_path = self.packet / "proof-index.json"
        review = {
            "recommendedPacket": {
                "revision": PACKET_REVISION,
                "proofRoot": index_path.parent.relative_to(self.root).as_posix(),
            },
            "evidence": [_fact(index_path, self.root)],
        }
        delivery = self.packet / "delivery/ame-fresh-02-40.png"
        original = delivery.read_bytes()
        try:
            delivery.write_bytes(b"tampered-v14-delivery")
            with (
                patch.object(art_validate, "ROOT", self.root),
                patch.object(art_validate, "PROOF_ROOT", self.proof_root),
                patch.object(
                    art_validate,
                    "inside_root",
                    lambda path, parent=self.root: path.resolve().is_relative_to(parent.resolve()),
                ),
            ):
                errors: list[dict[str, str]] = []
                art_validate._validate_mgjrpg02_proof_bundle(review, "review", errors)
            self.assertIn("hash-mismatch", {row["code"] for row in errors})
        finally:
            delivery.write_bytes(original)

    def test_validator_rejects_prior_b_as_a_generation_reference(self) -> None:
        index_path = self.packet / "proof-index.json"
        run_path = self.root / RUN_RECORD_V03_RELATIVE
        review = {
            "recommendedPacket": {
                "revision": PACKET_REVISION,
                "proofRoot": index_path.parent.relative_to(self.root).as_posix(),
            },
            "evidence": [_fact(index_path, self.root)],
        }
        real_read_json = art_validate.read_json

        def read_with_prior_b_reference(path: Path) -> object:
            value = real_read_json(path)
            if path.resolve() == run_path.resolve():
                prior_b = next(
                    row
                    for row in value["referenceInputs"]
                    if row["path"] == str(REFERENCE_INPUTS[0]["path"])
                )
                run = value["runs"][0]
                run["orderedReferences"][1] = {
                    "order": 2,
                    **prior_b,
                    "authorityKind": "comparison-only",
                }
            return value

        with (
            patch.object(art_validate, "ROOT", self.root),
            patch.object(art_validate, "PROOF_ROOT", self.proof_root),
            patch.object(
                art_validate,
                "inside_root",
                lambda path, parent=self.root: path.resolve().is_relative_to(parent.resolve()),
            ),
            patch.object(art_validate, "read_json", side_effect=read_with_prior_b_reference),
        ):
            errors: list[dict[str, str]] = []
            art_validate._validate_mgjrpg02_proof_bundle(review, "review", errors)
        self.assertIn(
            "mgjrpg02-selection-prior-ame-generation-input",
            {row["code"] for row in errors},
        )


if __name__ == "__main__":
    unittest.main()
