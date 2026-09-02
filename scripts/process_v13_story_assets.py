"""Archive and optimize the v0.13 ImageGen story character portraits."""

from pathlib import Path
from shutil import copy2

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
GENERATED = Path(r"C:\Users\hellb\.codex\generated_images\01a05916-8b99-7721-bceb-35b3a6460521")
SOURCE = ROOT / "docs" / "source-assets"
RUNTIME = ROOT / "public" / "assets"

ASSETS = {
    "story-professor-poggle-v1": "exec-f11f29ef-f7a0-4ba3-9e3f-e3a934ce62e2.png",
    "story-sprig-v1": "exec-0241a443-4442-482b-a9af-e56eb9be661e.png",
}


def main() -> None:
    SOURCE.mkdir(parents=True, exist_ok=True)
    RUNTIME.mkdir(parents=True, exist_ok=True)
    for stem, filename in ASSETS.items():
        generated = GENERATED / filename
        if not generated.exists():
            raise FileNotFoundError(generated)
        master = SOURCE / f"{stem}-master.png"
        copy2(generated, master)
        with Image.open(master) as image:
            portrait = image.convert("RGB")
            portrait.thumbnail((512, 512), Image.Resampling.LANCZOS)
            output = RUNTIME / f"{stem}.webp"
            portrait.save(output, "WEBP", quality=92, method=6)
            print(
                f"{output.relative_to(ROOT)} "
                f"{portrait.width}x{portrait.height} {output.stat().st_size} bytes"
            )


if __name__ == "__main__":
    main()
