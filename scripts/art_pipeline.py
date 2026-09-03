"""Stable repository entry point for the versioned art pipeline."""

from __future__ import annotations

import sys
from pathlib import Path


PIPELINE_PACKAGE = Path(__file__).resolve().parent / "art_pipeline"
sys.path.insert(0, str(PIPELINE_PACKAGE))

from cli import main  # noqa: E402


if __name__ == "__main__":
    raise SystemExit(main())
