"""Build the v0.20.1 corrective story, front-door, and friend-state publication.

The binary transforms are deterministic. Image generation is never replayed:
this script consumes immutable provider outputs and retains previous files for
rollback. ``--check`` rebuilds into a temporary root and compares public bytes.
"""

from __future__ import annotations

import argparse
import copy
import json
import subprocess
import tempfile
from pathlib import Path
from typing import Any

from PIL import Image

from cutout import dilate_hidden_rgb, extract_edge_connected_background, premultiplied_resize
from encode import encoder_environment, save_image
from mgjrpg02_plan03_r1_publish import alpha_geometry
from model import ROOT, image_facts, sha256_file


PUBLICATION_ID = "mgjrpg-02-v0201-corrective-v01"
DERIVATIVE_RECIPE = "mgjrpg-02-v0201-corrective-derivative-r01"
BATCH = ROOT / "docs/source-assets/production/mgjrpg-02/batch-27-v0201-corrective-art"
PROMPTS = BATCH / "PROMPTS.md"
BATCH_21_PROMPTS = ROOT / "docs/source-assets/production/mgjrpg-02/batch-21-front-door-art/PROMPTS.md"
DECISION = ROOT / "docs/source-assets/calibrations/mgjrpg-02/v11/human-decision.json"
RECIPE = ROOT / "docs/source-assets/recipes/mgjrpg-02.json"
CANARY = ROOT / "docs/source-assets/reviews/mgjrpg-02-canary-v01.json"

PORTRAITS = {
    "story-professor-poggle": {
        "label": "Professor Poggle",
        "source": BATCH / "story-professor-poggle-v02-generator-original.png",
        "output_id": "exec-d3a13d2d-f3f0-4b18-8999-e0cede23ee62.png",
        "old_record": ROOT / "docs/source-assets/records/story-professor-poggle-v01-source.json",
        "old_path": "/assets/story-professor-poggle-v1.webp",
    },
    "story-sprig": {
        "label": "Sprig",
        "source": BATCH / "story-sprig-v02-generator-original.png",
        "output_id": "exec-0fc90a9c-69aa-4fbf-93fd-008603bd13ce.png",
        "old_record": ROOT / "docs/source-assets/records/story-sprig-v01-source.json",
        "old_path": "/assets/story-sprig-v1.webp",
    },
}

HERO_SOURCE = BATCH / "home-hero-splash-v03-alpha-correction-generator-original.png"
HERO_REJECTED_SOURCE = BATCH / "home-hero-splash-v03-transparent-generator-original.png"
TITLE_SOURCE = ROOT / "docs/source-assets/production/mgjrpg-02/batch-21-front-door-art/title-background-v02-candidate-a-generator-original.png"

FRIEND_IDS = (
    "pitter-patter-parasol", "lanternling", "emberdown-phoenix",
    "meadowstep-faunling", "minerva-moon-owl", "tessera-dolphin",
    "mallowmusk-aroma-wisp", "breezeling-sylph", "griffin-cub",
    "emberbelly-dragonling", "cloudstep-pegasus", "three-tumble-cerberus",
    "riddlekit-sphinx", "tidecurl-hippocamp", "ripplecap-kappa",
    "rainbow-horn-unicorn", "green-tea-skeleton",
)


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def publish_file(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists() and destination.read_bytes() != source.read_bytes():
        relative = destination.relative_to(ROOT).as_posix()
        tracked = subprocess.run(
            ["git", "ls-files", "--error-unmatch", relative],
            cwd=ROOT,
            capture_output=True,
        ).returncode == 0
        if tracked:
            raise RuntimeError(f"refusing to overwrite tracked versioned file: {relative}")
    destination.write_bytes(source.read_bytes())


def derivative(path: Path, identifier: str, profile: str, loading: str,
               *, output_root: Path = ROOT, revision: int = 1,
               lossless: bool = False) -> dict[str, Any]:
    facts = image_facts(path)
    # Source records use the strict-v2 derivative schema, which deliberately
    # excludes the inventory-only colourMetadata detail returned by image_facts.
    facts.pop("colorMetadata", None)
    return {
        "id": identifier,
        "path": path.relative_to(output_root).as_posix(),
        "sha256": sha256_file(path),
        "bytes": path.stat().st_size,
        **facts,
        "profile": profile,
        "derivativeRevision": revision,
        "runtimeStatus": "active",
        "loadingPhase": loading,
        "encoder": {
            "name": "Pillow WebP",
            "version": f"Pillow {Image.__version__}",
            "options": {"lossless": lossless, "quality": 88, "method": 6, "exact": True},
        },
    }


def reference(order: int, role: str, authority_kind: str, path: Path) -> dict[str, Any]:
    return {
        "order": order,
        "role": role,
        "authorityKind": authority_kind,
        "path": path.relative_to(ROOT).as_posix(),
        "sha256": sha256_file(path),
    }


def common_record(identifier: str, family: str, version: int,
                  source: Path, output_id: str, derivative_row: dict[str, Any],
                  operation: str, references: list[dict[str, Any]],
                  *, prompt_path: Path = PROMPTS,
                  rejected_outputs: list[dict[str, Any]] | None = None,
                  old_path: str | None = None) -> dict[str, Any]:
    is_portrait = family == "story"
    geometry = {
        "class": "portrait" if is_portrait else "background",
        "pivot": [0.5, 0.5],
        "visibleBounds": [0.0, 0.0, 1.0, 1.0],
        "safeInset": [0.0, 0.0, 0.0, 0.0],
    }
    return {
        "$schema": "../schema/art-source.schema.json",
        "schemaVersion": 2,
        "recordId": f"{identifier}-mgjrpg02-v{version:02d}-source",
        "id": identifier,
        "artVersion": version,
        "family": family,
        "runtimeStatus": "active",
        "sourceStatus": "source-backed",
        "approvalStatus": "approved",
        "validationProfile": "strict-v2",
        "recipeVersion": "mgjrpg-02",
        "derivativeRecipeVersion": DERIVATIVE_RECIPE,
        "recipeEvidence": {"recipeId": "mgjrpg-02", "path": RECIPE.relative_to(ROOT).as_posix(), "sha256": sha256_file(RECIPE)},
        "generationRuns": [{
            "runId": f"batch-27-{identifier}-v{version:02d}",
            "generator": "OpenAI built-in image generation capability",
            "model": "not exposed by tool response",
            "executedAt": "unknown",
            "prompt": {"path": prompt_path.relative_to(ROOT).as_posix(), "sha256": sha256_file(prompt_path)},
            "references": references,
            "outputs": [{
                "outputId": output_id,
                "path": source.relative_to(ROOT).as_posix(),
                "sha256": sha256_file(source),
                "bytes": source.stat().st_size,
                "disposition": "selected",
                "reason": "Human-requested v0.20.1 corrective publication.",
            }, *(rejected_outputs or [])],
            "lineage": {"editOfEdit": False, "identityAuthorityEligible": False, "renderingAuthorityEligible": False},
            "notes": "Exact prompt intent and ordered reference roles are preserved in the batch prompt record.",
        }],
        "renderingContract": ({
            "profileId": "storybook-local-contour-v1",
            "recipeId": "mgjrpg-02",
            "treatmentClass": "story-illustration",
            "canaryReview": {"reviewId": "mgjrpg-02-canary-v01", "path": CANARY.relative_to(ROOT).as_posix(), "sha256": sha256_file(CANARY)},
            "authoredBoundary": "material-local-color-aware",
            "extractionRole": "not-applicable",
            "stickerCutline": "forbidden",
            "enclosingContour": "subject-local-only",
        } if is_portrait else {
            "profileId": "storybook-local-contour-v1",
            "recipeId": "mgjrpg-02",
            "treatmentClass": "semantic-ui-cutout",
            "canaryReview": {"reviewId": "mgjrpg-02-canary-v01", "path": CANARY.relative_to(ROOT).as_posix(), "sha256": sha256_file(CANARY)},
            "authoredContour": "material-local-color-aware",
            "extractionRole": "alpha-matte-only",
            "stickerCutline": "semantic-cream-only",
        }),
        "promptEvidence": {
            "fidelity": "exact", "historyPath": prompt_path.relative_to(ROOT).as_posix(),
            "assetNamedInHistory": True,
            "promptFile": {"path": prompt_path.relative_to(ROOT).as_posix(), "sha256": sha256_file(prompt_path)},
            "outputIds": [output_id, *[item["outputId"] for item in (rejected_outputs or [])]],
            "notes": "Exact submitted prompt and provider output identifier are retained.",
        },
        "sources": [{
            "path": source.relative_to(ROOT).as_posix(), "sha256": sha256_file(source),
            "bytes": source.stat().st_size, "relationship": "selected immutable generator original",
            "evidence": "Direct Human request for corrective generation and runtime publication.",
        }],
        "derivatives": [derivative_row],
        "geometry": geometry,
        "build": {
            "sourcePath": source.relative_to(ROOT).as_posix(), "operation": operation,
            "profiles": [{
                "id": derivative_row["profile"], "outputPath": derivative_row["path"],
                "width": derivative_row["width"], "height": derivative_row["height"],
                "format": derivative_row["format"], "maxEncodedBytes": 1048576,
                "encoder": {"options": derivative_row["encoder"]["options"]},
            }],
        },
        "humanEdits": [{
            "kind": "deterministic-delivery-processing",
            "description": "Colour normalization, resize and WebP encoding only.",
            "script": "scripts/art_pipeline/mgjrpg02_v0201_publish.py",
        }],
        "approvalEvidence": {
            "approvedBy": "Human project author", "approvedAt": "2026-09-04T00:00:00+01:00",
            "scope": "runtime-publish",
            "evidencePath": DECISION.relative_to(ROOT).as_posix(), "evidenceSha256": sha256_file(DECISION),
        },
        "knownUnknowns": ["Generator model build, seed and exact execution timestamp were not exposed."],
        "rights": {
            "originClaim": "Created for Maze so Puzzle from project-owned prompts and internal references.",
            "licenceStatus": "reviewed", "reviewedBy": "Human project author",
            "notes": "No named living artist or proprietary character was requested.",
        },
        "rollback": {"method": f"Restore the prior catalogue pointer{f' to {old_path}' if old_path else ''}."},
    }


def build(output_root: Path) -> tuple[list[dict[str, Any]], dict[str, dict[str, Any]]]:
    rows: list[dict[str, Any]] = []
    records: dict[str, dict[str, Any]] = {}

    for identifier, item in PORTRAITS.items():
        source = Image.open(item["source"]).convert("RGB")
        result = source.resize((512, 512), Image.Resampling.LANCZOS)
        destination = output_root / f"public/assets/mgjrpg-02/story/{identifier}-v02-story-portrait-512-r01.webp"
        destination.parent.mkdir(parents=True, exist_ok=True)
        save_image(result, destination, "webp", {"lossless": False, "quality": 88, "method": 6, "exact": True})
        row = derivative(destination, f"{identifier}-story-portrait-512-r01", "story-portrait-512", "story-or-level-entry", output_root=output_root)
        rows.append(row)
        old_master = json.loads(item["old_record"].read_text(encoding="utf-8"))["sources"][0]["path"]
        portrait_references = [
            reference(1, "identity-authority", "approved-source-master", ROOT / old_master),
            reference(2, "rendering-authority", "approved-rendering-anchor", ROOT / "docs/source-assets/production/mgjrpg-02/batch-20-final-coverage/ame-portrait-v02-candidate-a-generator-original.png"),
            reference(3, "family-authority", "approved-rendering-anchor", ROOT / "docs/source-assets/production/mgjrpg-02/batch-03-friends/approved/friend-bunny-v02-512.png"),
        ]
        records[identifier] = common_record(
            identifier, "story", 2, item["source"], item["output_id"], row,
            "opaque-resize", portrait_references, old_path=item["old_path"],
        )

    hero_source = Image.open(HERO_SOURCE).convert("RGB")
    hero_cutout = extract_edge_connected_background(hero_source, (253, 253, 253), 58)
    hero_cutout = dilate_hidden_rgb(hero_cutout, 4)
    hero_master = output_root / "docs/source-assets/production/mgjrpg-02/batch-27-v0201-corrective-art/home-hero-splash-v03-transparent-master.png"
    hero_master.parent.mkdir(parents=True, exist_ok=True)
    save_image(hero_cutout, hero_master, "png", {"compress_level": 9, "optimize": False})
    hero_runtime = premultiplied_resize(hero_cutout, (1024, 768))
    hero_destination = output_root / "public/assets/mgjrpg-02/brand/home-hero-splash-v03-front-door-1024-r01.webp"
    hero_destination.parent.mkdir(parents=True, exist_ok=True)
    save_image(hero_runtime, hero_destination, "webp", {"lossless": True, "method": 6, "exact": True})
    hero_row = derivative(hero_destination, "front-door-hero-1024", "front-door-hero-1024", "title-critical", output_root=output_root, lossless=True)
    hero_rejected = [{
        "outputId": "exec-8768336f-c238-4bcf-a9bd-a1fbfeeb3631.png",
        "path": HERO_REJECTED_SOURCE.relative_to(ROOT).as_posix(),
        "sha256": sha256_file(HERO_REJECTED_SOURCE),
        "bytes": HERO_REJECTED_SOURCE.stat().st_size,
        "disposition": "rejected",
        "reason": "The provider painted a checkerboard into opaque RGB rather than returning usable alpha or a flat extraction matte.",
    }]
    hero_references = [
        reference(1, "edit-target", "approved-source-master", ROOT / "docs/source-assets/production/mgjrpg-02/batch-26-plan03-r2-home-composition/home-hero-splash-v02-larger-tea-skeleton-generator-original.png"),
        reference(2, "negative-reference", "comparison-only", ROOT / "docs/source-assets/production/mgjrpg-02/batch-26-plan03-r2-home-composition/home-hero-splash-v02-transparent-master.png"),
    ]
    hero_record = common_record(
        "home-hero-splash", "brand", 3, HERO_SOURCE,
        "exec-aea53678-f3c7-46c6-b8ed-6e44acade992.png", hero_row,
        "cutout-resize", hero_references, rejected_outputs=hero_rejected,
        old_path="/assets/mgjrpg-02/brand/home-hero-splash-v02-front-door-1024-r01.webp",
    )
    hero_record["sources"].append({
        "path": HERO_REJECTED_SOURCE.relative_to(ROOT).as_posix(),
        "sha256": sha256_file(HERO_REJECTED_SOURCE),
        "bytes": HERO_REJECTED_SOURCE.stat().st_size,
        "relationship": "rejected first corrective generator output",
        "evidence": "Retained to prove why a second pass and deterministic exterior-matte extraction were required; never used as an edit target or runtime source.",
    })
    hero_record["sources"].append({
        "path": hero_master.relative_to(output_root).as_posix(),
        "sha256": sha256_file(hero_master), "bytes": hero_master.stat().st_size,
        "relationship": "deterministic edge-connected transparent delivery master",
        "evidence": "The provider returned opaque RGB; only the exterior near-white matte connected to the canvas edge was cleared.",
    })
    hero_geometry = alpha_geometry(hero_runtime)
    bounds = hero_geometry["visibleBounds"]
    hero_record["geometry"] = {
        "class": "hero-splash",
        "pivot": [0.5, 0.5],
        "visibleBounds": bounds,
        "safeInset": [bounds[1], 1 - bounds[0] - bounds[2], 1 - bounds[1] - bounds[3], bounds[0]],
    }
    hero_record["build"]["backgroundExtraction"] = {"mode": "edge-connected", "rgb": [253, 253, 253], "tolerance": 58}
    hero_record["humanEdits"][0]["description"] = "Edge-connected exterior matte extraction, hidden-RGB dilation, premultiplied resize and lossless WebP encoding; no generative redraw."
    records["home-hero-splash"] = hero_record
    rows.append(hero_row)

    title = Image.open(TITLE_SOURCE).convert("RGB").resize((1672, 941), Image.Resampling.LANCZOS)
    title_destination = output_root / "public/assets/mgjrpg-02/brand/title-intro-environment-v01-front-door-1672-r01.webp"
    title_destination.parent.mkdir(parents=True, exist_ok=True)
    save_image(title, title_destination, "webp", {"lossless": False, "quality": 88, "method": 6, "exact": True})
    title_row = derivative(title_destination, "title-intro-background-1672", "front-door-background-1672", "title-critical", output_root=output_root)
    title_references = [
        reference(1, "identity-authority", "approved-source-master", ROOT / "docs/source-assets/characters/ame/v02/ame-v02-candidate-c-generator-original.png"),
        reference(2, "rendering-authority", "approved-rendering-anchor", ROOT / "docs/source-assets/calibrations/mgjrpg-02/v03/ame-v02-rendering-b-fresh-01-generator-original.png"),
        reference(3, "family-authority", "approved-rendering-anchor", ROOT / "docs/source-assets/production/mgjrpg-02/batch-03-friends/approved/friend-bunny-v02-512.png"),
        reference(4, "family-authority", "approved-rendering-anchor", ROOT / "docs/source-assets/production/mgjrpg-02/batch-03-friends/approved/friend-fox-v02-512.png"),
        reference(5, "family-authority", "approved-rendering-anchor", ROOT / "docs/source-assets/production/mgjrpg-02/batch-03-friends/approved/friend-kitten-v02-512.png"),
    ]
    title_record = common_record(
        "title-intro-environment", "brand", 1, TITLE_SOURCE,
        "exec-760c422b-2fe4-4afa-8c01-458ebe53b622.png", title_row,
        "opaque-resize", title_references, prompt_path=BATCH_21_PROMPTS,
    )
    records["title-intro-environment"] = title_record
    rows.append(title_row)
    return rows, records


def supersede_record(path: Path) -> None:
    value = json.loads(path.read_text(encoding="utf-8"))
    value["runtimeStatus"] = "superseded"
    for item in value.get("derivatives", []):
        if item.get("runtimeStatus") == "active":
            item["runtimeStatus"] = "superseded"
    write_json(path, value)


def activate_friend_records() -> None:
    for identifier in FRIEND_IDS:
        candidates = sorted((ROOT / "docs/source-assets/records").glob(f"{identifier}-mgjrpg02-v*-source.json"))
        if len(candidates) != 1:
            raise RuntimeError(f"expected one source record for {identifier}, found {len(candidates)}")
        value = json.loads(candidates[0].read_text(encoding="utf-8"))
        value["runtimeStatus"] = "active"
        for item in value.get("derivatives", []):
            item["runtimeStatus"] = "active"
            item["loadingPhase"] = "level-selected-or-adventure-book-lazy"
        placement_note = (
            "Authored-campaign placement remains a Plan 09 ecology decision; "
            "v0.20.1 enables generated-maze rescue and Adventure Book discovery."
        )
        known_unknowns = value.setdefault("knownUnknowns", [])
        value["knownUnknowns"] = list(dict.fromkeys(
            [*known_unknowns, placement_note]
        ))
        write_json(candidates[0], value)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--publish", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.publish == args.check:
        parser.error("choose exactly one of --publish or --check")

    with tempfile.TemporaryDirectory(prefix="maze-v0201-art-") as temporary:
        temp_root = Path(temporary)
        rows, records = build(temp_root)
        if args.check:
            for row in rows:
                expected = ROOT / row["path"]
                generated = temp_root / row["path"]
                if not expected.exists() or expected.read_bytes() != generated.read_bytes():
                    raise RuntimeError(f"deterministic mismatch: {row['path']}")
            print(json.dumps({"status": "pass", "publicationId": PUBLICATION_ID, "checked": len(rows)}, indent=2))
            return 0

        for row in rows:
            publish_file(temp_root / row["path"], ROOT / row["path"])
        hero_master_relative = "docs/source-assets/production/mgjrpg-02/batch-27-v0201-corrective-art/home-hero-splash-v03-transparent-master.png"
        publish_file(temp_root / hero_master_relative, ROOT / hero_master_relative)

        for identifier, record in records.items():
            if identifier == "home-hero-splash":
                record["sources"][2]["path"] = hero_master_relative
                record["sources"][2]["sha256"] = sha256_file(ROOT / hero_master_relative)
                record["sources"][2]["bytes"] = (ROOT / hero_master_relative).stat().st_size
            write_json(ROOT / f"docs/source-assets/records/{record['recordId']}.json", record)

        supersede_record(ROOT / "docs/source-assets/records/story-professor-poggle-v01-source.json")
        supersede_record(ROOT / "docs/source-assets/records/story-sprig-v01-source.json")
        supersede_record(ROOT / "docs/source-assets/records/home-hero-splash-mgjrpg02-v02-source.json")
        activate_friend_records()

        report = {
            "schema": "maze-art-v0201-corrective-publication/v1",
            "publicationId": PUBLICATION_ID,
            "recordedOn": "2026-09-04",
            "derivativeRecipe": DERIVATIVE_RECIPE,
            "encoderEnvironment": encoder_environment(),
            "entries": rows,
            "totals": {
                "runtimeFiles": len(rows),
                "runtimeEncodedBytes": sum(row["bytes"] for row in rows),
                "runtimeDecodedBytesUpperBound": sum(row["decodedBytesUpperBound"] for row in rows),
            },
            "friendPromotion": {"count": len(FRIEND_IDS), "ids": list(FRIEND_IDS), "campaignPlacementOwner": "Plan 09"},
            "rollback": {
                "checkpoint": "bd47517cd25db63403eb296638b683e3d665c112",
                "paths": [item["old_path"] for item in PORTRAITS.values()] + [
                    "/assets/mgjrpg-02/brand/home-hero-splash-v02-front-door-1024-r01.webp",
                ],
            },
        }
        write_json(ROOT / "docs/source-assets/publication/mgjrpg-02-v0201-corrective-map.json", report)
        print(json.dumps(report["totals"], indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
