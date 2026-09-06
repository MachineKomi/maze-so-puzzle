# Early delivery cleanup report — 2026-09-06

Status: local validation complete; hosted deployment verification pending.
Authority: [Human decision](../../reviews/2026-09-06-early-asset-cleanup.md).
Exact list: [retirement receipt](early-assets-2026-09-06.json).

## Changes

- Removed 30 superseded delivery files, 9,488,260 encoded bytes.
- Retained 104 ledger candidates, 31,743,621 bytes, with named dependencies.
- Added exact-match tombstones and missing-file/active-art safety tests.
- Preserved all source masters, active/dormant art, catalogue paths and gameplay.
- Separately removed eleven Human-approved worktrees, 18,848,529,750 logical
  file bytes (~17.55 GiB): [receipt](../../reviews/2026-09-06-approved-worktree-cleanup.md).

Eight preliminary deletion candidates were restored when complete art validation
found historical generation-batch reference dependencies. They are in the held
list and are not counted as removed. Source/reference validation remains strict.

## Validation and qualification limits

Two parallel/default-worker game runs completed 639/640 tests; the existing
generator-size test hit its 30-second limit (first run overlapped art work).
Serialized `npm test -- --maxWorkers=1` passed 640/640 across 58 files in 91.43s.
No timeout or assertion changed. TypeScript and production build passed.
The first manifest attempt caught the eight references described above; after
restoration the full art suite passed 151/151 in 165.96s. Sol's final nested-status
hardening then passed 10/10 focused retirement tests (including a new accidental
reintroduction test); the current complete suite has 152 cases. The generated
manifest was refreshed after that small tooling/test change.
Final art validator: zero errors, 425 explicitly classified historical/pending
warnings (four fewer legacy alpha-border findings after removal). Original source,
generation-reference and approval-proof checks remain enforced.

- Performance contracts: 11 scenarios / 9 owners, budgets and 3 evidence files
  passed. Public runtime bytes 155,542,751 / 165,031,011 allowed. No budget increase.
- Locked Windows desktop compile passed in 22.55s. No new portable was built.
- Local production HTTP: all 384 retained public files return 200 and exact hashes.
- Browser smoke: Title → Home → Adventure Book → Chapter1/Sprig → first maze
  and rescue input. Home 11, Book 78 and maze 22 image elements: zero broken images;
  console zero warnings/errors. Current-art gameplay screenshot inspected.
- All 384 retained public files and 448 tracked source images match the initial
  before-snapshot byte-for-byte. No current artwork, fallback or music changed.
- [Independent Sol review](../../reviews/2026-09-06-asset-cleanup-sol-review.md)
  found no blocker and independently verified all 30 Git restoration blobs.

| Delivery inventory | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| Public files | 414 | 384 | 30 |
| Public bytes | 165,031,011 | 155,542,751 | 9,488,260 |
| Dist files | 417 | 387 | 30 |
| Dist bytes | 165,735,590 | 156,247,330 | 9,488,260 (5.72%) |
| Image bytes | 65,771,989 | 56,283,729 | 9,488,260 |

The removed decoded-image inventory upper bound is 42,663,936 bytes, **not** a
measured gameplay-residency/FPS saving: these delivery files were unused.

HTML SHA256 `ed87ac5f0b77ac9bcdb2a1d7fe44218827fc2b8808ea9fb87b20fd64cd3d5b23`;
JS `e4cb4b603e531a4a67da0bab5bae26599bf594237d9005fb699a8b5a043b135a`;
CSS `503da2e95e6635cdaa65325397ac7fdc73fc4ee383c9068b7eb0728b0b489db7`.
All three are identical to frozen runtime e28d44b. A fresh Vite build contains
none of the 30 deleted delivery files; retained copies in dist also match hashes.

Before/after full public-file and 448 source-image hashes are in the external QA
storage receipt at `C:/GameDev/maze-game-qa/storage/early-assets-2026-09-06-before.json`.
Final deployment verification will close this report. This change does not fabricate final
Plan12/13 consumer acceptance or qualify a new Windows package.

Version remains v0.22.10: only unused payload and development tooling change.
The previously frozen Windows artifact and release evidence are not overwritten.
Old Vercel deployments and Git history are unchanged; the savings apply to the
current checkout and newly built delivery output, not historic hosted storage.
