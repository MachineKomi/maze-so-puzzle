"""Publish the two active art families mistakenly left on legacy pixels in v0.20.1.

Image generation is not replayed. This deterministic builder consumes the
immutable Batch 28 impossible-matte sources, creates registered transparent
WebP derivatives, and records strict-v2 provenance. Existing runtime files are
retained as rollback holds for Plan 12.
"""

from __future__ import annotations

import argparse
import json
import tempfile
from pathlib import Path
from typing import Any

from PIL import Image

from cutout import dilate_hidden_rgb, register_cutout, remove_small_alpha_components
from encode import encoder_environment, save_image
from mgjrpg02_batch01 import (
    clear_low_alpha,
    estimate_uniform_matte,
    extract_uniform_matte,
    normalize_visible_black,
)
from mgjrpg02_plan03_r1_publish import alpha_geometry
from mgjrpg02_v0201_publish import common_record, derivative, reference, supersede_record, write_json
from model import ROOT, sha256_file


PUBLICATION_ID = "mgjrpg-02-post-v0201-active-refresh-v01"
DERIVATIVE_RECIPE = "mgjrpg-02-post-v0201-active-refresh-r01"
BATCH = ROOT / "docs/source-assets/production/mgjrpg-02/batch-28-missed-active-refresh"
PROMPTS = BATCH / "PROMPTS.md"
DECISION = ROOT / "docs/source-assets/calibrations/mgjrpg-02/v12/human-decision.json"
REPORT = ROOT / "docs/source-assets/publication/mgjrpg-02-post-v0201-active-refresh-map.json"
RECIPE = ROOT / "docs/source-assets/recipes/mgjrpg-02.json"
CANARY = ROOT / "docs/source-assets/reviews/mgjrpg-02-canary-v01.json"

SPECS: tuple[dict[str, Any], ...] = (
    {
        "id": "goblin",
        "label": "Garden Goblin",
        "family": "enemy",
        "version": 2,
        "source": BATCH / "goblin-v02-generator-original.png",
        "rejected": BATCH / "goblin-v02-rejected-checkerboard-generator-original.png",
        "outputId": "exec-4beea5bd-7235-4260-8bfe-2f86926150a9.png",
        "rejectedOutputId": "exec-dd1c68b6-a069-4e0b-9477-1281e07101c5.png",
        "destination": "public/assets/mgjrpg-02/enemies/goblin-v02-enemy-field-256-r01.webp",
        "profile": "enemy-field-256",
        "targetBox": [0.07, 0.06, 0.93, 0.94],
        "matteExpected": [245, 4, 247],
        "oldRecord": ROOT / "docs/source-assets/records/goblin-v01-source.json",
        "oldPath": "/assets/goblin.png",
        "references": (
            ("comparison-only", "comparison-only", "docs/source-assets/production/mgjrpg-02/batch-28-missed-active-refresh/references/goblin-legacy-input.png"),
            ("family-authority", "approved-rendering-anchor", "docs/source-assets/production/mgjrpg-02/batch-28-missed-active-refresh/references/acorn-knight-family-input.webp"),
            ("family-authority", "approved-rendering-anchor", "docs/source-assets/production/mgjrpg-02/batch-28-missed-active-refresh/references/orc-chieftain-family-input.webp"),
            ("family-authority", "approved-rendering-anchor", "docs/source-assets/production/mgjrpg-02/batch-28-missed-active-refresh/references/lizard-swordsman-family-input.webp"),
            ("family-authority", "approved-rendering-anchor", "docs/source-assets/production/mgjrpg-02/batch-28-missed-active-refresh/references/mushroom-imp-family-input.webp"),
        ),
    },
    {
        "id": "violet-moon",
        "label": "Violet Moon Portal",
        "family": "portal",
        "version": 2,
        "source": BATCH / "portal-violet-moon-v02-generator-original.png",
        "rejected": BATCH / "portal-violet-moon-v02-rejected-checkerboard-generator-original.png",
        "outputId": "exec-b0af2c1e-cb12-4799-9c89-8be666490fab.png",
        "rejectedOutputId": "exec-f474f8e9-e6fb-442f-b56c-0ae77edc4e3a.png",
        "destination": "public/assets/mgjrpg-02/portals/violet-moon-v02-structure-field-256-r01.webp",
        "profile": "structure-field-256",
        "targetBox": [0.04, 0.04, 0.96, 0.94],
        "matteExpected": [3, 249, 3],
        "oldRecord": ROOT / "docs/source-assets/records/portal-violet-moon-v01-source.json",
        "oldPath": "/assets/portal-violet-moon-v1.png",
        "references": (
            ("comparison-only", "comparison-only", "docs/source-assets/production/mgjrpg-02/batch-28-missed-active-refresh/references/violet-moon-legacy-input.png"),
            ("construction-authority", "approved-rendering-anchor", "docs/source-assets/production/mgjrpg-02/batch-28-missed-active-refresh/references/rose-heart-family-input.webp"),
            ("construction-authority", "approved-rendering-anchor", "docs/source-assets/production/mgjrpg-02/batch-28-missed-active-refresh/references/mint-clover-family-input.webp"),
        ),
    },
)

EXPANDED_FRIEND_IDS = (
    "pitter-patter-parasol", "lanternling", "emberdown-phoenix",
    "meadowstep-faunling", "minerva-moon-owl", "tessera-dolphin",
    "mallowmusk-aroma-wisp", "breezeling-sylph", "griffin-cub",
    "emberbelly-dragonling", "cloudstep-pegasus", "three-tumble-cerberus",
    "riddlekit-sphinx", "tidecurl-hippocamp", "ripplecap-kappa",
    "rainbow-horn-unicorn", "green-tea-skeleton",
)


def build_one(spec: dict[str, Any], output_root: Path) -> tuple[dict[str, Any], dict[str, Any], dict[str, Any]]:
    with Image.open(spec["source"]) as opened:
        opened.load()
        matte = estimate_uniform_matte(opened)
        if any(abs(actual - expected) > 8 for actual, expected in zip(matte["rgb"], spec["matteExpected"])):
            raise RuntimeError(f"{spec['id']}: extraction matte drifted: {matte['rgb']}")
        cutout, extraction = extract_uniform_matte(
            opened,
            matte["rgb"],
            minimum_component_pixels=3,
        )
    registered = register_cutout(
        cutout,
        (256, 256),
        target_box=spec["targetBox"],
        align=(0.5, 1.0),
        alpha_threshold=3,
    )
    registered = clear_low_alpha(registered, 2)
    registered = remove_small_alpha_components(
        registered,
        minimum_pixels=2,
        alpha_threshold=3,
    )
    registered = dilate_hidden_rgb(registered, 4)
    registered, normalized_black = normalize_visible_black(registered)
    destination = output_root / spec["destination"]
    destination.parent.mkdir(parents=True, exist_ok=True)
    save_image(
        registered,
        destination,
        "webp",
        {"lossless": True, "quality": 100, "method": 6, "exact": True},
    )
    row = derivative(
        destination,
        f"{spec['id']}-{spec['profile']}-r01",
        spec["profile"],
        "level-entry-warmup-or-first-use",
        output_root=output_root,
        lossless=True,
    )
    row["encoder"]["options"]["quality"] = 100
    refs = [
        reference(index, role, authority, ROOT / path)
        for index, (role, authority, path) in enumerate(spec["references"], start=1)
    ]
    rejected = [{
        "outputId": spec["rejectedOutputId"],
        "path": spec["rejected"].relative_to(ROOT).as_posix(),
        "sha256": sha256_file(spec["rejected"]),
        "bytes": spec["rejected"].stat().st_size,
        "disposition": "rejected",
        "reason": "The provider painted a checkerboard into opaque RGB; it is provenance evidence only.",
    }]
    record = common_record(
        spec["id"],
        spec["family"],
        spec["version"],
        spec["source"],
        spec["outputId"],
        row,
        "cutout-resize",
        refs,
        prompt_path=PROMPTS,
        rejected_outputs=rejected,
        old_path=spec["oldPath"],
    )
    record["derivativeRecipeVersion"] = DERIVATIVE_RECIPE
    record["generationRuns"][0]["runId"] = f"batch-28-{spec['id']}-v02-matte"
    record["generationRuns"][0]["outputs"][0]["reason"] = (
        "Selected under the Human's explicit corrective direction against the approved mgjrpg-02 family contract."
    )
    record["sources"].append({
        "path": spec["rejected"].relative_to(ROOT).as_posix(),
        "sha256": sha256_file(spec["rejected"]),
        "bytes": spec["rejected"].stat().st_size,
        "relationship": "rejected first generator output",
        "evidence": "Retained to prove the opaque checkerboard failure; never used as an edit target or runtime source.",
    })
    for ref in refs:
        ref_path = ROOT / ref["path"]
        record["sources"].append({
            "path": ref["path"],
            "sha256": ref["sha256"],
            "bytes": ref_path.stat().st_size,
            "relationship": f"immutable {ref['role']} generation reference snapshot",
            "evidence": "Copied byte-for-byte into the immutable Batch 28 evidence set before generation.",
        })
    record["renderingContract"] = {
        "profileId": "storybook-local-contour-v1",
        "recipeId": "mgjrpg-02",
        "treatmentClass": "character-contour",
        "canaryReview": {
            "reviewId": "mgjrpg-02-canary-v01",
            "path": CANARY.relative_to(ROOT).as_posix(),
            "sha256": sha256_file(CANARY),
        },
        "authoredContour": "material-local-color-aware",
        "extractionRole": "alpha-matte-only",
        "stickerCutline": "forbidden",
    }
    geometry = alpha_geometry(registered)
    bounds = geometry["visibleBounds"]
    safe_inset = [
        bounds[1],
        1 - bounds[0] - bounds[2],
        1 - bounds[1] - bounds[3],
        bounds[0],
    ]
    record["geometry"] = {
        "class": "grounded-actor" if spec["family"] == "enemy" else "floor-portal",
        "pivot": [0.5, 0.9] if spec["family"] == "enemy" else [0.5, 0.5],
        "visibleBounds": bounds,
        "safeInset": [round(value, 8) for value in safe_inset],
    }
    if spec["family"] == "portal":
        record["geometry"].update({
            "apertureBox": [0.26953125, 0.3359375, 0.4609375, 0.39453125],
            "motifBox": [0.359375, 0.390625, 0.28125, 0.2734375],
            "tileFootprint": [0.0, 0.0, 1.0, 1.0],
        })
    record["build"]["backgroundExtraction"] = {
        "mode": "flat-impossible-matte",
        "recipeId": "flat-impossible-matte-alpha-unblend-v1",
        "rgb": matte["rgb"],
        "clearDistance": 48,
        "opaqueDistance": 144,
        "minimumComponentPixels": 3,
    }
    record["build"]["registration"] = {
        "targetBox": spec["targetBox"],
        "align": [0.5, 1.0],
        "alphaThreshold": 3,
    }
    record["humanEdits"] = [{
        "kind": "deterministic-delivery-processing",
        "description": "Impossible-matte alpha recovery, hidden-RGB decontamination, aspect-preserving registration, resize and lossless WebP encoding only.",
        "script": "scripts/art_pipeline/mgjrpg02_post_v0201_publish.py",
    }]
    record["approvalEvidence"] = {
        "approvedBy": "Human project author corrective direction with orchestrator contract review",
        "approvedAt": "2026-09-04T00:00:00+01:00",
        "scope": "runtime-publish",
        "evidencePath": DECISION.relative_to(ROOT).as_posix(),
        "evidenceSha256": sha256_file(DECISION),
    }
    record["knownUnknowns"] = [
        "Generator model build, seed and exact execution timestamp were not exposed.",
        "Manual face and eye landmarks remain a Plan 05 registration gate; static alpha registration is authoritative here.",
    ]
    return row, record, {
        "stableId": spec["id"],
        "label": spec["label"],
        "family": spec["family"],
        "artVersion": spec["version"],
        "recipeVersion": "mgjrpg-02",
        "profile": spec["profile"],
        "publicUrl": "/" + spec["destination"].removeprefix("public/"),
        "runtimePath": spec["destination"],
        "recordId": record["recordId"],
        "runtimeStatus": "active",
        "runtimeWidth": 256,
        "runtimeHeight": 256,
        "runtimeAlphaMode": row["alphaMode"],
        "geometry": record["geometry"],
        "sourceSha256": sha256_file(spec["source"]),
        "runtimeSha256": row["sha256"],
        "runtimeBytes": row["bytes"],
        "decodedBytesUpperBound": row["decodedBytesUpperBound"],
        "previousPath": spec["oldPath"],
        "matte": matte,
        "extractionMeasurement": extraction,
        "normalizedExactBlackPixels": normalized_black,
    }


def publish_file(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists() and destination.read_bytes() != source.read_bytes():
        raise RuntimeError(f"refusing to overwrite versioned output: {destination.relative_to(ROOT)}")
    destination.write_bytes(source.read_bytes())


def record_authored_friend_placement() -> None:
    old_note = (
        "Authored-campaign placement remains a Plan 09 ecology decision; "
        "v0.20.1 enables generated-maze rescue and Adventure Book discovery."
    )
    new_note = (
        "Post-v0.20.1 authored placement now gives this species at least one "
        "Solo-accessible rescue in the existing sixteen-maze campaign; Plan 09 "
        "owns the expanded 24-maze progression and thematic ecology refinement."
    )
    for identifier in EXPANDED_FRIEND_IDS:
        candidates = sorted((ROOT / "docs/source-assets/records").glob(
            f"{identifier}-mgjrpg02-v*-source.json"
        ))
        if len(candidates) != 1:
            raise RuntimeError(f"expected one active source record for {identifier}")
        value = json.loads(candidates[0].read_text(encoding="utf-8"))
        known_unknowns = list(value.get("knownUnknowns", []))
        value["knownUnknowns"] = [
            new_note if note == old_note else note
            for note in known_unknowns
        ]
        write_json(candidates[0], value)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--publish", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.publish == args.check:
        parser.error("choose exactly one of --publish or --check")

    with tempfile.TemporaryDirectory(prefix="maze-post-v0201-art-") as temporary:
        temp_root = Path(temporary)
        built = [build_one(spec, temp_root) for spec in SPECS]
        if args.check:
            for row, _record, entry in built:
                expected = ROOT / entry["runtimePath"]
                generated = temp_root / row["path"]
                if not expected.is_file() or expected.read_bytes() != generated.read_bytes():
                    raise RuntimeError(f"deterministic mismatch: {entry['stableId']}")
            print(json.dumps({"status": "pass", "publicationId": PUBLICATION_ID, "checked": len(built)}, indent=2))
            return 0

        for row, record, entry in built:
            publish_file(temp_root / row["path"], ROOT / entry["runtimePath"])
            write_json(ROOT / f"docs/source-assets/records/{record['recordId']}.json", record)
        for spec in SPECS:
            supersede_record(spec["oldRecord"])
        record_authored_friend_placement()
        entries = [entry for _row, _record, entry in built]
        report = {
            "schema": "maze-art-post-v0201-active-refresh/v1",
            "publicationId": PUBLICATION_ID,
            "recordedOn": "2026-09-04",
            "decisionPath": DECISION.relative_to(ROOT).as_posix(),
            "decisionSha256": sha256_file(DECISION),
            "promptPath": PROMPTS.relative_to(ROOT).as_posix(),
            "promptSha256": sha256_file(PROMPTS),
            "encoderEnvironment": encoder_environment(),
            "supersedesV0201Interpretation": {
                "report": "docs/source-assets/publication/mgjrpg-02-v0201-validation-report.json",
                "field": "artAudit.approvedRetainedExceptions",
                "correction": "Goblin and Violet Moon were missed and are now final-style active assets; v0.20.1 remains immutable.",
            },
            "entries": entries,
            "totals": {
                "runtimeFiles": len(entries),
                "runtimeEncodedBytes": sum(entry["runtimeBytes"] for entry in entries),
                "runtimeDecodedBytesUpperBound": sum(entry["decodedBytesUpperBound"] for entry in entries),
            },
            "rollback": {
                "checkpoint": "4bca5322b6026e6a03a5b5a0f8e44aac1655d58a",
                "paths": [spec["oldPath"] for spec in SPECS],
            },
        }
        write_json(REPORT, report)
        print(json.dumps(report["totals"], indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
