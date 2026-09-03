"""Materialise a truthful generation-batch record from a compact checked-in ledger.

The ledger preserves human-authored claims (prompt IDs, ordered reference roles,
generator output IDs and dispositions).  This command supplies only mechanical
facts: hashes, encoded bytes, image dimensions/modes and aggregate counts.
It never edits generator originals or grants approval by itself.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

from PIL import Image


ROOT = Path(__file__).resolve().parents[2]


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _path(value: str) -> Path:
    path = (ROOT / value).resolve()
    try:
        path.relative_to(ROOT.resolve())
    except ValueError as exc:
        raise ValueError(f"path escapes repository: {value}") from exc
    return path


def _file_evidence(value: dict[str, Any]) -> dict[str, Any]:
    path = _path(str(value["path"]))
    if not path.is_file():
        raise FileNotFoundError(path)
    return {
        **value,
        "sha256": _sha256(path),
        "bytes": path.stat().st_size,
    }


def _image_evidence(value: dict[str, Any]) -> dict[str, Any]:
    evidence = _file_evidence(value)
    path = _path(str(value["path"]))
    with Image.open(path) as opened:
        opened.load()
        width, height = opened.size
        mode = opened.mode
        file_format = (opened.format or path.suffix.lstrip(".")).lower()
        if "A" in opened.getbands():
            alpha = opened.getchannel("A")
            alpha_mode = "straight" if alpha.getextrema() != (255, 255) else "opaque"
        else:
            alpha_mode = "opaque"
    return {
        **evidence,
        "width": width,
        "height": height,
        "format": file_format,
        "mode": mode,
        "alphaMode": alpha_mode,
        "decodedBytesUpperBound": width * height * 4,
    }


def _prompt_map(session_log: Path) -> dict[str, str]:
    prompts: dict[str, str] = {}
    with session_log.open("r", encoding="utf-8") as handle:
        for line in handle:
            try:
                event = json.loads(line)
            except json.JSONDecodeError:
                continue
            item = event.get("payload", {}).get("item", {})
            if (
                item.get("type") == "Extension"
                and item.get("kind") == "image_gen.generation"
                and isinstance(item.get("id"), str)
                and isinstance(item.get("revisedPrompt"), str)
            ):
                prompts[f"{item['id']}.png"] = item["revisedPrompt"]
    return prompts


def write_prompts(ledger_path: Path, session_log: Path) -> Path:
    ledger = json.loads(ledger_path.read_text(encoding="utf-8-sig"))
    prompts = _prompt_map(session_log)
    blocks = [
        "# Exact ImageGen prompts",
        "",
        "These blocks are copied verbatim from the local Codex generation event's `revisedPrompt` field and keyed by the immutable generator output ID. They are historical evidence; append a new block for a new run and never rewrite an old one.",
        "",
    ]
    for run in ledger["runs"]:
        output_id = run["output"]["outputId"]
        prompt = prompts.get(output_id)
        if prompt is None:
            raise KeyError(f"no transcript prompt for {output_id}")
        blocks.extend(
            [
                f"## `{run['promptBlockId']}`",
                "",
                f"Generator output: `{output_id}`",
                "",
                "```text",
                prompt,
                "```",
                "",
            ]
        )
    output = ledger_path.parent / "PROMPTS.md"
    output.write_text("\n".join(blocks), encoding="utf-8", newline="\n")
    return output


def build(ledger_path: Path) -> dict[str, Any]:
    ledger = json.loads(ledger_path.read_text(encoding="utf-8-sig"))
    if ledger.get("schema") != "maze-art-generation-ledger/v1":
        raise ValueError("unsupported generation ledger schema")

    references = {
        reference_id: _file_evidence(value)
        for reference_id, value in ledger["referenceRegistry"].items()
    }
    runs: list[dict[str, Any]] = []
    for raw in ledger["runs"]:
        run = {**ledger.get("runDefaults", {}), **raw}
        if "referencePattern" in ledger and "orderedReferences" not in run:
            run["orderedReferences"] = [
                {
                    "order": index,
                    "referenceId": str(reference["referenceId"]).format(**run),
                    "role": reference["role"],
                }
                for index, reference in enumerate(ledger["referencePattern"], start=1)
            ]
        run.pop("identityReferenceId", None)
        runs.append({**run, "output": _image_evidence(run["output"])})

    dispositions: dict[str, int] = {}
    for run in runs:
        status = run["disposition"]["status"]
        dispositions[status] = dispositions.get(status, 0) + 1

    counts = {
        "runCount": len(runs),
        "rejectedBackgroundInvalidCount": dispositions.get("rejected-background-invalid", 0),
        "pendingHumanCandidateCount": dispositions.get("pending-human-batch-review", 0),
        "humanApprovedSourceCount": dispositions.get("human-approved-source", 0),
        "humanRejectedSourceCount": dispositions.get("human-rejected-source", 0),
        "artDirectorRejectedSourceCount": dispositions.get("art-director-rejected-source", 0),
        "generatorOriginalEncodedBytes": sum(run["output"]["bytes"] for run in runs),
        "generatorOriginalDecodedBytesUpperBound": sum(
            run["output"]["decodedBytesUpperBound"] for run in runs
        ),
    }

    report = {
        key: value
        for key, value in ledger.items()
        if key not in {"schema", "referenceRegistry", "runs", "approvedDerivatives"}
    }
    report.update(
        {
            "schema": "maze-art-generation-batch/v1",
            "recipeEvidence": _file_evidence(ledger["recipeEvidence"]),
            "decisionEvidence": _file_evidence(ledger["decisionEvidence"]),
            "promptFile": _file_evidence(ledger["promptFile"]),
            "referenceRegistry": references,
            "runs": runs,
            "counts": counts,
        }
    )
    report.pop("runDefaults", None)
    report.pop("referencePattern", None)
    if "approvedDerivatives" in ledger:
        report["approvedDerivatives"] = [
            _image_evidence(value) for value in ledger["approvedDerivatives"]
        ]
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("ledger", type=Path)
    parser.add_argument("--write", action="store_true")
    parser.add_argument("--session-log", type=Path)
    args = parser.parse_args()
    ledger_path = args.ledger.resolve()
    if args.write and args.session_log:
        write_prompts(ledger_path, args.session_log.resolve())
    report = build(ledger_path)
    output = ledger_path.parent / "run-record.json"
    if args.write:
        output.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(json.dumps({"ok": True, "write": args.write, "output": str(output), "counts": report["counts"]}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
