# V22-PERF-02 — isolate moving-camera cost on the affected iPad

Prepared 2026-09-05 by Astra. Updated 2026-09-06: PERF-02A is published as
**v0.22.2 V22-CAMERA1**, exact runtime `820ed39f00e8c6bd808a0c084ccc2c67396ebb13`.
Actual GPT-5.6 Sol High independently accepted the coordinate/source evidence,
final test-observer correction and bounded native Exit exception. See the
[source review](../reviews/2026-09-05-v22-perf02-camera-preview.md) and
[release receipt](../../release/V22-CAMERA1-v0.22.2-release-verification.json).
Engineering/delivery pass; physical iPad efficacy remains pending. No further
camera change is in flight. If P1 still fails, resume the follow-on isolation
below. Safe independent art/pace/rescue seams may proceed under Human authority.
Baseline: published v0.22.1 `8442b79`, accepted R1 input corrections unchanged.
Read current main/working-tree status and the [joint state](../JOINT_ORCHESTRATION_STATE.md)
before execution. The independent Tessera candidate is backed up on its branch;
it need not delay this movement investigation or contaminate its A/B comparison.

## New evidence and purpose

### PERF-02C preflight — 2026-09-06

[Layer preflight](../reviews/2026-09-06-perf02c-layer-preflight.md) is reviewed by
root Astra against current camera/world ownership. Approve its first bounded
engineering experiment after PLAY-B writer handback: one exploration-world
`transform: translateZ(0)` rule in Full/Lite, preserving travel-owned individual
`translate` and excluding Static. This is not approval to publish the hint or
claim an iPad fix. Begin with a restored baseline/hint/baseline mechanism check;
only advance if worthwhile to the specified DPR/large-world/visual/lifetime gates.
No broad renderer or art reduction. Root must review any unmeasured compositor
memory risk before offering a clearly identified physical-device experiment.
No layout changes or other heavy cohort may overlap its matched measurements.

### PERF-02B external desktop isolation — 2026-09-06

[Reviewed results](../reviews/2026-09-06-perf02b-moving-terrain-review.md): 15/15
restored rows and 120 legal moves, with no reproduced iPad-like fault. Terrain,
filter and fill probes were inconclusive on this shared laptop. A single world
layer hint reduced recorded paint work and produced one extra Chrome layer;
candidate-only evidence, not Safari efficacy or measured GPU cost. Next bounded
experiment requires DPR/large-world/resource/seam checks and independent review.
No runtime hint or source-resolution reduction was published by this diagnostic.

### Physical v0.22.2 result — 2026-09-06

[Human feedback](../user-playtests/v0222-playtest-feedback.md): no obvious
regression, perhaps slightly better, but iPad scrolling still stutters while
clamped-camera actor/animation movement is buttery smooth. The gate remains
unfulfilled; older pending language above is pre-feedback release history.
Possible thin lines are uncertain; related moving-line reports predate v0.22.2.

Next run baseline → probe → baseline on the existing Maze-2 route:

1. Temporarily hide only terrain SVG, preserving world geometry, simple world
   markers, actor, gameplay and camera coordinates.
2. Separately disable inline floor treatment and inline wall treatment. Lite
   leaves them active; diagnostic overrides must beat inline styles.
3. Separately remove wall-depth blur (if active) and highlight blending.
4. If indicated, replace floor then wall texture with existing solid fallback
   fills. Decoded images may remain, so this is not a memory-reduction result.
   Compare source resolution at fixed repeat scale only if sampling matters.

Keep geometry-readback separate from timing cohorts; record settings, board
pixels/DPR, input and sampled coordinates. No per-frame console or forced-layout
reads in timing runs. Keep baseline cadence even when PLAY-A becomes ready.
Desktop measurements cannot close the physical-iPad gate.

Source findings: Maze2 moves an 11×11 terrain SVG through a six-tile view; base
images are 1024px with 4.2/4-tile repeats. It has no dressing or hazards. Other
dressings are 512px but repeat over 13–14 tiles, explaining oversized decoration
without explaining Maze2's failure. Required resolution depends on physical
board pixels/DPR. Appearance calibration remains a separate PT15 change.

The [Human's saved feedback](../user-playtests/v0221-playtest-feedback.md) reports:
phone movement is buttery smooth; eighth-generation iPad (32GB storage) Maze 1
is smooth but movement from Maze 2 is severely laggy, even a single step. Menus,
door/battle/rescue/pickup animation and BGM remain responsive. A later chat
clarification says minimum graphics/motion options help only slightly and identifies
the phone as a Samsung S25 Plus or similar. Exact iPadOS/browser/control values are
not yet known. Do not infer RAM capacity from storage or dismiss the device by age.

The observed iPad movement gate failed. Missing settings details do not prevent
investigation. Keep physical acceptance open; desktop measurements cannot close it.
This slice precedes pace choices, broader UI work, lighting, VFX and Garden systems.
Chill is an accessibility preference, not the required fix for bad frame delivery.

## Ranked hypotheses, not established causes

1. Maze 1 is 6×6 and fits the view; Maze 2 is 11×11 and scrolls with six visible
   tiles. The memoized full-world SVG still moves. `cameraWorldStyle` updates
   CSS `left`/`top` at each committed camera step, then `useSceneTravel` applies
   a compensating fractional `translate`. This may cause avoidable layout/paint
   work or composition costs. React memoization alone does not prove cheap pixels.
2. The larger moving surface and its floor/wall treatment filters, wall-depth blur
   and highlights may scale poorly with painted area/DPR. Maze 2 has no water,
   lava or poison: those hazard effects cannot explain its initial failure.
3. Movement-triggered minimap/exploration/React/persistence work may still matter.
   Existing R1 counters leave ordinary-move work in place. Measure it; do not
   weaken synchronous save durability or assert an unmeasured GPU explanation.
4. Followers and sustained resource growth remain later cohorts, but fresh Maze 2
   starts with zero followers. Do not require a ten-minute five-follower soak to
   investigate an already visible early-maze defect.

## First controlled routes

Use ordinary Maze 2, Shiny Sword, unchanged rules, fresh state and zero followers.
Coordinates are zero-based; both segments avoid interactions and collectibles.

- Camera clamped: spawn `(9,9)` ↔ `(8,9)`, camera origin `(5,5)`.
- From spawn, Left, Left, Up, Up reaches `(7,7)`, still camera origin `(5,5)`.
- Next Up reaches `(7,6)` and scrolls the camera to `(5,4)`. Repeat Down/Up
  between `(7,7)` and `(7,6)` for the scrolling comparison.
- Begin with separated taps, then short holds and reversals. Record actual input,
  committed state, painted actor/camera positions, board pixels/DPR, quality/motion
  and build identity. Use normal saved runs for durability evidence; clearly label
  tester-only geometry probes rather than presenting them as persistence tests.

## PERF-02A — smallest implementation experiment

Keep the full world's layout origin fixed and let the existing single travel
owner express the **complete sampled camera offset**, instead of combining
per-tile layout rebasing with a compensating animation offset. This is a bounded
coordinate change, not a new renderer, camera behaviour, FOV, cadence or art style.
Prove the output geometry equivalent for every sampled camera position.

Explicitly cover initial mount, both axes, clamped edges, isolated first taps,
held turns/reversal, resize, portal/jump discontinuities, replacement actors,
world-anchored feedback and follower insertion/removal. Static/no-travel mode must
still present the correct current crop. Hidden/blur/menu cancellation and R1's
final-phase unlock ownership cannot regress. No per-frame React state updates.

Instrument baseline and candidate separately using the existing diagnostic
conventions. Confirm that per-step world `left`/`top` writes actually disappear;
capture layout/paint/frame observations and screenshots at settled and mid-step
positions. Do not mistake synthetic rAF rate for displayed-frame latency or
claim physical-iPad success from a local experiment. Record rejected runs.

If the small coordinate change is mechanically sound and regression-tested,
Sol may accept a clearly labelled preview for the Human's affected-device test
without claiming it fixes the cause. If it does not help on that device, proceed
to the next isolated probe rather than decorating the same unsupported claim.

## Follow-on isolation if needed

Use a diagnostic-only pinned-camera variant for the short visible scrolling
segment, retaining actor movement and gameplay truth. Then compare one factor at
a time: physical board pixel area at fixed FOV; wall-depth filter; floor/wall
treatment filters; minimap derivation; measured save work. Keep diagnostics outside
normal delivery or explicitly dev-gated; no permanent hidden runtime setting.
The current Static mode disables smooth travel, so its reduced work is not an
equivalent smooth-animation success criterion. Obtain exact setting values when
available; never silently relabel “minimum” as a measured Lite/Reduced cohort.

Do not add Canvas/WebGL, rasterize all terrain, bake directional sprite shadows,
lower asset quality globally, increase travel lag, slow controls or reduce FOV as
an assumed solution. A larger renderer change needs its own measured rationale
and ownership contract with Plan 04/02/07B. No new framework or dependency.

## Gates and delivery

- Focused coordinate/travel/input tests plus serial full project/build,
  performance contracts and relevant existing browser journeys. Do not introduce
  new authored fixtures by silently modifying campaign content.
- Compare source and bundle deltas; code-only experiment adds no public media.
  Current exact ceilings still apply; a measured named allocation needs root
  approval before growth beyond them.
- Independent Sol source/geometry/input review before main promotion. Preserve
  v0.22.1 artifacts and corrected R1 input behaviour; keep Tessera publication
  separate in evidence even if bundled in the next playable checkpoint.
- Produce a clearly versioned web and Windows preview when accepted. Verify CI,
  canonical deployment bytes and downloads; a Git push alone is not publication.
  Add concise Maze-2 comparison instructions to the cumulative checklist.
- Physical iPad smoothness remains open until tested. Carry renderer cost and
  bounded-work requirements through 04/02/05/07B/10; “add polish now, optimize
  later” is not the programme's delivery strategy.

No Human decision blocks PERF-02A. Optional environment clarification is D04 in
[HUMAN_DECISIONS](../HUMAN_DECISIONS.md). Preserve all received results in
[PLAYTEST_CHECKLIST](../PLAYTEST_CHECKLIST.md).
