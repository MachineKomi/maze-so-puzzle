# Graphics and VFX overhaul plan

## 0. Manager-reviewed execution addendum

This addendum is execution authority and supersedes any conflict in the planning body. Read `docs/GAME_VISION_AND_DESIGN_SPEC.md`, `docs/plans/00-integrated-implementation-roadmap.md`, this plan in full, and the implementation-time Art Bible, UI/UX spec, Lighting spec, and Gameplay spec before changing code.

Execution begins only after Plans 07A, 06, 03, root checkpoint 03M, 01, and 04 are accepted. Re-resolve every symbol against current `HEAD`; consume the landed scene/render/anchor and 03M completion/door/Mimic/reward contracts rather than independently refactoring `MazeTerrain`, `App.tsx`, styles, gameplay state, or input state.

### Adopted product amendments

- Final Art Bible tokens and material rules replace the provisional hex palette in this plan. VFX may derive bounded effect values but may not create a competing world palette.
- Add a deterministic, typed `VfxFlavor` (or equivalent) that varies restrained accents by terrain theme, weapon, enemy personality, cage, portal pair, or authored story beat while preserving the semantic effect family. Provide an explicit chapter/effect variation matrix so repeated pickups, rescues, fights, traversal, and victories do not feel mechanically copied.
- Variation must create wonder and intelligent reuse, not noise: use fewer, larger, purposeful anime-readable shapes, one dominant silhouette, controlled accent motifs, and finite release. Do not satisfy variety with particle count.
- Preserve exact Power conservation, engine-event order, accessible outcome, abort/cancellation, and final reconciliation. The current 2,220ms combat duration is a measured starting recipe, not an immutable product rule; tune it with gameplay and child-readability evidence when a shorter cadence is clearer and more fun.
- Use revisioned measured anchors supplied by UI, including `bag:<semantic-slot-id>` with a generic Bag fallback. No fixed screen coordinate survives responsive layout.
- Every transient clone resolves the appropriate runtime rendition and geometry
  from the final semantic catalogue. Contact origins, feet, faces, grips, cage
  openings, reward bursts and homing targets use declared bounds/pivots/sockets,
  never a generic 512px centre, filename branch or per-character CSS exception.
- Resolve `VfxFlavor` through typed material, personality and motif tags with a
  complete generic fallback. In a multi-region level, derive floor/wall/material
  context from the semantic event coordinate; do not use one level-wide theme
  for an effect occurring in another portal region.
- Expand the test-only readability/integration rack across every final enemy,
  friend, weapon, item, cage, portal/chest state, Science pickup and terrain
  family. Shared semantic recipes are preferred; catalogue coverage does not
  require bespoke particles for every sprite and must not preload the full art
  library in production.
- The presentation director owns run identity, absolute time, abort/final state, sound/VFX cues, and a presentation-busy lease. It requests that controls stop/neutral-gate input; it does not independently clear each device's private queues.
- Use the Plan-04 terrain/render seam. Lighting owns topology, wall/depth geometry, global light, masks, gutter, and grounding nodes. VFX owns assigned moving hazard material layers, local emission, particles, transient effects, and step sparkle styling.
- Import resolved `MotionMode = "full" | "reduced"` from Plan 01's canonical `src/motion.ts`; do not redefine it in `src/vfx/types.ts` or add another preference. Keep `VfxQuality = "full" | "lite" | "static"` independent: static is a forced quality/semantic fallback, not a third motion preference or an accidental frozen frame. This addendum supersedes the duplicate type declaration in the illustrative body below.
- Treat resource budgets as provisional allocations until Plan 07B measures the integrated build. Preserve the authored emotional beat in full/lite/static recipes.
- Include every approved Mimic family's registered closed chest, good open chest
  and revealed enemy plus Gold/Science reward sprays without pre-reveal leakage,
  while leaving the shared deterministic 65/35
  outcome, exact drop tables and exactly-once credit to the 03M/Plan-09 gameplay
  owner. Door choreography begins only after the stationary open event commits;
  goal/victory choreography never commits pending completion. Consume Plan 03's original anime
  emotion-mark assets and Plan 01 portrait anchors in the typed reaction system.
- Consume Plan 01's final `PT-20260903-25` surface/type/state tokens and large
  contextual-art slots. This plan may add bounded open/close, focus, reveal and
  celebration choreography, but it does not restyle panels, swap fonts or create
  another glass system. Never animate backdrop blur or continuously filter the
  moving maze; full/lite/static recipes preserve the same authored UI hierarchy
  and blocker/item recognition.

### Documentation and completion

Create and maintain `docs/VFX_BIBLE.md` covering semantic effect grammar, flavor/variation rules, intensity tiers, typed timing authority, sound synchronization, layer/transform ownership, cancellation, quality tiers, and designed reduced/static equivalents. Update architecture, relevant sound documentation, audit, and release evidence in the same change that makes them true.

Extend the shared browser/performance harness established by Plan 07A. Completion requires paused-frame, grayscale, reduced/static, phone, tablet, desktop/TV, cancellation, hidden-tab, resize, Big Maze, jump→portal, per-slot flight, sound-skew, lifecycle-leak, and packaged-WebView checks plus the full project gates.

**Document status:** implementation-ready plan; research and audit only

**VFX scope:** dynamic effects, transient presentation choreography, environmental material motion, particles, effect/sound synchronization, reduced-motion equivalents, and presentation cancellation

**Explicit non-scope:** global static art direction, HUD layout, wall-lighting geometry, multi-frame character animation, and engine outcomes

**Repository baseline inspected:** `main` at `c6b6628b6e651d18161a4d1302935d3096f665c6`

**Initial working tree:** clean (`git status --short` returned no entries)

**Audit date:** 2026-09-02, Europe/London

This document proposes no asset or effect implementation. No generated image was added, and no raster generation was run. The current connected SVG terrain model is the better source of truth for edge-aware materials; the live audit did not identify a bitmap effect that would materially outperform a small SVG/CSS primitive at this stage. Image generation should be reconsidered only after Phase 3 profiling proves that a bounded, art-directed flipbook or noise tile is both clearer and cheaper than the code-native option.

During drafting, another planning agent added the untracked `docs/plans/01-ui-ux-layout-overhaul.md`. It was read only for interface coordination and was not modified. This plan owns only `docs/plans/02-graphics-vfx-overhaul.md`.

## 1. Outcome

The overhaul should make every important state change readable in one paused frame, then make it delightful in motion. The intended result is a coherent magical language with:

- one dominant gameplay shape per effect;
- gentle anticipation, crisp contact, and warm recovery;
- hazard identities that survive grayscale and reduced motion;
- exact Power arithmetic and sound cues driven by the same typed timeline;
- small, bounded layers that do not repaint the full board unnecessarily;
- curated static equivalents rather than accidentally frozen animations; and
- one abortable presentation lifetime that covers DOM, CSS/Web Animations, timers, sound voices, input locks, and announcements.

The current game already has strong foundations: connected terrain surfaces, friendly language, exact Power conservation, a three-hit combat plan, deterministic door particles, explicit reduced-motion branches for combat and jumping, semantic status messages, and a central core-presentation cancellation path. The plan retains those strengths and removes drift between pure timing data, React lifecycles, CSS percentages, and audio scheduling.

## 2. Audit method and evidence contract

### 2.1 Evidence levels

| Rank | Meaning | Required response |
|---|---|---|
| **E1 — observed and source-confirmed** | Reproduced in the in-app browser and matched to an exact symbol/selector. | Treat as a release blocker when severity is High. |
| **E2 — source-confirmed** | Exact implementation or lifecycle behavior is present in the inspected commit, even if the transient was not captured. | Characterize with automated tests before changing it. |
| **E3 — research-backed inference** | A target follows primary/authoritative guidance and the observed constraints. | Validate in the Phase 0 effect lab and live play. |
| **E4 — aesthetic hypothesis** | A proposed detail is tasteful but not yet evidenced in this game. | Keep tunable; do not let it change semantics or budgets. |

### 2.2 Live inspection

The game was run from the inspected working tree with Vite at `http://127.0.0.1:4173/` and controlled through the Codex in-app browser. Captures were written outside the repository to `C:\Users\hellb\AppData\Local\Temp\maze-vfx-audit-2026-09-02`. The host reported `prefers-reduced-motion: reduce` as false; reduced-motion behavior was therefore source-audited but not visually accepted in this run.

| Capture | State reviewed | Main observation |
|---|---|---|
| `level-07-lava-initial.png` | Wishing Woods, desktop, lava in the initial camera | Attractive warm texture, but the entire pool reads as one uniformly bright orange ribbon; it lacks crust/core hierarchy, contact light, and an edge cue. |
| `level-08-water-initial.png` | Ame's Grand Parade, desktop, water in the initial camera | The cyan surface is immediately identifiable, but motion is not legible in a still and the shore has no foam, depth band, or local integration. |
| `level-12-poison-close.png` | Moonlit Friendship Quest after a verified engine-valid route | Bubbles make poison distinct; the smooth purple body and screen-like highlights still read closer to magical water than a viscous toxic material. |
| `weapon-pickup-contact.png` | Comet Spear acquisition | Large copy and icon are unmissable, but board-centre text duplicates the bottom notice, covers nearby play, and does not visually connect source to bag. |
| `combat-first-impact.png` | First Power-1 enemy victory | Exact `2 + 1 = 3` feedback is excellent; contact sparks are faint at camera scale and the final outcome text appears while the staged transfer is still meant to be playing. |
| `portal-arrival-early.png` | Rose Heart portal | Pair identity is clear in the art and notice, but the live frame explains only the destination. No departure or connective beat is visible. |
| `phone-390x844-lava.png` | Phone portrait | Intentional orientation interstitial correctly suppresses play and VFX. |
| `phone-844x390-lava.png` | Phone landscape | The complete game is usable, but item/effect shapes are very small; thin spark and contour details cannot be relied upon. |

The tester routes used the exact engine transition rules, including prerequisite pickups and Power changes. Tester rewards did not persist. Desktop was observed at 1280×720; responsive samples used 390×844 and 844×390, then the browser viewport override was reset.

### 2.3 Source and test audit

Primary source areas were `MazeTerrain` and presentation orchestration in `src/App.tsx`, `src/combatPresentation.ts`, `src/jumpPresentation.ts`, `src/magicEffects.ts`, `src/sound.ts`, `src/styles.css`, engine events in `src/game/engine.ts`, and their tests. The primary audit ran these existing targeted tests successfully: `combatPresentation.test.ts`, `jumpPresentation.test.ts`, `magicEffects.test.ts`, `sound.test.ts`, and `mapNotices.test.ts` — 5 files, 20 tests. The independent architecture pass expanded that set to six targeted files and also passed all 34 tests.

## 3. Non-negotiable contracts

Implementation is accepted only if all of the following remain true:

1. The engine remains authoritative. VFX may render a presentation copy but must not move entities, grant items, open doors, rescue friends, alter victory, or decide combat.
2. Combat Power is conserved exactly: `powerAfter === powerBefore + enemyPower`. Every intermediate displayed pair must sum to that same total.
3. Existing input locking is preserved for a presentation's declared lifetime. Cancellation must release the lock in a `finally`-equivalent path and must never replay queued input in the wrong level.
4. Existing accessible names, live-region meaning, and arithmetic remain available. Decorative VFX remains `aria-hidden`.
5. Restart, Home/Mazes/Book navigation, level change, visibility loss, and unmount cancel old presentation work before new work can render or sound.
6. Reduced motion retains trigger, location, item/effect identity, outcome, Power delta, sound/announcement policy, and final state. It removes travel, looping, shake, spin, parallax, animated blur, and large scale changes.
7. Tauri/WebView2 and browser builds use the same semantic event and timing configuration. No desktop-only outcome path is introduced.
8. The 6×6 camera, terrain coordinates, pointer mapping, solver, fog discovery, and gameplay timings are not redesigned by this track.
9. VFX cannot assume fixed HUD coordinates. UI supplies measured named anchors for wallet/bag destinations.
10. Character transforms have a single owner at a time. VFX can wrap or decorate a sprite, but it cannot replace the sprite-animation system.

## 4. Evidence-ranked findings

### E1 / High — fix before visual expansion

1. **`MazeTerrain` memoization is defeated and full-level SVG work reruns on presentation ticks.** `MazeTerrain` is memoized at `src/App.tsx:630`, but `camera={fullLevelWindow(level)}` at `src/App.tsx:2683` creates a fresh object on every render (`fullLevelWindow`, `src/App.tsx:575-583`). The component builds connected paths, masks, patterns, and holes for the full level (`src/App.tsx:641-875`), including off-camera regions. Combat transfer ticks therefore invite unrelated terrain reconstruction. Memoize the full window and a per-level terrain render model before adding material layers.

2. **Combat has two timing authorities.** The typed beats are `120/330/560`, `570/760/990`, and `1020/1200/1500`, with transfer through 1730 ms and victory at 1900 ms (`src/combatPresentation.ts:84-108`, `:173-193`). CSS independently encodes contact percentages and transfer timing in `src/styles.css:5574-5884`. `getCombatPresentationFrame()` exists at `src/combatPresentation.ts:250-304` but the runtime does not use it. Preserve the good alignment by making the typed plan the sole timeline and exposing progress/cue CSS variables.

3. **Jump-to-portal composition skips portal presentation.** The engine can emit `hole-jumped` followed by `portal-warped` (`src/game/engine.ts:177-183`, `:266-282`), while the App chooses the jump branch before the portal branch at `src/App.tsx:1858-1862`. The new coordinator must sequence jump landing into portal departure rather than choosing one.

4. **Portal choreography discards information it already stores.** `PortalPresentation` keeps `from`, but rendering at `src/App.tsx:2895-2910` uses only the destination. The camera snaps to final engine state. Child rings with delayed starts can end at about 770/850 ms while the subtree is removed around 695 ms (`src/App.tsx:1562-1578`; `src/styles.css:6518-6627`). Add a deliberate departure/cut/arrival timeline and ensure every tail finishes before teardown.

5. **Cancellation does not cover every presentation resource.** Core timers and states are centralized in `cancelPresentations()` (`src/App.tsx:1394-1421`) and level loading clears additional timers (`src/App.tsx:1646-1683`). However, visibility/navigation do not consistently clear treasure flight/map notices; unmount omits the treasure and D-pad-hold timers; and already-started Web Audio voices cannot stop (`src/App.tsx:1614-1635`, `:2086-2094`; `src/sound.ts:179-243`). Replace separate timer ownership with one abortable scope and cancellable sound handles.

6. **The stylesheet cascade has already changed effect meaning.** `.player-layer::before` is authored as a step sparkle at `src/styles.css:2881-2896`, then redefined as a cast shadow at `src/styles.css:6348-6362`; the shadow receives the sparkle animation. `.bump-a/.bump-b` are emitted at `src/App.tsx:2654` but have no effective CSS rules. These are direct consequences of the V-number append cascade and require consolidation, not another override block.

7. **Hard-coded treasure destinations are layout-coupled.** `treasureFlightStyle` at `src/App.tsx:2538-2548` assumes board dimensions and target x positions near 735/850. The UI plan is introducing measured `MazeViewport`/HUD anchors. VFX must consume that interface before adaptive layout ships.

### E1 / Medium-high — clarity and accessibility debt

8. **Hazards have texture but weak boundary and physical hierarchy.** Water, lava, and poison each use a connected raster-filled base plus a repeated SVG effect pattern and shared inset mask (`src/App.tsx:641-768`, `:825-830`). Later CSS removes useful edge strokes/filters (`src/styles.css:1686-1691`, `:5246-5252`). At live scale, materials terminate cleanly but do not express foam/shallows, hot crust/light spill, or an oily meniscus. They rely too much on hue and interior motion.

9. **Several reduced-motion states are accidental frames, not designed equivalents.** Twelve scattered `prefers-reduced-motion` blocks and the global 0.001 ms/one-iteration override begin at `src/styles.css:1078-1086`. Combat hides its active impact/mote layers with no designed contact tableau (`src/styles.css:6073-6094`); portal can leave stacked solid rings; victory confetti freezes where it happens to start. Door and jump are better precedents: the door retains a static motif/halo (`src/styles.css:7239-7261`) and jump places Ame at the destination.

10. **Feedback timing can reveal the final result before staged motion.** Engine feedback is committed immediately at `src/App.tsx:1759-1763`; battle copies then animate old-to-new numbers over 2220 ms. Screen-reader meaning remains correct, but the visual feedback bar can say the enemy scooted away and show final arithmetic while the enemy is still present. Introduce an announcement policy with immediate semantic status and visually deferred/subordinate celebratory copy; never delay the actual accessible outcome.

11. **Item readability is not tested across terrain families.** Generic items use a dark drop shadow and warm hover (`src/styles.css:2902-2907`, `:2977-2980`, `:3260-3267`), but there is no paired light/dark separating contour or terrain-aware contrast harness. Yellow keys, potions, treasure, and goal are vulnerable on lava/bright floors; blue/purple magic is vulnerable on water/poison. Motion cannot be the only discriminator.

12. **Ambient effects compete above actors and paint continuously.** Theme ambience can sit at z-index 18 (`src/styles.css:1203-1236`) while actors are below it; material overlays use screen blending and animated contents; several items animate filters indefinitely. Permanent `will-change` and `left/top` camera/player transitions at `src/styles.css:267-275` and `:6405-6413` should be replaced by scoped compositor promotion and transform ownership.

### E2 / strengths to preserve

- Combat's three contacts are already rhythmically separated and escalate board punch modestly. Its pure plan rejects non-conserving inputs (`src/combatPresentation.ts:201-247`).
- Rescue uses cage hold, split, pet hop, hearts, and player cheer over a child-safe 900 ms set piece (`src/App.tsx:1499-1522`, `:2849-2867`; `src/styles.css:5719-5921`).
- Jump uses nested travel/arc transforms and exact 1/2/3-hole durations of 460/585/710 ms (`src/jumpPresentation.ts:13-20`; `src/App.tsx:2869-2893`).
- Door palettes combine colour and motif, and its 18 particles are deterministic (`src/magicEffects.ts:3-57`; `src/App.tsx:2765-2795`).
- Feedback language says enemies “scooted away,” uses no injury language, and presents exact arithmetic (`src/App.tsx:338-345`).
- Effects are decorative/hidden from accessibility APIs while notices use semantic status roles (`src/App.tsx:2923-2959`).

## 5. Cohesive magical effects language

### 5.1 Design sentence

**Soft storybook magic gathers, makes one clear promise, lands with a bright tactile “ping,” then releases into stars, petals, ribbons, or Power beads.** It is exciting without depicting injury, and it leaves the board quieter than the moment of contact.

This is an original rule set. Magical-girl and JRPG references inform trigger/medium/marker/result structure and intensity tiers, not identifiable props, glyphs, named attacks, exact palettes, shot order, or choreography.

### 5.2 Shape and motif grammar

| Motif | Meaning | Allowed use | Do not use for |
|---|---|---|---|
| Four-point star / soft diamond | General magic, certainty, contact | Contact key pose, pickup confirmation, hint glint, victory accent | Continuous random wallpaper or every particle in every effect |
| Ribbon arc / crescent | Direction and travel | Weapon wind-up, jump trail, portal connection, transfer path | Stationary hazard identity |
| Bead / orb | Countable Power or currency | Exact Power transfer, potion-to-Power link, treasure-to-wallet link | Uncounted ambient clutter |
| Ring / flower mouth | Threshold and destination | Portal, goal, door seal, landing ripple | Generic combat contact |
| Heart / petal / leaf | Care, rescue, friendship, natural magic | Rescue, leaf pickup, safe recovery | Enemy impact body language |
| Bubble / oily loop | Poison viscosity | Poison only, with irregular sizes and residue | Water shimmer |
| Crest line / ripple | Water movement | Water shore, crossing, landing on water | Lava or poison |
| Crack / hot island | Lava mass and temperature | Lava crust, hot core, danger edge | Combat sparks |
| Key motif: heart/star/sun | Lock identity | Key, door, matching hint, opening burst | Unrelated reward effects |

Every effect has one primary silhouette and at most two secondary motif families. At final phone-landscape scale, the primary silhouette must remain readable when all secondary particles are removed.

### 5.3 Colour script and redundant identity

The values below are initial token families, not final asset recolours. Art and accessibility review may tune them, but the light/dark ordering and redundant shape rules are contractual.

| Semantic family | Initial token direction | Non-colour identity |
|---|---|---|
| Neutral friendly magic | ivory `#fff8d8`, star gold `#ffd65a`, lavender `#b68cff`, deep outline `#30244f` | four-point stars and soft diamonds |
| Power | white-hot centre, gold body, pink/lavender outer glow | countable beads moving on one curved path; arithmetic remains visible |
| Water | deep blue `#155aa8`, teal `#29c7d9`, near-white crest `#e7ffff` | horizontal crests, concentric ripples, shallow/deep bands |
| Lava | dark plum crust `#5b2737`, ember `#f45a2a`, yellow core `#ffd65a` | angular cracks, slow hot islands, upward heat cue |
| Poison | deep violet `#40215c`, purple body `#8f4dce`, pale oily sheen `#d6a6ff`, mint accent `#79e3a2` | irregular bubbles, spiral fumes, sticky meniscus/rune spots |
| Rescue | warm white, peach/pink, leaf green | split cage silhouette, heart/petal release, safe landing pose |
| Warning / blocked | cream + coral edge; never blood red | stop-shaped ring, short compression, persistent target outline |
| Victory | full friendly spectrum, with white/gold reserved for the result hold | radiant ring, crown/star marker, rescued-friend accents |

Critical borders and icons target at least a 3:1 contrast relationship with immediately adjacent terrain where practical. A paired contour—one dark, one light—should replace a single universal glow for critical pickups. Water/lava/poison remain distinguishable in grayscale through motion axis, edge structure, pattern, and sound.

### 5.4 Timing families

| Family | Duration / cadence | Easing | Use |
|---|---|---|---|
| Ambient material | 4–10 s, asynchronous | linear for flow; sine-like for shimmer | Water drift, lava core migration, poison fume/bubble cycles. No synchronized “breathing” across the board. |
| Micro response | 90–260 ms | `cubic-bezier(.2,.8,.3,1)` out, then soft settle | Step spark, blocked compression, contact key pose, small counter acknowledgement |
| Pickup | 520–760 ms local effect; notice may remain 1.4–1.85 s | quick lift, curved transfer, 120–180 ms result hold | Items, keys, potions, leaf, currencies |
| Traversal / release | 460–900 ms | anticipatory ease-in, fast middle, overshoot-free ease-out | Jump, portal, door, rescue |
| Combat set piece | preserve 2220 ms | three distinct anticipation/contact/recovery beats | Three hits, exact transfer, victory release |
| Major victory | 1.8–3.4 s finite flourish, then static | broad ease-out with a calm result hold | Goal and completion; no indefinite high-energy confetti |

Contact uses a maximum one-frame-equivalent white core; it must not become a full-board flash longer than 50 ms. Recovery particles lose value, opacity, speed, and density as they dissipate.

### 5.5 Intensity tiers

| Tier | Examples | Primary spread | Particle ceiling | Sound / camera policy |
|---|---|---:|---:|---|
| **0 Ambient** | water/lava/poison, portal idle | material or ≤0.8 tile | no transient DOM particles | quiet loops; no camera motion |
| **1 Guidance** | hint, blocked feedback, step, common currency | ≤1.1 tiles | 0–4 | short cue; no board transform |
| **2 Acquisition/action** | item/key/potion pickup, jump landing, door unlock | ≤1.8 tiles | 6–18 | clear transient; local punch only |
| **3 Encounter/release** | combat contacts, rescue, portal | ≤2.5 tiles; one bounded board tint allowed | 12–32 | staged sound; camera remains spatially truthful |
| **4 Major result** | final combat release, goal/victory | board-wide opacity-only veil for ≤2 frames, then local | 24–48 finite | fullest chord; no shake by default; static result remains |

### 5.6 Layering, occlusion, and camera rules

1. Terrain base and depth sit below actors. Material highlights may cross a character's feet by at most 8% of a tile; fumes/heat may pass behind the body but not over faces, Power numbers, or interaction motifs.
2. Hazard edges render above their material base but below items, goal, doors, cages, actors, and transient contact.
3. Ambient theme glyphs cannot sit above actors. Their z-layer moves below object/player layers or is clipped to non-walkable dressing.
4. Cast shadows, step sparks, and aura each receive a dedicated element or pseudo-element. No pseudo-element has two owners.
5. The primary transient sits at the event's world coordinate. UI-bound transfers alone may cross the scene/HUD boundary, using measured anchors.
6. Full-board tints are opacity-only, never blurred, and never obscure exits, hazards, or text. No effect moves the camera for a routine pickup or hit.
7. Portal travel uses a deliberate camera cut behind a near-opaque connective frame; it never pans across the maze and falsely implies a traversable route.
8. In Big mode and adaptive layout, world-space layers derive from the same `MazeViewport` matrix as sprites. UI flight paths are recalculated if the viewport changes and canceled if their destination disappears.
9. Effects are authored at three scales: ≥78 px/tile, 48–77 px/tile, and ≤47 px/tile. The smallest scale drops secondary motes before shrinking the primary contour below one physical-pixel-equivalent.

## 6. Complete current effect inventory

Performance risk is relative to this renderer: **Low** means bounded transform/opacity; **Medium** means repeated paint or several nodes; **High** means full-board paint, animated filters/masks, layout-position animation, or large persistent node sets.

### 6.1 Environmental and continuous effects

| Effect | Trigger and duration | Current layers / implementation | Strengths | Weaknesses | Current reduced-motion form | Risk |
|---|---|---|---|---|---|---|
| Water surface | Present whenever visible level contains water. Base is static; shimmer 2.8 s and dash travel 3.2 s loop. | Connected rounded path; 4.6-tile raster pattern; shared eroded mask; 1.8-tile wave-mark pattern; screen-blended FX path (`src/App.tsx:641-699`, `:730-742`, `:825`, `:828`; `src/styles.css:7016-7037`, `:7083-7090`). | One continuous pool, recognizable cool texture, wave cue, no per-tile DOM. | Brightness and marching dashes imply motion but no flow direction, depth, shore quieting, crossing ripple, or edge integration; similar bright-line grammar to lava. | Animations stop; FX remains at about .62 opacity (`src/styles.css:7239-7257`). | **Med–High:** masked patterned stroke and blend repaint over a large path. |
| Lava surface | Present whenever lava exists. Shimmer 1.65 s; cores 1.45 s alternate; vein 1.3 s loop. | 4.6-tile raster base, shared mask, 1.75-tile two-core/vein pattern (`src/App.tsx:642`, `:645`, `:687-705`, `:743-755`, `:826`, `:829`; `src/styles.css:7039-7063`, `:7092-7105`). | Faster hot cores communicate more energy/danger. | Uniformly bright surface; no slow mass flow, dark crust, yellow core hierarchy, bounded heat distortion, environmental spill, or contact edge. Dashed vein can resemble water. | Static .62 FX frame. | **High continuous:** three loops inside a masked, screen-blended pattern. |
| Poison surface | Present whenever poison exists. Four bubble loops 2.05–2.75 s with negative offsets. | 4.2-tile raster base, shared mask, 1.55-tile four-circle pattern (`src/App.tsx:643`, `:646`, `:690-713`, `:756-768`, `:827`, `:830`; `src/styles.css:7065-7081`, `:7107-7113`). | Bubbles are a useful non-colour cue and read in the live close capture. | Repetition is obvious; smooth body and screen sheen feel watery; no viscous lag, asymmetrical bulge, fume, pop residue, rune/spot, or meniscus. | Static .62 frame with bubbles frozen at arbitrary phases. | **Med–High:** repeated animated SVG content under mask/blend. |
| Shared hazard boundary | Whenever any water/lava/poison path exists; static. | One inset morphology/blur filter repeated by three masks (`src/App.tsx:715-768`); explicit CSS later removes stroke/filter lips (`src/styles.css:1686-1691`, `:5246-5252`). | Avoids square tile seams and sticker-like raised edges. | Makes three substances share the same termination; no foam, shallow band, crust, oily rim, or foot occlusion. | Same boundary. | **Medium:** static filter buffers are large and duplicated. |
| Theme ambience | Theme-specific, continuous 4.4 s loop. | A pseudo-layer of pearl/harvest glyphs at z18 with transform/opacity (`src/styles.css:1203-1236`). | Cheap, charming, theme flavour. | Can cross actors and add noise during high-intensity effects. | Animation stops at default opacity rather than a curated quiet value. | **Low–Medium.** |
| Player move hop + step sparks | Every successful single-tile movement; hop 76 ms, sparks 260 ms. | `.move-a/.move-b` on player; two pseudo-stars (`src/App.tsx:2913-2921`; `src/styles.css:2881-2896`, `:3180-3204`). | Fast tactile motion and alternating retrigger classes. | `::before` is later overwritten by cast shadow, so only one star is dependable; sparkle shape is generic on every terrain. | Global animation suppression; final position remains. | **Low** intended; current blurred shadow pseudo may repaint. |
| Legendary Power aura | Power ≥99, continuous 1.4 s rainbow + .7 s pulse. | Gradient-clipped local/HUD number and multi-drop-shadow sprite (`src/App.tsx:2914`; `src/styles.css:6384-6398`). | Clear milestone and celebratory palette. | Two indefinite loops compete with encounters; scale/filter motion; hue-led and visually loud. | Animations disabled; rainbow gradient remains. | **Medium continuous.** |

### 6.2 World objects, affordances, and pickups

| Effect | Trigger and duration | Current layers / implementation | Strengths | Weaknesses | Current reduced-motion form | Risk |
|---|---|---|---|---|---|---|
| Weapon, potion, Splash Boots, generic key idle | While uncollected; 2.8 s loop. | Sprite plus shared `item-shine` translate/drop-shadow animation (`src/App.tsx:2685-2719`; `src/styles.css:2902-2907`, `:2977-2980`). | Consistent pickup affordance. | Same warm glow for unrelated categories; animated filter; no terrain-aware contour. | Loop suppressed globally, sprite remains. | **Medium continuous.** |
| Spring Boots idle | While uncollected; static. | 84% sprite, no dedicated motion (`src/styles.css:5941-5945`). | Strong silhouette. | Less salient than other traversal tools; no category motif or separating rim. | Identical static. | **Low.** |
| Antidote leaf idle | While uncollected; static. | 82% sprite with green shadow (`src/styles.css:1693-1699`). | Colour/shape differ from boots and keys. | Progression-critical but quieter than generic shiny items; green shadow can merge with lush floors. | Identical static. | **Low.** |
| Key idle / identity | While uncollected; colour-specific 2 s glow. | Key art, heart/star/sun label and variables (`src/App.tsx:2695`, `:2713-2715`; `src/styles.css:7117-7137`). | Colour + shape + text redundancy is strong. | Animated filter; tiny motif at phone scale; single contour. | Static key/motif. | **Medium.** |
| Door idle / identity | While locked; 2.4 s filter motion. | Full door art, motif label, red/blue/yellow variables (`src/App.tsx:2713-2718`; `src/styles.css:7117-7143`). | Match language is explicit. | Glow/filter can become louder than adjacent goals/items; no state-specific “ready to open” cue. | Static door/motif. | **Medium.** |
| Portal idle | While present; 1.8 s scale/drop-shadow loop. | 92% portal sprite plus pair motif (`src/App.tsx:512`, `:2716-2718`; `src/styles.css:330-355`). | Pair identity and magical affordance. | Shares generic pulse/glow language with goal/key; no visible direction to its twin. | Static art/motif. | **Medium.** |
| Treasure idle | While uncollected; 1.25 s alternate loop. | 84% art, amount badge, translate/rotate/filter (`src/App.tsx:2712`; `src/styles.css:6366-6368`). | Value is explicit. | Fast continuous filter and gold/lava competition. | Loop removed, static chest. | **Medium.** |
| Goal idle | While level is playing; 2 s loop. | Goal sprite, radial halo pseudo, scale/rotate/drop-shadow (`src/App.tsx:877-880`; `src/styles.css:3157-3173`, `:2909-2911`, `:2982-2985`). | Highest static affordance; halo survives motion loss. | Same warm glow family as treasure/potion/key; no arrival choreography. | Static sprite + halo. | **Medium.** |
| Hole | While in camera; static. | Separate DOM bitmap layer at z2 (`src/App.tsx:659-664`, `:872-875`; `src/styles.css:5924-5939`). | Clear depth silhouette; appropriately quiet. | No safe-jump readiness marker; generic jump rings do not inherit hole count/direction. | Identical static. | **Low.** |
| Cage / waiting friend | Until rescue; static. | Friend behind complete cage front-face bitmap (`src/App.tsx:2699-2706`; `src/styles.css:6482-6498`). | Waiting state is unmistakable and child-safe. | No subtle “unlockable now” state; effect owns no idle cue. | Identical static. | **Low.** |
| Generic item pickup notice | Any potion/weapon/boots/spring-boots/leaf/key/currency event; 1850 ms. | Item is removed immediately; large icon+outlined text floats through board centre; bottom feedback duplicates message (`src/App.tsx:324-429`, `:1759-1763`, `:2923-2935`; `src/styles.css:6641-6687`, `:6969-6978`). | Very legible, terrain-independent, persists despite another move. | One choreography for every category; covers play; no source ring or bag/HUD connection; two messages compete. | Static toast held at translated position for timer lifetime. | **Low–Medium:** one composited notice, but large paint area/text stroke. |
| Potion / Power pickup | Potion-collected; generic notice 1850 ms; sound ≈250 ms. | Same generic toast; state/HUD Power changes immediately; `power` arpeggio (`src/App.tsx:347-360`; `src/sound.ts`). | Exact value can be stated; sound differs from item pickup. | No local-to-Power bead bridge, so cause and HUD change are spatially disconnected. | Static notice + immediate number. | **Low.** |
| Weapon, boots, spring boots, leaf, key pickup | Corresponding engine event; generic notice 1850 ms; pickup sound ≈170 ms. | Category icon/text only (`src/App.tsx:361-394`; `src/sound.ts:67`). | Wording is friendly and explicit. | No category choreography; key does not echo its lock motif strongly; leaf/boots do not show newly safe hazard relationship. | Static notice. | **Low.** |
| Gold/Science small currency pickup | Collection event; generic notice 1850 ms; treasure/science cue ≈320/360 ms. | Immediate wallet change plus generic board notice. | Type and amount are explicit. | No measured local-to-wallet trace; competes with treasure flight language. | Static notice and final wallet value. | **Low.** |
| Treasure flight | `treasure-collected`; source clone ≈1050 ms, CSS flight 1 s, 8 motes .72 s. | Absolute source clone z200 flies by hard-coded x/y deltas; wallet enters receiving state immediately (`src/App.tsx:1782-1795`, `:2538-2548`, `:2600-2605`; `src/styles.css:6366-6382`). | Connects world reward to wallet and feels celebratory. | Fixed geometry breaks adaptive layout; animates position variables/top-left-derived transform; wallet acknowledgement precedes arrival; crosses UI indiscriminately. | JS lifetime reduces to ≈180 ms but CSS animation is disabled; source icon briefly holds and wallet response effectively flashes. | **High** because of layout coupling, long travel, z200, and multiple motes. |
| Post-combat Power gain notice | After battle clears; 1550 ms, 900 ms reduced. | Large anchored `+N` map toast above precombat tile (`src/App.tsx:1487-1495`; `src/styles.css:6981-7009`). | Exact, local, highly legible. | Starts after a separate transfer already showed the same gain; can feel like a fourth result beat. | Static anchored badge. | **Low.** |

### 6.3 Transient presentations and system feedback

| Effect | Trigger and duration | Current layers / implementation | Strengths | Weaknesses | Current reduced-motion form | Risk |
|---|---|---|---|---|---|---|
| Combat victory | `enemy-defeated`; 2220 ms, reduced 180 ms. | Hidden normal sprites; presentation copies; three lunges; weapon swish; 1 contact star + 12 sparks; six transfer motes; local/HUD numbers; board punch/radial flash (`src/App.tsx:1439-1497`, `:1799-1826`, `:2797-2846`; `src/combatPresentation.ts`; `src/styles.css:5574-5884`). | Exact conservation, three-hit rhythm, friendly recoil/dissolve, arithmetic. | Weak first anticipation; repeated contact geometry; all sparks live for timeline; CSS timing duplicates TS; outcome copy can pre-announce final frame. | Motion layers hidden; numbers update over 180 ms; no curated contact/transfer tableau, then anchored `+N`. | **High:** full-board transform/flash, many nodes, layout-position motes, shadows. |
| Rescue / cage release | `animal-rescued`; 900 ms, reduced ≈140 ms. | Player cheer, pet hop, two cage halves, seven heart/star particles; friend-rescue cue at 150 ms (`src/App.tsx:1499-1522`, `:2849-2867`; `src/styles.css:5719-5921`). | Strong hold→split→hop→joy story; safe tone. | No distinct lock/snap cue; halves fade mid-flight; same particle timing for every cage. | Static freed friend; cage and burst hidden. | **Medium:** clip-path/filter and bounded nodes. |
| Jump over holes | `hole-jumped`; 460/585/710 ms for 1/2/3 holes; reduced 140 ms. | Outer world travel + inner arc; shadow, boots, weapon, Power, takeoff/landing rings; launch cue, optional middle boing, landing cue (`src/App.tsx:1524-1560`, `:2869-2893`; `src/jumpPresentation.ts`; `src/styles.css:5958-6071`). | Excellent decomposition and exact hole-count scale; camera focuses midpoint. | Last 20 ms can be cut by teardown; stale CSS default comment; no directional trail/compression; generic rings. | Avatar is placed at destination with no travel—good semantic equivalent. | **Low–Medium:** transform/opacity, few nodes. |
| Portal warp | `portal-warped`; 720 ms lifecycle, CSS ≈695 ms; sound begins immediately. | Arrival pad/body/weapon/Power at destination; four rings and sparkles (`src/App.tsx:1562-1578`, `:2895-2910`; `src/styles.css:6518-6627`). | Art and pair motif identify the portal; friendly “whoosh” notice. | No departure/connection; camera snap; stored `from` unused; delayed rings clipped; pair class has no choreography difference. | Animations suppressed without a designed opacity/result state, leaving stacked forms possible. | **Medium:** glow/rings/sparkles, currently bounded. |
| Door opening | `door-opened`; 860 ms lifecycle, visual clear ≈835 ms. | Door brightens/dilates/dissolves; halo, motif, deterministic 18-glyph radial shower; unlock sound immediate (`src/App.tsx:1580-1602`, `:2765-2795`; `src/magicEffects.ts`; `src/styles.css:7145-7237`). | Best colour+shape redundant transient; clear seal→release→absence. | 18 particles animate layout positions; heavy filter/blur stack; sound has no staged latch/release split. | Static dim door + halo + motif, particles hidden. | **High local**, but finite. |
| Blocked move / bump | Engine blocked event; intended brief retrigger. | `bumpPulse` alternates board classes and plays bump feedback (`src/App.tsx:1124`, `:1889`, `:2654`). | State and hint systems already know why movement failed. | No matching `.bump-a/.bump-b` CSS, so world contact is absent; feedback may jump directly to modal after repetition. | Same absence. | **None currently; target Low.** |
| Guided marker / hint | After repeated blocked interactions; .75 s infinite alternate. | Modal explanation plus bright 180% circular marker, scale/brightness (`src/App.tsx:1721-1731`; `src/styles.css:6336-6346`). | Persistent location cue and explicit text. | Oversized/infinite motion; high brightness; may obscure the object and compete with hazards. | Static glow through global suppression. | **Medium continuous while active.** |
| Feedback bar / announcements | Most engine events; semantic state updates immediately. | Compact bar and icon; `aria-live` is suppressed when a map toast already carries status (`src/App.tsx:1759-1763`, `:2954-2959`). | Accessible, explicit, central event vocabulary. | Visual copy can contradict staged timing; multiple simultaneous notices compete. | Identical text state. | **Low.** |
| Goal arrival / level win | `level-won`; melody ≈660 ms; modal waits until other presentations finish. | Goal disappears/changes through engine state, feedback and completion modal; no dedicated world-space goal-entry transient (`src/App.tsx:1884-1895`, `:3149-3220`). | Completion never interrupts an active core presentation. | Arrival lacks a satisfying local result before modal; modal becomes the first large celebration. | Immediate semantic win/modal. | **Low current; target Medium.** |
| Victory/completion flourish | Completion screen mount; rays 18 s loop, 12 confetti streams 2.6–3.4 s infinite, rewards 1.8 s float, collection pop 480 ms. | Conic ray, confetti, goal/reward art, saved-friend dances/sparkles (`src/App.tsx:3149-3220`; `src/styles.css:3648-3989`, `:5306-5412`). | Charming, generous, features rescued friends and rewards. | Indefinite noise and cost behind modal blur; confetti can freeze as an accidental strip in reduced motion; reward sound scheduled after visual pop. | Motion disabled; static rays/rewards plus accidental confetti starting positions. | **Med–High continuous.** |
| Sound synchronization layer | Any effect cue; synth voices ≈65–610 ms; max 24 voices. | `src/sound.ts` creates oscillator/gain nodes direct to destination; combat cue map at `src/App.tsx:191-198`; jump/rescue/portal/door schedules live in App. | No media dependency, atomic tested cues, voice cap, failure-safe. | No master bus, spatial grouping, ducking, scope id, or stop handle; cue names (`clash`, `impact`) obscure pre/contact/body timing. | Sound policy is unchanged by CSS preference; appropriate unless user mutes. | **Low CPU**, **High lifecycle risk** for cancellation/sync. |

Enemy/friend/follower idle bobbing is listed only to establish the boundary: VFX may suppress or subordinate it during a set piece, but pose cycles and multi-frame character work belong to the sprite-animation plan.

## 7. Target choreography

### 7.1 One timeline owns picture, sound, numbers, and teardown

Every transient is expressed as a pure `VfxPlan` with absolute cue times. React mounts a run-specific effect root; the presentation director advances the plan and dispatches each cue once. CSS keyframes are short local envelopes started by cue/run keys, never another full-duration screenplay.

A cue can request:

- a visual primitive and world/UI anchor;
- exact displayed values;
- a sound cue;
- an input-lock lease action;
- an accessible announcement policy; and
- a cleanup checkpoint.

At any elapsed time, `frame(plan, elapsedMs)` must deterministically describe the visible semantic state. Tests pause there without depending on real timers. A cue that is skipped because the page was hidden is not replayed after resume; cancellation reconciles directly to the engine's final state.

### 7.2 Water

**Static stack, bottom to top**

1. Connected dark depth fill, reusing or colour-treating the current raster.
2. Inner shallow band, clipped to 0.12–0.18 tile from the bank.
3. Sparse long crest lines whose dominant axis differs from lava cracks and poison bubbles.
4. A narrow near-bank highlight/foam interruption; never a uniform white outline.
5. Actor-crossing ripple above the water and below the actor body.

**Full-motion cadence**

- Move one pattern group laterally over 8 s; direction is stable per level seed and does not reverse every cycle.
- Modulate only the sparse crest group over 3.6 s between low opacity values. Do not animate the full connected base opacity.
- Attenuate crests near the shallow band so the shore feels calmer.
- When a `moved` event enters or leaves water, derive the terrain at `from/to` and spawn at most two elliptical rings plus four tiny boot droplets over 420–520 ms. Landing contact and the water-step sound occur on the same cue.
- A `blocked: needs-boots` response uses a 180 ms damp ripple against the bank and a boot-shaped static hint marker; it does not shake the board.

**Reduced motion:** hold the depth band, two crest shapes, and clear bank. Crossing shows a 180 ms static double-ring key pose at the destination with the same sound/announcement, then removes it without travel.

**Acceptance:** the pool reads as water in grayscale at 844×390; its edge survives every terrain theme; movement does not repaint more than the clipped visible water region; no per-tile nodes.

### 7.3 Lava

**Static stack**

1. Dark plum/brown underbody.
2. Connected ember body.
3. Irregular dark cooling islands/crust covering enough area to prevent a flat orange strip.
4. Sparse yellow-hot cores beneath gaps in the crust.
5. A restrained warm contact-light stroke outside the pool, below objects/actors, maximum 0.08 tile.

**Full-motion cadence**

- Drift the mass/core pattern slowly over 9 s; hot cores move less distance than water crests.
- Let two to three hot regions swell through transform/opacity over 5.5–7 s with staggered phases. Do not animate blur radius or a full-path filter.
- Use at most three narrow rising heat wisps per visible connected region, transform/opacity only, clipped to roughly 0.5 tile above the pool. No full-board displacement filter.
- When boots cross lava, show a 420 ms ember contact ring and no more than six upward sparks. The local light may brighten for 80 ms, then fall below the item/goal hierarchy.
- `blocked: needs-boots` uses a soft warm stop ring and “too warm” sound language—never fire impact, alarm shake, or pain.

**Reduced motion:** dark crust, yellow core, warm bank light, and one static heat-wisp silhouette remain. Crossing gets a held ember ring; loops, sparks, and shimmer do not run.

**Acceptance:** the hottest value sits inside the material, the edge does not become a glowing collectible outline, and lava remains distinct from water without colour.

### 7.4 Poison

**Static stack**

1. Deep violet underbody and purple viscous surface.
2. Uneven oily meniscus with breaks and thickness variation.
3. Irregular bubbles in at least three sizes, avoiding a visible repeated grid.
4. Sparse spiral/rune spots that remain in reduced motion.
5. Up to four behind-actor fumes per visible connected region.

**Full-motion cadence**

- Drift the surface less than water over 7.5 s with a slight diagonal/torsional path.
- Run two asynchronous bubble families around 3.6 s and 5.1 s. Bubbles stretch slightly before popping; the residue ring fades in place rather than shooting outward.
- Fumes rise and curl over 5–7 s using transform/opacity. They render behind characters and never cover faces, Power values, keys, or goal.
- A safe crossing with the antidote leaf shows a small green leaf seal for 160 ms, followed by one parted-bubble response. This communicates protection without recolouring the whole pool green.
- `blocked: needs-antidote-leaf` uses an elastic 180 ms bubble compression at the bank plus a persistent leaf silhouette in the hint state.

**Reduced motion:** retain the meniscus, three unequal bubble outlines, one spiral spot, and one static fume. The safe-crossing leaf seal is held for 180 ms; no rising motion.

**Acceptance:** poison cannot be mistaken for recoloured water in a paused grayscale frame; bubble/fume density never obscures the path boundary; no animated masks.

### 7.5 Combat, exact Power transfer, and victory release

Keep the current 2220 ms lock duration and established impacts while replacing the duplicate long CSS timeline. The engine outcome is already final; presentation copies begin with `powerBefore` and `enemyPower` and converge to the engine state.

| Time | Target picture | Numeric / sound cue |
|---:|---|---|
| 0–120 | Quiet establish. Dim unrelated idle glows by about 20%. Show a short directional ribbon/weapon line and both Power badges. No board movement. | No number change. Optional very soft readiness tick only for stronger encounters. |
| 120–295 | Hit 1 anticipation and readable forward arc. Ame compresses slightly; enemy braces with a friendly squash, not fear/pain. | At 295 ms, renamed `attack-whoosh` cue (current `clash` timing, impact−35). |
| **330** | Hit 1: compact four-point contact star, 6–8 short sparks, local 1.025× punch. Direction must read when paused. | `contact-spark`; no final arithmetic yet. |
| 350–630 | Recovery 1. Enemy rebounds a small distance; first exact transfer steps travel on one curved bead path. | `contact-body` at 375; `power-start` at 350; each `power-tick` updates both badges atomically. |
| 570–725 | Hit 2 anticipation is shorter and uses the opposite/raised arc so geometry is not repeated. | `attack-whoosh` at 725. |
| **760** | Hit 2: wider crescent plus 8–10 sparks; local 1.032× punch. | Spark at 760; body at 805; exact transfer continues 780–1060. |
| 1020–1165 | Hit 3 gets the clearest 180 ms anticipation: gathering star at the weapon, enemy outline, slight audio lift. | `attack-whoosh` at 1165. |
| **1200** | Hit 3: strongest but still local contact star/ribbon, 10–12 finite sparks, maximum 1.046× board punch. Full-board white is ≤50 ms and opacity-only. | Spark at 1200; body at 1245. |
| 1220–1730 | Final transfer. Up to six visible steps for the clash, as today. If one visual bead represents a multi-point step, label or size it without implying one bead equals one point; the two exact numbers are authoritative. | Every step uses the plan's exact `playerPower`/`enemyPower`; sum remains constant. |
| 1730–1900 | Enemy relaxes into a soft star/petal silhouette and scoots/dissolves. No fall, wound, shatter, or prolonged distress. Ambient effects remain subordinated. | A quiet release breath; no extra Power mutation. |
| **1900–2220** | Warm victory ring behind Ame, a few upward stars, final `powerAfter` held, enemy absent. The post-combat `+N` badge is folded into this hold or starts only if it adds unique information. | `victory` chord at 1900; accessible arithmetic remains exact. |
| 2220 | Remove copies, reveal ordinary final engine state, release this run's input lock. | Cleanup must be idempotent. |

Sparks are created per contact cue and removed after 220–320 ms; 12 spark nodes do not persist for the whole sequence. Transfer motes use transform along a bounded curve, not `top/left`. Contact scale and tint are applied to the smallest board subtree that preserves the punch.

**Reduced-motion combat (180 ms):** render a static side-by-side tableau at 0 ms with one contact star and a short dashed Power ribbon. At 35 ms show the transfer identity, at 60 ms atomically swap to final numbers, at 95 ms replace the enemy with a friendly star/petal result seal, and hold until 180 ms. There is no lunge, recoil, moving bead, shake, spin, blur, or board flash. Sound and accessible arithmetic keep their semantic cues.

**Too-strong encounter:** no attack wind-up. In 280–360 ms, show both Power badges, a soft stop ring at the enemy, and a small comparison glyph. The existing modal/announcement explains the requirement. This must never resemble a failed damaging hit.

### 7.6 Pickups, items, currencies, and readability

All pickups use a source-anchored presentation clone because the engine removes the object immediately. The common 620 ms local choreography is:

| Time | Common beat |
|---:|---|
| 0–80 | Hold source silhouette with paired dark/light contour; suppress its idle loop. |
| 80–220 | Lift no more than 0.18 tile and open one category-shaped ring. |
| 180–420 | Convert to the category marker or a short bounded bead/ribbon path. Routine items do not fly across the entire stage. |
| 420–620 | Result seal near Ame and a synchronized bag/HUD slot acknowledgement if that anchor is visible. |
| 0–1400/1850 | Keep concise outlined text where needed for young-reader dwell time, but place it so it does not duplicate the bottom bar at equal visual weight. |

| Pickup family | Choreography variant | Sound synchronization | Static / smallest-scale form |
|---|---|---|---|
| Weapon | One directional ribbon arc resolves into a star at Ame's hand; no character frame dependency. | Bright two-note pickup; star lands on second note. | Weapon silhouette + arc + “found” text. |
| Splash Boots | Two tiny crescent footprint marks, then a blue ripple seal. | Two soft taps; ripple on second. | Boots + paired footprints; no bob. |
| Spring Boots | Compress/expand ring twice, with `×1/×2/×3` jump capability explained by UI copy, not motion alone. | Rounded boing + short chime. | Boots + concentric spring ring. |
| Antidote leaf | Leaf curl closes into a shield/meniscus break; one nearby poison bubble may part only if poison is in camera. | Soft leaf sweep + hollow confirmation. | Leaf + static protective outline. |
| Key | Heart/star/sun motif expands once and stamps the bag slot; matching doors may get one non-travelling acknowledgement if visible. | Motif-specific three-note contour; final note at stamp. | Key silhouette, large motif, paired contour. |
| Potion | Exactly `amount` is printed. Up to six Power beads travel a short path from bottle to Ame's local Power badge; a bead step can represent more than one only when labelled. | Arpeggio ticks align with exact plan steps; local/HUD final number together. | Bottle + `+N` + final Power, no travel. |
| Small currency | Two to four tokens form one short curve to a measured wallet anchor only when the wallet is visible; otherwise use local seal + wallet pulse. | Arrival ping occurs when wallet total changes visually. | Currency icon + exact amount + static wallet outline. |
| Treasure | Preserve the satisfying source-to-wallet story but use measured source/destination rectangles, a 720–900 ms transform-only Bézier wrapper, at most eight motes, and wallet receipt at arrival—not at launch. Cancel if either anchor invalidates. | Launch sparkle, optional midpoint shimmer, wallet ping at arrival. | Source chest + exact amount, immediate final wallet, held receipt badge; no flight. |

Every item receives a paired contour token. A Phase 0 “readability rack” renders every weapon, boot, leaf, key, potion, currency, treasure, portal, door motif, cage, and goal over every floor/wall/hazard theme at all three tile-size bands. It is reviewed in colour, grayscale, protan/deutan/tritan simulation, and reduced motion. Simulation supplements rather than replaces user testing.

### 7.7 Door opening

Keep the 860 ms blocking lifetime and deterministic shape identity.

| Time | Target beat | Sound |
|---:|---|---|
| 0–100 | Freeze idle glow. Matching heart/star/sun motif snaps into the seal; door remains fully readable. | Soft key/latch click at motif contact. |
| 100–260 | Seal charges inward; one halo grows behind the door. | Rising two-note magic cue. |
| 260–420 | Bright local release. Door art dilates or dissolves inward without implying it breaks onto Ame. | Main unlock chime around 300 ms. |
| 320–700 | 12–18 deterministic motif particles travel by transform/opacity. Use fewer on ≤47 px/tile. | Sparse sparkle ticks, capped and grouped. |
| 420–835 | Clear path is visible; halo and motif residue fall below item brightness. | Tail fades by 700 ms. |
| 835–860 | Presentation copy is gone; engine-open floor remains; lock releases. | No late sound. |

**Reduced motion:** over 180 ms, show a static matching motif on the door, immediately switch to the open path at 90 ms, and hold a quiet opened-seal outline at the threshold. No particles, dilation, blur, or scale.

### 7.8 Portal departure, connection, and arrival

The total remains 720 ms. The stored `from` and `to` are both mandatory rendering inputs.

| Time | Camera and picture | Sound |
|---:|---|---|
| 0–120 | Camera remains at `from`. Source flower brightens; Ame and carried overlays compress into its ring. | Low “whoom” intake at 0. |
| 120–220 | Source ring closes to the pair motif. A flower/diamond iris becomes sufficiently opaque to hide a cut, without a full white flash. | Intake resolves upward. |
| 220–260 | Switch camera focus from `from` to `to` behind the iris. Never pan the world distance. | Pair-identity bridge note. |
| 260–480 | Destination ring opens; Ame appears from a held silhouette; pair motif is visible at least 120 ms. | Arrival chime at 280–320. |
| 480–695 | Body settles, three ring echoes and a few sparkles complete. All delayed children end before 695. | One soft sparkle tail. |
| 695–720 | Remove presentation, reveal ordinary player at `to`, release lock. | Silence. |

Portal pair classes alter motif/secondary palette, not duration or gameplay footprint. Jump→portal is a typed sequence: jump completes its landing contact, then portal departure begins from that landing tile; both events and announcements occur once.

**Reduced motion:** 180 ms. Hold source portal + pair glyph, make an immediate opacity cut to destination at 70 ms, then hold destination portal + Ame + the same pair glyph. No closing/opening travel rings.

### 7.9 Jumping and holes

Preserve `getJumpPresentationMotion()` durations and apex/descent values. Express each as normalized phases so CSS and sound use the same plan:

- 0–12%: boots compress and one source ring appears;
- 12–52%: outer wrapper travels while inner wrapper rises; a ribbon trail shows direction, not speed lines across the screen;
- 52%: apex key pose; a three-hole jump may play its second boing here;
- 52–84%: controlled descent; shadow grows only by opacity/scale;
- 84–100%: destination ring, soft boot compression, landing cue at the plan's contact time;
- remove rings before the presentation subtree, not 20 ms after they are clipped.

One/two/three-hole jumps vary trail length and a small `×N` hole marker, not particle density. Water/lava landing derives the destination terrain and composes its material contact primitive. Rescue and door events that follow are sequenced after landing; portal uses the explicit bridge above.

**Reduced motion:** retain the current 140 ms destination placement. Add a static boots + `×N` arc badge spanning the logical direction and one destination ring; no spatial travel or scale pulse.

### 7.10 Rescue and cages

Keep the 900 ms lifetime and friendly release story.

| Time | Target beat | Sound |
|---:|---|---|
| 0–130 | Brief hold: matching key/seal information visible, friend looks safe behind cage. | Tiny latch anticipation. |
| 130–280 | Centre seam glows and cage halves separate by a small distance; no shards. | Soft snap around 150–190 ms. |
| 280–520 | Halves peel/fade outward while friend makes first squash-and-hop. | Main friend-rescue chime on release, not before. |
| 420–720 | Friend lands, then makes the second joyful hop; 5–7 hearts/petals rise and lose opacity/value. | Two light landing notes. |
| 720–870 | Stable freed-friend result with a quiet halo; player cheer is subordinate to the pet. | Warm tail. |
| 870–900 | Clean subtree and release lock. | No late cue. |

Cage style can change particle shape accents, but not the readable split silhouette. **Reduced motion:** static freed friend at the same tile, an opened-cage outline behind it, and one heart/petal seal held for about 140 ms; no hopping or flying halves.

### 7.11 Blocked movement, goal, feedback, and victory

**Blocked movement:** implement the currently missing bump as a 140–180 ms local compression of Ame toward the blocked edge plus a target-bound stop ring. Do not transform the whole board. The ring variant is wave/ember/bubble/hole/heart/star/sun/enemy comparison. On repeated attempts, play at most two gentle pulses, then hold a static target outline while the existing hint/modal is open. Reduced motion uses the outline immediately.

**Feedback hierarchy:** the accessible status is immediate and authoritative. During a blocking set piece, the visual bar uses a quieter “in progress” or hidden duplicate variant so it does not visually announce the final image early. At the semantic completion cue it may show the friendly final copy. Never defer or suppress the screen-reader outcome to match animation.

**Goal arrival:** add a 900 ms world-space result before the completion modal:

- 0–150 ms: hold Ame and goal together; suppress goal idle loop;
- 150–350 ms: goal ring opens behind both and the exit motif becomes the dominant shape;
- 350–650 ms: 8–12 stars/petals rise locally; rescued-friend accents may appear only if already present in camera;
- 650–900 ms: calm final star/crown seal and exact final Power; modal may mount after cleanup.

The win melody's bright contact aligns with 150–350 ms rather than beginning independently. Reduced motion shows the static final goal seal, final Power, and announcement for 180 ms before the modal.

**Completion modal:** rays run once over about 2.4 s; confetti runs one finite 2.6–3.4 s pass and unmounts; reward art settles after 480 ms; the reward sound lands on that visual reveal instead of 40+ ms later. Saved friends may keep one low-intensity idle owner from the sprite plan, but VFX sparkles stop. Reduced motion uses a composed static hero/reward/friend frame with no confetti strip or rotating ray.

### 7.12 Sound synchronization and tone

Visual and audio cues share the same `VfxCue.atMs`; App code does not maintain a second set of `setTimeout` offsets. At 60 Hz, target dispatch skew is ≤16.7 ms and hard acceptance is ≤25 ms on reference devices. Hidden-page cancellation never tries to “catch up” missed impacts.

Extend `src/sound.ts` so every scheduled sequence returns a handle with `cancel({ fadeMs })`. Registered oscillators route through a per-sequence gain node and the existing 24-voice global cap remains. Cancellation fades over about 10–25 ms to avoid clicks; mute and unsupported-audio behavior remains failure-safe.

Tone vocabulary:

- attacks are airy swishes, wooden/toy taps, bells, and sparkle ticks—not cracks, squelches, screams, or pain cries;
- water is a soft splash, lava a rounded warm pop, poison a hollow “blup,” and blocked movement a gentle stop tone;
- Power ticks ascend without becoming a slot-machine cascade;
- portal has intake/bridge/arrival; door has latch/charge/release; rescue has latch/release/landing;
- Tier 4 reserves the fullest chord and broadest frequency span.

## 8. Rendering decision matrix

Choose the least powerful mechanism that can express the primary shape within budget. The decision is per layer, not per whole effect: a portal can combine one SVG ring stack, a CSS-transformed sprite wrapper, and four DOM sparkles.

| Mechanism | Best fit | Advantages | Costs / failure modes | Decision for this overhaul |
|---|---|---|---|---|
| CSS on existing element/wrapper | Transform, opacity, short local scale/rotation, colour-token swap, one simple gradient veil | Smallest code/DOM; compositor-friendly when limited to transform/opacity; easy reduced-motion override | Long percentage timelines become a second scheduler; filters/shadows repaint; pseudo-elements collide; `left/top` causes layout | **Default for local envelopes only.** Start/restart from typed cues; no effect-long independent screenplay; no animated layout properties or blur radius. |
| SVG primitives/pattern groups | Connected material paths, rings, arcs, ripples, cracks, masks, deterministic vector motifs | Resolution independent; preserves current connected geometry; one path represents many tiles; easy shape redundancy | Filters/masks allocate intermediate surfaces; large screen-blended paths repaint; repeated pattern animation can expose tiling | **Default for materials and geometric magic.** Memoize paths, clip to camera+gutter, animate group transform/opacity, keep masks static and tightly bounded. |
| DOM particles | A small number of semantic stars, petals, key motifs, embers, beads with individual delay/trajectory | Straightforward typed/deterministic configuration; easy per-particle palette/motif; inspectable/testable | Node growth, style recalculation, layout if using top/left; randomness harms regression | **Use sparingly for semantic transients.** Deterministic arrays, transform/opacity only, node ceilings enforced; remove on cue completion/abort. |
| Sprite sheet / flipbook | Art-directed organic dissipation or a soft hand-painted magical burst that requires 6–12 meaningfully different frames | Predictable paint; one DOM element; can outperform many filtered vector layers | Extra decoded memory/download; frame stepping/timing code; scaling artifacts; static/reduced alternative still required; identifiable style-copy risk | **Not justified now.** Consider only after profiling a specific Tier 3/4 effect proves vector/DOM cannot meet quality and budget. Hand-author/approve; do not generate by default. Max 512×512 sheet, ≤12 frames, ≤1 MiB decoded target per active sheet. |
| Small raster overlay / repeat tile | Static noise, grain, caustic breakup, dither, or a tiny seamless material modulation | Very low node count; inexpensive static repeat; hides sterile gradients | Large alpha layers increase paint/memory; scaling/repetition can be obvious; animated raster/filter combinations are costly | **Retain existing terrain rasters; permit only bounded static/repeated helpers.** ≤256×256 source, no full-board animated alpha overlay, total new decoded material helpers ≤2 MiB. |

Canvas/WebGL is not introduced. The game already has semantic React/SVG layers and modest particle counts; adding another rendering scene, accessibility boundary, texture pipeline, and Tauri/WebView2 risk would not earn its complexity.

### Bitmap / ImageGen gate

No planning-time ImageGen call was warranted. Before any later bitmap-effect request, the implementing artist must provide:

1. a named effect and frame-size target;
2. a profile showing the SVG/CSS/DOM version misses a defined quality or frame budget;
3. a static/reduced-motion frame;
4. a memory/download budget; and
5. art-direction approval that the result is original and matches the static asset language.

Generated preview output, if ever requested, remains outside the repository until explicit asset approval.

## 9. Reusable architecture and typed boundaries

### 9.1 Files

Keep engine types and outcomes unchanged. Add a presentation-only subsystem:

| File | Responsibility |
|---|---|
| `src/vfx/types.ts` | `VfxKind`, `VfxChannel`, `VfxQuality`, `CancellationReason`, `VfxPlan`, `VfxCue`, `VfxFrame`, `EffectBudget`, anchor and sound-handle contracts; imports canonical `MotionMode` from `src/motion.ts`. |
| `src/vfx/catalog.ts` | Exhaustive semantic motifs, palette tokens, timing envelopes, intensity tiers, static recipes, particle/filter/node budgets, and quality fallbacks by effect kind. |
| `src/vfx/presentationPlanner.ts` | Convert immutable `GameEvent[]` plus level/terrain context into one typed sequence; explicitly sequence jump→rescue, jump→door, jump→portal, pickup-on-landing, and other composites. |
| `src/vfx/presentationDirector.ts` | Sole run scheduler, monotonic run id, channel ownership, abort scope, cue dispatch, sound handles, lock lease, final-state reconciliation, and performance marks. |
| `src/vfx/usePresentationDirector.ts` | Small React binding that owns director lifetime and presents immutable render state. No gameplay decisions. |
| `src/vfx/EffectLayer.tsx` | Named hosts and layer contract: `terrain`, `world-under`, `world-object`, `world-over`, `board-overlay`, `stage-flight`, `modal`. |
| `src/vfx/MaterialEffects.tsx` | Connected water/lava/poison static and animated layers; consumes memoized terrain geometry and quality/motion mode. |
| `src/vfx/primitives.tsx` | Geometrically specific primitives: `TileEffectAnchor`, `DeterministicBurst`, `RingStack`, `GlowHalo`, `ImpactStar`, `MotionTrail`, `PowerBeadPath`, `FloatingNotice`, `StageAnchorFlight`. |
| `src/vfx/effects/CombatEffect.tsx` | Render `CombatVictoryPlan` frames/cues only. |
| `src/vfx/effects/RescueEffect.tsx` | Cage/friend presentation. |
| `src/vfx/effects/JumpEffect.tsx` | Nested travel/arc and terrain landing composition. |
| `src/vfx/effects/PortalEffect.tsx` | From/cut/to timeline. |
| `src/vfx/effects/DoorEffect.tsx` | Lock motif and deterministic burst. |
| `src/vfx/effects/PickupEffect.tsx` | Shared pickup envelope and category variants. |
| `src/vfx/effects/TreasureEffect.tsx` | Measured world-to-HUD flight and static receipt. |
| `src/vfx/effects/GoalVictoryEffect.tsx` | Goal arrival and finite completion flourish. |
| `src/vfx.css` | Extracted, namespaced VFX tokens, layers, primitives, local envelopes, material styles, and one reduced-motion/static block. |

Initially retain `src/combatPresentation.ts`, `src/jumpPresentation.ts`, and `src/magicEffects.ts` as pure, well-tested factories. Make them implement shared types rather than moving them in the same change. Extend `src/sound.ts` rather than replacing its synthesis and voice cap.

### 9.2 Core types

The exact names may be tuned, but these boundaries are required:

```ts
export type VfxChannel =
  | "ambient"
  | "blocking"
  | "notice"
  | "stage-flight"
  | "modal";

import type { MotionMode } from "../motion";
export type VfxQuality = "full" | "lite" | "static";

export type CancellationReason =
  | "restart"
  | "navigation"
  | "level-change"
  | "visibility-hidden"
  | "unmount"
  | "motion-preference-change"
  | "anchor-invalidated"
  | "superseded";

export interface VfxCue<TKind extends string = string, TPayload = unknown> {
  readonly id: string;
  readonly atMs: number;
  readonly kind: TKind;
  readonly payload: TPayload;
  readonly sound?: SoundCue;
}

export interface VfxPlan<TFrame, TCue extends VfxCue = VfxCue> {
  readonly kind: VfxKind;
  readonly channel: VfxChannel;
  readonly durationMs: number;
  readonly motionMode: MotionMode;
  readonly quality: VfxQuality;
  readonly cues: readonly TCue[];
  frameAt(elapsedMs: number): TFrame;
}

export interface PresentationRun {
  readonly id: number;
  readonly signal: AbortSignal;
  readonly channel: VfxChannel;
  readonly releaseInputLock: () => void;
  cancel(reason: CancellationReason): void;
}

export interface EffectSoundHandle {
  readonly runId: number;
  cancel(options?: { readonly fadeMs?: number }): void;
}
```

Use discriminated payloads rather than `unknown` in production. Exhaustive `switch` checks fail compilation when a new `GameEvent` or `VfxKind` lacks a plan/static recipe/budget.

### 9.3 Channel rules

- **`blocking`:** combat, rescue, jump, portal, door, and typed composites. Exactly one sequence owns one input-lock lease. A follow-up is part of the same sequence, not another competing timer.
- **`notice`:** pickup, Power and feedback notices. Replacement/queue policy is explicit and independently cancellable.
- **`stage-flight`:** treasure/currency to measured UI anchors. It never owns gameplay input.
- **`modal`:** finite victory flourish tied to modal lifetime.
- **`ambient`:** materials and gentle object affordances. Paused or downgraded while hidden and subordinated during Tier 3/4 effects.

The director, not effect components, owns time. Components receive a plan frame and cue-local run key. The director records every timeout, `requestAnimationFrame`, `Animation`, sound handle, and temporary lock under the run's `AbortSignal`.

### 9.4 Named layer contract

Replace scattered magic z-values with tokens under `.game-stage`:

```css
.game-stage {
  --z-vfx-terrain: 1;
  --z-vfx-world-under: 4;
  --z-vfx-world-object: 7;
  --z-vfx-actor: 9;
  --z-vfx-world-over: 12;
  --z-vfx-blocking: 24;
  --z-vfx-door: 32;
  --z-vfx-portal: 40;
  --z-vfx-notice: 48;
  --z-vfx-stage-flight: 60;
  --z-vfx-modal: 80;
}
```

Exact values are less important than named ownership. The UI/layout plan owns shell/modal ordering; VFX hosts must not exceed modal chrome. Treasure no longer uses z200.

### 9.5 Instrumentation

Effect roots expose debug-stable attributes:

- `data-vfx-kind`;
- `data-vfx-run`;
- `data-vfx-cue`;
- `data-vfx-motion`;
- `data-vfx-quality`; and
- world anchor coordinates where safe and useful.

Development builds emit `performance.mark` for plan start, each important cue, complete, and cancel. No production analytics dependency is required.

## 10. Stylesheet consolidation, not another override layer

The inspected `src/styles.css` is about 7,262 lines / 179,156 bytes with 83 keyframes, 96 animation declarations, 123 `!important` declarations, 12 reduced-motion blocks, and at least 14 version-labelled append sections. VFX rules are scattered through `src/styles.css:264-356`, `:2880-2985`, `:5246-5252`, `:5566-6104`, `:6196-6399`, `:6405-6711`, `:6964-7010`, and `:7012-7262`.

The cutover is behavior-neutral before it is aesthetic:

1. Record computed styles and screenshots for every current VFX root at key frames.
2. Add `src/vfx.css`, imported immediately after the existing base scene stylesheet. If the UI plan lands first, use its import manifest but reserve one VFX-owned slot after scene geometry and before accessibility overrides.
3. **Move and delete** current effective VFX declarations. Do not copy them and leave old selectors in place.
4. Collapse each repeated selector into one base plus named variants. `.map-pickup-toast`, for example, becomes `.vfx-notice`, `.vfx-notice--pickup`, and `.vfx-notice--power`, each defined once.
5. Prefix new classes/keyframes/custom properties with `vfx-` or `--vfx-`. Scope material and transient styles beneath `.game-stage`.
6. Give cast shadow, step spark, aura, and status badge distinct elements. Lighting keeps the ground shadow; VFX stops claiming `.player-layer::before`.
7. Replace effect-related `left/top` transitions with an authoritative logical position plus a transform-interpolated visual wrapper.
8. Put all VFX static/reduced rules in one final media block and mirror it with `[data-vfx-motion="reduced"]`. The OS preference and any future explicit setting select the same typed mode.
9. Permit zero `!important` declarations in `src/vfx.css`. Add a duplicate-selector and specificity check. If Stylelint is accepted, use `declaration-no-important` and standard duplicate-selector rules; otherwise add a small repository script.
10. Delete superseded keyframes/selectors in the same pull request as each effect cutover. `git grep` must prove no orphaned class/keyframe references.

Coordination with `docs/plans/01-ui-ux-layout-overhaul.md`: that plan asks to consolidate motion and move HUD geometry. UI owns general control/shell motion and the import order; VFX owns effect keyframes. If UI introduces `motion.css`, it may aggregate/import VFX motion but must not duplicate or rewrite effect timelines. UI must supply named measured anchors before treasure flight changes.

## 11. Performance budgets and quality tiers

These are release gates, not aspirations. Profile at the actual final tile size and on large mixed-hazard levels.

### 11.1 Resource ceilings

| Budget | Full quality | Lite quality | Static/reduced |
|---|---:|---:|---:|
| Particles per routine pickup | 0–6 | 0–3 | 0–2 static marks |
| Particles per normal set piece | ≤18 | ≤10 | ≤4 static marks |
| Combat / victory particles at one instant | ≤24 | ≤14 | ≤6 static marks |
| Active particle elements stage-wide | ≤32 | ≤18 | ≤8 |
| Incremental DOM nodes per set piece | ≤48 | ≤28 | ≤16 |
| Incremental VFX DOM nodes stage-wide | hard cap 64 | hard cap 36 | hard cap 20 |
| Persistent VFX nodes | ≤24 | ≤16 | ≤12 |
| Animated SVG elements per material | ≤4 | ≤2 | 0 |
| Animated SVG elements total | ≤12 | ≤6 | 0 |
| SVG masks per board | ≤4, static | ≤3, static | ≤3, static |
| SVG filter definitions per board | ≤2, ≤4 primitives total | ≤1 | ≤1 static |
| Simultaneously animated filter-bearing elements | ≤2, tile-local | 0 | 0 |
| Continuous visible VFX animations | ≤20 total: ≤12 environmental, ≤8 idle | ≤8 total | 0 |
| Elements with active `will-change` | ≤6, only during run | ≤3 | 0 |
| Compositor layers attributable to active VFX | ≤12 | ≤8 | ≤4 |

Additional constraints:

- No animated blur radius, mask, morphology, `box-shadow`, or drop-shadow chain.
- Any blur is ≤6 CSS px at reference scale, tile-local, and its filter region is tightly bounded.
- Continuous paint stays within one clipped visible-board area in aggregate; it never repaints each material across the full level.
- Routine transient paint covers ≤25% of the board. One Tier 3/4 opacity-only veil may cover the board for ≤80 ms; no continuous full-board overlay.
- Material geometry is camera+one-tile gutter, or the full connected model is cached and clipped so off-camera paint is absent.
- New raster helper tiles are ≤256×256; any flipbook is ≤512×512, ≤12 frames, and only one is active unless profiling approves otherwise.
- Hidden tabs cancel blocking/transient work and pause/unmount ambient loops; they do not accrue a timer backlog.

### 11.2 Frame and lifecycle gates

| Reference | Gate |
|---|---|
| Desktop Chromium and Tauri/WebView2 | p95 frame interval ≤16.7 ms, p99 ≤33.3 ms, <1% frames over 33.3 ms during stress scenarios. |
| Tablet / landscape phone references | p95 ≤25 ms, p99 ≤50 ms. |
| All | No VFX-attributable long task >50 ms. Effect construction ≤4 ms; individual cue dispatch ≤2 ms. |
| Sound sync | Visual/audio dispatch skew target ≤16.7 ms, hard limit ≤25 ms in deterministic tests. |
| Cleanup soak | After 100 start/cancel cycles: zero extra VFX nodes, active timers, registered animations, sound voices, stale lock leases, or listeners. |

Quality selection can be explicit (`full`, `lite`, `static`) and may be chosen by a performance plan/device profile, but it cannot remove the primary silhouette, exact number, hazard boundary, announcement, or result hold. Do not auto-downgrade based on a single slow frame; use measured, stable policy.

## 12. Cancellation and state reconciliation

### 12.1 One cancellation operation

`presentationDirector.cancelAll(reason)` must:

1. increment/invalidate the active run id so late callbacks are inert;
2. abort all blocking, notice, stage-flight, and modal scopes owned by the old context;
3. cancel recorded timeouts, animation frames, Web Animations, and cue listeners;
4. fade/cancel registered sound handles;
5. remove transient DOM/classes and reset ambient subordination;
6. reconcile every displayed number and object to the already-authoritative engine state;
7. clear queued pointer/key/D-pad work that belongs to the old context; and
8. release only the lock lease owned by each canceled run, in `finally`.

The operation is idempotent. It does not roll back an engine event and does not fire a completion cue.

### 12.2 Event matrix

| Cancellation cause | Visual result | Sound | Input / state result |
|---|---|---|---|
| Restart | Old effects and notices disappear before initial state renders. | Fade/cancel all old run voices. | Clear old held/queued input; engine restarts exactly once; no old lock. |
| Level change / tester selection / next maze | Abort old level before changing context; no stage flight crosses levels. | No old tail in new level. | Final old state is irrelevant; new level owns fresh director generation. |
| Home, Mazes, Book, other navigation | Remove board VFX, treasure flight, pickup notices, and modal flourish owned by game screen. | Stop game-effect sequences; music policy remains owned by sound/navigation. | Release locks and restore correct destination focus; do not replay queued move on return. |
| `document.visibilityState === "hidden"` | Reconcile immediately to engine final state and clear transients. Ambient loops pause/unmount. | Cancel effect voices; do not catch up. | Release presentation lock; clear held input. Returning visible shows stable final state only. |
| Component unmount | Synchronous director disposal and listener removal. | Cancel all sequence handles. | Zero callbacks/setState after unmount; all leases released. |
| Motion preference changes to reduced during a run | Abort full-motion plan; render the effect's static final semantic recipe for at most the reduced duration, then clean. | Retain only result/confirmation cues not already played; never replay contact. | Engine outcome unchanged; lock releases no later than the reduced replacement plan. |
| Motion preference changes to full during a reduced run | Finish current static recipe. | No replay. | Full mode applies to the next run. |
| Measured HUD anchor disappears/resizes during stage flight | Cancel travel, show local static receipt if screen remains, and retain final wallet total. | Skip/cancel arrival travel cue; optional local confirmation only once. | No input lock; currency is never lost or double-counted. |
| Superseding notice | Old notice exits immediately or through ≤90 ms opacity only; replacement enters with unique run key. | No old delayed cue. | Accessible announcement policy avoids duplicate speech. |

### 12.3 Accessibility announcements during cancellation

The semantic engine outcome may be announced immediately even when visuals are canceled. Presentation-only phrases such as “first hit” are decorative and are not added to live regions. A completed pickup/combat/rescue is never re-announced merely because its animation was aborted. Navigation focus restoration follows the UI plan and cannot be stolen by effect cleanup.

## 13. Implementation phases, files, tests, dependencies, and rollback

Each phase is a separately reviewable checkpoint. Do not combine a lifecycle rewrite, stylesheet extraction, new look, and asset change in one pull request.

### Phase 0 — Characterization and VFX test harness

**Purpose:** make current behavior, timing, layout, and cleanup inspectable before changing presentation.

**Files**

- Add `playwright.config.ts`.
- Add `tests/vfx/vfx-fixtures.ts`, `tests/vfx/vfx-visual.spec.ts`, `tests/vfx/vfx-lifecycle.spec.ts`, and `tests/vfx/vfx-readability.spec.ts`.
- Add `scripts/check-vfx-css.mjs` for duplicate owned selectors, missing keyframes, forbidden `!important`, and orphaned `vfx-` references.
- Modify `package.json`, `package-lock.json`, and `.github/workflows/ci.yml` for the test commands.
- A development-only `src/vfx/VfxLab.tsx` may be reachable only through an explicit debug/test entry; it must not ship as normal navigation or mutate campaign progress.

**Dependency:** add **`@playwright/test` as the only required new development dependency**. Pin the selected version in `package-lock.json`. No runtime dependency, particle library, animation framework, canvas engine, or image package is needed.

**Characterization cases**

- Freeze current combat contacts at 330/760/1200 ms, transfer end 1730, and victory 1900.
- Freeze rescue hold/split/hop/result, each jump hole count, portal arrival, each door colour, generic pickup, Power pickup, treasure flight, goal, and victory.
- Record computed layer order and current effect root/node counts.
- Assert existing engine state and accessibility copy independently from pixels.

**Acceptance**

- Existing `npm test` and `npm run build` pass.
- Current targeted timing/sound/camera/stage suites remain green (the audit observed 34/34 across six targeted files).
- Browser tests can enter tester levels without saving rewards and can pause deterministic effect time.
- Baselines exist for full and emulated reduced motion at desktop and phone-landscape sizes.

**Rollback:** remove test-only files/dependency/scripts. No production code or appearance changes in this phase.

### Phase 1 — Typed plans, director, cancellation, and sound handles

**Purpose:** establish one lifetime and one timing authority while preserving current appearance.

**Files**

- Add `src/vfx/types.ts`, `catalog.ts`, `presentationPlanner.ts`, `presentationDirector.ts`, and `usePresentationDirector.ts`.
- Add matching `*.test.ts` files.
- Modify `src/combatPresentation.ts`, `src/jumpPresentation.ts`, and `src/magicEffects.ts` only enough to implement shared types.
- Modify `src/sound.ts` to return `EffectSoundHandle` and route a run through a cancellable gain node.
- Modify orchestration portions of `src/App.tsx`; keep current render markup/classes initially.

**Required tests**

- Exhaustive `GameEvent[]`→plan mapping.
- `hole-jumped`→`portal-warped`, jump→door, jump→rescue, landing pickup, and ordinary single-event sequences.
- Combat frame-by-frame conservation and no duplicate cue dispatch.
- Restart/navigation/level/visibility/unmount/motion-change cancellation with fake time.
- Sound handle stop/fade, existing 24-voice cap, unsupported-audio and mute behavior.
- A lock lease cannot unlock a newer run or remain held after abort.

**Acceptance**

- Current visual baselines are materially unchanged.
- All old presentation timers are either removed or registered through the director; no separate treasure/pickup/audio timer escapes the cancellation inventory.
- Final displayed Power always equals engine Power after complete or cancel.
- No callback from run N can update run N+1.

**Rollback:** revert App/director wiring as one unit. Pure plan/type files may remain inert, but no half-wired scheduler is allowed.

### Phase 2 — Behavior-neutral stylesheet extraction and layer correctness

**Purpose:** remove cascade debt before visual redesign.

**Files**

- Add `src/vfx.css` and import it from `src/main.tsx` according to the UI stylesheet manifest.
- Move and delete VFX declarations from `src/styles.css`.
- Add `src/vfx/EffectLayer.tsx` and `src/vfx/primitives.tsx` with current geometry only.
- Extend `scripts/check-vfx-css.mjs` and visual tests.

**Order**

1. Extract current effective rules with unchanged screenshots.
2. Replace numeric z-index ownership with named hosts/tokens.
3. Split cast shadow from step spark without changing lighting geometry.
4. Remove permanent VFX `will-change`; move visual interpolation to transform wrappers.
5. Implement the missing local blocked-response class as its own characterized change, not hidden inside extraction.

**Acceptance**

- Zero duplicate VFX-owned selectors and zero `!important` in `src/vfx.css`.
- No dead keyframes or class references.
- Lighting shadow and two step-spark elements render independently.
- Scene/actor/presentation/modal ordering matches the layer contract in Normal, Big, and adaptive layouts.
- The behavior-neutral substep has zero unexpected screenshot change; intentional pseudo/bump fixes have reviewed baselines.

**Rollback:** revert the import and moved-rule deletion together. Never leave both old and extracted declarations active.

### Phase 3 — Terrain render model and environmental materials

**Purpose:** make the renderer cheap enough for better material language, then land one hazard family at a time.

**Files**

- Add `src/vfx/MaterialEffects.tsx` and material catalog entries.
- Modify `MazeTerrain` in `src/App.tsx`; extraction to `src/game/MazeTerrain.tsx` is allowed if coordinated with art/lighting plans.
- Modify or add pure helpers in `src/game/terrainGeometry.ts` only for render geometry, never traversability.
- Extend `src/game/terrainGeometry.test.ts`, `tests/vfx/vfx-visual.spec.ts`, and performance traces.

**Order / rollback points**

1. Memoize `fullLevelWindow(level)` and per-level connected path/mask data; clip paint to camera+gutter. **Rollback A:** geometry-only commit.
2. Introduce named shared bank/depth primitives with current look. **Rollback B.**
3. Land water. **Rollback C:** catalog selects current/static water recipe.
4. Land lava. **Rollback D:** per-material static fallback.
5. Land poison. **Rollback E:** per-material static fallback.
6. Add crossing/blocked local responses after ambient traces pass.

**Acceptance per material**

- Connected paths remain seamless through corners and camera movement.
- A paused grayscale frame is identifiable; reduced/static recipe is intentionally composed.
- No animated mask/filter, no per-tile nodes, no off-camera full-level repaint.
- Large mixed-hazard levels pass DOM/filter/paint/frame budgets.
- Objects, goal, door labels, Power values, and actor faces remain unobscured.

**Dependency:** art-direction approval of palette/contour tokens and lighting approval of local emissive layering. No new asset is required.

### Phase 4 — Guidance, pickup, traversal, portal, door, and rescue families

**Purpose:** replace generic or incomplete transients with reusable primitives.

**Files**

- Add `src/vfx/effects/PickupEffect.tsx`, `TreasureEffect.tsx`, `JumpEffect.tsx`, `PortalEffect.tsx`, `DoorEffect.tsx`, and `RescueEffect.tsx`.
- Modify the corresponding render blocks/orchestration in `src/App.tsx` and delete migrated CSS.
- Modify `src/mapNotices.ts` only for visual priority/dwell metadata; preserve text and icon contracts.
- Extend `src/magicEffects.test.ts`, `src/jumpPresentation.test.ts`, map-notice tests, director tests, and browser baselines.

**Checkpoint order**

1. Local blocked feedback and finite guided marker.
2. Shared pickup envelope + category variants.
3. Measured-anchor currency/treasure flight, blocked until the UI anchor contract exists.
4. Jump landing composition and tail cleanup.
5. Portal departure/cut/arrival and jump→portal sequence.
6. Door latch/charge/release sound split and transform-only deterministic particles.
7. Rescue latch/release/landing sound split and curated static form.

**Acceptance per checkpoint**

- Typed plan, full/lite/static catalog entries, exact cue tests, screenshot key poses, and complete cancellation cases.
- No change to engine event order/count, map position, item/door/rescue outcome, or notice wording.
- Phone-landscape primary shape is readable; effect remains inside stage/anchor bounds.
- All child delays finish before subtree teardown.

**Rollback:** retain `VfxQuality="static"` as the production-safe fallback and revert the most recent family checkpoint. Do not retain a long-lived parallel legacy CSS implementation.

### Phase 5 — Combat and Power transfer

**Purpose:** make the typed `CombatVictoryPlan` the only combat timeline and strengthen contact readability without increasing aggression.

**Files**

- Add `src/vfx/effects/CombatEffect.tsx`.
- Modify `src/combatPresentation.ts` only to add cue payloads/frame fields needed by the target choreography.
- Modify combat orchestration/markup in `src/App.tsx` and delete the 2.22 s CSS percentage screenplay from `src/vfx.css`/old CSS.
- Extend `src/combatPresentation.test.ts`, director tests, sound tests, visual/performance/lifecycle suites.

**Acceptance**

- Impacts remain 330/760/1200 ms unless a separately approved timing change updates one typed plan and all tests.
- At every test millisecond, `playerPower + enemyPower` equals the conserved total; completion exactly matches engine Power.
- Sound/contact skew ≤25 ms; each cue dispatches once.
- Direction reads paused; contacts escalate through shape/timing, not only more particles.
- No blood, injury, pain pose/sound, prolonged defeat, or full-board aggressive shake.
- Full, lite, reduced/static, cancel-at-every-phase, Power 1, large Power, and Power 99 pass.

**Rollback:** `CombatEffect` can select its static recipe while the director/Power contract remains. Revert visual primitives independently from pure conservation logic.

### Phase 6 — Goal, victory, reduced-motion completion, and finite ambience

**Purpose:** give world completion a local release, make modal celebration finite, and finish every static recipe.

**Files**

- Add `src/vfx/effects/GoalVictoryEffect.tsx`.
- Modify completion presentation in `src/App.tsx` and migrate/delete relevant CSS.
- Implement the bounded material-aware rainbow holographic shimmer for Plan 01's
  earned-achievement showcase. Treat approved foil/enamel masks and sticker
  contours as art authority; do not apply a generic full-rectangle gradient.
- Complete catalog coverage tests that require every `VfxKind` to define full/lite/static forms.
- Add live-media-query listener tests and reduced-motion browser projects.

**Acceptance**

- Goal entry completes before modal without changing win timing/logic.
- Confetti/rays/sparkles are finite and remove their nodes; reward sound aligns with reveal.
- The earned-achievement shimmer preserves illustration/contour legibility,
  uses no continuously animated blur/filter chain, stops and releases its owner
  on close or rapid selection change, and has intentional lite and static/
  reduced-motion forms.
- Reduced motion has no accidental frozen confetti/ring stacks, travel, shake, spin, depth pan, or animated blur.
- Switching preference during every blocking effect follows the cancellation matrix.
- All semantic copy, final rewards, focus behavior, and announcements remain correct.

**Rollback:** select static goal/victory recipes. The completion modal remains usable without transient nodes.

### Phase 7 — Cross-platform performance and release gate

**Purpose:** verify the combined system rather than accepting isolated effects.

**Commands / suites**

- `npm run check`.
- New `npm run test:vfx` and `npm run test:vfx:perf`.
- `npm run check:desktop`.
- Playwright visual projects and 100-cycle lifecycle soak.
- Manual Tauri/WebView2 audio/compositing/cancellation pass.

**Acceptance**

- Every criterion in Sections 11, 12, 14, and 17 passes on named references.
- No unexplained screenshot diff, console error, accessibility duplicate, stale sound, clipped tail, or post-cancel lock.
- Performance signs off full/lite selection policy and static emergency fallback.
- Art, lighting, sprite, UI, gameplay, accessibility, sound, and performance owners approve their interfaces.

**Rollback:** revert to the last accepted family checkpoint or set the single global quality policy to `static`. Static mode must remain fully playable and semantically complete.

## 14. Visual regression and live-play QA

### 14.1 Runtime and viewport matrix

| Surface | Required sizes / conditions | Focus |
|---|---|---|
| Desktop Chromium | 960×540, 1280×720, 1920×1080; DPR 1 and 2 where available | Baseline pixels, filter bounds, sound marks, keyboard/pointer, Big mode |
| Tauri / WebView2 | configured 1280×720 default and 960×540 minimum | SVG masks/blends, audio cancellation on minimize, focus, DPI, package build |
| Tablet | 1024×768 and 1194×834 landscape; DPR 1/2 | touch/pointer steering, item contour, notice occlusion, stage anchors |
| Landscape phone | 568×320 emergency floor, 667×375, 740×360, 844×390 | smallest effect silhouette, particle shedding, text/board competition, orientation transitions |
| Portrait phone | 390×844 | orientation guidance only; no hidden running VFX/sound/input behind it |
| Reduced motion | OS emulation before load and preference change during each effect | curated static result, shortened lifetime, no motion-only information |
| Lite/static quality | every viewport | semantic parity and budget fallback |

Tauri tests use the real WebView2 build, not only Chromium screenshots. Phone portrait must suspend/clear game presentation work rather than merely cover it.

### 14.2 Representative level/state suite

| Level | Required scenarios |
|---|---|
| Little Star Trail (`src/game/levels.ts:302-322`) | step sparks, blocked wall, cage/rescue, goal arrival, first completion |
| Shiny Sword (`:324-346`) | weapon pickup, weak enemy three-hit sequence, key pickup, matching door, comparison feedback |
| Splashy Boots / Rainbow Picnic (`:348-428`) | potion exact Power, boots, water crossing/blocked edge, water against different terrain themes |
| Wishing Woods (`:458-495`) | lava at initial camera, mixed hazards, spring boots, holes, item contrast on lush floor |
| Ame's Grand Parade (`:497-537`) | water at initial camera, Power chain, all key colours, dense object hierarchy |
| Lanternlight Labyrinth (`:581-640`) | one/two/three-hole jumps, treasure/currency, large camera movement |
| Twilight Treasure Loop (`:642-692`) | long measured treasure flight, holes, lava/water, optional objects, adaptive HUD anchor |
| Moonlit Friendship Quest (`:694-750`) | poison close-up, leaf pickup, safe/blocked poison, rescue, mixed long route, cancellation soak |
| Rose Heart Roundabout / Clover Carnival (`:752-828`) | portal departure and arrival, portal relay, jump/portal composition if available |
| Friendship Crown Vault / Rainbow Power Parade (`:830-936`) | large mixed map, Power 99 aura, strongest combat, five friends, final victory stress |

Tester routes must never change saved campaign rewards. Include at least one generated-maze seed for each supported hazard/theme combination to prevent overfitting to authored maps.

### 14.3 Required screenshot key frames

Pause via the Web Animations API and/or deterministic plan clock, not arbitrary `setTimeout` screenshots.

- Materials: 0, 25%, 50%, and 75% of each loop; still frame; crossing contact; bank blocked response.
- Pickup: 0/80/220/420/620 ms and final notice; each category; smallest scale.
- Combat: 0/120/330/630/760/1060/1200/1500/1730/1900/2220 ms; Power 1 and larger enemy; reduced 0/60/95/180.
- Rescue: 0/130/280/520/720/870/900 ms; each cage style; reduced result.
- Jump: source hold, launch, apex, descent, landing, cleanup for one/two/three holes; each material landing; reduced result.
- Portal: 0/120/220/260/480/695/720 ms; both pair directions; reduced cut.
- Door: 0/100/260/420/700/835/860 ms for heart/star/sun; reduced open threshold.
- Treasure: source, peak, midpoint, measured arrival, wallet receipt, anchor invalidation, reduced receipt.
- Goal/victory: goal hold/ring/release/cleanup, modal reveal at 480 ms, finite ray/confetti end, static reduced composition.

Screenshot thresholds must tolerate documented antialiasing variance while failing on missing primary shapes, clipped tails, wrong layer order, stale objects, shifted anchors, duplicate notices, or accidental moving-state snapshots.

### 14.4 Live-play and interaction scenarios

For each blocking effect, trigger cancellation at approximately 10%, 25%, 50%, 75%, and 90% through:

- Restart;
- Home, Mazes, and Book;
- tester/normal level change;
- browser/tab visibility loss;
- Tauri minimize/close route;
- component unmount/remount;
- reduced-motion preference change; and
- orientation change into/out of portrait guidance.

Assert:

1. engine outcome occurs exactly once;
2. Power/inventory/door/rescue/position/win state equals the engine;
3. no old overlay, class, sound tail, notice, timer, or animation remains;
4. queued input executes at most once and never in a new context;
5. focus and `aria-live` behavior remain valid and non-duplicative;
6. final static state is readable without motion; and
7. a new effect can start cleanly immediately afterward.

Additional live-play cases:

- spam movement/pointer/D-pad during every input lock;
- mute/unmute before and during cues;
- background music active, hidden, resumed, and navigation-switched;
- Big mode toggle immediately before pickup/treasure/portal;
- resize while stage flight is active;
- low and high Power numbers, two-digit/three-digit text fit;
- every item over bright floor, dark wall, water, lava, poison, and goal glow;
- simultaneous ambient hazards + idle portal/key/goal + Tier 3 transient;
- 100 consecutive start/cancel loops and 10 complete victories without reload.

### 14.5 Readability and accessibility review

- Review the readability rack at ≥78, 48–77, and ≤47 px/tile.
- Inspect colour, grayscale, protan/deutan/tritan simulations, and 200% browser zoom where the UI plan supports it.
- A paused attack direction, portal pair, door/key match, hazard family, pickup category, jump destination, and exact Power outcome must remain clear.
- Use user testing with colour-vision-deficient and motion-sensitive participants; simulations are not signoff.
- Screen-reader smoke: blocked reason, item found, exact Power result, friend rescued, door opened, portal arrival, and win are spoken once in logical order. Decorative cues are silent.
- Reduced motion must not lengthen input lock beyond its static recipe and must not erase result location or identity.

## 15. Coordination contracts

These are interface contracts, not permission for VFX to redesign another track's scope.

### 15.1 Global art direction

**Art owns:** static silhouettes, terrain textures, item/character/cage/door/goal artwork, safe bounds, final palette, and global style language.

**VFX requires:**

- semantic light/dark ink tokens for paired contours;
- approved water/lava/poison value hierarchy and the right to apply non-destructive colour treatment to effect-only duplicates;
- intrinsic safe bounds for every item, portal, cage, door, goal, friend, and enemy used in a transient clone;
- review of the readability rack over every terrain family; and
- approval before any raster helper/flipbook enters the asset pipeline.

**Boundary:** VFX does not redraw assets, change global terrain/wall direction, or create a competing palette. Art cannot rely on motion alone to rescue a weak static silhouette.

### 15.2 Lighting

**Lighting owns:** wall-depth/highlight geometry, global light direction, cast-shadow geometry, fog, and scene-wide illumination.

**VFX requires:**

- a stable light-vector/token interface; current calculations around `src/App.tsx:614-627` remain authoritative until the lighting plan replaces them;
- dedicated cast-shadow markup/pseudo ownership so step/contact effects never reuse it;
- one local emissive-underlay slot below objects/actors for lava, door, portal, and major contact; and
- agreement on maximum local spill radius/opacity and how fog clips it.

**Boundary:** VFX may add bounded emissive accents and consume light direction. It does not reshape walls, move the global light, or use HUD geometry for light.

### 15.3 Sprite animation

**Sprite animation owns:** multi-frame character/creature poses, frame timing, sprite sheets, facing, and animation state machines.

**VFX requires:** semantic pose intents—`anticipate`, `contact`, `recoil`, `recover`, `celebrate`—or a no-op fallback; stable visual attachment points for hand/feet/centre; and a transform-ownership hierarchy:

1. world-position wrapper (camera/game);
2. presentation travel/recoil wrapper (VFX, only while it owns the beat);
3. pose/frame wrapper (sprite system);
4. aura/contact siblings (VFX).

**Boundary:** VFX can work with the current static sprites and outer transforms. It never assumes frame counts, rewrites character art, or places a second transform animation on the sprite-owned element.

### 15.4 UI and layout

The concurrent UI plan is authoritative for adaptive shell/HUD layout and declares the same dependency.

**UI supplies:**

```ts
type VfxAnchorName = "wallet-gold" | "wallet-science" | "power" | "bag";

interface VfxAnchorSnapshot {
  readonly name: VfxAnchorName;
  readonly rect: DOMRectReadOnly;
  readonly revision: number;
  readonly visible: boolean;
}
```

Anchors are measured from the current `MazeViewport`/HUD, revisioned on resize/layout change, and invalidated on unmount. VFX must re-evaluate or cancel a stage flight when revision changes. No `626`, `438`, `735`, `850`, or equivalent fixed destination survives.

**Shared contracts:**

- UI owns modal/shell focus and the accessible announcement surface.
- VFX owns only decorative layers and visual notice priority variants; existing message text remains shared/product copy.
- UI reserves the VFX stylesheet layer/import slot and does not duplicate effect keyframes into general `motion.css`.
- VFX verifies scene overlays are not clipped by the new board wrapper and never raises effects above modal chrome.
- Big/Normal/adaptive layout preserves the world matrix consumed by effects.

### 15.5 Gameplay and engine

**Gameplay owns:** `GameEvent` (`src/game/types.ts:227-314`), Power, inventory, position, traversability, doors, portals, rescue, rewards, level completion, and solver behavior.

**VFX consumes:** immutable event arrays and final state. It can derive presentational terrain contact from `moved.from/to` plus the level terrain but cannot add a movement side effect. Composite event order is kept exactly; the presentation planner decides only how to serialize visuals.

Any additional event data must be additive, deterministic, and justified by information unavailable from event + level + before/after state. No event is delayed until an effect finishes. Input lock remains a presentation lease and cannot alter engine eligibility.

Gameplay signoff includes exact combat conservation, no new loss state, no changed step count, no moved-on-combat regression, unchanged key consumption/open state, portal destination, rescue identity, treasure total, and win status.

### 15.6 Performance

**Performance owns:** reference-device selection, trace methodology, the global frame/long-task budget, and a stable quality policy.

**VFX supplies:** effect resource metadata, debug marks/attributes, full/lite/static recipes, deterministic stress states, and cleanup counters. Performance can request a lower recipe but cannot remove semantic shapes/numbers/static results. New filter, blend, mask, raster, or particle exceptions require a captured trace and documented budget trade.

### 15.7 Sound and accessibility

Sound synthesis retains its voice cap, mute semantics, and failure safety. VFX owns cue timing and lifecycle; sound owns oscillator design, gain staging, master routing, and safe levels. Cue names describe perceptual role (`attack-whoosh`, `contact-spark`, `contact-body`, `result-chime`) rather than ambiguous implementation names.

Accessibility/UI owns announcement wording, focus, and any explicit motion setting. VFX provides one static recipe for every kind and listens to the shared `MotionMode`; it does not create a second preference source.

## 16. Research record and design implications

All sources below were accessed **2026-09-02**. Primary/authoritative sources were preferred; genre references are inspiration-only and do not authorize copying.

### 16.1 Game juice, anticipation, impact, recovery, and clarity

- Riot orders effect goals as gameplay clarity, clutter reduction, thematic expression, then delight; it recommends one dominant gameplay element and anticipation/main action/dissipation. See [“League's VFX Style Guide,” Riot Games, 2017-10-25](https://nexus.leagueoflegends.com/en-us/2017/10/dev-leagues-vfx-style-guide/) and the [official full guide PDF](https://nexus.leagueoflegends.com/wp-content/uploads/2017/10/VFX_Styleguide_final_public_hidpjqwx7lqyx0pjj3ss.pdf). **Plan implication:** primary silhouette and importance-scaled value/size precede particles.
- Riot's later clarity framework says direction/bounds should read without motion, effects need testing on every map, and the visual/audio attention budget is shared. See [“Clarity in League,” Riot Games, 2021-03-12](https://www.leagueoflegends.com/en-us/news/dev/clarity-in-league/). **Plan implication:** paused, terrain-crossing, grayscale, and audio-hierarchy acceptance is mandatory.
- Classical anticipation and follow-through apply directly to real-time VFX. See [“Visual Effects Bootcamp: Zip! Thwack! Ping! Animation Principles of VFX,” Michael Lyndon, GDC 2018](https://www.gdcvault.com/play/1025301/Visual-Effects-Bootcamp-Zip-Thwack) and its [official slides](https://media.gdcvault.com/gdc2018/presentations/Lyndon_Michael_ZipThwackPing.pdf). **Plan implication:** every high-priority timeline names anticipation, contact, recovery, and dissipation.
- Responsive audiovisual embellishment can dramatically improve feel without changing mechanics. See [“Juice It or Lose It,” Martin Jonasson and Petri Purho, GDC Europe 2012](https://www.gdcvault.com/play/1016789/Juice-It-or-Lose). **Plan implication:** preserve engine rules while synchronizing local picture/sound/state.

### 16.2 Small-scale readability and colour accessibility

- Microsoft recommends contrast, outlines, and redundant shape/pattern/icon/text cues, and warns that simulation is not a substitute for testing. See [Xbox Accessibility Guideline 102: Contrast, updated 2026-03-04](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/102) and [Guideline 103: Use of Color, updated 2026-03-04](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/103). **Plan implication:** paired contours, readability rack, and three size bands.
- WCAG requires information not be conveyed by colour alone and defines non-text contrast expectations for meaningful graphics. See [Understanding SC 1.4.1: Use of Color, W3C](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) and [Understanding SC 1.4.11: Non-text Contrast, W3C](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html). **Plan implication:** colour reinforces hazard/key identity; edge/pattern/motif carries it too. The 3:1 value is an internal target for critical borders/icons, not a claim that all decorative world art is a UI component.

### 16.3 Child-friendly combat language

- ESRB distinguishes minimal cartoon/fantasy violence from realistic or graphic blood, gore, injury, and death. See the [ESRB Ratings Guide](https://www.esrb.org/ratings-guide/).
- PEGI guidance/examples describe younger-audience violence as non-realistic, non-detailed, implied, or lacking apparent injury; examples include white flashes, floating values, colourful explosions, crystals, and minor cartoon reaction. See [Ask About Games: Content Descriptors](https://askaboutgames.com/need-to-know/what-are-content-descriptors/) and [PEGI public rating examples](https://pegi.info/sr/search-pegi?age%5B0%5D=7&platform%5B0%5D=PC&release_year%5B0%5D=2020&release_year%5B1%5D=2019).

**Plan implication:** use light, stars, ribbons, squash/recoil, friendly scoot/dissolve, exact values, and warm recovery. Avoid blood-coloured splashes, wounds, realistic pain, bone/crack/squelch audio, prolonged defeat, and punitive camera treatment. This is a tone constraint, not a promised age rating.

### 16.4 Stylized environmental materials

- Water depth changes opacity/reflection/wave behaviour, and fine waves contribute strongly while shallows attenuate motion. See Mark Finch, [“Effective Water Simulation from Physical Models,” NVIDIA GPU Gems, 2004](https://developer.nvidia.com/gpugems/gpugems/part-i-natural-effects/chapter-1-effective-water-simulation-physical-models). Full refraction/reflection methods require expensive scene passes; see Tiago Sousa, [“Generic Refraction Simulation,” GPU Gems 2, 2005](https://developer.nvidia.com/gpugems/gpugems2/part-ii-shading-lighting-and-shadows/chapter-19-generic-refraction-simulation). **Plan implication:** abstract depth, shore attenuation, crests, and ripples; do not simulate refraction.
- Hotter visible lava tends toward yellow/orange while cooler material becomes red/dark and rapidly cooled material can form dark glassy crust. See USGS, [“Remotely measuring the temperature of Kīlauea lava,” 2017-02-23](https://www.usgs.gov/news/volcano-watch-remotely-measuring-temperature-kilauea-lava) and [“Lava rocks come in many colors,” 2000-10-19](https://www.usgs.gov/news/volcano-watch-lava-rocks-come-many-colors). **Plan implication:** dark crust over orange mass with sparse yellow cores, not uniform red scrolling.
- Viscosity is resistance to flow and affects bubble motion. See [OpenStax Chemistry 10.2: Properties of Liquids](https://openstax.org/books/chemistry/pages/10-2-properties-of-liquids) and Daniel D. Joseph, [“Rise velocity of a spherical cap bubble,” University of Minnesota](https://dept.aem.umn.edu/~faculty/joseph/ViscousPotentialFlow/319.html). **Plan implication:** poison drifts/bubbles more slowly and irregularly than water, with visible viscous lag.

### 16.5 Reduced motion and static equivalence

- WCAG allows nonessential interaction animation to be disabled and recognizes instantaneous state change as distinct from motion. See [Understanding SC 2.3.3: Animation from Interactions, W3C](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html).
- The platform preference is defined by [Media Queries Level 5, W3C Working Draft, 2026-02-19](https://www.w3.org/TR/mediaqueries-5/).
- Apple recommends reducing repetitive/automatic and depth motion, tightening bounce, and using fades where suitable; Microsoft recommends static backgrounds and disabling/scaling camera shake, blur, and speed lines. See [Apple HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility), [Apple HIG Motion](https://developer.apple.com/design/human-interface-guidelines/motion), and [Xbox Accessibility Guideline 117: Avoiding Unintentional Motion, updated 2026-03-04](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/117).

**Plan implication:** reduced motion is a separately art-directed static semantic recipe, not `animation: none` applied to an arbitrary start frame.

### 16.6 Browser SVG/CSS compositing and lifecycle cost

- Riot's HTML/SVG client analysis describes layout→paint→composite cost, recommends transform/opacity, separating static from animated SVG, and consolidating attribute updates. See [“Animation in the League of Legends Client,” Riot Games, 2018-02-27](https://www.riotgames.com/en/news/animation-league-legends-client).
- Google recommends transform/opacity, paint profiling, and restrained `will-change`; excess compositing layers consume memory. See [“How to create high-performance CSS animations,” web.dev](https://web.dev/articles/animations-guide) and [“Stick to Compositor-Only Properties and Manage Layer Count,” web.dev](https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count).
- Blur cost rises with image size/radius. See [“Animating a blur,” Chrome Developers](https://developer.chrome.com/blog/animated-blur).
- SVG filters use intermediate image buffers, and masks render descendants as a group/stacking context. See [Filter Effects Module Level 1, W3C](https://www.w3.org/TR/filter-effects-1/) and [CSS Masking Module Level 1, W3C](https://www.w3.org/TR/css-masking-1/).

**Plan implication:** animate bounded transform/opacity groups, keep filters/masks static and tight, split animated/static SVG content, use temporary `will-change`, and measure instead of treating historical benchmark numbers as portable budgets.

- Hidden pages stop `requestAnimationFrame` and throttle timers, which desynchronizes independently scheduled CSS/DOM/audio work. See [Page Visibility API, MDN](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) and [Page Visibility Level 2, W3C Recommendation](https://www.w3.org/TR/page-visibility-2/).
- Web Animations exposes controllable handles and explicit cancellation semantics. See [Web Animations API, MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) and [`Animation.cancel()`, MDN](https://developer.mozilla.org/en-US/docs/Web/API/Animation/cancel).

**Plan implication:** one abortable presentation run owns timers, animation handles, voices, lock, and final reconciliation.

### 16.7 Magical-girl and JRPG principles without IP copying

- Jiyon Han analyzes transformation sequences through trigger, medium, visual marker, and result. See [“A Study on the Structural Transformation of Magical Girl Anime Transformation Sequences,” Korean Society of Cartoon and Animation Studies 83, 2026](https://kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003358550).
- Cygames describes codifying motion/rendering rules from the intent of stylized illustration rather than pursuing generic realism. See [“A Breakdown of Granblue Fantasy: Relink's Graphics — Part Two,” Cygames Magazine, 2020-12-14](https://magazine.cygames.co.jp/en/archives/1311813507/).
- Square Enix's discussion of an ultimate spell distinguishes it through staged expanding form and a reserved final flash, supporting explicit intensity tiers. See [Card Gamer Magazine interview with Toshitaka Matsuda, Square Enix, 2018-10-31](https://fftcg.square-enix-games.com/na/news/card-gamer-magazine-interview-with-toshitaka-matsuda).
- Toei's [official Pretty Cure transformation-scene library](https://www.toei-anim.co.jp/tv/precure/movie/precure.php?movie=curekyunkyun-henshin) was reviewed only as a genre reference.

**Plan implication:** use an original trigger→connective medium→unique marker→readable result grammar and reserved intensity ladder. Do not reproduce identifiable props, logos, glyphs, exact palettes, named attacks, shot order, or specific choreography.

## 17. Definition of done

The overhaul is complete only when all statements below are true.

### Semantics and lifecycle

- Engine, solver, persistence, rewards, movement, doors, portals, rescue, and victory tests pass unchanged in meaning.
- Combat conserves exact Power at every frame and completes/cancels to engine Power.
- Input is locked for the declared plan and always released by its owning run; stale input cannot cross contexts.
- Restart, navigation, level change, visibility loss, unmount, motion change, and anchor invalidation pass the matrix with no stale work.
- Accessible outcomes are announced once; decorative effects stay silent.

### Visual language and readability

- Water, lava, and poison are distinct in motion, paused grayscale, reduced/static mode, and at 844×390.
- Every critical item/goal/portal/door/hazard edge passes the terrain readability rack with a redundant non-colour identity.
- Each high-priority effect has one dominant shape, clear anticipation/contact/recovery, finite dissipation, and a child-safe tone.
- Portal shows departure and arrival; jump→portal is sequenced; the door and rescue tails are not clipped; goal gets a local result before modal.
- Full, lite, and static recipes preserve the same semantic trigger, location, identity, numbers, and result.

### Sound and timing

- Picture, sound, Power values, and teardown are driven by one typed plan.
- Reference-device sound/contact skew is ≤25 ms and hidden/canceled cues never catch up or leak.
- Sound handles cancel safely without clicks and preserve mute, unsupported-audio, and 24-voice-cap behavior.

### Performance and maintainability

- Section 11 node, particle, mask, filter, paint, frame, long-task, and soak budgets pass.
- `MazeTerrain` render data is memoized and off-camera material paint is bounded.
- `src/vfx.css` has no `!important`, duplicate owned selector, orphaned keyframe, or appended V-number override.
- Cast shadow, step sparkle, sprite pose, and VFX transform each have one owner.
- The repository adds no runtime VFX library and no unapproved/generated asset.

### Cross-platform signoff

- Desktop browser, Tauri/WebView2, tablet, phone landscape, portrait guidance, Big mode, reduced motion, and static quality pass the named scenarios.
- Art direction, lighting, sprite animation, UI, gameplay, sound/accessibility, and performance owners sign their Section 15 contracts.
- Rollback to the last accepted family or global static quality is proven before release.

## 18. Audit artifacts and repository boundary

Temporary browser captures are evidence only and remain outside the repository under `C:\Users\hellb\AppData\Local\Temp\maze-vfx-audit-2026-09-02`. They are not test baselines and may be deleted after review. Implementation baselines belong under the future test-artifact policy established in Phase 0.

This planning pass intentionally changes no engine, component, style, sound, asset, configuration, or test file. Its sole repository deliverable is this document.
