"""Explicit, staged, no-overwrite derivative builds."""

from __future__ import annotations

import os
import re
import tempfile
from pathlib import Path
from typing import Any

from PIL import Image

from cutout import alpha_component_sizes, normalize_to_srgb_rgba, prepare_cutout
from encode import save_image
from model import (
    MGJRPG_02_RECIPE_ID,
    PROOF_ROOT,
    RECIPE_ROOT,
    REVIEW_ROOT,
    RUNTIME_ROOT,
    ROOT,
    canonical_record_paths,
    image_facts,
    inside_root,
    posix_relative,
    read_json,
    sha256_file,
    validate_recipe_shape,
    validate_record_shape,
    validate_review_shape,
)
from periodic import make_periodic, seam_metrics


DESKTOP_RUNTIME_ROOTS = (ROOT / "src-tauri" / "icons",)


def resolve_record(identifier: str) -> tuple[Path, dict[str, Any]]:
    matches: list[tuple[Path, dict[str, Any]]] = []
    for path in canonical_record_paths():
        record = read_json(path)
        if identifier in {record.get("recordId"), record.get("id")}:
            matches.append((path, record))
    if not matches:
        raise KeyError(f"No art source record matches {identifier!r}")
    if len(matches) > 1:
        names = ", ".join(str(record.get("recordId")) for _, record in matches)
        raise KeyError(f"Art ID {identifier!r} is ambiguous; use one recordId: {names}")
    return matches[0]


def _prepare(
    source: Image.Image,
    operation: str,
    profile: dict[str, Any],
    build: dict[str, Any],
) -> Image.Image:
    # Build operations preserve or extract pixels only. Authored colour-aware
    # contours belong in the immutable source selected by a v2 generation run;
    # backgroundExtraction must never be treated as a rendering operation.
    size = (int(profile["width"]), int(profile["height"]))
    if operation == "cutout-resize":
        extraction = build.get("backgroundExtraction", {"mode": "native-alpha"})
        return prepare_cutout(
            source,
            size,
            extraction_mode=str(extraction.get("mode", "native-alpha")),
            background_rgb=extraction.get("rgb"),
            background_tolerance=int(extraction.get("tolerance", 0)),
            clear_alpha_below=int(profile.get("clearAlphaBelow", 2)),
            edge_dilation_pixels=int(profile.get("edgeDilationPixels", 4)),
            checker_maximum_chroma=int(extraction.get("maximumChroma", 45)),
            foreground_seed_points=extraction.get("foregroundSeedPoints", ((0.5, 0.5),)),
            enclosed_seed_points=extraction.get("enclosedSeedPoints", ()),
            checker_opening_radius=int(extraction.get("openingRadius", 2)),
            checker_closing_radius=int(extraction.get("closingRadius", 10)),
            checker_subject_grow_radius=int(extraction.get("subjectGrowRadius", 4)),
            checker_hole_grow_radius=int(extraction.get("holeGrowRadius", 3)),
            checker_max_enclosed_component_pixels=int(
                extraction.get("maxEnclosedComponentPixels", 2048)
            ),
            contour_barrier_maximum_luminance=int(
                extraction.get("barrierMaximumLuminance", 180)
            ),
            contour_barrier_minimum_chroma=int(
                extraction.get("barrierMinimumChroma", 10)
            ),
            contour_barrier_closing_radius=int(
                extraction.get("barrierClosingRadius", 2)
            ),
            contour_trim_minimum_luminance=int(
                extraction.get("exteriorTrimMinimumLuminance", 235)
            ),
            contour_trim_maximum_chroma=int(
                extraction.get("exteriorTrimMaximumChroma", 20)
            ),
            contour_hole_maximum_chroma=int(
                extraction.get("holeMaximumChroma", 20)
            ),
            minimum_alpha_component_pixels=int(
                profile.get("minimumAlphaComponentPixels", 1)
            ),
            registration=build.get("registration"),
        )
    if operation == "opaque-resize":
        return normalize_to_srgb_rgba(source).convert("RGB").resize(
            size,
            Image.Resampling.LANCZOS,
        )
    if operation == "periodic":
        return make_periodic(source, size)
    raise ValueError(f"Unsupported build operation: {operation}")


def _clear_border(image: Image.Image, pixels: int = 2) -> bool:
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


def alpha_bounds(image: Image.Image, threshold: int = 3) -> dict[str, list[float] | list[int]]:
    """Return inclusive-exclusive visible alpha bounds in pixels and normalized LTRB."""

    if "A" not in image.getbands():
        raise ValueError("alpha bounds require an image with an alpha channel")
    mask = image.getchannel("A").point(lambda value: 255 if value >= threshold else 0)
    bounds = mask.getbbox()
    if bounds is None:
        raise ValueError("alpha bounds found no visible pixels")
    width, height = image.size
    left, top, right, bottom = bounds
    return {
        "pixelsLTRB": [left, top, right, bottom],
        "normalizedLTRB": [
            left / width,
            top / height,
            right / width,
            bottom / height,
        ],
    }


def _validate_alpha_bounds(
    bounds: dict[str, list[float] | list[int]],
    profile: dict[str, Any],
) -> None:
    contract = profile.get("alphaBounds")
    if not isinstance(contract, dict):
        return
    pixels = bounds["pixelsLTRB"]
    normalized = bounds["normalizedLTRB"]
    assert isinstance(pixels, list) and isinstance(normalized, list)
    minimum_top = float(contract["minimumTop"])
    if float(normalized[1]) < minimum_top:
        raise ValueError(
            f"visible alpha top {float(normalized[1]):.6f} is above minimumTop "
            f"{minimum_top:.6f}"
        )
    expected_bottom = round(float(contract["baseline"]) * int(profile["height"]))
    tolerance = int(contract["baselineTolerancePixels"])
    actual_bottom = int(pixels[3])
    if abs(actual_bottom - expected_bottom) > tolerance:
        raise ValueError(
            f"visible alpha baseline {actual_bottom}px differs from expected "
            f"{expected_bottom}px by more than {tolerance}px"
        )


def _publish_without_overwrite(staged_path: Path, output_path: Path) -> None:
    """Publish a complete staged file only if the destination is absent.

    The stage directory is created beside the destination, so a hard link is
    same-volume. ``os.link`` provides the no-replace creation primitive that
    ``exists`` followed by ``os.replace`` cannot provide on Windows.
    """

    display_path = posix_relative(output_path) if inside_root(output_path) else str(output_path)
    try:
        os.link(staged_path, output_path)
    except FileExistsError as exc:
        raise FileExistsError(
            f"Refusing concurrent overwrite: {display_path}"
        ) from exc
    except OSError as exc:
        raise RuntimeError(
            "Cannot publish derivative with no-overwrite semantics via a same-volume "
            f"hard link: {display_path}: {exc}"
        ) from exc


def _validate_build_source(record: dict[str, Any], build: dict[str, Any]) -> Path:
    raw_path = str(build.get("sourcePath", ""))
    source_path = (ROOT / raw_path).resolve()
    if not inside_root(source_path) or not source_path.is_file():
        raise FileNotFoundError(
            f"Build source is missing or outside the repository: {source_path}"
        )
    evidence = [
        row for row in record.get("sources", [])
        if isinstance(row, dict) and row.get("path") == raw_path
    ]
    if len(evidence) != 1:
        raise ValueError(
            f"{record.get('recordId')}: build.sourcePath must resolve to exactly one immutable source entry"
        )
    recorded = evidence[0]
    if recorded.get("bytes") != source_path.stat().st_size:
        raise ValueError(
            f"{record.get('recordId')}: immutable build source byte count does not match"
        )
    if recorded.get("sha256") != sha256_file(source_path):
        raise ValueError(
            f"{record.get('recordId')}: immutable build source SHA-256 does not match"
        )
    return source_path


def _validate_evidence_file(
    evidence: dict[str, Any], path_field: str, hash_field: str, owner: str
) -> None:
    raw_path = evidence.get(path_field)
    if not isinstance(raw_path, str):
        raise ValueError(f"{owner}: {path_field} must be a repository-relative path")
    path = (ROOT / raw_path).resolve()
    if not inside_root(path, ROOT / "docs") or not path.is_file():
        raise ValueError(f"{owner}: evidence file is missing or outside docs: {raw_path}")
    if evidence.get(hash_field) != sha256_file(path):
        raise ValueError(f"{owner}: evidence SHA-256 differs for {raw_path}")


def _validate_hashed_file(
    *,
    raw_path: object,
    expected_hash: object,
    owner: str,
    allowed_root: Path | None = None,
    expected_bytes: object | None = None,
) -> Path:
    if not isinstance(raw_path, str) or not raw_path or "\\" in raw_path:
        raise ValueError(f"{owner}: evidence path must be repository-relative POSIX")
    path = (ROOT / raw_path).resolve()
    if not inside_root(path, ROOT) or (allowed_root is not None and not inside_root(path, allowed_root)):
        raise ValueError(f"{owner}: evidence path is outside its permitted root: {raw_path}")
    if not path.is_file():
        raise ValueError(f"{owner}: evidence file is missing: {raw_path}")
    actual_hash = sha256_file(path)
    if expected_hash != actual_hash:
        raise ValueError(f"{owner}: evidence SHA-256 differs for {raw_path}")
    if expected_bytes is not None and expected_bytes != path.stat().st_size:
        raise ValueError(f"{owner}: evidence byte count differs for {raw_path}")
    return path


def _validate_generation_runs(record: dict[str, Any]) -> None:
    if record.get("schemaVersion") != 2:
        return
    owner = str(record.get("recordId"))
    for run_index, run in enumerate(record.get("generationRuns", [])):
        run_owner = f"{owner}:generationRuns[{run_index}]"
        if run.get("lineage", {}).get("editOfEdit") is not False:
            raise ValueError(
                f"{run_owner}: edit-of-edit lineage cannot become an identity or rendering authority"
            )
        prompt = run.get("prompt", {})
        _validate_hashed_file(
            raw_path=prompt.get("path"),
            expected_hash=prompt.get("sha256"),
            owner=f"{run_owner}.prompt",
            allowed_root=ROOT / "docs",
        )
        for reference_index, reference in enumerate(run.get("references", [])):
            authoritative = reference.get("role") in {
                "edit-target",
                "identity-authority",
                "construction-authority",
                "rendering-authority",
                "family-authority",
            }
            if authoritative and reference.get("authorityKind") in {
                "runtime-comparison",
                "comparison-only",
            }:
                raise ValueError(
                    f"{run_owner}.references[{reference_index}]: comparison evidence cannot be an authority"
                )
            _validate_hashed_file(
                raw_path=reference.get("path"),
                expected_hash=reference.get("sha256"),
                owner=f"{run_owner}.references[{reference_index}]",
                allowed_root=(ROOT / "docs" / "source-assets") if authoritative else None,
            )
        for output_index, output in enumerate(run.get("outputs", [])):
            _validate_hashed_file(
                raw_path=output.get("path"),
                expected_hash=output.get("sha256"),
                expected_bytes=output.get("bytes"),
                owner=f"{run_owner}.outputs[{output_index}]",
                allowed_root=ROOT / "docs" / "source-assets",
            )


def _validate_recipe_and_global_gate(
    record: dict[str, Any],
    *,
    require_approved: bool,
) -> None:
    """Validate v2 recipe evidence and, for runtime, its global Human gate."""

    if record.get("schemaVersion") != 2:
        return
    owner = str(record.get("recordId"))
    evidence = record.get("recipeEvidence", {})
    recipe_path = _validate_hashed_file(
        raw_path=evidence.get("path"),
        expected_hash=evidence.get("sha256"),
        owner=f"{owner}:recipeEvidence",
        allowed_root=RECIPE_ROOT,
    )
    recipe = read_json(recipe_path)
    recipe_errors = validate_recipe_shape(recipe, posix_relative(recipe_path))
    if recipe_errors:
        raise ValueError("Invalid authored rendering recipe:\n" + "\n".join(recipe_errors))
    recipe_id = str(record.get("recipeVersion"))
    if recipe.get("recipeId") != recipe_id or evidence.get("recipeId") != recipe_id:
        raise ValueError(f"{owner}: recipe identity differs across record and recipe evidence")

    contract = record.get("renderingContract", {})
    if contract.get("recipeId") != recipe_id:
        raise ValueError(f"{owner}: rendering contract recipe differs from recipeVersion")
    review_evidence = contract.get("canaryReview", {})
    review_path = _validate_hashed_file(
        raw_path=review_evidence.get("path"),
        expected_hash=review_evidence.get("sha256"),
        owner=f"{owner}:renderingContract.canaryReview",
        allowed_root=REVIEW_ROOT,
    )
    review = read_json(review_path)
    review_errors = validate_review_shape(review, posix_relative(review_path))
    if review_errors:
        raise ValueError("Invalid global canary review:\n" + "\n".join(review_errors))
    gate = recipe.get("gate", {})
    if review_evidence.get("reviewId") != gate.get("reviewId"):
        raise ValueError(f"{owner}: record and recipe name different canary reviews")
    if posix_relative(review_path) != gate.get("reviewPath"):
        raise ValueError(f"{owner}: record review path differs from recipe gate")
    if review.get("recipeSha256") != sha256_file(recipe_path):
        raise ValueError(f"{owner}: review recipeSha256 differs from the immutable recipe")
    if recipe_id == MGJRPG_02_RECIPE_ID and require_approved:
        gate_failures: list[str] = []
        if recipe.get("status") != "approved":
            gate_failures.append(
                f"authored recipe status=approved; found {recipe.get('status')!r}"
            )
        if review.get("status") != "approved":
            gate_failures.append(
                f"global canary review status=approved; found {review.get('status')!r}"
            )
        if gate_failures:
            raise ValueError(
                f"{owner}: runtime publishing under {MGJRPG_02_RECIPE_ID} requires "
                "global canary review status=approved and authored recipe status=approved; "
                + "failed: "
                + "; ".join(gate_failures)
            )


def _validate_runtime_approval(record: dict[str, Any]) -> None:
    owner = str(record.get("recordId"))
    if record.get("approvalStatus") != "approved":
        raise ValueError(f"{owner}: runtime publishing requires approvalStatus=approved")
    prompt = record.get("promptEvidence")
    if not isinstance(prompt, dict) or prompt.get("fidelity") != "exact":
        raise ValueError(f"{owner}: runtime publishing requires exact prompt fidelity")
    if not prompt.get("exactPrompt") and not isinstance(prompt.get("promptFile"), dict):
        raise ValueError(f"{owner}: runtime publishing requires exact prompt evidence")
    approval = record.get("approvalEvidence")
    if not isinstance(approval, dict):
        raise ValueError(f"{owner}: runtime publishing requires named Human approval evidence")
    if not str(approval.get("approvedBy", "")).strip():
        raise ValueError(f"{owner}: runtime publishing requires a named approvedBy reviewer")
    if approval.get("scope") != "runtime-publish":
        raise ValueError(f"{owner}: approval evidence must cover runtime-publish")
    _validate_evidence_file(approval, "evidencePath", "evidenceSha256", owner)
    rights = record.get("rights")
    if not isinstance(rights, dict) or rights.get("licenceStatus") != "reviewed":
        raise ValueError(f"{owner}: runtime publishing requires rights.licenceStatus=reviewed")
    if not str(rights.get("reviewedBy", "")).strip():
        raise ValueError(f"{owner}: runtime publishing requires a named rights reviewer")
    if record.get("recipeVersion") == MGJRPG_02_RECIPE_ID and record.get("schemaVersion") != 2:
        raise ValueError(
            f"{owner}: runtime publishing under {MGJRPG_02_RECIPE_ID} requires "
            "schemaVersion=2 and validationProfile=strict-v2"
        )
    _validate_recipe_and_global_gate(record, require_approved=True)


def _validate_output_policy(record: dict[str, Any], output_path: Path) -> None:
    if inside_root(output_path, PROOF_ROOT):
        return
    permitted_runtime_root = inside_root(output_path, RUNTIME_ROOT) or any(
        inside_root(output_path, root) for root in DESKTOP_RUNTIME_ROOTS
    )
    if not permitted_runtime_root:
        raise ValueError(
            "Build outputs are restricted to artifacts/art-proofs, public/assets, "
            f"or src-tauri/icons: {posix_relative(output_path)}"
        )
    _validate_runtime_approval(record)


def _validate_mgjrpg02_staged_pixels(
    record: dict[str, Any],
    build: dict[str, Any],
    image: Image.Image,
) -> None:
    """Enforce objective mgjrpg-02 pixel invariants before publication.

    Local contour hue, material judgement, and visual continuity remain Human
    proof gates. Exact black and terrain alpha/operation class are deterministic
    invariants and therefore fail the staged build rather than becoming review
    warnings.
    """

    if record.get("recipeVersion") != MGJRPG_02_RECIPE_ID:
        return
    rgba = image.convert("RGBA")
    colours = rgba.getcolors(maxcolors=rgba.width * rgba.height)
    if colours is None:  # pragma: no cover - maxcolors equals the pixel count
        raise ValueError("could not inspect staged mgjrpg-02 pixel colours")
    if any(
        red == 0 and green == 0 and blue == 0 and alpha > 0
        for _count, (red, green, blue, alpha) in colours
    ):
        raise ValueError(
            "mgjrpg-02 forbids visible exact #000000 pixels; use a declared "
            "Maze ink-plum or material-local contour token"
        )

    contract = record.get("renderingContract", {})
    if isinstance(contract, dict) and contract.get("treatmentClass") == "terrain-boundary":
        operation = build.get("operation")
        if operation not in {"periodic", "opaque-resize"}:
            raise ValueError(
                "mgjrpg-02 terrain-boundary outputs require periodic or opaque-resize "
                "builds; alpha cutout operations can create a forbidden actor-like enclosure"
            )
        if rgba.getchannel("A").getextrema() != (255, 255):
            raise ValueError("mgjrpg-02 terrain-boundary outputs must be fully opaque")


def _preflight_record(record_path: Path, record: dict[str, Any]) -> None:
    errors = validate_record_shape(record, posix_relative(record_path))
    if errors:
        raise ValueError("Record/schema preflight failed:\n" + "\n".join(errors))
    if record_path.name != f"{record.get('recordId')}.json":
        raise ValueError(f"{posix_relative(record_path)}: filename/recordId mismatch")
    extraction = record.get("build", {}).get("backgroundExtraction", {})
    if isinstance(extraction, dict):
        recipe_id = str(extraction.get("recipeId", ""))
        encoded_fields: tuple[tuple[str, str], ...] = ()
        if extraction.get("mode") == "seeded-checkerboard":
            encoded_fields = (
                (r"(?:^|-)c(\d+)(?:-|$)", "maximumChroma"),
                (r"(?:^|-)close(\d+)(?:-|$)", "closingRadius"),
            )
        elif extraction.get("mode") == "outer-contour-barrier":
            encoded_fields = (
                (r"(?:^|-)l(\d+)(?:-|$)", "barrierMaximumLuminance"),
                (r"(?:^|-)chroma(\d+)(?:-|$)", "barrierMinimumChroma"),
                (r"(?:^|-)close(\d+)(?:-|$)", "barrierClosingRadius"),
                (r"(?:^|-)trim(\d+)(?:-|$)", "exteriorTrimMinimumLuminance"),
                (r"(?:^|-)holes-c(\d+)(?:-|$)", "holeMaximumChroma"),
            )
        for pattern, field in encoded_fields:
            match = re.search(pattern, recipe_id)
            if match and extraction.get(field) != int(match.group(1)):
                raise ValueError(
                    f"{record.get('recordId')}: extraction recipeId {recipe_id!r} encodes "
                    f"{field}={match.group(1)} but the field is {extraction.get(field)!r}"
                )
    prompt_file = record.get("promptEvidence", {}).get("promptFile")
    if isinstance(prompt_file, dict):
        _validate_evidence_file(prompt_file, "path", "sha256", str(record["recordId"]))
    _validate_generation_runs(record)
    _validate_recipe_and_global_gate(record, require_approved=False)


def build_record(
    identifier: str,
    *,
    selected_profiles: list[str] | None = None,
) -> list[dict[str, Any]]:
    record_path, record = resolve_record(identifier)
    _preflight_record(record_path, record)
    build = record.get("build")
    if not isinstance(build, dict):
        raise ValueError(f"{record.get('recordId')}: no build recipe is recorded")
    source_path = _validate_build_source(record, build)
    profiles = list(build.get("profiles", []))
    if selected_profiles:
        requested = set(selected_profiles)
        profiles = [profile for profile in profiles if profile.get("id") in requested]
        missing = requested - {str(profile.get("id")) for profile in profiles}
        if missing:
            raise KeyError(f"Unknown build profiles: {', '.join(sorted(missing))}")
    if not profiles:
        raise ValueError(f"{record.get('recordId')}: no build profiles selected")

    output_paths: list[Path] = []
    for profile in profiles:
        output_path = (ROOT / str(profile["outputPath"])).resolve()
        if not inside_root(output_path):
            raise ValueError(f"Output escapes the repository: {output_path}")
        _validate_output_policy(record, output_path)
        if output_path.exists():
            raise FileExistsError(
                f"Refusing to overwrite existing derivative: {posix_relative(output_path)}"
            )
        output_paths.append(output_path)
    if len(set(output_paths)) != len(output_paths):
        raise ValueError("Selected build profiles resolve to duplicate output paths")

    reports: list[dict[str, Any]] = []
    for profile, output_path in zip(profiles, output_paths, strict=True):
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with tempfile.TemporaryDirectory(prefix=".art-stage-", dir=output_path.parent) as stage:
            staged_path = Path(stage) / output_path.name
            with Image.open(source_path) as source:
                prepared = _prepare(source, str(build["operation"]), profile, build)
            encoder = save_image(
                prepared,
                staged_path,
                str(profile["format"]),
                dict(profile.get("encoder", {}).get("options", {})),
            )
            with Image.open(staged_path) as decoded:
                decoded.load()
                bounds: dict[str, list[float] | list[int]] | None = None
                if decoded.size != (int(profile["width"]), int(profile["height"])):
                    raise ValueError(f"Encoded derivative has unexpected dimensions: {decoded.size}")
                _validate_mgjrpg02_staged_pixels(record, build, decoded)
                if build["operation"] == "cutout-resize":
                    if "A" not in decoded.getbands() or decoded.getchannel("A").getextrema()[0] != 0:
                        raise ValueError("Cutout derivative has no transparent pixels")
                    if not _clear_border(decoded):
                        raise ValueError("Cutout derivative does not have a two-pixel clear border")
                    bounds = alpha_bounds(
                        decoded,
                        int(build.get("registration", {}).get("alphaThreshold", 3)),
                    )
                    _validate_alpha_bounds(bounds, profile)
                    component_sizes = alpha_component_sizes(
                        decoded,
                        alpha_threshold=int(
                            build.get("registration", {}).get("alphaThreshold", 3)
                        ),
                    )
                    maximum_components = profile.get("maximumAlphaComponents")
                    if maximum_components is not None and len(component_sizes) > int(maximum_components):
                        raise ValueError(
                            f"cutout has {len(component_sizes)} visible alpha components; "
                            f"profile maximum is {int(maximum_components)}"
                        )
                if build["operation"] == "periodic":
                    metrics = seam_metrics(decoded)
                    if not metrics["passed"]:
                        raise ValueError(f"Periodic derivative failed seam validation: {metrics}")
            staged_bytes = staged_path.stat().st_size
            max_encoded_bytes = profile.get("maxEncodedBytes")
            if max_encoded_bytes is not None and staged_bytes > int(max_encoded_bytes):
                raise ValueError(
                    f"Encoded derivative is {staged_bytes} bytes; profile budget is "
                    f"{int(max_encoded_bytes)} bytes"
                )
            _publish_without_overwrite(staged_path, output_path)
        facts = image_facts(output_path)
        reports.append(
            {
                "recordPath": posix_relative(record_path),
                "recordId": record["recordId"],
                "recordSha256": sha256_file(record_path),
                "artRecipeVersion": record["recipeVersion"],
                "derivativeRecipeVersion": record.get("derivativeRecipeVersion"),
                "profile": profile["id"],
                "sourcePath": posix_relative(source_path),
                "outputPath": posix_relative(output_path),
                "sha256": sha256_file(output_path),
                "bytes": output_path.stat().st_size,
                **facts,
                "encoder": encoder,
                **({"alphaBounds": bounds} if bounds is not None else {}),
                **({"alphaComponentSizes": component_sizes} if bounds is not None else {}),
                **(
                    {"maxEncodedBytes": int(profile["maxEncodedBytes"])}
                    if profile.get("maxEncodedBytes") is not None
                    else {}
                ),
            }
        )
    return reports
