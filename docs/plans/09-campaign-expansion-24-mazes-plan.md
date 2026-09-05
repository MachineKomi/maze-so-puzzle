# Plan 09 — expand the authored campaign from 16 to 24 mazes

Status: manager-authored implementation plan; execute only after checkpoint 03M,
Plans 01–08, UI-02, and both Plan-07 passes are accepted

Owner: root integration agent

Prepared: 2026-09-02

Current planning baseline: 16 authored story mazes at manager baseline commit `5eed837`

Planning refinement: 2026-09-05. Reconcile that dated baseline with the accepted
32-friend authored coverage and the post-Agent-01 movement-comfort checkpoint.
This plan remains pending; chapter names, sketches and teaching hypotheses below
are not evidence of implemented or family-approved content.

Wishlist refinement: 2026-09-05, based on Human playtesting of **v0.20.1** in
`docs/playtests/2026-09-05-v0201-wishlist.md`. PT22 now requires designer-owned,
solvability-safe Mimic policies rather than one mandatory probability for every
future placement. PT41 adds a bounded proposal for original cute/spooky friends;
PT42 strengthens actual puzzle reasoning and adds a player-facing Surprise Maze
difficulty choice. These are pending Plan-09 requirements, not claims about the
running Agent-01 candidate or changes to accepted historical rules/save data.

Additional wishlist refinement: **20260905-02** in
`docs/playtests/2026-09-05-02-room-variety-and-mechanics.md`. PT43 adds deliberate
monster/treasure rooms and whole-maze profiles. PT44 requires bounded exploration
of intuitive new mechanics in this plan's design preflight, before dependent
maps freeze; any selected new rule still needs its own Human-approved contract.
Neither refinement expands the currently running UI task or FP-UI1.

### UI-02 consumer contract — PT37/35/34

UI-02 lands after 02/before 08 and owns the Book interface/discovery foundation.
Consume its five tabs, selected-card viewer, encounter entry IDs, root-reviewed
migration and current lore. This plan completes final 24-maze/friend/guardian
content and true discoverability through those APIs; it does not build a rival
Book or infer encounters from a catalogue/completion list. Every admitted friend
or enemy gets original canonical flavour, correct rendition, loading disposition
and actual consumer evidence. Displayed lore remains distinct from exact gameplay
facts. Cosmetic festival cameos never award encounter/combat credit by accident.

When Candy Mimic moves from a visible ordinary enemy to the disguised family,
migrate UI-02's previously earned entry through its stable alias without losing
or duplicating discovery. Preserve historical ordinary-enemy reconstruction.
Unrevealed new disguised chests do not expose family entries. Resolve all final
EnemyStyle/MimicFamilyId mappings, including omitted historical defaults.

Recheck Book tabs/cards and Plan-08 controller return with the final roster;
test current maximum and longest lore cases with selected-page media loading.
Requalify UI-02's no-scroll victory with actual 24-chapter outros/rewards and
Plan-02/05 friend dances. New content cannot quietly invalidate geometry, focus,
save safety or the Plan-07B performance evidence. Record the updated tests and
FP-CAMPAIGN findings before Plan 10 consumes the result.

## 1. Outcome

Expand the campaign to 24 authored, story-backed mazes:

- four new chapters inserted at deliberate learning and pacing points inside the existing journey; and
- four new chapters after the current final maze, forming a short encore arc beyond the restored Star Map.

The expansion should feel like the game discovered more imagination, not merely more length. Each addition must be fair, legibly solvable, funny, educational, visually and aurally distinctive, rewarding to explore, and worth replaying. Later chapters become more puzzly through meaningful inference and combination while remaining safe, intuitive, and recoverable for Ame, with optional family help welcomed.

This plan is executed by the root manager only after the specialist systems are stable, because the new content must use their final gameplay, art, layout, lighting, VFX, animation, controller, persistence, and performance contracts.

## 2. Read-first execution gate

At execution time, do not assume the repository still resembles the planning baseline. Begin from a clean, reviewed, pushed checkpoint after Plan 07B and read in full:

1. `docs/GAME_VISION_AND_DESIGN_SPEC.md`.
2. `docs/plans/00-integrated-implementation-roadmap.md`.
3. This plan.
4. The final `docs/GAMEPLAY_DESIGN_SPEC.md`, `docs/STORY_BIBLE.md`, `docs/ART_BIBLE.md`, Ame model sheet, UI/UX spec, Lighting spec, VFX Bible, Controls/Steam Deck spec, Animation spec, and Performance Budgets.
5. Current `README.md`, `docs/ARCHITECTURE.md`, `docs/AI_ASSET_PROMPTS.md`, `docs/PROJECT_AUDIT.md`, and `docs/RELEASE_CHECKLIST.md`.
6. `docs/PLAYTEST_BACKLOG.md`, especially `PT-20260902-04`,
   `PT-20260902-06`, `PT-20260902-11`, `PT-20260902-12`,
   `PT-20260902-16`, `PT-20260902-17`, `PT-20260902-19`,
   `PT-20260903-22`, `PT-20260903-24`, `PT-20260904-30`,
   `PT-20260905-41`, `PT-20260905-42`, `PT-20260905-43`, and
   `PT-20260905-44`; these are execution
   contracts, not optional background notes. Consume `PT-20260902-07`'s accepted
   movement/camera comfort evidence when measuring route fatigue.
7. Current levels, story, engine, solver, progress, session, navigation, achievements, rewards, assets/catalogue, audio, presentation, UI, and tests.

Before authoring a tile, verify that the following predecessor gates really exist and pass:

- stable semantic object IDs and content fingerprints;
- versioned campaign ordering and historical-order migration;
- campaign-length-safe unlock/Continue/chapter display logic;
- engine-transition reachability and tier-4 hint replay;
- zero-rescue ordinary and exact-perfect solver modes;
- current gameplay/experience metric tooling;
- final art/theme/light/VFX/animation catalogues and their validators;
- shared browser/controller/performance scenario harnesses; and
- clean `npm run check` and `npm run check:desktop` results.

If one is missing, implement and validate that foundation as the first bounded phase. Do not work around it with row-number IDs, array-index patches, copied flood fill, or scattered literal `24` values.

## 3. Locked content constraints

These constraints derive from Human decisions and predecessor contracts.

- Preserve existing level IDs and earned durable results.
- Keep the established engine-rule vocabulary unless the Human explicitly approves a separate mechanic specification. Default: add no new engine mechanic.
- Complete PT44's bounded comparison and Human disposition before freezing maps
  that could depend on a new rule. Exploration is authorized; implementation of
  a particular mechanic is not implied. A deferred/no-new-rule decision leaves
  this plan's existing-vocabulary campaign viable.
- Keep equal-Power wins, harmless stronger guardians, reusable matching keys, Boots/Leaf traversal gates, complete straight Spring jumps, persistent portal pairs, optional rescues, and deterministic content.
- Every new maze passes ordinary zero-rescue and exact-all-rescue solver modes.
- Every reachable valid player state should remain completable where practical; any intentional exception requires a documented fairness proof, short safe recovery, and clear disclosure.
- No required blind choice, hidden irreversible trap, soft lock, resource grind, or fact available only in transient story copy.
- Absolute authored dimensions remain at or below 24×24, but the normal authored
  range is at most 16 tiles on either axis. Across the final 24 chapters, no more
  than four levels may exceed 16 on either axis, including inherited levels.
  Every exception must be a named set piece with room/spoke variety, event-gap
  and retraversal evidence, and a recorded reason it could not deliver the same
  puzzle at a smaller size. Audit and compact inherited outliers as needed; size
  is not difficulty.
- Every authored or generated level above 16 on either axis contains at least
  two recognisable open rooms with meaningful optional or functional content,
  plus a hub, spoke, loop, garden or puzzle-chamber relationship. Avoid
  consecutive large authored chapters unless a documented pacing reason and a
  successful family test support the adjacency.
- Event gaps should normally remain at or below 24 directional inputs, and neutral retraversal should normally remain at or below 15%. A gap of 25–30 inputs requires a named design reason and targeted evidence; anything above 30 requires redesign or an explicit successful family-tested exception.
- Never allow more than two corridor-dominant/traditional mazes consecutively.
  Deliberately alternate room puzzles, hubs, loops, spokes, portal islands,
  compact teaching/application spaces and occasional labyrinths. A long winding
  route must open into meaningful rooms or events rather than repeat empty bends.
- A **true terminal branch** is a graph branch whose traversable route ends and
  offers no onward route except backtracking; multiple terminal cells in one
  open room count as one branch. Every such branch contains a small optional
  collectible: Gold, Science, a chest/bag resolving to one of those currencies,
  or another explicitly approved optional collectible that is durably credited
  and visibly cleared. A required clue/tool, friend, guardian, shortcut, joke or
  vista may coexist but never displaces that collectible. All optional Gold,
  Science, chest, bag and equivalent treasure markers are deliberately absent
  from the minimap so cleared dead ends remain an intuitive memory aid instead
  of marker noise.
- Give Amelia enough enjoyable combat without turning progress into grind:
  include optional rooms with low-Power enemies, vary single/themed/mixed
  encounters, and ensure required combat remains purposeful and fairly powered.
- Introduce each genuinely new rule through a compact first-use teaching pocket:
  pose the question, keep its visible answer within one stable 6×6 view or a
  documented equally legible composition, then make first successful use
  reachable within 12 directional inputs. Skilled players can solve it
  immediately without a forced modal. Phase 0 may replace either threshold only
  with a measured, documented equivalent supported by family evidence.
  Every pocket also contains one real choice, one clearly optional friend or
  reward branch, an appealing story/visual beat and a satisfying ordinary route,
  and communicates identically across keyboard, pointer, touch, on-screen and
  controller input with non-reading, non-colour, reduced/static equivalents.
  Reuse the equipment-family pattern rather than adding a separate tutorial for
  every boot.
- Optional rescue or curiosity branches should feel meaningful without implying ordinary completion is inadequate.
- Each maze uses final assets/effects intelligently and preserves non-colour, non-motion, reduced/static, controller, and accessible equivalents.
- Freeze an exhaustive typed gameplay-content eligibility registry (expected
  `src/game/contentRoster.ts`) keyed by stable type-level `EnemyStyle` /
  `AnimalSpecies` identities (or explicitly renamed, versioned final equivalents). It owns campaign
  and generated eligibility, encounter-family tags, and exclusion reasons/gates;
  do not overload the art catalogue's `active`, `dormant`, `deprecated` or
  `superseded` runtime-file lifecycle or invent `campaign-reserved` as an art
  status.
- Keep authored object-instance identity separate: each encounter, rescue and
  cameo has its own level-scoped semantic `LevelObject.id` and coordinate. Adding
  or reordering a placement cannot renumber a roster type. Each approved Mimic
  family uses a stable disguised-object family identity rather than an ordinary
  enemy-style record.
- Treat every final Human-approved gameplay enemy identity and rescue-and-
  collect friend species as eligible by default. Any exclusion requires an
  explicit Human deferral, reason, owner and return gate. If the roster cannot
  fit the debut-density limits, stop for a roster/pacing decision rather than
  silently marking inconvenient content ineligible.
- Every final enemy type marked campaign-eligible in that registry receives
  meaningful authored interactive use and a readable appearance before the late
  all-roster showcase. Every campaign-eligible rescue-and-collect friend species
  appears as at least one fixed authored rescue. “Every asset” never means every
  resolution, frame, rejected candidate or superseded file.
- Story-maze enemy, friend and environment selections are authored, stable and
  versioned; they never reroll on load or replay. Surprise Maze variety is
  deterministic, versioned and isolated from topology/rules randomness.
- Every authored level has one fixed `EnvironmentManifest`: a required base/
  default complete recipe plus one to four complete named region assignments. A
  single-region level assigns its sole region the base recipe. Distinct portal-
  linked or spatially separated regions may use different intentional recipes
  through the landed Plan-04 region seam; empty manifests, more than four regions,
  per-tile random skins and incompatible floor/wall pairs are forbidden.
- One resolved level-wide light source/profile governs every region and scene
  cue. Region theming must not create conflicting per-region light directions.
- No copyrighted reference is copied. All new story, layouts, names, combinations, and presentation are original to Puzzlewild.
- Before final chapter scripting, produce a cast disposition covering every
  current and proposed story character: retain, refine, replace, or add, with a
  distinct narrative/teaching/comic function and any downstream art need. Then
  implement the accepted chapter interludes through Plan 01's story shell.
  Ordinary sequences stay at two or three concise turns, may give Ame a reply,
  and remain quickly advanceable, skippable, replayable, input-parity and
  non-blocking. Do not generate or ship voice acting here.

## 4. Canonical 24-chapter order

Insertions are anchored after stable existing level IDs. Their provisional IDs and names may be refined during the Phase-0 final audit, but their positions and learning roles are adopted unless current integrated evidence demands a documented change.

| Final slot | Entry | Status / anchor | Campaign role |
|---:|---|---|---|
| 1 | `little-star-trail` | Existing | Movement, goal, optional kindness. |
| 2 | `shiny-sword` | Existing | Weapon, Power comparison, key/door, camera introduction. |
| 3 | `poggle-pocket-map` — **Poggle's Pocket Map** | **New; after `shiny-sword`** | Supported minimap/landmark application and short weapon/key recall. |
| 4 | `splashy-boots` | Existing | Plan/return, Power growth, Boots/water. |
| 5 | `rainbow-picnic` | Existing | Sorting paired requirements. |
| 6 | `toasty-toes` | Existing | Cause/effect and lava transfer. |
| 7 | `moonbeam-moat` | Existing | Decompose a three-lock task. |
| 8 | `starcake-switchback` — **Starcake Switchback** | **New; after `moonbeam-moat`** | Celebratory key/hazard consolidation with a meaningful order choice and treasure surprise. |
| 9 | `wishing-woods` | Existing | Persistence and a voluntary stronger-guardian return. |
| 10 | `ames-grand-parade` | Existing | Track a changing multi-part plan. |
| 11 | `springstep-sky-hollow` | Existing | Predict complete Spring-jump landings. |
| 12 | `cloudberry-bounce-garden` — **Cloudberry Bounce Garden** | **New; after `springstep-sky-hollow`** | Compact Spring-Boots transfer with varied, visible landing consequences. |
| 13 | `lanternlight-labyrinth` | Existing | Room/landmark exploration and map modelling. |
| 14 | `twilight-treasure-loop` | Existing | Relevant clue versus delightful optional discovery. |
| 15 | `moonlit-friendship-quest` | Existing | Poison/Leaf observation and combined recall. |
| 16 | `glowleaf-moon-garden` — **Glowleaf Moon Garden** | **New; after `moonlit-friendship-quest`** | Poison/Leaf recall and mixed-traversal bridge before portals. |
| 17 | `rose-heart-roundabout` | Existing | Introduce paired portals. |
| 18 | `clover-comeback-carnival` | Existing | Revise a plan across portal gardens. |
| 19 | `friendship-crown-vault` | Existing | Combine portal pairs and established tools. |
| 20 | `rainbow-power-parade` | Existing former finale | Restore the Star Map through a fair Power-sequence mastery puzzle. |
| 21 | `tiny-rainbow-homecoming` — **Tiny Rainbow Homecoming** | **New, appended** | Post-finale victory-lap/decompression with multiple valid routes and a tiny-rainbow consequence. |
| 22 | `somewhere-else-island` — **Somewhere Else Island** | **New, appended** | Poggle's “Useful for Somewhere Else” map; compact portal-hub revision puzzle. |
| 23 | `starlight-observatory` — **Starlight Observatory** | **New, appended** | Constellation/science theme, mixed inference, and rich optional discovery; Science is not spent or required. |
| 24 | `wishlight-festival` — **Wishlight Festival** | **New, appended** | Joyful complete-vocabulary capstone with several valid orderings, earned shortcuts, optional mastery branches, and the largest celebration. |

Names are original working titles. Final IDs, once any durable test/save artifact ships, are immutable.

## 5. New-level design briefs

Initial budgets are hypotheses to validate through the final metric tool and playtesting. Directional inputs include stationary interactions where the predecessor spec distinguishes them from movement steps.

| Slot | Size / ordinary-input starting band | Puzzle and education | Signature wonder / humour / replay | Asset and presentation opportunity |
|---:|---|---|---|---|
| 3 | 9–11 square; 25–45 | Use a revealed landmark and minimap to choose between two short routes; recall weapon/key relation without adding a rule. | The Pocket Map comically points to itself, then a discovered shortcut makes the map visibly “right.” Replay offers rescue versus shortest route. | Quiet bright theme, early friend pair, literal map flourish, small Poggle reaction, restrained first map-discovery cue. |
| 8 | 13–15 square; 55–90 | Sort two or three known requirements and choose a useful order around a readable hub. | A tempting star-cake/treasure branch is genuinely optional; its route later reconnects through an existing key/door or changed-state shortcut, while the treasure remains only a reward rather than the answer or trigger. | Celebratory terrain, varied key/door art, treasure/SFX spotlight, comedic Sprig payoff, different weapon/enemy/cage family from neighbours. |
| 12 | 13–15 square; 55–95 | Predict several complete Spring-jump landings with different consequences; no mid-air turn and no endurance corridor. | A four-way bounce garden reveals that the same central geometry answers two axes; optional landing produces a friend celebration. | Airy/light theme, clear hole silhouettes, jump VFX/animation showcase, boing sound variation, intentional diagonal authored light. |
| 16 | 14–16 square; 70–115 | Recall Antidote Leaf and mixed traversal, distinguish poison from water/lava, then prepare for portal reasoning through a changed return. | A moon garden appears to repeat until distinct glowleaf landmarks make the safe plan click; optional path reveals a funny nocturnal friend tableau. | Poison static/motion showcase, Leaf pickup, contrasting hazard sound/shape, moonlit material/light, calm pre-portal pacing. |
| 21 | 11–13 square; 45–80 | Decompression: several valid route orders, short callbacks, and a clearly optional perfect route. | Sprig's promised tiny rainbow changes the celebration/mood without undoing the victory. Replay invites an alternate ordering. | Broad friend/weapon/theme variety, warm homecoming music or reserved friendship cue if qualified, gentle rainbow VFX, rich reduced tableau. |
| 22 | 14–16 square; 65–110 | Revise a portal-hub plan when Poggle's map is genuinely for somewhere else; each return should change available understanding or access. | The map's “mistake” becomes the solution. At least one portal relationship is inferable before use and satisfying after. | Portal-family showcase, Poggle expressions, distinct hub landmarks, controlled effect flavors and controller-friendly focus/Hint. |
| 23 | 15–16 square; 80–125 | Use relevant clues and constellation-like spatial relationships across known tools. Science is thematic recognition only, never a price or gate. | Optional discoveries illuminate a visual constellation/observatory display while the ordinary route remains complete. | Science treasures, night/crystal materials, light-angle composition, music contrast, optional VFX constellation payoff with static equivalent. |
| 24 | 17–19 square; 110–170 | Complete-vocabulary capstone with 3–4 meaningful route orders, visible prerequisites, earned shortcuts, and a fair final synthesis. | The player can explain several plans, choose one, see the world respond, and receive a character-led festival finale. Perfect rescue is an optional mastery route. | Readable all-enemy festival split across rooms/spokes after every type has already debuted; no more than twelve interactive guardians, with the remaining roster as non-colliding festival cameos rather than solver-visible enemies; complete coverage without a compulsory gauntlet or motif soup; final Ame/friend/emotion frames, one authored light, full VFX/audio tier, controller couch readability. |

## 6. Per-level required design packet

Before implementing each new map—or materially revising an inherited map—create
a compact design packet in the gameplay/campaign spec or a generated review
artifact containing:

1. Stable ID, content revision, insertion anchor, dimensions, story role, Puzzle Power, and one-sentence puzzle intent.
2. A route sketch showing start, exit, required gates/answers, changed-state
   shortcuts, optional rescue/reward/battle rooms, every graph-level true
   terminal branch and its separate optional collectible, room-versus-corridor
   rhythm, and major first reveals.
3. Mechanic lifecycle: question, visible/supported answer, short first application,
   unaided recall, combination/mastery, skilled-player bypass, why a separate
   tutorial chapter is or is not needed, and measured proof of the stable-6×6/
   12-input first-use contract or the Phase-0-approved equivalent.
4. Ordinary zero-rescue and exact-perfect route summaries replayed through the engine.
5. Reasoning score, friction score, event gap, effective decisions, search expansion, prerequisite depth, false leads, total/neutral retraversal, clue lead, and per-rescue marginal cost.
6. Legible-solvability proof: required clues, progressive Hint route, recovery from representative and exhaustive reachable states where feasible, and any fairness exception.
7. Experience beat: signature surprise, aha, joke, optional curiosity, emotional
   reward, healthy replay reason, and an encounter ledger recording required and
   optional encounter counts, route spacing, intended Power chain, and any
   optional low-Power battle room.
8. Final catalogue plan: fixed environment recipe and any named visual-region
   map; weapon; enemy ensemble and any first-debut staging; fixed friend species;
   cages, treasure, hazards, portal pairs, authored lighting, VFX flavors,
   animation/emotions, SFX, and music.
9. Static/reduced-motion and non-colour alternatives.
10. A minimap disclosure list proving every optional Gold/Science/chest/bag or
    equivalent treasure marker remains quiet while required navigation markers
    remain useful.
11. Neighbour comparison proving the chapter is not accidentally near-identical
    in mood, enemy/friend ensemble, material regions, asset family, route grammar,
    or payoff, plus the updated campaign-wide coverage/debut, topology-variety,
    large-level-exception and teaching-pocket ledgers.

Do not approve a map solely from ASCII appearance, route length, or one solver pass.

## 7. Campaign curve and pacing

The 24-level curve should breathe rather than rise monotonically by map size or move count.

- Chapters 1–3 establish movement, rules, map, and landmark confidence.
- Chapters 4–8 turn familiar tools into short planning/sorting loops and a celebratory consolidation.
- Chapters 9–12 develop perseverance, tracking, and precise Spring-jump prediction.
- Chapters 13–16 deepen map reasoning, clue relevance, poison observation, and mixed-rule recall.
- Chapters 17–20 teach, practise, combine, and master portals/Power sequencing.
- Chapters 21–24 decompress, reopen curiosity, then build toward a sophisticated but fair encore capstone.

Use difficulty alternation: a demanding chapter should often be followed by a shorter playful transfer or discovery chapter. Later difficulty increases decisions, prerequisite relationships, order flexibility, and synthesis. Do not increase every dimension at once.

Treat the final campaign as a portfolio of spatial forms, not twenty-four skins
on the same maze grammar. No more than two corridor-dominant chapters may be
adjacent. Across each four-chapter band, include at least two materially distinct
forms such as a compact puzzle room, hub-and-spoke, loop/roundabout, portal
islands, branching rooms, open tableau or true labyrinth. Re-audit all sixteen
existing levels as well as the new eight. In particular, if
`rainbow-power-parade` still reads as a single snaking corridor in the integrated
build, rebuild its topology under a content revision while preserving its stable
identity, victory role and migration guarantees.

Use battles as delightful punctuation. Phase 0 freezes an exact campaign
encounter ledger; its starting contract is that at least four of the eight new
chapters include an optional low-Power battle room or side encounter. A lower
quota requires documented family pacing evidence rather than the word
“suitable.” No optional fight gates the ordinary route or creates a levelling
grind. Balance battles with quiet planning intervals, and ensure a player never
follows a long chain of turns or reaches a terminal branch without a meaningful
event or discovery.

Every chapter must include one quiet-enough planning interval around its important clue and one release/payoff. Avoid placing maximum visual effect, dense objective text, new rule, five rescue choices, and complicated map topology in the same first reveal.

### 7.1 Author the child's discovery, then prove the route

Consume the Human's 2026-09-05 quality reaffirmation in the vision. Name the
reasoning opportunity and where a later chapter recombines it, so progress
invites transfer rather than memorizing an answer. Compare play in Plan 08's
default/close/wide camera views without changing clues, reveal or legal routes.

Add these concise fields to the existing 24-row learning/ecology matrix and
per-level packet, not to a parallel design ledger:

- **Question:** what can the player see that invites a plan? Describe the scene,
  not an adult's explanation of it.
- **Inference:** what relationship can the child notice, predict or remember?
  Name one main reasoning demand and distinguish it from walking distance.
- **Information after trying:** what does a plausible unsuccessful attempt teach,
  where is the safe next action, and which Hint tier restores progress?
- **Payoff:** how does ordinary completion acknowledge that understanding, and
  what distinct optional discovery rewards curiosity without grading it?
- **Rhythm:** quiet observation → choice/attempt → readable consequence → relief.
  Record a likely natural stopping point and the neighbouring chapter's contrast.

Review at least one plausible wrong turn, answer-first route, optional-branch
skip and return after interruption for every new or materially revised level.
A solver-perfect optimum alone does not demonstrate these experiences. Required
clues remain inspectable in the current world or existing Help/Hint surfaces;
no new objective may rely on remembered dialogue or on catching a camera pan.
Measure travel in the accepted smooth-motion build as well as directional
inputs: record continuous held traversal, camera-edge/portal transitions and
time spent merely returning. Faster rendering cannot excuse empty walking.

Use the eight briefs as a small palette of authored moments: a familiar landmark
becoming useful from the other side, a previously blocked short loop opening,
a readable landing prediction paying off, or a returning friend in a surprising
habitat. These are composition options using established rules and approved
assets. They do not authorize a new landmark system, ability, quest, cutscene,
collectible or character. Any such proposal returns through the existing Human
scope gate; XP, sprinting, wall hopping, sticker books and voices remain Plan 14.

### 7.2 Formative evidence that improves the design

Use brief sessions with a willing stopping point. Cover each new/revised map
across the programme without asking Ame to play all 24 in one sitting. Start
with the inherited first-use lesson and a compact changed-state/portal example;
resolve their largest clarity or comfort failure before producing many maps
with the same pattern. Preserve the fixed four-insert/four-append order unless
the established placement decision gate records a justified change.

Record raw attempts and the kind of support given: unaided exploration,
requested Hint tier, parent question, navigation instruction or adult takeover.
Parent co-play is a valid experience; it cannot also count as independent
discovery evidence. PT19's percentage targets are directional hypotheses until
the sample is meaningful; report numerators, denominators and observations for
small family cohorts, with no invented general-child success claim. A repeated
blocked inference or discomfort returns the smallest affected packet for
revision, even when aggregate solver or completion metrics pass.

### 7.3 Meaningful challenge rather than an obvious delivery route (PT42)

The Human's v0.20.1 observation is that improved rooms and variety still too often
leave a single obvious route with every required tool lying along it. Audit all
sixteen inherited chapters as well as the eight additions for that specific
failure. A branching floor plan alone is not proof of a puzzle.

For every post-tutorial teaching/application/mastery packet, identify the actual
decision, at least one plausible alternative, the visible evidence that helps
the player choose, and the consequence or new information after trying. Count
prerequisite-order choices, purposeful revisits, route comparisons, landing
predictions and combined rules; do not count empty dead ends, repetitive
blocker collisions, longer walking or a key placed directly before its door as
additional reasoning. Deliberate decompression/celebration chapters may be easy,
but must be labelled in the pacing ledger rather than disguised as mastery.

Phase 0 freezes a per-band decision/combination rubric and representative Easy,
Medium and Hard generated packets before mass production. Medium and Hard need
meaningfully different reasoning demands using the learned rule vocabulary;
extra size, guardian count or travel time alone cannot raise a difficulty label.
Prove ordinary and perfect routes, then observe whether a player can form and
revise a plan, make progress after a safe mistake and feel a satisfying payoff.
Perseverance should resolve an understandable question, with the existing Hint
ladder available; guessing, grinding and adult explanation are not substitutes.

### 7.4 Monster and treasure rooms and mazes (PT43)

Extend PT11/12/24/42's single campaign/ecology ledger with deliberate room and
whole-maze profiles. Deliver all four Human-requested forms through the existing
24-chapter portfolio and new Surprise generation version. Recompose inherited
or proposed chapters where appropriate; this is not an instruction to add four
more campaign slots or a separate arena mode.

| Form | Intended experience | What makes it more than increased object density |
| --- | --- | --- |
| Monster room | A compact, legible guardian encounter with a useful choice and enjoyable payoff. | Position, Power information, optional approach/return and a coherent cast create a small planning moment. |
| Treasure room | The pleasure of finding an inviting cache or reward nook. | The approach, discovery and optional branching give the reward a reason to be there; the contents are not the required solution. |
| Monster maze | A whole chapter/Surprise result whose main rhythm is guardian-led planning and satisfying encounters. | Distinct rooms, attainable-Power order choices, purposeful required encounters where appropriate, optional battles and quiet intervals replace a kill-all corridor. |
| Treasure maze | A whole chapter/Surprise result about branching discovery and rewarding exploration. | Landmarks, loops, optional caches and a coherent exploration question vary the route; an ordinary exit remains available without collecting every treasure. |

Phase 0 names authored examples of each form and freezes the generated-profile
coverage/weights. Room profiles may coexist in a maze, but an occasional chest
inside a normal chapter does not qualify as a treasure-led whole maze. Record
the intended decisions, ordinary/perfect routes, discovery/reward rhythm,
required/optional encounter count, Power supply and distinguishing family
feedback. Preserve normal mixed/quiet chapters and difficulty alternation.

Monster rooms/mazes retain equal-Power wins, harmless stronger guardians and
safe return. No new arena lock, all-enemies-defeated exit condition, compulsory
random reward, resource farming or repetitive gauntlet is introduced. Treasure
remains optional, rewards use the accepted table/version, and every Mimic passes
PT22's required/optional and joint-outcome proof. Respect current actor-density,
room size, event-gap, minimap-disclosure and solver-budget limits rather than
creating an exception merely because the label is Monster or Treasure.

Keep room/maze profile separate from topology family, environment theme and
Easy/Medium/Hard. A monster maze need not be Hard; a treasure maze can ask an
interesting question. Generated profile selection and resulting placements,
Power and reward data are gameplay content, with deterministic versioned streams
and fingerprint identity; they are not presentation-only skins. Cover every
feasible profile/difficulty/topology combination across declared seeds, with
explicit reasons for infeasible combinations and no silent profile fallback.
Audit reward totals and repeated-shower audio/visual performance, then give
Plan 10 the actual resulting Science supply before its Egg-cadence decision.

### 7.5 Intuitive mechanics exploration before dependent map freeze (PT44)

Run a bounded design comparison now in Phase 0, not after finishing all maps.
The Human wants deeper, intuitive fun without annoyance or confusion. Start by
showing what stronger combinations of current keys, Power, portals and traversal
can achieve; compare a small set of materially different new-rule hypotheses.
Do not assume adding a rule is inherently better than composing existing ones.

The following are starting hypotheses, **not approved mechanics**:

| Candidate | Intuitive promise and later puzzle opportunity | Main cost or reason to reject |
| --- | --- | --- |
| Existing-rule composition | A visible gate/portal/Power relationship makes choosing an order satisfying without another rule to learn. | Reject the particular layout if it is still an automatic item-delivery chain; use this as the no-new-mechanic comparison. |
| Clearly paired reversible switch and gate | One deliberate action changes an unmistakably linked gate; later choices compare open routes. | Adds switch state, remote-cause explanation and reachability cases. Reject hidden/offscreen-only feedback, required timers or trapping reversals. |
| One movable object with safe undo | Push a plainly pushable object to make a short route relationship click. | Adds position/search state, collision and undo persistence. Reject tedious reset loops, ambiguous push rules or accidental permanent traps. |
| Short predictable ice slide | A visible slide-to-stop rule supports a satisfying landing prediction. | Reopens the still-undecided PT14 proposal; requires a separate traversal/solver/control contract. Reject precision timing, hidden stops or frustrating overshoot. |

The root may refine or replace these hypotheses during the comparison. For each
candidate, provide one compact teaching pocket, one later combination, a likely
wrong guess and its safe recovery, the expected fun/learning benefit, and a
concrete rejection signal. Use paper layouts, state diagrams or static mockups
first. Assess action vocabulary, clue visibility, non-reading/non-colour and
reduced/static communication, touch/controller intent, engine state growth,
solver/Hint cost, deterministic seeds, saves/rollback, art/VFX and performance.
Avoid mandatory reaction timing or extra repeated inputs masquerading as depth.

Present a small shortlist with an explicit existing-rules-only option for the
Human's accept/defer/reject decision. Selection is not proof of play quality: a
new rule needs a separately scoped approved specification, implementation owner,
bounded prototype/qualification and learning evidence before dependent campaign
adoption. Name any earlier rendering, controls or persistence contract that must
be requalified. Keep unaffected design work moving, but do not freeze or produce
many maps around an undecided mechanic. Preserve chapter IDs and the approved
24-slot structure unless the existing order/role decision gate changes them.

Record every disposition and rationale in this plan's design packet. Explicitly
deferred ideas may return in Plan 14 against the final game's evidence. PT14
spikes/ice, friend powers, persistent XP and other new systems do not become
approved because this comparison mentions them; do not defer the entire PT44
exploration to the late opportunity review instead.

## 8. Narrative and educational expansion

Update the Story Bible from 16 to 24 entries after the PT30 cast disposition.
The historical two-paragraph, one-speaker cards are the source material, not a
parallel mandatory runtime format. Use Plan 01's accepted story host:

- ordinarily two or three concise dialogue turns across roughly 35–80 words
  total where practical; a useful shorter exchange is welcome;
- one small character disagreement, surprise or joke that serves the chapter;
  Ame may notice, reply or revise a thought instead of always receiving a lecture;
- one plainly named Puzzle Power and optional child/adult `tryThis` prompt,
  available without becoming another required screen or spoken-answer test; and
- one warm victory outro that remains truthful with zero optional rescues,
  skipped treasure or Hint use. Claim specific rescues only from committed
  results; generic “all five friends came home” text is wrong on an ordinary run.

Longer interludes require the existing named story reason and Human approval.
Advance is one fresh action per turn; Skip exits the whole exchange; replay
changes neither rewards nor maze state. Preserve the accepted Continue/resume
policy so interruption does not replay compulsory story. No auto-advance timer,
reading test, new voice-production dependency or story-only clue is introduced.

The cast review preserves the approved visual identities and asks what each
speaker contributes: Poggle can model correction without shame, Sprig can voice
a tempting first guess, and Ame can supply the observation that moves play
forward. These are existing-character functions, not replacement-art briefs.
New cast proposals must name an unmet function and their art/copy/loading cost
before Human review; one good exchange with the current cast is sufficient.

Renumber all existing entries from canonical order or derive display numbering so it cannot drift. Preserve each existing chapter's emotional meaning while updating transitions where an insertion changes adjacency.

The current `rainbow-power-parade` conclusion remains a real victory: the Star Map becomes whole. Its revised outro may reveal a gentle new possibility—a path of tiny rainbow light continuing beyond the map—but must not say the restoration failed or add another “last knot.”

Chapters 21–24 form an **Elsewhere Encore**:

1. celebrate the restored Puzzlewild;
2. discover that Poggle's “Useful for Somewhere Else” map is useful after all;
3. explore an observatory/constellation theme that honours curiosity without spending Science; and
4. host a Wishlight Festival whose final challenge demonstrates Ame's full Pathkeeper confidence.

Future-hook weather ideas may appear as story dressing or VFX only. Do not introduce ice, wind-arrow, cloud-bridge, or friend-ability engine mechanics without a separate approved spec and solver design.

## 9. Persistence, unlock, and returning-player migration

Campaign expansion must be ID- and revision-based.

### Fresh profiles

- Unlock from Chapter 1 in canonical order.
- Each normal authored completion unlocks the next canonical entry under the shared campaign-order contract.
- Continue chooses the appropriate earliest/current next story entry without a hard-coded campaign count.

### Existing partial profiles

- Preserve every existing completion, best record, perfect flag, rescue record, achievement, currency, species total, and active run by stable ID/revision rules.
- Preserve access to every original level already unlocked before migration.
- Unlock an inserted level when its stable predecessor anchor was completed or already passed under the historical order; never relock a previously available original level behind it.
- Make newly inserted entries visible as new rather than falsely completed.
- Resume a valid active run first. Otherwise preserve the profile's pre-migration next original chapter as Continue, and keep advancing through its already-reached historical arc rather than unexpectedly sending the family backwards to an insertion.
- Passed-anchor insertions remain unlocked, visibly New side adventures in Select/Book and never block that returning profile's original forward progression. After the former finale is completed, Continue flows to Chapter 21; the player may choose an inserted adventure at any time.

### Existing profiles that completed the former 16-level campaign

- Unlock all four inserted adventures and Chapter 21 immediately.
- Prefer Continue into Chapter 21 so the player's completed finale flows forward; mark the four inserted entries as clearly available new adventures in Maze Select/Book.
- Chapters 22–24 unlock normally from the encore arc.
- Preserve the old finale completion and all perfect/achievement records; do not manufacture completion for new IDs.

Add migration tests for every historical schema/order, fresh/partial/full completion, record-less legacy saves, inconsistent ordinal data, active run on every original region of the campaign, tester runs, and rollback. Version rollback must fail safe without reinterpreting one level/object as another.

Audit achievement meaning. Preserve existing badge IDs and earned state. If a “20 mazes” achievement changes from mixed activity to story-only reachability, document and approve the new description. Add a 24-chapter recognition only if the final art/reward system can do so coherently without pressure or an improvised placeholder.

## 10. Intelligent asset, sound, and effect use

The expansion should primarily showcase the final catalogue rather than demand eight bespoke asset sets.

- Generate a machine-readable 24-row ecology/adjacency report for environment
  recipe and regions, weapon, enemy debut/ensemble/Power role, cage, fixed friend
  species, treasure/pickup, hazard combination, portal use, light bearing, VFX
  flavor, music, and signature presentation.
- Reconcile the report against the frozen typed gameplay-content registry and
  Plan 03's final integration manifest. Every campaign-eligible enemy/friend and
  every other gameplay-facing family—weapon, cage, key/door, portal, treasure/
  Science pickup, traversal item, hazard, environment recipe and dressing—must
  be used meaningfully or receive an owner, reason and review gate. Keep content
  eligibility distinct from art-file lifecycle. Do not count a fallback image,
  source master, optical derivative or unreachable object as use.
- Avoid accidental same-family repetition in consecutive levels unless it is an
  intentional teaching comparison. Never place an asset solely to satisfy a
  number when it damages clarity, tone or pacing; redesign the ensemble or record
  a Human-reviewed exception instead of creating clutter.
- Select music by pacing and emotional arc. Do not reuse the same track in an authored fixed pattern if the current music system intentionally shuffles; instead specify mood pools/cues within its final contract.
- Use the final animation tranche for authored emotional beats only where a registered pose exists. Unknown content falls back gracefully to static art.
- Treat the reserved friendship cue deliberately: qualify it for a fitting
  homecoming/rescue moment, retain it with a reviewed reservation, or classify it
  as a Plan-12 candidate through the final audio/performance decision; do not
  drift between “reserved” and “orphan” or remove it in this plan.
- Add a source/provenance record for any genuinely new art/audio. Do not create runtime-only assets.

### 10.1 Progressive authored guardian ecology

- Begin with a small recognisable enemy vocabulary and widen it like a friendly
  JRPG bestiary. After the first combat lesson, a normal chapter introduces no
  more than two unseen enemy types. Its first encounter leaves enough visual and
  cognitive space to read the silhouette, name and Power before mixing it into a
  dense room or a simultaneous new-rule lesson.
- Give every eligible type at least one spotlight or small-ensemble appearance
  outside the all-roster level. All types debut by Chapter 23. Record debut,
  repeat, required/optional role, Power tier and screen-density exposure.
- Mix composition modes across the arc: quiet single-family encounters, tightly
  themed ensembles, and broader mixed casts. Use final Chapter 13,
  `lanternlight-labyrinth`, as the preferred skeleton-and-lizard ruin/guard
  ensemble because its established Lantern Ruins and monster-room structure
  already support that cast; change only if the neighbour/pacing audit records a
  stronger reason.
- Use Chapter 24's Wishlight Festival as the preferred every-enemy showcase.
  Divide the roster across distinct rooms, spokes or successive reveals. Use no
  more than twelve interactive guardians; represent every remaining type with a
  dedicated non-colliding presentational cameo that is not an `EnemyObject` and
  never enters collision, combat, reachability, solver state or route Power
  accounting. Normally cap all visible enemy actors at six in the 6×6 camera;
  any higher bounded tableau needs measured readability, decode and frame-time
  evidence. Keep many fights optional and ensure ordinary completion is a puzzle
  route rather than a compulsory bestiary gauntlet. Cameo metadata must keep
  solver state proportional to interactive guardians. Preload the next festival
  room/reveal rather than eagerly decoding the whole roster if the measured
  all-at-once path misses the level-entry or retained-memory budget.
- Enemy art/personality changes presentation only. It cannot alter reach,
  damage, movement or the universal Power comparison without a separate approved
  mechanic and new solver contract.
- Implement the approved Mimic families under routed backlog item PT22, not as
  cosmetic `EnemyStyle` entries. Create one versioned family mapping—covering
  Treasure and Candy when both pass Plan 03—from stable family ID to closed,
  good-open and revealed-enemy art IDs. Every family uses the same disguised-
  chest gameplay object and a committed seeded outcome under the versioned
  designer policy below; no permitted outcome may make an ordinary or perfect
  route unsolvable.
  Migrate `twilight-treasure-loop`'s current always-visible Candy Mimic under a
  content revision, preserving durable progress and retaining historical
  generator/content-version reconstruction. If a required presentation/save
  contract has not landed, return it to its owner or obtain explicit Human
  deferral; do not silently exclude a family, substitute an always-visible
  guardian to make coverage pass, or use art lifecycle as mechanic readiness.

#### Designer-owned Mimic safety and reward policy (PT22, 2026-09-05)

This section prospectively supersedes the mandatory 65/35 requirement for new
Plan-09 content. `REWARD_RULES_VERSION = 1`, its exact buckets/tables and any
historical content reconstruction remain pinned and tested. Introduce a new
version for configurable outcomes, power and improved defeat loot; do not edit
old saved receipts or silently reinterpret an existing seed/object identity.
Update the maintained gameplay specification when this new contract lands.

- Each authored encounter declares its stable identity, family, outcome policy,
  bounded Mimic probability, Power policy and reward-table version. A guaranteed
  good chest is a legitimate author choice, including on a required path. A
  fixed probability may remain a documented default, but never constrains every
  placement. Invalid policies fail validation instead of silently clamping.
- Resolve outcome, Power and reward once from isolated deterministic channels
  no later than first legal contact. Freeze the receipt across retry, leave/
  return, presentation cancellation and supported save/resume. Do not rescale a
  revealed Mimic every time Ame returns or let VFX/animation draw gameplay RNG.
- A required-path Mimic is permitted only with an engine-replayed proof that
  Ame can attain sufficient Power before crossing it, without using its own
  reward or an item behind it. Otherwise author a guaranteed-good chest or move
  the encounter. Preserve the existing equal-Power-wins rule: “strong enough”
  means Ame's Power is at least the Mimic's, not a new strict-greater rule.
- An optional Mimic may initially be stronger than Ame when a readable, safe
  return route reaches sufficient attainable Power elsewhere. Prove that route
  with the encounter unresolved, not from a sum of all items in the map. A
  nominally optional chest cannot trap a required key or an exact-perfect
  rescue. Joint outcome combinations must remain safe, including mutually
  dependent encounters; independent one-chest tests are insufficient.
- Every defeated Mimic grants a guaranteed richer reward than its declared
  ordinary-chest comparator, within a new bounded table. Phase 0 names that
  comparator and an auditable same-currency or explicitly defined mixed-reward
  guarantee, including the minimum roll; larger particles alone do not qualify.
  Audit campaign totals and later Plan-10 Science supply before freezing values.
  Ordinary enemy drops do not become the Mimic defeat table by accident.
- Commit object resolution and the complete reward exactly once before the
  corresponding presentation starts. A benign chest credits on its accepted
  resolution; Mimic defeat loot credits only after actual victory. Revealing an
  underpowered Mimic commits its identity/Power/outcome, never unearned loot.
  Consume Plan 02's bounded large reveal and loot shower,
  with Gold and Science travelling toward the moving collector after play
  resumes. Particle arrival, cancellation, off-camera travel and repeated input
  never award extra currency or delay an already committed award. XP crystals
  remain a Plan-14 option requiring a separately approved progression system.

Boundary fixtures cover guaranteed-good, guaranteed-Mimic and mixed policies;
probability boundaries; underpowered first contact and later return; required
and optional placements; all permitted joint outcomes; richer minimum rewards;
receipt persistence; and unchanged v1 reconstruction. Generated Mimics retain
the at-most-one, optional-slot constraint unless a later explicit decision
changes that separate scope rule.

### 10.2 Authored rescue ecology

- Starting authority is the post-v0.20.1 sixteen-maze curve in
  `GAMEPLAY_DESIGN_SPEC.md`: it already provides a Solo-accessible authored
  rescue for every one of the 32 active species, with Rainbow-Horn Unicorn in
  Maze 1 and Tea-Time Skeleton in Maze 2. Treat that as achieved coverage, not
  work to defer. The 24-maze pass may redistribute later introductions around
  inserted chapters for better pacing and habitats, but must preserve both
  opening placements unless the Human explicitly changes them and must never
  reduce complete authored coverage.
- Assign each final rescue-and-collect species to at least one fixed authored
  cage/object across the 24 levels, using stable semantic IDs and content
  revisions. No campaign friend selection uses runtime randomness.
- Reconcile this list against Plan 03's final approved catalogue and explicitly
  verify that the Human-requested unicorn is included under that catalogue's
  published name/species ID; do not invent a second identity before publication.
- Let early chapters establish familiar animals, then introduce mythic/yokai/
  fantasy/Greek/Roman friends gradually in appropriate habitats and story beats.
  Use some coherent groups (water, woodland, sky, ruins, festival) and some
  deliberately surprising mixed groups so theming does not become predictable.
- Keep all rescues optional. Coverage is checked in the exact-perfect route, not
  smuggled into Required Path or ordinary completion. Plan 10's Garden/Egg system
  consumes this complete rescue roster and may never become the only route to a
  species.

#### Original cute and spooky additions (PT41, 2026-09-05)

Prepare a small, bounded cast proposal before final roster freeze, responding
to the Human's affection for Tea-Time Skeleton and for unusual old-JRPG and
historical charm. New friends should be welcoming, funny or gently mysterious;
each needs a distinct silhouette, personality, habitat and encounter/lore role,
not merely a recolour or an extra checklist entry. Homages draw on broad moods,
folklore/history and playful situations; names, designs, sprites and lore are
original to Puzzlewild. References such as Madou Monogatari are taste direction,
not instructions to reproduce another game's characters or presentation.

Present the proposed identities, scope, art needs and intended authored rescue
placements for Human selection before producing new art. A wishlist request
does not approve an invented species list. Preserve the achieved 32-species
coverage and the opening Unicorn/Skeleton placements. Derive all totals from
the eventual approved stable-ID roster; neither cap it at 32 nor invent a new
fixed count. For selected additions, close approved art/provenance and decode
budgets before placement, then update authored rescue coverage, generated
eligibility, Book lore/encounter consumers and historical content versions.
Plan 10 must re-audit Egg cadence, eligibility and Garden capacity against that
actual final roster before any durable Garden migration.

### 10.3 Fixed authored environments and multi-region places

- Freeze one environment manifest for every chapter. It binds catalogued floor,
  wall and optional dressing/treatment IDs through a required base/default
  complete recipe and one to four complete named region assignments, and becomes
  reviewable level metadata rather than a filename convention or runtime roll.
  A single-region level assigns its sole region the base recipe. A single
  resolved level-wide light source/profile governs every region and compatible
  scene cue.
- For portal islands, quadrants and other strongly separated spaces, author a
  bounded set of two to four named region IDs with complete tile assignment.
  Reject empty, overlapping, uncovered or more-than-four-region manifests. Each
  region uses a prevalidated recipe. Adjacent or portal-linked regions may harmonize or
  intentionally contrast, but must preserve floor-versus-wall, hazard, object
  and character legibility in static/grayscale/CVD proofs.
- Region recipes are visual and world-coordinate anchored; they never affect
  collision, reachability, portals or route metrics. A stable semantic region ID
  may support landmark names and Hint/Direction language, but material/colour is
  never the sole clue. If a region ID or boundary informs a hint, objective or
  story instruction, include that semantic map in the level content revision and
  gameplay fingerprint; keep the recipe assigned to it outside gameplay truth.
  Validate connected-wall texture transitions, camera gutters, portal-destination
  preloading and no flashes/swimming/seams. Group floor/wall geometry by recipe/
  region instead of adding one DOM/SVG node per tile. Deduplicate required URLs
  and load each at most once inside the current plus bounded-imminent neighbouring/
  portal-region dependency closure; never eagerly preload every level region.
  Keep DOM/decode totals inside Plan 07 budgets. Do not add per-region light
  bearings.
- Keep the minimap quiet: topology and semantic markers remain authoritative;
  show a restrained region cue only when a reviewed puzzle actually benefits.

### 10.4 Deterministic Surprise Maze composition

- Add the PT42 player-facing **Easy / Medium / Hard** choice and a separate
  **Surprise me** difficulty toggle through the established shared UI and Plan-08
  action/focus contracts. Use a consistent increasing-shape/count icon grammar
  plus short labels and accessible names; the distinction must be understandable
  without reading or colour alone. Test that interpretation with the Human.
  Surprise me varies the eligible difficulty as well as producing a fresh maze;
  turning it off restores the explicit choice. Do not label existing internal
  `movement / gentle / growing / adventure` tiers as an equivalent UI feature.
- Keep reasoning difficulty separate from map dimensions and from rule
  eligibility. Phase 0 defines a versioned mapping from each requested level of
  challenge to puzzle/decision budgets and the player's learned-rule set. Easy
  remains available to returning players; Hard is not just a longer route.
  Clearly explain any unavailable rule-dependent option rather than silently
  selecting an easier result, and never surprise a new player with an untaught
  required mechanic. Preserve a suitable movement-only onboarding profile.
- Freeze the selected difficulty, eligibility snapshot and generation versions
  for each newly created maze, including Surprise me's deterministic difficulty
  draw in a stream isolated from topology, content, rewards and presentation.
  An existing maze does not change when the preference is edited, replayed or
  inspected. Record the resolved difficulty in debug/feedback reconstruction and
  content identity so the same published identity cannot mean different puzzles.
  Persist only the new preference needed by the agreed UI contract; current
  generated active runs are still not persisted unless separately approved.
- Validate distributions and reasoning packets across every eligible difficulty
  and topology family, including fresh/returning profiles, explicit choices,
  Surprise me on/off, default recovery, keyboard/touch/controller parity and
  historical seed reconstruction. Bounded generation failure must be explained
  and recoverable; it cannot secretly change difficulty to make a test pass.
- Introduce a versioned `TopologyFamilyId` contract with at least three genuinely
  different route grammars: `classic-labyrinth`, `room-and-spoke`, and
  `loop-garden-chamber` (names may change once, before publication). Select the
  family through its own deterministic stream, isolated from dimensions,
  enemies, friends, Mimics, rewards, environment and presentation. Include the
  selected family and algorithm version in the generation fingerprint. Preserve
  historical generated versions and pin representative golden seeds for every
  supported family; distribution, structural, solver, Hint, reachability,
  interest-gap and terminal-reward tests must cover every family rather than one
  showcase seed.
- Replace the current single-global-enemy-style choice with exact versioned
  composition modes. `single-style` repeats one eligible style.
  With `N` enemy slots, `themed-ensemble` uses 2–`min(4,N)` distinct eligible
  styles from one tagged encounter family. `mixed-ensemble` uses two distinct
  styles from two families at `N=2`, or 3–`min(6,N)` distinct styles spanning at
  least two families at `N>=3`. A no-enemy maze makes no composition draw. A
  one-enemy gentle maze is forced to `single-style`; it is not counted as a
  failed themed/mixed sample. Draw only from feasible modes and stable-ID-sorted,
  versioned pools; never silently degrade a selected multi-style mode. Assign
  styles deterministically to existing enemy objects; style does not change
  Power or solvability.
- Choose generated friends deterministically without duplicates within the maze,
  alternating thematic and mixed group recipes across a broad seed cohort. The
  fixed rescue count and optional semantics remain unchanged. Draw from the full
  generated-eligible roster independent of campaign debut order. Because friend
  species participates in gameplay identity and Garden results, pin a separate
  generated-content roster/algorithm version and include resolved species in the
  gameplay fingerprint; do not call friend selection visual-only.
- Keep Mimics outside ordinary enemy composition. Extend the versioned
  `MimicFamilyId` registry (or final canonical equivalent) with explicit
  `generatedEligible` metadata. In the new generated-content version, permit at
  most one disguised Mimic per Surprise Maze, only by assigning a solver-proven
  optional chest/treasure slot; a zero-Mimic result is normal. Select the family
  and commit its versioned designer-policy outcome through deterministic streams isolated from
  topology, required reward placement, ordinary enemy composition and solution
  truth. Freeze the bounded placement frequency in Phase 0 rather than letting
  catalogue size change it implicitly.
- Choose one complete validated environment recipe through the art catalogue.
  Never pair arbitrary floor and wall files, even when both are valid alone.
  Consume Plans 04/02's explicit floor, wall-face, wall-top and overlay roles,
  world-scale treatment and approved harmonious pairings. Review the resulting
  scale against Ame at default/close/wide zoom, including Springstep Sky Hollow;
  two compatible colours cannot justify a floor-looking wall. Regional variety
  must retain those roles, intentional lighting and readable hazards.
- Freeze a generated-size distribution in Phase 0 whose declared seed cohort
  produces at least 90% of mazes at no more than 16 tiles on either axis. Any
  generated result above 16 must use room/hub/open-space grammar, pass the same
  event-gap and terminal-branch-payoff rules as authored levels, and remain under
  the absolute 24×24 cap. Do not equate a larger draw with a harder maze.
- Generate and validate room/event structure as well as topology. Every
  graph-level true terminal branch receives the separate small optional
  collectible defined in section 3; a required clue/tool, friend, enemy,
  shortcut, joke or vista may accompany but never replace it. All optional Gold/
  Science/chest/bag/equivalent treasure remains absent from the minimap. Include
  a bounded optional low-Power
  encounter-room profile in the versioned distribution without forcing every
  generated maze to contain combat.
- Use presentation-selection streams isolated from topology, objects, Power,
  rewards and solutions. Pin topology/rules, generated-content and presentation-
  roster versions so additions/reordering cannot reinterpret historical golden
  seeds, records or debug reconstruction. Generated active runs are currently
  not persisted; do not invent a save/resume migration promise for them.
- Add distribution tests over declared seed cohorts: every topology family and
  composition mode occurs, eligible content families appear within a documented
  horizon, no family dominates unintentionally, every generated-eligible Mimic
  family and both reveal branches occur, every selected complete recipe passes
  compatibility,
  and exact golden seeds remain stable for each supported historical version.

## 11. Implementation phases

### Phase 0 — integrated audit and design freeze

- Rebaseline current campaign order, metrics, story, asset pacing, controller flow, Book capacity, and performance.
- Complete PT44's bounded mechanics comparison and record the Human's explicit
  disposition before freezing dependent design packets. A selected new mechanic
  receives a named separate specification/owner and prerequisite qualification;
  do not silently broaden the campaign implementation. A no-new-rule/deferred
  disposition keeps the existing-rule design route available.
- Confirm all predecessor contracts and fix missing foundations first.
- Bound any missing foundation as a separately reviewable predecessor repair,
  with owner, affected acceptance rows and rollback. Close that repair before
  map authoring; do not absorb an unbounded UI/render/solver overhaul here.
- Add/freeze the exhaustive typed gameplay-content eligibility registry by
  stable ID, independently of art lifecycle. Produce the 24-row ecology/debut/
  region matrix, explicit exclusions, encounter-family tags, exact generated
  composition-mode specification, all eight new-level design packets and every
  required inherited-remediation packet before changing code maps.
- Confirm Plan 04 landed a catalogue-driven multi-region environment seam. If it
  did not, add the smallest compatible rendering-only seam before authoring a
  multi-region level; do not encode region selection in CSS selectors or tiles.
- Review provisional names/IDs once; freeze IDs before any persisted/tested build.
- Audit all existing and proposed dimensions, topology grammar, terminal-branch
  payoffs, event gaps, optional-battle rhythm and first-use teaching pockets.
  Freeze the maximum-four authored >16 exceptions, the no-three-consecutive-
  corridor rule, the no-consecutive-large default plus exception evidence, the
  generated >=90% <=16 distribution, and a campaign-wide portfolio ledger.
  Freeze the two-open-room-plus-spatial-relation contract for every large
  authored/generated level and the three-or-more versioned generated topology
  families, selection weights and seed cohorts; the exact optional-encounter
  ledger starting from at least four of eight new chapters; and either the
  stable-6×6/12-input teaching threshold or a measured, family-supported
  replacement. Rework the Rainbow Power Parade packet if it still describes a
  snaking corridor.
- Add PT43's monster-room, treasure-room, monster-maze and treasure-maze examples
  to the same authored/ecology matrix. Freeze the independent room/maze-profile
  definitions, generated weights/feasible combinations, actor/reward limits and
  comparison scenes that prove different play rather than changed labels.
- Freeze PT22 encounter-policy schema, safety proofs, richer defeat-table
  comparator/limits and receipt migration; PT41's Human-selected original cast
  and final roster dependencies; and PT42's challenge rubric, difficulty-choice
  UI, learned-rule mapping and deterministic selection/failure behavior. Keep
  these product decisions separate from the historical v1 and generated-version
  fixtures they must preserve.

Exit: design packets meet this plan and the current gameplay spec; PT43 has its
named content/coverage contract and PT44 has a recorded Human disposition with
any selected-mechanic prerequisite explicitly gated. No live campaign topology
has changed, and no dependent map relies on an undecided rule.

The review packet calls out decisions still requiring the Human: final eligible
roster/exclusions, unresolved child-facing guardian names, any cast addition or
replacement, PT44's selected new-rule proposal, changed insertion role/order,
and a proposed exception to an existing Human gate. Accepted art is not
re-presented for approval. Root may
resolve ordinary layout/composition choices within this plan, but must not
convert a missing decision into implicit permission. Lock the teaching and
roster matrix before authoring; refine individual room sketches using formative
play evidence rather than treating a speculative ASCII map as immutable.

### Phase 1 — campaign order, generated composition versions, and migration

- Add/finalize eight stable entries and versioned canonical order without maps going live to normal users until migration tests pass.
- Update progression, navigation, chapter display, reward tiers, records, active-run validation, tester discovery, and returning-player behaviour.
- Remove count literals that should derive from the canonical order.
- Version Surprise Maze enemy/environment presentation and friend-content
  selection independently from topology/rules generation and from each other.
  Preserve historical golden seeds, records and deterministic reconstruction;
  add the new deterministic topology families under a new topology/rules version
  and the single/themed/mixed ensemble modes only under the new presentation
  version. Current generated active runs are not persisted and need no invented
  active-run migration.
- Add generated Mimic placement only under the new generated-content version.
  Historical versions retain their prior Candy-Mimic interpretation; they are
  never silently re-read through the new disguised-object registry.
- Introduce PT22's new policy/reward version and immutable encounter receipts
  behind the same development boundary, with all permitted-outcome safety and
  old-v1 fixtures passing before real placement. Add PT42's requested/resolved
  difficulty identity and preference mapping without changing an active maze;
  integrate its selector through the existing UI/control contracts before the
  final campaign family test.
- Keep campaign migration and generated-topology/composition work separately
  reviewable inside this phase. First prove migration against test-only entries;
  then prove one seed per topology family before widening the frozen cohort.
  Record cohort/solver workload and runtime so validation stays reproducible on
  the actual host. Do not silently drop slow seeds or weaken completeness when
  adding roster variety increases search cost.

Exit: the full campaign migration matrix passes with placeholder/test definitions
behind a development boundary; the new generated topology version exercises all
frozen families through golden seeds and solver/Hint/structural tests; no
historical seed, record or campaign access is reinterpreted.

### Phase 2 — inherited-campaign remediation

- Apply content revisions—not new IDs—to every inherited chapter that must change
  to meet the final portfolio. The current audit reports nine of sixteen above
  16×16; if that remains true and Chapter 24 keeps the sole default new exception,
  compact at least six inherited levels so the final campaign has no more than
  four exceptions. Re-audit after each revision rather than assuming the count.
- Rebuild `rainbow-power-parade` if it still reads as a snaking corridor, using
  rooms, spokes, route-order choices and meaningful event cadence while
  preserving its stable ID, victory role and fair Power-sequence purpose.
- Add or refine first-use teaching pockets in inherited chapters wherever the
  lifecycle matrix identifies a missing introduction. Prove the stable-6×6/
  12-input contract (or Phase-0-approved equivalent), skilled-player bypass,
  optional friend/reward choice, cross-input parity and non-reading/non-motion
  clue parity.
- For every changed map, update its content revision/fingerprint, semantic object
  IDs only where truly new objects are added, active-run compatibility policy,
  migration fixtures, ordinary/perfect/current-state solver and Hint evidence,
  route/interest/retraversal metrics, terminal-branch collectibles, fixed visual
  manifest and story/help text as required.
- Validate the revisions in small family-playtest cohorts before authoring the
  eight new chapters. Record whether compacting reduced fatigue without weakening
  puzzle identity, wonder or satisfying combat.

Exit: the inherited sixteen already satisfy the final large-level cap, topology
portfolio, Rainbow Power Parade, terminal-reward and teaching contracts; durable
progress is preserved and changed active runs fail or migrate exactly as specified.

### Phase 3 — four inserted chapters

- Implement slots 3, 8, 12, and 16 one at a time.
- For each: structural validation, ordinary/perfect/current-state Hint solver, metric delta, story, asset/light/effect selection, static/reduced mode, and neighbour comparison.
- For each: prove every true terminal branch has its separate optional collectible,
  optional pickups remain off the minimap, the encounter rhythm offers fun
  without grind, and any first-use mechanic follows question → visible answer →
  first success within the frozen view/input threshold with a skilled-player
  bypass.
- Run formative child/family and controller/UI checks after each pair; adjust the smallest relevant design issue.

Exit: all four integrate without flattening adjacent chapters or relocking returning players.

### Phase 4 — four Elsewhere Encore chapters

- Implement slots 21–24 sequentially, validating the arc before increasing capstone complexity.
- Preserve Chapter 20's full payoff and ensure Chapter 21 feels like a welcome encore.
- Keep Science thematic/non-consumptive and use only approved mechanics.
- Maintain the topology portfolio and large-level cap; the sole default new
  >16 set piece is Chapter 24 unless the Phase-0 whole-campaign audit explicitly
  trades that exception with another level.

Exit: 21–24 form a coherent curve; Chapter 24 has multiple fair orderings and optional mastery rather than a single endurance corridor.

### Phase 5 — story, UI, rewards, and catalogue integration

- Finalize all 24 Story entries, Book/Select/victory/Continue copy, numbering, unlock markers, record cards, badges, and help.
- Ensure 24 cards perform and controller-scroll correctly at TV, desktop, tablet, and phone sizes.
- Apply fixed environment/region manifests, progressive enemy/friend ensembles,
  final authored light bearings, VFX flavors, music opportunities, registered
  animations, and accessible/static variants. Resolve every eligible catalogue
  identity to a real consumer or explicit gameplay-eligibility disposition;
  update art lifecycle separately where relevant.

Exit: no placeholder copy/art/ID, false finale language, missing glyph, asset adjacency accident, or unsupported animation reference.

### Phase 6 — full validation, performance, and release authority

- Run all solver/migration/engine/story/catalogue/unit checks.
- Run every story maze in the shared browser scenario harness plus representative actual play paths, all modals, Book/Select, full/reduced MotionMode crossed with forced static quality/fallback, Normal/Big, and all input sources.
- Re-run relevant Plan-07 performance, asset/package, 24-card Book, Tauri, and Steam Deck/TV matrices; keep unavailable hardware honestly pending.
- Update all source-of-truth and release documents, version/changelog if the project uses them, and final artifact provenance.

Exit: the complete 24-maze candidate passes the Definition of Done below.

## 12. Expected implementation surface

Resolve exact paths at execution time. Likely owned changes include:

- `src/game/contentRoster.ts` (new expected type-level gameplay eligibility/
  family authority), `src/game/types.ts`, `src/game/levels.ts`, and separately
  identified coordinate-specific authored enemy/friend/cameo placement tooling;
- a versioned Mimic-family mapping and disguised-object state whose closed,
  good-open and revealed-enemy art IDs remain geometry-compatible by family;
- `src/game/generator.ts`, `src/game/contentIdentity.ts`, generated golden-seed/
  fingerprint tests, and the explicit generated content/presentation versions;
- level validation, solver, route metrics, reachability/hint, and campaign-report tests;
- `src/story.ts` and story tests;
- `src/progress.ts`, `src/session.ts`, `src/navigation.ts`, achievements/rewards, migrations, and tests;
- Maze Select, Adventure Book, Continue, victory, tester, and relevant UI view models/components;
- `src/artCatalog.ts`, `src/assets.ts`, the terrain renderer in `src/App.tsx`,
  `src/visualPersonality.ts`, and art/theme/light/VFX/animation/music selection
  metadata through existing typed catalogues;
- shared browser/controller/performance scenarios and fixtures;
- `docs/GAMEPLAY_DESIGN_SPEC.md`, `docs/STORY_BIBLE.md`, `docs/ARCHITECTURE.md`, README, project audit, release checklist, changelog/version documentation, and asset provenance if new media is added.

Do not put campaign ordering, story identity, or unlock truth in CSS or filename inference.

## 13. Validation matrix

### Automated

- Exactly 24 unique stable campaign IDs in the canonical order.
- Exactly one complete Story entry per campaign ID, with derived/correct chapter order and all compact-copy fields.
- PT30 cast/turn metadata and first-time/rapid-skip/replay/Continue paths agree
  with the accepted story host. Zero-rescue, partial-rescue and exact-perfect
  outcomes produce truthful optionality and outro copy; story replay never
  reapplies rewards or changes an active route.
- Structural validation and absolute-size bounds for every map.
- No more than four authored levels exceed 16 tiles on either axis; every one is
  named in the exception ledger and passes its room/spoke, event-gap and
  retraversal justification. No two are consecutive without the recorded pacing
  reason and successful family evidence. At least 90% of the frozen generated
  seed cohort is <=16, and every larger authored/generated result has at least
  two meaningful open rooms plus a hub/spoke/loop/garden/chamber relationship.
- The topology portfolio contains no run of three corridor-dominant chapters and
  satisfies the per-four-chapter variety contract. Rainbow Power Parade has a
  room/branch/order structure rather than one snaking route.
- The new Surprise Maze version exercises at least the three frozen deterministic
  topology families, with isolated selection, version/fingerprint identity,
  representative golden seeds and solver/Hint/distribution coverage for each.
- Every authored and generated true terminal branch has its own small optional
  collectible in addition to any required content; optional Gold, Science,
  chest, bag and equivalent treasure markers never appear on the minimap, while
  required markers and clues remain intact.
- First-use mechanic packets and fixtures prove question and answer within the
  frozen stable-6×6 view (or approved equivalent), first success within 12
  directional inputs (or approved equivalent), no forced explanation for a
  player who acts correctly, one real choice, one clearly optional friend/reward
  branch, one appealing story/visual beat, a satisfying ordinary route, cross-
  input/accessibility parity, and no redundant separate tutorial for each
  equivalent boot family.
- Encounter ledgers and solution tests prove optional low-Power battle rooms do
  not gate completion, alter required Power assumptions, or create mandatory
  grind. Every level packet's required/optional counts, spacing and intended
  Power chain agree with the authored objects and engine-derived routes; at least
  four of the eight new chapters include an optional encounter room unless Phase
  0 records a family-evidenced adjustment, and required fights retain fair,
  readable purpose.
- Ordinary zero-rescue and exact-all-rescue solution for every authored level.
- Tier-4 current-state Hint route replays through the engine across representative and exhaustive feasible states, including portals and one/two/three-hole jumps.
- No soft lock or undisclosed irreversible state in reachable-state fixtures.
- Per-level metric budgets and documented exceptions.
- Campaign ecology/adjacency coverage: every campaign-eligible enemy has a real
  interactive pre-showcase use and has debuted by Chapter 23; Chapter 24 contains
  no more than twelve interactive guardians and exposes every remaining type as
  a non-colliding, non-solver cameo; every eligible friend has a fixed authored
  rescue; no missing typed registry entry, fallback counted as coverage, or
  unapproved consecutive sameness.
- Plan 03 integration-manifest coverage: every gameplay-facing weapon, cage,
  key/door, portal, treasure/Science pickup, traversal item, hazard, environment
  recipe and dressing family resolves to a deliberate consumer or an explicit
  owner/reason/review gate; source and optical derivatives do not inflate use.
- Chapter 24 cameo count does not change solver state/signatures or required-route
  Power accounting; its level-entry, room-transition, decode, retained-memory and
  frame-time measurements pass the applicable Plan 07 budgets without a hitch.
- Exactly one valid fixed one-to-four-region environment manifest per authored
  level, complete and deterministic region assignment, compatible complete recipes, one intentional
  level-wide light, versioned semantic region maps where hints use them,
  unchanged collision/solver truth, and stable theme results across restart/
  resume. Region rendering has bounded grouped geometry, unique-asset preloads
  and Plan 07 DOM/decode totals rather than per-tile nodes.
- Versioned Surprise seed cohorts cover single-style, themed-ensemble and mixed-
  ensemble enemies; thematic/mixed no-duplicate friends; every eligible
  environment recipe; exact distinct-style/family counts and the one-enemy
  fallback; friend-content fingerprints; distribution bounds; historical golden-
  seed reconstruction; and strict separation from topology/rules/reward PRNG
  streams.
- Every final approved Mimic family cross-resolves closed/good-open/revealed art,
  exercises its new versioned designer-policy boundaries and all permitted
  reward/combat branches, preserves the historical v1 65/35 buckets, never
  enters ordinary enemy-style composition in the new version, and preserves the
  historical Candy Mimic generator/level interpretation only under its pinned
  historical content version. Generated tests prove the at-most-one optional-
  slot rule, the frozen placement frequency, every `generatedEligible` family,
  zero-Mimic seeds, and isolation from topology, required rewards and solutions.
- PT22 fixtures prove attainable Power before required encounters and safe
  return to optional ones, joint-outcome ordinary/perfect solvability, a richer
  guaranteed minimum defeat reward, immutable encounter receipts and exactly-once
  credit independently of the reveal/shower or moving homing target.
- PT41's selected new friends have Human-approved original identities, approved
  art, stable species IDs and authored Solo rescues; all accepted baseline
  species remain covered, counts derive from the final roster and Plan-10
  economy/capacity consumers receive its exact version.
- PT42's explicit and Surprise me selections retain readable non-reading cues,
  eligibility and deterministic difficulty identity; authored and generated
  decision packets prove meaningful alternatives and information beyond mere
  route length. No difficulty setting silently changes a running maze.
- PT43's four requested forms have named authored examples and generated-profile
  coverage with deterministic identity, feasible difficulty/topology combinations,
  ordinary/perfect solvability, bounded actor/reward/shower cost and documented
  Plan-10 Science-supply consequences. No profile adds a kill-all exit rule or
  relies on a random reward to progress.
- PT44 has a concrete comparison and recorded Human accept/defer/reject outcome.
  Any adopted new rule has its approved specification, owner, teaching/recovery
  evidence, solver/Hint contract, save/version tests and requalified predecessor
  interfaces before dependent maps go live. Undecided PT14 mechanics remain out.
- Fresh/partial/full/legacy/inconsistent/active-run campaign-order migrations.
- Continue, Next, Book totals, Maze Select, achievements, reward bands, tester isolation, and reset allow-list use canonical order/count.
- Static/reduced/full presentation and asset availability.
- Full project, desktop, art, performance, package, and documentation-link gates.

### Manual and family play

- At least one fresh-profile continuous curve sample, focused sessions for all
  eight new levels, and targeted before/after sessions for every materially
  revised inherited level.
- Ame-and-parent co-play as a primary qualitative reference, with broader child/accessibility checks where available.
- Record goal comprehension, required/optional understanding, predictions, aha, confusion, blocker recovery, Hint tier, parental nudge/takeover, fun/difficulty/pride, surprise, laughter, favourite beat, voluntary replay, and desire to continue.
- Attach section 7's question/inference/recovery/payoff evidence to each new or
  materially revised packet. Record held-movement comfort and natural stopping
  points; a refusal to continue is useful feedback, never a failed child test.
- Verify no new level's memorable quality depends solely on reading, hue, motion, sound, haptics, or a large display.
- Verify controller-only navigation across all 24 records and every new chapter flow.
- Verify actual-size art, minimap clues, objective fit, and Bag/friend maximum states at the common viewport matrix.
- Have family testers sample a teaching pocket, optional battle room, rewarded
  dead end, room/open level, portal-island level, and one justified >16 set piece.
  Record whether each feels clear and rewarding rather than instructional,
  repetitive, empty or exhausting.
- Compare PT43's monster and treasure rooms and whole-maze profiles: can players
  describe the different attraction and make a useful route choice, and do the
  rewards/battles remain pleasant across repeated visits? If PT44 selects a new
  rule, observe first prediction, safe mistake/recovery and later transfer before
  deploying the same rule throughout the campaign. Record confusion or annoyance
  plainly rather than accepting a candidate solely because its solver passes.
- Review at least one enemy debut, the skeleton/lizard ensemble, several mixed
  casts, the all-roster festival, one thematic and one mixed friend group, every
  authored environment family, and each multi-region portal transition. Confirm
  they feel crafted and readable rather than like catalogue dumping.
- Confirm static/reduced-motion and non-colour presentation distinguish festival
  cameos from interactive blockers without requiring a child to test collision.

## 14. Risks and rollback

| Risk | Prevention | Rollback |
|---|---|---|
| Insertions corrupt ordinal saves or relock content | Historical-order migration, stable IDs, full matrix before live order | Disable new campaign revision; retain backward reader and original order. |
| New chapters flatten onboarding or difficulty | Neighbour comparison, mechanic lifecycle, alternating curve, family play | Remove/rework one entry behind campaign revision; never renumber surviving IDs. |
| More length replaces more thought | Reasoning/friction metrics and strict event/retraversal bands | Redesign topology; do not merely lower a numeric target. |
| Former finale feels invalidated | Preserve restoration, frame 21–24 as encore/new path | Revert transition copy/arc without altering completed record. |
| Fully complete players are sent backwards unexpectedly | Continue to Chapter 21; explicitly mark inserted adventures New | Revert selection policy while retaining unlock access. |
| Asset/VFX variety becomes clutter | One signature beat, adjacency matrix, quiet planning interval | Reduce accents/effects, not semantic clue or whole level. |
| Full-roster coverage becomes a checklist, combat gauntlet, preload spike or solver-state explosion | Require pre-showcase interactive spotlights; cap Chapter 24 at twelve interactive guardians; use non-colliding cameos, roomed reveals and six-actor normal-camera density | Recompose interactive/cameo roles and rooms while preserving stable level IDs and roster coverage. |
| New catalogue entries reinterpret Surprise seeds or friend outcomes | Separate topology/rules, generated-content and presentation versions; retain historical pools/golden results | Read the pinned versions; disable only the new composition version without touching topology or rewards. |
| Multi-region textures clash, seam, conflict with lighting or become the only clue | Catalogue compatibility plus actual-size review, complete region masks, one level-wide light, world anchoring, non-visual landmarks and solver-invariance tests | Fall back that level to its declared base recipe; preserve semantic region metadata for repair. |
| Multi-region rendering multiplies DOM nodes or redundant image decodes | Group geometry by region/recipe, preload unique assets once, and enforce Plan 07 node/decode budgets | Fall back to the level's base recipe while preserving its semantic region map. |
| New assets exceed media budget | Reuse final catalogue, source-first pipeline, measured exception | Repoint/unpublish the derivative, record it as a Plan-12 candidate, and preserve the physical file until archive handoff and Human-confirmed external backup. |
| 24-card UI or solver regresses performance | Shared harness, virtualization/lazy decode only if measured, stable fixtures | Optimize presentation/search without hiding content or changing rules. |
| Capstone becomes another corridor marathon | Multiple orderings, shortcuts, event-gap/decision budgets | Replace topology while preserving stable level ID through content revision. |
| Variety becomes cosmetic while routes remain corridor-identical | Typed topology portfolio, neighbour/run checks, family samples | Rebuild the route grammar, not merely the terrain recipe. |
| Optional battles become compulsory grind or visual clutter | Side-room placement, solver-independent completion, Power and density ledgers | Remove/rebalance the encounter while retaining the room payoff. |
| Tutorial pockets become worksheets | Visible nearby answer, one real choice, skilled-player bypass, no redundant boot lessons | Fold the lesson into an existing playful room or defer the extra explanation. |

Every map revision has a content version. A rollback preserves durable accomplishments and never maps old object state onto a different same-kind object by position.

## 15. Definition of done

Plan 09 is complete only when:

1. the canonical campaign contains exactly 24 stable story entries in the adopted four-insert/four-append structure;
2. all previous completions, records, rewards, unlock access, achievements, currencies, rescues, and valid active runs migrate safely;
3. all 24 mazes pass zero-rescue ordinary, exact-perfect, legible-solvability, Hint replay, and approved route-quality gates;
4. each new maze has a distinct educational habit, fair aha, signature wonder beat, joke/payoff, optional discovery, and healthy replay reason;
5. the former finale remains a complete victory and the four-chapter Elsewhere Encore ends with a joyful, fair capstone;
6. final art, audio, lighting, VFX, animation, minimap, UI, controller, accessibility, reduced/static, and performance contracts are used coherently;
7. every campaign-eligible enemy type has a meaningful interactive pre-showcase
   authored use, all have debuted by Chapter 23, Chapter 24 presents the complete
   roster readably with at most twelve interactive guardians and all others as
   non-colliding/non-solver cameos, and every eligible friend species has a fixed
   optional rescue;
8. all authored environment/region manifests are fixed, compatible and visually
   approved under one level-wide light, while separately versioned generated
   topology, presentation and friend content demonstrably vary route families,
   enemy ensembles, friends and themes without silently reinterpreting
   historical golden seeds, records or gameplay fingerprints;
9. the 24-card Book/Select/Continue/victory flow works across the full viewport and input matrix;
10. full web and desktop checks pass, relevant Tauri/package/performance evidence is refreshed, and unavailable physical hardware checks are plainly labelled;
11. Story Bible, Gameplay spec, Architecture, README, audit, release, changelog/version, and any asset provenance all match the shipped source; and
12. the final campaign honours the <=16 default and maximum-four large-level
    exception cap and the evidenced no-consecutive-large default; every large
    level passes the two-open-room-plus-spatial-relation contract; the campaign
    never places three corridor-dominant levels consecutively,
    gives every true terminal branch its own optional collectible in addition to
    required content, keeps every optional treasure marker off the minimap, and
    uses the frozen optional-battle and measurable first-use-teaching contracts
    without grind or forced instruction, with per-level encounter counts,
    spacing and intended Power chains reconciled to the shipped maps; and
13. the reviewed final commit is pushed and recoverable, with no temporary evidence, placeholder IDs, stale compatibility route, or unrelated change left behind;
14. the accepted SHA is handed to the root release manager for the required
    `FP-CAMPAIGN` transaction: GitHub CI and Vercel production deployment/smoke,
    followed by a versioned portable Windows build, launch smoke, manifest,
    SHA-256, playtest note and GitHub pre-release publication. A red gate is
    recorded with its exact retry point; the level-design agent does not publish
    or relabel artifacts itself.
15. short cast-led interludes and ordinary-completion copy pass PT30's truthful,
    skippable/replayable contract; every new/revised chapter's intended discovery,
    recovery and payoff has concrete design and family evidence with sample
    limits disclosed rather than inferred from solver success.
