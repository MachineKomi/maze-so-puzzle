# Approved local worktree cleanup — 2026-09-06

Human explicitly approved removal of the eleven previously audited worktrees.
Root Astra rechecked paths, Git state, remote anchors, ignored evidence and
running process references before removing each through `git worktree remove`.
Only these exact roots were removed; no branch, tag, remote history or release
attachment was deleted. `--force` permitted audited ignored build output and
the three camera-release documents whose hashes match the main checkout.

| Removed folder under `C:/GameDev/` | HEAD | File bytes removed |
| --- | --- | ---: |
| maze-game-audio-calibration | e628898bb4e501034f184a7a92c9e5e6d2b7a4aa | 1,110,928,068 |
| maze-game-play-b | b6f0003e4bfb71c332c42f6437a3ae8b9ea7ab8d | 1,109,887,012 |
| maze-game-ui-exit | 678a4409b55e6592a718ac90cc8f9daac1cf4e79 | 1,110,609,455 |
| maze-game-v0221-release | 9418ee245c16c645ec5a4dab03ded9e02ab97417 | 6,634,142,647 |
| maze-game-v0221-webreference | 8442b79db11a59e23f23c59f213116e7b8f54592 | 1,109,461,094 |
| maze-game-v0223-release | b834a8e6775ec024fc9f854c7a7ced8c096b6627 | 2,026,566,174 |
| maze-game-v0224-release | 45d843774d0335aa0ae1ee51aa9ca2f70f235b31 | 1,110,278,930 |
| maze-game-v0225-release | 7282665f8631051785176b701b1a7f14b7fe24a3 | 1,120,127,953 |
| maze-game-v0227-release | 9b822281197c9e9e65a8c9467fe5bd578dce1cbd | 1,111,130,523 |
| maze-game-v0228-release | 3acaf5872dd921f15929c330eeae46053b2a6362 | 1,111,989,867 |
| maze-game-v22-perf02-camera-origin | 820ed39f00e8c6bd808a0c084ccc2c67396ebb13 | 1,293,408,027 |

Total logical file bytes: 18,848,529,750 (17.55 GiB). C: free space increased
from 36,160,602,112 to 54,474,948,608 bytes during the operation. Filesystem
allocation and concurrent activity mean these are different measurements.

## Preserved evidence and recovery

- Every HEAD is contained in an origin ref; the UI-exit branch is preserved on
  `origin/codex/v22-ui-short-height`, rather than assumed merged to main.
- All 49 ignored v14 art-proof files in each relevant release checkout match
  the retained main-checkout copies byte-for-byte.
- The three untracked v0.22.2 release documents match retained `release/` files.
- The ignored v0.22.1 portable matches its previously verified GitHub release
  asset: SHA256 `8e1e2e692efc38823bc32e56c3d559db3fe2bc8e8c27830340fbed4f567ac92c`.
- The ignored v0.22.2 portable likewise matches GitHub:
  `e6753a7a62ad2f6f8525154b578b3ac3068342b52f795779f01d2391288ea7e9`.
- Generated dependencies, Rust targets, dist and Tauri schemas can be rebuilt.
  Committed source can be reconstructed using `git worktree add --detach`
  with the corresponding full SHA above. Historical signed/published bytes
  should be downloaded from their release, not claimed reproduced by a rebuild.

## Not removed

`C:/maze-game`, `C:/GameDev/maze-game-qa`, the Claude review folder,
`maze-game-tessera-field-hotfix`, `maze-game-v22-tessera-integration`, the nested
QA worktree and temporary Plan 03 checkouts remain untouched. The two Tessera
worktrees still hold a small unique proof and notes requiring preservation.

Future release closure should include a bounded worktree audit/removal proposal;
do not retain a full checkout indefinitely merely because it produced a release.
Never remove a checkout with unique ignored evidence, unbacked changes or active
processes. Human deletion approval remains required.
