"""Command-line contract for the reusable Art Bible raster pipeline."""

from __future__ import annotations

import argparse
import json
import sys
from typing import Any

from builder import build_record
from manifest import build_manifest, compare_manifest, write_manifest
from mgjrpg02 import generate_mgjrpg02_proofs
from mgjrpg02_options import generate_mgjrpg02_options
from mgjrpg02_selection import generate_mgjrpg02_selection
from migrate_legacy import migrate_legacy
from proofs import generate_canary_proofs
from validate import validate_all


def _print(value: Any) -> None:
    print(json.dumps(value, indent=2, ensure_ascii=False))


def parser() -> argparse.ArgumentParser:
    command = argparse.ArgumentParser(
        description="Deterministic, provenance-first art inventory and derivative pipeline."
    )
    action = command.add_mutually_exclusive_group(required=True)
    action.add_argument("--check", action="store_true", help="validate without writing files")
    action.add_argument("--manifest", action="store_true", help="inspect or explicitly write the generated manifest")
    action.add_argument(
        "--proof",
        choices=(
            "canary",
            "mgjrpg-02-canary",
            "mgjrpg-02-options",
            "mgjrpg-02-selection",
        ),
        help="write review proofs below the ignored proof root",
    )
    action.add_argument("--build", action="store_true", help="build selected profiles for one explicit art ID")
    action.add_argument("--migrate-legacy", action="store_true", help="plan or explicitly write one legacy record per runtime image")
    command.add_argument("--write", action="store_true", help="allow manifest or legacy-record writes")
    command.add_argument("--id", help="recordId or unambiguous stable ID for --build")
    command.add_argument("--profile", action="append", default=[], help="build profile ID; repeat for multiple profiles")
    return command


def main(argv: list[str] | None = None) -> int:
    arguments = parser().parse_args(argv)
    try:
        if arguments.check:
            if arguments.write or arguments.id or arguments.profile:
                raise ValueError("--check is non-writing and accepts no --write/--id/--profile options")
            report = validate_all()
            concise_report = {
                key: value
                for key, value in report.items()
                if key != "warnings"
            }
            concise_report["actionableWarnings"] = [
                warning
                for warning in report["warnings"]
                if warning["code"]
                not in {"legacy-prompt-gap", "legacy-source-gap", "rights-pending"}
            ]
            concise_report["suppressedHistoricalWarningCount"] = (
                len(report["warnings"]) - len(concise_report["actionableWarnings"])
            )
            _print(concise_report)
            return 0 if report["ok"] else 1

        if arguments.manifest:
            if arguments.id or arguments.profile:
                raise ValueError("--manifest accepts no --id/--profile options")
            if arguments.write:
                manifest = write_manifest()
                _print({"ok": True, "wrote": "docs/source-assets/manifest.json", "summary": manifest["summary"]})
                return 0
            manifest, errors = build_manifest()
            drift = compare_manifest()
            _print({"ok": not errors and not drift, "writeRequired": bool(drift), "errors": errors, "drift": drift, "summary": manifest["summary"]})
            return 0 if not errors and not drift else 1

        if arguments.migrate_legacy:
            if arguments.id or arguments.profile:
                raise ValueError("--migrate-legacy accepts no --id/--profile options")
            count, paths = migrate_legacy(write=arguments.write)
            _print({"ok": True, "write": arguments.write, "recordCount": count, "paths": paths})
            return 0

        if arguments.proof:
            if arguments.write or arguments.id or arguments.profile:
                raise ValueError("--proof accepts no --write/--id/--profile options")
            if arguments.proof == "mgjrpg-02-canary":
                proof = generate_mgjrpg02_proofs()
            elif arguments.proof == "mgjrpg-02-selection":
                proof = generate_mgjrpg02_selection()
            elif arguments.proof == "mgjrpg-02-options":
                proof = generate_mgjrpg02_options()
            else:
                proof = generate_canary_proofs()
            _print({"ok": True, **proof})
            return 0

        if arguments.build:
            if arguments.write:
                raise ValueError("--build is already an explicit staged write; do not pass --write")
            if not arguments.id:
                raise ValueError("--build requires an explicit --id")
            _print({"ok": True, "outputs": build_record(arguments.id, selected_profiles=arguments.profile or None)})
            return 0
    except (FileExistsError, FileNotFoundError, KeyError, RuntimeError, ValueError) as exc:
        _print({"ok": False, "error": str(exc)})
        return 1
    return 2


if __name__ == "__main__":
    sys.exit(main())
