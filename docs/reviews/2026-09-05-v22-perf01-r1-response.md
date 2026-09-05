# Astra response — V22-PERF-01-R1

Date: 2026-09-05. Owner: GPT-6 Astra; independent reviewer: GPT-5.6 Sol.
Branch: `codex/v22-perf-01-astra`.
Starting clean, pushed checkpoint: `67eb26f41a019102e4b290f5b06d8212779941a1`.
Original runtime candidate: `a92257a2ecb234c314b00ddaafb15c4d206771c2`.

Status: narrow correction and bounded local validation complete; awaiting Sol's
independent R1 review. The checkpoint section below owns the exact source identity.
This response does not supersede Sol's verdict until Sol reviews the return.
No merge, version, tag, release or production deployment is authorized here.

## Returned defects

1. **P1, delayed chained completion:** intermediate jumps explicitly have no
   movement-completion timer. The actual final battle/rescue/door phase schedules
   its own completion from its actual start, guarded by `presentationSequence`.
   Ordinary jump/portal presentations use that same final-completion path.
   The old independent aggregate input-unlock timer now serves ordinary movement
   only. Cancellation/run changes invalidate presentation callbacks; release and
   source takeover invalidate repeat generations. Completion reads current live
   intent and schedules the unchanged fresh 160 ms delay, never a saved action.
2. **P2, reverse ThumbPad takeover:** before replacing a pad input source, App
   invokes the component's reset handle. It clears the local gesture, direction,
   steering and stick offsets and releases physical capture. Reset is not invoked
   on ordinary same-source holds or on a newly arriving pad source. A displaced
   thumb's later release/cancel cannot cancel the replacement source.

Only three runtime files change: `src/App.tsx`,
`src/ui/game/AdventureHud.tsx`, `src/ui/game/ThumbPad.tsx`.
Engine/content, art/media, UI composition/CSS, quality recipes, cadence constants,
save schemas, versions and repository dependency/lock files are unchanged.

## Regression method and rejected attempts

The production-preview harness uses a solver-derived **real normal saved run** in
Lanternlight Labyrinth: a legal jump lands on the Griffin Cub rescue. A browser
virtual clock advances across both original nominal deadlines, making overdue
callbacks execute at the delayed current time. Full and Reduced motion each test
held/steered input, released input and synthetic hidden-page cancellation. These
are deterministic lifecycle checks, not frame-rate or physical-background tests.

Trusted CDP touch holds and visibly drags the real ThumbPad while keyboard or
board-mouse input takes over. Each takeover verifies local direction/steering and
capture reset, then ends or cancels the displaced touch before verifying that the
replacement input continues once on fresh cadence. No runtime test hooks exist.

- **Red baseline:** all three selected regressions fail as expected on the old
  runtime: early post-stall movement and stale pad state on each reverse source.
- **Rejected first fix:** removing the aggregate timer but letting the
  intermediate jump have a completion timer was insufficient. Overdue callback
  ordering still allowed it to schedule a repeat before the handoff. The two
  held-clock cases failed; this implementation was not accepted or committed.
- **Corrected focused run:** all eight initial R1 cases pass after intermediate
  jumps cease owning completion. Final coverage additionally starts with visible
  pad dragging and tests both touch release and touch cancel.
- The first attempted test port, 4174, belonged to another project. Nothing was
  stopped. The existing test configuration now accepts validated `MAZE_PERF_PORT`;
  these R1 runs use 4186.
- Ephemeral Playwright installation initially advanced an ignored transitive
  build tool. `npm ci --ignore-scripts` restored the lock **before any candidate
  build**. Playwright 1.62.1 runs from an external tools directory through ignored
  junctions; Vite 8.2.2 and Rolldown 1.2.6 remain locked. No product dependency was
  added. Final lock verification passed. A command to remove the three ignored
  tooling junctions was blocked by the execution policy, so those local links
  remain disclosed; no alternative deletion was attempted. Their external tools
  directory is retained. This is local test tooling, not a product dependency or
  something included in Git/dist. A fresh clone uses the unchanged lockfile.
- Lifecycle JSON captured in `finally` cannot know the runner's final verdict.
  Earlier interim files can misleadingly say `passed` for a failing assertion.
  The harness now explicitly defers verdicts to `playwright-results.json`; final
  runner results are authoritative for every rejected and accepted attempt.

Raw evidence lives under
`C:/GameDev/maze-game-qa/performance/v22-perf-01/` in separate
`r1-red-4186`, `r1-focused-green` (rejected), `r1-focused-green2`, and
`r1-input-final` directories. A clone recovers the tests and compact evidence,
not these heavy external artifacts. Prior performance cohorts remain immutable.

## Size and scope

Locked gzip9 JS is **153,261 bytes**, +143 from the reviewed original candidate.
CSS remains **23,512 bytes**; public delivery remains **164,988,031 bytes**.
The first budget check correctly failed by 54 bytes against the old 153,207 JS
ceiling. Astra has explicitly amended this candidate's allocation from 650 to
750 bytes (+100), leaving 46 bytes of headroom at 153,307. Sol must review this
bounded correctness allocation; it is not silent performance/feature acceptance.
There is no CSS/public allocation or broader optimization in this return.

## Final checks and checkpoint

Runtime/checkpoint commit: `91678d1a7f97055dc2f167f8a3e7106226817306`,
`fix(input): give final presentations exclusive unlock ownership`, pushed to
`origin/codex/v22-perf-01-astra`. It contains all 15 listed R1 files. The following
documentation-only handoff records that exact identity; discover its tip with
`git log -1 --format=%H -- docs/JOINT_ORCHESTRATION_STATE.md` and verify origin.
Remote main remained `461cab02b065a1d0f654c49189ed24108c22c5a8`; no main push,
PR, tag, release, package or deployment action was performed.

- Serial project check: **493/493 tests across 49 files**, including the four
  semantic scenario fixtures. Executed `npm test -- --no-file-parallelism` with
  default and JSON reporters, followed by `npm run build`: the complete normal
  test/build check with file concurrency disabled, not a reduced test selection.
- Strict TypeScript and locked production build: **pass**. The existing Vite
  >500 kB chunk warning remains; no warning threshold was altered.
- Full production input suite: **87 passed / 2 skipped / 0 failed / 0 flaky**.
  This includes all ten R1 regressions and both Lite presentation/style checks.
  The skips remain the unavailable authored jump-door/jump-combat fixtures,
  not silently fabricated gameplay or counted passes.
- Unchanged shared six-scenario/five-sample production browser cohort: **1/1**.
  This is a regression check, not a new sustained-performance comparison.
- `npm run perf:check`: **pass** with the explicitly amended candidate allocation;
  all 11 scenario contracts and three stored evidence validators pass.
- Inventory: **pass**, bound to matching current runtime/dist fingerprints.
  It inventories existing release packages; it did not build or publish any.
- `npm run check:desktop`: **pass**, locked Cargo dev-profile compile in 15.33 s.
  This is not a timed native play session or a new package.
- `git diff --check`: **pass**, only existing CRLF conversion notices.
- Repository package manifests and npm/Cargo locks: **unchanged**. Final installed
  product toolchain is Vite 8.2.2 / Rolldown 1.2.6. Ignored Playwright junctions
  remain as disclosed above.

The [compact evidence](v22-perf01-r1-evidence.json) binds final/rejected runner
reports, project JSON, inventory, source/lock hashes and all ten R1 lifecycle
traces. Rebuilding after the serial tests reproduced the input-tested dist hash.
The build marker names the starting Git checkpoint plus the actual **dirty-tree
runtime fingerprint**, not a claim that the old commit contained the fix:

- Runtime inputs: `341d49f93cd3d319c352b5ec14fee1b3810e53433e0fbf05a563d572016c4eee`.
- Dist: `e3378365b47b261d656a6cad0fac3e9251d41782594e938cdefe404b37d07f65`.

### Complete R1 changed-file list

Runtime: `src/App.tsx`, `src/ui/game/AdventureHud.tsx`, `src/ui/game/ThumbPad.tsx`.

Tests/tooling/allocation: `scripts/performance/v22-input.pw.ts`,
`scripts/performance/v22-input.config.mjs`, `scripts/performance/v22-README.md`,
`scripts/performance/feature-allocations.json`.

Documentation/evidence: `docs/JOINT_ORCHESTRATION_STATE.md`,
`docs/PERFORMANCE_BUDGETS.md`, `docs/plans/00-integrated-implementation-roadmap.md`,
`docs/plans/EXECUTION_PROMPTS.md`,
`docs/plans/V22-PERF-01-sustained-play-and-live-input.md`,
`docs/reviews/2026-09-05-v22-perf01-candidate.md`, this response, and
`docs/reviews/v22-perf01-r1-evidence.json`.

The original Sol review and original hash-bound performance evidence are unchanged.
Rollback before promotion is a selective revert of this R1 runtime correction
(all three runtime files together) to `67eb26f`, preserving the prior candidate,
art, saves and immutable evidence; do not reset the shared repository.

## Remaining gates and next action

Sol performs a short independent R1 diff/test/allocation review. Do not reopen
the entire performance investigation or adopt new features during that review.
If accepted, a separate promotion/publication turn prepares the affected-iPad
v0.22.1 preview. Full sustained performance remains unqualified: the original
timeout, mixed timing, missing attribution, multi-maze transition coverage and
physical iPad/Tauri gates remain open. No broad contaminated cohorts were
repeated to turn those limitations into apparent passes.

Chill/Regular/Zippy, stationary cage rescue, Tessera field alpha and Alex remain
in their separately routed slices; none is implemented by R1.
