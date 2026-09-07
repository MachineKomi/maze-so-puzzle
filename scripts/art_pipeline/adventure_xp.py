"""One native-alpha pickup derivative. No matting, semantic edits or new source art."""
from pathlib import Path
import hashlib
import json
from PIL import Image, __version__

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "docs/source-assets/production/adventure-xp-v1/generator.png"
OUT = ROOT / "public/assets/adventure-xp-v1.png"
RECORD = ROOT / "docs/source-assets/records/adventure-xp-v1-source.json"

def facts(path):
    return {"path": path.relative_to(ROOT).as_posix(), "sha256": hashlib.sha256(path.read_bytes()).hexdigest(), "bytes": path.stat().st_size}

with Image.open(SOURCE) as image:
    assert image.mode == "RGBA" and image.getchannel("A").getextrema() == (0,255), "Native transparency required"
    bounds = image.getchannel("A").point(lambda value: 255 if value > 3 else 0).getbbox()
    assert bounds and bounds[0] > 0 and bounds[1] > 0 and bounds[2] < image.width and bounds[3] < image.height
    cut = image.crop(bounds)
    height = 114
    width = round(cut.width * height / cut.height)
    small = cut.convert("RGBa").resize((width,height), Image.Resampling.LANCZOS).convert("RGBA")
    atlas = Image.new("RGBA", (128,128))
    atlas.paste(small, ((128-width)//2,7))
    atlas.save(OUT, optimize=True)
record = {
    "$schema":"../schema/art-source.schema.json", "schemaVersion":1,
    "recordId":"adventure-xp-v1-source", "id":"adventure-xp", "artVersion":1,
    "family":"reward", "runtimeStatus":"active", "sourceStatus":"source-backed",
    "approvalStatus":"candidate", "validationProfile":"strict-v1", "recipeVersion":"adventure-xp-native-alpha-v1",
    "promptEvidence":{"fidelity":"exact", "historyPath":"docs/plans/LOOT-03C-adventure-xp-execution.md",
        "assetNamedInHistory":True,"outputIds":["exec-e2135ef3-bdaa-40e1-b126-74a39be2c665.png"],
        "promptFile":{k:v for k,v in facts(SOURCE.with_name("prompt.txt")).items() if k != "bytes"},
        "notes":"Built-in image_gen.imagegen, 2026-09-07. One fresh image; no references. Agent qualification is not Human art approval."},
    "sources":[{**facts(SOURCE),"relationship":"generator-original","evidence":"Exact built-in output copied without alteration; native alpha preserved."}],
    "derivatives":[{**facts(OUT),"id":"field-and-book", "width":128,"height":128,"format":"png","mode":"RGBA",
        "alphaMode":"straight","decodedBytesUpperBound":65536,"profile":"field-and-book","derivativeRevision":1,
        "runtimeStatus":"active","loadingPhase":"on-first-eligible-maze-or-book-completion",
        "encoder":{"name":"Pillow","version":__version__,"options":{"optimize":True,"resample":"premultiplied-LANCZOS","visibleHeight":114,"marginBoundsAlphaThreshold":3}}}],
    "geometry":{"class":"floating-crystal","pivot":[.5,.5],"visibleBounds":[((128-width)//2)/128,7/128,width/128,114/128],"safeInset":[7/128,7/128,7/128,7/128]},
    "knownUnknowns":["Human tiny-sprite aesthetic feedback remains queued; generated source is taller and more painterly than the prompt's compact-facet target."],
    "rights":{"originClaim":"Original image generated for Maze so Puzzle using built-in imagegen.","licenceStatus":"pending-owner-review","notes":"No third-party reference image supplied; no Human rights review fabricated."},
    "rollback":{"method":"Revert XP runtime references and this derivative as one feature; preserve source and proof for review. Existing reward art is untouched."}
}
RECORD.write_text(json.dumps(record,indent=2)+"\n",encoding="utf8")
print(json.dumps({"source":facts(SOURCE),"derivative":facts(OUT),"sourceBounds":bounds,"visible": [width,height]}))
