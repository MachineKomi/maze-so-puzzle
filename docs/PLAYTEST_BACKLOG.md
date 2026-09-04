# Maze so Puzzle — playtest backlog

- Status: living manager-owned intake, routing and acceptance ledger
- Created: 2026-09-02
- Current accepted implementation checkpoint at triage:
  `ee176f52ab79e08e818fc919f44b7723f9fc9865`
- Source intakes:
  [`playtests/2026-09-02-wishlist-and-issues.md`](playtests/2026-09-02-wishlist-and-issues.md),
  [`playtests/2026-09-03-continuous-context-music.md`](playtests/2026-09-03-continuous-context-music.md),
  [`playtests/2026-09-03-ost-delivery-art-approval-and-asset-retirement.md`](playtests/2026-09-03-ost-delivery-art-approval-and-asset-retirement.md),
  [`playtests/2026-09-03-mimic-surprise-and-reward-showers.md`](playtests/2026-09-03-mimic-surprise-and-reward-showers.md),
  [`playtests/2026-09-03-compact-bgm-transport-controls.md`](playtests/2026-09-03-compact-bgm-transport-controls.md),
  [`playtests/2026-09-03-campaign-asset-ecology-and-world-theming.md`](playtests/2026-09-03-campaign-asset-ecology-and-world-theming.md),
  [`playtests/2026-09-03-art-directed-ui-and-playable-checkpoints.md`](playtests/2026-09-03-art-directed-ui-and-playable-checkpoints.md),
  [`playtests/2026-09-04-achievement-showcase-and-sticker-book.md`](playtests/2026-09-04-achievement-showcase-and-sticker-book.md),
  [`playtests/2026-09-04-story-cast-vn-and-voice.md`](playtests/2026-09-04-story-cast-vn-and-voice.md),
  and
  [`playtests/2026-09-04-living-goal-portal-spiral.md`](playtests/2026-09-04-living-goal-portal-spiral.md)

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

The intake contains seventeen especially strong evidence and product-direction
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
| Asset lifecycle and package hygiene | Human identified superseded cage art and other old assets that should not remain indefinitely | Separate pointer replacement from evidence-based retirement; preserve sources and rollback material while removing only proven-unreachable delivery copies |
| Reward spectacle and playful surprise | Human wants chests, victories and rescues to produce tactile showers of visible rewards, with some closed chests revealing a Mimic | Separate deterministic reward/reveal truth from cancellable presentation; reuse one bounded loot-shower grammar without turning chance into a progression requirement or paid pressure loop |
| Player-controlled music navigation | Human wants Previous, Next and Shuffle/Random without adding permanent UI clutter | Put transport and Mute/Unmute in one compact Sound disclosure; keep selection, history and fallback inside the active contextual playlist |
| Roster and world-theme variety | Human wants every final enemy and friend type used meaningfully, progressive authored introductions, varied generated encounters, fixed crafted campaign environments and compatible multi-section themes | Add a versioned content-ecology contract and exact coverage evidence; distinguish deliberate variety from random clutter and protect approved but missed consumers from cleanup |
| Authored game-interface craft | Human wants the interface to share the beauty and specificity of the final sprite art rather than read as a clean generic web application | Make the Maze-native material, shape, typography, sticker-signal and presentation-art system an explicit Plan-01 acceptance gate with accessible performance tiers |
| Frequent family-playable milestones | Human wants Amelia to experience meaningful improvements before the whole programme ends, without wasteful packaging after every plan | Create only a small set of green, reproducible family-preview checkpoints; prefer the first after Plan 01 and preserve honest non-release labels |
| Achievement pride and cosmetic expression | Human wants earned stickers to be admired at presentation scale, and later arranged personally in a sticker book | Ship a focused, accessible achievement showcase first; treat free-placement persistence as a separately approved cosmetic feature rather than hidden polish scope |
| Living objective landmark | The existing goal-star spiral already reads as a portal, but its static centre does not fully sell that magical function | Preserve the approved star and add one restrained layered inward-spiral/glow/particle recipe with clear reduced/static forms |
| Compact character storytelling | The Human wants a stronger cast/world review and short back-and-forth exchanges rather than isolated monologues | Review canon before Plan 11 and use bounded two-to-three-turn, fully skippable VN-style interludes without displacing maze play |
| Optional voiced guidance | The Human would like to explore generated voices for story and tutorial moments later | Treat voice as a planning-only opportunity until script, consent/rights, accessibility, audio, package and Human-value gates justify a separate implementation plan |

This is high-value target-family evidence, but it is one family rather than a
broad usability sample. Current-build reproduction and broader device coverage
remain necessary where called out below.

## 4. Routing summary

| ID | Short name | Impact | Delivery | Verification | Primary route |
|---|---|---|---|---|---|
| `PT-20260902-01` | Interaction celebration queue | P1 | Routed | Not retested | Plans 01 and 02 |
| `PT-20260902-02` | Stationary door opening | P0 | Routed | Not retested | Root 03M contract, then Plans 02 and 08 |
| `PT-20260902-03` | Combat gain count-up | P1 | Routed | Not retested | Plan 02, using Plan 01 notice system |
| `PT-20260902-04` | Rainbow Power Parade topology | P1 | Candidate | Automated | Family retest, then Plan 09 only if needed |
| `PT-20260902-05` | Escalating Power-99 presentation | P1 | Routed | Not retested | Plan 02; Plans 01 and 07B support |
| `PT-20260902-06` | Long-corridor variety | P1 | Routed | Not retested | Plan 09 and generator quality work |
| `PT-20260902-07` | Smooth camera/play feel | P0 | Routed | Not retested | Plan 07B; Plans 01 and 08 support |
| `PT-20260902-08` | Anchored touch joystick | P0 | Routed | Not retested | Plan 08; Plan 01 control surface |
| `PT-20260902-09` | Strong-enemy teaching | P0 | Routed | Not retested | Plan 01 with gameplay-owned suggestions |
| `PT-20260902-10` | Completion choices | P0 | Routed | Not retested | Root 03M contract, Plan 01/08; Plan 10 extension |
| `PT-20260902-11` | More and optional battles | P1 | Routed | Not retested | Plan 09 |
| `PT-20260902-12` | Varied, smaller level portfolio | P0 | Routed | Automated | Plan 09 authored and generated-topology phases |
| `PT-20260902-13` | Remove portal glyph clutter | P2 | Routed | Not retested | Plan 02 |
| `PT-20260902-14` | Spikes and ice traversal | Epic | Needs decision | Not retested | Dedicated mechanics specification |
| `PT-20260902-15` | Richer materials and obstacle VFX | P1 | Routed | Not retested | Plans 04 and 02; Plan 07B qualifies |
| `PT-20260902-16` | Rewarded dead ends; quiet minimap | P1 | Routed | Not retested | Plan 09/generator plus Plan 01 |
| `PT-20260902-17` | World and lore enrichment | P1 | Routed | Not retested | Plan 09; Plans 10 and 11 consume canon |
| `PT-20260902-18` | Expressive portrait and emotion marks | P1 | Routed | Not retested | Plans 03, 01 and 02; Plans 05/07B support |
| `PT-20260902-19` | Guided mechanic-introduction trails | P0 | Routed | Not retested | Plan 09 design gate; Plans 01/08 support |
| `PT-20260903-20` | Continuous contextual original OST | P0 | Routed | Not retested | Root 03M catalogue/port, then Plan 07B; Plans 01/02/08/10 support |
| `PT-20260903-21` | Verified retirement of superseded runtime assets | P1 | Routed | Not retested | Plan 03 classification; Plan 07B tooling; final Plan 12 sweep |
| `PT-20260903-22` | Mimic reveal and magnetic reward showers | P1 | Routed | Not retested | Gameplay contract/Plan 09 plus Plans 02/03/05/07B; Plan 13 fallback |
| `PT-20260903-23` | Compact contextual BGM controls | P1 | Routed; Loop needs decision | Not retested | Root 03M port, Plan 01 surface, Plan 07B controller, Plan 08 input parity |
| `PT-20260903-24` | Meaningful enemy, friend and terrain variety | P1 | Routed | Not retested | Plan 09 campaign/generator; Plans 03/04/07B/10/13/12 support |
| `PT-20260903-25` | Art-directed game UI and presentation-scale imagery | P1 | Routed | Not retested | Plan 01; Plans 03/02/07B/11 support |
| `PT-20260903-26` | Early front-door art and family-preview builds | P1 | Routed | Not retested | Plan 03 + root/release manager; Plans 01/07B/11 support |
| `PT-20260904-27` | Earned-achievement holographic showcase | P1 | Routed | Not retested | Plan 01 interaction; Plan 02 effect; Plans 07B/08 qualify |
| `PT-20260904-28` | Personal achievement sticker book | P2 | Needs decision | Not retested | Plan 14 opportunity review or explicit follow-on plan |
| `PT-20260904-29` | Living goal-portal spiral | P1 | Routed | Not retested | Plan 02; Plan 07B qualifies; Plan 13 fallback |
| `PT-20260904-30` | Cast review and compact VN interludes | P1 | Routed | Not retested | Plan 01 shell; Plan 09 canon/content; Plan 11 consumes |
| `PT-20260904-31` | AI-generated voice-acting exploration | Epic | Needs decision | Not retested | Plan 14 opportunity review; explicit follow-on only |

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
- Delivery: Routed
- Verification: Not retested
- Primary owner: Root checkpoint 03M before Plan 01
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

**Adopted contract.** This Human direction supersedes Plan 08's earlier neutral-
after-door assumption. Checkpoint 03M publishes the exact stationary interaction:
the opening input commits one door event without movement, and only a later
eligible cadence step of the same still-held direction may enter after the
presentation lock clears. A discrete or released input never continues.

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
- Delivery: Routed
- Verification: Not retested
- Primary owner: Root checkpoint 03M, then Plan 01
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

**Adopted contract.** Star contact creates a persisted pending-completion state.
Stay leaves Ame on the exit tile and disarms that exit until she steps off, so it
does not reopen immediately. Next commits durable completion/rewards/unlocks
exactly once; Restart awards nothing. Reload restores the pending choice. Each
new pending-completion ID may present victory once, but presentation is never the
durable commit authority. Checkpoint 03M lands and tests this before Plan 01.

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
- Supporting work: Plan 09's bounded generated-topology sub-phase; Plans 01/07B
  enforce viewport and performance limits
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
- Manager guardrail for design review: no more than four of 24 authored chapters
  may exceed 16 tiles on either axis, including inherited levels. Chapter 24 is
  the sole default new exception; trading that exception requires an explicit
  Phase-0 portfolio decision and Human/family evidence. Every exception remains
  subject to the absolute 24×24 cap.
- If the current nine-of-sixteen audit still holds, Plan 09 must compact at least
  six inherited levels under content revisions before adding the eight new maps;
  this is an implementation phase with migration, solver/Hint, route-metric and
  family-play evidence, not a report-only recommendation.
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
- Primary owners: Plan 09 for authored placement and its bounded generated-
  topology sub-phase for procedural invariants; Plan 01 for minimap filtering
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
  cohorts ends in a small optional collectible: Gold, Science, a chest/bag that
  resolves to one of those currencies, or another explicitly approved optional
  collectible that is durably credited and visibly cleared from the world.
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
- Primary owners: Root checkpoint 03M for delivered-catalogue compatibility and
  the canonical `MusicTransportPort`; Plan 07B for the complete contextual
  controller, continuity, loading and performance qualification
- Supporting owners: Plan 01 for typed screen/overlay context; Plan 02 for SFX/BGM
  coexistence; Plan 08 for browser/controller activation; Plan 09 for campaign
  integration; Plan 10 for the Friend Garden context
- Dependencies: Delivered Human-authored MP3 pools; track-level provenance,
  mastering and listening qualification; final app-context state model;
  approved performance feature allocation and rebaseline
- Target gate: No missing OST URL and green port/current-adapter conformance at
  03M; core five present contexts during Plan 07B; Garden wiring during Plan 10;
  all final originals qualified before release acceptance

**Human decision.** Once music is enabled, normal foreground play should always
have context-appropriate BGM: title/home from `title`, story pop-ups from `story`,
maze play from `maze`, post-maze “You did it!” screens from `victory`, Friend
Garden play from `garden`, and Adventure Book browsing from `adventure book`.
Randomly select from the matching MP3 folder, transition with smooth fades or
crossfades, and prepare likely next tracks early enough that loading never causes
an audible silent gap.

The old flat music set was placeholder material from other projects and is
non-shipping. On 2026-09-03 the Human delivered the candidate original Maze so
Puzzle OST in its six intended physical folders and removed the old root files.
Delivery does not by itself prove catalogue integration, mastering, rights or
platform playback.

**Current-checkpoint audit.** Confirmed delivered but not integrated. The six
physical pools contain 42 parseable MP3s / 99,151,313 bytes / about 68m25s:
`title` 6, `story` 6, `maze` 14, `victory` 4, `garden` 6 and
`adventure-book` 6. There are no root-level MP3s, non-MP3 files, exact SHA-256
duplicates or case collisions. All six pools are nonempty. The `B` alternates
share embedded titles with their base compositions, so catalogue IDs/display
labels must distinguish them; Victory numbering has no `2` and must not be
treated as an ordered sequence.

`src/music.ts`, `src/music.test.ts` and `docs/MUSIC.md` still bind the deleted
14-file flat placeholder catalogue. All 42 delivered tracks are presently
unreferenced, and an existing `dist/` remains stale with the old files. A focused
music test correctly fails its catalogue assertion (16/17 tests pass); a fresh
runtime would request missing old URLs. The player still owns one looping
`HTMLAudioElement`, sets `preload="none"`, and disposes the audible element before
a replacement is ready. There is no standby lane, readiness gate,
fade/crossfade, same-pool succession or failed-track recovery.

The delivered OST is +28 files / +48,994,642 bytes versus the placeholder set.
That deliberate content increase needs an approved audio allocation and
performance rebaseline; it is not permission to discard Human tracks to preserve
the historical media total. Predictive preparation must remain bounded rather
than eagerly loading all 42 files.

**Folder and catalogue contract.**

- The final logical and delivered physical BGM pools are exactly `title`,
  `story`, `maze`, `victory`, `garden`, and `adventure-book`. Preserve these
  approved URL-safe slugs.
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

**Scope boundary.** Plan 02 does not own BGM policy. Root checkpoint 03M owns
only the stable delivered catalogue, valid current adapter and transport port;
it does not claim continuous contextual playback. Plan 07B consumes the typed
UI, SFX and activation seams and implements/qualifies the full controller behind
that port. Plan 10 adds only the Garden context hook. The card cannot become
`Accepted` while any placeholder ships, any delivered file is silently omitted,
current source points at a deleted URL, or a consumer bypasses the port.

### PT-20260903-21 — Verified retirement of superseded runtime assets

- Type: Asset lifecycle, repository hygiene and release packaging
- Impact: P1 — mandatory release-hygiene gate
- Delivery: Routed
- Verification: Not retested
- Primary owners: Plan 03 for art-family classification/source retention; Plan
  07B for authoritative reachability and package tooling; final Plan 12 for the
  post-feature sweep
- Dependencies: Final catalogue pointers from Plans 03, 05, 09, 10 and 11;
  expired rollback windows; lifecycle/tombstone schema; clean-clone and packaged
  Tauri evidence
- Target gate: Plan 07B proves/classifies candidates and may optimize active
  representations without archiving/removing runtime files; after Plan 13 closes
  all pointer-producing work, Plan 12 alone runs the final two-stage sweep before
  root release-candidate qualification

**Human decision.** Old unused and superseded assets should leave runtime and
the repository after a safe archive handoff rather than accumulating
indefinitely. Superseded animal-cage versions are a concrete example. This is a
request for rigorous lifecycle management, not blanket permission to remove
every file that a text search does not find and not authorization for direct
deletion before the Human confirms the external backup.

**Current-checkpoint audit.** Plan 03's manifest currently marks 16 superseded
runtime images totalling 4,708,989 bytes and four deprecated images totalling
1,164,630 bytes. Active cages point only to the v5 WebPs. Five superseded images
are legacy-runtime-only sole copies with no separate source record; 11 older
cages have retained partial masters. Some deprecated rewards are also sole-copy.
The current art validator expects every recorded derivative path to exist, so it
cannot yet distinguish an intentional retirement from accidental corruption.

**Lifecycle and preservation contract.**

- Extend the asset manifest with explicit `active`, `reserved`, `dormant`,
  `deprecated`, `superseded` and `retired` lifecycle semantics. A retired
  tombstone records its old path, exact hash/bytes, replacement, owner/reason,
  first/last known commit, retirement date and tested restore procedure.
- Preserve original/source masters, prompts, model sheets, provenance/rights
  records, proof sheets and Git history. A legacy runtime file that is the only
  surviving copy remains preserved unless the Human explicitly includes it in
  the externally backed-up retirement set.
- Keep the immediately preceding approved runtime revision through its declared
  rollback window. Dormant, reserved and future-plan assets are not retirement
  candidates merely because the current runtime does not request them.
- The original OST is explicitly excluded from generic image/orphan cleanup.
  Placeholder-audio retirement belongs to `PT-20260903-20` and uses the same
  reachability/package-proof discipline.

**Reachability and archive-first retirement contract.**

- Generate one authoritative inventory that covers TS/TSX/CSS/static imports,
  catalogue and manifest pointers, `import.meta.glob`, generated theme/level
  paths, story/tester routes, preload lists, Tauri/app icons, tests and the
  performance feature-allocation/reservation ledger.
- Classify every candidate individually. Old cages are expected candidates, not
  pre-approved removals. Never use a wildcard, filename age, missing plain-text
  hit or visual similarity as sole proof.
- Switch and qualify replacement pointers first. After the rollback window and
  after Plan 13, **copy** each individually proven candidate into a hash-verified,
  ignored non-runtime handoff archive outside `public/`, `dist/`, and all package
  inputs while retaining the repository/runtime source. An archive under
  `public/assets` is invalid because it still ships.
- Record the archive manifest, tombstones and restore drill, then pause. Only
  after the Human confirms that the archive was copied to external storage may
  the root manager authorize a separate family-isolated repository-removal
  commit whose inverse is obvious.
- Make validators accept a well-formed retired tombstone while continuing to
  fail a missing active/deprecated derivative.

**Acceptance evidence.**

- From a clean clone, run full tests, `art:check`, production build, generated
  inventory, every authored/generated/theme/story/tester/preload route and the
  supported browser viewport matrix with no missing request or fallback.
- Build and exercise the offline packaged Tauri app. Scan `dist`, executable and
  packages by basename and exact hash to prove retired delivery bytes are absent
  and required assets remain present.
- Record before/after source-runtime/dist/package file counts, encoded bytes and
  package hashes. Explain every retained candidate, archived candidate and
  separately authorized repository removal.
- Perform an exact-SHA rollback drill from the handoff archive that the Human
  confirms was externally backed up and prove the restored derivative matches
  its tombstone.
- Keep cleanup separate from replacement generation and keep the archive-handoff
  checkpoint separate from repository removal so a visual regression can be
  rolled back without reconstructing an unrelated bulk removal.

### PT-20260903-22 — Mimic reveal and magnetic reward showers

- Type: Cross-system gameplay, reward and presentation feature
- Impact: P1 — high-value delight and encounter-variety feature
- Delivery: Routed
- Verification: Not retested
- Primary owners: Root gameplay contract and Plan 09 for deterministic rules,
  balance, persistence, solver semantics and placement; Plan 02 for the reusable
  presentation and audio choreography
- Supporting owners: Plan 03 for production art; Plan 05 for bounded chest/Mimic
  frames; Plan 07B for performance/audio qualification; Plan 10 for later co-op
  recipient semantics
- Dependencies: Stable semantic object IDs and active-run fingerprints; typed
  committed reward outcomes; final chest/Mimic/reward art; Plan 02 presentation
  lifetime and cancellation; explicit Gold/Science balance ranges
- Target gate: Static art in Plan 03, reusable presentation in Plan 02, optional
  frames in Plan 05, gameplay/content integration in Plan 09, and Plan 13 only
  for compatible unresolved polish

**Human decision.** Every approved Mimic family starts as its matching closed
chest. The first bump triggers a
single chest-strike/opening beat, then reveals either a good chest 65% of the
time or a Mimic 35% of the time. A good chest awards a random bounded amount of
either Gold Stars or Science Parts. A Mimic reveals its Power and immediately
uses the ordinary combat/too-strong rules. Ordinary chests never retaliate.

Good chests spray reward sprites outward with simple semi-random 2D physics,
currency-coloured particle trails and no wall/object collision, then pull the
sprites into Ame magnetically with satisfying collection audio. Reuse this
celebration for ordinary Gold chests and bags. Every rescued friend releases a
bounded Gold-Star reward; every defeated enemy releases Gold Stars and Science
in addition to the existing Power result.

**Current-checkpoint audit.** The current engine has fixed-amount `treasure`
objects and one `treasure-collected` event. `App.tsx` presents a single chest or
Science image with eight short-lived symbol motes flying toward a wallet. The
current `candy-mimic` is an ordinary visible enemy style, not a disguised-chest
state machine. Enemy defeat and friend rescue do not currently grant the new
currency drops. The content fingerprint includes treasure currency/amount, but
there is no persisted weighted reveal, reward-drop table or resolved Mimic
outcome. This therefore requires gameplay/save/solver work, not only VFX.

**Gameplay and determinism contract.**

- Define one versioned `MimicFamilyId` registry (or final canonical equivalent).
  Every final approved family—including Treasure and Candy when both pass Plan
  03—cross-resolves three geometry-compatible identities: closed chest, benign
  open reward chest and revealed enemy. Families change art/personality, not the
  65/35 rule or reward/combat semantics.
- Represent the disguised chest with a stable semantic object identity and an
  explicit unresolved/resolved state. Its outcome and amounts are derived from
  a documented deterministic run seed plus object ID, or persisted directly;
  save/resume, repeated bumps and overlay/navigation churn cannot reroll it.
- Implement the probability as an auditable 65 reward buckets / 35 Mimic
  buckets rather than a flaky statistical test. Deterministic seed cohorts cover
  both outcomes and boundary buckets.
- On a reward result, choose Gold or Science through a documented deterministic
  rule and credit an amount inside explicit positive min/max bounds. On a Mimic
  result, reveal the authored enemy style and Power before resolving the normal
  comparison, battle, or picture-led too-strong guidance.
- Player position and control follow the stationary interaction contract: Ame
  strikes from the originating tile, the chest resolves once, and held movement
  cannot teleport her through the object or replay the interaction across the
  presentation lock.
- Currency/Power/rescue state commits exactly once before presentation becomes
  authoritative. Every resolved semantic ID prevents duplicate drops after
  resume, revisit, cancellation or rapid input.
- Mimics and random rewards remain optional to the ordinary solution. Neither
  reveal branch may make a required route unsolvable, and hints must not promise
  an unknown/random reward as the required answer. Solver fixtures exercise the
  reward branch, beatable-Mimic branch and too-strong-Mimic branch.
- Freeze named reward ranges and drop tables in `GAMEPLAY_DESIGN_SPEC.md` before
  implementation. Enemy drops preserve the existing Power equation while adding
  bounded Gold and Science; rescue drops preserve optional-rescue semantics.
- In the new content/generator version, Candy Mimic no longer appears as an
  always-visible ordinary `EnemyStyle`. Revise its existing authored placement
  into the Candy disguised-object family, preserve durable completion/reward
  history under the level revision, and retain the old interpretation only for
  pinned historical generator/content reconstruction.
- Give every Mimic-family registry entry explicit `campaignEligible` and
  `generatedEligible` dispositions. Under the new generated-content version,
  Surprise generation may place at most one generated-eligible disguised Mimic
  and only in a solver-proven optional chest/treasure slot; zero remains a common
  valid outcome. Family selection and the committed 65/35 reveal use deterministic
  streams isolated from topology, required rewards, ordinary enemy composition
  and solution truth. Seed cohorts cover every eligible family and both reveal
  branches without turning either into a required path.

**Reusable presentation contract.**

- Consume a typed, already-committed reward outcome. The effect never computes
  currency, chance, enemy Power or gameplay eligibility.
- The chest strike/open, reveal, outward ballistic spray, short coloured trails,
  magnetic homing, exact amount/count-up feedback and collection audio form one
  cancellable timeline with named semantic anchors.
- Reward sprites are visual representatives, not necessarily one DOM/canvas
  object per credited unit. Cap and pool them; large rewards communicate exact
  totals through text while preserving a generous-looking bounded burst.
- Particles ignore maze collision and other objects as requested. Their seeded
  visual variation is reproducible in tests but may vary between distinct
  events. It cannot change gameplay truth.
- Rapid sequential rewards join the shared interaction-celebration queue from
  `PT-20260902-01`; they may overlap only within the bounded Plan-02 policy and
  must remain readable rather than becoming visual/audio clutter.
- Reduced motion uses a short contained burst or static reveal plus immediate
  credited-count feedback; it removes long ballistic travel and magnet motion.
  Muted/backgrounded/navigation-cancelled runs remain correct and leak no timer,
  sound, sprite or presentation lock.

**Art, animation and content requirements.**

- Plan 03 supplies a coherent closed, benign-open and revealed-enemy triplet for
  every approved Mimic family plus Gold/Science pickup art, with shared per-family
  construction, trustworthy alpha, pivots, safe bounds and actual-size proofs. A
  checkerboard is never baked into pixels.
- Plan 05 may add a small closed → struck → open/reveal sequence and a playful
  Mimic wake/lunge while preserving static fallback and exact registration.
- Plan 09 places each approved Mimic family sparingly enough to preserve surprise, mixes them with
  trustworthy ordinary chests, and records encounter/reward pacing in the
  24-level matrix. Generated mazes require the same solvability and deterministic
  identity rules before receiving Mimics.
- Plan 10 may redirect or split only the visual homing destination for the
  collecting player. Shared rewards credit once and the solo Ame behaviour
  remains the default contract.

**Acceptance evidence.**

- Unit/property tests prove the exact 65/35 bucket contract, bounded reward
  amounts, both currencies, stable save/resume outcomes and exactly-once credit.
- Registry/asset tests cover every approved Mimic family's three-state mapping,
  geometry/registration compatibility, shared mechanics and absence from the new
  ordinary enemy-style pool.
- Solver and migration fixtures cover every reveal branch without making random
  rewards required or corrupting old active runs/progress.
- Browser tests trigger normal chest, Gold bag, reward Mimic, beatable Mimic,
  too-strong Mimic, friend rescue and enemy defeat under rapid-input,
  cancellation, reduced-motion and level-transition conditions.
- Performance stress covers the maximum allowed simultaneous/queued burst on
  web and Tauri with no unbounded nodes, retained timers, decoded-resource leak,
  frame-time cliff or SFX clipping. Lower tiers preserve meaning and exact totals.
- Human/Amelia playtesting confirms the reveal reads before combat, the 35%
  surprise feels funny rather than unfair, the loot shower feels satisfying,
  and reward pacing does not make ordinary exploration or quiet moments noisy.
- No paid purchase, monetized random outcome, repeatable reload exploit, or
  coercive reward loop is introduced.

### PT-20260903-23 — Compact contextual BGM controls

- Type: Music UX, transport and cross-input accessibility
- Impact: P1 — high-value quality of life
- Delivery: Routed; Loop needs decision
- Verification: Not retested
- Primary owners: Root checkpoint 03M for the canonical transport port,
  conformance fake and conservative current adapter; Plan 01 for the compact
  disclosure surface; Plan 07B for final contextual history, selection,
  transitions, fallback and media qualification; Plan 08 for semantic actions
  and controller/keyboard/touch/pointer parity
- Supporting owners: Plan 02 for BGM/SFX coexistence; Plan 10 for the Garden
  music context; Plan 13 for compatible residual polish only
- Dependencies: `PT-20260903-20` delivered static catalogue and transport port;
  Plan 01 focusable overlay topology; Plan 08 input-context policy
- Target gate: Port/current-adapter conformance in 03M, UI surface in Plan 01,
  semantic controller operation in Plan 08, final contextual transport and
  audible qualification in Plan 07B

**Human outcome.** Players can request Previous, Next or Shuffle/Random within
the music pool for the current screen or activity. Mute/Unmute and all music
transport actions live inside one compact Sound control rather than becoming a
new row of permanent buttons. Loop is an attractive possibility, but remains an
explicit Human decision.

**Transport contract.**

- The active typed context is a hard boundary. Maze controls select only Maze
  tracks; title, story, victory, Garden and Adventure Book use their own pools.
  A context transition overrides transport history and any possible loop.
- `Previous` traverses actual valid listening history in the active context,
  not filename or asset order. It is visibly disabled or accessibly announced
  as unavailable when no prior eligible track exists.
- `Next` advances through the contextual selector and its no-immediate-repeat
  policy. `Shuffle/Random` selects a different playable track when at least two
  exist. Empty, one-track and failed-candidate cases have explicit fallbacks and
  never manufacture an avoidable silence gap.
- Manual choices enter the same history/shuffle state as automatic completion.
  They must not fork a second music controller or bypass preload, crossfade,
  fallback, visibility, activation or lifecycle rules from `20`.
- Rapid commands cancel or supersede the pending transition deterministically:
  no overlapping tracks beyond the intentional crossfade, double-owned player,
  stale timer, phantom history entry or late start after the context has changed.
- Loop, if approved, applies only to the current track and current context. The
  Human must choose whether it is session-only or persistent; implementation
  may reserve UI space but may not silently choose either policy.

**Compact UI and input contract.**

- Keep one persistent Sound affordance in the canonical cross-device action
  order. It opens an accessible popover/menu or compact sheet with Mute/Unmute,
  Previous, Next and Shuffle/Random, plus Loop only after approval.
- Do not add a permanent transport strip or persistent Now Playing panel. The
  closed control communicates muted/playing state without relying on colour;
  every expanded action has an accessible name, current/disabled state and a
  large enough touch/focus target.
- TV, desktop, iPad and compact-phone layouts preserve the same logical option
  order. The surface supports pointer, touch, keyboard and controller; Back/
  Cancel closes it and gameplay input cannot leak through while it is open.
- Plan 01 owns only presentation/focus state. Plan 07B owns transport truth.
  Plan 08 dispatches typed actions instead of simulating clicks or reading icons.

**Acceptance evidence.**

- Unit/model tests cover history and pool boundaries, repeat avoidance, missing
  candidates, zero/one/two/many-track pools, manual versus natural progression,
  rapid commands, mute/unmute and context changes.
- Browser integration proves one disclosure surface, focus return, correct
  disabled/pressed announcements, input isolation and stable layout at every
  required viewport. Controller-only Tauri testing exercises every action.
- Audible web and packaged-Tauri tests confirm smooth manual crossfades, correct
  current-pool selection, no overlap or unintended silence, clean background/
  foreground behaviour and honest user-activation handling.
- Human/family testing confirms the control is easy to discover but does not
  clutter the HUD, and that repeated skipping feels immediate and predictable.

### PT-20260903-24 — Meaningful enemy, friend and terrain variety

- Type: Authored campaign ecology, deterministic generation and catalogue
  integration
- Impact: P1 — high value and a mandatory Plan-09 content-acceptance gate
- Delivery: Routed
- Verification: Not retested
- Source intake:
  [`playtests/2026-09-03-campaign-asset-ecology-and-world-theming.md`](playtests/2026-09-03-campaign-asset-ecology-and-world-theming.md)
- Primary owner: Plan 09 for authored campaign placement, content-use evidence
  and its bounded generated-topology phase
- Supporting owners: Plan 03 for final catalogue/integration intent; Plan 04 for
  bounded multi-region terrain rendering; Plan 07B for loading/performance; Plan
  10 for Friend Garden and ordinary-Duo consumption; Plan 13 for closure/consumer
  verification, then Plan 12 for lifecycle/archive verification
- Dependencies: Final Human-approved Plan-03 art catalogue and content-
  integration manifest; stable semantic object IDs; versioned generated-content identity; terrain
  compatibility metadata; final 24-chapter design packets
- Target gate: Content-integration manifest at Plan 03; render seam in Plan 04;
  authored/generated content and coverage in Plan 09; Garden consumption in Plan
  10; closure/consumer verification in Plan 13; lifecycle/archive verification
  in Plan 12

**Human decision.** Use the complete final gameplay-art library purposefully.
Across the story campaign, gradually introduce new enemy types as the journey
progresses. Include some coherent family or themed-subset mazes, some mixed-
roster mazes, and explore a late broad-roster showcase. Every final enemy type
and rescue-friend type should receive a meaningful authored-campaign
opportunity. Surprise Mazes do not need that progression, but should vary
between repeated, subset and mixed encounters. Campaign floor/wall choices are
fixed and art-directed per chapter; generated combinations must be compatible.
Clearly separated portal/puzzle regions may use distinct harmonious or
intentional contrasting terrain treatments so they feel like different places.

**Current-checkpoint audit.** The existing vision asks for intelligent use of
the full library, and Plan 09 requests an adjacency report, but neither currently
guarantees final-roster coverage or a progressive introduction curve. Authored
levels already select one fixed terrain theme. Generated visual selection uses a
separate deterministic stream and a validated complete terrain theme, which are
strong foundations, but currently chooses one enemy style for the entire maze.
Authored style overrides are keyed primarily by Power rather than semantic enemy
object ID, so they cannot reliably express arbitrary mixed same-Power groups.
The current level/render contract exposes one terrain theme for the whole map
and cannot yet assign distinct visual themes to portal-separated regions.

**Content-eligibility and identity contract.**

- Plan 03 supplies a versioned content-integration manifest with stable semantic
  identity, lifecycle, proposed content role, intended owner/consumer and
  loading intent. Plan 09 then creates the separate typed gameplay-content
  registry and freezes `campaignEligible`/`generatedEligible` for final enemy
  styles, rescue-friend species and environment recipes. Source masters, proofs,
  rejected candidates, optical renditions, superseded assets and explicitly
  future/dormant concepts do not count as missing gameplay use.
- Every final Human-approved identity intended for gameplay enters that registry
  as eligible by default. Exclusion requires explicit Human deferral, not a
  manager convenience; a roster that violates the debut-density budget returns
  for a pacing/roster decision instead of losing a type silently.
- Give every eligible enemy/friend stable type-level `EnemyStyle` /
  `AnimalSpecies` identity (or explicitly renamed, versioned final equivalents) independent of
  filename, array position, Power value or one-character map token. Individual
  authored placements keep separate level-scoped semantic `LevelObject.id` values and
  coordinates. Add theme, family, generated-eligibility, loading and intended-
  consumer metadata without making visual tags a gameplay rule or letting an
  object insertion renumber a roster type. Mimic keeps a separately typed
  disguised-object identity.
- Campaign and generated selection use semantic object IDs and independent
  deterministic presentation streams. Adding or reordering art cannot perturb
  maze topology, reward truth, Power arithmetic or an existing versioned seed.
- An approved gameplay-eligible asset with no promised consumer is an
  integration defect or explicit Human deferral, not an orphan. It cannot be
  retired merely to make a reachability or package report pass.

**Authored campaign contract.**

- Across the final 24 chapters, every gameplay-eligible enemy style appears in
  at least one purposeful encounter and every final rescue-friend species has at
  least one stable, Solo-accessible authored rescue placement. Placement is
  fixed for that content revision and does not reroll on reload.
- The final roster reconciliation explicitly includes the Human-requested
  unicorn under Plan 03's published public name/species ID; do not invent a
  parallel identity from planning prose.
- Introduce enemy types progressively. Give a newcomer a readable first
  encounter before relying on it in a later mixture; after introduction, reuse
  it in coherent families, contrasting pairs and broader groups. A skeleton-and-
  lizard chapter is one valid themed example. Visual identity does not silently
  add attacks, reach, status effects or solver rules; ordinary guardians retain
  the universal Power and Polite Sword contract.
- Friend assignments are deliberately authored. Some chapters may rescue a
  coherent ordinary, mythic, yokai, fantasy, Greek/Roman or environmental group;
  others may provide a cheerful mixture. Every friend remains optional for
  ordinary completion, and Required Path never treats roster coverage as a
  prerequisite.
- Use Chapter 24 as the preferred readable all-roster festival, after every type
  has a meaningful interactive debut by Chapter 23. Begin with no more than
  twelve interactive guardians and render remaining types as unmistakable non-
  colliding festival cameos outside combat/solver state. Raise that bound only
  with solver, route, density, loading, performance and family-play evidence;
  never create checklist stuffing, forced combat or a Power gauntlet.
- Every final approved Mimic family—including Treasure and Candy when both pass
  Plan 03—uses the single PT22 disguised-object mechanic, not an ordinary enemy
  skin, and Plan 09 owns implementation/placement. A missing dependency returns
  to its named owner or an explicit Human deferral gate rather than silently
  making a family ineligible or substituting an always-visible guardian.
- Every chapter design packet records fixed enemy/friend assignments, first-
  introduction status, encounter profile, authored terrain region(s), intended
  thematic logic and neighbour comparison. Coverage does not excuse an asset
  placed without gameplay, narrative, spatial or emotional purpose.

**Generated-content and environment contract.**

- Versioned Surprise generation deterministically chooses one feasible
  `single-style`, `themed-ensemble` or `mixed-ensemble` profile with the exact
  count/family semantics maintained in the Gameplay spec and Plan 09. One-enemy
  Gentle mazes use `single-style`; an infeasible multi-style mode is never drawn
  and silently degraded. A broad deterministic cohort must reach every generated-
  eligible family without requiring every seed to contain everything.
- Mimics use their own versioned family registry rather than those ordinary
  enemy modes. Each family has an explicit `generatedEligible` disposition; a
  new generated-content version may place at most one in a solver-proven optional
  chest/treasure slot, with zero as a normal result. Its family/outcome streams
  are isolated from topology, required rewards, ordinary enemy composition and
  solution truth, and cohort evidence reaches every eligible family plus both
  65/35 reveal branches.
- Rescue friends use a separate seeded selection without duplicates. Because
  species affects content identity and future Garden outcomes, its eligible pool
  and algorithm have their own generated-content version and feed the gameplay
  fingerprint rather than being treated as visual-only presentation.
- Keep layout/reward PRNG streams independent from enemy/environment
  presentation selection and from friend-content selection.
  Generator catalogue growth must not change a prior seed unless an explicit
  generator/content version does so with corresponding identity and tests.
  Current generated active runs are not persisted; preserve historical golden
  seeds, records and debug reconstruction without inventing resume migration.
- Every authored chapter declares one fixed `EnvironmentManifest` containing a
  required base/default complete recipe and one to four complete named region
  assignments. A single-region chapter assigns its sole region the base recipe;
  clearly separated sections, especially teleporter-linked islands, may use
  additional regions. Every cell belongs to exactly one region, and visual
  recipes change presentation only—not collision, reachability or portal rules.
  Reject an empty manifest, an uncovered/overlapping cell or more than four
  regions. Stable semantic region IDs may
  support landmark/Hint language, but texture/colour is never the sole clue; a
  hint-significant semantic map is content-versioned separately from its visual
  recipe. Avoid per-tile patchwork.
- Generated mazes choose only complete validated environment recipes from the
  shared Art/Lighting catalogue. A recipe may encode an approved floor/wall
  pairing, but generation never draws those two halves independently into an
  unreviewed clash.
- Multi-region rendering preserves world-space texture anchoring, wall topology,
  seams, one resolved level-wide lighting direction, object contrast, minimap readability, reduced/
  static truth and bounded DOM/decode work.

**Acceptance evidence.**

- Produce a 24-row campaign content-use/adjacency matrix and a generated-cohort
  report covering every eligible enemy, friend and terrain family, first
  introduction, themed/mixed profile, neighbour repetition and intended use.
  Reconcile every other gameplay-facing weapon, cage, key/door, portal,
  treasure/Science, traversal-item, hazard and dressing family from Plan 03's
  integration manifest to a real consumer or explicit disposition.
- Validators fail missing eligible campaign coverage, unknown semantic IDs,
  invalid generated pools, incompatible terrain pairs, uncovered/overlapping
  visual regions and accidental filename/Power/array-order identity.
- Solver and counterfactual tests prove increased encounter variety does not
  bypass intended prerequisites or make optional combat required. All friend
  placements preserve zero-rescue ordinary and exact-all-rescue routes.
- Browser/Tauri evidence covers first encounters, themed and mixed chapters, the
  broad-roster prototype, representative generated profiles, and every multi-
  region theme at the required viewports, motion/quality modes and input paths.
- Loading/performance tests prove current-screen loading rather than title-time
  preload of the full roster; qualify worst-case encoded/decoded memory, DOM,
  frame work, transition, offline package and rollback behaviour.
- Human/family play confirms the introduction curve is legible, themed sets feel
  intentional, mixed sets feel surprising rather than noisy, friends remain
  appealing optional discoveries, and different portal regions genuinely feel
  distinct without becoming confusing.

### PT-20260903-25 — Art-directed game UI and presentation-scale imagery

- Type: Interface art direction, typography, catalogue integration and
  cross-device presentation
- Impact: P1 — high-value polish and a mandatory Plan-01 quality gate
- Delivery: Routed
- Verification: Not retested
- Source intake:
  [`playtests/2026-09-03-art-directed-ui-and-playable-checkpoints.md`](playtests/2026-09-03-art-directed-ui-and-playable-checkpoints.md)
- Primary owner: Plan 01 for the UI material/shape/type system, responsive
  surfaces, contextual art slots, semantic controls and final composition
- Supporting owners: Plan 03 for approved art, presentation renditions, logo and
  Art-Bible tokens; Plan 02 for bounded surface transitions and delight; Plan
  07B for loading/decode/render qualification; Plan 11 for final brand review
- Dependencies: Accepted Plan-03 runtime catalogue and Art Bible; semantic
  interaction/item identities; shared motion and quality modes; common viewport
  matrix
- Target gate: Plan 01 acceptance, with downstream visual/performance
  qualification in Plans 02 and 07B

**Human decision.** The finished interface must look like a polished, authored
video-game UI from the same world as the final sprites—not a clean web dashboard
with game images placed on top. Recent Kirby, Mario Party, Trails in the Sky,
and Super Mario Bros. Wonder interfaces communicate the desired joy, hierarchy,
readability and console-game finish at a principles level only; Maze retains an
original material, shape, layout, icon, typography and motion identity.

**Required visual system.**

- Implement the Art Bible's “paper-cut signals over magical surfaces over
  painted world” hierarchy as a small, coherent Maze-native surface family.
  A leading treatment is softly frosted white/pearl magical glass with a bright
  inner rim, gentle world colour, material depth and sparse storybook ornament.
  Do not copy a reference game's panel, logo, silhouette or trade dress.
- Keep dense text centres quiet and sufficiently opaque. Avoid repeated generic
  cards, default web pills/forms, equal emphasis, excessive nested glass and
  decorative gradients without semantic purpose.
- Full quality may use a bounded, measured backdrop treatment on a small number
  of static overlays. Lite/static recipes reproduce the material with opaque
  colour, gradients, borders and precomposed highlights. The moving maze is not
  continuously re-blurred behind every panel.
- Use the approved sticker-style icons as literal semantic signals. Controls
  remain real buttons with readable focus, selected, pressed, disabled and
  default states that never depend on gloss, animation, sound, hue or hover.

**Typography and large-art requirements.**

- Freeze a compact, locally packaged, licence-recorded type system: a rounded
  expressive display/control face and either its legible text cut or one quiet
  companion for prose. Disable synthetic weights; test required glyphs,
  arithmetic, stable/tabular figures where needed, fallback, byte/loading cost,
  couch distance, smallest supported size, 200% resize and text spacing.
- The catalogue resolver distinguishes field/optical and presentation
  renditions. It never enlarges a small field sprite into fuzzy modal artwork.
- Preserve the existing blocker mechanic and exact text/image behavior; its
  current 112px direct `itemSrc` is the migration baseline, not a reason to add
  a second dialog or gameplay state. Replace URL/field-image coupling with
  semantic rendition selection and an art-directed responsive composition.
- Blocker feedback prominently displays the exact required item's large
  presentation rendition with concise real text such as “You need the Splash
  Boots.” Too-strong guidance, new friends/enemies, item details, Adventure Book,
  important rewards, victory and selected story moments may use large art when
  it improves recognition or emotion; routine HUD cells remain restrained.
- Load presentation art only for the visible or bounded-imminent surface. A
  missing or failed rendition falls back to the correct semantic optical image
  and text without layout shift, broken boxes or blocking the action.

**Acceptance evidence.**

- Human review across TV, desktop, iPad, Tauri minimum and phone agrees the UI
  feels authored for Maze rather than like a generic web application.
- A component/state proof sheet covers every surface material, button/focus
  state, typography tier, sticker family, blocker/item presentation, maximum
  text/content case and full/lite/static recipe.
- Contrast, colour independence, motion preference, 200% text, controller/
  keyboard/touch focus and all existing geometry gates pass on the painted UI,
  not only on an unstyled semantic shell.
- Loading evidence proves large renditions and literal blur do not produce
  title-time catalogue preload, interaction stalls, frame cliffs, unbounded
  decoded memory or a broken offline/Tauri fallback.

### PT-20260903-26 — Early front-door art and family-preview builds

- Type: Front-door visual identity and development/release process
- Impact: P1 — high-value family feedback without making every handoff a release
- Delivery: Routed
- Verification: Not retested
- Source intake:
  [`playtests/2026-09-03-art-directed-ui-and-playable-checkpoints.md`](playtests/2026-09-03-art-directed-ui-and-playable-checkpoints.md)
- Primary owners: Active Plan 03 for the initial title illustration, home splash
  and logo; root/release manager for selecting and producing preview checkpoints
- Supporting owners: Plan 01 for front-door integration and the preferred first
  family build; Plan 07B for reproducible artifact/performance tooling; Plan 11
  for final-canon brand audit rather than automatic replacement
- Dependencies: Human-approved front-door sources and derivatives; clean reviewed
  checkpoint; passing save/solver/input/build smoke gates; recoverable artifact
  provenance
- Target gate: Optional post-Plan-03/03M Art Preview when its current art and
  asset/audio URL set is cheap and green—without waiting for Plan-07B's final
  contextual controller; preferred Family Preview 1 after Plan 01; later
  previews only at named milestones

**Human decision.** Generate the title-screen illustration, home-screen splash
art and game logo now in the approved Maze house style so they can appear in an
early playable build. Plan 11 later evaluates these assets against the final
campaign, alternative Player 1, Ponchi, Melty and Friend Garden canon; it may
retain, extend or selectively replace them and is not required to redo good work.

**Front-door boundary.** The current `title` route already acts as the home/menu
surface; there is no separate Home screen. Plan 01 gives the two illustrations
distinct roles within the existing front door or reserves one deliberately—it
does not add navigation solely to show another image. Keep artwork, exact live
title text and logo separable. AI-generated lettering is concept evidence only;
the final “Maze so Puzzle” wordmark is reconstructed with exact controlled
lettering, spelling/legibility checks, accessible live text and Human approval.

**Preview policy.**

- Do not package every plan. Every accepted plan gets a committed/pushed source
  checkpoint whose GitHub CI and resulting Vercel production deployment are
  verified. Required portable-build decision points are `FP-ART-OST` (after Plan
  03 and root checkpoint 03M),
  `FP-UI1` (after Plan 01), `FP-CORE2` (after Plan 07B),
  `FP-CAMPAIGN` (after Plan 09), required isolated `FP-P10-GREYBOX`,
  `FP-COOP` (after Plan 10), and `RC-01` after Plan 11, Plan 13 closure, Plan 12
  archive-first hygiene, and root final qualification.
- Build only from a clean checkout/worktree of a reviewed, committed and pushed
  exact checkpoint, never the shared dirty tree. Required
  evidence is proportionate focused tests, `npm run check`, desktop compilation,
  production web build, and a title → story → maze → save/reopen smoke journey.
  A known-broken save, solver, input, asset or migration state cannot become a
  family preview merely because the artwork is exciting.
- Prefer the lowest-friction useful artifact. A Windows portable Tauri build is
  sufficient for an internal family preview when an installer/signing exercise
  adds no learning. Record exact commit and application/content versions,
  SHA-256, build tools/host, included milestone, known issues and rollback.
- The default family-preview bundle is one immutable SHA-named unsigned portable
  executable, a machine-readable manifest, SHA-256 checksum and short `PLAYTEST`
  note covering launch path, target journey, known issues, save/profile scope and
  rollback. Give a rebuild an explicit revision suffix; never overwrite evidence.
- Treat the generated artifact manifest/checksum file as hash authority. A stale
  prose “expected hash” example cannot override it.
- Keep binaries and transient screenshots out of runtime/source-control delivery
  unless an explicit release policy says otherwise. Label previews honestly:
  they do not claim public release, signing, store, low-end, hardware,
  accessibility or final performance qualification.
- Every non-RC preview uses a clearly labelled isolated profile/storage namespace
  or a verified backup/restore procedure. Prototype or newer-schema data must not
  contaminate the ordinary Tauri/WebView profile or undermine rollback to the
  last accepted build. `FP-P10-GREYBOX` is always disposable and isolated.
- Defer a required checkpoint only when it is red or packaging would risk
  artifact/data integrity; record the blocker and exact retry point. Imminent
  later improvements alone do not justify skipping it.

**Acceptance evidence.**

- Plan 03's approved front-door sources have clean derivatives, catalogue IDs,
  source/provenance records, responsive crop/safe zones, text/logo separation,
  rollback pointers and real title/home integration.
- Every produced preview has a compact manifest, hashes, known-issues note and
  smoke result tied to one immutable commit; every skipped named opportunity has
  an explicit reason.
- Amelia can launch the artifact through the documented path and complete the
  chosen representative journey without development tooling.

### PT-20260904-27 — Earned-achievement holographic showcase

- Type: Reward presentation, Adventure Book UX, motion and accessibility
- Impact: P1 — high value
- Delivery: Routed
- Verification: Not retested
- Source intake:
  [`playtests/2026-09-04-achievement-showcase-and-sticker-book.md`](playtests/2026-09-04-achievement-showcase-and-sticker-book.md)
- Primary owner: Plan 01 for the Adventure Book interaction, presentation
  surface, focus and responsive layout
- Supporting owners: Plan 02 for the bounded holographic-shimmer recipe; Plan
  07B for decode/frame/memory qualification; Plan 08 for controller parity;
  Plan 13 for closure only if a bounded integration remainder survives
- Dependencies: Published high-resolution achievement renditions and stable
  achievement earned/locked truth from the approved art/catalogue contract
- Target gate: Plan 01 acceptance, with final visual/performance qualification
  in Plans 02 and 07B

**Human outcome.** Selecting an already-earned achievement lets the player
admire a large version of its lovely sticker in a dedicated celebration view.
The reward receives an authored rainbow holographic shimmer that complements
its existing foil/enamel materials and feels special rather than like a generic
CSS sheen.

**Acceptance slices.**

- An earned achievement is a semantic button and opens one modal/detail surface
  containing the correct presentation-scale catalogue rendition, achievement
  name and earned description. It never enlarges a small thumbnail through
  visibly soft browser scaling.
- A locked achievement cannot reveal the full sticker or hidden descriptive
  content. Selecting it retains the established locked-state explanation.
- The full-motion recipe uses a restrained moving rainbow/foil highlight that
  respects the sticker's authored shape and material masks; it must not wash out
  the illustration, text, contour or cream cutline.
- Reduced-motion receives a beautiful static/very-low-motion iridescent state,
  not a diminished blank card. Lite/static rendering tiers remain visually
  intentional on constrained devices.
- Pointer, touch, keyboard and controller can open, inspect and close the same
  surface. Focus is trapped and restored correctly; Back/Cancel closes it;
  gameplay actions cannot leak through.
- The large rendition loads on demand or through bounded contextual preparation.
  Opening and repeated browsing do not preload the whole reward catalogue,
  retain abandoned decoded images, create a frame-time cliff or require network
  access in the packaged app.
- Screen-reader output announces the earned achievement and description once;
  the shimmer itself adds no noisy live-region or redundant semantic content.

**Evidence.** Visual/browser checks cover earned and locked rewards, rapid
browsing, compact phone, iPad, desktop and TV layouts, reduced motion, keyboard
and controller focus, offline packaged delivery, and a measured worst-case
holographic effect cohort. Human/family review confirms that the presentation
feels rewarding and gives the artwork room to be enjoyed.

### PT-20260904-28 — Personal achievement sticker book

- Type: Optional cosmetic collection/customisation feature
- Impact: P2 — desirable future feature
- Delivery: Needs decision
- Verification: Not retested
- Source intake:
  [`playtests/2026-09-04-achievement-showcase-and-sticker-book.md`](playtests/2026-09-04-achievement-showcase-and-sticker-book.md)
- Primary route: Plan 14 opportunity review, followed by a separately approved
  feature plan if promoted
- Supporting owners if promoted: Plan 01 interaction language; Plan 08
  controller cursor; persistence/migration owner; Plans 07B/RC-01 qualification
- Dependencies: Accepted `PT-20260904-27`, stable achievement identities, and a
  Human-approved placement/persistence scope
- Target gate: explicit Human accept/defer/reject decision; not a hidden Plan-13
  mop-up task

**Human idea.** Offer an optional two-page sticker book where the player can
place, admire and rearrange earned achievement stickers. When a sticker is
earned, the game may ask whether the player would like to add it, then let them
choose its position by touch/pointer or an analogue-stick/controller cursor.

**Scope guardrails for a later specification.**

- The book is purely cosmetic. Sticker position, overlap and participation do
  not affect rewards, achievement truth, progression or campaign completion.
- Only earned stickers can be placed. The authoritative achievement record stays
  separate from layout state, so a corrupt/reset layout cannot revoke rewards.
- A promoted v1 must explicitly decide page count, placement bounds, overlap,
  ordering/layering, rotation/scaling (default recommendation: defer both),
  duplicate policy (default: one instance per earned achievement), undo/reset,
  save schema/migration and what happens when a catalogue rendition changes.
- Touch/pointer direct manipulation and controller cursor placement must express
  the same affordances and valid result. There is always a deterministic,
  accessible auto-place/default-placement route for players who do not want or
  cannot use free positioning.
- The post-award invitation is optional and non-blocking; declining it never
  loses the sticker, which remains available in the book's unplaced tray.
- Do not implement this inside Plan 01, Plan 11 or Plan 13 merely because those
  plans touch the Adventure Book or reward art. The persistent spatial editor is
  material feature scope and needs its own acceptance, migration, input and
  performance plan if Plan 14 recommends promotion.

### PT-20260904-29 — Living goal-portal spiral

- Type: World landmark, ambient VFX and goal presentation
- Impact: P1 — high-value visual polish
- Delivery: Routed
- Verification: Not retested
- Source intake:
  [`playtests/2026-09-04-living-goal-portal-spiral.md`](playtests/2026-09-04-living-goal-portal-spiral.md)
- Primary owner: Plan 02 goal/VFX family
- Supporting owners: Plan 03 catalogue/geometry authority if a separate aperture
  rendition is required; Plan 07B for continuous-effect and decoded-memory
  qualification; Plan 13 for bounded residual tuning only
- Dependencies: Published approved goal sprite and aperture geometry; Plan 02
  presentation director, quality tier and motion-mode contracts
- Target gate: Plan 02 acceptance and Plan 07B qualification

**Human outcome.** The beautiful spiral in the objective star should feel like
a living portal: it rotates slowly as though spiralling inward, softly glows and
breathes with the star, and may pull a few magical particles into its centre.

**Acceptance slices.**

- Preserve the approved static goal sprite, silhouette, aperture and gameplay
  semantics. Build the motion as a registered layer rather than regenerating or
  continuously transforming the complete star.
- First inspect the published `apertureBox` and source layers. Prefer a small
  separate authored feathered-alpha aperture only if it materially outperforms a
  code-native SVG/CSS mask; never crop a lossy runtime derivative and promote it
  as new source authority.
- The spiral turns in the visually inward direction at a calm ambient cadence.
  Its glow and scale breathing remain centred, do not make the star wobble or
  translate, and stay subordinate to items, actors and the committed goal-entry
  event.
- If particles are used, keep a small fixed pool. They follow short curved/
  tangential paths toward the centre, fade before convergence, remain clipped to
  the aperture/declared safe region, and create no collision or gameplay state.
- The overlay sits behind the star's front rim/contour and cannot spill as a
  square texture, obscure the central read, alias badly at small tiles, or imply
  that ordinary paired teleporters share the objective's behaviour.
- Full, lite and static recipes are explicit. Reduced motion disables continuous
  rotation, scale pulsing and particle travel while retaining a composed,
  luminous spiral; forced-colour/non-motion recognition still comes from the
  static goal silhouette and semantics.
- Pause/unmount/cancellation is deterministic when the goal leaves view, the
  level completes, a blocking presentation supersedes it, the route changes or
  the document is hidden. No timer, animation owner, particle node or decoded
  overlay is retained afterward.
- Plan 02's goal-entry choreography temporarily takes ownership: ambient motion
  resolves cleanly into the stronger entry/ring/release effect and does not
  double pulse, double announce or delay the gameplay-owned win commit.

**Evidence.** The effect rack and live mazes cover smallest/largest gameplay
scales, bright/dark terrain, camera movement, full/lite/static and reduced
motion, goal entry/cancellation, hidden/visible lifecycle and a continuous idle
stress cohort. Human/family review confirms that the centre reads as magical,
inviting and inward-moving rather than distracting, nauseating or like a hazard.

### PT-20260904-30 — Cast review and compact VN interludes

- Type: Narrative design, story UX and accessibility
- Impact: P1 — high value
- Delivery: Routed
- Verification: Not retested
- Primary owners: Plan 09 for canon, script and campaign integration; Plan 01
  for the reusable accessible presentation shell
- Supporting owner: Plan 11 consumes the final cast and chapter canon
- Dependencies: Final gameplay arc, Art Bible/model sheets, semantic input/focus
  contracts, current story migration/replay behavior
- Target gate: Plan 09 acceptance, with Plan 11 using the accepted cast

**Human outcome.** Review the current cast deliberately and decide who should be
retained, refined, replaced, or joined by new story characters. Replace or
extend one-way story cards with warm VN-style exchanges when that materially
improves character and world: ordinarily two or three short turns, often
including Ame, with no long exposition.

**Acceptance slices.**

- Produce a cast disposition and role/voice matrix before rewriting chapters.
  Preserve approved identities unless a documented narrative problem earns a
  change; new characters need a distinct function rather than roster size alone.
- Define typed speaker, portrait/expression, line, advance, skip, replay and
  completion semantics. Dialogue progress is not campaign progress and cannot
  strand or corrupt an active maze.
- A typical interlude is two or three dialogue turns. Longer exceptions require
  a named story reason and Human approval; no required reading quiz gates play.
- Tap/click/confirm advances one turn; an obvious Skip action exits the whole
  interlude after at most a few inputs. Keyboard, touch, pointer and controller
  remain equivalent, with no movement leaking beneath the story layer.
- Text remains available independent of portraits, animation or future audio;
  screen readers announce each line once, and reduced/static presentation keeps
  every meaning.
- First-time, replay, Continue, reset, completion and rapid-skip paths are tested.
  Story remains replayable from an appropriate surface without duplicating
  rewards or altering maze state.

### PT-20260904-31 — AI-generated voice-acting exploration

- Type: Audio/narrative opportunity; potential release and rights epic
- Impact: Epic — Human decision required
- Delivery: Needs decision
- Verification: Not retested
- Primary owner: Plan 14 planning-only opportunity review
- Dependencies: Accepted cast, final dialogue/tutorial scripts, subtitle and
  audio-context architecture, rights/consent policy, package/performance evidence
- Target gate: explicit Human-approved follow-on plan or documented defer

**Human outcome.** Later explore whether generated character voices would make
the compact story exchanges and selected tutorial moments warmer and more
accessible.

**Decision study requirements.** Compare at least a text-only baseline, sparse
character vocal reactions, and fully voiced short lines. Evaluate family appeal,
clarity, pronunciation, consistency, child safety, performer/voice-likeness
consent, commercial rights, disclosure, subtitles/transcripts, dialogue/BGM/SFX
mixing, mute and independent volume behavior, offline/Tauri/web delivery,
download size, caching and failure fallback. Do not generate final voices,
publish media, or bind save data during the study. Only an explicit Human choice
may authorize a separately scoped implementation.

## 6. Programme integration and gates

The existing programme remains sequential. These are execution-prompt addenda,
not permission for simultaneous implementation in the shared worktree.

1. **Current Plan 03:** do not interrupt its active art implementation. Its final
   Art Bible, Ame model sheet and catalog may naturally supply typography,
   material and expression tokens. It may produce the chest/Mimic/reward static
   family already inside its approved art scope for `22`, but must not implement
   the Mimic game rule or loot choreography; `18` must not otherwise expand its
   in-flight scope. Before completion, publish `24`'s content-integration
   manifest: stable final enemy/friend/theme IDs, proposed content roles,
   lifecycle, intended downstream owner and loading intent. Plan 03 does not
   place content or decide final campaign/generated eligibility; Plan 09 owns
   that typed registry.
   It may also complete the Human-requested initial title illustration, home
   splash and logo under `26`, plus presentation renditions required by `25`,
   provided each asset passes the same individual approval, provenance,
   derivative, catalogue, byte and runtime-publication gates as the rest of its
   slate. This does not cancel Plan 11's final-canon review.
2. **Root checkpoint 03M before Plan 01:** restore a green runtime against the
   delivered OST, freeze the canonical `MusicTransportPort` and current/fake
   adapter, and prove no deleted media URL remains. At the same bounded
   checkpoint, settle `PT-20260902-10` pending-win/reward/save/Stay-location,
   land `PT-20260902-02`'s stationary door transition contract, and freeze
   `22`'s typed committed-reward outcome, deterministic reveal identity, exact
   balance tables and exactly-once ownership. UI/VFX and runtime Mimic placement
   remain with their scheduled owners.
3. **Plan 01:** implement `01`, `09`, the UI half of `10`, the minimap half of
   `16`, the larger portrait/reaction gutter for `18`, the typed screen/overlay
   music-context seam for `20`, the single compact Sound disclosure for `23`,
   the earned-achievement detail/showcase interaction for `27`, and layout/
   transform/control seams for `05`, `07` and `08`. Do not absorb `28`'s
   persistent free-placement sticker book into this layout overhaul.
   Make `25` an explicit visual-quality tranche rather than deferring the
   authored surface/type/presentation-art system as post-layout polish. Integrate
   the approved `26` front door, and establish `30`'s reusable multi-turn story
   shell/advance/skip/focus semantics without rewriting chapter dialogue. After
   acceptance, the root manager evaluates
   and normally produces Family Preview 1.
4. **Plan 04:** consume `15` and provide `24`'s bounded multi-region terrain-
   theme/rendering seam without changing gameplay topology. Do not invent ice/
   spike visuals while `14` is undecided.
5. **Plan 02:** implement the presentation halves of `01`, `02`, `03`, `05`,
   `13`, `15` and the portrait-first reaction system in `18`, consuming—not
   redefining—the engine, art, UI and lighting contracts. Preserve an explicit
   SFX/BGM mixing and cancellation seam for `20`; do not take ownership of BGM
   navigation policy. Implement `22`'s bounded reusable reward burst, trails,
   homing, count feedback, chest/reveal choreography and SFX as presentation of
   an already-committed typed outcome; never own its 65/35 or economy rules.
   Implement `29` as the ambient member of the existing goal family, with the
   stronger committed goal-entry recipe taking ownership on completion.
6. **Plan 08:** implement `08`, controller parity for `10`, the controlled held-
   input continuation approved for `02`, and the honest browser/controller audio-
   activation route required by `20`. Add semantic, controller-complete
   navigation for every `23` Sound action and prevent movement leaking through
   its open surface.
7. **Plan 05:** provide animation assets/recipes needed by the accepted `01`,
   `03`, `11` and `15` outcomes. It may add field-sprite parity for `18` only
   after portrait-first v1 is stable. It may add the bounded chest/Mimic reveal
   frames for `22` after static art and presentation timing freeze. Ice spin
   remains conditional on `14`.
8. **Plan 07B:** replace or extend the 03M current adapter behind the unchanged
    `MusicTransportPort` with `20`'s full contextual controller, including `23`'s
    history, Previous/Next/Shuffle transport, rapid-command handling and any
    subsequently approved Loop policy; then make `07` a non-negotiable measured
    play-feel outcome and qualify music plus the
   continuous/stacked effects and assets from `01`, `05`, `15`, `18`, and `22`.
   Reserve and qualify `24`'s final roster/theme loading and decoded/package
   costs without eagerly loading the complete catalogue at title.
   Rebaseline the final UI material recipes, presentation renditions and early
   front-door assets from `25`/`26`; maintain the preview-artifact manifest/hash
   convention without converting internal previews into release claims.
9. **Plan 09:** revise its plan before execution for `04`, `06`, `11`, `12`,
   `16`, `17`, `22`, `24` and the guided teaching lifecycle in `19`; this
   includes changing planning-era map-size, order and onboarding assumptions.
   Implement and place the deterministic Mimic/reward/drop gameplay from `22`,
   consuming the earlier presentation contract. Make `24` a named bounded phase:
   authored introduction/placement, fixed per-level/region themes, exact
   campaign-use evidence, and deterministic generated single/subset/mixed
   variety. Consume the `maze` music pool/context without binding chapters to
   filenames. Implement `30` only after a documented cast/canon review: keep
   interludes normally to two or three turns, preserve fast skip/replay, and
   update the 24-chapter story arc before Plan 11 consumes it.
10. **Plan 10:** add the Friend Garden completion destination from `10`, wire the
     `garden` music context from `20`, and ensure future traversal rules cannot be
     bypassed by co-op. Extend `22` only with exactly-once shared reward ownership
     and the correct visual homing recipient; do not create duplicate drops.
     Consume `24`'s final versioned roster/ecology: ordinary Duo preserves every
     authored encounter/friend/theme assignment, and every final friend is
     Garden-eligible only after its authored Solo rescue. Recalculate full-roster
     Egg completion cadence before migration.
11. **Plan 11 — Final Key Art, Branding & Front-Door Presentation:** execute
     `docs/plans/11-final-key-art-branding-front-door-presentation-plan.md` and consume the
     final character catalog and accepted 24-chapter/Friend Garden canon. Use a
     curated representative final cast and world selection, not an every-asset
     completeness sheet. It must not invent gameplay or lore that contradicts
     `17`, `24`, or the accepted cast/canon from `30`. Audit Plan 03's early `26`
     front-door set first and retain it
     when it still represents the final game; create only missing variants or
     bounded replacements justified by the final cast/canon.
12. **Plan 13 — Backlog Closure & Release Polish:** filter the ledger after Plan
     11; implement compatible bounded leftovers and leave true epics as separately
     approved work. `22` may contribute only residual tuning or polish here, not
     a late unreviewed reward/economy system. Close `24` from exact coverage
     evidence; return a missing mandatory content tranche to Plan 09 or an
     explicit Human defer gate rather than cramming it into polish. Declare when
     no further pointer-producing work remains.
13. **Plan 12 — Final Asset Retirement & Package Hygiene:** only after that Plan
     13 declaration, rerun the authoritative asset/package inventory. Close `21`
     through the two-stage non-runtime archive → Human external-backup
     confirmation → separately authorized repository-removal workflow. Preserve
     source authority and sole copies and do not fold new visual design into
     cleanup. An approved `24` gameplay asset missing its promised consumer is an
     integration defect or explicit Human deferral, never an orphan by default.
14. **RC-01 — Root integrated qualification:** build from the clean reviewed
     post-Plan-12 checkpoint and rerun the final solver, migration, content,
     viewport, controller, accessibility, audio, performance, Tauri/offline and
     package matrix before any release-candidate claim.
15. **Plan 14 opportunity review:** include `28` as an explicit cosmetic-
    expression opportunity and compare it against the already-shipped `27`
    showcase. Include `31` as a separate voice-acting feasibility/options study
    after scripts and cast are stable. Promotion of either requires a separate
    Human-approved feature plan; a
    planning decision changes no runtime or save data.

### Decisions that must not be deferred into a specialist's implementation

- `PT-20260902-02`: stationary door transition and held continuation semantics.
- `PT-20260902-10`: pending completion, save/reward boundary and Stay position.
- `PT-20260902-12`: revised Plan 09 scale/variety guardrails.
- `PT-20260902-14`: promote/resequence as a dedicated epic or defer it whole.
- `PT-20260902-19`: default to the hybrid teaching-pocket model inside the fixed
  24 chapters; any extra chapters or separate tutorial campaign need Human
  approval.
- `PT-20260903-20`: the delivered physical and logical folder slug is
  `adventure-book`; preserve it and do not derive IDs or ordering from filenames
  or embedded titles.
- `PT-20260903-21`: a sole-copy archival policy and rollback-window expiry must
  be decided from evidence before archive handoff; no repository removal occurs
  until the Human confirms external backup. An old-looking filename is never
  sufficient authority.
- `PT-20260903-22`: freeze Gold/Science ranges, enemy/rescue drop tables,
  deterministic run/object reveal semantics and exactly-once save behaviour
  before presentation or content owners implement against it.
- `PT-20260903-23`: decide whether Loop ships and, if so, whether its state is
  session-only or persisted. Previous/Next/Shuffle and the single compact Sound
  disclosure are already approved requirements.
- `PT-20260903-24`: final `campaignEligible`/`generatedEligible` roster
  membership, any deliberate campaign/generator exclusion, and the disposition
  of a literal all-enemy showcase must be explicit before Plan 09 freezes its 24
  content packets.
- `PT-20260903-25`: the exact surface/type recipe may be refined through
  implementation canaries, but “generic clean web UI” is not an acceptable
  fallback definition of done. Any font-licence or literal-blur cost issue is
  solved through another Maze-native recipe, not by dropping art direction.
- `PT-20260903-26`: the manager decides whether each named preview opportunity
  is green and worthwhile. Plan 11 must review rather than reflexively replace
  the early title/logo/splash set.
- `PT-20260904-28`: decide after the integrated product whether a persistent
  two-page free-placement sticker book earns its input, accessibility, save and
  migration complexity. Until then it is not Plan-01/11/13 implementation scope.

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
| 2026-09-03 | 20 | working tree at `ab20f28372c93e341b13e3cf2d2c94ea71703bb2` | Read-only filesystem, frame and SHA-256 audit; focused Vitest | 42 candidate original MP3s / 99,151,313 B / about 68m25s across all six pools; no exact duplicates; current source still targets 14 deleted placeholders; focused music suite 16/17 | Delivery dependency met; integration/qualification remain Routed |
| 2026-09-03 | 21 | working tree at `ab20f28372c93e341b13e3cf2d2c94ea71703bb2` | Human request plus read-only art-manifest/plan audit | 16 superseded and 4 deprecated runtime-image records; active cages use v5; sole-copy and validator-lifecycle risks identified | Captured, triaged and routed |
| 2026-09-03 | 22 | working tree at `ab20f28372c93e341b13e3cf2d2c94ea71703bb2` | Human feature request plus read-only gameplay/presentation audit | Existing fixed treasure event/flight and visible Candy Mimic do not implement disguised reveal, deterministic weighted outcome or enemy/rescue drops | Captured, triaged and routed |
| 2026-09-03 | 23 | working tree at `ab20f28372c93e341b13e3cf2d2c94ea71703bb2` | Human feature request plus music/UI ownership audit | Contextual transport belongs to the shared music controller; one compact Sound disclosure avoids permanent HUD-button growth | Captured, triaged and routed; Loop needs decision |
| 2026-09-03 | 24 | working tree after Plan-03 source production | Human feature request plus read-only campaign/generator/catalogue/Garden/lifecycle audit | Generic full-library intent exists, but no exact final-roster campaign coverage, introduction curve, generated encounter-profile variety or multi-region terrain contract exists | Captured, triaged and routed |
| 2026-09-03 | 25 | working tree during Plan-03 source production | Human UI-art-direction clarification plus repository Art/UI/performance synthesis | Art Bible contains useful surface/type/optical principles, but Plan 01 did not yet make authored game-interface finish or large contextual presentation art an acceptance gate | Captured, triaged and routed |
| 2026-09-03 | 26 | working tree during Plan-03 source production | Human delivery request plus roadmap/release audit | Front-door art was scheduled late and no low-rework family-preview milestone policy existed | Captured, triaged and routed |
| 2026-09-04 | 27–28 | working tree after Plan-03 static publication | Direct Human feature request plus manager scope/routing review | Earned stickers need an admiration-scale reward moment; free placement adds meaningful persistence and input scope beyond a viewer | 27 captured/triaged/routed; 28 captured and held at Human decision |
| 2026-09-04 | 29 | working tree during Plan-03-R1 publication | Direct Human feature request plus goal-art/VFX ownership audit | Published goal geometry already exposes a central aperture; the visual can be layered without changing gameplay or regenerating the complete star | Captured, triaged and routed |
| 2026-09-04 | 30–31 | v0.20.1 corrective checkpoint | Direct Human feature request plus narrative/audio ownership review | Current story is a sequence of single-speaker cards; cast review and compact dialogue belong before final-canon art, while generated voice requires a separate rights/accessibility/value decision | 30 captured/triaged/routed; 31 captured and held at Human decision |

## 8. Closure and mop-up rule

At each specialist acceptance checkpoint, update only the cards genuinely touched
by that change and attach exact evidence. After Plan 11, filter the ledger and
execute bounded Plan 13 closure. Once Plan 13 records that no pointer-producing
work remains, perform Plan 12's archive-first package-hygiene sweep, then the
root `RC-01` qualification.

Provisional filenames:

`docs/plans/13-playtest-backlog-closure-and-release-polish.md`

`docs/plans/12-asset-retirement-and-package-hygiene.md`

If the spikes/ice epic (`PT-20260902-14`) is promoted, it receives its own feature
plan and later plan numbers move to the next unused slots. A large mechanics or
generator rewrite must not be disguised as a polish mop-up. A missing mandatory
`PT-20260903-24` campaign/generated-content tranche returns to Plan 09 or an
explicit Human defer gate; it cannot be reclassified as cleanup or quietly
closed by retiring the unconsumed asset. The final OST has now arrived before
Plan 07B/10. Root checkpoint 03M owns its bounded catalogue cutover, valid
current adapter and canonical transport port; Plan 07B owns full contextual
continuity, preparation/crossfade, mastering, performance, listening and
platform qualification. Placeholders can never be waved through as a
documentation-only leftover.
The same closure sweep must account for `PT-20260903-25` as a Plan-01 quality
gate and `PT-20260903-26` as explicit produced-or-skipped preview evidence; it
must not defer either merely because functional controls and release packaging
already work.
It must also verify that `PT-20260904-27` shipped or was explicitly returned to
its owning plan. `PT-20260904-28` is not a mop-up obligation: it remains a
Plan-14 decision unless the Human promotes it through a separately scoped plan.
`PT-20260904-29` belongs to Plan 02's goal family and Plan 07B's continuous-
effect qualification; Plan 13 may tune a landed bounded recipe but must not
invent a replacement goal renderer late in closure.
`PT-20260904-30` belongs to Plan 09's canon/campaign tranche after Plan 01 lands
the reusable shell; Plan 11 consumes its accepted cast. `PT-20260904-31` is not
implementation scope for Plan 13 and remains a Plan-14 decision until the Human
approves a separate voice plan.
