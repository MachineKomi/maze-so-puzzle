"""Build the v0.16 friend and enemy runtime sprite catalogue.

ImageGen masters are retained under ``docs/source-assets``. Runtime copies are
512 px lossless WebP files: they preserve genuine alpha and crisp tile edges
while avoiding the much larger source downloads. The alpaca master visualises
transparency as a pale checkerboard, so only its edge-connected neutral field
is removed before export.
"""

from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "source-assets"
RUNTIME = ROOT / "public" / "assets"
RUNTIME_SIZE = (512, 512)

ASSETS = {
    "animal-chinchilla-v1": False,
    "animal-alpaca-v1": True,
    "animal-penguin-v1": False,
    "animal-koala-v1": False,
    "enemy-cloud-gremlin-v1": False,
    "enemy-pumpkin-sprite-v1": False,
    "enemy-clockwork-crab-v1": False,
    "enemy-jelly-sorcerer-v1": False,
}


def remove_connected_checkerboard(image: Image.Image) -> Image.Image:
    rgb = image.convert("RGB")
    width, height = rgb.size
    pixels = rgb.load()
    background = Image.new("L", rgb.size, 0)
    mask = background.load()
    queue: deque[tuple[int, int]] = deque()

    def is_background(x: int, y: int) -> bool:
        red, green, blue = pixels[x, y]
        return min(red, green, blue) >= 205 and max(red, green, blue) - min(red, green, blue) <= 24

    for x in range(width):
        queue.extend(((x, 0), (x, height - 1)))
    for y in range(height):
        queue.extend(((0, y), (width - 1, y)))

    while queue:
        x, y = queue.popleft()
        if mask[x, y] or not is_background(x, y):
            continue
        mask[x, y] = 255
        if x > 0:
            queue.append((x - 1, y))
        if x + 1 < width:
            queue.append((x + 1, y))
        if y > 0:
            queue.append((x, y - 1))
        if y + 1 < height:
            queue.append((x, y + 1))

    alpha = background.filter(ImageFilter.GaussianBlur(1.1)).point(lambda value: 255 - value)
    rgba = rgb.convert("RGBA")
    rgba.putalpha(alpha)
    return rgba


def build_sprite(stem: str, remove_checkerboard: bool) -> None:
    source_path = SOURCE / f"{stem}-master.png"
    destination = RUNTIME / f"{stem}.webp"
    with Image.open(source_path) as source:
        sprite = remove_connected_checkerboard(source) if remove_checkerboard else source.convert("RGBA")
        sprite.thumbnail(RUNTIME_SIZE, Image.Resampling.LANCZOS)
    if sprite.getchannel("A").getextrema()[0] != 0:
        raise ValueError(f"{source_path.name} has no transparent padding")
    destination.parent.mkdir(parents=True, exist_ok=True)
    sprite.save(destination, "WEBP", lossless=True, method=6, exact=True)
    with Image.open(destination) as result:
        if result.size != RUNTIME_SIZE or "A" not in result.getbands():
            raise ValueError(f"Invalid runtime sprite: {destination}")
    print(f"Wrote {destination.relative_to(ROOT)} ({destination.stat().st_size} bytes)")


def main() -> None:
    for stem, remove_checkerboard in ASSETS.items():
        build_sprite(stem, remove_checkerboard)


if __name__ == "__main__":
    main()
