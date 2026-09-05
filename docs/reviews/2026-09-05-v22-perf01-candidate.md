# V22-PERF-01 — Astra candidate receipt

Status: implementation and verification in progress on
`codex/v22-perf-01-astra`; not merged, versioned, released or Human-accepted.
Base: `461cab02b065a1d0f654c49189ed24108c22c5a8`.
Frozen public runtime remains v0.22.0 `68e303da680d5aec0ba71154949c5a2a0d1697ae`.
The [scope contract](../plans/V22-PERF-01-sustained-play-and-live-input.md) owns
acceptance. This receipt records evidence, including unsuccessful diagnostics;
Sol's independent review is still required.

## Implemented boundaries

- Imperative board cursor, stable minimap landmark/tile collections and
  semantically keyed scene-node discovery; engine/save state is not interpolated.
- Separate live input identity from suspended repeat clocks. Success chains
  resume current live direction on a new 160 ms cadence; no queued catch-up.
- Fresh blocker explanations without held-gesture floods; cancellation and
  selection safeguards; explicit generated tester finale with profile isolation.
- Named Lite scene recipe in [UI_UX_SPEC](../UI_UX_SPEC.md). Full, Static,
  six-tile FOV, ordinary cadence, art, campaign, engine and persistence unchanged.
- Production-only measurement tooling. Injected counters are external diagnostic
  builds, not shipping telemetry or dependencies.

## Evidence boundaries and rejected attempts

Raw evidence is outside runtime delivery under
`C:/GameDev/maze-game-qa/performance/v22-perf-01/`. Compact hash-bound results
will be attached below at the completed candidate checkpoint.

1. An ephemeral Playwright install changed transitive build dependencies. It was
   rejected before the baseline: `npm ci --ignore-scripts` restored locked
   Rolldown 1.2.6; only the three preserved Playwright packages were copied back
   into ignored `node_modules`. No repository manifest/lockfile changed.
2. The frozen baseline source fingerprint is
   `c4c79737b0828b0e7e5e9a10a7318c8b828f507507dbd82c997dd54cf80b5817`;
   its dist fingerprint is
   `395a36626977796b26bc7acae60014d8686ed43ee0a33e916f071316eb170856`.
   Source/dist copies protect the baseline from subsequent shared-tree edits.
3. The first geometry supplement overconstrained CSSOM percentage serialization
   (integer tile 1 reconstructed as 1.000002). It failed before movement and is
   retained as rejected harness evidence. Corrected tests permit 0.0001 tile
   serialization error, retaining exact actor IDs/order and <=0.001px residual
   translation. The corrected five-case supplement passed.
4. Current legal-route search found a real jump→rescue chain, but no authored
   perfect-route example of jump→door or jump→combat. Those two cases are skipped,
   not fabricated or counted as passes. This is a fixture-search limit, not a
   proof that such interactions can never exist.
5. Desktop baseline is already near 60 Hz in the selected corridor. A short
   traced isolation showed lower task/layout work with ambient animations paused,
   but no useful filter-only frame-tail improvement. Traces add overhead; no
   affected-iPad result or causal GPU diagnosis is inferred.
6. Candidate-v1 passed the first source-by-source input matrix, but a further
   read-only challenge found competing-source resume, a discarded diagonal drag
   corner hint and a Lite selector that missed actual follower images. Those
   findings were accepted and corrected in candidate-v2; v1 is not the final
   acceptance artifact. New deliberate input-source takeover clears prior
   gestures while preserving the gameplay corner-assist history.
7. Early diagnostic counter builds are rejected: fixture SSR left development
   NODE_ENV active in the first build; a subsequent build correctly froze JS but
   Vite CSS imports bypassed the source loader. Production mode and expanded
   frozen CSS imports now reproduce the baseline CSS hash. The ordinary frozen
   production timing/isolation runs were unaffected. Final baseline counters
   use `baseline-counters-r3-cohort`, not those earlier diagnostic attempts.
8. Candidate-v2's expanded suite passed73 cases but failed Static initial mount
   (two further cases skipped). With Static disabled travel on both Home and game,
   effect dependencies did not see the newly mounted board. Candidate-v3 adds
   explicit screen/mount binding invalidation and ignores key-up events from a
   retired input source. The rejected v2 report remains external; final acceptance
   required its complete 77-case rerun including Static first board tap/reentry;
   that rerun passed as recorded below.

9. Default-parallel `npm run check` completed 491/493 assertions but timed out
   two unchanged solver cases (Friendship Crown Vault and generated size variety).
   It is recorded as failed, not silently renamed passed. Without changing
   timeouts/configuration/assertions, `npm test -- --maxWorkers=1` passed all
   493 tests across 49 files in 80.10 seconds; the subsequent production build
   passed. No solver/engine content changed in this tranche.

10. The longer v3 matrix caught a production-only Lite mismatch: the authored
    standard-then-prefixed declaration minified to **only** WebKit `none`, leaving
    the standard scene `blur(2px)` active. That candidate run stopped after 20/36
    completed raw rows; its partial/rejected receipt is retained, with no invented
    final summary. V4 uses one standard source declaration; the build emits both
    standard and prefixed `none`. A live trusted-touch computed-style regression
    now guards this. Baseline 36 rows remain valid; the final candidate matrix
    subsequently completed all 36 rows.

11. Codex crashed during the first candidate Full ten-minute run. Recovery found
    only its fixture and source/delivery manifests: no surviving harness process,
    completed raw row or final summary. `candidate-v4-full-soak-cohort` is
    incomplete and excluded, not a timing or gameplay pass. The recovery run
    uses a new output directory and the same frozen V4 bytes. The crash/restart
    also separates host sessions; sustained before/after timings cannot be
    treated as a controlled causal comparison.

12. The first recovery (`candidate-v4-full-soak-recovery-cohort`) failed the
    unchanged ten-second segment wait after approximately two minutes of run
    setup/play. It produced an inventory failure but no completed row. Its
    available-RAM readings fell from 1,061,011,456 to 508,276,736 bytes; that is
    context, **not proof of the cause**. The original harness discarded live
    game state on failure. A failure-only capture now preserves the pre-release
    semantic state, cursor, focus, dialogs and accumulated metrics without
    changing the successful path, timeouts, route or assertions. A separate
    diagnostic run uses the identical frozen V4 source/dist. The failed run is
    not erased or upgraded by any later successful attempt.

The backed-up runtime checkpoint before that one-property correction is
`5e244b3d52c46ee9528e9e08d07ee1630b250944`. V3 and V4 production JavaScript
are byte-identical (SHA-256
`7e63d0ee061cd7083a3b1d73e2c0743fa58434a30168dcf6ef770ea80d27f5d1`),
so v3 input/counter evidence still describes the final JS. Full/Static CSS is
unchanged; only Lite's joystick override changed. Final V4 CSS is 23,512 gzip9
bytes, one byte above V3 and within the unchanged CSS ceiling.
The V4 live-touch supplement passed **2/2** in 29.1 seconds, requiring visible
held cursor, actual standard blur/none, Full/Lite player filter distinction,
neutral zero-movement and hidden cursor after release. Evidence:
`input-v4-lite/playwright-results.json`, SHA-256
`0695fddc48fbc5059ba9c295d04a5067c531635858a4b4337ae8c4c1133bde29`.
This is 75 prior passes plus two supplemental passes and two prior fixture skips,
not a claimed new full 79-case rerun.

## Completed candidate-v3 checks

- Input/browser: **75 passed, two explicit fixture skips, zero failures** in
  3.8 minutes. `input-v3/playwright-results.json` SHA-256
  `3d350ab8e119558202eb4120dea4ed7e3146f576690f70a8e255766388aeef2e`.
  Coverage includes all five success types across keyboard/pad/board, held
  steering/release/neutral/cancellation, source takeover, fresh blockers,
  Reduced/Lite/Static, first Static mount/reentry, final-flow isolation and
  settled replacement/follower geometry. Synthetic visibility events do not
  qualify real iPad background/foreground behavior.
- Unit/project: 493/493 serial; anchored-pointer file 60/60; Plan-07A semantic
  fixtures 4/4. TypeScript and locked production build passed.
- Shared production browser: all six S01/S02/S03/S04/S05/S08 rows with five
  samples each passed the existing harness. Timing remains contaminated/report-
  only. `shared-v3/browser-cohort.json` SHA-256
  `c810838210c7bace5d5dbabce500b80ca094349b2f60b1cc546cea40ea232d4d`.
- Full-quality captures: Title/Home/maze at 1920x1080, 1194x834, 844x390 and
  568x320. **12/12 exact geometry and 11/12 exact PNGs**, no broken images or
  page errors. The remaining 1920 maze has 5,310 differing pixels confined to
  the board; visually inspected with no visible composition change. Ambient
  phase is a possible cause, not an established diagnosis. This does not accept
  existing phone fit. `visual/summary.json` SHA-256
  `d538ba5d9f819277c27ae244c5b36dabec281d136720f9beb2428d4fb13bb9be`.
- Performance contracts/budgets/three historical evidence validators passed;
  locked Cargo desktop compile passed. No new native package/launch or WebView
  timing is claimed in this tranche.
- Frozen v3 runtime inputs:
  `35923b068d1985cf94d6af56ff9ebb3cc80416f2d67dc8e9f46c4b2704e0b407`;
  frozen v3 dist fingerprint:
  `489fedf94d12a1775213cb6055f0c9b98767d8d4213d0d7fff9474d72975695b`.
  Counters and the complete matrix are reported below; physical acceptance is
  still separate from these engineering checks.

## Directly measured work reduction

Separate production diagnostic builds count committed work; their timings are
not shipping performance authority. Baseline and candidate fixture JSON hashes
match exactly (`247e99a8d7e5686a4e0005cfb182ddd7fd26e3fe749e4a6a24e2a90f464a47d3`).
V3 counters apply to V4's byte-identical JS and unchanged Full scene rules.

| Probe | Frozen baseline | Candidate | Required semantics |
| --- | --- | --- | --- |
| 30 neutral trusted-touch jitters: App commits | 30 | 0 | Zero moves in both |
| Same jitters: MiniMap commits / constructed cells | 30 / 15,870 | 0 / 0 | Same view/reveal/objects |
| Same jitters: follower DOM scans | 30 | 0 | Same actors/order |
| Two Sound open/close cycles: App commits | 4 | 4 | UI still updates |
| Same Sound cycles: MiniMap commits / cells / follower scans | 4 / 2,116 / 4 | 0 / 0 / 0 | Zero moves in both |
| 40 ordinary board-driven moves: App commits | 48 | 40 | Exactly 40 legal moves |
| Same ordinary moves: repeated follower DOM scans | 48 | 0 | Bound nodes reused, geometry still checked |

The minimap still intentionally updates for actual movement; the keyboard/pad
40-move rows construct 21,160 cells. The candidate does not claim to eliminate
all minimap work or avoid its semantic updates. Forty synchronous active-run
saves remain forty; measured complete save calls total approximately 18.7–22 ms
before and 16.5–18 ms after on this host. These small noisy timing differences
do not justify a save-policy change or a causal performance claim.

Final V4 runtime-input fingerprint:
`eb80b41462ce79e9997895c08215bbcd921eb45b13505e8975786f1c97e9662d`;
dist fingerprint:
`f485ae42fead041b9d0419e73030fc1b85f7b2c7b60e01232427ff85cfaea315`.
Runtime checkpoint: `a92257a2ecb234c314b00ddaafb15c4d206771c2` on the candidate
branch. Later evidence-only commits must not change those delivered bytes.

## Production matrix and evidence quality

The completed matrix has **36 baseline and 36 final V4 rows**: twelve conditions
times three sequential samples, covering 0/2/5 legal followers, board drag,
keyboard and fixed pad, Full/Lite and separate Reduced motion. Each row made
exactly 40 legal moves and returned to the expected position with matching
normal saved state and no page errors. The configured minimum was 6 seconds,
not the harness's 12-second default; complete 20-move cycles extend the window.

- Baseline per-row p95 ranged 16.8–66.7 ms and p99 16.8–333.2 ms; V4 p95
  16.8–33.4 ms and p99 16.9–50.0 ms. Reference p95 <=20 ms was observed in
  12/36 baseline rows and 33/36 candidate rows. This is a report-only comparison,
  not a qualified target pass or a low-end device result. No numeric p99 target
  is currently defined by the performance budget; none is invented here.
- Baseline recorded 46 LongTask entries, 44 strictly over 50 ms (worst 414 ms).
  V4 recorded zero, **but its worst frame interval was still 582.9 ms** versus
  baseline 1,382.2 ms. Some individual candidate frame tails were worse, including
  zero-follower Full and five-follower Lite/Reduced. Zero LongTasks does not mean
  zero stutter, or establish that a GPU/renderer problem has been solved.
- Same-condition baseline p95 varied 16.9 →49.9 →16.8 ms without a code change.
  Available host RAM also varied sharply; thermal state was not measured.
  Sequential ordering, active development, randomly selected BGM and the later
  crash/restart prevent a causal percentage-speedup claim. Only frozen code,
  legal game state, route, browser, viewport and requested settings are matched.
- Five-follower Lite has zero filtered scene images and two sampled running
  board animations, versus eight filtered images and 23–25 sampled animations
  in the corresponding Full scenes. Lite's live joystick computes `none` while
  Full retains `blur(2px)`. Counts vary with animation phase; this directly proves
  the named work is disabled, not how much iPad GPU time is saved.

All observed >50 ms tasks remain explicitly **unattributed**. Their timestamps
and durations are retained; the LongTask API's `self` label is not a function-
level stack. Short single-factor traces did not establish a cause for those
separate events. Attribution and clean-host variance are open evidence gates;
do not relabel them as persistence, follower, raster or GPU faults.

## Static allocation

Locked final candidate-v4 measures **153,118 gzip9 JS / 23,512 gzip9 CSS /
164,988,031 public bytes**. Compared with frozen v0.22.0, that is +739 JS,
+382 CSS and zero public bytes. The previous JS headroom was178; the measured
deficit is561. Astra authorizes a named650-byte candidate allocation, leaving89
bytes for bounded cross-platform/toolchain variation, not new features. CSS
uses its existing ceiling. The [allocation ledger](../../scripts/performance/feature-allocations.json)
records owner, evidence, review date and rollback; Sol still reviews this exact
candidate before promotion. No dependency, version, media or save-schema change.

## Review/release gate

Only the candidate branch is backed up. Sol reviews the exact diff and evidence
before promotion. Main/v0.22.0 release attachments are untouched. A v0.22.1
preview and affected-iPad fresh/sustained Full/Lite retest follow acceptance;
V22-UI-01, Agent 04 and PT36 stay held as specified by the joint state.
