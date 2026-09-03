"""Read-only validation for provenance records, runtime derivatives, and manifests."""

from __future__ import annotations

import json
import hashlib
import re
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

from PIL import Image
from jsonschema.exceptions import SchemaError

from cutout import alpha_component_sizes
from manifest import compare_manifest
from model import (
    CALIBRATION_ROOT,
    MGJRPG_02_RECIPE_ID,
    MGJRPG_02_REVIEW_ID,
    MANIFEST_PATH,
    PROOF_ROOT,
    PRODUCTION_ROOT,
    PROMPT_HISTORY_PATH,
    RECORD_ROOT,
    RECIPE_ROOT,
    REVIEW_ROOT,
    ROOT,
    SCHEMA_PATH,
    canonical_generation_batch_paths,
    canonical_record_paths,
    canonical_recipe_paths,
    canonical_review_paths,
    image_facts,
    inside_root,
    iter_runtime_images,
    iter_source_images,
    json_bytes,
    posix_relative,
    read_json,
    record_schema_validator,
    sha256_file,
    validate_recipe_shape,
    validate_generation_batch_shape,
    validate_record_shape,
    validate_review_shape,
)


MGJRPG_02_PROOF_INDEX_SCHEMA = "maze-art-mgjrpg02-proof-index/v1"
MGJRPG_02_AUTHORED_OPTIONS_PROOF_INDEX_SCHEMA = (
    "maze-art-mgjrpg02-authored-options-proof-index/v1"
)
MGJRPG_02_AUTHORED_OPTIONS_REPORT_SCHEMA = (
    "maze-art-mgjrpg02-authored-options-report/v1"
)
MGJRPG_02_AUTHORED_OPTIONS_STATUS = "pending-human-rendering-direction"
MGJRPG_02_AUTHORED_OPTIONS_CALIBRATION_RELATIVE = Path(
    "docs/source-assets/calibrations/mgjrpg-02/v02"
)
MGJRPG_02_AUTHORED_OPTIONS_IDENTITY_PATH = (
    "docs/source-assets/characters/ame/v02/"
    "ame-v02-candidate-c-generator-original.png"
)
MGJRPG_02_AUTHORED_OPTIONS_COMPARATOR_PATH = (
    "docs/source-assets/calibrations/mgjrpg-02/v02/"
    "family-transfer-identity-comparator-input.png"
)
MGJRPG_02_AUTHORED_OPTIONS_COMPARATOR_COMPONENTS = {
    "public/assets/animal-fox.png": "animal-fox-current",
    "public/assets/goblin.png": "enemy-goblin-current",
    "docs/source-assets/enemy-jelly-sorcerer-v1-master.png": (
        "enemy-jelly-sorcerer-master"
    ),
    "docs/source-assets/key-rose-heart-v1.png": "key-rose-heart-master",
    "docs/source-assets/door-rose-heart-v1.png": "door-rose-heart-master",
    "docs/source-assets/portal-rose-heart-v1.png": "portal-rose-heart-master",
    "public/assets/reward-trail-sticker.png": "reward-first-star-current",
}
MGJRPG_02_AUTHORED_OPTIONS_INPUTS = {
    (
        "docs/source-assets/calibrations/mgjrpg-02/v02/"
        + (
            f"ame-v02-rendering-option-{option}-generator-original.png"
            if kind == "ame"
            else f"direction-{option}-{kind}-generator-original.png"
        )
    ): {
        "id": f"direction-{option}-{kind}",
        "option": option,
        "kind": kind,
    }
    for option in ("a", "b", "c")
    for kind in ("sampler", "ame", "enemy-extension", "family-transfer")
}
MGJRPG_02_AUTHORED_OPTIONS_PROVENANCE_PATHS = {
    "docs/source-assets/calibrations/mgjrpg-02/v02/PROMPTS.md",
    "docs/source-assets/calibrations/mgjrpg-02/v02/run-record.json",
}
MGJRPG_02_SELECTION_PROOF_INDEX_SCHEMA = (
    "maze-art-mgjrpg02-selection-proof-index/v1"
)
MGJRPG_02_SELECTION_REPORT_SCHEMA = "maze-art-mgjrpg02-selection-report/v1"
MGJRPG_02_SELECTION_STATUS = "pending-human-ame-and-extension-review"
MGJRPG_02_SELECTION_V02_RELATIVE = Path(
    "docs/source-assets/calibrations/mgjrpg-02/v02"
)
MGJRPG_02_SELECTION_V03_RELATIVE = Path(
    "docs/source-assets/calibrations/mgjrpg-02/v03"
)
MGJRPG_02_SELECTION_AUTHORED_INPUTS = {
    (
        "docs/source-assets/calibrations/mgjrpg-02/v03/"
        "ame-v02-rendering-b-fresh-01-generator-original.png"
    ): {
        "id": "ame-b-fresh-01",
        "kind": "ame-fresh",
    },
    (
        "docs/source-assets/calibrations/mgjrpg-02/v03/"
        "ame-v02-rendering-b-fresh-02-generator-original.png"
    ): {
        "id": "ame-b-fresh-02",
        "kind": "ame-fresh",
    },
    (
        "docs/source-assets/calibrations/mgjrpg-02/v03/"
        "future-enemy-hybrid-01-generator-original.png"
    ): {
        "id": "future-enemy-hybrid-01",
        "kind": "future-enemy-hybrid",
    },
    (
        "docs/source-assets/calibrations/mgjrpg-02/v03/"
        "rose-heart-floor-pad-hybrid-01-generator-original.png"
    ): {
        "id": "rose-heart-floor-pad-hybrid-01",
        "kind": "rose-floor-pad-hybrid",
    },
}
MGJRPG_02_SELECTION_REFERENCE_INPUTS = {
    (
        "docs/source-assets/calibrations/mgjrpg-02/v02/"
        "ame-v02-rendering-option-b-generator-original.png"
    ): {
        "id": "ame-prior-direction-b",
        "kind": "ame-rendering-comparison",
        "selectionRole": "human-preferred-ame-rendering-fallback",
        "generationReferenceAllowed": False,
    },
    (
        "docs/source-assets/calibrations/mgjrpg-02/v02/"
        "direction-a-sampler-generator-original.png"
    ): {
        "id": "core-sampler-a",
        "kind": "core-sampler",
        "selectionRole": "human-selected-core-default",
        "generationReferenceAllowed": True,
    },
    (
        "docs/source-assets/characters/ame/v02/"
        "ame-v02-candidate-c-turnaround-study.png"
    ): {
        "id": "ame-candidate-c-turnaround",
        "kind": "ame-construction-cross-check",
        "selectionRole": "approved-ame-construction-cross-check",
        "generationReferenceAllowed": True,
    },
    (
        "docs/source-assets/calibrations/mgjrpg-02/v02/"
        "direction-b-sampler-generator-original.png"
    ): {
        "id": "core-sampler-b",
        "kind": "core-sampler",
        "selectionRole": "ame-rendering-style-reference",
        "generationReferenceAllowed": True,
    },
    (
        "docs/source-assets/calibrations/mgjrpg-02/v02/"
        "direction-c-sampler-generator-original.png"
    ): {
        "id": "core-sampler-c",
        "kind": "core-sampler",
        "selectionRole": (
            "human-selected-core-exceptions-tea-skeleton-slime-sword-lizard"
        ),
        "generationReferenceAllowed": False,
    },
    (
        "docs/source-assets/calibrations/mgjrpg-02/v02/"
        "direction-a-family-transfer-generator-original.png"
    ): {
        "id": "family-transfer-a",
        "kind": "family-transfer",
        "selectionRole": "human-approved-family-construction-contour",
        "generationReferenceAllowed": True,
    },
    (
        "docs/source-assets/calibrations/mgjrpg-02/v02/"
        "direction-b-family-transfer-generator-original.png"
    ): {
        "id": "family-transfer-b",
        "kind": "family-transfer",
        "selectionRole": "human-preferred-family-colour-shading",
        "generationReferenceAllowed": True,
    },
    (
        "docs/source-assets/calibrations/mgjrpg-02/v02/"
        "direction-a-enemy-extension-generator-original.png"
    ): {
        "id": "enemy-extension-a",
        "kind": "future-enemy-extension",
        "selectionRole": "human-selected-succubus-concept",
        "generationReferenceAllowed": True,
    },
    (
        "docs/source-assets/calibrations/mgjrpg-02/v02/"
        "direction-b-enemy-extension-generator-original.png"
    ): {
        "id": "enemy-extension-b",
        "kind": "future-enemy-extension",
        "selectionRole": "human-selected-future-enemy-concepts",
        "generationReferenceAllowed": True,
    },
    "docs/source-assets/portal-rose-heart-v1.png": {
        "id": "portal-rose-heart-current",
        "kind": "portal-floor-pad",
        "selectionRole": "human-retained-floor-pad-concept",
        "generationReferenceAllowed": True,
    },
}
MGJRPG_02_SELECTION_PROVENANCE_PATHS = {
    "docs/source-assets/calibrations/mgjrpg-02/v02/PROMPTS.md",
    "docs/source-assets/calibrations/mgjrpg-02/v02/run-record.json",
    "docs/source-assets/calibrations/mgjrpg-02/v03/PROMPTS.md",
    "docs/source-assets/calibrations/mgjrpg-02/v03/run-record.json",
}
MGJRPG_02_SELECTION_RUN_REFERENCES = {
    "ame-b-fresh-01": [
        MGJRPG_02_AUTHORED_OPTIONS_IDENTITY_PATH,
        (
            "docs/source-assets/calibrations/mgjrpg-02/v02/"
            "direction-b-sampler-generator-original.png"
        ),
        (
            "docs/source-assets/calibrations/mgjrpg-02/v02/"
            "direction-b-family-transfer-generator-original.png"
        ),
    ],
    "ame-b-fresh-02": [
        MGJRPG_02_AUTHORED_OPTIONS_IDENTITY_PATH,
        (
            "docs/source-assets/characters/ame/v02/"
            "ame-v02-candidate-c-turnaround-study.png"
        ),
        (
            "docs/source-assets/calibrations/mgjrpg-02/v02/"
            "direction-b-sampler-generator-original.png"
        ),
        (
            "docs/source-assets/calibrations/mgjrpg-02/v02/"
            "direction-b-family-transfer-generator-original.png"
        ),
    ],
    "future-enemy-hybrid-01": [
        (
            "docs/source-assets/calibrations/mgjrpg-02/v02/"
            "direction-a-sampler-generator-original.png"
        ),
        (
            "docs/source-assets/calibrations/mgjrpg-02/v02/"
            "direction-a-family-transfer-generator-original.png"
        ),
        (
            "docs/source-assets/calibrations/mgjrpg-02/v02/"
            "direction-b-family-transfer-generator-original.png"
        ),
        (
            "docs/source-assets/calibrations/mgjrpg-02/v02/"
            "direction-b-enemy-extension-generator-original.png"
        ),
        (
            "docs/source-assets/calibrations/mgjrpg-02/v02/"
            "direction-a-enemy-extension-generator-original.png"
        ),
    ],
    "rose-heart-floor-pad-hybrid-01": [
        "docs/source-assets/portal-rose-heart-v1.png",
        (
            "docs/source-assets/calibrations/mgjrpg-02/v02/"
            "direction-a-family-transfer-generator-original.png"
        ),
        (
            "docs/source-assets/calibrations/mgjrpg-02/v02/"
            "direction-b-family-transfer-generator-original.png"
        ),
    ],
}


def _validate_proof_bundle(
    records: list[tuple[Path, dict[str, Any]]],
    errors: list[dict[str, str]],
) -> None:
    """Validate an optional ignored proof bundle without creating or updating it."""

    index_path = PROOF_ROOT / "canary" / "proof-index.json"
    if not index_path.is_file():
        return
    label = posix_relative(index_path)
    try:
        index = read_json(index_path)
    except (OSError, json.JSONDecodeError) as exc:
        errors.append(_message("error", "proof-index-json", label, str(exc)))
        return
    if index.get("schema") != "maze-art-proof-index/v1":
        errors.append(_message("error", "proof-index-schema", label, str(index.get("schema"))))

    def verify_file(
        row: Any,
        owner: str,
        *,
        image: bool = False,
        proof_only: bool = True,
    ) -> Path | None:
        if not isinstance(row, dict):
            errors.append(_message("error", "proof-entry-shape", owner, "entry must be an object"))
            return None
        path = _repo_path(row.get("path"), owner=owner, field="path", errors=errors)
        if path is None:
            return None
        if proof_only and not inside_root(path, PROOF_ROOT):
            errors.append(_message("error", "proof-path-root", owner, "proof evidence must stay under artifacts/art-proofs"))
            return None
        if not path.is_file():
            errors.append(_message("error", "proof-file-missing", owner, str(row.get("path"))))
            return None
        if row.get("bytes") != path.stat().st_size:
            errors.append(_message("error", "proof-file-bytes", owner, str(row.get("path"))))
        if row.get("sha256") != sha256_file(path):
            errors.append(_message("error", "proof-file-hash", owner, str(row.get("path"))))
        if image:
            facts = image_facts(path)
            for key in ("width", "height", "format", "mode", "alphaMode", "decodedBytesUpperBound"):
                if key in row and row.get(key) != facts[key]:
                    errors.append(
                        _message(
                            "error",
                            "proof-image-fact",
                            owner,
                            f"{key} records {row.get(key)!r}; found {facts[key]!r}",
                        )
                    )
        return path

    for row in index.get("pipelineInputs", []):
        verify_file(row, f"{label}:pipelineInputs", proof_only=False)
    for row in index.get("outputs", []):
        verify_file(row, f"{label}:outputs", image=True)
    for key in ("html", "browserHarness", "inventory"):
        verify_file(index.get(key), f"{label}:{key}")

    record_map = {
        str(record.get("recordId")): (path, record) for path, record in records
    }
    for row in index.get("candidateDerivatives", []):
        owner = f"{label}:candidateDerivatives"
        verify_file(row, owner, image=True)
        if not isinstance(row, dict):
            continue
        record_entry = record_map.get(str(row.get("recordId")))
        if record_entry is None:
            errors.append(_message("error", "proof-record", owner, str(row.get("recordId"))))
            continue
        record_path, record = record_entry
        expected = {
            "recordSha256": sha256_file(record_path),
            "artRecipeVersion": record.get("recipeVersion"),
            "derivativeRecipeVersion": record.get("derivativeRecipeVersion"),
            "buildSha256": hashlib.sha256(json_bytes(record.get("build"))).hexdigest(),
        }
        source_path = (ROOT / str(row.get("sourcePath", ""))).resolve()
        expected["sourceSha256"] = (
            sha256_file(source_path)
            if inside_root(source_path) and source_path.is_file()
            else None
        )
        expected["promptFileSha256"] = (
            record.get("promptEvidence", {}).get("promptFile", {}).get("sha256")
        )
        for key, value in expected.items():
            if row.get(key) != value:
                errors.append(
                    _message(
                        "error",
                        "proof-provenance-drift",
                        owner,
                        f"{key} records {row.get(key)!r}; current value is {value!r}",
                    )
                )


def _message(kind: str, code: str, path: str, detail: str) -> dict[str, str]:
    return {"kind": kind, "code": code, "path": path, "detail": detail}


def _repo_path(
    raw_path: Any,
    *,
    owner: str,
    field: str,
    errors: list[dict[str, str]],
) -> Path | None:
    if not isinstance(raw_path, str) or not raw_path:
        errors.append(_message("error", "invalid-path", owner, f"{field} must be a non-empty string"))
        return None
    candidate_literal = Path(raw_path)
    if candidate_literal.is_absolute() or "\\" in raw_path:
        errors.append(
            _message(
                "error",
                "non-portable-path",
                owner,
                f"{field} must be a repository-relative POSIX path: {raw_path}",
            )
        )
        return None
    candidate = (ROOT / candidate_literal).resolve()
    if not inside_root(candidate):
        errors.append(_message("error", "path-escape", owner, f"{field} escapes the repository"))
        return None
    return candidate


def _clear_border(path: Path, pixels: int = 2) -> bool:
    with Image.open(path) as image:
        image.load()
        if "A" not in image.getbands():
            return True
        alpha = image.getchannel("A")
        width, height = image.size
        if width < pixels * 2 or height < pixels * 2:
            return False
        borders = (
            alpha.crop((0, 0, width, pixels)),
            alpha.crop((0, height - pixels, width, height)),
            alpha.crop((0, 0, pixels, height)),
            alpha.crop((width - pixels, 0, width, height)),
        )
        return all(border.getextrema() == (0, 0) for border in borders)


def _alpha_bounds(path: Path, threshold: int) -> tuple[list[int], list[float]]:
    with Image.open(path) as image:
        image.load()
        if "A" not in image.getbands():
            raise ValueError("image has no alpha channel")
        bounds = image.getchannel("A").point(
            lambda value: 255 if value >= threshold else 0
        ).getbbox()
        if bounds is None:
            raise ValueError("image has no visible alpha pixels")
        width, height = image.size
    pixels = list(bounds)
    normalized = [
        pixels[0] / width,
        pixels[1] / height,
        pixels[2] / width,
        pixels[3] / height,
    ]
    return pixels, normalized


def _catalog_source_record_ids(path: Path) -> list[str]:
    """Resolve literal catalogue IDs plus the lock helper's recorded default."""

    if not path.is_file():
        return []
    source = path.read_text(encoding="utf-8-sig")
    values = set(re.findall(
        r'\bsourceRecordId\s*:\s*["\']([a-z0-9]+(?:-[a-z0-9]+)*-source)["\']',
        source,
    ))
    default_count = len(re.findall(
        r"\bsourceRecordId\s*=\s*`\$\{id\}-v01-source`",
        source,
    ))
    if default_count != 1:
        raise ValueError(
            f"expected exactly one legacyLockSprite sourceRecordId default; found {default_count}"
        )
    call_pattern = re.compile(
        r"""\blegacyLockSprite\s*\(
            \s*["'](?P<id>[a-z0-9]+(?:-[a-z0-9]+)*)["']\s*,
            \s*["'][^"']+["']\s*,
            \s*["'][^"']+["']\s*,
            \s*["'](?:key|door)["']\s*,
            \s*\[[^\]]+\]\s*
            (?:,\s*["'](?P<override>[a-z0-9]+(?:-[a-z0-9]+)*-source)["'])?
            \s*,?\s*\)
        """,
        re.DOTALL | re.VERBOSE,
    )
    matches = list(call_pattern.finditer(source))
    invocation_count = len(re.findall(r"\blegacyLockSprite\s*\(", source))
    declaration_count = len(re.findall(r"\bfunction\s+legacyLockSprite\s*\(", source))
    if len(matches) != invocation_count - declaration_count:
        raise ValueError(
            "could not resolve every legacyLockSprite catalogue call: "
            f"parsed {len(matches)} of {invocation_count - declaration_count}"
        )
    for match in matches:
        values.add(match.group("override") or f"{match.group('id')}-v01-source")
    return sorted(values)


def _validate_file_evidence(
    entry: dict[str, Any],
    *,
    owner: str,
    field: str,
    errors: list[dict[str, str]],
) -> Path | None:
    path = _repo_path(entry.get("path"), owner=owner, field=field, errors=errors)
    if path is None:
        return None
    if not path.is_file():
        errors.append(_message("error", "missing-file", owner, f"{field} is missing: {entry.get('path')}"))
        return path
    expected_bytes = entry.get("bytes")
    if expected_bytes != path.stat().st_size:
        errors.append(
            _message(
                "error",
                "byte-mismatch",
                owner,
                f"{entry.get('path')} records {expected_bytes} bytes; found {path.stat().st_size}",
            )
        )
    expected_hash = entry.get("sha256")
    actual_hash = sha256_file(path)
    if expected_hash != actual_hash:
        errors.append(
            _message(
                "error",
                "hash-mismatch",
                owner,
                f"{entry.get('path')} SHA-256 differs from its immutable record",
            )
        )
    return path


def _validate_hash_pointer(
    entry: dict[str, Any],
    *,
    owner: str,
    allowed_root: Path,
    errors: list[dict[str, str]],
) -> Path | None:
    path = _repo_path(entry.get("path"), owner=owner, field="path", errors=errors)
    if path is None:
        return None
    if not inside_root(path, allowed_root):
        errors.append(
            _message(
                "error",
                "authority-root",
                owner,
                f"path must remain under {posix_relative(allowed_root)}",
            )
        )
        return None
    if not path.is_file():
        errors.append(_message("error", "missing-file", owner, str(entry.get("path"))))
        return path
    if entry.get("sha256") != sha256_file(path):
        errors.append(
            _message(
                "error",
                "hash-mismatch",
                owner,
                f"{entry.get('path')} differs from its immutable SHA-256 pointer",
            )
        )
    return path


def _validate_mgjrpg02_authored_options_bundle(
    index: dict[str, Any],
    *,
    proof_root: Path,
    proof_root_relative: str,
    revision: Any,
    index_relative: str,
    errors: list[dict[str, str]],
) -> None:
    """Validate the independently-authored option packet and its full evidence graph.

    This is deliberately separate from the historical v08 assay contract.  The
    authored-options schema binds source originals and provenance outside the
    ignored proof tree, then binds every deterministic proof file inside it.
    """

    def error(code: str, detail: str, *, subject: str = index_relative) -> None:
        errors.append(_message("error", code, subject, detail))

    def fact_key(row: Any) -> tuple[Any, Any, Any] | None:
        if not isinstance(row, dict):
            return None
        raw_path = row.get("path")
        raw_hash = row.get("sha256")
        raw_bytes = row.get("bytes")
        return (
            raw_path if isinstance(raw_path, str) else None,
            raw_hash if isinstance(raw_hash, str) else None,
            raw_bytes
            if isinstance(raw_bytes, int) and not isinstance(raw_bytes, bool)
            else None,
        )

    def iter_dicts(value: Any):
        if isinstance(value, dict):
            yield value
            for child in value.values():
                yield from iter_dicts(child)
        elif isinstance(value, list):
            for child in value:
                yield from iter_dicts(child)

    def has_exact_binding(value: Any, fact: dict[str, Any]) -> bool:
        expected_path = fact.get("path")
        expected_hash = fact.get("sha256")
        expected_bytes = fact.get("bytes")
        return any(
            any(
                row.get(path_field) == expected_path
                for path_field in (
                    "path",
                    "immutablePath",
                    "immutableGeneratorOriginalPath",
                    "outputPath",
                )
            )
            and row.get("sha256") == expected_hash
            and row.get("bytes") == expected_bytes
            for row in iter_dicts(value)
        )

    def validate_image_fact(
        row: dict[str, Any], path: Path, row_owner: str
    ) -> None:
        if not path.is_file() or path.suffix.lower() != ".png":
            return
        try:
            with Image.open(path) as source:
                source.load()
                actual = {
                    "width": source.width,
                    "height": source.height,
                    "mode": source.mode,
                }
        except OSError as exc:
            error("mgjrpg02-options-image", str(exc), subject=row_owner)
            return
        for field, value in actual.items():
            if row.get(field) != value:
                error(
                    "mgjrpg02-options-image-fact",
                    f"{field} records {row.get(field)!r}; found {value!r}",
                    subject=row_owner,
                )

    def validate_rows(
        rows: Any,
        field: str,
        *,
        allowed_root: Path,
        expected_paths: set[str] | None = None,
        validate_images: bool = False,
    ) -> list[tuple[dict[str, Any], Path]]:
        if not isinstance(rows, list) or not rows:
            error("mgjrpg02-proof-list", f"{field} must be a nonempty array")
            return []
        resolved: list[tuple[dict[str, Any], Path]] = []
        seen: set[str] = set()
        for row_index, row in enumerate(rows):
            row_owner = f"{index_relative}:{field}[{row_index}]"
            if not isinstance(row, dict):
                error(
                    "mgjrpg02-proof-entry-shape",
                    "entry must be an object",
                    subject=row_owner,
                )
                continue
            path = _validate_file_evidence(
                row,
                owner=row_owner,
                field="path",
                errors=errors,
            )
            raw_path = row.get("path")
            if not isinstance(raw_path, str) or not raw_path:
                continue
            if raw_path in seen:
                error("mgjrpg02-proof-duplicate", raw_path, subject=row_owner)
            seen.add(raw_path)
            if path is not None:
                if not inside_root(path, allowed_root):
                    error(
                        "mgjrpg02-proof-path-root",
                        f"path must remain below {allowed_root.resolve()}",
                        subject=row_owner,
                    )
                if validate_images:
                    validate_image_fact(row, path, row_owner)
                resolved.append((row, path))
        if expected_paths is not None and seen != expected_paths:
            missing = sorted(expected_paths - seen)
            unexpected = sorted(seen - expected_paths)
            error(
                "mgjrpg02-options-path-set",
                f"{field} path set differs; missing={missing}, unexpected={unexpected}",
            )
        return resolved

    if (
        index.get("packetRevision") != revision
        or index.get("packetRoot") != proof_root_relative
    ):
        error(
            "mgjrpg02-proof-index-identity",
            "authored-options index revision/root differs from recommendedPacket",
        )
    if index.get("status") != MGJRPG_02_AUTHORED_OPTIONS_STATUS:
        error(
            "mgjrpg02-options-status",
            f"status must be {MGJRPG_02_AUTHORED_OPTIONS_STATUS!r}",
        )

    identity = index.get("identityAuthority")
    if not isinstance(identity, dict):
        error("mgjrpg02-options-identity", "identityAuthority must be an object")
    else:
        validate_rows(
            [identity],
            "identityAuthority",
            allowed_root=ROOT / "docs/source-assets/characters/ame/v02",
            expected_paths={MGJRPG_02_AUTHORED_OPTIONS_IDENTITY_PATH},
            validate_images=True,
        )
        if identity.get("authority") != (
            "immutable-human-approved-identity-and-construction"
        ):
            error(
                "mgjrpg02-options-identity-authority",
                "Candidate C must remain the immutable approved identity/construction authority",
            )
        expected_identity_fields = {
            "id": "ame-current-candidate-c",
            "option": "current",
            "kind": "ame",
        }
        for field, expected in expected_identity_fields.items():
            if identity.get(field) != expected:
                error(
                    "mgjrpg02-options-identity-metadata",
                    f"identityAuthority.{field} must be {expected!r}",
                )

    authored_rows = validate_rows(
        index.get("authoredInputs"),
        "authoredInputs",
        allowed_root=ROOT / MGJRPG_02_AUTHORED_OPTIONS_CALIBRATION_RELATIVE,
        expected_paths=set(MGJRPG_02_AUTHORED_OPTIONS_INPUTS),
        validate_images=True,
    )
    authored_by_path = {str(row.get("path")): row for row, _ in authored_rows}
    for path, expected_fields in MGJRPG_02_AUTHORED_OPTIONS_INPUTS.items():
        row = authored_by_path.get(path)
        if row is None:
            continue
        for field, expected in expected_fields.items():
            if row.get(field) != expected:
                error(
                    "mgjrpg02-options-input-metadata",
                    f"{path} requires {field}={expected!r}; found {row.get(field)!r}",
                )
    for kind in ("sampler", "ame", "enemy-extension", "family-transfer"):
        hashes = [
            str(row.get("sha256"))
            for row in authored_by_path.values()
            if row.get("kind") == kind
        ]
        if len(hashes) == 3 and len(set(hashes)) != 3:
            error(
                "mgjrpg02-options-input-duplicate",
                f"the three {kind} direction originals must be hash-unique",
            )

    reference_rows = validate_rows(
        index.get("referenceInputs"),
        "referenceInputs",
        allowed_root=ROOT / MGJRPG_02_AUTHORED_OPTIONS_CALIBRATION_RELATIVE,
        expected_paths={MGJRPG_02_AUTHORED_OPTIONS_COMPARATOR_PATH},
        validate_images=True,
    )
    reference_by_path = {
        str(row.get("path")): row for row, _ in reference_rows
    }
    comparator_fact = reference_by_path.get(
        MGJRPG_02_AUTHORED_OPTIONS_COMPARATOR_PATH
    )
    if comparator_fact is not None:
        expected_comparator_fields = {
            "id": "family-transfer-current-comparator",
            "kind": "identity-function-comparator",
            "authority": "comparison-layout-only-non-authority",
        }
        for field, expected in expected_comparator_fields.items():
            if comparator_fact.get(field) != expected:
                error(
                    "mgjrpg02-options-comparator-metadata",
                    f"referenceInputs comparator requires {field}={expected!r}; "
                    f"found {comparator_fact.get(field)!r}",
                )
        component_rows = validate_rows(
            comparator_fact.get("components"),
            "referenceInputs[0].components",
            allowed_root=ROOT,
            expected_paths=set(MGJRPG_02_AUTHORED_OPTIONS_COMPARATOR_COMPONENTS),
            validate_images=True,
        )
        for component, _ in component_rows:
            component_path = str(component.get("path"))
            expected_id = MGJRPG_02_AUTHORED_OPTIONS_COMPARATOR_COMPONENTS.get(
                component_path
            )
            if expected_id is not None and component.get("id") != expected_id:
                error(
                    "mgjrpg02-options-comparator-component",
                    f"{component_path} requires id={expected_id!r}; "
                    f"found {component.get('id')!r}",
                )
    else:
        component_rows = []

    provenance_rows = validate_rows(
        index.get("provenanceFiles"),
        "provenanceFiles",
        allowed_root=ROOT / MGJRPG_02_AUTHORED_OPTIONS_CALIBRATION_RELATIVE,
        expected_paths=MGJRPG_02_AUTHORED_OPTIONS_PROVENANCE_PATHS,
    )
    provenance_by_path = {
        str(row.get("path")): (row, path) for row, path in provenance_rows
    }

    proof_rows = validate_rows(
        index.get("proofFiles"),
        "proofFiles",
        allowed_root=proof_root,
        validate_images=True,
    )
    proof_by_path = {str(row.get("path")): (row, path) for row, path in proof_rows}
    required_proof_paths = {
        f"{proof_root_relative}/mgjrpg-02-authored-directions.png",
        f"{proof_root_relative}/ame-source-comparison.png",
        f"{proof_root_relative}/ame-actual-size.png",
        f"{proof_root_relative}/ame-contour-background-closeups.png",
        f"{proof_root_relative}/mgjrpg-02-options-report.json",
        f"{proof_root_relative}/index.html",
        *(
            f"{proof_root_relative}/derived/ame-{option}-registered-512.png"
            for option in ("current", "a", "b", "c")
        ),
        *(
            f"{proof_root_relative}/delivery/ame-{option}-{size}.png"
            for option in ("current", "a", "b", "c")
            for size in (155, 103, 84, 64, 56, 40)
        ),
    }
    missing_proofs = sorted(required_proof_paths - set(proof_by_path))
    if missing_proofs:
        error(
            "mgjrpg02-options-proof-required",
            f"proofFiles omits required review evidence: {missing_proofs}",
        )

    actual_packet_files = {
        path.relative_to(ROOT.resolve()).as_posix()
        for path in proof_root.rglob("*")
        if path.is_file() and path.resolve() != (proof_root / "proof-index.json").resolve()
    }
    unbound_packet_files = sorted(actual_packet_files - set(proof_by_path))
    if unbound_packet_files:
        error(
            "mgjrpg02-options-proof-unbound",
            f"packet contains files absent from proofFiles: {unbound_packet_files}",
        )

    runtime_impact = index.get("runtimeImpact")
    if not isinstance(runtime_impact, dict) or any(
        runtime_impact.get(field) != 0
        for field in ("files", "encodedBytes", "decodedBytes")
    ):
        error(
            "mgjrpg02-options-runtime-impact",
            "index runtimeImpact must record zero files, encoded bytes, and decoded bytes",
        )
    for field in ("bindingRule", "authorityRule"):
        value = index.get(field)
        if not isinstance(value, str) or not value.strip():
            error("mgjrpg02-options-index-contract", f"{field} must be nonempty")

    prompt_pair = provenance_by_path.get(
        "docs/source-assets/calibrations/mgjrpg-02/v02/PROMPTS.md"
    )
    run_pair = provenance_by_path.get(
        "docs/source-assets/calibrations/mgjrpg-02/v02/run-record.json"
    )
    if run_pair is not None:
        _, run_path = run_pair
        try:
            run_record = read_json(run_path)
        except (OSError, json.JSONDecodeError) as exc:
            error("mgjrpg02-options-run-record-json", str(exc), subject=str(run_path))
        else:
            if not isinstance(run_record, dict):
                error(
                    "mgjrpg02-options-run-record-shape",
                    "run record must be an object",
                    subject=str(run_path),
                )
            else:
                if prompt_pair is not None and not has_exact_binding(
                    run_record, prompt_pair[0]
                ):
                    error(
                        "mgjrpg02-options-prompt-unbound",
                        "run record does not bind PROMPTS.md by path, hash, and bytes",
                        subject=str(run_path),
                    )
                if isinstance(identity, dict) and not has_exact_binding(
                    run_record, identity
                ):
                    error(
                        "mgjrpg02-options-identity-unbound",
                        "run record does not bind Candidate C by path, hash, and bytes",
                        subject=str(run_path),
                    )
                if comparator_fact is not None and not has_exact_binding(
                    run_record, comparator_fact
                ):
                    error(
                        "mgjrpg02-options-comparator-unbound",
                        "run record does not bind the family-transfer comparator by path, hash, and bytes",
                        subject=str(run_path),
                    )
                for component_fact, _ in component_rows:
                    if not has_exact_binding(run_record, component_fact):
                        error(
                            "mgjrpg02-options-comparator-component-unbound",
                            f"run record does not bind comparator component "
                            f"{component_fact.get('path')} by path, hash, and bytes",
                            subject=str(run_path),
                        )
                runs = run_record.get("runs")
                if not isinstance(runs, list) or not runs:
                    error(
                        "mgjrpg02-options-runs",
                        "run record must contain a nonempty runs list",
                        subject=str(run_path),
                    )
                else:
                    run_ids = [
                        run.get("runId") if isinstance(run, dict) else None
                        for run in runs
                    ]
                    if any(not isinstance(run_id, str) or not run_id for run_id in run_ids):
                        error(
                            "mgjrpg02-options-run-id",
                            "every run must retain a nonempty runId",
                            subject=str(run_path),
                        )
                    elif len(run_ids) != len(set(run_ids)):
                        error(
                            "mgjrpg02-options-run-id",
                            "runId values must be unique",
                            subject=str(run_path),
                        )
                    for authored_fact, _ in authored_rows:
                        owning_runs = [
                            run
                            for run in runs
                            if isinstance(run, dict)
                            and has_exact_binding(run.get("output"), authored_fact)
                        ]
                        if len(owning_runs) != 1:
                            error(
                                "mgjrpg02-options-output-lineage",
                                f"{authored_fact.get('path')} must be hash-bound by exactly one run.output",
                                subject=str(run_path),
                            )
                            continue
                        owning_run = owning_runs[0]
                        if owning_run.get("direction") != authored_fact.get("option"):
                            error(
                                "mgjrpg02-options-output-direction",
                                f"{authored_fact.get('path')} is owned by direction "
                                f"{owning_run.get('direction')!r}, expected "
                                f"{authored_fact.get('option')!r}",
                                subject=str(run_path),
                            )
                        lineage = owning_run.get("lineage")
                        if not isinstance(lineage, dict) or any(
                            lineage.get(flag) is not False
                            for flag in (
                                "editOfEdit",
                                "mayBeIdentityAuthority",
                                "mayBeRenderingAuthority",
                                "mayBeFutureEditTarget",
                            )
                        ):
                            error(
                                "mgjrpg02-options-output-authority",
                                f"{authored_fact.get('path')} must deny edit-of-edit and all authority roles",
                                subject=str(run_path),
                            )

                    for run in runs:
                        if not isinstance(run, dict):
                            continue
                        output_matches = [
                            fact
                            for fact, _ in authored_rows
                            if has_exact_binding(run.get("output"), fact)
                        ]
                        if len(output_matches) != 1:
                            continue
                        output_fact = output_matches[0]
                        references = run.get("orderedReferences", [])
                        if not isinstance(references, list):
                            error(
                                "mgjrpg02-options-reference-shape",
                                f"{run.get('runId')} orderedReferences must be an array",
                                subject=str(run_path),
                            )
                            continue
                        authored_references: list[dict[str, Any]] = []
                        comparator_references: list[dict[str, Any]] = []
                        for reference in references:
                            if not isinstance(reference, dict):
                                error(
                                    "mgjrpg02-options-reference-shape",
                                    f"{run.get('runId')} has a non-object ordered reference",
                                    subject=str(run_path),
                                )
                                continue
                            referenced_path = reference.get("path")
                            referenced_fact = authored_by_path.get(str(referenced_path))
                            if referenced_fact is not None:
                                authored_references.append(reference)
                                if not has_exact_binding(reference, referenced_fact):
                                    error(
                                        "mgjrpg02-options-reference-binding",
                                        f"{run.get('runId')} does not hash-bind "
                                        f"{referenced_path} as referenced",
                                        subject=str(run_path),
                                    )
                                if not (
                                    output_fact.get("kind") == "family-transfer"
                                    and referenced_fact.get("kind") == "sampler"
                                    and output_fact.get("option")
                                    == referenced_fact.get("option")
                                    == run.get("direction")
                                    and reference.get("authorityKind")
                                    == "non-authority-generator-original-board"
                                ):
                                    error(
                                        "mgjrpg02-options-reference-direction",
                                        f"{run.get('runId')} may reference only its "
                                        "same-direction non-authority sampler board",
                                        subject=str(run_path),
                                    )
                            elif referenced_path == MGJRPG_02_AUTHORED_OPTIONS_COMPARATOR_PATH:
                                comparator_references.append(reference)
                                if comparator_fact is None or not has_exact_binding(
                                    reference, comparator_fact
                                ):
                                    error(
                                        "mgjrpg02-options-reference-binding",
                                        f"{run.get('runId')} does not hash-bind the comparator",
                                        subject=str(run_path),
                                    )
                                if reference.get("authorityKind") != (
                                    "deterministic-comparison-layout-non-authority"
                                ):
                                    error(
                                        "mgjrpg02-options-reference-authority",
                                        f"{run.get('runId')} comparator reference must remain non-authority",
                                        subject=str(run_path),
                                    )
                        if output_fact.get("kind") == "family-transfer" and (
                            len(authored_references) != 1
                            or len(comparator_references) != 1
                        ):
                            error(
                                "mgjrpg02-options-family-transfer-references",
                                f"{run.get('runId')} must bind one same-direction sampler "
                                "and one non-authority identity comparator",
                                subject=str(run_path),
                            )
    report_relative = f"{proof_root_relative}/mgjrpg-02-options-report.json"
    report_pair = proof_by_path.get(report_relative)
    if report_pair is None:
        return
    _, report_path = report_pair
    try:
        report = read_json(report_path)
    except (OSError, json.JSONDecodeError) as exc:
        error("mgjrpg02-options-report-json", str(exc), subject=report_relative)
        return
    if not isinstance(report, dict):
        error(
            "mgjrpg02-options-report-shape",
            "report must be an object",
            subject=report_relative,
        )
        return
    if (
        report.get("schema") != MGJRPG_02_AUTHORED_OPTIONS_REPORT_SCHEMA
        or report.get("packetRevision") != revision
        or report.get("status") != MGJRPG_02_AUTHORED_OPTIONS_STATUS
    ):
        error(
            "mgjrpg02-options-report-identity",
            "report schema, revision, or status differs from the authored-options index",
            subject=report_relative,
        )

    authority = report.get("authority")
    expected_authority = {
        "candidateC": "immutable-human-approved-identity-and-construction",
        "authoredBoards": "comparison-only-non-authority",
        "extractedAndResizedProofs": "review-only-non-authority",
        "runtimePublicationApproved": False,
        "renderingDirectionApproved": False,
        "futureEditAuthorityGranted": False,
    }
    if not isinstance(authority, dict) or any(
        authority.get(field) != expected
        for field, expected in expected_authority.items()
    ):
        error(
            "mgjrpg02-options-report-authority",
            "report authority must preserve Candidate C and deny option/runtime authority",
            subject=report_relative,
        )

    report_inputs = report.get("inputs")
    if not isinstance(report_inputs, dict):
        error(
            "mgjrpg02-options-report-inputs",
            "report inputs must be an object",
            subject=report_relative,
        )
    else:
        if fact_key(report_inputs.get("identityAuthority")) != fact_key(identity):
            error(
                "mgjrpg02-options-report-inputs",
                "report identity authority differs from proof index",
                subject=report_relative,
            )
        report_authored = report_inputs.get("authoredOptions")
        if not isinstance(report_authored, list) or {
            fact_key(row) for row in report_authored
        } != {fact_key(row) for row, _ in authored_rows}:
            error(
                "mgjrpg02-options-report-inputs",
                "report authored options differ from proof index",
                subject=report_relative,
            )
        report_references = report_inputs.get("referenceInputs")
        if not isinstance(report_references, list) or {
            fact_key(row) for row in report_references
        } != {fact_key(row) for row, _ in reference_rows}:
            error(
                "mgjrpg02-options-report-inputs",
                "report reference inputs differ from proof index",
                subject=report_relative,
            )
        elif comparator_fact is not None and report_references != [comparator_fact]:
            error(
                "mgjrpg02-options-report-inputs",
                "report comparator metadata/components differ from proof index",
                subject=report_relative,
            )

    report_provenance = report.get("provenance")
    if not isinstance(report_provenance, dict) or any(
        fact_key(report_provenance.get(field))
        != fact_key(provenance_by_path.get(path, (None, None))[0])
        for field, path in (
            (
                "prompts",
                "docs/source-assets/calibrations/mgjrpg-02/v02/PROMPTS.md",
            ),
            (
                "runRecord",
                "docs/source-assets/calibrations/mgjrpg-02/v02/run-record.json",
            ),
        )
    ):
        error(
            "mgjrpg02-options-report-provenance",
            "report provenance differs from proof index",
            subject=report_relative,
        )
    elif (
        report_provenance.get("verifiedGeneratedInputBindings") != 12
        or report_provenance.get("verifiedCandidateCIdentityBinding") is not True
        or report_provenance.get("verifiedFamilyTransferComparatorBinding") is not True
        or report_provenance.get("verifiedFamilyTransferComponentBindings")
        != len(MGJRPG_02_AUTHORED_OPTIONS_COMPARATOR_COMPONENTS)
    ):
        error(
            "mgjrpg02-options-report-provenance",
            "report must affirm all 12 originals, Candidate C, comparator, and comparator components",
            subject=report_relative,
        )

    uniqueness = report.get("optionUniqueness")
    if not isinstance(uniqueness, dict) or uniqueness.get(
        "allOptionFilesHashUniqueWithinFamily"
    ) is not True:
        error(
            "mgjrpg02-options-report-uniqueness",
            "report must affirm independently authored hash-unique options",
            subject=report_relative,
        )

    proof_contract = report.get("ameProofContract")
    if (
        not isinstance(proof_contract, dict)
        or proof_contract.get("synthesizedContour") is not False
        or proof_contract.get("masterSize") != 512
        or proof_contract.get("deliverySizes") != [155, 103, 84, 64, 56, 40]
    ):
        error(
            "mgjrpg02-options-report-proof-contract",
            "Ame proofs must be deterministic, contour-unsynthesized 512px masters at all required delivery sizes",
            subject=report_relative,
        )

    report_runtime = report.get("runtimeImpact")
    if not isinstance(report_runtime, dict) or any(
        report_runtime.get(field) != 0
        for field in (
            "runtimeFilesChanged",
            "cataloguePointersChanged",
            "encodedByteDelta",
            "decodedByteDelta",
        )
    ):
        error(
            "mgjrpg02-options-report-runtime-impact",
            "report runtime and catalogue impact must remain zero",
            subject=report_relative,
        )

    report_proof_rows = report.get("proofFiles")
    expected_report_proof_keys = {
        fact_key(row)
        for path, (row, _) in proof_by_path.items()
        if path
        not in {
            report_relative,
            f"{proof_root_relative}/index.html",
        }
    }
    if not isinstance(report_proof_rows, list) or {
        fact_key(row) for row in report_proof_rows
    } != expected_report_proof_keys:
        error(
            "mgjrpg02-options-report-proofs",
            "report proofFiles must match every index proof except report and HTML",
            subject=report_relative,
        )


def _validate_mgjrpg02_selection_bundle(
    index: dict[str, Any],
    *,
    proof_root: Path,
    proof_root_relative: str,
    revision: Any,
    index_relative: str,
    errors: list[dict[str, str]],
) -> None:
    """Validate the post-v11 Human-selection calibration and evidence graph.

    This contract intentionally does not replace the authored-options validator.
    It binds the four fresh v03 generations, the exact selected references,
    their ordered generation lineage, and every deterministic v14 review proof.
    """

    def error(code: str, detail: str, *, subject: str = index_relative) -> None:
        errors.append(_message("error", code, subject, detail))

    def fact_key(row: Any) -> tuple[Any, Any, Any] | None:
        if not isinstance(row, dict):
            return None
        raw_bytes = row.get("bytes")
        return (
            row.get("path") if isinstance(row.get("path"), str) else None,
            row.get("sha256") if isinstance(row.get("sha256"), str) else None,
            raw_bytes
            if isinstance(raw_bytes, int) and not isinstance(raw_bytes, bool)
            else None,
        )

    def iter_dicts(value: Any):
        if isinstance(value, dict):
            yield value
            for child in value.values():
                yield from iter_dicts(child)
        elif isinstance(value, list):
            for child in value:
                yield from iter_dicts(child)

    def names_path(row: dict[str, Any], expected_path: str) -> bool:
        return any(
            row.get(field) == expected_path
            for field in (
                "path",
                "immutablePath",
                "immutableGeneratorOriginalPath",
                "outputPath",
            )
        )

    def has_exact_binding(value: Any, fact: dict[str, Any]) -> bool:
        return any(
            names_path(row, str(fact.get("path")))
            and row.get("sha256") == fact.get("sha256")
            and row.get("bytes") == fact.get("bytes")
            for row in iter_dicts(value)
        )

    def validate_image_fact(
        row: dict[str, Any], path: Path, row_owner: str
    ) -> None:
        if not path.is_file() or path.suffix.lower() != ".png":
            return
        try:
            with Image.open(path) as source:
                source.load()
                actual = {
                    "width": source.width,
                    "height": source.height,
                    "mode": source.mode,
                }
        except OSError as exc:
            error("mgjrpg02-selection-image", str(exc), subject=row_owner)
            return
        for field, value in actual.items():
            if row.get(field) != value:
                error(
                    "mgjrpg02-selection-image-fact",
                    f"{field} records {row.get(field)!r}; found {value!r}",
                    subject=row_owner,
                )

    def validate_rows(
        rows: Any,
        field: str,
        *,
        allowed_roots: tuple[Path, ...],
        expected_paths: set[str] | None = None,
        validate_images: bool = False,
    ) -> list[tuple[dict[str, Any], Path]]:
        if not isinstance(rows, list) or not rows:
            error(
                "mgjrpg02-selection-list",
                f"{field} must be a nonempty array",
            )
            return []
        resolved: list[tuple[dict[str, Any], Path]] = []
        seen: set[str] = set()
        for row_index, row in enumerate(rows):
            row_owner = f"{index_relative}:{field}[{row_index}]"
            if not isinstance(row, dict):
                error(
                    "mgjrpg02-selection-entry-shape",
                    "entry must be an object",
                    subject=row_owner,
                )
                continue
            path = _validate_file_evidence(
                row,
                owner=row_owner,
                field="path",
                errors=errors,
            )
            raw_path = row.get("path")
            if not isinstance(raw_path, str) or not raw_path:
                continue
            if raw_path in seen:
                error(
                    "mgjrpg02-selection-duplicate",
                    raw_path,
                    subject=row_owner,
                )
            seen.add(raw_path)
            if path is not None:
                if not any(inside_root(path, root) for root in allowed_roots):
                    roots = ", ".join(str(root.resolve()) for root in allowed_roots)
                    error(
                        "mgjrpg02-selection-path-root",
                        f"path must remain below one of: {roots}",
                        subject=row_owner,
                    )
                if validate_images:
                    validate_image_fact(row, path, row_owner)
                resolved.append((row, path))
        if expected_paths is not None and seen != expected_paths:
            error(
                "mgjrpg02-selection-path-set",
                f"{field} differs; missing={sorted(expected_paths - seen)}, "
                f"unexpected={sorted(seen - expected_paths)}",
            )
        return resolved

    if (
        index.get("packetRevision") != revision
        or index.get("packetRoot") != proof_root_relative
    ):
        error(
            "mgjrpg02-selection-index-identity",
            "selection index revision/root differs from recommendedPacket",
        )
    if index.get("status") != MGJRPG_02_SELECTION_STATUS:
        error(
            "mgjrpg02-selection-status",
            f"status must be {MGJRPG_02_SELECTION_STATUS!r}",
        )

    identity = index.get("identityAuthority")
    if not isinstance(identity, dict):
        error(
            "mgjrpg02-selection-identity",
            "identityAuthority must be an object",
        )
    else:
        validate_rows(
            [identity],
            "identityAuthority",
            allowed_roots=(ROOT / "docs/source-assets/characters/ame/v02",),
            expected_paths={MGJRPG_02_AUTHORED_OPTIONS_IDENTITY_PATH},
            validate_images=True,
        )
        expected_identity = {
            "id": "ame-current-candidate-c",
            "kind": "ame",
            "authority": "immutable-human-approved-identity-and-construction",
        }
        for field, expected in expected_identity.items():
            if identity.get(field) != expected:
                error(
                    "mgjrpg02-selection-identity-metadata",
                    f"identityAuthority.{field} must be {expected!r}",
                )

    reference_rows = validate_rows(
        index.get("referenceInputs"),
        "referenceInputs",
        allowed_roots=(
            ROOT / MGJRPG_02_SELECTION_V02_RELATIVE,
            ROOT / "docs/source-assets/characters/ame/v02",
            ROOT / "docs/source-assets",
        ),
        expected_paths=set(MGJRPG_02_SELECTION_REFERENCE_INPUTS),
        validate_images=True,
    )
    references_by_path = {
        str(row.get("path")): row for row, _ in reference_rows
    }
    for path, expected_fields in MGJRPG_02_SELECTION_REFERENCE_INPUTS.items():
        row = references_by_path.get(path)
        if row is None:
            continue
        for field, expected in expected_fields.items():
            if row.get(field) != expected:
                error(
                    "mgjrpg02-selection-reference-metadata",
                    f"{path} requires {field}={expected!r}; "
                    f"found {row.get(field)!r}",
                )

    authored_rows = validate_rows(
        index.get("authoredInputs"),
        "authoredInputs",
        allowed_roots=(ROOT / MGJRPG_02_SELECTION_V03_RELATIVE,),
        expected_paths=set(MGJRPG_02_SELECTION_AUTHORED_INPUTS),
        validate_images=True,
    )
    authored_by_path = {str(row.get("path")): row for row, _ in authored_rows}
    authored_by_id = {str(row.get("id")): row for row, _ in authored_rows}
    for path, expected_fields in MGJRPG_02_SELECTION_AUTHORED_INPUTS.items():
        row = authored_by_path.get(path)
        if row is None:
            continue
        for field, expected in expected_fields.items():
            if row.get(field) != expected:
                error(
                    "mgjrpg02-selection-authored-metadata",
                    f"{path} requires {field}={expected!r}; "
                    f"found {row.get(field)!r}",
                )
    authored_hashes = [str(row.get("sha256")) for row, _ in authored_rows]
    if len(authored_hashes) == 4 and len(set(authored_hashes)) != 4:
        error(
            "mgjrpg02-selection-authored-duplicate",
            "the four fresh v03 generator originals must be hash-unique",
        )

    provenance_rows = validate_rows(
        index.get("provenanceFiles"),
        "provenanceFiles",
        allowed_roots=(
            ROOT / MGJRPG_02_SELECTION_V02_RELATIVE,
            ROOT / MGJRPG_02_SELECTION_V03_RELATIVE,
        ),
        expected_paths=MGJRPG_02_SELECTION_PROVENANCE_PATHS,
    )
    provenance_by_path = {
        str(row.get("path")): (row, path) for row, path in provenance_rows
    }

    proof_rows = validate_rows(
        index.get("proofFiles"),
        "proofFiles",
        allowed_roots=(proof_root,),
        validate_images=True,
    )
    proof_by_path = {str(row.get("path")): (row, path) for row, path in proof_rows}
    required_proof_paths = {
        f"{proof_root_relative}/selection-reference-map.png",
        f"{proof_root_relative}/ame-fresh-source-comparison.png",
        f"{proof_root_relative}/ame-fresh-actual-size.png",
        f"{proof_root_relative}/ame-fresh-contour-background-closeups.png",
        f"{proof_root_relative}/ame-full-sprite-actual-size-backgrounds.png",
        f"{proof_root_relative}/future-enemy-comparison.png",
        f"{proof_root_relative}/rose-floor-pad-comparison.png",
        f"{proof_root_relative}/rose-floor-pad-actual-size.png",
        f"{proof_root_relative}/mgjrpg-02-selection-report.json",
        f"{proof_root_relative}/index.html",
        *(
            f"{proof_root_relative}/derived/ame-{variant}-registered-512.png"
            for variant in ("current", "prior-b", "fresh-01", "fresh-02")
        ),
        *(
            f"{proof_root_relative}/delivery/ame-{variant}-{size}.png"
            for variant in ("current", "prior-b", "fresh-01", "fresh-02")
            for size in (155, 103, 84, 77, 64, 56, 40)
        ),
        *(
            f"{proof_root_relative}/derived/rose-floor-pad-{variant}-registered-512.png"
            for variant in ("current", "fresh")
        ),
        *(
            f"{proof_root_relative}/delivery/rose-floor-pad-{variant}-{size}.png"
            for variant in ("current", "fresh")
            for size in (84, 64)
        ),
    }
    missing_proofs = sorted(required_proof_paths - set(proof_by_path))
    if missing_proofs:
        error(
            "mgjrpg02-selection-proof-required",
            f"proofFiles omits required selection evidence: {missing_proofs}",
        )
    expected_proof_dimensions = {
        **{
            f"{proof_root_relative}/derived/ame-{variant}-registered-512.png": 512
            for variant in ("current", "prior-b", "fresh-01", "fresh-02")
        },
        **{
            f"{proof_root_relative}/delivery/ame-{variant}-{size}.png": size
            for variant in ("current", "prior-b", "fresh-01", "fresh-02")
            for size in (155, 103, 84, 77, 64, 56, 40)
        },
        **{
            f"{proof_root_relative}/derived/rose-floor-pad-{variant}-registered-512.png": 512
            for variant in ("current", "fresh")
        },
        **{
            f"{proof_root_relative}/delivery/rose-floor-pad-{variant}-{size}.png": size
            for variant in ("current", "fresh")
            for size in (84, 64)
        },
    }
    for path, expected_size in expected_proof_dimensions.items():
        pair = proof_by_path.get(path)
        if pair is None:
            continue
        row, _ = pair
        if (
            row.get("width") != expected_size
            or row.get("height") != expected_size
            or row.get("mode") != "RGBA"
        ):
            error(
                "mgjrpg02-selection-proof-dimensions",
                f"{path} must be {expected_size}x{expected_size} RGBA",
            )
    actual_packet_files = {
        path.relative_to(ROOT.resolve()).as_posix()
        for path in proof_root.rglob("*")
        if path.is_file()
        and path.resolve() != (proof_root / "proof-index.json").resolve()
    }
    unbound_packet_files = sorted(actual_packet_files - set(proof_by_path))
    if unbound_packet_files:
        error(
            "mgjrpg02-selection-proof-unbound",
            f"packet contains files absent from proofFiles: {unbound_packet_files}",
        )

    runtime_impact = index.get("runtimeImpact")
    if not isinstance(runtime_impact, dict) or any(
        runtime_impact.get(field) != 0
        for field in ("files", "encodedBytes", "decodedBytes")
    ):
        error(
            "mgjrpg02-selection-runtime-impact",
            "index runtimeImpact must record zero files and encoded/decoded bytes",
        )
    for field in ("bindingRule", "authorityRule"):
        value = index.get(field)
        if not isinstance(value, str) or not value.strip():
            error(
                "mgjrpg02-selection-index-contract",
                f"{field} must be nonempty",
            )

    v03_prompt_pair = provenance_by_path.get(
        "docs/source-assets/calibrations/mgjrpg-02/v03/PROMPTS.md"
    )
    v03_run_pair = provenance_by_path.get(
        "docs/source-assets/calibrations/mgjrpg-02/v03/run-record.json"
    )
    if v03_run_pair is not None:
        _, run_path = v03_run_pair
        try:
            run_record = read_json(run_path)
        except (OSError, json.JSONDecodeError) as exc:
            error(
                "mgjrpg02-selection-run-record-json",
                str(exc),
                subject=str(run_path),
            )
        else:
            if not isinstance(run_record, dict):
                error(
                    "mgjrpg02-selection-run-record-shape",
                    "v03 run record must be an object",
                    subject=str(run_path),
                )
            else:
                if v03_prompt_pair is not None and not has_exact_binding(
                    run_record, v03_prompt_pair[0]
                ):
                    error(
                        "mgjrpg02-selection-prompt-unbound",
                        "v03 run record does not bind v03 PROMPTS.md exactly",
                        subject=str(run_path),
                    )
                if isinstance(identity, dict) and not has_exact_binding(
                    run_record, identity
                ):
                    error(
                        "mgjrpg02-selection-identity-unbound",
                        "v03 run record does not bind Candidate C exactly",
                        subject=str(run_path),
                    )
                prior_b_path = (
                    "docs/source-assets/calibrations/mgjrpg-02/v02/"
                    "ame-v02-rendering-option-b-generator-original.png"
                )
                prior_b_fact = references_by_path.get(prior_b_path)
                prior_b_fallback = run_record.get("comparisonOnlyFallback")
                if (
                    prior_b_fact is None
                    or not isinstance(prior_b_fallback, dict)
                    or not has_exact_binding(prior_b_fallback, prior_b_fact)
                    or prior_b_fallback.get("generationInput") is not False
                ):
                    error(
                        "mgjrpg02-selection-prior-ame-fallback",
                        "v03 must explicitly bind prior Ame B as a non-generation fallback",
                        subject=str(run_path),
                    )
                runs = run_record.get("runs")
                if not isinstance(runs, list) or len(runs) != 4:
                    error(
                        "mgjrpg02-selection-runs",
                        "v03 run record must contain exactly four runs",
                        subject=str(run_path),
                    )
                    runs = []
                matched_outputs: list[str] = []
                c_sampler_path = (
                    "docs/source-assets/calibrations/mgjrpg-02/v02/"
                    "direction-c-sampler-generator-original.png"
                )
                for run_index, run in enumerate(runs):
                    run_owner = f"{run_path}:runs[{run_index}]"
                    if not isinstance(run, dict):
                        error(
                            "mgjrpg02-selection-run-shape",
                            "run must be an object",
                            subject=run_owner,
                        )
                        continue
                    if run.get("generationMode") != "fresh-reference-led-generation":
                        error(
                            "mgjrpg02-selection-run-method",
                            "generationMode must be 'fresh-reference-led-generation'",
                            subject=run_owner,
                        )
                    output_matches = [
                        (output_id, fact)
                        for output_id, fact in authored_by_id.items()
                        if has_exact_binding(run.get("output"), fact)
                    ]
                    if len(output_matches) != 1:
                        error(
                            "mgjrpg02-selection-run-output",
                            "run output must bind exactly one v03 authored input",
                            subject=run_owner,
                        )
                        continue
                    output_id, output_fact = output_matches[0]
                    matched_outputs.append(output_id)
                    if run.get("kind") != output_fact.get("kind"):
                        error(
                            "mgjrpg02-selection-run-kind",
                            f"{output_id} run kind must match its authored-input kind",
                            subject=run_owner,
                        )
                    if v03_prompt_pair is not None and not has_exact_binding(
                        run.get("prompt"), v03_prompt_pair[0]
                    ):
                        error(
                            "mgjrpg02-selection-run-prompt",
                            f"{output_id} must bind the exact v03 prompt file",
                            subject=run_owner,
                        )
                    lineage = run.get("lineage")
                    required_false = (
                        "editOfEdit",
                        "mayBeIdentityAuthority",
                        "mayBeRenderingAuthority",
                        "mayBeFutureEditTarget",
                    )
                    if not isinstance(lineage, dict) or any(
                        lineage.get(field) is not False for field in required_false
                    ) or lineage.get("editTargetPath") is not None:
                        error(
                            "mgjrpg02-selection-output-lineage",
                            f"{output_id} must deny edit-of-edit and every authority role",
                            subject=run_owner,
                        )
                    elif any(
                        value is True
                        for field, value in lineage.items()
                        if field == "editOfEdit"
                        or "authority" in field.lower()
                        or field.startswith("mayBe")
                    ):
                        error(
                            "mgjrpg02-selection-output-lineage",
                            f"{output_id} contains a true authority/edit lineage flag",
                            subject=run_owner,
                        )
                    references = run.get("orderedReferences")
                    if not isinstance(references, list):
                        error(
                            "mgjrpg02-selection-reference-shape",
                            "orderedReferences must be an array",
                            subject=run_owner,
                        )
                        continue
                    positions = [
                        reference.get("order")
                        if isinstance(reference, dict)
                        else None
                        for reference in references
                    ]
                    if positions != list(range(1, len(references) + 1)):
                        error(
                            "mgjrpg02-selection-reference-order",
                            "orderedReferences positions must be contiguous from one",
                            subject=run_owner,
                        )
                    reference_paths = [
                        reference.get("path")
                        if isinstance(reference, dict)
                        else None
                        for reference in references
                    ]
                    expected_reference_paths = MGJRPG_02_SELECTION_RUN_REFERENCES.get(
                        output_id
                    )
                    if reference_paths != expected_reference_paths:
                        error(
                            "mgjrpg02-selection-reference-selection",
                            f"{output_id} reference order differs; expected "
                            f"{expected_reference_paths!r}, found {reference_paths!r}",
                            subject=run_owner,
                        )
                    if prior_b_path in reference_paths:
                        error(
                            "mgjrpg02-selection-prior-ame-generation-input",
                            "prior edited Ame B is comparison-only and may never be a generation input",
                            subject=run_owner,
                        )
                    if c_sampler_path in reference_paths:
                        error(
                            "mgjrpg02-selection-c-sampler-generation-input",
                            "C sampler is selection-map evidence only in v03",
                            subject=run_owner,
                        )
                    for reference_index, reference in enumerate(references):
                        if not isinstance(reference, dict):
                            error(
                                "mgjrpg02-selection-reference-shape",
                                "ordered reference must be an object",
                                subject=run_owner,
                            )
                            continue
                        reference_path = str(reference.get("path"))
                        expected_fact = (
                            identity
                            if reference_path
                            == MGJRPG_02_AUTHORED_OPTIONS_IDENTITY_PATH
                            else references_by_path.get(reference_path)
                        )
                        if not isinstance(expected_fact, dict) or not has_exact_binding(
                            reference, expected_fact
                        ):
                            error(
                                "mgjrpg02-selection-reference-binding",
                                f"ordered reference {reference_index + 1} is not exactly bound",
                                subject=run_owner,
                            )
                        if (
                            reference_path in references_by_path
                            and references_by_path[reference_path].get(
                                "generationReferenceAllowed"
                            )
                            is not True
                        ):
                            error(
                                "mgjrpg02-selection-reference-authority",
                                f"{reference_path} is comparison-only",
                                subject=run_owner,
                            )
                        for field in ("role", "authorityKind"):
                            value = reference.get(field)
                            if not isinstance(value, str) or not value.strip():
                                error(
                                    "mgjrpg02-selection-reference-metadata",
                                    f"ordered reference requires nonempty {field}",
                                    subject=run_owner,
                                )
                run_ids = [
                    run.get("runId") if isinstance(run, dict) else None
                    for run in runs
                ]
                if (
                    any(not isinstance(run_id, str) or not run_id for run_id in run_ids)
                    or len(set(run_ids)) != len(run_ids)
                ):
                    error(
                        "mgjrpg02-selection-run-id",
                        "v03 runId values must be nonempty and unique",
                        subject=str(run_path),
                    )
                if sorted(matched_outputs) != sorted(
                    MGJRPG_02_SELECTION_RUN_REFERENCES
                ):
                    error(
                        "mgjrpg02-selection-run-output-set",
                        "each v03 authored original must be owned by exactly one run",
                        subject=str(run_path),
                    )

    report_relative = f"{proof_root_relative}/mgjrpg-02-selection-report.json"
    report_pair = proof_by_path.get(report_relative)
    if report_pair is None:
        return
    _, report_path = report_pair
    try:
        report = read_json(report_path)
    except (OSError, json.JSONDecodeError) as exc:
        error(
            "mgjrpg02-selection-report-json",
            str(exc),
            subject=report_relative,
        )
        return
    if not isinstance(report, dict):
        error(
            "mgjrpg02-selection-report-shape",
            "report must be an object",
            subject=report_relative,
        )
        return
    if (
        report.get("schema") != MGJRPG_02_SELECTION_REPORT_SCHEMA
        or report.get("packetRevision") != revision
        or report.get("status") != MGJRPG_02_SELECTION_STATUS
    ):
        error(
            "mgjrpg02-selection-report-identity",
            "report schema, revision, or status differs from the selection index",
            subject=report_relative,
        )

    report_inputs = report.get("inputs")
    if not isinstance(report_inputs, dict):
        error(
            "mgjrpg02-selection-report-inputs",
            "report inputs must be an object",
            subject=report_relative,
        )
    else:
        if fact_key(report_inputs.get("identityAuthority")) != fact_key(identity):
            error(
                "mgjrpg02-selection-report-inputs",
                "report identity authority differs from proof index",
                subject=report_relative,
            )
        for field, expected_rows in (
            ("referenceInputs", reference_rows),
            ("authoredInputs", authored_rows),
        ):
            actual_rows = report_inputs.get(field)
            if not isinstance(actual_rows, list) or {
                fact_key(row) for row in actual_rows
            } != {fact_key(row) for row, _ in expected_rows}:
                error(
                    "mgjrpg02-selection-report-inputs",
                    f"report {field} differs from proof index",
                    subject=report_relative,
                )

    report_provenance = report.get("provenance")
    provenance_keys = {
        fact_key(row) for row, _ in provenance_rows
    }
    if not isinstance(report_provenance, (dict, list)) or not provenance_keys.issubset(
        {fact_key(row) for row in iter_dicts(report_provenance)}
    ):
        error(
            "mgjrpg02-selection-report-provenance",
            "report provenance must exactly bind all four v02/v03 prompt/run files",
            subject=report_relative,
        )

    authority = report.get("authority")
    expected_authority = {
        "candidateC": "immutable-human-approved-identity-and-construction",
        "priorBAme": "comparison-only-fallback-not-generation-input",
        "v03GeneratorOriginals": "comparison-only-non-authority",
        "proofDerivatives": "review-only-non-authority",
        "runtimePublicationApproved": False,
        "futureEditAuthorityGranted": False,
    }
    if not isinstance(authority, dict) or any(
        authority.get(field) != expected
        for field, expected in expected_authority.items()
    ):
        error(
            "mgjrpg02-selection-report-authority",
            "report must deny new rendering, edit, and runtime authority",
            subject=report_relative,
        )

    ame_contract = report.get("ameProofContract")
    if (
        not isinstance(ame_contract, dict)
        or ame_contract.get("synthesizedContour") is not False
        or ame_contract.get("masterSize") != 512
        or ame_contract.get("deliverySizes") != [155, 103, 84, 77, 64, 56, 40]
        or ame_contract.get("fullSpriteBackgroundSizes") != [103, 77, 56, 40]
        or ame_contract.get("fullSpriteBackgrounds")
        != ["paper", "ink plum", "magenta QA", "cyan QA", "woodland floor"]
    ):
        error(
            "mgjrpg02-selection-report-proof-contract",
            "Ame proofs must be contour-unsynthesized 512px masters at every required size and full-sprite background",
            subject=report_relative,
        )
    portal_contract = report.get("portalProofContract")
    if (
        not isinstance(portal_contract, dict)
        or portal_contract.get("synthesizedContour") is not False
        or portal_contract.get("masterSize") != 512
        or portal_contract.get("deliverySizes") != [84, 64]
    ):
        error(
            "mgjrpg02-selection-report-proof-contract",
            "Rose floor-pad proofs must be contour-unsynthesized 512px masters at 84/64 px",
            subject=report_relative,
        )

    report_runtime = report.get("runtimeImpact")
    if not isinstance(report_runtime, dict) or any(
        report_runtime.get(field) != 0
        for field in (
            "runtimeFilesChanged",
            "cataloguePointersChanged",
            "encodedByteDelta",
            "decodedByteDelta",
        )
    ):
        error(
            "mgjrpg02-selection-report-runtime-impact",
            "report runtime and catalogue impact must remain zero",
            subject=report_relative,
        )

    report_proof_rows = report.get("proofFiles")
    expected_report_proof_keys = {
        fact_key(row)
        for path, (row, _) in proof_by_path.items()
        if path
        not in {
            report_relative,
            f"{proof_root_relative}/index.html",
        }
    }
    if not isinstance(report_proof_rows, list) or {
        fact_key(row) for row in report_proof_rows
    } != expected_report_proof_keys:
        error(
            "mgjrpg02-selection-report-proofs",
            "report proofFiles must match every index proof except report and HTML",
            subject=report_relative,
        )


def _validate_mgjrpg02_proof_bundle(
    review: dict[str, Any],
    owner: str,
    errors: list[dict[str, str]],
) -> None:
    """Validate every ignored file transitively bound by the canonical review.

    The tracked review hashes the packet's proof index. This validator follows
    that index into its pipeline inputs, named outputs, actual-size delivery
    pairs, report-owned assay candidates, and HTML review surface so an ignored
    child cannot disappear or change while the Human gate still reports green.
    """

    packet = review.get("recommendedPacket")
    if not isinstance(packet, dict):
        errors.append(
            _message(
                "error",
                "mgjrpg02-packet-shape",
                owner,
                "canonical review requires recommendedPacket evidence",
            )
        )
        return

    revision = packet.get("revision")
    raw_root = packet.get("proofRoot")
    proof_root = _repo_path(
        raw_root,
        owner=owner,
        field="recommendedPacket.proofRoot",
        errors=errors,
    )
    if proof_root is None:
        return
    canonical_parent = (PROOF_ROOT / "mgjrpg-02").resolve()
    if proof_root.parent.resolve() != canonical_parent:
        errors.append(
            _message(
                "error",
                "mgjrpg02-proof-root",
                owner,
                "recommended packet must be a direct revision below artifacts/art-proofs/mgjrpg-02",
            )
        )
        return
    if not isinstance(revision, str) or not revision or proof_root.name != revision:
        errors.append(
            _message(
                "error",
                "mgjrpg02-proof-revision",
                owner,
                "recommendedPacket.revision must equal the proof-root directory name",
            )
        )
    if not proof_root.is_dir():
        errors.append(
            _message(
                "error",
                "mgjrpg02-proof-root-missing",
                owner,
                str(raw_root),
            )
        )
        return

    proof_root_relative = proof_root.relative_to(ROOT.resolve()).as_posix()
    index_path = proof_root / "proof-index.json"
    index_relative = f"{proof_root_relative}/proof-index.json"
    index_bindings = [
        entry
        for entry in review.get("evidence", [])
        if isinstance(entry, dict) and entry.get("path") == index_relative
    ]
    if len(index_bindings) != 1:
        errors.append(
            _message(
                "error",
                "mgjrpg02-proof-index-unbound",
                owner,
                "review evidence must bind exactly one canonical proof-index.json",
            )
        )
        return
    _validate_file_evidence(
        index_bindings[0],
        owner=owner,
        field="recommendedPacket.proof-index",
        errors=errors,
    )
    if not index_path.is_file():
        return
    try:
        index = read_json(index_path)
    except (OSError, json.JSONDecodeError) as exc:
        errors.append(
            _message("error", "mgjrpg02-proof-index-json", index_relative, str(exc))
        )
        return
    if index.get("schema") == MGJRPG_02_SELECTION_PROOF_INDEX_SCHEMA:
        _validate_mgjrpg02_selection_bundle(
            index,
            proof_root=proof_root,
            proof_root_relative=proof_root_relative,
            revision=revision,
            index_relative=index_relative,
            errors=errors,
        )
        return
    if index.get("schema") == MGJRPG_02_AUTHORED_OPTIONS_PROOF_INDEX_SCHEMA:
        _validate_mgjrpg02_authored_options_bundle(
            index,
            proof_root=proof_root,
            proof_root_relative=proof_root_relative,
            revision=revision,
            index_relative=index_relative,
            errors=errors,
        )
        return
    if index.get("schema") != MGJRPG_02_PROOF_INDEX_SCHEMA:
        errors.append(
            _message(
                "error",
                "mgjrpg02-proof-index-schema",
                index_relative,
                str(index.get("schema")),
            )
        )
    if index.get("packetRevision") != revision or index.get("proofRoot") != proof_root_relative:
        errors.append(
            _message(
                "error",
                "mgjrpg02-proof-index-identity",
                index_relative,
                "proof index revision/root differs from recommendedPacket",
            )
        )

    def validate_rows(
        rows: Any,
        field: str,
        *,
        allowed_root: Path | None = None,
    ) -> list[tuple[dict[str, Any], Path]]:
        if not isinstance(rows, list) or not rows:
            errors.append(
                _message(
                    "error",
                    "mgjrpg02-proof-list",
                    index_relative,
                    f"{field} must be a nonempty array",
                )
            )
            return []
        resolved: list[tuple[dict[str, Any], Path]] = []
        seen: set[str] = set()
        for row_index, row in enumerate(rows):
            row_owner = f"{index_relative}:{field}[{row_index}]"
            if not isinstance(row, dict):
                errors.append(
                    _message(
                        "error",
                        "mgjrpg02-proof-entry-shape",
                        row_owner,
                        "entry must be an object",
                    )
                )
                continue
            path = _validate_file_evidence(
                row,
                owner=row_owner,
                field="path",
                errors=errors,
            )
            raw_path = str(row.get("path", ""))
            if raw_path in seen:
                errors.append(
                    _message(
                        "error",
                        "mgjrpg02-proof-duplicate",
                        row_owner,
                        raw_path,
                    )
                )
            seen.add(raw_path)
            if path is not None:
                if allowed_root is not None and not inside_root(path, allowed_root):
                    errors.append(
                        _message(
                            "error",
                            "mgjrpg02-proof-path-root",
                            row_owner,
                            f"path must remain below {allowed_root.relative_to(ROOT.resolve()).as_posix()}",
                        )
                    )
                resolved.append((row, path))
        return resolved

    validate_rows(index.get("pipelineInputs"), "pipelineInputs")
    outputs = validate_rows(index.get("outputs"), "outputs", allowed_root=proof_root)
    validate_rows(
        index.get("deliveryOutputs"),
        "deliveryOutputs",
        allowed_root=proof_root / "delivery",
    )

    output_by_path = {str(row.get("path")): path for row, path in outputs}
    html_relative = f"{proof_root_relative}/index.html"
    if html_relative not in output_by_path:
        errors.append(
            _message(
                "error",
                "mgjrpg02-html-unbound",
                index_relative,
                "outputs must hash-bind the canonical index.html review surface",
            )
        )
    report_relative = f"{proof_root_relative}/mgjrpg-02-report.json"
    report_path = output_by_path.get(report_relative)
    if report_path is None:
        errors.append(
            _message(
                "error",
                "mgjrpg02-report-unbound",
                index_relative,
                "outputs must hash-bind mgjrpg-02-report.json",
            )
        )
        return
    try:
        report = read_json(report_path)
    except (OSError, json.JSONDecodeError) as exc:
        errors.append(
            _message("error", "mgjrpg02-report-json", report_relative, str(exc))
        )
        return
    if report.get("packetRevision") != revision:
        errors.append(
            _message(
                "error",
                "mgjrpg02-report-revision",
                report_relative,
                "report packetRevision differs from recommendedPacket",
            )
        )

    canaries = report.get("canaries")
    if not isinstance(canaries, list) or not canaries:
        errors.append(
            _message(
                "error",
                "mgjrpg02-report-canaries",
                report_relative,
                "report canaries must be a nonempty array",
            )
        )
    else:
        candidate_rows = [
            row.get("candidateOutput") if isinstance(row, dict) else None
            for row in canaries
        ]
        validate_rows(
            candidate_rows,
            "report.canaries.candidateOutput",
            allowed_root=proof_root / "candidates",
        )
        proof_baselines = [
            row.get("authority", {}).get("proofBaseline")
            for row in canaries
            if isinstance(row, dict)
            and isinstance(row.get("authority"), dict)
            and isinstance(row.get("authority", {}).get("proofBaseline"), dict)
        ]
        if proof_baselines:
            validate_rows(
                proof_baselines,
                "report.canaries.authority.proofBaseline",
                allowed_root=proof_root / "baselines",
            )

    contracts = report.get("proofContracts")
    if isinstance(contracts, dict):
        representative = contracts.get("representativeBackground")
        if isinstance(representative, dict):
            validate_rows(
                [representative],
                "report.proofContracts.representativeBackground",
            )
        rejected_assay = contracts.get("imagegenRejectedAssay")
        if isinstance(rejected_assay, dict):
            referenced = [
                rejected_assay.get(key)
                for key in ("authority", "output")
                if isinstance(rejected_assay.get(key), dict)
            ]
            if referenced:
                validate_rows(
                    referenced,
                    "report.proofContracts.imagegenRejectedAssay",
                )


def _validate_recipe_and_review_documents(
    errors: list[dict[str, str]],
    warnings: list[dict[str, str]],
) -> tuple[dict[str, tuple[Path, dict[str, Any]]], dict[str, tuple[Path, dict[str, Any]]]]:
    recipes: dict[str, tuple[Path, dict[str, Any]]] = {}
    reviews: dict[str, tuple[Path, dict[str, Any]]] = {}
    for path in canonical_recipe_paths():
        label = posix_relative(path)
        try:
            recipe = read_json(path)
        except (OSError, json.JSONDecodeError) as exc:
            errors.append(_message("error", "recipe-json", label, str(exc)))
            continue
        for detail in validate_recipe_shape(recipe, label):
            errors.append(_message("error", "recipe-shape", label, detail))
        recipe_id = str(recipe.get("recipeId", ""))
        if path.name != f"{recipe_id}.json":
            errors.append(
                _message("error", "recipe-filename", label, f"filename must be {recipe_id}.json")
            )
        if recipe_id in recipes:
            errors.append(_message("error", "duplicate-recipe-id", label, recipe_id))
        recipes[recipe_id] = (path, recipe)

    for path in canonical_review_paths():
        label = posix_relative(path)
        try:
            review = read_json(path)
        except (OSError, json.JSONDecodeError) as exc:
            errors.append(_message("error", "review-json", label, str(exc)))
            continue
        for detail in validate_review_shape(review, label):
            errors.append(_message("error", "review-shape", label, detail))
        review_id = str(review.get("reviewId", ""))
        if path.name != f"{review_id}.json":
            errors.append(
                _message("error", "review-filename", label, f"filename must be {review_id}.json")
            )
        if review_id in reviews:
            errors.append(_message("error", "duplicate-review-id", label, review_id))
        reviews[review_id] = (path, review)
        recipe_path = _repo_path(
            review.get("recipePath"),
            owner=label,
            field="recipePath",
            errors=errors,
        )
        if recipe_path is not None:
            if not inside_root(recipe_path, RECIPE_ROOT):
                errors.append(
                    _message("error", "review-recipe-root", label, "recipePath must stay under recipes")
                )
            elif not recipe_path.is_file():
                errors.append(_message("error", "review-recipe-missing", label, str(review.get("recipePath"))))
            elif review.get("recipeSha256") != sha256_file(recipe_path):
                errors.append(
                    _message("error", "review-recipe-hash", label, "recipeSha256 differs")
                )
        evidence = review.get("evidence", [])
        if isinstance(evidence, list):
            for index, entry in enumerate(evidence):
                if isinstance(entry, dict):
                    _validate_file_evidence(
                        entry,
                        owner=label,
                        field=f"evidence[{index}].path",
                        errors=errors,
                    )
        if review.get("status") == "pending-human":
            warnings.append(
                _message(
                    "warning",
                    "canary-review-pending",
                    label,
                    "mgjrpg-02 remains blocked from runtime publication until explicit Human approval",
                )
            )
        if review_id == MGJRPG_02_REVIEW_ID:
            _validate_mgjrpg02_proof_bundle(review, label, errors)
    return recipes, reviews


def _validate_generation_batch_documents(
    errors: list[dict[str, str]],
    warnings: list[dict[str, str]],
    source_owners: dict[str, list[str]],
) -> None:
    """Validate source-only production batches and claim their immutable outputs."""

    seen_batch_ids: set[str] = set()
    seen_output_paths: set[str] = set()
    for batch_path in canonical_generation_batch_paths():
        label = posix_relative(batch_path)
        try:
            batch = read_json(batch_path)
        except (OSError, json.JSONDecodeError) as exc:
            errors.append(_message("error", "generation-batch-json", label, str(exc)))
            continue
        for detail in validate_generation_batch_shape(batch, label):
            errors.append(_message("error", "generation-batch-shape", label, detail))

        batch_id = str(batch.get("batchId", ""))
        if batch_id in seen_batch_ids:
            errors.append(_message("error", "generation-batch-id", label, f"duplicate {batch_id}"))
        seen_batch_ids.add(batch_id)
        owner = f"batch:{batch_id}"

        prompt_entry = batch.get("promptFile")
        prompt_path = None
        if isinstance(prompt_entry, dict):
            prompt_path = _validate_file_evidence(
                prompt_entry,
                owner=label,
                field="promptFile.path",
                errors=errors,
            )
            if prompt_path is not None and prompt_path.parent != batch_path.parent:
                errors.append(
                    _message(
                        "error",
                        "generation-batch-prompt-root",
                        label,
                        "promptFile must be adjacent to its run record",
                    )
                )
        else:
            errors.append(_message("error", "generation-batch-prompt", label, "promptFile must be an object"))

        for evidence_field, allowed_root in (
            ("recipeEvidence", RECIPE_ROOT),
            ("decisionEvidence", CALIBRATION_ROOT),
        ):
            evidence = batch.get(evidence_field)
            if not isinstance(evidence, dict):
                errors.append(_message("error", "generation-batch-evidence", label, f"{evidence_field} must be an object"))
                continue
            evidence_path = _validate_file_evidence(
                evidence,
                owner=label,
                field=f"{evidence_field}.path",
                errors=errors,
            )
            if evidence_path is not None and not inside_root(evidence_path, allowed_root):
                errors.append(
                    _message(
                        "error",
                        "generation-batch-evidence-root",
                        label,
                        f"{evidence_field} must stay under {posix_relative(allowed_root)}",
                    )
                )

        registry = batch.get("referenceRegistry")
        if isinstance(registry, dict):
            for reference_id, evidence in registry.items():
                if not isinstance(evidence, dict):
                    continue
                reference_path = _validate_file_evidence(
                    evidence,
                    owner=label,
                    field=f"referenceRegistry.{reference_id}.path",
                    errors=errors,
                )
                if reference_path is not None and not (
                    inside_root(reference_path, ROOT / "docs" / "source-assets")
                    or inside_root(reference_path, ROOT / "public" / "assets")
                ):
                    errors.append(
                        _message(
                            "error",
                            "generation-batch-reference-root",
                            label,
                            "generation references must stay under docs/source-assets or public/assets",
                        )
                    )

        prompt_text = ""
        if prompt_path is not None and prompt_path.is_file():
            prompt_text = prompt_path.read_text(encoding="utf-8-sig")
        recorded_output_paths: set[str] = set()
        for index, run in enumerate(batch.get("runs", [])):
            if not isinstance(run, dict):
                continue
            run_owner = f"{label}:runs[{index}]"
            block_id = run.get("promptBlockId")
            if prompt_text and isinstance(block_id, str):
                heading = re.compile(rf"^#{{2,3}} `{re.escape(block_id)}`\s*$", re.MULTILINE)
                if len(heading.findall(prompt_text)) != 1:
                    errors.append(
                        _message(
                            "error",
                            "generation-batch-prompt-block",
                            run_owner,
                            f"expected one exact prompt heading for {block_id!r}",
                        )
                    )
            output = run.get("output")
            if not isinstance(output, dict):
                continue
            output_path = _validate_file_evidence(
                output,
                owner=run_owner,
                field="output.path",
                errors=errors,
            )
            raw_output_path = str(output.get("path", ""))
            recorded_output_paths.add(raw_output_path)
            source_owners[raw_output_path].append(owner)
            if raw_output_path in seen_output_paths:
                errors.append(_message("error", "generation-batch-output-owner", run_owner, "output is claimed by more than one batch"))
            seen_output_paths.add(raw_output_path)
            if output_path is None or not output_path.is_file():
                continue
            if output_path.parent != batch_path.parent or not inside_root(output_path, PRODUCTION_ROOT):
                errors.append(
                    _message(
                        "error",
                        "generation-batch-output-root",
                        run_owner,
                        "immutable output must be adjacent to its run record under production",
                    )
                )
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
                        _message(
                            "error",
                            "generation-batch-image-fact",
                            run_owner,
                            f"{fact} records {output.get(fact)!r}; found {facts[fact]!r}",
                        )
                    )

        review_evidence = batch.get("reviewEvidence")
        if batch.get("status") == "reviewed":
            if not isinstance(review_evidence, dict):
                errors.append(
                    _message(
                        "error",
                        "generation-batch-review-evidence",
                        label,
                        "reviewed batches require reviewEvidence",
                    )
                )
            else:
                review_path = _validate_file_evidence(
                    review_evidence,
                    owner=label,
                    field="reviewEvidence.path",
                    errors=errors,
                )
                if review_path is not None and review_path.parent != batch_path.parent:
                    errors.append(
                        _message(
                            "error",
                            "generation-batch-review-root",
                            label,
                            "reviewEvidence must be adjacent to its run record",
                        )
                    )

        run_ids = {
            str(run.get("runId", ""))
            for run in batch.get("runs", [])
            if isinstance(run, dict)
        }
        for index, derivative in enumerate(batch.get("approvedDerivatives", [])):
            if not isinstance(derivative, dict):
                errors.append(
                    _message(
                        "error",
                        "generation-batch-approved-derivative",
                        label,
                        f"approvedDerivatives[{index}] must be an object",
                    )
                )
                continue
            derivative_owner = f"{label}:approvedDerivatives[{index}]"
            source_run_id = str(derivative.get("sourceRunId", ""))
            if source_run_id not in run_ids:
                errors.append(
                    _message(
                        "error",
                        "generation-batch-approved-source",
                        derivative_owner,
                        f"unknown sourceRunId {source_run_id!r}",
                    )
                )
            derivative_path = _validate_file_evidence(
                derivative,
                owner=derivative_owner,
                field="path",
                errors=errors,
            )
            raw_derivative_path = str(derivative.get("path", ""))
            source_owners[raw_derivative_path].append(owner)
            if derivative_path is None or not derivative_path.is_file():
                continue
            if not inside_root(derivative_path, batch_path.parent):
                errors.append(
                    _message(
                        "error",
                        "generation-batch-approved-root",
                        derivative_owner,
                        "approved derivative must stay beneath its batch directory",
                    )
                )
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
                        _message(
                            "error",
                            "generation-batch-approved-image-fact",
                            derivative_owner,
                            f"{fact} records {derivative.get(fact)!r}; found {facts[fact]!r}",
                        )
                    )

        actual_output_paths = {
            posix_relative(path)
            for path in batch_path.parent.glob("*generator-original.png")
            if path.is_file()
        }
        if recorded_output_paths != actual_output_paths:
            missing = sorted(actual_output_paths - recorded_output_paths)
            absent = sorted(recorded_output_paths - actual_output_paths)
            errors.append(
                _message(
                    "error",
                    "generation-batch-output-inventory",
                    label,
                    f"unrecorded={missing}; missing={absent}",
                )
            )
        if batch.get("status") == "pending-human-review":
            warnings.append(
                _message(
                    "warning",
                    "generation-batch-pending",
                    label,
                    "source-only candidates remain pending an explicit Human batch response",
                )
            )


def validate_all() -> dict[str, Any]:
    errors: list[dict[str, str]] = []
    warnings: list[dict[str, str]] = []
    records: list[tuple[Path, dict[str, Any]]] = []
    record_ids: list[str] = []
    derivative_owners: dict[str, list[str]] = defaultdict(list)
    source_owners: dict[str, list[str]] = defaultdict(list)
    recipes: dict[str, tuple[Path, dict[str, Any]]] = {}
    reviews: dict[str, tuple[Path, dict[str, Any]]] = {}

    for required in (SCHEMA_PATH, ROOT / PROMPT_HISTORY_PATH):
        if not required.is_file():
            errors.append(_message("error", "missing-authority", posix_relative(required), "required authority is missing"))
    if SCHEMA_PATH.is_file():
        try:
            json.loads(SCHEMA_PATH.read_text(encoding="utf-8-sig"))
            record_schema_validator()
        except (OSError, json.JSONDecodeError, SchemaError) as exc:
            errors.append(_message("error", "invalid-schema-json", posix_relative(SCHEMA_PATH), str(exc)))

    recipes, reviews = _validate_recipe_and_review_documents(errors, warnings)
    _validate_generation_batch_documents(errors, warnings, source_owners)

    for record_path in canonical_record_paths():
        label = posix_relative(record_path)
        try:
            record = read_json(record_path)
        except (OSError, json.JSONDecodeError) as exc:
            errors.append(_message("error", "invalid-record-json", label, str(exc)))
            continue
        for detail in validate_record_shape(record, label):
            errors.append(_message("error", "record-shape", label, detail))
        record_id = str(record.get("recordId", ""))
        record_ids.append(record_id)
        if record_path.name != f"{record_id}.json":
            errors.append(
                _message(
                    "error",
                    "record-filename",
                    label,
                    f"filename must be {record_id}.json",
                )
            )
        records.append((record_path, record))

        sources = record.get("sources", [])
        source_paths: set[str] = set()
        if isinstance(sources, list):
            for index, entry in enumerate(sources):
                if not isinstance(entry, dict):
                    errors.append(_message("error", "source-shape", label, f"sources[{index}] must be an object"))
                    continue
                path_value = str(entry.get("path", ""))
                source_paths.add(path_value)
                source_owners[path_value].append(record_id)
                _validate_file_evidence(
                    entry,
                    owner=label,
                    field=f"sources[{index}].path",
                    errors=errors,
                )

        derivative_ids: list[str] = []
        runtime_destination_declared = False
        for index, derivative in enumerate(record.get("derivatives", [])):
            if not isinstance(derivative, dict):
                errors.append(_message("error", "derivative-shape", label, f"derivatives[{index}] must be an object"))
                continue
            derivative_ids.append(str(derivative.get("id", "")))
            path_value = str(derivative.get("path", ""))
            if path_value.startswith(("public/assets/", "src-tauri/icons/")):
                runtime_destination_declared = True
            derivative_owners[path_value].append(record_id)
            path = _validate_file_evidence(
                derivative,
                owner=label,
                field=f"derivatives[{index}].path",
                errors=errors,
            )
            if path is None or not path.is_file():
                continue
            facts = image_facts(path)
            for fact in ("width", "height", "format", "mode", "alphaMode", "decodedBytesUpperBound"):
                if derivative.get(fact) != facts[fact]:
                    errors.append(
                        _message(
                            "error",
                            "image-fact-mismatch",
                            label,
                            f"{path_value} records {fact}={derivative.get(fact)!r}; found {facts[fact]!r}",
                        )
                    )
            if facts["alphaMode"] == "straight" and not _clear_border(path):
                destination = errors if record.get("validationProfile") in {"strict-v1", "strict-v2"} else warnings
                destination.append(
                    _message(
                        "error" if destination is errors else "warning",
                        "alpha-border",
                        path_value,
                        "transparent art touches the two-pixel canvas border",
                    )
                )

        for duplicate_id, count in Counter(derivative_ids).items():
            if duplicate_id and count > 1:
                errors.append(_message("error", "duplicate-derivative-id", label, duplicate_id))

        prompt = record.get("promptEvidence", {})
        strict = record.get("validationProfile") in {"strict-v1", "strict-v2"}
        if strict and not sources:
            errors.append(_message("error", "strict-source", label, "strict records require at least one immutable source"))
        if strict and record.get("sourceStatus") != "source-backed":
            errors.append(_message("error", "strict-source-status", label, "strict profiles require sourceStatus=source-backed"))
        if isinstance(prompt, dict):
            fidelity = prompt.get("fidelity")
            exact_present = bool(prompt.get("exactPrompt") or prompt.get("promptFile"))
            if fidelity == "exact" and not exact_present:
                errors.append(_message("error", "exact-prompt-missing", label, "fidelity=exact requires exactPrompt or promptFile"))
            if exact_present and fidelity == "unknown":
                warnings.append(_message("warning", "prompt-unclassified", label, "prompt evidence exists but fidelity is unknown"))
            if record.get("approvalStatus") == "approved" and (
                fidelity != "exact" or not exact_present
            ):
                errors.append(
                    _message(
                        "error",
                        "approval-without-exact-prompt",
                        label,
                        "approved art requires fidelity=exact and exact prompt evidence",
                    )
                )
            elif strict and not exact_present:
                warnings.append(
                    _message(
                        "warning",
                        "strict-prompt-pending",
                        label,
                        "exact prompt evidence remains an explicit known unknown; approval must not be granted yet",
                    )
                )
            prompt_file = prompt.get("promptFile")
            if isinstance(prompt_file, dict):
                prompt_path = _repo_path(
                    prompt_file.get("path"),
                    owner=label,
                    field="promptEvidence.promptFile.path",
                    errors=errors,
                )
                if prompt_path is not None:
                    if not prompt_path.is_file():
                        errors.append(
                            _message(
                                "error",
                                "missing-prompt-file",
                                label,
                                str(prompt_file.get("path")),
                            )
                        )
                    elif sha256_file(prompt_path) != prompt_file.get("sha256"):
                        errors.append(
                            _message(
                                "error",
                                "prompt-file-hash",
                                label,
                                "exact prompt file SHA-256 differs from its immutable pointer",
                            )
                        )
        approval_evidence = record.get("approvalEvidence")
        if isinstance(approval_evidence, dict):
            approval_path = _repo_path(
                approval_evidence.get("evidencePath"),
                owner=label,
                field="approvalEvidence.evidencePath",
                errors=errors,
            )
            if approval_path is not None:
                if not approval_path.is_file():
                    errors.append(
                        _message("error", "missing-approval-evidence", label, str(approval_evidence.get("evidencePath")))
                    )
                elif sha256_file(approval_path) != approval_evidence.get("evidenceSha256"):
                    errors.append(
                        _message("error", "approval-evidence-hash", label, "approval evidence SHA-256 differs")
                    )

        recipe: dict[str, Any] | None = None
        review: dict[str, Any] | None = None
        if record.get("schemaVersion") == 2:
            recipe_evidence = record.get("recipeEvidence")
            if isinstance(recipe_evidence, dict):
                recipe_path = _validate_hash_pointer(
                    recipe_evidence,
                    owner=f"{label}:recipeEvidence",
                    allowed_root=RECIPE_ROOT,
                    errors=errors,
                )
                if recipe_path is not None and recipe_path.is_file():
                    try:
                        recipe = read_json(recipe_path)
                    except (OSError, json.JSONDecodeError) as exc:
                        errors.append(_message("error", "recipe-json", label, str(exc)))
                    if isinstance(recipe, dict):
                        if recipe.get("recipeId") != record.get("recipeVersion"):
                            errors.append(
                                _message(
                                    "error",
                                    "recipe-id-drift",
                                    label,
                                    "recipe evidence and recipeVersion name different recipes",
                                )
                            )
                        registered = recipes.get(str(recipe.get("recipeId", "")))
                        if registered is None or registered[0].resolve() != recipe_path.resolve():
                            errors.append(
                                _message(
                                    "error",
                                    "recipe-not-canonical",
                                    label,
                                    "recipe evidence must name the canonical recipe document",
                                )
                            )
            for run_index, run in enumerate(record.get("generationRuns", [])):
                if not isinstance(run, dict):
                    continue
                prompt_evidence = run.get("prompt")
                if isinstance(prompt_evidence, dict):
                    _validate_hash_pointer(
                        prompt_evidence,
                        owner=f"{label}:generationRuns[{run_index}].prompt",
                        allowed_root=ROOT / "docs",
                        errors=errors,
                    )
                for reference_index, reference in enumerate(run.get("references", [])):
                    if isinstance(reference, dict):
                        reference_path = _repo_path(
                            reference.get("path"),
                            owner=label,
                            field=f"generationRuns[{run_index}].references[{reference_index}].path",
                            errors=errors,
                        )
                        if reference_path is not None:
                            if not reference_path.is_file():
                                errors.append(
                                    _message(
                                        "error",
                                        "generation-reference-missing",
                                        label,
                                        str(reference.get("path")),
                                    )
                                )
                            elif reference.get("sha256") != sha256_file(reference_path):
                                errors.append(
                                    _message(
                                        "error",
                                        "generation-reference-hash",
                                        label,
                                        str(reference.get("path")),
                                    )
                                )
                for output_index, output in enumerate(run.get("outputs", [])):
                    if isinstance(output, dict):
                        output_path = _validate_file_evidence(
                            output,
                            owner=label,
                            field=f"generationRuns[{run_index}].outputs[{output_index}].path",
                            errors=errors,
                        )
                        if output_path is not None and not inside_root(output_path, ROOT / "docs" / "source-assets"):
                            errors.append(
                                _message(
                                    "error",
                                    "generation-output-root",
                                    label,
                                    "immutable generation outputs must stay under docs/source-assets",
                                )
                            )
            rendering_contract = record.get("renderingContract")
            if isinstance(rendering_contract, dict):
                review_evidence = rendering_contract.get("canaryReview")
                if isinstance(review_evidence, dict):
                    review_path = _validate_hash_pointer(
                        review_evidence,
                        owner=f"{label}:renderingContract.canaryReview",
                        allowed_root=REVIEW_ROOT,
                        errors=errors,
                    )
                    if review_path is not None and review_path.is_file():
                        try:
                            review = read_json(review_path)
                        except (OSError, json.JSONDecodeError) as exc:
                            errors.append(_message("error", "review-json", label, str(exc)))
                        if isinstance(review, dict):
                            if review.get("reviewId") != review_evidence.get("reviewId"):
                                errors.append(
                                    _message(
                                        "error",
                                        "review-id-drift",
                                        label,
                                        "review evidence and document name different review IDs",
                                    )
                                )
                            registered_review = reviews.get(str(review.get("reviewId", "")))
                            if registered_review is None or registered_review[0].resolve() != review_path.resolve():
                                errors.append(
                                    _message(
                                        "error",
                                        "review-not-canonical",
                                        label,
                                        "rendering contract must name the canonical review document",
                                    )
                                )
                            if recipe is not None and review.get("recipeSha256") != sha256_file(recipe_path):
                                errors.append(
                                    _message(
                                        "error",
                                        "review-recipe-hash",
                                        label,
                                        "review does not bind the exact recipe named by the record",
                                    )
                                )
                            gate = recipe.get("gate", {}) if recipe is not None else {}
                            if gate.get("reviewId") != review.get("reviewId") or gate.get("reviewPath") != posix_relative(review_path):
                                errors.append(
                                    _message(
                                        "error",
                                        "review-gate-drift",
                                        label,
                                        "record review differs from the recipe global gate",
                                    )
                                )

        build = record.get("build")
        if build is not None:
            if not isinstance(build, dict):
                errors.append(_message("error", "build-shape", label, "build must be an object"))
            else:
                build_source_raw = build.get("sourcePath")
                build_source = _repo_path(
                    build_source_raw,
                    owner=label,
                    field="build.sourcePath",
                    errors=errors,
                )
                if build_source is not None and not build_source.is_file():
                    errors.append(_message("error", "missing-build-source", label, str(build_source_raw)))
                if isinstance(build_source_raw, str) and build_source_raw not in source_paths:
                    errors.append(
                        _message(
                            "error",
                            "unrecorded-build-source",
                            label,
                            "build.sourcePath must reference immutable source evidence in the same record",
                        )
                    )
                extraction = build.get("backgroundExtraction")
                if isinstance(extraction, dict) and extraction.get("mode") == "seeded-checkerboard":
                    required_recipe_fields = (
                        "recipeId",
                        "maximumChroma",
                        "foregroundSeedPoints",
                        "enclosedSeedPoints",
                        "openingRadius",
                        "closingRadius",
                        "subjectGrowRadius",
                        "holeGrowRadius",
                        "maxEnclosedComponentPixels",
                    )
                    for recipe_field in required_recipe_fields:
                        if recipe_field not in extraction:
                            errors.append(
                                _message(
                                    "error",
                                    "checker-recipe-incomplete",
                                    label,
                                    f"seeded-checkerboard requires explicit {recipe_field}",
                                )
                            )
                    recipe_id = str(extraction.get("recipeId", ""))
                    maximum_chroma = extraction.get("maximumChroma")
                    threshold_match = re.search(r"(?:^|-)c(\d+)(?:-|$)", recipe_id)
                    if threshold_match and maximum_chroma != int(threshold_match.group(1)):
                        errors.append(
                            _message(
                                "error",
                                "checker-recipe-threshold",
                                label,
                                f"{recipe_id} declares C{threshold_match.group(1)} but maximumChroma={maximum_chroma!r}",
                            )
                        )
                    closing_match = re.search(r"(?:^|-)close(\d+)(?:-|$)", recipe_id)
                    if closing_match and extraction.get("closingRadius") != int(closing_match.group(1)):
                        errors.append(
                            _message(
                                "error",
                                "checker-recipe-closing",
                                label,
                                f"{recipe_id} declares close{closing_match.group(1)} but closingRadius={extraction.get('closingRadius')!r}",
                            )
                        )
                elif isinstance(extraction, dict) and extraction.get("mode") == "outer-contour-barrier":
                    required_recipe_fields = (
                        "recipeId",
                        "barrierMaximumLuminance",
                        "barrierMinimumChroma",
                        "barrierClosingRadius",
                        "exteriorTrimMinimumLuminance",
                        "exteriorTrimMaximumChroma",
                        "holeMaximumChroma",
                        "foregroundSeedPoints",
                        "enclosedSeedPoints",
                        "holeGrowRadius",
                        "maxEnclosedComponentPixels",
                    )
                    for recipe_field in required_recipe_fields:
                        if recipe_field not in extraction:
                            errors.append(
                                _message(
                                    "error",
                                    "contour-recipe-incomplete",
                                    label,
                                    f"outer-contour-barrier requires explicit {recipe_field}",
                                )
                            )
                    recipe_id = str(extraction.get("recipeId", ""))
                    encoded_parameters = (
                        (r"(?:^|-)l(\d+)(?:-|$)", "barrierMaximumLuminance"),
                        (r"(?:^|-)chroma(\d+)(?:-|$)", "barrierMinimumChroma"),
                        (r"(?:^|-)close(\d+)(?:-|$)", "barrierClosingRadius"),
                        (r"(?:^|-)trim(\d+)(?:-|$)", "exteriorTrimMinimumLuminance"),
                        (r"(?:^|-)holes-c(\d+)(?:-|$)", "holeMaximumChroma"),
                    )
                    for pattern, recipe_field in encoded_parameters:
                        match = re.search(pattern, recipe_id)
                        if match and extraction.get(recipe_field) != int(match.group(1)):
                            errors.append(
                                _message(
                                    "error",
                                    "contour-recipe-parameter",
                                    label,
                                    f"{recipe_id} encodes {recipe_field}={match.group(1)} but record has {extraction.get(recipe_field)!r}",
                                )
                            )
                registration = build.get("registration")
                if isinstance(registration, dict):
                    target_box = registration.get("targetBox")
                    if not (
                        isinstance(target_box, list)
                        and len(target_box) == 4
                        and all(isinstance(value, (int, float)) for value in target_box)
                        and 0 <= target_box[0] < target_box[2] <= 1
                        and 0 <= target_box[1] < target_box[3] <= 1
                    ):
                        errors.append(
                            _message(
                                "error",
                                "registration-target-box",
                                label,
                                "targetBox must be normalized [left, top, right, bottom]",
                            )
                        )
                profile_ids: list[str] = []
                for profile_index, profile in enumerate(build.get("profiles", [])):
                    if not isinstance(profile, dict):
                        errors.append(_message("error", "build-profile-shape", label, f"profiles[{profile_index}] must be an object"))
                        continue
                    profile_ids.append(str(profile.get("id", "")))
                    output_raw = profile.get("outputPath")
                    if isinstance(output_raw, str) and output_raw.startswith(
                        ("public/assets/", "src-tauri/icons/")
                    ):
                        runtime_destination_declared = True
                    output_path = _repo_path(
                        output_raw,
                        owner=label,
                        field=f"build.profiles[{profile_index}].outputPath",
                        errors=errors,
                    )
                    if (
                        output_path is not None
                        and record.get("approvalStatus") != "approved"
                        and not str(output_raw).startswith("artifacts/art-proofs/")
                    ):
                        errors.append(
                            _message(
                                "error",
                                "unapproved-runtime-output",
                                label,
                                "unapproved build profiles must remain under artifacts/art-proofs",
                            )
                        )
                    if output_path is not None and not str(output_raw).startswith(
                        ("artifacts/art-proofs/", "public/assets/", "src-tauri/icons/")
                    ):
                        errors.append(
                            _message(
                                "error",
                                "build-output-root",
                                label,
                                "build output must be proof-only, public runtime art, or an explicit desktop icon destination",
                            )
                        )
                    suffix = Path(str(output_raw)).suffix.lower().lstrip(".")
                    expected_suffixes = {"jpeg": {"jpg", "jpeg"}, "jpg": {"jpg", "jpeg"}}
                    allowed_suffixes = expected_suffixes.get(str(profile.get("format")), {str(profile.get("format"))})
                    if suffix not in allowed_suffixes:
                        errors.append(_message("error", "build-extension", label, f"profile {profile.get('id')} format/path disagree"))
                    if output_path is not None and output_path.is_file():
                        expected_size = (profile.get("width"), profile.get("height"))
                        try:
                            facts = image_facts(output_path)
                            if (facts["width"], facts["height"]) != expected_size:
                                errors.append(
                                    _message(
                                        "error",
                                        "build-output-dimensions",
                                        str(output_raw),
                                        f"expected {expected_size}; found {(facts['width'], facts['height'])}",
                                    )
                                )
                            max_bytes = profile.get("maxEncodedBytes")
                            if max_bytes is not None and output_path.stat().st_size > int(max_bytes):
                                errors.append(
                                    _message(
                                        "error",
                                        "build-output-budget",
                                        str(output_raw),
                                        f"{output_path.stat().st_size} bytes exceeds {int(max_bytes)}",
                                    )
                                )
                            alpha_contract = profile.get("alphaBounds")
                            if build.get("operation") == "cutout-resize":
                                if not _clear_border(output_path):
                                    errors.append(
                                        _message(
                                            "error",
                                            "build-output-alpha-border",
                                            str(output_raw),
                                            "cutout does not have a two-pixel clear border",
                                        )
                                    )
                                if isinstance(alpha_contract, dict):
                                    threshold = int(
                                        (registration or {}).get("alphaThreshold", 3)
                                    )
                                    pixels, normalized = _alpha_bounds(output_path, threshold)
                                    if normalized[1] < float(alpha_contract["minimumTop"]):
                                        errors.append(
                                            _message(
                                                "error",
                                                "build-output-alpha-top",
                                                str(output_raw),
                                                f"top={normalized[1]:.6f} is below minimum {float(alpha_contract['minimumTop']):.6f}",
                                            )
                                        )
                                    expected_bottom = round(
                                        float(alpha_contract["baseline"])
                                        * int(profile["height"])
                                    )
                                    tolerance = int(alpha_contract["baselineTolerancePixels"])
                                    if abs(pixels[3] - expected_bottom) > tolerance:
                                        errors.append(
                                            _message(
                                                "error",
                                                "build-output-baseline",
                                                str(output_raw),
                                                f"bottom={pixels[3]}px, expected {expected_bottom}±{tolerance}px",
                                            )
                                        )
                                maximum_components = profile.get("maximumAlphaComponents")
                                if maximum_components is not None:
                                    threshold = int(
                                        (registration or {}).get("alphaThreshold", 3)
                                    )
                                    with Image.open(output_path) as alpha_image:
                                        alpha_image.load()
                                        component_count = len(
                                            alpha_component_sizes(
                                                alpha_image,
                                                alpha_threshold=threshold,
                                            )
                                        )
                                    if component_count > int(maximum_components):
                                        errors.append(
                                            _message(
                                                "error",
                                                "build-output-alpha-components",
                                                str(output_raw),
                                                f"found {component_count}; maximum is {int(maximum_components)}",
                                            )
                                        )
                        except (OSError, ValueError) as exc:
                            errors.append(
                                _message("error", "build-output-invalid", str(output_raw), str(exc))
                            )
                for duplicate_id, count in Counter(profile_ids).items():
                    if duplicate_id and count > 1:
                        errors.append(_message("error", "duplicate-build-profile", label, duplicate_id))

        if runtime_destination_declared and record.get("recipeVersion") == MGJRPG_02_RECIPE_ID:
            if record.get("schemaVersion") != 2:
                errors.append(
                    _message(
                        "error",
                        "mgjrpg02-schema-gate",
                        label,
                        "runtime mgjrpg-02 art requires schemaVersion=2 and strict-v2",
                    )
                )
            elif review is None or review.get("status") != "approved":
                errors.append(
                    _message(
                        "error",
                        "mgjrpg02-canary-gate",
                        label,
                        "runtime mgjrpg-02 publication requires the global canary review status=approved",
                    )
                )

        if strict and not isinstance(record.get("geometry"), dict):
            warnings.append(_message("warning", "geometry-pending", label, "canonical geometry/registration remains pending"))
        if record.get("rights", {}).get("licenceStatus") == "pending-owner-review":
            warnings.append(_message("warning", "rights-pending", label, "rights/licence review remains explicitly pending"))
        if record.get("sourceStatus") != "source-backed":
            warnings.append(_message("warning", "legacy-source-gap", label, str(record.get("sourceStatus"))))
        if prompt.get("fidelity") == "unknown" and not strict:
            warnings.append(_message("warning", "legacy-prompt-gap", label, "exact prompt linkage is unresolved"))

    for record_id, count in Counter(record_ids).items():
        if record_id and count > 1:
            errors.append(_message("error", "duplicate-record-id", str(RECORD_ROOT), record_id))
    for derivative_path, owners in sorted(derivative_owners.items()):
        if len(owners) > 1:
            errors.append(_message("error", "duplicate-derivative-owner", derivative_path, ", ".join(sorted(owners))))

    runtime_paths = {posix_relative(path) for path in iter_runtime_images()}
    for runtime_path in sorted(runtime_paths):
        owners = derivative_owners.get(runtime_path, [])
        if len(owners) != 1:
            errors.append(_message("error", "runtime-coverage", runtime_path, f"expected one record; found {len(owners)}"))
    for source_path in iter_source_images():
        relative = posix_relative(source_path)
        if not source_owners.get(relative):
            warnings.append(_message("warning", "unreferenced-source", relative, "source image is not linked by a record"))

    catalogue_path = ROOT / "src" / "artCatalog.ts"
    if catalogue_path.is_file():
        available_record_ids = set(record_ids)
        try:
            catalogue_source_ids = _catalog_source_record_ids(catalogue_path)
        except ValueError as exc:
            errors.append(
                _message(
                    "error",
                    "catalogue-source-parser",
                    posix_relative(catalogue_path),
                    str(exc),
                )
            )
            catalogue_source_ids = []
        for source_record_id in catalogue_source_ids:
            if source_record_id not in available_record_ids:
                errors.append(
                    _message(
                        "error",
                        "catalogue-source-record",
                        posix_relative(catalogue_path),
                        f"sourceRecordId {source_record_id!r} does not resolve to a record",
                    )
                )
        warnings.append(
            _message(
                "warning",
                "catalogue-crosscheck-limited",
                posix_relative(catalogue_path),
                "sourceRecordId existence is checked, but stable ID/version/src/status matching remains covered by TypeScript tests and review rather than this validator",
            )
        )

    _validate_proof_bundle(records, errors)

    if MANIFEST_PATH.is_file() or records:
        for detail in compare_manifest():
            errors.append(_message("error", "manifest", posix_relative(MANIFEST_PATH), detail))

    errors = sorted(errors, key=lambda row: (row["path"], row["code"], row["detail"]))
    warnings = sorted(warnings, key=lambda row: (row["path"], row["code"], row["detail"]))
    warning_counts = Counter(row["code"] for row in warnings)
    return {
        "schema": "maze-art-validation/v1",
        "ok": not errors,
        "summary": {
            "recordCount": len(records),
            "runtimeImageCount": len(runtime_paths),
            "sourceImageCount": len(iter_source_images()),
            "errorCount": len(errors),
            "warningCount": len(warnings),
        },
        "errors": errors,
        "warningCounts": [
            {"code": code, "count": warning_counts[code]}
            for code in sorted(warning_counts)
        ],
        "warnings": warnings,
    }
