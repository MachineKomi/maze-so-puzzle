# v0.22.6 — AUDIO-01V2

A small audio-comfort preview: quieter music by default, adjustable effects,
and preserved existing preferences.

Frozen source: `e628898bb4e501034f184a7a92c9e5e6d2b7a4aa`.
Windows portable: `Maze-so-Puzzle-0.22.6-AUDIO-01V2-e628898-locked-portable.exe`.
Use the accompanying SHA256SUMS and manifest to verify the download.

[Play online](https://maze-so-puzzle.vercel.app/) ·
[Cumulative checklist](https://github.com/MachineKomi/maze-so-puzzle/blob/main/docs/PLAYTEST_CHECKLIST.md)

## What changed

- New preferences start at Music75% / Sound effects75%. This matches the
  requested old Music10% / SFX100% balance; there is adjustment room above it.
- Existing choices keep their actual volume. Their displayed percentages may
  change because the controls are calibrated differently. Opening Sound or
  changing another comfort setting does not round the saved volume.
- Very high Music and Sound effects together may distort. Lower either if heard;
  final mastering and physical listening are not complete.

## Please try P10 when convenient

Do not reset your progress. To try the new balance on an existing profile, set
both sliders to75% in Sound & comfort. Compare phone, iPad, laptop browser and
Windows at comfortable system volume. Try Test sound, independent adjustment,
mute/change/unmute, zero and normal close/reopen. Report any unexpected burst,
crackle, track restart or lost preference, with build/device/settings.

P5–P9 remain cumulative; no need to repeat already-reported iPad camera failure.
This build does not change camera, movement, maze rules, artwork or OST files.
Broader music readiness/crossfades remain planned.

## Compatibility and limits

Durable progress and current maze saves are unchanged from v0.22.5. Close older
Windows builds before opening this one: they share a save namespace. Downgrading
to v0.22.5 and changing settings there can clamp newly boosted effects back to
its old maximum; opening this build never requires clearing data.

This is an unsigned x64 portable, not a signed installer or clean-machine/
sustained-performance qualification. Physical listening and family acceptance
remain open. The v0.22.5 release remains an immutable rollback.
