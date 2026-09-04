# FP-ART-OST v0.20.0 family playtest

This is the Art & OST Preview: a safe, unsigned prototype checkpoint for seeing
the approved art refresh and hearing the new original soundtrack in the real
game. It is not the final UI, controls, effects, campaign or release candidate.

## Launch

Prefer `Maze-so-Puzzle-0.20.0-portable.exe`. Windows SmartScreen may warn
because the preview is unsigned. Verify its SHA-256 against
`FP-ART-OST-v0.20.0-manifest.json` or `SHA256SUMS.txt` before bypassing any
warning. The installer contains the same build but has not been tested on a
separate clean machine.

The Windows preview uses `com.ame.mazesopuzzle.preview`, a separate application
data namespace. It starts with a fresh preview profile and does not overwrite
the ordinary desktop profile used by older builds.

## Suggested ten-minute journey

1. Admire the new title environment, exact illustrated logo and larger
   tea-skeleton Home composition.
2. Begin Chapter 1 and listen for the title, story, maze and victory contexts.
3. Reach the star without rescuing the kitten. Confirm **Stay here** is the
   default, choose it, then move away and return to the star.
4. Choose **Next maze** and confirm Chapter 2 opens and the reward is credited
   once.
5. Use the secret build label to sample several later mazes and inspect the
   refreshed characters, items, enemies, terrain and reward stickers.

## Known boundaries

- The existing pre-Plan-01 HUD/layout and camera remain; their overhaul is next.
- Previous/Next/Shuffle exist behind the new music transport contract, but the
  compact Sound menu and final crossfades/preloading are later plans.
- Newly catalogued friends, enemies, Mimics, spikes, ice and other dormant art
  do not enter gameplay until their owning gameplay plans.
- Lighting, combat/environment VFX, controller support and limited sprite
  animation have not yet received their planned overhauls.
- The build is unsigned and is not a store-ready release.

Please record any observation against `docs/PLAYTEST_BACKLOG.md`; do not treat a
single family session as complete device, accessibility or performance proof.
