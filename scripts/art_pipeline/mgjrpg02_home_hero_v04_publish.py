"""Publish the final bounded Home hero transparency and horn correction.

The approved v03 frame remains authoritative. Image generation supplies only a
centred-horn donor; a deterministic source-space mask transfers that bounded
change. Exterior white matte and two measured enclosed background components
are then removed without globally deleting intentional white materials.
"""

from __future__ import annotations

import argparse
import json
import tempfile
from collections import deque
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter

from cutout import dilate_hidden_rgb, extract_edge_connected_background, premultiplied_resize
from encode import encoder_environment, save_image
from mgjrpg02_plan03_r1_publish import alpha_geometry
from mgjrpg02_v0201_publish import derivative, publish_file, supersede_record, write_json
from model import ROOT, sha256_file


PUBLICATION_ID = "mgjrpg-02-home-hero-final-correction-v01"
DERIVATIVE_RECIPE = "mgjrpg-02-home-hero-bounded-correction-r01"
BATCH = ROOT / "docs/source-assets/production/mgjrpg-02/batch-29-home-hero-final-correction"
PROMPTS = BATCH / "PROMPTS.md"
DECISION = ROOT / "docs/source-assets/calibrations/mgjrpg-02/v13/human-decision.json"
BASE_SOURCE = ROOT / "docs/source-assets/production/mgjrpg-02/batch-27-v0201-corrective-art/home-hero-splash-v03-alpha-correction-generator-original.png"
DONOR_SOURCE = BATCH / "home-hero-splash-v04-centered-horn-generator-original.png"
REJECTED_SOURCE = BATCH / "home-hero-splash-v04-rejected-checkerboard-generator-original.png"
COMPOSITE_RELATIVE = Path("docs/source-assets/production/mgjrpg-02/batch-29-home-hero-final-correction/home-hero-splash-v04-composited-white-master.png")
TRANSPARENT_RELATIVE = Path("docs/source-assets/production/mgjrpg-02/batch-29-home-hero-final-correction/home-hero-splash-v04-transparent-master.png")
RUNTIME_RELATIVE = Path("public/assets/mgjrpg-02/brand/home-hero-splash-v04-front-door-1024-r01.webp")
RECORD_PATH = ROOT / "docs/source-assets/records/home-hero-splash-mgjrpg02-v04-source.json"
PREVIOUS_RECORD = ROOT / "docs/source-assets/records/home-hero-splash-mgjrpg02-v03-source.json"
REPORT = ROOT / "docs/source-assets/publication/mgjrpg-02-home-hero-v04-correction-map.json"
LEDGER = ROOT / "docs/source-assets/retirement/asset-retirement-ledger.json"

# Source-space boundary around the unicorn's horn and immediately occluded mane.
# Pixel differences outside this polygon cannot enter the approved composite.
HORN_ROI = (
    (1064, 492), (1268, 492), (1304, 530), (1310, 588),
    (1290, 648), (1244, 678), (1160, 682), (1092, 666),
    (1058, 625), (1048, 558),
)
HORN_DIFFERENCE_THRESHOLD = 10
HORN_DILATION_SIZE = 11
HORN_FEATHER_RADIUS = 2.5

# These seeds identify only the two enclosed white background islands visible
# in the Human's screenshot. The bounds and count ranges prevent accidental
# deletion of bone, fur, eyes, paper, highlights, or stars.
ENCLOSED_BACKGROUND = (
    {"seed": (357, 712), "pixelRange": (2500, 5000), "expectedBounds": (310, 665, 405, 770)},
    {"seed": (153, 797), "pixelRange": (800, 2200), "expectedBounds": (130, 735, 195, 845)},
)
MATTE_RGB = (253, 253, 253)
# 32 is the measured safe maximum below the source's pale outer-ear contour.
# The former v03 value of 58 crossed that boundary and visibly ate white fur.
MATTE_TOLERANCE = 32


def _facts(path: Path, reported_path: Path | None = None) -> dict[str, Any]:
    return {
        "path": (reported_path or path.relative_to(ROOT)).as_posix(),
        "sha256": sha256_file(path),
        "bytes": path.stat().st_size,
    }


def _link(path: Path) -> dict[str, str]:
    return {"path": path.relative_to(ROOT).as_posix(), "sha256": sha256_file(path)}


def _connected_component(candidates: np.ndarray, seed: tuple[int, int]) -> np.ndarray:
    height, width = candidates.shape
    seed_x, seed_y = seed
    if not (0 <= seed_x < width and 0 <= seed_y < height and candidates[seed_y, seed_x]):
        raise RuntimeError(f"background seed {seed} does not select the matte classifier")
    visited = np.zeros_like(candidates, dtype=np.bool_)
    visited[seed_y, seed_x] = True
    queue: deque[tuple[int, int]] = deque([(seed_y, seed_x)])
    while queue:
        y, x = queue.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            next_y, next_x = y + dy, x + dx
            if (
                0 <= next_y < height
                and 0 <= next_x < width
                and candidates[next_y, next_x]
                and not visited[next_y, next_x]
            ):
                visited[next_y, next_x] = True
                queue.append((next_y, next_x))
    return visited


def compose_bounded_horn_edit() -> tuple[Image.Image, dict[str, Any]]:
    with Image.open(BASE_SOURCE) as opened:
        base = opened.convert("RGB")
    with Image.open(DONOR_SOURCE) as opened:
        donor = opened.convert("RGB")
    if base.size != (1448, 1086) or donor.size != base.size:
        raise RuntimeError(f"unexpected source dimensions: base={base.size}, donor={donor.size}")

    difference = ImageChops.difference(base, donor)
    difference_array = np.asarray(difference, dtype=np.uint8)
    difference_strength = np.max(difference_array, axis=2)
    difference_mask = Image.fromarray(
        np.where(difference_strength >= HORN_DIFFERENCE_THRESHOLD, 255, 0).astype(np.uint8),
        "L",
    )
    roi = Image.new("L", base.size, 0)
    ImageDraw.Draw(roi).polygon(HORN_ROI, fill=255)
    transfer_mask = ImageChops.multiply(difference_mask, roi)
    transfer_mask = transfer_mask.filter(ImageFilter.MaxFilter(HORN_DILATION_SIZE))
    transfer_mask = ImageChops.multiply(transfer_mask, roi)
    transfer_mask = transfer_mask.filter(ImageFilter.GaussianBlur(HORN_FEATHER_RADIUS))
    composite = Image.composite(donor, base, transfer_mask)

    mask_array = np.asarray(transfer_mask, dtype=np.uint8)
    ys, xs = np.where(mask_array > 0)
    if not len(xs):
        raise RuntimeError("bounded horn transfer mask is empty")
    bounds = (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
    changed = np.any(np.asarray(composite) != np.asarray(base), axis=2)
    outside = changed & (mask_array == 0)
    if np.any(outside):
        raise RuntimeError("horn composite changed pixels outside the recorded transfer mask")
    return composite, {
        "roiPolygon": [list(point) for point in HORN_ROI],
        "differenceThreshold": HORN_DIFFERENCE_THRESHOLD,
        "dilationSize": HORN_DILATION_SIZE,
        "featherRadius": HORN_FEATHER_RADIUS,
        "maskBoundsLTRB": list(bounds),
        "maskNonZeroPixels": int(np.count_nonzero(mask_array)),
        "changedPixels": int(np.count_nonzero(changed)),
        "changedCanvasFraction": round(float(np.count_nonzero(changed)) / changed.size, 8),
        "changedPixelsOutsideMask": 0,
    }


def remove_recorded_background(composite: Image.Image) -> tuple[Image.Image, list[dict[str, Any]]]:
    cutout = extract_edge_connected_background(composite, MATTE_RGB, MATTE_TOLERANCE)
    pixels = np.asarray(cutout.convert("RGBA"), dtype=np.uint8).copy()
    target = np.asarray(MATTE_RGB, dtype=np.int16)
    difference = np.max(
        np.abs(pixels[:, :, :3].astype(np.int16) - target[None, None, :]),
        axis=2,
    )
    candidates = (difference <= MATTE_TOLERANCE) & (pixels[:, :, 3] > 0)
    measurements: list[dict[str, Any]] = []
    for item in ENCLOSED_BACKGROUND:
        component = _connected_component(candidates, item["seed"])
        count = int(np.count_nonzero(component))
        ys, xs = np.where(component)
        bounds = (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
        lower, upper = item["pixelRange"]
        expected_left, expected_top, expected_right, expected_bottom = item["expectedBounds"]
        if not lower <= count <= upper:
            raise RuntimeError(f"background component at {item['seed']} has unsafe size {count}")
        if not (
            expected_left <= bounds[0] <= bounds[2] <= expected_right
            and expected_top <= bounds[1] <= bounds[3] <= expected_bottom
        ):
            raise RuntimeError(f"background component at {item['seed']} escaped its guard bounds: {bounds}")
        if (
            np.any(component[0, :]) or np.any(component[-1, :])
            or np.any(component[:, 0]) or np.any(component[:, -1])
        ):
            raise RuntimeError(f"enclosed background component at {item['seed']} reaches the canvas edge")
        pixels[component, 3] = 0
        measurements.append({"seed": list(item["seed"]), "pixelsCleared": count, "boundsLTRB": list(bounds)})
    cleaned = Image.fromarray(pixels, "RGBA")
    return dilate_hidden_rgb(cleaned, 4), measurements


def build(output_root: Path) -> tuple[dict[str, Any], dict[str, Any], dict[str, Any]]:
    composite, horn_measurement = compose_bounded_horn_edit()
    composite_path = output_root / COMPOSITE_RELATIVE
    composite_path.parent.mkdir(parents=True, exist_ok=True)
    save_image(composite, composite_path, "png", {"compress_level": 9, "optimize": False})

    cutout, background_measurements = remove_recorded_background(composite)
    transparent_path = output_root / TRANSPARENT_RELATIVE
    transparent_path.parent.mkdir(parents=True, exist_ok=True)
    save_image(cutout, transparent_path, "png", {"compress_level": 9, "optimize": False})

    runtime = premultiplied_resize(cutout, (1024, 768))
    runtime_path = output_root / RUNTIME_RELATIVE
    runtime_path.parent.mkdir(parents=True, exist_ok=True)
    save_image(runtime, runtime_path, "webp", {"lossless": True, "method": 6, "exact": True})
    row = derivative(
        runtime_path,
        "front-door-hero-1024",
        "front-door-hero-1024",
        "title-critical",
        output_root=output_root,
        lossless=True,
    )

    previous = json.loads(PREVIOUS_RECORD.read_text(encoding="utf-8"))
    record = dict(previous)
    record.update({
        "recordId": "home-hero-splash-mgjrpg02-v04-source",
        "artVersion": 4,
        "runtimeStatus": "active",
        "approvalStatus": "approved",
        "derivativeRecipeVersion": DERIVATIVE_RECIPE,
    })
    record["generationRuns"] = [{
        "runId": "batch-29-home-hero-splash-v04-centred-horn",
        "generator": "OpenAI built-in image generation capability",
        "model": "not exposed by tool response",
        "executedAt": "2026-09-04",
        "prompt": _link(PROMPTS),
        "references": [{
            "order": 1,
            "role": "edit-target",
            "authorityKind": "approved-source-master",
            **_link(BASE_SOURCE),
        }],
        "outputs": [
            {
                "outputId": "exec-75d90974-e6ac-4910-b0d5-9da045b09abd.png",
                **_facts(DONOR_SOURCE),
                "disposition": "selected",
                "reason": "The centred horn and immediately adjacent mane are transferred through the recorded deterministic mask; the full generated frame is not published.",
            },
            {
                "outputId": "exec-c19c9ebb-c7fa-48d9-a476-ee12ed49f4a2.png",
                **_facts(REJECTED_SOURCE),
                "disposition": "rejected",
                "reason": "Opaque checkerboard and broader redraw drift; retained only as provenance evidence.",
            },
        ],
        "lineage": {"editOfEdit": False, "identityAuthorityEligible": False, "renderingAuthorityEligible": False},
        "notes": "Exact prompts, output IDs, bounded transfer, and rejection rationale are preserved in Batch 29.",
    }]
    record["promptEvidence"] = {
        "fidelity": "exact",
        "historyPath": PROMPTS.relative_to(ROOT).as_posix(),
        "assetNamedInHistory": True,
        "promptFile": _link(PROMPTS),
        "outputIds": [
            "exec-75d90974-e6ac-4910-b0d5-9da045b09abd.png",
            "exec-c19c9ebb-c7fa-48d9-a476-ee12ed49f4a2.png",
        ],
        "notes": "Built-in image generation supplied the horn donor; all other publication work is deterministic.",
    }
    record["sources"] = [
        {**_facts(BASE_SOURCE), "relationship": "approved v03 composition and identity authority", "evidence": "Preserved pixel-for-pixel outside the bounded transfer mask."},
        {**_facts(DONOR_SOURCE), "relationship": "selected bounded horn donor", "evidence": "Only recorded mask pixels can enter the composite."},
        {**_facts(REJECTED_SOURCE), "relationship": "rejected opaque checkerboard output", "evidence": "Never used as an edit target or runtime source."},
        {**_facts(composite_path, COMPOSITE_RELATIVE), "relationship": "deterministic bounded white-background composite", "evidence": "Approved v03 frame plus recorded horn/mane transfer only."},
        {**_facts(transparent_path, TRANSPARENT_RELATIVE), "relationship": "deterministic transparent delivery master", "evidence": "Exterior white matte and exactly two guarded enclosed components removed."},
    ]
    record["derivatives"] = [row]
    geometry = alpha_geometry(runtime)
    bounds = geometry["visibleBounds"]
    record["geometry"] = {
        "class": "hero-splash",
        "pivot": [0.5, 0.5],
        "visibleBounds": bounds,
        "safeInset": [bounds[1], 1 - bounds[0] - bounds[2], 1 - bounds[1] - bounds[3], bounds[0]],
    }
    record["build"] = {
        "sourcePath": DONOR_SOURCE.relative_to(ROOT).as_posix(),
        "operation": "cutout-resize",
        "profiles": [{
            "id": "front-door-hero-1024",
            "outputPath": RUNTIME_RELATIVE.as_posix(),
            "width": 1024,
            "height": 768,
            "format": "webp",
            "maxEncodedBytes": 1048576,
            "encoder": {"options": row["encoder"]["options"]},
        }],
        "backgroundExtraction": {
            "mode": "edge-connected",
            "rgb": list(MATTE_RGB),
            "tolerance": MATTE_TOLERANCE,
        },
    }
    record["humanEdits"] = [{
        "kind": "bounded-generative-correction-and-deterministic-delivery-processing",
        "description": "Transfer only the centred horn and minimum adjacent mane through a guarded mask; remove exterior and two named enclosed white matte regions; preserve intentional white materials; premultiplied resize and lossless WebP encode.",
        "script": "scripts/art_pipeline/mgjrpg02_home_hero_v04_publish.py",
    }]
    record["approvalEvidence"] = {
        "approvedBy": "Human project author",
        "approvedAt": "2026-09-04T00:00:00+01:00",
        "scope": "runtime-publish",
        "evidencePath": DECISION.relative_to(ROOT).as_posix(),
        "evidenceSha256": sha256_file(DECISION),
    }
    record["knownUnknowns"] = ["Generator model build and seed were not exposed by the built-in image generation response."]
    record["rollback"] = {"method": "Restore the home-hero-splash catalogue pointer to /assets/mgjrpg-02/brand/home-hero-splash-v03-front-door-1024-r01.webp."}

    report = {
        "schema": "maze-art-home-hero-v04-correction/v1",
        "publicationId": PUBLICATION_ID,
        "recordedOn": "2026-09-04",
        "prompt": _facts(PROMPTS),
        "decision": _facts(DECISION),
        "encoderEnvironment": encoder_environment(),
        "hornTransfer": horn_measurement,
        "backgroundExtraction": {
            "exteriorMode": "edge-connected",
            "rgb": list(MATTE_RGB),
            "tolerance": MATTE_TOLERANCE,
            "enclosedComponents": background_measurements,
        },
        "entry": {
            "stableId": "home-hero-splash",
            "artVersion": 4,
            "recordId": record["recordId"],
            "sourceMaster": COMPOSITE_RELATIVE.as_posix(),
            "transparentMaster": TRANSPARENT_RELATIVE.as_posix(),
            "runtimePath": RUNTIME_RELATIVE.as_posix(),
            "runtimeSha256": row["sha256"],
            "runtimeBytes": row["bytes"],
            "decodedBytesUpperBound": row["decodedBytesUpperBound"],
            "previousPath": "/assets/mgjrpg-02/brand/home-hero-splash-v03-front-door-1024-r01.webp",
        },
        "rollback": {"checkpoint": "556542e38f1e31a868a1ec6e382041db5ee887e6"},
    }
    return row, record, report


def update_retirement_ledger(runtime_bytes: int) -> None:
    ledger = json.loads(LEDGER.read_text(encoding="utf-8"))
    entry_id = "post-v0201-home-hero-v03-prior-runtime"
    if any(entry["entryId"] == entry_id for entry in ledger["entries"]):
        return
    previous_path = ROOT / "public/assets/mgjrpg-02/brand/home-hero-splash-v03-front-door-1024-r01.webp"
    ledger["entries"].append({
        "entryId": entry_id,
        "assetPath": previous_path.relative_to(ROOT).as_posix(),
        "family": "brand",
        "classification": "superseded-runtime-rollback-candidate",
        "state": "rollback-hold",
        "eligibleForPlan12": False,
        "sha256": sha256_file(previous_path),
        "bytes": previous_path.stat().st_size,
        "width": 1024,
        "height": 768,
        "decodedBytesUpperBound": 3145728,
        "firstSeenCommit": "d6b11c026ead3d75565e10490c10307a5a14cfd0",
        "lastVerifiedCheckpoint": "556542e38f1e31a868a1ec6e382041db5ee887e6",
        "runtimeReferences": [],
        "currentReferences": [
            {"kind": "source-record", "path": "docs/source-assets/records/home-hero-splash-mgjrpg02-v03-source.json", "detail": "The lifecycle record preserves v03 as superseded rollback material.", "blocksRetirement": False},
            {"kind": "generated-manifest", "path": "docs/source-assets/manifest.json", "detail": "The generated inventory preserves the exact retained v03 rollback file.", "blocksRetirement": False},
            {"kind": "publication-map", "path": REPORT.relative_to(ROOT).as_posix(), "detail": "The bounded v04 correction publishes the centred horn and complete guarded cutout.", "blocksRetirement": True},
        ],
        "replacementPaths": [RUNTIME_RELATIVE.as_posix()],
        "preservation": {
            "sourceStatus": "source-backed",
            "sourceRecordPath": "docs/source-assets/records/home-hero-splash-mgjrpg02-v03-source.json",
            "soleRepositoryCopy": False,
            "rollbackSources": [{**_facts(BASE_SOURCE), "kind": "source-master"}],
            "gitRestore": {"path": previous_path.relative_to(ROOT).as_posix(), "firstSeenCommit": "d6b11c026ead3d75565e10490c10307a5a14cfd0", "method": "Recover the retained derivative from Git history and verify its recorded SHA-256 before restoring the Home hero pointer."},
        },
        "blockers": [
            {"id": "final-catalogue-pointers-not-frozen", "detail": "Plan 01 and Plan 11 may still refine the front-door composition."},
            {"id": "authoritative-reachability-proof-missing", "detail": "Plan 12 has not completed exhaustive runtime reachability proof."},
            {"id": "generated-path-proof-missing", "detail": "Responsive, test and preload path proof remains a Plan 12 gate."},
            {"id": "rollback-window-not-expired", "detail": "The v04 replacement remains inside its mandatory rollback hold."},
            {"id": "clean-clone-route-and-package-proof-missing", "detail": "Clean-clone browser and offline package proof belongs to Plan 12."},
            {"id": "external-backup-not-confirmed", "detail": "No copy-first export and Human-confirmed external backup exists."},
        ],
        "archiveRelativePath": "payload/public/assets/mgjrpg-02/brand/home-hero-splash-v03-front-door-1024-r01.webp",
        "retirementEvidence": {"catalogueFrozen": False, "reachabilityPassed": False, "generatedPathsPassed": False, "rollbackWindowExpired": False, "cleanClonePassed": False, "browserRoutesPassed": False, "tauriOfflinePackagePassed": False, "archiveHashVerified": False, "externalBackupConfirmed": False},
        "notes": "The Human-requested v04 correction centres the unicorn horn and clears two remaining white background pockets; v03 remains an undeleted rollback hold.",
    })
    ledger["lastAuditedAt"] = "2026-09-04T23:00:00+01:00"
    ledger["inspectedCheckpoint"] = {
        "head": "556542e38f1e31a868a1ec6e382041db5ee887e6",
        "workingTreeDirty": True,
        "notes": "The v04 Home hero correction adds v03 to rollback hold; no retirement, archive, move, overwrite, or deletion was performed.",
    }
    ledger["totals"]["candidateCount"] += 1
    ledger["totals"]["encodedBytes"] += previous_path.stat().st_size
    ledger["totals"]["decodedBytesUpperBound"] += 3145728
    write_json(LEDGER, ledger)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--publish", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.publish == args.check:
        parser.error("choose exactly one of --publish or --check")

    with tempfile.TemporaryDirectory(prefix="maze-home-hero-v04-") as temporary:
        temp_root = Path(temporary)
        row, record, report = build(temp_root)
        generated_paths = (COMPOSITE_RELATIVE, TRANSPARENT_RELATIVE, RUNTIME_RELATIVE)
        if args.check:
            for relative in generated_paths:
                expected = ROOT / relative
                generated = temp_root / relative
                if not expected.is_file() or expected.read_bytes() != generated.read_bytes():
                    raise RuntimeError(f"deterministic mismatch: {relative.as_posix()}")
            print(json.dumps({"status": "pass", "publicationId": PUBLICATION_ID, "checked": len(generated_paths)}, indent=2))
            return 0

        for relative in generated_paths:
            publish_file(temp_root / relative, ROOT / relative)
        write_json(RECORD_PATH, record)
        supersede_record(PREVIOUS_RECORD)
        write_json(REPORT, report)
        update_retirement_ledger(row["bytes"])
        print(json.dumps({
            "publicationId": PUBLICATION_ID,
            "runtimeBytes": row["bytes"],
            "decodedBytesUpperBound": row["decodedBytesUpperBound"],
            "hornChangedCanvasFraction": report["hornTransfer"]["changedCanvasFraction"],
            "enclosedBackgroundPixelsCleared": sum(item["pixelsCleared"] for item in report["backgroundExtraction"]["enclosedComponents"]),
        }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
