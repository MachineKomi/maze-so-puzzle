# Maze so Puzzle v0.22.4 — stationary rescue family preview

Frozen runtime: `45d843774d0335aa0ae1ee51aa9ca2f70f235b31`.
Preview: **V22-RESCUE1**. Unsigned Windows x64 portable; no installer.

[Play online](https://maze-so-puzzle.vercel.app/) ·
[Windows portable](https://github.com/MachineKomi/maze-so-puzzle/releases/download/v0.22.4/Maze-so-Puzzle-0.22.4-V22-RESCUE1-45d8437-locked-portable.exe)

## What changed

- Ame stays beside a cage while opening it, rather than walking into the friend.
  Rescue does not add a movement step. The friend joins from the cage, without
  resetting the rest of the follower line.
- Tap and release to stop there. Hold to continue after the animation; change
  direction during it to choose where to go next. Turning away is valid.
- An unresolved cage cannot be rescued remotely by jumping across a hole.
  Approach beside it instead; a cleared cage tile is ordinary floor.
- A rescued run is protected by the maze-switch confirmation even at zero steps.

Inherited from v0.22.3: repaired Dolphin field art, **Chill / Regular / Zippy**
movement (320 / 200 / 120 ms per ordinary tile), and separate **Music / Sound
effects** sliders with Test sound. Regular is slightly slower than the old
160 ms pace. None of these options changes puzzle legality.

## Important saved-game note

The rescue rule changes every campaign maze's rules fingerprint. An unfinished
maze saved in v0.22.3 or earlier will restart through the updated-maze message.
**Completed mazes, unlocked levels, earned friends, rewards and currencies are
preserved.** Previous best results remain earlier-layout history; they are not
silently compared with the new rules. No save-schema or dependency change.

Close any earlier Windows preview before opening this one. These recent previews
share the `com.ame.mazesopuzzle.preview.fpui1` save namespace. Do not clear your
progress for testing, and do not run an older binary against newer saves without
a private backup. Close Windows using **X or Alt+F4**: the title Exit-button issue
is a separate queued repair, not fixed by this release.

## Most useful checks

1. **Rescue:** use the first maze's unicorn, or any friend you encounter. Tap into
   the cage and release. Ame should stay visible beside it; then try turning away
   or entering the cleared tile. No overlap, extra rescue or extra step.
2. **Held touch:** hold into a cage, release during the effect, then repeat while
   keeping the control held or steering during the effect. Does the next action
   match your intention? Existing followers should not collapse into one spot.
3. **Comfort:** choose a pace for Alex, Ame and yourself in Sound & comfort. On
   iPad, try lowering Music while leaving Sound effects higher at comfortable
   device volume. Tell us the values that work well, and check they survive reopen.
4. **Recovery:** close normally and reopen after a new-rules rescue. Does the same
   run and rescued friend return? No need to deliberately interrupt an animation.
5. **As convenient:** Tessera Dolphin's tail/flippers in Maze 9; ordinary door,
   battle, jump, music and already-liked desktop/iPad layout regressions.

Please report the displayed version, device, input method, maze and what happened.
The [cumulative checklist](https://github.com/MachineKomi/maze-so-puzzle/blob/main/docs/PLAYTEST_CHECKLIST.md)
retains earlier findings; multiple builds can be reviewed together.

## What this does not claim

No new iPad camera-performance fix, phone-layout redesign, predictive BGM
handover/crossfade, new content, lighting or VFX is included. The affected
eighth-generation iPad scrolling issue remains open; do not repeat the already
reported failure merely to prove it again. Slower pace is a comfort choice, not
evidence that rendering is fixed. Physical family comfort and speaker balance
still need your feedback; desktop/browser checks cannot establish them.

This is an unsigned family prerelease, not signed/installer/clean-machine/offline
or sustained-performance qualification. Exact engineering checks, artifact hashes,
retained limitations and prior rejected test attempts accompany the manifest.
v0.22.3 `b834a8e6775ec024fc9f854c7a7ced8c096b6627` remains an immutable rollback
reference; reverting requires a coordinated source/deployment and save decision,
not deleting player data or overwriting old releases.
