# V22-HOLE-01 — single-width crossings and connected ditches

Status: Phase 1 engineering-accepted and published in v0.22.8. Phase 2 has a
Human-selected rounded-square Candidate B (2026-09-06) and source-only connected
geometry preview; runtime publication/topology qualification remains outstanding.
The bounded proof repair is independently source-accepted and clean-checkout
qualified; [evidence](../reviews/2026-09-06-hole02-proof-and-source-checkpoint.md).
Date: 2026-09-05. Backlog: PT-20260905-49.
Source: [audio/hole follow-up](../user-playtests/2026-09-05-audio-readiness-and-hole-crossings.md).
Owner: root rules/content integration with independent Sol/Astra review; bounded
art generation uses the approved house style and Human batch review.

Current gate refinement: wall-only **Plan04-A** may proceed independently of this
art/topology work and PT36. Plan04-B receiver/ditch work consumes this qualified
surface; actor/held grounding still needs PT36. See the current addendum in
[Plan04](04-lighting-wall-depth.md). This supersedes the blanket sequence below.
Candidate B selection/delegated execution is recorded in
[Human selection](../source-assets/calibrations/hole02/human-selection.json).
No new selection question is needed; technical/gameplay integration and later
Human playtest acceptance are not implied by the preference.

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

Preserve all published comparison builds. Tessera, movement pace, stationary
rescue, bounded compact UI and audio calibration are already delivered through
v0.22.6; do not repeat those seams or require a repeated known iPad failure.
Phase 1 followed AUDIO-01A publication and is now delivered. Phase 2 remains in
the sequential queue before root PT36 and Plan04. V22-PLAY's stationary-rescue
contract remains authoritative for adjacent interactions.
Plan 04 consumes the joined hole occupancy/receiver boundaries; Plan 02/05 consume
the accepted single-jump events; Plan 09 consumes the resulting current campaign,
generator version and rule. Do not reopen completed Plan 03 as a full asset pass.

## Phase 1 — audit and make the content/rule change safe

This is the completed Phase 1 assignment and preflight history; current delivery
and evidence are recorded below. Do not rerun the old baseline instructions.

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
  Preflight fingerprints included `GAMEPLAY_RULES_REVISION = 2`: bump and
  reuse that authority, not a second version mechanism. The preflight generator
  had a `surprise-v5-...` recipe and hard-coded content revision 1; version its
  recipe deliberately. An engine-only edit is insufficient. Audit the independent
  `session.maximumMovementStride` save plausibility bound as well as transitions.

### 2026-09-06 preflight — first atomic delivery slice

Use current art for the rules/content preview; then pursue Phase 2 with its own
Human art gate. Do not couple a safe rule correction to volume asset generation.
Read-only geometric audit at `c114f8a` found these existing multi-width crossings
(zero-based coordinates, not a new solver proof): Wishing Woods `(6,3)–(7,3)`;
Ame's Grand Parade `(1,10)–(1,11)`; Springstep Sky Hollow `(8,1)–(9,1)`;
Lanternlight Labyrinth `(2,9)–(3,9)`; Twilight Treasure Loop `(19,13)–(19,15)`;
Moonlit Friendship Quest `(15,18)–(15,19)`; Clover Comeback Carnival
`(11,11)–(11,12)`. Revalidate names/coordinates and approach/landing semantics
against implementation HEAD before editing; preserve purpose with minimal maps.

Preserve Friendship Crown Vault's north–south strip `(12,9)–(12,15)`, capped by
walls north/south, with east–west one-width crossings. Preserve Lanternlight's
isolated four-way pit `(8,4)` and Sky Hollow's isolated `(10,9)`.

Audit three seams explicitly: remote door/combat resolution after a jump currently
can happen from the origin (cage rejection already exists); jump→portal emits two
events while App dispatch currently prioritizes the jump; save stride must cover
the composed jump plus portal displacement, not underestimate it with a plain
maximum of the separate distances. Define eligible landings consistently. Replace
old positive length-2/3 generator/level tests and complete-row hint teaching with
negative regressions and truthful single-width teaching. Keep the existing
`tileTravel`/`useSceneTravel` owner and test all paces, cancellation and followers.

### Phase 1 contract locked with independent Sol review (2026-09-06)

Delivered checkpoint: HOLE-01A / v0.22.8, based on published v0.22.7 `9b82228`.
Impossible +2 geometry (second hole, wall, bounds) blocks before suggesting
Spring Boots. Eligible geometry then requires Spring Boots and any pre-existing
hazard protection. Unresolved door/enemy/cage cannot be a landing, regardless
of equipment; resolved versions are floor again. Passive pickups, exit and
portal are eligible. Jump→portal emits jump, warp, moved once, increments one
step and presents both phases without an intermediate unlock or duplicate save.
The same cancellation generation owns both; followers stay hidden through both.

Seven authored maps gain revision 4 through eight hole→floor edits, no object
movement/renumbering. Rules revision 3 applies globally; recipe `surprise-v6`
and generated content revision 2 reserve both approach and landing against
hazards, cages and later guardians.
Durable progress survives; previous unfinished authored runs restart with the
existing updated-maze notice and previous bests remain historical. No new save
schema, art, camera policy or particle system. Source-only checks are not physical
play-feel acceptance. Phase 2 and root PT36 still precede full Plan 04 rollout.

### Phase 1 published evidence (2026-09-06)

Frozen `3acaf5872dd921f15929c330eeae46053b2a6362` is engineering/native accepted
and published on web/Windows with four independent downloads verified. See
[acceptance](../reviews/2026-09-06-v0228-engineering-acceptance.md),
[Sol final review](../reviews/2026-09-06-hole01a-sol-native-final-review.md),
[manifest](../../release/HOLE-01A-v0.22.8-manifest.json) and
[receipt](../../release/HOLE-01A-v0.22.8-release-verification.json).
623 project tests, current ordinary/perfect routes, production browser 20,
synthetic exact-App jump→portal 15 and real browser pad 3 passed. Actual native
keyboard/pad jumps and normal close/reopen preserved run/progress/preferences.
These separate cohorts do not prove continuous native paint or physical comfort.
P12 and cumulative P5–P11 remain open; v0.22.7 is the immediate immutable fallback.

Fresh art unit tests pass 136; **fresh full-art validation failed**. Root/Sol accept
only inherited static-art qualification: 1,535 tracked blobs across 16 scopes are
identical to validated v0.22.5 through v0.22.7; original 0-error/429-warning evidence
is bound to the published manifest. The ignored-proof/EOL/stale-manifest failures
remain recorded and must be repaired before new art or a fresh-clone pass claim.

Two early native jump captures showed Power/boots before Ame/weapon painted;
a later mid-jump capture was complete. The async image/remount path is inherited,
not a proved new rules defect. Keep a bounded first-paint/native-capture follow-up
if actual blanking is visible; do not claim uninterrupted actor/follower visibility
from settled screenshots or DOM roots. No iPad-camera improvement is claimed.

## Phase 2 — small, clean art set and topology-aware rendering

- First repair only historical ignored-proof availability and LF/CRLF byte-
  authority reproducibility, retaining original evidence and approved sources.
  Do not rewrite hashes simply to silence failures or borrow Phase 1's unchanged-
  input art acceptance after publishing changed inputs. This bounded repair is
  not a new art-direction exercise or a full Plan03 restart.
  The [reviewed preflight](../reviews/2026-09-06-art-proof-reproducibility-preflight.md)
  separates the mandatory v14 index plus 48 children (restore exact archived
  bytes, never regenerate approval) from optional ambient-canary current-input
  compatibility (explicit selection, with historical integrity kept distinct).
  Residual manifest staleness needs a non-writing field-level diff; it is not
  wholly explained by EOL. Preserve mandatory missing/tampered-evidence failures.
- New clean-pit/ditch art publication is blocked on explicit Human approval and
  technical topology/alpha/readability/performance qualification. Proof repair
  and compact candidate preparation can proceed while family tests are pending;
  no approval follows from silence. Root Astra owns delivery, actual Sol reviews.
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

Phase 1's published preview does not waive these remaining Phase 2 art/topology
checks. After their accepted checkpoint, root PT36 still precedes Plan04.

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
