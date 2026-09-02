"""Install and resize the v0.12 ImageGen collectible and navigation art."""

from pathlib import Path
from shutil import copy2

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
GENERATED = Path(r"C:\Users\hellb\.codex\generated_images\01a05916-8b99-7721-bceb-35b3a6460521")
SOURCE = ROOT / "docs" / "source-assets"
RUNTIME = ROOT / "public" / "assets"

ASSETS = {
    "treasure-science-beaker-v1": ("exec-983f0bee-6b37-46d3-8096-876386e0d7ce.png", 384),
    "nav-book-v1": ("exec-74d5de50-12fb-4614-8a71-9b0d76b1ebf9.png", 192),
    "nav-help-v1": ("exec-4f02dfc8-26f8-4d9b-9478-1ff5c77b95bf.png", 192),
    "treasure-science-gears-v1": ("exec-c989f299-ed59-4f41-91df-c7cb5a65c560.png", 384),
    "nav-home-v1": ("exec-4e3d28ca-e427-45bc-9d04-23b3574aaa67.png", 192),
    "treasure-gold-chest-v1": ("exec-07733947-b7d6-48c8-adca-4c7390f7b6ff.png", 384),
    "nav-sound-v1": ("exec-0fc28be2-4065-4b4c-b7a4-de84e9aa5b4b.png", 192),
    "nav-restart-v1": ("exec-d22fd5bb-88b1-46a2-99de-b994e21a3fe8.png", 192),
    "nav-mazes-v1": ("exec-cc1dd1ed-87d9-4a39-99b5-f442426ece7f.png", 192),
}


def main() -> None:
    SOURCE.mkdir(parents=True, exist_ok=True)
    RUNTIME.mkdir(parents=True, exist_ok=True)
    for stem, (filename, size) in ASSETS.items():
        generated = GENERATED / filename
        if not generated.exists():
            raise FileNotFoundError(generated)
        master = SOURCE / f"{stem}-master.png"
        copy2(generated, master)
        with Image.open(master) as image:
            rgba = image.convert("RGBA")
            if rgba.getextrema()[3][0] == 255:
                raise ValueError(f"{filename} has no transparent pixels")
            rgba.thumbnail((size, size), Image.Resampling.LANCZOS)
            output = RUNTIME / f"{stem}.webp"
            rgba.save(output, "WEBP", lossless=True, method=6)
            print(f"{output.relative_to(ROOT)} {rgba.width}x{rgba.height} {output.stat().st_size} bytes")


if __name__ == "__main__":
    main()
