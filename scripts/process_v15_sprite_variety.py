"""Install the v0.15 friend, enemy, and weapon ImageGen sprites.

Two friend exports visualised transparency as a pale checkerboard. Their raw
masters are preserved in docs/source-assets, while a connected edge-background
mask produces clean transparent runtime sprites. The other ImageGen exports
already contain genuine alpha.
"""

from collections import deque
from pathlib import Path
from shutil import copy2

from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
GENERATED = Path(r"C:\Users\hellb\.codex\generated_images\01a05916-8b99-7721-bceb-35b3a6460521")
SOURCE = ROOT / "docs" / "source-assets"
RUNTIME = ROOT / "public" / "assets"

ASSETS = {
    "animal-otter-v1": ("exec-950f3c3f-789b-47c0-a67e-a7c155fc2e60.png", False),
    "animal-lamb-v1": ("exec-57f084d6-ce40-4f97-bf53-54bad6882337.png", True),
    "animal-capybara-v1": ("exec-cba746d6-882e-4c8b-80cb-75a874415880.png", True),
    "enemy-acorn-knight-v1": ("exec-cabb2a1c-012b-4b60-8b25-e7f34d9216e8.png", False),
    "enemy-bubble-dragon-v1": ("exec-fb52ea12-5734-4e41-a5d0-a50fd20fb91b.png", False),
    "enemy-candy-mimic-v1": ("exec-169372b7-88cf-44cd-8407-0f00028affaf.png", False),
    "weapon-comet-spear-v1": ("exec-b5375e5e-a3db-4e42-81ff-0bb0211693d5.png", False),
    "weapon-bubble-bow-v1": ("exec-cd32e254-7053-49ea-bd73-81695670a31d.png", False),
    "weapon-cupcake-mace-v1": ("exec-82dc31d4-7eb1-4017-bd81-e80b8cccfc98.png", False),
}


def remove_connected_checkerboard(image: Image.Image) -> Image.Image:
    rgb = image.convert("RGB")
    width, height = rgb.size
    pixels = rgb.load()
    background = Image.new("L", rgb.size, 0)
    background_pixels = background.load()
    queue: deque[tuple[int, int]] = deque()

    def is_background_candidate(x: int, y: int) -> bool:
        red, green, blue = pixels[x, y]
        return min(red, green, blue) >= 205 and max(red, green, blue) - min(red, green, blue) <= 24

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if background_pixels[x, y] or not is_background_candidate(x, y):
            continue
        background_pixels[x, y] = 255
        if x > 0:
            queue.append((x - 1, y))
        if x + 1 < width:
            queue.append((x + 1, y))
        if y > 0:
            queue.append((x, y - 1))
        if y + 1 < height:
            queue.append((x, y + 1))

    softened_background = background.filter(ImageFilter.GaussianBlur(1.1))
    alpha = softened_background.point(lambda value: 255 - value)
    rgba = rgb.convert("RGBA")
    rgba.putalpha(alpha)
    return rgba


def main() -> None:
    SOURCE.mkdir(parents=True, exist_ok=True)
    RUNTIME.mkdir(parents=True, exist_ok=True)
    for stem, (filename, remove_checkerboard) in ASSETS.items():
        generated = GENERATED / filename
        if not generated.exists():
            raise FileNotFoundError(generated)
        master = SOURCE / f"{stem}-master.png"
        copy2(generated, master)
        with Image.open(master) as source_image:
            rgba = remove_connected_checkerboard(source_image) if remove_checkerboard else source_image.convert("RGBA")
            rgba.thumbnail((512, 512), Image.Resampling.LANCZOS)
            if rgba.getextrema()[3][0] != 0:
                raise ValueError(f"{filename} has no fully transparent pixels")
            output = RUNTIME / f"{stem}.png"
            rgba.save(output, "PNG", optimize=True)
            print(f"{output.relative_to(ROOT)} {rgba.width}x{rgba.height} {output.stat().st_size} bytes")


if __name__ == "__main__":
    main()
