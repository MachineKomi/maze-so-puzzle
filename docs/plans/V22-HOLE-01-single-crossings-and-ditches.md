# V22-HOLE-01 — single-width crossings and connected ditches

Status: Human-requested direction; manager-scoped, implementation pending.
Date: 2026-09-05. Backlog: PT-20260905-49.
Source: [audio/hole follow-up](../user-playtests/2026-09-05-audio-readiness-and-hole-crossings.md).
Owner: root rules/content integration with independent Sol/Astra review; bounded
art generation uses the approved house style and Human batch review.

Latest queue authorization: safe implementation may continue while physical
playtesting is pending. Preserve outstanding evidence and reviewed predecessor
contracts; absence of tomorrow's feedback alone is not a blanket stop.

## Intended rule

An ordinary Spring-Boots jump crosses **one hole tile along the movement axis**
and lands on the immediately following eligible non-hole tile. A second hole
along that axis blocks the jump. Equipment, direction, reachable landing and
one-action resolution remain explicit and consistent in engine, solver and hints.

A long north–south trench remains valid: east–west crossings span one tile;
moving along its long axis cannot vault the trench. A single pit at a T/+ path
junction may offer more than one legal crossing. A connected T/+ ditch is allowed
only where each intended crossing has a valid single-width landing. Its existence
does not create a multi-tile jump exception. The Human's exception concerns the
length/shape of the obstacle, not permission to jump two or three holes in series.

## Sequence

Preserve the published v0.22.1 comparison. Execute after its applicable device/
performance gate and the already queued Tessera, V22-PLAY-01 and V22-UI-01 seams.
Run after AUDIO-01A in the default sequential queue and before Plan 04. V22-PLAY's
stationary-rescue rules are then established before jump landings are adjusted.
Plan 04 consumes the joined hole occupancy/receiver boundaries; Plan 02/05 consume
the accepted single-jump events; Plan 09 consumes the resulting current campaign,
generator version and rule. Do not reopen completed Plan 03 as a full asset pass.

## Phase 1 — audit and make the content/rule change safe

- Read current engine, generator, solver/reachability/hints, contentIdentity,
  campaign revisions/order history, session/progress, travel/presentation and
  existing hole assets. Current unbounded runs and one/two/three-hole fixtures
  describe shipped history, not this new rule.
- Enumerate each authored hole component, legal approach, old landing and
  required/optional route. Preserve the praised dividing-room trench by actual
  semantic level ID/coordinates from current code, not a guessed chapter name.
- Remodel existing multi-width crossings into single-width alternatives while
  preserving their puzzle purpose, doors/portal ordering, rewards and optional
  rescue routes. Do not globally remove adjacent holes: a one-tile-thick strip
  can contain many holes without requiring a multi-hole crossing.
- Update generated placement to make only valid single-width crossings and
  purposeful dividing strips; validate candidate output before publishing a
  seed. No accidental two/three-wide moat or unreachable boots/exit/friend.
- Establish one shared transition rule. Preserve no-mid-air-turn and one
  committed action; safe jump→portal/other eligible landing presentation must
  complete exactly once and obey live held/released-input cancellation. Audit
  cages under the new stationary rescue contract; no remote rescue from across
  a ditch. Do not implement presentation-only collision rules.
- Treat this as a rules/content revision. Audit fingerprints and bump their
  rule identity where semantics change even if map pixels do not. Version the
  generator recipe; reconstruct or fail closed incompatible active snapshots
  while retaining durable completions, friends, rewards and unlocks. Preserve
  old best-step records as historical when no longer comparable. Recompute
  required/perfect routes and update documentation/expectations atomically.
  Current fingerprints have no global rule version and generated revisions are
  hard-coded to 1: an engine-only edit is insufficient. Audit the independent
  `session.maximumMovementStride` save plausibility bound as well as transitions.

## Phase 2 — small, clean art set and topology-aware rendering

- Generate a cleaner plum/aubergine pit with a clear rim, simple inner sidewall
  and dark depth: broad shapes, material-coloured contours, minimal scratches,
  micro-ledges and ornament. Preserve readability on all approved floor families.
  Compare the new candidate with the current sprite; Human reviews a compact
  named gallery, not a large calibration exercise.
- Use the smallest verified reusable set. Straight channel and cap rotations
  cover strips, but isolated pits, elbows, T and + junctions need compatible
  boundary pieces or a shared occupancy-derived mask. Do not claim two arbitrary
  images solve all topology. Derive connections from cardinal hole adjacency;
  diagonal neighbours remain separate. Never infer walkability from texture.
  A complete rotated tile family has six classes covering 16 cardinal masks:
  isolated, end, straight, elbow, T and +; a composited-boundary alternative must
  prove equivalent coverage from neighbours outside the visible camera too.
- Render one continuous dark interior with rims only on exposed boundaries:
  no internal caps, bright seams, fake stepping stones, leaks onto safe floor or
  edge pixels that imply a legal landing. Keep shape and depth in Lite/static.
- Neutral-light source pieces may rotate; directional highlights/cast shadows
  must follow the shared light and must not rotate inconsistently with each cap.
  Extend/reuse the existing terrain model rather than build a second renderer
  or persistent independent topology cache. Plan 04 owns final light integration.
- Preserve immutable originals, versioned transparent/registered derivatives,
  catalogue/provenance and measured asset/decode allocations. Keep preceding
  assets for rollback; Plan 12 remains the final archive owner.

## Phase 3 — verify and publish a reviewable checkpoint

Prove all four directions, missing equipment, one-hole success, two/three-hole
rejection, blocked/map-edge landing, one-tile strip crossing versus longitudinal
rejection, isolated T/+ path junctions, connected elbows/T/+ and diagonal pairs.
Keep rejected multi-hole tests as negative regressions. Replay all authored
ordinary/perfect routes with the current solver and representative deterministic
generated seeds. Confirm hints/reachability agree and migrations preserve durable
progress. No larger timeout/state budget may conceal an invalid design.

Inspect the single jump and followers in actual gameplay at every pace/motion
mode, including holds, steering/release, cancellation, camera edges and permitted
portal landings. Verify all accepted floors at gameplay scale, fractional camera
positions and iPad/desktop/phone DPR, plus bounded node/paint cost. Run relevant
engine/generator/solver/hint/save/art tests, full build/static gates and focused
browser/Tauri integration; retain physical comfort as its own evidence row.

Update gameplay/art/architecture truth, source lifecycle and Plans 04/02/05/09
consumers after implementation. Independent review precedes commit/push and a
clean-source family preview at a useful milestone. No code, source pixels,
release or old save data change merely because this plan is recorded.
