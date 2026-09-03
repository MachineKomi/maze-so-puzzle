"""Periodic-plus-smooth terrain preparation retained from the proven processor."""

from __future__ import annotations

from typing import Any

import numpy as np
from PIL import Image, ImageChops, ImageStat


MAX_WRAP_TO_LOCAL_RATIO = 3.0
MAX_WRAP_MEAN_ERROR = 16.0


def make_periodic(source: Image.Image, size: tuple[int, int]) -> Image.Image:
    resized = source.convert("RGB").resize(size, Image.Resampling.LANCZOS)
    source_array = np.asarray(resized, dtype=np.float64)
    height, width, channel_count = source_array.shape
    boundary = np.zeros_like(source_array)
    boundary[0, :, :] = source_array[-1, :, :] - source_array[0, :, :]
    boundary[-1, :, :] = source_array[0, :, :] - source_array[-1, :, :]
    boundary[:, 0, :] += source_array[:, -1, :] - source_array[:, 0, :]
    boundary[:, -1, :] += source_array[:, 0, :] - source_array[:, -1, :]

    vertical = np.arange(height, dtype=np.float64)[:, np.newaxis]
    horizontal = np.arange(width, dtype=np.float64)[np.newaxis, :]
    laplacian = (
        2 * np.cos(2 * np.pi * vertical / height)
        + 2 * np.cos(2 * np.pi * horizontal / width)
        - 4
    )
    laplacian[0, 0] = 1
    periodic = np.empty_like(source_array)
    for channel in range(channel_count):
        smooth_frequency = np.fft.fft2(boundary[:, :, channel]) / laplacian
        smooth_frequency[0, 0] = 0
        smooth = np.fft.ifft2(smooth_frequency).real
        periodic[:, :, channel] = source_array[:, :, channel] - smooth
    return Image.fromarray(np.clip(np.rint(periodic), 0, 255).astype(np.uint8))


def _mean_difference(first: Image.Image, second: Image.Image) -> float:
    difference = ImageChops.difference(first.convert("RGB"), second.convert("RGB"))
    return sum(ImageStat.Stat(difference).mean) / 3


def seam_metrics(image: Image.Image) -> dict[str, Any]:
    rgb = image.convert("RGB")
    width, height = rgb.size
    horizontal_wrap = _mean_difference(
        rgb.crop((0, 0, 1, height)),
        rgb.crop((width - 1, 0, width, height)),
    )
    horizontal_local = _mean_difference(
        rgb.crop((1, 0, width, height)),
        rgb.crop((0, 0, width - 1, height)),
    )
    vertical_wrap = _mean_difference(
        rgb.crop((0, 0, width, 1)),
        rgb.crop((0, height - 1, width, height)),
    )
    vertical_local = _mean_difference(
        rgb.crop((0, 1, width, height)),
        rgb.crop((0, 0, width, height - 1)),
    )
    directions = {
        "horizontal": {"wrap": horizontal_wrap, "local": horizontal_local},
        "vertical": {"wrap": vertical_wrap, "local": vertical_local},
    }
    passed = True
    for values in directions.values():
        allowed = min(MAX_WRAP_MEAN_ERROR, max(1.0, values["local"]) * MAX_WRAP_TO_LOCAL_RATIO)
        values["allowed"] = allowed
        values["passed"] = values["wrap"] <= allowed
        passed = passed and values["passed"]
    return {"passed": passed, "directions": directions}
