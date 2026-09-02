# Windows test builds

This folder documents convenience copies of Windows x64 artifacts staged for
local play testing. Executables are deliberately excluded from source history;
publish the current pair as GitHub Release assets when a downloadable desktop
build is wanted. Version 0.16.0 is the current verified Windows test build. Its
Tauri build, staging, portable smoke launch, source-to-stage comparison, and
hashes completed successfully on 2026-09-02.

## Current 0.16.0 test files

- `Maze-so-Puzzle-0.16.0-portable.exe` - standalone application executable,
  92,971,008 bytes. It remained running and responsive with the correct title in
  a five-second local smoke launch.
- `Maze-so-Puzzle-0.16.0-setup.exe` - NSIS installer, 86,837,525 bytes. It was
  built and staged but has not been clean-machine installed during this pass.

`SHA256SUMS.txt` contains their staged hashes plus retained 0.15.0, 0.14.0, 0.13.0, 0.12.0, 0.11.0, 0.10.3, 0.10.2, 0.10.1, 0.10.0, 0.9.1, 0.9.0, 0.8.0, 0.7.1, 0.5.1,
0.5.0, 0.4.0, 0.3.0, and 0.2.0 archive hashes. The current files include the locally
bundled soundtrack.
The staged files match their final Tauri build sources byte-for-byte.

## Older verified archive files

- `Maze-so-Puzzle-0.14.0-portable.exe`
- `Maze-so-Puzzle-0.14.0-setup.exe`

- `Maze-so-Puzzle-0.13.0-portable.exe`
- `Maze-so-Puzzle-0.13.0-setup.exe`

- `Maze-so-Puzzle-0.12.0-portable.exe`
- `Maze-so-Puzzle-0.12.0-setup.exe`

- `Maze-so-Puzzle-0.11.0-portable.exe`
- `Maze-so-Puzzle-0.11.0-setup.exe`

- `Maze-so-Puzzle-0.10.3-portable.exe`
- `Maze-so-Puzzle-0.10.3-setup.exe`

- `Maze-so-Puzzle-0.10.2-portable.exe`
- `Maze-so-Puzzle-0.10.2-setup.exe`

- `Maze-so-Puzzle-0.10.1-portable.exe`
- `Maze-so-Puzzle-0.10.1-setup.exe`

- `Maze-so-Puzzle-0.10.0-portable.exe`
- `Maze-so-Puzzle-0.10.0-setup.exe`

- `Maze-so-Puzzle-0.9.1-portable.exe`
- `Maze-so-Puzzle-0.9.1-setup.exe`

- `Maze-so-Puzzle-0.9.0-portable.exe`
- `Maze-so-Puzzle-0.9.0-setup.exe`

- `Maze-so-Puzzle-0.8.0-portable.exe`
- `Maze-so-Puzzle-0.8.0-setup.exe`

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
Get-FileHash .\Maze-so-Puzzle-0.15.0-portable.exe -Algorithm SHA256
Get-FileHash .\Maze-so-Puzzle-0.15.0-setup.exe -Algorithm SHA256
```

Expected hashes are:

- portable: `CABF7455078CA025BC2194059B3758843728DF97298CFED9DF986C7F4B6FF1AE`
- installer: `7F935CCB84E41F04142587C920C5FF1EF6AADB6E5FF8A3722B3EEF7D77FB3AE1`

The package is unsigned unless the owner completes code signing and repeats the
artifact tests.

For source-build commands and controls, see `..\README.md`. For the complete
verification process, see `..\docs\RELEASE_CHECKLIST.md`.
