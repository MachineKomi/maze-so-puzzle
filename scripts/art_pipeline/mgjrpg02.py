"""Deterministic, non-production proofing for the proposed ``mgjrpg-02`` recipe.

This module deliberately separates authored rendering from alpha extraction.  Its
local-contour transform is an *assay visualisation*: it demonstrates and measures
the proposed contract without creating a runtime asset or a future edit authority.
"""

from __future__ import annotations

import hashlib
import html
import io
import json
import math
import os
import tempfile
from pathlib import Path
from typing import Any, Iterable
from urllib.parse import quote

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

from builder import _preflight_record, _prepare, _validate_build_source, resolve_record
from cutout import normalize_to_srgb_rgba, premultiplied_resize
from encode import encoder_environment, save_image
from manifest import PIPELINE_INPUT_PATHS, REQUIREMENTS_PATH
from model import PROOF_ROOT, ROOT, image_facts, json_bytes, posix_relative, read_json, sha256_file
from periodic import seam_metrics


PACKET_REVISION = "v08"
PACKET_SCHEMA = "maze-art-mgjrpg02-proof-index/v1"
RECIPE_PATH = ROOT / "docs" / "source-assets" / "recipes" / "mgjrpg-02.json"
REVIEW_PATH = ROOT / "docs" / "source-assets" / "reviews" / "mgjrpg-02-canary-v01.json"

SCORE_KEYS = (
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
)

# These are Maze-owned contour tokens.  They intentionally describe no external
# project's palette.  The fixed small family prevents rainbow-fragmented edges.
CONTOUR_TOKENS: dict[str, tuple[int, int, int]] = {
    "warm-gold": (168, 98, 73),
    "aubergine": (128, 84, 154),
    "blue-plum": (77, 105, 168),
    "russet-plum": (169, 83, 97),
    "leaf-plum": (76, 125, 104),
    "cream-mauve": (140, 105, 132),
}
TOKEN_NAMES = tuple(CONTOUR_TOKENS)
TOKEN_RGB = np.asarray([CONTOUR_TOKENS[name] for name in TOKEN_NAMES], dtype=np.uint8)
MINIMUM_RELATIVE_LUMINANCE_DELTA = float(
    read_json(RECIPE_PATH)["provisionalMetrics"]["minimumRelativeLuminanceDelta"]
)

BACKGROUNDS: tuple[tuple[str, tuple[int, int, int, int]], ...] = (
    ("paper", (255, 250, 238, 255)),
    ("ink", (45, 32, 56, 255)),
    ("middle-gray", (128, 128, 128, 255)),
    ("magenta", (255, 0, 255, 255)),
    ("cyan", (0, 232, 232, 255)),
)
REPRESENTATIVE_BACKGROUND_PATH = "public/assets/floor-woodland-dirt-v1.png"

CANARIES: tuple[dict[str, Any], ...] = (
    {
        "id": "ame-v02-candidate-c",
        "label": "Approved Ame Candidate C",
        "family": "character",
        "recordId": "ame-v02-source",
        "path": None,
        "treatmentClass": "character-contour",
        "recommendation": "retain-identity-calibrate-rendering",
        "sizes": [56, 64, 77, 82, 84, 96, 103, 155],
        "cropAnchor": [0.43, 0.18],
        "baseline": [5, 4, 4, 4, 4, 4, 5, 5, 5, 5, None, 4],
    },
    {
        "id": "animal-fox",
        "label": "Fox",
        "family": "friend",
        "recordId": "animal-fox-v01-source",
        "path": "public/assets/animal-fox.png",
        "treatmentClass": "character-contour",
        "recommendation": "retain-current-pixels",
        "sizes": [40, 56, 64, 77, 84, 103, 155],
        "cropAnchor": [0.28, 0.29],
        "baseline": [5, 4, 4, 4, 3.5, 4, 5, 5, 4, 4, None, 5],
    },
    {
        "id": "animal-alpaca",
        "label": "Alpaca",
        "family": "friend",
        "recordId": "animal-alpaca-v01-source",
        "path": "public/assets/animal-alpaca-v1.webp",
        "treatmentClass": "character-contour",
        "recommendation": "replace-rendering-preserve-identity",
        "sizes": [40, 56, 64, 77, 84, 103, 155],
        "cropAnchor": [0.50, 0.24],
        "baseline": [3, 3, 3, 3, 1.5, 2, 4, 5, 3, 2, None, 2],
    },
    {
        "id": "enemy-goblin",
        "label": "Goblin",
        "family": "enemy",
        "recordId": "goblin-v01-source",
        "path": "public/assets/goblin.png",
        "treatmentClass": "character-contour",
        "recommendation": "retain-current-pixels",
        "sizes": [50, 56, 64, 69, 74, 84, 92, 138],
        "cropAnchor": [0.32, 0.27],
        "baseline": [5, 4, 4, 4, 3.5, 4, 4, 5, 4, 4, None, 5],
    },
    {
        "id": "enemy-jelly-sorcerer",
        "label": "Jelly Sorcerer",
        "family": "enemy",
        "recordId": "enemy-jelly-sorcerer-v01-source",
        "path": "public/assets/enemy-jelly-sorcerer-v1.webp",
        "treatmentClass": "character-contour",
        "recommendation": "refine-rendering-preserve-identity",
        "sizes": [50, 56, 64, 69, 74, 84, 92, 138],
        "cropAnchor": [0.37, 0.22],
        "baseline": [4, 3, 3, 3, 3, 2, 4, 5, 3, 3, None, 4],
    },
    {
        "id": "weapon-moon-wand",
        "label": "Moon Wand",
        "family": "weapon",
        "recordId": "weapon-moon-wand-v01-source",
        "path": "public/assets/weapon-moon-wand-v1.png",
        "treatmentClass": "character-contour",
        "recommendation": "replace-rendering-and-simplify",
        "sizes": [25, 32, 35, 48, 59, 64, 78, 97, 118],
        "cropAnchor": [0.51, 0.30],
        "baseline": [2, 2, 2, 2, 1, 2, 1, None, 2, 2, None, 2],
    },
    {
        "id": "key-rose-heart",
        "label": "Rose Heart lock/key",
        "family": "lock",
        "recordId": "key-rose-heart-v01-source",
        "path": "public/assets/key-rose-heart-v1.png",
        "treatmentClass": "character-contour",
        "recommendation": "replace-optical-rendering-preserve-motif",
        "sizes": [16, 24, 25, 32, 35, 37, 44, 47, 70],
        "cropAnchor": [0.50, 0.27],
        "baseline": [2.5, 3, 3, 3, 3, 3, 3, None, 3, 4, None, 3],
    },
    {
        "id": "door-rose-heart",
        "label": "Rose Heart door",
        "family": "lock",
        "recordId": "door-rose-heart-v01-source",
        "path": "public/assets/door-rose-heart-v1.png",
        "treatmentClass": "character-contour",
        "recommendation": "refine-rendering-preserve-construction",
        "sizes": [56, 64, 77, 82, 84, 96, 103, 155],
        "cropAnchor": [0.50, 0.13],
        "baseline": [4, 3, 3, 3, 4, 3, 2, None, 3, 4, None, 5],
    },
    {
        "id": "portal-rose-heart",
        "label": "Rose Heart portal",
        "family": "portal",
        "recordId": "portal-rose-heart-v01-source",
        "path": "public/assets/portal-rose-heart-v1.png",
        "treatmentClass": "character-contour",
        "recommendation": "refine-rendering-preserve-motif",
        "sizes": [56, 64, 77, 82, 84, 96, 103, 155],
        "cropAnchor": [0.50, 0.23],
        "baseline": [4, 3, 3, 3, 2, 2, 2, None, 3, 3, None, 3],
    },
    {
        "id": "reward-first-star",
        "label": "First Star",
        "family": "reward",
        "recordId": "reward-trail-sticker-v01-source",
        "path": "public/assets/reward-trail-sticker.png",
        "treatmentClass": "semantic-ui-cutout",
        "recommendation": "retain-shelf-add-optical-sibling",
        "sizes": [17, 24, 25, 30, 32, 38, 43, 48, 52, 58, 64, 69, 86, 104, 256],
        "cropAnchor": [0.50, 0.50],
        "baseline": [3.5, 4, 4, 4, 5, 3, 2, None, 3, 5, None, 4],
    },
    {
        "id": "nav-home",
        "label": "Home navigation icon",
        "family": "navigation",
        "recordId": "nav-home-v01-source",
        "path": "public/assets/nav-home-v1.webp",
        "treatmentClass": "semantic-ui-cutout",
        "recommendation": "replace-optical-rendering-preserve-metaphor",
        "sizes": [20, 27, 29, 34, 36, 48, 54],
        "cropAnchor": [0.50, 0.50],
        "baseline": [3, 2, 3, 3, 4, 3, 3, None, 3, 3, None, 4],
    },
    {
        "id": "nav-help",
        "label": "Help navigation icon",
        "family": "navigation",
        "recordId": "nav-help-v01-source",
        "path": "public/assets/nav-help-v1.webp",
        "treatmentClass": "semantic-ui-cutout",
        "recommendation": "replace-semantic-metaphor",
        "sizes": [14, 19, 20, 24, 25, 32, 38, 48, 51, 60, 64, 96],
        "cropAnchor": [0.50, 0.50],
        "baseline": [1, 2, 2, 2, 4, 3, 2, None, 2, 2, None, 2],
    },
    {
        "id": "terrain-sunny-floor",
        "label": "Sunny Stone floor",
        "family": "terrain",
        "recordId": "floor-v03-source",
        "path": "public/assets/floor-v3.png",
        "treatmentClass": "terrain-boundary",
        "recommendation": "refine-frequency-and-neutral-light",
        "sizes": [61, 84, 90, 104, 112, 168],
        "baseline": [4, 3, 3, 3, None, 3, 4, None, 3, 5, 3, 3],
    },
    {
        "id": "terrain-sunny-wall",
        "label": "Sunny Stone wall",
        "family": "terrain",
        "recordId": "wall-v03-source",
        "path": "public/assets/wall-v3.png",
        "treatmentClass": "terrain-boundary",
        "recommendation": "refine-frequency-and-neutral-light",
        "sizes": [61, 84, 90, 104, 112, 168],
        "baseline": [4, 3, 3, 3, None, 3, 4, None, 3, 5, 3, 4],
    },
    {
        "id": "terrain-wishing-floor",
        "label": "Wishing Woods floor",
        "family": "terrain",
        "recordId": "floor-woodland-dirt-v01-source",
        "path": "public/assets/floor-woodland-dirt-v1.png",
        "treatmentClass": "terrain-boundary",
        "recommendation": "replace-rendering-quieter-material",
        "sizes": [61, 84, 90, 104, 112, 168],
        "baseline": [3, 2, 2, 2, None, 2, 3, None, 2, 5, 3, 2],
    },
    {
        "id": "terrain-wishing-hedge",
        "label": "Wishing Woods hedge",
        "family": "terrain",
        "recordId": "wall-hedge-v01-source",
        "path": "public/assets/wall-hedge-v1.png",
        "treatmentClass": "terrain-boundary",
        "recommendation": "replace-rendering-larger-leaf-masses",
        "sizes": [61, 84, 90, 104, 112, 168],
        "baseline": [3, 2, 2, 2, None, 1, 3, None, 2, 5, 2, 2],
    },
    {
        "id": "terrain-wishing-dressing",
        "label": "Wishing Woods garden dressing",
        "family": "dressing",
        "recordId": "terrain-dressing-garden-v01-source",
        "path": "public/assets/terrain-dressing-garden-v1.png",
        "treatmentClass": "terrain-boundary",
        "recommendation": "retain-subordinate-density-check",
        "sizes": [61, 84, 90, 104, 112, 168],
        "baseline": [4, 3, 3, 3, None, 3, 4, None, 3, 4, 4, 4],
    },
    {
        "id": "hazard-water",
        "label": "Water",
        "family": "hazard",
        "recordId": "water-v02-source",
        "path": "public/assets/water-v2.png",
        "treatmentClass": "terrain-boundary",
        "recommendation": "replace-nonmirrored-ripple-master",
        "sizes": [61, 84, 90, 104, 112, 168],
        "baseline": [4, 2, 2, 2, None, 2, 3, None, 2, 5, 1, 3],
    },
    {
        "id": "hazard-lava",
        "label": "Lava",
        "family": "hazard",
        "recordId": "lava-v02-source",
        "path": "public/assets/lava-v2.png",
        "treatmentClass": "terrain-boundary",
        "recommendation": "replace-asymmetric-flow-master",
        "sizes": [61, 84, 90, 104, 112, 168],
        "baseline": [4, 3, 3, 3, None, 2, 2, None, 2, 5, 1, 4],
    },
    {
        "id": "hazard-poison",
        "label": "Poison",
        "family": "hazard",
        "recordId": "terrain-poison-v01-source",
        "path": "public/assets/terrain-poison-v1.png",
        "treatmentClass": "terrain-boundary",
        "recommendation": "refine-aubergine-eddies-and-pattern",
        "sizes": [61, 84, 90, 104, 112, 168],
        "baseline": [4, 3, 3, 3, None, 2, 3, None, 3, 5, 3, 3],
    },
)


def _font(size: int = 12) -> ImageFont.ImageFont:
    try:
        return ImageFont.load_default(size=size)
    except TypeError:  # pragma: no cover - older Pillow fallback
        return ImageFont.load_default()


def _label(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    value: str,
    *,
    fill: tuple[int, int, int, int] = (45, 32, 56, 255),
    size: int = 12,
) -> None:
    draw.text(xy, value, font=_font(size), fill=fill)


def _contained(source: Image.Image, size: int) -> Image.Image:
    rgba = normalize_to_srgb_rgba(source)
    scale = min(size / rgba.width, size / rgba.height)
    resized = premultiplied_resize(
        rgba,
        (max(1, round(rgba.width * scale)), max(1, round(rgba.height * scale))),
    )
    result = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    result.alpha_composite(resized, ((size - resized.width) // 2, (size - resized.height) // 2))
    return result


def _checker(size: tuple[int, int], cell: int = 8) -> Image.Image:
    result = Image.new("RGBA", size, (248, 242, 250, 255))
    draw = ImageDraw.Draw(result)
    for y in range(0, size[1], cell):
        for x in range(0, size[0], cell):
            if (x // cell + y // cell) % 2:
                draw.rectangle(
                    (x, y, min(size[0] - 1, x + cell - 1), min(size[1] - 1, y + cell - 1)),
                    fill=(218, 208, 227, 255),
                )
    return result


def _load_canary(entry: dict[str, Any]) -> tuple[Image.Image, dict[str, Any]]:
    if entry["path"] is None:
        record_path, record = resolve_record(str(entry["recordId"]))
        _preflight_record(record_path, record)
        source_path = _validate_build_source(record, record["build"])
        profile = dict(next(row for row in record["build"]["profiles"] if row["id"] == "presentation-512"))
        with Image.open(source_path) as source:
            source.load()
            source_dimensions = list(source.size)
            image = _prepare(source, "cutout-resize", profile, record["build"])
        authority = {
            "kind": "immutable-source-plus-recorded-build",
            "path": posix_relative(source_path),
            "sha256": sha256_file(source_path),
            "bytes": source_path.stat().st_size,
            "sourceDimensions": source_dimensions,
            "recordPath": posix_relative(record_path),
            "recordSha256": sha256_file(record_path),
            "workingDimensions": list(image.size),
            "buildSha256": hashlib.sha256(json_bytes(record["build"])).hexdigest(),
        }
        return image.convert("RGBA"), authority
    path = ROOT / str(entry["path"])
    with Image.open(path) as source:
        source.load()
        image = normalize_to_srgb_rgba(source)
    record_path, record = resolve_record(str(entry["recordId"]))
    sources: list[dict[str, Any]] = []
    for source in record.get("sources", []):
        source_path = ROOT / str(source["path"])
        if source_path.is_file():
            with Image.open(source_path) as source_image:
                source_image.load()
                dimensions = list(source_image.size)
            sources.append({**source, "dimensions": dimensions})
    return image, {
        "kind": "historical-runtime-evidence",
        "path": str(entry["path"]),
        "sha256": sha256_file(path),
        "bytes": path.stat().st_size,
        "sourceDimensions": list(image.size),
        "workingDimensions": list(image.size),
        "recordPath": posix_relative(record_path),
        "recordSha256": sha256_file(record_path),
        "linkedSourceEvidence": sources,
        "reason": "The historical source-to-runtime transform is not completely proven; the exact current runtime pixels are the comparison authority.",
    }


def _srgb_luminance(rgb: np.ndarray) -> np.ndarray:
    values = rgb.astype(np.float32) / 255.0
    linear = np.where(values <= 0.04045, values / 12.92, ((values + 0.055) / 1.055) ** 2.4)
    return 0.2126 * linear[..., 0] + 0.7152 * linear[..., 1] + 0.0722 * linear[..., 2]


def _rgb_to_hsv(rgb: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    values = rgb.astype(np.float32) / 255.0
    maximum = values.max(axis=-1)
    minimum = values.min(axis=-1)
    delta = maximum - minimum
    hue = np.zeros_like(maximum)
    nonzero = delta > 1e-6
    red = nonzero & (maximum == values[..., 0])
    green = nonzero & (maximum == values[..., 1])
    blue = nonzero & (maximum == values[..., 2])
    hue[red] = np.mod((values[..., 1][red] - values[..., 2][red]) / delta[red], 6.0)
    hue[green] = (values[..., 2][green] - values[..., 0][green]) / delta[green] + 2.0
    hue[blue] = (values[..., 0][blue] - values[..., 1][blue]) / delta[blue] + 4.0
    hue *= 60.0
    saturation = np.zeros_like(maximum)
    np.divide(delta, maximum, out=saturation, where=maximum > 1e-6)
    return hue, saturation, maximum


def _material_classes(rgb: np.ndarray) -> np.ndarray:
    hue, saturation, value = _rgb_to_hsv(rgb)
    labels = np.full(hue.shape, TOKEN_NAMES.index("cream-mauve"), dtype=np.uint8)
    chromatic = saturation >= 0.16
    labels[chromatic & (hue >= 72) & (hue < 170)] = TOKEN_NAMES.index("leaf-plum")
    labels[chromatic & (hue >= 170) & (hue < 255)] = TOKEN_NAMES.index("blue-plum")
    labels[chromatic & (hue >= 255) & (hue < 338)] = TOKEN_NAMES.index("aubergine")
    labels[chromatic & ((hue < 30) | (hue >= 338))] = TOKEN_NAMES.index("russet-plum")
    golden = chromatic & (hue >= 30) & (hue < 72) & (value >= 0.56)
    labels[golden] = TOKEN_NAMES.index("warm-gold")
    labels[chromatic & (hue >= 30) & (hue < 72) & ~golden] = TOKEN_NAMES.index("russet-plum")
    return labels


def _normalized_blur(rgb: np.ndarray, mask: np.ndarray, radius: float) -> np.ndarray:
    weight = Image.fromarray((mask.astype(np.uint8) * 255), "L").filter(ImageFilter.GaussianBlur(radius))
    weight_array = np.asarray(weight, dtype=np.float32) / 255.0
    channels = []
    for channel in range(3):
        premultiplied = Image.fromarray((rgb[..., channel] * mask).astype(np.uint8), "L")
        blurred = np.asarray(premultiplied.filter(ImageFilter.GaussianBlur(radius)), dtype=np.float32)
        channels.append(np.where(weight_array > 1e-4, blurred / np.maximum(weight_array, 1e-4), 0.0))
    return np.clip(np.stack(channels, axis=-1), 0, 255).astype(np.uint8)


def _edge_mask(mask: np.ndarray, width: int) -> np.ndarray:
    kernel = max(3, width * 2 + 1)
    if kernel % 2 == 0:
        kernel += 1
    eroded = np.asarray(
        Image.fromarray(mask.astype(np.uint8) * 255, "L").filter(ImageFilter.MinFilter(kernel)),
        dtype=np.uint8,
    ) > 0
    return mask & ~eroded


def _connected_from_seed(mask: np.ndarray, seed: np.ndarray) -> np.ndarray:
    connected = seed & mask
    mask_image = Image.fromarray(mask.astype(np.uint8) * 255, "L")
    for _ in range(max(mask.shape)):
        grown = np.asarray(
            Image.fromarray(connected.astype(np.uint8) * 255, "L").filter(ImageFilter.MaxFilter(3)),
            dtype=np.uint8,
        ) > 0
        updated = grown & (np.asarray(mask_image) > 0)
        if np.array_equal(updated, connected):
            break
        connected = updated
    return connected


def _default_contour_width(size: tuple[int, int]) -> int:
    minimum = min(size)
    if minimum >= 512:
        return 4
    if minimum >= 256:
        return 3
    if minimum >= 84:
        return 2
    if minimum >= 40:
        return 2
    return 1


def _local_contour_assay(
    source: Image.Image,
    semantic_ui: bool = False,
    contour_width: int | None = None,
) -> tuple[Image.Image, dict[str, Any]]:
    rgba = np.asarray(normalize_to_srgb_rgba(source)).copy()
    rgb = rgba[..., :3]
    alpha = rgba[..., 3]
    visible = alpha >= 16
    reference_width = int(contour_width or _default_contour_width(source.size))

    material_mask = visible.copy()
    cream_cutline = np.zeros_like(visible)
    if semantic_ui:
        hue, saturation, value = _rgb_to_hsv(rgb)
        cream_candidates = visible & (saturation < 0.20) & (value > 0.74)
        boundary_seed = cream_candidates & _edge_mask(visible, max(1, reference_width * 2))
        cream_cutline = _connected_from_seed(cream_candidates, boundary_seed)
        content = visible & ~cream_cutline
        # Avoid treating isolated pale highlights as the entire subject cutline.
        if int(content.sum()) >= max(32, int(visible.sum() * 0.15)):
            material_mask = content

    edge = _edge_mask(material_mask, reference_width)
    sampled = _normalized_blur(rgb, material_mask & ~edge, max(2.0, reference_width * 1.2))
    labels = _material_classes(sampled)
    label_image = Image.fromarray(labels, "L").filter(ImageFilter.ModeFilter(max(3, reference_width | 1)))
    labels = np.asarray(label_image, dtype=np.uint8)
    replacement = TOKEN_RGB[np.clip(labels, 0, len(TOKEN_NAMES) - 1)]
    rgba[edge, :3] = replacement[edge]
    result = Image.fromarray(rgba, "RGBA")
    metrics = _contour_metrics(
        source,
        result,
        edge,
        sampled,
        labels,
        semantic_ui,
        cream_cutline,
        reference_width,
    )
    return result, metrics


def _periodic_filter(source: Image.Image, radius: float) -> Image.Image:
    rgba = normalize_to_srgb_rgba(source)
    tiled = Image.new("RGBA", (rgba.width * 3, rgba.height * 3))
    for y in range(3):
        for x in range(3):
            tiled.paste(rgba, (x * rgba.width, y * rgba.height))
    filtered = tiled.filter(ImageFilter.GaussianBlur(radius))
    center = filtered.crop((rgba.width, rgba.height, rgba.width * 2, rgba.height * 2))
    softened = Image.blend(rgba, center, 0.36)
    alpha = rgba.getchannel("A")
    rgb = softened.convert("RGB").quantize(colors=32, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE).convert("RGB")
    return Image.merge("RGBA", (*rgb.split(), alpha))


def _terrain_assay(source: Image.Image) -> tuple[Image.Image, dict[str, Any]]:
    result = _periodic_filter(source, max(1.2, min(source.size) / 310.0))
    before = _terrain_metrics(source)
    after = _terrain_metrics(result)
    return result, {
        "mode": "material-boundary-no-enclosure",
        "note": "Frequency/value assay only. It adds no enclosing character outline and cannot repair mirrored composition.",
        "baseline": before,
        "assay": after,
    }


def make_assay(source: Image.Image, treatment_class: str) -> tuple[Image.Image, dict[str, Any]]:
    if treatment_class == "terrain-boundary":
        return _terrain_assay(source)
    return _local_contour_assay(source, semantic_ui=treatment_class == "semantic-ui-cutout")


def _json_number(value: float) -> float:
    return round(float(value), 6)


def _contour_metrics(
    baseline: Image.Image,
    assay: Image.Image,
    edge: np.ndarray,
    sampled: np.ndarray,
    labels: np.ndarray,
    semantic_ui: bool,
    cream_cutline: np.ndarray,
    reference_width: int,
) -> dict[str, Any]:
    baseline_pixels = np.asarray(normalize_to_srgb_rgba(baseline))
    assay_pixels = np.asarray(normalize_to_srgb_rgba(assay))
    count = max(1, int(edge.sum()))
    sample_l = _srgb_luminance(sampled)
    baseline_l = _srgb_luminance(baseline_pixels[..., :3])
    assay_l = _srgb_luminance(assay_pixels[..., :3])
    expected = labels

    def summary(pixels: np.ndarray, luminance: np.ndarray) -> dict[str, Any]:
        differences = pixels[..., :3].astype(np.int16)[..., None, :] - TOKEN_RGB.astype(np.int16)[None, None, ...]
        family = np.square(differences.astype(np.int32)).sum(axis=-1).argmin(axis=-1).astype(np.uint8)
        dark_enough = edge & (
            (sample_l - luminance) >= MINIMUM_RELATIVE_LUMINANCE_DELTA
        )
        locality = edge & (family == expected)
        pure_black = edge & (pixels[..., 0] <= 3) & (pixels[..., 1] <= 3) & (pixels[..., 2] <= 3)
        near_ink = edge & (pixels[..., 0] <= 58) & (pixels[..., 1] <= 42) & (pixels[..., 2] <= 70)
        token_distribution = {
            TOKEN_NAMES[index]: _json_number(int((edge & (family == index)).sum()) / count)
            for index in range(len(TOKEN_NAMES))
        }
        expected_distribution = {
            TOKEN_NAMES[index]: _json_number(int((edge & (expected == index)).sum()) / count)
            for index in range(len(TOKEN_NAMES))
        }
        transitions = (
            (edge[:, 1:] & edge[:, :-1] & (family[:, 1:] != family[:, :-1])).sum()
            + (edge[1:, :] & edge[:-1, :] & (family[1:, :] != family[:-1, :])).sum()
        )
        adjacencies = (
            (edge[:, 1:] & edge[:, :-1]).sum()
            + (edge[1:, :] & edge[:-1, :]).sum()
        )
        deltas = (sample_l - luminance)[edge]
        return {
            "outerLineContrastContinuity": _json_number(dark_enough.sum() / count),
            # The assay assigns the same token labels used by this comparison,
            # so this is transform self-consistency rather than an independent
            # aesthetic judgement of authored contour locality.
            "transformAssignmentAgreement": _json_number(locality.sum() / count),
            "meanRelativeLuminanceDelta": _json_number(deltas.mean() if deltas.size else 0),
            "p10RelativeLuminanceDelta": _json_number(np.quantile(deltas, 0.10) if deltas.size else 0),
            "pureBlackVisibleContourPixels": int(pure_black.sum()),
            "darkestInkLikePerimeterFraction": _json_number(near_ink.sum() / count),
            "hueFamilyTransitionRate": _json_number(transitions / max(1, int(adjacencies))),
            "observedTokenDistribution": token_distribution,
            "expectedLocalMaterialDistribution": expected_distribution,
        }

    alpha = assay_pixels[..., 3]
    exact_border = np.concatenate((alpha[0, :], alpha[-1, :], alpha[:, 0], alpha[:, -1]))
    fringe = (alpha > 0) & (alpha < 255)
    fringe_rgb = assay_pixels[..., :3][fringe]
    white_fringe = (
        int(((fringe_rgb.min(axis=1) >= 235)).sum()) if fringe_rgb.size else 0
    )
    cream_cutline_pixels = int(cream_cutline.sum())
    cream_cutline_changed = int(
        (
            cream_cutline
            & np.any(baseline_pixels[..., :3] != assay_pixels[..., :3], axis=-1)
        ).sum()
    )
    cream_cutline_preserved = bool(
        semantic_ui
        and cream_cutline_pixels > 0
        and cream_cutline_changed == 0
    )
    return {
        "schema": "storybook-contour-metrics/v1-provisional",
        "scope": "analytical-assay-not-production-approval",
        "referenceContourWidthPixels": reference_width,
        "edgePixelCount": int(edge.sum()),
        # This is measured from detected exterior-connected cream pixels.  It is
        # deliberately not inferred from the declared treatment class alone.
        "semanticUiCreamCutlinePreserved": cream_cutline_preserved,
        "semanticUiCreamCutlineEvidence": {
            "applicable": semantic_ui,
            "detectedPixels": cream_cutline_pixels,
            "changedPixels": cream_cutline_changed,
        },
        "baseline": summary(baseline_pixels, baseline_l),
        "assay": summary(assay_pixels, assay_l),
        "alpha": {
            "exactEdgeNonzeroAlphaPixels": int((exact_border > 0).sum()),
            "partialAlphaPixels": int(fringe.sum()),
            "nearWhitePartialAlphaPixels": white_fringe,
            "geometryAndAlphaByteExactBetweenBaselineAndAssay": bool(
                np.array_equal(baseline_pixels[..., 3], assay_pixels[..., 3])
            ),
        },
        "provisionalThresholds": {
            "pureBlackVisibleContourPixels": 0,
            "outerLineContrastContinuityReference": 0.97,
            "outerLineContrastContinuitySmallestDelivery": 0.94,
            "minimumRelativeLuminanceDelta": MINIMUM_RELATIVE_LUMINANCE_DELTA,
            "transformAssignmentAgreementGlobal": 0.85,
            "transformAssignmentAgreementMeaning": (
                "Self-consistency between this deterministic transform's assigned token "
                "and its output pixel; not independent aesthetic locality evidence."
            ),
            "note": "Before Human calibration approval, only invariant/safety failures are blocking; aesthetic envelopes are frozen from accepted canaries, not invented from this transform.",
        },
    }


def _edge_density(image: Image.Image) -> float:
    gray = ImageOps.grayscale(normalize_to_srgb_rgba(image).convert("RGB"))
    edges = np.asarray(gray.filter(ImageFilter.FIND_EDGES), dtype=np.uint8)
    return _json_number((edges >= 32).mean())


def _mirror_mae(rgb: np.ndarray, axis: int) -> float:
    return _json_number(np.abs(rgb.astype(np.int16) - np.flip(rgb, axis=axis).astype(np.int16)).mean())


def _terrain_metrics(image: Image.Image) -> dict[str, Any]:
    rgba = normalize_to_srgb_rgba(image)
    rgb = np.asarray(rgba.convert("RGB"), dtype=np.uint8)
    try:
        seams = seam_metrics(rgba)
    except ValueError:
        seams = {"passed": False, "reason": "not an opaque periodic tile"}
    return {
        "edgeDensityThreshold32": _edge_density(rgba),
        "horizontalMirrorMae": _mirror_mae(rgb, 1),
        "verticalMirrorMae": _mirror_mae(rgb, 0),
        "seams": seams,
        "decodedBytesUpperBound": rgba.width * rgba.height * 4,
    }


def _mass_and_value_metrics(image: Image.Image) -> dict[str, Any]:
    rgba = normalize_to_srgb_rgba(image)
    pixels = np.asarray(rgba)
    visible = pixels[..., 3] >= 16
    if not visible.any():
        return {"fourMassShares": [], "threeValueShares": [0, 0, 0]}
    rgb = pixels[..., :3][visible]
    if len(rgb) > 65536:
        rgb = rgb[:: math.ceil(len(rgb) / 65536)]
    sample = Image.fromarray(rgb.reshape((-1, 1, 3)), "RGB")
    palette = sample.quantize(colors=4, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    counts = sorted((count for count, _color in palette.getcolors() or []), reverse=True)
    total = max(1, sum(counts))
    luminance = _srgb_luminance(rgb)
    values = [
        int((luminance < 0.22).sum()),
        int(((luminance >= 0.22) & (luminance < 0.62)).sum()),
        int((luminance >= 0.62).sum()),
    ]
    return {
        "fourMassShares": [_json_number(count / total) for count in counts],
        "threeValueShares": [_json_number(value / len(luminance)) for value in values],
    }


def _cvd(source: Image.Image, mode: str) -> Image.Image:
    rgba = np.asarray(normalize_to_srgb_rgba(source)).copy()
    if mode == "grayscale":
        gray = np.asarray(ImageOps.grayscale(Image.fromarray(rgba[..., :3], "RGB")))
        rgba[..., :3] = gray[..., None]
        return Image.fromarray(rgba, "RGBA")
    matrices = {
        "protanopia": np.asarray(((0.152, 1.053, -0.205), (0.115, 0.786, 0.099), (-0.004, -0.048, 1.052))),
        "deuteranopia": np.asarray(((0.367, 0.861, -0.228), (0.280, 0.673, 0.047), (-0.012, 0.043, 0.969))),
        "tritanopia": np.asarray(((1.256, -0.077, -0.179), (-0.078, 0.931, 0.148), (0.005, 0.691, 0.304))),
    }
    transformed = np.asarray(rgba[..., :3], dtype=np.float32) @ matrices[mode].T
    rgba[..., :3] = np.clip(transformed, 0, 255).astype(np.uint8)
    return Image.fromarray(rgba, "RGBA")


def _score_map(values: Iterable[float | None]) -> dict[str, float | None]:
    return {key: value for key, value in zip(SCORE_KEYS, values, strict=True)}


def _assay_scores(entry: dict[str, Any]) -> dict[str, float | None]:
    values = list(entry["baseline"])
    if entry["treatmentClass"] == "terrain-boundary":
        for index in (1, 2, 5):
            if values[index] is not None:
                values[index] = min(5, float(values[index]) + 0.5)
    # A deterministic recolour cannot award itself better contour or alpha art-
    # direction scores.  Those remain separate judgements at the Human gate.
    return _score_map(values)


def _acceptance_scores(entry: dict[str, Any]) -> dict[str, float | None]:
    result: dict[str, float | None] = {}
    for key, baseline in _score_map(entry["baseline"]).items():
        if baseline is None:
            result[key] = None
        elif key in {"smallSizeRecognition", "colourAwareContour", "alphaQuality", "grayscaleCvdReadability"}:
            result[key] = 4
        else:
            result[key] = 3.5
    if entry["treatmentClass"] == "terrain-boundary":
        result["terrainRepetitionSeams"] = 4
    return result


def _provisional_threshold_summary(
    entry: dict[str, Any],
    reference_metrics: dict[str, Any],
    delivery_metrics: dict[int, dict[str, Any] | None],
) -> dict[str, Any]:
    """Report contract checks without turning them into art-direction scores."""

    if entry["treatmentClass"] == "terrain-boundary":
        return {
            "applicable": False,
            "reason": "Terrain uses material-boundary and seam evidence, not enclosing-contour thresholds.",
            "passed": None,
            "failedChecks": [],
        }

    smallest_size = min(int(size) for size in entry["sizes"])
    smallest_metrics = delivery_metrics[smallest_size]
    if smallest_metrics is None:
        raise ValueError(f"Missing cutout delivery metrics for {entry['id']} at {smallest_size}px")

    thresholds = reference_metrics["provisionalThresholds"]
    reference_continuity = float(
        reference_metrics["assay"]["outerLineContrastContinuity"]
    )
    smallest_continuity = float(
        smallest_metrics["assay"]["outerLineContrastContinuity"]
    )
    reference_minimum = float(thresholds["outerLineContrastContinuityReference"])
    smallest_minimum = float(thresholds["outerLineContrastContinuitySmallestDelivery"])
    pure_black_maximum = int(thresholds["pureBlackVisibleContourPixels"])
    reference_black = int(
        reference_metrics["assay"]["pureBlackVisibleContourPixels"]
    )
    smallest_black = int(
        smallest_metrics["assay"]["pureBlackVisibleContourPixels"]
    )
    reference_alpha = reference_metrics["alpha"]
    smallest_alpha = smallest_metrics["alpha"]

    checks = {
        "referenceContinuity": {
            "value": reference_continuity,
            "minimum": reference_minimum,
            "passed": reference_continuity >= reference_minimum,
        },
        "smallestDeliveryContinuity": {
            "cssPixels": smallest_size,
            "value": smallest_continuity,
            "minimum": smallest_minimum,
            "passed": smallest_continuity >= smallest_minimum,
        },
        "pureBlack": {
            "referencePixels": reference_black,
            "smallestDeliveryPixels": smallest_black,
            "maximum": pure_black_maximum,
            "passed": (
                reference_black <= pure_black_maximum
                and smallest_black <= pure_black_maximum
            ),
        },
        "alpha": {
            "referenceGeometryByteExact": bool(
                reference_alpha["geometryAndAlphaByteExactBetweenBaselineAndAssay"]
            ),
            "smallestDeliveryGeometryByteExact": bool(
                smallest_alpha["geometryAndAlphaByteExactBetweenBaselineAndAssay"]
            ),
            "referenceExactEdgeNonzeroAlphaPixels": int(
                reference_alpha["exactEdgeNonzeroAlphaPixels"]
            ),
            "smallestDeliveryExactEdgeNonzeroAlphaPixels": int(
                smallest_alpha["exactEdgeNonzeroAlphaPixels"]
            ),
            "passed": (
                bool(reference_alpha["geometryAndAlphaByteExactBetweenBaselineAndAssay"])
                and bool(smallest_alpha["geometryAndAlphaByteExactBetweenBaselineAndAssay"])
                and int(reference_alpha["exactEdgeNonzeroAlphaPixels"]) == 0
                and int(smallest_alpha["exactEdgeNonzeroAlphaPixels"]) == 0
            ),
        },
    }
    failed = [name for name, result in checks.items() if not result["passed"]]
    return {
        "applicable": True,
        **checks,
        "passed": not failed,
        "failedChecks": failed,
        "note": (
            "Measured safety/contrast checks only. Transform-assignment agreement is "
            "self-consistency and Human art-direction scores remain separate."
        ),
    }


def _write_once_bytes(value: bytes, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.is_file():
        if destination.read_bytes() == value:
            return
        raise FileExistsError(
            f"Immutable proof revision differs; increment the packet revision instead of overwriting {destination.as_posix()}"
        )
    with tempfile.NamedTemporaryFile(
        mode="wb", prefix=f".{destination.stem}-", suffix=destination.suffix, dir=destination.parent, delete=False
    ) as stream:
        temporary = Path(stream.name)
        stream.write(value)
        stream.flush()
        os.fsync(stream.fileno())
    try:
        os.link(temporary, destination)
    finally:
        temporary.unlink(missing_ok=True)


def _encode_png(image: Image.Image, destination: Path) -> bytes:
    destination.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        prefix=f".{destination.stem}-", suffix=".png", dir=destination.parent, delete=False
    ) as stream:
        temporary = Path(stream.name)
    try:
        save_image(normalize_to_srgb_rgba(image), temporary, "png", {"compress_level": 9, "optimize": False})
        return temporary.read_bytes()
    finally:
        temporary.unlink(missing_ok=True)


def _write_once_png(image: Image.Image, destination: Path) -> None:
    _write_once_bytes(_encode_png(image, destination), destination)


def _display_path(path: Path) -> str:
    try:
        return posix_relative(path)
    except ValueError:
        return path.resolve().as_posix()


def _proof_evidence(path: Path) -> dict[str, Any]:
    display_path = _display_path(path)
    evidence = {
        "path": display_path,
        "sha256": sha256_file(path),
        "bytes": path.stat().st_size,
    }
    if path.suffix.lower() in {".png", ".webp", ".jpg", ".jpeg"}:
        evidence.update(image_facts(path))
    return evidence


def _solid_or_game_background(name: str, size: tuple[int, int]) -> Image.Image:
    if name != "wishing-woods":
        color = next(color for label, color in BACKGROUNDS if label == name)
        return Image.new("RGBA", size, color)
    with Image.open(ROOT / REPRESENTATIVE_BACKGROUND_PATH) as source:
        source.load()
        tile = source.convert("RGBA").resize((84, 84), Image.Resampling.LANCZOS)
    result = Image.new("RGBA", size)
    for y in range(0, size[1], tile.height):
        for x in range(0, size[0], tile.width):
            result.paste(tile, (x, y))
    return result


def _comparison_overview(rows: list[dict[str, Any]]) -> Image.Image:
    row_height = 158
    sheet = Image.new("RGBA", (1500, 72 + row_height * len(rows)), (255, 250, 238, 255))
    draw = ImageDraw.Draw(sheet)
    _label(draw, (16, 12), "mgjrpg-02 CANARY / CURRENT mgjrpg-01 OR HISTORICAL -> NON-PRODUCTION CONTRACT ASSAY", size=18)
    _label(draw, (16, 38), "Ame identity is fixed. Assay pixels are review evidence, never masters or runtime assets.", fill=(132, 24, 65, 255), size=14)
    _label(draw, (460, 55), "CURRENT", size=12)
    _label(draw, (670, 55), "PROPOSED TREATMENT ASSAY", size=12)
    for index, row in enumerate(rows):
        y = 72 + index * row_height
        if index % 2:
            draw.rectangle((0, y, sheet.width - 1, y + row_height - 1), fill=(246, 239, 249, 255))
        _label(draw, (16, y + 16), row["label"], size=14)
        _label(draw, (16, y + 39), row["family"] + " / " + row["recommendation"], fill=(92, 71, 105, 255))
        _label(draw, (16, y + 62), f"source/working {row['baseline'].width}x{row['baseline'].height}")
        background = _checker((128, 128), 12)
        background.alpha_composite(_contained(row["baseline"], 128))
        sheet.alpha_composite(background, (430, y + 12))
        proposed = _checker((128, 128), 12)
        proposed.alpha_composite(_contained(row["assay"], 128))
        sheet.alpha_composite(proposed, (650, y + 12))
        base_score = row["baselineScore"]
        assay_score = row["assayScore"]
        summary_keys = ("smallSizeRecognition", "colourAwareContour", "materialTruth", "alphaQuality", "grayscaleCvdReadability")
        cursor_y = y + 16
        for key in summary_keys:
            b = base_score[key]
            a = assay_score[key]
            _label(draw, (840, cursor_y), f"{key}: {b if b is not None else '-'} -> {a if a is not None else '-'}")
            cursor_y += 21
        _label(draw, (1180, y + 16), "GATE", fill=(132, 24, 65, 255), size=13)
        _label(draw, (1180, y + 40), "Pending Human recipe approval")
        _label(draw, (1180, y + 62), "No runtime pointer")
        _label(draw, (1180, y + 84), "Encoded/decode delta: 0")
    return sheet


def _actual_size_sheet(rows: list[dict[str, Any]]) -> tuple[Image.Image, list[dict[str, Any]]]:
    widths = []
    heights = []
    for row in rows:
        widths.append(250 + sum(2 * int(size) + 16 for size in row["sizes"]))
        heights.append(max(int(size) for size in row["sizes"]) + 45)
    sheet = Image.new("RGBA", (max(1280, max(widths)), 62 + sum(heights)), (255, 250, 238, 255))
    draw = ImageDraw.Draw(sheet)
    _label(draw, (14, 10), "ACTUAL DELIVERY SIZES / LEFT CURRENT, RIGHT mgjrpg-02 ASSAY / 1 CSS PX = 1 IMAGE PX", size=17)
    _label(draw, (14, 35), "Sizes cover compact Web, 960x540, iPad, 720p, and 1080p TV observations; optical siblings remain required where named.")
    y = 62
    contracts: list[dict[str, Any]] = []
    for index, (row, height) in enumerate(zip(rows, heights, strict=True)):
        if index % 2:
            draw.rectangle((0, y, sheet.width - 1, y + height - 1), fill=(246, 239, 249, 255))
        _label(draw, (14, y + 10), row["label"], size=13)
        _label(draw, (14, y + 31), row["recommendation"], fill=(92, 71, 105, 255))
        x = 245
        for size in row["sizes"]:
            size = int(size)
            left = _checker((size, size), max(2, size // 7))
            left.alpha_composite(row["deliveryAssays"][size][0])
            right = _checker((size, size), max(2, size // 7))
            right.alpha_composite(row["deliveryAssays"][size][1])
            sheet.alpha_composite(left, (x, y + 6))
            sheet.alpha_composite(right, (x + size + 3, y + 6))
            _label(draw, (x, y + size + 9), f"{size}px", size=10)
            contracts.append(
                {
                    "canaryId": row["id"],
                    "cssPixels": size,
                    "currentPanelLTRBExclusive": [x, y + 6, x + size, y + 6 + size],
                    "assayPanelLTRBExclusive": [x + size + 3, y + 6, x + 2 * size + 3, y + 6 + size],
                }
            )
            x += 2 * size + 16
        y += height
    return sheet, contracts


def _delivery_pair(
    baseline: Image.Image,
    assay: Image.Image,
    size: int,
    treatment_class: str,
) -> tuple[Image.Image, Image.Image, Image.Image, dict[str, Any] | None]:
    baseline_delivery = _contained(baseline, size)
    if treatment_class == "terrain-boundary":
        assay_delivery = _contained(assay, size)
        delivery_metrics = None
    else:
        assay_delivery, delivery_metrics = _local_contour_assay(
            baseline_delivery,
            semantic_ui=treatment_class == "semantic-ui-cutout",
            contour_width=_default_contour_width((size, size)),
        )
    result = Image.new("RGBA", (size * 2 + 3, size), (0, 0, 0, 0))
    left = _checker((size, size), max(2, size // 7))
    left.alpha_composite(baseline_delivery)
    right = _checker((size, size), max(2, size // 7))
    right.alpha_composite(assay_delivery)
    result.alpha_composite(left)
    result.alpha_composite(right, (size + 3, 0))
    return result, baseline_delivery, assay_delivery, delivery_metrics


def _silhouette_crop(
    source: Image.Image,
    anchor: tuple[float, float] | list[float],
    crop_size: int,
) -> tuple[tuple[int, int, int, int], dict[str, int | bool]]:
    """Choose a crop near ``anchor`` that crosses the exterior alpha boundary.

    Interior feature crops make adversarial proof backgrounds inert.  This
    selector restricts candidates to visible pixels beside transparent pixels
    connected to the canvas edge, then requires both alpha-zero and alpha-255
    evidence in the final crop.
    """

    rgba = np.asarray(normalize_to_srgb_rgba(source))
    alpha = rgba[..., 3]
    visible = alpha >= 16
    transparent = ~visible
    exterior_seed = np.zeros_like(transparent)
    exterior_seed[0, :] = transparent[0, :]
    exterior_seed[-1, :] = transparent[-1, :]
    exterior_seed[:, 0] = transparent[:, 0]
    exterior_seed[:, -1] = transparent[:, -1]
    exterior = _connected_from_seed(transparent, exterior_seed)
    exterior_neighbour = np.asarray(
        Image.fromarray(exterior.astype(np.uint8) * 255, "L").filter(ImageFilter.MaxFilter(3)),
        dtype=np.uint8,
    ) > 0
    boundary = visible & exterior_neighbour
    points = np.argwhere(boundary)
    if not len(points):
        raise ValueError("Cutout has no exterior transparent silhouette boundary")

    height, width = alpha.shape
    crop_size = min(int(crop_size), width, height)
    anchor_x = float(anchor[0]) * width
    anchor_y = float(anchor[1]) * height
    distances = (points[:, 1] - anchor_x) ** 2 + (points[:, 0] - anchor_y) ** 2
    minimum_functional_evidence = max(4, round(crop_size * crop_size * 0.05))

    for point_index in np.argsort(distances):
        center_y, center_x = (int(value) for value in points[point_index])
        left = max(0, min(width - crop_size, center_x - crop_size // 2))
        top = max(0, min(height - crop_size, center_y - crop_size // 2))
        crop_box = (left, top, left + crop_size, top + crop_size)
        crop_alpha = alpha[top : top + crop_size, left : left + crop_size]
        crop_boundary = boundary[top : top + crop_size, left : left + crop_size]
        transparent_pixels = int((crop_alpha == 0).sum())
        opaque_pixels = int((crop_alpha == 255).sum())
        functional_transparent = int((crop_alpha < 16).sum())
        functional_visible = int((crop_alpha >= 16).sum())
        if (
            transparent_pixels == 0
            or opaque_pixels == 0
            or functional_transparent < minimum_functional_evidence
            or functional_visible < minimum_functional_evidence
        ):
            continue
        evidence: dict[str, int | bool] = {
            "transparentAlphaZeroPixels": transparent_pixels,
            "opaqueAlpha255Pixels": opaque_pixels,
            "functionalTransparentPixels": functional_transparent,
            "functionalVisiblePixels": functional_visible,
            "partialAlphaPixels": int(((crop_alpha > 0) & (crop_alpha < 255)).sum()),
            "exteriorBoundaryPixels": int(crop_boundary.sum()),
            "crossesExteriorSilhouette": True,
        }
        return crop_box, evidence

    raise ValueError(
        "Could not choose a useful silhouette crop with both transparent and opaque evidence"
    )


def _contour_crop_sheet(rows: list[dict[str, Any]]) -> tuple[Image.Image, list[dict[str, Any]]]:
    cutouts = [row for row in rows if row["treatmentClass"] != "terrain-boundary"]
    backgrounds = [label for label, _ in BACKGROUNDS] + ["wishing-woods"]
    panel = 132
    pair_width = panel * 2 + 5
    row_height = panel + 52
    sheet = Image.new("RGBA", (235 + len(backgrounds) * (pair_width + 12), 72 + len(cutouts) * row_height), (255, 250, 238, 255))
    draw = ImageDraw.Draw(sheet)
    _label(draw, (14, 10), "LOCAL-CONTOUR CROPS / CURRENT LEFT, ASSAY RIGHT / NEAREST-NEIGHBOUR", size=17)
    _label(draw, (14, 36), "Paper, ink, gray, saturated checks, and Wishing Woods. Inspect continuity, locality, halo, and silhouette.")
    for column, background in enumerate(backgrounds):
        _label(draw, (235 + column * (pair_width + 12), 57), background, size=10)
    contracts: list[dict[str, Any]] = []
    for index, row in enumerate(cutouts):
        y = 72 + index * row_height
        _label(draw, (14, y + 10), row["label"], size=13)
        _label(draw, (14, y + 31), row["recommendation"], fill=(92, 71, 105, 255), size=10)
        width, height = row["baseline"].size
        crop_size = max(36, round(min(width, height) * 0.18))
        crop_box, alpha_evidence = _silhouette_crop(
            row["baseline"], row["cropAnchor"], crop_size
        )
        baseline_crop = row["baseline"].crop(crop_box).resize((panel, panel), Image.Resampling.NEAREST)
        assay_crop = row["assay"].crop(crop_box).resize((panel, panel), Image.Resampling.NEAREST)
        for column, background in enumerate(backgrounds):
            x = 235 + column * (pair_width + 12)
            bkg = _solid_or_game_background(background, (panel, panel))
            bkg.alpha_composite(baseline_crop)
            sheet.alpha_composite(bkg, (x, y + 7))
            bkg2 = _solid_or_game_background(background, (panel, panel))
            bkg2.alpha_composite(assay_crop)
            sheet.alpha_composite(bkg2, (x + panel + 5, y + 7))
            contracts.append(
                {
                    "canaryId": row["id"],
                    "sourceCropLTRBExclusive": list(crop_box),
                    "sourceAlphaEvidence": alpha_evidence,
                    "resample": "nearest-neighbour",
                    "background": background,
                    "currentPanelLTRBExclusive": [x, y + 7, x + panel, y + 7 + panel],
                    "assayPanelLTRBExclusive": [x + panel + 5, y + 7, x + pair_width, y + 7 + panel],
                }
            )
    return sheet, contracts


def _tiled(source: Image.Image, tile_size: int, repeats: int) -> Image.Image:
    tile = normalize_to_srgb_rgba(source).resize((tile_size, tile_size), Image.Resampling.LANCZOS)
    result = Image.new("RGBA", (tile_size * repeats, tile_size * repeats))
    for y in range(repeats):
        for x in range(repeats):
            result.paste(tile, (x * tile_size, y * tile_size))
    return result


def _terrain_repeat_sheet(rows: list[dict[str, Any]]) -> tuple[Image.Image, list[dict[str, Any]]]:
    terrain = [row for row in rows if row["treatmentClass"] == "terrain-boundary"]
    tile_size = 64
    row_height = 342
    sheet = Image.new("RGBA", (1510, 72 + row_height * len(terrain)), (255, 250, 238, 255))
    draw = ImageDraw.Draw(sheet)
    _label(draw, (14, 10), "TERRAIN + HAZARD MATERIAL-BOUNDARY ASSAY / NO CHARACTER-LIKE ENCLOSING OUTLINES", size=17)
    _label(draw, (14, 36), "Current and proposed low-frequency assay at 1x, 3x3, 5x5. Mirrored composition remains a replacement failure.")
    headings = ((260, "current 1x"), (345, "assay 1x"), (440, "current 3x3"), (650, "assay 3x3"), (865, "current 5x5"), (1190, "assay 5x5"))
    for x, heading in headings:
        _label(draw, (x, 57), heading, size=10)
    contracts: list[dict[str, Any]] = []
    for index, row in enumerate(terrain):
        y = 72 + index * row_height
        if index % 2:
            draw.rectangle((0, y, sheet.width - 1, y + row_height - 1), fill=(246, 239, 249, 255))
        _label(draw, (14, y + 12), row["label"], size=13)
        _label(draw, (14, y + 35), row["recommendation"], fill=(92, 71, 105, 255), size=10)
        panels = (
            (260, _tiled(row["baseline"], tile_size, 1), "current-1"),
            (345, _tiled(row["assay"], tile_size, 1), "assay-1"),
            (440, _tiled(row["baseline"], tile_size, 3), "current-3"),
            (650, _tiled(row["assay"], tile_size, 3), "assay-3"),
            (865, _tiled(row["baseline"], tile_size, 5), "current-5"),
            (1190, _tiled(row["assay"], tile_size, 5), "assay-5"),
        )
        for x, panel, panel_id in panels:
            sheet.alpha_composite(panel, (x, y + 8))
            contracts.append(
                {
                    "canaryId": row["id"],
                    "panel": panel_id,
                    "tilePixels": tile_size,
                    "repeats": int(panel_id[-1]),
                    "LTRBExclusive": [x, y + 8, x + panel.width, y + 8 + panel.height],
                }
            )
    return sheet, contracts


def _cvd_sheet(rows: list[dict[str, Any]]) -> tuple[Image.Image, list[dict[str, Any]]]:
    modes = ("grayscale", "protanopia", "deuteranopia", "tritanopia")
    box = 74
    pair_width = box * 2 + 5
    row_height = 96
    sheet = Image.new("RGBA", (260 + len(modes) * (pair_width + 26), 72 + len(rows) * row_height), (255, 250, 238, 255))
    draw = ImageDraw.Draw(sheet)
    _label(draw, (14, 10), "GRAYSCALE + COLOUR-VISION SIMULATION / CURRENT LEFT, ASSAY RIGHT", size=17)
    _label(draw, (14, 36), "Simulation is a diagnostic, not a substitute for Human testing. Motif, value, shape, and pattern must carry meaning.")
    for column, mode in enumerate(modes):
        _label(draw, (260 + column * (pair_width + 26), 57), mode, size=10)
    contracts: list[dict[str, Any]] = []
    for index, row in enumerate(rows):
        y = 72 + index * row_height
        if index % 2:
            draw.rectangle((0, y, sheet.width - 1, y + row_height - 1), fill=(246, 239, 249, 255))
        _label(draw, (14, y + 12), row["label"], size=12)
        sample_size = min(64, int(row["sizes"][0])) if row["treatmentClass"] != "terrain-boundary" else 64
        if sample_size in row["deliveryAssays"]:
            baseline, assay = row["deliveryAssays"][sample_size]
        else:
            baseline = _contained(row["baseline"], sample_size)
            assay = _contained(row["assay"], sample_size)
        for column, mode in enumerate(modes):
            x = 260 + column * (pair_width + 26)
            left = Image.new("RGBA", (box, box), (45, 32, 56, 255))
            right = Image.new("RGBA", (box, box), (45, 32, 56, 255))
            transformed_baseline = _cvd(baseline, mode)
            transformed_assay = _cvd(assay, mode)
            left.alpha_composite(transformed_baseline, ((box - sample_size) // 2, (box - sample_size) // 2))
            right.alpha_composite(transformed_assay, ((box - sample_size) // 2, (box - sample_size) // 2))
            sheet.alpha_composite(left, (x, y + 7))
            sheet.alpha_composite(right, (x + box + 5, y + 7))
            contracts.append(
                {
                    "canaryId": row["id"],
                    "mode": mode,
                    "actualSamplePixels": sample_size,
                    "currentPanelLTRBExclusive": [x, y + 7, x + box, y + 7 + box],
                    "assayPanelLTRBExclusive": [x + box + 5, y + 7, x + pair_width, y + 7 + box],
                }
            )
    return sheet, contracts


def _imagegen_rejection_sheet() -> tuple[Image.Image, dict[str, Any]]:
    authority_path = ROOT / "docs/source-assets/characters/ame/v02/ame-v02-candidate-c-generator-original.png"
    assay_path = ROOT / "docs/source-assets/calibrations/mgjrpg-02/v01/ame-c-rendering-assay-a-generator-original.png"
    with Image.open(authority_path) as source:
        source.load()
        authority = source.convert("RGBA")
    with Image.open(assay_path) as source:
        source.load()
        assay = source.convert("RGBA")
    sheet = Image.new("RGBA", (1580, 1260), (255, 250, 238, 255))
    draw = ImageDraw.Draw(sheet)
    _label(draw, (16, 12), "IMAGEGEN RENDERING ASSAY A - REJECTED / NOT AN IDENTITY OR RENDERING AUTHORITY", fill=(132, 24, 65, 255), size=18)
    _label(draw, (16, 40), "Candidate C remains immutable. This run proves the edit boundary and records failure evidence; it is not a candidate.")
    original_view = authority.resize((512, 512), Image.Resampling.LANCZOS)
    output_view = assay.resize((512, 512), Image.Resampling.LANCZOS)
    sheet.alpha_composite(original_view, (16, 75))
    output_background = Image.new("RGBA", (512, 512), (45, 32, 56, 255))
    output_background.alpha_composite(output_view)
    sheet.alpha_composite(output_background, (548, 75))
    magenta = Image.new("RGBA", (512, 512), (255, 0, 255, 255))
    magenta.alpha_composite(output_view)
    sheet.alpha_composite(magenta, (1080, 75))
    _label(draw, (16, 592), "approved C immutable RGB source / checker is source content")
    _label(draw, (548, 592), "assay output over ink")
    _label(draw, (1080, 592), "assay output over magenta")
    # The generator original contains one non-zero alpha sample at the lower-left
    # encoded boundary.  Show the exact crop and a separately labelled binary
    # alpha diagnostic so the otherwise nearly invisible alpha-1 contaminant is
    # reviewable without pretending that the diagnostic is source colour.
    crop_box = (0, 1190, 64, 1254)
    crop_panel_size = (384, 384)
    crop = assay.crop(crop_box).resize(crop_panel_size, Image.Resampling.NEAREST)
    crop_background = Image.new("RGBA", crop.size, (255, 0, 255, 255))
    crop_background.alpha_composite(crop)
    sheet.alpha_composite(crop_background, (16, 650))
    crop_alpha = assay.getchannel("A").crop(crop_box)
    crop_alpha_array = np.asarray(crop_alpha, dtype=np.uint8)
    binary_alpha = crop_alpha.point(lambda value: 255 if value > 0 else 0)
    binary_panel = Image.new("RGBA", crop_panel_size, (45, 32, 56, 255))
    binary_panel.paste(
        Image.new("RGBA", crop_panel_size, (255, 253, 245, 255)),
        mask=binary_alpha.resize(crop_panel_size, Image.Resampling.NEAREST),
    )
    sheet.alpha_composite(binary_panel, (416, 650))
    _label(draw, (16, 625), "exact 64 px bottom-left crop / magenta / nearest 6x")
    _label(draw, (416, 625), "binary non-zero-alpha diagnostic / not source colour")
    _label(draw, (830, 660), "REJECTION REASONS", fill=(132, 24, 65, 255), size=15)
    _label(draw, (830, 695), "- alpha reaches the 1254 source boundary")
    _label(draw, (830, 720), "- approved registration/safe-zone envelope not preserved")
    _label(draw, (830, 745), "- chromatic edge halo is visible on adversarial backgrounds")
    _label(draw, (830, 780), "- never use this output as an edit target")
    alpha = np.asarray(assay.getchannel("A"))
    edge = np.concatenate((alpha[0, :], alpha[-1, :], alpha[:, 0], alpha[:, -1]))
    return sheet, {
        "authority": {
            "path": posix_relative(authority_path),
            "sha256": sha256_file(authority_path),
            "bytes": authority_path.stat().st_size,
            "dimensions": list(authority.size),
        },
        "output": {
            "path": posix_relative(assay_path),
            "sha256": sha256_file(assay_path),
            "bytes": assay_path.stat().st_size,
            "dimensions": list(assay.size),
            "alphaBoundsLTRBExclusive": list(assay.getchannel("A").getbbox() or (0, 0, 0, 0)),
            "exactEdgeNonzeroAlphaPixels": int((edge > 0).sum()),
            "disposition": "rejected",
        },
        "sourceCropLTRBExclusive": list(crop_box),
        "cropComposite": "straight RGBA over opaque magenta",
        "cropResample": "nearest-neighbour-6x",
        "binaryAlphaDiagnostic": {
            "rule": "white where source alpha is greater than zero; deep plum where alpha is zero",
            "sourceColourPreserved": False,
            "nonzeroAlphaPixels": int((crop_alpha_array > 0).sum()),
            "maximumAlpha": int(crop_alpha_array.max()),
        },
    }


def _packet_html(rows: list[dict[str, Any]], output_names: list[str]) -> bytes:
    proof_cards = []
    for name in output_names:
        escaped = html.escape(name, quote=True)
        url = quote(name, safe="/._-")
        proof_cards.append(
            f'<figure><a href="{url}"><img src="{url}" alt="{escaped}"></a><figcaption>{escaped}</figcaption></figure>'
        )
    table_rows = []
    source_cards = []
    for row in rows:
        label = html.escape(row["label"])
        recommendation = html.escape(row["recommendation"])
        baseline_score = _average_score(row["baselineScore"])
        assay_score = _average_score(row["assayScore"])
        table_rows.append(
            f"<tr><th>{label}</th><td>{html.escape(row['family'])}</td><td>{recommendation}</td>"
            f"<td>{baseline_score:.2f}</td><td>{assay_score:.2f}</td><td>pending Human</td></tr>"
        )
        authority = row["authority"]
        source_url = "../../../../" + quote(str(authority["path"]), safe="/._-")
        candidate_url = quote(f"candidates/{row['id']}-mgjrpg02-assay.png", safe="/._-")
        linked = "".join(
            f'<li><a href="../../../../{quote(str(item["path"]), safe="/._-")}">{html.escape(str(item["path"]))}</a> — {item.get("dimensions")}</li>'
            for item in authority.get("linkedSourceEvidence", [])
        )
        source_cards.append(
            f'<article><h3>{label}</h3><p><strong>Comparison authority:</strong> '
            f'<a href="{source_url}">{html.escape(str(authority["path"]))}</a> at {authority["sourceDimensions"]}. '
            f'<strong>Assay:</strong> <a href="{candidate_url}">natural-size PNG</a>.</p>'
            f'<p>{html.escape(str(authority.get("reason", "Generated directly through the recorded immutable-source build.")))}</p>'
            + (f"<details><summary>Linked source evidence inspected</summary><ul>{linked}</ul></details>" if linked else "")
            + "</article>"
        )
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Maze so Puzzle mgjrpg-02 canary calibration {PACKET_REVISION}</title><style>
:root {{ font-family:system-ui,sans-serif;color:#2d2038;background:#fffaf0 }} body {{ max-width:1600px;margin:auto;padding:22px }}
h1,h2,h3 {{ color:#57315f }} .gate {{ border:4px solid #841841;background:#ffe7ef;padding:14px;font-weight:800 }}
.scope {{ border-left:6px solid #3e564b;background:#f1ebf6;padding:12px 16px }} figure {{ margin:26px 0 }}
img {{ max-width:100%;height:auto;border:1px solid #6b5068;background:white }} figcaption {{ font:600 13px ui-monospace,monospace }}
table {{ border-collapse:collapse;width:100% }} th,td {{ border:1px solid #bba9c1;padding:7px;text-align:left }} th {{ background:#f3eaf5 }}
article {{ border-top:1px solid #cdbed2;padding:8px 0 }} code {{ background:#efe7f1;padding:2px 4px }}
</style></head><body><h1><code>mgjrpg-02</code> colour-aware-outline canary — {PACKET_REVISION}</h1>
<p class="gate">HUMAN RENDERING APPROVAL REQUIRED. Candidate C identity/construction is approved and closed; this packet does not approve a rendering recipe, publish an asset, or move a runtime pointer.</p>
<div class="scope"><p>This packet compares exact current <code>mgjrpg-01</code>/historical pixels with a deterministic, non-production rendering assay. The assay preserves geometry and alpha for cutouts, uses Maze-owned deep-plum contour tokens, and treats terrain as material boundaries without character-like enclosing lines.</p>
<p>The ImageGen attempt is explicitly rejected and retained as provenance/failure evidence. No Puzzle Pets Arena pixel, prompt, character, palette, motif, UI layout, or branded element was copied; only the general craft principle of locally colour-responsive outlines was adopted.</p>
<p>Every natural-size authority/candidate and actual delivery pair is linked below. Browser scaling should be disabled when judging the per-size PNGs.</p></div>
<h2>Decision summary</h2><table><thead><tr><th>Canary</th><th>Family</th><th>Disposition</th><th>Current mean</th><th>Assay mean</th><th>Gate</th></tr></thead><tbody>{''.join(table_rows)}</tbody></table>
<h2>Consolidated visual evidence</h2>{''.join(proof_cards)}
<h2>Natural/source-size authorities and assay outputs</h2>{''.join(source_cards)}
<p><a href="delivery/">Delivery directory</a> contains one pixel-exact current/assay pair for every listed CSS size. <a href="mgjrpg-02-report.json">The report</a> records panel coordinates, hashes, scores, contour/alpha/seam metrics, bytes, platform implications, and rollback.</p>
</body></html>""".encode("utf-8")


def _average_score(scores: dict[str, float | None]) -> float:
    values = [float(value) for value in scores.values() if value is not None]
    return sum(values) / max(1, len(values))


def _validate_calibration_provenance() -> dict[str, Any]:
    path = ROOT / "docs/source-assets/calibrations/mgjrpg-02/v01/run-record.json"
    record = read_json(path)
    for run in record.get("runs", []):
        prompt = ROOT / run["prompt"]["path"]
        if sha256_file(prompt) != run["prompt"]["sha256"]:
            raise ValueError(f"Calibration prompt hash differs: {posix_relative(prompt)}")
        expected = list(range(1, len(run["orderedReferences"]) + 1))
        actual = [int(reference["position"]) for reference in run["orderedReferences"]]
        if actual != expected:
            raise ValueError(f"Calibration reference order must be exactly {expected}; found {actual}")
        for reference in run["orderedReferences"]:
            reference_path = ROOT / reference["path"]
            if sha256_file(reference_path) != reference["sha256"] or reference_path.stat().st_size != reference["bytes"]:
                raise ValueError(f"Calibration reference evidence differs: {posix_relative(reference_path)}")
        output_path = ROOT / run["output"]["immutableGeneratorOriginalPath"]
        if sha256_file(output_path) != run["output"]["sha256"] or output_path.stat().st_size != run["output"]["bytes"]:
            raise ValueError(f"Calibration output evidence differs: {posix_relative(output_path)}")
        if run["lineage"].get("editOfEdit") is not False:
            raise ValueError("Calibration forbids edit-of-edit lineage")
    return {
        "path": posix_relative(path),
        "sha256": sha256_file(path),
        "bytes": path.stat().st_size,
        "runIds": [run["runId"] for run in record.get("runs", [])],
    }


def generate_mgjrpg02_proofs() -> dict[str, Any]:
    if not RECIPE_PATH.is_file():
        raise FileNotFoundError(f"Recipe authority is missing: {posix_relative(RECIPE_PATH)}")
    recipe = read_json(RECIPE_PATH)
    if recipe.get("recipeId") != "mgjrpg-02" or recipe.get("renderingProfile") != "storybook-local-contour-v1":
        raise ValueError("mgjrpg-02 recipe authority has the wrong ID or rendering profile")
    calibration_evidence = _validate_calibration_provenance()
    representative_background = ROOT / REPRESENTATIVE_BACKGROUND_PATH
    if not representative_background.is_file():
        raise FileNotFoundError(f"Representative proof background is missing: {REPRESENTATIVE_BACKGROUND_PATH}")

    destination = PROOF_ROOT / "mgjrpg-02" / PACKET_REVISION
    rows: list[dict[str, Any]] = []
    delivery_outputs: list[dict[str, Any]] = []
    for entry in CANARIES:
        baseline, authority = _load_canary(entry)
        assay, automated = make_assay(baseline, str(entry["treatmentClass"]))
        candidate_path = destination / "candidates" / f"{entry['id']}-mgjrpg02-assay.png"
        _write_once_png(assay, candidate_path)
        if entry["path"] is None:
            baseline_path = destination / "baselines" / f"{entry['id']}-mgjrpg01-recorded-build.png"
            _write_once_png(baseline, baseline_path)
            authority = {**authority, "proofBaseline": _proof_evidence(baseline_path)}
        delivery_assays: dict[int, tuple[Image.Image, Image.Image]] = {}
        delivery_metrics_by_size: dict[int, dict[str, Any] | None] = {}
        for size in entry["sizes"]:
            pair_path = destination / "delivery" / entry["id"] / f"{entry['id']}-{int(size)}px-current-vs-assay.png"
            pair, baseline_delivery, assay_delivery, delivery_metrics = _delivery_pair(
                baseline,
                assay,
                int(size),
                str(entry["treatmentClass"]),
            )
            _write_once_png(pair, pair_path)
            delivery_assays[int(size)] = (baseline_delivery, assay_delivery)
            delivery_metrics_by_size[int(size)] = delivery_metrics
            delivery_outputs.append(
                {
                    "canaryId": entry["id"],
                    "cssPixels": int(size),
                    "contourWidthPixels": (
                        None
                        if entry["treatmentClass"] == "terrain-boundary"
                        else _default_contour_width((int(size), int(size)))
                    ),
                    "contourMetrics": (
                        None
                        if delivery_metrics is None
                        else {
                            "current": delivery_metrics["baseline"],
                            "assay": delivery_metrics["assay"],
                            "alpha": delivery_metrics["alpha"],
                        }
                    ),
                    **_proof_evidence(pair_path),
                }
            )
        row = {
            **entry,
            "baseline": baseline,
            "assay": assay,
            "authority": authority,
            "automatedMetrics": automated,
            "massValueMetrics": {
                "baseline": _mass_and_value_metrics(baseline),
                "assay": _mass_and_value_metrics(assay),
            },
            "baselineScore": _score_map(entry["baseline"]),
            "assayScore": _assay_scores(entry),
            "productionAcceptanceMinimum": _acceptance_scores(entry),
            "provisionalThresholdSummary": _provisional_threshold_summary(
                entry, automated, delivery_metrics_by_size
            ),
            "candidateOutput": _proof_evidence(candidate_path),
            "deliveryAssays": delivery_assays,
        }
        rows.append(row)

    actual_sheet, actual_contracts = _actual_size_sheet(rows)
    crop_sheet, crop_contracts = _contour_crop_sheet(rows)
    terrain_sheet, terrain_contracts = _terrain_repeat_sheet(rows)
    cvd_sheet, cvd_contracts = _cvd_sheet(rows)
    imagegen_sheet, imagegen_contract = _imagegen_rejection_sheet()
    overview = _comparison_overview(rows)
    named_images = {
        "mgjrpg-02-comparison-packet.png": overview,
        "mgjrpg-02-contour-crops.png": crop_sheet,
        "mgjrpg-02-actual-size.png": actual_sheet,
        "mgjrpg-02-terrain-repeat.png": terrain_sheet,
        "mgjrpg-02-cvd-grayscale.png": cvd_sheet,
        "mgjrpg-02-ame-imagegen-rejected.png": imagegen_sheet,
    }
    for name, image in named_images.items():
        _write_once_png(image, destination / name)

    runtime_paths = sorted({str(entry["path"]) for entry in CANARIES if entry["path"]})
    runtime_encoded = sum((ROOT / path).stat().st_size for path in runtime_paths)
    runtime_decoded = sum(image_facts(ROOT / path)["decodedBytesUpperBound"] for path in runtime_paths)
    proof_candidate_bytes = sum(int(row["candidateOutput"]["bytes"]) for row in rows)
    proof_candidate_decoded = sum(
        int(row["candidateOutput"]["decodedBytesUpperBound"]) for row in rows
    )
    report_rows = []
    for row in rows:
        report_rows.append(
            {
                key: value
                for key, value in row.items()
                if key not in {"baseline", "assay", "deliveryAssays"}
            }
        )
        report_rows[-1].pop("baseline", None)
        report_rows[-1].pop("assay", None)
        report_rows[-1].pop("cropAnchor", None)
    threshold_warning_labels = {
        "referenceContinuity": "reference contour continuity",
        "smallestDeliveryContinuity": "smallest-delivery contour continuity",
        "pureBlack": "pure-black contour",
        "alpha": "alpha preservation/edge contact",
    }
    threshold_warnings = []
    for check, label in threshold_warning_labels.items():
        failing = [
            row["id"]
            for row in rows
            if check in row["provisionalThresholdSummary"]["failedChecks"]
        ]
        if failing:
            threshold_warnings.append(
                f"Provisional {label} check fails for: {', '.join(failing)}."
            )
    report = {
        "schema": "maze-art-mgjrpg02-calibration-report/v1",
        "packetRevision": PACKET_REVISION,
        "recipe": {
            "path": posix_relative(RECIPE_PATH),
            "sha256": sha256_file(RECIPE_PATH),
            "bytes": RECIPE_PATH.stat().st_size,
            "status": recipe.get("status"),
        },
        "gate": {
            "status": "pending-human",
            "decisionRequested": "Approve or reject mgjrpg-02 as the pre-volume rendering contract. This does not approve any individual assay image or runtime publication.",
            "candidateCIdentity": "approved-and-closed",
            "candidateCRendering": "pending",
            "runtimePublication": "forbidden",
        },
        "craftBoundary": "Adopts only the general principle of locally colour-responsive contours. No PPBA pixel, prompt, character, palette, motif, UI layout, or branded element was copied.",
        "contourTokens": {name: "#" + "".join(f"{channel:02X}" for channel in rgb) for name, rgb in CONTOUR_TOKENS.items()},
        "scoreScale": {
            "minimum": 1,
            "maximum": 5,
            "meaning": "Art-direction judgement. Null means not applicable. Automated metrics and threshold summaries are reported separately and never award a higher Human/art-direction score.",
            "criteria": list(SCORE_KEYS),
        },
        "metricSemantics": {
            "transformAssignmentAgreement": (
                "Self-consistency between the deterministic assay's assigned local token "
                "and its emitted contour pixel. It is not independent aesthetic locality evidence."
            ),
            "outerLineContrastContinuity": (
                "Fraction of measured contour pixels meeting the recipe's 0.12 minimum "
                "relative-luminance delta from sampled adjacent material."
            ),
        },
        "canaries": report_rows,
        "proofContracts": {
            "coordinateConvention": "LTRB, integer pixels, right/bottom exclusive",
            "compositing": "straight RGBA source over opaque sRGB proof backgrounds",
            "actualSizes": actual_contracts,
            "contourCrops": crop_contracts,
            "terrainRepeats": terrain_contracts,
            "cvd": cvd_contracts,
            "representativeBackground": {
                "path": REPRESENTATIVE_BACKGROUND_PATH,
                "sha256": sha256_file(representative_background),
                "bytes": representative_background.stat().st_size,
            },
            "imagegenRejectedAssay": imagegen_contract,
        },
        "bytes": {
            "currentRuntimeCanaryEncoded": runtime_encoded,
            "currentRuntimeCanaryDecodedUpperBound": runtime_decoded,
            "assayCandidateProofEncoded": proof_candidate_bytes,
            "assayCandidateProofDecodedUpperBound": proof_candidate_decoded,
            "publicRuntimeEncodedDelta": 0,
            "publicRuntimeDecodedDelta": 0,
            "note": "Assay/provenance files are source or ignored proof evidence and are excluded from the runtime budget.",
        },
        "proofToolchain": {
            "rasterEncoding": "PNG written deterministically through Pillow with optimize disabled",
            "environment": encoder_environment(),
        },
        "platformImpact": {
            "Web": "zero current runtime impact; future equal-dimension replacements keep decoded upper bounds flat but must earn transfer bytes",
            "Tauri": "same WebView decoded-memory implications; no bundle pointer changed",
            "iPad": "90-104 px actor/terrain reads expose contour continuity and high-frequency terrain; optical siblings remain required",
            "TV": "up to 155-168 px delivery exposes halo, repetition, and muddy seams; no extra residency is introduced by this proof",
        },
        "provenance": calibration_evidence,
        "rollback": {
            "runtime": "No runtime rollback is necessary because no runtime asset or catalogue pointer changed.",
            "proofs": (
                "Retain every immutable prior packet revision; increment PACKET_REVISION for "
                "any changed packet bytes. Never overwrite reviewed evidence."
            ),
            "identity": "Candidate C remains docs/source-assets/characters/ame/v02/ame-v02-candidate-c-generator-original.png.",
        },
        "warnings": [
            "The deterministic transform is an analytical contour/frequency assay, not authored production art.",
            "Water and lava remain exactly mirrored and therefore fail the replacement gate despite seam-safe filtering.",
            "Help remains a lantern metaphor and fails semantic recognition; contour calibration cannot repair it.",
            "Very small Moon Wand, key, reward, and navigation sizes still require separately authored optical variants.",
            "Colour-vision simulations are diagnostic and require later Human/player validation.",
            *threshold_warnings,
        ],
    }
    report_path = destination / "mgjrpg-02-report.json"
    _write_once_bytes(json_bytes(report), report_path)
    output_names = list(named_images)
    html_path = destination / "index.html"
    _write_once_bytes(_packet_html(rows, output_names), html_path)
    outputs = [
        _proof_evidence(destination / name) for name in output_names
    ] + [_proof_evidence(report_path), _proof_evidence(html_path)]
    index = {
        "schema": PACKET_SCHEMA,
        "proofRoot": _display_path(destination),
        "packetRevision": PACKET_REVISION,
        "approvalGate": "Candidate C identity/construction approved; mgjrpg-02 rendering recipe pending Human; runtime publishing forbidden.",
        "recipe": report["recipe"],
        "pipelineInputs": [
            {"path": posix_relative(path), "sha256": sha256_file(path), "bytes": path.stat().st_size}
            for path in (*PIPELINE_INPUT_PATHS, REQUIREMENTS_PATH)
        ],
        "calibrationProvenance": calibration_evidence,
        "canaryIds": [entry["id"] for entry in CANARIES],
        "outputs": outputs,
        "deliveryOutputs": delivery_outputs,
        "runtimeImpact": {"assetWrites": 0, "pointerChanges": 0, "encodedByteDelta": 0, "decodedByteDelta": 0},
    }
    index_path = destination / "proof-index.json"
    _write_once_bytes(json_bytes(index), index_path)
    return {**index, "proofIndex": _proof_evidence(index_path)}
