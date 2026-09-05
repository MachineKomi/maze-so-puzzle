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
  requires its complete77-case rerun including Static first board tap/reentry.

9. Default-parallel `npm run check` completed 491/493 assertions but timed out
   two unchanged solver cases (Friendship Crown Vault and generated size variety).
   It is recorded as failed, not silently renamed passed. Without changing
   timeouts/configuration/assertions, `npm test -- --maxWorkers=1` passed all
   493 tests across 49 files in 80.10 seconds; the subsequent production build
   passed. No solver/engine content changed in this tranche.

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
  Longer counter/matrix/soak comparisons are in progress, not yet acceptance.

## Static allocation

Locked candidate-v3 measures **153,118 gzip9 JS / 23,511 gzip9 CSS /
164,988,031 public bytes**. Compared with frozen v0.22.0, that is +739 JS,
+381 CSS and zero public bytes. The previous JS headroom was178; the measured
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
