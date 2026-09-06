# Local artifact ledger and cleanup review

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
