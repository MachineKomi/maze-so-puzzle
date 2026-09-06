# Local artifact ledger and cleanup review

## Execution outputs — 2026-09-06

### Completed web0.22.12 qualification and publication

Owner Astra. Runtime `e18c6ee`; final source/harness `5013ea7`.
[Qualification](reviews/2026-09-06-v02212-web-qualification.md) and
[public verification](reviews/2026-09-06-v02212-public-verification.md) bind results.
These completed measurements supersede active-size placeholders below. All paths
in this table are under `C:/GameDev/maze-game-qa/performance/` unless stated.

| Folder | Files / bytes | Disposition and retention |
| --- | ---: | --- |
| `phone02-book-full-20260906-r4/` |423 /206,468,562|79/82 pass; three stale probes retained and corrected separately on unchanged runtime.|
| `phone02-book-final-probes-20260906/` |13 /913,896|3/3 corrected probes pass; retain with broad run.|
| `phone02-book-retina-20260906/` |3 /18,829|Additional resource case passes phoneDPR3/tabletDPR2.|
| `phone02-book-final-20260906/` |4 /3,558|649 tests/build, budgets,12 guards and audit logs.|
| `phone02-book-paired-final-20260906/` |19 /61,116,790|Despite its name, earlier3/2-pair diagnostic only; insufficient run count.|
| `phone02-book-qualified-five-pairs-20260906/` |31 /98,230,617|Final24 routes:20 measured and4 warmups; compressed traces,4 captures, raw/aggregate/host JSON. Accepted scoped comparison.|
| `phone02-book-public-20260906/` |7 /5,820,154|Source helper,4 decoded public captures, successful HTTP/browser receipt and incomplete story-smoke JSON; retain through P15.|
| Repository `dist/` |387 /156,252,498|Rebuilt in place, frozen qualified payload. Rebuildable from exact source/toolchain; no extra build copy.|

Paired helper `scripts/performance/release-paired-review.mjs` is tracked reusable
source; its final five-run rule is in5013ea7. The public helper uses the installed
Playwright1.62.1 through a file URL, Node24.19 and isolated disposable contexts.
The first extended public smoke omitted normal story dismissal; final smoke
explicitly clicks Start the maze. All owned servers/browser contexts are stopped.
No new repo/worktree, dependency environment, native build or archive was created.
No source/evidence deletion is authorized. Review these retained packets after
P15/release follow-through; historical failures remain linked to corrected runs.

Three new durable review documents (final Sol, web qualification, public
verification) are small Git-backed source records, not disposable build output.
Documentation-only closure updates the existing plans/specs/ledger without a
new runtime build. The reported PowerShell popup prompted read-only diagnostics;
its cause remains unknown, and no OS settings or user processes were changed.

### PHONE-02 / BOOK-02A candidate output snapshot

Owner: runtime writer Astra; source baseline `e926737` on `codex/phone02-book`.
These are qualification outputs for the **undeployed intended v0.22.12** candidate,
not a release receipt. The [candidate record](reviews/2026-09-06-phone02-book-candidate.md)
owns results and limits. Completed folders were remeasured after the first paired
comparison; the active r4 folder is deliberately not given a final size.
Preserve failed evidence alongside corrected reruns. No deletion is authorized.

| Path | Measured files / bytes | Purpose and retention |
| --- | ---: | --- |
| `C:/GameDev/maze-game-qa/performance/phone02-book-20260906/` | 49 / 13,126,403 | Completed first phone/Book pass: 13 passed, 4 failed. Retain reports, geometry, captures and failure traces through qualification. |
| `output/playwright/phone02-book/` | 2 / 1,437,522 | `prototype-book.png` (465,274 bytes), `prototype-game.png` (972,248 bytes). Layout exploration, not acceptance proof. |
| `C:/GameDev/maze-game-qa/performance/phone02-book-20260906-r2/` | 45 / 11,730,390 | Focused17/17; actual Sol independently inspected29PNGs. Before final reader/slot changes. |
| `C:/GameDev/maze-game-qa/performance/phone02-book-full-20260906/` | 25 / 15,481,238 | 3pass/8fail/69not run. Independently confirmed stale percent-as-pixel movement probe. |
| `C:/GameDev/maze-game-qa/performance/phone02-book-full-20260906-r2/` | 85 / 34,883,636 | 30pass/6fail/44not run; inherited admission cadence/follower/anchor probes and a test variable typo. |
| `C:/GameDev/maze-game-qa/performance/phone02-book-full-20260906-r3/` | 278 / 123,151,069 | Remaining51:36pass/8fail/7not run. Real dense/enlarged fitter issues plus stale solver/audio/preference probes. Retain failures and independent review. |
| `C:/GameDev/maze-game-qa/performance/phone02-celebration-resize-20260906/` | 16 / 2,462,824 | Longest normal five-friend victory passes all6viewports after awaiting responsive settlement. |
| `C:/GameDev/maze-game-qa/performance/phone02-book-boundaries-20260906/` | 3 / 91,796 | 2/2 cold-vs-resize threshold and missing-silhouette fallback cases. |
| `C:/GameDev/maze-game-qa/performance/phone02-book-paired-20260906/` | 19 / 61,106,026 |14paired routes,4screenshots,report and14gzip traces; pre-final horizontal-fit correction at aad4bc5. Diagnostic identity in candidate record; do not promote as final-source qualification. |
| `C:/GameDev/maze-game-qa/performance/phone02-book-full-20260906-r4/` | Active; final inventory pending |82functional browser cases, new boundary tests included; old output-only sheet and long baseline collector are excluded from this regression count. |

The exploratory dev server on127.0.0.1:5173 was stopped after use. Test-owned
4173/1421 servers live only for their serialized runner. No persistent user
browser profile or copied dependency installation was created. The paired
harness writes compressed traces directly, reducing repeated trace disk cost;
the earlier uncompressed wall evidence remains held for the wall decision.

`dist/` has been rebuilt **in place** during candidate iteration; A02 below is
the dated initial inventory, not its current content/size. No repository,
dependency tree or build copy was created for these runs. The provenance marker
`node_modules/.cache/maze-performance/build-provenance.json` observed at 19:27 UTC
records `npm run build`, generated `2026-09-06T19:24:45.544Z`, parent HEAD `e926737`,
runtime-input SHA-256 `b645645b52302cad10d805839eb4d0610beabb6887131935b3847a3adca5d0de`
and dist SHA-256 `6c30e17573d030f9476b32944931471c4c2c6551198023ea3c9569c197194f88`.
This is an intermediate observed build identity; later builds replace the marker
and must supply their own final identity before release.

`scripts/performance/phone-book.pw.ts` is reusable candidate proof source.
`scripts/performance/installed-playwright-hook.mjs` maps `@playwright/test` to the
already installed runtime selected by `MAZE_PLAYWRIGHT_PATH` through Node 24's
optional import hook. It creates no shim package, dependency installation or
lockfile change. Contract/review/spec Markdown records are durable source.

The [19:03–19:06 UTC restored-folder reconciliation](reviews/2026-09-06-restored-folder-reconciliation.md)
supersedes the earlier dated absence observations for newly arrived folders.
The staged v0.22.10 portable executable is now recovered with its exact recorded
hash (173,473,280 bytes); this establishes artifact identity, not launch/native
release acceptance. Restored sibling/worktree copies have obsolete `.git` links
and are evidence archives, not verified usable checkouts. The expected migration
packet is still missing in that receipt. No cleanup, relinking or global rewrite
of historical source/evidence paths is authorized by this reconciliation.

### Retained wall diagnostic and planning source

- `scripts/performance/new-host-wall-ab.mjs`: Astra-owned reusable bounded paired
  harness; tracked source. Frozen baseline/candidate hash checks, isolated profiles,
  same-origin assets, equal 16-step reversible route and retained frame/trace data.
- `output/playwright/new-host-wall-ab-20260906/`: completed Astra wall diagnostic
  output from the above script at planning HEAD `0c951e6`, unchanged frozen runtime.
  Records warmups and three desktop pairs plus one compact pair, raw traces and
  four captures. 17 files / 448,999,668 bytes; retained for held R1 optimization; no cleanup
  authorization. Uses existing baseline/dist/assets, no duplicate repository/build.
- New Human intake and Plan09-P0 roster review are durable Markdown source, not
  build caches. Additional PHONE-02 runtime proof outputs will be logged here.

**Planning checkpoint addition,2026-09-06:** five durable Markdown files were
created in this turn: this ledger, `plans/BOOK-02A-silhouettes-and-discovery.md`,
`plans/DELIGHT-02B-glow-and-celebration.md`, `plans/LEARN-01-readable-reasoning-and-help.md`
and `reviews/2026-09-06-vision-and-programme-refinement.md` (all relative to `docs/`).
Astra owns them; Git preserves their exact bytes and revisions. They are active
planning/operations context, not disposable build outputs. No game/native build,
new dependency environment, copied repo, screenshot packet or worktree was created
for this planning turn. Review large-output inventory when the transfer arrives;
no cleanup is due solely because these small source documents were created.

Owner: Astra, with independent review as appropriate. This is an operational
inventory, not permission to delete, archive, move or overwrite anything.
The Human must explicitly approve exact targets before deletion or archiving;
old cleanup approvals do not apply to a new batch. No automatic cleanup job is
created by this document.

Use the actual Git root for repository-relative paths. At the initial snapshot
it is `C:/GameDev/maze-game`, branch `codex/migration-wall04ar1-20260906`, HEAD
`016c5a40eb4993de99105958455f1f3a863ba9a9`. External paths below identify observed
local installations and transfer destinations, not portable hardcoded defaults.

## Partial QA arrival — 2026-09-06, 18:44 UTC

A10's destination has appeared since the initial snapshot. Immediate contents are
`playtests/` and `README.txt` (130 bytes); `playtests/` contains `v0220/` and
`v02210/`. The Human's README explicitly says folders are being copied bit by bit
and may be incomplete. This is arrival evidence only, not verified completeness.

The expected `migration-2026-09-06/` wall/worktree packet and staged0.22.10 portable
attachment are still absent at their expected paths. No relevant transfer-complete
marker/manifest was found at the inspected levels. No recursive inventory or large
hashing was run during copying. Preserve all arrived files; verify manifests and
unique artifacts when the transfer is ready. No cleanup eligibility follows.
The initial A10 absence row below remains a dated historical snapshot.

## Initial measured inventory — 2026-09-06, 18:17 UTC

Counts and bytes are recursive regular-file lengths, not allocated disk space
or Vercel storage. They are a dated snapshot, not a current-size guarantee.
No reparse points were found in the measured trees. Creation attribution comes
from the [recovery record](migrations/2026-09-06-new-laptop-recovery.md); files
present on disk do not alone establish who created or approved them.

| ID / path | Files / bytes | Origin and owner | Retention, recovery cost and next review |
| --- | ---: | --- | --- |
| A01 `node_modules/` | 1,368 / 94,763,091 | Astra recovery: locked npm installation; includes build/test caches | Keep during wall qualification. Reinstallable from `package-lock.json` with compatible Node/npm and network access; not needed in Git or transfer. Review after dependency changes or milestone closure. |
| A02 `dist/` | 387 / 156,248,656 | Astra recovery: rebuilt 0.22.11 wall candidate | Keep current frozen output through A/B and source-identity review. Rebuildable from exact source/locks/toolchain; another build can replace its bytes. Record identity before any intentional rebuild. Not a published release. |
| A03 `output/playwright/migration-preflight-20260906/` | 7 / 723,281 | Astra recovery: HTTP identity, frozen baseline entry files, helper and failed art logs | Hold through wall and art-portability resolution. Includes unique observed logs and the frozen 0.22.10 baseline; a later live download may differ. Preserve original records, not just a passing rerun. |
| A04 `output/playwright/walls04-rack-new-host/` | 2 / 697,812 | Astra recovery: generated normal save fixtures and component rack | Reproducible from `scripts/art_review/wall-rack.test.tsx` at matching source. Hold exact fixture bytes during paired wall runs; review after qualification. Not recovered old screenshots or family saves. |
| A05 `output/playwright/v0.20.0/title-1280x720.png` | 1 / 1,246,450 | Present at arrival; historical tracked screenshot | Historical evidence, not a new recovery output. Review only with its consumer/provenance context and explicit Human approval. |
| A06 `artifacts/art-proofs/mgjrpg-02/v14/` | 49 / 8,847,297 | Astra restored original approved bytes using committed proof archive | Mandatory approval-bound index plus 48 children. Keep for fresh art validation. Restore only through the verified archive contract; never regenerate or rewrite approval to replace these bytes. |
| A07 `C:/Users/hawki/.cache/maze-so-puzzle/art-venv-20260906/` | 2,658 / 84,672,777 | Astra recovery: dedicated Python 3.12.14 art environment | Keep while portability issues are investigated. Direct requirements are pinned; transitives and encoder environment are not fully locked. Recovery needs compatible Python, package access and recorded versions; recreating it does not prove exact historical encoder output. |
| A08 `release/` | 47 / 1,206,726 | Existing tracked release records; no local `.exe` present | Preserve immutable publication/hash evidence. These records are not expendable build caches. Exact published binaries can be retrieved and hash-verified when needed; unpublished binaries have separate holds. |
| A09 `C:/GameDev/maze-game-claude-review/` | 4 / 152,549 | Human-restored external review inputs, now present | Preserve supplied bytes and provenance. Subsequent independent hash review is recorded in the [programme synthesis](reviews/2026-09-06-vision-and-programme-refinement.md): two exact imported copies, two external-only full texts. External-only sources remain holds; review does not adopt every recommendation. |
| A10 `C:/GameDev/maze-game-qa/` | Absent; size unknown | Human's external evidence transfer is still in transit | Do not treat absence as loss, an empty restoration or cleanup eligibility. On arrival inventory and verify existing manifests before using evidence; external helper paths need a separate audit. |
| A11 `src-tauri/target/` | Absent | No new-machine native build output | No native compile/launch/release qualification implied. Any future native build must add its target/cache and exact staged binaries here before cleanup review. |
| A12 Additional Git worktrees | None registered | `git worktree list --porcelain` shows only this working repository | No release worktree was created during recovery. Do not recreate full trees for a small diagnostic. Future worktrees need exact root, HEAD/branch, owner, dirty state, purpose and preservation path. |

`output/playwright/` totals 10 files / 2,667,543 bytes; A03–A05 already account
for those bytes. `artifacts/` contains only A06 at this snapshot. Root
`coverage/`, `.vite/` and `.playwright-cli/` are absent; caches under
`node_modules/` are included in A01. These absence checks are not assertions
about shared application/browser/system caches, which were not inventoried.

Recovery identities already recorded in the linked recovery receipt remain the
authority: candidate JS `index-fV--7I7N.js`, baseline JS `index-T8J736ZB.js`,
unchanged CSS `index-BTuEPBbD.css` and their SHA-256 values. The build provenance
marker is `node_modules/.cache/maze-performance/build-provenance.json`; preserve
the marker's runtime-input and dist fingerprints in a small receipt when a
specific build becomes evidence. It is included in A01, not a second payload.

| Reinstallation input at snapshot | SHA-256 |
| --- | --- |
| `package-lock.json` | `39d62f0e99e1862e1ae11fad0fd41643cf71fa60e8a518e459666a8a1bdbdb07` |
| `requirements-art.txt` | `fb81a75f80137acd25619cd2efd2b65eae880ebf1bb1e14e5d4e2c745d8585b5` |
| `src-tauri/Cargo.lock` | `cb606c08c12e8ea231a79acd9ef3db9fd74cbe231e38a22a710d7a769a376402` |

## Evidence and user-data holds

The incoming QA transfer must preserve `migration-2026-09-06/wall04ar1`,
`migration-2026-09-06/worktree-leftovers`, release attachments and unique
performance/audio/playtest evidence. Verify the
[committed worktree manifest](migrations/external-worktree-preservation.json)
against transferred bytes. Its two nonempty patches are historical WIP, not
instructions to apply them to this branch. Full old duplicate worktrees are
optional transfer material; omitting a transfer does not authorize deletion of
the old originals.

The unpublished 0.22.10 portable remains held at its exact expected QA path:
`releases/v02210/attachments/Maze-so-Puzzle-0.22.10-VFX-02A-e28d44b-locked-portable.exe`,
173,473,280 bytes, SHA-256
`1533d4d494be468e16fe0531ad14c6c90ca0c15aa3e8a3ca09a36020f21051fe`.
It is absent from this machine's expected destination at this snapshot and
must not be relabeled, overwritten or counted as verified/published. Latest
published Windows is 0.22.9; live web is 0.22.10; candidate 0.22.11 is WIP.

Approved source masters, original prompts, rights/approval records, soundtrack,
future-feature art and the remaining 104 held delivery candidates follow the
[asset-retirement authority](source-assets/retirement/README.md), not cache
policy. The earlier 30-file removal receipt is historical authorization for
that exact batch only. Missing usage in today's visible campaign is insufficient
to retire an asset with fallback, reconstruction or future-feature consumers.

Family browser/Tauri saves and user profile data are outside this ledger's
cleanup scope. Do not copy authentication databases, clear saves, or treat a
browser cache/profile as a disposable QA folder. Use isolated task-owned browser
contexts for QA and record any intentionally created persistent test profile.

## Ongoing logging and periodic Human review

The creating agent adds or updates an entry when making a build, diagnostic
packet, dependency environment, native package or worktree. Record exact path,
purpose/owner, source HEAD and dirty-input qualification, time, file count/bytes,
reproduction command/tool versions, evidence identity when relevant, dependencies
or consumers, hold/review trigger and the decision. An entry is not authorization
to remove it. Keep a short disposition history when an entry changes.

Use one evidence directory for a bounded run and record all attempts there;
retain failed/contaminated results with their disposition. Prefer a small
timestamp/size/hash receipt and links to the existing packet over duplicate
build trees, copied source archives or several full image packets. A unique
observed trace, user-supplied input or approval-bound proof is not replaceable
merely because its producing command can run again. Keep evidence outside
`public/`, `dist/` and package inputs.

Review this ledger when the wall checkpoint closes, the USB transfer completes,
a native release/worktree is created, storage pressure appears, or the Human
requests a periodic cleanup review. At each meaningful checkpoint, note whether
a review is due; do not delete or archive automatically or create a scheduled
task without a separate scheduling request.

For a concrete cleanup proposal, first remeasure only named targets and check
their current owner/process use, Git state, consumers and recovery availability.
Present exact resolved paths, expected bytes reclaimed, preservation/hash
verification and recovery cost. Identify source/evidence/release holds separately
from reproducible caches. Obtain explicit Human approval for the proposed
deletion/archive targets, then record the approval and actual result. Never use
age, a filename glob or an old blanket approval to select removal targets; never
use an unverified computed root or broad glob removal command.

Read-only inspection starts from a derived root, for example:

```powershell
$mazeRepoRoot = (git rev-parse --show-toplevel).Trim()
git -C $mazeRepoRoot status --short
git -C $mazeRepoRoot worktree list --porcelain
$mazeArtifactPath = Join-Path $mazeRepoRoot 'output/playwright/walls04-rack-new-host'
Get-Item -LiteralPath $mazeArtifactPath
Get-ChildItem -LiteralPath $mazeArtifactPath -File -Recurse -Force |
    Measure-Object -Property Length -Sum
```

Select a specific observed path before measuring; inspect reparse points before
any later recursive mutation. No deletion command is provided by this ledger.
Hosted Vercel storage and local disk storage require separate proposals; follow
the [deployment policy](VERCEL_DEPLOYMENT.md) to avoid duplicate hosted outputs
while continuing frequent Git backup checkpoints.
