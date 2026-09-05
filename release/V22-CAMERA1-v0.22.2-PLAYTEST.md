# v0.22.2 — V22-CAMERA1 experimental camera preview

This changes how the maze's scrolling offset is rendered, keeping its layout
origin fixed. It preserves the movement speed, camera view, rules, art, audio,
content and saves. **It is not yet a proven fix for the eighth-generation iPad.**

[Play online](https://maze-so-puzzle.vercel.app/) ·
[Windows portable](https://github.com/MachineKomi/maze-so-puzzle/releases/download/v0.22.2/Maze-so-Puzzle-0.22.2-V22-CAMERA1-820ed39-locked-portable.exe)

## Most useful check: iPad, Maze 2

Confirm the displayed version is **0.22.2**. Start with your normal Full settings
if comfortable. Try one tap, a short hold, and turns in **Shiny Sword**. Does
Ame stay visually coordinated with the scrolling scenery? Better, unchanged,
or worse than v0.22.1 is enough feedback.

Optional route from a fresh Maze-2 start: Left, Left, Up, Up remains in the
edge-clamped camera area; the next Up starts scenery scrolling. Down/Up there
provides a simple comparison. Do not reset your saved run just for this test.

If convenient, try Lite + Full motion and Lite + Reduced motion, then a larger
maze with followers. No need to repeat the whole list before reporting a result.
Static motion disables smooth travel and is not an equivalent smoothness test.
Include iPadOS and Safari versus home-screen app if known. Never clear progress
or browser data just to create a cold test.

Phone/laptop: check that previously smooth movement still feels right. Windows:
close normally with the window X or Alt+F4, reopen and check your saved maze.
**Known issue:** the in-game title Exit button can leave an empty native window;
use the window-close control instead. Its fix is separately queued.

## Scope and qualification

- Frozen runtime/tag: `820ed39f00e8c6bd808a0c084ccc2c67396ebb13`.
- 499 project tests passed; geometry, input, responsive visual and actual Windows
  WebView2 movement/save/reopen checks passed within the manifest's stated scope.
- Physical iPad improvement and sustained performance remain unqualified. Local
  layout counts did not improve; desktop frame timings do not prove device benefit.
- Chill/Regular/Zippy, stationary cage rescue, Dolphin repair, phone layout and
  audio-readiness changes are **not included** in this narrowly scoped comparison.
- Unsigned x64 portable, requires Windows WebView2. No installer, signing,
  clean-machine, offline, controller or family acceptance claim.
- The existing FP-UI1 preview profile is preserved. Close older builds before
  switching; keep a private backup. The native smoke used a separate synthetic
  profile and did not copy or change your profile.

v0.22.1 and its downloads remain unchanged for comparison. The online address
follows newer deployments, so always report the displayed version.

[Cumulative playtest checklist](https://github.com/MachineKomi/maze-so-puzzle/blob/main/docs/PLAYTEST_CHECKLIST.md) ·
[Decisions/steer](https://github.com/MachineKomi/maze-so-puzzle/blob/main/docs/HUMAN_DECISIONS.md)
