"""Build review-only derivatives for the mgjrpg-02 achievement sticker batch.

The immutable ImageGen outputs stay under ``docs/source-assets``.  This module
only makes deterministic transparent PNGs and a small proof packet; it never
writes runtime assets or changes catalogue pointers.
"""

from __future__ import annotations

import hashlib
import html
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps

from cutout import alpha_component_sizes, prepare_cutout
from encode import save_image
from mgjrpg02_batch01 import (
    estimate_uniform_matte,
    extract_uniform_matte,
    normalize_visible_black,
)


ROOT = Path(__file__).resolve().parents[2]
SOURCE_DIR = (
    ROOT
    / "docs"
    / "source-assets"
    / "production"
    / "mgjrpg-02"
    / "batch-22-achievement-stickers"
)
PROOF_DIR = (
    ROOT
    / "artifacts"
    / "art-proofs"
    / "mgjrpg-02"
    / "achievement-stickers-v02"
)

MASTER_SIZE = 512
DELIVERY_SIZES = (91, 64, 52, 48, 32)
REGISTRATION = {
    "targetBox": (0.08, 0.08, 0.92, 0.92),
    "align": (0.5, 0.5),
    "alphaThreshold": 3,
}

ASSETS: tuple[dict[str, str], ...] = (
    {
        "id": "first-star",
        "kind": "Sticker",
        "label": "My First Maze",
        "file": "reward-trail-sticker-v03-candidate-a-matte-01-generator-original.png",
    },
    {
        "id": "animal-friend",
        "kind": "Sticker",
        "label": "Animal Friend",
        "file": "reward-animal-friend-sticker-v03-candidate-b-matte-01-generator-original.png",
    },
    {
        "id": "surprise-sparkle",
        "kind": "Sticker",
        "label": "Surprise Explorer",
        "file": "reward-surprise-sparkle-sticker-v03-candidate-a-matte-01-generator-original.png",
    },
    {
        "id": "perfect-rescue-5",
        "kind": "Medal",
        "label": "Helping Paw Medal",
        "file": "reward-helping-paw-medal-v03-candidate-a-matte-01-generator-original.png",
    },
    {
        "id": "perfect-rescue-10",
        "kind": "Medal",
        "label": "Rainbow Rescue Medal",
        "file": "reward-rainbow-rescue-medal-v03-candidate-a-matte-01-generator-original.png",
    },
    {
        "id": "perfect-rescue-15",
        "kind": "Medal",
        "label": "Golden Guardian Medal",
        "file": "reward-golden-guardian-medal-v03-candidate-b-matte-01-generator-original.png",
    },
    {
        "id": "maze-explorer-5",
        "kind": "Badge",
        "label": "Pathfinder Patch",
        "file": "badge-pathfinder-v02-candidate-a-matte-01-generator-original.png",
    },
    {
        "id": "maze-explorer-10",
        "kind": "Badge",
        "label": "Maze Mapper Badge",
        "file": "badge-maze-mapper-v02-candidate-a-matte-01-generator-original.png",
    },
    {
        "id": "maze-explorer-20",
        "kind": "Badge",
        "label": "Grand Explorer Badge",
        "file": "badge-grand-explorer-v02-candidate-a-matte-01-generator-original.png",
    },
    {
        "id": "surprise-explorer-3",
        "kind": "Badge",
        "label": "Surprise Scout",
        "file": "badge-surprise-scout-v02-candidate-a-matte-01-generator-original.png",
    },
    {
        "id": "mighty-adventurer",
        "kind": "Badge",
        "label": "Mighty Adventurer",
        "file": "badge-mighty-adventurer-v02-candidate-a-matte-01-generator-original.png",
    },
    {
        "id": "twinkle-toes",
        "kind": "Badge",
        "label": "Twinkle Toes",
        "file": "badge-twinkle-toes-v02-candidate-a-matte-01-generator-original.png",
    },
    {
        "id": "bunny-buddy-10",
        "kind": "Badge",
        "label": "Bunny Buddy",
        "file": "badge-bunny-buddy-v02-candidate-a-matte-01-generator-original.png",
    },
    {
        "id": "fox-friend-10",
        "kind": "Badge",
        "label": "Fox Friend",
        "file": "badge-fox-friend-v02-candidate-a-matte-01-generator-original.png",
    },
    {
        "id": "kitten-pal-10",
        "kind": "Badge",
        "label": "Kitten Pal",
        "file": "badge-kitten-pal-v02-candidate-a-matte-01-generator-original.png",
    },
)


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _font(size: int) -> ImageFont.ImageFont:
    return ImageFont.load_default(size=size)


def prepare_candidate(
    path: Path, size: int = MASTER_SIZE
) -> tuple[Image.Image, dict[str, object]]:
    with Image.open(path) as source:
        source.load()
        if source.size != (1254, 1254) or source.mode not in {"RGB", "RGBA"}:
            raise ValueError(
                f"{path.name}: expected a 1254x1254 RGB/RGBA generator original, "
                f"got {source.size} {source.mode}"
            )
        matte = estimate_uniform_matte(source)
        extracted, extraction = extract_uniform_matte(
            source,
            matte["rgb"],
            clear_distance=48.0,
            opaque_distance=144.0,
            minimum_component_pixels=64,
        )
        prepared = prepare_cutout(
            extracted,
            (size, size),
            extraction_mode="native-alpha",
            clear_alpha_below=3,
            edge_dilation_pixels=4,
            minimum_alpha_component_pixels=32,
            registration=REGISTRATION,
        )
        prepared, black_after_resize = normalize_visible_black(prepared)
        return prepared, {
            "estimatedMatte": matte,
            "extraction": extraction,
            "exactBlackVisiblePixelsNormalizedAfterResize": black_after_resize,
        }


def prepare_optical(candidate: Image.Image, size: int) -> Image.Image:
    """Create one clean optical proof without inventing new painted pixels."""

    optical = prepare_cutout(
        candidate,
        (size, size),
        extraction_mode="native-alpha",
        clear_alpha_below=3,
        edge_dilation_pixels=2,
        minimum_alpha_component_pixels=32,
        registration={
            "targetBox": (0.06, 0.06, 0.94, 0.94),
            "align": (0.5, 0.5),
            "alphaThreshold": 3,
        },
    )
    optical, _ = normalize_visible_black(optical)
    return optical


def optical_facts(path: Path, optical: Image.Image) -> dict[str, object]:
    alpha = np.asarray(optical.getchannel("A"), dtype=np.uint8)
    ys, xs = np.nonzero(alpha >= 3)
    if not len(xs):
        raise ValueError(f"{path.name}: optical derivative is empty")
    gutter = min(
        int(xs.min()),
        int(ys.min()),
        int(optical.width - 1 - xs.max()),
        int(optical.height - 1 - ys.max()),
    )
    if gutter < 1:
        raise ValueError(f"{path.name}: optical derivative has no safe edge")
    components = alpha_component_sizes(optical, alpha_threshold=3)
    if len(components) != 1:
        raise ValueError(f"{path.name}: optical derivative has {len(components)} components")
    pixels = np.asarray(optical, dtype=np.uint8)
    visible_black = int(
        np.count_nonzero((alpha >= 3) & np.all(pixels[:, :, :3] == 0, axis=2))
    )
    if visible_black:
        raise ValueError(f"{path.name}: optical derivative contains exact black")
    return {
        "path": path.resolve().relative_to(PROOF_DIR).as_posix(),
        "sha256": _sha256(path),
        "bytes": path.stat().st_size,
        "width": optical.width,
        "height": optical.height,
        "transparentGutterPixels": gutter,
        "visibleAlphaComponents": len(components),
        "exactBlackVisiblePixels": visible_black,
    }


def candidate_facts(
    source_path: Path,
    candidate: Image.Image,
    extraction_facts: dict[str, object],
) -> dict[str, object]:
    alpha = np.asarray(candidate.getchannel("A"), dtype=np.uint8)
    ys, xs = np.nonzero(alpha >= 3)
    if not len(xs):
        raise ValueError(f"{source_path.name}: extraction produced no visible pixels")
    gutter = min(
        int(xs.min()),
        int(ys.min()),
        int(candidate.width - 1 - xs.max()),
        int(candidate.height - 1 - ys.max()),
    )
    if gutter < 4:
        raise ValueError(f"{source_path.name}: transparent gutter is only {gutter}px")
    components = alpha_component_sizes(candidate, alpha_threshold=3)
    if not components or (len(components) > 1 and components[1] >= 8):
        raise ValueError(
            f"{source_path.name}: expected one connected sticker silhouette; got {components[:6]}"
        )
    with Image.open(source_path) as source:
        width, height = source.size
        mode = source.mode
    pixels = np.asarray(candidate, dtype=np.uint8)
    visible = pixels[:, :, 3] >= 3
    visible_black = int(
        np.count_nonzero(visible & np.all(pixels[:, :, :3] == 0, axis=2))
    )
    matte_record = extraction_facts["estimatedMatte"]
    if not isinstance(matte_record, dict):
        raise TypeError("estimatedMatte must be a measurement object")
    matte_rgb = np.asarray(matte_record["rgb"], dtype=np.float32)
    matte_distance = np.linalg.norm(
        pixels[:, :, :3].astype(np.float32) - matte_rgb[None, None, :], axis=2
    )
    visible_matte_like = int(np.count_nonzero(visible & (matte_distance <= 24.0)))
    if visible_black:
        raise ValueError(f"{source_path.name}: {visible_black} exact-black visible pixels remain")
    if visible_matte_like:
        raise ValueError(
            f"{source_path.name}: {visible_matte_like} matte-like visible pixels remain"
        )
    return {
        "sourcePath": source_path.resolve().relative_to(ROOT).as_posix(),
        "sourceSha256": _sha256(source_path),
        "sourceBytes": source_path.stat().st_size,
        "sourceWidth": width,
        "sourceHeight": height,
        "sourceMode": mode,
        "sourceDecodedBytesUpperBound": width * height * 4,
        "alphaBounds512LTRBExclusive": [
            int(xs.min()),
            int(ys.min()),
            int(xs.max()) + 1,
            int(ys.max()) + 1,
        ],
        "visibleAlphaComponents": len(components),
        "largestAlphaComponentPixels": int(components[0]),
        "transparentGutterPixels": gutter,
        "exactBlackVisiblePixels": visible_black,
        "visibleMatteLikePixelsWithin24": visible_matte_like,
        **extraction_facts,
    }


def _actual_size_sheet(deliveries: dict[str, dict[int, Image.Image]]) -> Image.Image:
    row_height = 108
    sheet = Image.new("RGBA", (1120, 72 + len(ASSETS) * row_height), (255, 250, 240, 255))
    draw = ImageDraw.Draw(sheet)
    draw.text((20, 16), "Achievement stickers — exact optical-size QA", font=_font(24), fill=(52, 32, 63, 255))
    draw.text((20, 47), "91 / 64 / 52 / 48 / 32 px, plus 52 px dark-field and locked-state QA", font=_font(15), fill=(105, 77, 111, 255))
    x_positions = {91: 440, 64: 560, 52: 660, 48: 748, 32: 824}
    for index, asset in enumerate(ASSETS):
        y = 72 + index * row_height
        fill = (247, 241, 250, 255) if index % 2 == 0 else (252, 247, 236, 255)
        draw.rounded_rectangle((12, y + 4, 1108, y + row_height - 4), radius=16, fill=fill)
        draw.text((28, y + 24), str(asset["label"]), font=_font(19), fill=(52, 32, 63, 255))
        draw.text((28, y + 54), f'{asset["kind"]} · {asset["id"]}', font=_font(13), fill=(105, 77, 111, 255))
        rows = deliveries[str(asset["id"])]
        for size in DELIVERY_SIZES:
            image = rows[size]
            sheet.alpha_composite(image, (x_positions[size] - size // 2, y + (row_height - size) // 2))
            draw.text((x_positions[size] - 12, y + row_height - 20), str(size), font=_font(11), fill=(80, 57, 88, 255))
        dark_tile = Image.new("RGBA", (68, 68), (45, 32, 56, 255))
        dark_tile.alpha_composite(rows[52], (8, 8))
        sheet.alpha_composite(dark_tile, (870, y + 20))
        draw.text((880, y + row_height - 20), "dark", font=_font(11), fill=(80, 57, 88, 255))
        locked = ImageOps.grayscale(rows[52].convert("RGB")).convert("RGBA")
        locked.putalpha(rows[52].getchannel("A").point(lambda value: round(value * 0.3)))
        sheet.alpha_composite(locked, (1004, y + (row_height - 52) // 2))
        draw.text((1012, y + row_height - 20), "lock", font=_font(11), fill=(80, 57, 88, 255))
    return sheet


def _html_document(rows: list[dict[str, object]]) -> str:
    cards = []
    for row in rows:
        label = html.escape(str(row["label"]))
        kind = html.escape(str(row["kind"]))
        asset_id = html.escape(str(row["id"]))
        derivative = html.escape(str(row["derivative512"]), quote=True)
        source = html.escape(str(row["sourceRelativeToPacket"]), quote=True)
        cards.append(
            f'<article><a class="art" href="{derivative}"><img src="{derivative}" '
            f'width="112" height="112" alt="{label}"></a><strong>{label}</strong>'
            f'<span>{kind} · {asset_id}</span><a class="source" href="{source}">source master</a></article>'
        )
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>mgjrpg-02 achievement stickers — Batch 22</title><style>
:root{{--paper:#fffaf0;--ink:#34203f;--muted:#725f78;--lav:#f2ebf7;--mint:#dff6ec}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--paper);color:var(--ink);font:15px/1.4 system-ui,sans-serif}}
main{{max-width:1180px;margin:auto;padding:24px}}h1{{margin:0 0 6px}}p{{margin:6px 0 20px;color:var(--muted)}}
.grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px}}
article{{display:grid;justify-items:center;gap:5px;padding:14px;border:1px solid #d9c9dd;border-radius:18px;background:linear-gradient(145deg,#fff,#f5eff8)}}
.art{{display:grid;place-items:center;width:132px;height:132px;border-radius:16px;background:linear-gradient(135deg,#fff9e9,#e9f8f1)}}
img{{display:block;object-fit:contain}}strong{{font-size:16px;text-align:center}}span{{font-size:12px;color:var(--muted);text-align:center}}
.source{{font-size:11px;color:#7651a0}}.proof{{margin-top:22px;padding:14px;border-radius:14px;background:var(--mint)}}
</style></head><body><main><h1>Adventure Book achievement stickers</h1>
<p>Batch 22 · fresh mgjrpg-02 masters · pending Human review · 112 px review scale</p>
<section class="grid">{''.join(cards)}</section>
<p class="proof"><a href="achievement-stickers-actual-size.png">Open exact 91/64/52/48/32 px and locked-state QA sheet</a> · <a href="proof-report.json">technical report</a></p>
</main></body></html>"""


def build_proofs() -> dict[str, object]:
    PROOF_DIR.mkdir(parents=True, exist_ok=True)
    derivative_dir = PROOF_DIR / "derivatives"
    derivative_dir.mkdir(parents=True, exist_ok=True)
    rows: list[dict[str, object]] = []
    deliveries: dict[str, dict[int, Image.Image]] = {}

    for asset in ASSETS:
        source_path = SOURCE_DIR / asset["file"]
        if not source_path.is_file():
            raise FileNotFoundError(source_path)
        candidate, extraction_facts = prepare_candidate(source_path)
        facts = candidate_facts(source_path, candidate, extraction_facts)
        stem = source_path.stem.removesuffix("-generator-original")
        derivative_path = derivative_dir / f"{stem}-transparent-512.png"
        save_image(candidate, derivative_path, "png", {"compress_level": 9, "optimize": False})
        rows_for_asset = {size: prepare_optical(candidate, size) for size in DELIVERY_SIZES}
        optical_dir = derivative_dir / "optical"
        optical_dir.mkdir(parents=True, exist_ok=True)
        optical_rows: list[dict[str, object]] = []
        for size, optical in rows_for_asset.items():
            optical_path = optical_dir / f"{stem}-{size}.png"
            save_image(
                optical,
                optical_path,
                "png",
                {"compress_level": 9, "optimize": False},
            )
            optical_rows.append(optical_facts(optical_path, optical))
        deliveries[str(asset["id"])] = rows_for_asset
        rows.append(
            {
                **asset,
                **facts,
                "derivative512": f"derivatives/{derivative_path.name}",
                "derivativeSha256": _sha256(derivative_path),
                "derivativeBytes": derivative_path.stat().st_size,
                "opticalDerivatives": optical_rows,
                "sourceRelativeToPacket": Path("../../../..", facts["sourcePath"]).as_posix(),
            }
        )

    actual_path = PROOF_DIR / "achievement-stickers-actual-size.png"
    save_image(
        _actual_size_sheet(deliveries),
        actual_path,
        "png",
        {"compress_level": 9, "optimize": False},
    )
    report: dict[str, object] = {
        "schema": "maze-art-achievement-sticker-proof/v1",
        "batchId": "mgjrpg-02-batch-22-achievement-stickers",
        "status": "pending-human-review",
        "runtimeImpact": {
            "runtimeFilesChanged": 0,
            "cataloguePointersChanged": 0,
            "encodedByteDelta": 0,
            "decodedByteDelta": 0,
        },
        "cutout": {
            "mode": "uniform-impossible-matte-alpha-unblend",
            "matteRgb": "estimated independently from each source's four corners",
            "clearDistance": 48.0,
            "opaqueDistance": 144.0,
            "registration": REGISTRATION,
            "derivativeSize": MASTER_SIZE,
            "deliverySizes": list(DELIVERY_SIZES),
        },
        "sources": rows,
        "sourceTotals": {
            "count": len(rows),
            "encodedBytes": sum(int(row["sourceBytes"]) for row in rows),
            "decodedBytesUpperBound": sum(
                int(row["sourceDecodedBytesUpperBound"]) for row in rows
            ),
        },
        "proofs": {
            "actualSize": actual_path.name,
            "actualSizeSha256": _sha256(actual_path),
            "actualSizeBytes": actual_path.stat().st_size,
        },
    }
    report_path = PROOF_DIR / "proof-report.json"
    report_path.write_text(
        json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )
    (PROOF_DIR / "index.html").write_text(_html_document(rows), encoding="utf-8")
    return report


if __name__ == "__main__":
    result = build_proofs()
    print(
        f'Built {result["sourceTotals"]["count"]} review candidates at '
        f'{PROOF_DIR.relative_to(ROOT).as_posix()}'
    )
