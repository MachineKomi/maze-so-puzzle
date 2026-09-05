"""Sample actual opaque/composited screenshot surfaces; not a WCAG certification.
Run after the shared UI browser sweep. Coordinates identify quiet interior pixels
in the named 1x screenshots, not source-colour approximations. Font tooling/Pillow
are offline evidence dependencies, never runtime/package.json dependencies.
"""
import hashlib
import json
from pathlib import Path
import sys
from PIL import Image
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parents[2]
evidence = Path(sys.argv[1]).resolve()
if evidence == root or root in evidence.parents:
    raise SystemExit("Evidence must remain outside the repository")

def luminance(rgb):
    linear = [channel / 255 / 12.92 if channel / 255 <= .04045 else ((channel / 255 + .055) / 1.055) ** 2.4 for channel in rgb]
    return sum(value * weight for value, weight in zip(linear, [.2126, .7152, .0722]))

samples = [
    ("core objective", "1280x720-maze12-normal.png", (780, 206), "44324f", 4.5),
    ("secondary label", "1280x720-maze12-normal.png", (1200, 140), "63516f", 4.5),
    ("dialog copy", "earned-keepsake-presentation.png", (700, 370), "44324f", 4.5),
    ("primary action", "earned-keepsake-presentation.png", (170, 450), "4d3548", 4.5),
    ("focus perimeter against cream clearance halo", "tv-focus-visible.png", None, "007f86", 3),
]
rows = []
for label, file, point, ink, minimum in samples:
    with Image.open(evidence / file) as image:
        background = image.convert("RGB").getpixel(point) if point else (255, 248, 237)
    foreground = tuple(bytes.fromhex(ink))
    lights = sorted([luminance(foreground), luminance(background)])
    ratio = (lights[1] + .05) / (lights[0] + .05)
    rows.append({"label": label, "screenshot": file, "point": point, "method": "screenshot pixel" if point else "specified opaque focus halo", "foreground": foreground, "background": background, "ratio": round(ratio, 3), "minimum": minimum, "passed": ratio >= minimum})

source = root / "docs/source-assets/fonts/fredoka/Fredoka-wdth-wght.ttf"
font_path = root / "public/assets/fonts/fredoka-ui.woff2"
font = TTFont(font_path)
cmap = font.getBestCmap()
required = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+−×÷=<>.,:;!?()[]'\"/—–"
font_record = {"path": str(font_path.relative_to(root)), "bytes": font_path.stat().st_size, "sha256": hashlib.sha256(font_path.read_bytes()).hexdigest(), "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(), "cmap_count": len(cmap), "missing_required": [f"U+{ord(character):04X}" for character in required if ord(character) not in cmap], "fallback_operators": [f"U+{ord(character):04X}" for character in "≤≥" if ord(character) not in cmap], "axes": [{"tag": axis.axisTag, "min": axis.minValue, "default": axis.defaultValue, "max": axis.maxValue} for axis in font["fvar"].axes], "gsub_features": sorted({record.FeatureTag for record in font["GSUB"].table.FeatureList.FeatureRecord})}
result = {"scope": "Representative rendered surface samples only; physical/assistive/dynamic-state review remains pending", "contrast": rows, "font": font_record}
(evidence / "contrast-font-proof.json").write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
print(json.dumps(result, indent=2))
if not all(row["passed"] for row in rows) or font_record["missing_required"]:
    raise SystemExit(1)
