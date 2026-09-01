"""Prepare paired flower-portal sprites for the browser runtime.

The Rose Heart ImageGen export contains genuine alpha. The two reference edits
visualised transparency as a very light neutral checkerboard, so this script
removes only the edge-connected near-white neutral field before resizing. The
enclosed cream petals remain opaque because their painted gold outline separates
them from the canvas edge. Generated masters remain untouched in docs.
"""

from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "source-assets"
DESTINATION = ROOT / "public" / "assets"
RUNTIME_SIZE = (512, 512)
CONTENT_SIZE = (470, 470)

ASSETS = {
    "portal-rose-heart-v1.png": False,
    "portal-mint-clover-v1.png": True,
    "portal-violet-moon-v1.png": True,
}


def is_checker_background(pixel: tuple[int, int, int, int]) -> bool:
    red, green, blue, _alpha = pixel
    return min(red, green, blue) >= 230 and max(red, green, blue) - min(red, green, blue) <= 14


def remove_edge_checkerboard(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    width, height = rgba.size
    pixels = rgba.load()
    background = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(1, height - 1):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        index = y * width + x
        if background[index] or not is_checker_background(pixels[x, y]):
            continue
        background[index] = 1
        if x:
            queue.append((x - 1, y))
        if x + 1 < width:
            queue.append((x + 1, y))
        if y:
            queue.append((x, y - 1))
        if y + 1 < height:
            queue.append((x, y + 1))

    alpha = Image.new("L", rgba.size, 255)
    alpha.putdata([0 if value else 255 for value in background])
    rgba.putalpha(alpha)
    return rgba


def validate_runtime(path: Path) -> None:
    image = Image.open(path).convert("RGBA")
    if image.size != RUNTIME_SIZE:
        raise ValueError(f"{path.name}: unexpected size {image.size}")
    if image.getchannel("A").getextrema() != (0, 255):
        raise ValueError(f"{path.name}: incomplete alpha range")
    width, height = image.size
    alpha = image.getchannel("A")
    outer_alpha = (
        list(alpha.crop((0, 0, width, 1)).get_flattened_data())
        + list(alpha.crop((0, height - 1, width, height)).get_flattened_data())
        + list(alpha.crop((0, 0, 1, height)).get_flattened_data())
        + list(alpha.crop((width - 1, 0, width, height)).get_flattened_data())
    )
    if any(outer_alpha):
        raise ValueError(f"{path.name}: non-transparent canvas edge")


def main() -> None:
    DESTINATION.mkdir(parents=True, exist_ok=True)
    for filename, needs_extraction in ASSETS.items():
        image = Image.open(SOURCE / filename)
        prepared = remove_edge_checkerboard(image) if needs_extraction else image.convert("RGBA")
        content = prepared.resize(CONTENT_SIZE, Image.Resampling.LANCZOS)
        runtime = Image.new("RGBA", RUNTIME_SIZE, (0, 0, 0, 0))
        offset = ((RUNTIME_SIZE[0] - CONTENT_SIZE[0]) // 2, (RUNTIME_SIZE[1] - CONTENT_SIZE[1]) // 2)
        runtime.alpha_composite(content, offset)
        destination = DESTINATION / filename
        runtime.save(destination, optimize=True)
        validate_runtime(destination)


if __name__ == "__main__":
    main()
