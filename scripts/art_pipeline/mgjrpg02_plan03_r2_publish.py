"""Build the Human-approved Plan 03-R2 home composition assets.

The script consumes immutable green-matte generator originals, extracts alpha
without redrawing their pixels, and writes only new versioned files. ``--check``
rebuilds in a temporary directory and compares every byte with publication.
"""

from __future__ import annotations

import argparse
import json
import subprocess
import tempfile
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image

from cutout import dilate_hidden_rgb, remove_small_alpha_components
from encode import encoder_environment, save_image
from mgjrpg02_plan03_r1_publish import alpha_geometry, extract_matte
from model import ROOT, image_facts, sha256_file


PUBLICATION_ID = "mgjrpg-02-plan03-r2-home-composition-v01"
DERIVATIVE_RECIPE = "mgjrpg-02-plan03-r2-alpha-derivative-r01"
BATCH = ROOT / "docs/source-assets/production/mgjrpg-02/batch-26-plan03-r2-home-composition"
SPLASH_SOURCE = BATCH / "home-hero-splash-v02-larger-tea-skeleton-generator-original.png"
LOGO_SOURCE = ROOT / "docs/source-assets/production/mgjrpg-02/batch-24-plan03-r1-logo-revision/game-logo-v03-candidate-b-cleanup-edit-02-generator-original.png"


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def make_row(stable_id: str, source: Path, path: str, file: Path, profile: str,
             status: str, processing: dict[str, Any], loading: str,
             display_range: list[int]) -> dict[str, Any]:
    facts = image_facts(file)
    return {
        "stableId": stable_id,
        "source": source.relative_to(ROOT).as_posix(),
        "sourceSha256": sha256_file(source),
        "sourceBytes": source.stat().st_size,
        "path": path,
        "sha256": sha256_file(file),
        "bytes": file.stat().st_size,
        **facts,
        "profile": profile,
        "runtimeStatus": status,
        "loadingPhase": loading,
        "displayRangeCssPx": display_range,
        "processing": processing,
        "geometry": alpha_geometry(Image.open(file).convert("RGBA")),
    }


def clear_residual_green_spill(source: Image.Image) -> Image.Image:
    """Remove only matte-coloured boundary remnants, never authored mint cloth."""

    pixels = np.asarray(source.convert("RGBA"), dtype=np.uint8).copy()
    red = pixels[:, :, 0].astype(np.int16)
    green = pixels[:, :, 1].astype(np.int16)
    blue = pixels[:, :, 2].astype(np.int16)
    alpha = pixels[:, :, 3]
    matte_spill = (
        (alpha > 0)
        & (alpha < 240)
        & (green > red + 65)
        & (green > blue + 90)
        & (blue < 64)
    )
    pixels[:, :, 3][matte_spill] = 0
    cleaned = remove_small_alpha_components(
        Image.fromarray(pixels, "RGBA"), minimum_pixels=4, alpha_threshold=3
    )
    return dilate_hidden_rgb(cleaned, 4)


def build(output_root: Path) -> list[dict[str, Any]]:
    outputs: list[dict[str, Any]] = []

    splash_master, splash_processing = extract_matte(SPLASH_SOURCE, 48.0, 144.0, (1448, 1086))
    splash_master = clear_residual_green_spill(splash_master)
    splash_master_path = output_root / "docs/source-assets/production/mgjrpg-02/batch-26-plan03-r2-home-composition/home-hero-splash-v02-transparent-master.png"
    splash_master_path.parent.mkdir(parents=True, exist_ok=True)
    save_image(splash_master, splash_master_path, "png", {"compress_level": 9, "optimize": False})
    splash_runtime = splash_master.resize((1024, 768), Image.Resampling.LANCZOS)
    splash_runtime_path = output_root / "public/assets/mgjrpg-02/brand/home-hero-splash-v02-front-door-1024-r01.webp"
    splash_runtime_path.parent.mkdir(parents=True, exist_ok=True)
    save_image(splash_runtime, splash_runtime_path, "webp", {"lossless": True, "method": 6, "exact": True})
    outputs.append(make_row(
        "home-hero-splash", SPLASH_SOURCE,
        "public/assets/mgjrpg-02/brand/home-hero-splash-v02-front-door-1024-r01.webp",
        splash_runtime_path, "front-door-hero-1024", "active", splash_processing,
        "title-critical", [320, 1024],
    ))

    logo_master, logo_processing = extract_matte(LOGO_SOURCE, 48.0, 144.0, (1536, 1024))
    logo_master = clear_residual_green_spill(logo_master)
    logo_master_path = output_root / "docs/source-assets/production/mgjrpg-02/batch-26-plan03-r2-home-composition/game-logo-v06-transparent-master.png"
    save_image(logo_master, logo_master_path, "png", {"compress_level": 9, "optimize": False})
    for width in (1024, 512):
        height = round(logo_master.height * width / logo_master.width)
        rendition = logo_master.resize((width, height), Image.Resampling.LANCZOS)
        path = f"public/assets/mgjrpg-02/brand/game-logo-v06-front-door-{width}-r01.webp"
        destination = output_root / path
        destination.parent.mkdir(parents=True, exist_ok=True)
        save_image(rendition, destination, "webp", {"lossless": True, "method": 6, "exact": True})
        outputs.append(make_row(
            f"game-logo-{width}", LOGO_SOURCE, path, destination,
            f"front-door-wordmark-{width}", "active", logo_processing,
            "title-critical", [257 if width == 1024 else 96, 1024 if width == 1024 else 256],
        ))
    return outputs


def public_file(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists() and destination.read_bytes() != source.read_bytes():
        relative = destination.relative_to(ROOT).as_posix()
        tracked = subprocess.run(
            ["git", "ls-files", "--error-unmatch", relative],
            cwd=ROOT,
            capture_output=True,
        ).returncode == 0
        if tracked:
            raise RuntimeError(f"refusing to overwrite tracked versioned file: {destination}")
        destination.write_bytes(source.read_bytes())
        return
    if not destination.exists():
        destination.write_bytes(source.read_bytes())


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--publish", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.publish == args.check:
        parser.error("choose exactly one of --publish or --check")
    with tempfile.TemporaryDirectory(prefix="maze-plan03-r2-") as temporary:
        temp_root = Path(temporary)
        rows = build(temp_root)
        if args.check:
            for row in rows:
                expected = ROOT / row["path"]
                generated = temp_root / row["path"]
                if not expected.exists() or expected.read_bytes() != generated.read_bytes():
                    raise RuntimeError(f"deterministic mismatch: {row['path']}")
            for relative in (
                "docs/source-assets/production/mgjrpg-02/batch-26-plan03-r2-home-composition/home-hero-splash-v02-transparent-master.png",
                "docs/source-assets/production/mgjrpg-02/batch-26-plan03-r2-home-composition/game-logo-v06-transparent-master.png",
            ):
                expected = ROOT / relative
                generated = temp_root / relative
                if not expected.exists() or expected.read_bytes() != generated.read_bytes():
                    raise RuntimeError(f"deterministic mismatch: {relative}")
            print(json.dumps({"status": "pass", "publicationId": PUBLICATION_ID, "checked": 5}, indent=2))
            return 0

        for row in rows:
            public_file(temp_root / row["path"], ROOT / row["path"])
        for relative in (
            "docs/source-assets/production/mgjrpg-02/batch-26-plan03-r2-home-composition/home-hero-splash-v02-transparent-master.png",
            "docs/source-assets/production/mgjrpg-02/batch-26-plan03-r2-home-composition/game-logo-v06-transparent-master.png",
        ):
            public_file(temp_root / relative, ROOT / relative)

        report = {
            "schema": "maze-art-plan03-r2-publication/v1",
            "publicationId": PUBLICATION_ID,
            "recordedOn": "2026-09-04",
            "derivativeRecipe": DERIVATIVE_RECIPE,
            "encoderEnvironment": encoder_environment(),
            "entries": rows,
            "totals": {
                "runtimeFiles": len(rows),
                "runtimeEncodedBytes": sum(row["bytes"] for row in rows),
                "runtimeDecodedBytesUpperBound": sum(row["decodedBytesUpperBound"] for row in rows),
            },
            "runtimeIntent": {
                "home-hero-splash": "bottom-right title/home composition layer",
                "game-logo": "visual wordmark replacing display heading while retaining an accessible live h1",
            },
            "rollback": {
                "checkpoint": "5af5ccb092cb7ed8f5b080dd5572eadcef217dc3",
                "paths": [
                    "public/assets/mgjrpg-02/brand/home-hero-splash-v01-front-door-1024-r01.webp",
                    "public/assets/mgjrpg-02/brand/game-logo-v05-front-door-1024-r01.webp",
                    "public/assets/mgjrpg-02/brand/game-logo-v05-front-door-512-r01.webp",
                ],
            },
        }
        write_json(ROOT / "docs/source-assets/publication/mgjrpg-02-plan03-r2-home-composition-map.json", report)
        print(json.dumps(report["totals"], indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
