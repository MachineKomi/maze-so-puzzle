# V22-PERF-01 — sustained play and live-input correction

Status: Astra candidate implemented on `codex/v22-perf-01-astra`; bounded checks
and measurements recorded. Sol's independent
[candidate review](../reviews/2026-09-05-sol-v22-perf01-candidate-review.md)
returned one P1 chained-presentation unlock race and one P2 stale ThumbPad
reverse-takeover state. Astra's [R1 return](../reviews/2026-09-05-v22-perf01-r1-response.md)
is ready for a short independent Sol re-review. One recovery timeout, mixed sustained timing and task attribution also
remain unresolved; no full engineering or Human acceptance is claimed. The
[candidate receipt](../reviews/2026-09-05-v22-perf01-candidate.md) owns measured
status; this brief remains the acceptance contract.

## R1 review return — 2026-09-05

The candidate's redundant-work reduction, anchored drag, truthful Lite mode,
ordinary held-success continuation, blocker behavior, scene binding and tester
finale are accepted in direction. Before promotion:

1. final-phase completion—not an original nominal aggregate timer—must own
   unlock/resume for delayed jump-to-battle/rescue/door chains, generation-guarded
   against cancellation and supersession;
2. reverse source takeover must reset ThumbPad's component gesture, highlight and
   pointer capture as well as App-level repeat state; and
3. deterministic tests must stall a real jump-to-rescue handoff and exercise
   reverse ThumbPad takeover without weakening healthy continuation coverage.

R1 must not change cadence, Full/Lite recipes, performance optimizations, engine
content, media, save schema or version. The new Human requests for pace modes,
stationary cage rescue, Tessera repair and Alex are routed separately and cannot
be smuggled into this measured diff.

Owner: **GPT-6 Astra**
Independent reviewer: **GPT-5.6 Sol**
Human gate: physical older-iPad sustained play and interaction comfort

This is a deliberately bounded early slice of Plans 07 and 08 plus one small UI
input-safety repair. It responds to the v0.22.0 Human blocker without starting
Plan 07B, changing campaign design or reopening the accepted UI/art direction.

## 1. Goal

Make large-maze play materially steadier over a session and make still-held input
survive successful in-world presentations. Produce evidence that distinguishes
React work, scene binding, paint/effects, followers, persistence and session
growth rather than claiming a cause from stylesheet counts.

Full quality must retain the accepted v0.22.0 desktop/iPad appearance. Lite must
become a truthful lower-cost scene option. Human/device acceptance remains
pending until the published candidate is played on the affected iPad.

## 2. Read before work

Read completely, in this order:

1. `docs/JOINT_ORCHESTRATION_STATE.md`
2. `docs/user-playtests/v0220-playtest-feedback.md`
3. `docs/reviews/2026-09-05-astra-v0220-review.md`
4. `docs/reviews/2026-09-05-sol-v0220-review.md`
5. `docs/reviews/2026-09-05-sol-astra-opus5-v4-disposition.md`
6. this brief and the current addenda in Plans 07 and 08
7. `docs/GAME_VISION_AND_DESIGN_SPEC.md`, `docs/UI_UX_SPEC.md`,
   `docs/PERFORMANCE_BUDGETS.md`, `docs/ARCHITECTURE.md`, the current performance
   harness/fixtures and the exact runtime source/tests

Inspect HEAD, branch, working tree and `origin/main` before editing. The frozen
runtime baseline is v0.22.0 at `68e303d`; execution starts from the clean pushed
documentation checkpoint named by the joint state. Current source wins over old
line numbers.

## 3. In scope

### 3.1 Characterize the same product state

Use production builds and the existing semantic scenario harness. Record exact
level/revision/route, viewport, DPR, browser/WebView, input surface, quality,
motion, follower count, starting/final game state and session condition.

At minimum compare:

- a representative large authored maze with identical semantic routes;
- keyboard, fixed ThumbPad and board drag separately;
- 0, 2 and 5 followers where fixtures can establish them honestly;
- a fresh session and a sustained multi-maze/ten-minute session;
- Full versus Lite, with Motion Full and Reduced recorded separately;
- retained active-run persistence versus a measurement-only harness bypass or
  instrumentation, without changing shipped durability.

Collect App commits attributable to pointer/cursor work, MiniMap render/derivation
counts, scene binding/query counts, action-to-next-paint, frame interval tails,
long tasks and supported memory/resource trends. Do not use FPS alone. CSS rule
counts are inventory, not active cost.

### 3.2 Remove high-confidence redundant hot-path work

- Stabilize the MiniMap's object/current-view inputs by meaningful revisions so
  coordinate-only cursor/HUD/presentation commits do not rebuild unchanged
  23×23 cells. Preserve reveal, camera, player and semantic marker accuracy plus
  nonvisual descriptions.
- Keep board cursor coordinates outside whole-App React commits when semantic
  direction is unchanged. The visible cursor must remain smooth; direction
  changes must steer immediately. Do not break player-relative taps or
  origin-relative drags.
- Instrument `useSceneTravel` before refactoring it. If repeated DOM discovery is
  material, separate node-set/binding work from lightweight retargeting. Preserve
  replacement actors, follower insertion/removal/order, resize, DPR, run changes,
  portal/jump discontinuity, blur/hidden cancellation and exact settled geometry.
- Instrument synchronous active-run normalization/serialization/write cost. Do
  **not** batch, defer, weaken or change its loss window or schema in this slice.

Land independent rollback seams. Do not hide a regression by weakening an
assertion, widening a timeout or changing the route/final state.

### 3.3 Preserve live physical intent through eligible success

Separate physical intent identity from repeat scheduling for keyboard, fixed pad
and board pointer:

- a successful door, combat, rescue, portal or eligible jump suspends cadence but
  retains a genuine still-held input;
- steering and release during the presentation update that live intent;
- after the presentation/input lock ends, resume at a fresh normal first-step
  cadence from the current direction only if the input is still physically held;
- never replay queued moves, catch up after a stall, use a stale direction or
  move after release;
- a genuine blocker/modal, blur, hidden page, cancellation, loss, victory,
  restart, scene change and level change clear or require a fresh input as
  appropriate;
- a tap never becomes a hold.

Every fresh deliberate under-powered or missing-capability attempt shows its
actionable explanation. One continuously held blocked gesture produces at most
one explanation until release/neutral, so it cannot flood dialogs or live regions.

### 3.4 Make quality relief truthful

Profile independent scene cohorts: terrain SVG/effects, live filters/shadows,
ambient infinite animations, follower presentation and the active joystick blur.
Use those comparisons to implement the smallest useful Lite scene recipe.

- Full retains the accepted visual reference.
- Lite removes or substitutes named measured costs while preserving all puzzle
  information, object identities, readable grounding and smooth ordinary travel.
- Motion Full/Reduced remains a separate user concern; Lite must not merely
  rename reduced motion or alter two UI tokens.
- Preserve current Static compatibility unless an explicit reviewed test earns a
  correction; do not silently redefine travel semantics here.
- Do not edit source sprites, bake directional shadows into art, introduce a new
  renderer, rasterize the whole terrain, add Canvas/WebGL or start Plan 04/02.

If safe hot-path/Lite changes do not resolve the local symptoms, leave the gate
open and return with the evidence for a separate renderer-isolation tranche.

### 3.5 Small correctness and safety repairs

- Prevent text selection, image dragging, iOS callouts and tap flashes on
  non-editable gameplay chrome while preserving real editable/selectable content,
  intentional Book/story scrolling, keyboard navigation and assistive access.
- Characterize normal, replay/unlocked and tester final-maze flows. Normal already
  calls `makeSurprise()`; do not patch that branch without reproducing a defect.
  Correct whichever production-visible path caused the report: every final-maze
  completion must show a truthful next destination and must not unexpectedly wrap
  to Maze 1. A development-only tester path may differ only when it is clearly
  isolated and labelled, with tests for that distinction.

## 4. Explicitly out of scope

- Phone/Book responsive layout, pad-chevron visuals, Bestiary presentation, lore
  browsing, generated-size labels, pickup scaling, Book optics, focus polish or
  victory composition. These belong to V22-UI-01 after this baseline.
- Camera FOV/window shape, cadence/speed tuning, new camera spring/dead zone,
  pixel snapping or controller/gamepad work.
- Terrain topology/lighting/masks, cached-raster/canvas renderer, VFX director,
  sprite animation, new art/media or public-asset changes.
- Persistence batching/schema changes, audio/OST, loading/code splitting,
  retirement/package optimization or the remainder of Plan 07B.
- Engine rules, campaign/generator/content, economy, co-op or broad `App.tsx`
  architecture targets.

## 5. Acceptance

### Mechanical and input

- Coordinate-only board dragging causes no App commit; semantic direction changes
  still steer immediately and the cursor remains visually smooth.
- Unrelated cursor/HUD/presentation commits do not reconcile unchanged minimap
  cells or recreate equivalent large collections.
- If travel binding changes, unrelated commits do not rescan its DOM; every named
  node-set/geometry/discontinuity lifecycle test remains exact.
- The success-continuation matrix passes for keyboard, fixed pad and board drag,
  including steering/release during each presentation. There is no catch-up,
  post-release movement, stale direction or blocked-hold flood.
- Every new deliberate failed press/gesture explains the blocker once. Modal,
  blur, hidden, cancellation, victory and level-boundary clearing remains safe.
- Every production-visible normal/replay final flow has a truthful tested
  destination and does not unexpectedly wrap to Maze 1. Any development-only
  tester behavior is isolated, labelled and separately tested; no speculative
  change is made to an already-correct branch.

### Performance and presentation

- Matched production cohorts report before/after counters and timing distributions,
  with identical routes, state and settings. Missing/contaminated evidence is
  labelled, never upgraded to a pass.
- Full-quality screenshots at 1920×1080, 1194×834, 844×390 and 568×320 retain
  the accepted Title/Home/maze/HUD/minimap/art composition. This is a regression
  check, not acceptance of current phone fit.
- Lite has an explicit documented disabled/substituted-cost matrix and a measured
  reduction in its targeted work. It remains attractive and semantically complete.
- Report and attribute every observed gameplay task over 50 ms and compare the
  current Plan-07 reference p95/p99 targets in matched before/after cohorts. Show
  no regression and a material improvement in the targeted work; these timing
  targets remain report-only until a qualified clean-host/device cohort exists.
  Do not claim physical-iPad success from desktop emulation.
- No public-byte growth. The tiny remaining compressed-code budget is not blanket
  authorization; offset growth or add a reviewed allocation with evidence.

### Required checks

Run focused unit/fixture tests during work, then serially:

- `npm run check`
- `npm run perf:check`
- the relevant Plan-07A scenario fixtures and production browser cohorts
- `npm run check:desktop`
- `git diff --check`

Store heavy traces outside runtime delivery and commit only compact reproducible
summaries/manifests with hashes. Preserve the current 11 scenario IDs.

## 6. Handoff, review and publication

Do not version, tag, publish a release or merge an unreviewed candidate to
`main`. At a green deterministic checkpoint, preserve the candidate on a
recoverable `codex/` branch and push it, or leave a cleanly named local candidate
commit if remote branch publication is unavailable. Report exact SHA, diff,
measurements, rejected experiments, checks, remaining physical gates and branch
state.

Sol then reviews the exact candidate read-only against this contract. If accepted,
the joint manager promotes it to `main`, verifies CI/Vercel and prepares a
v0.22.1 performance/input preview, including a Windows portable if desktop/Tauri
comparison remains needed. The Human then repeats the same affected-iPad route
fresh and after sustained play plus the held-success/failure matrix. Do not start
V22-UI-01 or Agent 04 until the performance result is accepted. If evidence
routes the work to a second renderer-isolation tranche, both remain held until
that tranche is also reviewed and accepted.
