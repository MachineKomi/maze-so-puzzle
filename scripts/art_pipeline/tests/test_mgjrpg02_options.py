from __future__ import annotations

import hashlib
import json
import shutil
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from PIL import Image, ImageDraw


PACKAGE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PACKAGE))

from mgjrpg02_options import (  # noqa: E402
    AUTHORED_OPTION_INPUTS,
    CURRENT_AME_RELATIVE,
    FAMILY_TRANSFER_COMPARATOR_RELATIVE,
    FAMILY_TRANSFER_COMPONENTS,
    PACKET_REVISION,
    PROMPTS_RELATIVE,
    RUN_RECORD_RELATIVE,
    _image_fact,
    _validate_option_uniqueness,
    _validate_provenance,
    generate_mgjrpg02_options,
)
import validate as art_validate  # noqa: E402


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _draw_ame(path: Path, colour: tuple[int, int, int], accent: tuple[int, int, int]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image = Image.new("RGB", (96, 96), (249, 249, 249))
    draw = ImageDraw.Draw(image)
    for y in range(0, 96, 12):
        for x in range(0, 96, 12):
            if (x // 12 + y // 12) % 2:
                draw.rectangle((x, y, x + 11, y + 11), fill=(239, 239, 239))
    draw.ellipse((17, 4, 79, 92), fill=(72, 36, 83))
    draw.ellipse((21, 8, 75, 88), fill=colour)
    draw.ellipse((29, 20, 67, 56), fill=(255, 222, 194))
    draw.ellipse((36, 31, 43, 42), fill=accent)
    draw.ellipse((54, 31, 61, 42), fill=accent)
    draw.rectangle((32, 55, 64, 77), fill=accent)
    image.save(path, format="PNG", compress_level=9, optimize=False)


def _draw_board(path: Path, colour: tuple[int, int, int], offset: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image = Image.new("RGB", (120, 84), (255, 249, 239))
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((7 + offset, 8, 50 + offset, 73), radius=11, fill=colour, outline=(74, 40, 82), width=3)
    draw.ellipse((65 - offset, 15 + offset, 108 - offset, 65 + offset), fill=tuple(reversed(colour)), outline=(88, 47, 91), width=3)
    image.save(path, format="PNG", compress_level=9, optimize=False)


def _fact(path: Path, root: Path) -> dict[str, object]:
    return {
        "path": path.relative_to(root).as_posix(),
        "sha256": _sha256(path),
        "bytes": path.stat().st_size,
    }


def _make_fixture(root: Path, *, provenance: bool = True) -> None:
    colours = {
        "a": ((247, 196, 74), (48, 144, 218)),
        "b": ((181, 125, 224), (39, 177, 137)),
        "c": ((238, 111, 91), (69, 102, 206)),
    }
    _draw_ame(root / CURRENT_AME_RELATIVE, (246, 194, 69), (51, 136, 213))
    for row in AUTHORED_OPTION_INPUTS:
        path = root / row["path"]
        colour, accent = colours[row["option"]]
        if row["kind"] == "ame":
            _draw_ame(path, colour, accent)
        else:
            _draw_board(
                path,
                colour if row["kind"] == "sampler" else accent,
                {"a": 0, "b": 5, "c": 10}[row["option"]],
            )
    component_facts = []
    for component_index, row in enumerate(FAMILY_TRANSFER_COMPONENTS):
        component_path = root / row["path"]
        component_path.parent.mkdir(parents=True, exist_ok=True)
        Image.new(
            "RGBA",
            (32 + component_index, 30 + component_index),
            (
                70 + component_index * 12,
                95 + component_index * 8,
                120 + component_index * 5,
                255,
            ),
        ).save(component_path, format="PNG")
        component_facts.append(_fact(component_path, root))
    comparator_path = root / FAMILY_TRANSFER_COMPARATOR_RELATIVE
    _draw_board(comparator_path, (210, 165, 98), 3)
    comparator_fact = _fact(comparator_path, root)
    terrain = root / "public/assets/floor-woodland-dirt-v1.png"
    terrain.parent.mkdir(parents=True, exist_ok=True)
    Image.new("RGB", (64, 64), (111, 132, 79)).save(terrain, format="PNG")

    if not provenance:
        return
    prompts = root / PROMPTS_RELATIVE
    prompts.parent.mkdir(parents=True, exist_ok=True)
    prompts.write_text(
        "# Exact authored-options prompts\n\nFixture-only exact prompt evidence.\n",
        encoding="utf-8",
    )
    prompt_fact = _fact(prompts, root)
    input_facts = [
        {**row, **_fact(root / row["path"], root)}
        for row in AUTHORED_OPTION_INPUTS
    ]
    identity_fact = _fact(root / CURRENT_AME_RELATIVE, root)
    runs = []
    samplers_by_option = {
        str(fact["option"]): fact
        for fact in input_facts
        if fact["kind"] == "sampler"
    }
    for fact in input_facts:
        references = []
        if fact["kind"] == "family-transfer":
            sampler = samplers_by_option[str(fact["option"])]
            references = [
                {
                    "path": sampler["path"],
                    "sha256": sampler["sha256"],
                    "bytes": sampler["bytes"],
                    "authorityKind": "non-authority-generator-original-board",
                },
                {
                    **comparator_fact,
                    "authorityKind": (
                        "deterministic-comparison-layout-non-authority"
                    ),
                },
            ]
        runs.append(
            {
                "runId": f"fixture-{fact['id']}",
                "direction": fact["option"],
                "prompt": prompt_fact,
                "orderedReferences": references,
                "output": {
                    "immutableGeneratorOriginalPath": fact["path"],
                    "sha256": fact["sha256"],
                    "bytes": fact["bytes"],
                },
                "lineage": {
                    "editOfEdit": False,
                    "mayBeIdentityAuthority": False,
                    "mayBeRenderingAuthority": False,
                    "mayBeFutureEditTarget": False,
                },
            }
        )
    run_record = {
        "schema": "maze-art-generation-run/v1",
        "status": "pending-human-rendering-review",
        "identityAuthority": identity_fact,
        "referenceInput": comparator_fact,
        "referenceComponents": component_facts,
        "runs": runs,
    }
    (root / RUN_RECORD_RELATIVE).write_text(
        json.dumps(run_record, indent=2) + "\n",
        encoding="utf-8",
    )


class Mgjrpg02OptionsContractTests(unittest.TestCase):
    def test_inputs_are_independent_v02_originals_and_never_v08_assays(self) -> None:
        paths = [row["path"] for row in AUTHORED_OPTION_INPUTS]
        self.assertEqual(len(paths), 12)
        self.assertEqual(len(paths), len(set(paths)))
        self.assertTrue(all("/v02/" in path for path in paths))
        joined = "\n".join(paths).lower()
        self.assertNotIn("v08", joined)
        self.assertNotIn("assay", joined)
        self.assertNotIn("candidate", joined)

    def test_missing_prompt_and_run_record_fail_before_proof_generation(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            with self.assertRaisesRegex(FileNotFoundError, "requires immutable provenance"):
                _validate_provenance(
                    root,
                    [],
                    {
                        "path": CURRENT_AME_RELATIVE.as_posix(),
                        "sha256": "0" * 64,
                        "bytes": 0,
                    },
                    {
                        "path": FAMILY_TRANSFER_COMPARATOR_RELATIVE.as_posix(),
                        "sha256": "0" * 64,
                        "bytes": 0,
                        "components": [],
                    },
                )

    def test_duplicate_option_is_rejected_as_not_independent(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            _make_fixture(root, provenance=False)
            left = root / next(
                row["path"]
                for row in AUTHORED_OPTION_INPUTS
                if row["kind"] == "ame" and row["option"] == "a"
            )
            right = root / next(
                row["path"]
                for row in AUTHORED_OPTION_INPUTS
                if row["kind"] == "ame" and row["option"] == "b"
            )
            shutil.copyfile(left, right)
            facts = [
                {**row, **_image_fact(root / row["path"], root)}
                for row in AUTHORED_OPTION_INPUTS
            ]
            with self.assertRaisesRegex(ValueError, "hash-unique originals"):
                _validate_option_uniqueness(root, facts)


class Mgjrpg02OptionsPacketTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.temporary = tempfile.TemporaryDirectory()
        cls.root = Path(cls.temporary.name)
        _make_fixture(cls.root)
        cls.proof_root = cls.root / "artifacts/art-proofs"
        cls.result = generate_mgjrpg02_options(root=cls.root, proof_root=cls.proof_root)
        cls.packet = cls.proof_root / "mgjrpg-02" / PACKET_REVISION

    @classmethod
    def tearDownClass(cls) -> None:
        cls.temporary.cleanup()

    def test_packet_is_atomic_and_existing_revision_cannot_be_overwritten(self) -> None:
        index = self.packet / "proof-index.json"
        before = index.read_bytes()
        with self.assertRaisesRegex(FileExistsError, "increment the packet revision"):
            generate_mgjrpg02_options(root=self.root, proof_root=self.proof_root)
        self.assertEqual(index.read_bytes(), before)
        self.assertFalse((self.packet.parent / f".{PACKET_REVISION}.publish.lock").exists())
        self.assertFalse(any(self.packet.parent.glob(f".{PACKET_REVISION}-stage-*")))

    def test_proof_index_binds_every_input_provenance_and_output(self) -> None:
        index = json.loads((self.packet / "proof-index.json").read_text(encoding="utf-8"))
        self.assertEqual(index["schema"], "maze-art-mgjrpg02-authored-options-proof-index/v1")
        self.assertEqual(len(index["authoredInputs"]), 12)
        self.assertEqual(len(index["referenceInputs"]), 1)
        self.assertEqual(len(index["referenceInputs"][0]["components"]), 7)
        self.assertEqual(len(index["provenanceFiles"]), 2)
        for fact in [
            index["identityAuthority"],
            *index["referenceInputs"],
            *index["referenceInputs"][0]["components"],
            *index["authoredInputs"],
            *index["provenanceFiles"],
            *index["proofFiles"],
        ]:
            path = self.root / fact["path"]
            self.assertTrue(path.is_file(), fact["path"])
            self.assertEqual(_sha256(path), fact["sha256"])
            self.assertEqual(path.stat().st_size, fact["bytes"])

        report = json.loads(
            (self.packet / "mgjrpg-02-options-report.json").read_text(encoding="utf-8")
        )
        self.assertFalse(report["ameProofContract"]["synthesizedContour"])
        self.assertEqual(report["runtimeImpact"]["runtimeFilesChanged"], 0)
        self.assertTrue(report["optionUniqueness"]["allOptionFilesHashUniqueWithinFamily"])

    def test_packet_never_names_v08_or_an_assay_as_authority(self) -> None:
        evidence = "\n".join(
            path.read_text(encoding="utf-8")
            for path in (
                self.packet / "proof-index.json",
                self.packet / "mgjrpg-02-options-report.json",
                self.packet / "index.html",
            )
        ).lower()
        self.assertNotIn("v08", evidence)
        self.assertNotIn("mgjrpg02-assay", evidence)
        self.assertNotIn("ame-c-rendering-assay", evidence)
        self.assertIn("comparison-only", evidence)
        self.assertIn("immutable-human-approved-identity-and-construction", evidence)

    def test_validator_recursively_binds_authored_sources_and_packet_proofs(self) -> None:
        index_path = self.packet / "proof-index.json"
        review = {
            "recommendedPacket": {
                "revision": PACKET_REVISION,
                "proofRoot": index_path.parent.relative_to(self.root).as_posix(),
            },
            "evidence": [_fact(index_path, self.root)],
        }
        validation_patches = (
            patch.object(art_validate, "ROOT", self.root),
            patch.object(art_validate, "PROOF_ROOT", self.proof_root),
            patch.object(
                art_validate,
                "inside_root",
                lambda path, parent=self.root: path.resolve().is_relative_to(
                    parent.resolve()
                ),
            ),
        )
        with validation_patches[0], validation_patches[1], validation_patches[2]:
            clean_errors: list[dict[str, str]] = []
            art_validate._validate_mgjrpg02_proof_bundle(
                review, "review", clean_errors
            )
            self.assertEqual(clean_errors, [])

            source_path = self.root / AUTHORED_OPTION_INPUTS[0]["path"]
            original_source = source_path.read_bytes()
            try:
                source_path.write_bytes(b"tampered authored original")
                source_errors: list[dict[str, str]] = []
                art_validate._validate_mgjrpg02_proof_bundle(
                    review, "review", source_errors
                )
                self.assertIn(
                    "hash-mismatch", {row["code"] for row in source_errors}
                )
            finally:
                source_path.write_bytes(original_source)

            bound_reference_paths = [
                self.root / FAMILY_TRANSFER_COMPARATOR_RELATIVE,
                self.root / FAMILY_TRANSFER_COMPONENTS[0]["path"],
            ]
            for bound_path in bound_reference_paths:
                with self.subTest(boundReference=bound_path.name):
                    original_reference = bound_path.read_bytes()
                    try:
                        bound_path.write_bytes(b"tampered comparator evidence")
                        reference_errors: list[dict[str, str]] = []
                        art_validate._validate_mgjrpg02_proof_bundle(
                            review, "review", reference_errors
                        )
                        self.assertIn(
                            "hash-mismatch",
                            {row["code"] for row in reference_errors},
                        )
                    finally:
                        bound_path.write_bytes(original_reference)

            delivery_path = self.packet / "delivery/ame-a-40.png"
            original_delivery = delivery_path.read_bytes()
            try:
                delivery_path.write_bytes(b"tampered delivery proof")
                delivery_errors: list[dict[str, str]] = []
                art_validate._validate_mgjrpg02_proof_bundle(
                    review, "review", delivery_errors
                )
                self.assertIn(
                    "hash-mismatch", {row["code"] for row in delivery_errors}
                )
            finally:
                delivery_path.write_bytes(original_delivery)

    def test_validator_rejects_a_report_that_claims_synthesized_contours(self) -> None:
        index_path = self.packet / "proof-index.json"
        report_path = self.packet / "mgjrpg-02-options-report.json"
        review = {
            "recommendedPacket": {
                "revision": PACKET_REVISION,
                "proofRoot": index_path.parent.relative_to(self.root).as_posix(),
            },
            "evidence": [_fact(index_path, self.root)],
        }
        real_read_json = art_validate.read_json

        def read_with_false_claim(path: Path) -> object:
            value = real_read_json(path)
            if path.resolve() == report_path.resolve():
                value["ameProofContract"]["synthesizedContour"] = True
            return value

        with (
            patch.object(art_validate, "ROOT", self.root),
            patch.object(art_validate, "PROOF_ROOT", self.proof_root),
            patch.object(
                art_validate,
                "inside_root",
                lambda path, parent=self.root: path.resolve().is_relative_to(
                    parent.resolve()
                ),
            ),
            patch.object(art_validate, "read_json", side_effect=read_with_false_claim),
        ):
            errors: list[dict[str, str]] = []
            art_validate._validate_mgjrpg02_proof_bundle(review, "review", errors)
        self.assertIn(
            "mgjrpg02-options-report-proof-contract",
            {row["code"] for row in errors},
        )

    def test_validator_rejects_cross_direction_or_authoritative_board_reuse(self) -> None:
        index_path = self.packet / "proof-index.json"
        run_record_path = self.root / RUN_RECORD_RELATIVE
        index = json.loads(index_path.read_text(encoding="utf-8"))
        b_sampler = next(
            row
            for row in index["authoredInputs"]
            if row["option"] == "b" and row["kind"] == "sampler"
        )
        review = {
            "recommendedPacket": {
                "revision": PACKET_REVISION,
                "proofRoot": index_path.parent.relative_to(self.root).as_posix(),
            },
            "evidence": [_fact(index_path, self.root)],
        }
        real_read_json = art_validate.read_json

        def read_with_cross_direction_reference(path: Path) -> object:
            value = real_read_json(path)
            if path.resolve() == run_record_path.resolve():
                run = next(
                    row
                    for row in value["runs"]
                    if row["runId"] == "fixture-direction-a-family-transfer"
                )
                run["orderedReferences"][0] = {
                    "path": b_sampler["path"],
                    "sha256": b_sampler["sha256"],
                    "bytes": b_sampler["bytes"],
                    "authorityKind": "immutable-generator-original",
                }
            return value

        with (
            patch.object(art_validate, "ROOT", self.root),
            patch.object(art_validate, "PROOF_ROOT", self.proof_root),
            patch.object(
                art_validate,
                "inside_root",
                lambda path, parent=self.root: path.resolve().is_relative_to(
                    parent.resolve()
                ),
            ),
            patch.object(
                art_validate,
                "read_json",
                side_effect=read_with_cross_direction_reference,
            ),
        ):
            errors: list[dict[str, str]] = []
            art_validate._validate_mgjrpg02_proof_bundle(review, "review", errors)
        self.assertIn(
            "mgjrpg02-options-reference-direction",
            {row["code"] for row in errors},
        )


if __name__ == "__main__":
    unittest.main()
