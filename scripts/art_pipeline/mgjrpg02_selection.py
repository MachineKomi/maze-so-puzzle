"""Immutable v14 review packet for the Human-selected ``mgjrpg-02`` blend.

This packet is deliberately separate from the v11 A/B/C exploration.  It binds
the approved Candidate C identity, the Human-preferred v11 references, and three
fresh v03 generator originals without granting any of the comparison images
runtime, identity, rendering, or future-edit authority.
"""

from __future__ import annotations

import html
import json
import os
import shutil
import tempfile
from pathlib import Path
from typing import Any, Iterator

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps

from cutout import normalize_to_srgb_rgba, premultiplied_resize, prepare_cutout
from encode import encoder_environment, save_image
from model import PROOF_ROOT, ROOT, sha256_file


PACKET_REVISION = "v14"
PACKET_SCHEMA = "maze-art-mgjrpg02-selection-proof-index/v1"
REPORT_SCHEMA = "maze-art-mgjrpg02-selection-report/v1"
PACKET_STATUS = "pending-human-ame-and-extension-review"

CALIBRATION_V02_RELATIVE = Path("docs/source-assets/calibrations/mgjrpg-02/v02")
CALIBRATION_V03_RELATIVE = Path("docs/source-assets/calibrations/mgjrpg-02/v03")
PROMPTS_V02_RELATIVE = CALIBRATION_V02_RELATIVE / "PROMPTS.md"
RUN_RECORD_V02_RELATIVE = CALIBRATION_V02_RELATIVE / "run-record.json"
PROMPTS_V03_RELATIVE = CALIBRATION_V03_RELATIVE / "PROMPTS.md"
RUN_RECORD_V03_RELATIVE = CALIBRATION_V03_RELATIVE / "run-record.json"

CURRENT_AME_RELATIVE = Path(
    "docs/source-assets/characters/ame/v02/"
    "ame-v02-candidate-c-generator-original.png"
)
CURRENT_AME_TURNAROUND_RELATIVE = Path(
    "docs/source-assets/characters/ame/v02/"
    "ame-v02-candidate-c-turnaround-study.png"
)
PRIOR_B_AME_RELATIVE = (
    CALIBRATION_V02_RELATIVE
    / "ame-v02-rendering-option-b-generator-original.png"
)
CURRENT_ROSE_PORTAL_RELATIVE = Path("docs/source-assets/portal-rose-heart-v1.png")

AUTHORED_INPUTS: tuple[dict[str, str], ...] = (
    {
        "id": "ame-b-fresh-01",
        "kind": "ame-fresh",
        "path": (
            CALIBRATION_V03_RELATIVE
            / "ame-v02-rendering-b-fresh-01-generator-original.png"
        ).as_posix(),
    },
    {
        "id": "ame-b-fresh-02",
        "kind": "ame-fresh",
        "path": (
            CALIBRATION_V03_RELATIVE
            / "ame-v02-rendering-b-fresh-02-generator-original.png"
        ).as_posix(),
    },
    {
        "id": "future-enemy-hybrid-01",
        "kind": "future-enemy-hybrid",
        "path": (
            CALIBRATION_V03_RELATIVE
            / "future-enemy-hybrid-01-generator-original.png"
        ).as_posix(),
    },
    {
        "id": "rose-heart-floor-pad-hybrid-01",
        "kind": "rose-floor-pad-hybrid",
        "path": (
            CALIBRATION_V03_RELATIVE
            / "rose-heart-floor-pad-hybrid-01-generator-original.png"
        ).as_posix(),
    },
)

REFERENCE_INPUTS: tuple[dict[str, Any], ...] = (
    {
        "id": "ame-prior-direction-b",
        "kind": "ame-rendering-comparison",
        "selectionRole": "human-preferred-ame-rendering-fallback",
        "generationReferenceAllowed": False,
        "path": PRIOR_B_AME_RELATIVE.as_posix(),
    },
    {
        "id": "ame-candidate-c-turnaround",
        "kind": "ame-construction-cross-check",
        "selectionRole": "approved-ame-construction-cross-check",
        "generationReferenceAllowed": True,
        "path": CURRENT_AME_TURNAROUND_RELATIVE.as_posix(),
    },
    {
        "id": "core-sampler-a",
        "kind": "core-sampler",
        "selectionRole": "human-selected-core-default",
        "generationReferenceAllowed": True,
        "path": (CALIBRATION_V02_RELATIVE / "direction-a-sampler-generator-original.png").as_posix(),
    },
    {
        "id": "core-sampler-b",
        "kind": "core-sampler",
        "selectionRole": "ame-rendering-style-reference",
        "generationReferenceAllowed": True,
        "path": (CALIBRATION_V02_RELATIVE / "direction-b-sampler-generator-original.png").as_posix(),
    },
    {
        "id": "core-sampler-c",
        "kind": "core-sampler",
        "selectionRole": "human-selected-core-exceptions-tea-skeleton-slime-sword-lizard",
        "generationReferenceAllowed": False,
        "path": (CALIBRATION_V02_RELATIVE / "direction-c-sampler-generator-original.png").as_posix(),
    },
    {
        "id": "family-transfer-a",
        "kind": "family-transfer",
        "selectionRole": "human-approved-family-construction-contour",
        "generationReferenceAllowed": True,
        "path": (CALIBRATION_V02_RELATIVE / "direction-a-family-transfer-generator-original.png").as_posix(),
    },
    {
        "id": "family-transfer-b",
        "kind": "family-transfer",
        "selectionRole": "human-preferred-family-colour-shading",
        "generationReferenceAllowed": True,
        "path": (CALIBRATION_V02_RELATIVE / "direction-b-family-transfer-generator-original.png").as_posix(),
    },
    {
        "id": "enemy-extension-a",
        "kind": "future-enemy-extension",
        "selectionRole": "human-selected-succubus-concept",
        "generationReferenceAllowed": True,
        "path": (CALIBRATION_V02_RELATIVE / "direction-a-enemy-extension-generator-original.png").as_posix(),
    },
    {
        "id": "enemy-extension-b",
        "kind": "future-enemy-extension",
        "selectionRole": "human-selected-future-enemy-concepts",
        "generationReferenceAllowed": True,
        "path": (CALIBRATION_V02_RELATIVE / "direction-b-enemy-extension-generator-original.png").as_posix(),
    },
    {
        "id": "portal-rose-heart-current",
        "kind": "portal-floor-pad",
        "selectionRole": "human-retained-floor-pad-concept",
        "generationReferenceAllowed": True,
        "path": CURRENT_ROSE_PORTAL_RELATIVE.as_posix(),
    },
)

EXPECTED_RUN_REFERENCES: dict[str, tuple[str, ...]] = {
    "ame-b-fresh-01": (
        CURRENT_AME_RELATIVE.as_posix(),
        (CALIBRATION_V02_RELATIVE / "direction-b-sampler-generator-original.png").as_posix(),
        (CALIBRATION_V02_RELATIVE / "direction-b-family-transfer-generator-original.png").as_posix(),
    ),
    "ame-b-fresh-02": (
        CURRENT_AME_RELATIVE.as_posix(),
        CURRENT_AME_TURNAROUND_RELATIVE.as_posix(),
        (CALIBRATION_V02_RELATIVE / "direction-b-sampler-generator-original.png").as_posix(),
        (CALIBRATION_V02_RELATIVE / "direction-b-family-transfer-generator-original.png").as_posix(),
    ),
    "future-enemy-hybrid-01": (
        (CALIBRATION_V02_RELATIVE / "direction-a-sampler-generator-original.png").as_posix(),
        (CALIBRATION_V02_RELATIVE / "direction-a-family-transfer-generator-original.png").as_posix(),
        (CALIBRATION_V02_RELATIVE / "direction-b-family-transfer-generator-original.png").as_posix(),
        (CALIBRATION_V02_RELATIVE / "direction-b-enemy-extension-generator-original.png").as_posix(),
        (CALIBRATION_V02_RELATIVE / "direction-a-enemy-extension-generator-original.png").as_posix(),
    ),
    "rose-heart-floor-pad-hybrid-01": (
        CURRENT_ROSE_PORTAL_RELATIVE.as_posix(),
        (CALIBRATION_V02_RELATIVE / "direction-a-family-transfer-generator-original.png").as_posix(),
        (CALIBRATION_V02_RELATIVE / "direction-b-family-transfer-generator-original.png").as_posix(),
    ),
}

AME_DELIVERY_SIZES: tuple[int, ...] = (155, 103, 84, 77, 64, 56, 40)
AME_BACKGROUND_PROOF_SIZES: tuple[int, ...] = (103, 77, 56, 40)
PORTAL_DELIVERY_SIZES: tuple[int, ...] = (84, 64)
MASTER_SIZE = 512
AME_KEYS: tuple[str, ...] = ("current", "prior-b", "fresh-01", "fresh-02")
AME_LABELS = {
    "current": "Candidate C - identity authority",
    "prior-b": "Prior Direction B - fallback only",
    "fresh-01": "Fresh B-led 01 - pending Human",
    "fresh-02": "Fresh B-led 02 - pending Human",
}

AME_REGISTRATION = {
    "targetBox": [0.08, 0.085, 0.92, 0.9],
    "align": [0.5, 1.0],
    "alphaThreshold": 3,
}
PORTAL_REGISTRATION = {
    "targetBox": [0.08, 0.08, 0.92, 0.92],
    "align": [0.5, 0.5],
    "alphaThreshold": 3,
}
CHECKER_EXTRACTION = {
    "mode": "outer-contour-barrier",
    "recipeId": "mgjrpg-02-selection-contour-l190-chroma8-close2-trim235-v1",
    "barrierMaximumLuminance": 190,
    "barrierMinimumChroma": 8,
    "barrierClosingRadius": 2,
    "exteriorTrimMinimumLuminance": 235,
    "exteriorTrimMaximumChroma": 20,
}

BACKGROUNDS: tuple[tuple[str, tuple[int, int, int, int] | str], ...] = (
    ("paper", (255, 250, 238, 255)),
    ("ink plum", (45, 32, 56, 255)),
    ("middle gray", (128, 128, 128, 255)),
    ("magenta QA", (255, 0, 255, 255)),
    ("cyan QA", (0, 225, 235, 255)),
    ("woodland floor", "public/assets/floor-woodland-dirt-v1.png"),
)
FULL_SPRITE_BACKGROUNDS: tuple[
    tuple[str, tuple[int, int, int, int] | str], ...
] = tuple(row for row in BACKGROUNDS if row[0] != "middle gray")
CONTOUR_CROPS: tuple[tuple[str, tuple[int, int, int, int]], ...] = (
    ("crown + hair", (190, 35, 322, 167)),
    ("cape + sleeve", (105, 185, 237, 317)),
    ("hem + boots", (180, 330, 312, 462)),
)


def _font(size: int = 18) -> ImageFont.ImageFont:
    return ImageFont.load_default(size=size)


def _repo_relative(path: Path, root: Path) -> str:
    return path.resolve().relative_to(root.resolve()).as_posix()


def _json_bytes(value: Any) -> bytes:
    return (json.dumps(value, indent=2, sort_keys=True, ensure_ascii=False) + "\n").encode("utf-8")


def _write_bytes(value: bytes, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    with destination.open("xb") as stream:
        stream.write(value)
        stream.flush()
        os.fsync(stream.fileno())


def _write_png(image: Image.Image, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists():
        raise FileExistsError(f"Refusing to overwrite proof output: {destination}")
    save_image(image, destination, "png", {"compress_level": 9, "optimize": False})


def _image_fact(path: Path, root: Path, **metadata: Any) -> dict[str, Any]:
    with Image.open(path) as source:
        source.load()
        width, height = source.size
        mode = source.mode
    return {
        **metadata,
        "path": _repo_relative(path, root),
        "sha256": sha256_file(path),
        "bytes": path.stat().st_size,
        "width": width,
        "height": height,
        "mode": mode,
        "decodedBytesUpperBound": width * height * 4,
    }


def _file_fact(path: Path, root: Path) -> dict[str, Any]:
    return {
        "path": _repo_relative(path, root),
        "sha256": sha256_file(path),
        "bytes": path.stat().st_size,
    }


def _artifact_fact(path: Path, logical_path: str) -> dict[str, Any]:
    fact: dict[str, Any] = {
        "path": logical_path,
        "sha256": sha256_file(path),
        "bytes": path.stat().st_size,
    }
    if path.suffix.lower() == ".png":
        with Image.open(path) as source:
            source.load()
            fact.update(
                {
                    "width": source.width,
                    "height": source.height,
                    "mode": source.mode,
                    "decodedBytesUpperBound": source.width * source.height * 4,
                    "mediaType": "image/png",
                }
            )
    elif path.suffix.lower() == ".json":
        fact["mediaType"] = "application/json"
    elif path.suffix.lower() == ".html":
        fact["mediaType"] = "text/html; charset=utf-8"
    return fact


def _walk_dicts(value: Any) -> Iterator[dict[str, Any]]:
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from _walk_dicts(child)
    elif isinstance(value, list):
        for child in value:
            yield from _walk_dicts(child)


def _has_exact_binding(value: Any, fact: dict[str, Any]) -> bool:
    for row in _walk_dicts(value):
        path_match = any(
            row.get(field) == fact["path"]
            for field in ("path", "immutableGeneratorOriginalPath", "outputPath")
        )
        if path_match and row.get("sha256") == fact["sha256"] and row.get("bytes") == fact["bytes"]:
            return True
    return False


def _open_image(path: Path) -> Image.Image:
    with Image.open(path) as source:
        source.load()
        return normalize_to_srgb_rgba(source)


def _reference_path(reference_id: str) -> str:
    return str(next(row["path"] for row in REFERENCE_INPUTS if row["id"] == reference_id))


def _authored_path(authored_id: str) -> str:
    return str(next(row["path"] for row in AUTHORED_INPUTS if row["id"] == authored_id))


def _fit(source: Image.Image, size: tuple[int, int], *, padding: int = 0) -> Image.Image:
    image = normalize_to_srgb_rgba(source)
    available = (max(1, size[0] - padding * 2), max(1, size[1] - padding * 2))
    scale = min(available[0] / image.width, available[1] / image.height)
    fitted = premultiplied_resize(
        image,
        (max(1, round(image.width * scale)), max(1, round(image.height * scale))),
    )
    result = Image.new("RGBA", size, (0, 0, 0, 0))
    result.alpha_composite(fitted, ((size[0] - fitted.width) // 2, (size[1] - fitted.height) // 2))
    return result


def _checker(size: tuple[int, int], cell: int = 12) -> Image.Image:
    result = Image.new("RGBA", size, (249, 246, 251, 255))
    draw = ImageDraw.Draw(result)
    for y in range(0, size[1], cell):
        for x in range(0, size[0], cell):
            if (x // cell + y // cell) % 2:
                draw.rectangle(
                    (x, y, min(size[0] - 1, x + cell - 1), min(size[1] - 1, y + cell - 1)),
                    fill=(229, 223, 234, 255),
                )
    return result


def _background_tile(root: Path, descriptor: tuple[int, int, int, int] | str, size: tuple[int, int]) -> Image.Image:
    if isinstance(descriptor, tuple):
        return Image.new("RGBA", size, descriptor)
    source = _open_image(root / descriptor).resize((64, 64), Image.Resampling.LANCZOS)
    result = Image.new("RGBA", size, (0, 0, 0, 255))
    for y in range(0, size[1], source.height):
        for x in range(0, size[0], source.width):
            result.alpha_composite(source, (x, y))
    return result


def _panel_title(draw: ImageDraw.ImageDraw, title: str, subtitle: str) -> None:
    draw.text((28, 18), title, font=_font(26), fill=(53, 34, 67, 255))
    draw.text((28, 54), subtitle, font=_font(16), fill=(102, 76, 111, 255))


def _validate_provenance(
    root: Path,
    authored_facts: list[dict[str, Any]],
    identity_fact: dict[str, Any],
    reference_facts: list[dict[str, Any]],
) -> dict[str, Any]:
    provenance_paths = (
        PROMPTS_V02_RELATIVE,
        RUN_RECORD_V02_RELATIVE,
        PROMPTS_V03_RELATIVE,
        RUN_RECORD_V03_RELATIVE,
    )
    missing = [path.as_posix() for path in provenance_paths if not (root / path).is_file()]
    if missing:
        raise FileNotFoundError(
            "mgjrpg-02 v14 requires immutable v02 and v03 provenance before proof generation; missing: "
            + ", ".join(missing)
        )

    v02 = json.loads((root / RUN_RECORD_V02_RELATIVE).read_text(encoding="utf-8-sig"))
    v03 = json.loads((root / RUN_RECORD_V03_RELATIVE).read_text(encoding="utf-8-sig"))
    prompt_v02_fact = _file_fact(root / PROMPTS_V02_RELATIVE, root)
    run_v02_fact = _file_fact(root / RUN_RECORD_V02_RELATIVE, root)
    prompt_v03_fact = _file_fact(root / PROMPTS_V03_RELATIVE, root)
    run_v03_fact = _file_fact(root / RUN_RECORD_V03_RELATIVE, root)

    if not _has_exact_binding(v02, prompt_v02_fact):
        raise ValueError("v02 run record must retain an exact PROMPTS.md binding")
    v02_bound_facts = [
        identity_fact,
        *(
            fact
            for fact in reference_facts
            if fact["path"] != CURRENT_AME_TURNAROUND_RELATIVE.as_posix()
        ),
    ]
    for fact in v02_bound_facts:
        if not _has_exact_binding(v02, fact):
            raise ValueError(f"v02 run record does not bind comparison source {fact['path']}")

    if not _has_exact_binding(v03, prompt_v03_fact):
        raise ValueError("v03 run record must bind v03/PROMPTS.md by exact path, hash, and bytes")
    if not _has_exact_binding(v03, identity_fact):
        raise ValueError("v03 run record must bind Candidate C identity authority")

    reference_by_path = {str(fact["path"]): fact for fact in reference_facts}
    reference_by_path[str(identity_fact["path"])] = identity_fact
    prior_b_path = PRIOR_B_AME_RELATIVE.as_posix()
    prior_b_fact = reference_by_path[prior_b_path]
    fallback = v03.get("comparisonOnlyFallback")
    if (
        not isinstance(fallback, dict)
        or not _has_exact_binding(fallback, prior_b_fact)
        or fallback.get("generationInput") is not False
    ):
        raise ValueError(
            "v03 must exactly bind prior Direction B Ame as a comparison-only, non-generation fallback"
        )
    runs = v03.get("runs")
    if not isinstance(runs, list) or len(runs) != len(authored_facts):
        raise ValueError("v03 run record must contain exactly one run per authored v03 original")

    run_ids: list[str] = []
    for fact in authored_facts:
        owning = [run for run in runs if isinstance(run, dict) and _has_exact_binding(run.get("output"), fact)]
        if len(owning) != 1:
            raise ValueError(f"{fact['path']} must be owned by exactly one v03 run.output")
        run = owning[0]
        run_id = run.get("runId")
        if not isinstance(run_id, str) or not run_id:
            raise ValueError("Every v03 run requires a nonempty runId")
        run_ids.append(run_id)
        if run.get("kind") != fact["kind"]:
            raise ValueError(f"{run_id} kind must equal {fact['kind']!r}")
        if run.get("generationMode") != "fresh-reference-led-generation":
            raise ValueError(f"{run_id} must record fresh-reference-led-generation")
        if not _has_exact_binding(run.get("prompt"), prompt_v03_fact):
            raise ValueError(f"{run_id} must bind the exact v03 prompt file")
        lineage = run.get("lineage")
        if not isinstance(lineage, dict) or any(
            lineage.get(field) is not False
            for field in (
                "editOfEdit",
                "mayBeIdentityAuthority",
                "mayBeRenderingAuthority",
                "mayBeFutureEditTarget",
            )
        ) or lineage.get("editTargetPath") is not None:
            raise ValueError(f"{run_id} must deny edit-of-edit, edit target, and all authority roles")

        references = run.get("orderedReferences")
        expected_paths = EXPECTED_RUN_REFERENCES[str(fact["id"])]
        if not isinstance(references, list):
            raise ValueError(f"{run_id}.orderedReferences must be an array")
        paths = [row.get("path") if isinstance(row, dict) else None for row in references]
        orders = [row.get("order") if isinstance(row, dict) else None for row in references]
        if tuple(paths) != expected_paths or orders != list(range(1, len(expected_paths) + 1)):
            raise ValueError(f"{run_id} ordered reference paths/order differ from truthful generation lineage")
        if prior_b_path in paths:
            raise ValueError("Prior Direction B Ame is comparison-only and must never be a generation input")
        for reference in references:
            reference_path = str(reference["path"])
            bound_fact = reference_by_path.get(reference_path)
            if bound_fact is None or not _has_exact_binding(reference, bound_fact):
                raise ValueError(f"{run_id} does not exactly bind reference {reference_path}")
            if not isinstance(reference.get("role"), str) or not reference["role"].strip():
                raise ValueError(f"{run_id} reference {reference_path} requires a role")
            if not isinstance(reference.get("authorityKind"), str) or not reference["authorityKind"].strip():
                raise ValueError(f"{run_id} reference {reference_path} requires authorityKind")

    if len(run_ids) != len(set(run_ids)):
        raise ValueError("v03 runId values must be unique")
    return {
        "v02Prompts": prompt_v02_fact,
        "v02RunRecord": run_v02_fact,
        "v03Prompts": prompt_v03_fact,
        "v03RunRecord": run_v03_fact,
        "v02RunRecordSchema": v02.get("schema", "unversioned"),
        "v03RunRecordSchema": v03.get("schema", "unversioned"),
        "v03RunIds": run_ids,
        "verifiedAuthoredInputBindings": len(authored_facts),
        "verifiedReferenceInputBindings": len(reference_facts),
        "verifiedCandidateCIdentityBinding": True,
        "verifiedPriorBAmeExcludedFromGenerationReferences": True,
        "verifiedTruthfulOrderedReferenceSets": len(authored_facts),
    }


def _registered_ame(path: Path) -> Image.Image:
    with Image.open(path) as source:
        source.load()
        return prepare_cutout(
            source,
            (MASTER_SIZE, MASTER_SIZE),
            extraction_mode=CHECKER_EXTRACTION["mode"],
            clear_alpha_below=3,
            edge_dilation_pixels=6,
            foreground_seed_points=[[0.5, 0.5], [0.45, 0.75], [0.58, 0.75]],
            enclosed_seed_points=[],
            contour_barrier_maximum_luminance=CHECKER_EXTRACTION["barrierMaximumLuminance"],
            contour_barrier_minimum_chroma=CHECKER_EXTRACTION["barrierMinimumChroma"],
            contour_barrier_closing_radius=CHECKER_EXTRACTION["barrierClosingRadius"],
            contour_trim_minimum_luminance=CHECKER_EXTRACTION["exteriorTrimMinimumLuminance"],
            contour_trim_maximum_chroma=CHECKER_EXTRACTION["exteriorTrimMaximumChroma"],
            minimum_alpha_component_pixels=32,
            registration=AME_REGISTRATION,
        )


def _registered_floor_pad(path: Path, *, native_alpha: bool) -> Image.Image:
    with Image.open(path) as source:
        source.load()
        kwargs: dict[str, Any] = {
            "extraction_mode": "native-alpha" if native_alpha else CHECKER_EXTRACTION["mode"],
            "clear_alpha_below": 3,
            "edge_dilation_pixels": 6,
            "minimum_alpha_component_pixels": 32,
            "registration": PORTAL_REGISTRATION,
        }
        if not native_alpha:
            kwargs.update(
                {
                    "foreground_seed_points": [[0.5, 0.5]],
                    "enclosed_seed_points": [],
                    "contour_barrier_maximum_luminance": CHECKER_EXTRACTION["barrierMaximumLuminance"],
                    "contour_barrier_minimum_chroma": CHECKER_EXTRACTION["barrierMinimumChroma"],
                    "contour_barrier_closing_radius": CHECKER_EXTRACTION["barrierClosingRadius"],
                    "contour_trim_minimum_luminance": CHECKER_EXTRACTION["exteriorTrimMinimumLuminance"],
                    "contour_trim_maximum_chroma": CHECKER_EXTRACTION["exteriorTrimMaximumChroma"],
                }
            )
        return prepare_cutout(source, (MASTER_SIZE, MASTER_SIZE), **kwargs)


def _source_grid(
    root: Path,
    title: str,
    subtitle: str,
    panels: list[tuple[str, str]],
    *,
    columns: int,
    slot: tuple[int, int] = (520, 420),
) -> Image.Image:
    margin, header, gap = 28, 108, 18
    rows = (len(panels) + columns - 1) // columns
    width = margin * 2 + columns * slot[0] + (columns - 1) * gap
    height = header + rows * (slot[1] + 50) + (rows - 1) * gap + margin
    sheet = Image.new("RGBA", (width, height), (252, 247, 239, 255))
    draw = ImageDraw.Draw(sheet)
    _panel_title(draw, title, subtitle)
    for index, (label, relative) in enumerate(panels):
        row, column = divmod(index, columns)
        x = margin + column * (slot[0] + gap)
        y = header + row * (slot[1] + 50 + gap)
        draw.rounded_rectangle(
            (x, y, x + slot[0] - 1, y + slot[1] + 43),
            radius=14,
            fill=(255, 252, 246, 255),
            outline=(151, 115, 151, 255),
            width=2,
        )
        sheet.alpha_composite(_fit(_open_image(root / relative), slot, padding=8), (x, y))
        draw.text((x + 10, y + slot[1] + 9), label, font=_font(17), fill=(66, 43, 76, 255))
    return sheet


def _actual_size_sheet(deliveries: dict[str, dict[int, Image.Image]]) -> Image.Image:
    margin, header, cell_width, cell_height = 30, 124, 238, 190
    width = margin * 2 + cell_width * len(AME_KEYS)
    height = header + cell_height * len(AME_DELIVERY_SIZES) + margin
    sheet = Image.new("RGBA", (width, height), (252, 247, 239, 255))
    draw = ImageDraw.Draw(sheet)
    _panel_title(
        draw,
        "Ame v14 actual-size proof - exact 1:1 delivery pixels",
        "Candidate C, prior B fallback, and fresh non-edit candidate. Extraction/register/resize only; no outline synthesized.",
    )
    for column, key in enumerate(AME_KEYS):
        draw.text((margin + column * cell_width + 8, header - 29), AME_LABELS[key], font=_font(15), fill=(61, 39, 73, 255))
    for row_index, size in enumerate(AME_DELIVERY_SIZES):
        y = header + row_index * cell_height
        draw.text((4, y + 6), f"{size}px", font=_font(16), fill=(69, 48, 78, 255))
        for column, key in enumerate(AME_KEYS):
            panel_x = margin + column * cell_width + 7
            panel_y = y + 7
            panel = _checker((cell_width - 14, cell_height - 14), cell=10)
            sheet.alpha_composite(panel, (panel_x, panel_y))
            image = deliveries[key][size]
            paste_x = panel_x + (panel.width - size) // 2
            paste_y = panel_y + (panel.height - size) // 2
            sheet.alpha_composite(image, (paste_x, paste_y))
            baseline = paste_y + round(size * 0.9)
            for dash_x in range(panel_x, panel_x + panel.width, 8):
                draw.line((dash_x, baseline, min(dash_x + 4, panel_x + panel.width), baseline), fill=(27, 126, 96, 190), width=1)
    return sheet


def _contour_sheet(root: Path, masters: dict[str, Image.Image]) -> Image.Image:
    margin, header, panel_width, panel_height, label_width = 24, 116, 650, 470, 190
    width = margin * 2 + label_width + panel_width * len(CONTOUR_CROPS)
    height = header + panel_height * len(AME_KEYS) + margin
    sheet = Image.new("RGBA", (width, height), (252, 247, 239, 255))
    draw = ImageDraw.Draw(sheet)
    _panel_title(
        draw,
        "Ame v14 contour closeups - authored colour and edge QA",
        "Each crop repeats over light, dark, neutral, saturated, and woodland backgrounds. Proofing adds no outline.",
    )
    for crop_column, (crop_label, crop_box) in enumerate(CONTOUR_CROPS):
        x = margin + label_width + crop_column * panel_width
        draw.text((x + 6, header - 26), crop_label, font=_font(18), fill=(61, 40, 72, 255))
        for row_index, key in enumerate(AME_KEYS):
            y = header + row_index * panel_height
            if crop_column == 0:
                draw.text((margin + 4, y + 14), AME_LABELS[key], font=_font(15), fill=(64, 40, 73, 255))
            crop = masters[key].crop(crop_box)
            for index, (background_label, descriptor) in enumerate(BACKGROUNDS):
                chip_x = x + 4 + (index % 3) * 212
                chip_y = y + 4 + (index // 3) * 225
                background = _background_tile(root, descriptor, (204, 196))
                background.alpha_composite(_fit(crop, (204, 196), padding=1))
                sheet.alpha_composite(background, (chip_x, chip_y))
                draw.rectangle((chip_x, chip_y, chip_x + 203, chip_y + 195), outline=(79, 57, 87, 255), width=1)
                draw.text((chip_x + 2, chip_y + 198), background_label, font=_font(12), fill=(77, 56, 83, 255))
    return sheet


def _full_sprite_background_sheet(
    root: Path,
    deliveries: dict[str, dict[int, Image.Image]],
) -> Image.Image:
    """Show every full Ame at exact delivery pixels over five QA backgrounds."""

    margin = 24
    header = 132
    label_width = 214
    chip_width = 116
    chip_height = 138
    chip_gap = 5
    group_gap = 18
    row_height = 174
    group_width = len(FULL_SPRITE_BACKGROUNDS) * (chip_width + chip_gap) - chip_gap
    width = (
        margin * 2
        + label_width
        + len(AME_BACKGROUND_PROOF_SIZES) * group_width
        + (len(AME_BACKGROUND_PROOF_SIZES) - 1) * group_gap
    )
    height = header + len(AME_KEYS) * row_height + margin
    sheet = Image.new("RGBA", (width, height), (252, 247, 239, 255))
    draw = ImageDraw.Draw(sheet)
    _panel_title(
        draw,
        "Ame full-sprite actual-size background proof",
        "Exact 1:1 sprites at 103/77/56/40 px on paper, ink-plum, magenta, cyan, and woodland. No contour or scale synthesis.",
    )
    for group_index, size in enumerate(AME_BACKGROUND_PROOF_SIZES):
        group_x = margin + label_width + group_index * (group_width + group_gap)
        draw.text(
            (group_x, header - 42),
            f"{size}px exact delivery",
            font=_font(18),
            fill=(61, 39, 73, 255),
        )
        for background_index, (label, _) in enumerate(FULL_SPRITE_BACKGROUNDS):
            chip_x = group_x + background_index * (chip_width + chip_gap)
            draw.text(
                (chip_x + 2, header - 19),
                label.replace("woodland floor", "woodland"),
                font=_font(10),
                fill=(83, 61, 88, 255),
            )
    for row_index, key in enumerate(AME_KEYS):
        row_y = header + row_index * row_height
        draw.text(
            (margin + 2, row_y + 16),
            AME_LABELS[key],
            font=_font(15),
            fill=(64, 40, 73, 255),
        )
        draw.text(
            (margin + 2, row_y + 42),
            "identity authority" if key == "current" else "review only",
            font=_font(12),
            fill=(105, 77, 108, 255),
        )
        for group_index, size in enumerate(AME_BACKGROUND_PROOF_SIZES):
            group_x = margin + label_width + group_index * (group_width + group_gap)
            for background_index, (_, descriptor) in enumerate(FULL_SPRITE_BACKGROUNDS):
                chip_x = group_x + background_index * (chip_width + chip_gap)
                background = _background_tile(root, descriptor, (chip_width, chip_height))
                sprite = deliveries[key][size]
                background.alpha_composite(
                    sprite,
                    ((chip_width - size) // 2, (chip_height - size) // 2),
                )
                sheet.alpha_composite(background, (chip_x, row_y))
                draw.rectangle(
                    (chip_x, row_y, chip_x + chip_width - 1, row_y + chip_height - 1),
                    outline=(79, 57, 87, 255),
                    width=1,
                )
    return sheet


def _portal_actual_size_sheet(deliveries: dict[str, dict[int, Image.Image]], root: Path) -> Image.Image:
    margin, header, cell_width, cell_height = 28, 112, 360, 250
    keys = ("current", "fresh")
    width = margin * 2 + cell_width * len(keys)
    height = header + cell_height * len(PORTAL_DELIVERY_SIZES) + margin
    sheet = Image.new("RGBA", (width, height), (252, 247, 239, 255))
    draw = ImageDraw.Draw(sheet)
    _panel_title(
        draw,
        "Rose Heart floor-pad actual-size proof",
        "Exact 1:1 pixels on checker and woodland: current versus fresh hybrid.",
    )
    for column, key in enumerate(keys):
        label = "Current flower floor pad" if key == "current" else "Fresh A-construction / B-colour hybrid"
        draw.text((margin + column * cell_width + 8, header - 27), label, font=_font(16), fill=(61, 39, 73, 255))
    for row_index, size in enumerate(PORTAL_DELIVERY_SIZES):
        y = header + row_index * cell_height
        draw.text((4, y + 8), f"{size}px", font=_font(15), fill=(69, 48, 78, 255))
        for column, key in enumerate(keys):
            x = margin + column * cell_width + 8
            for bg_index, (label, descriptor) in enumerate((
                ("checker", None),
                ("woodland", "public/assets/floor-woodland-dirt-v1.png"),
            )):
                panel_x = x + bg_index * 170
                panel = _checker((160, 205), cell=10) if descriptor is None else _background_tile(root, descriptor, (160, 205))
                image = deliveries[key][size]
                panel.alpha_composite(image, ((panel.width - size) // 2, (panel.height - size) // 2))
                sheet.alpha_composite(panel, (panel_x, y + 8))
                draw.text((panel_x + 4, y + 218), label, font=_font(12), fill=(77, 56, 83, 255))
    return sheet


def _freshness(root: Path) -> dict[str, Any]:
    def normalized(path: Path) -> np.ndarray:
        image = Image.open(path).convert("RGB")
        image = ImageOps.contain(image, (96, 96), Image.Resampling.LANCZOS)
        canvas = Image.new("RGB", (96, 96), (255, 255, 255))
        canvas.paste(image, ((96 - image.width) // 2, (96 - image.height) // 2))
        return np.asarray(canvas, dtype=np.int16)

    comparisons: list[dict[str, Any]] = []
    paths = {
        "candidate-c": root / CURRENT_AME_RELATIVE,
        "prior-b": root / PRIOR_B_AME_RELATIVE,
        "fresh-01": root / _authored_path("ame-b-fresh-01"),
        "fresh-02": root / _authored_path("ame-b-fresh-02"),
    }
    hashes = {label: sha256_file(path) for label, path in paths.items()}
    if len(set(hashes.values())) != len(hashes):
        raise ValueError("Candidate C, prior B, Fresh 01, and Fresh 02 must be hash-unique")
    for fresh_label in ("fresh-01", "fresh-02"):
        for other_label in ("candidate-c", "prior-b", "fresh-02" if fresh_label == "fresh-01" else "fresh-01"):
            delta = np.abs(normalized(paths[fresh_label]) - normalized(paths[other_label]))
            comparisons.append(
                {
                    "candidate": fresh_label,
                    "against": other_label,
                    "normalized96RgbMeanAbsoluteError": round(float(delta.mean()), 6),
                    "normalized96PixelsWithAnyChannelDeltaAbove12": round(float((delta.max(axis=2) > 12).mean()), 6),
                }
            )
    return {
        "allFourAmeSourcesHashUnique": True,
        "generationModeRequired": "fresh-reference-led-generation",
        "priorBAmeUsedAsGenerationInput": False,
        "comparisons": comparisons,
    }


def _html_document(
    packet_relative: str,
    identity_fact: dict[str, Any],
    reference_facts: list[dict[str, Any]],
    authored_facts: list[dict[str, Any]],
) -> bytes:
    def href(relative: str) -> str:
        return os.path.relpath(relative, packet_relative).replace("\\", "/")

    source_rows = [identity_fact, *reference_facts, *authored_facts]
    links = "\n".join(
        f'<li><a href="{html.escape(href(str(row["path"])), quote=True)}">{html.escape(str(row["path"]))}</a> - '
        f'{row["width"]}x{row["height"]}, {row["bytes"]:,} B, <code>{row["sha256"]}</code></li>'
        for row in source_rows
    )
    actual_cards = "\n".join(
        f'<article><h3>{html.escape(AME_LABELS[key])} - {size}px</h3><a href="delivery/ame-{key}-{size}.png">'
        f'<img class="actual" src="delivery/ame-{key}-{size}.png" width="{size}" height="{size}" '
        f'alt="{html.escape(AME_LABELS[key])} at {size}px"></a></article>'
        for size in AME_DELIVERY_SIZES
        for key in AME_KEYS
    )
    value = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>mgjrpg-02 selected blend review - {PACKET_REVISION}</title>
<style>
:root{{--paper:#fffaf0;--ink:#34203f;--plum:#76567c}}*{{box-sizing:border-box}}body{{margin:0;background:var(--paper);color:var(--ink);font:16px/1.45 system-ui,sans-serif}}main{{max-width:1500px;margin:auto;padding:24px}}h1,h2,h3{{line-height:1.12}}.gate{{padding:16px 20px;border:3px solid #a54f63;border-radius:16px;background:#fff0eb}}.identity{{padding:14px 18px;border-left:6px solid #27896a;background:#eaf9f2}}figure{{margin:28px 0;padding:14px;border:1px solid #cbb9cd;border-radius:16px;background:#fff}}figure img{{display:block;max-width:100%;height:auto;margin:auto}}.actual-grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}}.actual-grid article{{min-height:205px;padding:10px;border:1px solid #d7c7d7;border-radius:12px;background:#f3eef5}}.actual{{display:block;margin:auto;max-width:none}}code{{overflow-wrap:anywhere}}a{{color:#6c356d}}
</style></head><body><main>
<h1>mgjrpg-02 selected-blend calibration - {PACKET_REVISION}</h1>
<p class="gate"><strong>PENDING HUMAN REVIEW.</strong> Review the fresh Ame, coherent future-enemy hybrid, and Rose Heart floor-pad hybrid. Nothing here is approved for runtime publication or future edits.</p>
<p class="identity"><strong>Candidate C remains the only Ame identity/construction authority.</strong> Prior B is a fallback comparison only and was not supplied to any v03 generation run.</p>
<figure><a href="selection-reference-map.png"><img src="selection-reference-map.png" alt="Human selection reference map"></a><figcaption>Previously selected core and family references. C is limited to the three named core-enemy exceptions.</figcaption></figure>
<figure><a href="ame-fresh-source-comparison.png"><img src="ame-fresh-source-comparison.png" alt="Candidate C, prior B, and fresh Ame source comparison"></a></figure>
<figure><a href="ame-fresh-actual-size.png"><img src="ame-fresh-actual-size.png" alt="Ame actual-size comparison"></a></figure>
<figure><a href="ame-full-sprite-actual-size-backgrounds.png"><img src="ame-full-sprite-actual-size-backgrounds.png" alt="Ame full-sprite actual-size background comparison"></a><figcaption>Full silhouettes at exact 103, 77, 56, and 40px delivery sizes on five diagnostic backgrounds.</figcaption></figure>
<figure><a href="ame-fresh-contour-background-closeups.png"><img src="ame-fresh-contour-background-closeups.png" alt="Ame contour background comparison"></a></figure>
<figure><a href="future-enemy-comparison.png"><img src="future-enemy-comparison.png" alt="Future enemy style comparison"></a></figure>
<figure><a href="rose-floor-pad-comparison.png"><img src="rose-floor-pad-comparison.png" alt="Rose floor-pad source comparison"></a></figure>
<figure><a href="rose-floor-pad-actual-size.png"><img src="rose-floor-pad-actual-size.png" alt="Rose floor-pad actual-size proof"></a></figure>
<h2>Exact Ame delivery PNGs</h2><div class="actual-grid">{actual_cards}</div>
<h2>Immutable inputs</h2><ul>{links}</ul>
<p><a href="mgjrpg-02-selection-report.json">Technical report</a> · <a href="proof-index.json">proof index</a></p>
</main></body></html>"""
    return value.encode("utf-8")


def _acquire_publish_lock(destination: Path) -> Path:
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists():
        raise FileExistsError(f"Immutable proof packet already exists: {destination}; increment the packet revision")
    lock = destination.parent / f".{destination.name}.publish.lock"
    try:
        with lock.open("x", encoding="utf-8") as stream:
            stream.write(f"pid={os.getpid()}\n")
    except FileExistsError as exc:
        raise RuntimeError(f"Another proof publisher holds {lock}") from exc
    return lock


def generate_mgjrpg02_selection(
    *,
    root: Path = ROOT,
    proof_root: Path = PROOF_ROOT,
    packet_revision: str = PACKET_REVISION,
) -> dict[str, Any]:
    """Build and atomically publish the immutable v14 selection packet."""

    root = root.resolve()
    proof_root = proof_root.resolve()
    if not proof_root.is_relative_to(root):
        raise ValueError("Proof root must stay inside the repository root")
    if packet_revision != PACKET_REVISION:
        raise ValueError(f"This implementation is bound to packet revision {PACKET_REVISION}")

    required = [
        CURRENT_AME_RELATIVE.as_posix(),
        *(str(row["path"]) for row in REFERENCE_INPUTS),
        *(str(row["path"]) for row in AUTHORED_INPUTS),
        "public/assets/floor-woodland-dirt-v1.png",
    ]
    missing = [path for path in required if not (root / path).is_file()]
    if missing:
        raise FileNotFoundError("Missing v14 selection input(s): " + ", ".join(missing))

    identity_fact = _image_fact(
        root / CURRENT_AME_RELATIVE,
        root,
        id="ame-current-candidate-c",
        kind="ame",
        authority="immutable-human-approved-identity-and-construction",
    )
    reference_facts = [
        _image_fact(root / row["path"], root, **{key: value for key, value in row.items() if key != "path"})
        for row in REFERENCE_INPUTS
    ]
    authored_facts = [
        _image_fact(
            root / row["path"],
            root,
            **{key: value for key, value in row.items() if key != "path"},
            authority="comparison-only-non-authority-generator-original",
        )
        for row in AUTHORED_INPUTS
    ]
    provenance = _validate_provenance(root, authored_facts, identity_fact, reference_facts)
    freshness = _freshness(root)

    destination = proof_root / "mgjrpg-02" / packet_revision
    packet_relative = _repo_relative(destination, root)
    lock = _acquire_publish_lock(destination)
    stage = Path(tempfile.mkdtemp(prefix=f".{packet_revision}-stage-", dir=destination.parent))
    published = False
    try:
        proof_facts: list[dict[str, Any]] = []

        def write_png(name: str, image: Image.Image) -> None:
            path = stage / name
            _write_png(image, path)
            proof_facts.append(_artifact_fact(path, f"{packet_relative}/{Path(name).as_posix()}"))

        write_png(
            "selection-reference-map.png",
            _source_grid(
                root,
                "Human-selected mgjrpg-02 reference map",
                "A is the core/family default; B supplies Ame colour and family shading; C is limited to tea skeleton, slime, and sword lizard.",
                [
                    ("A core - selected default", _reference_path("core-sampler-a")),
                    ("B core - Ame rendering language", _reference_path("core-sampler-b")),
                    ("C core - three named enemy exceptions", _reference_path("core-sampler-c")),
                    ("A family - approved construction/contour", _reference_path("family-transfer-a")),
                    ("B family - preferred colour/shading", _reference_path("family-transfer-b")),
                ],
                columns=3,
            ),
        )
        write_png(
            "ame-fresh-source-comparison.png",
            _source_grid(
                root,
                "Ame - identity, fallback, and fresh non-edit candidate",
                "Candidate C construction remains locked. Prior B is comparison-only and was not a v03 generation input.",
                [
                    (AME_LABELS["current"], CURRENT_AME_RELATIVE.as_posix()),
                    (AME_LABELS["prior-b"], PRIOR_B_AME_RELATIVE.as_posix()),
                    (AME_LABELS["fresh-01"], _authored_path("ame-b-fresh-01")),
                    (AME_LABELS["fresh-02"], _authored_path("ame-b-fresh-02")),
                ],
                columns=4,
                slot=(410, 460),
            ),
        )
        write_png(
            "future-enemy-comparison.png",
            _source_grid(
                root,
                "Future-enemy extension - selected concepts versus coherent hybrid",
                "A supplies the succubus concept; B supplies the other concepts; fresh hybrid targets A construction/chroma plus B colour/shading.",
                [
                    ("Prior A - succubus concept", _reference_path("enemy-extension-a")),
                    ("Prior B - T-rex, kappa, mimic concepts", _reference_path("enemy-extension-b")),
                    ("Fresh coherent hybrid - pending Human", _authored_path("future-enemy-hybrid-01")),
                ],
                columns=3,
                slot=(500, 500),
            ),
        )
        write_png(
            "rose-floor-pad-comparison.png",
            _source_grid(
                root,
                "Rose Heart teleporter - preserve the distinct flower floor pad",
                "Compare the current retained flower-pad concept with the fresh A-construction / B-colour hybrid.",
                [
                    ("Current Rose Heart flower floor pad", CURRENT_ROSE_PORTAL_RELATIVE.as_posix()),
                    ("Fresh floor-pad hybrid - pending Human", _authored_path("rose-heart-floor-pad-hybrid-01")),
                ],
                columns=2,
                slot=(600, 560),
            ),
        )

        ame_source_paths = {
            "current": root / CURRENT_AME_RELATIVE,
            "prior-b": root / PRIOR_B_AME_RELATIVE,
            "fresh-01": root / _authored_path("ame-b-fresh-01"),
            "fresh-02": root / _authored_path("ame-b-fresh-02"),
        }
        ame_masters: dict[str, Image.Image] = {}
        ame_deliveries: dict[str, dict[int, Image.Image]] = {}
        for key, path in ame_source_paths.items():
            master = _registered_ame(path)
            ame_masters[key] = master
            write_png(f"derived/ame-{key}-registered-512.png", master)
            ame_deliveries[key] = {}
            for size in AME_DELIVERY_SIZES:
                delivery = premultiplied_resize(master, (size, size))
                ame_deliveries[key][size] = delivery
                write_png(f"delivery/ame-{key}-{size}.png", delivery)
        write_png("ame-fresh-actual-size.png", _actual_size_sheet(ame_deliveries))
        write_png(
            "ame-full-sprite-actual-size-backgrounds.png",
            _full_sprite_background_sheet(root, ame_deliveries),
        )
        write_png("ame-fresh-contour-background-closeups.png", _contour_sheet(root, ame_masters))

        portal_masters = {
            "current": _registered_floor_pad(root / CURRENT_ROSE_PORTAL_RELATIVE, native_alpha=True),
            "fresh": _registered_floor_pad(root / _authored_path("rose-heart-floor-pad-hybrid-01"), native_alpha=False),
        }
        portal_deliveries: dict[str, dict[int, Image.Image]] = {}
        for key, master in portal_masters.items():
            write_png(f"derived/rose-floor-pad-{key}-registered-512.png", master)
            portal_deliveries[key] = {}
            for size in PORTAL_DELIVERY_SIZES:
                delivery = premultiplied_resize(master, (size, size))
                portal_deliveries[key][size] = delivery
                write_png(f"delivery/rose-floor-pad-{key}-{size}.png", delivery)
        write_png("rose-floor-pad-actual-size.png", _portal_actual_size_sheet(portal_deliveries, root))

        source_encoded = sum(row["bytes"] for row in authored_facts)
        source_decoded = sum(row["decodedBytesUpperBound"] for row in authored_facts)
        report = {
            "schema": REPORT_SCHEMA,
            "packetRevision": packet_revision,
            "status": PACKET_STATUS,
            "authority": {
                "candidateC": "immutable-human-approved-identity-and-construction",
                "priorBAme": "comparison-only-fallback-not-generation-input",
                "v03GeneratorOriginals": "comparison-only-non-authority",
                "proofDerivatives": "review-only-non-authority",
                "runtimePublicationApproved": False,
                "futureEditAuthorityGranted": False,
            },
            "inputs": {
                "identityAuthority": identity_fact,
                "referenceInputs": reference_facts,
                "authoredInputs": authored_facts,
            },
            "provenance": provenance,
            "freshness": freshness,
            "humanSelectionRecorded": {
                "ame": "Direction B preferred; fresh non-edit B-led attempt requested; prior B remains fallback.",
                "core": "Direction A default; Direction C for traditional slime, sword lizard, and green-tea skeleton.",
                "futureEnemies": "Direction B concepts except Direction A succubus; fresh hybrid must inherit A construction/chroma and B colour/shading.",
                "familyTransfer": "Direction A acceptable; Direction B colour/shading preferred.",
                "portal": "Retain flower-petal floor-pad topology so teleporters remain distinct from upright doors.",
            },
            "ameProofContract": {
                "sourceOperation": "deterministic alpha extraction, registration, and premultiplied resize only",
                "synthesizedContour": False,
                "masterSize": MASTER_SIZE,
                "deliverySizes": list(AME_DELIVERY_SIZES),
                "fullSpriteBackgroundSizes": list(AME_BACKGROUND_PROOF_SIZES),
                "fullSpriteBackgrounds": [
                    label for label, _ in FULL_SPRITE_BACKGROUNDS
                ],
                "backgroundExtraction": CHECKER_EXTRACTION,
                "registration": AME_REGISTRATION,
                "backgrounds": [label for label, _ in BACKGROUNDS],
                "closeupCropBoxes512LTRBExclusive": [
                    {"label": label, "box": list(box)} for label, box in CONTOUR_CROPS
                ],
            },
            "portalProofContract": {
                "sourceOperation": "native alpha for current source; deterministic alpha extraction for fresh source; registration and premultiplied resize only",
                "synthesizedContour": False,
                "masterSize": MASTER_SIZE,
                "deliverySizes": list(PORTAL_DELIVERY_SIZES),
                "registration": PORTAL_REGISTRATION,
                "backgrounds": ["checker", "woodland floor"],
            },
            "sourceCost": {
                "authoredOriginalCount": len(authored_facts),
                "authoredOriginalEncodedBytes": source_encoded,
                "authoredOriginalDecodedBytesUpperBound": source_decoded,
            },
            "knownLimitations": [
                "All v03 generator originals are opaque RGB images with painted checkerboard or ivory backgrounds; extracted alpha is review-only.",
                "The future-enemy image is a composite concept board. Its cells are not separable source masters and receive no per-sprite alpha or actual-size claim.",
                "The fresh Ame candidate is not identity-approved; any face, age, hair, eye, costume, proportion, silhouette, registration, or emotional drift must be rejected.",
                "The Rose floor-pad proof evaluates topology, colour, contour, and small-size read only; it does not approve VFX, animation, lighting, or runtime publication.",
            ],
            "reviewQuestions": [
                "Does either fresh Ame preserve Candidate C while avoiding prior B's overworked texture, or should prior B remain the rendering fallback?",
                "Does the fresh enemy hybrid now belong beside the selected core and family references?",
                "Does the Rose Heart hybrid preserve the distinct flower floor-pad read at 84 and 64 px?",
            ],
            "runtimeImpact": {
                "runtimeFilesChanged": 0,
                "cataloguePointersChanged": 0,
                "encodedByteDelta": 0,
                "decodedByteDelta": 0,
            },
            "encoderEnvironment": encoder_environment(),
            "proofFiles": proof_facts,
        }
        report_path = stage / "mgjrpg-02-selection-report.json"
        _write_bytes(_json_bytes(report), report_path)
        report_fact = _artifact_fact(report_path, f"{packet_relative}/mgjrpg-02-selection-report.json")

        html_path = stage / "index.html"
        _write_bytes(_html_document(packet_relative, identity_fact, reference_facts, authored_facts), html_path)
        html_fact = _artifact_fact(html_path, f"{packet_relative}/index.html")

        provenance_facts = [
            provenance["v02Prompts"],
            provenance["v02RunRecord"],
            provenance["v03Prompts"],
            provenance["v03RunRecord"],
        ]
        proof_index = {
            "schema": PACKET_SCHEMA,
            "packetRevision": packet_revision,
            "packetRoot": packet_relative,
            "status": PACKET_STATUS,
            "identityAuthority": identity_fact,
            "referenceInputs": reference_facts,
            "authoredInputs": authored_facts,
            "provenanceFiles": provenance_facts,
            "proofFiles": [*proof_facts, report_fact, html_fact],
            "bindingRule": "Every source, provenance file, proof, and derivative is bound by exact path, SHA-256, and byte count; the proof index does not self-hash.",
            "authorityRule": "Candidate C is the only Ame identity/construction authority. Prior B is comparison-only and absent from every v03 ordered reference. All v03 originals and proof derivatives are non-authority pending Human review.",
            "runtimeImpact": {"files": 0, "encodedBytes": 0, "decodedBytes": 0},
        }
        index_path = stage / "proof-index.json"
        _write_bytes(_json_bytes(proof_index), index_path)
        index_hash = sha256_file(index_path)
        index_bytes = index_path.stat().st_size

        if destination.exists():
            raise FileExistsError(f"Immutable proof packet already exists: {destination}; increment the packet revision")
        os.rename(stage, destination)
        published = True
        return {
            "packetRevision": packet_revision,
            "packetRoot": packet_relative,
            "proofIndex": f"{packet_relative}/proof-index.json",
            "proofIndexSha256": index_hash,
            "proofIndexBytes": index_bytes,
            "proofFileCount": len(proof_index["proofFiles"]),
            "runtimeByteDelta": 0,
            "status": PACKET_STATUS,
        }
    finally:
        if not published:
            shutil.rmtree(stage, ignore_errors=True)
        lock.unlink(missing_ok=True)
