# FP-UI1 · Maze so Puzzle v0.22.0

A new family preview addressing the detailed v0.21.0 UI and movement feedback.

- [Play in your browser](https://maze-so-puzzle.vercel.app/)
- [Windows portable](https://github.com/MachineKomi/maze-so-puzzle/releases/download/v0.22.0/Maze-so-Puzzle-0.22.0-FP-UI1-68e303d-locked-portable.exe)
- [Release, manifest and checksums](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.22.0)

Title and Home use the illustrations' left-hand space for large controls, with
the Home cast on the right. Heavier rounded type, warmer raised buttons, larger
picture-led tools and frosted dialogs carry through the game. The Adventure
Book has five pages, illustrated lore cards, grey locked achievements and an
encounter-earned bestiary. Stories have circular portraits and simpler
continuation; victory restores confetti and individual friend dances.

Big/Normal is gone: the maze always uses its maximum useful square. The stable
deck restores Ame's portrait and has a bottom-right tap/hold/drag pad. First taps
and held travel share smooth movement without the old flash, repeat pause or
pronounced hop. Pickup amounts appear after collection.

## Start here

Use **Maze-so-Puzzle-0.22.0-FP-UI1-68e303d-locked-portable.exe**. Earlier files
without `-locked` are withheld candidates, even if their title says 0.22.0.
The final portable is 173,378,560 bytes; SHA-256:

`b230c5681806737e884e1638fce0fdadf1a3155952e35cc5d73b8b76bdf77329`

Open it directly; no installer is needed. It retains the FP-UI1 preview profile
used by v0.21.0, separate from v0.20.1. Keep older builds for comparison. The
website keeps that browser's adventure; use a separate browser profile for a
fresh start without resetting existing progress.

1. Compare Title/Home, then begin or continue. Check type, art, controls and Home counters.
2. In a scrolling maze, tap once, wait, tap repeatedly, then hold. Try corners,
   reversals and walls. Movement should feel comfortable from the first step.
3. Collect a potion, rescue a friend and fight a guardian. Check that the board
   and deck stay steady. Inspect a friend and an equipment card.
4. Try the bottom-right pad, Hint, story tap/Enter continuation, quick mute and Sound settings.
5. Finish an ordinary maze, inspect the Book pages, then close/reopen and Continue.

The Home build-number button opens the tester picker. Try Moonlit Friendship
Quest, Rainbow Power Parade and Twilight Treasure Loop for busier scenes.
Tester runs do not bank rewards or save a run; use ordinary play for persistence.

[Full checklist](https://github.com/MachineKomi/maze-so-puzzle/blob/main/docs/playtests/FP-UI1-checklist.md)
and [feedback template](https://github.com/MachineKomi/maze-so-puzzle/blob/main/docs/playtests/FP-UI1-feedback-template.md).

## Feedback and next step

Reply in this existing Astra task with build/platform, device/input, maze,
motion setting, short reproduction steps and expected/actual behavior.
Screenshots or a short video help. Report issues as you find them.

If your journeys pass, send **“FP-UI1 playtest passed”**, the device/input,
comfort and clarity verdict, and any untested rows. Root records the feedback,
resolves remaining gates and supplies the fresh Agent04 lighting/wall-depth
prompt for you to trigger. Tests do not replace your or Amelia's judgment.

## Verification and scope

Runtime source: `68e303da680d5aec0ba71154949c5a2a0d1697ae`. The manifest records
the clean locked build, executable identity, exact-source CI, native checks,
six locked-production browser journeys and six canonical-web journeys. All 488
project and 131 art tests passed in the recorded cohorts. The deployed JS/CSS
matches the locked build byte for byte; all 47 new art files match their hashes.
Failed attempts and corrective retests remain in the
[root review](https://github.com/MachineKomi/maze-so-puzzle/blob/main/docs/reviews/2026-09-05-ui03-root-review.md).

Landscape desktop/iPad are primary. Short landscapes use More for secondary
actions, smaller art and a compact deck. Portrait gives a rotate invitation.
Ordinary victory/Sound fit tested landscapes; long Help and enlarged text keep
reading scroll. The shortest victory omits decorative text while retaining
story, rewards and actions.

Physical iPad/Safari touch, screen-reader speech, controller/couch readability
and family comfort remain device/Human checks. Qualified low-end/native timing,
clean-machine installation and unplugged-network testing are not claimed.
The portable is unsigned. Later lighting/VFX, further animation, harder puzzles
and monster/treasure-room variety remain assigned programme work. Optional
4/5/6/7-tile camera zoom (default 6) remains Plan 08.
