# Windows test builds

This folder documents convenience copies of Windows x64 artifacts staged for
local play testing. Executables are deliberately excluded from source history;
publish the current pair as GitHub Release assets when a downloadable desktop
build is wanted. Version 0.8.0 is the current verified Windows test build. Its
Tauri build, staging, portable smoke launch, source-to-stage comparison, and
hashes completed successfully on 2026-09-01.

## Current 0.8.0 test files

- `Maze-so-Puzzle-0.8.0-portable.exe` - standalone application executable,
  47,846,912 bytes. It remained running and responsive with the correct title in
  a five-second local smoke launch.
- `Maze-so-Puzzle-0.8.0-setup.exe` - NSIS installer, 41,335,529 bytes. It was
  built and staged but has not been clean-machine installed during this pass.

`SHA256SUMS.txt` contains their staged hashes plus retained 0.7.1, 0.5.1, 0.5.0,
0.4.0, 0.3.0, and 0.2.0 archive hashes. The current files include the locally
bundled soundtrack.
The staged files match their final Tauri build sources byte-for-byte.

## Older verified archive files

- `Maze-so-Puzzle-0.7.1-portable.exe`
- `Maze-so-Puzzle-0.7.1-setup.exe`

- `Maze-so-Puzzle-0.5.1-portable.exe`
- `Maze-so-Puzzle-0.5.1-setup.exe`

- `Maze-so-Puzzle-0.5.0-portable.exe`
- `Maze-so-Puzzle-0.5.0-setup.exe`

- `Maze-so-Puzzle-0.4.0-portable.exe`
- `Maze-so-Puzzle-0.4.0-setup.exe`

- `Maze-so-Puzzle-0.3.0-portable.exe`
- `Maze-so-Puzzle-0.3.0-setup.exe`

- `Maze-so-Puzzle-0.2.0-portable.exe` - standalone application executable; no
  installer is required. "Portable" describes the executable packaging, not the
  location of saved progress.
- `Maze-so-Puzzle-0.2.0-setup.exe` - NSIS installer.

## Archived files

- `Maze-so-Puzzle-0.1.0-portable.exe`
- `Maze-so-Puzzle-0.1.0-setup.exe`

## Important test-build notes

- These files are intended for Windows x64 and use the Microsoft Edge WebView2
  runtime supplied by or installed on Windows.
- The current artifacts are unsigned. Windows SmartScreen may show a warning,
  especially when a file was downloaded or copied from another computer.
- Do not bypass an unexpected warning for a file whose source or checksum you
  cannot verify.
- Saved game data belongs to the app's WebView profile; it is not stored next to
  the standalone executable.
- Rebuilding the app does not automatically refresh these convenience copies.
  They must be copied from the final Tauri output and hashed again.

Verify the current files in PowerShell with:

```powershell
Get-FileHash .\Maze-so-Puzzle-0.8.0-portable.exe -Algorithm SHA256
Get-FileHash .\Maze-so-Puzzle-0.8.0-setup.exe -Algorithm SHA256
```

Expected hashes are:

- portable: `6434B8EF5C237F34C3AF6A44743A9E4D55D291A8F15FD175DF44560471BD97FC`
- installer: `A15D88A70AE14F7FA447F740EE2783F9E7E170C61CB9A4E5F37E08F8ABFB761E`

The package is unsigned unless the owner completes code signing and repeats the
artifact tests.

For source-build commands and controls, see `..\README.md`. For the complete
verification process, see `..\docs\RELEASE_CHECKLIST.md`.
