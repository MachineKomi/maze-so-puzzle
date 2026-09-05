# FP-UI1 · Maze so Puzzle v0.21.0

**UNPUBLISHED DRAFT — WITHHELD following initial Human rejection of the UI.**
The GitHub release/download URLs below are proposed, not live published assets.
See `docs/playtests/2026-09-05-fp-ui1-initial-rejection.md`; root stopped for
discussion and Agent04 is held. Do not publish or present this draft as ready.

This family preview includes the reviewed responsive UI and the early movement
improvement: exact tile-based gameplay with coordinated smooth character/camera
travel. Friends now follow the actual corridor trail, including offscreen turns
and reversals. Sound, dialogs, Big mode and large equipment/earned-reward detail
are included. The original gameplay rules and sixteen current story mazes remain.

- [Play in your browser](https://maze-so-puzzle.vercel.app/)
- [Download the Windows portable](https://github.com/MachineKomi/maze-so-puzzle/releases/download/v0.21.0/Maze-so-Puzzle-0.21.0-FP-UI1-2924fd7-portable.exe)
- [Versioned release and verification files](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.21.0)

Windows: open the downloaded executable; no installer is needed. This preview
uses `com.ame.mazesopuzzle.preview.fpui1`, separate from older Windows previews.
Keep the old builds/profiles. For fresh web testing use a separate browser profile;
the canonical website otherwise continues that browser's existing saved adventure.
Check that the title/Home shows **0.21.0** before testing.

## A useful first playtest

1. Try individual steps and held movement in Little Star Trail, then a scrolling
   maze. Try a straight corridor, corner, reversal and outer edge. Is holding
   movement now comfortable enough that you no longer prefer isolated steps?
2. Check the objective, Power, Bag, friends and minimap; compare Normal and Big.
3. Open Hint/Help/Sound, then return. Check that movement stays blocked while a
   dialog is open and works again afterwards. Try Reduced motion if useful.
4. Rescue friends and watch them around corners and offscreen. Try a door, combat,
   jump or portal as available. Report any misplaced actor, effect or sudden jump.
5. In an ordinary run, stop, close the app/tab, reopen and continue. Try Stay at
   an exit with an optional friend remaining. Rewards should not duplicate.

For later/busy mazes, use the Home build-number button to open the tester picker.
Useful cases: Lanternlight Labyrinth, Moonlit Friendship Quest, Rainbow Power
Parade and Twilight Treasure Loop. Tester runs are explicitly not saved and do
not bank ordinary rewards; use normal play for persistence/reward checks.

[Full checklist](https://github.com/MachineKomi/maze-so-puzzle/blob/main/docs/playtests/FP-UI1-checklist.md)
and [feedback template](https://github.com/MachineKomi/maze-so-puzzle/blob/main/docs/playtests/FP-UI1-feedback-template.md).
One short session is enough. Stop an uncomfortable check.

## Feedback and what follows

Reply in the existing Astra task. Include version, web/portable, device/input,
maze, Normal/Big, motion setting, steps to reproduce, expected/actual behaviour,
and a screenshot/video when useful. Report issues as soon as they appear.

If your tested checks pass, send **“FP-UI1 playtest passed”** with the device,
input, comfort verdict and any untested rows. Root records acceptance and finishes
Agent04's lighting/wall-depth preflight and prompt; you trigger that task.

Future Book tabs/bestiary, restrained focus styling, no-scroll victory/dances,
new lighting/materials/VFX, harder puzzles and monster/treasure room/maze profiles
remain in their assigned plans. Adjustable camera span4–7 (default6) is Plan08,
not this preview. New mechanics are explored before Plan09 map freeze and require
a concrete Human-selected rule set.

## Verified scope and remaining checks

Source: `2924fd73f60229dd244eeba21c05f66afb4eb8b0`; UI checkpoint372e7d9 and
movement checkpoint5344873. The manifest/checksum file is artifact hash authority.
461 project tests,43 shared browser checks, locked portable build, art/static
gates and exact-source GitHub CI passed. Canonical web checks passed ordinary
save/Book/reload/restart and a scrolling held route; served entry assets returned
200 with the new version/travel code.

Native title→Home→story→maze, a precise keyboard step, Hint isolation/return and
the isolated WebView profile were verified. Automation detected live input in
the preview window, so root left it open; native close/reopen and minimum-window
checks remain explicit playtest rows. Physical iPad/Safari/phone/TV, screen-reader,
controller, clean-machine install/signing, unplugged-network native verification,
qualified low-end timing and Human comfort remain unclaimed. Frame comparisons
are report-only, not a general performance certification.
