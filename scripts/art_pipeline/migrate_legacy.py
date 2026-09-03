"""Create conservative source records for the frozen pre-Art-Bible inventory."""

from __future__ import annotations

import os
import re
import tempfile
from pathlib import Path
from typing import Any

from model import (
    PROMPT_HISTORY_PATH,
    RECORD_ROOT,
    ROOT,
    art_family,
    art_identity,
    image_facts,
    iter_runtime_images,
    json_bytes,
    loading_phase,
    posix_relative,
    repository_first_seen,
    runtime_status,
    sha256_file,
    source_candidates_for,
)


OUTPUT_ID = re.compile(r"exec-[0-9a-f-]+\.[a-z0-9]+", re.IGNORECASE)


def _write_record_without_overwrite(destination: Path, payload: bytes) -> None:
    """Atomically publish one complete record only when its path is absent."""

    destination.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        mode="wb",
        prefix=".record-stage-",
        suffix=".json",
        dir=destination.parent,
        delete=False,
    ) as stream:
        staged = Path(stream.name)
        stream.write(payload)
        stream.flush()
        os.fsync(stream.fileno())
    try:
        os.link(staged, destination)
    except FileExistsError as exc:
        raise FileExistsError(
            f"Legacy migration refuses to overwrite existing record: {destination.name}"
        ) from exc
    except OSError as exc:
        raise RuntimeError(
            "Cannot publish legacy record with no-overwrite semantics via a same-volume "
            f"hard link: {destination}"
        ) from exc
    finally:
        staged.unlink(missing_ok=True)


def prompt_evidence(filename: str, source_paths: list[str], history: str) -> dict[str, Any]:
    lines = history.splitlines()
    needles = [f"`{filename}`", *[f"`{path}`" for path in source_paths]]
    matching_indexes = [
        index
        for index, line in enumerate(lines)
        if any(needle in line for needle in needles)
    ]
    output_ids = sorted({
        match.group(0)
        for index in matching_indexes
        for match in OUTPUT_ID.finditer(lines[index])
    })
    heading = None
    if matching_indexes:
        for line in reversed(lines[: matching_indexes[0] + 1]):
            if line.startswith("##"):
                heading = line.lstrip("# ")
                break
    named = bool(matching_indexes)
    evidence: dict[str, Any] = {
        "fidelity": "unknown",
        "historyPath": PROMPT_HISTORY_PATH,
        "assetNamedInHistory": named,
        "outputIds": output_ids,
        "notes": (
            "The historical prompt document names this asset. Automated migration does not "
            "upgrade surrounding prose to an exact prompt; a human may classify it later."
            if named
            else "No asset-specific prompt linkage was resolved automatically. Preserve the "
            "project-level generation claim and treat asset-specific prompt details as unknown."
        ),
    }
    if heading:
        evidence["historyHeading"] = heading
    return evidence


def source_evidence(paths: list[Path]) -> list[dict[str, Any]]:
    return [
        {
            "path": posix_relative(path),
            "sha256": sha256_file(path),
            "bytes": path.stat().st_size,
            "relationship": "same-stem-retained-source-candidate",
            "evidence": (
                "Repository filename correspondence only; retained as partial evidence until "
                "the historical prompt/processor relationship is reviewed."
            ),
        }
        for path in paths
    ]


def legacy_record(runtime_path: Path, history: str) -> dict[str, Any]:
    relative_runtime = posix_relative(runtime_path)
    filename = runtime_path.name
    stable_id, art_version, record_id = art_identity(filename)
    status = runtime_status(relative_runtime)
    facts = image_facts(runtime_path)
    source_paths = source_candidates_for(runtime_path)
    sources = source_evidence(source_paths)
    prompt = prompt_evidence(filename, [entry["path"] for entry in sources], history)
    unknowns = [
        "Generator model and tool version are not established by repository evidence.",
        "Generation date and seed/parameters are unknown; repository first-seen is not a generation date.",
        "Historical approval predates the Art Bible and is not Human/Ame approval for a new model.",
    ]
    if not sources:
        unknowns.append("No repository-local immutable generator original or normalized master is linked.")
    else:
        unknowns.append("The same-stem source relationship requires human provenance review.")
    if prompt["fidelity"] == "unknown":
        unknowns.append("Exact prompt fidelity has not been classified in this structured record.")

    record: dict[str, Any] = {
        "$schema": "../schema/art-source.schema.json",
        "schemaVersion": 1,
        "recordId": record_id,
        "id": stable_id,
        "artVersion": art_version,
        "family": art_family(filename),
        "runtimeStatus": status,
        "sourceStatus": "partial" if sources else "legacy-runtime-only",
        "approvalStatus": "historical",
        "validationProfile": "legacy-observed",
        "recipeVersion": "pre-mgjrpg-unversioned",
        "promptEvidence": prompt,
        "sources": sources,
        "derivatives": [
            {
                "id": "legacy-runtime",
                "path": relative_runtime,
                "sha256": sha256_file(runtime_path),
                "bytes": runtime_path.stat().st_size,
                "width": facts["width"],
                "height": facts["height"],
                "format": facts["format"],
                "mode": facts["mode"],
                "alphaMode": facts["alphaMode"],
                "decodedBytesUpperBound": facts["decodedBytesUpperBound"],
                "profile": "legacy-runtime",
                "derivativeRevision": 1,
                "runtimeStatus": status,
                "loadingPhase": loading_phase(filename, status),
                "encoder": {
                    "name": "unknown-historical-encoder",
                    "version": "unknown",
                    "options": {},
                },
            }
        ],
        "knownUnknowns": sorted(unknowns),
        "rights": {
            "originClaim": (
                "docs/AI_ASSET_PROMPTS.md states that base artwork was generated for this project."
            ),
            "licenceStatus": "pending-owner-review",
            "notes": (
                "This record preserves the historical claim without asserting a completed "
                "licence or third-party-material review."
            ),
        },
        "rollback": {
            "method": (
                "Restore this exact derivative by its recorded path and SHA-256; catalogue "
                "selection changes are reviewed separately."
            )
        },
    }
    first_seen = repository_first_seen(runtime_path)
    if first_seen:
        record["repositoryEvidence"] = first_seen
    return record


def migrate_legacy(*, write: bool) -> tuple[int, list[str]]:
    history_path = ROOT / PROMPT_HISTORY_PATH
    history = history_path.read_text(encoding="utf-8-sig")
    records = [legacy_record(path, history) for path in iter_runtime_images()]
    planned = [RECORD_ROOT / f"{record['recordId']}.json" for record in records]
    duplicate_names = sorted(
        path.name for path in planned if sum(other.name == path.name for other in planned) > 1
    )
    if duplicate_names:
        raise RuntimeError(f"Record filename collision: {', '.join(sorted(set(duplicate_names)))}")
    existing = [path for path in planned if path.exists()]
    if existing:
        raise FileExistsError(
            "Legacy migration never overwrites records; existing targets: "
            + ", ".join(path.name for path in existing[:8])
        )
    if write:
        RECORD_ROOT.mkdir(parents=True, exist_ok=True)
        for record, destination in zip(records, planned, strict=True):
            _write_record_without_overwrite(destination, json_bytes(record))
    return len(records), [posix_relative(path) for path in planned]
