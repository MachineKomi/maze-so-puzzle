# Gameplay design specification

Status: implemented gameplay authority for the sixteen-maze campaign on 2026-09-02. This document turns the manager-reviewed Plan 06 into maintained rules and testable contracts. `docs/plans/06-game-design-gameplay-ux-mechanics-plan.md` remains the decision record; source and tests remain runtime authority.

## Player promise

Maze so Puzzle is a child-friendly spatial puzzle adventure in which Ame becomes capable, not invulnerable through punishment. A fair maze shows a useful question, lets the player form a plan, changes meaning when a tool or key is found, and rewards the return trip with a short route or an “aha.” It must never confuse long walking with deep thinking.

The invariant rules are:

- Equal Power wins. Stronger enemies block safely; they never hurt, reset, or remove progress.
- Every maze has one generic weapon capability, expressed through visual variants.
- Matching keys are reusable. Boots gate water/lava, the Antidote Leaf gates poison, and Spring Boots jump straight over a complete contiguous hole run.
- Portal pairs persist and always connect the same two semantic objects.
- Ordinary completion can rescue zero friends. Perfect completion rescues exactly every available friend.
- Required Path hints target an ordinary zero-rescue solution. Optional friends and treasure are never presented as prerequisites.
- Authored and generated mazes stay at or below 24×24; current Surprise Maze size bands remain deterministic.
- Gold and Science Points are visible keepsakes and completion records, not promises of a shop or spendable economy.

### Rescue-and-collect friend roster

Friends are kind optional rescues during a maze and persistent collectable companions for the Friend Garden. “Friend” is the rules term: it includes ordinary animals and small, child-friendly mythic beings. Neither group is a combat reward, equipment class, required objective, or source of automatic maze solutions. The post-v0.20.1 authored-content revision places every one of the 32 active friend species in at least one Solo-accessible rescue across the existing sixteen-maze campaign; it changes identities only, not topology, balance, or route length.

The ordinary-animal family is Bunny, Fox, Kitten, Puppy, Duckling, Hedgehog, Fawn, Red Panda, Otter, Lamb, Capybara, Chinchilla, Alpaca, Penguin, and Koala.

The active mythic-friend family is Ripplecap Kappa Hatchling, Pitter-Patter Parasol, Mallowmusk Aroma Wisp, Lanternling, Breezeling Sylph, Griffin Cub, Emberbelly Dragonling, Cloudstep Pegasus Foal, Three-Tumble Cerberus Pup, Riddlekit Sphinx, Tidecurl Hippocamp Foal, Emberdown Phoenix Chick, Meadowstep Faunling, Minerva Moon-Owl, and Tessera Dolphin. These are original Maze so Puzzle interpretations of broad folklore, fantasy-JRPG, Greek, and Roman ideas. They must not reproduce franchise designs or turn cultural source material into horror caricature.

Tea-Time Skeleton (`green-tea-skeleton`) is an active rescue-and-collect
friend. He is the courteous toy-ivory skeleton who sits peacefully with a
traditional handleless cup of green tea and one steam curl. His approved sprite
and gentle visual joke are unchanged; he is not an enemy, guardian, combat
encounter, or Power check. He is introduced in Maze 2 and returns in the current
finale, always through friend rescue/persistence rather than enemy state.

Rainbow-Horn Unicorn (`rainbow-horn-unicorn`)—white fur, light-pink markings and
mane, and a rainbow horn—is the very first authored rescue friend in Maze 1.
Later gameplay and Garden work must consume this identity rather than inventing
a competing species ID.

The current authored rescue curve is fixed as follows. It deliberately introduces
the full roster in small readable groups by Maze 12, then uses thematic reunions
rather than reverting to the former repeated Bunny/Fox/Kitten-heavy distribution.

| Ch | Authored rescue candidates |
| ---: | --- |
| 1 | Rainbow-Horn Unicorn |
| 2 | Tea-Time Skeleton; Fox |
| 3 | Bunny; Kitten; Puppy |
| 4 | Duckling; Hedgehog; Fawn |
| 5 | Red Panda; Otter; Lamb |
| 6 | Capybara; Chinchilla; Alpaca |
| 7 | Pitter-Patter Parasol; Kitten; Penguin |
| 8 | Lanternling; Emberdown Phoenix Chick; Meadowstep Faunling |
| 9 | Minerva Moon-Owl; Tessera Dolphin; Mallowmusk Aroma Wisp |
| 10 | Breezeling Sylph; Griffin Cub; Emberbelly Dragonling |
| 11 | Cloudstep Pegasus Foal; Three-Tumble Cerberus Pup; Riddlekit Sphinx; Koala |
| 12 | Tidecurl Hippocamp Foal; Ripplecap Kappa Hatchling; Penguin; Koala; Fawn |
| 13 | Rainbow-Horn Unicorn; Breezeling Sylph; Bunny |
| 14 | Pitter-Patter Parasol; Lanternling; Ripplecap Kappa Hatchling; Cloudstep Pegasus Foal |
| 15 | Griffin Cub; Three-Tumble Cerberus Pup; Riddlekit Sphinx; Tidecurl Hippocamp Foal; Emberdown Phoenix Chick |
| 16 | Rainbow-Horn Unicorn; Tea-Time Skeleton; Emberbelly Dragonling; Fox; Kitten |

Art and content rules for this roster:

- Every friend needs a distinct stable ID, display name, source/provenance record, cage-safe face area, and readable 40/56/84 px silhouette before catalogue admission.
- A mythic friend and a similarly named enemy remain separate identities. In particular, Ripplecap Kappa Hatchling is a garden companion and must not reuse the enemy Kappa's record, sprite, behaviour, or narrative role.
- Lore cues stay species-specific. Do not distribute leaves, hearts, stars, gems, ribbons, or other motifs across the roster merely to make a design seem magical.
- Feeding and care are affectionate garden presentation. They do not introduce hunger punishment, neglect states, injury, death, compulsory chores, or spend-to-maintain systems.

## Implemented root-checkpoint 03M interaction contracts

These Human decisions are implemented authority from the bounded 03M checkpoint
between Plans 03 and 01. `engine.ts`, `session.ts`, `progress.ts`,
`rewardRules.ts`, and their focused tests are runtime authority.

### Exit choice and durable completion

- Entering the exit creates a recoverable pending-completion state; it does not
  yet bank rewards, clear the active run, or advance campaign progress.
- The choice always offers **Stay here**, **Next maze**, and **Restart**. Stay is
  focused/default while any friend remains; Next is focused/default after every
  friend is rescued. Copy never describes optional friends as failure.
- **Stay here** returns control with Ame on the exit tile and the entire run
  intact. That exit instance is disarmed until Ame leaves its tile, then rearms;
  staying cannot instantly reopen the choice or duplicate presentation.
- **Next maze** commits completion, rewards, records and unlocks exactly once,
  clears the active run at the documented durable boundary, then navigates.
  Plan 10 may add **Take a break** as another post-commit destination without
  removing the core three choices or taking default focus unexpectedly.
- **Restart** uses the normal safe confirmation and awards nothing. Save/reload
  while the choice is open restores the same pending choice and active run; it
  neither fabricates completion nor loses collected state.
- Victory presentation may acknowledge each newly created pending-completion ID
  once, but presentation is not persistence authority. Held input is quarantined
  across entry and exit from the choice.

### Stationary keyed-door interaction

- A legal move attempt into a closed matching door commits that semantic door as
  open while Ame remains logically and visibly on the origin tile. The reusable
  key is not consumed.
- The door-open presentation and audio complete from that stable origin. A tap
  never teleports Ame into the former door tile. Save/cancel/navigation after the
  committed event restores an open door and the origin position.
- Once the presentation lock clears, a later input—or the next eligible cadence
  step of a still-held direction after neutral/lock rules permit it—may move into
  the now-passable tile. The original input cannot both open and traverse.

### Accepted follow-up: stationary cage rescue

This Human-approved contract is pending `V22-PLAY-01`; current runtime/tests still
move Ame into an unresolved cage tile and are not authority for the desired rule.

- A legal contact with an unresolved cage commits the semantic friend rescue and
  reward exactly once while Player 1 remains logically and visibly on the adjacent
  origin tile. The interaction returns no movement and increments no movement step.
- The cage resolves and the friend emerges from the cage tile. Follower-history
  initialization must not place the new friend inside the stationary player.
- After the complete presentation, a later input—or a direction which is still
  genuinely held and eligible under the shared continuation rules—may enter the
  cleared tile or move elsewhere. No input queued during presentation is replayed.
- Loose keys, equipment, potions, Gold and Science remain ordinary walk-over
  pickups. Doors, combat, portals, Spring-Boot jumps and chests/Mimics retain their
  own explicit contact semantics. A jump landing cannot remotely resolve a cage.
- The implementation must update engine events, solver/reachability, hints/metrics,
  content fingerprints/revisions, active-run reconstruction and route fixtures as
  one rules change. Recompute perfect-rescue routes and prevent old best-step
  records from being presented as comparable where the gameplay fingerprint moved.

### Accepted follow-up: player movement pace

`V22-PLAY-01` adds **Chill**, **Regular** and **Zippy** as presentation/input-cadence
preferences, not gameplay rules. All three resolve the same sequence of legal
single-tile engine transitions for the same semantic inputs. They cannot change
collision, step counts, Power, rewards, puzzle state, reachability or solver
results, and cannot catch up through interaction locks. Regular is default; exact
timings remain subject to Human/family tuning. Plan 08 consumes the same policy for
controllers and Plan 07B treats Zippy as the input/save/render stress case.

### Committed Mimic and reward tables

- Every disguised Mimic uses one stable semantic object ID and one isolated,
  auditable 65-good / 35-Mimic bucket result. The outcome and any reward amount
  commit no later than first legal contact and cannot reroll across save/resume,
  repeated input, presentation cancellation or versioned reconstruction.
- 03M must add one explicit versioned table for good-chest Gold/Science choice
  and ranges, ordinary chest/bag rewards, guaranteed rescue Gold, and enemy Gold/
  Science drops. Values must be positive, bounded, age-appropriate, and justified
  against current campaign totals; no later presentation or level owner invents
  amounts locally.
- Gameplay credit and resolved-object state commit exactly once before visual
  shower authority. Plan 02 presents the result; Plan 09 implements/places the
  disguised encounter and solver/content migration; Plan 10 may change only the
  visual homing recipient while preserving single shared credit.

`REWARD_RULES_VERSION = 1` freezes these future-content values:

| Event | Gold | Science | Selection |
| --- | ---: | ---: | --- |
| Good disguised chest | 8–14 | 3–5 | 70% Gold / 30% Science after the independent 65% good-chest result |
| Ordinary Gold bag / chest | 3 / 8 | — | Fixed existing treasure values |
| Ordinary Science gears / beaker | — | 2 / 4 | Fixed existing treasure values |
| Friend rescue drop | 2–4 | — | Deterministic amount from run + object identity |
| Defeated enemy drops | 1–3 | 1–2 | Both deterministic channels |

The good-chest Gold range brackets the existing eight-star chest and remains
below a typical current first-clear reward (10 completion + 5 first-clear + 3
per rescued friend, with 6 more for a perfect rescue). Science remains scarcer.
Enemy and rescue drops are deliberately small positive acknowledgements. These
tables are contract-only until Plan 09 introduces their objects and persistence;
later tuning must version the table rather than silently changing a saved roll.

## Approved Plan 09 content-ecology direction (not yet implemented)

The final Plan 03 catalogue is a content vocabulary, not proof that the game
uses it well. The post-v0.20.1 correction establishes a complete baseline by
using all 32 friend species in the current authored campaign. Plan 09 still owns
the intentional 24-chapter introduction/reunion ecology, thematic tuning,
generated-maze variety migration, and preservation of full Solo-accessible
coverage as eight levels are inserted.

### Campaign scale, spatial variety, teaching and encounter rhythm

- The normal authored level is at most 16 tiles on either axis. Across the final
  24 chapters no more than four may exceed 16, including inherited levels; each
  is a named, family-tested set piece with rooms/spokes, event-gap/retraversal
  evidence and a reason it cannot deliver the same puzzle more compactly. If the
  current nine-of-sixteen audit still holds and Chapter 24 keeps the sole default
  new exception, revise and compact at least six inherited maps under their
  stable IDs with content-revision, save, solver/Hint and family-play evidence.
- Every authored/generated level above 16 on either axis has at least two
  recognisable open rooms with meaningful optional or functional content plus a
  hub, spoke, loop, garden or puzzle-chamber relationship. Avoid consecutive
  large authored chapters unless a recorded pacing reason and successful family
  test support the adjacency.
- Plan-09 levels normally keep the longest meaningful-event gap at or below 24
  directional inputs and neutral retraversal at or below 15%. A 25–30-input gap
  needs a named design reason and targeted evidence; anything above 30 needs
  redesign or an explicit successful family-tested exception.
- Never ship three corridor-dominant levels consecutively. Mix compact puzzle
  rooms, hubs, loops, spokes, portal islands, open tableaux and occasional true
  labyrinths. Rebuild Rainbow Power Parade under a content revision if the
  integrated form still reads as a single snaking corridor.
- A **true terminal branch** is a graph branch whose traversable route ends and
  offers no onward route except backtracking; multiple terminal cells in one
  open room count as one branch. Every such branch contains a small optional
  collectible: Gold, Science, a chest/bag resolving to one of those currencies,
  or another explicitly approved optional collectible that is durably credited
  and visibly cleared. A clue, required tool, friend, enemy, shortcut, joke or
  vista may coexist but never displaces that collectible. All optional Gold,
  Science, chest, bag and equivalent treasure markers remain absent from the
  minimap so a cleared dead end becomes a memory aid.
- Include enjoyable optional low-Power battle rooms and varied encounter groups
  without making combat or currency grind necessary for ordinary completion.
  Start with at least four of the eight new Plan-09 chapters containing an
  optional encounter room/branch; tune only from recorded family evidence. Each
  new or materially revised level packet records required/optional encounter
  counts, route spacing and the intended Power chain, reconciled to authored
  objects and engine-derived routes.
- Introduce a genuinely new rule through question → nearby visible answer →
  short application, with no forced modal for a player who acts correctly. Keep
  blocker and answer within one stable 6×6 view (or a documented equally legible
  composition), with first successful use reachable within 12 directional
  inputs unless Phase 0 records and validates a stricter or better equivalent.
  Every teaching pocket also includes one real choice, one clearly optional
  friend/reward branch, an appealing story/visual beat, a satisfying ordinary
  route, cross-input parity and non-reading/non-colour/reduced/static clue parity.
  Equivalent equipment families reuse that literacy rather than each receiving
  a separate tutorial level.
- Freeze generated sizes so at least 90% of the declared seed cohort is <=16 on
  either axis. Every larger result must include meaningful room/event structure
  and pass the same event-gap and terminal-branch rules.
- Version and exercise at least three deterministic generated topology families:
  classic labyrinth, room-and-spoke, and loop/garden/chamber. Topology-family
  selection uses an isolated deterministic stream and participates in generation
  fingerprints, golden seeds, distribution evidence, solver and Hint coverage.

### Campaign guardians

- Plan 09 creates one exhaustive typed gameplay-content eligibility registry
  (expected `src/game/contentRoster.ts`) keyed by stable type-level `EnemyStyle`
  / `AnimalSpecies` identities (or explicitly renamed, versioned final equivalents). It owns
  campaign/generated eligibility and encounter-family tags separately from the
  art catalogue's `active`, `dormant`, `deprecated` and `superseded` runtime-file
  lifecycle. Exclusions require an owner, reason and review gate.
- Individual authored encounters/rescues retain separate level-scoped semantic
  `LevelObject.id` values and coordinates. Object insertion/reordering cannot alter the
  type registry. Each approved Mimic family has a distinct disguised-object
  family identity rather than masquerading as an ordinary `EnemyStyle`.
- Every final Human-approved gameplay enemy identity and rescue-and-collect
  friend species is eligible by default. An exclusion requires explicit Human
  deferral and a return gate; an overfull debut curve is escalated as a pacing or
  roster decision rather than resolved by silently omitting content.
- Every final enemy identity marked campaign-eligible in that registry appears
  in at least one meaningful, reachable story-maze interaction. Source variants,
  optical sizes, frames and superseded files do not count as separate types and
  are not placed to inflate coverage.
- Give every type a readable spotlight or small-ensemble appearance before a
  late all-roster showcase. A fallback sprite, unreachable object, one-frame
  glimpse, or sole appearance inside the showcase does not satisfy this rule.
- Introduce new silhouettes progressively. After the first combat lesson, an
  ordinary chapter should introduce no more than two unseen types and should
  stage their first appearance away from simultaneous rule/UI overload. All
  eligible types debut by Chapter 23; Chapter 24 is the preferred all-roster
  festival candidate if its roomed design passes pacing and performance gates.
  It uses no more than twelve interactive guardians, while any other enemy types
  appear as non-colliding presentational cameos outside `EnemyObject`, combat,
  reachability and solver state. Normally no more than six enemy actors share the
  6×6 camera; a higher bounded scene needs measured approval.
- Alternate tightly themed ensembles with mixed casts. A skeleton-and-lizard
  ruin/guard ensemble is preferred for final Chapter 13,
  `lanternlight-labyrinth`, whose Lantern Ruins/monster-room identity supports
  the theme. Enemy variety never creates an undocumented mechanic: ordinary
  guardians retain the universal Power rule.
- Mimic is one distinct disguised-object mechanic, not an `EnemyStyle` promise.
  A versioned Mimic-family registry maps every final approved family—including
  Treasure and Candy when both pass Plan 03—to stable closed, good-open and
  revealed-enemy art identities. Every family uses the same committed seeded
  65/35 result and required routes remain solvable under either good-chest or
  enemy outcome. Plan 09 migrates the current always-visible Candy Mimic out of
  ordinary enemy placement under a content revision while preserving durable
  progress and historical generated versions. An unmet predecessor contract
  returns to its owner or an explicit Human deferral gate; an always-visible
  guardian cannot stand in for the mechanic, and art lifecycle does not express
  mechanic readiness.

### Campaign friends

- Each final rescue-and-collect species appears as a fixed, stable-ID authored
  rescue at least once across the 24 chapters. No species depends exclusively
  on Surprise seeds, Friend Eggs, co-op or a future mode.
- Early chapters favour familiar animals. Mythic friends arrive progressively
  in fitting habitats or story contexts. Some levels deliberately group related
  friends; others mix species for surprise. The final choice is authored and
  remains stable across restart/replay.
- Repeated species are allowed when they earn recognition, humour or thematic
  cohesion. Coverage never makes rescue mandatory: ordinary solutions still
  rescue zero and perfect solutions still rescue exactly every friend present.

### Authored environments and regions

- Every campaign level declares one fixed `EnvironmentManifest` chosen for mood,
  landmarking, object/hazard contrast and campaign adjacency. It contains a
  required base/default complete recipe and one to four complete named region
  assignments; a single-region level assigns its sole region the base recipe.
  It never rerolls its floor or wall on load.
- A complete recipe binds floor, wall and optional dressings/treatments. One resolved
  level-wide light source/profile governs every region and compatible scene cue;
  regions do not introduce independent light directions. Catalogue hue/lightness
  checks are necessary but do not replace actual-size Human/art review.
- A level may use two to four named visual regions for spatially separated rooms,
  islands, quadrants or portal destinations. Each terrain tile resolves
  to exactly one region; each region uses a valid recipe; boundaries are
  intentional and world-anchored. A visual recipe never alters collision,
  movement or reachability. A stable semantic region ID may support landmark
  names and Hint/Direction language, but texture/colour is never the only clue.
  When a region ID or boundary informs a hint, objective or story instruction,
  the semantic map is content-versioned and included in gameplay identity; its
  assigned visual recipe remains presentation metadata.
- Detailed materials remain off the minimap unless a quiet region cue is proven
  to help the puzzle without competing with topology, portals or blockers.

### Generated-maze content and visual ecology

- Generated enemy/environment presentation is a pure deterministic function of
  the seed, topology/rules generation version and presentation-roster version,
  using random streams isolated from topology, object placement, Power and
  rewards.
- Enemy selection supports exact versioned modes. `single-style` repeats one
  eligible style. With `N` enemy slots, `themed-ensemble` uses
  2–`min(4,N)` distinct styles from one tagged family. `mixed-ensemble` uses two
  distinct styles from two families at `N=2`, or 3–`min(6,N)` distinct styles
  spanning at least two families at `N>=3`. A no-enemy maze makes no composition
  draw; a one-enemy gentle maze is forced to `single-style`. Draw from feasible
  modes and stable-ID-sorted versioned pools rather than silently degrading a
  selected mode. Seed cohorts prevent starvation or domination of a family.
- Mimics are selected through the separate versioned `MimicFamilyId` registry,
  not the ordinary `EnemyStyle` pool. Each approved family explicitly declares
  `generatedEligible`. A new generated-content version may place no more than
  one disguised Mimic per maze and only in a solver-proven optional chest/
  treasure slot; zero Mimics is common. Deterministic family and 65/35 outcome
  streams are isolated from topology, required rewards, ordinary enemy
  composition and solution truth. Declared seed cohorts exercise every eligible
  family and both outcome branches without requiring either to solve a maze.
- Friend selection is deterministic and without replacement inside one maze,
  with thematic and mixed groups drawn from the full generated-eligible roster,
  independent of campaign debut progression. Because species changes gameplay
  identity and Garden outcomes, the eligible friend roster/algorithm has a
  separate generated-content version and its resolved species feed the gameplay
  fingerprint; it is not visual-only presentation.
- A generated maze selects one complete validated environment recipe from a
  stable eligible pool. It never combines arbitrary floor/wall files merely
  because each is independently valid.
- Current generated active runs are deliberately not persisted. Version and test
  historical golden seeds, generated records and deterministic debug
  reconstruction across topology/rules, generated-content and presentation-
  roster versions; do not claim active-run migration/resume support.

### Coverage ledger and acceptance

The 24-row ecology matrix records enemy debut and repeats, friend rescues,
weapons, cages, pickups/treasures, hazards, portals, environment regions,
lighting/VFX/animation opportunities and adjacency. UI-only, Garden-only,
co-op-only and branding assets remain with their owning plans; a campaign asset
with no placement needs an explicit gameplay-eligibility disposition, reason,
owner and review gate, plus an art-lifecycle update only when relevant.
Plan 03's final integration manifest is reconciled across every gameplay-facing
weapon, cage, key/door, portal, treasure/Science, traversal-item, hazard,
environment and dressing family as well as enemies/friends. Each receives a
deliberate consumer or an explicit disposition; optical/animation derivatives
and fallback rendering do not count as distinct meaningful use.

Automated validation must prove roster coverage, debut-before-showcase order,
the Chapter 24 interactive/cameo separation and density bounds, fixed/valid
  authored one-to-four-region manifests, complete region assignment, one resolved light, generated mode
semantics including the one-enemy fallback, historical seed reconstruction,
friend-content fingerprints, catalogue reachability and unchanged ordinary/
  perfect solver truth. Multi-region rendering groups geometry by recipe/region
  rather than creating one DOM/SVG node per tile. It deduplicates each required
  URL and loads it at most once inside the current plus bounded-imminent
  neighbouring/portal-region dependency closure; it never eagerly preloads every
  level region. Human review still decides whether
combinations are attractive, readable, memorable and appropriately paced.

## Difficulty model and measurable rubric

Difficulty is multidimensional. The maintained report in `src/game/metrics.ts` measures engine-derived ordinary and perfect routes, rescue cost, raw branch coordinates, required state changes, physical retraversal, longest non-event run, and route-activity density. Raw branches are not automatically meaningful decisions, and the analyzer reports prerequisite depth as unavailable until a counterfactual dependency analysis exists. Solver results are design evidence, not a substitute for child observation.

| Dimension | 0–1 introductory | 2–3 developing | 4–5 mastery | Automated signal | Human signal |
| --- | --- | --- | --- | --- | --- |
| Rule load | Move/exit; one visible pickup | Two recalled capabilities | Three or more recalled capabilities | Required event sequence; causal depth pending | Can explain the next need in own words |
| Choice load | One route or one safe fork | Several distinguishable branches | Interlocking rooms/portals with state changes | Raw branch points, interpreted with route traces | Pauses to plan rather than random-walks |
| Inference | Direct affordance | Key/tool visible before its gate | Return to a remembered blocker after state change | Meaningful state changes and ordered events | Predicts what a pickup changes |
| Memory/orientation | Whole maze visible | Fog with short, named landmarks | Portal/room graph and remembered blockers | Quiet run, retraversal ratio | Uses landmarks or map without adult navigation |
| Execution burden | Under 40 moves | 40–120 moves | 120–210 only with recurring decisions | Ordinary/perfect moves and longest quiet run | No visible fatigue from repeated corridors |
| Optional mastery | One nearby friend | Meaningful rescue detour | Route planning across several optional rooms | Rescue cost; ordinary 0/perfect all | Understands “finish now” versus “help friends” |

Campaign guardrails:

- No authored ordinary route exceeds 210 inputs; no maintained later-maze quiet run exceeds 48 inputs.
- Route growth alone cannot justify a difficulty increase. A later maze needs a new inference, combined prerequisite, changed-state return, portal graph, or optional optimization.
- A route with more than 25% retraversal or a quiet run above 30 is a review trigger, not an automatic failure. The designer must identify the changed-state payoff or shorten it.
- Every content change reruns ordinary/perfect solutions and the exact metric expectations. A shorter route is rejected if it bypasses the mechanic being taught.

### Before/after campaign report

The baseline is the reviewed Plan 06 audit. “After” is the current engine-derived zero-rescue ordinary route and exact all-rescue route.

| Ch | Maze | Size | Before ordinary/perfect | After ordinary/perfect | Raw branches / required changes | Physical retraversal / non-event run | Design reading |
| ---: | --- | --- | ---: | ---: | ---: | ---: | --- |
| 1 | Little Star Trail | 6×6 | 26 / 34 | 6 / 6 | 2 / 0 | 0% / 6 | Whole-board movement prototype; no camera stack |
| 2 | Shiny Sword | 11×11 | 37 / 53 | 38 / 54 | 6 / 4 | 0% / 8 | Weapon → fair fight → reusable key |
| 3 | Splashy Boots | 13×13 | 64 / 80 | 65 / 81 | 5 / 7 | 0% / 13 | Potion/Power and water traversal |
| 4 | Rainbow Picnic | 15×15 | 80 / 92 | 82 / 94 | 8 / 9 | 0% / 13 | Two reusable-key loops |
| 5 | Toasty Toes | 13×13 | 69 / 77 | 71 / 79 | 7 / 10 | 0% / 9 | Lava recall and Power ordering |
| 6 | Moonbeam Moat | 15×15 | 92 / 104 | 95 / 107 | 6 / 11 | 0% / 14 | Three-colour route planning |
| 7 | Wishing Woods | 17×17 | 117 / 150 | 120 / 153 | 11 / 13 | 3% / 16 | Optional strong-guardian rescue |
| 8 | Ame’s Grand Parade | 17×17 | 120 / 140 | 123 / 143 | 11 / 15 | 2% / 15 | Mixed-mechanic recall |
| 9 | Springstep Sky Hollow | 19×19 | 193 / 217 | 182 / 196 | 14 / 8 | 35% / 42 | Spring Boots unlock a state-gated hole shortcut; still a child-test focus |
| 10 | Lanternlight Labyrinth | 23×23 | 173 / 216 | 150 / 205 | 18 / 9 | 29% / 48 | Room shortcut reduces ordinary endurance; rescue room remains substantial |
| 11 | Twilight Treasure Loop | 21×21 | 235 / 245 | 204 / 214 | 14 / 14 | 24% / 24 | Exit follows the blue-door chain; dense prerequisites remain the challenge |
| 12 | Moonlit Friendship Quest | 23×23 | 231 / 241 | 164 / 174 | 16 / 14 | 16% / 20 | Cross-map shortcut preserves leaf/tool/key ordering |
| 13 | Rose Heart Roundabout | 13×13 | 105 / 117 | 29 / 43 | 13 / 2 | 17% / 11 | Compact two-portal literacy and one key gate |
| 14 | Clover Comeback Carnival | 17×17 | 103 / 177 | 104 / 178 | 10 / 8 | 20% / 27 | Portal/Power comeback with expensive optional mastery |
| 15 | Friendship Crown Vault | 17×17 | 231 / 260 | 47 / 59 | 37 / 9 | 0% / 9 | Three-pair relay; all three reusable-key doors required; five rescues optional |
| 16 | Rainbow Power Parade | 17×17 | 411 / 411 | 62 / 78 | 40 / 11 | 2% / 9 | Power-99 loop, Sunny Key return, compact optional rooms |

Chapters 9 and 10 remain the principal endurance risks. Both are below baseline and have functional shortcuts, but their physical retraversal and non-event runs require direct child testing before any claim that the friction is solved.

## Sixteen-level progression and hint matrix

Hint tiers are Goal (remind the current need), Principle (state the rule), Direction (name the next meaningful landmark and broad direction), and Step (give the next engine-valid input). Repeating a hint at an unchanged state advances through those four tiers; changing meaningful state starts a fresh ladder. The sequence is saved with the active run.

| Ch | Puzzle intent and mechanic stage | Complexity / likely friction | Route quality and rescue role | Required-path hint emphasis |
| ---: | --- | --- | --- | --- |
| 1 | Introduce four-way movement, exit, and an optional friend | Very low; whole 6×6 board visible | Six inputs; friend is an equal-cost optional branch | Point toward the star; never mention the unicorn as required |
| 2 | Introduce weapon, equal-Power combat, key/door | Low; first ordered chain | Short changed-state chain; two rescue detours | Weapon, then fair enemy, then matching key/door |
| 3 | Introduce potion growth, boots, water | Low-medium; two capability gates | Compact stateful route; three rescues add 16 | Name current missing capability before direction |
| 4 | Apply reusable keys across multiple doors | Medium; colour/shape matching | Two loops, low dead travel | Identify the next required colour, not the nearest friend |
| 5 | Recall boots at lava and sequence Power | Medium; familiar rule in new skin | Dense events with short quiet spans | “Warm lava uses the same boots rule” before coordinates |
| 6 | Master three key colours and route order | Medium-high; working-memory load | Three gates, restrained retraversal | One current colour/prerequisite at a time |
| 7 | Distinguish optional strong guardian from required route | Medium-high; temptation and recovery | Ordinary skips guardian; perfect adds meaningful 33 | Required Path explicitly leaves guardian/friend optional |
| 8 | Recall mixed mechanics without a new rule | Medium-high | Stable 120-input mastery course | Re-anchor to the next required state change |
| 9 | Introduce Spring Boots and complete-hole-run jump | High; current endurance risk | State-gated shortcut, 14 rescue inputs | Principle tier explains “straight across the whole run” |
| 10 | Read rooms and return through a shortcut | High; room orientation and rescue cost | Ordinary 149; optional room drives most perfect cost | Name functional room/landmark, not raw coordinates alone |
| 11 | Deep prerequisite chain and changed exit meaning | High; 204 inputs but frequent events | Fourteen required state changes, four optional friends | Next prerequisite only; avoid revealing later chain |
| 12 | Combine leaf, poison, boots, Spring Boots, keys | High but denser than baseline | 70 ordinary inputs removed; rescues cost 10 | Engine route ensures leaf precedes poison and boots precede hazards |
| 13 | Introduce persistent portal pairs in a compact board | Medium; novel topology | 28 ordinary / 42 perfect | Explain matching flower pair, then next step through it |
| 14 | Apply three portal pairs to a comeback Power route | High; expensive perfect detours | Ordinary remains purposeful; rescue mastery is optional | Distinguish “come back stronger” from “wrong way” |
| 15 | Master a three-pair quadrant relay plus three reusable keys | High reasoning, low execution burden | 44 ordinary / 56 perfect; three doors required | State current quadrant, portal motif, and next key/door |
| 16 | Plan Power 99, retrieve Sunny Key, return to guardian | High synthesis with short loops | 61 ordinary / 77 perfect; 0/5 rescue split | Track next safe Power target or Sunny Key return; never route via friends |

## Per-level experience and semantic asset opportunities

These are semantic hooks for the art, audio, lighting, VFX, animation, UI, and controls tracks. This gameplay track does not create or restyle assets.

| Ch | Learning habit | Fair “aha” | Wonder / surprise | Joke / payoff | Functional landmark | Optional discovery | Healthy replay reason | Later-track opportunities |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Try a direction, observe | Star is only a few choices away | A unicorn waits beside the first path | “Tiny trail, enormous hero” beat | Start garden and visible star | First Rainbow-Horn Unicorn | Rescue without extra distance | Gentle first-step sound; no fog; direction affordance |
| 2 | Read capability before blocker | Equal Power is enough | Weapon visibly changes Ame | Baddie’s confidence pops at equality | Sword nook / coloured door | Two side cages | Perfect route and faster key order | Power comparison audio; weapon hold pose; key motif UI |
| 3 | Predict what equipment changes | Boots turn water into path | Splash crossing | Dry-socks quip | Boot shore | Three waterside friends | Fewer false starts | Crossing sound, hazard boundary, blocker icon |
| 4 | Remember reusable keys | One key answers several doors | Picnic route unfolds | Sandwich-shaped detour copy | Picnic clearing | Three guests | Optimize door order | Key-return sparkle; readable junction landmarks |
| 5 | Transfer a learned rule | Water boots also solve lava | Warm path opens | “Toast, not toes” | Ember bridge | Three warm nooks | Cleaner Power sequence | Heat-safe feedback; familiar boots badge |
| 6 | Externalize colour order | Keys do not disappear | Moonbeam gates align | Poggle’s nearly-correct map note | Three-colour hub | Three moat friends | Alternate key order | Strong colour+shape semantics; map markers |
| 7 | Leave and return intentionally | Strong guardian is optional now | Woods guardian remembers Ame | Guardian’s tiny treasure hoard | Guardian fork | Kitten miniboss rescue | Return at higher Power / perfect run | Nonmodal Power marker; changed-state return cue |
| 8 | Recall without prompts | Mixed rules form one parade route | Mechanic parade | Sprig announces the wrong parade order | Parade crossroads | Three spectators | Smooth mastery route | Layered musical/event callbacks |
| 9 | Inspect landing beyond holes | One input clears the complete run | First boing shortcut | Spring Boots “do not do corners” | Star-hole bridge | Three sky cages | Find shorter spring route | Landing preview, jump cadence, distinct hole landmark |
| 10 | Chunk space into rooms | A room link replaces a long loop | Treasure/monster room reveal | Monster guarding stationery | Lantern room names | Rich rescue/treasure room | Perfect-room sweep | Room-name copy, ambient audio zones, later lighting cue |
| 11 | Hold a prerequisite plan | Blue-door return completes the chain | Twilight exit appears after work | Mimic’s “definitely normal chest” | Blue-door/exit chamber | Four side-trail friends | Optimize 14-event chain | Blocker history, clue visibility, landmark labels |
| 12 | Combine old rules calmly | Shortcut collapses the return | Moonlit mixed-hazard crossing | Leaf treated as heroic salad | Poison garden / moon bridge | Five close detours | Ten-input perfect delta | Hazard-specific audio and accessible status copy |
| 13 | Build a portal mental model | Matching flowers preserve pairs | First whoosh to distant garden | Sprig waves at the wrong flower | Rose portal motifs | Three roundabout friends | Portal order and perfect route | Pair-name audio; persistent map link semantics |
| 14 | Revisit a blocker with new Power | Portal makes comeback practical | Three-garden travel | Baddie asks if Ame has an appointment | Clover return gate | Four remote cages | Large perfect-route challenge | Changed-state reminder, Power breadcrumb, portal sound identities |
| 15 | Plan a quadrant graph | H → C → M relay leads to key corridor | Three-room flower relay | Crown vault protected by very polite doors | Four quadrants / three motifs | Five species across rooms | 44-step clean route or five-friend 56 | Portal graph map semantics; key-corridor fanfare; room audio |
| 16 | Plan safe Power thresholds | The hub changes from blocked to traversable | Rainbow Guardian at 99 | Guardian’s Power sign is comically specific | Central hub / Sunny Door / guardian | Five friends and a star chest | Power-route optimization; perfect rescue | Power milestones, return cue, guardian audio/VFX, optional-room ambience |

## Companion-track coordination

| Expert track | Gameplay contract supplied here | Boundary / joint acceptance |
| --- | --- | --- |
| UI and responsive UX | Required versus optional goal, hint tier, blocker requirement, save status | UI owns placement and focus; Path and Rescue must remain distinguishable at every viewport |
| Graphics and VFX | Semantic pickup, block, portal, rescue, door, treasure, and victory events | Effects acknowledge committed state and retain static/reduced-motion equivalents |
| Art direction | Semantic object IDs, functional landmark roles, Power and pair meaning | Art cannot become the only rule cue or change capability by variant |
| Lighting and wall depth | FOV/reveal semantics and clue-first visibility | Lighting preserves player, exit, blocker, answer, portal-pair, and hint-marker legibility |
| Limited animation | Exact event order, input-inert presentation boundaries, final static state | Animation never changes solver timing; held input cannot resume behind a teaching beat |
| Performance / desktop | Deterministic workloads, fixed seeds, fingerprints, scenario checkpoints | Track owns budgets/instrumentation; gameplay correctness cannot be weakened for timing |

The controls/handheld concept is deliberately not implemented here. Its later
integration point is cardinal intent into the same engine transition, with the
empty-floor-only assist and hint/recovery semantics preserved across devices.

## Hint and reachability contract

`src/game/reachability.ts` and `src/game/hints.ts` use `movePlayer` and the stateful solver as the transition authority. There is no parallel geometric flood-fill in the UI. This matters because one input may traverse a full Spring-Boots hole run or warp between persistent portal endpoints. Exhaustive reachability reports whether its state budget completed; truncated searches are never presented as exact evidence.

For a current game state:

1. Solve from that exact state with `avoidAnimals: true`.
2. Identify the next meaningful required event on that route.
3. Derive all four hint tiers from the same route and current state.
4. Key the replay ladder by a stable state signature; persist only a bounded map of tier counts.
5. If the state is invalid or no required solution exists, give a safe recovery message and never fabricate a coordinate.

Acceptance: portal and multi-hole fixtures must prove that reachability, next step, and hint text agree with engine transitions; Required Path must finish with zero rescues on every authored level.

## Feedback, recovery, and input assists

- V22-04/09 supersedes the earlier first/third-bump policy: every fresh deliberate capability or underpowered collision opens its actionable explanation. A continuously held blocked gesture is cleared so it cannot flood dialogs. The second capability repeat still adds a persistent marker; resolving the blocker clears its repetition.
- Eligible success presentations pause repeat clocks while retaining genuine live input, observing steering/release, then resume on a fresh 160 ms cadence without replaying queued actions. Blockers, real modals, blur/hidden, resize, cancellation and level changes require fresh input. These are V22-PERF-01 candidate semantics, pending independent and affected-device acceptance.
- Corner assistance can resolve only to non-exit ordinary floor that is empty or contains a previously resolved non-portal object. It cannot finish a maze, collect an item, rescue a friend, open a door, enter a hazard, start combat, take a portal, or trigger a Spring-Boots jump. Every accepted assist still becomes one ordinary engine input.
- Help and hints are always on demand. Nothing times out, and no action sequence requires speed.
- Leaving for Home or the Adventure Book preserves a validated authored run; choosing a different maze retains the existing confirmation boundary.

## Rewards, optional goals, and replayability

Gold and Science Points communicate “I found something” and “I was curious.” They are banked on completion and displayed as keepsake totals. No copy should imply they will buy equipment, unlock progression, or be spent later. A future use requires a separately approved economy specification and migration.

Replay reasons are explicit but non-coercive: rescue every friend, improve the current-layout best route, discover optional treasure, or replay a favourite story. Best steps are scoped to the maze gameplay fingerprint. When content changes, the old best moves to `historicalBestSteps`; a current-layout record starts fresh without deleting completions, rewards, rescues, badges, or historical accomplishment.

## Identity, migration, and authored-map editing

- Every level has a positive `contentRevision` and deterministic `gameplayFingerprint` over gameplay-relevant structure.
- Authored objects receive semantic IDs based on level, kind, and intrinsic qualifier. Every repeated semantic role must declare explicit coordinate-to-ID mappings, and a golden campaign identity test binds all authored revisions to fingerprints. IDs are never intended as display order.
- Active runs use schema v3 and require a stable run ID plus an exact level ID, revision, and fingerprint. They persist both ordinary play and the pending exit choice. A mismatch fails closed by removing only the stale active run, preserves durable progress, and shows a non-modal explanation. Storage failures are surfaced rather than claiming a save or reset succeeded.
- Progress uses schema v5 with campaign order version 2, stable `unlockedLevelIds`, and a bounded completion-receipt ledger for exactly-once exit commits. Legacy numeric/v2/v3/v4 saves migrate through historical order. Counts are compatibility/display caches and are clamped to the current campaign length.
- Current-layout route records store revision/fingerprint. On fingerprint change, the previous step best becomes labelled historical evidence and cannot compete with the revised route.
- Map editing order: establish IDs/revision tests; edit map; increment revision; update fingerprint-derived expectations, solver routes, metric report, scenarios, story/docs; exercise legacy and current saves. Never silently reuse a revision for changed gameplay.

## Family playtest protocol

Recruit children near the intended reading/development range with a supervising adult. Do not coach unless a safety or consent boundary requires it. Record behaviour, not a judgement of the child.

Sessions:

1. First-time onboarding: Chapter 1, then Chapter 2.
2. Mechanic comprehension: Chapters 3, 7, 9, and 13.
3. Synthesis: one of Chapters 10–12 and Chapters 15–16.
4. Replay: one perfect-rescue attempt and two fixed Surprise seeds.
5. Adult review: save/resume, hint ladder, blocker feedback, readable objectives, and whether help felt easy to give.

Observe: first confident input; explanation of the goal; distinguish exit versus friend; recognition of equal Power; whether a player predicts boots/leaf/Spring Boots; landmark language; random-walk streaks; repeat blocker collisions; hint tier used; adult interventions; visible fatigue; delight, jokes repeated, and desire to replay.

Ask the child, without leading: “What are you trying to do?”, “What changed when you picked that up?”, “What might you try next?”, “Was anything annoying rather than tricky?”, “Do you want the star now or to help friends first?”, and “Which place do you remember?” Ask the adult: “When did you feel you had to intervene?”, “Could you explain the rule from the screen?”, and “Did hints preserve the child’s ownership?”

Success criteria:

- At least 80% of first-time children identify the Chapter 1 star goal and make a purposeful first input without adult navigation.
- At least 80% explain that friends are optional after one ordinary completion prompt; no child is told a friend is required by Required Path.
- At least 75% predict the effect of each introduced traversal tool before the second use.
- Median repeated collisions per blocker stay at two or fewer; fewer than 10% of blockers reach the modal tier.
- At least 70% of hint users resume purposeful play before tier 4; tier 4 always matches an engine-valid input.
- No observed route contains two minutes of unbroken corridor repetition without a decision, event, landmark, or self-chosen optional goal.
- At least 70% choose a voluntary replay, rescue, or Surprise Maze; adults rate intervention burden as acceptable.

These thresholds are release evidence gates, not claims already satisfied. Child, physical-device, and WebView2 sessions remain manual until recorded.

## Performance and rollback

Gameplay additions must use Plan 07A measurement. If compressed JS, CSS, or runtime-public bytes exceed the checkpoint baseline, `scripts/performance/feature-allocations.json` must contain a finite gameplay allocation with owner, reason, evidence path, review date, and rollback point. Correctness and save integrity cannot be traded for bytes.

### Plan 06 static allocation evidence

The manager-reviewed production build used `npm run build` from checkpoint `555cdd622a98bd77585f2e60f1096712392d71b3` plus the complete Plan 06 candidate. The provenance marker records runtime-input SHA-256 `6c1f0894266a5580d16f5b6f08980b7259efac83398710f9ed743f10adc43ebb` and dist fingerprint SHA-256 `ad257b4f26069e46dc141ded38c9bbb1e246ae11ba6385b84663c8686d4dfd42`. The deterministic gzip-9 gate measured 119,779 B JavaScript, 29,206 B CSS, and 89,394,012 B public runtime files: deltas of +3,959 B, +99 B, and 0 B from the Plan 07A baseline. The ledger allocation is 4,020 B JavaScript and 128 B CSS, leaving only 61 B and 29 B of compression tolerance. A source-matched external inventory records 144 dist files / 89,929,629 B at `C:\Users\hellb\AppData\Local\Temp\maze-so-puzzle-performance\plan06-manager-final-20260902-2146\inventory.json`, SHA-256 `25984a8678b5f89e6d7d28b4940426f7a7b3a185d6053d93c563dbf521a8dc87`. Timing remains contaminated/report-only; these static values do not claim a loading or frame-time improvement.

Rollback points are independently reversible: progressive-hint presentation can revert while retaining engine reachability; feedback escalation can revert while retaining safe blockers; map revisions can revert as one content batch only if revision/fingerprint and route-record handling revert with them. Never roll back schema readers before all known older saves remain accepted.

## Evidence basis

The design uses contingent and fading support rather than automatic answers; see [Wood, Bruner & Ross (1976)](https://doi.org/10.1111/j.1469-7610.1976.tb00381.x) and [Renkl, Atkinson & Große (2004)](https://doi.org/10.1023/B:TRUC.0000021815.74806.F6), accessed 2026-09-02. Cognitive-load separation follows [Sweller (1988)](https://doi.org/10.1207/s15516709cog1202_4), accessed 2026-09-02. Child-relevant landmarking is supported by [Lingwood et al. (2015)](https://doi.org/10.3389/fpsyg.2015.00174), accessed 2026-09-02. The route rubric treats T-junction/search statistics as partial proxies, following [Yokota et al. (2019)](https://doi.org/10.11239/jsmbe.57.58) and [Valenzuela et al. (2025)](https://doi.org/10.1016/j.entcom.2025.100925), accessed 2026-09-02. On-demand hints are deliberately measured because hints can impair as well as help performance; see [O’Rourke, Ballweber & Popović (2014)](https://doi.org/10.1145/2556325.2566248) and [Wauck & Fu (2017)](https://doi.org/10.1145/3025171.3025224), accessed 2026-09-02. Objective, input, and difficulty-accessibility requirements are adapted from [Microsoft XAG 107](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/107), [XAG 108](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/108), and [XAG 109](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/109), accessed 2026-09-02.
