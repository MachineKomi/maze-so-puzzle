"""Prepare sparse ImageGen terrain-dressing overlays for the browser game.

The retained masters include a few highly saturated chroma-spill pixels from
transparent-background generation. This deterministic pass removes only those
key colours, preserves the generated alpha, and downsamples the runtime copies.
"""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSETS = (
    (
        ROOT / "docs/source-assets/terrain-dressing-garden-v1-master.png",
        ROOT / "public/assets/terrain-dressing-garden-v1.png",
    ),
    (
        ROOT / "docs/source-assets/terrain-dressing-vines-v1-master.png",
        ROOT / "public/assets/terrain-dressing-vines-v1.png",
    ),
    (
        ROOT / "docs/source-assets/terrain-dressing-crystal-v1-master.png",
        ROOT / "public/assets/terrain-dressing-crystal-v1.png",
    ),
    (
        ROOT / "docs/source-assets/terrain-dressing-autumn-v1-master.png",
        ROOT / "public/assets/terrain-dressing-autumn-v1.png",
    ),
)
RUNTIME_SIZE = (512, 512)


def is_chroma_spill(red: int, green: int, blue: int) -> bool:
    neon_green = green >= 205 and red <= 95 and blue <= 130
    neon_lime = green >= 215 and red <= 155 and blue <= 85 and green - red >= 55
    neon_yellow = red >= 220 and green >= 210 and blue <= 85
    neon_red = red >= 235 and green <= 70 and blue <= 75
    return neon_green or neon_lime or neon_yellow or neon_red


def clean_master(source: Path) -> Image.Image:
    image = Image.open(source).convert("RGBA")
    cleaned: list[tuple[int, int, int, int]] = []
    for red, green, blue, alpha in image.get_flattened_data():
        if alpha < 5 or is_chroma_spill(red, green, blue):
            cleaned.append((0, 0, 0, 0))
        else:
            cleaned.append((red, green, blue, alpha))
    image.putdata(cleaned)
    return image


def write_runtime(source: Path, destination: Path) -> None:
    image = clean_master(source)
    image = image.resize(RUNTIME_SIZE, Image.Resampling.LANCZOS)

    # Clear nearly invisible resampling residue so transparent padding stays
    # genuinely empty at every repeat boundary.
    pixels = [
        (0, 0, 0, 0) if alpha < 5 else (red, green, blue, alpha)
        for red, green, blue, alpha in image.get_flattened_data()
    ]
    image.putdata(pixels)
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination, optimize=True)

    validate_runtime(destination)


def validate_runtime(destination: Path) -> None:
    if not destination.is_file():
        raise FileNotFoundError(f"Missing terrain dressing: {destination}")

    with Image.open(destination) as source:
        image = source.convert("RGBA")
    alpha = image.getchannel("A")
    alpha_min, alpha_max = alpha.getextrema()
    if image.size != RUNTIME_SIZE or alpha_min != 0 or alpha_max != 255:
        raise RuntimeError(f"Invalid terrain dressing output: {destination}")

    width, height = image.size
    outer_alpha = (
        list(alpha.crop((0, 0, width, 1)).get_flattened_data())
        + list(alpha.crop((0, height - 1, width, height)).get_flattened_data())
        + list(alpha.crop((0, 0, 1, height)).get_flattened_data())
        + list(alpha.crop((width - 1, 0, width, height)).get_flattened_data())
    )
    if any(outer_alpha):
        raise RuntimeError(f"Terrain dressing must have transparent repeat edges: {destination}")

    print(f"Checked {destination.relative_to(ROOT)} ({width} x {height} RGBA)")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check",
        action="store_true",
        help="validate existing runtime files without rebuilding them",
    )
    arguments = parser.parse_args()

    for source, destination in ASSETS:
        if arguments.check:
            validate_runtime(destination)
        else:
            write_runtime(source, destination)


if __name__ == "__main__":
    main()
