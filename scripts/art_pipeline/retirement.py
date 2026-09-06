"""Exact, Human-authorized delivery tombstones; never a generic missing-file waiver."""

from __future__ import annotations

import re
from pathlib import Path
from typing import Any

from jsonschema import Draft202012Validator

from model import ROOT, read_json

RETIREMENT_ROOT = Path("docs/source-assets/retirement")
RECEIPT_NAME = "early-assets-2026-09-06.json"
EARLY_STATE = "retired-early-delivery"


def derivative_matches(record: dict, derivative: dict, tombstones: dict) -> bool:
    row = tombstones.get(derivative.get("path"))
    return bool(
        row
        and record.get("runtimeStatus") == "superseded"
        and derivative.get("runtimeStatus") == "superseded"
        and record.get("recordId") == row["recordId"]
        and all(derivative.get(key) == row[key] for key in (
            "path", "sha256", "bytes", "width", "height", "decodedBytesUpperBound"
        ))
    )


def load_retirements(root: Path = ROOT, *, require_absent: bool = True) -> dict[str, dict[str, Any]]:
    """Join receipt, ledger and source records. Malformed/mismatched authority fails closed.

    Git history is not fetched by validation: CI may be shallow. The receipt
    records the local pre-removal blob restore verification; full history or the
    Human's external backup is needed to restore historical delivery bytes.
    """
    directory = root / RETIREMENT_ROOT
    receipt = read_json(directory / RECEIPT_NAME)
    ledger = read_json(directory / "asset-retirement-ledger.json")
    schema = read_json(directory / "asset-retirement-ledger.schema.json")
    schema_errors = list(Draft202012Validator(schema).iter_errors(ledger))
    if schema_errors:
        raise ValueError(f"Retirement ledger schema: {schema_errors[0].message}")
    if receipt.get("schema") != "maze-delivery-retirement/v1" or receipt.get("batchId") != "early-assets-2026-09-06":
        raise ValueError("Unrecognized retirement batch")
    authorization = receipt.get("authorization", {})
    if authorization.get("humanConfirmedWholeRepoBackup") is not True or authorization.get("directDeletionApproved") is not True:
        raise ValueError("Retirement requires recorded Human backup/deletion approval")
    approval = authorization.get("approvalRecord")
    if approval != "docs/reviews/2026-09-06-early-asset-cleanup.md" or not (root / approval).is_file():
        raise ValueError("Missing retirement approval record")
    if not re.fullmatch(r"[0-9a-f]{40}", str(receipt.get("restoreCommit", ""))):
        raise ValueError("Invalid retirement restore commit")
    rows = receipt.get("entries", [])
    tombstones = {row["path"]: row for row in rows}
    ledger_rows = {row["assetPath"]: row for row in ledger["entries"] if row["state"] == EARLY_STATE}
    if len(rows) != len(tombstones) or set(tombstones) != set(ledger_rows):
        raise ValueError("Duplicate retirement or receipt/ledger mismatch")
    if receipt["totals"]["removedCount"] != len(rows) or receipt["totals"]["removedBytes"] != sum(row["bytes"] for row in rows):
        raise ValueError("Retirement totals differ")
    for path, row in tombstones.items():
        entry = ledger_rows[path]
        if not re.fullmatch(r"public/assets/[A-Za-z0-9._/-]+", path) or ".." in Path(path).parts:
            raise ValueError(f"Invalid retirement path: {path}")
        target = (root / path).resolve()
        if not target.is_relative_to((root / "public/assets").resolve()):
            raise ValueError(f"Retirement path escapes assets: {path}")
        if require_absent and target.exists():
            raise ValueError(f"Retired delivery bytes reappeared: {path}")
        if entry.get("earlyRetirement") != RECEIPT_NAME or row.get("gitBlobRestoreVerified") is not True:
            raise ValueError(f"Unverified retirement: {path}")
        for key in ("sha256", "bytes", "width", "height", "decodedBytesUpperBound", "replacementPaths"):
            if entry[key] != row[key]:
                raise ValueError(f"Retirement {key} differs: {path}")
        if not re.fullmatch(r"[0-9a-f]{64}", row["sha256"]):
            raise ValueError(f"Invalid retirement hash: {path}")
        record_path = root / entry["preservation"]["sourceRecordPath"]
        record = read_json(record_path)
        matches = [derivative for derivative in record["derivatives"] if derivative.get("path") == path]
        if len(matches) != 1 or not derivative_matches(record, matches[0], tombstones):
            raise ValueError(f"Retirement source-record ownership/hash differs: {path}")
        if not row["replacementPaths"] or any(not (root / replacement).is_file() for replacement in row["replacementPaths"]):
            raise ValueError(f"Retirement replacement missing: {path}")
    return tombstones


def previous_delivery_metadata(path: Path, tombstones: dict) -> tuple[str, int]:
    """Historical publisher rollback metadata, without restoring obsolete shipping bytes."""
    from model import posix_relative, sha256_file

    if path.is_file():
        return sha256_file(path), path.stat().st_size
    row = tombstones.get(posix_relative(path))
    if row is None:
        raise FileNotFoundError(f"Missing, non-retired historical asset: {path}")
    return row["sha256"], row["bytes"]
