"""Prepare ImageGen traversal-item masters for the browser runtime.

The original generated PNGs stay in ``docs/source-assets``. Runtime sprites are
downsampled with high-quality filtering so a maze tile does not download a
megapixel image, while preserving their genuine alpha channel.
"""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "source-assets"
DESTINATION = ROOT / "public" / "assets"

ASSETS = {
    "spring-boots-v1-master.png": "spring-boots-v1.png",
    "ground-hole-v1-master.png": "ground-hole-v1.png",
    "antidote-leaf-v1-master.png": "antidote-leaf-v1.png",
}


def main() -> None:
    DESTINATION.mkdir(parents=True, exist_ok=True)

    for source_name, destination_name in ASSETS.items():
        image = Image.open(SOURCE / source_name).convert("RGBA")
        alpha_extrema = image.getchannel("A").getextrema()
        if alpha_extrema != (0, 255):
            raise ValueError(f"{source_name} must contain transparent and opaque pixels")

        runtime = image.resize((512, 512), Image.Resampling.LANCZOS)
        runtime.save(DESTINATION / destination_name, optimize=True)


if __name__ == "__main__":
    main()
