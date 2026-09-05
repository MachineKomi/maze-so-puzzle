"""Build ART-HOTFIX-01 from the approved Tessera alpha-recovery master.

This pipeline does not classify alpha again and never invokes image generation.
It verifies the exact approved recovery master, applies the same field registration
used by r01, preserves r01 as rollback evidence, and emits a versioned r02 field
derivative plus its source record, catalogue override and actual-size proof.
"""
from __future__ import annotations

import argparse
import copy
import json
import subprocess
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

import mgjrpg02_batch01 as matte
from builder import alpha_bounds
from cutout import dilate_hidden_rgb, premultiplied_resize, register_cutout, remove_small_alpha_components
from encode import encoder_environment, save_image
from mgjrpg02_publish import (
    REPORT_PATH as BASE_REPORT,
    TS_PATH,
    alpha_weighted_visual_center,
    read_json,
    _publish_without_overwrite,
)
from model import ROOT, image_facts, sha256_file, validate_record_shape


SCRIPT = "scripts/art_pipeline/tessera_field_alpha_hotfix.py"
HOTFIX_ID = "ART-HOTFIX-01"
BASE_COMMIT = "9418ee245c16c645ec5a4dab03ded9e02ab97417"
BASE_CATALOGUE_SHA256 = "174d282e5b2cc68773bb27bdea63be3ae592ba8bb4e6d7e906cfa7e5275d8485"
AUTHORITY = ROOT / "docs/source-assets/publication/tessera-field-alpha-hotfix-authority.json"
AUTHORITY_SHA256 = "0d84fde031d0686206ec91242c8ccc5382f83c8f0e67b49608bd7703bf5ec03c"
RECOVERY_APPROVAL = ROOT / "docs/source-assets/publication/ui-correction-tessera-recovery-approval.json"
RECOVERY_APPROVAL_SHA256 = "de29471ef0877bd69e229551c822476a4999e773c877d471bd011863140eee8d"
MASTER = ROOT / "docs/source-assets/production/tessera-alpha-recovery/recovered-delivery-master.png"
MASTER_SHA256 = "1e7a7f8d3a687bb27d5473eef9eff961b0affbf766403ade5bcc2051f02f1f0d"
MASTER_BYTES = 883603
OLD_RUNTIME = Path("public/assets/mgjrpg-02/friends/tessera-dolphin-v01-friend-field-256-r01.webp")
OLD_RUNTIME_SHA256 = "33ca2f6baeba27d42f0a331f3b973dff43d4fa9e8da6325b0d026a4ad404e9d2"
RUNTIME = Path("public/assets/mgjrpg-02/friends/tessera-dolphin-v01-friend-field-256-r02.webp")
RECORD_ID = "tessera-dolphin-field-alpha-recovery-r02-source"
RECORD = ROOT / f"docs/source-assets/records/{RECORD_ID}.json"
CANDIDATE_REPORT = ROOT / "docs/source-assets/publication/tessera-field-alpha-hotfix-r02-candidate.json"
CANDIDATE_REPORT_SHA256 = "4b2fee38e93a1a54f993796dfb505df8cf4ce5b80fa3857e22c7e04548496966"
APPROVAL = ROOT / "docs/source-assets/publication/tessera-field-alpha-hotfix-r02-approval.json"
APPROVAL_SHA256 = "9ddbe7e3b38acc8919635954691e42cc6d0d5fafe8c0214a21260e3e3b944db1"
REPORT = ROOT / "docs/source-assets/publication/tessera-field-alpha-hotfix-r02-publication.json"
PROOF = ROOT / "artifacts/art-proofs/art-hotfix-01/tessera-field-r01-r02-actual-size.png"
AUTHORED_CAGE = ROOT / "public/assets/mgjrpg-02/cages/moon-silver-v02-structure-field-256-r01.webp"
AUTHORED_CAGE_SHA256 = "c386a763ea4b215ece1abcf2d73bd851a2de204decbbb713cfd7f3fc83517942"
BASE_RECORD = ROOT / "docs/source-assets/records/tessera-dolphin-mgjrpg02-v01-source.json"
REGISTRATION = {
    "targetBox": [0.1, 0.08, 0.9, 0.94],
    "align": [0.5, 1.0],
    "alphaThreshold": 3,
}
ENCODER_OPTIONS = {"lossless": True, "quality": 100, "method": 6, "exact": True}


def write_json_lf(path: Path, value: dict) -> None:
    """Write hash-bound hotfix JSON with checkout-stable LF bytes."""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes((json.dumps(value, indent=2, ensure_ascii=False) + "\n").encode("utf-8"))


def verify_inputs() -> None:
    checks = (
        (AUTHORITY, AUTHORITY_SHA256, None),
        (APPROVAL, APPROVAL_SHA256, None),
        (CANDIDATE_REPORT, CANDIDATE_REPORT_SHA256, None),
        (RECOVERY_APPROVAL, RECOVERY_APPROVAL_SHA256, None),
        (MASTER, MASTER_SHA256, MASTER_BYTES),
        (ROOT / OLD_RUNTIME, OLD_RUNTIME_SHA256, 44362),
        (AUTHORED_CAGE, AUTHORED_CAGE_SHA256, 39656),
    )
    for path, expected_hash, expected_bytes in checks:
        if not path.is_file() or sha256_file(path) != expected_hash:
            raise ValueError(f"Pinned ART-HOTFIX-01 input drift: {path.relative_to(ROOT)}")
        if expected_bytes is not None and path.stat().st_size != expected_bytes:
            raise ValueError(f"Pinned ART-HOTFIX-01 byte count drift: {path.relative_to(ROOT)}")
    approval = read_json(RECOVERY_APPROVAL)
    evidence = {row["path"]: row["sha256"] for row in approval.get("proofs", [])}
    if evidence.get("docs/source-assets/production/tessera-alpha-recovery/exact-restored-alpha-mask.png") != "490bd5da7becd788ac7de1e1af0ad0bcb59fe2251e1f6caa2843136f72d291fb":
        raise ValueError("Approved bounded alpha-recovery evidence drift")


def prepare_runtime() -> Image.Image:
    with Image.open(MASTER) as opened:
        opened.load()
        if opened.size != (1254, 1254) or opened.mode != "RGBA":
            raise ValueError("Approved Tessera recovery master facts drift")
        runtime = register_cutout(
            opened,
            (256, 256),
            target_box=REGISTRATION["targetBox"],
            align=REGISTRATION["align"],
            alpha_threshold=REGISTRATION["alphaThreshold"],
        )
    runtime = matte.clear_low_alpha(runtime, 2)
    runtime = remove_small_alpha_components(runtime, minimum_pixels=2, alpha_threshold=3)
    runtime = dilate_hidden_rgb(runtime, 4)
    runtime, _ = matte.normalize_visible_black(runtime)
    return runtime


def geometry_for(runtime: Image.Image) -> dict:
    bounds = alpha_bounds(runtime, 3)["pixelsLTRB"]
    x0, y0, x1, y1 = bounds
    return {
        "class": "floating-actor",
        "pivot": [0.5, 0.84],
        "visibleBounds": [x0 / 256, y0 / 256, (x1 - x0) / 256, (y1 - y0) / 256],
        "safeInset": [y0 / 256, (256 - x1) / 256, (256 - y1) / 256, x0 / 256],
        "floatCenter": alpha_weighted_visual_center(runtime),
    }


def alpha_comparison(old: Image.Image, new: Image.Image) -> dict:
    before = np.asarray(old.convert("RGBA"), dtype=np.uint8)
    after = np.asarray(new.convert("RGBA"), dtype=np.uint8)
    delta = after[:, :, 3].astype(np.int16) - before[:, :, 3].astype(np.int16)
    increased = delta > 0
    decreased = delta < 0
    ys, xs = np.where(increased)
    return {
        "oldAlphaBoundsLTRB": alpha_bounds(old, 3)["pixelsLTRB"],
        "newAlphaBoundsLTRB": alpha_bounds(new, 3)["pixelsLTRB"],
        "alphaIncreasedPixels": int(increased.sum()),
        "alphaDecreasedPixels": int(decreased.sum()),
        "alphaIncreaseBoundsLTRB": [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1],
        "alphaCoveragePixelsBefore": int(np.count_nonzero(before[:, :, 3] >= 3)),
        "alphaCoveragePixelsAfter": int(np.count_nonzero(after[:, :, 3] >= 3)),
        "opaquePixelsBefore": int(np.count_nonzero(before[:, :, 3] == 255)),
        "opaquePixelsAfter": int(np.count_nonzero(after[:, :, 3] == 255)),
        "summedAlphaBefore": int(before[:, :, 3].sum()),
        "summedAlphaAfter": int(after[:, :, 3].sum()),
        "rgbaChangedPixels": int(np.count_nonzero(np.any(before != after, axis=2))),
        "interpretation": "The approved source-space recovery only raises alpha. A small number of field pixels can decrease after premultiplied resampling and component cleanup because the restored fins change local edge filtering; canvas registration and alpha bounds remain identical.",
    }


def proof_image(old: Image.Image, new: Image.Image, cage: Image.Image) -> Image.Image:
    sheet = Image.new("RGB", (592, 886), "#fff5db")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default(size=16)
    title_font = ImageFont.load_default(size=20)
    draw.text((16, 12), "Tessera field r01 vs r02 - actual 256px", font=title_font, fill="#392f51")
    for row, background in enumerate(("#fff5db", "#302c46")):
        top = 62 + row * 292
        draw.rectangle((0, top, 592, top + 292), fill=background)
        label_color = "#392f51" if row == 0 else "#fff5db"
        for column, (art, label) in enumerate(((old, "r01 damaged alpha"), (new, "r02 approved recovery"))):
            left = 16 + column * 288
            sheet.paste(art, (left, top + 26), art)
            draw.text((left, top + 4), label, font=font, fill=label_color)
    draw.text((16, 654), "Light/dark alpha inspection; images are not enlarged.", font=font, fill="#392f51")
    draw.rectangle((0, 680, 592, 886), fill="#d8f0ed")
    draw.text((16, 692), "Authored consumer composition - 128px grid cell", font=title_font, fill="#392f51")
    cell_top = 738
    for left, label in ((72, "caged at 1,11"), (392, "rescued follower")):
        draw.rounded_rectangle((left, cell_top, left + 128, cell_top + 128), radius=12, fill="#bce3d7", outline="#638995", width=2)
        draw.text((left, cell_top - 22), label, font=font, fill="#392f51")
    # App CSS: the caged friend fills 94% of a 98%-inset stack while the
    # authored moon-silver cage fills that stack; a follower image fills 74%.
    caged_friend = premultiplied_resize(new, (118, 118))
    caged_frame = premultiplied_resize(cage, (125, 125))
    sheet.paste(caged_friend, (77, cell_top + 6), caged_friend)
    sheet.paste(caged_frame, (74, cell_top + 2), caged_frame)
    follower = premultiplied_resize(new, (95, 95))
    sheet.paste(follower, (408, cell_top + 31), follower)
    return sheet


def build_record(facts: dict, geometry: dict, encoder: dict) -> dict:
    record = copy.deepcopy(read_json(BASE_RECORD))
    original_source = record["sources"][0]
    record.update(
        recordId=RECORD_ID,
        runtimeStatus="active",
        approvalStatus="approved",
        derivativeRecipeVersion="tessera-bounded-coral-alpha-recovery-field-r02",
        geometry=geometry,
    )
    record["sources"] = [
        original_source,
        {
            "path": MASTER.relative_to(ROOT).as_posix(),
            "sha256": MASTER_SHA256,
            "bytes": MASTER_BYTES,
            "relationship": "approved bounded alpha-recovery delivery master",
            "evidence": f"Exact recovery approved in {RECOVERY_APPROVAL.relative_to(ROOT).as_posix()}; ART-HOTFIX-01 field derivation authorized in {AUTHORITY.relative_to(ROOT).as_posix()}.",
        },
    ]
    record["derivatives"] = [{
        **facts,
        "id": "tessera-dolphin-friend-field-256-r02",
        "path": RUNTIME.as_posix(),
        "sha256": facts["sha256"],
        "bytes": facts["bytes"],
        "profile": "friend-field-256",
        "derivativeRevision": 2,
        "runtimeStatus": "active",
        "loadingPhase": "level-selected-or-adventure-book-lazy",
        "encoder": {key: encoder[key] for key in ("name", "version", "options")},
    }]
    record["build"] = {
        # strict-v2 binds build.sourcePath to the immutable generation output;
        # humanEdits below names the exact approved intermediate consumed here.
        "sourcePath": original_source["path"],
        "operation": "cutout-resize",
        "profiles": [{
            "id": "friend-field-256",
            "outputPath": RUNTIME.as_posix(),
            "width": 256,
            "height": 256,
            "format": "webp",
            "clearAlphaBelow": 3,
            "edgeDilationPixels": 4,
            "minimumAlphaComponentPixels": 2,
            "maxEncodedBytes": 102400,
            "encoder": {"options": encoder["options"]},
        }],
        "backgroundExtraction": copy.deepcopy(read_json(BASE_RECORD)["build"]["backgroundExtraction"]),
        "registration": REGISTRATION,
    }
    record["humanEdits"] = [{
        "kind": "deterministic-delivery-processing",
        "script": SCRIPT,
        "description": "Re-register the exact approved bounded alpha-recovery delivery master at the established 256px friend-field target, then apply the existing low-alpha cleanup, component filter, hidden-RGB dilation, visible-black normalization and lossless WebP encoding. No classification, painting, generation, or identity change.",
    }]
    approval = read_json(APPROVAL)
    record["approvalEvidence"] = {
        "approvedBy": approval["approvedBy"],
        "approvedAt": approval["approvedAt"],
        "scope": "runtime-publish",
        "evidencePath": APPROVAL.relative_to(ROOT).as_posix(),
        "evidenceSha256": APPROVAL_SHA256,
    }
    record["knownUnknowns"] = [
        *record["knownUnknowns"],
        "Root approved the exact repaired field derivative for a versioned successor. Affected-iPad and family observations remain separate pending acceptance evidence.",
    ]
    record["rollback"] = {
        "method": "Revert the generated catalogue pointer to the retained r01 field URL. Preserve both versioned files and both records until the authorized retirement sweep.",
        "previousPath": "/" + OLD_RUNTIME.as_posix().removeprefix("public/"),
        "previousSha256": OLD_RUNTIME_SHA256,
    }
    errors = validate_record_shape(record, RECORD_ID)
    if errors:
        raise ValueError("Invalid ART-HOTFIX-01 source record:\n" + "\n".join(errors))
    return record


def build_report(facts: dict, geometry: dict, comparison: dict, record_sha256: str) -> dict:
    override = {
        "stableId": "tessera-dolphin",
        "label": "Tessera Dolphin",
        "family": "friend",
        "artVersion": 1,
        "profile": "friend-field-256",
        "publicUrl": "/" + RUNTIME.as_posix().removeprefix("public/"),
        "recordId": RECORD_ID,
        "runtimeStatus": "active",
        "runtimeWidth": 256,
        "runtimeHeight": 256,
        "runtimeAlphaMode": "straight",
        "geometry": geometry,
    }
    return {
        "schema": "maze-art-hotfix-publication/v1",
        "hotfixId": HOTFIX_ID,
        "preparedOn": "2026-09-06",
        "status": "root-approved-integration",
        "approvalPath": APPROVAL.relative_to(ROOT).as_posix(),
        "approvalSha256": APPROVAL_SHA256,
        "candidateReportPath": CANDIDATE_REPORT.relative_to(ROOT).as_posix(),
        "candidateReportSha256": CANDIDATE_REPORT_SHA256,
        "baseCommit": BASE_COMMIT,
        "authorityPath": AUTHORITY.relative_to(ROOT).as_posix(),
        "authoritySha256": AUTHORITY_SHA256,
        "approvedMaster": {"path": MASTER.relative_to(ROOT).as_posix(), "sha256": MASTER_SHA256, "bytes": MASTER_BYTES, "width": 1254, "height": 1254},
        "basePublicationReportPath": BASE_REPORT.relative_to(ROOT).as_posix(),
        "basePublicationReportSha256": sha256_file(BASE_REPORT),
        "acceptedCatalogueBase": {
            "path": TS_PATH.relative_to(ROOT).as_posix(),
            "commit": BASE_COMMIT,
            "sha256": BASE_CATALOGUE_SHA256,
            "rule": "Every line except the single Tessera row remains byte-identical and in the same order.",
        },
        "priorRuntime": {"path": OLD_RUNTIME.as_posix(), "sha256": OLD_RUNTIME_SHA256, "bytes": 44362, "decodedBytesUpperBound": 262144},
        "candidateRuntime": {"path": RUNTIME.as_posix(), **facts, "geometry": geometry},
        "sourceRecord": {"path": RECORD.relative_to(ROOT).as_posix(), "sha256": record_sha256},
        "registration": REGISTRATION,
        "alphaComparison": comparison,
        "cost": {
            "selectedEncodedBytesBefore": 44362,
            "selectedEncodedBytesAfter": facts["bytes"],
            "selectedEncodedByteDelta": facts["bytes"] - 44362,
            "retainedPublicInventoryByteDelta": facts["bytes"],
            "selectedDecodedBytesUpperBoundBefore": 262144,
            "selectedDecodedBytesUpperBoundAfter": 262144,
            "retainedDecodedInventoryUpperBoundDelta": 262144,
        },
        "environment": encoder_environment(),
        "catalogueOverride": override,
        "proofPath": PROOF.relative_to(ROOT).as_posix(),
        "integrationGate": "Exact derivative approved by root. See separate integration review for build/consumer checks and release receipt for public availability. Affected-iPad and family observations remain pending; v0.22.2 is unchanged.",
    }


def accepted_catalogue_content() -> str:
    result = subprocess.run(
        ["git", "show", f"{BASE_COMMIT}:{TS_PATH.relative_to(ROOT).as_posix()}"],
        cwd=ROOT,
        check=True,
        capture_output=True,
    )
    content = result.stdout
    import hashlib
    if hashlib.sha256(content).hexdigest() != BASE_CATALOGUE_SHA256:
        raise ValueError("Accepted catalogue base bytes drift")
    return content.decode("utf-8")


def catalogue_line(entry: dict) -> str:
    return (
        f'  {json.dumps(entry["stableId"])}: {{ id: {json.dumps(entry["stableId"])}, '
        f'label: {json.dumps(entry["label"])}, family: {json.dumps(entry["family"])}, '
        f'artVersion: {entry["artVersion"]}, recipeVersion: "mgjrpg-02", '
        f'profile: {json.dumps(entry["profile"])}, src: {json.dumps(entry["publicUrl"])}, '
        f'sourceRecordId: {json.dumps(entry["recordId"])}, runtimeStatus: {json.dumps(entry["runtimeStatus"])}, '
        f'width: {entry["runtimeWidth"]}, height: {entry["runtimeHeight"]}, '
        f'alphaMode: {json.dumps(entry["runtimeAlphaMode"])}, '
        f'geometry: {json.dumps(entry["geometry"], separators=(",", ":"))} }},'
    )


def patched_catalogue_content(entry: dict) -> str:
    base = accepted_catalogue_content()
    base_lines = base.splitlines()
    indexes = [index for index, line in enumerate(base_lines) if line.startswith('  "tessera-dolphin":')]
    if indexes != [30]:
        raise ValueError(f"Accepted Tessera catalogue row moved or duplicated: {indexes}")
    candidate_lines = list(base_lines)
    candidate_lines[indexes[0]] = catalogue_line(entry)
    if len(candidate_lines) != len(base_lines):
        raise ValueError("Catalogue row count changed")
    for index, (before, after) in enumerate(zip(base_lines, candidate_lines, strict=True)):
        if index != indexes[0] and before != after:
            raise ValueError(f"Non-Tessera catalogue entry changed at line {index + 1}")
    return "\n".join(candidate_lines) + "\n"


def normalized_text(path: Path) -> str:
    return path.read_text(encoding="utf-8").replace("\r\n", "\n").replace("\r", "\n")


def assert_catalogue_write_safe(path: Path, candidate: str) -> None:
    """Refuse to erase catalogue work newer than the accepted hotfix base."""
    if not path.is_file():
        raise FileNotFoundError(f"Current catalogue is missing: {path}")
    current = normalized_text(path)
    accepted = accepted_catalogue_content()
    if current not in {accepted, candidate}:
        raise ValueError("Refusing ART-HOTFIX-01 write over unrelated catalogue changes")


def run(write: bool) -> dict:
    verify_inputs()
    with tempfile.TemporaryDirectory(prefix="maze-tessera-field-hotfix-") as temporary:
        stage = Path(temporary)
        runtime = prepare_runtime()
        staged_runtime = stage / RUNTIME
        staged_runtime.parent.mkdir(parents=True, exist_ok=True)
        encoder = save_image(runtime, staged_runtime, "webp", ENCODER_OPTIONS)
        facts = image_facts(staged_runtime)
        facts.pop("colorMetadata", None)
        facts.update(sha256=sha256_file(staged_runtime), bytes=staged_runtime.stat().st_size)
        approved_runtime = read_json(APPROVAL)["runtime"]
        if facts["sha256"] != approved_runtime["sha256"] or facts["bytes"] != approved_runtime["bytes"]:
            raise ValueError("Reconstructed field pixels differ from the root-approved derivative")
        geometry = geometry_for(runtime)
        with Image.open(ROOT / OLD_RUNTIME) as opened:
            opened.load()
            old = opened.convert("RGBA")
        comparison = alpha_comparison(old, runtime)
        if comparison["oldAlphaBoundsLTRB"] != comparison["newAlphaBoundsLTRB"]:
            raise ValueError("Field optical registration bounds changed")
        staged_record = stage / RECORD.relative_to(ROOT)
        staged_record.parent.mkdir(parents=True, exist_ok=True)
        write_json_lf(staged_record, build_record(facts, geometry, encoder))
        report = build_report(facts, geometry, comparison, sha256_file(staged_record))
        staged_report = stage / REPORT.relative_to(ROOT)
        staged_report.parent.mkdir(parents=True, exist_ok=True)
        write_json_lf(staged_report, report)
        staged_ts = stage / TS_PATH.relative_to(ROOT)
        staged_ts.parent.mkdir(parents=True, exist_ok=True)
        staged_ts.write_text(patched_catalogue_content(report["catalogueOverride"]), encoding="utf-8", newline="\n")
        staged_proof = stage / PROOF.relative_to(ROOT)
        staged_proof.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(AUTHORED_CAGE) as opened:
            opened.load()
            cage = opened.convert("RGBA")
        save_image(proof_image(old, runtime, cage), staged_proof, "png", {"compress_level": 9, "optimize": False})
        versioned_pairs = (
            (staged_runtime, ROOT / RUNTIME),
            (staged_record, RECORD),
            (staged_report, REPORT),
        )
        if write:
            assert_catalogue_write_safe(TS_PATH, staged_ts.read_text(encoding="utf-8"))
            if (ROOT / RUNTIME).exists():
                if (ROOT / RUNTIME).read_bytes() != staged_runtime.read_bytes():
                    raise FileExistsError(f"Refusing to overwrite drifted versioned output: {RUNTIME}")
            else:
                (ROOT / RUNTIME).parent.mkdir(parents=True, exist_ok=True)
                _publish_without_overwrite(staged_runtime, ROOT / RUNTIME)
            for source, destination in ((staged_record, RECORD), (staged_report, REPORT), (staged_ts, TS_PATH)):
                destination.parent.mkdir(parents=True, exist_ok=True)
                destination.write_bytes(source.read_bytes())
            PROOF.parent.mkdir(parents=True, exist_ok=True)
            PROOF.write_bytes(staged_proof.read_bytes())
        else:
            drift = [
                destination.relative_to(ROOT).as_posix()
                for source, destination in versioned_pairs
                if not destination.is_file() or source.read_bytes() != destination.read_bytes()
            ]
            if not TS_PATH.is_file() or normalized_text(TS_PATH) != staged_ts.read_text(encoding="utf-8"):
                drift.append(TS_PATH.relative_to(ROOT).as_posix())
            if PROOF.is_file() and PROOF.read_bytes() != staged_proof.read_bytes():
                drift.append(PROOF.relative_to(ROOT).as_posix())
            if drift:
                raise ValueError("ART-HOTFIX-01 deterministic drift: " + ", ".join(drift))
    return {
        "hotfixId": HOTFIX_ID,
        "runtime": RUNTIME.as_posix(),
        "sha256": facts["sha256"],
        "bytes": facts["bytes"],
        "decodedBytesUpperBound": facts["decodedBytesUpperBound"],
        "geometry": geometry,
        "alphaComparison": comparison,
        "proof": PROOF.relative_to(ROOT).as_posix(),
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    action = parser.add_mutually_exclusive_group(required=True)
    action.add_argument("--write", action="store_true")
    action.add_argument("--check", action="store_true")
    args = parser.parse_args()
    print(json.dumps(run(args.write), indent=2))
