from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path


PACKAGE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PACKAGE))

from migrate_legacy import _write_record_without_overwrite


class LegacyMigrationPublicationTests(unittest.TestCase):
    def test_exclusive_publish_never_replaces_a_racing_record(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            destination = Path(directory) / "asset-v01-source.json"
            destination.write_bytes(b"concurrent-authority")

            with self.assertRaises(FileExistsError):
                _write_record_without_overwrite(destination, b"generated-record")

            self.assertEqual(destination.read_bytes(), b"concurrent-authority")

    def test_exclusive_publish_writes_complete_payload(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            destination = Path(directory) / "asset-v01-source.json"
            _write_record_without_overwrite(destination, b"generated-record")
            self.assertEqual(destination.read_bytes(), b"generated-record")


if __name__ == "__main__":
    unittest.main()
