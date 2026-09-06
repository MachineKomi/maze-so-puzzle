# Windows test builds

## v0.22.9 WALL-04A — current published preview

Frozen runtime/tag `cbe8ab879bd58c0a08a770209ebfeb649f684e2b`. Raised rounded
walls, smaller material repeats, clearer floor/wall contrast and the reproduced
ghost-frame fix. No gameplay/save, camera, audio or new loot changes.

- [Windows portable](https://github.com/MachineKomi/maze-so-puzzle/releases/download/v0.22.9/Maze-so-Puzzle-0.22.9-WALL-04A-cbe8ab8-locked-portable.exe)
- [Manifest](WALL-04A-v0.22.9-manifest.json) · [Playtest](WALL-04A-v0.22.9-PLAYTEST.md) · [Checksums](WALL-04A-v0.22.9-SHA256SUMS.txt) · [Receipt](WALL-04A-v0.22.9-release-verification.json)

Unsigned x64 portable173471744B; SHA256
`4bf84655dc589447344397c26847351990156743529a623d4aaafedfad46a441`.
All four public downloads match tested files. No installer/signing or physical
iPad acceptance. v0.22.8 is the immediate published fallback; older records below
are retained history. No save reset is needed when updating from v0.22.8.

## v0.22.4 V22-RESCUE1 — published

Frozen runtime/tag target: `45d843774d0335aa0ae1ee51aa9ca2f70f235b31`.
Stationary cage rescue: Ame stays beside the friend with unchanged steps, then
the next accepted movement may turn away or enter the cleared tile. Inherits
v0.22.3 pace, Dolphin and audio. No new iPad camera or phone-layout fix.

- [Release/downloads](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.22.4)
- [Manifest](V22-RESCUE1-v0.22.4-manifest.json) · [Playtest](V22-RESCUE1-v0.22.4-PLAYTEST.md) · [Checksums](V22-RESCUE1-v0.22.4-SHA256SUMS.txt)

Unsigned x64 portable173424640 bytes, SHA-256
`9888f8f2bbd4f6c2f6210e3eecf0104d852f3928cc03a74b338772647e28e7c0`.
All sixteen old active campaign runs restart on the new rules fingerprint;
durable progress survives. Close older binaries before opening this shared-save
preview. Use X/Alt+F4; Title Exit repair is separate. The
[publication receipt](V22-RESCUE1-v0.22.4-release-verification.json) records
prerelease383434235 and four independently hash-matched public downloads.
v0.22.3 remains immutable rollback.

## Historical v0.22.3 V22-COMFORT1

Current runtime/tag: `b834a8e6775ec024fc9f854c7a7ced8c096b6627`.
The [web game](https://maze-so-puzzle.vercel.app/) includes the Dolphin field repair,
Chill/Regular/Zippy pace and independent Music/SFX sliders. This is not an iPad
camera fix or stationary-rescue update. The intended22/100 audio defaults are preserved.

- [Windows portable](https://github.com/MachineKomi/maze-so-puzzle/releases/download/v0.22.3/Maze-so-Puzzle-0.22.3-V22-COMFORT1-b834a8e-locked-portable.exe)
- [Manifest](V22-COMFORT1-v0.22.3-manifest.json) · [Playtest](V22-COMFORT1-v0.22.3-PLAYTEST.md) · [Checksums](V22-COMFORT1-v0.22.3-SHA256SUMS.txt)
- [Release page](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.22.3)

Unsigned x64 portable,173424128 bytes, SHA-256
`3d1d2f5d1f00e3f94d4d7f5c5a7baf74485783d0ecca2c73baf808a29b042110`.
Same FP-UI1 save namespace; no installer. Close with X/Alt+F4: title Exit remains
separately queued. Family listening/pace and affected-iPad scrolling remain open.
The [publication receipt](V22-COMFORT1-v0.22.3-release-verification.json) records
GitHub prerelease383420350 and all four public downloads matching frozen bytes.

## Historical v0.22.2 camera experiment

[Release](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.22.2) ·
[Receipt](V22-CAMERA1-v0.22.2-release-verification.json).
The family reported continuing iPad camera stutter. Keep this comparison intact.

## Historical v0.22.1 performance/input preview

**Prior preview: v0.22.1 V22-PERF1 performance/input preview.**

Play the [canonical web version](https://maze-so-puzzle.vercel.app/) or download
the [GitHub prerelease](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.22.1).
Runtime/tag source is `8442b79db11a59e23f23c59f213116e7b8f54592`.
All four public downloads were independently verified against frozen local bytes:

- [Unsigned x64 portable](https://github.com/MachineKomi/maze-so-puzzle/releases/download/v0.22.1/Maze-so-Puzzle-0.22.1-V22-PERF1-8442b79-locked-portable.exe)
- [Manifest](V22-PERF1-v0.22.1-manifest.json)
- [Short playtest note](V22-PERF1-v0.22.1-PLAYTEST.md)
- [Checksums](V22-PERF1-v0.22.1-SHA256SUMS.txt)

Portable: **173,379,584 bytes**, SHA-256
`8e1e2e692efc38823bc32e56c3d559db3fe2bc8e8c27830340fbed4f567ac92c`.
The [publication receipt](V22-PERF1-v0.22.1-release-verification.json) records
exact CI/Vercel, canonical byte parity and 26 functional journeys, native
held-interaction/reopen/minimum checks and public asset verification. The existing
FP-UI1 save namespace is preserved. No installer is included.

Affected-iPad sustained performance and family acceptance remain open. Compare
Full+Full, Lite+Full and Lite+Reduced using the playtest note. This release contains
the accepted performance/input changes; the pace, stationary-rescue, Tessera and
phone/Book/victory updates remain separate work.

## Prior v0.22.0 FP-UI1 comparison archive

**Previous preview: v0.22.0 FP-UI1 UI-03 correction.**
Its source is `68e303da680d5aec0ba71154949c5a2a0d1697ae`. The
[GitHub prerelease](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.22.0)
is published and all four public downloads match their tested local bytes.
See the [publication receipt](FP-UI1-v0.22.0-release-verification.json) and
[current root review](../docs/reviews/2026-09-05-ui03-root-review.md).

This folder documents Windows x64 artifacts and retained comparison archives.
Executables are deliberately excluded from source history. The verified
FP-UI1 GitHub Release handoff contains these four assets:

- `Maze-so-Puzzle-0.22.0-FP-UI1-68e303d-locked-portable.exe`
- [FP-UI1-v0.22.0-manifest.json](FP-UI1-v0.22.0-manifest.json)
- [FP-UI1-v0.22.0-PLAYTEST.md](FP-UI1-v0.22.0-PLAYTEST.md)
- [FP-UI1-v0.22.0-SHA256SUMS.txt](FP-UI1-v0.22.0-SHA256SUMS.txt)

The portable is **173,378,560 bytes**, SHA-256
`b230c5681806737e884e1638fce0fdadf1a3155952e35cc5d73b8b76bdf77329`.
The immutable manifest froze before upload; its later publication outcome is
recorded in the separate receipt. An NSIS installer is not part of this handoff.

FP-UI1 uses the separate application-data namespace
`com.ame.mazesopuzzle.preview.fpui1`. The older 0.20.1 preview used
`com.ame.mazesopuzzle.preview`; ordinary older builds used their own profile.
Do not infer profile migration or shared progress from the executable's folder.

The Human-rejected v0.21.0 draft and superseded v0.22.0 candidate from `2f8fa6a`
remain withheld and must not be published as FP-UI1. Neither is presented here
as a public release. The earlier same-source
`Maze-so-Puzzle-0.22.0-FP-UI1-68e303d-portable.exe` is also withheld after an
installed Rolldown mismatch prevented exact locked-build provenance. `npm ci`
restored Rolldown 1.2.6 without a lockfile change; the replacement has the
distinct `-locked-portable.exe` filename. Check the exact filename and finalized
manifest/checksum, not only the displayed 0.22.0 version.

Canonical-web entry JavaScript/CSS now matches the clean locked build byte for
byte. All 47 new art delivery files (8,008,395 bytes) returned HTTP 200 with
matching local hashes, and six canonical-web journeys passed. The locked
portable passed actual native Title/Home, Hint, single movement, close/reopen
and minimum 960×540 checks. Clean-machine installation, code signing, offline
qualification and physical-device coverage are not claimed. Family visual,
comprehension and comfort acceptance remains the next gate.

## Historical 0.20.1 comparison files

The following archived corrective Art & OST Preview checks completed on
2026-09-04. They do not describe the current executable or release state.

- `Maze-so-Puzzle-0.20.1-portable.exe` - standalone application executable,
  160,436,224 bytes. It remained running and responsive with the correct title
  in a six-second local smoke launch.
- `Maze-so-Puzzle-0.20.1-setup.exe` - NSIS installer, 154,642,433 bytes. It was
  built and staged but has not been clean-machine installed during this pass.

`SHA256SUMS.txt` contains their staged hashes plus retained 0.19.0, 0.18.0, 0.17.0, 0.16.1, 0.16.0, 0.15.0, 0.14.0, 0.13.0, 0.12.0, 0.11.0, 0.10.3, 0.10.2, 0.10.1, 0.10.0, 0.9.1, 0.9.0, 0.8.0, 0.7.1, 0.5.1,
0.5.0, 0.4.0, 0.3.0, and 0.2.0 archive hashes. These historical files include the locally
bundled soundtrack.
The archived staging comparison matched their Tauri outputs at that checkpoint.
Mutable paths under `src-tauri/target/release` have since been reused for new
builds and are not evidence that an archive still matches the current output.

The 0.20.1 desktop preview uses the separate
`com.ame.mazesopuzzle.preview` application-data namespace so it does not
overwrite the ordinary profile used by older builds.

## Older verified archive files

- `Maze-so-Puzzle-0.20.0-portable.exe`
- `Maze-so-Puzzle-0.20.0-setup.exe`

- `Maze-so-Puzzle-0.19.0-portable.exe`
- `Maze-so-Puzzle-0.19.0-setup.exe`

- `Maze-so-Puzzle-0.18.0-portable.exe`
- `Maze-so-Puzzle-0.18.0-setup.exe`

- `Maze-so-Puzzle-0.17.0-portable.exe`
- `Maze-so-Puzzle-0.17.0-setup.exe`

- `Maze-so-Puzzle-0.16.1-portable.exe`
- `Maze-so-Puzzle-0.16.1-setup.exe`

- `Maze-so-Puzzle-0.16.0-portable.exe`
- `Maze-so-Puzzle-0.16.0-setup.exe`

- `Maze-so-Puzzle-0.15.0-portable.exe`
- `Maze-so-Puzzle-0.15.0-setup.exe`

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
- Historical preview artifacts were unsigned. FP-UI1 signing status must be
  recorded in the finalized manifest; Windows SmartScreen can warn about an
  unsigned file downloaded or copied from another computer.
- Do not bypass an unexpected warning for a file whose source or checksum you
  cannot verify.
- Saved game data belongs to the app's WebView profile; it is not stored next to
  the standalone executable.
- Rebuilding the app does not automatically refresh these convenience copies.
  They must be copied from the final Tauri output and hashed again.

Verify the published FP-UI1 portable in PowerShell with:

```powershell
Get-FileHash .\Maze-so-Puzzle-0.22.0-FP-UI1-68e303d-locked-portable.exe -Algorithm SHA256
```

Compare the result with [FP-UI1-v0.22.0-SHA256SUMS.txt](FP-UI1-v0.22.0-SHA256SUMS.txt)
and [FP-UI1-v0.22.0-manifest.json](FP-UI1-v0.22.0-manifest.json). These expected
values are finalized and match the published assets; the subsequent
[publication receipt](FP-UI1-v0.22.0-release-verification.json) records the
independent public-download verification. Human playtest acceptance remains
separate; see the [canonical joint state](../docs/JOINT_ORCHESTRATION_STATE.md).

Historical 0.20.1 hashes, retained for comparison, are:

- portable: `1FF30C2D5F58A60A2D4FAD44443A1D61D5A3B7DF66D4A96E86858E725D2B8777`
- installer: `09208147AE5FFB7DED0640257B6978ADB9A79210619E469F821D9D055757F143`

For source-build commands and controls, see the [project README](../README.md).
For the complete verification process, see the
[release checklist](../docs/RELEASE_CHECKLIST.md).
