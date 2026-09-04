# Maze so Puzzle — game vision and design authority

Status: manager-reviewed product authority for the improvement programme

Decision date: 2026-09-02; art-craft calibration added 2026-09-03

Applies to: Plans 01–15, the root compatibility and release-candidate
checkpoints, their implementation work, and any explicitly approved follow-on
work created by Plan 14

## 1. Purpose and authority

This document records the human-authored product decisions that every specialist plan must serve. It describes the intended game, not a claim that every target is already implemented.

Use these evidence labels when another document appears to disagree:

- **Human decision** — directly requested by the game's author; locked unless the author changes it.
- **Current fact** — verified in the current source, tests, or a reproducible build; it may change through implementation.
- **Adopted direction** — the manager-reviewed way the programme will satisfy the human decisions.
- **Hypothesis** — a promising idea that still needs implementation evidence or playtesting.

For desired behaviour, human decisions in this document outrank specialist-plan recommendations. For current behaviour, source and tests outrank historical prose. The integrated roadmap defines sequencing and ownership; each specialist plan supplies deeper implementation detail. If implementation reveals a genuine conflict, record it rather than silently choosing a different product direction.

## 2. Product north star

**Maze so Puzzle is a warm, funny, magical anime-JRPG maze adventure made first for Ame: a game in which noticing, remembering, trying again, and asking for help turn difficult-looking puzzles into joyful victories.**

The player should feel:

- curious when a new maze opens;
- oriented enough to form a plan;
- safe enough to experiment;
- clever when a relationship clicks;
- surprised by how familiar ingredients are recombined;
- rewarded for both finishing and exploring; and
- eager to share the next discovery with a parent or play it independently.

The game may be challenging and may take perseverance. It must not depend on arbitrary guessing, hidden rule changes, endurance walking, a soft lock, or an uncommunicated exception. Help from Mum or Dad is welcome shared play, never evidence that the child has failed.

## 3. Audience and priority play contexts

The primary audience is a young child playing independently or alongside a supervising adult. The primary play contexts are:

1. iPad or a comparable landscape tablet;
2. desktop or laptop;
3. television play through Steam Deck with an Xbox controller; and
4. landscape mobile phone as a complete, playable secondary target.

Phone presentation may be denser and physically smaller than the primary targets. It must still expose every required function and remain playable. The product may recommend a tablet, desktop, or TV for the best experience. Portrait gameplay may use a clear rotate-to-landscape interstitial.

The web and Tauri builds are two hosts for the same game, not different editions. They must retain the same rules, content, visual identity, interaction semantics, and save-safety expectations, subject to platform-specific storage and packaging disclosures.

## 4. Locked product decisions

These are **Human decisions**.

### 4.1 UI, UX, and layout

- The maze, minimap, Adventure Bag, rescue state, objective, Power, and controls should receive as much useful space as the current screen permits.
- The minimap is a first-class puzzle tool and must be generously sized on iPad, desktop, and TV. It must not sit inside tall empty bands.
- All Adventure Bag items must be visible. The grid must wrap or otherwise fit its real content; clipping an item is a release blocker.
- The right-side play UI requires a true composition overhaul. Fixed empty tracks, blank bands, and decorative negative space that prevents useful information from fitting must be removed.
- Unused space on either side of the large maze view must become purposeful board or information space.
- The play composition should be near-identical across TV, desktop, iPad, and phone: the same information hierarchy, section order, labels, capabilities, and visual relationships. Responsive geometry may compact, wrap, or move a stable section only when required to keep the game usable; it must not create a different feature set or a device-specific puzzle experience.
- iPad, desktop, and TV are optimized first. Phone remains functionally complete and playable even when its compact presentation cannot be equally spacious.
- The finished interface must look like a polished, authored video-game UI from
  the same world as the approved sprites—not a generic clean web dashboard with
  themed images. Carry the Art Bible's paper-cut signals, magical surfaces,
  painted-world hierarchy, shape language, colour discipline and delightful
  specificity through HUD groups, menus, dialogs, prompts, focus and transitions.
- A leading Maze-native surface language is luminous milky/pearl magical glass:
  softly frosted bodies, quiet opaque text centres, bright inner rims, gentle
  world colour, controlled depth and sparse storybook ornament. This is a
  material direction, not permission to stack translucent cards or continuously
  blur the moving maze. Full/lite/static recipes must retain the same hierarchy,
  contrast and identity.
- Kirby, recent Mario Party games, Trails in the Sky, and Super Mario Bros.
  Wonder are taste references for joyful polish, expressive hierarchy,
  readability and crafted console-game presentation only. Maze must retain its
  own panel shapes, layout, icons, typography, logo, transitions and trade dress.
- Typography is deliberately art-directed and locally packaged: a warm rounded
  display/control voice plus a highly legible text treatment, with documented
  licence, exact weights, glyph/arithmetic coverage, stable figures where useful,
  fallback, byte cost, couch-distance legibility and 200% resize behaviour.
- Use large approved presentation renditions when a contextual moment can afford
  them. In particular, a blocker dialog prominently shows the exact required
  item's beautiful large image plus short real text. Preserve the existing
  blocker interaction and improve its semantic asset resolution/composition
  rather than creating a duplicate flow. Never blur a field sprite by enlarging
  it; never preload the whole presentation catalogue to support one visible
  dialog.

### 4.2 Ame and the art direction

- Ame must have **blonde hair and blue eyes** in every field sprite, portrait, story image, animation frame, promotional image, and derivative. These are identity facts, not palette suggestions.
- Candidate C's approved shoulder-brushing, softly layered hair is slightly
  longer than the historical runtime bob so Ame more closely resembles the real
  Ame while preserving the character the child already loves. The model sheet
  fixes its landmarks before broad asset or animation production.
- The style remains clean, simple, chunky, cute, warm, and readable at small scale, with a somewhat stronger anime character language and polished fantasy-JRPG finish.
- The Human-supplied PPBA pre-production specification is an approved
  **craft-calibration source** for stronger silhouette massing, disciplined
  detail, material rendering, contour logic, visual-layer separation, and
  production consistency. It is adapted through Maze's own Art Bible rather
  than transplanted: PPBA characters, world, palette, props, compositions,
  prompts, UI skin, brand language, and pixels never become Maze canon.
- The Human explicitly adopts PPBA's colour-aware outline *technique* as craft
  for Maze's current `mgjrpg-02` / `storybook-local-contour-v1` rendering
  profile. Each stable contour section follows the nearest enclosed Maze
  material and becomes a darker, slightly richer member of Maze's established
  deep-plum family: warm gold-plum, aubergine, blue-plum, russet-plum,
  leaf-plum, or pale-material mauve as appropriate. The darkest ink is reserved
  for eyes, mouth, deep occlusion, critical separation, or genuine contrast
  need. Uniform black outlines, pixel-level rainbow switching, muddy pale edges,
  and chromatic halos are not acceptable.
- Characters, friends, enemies, weapons, items, props, cages, locks, doors,
  portals, rewards, and semantic UI cutouts use that family-appropriate contour
  treatment. Cream sticker
  cutlines remain exclusive to semantic UI/reward signals. Terrain, walls,
  liquids, and hazards instead use related material boundaries, values, patterns,
  and seams and never receive enclosing character outlines. This direction
  copies no PPBA pixel, prompt, palette, motif, layout, brand, or trade dress.
- The intended relationship is shared quality and taste, not a shared or copied
  look. Maze retains its own magical-girl storybook world, mint/lilac/coral/plum
  identity, motif meanings, child-safe warmth, cast, and named inspirations.
- The author's taste references are *Chillin' in Another World with Level 2 Super Cheat Powers*, *I've Been Killing Slimes for 300 Years and Maxed Out My Level*, *Ragnarök Online: New World*, *Idle Poring*, *Ragnarök M: Eternal Love*, and *Trails in the Sky*. These references communicate principles—bright readable characters, cosy fantasy, expressive faces, appealing chibi proportions, charming adventure, and clear handheld-RPG presentation. Do not copy a protected character, costume, logo, composition, prop, UI skin, or franchise-specific visual signature. Production prompts should translate the principles into original descriptive traits rather than request imitation.
- Existing successful identity anchors may be refined, not casually discarded. Cohesion must not flatten the individual personality of Ame, friends, enemies, places, or rewards.
- On 2026-09-03 the Human approved Plan 03's Candidate C as the canonical static
  Ame v02 direction after reviewing its comparison, actual-size and model-study
  proofs. Its golden-blonde shoulder-brushing layers, blue eyes and preserved
  Ame identity are now visual canon. Plan 03's v6 publication decision has
  produced, proved, and atomically selected the versioned Ame v02 field and
  portrait derivatives while preserving the v01 files as rollback authority.
- Candidate C's approved identity/construction is not reopened by rendering
  calibration. Her warm young face, golden-blonde shoulder-length layered hair,
  clearly blue irises, proportions, mint/lavender/backpack costume, silhouette,
  pose, registration, and emotional character are immutable. On 2026-09-03 the
  Human approved Fresh B-led 01 as Ame's static `mgjrpg-02` rendering choice
  because it is clearest at her common small gameplay scale; Fresh B-led 02 is
  appealing at source size but is not selected. This approves rendering craft,
  not a replacement identity. The published cleaned derivative and catalogue
  pointer remain governed by Candidate C as the sole construction authority.
- The Human also approved the fresh low flower-petal Rose Heart teleporter
  construction, subject to a brighter and clearer centre heart plus a truly
  flat plain extraction matte, and approved the v03 Wholesome Succubus, Pocket
  T-Rex, Kappa, and Treasure Mimic as concept/render-family references. Concept
  boards must never be cropped into production masters; each isolated asset is
  authored independently from its locked brief.
- `mgjrpg-02` revision 4 governed the completed controlled family-by-family
  source production. Each presented batch used one lightweight named, single-scale
  review page. After an explicit Human response, unlisted assets in that batch
  are approved by default and named exceptions return as independent
  generations in the next batch; silence is not approval. The final v6 map
  publishes the approved static catalogue through explicit rights, derivative,
  byte, pointer, and rollback gates; physical retirement remains Plan 12 only.
- The earlier Plan 03 authorization produced source-only Maze-native title,
  home-splash, logo, and Ame-face icon studies. The v6 publication decision does
  not promote them: Batch 21 has no final exact wordmark authority and platform
  branding remains provisional. Plan 11 owns the final front-door selection,
  exact lettering, platform optical set, and runtime integration, retaining good
  approved work by default rather than imposing a regeneration quota.
- The current title route is also the home/menu surface. The early title and
  home-splash illustrations receive distinct responsive roles within that front
  door or an explicit reserved disposition; they do not justify a redundant new
  screen. Keep illustration, exact live title and logo separable. Generated
  lettering is concept-only until “Maze so Puzzle” is reconstructed with exact
  controlled lettering, checked at delivery sizes and explicitly approved.
- On 2026-09-03 the Human rejected the v08 deterministic contour-overlay packet
  as a meaningful art-style decision: at gameplay size its local contours read
  too close to black and its historical interiors remained materially
  unchanged. Future `mgjrpg-02` work must be newly authored from the approved
  family/identity briefs, with massing, three-value grouping, material paint and
  brighter visibly chromatic local contours designed together. A recolour,
  dilation or post-stroke of an old sprite is analytical evidence only and
  cannot be offered as a replacement. Semantic UI options instead use clean
  cream-cut sticker construction. Candidate C's identity approval remains
  unchanged; only her rendering treatment is being compared.
- The Human-directed future guardian roster is Classic Slime, Lizard Sword
  Guard, Lizard Spear Guard, Wholesome Succubus, Pocket
  T-Rex, Cultist (public label pending), Lamia, Soda Slime, Orc Chieftain,
  Cyclops, Minotaur, Warrior Skeleton, Kappa, and Treasure Mimic. Their approved
  runtime derivatives now have stable dormant catalogue identities, but no
  placement, preload, mechanics, animation, progression, or balance is implied.
  They remain kind Puzzlewild guardians under the universal Power and Polite
  Sword rules. `docs/enemies/ENEMY_FAMILY_SHEET.md` owns their original design,
  child-safety, sibling-construction and naming constraints.
- Tea-Time Skeleton is a Human-approved rescue-and-collect friend, not a
  guardian or enemy. His approved green-tea sprite is catalogued under the
  dormant friend identity `green-tea-skeleton`; later content admission remains
  with friend rescue and Friend Garden contracts. His toy-bone construction may still be a visual consistency
  reference for Warrior Skeleton without implying shared gameplay taxonomy.
- Treasure Mimic and the existing Candy Mimic are distinct visual chest
  families but share the single PT22 disguised-chest rule: matching closed and
  benign-open states, then a committed 65% reward / 35% revealed-guardian result.
  Once that feature lands, Candy Mimic does not remain an always-visible ordinary
  enemy except through an explicit Human deferral or pinned historical version.

### 4.3 Game design, gameplay, and challenge

- Every authored maze must be mechanically solvable, solver-verified, and human-readable. Ordinary completion and the intended perfect-rescue route must both be valid.
- Challenge should come from noticing, comparison, prediction, sequencing, route choice, memory aids, changed-state returns, and combining known rules—not from excessive corridor length or repetitive neutral retraversal.
- Later story levels should become more puzzly and challenging while remaining fair, intuitive, and recoverable.
- Required objectives and optional rescues/rewards must be unambiguous. Optional play must not be secretly required or presented as failure when skipped.
- Hints should be progressive and on demand: remind, orient, narrow, then reveal only when requested. A Path hint must not prioritize an optional rescue.
- The game should make intelligent, varied use of its full library of art, sound, music, characters, terrain, hazards, items, lighting, animation, and effects. Variety should come from meaningful combinations and pacing, not indiscriminate simultaneous clutter.
- The authored campaign should reveal its guardian cast like a welcoming JRPG journey: begin with a small recognisable vocabulary, introduce new enemy silhouettes gradually in readable encounters, alternate memorable themed ensembles with surprising mixed casts, and eventually earn a late all-roster celebration. Every final Human-approved guardian intended for gameplay is campaign-eligible by default and receives a meaningful interactive use before that celebration; exclusion requires an explicit Human deferral, and art-file lifecycle state alone never decides gameplay eligibility. The celebration may use a bounded interactive guardian set plus non-colliding cameos so completeness does not become clutter, preload waste, solver explosion, or a combat gauntlet.
- Every final rescue-and-collect friend species receives at least one fixed authored campaign rescue. Story-maze friends are curated for habitat, lore, pacing and occasional delightful contrast; generated-maze friends may vary through deterministic themed or mixed selections. No friend is available only through lucky procedural generation, co-op, or an Egg.
- Each story maze has a fixed art-directed floor/wall environment. Clearly separated rooms, islands or portal destinations may use distinct compatible regions so they feel like different places, while generated mazes choose deterministic variety only from complete validated non-clashing environment recipes. Named regions may reinforce landmark and Hint language, but texture or colour is never the sole clue; one resolved level-wide light source still governs every region.
- Each chapter should contain at least one memorable beat of wonder, surprise, humour, discovery, or emotional payoff. A surprise must remain legible and mechanically fair.
- The experience should be engaging and encourage healthy voluntary replay through mastery, curiosity, expression, discovery, and warm rewards. It must not use coercive retention, monetization pressure, punishment, or manipulative compulsion.
- Educational value should emerge from habits of thought—directions, comparison, prediction, decomposition, observation, revision, and perseverance—rather than worksheet-like interruption.
- Above all, the game should be fun and rewarding.

### 4.4 Visual effects, lighting, and animation

- Combat, rescue, collection, doors, portals, victory, water, lava, poison, items, and other important moments should be clear in a paused frame and delightful in motion.
- Effects are flourishes over authoritative game state. They must never be the only way to understand a rule or outcome.
- Walls and grounded objects should feel materially more three-dimensional through coherent highlights, bevel/depth cues, contact shadows, and cast shadows.
- Each maze may use a wider range of believable light angles. A single resolved light source must govern compatible scene cues; extra realism must be stylized to the game's clean, cute art direction rather than becoming photorealistic or muddy.
- Limited animation should use a few purposeful drawings for clear actions and emotions. Strong held poses and readable expressions matter more than high frame count.
- New animation frames must derive from the final approved Ame model and final static family art. Animation must not become a parallel character redesign.
- Full, reduced-motion, and static/fallback presentation must communicate the same trigger, identity, location, and result.

### 4.5 Controls and couch play

- After the game is open, every normal player journey must be completable with an Xbox controller alone: title, story, maze selection, gameplay, Hint, Help, Adventure Book, menus, confirmations, victory, replay, and return.
- Television play through Steam Deck with an external wired or Bluetooth Xbox controller is a primary scenario.
- D-pad and left-stick movement must resolve to the same cardinal game actions as other direct inputs, with predictable tap, hold, release, diagonal, deadzone, focus, disconnect, and reconnect behaviour.
- Controller support must be implemented in the shared web application and must not fork game rules. Steam Input should expose a standard gamepad rather than depend on mouse/keyboard emulation for the supported route.
- A/B semantics, focus location, prompts, safe destructive confirmations, and controller scrolling must remain consistent and visible at couch distance.
- Hardware-dependent claims require real-device evidence. Missing hardware may defer a release claim, but not deterministic implementation and mocked integration coverage.

### 4.6 Performance and platform quality

- The desktop app should start, respond, animate, save, resume, and play with native-quality smoothness while remaining locally playable offline once its required webview runtime is present.
- The web app should load only what its current screen needs, become useful quickly, respond immediately, and remain smooth on the primary devices and a defined low-end profile.
- Performance work should remove invisible or redundant work before reducing visible charm. Art, music, lighting, effects, and animation may be right-sized or quality-tiered only with perceptual and semantic parity.
- No optimization may weaken engine determinism, save integrity, accessibility, reduced-motion behaviour, or controller correctness.
- Give Amelia meaningful opportunities to play improvements before the complete
  programme ends, but package only green, low-rework milestones rather than every
  specialist handoff. The preferred first family preview follows Plan 01 so it
  combines final static/front-door art with the rebuilt interface; an earlier
  post-Plan-03-and-03M Art Preview is optional when runtime art plus the current
  asset/audio catalogue are already green and cheap to package.
- A family preview comes from one reviewed, committed and pushed checkpoint and
  records exact versions, commit, artifact hash, build environment, included
  milestone, known issues, smoke journey and rollback. It is not a claim of
  public release, signing, store readiness, complete performance qualification,
  or physical-device/accessibility coverage.

## 5. Experience pillars and design tests

### 5.1 Kind clarity

The player understands the immediate goal, can distinguish required from optional, and receives reassuring exact feedback when blocked. A stronger guardian is a future plan, not damage. A mistake yields information.

**Design test:** after one relevant encounter, can the child say what stopped Ame and name or seek the kind of answer without being shown the route?

### 5.2 Productive puzzling

A good challenge creates a meaningful choice or inference. Backtracking is strongest when the state has changed, the return is anticipated, or a shortcut makes the new understanding tangible.

**Design test:** can a reviewer point to the decisions and discoveries that make the route hard, separately from the number of movement inputs?

### 5.3 Wonder through recombination

Known ingredients should appear in fresh relationships: a portal changes how a map is understood, a visible guardian creates a future goal, a hazard crosses a return route, or art/audio transforms the mood of a familiar rule.

**Design test:** does the chapter have a signature moment that is surprising on first play but explainable afterwards?

### 5.4 Warm reward

Celebrations acknowledge completion, curiosity, rescue, learning, and replay without suggesting that ordinary completion was inadequate.

**Design test:** does the player leave a maze feeling proud, including when optional friends remain for next time?

### 5.5 Shared-world cohesion

UI, characters, terrain, VFX, light, motion, sound, copy, and controls should feel authored for the same game and communicate the same state.

**Design test:** if motion and colour are removed, do silhouette, position, text, shape, and static composition still tell the truth?

## 6. Shared acceptance requirements

These gates apply across specialist ownership.

- No supported state clips required content, including the seven-slot Bag and five-friend tracker.
- The primary target layouts make the minimap visibly generous and eliminate accidental empty bands/tracks.
- Every supported input source is inert behind the topmost modal or presentation lock and cannot replay a stale held action.
- Every revised or new authored level has stable content identity, a versioned migration policy, an ordinary solution, an exact perfect-rescue solution, and replayable solver evidence.
- The final 24-chapter ecology matrix accounts for every gameplay-eligible enemy and friend identity, records first introductions and repeat ensembles, assigns fixed authored environment recipes/regions, and gives every excluded final catalogue identity an explicit owner, reason and review gate rather than silently stranding approved work.
- Generated enemy/theme presentation and friend-content selection are deterministic and versioned independently from topology/rules generation and from each other. Friend species belongs to gameplay identity; enemy skin and complete environment recipe remain presentation. Every selected recipe is catalogue-valid and visually reviewed, and changing either eligible roster cannot silently reinterpret a historical golden seed, record, maze or reward truth. Generated active runs are not currently persisted, so no specification may claim resume migration for them unless a later save contract introduces it.
- No ordinary authored solution requires an optional rescue unless the product author explicitly changes the global rule and the game clearly discloses that exception.
- New static art and animation frames pass actual-size review; every depiction of Ame preserves blonde hair and blue eyes.
- Across static families, the smallest supported view must share coherent
  three-value grouping, focal contrast, material truth, perspective, and
  detail-frequency grammar without erasing subject personality. Cutout actors,
  items, props, and icons additionally require a readable silhouette, two to
  four large colour masses, and family-appropriate local contours. Periodic
  terrain and hazards instead require readable mass, material pattern,
  boundary, edge, and seam hierarchy—not character-like enclosing contours. A
  source-size-only resemblance is not acceptance.
- Every important visual event has a reduced/static semantic equivalent and cancellable lifecycle.
- Visual, input, save, and performance checks cover at least 1280×720 desktop/TV, 1024×768 tablet, 960×540 Tauri minimum, 844×390 phone landscape, and 568×320 minimum phone landscape, with physical-device gates recorded honestly.
- Web and packaged Tauri builds pass the same game-rule and content tests; platform limitations are documented rather than hidden.
- Documentation distinguishes implemented evidence from targets and is updated in the same specialist change that alters its authority.

## 7. Current campaign and approved expansion

**Current fact:** the inspected 0.19.0 campaign contains 16 authored story mazes.

**Human decision:** after Plans 01–08 have been implemented and integrated, Plan 09 will expand the campaign to 24 authored story mazes:

- four new mazes inserted at deliberate points within the existing journey; and
- four new mazes placed after the current final maze.

Existing stable level IDs and earned records should be preserved. Chapter numbering, unlock logic, Continue behaviour, story metadata, achievements, and save migration must be made campaign-length-safe rather than patched with new hard-coded `24` values. The four post-finale chapters must extend the world without claiming that the earlier victory did not count.

Plan 09 owns final placement and level content after it audits the integrated eight-agent result. Earlier agents should build scalable contracts and reserve this content scope; they should not independently add the eight mazes.

## 8. Documentation map and change control

The improvement programme uses these durable documents:

- `docs/GAME_VISION_AND_DESIGN_SPEC.md` — human product authority and shared acceptance.
- `docs/plans/00-integrated-implementation-roadmap.md` — execution sequence, ownership, gates, and handoffs.
- `docs/plans/01-...` through `15-...` — specialist, campaign, closure,
  retirement, opportunity-review and process-retrospective detail.
- `docs/STORY_BIBLE.md` — shipped narrative canon and educational arc; update when story content changes.
- `docs/ARCHITECTURE.md` — shipped technical authority; update when a new architecture replaces the old one.
- `docs/AI_ASSET_PROMPTS.md` and source records — exact asset provenance, not a substitute for the art bible.
- Specialist implementation specs named in the integrated roadmap — shipped subsystem contracts.
- `README.md`, `docs/PROJECT_AUDIT.md`, and `docs/RELEASE_CHECKLIST.md` — player/release evidence; never describe unshipped targets as complete.

Any material change to Ame's identity, the device hierarchy, rescue optionality, core rule semantics, campaign expansion count, or child-safe tone requires explicit human approval. Specialist agents may tune measurements and implementation details within those decisions, documenting why and how they verified the result.

## 9. Programme definition of success

The programme succeeds when Ame can pick up the game on an iPad or TV, immediately recognize herself, understand what to try, solve increasingly clever mazes with fair help, enjoy expressive characters and magical feedback, and finish each session asking to see what the next maze will do—while the adults can trust its controls, saves, clarity, performance, and kindness.
