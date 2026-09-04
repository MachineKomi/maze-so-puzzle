# Integrated implementation roadmap through final convergence

Status: manager-reviewed execution authority

Prepared: 2026-09-02

Planning baseline: `5eed837` (`Add expert implementation research plans`)

Current programme shape: a measurement-only performance pre-pass; sequential
feature execution through the 24-maze campaign and couch co-op/Friend Garden;
final key art; backlog closure and release polish; an archive-first asset-
retirement/package-hygiene sweep after all pointer-producing work; root release-
candidate convergence; a final product-opportunity/specification review; then a
root-authored transferable process playbook

## 1. Outcome

This roadmap turns the specialist plans and later Human-directed feature work
into one programme. It resolves overlapping ownership, records the Human
decisions that supersede earlier recommendations, and defines the order in which
agents may change shared code.

The untouched research plans were committed and pushed before integration. Their evidence and detailed phase work remain valuable. Each plan now receives a manager addendum; that addendum and this roadmap override a conflicting statement in the original body.

## 2. Read-before-work authority order

Every execution agent must begin by reading the current versions of:

1. `docs/GAME_VISION_AND_DESIGN_SPEC.md` — desired product behaviour and Human decisions.
2. This integrated roadmap — sequence, ownership, and cross-plan contracts.
3. Its own complete specialist plan, including the manager addendum.
4. Every predecessor specification named by its execution gate.
5. `README.md`, `docs/ARCHITECTURE.md`, `docs/STORY_BIBLE.md`, `docs/AI_ASSET_PROMPTS.md`, `docs/PROJECT_AUDIT.md`, and `docs/RELEASE_CHECKLIST.md` where relevant.
6. Current source, tests, manifests, configuration, and working-tree state.

For desired behaviour, the game-vision document wins. For current behaviour, executable source/tests win over old prose. The plan's recorded line numbers and baseline commit are audit coordinates, not instructions to overwrite code that has since moved.

## 3. Operating rules for sequential execution

- Only one implementation agent runs at a time.
- Before each agent starts, the manager reviews the preceding diff, resolves failures, commits a named checkpoint, pushes it, and gives the next agent a clean current `HEAD`.
- An execution agent must not reset, discard, or overwrite predecessor work. It must adapt the plan to current symbols and reuse contracts already landed.
- An execution agent should work through bounded phases and keep rollback seams until its full acceptance matrix passes.
- At completion, the agent leaves a reviewable working tree and reports changed files, tests, manual evidence, deferred hardware/human gates, and any divergence from plan. It does not push or publish a release unless its prompt explicitly changes this rule.
- A document is updated in the same change that makes its claim true. Targets stay labelled as targets; unverified physical-device rows stay unverified.
- Each manager checkpoint preserves enough durable evidence of prompts,
  specialist ownership, skills/tools used, Human decisions, rejected approaches,
  corrections, validation, and handoff outcomes for the final methodology
  retrospective. Do not preserve credentials, private reasoning traces, or
  unsupported reconstructions merely to make that retrospective appear complete.
- Plan 03 had a Human/Ame identity gate. On 2026-09-03, after reviewing the
  comparison, actual-size and model-study proofs, the Human approved the
  recommendation; the manager-normalized outcome is **Candidate C is the
  canonical static Ame v02 design direction.** This
  releases the same art task to continue Plan 03; it does not itself accept the
  runtime sprite or the remaining art families.
- Plan 03's source/catalogue contracts, Art Bible, reproducible pipeline and
  Human-reviewed `mgjrpg-02` production grammar are established. Candidate C
  remains Ame's identity/construction authority; the Human selected the clearer
  B-led 01 small-scale rendering direction and is reviewing the remaining
  production-source batches by approval-by-default and rejection-by-exception.
  The v08 perimeter-retrofit packet remains rejected process evidence; authored-
  from-scratch chromatic local contours, chunky massing and restrained painterly
  shading are the binding craft direction. Paired teleporters retain their
  distinct top-down flower-petal floor-pad category rather than becoming upright
  portal doors.
- The Human explicitly directed `storybook-local-contour-v1` to adopt
  colour-aware local contours: each stable contour section derives from the
  nearest enclosed Maze material, darkens/richens through Maze's deep-plum
  family, and reserves darkest ink for critical detail/contrast. This adopts
  PPBA rendering craft only; no PPBA pixel, prompt, character, palette, motif,
  layout, brand, or trade dress may enter Maze. Terrain/hazards use related
  material boundaries and seams without character-like enclosing outlines, and
  cream cutlines remain exclusive to semantic UI/reward signals. The contour
  grammar must be authored into new interior massing, values, and material
  painting with visibly lighter chromatic edges; post-stroking old pixels does
  not satisfy Plan 03.
- Current programme stop: Plan 03 is still active source production/review, not
  an accepted runtime checkpoint. Source-batch commits do not release Plan 01.
  After the Human closes the remaining candidate exceptions, Plan 03 must create
  clean transparent/registered/right-sized runtime derivatives, atomically
  publish approved catalogue pointers, prove the refreshed art in the actual
  game at delivery sizes, reconcile provenance/model/family/lifecycle records,
  complete the integration manifest below, run the full art/build/desktop/
  performance/visual gates, and commit and push the reviewed checkpoint. Final
  asset retirement remains Plan 12 work rather than a bulk Plan-03 deletion.
- The Human has queued an initial Maze-native title illustration, home-screen
  splash and game logo inside the remaining Plan-03 art work so the next useful
  family preview can have a coherent front door. After individual approval,
  these follow the same clean-derivative, responsive safe-zone, catalogue,
  provenance, budget, runtime-proof and rollback gates as every other Plan-03
  family. Plan 11 becomes a final-canon audit/refinement gate and must retain
  good early work rather than regenerating it by default.
- Plan 03 does not release Plan 01 until its final approved production slate is
  accompanied by a versioned content-integration manifest. For every approved
  asset, that manifest records the stable semantic ID, lifecycle state,
  proposed content role, intended Plan owner/consumer, loading intent, and any
  explicit Human deferral. Source studies, proofs, rejected alternatives and
  presentation-only art must be distinguishable from candidate gameplay art.
  Plan 09—not the art lifecycle—freezes final campaign/generated eligibility in
  the separate typed gameplay-content registry.
- No agent adds one of the eight Plan-09 campaign mazes early.
- No plan may introduce analytics, paid infrastructure, monetization, remote asset dependence, or a copied franchise design.

## 4. Final execution order

| Order | Plan / owner | Why it runs here | Required output gate for the next owner |
|---:|---|---|---|
| 1 | **07A — Performance Phase 0 only** | Runs before tracked implementation changes so the programme has an uncontaminated, reproducible before-state. It adds the shared browser/performance harness, asset/bundle inventory, reporting, scenario fixtures, and provisional non-regressive gates. It performs no product optimization and removes no media. | Clean baseline manifest/reports, one shared browser harness, named semantic scenarios, current asset/package inventory, historical 0.19.0 baseline, and a feature-allocation ledger ready for later owners. |
| 2 | **06 — Game design, gameplay UX, mechanics** | Establishes stable content identity, revisions/migrations, engine-consistent reachability, required-versus-optional semantics, progression metrics, scalable campaign contracts, and the revised 16-maze rule/content baseline. Presentation owners should not infer these from old `App.tsx` conditions. | Gameplay spec, stable semantic events/view models, campaign-length-safe foundations, solver and migration evidence, revised story/design authority. |
| 3 | **03 — Art direction and graphic design** | Consumes the gameplay semantics and freezes the static visual identity before layout, lighting, effects, or animation depend on it. This is where blonde/blue-eyed Ame and the approved hair silhouette become canonical, and where the first approved title/logo/home-splash set can be readied for an early family preview. | Art Bible, PPBA-informed adopt/adapt/reject record, explicitly Human/Ame-approved model sheet and canonical static Ame sprite, Human-reviewed rendering-recipe/canary decision, asset/catalogue/source contract, final static art/tokens including required presentation renditions and approved early front-door art, actual-size proofs, provenance/byte evidence, and a versioned content-integration manifest assigning every approved final asset a semantic ID, lifecycle, proposed content role, intended consumer/owner and loading intent. Plan 09 separately decides final gameplay eligibility. A pending rendering canary, identity study or unclassified approved asset does not release Plan 01. |
| 4 | **03M — Root compatibility and gameplay-contract checkpoint** | The delivered 42-track OST has replaced the old files before the final contextual controller exists, and several presentation-critical gameplay decisions need one authoritative seam before UI/VFX/controls consume them. | A bounded current-player catalogue cutover to real delivered files with no missing URL; canonical `MusicTransportPort` semantics and current adapter; maintained completion-choice, stationary-door, and committed Mimic/reward/drop contracts plus focused tests; full checks green; root-reviewed commit pushed. This is compatibility/contract work, not the Plan-07B contextual mix. |
| 5 | **01 — UI/UX and layout** | Can now build around real gameplay priorities and final asset safe bounds. It establishes the stable cross-device shell, large minimap, DialogShell, focusable markup, compact Sound disclosure, CSS layer manifest, motion preference, measured UI/VFX anchors, and the authored Maze-native surface/type/presentation-art system. | UI/UX spec, primary-device topology, all-content geometry tests, stable semantic IDs/anchors, styled component/state proof, licensed typography and full/lite/static surface recipes, large contextual-art slots/fallbacks, integrated early front door, dialog/focus surfaces including one accessible Sound menu, and extensions to the shared browser harness. Its accepted checkpoint is the preferred Family Preview 1 gate. |
| 6 | **04 — Lighting and wall depth** | Uses final art materials and the final MazeViewport/scene slots. It creates the single terrain topology/render-model seam, coherent light resolver, wall layers, grounding wrappers, and bounded presentation-only multi-theme region support before effects attach to them. | Lighting spec, resolved-light API, cached topology/render model, validated one-to-four-region terrain-theme seam over one gameplay topology, world masks/layer tokens, dedicated contact/cast/sparkle surfaces, tier evidence. |
| 7 | **02 — Graphics and VFX** | Consumes final art tokens/assets, terrain/light layers, UI anchors, and gameplay events. It owns the shared presentation director, cancellation, semantic effect grammar, hazard motion, varied flourishes, and the reusable bounded reward-shower presentation from `PT-20260903-22`. | VFX Bible, presentation-director contract, anchor/timing/cancellation APIs, effect variants, deterministic visual-only reward burst/homing recipes, reduced/static recipes, sound/lifecycle evidence. |
| 8 | **08 — Controls, Xbox controller, Steam Deck** | Uses the actual UI focus topology, final presentation-lock contract, and root-frozen music transport port. It normalizes all input sources, implements controller navigation/gameplay—including every compact Sound action—and proves no stale input crosses an effect or overlay. | Controls/Steam Deck spec, shared input policy/action dispatcher, gamepad implementation, controller prompts/focus/scrolling, semantic music-transport conformance against the current/fake adapter, deterministic tests and honest hardware checklist. |
| 9 | **05 — Limited sprite animation** | Runs only after final static character art, grounding wrappers, VFX timelines, UI sizes, motion provider, and controller lock semantics exist. It adds purposeful frames—including an approved bounded chest/Mimic reveal where it fits the tranche—without becoming another identity or timing system. | Animation spec, bounded first frame tranche, typed manifest/renderer, atomic fallback/decode behaviour, on-model actual-size and integration evidence. |
| 10 | **07B — Performance Phases 1–7** | The original performance agent returns to re-baseline and optimize the combined product against 07A. It implements the full contextual BGM controller behind the frozen transport port and owns final pre-campaign budgets, media decisions, delivery caching, Tauri/Steam Deck profiles, package provenance, and release evidence. It reads Plan 09 before retirement-candidate classification and forecasts its approved roster/theme reservations without title-time full-catalogue preload; Plan 12 alone performs final retirement. | Reproducible before/after reports, qualified contextual Previous/Next/Shuffle history and transitions, optimized pre-campaign web/Tauri build, package provenance, regression gates, a time-bounded Plan-09 content/asset reservation ledger and 24-level/generated forecast, updated release evidence, and no unexplained quality loss. |
| 11 | **09 — 24-maze campaign expansion and deterministic content ecology (root)** | Audits the fully integrated systems, remediates inherited size/route/teaching regressions, and builds eight levels against their final contracts: four inserted into the journey and four after the former finale. It owns the final progressive enemy/friend placement, authored terrain regions, three-or-more versioned generated topology families, bounded single/subset/mixed cast variety and exact content-use evidence from `PT-20260903-24`. It also owns deterministic Mimic/reward/drop gameplay from `PT-20260903-22`, consuming rather than redefining earlier presentation. | Twenty-four solver-verified story mazes under the maximum-four large-level cap; repaired Rainbow Power Parade and first-use teaching; rewarded terminal branches; purposeful campaign use of every final gameplay-eligible enemy identity and friend species; fixed authored themes/regions; versioned generated topology/content variety and coverage; deterministic save-safe Mimic encounters/rewards; migrations; updated story/design docs; playtest/metric evidence; final integration checks. |
| 12 | **10 — Couch co-op and Friend Garden** | Runs after the campaign is stable so co-op routes, Courier behaviour, Garden progression and persistence target the final 24-maze identities and versioned content ecology rather than a moving campaign/roster. | Accepted greybox/family gate using a disposable isolated profile, optional two-player implementation, authored-placement-preserving ordinary Duo, solo-compatible exact-final-roster Friend Garden with Human-approved Egg cadence, co-op routes, two-seat controls, migrations, solver/performance evidence and updated shared canon. |
| 13 | **11 — Final key art, branding and front-door presentation** (`docs/plans/11-final-key-art-branding-front-door-presentation-plan.md`) | Audits Plan 03's early title/logo/home-splash set against the final Ame, Ponchi, Melty, alternative-player, friend, campaign and Garden canon. It retains good work by default and adds or replaces only what the final product actually needs, using a curated representative cast rather than an every-asset completeness sheet. | Originality-reviewed retained/refined/replaced front-door decision; any justified missing or replacement title/logo/splash assets in the frozen Maze-native grammar; optical/platform variants, source records, actual-size/device proofs and integrated rollback. |
| 14 | **13 — Playtest-backlog closure and release polish** | Re-audits every unresolved playtest card after all planned feature consumers are integrated. It handles only compatible bounded leftovers; a new mechanic remains a separately approved epic, and a missing mandatory content tranche returns to Plan 09 or a Human defer gate rather than being crammed into polish. It runs before retirement because it may still change a pointer or consumer. | Every backlog item is Accepted, intentionally Deferred, Superseded or explicitly declined; final catalogue-consumer coverage and family/device evidence are honest and reproducible; no undeclared follow-on pointer work remains. |
| 15 | **12 — Final asset-retirement and package-hygiene sweep** | Runs after Plan 13 and every other pointer-producing change. It consolidates Plan 03 classification with Plan 07 reachability/package evidence and treats an approved asset missing its promised consumer as an integration defect or explicit Human deferral—not an orphan. | Versioned lifecycle/tombstone and consumer-coverage records; a hash-verified non-runtime local handoff archive; explicit Human external-backup confirmation before any repository-removal commit; clean-clone browser/Tauri/package and restore evidence. |
| 16 | **RC-01 — Root integrated release-candidate qualification** | Requalifies the actual post-campaign, post-co-op, post-brand, post-mop-up and post-retirement product; Plan 07B forecasts cannot certify code/media added later. | Clean-checkout full solver, migration, content, controller, accessibility, audio, performance, web/Tauri, offline/package and smoke matrix; generated manifest/checksums; Human/family evidence and honest pending hardware gates. |
| 17 | **14 — Final gameplay, progression and quality-of-life opportunity review (root + Human)** | Runs against the integrated release candidate as a planning-only part of the Human's specification-finalization workflow. It deliberately reopens the question “what would make this simpler, more satisfying or more fun?” without silently reopening implementation scope or deferring mandatory `PT-20260903-24` integration. Persistent progression—including a player level/XP and upgradeable convenience abilities such as sprinting or limited wall hopping—is a leading hypothesis, not approved design. | One evidence-backed `docs/plans/14-gameplay-progression-and-qol-opportunity-review.md` containing a broad opportunity map, at least seven materially distinct approaches, risks and cheapest experiments, a small recommended shortlist, explicit retain/remove/streamline ideas, and a Human accept/defer/reject gate. No runtime change. |
| 18 | **15 — Reusable agentic game-development playbook (root)** | Runs last so it can learn from the complete project—including the final opportunity review, failed experiments, Human gates, specialist handoffs, release evidence, corrections, and asset-to-consumer traceability—without prematurely turning an in-flight habit into generic advice. It is knowledge capture, not another product-feature phase. | One self-contained `docs/REUSABLE_AGENTIC_GAME_DEV_PLAYBOOK.md` that separates portable practice from Maze-specific decisions, traces material lessons to evidence—including approval → semantic ID → consumer → loading → acceptance evidence → lifecycle—and provides copy-ready workflows, prompt patterns, checklists, and failure-avoidance guidance for other game repositories. |

This order is a dependency graph, not a ranking of importance.

## 5. Manager-resolved plan decisions

### 5.1 Cross-device composition

Plan 01's accessible real-CSS-pixel shell is adopted; a return to blindly scaling the broken HUD is not. Its five visibly different layout regimes are narrowed:

- TV, desktop, 960×540 Tauri, and iPad/tablet use one canonical landscape topology: square maze at left and one persistent information/control deck at right, with the same section/action order.
- Track sizes may respond to available pixels, but primary-device controls do not jump between a special command rail and the deck and ordinary utilities do not disappear into `More`.
- One compact-phone variant may reduce chrome, wrap cells, and use `More`, while preserving every essential action and the same logical order.
- Big Maze uses the same two-region relationship with a larger board and purposeful focus deck. It never leaves a hidden sidebar track or off-panel minimap.

Plan 01 must remeasure its geometry rather than apply its original table mechanically.

### 5.2 Large minimap and complete Bag

The minimap is sized as the largest feasible square after the full objective and complete current-state indicators are guaranteed, not capped merely because an old card was narrow.

Starting design targets, to be validated by the UI agent, are:

- at least 192 CSS px at 1280×720 and ordinary TV layouts, with larger use where the deck permits;
- 160–176 CSS px at 960×540 and normal iPad/tablet layouts;
- 120–144 CSS px on ordinary landscape phones; and
- 96 CSS px only at the 568×320 emergency floor.

No unexplained band may surround it. All current one-to-seven Bag slots remain simultaneously visible and contained, a synthetic larger typed equipment registry must reflow without loss, and all one-to-five per-maze friend states remain visible. These are current display envelopes rather than final catalogue-size assumptions. The original Plan-01 160px-wide ceiling and inconsistent 152px container are superseded.

### 5.3 Ame and the static-art model

The historical bob was not immutable. Candidate C now settles a restrained
shoulder-brushing, softly layered hairstyle while preserving recognition.
Blonde hair and blue irises are absolute across every representation. The field
sprite's current teal/green eye reading is not a colour target.

The approved model sheet records front/side/back silhouette, face/eye landmarks, golden-blonde and blue-eye swatches, expression rules, costume anchors, body registration, safe zones, and actual-size proofs. No Ame animation frame or broad family generation proceeds from a historical runtime bitmap alone.

The refined style prioritizes clean anime faces, two to four large colour masses,
broad cel-like three-value groups, strong chunky silhouettes, one clear focal
hierarchy, plum-rooted local-material contours, and restrained painterly texture.
Reduce motif soup, filigree, jewels, generic gloss, and micro-detail before
removing personality. The related PPBA specification calibrates craft/process;
it does not contribute Maze characters, palette, motifs, pixels, prompts, UI
skin, or fictional identity.

Colour-aware does not mean multicoloured noise: outline hue follows the nearest
stable interior material (golden/warm plum, aubergine, blue-plum, russet-plum,
leaf-plum, or pale-material mauve), changes only at meaningful joints, and stays
continuous and high-contrast at delivered size. `ink-900` is for eyes, mouths,
deep occlusion, critical separation, and genuine accessibility need—not a
default perimeter.

The v08 post-process packet is retained only as rejected decision evidence. The
v11 A/B/C packet is the Human's narrowing evidence; v14 is the bounded
source-only response and current rendering gate. Candidate C's
identity/construction remains locked throughout. Human confirmation of the
recommended Ame fallback and revised family recipe, versioned runtime
publication, and broad family production are still separate, unmet gates.

### 5.4 Static versus runtime lighting

Static field assets use soft, mostly neutral front/top form modelling with no baked cast shadow and no strong fixed directional rim. Runtime lighting owns maze-direction casts/highlights. Story/key art may have a documented cinematic key light. Plan 04 does not claim to relight opaque sprite pixels; it grounds them with separate contact/cast surfaces.

### 5.5 Challenge and replay

Plan 06's diagnosis is adopted: the later campaign needs more reasoning density, not more corridor endurance. It may compact current routes while increasing decisions, prerequisite relationships, meaningful changed-state returns, and fair surprise. All rescues are optional for ordinary completion, including the former finale.

The programme uses “healthy voluntary replay appeal,” not coercive addiction, as its design goal. Rewards recognize mastery, exploration, humour, and curiosity without a shop or pressure loop.

### 5.6 Effects and variation

Plan 02's provisional hex palette yields to final Art Bible tokens. Add a deterministic, bounded `VfxFlavor` or equivalent theme/chapter accent layer so repeated pickups, rescues, combat, traversal, and victories vary coherently by terrain, weapon, enemy personality, cage, portal, or story beat. The semantic silhouette and timing truth remain stable; accents provide surprise without particle clutter.

Visual/audio intensity follows a deliberate ladder: input acknowledgement;
ordinary pickup/interaction; combat/rescue/blocker; mechanic or puzzle success;
maze clear/story beat; campaign milestone. A lower tier must not routinely spend
the density, duration, scale, flash, or sound emphasis of the tier above, and
reduced/static modes preserve the same outcome.

Exact combat Power conservation and cancellation are fixed. A 2,220ms dwell is an implementation baseline, not an untouchable product rule; gameplay/VFX may shorten pacing when evidence shows a snappier readable result.

### 5.7 Provisional performance budgets

Specialist-plan resource budgets are guardrails until Plan 07 obtains clean measurements on the integrated build. Earlier owners must instrument and stay within their proposed caps, but may not advertise a measured platform win from contaminated or incomparable evidence. TV, desktop, and iPad receive the same default visual tier; a lower tier requires measured capability policy, with phone the acceptable lower-priority fallback.

### 5.8 Delivery versus core controller scope

Plan 08 implements shared browser/Tauri controller support and a tested Steam Deck launch guide. Hosted Chromium/PWA and a future Linux Tauri package are delivery options, not automatic permission to add a service worker, Linux release, or Steamworks integration. Controller-only audio and real hardware remain explicit qualification gates; no agent claims them passed without evidence.

### 5.9 Root compatibility and gameplay-contract checkpoint (03M)

After Plan 03 is accepted and pushed, the root manager performs one bounded
compatibility/contract interlude before issuing the Plan-01 prompt. It is not a
new specialist redesign phase. It restores an honest green shared baseline and
freezes the seams that UI, VFX, Controls and later content would otherwise each
be tempted to invent differently.

The music slice must catalogue every delivered OST file under a stable semantic
track ID and one of the six approved pool IDs, validate that every runtime URL
exists, and cut the current player over from deleted placeholder paths to the
delivered static catalogue. It defines a small canonical `MusicTransportPort`
and conformance fake/current adapter for mute state, current context/track,
Previous, Next, Shuffle and any later Human-approved Loop semantics. Plan 01
binds UI to the port, and Plan 08 binds semantic input actions to it. The 03M
adapter may retain conservative current-player transitions; it makes no claim
of gapless context switching, predictive loading, mastering or final platform
qualification. Plan 07B later implements the full contextual two-lane controller
behind the same port and must rerun its conformance suite.

The gameplay-contract slice updates maintained specification, typed view/state
boundaries and focused tests for three Human decisions:

- reaching the exit always offers **Stay here**, **Next maze** and **Restart**;
  Stay is the safe default while friends remain, Next is the default after every
  friend is rescued, and Plan 10 may append **Take a break** without replacing
  those choices;
- a keyed door interaction is stationary: the player remains visibly and
  logically on the origin tile for the complete open beat, the door resolves
  once, and only a later or continuously held eligible movement step enters the
  cleared tile; and
- a disguised Mimic receives one deterministic committed 65% good-chest / 35%
  Mimic outcome from an isolated stream, with exact bounded Gold/Science and
  enemy/rescue drop tables chosen and recorded from economy evidence, stable
  object identity, save/resume reconstruction and exactly-once reward ownership.

03M does not build the final dialogs, door choreography, reward shower or Mimic
content rollout. It gives those later owners one tested semantic contract. Exit
requires no missing media request, focused conformance/contract tests, the full
project and desktop checks, updated source-of-truth docs, `git diff --check`, and
a root-reviewed committed and pushed checkpoint.

### 5.10 Soundtrack delivery and final asset retirement

The Human-delivered original soundtrack is now present in six approved physical
pools under `public/assets/ost/`: `title`, `story`, `maze`, `victory`, `garden`
and `adventure-book`. Its 42 MP3s are content authority, but the current player
and tests still reference the removed flat placeholder catalogue. Checkpoint
03M must restore a valid catalogue/current adapter with no missing URL. Plan 07B
then rebaselines the deliberate media increase and implements/qualifies the full
contextual controller behind the frozen port; neither owner may preserve an
obsolete byte target by silently omitting Human tracks.

`PT-20260903-23` adds player transport without adding persistent HUD clutter.
Plan 01 provides one accessible compact Sound disclosure containing Mute/Unmute,
Previous, Next and Shuffle/Random. Plan 07B owns actual contextual history,
selection, no-immediate-repeat behaviour, preload/crossfade, rapid-command
cancellation and failure fallback. Plan 08 supplies typed input actions and full
controller/keyboard/touch/pointer navigation. Manual transport never crosses the
active context pool or forks a second music player. Loop remains a Human gate;
if accepted, a context change overrides it and persistence must be decided
explicitly.

Asset replacement and asset retirement are separate changes. Plan 03 and later
art owners switch versioned pointers, classify candidates, and preserve rollback
material; they do not remove old files. Plan 07B proves/classifies retirement
candidates and may optimize representations that remain active. After Plan 13
has closed every planned consumer/pointer change, Plan 12 alone runs a two-stage
retirement handoff. It first **copies** each individually proven candidate into a
hash-verified, ignored **non-runtime** local archive outside `public/`, `dist/`,
and packaged inputs while retaining the repository/runtime source, records
tombstone/restore evidence, and pauses. An archive
inside `public/assets` is invalid because it still ships. Only after the Human
confirms that this handoff archive has been copied to external storage may the
root manager authorize a separate family-isolated repository-removal commit.
Masters, prompts, provenance, proof sheets and sole surviving copies remain
preserved unless that explicit confirmation includes them. Old cage files are
audit candidates, not automatic retirement targets. An approved gameplay-
eligible asset that lacks its promised consumer is an integration defect to
return to its owning plan, or an explicit Human deferral to record; it is never
laundered into an "orphan" merely because implementation is incomplete.

### 5.11 Mimic surprise and reusable reward showers

`PT-20260903-22` is adopted as a cross-plan P1 feature. Plan 03 supplies a
geometry-compatible closed/good-open/revealed triplet for every approved Mimic
family—including Treasure and Candy when approved—plus Gold/Science art, without
implementing game rules.
Before Plan 02, the root manager freezes the typed committed-reward outcome,
auditable 65% reward / 35% Mimic buckets, bounded drop tables, semantic object
identity, and exactly-once save/resume contract in the Gameplay Design Spec.

One versioned Mimic-family registry maps those visual triplets onto a shared
mechanic; no family gets a separate probability or economy. Plan 02 implements
one cancellable, bounded presentation: a chest strike/reveal,
short collision-free ballistic spray with coloured trails, magnetic homing to
Ame, exact amount feedback, and satisfying audio. It consumes already-committed
outcomes and never calculates currency or chance. Plan 05 may add a few
registered chest/Mimic frames. Plan 09 implements and places the actual Mimic
families, migrates Candy from its always-visible ordinary-enemy role,
enemy-drop and rescue-drop rules with solver/migration evidence; Plan 07B
qualifies worst-case overlap and lower tiers. Plan 10 later adapts only shared
reward ownership and visual recipient semantics for co-op. Plan 13 receives
residual polish only, not a late economy or randomness redesign.

For Surprise Mazes, Plan 09 gives each family an explicit
`generatedEligible` disposition and introduces placement only in a new
generated-content version. A generated maze may contain at most one disguised
Mimic, only in a solver-proven optional chest/treasure slot; zero is common.
Family selection and the committed 65/35 result use deterministic streams
isolated from topology, required rewards, ordinary enemy composition and
solution truth. Historical versions keep their prior interpretation.

The random result is optional to ordinary completion, stable across resume and
repeated bumps, and non-monetized. Reward state commits once regardless of
animation cancellation; a large credited amount may use a capped number of
visual sprites. Full acceptance and routing live in
`docs/PLAYTEST_BACKLOG.md#pt-20260903-22--mimic-reveal-and-magnetic-reward-showers`.

### 5.12 Content ecology, authored themes and generated variety

`PT-20260903-24` converts the Human's request to use the completed art library
meaningfully into a versioned content-integration contract. It does not mean
that every source study, optical variant, proof image, animation frame or
presentation-only asset becomes a gameplay object. Plan 03 first publishes the
final art vocabulary with stable semantic IDs, lifecycle status, proposed
content role, intended consumer and loading intent. Plan 09 then freezes the
separate typed campaign/generated eligibility registry. Every final Human-
approved gameplay enemy and rescue-friend identity is eligible by default;
exclusions and deferrals require an explicit Human decision and return gate.
That registry is keyed by stable type-level enemy-style/friend-species IDs;
level-scoped semantic object IDs and coordinates identify individual placements,
and Mimic retains its separate disguised-object identity.

Plan 09 owns the gameplay ecology. Its exact 24-level content-use matrix must
give every final gameplay-eligible enemy identity a purposeful authored campaign
appearance and every final friend species at least one Solo-accessible authored
rescue before that species can enter the Garden or Egg pool. The campaign
introduces new enemy families progressively, then revisits them in deliberate
themed subsets and mixed encounters. A late broad-roster celebration or
"everyone is here" maze is a candidate only if readability, pacing, memory and
family playtesting pass; it may never be the sole introduction or sole use of
any identity.

Plan 09 also owns the inherited campaign remediation required by the Human's
fatigue findings. From the currently reported nine inherited maps above 16×16,
it must compact at least six if that audit remains current and Chapter 24 keeps
the sole default new large-level exception; the final cap is four across all 24.
Every remaining large level needs at least two meaningful open rooms plus a
hub/spoke/loop/garden/chamber relation, and consecutive large chapters require a
recorded pacing reason plus successful family evidence.
It must rebuild Rainbow Power Parade if it still reads as a snaking corridor,
repair missing first-use teaching pockets under the measured view/input contract,
and give every graph-level true terminal branch its own small optional collectible
in addition to required content while keeping every optional treasure marker off
the minimap. Teaching pockets retain a real choice, optional friend/reward branch,
appealing beat, satisfying route and cross-input/accessibility parity. These are
implementation work with content-revision, migration, solver/Hint and family-
play evidence—not a design audit that can be left pending.

Each authored campaign level receives one fixed `EnvironmentManifest` so it
retains a crafted identity. The manifest has one required base/default complete
recipe and one to four complete named region assignments; a single-region level
uses the base recipe for its sole region. Plan 04 provides that bounded seam over
one unchanged gameplay topology; this
allows portal-linked areas to look like distinct but harmonious or intentionally
contrasting places without creating duplicate collision truth. Plan 09 may use
that seam only with explicit region assignments and legibility checks. It also
defines a versioned pool of complete validated environment recipes for generated
mazes rather than combining arbitrary floor/wall colours or materials.

Generated mazes use at least three exact seeded topology families—classic
labyrinth, room-and-spoke, and loop/garden/chamber—plus the replayable
`single-style`, `themed-ensemble` and `mixed-ensemble` cast profiles defined in
the Gameplay spec and Plan 09. Family selection is independently versioned,
fingerprinted and covered by golden seeds, distributions, solver/Hints, interest-
gap and terminal-reward properties. Enemy identity, roster selection, terrain
selection and layout remain separable deterministic domains so a presentation
change cannot silently reroll gameplay. Plan 07B qualifies the encoded/decoded/
loading costs and proves that title, menu and ordinary play do not eagerly load
the whole catalogue.

Plan 10 consumes the final Plan-09 roster and ecology rather than its planning
snapshot: Ordinary Duo preserves authored placements and themes, and Garden
eligibility follows the completed Solo-rescue contract. Plan 11 uses a curated
representative cast in branding rather than turning key art into a completeness
sheet. Plans 12 and 13 may not hide a missing mandatory consumer through
retirement or polish; the tranche returns to Plan 09 or an explicit Human defer
gate. Plan 14 may explore future bestiary, ecology or progression opportunities,
but cannot defer or redefine the mandatory `PT-20260903-24` integration already
owned by Plan 09.

### 5.13 Art-directed UI, early front door, and family-preview builds

`PT-20260903-25` makes visual authorship part of Plan 01's definition of done.
The structural layout overhaul is necessary but insufficient: the final shell
must share the Art Bible's shape, material, edge, colour, typography and
sticker-signal grammar and must no longer read as a generic web dashboard. The
reference games named by the Human express joyful hierarchy and polished
console-game craft only; no protected panel, layout, icon, logo, type treatment,
transition or trade dress is copied.

Plan 01 owns the responsive UI composition and a small Maze-native surface
family. The leading direction is luminous milky/pearl magical glass with quiet
text centres, a bright inner rim, gentle world tint, controlled depth and sparse
storybook ornament. Full quality may use a measured, bounded backdrop treatment
on a small number of static overlays. Lite/static modes reproduce the material
with opaque colour, gradients, borders and highlights; the moving maze is never
continuously re-blurred simply to imply polish. Approved cream-cut sticker icons
remain semantic signals over these surfaces.

Typography is a deliberate locally packaged art decision, not a browser default:
one rounded expressive display/control voice plus its legible text cut or one
quiet companion. The final choice needs licence provenance, exact real weights,
required alphabet/punctuation/arithmetic glyphs, stable figures where useful,
fallback, subsetting/loading cost, couch-distance and minimum-size evidence, and
200% resize/text-spacing support. Plan 01 records the final tokens in
`docs/UI_UX_SPEC.md`; Plan 03 reconciles any art-owned type guidance.

The catalogue distinguishes `field`, optical/icon and `presentation` renditions.
Blocker dialogs prominently show the exact required item's large approved art
plus concise real text. Selected item, rescue, new-friend/enemy, Adventure Book,
victory, reward and story surfaces may use presentation art when it earns the
space. The shared resolver reserves geometry, loads only visible or bounded-
imminent media, never enlarges a field sprite into fuzzy art, and provides a
semantic optical/text fallback without blocking interaction. Plan 07B qualifies
decode, package and render cost.

`PT-20260903-26` moves the first title illustration, home splash and logo into
the active Plan-03 production slate after their individual Human approval. Plan
01 integrates them. Plan 11 later audits them against final campaign/co-op/
Garden canon and retains good work by default; it creates only missing variants
or bounded replacements justified by the final product.

The current `title` route is already the home/menu surface. Plan 01 assigns the
two illustrations distinct responsive background/foreground roles or explicitly
reserves one; it does not add an extra screen solely to display art. Illustration
and wordmark remain separable. Generated lettering is concept-only until the
exact “Maze so Puzzle” wordmark is reconstructed with controlled local type or
vector/raster lettering, checked for spelling and delivery-size legibility, and
explicitly approved.

Every accepted plan first receives a source checkpoint: reviewed changes are
committed and pushed to GitHub `main` with evidence. That push must be observed
through GitHub CI and the connected Vercel production deployment, followed by a
short canonical-URL smoke test; “pushed” alone is not deployment evidence.
Portable desktop builds remain rarer learning artifacts rather than a release
after every plan. Executables stay out of Git history and, when a downloadable
build is produced, are uploaded as immutable GitHub pre-release assets alongside
their manifest, SHA-256 and playtest note:

1. **`FP-ART-OST` — Art & OST Preview after Plan 03 and checkpoint 03M** is the
   next required build opportunity. It contains every accepted refreshed asset
   whose semantic consumer already exists in v0.19.0, the accepted front door,
   and all six delivered OST pools through 03M's valid catalogue/current adapter.
   Dormant/new enemies, friends, Mimics, hazards and other sprites remain
   catalogue-ready until their owning gameplay plan implements them. The full
   contextual history/crossfade controller remains Plan 07B. The anticipated
   application version is the next unused version after 0.19.0 (normally 0.20.0),
   resolved only after the final accepted commit is known.
2. **`FP-UI1` — Family Preview 1 after Plan 01** is a required build when the
   accepted UI checkpoint is green, combining
   approved static/front-door art with the rebuilt UI.
3. **`FP-CORE2` — Integrated Interaction Preview after Plan 07B** is a required
   green-checkpoint build and includes lighting, VFX,
   controls, limited animation, music and the performance-qualified package.
4. **`FP-CAMPAIGN` — Campaign Preview after Plan 09** is a required
   green-checkpoint build exercising the 24-maze campaign.
5. **`FP-P10-GREYBOX` — Plan-10 greybox family gate** uses an explicitly disposable, isolated
   profile/storage namespace before production co-op migration, followed by a
   **`FP-COOP` — Co-op Preview** is required after green Plan 10 acceptance.
6. **`RC-01` — release candidate after Plans 11, 13, then 12** contains final
   branding, backlog closure and verified asset hygiene and is qualified by the
   root release manager rather than inferred from Plan 07B's earlier forecast.

The root/release manager may defer a required build only when its checkpoint is
red or packaging would risk data/artifact integrity, and records the exact blocker
and next retry point. “About to be improved again” is not sufficient by itself
to skip `FP-ART-OST`, `FP-UI1`, `FP-CORE2`, `FP-CAMPAIGN`, or `FP-COOP`. Every
produced preview comes from a clean checkout/worktree of one reviewed, committed
and pushed checkpoint—never the shared dirty tree—and records application/
content versions, exact commit, artifact SHA-256, build
host/tool versions, included milestone, known issues, smoke journey and rollback.
Every non-RC family preview uses its own preview-specific application/user-data
namespace. If platform constraints make that impossible, require a verified
copy/backup-and-restore protocol before launch. No preview may migrate Amelia's
sole ordinary play profile. Record the namespace or backup/restore path in its
manifest.

Use the lowest-friction artifact that Amelia can launch without development
tools; an internal portable Windows build may replace installer/signing work
when that work adds no learning. Keep binaries out of source/runtime delivery.
A family-preview bundle normally contains one immutable SHA-named unsigned
portable Windows executable, a machine-readable manifest, SHA-256 checksum, and
short `PLAYTEST` note with launch path, target journeys, known issues, save/profile
scope, and rollback. Rebuilds use an explicit revision suffix and never overwrite
earlier evidence. Installer/signing and the complete package matrix are reserved
for a release candidate unless a specific risk justifies them earlier.
A generated artifact manifest/checksum file is hash authority over prose
examples. A preview never claims public release, signing, store readiness or unperformed
hardware, accessibility, low-end, performance or family coverage.

For each named build, the root/release manager—not the specialist agent—owns the
release transaction: reconcile and bump the next unused application/content
version across package/Tauri/UI authority, run the proportionate clean-checkout
gate, commit and push `main`, wait for GitHub CI and Vercel, smoke the canonical
web deployment, build the portable Windows artifact, verify its launch and hash,
and publish it with notes as a GitHub pre-release asset when GitHub publication is
available. A failed CI, Vercel or desktop build is recorded honestly and fixed or
deferred; no stale earlier binary is relabelled as the new checkpoint.

### 5.14 Final gameplay, progression and quality-of-life opportunity review

Plan 14 is a **planning and Human-decision TODO**, not approval to add a
meta-progression system after release convergence. Preserve the accepted release
candidate as a clean rollback/checkpoint, then use the Human's
specification-finalization and improvement workflow to examine how Maze so
Puzzle could become more fun, satisfying, surprising, convenient, and—in useful
places—simpler.

The review begins from evidence: family playtests, the closed backlog, campaign
and solver metrics, save/progression behaviour, controls, co-op, Friend Garden,
performance results, and the final integrated game. Use the
`product-brainstorming`, `synthesize-research`, and `write-spec` workflows where
available. Frame the player jobs and tensions first; diverge to at least seven
materially different approaches; include at least one removal/streamlining
option and one inversion; challenge assumptions; then converge to a small
shortlist with the cheapest useful prototype or playtest for each.

The Human specifically wants persistent progress explored because current
per-maze Power and inventory reset can make the experience feel roguelite-like.
The opportunity set must include—but must not anchor exclusively on:

- a persistent player/Adventure level with visible XP and durable milestones;
- XP sources such as enemies, puzzle completion, rescues, exploration, or a
  balanced mixture that does not turn optional combat into compulsory grinding;
- upgradeable convenience or assist abilities, including faster traversal and
  limited-use wall hopping;
- progression tied to friends, the Garden, collections, story discoveries,
  mastery, cosmetics, or new choices rather than raw permanent strength alone;
- the lower-priority personal achievement sticker-book idea: whether the joy of
  freely placing earned stickers across a two-page book justifies its spatial
  editor, persistence, migration, controller-cursor and accessibility cost,
  versus retaining only Plan 01's focused holographic achievement showcase;
- simpler alternatives that remove friction or repetition without adding a
  large progression economy; and
- the “do nothing systemic” option, with targeted polish instead, so persistent
  progression must earn its complexity rather than win by assumption.

Every pitch must explain player value, target-age comprehension, persistence and
migration, controls/co-op behaviour, content cost, performance, accessibility,
failure/abuse modes, and interaction with current Power, rewards, hints and
replay. Sprinting must not make the camera or held movement worse. Wall hopping
must not silently invalidate doors, keys, hazards, portals, required paths,
solver proofs, teaching, or level identity; explore charges, permitted surfaces,
assist-mode boundaries, late unlocks, or other constraints rather than assuming
free topology bypass is safe. Persistent XP must avoid farming pressure,
punishing resets, opaque scaling, monetization, or making a child feel required
to grind before solving a fair puzzle.

The single Plan-14 output is
`docs/plans/14-gameplay-progression-and-qol-opportunity-review.md`. It must
separate observed problems, Human preferences, speculative options, research
evidence, recommendations, rejected ideas, and open decisions. It ends at a
Human accept/defer/reject gate and changes no runtime source, save schema,
campaign, assets, balance or release claim. If the Human approves implementation
work, create separately scoped and sequenced plan(s), preserve the known-good
release checkpoint, and keep the reusable process playbook as the final roadmap
task after those plans finish.

### 5.15 Final transferable process retrospective

After Plan 14 and any Human-approved follow-on work are accepted, the root
manager executes Plan 15 and writes exactly one canonical learning artifact:
`docs/REUSABLE_AGENTIC_GAME_DEV_PLAYBOOK.md`. It synthesizes the completed
project rather than changing the game or reopening settled scope.

The playbook must draw from the final commit history, specialist plans and
handoffs, integrated roadmap, subsystem specifications, playtest backlog,
project audit, release evidence, performance reports, asset provenance, Human
decision records, and preserved rejected experiments. It must explicitly cover:

- authority hierarchy, orchestration, dependency mapping, ownership, clean
  checkpoints, and when parallel research versus sequential implementation was
  safe;
- how specialist agents, reasoning levels, skills, tools, and research methods
  were selected, prompted, constrained, reviewed, and handed off;
- the reusable planning-prompt and execution-follow-up pattern, including
  current-state drift, read-before-work requirements, non-destructive working
  rules, acceptance gates, and complete result reporting;
- Human/child review gates, playtest capture, exact decision recording,
  candidate comparison, rejection, bounded revision, and protection against
  false or premature approval;
- executable evidence practices across tests, solvers, migrations, browser and
  device matrices, accessibility, Tauri/web separation, performance baselines,
  contaminated-measurement rejection, and rollback;
- the art workflow from Art Bible and immutable identity anchors through
  genuinely independent candidates, actual-size canaries, colour/material-aware
  rendering, provenance, production masters, runtime publication, and eventual
  asset retirement;
- gameplay/content design, campaign evolution, stable identity, educational
  challenge, hinting, surprise/variety, and family-centred evaluation;
- backlog management, scope control, sequencing, documentation maintenance,
  and convergence from exploration into release polish;
- what failed or wasted effort, why it failed, how the process recovered, and
  which costs or risks another project should anticipate; and
- a compact, copy-ready starter workflow containing reusable prompt templates,
  role briefs, review checklists, evidence templates, decision gates, and a
  suggested repository document structure.

Every major recommendation must be labelled as observed evidence, a
Maze-specific decision, or a transferable inference. Examples must be sanitized
of credentials, private data, inaccessible local paths, and third-party asset
content. The playbook must not claim one model, skill, tool, or workflow is
universally best; it should explain when each approach helped, failed, or needs
adaptation. Creating installable Codex skills, plugins, external templates, or
changes in another repository is a separate Human-authorized follow-up—not
implicit Plan-15 scope.

## 6. Single-owner contract table

| Contract | Owner | Consumers and boundaries |
|---|---|---|
| Product decisions and programme sequence | Root manager / game-vision + roadmap | Every agent consumes; only Human authority changes locked product decisions. |
| Engine rules, legal actions, required/optional semantics, content identity/revision, hint search, campaign ordering | Plan 06 | UI/controls/VFX/animation consume typed semantic state; none infer rules from pixels, DOM, or filenames. |
| Static visual identity, palette semantics, catalogue schema, asset source/provenance, geometry/registration, art pipeline and final content-integration manifest | Plan 03 | UI implements tokens; lighting/VFX/animation consume. Plan 09 consumes semantic asset identity/proposed roles and alone freezes final gameplay eligibility in its typed registry. Animation may extend the art pipeline, never fork it. |
| App shell, MazeViewport host, DialogShell, typed UI/top-overlay state in `src/ui/interactionState.ts`, focusable semantic IDs, CSS import/layer order, shared motion preference/provider and canonical `src/motion.ts` contract, layout anchors, Maze-native surface/type/state grammar and contextual presentation-art slots | Plan 01 | Art supplies tokens/renditions; Controls consumes UI state/focus surfaces; lighting/VFX/animation import the resolved motion mode and use declared scene slots/namespaced style layers; Performance qualifies blur/media cost. UI does not own semantic input-action policy or repaint static art. |
| Canonical structured `InputContext`, `InputAction`/`InputSource`, `src/inputContext.ts`, `getInteractionPolicy()`, raw input normalization, semantic actions, held cadence, controller ownership/deadzones, neutral gates, focus navigation | Plan 08 | Consumes Plan-01 UI/top-overlay state, Plan-02 busy lease, and Plan-06 gameplay legality. Pointer steering alone owns pointer-specific corner assistance. |
| Terrain boundary topology, cached render model, world masks/gutter, resolved maze light, wall/depth layers, contact/cast grounding surfaces and bounded presentation-only terrain regions | Plan 04 | Art provides albedo/material intent; Plan 09 assigns fixed compatible region themes over one topology; VFX supplies motion/emission in assigned layers; UI hosts the scene. |
| Presentation director, run lifetime, abort/cancellation, effect/audio cue timing, transient VFX, hazard material motion, presentation-busy lease | Plan 02 | Controls consumes lock boundaries; animation consumes absolute run time/pose intent; gameplay state is already committed. |
| Optional sprite frames, animation manifest/selector, isolated renderer, frame decode/cache, pose/body/weapon atomic fallback | Plan 05 | Consumes art identity/geometry and VFX timing; never owns engine outcome, outer travel, or base-art fallback history. |
| Browser/performance harness governance, trace method, global budgets/quality policy, generated asset inventory, final caching/package/release evidence | Plan 07 | Plan 07A establishes the shared harness; all later agents extend it rather than add rivals. Plan 07B requalifies the integrated product. |
| Delivered BGM catalogue and canonical `MusicTransportPort`/fake/current-adapter semantics | Root checkpoint 03M | Plan 01 binds one compact Sound disclosure and Plan 08 binds semantic cross-input operation without accessing audio internals. |
| Full contextual BGM selection/history, Previous/Next/Shuffle transport, optional approved Loop policy, crossfade/readiness, fallback and media qualification | Plan 07B | Implements behind the 03M port and reruns conformance; Plan 02 exposes mix seams, Plan 09 consumes Maze context and Plan 10 adds Garden context. |
| Final gameplay-content eligibility, campaign introduction/placement, authored theme regions, generated roster profiles and exact coverage | Root Plan 09 | Plan 03 supplies the manifest, Plan 04 the region seam and Plan 07B loading qualification; Plan 10 consumes the final roster. Plan 13 cannot close over a missing promised consumer, and subsequent Plan 12 cannot retire or conceal it. |
| Final asset lifecycle, tombstones, copy-first handoff archive and post-feature package sweep | Plan 12 / root release manager | Consumes Plan-03 classifications, Plan-09 consumer coverage and Plan-07 tooling; never redesigns assets, treats an unfinished promised consumer as an orphan, or deletes sources merely to reduce package size. |
| Family-preview checkpoint selection, isolated prototype profiles, artifact manifest/hash, launch path, known issues and rollback | Root/release manager | Specialist plans supply green reviewed checkpoints; Plan 07 supplies reusable build/provenance tooling. Internal previews do not become public-release claims or pollute ordinary saves/source control. |
| Narrative canon and chapter learning arc | Plan 06 for current campaign; root Plan 09 for expansion | Art/UI/VFX may present it but do not rewrite story meaning independently. |
| Pending-completion choices/defaults and stationary keyed-door transition semantics | Root checkpoint 03M | Plan 01 presents choices/dialogs, Plan 02 choreographs committed door/victory events, Plan 08 quarantines input, and Plan 10 may add a post-commit Garden destination without changing the core contract. |
| Mimic-family mapping, shared reveal probability, bounded reward/drop tables, semantic resolved state and exactly-once credit | Root checkpoint 03M, then Plan 09 | Plan 03 supplies each approved family's closed/good-open/revealed triplet; Plan 02 presents committed outcomes; Plan 05 animates them; Plan 07B qualifies them; Plan 10 may adapt the homing recipient but cannot duplicate or reroll shared rewards. |
| Final gameplay/progression/QoL opportunity exploration and specification decision | Plan 14 / root manager + Human | Consumes the stable integrated release candidate and completed evidence; generates options and experiments, not runtime scope. Only an explicit Human decision may create follow-on plans. |
| Cross-agent methodology retrospective and reusable process guidance | Plan 15 / root manager | Consumes the completed programme as evidence; it documents and generalizes but does not reopen product scope, alter runtime behaviour, or silently create tooling in other repositories. |

## 7. Shared interface freezes

### After Plan 06

Freeze or explicitly version:

- stable semantic authored object IDs and content fingerprints;
- campaign-entry identity independent of array position;
- ordinary/perfect solver and route-metric contracts;
- required Path versus optional Rescue goals and hint tiers;
- blocker, save-status, reward, and completion semantics;
- a campaign-length-safe progression/unlock contract; and
- the pure truth used to decide whether gameplay input is legally accepted.

### After Plan 03

Freeze or version:

- Art Bible tokens and family recipes;
- the exact PPBA craft adopt/adapt/reject record and approved `mgjrpg-02`
  canary decision (or an explicit decision to retain/narrow `mgjrpg-01`);
- the approved Ame model sheet and canonical static art;
- intrinsic visible bounds, pivots, face zones, baselines, hand sockets, and weapon geometry;
- static asset catalogue/source manifest and pipeline commands;
- approved early title illustration, home splash and logo with responsive safe
  zones plus field/optical/presentation rendition contracts;
- the versioned content-integration manifest: stable semantic ID, lifecycle,
  proposed content role, intended consumer/owner, loading intent and explicit
  Human deferral for every approved asset. Final campaign/generated eligibility
  remains a Plan-09 gameplay decision; and
- neutral-light/material declarations used by lighting.

### After root checkpoint 03M

Freeze or version:

- the validated delivered soundtrack catalogue and canonical
  `MusicTransportPort` with fake/current-adapter conformance;
- pending-completion state, the three core choices, safe defaults, exit-tile
  rearm and exactly-once durable commit boundary;
- stationary keyed-door origin/commit/continued-input semantics; and
- Mimic 65/35 bucket identity, exact bounded reward/drop tables, deterministic
  outcome stream, save/resume reconstruction and exactly-once ownership.

### After Plan 01

Freeze or version:

- canonical primary landscape and compact-phone topology;
- component semantic IDs/groups and DialogShell behaviour;
- canonical `src/ui/interactionState.ts` UI-surface/top-overlay truth and a narrow current-input blocking adapter; no `InputContext`, `InputAction`, or `getInteractionPolicy()` competing with Plan 08;
- MazeViewport/scene slots and CSS layer/import order;
- VFX anchors, including `bag:<slot-id>` plus generic fallback;
- the documented Maze-native surface, edge, ornament, state and typography
  system with licensed packaged fonts and full/lite/static recipes;
- semantic field/optical/presentation image selection, responsive reserved
  geometry, on-demand loading and failure fallback for contextual art;
- `src/motion.ts` as the canonical neutral import for `MotionPreference = "system" | "full" | "reduced"`, resolved `MotionMode = "full" | "reduced"`, and preference/provider behavior. Persist presentation/accessibility preferences outside campaign progress/session state; Reset Progress preserves them; and
- automated viewport/state fixtures.

### After Plan 04

Freeze or version:

- resolved `toLight`/cast semantics;
- cached full-world terrain topology/render model;
- layer/mask/gutter/compositing order;
- the bounded one-to-four-region presentation mapping and compatible terrain-
  theme resolution over one unchanged gameplay topology;
- semantic entity height and dedicated contact/cast/sparkle nodes; and
- full/medium/low lighting recipes.

### After Plan 02

Freeze or version:

- presentation run ID, absolute clock, abort signal, final reconciliation, and input-busy lease;
- typed effect plan/cue interfaces;
- jump-to-portal and other composite event sequencing;
- VFX layer ownership and flavor selection; and
- full/lite/static effect recipes.

### After Plan 08

Freeze or version:

- canonical `src/inputContext.ts` and `getInteractionPolicy()` with structured input context: screen, Plan-01 top overlay/focus scope, Plan-02 presentation lock, Plan-06 gameplay legality, and controller status;
- semantic action map and A/B/Menu/View conventions;
- shared modality-neutral held cadence and source-specific intent normalization;
- controller ownership, neutral/release gates, disconnect restoration, prompts, and focus groups; and
- preference separation: haptics/input preferences survive Reset Progress.

### After Plan 05

Freeze or version:

- animation manifest and art cross-resolution;
- transform hierarchy and frame registration;
- action-start availability latch and atomic body/weapon fallback;
- reduced/static frame choice; and
- per-level frame loading/cache budget.

## 8. Documentation deliverables

| Plan | Durable documentation it creates/owns during implementation | Existing authority it updates when true |
|---|---|---|
| 06 | `docs/GAMEPLAY_DESIGN_SPEC.md` | `docs/STORY_BIBLE.md`, `docs/ARCHITECTURE.md`, README gameplay/progression, audit/release evidence. |
| 03 | `docs/ART_BIBLE.md`, `docs/characters/AME_MODEL_SHEET.md`, `docs/research/2026-09-03-ppba-art-craft-synthesis.md`, structured source records/manifest and versioned content-integration manifest, including approved early title/logo/home-splash and required presentation renditions | `docs/AI_ASSET_PROMPTS.md` by appending versioned history; architecture/catalogue and release evidence. Never rewrite exact historical prompts or import cross-project assets. |
| 01 | `docs/UI_UX_SPEC.md`, including Maze-native surface/edge/ornament/state grammar, licensed typography and contextual presentation-art contract | Architecture fixed-stage claim, README device/layout/front-door description, audit/release viewport and preferred Family Preview 1 evidence. |
| 04 | `docs/LIGHTING_AND_DEPTH_SPEC.md` or an owned Art-Bible section if that is cleaner | Architecture terrain/light contract, catalogue material records, release visual matrix. |
| 02 | `docs/VFX_BIBLE.md` | Architecture presentation/lifecycle contract, sound/effect integration, release matrix. |
| 08 | `docs/CONTROLS_AND_STEAM_DECK.md` | README controls/setup, architecture input contract, accessibility/preferences behaviour, release hardware matrix. |
| 05 | `docs/ANIMATION_SPEC.md` plus versioned animation source records | Art Bible/model references, asset prompts/provenance, architecture renderer/loading contract, release matrix. |
| 07 | `docs/PERFORMANCE_BUDGETS.md` and reproducible report/index conventions | Architecture/delivery, project audit, release checklist, Vercel/Tauri evidence where actually changed. |
| 09 | Updates `docs/GAMEPLAY_DESIGN_SPEC.md` and `docs/STORY_BIBLE.md`; versioned 24-row content-use/adjacency matrix and generated-content coverage report | README campaign description, architecture/progression, catalogue-consumer mapping, audit/release evidence. |
| 10 | `docs/COOP_AND_FRIEND_GARDEN_SPEC.md` or the existing approved Plan-10 specification promoted to durable authority; exact final-roster eligibility and Human-approved Egg-cadence record | Gameplay, controls, story, art, persistence and release evidence for co-op/Garden behaviour. |
| 11 | `docs/plans/11-final-key-art-branding-front-door-presentation-plan.md` plus a versioned retain/refine/replace audit of the early front-door set and any justified new key-art/brand records | Art Bible, asset catalogue, README screenshots/identity and release visual evidence; no automatic regeneration of accepted Plan-03 art. |
| 12 | Asset-lifecycle/tombstone manifest plus a reproducible retirement report, consumer-coverage reconciliation and restore procedure | Art/source manifests, Plan-09 content-use evidence, performance inventories, architecture, audit and release package evidence. |
| 13 | Final closure ledger/report generated from `docs/PLAYTEST_BACKLOG.md`, including `PT-20260903-24` coverage disposition | Every subsystem spec and release document actually touched by accepted mop-up work; any missing mandatory content tranche returns to Plan 09 or a Human defer gate. |
| 14 | Exactly one `docs/plans/14-gameplay-progression-and-qol-opportunity-review.md` containing evidence-framed opportunity areas, divergent mechanics/streamlining options, assumption tests, cheapest experiments, a recommended shortlist and Human decision gate | No existing product specification changes until the Human accepts a proposal; approved follow-on work receives a new scoped plan and sequence. |
| 15 | Exactly one `docs/REUSABLE_AGENTIC_GAME_DEV_PLAYBOOK.md` containing the evidence-backed retrospective, reusable workflow, prompt/checklist templates, failures and adaptations | This roadmap may be marked complete; no product specification is rewritten merely to make the retrospective cleaner. |

Do not create two differently named files for the same contract. If a predecessor already created the intended document under a clear name, update it and record the substitution.

## 9. Shared test and evidence policy

Every implementation checkpoint runs the most focused tests while iterating, then:

```powershell
npm run check
npm run check:desktop
git diff --check
git status --short
```

Run a packaged Tauri build only when the changed subsystem, its specialist plan,
or the named `PT-20260903-26` family-preview gate calls for it; Plan 07 and final
Plan 09 require release qualification. Browser screenshots and traces must state
commit, build mode, viewport, DPR, motion mode, input mode, and fixture/maze.
Temporary evidence belongs outside tracked runtime assets unless the shared test
policy explicitly adopts a small baseline.

For a family-preview candidate, finish ordinary manager review and create the
clean checkpoint first. Then build from that exact commit, smoke title → story →
maze → save/reopen, hash the artifact and record versions/tools/known issues/
rollback in a compact preview manifest. Do not stage generated executables or
installers into the repository. Plan-10 greybox builds additionally use a
disposable isolated profile/storage namespace and must not open or migrate the
ordinary family-play profile.

The common viewport matrix is:

- 1920×1080 TV/couch presentation where practical;
- 1280×720 desktop/Tauri default;
- 1194×834 and/or 1024×768 iPad/tablet landscape;
- 960×540 Tauri minimum;
- 844×390 landscape phone; and
- 568×320 emergency phone floor.

Common state stress includes the longest objective, every current one-to-seven Bag state plus a synthetic larger typed equipment registry, five simultaneous per-maze friends plus the catalogue integration rack, three-digit Power, four-digit currencies, Normal and Big Maze, every modal, explicit/system full and reduced motion preferences, forced static quality/fallback recipes, keyboard, pointer/touch, on-screen controls, and controller once available. Static is a rendering-quality or semantic fallback, not a third persisted motion preference.

## 10. Per-agent manager review checklist

Before committing an agent's work, verify:

1. The diff implements its owned plan without silently expanding another scope.
2. Human decisions in the game-vision spec are demonstrably preserved.
3. It reused all predecessor contracts and retired obsolete compatibility code only after evidence and the archive/backup gate.
4. Its durable subsystem spec matches source and its release docs make no unsupported claim.
5. Focused, full, migration/solver, browser, performance, and platform checks are proportionate to risk.
6. New assets have source/provenance, real-size proofs, stable semantic identity,
   lifecycle and an intended consumer; a missing promised consumer blocks or
   receives explicit Human deferral. Retired runtime files are proven
   unreachable, copied to the non-runtime handoff archive, externally backed up
   with Human confirmation, tombstoned, and restorable before repository removal.
7. No stale timer, held input, sound, animation, or decoded resource crosses level/navigation/visibility/overlay boundaries.
8. `git diff --check` is clean and the final status contains only intentional work.

Commit and push that reviewed checkpoint before issuing the next execution prompt.

## 11. Programme completion gate

Checkpoint 03M and Plans 01–08 are integrated only when their specs and
contracts agree in the running app, not merely on paper. Plan 09 begins from
that reviewed checkpoint;
its `PT-20260903-24` gate is complete only when every final gameplay-eligible
enemy/friend has the required authored consumer, the 24-row ecology matrix and
generated-profile evidence agree with source, and every terrain assignment is
fixed and compatible. Plan 10 may begin only from that accepted final roster,
campaign and ecology; Plan 11 audits the accepted early front-door set against
the final campaign and visual canon through a representative cast rather than a
completeness sheet, retaining good work by default. Plan 13 then closes or
explicitly defers every residual backlog item before Plan 12 can classify the
final consumer graph. Every named family-preview opportunity has either a
hashed/smoke-tested manifest or a recorded skip reason. Plan 12 performs its
archive-first, Human-confirmed retirement gate after all pointer-producing
work. The root release manager then builds `RC-01` and runs one integrated
solver/migration/content/viewport/controller/accessibility/audio/performance/Tauri
pass and an honest record of any physical-device or family check still pending.
After that product checkpoint, Plan 14 runs the final planning-only gameplay,
progression and quality-of-life opportunity review. It does not destabilize or
block the known-good release candidate; any accepted implementation becomes new,
explicitly sequenced scope. Plan 15 remains the final task and captures the
transferable process in the single canonical playbook after Plan 14 and any
approved follow-on work. The project-learning programme is not considered
complete until that playbook is reviewed for evidence, portability, candour, and
removal of sensitive material.
