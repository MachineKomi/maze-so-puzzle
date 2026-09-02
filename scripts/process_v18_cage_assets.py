"""Build the v0.18 complete-front cage sprite catalogue.

The ImageGen masters stay in ``docs/source-assets``. Runtime copies are
512-pixel lossless WebPs with real alpha, including transparent space between
the bars so each rescued friend can remain a separate layer behind the cage.
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
    "cage-golden-heart-front-v5": None,
    "cage-storybook-wood-front-v5": None,
    "cage-moon-silver-front-v5": "checkerboard",
    "cage-garden-vine-front-v5": "checkerboard",
}


def remove_connected_checkerboard(image: Image.Image) -> Image.Image:
    """Remove only pale neutral pixels connected to an outside edge."""

    rgb = image.convert("RGB")
    width, height = rgb.size
    pixels = rgb.load()
    visited = Image.new("L", rgb.size, 0)
    mask = visited.load()
    queue: deque[tuple[int, int]] = deque()

    def is_background(x: int, y: int) -> bool:
        red, green, blue = pixels[x, y]
        return min(red, green, blue) >= 205 and max(red, green, blue) - min(red, green, blue) <= 24

    for x in range(width):
        queue.extend(((x, 0), (x, height - 1)))
    for y in range(height):
        queue.extend(((0, y), (width - 1, y)))
    # Image generators sometimes paint an opaque checkerboard wholly enclosed
    # by the cage frame, so the four open bays need their own flood-fill seeds.
    for fraction in (0.16, 0.37, 0.63, 0.84):
        queue.append((round((width - 1) * fraction), height // 2))

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
            remove_connected_checkerboard(source)
            if background_kind == "checkerboard"
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
