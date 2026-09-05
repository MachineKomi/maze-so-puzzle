"""Deterministic local Fredoka packaging. No network, no source-art changes."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

root = Path(__file__).resolve().parents[1]
source = root / "docs/source-assets/fonts/fredoka/Fredoka-wdth-wght.ttf"
target = root / "public/assets/fonts/fredoka-ui.woff2"
font = TTFont(source, recalcTimestamp=False)
instantiateVariableFont(font, {"wdth": 100}, inplace=True)
font.flavor = "woff2"
target.parent.mkdir(parents=True, exist_ok=True)
font.save(target)
print(f"{target.relative_to(root)}: {target.stat().st_size} bytes; real wght 300–700; full source character map")
