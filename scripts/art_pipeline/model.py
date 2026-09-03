"""Shared paths, file facts, lifecycle classification, and record validation."""

from __future__ import annotations

import hashlib
import json
import re
import subprocess
from collections import Counter
from functools import lru_cache
from pathlib import Path
from typing import Any, Iterable

from jsonschema import Draft202012Validator, FormatChecker
from jsonschema.exceptions import SchemaError
from PIL import Image


ROOT = Path(__file__).resolve().parents[2]
SOURCE_ROOT = ROOT / "docs" / "source-assets"
RECORD_ROOT = SOURCE_ROOT / "records"
RECIPE_ROOT = SOURCE_ROOT / "recipes"
REVIEW_ROOT = SOURCE_ROOT / "reviews"
CALIBRATION_ROOT = SOURCE_ROOT / "calibrations"
PRODUCTION_ROOT = SOURCE_ROOT / "production"
SCHEMA_PATH = SOURCE_ROOT / "schema" / "art-source.schema.json"
MANIFEST_PATH = SOURCE_ROOT / "manifest.json"
RUNTIME_ROOT = ROOT / "public" / "assets"
PROOF_ROOT = ROOT / "artifacts" / "art-proofs"
PROMPT_HISTORY_PATH = "docs/AI_ASSET_PROMPTS.md"

IMAGE_EXTENSIONS = {".png", ".webp", ".jpg", ".jpeg"}
RUNTIME_STATUSES = {"active", "dormant", "deprecated", "superseded", "source-only"}
SOURCE_STATUSES = {"source-backed", "partial", "legacy-runtime-only"}
APPROVAL_STATUSES = {
    "historical",
    "candidate",
    "pending-human",
    "design-approved",
    "approved",
    "rejected",
}
VALIDATION_PROFILES = {"legacy-observed", "strict-v1", "strict-v2"}
PROMPT_FIDELITIES = {"exact", "template-substitution", "concise", "unknown"}
ART_RECIPE_SCHEMA = "maze-art-recipe/v1"
CANARY_REVIEW_SCHEMA = "maze-art-canary-review/v1"
GENERATION_BATCH_SCHEMA = "maze-art-generation-batch/v1"
MGJRPG_02_RECIPE_ID = "mgjrpg-02"
MGJRPG_02_RENDERING_PROFILE = "storybook-local-contour-v1"
MGJRPG_02_REVIEW_ID = "mgjrpg-02-canary-v01"
MGJRPG_02_REFERENCE_ROLES = {
    "edit-target",
    "identity-authority",
    "construction-authority",
    "rendering-authority",
    "family-authority",
    "material-authority",
    "palette-authority",
    "composition-authority",
    "optical-authority",
    "comparison-only",
    "negative-reference",
}
MGJRPG_02_AUTHORITY_KINDS = {
    "immutable-generator-original",
    "approved-source-master",
    "approved-model-sheet",
    "approved-rendering-anchor",
    "runtime-comparison",
    "comparison-only",
}
MGJRPG_02_AUTHORITATIVE_REFERENCE_ROLES = {
    "edit-target",
    "identity-authority",
    "construction-authority",
    "rendering-authority",
    "family-authority",
}
MGJRPG_02_TREATMENT_BY_FAMILY = {
    "character": "character-contour",
    "friend": "character-contour",
    "enemy": "character-contour",
    "weapon": "character-contour",
    "item": "character-contour",
    "cage": "character-contour",
    "lock": "character-contour",
    "portal": "character-contour",
    "story": "story-illustration",
    "reward": "semantic-ui-cutout",
    "navigation": "semantic-ui-cutout",
    "brand": "semantic-ui-cutout",
    "terrain": "terrain-boundary",
    "dressing": "terrain-boundary",
    "hazard": "terrain-boundary",
}

SUPERSEDED_RUNTIME_IMAGES = {
    "animal-cage.png",
    "cage-garden-vine-front-v2.png",
    "cage-garden-vine-front-v4.png",
    "cage-garden-vine-v1.png",
    "cage-golden-heart-front-v2.png",
    "cage-golden-heart-front-v4.png",
    "cage-moon-silver-front-v2.png",
    "cage-moon-silver-front-v4.png",
    "cage-moon-silver-v1.png",
    "cage-storybook-wood-front-v2.png",
    "cage-storybook-wood-front-v4.png",
    "cage-storybook-wood-v1.png",
    "floor-v2.png",
    "lava.png",
    "wall-v2.png",
    "water.png",
}

DEPRECATED_RUNTIME_IMAGES = {
    "ame-sword.png",
    "reward-brave-medal.png",
    "reward-rescue-medal.png",
    "reward-splash-sticker.png",
}

DORMANT_RUNTIME_IMAGES = {"wall-sandstone-v1.png"}

SEMANTIC_ART_IDENTITIES = {
    "star-key.png": ("key-blue-star", 1, "key-blue-star-v01-source"),
    "star-door.png": ("door-blue-star", 1, "door-blue-star-v01-source"),
}


def posix_relative(path: Path) -> str:
    return path.resolve().relative_to(ROOT).as_posix()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def json_bytes(value: Any) -> bytes:
    return (json.dumps(value, indent=2, ensure_ascii=False) + "\n").encode("utf-8")


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8-sig"))


def image_facts(path: Path) -> dict[str, Any]:
    with Image.open(path) as image:
        image.load()
        width, height = image.size
        bands = image.getbands()
        has_alpha = "A" in bands or "transparency" in image.info
        alpha_mode = "straight" if has_alpha else "opaque"
        return {
            "width": width,
            "height": height,
            "format": (image.format or path.suffix.removeprefix(".")).lower(),
            "mode": image.mode,
            "alphaMode": alpha_mode,
            "decodedBytesUpperBound": width * height * 4,
            "colorMetadata": sorted(
                key
                for key in ("icc_profile", "srgb", "gamma", "chromaticity")
                if key in image.info
            ),
        }


def iter_runtime_images() -> list[Path]:
    return sorted(
        path
        for path in RUNTIME_ROOT.rglob("*")
        if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS
    )


def iter_source_images() -> list[Path]:
    return sorted(
        path
        for path in SOURCE_ROOT.rglob("*")
        if path.is_file()
        and path.suffix.lower() in IMAGE_EXTENSIONS
        and RECORD_ROOT not in path.parents
        and CALIBRATION_ROOT not in path.parents
    )


def runtime_status(relative_asset_path: str) -> str:
    name = Path(relative_asset_path).name
    if name in SUPERSEDED_RUNTIME_IMAGES:
        return "superseded"
    if name in DEPRECATED_RUNTIME_IMAGES:
        return "deprecated"
    if name in DORMANT_RUNTIME_IMAGES:
        return "dormant"
    return "active"


def art_identity(filename: str) -> tuple[str, int, str]:
    if filename.lower() in SEMANTIC_ART_IDENTITIES:
        return SEMANTIC_ART_IDENTITIES[filename.lower()]
    stem = Path(filename).stem.lower()
    match = re.match(r"^(.*)-v(\d+)$", stem)
    if match:
        stable_id = match.group(1)
        art_version = int(match.group(2))
    else:
        stable_id = stem
        art_version = 1
    record_id = f"{stable_id}-v{art_version:02d}-source"
    return stable_id, art_version, record_id


def art_family(filename: str) -> str:
    stem = Path(filename).stem.lower()
    if stem == "ame" or stem.startswith("ame-sword"):
        return "character"
    if stem.startswith("ame-portrait") or stem.startswith("title-background") or stem.startswith("story-"):
        return "story"
    if stem.startswith("animal-") and stem != "animal-cage":
        return "friend"
    if stem == "goblin" or stem.startswith("enemy-"):
        return "enemy"
    if stem == "sword" or stem.startswith("weapon-"):
        return "weapon"
    if stem == "animal-cage" or stem.startswith("cage-"):
        return "cage"
    if stem in {"star-key", "star-door"} or stem.startswith(("key-", "door-")):
        return "lock"
    if stem == "goal" or stem.startswith("portal-"):
        return "portal"
    if stem.startswith(("reward-", "badge-")):
        return "reward"
    if stem.startswith("terrain-dressing-"):
        return "dressing"
    if stem.startswith(("floor", "wall")):
        return "terrain"
    if stem in {"water", "water-v2", "lava", "lava-v2", "ground-hole-v1"} or stem.startswith("terrain-poison"):
        return "hazard"
    if stem.startswith("nav-"):
        return "navigation"
    return "item"


def loading_phase(filename: str, status: str) -> str:
    stem = Path(filename).stem.lower()
    if status != "active":
        return "not-loaded-by-active-catalogue"
    if stem.startswith(("title-", "nav-")):
        return "title-or-navigation"
    if stem.startswith(("reward-", "badge-")):
        return "deferred-reward-or-adventure-book"
    if stem.startswith("story-") or stem == "ame-portrait":
        return "story-or-level-entry"
    return "level-entry-warmup-or-first-use"


def source_candidates_for(runtime_path: Path) -> list[Path]:
    stem = runtime_path.stem
    names = [f"{stem}-master.png", f"{stem}.png"]
    candidates: list[Path] = []
    for name in names:
        path = SOURCE_ROOT / name
        if path.is_file() and path not in candidates:
            candidates.append(path)
    return candidates


def repository_first_seen(path: Path) -> dict[str, str] | None:
    try:
        output = subprocess.check_output(
            [
                "git",
                "log",
                "--diff-filter=A",
                "--follow",
                "--format=%H%x09%cI",
                "--",
                posix_relative(path),
            ],
            cwd=ROOT,
            text=True,
            stderr=subprocess.DEVNULL,
        ).strip()
    except (OSError, subprocess.CalledProcessError):
        return None
    rows = [row for row in output.splitlines() if "\t" in row]
    if not rows:
        return None
    commit, first_seen_at = rows[-1].split("\t", 1)
    if not re.fullmatch(r"[0-9a-f]{40}", commit):
        return None
    return {
        "firstSeenCommit": commit,
        "firstSeenAt": first_seen_at,
        "meaning": "repository-first-seen-not-generation-date",
    }


def inside_root(path: Path, parent: Path = ROOT) -> bool:
    try:
        path.resolve().relative_to(parent.resolve())
        return True
    except ValueError:
        return False


def _require(record: dict[str, Any], field: str, expected: type, errors: list[str]) -> Any:
    value = record.get(field)
    if not isinstance(value, expected):
        errors.append(f"{field} must be {expected.__name__}")
    return value


@lru_cache(maxsize=1)
def record_schema_validator() -> Draft202012Validator:
    schema = read_json(SCHEMA_PATH)
    Draft202012Validator.check_schema(schema)
    return Draft202012Validator(schema, format_checker=FormatChecker())


def validate_record_shape(record: dict[str, Any], label: str) -> list[str]:
    errors: list[str] = []
    try:
        validator = record_schema_validator()
        for issue in sorted(
            validator.iter_errors(record),
            key=lambda error: tuple(str(value) for value in error.absolute_path),
        ):
            location = ".".join(str(value) for value in issue.absolute_path) or "$"
            errors.append(f"schema {location}: {issue.message}")
    except (OSError, json.JSONDecodeError, SchemaError) as exc:
        errors.append(f"schema authority is invalid: {exc}")
    schema_version = record.get("schemaVersion")
    if schema_version not in {1, 2}:
        errors.append("schemaVersion must be 1 or 2")
    for field in ("recordId", "id", "family", "recipeVersion"):
        value = _require(record, field, str, errors)
        if isinstance(value, str) and not value:
            errors.append(f"{field} must not be empty")
    art_version = record.get("artVersion")
    if not isinstance(art_version, int) or isinstance(art_version, bool) or art_version < 1:
        errors.append("artVersion must be a positive integer")
    if record.get("runtimeStatus") not in RUNTIME_STATUSES:
        errors.append("runtimeStatus is invalid")
    if record.get("sourceStatus") not in SOURCE_STATUSES:
        errors.append("sourceStatus is invalid")
    if record.get("approvalStatus") not in APPROVAL_STATUSES:
        errors.append("approvalStatus is invalid")
    if record.get("validationProfile") not in VALIDATION_PROFILES:
        errors.append("validationProfile is invalid")
    if schema_version == 1 and record.get("validationProfile") == "strict-v2":
        errors.append("schemaVersion 1 cannot use strict-v2")
    if schema_version == 2 and record.get("validationProfile") != "strict-v2":
        errors.append("schemaVersion 2 requires strict-v2")
    prompt = _require(record, "promptEvidence", dict, errors)
    if isinstance(prompt, dict) and prompt.get("fidelity") not in PROMPT_FIDELITIES:
        errors.append("promptEvidence.fidelity is invalid")
    _require(record, "sources", list, errors)
    _require(record, "derivatives", list, errors)
    _require(record, "knownUnknowns", list, errors)
    _require(record, "rights", dict, errors)
    if schema_version == 2:
        recipe_evidence = _require(record, "recipeEvidence", dict, errors)
        generation_runs = _require(record, "generationRuns", list, errors)
        rendering_contract = _require(record, "renderingContract", dict, errors)
        recipe_version = record.get("recipeVersion")
        if isinstance(recipe_evidence, dict) and recipe_evidence.get("recipeId") != recipe_version:
            errors.append("recipeEvidence.recipeId must equal recipeVersion")
        if isinstance(rendering_contract, dict):
            if rendering_contract.get("recipeId") != recipe_version:
                errors.append("renderingContract.recipeId must equal recipeVersion")
            if recipe_version == MGJRPG_02_RECIPE_ID:
                if rendering_contract.get("profileId") != MGJRPG_02_RENDERING_PROFILE:
                    errors.append(
                        "mgjrpg-02 requires renderingContract.profileId="
                        f"{MGJRPG_02_RENDERING_PROFILE}"
                    )
                review = rendering_contract.get("canaryReview")
                if not isinstance(review, dict) or review.get("reviewId") != MGJRPG_02_REVIEW_ID:
                    errors.append(
                        f"mgjrpg-02 requires canary review {MGJRPG_02_REVIEW_ID}"
                    )
                expected_treatment = MGJRPG_02_TREATMENT_BY_FAMILY.get(
                    str(record.get("family", ""))
                )
                if rendering_contract.get("treatmentClass") != expected_treatment:
                    errors.append(
                        "mgjrpg-02 treatmentClass must be "
                        f"{expected_treatment!r} for family {record.get('family')!r}"
                    )
        if isinstance(generation_runs, list):
            run_ids: list[str] = []
            selected_output_paths: list[str] = []
            for run_index, run in enumerate(generation_runs):
                if not isinstance(run, dict):
                    continue
                run_ids.append(str(run.get("runId", "")))
                references = run.get("references")
                if isinstance(references, list):
                    orders = [
                        reference.get("order")
                        for reference in references
                        if isinstance(reference, dict)
                    ]
                    expected = list(range(1, len(references) + 1))
                    if orders != expected:
                        errors.append(
                            f"generationRuns[{run_index}].references orders must be exactly {expected}"
                        )
                    for reference_index, reference in enumerate(references):
                        if not isinstance(reference, dict):
                            continue
                        role = reference.get("role")
                        authority_kind = reference.get("authorityKind")
                        if role not in MGJRPG_02_REFERENCE_ROLES:
                            errors.append(
                                f"generationRuns[{run_index}].references[{reference_index}].role is invalid"
                            )
                        if authority_kind not in MGJRPG_02_AUTHORITY_KINDS:
                            errors.append(
                                f"generationRuns[{run_index}].references[{reference_index}].authorityKind is invalid"
                            )
                        if role in MGJRPG_02_AUTHORITATIVE_REFERENCE_ROLES:
                            if authority_kind in {"runtime-comparison", "comparison-only"}:
                                errors.append(
                                    f"generationRuns[{run_index}].references[{reference_index}] "
                                    "cannot use comparison evidence as an authority"
                                )
                            path = str(reference.get("path", ""))
                            if not path.startswith("docs/source-assets/"):
                                errors.append(
                                    f"generationRuns[{run_index}].references[{reference_index}] "
                                    "authority must be an immutable docs/source-assets input"
                                )
                lineage = run.get("lineage")
                if isinstance(lineage, dict) and lineage.get("editOfEdit") is not False:
                    errors.append(
                        f"generationRuns[{run_index}].lineage.editOfEdit must be false"
                    )
                outputs = run.get("outputs")
                if isinstance(outputs, list):
                    output_ids = [
                        str(output.get("outputId", ""))
                        for output in outputs
                        if isinstance(output, dict)
                    ]
                    if len(output_ids) != len(set(output_ids)):
                        errors.append(
                            f"generationRuns[{run_index}].outputs outputId values must be unique"
                        )
                    selected_output_paths.extend(
                        str(output.get("path", ""))
                        for output in outputs
                        if isinstance(output, dict) and output.get("disposition") == "selected"
                    )
            if len(run_ids) != len(set(run_ids)):
                errors.append("generationRuns runId values must be unique")
            source_paths = {
                str(source.get("path", ""))
                for source in record.get("sources", [])
                if isinstance(source, dict)
            }
            for selected_path in selected_output_paths:
                if selected_path not in source_paths:
                    errors.append(
                        "selected generation output must also appear in immutable sources: "
                        f"{selected_path}"
                    )
            build = record.get("build")
            if isinstance(build, dict):
                if len(selected_output_paths) != 1:
                    errors.append(
                        "strict-v2 build requires exactly one selected immutable generation output"
                    )
                elif build.get("sourcePath") != selected_output_paths[0]:
                    errors.append(
                        "strict-v2 build.sourcePath must equal the selected immutable generation output"
                    )
    return [f"{label}: {error}" for error in errors]


def canonical_record_paths() -> list[Path]:
    return sorted(RECORD_ROOT.glob("*-source.json")) if RECORD_ROOT.is_dir() else []


def canonical_recipe_paths() -> list[Path]:
    return sorted(RECIPE_ROOT.glob("*.json")) if RECIPE_ROOT.is_dir() else []


def canonical_review_paths() -> list[Path]:
    return sorted(REVIEW_ROOT.glob("*.json")) if REVIEW_ROOT.is_dir() else []


def canonical_generation_batch_paths() -> list[Path]:
    """Return source-production batch records without treating proofs as authority."""

    return sorted(PRODUCTION_ROOT.glob("**/run-record.json")) if PRODUCTION_ROOT.is_dir() else []


def validate_generation_batch_shape(batch: Any, label: str) -> list[str]:
    """Validate the intrinsic, forward-only contract of a production batch record.

    File existence, hashes, byte counts, and decoded image facts are checked by
    the manifest/validator layers, where repository paths can be resolved. This
    keeps one compact batch record as the owner of immutable candidate outputs
    instead of creating a mostly duplicated source record for every rejected run.
    """

    errors: list[str] = []
    if not isinstance(batch, dict):
        return [f"{label}: batch record must be an object"]

    required = {
        "schema",
        "batchId",
        "revision",
        "status",
        "recordedOn",
        "recipeEvidence",
        "decisionEvidence",
        "promptFile",
        "generator",
        "referenceRegistry",
        "runs",
        "nativeCanvasException",
        "lineagePolicy",
        "counts",
        "reviewProtocol",
        "rights",
        "runtimeImpact",
        "rollback",
    }
    for field in sorted(required - set(batch)):
        errors.append(f"{label}: missing required field {field}")
    if batch.get("schema") != GENERATION_BATCH_SCHEMA:
        errors.append(f"{label}: schema must be {GENERATION_BATCH_SCHEMA}")
    batch_id = batch.get("batchId")
    if not isinstance(batch_id, str) or not re.fullmatch(
        r"[a-z0-9]+(?:-[a-z0-9]+)*", batch_id
    ):
        errors.append(f"{label}: batchId must be a lowercase kebab-case identifier")
    if batch.get("status") not in {"pending-human-review", "reviewed"}:
        errors.append(f"{label}: unsupported batch status {batch.get('status')!r}")

    def validate_evidence(
        evidence: Any,
        owner: str,
        *,
        require_bytes: bool = True,
        allowed_prefixes: tuple[str, ...] = ("docs/",),
    ) -> None:
        if not isinstance(evidence, dict):
            errors.append(f"{owner}: evidence must be an object")
            return
        required_fields = {"path", "sha256"}
        if require_bytes:
            required_fields.add("bytes")
        for field in sorted(required_fields - set(evidence)):
            errors.append(f"{owner}: evidence misses {field}")
        raw_path = evidence.get("path")
        if (
            not isinstance(raw_path, str)
            or not raw_path.startswith(allowed_prefixes)
            or "\\" in raw_path
        ):
            joined = " or ".join(allowed_prefixes)
            errors.append(
                f"{owner}: path must be a repository-relative POSIX path under {joined}"
            )
        digest = evidence.get("sha256")
        if not isinstance(digest, str) or not re.fullmatch(r"[0-9a-f]{64}", digest):
            errors.append(f"{owner}: sha256 must be 64 lowercase hexadecimal characters")
        if require_bytes and (
            not isinstance(evidence.get("bytes"), int) or evidence.get("bytes", 0) < 1
        ):
            errors.append(f"{owner}: bytes must be a positive integer")

    for field in ("recipeEvidence", "decisionEvidence", "promptFile"):
        validate_evidence(batch.get(field), f"{label}: {field}")

    registry = batch.get("referenceRegistry")
    if not isinstance(registry, dict) or not registry:
        errors.append(f"{label}: referenceRegistry must be a non-empty object")
        registry = {}
    else:
        for reference_id, evidence in registry.items():
            if not isinstance(reference_id, str) or not re.fullmatch(
                r"[a-z0-9]+(?:-[a-z0-9]+)*", reference_id
            ):
                errors.append(f"{label}: invalid reference id {reference_id!r}")
            if not isinstance(evidence, dict):
                errors.append(f"{label}: reference {reference_id!r} must be an object")
                continue
            for field in ("path", "sha256", "bytes", "authorityKind"):
                if field not in evidence:
                    errors.append(f"{label}: reference {reference_id!r} misses {field}")
            validate_evidence(
                evidence,
                f"{label}: reference {reference_id!r}",
                allowed_prefixes=("docs/", "public/"),
            )

    runs = batch.get("runs")
    if not isinstance(runs, list) or not runs:
        errors.append(f"{label}: runs must be a non-empty array")
        runs = []
    run_ids: list[str] = []
    prompt_block_ids: list[str] = []
    output_ids: list[str] = []
    output_paths: list[str] = []
    encoded_bytes = 0
    decoded_bytes = 0
    dispositions: Counter[str] = Counter()
    for index, run in enumerate(runs):
        owner = f"{label}: runs[{index}]"
        if not isinstance(run, dict):
            errors.append(f"{owner}: must be an object")
            continue
        for field in (
            "runId",
            "promptBlockId",
            "generationMode",
            "orderedReferences",
            "output",
            "disposition",
            "lineage",
        ):
            if field not in run:
                errors.append(f"{owner}: missing required field {field}")
        run_ids.append(str(run.get("runId", "")))
        prompt_block_ids.append(str(run.get("promptBlockId", "")))
        references = run.get("orderedReferences")
        if not isinstance(references, list) or not references:
            errors.append(f"{owner}: orderedReferences must be a non-empty array")
        else:
            orders = [entry.get("order") for entry in references if isinstance(entry, dict)]
            if orders != list(range(1, len(references) + 1)):
                errors.append(f"{owner}: reference order must be contiguous and match array order")
            for reference_index, reference in enumerate(references):
                if not isinstance(reference, dict):
                    errors.append(f"{owner}: orderedReferences[{reference_index}] must be an object")
                    continue
                reference_id = reference.get("referenceId")
                if reference_id not in registry:
                    errors.append(f"{owner}: unknown referenceId {reference_id!r}")
                if not isinstance(reference.get("role"), str) or not reference.get("role"):
                    errors.append(f"{owner}: orderedReferences[{reference_index}] needs a role")

        output = run.get("output")
        if not isinstance(output, dict):
            errors.append(f"{owner}: output must be an object")
        else:
            required_output = {
                "path",
                "outputId",
                "sha256",
                "bytes",
                "width",
                "height",
                "format",
                "mode",
                "alphaMode",
                "decodedBytesUpperBound",
            }
            for field in sorted(required_output - set(output)):
                errors.append(f"{owner}: output misses {field}")
            output_ids.append(str(output.get("outputId", "")))
            output_paths.append(str(output.get("path", "")))
            validate_evidence(output, f"{owner}: output")
            output_id = output.get("outputId")
            if not isinstance(output_id, str) or not re.fullmatch(
                r"exec-[A-Za-z0-9-]+\.[A-Za-z0-9]+", output_id
            ):
                errors.append(f"{owner}: outputId must preserve the exact generator output id")
            for dimension in ("width", "height", "decodedBytesUpperBound"):
                if not isinstance(output.get(dimension), int) or output.get(dimension, 0) < 1:
                    errors.append(f"{owner}: output.{dimension} must be a positive integer")
            encoded_bytes += int(output.get("bytes", 0) or 0)
            decoded_bytes += int(output.get("decodedBytesUpperBound", 0) or 0)

        disposition = run.get("disposition")
        status = disposition.get("status") if isinstance(disposition, dict) else None
        if status not in {
            "rejected-background-invalid",
            "pending-human-batch-review",
            "human-approved-source",
            "human-rejected-source",
            "art-director-rejected-source",
        }:
            errors.append(f"{owner}: unsupported disposition status {status!r}")
        else:
            dispositions[status] += 1
        if not isinstance(disposition, dict) or not isinstance(disposition.get("reason"), str):
            errors.append(f"{owner}: disposition requires a reason")

        lineage = run.get("lineage")
        if not isinstance(lineage, dict):
            errors.append(f"{owner}: lineage must be an object")
        elif lineage.get("previousBatchOutputUsed") is not False:
            approval = lineage.get("previousBatchOutputApprovalEvidence")
            if not isinstance(approval, str) or not approval.startswith("docs/"):
                errors.append(
                    f"{owner}: previous Batch output may not be used without explicit docs/ approval evidence"
                )

    for value, count in Counter(run_ids).items():
        if not value or count > 1:
            errors.append(f"{label}: duplicate or blank runId {value!r}")
    for value, count in Counter(prompt_block_ids).items():
        if not value or count > 1:
            errors.append(f"{label}: duplicate or blank promptBlockId {value!r}")
    for value, count in Counter(output_ids).items():
        if not value or count > 1:
            errors.append(f"{label}: duplicate or blank outputId {value!r}")
    for value, count in Counter(output_paths).items():
        if not value or count > 1:
            errors.append(f"{label}: duplicate or blank output path {value!r}")

    counts = batch.get("counts")
    if isinstance(counts, dict):
        expected_counts = {
            "runCount": len(runs),
            "rejectedBackgroundInvalidCount": dispositions["rejected-background-invalid"],
            "pendingHumanCandidateCount": dispositions["pending-human-batch-review"],
            "generatorOriginalEncodedBytes": encoded_bytes,
            "generatorOriginalDecodedBytesUpperBound": decoded_bytes,
        }
        for optional_status, optional_field in (
            ("human-approved-source", "humanApprovedSourceCount"),
            ("human-rejected-source", "humanRejectedSourceCount"),
            ("art-director-rejected-source", "artDirectorRejectedSourceCount"),
        ):
            if dispositions[optional_status] or optional_field in counts:
                expected_counts[optional_field] = dispositions[optional_status]
        for field, expected in expected_counts.items():
            if counts.get(field) != expected:
                errors.append(
                    f"{label}: counts.{field}={counts.get(field)!r}; expected {expected}"
                )
    return errors


def provenance_authority_files(root: Path) -> list[Path]:
    """Return deterministic JSON/Markdown/image inputs beneath an authority root."""

    accepted = {".json", ".md", *IMAGE_EXTENSIONS}
    return sorted(
        path
        for path in root.rglob("*")
        if path.is_file() and path.suffix.lower() in accepted
    ) if root.is_dir() else []


def validate_recipe_shape(recipe: Any, label: str) -> list[str]:
    """Validate the stable fields needed to enforce an authored rendering recipe.

    Recipe documents may carry additive craft metadata. Only the fields that the
    build gate depends on are constrained here.
    """

    errors: list[str] = []
    if not isinstance(recipe, dict):
        return [f"{label}: recipe must be an object"]
    expected_scalars = {
        "schema": ART_RECIPE_SCHEMA,
        "recipeId": MGJRPG_02_RECIPE_ID,
        "renderingProfile": MGJRPG_02_RENDERING_PROFILE,
    }
    for field, expected in expected_scalars.items():
        if recipe.get(field) != expected:
            errors.append(f"{field} must be {expected!r}")
    revision = recipe.get("revision")
    if not isinstance(revision, int) or isinstance(revision, bool) or revision < 1:
        errors.append("revision must be a positive integer")
    if recipe.get("status") not in {"candidate", "approved", "retired"}:
        errors.append("status must be candidate, approved, or retired")
    rendering = recipe.get("authoredRendering")
    if not isinstance(rendering, dict):
        errors.append("authoredRendering must be an object")
    else:
        required_rendering = {
            "contourMode": "material-local-color-aware",
            "contourAuthority": "authored-or-approved-source",
            "extractionRole": "alpha-matte-only-for-cutouts; not-applicable-for-opaque",
            "uniformBlackOutlines": "forbidden",
            "fieldStickerCutline": "forbidden",
            "semanticUiStickerCutline": "cream-only",
            "terrainEnclosingContour": "forbidden",
        }
        for field, expected in required_rendering.items():
            if rendering.get(field) != expected:
                errors.append(f"authoredRendering.{field} must be {expected!r}")
        darkest_ink = rendering.get("darkestInkUse")
        if not (
            isinstance(darkest_ink, list)
            and darkest_ink
            and all(isinstance(value, str) and value.strip() for value in darkest_ink)
        ):
            errors.append("authoredRendering.darkestInkUse must be a nonempty string array")
    expected_tokens = {
        "warm-gold": "#A86249",
        "aubergine": "#80549A",
        "blue-plum": "#4D69A8",
        "russet-plum": "#A95361",
        "leaf-plum": "#4C7D68",
        "cream-mauve": "#8C6984",
        "ink-900": "#34203F",
    }
    if recipe.get("contourTokens") != expected_tokens:
        errors.append("contourTokens must equal the canonical Maze local-contour palette")
    locality_rules = recipe.get("localityRules")
    if not (
        isinstance(locality_rules, list)
        and len(locality_rules) >= 5
        and all(isinstance(value, str) and value.strip() for value in locality_rules)
    ):
        errors.append("localityRules must contain at least five nonempty production rules")
    strokes = recipe.get("deliveryStrokePixels")
    required_strokes = {"512", "256", "128-84", "77-40", "semanticCutline", "authority"}
    if not isinstance(strokes, dict) or not required_strokes.issubset(strokes):
        errors.append("deliveryStrokePixels must define source, delivery, semantic, and authority rules")
    layer_classes = recipe.get("layerClasses")
    required_layers = {
        "character-contour",
        "semantic-ui-cutout",
        "terrain-boundary",
        "story-illustration",
    }
    if not isinstance(layer_classes, dict) or set(layer_classes) != required_layers:
        errors.append("layerClasses must define exactly the four canonical treatment classes")
    metrics = recipe.get("provisionalMetrics")
    required_metrics = {
        "profile": "storybook-contour-metrics-v1",
        "pureBlackVisiblePixelsMaximum": 0,
        "outerContinuityReferenceMinimum": 0.97,
        "outerContinuitySmallestDeliveryMinimum": 0.94,
        "localMaterialAgreementGlobalMinimum": 0.85,
        "localMaterialAgreementSubstantialSegmentMinimum": 0.75,
        "minimumRelativeLuminanceDelta": 0.12,
        "maximumOklabDistanceFromDeclaredToken": 0.08,
        "maximumUncoveredRunReferencePixels": 2,
        "maximumUncoveredRunDeliveryPixels": 1,
        "clearTransparentGutterPixels": 4,
    }
    if not isinstance(metrics, dict):
        errors.append("provisionalMetrics must be an object")
    else:
        for field, expected in required_metrics.items():
            if metrics.get(field) != expected:
                errors.append(f"provisionalMetrics.{field} must be {expected!r}")
        if not isinstance(metrics.get("enforcementPhase"), str) or not metrics["enforcementPhase"].strip():
            errors.append("provisionalMetrics.enforcementPhase must be nonempty")
    if not isinstance(recipe.get("externalCraftBoundary"), str) or not recipe["externalCraftBoundary"].strip():
        errors.append("externalCraftBoundary must be nonempty")
    gate = recipe.get("gate")
    if not isinstance(gate, dict):
        errors.append("gate must be an object")
    else:
        if gate.get("requiredForRuntimePublish") is not True:
            errors.append("gate.requiredForRuntimePublish must be true")
        if gate.get("reviewId") != MGJRPG_02_REVIEW_ID:
            errors.append(f"gate.reviewId must be {MGJRPG_02_REVIEW_ID!r}")
        if gate.get("reviewPath") != (
            f"docs/source-assets/reviews/{MGJRPG_02_REVIEW_ID}.json"
        ):
            errors.append("gate.reviewPath must name the canonical mgjrpg-02 review")
    return [f"{label}: {error}" for error in errors]


def validate_review_shape(review: Any, label: str) -> list[str]:
    """Validate the global canary decision fields while allowing additive evidence."""

    errors: list[str] = []
    if not isinstance(review, dict):
        return [f"{label}: review must be an object"]
    expected_scalars = {
        "schema": CANARY_REVIEW_SCHEMA,
        "reviewId": MGJRPG_02_REVIEW_ID,
        "recipeId": MGJRPG_02_RECIPE_ID,
        "recipePath": f"docs/source-assets/recipes/{MGJRPG_02_RECIPE_ID}.json",
        "scope": "global-runtime-publish-gate",
    }
    for field, expected in expected_scalars.items():
        if review.get(field) != expected:
            errors.append(f"{field} must be {expected!r}")
    recipe_hash = review.get("recipeSha256")
    if not isinstance(recipe_hash, str) or not re.fullmatch(r"[0-9a-f]{64}", recipe_hash):
        errors.append("recipeSha256 must be a lowercase SHA-256")
    status = review.get("status")
    if status not in {"pending-human", "approved", "rejected"}:
        errors.append("status must be pending-human, approved, or rejected")
    evidence = review.get("evidence")
    if not isinstance(evidence, list) or not evidence:
        errors.append("evidence must be a nonempty array")
    else:
        for index, entry in enumerate(evidence):
            if not isinstance(entry, dict):
                errors.append(f"evidence[{index}] must be an object")
                continue
            raw_path = entry.get("path")
            sha256 = entry.get("sha256")
            size = entry.get("bytes")
            if not isinstance(raw_path, str) or not raw_path:
                errors.append(f"evidence[{index}].path must be a nonempty string")
            if not isinstance(sha256, str) or not re.fullmatch(r"[0-9a-f]{64}", sha256):
                errors.append(f"evidence[{index}].sha256 must be a lowercase SHA-256")
            if not isinstance(size, int) or isinstance(size, bool) or size < 1:
                errors.append(f"evidence[{index}].bytes must be a positive integer")
    decision = review.get("decision")
    if not isinstance(decision, str) or not decision.strip():
        errors.append("decision must be a nonempty string")
    if status in {"approved", "rejected"}:
        reviewer = review.get("reviewedBy")
        reviewed_at = review.get("reviewedAt")
        if not isinstance(reviewer, str) or not reviewer.strip():
            errors.append(f"status={status} requires a named reviewedBy")
        if not isinstance(reviewed_at, str) or not reviewed_at.strip():
            errors.append(f"status={status} requires reviewedAt")
    return [f"{label}: {error}" for error in errors]


def stable_unique(values: Iterable[str]) -> list[str]:
    return sorted(set(values))
