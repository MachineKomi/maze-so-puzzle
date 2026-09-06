# Restored folder reconciliation — 6 September 2026

Astra, bounded inspection at 19:03–19:06 UTC. Active repository:
`C:/GameDev/maze-game`, branch `codex/migration-wall04ar1-20260906`, HEAD
`0c951e68624782cce7bbb09144fd6704f2e7cb60`. Existing concurrent planning/runtime
work was left untouched. This receipt is the only file written by this audit.
No build, test, executable launch, transfer mutation, Git repair, move, deletion,
archive, commit or publication occurred.

This supplements the dated [artifact ledger](../LOCAL_ARTIFACT_LEDGER.md) and
[recovery receipt](../migrations/2026-09-06-new-laptop-recovery.md); their earlier
absence snapshots remain historical observations. The
[migration handoff](../migrations/2026-09-06-new-laptop-handoff.md) remains the
source of expected identities and qualification limits.

## QA arrival and exact native identity

`C:/GameDev/maze-game-qa` now contains `.playwright-cli`, `audio01a`, `audio01v2`,
`holes`, `output`, `performance`, `playtests`, `releases`, `storage` and
`ui01a`, plus `worktrees` and `README.txt`. This is an immediate-directory
inventory, not a full recursive completeness audit. The README still states
that the Human is copying folders in stages and contents may be incomplete.

The exact staged attachment is recovered:

`C:/GameDev/maze-game-qa/releases/v02210/attachments/Maze-so-Puzzle-0.22.10-VFX-02A-e28d44b-locked-portable.exe`

- Measured 173,473,280 bytes; SHA-256
  `1533d4d494be468e16fe0531ad14c6c90ca0c15aa3e8a3ca09a36020f21051fe`.
  Both match the committed handoff and transferred `portable-stage.json`.
- The transferred stage record binds source
  `e28d44bd4b290bc3c64aad5ff24f944f4a8cc0ce`, version 0.22.10 and an unsigned
  portable build. `native-build-main.log` also matches its recorded 1,656 bytes
  and SHA-256 `fe6b260435f1168fea679eefa722cda09558821797b5dd743828b5285b2eba76`.
- A second executable under `releases/v02210/stage/` is present at the same
  byte length; that duplicate was not independently hashed in this audit.
- These checks recover binary/evidence identity. They do not complete native
  launch, device, release or download acceptance. The artifact remains staged
  and unpublished; latest published Windows remains 0.22.9.

`portable-stage.json`, `build-verification.json`, build/art/browser logs and
release helpers are present. Their old successful runs remain historical;
neither their presence nor transferred process IDs establish a running session.
The external `release-config.json` still selects `C:/maze-game` and its old
native executable path. Do not run these helpers unchanged, or simply point
their exact-source release configuration at the newer active WIP checkout.
No configuration or provenance path was rewritten.

## Copied worktrees and approval-bound proofs

The two restored sibling folders and the QA HOLE folder are archival directory
copies, not currently usable Git worktrees. Their `.git` files still point to
`C:/maze-game/.git/worktrees/<name>`. Read-only `rev-parse` and `status` commands
fail because those Git directories are unavailable. Their actual HEAD and
dirty/clean status therefore cannot be verified. No relinking or repair was
attempted. The active repository still registers only its own worktree.

The following recorded HEADs are expected historical identities from the
[committed preservation manifest](../migrations/external-worktree-preservation.json),
not newly verified HEAD claims for these copied directories:

| Copied folder | Recorded historical HEAD | Scoped transferred-proof verification |
| --- | --- | --- |
| `C:/GameDev/maze-game-tessera-field-hotfix` | `c724c954fd302d22f391d25e88ab467301ac047c` | 1/1 expected Tessera comparison PNG matches exact size/hash. |
| `C:/GameDev/maze-game-v22-tessera-integration` | `b834a8e6775ec024fc9f854c7a7ced8c096b6627` | 50/50 expected files match: the same Tessera PNG plus the 49-file v14 approval packet. |
| `C:/GameDev/maze-game-qa/worktrees/hole02-proof-qual` | `96b898d5fe3497d53dcbfaaafd00a909ba3b1684` | 54/54 expected files match: the 49-file v14 packet plus HOLE index, topology, two WebPs and report. |

Counts include duplicate proofs in different copies; they are not 105 unique
artifacts. The audit matched only the manifest's named proof files. It did not
validate every source file, copied dependency, build output or package in these
trees. No art was copied into the active repo or newly approved. The active
repo's v14 packet had already been recovered exactly from its committed archive.

Both Tessera copies contain older `vercel.json` configurations without the
current deployment guard. They must not be used as an active release checkout
or pushed as a replacement for current deployment configuration. Their copied
`node_modules` and `dist` folders were left in place, without executing or
globally inventorying them.

## Gaps that remain

- Expected `maze-game-qa/migration-2026-09-06/` is still absent, including its
  `wall04ar1/`, `worktree-leftovers/` and `worktree-preservation.json`.
  The final wall screenshots/logs and consolidated unique historical patches
  are therefore not recovered at their intended destinations. Committed old-host
  numeric evidence remains available; this audit did not inspect every possible
  alternate transfer location or declare the transfer complete.
- The three copied historical retirement ledgers do not match the currently
  expected 623,530-byte / `7bf495f7...bfe2ba10` identity. The field-hotfix copy is
  621,583 bytes / `8299e2e9e74fabef61eaf92afb4666778d331105172f60576899c71c366bbf71`;
  the integration and HOLE copies are each 608,635 bytes /
  `5bec6251b2bbae43182845d0d029d23520617b307f781f9024d68477d4a34e23`.
  These older files do not resolve the fresh manifest mismatch. No ledger,
  approval hash, manifest or newline policy changed.
- Recovery of additional ignored art beyond the named Tessera/v14/HOLE proofs
  was not asserted. The recorded encoder-environment art-test failure and fresh
  full-art validation limits remain open.
- Wall timing/visual qualification, physical iPad8 performance, Human beauty
  judgment and native release acceptance remain distinct from file recovery.
  Live web is still 0.22.10; the active 0.22.11 wall candidate remains WIP.

Continue the active repo's bounded wall qualification with one runtime/heavy
writer and independent review. After the remaining migration packet arrives,
verify its named manifests and exact bytes before relying on it. Preserve the
restored copies and all remaining transfer files; no cleanup approval is implied.
