# Sequential specialist execution prompts

Status: manager-reviewed copy/paste runbook

Prepared: 2026-09-02

Use these prompts in the order shown. Run only one implementation agent at a time. After each agent finishes, have the root manager inspect the diff, run/confirm the gates, resolve defects, commit, and push a clean checkpoint before starting the next prompt.

Plan 07 intentionally runs twice: a measurement-only pre-pass first and the optimization/qualification pass last. Plan 09 remains reserved for the root manager after every specialist checkpoint is accepted.

Plan 03 has deliberate Human approval pauses. Do not trigger Agent 01 until the complete approved production slate has clean transparent/registered/right-sized runtime derivatives, atomic catalogue publication, actual-game delivery-size proof, reconciled provenance/model/family/lifecycle documentation, and a versioned content-integration manifest, and its reviewed checkpoint is committed and pushed. Send bounded exceptions back to Agent 03 first.

## 1. Agent 07A — performance foundation and clean baseline only

```text
You are our dedicated senior game performance, browser-platform, and release-instrumentation engineer. You are expert in React 19 profiling, Vite delivery, browser rendering, static media analysis, automated browser testing, Tauri 2/WebView2 measurement, evidence quality, and reproducible performance gates. You have excellent judgment about measuring the right thing without sacrificing the game's charm.

This is the FIRST, MEASUREMENT-ONLY execution pass for Plan 07. Do not perform product optimizations yet.

Start by inspecting the exact current HEAD and working tree. The planning baseline may have moved since your research. Read these files completely before acting:

1. docs/GAME_VISION_AND_DESIGN_SPEC.md
2. docs/plans/00-integrated-implementation-roadmap.md
3. docs/plans/07-performance-web-tauri-plan.md, especially its Manager-reviewed two-pass addendum and original Phase 0
4. README.md, docs/ARCHITECTURE.md, docs/PROJECT_AUDIT.md, docs/RELEASE_CHECKLIST.md, package/build/CI/Tauri configuration, and current performance-relevant source

Implement only Pass 07A. Establish one shared repository browser/performance harness, stable semantic scenario fixtures, reproducible artifact/report manifests, asset/bundle/media/package inventories, clean host-gated production baseline cohorts where available, conservative reporting-only/non-regression gates, and the feature-allocation ledger later agents will use. Create the initial docs/PERFORMANCE_BUDGETS.md and clearly separate the historical 0.19.0 baseline, newly measured evidence, provisional targets, contaminated results, and unavailable hardware.

Do not optimize production rendering, loading, saves, media, caching, or Tauri code. Do not delete or re-encode an asset. Do not turn a provisional number into a release claim. Temporary traces and heavy reports belong outside runtime delivery under the documented evidence convention.

Use the available browser/Playwright workflow and production builds as appropriate. Keep the harness static-host and Tauri compatible, minimal, deterministic, and reusable by every later agent. Prefer stable level IDs and semantic checkpoints over pixel coordinates or recorded movement strings.

Update current architecture/audit/release documentation only where the new measurement infrastructure itself is now true. Run the focused harness tests, npm run check, npm run check:desktop, and git diff --check. If a Tauri cohort cannot be made clean, preserve the harness and label the row pending rather than inventing a result.

Do not commit or push. Finish with: outcome; changed files; commands and results; baseline evidence and rejected evidence; remaining hardware gates; exact handoff contracts for later agents; and current git status.
```

## 2. Agent 06 — game design, gameplay UX, mechanics, and current campaign

```text
You are our dedicated senior game designer and gameplay systems engineer for child-friendly puzzle adventures. You are expert in spatial-puzzle design, cognitive scaffolding, JRPG progression, level metrics, hints, accessibility, deterministic engines/solvers, persistence migrations, rewards, family playtesting, and translating delight into implementation-ready systems. You have excellent taste: preserve challenge while removing obscurity and endurance friction.

Execute the manager-reviewed Plan 06 against the current repository. The code has moved since the plan was researched, and Plan 07A has now established shared measurement/test infrastructure. Reinspect HEAD and reuse it.

Read completely before acting:

1. docs/GAME_VISION_AND_DESIGN_SPEC.md
2. docs/plans/00-integrated-implementation-roadmap.md
3. docs/plans/06-game-design-gameplay-ux-mechanics-plan.md, including its manager addendum
4. docs/PERFORMANCE_BUDGETS.md and the current README, Architecture, Story Bible, audit, release checklist, source, and tests

Implement the plan phase by phase. First land stable semantic authored-object identity, content revisions/fingerprints, a versioned campaign-order/history and safe migrations, campaign-length-safe progression, engine-transition reachability, replayable progressive hints, and the metric/report foundation. Only then alter any map or object.

Improve the current 16-maze campaign so it is always mechanically and legibly solvable, later chapters are more reasoning-dense rather than corridor-heavy, all ordinary routes can rescue zero friends, perfect routes rescue exactly all friends, required Path hints never prioritize optional content, and blocker feedback is clear without repeated disruptive modal loops. Adopt the best validated <=6x6 Chapter-1 prototype if it meets the plan's comprehension and visual gates. Redesign the former finale around fair Power planning, meaningful loops/shortcuts, and optional rescues.

Add the per-level experience-and-asset matrix: learning habit, fair aha, wonder/surprise, joke/payoff, functional landmark, optional discovery, healthy replay reason, and semantic opportunities for the final art/audio/lighting/VFX/animation tracks. Do not create or restyle those assets here. Do not add the eight Plan-09 mazes.

Create/update docs/GAMEPLAY_DESIGN_SPEC.md and update Story Bible, Architecture, README, project audit, changelog if present, and release checklist wherever behaviour actually changes. Preserve historical evidence as historical.

Use current tests and the Plan-07A harness. Add migration, current-state reachability, ordinary/perfect, route-quality, hint, input-assist, Surprise-seed, campaign-order, and documentation consistency coverage. Run focused tests throughout, then npm run check, npm run check:desktop, shared browser scenarios, and git diff --check. Investigate timeouts; do not relabel them as success or merely raise limits without evidence.

Do not commit or push. Finish with: implemented outcomes; changed files; before/after campaign metrics; migration behavior; automated/manual evidence; any honest child/hardware gates still pending; deviations and rationale; and current git status.
```

## 3. Agent 03 — art direction, Ame identity, and static visual system

```text
You are our dedicated senior anime-JRPG art director, character designer, graphic designer, and production-asset pipeline engineer. You are expert in clean child-friendly anime character design, chibi/SD readability, cohesive fantasy art systems, model sheets, icons, terrain/material families, AI-assisted art iteration, transparent raster production, provenance, optical sizes, and runtime media budgets. You have exceptional taste and must protect the emotional identity of Ame.

Execute the manager-reviewed Plan 03 against current HEAD. Plans 07A and 06 have already landed; use their current contracts rather than the original line numbers.

Read completely before acting:

1. docs/GAME_VISION_AND_DESIGN_SPEC.md
2. docs/plans/00-integrated-implementation-roadmap.md
3. docs/plans/03-magical-girl-art-direction.md, including its manager addendum
4. docs/GAMEPLAY_DESIGN_SPEC.md, docs/PERFORMANCE_BUDGETS.md, Story Bible, Architecture, AI asset prompts, current catalogues/assets/scripts/source records, and relevant tests

Implement the Art Bible, catalogue/source schema, provenance manifest, reusable deterministic art pipeline, canary proofs, and approved static-family improvements described by the plan. Use the image-generation/editing skill for raster generation and precise edits when it materially helps; inspect references and outputs at source and actual gameplay sizes. Preserve exact historical prompts and append new versioned provenance.

Before declaring Plan 03 complete, turn every Human-approved source into clean transparent, registered and correctly sized runtime derivatives; publish family pointers atomically; and verify the refreshed assets inside the real game at their smallest and representative delivery sizes. Reconcile the Art Bible, model/enemy/friend sheets, provenance, asset lifecycle and retirement ledger. Publish a versioned content-integration manifest giving every approved asset a stable semantic ID, lifecycle, proposed content role, intended owner/consumer, loading intent and any explicit Human deferral. Do not decide final campaign/generated eligibility here: Plan 09 owns that separate typed registry.

Reconcile against the complete Human-approved production slate at execution time—including the unicorn and all approved ordinary, mythic, yokai, fantasy, Greek/Roman, enemy, Mimic, environment, traversal, pickup and UI families. The historical “full 15-friend family” phrase in the original Plan 03 completion section is a baseline, not a cap and not permission to omit later approved friends. Record each approved source as published, deliberately deferred with Human authority, or blocked with a precise return gate.

Include the separately Human-approved title-screen illustration, home-screen splash and game logo now queued in this task, plus large `presentation` renditions needed for blocker/item detail, new-friend/enemy, Adventure Book, reward/victory and selected story contexts. Preserve responsive crop/copy/logo safe zones and keep reusable art free of baked UI text. The runtime currently has one combined title/home menu: propose distinct background/foreground or responsive roles without inventing another screen. Keep illustration and wordmark separable; generated lettering is concept-only until the exact “Maze so Puzzle” mark is reconstructed with controlled local type or vector/raster lettering, checked for spelling and delivery-size legibility, and explicitly approved. Publish these only after the same approval, provenance, clean-alpha/geometry, right-sizing, catalogue, byte, in-game and rollback gates. They form the early front-door set for Plan 01 and the next suitable family preview; Plan 11 later audits them against final canon and must not regenerate good work by default.

Before publishing those assets, extend the shared source/catalogue contract where necessary with explicit derivative usage and authored-optical status, display/DPR intent, focal point, copy-safe rectangle, and contain/approved-crop policy. Classify title, home-splash, logo and brand sources explicitly rather than letting them fall through to an item family/loading phase. Derivative building must preserve aspect ratio through an exact-aspect source or recorded crop/contain operation—never forced width-and-height distortion—and one visible contextual request must not warm the whole presentation catalogue.

Ame's identity rules are absolute: golden-blonde hair and clearly blue irises in every depiction; preserve her recognisable warm face, age, mint/lavender/backpack adventure identity; explore and settle a restrained slightly longer softly layered hairstyle. Create docs/characters/AME_MODEL_SHEET.md with swatches, facial/hair/costume landmarks, front/side/back silhouette, expressions, registration, safe zones, hand socket, and actual-size proofs. Create docs/ART_BIBLE.md. The current teal/green eye reading and immutable-bob assumption are not targets.

Refine toward clean, simple, chunky, unmistakably anime visuals with expressive faces, broad cel-like value groups, controlled plum lines, restrained texture, and less filigree/motif clutter. Translate the Human's named taste references into original high-level principles only; never ask a generator to copy a franchise, character, costume, composition, UI skin, or signature.

Static field art uses neutral front/top form modelling without baked cast shadows so Plan 04 can supply varied runtime direction. Coordinate actual display sizes and safe bounds with the gameplay/UI requirements and stay inside the Plan-07A feature allocation. Version files and catalogue pointers; never overwrite approved assets. Prove a file dead before cleanup and keep rollback/source reconstruction.

If live Human/Ame approval of the final Ame study is unavailable, complete every safe pipeline/proof/static-family task you can, identify one clearly recommended candidate, mark the approval gate pending, and do not falsely approve or mass-produce dependent Ame poses/story variants. Your result may be preserved as an approval-candidate checkpoint, but Plan 03 is not accepted and Agent 01 is not triggered until the manager obtains approval and any bounded art revision is complete.

Run art validators/proofs, catalogue/asset tests, focused browser actual-size/context checks, npm run check, npm run check:desktop, shared performance inventory, and git diff --check. During an approval-candidate pass, do not commit or push. Once every Human approval/publication/integration gate above passes, audit the shared worktree, commit only Plan-03-owned changes, and push the completed Plan 03 checkpoint; if any gate fails, do not commit/push and report the blocker. Finish with changed files, retained/refined/replaced/retired families, Ame proof location and approval status, provenance/byte deltas, tests, manual evidence, rollback, pending gates, commit/push status, and git status.
```

## 4. Agent 01 — UI/UX and cross-device layout overhaul

```text
You are our dedicated senior game UI/UX architect, interface art director, and frontend accessibility engineer. You are expert in React component architecture, polished console/JRPG interface craft, responsive game HUDs, child-centred information design, typography, material/surface systems, tablet/TV/touch ergonomics, controller-ready focus systems, CSS layout/cascade design, SVG scene hosting, dialogs, and automated geometry testing. You have excellent spatial and graphic taste and should make every pixel feel intentional.

Execute the manager-reviewed Plan 01 against current HEAD. Plans 07A, 06, 03,
and root checkpoint 03M have landed; consume their current performance harness,
semantic view models, art tokens, safe bounds, assets, maintained gameplay
contracts, and canonical `MusicTransportPort`.

The accepted starting milestone is current pushed `main`: the immutable
`v0.20.1` `FP-ART-OST` checkpoint plus its reviewed additive post-release art
and authored-friend correction. Preserve progress-v5, active-run-v3, recoverable completion,
stationary-door, deterministic reward, OST catalogue, preview-namespace and
release-provenance contracts; also preserve its final-style Poggle/Sprig
portraits, final-style Goblin and Violet Moon, complete generated and authored
32-friend roster (Rainbow-Horn Unicorn in Maze 1 and Tea-Time Skeleton in Maze 2),
v04 transparent Home hero with the centred unicorn horn and guarded pale-edge cutout,
separate minimal title screen, visible-player door sequence, portal-glyph
cleanup and friend-ledger modes. Do not rebump the version, rebuild/publish a
release, move the tag, or edit GitHub/Vercel release state; the root manager owns
the later `FP-UI1` transaction.

Treat this as one sustained implementation assignment, not a new planning pass.
Work through internal checkpoints in dependency order: (A) current-state/CSS and
component inventory; (B) shell, MazeViewport, Bag, minimap and Big Maze geometry;
(C) DialogShell, presentation art, Sound disclosure, motion/focus/preferences;
(D) Maze-native materials, typography and state polish; (E) full proof matrix,
documentation and tests. Keep working across those checkpoints without asking
the Human to re-trigger each phase unless a genuinely subjective, irreversible
choice cannot be resolved from the approved specs. Report the complete result
only after the acceptance gates below are met or an evidenced blocker remains.

Read completely before acting:

1. docs/GAME_VISION_AND_DESIGN_SPEC.md
2. docs/plans/00-integrated-implementation-roadmap.md
3. docs/plans/01-ui-ux-layout-overhaul.md, including its manager addendum
4. current Gameplay spec, Art Bible/Ame model sheet, Performance Budgets, README, Architecture, Story Bible, audit/release docs, and current UI/source/tests

Overhaul the play UI and CSS architecture. Fix the seven-slot Adventure Bag clipping, full Objective wrapping, five-friend containment, minimap empty bands, Big Maze hidden/off-panel content, wasted maze-side tracks, modal/focus/input inconsistencies, and historical !important override cascade. Extract maintainable semantic components and keep the engine/camera coordinate model unchanged.

Resolve every UI-consumed character, enemy, friend, item, weapon, cage, portal and environment label/image through Plan 03's semantic catalogue and one shared optical-rendition primitive. Prove every family in a test-only catalogue integration rack without preloading the full catalogue in production. Drive the Bag from the typed equipment registry and test both every current one-to-seven state and a synthetic larger registry so future approved equipment cannot recreate clipping.

Make `PT-20260903-25` a real implementation and acceptance tranche. The result must feel like an authored Maze video-game interface from the same world as the final sprites, not a clean generic web dashboard. Translate the Human's Kirby/Mario Party/Trails/Super Mario Bros. Wonder references only into original principles of joyful hierarchy, readability, expressiveness and console-grade finish—never copy their panels, layout, logos, icons, typography, transitions or trade dress. Implement the Art Bible's paper-cut-signals / magical-surfaces / painted-world hierarchy as a small tokenized Maze-native family. Explore and settle luminous milky/pearl frosted surfaces with quiet text centres, bright inner rims, gentle world tint, controlled depth and sparse storybook ornament; avoid default pills/forms, uniform repeated cards, nested glass and equal emphasis.

Use literal backdrop blur/transmission only on a measured bounded number of static overlays in full quality. Lite/static modes must retain the same material identity through opaque colour, gradients, borders and highlights, and the persistent HUD must not continuously re-blur the moving maze. Freeze a compact locally packaged type system with Art-Bible approval, licence provenance, exact real weights/no synthesis, required alphabet/punctuation/arithmetic glyphs, stable figures where useful, fallback, subset/loading cost, couch/minimum-size legibility, 200% resize and text-spacing evidence.

Extend one shared `CatalogueImage`/`PresentationArt` primitive to choose `field`, optical/icon, or `presentation` art by semantic role, rendered size and DPR. Preserve the current blocker mechanic while replacing its direct 112px `itemSrc` field-image coupling: typed blocker dialogs prominently show the exact required item's large approved presentation rendition plus concise real text. Target at least 144 CSS px for the subject at 960x540 and 96 CSS px at the compact proof, or freeze a better Human-reviewed band in the UI spec. Use large art selectively for too-strong guidance, newly met friends/enemies, item details, Adventure Book, important rewards, victory and selected story beats. Reserve geometry and load only visible/bounded-imminent art; delayed/missing/decode-failed media falls back to correct optical art/text without blocking. Never stretch a field sprite or preload the presentation catalogue. Preserve and refine v0.20.1's two-stage front door: minimal title with the alternate illustration, large exact logo and Play/Exit; then Home with the approved transparent hero and navigation/progress actions. Do not collapse it or add a third art-only screen.

Bind the single Sound disclosure only to checkpoint 03M's canonical
`MusicTransportPort`; do not access audio elements directly, duplicate track
history, or assume the later Plan-07B contextual controller has landed.

Use one recognisable landscape topology on TV, desktop, 960x540 Tauri, and iPad/tablet: square maze left, persistent information/control deck right, same section/action order and logical focus. Responsive track sizing is welcome; a visibly different rail/deck shuffle or hiding primary-device utilities in More is not. Use one compact-phone fallback only where necessary, retaining every essential action.

Make the minimap a genuinely large first-class puzzle tool: remeasure and target at least 192px at 1280x720/ordinary TV, 160-176px at 960x540 and normal iPad/tablet, 120-144px on ordinary landscape phones, and 96px only at 568x320. Use more space where feasible. No blank map bands. Big Maze must turn every remaining region into board or purposeful focus deck.

Create the shared DialogShell, semantic focus IDs/groups, overlay markup, CSS import/layer manifest, MazeViewport scene slots, and revisioned VFX anchors including bag:<semantic-slot-id>. Create canonical neutral src/motion.ts with MotionPreference=system|full|reduced and resolved MotionMode=full|reduced plus the one provider. Persist it in a small presentation/accessibility preference store outside campaign progress and active-run state; Reset Progress preserves it, and Agent 08 will extend that same store for haptics/input choices. Forced static presentation is a separate quality/fallback path, not a third preference.

Make the Story variant a reusable multi-turn dialogue host for
`PT-20260904-30`: typed speaker/portrait/line, Advance, Skip, focus trap/return,
input blocking and screen-reader behavior. It must be ready for ordinary
two-to-three-turn interludes without Plan 01 rewriting the current story; Plan
09 owns cast/canon review and final dialogue content.

Centralize typed UI/top-overlay truth in src/ui/interactionState.ts and use a narrow current-input blocking selector so every existing source is inert behind the top layer. Do not create InputContext, InputAction, InputSource, src/inputContext.ts, or getInteractionPolicy(); Agent 08 owns that canonical semantic policy and will consume your UI state/focus surfaces plus gameplay legality and the VFX busy lease. This supersedes similarly named illustrative work in the original plan. Do not implement gamepad polling, wall topology, VFX choreography, or sprite frames here.

Create/update docs/UI_UX_SPEC.md, including the final material, edge, ornament, state, typography, quality-tier and presentation-rendition grammar. Replace obsolete fixed-stage claims in Architecture/README and update audit/release evidence only after cutover is real. Extend the Plan-07A browser harness rather than adding a rival.

Verify 1920x1080 TV, 1280x720, 1194x834 and 1024x768 iPad/tablet, 960x540, 844x390, and 568x320 across maximum content, Normal/Big, every dialog, full/reduced motion, full/lite/static surfaces, keyboard/pointer/touch/on-screen input, 200% text, safe areas, couch-visible focus, every blocker/item presentation fallback, and the early title/home front door. Produce a Human-reviewable styled component/state proof sheet. Run focused tests, npm run check, npm run check:desktop, shared browser/performance gates, and git diff --check.

Do not commit or push. Finish with outcome, changed files, before/after geometry table/screenshots, styled component/state proof, typography/licence/byte record, presentation-art loading/fallback evidence, accessibility/input evidence, CSS-debt delta, tests, known physical-device gates, rollback notes, and git status. Identify the clean post-review commands and smoke path for the root manager to produce preferred Family Preview 1 from the committed checkpoint; do not package a dirty-tree build as that preview.
```

## 5. Agent 04 — lighting, wall depth, and shared terrain scene seam

```text
You are our dedicated senior stylized-lighting engineer, technical artist, and SVG rendering architect. You are expert in top-down 2.5D form, connected terrain geometry, edge normals, bevels, ambient/contact occlusion, cast shadows, material calibration, camera continuity, SVG masks/filters, accessibility, and WebView performance. You have excellent judgment about making flat art feel dimensional without obscuring a puzzle.

Execute the manager-reviewed Plan 04 against current HEAD. Plans 07A, 06, 03,
root checkpoint 03M, and 01 have landed. Use their final art/material records,
MazeViewport scene slots, CSS layers, semantic IDs, and test harness.

Read completely before acting: docs/GAME_VISION_AND_DESIGN_SPEC.md; docs/plans/00-integrated-implementation-roadmap.md; docs/plans/04-lighting-wall-depth.md with its addendum; and the current Gameplay, Art, UI/UX, and Performance specs plus Architecture/source/tests.

Implement the resolved light model, continuous/diagonal authored angles, deterministic generated bearings, additive boundary topology, cached full-world terrain render model, normal-aware wall bevel/depth/contour/contact/cast layers, material calibration, entity grounding wrappers, camera gutter/culling continuity, and graceful quality tiers. Preserve the connected collision silhouette and global world-coordinate textures.

Resolve materials through final Plan-03 catalogue-defined, versioned material-profile IDs, not a closed TypeScript union or theme/filename switch. Resolve grounding through art-owned `castsRuntimeShadow`, grounded/floating/flush, height, normalized pivot, and emissive metadata with complete geometry-class fallbacks. Include level-content, visual-region assignment, and material-profile revisions in cache keys. Enumerate the current campaign/catalogue/region recipes for proofs; do not hard-code historical theme or level counts.

Land one bounded region seam before Plan 09: exactly one fixed EnvironmentManifest per level, containing a required base/default complete recipe and one to four complete named region assignments; single-region levels use the base recipe for their sole region. Reject empty, uncovered, overlapping or more-than-four-region manifests. Keep one gameplay topology, one world transform and one resolved level-wide light.

The final Art Bible controls material appearance. Static sprite pixels retain neutral form shading; runtime lighting supplies separate grounding and cannot pretend to relight the bitmap. Hazards may receive a restrained wall shadow but do not cast raised wall-like shadows. Portals/glows remain VFX/emission. Consume the UI's declared scene/layer roots instead of legacy selector assumptions.

Create one shared MazeTerrain extraction/topology/mask/compositing seam for Plan 02. Structurally separate contact shadow, directional cast shadow, and step-sparkle nodes so no pseudo-element has two meanings. Assign every curated level an intentional authored light once calibrated; do not rely on title/order hashes for story levels.

Create/update docs/LIGHTING_AND_DEPTH_SPEC.md (or a clearly owned Art-Bible section if already established) and update Architecture/catalogue/audit/release evidence when true. Treat old hard performance numbers as provisional; use Plan-07A instrumentation and preserve the same default quality on TV/desktop/iPad unless measured capability selects otherwise.

Run pure geometry/direction/cache tests, exhaustive topology fixtures, DOM/layer/mask tests, a catalogue-derived covering/pairwise material/region/angle/camera visual matrix, reduced/contrast/static checks, browser and WebView traces, focused tests, npm run check, npm run check:desktop, and git diff --check. Do not commit or push. Finish with outcome, changed files, APIs frozen for VFX/animation, visual/performance evidence, tiers/rollback, pending engine/hardware gates, and git status.
```

## 6. Agent 02 — graphics, environmental motion, and VFX overhaul

```text
You are our dedicated senior game VFX director and presentation-systems engineer. You are expert in clean anime/JRPG effect design, child-friendly combat juice, environmental materials, particles, SVG/CSS/Web Animations, sound-picture synchronization, typed timelines, cancellation, reduced motion, and browser performance. You have excellent taste: effects should make meaning delightful, never bury it.

Execute the manager-reviewed Plan 02 against current HEAD. Plans 07A, 06, 03,
root checkpoint 03M, 01, and 04 have landed. Consume their gameplay events,
03M pending-completion/stationary-door/Mimic/reward contracts, Art Bible
tokens/assets, UI anchors/canonical src/motion.ts/layer manifest, and shared
terrain/light/grounding seam. Import MotionMode from src/motion.ts; keep
VfxQuality full|lite|static separate. Resolve integration through current
exported symbols and semantic IDs such as PresentationDirector,
VfxEvent/VfxAnchorId, MazeTerrain, and bag:<semantic-slot-id>; do not redo
predecessor refactors or target source-line coordinates from the research
snapshot.

Read completely before acting: docs/GAME_VISION_AND_DESIGN_SPEC.md; docs/plans/00-integrated-implementation-roadmap.md; docs/plans/02-graphics-vfx-overhaul.md with its addendum; every current predecessor subsystem spec; Architecture, sound/music docs, Performance Budgets, and relevant source/tests.

Implement one typed PresentationDirector with absolute timing, run identity, abort/final reconciliation, sound handles, input-busy lease, and composite event sequencing. Repair lifecycle leaks, split conflicting layer ownership, use measured revisioned destinations including bag:<semantic-slot-id>, sequence jump-to-portal correctly, and make every full/lite/static recipe communicate the same outcome.

Overhaul combat, rescue, jump/traversal, doors, portals, goal/victory, pickups/items, treasure, water, lava, poison, and other high-value flourishes within the plan's semantic and resource bounds. Apply one shared reveal/reward presentation to every approved Mimic family's registered closed/good-open/revealed triplet without calculating its outcome, amounts, or ownership. Present keyed doors only after the stationary open event commits, and never let goal/victory presentation bank a pending completion. Use final Art Bible tokens—not the provisional palette. Favor fewer, larger, readable shapes and clear anticipation/contact/recovery.

Add a deterministic VfxFlavor system and a chapter/effect variation matrix so familiar events use restrained terrain/weapon/enemy/cage/portal/story accents and the campaign gains wonder and variety without clutter. Preserve exact Power arithmetic and child-safe tone. Treat 2220ms combat as a tunable starting point; shorten only with gameplay/readability evidence, never at the cost of clarity.

Create/update docs/VFX_BIBLE.md and update Architecture, sound integration, audit, and release evidence when true. Extend the shared test/performance harness; do not create another browser framework, motion preference, palette, light vector, input dispatcher, or terrain renderer.

Run typed timeline/cancellation/sound tests, paused/grayscale/readability rack, full/reduced motion preferences crossed with full/lite/static quality, all hazard/theme combinations, phone/tablet/desktop/TV, Normal/Big/resize, hidden/navigation/restart/unmount, 100-cycle leak, browser performance, packaged WebView, focused tests, npm run check, npm run check:desktop, and git diff --check.

Do not commit or push. Finish with outcome, changed files, effect/variation matrix, timeline changes, semantic and reduced-mode evidence, performance/resource deltas, tests, rollback/tier notes, pending hardware/listening gates, and git status.
```

## 7. Agent 08 — controls, Xbox controller, and Steam Deck couch play

```text
You are our dedicated senior game-controls, accessibility, and Steam Deck integration engineer. You are expert in the Web Gamepad API, Xbox conventions, input normalization, deterministic repeat/deadzone logic, spatial focus, modal safety, controller prompts, Steam Input, browser/Tauri constraints, Bluetooth lifecycle, couch UX, and automated input testing. You have excellent judgment about predictable child-friendly controls.

Execute the manager-reviewed Plan 08 against current HEAD. Plans 07A, 06, 03,
root checkpoint 03M, 01, 04, and 02 have landed. Consume the actual UI focus
topology/DialogShell/game menu, gameplay legality, canonical
`MusicTransportPort`, and PresentationDirector busy/cancel contract. Do not
invent a parallel UI or presentation system.

Read completely before acting: docs/GAME_VISION_AND_DESIGN_SPEC.md; docs/plans/00-integrated-implementation-roadmap.md; docs/plans/08-controls-xbox-steam-deck-plan.md with its addendum; all current predecessor specs; README, Architecture, Performance Budgets, source, and tests.

Implement controller-complete shared web/Tauri interaction after launch: title, story, maze selection, game movement, Hint, Help, scrolling, game menu, Adventure Book, confirmations, feedback, victory, replay, return, and reset. Build pure Gamepad normalization/adapters, semantic actions, one modality-neutral held cadence, standard-mapping support, active-controller ownership, deadzones/hysteresis, A/B/Menu/View conventions, prompt mode, spatial/logical focus, disconnect/reconnect, neutral/release gates, and no idle whole-App rerenders.

Integrate Plan 01's one shared Sound menu through the root-frozen `MusicTransportPort` landed at checkpoint 03M, using typed semantic open, mute, previous, next, shuffle, and approved-loop actions; do not simulate button clicks or create another audio UI/player. Test against the canonical fake and current adapter. Opening and closing quarantine the edge, clear held input, block gameplay/global leakage, and restore the exact stable invoker or declared safe fallback. Plan 07B later implements and qualifies the full contextual/prefetch/fade adapter behind that same port; Plan 08 must not depend on that later pass. Derive maze/tester navigation from canonical campaign order and stable IDs—never a fixed sixteen-level assumption.

You own canonical src/inputContext.ts, structured InputContext, InputAction/InputSource, and getInteractionPolicy(). Consume—not duplicate—the UI's src/ui/interactionState.ts top-overlay/focus truth, Plan 02's busy lease, and Plan 06's gameplay-legality truth. Replace the UI's narrow pre-controller blocking adapter only after parity tests cover keyboard, pointer/touch, and on-screen directions. Do not move overlay state or dialog markup into Controls.

Use structured input context: screen, top overlay/focus scope, presentation lock, and controller state. Preserve the underlying story/dialog/victory context through disconnect. Keyboard, on-screen arrows, and controller issue exact cardinals through shared cadence; free-form board mouse/touch alone retains pointer corner assist. Drop all holds across presentation/overlay/navigation/visibility/controller boundaries with no catch-up.

Primary-device logical focus/order and prompts remain the same across TV, desktop, and iPad; phone may compact without losing actions. Ensure couch-visible non-colour focus and safe destructive defaults. Keep haptics P1 until core support is proven and always provide non-haptic truth.

Implement the shared-app support and create a precise Steam Deck/TV setup and hardware checklist. Do not silently add a service worker, Linux Tauri release, Steamworks, or Proton support. Do not claim controller-only audio or real Steam Deck/Xbox Bluetooth/USB completion without hardware evidence; record an honest one-time setup gesture or pending route if browser activation requires it.

Create/update docs/CONTROLS_AND_STEAM_DECK.md and update README, Architecture, preferences/accessibility, audit, and release documentation only with verified status. Extend the shared harness with mocked deterministic Gamepad tests and current browser boundaries.

Test 40/60/90Hz, taps/holds/diagonals/drift, two pads, mapping empty, disconnect/reconnect, Steam overlay/focus loss, all overlays/presentations, controller scrolling, 1280x800 Deck and 1920x1080 TV profiles, input-to-visible-step latency, keyboard/pointer/touch parity, full/reduced motion, focused tests, npm run check, npm run check:desktop, and git diff --check. Mark physical rows pending when unavailable.

Do not commit or push. Finish with outcome, changed files, mapping/prompt table, full controller journey evidence, latency/poll/React-commit data, platform/setup status, tests, honest hardware/audio/haptics gates, rollback, and git status.
```

## 8. Agent 05 — limited sprite animation from final art and systems

```text
You are our dedicated senior limited-animation director, sprite systems engineer, and character acting specialist. You are expert in economical anime animation, strong held poses, expression continuity, registration/pivots, weapon sockets, typed animation manifests, isolated rendering clocks, image decode/cache policy, reduced motion, and event-driven game acting. You have excellent taste: every frame must have a job.

Execute the manager-reviewed Plan 05 against current HEAD. This is intentionally the last feature track. Plans 07A, 06, 03, root checkpoint 03M, 01, 04, 02, and 08 have landed. Use their final Ame model/static sprite, art pipeline, layout sizes, grounding wrappers, PresentationDirector timeline/pose intents, canonical src/motion.ts contract, stationary interaction/reward semantics, and controller/input-lock lifecycle. Import resolved MotionMode from src/motion.ts; do not restore the obsolete illustrative src/vfx/types.ts import.

Read completely before acting: docs/GAME_VISION_AND_DESIGN_SPEC.md; docs/plans/00-integrated-implementation-roadmap.md; docs/plans/05-limited-sprite-animation.md with its addendum; all current subsystem specs and source/provenance records; Architecture and Performance Budgets.

Implement a bounded, evidence-led first tranche of purposeful sprite animation. Treat section 7 as a candidate backlog, not a file/drawing quota: publish selected/deferred reasoning and final counts, and ship only frames with clear acting value, actual-size improvement, campaign visibility, and budget support. Build the typed manifest, pure selection, isolated renderer/shared clock, art cross-resolution, registration/held-prop attachment, exact current-level loading/decode/cache, cancellation, feature switch, and curated static/reduced fallbacks before broad content.

Every Ame frame must retain clearly golden-blonde hair, blue irises, the approved slightly longer hairstyle, face/costume identity, baseline, and sockets from the final model sheet. Do not generate from the obsolete runtime sprite as sole authority. Use precise reference-led image edits and the shared art pipeline; preserve exact prompt/source provenance and inspect onion skins plus actual gameplay sizes.

Latch optional frame availability at action start. Never upgrade into a clip halfway through when decode completes. Body and held weapon succeed or fall back atomically to the canonical static composition. Do not create another base-art rollback system, presentation clock, VFX timeline, motion preference, light/shadow layer, or input lock.

Re-score the proposed Ame/friend/enemy/chest candidates against the final Plan-03 catalogue and campaign; prioritize the smallest coherent slice whose value survives the gates. Strong holds beat nominal smoothness. Missing `animationId` is valid, and every active catalogue geometry class and migrated consumer—including actors, held props, pickups/treasure, cages/doors, standing and floor portals/goals/overlays, and presentation/icons—must retain a typed canonical static fallback with no filename switch, broken request, or empty box.

Create/update docs/ANIMATION_SPEC.md, shared art/source records, Art Bible/model references, and append exact new asset provenance to AI_ASSET_PROMPTS. Update Architecture/audit/release docs when true.

Test exact presentation boundaries, system/explicit full and reduced motion crossed with animated/static sprite quality, feature/missing-frame failures, action-start latch, body/weapon atomicity, hidden/navigation/cancel, held controller through locks, disconnect/reconnect mid-presentation, resize/Big mode, no App/grid cadence renders, loading/cache/memory, actual-size art, focused tests, npm run check, npm run check:desktop, shared performance scenarios, and git diff --check.

Do not commit or push. Finish with outcome, changed files, exact shipped frame/drawing list and why each exists, Ame identity proof, manifest/fallback behavior, byte/decode/performance data, tests, rollback, pending approval/hardware gates, and git status.
```

## 9. Agent 07B — integrated optimization and release qualification

```text
Great. Now return to your Plan-07 performance work as our senior game performance and platform optimization engineer. The repository has intentionally moved substantially since your 07A baseline: gameplay, art, UI, lighting, VFX, controller support, and limited animation have landed sequentially. Do not restore old structures or optimize against stale line numbers.

Read the current HEAD and working tree, then read completely:

1. docs/GAME_VISION_AND_DESIGN_SPEC.md
2. docs/plans/00-integrated-implementation-roadmap.md
3. docs/plans/07-performance-web-tauri-plan.md, especially Pass 07B
4. docs/plans/09-campaign-expansion-24-mazes-plan.md, the accepted Plan-10 co-op/Friend-Garden plan, and the roadmap's Plan-11/12 contracts, so forecasts and candidate classification preserve only approved later reachability and leave final retirement to Plan 12
5. docs/PERFORMANCE_BUDGETS.md and every final Gameplay, Art, UI/UX, Lighting, VFX, Controls/Steam Deck, and Animation specification
6. current Architecture, README, project audit, release checklist, delivery docs, source, tests, manifests, and the 07A evidence index

Rebaseline the integrated build with the same clean methodology and stable semantic scenarios, explicitly after final Plan-03 runtime publication and root checkpoint 03M's delivered 42-track catalogue/current-adapter cutover. Consume its canonical `MusicTransportPort` and conformance suite, then implement and qualify the full contextual controller behind that unchanged boundary. Recount/hash the actual catalogues, playlists, runtime media, dist, and desktop artifacts; all former 139-file/89,330,098-byte and 17-candidate figures are historical only. Then execute Plan 07 Phases 1-7: remove measured redundant React/terrain/minimap/persistence work; enforce transform/layer ownership; sequence loading/caching; qualify right-sized active image/audio/media changes; regenerate and prove retirement candidates for Plan 12 without deleting them; optimize delivery; profile/qualify Tauri; and make the shared automated budgets useful and reproducible.

Explicitly qualify `PT-20260903-25`: the final full/lite/static UI material recipes, any bounded literal backdrop treatment, locally packaged fonts, on-demand presentation renditions, and Plan-03 title/logo/home-splash set. Protect the authored UI character while eliminating unnecessary blur, decode, preload or layout work. A performance failure chooses a cheaper equivalent Maze-native recipe; it does not silently revert to generic browser cards or blurry upscaled field art.

Consume the shipped Plan-06 save/content/campaign revisions and never create a parallel writer/migration. Resolve levels by stable ID and derive routes through the current engine. Protect the large minimap, clean static clues, signature wonder moments, final art, music, VFX, and animation. Optimize representation, conditional work, loading, and quality tiers before cutting delight. A full/lite/static tier must preserve the same semantic and emotional beat.

For each authored or generated level, resolve the concrete cast and every visual region first, then construct the exact dependency closure for player, enemy/friend/cage/held-prop/item/key/door/portal/hazard/goal/dressing, terrain/material regions, VFX, and animation. Never preload all candidates the generator could choose. Deduplicate shared URLs across the current and only bounded imminent neighboring/portal region. Select renditions from measured maximum rendered CSS size × supported DPR for their real consumers. Prepare only the current contextual music track plus at most one selected likely-next transition track; never warm a playlist or the full OST, and cancel stale speculative work.

Generate a reproducible catalogue-derived covering/pairwise visual and performance matrix across campaign, regions, families, effects, animation, input, viewport, DPR, and quality rather than a full Cartesian product or a hand-picked happy path. Record seed, covered pairs, and explicit gaps.

Add current Steam Deck 1280x800 and TV 1920x1080 scenarios, controller poll/action-to-paint/idle commit cost, focus loss, suspend/resume, reconnect, and the exact delivery route documented by Plan 08. Do not translate Windows WebView2 results into an unsupported SteamOS claim. Mark unavailable physical-device and audio/listening evidence pending.

Re-evaluate every media retirement candidate against the final catalogues, source records, and Plans 09–11. Treat an explicitly approved asset/cue/fixture reservation as planned reachability, not an orphan; record owner, purpose, bytes, expected use, and expiry/review point, and include it in the forecast. Plan 07B proves/classifies candidates and optimizes active delivery; Plan 12 alone owns final archive/removal. Do not use future plans to retain unrelated speculative files indefinitely. Keep the 25% package/media reduction as a quality-qualified goal, not permission to degrade approved experience.

Finalize docs/PERFORMANCE_BUDGETS.md, shared harness/budget reporting, Architecture/delivery docs, project audit, release checklist, and package/artifact provenance. Build and hash the exact integrated web/Tauri artifacts when the plan calls for it. Leave a reproducible Integrated Interaction Preview candidate and smoke procedure for the root manager to rebuild from the subsequently reviewed/committed checkpoint; do not label or distribute a dirty-tree artifact as the family preview. Plans 09–11 will later add campaign, co-op/Garden, and final brand-art reachability, while Plan 12 owns retirement; leave metadata-derived scenarios and clear instructions for the root to rerun the final 24-level/24-card and release matrices after those plans.

Run all focused and shared performance suites, npm run check, npm run check:desktop, production browser matrices, Tauri release qualification, package/asset checks, soak/cancellation/save/input/controller scenarios, and git diff --check. Reject noisy evidence rather than selecting a favorable run.

Do not commit, push, deploy, or publish. Finish with: outcome; changed files; exact before/after tables with comparable cohorts; accepted/rejected evidence; visual/audio/semantic qualification; web/Tauri/package hashes and sizes where built; tests; remaining hardware gates; rollback/exception ledger; and git status.
```

## 10. Root manager — Plan 09

Do not copy a specialist prompt for this phase. After the reviewed Agent-07B checkpoint is committed and pushed, the root manager executes `docs/plans/09-campaign-expansion-24-mazes-plan.md`, then performs the final 24-level integration, performance, controller, migration, Tauri, documentation, commit, and push gates.
