"""Bounded recovery of authored coral material rejected as a red matte key.

The original RGB source is immutable. Only alpha classification is corrected;
the established matte decontamination supplies delivery edges. No drawing,
generation, global extractor edit, or approved optical replacement occurs.
"""
from __future__ import annotations

import argparse
import copy
import json
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

import mgjrpg02_batch01 as matte
import ui_presentation_candidates as review
from cutout import register_cutout, remove_small_alpha_components, dilate_hidden_rgb, premultiplied_resize
from encode import save_image, encoder_environment
from model import ROOT, sha256_file, image_facts, validate_record_shape
from mgjrpg02_publish import (
    read_json, write_json, _publish_without_overwrite, alpha_weighted_visual_center,
)

SCRIPT = "scripts/art_pipeline/tessera_alpha_recovery.py"
RECORD_ROOT = ROOT / "docs/source-assets/records"
OLD_REPORT = ROOT / "docs/source-assets/publication/ui-correction-actor-presentation-candidates.json"
REPORT = ROOT / "docs/source-assets/publication/ui-correction-tessera-recovery-candidates.json"
AUTHORITY = ROOT / "docs/source-assets/publication/ui-correction-tessera-recovery-authority.json"
PRODUCTION = Path("docs/source-assets/production/tessera-alpha-recovery")
RUNTIME = Path("public/assets/mgjrpg-02/presentation/tessera-dolphin-v01-presentation-512-r02.webp")
RECORD_ID = "tessera-dolphin-ui-correction-alpha-recovery-r02-source"
RECORD = RECORD_ROOT / f"{RECORD_ID}.json"
TS = ROOT / "src/generated/uiTesseraPresentationArt.ts"
# These source-space regions enclose the three coral fin groups and mouth.
# No background classifier outside these guarded regions changes.
REGIONS = ((300, 625, 480, 805), (660, 565, 970, 860), (350, 720, 560, 950), (460, 930, 830, 1220))


def bind_review() -> None:
    review.REPORT, review.TS, review.IDS = REPORT, TS, ("tessera-dolphin",)


def recover(source: Image.Image) -> tuple[Image.Image, Image.Image, Image.Image, dict]:
    observed = np.asarray(source.convert("RGB"), dtype=np.uint8)
    if source.size != (1254, 1254):
        raise ValueError("Unexpected approved source dimensions")
    allowed = np.zeros(observed.shape[:2], dtype=np.bool_)
    for left, top, right, bottom in REGIONS:
        allowed[top:bottom, left:right] = True
    original_classifier = matte.matte_key_spill_mask
    background = matte.estimate_uniform_matte(source)["rgb"]
    if background != [241, 4, 155]:
        raise ValueError("Pinned matte drift")
    old, _ = matte.extract_uniform_matte(source, background, minimum_component_pixels=3)

    def bounded_classifier(pixels, color, *, dominance_threshold=96.0):
        original = original_classifier(pixels, color, dominance_threshold=dominance_threshold)
        # The matte has two strong channels, unlike the coral fins where green
        # exceeds blue. Preserve the original decision everywhere else.
        dual_magenta = np.minimum(pixels[:, :, 0], pixels[:, :, 2]) - pixels[:, :, 1] > dominance_threshold
        return np.where(allowed, dual_magenta, original)

    try:
        matte.matte_key_spill_mask = bounded_classifier
        candidate, _ = matte.extract_uniform_matte(source, background, minimum_component_pixels=3)
    finally:
        matte.matte_key_spill_mask = original_classifier
    old_pixels, candidate_pixels = np.asarray(old), np.asarray(candidate)
    recovered = old_pixels.copy()
    mask = candidate_pixels[:, :, 3] > old_pixels[:, :, 3]
    # The local edge equation can affect a few neighbouring existing pixels;
    # clip recovery to the Human/root-authorized source-space regions.
    mask &= allowed
    recovered[mask] = candidate_pixels[mask]
    if not np.array_equal(old_pixels[~mask], recovered[~mask]):
        raise ValueError("Recovery escaped the exact alpha mask")
    if np.any(recovered[:, :, 3] < old_pixels[:, :, 3]):
        raise ValueError("Recovery must not erase existing source opacity")
    # This master demonstrates that no original RGB pixel has been repainted.
    source_rgba = np.dstack((observed, recovered[:, :, 3]))
    if not np.array_equal(source_rgba[:, :, :3], observed):
        raise ValueError("Original RGB changed")
    ys, xs = np.where(mask)
    count = int(mask.sum())
    if count != 81468:
        raise ValueError(f"Unexpected recovery extent: {count}")
    info = {"matteRgb": background, "originalClassifier": "single-red-key", "correctedClassifier": "dual-channel-magenta-within-four-guarded-regions",
        "regionsLTRB": [list(region) for region in REGIONS], "restoredAlphaPixels": count,
        "restorationBoundsLTRB": [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1],
        "changedPixelsOutsideMask": 0, "changedOriginalRgbPixels": 0,
        "deliveryColor": "Unchanged original extraction outside the recovered mask. Inside it, original opaque source colors and the established local matte decontamination supply delivery RGB; no generated or painted color.",
        "opaqueRecoveredPixels": int(np.count_nonzero(mask & (recovered[:, :, 3] == 255)))}
    return old, Image.fromarray(recovered, "RGBA"), Image.fromarray(source_rgba, "RGBA"), info


def proof(source: Image.Image, old: Image.Image, corrected: Image.Image) -> Image.Image:
    sheet = Image.new("RGB", (1232, 876), "#fff5db")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default(size=16)
    for row, background in enumerate(("#fff5db", "#302c46")):
        draw.rectangle((0, row * 438, 1232, (row + 1) * 438), fill=background)
        for column, (art, label) in enumerate(((source, "Immutable original"), (old, "Old extraction"), (corrected, "Bounded alpha recovery"))):
            rendered = premultiplied_resize(art.convert("RGBA"), (384, 384))
            x, y = 16 + column * 408, row * 438 + 42
            sheet.paste(rendered, (x, y), rendered)
            draw.text((x, y - 28), label, font=font, fill="#392f51" if row == 0 else "#fff5db")
    return sheet


def run(check: bool) -> dict:
    bind_review()
    old_entry = next(e for e in read_json(OLD_REPORT)["entries"] if e["id"] == "tessera-dolphin")
    source_path = ROOT / old_entry["sourcePath"]
    if sha256_file(source_path) != old_entry["sourceSha256"]:
        raise ValueError("Approved source drift")
    with tempfile.TemporaryDirectory(prefix="maze-tessera-alpha-") as temporary:
        stage = Path(temporary)
        with Image.open(source_path) as source:
            source.load()
            old, corrected, source_rgba, measurement = recover(source)
            proof_image = proof(source, old, corrected)
        relative_files = []
        for name, image in (("approved-rgb-corrected-alpha-master.png", source_rgba),
                            ("recovered-delivery-master.png", corrected),
                            ("old-extraction.png", old), ("comparison-proof.png", proof_image)):
            relative = PRODUCTION / name
            (stage / relative).parent.mkdir(parents=True, exist_ok=True)
            save_image(image, stage / relative, "png", {"compress_level": 9, "optimize": False})
            relative_files.append(relative)
        changed = np.asarray(corrected)[:, :, 3] > np.asarray(old)[:, :, 3]
        mask_path = PRODUCTION / "exact-restored-alpha-mask.png"
        save_image(Image.fromarray(np.where(changed, 255, 0).astype(np.uint8), "L"), stage / mask_path,
                   "png", {"compress_level": 9, "optimize": False})
        relative_files.append(mask_path)
        runtime = register_cutout(corrected, (512, 512), target_box=[0.1, 0.08, 0.9, 0.94], align=[0.5, 1.0], alpha_threshold=3)
        runtime = matte.clear_low_alpha(runtime, 2)
        runtime = remove_small_alpha_components(runtime, minimum_pixels=2, alpha_threshold=3)
        runtime = dilate_hidden_rgb(runtime, 4)
        runtime, _ = matte.normalize_visible_black(runtime)
        (stage / RUNTIME).parent.mkdir(parents=True, exist_ok=True)
        encoder = save_image(runtime, stage / RUNTIME, "webp", {"lossless": True, "quality": 100, "method": 6, "exact": True})
        relative_files.append(RUNTIME)
        from builder import alpha_bounds
        bounds = alpha_bounds(runtime, 3)["pixelsLTRB"]
        x0, y0, x1, y1 = bounds
        geometry = {**old_entry["geometry"], "visibleBounds": [x0/512, y0/512, (x1-x0)/512, (y1-y0)/512],
            "safeInset": [y0/512, (512-x1)/512, (512-y1)/512, x0/512], "floatCenter": alpha_weighted_visual_center(runtime)}
        record = copy.deepcopy(read_json(RECORD_ROOT / f"{old_entry['sourceRecordId']}.json"))
        record.update(recordId=RECORD_ID, approvalStatus="candidate", runtimeStatus="dormant",
                      derivativeRecipeVersion="tessera-bounded-coral-alpha-recovery-r02", geometry=geometry)
        record.pop("approvalEvidence", None)
        record["knownUnknowns"].append("512px candidate only; root must review the alpha recovery proof and exact bytes before replacing only the new contextual presentation derivative.")
        facts = image_facts(stage / RUNTIME)
        facts.pop("colorMetadata", None)
        derivative = {**record["derivatives"][0], **facts, "id": "tessera-dolphin-presentation-512-r02", "path": RUNTIME.as_posix(),
            "sha256": sha256_file(stage / RUNTIME), "bytes": (stage / RUNTIME).stat().st_size, "profile": "friend-presentation-512",
            "derivativeRevision": 2, "runtimeStatus": "dormant", "loadingPhase": "visible-contextual-presentation-only",
            "encoder": {k: encoder[k] for k in ("name", "version", "options")}}
        record["derivatives"] = [derivative]
        record["humanEdits"] = [{"kind": "deterministic-delivery-processing", "script": SCRIPT,
            "description": "Within four measured coral-fin/mouth regions only, restore original opacity misclassified by the old single-red key. Original RGB source is unchanged; established matte decontamination supplies recovered boundary colors. Reproduce with this dedicated bounded script. Existing approved optical bytes remain unchanged."}]
        record["build"]["profiles"] = [{"id": "friend-presentation-512", "outputPath": RUNTIME.as_posix(), "width": 512, "height": 512,
            "format": "webp", "maxEncodedBytes": 102400, "encoder": {"options": encoder["options"]}}]
        record["rollback"] = {"method": "Remove this recovery presentation extension. Keep approved field optical files untouched; candidate r01 remains separate historical preparation evidence."}
        errors = validate_record_shape(record, RECORD_ID)
        if errors:
            raise ValueError(errors)
        entry = {**old_entry, **facts, "candidateRecordId": RECORD_ID, "path": RUNTIME.as_posix(),
            "src": "/" + RUNTIME.as_posix().removeprefix("public/"), "geometry": geometry,
            "sha256": derivative["sha256"], "bytes": derivative["bytes"], "encoder": encoder,
            "validationErrors": [f"{derivative['bytes']} bytes exceeds inherited 102400 byte ceiling"] if derivative["bytes"] > 102400 else [],
            "alphaRecovery": measurement,
            "visibleSubjectAt200": max(geometry["visibleBounds"][2:]) * 200,
            "visibleSubjectAt256": max(geometry["visibleBounds"][2:]) * 256}
        report = {"schema": "maze-ui-presentation-candidate/v1", "preparedOn": "2026-09-05", "approvalStatus": "candidate",
            "authority": AUTHORITY.relative_to(ROOT).as_posix(), "authoritySha256": sha256_file(AUTHORITY),
            "priorCandidateReportSha256": sha256_file(OLD_REPORT), "environment": encoder_environment(),
            "runtimeBytes": derivative["bytes"], "measurement": measurement,
            "evidence": [{"path": relative.as_posix(), "sha256": sha256_file(stage / relative), "bytes": (stage / relative).stat().st_size}
                         for relative in relative_files if relative != RUNTIME], "entries": [entry]}
        content = ("// Generated by tessera_alpha_recovery.py; root exact-byte review required.\nexport const UI_TESSERA_PRESENTATION_CANDIDATE = "
                   + json.dumps({"tessera-dolphin": {k: entry[k] for k in ("src", "width", "height", "format", "usage", "minDisplayPx", "maxDisplayPx", "geometry")}}, separators=(",", ":")) + " as const;\n")
        staged_record = stage / RECORD.name
        write_json(staged_record, record)
        if check:
            write_json(staged_record, review.reviewed_record(record, entry, candidate_sha256=sha256_file(staged_record)))
        pairs = [(stage / relative, ROOT / relative) for relative in relative_files] + [(staged_record, RECORD)]
        if check:
            if any(not dest.exists() or src.read_bytes() != dest.read_bytes() for src, dest in pairs):
                raise ValueError("Tessera recovery byte drift")
            if read_json(REPORT) != report or TS.read_text(encoding="utf-8") != content:
                raise ValueError("Tessera recovery metadata drift")
        else:
            if REPORT.exists() or TS.exists() or any(dest.exists() for _, dest in pairs):
                raise FileExistsError("Tessera recovery preparation is immutable")
            for src, dest in pairs:
                dest.parent.mkdir(parents=True, exist_ok=True)
                _publish_without_overwrite(src, dest)
            write_json(REPORT, report)
            TS.write_text(content, encoding="utf-8")
    return {"runtimeBytes": report["runtimeBytes"], **measurement}


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--prepare", action="store_true")
    group.add_argument("--check", action="store_true")
    group.add_argument("--publish-reviewed", action="store_true")
    args = parser.parse_args()
    bind_review()
    print(json.dumps(review.publish_reviewed() if args.publish_reviewed else run(args.check), indent=2))
