"""Build source-only Plan 03-R1 premium UI and logo review evidence.

This script never writes to public/assets or generated catalogue files.  It
extracts review-only alpha from immutable chroma-matte originals, constructs
the exact-lettering logo from the vendored OFL font, and writes ignored proof
artifacts plus a measured source-only report.
"""

from __future__ import annotations

import hashlib
import html
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

from mgjrpg02_batch01 import (
    estimate_uniform_matte,
    extract_uniform_matte,
    normalize_visible_black,
)
from cutout import prepare_cutout
from encode import save_image


ROOT = Path(__file__).resolve().parents[2]
BATCH = (
    ROOT
    / "docs/source-assets/production/mgjrpg-02"
    / "batch-23-plan03-r1-premium-ui-logo"
)
PROOF = ROOT / "artifacts/art-proofs/mgjrpg-02/plan03-r1-review"
PROOF_ASSETS = PROOF / "assets"
FONT_PATH = ROOT / "docs/source-assets/fonts/fredoka/Fredoka-wdth-wght.ttf"
LOGO_PATH = BATCH / "game-logo-v02-candidate-a-deterministic-master.png"

SIZES = (64, 48, 32, 24, 16)
REGISTRATION = {
    "targetBox": (0.07, 0.07, 0.93, 0.93),
    "align": (0.5, 0.5),
    "alphaThreshold": 3,
}

ICONS = (
    {
        "id": "nav-home",
        "label": "Home",
        "version": 4,
        "source": "nav-home-v04-candidate-a-matte-01-generator-original.png",
        "current": "public/assets/mgjrpg-02/navigation/nav-home-v03-navigation-optical-128-r01.webp",
    },
    {
        "id": "nav-mazes",
        "label": "Mazes",
        "version": 5,
        "source": "nav-mazes-v05-candidate-a-matte-01-generator-original.png",
        "current": "public/assets/mgjrpg-02/navigation/nav-mazes-v04-navigation-optical-128-r01.webp",
    },
    {
        "id": "nav-book",
        "label": "Book",
        "version": 3,
        "source": "nav-book-v03-candidate-a-matte-01-generator-original.png",
        "current": "public/assets/mgjrpg-02/navigation/nav-book-v02-navigation-optical-128-r01.webp",
    },
    {
        "id": "nav-help",
        "label": "Help",
        "version": 3,
        "source": "nav-help-v03-candidate-a-matte-01-generator-original.png",
        "current": "public/assets/mgjrpg-02/navigation/nav-help-v02-navigation-optical-128-r01.webp",
    },
    {
        "id": "nav-sound",
        "label": "Sound",
        "version": 4,
        "source": "nav-sound-v04-candidate-a-matte-01-generator-original.png",
        "current": "public/assets/mgjrpg-02/navigation/nav-sound-v03-navigation-optical-128-r01.webp",
    },
    {
        "id": "nav-muted",
        "label": "Muted",
        "version": 3,
        "source": "nav-muted-v03-candidate-a-matte-01-generator-original.png",
        "current": "public/assets/mgjrpg-02/navigation/nav-muted-v02-navigation-optical-128-r01.webp",
    },
    {
        "id": "nav-restart",
        "label": "Restart",
        "version": 3,
        "source": "nav-restart-v03-candidate-a-matte-01-generator-original.png",
        "current": "public/assets/mgjrpg-02/navigation/nav-restart-v02-navigation-optical-128-r01.webp",
    },
)

OUTPUT_IDS = {
    "nav-home": "exec-a276d9d4-0bfc-4022-901c-4619262bc690.png",
    "nav-mazes": "exec-6571705b-62e5-41a9-8692-240f73449dda.png",
    "nav-book": "exec-f9c5665d-0ea9-4ba6-a0b0-a031604a3891.png",
    "nav-help": "exec-8d995571-7620-48a3-83fb-bd66f2868817.png",
    "nav-sound": "exec-569817d0-deac-4669-b4a1-c20bb2ad9fe9.png",
    "nav-muted": "exec-7a30d2f3-ebc1-4724-8be3-934c8a7c3f6c.png",
    "nav-restart": "exec-42f14134-4988-4ddf-a83d-850f1a5dcaf8.png",
}

ALPHA_REJECTS = {
    "nav-home": (
        "nav-home-v04-alpha-attempt-01-generator-original.png",
        "exec-20fc3d8f-08fc-4c3a-a780-338c3ec0a53f.png",
    ),
    "nav-mazes": (
        "nav-mazes-v05-alpha-attempt-01-generator-original.png",
        "exec-f07cea77-cbb9-4816-afb0-1f52a93bc800.png",
    ),
    "nav-book": (
        "nav-book-v03-alpha-attempt-01-generator-original.png",
        "exec-6784f4c4-d364-4b05-a994-2047a5e4164c.png",
    ),
    "nav-help": (
        "nav-help-v03-alpha-attempt-01-generator-original.png",
        "exec-e9274a47-929f-4766-bddf-94c54b81767e.png",
    ),
}

FRONT_DOOR = (
    {
        "label": "Title Candidate A",
        "runId": "batch-21-title-background-v02-a",
        "path": "docs/source-assets/production/mgjrpg-02/batch-21-front-door-art/title-background-v02-candidate-a-generator-original.png",
    },
    {
        "label": "Home Splash Candidate B",
        "runId": "batch-21-home-splash-v01-b",
        "path": "docs/source-assets/production/mgjrpg-02/batch-21-front-door-art/home-hero-splash-v01-candidate-b-matte-01-generator-original.png",
    },
    {
        "label": "Environment-only layer",
        "runId": "batch-21-title-background-environment-study-01",
        "path": "docs/source-assets/production/mgjrpg-02/batch-21-front-door-art/title-background-v02-environment-only-study-01-generator-original.png",
    },
    {
        "label": "Ame-face application-icon candidate",
        "runId": "batch-13-app-icon-ame-v03",
        "path": "docs/source-assets/production/mgjrpg-02/batch-13-ui-portals-equipment/app-icon-ame-v03-candidate-a-generator-original.png",
    },
)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def repo_path(path: Path) -> str:
    return path.resolve().relative_to(ROOT).as_posix()


def font(size: int) -> ImageFont.FreeTypeFont:
    face = ImageFont.truetype(str(FONT_PATH), size=size)
    try:
        face.set_variation_by_name("SemiBold")
    except (AttributeError, OSError):
        pass
    return face


def text_mask(text: str, face: ImageFont.FreeTypeFont) -> Image.Image:
    left, top, right, bottom = face.getbbox(text, stroke_width=0)
    mask = Image.new("L", (right - left + 16, bottom - top + 16), 0)
    draw = ImageDraw.Draw(mask)
    draw.text((8 - left, 8 - top), text, font=face, fill=255)
    return mask


def colorize(mask: Image.Image, color: tuple[int, int, int, int]) -> Image.Image:
    layer = Image.new("RGBA", mask.size, color)
    layer.putalpha(ImageChops.multiply(mask, Image.new("L", mask.size, color[3])))
    return layer


def expanded(mask: Image.Image, radius: int) -> Image.Image:
    return mask.filter(ImageFilter.MaxFilter(radius * 2 + 1))


def composite_mask(canvas: Image.Image, layer: Image.Image, xy: tuple[int, int]) -> None:
    canvas.alpha_composite(layer, xy)


def gradient_fill(mask: Image.Image, colors: tuple[tuple[int, int, int], ...]) -> Image.Image:
    width, height = mask.size
    stops = np.linspace(0, height - 1, len(colors))
    rows = np.zeros((height, width, 4), dtype=np.uint8)
    for y in range(height):
        index = min(len(colors) - 2, int(np.searchsorted(stops, y, side="right") - 1))
        index = max(0, index)
        span = max(1.0, stops[index + 1] - stops[index])
        amount = (y - stops[index]) / span
        rgb = np.rint(
            np.asarray(colors[index]) * (1.0 - amount)
            + np.asarray(colors[index + 1]) * amount
        ).astype(np.uint8)
        rows[y, :, :3] = rgb
        rows[y, :, 3] = np.asarray(mask, dtype=np.uint8)[y]
    return Image.fromarray(rows, "RGBA")


def holographic_band(mask: Image.Image, start: float, end: float, alpha: int) -> Image.Image:
    width, height = mask.size
    pixels = np.zeros((height, width, 4), dtype=np.uint8)
    palette = np.asarray(
        ((242, 167, 220), (149, 231, 230), (250, 224, 151), (178, 167, 244)),
        dtype=np.float32,
    )
    mask_values = np.asarray(mask, dtype=np.uint8)
    for y in range(height):
        diagonal = (y / max(1, height - 1)) + np.linspace(0, 0.22, width)
        active = (diagonal >= start) & (diagonal <= end)
        position = np.clip((diagonal - start) / max(0.001, end - start), 0.0, 0.999)
        segment = position * (len(palette) - 1)
        low = segment.astype(np.int32)
        high = np.minimum(low + 1, len(palette) - 1)
        blend = (segment - low)[:, None]
        pixels[y, :, :3] = np.rint(palette[low] * (1.0 - blend) + palette[high] * blend).astype(np.uint8)
        pixels[y, :, 3] = np.where(active, mask_values[y] * alpha // 255, 0).astype(np.uint8)
    return Image.fromarray(pixels, "RGBA")


def top_highlight(mask: Image.Image, offset: int, alpha: int) -> Image.Image:
    shifted = ImageChops.offset(mask, 0, offset)
    edge = ImageChops.subtract(mask, shifted)
    return colorize(edge, (255, 252, 239, alpha))


def broad_material_facets(mask: Image.Image) -> Image.Image:
    """Add four low-frequency planes; never glitter or micro-facet texture."""

    width, height = mask.size
    overlay = Image.new("RGBA", mask.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.polygon(
        ((0, 0), (int(width * 0.34), 0), (int(width * 0.22), height), (0, height)),
        fill=(255, 236, 250, 24),
    )
    draw.polygon(
        (
            (int(width * 0.36), 0),
            (int(width * 0.66), 0),
            (int(width * 0.57), height),
            (int(width * 0.25), height),
        ),
        fill=(107, 238, 221, 18),
    )
    draw.polygon(
        (
            (int(width * 0.67), 0),
            (width, 0),
            (width, height),
            (int(width * 0.55), height),
        ),
        fill=(255, 204, 171, 20),
    )
    clipped_alpha = ImageChops.multiply(overlay.getchannel("A"), mask)
    overlay.putalpha(clipped_alpha)
    return overlay


def place_word(
    canvas: Image.Image,
    text: str,
    face: ImageFont.FreeTypeFont,
    center_x: int,
    y: int,
    fill_colors: tuple[tuple[int, int, int], ...],
    contour: tuple[int, int, int, int],
    *,
    cream: int,
    contour_width: int,
    foil_width: int = 0,
    extrusion: tuple[int, int] = (0, 24),
    holo: tuple[float, float, int] | None = None,
) -> tuple[int, int, int, int]:
    mask = text_mask(text, face)
    x = center_x - mask.width // 2
    cream_mask = expanded(mask, cream)
    contour_mask = expanded(mask, contour_width)
    extrusion_layer = colorize(contour_mask, (83, 52, 98, 230))
    composite_mask(canvas, extrusion_layer, (x + extrusion[0], y + extrusion[1]))
    composite_mask(canvas, colorize(cream_mask, (255, 246, 219, 255)), (x, y))
    composite_mask(canvas, colorize(contour_mask, contour), (x, y))
    if foil_width:
        foil_mask = expanded(mask, foil_width)
        composite_mask(canvas, colorize(foil_mask, (222, 164, 69, 255)), (x, y))
    composite_mask(canvas, gradient_fill(mask, fill_colors), (x, y))
    if face.size >= 200:
        composite_mask(canvas, broad_material_facets(mask), (x, y))
    if holo:
        composite_mask(canvas, holographic_band(mask, *holo), (x, y))
    composite_mask(canvas, top_highlight(mask, max(5, face.size // 34), 185), (x, y))
    return x, y, mask.width, mask.height


def build_logo() -> dict[str, object]:
    canvas = Image.new("RGBA", (2048, 1152), (0, 0, 0, 0))
    maze = font(350)
    puzzle = font(390)
    small = font(148)
    place_word(
        canvas,
        "Maze",
        maze,
        1024,
        105,
        ((228, 199, 250), (184, 144, 225), (137, 100, 183)),
        (105, 68, 126, 255),
        cream=31,
        contour_width=21,
        extrusion=(0, 28),
        holo=(0.43, 0.59, 104),
    )
    place_word(
        canvas,
        "Puzzle",
        puzzle,
        1024,
        445,
        ((191, 247, 224), (108, 211, 185), (58, 158, 153)),
        (55, 103, 125, 255),
        cream=33,
        contour_width=23,
        foil_width=11,
        extrusion=(0, 30),
        holo=(0.18, 0.31, 112),
    )
    place_word(
        canvas,
        "so",
        small,
        1024,
        356,
        ((255, 184, 174), (234, 109, 122), (190, 78, 105)),
        (133, 67, 105, 255),
        cream=18,
        contour_width=12,
        foil_width=5,
        extrusion=(0, 13),
    )
    # Trim to the constructed silhouette, then restore a controlled safe zone.
    bbox = canvas.getchannel("A").getbbox()
    if bbox is None:
        raise ValueError("logo construction produced no visible pixels")
    logo = canvas.crop(bbox)
    padded = Image.new("RGBA", (logo.width + 144, logo.height + 144), (0, 0, 0, 0))
    padded.alpha_composite(logo, (72, 72))
    save_image(padded, LOGO_PATH, "png", {"compress_level": 9, "optimize": False})
    return {
        "path": repo_path(LOGO_PATH),
        "sha256": sha256(LOGO_PATH),
        "bytes": LOGO_PATH.stat().st_size,
        "width": padded.width,
        "height": padded.height,
        "mode": "RGBA",
        "text": "Maze so Puzzle",
        "routeLinePresent": False,
        "construction": "deterministic local typesetting and mask compositing",
    }


def extract_icon(source_path: Path) -> tuple[Image.Image, dict[str, object]]:
    with Image.open(source_path) as opened:
        opened.load()
        source = opened.copy()
    matte = estimate_uniform_matte(source)
    extracted, extraction = extract_uniform_matte(
        source,
        matte["rgb"],
        clear_distance=48.0,
        opaque_distance=144.0,
        minimum_component_pixels=64,
    )
    return extracted, {
        "matte": matte,
        "extraction": extraction,
    }


def register_icon(extracted: Image.Image, size: int) -> tuple[Image.Image, dict[str, object]]:
    prepared = prepare_cutout(
        extracted,
        (size, size),
        extraction_mode="native-alpha",
        clear_alpha_below=3,
        edge_dilation_pixels=4 if size >= 128 else 2,
        minimum_alpha_component_pixels=1 if size <= 24 else 4,
        registration=REGISTRATION,
    )
    prepared, normalized_black = normalize_visible_black(prepared)
    return prepared, {
        "exactBlackVisiblePixelsNormalized": normalized_black,
    }


def image_fact(path: Path) -> dict[str, object]:
    with Image.open(path) as opened:
        opened.load()
        rgba = opened.convert("RGBA")
    alpha = np.asarray(rgba.getchannel("A"), dtype=np.uint8)
    ys, xs = np.nonzero(alpha >= 3)
    return {
        "path": repo_path(path),
        "sha256": sha256(path),
        "bytes": path.stat().st_size,
        "width": rgba.width,
        "height": rgba.height,
        "decodedBytesUpperBound": rgba.width * rgba.height * 4,
        "visibleBounds": None
        if not len(xs)
        else [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1],
        "semiTransparentPixels": int(np.count_nonzero((alpha > 0) & (alpha < 255))),
        "exactBlackVisiblePixels": int(
            np.count_nonzero(
                (alpha >= 3)
                & np.all(np.asarray(rgba, dtype=np.uint8)[:, :, :3] == 0, axis=2)
            )
        ),
    }


def generator_fact(path: Path, output_id: str) -> dict[str, object]:
    with Image.open(path) as opened:
        opened.load()
        width, height = opened.size
        mode = opened.mode
    return {
        "path": repo_path(path),
        "outputId": output_id,
        "sha256": sha256(path),
        "bytes": path.stat().st_size,
        "width": width,
        "height": height,
        "format": "png",
        "mode": mode,
        "alphaMode": "straight" if "A" in mode else "opaque",
        "decodedBytesUpperBound": width * height * 4,
    }


def copy_front_door_thumbnails() -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    for index, item in enumerate(FRONT_DOOR, start=1):
        source = ROOT / item["path"]
        with Image.open(source) as opened:
            opened.load()
            preview = opened.convert("RGB")
        preview.thumbnail((720, 405), Image.Resampling.LANCZOS)
        destination = PROOF_ASSETS / f"front-door-{index:02d}.jpg"
        preview.save(destination, "JPEG", quality=88, optimize=True, progressive=True)
        rows.append({**item, "preview": destination.name, "sourceSha256": sha256(source)})
    return rows


def build_html(front_door: list[dict[str, object]], logo: dict[str, object]) -> None:
    front_cards = "".join(
        f"""<figure class="front-card"><img src="assets/{html.escape(str(row['preview']))}" alt="{html.escape(str(row['label']))}"><figcaption><strong>{html.escape(str(row['label']))}</strong><code>{html.escape(str(row['runId']))}</code><small>{html.escape(str(row['path']))}</small></figcaption></figure>"""
        for row in front_door
    )
    icon_cards = []
    for icon in ICONS:
        sizes = "".join(
            f'<span class="actual"><img src="assets/{icon["id"]}-candidate-{size}.png" width="{size}" height="{size}" alt=""><b>{size}</b></span>'
            for size in SIZES
        )
        icon_cards.append(
            f"""<article class="icon-card"><h3>{html.escape(icon['label'])} <code>{icon['id']}</code></h3><div class="compare"><figure><img src="assets/{icon['id']}-current.png" alt="Current {html.escape(icon['label'])}"><figcaption>Current published</figcaption></figure><figure><img src="assets/{icon['id']}-candidate-512.png" alt="Candidate {html.escape(icon['label'])}"><figcaption>R1 Candidate A</figcaption></figure></div><div class="actual-strip">{sizes}</div></article>"""
        )
    document = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Plan 03-R1 Human review</title>
<style>
:root{{font-family:Inter,ui-rounded,system-ui,sans-serif;color:#3d2948;background:#ede6db}}*{{box-sizing:border-box}}body{{margin:0}}main{{max-width:1220px;margin:auto;padding:24px}}h1{{margin:0 0 6px}}h2{{margin-top:34px}}p{{color:#725f78;max-width:82ch}}code{{display:block;font-size:11px;color:#76546f;margin-top:4px;overflow-wrap:anywhere}}small{{display:block;font-size:10px;color:#806e7f;margin-top:5px;overflow-wrap:anywhere}}.front-grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px}}figure{{margin:0}}.front-card,.icon-card,.logo-card{{background:#fff8eb;border:1px solid #d8c7d4;border-radius:18px;padding:12px;box-shadow:0 3px 0 #d7ccd1}}.front-card img{{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:11px;background:#d9cfcb}}figcaption{{padding-top:8px}}.logo-card{{background:linear-gradient(135deg,#fff8eb,#dce8e3 52%,#44324d)}}.logo-card img{{display:block;width:min(100%,850px);height:auto;margin:auto}}.icon-grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:14px}}.icon-card h3{{margin:0 0 10px}}.compare{{display:grid;grid-template-columns:1fr 1fr;gap:9px}}.compare figure{{text-align:center;background:#efe7dd;border-radius:12px;padding:8px}}.compare img{{width:128px;height:128px;object-fit:contain}}.compare figcaption{{font-size:12px;font-weight:700}}.actual-strip{{display:flex;align-items:flex-end;justify-content:center;gap:13px;min-height:84px;margin-top:10px;padding:8px;background:#493950;border-radius:11px}}.actual{{display:grid;justify-items:center;gap:4px}}.actual img{{object-fit:contain}}.actual b{{font-size:10px;color:#f9eadb}}.decision{{background:#f9e0a6;border-left:5px solid #d99738;padding:12px 14px;border-radius:10px}}@media(max-width:600px){{main{{padding:14px}}.icon-grid{{grid-template-columns:1fr}}.actual-strip{{gap:8px}}}}
</style></head><body><main><h1>Plan 03-R1 · Human review gate</h1><p class="decision"><strong>Recommendation:</strong> exact-lettered Logo Candidate A and the complete seven-icon R1 Candidate A family. Nothing on this page is published to runtime.</p>
<h2>Recorded forward front-door selections</h2><p>These four exact sources—not every Batch 21 or Batch 13 study—are the approved front-door selections carried forward.</p><section class="front-grid">{front_cards}</section>
<h2>Refined exact-lettering logo</h2><p>Exact text “Maze so Puzzle”; lowercase “so”; no subtitle; no yellow route line. Fredoka SemiBold is locally typeset under the SIL Open Font License, then material masks are deterministically composited.</p><figure class="logo-card"><img src="assets/logo-candidate-a.png" alt="Maze so Puzzle exact-lettering logo candidate"><figcaption><strong>Recommended · Logo Candidate A</strong><code>{html.escape(str(logo['path']))}</code></figcaption></figure>
<h2>Premium utility sticker family</h2><p>Each candidate was generated fresh from blank canvas. Current icons supplied only semantic/silhouette evidence; approved Batch 22 achievements supplied material authority. The intrinsic PNGs below are the requested actual sizes.</p><section class="icon-grid">{''.join(icon_cards)}</section>
</main></body></html>"""
    (PROOF / "index.html").write_text(document, encoding="utf-8", newline="\n")


def json_write(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2) + "\n", encoding="utf-8", newline="\n")


def current_record(stable_id: str) -> tuple[Path, dict[str, object]]:
    matches: list[tuple[Path, dict[str, object]]] = []
    for path in (ROOT / "docs/source-assets/records").glob("*.json"):
        value = json.loads(path.read_text(encoding="utf-8"))
        if value.get("id") == stable_id and value.get("runtimeStatus") == "active":
            matches.append((path, value))
    if len(matches) != 1:
        raise ValueError(f"{stable_id}: expected one active source record, found {len(matches)}")
    return matches[0]


def file_evidence(path: Path, relationship: str, evidence: str) -> dict[str, object]:
    return {
        "path": repo_path(path),
        "sha256": sha256(path),
        "bytes": path.stat().st_size,
        "relationship": relationship,
        "evidence": evidence,
    }


def build_source_metadata(report: dict[str, object]) -> None:
    prompt_path = BATCH / "PROMPTS.md"
    prompt_hash = sha256(prompt_path)
    decision_path = ROOT / "docs/source-assets/calibrations/mgjrpg-02/v07/human-decision.json"
    approved_reference_decision_path = ROOT / "docs/source-assets/calibrations/mgjrpg-02/v06/human-decision.json"
    recipe_path = ROOT / "docs/source-assets/recipes/mgjrpg-02.json"
    canary_path = ROOT / "docs/source-assets/reviews/mgjrpg-02-canary-v01.json"
    craft_paths = (
        ROOT / "docs/source-assets/production/mgjrpg-02/batch-22-achievement-stickers/reward-trail-sticker-v03-candidate-a-matte-01-generator-original.png",
        ROOT / "docs/source-assets/production/mgjrpg-02/batch-22-achievement-stickers/badge-pathfinder-v02-candidate-a-matte-01-generator-original.png",
    )
    run_rows: list[dict[str, object]] = []
    batch_run_rows: list[dict[str, object]] = []
    proposed: list[dict[str, object]] = []
    icon_reports = {row["id"]: row for row in report["recommendedIconFamily"]}
    reference_registry: dict[str, dict[str, object]] = {
        "mgjrpg-02-recipe": {
            "path": repo_path(recipe_path),
            "authorityKind": "approved-rendering-contract",
            "sha256": sha256(recipe_path),
            "bytes": recipe_path.stat().st_size,
        },
        "batch22-first-star-craft": {
            "path": repo_path(craft_paths[0]),
            "authorityKind": "approved-premium-material-reference",
            "sha256": sha256(craft_paths[0]),
            "bytes": craft_paths[0].stat().st_size,
        },
        "batch22-pathfinder-craft": {
            "path": repo_path(craft_paths[1]),
            "authorityKind": "approved-premium-material-reference",
            "sha256": sha256(craft_paths[1]),
            "bytes": craft_paths[1].stat().st_size,
        },
        "human-runtime-publication-v06": {
            "path": repo_path(approved_reference_decision_path),
            "authorityKind": "approved-reference-and-runtime-publication-decision",
            "sha256": sha256(approved_reference_decision_path),
            "bytes": approved_reference_decision_path.stat().st_size,
        },
        "human-front-door-forward-v07": {
            "path": repo_path(decision_path),
            "authorityKind": "forward-front-door-selection-decision",
            "sha256": sha256(decision_path),
            "bytes": decision_path.stat().st_size,
        },
    }

    for icon in ICONS:
        stable_id = str(icon["id"])
        old_record_path, old_record = current_record(stable_id)
        old_source = old_record["sources"][0]
        old_derivative = old_record["derivatives"][0]
        candidate = BATCH / str(icon["source"])
        references = [
            {
                "order": 1,
                "role": "comparison-only",
                "authorityKind": "runtime-comparison",
                "path": str(old_source["path"]),
                "sha256": str(old_source["sha256"]),
            },
            {
                "order": 2,
                "role": "material-authority",
                "authorityKind": "approved-rendering-anchor",
                "path": repo_path(craft_paths[0]),
                "sha256": sha256(craft_paths[0]),
            },
            {
                "order": 3,
                "role": "optical-authority",
                "authorityKind": "approved-rendering-anchor",
                "path": repo_path(craft_paths[1]),
                "sha256": sha256(craft_paths[1]),
            },
        ]
        outputs: list[dict[str, object]] = []
        if stable_id in ALPHA_REJECTS:
            reject_name, reject_id = ALPHA_REJECTS[stable_id]
            reject_path = BATCH / reject_name
            outputs.append(
                {
                    "outputId": reject_id,
                    "path": repo_path(reject_path),
                    "sha256": sha256(reject_path),
                    "bytes": reject_path.stat().st_size,
                    "disposition": "rejected",
                    "reason": "Native-alpha request painted an opaque checkerboard; retained only as truthful rejected provenance and forbidden as source or rendering authority.",
                }
            )
        outputs.append(
            {
                "outputId": OUTPUT_IDS[stable_id],
                "path": repo_path(candidate),
                "sha256": sha256(candidate),
                "bytes": candidate.stat().st_size,
                    "disposition": "selected",
                "reason": "Fresh blank-canvas premium utility candidate selected by art-direction QA for the Plan 03-R1 Human review gate; not publication-approved.",
            }
        )
        generation_run = {
            "runId": f"batch-23-{stable_id}-premium-utility-v{int(icon['version']):02d}-a",
            "generator": "OpenAI — Codex built-in image generation capability",
            "model": "not exposed by the tool response",
            "executedAt": "unknown",
            "prompt": {"path": repo_path(prompt_path), "sha256": prompt_hash},
            "references": references,
            "outputs": outputs,
            "lineage": {
                "editOfEdit": False,
                "identityAuthorityEligible": False,
                "renderingAuthorityEligible": False,
            },
            "notes": "Fresh canvas. Image 1 supplied semantic/silhouette evidence only; Images 2 and 3 supplied approved Batch 22 material and optical craft. Generator model, seed, and timestamp were not exposed.",
        }
        run_rows.append(generation_run)
        semantic_reference_id = f"{stable_id}-current-semantic"
        reference_registry[semantic_reference_id] = {
            "path": str(old_source["path"]),
            "authorityKind": "active-approved-semantic-and-silhouette-reference-only",
            "sha256": str(old_source["sha256"]),
            "bytes": int(old_source["bytes"]),
        }
        ordered_batch_references = [
            {
                "order": 1,
                "referenceId": semantic_reference_id,
                "role": "semantic meaning and broad silhouette only; no pixel reuse or rendering authority",
            },
            {
                "order": 2,
                "referenceId": "batch22-first-star-craft",
                "role": "approved premium glossy enamel, foil, holographic segment, cream cutline, and material-aware contour craft",
            },
            {
                "order": 3,
                "referenceId": "batch22-pathfinder-craft",
                "role": "approved small-scale optical hierarchy and restrained premium material craft",
            },
        ]
        if stable_id in ALPHA_REJECTS:
            reject_name, reject_id = ALPHA_REJECTS[stable_id]
            reject_path = BATCH / reject_name
            batch_run_rows.append(
                {
                    "generationMode": "fresh-reference-led-native-alpha-attempt",
                    "lineage": {
                        "freshCanvas": True,
                        "previousBatchOutputUsed": True,
                        "previousBatchOutputApprovalEvidence": "docs/source-assets/calibrations/mgjrpg-02/v06/human-decision.json",
                        "rejectedOutputUsedAsReference": False,
                        "editOfEdit": False,
                        "sourceEditDepth": 0,
                        "mayBecomeIdentityAuthority": False,
                        "mayBecomeRenderingAuthority": False,
                    },
                    "runId": f"batch-23-{stable_id}-premium-utility-alpha-attempt-01",
                    "promptBlockId": f"{stable_id}-native-alpha-attempt-01",
                    "identityId": stable_id,
                    "orderedReferences": ordered_batch_references,
                    "output": generator_fact(reject_path, reject_id),
                    "disposition": {
                        "status": "rejected-background-invalid",
                        "reason": "The tool painted an opaque checkerboard instead of genuine alpha; retained as provenance only and never used as a source or reference.",
                    },
                }
            )
        batch_run_rows.append(
            {
                "generationMode": "fresh-reference-led-source-on-uniform-matte",
                "lineage": {
                    "freshCanvas": True,
                    "previousBatchOutputUsed": True,
                    "previousBatchOutputApprovalEvidence": "docs/source-assets/calibrations/mgjrpg-02/v06/human-decision.json",
                    "rejectedOutputUsedAsReference": False,
                    "editOfEdit": False,
                    "sourceEditDepth": 0,
                    "mayBecomeIdentityAuthority": False,
                    "mayBecomeRenderingAuthority": False,
                },
                "runId": generation_run["runId"],
                "promptBlockId": f"{stable_id}-premium-utility-candidate-a-matte-01",
                "identityId": stable_id,
                "orderedReferences": ordered_batch_references,
                "output": generator_fact(candidate, OUTPUT_IDS[stable_id]),
                "disposition": {
                    "status": "pending-human-batch-review",
                    "reason": "Fresh premium utility candidate selected by art-direction QA for the Plan 03-R1 Human review gate.",
                },
            }
        )

        fact = icon_reports[stable_id]["candidate512"]
        x0, y0, x1, y1 = fact["visibleBounds"]
        geometry = {
            "class": "icon",
            "pivot": [0.5, 0.5],
            "visibleBounds": [
                round(x0 / 512, 8),
                round(y0 / 512, 8),
                round((x1 - x0) / 512, 8),
                round((y1 - y0) / 512, 8),
            ],
            "safeInset": [0.07, 0.07, 0.07, 0.07],
            "opticalBounds": [
                round(x0 / 512, 8),
                round(y0 / 512, 8),
                round((x1 - x0) / 512, 8),
                round((y1 - y0) / 512, 8),
            ],
        }
        record = {
            "$schema": "../schema/art-source.schema.json",
            "schemaVersion": 2,
            "recordId": f"{stable_id}-mgjrpg02-v{int(icon['version']):02d}-source",
            "id": stable_id,
            "artVersion": int(icon["version"]),
            "family": "navigation",
            "runtimeStatus": "source-only",
            "sourceStatus": "source-backed",
            "approvalStatus": "pending-human",
            "validationProfile": "strict-v2",
            "recipeVersion": "mgjrpg-02",
            "derivativeRecipeVersion": "proposed-mgjrpg-02-premium-utility-r01",
            "recipeEvidence": {
                "recipeId": "mgjrpg-02",
                "path": repo_path(recipe_path),
                "sha256": sha256(recipe_path),
            },
            "generationRuns": [generation_run],
            "renderingContract": {
                "profileId": "storybook-local-contour-v1",
                "recipeId": "mgjrpg-02",
                "treatmentClass": "semantic-ui-cutout",
                "canaryReview": {
                    "reviewId": "mgjrpg-02-canary-v01",
                    "path": repo_path(canary_path),
                    "sha256": sha256(canary_path),
                },
                "authoredContour": "material-local-color-aware",
                "extractionRole": "alpha-matte-only",
                "stickerCutline": "semantic-cream-only",
            },
            "promptEvidence": {
                "fidelity": "exact",
                "historyPath": repo_path(prompt_path),
                "assetNamedInHistory": True,
                "promptFile": {"path": repo_path(prompt_path), "sha256": prompt_hash},
                "outputIds": [row["outputId"] for row in outputs],
                "notes": "Exact shared and subject blocks, their concatenation order, output IDs, and ordered input roles are preserved in the batch prompt and run records.",
            },
            "sources": [
                file_evidence(
                    candidate,
                    "pending-human premium utility generator original",
                    "Fresh chroma-matte candidate selected by art-direction QA for review; no runtime publication approval.",
                )
            ],
            "derivatives": [],
            "geometry": geometry,
            "build": {
                "sourcePath": repo_path(candidate),
                "operation": "cutout-resize",
                "profiles": [
                    {
                        "id": "source-review-512",
                        "outputPath": f"artifacts/art-proofs/mgjrpg-02/plan03-r1-review/assets/{stable_id}-candidate-512.png",
                        "width": 512,
                        "height": 512,
                        "format": "png",
                        "clearAlphaBelow": 3,
                        "edgeDilationPixels": 4,
                        "minimumAlphaComponentPixels": 4,
                        "maxEncodedBytes": 1048576,
                        "encoder": {"options": {"compress_level": 9, "optimize": False}},
                    }
                ],
                "backgroundExtraction": {
                    "mode": "flat-impossible-matte",
                    "recipeId": "flat-impossible-matte-alpha-unblend-v1",
                    "rgb": icon_reports[stable_id]["processing"]["matte"]["rgb"],
                    "clearDistance": 48,
                    "opaqueDistance": 144,
                    "minimumComponentPixels": 64,
                },
                "registration": {
                    "targetBox": [0.07, 0.07, 0.93, 0.93],
                    "align": [0.5, 0.5],
                    "alphaThreshold": 3,
                },
            },
            "humanEdits": [
                {
                    "kind": "review-proof-only-deterministic-processing",
                    "description": "Uniform matte alpha unblend, decontamination, registration, and optical-size proof generation only; no runtime derivative exists.",
                    "script": "scripts/art_pipeline/mgjrpg02_plan03_r1_review.py",
                }
            ],
            "knownUnknowns": [
                "Generator model build, seed, exact execution timestamp, and request envelope were not exposed by the built-in tool.",
                "Human source approval, runtime derivative profile, encoded-byte allocation, and catalogue publication are pending.",
            ],
            "rights": {
                "originClaim": "Generated fresh for Maze so Puzzle from exact prompts and internal semantic/material references; no named franchise, character, logo, living artist, or proprietary composition was requested.",
                "licenceStatus": "pending-owner-review",
                "notes": "Source-only Plan 03-R1 candidate; technical and owner rights review remains part of the later publication gate.",
            },
            "rollback": {
                "method": "Keep the current active catalogue pointer and runtime derivative unchanged; remove only the unapproved R1 candidate record and proof artifacts to return to the accepted Plan 03 anchor.",
                "previousPath": str(old_derivative["path"]),
                "previousSha256": str(old_derivative["sha256"]),
            },
        }
        if stable_id == "nav-muted":
            record["geometry"]["modifierBox"] = [0.06, 0.05, 0.87, 0.9]
        record_path = ROOT / "docs/source-assets/records" / f"{record['recordId']}.json"
        json_write(record_path, record)
        proposed.append(
            {
                "stableId": stable_id,
                "catalogueTarget": f"NAVIGATION_ART.{stable_id.removeprefix('nav-')}",
                "currentRecord": repo_path(old_record_path),
                "currentRuntimePath": str(old_derivative["path"]),
                "currentRuntimeSha256": str(old_derivative["sha256"]),
                "candidateSource": repo_path(candidate),
                "candidateSourceSha256": sha256(candidate),
                "proposedRecordId": record["recordId"],
                "proposedRuntimePath": f"public/assets/mgjrpg-02/navigation/{stable_id}-v{int(icon['version']):02d}-navigation-optical-128-r01.webp",
                "profile": "navigation-optical-128",
                "status": "pending-human-source-review-no-file-created",
                "requiresNamedFeatureAllocation": True,
            }
        )

    logo_concept = ROOT / "docs/source-assets/production/mgjrpg-02/batch-21-front-door-art/game-logo-concept-v01-candidate-a-alpha-attempt-01-generator-original.png"
    font_file = FONT_PATH
    logo_record = {
        "$schema": "../schema/art-source.schema.json",
        "schemaVersion": 2,
        "recordId": "game-logo-mgjrpg02-v02-source",
        "id": "game-logo",
        "artVersion": 2,
        "family": "brand",
        "runtimeStatus": "source-only",
        "sourceStatus": "source-backed",
        "approvalStatus": "pending-human",
        "validationProfile": "strict-v2",
        "recipeVersion": "mgjrpg-02",
        "derivativeRecipeVersion": "proposed-plan11-branding-r01",
        "recipeEvidence": {
            "recipeId": "mgjrpg-02",
            "path": repo_path(recipe_path),
            "sha256": sha256(recipe_path),
        },
        "generationRuns": [
            {
                "runId": "batch-23-game-logo-v02-deterministic-a",
                "generator": "Local deterministic Pillow mask compositor",
                "model": "not applicable",
                "executedAt": "unknown",
                "prompt": {"path": repo_path(prompt_path), "sha256": prompt_hash},
                "references": [
                    {
                        "order": 1,
                        "role": "composition-authority",
                        "authorityKind": "immutable-generator-original",
                        "path": repo_path(logo_concept),
                        "sha256": sha256(logo_concept),
                    },
                    {
                        "order": 2,
                        "role": "construction-authority",
                        "authorityKind": "approved-source-master",
                        "path": repo_path(font_file),
                        "sha256": sha256(font_file),
                    },
                    {
                        "order": 3,
                        "role": "material-authority",
                        "authorityKind": "approved-rendering-anchor",
                        "path": repo_path(craft_paths[0]),
                        "sha256": sha256(craft_paths[0]),
                    },
                ],
                "outputs": [
                    {
                        "outputId": "deterministic-local-game-logo-v02-candidate-a.png",
                        "path": repo_path(LOGO_PATH),
                        "sha256": sha256(LOGO_PATH),
                        "bytes": LOGO_PATH.stat().st_size,
                        "disposition": "selected",
                        "reason": "Exact-lettering deterministic refinement selected by art-direction QA for Human review; runtime publication remains unapproved.",
                    }
                ],
                "lineage": {
                    "editOfEdit": False,
                    "identityAuthorityEligible": False,
                    "renderingAuthorityEligible": False,
                },
                "notes": "The Batch 21 image is composition/material evidence only. No generated glyph pixels or yellow route-line pixels are reused.",
            }
        ],
        "renderingContract": {
            "profileId": "storybook-local-contour-v1",
            "recipeId": "mgjrpg-02",
            "treatmentClass": "semantic-ui-cutout",
            "canaryReview": {
                "reviewId": "mgjrpg-02-canary-v01",
                "path": repo_path(canary_path),
                "sha256": sha256(canary_path),
            },
            "authoredContour": "material-local-color-aware",
            "extractionRole": "alpha-matte-only",
            "stickerCutline": "semantic-cream-only",
        },
        "promptEvidence": {
            "fidelity": "exact",
            "historyPath": repo_path(prompt_path),
            "assetNamedInHistory": True,
            "promptFile": {"path": repo_path(prompt_path), "sha256": prompt_hash},
            "outputIds": [],
            "notes": "No generated lettering is authoritative. The exact strings and deterministic local construction are preserved in the script and prompt record.",
        },
        "sources": [
            file_evidence(LOGO_PATH, "pending-human deterministic exact-lettering logo master", "Locally typeset and composited source-only candidate."),
            file_evidence(font_file, "OFL glyph-geometry source", "Fredoka SemiBold supplies exact glyph geometry; local licence and provenance are preserved."),
            file_evidence(logo_concept, "human-approved composition-and-material starting-point reference only", "Batch 21 source pixels, generated lettering, yellow route line, and checkerboard are not reused or approved."),
        ],
        "derivatives": [],
        "geometry": {
            "class": "brand-wordmark",
            "pivot": [0.5, 0.5],
            "visibleBounds": [0.05, 0.05, 0.9, 0.9],
            "safeInset": [0.05, 0.05, 0.05, 0.05],
        },
        "build": {
            "sourcePath": repo_path(LOGO_PATH),
            "operation": "cutout-resize",
            "profiles": [
                {
                    "id": "source-review-logo",
                    "outputPath": "artifacts/art-proofs/mgjrpg-02/plan03-r1-review/assets/logo-candidate-a.png",
                    "width": Image.open(PROOF_ASSETS / "logo-candidate-a.png").width,
                    "height": Image.open(PROOF_ASSETS / "logo-candidate-a.png").height,
                    "format": "png",
                    "encoder": {"options": {"compress_level": 9, "optimize": False}},
                }
            ],
            "backgroundExtraction": {"mode": "native-alpha"},
        },
        "humanEdits": [
            {
                "kind": "deterministic-exact-lettering-and-material-construction",
                "description": "Fredoka SemiBold glyph masks, exact project title strings, broad cel-value gradients, metallic rim, restrained iridescent bands, pearlescent highlights, colour-aware contours, cream cutline, and dimensional lower planes are composed locally. No generated glyph pixels are used.",
                "script": "scripts/art_pipeline/mgjrpg02_plan03_r1_review.py",
            }
        ],
        "knownUnknowns": [
            "Human source approval, responsive brand lockups, runtime delivery profiles, platform derivatives, and performance allocation are pending.",
        ],
        "rights": {
            "originClaim": "Project-authored deterministic lettering and material construction using the SIL-OFL-licensed Fredoka glyph geometry; Batch 21 is composition/material reference only.",
            "licenceStatus": "pending-owner-review",
            "notes": "Font licence and upstream provenance are retained under docs/source-assets/fonts/fredoka. Plan 11 remains final branding owner.",
        },
        "rollback": {
            "method": "No runtime logo pointer exists. Remove the unapproved v02 source record and candidate to return to the accepted Plan 03 anchor; retain the historical Batch 21 concept unchanged."
        },
    }
    json_write(ROOT / "docs/source-assets/records/game-logo-mgjrpg02-v02-source.json", logo_record)

    run_record = {
        "schema": "maze-art-generation-batch/v1",
        "batchId": "mgjrpg-02-batch-23-plan03-r1-premium-ui-logo",
        "revision": 1,
        "status": "pending-human-review",
        "recordedOn": "2026-09-04",
        "purpose": "Record exact forward front-door selections, create one deterministic exact-lettering logo refinement, and generate a fresh premium seven-icon semantic utility family for a bounded Human review gate without runtime publication.",
        "rollbackAnchor": "28946cbb04f45cb21cd51626914267ff4f71c375",
        "promptFile": {
            "path": repo_path(prompt_path),
            "fidelity": "exact-shared-block-plus-exact-subject-block",
            "sha256": prompt_hash,
            "bytes": prompt_path.stat().st_size,
        },
        "decisionEvidence": {
            "path": repo_path(approved_reference_decision_path),
            "scope": "approved mgjrpg-02 runtime and Batch 22 reference authority",
            "sha256": sha256(approved_reference_decision_path),
            "bytes": approved_reference_decision_path.stat().st_size,
        },
        "forwardDecisionEvidence": {
            "path": repo_path(decision_path),
            "scope": "front-door selections and logo starting direction",
            "sha256": sha256(decision_path),
            "bytes": decision_path.stat().st_size,
        },
        "generator": {
            "provider": "OpenAI",
            "interface": "Codex built-in image generation capability",
            "model": "not exposed by the tool response",
            "seed": "not exposed by the tool response",
        },
        "lineagePolicy": {
            "freshCanvas": True,
            "editOfEdit": "forbidden",
            "currentIcons": "semantic and silhouette comparison only",
            "batch22": "approved material and optical authority",
            "checkerboardAttempts": "rejected provenance only",
            "logo": "exact deterministic local lettering; Batch 21 composition/material starting point only",
        },
        "recipeEvidence": {
            "recipeId": "mgjrpg-02",
            "revision": 4,
            "path": repo_path(recipe_path),
            "sha256": sha256(recipe_path),
            "bytes": recipe_path.stat().st_size,
        },
        "nativeCanvasException": {
            "appliesToEveryOutput": True,
            "actual": "Every ImageGen utility original is a 1254x1254 opaque RGB PNG. Seven selected review sources use a uniform chroma-green matte; four rejected alpha attempts instead painted an opaque checkerboard.",
            "canonicalPolicy": "Immutable originals remain native. Only ignored review proofs are extracted before Human approval; versioned runtime derivatives require a later publication gate.",
            "exception": "Source canvases are not runtime delivery canvases and are never converted or resized in place.",
        },
        "referenceRegistry": reference_registry,
        "runs": batch_run_rows,
        "logoConstruction": {
            "output": file_evidence(LOGO_PATH, "pending-human deterministic logo master", "Exact local lettering and deterministic material masks."),
            "font": file_evidence(font_file, "OFL glyph geometry", "SemiBold named variation; licence retained."),
            "script": "scripts/art_pipeline/mgjrpg02_plan03_r1_review.py",
            "text": "Maze so Puzzle",
            "routeLinePresent": False,
        },
        "runtimeImpact": {
            "runtimeAssetWrites": 0,
            "cataloguePointerChanges": 0,
            "runtimeEncodedByteDelta": 0,
            "runtimeDecodedByteDelta": 0,
        },
        "review": {
            "page": report["reviewPage"],
            "recommendation": "Logo Candidate A plus the complete seven-icon R1 Candidate A family",
            "silenceRule": "Silence is not approval.",
            "publicationAuthorized": False,
        },
        "reviewProtocol": {
            "batchProofStatus": "awaiting Human Plan 03-R1 logo and utility-family review",
            "decisionRule": "Human reviews exact logo wording/material balance and the complete seven-icon family at source comparison and 64/48/32/24/16 intrinsic sizes before any publication.",
            "silenceRule": "Silence is not approval.",
            "candidateBoundary": "Source approval does not create runtime files, change catalogue pointers, generate platform icons, retire current assets, or allocate performance bytes.",
        },
        "rights": {
            "originClaim": "Generated or deterministically constructed for Maze so Puzzle from exact prompts and internal approved or semantic-only references; no named franchise, character, logo, living artist, proprietary palette, UI layout, or composition was requested.",
            "licenceStatus": "pending-owner-review",
            "releaseStatus": "not-approved",
        },
        "rollback": {
            "method": "Keep all current runtime files and catalogue pointers. Remove only unapproved Batch 23 source records/candidates and ignored proofs to return to the accepted Plan 03 anchor.",
            "runtimeRollbackRequired": False,
        },
        "counts": {
            "runCount": len(batch_run_rows),
            "rejectedBackgroundInvalidCount": 4,
            "pendingHumanCandidateCount": 7,
            "humanApprovedSourceCount": 0,
            "humanRejectedSourceCount": 0,
            "artDirectorRejectedSourceCount": 0,
            "generatorOriginalEncodedBytes": sum(int(row["output"]["bytes"]) for row in batch_run_rows),
            "generatorOriginalDecodedBytesUpperBound": sum(int(row["output"]["decodedBytesUpperBound"]) for row in batch_run_rows),
        },
    }
    json_write(BATCH / "run-record.json", run_record)

    proposed.extend(
        [
            {
                "stableId": "title-background",
                "consumer": "ASSETS.titleBackground",
                "currentRuntimePath": "public/assets/title-background-v1.webp",
                "candidateSource": FRONT_DOOR[0]["path"],
                "proposedRuntimePath": "public/assets/mgjrpg-02/brand/title-background-v02-front-door-1920-r01.webp",
                "status": "human-source-selected-publication-deferred",
                "requiresNamedFeatureAllocation": True,
            },
            {
                "stableId": "home-hero-splash",
                "consumer": "planned Plan 01 home surface",
                "currentRuntimePath": None,
                "candidateSource": FRONT_DOOR[1]["path"],
                "proposedRuntimePath": "public/assets/mgjrpg-02/brand/home-hero-splash-v01-front-door-r01.webp",
                "status": "human-source-selected-publication-deferred",
                "requiresNamedFeatureAllocation": True,
            },
            {
                "stableId": "title-environment-layer",
                "consumer": "planned layerable Plan 11 front-door composition",
                "currentRuntimePath": None,
                "candidateSource": FRONT_DOOR[2]["path"],
                "proposedRuntimePath": "public/assets/mgjrpg-02/brand/title-environment-v01-front-door-r01.webp",
                "status": "human-source-selected-publication-deferred",
                "requiresNamedFeatureAllocation": True,
            },
            {
                "stableId": "app-icon-ame",
                "consumer": "Plan 11 platform branding",
                "currentRuntimePath": None,
                "candidateSource": FRONT_DOOR[3]["path"],
                "proposedRuntimePath": None,
                "status": "human-source-selected-platform-derivatives-deferred",
                "requiresNamedFeatureAllocation": True,
            },
            {
                "stableId": "game-logo",
                "consumer": "planned Plan 11 front-door brand lockup",
                "currentRuntimePath": None,
                "candidateSource": repo_path(LOGO_PATH),
                "proposedRuntimePath": "public/assets/mgjrpg-02/brand/game-logo-v02-front-door-r01.webp",
                "status": "pending-human-source-review-no-file-created",
                "requiresNamedFeatureAllocation": True,
            },
        ]
    )
    publication_map = {
        "schema": "maze-art-proposed-publication-map/v1",
        "mapId": "plan03-r1-premium-ui-front-door-proposed-v01",
        "generatedOn": "2026-09-04",
        "status": "proposal-only-no-runtime-files-or-pointer-changes",
        "performanceHeadroom": "zero; every non-zero publication delta requires a measured named feature allocation",
        "entries": proposed,
        "rollbackPolicy": "Version every derivative, retain every current path and hash, and do not delete or move superseded assets before the Plan 12 copy-first archive/external-backup gate.",
    }
    json_write(BATCH / "proposed-publication-map.json", publication_map)


def build() -> dict[str, object]:
    BATCH.mkdir(parents=True, exist_ok=True)
    PROOF_ASSETS.mkdir(parents=True, exist_ok=True)
    logo = build_logo()
    with Image.open(LOGO_PATH) as opened:
        opened.load()
        logo_preview = opened.copy()
    logo_preview.thumbnail((1200, 800), Image.Resampling.LANCZOS)
    logo_preview.save(PROOF_ASSETS / "logo-candidate-a.png", "PNG", compress_level=9)

    icon_reports: list[dict[str, object]] = []
    for icon in ICONS:
        source_path = BATCH / icon["source"]
        extracted, extraction = extract_icon(source_path)
        candidate, processing = register_icon(extracted, 512)
        processing = {**extraction, **processing}
        candidate_path = PROOF_ASSETS / f"{icon['id']}-candidate-512.png"
        save_image(candidate, candidate_path, "png", {"compress_level": 9, "optimize": False})
        current_path = ROOT / icon["current"]
        with Image.open(current_path) as opened:
            opened.load()
            current = opened.convert("RGBA")
        current_path_copy = PROOF_ASSETS / f"{icon['id']}-current.png"
        save_image(current, current_path_copy, "png", {"compress_level": 9, "optimize": False})
        optical: dict[str, object] = {}
        for size in SIZES:
            actual, _ = register_icon(extracted, size)
            actual_path = PROOF_ASSETS / f"{icon['id']}-candidate-{size}.png"
            save_image(actual, actual_path, "png", {"compress_level": 9, "optimize": False})
            optical[str(size)] = image_fact(actual_path)
        icon_reports.append(
            {
                **icon,
                "runId": f"batch-23-{icon['id']}-premium-utility",
                "sourcePath": repo_path(source_path),
                "sourceSha256": sha256(source_path),
                "sourceBytes": source_path.stat().st_size,
                "sourceDimensions": list(Image.open(source_path).size),
                "candidate512": image_fact(candidate_path),
                "currentProof": image_fact(current_path_copy),
                "optical": optical,
                "processing": processing,
            }
        )
    front_door = copy_front_door_thumbnails()
    build_html(front_door, logo)
    source_bytes = sum(int(row["sourceBytes"]) for row in icon_reports) + int(logo["bytes"])
    decoded = sum(
        int(row["sourceDimensions"][0]) * int(row["sourceDimensions"][1]) * 4
        for row in icon_reports
    ) + int(logo["width"]) * int(logo["height"]) * 4
    report = {
        "schema": "maze-plan03-r1-source-review/v1",
        "generatedOn": "2026-09-04",
        "rollbackAnchor": "28946cbb04f45cb21cd51626914267ff4f71c375",
        "scope": "source-only; no runtime/public/catalogue publication",
        "frontDoorSelections": front_door,
        "recommendedLogo": logo,
        "recommendedIconFamily": icon_reports,
        "counts": {
            "icons": len(icon_reports),
            "logoCandidates": 1,
            "frontDoorSelections": len(front_door),
            "candidateSourceEncodedBytes": source_bytes,
            "candidateSourceDecodedBytesUpperBound": decoded,
            "runtimeEncodedByteDelta": 0,
            "runtimeDecodedByteDelta": 0,
        },
        "reviewPage": repo_path(PROOF / "index.html"),
        "policy": {
            "currentPointersChanged": False,
            "publicAssetsChanged": False,
            "runtimeDerivativesGenerated": False,
            "platformIconsGenerated": False,
            "massPublicationAuthorized": False,
        },
    }
    report_path = BATCH / "source-review-measurements.json"
    json_write(report_path, report)
    build_source_metadata(report)
    return report


if __name__ == "__main__":
    print(json.dumps(build()["counts"], indent=2))
