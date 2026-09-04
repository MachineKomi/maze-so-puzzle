# Product-direction intake — campaign asset ecology and world theming

- Captured: 2026-09-03
- Source: direct Human direction while Plan 03 completes final static art
- Status: captured and routed; no level, generator or rendering change implemented
- Primary destination: Plan 09 campaign expansion and its bounded generated-
  topology sub-phase

## Human direction

The final art library should be used deliberately rather than leaving approved
enemy, friend or environment families invisible. Across the story campaign,
players should gradually meet new enemy types in the way a good JRPG reveals its
world. Individual mazes may use a tightly related cast, a varied mixed cast, or
an especially broad showcase. A skeleton-and-lizard maze and a later maze using
every enemy type are desired examples.

Generated mazes do not need a campaign debut curve, but they should vary their
encounter composition: sometimes one repeated type, sometimes a coherent
subset, and sometimes a broad mixture.

Friends should receive similarly varied and effective use. The Human is open to
random selection, thematic rescue groups, or a thoughtful combination and has
delegated that choice to the manager.

Generated mazes may vary floor and wall textures, but only through combinations
that are attractive, legible and non-clashing. Each authored story maze should
instead have a fixed, deliberately chosen environment. A map with two or more
spatially separated or portal-linked sections may give those regions distinct
but harmonious—or deliberately contrasting—floor and wall materials so travel
feels like movement between places.

## Manager decisions

### What “use all assets” means

- At the Plan 09 content freeze, create one exhaustive typed gameplay-content
  eligibility registry (expected at `src/game/contentRoster.ts`) keyed by stable
  type-level `EnemyStyle` / `AnimalSpecies` identities (or explicitly renamed,
  versioned final equivalents). It—not the art catalogue's `active`, `dormant`, `deprecated` or
  `superseded` delivery lifecycle—declares campaign and generated eligibility,
  encounter-family tags, and the owner/reason/review gate for exclusions.
  Individual authored placements retain separate level-scoped semantic
  `LevelObject.id` values and coordinates; inserting an object never renumbers a roster
  type. Each final approved Mimic family uses its own stable disguised-object
  family identity rather than an ordinary enemy-style entry.
- Every final Human-approved enemy identity and rescue-and-collect friend species
  intended for gameplay is included by default. Exclusion is a product decision
  requiring explicit Human deferral with a reason and return gate, not a routine
  way to make the coverage report pass. If the final roster cannot fit the debut
  pacing bounds, return the conflict for a pacing/roster decision rather than
  silently dropping a type.
- Coverage applies to every final semantic gameplay identity marked campaign-
  eligible in that registry—not every source master, resolution, animation
  frame, rejected candidate or superseded file.
- Every such enemy type receives at least one meaningful, reachable authored
  campaign placement. A late all-roster showcase cannot be its only legible use;
  each type first receives a readable spotlight or small ensemble placement.
- Every final rescue-and-collect friend species appears in at least one fixed
  authored campaign rescue. No species is obtainable only through generator
  luck, an Egg, co-op, or a future mode.
- Reconcile Plan 03's final integration manifest for every other gameplay-facing
  family too: weapon renditions, cages, keys/doors, portals, treasures/Science
  pickups, traversal items, hazards, floor/wall recipes and dressings each need
  at least one deliberate authored or generated consumer, or an explicit owner,
  reason and review gate. Recolour/optical/animation derivatives do not inflate
  this count, and a family is not shoved into a maze where it harms clarity.
- UI-only, Garden-only, co-op-only and branding assets are used by their owning
  plans and are not forced into a maze merely to turn a coverage cell green.
- Any final catalogued identity that is deliberately not used receives an
  explicit gameplay-eligibility disposition, owner, reason and later review gate
  (plus an art-lifecycle update only when relevant); silent omission is not
  allowed.

### Authored campaign ecology

- Campaign enemies and friends are fixed content attached to stable semantic
  object IDs and level revisions. They are not rerolled when a player restarts,
  reloads or replays a story maze.
- Build a 24-chapter debut/use matrix. Early chapters use a small, familiar cast;
  later chapters introduce new silhouettes gradually. A normal chapter should
  introduce no more than two previously unseen enemy types, and a debut should
  be visible in a quiet-enough first encounter before that type joins a crowded
  ensemble.
- By Chapter 23, every campaign-eligible enemy type has debuted through a real,
  reachable interaction. Chapter 24 is the preferred all-roster festival:
  retain no more than twelve interactive guardians, distribute them through
  readable rooms/spokes, and present all remaining enemy identities as clearly
  non-colliding festival cameos rather than solver-visible `EnemyObject`s. No
  more than six enemy actors should share the normal 6×6 camera unless a measured
  readability/performance review approves a bounded exception. Roster coverage
  cannot turn the ordinary route into an endurance battle.
- Include several strongly themed ensembles and several mixed ensembles. A
  skeleton-and-lizard ruin/guard ensemble is preferred for final Chapter 13,
  `lanternlight-labyrinth`, whose existing Lantern Ruins/monster-room identity
  already supports it. Exact placements are frozen only after the final Plan 03
  catalogue and the 24-level pacing audit are available.
- A visual enemy type never implies a secret combat mechanic. Every guardian
  retains the universal Power comparison and child-friendly outcome unless a
  separately approved gameplay specification says otherwise.
- A Mimic is not a cosmetic enemy-style swap. PT22 is routed into Plan 09: define
  one versioned Mimic-family registry whose final approved entries—including
  Treasure and Candy when both pass Plan 03—map stable closed, good-open and
  revealed-enemy art identities onto the same disguised-chest behaviour. Commit
  each object's seeded 65/35 reveal before interaction and prove required paths
  remain solvable under either outcome. Migrate the current always-visible Candy
  Mimic placement out of the ordinary enemy-style contract under a level content
  revision while preserving durable progress and historical generator versions.
  If an unmet predecessor contract blocks a family, return it to that owner or
  seek explicit Human deferral; do not silently exclude it, fake it as an always-
  visible guardian, or change art lifecycle merely to make coverage pass.
- Campaign friends use curated fixed groups. Early chapters favour familiar
  animals; mythic friends enter gradually with suitable world/lore context.
  Some mazes use a coherent habitat or folklore group, while others deliberately
  mix surprising friends. Repetition is allowed when it serves recognition or
  story, but the complete roster receives authored coverage.

### Authored environment direction

- Every story maze declares one fixed `EnvironmentManifest` as part of its
  versioned design packet. It contains a required base/default complete recipe
  and one to four complete named region assignments. A single-region level uses
  the base recipe for its sole region. The manifest is chosen for mood,
  landmarking, clue contrast, neighbouring-chapter variety and compatibility
  with that maze's hazards, objects, enemies and friends—not randomly at runtime.
- Each environment recipe references catalogued floor, wall, dressing and
  treatment identities. One resolved level-wide light source/profile governs
  every region and compatible wall/object cue; Plan 09 must not introduce
  independent per-region light directions. Every floor/wall pair must pass both
  catalogue compatibility checks and actual-size visual review; numeric hue/
  lightness metadata is a guardrail rather than proof of beauty.
- Portal-linked islands, quadrants or other clearly separated spaces may use two
  to four of the manifest's named visual regions. Each tile resolves to exactly
  one region, each
  region is spatially coherent, and transitions are intentionally authored.
  A recipe swap never changes collision or rules. A stable semantic region ID
  may support landmark names and Hint/Direction language, but material/colour is
  never the sole clue. If a region boundary or semantic ID is used by a hint,
  objective or story instruction, that semantic map is content-versioned and
  fingerprinted; the visual recipe assigned to it remains presentation metadata.
- Region contrast must remain attractive and navigationally useful. Avoid a
  patchwork of per-tile skins, texture seams, camera-relative swimming, or a
  theme change that makes a safe floor resemble a hazard or a wall resemble a
  route.
- The minimap stays semantically quiet. It does not reproduce detailed textures;
  a region boundary appears there only when it materially supports the puzzle
  and remains subordinate to topology, blockers, portals and the player.

### Generated-maze variety

- Surprise Maze presentation is deterministic for a seed, topology/rules
  generation version and presentation-roster version. Enemy style and complete
  environment-recipe selection use separate random streams from topology/rules
  so adding art cannot perturb a maze layout, Power, reward or solution.
- Enemy composition has exact modes: `single-style` repeats one eligible style;
  with `N` enemy slots, `themed-ensemble` uses 2–`min(4,N)` distinct styles from
  one tagged family; `mixed-ensemble` uses two distinct styles from two families
  when `N=2`, or 3–`min(6,N)` distinct styles spanning at least two families when
  `N>=3`. A no-enemy maze has no composition draw. A one-enemy gentle maze is
  forced to `single-style`; it is not a failed themed/mixed sample. Draw only
  from feasible modes and stable-ID-sorted, versioned eligible pools—never
  silently degrade a selected multi-style mode.
  Property cohorts prove that every mode occurs and no style becomes effectively
  unreachable or overwhelmingly dominant.
- Mimics remain outside those ordinary-enemy composition modes. The versioned
  Mimic-family registry separately freezes `generatedEligible` for every final
  approved family. Under a new generated-content version, generation may place
  at most one disguised Mimic in a solver-proven optional chest/treasure slot;
  zero is an ordinary result. Family selection and the committed 65/35 reveal
  use deterministic streams isolated from topology, required rewards, ordinary
  enemy composition and solution truth. Seed cohorts cover every generated-
  eligible family and both reveal branches without making either branch required.
- Friend selection is deterministic and without duplicates within a maze. It
  alternates between compatible thematic groups and mixed groups across seed
  cohorts while preserving the fixed per-maze rescue count and solver rules.
  Because friend species participates in gameplay identity, its stable eligible
  roster and selection algorithm have a distinct generated-content version and
  feed the gameplay fingerprint; they are not folded into a visual-only version.
- Generated environments select one complete prevalidated catalogue recipe,
  never arbitrary floor and wall files. Every eligible recipe satisfies contrast,
  accessibility, seam, hazard and object-readability gates.
- Current generated active runs are deliberately not persisted. Preserve
  historical golden seeds, records, and deterministic debug reconstruction by
  pinning the topology/rules, generated-content and presentation-roster versions;
  do not promise migration or resume support for a save state that does not exist.

## Acceptance outline

- A machine-readable 24-row ecology matrix records every enemy debut/use,
  friend rescue, weapon, cage, treasure/pickup, environment region, hazard,
  portal, light/VFX opportunity and neighbouring repetition.
- Automated coverage proves every eligible enemy and friend identity has the
  required authored use, every debut precedes the all-roster showcase, every
  other gameplay-facing family in the final integration manifest has a real
  consumer or explicit disposition, and no default/fallback image is counted as
  intentional coverage.
- Chapter 24 validation separately counts at most twelve interactive guardians
  and the complete non-colliding cameo roster; cameos cannot enter collision,
  combat, reachability, solver state, or required-route Power accounting.
- Adding/removing Chapter 24 cameos does not enlarge solver search state. Level
  entry and room transitions meet asset/decode/frame-time budgets; load the next
  room's cameo art ahead of reveal rather than eagerly decoding the whole roster
  if the measured all-at-once path fails.
- Every authored maze has one fixed valid one-to-four-region manifest. Multi-
  region fixtures prove full tile assignment, stable world-space texture coordinates, clean
  boundaries, portal/camera continuity and unchanged engine/solver results.
  Rendering groups geometry by recipe/region rather than adding one DOM/SVG node
  per tile. Deduplicate each required URL and load it at most once inside the
  current plus bounded-imminent neighbouring/portal-region dependency closure;
  never eagerly preload every region merely because it belongs to the level.
- Large deterministic generator cohorts cover every composition mode, all
  eligible families over the declared coverage horizon, compatible environment
  recipes, historical golden-seed reconstruction, friend-content fingerprints,
  the one-enemy fallback and separation from topology randomness.
- Actual-size browser/Tauri reviews sample quiet, themed, mixed, all-roster and
  multi-region levels across the required device matrix, with no illegible
  crowding, visual clash, missing resource, decode hitch or accessibility loss.
  Festival cameos must read as celebration/background guests—not unresolved
  blockers—through shape, position and static copy as well as colour or motion.
- Family playtesting confirms that new enemy introductions create curiosity,
  themed casts feel memorable, mixed casts feel varied, and the showcase feels
  celebratory rather than exhausting.

## Non-goals

- No new combat rules, elemental affinities, damage types or enemy attacks are
  implied by this content-distribution contract.
- No story-maze roster or material theme rerolls on replay.
- No persistence contract for generated active runs unless a later approved save
  specification first introduces such saves.
- No requirement to animate every enemy or friend; approved static fallback is
  a first-class presentation.
- No arbitrary asset dumping, every-file loading, per-tile random skinning, or
  retention of superseded assets merely to claim “variety.”
