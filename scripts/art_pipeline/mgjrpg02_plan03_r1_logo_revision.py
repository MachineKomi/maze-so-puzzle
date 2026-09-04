"""Build source-only Plan 03-R1 logo-revision evidence.

The script extracts review alpha from immutable green-matte ImageGen outputs,
writes a compact ignored review page, and records the forward Human decision,
generation lineage, measurements, and a proposed publication map. It never
writes to public/assets or runtime catalogue files.
"""

from __future__ import annotations

import hashlib
import html
import json
from pathlib import Path

import numpy as np
from PIL import Image

from mgjrpg02_batch01 import estimate_uniform_matte, extract_uniform_matte


ROOT = Path(__file__).resolve().parents[2]
BATCH = ROOT / "docs/source-assets/production/mgjrpg-02/batch-24-plan03-r1-logo-revision"
PROOF = ROOT / "artifacts/art-proofs/mgjrpg-02/plan03-r1-logo-revision"
ASSETS = PROOF / "assets"
PROMPTS = BATCH / "PROMPTS.md"
FRESH = BATCH / "game-logo-v03-candidate-b-matte-01-generator-original.png"
LOWERCASE_ONLY = BATCH / "game-logo-v03-candidate-b-lowercase-edit-01-generator-original.png"
SELECTED = BATCH / "game-logo-v03-candidate-b-cleanup-edit-02-generator-original.png"
OLD_GENERATED = ROOT / "docs/source-assets/production/mgjrpg-02/batch-21-front-door-art/game-logo-concept-v01-candidate-a-alpha-attempt-01-generator-original.png"
OLD_REJECTED = ROOT / "docs/source-assets/production/mgjrpg-02/batch-23-plan03-r1-premium-ui-logo/game-logo-v02-candidate-a-deterministic-master.png"
PATHFINDER = ROOT / "docs/source-assets/production/mgjrpg-02/batch-22-achievement-stickers/badge-pathfinder-v02-candidate-a-matte-01-generator-original.png"
MAZE_MAPPER = ROOT / "docs/source-assets/production/mgjrpg-02/batch-22-achievement-stickers/badge-maze-mapper-v02-candidate-a-matte-01-generator-original.png"
ENVIRONMENT = ROOT / "docs/source-assets/production/mgjrpg-02/batch-21-front-door-art/title-background-v02-environment-only-study-01-generator-original.png"
HOME_SPLASH = ROOT / "docs/source-assets/production/mgjrpg-02/batch-21-front-door-art/home-hero-splash-v01-candidate-b-matte-01-generator-original.png"
TITLE_A = ROOT / "docs/source-assets/production/mgjrpg-02/batch-21-front-door-art/title-background-v02-candidate-a-generator-original.png"
TITLE_B = ROOT / "docs/source-assets/production/mgjrpg-02/batch-21-front-door-art/title-background-v02-candidate-b-generator-original.png"
APP_ICON = ROOT / "docs/source-assets/production/mgjrpg-02/batch-13-ui-portals-equipment/app-icon-ame-v03-candidate-a-generator-original.png"
RECIPE = ROOT / "docs/source-assets/recipes/mgjrpg-02.json"
CANARY = ROOT / "docs/source-assets/reviews/mgjrpg-02-canary-v01.json"
DECISION_V07 = ROOT / "docs/source-assets/calibrations/mgjrpg-02/v07/human-decision.json"
DECISION_V08 = ROOT / "docs/source-assets/calibrations/mgjrpg-02/v08/human-decision.json"
SOURCE_RECORD = ROOT / "docs/source-assets/records/game-logo-mgjrpg02-v03-source.json"
BATCH23_REVIEW = ROOT / "docs/source-assets/production/mgjrpg-02/batch-23-plan03-r1-premium-ui-logo/human-review-r02.json"
BATCH24_REVIEW = BATCH / "human-review.json"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def repo_path(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def json_write(path: Path, payload: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def file_evidence(path: Path, relationship: str, evidence: str) -> dict[str, object]:
    return {
        "path": repo_path(path),
        "sha256": sha256(path),
        "bytes": path.stat().st_size,
        "relationship": relationship,
        "evidence": evidence,
    }


def generator_fact(path: Path, output_id: str) -> dict[str, object]:
    with Image.open(path) as image:
        image.load()
        width, height = image.size
        mode = image.mode
    return {
        "path": repo_path(path),
        "outputId": output_id,
        "sha256": sha256(path),
        "bytes": path.stat().st_size,
        "width": width,
        "height": height,
        "format": "png",
        "mode": mode,
        "alphaMode": "straight" if "A" in mode else "opaque",
        "decodedBytesUpperBound": width * height * 4,
    }


def extract_logo(path: Path) -> tuple[Image.Image, dict[str, object]]:
    with Image.open(path) as opened:
        opened.load()
        source = opened.copy()
    matte = estimate_uniform_matte(source)
    extracted, extraction = extract_uniform_matte(
        source,
        matte["rgb"],
        clear_distance=72.0,
        opaque_distance=210.0,
        minimum_component_pixels=128,
    )
    alpha = np.asarray(extracted.getchannel("A"), dtype=np.uint8)
    ys, xs = np.nonzero(alpha >= 3)
    if not len(xs):
        raise ValueError(f"logo extraction produced no visible pixels: {path}")
    box = (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
    cropped = extracted.crop(box)
    pad = max(20, round(max(cropped.size) * 0.035))
    padded = Image.new("RGBA", (cropped.width + 2 * pad, cropped.height + 2 * pad), (0, 0, 0, 0))
    padded.alpha_composite(cropped, (pad, pad))
    return padded, {"matte": matte, "extraction": extraction, "sourceVisibleBounds": list(box), "padding": pad}


def save_png(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "PNG", compress_level=9, optimize=False)


def thumbnail(source: Path, destination: Path, size: tuple[int, int]) -> None:
    with Image.open(source) as opened:
        image = opened.convert("RGB")
    image.thumbnail(size, Image.Resampling.LANCZOS)
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination, "JPEG", quality=90, optimize=True, progressive=True)


def image_fact(path: Path) -> dict[str, object]:
    with Image.open(path) as opened:
        opened.load()
        rgba = opened.convert("RGBA")
    alpha = np.asarray(rgba.getchannel("A"), dtype=np.uint8)
    return {
        "path": repo_path(path),
        "sha256": sha256(path),
        "bytes": path.stat().st_size,
        "width": rgba.width,
        "height": rgba.height,
        "decodedBytesUpperBound": rgba.width * rgba.height * 4,
        "semiTransparentPixels": int(np.count_nonzero((alpha > 0) & (alpha < 255))),
        "exactBlackVisiblePixels": int(
            np.count_nonzero((alpha >= 3) & np.all(np.asarray(rgba)[:, :, :3] == 0, axis=2))
        ),
    }


def build_proof() -> tuple[dict[str, object], dict[str, object]]:
    ASSETS.mkdir(parents=True, exist_ok=True)
    fresh, fresh_processing = extract_logo(FRESH)
    selected, selected_processing = extract_logo(SELECTED)
    save_png(fresh, ASSETS / "logo-v03-fresh-before-lowercase-edit.png")
    save_png(selected, ASSETS / "logo-v03-candidate-b-transparent.png")

    for width in (1024, 640, 384, 256, 160, 96):
        scaled = selected.copy()
        scaled.thumbnail((width, width), Image.Resampling.LANCZOS)
        save_png(scaled, ASSETS / f"logo-v03-candidate-b-{width}.png")

    thumbnail(ENVIRONMENT, ASSETS / "front-door-environment.jpg", (720, 405))
    thumbnail(HOME_SPLASH, ASSETS / "front-door-home-splash-b.jpg", (720, 405))

    old_generated, _ = extract_logo(
        ROOT / "docs/source-assets/production/mgjrpg-02/batch-21-front-door-art/game-logo-concept-v01-candidate-b-matte-01-generator-original.png"
    )
    save_png(old_generated, ASSETS / "batch21-generated-logo-reference.png")
    with Image.open(OLD_REJECTED) as opened:
        rejected = opened.convert("RGBA")
    save_png(rejected, ASSETS / "rejected-logo-a.png")

    fresh_report = image_fact(ASSETS / "logo-v03-fresh-before-lowercase-edit.png")
    selected_report = image_fact(ASSETS / "logo-v03-candidate-b-transparent.png")
    return (
        {"source": generator_fact(FRESH, "exec-1c029032-219a-46ef-806b-778ab626c5e3.png"), "proof": fresh_report, "processing": fresh_processing},
        {"source": generator_fact(SELECTED, "exec-ead7cf0f-5d90-4ebc-9241-2474e49b1510.png"), "proof": selected_report, "processing": selected_processing},
    )


def build_decision() -> None:
    payload = {
        "schema": "maze-art-human-decision/v1",
        "decisionId": "mgjrpg-02-human-front-door-correction-v08",
        "recordedOn": "2026-09-04",
        "status": "forward-selection-correction-recorded",
        "scope": "Plan 03-R1 title/home pairing correction and logo rejection/revision gate",
        "supersedesDecisionId": "mgjrpg-02-human-front-door-forward-decision-v07",
        "rollbackAnchor": "28946cbb04f45cb21cd51626914267ff4f71c375",
        "withdrawnSelections": [
            {
                "label": "Title Candidate A",
                "runId": "batch-21-title-background-v02-a",
                **file_evidence(TITLE_A, "withdrawn forward selection", "Human identified the boot/fox spatial collision and withdrew this selection."),
            }
        ],
        "consideredNotSelected": [
            {
                "label": "Title Candidate B",
                "runId": "batch-21-title-background-v02-b",
                **file_evidence(TITLE_B, "considered but not selected", "Human preferred its error-free character arrangement but rejected the straight, overly simple maze path."),
            }
        ],
        "approvedFrontDoorPair": [
            {
                "label": "Environment-only title layer",
                "runId": "batch-21-title-background-environment-study-01",
                **file_evidence(ENVIRONMENT, "selected title/background layer", "Human chose the environment-only study as the title/front-door environment direction."),
            },
            {
                "label": "Home Splash Candidate B",
                "runId": "batch-21-home-splash-v01-b",
                **file_evidence(HOME_SPLASH, "selected home hero and companion composition", "Human chose Home Splash B to pair with the environment-only study."),
            },
        ],
        "carriedForwardSelection": {
            "label": "Ame-face application-icon candidate",
            "runId": "batch-13-app-icon-ame-v03",
            **file_evidence(APP_ICON, "selected application-icon source direction", "No platform derivatives or runtime branding publication are authorized."),
        },
        "logoDecision": {
            "rejected": {
                "recordId": "game-logo-mgjrpg02-v02-source",
                **file_evidence(OLD_REJECTED, "Human-rejected Plan 03-R1 Logo Candidate A", "Rejected for programmer-art flatness, clipping/construction errors, and material quality far below the Batch 21 and Batch 22 references."),
            },
            "humanApproved": {
                "recordId": "game-logo-mgjrpg02-v03-source",
                **file_evidence(SELECTED, "Human-approved generated Logo Candidate B", "Fresh generated premium material construction with one bounded depth-one cleanup edit; runtime publication remains separate."),
            },
        },
        "utilityIconDecision": {
            "status": "human-approved-complete-family",
            "ids": ["nav-home", "nav-mazes", "nav-book", "nav-help", "nav-sound", "nav-muted", "nav-restart"],
            "scope": "Batch 23 premium utility source candidates; runtime derivatives and catalogue publication remain separate.",
        },
        "publicationAuthorized": False,
        "evidence": "Human correction and logo feedback in the Plan 03-R1 task on 2026-09-04; recorded forward without rewriting v07 or Batch 21 history.",
    }
    json_write(DECISION_V08, payload)


def generation_run(
    run_id: str,
    mode: str,
    output: dict[str, object],
    references: list[dict[str, object]],
    disposition: dict[str, str],
    edit_depth: int,
) -> dict[str, object]:
    return {
        "generationMode": mode,
        "lineage": {
            "freshCanvas": edit_depth == 0,
            "previousBatchOutputUsed": True,
            "previousBatchOutputApprovalEvidence": "docs/source-assets/calibrations/mgjrpg-02/v06/human-decision.json",
            "rejectedOutputUsedAsReference": False,
            "editOfEdit": False,
            "sourceEditDepth": edit_depth,
            "mayBecomeIdentityAuthority": False,
            "mayBecomeRenderingAuthority": False,
        },
        "runId": run_id,
        "promptBlockId": run_id,
        "identityId": "game-logo",
        "orderedReferences": references,
        "output": output,
        "disposition": disposition,
    }


def build_review_evidence() -> None:
    decision = {"path": repo_path(DECISION_V08), "sha256": sha256(DECISION_V08)}
    json_write(
        BATCH23_REVIEW,
        {
            "schema": "maze-art-source-review/v1",
            "reviewedOn": "2026-09-04",
            "reviewedBy": "Human",
            "batchId": "mgjrpg-02-batch-23-plan03-r1-premium-ui-logo",
            "decisionEvidence": decision,
            "approvedSourceIds": ["nav-home", "nav-mazes", "nav-book", "nav-help", "nav-sound", "nav-muted", "nav-restart"],
            "rejectedSourceIds": ["game-logo-mgjrpg02-v02-source"],
            "publicationAuthorized": False,
        },
    )
    json_write(
        BATCH24_REVIEW,
        {
            "schema": "maze-art-source-review/v1",
            "reviewedOn": "2026-09-04",
            "reviewedBy": "Human",
            "batchId": "mgjrpg-02-batch-24-plan03-r1-logo-revision",
            "decisionEvidence": decision,
            "approvedSourceIds": ["game-logo-mgjrpg02-v03-source"],
            "rejectedSourceIds": [],
            "publicationAuthorized": False,
        },
    )


def build_records(fresh: dict[str, object], selected: dict[str, object]) -> None:
    prompt_fact = file_evidence(PROMPTS, "exact prompt history", "Both built-in ImageGen prompts and output IDs are preserved verbatim.")
    recipe_fact = file_evidence(RECIPE, "approved rendering recipe", "Approved mgjrpg-02 material and contour contract.")
    canary_fact = file_evidence(CANARY, "approved canary review", "Global mgjrpg-02 rendering review authority.")
    decision_fact = file_evidence(DECISION_V08, "forward Human decision", "Corrected title/home selection and rejected Logo A are recorded without rewriting history.")

    refs = {
        "batch21-logo-composition": file_evidence(OLD_GENERATED, "composition authority", "Generated Batch 21 stacked-logo direction; yellow route treatment explicitly excluded."),
        "batch22-pathfinder-craft": file_evidence(PATHFINDER, "approved premium material authority", "Glossy enamel, foil, holographic and cutline craft only."),
        "batch22-maze-mapper-craft": file_evidence(MAZE_MAPPER, "approved premium material authority", "Glossy enamel, maze-stone clarity, foil and holographic craft only."),
    }
    fresh_output = fresh["source"]
    lowercase_only_output = generator_fact(LOWERCASE_ONLY, "exec-c68cd98c-1ad6-4ef0-a988-f8120173ecfe.png")
    selected_output = selected["source"]
    runs = [
        generation_run(
            "batch-24-game-logo-v03-candidate-b-matte-01",
            "fresh-reference-led-source-on-uniform-matte",
            fresh_output,
            [
                {"order": 1, "referenceId": "batch21-logo-composition", "role": "edit target and approved composition direction only"},
                {"order": 2, "referenceId": "batch22-pathfinder-craft", "role": "approved material-craft reference only"},
                {"order": 3, "referenceId": "batch22-maze-mapper-craft", "role": "approved material-craft reference only"},
            ],
            {"status": "art-director-rejected-source", "reason": "Retained immutably as the fresh parent; not selected because its central plaque needed a bounded lowercase correction."},
            0,
        ),
        generation_run(
            "batch-24-game-logo-v03-candidate-b-lowercase-edit-01",
            "precise-text-edit-on-generator-original",
            lowercase_only_output,
            [{"order": 1, "referenceId": "game-logo-v03-fresh-output", "role": "sole edit target; change central plaque letters only"}],
            {"status": "art-director-rejected-source", "reason": "Lowercase-only edit retained immutably; its proof exposed small source-generation gaps inside the cream cutline."},
            1,
        ),
        generation_run(
            "batch-24-game-logo-v03-candidate-b-cleanup-edit-02",
            "precise-text-and-silhouette-edit-on-generator-original",
            selected_output,
            [{"order": 1, "referenceId": "game-logo-v03-fresh-output", "role": "sole edit target; change central plaque letters and repair internal matte gaps only"}],
            {"status": "human-approved-source", "reason": "Human approved generated premium Logo Candidate B; runtime publication remains a separate measured gate."},
            1,
        ),
    ]
    batch_record = {
        "schema": "maze-art-generation-batch/v1",
        "batchId": "mgjrpg-02-batch-24-plan03-r1-logo-revision",
        "revision": 1,
        "status": "reviewed",
        "recordedOn": "2026-09-04",
        "purpose": "Replace rejected Plan 03-R1 Logo Candidate A with a genuinely generated premium logo and record the corrected title/home pairing without runtime publication.",
        "rollbackAnchor": "43c99a0fd193b8fd799321bae0b150f91fab557c",
        "promptFile": {"path": repo_path(PROMPTS), "fidelity": "exact", "sha256": prompt_fact["sha256"], "bytes": prompt_fact["bytes"]},
        "decisionEvidence": {"path": repo_path(DECISION_V08), "scope": "forward title/home correction and logo review", "sha256": decision_fact["sha256"], "bytes": decision_fact["bytes"]},
        "reviewEvidence": file_evidence(BATCH24_REVIEW, "Human source review", "Generated Logo Candidate B approved; publication remains separate."),
        "generator": {"provider": "OpenAI", "interface": "Codex built-in image generation capability", "model": "not exposed by the tool response", "seed": "not exposed by the tool response"},
        "lineagePolicy": {"freshCandidate": "reference-led generated re-authoring", "boundedEdit": "one text-only edit of the fresh generator original", "editOfEdit": "forbidden", "runtimeAuthority": "none before the separate runtime-publication gate"},
        "recipeEvidence": {"recipeId": "mgjrpg-02", "revision": 4, "path": repo_path(RECIPE), "sha256": recipe_fact["sha256"], "bytes": recipe_fact["bytes"]},
        "nativeCanvasException": {"appliesToEveryOutput": True, "actual": "All three immutable ImageGen outputs are 1536x1024 opaque RGB PNGs on a uniform chroma-green matte.", "canonicalPolicy": "Immutable originals remain native; only ignored review proofs receive deterministic alpha extraction.", "exception": "No runtime derivative is created in this review gate."},
        "referenceRegistry": {
            **{key: {"path": value["path"], "authorityKind": value["relationship"], "sha256": value["sha256"], "bytes": value["bytes"]} for key, value in refs.items()},
            "game-logo-v03-fresh-output": {"path": fresh_output["path"], "authorityKind": "sole-edit-target-generator-original", "sha256": fresh_output["sha256"], "bytes": fresh_output["bytes"]},
        },
        "runs": runs,
        "runtimeImpact": {"runtimeAssetWrites": 0, "cataloguePointerChanges": 0, "runtimeEncodedByteDelta": 0, "runtimeDecodedByteDelta": 0},
        "review": {"page": "artifacts/art-proofs/mgjrpg-02/plan03-r1-logo-revision/index.html", "recommendation": "Generated Logo Candidate B", "humanDecision": "approved", "publicationAuthorized": False},
        "reviewProtocol": {"batchProofStatus": "Human reviewed: generated Logo Candidate B approved", "decisionRule": "Runtime publication requires a separate versioned derivative, pointer, allocation, and runtime-proof gate.", "silenceRule": "Not applicable; explicit Human decision recorded in calibration v08.", "candidateBoundary": "Source approval does not create runtime files, catalogue pointers, platform icons, retirement actions, or allocated bytes."},
        "rights": {"originClaim": "Generated for Maze so Puzzle from internal approved composition and material references; no named franchise, living artist, proprietary logo, or copied badge layout was requested.", "licenceStatus": "pending-owner-review", "releaseStatus": "not-approved"},
        "rollback": {"method": "Keep all current runtime files and catalogue pointers; preserve rejected Logo A and remove only unapproved Batch 24 sources/records/proofs if rollback is requested.", "runtimeRollbackRequired": False},
        "counts": {"runCount": 3, "rejectedBackgroundInvalidCount": 0, "pendingHumanCandidateCount": 0, "humanApprovedSourceCount": 1, "humanRejectedSourceCount": 0, "artDirectorRejectedSourceCount": 2, "generatorOriginalEncodedBytes": int(fresh_output["bytes"]) + int(lowercase_only_output["bytes"]) + int(selected_output["bytes"]), "generatorOriginalDecodedBytesUpperBound": int(fresh_output["decodedBytesUpperBound"]) + int(lowercase_only_output["decodedBytesUpperBound"]) + int(selected_output["decodedBytesUpperBound"])},
    }
    json_write(BATCH / "run-record.json", batch_record)

    source_record = {
        "$schema": "../schema/art-source.schema.json",
        "schemaVersion": 2,
        "recordId": "game-logo-mgjrpg02-v03-source",
        "id": "game-logo",
        "artVersion": 3,
        "family": "brand",
        "runtimeStatus": "source-only",
        "sourceStatus": "source-backed",
        "approvalStatus": "design-approved",
        "validationProfile": "strict-v2",
        "recipeVersion": "mgjrpg-02",
        "derivativeRecipeVersion": "proposed-plan11-branding-r02",
        "recipeEvidence": {"recipeId": "mgjrpg-02", "path": repo_path(RECIPE), "sha256": recipe_fact["sha256"]},
        "generationRuns": [
            {
                "runId": "batch-24-game-logo-v03-candidate-b-matte-01",
                "generator": "OpenAI built-in image generation capability",
                "model": "not exposed by tool response",
                "executedAt": "unknown",
                "prompt": {"path": repo_path(PROMPTS), "sha256": prompt_fact["sha256"]},
                "references": [
                    {"order": 1, "role": "composition-authority", "authorityKind": "immutable-generator-original", "path": repo_path(OLD_GENERATED), "sha256": sha256(OLD_GENERATED)},
                    {"order": 2, "role": "material-authority", "authorityKind": "approved-rendering-anchor", "path": repo_path(PATHFINDER), "sha256": sha256(PATHFINDER)},
                    {"order": 3, "role": "material-authority", "authorityKind": "approved-rendering-anchor", "path": repo_path(MAZE_MAPPER), "sha256": sha256(MAZE_MAPPER)},
                ],
                "outputs": [{"outputId": fresh_output["outputId"], "path": fresh_output["path"], "sha256": fresh_output["sha256"], "bytes": fresh_output["bytes"], "disposition": "superseded", "reason": "Retained as the fresh generated base for one bounded lowercase-plaque edit."}],
                "lineage": {"editOfEdit": False, "identityAuthorityEligible": False, "renderingAuthorityEligible": False},
                "notes": "Fresh re-authoring; no Batch 23 deterministic pixels were used.",
            },
            {
                "runId": "batch-24-game-logo-v03-candidate-b-lowercase-edit-01",
                "generator": "OpenAI built-in image generation capability",
                "model": "not exposed by tool response",
                "executedAt": "unknown",
                "prompt": {"path": repo_path(PROMPTS), "sha256": prompt_fact["sha256"]},
                "references": [{"order": 1, "role": "edit-target", "authorityKind": "immutable-generator-original", "path": fresh_output["path"], "sha256": fresh_output["sha256"]}],
                "outputs": [{"outputId": lowercase_only_output["outputId"], "path": lowercase_only_output["path"], "sha256": lowercase_only_output["sha256"], "bytes": lowercase_only_output["bytes"], "disposition": "superseded", "reason": "Retained as technical evidence; internal green/black generation gaps remained visible after extraction."}],
                "lineage": {"editOfEdit": False, "identityAuthorityEligible": False, "renderingAuthorityEligible": False},
                "notes": "Single bounded text correction from the fresh generator original; source edit depth one.",
            },
            {
                "runId": "batch-24-game-logo-v03-candidate-b-cleanup-edit-02",
                "generator": "OpenAI built-in image generation capability",
                "model": "not exposed by tool response",
                "executedAt": "unknown",
                "prompt": {"path": repo_path(PROMPTS), "sha256": prompt_fact["sha256"]},
                "references": [{"order": 1, "role": "edit-target", "authorityKind": "immutable-generator-original", "path": fresh_output["path"], "sha256": fresh_output["sha256"]}],
                "outputs": [{"outputId": selected_output["outputId"], "path": selected_output["path"], "sha256": selected_output["sha256"], "bytes": selected_output["bytes"], "disposition": "selected", "reason": "Human-approved generated Logo Candidate B; runtime publication remains a separate gate."}],
                "lineage": {"editOfEdit": False, "identityAuthorityEligible": False, "renderingAuthorityEligible": False},
                "notes": "One combined lowercase and internal-gap correction from the fresh generator original; source edit depth one. The lowercase-only edit was not used as a reference.",
            },
        ],
        "renderingContract": {"profileId": "storybook-local-contour-v1", "recipeId": "mgjrpg-02", "treatmentClass": "semantic-ui-cutout", "canaryReview": {"reviewId": "mgjrpg-02-canary-v01", "path": repo_path(CANARY), "sha256": canary_fact["sha256"]}, "authoredContour": "material-local-color-aware", "extractionRole": "alpha-matte-only", "stickerCutline": "semantic-cream-only"},
        "promptEvidence": {"fidelity": "exact", "historyPath": repo_path(PROMPTS), "assetNamedInHistory": True, "promptFile": {"path": repo_path(PROMPTS), "sha256": prompt_fact["sha256"]}, "outputIds": [fresh_output["outputId"], lowercase_only_output["outputId"], selected_output["outputId"]], "notes": "Exact generation and bounded correction prompts are preserved verbatim."},
        "sources": [file_evidence(SELECTED, "human-approved generated logo master", "Human-approved premium generated Logo Candidate B; runtime publication remains deferred."), file_evidence(LOWERCASE_ONLY, "superseded lowercase-only technical evidence", "Retained immutably; not used as a reference for the recommended candidate."), file_evidence(FRESH, "immutable fresh generated parent", "Sole parent of both bounded depth-one corrections."), file_evidence(OLD_GENERATED, "approved composition reference", "Batch 21 stacked construction only; no route-line requirement."), file_evidence(PATHFINDER, "approved material reference", "Batch 22 premium craft only."), file_evidence(MAZE_MAPPER, "approved material reference", "Batch 22 premium craft only.")],
        "derivatives": [],
        "geometry": {"class": "brand-wordmark", "pivot": [0.5, 0.5], "visibleBounds": [0.04, 0.04, 0.92, 0.92], "safeInset": [0.04, 0.04, 0.04, 0.04]},
        "build": {"sourcePath": repo_path(SELECTED), "operation": "cutout-resize", "profiles": [{"id": "source-review-logo", "outputPath": "artifacts/art-proofs/mgjrpg-02/plan03-r1-logo-revision/assets/logo-v03-candidate-b-transparent.png", "width": selected["proof"]["width"], "height": selected["proof"]["height"], "format": "png", "encoder": {"options": {"compress_level": 9, "optimize": False}}}], "backgroundExtraction": {"mode": "flat-impossible-matte", "recipeId": "flat-impossible-matte-alpha-unblend-v1", "rgb": selected["processing"]["matte"]["rgb"], "clearDistance": 72.0, "opaqueDistance": 210.0, "minimumComponentPixels": 128}},
        "humanEdits": [{"kind": "bounded-generated-text-correction", "description": "One ImageGen edit changes only the central coral-plaque word to exact lowercase 'so'; no edit-of-edit lineage.", "script": "scripts/art_pipeline/mgjrpg02_plan03_r1_logo_revision.py"}],
        "designApprovalEvidence": {"approvedBy": "Human project author", "approvedOn": "2026-09-04", "scope": "identity-and-construction", "decision": "The Human approved generated Logo Candidate B as the Maze so Puzzle logo source direction; runtime publication remains a separate gate.", "evidencePath": repo_path(DECISION_V08)},
        "knownUnknowns": ["Responsive lockups, runtime delivery profiles, platform derivatives, runtime-publish approval, rights review, and performance allocation remain pending."],
        "rights": {"originClaim": "Generated for Maze so Puzzle from internal approved composition and material references; no named franchise, living artist, proprietary logo, or copied badge layout was requested.", "licenceStatus": "pending-owner-review", "notes": "Plan 11 remains final branding owner."},
        "rollback": {"method": "No runtime logo pointer exists. Preserve rejected v02 history and remove only unapproved v03 source records/candidates to return to the pushed R1 checkpoint."},
    }
    json_write(SOURCE_RECORD, source_record)

    json_write(
        BATCH / "source-review-measurements.json",
        {
            "schema": "maze-plan03-r1-logo-revision-review/v1",
            "generatedOn": "2026-09-04",
            "scope": "source-only; no runtime/public/catalogue publication",
            "freshCandidate": fresh,
            "recommendedCandidate": selected,
            "counts": {"generatorOriginalCount": 3, "generatorOriginalEncodedBytes": int(fresh_output["bytes"]) + int(lowercase_only_output["bytes"]) + int(selected_output["bytes"]), "generatorOriginalDecodedBytesUpperBound": int(fresh_output["decodedBytesUpperBound"]) + int(lowercase_only_output["decodedBytesUpperBound"]) + int(selected_output["decodedBytesUpperBound"]), "runtimeEncodedByteDelta": 0, "runtimeDecodedByteDelta": 0},
            "reviewPage": "artifacts/art-proofs/mgjrpg-02/plan03-r1-logo-revision/index.html",
        },
    )
    json_write(
        BATCH / "proposed-publication-map.json",
        {
            "schema": "maze-art-proposed-publication-map/v1",
            "generatedOn": "2026-09-04",
            "status": "proposal-only-no-files-created",
            "entries": [
                {"stableId": "title-environment-layer", "candidateSource": repo_path(ENVIRONMENT), "proposedRuntimePath": "public/assets/mgjrpg-02/brand/title-environment-v01-front-door-r01.webp", "status": "human-source-selected-publication-deferred"},
                {"stableId": "home-hero-splash", "candidateSource": repo_path(HOME_SPLASH), "proposedRuntimePath": "public/assets/mgjrpg-02/brand/home-hero-splash-v01-front-door-r01.webp", "status": "human-source-selected-publication-deferred"},
                {"stableId": "app-icon-ame", "candidateSource": repo_path(APP_ICON), "proposedRuntimePath": None, "status": "human-source-selected-platform-derivatives-deferred"},
                {"stableId": "game-logo", "candidateSource": repo_path(SELECTED), "proposedRuntimePath": "public/assets/mgjrpg-02/brand/game-logo-v03-front-door-r01.webp", "status": "human-source-approved-publication-deferred"},
            ],
            "performance": {"currentPublicMediaHeadroom": 0, "runtimeEncodedByteDelta": 0, "runtimeDecodedByteDelta": 0, "publicationRequiresNamedFeatureAllocation": True},
        },
    )


def build_html() -> None:
    sizes = (1024, 640, 384, 256, 160, 96)
    strip = "".join(
        f'<span><img src="assets/logo-v03-candidate-b-{size}.png" width="{size}" alt="Logo Candidate B at {size}px"><b>{size}px</b></span>'
        for size in sizes
    )
    page = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Plan 03-R1 logo revision</title><style>
:root{{font-family:Inter,ui-rounded,system-ui,sans-serif;color:#3d2948;background:#eee8df}}*{{box-sizing:border-box}}body{{margin:0}}main{{max-width:1280px;margin:auto;padding:24px}}h1{{margin-bottom:4px}}p{{color:#6f5a74;max-width:88ch}}.notice{{background:#ffe1a2;border-left:6px solid #d58f24;padding:12px 15px;border-radius:12px}}.pair,.compare{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}}figure{{margin:0;background:#fff9ed;border:1px solid #ddced8;border-radius:18px;padding:12px;box-shadow:0 4px 0 #d7ccd1}}figure img{{display:block;width:100%;height:auto;border-radius:11px}}figcaption{{padding-top:9px}}code{{display:block;font-size:11px;overflow-wrap:anywhere;color:#76546f}}.logo{{padding:20px;background:linear-gradient(135deg,#fff8eb,#c7ece2 55%,#493950)}}.checker{{background-color:#fff;background-image:linear-gradient(45deg,#d9d9d9 25%,transparent 25%),linear-gradient(-45deg,#d9d9d9 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#d9d9d9 75%),linear-gradient(-45deg,transparent 75%,#d9d9d9 75%);background-size:32px 32px;background-position:0 0,0 16px,16px -16px,-16px 0}}.bg-grid{{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}}.bg-grid div{{padding:12px;border-radius:14px}}.bg-grid img{{width:100%;height:auto}}.dark{{background:#34293d}}.light{{background:#fff8e9}}.sat{{background:#2d7f8d}}.strip{{display:flex;align-items:flex-end;gap:18px;overflow-x:auto;padding:18px;background:#403348;border-radius:16px}}.strip span{{display:grid;justify-items:center;gap:6px;flex:none}}.strip b{{color:#fff0dc;font-size:12px}}.strip img{{height:auto;max-width:none}}.bad{{filter:saturate(.55)}}@media(max-width:720px){{main{{padding:14px}}.pair,.compare,.bg-grid{{grid-template-columns:1fr}}}}
</style></head><body><main><h1>Plan 03-R1 · generated logo revision</h1><p class="notice"><strong>Decisions recorded:</strong> Title Candidate A is withdrawn. Title Candidate B was considered but not selected. The forward front-door pairing is the environment-only title layer plus Home Splash Candidate B. Generated Logo Candidate B and all seven premium utility icons are Human-approved sources; publication remains separate.</p>
<h2>Selected front-door pairing</h2><div class="pair"><figure><img src="assets/front-door-environment.jpg" alt="Environment-only title artwork"><figcaption><strong>Environment-only title layer</strong><code>batch-21-title-background-environment-study-01</code></figcaption></figure><figure><img src="assets/front-door-home-splash-b.jpg" alt="Home Splash Candidate B"><figcaption><strong>Home Splash Candidate B</strong><code>batch-21-home-splash-v01-b</code></figcaption></figure></div>
<h2>Logo correction</h2><div class="compare"><figure><img class="bad" src="assets/rejected-logo-a.png" alt="Rejected deterministic Logo Candidate A"><figcaption><strong>Rejected · Logo Candidate A</strong><br>Human-rejected for programmer-art flatness, clipping/construction errors, and inadequate material craft.</figcaption></figure><figure class="logo checker"><img src="assets/logo-v03-candidate-b-transparent.png" alt="Recommended generated Maze so Puzzle Logo Candidate B"><figcaption><strong>Recommended · generated Logo Candidate B</strong><code>{html.escape(repo_path(SELECTED))}</code></figcaption></figure></div>
<p>The recommended candidate keeps the strong generated stacked silhouette, removes the yellow route line, turns “Maze” into chunky lavender maze-stone, uses mint magical enamel for “Puzzle,” and applies controlled gold foil, pearlescence, and broad holographic accents from the approved Batch 22 craft language.</p>
<h2>Transparency and background behaviour</h2><div class="bg-grid"><div class="dark"><img src="assets/logo-v03-candidate-b-transparent.png" alt="Logo on dark plum"></div><div class="light"><img src="assets/logo-v03-candidate-b-transparent.png" alt="Logo on cream"></div><div class="sat"><img src="assets/logo-v03-candidate-b-transparent.png" alt="Logo on saturated teal"></div></div>
<h2>Actual delivery-context scale strip</h2><div class="strip">{strip}</div>
<h2>Human decision recorded</h2><p class="notice"><strong>Generated Logo Candidate B is approved.</strong> All seven Batch 23 premium navigation icons are also approved. Runtime derivatives, catalogue pointers, platform icons, title-route integration, and public bytes remain unchanged and require the separate publication gate.</p>
<p><a href="../plan03-r1-review/index.html">Return to the seven-icon R1 review page</a></p></main></body></html>"""
    PROOF.mkdir(parents=True, exist_ok=True)
    (PROOF / "index.html").write_text(page, encoding="utf-8")


def main() -> None:
    for path in (PROMPTS, FRESH, LOWERCASE_ONLY, SELECTED, OLD_GENERATED, OLD_REJECTED, PATHFINDER, MAZE_MAPPER, ENVIRONMENT, HOME_SPLASH, TITLE_A, TITLE_B, APP_ICON, RECIPE, CANARY, DECISION_V07):
        if not path.is_file():
            raise FileNotFoundError(path)
    fresh, selected = build_proof()
    build_decision()
    build_review_evidence()
    build_records(fresh, selected)
    build_html()
    print(json.dumps({"recommended": repo_path(SELECTED), "sourceEncodedBytes": SELECTED.stat().st_size, "proof": "artifacts/art-proofs/mgjrpg-02/plan03-r1-logo-revision/index.html", "runtimeEncodedByteDelta": 0, "runtimeDecodedByteDelta": 0}, indent=2))


if __name__ == "__main__":
    main()
