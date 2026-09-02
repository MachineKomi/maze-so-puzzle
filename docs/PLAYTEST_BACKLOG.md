# Maze so Puzzle — playtest backlog

- Status: living manager-owned intake, routing and acceptance ledger
- Created: 2026-09-02
- Current accepted implementation checkpoint at triage:
  `ee176f52ab79e08e818fc919f44b7723f9fc9865`
- Source intakes:
  [`playtests/2026-09-02-wishlist-and-issues.md`](playtests/2026-09-02-wishlist-and-issues.md)
  and
  [`playtests/2026-09-03-continuous-context-music.md`](playtests/2026-09-03-continuous-context-music.md)

## 1. Purpose and authority

This backlog turns Human and family playtest observations into stable work items
without silently treating an old-build report as proof about the current source.
It is the authority for request status, routing, acceptance slices and retest
evidence. It is not itself an implementation plan.

Authority boundaries:

- Direct Human product decisions and observed family reactions are labelled as
  such and take priority over earlier planning assumptions.
- A current-code audit may confirm an implementation mechanism, but cannot by
  itself prove that a subjective play-feel problem has been fixed.
- Solver metrics, automated tests and traces are supporting evidence. Only a
  Human/Amelia playtest may earn `Family-tested` status.
- Durable, accepted product rules should later be promoted into
  `GAME_VISION_AND_DESIGN_SPEC.md`, `GAMEPLAY_DESIGN_SPEC.md`, `STORY_BIBLE.md`
  or the relevant specialist specification at a clean manager checkpoint.
- Research plans remain historical records. Execution prompts and explicit
  manager addenda may refine or supersede their planning-era assumptions.
- `PROJECT_AUDIT.md` and `RELEASE_CHECKLIST.md` contain verified evidence, not
  unverified wishlist claims.

Unless a card says otherwise, the original observation was made against the
released v0.19.0 experience. It is not assumed to reproduce or be fixed at the
current accepted checkpoint until the current-build audit and retest fields say
so.

## 2. Workflow

### Delivery status

`Captured` → `Triaged` → `Routed` → `In progress` → `Candidate` → `Accepted`

Alternative states are `Needs decision`, `Deferred`, `Superseded` and
`Declined by Human`.

- An implementation agent may report an item as `Candidate` with evidence.
- The orchestrator/manager may mark it `Accepted` after reviewing the change and
  proportionate verification.
- Acceptance does not imply a release has shipped.

### Verification status

`Not retested` → `Automated` → `Manager-tested` → `Family-tested`

Later verification levels supplement rather than replace the earlier evidence.
A card may need more than one platform/input row before it is considered done.

### Impact

- `P0 — programme/release gate`: likely to block comprehension, control quality,
  progress safety or the intended family/release experience, or to create major
  rework if deferred beyond its owning plan.
- `P1 — high value`: material fun, pacing, variety or polish improvement.
- `P2 — polish`: worthwhile and visible, but safely sequenced behind P0/P1 work.
- `Epic`: a cross-system feature that requires an approved specification and
  cannot safely be slipped into a specialist polish pass.

## 3. Evidence synthesis

The intake contains seven especially strong evidence and product-direction
clusters:

| Theme | Direct evidence | Working implication |
|---|---|---|
| Movement and control feel | Human compared v0.19.0 across inputs, Tauri and builds back to v0.5.0; iPad steering origin visibly disagrees with its guide | Treat camera motion and touch steering as P0 investigation/implementation work, with physical-device retests |
| Child comprehension | Amelia understood the Power inequality but not how to become stronger; blocker item pictures did work | Prefer truthful picture-led next actions over additional abstract explanation |
| Pacing and delight | Amelia enjoys combat; Rose Heart Roundabout felt refreshing; large empty corridors caused fatigue | Vary topology, scale, encounter rhythm and small rewards; difficulty must not mean size or travel length |
| Presentation feedback | Existing pickup text is liked, while door continuity, gain timing, Power-99 effects and material effects feel weak | Preserve the successful feedback language and extend it through typed, accessible presentation contracts |
| Emotional readability | Human direction requests familiar anime/JRPG emotional shorthand and a larger expressive Ame portrait; the current HUD portrait is fixed | Build an original, event-driven portrait reaction language that reinforces rather than replaces semantic feedback |
| Release onboarding | Amelia has already learned the rules, but the Human wants first-time players of all ages and experience levels to receive clearer introductions | Teach genuinely new rule families through short guided discovery, then fade support into recall and mastery |
| Music continuity and identity | Human reports intermittent silence and is replacing every placeholder with a purpose-made OST grouped by activity | Use one typed music context, bounded predictive loading and overlap transitions so enabled foreground play remains continuous and contextually correct |

This is high-value target-family evidence, but it is one family rather than a
broad usability sample. Current-build reproduction and broader device coverage
remain necessary where called out below.

## 4. Routing summary

| ID | Short name | Impact | Delivery | Verification | Primary route |
|---|---|---|---|---|---|
| `PT-20260902-01` | Interaction celebration queue | P1 | Routed | Not retested | Plans 01 and 02 |
| `PT-20260902-02` | Stationary door opening | P0 | Needs decision | Not retested | Gameplay contract, then Plans 02 and 08 |
| `PT-20260902-03` | Combat gain count-up | P1 | Routed | Not retested | Plan 02, using Plan 01 notice system |
| `PT-20260902-04` | Rainbow Power Parade topology | P1 | Candidate | Automated | Family retest, then Plan 09 only if needed |
| `PT-20260902-05` | Escalating Power-99 presentation | P1 | Routed | Not retested | Plan 02; Plans 01 and 07B support |
| `PT-20260902-06` | Long-corridor variety | P1 | Routed | Not retested | Plan 09 and generator quality work |
| `PT-20260902-07` | Smooth camera/play feel | P0 | Routed | Not retested | Plan 07B; Plans 01 and 08 support |
| `PT-20260902-08` | Anchored touch joystick | P0 | Routed | Not retested | Plan 08; Plan 01 control surface |
| `PT-20260902-09` | Strong-enemy teaching | P0 | Routed | Not retested | Plan 01 with gameplay-owned suggestions |
| `PT-20260902-10` | Completion choices | P0 | Needs decision | Not retested | Gameplay contract, Plan 01/08; Plan 10 extension |
| `PT-20260902-11` | More and optional battles | P1 | Routed | Not retested | Plan 09 |
| `PT-20260902-12` | Varied, smaller level portfolio | P0 | Routed | Automated | Plan 09 revision; generator sub-epic |
| `PT-20260902-13` | Remove portal glyph clutter | P2 | Routed | Not retested | Plan 02 |
| `PT-20260902-14` | Spikes and ice traversal | Epic | Needs decision | Not retested | Dedicated mechanics specification |
| `PT-20260902-15` | Richer materials and obstacle VFX | P1 | Routed | Not retested | Plans 04 and 02; Plan 07B qualifies |
| `PT-20260902-16` | Rewarded dead ends; quiet minimap | P1 | Routed | Not retested | Plan 09/generator plus Plan 01 |
| `PT-20260902-17` | World and lore enrichment | P1 | Routed | Not retested | Plan 09; Plans 10 and 11 consume canon |
| `PT-20260902-18` | Expressive portrait and emotion marks | P1 | Routed | Not retested | Plans 03, 01 and 02; Plans 05/07B support |
| `PT-20260902-19` | Guided mechanic-introduction trails | P0 | Routed | Not retested | Plan 09 design gate; Plans 01/08 support |
| `PT-20260903-20` | Continuous contextual original OST | P0 | Routed | Not retested | Music-controller slice in Plan 07B; Plans 01/02/08/10 support |

## 5. Backlog items

### PT-20260902-01 — Interaction celebration queue

- Type: UX, presentation and accessibility
- Impact: P1 — high value
- Delivery: Routed
- Verification: Not retested
- Primary owners: Plan 01 for the component, typography, placement and live
  region; Plan 02 for event recipes and timing
- Dependencies: Art-Bible typography tokens; Plan 02 presentation director
- Target gate: Plans 01 and 02 acceptance

**Human outcome.** Preserve the delightful pickup feedback, make it rise farther
and fade more slowly, and extend it to every meaningful interaction with cute,
punchy contextual copy and an appropriate sprite. Rapid results must queue and
remain simultaneously readable rather than replacing one another.

**Current-checkpoint audit.** Confirmed open in source. `App.tsx` stores only one
map notice, clears its previous timer and replaces it. Pickup text covers a
limited subset of results; combat uses a short static `+N`, while rescue uses a
different feedback path.

**Acceptance slices.**

- Use a typed, exhaustively handled event queue for approved meaningful results:
  equipment/key/potion/treasure pickup, enemy victory, friend rescue, door,
  portal, jump and any other explicitly approved interaction. Ordinary movement
  creates no notice.
- Enemy copy uses the actual enemy name and exact arithmetic. Rescue copy names
  the friend and says that they joined the party.
- Every notice uses the relevant catalogue sprite or a documented semantic icon.
- Three results fired in quick succession retain their order; older rows rise as
  newer rows enter below, and no result is overwritten.
- Full-motion notices travel materially higher and remain readable longer than
  the current implementation, while still finishing in bounded time.
- Use a soft, rounded, locally licensed Art-Bible-approved font with documented
  provenance and a suitable fallback.
- Announce each result exactly once to assistive technology. Numeric animation
  ticks and duplicate feedback surfaces must not repeat the announcement.
- Reduced-motion mode retains all information using a stable or fade-only
  presentation.
- At supported TV, desktop, iPad and phone layouts, the queue does not obscure
  Ame, the immediate blocker, required HUD information or primary controls.

**Evidence needed.** Queue unit tests, event-coverage test, fake-timer/cancellation
tests, reduced-motion and screen-reader audit, and visual checks at all target
viewports.

### PT-20260902-02 — Door-opening spatial continuity

- Type: Gameplay contract, presentation and input
- Impact: P0 — next-playtest gate
- Delivery: Needs decision
- Verification: Not retested
- Primary owner: Narrow manager/gameplay contract before Plan 02
- Supporting owners: Plan 02 choreography; Plan 08 held-input semantics
- Dependencies: Engine, solver, hints, metrics, session fixtures and performance
  scenarios must agree on the new transition
- Target gate: Contract before Plan 02 execution; full outcome before Plan 02
  acceptance

**Human outcome.** Pressing into a keyed door opens it while Ame remains clearly
visible on the approach tile. Only after the door is open may continued movement
enter the cleared tile. The effect and sound should be longer and more elaborate.

**Current-checkpoint audit.** Confirmed open. The engine currently opens the door
and moves onto its tile in the same transition, while the presentation hides the
player layer. This produces the reported disappear/teleport sequence.

**Acceptance slices.**

- The opening attempt records the door as open and emits exactly one semantic
  `door-opened` result, but returns `moved: false`; position and movement-step
  count remain unchanged.
- Ame stays visible on the approach tile for the entire effect, and the door
  visibly resolves to traversable floor before entry.
- A direction that is genuinely still held may produce at most one continuation
  after completion. It must be bound to the same input source, direction, level
  and presentation generation.
- A released input, discrete press, blur, modal, navigation, changed level or
  cancelled presentation cannot leak a continuation or burst of queued moves.
- Door audio/visual timing has readable match, latch, magical release and settled
  floor beats. Longer must still be validated as satisfying rather than sluggish.
- Reduced motion preserves origin → open-door → stable-floor truth without hiding
  Ame.
- Cover adjacent-door and every supported composite transition in engine, solver,
  hint, metrics, save/session, controls and presentation tests.

**Decision required.** This Human direction supersedes Plan 08's earlier neutral-
after-door assumption. The manager must publish the exact stationary-interaction
and controlled-hold contract before presentation work begins.

### PT-20260902-03 — Combat Power-gain count-up

- Type: Combat feedback
- Impact: P1 — high value
- Delivery: Routed
- Verification: Not retested
- Primary owner: Plan 02
- Supporting owner: Plan 01 shared notice component
- Target gate: Plan 02 acceptance

**Human outcome.** The glowing post-combat gain stays visible longer and counts
from zero to the exact amount gained.

**Current-checkpoint audit.** Partly present. Combat Power badges transfer values
incrementally, but the floating result is static, has no relevant sprite and is
removed sooner than the general notice animation.

**Acceptance slices.**

- The gain badge progresses monotonically from `+0` to exact `+N`, then holds the
  final result clearly before leaving.
- Animation is duration-based and bounded; large values do not require one DOM or
  timer update per integer.
- Authoritative Power arithmetic remains exact and unchanged.
- Assistive technology announces the final gain once, not every visual tick.
- Reduced motion presents exact `+N` immediately with a readable hold.
- Cancellation, navigation, hidden-tab and rapid-event tests leave no stale timer,
  number or duplicate result.

### PT-20260902-04 — Rainbow Power Parade topology

- Type: Authored level regression
- Impact: P1 — verify before reopening
- Delivery: Candidate
- Verification: Automated; Family-tested still required
- Primary owner: Plan 09 only if the candidate fails family play
- Target gate: Amelia replay before further redesign

**Human outcome.** Replace the released build's long snaking path with memorable
rooms, spokes and diverging choices.

**Current-checkpoint audit.** Plan 06 appears to have addressed this report. The
current candidate is 17×17 with rooms and a hub; ordinary/perfect solver routes
fell from 411/411 inputs to 61/77. Metrics are encouraging but do not prove that
the level now feels varied or fun.

**Acceptance slices.**

- Treat the current topology and 61/77 route envelope as the regression baseline
  unless a family retest identifies a concrete remaining problem.
- Preserve recognisable rooms, a real hub, divergent Power/reward choices, the
  Sunny-Key return, Power-99 guardian and optional five-friend route.
- Do not regress to a one-cell snake or an unapproved long quiet-travel envelope.
- Record Amelia's current-build reaction before authorizing another redesign.

### PT-20260902-05 — Escalating rainbow Power above 99

- Type: Milestone VFX and HUD polish
- Impact: P1 — high value
- Delivery: Routed
- Verification: Not retested
- Primary owner: Plan 02
- Supporting owners: Plan 01 for transform/centring wrappers; Plan 07B for
  continuous-effect qualification
- Target gate: Plan 02 acceptance and Plan 07B performance gate

**Human outcome.** Power above 99 should feel increasingly extraordinary: a
brighter rainbow-cycling aura and number, a centred pulse with no sideways drift,
and gently escalating intensity/rate as Power rises.

**Current-checkpoint audit.** Partly present. Power 99 currently enables fixed
rainbow and pulse loops plus fixed drop shadows. The amount above 99 does not
change the recipe, the sprite aura does not fully cycle, and transform ownership
makes the local number's centring fragile.

**Acceptance slices.**

- Define documented, capped semantic tiers or a capped function for Power 99 and
  increasing values above it.
- Aura brightness, spectrum rate and pulse strength increase perceptibly but
  gently, with safe maxima and no unsafe flashing.
- Ame's aura, local number and HUD number use the same semantic tier without
  per-frame React state.
- Position and scale use separate wrappers; scale is centred with no horizontal
  travel.
- Text remains readable in grayscale and over every terrain family.
- Reduced motion uses a stronger static rainbow milestone without cycling or
  pulsing.
- Continuous rendering stays within the approved frame, paint and memory budgets.

### PT-20260902-06 — Long-corridor variety and interest rhythm

- Type: Campaign and generator design
- Impact: P1 — high value
- Delivery: Routed
- Verification: Not retested
- Primary owner: Plan 09 for authored levels and generator-quality contract
- Supporting owner: Plan 07B for richer-level rendering limits
- Target gate: Revised Plan 09 acceptance

**Human outcome.** Large mazes must regularly reveal rooms, battles, Science,
rewards, landmarks or surprises instead of making the player wind through empty
corridors for long periods.

**Current-checkpoint audit.** Partly addressed by Plan 06 through rooms,
shortcuts, route metrics and new generated treasure/guardian rooms. It remains
unproven: Chapters 9 and 10 have long quiet runs, and generator tests do not bound
the distance between genuinely meaningful moments.

**Acceptance slices.**

- Add a `longestInterestGap`-style measure based on meaningful room entry,
  functional landmark, interaction, encounter, reward or state-changing shortcut;
  a decorative turn alone does not reset it.
- Provisional manager guardrail: large authored levels target at most 24 inputs
  between meaningful moments; anything above 30 needs redesign or an explicit,
  successful family-tested exception.
- Every authored/generated level above 16×16 contains multiple recognisable open
  rooms, with at least two holding meaningful optional or functional content.
- No required route uses decorative zigzags purely to add length.
- Generator evidence covers deterministic cohorts across size, difficulty and
  topology families rather than one showcase seed.
- Preserve solvability, deterministic identity, no-rescue ordinary routes,
  all-friend perfect routes and performance bounds.

### PT-20260902-07 — Smooth camera and movement feel

- Type: Play-feel investigation and rendering architecture
- Impact: P0 — next-playtest gate
- Delivery: Routed
- Verification: Not retested
- Primary owner: Plan 07B
- Supporting owners: Plan 01 for isolated viewport/world/actor seams; Plan 08 for
  cross-input feel validation
- Target gate: Plan 07B acceptance before a family candidate build

**Human evidence.** Movement looked and felt jerky across D-pad, touch, UI buttons
and keyboard. Tauri felt somewhat easier but still looked bad. Comparing releases
back to v0.5.0 strongly implicated the more active tile-following camera.

**Current-checkpoint audit.** The source supports that hypothesis: the camera
world and player layer independently animate layout-affecting `left`/`top` over
120 ms while held movement can arrive every 160 ms. This is a plausible mechanism,
not proof that one particular replacement will feel best.

**Acceptance slices.**

- Compare at least transform easing, bounded constant-velocity/catch-up, and a
  gently damped follow prototype against identical deterministic tile inputs.
- Keep authoritative movement tile-based unless evidence justifies a separate
  gameplay change. Presentation may interpolate but must settle on the exact tile.
- One clock and coordinate contract owns camera and actor travel; there is no
  double interpolation or transform contention.
- After initial layout, travel uses compositor-friendly transforms without
  animation-frame layout work.
- Rapid orthogonal turns are monotonic, with no oscillation, overshoot, reversal
  or visible stop/start at normal held cadence.
- Camera clamping is stable at edges while Ame continues smoothly; release settles
  exactly without blur or accumulated lag.
- Pointer hit-testing, fog, minimap, lighting, presentations, resize, Big mode and
  DPR 1/2 retain final-coordinate parity.
- On qualified clean runs, target p95 frame interval ≤20 ms on reference hardware,
  ≤33.3 ms under the defined low-end profile, and no movement long task >50 ms.
- Physical iPad and Tauri/TV tests must explicitly answer whether straight travel
  and frequent direction changes look and feel smooth. Traces alone cannot close
  this card.

### PT-20260902-08 — Anchored touch joystick and hybrid thumb pad

- Type: Touch-control bug and input UX
- Impact: P0 — next-playtest gate
- Delivery: Routed
- Verification: Not retested
- Primary owner: Plan 08
- Supporting owners: Plan 01 for layout/hit geometry; Plan 07B for update cost
- Target gate: Plan 08 acceptance, including physical iPad test

**Human outcome.** A drag from anywhere must steer relative to its original touch
anchor, while a simple board tap still moves one tile relative to Ame. Replace the
four small buttons with a comfortable rounded-square four-way surface that also
acts as an anchored joystick when dragged.

**Current-checkpoint audit.** Confirmed open. The visible origin is retained only
for drawing; actual drag intent is repeatedly recalculated from the pointer to
Ame's changing screen position.

**Acceptance slices.**

- A board tap without a drag emits exactly one cardinal move based on the tap
  relative to Ame.
- Once movement crosses the documented slop/deadzone, the immutable pointer-down
  location becomes the joystick centre; every later direction uses current
  pointer minus that origin, never Ame's position.
- Tap-versus-drag classification cannot emit an unintended first move or double
  step, and the visible anchor/knob always represents the real input.
- The rounded-square thumb pad has four clear regions: tap moves once, hold uses
  the shared cadence, and drag behaves as the same anchored cardinal joystick.
- Dedicated-pad intent is exact cardinal input. Free-board taps may retain safe
  corner assistance if the final controls specification permits it.
- Deadzone, hysteresis, reversal, capture loss, `pointercancel`, blur, hidden tab,
  modal entry, multitouch rejection and compatibility-mouse suppression are
  deterministic.
- `touch-action: none` is scoped only to active movement surfaces so browser zoom
  and navigation remain available elsewhere.
- Test on a physical iPad in landscape, including a drag beginning far from Ame
  and a drag from the natural thumb-pad area.

### PT-20260902-09 — Picture-led strong-enemy teaching

- Type: Child comprehension and blocker recovery
- Impact: P0 — next-playtest gate
- Delivery: Routed
- Verification: Not retested
- Primary owner: Plan 01
- Supporting owner: Gameplay-owned, reachability-aware suggestion selector
- Target gate: Plan 01 acceptance and family comprehension test

**Human evidence.** Amelia understood that a smaller Power number could not beat a
larger one, but did not infer how to increase Power. In contrast, showing the
specific item needed for other blockers worked immediately.

**Current-checkpoint audit.** Partly addressed by Plan 06's calmer repeat-contact
behaviour, but the first explanation still offers only a generic instruction to
find more Power.

**Acceptance slices.**

- Retain the exact, safe `Ame Power < Enemy Power` comparison.
- Where truthful, show a relevant enemy card labelled **Fight weaker monsters**
  and a potion card labelled **Find a Power Potion**.
- Suggested enemies must be undefeated, beatable at current Power and reachable
  without first defeating the blocker. Suggested potions must still exist and be
  reachable under the same authoritative transition rules.
- Never advertise an unavailable strategy. Show one card if only one is valid;
  if neither is valid, use engine-consistent Required Path guidance.
- Use current level/catalogue art and names, including generated content. Repeat
  contact remains nonmodal as established by Plan 06.
- Layout and dismissal work with keyboard, touch, controller, screen reader,
  reduced motion and the supported phone envelope.
- Family target: at least 90% of observed child testers can name a valid way to
  become strong enough; nobody should infer damage, punishment or a reset.

### PT-20260902-10 — Completion choice and safe continuation

- Type: Progression, save semantics, modal UX and controls
- Impact: P0 — next-playtest gate
- Delivery: Needs decision
- Verification: Not retested
- Primary owner: Manager/gameplay contract, then Plan 01
- Supporting owners: Plan 08 controls; Plan 10 adds Friend Garden destination
- Target gate: Semantic contract before Plan 01; Friend Garden slice before Plan
  10 acceptance

**Human decision.** Reaching the star must offer **Stay here**, **Next maze** and
**Restart**. When friends remain, Stay here is the default; when all are rescued,
Next maze is the default. Once the Friend Garden exists, also offer **Take a
break**.

**Current-checkpoint audit.** Confirmed open. Entering the star immediately marks
the engine run won; the app commits progression/rewards and clears the active run.
The current modal has only Next and Play Again. Therefore this cannot safely be
implemented as three superficial buttons.

**Acceptance slices.**

- Treat star contact as a pending completion choice while retaining a recoverable
  playable snapshot until the player deliberately leaves.
- Stay, Next and Restart are always present. Missing friends gives initial focus
  and default activation to Stay; rescuing all friends gives it to Next.
- Copy preserves player choice and never frames leaving optional friends as
  failure.
- Choosing Stay resumes the same run with inventory, friends, map reveal, steps,
  hints and object state intact, without duplicating completion or rewards.
- Choosing Next commits rewards, records and unlocks exactly once, then removes
  the active run at the defined durable boundary.
- Restart uses the normal safe confirmation and awards nothing.
- Closing/reloading while the choice is open resumes at a defined safe pre-exit
  state with nothing lost or duplicated.
- Held input cannot cross into or out of the choice. Keyboard, touch, pointer and
  controller expose the same actions and default.
- Generated, tester, former-finale and final-campaign cases have explicit, correct
  labels and destinations.
- Plan 10 may add **Take a break in the Friend Garden** without removing the three
  core choices or unexpectedly taking default focus.

**Decision required.** The Human phrasing requests staying at the star. Before
Plan 01, specify whether the resumable state safely permits Ame to occupy an
inert exit tile or returns her to the approach tile without feeling like lost
movement. Also define exactly when victory audio/presentation and durable rewards
occur. The decision must preserve the outcomes above.

### PT-20260902-11 — More battles and optional encounter rooms

- Type: Encounter pacing and authored/generated content
- Impact: P1 — high value
- Delivery: Routed
- Verification: Not retested
- Primary owner: Plan 09
- Supporting owners: Plan 02 for reusable battle presentation; Plan 05 for
  animation variety
- Target gate: Revised Plan 09 acceptance

**Human evidence.** Amelia especially enjoys battles and would like more of them,
including gentle enemies and optional rooms where not every fight is required.

**Design risk.** Enemies add their Power to Ame. Extra optional encounters can
accidentally bypass the intended potion, enemy or route-order puzzle.

**Acceptance slices.**

- Each level design packet records required/optional encounter counts, spacing
  and the intended Power chain.
- Provisional manager starting target: selected middle/late chapters and at least
  half of the eight new Plan 09 levels include an optional encounter room or
  battle branch. Tune the quota from family pacing evidence rather than treating
  it as immutable canon.
- Do not pad required routes solely to raise battle counts, and retain quiet
  puzzle/decompression chapters so campaign rhythm can breathe.
- Counterfactual solver tests prove optional Power cannot bypass intended
  prerequisites; every enemy is safely defeatable on at least one intended route.
- Vary coherent enemy family, personality, animation, sound and VFX by context,
  reusing the final catalog rather than multiplying arbitrary assets.

### PT-20260902-12 — Varied, smaller and maze-adjacent level portfolio

- Type: Campaign direction and procedural-generation epic
- Impact: P0 — must revise Plan 09 before execution
- Delivery: Routed
- Verification: Partly automated; family evidence required
- Primary owner: Plan 09 for authored content
- Supporting work: Dedicated generator-variety sub-epic; Plans 01/07B enforce
  viewport and performance limits
- Target gate: Plan 09 plan revision before its execution

**Human decision.** Use more relaxing, simple, strange, room-based and reasoning-
led experiences like Rose Heart Roundabout between traditional mazes. Dimensions
above 16×16 should be rare, always room-rich, and difficulty must come from ideas
rather than monotonically larger maps.

**Current-checkpoint audit.** Plan 06 improved Rainbow Power Parade and added some
generated rooms, but nine of the current sixteen authored levels exceed 16×16.
The planning-era Plan 09 briefs would add several more 17–23-square maps. Surprise
Mazes still share a largely perfect-maze base topology. Those assumptions no
longer satisfy the latest direction.

**Acceptance slices.**

- Revise Plan 09's eight level briefs, final 24-level pacing matrix and size
  budgets before implementation.
- Provisional manager guardrail for design review: no more than six of 24 authored
  chapters exceed 16×16 and no more than two exceed 19×19. Treat this as a
  measurable interpretation of “rare,” subject to Human/family review rather
  than immutable canon.
- Avoid consecutive large chapters unless a documented pacing reason and family
  test support them.
- Every level over 16×16 contains at least two meaningful open rooms plus a hub,
  spoke, loop, garden or puzzle-chamber relationship, and complies with the
  approved interest-gap limit.
- Difficulty ratings must be justified by reasoning/state demands, not dimensions
  or walking distance.
- Surprise Mazes gain at least three deterministic topology families, such as a
  classic maze, room-and-spoke, and loop/garden/chamber family.
- Version procedural generation so old identities are not reinterpreted, and test
  representative seed cohorts across every size/difficulty/topology family.
- Apply the same solver, hint, fatigue, dead-end-reward and performance gates to
  authored and generated content.

### PT-20260902-13 — Remove redundant portal glyph overlays

- Type: Visual decluttering
- Impact: P2 — polish
- Delivery: Routed
- Verification: Not retested
- Primary owner: Plan 02
- Supporting owners: Plan 03 art contract; Plan 01 minimap/accessibility check
- Target gate: Plan 02 acceptance

**Human decision.** Remove the small white emoji/glyph floating over maze
portals; the rendered motif and colour already make it feel redundant.

**Current-checkpoint audit.** Confirmed open. The runtime renders a separate white
pair-name motif over each portal.

**Acceptance slices.**

- Remove the persistent white glyph overlay from idle maze portals.
- Final embedded heart/clover/moon or equivalent art distinguishes pairs by shape
  as well as colour, and accessible names continue to identify the pair.
- The minimap may retain a compact non-colour distinction if its scale requires
  one, but must not recreate a floating white emoji.
- Departure/arrival remains recognisable under full, reduced and static motion.

### PT-20260902-14 — Spikes and ice traversal mechanics

- Type: Cross-system feature epic
- Impact: Epic — needs product and technical specification
- Delivery: Needs decision
- Verification: Not retested
- Primary owner: New dedicated traversal-mechanics specification and plan
- Supporting owners: Gameplay/solver, Plans 01–05 and 07–10 as applicable
- Target gate: Decide before promising these mechanics in a candidate build

**Human feature request.** Add transparent floor spikes requiring **Hard Work
Boots**, and ice requiring **Ice Skates**. Entering ice slides Ame across the run,
with a playful spin for Ame and following friends.

**Current-checkpoint audit.** Not present. Current terrain/capability/save/solver
models do not contain these rules, and Plan 09 explicitly prohibits adding ice
without a separately approved mechanic and solver specification.

**Proposed specification constraints — manager inference, not yet approved
canon.**

- Model spikes as a transparent floor overlay so every underlying floor remains
  visible; Hard Work Boots are distinct from Splash Boots.
- Ice Skates are a distinct capability. One accepted directional input produces
  one deterministic atomic slide across a contiguous strip, with no mid-slide
  steering.
- The engine event records origin, traversed cells, direction and landing so
  camera, sound, followers, animation, hints, replay and co-op consume one truth.
- Intermediate ice cells contain no interactions. Specify ordering for every
  landing case: door, enemy, portal, rescue, pickup, exit and blocker.
- Invalid strips without a safe outcome fail content validation rather than
  creating soft locks or infinite travel.
- Missing equipment is harmless and produces picture-led guidance.
- Update engine, solver, reachability, hints, identity/fingerprints, saves,
  generator version, controls, Bag capacity, art, lighting, VFX, sound,
  animation, accessibility, tests and performance evidence as one coherent epic.
- Full motion may spin Ame/followers; reduced motion must communicate the same
  path and result without spinning.
- Generated hazards appear only after a solver-verified authored introduction,
  and co-op cannot bypass or corrupt the rule.

**Decision required.** Do not implement visual fragments in Plans 02/04/05 before
the rule exists. If promoted into the current programme, place a dedicated
specification at a manager checkpoint and explicitly resequence affected plans.
If not, defer the whole epic to a future feature phase; it is too large for a
generic polish mop-up.

### PT-20260902-15 — Richer material, obstacle, key and door effects

- Type: Lighting, material motion and event VFX
- Impact: P1 — high value
- Delivery: Routed
- Verification: Not retested
- Primary owners: Plan 04 for scene/material lighting; Plan 02 for motion,
  particles, sound and event choreography
- Supporting owner: Plan 07B for performance qualification
- Target gate: Plans 04, 02 and 07B acceptance

**Human outcome.** Sell the rippling wetness of water, heat of lava, bubbling
poison, magical key/door interactions and—if item 14 is approved—the sparkle of
ice and glinting sharpness of spikes without tanking performance.

**Acceptance slices.**

- Water uses restrained directional ripples and wet highlights; lava uses
  internal glow, heat distortion and bounded activity; poison has distinct
  viscosity/bubbling rather than reading as recoloured water.
- Keys and matching doors share readable latch, charge, release, glint and result
  beats that respect the stationary-door contract in `PT-20260902-02`.
- Every gameplay state remains distinguishable in a paused grayscale frame.
- Full, reduced-motion and static recipes communicate identical gameplay truth.
- Effects use approved quality tiers and remain inside DOM, paint, frame-time,
  asset and retained-memory budgets.
- Ice and spike recipes enter this matrix only after `PT-20260902-14` is approved
  and specified.

### PT-20260902-16 — Reward every true dead end and quiet the minimap

- Type: Exploration reward, generator invariant and minimap UX
- Impact: P1 — high value
- Delivery: Routed
- Verification: Not retested
- Primary owners: Plan 09 for authored placement; generator-variety sub-epic for
  procedural invariants; Plan 01 for minimap filtering
- Supporting owners: Plans 02/03 for feedback/assets; Plan 07B for object budget
- Target gate: Plans 01 and 09 acceptance

**Human outcome.** A terminal branch should always reward curiosity with Gold,
Science or another small discovery. Once collected, the empty branch helps the
player remember where they have explored. Optional currency/Science markers
should not clutter the navigational minimap.

**Current-checkpoint audit.** Confirmed open. The generator prioritises some dead
ends for a bounded number of treasures but does not cover every terminal branch.
The minimap currently renders optional treasure objects.

**Acceptance slices.**

- Define a graph-level **true terminal branch** so multiple corners of one room do
  not count as multiple dead ends.
- Every true terminal branch in authored levels and broad deterministic generated
  cohorts ends in an optional Gold/Science collectible or approved equivalent.
- Required objects do not displace the promised endpoint reward. Add a distinct
  single-Gold-Star collectible if needed; never reuse the exit star ambiguously.
- These rewards are never required and never selected by Required Path hints.
- Optional Gold/Science/treasure markers never appear on the minimap before or
  after collection; fog/exploration state still communicates where the player has
  travelled.
- Collection remains visible in the world, celebration queue, accessible status
  and durable totals.
- Property tests cover every generator difficulty, size and topology family, with
  bounded object count, economy totals, asset cost and decoded memory.

### PT-20260902-17 — Enrich the world and lore from Amelia's favourites

- Type: Narrative/world design
- Impact: P1 — high value
- Delivery: Routed
- Verification: Not retested
- Primary owner: Plan 09 narrative/world phase
- Supporting owners: Plan 10 for recurring Friend Garden life; Plan 11 consumes
  final canon for key art and branding
- Dependencies: Story Bible remains canon; original-expression and child-safety
  review
- Target gate: Plan 09 Story Bible revision, then Human/Amelia review

**Human direction.** Keep the good Puzzlewild foundation but draw broader
high-level inspiration from Numberjacks, Peppa Pig, Paw Patrol, Final Fantasy,
Ragnarök Online, Trails/Kiseki, Chillin' in Another World with Level 2 Super
Cheat Powers, I've Been Killing Slimes for 300 Years, Pokémon, Fantasy Life and
Gurumin.

**Acceptance slices.**

- Before writing chapters, produce a research-to-principles matrix that separates
  source observation from original Maze so Puzzle application.
- Explore original qualities such as clear episodic problems, funny recurring
  roles, cosy fantasy community life, creature friendship, visible growth,
  gentle heroism, NPC continuity and playful number/pattern reasoning.
- Do not copy characters, creatures, names, uniforms, factions, plots,
  terminology, UI, logos, compositions, signature settings or franchise trade
  dress.
- Preserve Ame, Poggle, Sprig, the Great Star Map, the Polite Sword Rule and the
  earlier finale's genuine victory unless the Human explicitly changes canon.
- Each chapter retains concise read-aloud-friendly intro/outro copy, a joke,
  Puzzle Power and optional conversation prompt.
- Recurring continuity enriches discovery but is never required to solve a maze.
- Review the 24-chapter arc for tone/location variety, neighbouring repetition,
  child clarity, warmth and a recognisably original identity.
- Human/Amelia qualitative review remains the final authority.

### PT-20260902-18 — Expressive Ame portrait and anime-style emotion flourishes

- Type: Character UI, emotional feedback, art and VFX
- Impact: P1 — high value
- Delivery: Routed
- Verification: Not retested
- Primary owners: Plan 03 follow-up for approved portrait expressions and symbol
  art; Plan 01 for HUD geometry; Plan 02 for the reaction system and motion
- Supporting owners: Plan 05 for later field-sprite pose parity; Plan 07B for
  asset/rendering qualification
- Dependencies: Human/Amelia approval of the canonical Ame model sheet before
  dependent portrait production; `PT-20260902-01` semantic feedback queue
- Target gate: Portrait geometry in Plan 01, final reaction system in Plan 02

**Human direction.** Use the familiar emotional clarity of small anime/JRPG
symbols—such as moving panic sweat, one slow awkward/disappointed drop, an
anger-mark shape, and joyful or surprised flourishes—translated into Maze so
Puzzle's own clean, chunky, cut-out-sticker style. Make Ame's upper-right HUD
portrait larger and let her expression and surrounding symbols react to events
such as victory or lacking a required item.

**Current-checkpoint audit.** Confirmed open. The HUD always renders one fixed
smiling portrait with two static Unicode sparkles. There is no portrait-expression
catalogue or reaction state, and the final compact layout can reduce the portrait
to roughly 40–42 CSS pixels. Typed gameplay events already provide enough truth
for a presentation-only system; no gameplay or persisted mood state is needed.
The Art Bible already establishes an Ame expression vocabulary, but dependent art
must wait for the current Human/Amelia model-sheet approval gate.

**Acceptance slices.**

- Establish an original expression/mark vocabulary. Portrait-first v1 supports at
  least neutral, happy/proud, worried, surprised, relieved and playfully annoyed
  Ame expressions with stable crop and registration.
- Provide a small, original symbol family: panic-sweat cluster, single awkward or
  disappointed drop, joy hearts/stars, surprise accent and anger-vein/hash mark.
  Each uses the Art Bible's rounded shapes, plum contour and restrained sticker
  edge; do not use raw emoji or copy Trails/anime assets or choreography.
- A pure, exhaustive resolver maps explicit typed events to one reaction intent.
  It never sentiment-infers from story text and never changes gameplay or saves.
- Define deterministic priority, finite duration, cancellation and repeated-bump
  deduplication. Rapid semantic messages remain preserved by
  `PT-20260902-01`; the portrait may coalesce lower-priority decoration rather
  than becoming a distracting queue.
- Success can produce pride/joy; rescue can produce relief/joy; missing equipment
  or insufficient Power can produce worry/surprise and restrained annoyance on
  repetition. Ame never appears angry at, contemptuous of or ashamed of the
  player, and reactions never imply injury or punishment.
- Keep face and flourish layers independent so symbols can animate without
  duplicating every portrait bitmap and future approved characters can reuse the
  semantic contract with their own art.
- Preserve the upper-right placement with an intentionally reserved, unclipped
  reaction gutter that does not intercept input or cover Power, minimap, Bag,
  objective or controls.
- Starting size targets for Plan 01 validation are at least 80 CSS pixels at
  960×540 and larger primary layouts, 56 pixels at 844×390, and 48 pixels at the
  568×320 fallback. Increase primary iPad/desktop/TV sizes where the final space
  study permits; actual expressions must remain recognisable at every accepted
  size.
- Marks remain recognisable without colour or motion. Full-motion flourishes use
  finite transform/opacity animation with no strobe or infinite idle cycling.
  Reduced motion immediately shows the expression and one static symbol—never an
  invisible paused frame.
- Existing picture/text feedback remains the semantic source. Decorative marks
  are hidden from assistive technology, portrait alternative text never falsely
  says “smiling,” and reactions do not create duplicate live-region chatter.
- Use registered, right-sized assets with loading/fallback and provenance records;
  avoid per-frame React updates. Pass crop/registration, actual-size, overlap,
  viewport, reduced-motion, encoded/decoded-memory and performance-budget checks.

**Scope boundary.** Do not expand the active Plan 03 implementation mid-turn.
Consume its approved model sheet and art rules at the next manager gate. A full
emotion system for every friend/enemy, lip-sync, persisted moods and broad field-
sprite reaction animation are not required for portrait-first v1.

### PT-20260902-19 — Story-integrated mechanic teaching trails

- Type: Campaign onboarding, mechanic pedagogy and accessibility
- Impact: P0 — Plan 09 design/release gate
- Delivery: Routed
- Verification: Not retested
- Primary owner: Plan 09 campaign/gameplay design
- Supporting owners: Plan 01 for optional Help/Book replay affordance; Plan 08
  for input parity; presentation plans for picture-led feedback
- Dependencies: `PT-20260902-09`, `PT-20260902-12`, stable campaign IDs and
  migration, engine-replayed hints, and a completed specification for any future
  mechanic such as ice
- Target gate: Revise Plan 09's 24-row learning/pacing matrix before authoring the
  expanded campaign

**Human direction.** Add more obviously tutorial-like but still charming and
thoughtful levels for new players of all ages and skill levels. A key/door lesson
could visibly place the required key in a one-tile offshoot beside a short route
to the door, friend and exit, creating an immediate “I understand!” moment after
the blocker feedback. Give genuinely new mechanics such as paired flower portals
similarly clear introductions, without repeating the same lesson for every
equivalent boot or obstacle variant.

**Current-checkpoint audit.** Partly present. Chapter 1 is a successful 6×6
movement/goal teaching level and Rose Heart Roundabout is already a compact portal
lesson. However, Shiny Sword introduces weapon, enemy, key, door and camera
together; Splashy Boots introduces potion, stronger enemy, boots, water and a new
lock colour together; Spring Boots first appear in a large endurance-risk level.
Plan 06 defines an appropriate question → supported answer → unaided recall →
combination/mastery lifecycle, and Plan 09 records lifecycle data, but neither
currently guarantees an obvious guided-discovery pocket before every genuinely
new rule family.

**Accepted orchestration direction.** Use a hybrid inside the planned 24-chapter
campaign: some high-novelty rules receive a short ordinary chapter, while others
receive a self-contained opening teaching pocket inside their first chapter.
These remain story-worthy, replayable game levels rather than disposable
instruction screens. Do not add an extra mandatory tutorial campaign or exceed
24 chapters without explicit Human approval.

**Acceptance slices.**

- The revised campaign matrix names exactly one first-use chapter plus supported-
  use, unaided-recall and combination/mastery beats for every mechanic family.
- A genuinely different player verb or spatial rule receives its own introduction
  before complex combination. Different key colours, portal motifs or equipment
  variants with identical behaviour use short visual callbacks rather than
  redundant tutorials. A future forced ice slide would require a dedicated
  lesson because it is mechanically different.
- Each first-use teaching pocket keeps the question/blocker and its nearby answer
  visible within one stable 6×6 view or a documented equally legible composition;
  first successful use is reachable within 12 directional inputs.
- The player may meet the blocker first but is never required to make a mistake.
  Collecting the answer first still makes the cause-and-effect relationship clear.
- First blocker contact gives immediate picture-led, plain-language feedback in
  the approved non-punitive surface. Essential teaching never depends solely on
  story text, reading skill, colour, motion, sound or timing.
- Every teaching pocket still contains at least one real choice, one clearly
  optional friend/reward branch, an appealing visual/story beat and a satisfying
  ordinary route. It must not feel like a sterile worksheet corridor.
- Preserve optional rescues: the solver-derived ordinary route may rescue zero
  friends and the perfect route reaches every friend without a hidden trick.
- Keyboard, touch, pointer, on-screen controls and controller produce identical
  lesson outcomes; reduced/static modes retain every clue.
- Every introduction passes ordinary/perfect solving, current-state Hint replay,
  recovery, event-gap, neutral-retraversal and content-identity checks.
- Keep the campaign exactly 24 chapters. Reordering/revising teaching chapters
  must preserve stable IDs, prior completions, unlock access and Continue behavior;
  returning players are never unexpectedly sent backwards.
- Completed teaching chapters may become directly replayable from Help or the
  Adventure Book as a P1 enhancement, but do not create a second reward-bearing
  practice campaign or mid-run mode switch.

**Plan 09 revision candidates — validate rather than apply blindly.**

- Simplify Shiny Sword's opening around the visible key/offshoot/door relationship
  while retaining one real choice and its combat teaching purpose.
- Give Splash Boots a clean equipment/water teaching pocket; treat lava as a
  recognisable transfer of the capability-gate pattern.
- Consider placing the smaller Cloudberry Bounce Garden before Springstep Sky
  Hollow so it teaches full-run Spring jumping before the endurance test.
- Consider placing Glowleaf Moon Garden before Moonlit Friendship Quest so the
  Leaf/poison relationship is learned before mixed traversal.
- Preserve and refine Rose Heart Roundabout as the paired-portal introduction,
  followed by later portal practice and mastery.

**Success evidence.** In first-time-player sessions, target at least 80% who
identify the immediate problem and make a purposeful next move without adult
navigation; at least 90% who can name or seek the required item after one blocker
response; at least 75% who predict the mechanic before its second use; and at
least 70% of Hint users who resume before the final Step hint. Skilled/returning
players should encounter no forced explanatory modal and should be able to clear
the teaching pocket directly.

### PT-20260903-20 — Continuous contextual original OST

- Type: Audio architecture, navigation presentation and release media
- Impact: P0 — release gate
- Delivery: Routed
- Verification: Not retested
- Primary owner: Bounded music-controller/navigation slice at the start of Plan
  07B, followed by Plan 07B loading/performance qualification
- Supporting owners: Plan 01 for typed screen/overlay context; Plan 02 for SFX/BGM
  coexistence; Plan 08 for browser/controller activation; Plan 09 for campaign
  integration; Plan 10 for the Friend Garden context
- Dependencies: Human-authored final MP3 pools and provenance; final app-context
  state model; performance feature allocation
- Target gate: Core five present contexts during Plan 07B, Garden wiring during
  Plan 10, and all final originals qualified before release acceptance

**Human decision.** Once music is enabled, normal foreground play should always
have context-appropriate BGM: title/home from `title`, story pop-ups from `story`,
maze play from `maze`, post-maze “You did it!” screens from `victory`, Friend
Garden play from `garden`, and Adventure Book browsing from `adventure book`.
Randomly select from the matching MP3 folder, transition with smooth fades or
crossfades, and prepare likely next tracks early enough that loading never causes
an audible silent gap.

All music currently in the repository is placeholder material from other
projects. The Human is creating a brand-new original Maze so Puzzle OST; every
current MP3 is therefore non-shipping unless the Human later expressly retains
one.

**Current-checkpoint audit.** Confirmed open. `public/assets/ost/` is currently a
flat set of 14 MP3s totalling about 50.2 MB. `src/music.ts` hard-codes a title
track and one maze shuffle bag, owns one looping `HTMLAudioElement`, sets
`preload="none"`, and disposes the audible element before a replacement is ready.
There is no standby lane, readiness gate, fade/crossfade, same-pool end-of-track
succession or failed-track recovery. Title and Adventure Book share one track;
story overlays retain maze music; the completion screen never selects victory
music; Garden does not yet exist. A failed replacement can leave persistent
silence.

**Folder and catalogue contract.**

- The final logical BGM pools are exactly `title`, `story`, `maze`, `victory`,
  `garden`, and `adventure-book`. The Human's physical folder wording
  `adventure book` is preserved until the actual folders arrive; record an
  explicit mapping rather than silently renaming it. A URL-safe
  `adventure-book` physical folder is a recommendation, not assumed approval.
- Produce a build-time validated manifest/catalogue. A static browser or bundled
  Tauri app must not depend on runtime directory listing.
- Every MP3 belongs to exactly one BGM pool or is explicitly catalogued as a
  non-BGM event cue. Duplicate, malformed, unmanifested and missing entries fail
  validation; all six pools must be nonempty before release.
- Record source/provenance, rights, hash, duration, encoded size, mastered
  loudness/peak, loading phase and rollback information for every final track.
- Remove old placeholders from the production bundle only after the replacement
  catalogue and playback flows are proven. Release evidence must demonstrate
  that no non-approved placeholder remains in browser `dist` or packaged Tauri.

**Context and selection contract.**

- One pure, exhaustive context resolver maps title and home → `title`; story
  intro/replay pop-ups → `story`; interactive authored, Surprise and co-op mazes
  → `maze`; post-maze completion → `victory`; Adventure Book →
  `adventure-book`; Friend Garden → `garden`.
- Help, Hint, blocker explanations, confirmation dialogs and pause-like overlays
  inherit the underlying context unless a later explicit music decision says
  otherwise. Ordinary combat is not a victory context.
- Re-rendering or navigating within the same context does not restart music or
  consume a new selection. Rapid or cancelled navigation cannot consume phantom
  draws or leave the wrong context playing.
- Each pool uses a session-seeded shuffle bag: every usable track plays once
  before refill, immediate repeats are avoided across cycle boundaries, one-track
  pools remain valid, and injected seeds make tests deterministic.
- The entire `maze` pool remains eligible for random selection as requested.
  Plan 09 may record pacing/mood evidence but must not hard-code filenames or
  quietly narrow the pool without a later Human decision.

**Continuity and predictive-loading contract.**

- After the first permitted audio activation, while the app is foregrounded,
  sound is enabled and at least one valid BGM exists, every application-created
  transition retains audible music. This is the precise acceptance meaning of
  “music never stops.”
- Never fade or dispose the current audible track until its successor reports
  usable readiness. Use a click-free, tuned overlap/crossfade envelope with no
  zero-gain interval and at most two long-form media lanes: active plus transient
  standby.
- If a target is late, the old track remains audible until the new one is ready.
  If it stalls or fails, try the remaining target-pool candidates. If the whole
  pool fails, keep the last safe track and emit one bounded diagnostic rather
  than stopping gameplay or retrying forever.
- Rapid A → B → C changes cancel stale B work, make C authoritative and dispose
  superseded media/listeners exactly once. Selecting the same URL never seeks or
  restarts it accidentally.
- A track reaching its end preselects and crossfades to the next track in that
  pool, or loops safely until the successor is ready. Qualify real leading/trailing
  silence and MP3 encoder gaps rather than accepting only a `playing` flag.
- Predictively prepare only the next plausible candidate: the known destination
  context, current-pool successor, or a destination made likely by focus,
  pointer/touch intent or a confirmed action. Cancel stale intent and never warm
  the whole OST.
- Title idle/loading remains fast. Do not eagerly download or fully decode the
  soundtrack, use full-track `decodeAudioData`, add a network dependency, or add
  a service worker merely to satisfy this card.
- Suggested transition flow: title prepares likely Story; Story prepares its maze
  track; maze prepares a victory track/current-pool successor; completion prepares
  the chosen next destination; Book and Garden prepare their return context.

**Player control, platform and mix contract.**

- Cold pre-gesture browser launch, explicit mute, hidden/suspended app, OS audio-
  focus loss and total device/media failure are documented exceptions to audible
  continuity. Never defeat browser autoplay policy or describe these intentional
  states as defects.
- The first valid click/tap/key activation starts the current context. A rejected
  initial attempt retries only after a later explicit gesture. Gamepad polling is
  not falsely claimed to create browser user activation; Plan 08 must document and
  hardware-test the honest controller-only route.
- Mute never clears itself. Context selection continues while muted so unmuting
  from a valid gesture resumes the correct current pool rather than stale music.
  Hide/minimize pauses both lanes and their transition timers; return resumes only
  the latest authoritative context without a stale tail or catch-up burst.
- Base BGM volume is clamped and applied consistently across both lanes without
  restarting or seeking. Preserve the shared Sound control unless a separate
  mixer is explicitly approved.
- Master final tracks to a documented, perceptually consistent loudness/true-peak
  envelope. Gameplay cues and dialogue remain clearly audible; any ducking is
  smooth and never creates total BGM silence.
- Browser playback remains same-origin; packaged Tauri remains fully local and
  offline.

**Acceptance evidence.**

- Pure tests cover the exhaustive context resolver, per-pool deterministic shuffle
  bags, no-repeat boundaries and no draw on same-context render.
- Fake-media/clock tests cover readiness, progress, stall, error, timeout, end,
  fallback, rapid transitions, mute/volume, visibility, cancellation, teardown
  and the two-lane resource ceiling.
- Headed browser and packaged WebView2 flows cover title → Story → maze → victory
  → Adventure Book and, after Plan 10, Friend Garden. Include throttled/cold-cache
  and warm-cache cohorts, 25 rapid/ordinary context transitions and a ten-minute
  media/process soak.
- Verify HTTP 200/range/MIME/cache behavior for the static web build, local/offline
  Tauri playback, initial-load and transferred-byte budgets, retained memory and
  media-element counts.
- Physical iPad, Tauri desktop and Steam Deck/TV listening checks confirm no
  audible click, stutter, unintended silence, abrupt loudness jump or obscured
  gameplay cue on speakers/headphones/HDMI. Missing hardware evidence remains
  pending rather than inferred.
- `docs/MUSIC.md`, Architecture, performance budgets, release checklist and
  project audit are updated only as the new system and final soundtrack become
  true; their current claims that the placeholders are the shipped soundtrack
  must not survive final release acceptance.

**Scope boundary.** Plan 02 does not own BGM policy. Plan 07B consumes the typed
UI, SFX and activation seams and implements/qualifies the controller as a bounded
audio slice. Plan 10 adds only the Garden context hook. If the final tracks arrive
after those owner passes, the closure/release-polish plan must perform catalogue
replacement and full media qualification; the card cannot become `Accepted`
while any non-approved placeholder ships.

## 6. Programme integration and gates

The existing programme remains sequential. These are execution-prompt addenda,
not permission for simultaneous implementation in the shared worktree.

1. **Current Plan 03:** do not interrupt its active art implementation. Its final
   Art Bible, Ame model sheet and catalog may naturally supply typography,
   material and expression tokens, but `18` must not expand its in-flight scope.
2. **Manager gameplay gate before Plan 01:** settle `PT-20260902-10` pending-win,
   reward/save and Stay-location semantics. Decide whether `PT-20260902-02` is
   landed as a narrow gameplay follow-up at the same checkpoint.
3. **Plan 01:** implement `01`, `09`, the UI half of `10`, the minimap half of
   `16`, the larger portrait/reaction gutter for `18`, the typed screen/overlay
   music-context seam for `20`, and layout/transform/control seams for `05`, `07`
   and `08`.
4. **Plan 04:** consume `15`; do not invent ice/spike visuals while `14` is
   undecided.
5. **Plan 02:** implement the presentation halves of `01`, `02`, `03`, `05`,
   `13`, `15` and the portrait-first reaction system in `18`, consuming—not
   redefining—the engine, art, UI and lighting contracts. Preserve an explicit
   SFX/BGM mixing and cancellation seam for `20`; do not take ownership of BGM
   navigation policy.
6. **Plan 08:** implement `08`, controller parity for `10`, the controlled held-
   input continuation approved for `02`, and the honest browser/controller audio-
   activation route required by `20`.
7. **Plan 05:** provide animation assets/recipes needed by the accepted `01`,
   `03`, `11` and `15` outcomes. It may add field-sprite parity for `18` only
   after portrait-first v1 is stable. Ice spin remains conditional on `14`.
8. **Plan 07B:** first implement the bounded music-controller/navigation slice in
   `20`; then make `07` a non-negotiable measured play-feel outcome and qualify
   music plus the continuous/stacked effects and assets from `01`, `05`, `15`
   and `18`.
9. **Plan 09:** revise its plan before execution for `04`, `06`, `11`, `12`,
   `16`, `17` and the guided teaching lifecycle in `19`; this includes changing
   planning-era map-size, order and onboarding assumptions. Consume the `maze`
   music pool/context without binding chapters to filenames.
10. **Plan 10:** add the Friend Garden completion destination from `10`, wire the
    `garden` music context from `20`, and ensure future traversal rules cannot be
    bypassed by co-op.
11. **Plan 11 — Final Key Art, Branding & Front-Door Presentation:** consume the
    final character catalog and accepted 24-chapter/Friend Garden canon. It must
    not invent gameplay or lore that contradicts `17`.

### Decisions that must not be deferred into a specialist's implementation

- `PT-20260902-02`: stationary door transition and held continuation semantics.
- `PT-20260902-10`: pending completion, save/reward boundary and Stay position.
- `PT-20260902-12`: revised Plan 09 scale/variety guardrails.
- `PT-20260902-14`: promote/resequence as a dedicated epic or defer it whole.
- `PT-20260902-19`: default to the hybrid teaching-pocket model inside the fixed
  24 chapters; any extra chapters or separate tutorial campaign need Human
  approval.
- `PT-20260903-20`: preserve the Human's actual folder spelling when the OST
  arrives or record an explicit approved mapping; do not silently assume the
  recommended `adventure-book` physical slug.

## 7. Evidence log

Append evidence here when a card changes status. Do not overwrite failed or
superseded tests; they are useful provenance.

| Date | Card | Build/commit | Device/input | Evidence | Result/status change |
|---|---|---|---|---|---|
| 2026-09-02 | 01–17 | v0.19.0 and earlier comparisons | Family play; iPad, Tauri, keyboard/D-pad/touch/UI buttons as identified in source note | Human intake normalized in `docs/playtests/2026-09-02-wishlist-and-issues.md` | Captured |
| 2026-09-02 | 01–17 | `ee176f52ab79e08e818fc919f44b7723f9fc9865` | Read-only source/plan audit | Current mechanism and initial routing audit | Triaged/routed as recorded above |
| 2026-09-02 | 04 | `ee176f52ab79e08e818fc919f44b7723f9fc9865` | Solver and authored-map evidence from Plan 06 | Current 17×17 room/hub candidate; 61 ordinary / 77 perfect inputs | Candidate; awaiting Family-tested |
| 2026-09-02 | 18–19 | `ee176f52ab79e08e818fc919f44b7723f9fc9865` plus active Plan 03 planning artifacts | Human design addendum and read-only source/plan audit | Existing portrait/onboarding seams and gaps recorded | Captured, triaged and routed |
| 2026-09-03 | 20 | `ee176f52ab79e08e818fc919f44b7723f9fc9865` | Human music direction plus read-only soundtrack/controller audit | Flat placeholder catalogue, single disposable non-preloading player, and missing Story/Victory/Garden contexts confirmed | Captured, triaged and routed |

## 8. Closure and mop-up rule

At each specialist acceptance checkpoint, update only the cards genuinely touched
by that change and attach exact evidence. After Plan 11, filter the ledger for all
items that are neither `Accepted` nor intentionally `Deferred`, then create a
bounded closure plan from the remaining compatible work.

Provisional filename:

`docs/plans/12-playtest-backlog-closure-and-release-polish.md`

If the spikes/ice epic (`PT-20260902-14`) is promoted, it receives its own feature
plan and the closure plan moves to the next unused number. A large mechanics or
generator rewrite must not be disguised as a polish mop-up. If the Human's final
OST arrives after Plan 07B/10, the closure plan begins with the bounded catalogue
replacement and full `PT-20260903-20` media qualification; placeholders can never
be waved through as a documentation-only leftover.
