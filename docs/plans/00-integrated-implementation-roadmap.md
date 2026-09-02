# Integrated implementation roadmap for Plans 01–09

Status: manager-reviewed execution authority

Prepared: 2026-09-02

Planning baseline: `5eed837` (`Add expert implementation research plans`)

Current programme shape: a measurement-only performance pre-pass, seven sequential feature executions, the final performance/optimization pass, then the root-owned 24-maze expansion

## 1. Outcome

This roadmap turns eight independently researched plans into one programme. It resolves overlapping ownership, records the human decisions that supersede earlier recommendations, and defines the order in which agents may change shared code.

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
- Plan 03 has a Human/Ame identity gate. The agent may finish and the manager may preserve a review checkpoint, but Plan 03 is not accepted and Plan 01 is not triggered until the selected Ame model sheet/static sprite is explicitly approved. If revision is requested, return the same art agent to the bounded study before downstream work consumes it.
- No agent adds one of the eight Plan-09 campaign mazes early.
- No plan may introduce analytics, paid infrastructure, monetization, remote asset dependence, or a copied franchise design.

## 4. Final execution order

| Order | Plan / owner | Why it runs here | Required output gate for the next owner |
|---:|---|---|---|
| 1 | **07A — Performance Phase 0 only** | Runs before tracked implementation changes so the programme has an uncontaminated, reproducible before-state. It adds the shared browser/performance harness, asset/bundle inventory, reporting, scenario fixtures, and provisional non-regressive gates. It performs no product optimization and removes no media. | Clean baseline manifest/reports, one shared browser harness, named semantic scenarios, current asset/package inventory, historical 0.19.0 baseline, and a feature-allocation ledger ready for later owners. |
| 2 | **06 — Game design, gameplay UX, mechanics** | Establishes stable content identity, revisions/migrations, engine-consistent reachability, required-versus-optional semantics, progression metrics, scalable campaign contracts, and the revised 16-maze rule/content baseline. Presentation owners should not infer these from old `App.tsx` conditions. | Gameplay spec, stable semantic events/view models, campaign-length-safe foundations, solver and migration evidence, revised story/design authority. |
| 3 | **03 — Art direction and graphic design** | Consumes the gameplay semantics and freezes the static visual identity before layout, lighting, effects, or animation depend on it. This is where blonde/blue-eyed Ame and the approved hair silhouette become canonical. | Art Bible, explicitly Human/Ame-approved model sheet and canonical static Ame sprite, asset/catalogue/source contract, final static art/tokens, actual-size proofs, provenance and byte evidence. A pending identity study does not release Plan 01. |
| 4 | **01 — UI/UX and layout** | Can now build around real gameplay priorities and final asset safe bounds. It establishes the stable cross-device shell, large minimap, DialogShell, focusable markup, CSS layer manifest, motion preference, and measured UI/VFX anchors. | UI/UX spec, primary-device topology, all-content geometry tests, stable semantic IDs/anchors, dialog/focus surfaces, and extensions to the shared browser harness. |
| 5 | **04 — Lighting and wall depth** | Uses final art materials and the final MazeViewport/scene slots. It creates the single terrain topology/render-model seam, coherent light resolver, wall layers, and grounding wrappers before effects attach to them. | Lighting spec, resolved-light API, cached topology/render model, world masks/layer tokens, dedicated contact/cast/sparkle surfaces, tier evidence. |
| 6 | **02 — Graphics and VFX** | Consumes final art tokens/assets, terrain/light layers, UI anchors, and gameplay events. It owns the shared presentation director, cancellation, semantic effect grammar, hazard motion, and varied flourishes. | VFX Bible, presentation-director contract, anchor/timing/cancellation APIs, effect variants, reduced/static recipes, sound/lifecycle evidence. |
| 7 | **08 — Controls, Xbox controller, Steam Deck** | Uses the actual UI focus topology and final presentation-lock contract. It normalizes all input sources, implements controller navigation/gameplay, and proves no stale input crosses an effect or overlay. | Controls/Steam Deck spec, shared input policy/action dispatcher, gamepad implementation, controller prompts/focus/scrolling, deterministic tests and honest hardware checklist. |
| 8 | **05 — Limited sprite animation** | Runs only after final static character art, grounding wrappers, VFX timelines, UI sizes, motion provider, and controller lock semantics exist. It adds purposeful frames without becoming another identity or timing system. | Animation spec, bounded first frame tranche, typed manifest/renderer, atomic fallback/decode behaviour, on-model actual-size and integration evidence. |
| 9 | **07B — Performance Phases 1–7** | The original performance agent returns to re-baseline and optimize the combined product against 07A. It owns final budgets, media decisions, delivery caching, Tauri/Steam Deck profiles, package provenance, and release evidence. It reads Plan 09 before orphan cleanup and forecasts its approved reservations. | Reproducible before/after reports, optimized final web/Tauri build, package provenance, regression gates, a time-bounded Plan-09 reservation ledger/24-level forecast, updated release evidence, and no unexplained quality loss. |
| 10 | **09 — 24-maze campaign expansion (root)** | Audits the fully integrated systems and builds eight levels against their final contracts: four inserted into the journey and four after the former finale. | Twenty-four solver-verified story mazes, migrations, 24-chapter story/design docs, playtest/metric evidence, final integration/release checks. |

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

No unexplained band may surround it. All one-to-seven Bag slots remain simultaneously visible and contained; all one-to-five friend states remain visible. The original Plan-01 160px-wide ceiling and inconsistent 152px container are superseded.

### 5.3 Ame and the static-art model

The current bob is not immutable. Plan 03 must settle a restrained slightly longer hairstyle while preserving recognition. Blonde hair and blue irises are absolute across every representation. The field sprite's current teal/green eye reading is not a colour target.

The approved model sheet records front/side/back silhouette, face/eye landmarks, golden-blonde and blue-eye swatches, expression rules, costume anchors, body registration, safe zones, and actual-size proofs. No Ame animation frame or broad family generation proceeds from a historical runtime bitmap alone.

The refined style prioritizes clean anime faces, broad cel-like three-value groups, strong chunky silhouettes, controlled plum linework, and restrained painterly texture. Reduce motif soup, filigree, jewels, and micro-detail before removing personality.

### 5.4 Static versus runtime lighting

Static field assets use soft, mostly neutral front/top form modelling with no baked cast shadow and no strong fixed directional rim. Runtime lighting owns maze-direction casts/highlights. Story/key art may have a documented cinematic key light. Plan 04 does not claim to relight opaque sprite pixels; it grounds them with separate contact/cast surfaces.

### 5.5 Challenge and replay

Plan 06's diagnosis is adopted: the later campaign needs more reasoning density, not more corridor endurance. It may compact current routes while increasing decisions, prerequisite relationships, meaningful changed-state returns, and fair surprise. All rescues are optional for ordinary completion, including the former finale.

The programme uses “healthy voluntary replay appeal,” not coercive addiction, as its design goal. Rewards recognize mastery, exploration, humour, and curiosity without a shop or pressure loop.

### 5.6 Effects and variation

Plan 02's provisional hex palette yields to final Art Bible tokens. Add a deterministic, bounded `VfxFlavor` or equivalent theme/chapter accent layer so repeated pickups, rescues, combat, traversal, and victories vary coherently by terrain, weapon, enemy personality, cage, portal, or story beat. The semantic silhouette and timing truth remain stable; accents provide surprise without particle clutter.

Exact combat Power conservation and cancellation are fixed. A 2,220ms dwell is an implementation baseline, not an untouchable product rule; gameplay/VFX may shorten pacing when evidence shows a snappier readable result.

### 5.7 Provisional performance budgets

Specialist-plan resource budgets are guardrails until Plan 07 obtains clean measurements on the integrated build. Earlier owners must instrument and stay within their proposed caps, but may not advertise a measured platform win from contaminated or incomparable evidence. TV, desktop, and iPad receive the same default visual tier; a lower tier requires measured capability policy, with phone the acceptable lower-priority fallback.

### 5.8 Delivery versus core controller scope

Plan 08 implements shared browser/Tauri controller support and a tested Steam Deck launch guide. Hosted Chromium/PWA and a future Linux Tauri package are delivery options, not automatic permission to add a service worker, Linux release, or Steamworks integration. Controller-only audio and real hardware remain explicit qualification gates; no agent claims them passed without evidence.

## 6. Single-owner contract table

| Contract | Owner | Consumers and boundaries |
|---|---|---|
| Product decisions and programme sequence | Root manager / game-vision + roadmap | Every agent consumes; only Human authority changes locked product decisions. |
| Engine rules, legal actions, required/optional semantics, content identity/revision, hint search, campaign ordering | Plan 06 | UI/controls/VFX/animation consume typed semantic state; none infer rules from pixels, DOM, or filenames. |
| Static visual identity, palette semantics, catalogue schema, asset source/provenance, geometry/registration, art pipeline | Plan 03 | UI implements tokens; lighting/VFX/animation consume. Animation may extend the art pipeline, never fork it. |
| App shell, MazeViewport host, DialogShell, typed UI/top-overlay state in `src/ui/interactionState.ts`, focusable semantic IDs, CSS import/layer order, shared motion preference/provider and canonical `src/motion.ts` contract, layout anchors | Plan 01 | Controls consumes UI state/focus surfaces; lighting/VFX/animation import the resolved motion mode and use declared scene slots/namespaced style layers. UI does not own semantic input-action policy. |
| Canonical structured `InputContext`, `InputAction`/`InputSource`, `src/inputContext.ts`, `getInteractionPolicy()`, raw input normalization, semantic actions, held cadence, controller ownership/deadzones, neutral gates, focus navigation | Plan 08 | Consumes Plan-01 UI/top-overlay state, Plan-02 busy lease, and Plan-06 gameplay legality. Pointer steering alone owns pointer-specific corner assistance. |
| Terrain boundary topology, cached render model, world masks/gutter, resolved maze light, wall/depth layers, contact/cast grounding surfaces | Plan 04 | Art provides albedo/material intent; VFX supplies motion/emission in assigned layers; UI hosts the scene. |
| Presentation director, run lifetime, abort/cancellation, effect/audio cue timing, transient VFX, hazard material motion, presentation-busy lease | Plan 02 | Controls consumes lock boundaries; animation consumes absolute run time/pose intent; gameplay state is already committed. |
| Optional sprite frames, animation manifest/selector, isolated renderer, frame decode/cache, pose/body/weapon atomic fallback | Plan 05 | Consumes art identity/geometry and VFX timing; never owns engine outcome, outer travel, or base-art fallback history. |
| Browser/performance harness governance, trace method, global budgets/quality policy, generated asset inventory, final caching/package/release evidence | Plan 07 | Plan 07A establishes the shared harness; all later agents extend it rather than add rivals. Plan 07B requalifies the integrated product. |
| Narrative canon and chapter learning arc | Plan 06 for current campaign; root Plan 09 for expansion | Art/UI/VFX may present it but do not rewrite story meaning independently. |

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
- the approved Ame model sheet and canonical static art;
- intrinsic visible bounds, pivots, face zones, baselines, hand sockets, and weapon geometry;
- static asset catalogue/source manifest and pipeline commands; and
- neutral-light/material declarations used by lighting.

### After Plan 01

Freeze or version:

- canonical primary landscape and compact-phone topology;
- component semantic IDs/groups and DialogShell behaviour;
- canonical `src/ui/interactionState.ts` UI-surface/top-overlay truth and a narrow current-input blocking adapter; no `InputContext`, `InputAction`, or `getInteractionPolicy()` competing with Plan 08;
- MazeViewport/scene slots and CSS layer/import order;
- VFX anchors, including `bag:<slot-id>` plus generic fallback;
- `src/motion.ts` as the canonical neutral import for `MotionPreference = "system" | "full" | "reduced"`, resolved `MotionMode = "full" | "reduced"`, and preference/provider behavior. Persist presentation/accessibility preferences outside campaign progress/session state; Reset Progress preserves them; and
- automated viewport/state fixtures.

### After Plan 04

Freeze or version:

- resolved `toLight`/cast semantics;
- cached full-world terrain topology/render model;
- layer/mask/gutter/compositing order;
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
| 03 | `docs/ART_BIBLE.md`, `docs/characters/AME_MODEL_SHEET.md`, structured source records/manifest | `docs/AI_ASSET_PROMPTS.md` by appending versioned history; architecture/catalogue and release evidence. Never rewrite exact historical prompts. |
| 01 | `docs/UI_UX_SPEC.md` | Architecture fixed-stage claim, README device/layout description, audit/release viewport evidence. |
| 04 | `docs/LIGHTING_AND_DEPTH_SPEC.md` or an owned Art-Bible section if that is cleaner | Architecture terrain/light contract, catalogue material records, release visual matrix. |
| 02 | `docs/VFX_BIBLE.md` | Architecture presentation/lifecycle contract, sound/effect integration, release matrix. |
| 08 | `docs/CONTROLS_AND_STEAM_DECK.md` | README controls/setup, architecture input contract, accessibility/preferences behaviour, release hardware matrix. |
| 05 | `docs/ANIMATION_SPEC.md` plus versioned animation source records | Art Bible/model references, asset prompts/provenance, architecture renderer/loading contract, release matrix. |
| 07 | `docs/PERFORMANCE_BUDGETS.md` and reproducible report/index conventions | Architecture/delivery, project audit, release checklist, Vercel/Tauri evidence where actually changed. |
| 09 | Updates `docs/GAMEPLAY_DESIGN_SPEC.md` and `docs/STORY_BIBLE.md`; optional campaign report generated from source | README campaign description, architecture/progression, audit/release evidence. |

Do not create two differently named files for the same contract. If a predecessor already created the intended document under a clear name, update it and record the substitution.

## 9. Shared test and evidence policy

Every implementation checkpoint runs the most focused tests while iterating, then:

```powershell
npm run check
npm run check:desktop
git diff --check
git status --short
```

Run a packaged Tauri build only when the changed subsystem or its specialist plan calls for it; Plan 07 and final Plan 09 require release qualification. Browser screenshots and traces must state commit, build mode, viewport, DPR, motion mode, input mode, and fixture/maze. Temporary evidence belongs outside tracked runtime assets unless the shared test policy explicitly adopts a small baseline.

The common viewport matrix is:

- 1920×1080 TV/couch presentation where practical;
- 1280×720 desktop/Tauri default;
- 1194×834 and/or 1024×768 iPad/tablet landscape;
- 960×540 Tauri minimum;
- 844×390 landscape phone; and
- 568×320 emergency phone floor.

Common state stress includes the longest objective, seven Bag slots, five friends, three-digit Power, four-digit currencies, Normal and Big Maze, every modal, explicit/system full and reduced motion preferences, forced static quality/fallback recipes, keyboard, pointer/touch, on-screen controls, and controller once available. Static is a rendering-quality or semantic fallback, not a third persisted motion preference.

## 10. Per-agent manager review checklist

Before committing an agent's work, verify:

1. The diff implements its owned plan without silently expanding another scope.
2. Human decisions in the game-vision spec are demonstrably preserved.
3. It reused all predecessor contracts and removed obsolete compatibility code only after evidence.
4. Its durable subsystem spec matches source and its release docs make no unsupported claim.
5. Focused, full, migration/solver, browser, performance, and platform checks are proportionate to risk.
6. New assets have source/provenance and real-size proofs; deleted runtime files are proven unreachable and recoverable through Git/source records.
7. No stale timer, held input, sound, animation, or decoded resource crosses level/navigation/visibility/overlay boundaries.
8. `git diff --check` is clean and the final status contains only intentional work.

Commit and push that reviewed checkpoint before issuing the next execution prompt.

## 11. Programme completion gate

Plans 01–08 are integrated only when their specs and contracts agree in the running app, not merely on paper. Plan 09 begins from that reviewed checkpoint. The final 24-maze release then needs one integrated solver/migration/content/viewport/controller/accessibility/performance/Tauri pass and an honest record of any physical-device check still awaiting the family.
