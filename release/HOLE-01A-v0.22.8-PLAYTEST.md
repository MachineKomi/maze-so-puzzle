# v0.22.8 — HOLE-01A family preview

Frozen runtime: `3acaf5872dd921f15929c330eeae46053b2a6362`.

Spring Boots now jump across one hole along the direction you move. Seven story
mazes have small, careful adjustments; long thin dividing trenches remain useful
because you cross their width, not their whole length. Surprise mazes reserve
safe approaches and landings. A jump cannot remotely open doors, fight enemies
or rescue caged friends. Landing on a teleporter plays the jump and warp in order.

**Save warning:** the changed rules intentionally restart unfinished mazes with
the updated-maze notice. Earned friends, achievements, rewards, unlocks and
historical records survive. Please do not clear your game data.

Existing hole artwork remains. Cleaner connected ditches are the next separate
art phase. This build does not change camera behavior, audio, general layout or
the known unresolved iPad scrolling issue.

## Quick checks — P12

1. With Spring Boots, cross a hole in both directions at Chill, Regular and Zippy.
   Release during the jump, then try holding or steering: no mid-air turn, stale
   extra move, disappearing Ame or missing followers after landing.
2. Check Wishing Woods and Grand Parade's door after the jump. Land first, then
   open/fight/rescue from adjacent floor. No interaction from across a ditch.
3. In Crown Vault, cross the long trench east/west; it should not be jumpable
   along its north/south length. Lanternlight's junction should remain useful.
4. Close normally and reopen: current position, friends and comfort settings
   should return. After updating from older rules, confirm durable progress stayed.

Tell us the displayed version, device/input, maze, what happened and what you
expected. P5–P11 remain cumulative; you need not retest everything in one sitting.
Physical touch, iPad/TV, child comprehension and comfort are not implied by the
automated checks. No performance or acoustic qualification is claimed here.

[Browser](https://maze-so-puzzle.vercel.app/) — follows the latest deployment.
[Windows portable](https://github.com/MachineKomi/maze-so-puzzle/releases/download/v0.22.8/Maze-so-Puzzle-0.22.8-HOLE-01A-3acaf58-locked-portable.exe)
is unsigned Windows x64 and requires WebView2. No installer/signing/clean-machine
qualification. Verify it against the attached SHA256SUMS and manifest; retained
v0.22.7 remains the immutable previous build.

[Cumulative checklist](https://github.com/MachineKomi/maze-so-puzzle/blob/main/docs/PLAYTEST_CHECKLIST.md)
· [Decisions](https://github.com/MachineKomi/maze-so-puzzle/blob/main/docs/HUMAN_DECISIONS.md)
