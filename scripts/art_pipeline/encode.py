"""Named deterministic encoder profiles and version reporting."""

from __future__ import annotations

import platform
import zlib
from pathlib import Path
from typing import Any

import numpy
from PIL import Image, __version__ as pillow_version, features


def encoder_environment() -> dict[str, str]:
    return {
        "python": platform.python_version(),
        "pillow": pillow_version,
        "numpy": numpy.__version__,
        "libwebp": features.version_module("webp") or "unavailable",
        "zlib": zlib.ZLIB_VERSION,
    }


def save_image(
    image: Image.Image,
    destination: Path,
    image_format: str,
    options: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Encode without EXIF/ICC carry-through and return the effective recipe."""

    requested = dict(options or {})
    normalized_format = image_format.lower()
    if normalized_format == "png":
        effective = {
            "compress_level": int(requested.get("compress_level", 9)),
            "optimize": bool(requested.get("optimize", False)),
        }
        image.save(destination, format="PNG", **effective)
        encoder_name = "Pillow PNG (zlib)"
        encoder_version = f"Pillow {pillow_version}; zlib {zlib.ZLIB_VERSION}"
    elif normalized_format == "webp":
        lossless = bool(requested.get("lossless", True))
        effective = {
            "lossless": lossless,
            "quality": int(requested.get("quality", 100 if lossless else 92)),
            "method": int(requested.get("method", 6)),
            "exact": bool(requested.get("exact", True)),
        }
        image.save(destination, format="WEBP", **effective)
        encoder_name = "Pillow WebP"
        encoder_version = f"Pillow {pillow_version}; libwebp {features.version_module('webp') or 'unknown'}"
    elif normalized_format in {"jpg", "jpeg"}:
        effective = {
            "quality": int(requested.get("quality", 92)),
            "subsampling": int(requested.get("subsampling", 0)),
            "optimize": bool(requested.get("optimize", False)),
            "progressive": bool(requested.get("progressive", False)),
        }
        image.convert("RGB").save(destination, format="JPEG", **effective)
        encoder_name = "Pillow JPEG"
        encoder_version = f"Pillow {pillow_version}; libjpeg {features.version_module('jpg') or 'unknown'}"
    else:
        raise ValueError(f"unsupported output format: {image_format}")
    return {
        "name": encoder_name,
        "version": encoder_version,
        "options": effective,
        "environment": encoder_environment(),
    }
