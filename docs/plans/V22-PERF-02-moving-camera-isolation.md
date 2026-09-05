# V22-PERF-02 — isolate moving-camera cost on the affected iPad

Prepared 2026-09-05 by Astra. Active next runtime slice; Sol reviews read-only.
Baseline: published v0.22.1 `8442b79`, accepted R1 input corrections unchanged.
Read current main/working-tree status and the [joint state](../JOINT_ORCHESTRATION_STATE.md)
before execution. The independent Tessera candidate is backed up on its branch;
it need not delay this movement investigation or contaminate its A/B comparison.

## New evidence and purpose

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
