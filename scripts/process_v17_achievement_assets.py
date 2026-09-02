"""Build the v0.17 achievement-art runtime catalogue.

ImageGen masters remain in ``docs/source-assets`` for future art direction.
The browser and desktop builds use 512 px lossless WebP copies so the crisp
embroidered edges and genuine alpha survive without shipping multi-megabyte
source PNGs.
"""

from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "source-assets"
RUNTIME = ROOT / "public" / "assets"
RUNTIME_SIZE = (512, 512)

ASSETS = {
    "reward-animal-friend-sticker-v2": None,
    "reward-surprise-sparkle-sticker-v2": None,
    "reward-helping-paw-medal-v2": None,
    "reward-rainbow-rescue-medal-v2": None,
    "reward-golden-guardian-medal-v2": None,
    "badge-pathfinder-v1": None,
    "badge-maze-mapper-v1": None,
    "badge-grand-explorer-v1": None,
    "badge-surprise-scout-v1": None,
    "badge-mighty-adventurer-v1": "checkerboard",
    "badge-twinkle-toes-v1": "checkerboard",
    "badge-bunny-buddy-v1": None,
    "badge-fox-friend-v1": None,
    "badge-kitten-pal-v1": "black",
}


def remove_connected_background(image: Image.Image, background_kind: str) -> Image.Image:
    """Remove only neutral background pixels connected to an outer edge."""

    rgb = image.convert("RGB")
    width, height = rgb.size
    pixels = rgb.load()
    visited = Image.new("L", rgb.size, 0)
    mask = visited.load()
    queue: deque[tuple[int, int]] = deque()

    def is_background(x: int, y: int) -> bool:
        red, green, blue = pixels[x, y]
        if background_kind == "black":
            return max(red, green, blue) <= 22
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

    alpha = visited.filter(ImageFilter.GaussianBlur(1.1)).point(lambda value: 255 - value)
    rgba = rgb.convert("RGBA")
    rgba.putalpha(alpha)
    return rgba


def build_sprite(stem: str, background_kind: str | None) -> None:
    source_path = SOURCE / f"{stem}-master.png"
    destination = RUNTIME / f"{stem}.webp"
    with Image.open(source_path) as source:
        sprite = (
            remove_connected_background(source, background_kind)
            if background_kind is not None
            else source.convert("RGBA")
        )
        sprite.thumbnail(RUNTIME_SIZE, Image.Resampling.LANCZOS)

    if background_kind is not None:
        alpha = sprite.getchannel("A")
        edge = ImageDraw.Draw(alpha)
        width, height = alpha.size
        edge.rectangle((0, 0, width - 1, 5), fill=0)
        edge.rectangle((0, height - 6, width - 1, height - 1), fill=0)
        edge.rectangle((0, 0, 5, height - 1), fill=0)
        edge.rectangle((width - 6, 0, width - 1, height - 1), fill=0)
        sprite.putalpha(alpha)

    if sprite.size != RUNTIME_SIZE:
        raise ValueError(f"{source_path.name} is not square: {sprite.size}")
    if sprite.getchannel("A").getextrema()[0] != 0:
        raise ValueError(f"{source_path.name} has no transparent padding")

    destination.parent.mkdir(parents=True, exist_ok=True)
    sprite.save(destination, "WEBP", lossless=True, method=6, exact=True)
    with Image.open(destination) as result:
        if result.size != RUNTIME_SIZE or "A" not in result.getbands():
            raise ValueError(f"Invalid runtime sprite: {destination}")
    print(f"Wrote {destination.relative_to(ROOT)} ({destination.stat().st_size} bytes)")


def main() -> None:
    for stem, background_kind in ASSETS.items():
        build_sprite(stem, background_kind)


if __name__ == "__main__":
    main()
