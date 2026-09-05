# v0.22.1 V22-PERF1 — performance and input preview

Play the [web preview](https://maze-so-puzzle.vercel.app/) and check that the title
shows **0.22.1**. On Windows, download the portable and all three text attachments
from the [v0.22.1 prerelease](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.22.1).
Compare the executable's SHA-256 with `V22-PERF1-v0.22.1-SHA256SUMS.txt`, then
double-click `Maze-so-Puzzle-0.22.1-V22-PERF1-8442b79-locked-portable.exe`.
It is an unsigned x64 Windows portable and needs the installed Microsoft WebView2
runtime. No installer is included. Windows may warn about an unsigned download.

Use the affected iPad and the same ordinary large 23×23 maze with about five
followers. Keep the route comparable. For each setting below, tell us whether
play feels **responsive and smooth**; “better” alone does not close the gate.

| Comparison | What to try |
| --- | --- |
| A: Full quality + Full motion | Try fresh play, then sustained play for about ten minutes or until the old slowdown returns. |
| B: Lite quality + Full motion | Repeat the same route and duration. |
| C: Lite quality + Reduced motion | Repeat again, especially if B still stutters. |

Record iPad model, iPadOS, browser or installed PWA, charging state, Low Power
Mode, maze name, approximate follower count, duration and any maze transitions.
Say when lag starts, how severe it gets, and whether releasing input stops Ame.
If useful, attach a short recording and include the maze name or Surprise seed.

While playing, hold, steer and release through doors, battles, rescues and jumps
as encountered. A still-held direction should resume after a successful
presentation; releasing should stop it. Every fresh deliberate failed attempt
should explain the blocker, without repeated dialogs during one blocked hold.
On desktop, also drag the pad then switch to keyboard or board mouse input:
the old pad should reset and releasing the old pointer should not stop the new
input. Arrow keys/WASD, the board and the bottom-right pad remain available.

This is a performance/input preview. Phone/Book/victory corrections, pace modes,
stationary cage rescue and Tessera's art repair are later updates. Full visuals
are preserved; Lite now reduces named scene effects. Sustained performance is
still unqualified: desktop measurements are mixed, including an unexplained
recovery timeout, frame tails and incomplete causal attribution. Automated
desktop checks cannot prove affected-iPad, native timing or family comfort.

The Windows app keeps the existing FP-UI1 profile identifier
`com.ame.mazesopuzzle.preview.fpui1`, so it can resume the 0.22.0 comparison run.
“Portable” describes the executable, not where progress is saved. Browser progress
stays in this browser/origin. Save schemas and content are unchanged. Native QA
uses a private copy of the developer's preview profile, not the sole original.

For rollback, close v0.22.1 and launch the retained verified v0.22.0 FP-UI1
portable from its [immutable release](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.22.0).
It uses the same preview namespace; keep a copy of the profile before comparing
builds if the current run matters. Do not delete/reset progress. The canonical
web URL moves with releases; an engineering web rollback requires redeploying
the prior verified source `68e303da680d5aec0ba71154949c5a2a0d1697ae`.

If these comparisons are smooth, the next work is ART-HOTFIX-01 then V22-PLAY-01.
If Lite + Reduced still stutters, the next work is V22-PERF-02 isolation.
V22-UI-01 and Agent 04 remain held pending the applicable review/device gates.
