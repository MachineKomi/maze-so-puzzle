"""Clear exactly two Human-named matte islands, preserving every other pixel.

Forward-only v05 source/runtime files; no redraw, no global white removal, no
RGB dilation of the approved master, and no existing catalogue changes.
"""
from __future__ import annotations

import argparse
import copy
import json
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

from cutout import premultiplied_resize
from encode import encoder_environment, save_image
from model import ROOT, sha256_file, image_facts, validate_record_shape, read_json
from mgjrpg02_home_hero_v04_publish import _connected_component
from mgjrpg02_publish import write_json, _publish_without_overwrite

SCRIPT = "scripts/art_pipeline/home_hero_v05_cleanup.py"
AUTHORITY = ROOT / "docs/source-assets/publication/home-hero-v05-cleanup-authority.json"
OLD_RECORD = ROOT / "docs/source-assets/records/home-hero-splash-mgjrpg02-v04-source.json"
MASTER = Path("docs/source-assets/production/mgjrpg-02/batch-30-home-hero-pocket-cleanup/home-hero-splash-v05-transparent-master.png")
WEBP = Path("public/assets/mgjrpg-02/brand/home-hero-splash-v05-front-door-1024-r01.webp")
PNG = Path("public/assets/mgjrpg-02/brand/home-hero-splash-v05-front-door-1024-r01.png")
RECORD = ROOT / "docs/source-assets/records/home-hero-splash-mgjrpg02-v05-source.json"
REPORT = ROOT / "docs/source-assets/publication/home-hero-v05-cleanup-candidates.json"
APPROVAL = ROOT / "docs/source-assets/publication/home-hero-v05-cleanup-approval.json"
PROOF = Path("docs/source-assets/production/mgjrpg-02/batch-30-home-hero-pocket-cleanup/alpha-pocket-proof.png")


def facts(path: Path, relative: Path | None = None) -> dict:
    return {"path": (relative or path.relative_to(ROOT)).as_posix(),
            "sha256": sha256_file(path), "bytes": path.stat().st_size}


def clean() -> tuple[Image.Image, Image.Image, list[dict]]:
    authority = read_json(AUTHORITY)
    source = ROOT / authority["sourcePath"]
    if sha256_file(source) != authority["sourceSha256"]:
        raise ValueError("Approved Home source drift")
    with Image.open(source) as opened:
        original = opened.convert("RGBA")
    if original.size != (1448, 1086):
        raise ValueError("Unexpected source dimensions")
    before = np.asarray(original, dtype=np.uint8)
    after = before.copy()
    classifier = authority["matteClassifier"]
    rgb = np.asarray(classifier["rgb"], dtype=np.int16)
    candidates = (np.max(np.abs(before[:, :, :3].astype(np.int16) - rgb), axis=2)
                  <= classifier["maximumAbsoluteChannelDistance"]) & (before[:, :, 3] > 0)
    allowed = np.zeros(before.shape[:2], dtype=np.bool_)
    components = []
    for expected in authority["components"]:
        component = _connected_component(candidates, tuple(expected["seed"]))
        ys, xs = np.where(component)
        bounds = [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1]
        count = int(np.count_nonzero(component))
        if count != expected["pixelCount"] or bounds != expected["boundsLTRB"]:
            raise ValueError(f"Exact component guard failed: {expected['name']}")
        if not np.all(before[component, 3] == 255):
            raise ValueError("Only the measured fully opaque background pockets are authorized")
        if np.any(component[0]) or np.any(component[-1]) or np.any(component[:, 0]) or np.any(component[:, -1]):
            raise ValueError("Named background pocket is not enclosed")
        if np.any(allowed & component):
            raise ValueError("Named components overlap")
        allowed |= component
        after[component, 3] = 0
        components.append({**expected, "pixelsCleared": count})
    if not np.array_equal(before[:, :, :3], after[:, :, :3]):
        raise ValueError("Unauthorized RGB change")
    if not np.array_equal(before[~allowed], after[~allowed]):
        raise ValueError("Unauthorized pixels outside the exact two components changed")
    if np.count_nonzero(before[:, :, 3] != after[:, :, 3]) != 579:
        raise ValueError("Unexpected alpha edit count")
    return original, Image.fromarray(after, "RGBA"), components


def proof_sheet(before: Image.Image, after: Image.Image) -> Image.Image:
    # A comparison composite is evidence, not a replacement artwork source.
    sheet = Image.new("RGB", (1056, 512), "#faf7eb")
    draw = ImageDraw.Draw(sheet)
    crops = [(930, 135, 1025, 260), (350, 715, 425, 815)]
    for row, (box, name) in enumerate(zip(crops, ("Hair pocket", "Forearm pocket"))):
        for column, (art, label) in enumerate(((before, "v04 before"), (after, "v05 after"))):
            tile = Image.new("RGBA", (500, 206), "#587885")
            td = ImageDraw.Draw(tile)
            for y in range(0, 206, 16):
                for x in range(0, 500, 16):
                    if (x // 16 + y // 16) % 2:
                        td.rectangle((x, y, x + 15, y + 15), fill="#bfcfae")
            crop = art.crop(box)
            crop.thumbnail((460, 194), Image.Resampling.NEAREST)
            # Enlarge the evidence crop only; this image is never a source.
            scale = min(460 / crop.width, 194 / crop.height)
            crop = crop.resize((round(crop.width * scale), round(crop.height * scale)), Image.Resampling.NEAREST)
            tile.alpha_composite(crop, ((500 - crop.width) // 2, (206 - crop.height) // 2))
            x, y = 16 + column * 524, 38 + row * 250
            sheet.paste(tile.convert("RGB"), (x, y))
            draw.text((x, y - 22), f"{name}: {label}", fill="#292435")
    return sheet


def reviewed(record: dict, report: dict, candidate_hash: str | None = None) -> dict:
    if not APPROVAL.exists():
        return record
    decision = read_json(APPROVAL)
    if decision.get("schema") != "maze-home-alpha-approval/v1" or decision.get("scope") != "runtime-publish":
        raise ValueError("Invalid Home approval scope")
    if decision.get("candidateReportSha256") != sha256_file(REPORT):
        raise ValueError("Home approval candidate evidence changed")
    if candidate_hash is not None and decision.get("candidateRecordSha256") != candidate_hash:
        raise ValueError("Home approval candidate provenance changed")
    if decision.get("sourceSha256") != report["source"]["sha256"]:
        raise ValueError("Home approval source mismatch")
    selected = decision.get("entries", [])
    entries = {entry["path"]: entry for entry in selected}
    if len(selected) != 2 or len(entries) != 2 or set(entries) != {WEBP.as_posix(), PNG.as_posix()}:
        raise ValueError("Home approval delivery set mismatch")
    result = copy.deepcopy(record)
    for derivative, profile in zip(result["derivatives"], result["build"]["profiles"]):
        entry = entries[derivative["path"]]
        if any(entry.get(k) != derivative[k] for k in ("path", "sha256", "bytes")):
            raise ValueError("Home approval runtime hash/size mismatch")
        ceiling = entry.get("maxEncodedBytes")
        if not isinstance(ceiling, int) or ceiling < derivative["bytes"]:
            raise ValueError("Home approval byte allocation too small")
        derivative["runtimeStatus"] = "active"
        profile["maxEncodedBytes"] = ceiling
    result["approvalStatus"], result["runtimeStatus"] = "approved", "active"
    result["approvalEvidence"] = {"approvedBy": decision["approvedBy"], "approvedAt": decision["approvedAt"],
        "scope": "runtime-publish", "evidencePath": APPROVAL.relative_to(ROOT).as_posix(), "evidenceSha256": sha256_file(APPROVAL)}
    result["knownUnknowns"] = [note for note in result["knownUnknowns"] if not note.startswith("v05 candidate only;")]
    errors = validate_record_shape(result, result["recordId"])
    if errors:
        raise ValueError(errors)
    return result


def build(stage: Path) -> tuple[dict, dict]:
    original, cleaned, components = clean()
    for relative in (MASTER, WEBP, PNG, PROOF):
        (stage / relative).parent.mkdir(parents=True, exist_ok=True)
    save_image(cleaned, stage / MASTER, "png", {"compress_level": 9, "optimize": False})
    runtime = premultiplied_resize(cleaned, (1024, 768))
    derivatives = []
    for relative, fmt, options in ((WEBP, "webp", {"lossless": True, "method": 6, "exact": True}),
                                   (PNG, "png", {"compress_level": 9, "optimize": False})):
        encoder = save_image(runtime, stage / relative, fmt, options)
        image = image_facts(stage / relative)
        image.pop("colorMetadata", None)
        derivatives.append({**facts(stage / relative, relative), **image, "id": f"home-hero-v05-1024-{fmt}",
            "profile": f"front-door-hero-1024-{fmt}", "derivativeRevision": 1,
            "runtimeStatus": "dormant", "loadingPhase": "title-critical" if fmt == "webp" else "responsive-image-fallback-only",
            "encoder": {k: encoder[k] for k in ("name", "version", "options")}})
    save_image(proof_sheet(original, cleaned), stage / PROOF, "png", {"compress_level": 9, "optimize": False})
    record = copy.deepcopy(read_json(OLD_RECORD))
    record.update(recordId="home-hero-splash-mgjrpg02-v05-source", artVersion=5,
                  runtimeStatus="dormant", approvalStatus="candidate",
                  derivativeRecipeVersion="home-hero-exact-alpha-pockets-r01")
    record.pop("approvalEvidence", None)
    authority = read_json(AUTHORITY)
    if not any(item["path"] == authority["sourcePath"] for item in record["sources"]):
        record["sources"].append({**facts(ROOT / authority["sourcePath"]),
            "relationship": "approved v04 transparent master",
            "evidence": "Immutable source for the exact two-component alpha-only cleanup."})
    record["sources"].extend([
        {**facts(stage / MASTER, MASTER), "relationship": "deterministic v05 transparent delivery master",
         "evidence": "Only 579 alpha values changed; every RGB value and every pixel outside the two guarded components is identical."},
    ])
    record["derivatives"] = derivatives
    # strict-v2 binds build.sourcePath to the selected immutable generator
    # output. As with v04's bounded composite, the dedicated humanEdits script
    # and candidate report carry the exact derived-master input and masks;
    # the generic raw-source build is not the reconstruction command.
    original_build = record["build"]
    record["build"] = {"sourcePath": original_build["sourcePath"], "operation": "cutout-resize",
        "backgroundExtraction": copy.deepcopy(original_build["backgroundExtraction"]), "profiles": [
            {"id": d["profile"], "outputPath": d["path"], "width": 1024, "height": 768,
             "format": d["format"], "maxEncodedBytes": 1048576, "clearAlphaBelow": 0,
             "edgeDilationPixels": 0, "minimumAlphaComponentPixels": 1,
             "encoder": {"options": d["encoder"]["options"]}}
            for d in derivatives]}
    record["humanEdits"] = [{"kind": "deterministic-delivery-processing", "script": SCRIPT,
        "description": "Human-selected precise alpha-mask cleanup: clear exactly 417 hair-pocket and 162 forearm-pocket opaque matte pixels in the approved v04 transparent master; preserve all RGB and all other alpha; premultiplied downsample to 1024x768; lossless WebP and PNG fallback. Reproduce with this dedicated script, not the generic raw-generator build; candidate report records actual v04 input and v05 output hashes."}]
    record["knownUnknowns"].append("v05 candidate only; root must inspect the bounded alpha proof and approve measured runtime bytes before changing the Home catalogue.")
    record["rollback"] = {"method": "Restore the Home hero catalogue to the unchanged v04 WebP. Both approved v04 source and runtime remain untouched."}
    errors = validate_record_shape(record, record["recordId"])
    if errors:
        raise ValueError(errors)
    report = {"schema": "maze-home-alpha-candidate/v1", "preparedOn": "2026-09-05", "approvalStatus": "candidate",
        "authority": facts(AUTHORITY), "source": facts(ROOT / authority["sourcePath"]),
        "transparentMaster": facts(stage / MASTER, MASTER), "proof": facts(stage / PROOF, PROOF),
        "components": components, "changedAlphaPixels": 579, "changedRgbPixels": 0, "changedPixelsOutsideMask": 0,
        "encoderEnvironment": encoder_environment(), "entries": derivatives,
        "additionalPublicBytes": sum(d["bytes"] for d in derivatives),
        "rollback": "v04 files and existing source record are preserved without changes"}
    return record, report


def run(check: bool) -> dict:
    with tempfile.TemporaryDirectory(prefix="maze-home-alpha-") as temporary:
        stage = Path(temporary)
        record, report = build(stage)
        staged_record = stage / RECORD.name
        write_json(staged_record, record)
        if check:
            write_json(staged_record, reviewed(record, report, sha256_file(staged_record)))
        staged_pairs = [(stage / relative, ROOT / relative) for relative in (MASTER, WEBP, PNG, PROOF)]
        staged_pairs.append((staged_record, RECORD))
        if check:
            for staged, destination in staged_pairs:
                if not destination.is_file() or staged.read_bytes() != destination.read_bytes():
                    raise ValueError(f"Home candidate byte drift: {destination}")
            if read_json(REPORT) != report:
                raise ValueError("Home candidate report drift")
        else:
            if REPORT.exists() or any(destination.exists() for _, destination in staged_pairs):
                raise FileExistsError("Home v05 is immutable; output already exists")
            for staged, destination in staged_pairs:
                destination.parent.mkdir(parents=True, exist_ok=True)
                _publish_without_overwrite(staged, destination)
            write_json(REPORT, report)
    return {"changedAlphaPixels": 579, "changedRgbPixels": 0, "additionalPublicBytes": report["additionalPublicBytes"],
            "files": [facts(ROOT / relative) for relative in (MASTER, WEBP, PNG, PROOF)]}


def publish_reviewed() -> dict:
    if not APPROVAL.exists():
        raise ValueError("Root's exact-byte Home publication approval is required")
    report, original = read_json(REPORT), read_json(RECORD)
    for item in [report["source"], report["transparentMaster"], *report["entries"]]:
        if sha256_file(ROOT / item["path"]) != item["sha256"]:
            raise ValueError("Home publication input drift")
    candidate_hash = sha256_file(RECORD) if original["approvalStatus"] == "candidate" else None
    record = reviewed(original, report, candidate_hash)
    write_json(RECORD, record)
    catalogue_path = ROOT / "src/generated/mgjrpg02Art.ts"
    catalogue = catalogue_path.read_text(encoding="utf-8")
    lines = catalogue.splitlines(keepends=True)
    matches = [index for index, line in enumerate(lines) if line.lstrip().startswith('"home-hero-splash":')]
    if len(matches) != 1:
        raise ValueError("Home catalogue entry is missing or ambiguous")
    line = lines[matches[0]]
    if 'home-hero-splash-v04-front-door-1024-r01.webp' not in line and 'home-hero-splash-v05-front-door-1024-r01.webp' not in line:
        raise ValueError("Home catalogue moved outside the reviewed v04/v05 lineage")
    line = line.replace('artVersion: 4,', 'artVersion: 5,')
    line = line.replace('profile: "front-door-hero-1024"', 'profile: "front-door-hero-1024-webp"')
    line = line.replace('home-hero-splash-v04-front-door-1024-r01.webp', 'home-hero-splash-v05-front-door-1024-r01.webp')
    line = line.replace('home-hero-splash-mgjrpg02-v04-source', 'home-hero-splash-mgjrpg02-v05-source')
    line = line.replace('fallbackSrc: "/assets/mgjrpg-02/brand/home-hero-splash-v03-front-door-1024-r01.webp"',
                        'fallbackSrc: "/assets/mgjrpg-02/brand/home-hero-splash-v05-front-door-1024-r01.png"')
    lines[matches[0]] = line
    catalogue_path.write_text(''.join(lines), encoding="utf-8")
    previous = read_json(OLD_RECORD)
    previous["runtimeStatus"] = "superseded"
    for derivative in previous["derivatives"]:
        derivative["runtimeStatus"] = "superseded"
    write_json(OLD_RECORD, previous)
    return {"publishedRecords": 1, "pixelsChanged": 0, "catalogue": "v05 WebP with same-version PNG fallback"}


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--prepare", action="store_true")
    group.add_argument("--check", action="store_true")
    group.add_argument("--publish-reviewed", action="store_true")
    args = parser.parse_args()
    print(json.dumps(publish_reviewed() if args.publish_reviewed else run(args.check), indent=2))
