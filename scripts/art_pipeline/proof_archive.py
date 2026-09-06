"""Preserve/restore the mandatory approved v14 packet without regenerating it.

Archive creation verifies the existing approval and its index first. Restoration
checks every member before writing anything, never replaces differing local data,
and has no network or runtime dependency.
"""
from __future__ import annotations

import argparse
import hashlib
import io
import json
import os
import stat
import tempfile
import zipfile
from pathlib import Path, PurePosixPath

from model import ROOT, json_bytes, read_json, sha256_file

PACKET = "artifacts/art-proofs/mgjrpg-02/v14"
REVIEW = "docs/source-assets/reviews/mgjrpg-02-canary-v01.json"
ARCHIVE = "docs/source-assets/evidence/mgjrpg02-v14-approved-proof.zip"
RECEIPT = "docs/source-assets/evidence/mgjrpg02-v14-approved-proof.json"


def packet_bindings(index: dict, prefix: str) -> dict[str, dict]:
    bindings = {}
    def visit(value):
        if isinstance(value, dict):
            path = value.get("path")
            if isinstance(path, str) and path.startswith(prefix + "/") and "sha256" in value and "bytes" in value:
                fact = {key: value[key] for key in ("path", "sha256", "bytes")}
                if path in bindings and bindings[path] != fact:
                    raise ValueError(f"Conflicting approved binding: {path}")
                bindings[path] = fact
            for item in value.values():
                visit(item)
        elif isinstance(value, list):
            for item in value:
                visit(item)
    visit(index)
    return bindings


def verify_bytes(payload: bytes, fact: dict) -> None:
    if len(payload) != fact["bytes"] or hashlib.sha256(payload).hexdigest() != fact["sha256"]:
        raise ValueError(f"Exact bytes differ: {fact['path']}")


def write_immutable(path: Path, payload: bytes) -> None:
    """Atomically install each file; resume an interrupted two-file publication."""
    if path.exists():
        if path.read_bytes() != payload:
            raise FileExistsError(f"Preserving different archive evidence: {path}")
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=path.parent, prefix='.proof-archive-', delete=False) as stream:
        temporary = Path(stream.name)
        stream.write(payload)
        stream.flush()
        os.fsync(stream.fileno())
    try:
        # Atomic and fails if another file already occupies the exact target.
        os.link(temporary, path)
    finally:
        temporary.unlink()


def approved_files(root: Path) -> dict[str, dict]:
    review = read_json(root / REVIEW)
    index_path = PACKET + "/proof-index.json"
    rows = [row for row in review["evidence"] if row["path"] == index_path]
    if len(rows) != 1:
        raise ValueError("Approval must bind exactly one v14 index")
    payload = (root / index_path).read_bytes()
    verify_bytes(payload, rows[0])
    return {index_path: rows[0], **packet_bindings(json.loads(payload), PACKET)}


def pack(root: Path = ROOT) -> dict:
    archive, receipt_path = root / ARCHIVE, root / RECEIPT
    bindings = approved_files(root)
    actual = {(PACKET + "/" + path.relative_to(root / PACKET).as_posix()) for path in (root / PACKET).rglob("*") if path.is_file()}
    if actual != set(bindings):
        raise ValueError(f"Packet inventory differs from approval: {sorted(actual ^ set(bindings))}")
    for path, fact in bindings.items():
        verify_bytes((root / path).read_bytes(), fact)
    archive.parent.mkdir(parents=True, exist_ok=True)
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as bundle:
        for path in sorted(bindings):
            info = zipfile.ZipInfo(path, date_time=(2026, 9, 3, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = (stat.S_IFREG | 0o644) << 16
            bundle.writestr(info, (root / path).read_bytes(), compresslevel=9)
    write_immutable(archive, buffer.getvalue())
    receipt = {
        "schema": "maze-approved-proof-archive/v1",
        "archive": {"path": ARCHIVE, "sha256": sha256_file(archive), "bytes": archive.stat().st_size},
        "approval": {"path": REVIEW, "sha256": sha256_file(root / REVIEW), "bytes": (root / REVIEW).stat().st_size},
        "packetRoot": PACKET,
        "method": "Exact existing approved bytes; no proof regeneration, EOL conversion or approval changes. ZIP timestamp is a reproducibility constant, not evidence of file creation time.",
        "files": [bindings[path] for path in sorted(bindings)],
    }
    write_immutable(receipt_path, json_bytes(receipt))
    return {"ok": True, "archive": receipt["archive"], "files": len(bindings)}


def restore_archive(root: Path, receipt: dict, *, write: bool) -> dict:
    if receipt.get('schema') != 'maze-approved-proof-archive/v1':
        raise ValueError('Unsupported proof archive receipt schema')
    if receipt.get("packetRoot") != PACKET:
        raise ValueError("Only the approved v14 packet may be restored")
    archive = root / ARCHIVE
    if receipt["archive"]["path"] != ARCHIVE or receipt["approval"]["path"] != REVIEW:
        raise ValueError("Archive/approval paths differ from the fixed contract")
    verify_bytes(archive.read_bytes(), receipt["archive"])
    verify_bytes((root / REVIEW).read_bytes(), receipt["approval"])
    facts = {fact["path"]: fact for fact in receipt["files"]}
    if len(facts) != len(receipt["files"]):
        raise ValueError("Duplicate archive receipt path")
    payloads = {}
    with zipfile.ZipFile(archive) as bundle:
        if len(bundle.namelist()) != len(facts) or set(bundle.namelist()) != set(facts):
            raise ValueError("Archive inventory differs from receipt")
        for info in bundle.infolist():
            name = PurePosixPath(info.filename)
            target = root / info.filename
            if "\\" in info.filename or name.is_absolute() or ".." in name.parts or not info.filename.startswith(PACKET + "/") or not target.resolve().is_relative_to((root / PACKET).resolve()) or not (root / PACKET).resolve().is_relative_to(root.resolve()):
                raise ValueError(f"Archive path escapes packet: {info.filename}")
            if stat.S_ISLNK(info.external_attr >> 16) or info.file_size != facts[info.filename]["bytes"]:
                raise ValueError(f"Unexpected archive member: {info.filename}")
            payload = bundle.read(info)
            verify_bytes(payload, facts[info.filename])
            payloads[info.filename] = payload
    # The original approval, not merely the new receipt, authenticates the index
    # and all transitive children. A replaced receipt cannot rebind old art.
    review = read_json(root / REVIEW)
    index_name = PACKET + "/proof-index.json"
    index_fact = next(row for row in review["evidence"] if row["path"] == index_name)
    verify_bytes(payloads[index_name], index_fact)
    bound = {index_name: index_fact, **packet_bindings(json.loads(payloads[index_name]), PACKET)}
    if set(bound) != set(facts):
        raise ValueError("Archive content differs from approved transitive inventory")
    for name, payload in payloads.items():
        verify_bytes(payload, bound[name])
        target = root / name
        if target.exists() and (not target.is_file() or target.read_bytes() != payload):
            raise FileExistsError(f"Preserving differing local evidence: {name}")
    missing = [name for name in sorted(payloads) if not (root / name).exists()]
    if write:
        for name in missing:
            target = root / name
            target.parent.mkdir(parents=True, exist_ok=True)
            with target.open("xb") as stream:
                stream.write(payloads[name])
    return {"ok": True, "filesVerified": len(facts), "scope": "Only approval-bound files; unrelated existing files are neither validated nor removed", "missing": missing, "restored": len(missing) if write else 0, "runtimeWrites": 0}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    action = parser.add_mutually_exclusive_group(required=True)
    action.add_argument("--pack", action="store_true")
    action.add_argument("--check", action="store_true")
    action.add_argument("--restore", action="store_true")
    args = parser.parse_args()
    try:
        result = pack() if args.pack else restore_archive(ROOT, read_json(ROOT / RECEIPT), write=args.restore)
        print(json.dumps(result, indent=2))
    except (OSError, ValueError, KeyError, StopIteration, zipfile.BadZipFile) as exc:
        print(json.dumps({"ok": False, "error": str(exc)}, indent=2))
        raise SystemExit(1)


if __name__ == "__main__":
    main()
