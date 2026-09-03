"""Deterministic source-matte processing for the ``mgjrpg-02`` Batch 01 review.

This module deliberately has one small job: turn immutable ImageGen originals
authored against a deliberately impossible flat matte into review derivatives.
It does not publish runtime files, update catalogues, or confer approval.

The source originals live under ``docs/source-assets``.  Every generated file
lands in the ignored ``artifacts/art-proofs`` tree and is therefore disposable
and reproducible from the source originals plus this code.
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable

import numpy as np
from PIL import Image, ImageFilter

from cutout import (
    dilate_hidden_rgb,
    normalize_to_srgb_rgba,
    register_cutout,
    remove_small_alpha_components,
)
from encode import encoder_environment, save_image


ROOT = Path(__file__).resolve().parents[2]
SOURCE_ROOT = ROOT / "docs/source-assets/production/mgjrpg-02/batch-01"
OUTPUT_ROOT = ROOT / "artifacts/art-proofs/mgjrpg-02/batches/batch-01"
INK_RGB = (0x34, 0x20, 0x3F)
REPORT_SCHEMA = "maze-art-mgjrpg02-batch-proof/v1"
MATTE_RECIPE_ID = "flat-impossible-matte-alpha-unblend-v1"


@dataclass(frozen=True)
class BatchAsset:
    asset_id: str
    label: str
    source_name: str
    target_box: tuple[float, float, float, float]
    align: tuple[float, float] = (0.5, 1.0)


BATCH_ASSETS: tuple[BatchAsset, ...] = (
    BatchAsset(
        "ame-static-v02-b-led-01",
        "Ame — static v02 B-led 01",
        "ame-static-v02-b-led-01-matte-02-generator-original.png",
        (0.12, 0.06, 0.88, 0.94),
    ),
    BatchAsset(
        "portal-rose-heart-v02",
        "Rose Heart teleporter v02",
        "portal-rose-heart-v02-matte-02-generator-original.png",
        (0.05, 0.08, 0.95, 0.92),
        (0.5, 0.5),
    ),
    BatchAsset(
        "enemy-tea-time-skeleton-v01",
        "Green-tea skeleton",
        "enemy-tea-time-skeleton-v01-matte-02-generator-original.png",
        (0.10, 0.06, 0.90, 0.94),
    ),
    BatchAsset(
        "enemy-classic-slime-v01",
        "Traditional JRPG slime",
        "enemy-classic-slime-v01-matte-02-generator-original.png",
        (0.12, 0.16, 0.88, 0.91),
    ),
    BatchAsset(
        "enemy-lizard-sword-guard-v01",
        "Lizard guard — sword",
        "enemy-lizard-sword-guard-v01-matte-02-generator-original.png",
        (0.06, 0.06, 0.94, 0.94),
    ),
    BatchAsset(
        "enemy-lizard-spear-guard-v01",
        "Lizard guard — spear",
        "enemy-lizard-spear-guard-v01-matte-02-generator-original.png",
        (0.05, 0.05, 0.95, 0.94),
    ),
    BatchAsset(
        "enemy-wholesome-succubus-v01",
        "Wholesome succubus",
        "enemy-wholesome-succubus-v01-matte-02-generator-original.png",
        (0.09, 0.05, 0.91, 0.94),
    ),
    BatchAsset(
        "enemy-pocket-trex-v01",
        "Pocket T-Rex",
        "enemy-pocket-trex-v01-matte-02-generator-original.png",
        (0.06, 0.10, 0.94, 0.92),
    ),
    BatchAsset(
        "enemy-kappa-v01",
        "Kappa",
        "enemy-kappa-v01-matte-02-generator-original.png",
        (0.10, 0.08, 0.90, 0.94),
    ),
    BatchAsset(
        "enemy-treasure-mimic-v01",
        "Classic treasure mimic",
        "enemy-treasure-mimic-v01-matte-02-generator-original.png",
        (0.06, 0.12, 0.94, 0.90),
    ),
    BatchAsset(
        "enemy-soda-slime-v01",
        "Soda slime",
        "enemy-soda-slime-v01-matte-01-generator-original.png",
        (0.07, 0.17, 0.93, 0.90),
    ),
    BatchAsset(
        "enemy-kindly-cultist-v01",
        "Kindly cultist",
        "enemy-kindly-cultist-v01-matte-01-generator-original.png",
        (0.10, 0.05, 0.90, 0.95),
    ),
    BatchAsset(
        "enemy-lamia-v01",
        "Lamia",
        "enemy-lamia-v01-matte-01-generator-original.png",
        (0.06, 0.04, 0.94, 0.96),
    ),
    BatchAsset(
        "enemy-orc-chieftain-v01",
        "Orc chieftain",
        "enemy-orc-chieftain-v01-matte-01-generator-original.png",
        (0.08, 0.04, 0.92, 0.96),
    ),
    BatchAsset(
        "enemy-cyclops-v01",
        "Cyclops",
        "enemy-cyclops-v01-matte-01-generator-original.png",
        (0.08, 0.06, 0.92, 0.94),
    ),
    BatchAsset(
        "enemy-minotaur-v01",
        "Minotaur",
        "enemy-minotaur-v01-matte-01-generator-original.png",
        (0.04, 0.06, 0.96, 0.94),
    ),
    BatchAsset(
        "enemy-warrior-skeleton-v01",
        "Warrior skeleton",
        "enemy-warrior-skeleton-v01-matte-01-generator-original.png",
        (0.09, 0.05, 0.91, 0.95),
    ),
)


def _derived_label(asset_id: str) -> str:
    stem = re.sub(r"-v\d+$", "", asset_id)
    stem = re.sub(r"^(enemy|portal|item|friend|character)-", "", stem)
    return " ".join(part.upper() if part in {"jrpg", "trex"} else part.capitalize() for part in stem.split("-"))


def discover_batch_assets(source_root: Path) -> tuple[BatchAsset, ...]:
    """Return declared assets plus later matte originals in stable order.

    This keeps review assembly out of the generation critical path: an appended
    immutable ``*-matte-01-generator-original.png`` or ``*-matte-02-...`` is
    picked up automatically without conflating truthful generation attempts.
    If an unusual silhouette needs bespoke registration, an adjacent optional
    ``batch-inputs.json`` can override its label, target box, or alignment.
    """

    declared_assets = (
        BATCH_ASSETS if source_root.resolve() == SOURCE_ROOT.resolve() else ()
    )
    by_source = {asset.source_name: asset for asset in declared_assets}
    discovered_paths = {
        path.name: path
        for pattern in ("*-matte-01-generator-original.png", "*-matte-02-generator-original.png")
        for path in source_root.glob(pattern)
    }
    known_ids = {asset.asset_id: asset.source_name for asset in declared_assets}
    for path in (discovered_paths[name] for name in sorted(discovered_paths)):
        if path.name in by_source:
            continue
        asset_id = re.sub(r"-matte-(?:01|02)-generator-original\.png$", "", path.name)
        duplicate_source = known_ids.get(asset_id)
        if duplicate_source is not None:
            raise ValueError(
                f"duplicate Batch 01 asset id {asset_id!r}: {duplicate_source}, {path.name}"
            )
        by_source[path.name] = BatchAsset(
            asset_id,
            _derived_label(asset_id),
            path.name,
            (0.07, 0.06, 0.93, 0.94),
        )
        known_ids[asset_id] = path.name

    config_path = source_root / "batch-inputs.json"
    if config_path.is_file():
        config = json.loads(config_path.read_text(encoding="utf-8-sig"))
        if config.get("schema") != "maze-art-mgjrpg02-batch-inputs/v1":
            raise ValueError(f"unsupported Batch 01 input schema in {config_path}")
        for raw in config.get("overrides", []):
            source_name = str(raw["source"])
            current = by_source.get(source_name)
            if current is None:
                raise ValueError(f"batch-inputs override names an undiscovered source: {source_name}")
            target_box = tuple(float(value) for value in raw.get("targetBox", current.target_box))
            align = tuple(float(value) for value in raw.get("align", current.align))
            if len(target_box) != 4 or len(align) != 2:
                raise ValueError(f"invalid registration override for {source_name}")
            by_source[source_name] = BatchAsset(
                str(raw.get("id", current.asset_id)),
                str(raw.get("label", current.label)),
                source_name,
                target_box,  # type: ignore[arg-type]
                align,  # type: ignore[arg-type]
            )

    fixed_names = [asset.source_name for asset in declared_assets]
    extras = sorted(name for name in by_source if name not in fixed_names)
    return tuple(by_source[name] for name in (*fixed_names, *extras))


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _repo_relative(path: Path) -> str:
    return path.resolve().relative_to(ROOT.resolve()).as_posix()


def _corner_samples(rgb: np.ndarray) -> np.ndarray:
    height, width, _ = rgb.shape
    edge = max(16, min(height, width) // 20)
    return np.concatenate(
        (
            rgb[:edge, :edge].reshape(-1, 3),
            rgb[:edge, width - edge :].reshape(-1, 3),
            rgb[height - edge :, :edge].reshape(-1, 3),
            rgb[height - edge :, width - edge :].reshape(-1, 3),
        ),
        axis=0,
    )


def estimate_uniform_matte(source: Image.Image) -> dict[str, Any]:
    """Estimate the flat matte from four corners and fail on textured mattes.

    Generator PNGs can contain tiny quantisation variations even when visually
    flat.  The robust median supplies the matte colour; standard deviation and
    the 99th-percentile Euclidean residual make the acceptance contract explicit.
    """

    rgb = np.asarray(source.convert("RGB"), dtype=np.float32)
    corners = _corner_samples(rgb)
    median = np.median(corners, axis=0)
    channel_std = np.std(corners, axis=0)
    residual = np.linalg.norm(corners - median[None, :], axis=1)
    percentile_99 = float(np.percentile(residual, 99))
    maximum_channel_std = float(channel_std.max())
    if maximum_channel_std > 3.0 or percentile_99 > 12.0:
        raise ValueError(
            "matte corners are not uniform enough for deterministic extraction: "
            f"max channel std={maximum_channel_std:.3f}, p99 residual={percentile_99:.3f}"
        )
    return {
        "rgb": [int(round(value)) for value in median],
        "channelStd": [round(float(value), 4) for value in channel_std],
        "maximumChannelStd": round(maximum_channel_std, 4),
        "p99EuclideanResidual": round(percentile_99, 4),
        "cornerSamplePixels": int(corners.shape[0]),
    }


def _smoothstep(value: np.ndarray) -> np.ndarray:
    clipped = np.clip(value, 0.0, 1.0)
    return clipped * clipped * (3.0 - 2.0 * clipped)


def matte_key_spill_mask(
    observed: np.ndarray,
    matte_rgb: Iterable[int],
    *,
    dominance_threshold: float = 96.0,
) -> np.ndarray:
    """Find implausibly saturated pixels that still carry the matte's key axis.

    Distance alone cannot reject a generator's bright green background after it
    has picked up blue spill near a painted contour.  The Batch 01 mattes are
    intentionally impossible single- or dual-channel keys, so strong dominance
    on that same channel axis is background contamination.  Muted material
    colours do not approach the deliberately conservative 96-level threshold.
    """

    pixels = np.asarray(observed, dtype=np.float32)
    matte = np.asarray(tuple(int(value) for value in matte_rgb), dtype=np.float32)
    order = np.argsort(matte)
    low, middle, high = (int(value) for value in order)
    if matte[high] - matte[middle] > 80.0:
        # One-channel key, currently the intentionally impossible greens.
        others = [index for index in range(3) if index != high]
        excess = pixels[:, :, high] - np.maximum(
            pixels[:, :, others[0]], pixels[:, :, others[1]]
        )
    elif matte[middle] - matte[low] > 80.0:
        # Dual-channel key: magenta or cyan.
        excess = np.minimum(pixels[:, :, middle], pixels[:, :, high]) - pixels[:, :, low]
    else:
        raise ValueError(f"matte {tuple(int(value) for value in matte)} is not an impossible chroma key")
    return excess > float(dominance_threshold)


def extract_uniform_matte(
    source: Image.Image,
    matte_rgb: Iterable[int],
    *,
    clear_distance: float = 48.0,
    opaque_distance: float = 144.0,
    minimum_component_pixels: int = 1,
) -> tuple[Image.Image, dict[str, Any]]:
    """Unblend a high-chroma matte and return straight RGBA plus measurements.

    The matte-distance mask first establishes the subject.  An eroded subject
    core remains fully opaque; for its narrow boundary, nearby core colour is
    propagated and used to solve the compositing equation.  This avoids both a
    hard chroma-key edge and the common failure where an opaque interior colour
    merely similar to the matte becomes translucent.  The production default's
    measured matte/subject gap is wide enough to avoid component filtering; the
    parameter remains available for noisier test or future inputs.
    """

    if clear_distance < 0.0 or opaque_distance <= clear_distance:
        raise ValueError("opaque_distance must be greater than clear_distance")
    observed = np.asarray(source.convert("RGB"), dtype=np.float32)
    background = np.asarray(tuple(int(value) for value in matte_rgb), dtype=np.float32)
    if background.shape != (3,):
        raise ValueError("matte_rgb must contain exactly three channels")
    delta = observed - background[None, None, :]
    distance = np.linalg.norm(delta, axis=2)
    key_spill = matte_key_spill_mask(observed, background)
    hard_candidate = (distance > clear_distance) & ~key_spill
    hard_rgba = np.dstack(
        (
            observed.astype(np.uint8),
            np.where(hard_candidate, 255, 0).astype(np.uint8),
        )
    )
    cleaned_hard = remove_small_alpha_components(
        Image.fromarray(hard_rgba, "RGBA"),
        minimum_pixels=minimum_component_pixels,
        alpha_threshold=3,
    )
    visible = np.asarray(cleaned_hard.getchannel("A"), dtype=np.uint8) > 0

    visible_image = Image.fromarray(np.where(visible, 255, 0).astype(np.uint8), "L")
    # Four source pixels of edge are treated as the matte-composited transition.
    # At the 1254 px generator size this becomes roughly two master pixels and
    # less than one delivery pixel, while reaching past generated chroma spill.
    interior_image = visible_image.filter(ImageFilter.MinFilter(9))
    interior = np.asarray(interior_image, dtype=np.uint8) > 0
    donor_pixels = np.zeros((*visible.shape, 4), dtype=np.uint8)
    donor_pixels[:, :, :3][interior] = observed.astype(np.uint8)[interior]
    donor_pixels[:, :, 3][interior] = 255
    propagated = np.asarray(
        dilate_hidden_rgb(Image.fromarray(donor_pixels, "RGBA"), 8), dtype=np.uint8
    )[:, :, :3].astype(np.float32)
    donor_available = np.asarray(
        interior_image.filter(ImageFilter.MaxFilter(17)),
        dtype=np.uint8,
    ) > 0

    alpha = _smoothstep((distance - clear_distance) / (opaque_distance - clear_distance))
    alpha[~visible] = 0.0
    alpha[interior] = 1.0
    boundary_with_donor = visible & ~interior & donor_available
    donor_delta = propagated - background[None, None, :]
    denominator = np.sum(donor_delta * donor_delta, axis=2)
    solvable = boundary_with_donor & (denominator > 1.0)
    solved_alpha = np.zeros_like(alpha)
    solved_alpha[solvable] = np.sum(delta[solvable] * donor_delta[solvable], axis=1) / denominator[
        solvable
    ]
    alpha[solvable] = np.clip(solved_alpha[solvable], 2.0 / 255.0, 1.0)

    recovered = np.zeros_like(observed)
    visible = alpha > (2.0 / 255.0)
    recovered[visible] = (
        observed[visible] - (1.0 - alpha[visible, None]) * background[None, :]
    ) / alpha[visible, None]
    # Boundary RGB comes from the nearest confidently opaque local material.
    # Keeping the independently solved alpha while replacing chroma-key-mixed
    # RGB is what prevents neon green/magenta fringe on dark backgrounds.
    recovered[interior] = observed[interior]
    recovered[boundary_with_donor] = propagated[boundary_with_donor]
    fallback_boundary = visible & ~interior & ~donor_available
    # A detached one-pixel sparkle or hair whisker may have no eroded donor.
    # Keep its authored observed RGB instead of extrapolating the chroma key to
    # its complementary hue, which is visibly worse than a conservative edge.
    recovered[fallback_boundary] = observed[fallback_boundary]
    recovered = np.clip(np.rint(recovered), 0, 255).astype(np.uint8)
    alpha_u8 = np.clip(np.rint(alpha * 255.0), 0, 255).astype(np.uint8)
    alpha_u8[~visible] = 0

    exact_black_before = int(np.count_nonzero(visible & np.all(recovered == 0, axis=2)))
    recovered[visible & np.all(recovered == 0, axis=2)] = INK_RGB
    rgba = np.dstack((recovered, alpha_u8))
    extracted = Image.fromarray(rgba, "RGBA")
    extracted_pixels = np.asarray(extracted, dtype=np.uint8).copy()
    visible_after_cleanup = extracted_pixels[:, :, 3] > 0
    exact_black_after_cleanup = visible_after_cleanup & np.all(
        extracted_pixels[:, :, :3] == 0, axis=2
    )
    extracted_pixels[:, :, :3][exact_black_after_cleanup] = INK_RGB
    extracted = Image.fromarray(extracted_pixels, "RGBA")
    return extracted, {
        "clearDistance": clear_distance,
        "opaqueDistance": opaque_distance,
        "minimumComponentPixels": minimum_component_pixels,
        "keyDominanceThreshold": 96.0,
        "keySpillPixelsRejected": int(np.count_nonzero(key_spill & (distance > clear_distance))),
        "fallbackBoundaryPixels": int(np.count_nonzero(fallback_boundary)),
        "exactBlackVisiblePixelsNormalized": exact_black_before
        + int(np.count_nonzero(exact_black_after_cleanup)),
        "sourceDistancePercentiles": {
            str(percentile): round(float(np.percentile(distance, percentile)), 3)
            for percentile in (50, 90, 95, 99)
        },
    }


def normalize_visible_black(source: Image.Image) -> tuple[Image.Image, int]:
    pixels = np.asarray(normalize_to_srgb_rgba(source), dtype=np.uint8).copy()
    visible_black = (pixels[:, :, 3] > 0) & np.all(pixels[:, :, :3] == 0, axis=2)
    count = int(np.count_nonzero(visible_black))
    pixels[:, :, :3][visible_black] = INK_RGB
    return Image.fromarray(pixels, "RGBA"), count


def clear_low_alpha(source: Image.Image, threshold: int) -> Image.Image:
    """Clear numerically tiny resampling lobes at or below the threshold."""

    pixels = np.asarray(normalize_to_srgb_rgba(source), dtype=np.uint8).copy()
    pixels[:, :, 3][pixels[:, :, 3] <= int(threshold)] = 0
    return Image.fromarray(pixels, "RGBA")


def _visible_bounds(source: Image.Image, threshold: int = 2) -> list[int] | None:
    alpha = np.asarray(source.convert("RGBA").getchannel("A"), dtype=np.uint8)
    ys, xs = np.nonzero(alpha >= threshold)
    if not len(xs):
        return None
    return [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1]


def _transparent_gutter(source: Image.Image) -> dict[str, int | bool]:
    alpha = np.asarray(source.convert("RGBA").getchannel("A"), dtype=np.uint8)
    visible = alpha > 0
    ys, xs = np.nonzero(visible)
    if not len(xs):
        return {"minimumPixels": 0, "atLeastFourPixels": False}
    minimum = min(
        int(xs.min()),
        int(ys.min()),
        int(source.width - 1 - xs.max()),
        int(source.height - 1 - ys.max()),
    )
    return {"minimumPixels": minimum, "atLeastFourPixels": minimum >= 4}


def _image_fact(path: Path, matte_rgb: Iterable[int] | None = None) -> dict[str, Any]:
    with Image.open(path) as source:
        source.load()
        width, height = source.size
        mode = source.mode
        pixels = np.asarray(source.convert("RGBA"), dtype=np.uint8)
    visible_black = int(
        np.count_nonzero((pixels[:, :, 3] > 0) & np.all(pixels[:, :, :3] == 0, axis=2))
    )
    fact = {
        "path": _repo_relative(path),
        "sha256": _sha256(path),
        "bytes": path.stat().st_size,
        "width": width,
        "height": height,
        "mode": mode,
        "decodedBytesUpperBound": width * height * 4,
        "visibleBounds": _visible_bounds(Image.fromarray(pixels, "RGBA")),
        "transparentGutter": _transparent_gutter(Image.fromarray(pixels, "RGBA")),
        "exactBlackVisiblePixels": visible_black,
    }
    if matte_rgb is not None:
        matte = np.asarray(tuple(int(value) for value in matte_rgb), dtype=np.float32)
        distance = np.linalg.norm(pixels[:, :, :3].astype(np.float32) - matte[None, None, :], axis=2)
        visible = pixels[:, :, 3] > 0
        fact["alphaQuality"] = {
            "semiTransparentPixels": int(np.count_nonzero(visible & (pixels[:, :, 3] < 255))),
            "visibleMatteLikePixelsWithin24": int(np.count_nonzero(visible & (distance <= 24.0))),
            "hiddenExactMattePixels": int(
                np.count_nonzero((pixels[:, :, 3] == 0) & np.all(pixels[:, :, :3] == matte, axis=2))
            ),
        }
    return fact


def _write_html(destination: Path, rows: list[dict[str, Any]], batch_label: str) -> None:
    cards = "\n".join(
        (
            '<figure class="card">'
            f'<img src="actual/{html.escape(row["id"])}-96.png" '
            f'alt="{html.escape(row["label"])}" width="96" height="96">'
            f'<figcaption>{html.escape(row["label"])}</figcaption>'
            "</figure>"
        )
        for row in rows
    )
    document = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>mgjrpg-02 {html.escape(batch_label)}</title>
  <style>
    :root {{ color-scheme: light; font-family: Inter, ui-rounded, system-ui, sans-serif; }}
    * {{ box-sizing: border-box; }}
    body {{ margin: 0; background: #eee7da; color: #34203f; }}
    main {{ max-width: 1000px; margin: 0 auto; padding: 24px; }}
    h1 {{ margin: 0 0 4px; font-size: 22px; }}
    p {{ margin: 0 0 22px; color: #745f78; font-size: 14px; }}
    .grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }}
    .card {{ min-height: 148px; margin: 0; padding: 12px 8px 10px; border: 1px solid #d6c7d1;
      border-radius: 14px; background: #f8f1e6; display: grid; justify-items: center;
      align-content: start; gap: 8px; box-shadow: 0 2px 0 rgba(52, 32, 63, .06); }}
    img {{ display: block; width: 96px; height: 96px; object-fit: contain; image-rendering: auto; }}
    figcaption {{ text-align: center; font-weight: 650; font-size: 13px; line-height: 1.22; }}
  </style>
</head>
<body>
  <main>
    <h1>mgjrpg-02 · {html.escape(batch_label)}</h1>
    <p>Single-scale 96 px review. Neutral cream background. Approve by default; name exceptions.</p>
    <section class="grid" aria-label="Batch 01 candidates">
      {cards}
    </section>
  </main>
</body>
</html>
"""
    destination.write_text(document, encoding="utf-8", newline="\n")


def build_batch(
    *,
    source_root: Path = SOURCE_ROOT,
    output_root: Path = OUTPUT_ROOT,
) -> dict[str, Any]:
    batch_assets = discover_batch_assets(source_root)
    missing = [asset.source_name for asset in batch_assets if not (source_root / asset.source_name).is_file()]
    if missing:
        raise FileNotFoundError("missing Batch 01 matte source(s): " + ", ".join(missing))

    master_dir = output_root / "master"
    delivery_dir = output_root / "delivery"
    actual_dir = output_root / "actual"
    for directory in (output_root, master_dir, delivery_dir, actual_dir):
        directory.mkdir(parents=True, exist_ok=True)

    rows: list[dict[str, Any]] = []
    for asset in batch_assets:
        source_path = source_root / asset.source_name
        with Image.open(source_path) as opened:
            opened.load()
            source = opened.convert("RGB")
        matte = estimate_uniform_matte(source)
        extracted, extraction = extract_uniform_matte(source, matte["rgb"])
        registered = register_cutout(
            extracted,
            (512, 512),
            target_box=asset.target_box,
            align=asset.align,
            alpha_threshold=3,
        )
        registered, normalized_after_registration = normalize_visible_black(registered)
        # Lanczos can leave a numerically tiny chroma-key lobe at master size.
        # Clear through 12/255 consistently with the actual-size proof so the
        # immutable matte cannot survive as a visible green edge contaminant.
        registered = clear_low_alpha(registered, 12)
        registered = dilate_hidden_rgb(registered, 4)
        master_path = master_dir / f"{asset.asset_id}-512.png"
        master_encoder = save_image(
            registered,
            master_path,
            "png",
            {"compress_level": 9, "optimize": False},
        )

        delivery = register_cutout(
            extracted,
            (256, 256),
            target_box=asset.target_box,
            align=asset.align,
            alpha_threshold=3,
        )
        delivery, normalized_after_delivery = normalize_visible_black(delivery)
        delivery = clear_low_alpha(delivery, 4)
        delivery = dilate_hidden_rgb(delivery, 4)
        delivery_path = delivery_dir / f"{asset.asset_id}-256.webp"
        delivery_encoder = save_image(
            delivery,
            delivery_path,
            "webp",
            {"lossless": True, "quality": 100, "method": 6, "exact": True},
        )

        actual = register_cutout(
            extracted,
            (96, 96),
            target_box=asset.target_box,
            align=asset.align,
            alpha_threshold=3,
        )
        actual, normalized_after_actual = normalize_visible_black(actual)
        actual = clear_low_alpha(actual, 12)
        actual = dilate_hidden_rgb(actual, 2)
        actual_path = actual_dir / f"{asset.asset_id}-96.png"
        actual_encoder = save_image(
            actual,
            actual_path,
            "png",
            {"compress_level": 9, "optimize": False},
        )

        source_fact = {
            "path": _repo_relative(source_path),
            "sha256": _sha256(source_path),
            "bytes": source_path.stat().st_size,
            "width": source.width,
            "height": source.height,
            "mode": source.mode,
            "decodedBytesUpperBound": source.width * source.height * 4,
        }
        outputs = {
            "master512Png": _image_fact(master_path, matte["rgb"]),
            "delivery256Webp": _image_fact(delivery_path, matte["rgb"]),
            "actual96Png": _image_fact(actual_path, matte["rgb"]),
        }
        if not all(output["transparentGutter"]["atLeastFourPixels"] for output in outputs.values()):
            raise ValueError(f"{asset.asset_id} failed the four-pixel transparent-gutter contract")
        if any(output["exactBlackVisiblePixels"] for output in outputs.values()):
            raise ValueError(f"{asset.asset_id} retains visible exact-black pixels")
        if any(
            output["alphaQuality"]["visibleMatteLikePixelsWithin24"]
            or output["alphaQuality"]["hiddenExactMattePixels"]
            for output in outputs.values()
        ):
            raise ValueError(f"{asset.asset_id} retains measured matte contamination")
        rows.append(
            {
                "id": asset.asset_id,
                "label": asset.label,
                "source": source_fact,
                "matte": matte,
                "extraction": {
                    "recipeId": MATTE_RECIPE_ID,
                    **extraction,
                    "visibleBoundsBeforeRegistration": _visible_bounds(extracted),
                    "registration": {
                        "canvas": [512, 512],
                        "targetBox": list(asset.target_box),
                        "align": list(asset.align),
                        "alphaThreshold": 3,
                    },
                    "exactBlackVisiblePixelsNormalizedAfterResize": (
                        normalized_after_registration
                        + normalized_after_delivery
                        + normalized_after_actual
                    ),
                    "hiddenRgbDilationPixels": {"master": 4, "delivery": 4, "actual": 2},
                    "clearAlphaBelow": {"master": 8, "delivery": 4, "actual": 12},
                },
                "outputs": outputs,
                "encoders": {
                    "master512Png": master_encoder,
                    "delivery256Webp": delivery_encoder,
                    "actual96Png": actual_encoder,
                },
            }
        )

    batch_suffix = source_root.name
    batch_label = batch_suffix.replace("-", " ").title()
    _write_html(output_root / "index.html", rows, batch_label)
    encoded_total = sum(
        output["bytes"]
        for row in rows
        for output in row["outputs"].values()
    )
    decoded_total = sum(
        output["decodedBytesUpperBound"]
        for row in rows
        for output in row["outputs"].values()
    )
    report = {
        "schema": REPORT_SCHEMA,
        "batchId": f"mgjrpg-02-{batch_suffix}",
        "status": "review-candidates-not-runtime-authority",
        "sourceRoot": _repo_relative(source_root),
        "outputRoot": _repo_relative(output_root),
        "candidateCount": len(rows),
        "reviewScalePx": 96,
        "background": "#eee7da",
        "recipe": {
            "id": MATTE_RECIPE_ID,
            "inkRgb": list(INK_RGB),
            "resize": "premultiplied-alpha Lanczos",
            "sourcePolicy": "immutable generator originals only; never edit-of-edit",
            "publicationPolicy": "ignored review artifacts only; no runtime or catalogue writes",
        },
        "totals": {
            "encodedOutputBytes": encoded_total,
            "decodedOutputBytesUpperBound": decoded_total,
        },
        "environment": encoder_environment(),
        "assets": rows,
    }
    report_path = output_root / "batch-report.json"
    report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8", newline="\n")
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-root", type=Path, default=SOURCE_ROOT)
    parser.add_argument("--output-root", type=Path, default=OUTPUT_ROOT)
    args = parser.parse_args()
    report = build_batch(source_root=args.source_root, output_root=args.output_root)
    print(
        f"built {report['candidateCount']} Batch 01 candidates at "
        f"{report['outputRoot']} ({report['totals']['encodedOutputBytes']} encoded bytes)"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
