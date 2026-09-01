"""Build the periodic runtime terrain textures from their ImageGen masters.

The generated masters are attractive material paintings, but their opposite
edges do not describe neighbouring pixels. A plain resize therefore leaves a
visible join, while mirroring or alpha-blending copies can create cross-bands
and double-exposed masonry lines.

This conversion uses the periodic-plus-smooth decomposition described by
Lionel Moisan (2011). It solves a small periodic Poisson problem in the Fourier
domain and subtracts only the smooth boundary mismatch from the generated
painting. The detailed stones, bricks, grass, and moss remain single-exposed,
and the repeat transition becomes no stronger than an ordinary local edge.
"""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageChops, ImageStat


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIRECTORY = ROOT / "docs" / "source-assets"
OUTPUT_DIRECTORY = ROOT / "public" / "assets"
OUTPUT_SIZE = 1024

TEXTURE_NAMES = (
    "floor-v3",
    "floor-rose-brick-v1",
    "floor-moon-slate-v1",
    "floor-meadow-grass-v1",
    "floor-woodland-dirt-v1",
    "wall-v3",
    "wall-sandstone-v1",
    "wall-mossy-ruin-v1",
    "wall-dark-dungeon-v1",
    "wall-hedge-v1",
    "terrain-poison-v1",
)

# A repeat boundary should look like an ordinary neighbouring pixel transition,
# not a separate bright or dark stripe. Hand-painted brick rows occasionally
# produce a naturally stronger local transition, so the ratio threshold is
# intentionally tolerant while still catching the old cross-band conversion.
MAX_WRAP_TO_LOCAL_RATIO = 3.0
MAX_WRAP_MEAN_ERROR = 16.0


def make_periodic(source: Image.Image) -> Image.Image:
    try:
        import numpy as np
    except ImportError as error:
        raise RuntimeError(
            "Rebuilding terrain textures requires NumPy. "
            "Install the art dependencies with: python -m pip install Pillow numpy"
        ) from error

    resized = source.convert("RGB").resize(
        (OUTPUT_SIZE, OUTPUT_SIZE),
        Image.Resampling.LANCZOS,
    )
    source_array = np.asarray(resized, dtype=np.float64)
    height, width, channel_count = source_array.shape

    boundary = np.zeros_like(source_array)
    boundary[0, :, :] = source_array[-1, :, :] - source_array[0, :, :]
    boundary[-1, :, :] = source_array[0, :, :] - source_array[-1, :, :]
    boundary[:, 0, :] += source_array[:, -1, :] - source_array[:, 0, :]
    boundary[:, -1, :] += source_array[:, 0, :] - source_array[:, -1, :]

    vertical_frequencies = np.arange(height, dtype=np.float64)[:, np.newaxis]
    horizontal_frequencies = np.arange(width, dtype=np.float64)[np.newaxis, :]
    laplacian = (
        2 * np.cos(2 * np.pi * vertical_frequencies / height)
        + 2 * np.cos(2 * np.pi * horizontal_frequencies / width)
        - 4
    )
    # The zero-frequency term is the arbitrary mean of the smooth component.
    laplacian[0, 0] = 1

    periodic = np.empty_like(source_array)
    for channel in range(channel_count):
        smooth_frequency = np.fft.fft2(boundary[:, :, channel]) / laplacian
        smooth_frequency[0, 0] = 0
        smooth = np.fft.ifft2(smooth_frequency).real
        periodic[:, :, channel] = source_array[:, :, channel] - smooth

    runtime_array = np.clip(np.rint(periodic), 0, 255).astype(np.uint8)
    return Image.fromarray(runtime_array, mode="RGB")


def save_runtime_texture(image: Image.Image, destination: Path) -> None:
    # The painted materials contain far fewer than 256 perceptually important
    # colours at their displayed scale. Palette output keeps mobile downloads
    # modest without changing geometry or adding alpha fringes.
    palette_image = image.quantize(
        colors=256,
        method=Image.Quantize.MEDIANCUT,
        dither=Image.Dither.FLOYDSTEINBERG,
    )
    palette_image.save(destination, format="PNG", optimize=True)


def mean_channel_difference(first: Image.Image, second: Image.Image) -> float:
    difference = ImageChops.difference(first.convert("RGB"), second.convert("RGB"))
    return sum(ImageStat.Stat(difference).mean) / 3


def validate_runtime_texture(texture_path: Path) -> None:
    with Image.open(texture_path) as source:
        image = source.convert("RGB")
        if source.size != (OUTPUT_SIZE, OUTPUT_SIZE):
            raise ValueError(
                f"{texture_path.name} must be {OUTPUT_SIZE} x {OUTPUT_SIZE}; "
                f"found {source.size[0]} x {source.size[1]}."
            )
        if "A" in source.getbands() and source.getchannel("A").getextrema() != (255, 255):
            raise ValueError(f"{texture_path.name} must be fully opaque.")

    width, height = image.size
    horizontal_wrap = mean_channel_difference(
        image.crop((0, 0, 1, height)),
        image.crop((width - 1, 0, width, height)),
    )
    horizontal_local = mean_channel_difference(
        image.crop((1, 0, width, height)),
        image.crop((0, 0, width - 1, height)),
    )
    vertical_wrap = mean_channel_difference(
        image.crop((0, 0, width, 1)),
        image.crop((0, height - 1, width, height)),
    )
    vertical_local = mean_channel_difference(
        image.crop((0, 1, width, height)),
        image.crop((0, 0, width, height - 1)),
    )

    for direction, wrap_error, local_error in (
        ("horizontal", horizontal_wrap, horizontal_local),
        ("vertical", vertical_wrap, vertical_local),
    ):
        allowed_error = min(
            MAX_WRAP_MEAN_ERROR,
            max(1.0, local_error) * MAX_WRAP_TO_LOCAL_RATIO,
        )
        if wrap_error > allowed_error:
            raise ValueError(
                f"{texture_path.name} has a visible {direction} repeat: "
                f"wrap error {wrap_error:.2f}, local error {local_error:.2f}."
            )

    print(
        f"Checked {texture_path.relative_to(ROOT)} "
        f"(wrap/local H {horizontal_wrap:.2f}/{horizontal_local:.2f}, "
        f"V {vertical_wrap:.2f}/{vertical_local:.2f})"
    )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check",
        action="store_true",
        help="validate existing runtime files without rebuilding them",
    )
    arguments = parser.parse_args()

    for texture_name in TEXTURE_NAMES:
        source_path = SOURCE_DIRECTORY / f"{texture_name}-master.png"
        destination_path = OUTPUT_DIRECTORY / f"{texture_name}.png"
        if not source_path.is_file():
            raise FileNotFoundError(f"Missing terrain master: {source_path}")

        if not arguments.check:
            with Image.open(source_path) as source:
                periodic = make_periodic(source)
            save_runtime_texture(periodic, destination_path)
            print(f"Wrote {destination_path.relative_to(ROOT)}")

        if not destination_path.is_file():
            raise FileNotFoundError(f"Missing runtime texture: {destination_path}")
        validate_runtime_texture(destination_path)


if __name__ == "__main__":
    main()
