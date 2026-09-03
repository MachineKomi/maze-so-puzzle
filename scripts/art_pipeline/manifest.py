"""Build and compare the deterministic art source/runtime inventory manifest."""

from __future__ import annotations

import os
import tempfile
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

from model import (
    CALIBRATION_ROOT,
    MANIFEST_PATH,
    PROMPT_HISTORY_PATH,
    RECIPE_ROOT,
    REVIEW_ROOT,
    ROOT,
    SCHEMA_PATH,
    canonical_generation_batch_paths,
    canonical_record_paths,
    image_facts,
    iter_runtime_images,
    iter_source_images,
    json_bytes,
    posix_relative,
    provenance_authority_files,
    read_json,
    sha256_file,
    validate_generation_batch_shape,
    validate_recipe_shape,
    validate_record_shape,
    validate_review_shape,
)


MANIFEST_SCHEMA = "maze-art-manifest/v1"
PIPELINE_VERSION = "art-pipeline-v1"

PIPELINE_INPUT_PATHS = (
    ROOT / "scripts" / "art_pipeline.py",
    *(
        sorted(
            path
            for path in (ROOT / "scripts" / "art_pipeline").rglob("*.py")
            if "__pycache__" not in path.parts
        )
    ),
)
REQUIREMENTS_PATH = ROOT / "requirements-art.txt"
RUNTIME_CONTRACT_PATHS = (
    ROOT / "src" / "artCatalog.ts",
    ROOT / "src" / "assets.ts",
)
PROVENANCE_AUTHORITY_ROOTS = {
    "renderingRecipes": RECIPE_ROOT,
    "canaryReviews": REVIEW_ROOT,
    "calibrations": CALIBRATION_ROOT,
}


def _fingerprint(path: Path) -> dict[str, Any]:
    return {
        "path": posix_relative(path),
        "sha256": sha256_file(path),
        "bytes": path.stat().st_size,
    }


def _resolve_recorded_path(raw_path: Any) -> Path | None:
    if not isinstance(raw_path, str) or not raw_path or "\\" in raw_path:
        return None
    literal = Path(raw_path)
    if literal.is_absolute():
        return None
    path = (ROOT / literal).resolve()
    try:
        path.relative_to(ROOT.resolve())
    except ValueError:
        return None
    return path


def _validate_pointer(
    entry: Any,
    *,
    owner: str,
    errors: list[str],
    allowed_root: Path | None = None,
    require_bytes: bool = False,
) -> Path | None:
    if not isinstance(entry, dict):
        errors.append(f"{owner}: evidence pointer must be an object")
        return None
    raw_path = entry.get("path")
    path = _resolve_recorded_path(raw_path)
    if path is None or not path.is_file():
        errors.append(f"{owner}: evidence is missing or invalid: {raw_path}")
        return None
    if allowed_root is not None:
        try:
            path.resolve().relative_to(allowed_root.resolve())
        except ValueError:
            errors.append(f"{owner}: evidence is outside {posix_relative(allowed_root)}")
            return None
    if entry.get("sha256") != sha256_file(path):
        errors.append(f"{owner}: evidence SHA-256 differs: {raw_path}")
    if require_bytes and entry.get("bytes") != path.stat().st_size:
        errors.append(f"{owner}: evidence byte count differs: {raw_path}")
    return path


def _aggregate(rows: list[dict[str, Any]], key: str) -> list[dict[str, Any]]:
    grouped: dict[str, dict[str, int]] = defaultdict(
        lambda: {"count": 0, "bytes": 0, "decodedBytesUpperBound": 0}
    )
    for row in rows:
        name = str(row[key])
        grouped[name]["count"] += 1
        grouped[name]["bytes"] += int(row.get("bytes", 0))
        grouped[name]["decodedBytesUpperBound"] += int(row.get("decodedBytesUpperBound", 0))
    return [
        {"name": name, **grouped[name]}
        for name in sorted(grouped)
    ]


def build_manifest() -> tuple[dict[str, Any], list[str]]:
    errors: list[str] = []
    records: list[tuple[Path, dict[str, Any]]] = []
    record_ids: set[str] = set()
    derivative_owners: dict[str, list[str]] = defaultdict(list)
    source_owners: dict[str, list[str]] = defaultdict(list)
    prompt_file_owners: dict[str, list[str]] = defaultdict(list)

    authority_inputs = {
        name: [_fingerprint(path) for path in provenance_authority_files(root)]
        for name, root in PROVENANCE_AUTHORITY_ROOTS.items()
    }
    for row in authority_inputs["renderingRecipes"]:
        if not str(row["path"]).endswith(".json"):
            continue
        path = ROOT / str(row["path"])
        try:
            recipe = read_json(path)
        except (OSError, ValueError) as exc:
            errors.append(f"{row['path']}: invalid recipe JSON: {exc}")
            continue
        errors.extend(validate_recipe_shape(recipe, str(row["path"])))
    for row in authority_inputs["canaryReviews"]:
        if not str(row["path"]).endswith(".json"):
            continue
        path = ROOT / str(row["path"])
        try:
            review = read_json(path)
        except (OSError, ValueError) as exc:
            errors.append(f"{row['path']}: invalid review JSON: {exc}")
            continue
        errors.extend(validate_review_shape(review, str(row["path"])))
        recipe_path = str(review.get("recipePath", ""))
        recipe_file = _resolve_recorded_path(recipe_path)
        if recipe_file is None or not recipe_file.is_file():
            errors.append(f"{row['path']}: recipePath is missing or invalid: {recipe_path}")
        elif review.get("recipeSha256") != sha256_file(recipe_file):
            errors.append(f"{row['path']}: recipeSha256 differs: {recipe_path}")
        for index, evidence in enumerate(review.get("evidence", [])):
            evidence_path = _resolve_recorded_path(evidence.get("path") if isinstance(evidence, dict) else None)
            if evidence_path is None or not evidence_path.is_file():
                errors.append(f"{row['path']}: evidence[{index}] is missing or invalid")
            elif isinstance(evidence, dict):
                if evidence.get("sha256") != sha256_file(evidence_path):
                    errors.append(f"{row['path']}: evidence[{index}] SHA-256 differs")
                if evidence.get("bytes") != evidence_path.stat().st_size:
                    errors.append(f"{row['path']}: evidence[{index}] byte count differs")

    generation_batch_rows: list[dict[str, Any]] = []
    generation_batch_ids: set[str] = set()
    generation_batch_output_paths: set[str] = set()
    for batch_path in canonical_generation_batch_paths():
        relative_batch_path = posix_relative(batch_path)
        try:
            batch = read_json(batch_path)
        except (OSError, ValueError) as exc:
            errors.append(f"{relative_batch_path}: invalid generation batch JSON: {exc}")
            continue
        errors.extend(validate_generation_batch_shape(batch, relative_batch_path))
        batch_id = str(batch.get("batchId", ""))
        if batch_id in generation_batch_ids:
            errors.append(f"duplicate generation batch id {batch_id}")
        generation_batch_ids.add(batch_id)
        owner = f"batch:{batch_id}"

        prompt_entry = batch.get("promptFile")
        if isinstance(prompt_entry, dict):
            prompt_path = _validate_pointer(
                prompt_entry,
                owner=f"{owner}:promptFile",
                errors=errors,
                allowed_root=batch_path.parent,
                require_bytes=True,
            )
            raw_prompt_path = str(prompt_entry.get("path", ""))
            if prompt_path is not None:
                prompt_file_owners[raw_prompt_path].append(owner)
        for evidence_field, allowed_root in (
            ("recipeEvidence", RECIPE_ROOT),
            ("decisionEvidence", CALIBRATION_ROOT),
        ):
            evidence = batch.get(evidence_field)
            if isinstance(evidence, dict):
                _validate_pointer(
                    evidence,
                    owner=f"{owner}:{evidence_field}",
                    errors=errors,
                    allowed_root=allowed_root,
                    require_bytes=True,
                )
        registry = batch.get("referenceRegistry")
        if isinstance(registry, dict):
            for reference_id, evidence in registry.items():
                if isinstance(evidence, dict):
                    _validate_pointer(
                        evidence,
                        owner=f"{owner}:referenceRegistry.{reference_id}",
                        errors=errors,
                        allowed_root=ROOT,
                        require_bytes=True,
                    )

        output_count = 0
        encoded_bytes = 0
        decoded_bytes = 0
        for run_index, run in enumerate(batch.get("runs", [])):
            if not isinstance(run, dict) or not isinstance(run.get("output"), dict):
                continue
            output = run["output"]
            output_path = _validate_pointer(
                output,
                owner=f"{owner}:runs[{run_index}].output",
                errors=errors,
                allowed_root=batch_path.parent,
                require_bytes=True,
            )
            raw_output_path = str(output.get("path", ""))
            source_owners[raw_output_path].append(owner)
            if raw_output_path in generation_batch_output_paths:
                errors.append(f"{owner}: output is claimed by more than one generation batch: {raw_output_path}")
            generation_batch_output_paths.add(raw_output_path)
            if output_path is not None:
                facts = image_facts(output_path)
                for fact in (
                    "width",
                    "height",
                    "format",
                    "mode",
                    "alphaMode",
                    "decodedBytesUpperBound",
                ):
                    if output.get(fact) != facts[fact]:
                        errors.append(
                            f"{owner}: {raw_output_path} records {fact}={output.get(fact)!r}; "
                            f"found {facts[fact]!r}"
                        )
            output_count += 1
            encoded_bytes += int(output.get("bytes", 0) or 0)
            decoded_bytes += int(output.get("decodedBytesUpperBound", 0) or 0)

        approved_derivative_count = 0
        approved_derivative_encoded_bytes = 0
        approved_derivative_decoded_bytes = 0
        for derivative_index, derivative in enumerate(batch.get("approvedDerivatives", [])):
            if not isinstance(derivative, dict):
                continue
            derivative_path = _validate_pointer(
                derivative,
                owner=f"{owner}:approvedDerivatives[{derivative_index}]",
                errors=errors,
                allowed_root=batch_path.parent,
                require_bytes=True,
            )
            raw_derivative_path = str(derivative.get("path", ""))
            source_owners[raw_derivative_path].append(owner)
            if derivative_path is not None:
                facts = image_facts(derivative_path)
                for fact in (
                    "width",
                    "height",
                    "format",
                    "mode",
                    "alphaMode",
                    "decodedBytesUpperBound",
                ):
                    if derivative.get(fact) != facts[fact]:
                        errors.append(
                            f"{owner}: {raw_derivative_path} records {fact}={derivative.get(fact)!r}; "
                            f"found {facts[fact]!r}"
                        )
            approved_derivative_count += 1
            approved_derivative_encoded_bytes += int(derivative.get("bytes", 0) or 0)
            approved_derivative_decoded_bytes += int(
                derivative.get("decodedBytesUpperBound", 0) or 0
            )

        generation_batch_rows.append(
            {
                **_fingerprint(batch_path),
                "batchId": batch_id,
                "revision": batch.get("revision"),
                "status": batch.get("status"),
                "promptFile": batch.get("promptFile"),
                "runCount": output_count,
                "generatorOriginalEncodedBytes": encoded_bytes,
                "generatorOriginalDecodedBytesUpperBound": decoded_bytes,
                "approvedDerivativeCount": approved_derivative_count,
                "approvedDerivativeEncodedBytes": approved_derivative_encoded_bytes,
                "approvedDerivativeDecodedBytesUpperBound": approved_derivative_decoded_bytes,
            }
        )

    for record_path in canonical_record_paths():
        record = read_json(record_path)
        errors.extend(validate_record_shape(record, posix_relative(record_path)))
        record_id = str(record.get("recordId", ""))
        if record_path.name != f"{record_id}.json":
            errors.append(f"{posix_relative(record_path)}: filename must match recordId {record_id!r}")
        if record_id in record_ids:
            errors.append(f"duplicate recordId {record_id}")
        record_ids.add(record_id)
        records.append((record_path, record))
        for derivative in record.get("derivatives", []):
            raw_path = str(derivative.get("path", ""))
            derivative_owners[raw_path].append(record_id)
            path = _resolve_recorded_path(raw_path)
            if path is None or not path.is_file():
                errors.append(f"{record_id}: derivative is missing or invalid: {raw_path}")
            else:
                if derivative.get("bytes") != path.stat().st_size:
                    errors.append(f"{record_id}: derivative byte count differs: {raw_path}")
                if derivative.get("sha256") != sha256_file(path):
                    errors.append(f"{record_id}: derivative SHA-256 differs: {raw_path}")
        for source in record.get("sources", []):
            raw_path = str(source.get("path", ""))
            source_owners[raw_path].append(record_id)
            path = _resolve_recorded_path(raw_path)
            if path is None or not path.is_file():
                errors.append(f"{record_id}: source is missing or invalid: {raw_path}")
            else:
                if source.get("bytes") != path.stat().st_size:
                    errors.append(f"{record_id}: source byte count differs: {raw_path}")
                if source.get("sha256") != sha256_file(path):
                    errors.append(f"{record_id}: source SHA-256 differs: {raw_path}")
        prompt_file = record.get("promptEvidence", {}).get("promptFile")
        if isinstance(prompt_file, dict):
            raw_path = str(prompt_file.get("path", ""))
            prompt_file_owners[raw_path].append(record_id)
            path = _resolve_recorded_path(raw_path)
            if path is None or not path.is_file():
                errors.append(f"{record_id}: prompt file is missing or invalid: {raw_path}")
            elif prompt_file.get("sha256") != sha256_file(path):
                errors.append(f"{record_id}: prompt file SHA-256 differs: {raw_path}")
        if record.get("schemaVersion") == 2:
            recipe_path = _validate_pointer(
                record.get("recipeEvidence"),
                owner=f"{record_id}:recipeEvidence",
                errors=errors,
                allowed_root=RECIPE_ROOT,
            )
            recipe: dict[str, Any] | None = None
            if recipe_path is not None:
                recipe = read_json(recipe_path)
                if recipe.get("recipeId") != record.get("recipeVersion"):
                    errors.append(f"{record_id}: recipe evidence differs from recipeVersion")
            for run_index, run in enumerate(record.get("generationRuns", [])):
                if not isinstance(run, dict):
                    continue
                _validate_pointer(
                    run.get("prompt"),
                    owner=f"{record_id}:generationRuns[{run_index}].prompt",
                    errors=errors,
                    allowed_root=ROOT / "docs",
                )
                for reference_index, reference in enumerate(run.get("references", [])):
                    _validate_pointer(
                        reference,
                        owner=f"{record_id}:generationRuns[{run_index}].references[{reference_index}]",
                        errors=errors,
                    )
                for output_index, output in enumerate(run.get("outputs", [])):
                    _validate_pointer(
                        output,
                        owner=f"{record_id}:generationRuns[{run_index}].outputs[{output_index}]",
                        errors=errors,
                        allowed_root=ROOT / "docs" / "source-assets",
                        require_bytes=True,
                    )
            rendering_contract = record.get("renderingContract", {})
            review_path = _validate_pointer(
                rendering_contract.get("canaryReview") if isinstance(rendering_contract, dict) else None,
                owner=f"{record_id}:renderingContract.canaryReview",
                errors=errors,
                allowed_root=REVIEW_ROOT,
            )
            review: dict[str, Any] | None = None
            if review_path is not None:
                review = read_json(review_path)
                if review.get("recipeSha256") != (
                    sha256_file(recipe_path) if recipe_path is not None else None
                ):
                    errors.append(f"{record_id}: canary review does not bind the exact recipe")
                gate = recipe.get("gate", {}) if recipe is not None else {}
                if gate.get("reviewId") != review.get("reviewId") or gate.get("reviewPath") != posix_relative(review_path):
                    errors.append(f"{record_id}: recipe and rendering contract name different canary reviews")
            runtime_declared = any(
                str(derivative.get("path", "")).startswith(("public/assets/", "src-tauri/icons/"))
                for derivative in record.get("derivatives", [])
                if isinstance(derivative, dict)
            ) or any(
                str(profile.get("outputPath", "")).startswith(("public/assets/", "src-tauri/icons/"))
                for profile in record.get("build", {}).get("profiles", [])
                if isinstance(profile, dict)
            )
            if (
                runtime_declared
                and record.get("recipeVersion") == "mgjrpg-02"
                and (review is None or review.get("status") != "approved")
            ):
                errors.append(
                    f"{record_id}: runtime mgjrpg-02 publication requires approved global canary review"
                )

    runtime_rows: list[dict[str, Any]] = []
    for runtime_path in iter_runtime_images():
        relative_path = posix_relative(runtime_path)
        owners = sorted(derivative_owners.get(relative_path, []))
        if len(owners) != 1:
            errors.append(
                f"{relative_path}: expected exactly one source record, found {len(owners)}"
            )
        record = next((value for _, value in records if value.get("recordId") in owners), {})
        facts = image_facts(runtime_path)
        runtime_rows.append(
            {
                "path": relative_path,
                "sha256": sha256_file(runtime_path),
                "bytes": runtime_path.stat().st_size,
                **facts,
                "recordId": owners[0] if len(owners) == 1 else None,
                "family": record.get("family", "unmapped"),
                "runtimeStatus": record.get("runtimeStatus", "unmapped"),
                "approvalStatus": record.get("approvalStatus", "unmapped"),
            }
        )

    runtime_paths = {row["path"] for row in runtime_rows}
    for derivative_path, owners in sorted(derivative_owners.items()):
        if derivative_path.startswith("public/assets/") and derivative_path not in runtime_paths:
            errors.append(
                f"{derivative_path}: record derivative is absent from the runtime image inventory "
                f"({', '.join(owners)})"
            )
        if len(owners) > 1:
            errors.append(
                f"{derivative_path}: derivative is claimed by multiple records: {', '.join(owners)}"
            )

    source_rows: list[dict[str, Any]] = []
    for source_path in iter_source_images():
        relative_path = posix_relative(source_path)
        source_rows.append(
            {
                "path": relative_path,
                "sha256": sha256_file(source_path),
                "bytes": source_path.stat().st_size,
                **image_facts(source_path),
                "referencedBy": sorted(source_owners.get(relative_path, [])),
            }
        )

    record_rows = [
        {
            "path": posix_relative(path),
            "sha256": sha256_file(path),
            "recordId": record.get("recordId"),
            "schemaVersion": record.get("schemaVersion"),
            "id": record.get("id"),
            "artVersion": record.get("artVersion"),
            "family": record.get("family"),
            "runtimeStatus": record.get("runtimeStatus"),
            "sourceStatus": record.get("sourceStatus"),
            "approvalStatus": record.get("approvalStatus"),
            "validationProfile": record.get("validationProfile"),
            "artRecipeVersion": record.get("recipeVersion"),
            "recipeEvidence": record.get("recipeEvidence"),
            "renderingProfile": record.get("renderingContract", {}).get("profileId"),
            "generationRunCount": len(record.get("generationRuns", [])),
            "derivativeRecipeVersion": record.get("derivativeRecipeVersion"),
            "sourceCount": len(record.get("sources", [])),
            "derivativeCount": len(record.get("derivatives", [])),
        }
        for path, record in records
    ]

    source_status_counts = Counter(row["sourceStatus"] for row in record_rows)
    approval_status_counts = Counter(row["approvalStatus"] for row in record_rows)
    prompt_history = ROOT / PROMPT_HISTORY_PATH
    required_input_paths = (
        SCHEMA_PATH,
        prompt_history,
        REQUIREMENTS_PATH,
        *PIPELINE_INPUT_PATHS,
        *RUNTIME_CONTRACT_PATHS,
    )
    for path in required_input_paths:
        if not path.is_file():
            errors.append(f"manifest input is missing: {path}")
    prompt_file_rows = []
    for raw_path, owners in sorted(prompt_file_owners.items()):
        path = _resolve_recorded_path(raw_path)
        if path is not None and path.is_file():
            prompt_file_rows.append({**_fingerprint(path), "referencedBy": sorted(owners)})
    manifest: dict[str, Any] = {
        "schema": MANIFEST_SCHEMA,
        "pipelineVersion": PIPELINE_VERSION,
        "policy": {
            "recordsAreEditableAuthority": True,
            "manifestIsGenerated": True,
            "timestampsOmittedForDeterminism": True,
            "missingProvenanceIsNeverInferred": True,
            "runtimeSelectionAuthority": "src/artCatalog.ts and src/assets.ts",
            "runtimeInventoryRoot": "public/assets",
            "proofRoot": "artifacts/art-proofs",
            "sourceAndProofBytesExcludedFromRuntimeBudget": True,
            "publicRuntimeGrowthRequiresFeatureAllocation": True,
            "brandInventoryExclusions": [
                "public/favicon-64.png",
                "public/apple-touch-icon.png",
                "src-tauri/icons/**",
            ],
            "brandInventoryExclusionReason": "Phase-2 brand provenance; docs/source-assets/app-icon.png remains an actionable unreferenced-source warning.",
        },
        "inputs": {
            "recordSchema": {
                "path": posix_relative(SCHEMA_PATH),
                "sha256": sha256_file(SCHEMA_PATH),
            },
            "promptHistory": {
                "path": PROMPT_HISTORY_PATH,
                "sha256": sha256_file(prompt_history),
            },
            "pipelineModules": [_fingerprint(path) for path in PIPELINE_INPUT_PATHS],
            "requirements": _fingerprint(REQUIREMENTS_PATH),
            "runtimeContracts": [_fingerprint(path) for path in RUNTIME_CONTRACT_PATHS],
            "referencedPromptFiles": prompt_file_rows,
            "generationBatches": generation_batch_rows,
            **authority_inputs,
        },
        "summary": {
            "recordCount": len(record_rows),
            "runtimeImageCount": len(runtime_rows),
            "runtimeEncodedBytes": sum(row["bytes"] for row in runtime_rows),
            "runtimeDecodedBytesUpperBound": sum(
                row["decodedBytesUpperBound"] for row in runtime_rows
            ),
            "sourceImageCount": len(source_rows),
            "sourceEncodedBytes": sum(row["bytes"] for row in source_rows),
            "unreferencedSourceImageCount": sum(
                not row["referencedBy"] for row in source_rows
            ),
            "generationBatchCount": len(generation_batch_rows),
            "generationBatchOutputCount": sum(row["runCount"] for row in generation_batch_rows),
            "generationBatchEncodedBytes": sum(
                row["generatorOriginalEncodedBytes"] for row in generation_batch_rows
            ),
            "generationBatchDecodedBytesUpperBound": sum(
                row["generatorOriginalDecodedBytesUpperBound"] for row in generation_batch_rows
            ),
            "renderingRecipeFileCount": len(authority_inputs["renderingRecipes"]),
            "renderingRecipeBytes": sum(row["bytes"] for row in authority_inputs["renderingRecipes"]),
            "canaryReviewFileCount": len(authority_inputs["canaryReviews"]),
            "canaryReviewBytes": sum(row["bytes"] for row in authority_inputs["canaryReviews"]),
            "calibrationAuthorityFileCount": len(authority_inputs["calibrations"]),
            "calibrationAuthorityBytes": sum(row["bytes"] for row in authority_inputs["calibrations"]),
            "sourceStatusCounts": [
                {"name": name, "count": source_status_counts[name]}
                for name in sorted(source_status_counts)
            ],
            "approvalStatusCounts": [
                {"name": name, "count": approval_status_counts[name]}
                for name in sorted(approval_status_counts)
            ],
        },
        "runtimeByFamily": _aggregate(runtime_rows, "family"),
        "runtimeByStatus": _aggregate(runtime_rows, "runtimeStatus"),
        "runtimeByFormat": _aggregate(runtime_rows, "format"),
        "records": record_rows,
        "runtimeImages": runtime_rows,
        "sourceImages": source_rows,
    }
    return manifest, sorted(set(errors))


def compare_manifest() -> list[str]:
    manifest, errors = build_manifest()
    if not MANIFEST_PATH.is_file():
        return [*errors, f"{posix_relative(MANIFEST_PATH)} is missing; run art:manifest -- --write"]
    expected = json_bytes(manifest)
    actual = MANIFEST_PATH.read_bytes()
    if actual != expected:
        errors.append("docs/source-assets/manifest.json is stale; run art:manifest -- --write")
    return sorted(set(errors))


def write_manifest() -> dict[str, Any]:
    manifest, errors = build_manifest()
    if errors:
        raise RuntimeError("Cannot write an invalid manifest:\n" + "\n".join(errors))
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        mode="wb",
        prefix=".manifest-",
        suffix=".json",
        dir=MANIFEST_PATH.parent,
        delete=False,
    ) as stream:
        temporary_path = Path(stream.name)
        stream.write(json_bytes(manifest))
        stream.flush()
        os.fsync(stream.fileno())
    try:
        os.replace(temporary_path, MANIFEST_PATH)
    finally:
        temporary_path.unlink(missing_ok=True)
    return manifest
