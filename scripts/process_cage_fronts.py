"""Prepare the generated cage-front masters for the browser runtime.

The moon-silver ImageGen export visualised transparency as a near-white
checkerboard. Its RGB rendering is therefore paired with the clean alpha mask
from the original matching cage before every master is downsampled with
high-quality filtering. Generated masters remain untouched in docs.
"""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "source-assets"
DESTINATION = ROOT / "public" / "assets"

ASSETS = {
    "cage-golden-heart-front-v2-master.png": "cage-golden-heart-front-v2.png",
    "cage-storybook-wood-front-v2-master.png": "cage-storybook-wood-front-v2.png",
    "cage-moon-silver-front-v2-master.png": "cage-moon-silver-front-v2.png",
    "cage-garden-vine-front-v2-master.png": "cage-garden-vine-front-v2.png",
}
def main() -> None:
    DESTINATION.mkdir(parents=True, exist_ok=True)

    for source_name, destination_name in ASSETS.items():
        source = SOURCE / source_name
        image = Image.open(source)
        image = image.convert("RGBA")

        runtime = image.resize((512, 512), Image.Resampling.LANCZOS)
        if source_name.startswith("cage-moon-silver"):
            reference = Image.open(DESTINATION / "cage-moon-silver-v1.png").convert("RGBA")
            runtime.putalpha(reference.getchannel("A"))
        runtime.save(DESTINATION / destination_name, optimize=True)


if __name__ == "__main__":
    main()
