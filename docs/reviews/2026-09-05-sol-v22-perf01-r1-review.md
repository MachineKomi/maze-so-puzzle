# Sol review — V22-PERF-01-R1

Date: 2026-09-05
Reviewer: GPT-5.6 Sol
Candidate branch: `codex/v22-perf-01-astra`
R1 runtime checkpoint: `91678d1a7f97055dc2f167f8a3e7106226817306`
R1 handoff tip reviewed: `d951d7750d433ea1524b748ebf50bfa76b364541`
Original candidate review base: `67eb26f41a019102e4b290f5b06d8212779941a1`
Frozen public v0.22.0 runtime: `68e303da680d5aec0ba71154949c5a2a0d1697ae`

## Verdict

**ACCEPT R1 FOR PROMOTION AS THE v0.22.1 PERFORMANCE/INPUT PREVIEW.**

The two correctness defects returned in my original review are fixed. I found no
new blocker in the exact three-file runtime return. This accepts the engineering
checkpoint and its bounded 750-byte candidate allocation; it does **not** establish
that Full-quality sustained play is fixed on the affected iPad, qualify native or
web performance, or accept the still-open phone/Book/victory work.

Promotion, versioning, clean release construction and publication are a separate
Astra-owned transaction. Main, v0.22.0 and its immutable release remain untouched
at this review checkpoint.

## Review findings

No P0–P2 finding remains in R1.

### P1 closure — actual final phase owns unlock

- A chained jump is now explicitly started with `continues = true`, so it creates
  no independent completion/unlock callback.
- The handoff retains the jump's sequence. When it actually executes—even after
  both old nominal deadlines—the final battle/rescue/door phase first invalidates
  the intermediate sequence and starts its own timers from its real start time.
- Only that final phase's guarded callback clears `inputLocked` and
  `presentationSuspended`. The old aggregate timer has been removed from the
  presentation path and remains only for ordinary move/bump cadence.
- Hidden-page cancellation, level/run changes and superseding presentation work
  invalidate the sequence before an old callback can resume input. Releases,
  blur and source termination clear the live source/repeat generation. The final
  callback deliberately does not freeze an old generation: it asks the current
  live source to schedule a new repeat, whose existing scheduler captures and
  checks the current generation. That is required to preserve deliberate steering
  and source takeover during a presentation without resurrecting a released input.
- Simple battle, rescue, jump, portal and door presentations use the same final
  completion owner. Existing cancellation and healthy-chain coverage remains.

### P2 closure — ThumbPad component state is revoked on takeover

- App holds a bounded imperative reset handle for the ThumbPad. It invokes that
  handle only when the outgoing source is `pad` and the incoming source differs;
  the existing same-source early return preserves ordinary pad holds.
- Reset clears the component gesture, direction, dragging flag and translated
  stick offsets, then releases pointer capture. App subsequently clears the old
  semantic repeat state before assigning the incoming source.
- Releasing capture may deliver `lostpointercapture` while the old pad owner still
  exists, which is safe; after reset, a later displaced `pointerup` or
  `pointercancel` cannot match a live gesture and therefore cannot clear or revive
  the replacement keyboard/board source.

## Independent evidence

Repository identity was clean and exact before review: local/remote branch tip
`d951d775...`, runtime checkpoint `91678d1...`, remote main `461cab0...`.
Package manifests, npm/Cargo locks, public assets, engine/content, cadence, CSS
quality recipes, save schemas and version are unchanged by R1.

I independently ran the ten R1 production-preview browser cases with Edge,
serially, on port 4192:

- **10 passed / 0 failed / 0 skipped / 0 flaky**, 22.522 seconds;
- runner JSON: `C:/GameDev/maze-game-qa/performance/v22-perf-01/sol-r1-review/playwright-results.json`;
- SHA-256: `a312d8ffb6fe7e8a28eb2bd623b70574aabd2672fcce1602dc7d178b5195899a`.

This covers a real solver-derived Lanternlight Labyrinth jump→Griffin rescue in
Full and Reduced motion with held/steered, released and hidden-page outcomes, plus
keyboard/board reverse takeover from a visibly dragged captured ThumbPad followed
by both displaced touch-end and touch-cancel.

I also independently ran the focused ThumbPad, movement-control and interaction
unit files: **8/8 passed**. `npm run perf:check` passed all 11 scenario contracts,
nine allocation owners, the deterministic static budgets and three stored evidence
validators. Astra's 27 committed local/external artifact references independently
matched their recorded SHA-256 values, and the current built runtime/dist
fingerprints match the committed R1 evidence.

Astra's evidence correctly preserves:

- the old runtime's **3/3 red failures**;
- a rejected first implementation with **2 held-clock failures**;
- the corrected focused **8/8 pass**;
- the final full input **87 passed / two pre-existing unavailable-fixture skips**;
- the unchanged shared browser cohort pass and **493/493** serial project tests.

The two skips are honest: the current authored campaign offers no solver-found
jump→door or jump→combat fixture. The real jump→rescue path tests the shared chain
mechanism; the absent variants are not fabricated or counted as passes.

## Allocation decision

**Accepted for this candidate:** 750 gzip9 JavaScript bytes over the pre-candidate
ceiling. R1 is 153,261 JS bytes—143 above the reviewed original candidate and 54
above its old 153,207 limit. The explicit +100 adjustment raises the limit to
153,307 and leaves 46 bytes. CSS remains 23,512 and public delivery remains
164,988,031. The increment buys two correctness closures and tests, not a new
feature, visual recipe or generalized growth allowance.

## Evidence boundaries retained

- Browser virtual-clock/DOM lifecycle evidence proves callback ordering, not
  displayed-frame latency, FPS, GPU/raster cost or physical background behavior.
- Full sustained timing remains mixed and report-only: the unexplained recovery
  timeout, worse Full p95/p99 in the completed soak, occasional tails and missing
  >50 ms causal attribution all remain open.
- Existing soaks repeat one corridor in one maze; multi-maze transitions,
  music/resource retention and a timed Tauri/WebView2 cohort remain unqualified.
- No physical iPad/Safari result exists for this candidate. Lite's measured work
  reduction is promising but is not a device-success claim.
- The ignored external Playwright junctions are local tooling only. Publication
  must build from a clean isolated checkout with locked dependencies, not this
  working directory's ignored test setup.

## Exact next action

**Astra owns a bounded v0.22.1 promotion/publication turn.** Use a clean isolated
checkout of this accepted history, make only the coordinated application-version
change, validate and publish a SHA-named unsigned Windows portable plus canonical
web deployment and immutable manifest/checksum/playtest evidence. Preserve the
existing FP-UI1 preview profile so the affected saved run can be compared safely.

The Human then tests v0.22.1 on the affected iPad: Full+Full fresh and sustained,
Lite+Full, and Lite+Reduced in the same five-follower large maze. If that result is
green, proceed to the Tessera alpha hotfix and V22-PLAY-01. If Lite+Reduced still
stutters, do the already-scoped V22-PERF-02 isolation before V22-UI-01 or Agent 04.
Do not fold Chill/Regular/Zippy, stationary rescue, Tessera, Alex or UI work into
the preview transaction.
