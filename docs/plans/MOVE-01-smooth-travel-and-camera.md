# MOVE-01 — comfortable character travel and camera following

Status: Human-authorized implementation, pending accepted Plan 01. Owner: root.
Prepared 2026-09-05 from the Human's follow-up and `PT-20260902-07`.
No implementation or comfort acceptance is claimed by this plan.

## Outcome and boundaries

Holding a direction should feel as pleasant and predictable as taking a single
step. Keep exact tile-based rules while coordinating smooth character travel
and camera following. The family currently avoids holds because background
jerkiness makes play less pleasant and slower; the game is not wholly unplayable.

Run after the reviewed/pushed UI checkpoint, before FP-UI1 and Agent 04. Read
the vision, roadmap §5.13A/B, complete accepted UI spec, Gameplay spec,
`cameraMotion.ts`, `movementControls.ts`, pointer/exploration code and current
presentation lifecycle. Inspect actual symbols rather than assuming this
planning snapshot survived UI extraction.

Preserve collision, solver/reachability, save truth, six-tile camera policy,
fog rules, exact cardinal steps and the existing held cadence. Do not add free
analogue movement, sprinting, wall hopping or Plan 08's anchored joystick here.
Smooth visuals are an interpolation of committed state, never extra legal steps.

## First comparison, before wide integration

1. Capture identical deterministic routes in a static-camera small maze and
   scrolling mazes, in production mode. Record build/viewport/input, accepted
   move times, frame intervals, actor/camera positions and bounds. Identify
   timing stalls separately from stop/start motion on regularly delivered frames.
2. Compare coordinated transform easing, bounded velocity/catch-up, and gently
   damped following using the same inputs. Start with one compact harness scene
   and real-maze integration; use existing rendering instrumentation.
3. Recommend one recipe by input response, relative actor/background motion,
   exact stopping, corner legibility and comfort. A small follow dead zone is a
   comparison candidate only; it may not reveal hidden tiles, change the FOV
   rule or add directional look-ahead without explicit design review.

Do not promise constant travel through the deliberate 320ms first-hold pause or
predict uncommitted steps. Current repeat cadence starts at 260ms and approaches
160ms; a new target arriving during travel must not restart an easing curve
from the previous tile or accumulate an ever-growing presentation queue.

## Travel contract

- One presentation owner resolves actor world position and camera offset on one
  elapsed-time basis. Publish its module, update inputs, settled state,
  cancellation semantics and transform slots in the accepted UI/Architecture
  docs. Plan 02 owns effect timelines; Plan 08 owns input normalization; Plan 05
  owns sprite poses. They do not write this owner's travel transform.
- Render position is distinct from engine position. Presentation may lag within
  a measured bounded interval but never grant a future move or write a save.
  Do not read DOM layout each frame; resize invalidates measured transforms at
  a defined boundary. No whole-App/grid rerender loop for interpolation.
- Follow the committed orthogonal path at corners. Interpolating diagonally
  between a delayed old position and the newest destination must not visually
  cut through a wall. Reversal cancels forward intent without overshoot or
  oscillation. Blocked moves do not slide into a door, guardian or hazard.
- Keep relative transforms correct when the camera stops at an edge but Ame
  continues. Fog, culling gutters, markers, grounding and sprite registration
  must not leave exposed strips or stale destination overlays during travel.
- Pointer/touch targeting consumes the declared current visual geometry with
  legal engine intent preserved. Do not compute against two competing actor
  centres. Plan 08 later replaces drag intent with its anchored model.
- Ordinary arrival settles exactly on the committed tile. Stationary door open
  keeps Ame visibly at origin; portal/jump/combat/rescue travel hands ownership
  to the current presentation rather than drawing a straight line through the
  world. Pending exit never banks rewards merely because travel finishes.
- Modal, navigation, hidden/visible, resize, restart and unmount paths specify
  settle versus cancel behavior. There is no stale rAF, queued step or later
  callback to a former level. Resume never catches up missed movement.
- Import canonical motion preferences. Compare a comfortable reduced-motion
  recipe, keep manual choice respected, and preserve all static meaning. A
  static option is not automatically comfortable just because it has no tween.

## Acceptance and evidence

### Bounded follower correctness extension — 2026-09-05

The v0.20.1 wishlist/PT40 asks for followers to stay on Ame's actual corridor
trail even off camera. Include a bounded cosmetic breadcrumb repair alongside
the travel integration. This is explicitly root-owned; Plan 05 still owns only
poses and may not introduce navigation. Do not begin while Agent 01 runs.

Inspect `src/game/followerTrail.ts` and the final renderer at the accepted UI
checkpoint. The read-only lead is that repeated coordinates are removed and
camera-visible points are selected before rescued friend indices are assigned.
Preserve ordered committed path history and each friend's stable identity/slot
before camera culling. Going offscreen changes visibility, not world position.
Repeated visits/reversals cannot shortcut a trail across an unrelated corridor.
Keep storage bounded by the required follower distance; no per-frame pathfinder.

Define explicit discontinuities for rescue start, portals, jumps, restart and
level/resume boundaries. Ordinary travel follows legal breadcrumbs; never tween
through walls or fabricate legal engine steps. Preserve existing save, collision,
reward and rescued-friend semantics. Zero through five followers, long offscreen
trails, loops, reversal and edge clamping require identity/route assertions plus
browser evidence. Camera/resize/future zoom changes alone cannot rearrange the
procession. Feed the same world-position snapshot into lighting/VFX/pose consumers.

If a repair needs new gameplay AI, new reachability rules or a broad save schema,
record a named root prerequisite before affected animation with exact remaining
scope, rather than silently expanding MOVE-01 or delaying FP-UI1 for the entire
wishlist. The Human's latest request authorizes this bounded correction, not
analogue movement or a second follower travel clock.

Also observe PT33's reported dark line in Rainbow Power Parade and Twilight
Treasure Loop across the before/after camera route. Correct a demonstrated
travel regression here; otherwise preserve an exact fixture for Plan 04's
layer/material diagnosis. An animated decoration is a hypothesis, not a cause.

### Required travel evidence

Use pure clock/coordinate tests for intermediate turns, reversal, clamping,
retargeting, frame-rate independence and cancellation. Reuse current engine,
pointer, held-input, door, pending-completion and save tests. Test actual browser
routes with keyboard, board pointer/touch and on-screen controls; controller
qualification remains Plan 08. Cover 30/60/120Hz simulated clock sequences,
variable frames and a deliberate long stall without changing move counts.

At all seven Plan-01 viewports, Normal/Big and DPR 1/2 representative cases:

- taps settle once; holds look continuous after cadence startup without visible
  per-step easing resets; no uncontrolled drift or wall-cutting;
- frequent turns, one-cell gaps, reversals and clamped edges remain legible;
- overlays, stationary door opening with safe held-input cancellation,
  jump/portal entry, exit/Stay, restart and hide/show preserve both visuals and
  authoritative state; preserve any already accepted continuation contract,
  but implementing the new live-hold door token remains Plan 08's work;
- full/reduced motion, pointer alignment, fog and VFX anchors remain correct;
- compare input-to-first-visible-response, frame distribution and layout/paint
  cost against the same pre-change cohort. Record concrete travel duration/lag
  bounds selected from the comparison, not arbitrary unmeasured promises.

Run focused tests, `npm run check`, `npm run check:desktop`, shared performance
contracts and `git diff --check`. Preserve the existing clean-host policy:
p95 ≤20ms reference / ≤33.3ms defined low-end and no movement task >50ms are
targets until qualified measurements support them. A good trace cannot establish
Human comfort; FP-UI1 includes that pending comparison with the family.

## Checkpoint and delivery

Root reviews exact changes, dependency compatibility, bytes and evidence, then
commits/pushes. Build FP-UI1 from a clean exact SHA under roadmap release rules:
next unused version, isolated profile, CI/Vercel verification, canonical web
smoke, real portable launch/journey, manifest/checksum, immutable GitHub assets.
Use `../playtests/FP-UI1-checklist.md`. If a prior UI preview already exists,
publish a new version/revision; never relabel that binary.

The implementation report records the selected/rejected recipes, travel API,
route clips/measurements, checks and any explicit pending comfort/device rows.
Keep rollback at the complete movement checkpoint; do not carry two production
travel owners. Downstream owners consume this contract and report regressions.
