"""Publish the Human-approved Plan 03-R1 front-door and utility art.

This is a bounded, deterministic publication step.  It consumes only the
immutable, explicitly approved generator originals recorded in calibration
v09.  Existing runtime files are never overwritten.  ``--check`` rebuilds all
derived pixels in a temporary directory and byte-compares them with the
checked-in delivery files.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import subprocess
import tempfile
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

from cutout import dilate_hidden_rgb, prepare_cutout
from encode import encoder_environment, save_image
from mgjrpg02_batch01 import estimate_uniform_matte, extract_uniform_matte, normalize_visible_black
from mgjrpg02_plan03_r1_review import extract_icon, register_icon
from model import ROOT, image_facts, sha256_file


PUBLICATION_ID = "mgjrpg-02-plan03-r1-publication-v01"
DERIVATIVE_RECIPE = "mgjrpg-02-plan03-r1-runtime-derivative-r01"
DECISION = ROOT / "docs/source-assets/calibrations/mgjrpg-02/v09/human-decision.json"
BATCH = ROOT / "docs/source-assets/production/mgjrpg-02/batch-25-plan03-r1-publication"
FONT = ROOT / "docs/source-assets/fonts/fredoka/Fredoka-wdth-wght.ttf"
LOGO_CONCEPT = ROOT / "docs/source-assets/production/mgjrpg-02/batch-24-plan03-r1-logo-revision/game-logo-v03-candidate-b-cleanup-edit-02-generator-original.png"
TITLE_SOURCE = ROOT / "docs/source-assets/production/mgjrpg-02/batch-21-front-door-art/title-background-v02-environment-only-study-01-generator-original.png"
HOME_SOURCE = ROOT / "docs/source-assets/production/mgjrpg-02/batch-21-front-door-art/home-hero-splash-v01-candidate-b-matte-01-generator-original.png"
APP_SOURCE = ROOT / "docs/source-assets/production/mgjrpg-02/batch-13-ui-portals-equipment/app-icon-ame-v03-candidate-a-generator-original.png"

NAV = {
    "nav-home": (4, "Home", "nav-home-v04-candidate-a-matte-01-generator-original.png"),
    "nav-mazes": (5, "Mazes", "nav-mazes-v05-candidate-a-matte-01-generator-original.png"),
    "nav-book": (3, "Adventure Book", "nav-book-v03-candidate-a-matte-01-generator-original.png"),
    "nav-help": (3, "Help", "nav-help-v03-candidate-a-matte-01-generator-original.png"),
    "nav-sound": (4, "Sound on", "nav-sound-v04-candidate-a-matte-01-generator-original.png"),
    "nav-muted": (3, "Sound muted", "nav-muted-v03-candidate-a-matte-01-generator-original.png"),
    "nav-restart": (3, "Restart", "nav-restart-v03-candidate-a-matte-01-generator-original.png"),
}
NAV_SOURCE_ROOT = ROOT / "docs/source-assets/production/mgjrpg-02/batch-23-plan03-r1-premium-ui-logo"


def repo(path: Path) -> str:
    return path.resolve().relative_to(ROOT).as_posix()


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def json_write(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = (json.dumps(value, indent=2, ensure_ascii=False) + "\n").encode("utf-8")
    if path.exists() and path.read_bytes() == payload:
        return
    path.write_bytes(payload)


def publish_without_overwrite(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    payload = source.read_bytes()
    if destination.exists():
        if destination.read_bytes() != payload:
            raise RuntimeError(f"refusing to overwrite changed delivery asset: {destination}")
        return
    destination.write_bytes(payload)


def mask_expand(mask: Image.Image, pixels: int) -> Image.Image:
    return mask.filter(ImageFilter.MaxFilter(pixels * 2 + 1)) if pixels else mask


def mask_erode(mask: Image.Image, pixels: int) -> Image.Image:
    return mask.filter(ImageFilter.MinFilter(pixels * 2 + 1)) if pixels else mask


def rgba_solid(size: tuple[int, int], color: tuple[int, int, int, int]) -> Image.Image:
    return Image.new("RGBA", size, color)


def text_mask(text: str, font_size: int, canvas: tuple[int, int], y: int, target_width: int) -> tuple[Image.Image, tuple[int, int, int, int]]:
    font = ImageFont.truetype(str(FONT), font_size)
    try:
        font.set_variation_by_name("SemiBold")
    except OSError:
        pass
    scratch = Image.new("L", canvas, 0)
    draw = ImageDraw.Draw(scratch)
    box = draw.textbbox((0, 0), text, font=font, stroke_width=0)
    raw = Image.new("L", (box[2] - box[0] + 12, box[3] - box[1] + 12), 0)
    ImageDraw.Draw(raw).text((6 - box[0], 6 - box[1]), text, font=font, fill=255)
    if raw.width > target_width:
        raw = raw.resize((target_width, round(raw.height * target_width / raw.width)), Image.Resampling.LANCZOS)
    x = (canvas[0] - raw.width) // 2
    scratch.paste(raw, (x, y))
    return scratch, (x, y, x + raw.width, y + raw.height)


def word_letter_masks(text: str, font_size: int, canvas: tuple[int, int], y: int, target_width: int) -> tuple[Image.Image, list[Image.Image]]:
    """Return an exact ordered glyph sequence and its union mask."""

    font = ImageFont.truetype(str(FONT), font_size)
    try:
        font.set_variation_by_name("SemiBold")
    except OSError:
        pass
    advances = [max(1, round(font.getlength(char))) for char in text]
    raw_width = sum(advances)
    scale = min(1.0, target_width / raw_width)
    x = round((canvas[0] - raw_width * scale) / 2)
    masks: list[Image.Image] = []
    for char, advance in zip(text, advances):
        box = font.getbbox(char)
        glyph = Image.new("L", (max(1, box[2] - box[0] + 12), max(1, box[3] - box[1] + 12)), 0)
        ImageDraw.Draw(glyph).text((6 - box[0], 6 - box[1]), char, font=font, fill=255)
        if scale != 1.0:
            glyph = glyph.resize((round(glyph.width * scale), round(glyph.height * scale)), Image.Resampling.LANCZOS)
        mask = Image.new("L", canvas, 0)
        mask.paste(glyph, (x, y))
        masks.append(mask)
        x += round(advance * scale)
    union = Image.new("L", canvas, 0)
    for mask in masks:
        union = ImageChops.lighter(union, mask)
    return union, masks


def gradient(size: tuple[int, int], top: tuple[int, int, int], bottom: tuple[int, int, int]) -> Image.Image:
    h = max(size[1] - 1, 1)
    rows = np.empty((size[1], size[0], 4), dtype=np.uint8)
    for y in range(size[1]):
        t = y / h
        rows[y, :, :3] = [round(top[c] * (1 - t) + bottom[c] * t) for c in range(3)]
        rows[y, :, 3] = 255
    return Image.fromarray(rows, "RGBA")


def material_crop(source: Image.Image, crop: tuple[int, int, int, int], size: tuple[int, int]) -> Image.Image:
    return source.crop(crop).resize(size, Image.Resampling.LANCZOS).convert("RGBA")


def concept_material(
    concept: Image.Image,
    fallback_top: tuple[int, int, int],
    fallback_bottom: tuple[int, int, int],
) -> Image.Image:
    """Keep approved material pixels while replacing matte-only gaps."""

    base = np.asarray(gradient(concept.size, fallback_top, fallback_bottom), dtype=np.uint8)
    source = np.asarray(concept.convert("RGBA"), dtype=np.uint8)
    green = (
        (source[:, :, 1].astype(np.int16) > source[:, :, 0].astype(np.int16) + 48)
        & (source[:, :, 1].astype(np.int16) > source[:, :, 2].astype(np.int16) + 48)
        & (source[:, :, 1] > 150)
    )
    result = source.copy()
    result[green] = base[green]
    return Image.fromarray(result, "RGBA")


def add_letter_material(
    canvas: Image.Image,
    mask: Image.Image,
    material: Image.Image,
    *,
    extrusion: tuple[int, int],
    contour: int,
    foil_boxes: tuple[tuple[int, int, int, int], ...] = (),
) -> None:
    size = canvas.size
    shifted = ImageChops.offset(mask, *extrusion)
    # ImageChops.offset wraps; explicitly clear wrapped strips.
    if extrusion[0] > 0:
        ImageDraw.Draw(shifted).rectangle((0, 0, extrusion[0], size[1]), fill=0)
    if extrusion[1] > 0:
        ImageDraw.Draw(shifted).rectangle((0, 0, size[0], extrusion[1]), fill=0)
    depth = mask_expand(shifted, contour + 5)
    canvas.alpha_composite(Image.composite(rgba_solid(size, (59, 31, 91, 255)), rgba_solid(size, (0, 0, 0, 0)), depth))
    outline = mask_expand(mask, contour)
    canvas.alpha_composite(Image.composite(rgba_solid(size, (91, 49, 125, 255)), rgba_solid(size, (0, 0, 0, 0)), outline))
    canvas.alpha_composite(Image.composite(material, rgba_solid(size, (0, 0, 0, 0)), mask))

    # Broad pearlescent top-left edge; this is structural, not glitter.
    inset = mask_erode(mask, 9)
    top_left = ImageChops.subtract(mask, ImageChops.offset(inset, 3, 5))
    canvas.alpha_composite(Image.composite(rgba_solid(size, (255, 247, 226, 150)), rgba_solid(size, (0, 0, 0, 0)), top_left))

    # Controlled foil/holographic segments remain wide enough for reduction.
    foil_mask = Image.new("L", size, 0)
    fd = ImageDraw.Draw(foil_mask)
    for box in foil_boxes:
        fd.rounded_rectangle(box, radius=16, fill=255)
    foil_mask = ImageChops.multiply(mask, foil_mask)
    foil = gradient(size, (255, 245, 150), (223, 126, 26))
    canvas.alpha_composite(Image.composite(foil, rgba_solid(size, (0, 0, 0, 0)), foil_mask))



def mapped_letter_material(
    concept: Image.Image,
    source_box: tuple[int, int, int, int],
    mask: Image.Image,
    fallback_top: tuple[int, int, int],
    fallback_bottom: tuple[int, int, int],
) -> Image.Image:
    bbox = mask.getbbox()
    if bbox is None:
        raise RuntimeError("empty controlled glyph")
    patch = concept.crop(source_box).resize((bbox[2] - bbox[0], bbox[3] - bbox[1]), Image.Resampling.LANCZOS)
    patch = concept_material(patch, fallback_top, fallback_bottom).filter(ImageFilter.GaussianBlur(9.0))
    # Deterministic low-frequency pearlescent variation restores the broad
    # hand-painted material movement without carrying generated glyph edges.
    yy, xx = np.mgrid[0:patch.height, 0:patch.width]
    sheen = (np.sin(xx / 41.0 + yy / 73.0) + np.sin(xx / 113.0 - yy / 57.0)) * 7.0
    pixels = np.asarray(patch, dtype=np.int16).copy()
    pixels[:, :, :3] = np.clip(pixels[:, :, :3] + sheen[:, :, None], 0, 255)
    patch = Image.fromarray(pixels.astype(np.uint8), "RGBA")
    material = Image.new("RGBA", concept.size, (0, 0, 0, 0))
    material.alpha_composite(patch, (bbox[0], bbox[1]))
    return material


def build_controlled_logo() -> Image.Image:
    """Reconstruct every approved word as exact, locally typeset glyph masks.

    The generated Batch 24 logo contributes only low-frequency material/value
    evidence. No generated glyph edge, route line, or subtitle survives into
    this controlled runtime authority.
    """

    size = (1416, 961)
    with Image.open(LOGO_CONCEPT) as opened:
        concept = opened.convert("RGBA").resize(size, Image.Resampling.LANCZOS)

    def font_at(points: int) -> ImageFont.FreeTypeFont:
        result = ImageFont.truetype(str(FONT), points)
        try:
            result.set_variation_by_name("SemiBold")
        except OSError:
            pass
        return result

    def fitted_mask(word: str, points: int, box: tuple[int, int, int, int]) -> Image.Image:
        font = font_at(points)
        temporary = Image.new("L", size, 0)
        draw = ImageDraw.Draw(temporary)
        bounds = draw.textbbox((0, 0), word, font=font, anchor="lt")
        width, height = bounds[2] - bounds[0], bounds[3] - bounds[1]
        x = box[0] + round((box[2] - box[0] - width) / 2) - bounds[0]
        y = box[1] + round((box[3] - box[1] - height) / 2) - bounds[1]
        draw.text((x, y), word, font=font, fill=255, anchor="lt")
        return temporary

    maze = fitted_mask("Maze", 456, (116, 44, 1300, 390))
    puzzle = fitted_mask("Puzzle", 407, (66, 571, 1350, 884))
    plaque = Image.new("L", size, 0)
    ImageDraw.Draw(plaque).rounded_rectangle((584, 402, 832, 566), radius=72, fill=255)
    so = fitted_mask("so", 130, (626, 423, 790, 544))
    complete = ImageChops.lighter(ImageChops.lighter(maze, puzzle), plaque)

    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    # One continuous premium cutline, foil rim and soft plum depth establish the
    # approved sticker/brand silhouette without a cast environmental shadow.
    depth = ImageChops.offset(mask_expand(complete, 18), 13, 18)
    ImageDraw.Draw(depth).rectangle((0, 0, 30, size[1]), fill=0)
    ImageDraw.Draw(depth).rectangle((0, 0, size[0], 34), fill=0)
    canvas.alpha_composite(Image.composite(rgba_solid(size, (72, 39, 94, 235)), rgba_solid(size, (0, 0, 0, 0)), depth))
    cutline = mask_expand(complete, 30)
    canvas.alpha_composite(Image.composite(rgba_solid(size, (255, 246, 218, 255)), rgba_solid(size, (0, 0, 0, 0)), cutline))
    foil_rim = ImageChops.subtract(mask_expand(complete, 20), mask_expand(complete, 9))
    canvas.alpha_composite(Image.composite(gradient(size, (255, 246, 155), (205, 111, 37)), rgba_solid(size, (0, 0, 0, 0)), foil_rim))

    maze_outline = mask_expand(maze, 10)
    puzzle_outline = mask_expand(puzzle, 10)
    canvas.alpha_composite(Image.composite(rgba_solid(size, (106, 59, 143, 255)), rgba_solid(size, (0, 0, 0, 0)), maze_outline))
    canvas.alpha_composite(Image.composite(rgba_solid(size, (39, 128, 130, 255)), rgba_solid(size, (0, 0, 0, 0)), puzzle_outline))

    def value_material(source_box: tuple[int, int, int, int], mask: Image.Image, dark: tuple[int, int, int], light: tuple[int, int, int]) -> Image.Image:
        bounds = mask.getbbox()
        if bounds is None:
            raise RuntimeError("controlled word mask is empty")
        patch = concept.crop(source_box).resize((bounds[2] - bounds[0], bounds[3] - bounds[1]), Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(12))
        luminance = np.asarray(patch.convert("L"), dtype=np.float32) / 255.0
        luminance = np.clip(0.18 + luminance * 0.88, 0.0, 1.0)
        a = np.asarray(dark, dtype=np.float32)
        b = np.asarray(light, dtype=np.float32)
        rgb = a[None, None, :] * (1.0 - luminance[:, :, None]) + b[None, None, :] * luminance[:, :, None]
        yy, xx = np.mgrid[0:luminance.shape[0], 0:luminance.shape[1]]
        broad = (np.sin(xx / 61.0 + yy / 97.0) + np.sin(xx / 137.0 - yy / 83.0))[:, :, None] * 5.0
        rgb = np.clip(rgb + broad, 0, 255).astype(np.uint8)
        material = Image.new("RGBA", size, (0, 0, 0, 0))
        material.alpha_composite(Image.fromarray(np.dstack((rgb, np.full_like(luminance, 255, dtype=np.uint8))), "RGBA"), (bounds[0], bounds[1]))
        return material

    maze_material = value_material((84, 38, 1332, 414), maze, (113, 74, 161), (221, 185, 245))
    puzzle_material = value_material((62, 536, 1354, 938), puzzle, (34, 153, 145), (188, 246, 211))
    canvas.alpha_composite(Image.composite(maze_material, rgba_solid(size, (0, 0, 0, 0)), maze))
    canvas.alpha_composite(Image.composite(puzzle_material, rgba_solid(size, (0, 0, 0, 0)), puzzle))

    # Quiet stone-block seams: short, broad and tonal, never a maze-route line.
    seam = Image.new("L", size, 0)
    sd = ImageDraw.Draw(seam)
    for x, y, length in ((270, 150, 105), (515, 285, 92), (765, 160, 96), (1035, 286, 102)):
        sd.line((x, y, x + length, y), fill=96, width=9)
        sd.line((x + length // 2, y - 30, x + length // 2, y + 28), fill=78, width=8)
    seam = ImageChops.multiply(maze, seam)
    canvas.alpha_composite(Image.composite(rgba_solid(size, (91, 61, 137, 120)), rgba_solid(size, (0, 0, 0, 0)), seam))

    # One broad iridescent band, clipped to Puzzle, reads as premium at large
    # sizes but collapses to a clean value highlight at compact delivery.
    holo_band = Image.new("L", size, 0)
    ImageDraw.Draw(holo_band).polygon(((120, 810), (322, 570), (580, 570), (360, 884)), fill=118)
    holo_band = ImageChops.multiply(puzzle, holo_band)
    holo = gradient(size, (255, 168, 220), (126, 226, 255))
    canvas.alpha_composite(Image.composite(holo, rgba_solid(size, (0, 0, 0, 0)), holo_band))

    # Broad enamel highlights follow the exact glyph masks.
    for word_mask in (maze, puzzle):
        inset = mask_erode(word_mask, 12)
        shine = ImageChops.subtract(word_mask, ImageChops.offset(inset, 4, 7))
        canvas.alpha_composite(Image.composite(rgba_solid(size, (255, 250, 231, 132)), rgba_solid(size, (0, 0, 0, 0)), shine))

    canvas.alpha_composite(Image.composite(gradient(size, (255, 184, 169), (225, 82, 115)), rgba_solid(size, (0, 0, 0, 0)), plaque))
    plaque_inset = ImageChops.subtract(plaque, mask_erode(plaque, 9))
    canvas.alpha_composite(Image.composite(gradient(size, (255, 243, 169), (218, 120, 36)), rgba_solid(size, (0, 0, 0, 0)), plaque_inset))
    so_outline = mask_expand(so, 5)
    canvas.alpha_composite(Image.composite(rgba_solid(size, (255, 226, 156, 255)), rgba_solid(size, (0, 0, 0, 0)), so_outline))
    canvas.alpha_composite(Image.composite(rgba_solid(size, (104, 42, 84, 255)), rgba_solid(size, (0, 0, 0, 0)), so))

    bbox = canvas.getchannel("A").getbbox()
    if bbox is None:
        raise RuntimeError("controlled logo has no visible pixels")
    trimmed = canvas.crop(bbox)
    safe = 28
    out = Image.new("RGBA", (trimmed.width + safe * 2, trimmed.height + safe * 2), (0, 0, 0, 0))
    out.alpha_composite(trimmed, (safe, safe))
    return dilate_hidden_rgb(out, 4)


def extract_matte(source_path: Path, clear: float, opaque: float, target: tuple[int, int]) -> tuple[Image.Image, dict[str, Any]]:
    with Image.open(source_path) as opened:
        source = opened.copy()
    matte = estimate_uniform_matte(source)
    cutout, extraction = extract_uniform_matte(source, matte["rgb"], clear_distance=clear, opaque_distance=opaque, minimum_component_pixels=96)
    prepared = prepare_cutout(
        cutout,
        target,
        extraction_mode="native-alpha",
        clear_alpha_below=3,
        edge_dilation_pixels=4,
        minimum_alpha_component_pixels=4,
        registration={"targetBox": [0.03, 0.03, 0.97, 0.97], "align": [0.5, 0.5], "alphaThreshold": 3},
    )
    prepared, black = normalize_visible_black(prepared)
    return prepared, {"matte": matte, "extraction": extraction, "exactBlackVisiblePixelsNormalized": black}


def app_icon_alpha() -> Image.Image:
    with Image.open(APP_SOURCE) as opened:
        rgb = np.asarray(opened.convert("RGB"), dtype=np.uint8)
    h, w, _ = rgb.shape
    chroma = rgb.max(axis=2).astype(np.int16) - rgb.min(axis=2).astype(np.int16)
    dark_neutral = (rgb.max(axis=2) <= 46) & (chroma <= 18)
    flood = Image.fromarray(np.where(dark_neutral, 255, 0).astype(np.uint8), "L")
    # The four opaque-black corners form one connected exterior component.
    # Pillow's C-backed flood fill avoids a 1.5-million-pixel Python queue.
    ImageDraw.floodfill(flood, (0, 0), 128, thresh=0)
    exterior = np.asarray(flood, dtype=np.uint8) == 128
    alpha = np.where(exterior, 0, 255).astype(np.uint8)
    # One-pixel antialias only; do not soften Ame's authored internal contours.
    alpha_img = Image.fromarray(alpha, "L").filter(ImageFilter.GaussianBlur(0.65))
    rgba = Image.fromarray(np.dstack((rgb, np.asarray(alpha_img))), "RGBA")
    return dilate_hidden_rgb(rgba, 3)


def render_app_icon(app: Image.Image, size: int) -> Image.Image:
    inset = max(2, round(size * 0.035))
    content = app.resize((size - inset * 2, size - inset * 2), Image.Resampling.LANCZOS)
    output = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    output.alpha_composite(content, (inset, inset))
    if size <= 48:
        output = output.filter(ImageFilter.UnsharpMask(radius=0.55, percent=115, threshold=3))
        # Filtering can spread sub-pixel alpha; restore the strict two-pixel
        # platform safe border after optical sharpening.
        draw = ImageDraw.Draw(output)
        draw.rectangle((0, 0, size - 1, 1), fill=(0, 0, 0, 0))
        draw.rectangle((0, size - 2, size - 1, size - 1), fill=(0, 0, 0, 0))
        draw.rectangle((0, 0, 1, size - 1), fill=(0, 0, 0, 0))
        draw.rectangle((size - 2, 0, size - 1, size - 1), fill=(0, 0, 0, 0))
    return dilate_hidden_rgb(output, min(3, inset))


def alpha_geometry(image: Image.Image) -> dict[str, Any]:
    alpha = np.asarray(image.convert("RGBA").getchannel("A"), dtype=np.uint8)
    ys, xs = np.nonzero(alpha >= 3)
    if not len(xs):
        raise RuntimeError("empty alpha geometry")
    bounds = [float(xs.min() / image.width), float(ys.min() / image.height), float((xs.max() + 1 - xs.min()) / image.width), float((ys.max() + 1 - ys.min()) / image.height)]
    return {"visibleBounds": [round(v, 8) for v in bounds], "borderVisiblePixels": int(np.count_nonzero(np.concatenate((alpha[0], alpha[-1], alpha[:, 0], alpha[:, -1])) >= 3)), "semiTransparentPixels": int(np.count_nonzero((alpha > 0) & (alpha < 255)))}


def encode_all(output_root: Path) -> list[dict[str, Any]]:
    outputs: list[dict[str, Any]] = []

    for stable_id, (version, label, filename) in NAV.items():
        source = NAV_SOURCE_ROOT / filename
        extracted, processing = extract_icon(source)
        icon, normalization = register_icon(extracted, 128)
        destination = output_root / f"public/assets/mgjrpg-02/navigation/{stable_id}-v{version:02d}-navigation-optical-128-r01.webp"
        destination.parent.mkdir(parents=True, exist_ok=True)
        encoder = save_image(icon, destination, "webp", {"lossless": True, "method": 6, "exact": True})
        outputs.append({"stableId": stable_id, "label": label, "family": "navigation", "artVersion": version, "runtimeStatus": "active", "profile": "navigation-optical-128", "source": repo(source), "path": repo(destination.relative_to(output_root) if output_root == ROOT else ROOT / destination.relative_to(output_root)), "file": destination, "encoder": encoder, "processing": {**processing, **normalization}, "geometry": alpha_geometry(icon), "loadingPhase": "on-consumer-render", "displayRangeCssPx": [16, 64]})

    with Image.open(TITLE_SOURCE) as opened:
        title = opened.convert("RGB")
    title_destination = output_root / "public/assets/mgjrpg-02/brand/title-environment-v01-front-door-1672-r01.webp"
    title_destination.parent.mkdir(parents=True, exist_ok=True)
    title_encoder = save_image(title, title_destination, "webp", {"lossless": False, "quality": 88, "method": 6, "exact": True})
    outputs.append({"stableId": "title-environment", "label": "Puzzlewild title environment", "family": "brand", "artVersion": 1, "runtimeStatus": "active", "profile": "front-door-background-1672", "source": repo(TITLE_SOURCE), "path": "public/assets/mgjrpg-02/brand/title-environment-v01-front-door-1672-r01.webp", "file": title_destination, "encoder": title_encoder, "geometry": {"visibleBounds": [0.0, 0.0, 1.0, 1.0], "borderVisiblePixels": 5226, "semiTransparentPixels": 0}, "loadingPhase": "title-critical", "displayRangeCssPx": [568, 1920], "focalPoint": [0.77, 0.42], "copySafeRegion": [0.03, 0.08, 0.42, 0.76], "fit": "cover"})

    home, home_processing = extract_matte(HOME_SOURCE, 48.0, 144.0, (1024, 768))
    home_destination = output_root / "public/assets/mgjrpg-02/brand/home-hero-splash-v01-front-door-1024-r01.webp"
    home_destination.parent.mkdir(parents=True, exist_ok=True)
    home_encoder = save_image(home, home_destination, "webp", {"lossless": True, "method": 6, "exact": True})
    outputs.append({"stableId": "home-hero-splash", "label": "Ame and friends home hero", "family": "brand", "artVersion": 1, "runtimeStatus": "dormant", "profile": "front-door-hero-1024", "source": repo(HOME_SOURCE), "path": "public/assets/mgjrpg-02/brand/home-hero-splash-v01-front-door-1024-r01.webp", "file": home_destination, "encoder": home_encoder, "processing": home_processing, "geometry": alpha_geometry(home), "loadingPhase": "plan01-front-door-on-demand", "displayRangeCssPx": [320, 1024], "focalPoint": [0.57, 0.42], "copySafeRegion": [0.0, 0.0, 0.22, 0.28], "fit": "contain"})

    logo_master = build_controlled_logo()
    master_destination = output_root / "docs/source-assets/production/mgjrpg-02/batch-25-plan03-r1-publication/game-logo-v05-controlled-master.png"
    master_destination.parent.mkdir(parents=True, exist_ok=True)
    master_encoder = save_image(logo_master, master_destination, "png", {"compress_level": 9, "optimize": False})
    outputs.append({"stableId": "game-logo-master", "label": "Maze so Puzzle controlled wordmark master", "family": "brand-source", "artVersion": 5, "runtimeStatus": "source-only", "profile": "controlled-source-master", "source": repo(LOGO_CONCEPT), "path": "docs/source-assets/production/mgjrpg-02/batch-25-plan03-r1-publication/game-logo-v05-controlled-master.png", "file": master_destination, "encoder": master_encoder, "geometry": alpha_geometry(logo_master), "loadingPhase": "source-only", "displayRangeCssPx": [0, 0]})
    for width in (1024, 512):
        height = round(logo_master.height * width / logo_master.width)
        rendition = logo_master.resize((width, height), Image.Resampling.LANCZOS)
        destination = output_root / f"public/assets/mgjrpg-02/brand/game-logo-v05-front-door-{width}-r01.webp"
        destination.parent.mkdir(parents=True, exist_ok=True)
        encoder = save_image(rendition, destination, "webp", {"lossless": True, "method": 6, "exact": True})
        outputs.append({"stableId": f"game-logo-{width}", "label": "Maze so Puzzle wordmark", "family": "brand", "artVersion": 5, "runtimeStatus": "dormant", "profile": f"front-door-wordmark-{width}", "source": "docs/source-assets/production/mgjrpg-02/batch-25-plan03-r1-publication/game-logo-v05-controlled-master.png", "path": f"public/assets/mgjrpg-02/brand/game-logo-v05-front-door-{width}-r01.webp", "file": destination, "encoder": encoder, "geometry": alpha_geometry(rendition), "loadingPhase": "plan01-front-door-on-demand", "displayRangeCssPx": [257 if width == 1024 else 96, 1024 if width == 1024 else 256], "text": "Maze so Puzzle", "fit": "contain"})

    app = app_icon_alpha()
    for size in (16, 32, 48, 64, 128, 256, 512):
        icon = render_app_icon(app, size)
        destination = output_root / f"src-tauri/icons/ame-v03/{size}x{size}.png"
        destination.parent.mkdir(parents=True, exist_ok=True)
        encoder = save_image(icon, destination, "png", {"compress_level": 9, "optimize": False})
        outputs.append({"stableId": f"app-icon-ame-{size}", "label": f"Ame application icon {size}px", "family": "platform-icon", "artVersion": 3, "runtimeStatus": "active", "profile": f"platform-icon-{size}", "source": repo(APP_SOURCE), "path": f"src-tauri/icons/ame-v03/{size}x{size}.png", "file": destination, "encoder": encoder, "geometry": alpha_geometry(icon), "loadingPhase": "platform-shell", "displayRangeCssPx": [size, size]})
    app512 = render_app_icon(app, 512)
    web_icon = output_root / "public/assets/mgjrpg-02/brand/app-icon-ame-v03-web-512-r01.png"
    web_icon.parent.mkdir(parents=True, exist_ok=True)
    web_encoder = save_image(app512, web_icon, "png", {"compress_level": 9, "optimize": False})
    outputs.append({"stableId": "app-icon-ame-web", "label": "Ame application icon", "family": "brand", "artVersion": 3, "runtimeStatus": "active", "profile": "web-app-icon-512", "source": repo(APP_SOURCE), "path": "public/assets/mgjrpg-02/brand/app-icon-ame-v03-web-512-r01.png", "file": web_icon, "encoder": web_encoder, "geometry": alpha_geometry(app512), "loadingPhase": "platform-shell", "displayRangeCssPx": [16, 512]})

    # Compound platform containers are deterministic derivatives of the same
    # 512 master.  The PNG set remains the visual/optical evidence.
    ico = output_root / "src-tauri/icons/ame-v03/icon.ico"
    ico.parent.mkdir(parents=True, exist_ok=True)
    app512.save(ico, format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    outputs.append({"stableId": "app-icon-ame-ico", "label": "Ame Windows icon", "family": "platform-icon", "artVersion": 3, "runtimeStatus": "active", "profile": "windows-ico", "source": repo(APP_SOURCE), "path": "src-tauri/icons/ame-v03/icon.ico", "file": ico, "encoder": {"name": "Pillow ICO", "version": encoder_environment(), "options": {"sizes": [16, 32, 48, 64, 128, 256]}}, "loadingPhase": "platform-shell", "displayRangeCssPx": [16, 256]})
    icns = output_root / "src-tauri/icons/ame-v03/icon.icns"
    app512.save(icns, format="ICNS")
    outputs.append({"stableId": "app-icon-ame-icns", "label": "Ame macOS icon", "family": "platform-icon", "artVersion": 3, "runtimeStatus": "active", "profile": "macos-icns", "source": repo(APP_SOURCE), "path": "src-tauri/icons/ame-v03/icon.icns", "file": icns, "encoder": {"name": "Pillow ICNS", "version": encoder_environment(), "options": {}}, "loadingPhase": "platform-shell", "displayRangeCssPx": [16, 512]})

    for size in (30, 44, 71, 89, 107, 142, 150, 284, 310):
        icon = render_app_icon(app, size)
        destination = output_root / f"src-tauri/icons/ame-v03/Square{size}x{size}Logo.png"
        save_image(icon, destination, "png", {"compress_level": 9, "optimize": False})
        outputs.append({"stableId": f"app-icon-ame-square-{size}", "label": f"Ame Windows square logo {size}px", "family": "platform-icon", "artVersion": 3, "runtimeStatus": "dormant", "profile": f"windows-square-{size}", "source": repo(APP_SOURCE), "path": f"src-tauri/icons/ame-v03/Square{size}x{size}Logo.png", "file": destination, "loadingPhase": "platform-shell", "displayRangeCssPx": [size, size]})
    store = output_root / "src-tauri/icons/ame-v03/StoreLogo.png"
    save_image(render_app_icon(app, 50), store, "png", {"compress_level": 9, "optimize": False})
    outputs.append({"stableId": "app-icon-ame-store", "label": "Ame Windows Store logo", "family": "platform-icon", "artVersion": 3, "runtimeStatus": "dormant", "profile": "windows-store-50", "source": repo(APP_SOURCE), "path": "src-tauri/icons/ame-v03/StoreLogo.png", "file": store, "loadingPhase": "platform-shell", "displayRangeCssPx": [50, 50]})
    return outputs


def facts(row: dict[str, Any]) -> dict[str, Any]:
    path: Path = row["file"]
    result = {key: value for key, value in row.items() if key != "file"}
    result.update({"sha256": sha256_file(path), "bytes": path.stat().st_size})
    if path.suffix.lower() in {".png", ".webp", ".ico", ".icns"}:
        result.update(image_facts(path))
    return result


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8-sig"))


def file_evidence(path: Path, relationship: str, evidence: str) -> dict[str, Any]:
    return {"path": repo(path), "sha256": sha256_file(path), "bytes": path.stat().st_size, "relationship": relationship, "evidence": evidence}


def encoder_record(row: dict[str, Any]) -> dict[str, Any]:
    encoder = row.get("encoder") or {"name": "Pillow PNG (zlib)", "version": "Pillow deterministic profile", "options": {"compress_level": 9, "optimize": False}}
    version = encoder.get("version", "Pillow deterministic profile")
    if not isinstance(version, str):
        version = json.dumps(version, sort_keys=True)
    return {"name": str(encoder.get("name", "Pillow deterministic profile")), "version": version, "options": encoder.get("options", {})}


def derivative(row: dict[str, Any], derivative_id: str | None = None) -> dict[str, Any]:
    return {
        "id": derivative_id or row["profile"],
        "path": row["path"],
        "sha256": row["sha256"],
        "bytes": row["bytes"],
        "width": row["width"],
        "height": row["height"],
        "format": row["format"],
        "mode": row["mode"],
        "alphaMode": row["alphaMode"],
        "decodedBytesUpperBound": row["decodedBytesUpperBound"],
        "profile": row["profile"],
        "derivativeRevision": 1,
        "runtimeStatus": row["runtimeStatus"],
        "loadingPhase": row["loadingPhase"],
        "encoder": encoder_record(row),
    }


def approval_evidence() -> dict[str, Any]:
    return {"approvedBy": "Human project author", "approvedAt": "2026-09-04T00:00:00+01:00", "scope": "runtime-publish", "evidencePath": repo(DECISION), "evidenceSha256": sha256_file(DECISION)}


def geometry_record(row: dict[str, Any], geometry_class: str) -> dict[str, Any]:
    visible = row.get("geometry", {}).get("visibleBounds", [0.0, 0.0, 1.0, 1.0])
    x, y, w, h = visible
    return {"class": geometry_class, "pivot": [0.5, 0.5], "visibleBounds": visible, "safeInset": [round(y, 8), round(max(0.0, 1 - x - w), 8), round(max(0.0, 1 - y - h), 8), round(x, 8)]}


def build_records_and_reports(rows: list[dict[str, Any]], summary: dict[str, Any]) -> None:
    by_id = {row["stableId"]: row for row in rows}
    recipe_path = ROOT / "docs/source-assets/recipes/mgjrpg-02.json"
    canary_path = ROOT / "docs/source-assets/reviews/mgjrpg-02-canary-v01.json"
    recipe_evidence = {"recipeId": "mgjrpg-02", "path": repo(recipe_path), "sha256": sha256_file(recipe_path)}
    rendering = {"profileId": "storybook-local-contour-v1", "recipeId": "mgjrpg-02", "treatmentClass": "semantic-ui-cutout", "canaryReview": {"reviewId": "mgjrpg-02-canary-v01", "path": repo(canary_path), "sha256": sha256_file(canary_path)}, "authoredContour": "material-local-color-aware", "extractionRole": "alpha-matte-only", "stickerCutline": "semantic-cream-only"}

    for stable_id, (version, _label, _filename) in NAV.items():
        record_path = ROOT / f"docs/source-assets/records/{stable_id}-mgjrpg02-v{version:02d}-source.json"
        record = read_json(record_path)
        row = by_id[stable_id]
        record["runtimeStatus"] = "active"
        record["approvalStatus"] = "approved"
        record["derivativeRecipeVersion"] = DERIVATIVE_RECIPE
        record["derivatives"] = [derivative(row)]
        record["geometry"] = {**geometry_record(row, "icon"), "opticalBounds": row["geometry"]["visibleBounds"]}
        if stable_id == "nav-muted":
            record["geometry"]["modifierBox"] = [0.09375, 0.1484375, 0.7890625, 0.78125]
        record["build"]["profiles"] = [{"id": row["profile"], "outputPath": row["path"], "width": 128, "height": 128, "format": "webp", "clearAlphaBelow": 3, "edgeDilationPixels": 4, "minimumAlphaComponentPixels": 4, "maxEncodedBytes": 131072, "encoder": {"options": encoder_record(row)["options"]}}]
        record["approvalEvidence"] = approval_evidence()
        record["knownUnknowns"] = ["Generator model build, seed, exact execution timestamp and request envelope were not exposed by the built-in tool."]
        record["rights"] = {"originClaim": record["rights"]["originClaim"], "licenceStatus": "reviewed", "notes": "Human approved this original project-specific utility design and its bounded runtime publication.", "reviewedBy": "Human project author"}
        record["rollback"]["method"] = f"Atomically restore {record['rollback']['previousPath']} and all six sibling v01 publication pointers; keep this versioned derivative for evidence until Plan 12."
        json_write(record_path, record)

    def base_record(record_id: str, stable_id: str, art_version: int, family: str, run_id: str, prompt: Path, sources: list[dict[str, Any]], derivatives: list[dict[str, Any]], geometry: dict[str, Any], operation: str, profiles: list[dict[str, Any]], known: list[str], rollback: dict[str, Any]) -> dict[str, Any]:
        return {
            "$schema": "../schema/art-source.schema.json", "schemaVersion": 2, "recordId": record_id, "id": stable_id,
            "artVersion": art_version, "family": family, "runtimeStatus": "active" if any(item["runtimeStatus"] == "active" for item in derivatives) else "dormant",
            "sourceStatus": "source-backed", "approvalStatus": "approved", "validationProfile": "strict-v2", "recipeVersion": "mgjrpg-02", "derivativeRecipeVersion": DERIVATIVE_RECIPE,
            "recipeEvidence": recipe_evidence,
            "generationRuns": [{"runId": run_id, "generator": "OpenAI built-in image generation capability", "model": "not exposed by tool response", "executedAt": "unknown", "prompt": {"path": repo(prompt), "sha256": sha256_file(prompt)}, "references": [{"order": 1, "role": "rendering-authority", "authorityKind": "approved-rendering-anchor", "path": repo(recipe_path), "sha256": sha256_file(recipe_path)}], "outputs": [{"outputId": "exec-recorded-in-batch-ledger.png", "path": sources[0]["path"], "sha256": sources[0]["sha256"], "bytes": sources[0]["bytes"], "disposition": "selected", "reason": "Explicit Human approval for bounded Plan 03-R1 runtime publication."}], "lineage": {"editOfEdit": False, "identityAuthorityEligible": True, "renderingAuthorityEligible": True}, "notes": "Exact ordered references and provider output ID remain in the immutable batch run record; this record binds the approved source to delivery derivatives."}],
            "renderingContract": rendering,
            "promptEvidence": {"fidelity": "exact", "historyPath": repo(prompt), "assetNamedInHistory": True, "promptFile": {"path": repo(prompt), "sha256": sha256_file(prompt)}, "outputIds": [], "notes": "Exact prompt and generation lineage are preserved in the batch prompt/run record."},
            "sources": sources, "derivatives": derivatives, "geometry": geometry,
            "build": {"sourcePath": sources[0]["path"], "operation": operation, "profiles": profiles},
            "approvalEvidence": approval_evidence(), "knownUnknowns": known,
            "rights": {"originClaim": "Created for Maze so Puzzle from project-authored prompts and approved internal references; no named franchise, living artist or proprietary composition was requested.", "licenceStatus": "reviewed", "notes": "Human approved the source and bounded runtime publication.", "reviewedBy": "Human project author"},
            "rollback": rollback,
        }

    title = by_id["title-environment"]
    title_prompt = ROOT / "docs/source-assets/production/mgjrpg-02/batch-21-front-door-art/PROMPTS.md"
    title_record = base_record(
        "title-environment-mgjrpg02-v01-source", "title-environment", 1, "brand", "batch-21-title-background-environment-study-01", title_prompt,
        [file_evidence(TITLE_SOURCE, "Human-approved immutable environment-only title source", "Selected in v08 and explicitly approved for runtime publication in v09.")], [derivative(title)], geometry_record(title, "background"), "opaque-resize",
        [{"id": title["profile"], "outputPath": title["path"], "width": title["width"], "height": title["height"], "format": "webp", "maxEncodedBytes": 786432, "encoder": {"options": encoder_record(title)["options"]}}],
        ["Physical iPad and TV validation remains a release gate; browser viewport evidence is recorded in the publication report."],
        {"method": "Restore ASSETS.titleBackground to the legacy v1 WebP.", "previousPath": "public/assets/title-background-v1.webp", "previousSha256": sha256_file(ROOT / "public/assets/title-background-v1.webp")},
    )
    title_record["presentation"] = {"focalPoint": title["focalPoint"], "copySafeRegion": title["copySafeRegion"], "fit": title["fit"], "aspectBands": ["16:9 landscape", "4:3 landscape", "compact landscape crop"], "fallback": "/assets/title-background-v1.webp"}
    # presentation is intentionally kept in the runtime catalogue/report rather
    # than the strict record until the schema adds that optional object.
    title_record.pop("presentation")
    json_write(ROOT / "docs/source-assets/records/title-environment-mgjrpg02-v01-source.json", title_record)

    home = by_id["home-hero-splash"]
    home_prompt = title_prompt
    home_record = base_record(
        "home-hero-splash-mgjrpg02-v01-source", "home-hero-splash", 1, "brand", "batch-21-home-splash-v01-b", home_prompt,
        [file_evidence(HOME_SOURCE, "Human-approved immutable Home Splash B generator original", "Selected in v08 and explicitly approved for catalogue-ready Plan 01 use in v09.")], [derivative(home)], geometry_record(home, "hero-splash"), "cutout-resize",
        [{"id": home["profile"], "outputPath": home["path"], "width": home["width"], "height": home["height"], "format": "webp", "clearAlphaBelow": 3, "edgeDilationPixels": 4, "minimumAlphaComponentPixels": 4, "maxEncodedBytes": 1048576, "encoder": {"options": encoder_record(home)["options"]}}],
        ["Plan 01 owns the responsive layered front-door consumer; this asset remains dormant and is not preloaded."],
        {"method": "Remove the dormant Plan 01 pointer; the current combined title route continues using its single background."},
    )
    home_record["build"]["backgroundExtraction"] = {"mode": "flat-impossible-matte", "recipeId": "flat-impossible-matte-alpha-unblend-v1", "rgb": home["processing"]["matte"]["rgb"], "clearDistance": 48.0, "opaqueDistance": 144.0, "minimumComponentPixels": 96}
    json_write(ROOT / "docs/source-assets/records/home-hero-splash-mgjrpg02-v01-source.json", home_record)

    logo_master = by_id["game-logo-master"]
    logo_rows = [by_id["game-logo-1024"], by_id["game-logo-512"]]
    logo_prompt = ROOT / "docs/source-assets/production/mgjrpg-02/batch-24-plan03-r1-logo-revision/PROMPTS.md"
    logo_record = base_record(
        "game-logo-mgjrpg02-v05-source", "game-logo", 5, "brand", "batch-25-game-logo-v05-controlled-exact-lettering", logo_prompt,
        [file_evidence(ROOT / logo_master["path"], "deterministic controlled exact-lettering source master", "Every word edge uses local Fredoka glyph masks; approved generated pixels contribute only low-frequency material/value evidence."), file_evidence(LOGO_CONCEPT, "Human-approved material and composition evidence", "Generated lettering is not the text authority."), file_evidence(FONT, "locally vendored OFL font used for all exact lettering", "Fredoka OFL provenance and licence are stored beside the font.")],
        [derivative(row) for row in logo_rows], geometry_record(logo_master, "brand-wordmark"), "cutout-resize",
        [{"id": row["profile"], "outputPath": row["path"], "width": row["width"], "height": row["height"], "format": "webp", "clearAlphaBelow": 3, "edgeDilationPixels": 4, "minimumAlphaComponentPixels": 4, "maxEncodedBytes": 1048576, "encoder": {"options": encoder_record(row)["options"]}} for row in logo_rows],
        ["Plan 01 owns the live wordmark consumer; both right-sized variants remain dormant and are not preloaded."],
        {"method": "Remove the dormant Plan 01 pointer; no pre-R1 runtime wordmark existed."},
    )
    logo_record["humanEdits"] = [{"kind": "deterministic-exact-lettering-reconstruction", "description": "All Maze so Puzzle edges are locally typeset Fredoka masks; the approved generated concept contributes low-frequency material/value evidence only.", "script": repo(Path(__file__))}]
    logo_record["build"]["backgroundExtraction"] = {"mode": "native-alpha"}
    json_write(ROOT / "docs/source-assets/records/game-logo-mgjrpg02-v05-source.json", logo_record)

    app_rows = [row for row in rows if row["stableId"].startswith("app-icon-ame-")]
    app_prompt = ROOT / "docs/source-assets/production/mgjrpg-02/batch-13-ui-portals-equipment/PROMPTS.md"
    app_record = base_record(
        "app-icon-ame-mgjrpg02-v03-source", "app-icon-ame", 3, "brand", "batch-13-app-icon-ame-v03", app_prompt,
        [file_evidence(APP_SOURCE, "Human-approved immutable Ame-face application-icon source", "Ame identity and rounded-square composition approved in v09.")], [derivative(row) for row in app_rows], geometry_record(by_id["app-icon-ame-web"], "app-icon"), "cutout-resize",
        [{"id": row["profile"], "outputPath": row["path"], "width": row["width"], "height": row["height"], "format": row["format"], "clearAlphaBelow": 3, "edgeDilationPixels": 3, "minimumAlphaComponentPixels": 1, "maxEncodedBytes": max(16384, row["bytes"] + 1024), "encoder": {"options": encoder_record(row)["options"]}} for row in app_rows if row["format"] in {"png", "webp", "jpg", "jpeg"}],
        ["Physical Windows taskbar/installer and macOS Finder inspection remain release gates; deterministic source-size proofs cover 16–512 px."],
        {"method": "Restore src-tauri/tauri.conf.json to the legacy icon list and retain both complete icon sets until Plan 12.", "previousPath": "src-tauri/icons/icon.ico", "previousSha256": sha256_file(ROOT / "src-tauri/icons/icon.ico")},
    )
    app_record["build"]["backgroundExtraction"] = {"mode": "edge-connected", "rgb": [0, 0, 0], "tolerance": 46}
    json_write(ROOT / "docs/source-assets/records/app-icon-ame-mgjrpg02-v03-source.json", app_record)

    batch_record = {
        "schema": "maze-art-runtime-publication/v1", "publicationId": "mgjrpg-02-batch-25-plan03-r1-publication", "revision": 1, "status": "published", "recordedOn": "2026-09-04",
        "purpose": "Deterministically publish the explicitly approved Plan 03-R1 utility, front-door and platform-icon set without overwriting or deleting prior runtime files.",
        "rollbackAnchor": "d70c9c360683d2ed8f4f7d1cd172254bbda7b559", "decisionEvidence": summary["decisionEvidence"],
        "derivativeRecipe": DERIVATIVE_RECIPE, "font": {"path": repo(FONT), "sha256": sha256_file(FONT), "licence": "SIL Open Font License 1.1", "licencePath": "docs/source-assets/fonts/fredoka/OFL.txt"},
        "runtimeImpact": summary["counts"], "entries": [{key: row[key] for key in ("stableId", "source", "path", "sha256", "bytes", "width", "height", "runtimeStatus", "loadingPhase") if key in row} for row in rows],
        "rights": {"originClaim": "Approved project-specific ImageGen sources plus deterministic local derivatives and exact lettering.", "licenceStatus": "reviewed", "releaseStatus": "approved-for-bounded-publication"},
        "rollback": {"method": "Restore the seven navigation pointers atomically, the legacy title background pointer, and the legacy Tauri icon list. Keep all versioned files until Plan 12."},
    }
    json_write(BATCH / "publication-record.json", batch_record)
    json_write(BATCH / "human-review.json", {"schema": "maze-art-source-review/v1", "reviewedOn": "2026-09-04", "reviewedBy": "Human", "batchId": "mgjrpg-02-batch-25-plan03-r1-publication", "decisionEvidence": summary["decisionEvidence"], "approvedSourceIds": [*NAV.keys(), "game-logo", "title-environment", "home-hero-splash", "app-icon-ame"], "rejectedSourceIds": [], "publicationAuthorized": True})

    report = {
        "schema": "maze-art-plan03-r1-publication-report/v1", "publicationId": PUBLICATION_ID, "generatedOn": "2026-09-04", "rollbackAnchors": {"static": "28946cbb04f45cb21cd51626914267ff4f71c375", "sourceReview": "d70c9c360683d2ed8f4f7d1cd172254bbda7b559"},
        "counts": summary["counts"], "activePointerChanges": {"navigation": {stable_id: by_id[stable_id]["path"].removeprefix("public") for stable_id in NAV}, "titleBackground": by_id["title-environment"]["path"].removeprefix("public"), "tauriIcons": "src-tauri/icons/ame-v03/"},
        "plan01Ready": {"gameLogo": [row["path"].removeprefix("public") for row in logo_rows], "homeHeroSplash": home["path"].removeprefix("public"), "preloaded": False},
        "logoVerification": {"exactText": "Maze so Puzzle", "capitalization": "M/P uppercase; clearly smaller locally typeset lowercase so", "subtitlePresent": False, "yellowRouteLinePresent": False, "font": "Fredoka", "fontLicence": "SIL OFL 1.1", "sourceMasterSha256": logo_master["sha256"]},
        "loadingContract": {"title": "only selected title environment loads on title route", "navigation": "icons load at their existing consumers", "plan01Ready": "logo and hero remain dormant and are not preloaded"},
        "supersededFilesDeleted": 0,
        "validation": {"status": "pending final commands and runtime visual report"},
    }
    json_write(ROOT / "docs/source-assets/publication/mgjrpg-02-plan03-r1-publication-report.json", report)

    update_retirement_ledger(by_id)


def update_retirement_ledger(by_id: dict[str, dict[str, Any]]) -> None:
    ledger_path = ROOT / "docs/source-assets/retirement/asset-retirement-ledger.json"
    ledger = read_json(ledger_path)
    nav_old = {
        "nav-home": ("public/assets/mgjrpg-02/navigation/nav-home-v03-navigation-optical-128-r01.webp", "docs/source-assets/records/nav-home-mgjrpg02-v03-source.json"),
        "nav-mazes": ("public/assets/mgjrpg-02/navigation/nav-mazes-v04-navigation-optical-128-r01.webp", "docs/source-assets/records/nav-mazes-mgjrpg02-v04-source.json"),
        "nav-book": ("public/assets/mgjrpg-02/navigation/nav-book-v02-navigation-optical-128-r01.webp", "docs/source-assets/records/nav-book-mgjrpg02-v02-source.json"),
        "nav-help": ("public/assets/mgjrpg-02/navigation/nav-help-v02-navigation-optical-128-r01.webp", "docs/source-assets/records/nav-help-mgjrpg02-v02-source.json"),
        "nav-sound": ("public/assets/mgjrpg-02/navigation/nav-sound-v03-navigation-optical-128-r01.webp", "docs/source-assets/records/nav-sound-mgjrpg02-v03-source.json"),
        "nav-muted": ("public/assets/mgjrpg-02/navigation/nav-muted-v02-navigation-optical-128-r01.webp", "docs/source-assets/records/nav-muted-mgjrpg02-v02-source.json"),
        "nav-restart": ("public/assets/mgjrpg-02/navigation/nav-restart-v02-navigation-optical-128-r01.webp", "docs/source-assets/records/nav-restart-mgjrpg02-v02-source.json"),
    }
    candidates = [(stable_id, old_path, record_path, by_id[stable_id]["path"], "navigation") for stable_id, (old_path, record_path) in nav_old.items()]
    candidates.append(("title-background", "public/assets/title-background-v1.webp", "docs/source-assets/records/title-background-v01-source.json", by_id["title-environment"]["path"], "brand"))
    existing = {entry["entryId"] for entry in ledger["entries"]}
    for stable_id, old_path, record_path, replacement, family in candidates:
        entry_id = f"plan03-r1-{stable_id}-prior-runtime"
        old_file = ROOT / old_path
        old_record_path = ROOT / record_path
        old_record = read_json(old_record_path)
        old_record["runtimeStatus"] = "superseded"
        for item in old_record.get("derivatives", []):
            if item.get("path") == old_path:
                item["runtimeStatus"] = "superseded"
        json_write(old_record_path, old_record)
        if entry_id in existing:
            continue
        image = image_facts(old_file)
        first_seen = subprocess.run(["git", "log", "--diff-filter=A", "--format=%H", "--", old_path], cwd=ROOT, check=True, capture_output=True, text=True).stdout.strip().splitlines()
        first_commit = first_seen[-1] if first_seen else "28946cbb04f45cb21cd51626914267ff4f71c375"
        source = old_record.get("sources", [])[0] if old_record.get("sources") else {"path": old_path, "sha256": sha256_file(old_file), "bytes": old_file.stat().st_size}
        source_kind = "source-master" if old_record.get("sourceStatus") == "source-backed" else "partial-master"
        if source["path"].startswith("public/"):
            source_kind = "runtime-sole-copy"
        ledger["entries"].append({
            "entryId": entry_id, "assetPath": old_path, "family": family, "classification": "superseded-runtime-rollback-candidate", "state": "rollback-hold", "eligibleForPlan12": False,
            "sha256": sha256_file(old_file), "bytes": old_file.stat().st_size, "width": image["width"], "height": image["height"], "decodedBytesUpperBound": image["decodedBytesUpperBound"],
            "firstSeenCommit": first_commit, "lastVerifiedCheckpoint": "d70c9c360683d2ed8f4f7d1cd172254bbda7b559", "runtimeReferences": [],
            "currentReferences": [
                {"kind": "source-record", "path": record_path, "detail": "Forward lifecycle record marks this exact derivative superseded while preserving source history.", "blocksRetirement": False},
                {"kind": "generated-manifest", "path": "docs/source-assets/manifest.json", "detail": "Generated inventory preserves this exact retained rollback file.", "blocksRetirement": False},
                {"kind": "publication-map", "path": "docs/source-assets/publication/mgjrpg-02-plan03-r1-runtime-map.json", "detail": f"Plan 03-R1 maps the active replacement to {replacement}.", "blocksRetirement": True},
            ],
            "replacementPaths": [replacement],
            "preservation": {"sourceStatus": old_record.get("sourceStatus", "partial"), "sourceRecordPath": record_path, "soleRepositoryCopy": source_kind == "runtime-sole-copy", "rollbackSources": [{"path": source["path"], "sha256": source["sha256"], "bytes": source["bytes"], "kind": source_kind}], "gitRestore": {"path": old_path, "firstSeenCommit": first_commit, "method": "Recover the exact retained derivative from Git history and verify its recorded SHA-256 before restoring the atomic pointer set."}},
            "blockers": [
                {"id": "final-catalogue-pointers-not-frozen", "detail": "Plan 01 and Plan 11 downstream front-door consumers are not yet final."},
                {"id": "authoritative-reachability-proof-missing", "detail": "Plan 12 has not completed exhaustive reachability proof across runtime, generated and packaged paths."},
                {"id": "generated-path-proof-missing", "detail": "Generated, test and preload path proof remains a Plan 12 gate."},
                {"id": "rollback-window-not-expired", "detail": "The Plan 03-R1 replacement remains inside its mandatory rollback hold."},
                {"id": "clean-clone-route-and-package-proof-missing", "detail": "Clean-clone browser and offline package proof belongs to Plan 12."},
                {"id": "external-backup-not-confirmed", "detail": "No copy-first export and Human-confirmed external backup exists."},
            ],
            "archiveRelativePath": f"payload/{old_path}",
            "retirementEvidence": {"catalogueFrozen": False, "reachabilityPassed": False, "generatedPathsPassed": False, "rollbackWindowExpired": False, "cleanClonePassed": False, "browserRoutesPassed": False, "tauriOfflinePackagePassed": False, "archiveHashVerified": False, "externalBackupConfirmed": False},
            "notes": f"Plan 03-R1 replaces this active {stable_id} delivery with {replacement}; no file was moved or deleted.",
        })
    entries = ledger["entries"]
    ledger["lastAuditedAt"] = "2026-09-04T00:00:00+01:00"
    ledger["inspectedCheckpoint"] = {"head": "d70c9c360683d2ed8f4f7d1cd172254bbda7b559", "workingTreeDirty": True, "notes": "Plan 03-R1 publication was isolated in a shared dirty tree; unrelated OST, Plan 10, backlog and roadmap work was preserved."}
    ledger["totals"] = {"candidateCount": len(entries), "encodedBytes": sum(entry["bytes"] for entry in entries), "decodedBytesUpperBound": sum(entry["decodedBytesUpperBound"] for entry in entries), "plan12EligibleCount": sum(1 for entry in entries if entry["eligibleForPlan12"]), "soleRepositoryCopyCount": sum(1 for entry in entries if entry["preservation"]["soleRepositoryCopy"]), "partialMasterCount": sum(1 for entry in entries if entry["preservation"]["sourceStatus"] == "partial")}
    json_write(ledger_path, ledger)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--publish", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.publish == args.check:
        parser.error("choose exactly one of --publish or --check")
    required = [DECISION, FONT, LOGO_CONCEPT, TITLE_SOURCE, HOME_SOURCE, APP_SOURCE, *[NAV_SOURCE_ROOT / item[2] for item in NAV.values()]]
    missing = [repo(path) for path in required if not path.is_file()]
    if missing:
        raise FileNotFoundError(missing)
    with tempfile.TemporaryDirectory(prefix="maze-plan03-r1-") as temporary:
        temp_root = Path(temporary)
        staged = encode_all(temp_root)
        if args.check:
            mismatches = []
            for row in staged:
                relative = row["file"].relative_to(temp_root)
                checked = ROOT / relative
                if not checked.is_file() or checked.read_bytes() != row["file"].read_bytes():
                    mismatches.append(relative.as_posix())
            if mismatches:
                raise RuntimeError(f"deterministic rebuild mismatch: {mismatches}")
            print(json.dumps({"status": "pass", "publicationId": PUBLICATION_ID, "checked": len(staged)}, indent=2))
            return
        for row in staged:
            publish_without_overwrite(row["file"], ROOT / row["file"].relative_to(temp_root))
        final_rows = []
        for row in staged:
            current = {**row, "file": ROOT / row["file"].relative_to(temp_root)}
            final_rows.append(facts(current))
        runtime = [row for row in final_rows if row["path"].startswith("public/")]
        platform = [row for row in final_rows if row["path"].startswith("src-tauri/")]
        source = [row for row in final_rows if row["path"].startswith("docs/")]
        summary = {
            "schema": "maze-art-plan03-r1-publication/v1",
            "publicationId": PUBLICATION_ID,
            "generatedOn": "2026-09-04",
            "decisionEvidence": {"path": repo(DECISION), "sha256": sha256_file(DECISION)},
            "derivativeRecipe": DERIVATIVE_RECIPE,
            "entries": final_rows,
            "counts": {
                "runtimeFileCount": len(runtime),
                "runtimeEncodedBytes": sum(row["bytes"] for row in runtime),
                "runtimeDecodedBytesUpperBound": sum(row.get("decodedBytesUpperBound", 0) for row in runtime),
                "platformFileCount": len(platform),
                "platformEncodedBytes": sum(row["bytes"] for row in platform),
                "sourceMasterCount": len(source),
                "sourceMasterEncodedBytes": sum(row["bytes"] for row in source),
            },
        }
        json_write(ROOT / "docs/source-assets/publication/mgjrpg-02-plan03-r1-runtime-map.json", summary)
        build_records_and_reports(final_rows, summary)
        print(json.dumps(summary["counts"], indent=2))


if __name__ == "__main__":
    main()
