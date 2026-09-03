"""Immutable review proofs for independently authored ``mgjrpg-02`` options.

This module is intentionally separate from :mod:`mgjrpg02`.  The earlier module
is a deterministic contour *assay* over historical pixels; this packet compares
new generator originals without treating those boards, extracted review
cutouts, or resized proofs as an identity/rendering authority.
"""

from __future__ import annotations

import hashlib
import html
import json
import os
import shutil
import tempfile
from itertools import combinations
from pathlib import Path
from typing import Any, Iterable, Iterator
from urllib.parse import quote

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps

from cutout import normalize_to_srgb_rgba, premultiplied_resize, prepare_cutout
from encode import encoder_environment, save_image
from model import PROOF_ROOT, ROOT, sha256_file


PACKET_REVISION = "v11"
PACKET_SCHEMA = "maze-art-mgjrpg02-authored-options-proof-index/v1"
REPORT_SCHEMA = "maze-art-mgjrpg02-authored-options-report/v1"
CALIBRATION_RELATIVE = Path("docs/source-assets/calibrations/mgjrpg-02/v02")
PROMPTS_RELATIVE = CALIBRATION_RELATIVE / "PROMPTS.md"
RUN_RECORD_RELATIVE = CALIBRATION_RELATIVE / "run-record.json"
FAMILY_TRANSFER_COMPARATOR_RELATIVE = (
    CALIBRATION_RELATIVE / "family-transfer-identity-comparator-input.png"
)
CURRENT_AME_RELATIVE = Path(
    "docs/source-assets/characters/ame/v02/"
    "ame-v02-candidate-c-generator-original.png"
)

OPTION_LABELS: dict[str, str] = {
    "current": "Current - approved Candidate C",
    "a": "Direction A",
    "b": "Direction B",
    "c": "Direction C",
}

AUTHORED_OPTION_INPUTS: tuple[dict[str, str], ...] = tuple(
    {
        "id": f"direction-{option}-{kind}",
        "option": option,
        "kind": kind,
        "path": (
            CALIBRATION_RELATIVE
            / (
                f"ame-v02-rendering-option-{option}-generator-original.png"
                if kind == "ame"
                else f"direction-{option}-{kind}-generator-original.png"
            )
        ).as_posix(),
    }
    for option in ("a", "b", "c")
    for kind in ("sampler", "ame", "enemy-extension", "family-transfer")
)

FAMILY_TRANSFER_COMPONENTS: tuple[dict[str, str], ...] = (
    {"id": "animal-fox-current", "path": "public/assets/animal-fox.png"},
    {"id": "enemy-goblin-current", "path": "public/assets/goblin.png"},
    {
        "id": "enemy-jelly-sorcerer-master",
        "path": "docs/source-assets/enemy-jelly-sorcerer-v1-master.png",
    },
    {"id": "key-rose-heart-master", "path": "docs/source-assets/key-rose-heart-v1.png"},
    {"id": "door-rose-heart-master", "path": "docs/source-assets/door-rose-heart-v1.png"},
    {"id": "portal-rose-heart-master", "path": "docs/source-assets/portal-rose-heart-v1.png"},
    {"id": "reward-first-star-current", "path": "public/assets/reward-trail-sticker.png"},
)

AME_INPUTS: tuple[dict[str, str], ...] = (
    {
        "id": "ame-current-candidate-c",
        "option": "current",
        "kind": "ame",
        "path": CURRENT_AME_RELATIVE.as_posix(),
    },
    *tuple(row for row in AUTHORED_OPTION_INPUTS if row["kind"] == "ame"),
)

AME_DELIVERY_SIZES: tuple[int, ...] = (155, 103, 84, 64, 56, 40)
AME_MASTER_SIZE = 512
AME_REGISTRATION = {
    "targetBox": [0.08, 0.085, 0.92, 0.9],
    "align": [0.5, 1.0],
    "alphaThreshold": 3,
}
AME_EXTRACTION = {
    "mode": "outer-contour-barrier",
    "recipeId": "mgjrpg-02-options-contour-l190-chroma8-close2-trim235-v1",
    "barrierMaximumLuminance": 190,
    "barrierMinimumChroma": 8,
    "barrierClosingRadius": 2,
    "exteriorTrimMinimumLuminance": 235,
    "exteriorTrimMaximumChroma": 20,
    "foregroundSeedPoints": [[0.5, 0.5], [0.45, 0.75], [0.58, 0.75]],
    "enclosedSeedPoints": [],
}

BACKGROUNDS: tuple[tuple[str, tuple[int, int, int, int] | str], ...] = (
    ("paper", (255, 250, 238, 255)),
    ("ink plum", (45, 32, 56, 255)),
    ("middle gray", (128, 128, 128, 255)),
    ("magenta QA", (255, 0, 255, 255)),
    ("cyan QA", (0, 225, 235, 255)),
    ("woodland floor", "public/assets/floor-woodland-dirt-v1.png"),
)

# Registration-space crops intentionally cross an exterior silhouette edge.
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
    return (json.dumps(value, indent=2, sort_keys=True, ensure_ascii=False) + "\n").encode(
        "utf-8"
    )


def _write_bytes(value: bytes, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    with destination.open("xb") as stream:
        stream.write(value)
        stream.flush()
        os.fsync(stream.fileno())


def _write_png(image: Image.Image, destination: Path) -> dict[str, Any]:
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists():
        raise FileExistsError(f"Refusing to overwrite proof output: {destination}")
    return save_image(
        image,
        destination,
        "png",
        {"compress_level": 9, "optimize": False},
    )


def _image_fact(path: Path, root: Path, *, logical_path: str | None = None) -> dict[str, Any]:
    with Image.open(path) as source:
        source.load()
        width, height = source.size
        mode = source.mode
    return {
        "path": logical_path or _repo_relative(path, root),
        "sha256": sha256_file(path),
        "bytes": path.stat().st_size,
        "width": width,
        "height": height,
        "mode": mode,
    }


def _file_fact(path: Path, root: Path, *, logical_path: str | None = None) -> dict[str, Any]:
    return {
        "path": logical_path or _repo_relative(path, root),
        "sha256": sha256_file(path),
        "bytes": path.stat().st_size,
    }


def _walk_dicts(value: Any) -> Iterator[dict[str, Any]]:
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from _walk_dicts(child)
    elif isinstance(value, list):
        for child in value:
            yield from _walk_dicts(child)


def _dict_names_path(value: dict[str, Any], relative: str) -> bool:
    return any(
        value.get(key) == relative
        for key in ("path", "immutableGeneratorOriginalPath", "outputPath")
    )


def _has_exact_binding(value: Any, fact: dict[str, Any]) -> bool:
    return any(
        _dict_names_path(row, str(fact["path"]))
        and row.get("sha256") == fact["sha256"]
        and row.get("bytes") == fact["bytes"]
        for row in _walk_dicts(value)
    )


def _contains_path(value: Any, relative: str) -> bool:
    return any(_dict_names_path(row, relative) for row in _walk_dicts(value))


def _validate_provenance(
    root: Path,
    input_facts: list[dict[str, Any]],
    identity_fact: dict[str, Any],
    reference_fact: dict[str, Any],
) -> dict[str, Any]:
    prompt_path = root / PROMPTS_RELATIVE
    run_record_path = root / RUN_RECORD_RELATIVE
    missing = [
        relative.as_posix()
        for relative, path in (
            (PROMPTS_RELATIVE, prompt_path),
            (RUN_RECORD_RELATIVE, run_record_path),
        )
        if not path.is_file()
    ]
    if missing:
        raise FileNotFoundError(
            "mgjrpg-02 authored-options proof requires immutable provenance before "
            "generation; missing: " + ", ".join(missing)
        )

    try:
        run_record = json.loads(run_record_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"Invalid authored-options run record: {exc}") from exc
    if not isinstance(run_record, dict):
        raise ValueError("Authored-options run record must be a JSON object")

    prompt_fact = _file_fact(prompt_path, root)
    run_record_fact = _file_fact(run_record_path, root)
    if not _has_exact_binding(run_record, prompt_fact):
        raise ValueError(
            "Authored-options run record does not bind PROMPTS.md by exact path, "
            "SHA-256, and byte count"
        )

    missing_inputs = [
        str(fact["path"])
        for fact in input_facts
        if not _has_exact_binding(run_record, fact)
    ]
    if missing_inputs:
        raise ValueError(
            "Authored-options run record does not bind generated input(s) by exact "
            "path, SHA-256, and byte count: " + ", ".join(missing_inputs)
        )
    if not _has_exact_binding(run_record, identity_fact):
        raise ValueError(
            "Authored-options run record does not bind immutable Candidate C by "
            "exact path, SHA-256, and byte count"
        )
    if not _has_exact_binding(run_record, reference_fact):
        raise ValueError(
            "Authored-options run record does not bind the family-transfer comparator "
            "by exact path, SHA-256, and byte count"
        )
    missing_components = [
        str(fact["path"])
        for fact in reference_fact["components"]
        if not _has_exact_binding(run_record, fact)
    ]
    if missing_components:
        raise ValueError(
            "Authored-options run record does not bind comparator component(s) by "
            "exact path, SHA-256, and byte count: " + ", ".join(missing_components)
        )

    runs = run_record.get("runs")
    if not isinstance(runs, list) or not runs:
        raise ValueError("Authored-options run record must contain a non-empty runs list")
    run_ids: list[str] = []
    for run in runs:
        if not isinstance(run, dict):
            raise ValueError("Every authored-options run entry must be an object")
        run_id = run.get("runId")
        if not isinstance(run_id, str) or not run_id:
            raise ValueError("Every authored-options run must retain a non-empty runId")
        run_ids.append(run_id)

    for fact in input_facts:
        owning_runs = [run for run in runs if _contains_path(run, str(fact["path"]))]
        if not owning_runs:
            raise ValueError(f"No generation run owns authored input {fact['path']}")
        if not any(
            any(
                all(
                    lineage.get(flag) is False
                    for flag in (
                        "mayBeIdentityAuthority",
                        "mayBeRenderingAuthority",
                        "mayBeFutureEditTarget",
                    )
                )
                for lineage in (
                    row.get("lineage")
                    for row in _walk_dicts(run)
                    if isinstance(row.get("lineage"), dict)
                )
            )
            for run in owning_runs
        ):
            raise ValueError(
                f"Generation lineage for {fact['path']} must explicitly deny identity, "
                "rendering, and future-edit authority"
            )

    return {
        "prompts": prompt_fact,
        "runRecord": run_record_fact,
        "runRecordSchema": run_record.get("schema", "unversioned"),
        "runIds": run_ids,
        "verifiedGeneratedInputBindings": len(input_facts),
        "verifiedCandidateCIdentityBinding": True,
        "verifiedFamilyTransferComparatorBinding": True,
        "verifiedFamilyTransferComponentBindings": len(reference_fact["components"]),
    }


def _fit(source: Image.Image, size: tuple[int, int], *, padding: int = 0) -> Image.Image:
    image = normalize_to_srgb_rgba(source)
    available = (max(1, size[0] - padding * 2), max(1, size[1] - padding * 2))
    scale = min(available[0] / image.width, available[1] / image.height)
    fitted = premultiplied_resize(
        image,
        (max(1, round(image.width * scale)), max(1, round(image.height * scale))),
    )
    result = Image.new("RGBA", size, (0, 0, 0, 0))
    result.alpha_composite(
        fitted,
        ((size[0] - fitted.width) // 2, (size[1] - fitted.height) // 2),
    )
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


def _open_image(path: Path) -> Image.Image:
    with Image.open(path) as source:
        source.load()
        return normalize_to_srgb_rgba(source)


def _panel_title(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    title: str,
    subtitle: str | None = None,
) -> None:
    draw.text(xy, title, font=_font(26), fill=(53, 34, 67, 255))
    if subtitle:
        draw.text((xy[0], xy[1] + 34), subtitle, font=_font(16), fill=(102, 76, 111, 255))


def _board_comparison(root: Path) -> Image.Image:
    margin = 28
    column_width = 600
    slot_height = 440
    header = 112
    row_gap = 46
    width = margin * 2 + column_width * 3
    kinds = ("sampler", "enemy-extension", "family-transfer")
    height = header + slot_height * len(kinds) + row_gap * (len(kinds) - 1) + margin
    sheet = Image.new("RGBA", (width, height), (252, 247, 239, 255))
    draw = ImageDraw.Draw(sheet)
    _panel_title(
        draw,
        (margin, 18),
        "mgjrpg-02 independently authored directions - A / B / C",
        "Rows: core sampler, future-enemy extension, current-family transfer. Comparison-only; no board cell is an asset authority.",
    )
    for column, option in enumerate(("a", "b", "c")):
        x = margin + column * column_width
        draw.rounded_rectangle(
            (x + 4, header - 38, x + column_width - 8, height - margin),
            radius=18,
            fill=(255, 252, 246, 255),
            outline=(151, 115, 151, 255),
            width=2,
        )
        draw.text((x + 18, header - 31), OPTION_LABELS[option], font=_font(24), fill=(72, 43, 80, 255))
        for row_index, kind in enumerate(kinds):
            relative = next(
                row["path"]
                for row in AUTHORED_OPTION_INPUTS
                if row["option"] == option and row["kind"] == kind
            )
            image = _open_image(root / relative)
            fitted = _fit(image, (column_width - 32, slot_height - 34), padding=8)
            y = header + row_index * (slot_height + row_gap)
            sheet.alpha_composite(fitted, (x + 12, y))
            draw.text(
                (x + 18, y + slot_height - 24),
                {
                    "sampler": "core sampler",
                    "enemy-extension": "future-enemy extension",
                    "family-transfer": "current-family transfer",
                }[kind],
                font=_font(16),
                fill=(82, 61, 88, 255),
            )
    return sheet


def _ame_source_comparison(root: Path) -> Image.Image:
    margin = 28
    slot = 450
    header = 118
    width = margin * 2 + slot * 4
    height = header + slot + 72
    sheet = Image.new("RGBA", (width, height), (252, 247, 239, 255))
    draw = ImageDraw.Draw(sheet)
    _panel_title(
        draw,
        (margin, 18),
        "Ame rendering direction - source originals",
        "Candidate C identity/construction is immutable. A/B/C are independent rendering comparisons, not replacement authorities.",
    )
    for column, row in enumerate(AME_INPUTS):
        x = margin + column * slot
        image = _open_image(root / row["path"])
        panel = _fit(image, (slot - 20, slot - 20), padding=5)
        sheet.alpha_composite(panel, (x + 10, header))
        draw.text((x + 10, header + slot + 4), OPTION_LABELS[row["option"]], font=_font(20), fill=(59, 38, 70, 255))
        if row["option"] == "current":
            draw.text((x + 10, header + slot + 31), "IDENTITY LOCKED", font=_font(15), fill=(35, 117, 91, 255))
        else:
            draw.text((x + 10, header + slot + 31), "PENDING HUMAN - COMPARISON ONLY", font=_font(15), fill=(151, 73, 74, 255))
    return sheet


def _registered_ame(path: Path) -> Image.Image:
    with Image.open(path) as source:
        source.load()
        return prepare_cutout(
            source,
            (AME_MASTER_SIZE, AME_MASTER_SIZE),
            extraction_mode=str(AME_EXTRACTION["mode"]),
            clear_alpha_below=3,
            edge_dilation_pixels=6,
            foreground_seed_points=AME_EXTRACTION["foregroundSeedPoints"],
            enclosed_seed_points=AME_EXTRACTION["enclosedSeedPoints"],
            contour_barrier_maximum_luminance=int(AME_EXTRACTION["barrierMaximumLuminance"]),
            contour_barrier_minimum_chroma=int(AME_EXTRACTION["barrierMinimumChroma"]),
            contour_barrier_closing_radius=int(AME_EXTRACTION["barrierClosingRadius"]),
            contour_trim_minimum_luminance=int(AME_EXTRACTION["exteriorTrimMinimumLuminance"]),
            contour_trim_maximum_chroma=int(AME_EXTRACTION["exteriorTrimMaximumChroma"]),
            minimum_alpha_component_pixels=32,
            registration=AME_REGISTRATION,
        )


def _actual_size_sheet(deliveries: dict[str, dict[int, Image.Image]]) -> Image.Image:
    margin = 30
    header = 124
    cell_width = 218
    cell_height = 190
    width = margin * 2 + cell_width * 4
    height = header + cell_height * len(AME_DELIVERY_SIZES) + margin
    sheet = Image.new("RGBA", (width, height), (252, 247, 239, 255))
    draw = ImageDraw.Draw(sheet)
    _panel_title(
        draw,
        (margin, 18),
        "Ame actual-size proof - exact 1:1 delivery pixels",
        "Extract/register/resize only. No contour was synthesized. Dashed line is the recorded 0.90 grounded-actor baseline.",
    )
    for column, option in enumerate(("current", "a", "b", "c")):
        x = margin + column * cell_width
        label = "Current C" if option == "current" else f"Direction {option.upper()}"
        draw.text((x + 8, header - 29), label, font=_font(18), fill=(61, 39, 73, 255))
    for row_index, size in enumerate(AME_DELIVERY_SIZES):
        y = header + row_index * cell_height
        draw.text((4, y + 6), f"{size}px", font=_font(16), fill=(69, 48, 78, 255))
        for column, option in enumerate(("current", "a", "b", "c")):
            x = margin + column * cell_width
            panel = _checker((cell_width - 14, cell_height - 14), cell=10)
            panel_x = x + 7
            panel_y = y + 7
            sheet.alpha_composite(panel, (panel_x, panel_y))
            image = deliveries[option][size]
            paste_x = panel_x + (panel.width - size) // 2
            paste_y = panel_y + (panel.height - size) // 2
            sheet.alpha_composite(image, (paste_x, paste_y))
            baseline = paste_y + round(size * 0.9)
            for dash_x in range(panel_x, panel_x + panel.width, 8):
                draw.line((dash_x, baseline, min(dash_x + 4, panel_x + panel.width), baseline), fill=(27, 126, 96, 190), width=1)
    return sheet


def _background_tile(root: Path, descriptor: tuple[int, int, int, int] | str, size: tuple[int, int]) -> Image.Image:
    if isinstance(descriptor, tuple):
        return Image.new("RGBA", size, descriptor)
    source = _open_image(root / descriptor)
    tile = source.resize((64, 64), Image.Resampling.LANCZOS)
    result = Image.new("RGBA", size, (0, 0, 0, 255))
    for y in range(0, size[1], tile.height):
        for x in range(0, size[0], tile.width):
            result.alpha_composite(tile, (x, y))
    return result


def _contour_closeup_sheet(root: Path, masters: dict[str, Image.Image]) -> Image.Image:
    margin = 24
    header = 116
    # Display the 132px registration crops at roughly 1.5x.  The former assay
    # packet made its contour evidence legible only after opening a separate
    # closeup; this comparison keeps that evidence plainly visible in the main
    # review surface.
    panel_width = 650
    panel_height = 470
    row_label_width = 170
    width = margin * 2 + row_label_width + panel_width * len(CONTOUR_CROPS)
    height = header + panel_height * 4 + margin
    sheet = Image.new("RGBA", (width, height), (252, 247, 239, 255))
    draw = ImageDraw.Draw(sheet)
    _panel_title(
        draw,
        (margin, 16),
        "Ame contour closeups - material colour and edge QA",
        "Each crop is repeated over paper, ink, gray, magenta, cyan, and woodland. Visible pixels are authored; proofing adds no outline.",
    )
    for crop_column, (crop_label, crop_box) in enumerate(CONTOUR_CROPS):
        x = margin + row_label_width + crop_column * panel_width
        draw.text((x + 6, header - 26), crop_label, font=_font(18), fill=(61, 40, 72, 255))
        for option_row, option in enumerate(("current", "a", "b", "c")):
            y = header + option_row * panel_height
            if crop_column == 0:
                draw.text((margin + 4, y + 14), OPTION_LABELS[option], font=_font(18), fill=(64, 40, 73, 255))
                draw.text((margin + 4, y + 42), "identity locked" if option == "current" else "comparison only", font=_font(14), fill=(105, 77, 108, 255))
            crop = masters[option].crop(crop_box)
            chip_width = 204
            chip_height = 196
            for index, (background_label, descriptor) in enumerate(BACKGROUNDS):
                chip_x = x + 4 + (index % 3) * 212
                chip_y = y + 4 + (index // 3) * 225
                background = _background_tile(root, descriptor, (chip_width, chip_height))
                fitted = _fit(crop, (chip_width, chip_height), padding=1)
                background.alpha_composite(fitted)
                sheet.alpha_composite(background, (chip_x, chip_y))
                draw.rectangle((chip_x, chip_y, chip_x + chip_width - 1, chip_y + chip_height - 1), outline=(79, 57, 87, 255), width=1)
                draw.text((chip_x + 2, chip_y + chip_height + 2), background_label, font=_font(12), fill=(77, 56, 83, 255))
    return sheet


def _normalized_rgb(path: Path, size: int = 96) -> np.ndarray:
    image = Image.open(path).convert("RGB")
    contained = ImageOps.contain(image, (size, size), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (size, size), (255, 255, 255))
    canvas.paste(contained, ((size - contained.width) // 2, (size - contained.height) // 2))
    return np.asarray(canvas, dtype=np.int16)


def _validate_option_uniqueness(root: Path, facts: list[dict[str, Any]]) -> dict[str, Any]:
    comparisons: list[dict[str, Any]] = []
    by_path = {str(fact["path"]): fact for fact in facts}
    for kind in ("sampler", "ame", "enemy-extension", "family-transfer"):
        group = [row for row in AUTHORED_OPTION_INPUTS if row["kind"] == kind]
        hashes = [str(by_path[row["path"]]["sha256"]) for row in group]
        if len(hashes) != len(set(hashes)):
            raise ValueError(f"Authored {kind} options must be independent, hash-unique originals")
        rasters = {row["option"]: _normalized_rgb(root / row["path"]) for row in group}
        for left, right in combinations(("a", "b", "c"), 2):
            delta = np.abs(rasters[left] - rasters[right])
            mean_absolute_error = float(delta.mean())
            changed_fraction = float((delta.max(axis=2) > 12).mean())
            if mean_absolute_error <= 0.5 or changed_fraction <= 0.01:
                raise ValueError(
                    f"Authored {kind} options {left.upper()}/{right.upper()} are not "
                    "visually distinct enough for a meaningful Human comparison"
                )
            comparisons.append(
                {
                    "kind": kind,
                    "left": left,
                    "right": right,
                    "normalized96RgbMeanAbsoluteError": round(mean_absolute_error, 6),
                    "normalized96PixelsWithAnyChannelDeltaAbove12": round(changed_fraction, 6),
                }
            )
    return {
        "allOptionFilesHashUniqueWithinFamily": True,
        "minimumNormalized96RgbMeanAbsoluteError": 0.5,
        "minimumChangedPixelFraction": 0.01,
        "comparisons": comparisons,
    }


def _artifact_fact(path: Path, logical_path: str) -> dict[str, Any]:
    suffix = path.suffix.lower()
    # logical_path is already the final repository-relative location; the
    # physical file still lives in the sibling staging directory at this point.
    fact = {
        "path": logical_path,
        "sha256": sha256_file(path),
        "bytes": path.stat().st_size,
    }
    if suffix == ".png":
        with Image.open(path) as source:
            source.load()
            fact.update({"width": source.width, "height": source.height, "mode": source.mode})
        fact["mediaType"] = "image/png"
    elif suffix == ".json":
        fact["mediaType"] = "application/json"
    elif suffix == ".html":
        fact["mediaType"] = "text/html; charset=utf-8"
    return fact


def _source_href(packet_relative: str, source_relative: str) -> str:
    packet_dir = Path(packet_relative)
    value = os.path.relpath(source_relative, packet_dir.as_posix()).replace("\\", "/")
    return quote(value, safe="/._-")


def _html_document(
    packet_relative: str,
    input_facts: list[dict[str, Any]],
    identity_fact: dict[str, Any],
    reference_fact: dict[str, Any],
) -> bytes:
    source_rows = [identity_fact, reference_fact, *input_facts]
    source_links = "\n".join(
        f'<li><a href="{_source_href(packet_relative, str(row["path"]))}">'
        f'{html.escape(str(row["path"]))}</a> - {row["width"]}x{row["height"]}, '
        f'{row["bytes"]:,} B, <code>{row["sha256"]}</code></li>'
        for row in source_rows
    )
    actual_cards = "\n".join(
        f'<article><h3>{html.escape(OPTION_LABELS[option])} - {size}px</h3>'
        f'<a href="delivery/ame-{option}-{size}.png"><img class="actual" '
        f'src="delivery/ame-{option}-{size}.png" width="{size}" height="{size}" '
        f'alt="{html.escape(OPTION_LABELS[option])} at {size}px"></a></article>'
        for size in AME_DELIVERY_SIZES
        for option in ("current", "a", "b", "c")
    )
    value = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>mgjrpg-02 authored options - {PACKET_REVISION}</title>
<style>
:root{{--paper:#fffaf0;--ink:#34203f;--plum:#76567c;--mint:#bcebd4;--coral:#ee806d}}
*{{box-sizing:border-box}} body{{margin:0;background:var(--paper);color:var(--ink);font:16px/1.45 system-ui,sans-serif}}
main{{max-width:1500px;margin:auto;padding:24px}} h1,h2,h3{{line-height:1.12}} .gate{{padding:16px 20px;border:3px solid #a54f63;border-radius:16px;background:#fff0eb}}
.identity{{padding:14px 18px;border-left:6px solid #27896a;background:#eaf9f2}} figure{{margin:28px 0;padding:14px;border:1px solid #cbb9cd;border-radius:16px;background:#fff}}
figure img{{display:block;max-width:100%;height:auto;margin:auto}} figcaption{{margin-top:10px}} code{{overflow-wrap:anywhere}}
.actual-grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}} .actual-grid article{{min-height:205px;padding:10px;border:1px solid #d7c7d7;border-radius:12px;background:linear-gradient(45deg,#f7f3fa 25%,#e5dfea 25%,#e5dfea 50%,#f7f3fa 50%,#f7f3fa 75%,#e5dfea 75%);background-size:16px 16px}}
.actual{{display:block;margin:auto;max-width:none}} li{{margin:.35rem 0}} a{{color:#6c356d}}
</style></head><body><main>
<h1>mgjrpg-02 independently authored direction options - {PACKET_REVISION}</h1>
<p class="gate"><strong>PENDING HUMAN RENDERING DIRECTION.</strong> These are fresh, independent rendering explorations. They are not runtime assets, source masters, identity authorities, rendering authorities, or future edit targets. Do not publish any board cell or proof derivative.</p>
<p class="identity"><strong>Candidate C remains immutable.</strong> Her approved face, age, golden-blonde shoulder-length hair, blue irises, proportions, mint/lavender/backpack costume, silhouette, registration, and emotional character are not reopened by this comparison.</p>
<figure><a href="mgjrpg-02-authored-directions.png"><img src="mgjrpg-02-authored-directions.png" alt="A B C authored direction sampler and enemy extension boards"></a><figcaption>A/B/C family boards. Compare rendering language, coloured contour brightness, detail frequency, family cohesion, terrain handling, and sticker treatment.</figcaption></figure>
<figure><a href="ame-source-comparison.png"><img src="ame-source-comparison.png" alt="Current Candidate C and authored rendering options A B C"></a><figcaption>Dedicated Ame source-original comparison. Use the direct immutable links below for 1:1 inspection.</figcaption></figure>
<figure><a href="ame-actual-size.png"><img src="ame-actual-size.png" alt="Ame actual-size comparisons"></a><figcaption>Exact 155, 103, 84, 64, 56, and 40px proof pixels; deterministic extraction, registration, and resize only.</figcaption></figure>
<figure><a href="ame-contour-background-closeups.png"><img src="ame-contour-background-closeups.png" alt="Ame contour closeups on six backgrounds"></a><figcaption>Authored contour and alpha-edge evidence over light, dark, neutral, saturated, and representative field backgrounds. No contour was added by the proof builder.</figcaption></figure>
<h2>Exact actual-size PNGs</h2><div class="actual-grid">{actual_cards}</div>
<h2>Immutable inputs</h2><ul>{source_links}</ul>
<p><a href="mgjrpg-02-options-report.json">Scored/technical report</a> · <a href="proof-index.json">proof index</a></p>
</main></body></html>"""
    return value.encode("utf-8")


def _acquire_publish_lock(destination: Path) -> Path:
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists():
        raise FileExistsError(
            f"Immutable proof packet already exists: {destination}; increment the packet revision"
        )
    lock = destination.parent / f".{destination.name}.publish.lock"
    try:
        with lock.open("x", encoding="utf-8") as stream:
            stream.write(f"pid={os.getpid()}\n")
    except FileExistsError as exc:
        raise RuntimeError(f"Another proof publisher holds {lock}") from exc
    if destination.exists():
        lock.unlink(missing_ok=True)
        raise FileExistsError(
            f"Immutable proof packet already exists: {destination}; increment the packet revision"
        )
    return lock


def _publish_staged_packet(stage: Path, destination: Path, lock: Path) -> None:
    try:
        if destination.exists():
            raise FileExistsError(
                f"Immutable proof packet already exists: {destination}; increment the packet revision"
            )
        os.rename(stage, destination)
    finally:
        lock.unlink(missing_ok=True)


def generate_mgjrpg02_options(
    *,
    root: Path = ROOT,
    proof_root: Path = PROOF_ROOT,
    packet_revision: str = PACKET_REVISION,
) -> dict[str, Any]:
    """Build and atomically publish one immutable authored-options packet."""

    root = root.resolve()
    proof_root = proof_root.resolve()
    if not proof_root.is_relative_to(root):
        raise ValueError("Proof root must stay inside the repository root")
    if packet_revision != PACKET_REVISION:
        raise ValueError(f"This implementation is bound to packet revision {PACKET_REVISION}")

    missing_inputs = [
        row["path"] for row in AUTHORED_OPTION_INPUTS if not (root / row["path"]).is_file()
    ]
    if not (root / CURRENT_AME_RELATIVE).is_file():
        missing_inputs.append(CURRENT_AME_RELATIVE.as_posix())
    if not (root / FAMILY_TRANSFER_COMPARATOR_RELATIVE).is_file():
        missing_inputs.append(FAMILY_TRANSFER_COMPARATOR_RELATIVE.as_posix())
    missing_inputs.extend(
        row["path"]
        for row in FAMILY_TRANSFER_COMPONENTS
        if not (root / row["path"]).is_file()
    )
    if missing_inputs:
        raise FileNotFoundError("Missing authored-options input(s): " + ", ".join(missing_inputs))

    input_facts = [
        {**row, **_image_fact(root / row["path"], root)}
        for row in AUTHORED_OPTION_INPUTS
    ]
    identity_fact = {
        **AME_INPUTS[0],
        **_image_fact(root / CURRENT_AME_RELATIVE, root),
        "authority": "immutable-human-approved-identity-and-construction",
    }
    reference_components = [
        {**row, **_image_fact(root / row["path"], root)}
        for row in FAMILY_TRANSFER_COMPONENTS
    ]
    reference_fact = {
        "id": "family-transfer-current-comparator",
        "kind": "identity-function-comparator",
        **_image_fact(root / FAMILY_TRANSFER_COMPARATOR_RELATIVE, root),
        "authority": "comparison-layout-only-non-authority",
        "components": reference_components,
    }
    provenance = _validate_provenance(
        root,
        input_facts,
        identity_fact,
        reference_fact,
    )
    uniqueness = _validate_option_uniqueness(root, input_facts)

    destination = proof_root / "mgjrpg-02" / packet_revision
    packet_relative = _repo_relative(destination, root)
    lock = _acquire_publish_lock(destination)
    stage = Path(tempfile.mkdtemp(prefix=f".{packet_revision}-stage-", dir=destination.parent))
    published = False
    try:
        proof_facts: list[dict[str, Any]] = []

        def write_png(name: str, image: Image.Image) -> None:
            stage_path = stage / name
            _write_png(image, stage_path)
            proof_facts.append(
                _artifact_fact(stage_path, f"{packet_relative}/{Path(name).as_posix()}")
            )

        write_png("mgjrpg-02-authored-directions.png", _board_comparison(root))
        write_png("ame-source-comparison.png", _ame_source_comparison(root))

        masters: dict[str, Image.Image] = {}
        deliveries: dict[str, dict[int, Image.Image]] = {}
        for row in AME_INPUTS:
            option = row["option"]
            master = _registered_ame(root / row["path"])
            masters[option] = master
            write_png(f"derived/ame-{option}-registered-512.png", master)
            deliveries[option] = {}
            for size in AME_DELIVERY_SIZES:
                delivery = premultiplied_resize(master, (size, size))
                deliveries[option][size] = delivery
                write_png(f"delivery/ame-{option}-{size}.png", delivery)

        write_png("ame-actual-size.png", _actual_size_sheet(deliveries))
        write_png(
            "ame-contour-background-closeups.png",
            _contour_closeup_sheet(root, masters),
        )

        report = {
            "schema": REPORT_SCHEMA,
            "packetRevision": packet_revision,
            "status": "pending-human-rendering-direction",
            "authority": {
                "candidateC": "immutable-human-approved-identity-and-construction",
                "authoredBoards": "comparison-only-non-authority",
                "extractedAndResizedProofs": "review-only-non-authority",
                "runtimePublicationApproved": False,
                "renderingDirectionApproved": False,
                "futureEditAuthorityGranted": False,
            },
            "inputs": {
                "identityAuthority": identity_fact,
                "referenceInputs": [reference_fact],
                "authoredOptions": input_facts,
            },
            "provenance": provenance,
            "optionUniqueness": uniqueness,
            "artDirectorAssessment": {
                "scale": "1-5; manual preselection assessment, pending Human review",
                "criteria": [
                    "small-size silhouette and recognition",
                    "two-to-four masses and three-value grouping",
                    "focal hierarchy",
                    "colour-aware contour lightness, locality, and continuity",
                    "material truth and detail frequency",
                    "Maze palette and motif discipline",
                    "Ame identity preservation",
                    "family coherence",
                    "production alpha readiness",
                    "terrain seam evidence and readability",
                    "grayscale and colour-vision-independent resilience",
                    "expected runtime efficiency",
                ],
                "scores": {
                    "a": [4.5, 4.0, 4.5, 4.5, 4.0, 5.0, 4.5, 4.5, 1.0, 2.5, 4.0, 4.0],
                    "b": [3.5, 3.5, 4.0, 3.5, 4.0, 4.5, 4.0, 3.5, 1.0, 2.5, 3.0, 3.5],
                    "c": [5.0, 5.0, 5.0, 4.0, 3.5, 4.0, 3.0, 4.5, 1.0, 3.0, 4.5, 4.5],
                },
                "recommendation": "Direction A, with Direction C's stricter optical simplification used as a delivery-size rule rather than an Ame identity redraw.",
                "selectionBoundary": "Candidate C remains the sole Ame identity/construction authority. Option A is a rendering reference only; any changed face, hair volume, costume landmark, silhouette, pose, or registration must be rejected during production.",
                "knownLimitations": [
                    "All concept boards are opaque RGB composites and cannot pass production alpha QA.",
                    "Terrain cells demonstrate palette and pattern language only; none proves periodic seams or phase-safe repetition.",
                    "All directions contain some highlight directionality that must be neutralised for static field art.",
                    "Direction A should lose microdetail on skeleton, lizard, alpaca, and ornate props before delivery.",
                    "Direction B softens important boundaries too far at 56-40 px.",
                    "Direction C sometimes collapses material-local contours into a global violet perimeter and materially drifts Ame's construction.",
                ],
            },
            "ameProofContract": {
                "sourceOperation": "deterministic alpha extraction, registration, and premultiplied resize only",
                "synthesizedContour": False,
                "masterSize": AME_MASTER_SIZE,
                "deliverySizes": list(AME_DELIVERY_SIZES),
                "backgroundExtraction": AME_EXTRACTION,
                "registration": AME_REGISTRATION,
                "closeupCropBoxes512LTRBExclusive": [
                    {"label": label, "box": list(box)} for label, box in CONTOUR_CROPS
                ],
                "backgrounds": [label for label, _ in BACKGROUNDS],
            },
            "reviewQuestions": [
                "Which direction best expresses Maze's clean, authored, chunky magical-girl JRPG identity?",
                "Are the locally colour-responsive contours bright and chromatic enough while remaining readable?",
                "Does Ame preserve the approved Candidate C identity at source and actual delivery sizes?",
                "Which family examples should be retained, revised, or rejected before any production batch?",
            ],
            "warnings": [
                "Generator originals use painted checker/light backgrounds; alpha in this packet is deterministic review extraction, not an approved production matte.",
                "A/B/C board cells are composite concept evidence and must never be cropped into production assets or used as future edit authorities.",
                "No runtime, catalogue, public asset, lighting, animation, VFX, or UI code is changed by this packet.",
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
        report_name = "mgjrpg-02-options-report.json"
        report_path = stage / report_name
        _write_bytes(_json_bytes(report), report_path)
        report_fact = _artifact_fact(report_path, f"{packet_relative}/{report_name}")

        html_name = "index.html"
        html_path = stage / html_name
        _write_bytes(
            _html_document(packet_relative, input_facts, identity_fact, reference_fact),
            html_path,
        )
        html_fact = _artifact_fact(html_path, f"{packet_relative}/{html_name}")

        proof_index = {
            "schema": PACKET_SCHEMA,
            "packetRevision": packet_revision,
            "packetRoot": packet_relative,
            "status": "pending-human-rendering-direction",
            "identityAuthority": identity_fact,
            "referenceInputs": [reference_fact],
            "authoredInputs": input_facts,
            "provenanceFiles": [provenance["prompts"], provenance["runRecord"]],
            "proofFiles": [*proof_facts, report_fact, html_fact],
            "bindingRule": "Every source/provenance/proof path is bound by exact SHA-256 and byte count. The proof index does not self-hash.",
            "authorityRule": "Candidate C remains the only approved Ame identity/construction authority. All A/B/C boards and derivatives are comparison-only and pending Human direction.",
            "runtimeImpact": {"files": 0, "encodedBytes": 0, "decodedBytes": 0},
        }
        index_path = stage / "proof-index.json"
        _write_bytes(_json_bytes(proof_index), index_path)
        index_hash = sha256_file(index_path)
        index_bytes = index_path.stat().st_size

        _publish_staged_packet(stage, destination, lock)
        published = True
        return {
            "packetRevision": packet_revision,
            "packetRoot": packet_relative,
            "proofIndex": f"{packet_relative}/proof-index.json",
            "proofIndexSha256": index_hash,
            "proofIndexBytes": index_bytes,
            "proofFileCount": len(proof_index["proofFiles"]),
            "runtimeByteDelta": 0,
            "status": "pending-human-rendering-direction",
        }
    finally:
        if not published:
            shutil.rmtree(stage, ignore_errors=True)
            lock.unlink(missing_ok=True)
