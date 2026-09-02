# Plan 05 — Limited Sprite Animation System

## 0. Manager-reviewed execution addendum

This track is deliberately late. Read `docs/GAME_VISION_AND_DESIGN_SPEC.md`, `docs/plans/00-integrated-implementation-roadmap.md`, the final Art Bible/Ame model sheet, UI/UX spec, Lighting spec, VFX Bible, Controls spec, this plan in full, and current code before changing anything. Execution is blocked until Plans 07A, 06, 03, 01, 04, 02, and 08 are accepted.

### Final dependencies and identity rules

- The sole visual authority for Ame frames is the final Plan-03-approved static design and model sheet. Historical runtime hashes are provenance/reference only.
- Every Ame frame preserves unmistakably blonde/golden hair, clearly blue irises, the approved slightly longer hairstyle, facial/costume landmarks, body registration, and age-appropriate warmth.
- Do not independently revise interfaces already landed by art, UI, lighting, VFX, or controls. Adapt the manifest/renderer to their current contracts and document any unavoidable versioned migration.
- Consume Plan 04's grounding wrappers and `--entity-lift`-style contract, Plan 02's presentation run/absolute clock/pose intents, Plan 01's target display sizes and canonical `src/motion.ts` types/provider, and Plan 08's input/presentation-lock lifecycle. Import `MotionMode` from `src/motion.ts`, not `src/vfx/types.ts`; static sprite quality remains independent of the full/reduced preference. This addendum supersedes the older illustrative import paths below.

### Bounded first tranche

- Treat the proposed 16-file/13-new-drawing set as a maximum first tranche, not a quota. Ship only drawings with a clear acting job and approved actual-size improvement; do not bulk-fill every family.
- Lock one-shot availability at action start. If optional frames finish decoding mid-action, remain on the selected static/reduced fallback until the next action; never pop into animation halfway through a beat.
- Body and held weapon availability/registration are atomic for an action. If either required component is unavailable, use the complete canonical static composition.
- Base-art URL history and catalogue pointer rollback remain owned by Plan 03's resolver/pipeline. Animation selects optional frames and falls back to the canonical static sprite; it does not add a second permanent legacy-fallback system.
- Sprite/ambient animation owns only its namespaced frame/secondary-motion rules. VFX timeline keyframes and presentation lifetime remain Plan 02-owned; CSS layer order and common motion preference remain Plan 01-owned.
- Add integration coverage for held controller input through locks, disconnect/reconnect during a presentation, resize/Big mode during an action, motion-preference changes, visibility loss, cancellation, and no mid-clip upgrade.

### Documentation and completion

Create and maintain `docs/ANIMATION_SPEC.md` and versioned frame/source records through the shared art pipeline. Update the Art Bible/Ame-model references, append exact new generation/edit provenance to `docs/AI_ASSET_PROMPTS.md`, and update architecture/audit/release evidence when true.

Completion is the accepted bounded tranche, not the number of possible animated families. It requires on-model onion-skin/actual-size proofs, deterministic selection, isolated rendering with zero App/grid cadence commits, atomic fallback, bounded loading/decode/memory, controller and reduced/static parity, and the complete project gates.

**Status:** implementation-ready planning and research only

**Prepared:** 2026-09-02

**Scope owner:** sprite animation manifests, frame selection, state/event presentation mapping, renderer behavior, registration metadata, frame assets, preload policy, and motion fallbacks

**Not authorized by this plan:** production-frame generation, runtime integration, gameplay changes, VFX redesign, wall-lighting changes, or HUD/layout redesign

## 1. Executive decision

Build a small, optional, typed animation layer on top of the existing `SpriteArt.src` contract. Keep `src` as the guaranteed static fallback; add an `animationId` only to art that has an approved family manifest. Render a fixed 512 × 512 virtual canvas, switch discrete lossless WebP frames inside an isolated sprite component, and derive frames from absolute elapsed time rather than incrementing a counter in `App`.

The first content pack is intentionally narrow:

- Ame: neutral/idle breath, blink, alternating steps, blocked reaction, a three-pose combat vocabulary, and one reusable joy pose.
- Kitten: worried-in-cage and release/joy, because kitten rescue appears in the first story maze.
- Goblin: contact reaction and friendly surrender, because goblin is the first enemy family.
- Existing comet spear and star sword overlays: registered through explicit weapon grip/body hand-socket metadata; unsupported body/weapon pairs retain the current neutral overlay presentation.
- No multi-frame object family in the MVP. Current CSS motion remains the fallback for cages, treasure, keys, portals, goals, and pickups until character animation proves the pipeline and budgets.

This is 16 default field-256 runtime files: three canonical neutral derivatives and 13 new drawings. The MVP ships no 512 presentation duplicate without a separately approved proof. Only the current-level subset is eligible for loading, and the pack must remain behind a kill switch until its actual-size art review, timing review, and budget checks pass.

## 2. Repository state inspected

The audit began on branch `main` at commit `c6b6628b6e651d18161a4d1302935d3096f665c6` (`Record 0.19.0 production verification`). `HEAD` and `origin/main` were aligned (`+0 / -0`), and the working tree was initially clean.

Concurrent planning work appeared during the audit. At the authoring checkpoint, `HEAD` was unchanged and these files were untracked:

- `docs/plans/01-ui-ux-layout-overhaul.md`
- `docs/plans/02-graphics-vfx-overhaul.md`
- `docs/plans/03-magical-girl-art-direction.md`
- `docs/plans/04-lighting-wall-depth.md`
- `docs/plans/06-game-design-gameplay-ux-mechanics-plan.md`
- `docs/plans/07-performance-web-tauri-plan.md`
- `docs/plans/08-controls-xbox-steam-deck-plan.md`

Those files were not modified by this work. The final command transcript and exact final status are recorded in section 23. This plan must remain the only file changed by the sprite-animation work itself.

Planning-only tooling wrote no repository assets. Two ImageGen assay results remained in the user-scoped generated-image store, browser testing used a temporary local Vite server and test-mode game session, and the asset format comparisons/contact calculations ran read-only or in memory.

## 3. Scope boundaries and invariants

### 3.1 Owned here

- Typed animation and frame manifests.
- Pure frame selection, interruption, direction fallback, and deterministic error fallback.
- The inner sprite renderer, shared animation clock, registration canvas, pivots, content bounds, and weapon attachments.
- Runtime frame format, names, versions, source lineage, processing, and validation.
- Frame-family preload/decode/cache/visibility/cancellation policy.
- Static and reduced-motion frame selection.
- Presentation adapters that consume existing gameplay and presentation state.

### 3.2 Explicitly not owned here

- Whether movement, combat, rescue, pickup, jump, portal travel, or victory succeeds.
- Combat duration, damage/power transfer, clash semantics, or audio cue semantics.
- Particle, spark, trail, halo, dissolve, screen-shake, or other VFX design.
- Wall lighting, shadow direction, terrain lighting, and baked scene illumination.
- General HUD, modal, Adventure Book, or board layout.

### 3.3 Non-negotiable contracts

1. Gameplay commits outcomes exactly as it does now; animation only presents them.
2. Existing presentation clocks remain authoritative. A frame marker may aid visual synchronization and tests, but must never trigger a gameplay mutation.
3. `SpriteArt.src` remains valid and sufficient for feature disable, soft rollback, and any animation-layer manifest/frame/decode failure. Reduced motion may deliberately select a more meaningful manifest static frame. If the canonical art URL itself fails and no live rollout fallback remains, the renderer shows its code-native neutral silhouette placeholder; it never emits a broken-image glyph or empty box.
4. Outer world placement/motion and inner frame registration stay in separate DOM layers so a frame swap cannot fight the tile-position transform.
5. Frame changes never cause the 3,800-line `App.tsx` or the maze grid to rerender at animation cadence.
6. Board sprites remain decorative (`alt=""`, `aria-hidden="true"`); existing labels and live-region text continue to communicate game state.

## 4. Current-state inventory

### 4.1 Data, rendering, and loading

| Area | Current implementation | Consequence for animation |
|---|---|---|
| Art data | `src/artCatalog.ts` defines `SpriteArt` as one `src` plus `label`; catalog resolvers fall back only for invalid catalogue IDs. | Add an optional manifest reference without breaking the static contract; add a runtime file-error fallback. |
| Ame data seam | `ASSETS.ame` is currently a bare string; unlike kitten/goblin, Ame has no `SpriteArt` catalogue record. | Phase 1 first creates and tests `AME_ART` in `artCatalog.ts`, then makes `ASSETS.ame` a compatibility alias of `AME_ART.src`; all renderer inputs use the resolved record, never synthesize one at the call site. |
| Asset URLs | `src/assets.ts` exposes a flat `ASSETS` map. | Preserve the static contract; new frames get immutable, versioned URLs, and only the three approved neutral catalogue URLs migrate under the one-release rollback policy. |
| Board renderer | `src/App.tsx` emits static `<img>` tags for world objects, followers, battle, rescue, jump, portal, and base player layers. | Introduce one isolated inner renderer and migrate sites incrementally. |
| Weapons | Ame and the chosen weapon are separate layers with one CSS placement. | Add a body-frame hand socket and per-weapon grip/axis; update both from one selected frame. |
| Personality | `src/game/visualPersonality.ts` selects CSS bob, squash, waddle, sway, prance, and rotate families for one still. | Retain as fallback/outer secondary motion; do not duplicate transform ownership in the frame renderer. |
| Preload | `preloadSources` creates unretained `Image` objects, sets `decoding="async"`, marks a URL before success, and neither calls nor awaits `decode()`. | Replace only the animation path with stateful, deduplicated decode records and cancellation generations; preserve level-selective collection. |
| Accessibility | Board imagery is decorative; nearby-position and game labels expose meaning. | A changing frame never gets a changing `alt`; renderer props enforce decorative versus meaningful use. |

Important integration sites in the inspected revision are `src/App.tsx` around world objects (2704–2708), followers (2732), battle (2815–2820), rescue (2858–2860), jump (2886–2888), portal (2902–2906), and player (2918–2919). Treat line numbers as audit coordinates, not permanent API locations.

### 4.2 Existing presentation timing

| Presentation | Existing authority and duration | Current image behavior | Animation implication |
|---|---|---|---|
| Move | Successful move unlocks after 64 ms; player `left/top` transition is 120 ms; `move-a/b` hop is 76 ms. Held movement begins at 320 ms and accelerates from 260 to 160 ms. | Same neutral Ame image hops. | A 120 ms step pulse may overlap input availability but must not delay it. Alternate feet by successful-move parity. |
| Blocked | `blocked` contains reason, target, terrain, and requested direction; input unlocks after 45 ms. | `bump-a/b` is toggled, but no matching CSS rule exists. | A 240 ms visual reaction can continue after controls unlock and restart on the next `bumpPulse`. |
| Combat victory | `src/combatPresentation.ts`: 2,220 ms full / 180 ms reduced. Clash start-impact-end: `120-330-560`, `570-760-990`, `1020-1200-1500`; victory cue at 1,900 ms. | Duplicated neutral player/enemy images use CSS lunge/squash/fade. | Consume the exact plan timestamps; do not create a second percentage timeline. |
| Rescue | 900 ms full / 140 ms reduced; rescue sound at 150 ms; CSS set piece ends at 870 ms. | One closed cage is clipped into halves, one static friend hops, neutral Ame cheers by transform. | Expression changes key off the same presentation ID and start time. |
| Jump | 460/585/710 ms for one/two/three holes; apex and landing values live in `src/jumpPresentation.ts`. | Static Ame, boots, and weapon travel as layers. | Stage 3 only; use existing jump plan unchanged. |
| Portal | 720 ms full / 140 ms reduced; CSS arrival ends at 695 ms. | Only a static destination arrival is shown. | Stage 3 only; never infer transport from an animation marker. |
| Door | 860 ms full / 140 ms reduced. | Door dissolves; main Ame is hidden without a replacement Ame layer. | Renderer integration may repair visual continuity later, but does not own door semantics. |
| Lock magic data | `src/magicEffects.ts` owns deterministic key-colour tokens, glyphs, radial offsets, and per-particle delays (0–110 ms for the default 18), not a set-piece lifetime. Door lifetime remains in `App`/CSS. | VFX particles render independently of character art. | Treat it as a read-only VFX recipe; a later sprite adapter may share the director run/time but must not import or change particle timing. |
| Treasure | 1,050 ms full / 180 ms reduced; it does not block input/victory. | Object disappears immediately and a static duplicate flies. | Stage 3; keep nonblocking behavior. |
| Victory | Completion state commits immediately; modal waits for presentations except treasure. | Static goal and continuously CSS-animated friend stills; no Ame victory pose. | Reuse an approved Ame joy hold if UI supplies a slot. |
| Story | One static portrait per speaker; no emotion field. | No expression change. | Requires a later authored story-beat contract, not inference from text. |

Presentation timers are already centrally generation-guarded and cancel on level changes, navigation, unmount, and page hide. Frame playback and decode work must join that cancellation model.

### 4.3 Live browser measurements

The current build was exercised in the in-app browser on 2026-09-02 at an approximately 1333 × 720 CSS-pixel viewport. Values vary with stage scaling, but establish the real review scale:

| Element | Observed rendered size |
|---|---:|
| Nine-tile-wide camera world | about 1008 × 1008 CSS px |
| One world tile/layer | 112 × 112 CSS px |
| Ame image | about 103 × 103 CSS px |
| Friend image | about 105 × 105 CSS px |
| Cage | about 110 × 110 CSS px |
| Held weapon | about 78 × 78 CSS px |
| Goal | about 94–97 CSS px |

Computed styles confirmed the 76 ms hop and 120 ms positional transition. The Shiny Sword test maze also confirmed separate static layers for Ame, fox, storybook cage, comet spear, and key; Splashy Boots confirmed that the slime personality comes from CSS deformation of one still. Art approval must therefore include 1× and 2× screenshots at roughly 103 px, not only zoomed masters.

### 4.4 Asset and pipeline baseline

Read-only Pillow inspection found:

- `public/assets`: 125 images, 37.36 MiB transferred, approximately 174.53 MiB as RGBA pixels. Ninety-eight files are 512 × 512; 91 alpha-bearing 512 sprites alone decode to exactly 91 MiB before browser/compositor overhead.
- `docs/source-assets` contains 104 PNGs (158.02 MiB), but 24 early runtime assets have no same-stem checked-in source, including Ame, kitten, goblin, the earliest weapon/goal/pickup art, and other first-session sprites. Existing source coverage is therefore uneven despite the large source directory.
- Each added untrimmed 512 × 512 RGBA frame costs 1,048,576 bytes decoded and may require a comparable GPU texture copy.
- Current representative content bounds differ sharply despite the shared canvas: Ame `(122, 7)–(388, 494)`, while friend/enemy families use materially different envelopes. Equal canvas size is not registration.
- The eight weapon canvases have materially different content/grip positions; fixed `right/bottom/rotate` CSS is not a hand attachment system.
- In-memory lossless WebP conversion of current PNG pixels reduced Ame to 73.0%, friends to 68.7%, enemies to 73.0%, portals to 72.2%, and weapons to 74.2% of current PNG bytes.
- Four representative discrete WebPs beat equivalent four-frame sheets: sheets were 1.6% larger for friends, 2.0% larger for enemies, and 2.1% larger for weapons, with identical total decoded pixels.
- Existing scripts have useful Lanczos scaling, alpha checks, connected-background cleanup, and lossless WebP `exact=True`, but they are release-specific. Several hardcode a user-generated-image path; only terrain texture/dressing scripts offer a non-writing `--check` workflow.
- Python 3.14.3, Pillow 12.2.0, and NumPy 2.5.2 were available user-scoped. ImageMagick, FFmpeg/ffprobe, `cwebp`, Sharp, Wand, MoviePy, and `imageio-ffmpeg` were not installed.

The closest reusable precedent is `scripts/process_portal_assets.py`: it normalizes to a fixed canvas, removes edge-connected checker color, and validates outer transparency. The shared art pipeline’s animation module should absorb those ideas rather than extend a release-numbered script or create a parallel CLI.

### 4.5 Current low-cost motion inventory

- `src/game/visualPersonality.ts` maps all 15 friend species to six CSS motion families (`hop`, `waddle`, `prance`, `sway`, `snuggle`, `scamper`) with roughly 1.02–1.46 second loops.
- All 12 enemy styles map to seven still-image deformation families (`squish`, `flutter`, `stomp`, `skitter`, `swagger`, `bob`, `hop`) with roughly 0.94–1.48 second loops.
- Followers move through a bounded trail, but trail entries carry no direction or locomotion phase. Position transitions are about 78 ms in the observed styling.
- Existing object loops are approximately portal 1.8 s, ordinary item shine 2.8 s, key hover 2.0 s, door breathe 2.4 s, treasure idle 1.25 s, and goal glow 2.0 s.
- Reduced-motion CSS already collapses or disables many loops and supplies usable set-piece endpoints. The new frame system must preserve that strength rather than relying on fast frame cycling.
- Styles are layered through accumulated overrides. New code should consolidate migrated sprite rules under one inner-renderer block instead of adding another broad transform override.

## 5. Opportunity matrix and rollout priority

Scores use 5 as highest. “Ready” means the current game already emits an unambiguous presentation signal; it does not authorize changing gameplay.

| Family/state | Visibility | Reuse | Emotional value | Signal readiness | Art/system cost | Decision |
|---|---:|---:|---:|---:|---:|---|
| Ame idle/breath | 5 | 5 | 3 | 5 | 2 | MVP: one subtle breath drawing with a long neutral hold. |
| Ame blink | 5 | 5 | 4 | 4 | 2 | MVP: one closed-eye drawing, renderer-seeded interval, idle-only interruption. |
| Ame walk/step | 5 | 5 | 3 | 5 | 3 | MVP: two alternating step extremes fitted to the existing 120 ms travel. |
| Ame blocked | 4 | 4 | 4 | 5 | 2 | MVP: fixes a currently unreadable/dead bump presentation. |
| Ame armed | 4 | 5 | 3 | 5 | 3 | MVP metadata/static state; no new body drawing. Validate comet spear and star sword pairs. |
| Ame pickup | 3 | 4 | 3 | 5 | 2 | MVP for exact `sword-collected`; other pickup families are Stage 3. Item outcome stays immediate. |
| Ame combat wind-up/contact/recovery | 4 | 5 | 5 | 5 | 5 | MVP: best exact synchronization target and strongest payoff. |
| Ame Power-up | 3 | 4 | 4 | 5 | 1 | MVP maps exact `potion-collected` to joy/neutral and reuses recovery during combat transfer; bespoke pose later if needed. |
| Ame rescue joy | 4 | 5 | 5 | 5 | 2 | MVP reuses one joy drawing at the established 150 ms beat. |
| Ame victory | 4 | 5 | 5 | 5 | 1 | MVP static joy hold if UI provides a slot; no looping requirement. |
| Ame jump | 2 | 3 | 4 | 5 | 4 | Stage 3: needs arc-safe silhouette and boot/weapon sockets. |
| Ame portal arrival | 2 | 3 | 4 | 5 | 4 | Stage 3: arrival pose plus VFX/lighting handoff. |
| Ame story emotions | 3 | 3 | 5 | 1 | 5 | Stage 4: requires explicit line/beat emotion metadata from narrative/UI. |
| Friends cage idle/worried | 4 | 3 | 5 | 5 | 3 | MVP for kitten only; stage by species thereafter. |
| Friends release/hop | 4 | 4 | 5 | 5 | 3 | MVP for kitten only using one joy extreme plus neutral. |
| Friends follower movement | 3 | 5 | 4 | 3 | 5 | Stage 3: derive presentation direction from trail deltas without changing gameplay state. |
| Friends victory dance | 3 | 4 | 5 | 5 | 3 | Stage 3: use approved neutral/joy poses; reduced mode holds joy. |
| Enemy idle personality | 3 | 5 | 3 | 5 | 4 | Stage 3 by reusable body archetype; retain CSS family in MVP. |
| Enemy alert | 3 | 4 | 4 | 3 | 4 | Stage 3 only with gameplay-approved adjacency/telegraph signal. |
| Enemy attack/wind-up | 4 | 5 | 4 | 5 | 4 | MVP goblin keeps the current outer lunge around neutral art; Stage 3 may earn a distinct anticipation frame. |
| Enemy contact reaction | 4 | 5 | 4 | 5 | 3 | MVP for goblin; exact clash contacts. |
| Enemy defeat/friendly surrender | 4 | 5 | 5 | 5 | 3 | MVP for goblin; must read friendly, not injured. |
| Cage idle/open | 3 | 4 | 4 | 5 | 4 | Stage 3; current clipped-halves effect remains during MVP. |
| Weapon overlay | 4 | 5 | 4 | 5 | 4 | MVP attachment schema; expand pair compatibility in Stage 3. |
| Treasure | 2 | 3 | 3 | 5 | 3 | Stage 3 after player/friend slice; current CSS loop/flight is adequate. |
| Keys and important pickups | 3 | 4 | 3 | 5 | 3 | Stage 3: collection/contact hold; no delayed collection. |
| Portals | 3 | 3 | 4 | 5 | 4 | Stage 3: family-local loop/arrival only after motion and memory review. |
| Goal | 3 | 4 | 5 | 5 | 2 | Stage 3: two purposeful states at most; prioritize completion readability. |
| Doors | 2 | 3 | 3 | 5 | 3 | Stage 4; current dissolve has stronger value than extra door frames. |

## 6. Animation grammar

The system optimizes for purposeful drawings, not nominal smoothness. Limited animation commonly holds strong drawings and omits low-value in-betweens; research on interactive animation also highlights the tradeoff between fluidity and responsive control ([Kitamura et al., 2014](https://www.cgg.cs.tsukuba.ac.jp/projects/2013/motion_frame_omission/index.html), [Fong, 2023](https://doi.org/10.1177/17468477231182910); accessed 2026-09-02). Timing and actual-camera silhouette matter at least as much as frame count ([Game Developer, 2021](https://www.gamedeveloper.com/game-platforms/12-principles-for-game-animation); accessed 2026-09-02).

Apply this vocabulary:

- **Anticipation:** one readable wind-up only where an existing presentation already has time for it. It may overlap immediate movement; it never holds back a gameplay result.
- **Contact/extreme:** the shortest, clearest silhouette, placed on the authoritative contact timestamp.
- **Recoil/follow-through:** moves opposite the force, then settles with smaller energy. Weapon and body follow the same clock.
- **Moving hold:** keep the appealing pose; use a tiny overshoot/settle or eye/chest change instead of continuous noise.
- **Blink:** an acting punctuation, idle-only in MVP. Never blink during combat contact, blocked concern, release joy, or an important story look.
- **Breathing:** long neutral holds and a small chest/weight shift. Actors receive a deterministic phase offset so a room does not breathe in chorus.
- **Expression change:** must read at the measured 103–105 px board scale. Eyes/mouth alone are insufficient if the silhouette and head angle contradict the feeling.

These principles align with Disney’s anticipation/follow-through/timing vocabulary and animator guidance on purposeful blinks and moving holds ([Disney Animation](https://www.disneyanimation.com/process/animation/), [Animation Mentor: anticipation](https://www.animationmentor.com/blog/anticipation-the-12-basic-principles-of-animation/), [Animation Mentor: moving holds](https://www.animationmentor.com/blog/why-all-animators-need-to-master-the-moving-hold/); accessed 2026-09-02).

## 7. Exact MVP content specification

### 7.1 Runtime drawings

All files below are future outputs; none should be produced during this planning phase. “Derived” means deterministic processing of the approved canonical master, not a newly invented drawing.

| Entity | Semantic frame ID | Drawing job | Source status |
|---|---|---|---|
| Ame | `ame.neutral` | Canonical registered fallback | Derived from approved master/current neutral. |
| Ame | `ame.idle.breathe` | Tiny chest/weight lift; feet and head registration locked | New drawing. |
| Ame | `ame.idle.blink` | Closed lids; everything outside approved eye mask unchanged | New masked edit. |
| Ame | `ame.step.a` | Clear left-foot/contact extreme | New drawing. |
| Ame | `ame.step.b` | Clear right-foot/contact extreme | New drawing. |
| Ame | `ame.blocked` | Direction-neutral compressed brace/concern; the existing outer recoil vector alone points opposite the requested direction | New drawing. |
| Ame | `ame.combat.windup` | Weapon-safe anticipation with strong silhouette | New drawing. |
| Ame | `ame.combat.contact` | Single decisive contact extreme | New drawing. |
| Ame | `ame.combat.recover` | Recoil/settle that can hold through Power transfer | New drawing. |
| Ame | `ame.joy` | Reusable rescue/victory delight, not a generic open-mouth redraw | New drawing. |
| Kitten | `kitten.neutral` | Canonical registered fallback/follower rest | Derived from current kitten. |
| Kitten | `kitten.worried` | Hopeful worry behind cage; compact ears/posture | New drawing. |
| Kitten | `kitten.joy` | Release hop/victory extreme | New drawing. |
| Goblin | `goblin.neutral` | Canonical registered fallback/outer CSS personality | Derived from current goblin. |
| Goblin | `goblin.hit` | Benign surprise/recoil at contact, never injury | New drawing. |
| Goblin | `goblin.surrender` | Friendly hands-down/peaceful defeat | New drawing. |

The first story maze contains the kitten; the next introduces goblin combat with the comet spear. This gives the vertical slice immediate first-session visibility rather than hiding the investment in late content.

### 7.2 Exact clip timing

Durations are authored per step in milliseconds. Boundaries are half-open: a step owns `startMs <= elapsedMs < endMs`. The final instant of a one-shot resolves to its declared exit/static frame.

| Clip | Exact sequence | Total / trigger | Full-mode behavior | Reduced/static behavior |
|---|---|---:|---|---|
| `ame.idle` | neutral 1,380; breathe 200; neutral 1,420 | 3,000 ms loop | Seeded phase offset by stable sprite instance ID. | neutral only. |
| `ame.blink` | blink 80; neutral 80 | 160 ms once | Interrupts idle only, after a deterministic 3,600–6,200 ms interval; returns to idle. | Suppressed. |
| `ame.step-a` | step-a 72; neutral 48 | 120 ms once per successful odd movement pulse | Starts with movement; does not delay the 64 ms input cadence. | neutral/armed result, no cycling. |
| `ame.step-b` | step-b 72; neutral 48 | 120 ms once per successful even movement pulse | Alternates only on successful moves; unrelated rerenders do not reset it. | neutral/armed result. |
| `ame.blocked` | blocked 80; neutral 160 | 240 ms once per `bumpPulse` | The one default drawing is symmetric/direction-neutral; requested direction chooses only the outer recoil vector. Input still unlocks at 45 ms. | blocked key pose up to 120 ms, then neutral; no translate/scale. |
| `ame.armed` | neutral + compatible weapon hold | indefinite state | Uses one atomic body/socket + weapon/grip composite; no new body drawing. | Same static composite. |
| `ame.pickup-weapon` | joy 160; armed neutral 260 | 420 ms once per `sword-collected` | Nonblocking; persistent armed result wins at exit. | Immediately show the armed result. |
| `ame.power-up` | joy 180; neutral 240 | 420 ms once per `potion-collected` | Nonblocking and preemptible by a director-owned set piece; Power changes immediately. | Immediately show the updated neutral/armed result. |
| `ame.combat` | Exact segment map below | 2,220 ms once per battle presentation ID | Uses the director’s clash, transfer-end, release, and victory markers. | contact tableau 95; joy/result 85, matching the director’s 95 ms replacement marker. |
| `ame.rescue-joy` | neutral 150; joy 720; neutral 30 | 900 ms once per rescue presentation ID | Joy lands with the existing 150 ms rescue cue and holds through the 870 ms CSS set piece. | joy held during 140 ms presentation, then neutral/follower state. |
| `ame.victory` | joy hold | UI/VFX-owned finite completion run | No sprite-owned loop/lifetime; the frame holds only while the completion slot is mounted. | joy hold. |
| `kitten.caged` | worried hold | indefinite hold while caged | No blink in MVP; avoids activity behind cage bars. | worried hold. |
| `kitten.release` | worried 280; joy 590 | 870 ms once | Keeps the worried expression through the initial separation, then changes on animation-owned `FRIEND_RELEASE_JOY_AT_MS = 280`; this is an acting beat, not a VFX/gameplay cue. | freed joy hold, cage halves hidden by the reduced presentation. |
| `goblin.combat` | Exact segment map below; hit for 50/50/60 contact windows | 2,220 ms once per battle presentation ID | Uses the same authoritative elapsed time as Ame; surrender begins only after transfer at 1,730 ms and is hidden at victory 1,900 ms. | hit/contact tableau 95; hidden behind the result seal for 85. |
| `goblin.surrender` | surrender hold | 1,730–1,900 ms | Friendly release pose only during the director-owned relax/scoot interval; it is absent at victory. | not separately played. |

The combat clip must total exactly 2,220 ms:

| Interval (ms) | Ame frame | Goblin frame | Existing semantic anchor |
|---:|---|---|---|
| 0–120 | neutral/armed | neutral | Initial hold. |
| 120–330 | combat-windup | neutral + existing outer anticipation | Clash 1 wind-up through the exact impact boundary. |
| 330–380 | combat-contact | hit | Contact begins at impact 330 and holds 50 ms. |
| 380–560 | combat-recover | neutral + outer recoil | Clash 1 recovery. |
| 560–570 | neutral | neutral | Ten-millisecond authored hold; scheduler may paint no extra frame at 60 Hz. |
| 570–760 | combat-windup | neutral | Clash 2 wind-up through the exact impact boundary. |
| 760–810 | combat-contact | hit | Contact begins at impact 760 and holds 50 ms. |
| 810–990 | combat-recover | neutral | Clash 2 recovery. |
| 990–1,020 | neutral | neutral | Reset hold. |
| 1,020–1,200 | combat-windup | neutral | Clash 3 wind-up through the exact impact boundary. |
| 1,200–1,260 | combat-contact | hit | Contact begins at impact 1,200 and holds 60 ms. |
| 1,260–1,500 | combat-recover | neutral | Final recoil. |
| 1,500–1,730 | combat-recover | neutral | Final exact Power transfer continues; do not pre-announce surrender. |
| 1,730–1,900 | combat-recover | surrender + director-owned scoot/dissolve | Transfer is complete; friendly release interval. |
| 1,900–2,220 | joy | hidden; director-owned result seal/ring may remain | Existing victory cue; enemy copy is absent. |

Reduced combat is exact: at 0–95 ms Ame holds `combat-contact` and goblin holds `hit` under Plan 02’s static contact/transfer tableau; at 95–180 ms Ame holds `joy` and goblin resolves to hidden while the VFX-owned result seal replaces it. Static sprite quality uses the same two semantic holds (no cycling or spatial motion), because hiding a defeated copy at the director’s result marker is state reconciliation, not decorative animation.

`src/combatPresentation.ts` plus the Plan-02 director screenplay remain the source of those timestamps. Derive 1,730 from the final clash `transferEndMs` and 1,900/95 from the exported `victory` cue; do not copy them as disconnected CSS magic numbers. Plan 02 owns outer dissolve/result-seal visibility, while the sprite mapping owns only pose/hidden selection at those markers.

`FRIEND_RELEASE_JOY_AT_MS` is exported once from the animation timing/manifest module and used by the kitten manifest and boundary test. It is deliberately animation-owned: it changes only expression selection inside the existing 870 ms rescue presentation and cannot fire hearts, cage motion, sound, rescue completion, or input unlock. If the shared director later exports a semantically equivalent release marker, replace the animation constant with that marker in one change and keep the same boundary test.

### 7.3 MVP success rationale

- Ame receives visible life on every level and readable feedback for the currently missing blocked reaction.
- The same small pose vocabulary covers movement, pickups, combat, rescue, and victory.
- Kitten and goblin prove friend/enemy manifests and the first two story mazes instead of hiding the investment in late content.
- Combat proves exact event synchronization and layered weapon attachment.
- No new object frames are justified until the character slice meets its art and performance gates.

## 8. Typed manifest and runtime API

### 8.1 Catalogue compatibility

The current inspected catalogue needs one enduring sprite-animation field plus one temporary rollout field. If Plan 03's richer art catalogue lands first, add them to its resolved schema and expose them through the resolver contract below rather than preserving the minimal shape as a competing authority:

```ts
export interface SpriteRolloutFallback {
  readonly src: string;
  /** Legacy URL keeps its own render metadata; it may predate the new reframe. */
  readonly naturalSize: readonly [width: number, height: number];
  readonly geometry: ResolvedBodyGeometry;
  /** Old URL is invalid once package.json version is >= this semver. */
  readonly expiresBeforeAppVersion: `${number}.${number}.${number}`;
  readonly reason: "sprite-v1-migration";
}

export interface SpriteArt {
  readonly src: string;
  readonly label: string;
  readonly animationId?: SpriteAnimationId;
  /** Error-only migration escape hatch; never preloaded. */
  readonly rolloutFallback?: SpriteRolloutFallback;
}
```

On the inspected schema, `src` is always the canonical static fallback. `animationId` points into a compile-time registry; it is not a URL and it is never constructed from user/game data. If Plan 03’s richer `variants` schema lands, add these fields to its resolved-art result rather than create a second catalogue. Unanimated art remains first-class.

`expiresBeforeAppVersion` is a parsed three-part app version, never a date/free-form tag. For a migration introduced in release `V`, set it to the immediately following planned release version. A tiny build-time helper accepts only `^\d+\.\d+\.\d+$`, parses three base-10 integer components, and compares tuples; invalid/prerelease strings fail closed, with no runtime dependency. The old URL is permitted only while `package.json.version < expiresBeforeAppVersion`; CI fails at equality or above until the field and obsolete packaged asset are removed. Unit tests cover invalid input and major/minor/patch boundaries.

Ame is a migration prerequisite, not currently such an entry: add `export const AME_ART: SpriteArt = { src: "/assets/ame.png", label: "Ame" }` in `artCatalog.ts`, make `ASSETS.ame` a compatibility alias of `AME_ART.src`, and test the resolver before any renderer migration. Kitten and goblin extend their existing `ANIMAL_ART.kitten` and `ENEMY_ART.goblin` records. “Three catalogue records” below always means this new Ame record plus those two existing records.

For an animated entry, prefer a registered neutral derivative that overlays the pre-migration `SpriteArt.src` within ±1 source pixel and produces no more than 0.25 CSS-pixel movement at the measured board size. That tolerance applies only when the existing composition can also meet the art-owned safe inset. If Plan 03 requires a visible reframe/rescale, art direction and UI approve the intentional migration at actual size and record the exception to the overlay tolerance; do not violate the safe zone to preserve a bad crop. Phase 2 atomically makes the approved neutral field rendition the entry’s new `src` **and** the manifest fallback, so feature-off/static mode does not fetch old and new neutral files. The previous URL may live only in `rolloutFallback`, is fetched only after an actual `src` error, and expires after one verified release. Soft rollback disables the feature and keeps the new approved still. Hard rollback is an atomic Phase-2 content reversal: restore prior catalogue URLs, remove animation IDs/registry entries, and remove or explicitly time-box all now-unreachable frame/source/inventory declarations. After legacy cleanup, restore the old files from the tagged prior release as part of that same rollback. CI must fail an expired fallback or both old/new active representations. This time-boxed migration reconciles reliable rollout with the performance plan’s prohibition on permanent old+new media.

### 8.2 Manifest types

Durations belong to clip steps, not frame files, so one drawing can be held for different durations in different actions. The following contract is shown together for review; in implementation `SpriteAnimationId`, `SpriteRolloutFallback`, `Normalized*`, `Resolved*Geometry`, and `ResolvedSpriteArt` live with the art-owned resolver in `src/artCatalog.ts`. Frame/clip/manifest types live under `src/animation/types.ts` and import that one-way art output, avoiding an art↔animation module cycle. The planned API is:

```ts
import type { Direction, WeaponStyle } from "../game/types";
import type { MotionMode, PresentationClockSnapshot } from "../vfx/types";

/** Availability/performance fallback, not a second user motion preference. */
export type SpriteQuality = "animated" | "static";
export type SpriteFacing = Direction | "default";
export type SpriteAnimationId = string & { readonly __spriteAnimationId: unique symbol };
export type SpriteFrameId = string & { readonly __spriteFrameId: unique symbol };
export type SpriteClipId = string & { readonly __spriteClipId: unique symbol };

export type NormalizedPoint = readonly [x: number, y: number];
export type NormalizedRect = readonly [x: number, y: number, width: number, height: number];
export type NormalizedInsets = readonly [left: number, top: number, right: number, bottom: number];

/** Reuse Plan 03's art-owned family vocabulary; do not introduce an animation enum. */
export type ArtFamily =
  | "character" | "friend" | "enemy" | "weapon" | "item"
  | "cage" | "lock" | "portal" | "reward" | "terrain"
  | "dressing" | "hazard" | "story" | "navigation" | "brand";

/** Exact art-owned compatibility output consumed by animation and other renderers. */
export interface ResolvedBodyGeometry {
  readonly pivot: NormalizedPoint;
  readonly visibleBounds: NormalizedRect;
  readonly safeInset: NormalizedInsets;
  readonly displayScale: number;
}

export interface ResolvedWeaponGeometry {
  readonly gripPoint: NormalizedPoint;
  /** 0deg points right; positive is clockwise. */
  readonly forwardAxisDeg: number;
  readonly heldScale: number;
  readonly heldRotationDeg: number;
  readonly zOrder: "behind-body" | "in-front-of-body";
  /** Legacy values may compose only with the neutral body frame. */
  readonly registration: "approved" | "legacy-static-only";
}

export interface ResolvedSpriteArt {
  readonly id: string;
  readonly family: ArtFamily;
  readonly catalogueKey: string;
  readonly label: string;
  /** One context-selected canonical runtime URL regardless of source schema. */
  readonly src: string;
  readonly naturalSize: readonly [width: number, height: number];
  readonly artVersion: number;
  readonly sourceRecordId: string;
  readonly geometry: ResolvedBodyGeometry;
  readonly weaponGeometry?: ResolvedWeaponGeometry;
  readonly animationId?: SpriteAnimationId;
  readonly rolloutFallback?: SpriteRolloutFallback;
}

export type ResolvedWeaponArt = ResolvedSpriteArt & {
  readonly family: "weapon";
  readonly weaponGeometry: ResolvedWeaponGeometry;
};

export interface HandSocket {
  /** Normalized 0..1 coordinates, origin top-left; animation owns the body socket. */
  readonly at: NormalizedPoint;
  /** CSS convention: 0deg points right, positive angles rotate clockwise. */
  readonly axisDeg: number;
}

export type SpriteRuntimeRoute = "maze-board" | "battle" | "completion" | "story";
export type SpritePreloadTier = 0 | 1 | 2 | 3;
export type SpriteReachability =
  | { readonly kind: "all-levels" }
  | { readonly kind: "authored"; readonly levelIds: readonly string[] }
  | {
      readonly kind: "authored-and-generated";
      readonly authoredLevelIds: readonly string[];
      readonly generatedSelectors: readonly {
        readonly catalogue: "animal-species" | "enemy-style" | "object-style";
        readonly value: string;
      }[];
    };

export interface SpriteRendition {
  readonly purpose: "field" | "presentation";
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly sha256: string;
  readonly encodedBytes: number;
  readonly decodedBytes: number;
  readonly owner: "sprite-animation";
  readonly sourceRecordId: string;
  readonly usage: {
    readonly routes: readonly SpriteRuntimeRoute[];
    readonly reachability: SpriteReachability;
    readonly basePreloadTier: SpritePreloadTier;
    readonly maxDisplayCssPx: readonly [width: number, height: number];
    readonly maxDpr: number;
    readonly offlineRequired: true;
  };
}

export interface SpriteFrameDefinition {
  readonly id: SpriteFrameId;
  /** Normalized art geometry is authoritative; pixel projections are generated proofs. */
  readonly pivot: NormalizedPoint;
  readonly visibleBounds: NormalizedRect;
  readonly handSocket?: HandSocket;
  readonly renditions: {
    readonly field: SpriteRendition;
    readonly presentation?: SpriteRendition;
  };
}

export type AnimationStep =
  | {
      readonly frameId: SpriteFrameId;
      readonly hidden?: never;
      readonly durationMs: number;
      /** Read-only presentation/debug marker; never a gameplay callback. */
      readonly marker?: "anticipation" | "contact" | "recoil" | "release" | "result";
    }
  | {
      readonly hidden: true;
      readonly frameId?: never;
      readonly durationMs: number;
      readonly marker: "result";
    };

export type PlaybackExit =
  | { readonly kind: "frame"; readonly frameId: SpriteFrameId }
  | { readonly kind: "hidden" };

export type ModePlaybackDefinition =
  | {
      readonly kind: "loop";
      readonly steps: readonly AnimationStep[];
      readonly expectedDurationMs: number;
    }
  | {
      readonly kind: "once";
      readonly steps: readonly AnimationStep[];
      readonly expectedDurationMs: number;
      readonly exit: PlaybackExit;
    }
  | {
      readonly kind: "hold";
      readonly frameId: SpriteFrameId;
    };

export interface ClipVariant {
  readonly full: ModePlaybackDefinition;
  readonly reduced?: ModePlaybackDefinition;
  /** Optional semantic holds for static quality; defaults to staticFrameId hold. */
  readonly static?: ModePlaybackDefinition;
  readonly staticFrameId: SpriteFrameId;
}

export interface SpriteClipDefinition {
  readonly id: SpriteClipId;
  readonly variants: Partial<Readonly<Record<SpriteFacing, ClipVariant>>>;
  readonly fallbackFacing: SpriteFacing;
  readonly compatibleWeapons?: readonly WeaponStyle[];
}

export interface AmbientInterruptionDefinition {
  readonly hostClipId: SpriteClipId;
  readonly interruptClipId: SpriteClipId;
  readonly minimumIntervalMs: number;
  readonly maximumIntervalMs: number;
  readonly seedVersion: 1;
  readonly resumeHostEpoch: "preserve";
}

export interface DirectionResolution {
  readonly sourceFacing: SpriteFacing;
  readonly mirrorX: boolean;
}

export interface SpriteAnimationManifest {
  readonly schemaVersion: 1;
  readonly id: SpriteAnimationId;
  readonly art: {
    readonly family: Exclude<ArtFamily, "weapon">;
    readonly catalogueKey: string;
    readonly artId: string;
  };
  /** Bump when canvas, proportions, pivot, or attachment contract changes. */
  readonly familyVersion: number;
  readonly canvas: {
    /** Stable logical registration space, independent of encoded rendition size. */
    readonly registrationWidth: number;
    readonly registrationHeight: number;
    readonly groundPivot: NormalizedPoint;
    readonly displayScale: number;
    readonly minimumTransparentGutter: number;
  };
  readonly fallbackFrameId: SpriteFrameId;
  readonly directionMap: Readonly<Record<Direction, DirectionResolution>>;
  readonly frames: Readonly<Record<string, SpriteFrameDefinition>>;
  readonly clips: Readonly<Record<string, SpriteClipDefinition>>;
  readonly ambientInterruptions?: readonly AmbientInterruptionDefinition[];
}

```

The branded IDs can be created by small internal helpers; exported manifest literals use `as const satisfies SpriteAnimationManifest`. Validation produces actionable paths such as `ame-v01.clips.combat.variants.default.full.steps[4]`. Weapon grip point, forward axis, held scale, held rotation, registration class, and relative z-order come only from the art-owned `ResolvedWeaponGeometry` returned by `resolveSpriteArt`; animation adds only the per-body-frame socket position/axis and compatibility list. MVP weapon z-order is fixed for the whole approved weapon family. A pose that needs a weapon to cross behind the torso must use an art-approved occluding body/foreground treatment or wait for a jointly versioned geometry extension; it cannot add an ad hoc frame `layer` override. Generated 512-registration pixel overlays are proofs, not a second geometry source.

The generated performance-owned runtime inventory cross-resolves every rendition with its source record and materializes owner, route, authored level IDs, generated-catalogue selector capability, effective preload tier, byte/hash/dimension data, maximum CSS size/DPR, theoretical decoded bytes, and offline requirement. Ame declares `all-levels`; kitten/goblin declare exact authored IDs plus `animal-species: kitten` / `enemy-style: goblin`. Surprise Maze IDs are unbounded, so the inventory validates those selectors exhaustively against the generator’s finite `ANIMAL_SPECIES`/`ENEMY_STYLE_IDS` catalogues; at runtime the existing current-`LevelDefinition` collector resolves the concrete family. The per-rendition `usage` block is the source declaration; the generated inventory is the reachability/deployment proof. CI rejects an unknown selector/dynamic URL, an unreachable/orphan rendition, a missing source record, or disagreement between the two.

Canvas values remain numeric so later object families are not forced into one logical size. MVP Ame, kitten, and goblin use a 512 × 512 **virtual registration space**, but their default field rendition is an untrimmed 256 × 256 lossless WebP. `8 / 512` (four encoded pixels at 256; eight at 512) is only the hard transparent encoder/perimeter minimum; Plan 03’s art-owned `safeInset` is the stronger composition rule and must also pass. A 512 presentation rendition is allowed only when a specific UI/presentation proof needs it; never preload both renditions for one consumer. A later measured trim optimization can add normalized trim metadata without changing semantic IDs. Do not implement trimming in the first renderer.

Plan 02 is the canonical owner of shared presentation types in `src/vfx/types.ts`. Before sprite integration, extend its numeric-ID contract rather than create `src/presentation/types.ts`:

```ts
export interface PresentationClockSnapshot {
  readonly runId: number; // exactly PresentationRun.id
  readonly elapsedAtSampleMs: number;
  readonly sampledAtMs: number; // performance.now() time origin
  readonly signal: AbortSignal;
}

export interface PresentationRun {
  readonly id: number;
  readonly signal: AbortSignal;
  readonly channel: VfxChannel;
  readonly clock: PresentationClockSnapshot;
  readonly releaseInputLock: () => void;
  cancel(reason: CancellationReason): void;
}
```

`presentationDirector.ts` constructs the snapshot and asserts `clock.runId === run.id` and `clock.signal === run.signal`; the sprite adapter receives only `clock`, never `cancel()` or `releaseInputLock()`. `MotionMode` is imported from the same module. This explicit Plan-02 API amendment is a Phase-1 cross-plan gate.

### 8.3 Playback request and renderer

```ts
export interface SpritePlaybackRequest {
  readonly clipId: SpriteClipId;
  readonly facing: Direction;
  /** Changes only when this semantic occurrence changes. */
  readonly playbackId: string | number;
  readonly motionMode: MotionMode;
  readonly spriteQuality: SpriteQuality;
  readonly stableInstanceId: string;
  readonly timing:
    | { readonly owner: "ambient"; readonly epochMs: number }
    | {
        readonly owner: "local-input";
        readonly startedAtMs: number;
        /** Visual-only lifecycle; never a gameplay/input-lock signal. */
        readonly signal: AbortSignal;
      }
    | {
        readonly owner: "presentation-director";
        /** Read-only view; deliberately excludes cancel/releaseInputLock methods. */
        readonly clock: PresentationClockSnapshot;
      };
}

export type SpriteAccessibility =
  | { readonly decorative: true; readonly alt?: never }
  | { readonly decorative: false; readonly alt: string };

export type SpriteRendererProps = SpriteAccessibility & {
  readonly art: ResolvedSpriteArt;
  readonly playback?: SpritePlaybackRequest;
  readonly paused?: boolean;
  readonly visible?: boolean;
  /** Defaults to field; presentation must be explicitly proven/available. */
  readonly renditionPurpose?: "field" | "presentation";
  readonly weapon?: { readonly art: ResolvedWeaponArt; readonly style: WeaponStyle };
  readonly className?: string;
};

export type SpriteFallbackReason =
  | "reduced-static"
  | "quality-static"
  | "missing-clip"
  | "missing-direction"
  | "incompatible-weapon"
  | "legacy-weapon-static"
  | "missing-weapon-socket"
  | "missing-rendition"
  | "missing-frame"
  | "missing-manifest"
  | "feature-disabled"
  | "asset-not-ready"
  | "decode-failed"
  | "canonical-src-failed"
  | "rollout-ineligible"
  | "rollout-src-failed";

export type SpriteAssetState = "unrequested" | "loading" | "decoded" | "failed";

export type ResolvedSpriteBody =
  | {
      readonly kind: "image";
      readonly src: string;
      readonly frameId?: SpriteFrameId;
      readonly renditionPurpose: "field" | "presentation";
      readonly naturalSize: readonly [width: number, height: number];
      /** Selected frame/canonical/rollout geometry, including its own displayScale. */
      readonly geometry: ResolvedBodyGeometry;
      /** True for canonical/rollout loading; CSS silhouette remains underneath. */
      readonly placeholderUnderlay: boolean;
    }
  | {
      readonly kind: "code-placeholder";
      readonly shape: "neutral-silhouette";
      readonly geometry: ResolvedBodyGeometry;
    }
  | {
      readonly kind: "hidden";
    };

export interface ResolvedWeaponTransform {
  readonly kind: "attached";
  readonly src: string;
  readonly gripAtSocket: NormalizedPoint;
  readonly translateRegistrationPx: readonly [x: number, y: number];
  readonly rotateDeg: number;
  readonly scale: number;
  /** Computed from art-owned ResolvedWeaponGeometry, never from a frame. */
  readonly layer: "behind-body" | "in-front-of-body";
  readonly mirrorWithComposite: boolean;
}

export interface ResolvedLegacyWeaponOverlay {
  readonly kind: "legacy-static-overlay";
  readonly src: string;
  readonly style: WeaponStyle;
  /** Uses the tested pre-migration neutral placement; never an action socket. */
  readonly registration: "current-neutral-css";
}

export type ResolvedWeaponPresentation =
  | ResolvedWeaponTransform
  | ResolvedLegacyWeaponOverlay;

export interface ResolvedSpriteFrame {
  readonly body: ResolvedSpriteBody;
  readonly mirrorX: boolean;
  /** Ordered reasons taken; empty means the requested frame resolved directly. */
  readonly fallbackPath: readonly SpriteFallbackReason[];
  /** Absolute monotonic paint boundary; absent for a hold/final/placeholder. */
  readonly nextFrameAtMs?: number;
  readonly weapon?: ResolvedWeaponPresentation;
}
```

`SpriteRenderer` owns a fixed inner registration box. The outer `player-layer`, `world-object-layer`, battle transform, follower transform, or UI slot continues to own position and spatial motion. The renderer emits one body `<img>` (or its terminal code-native placeholder) plus an optional weapon `<img>`; both are selected and transformed from one immutable frame result before commit. The result's complete `geometry` is the only renderer input for pivot, bounds, safe inset, and display scale: animated frames receive manifest/frame geometry, canonical stills receive `ResolvedSpriteArt.geometry`, and rollout stills receive their independent fallback geometry.

`ResolvedSpriteArt` is the exact boundary, not an intersection with whichever catalogue happens to exist. Art/catalogue owns `resolveSpriteArt(id, context): ResolvedSpriteArt` in `src/artCatalog.ts`. Against current HEAD it adapts the minimal `src`/`label` entries plus generated approved natural size/geometry and the new `AME_ART`; after Plan 03 it selects one `variants` entry and maps the richer record into the same output. Canonical `src` uses `ResolvedSpriteArt.naturalSize` and `.geometry`; the old rollout URL uses its own `rolloutFallback.naturalSize` and `.geometry`, so a permitted neutral reframe cannot misregister the legacy still. Plan 03's sample `ArtGeometry` must be amended to include `displayScale`; weapon records must supply every exact `ResolvedWeaponGeometry` field above; and its `ArtFamily` remains the single vocabulary. Until those art-owned values and source records are approved for every reachable weapon, the renderer may not replace that weapon's legacy static overlay. Animation imports this resolved type and cannot synthesize geometry in components or CSS.

The required pure selector is:

```ts
selectSpriteFrame(input: {
  readonly manifest?: SpriteAnimationManifest;
  readonly art: ResolvedSpriteArt;
  readonly request?: SpritePlaybackRequest;
  readonly nowMs: number;
  readonly featureEnabled: boolean;
  /** Parsed/validated build version used only for rollout expiry. */
  readonly appVersion: `${number}.${number}.${number}`;
  /** Missing keys are `unrequested`; optional animation frames require `decoded`. */
  readonly assetStates: ReadonlyMap<string, SpriteAssetState>;
  readonly renditionPurpose: "field" | "presentation";
  readonly weapon?: { readonly art: ResolvedWeaponArt; readonly style: WeaponStyle };
}): ResolvedSpriteFrame;
```

For ambient/local input it computes elapsed from the monotonic epoch/start. The animation-owned local-playback adapter creates one visual-only `AbortController` per `playbackId`; on document hide, level/navigation change, supersession, or unmount it aborts and the selector immediately returns that once-clip's declared exit. The signal cannot cancel gameplay, input, sound, or a director run, and an aborted occurrence stays terminal on return; a new `playbackId` receives a new controller. For a live director-owned one-shot the selector computes `clock.elapsedAtSampleMs + max(0, nowMs - clock.sampledAtMs)` from the director's shared monotonic snapshot, capped by the director plan; every scheduled paint passes a fresh `nowMs`, so it cannot reuse a stale React snapshot. The director publishes a new snapshot/run when its origin changes and `clock.signal` supplies the terminal transition. The selector uses cumulative durations, applies modulo only for loops, and clamps/returns the declared result for one-shots. It never advances “one frame per callback,” which avoids refresh-rate drift. `playbackId` keys lifecycle/reset behavior; director requests use the stable numeric `clock.runId`, local requests use the stable gameplay presentation/object ID plus occurrence counter, and unrelated React renders do not restart a clip. Filenames and row-major tile positions are never identities.

State interpretation is deterministic: an optional manifest frame is selectable only at `decoded`; `unrequested`/`loading` records `asset-not-ready`, while `failed` records `decode-failed`, then selection falls through without visual pop. A missing clip, incompatible weapon, legacy-only weapon, or absent socket records its matching reason above. Canonical `art.src` and an eligible rollout URL may be returned at `unrequested` or `loading` so native loading can begin, but `placeholderUnderlay` stays true until decoded; `failed` skips that URL. A missing, expired, or invalid-version rollout records `rollout-ineligible`; an attempted failed URL records `rollout-src-failed`. `featureEnabled: false` bypasses the manifest before any decode request. Art with no `animationId` and no animation playback request takes the canonical still as a direct supported path, not `missing-manifest`. `fallbackPath` records every ordered fallback branch actually taken, in order; an unavailable branch that is not reached records nothing, and direct success is empty.

### 8.4 Deterministic fallback ladder

Resolve in this exact order. If `featureEnabled` is false, record `feature-disabled` and jump directly to step 7 without inspecting a manifest or scheduling an optional decode:

1. If the manifest is absent/invalid, record `missing-manifest` and go to step 7. Otherwise validate the requested clip. A missing/invalid clip records `missing-clip` and leaves only the manifest fallback candidate for step 5. For a valid clip, resolve `directionMap[request.facing]` **before** looking up its variant; retain the returned `mirrorX` only if that source-facing variant exists.
2. If the mapped variant does not exist, record `missing-direction` and try the clip's `fallbackFacing` with `mirrorX: false`; a fallback is never implicitly mirrored. If neither exists, leave only the manifest fallback candidate for step 5.
3. Classify weapon composition without inspecting a body socket yet. An incompatible style records `incompatible-weapon`; a `legacy-static-only` record records `legacy-weapon-static`. Either classification replaces the action candidate list with manifest neutral/fallback and selects `legacy-static-overlay`. An action-compatible `approved` weapon remains pending attachment. No weapon proceeds without a resolved art record.
4. For a valid variant, select `full` when shared `MotionMode` is full and sprite quality is animated; select explicit `reduced` (or a `staticFrameId` hold) when motion is reduced; select explicit `static` semantic playback (or a `staticFrameId` hold) when sprite quality is static. Resolve the semantic step from elapsed time. A hidden step/result needs no rendition or weapon and returns immediately.
5. Build and walk a finite body-candidate list in this order: selected semantic frame's requested rendition, that frame's field rendition, the variant's meaningful `staticFrameId` requested/field rendition if distinct, then manifest `fallbackFrameId` requested/field rendition if distinct. Missing metadata records `missing-rendition`/`missing-frame`; an unrequested/loading URL records `asset-not-ready`; a failed URL records `decode-failed`. Missing clip/direction starts at the manifest fallback candidate. There is no recursive retry.
6. Only after an available body frame is selected, resolve weapon attachment. A pending approved weapon requires that frame's `handSocket`; if absent, record `missing-weapon-socket` and continue through the remaining static/manifest candidates from step 5. The first available candidate with a socket produces `kind: "attached"`. If every candidate lacks a valid socket, go to step 7 and return canonical Ame with `legacy-static-overlay`. An incompatible/legacy weapon returns the already-selected neutral body plus its legacy overlay. Never omit an acquired weapon because socket data is missing, and never synthesize a socket.
7. Use the art-owned canonical static URL (`SpriteArt.src` in the inspected schema) after an exhausted manifest candidate list, missing/invalid manifest, incompatible terminal data, or feature disable. It carries canonical natural size/geometry. In migrated families this is the same approved neutral rendition, so normal operation never loads duplicate neutral media; an armed fallback uses `legacy-static-overlay`.
8. If and only if that canonical `src` errors during the one-release migration window, try `rolloutFallback.src` once using the rollout record's own natural size/geometry.
9. If canonical art and the permitted rollout URL are absent, expired, or failed, return `ResolvedSpriteBody.kind = "code-placeholder"`: a stable, namespaced CSS neutral silhouette using canonical geometry. It is decorative on the board, adds no changing text, and leaves the existing semantic label/live region authoritative. Preserve the legacy static weapon overlay for an acquired weapon unless that weapon URL itself failed; the existing game already owns that final prop failure behavior.

An `img.onerror` marks only that URL `failed` for the current loader generation and reruns the pure selector: an animation frame moves to canonical `src`, canonical moves to the error-only rollout URL, and rollout moves to the code placeholder. It reports a deduplicated development diagnostic and never recursively retries a broken URL. The structural silhouette underlay prevents an empty box while a canonical/rollout image is loading and stays as the terminal result after both fail.

### 8.5 Clock and React isolation

Use one shared discrete-deadline scheduler for ambient and short local-input clips, not one permanent 60 Hz loop per sprite. PresentationDirector remains the sole lifetime/cancellation/time authority for combat, rescue, jump, portal, door, treasure, and victory:

1. Each active renderer registers its next frame boundary.
2. A shared timer sleeps until the earliest ambient/local boundary; one `requestAnimationFrame` commits at the next paint and uses the supplied timestamp.
3. A director-owned sprite consumes the director’s monotonic snapshot, run ID, and `AbortSignal`; it may register a discrete paint boundary but cannot create, extend, finish, abort, or release the set-piece run.
4. The shared app visibility provider owns the single document listener. On hide, `PresentationDirector` alone aborts director-owned transients with `visibility-hidden`, publishes the semantic final recipe, and releases its input lock; sprites only consume that abort/final recipe. The animation local-playback adapter separately aborts its visual-only signals so step/blocked/pickup/power occurrences select their declared exits, and the scheduler unregisters their deadlines. Ambient deadlines pause and epochs rebase on return. Neither class of one-shot catches up or resumes.
5. A renderer cleanup only unregisters its scheduler/visibility/motion/director/decode subscriptions and its local timer/rAF. The shared providers remove their document/media listeners when their own application lifetime ends; no sprite component installs or removes them. This is symmetrical in React Strict Mode and normal unmount.

Define deterministic ambient offsets rather than calling `Math.random()`: `hash32(stableInstanceId) % clipDuration` supplies idle phase; blink interval N is `3_600 + (hash32(stableInstanceId + ":blink:" + N) % 2_601)` ms. The shared `hash32` implementation and its test vectors are versioned so a rerender/reload with the same instance ID does not reshuffle acting.

This follows browser guidance to use the `requestAnimationFrame` timestamp rather than assuming a refresh rate and React’s requirement for symmetrical Effect cleanup ([MDN: `requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame), [React: `useEffect`](https://react.dev/reference/react/useEffect); accessed 2026-09-02). It also aligns with the concurrent VFX plan’s single `PresentationDirector`: the sprite clock owns paint deadlines, never a second screenplay.

Do not expose an `onContact` or `onFinished` gameplay callback from the renderer. VFX, audio, numbers, and frames independently read the same presentation plan/timestamp; animation cannot become a hidden authority.

## 9. State and event mapping

### 9.1 Presentation adapter

Add a pure `resolveSpritePlayback` adapter between `App` presentation state and `SpriteRenderer`. It accepts the already-selected active presentation plus persistent modifiers such as `hasSword`, last requested direction, and successful movement parity. It does not consume raw engine events or enqueue gameplay actions.

| Current signal | Animation request | Playback identity/start | Notes |
|---|---|---|---|
| No active action | `idle` | Stable per mount/level epoch | Internal blink interruption is idle-only and deterministically seeded. |
| Successful `moved` result | `step-a` / `step-b` | `movePulse`; start captured with movement commit | Alternate only after success. Persist last requested facing in presentation state/ref; reload defaults to `down`. |
| `blocked` result | `blocked` | `bumpPulse` | Can restart while prior visual settles; no control lock extension. |
| Sword picked / `hasSword` | persistent `armed` modifier | State-derived | Weapon overlay is not a competing one-shot. |
| `sword-collected` | `pickup-weapon` | event/presentation sequence ID; `local-input` start captured with the committed event | 420 ms, skipped/superseded if a director set piece owns Ame; the armed outcome is already committed. |
| `potion-collected` | `power-up` | event/presentation sequence ID; `local-input` start captured with the committed event | 420 ms, skipped/superseded if a director set piece owns Ame; Power is already committed. |
| Other pickup event | semantic static/armed result in MVP | event/presentation sequence ID | No generic `pickup` clip is invented; add an authored mapping in Stage 3. |
| `battlePresentation` | `combat` | battle presentation ID and captured start | Exact 2,220/180 ms plan. |
| `rescuePresentation` | `rescue-joy`; friend `release` | rescue presentation ID/start | Current cage split and hop remain outer presentation effects. |
| `jumpPresentation` | static/current in MVP; `jump-*` in Stage 3 | jump presentation ID/start | Uses `src/jumpPresentation.ts`. |
| `portalPresentation` | static/current in MVP; `portal-arrive` in Stage 3 | portal presentation ID/start | Uses current destination-arrival semantics. |
| Completion modal | `victory` | completion ID | UI owns whether/where Ame is displayed. |
| Story line | portrait fallback in MVP | story beat ID later | Stage 4 requires an explicit authored emotion field. |

Within the board-player slot, the adapter’s visual priority is active combat/rescue/jump/portal/door presentation, then blocked, pickup, step, blink, idle. “Armed” modifies any compatible body frame rather than winning priority. Victory belongs to the completion UI slot, not the board arbitration stack.

The current event branch explicitly serializes jump + rescue and jump + door; preserve those sequences. Current `HEAD` drops portal-arrival visuals when jump and portal coincide, so feature-off characterization must lock that baseline until the Plan-02 composite is integrated. In Stage 3, consume Plan 02's director-owned jump-landing→portal-departure run exactly: jump reaches its landing contact on the destination tile, then portal departure begins from that landing tile, with each engine event and announcement occurring once and in the existing gameplay order. The sprite adapter selects frames inside that run; it neither emits a second event nor changes ordering. `level-won` continues to use the current modal gate.

Animation must not create, lengthen, or release input locks. It consumes the canonical `InputContext`/`getInteractionPolicy` contract when that concurrent controls/gameplay work lands. Step and blocked clips may outlive the existing 64/45 ms gates and may be visually superseded; combat/rescue locks are PresentationDirector-owned.

State machines are a good model for separating idle/walk/action identity from playback progress, but the game state remains authoritative ([Unity, state machine basics](https://docs.unity3d.com/6000.0/Documentation/Manual/StateMachineBasics.html), [Godot, `AnimatedSprite2D`](https://docs.godotengine.org/en/stable/classes/class_animatedsprite2d.html); accessed 2026-09-02).

### 9.2 Facing and mirroring

- Use the existing `Direction` vocabulary (`up/down/left/right`) at the adapter boundary.
- MVP Ame, kitten, and goblin have only `default` artwork; all four directions explicitly resolve to it with `mirrorX: false`.
- Ame’s flower, backpack, hair balance, and weapon handedness make implicit mirroring unacceptable.
- A later family may map left to an authored right frame with `mirrorX: true` only after art direction approves costume, light, handedness, and weapon silhouette. Mirror the body/weapon composite, not one layer alone.
- Presentation-facing changes on a requested blocked move so the reaction addresses the obstacle. It changes on a successful move as well. It is presentation state, not a new gameplay rule; reloading a level deterministically restores `down`.

### 9.3 DOM, transform, and stylesheet ownership

Use this nesting/layer contract after re-reading the implementation-phase `HEAD`:

```text
entity root                         gameplay: tile/world position
├─ contact/cast shadow siblings     lighting
├─ presentation transform wrapper   PresentationDirector/VFX: travel, recoil, arrival
│  └─ sprite secondary motion       animation: approved idle/step personality only
│     └─ registration box           animation: normalized pivot and fixed scale
│        ├─ weapon slot, if behind   ResolvedWeaponGeometry chooses z-order; animation attaches
│        ├─ body frame               animation composite
│        └─ weapon slot, if in front ResolvedWeaponGeometry chooses z-order; animation attaches
└─ aura/contact-effect siblings      VFX
```

- Jump/travel exposes normalized `--entity-lift`; lighting consumes it for shadow response. Animation does not draw or animate the cast shadow.
- Never use a body/shadow pseudo-element as a sprite-animation surface; current pseudo collisions are a known cascade problem.
- `visualPersonality` may animate only the namespaced secondary-motion wrapper and only when its compatibility table permits. Movement, blocked, combat, rescue, jump, and portal suppress ambient bob/squash so two systems never transform the same element.
- Structural registration/body/weapon/fallback rules live in animation-owned `src/styles/sprite-animation.css`, imported in the UI-declared cascade. Per Plan 01, every `@keyframes`, `animation`, transition, and secondary-motion declaration lives in UI-owned `src/styles/motion.css`; animation contributes namespaced rules there through UI review. Do not append a late global block to `src/styles.css` or write into VFX-owned `src/vfx.css`.
- Exactly one of the two weapon slots is mounted for a composite, based on art-owned family geometry; their presence in the tree documents possible placement, not a frame-owned layer switch.

## 10. Asset format decision

| Asset family | MVP/runtime choice | Why | Revisit condition |
|---|---|---|---|
| Ame, friends, enemies | Separate lossless WebP files; field-256 by default, presentation-512 only by proof | Existing DOM `<img>` path, selective decode, per-state failure/rollback, measured 26–31% savings versus current PNGs. | Per-family sheet only after real approved frames show a material win. |
| Weapon overlays | Existing separate alpha image, with grip metadata; future conversions may be lossless WebP | Needs independent attachment and reuse across body frames. | No sheet unless renderer architecture changes. |
| Event-synchronized objects | Separate lossless WebP when added | Exact state seeking and reduced-frame selection. | Same measured threshold. |
| Tiny always-loaded object loop | Separate files initially | Keeps one asset/renderer path and rollback simple. | Twelve frequently co-loaded frames trigger a benchmark only; shipping a state-local sheet still requires at least 15% measured transfer improvement including metadata/padding. |
| Source masters | Layered/native source when available plus flattened RGBA PNG review master | Lossless editability, masks, and provenance. | Never replace the source master with runtime WebP. |
| Animated WebP/APNG/GIF | Prohibited for stateful gameplay | Browser-owned time makes seeking, contact sync, cancellation, reduced motion, and deterministic fallback weaker. | None without a new architecture review. |
| Global atlas | Prohibited | Couples download, decode, cache invalidation, and rollback across unrelated levels/families. | None for the current DOM renderer. |

Modern multiplexed delivery weakens the old “one request at all costs” sprite-sheet argument; atlas batching wins from game-engine texture renderers do not automatically apply to DOM `<img>` elements ([web.dev, CDNs and HTTP/2](https://web.dev/articles/content-delivery-networks), [Unity Sprite Atlas](https://docs.unity3d.com/2018.3/Documentation/Manual/class-SpriteAtlas.html); accessed 2026-09-02). If a future sheet qualifies, it is family/state-local, uses at least two pixels of extrusion/separation, and carries source-size, rectangle, pivot, and attachment JSON ([TexturePacker settings](https://www.codeandweb.com/texturepacker/documentation/texture-settings); accessed 2026-09-02).

## 11. Alignment, naming, and validation standards

### 11.1 Coordinate and scale contract

- Canonical geometry uses art-owned normalized 0..1 coordinates. Origin is top-left; +x right, +y down. Generated proof reports may project them into 512-registration and rendition pixels, but those projections are not editable authority.
- MVP registration space: untrimmed logical 512 × 512. Default encoded field rendition: 256 × 256. A consumer chooses one rendition; it never downloads both.
- World pivot: one art-approved bottom-center ground/foot point locked for the whole family version. All frames render this normalized pivot at the same CSS point.
- Family display scale: one value independent of each frame’s alpha bounds. Never fit each frame to its own content box.
- Baseline tolerance: ground-contact landmark within ±1 pixel in the 512 registration projection (±0.5 encoded field pixel).
- Expression-only tolerance: unchanged pixels outside the approved, two-registration-pixel-dilated edit mask must be byte-identical in the source master; head/eye registration within ±1 registration pixel after processing.
- Pose-change tolerance: approved head-center drift no more than 2% of canvas unless the pose sheet explicitly calls for it; overall body scale no more than 2% drift. Silhouette exceptions require an art-direction note.
- Art safe inset: use Plan 03's authoritative normalized safe inset—grounded actors 8% left/right/top and 6% bottom; friend-behind-cage 10% sides/top and 6% bottom; weapons 8% around the rotated extent. A different v01 legacy inset requires a source-record exception approved by art direction and applied consistently to the whole family.
- Transparent encoder gutter: normalized minimum `8/512` on every edge for body-only frames, equivalent to four pixels at field-256 and eight at presentation-512. This catches interpolation/edge contamination but never weakens the larger art safe inset. Reject clipped hair, limbs, recoil, or weapon and process neutral through the same registration transform as every pose.
- Review composites: checkerboard, white, near-black, warm floor, cool floor, and all actual-size targets in section 11.3.

The current Ame alpha reaches logical y=7, so it fails the encoder gutter by one registration pixel **and** fails Plan 03’s stronger top safe inset. Phase 0 must choose one art-approved result for all v01 frames: reframe/rescale into the canonical safe zone and accept the documented visual migration, or record an exact legacy `safeInset` exception plus crop envelope in the shared source record. A one-pixel nudge alone is not sufficient. Do not mix differently registered derivatives inside one clip.

The two MVP weapon overlays also fail the nominal 8% all-edge weapon inset at current runtime resolution: Star Sword's measured nonzero-alpha bounds are `(48, 17)–(463, 495)` in its 512 image and Comet Spear's are `(28, 4)–(505, 508)`. Phase 0 must create/complete their art-owned source records and either approve a non-destructive re-registration or record an exact per-weapon legacy safe-inset/content-envelope exception. Each exception includes source/runtime hash, measured bounds, approved rotated extents, compatible Ame poses, and clipping proofs at every section-11.3 size/DPR. It does not waive the hard final encoder gutter for newly emitted derivatives, does not silently weaken the whole weapon family, and does not add a weapon derivative to the 16-frame MVP count.

### 11.2 Pivot and weapon attachment

Each body frame that may display a weapon declares an animation-owned normalized `handSocket`. The art catalogue’s resolved record owns `gripPoint`, `forwardAxisDeg`, `heldScale`, `heldRotationDeg`, and `zOrder`. Weapon and socket angles use CSS convention—0° points right and positive rotation is clockwise—and are distinct from lighting azimuth. The renderer computes a single transform that:

1. places the weapon grip on the body socket;
2. rotates by `socket.axisDeg - weapon.forwardAxisDeg + weapon.heldRotationDeg`;
3. applies `weapon.heldScale`;
4. applies the single art-owned weapon-family z-order (never a per-frame override); and
5. applies any approved whole-composite mirror after attachment.

Body and weapon update atomically from the same `ResolvedSpriteFrame`. A clip lists compatible weapon styles. MVP acceptance requires actual-size composites for comet spear in Shiny Sword and star sword in the first level/tester. Every currently reachable weapon still needs an art-resolver record before its render site migrates: the two action-compatible weapons receive approved geometry, while the other six are explicitly `legacy-static-only`. Those six deliberately resolve action requests to neutral Ame plus `legacy-static-overlay` (the exact pre-migration neutral placement)—or remain on the pre-migration outer-overlay site until that resolver record exists. A compatible clip's static and canonical neutral frames must have approved sockets; missing data fails manifest validation, while the runtime terminal defense retains the legacy overlay. No path guesses a socket or silently hides an acquired weapon.

### 11.3 Silhouette and acting review

- Read action from a one-color silhouette before reviewing facial detail. Required CSS-size proofs are 51, 63, 84, 103, 108, and 112 px for board/UI regimes; art-critical actor proofs are 64 and 84 px; friend-behind-cage proofs are 40, 56, and 84 px. Capture at DPR 1, 1.25, 1.5, and 2. VFX integration additionally inspects ≥78, 48–77, and ≤47 px bands.
- Contact must be distinct from wind-up and recovery with no onion-skin ambiguity.
- The blocked drawing is a readable symmetric brace; only the outer presentation recoil moves away from the requested direction and remains gentle.
- Goblin hit/surrender must communicate surprise and friendship, not pain, collapse, or death.
- Kitten worried and joy must remain the same individual; worry is hopeful and age-appropriate.
- No frame may contain baked motion blur, particles, impact flash, wall light, or board-colored rim light. Those belong to VFX/lighting.

### 11.4 Alpha and color standard

- Convert to sRGB, remove EXIF/ICC surprises deterministically, and resize in premultiplied-alpha space with Lanczos.
- Decontaminate only edge-connected checker/chroma background. Never erase an internal costume color because it resembles the backdrop.
- Runtime alpha/RGB policy follows Plan 03: deterministically dilate nearest subject RGB 2–4 runtime pixels beneath transparent edge texels so resampling does not pull a dark/chroma halo; alpha itself remains zero there. Fully transparent pixels beyond the declared dilation ring are RGB `(0,0,0)`. Lossless WebP uses method 6 and exact transparent-color handling, and the dilation width/algorithm is recipe-versioned.
- Reject checker/chroma contamination, nontransparent perimeter pixels, isolated alpha dust outside the approved silhouette, and colored halos visible on any review background.
- Compute `visibleBounds` at alpha ≥8/255 after processing. Alpha 1–7 is reported as the resampling fringe, may extend at most two encoded pixels outside those bounds, and is forbidden in the outer four encoded pixels. Values below 2/255 are deterministically clamped to alpha zero before the final dilation pass; source records capture the threshold. Require all four outer field pixels (eight at presentation-512) to have alpha zero after that pass. Record opaque/partial/fringe counts and content bounds; do not accept only “image has an alpha channel.”

Lossless WebP supports alpha and generally improves transfer size, but tooling can alter RGB under fully transparent pixels unless exact handling is selected ([MDN image formats](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types), [Google WebP FAQ](https://developers.google.com/speed/webp/faq), [`cwebp` docs](https://developers.google.com/speed/webp/docs/cwebp); accessed 2026-09-02).

### 11.5 File names, versions, and provenance

Runtime pattern:

```text
public/assets/sprites/<catalogue-key>/
  v<artNN>/
    <art-id>-v<artNN>-anim-<state>-<facing>-field-256-r<derivativeNN>-<sha8>.webp
    <art-id>-v<artNN>-anim-<state>-<facing>-presentation-512-r<derivativeNN>-<sha8>.webp  # only when approved
```

Example: `public/assets/sprites/ame/v01/ame-v01-anim-combat-contact-default-field-256-r01-a1b2c3d4.webp`.

Source pattern:

```text
docs/source-assets/<source-family>/<art-id>/v<artNN>/
  <art-id>-v<artNN>-original.png
  <art-id>-v<artNN>-master.png
  <art-id>-v<artNN>-editable.<native>  # optional; format recorded in source JSON
  <art-id>-v<artNN>-model-sheet.png
  poses/<art-id>-v<artNN>-anim-<state>-pose.png
  frames/<art-id>-v<artNN>-anim-<state>-f<NN>.png
  <art-id>-v<artNN>-source.json
```

Keep identity fields distinct and generate paths from them; never infer one by splitting another:

| Family | Existing catalogue key | Plan-03 art ID / filename stem | Animation manifest ID | Source family/path |
|---|---|---|---|---|
| `character` | `ame` (new `AME_ART`) | `ame` | `ame-v01` | `characters/ame/v01` |
| `friend` | `kitten` (`ANIMAL_ART`) | `animal-kitten` | `kitten-v01` | `friends/animal-kitten/v01` |
| `enemy` | `goblin` (`ENEMY_ART`) | `goblin` | `goblin-v01` | `enemies/goblin/v01` |

`-anim-<state>-<facing>` is an explicit shared-schema extension of Plan 03’s `<art-id>-vNN-*` naming, not a second convention; approve it with the art owner before Phase 0 outputs. Do not maintain a second animation-only provenance or inventory manifest.

`original` is immutable recovered/generated evidence; `master` is the normalized approved working image derived by the source-record recipe. Never relabel a recovered generation as `master` unless hashes prove it is byte-identical and art direction explicitly records that one file fulfills both roles. Preserve an available layered/native editable beside them without making its proprietary format a CI dependency.
- Semantic animation IDs are stable even when a pixel-correction hash changes.
- Never overwrite a public URL with different pixels; change the content hash.
- Bump art `vNN` whenever visible pixels/silhouette change; bump derivative `rNN` for encoder/recipe-only rebuilds. Bump animation `familyVersion` when registration space, clip/pivot/socket/direction contract, or timing semantics change. A proportion/pivot redesign can require both art and family bumps.
- The art source record stores identity-master SHA-256, pose input SHA-256, tool/model/version, exact prompt, mask hash, date, selected candidate lineage, cleanup author/reviewer, recipe version, and derivative hashes.
- Raw rejected generations remain user-scoped/ephemeral. Only an approved identity/model source, cleaned source frames, manifests, and deterministic runtime outputs enter the repository during implementation.

## 12. ImageGen, source-master, and processing workflow

### 12.1 Planning assay result

Two precise-edit assays were run against the current Ame art, with no output added to the repository:

1. **Blink assay:** current `public/assets/ame.png` was the reference; prompt locked transparency, canvas, pose, crop, costume, palette, lighting, proportions, and silhouette and asked only for closed eyelids. The output globally redrew hair, face, clothing, scale, and silhouette and did not preserve the requested 512 × 512 delivery contract.
2. **Walk/contact assay:** current Ame plus `ame-sword.png` as a supporting identity reference, with an explicit foot-contact pose and no weapon requested. The output again redrew the model, changed scale/details, and appeared to bake a checkerboard-like backdrop.

Conclusion: prompt-only ImageGen editing is not a reliable pixel-identity production step for this asset. It is useful for disposable pose exploration when constrained by an immutable identity master and explicit pose sketch. It is not the finishing tool, should not pack a sheet, and must not be asked to derive frame N+1 from generated frame N.

That result is consistent with OpenAI’s own note that precise editing is improved but remains imperfect and with research treating cross-pose character identity as a distinct hard problem ([OpenAI, 2025](https://openai.com/index/new-chatgpt-images-is-here/), [The Chosen One, 2023](https://arxiv.org/abs/2311.10093); accessed 2026-09-02).

### 12.2 Phase-0 identity-source gate

The audit recovered a 1254 × 1254 RGBA high-resolution Ame source in the user-scoped generated-image store with SHA-256:

```text
9abf1df3d5b4f383a4d66d8e9f39f05f867caa0bfe1962f5a1e9f5d44647f498
```

It is not currently checked in. Before any production generation:

1. Locate the file by hash, visually compare it to `public/assets/ame.png` and the current portrait, and have art direction approve it as a legacy identity source. The shared art plan targets 2048 character masters and 1536 friend/enemy masters; 1254 is evidence, not automatic permission. Art direction must approve a documented legacy-resolution exception or reconstruct a compliant master without identity drift.
2. Copy it during the implementation phase into the immutable `ame-v01-original.png` evidence slot specified above; never reference the user path from a manifest or script.
3. Record the original hash and exact deterministic crop/scale/cleanup that produces the separately approved normalized `ame-v01-master.png` and `ame.neutral`.
4. If it fails identity review, stop and reconstruct/approve a master first. Do not generate poses from only the 512 runtime file and hope to reconcile them later.

Two more 1254 × 1254 RGBA candidates were recoverable in the user-scoped store:

- kitten: 1,324,815 bytes, SHA-256 `49caaadfd9cbe7d6429d2f9f88d6c549fa971b0223fd23bd67626a1365d46f34`;
- goblin: 1,349,899 bytes, SHA-256 `5bce3fb83488db8c94164ea4d5d154a38da3a64374667060fd974a9539602ba7`.

Each receives the same locate-by-hash, current-runtime comparison, archive, art approval, and 1536-master gate. Goblin still has no checked-in same-stem master; this candidate is evidence, not an approved or durable dependency. If any candidate fails identity review, reconstruct and approve a compliant master before its family proceeds.

### 12.3 Reliable authoring sequence

1. **Lock identity.** Approve identity master, front-view model sheet, palette swatches, costume-detail checklist, landmark overlay, neutral silhouette, ground pivot, and default hand socket.
2. **Board the keys.** Draw a simple black silhouette/line-of-action pose target for each unique extreme. Review the whole clip as pose cards at 103 px before rendering detail.
3. **Choose edit method.** For blink or mouth/eye changes, use a tight mask and require unchanged pixels outside the dilated mask. For a new body pose, supply the same identity master, model sheet, and explicit pose construction.
4. **Generate one candidate at a time.** Always start from the immutable identity inputs. Never use a previous generated result as the identity reference for the next frame; that compounds drift.
5. **Use invariant language.** Repeat exact camera, crop, canvas, transparency, costume, hair accessories, proportions, line weight, palette, lighting direction, and forbidden changes in every request.
6. **Human cleanup.** Reconstruct hands/feet/face, remove baked background, restore line/color consistency, place pivot/socket, and repair alpha. The selected generation remains a candidate until this pass is approved.
7. **Onion-skin QA.** Compare neutral and neighboring keyframes at 50% overlays; check foot/pivot, head landmarks, body volume, costume topology, hand socket, silhouette, and alpha edge.
8. **Process deterministically.** Run the version-pinned processor from approved source PNG to runtime WebP and generated manifest. Do not manually export production WebP from an art application.
9. **Review delivery.** Inspect contact sheet, black/white/checker composites, 103 px board capture, weapon composite, reduced/static pose, and byte/memory report.
10. **Approve lineage.** Two explicit gates: art-direction identity/acting approval, then animation-engineering registration/timing/validation approval.

Animator-centered research supports keyframes plus explicit sketched in-betweens over unconstrained interpolation, while subject-personalization research supports multiple identity references across poses ([SketchBetween, 2022](https://arxiv.org/abs/2209.00185), [DreamBooth, CVPR 2023](https://openaccess.thecvf.com/content/CVPR2023/html/Ruiz_DreamBooth_Fine_Tuning_Text-to-Image_Diffusion_Models_for_Subject-Driven_Generation_CVPR_2023_paper.html); accessed 2026-09-02).

### 12.4 Precise-edit prompt skeleton

Use this only after attaching the approved identity master, model sheet, and pose/mask input:

```text
Task: create one candidate for <entity> / <semantic frame ID>.

Identity authority: reference 1 is immutable. Match its face geometry, hair shape,
accessories, costume topology, body proportions, line treatment, palette, and light.
Pose authority: reference 2 is the required silhouette/landmark construction.

Canvas: transparent square; preserve the full character and safety gutter. Keep the
ground pivot, camera, perspective, visual scale, and crop fixed. No prop unless listed.

Change only: <specific pose or masked expression change>.
Preserve exactly: <frame-specific identity checklist>.
Do not add: background/checkerboard, text, particles, glow, rim light, motion blur,
extra accessories, extra limbs/fingers, weapon, shadow, or camera movement.

This is a single review candidate, not a sprite sheet. Do not redesign or beautify.
```

For an expression-only frame, replace “match” with “pixels outside the supplied mask must remain unchanged.” Reliability comes from deterministic compositing, not the prompt: the shared art pipeline extracts only the generated patch inside the approved mask and composites it over the immutable canonical master. Outside-mask pixels are copied from the master by construction and verified byte-for-byte; any declared one- or two-pixel blend ring is recorded in the mask hash. If the candidate needs changes outside that region, reject it and revise the mask/brief explicitly—do not relax identity to rescue an attractive output.

### 12.5 Processor and tool policy

Extend the shared Plan-03 art pipeline; do not create a parallel sprite processor, dependency file, schema, manifest, or provenance truth:

```text
python scripts/art_pipeline.py animation --source-record <repo-relative-json> --check
python scripts/art_pipeline.py animation --source-record <repo-relative-json> --build
```

The animation subcommand lives in `scripts/art_pipeline/animation.py` and reuses `cutout.py`, `encode.py`, `validate.py`, and `proofs.py`. Animation fields extend the art-owned source record/manifest schema. After staging and validating every output, `--build` atomically writes only declared runtime derivatives, generated TypeScript metadata, and the shared generated `docs/source-assets/manifest.json`; the performance-owned command then regenerates its global runtime inventory. `--check` is non-writing and fails if any of those generated outputs differ, sources/frames are missing, or any invariant/budget is violated. Both reject absolute/user-store paths.

The processor must:

- validate source hashes and exact declared input list;
- normalize orientation/color; remove only edge-connected checker/chroma background and de-spill at source resolution on straight alpha **before** resizing; apply the shared subject-RGB dilation; resize in premultiplied-alpha space; clamp the declared sub-2/255 fringe; then enforce the final alpha/RGB/dilation-ring policy;
- emit the declared 256 field rendition by default and a 512 presentation rendition only for a separately proven context, as lossless WebP (`method=6`, exact alpha handling) with version/revision/hash names;
- compute normalized bounds/pivots/sockets, generated registration overlays, per-file/clip/family byte totals, and decoded-byte estimates;
- validate family canvas/version, names, frame IDs, duration totals, pivot/baseline, head/body scale thresholds, gutter, alpha/chroma contamination, and attachment bounds;
- generate TypeScript animation manifest data from the art source records and fail when checked-in generated data or `docs/source-assets/manifest.json` is stale;
- create contact sheets/difference/weapon-composite previews only in a temp or explicitly supplied review directory, never as an implicit tracked output.

Use one art-owned lock at `scripts/art_pipeline/requirements.lock.txt`; animation must not create another dependency file. Its machine-checked header records Python 3.14.3, package lines use exact wheel hashes for Pillow 12.2.0, and NumPy 2.5.2 appears only if a shared module proves it is needed. The CLI verifies the header and encoder features before any build. The planning host reported Pillow’s bundled libwebp 1.6.0 and zlib-ng `1.3.1.zlib-ng`; these are candidate lock values, not assumed CI truth, until two clean canonical-run rebuilds are byte-identical. The canonical Windows-x64 art build/CI environment must match the approved Python/Pillow/wheel/libwebp/zlib fingerprint or fail before recomputing hashes; every source record captures it. `--check` uses that same locked environment, making content-hash filenames reproducible.

Wire this deliberately in `.github/workflows/ci.yml`: the existing Windows job sets up exact Python 3.14.3, installs the Windows wheel lock with `pip --require-hashes`, verifies the encoder fingerprint, and runs `npm run art:check`. The Ubuntu web job keeps TypeScript/Vitest/build and platform-neutral URL/manifest checks but does not reinstall a Windows-only wheel or recompute derivative bytes. Do not hide `art:check` inside a cross-platform `npm run check` until a byte-identical cross-platform toolchain is proven.

ImageMagick can be installed user-scoped or unpacked ephemerally later as an independent `identify/compare` cross-check, but cannot be required by CI. FFmpeg is useful only for an ephemeral MP4 timing reel; it is not a frame producer, validator, or runtime dependency. Neither was installed during planning because Pillow already covers the required deterministic work and no repository change was justified.

## 13. Preload, decode, cache, cancellation, and performance

### 13.1 Loader contract

Add an animation-only asset manager with a per-URL record:

```ts
interface AnimationAssetRecord {
  readonly src: string;
  state: SpriteAssetState;
  promise?: Promise<void>;
  image?: HTMLImageElement;
  generation: number;
  refCount: number;
  lastUsedAt: number;
  attemptCount: number;
}

interface AnimationPreloadHandle {
  readonly subscriberToken: symbol;
  readonly ready: Promise<void>;
  cancel(): void;
}
```

- Deduplicate concurrent loads and `decode()` promises by immutable URL.
- Set `src`, wait for load if necessary, then await `image.decode()` before reporting ready. Rendering never waits indefinitely; the static `SpriteArt.src` is visible immediately.
- Cancellation removes only that handle’s subscriber token and decrements aggregate demand; it never invalidates an in-flight record still shared by another consumer. Increment a record’s load-attempt generation only when replacing/retrying that attempt. `decode()` has no abort parameter, so a late completion may populate the shared cache only when aggregate demand remains nonzero; otherwise discard the strong `Image` reference. It may never notify an unmounted/superseded subscriber.
- Failed critical URLs may retry once on a later Tier 0/1 request or `online` event; background work does not spin. After that, use the static fallback and one deduplicated diagnostic.
- Keep the plain `<img>` path in MVP. Do not add fetch/Blob/ImageBitmap complexity unless profiling proves it; if adopted later, use `AbortController` and call `ImageBitmap.close()`.

`HTMLImageElement.decode()` is the relevant readiness primitive; fetch cancellation and explicit bitmap release apply only to a different loader path ([MDN: `decode()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode), [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController), [MDN: `ImageBitmap.close()`](https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap/close); accessed 2026-09-02).

### 13.2 Priority tiers

| Tier | Eligibility | MVP examples | Policy |
|---|---|---|---|
| 0 — visible fallback | Already-visible semantic image | Canonical `SpriteArt.src`, current selected frame | Required visible/core art decodes before the shared first-playable mark; browser/native image behavior remains valid. |
| 1 — current actor | Current level, visible player/friend, next common input | Ame breathe/blink/step/blocked; visible kitten worried | Start **only after** core board/static fallback readiness, the S03 first-playable mark, and input enable. Never gate input, music, or an immediate action; that action may use the static fallback. |
| 2 — probable set piece | Current level and intent/adjacency/persistent capability make action likely | Ame combat frames after weapon acquisition or enemy proximity; goblin hit/surrender; kitten joy near cage | Queue on idle/intent after Tier 1 drains, with at most one Tier-2 decode when global capacity remains. Cancel queue on level generation change. |
| 3 — cold | Not visible/current; catalogue, later species/enemy/object families | Other friends, enemies, portals, treasure, story emotions | On demand only. Never preload the catalogue. |

The 16-file MVP maps exhaustively to those tiers. Tier 0 contains only the canonical neutral currently visible for Ame, kitten, or goblin (the same URL as `art.src`). After first playable/input, Tier 1 may request Ame breathe, blink, step-a, step-b, and blocked plus kitten worried when that friend is visible. Tier 2 may request Ame combat-windup, combat-contact, combat-recover, and joy when the weapon/enemy/presentation context makes them probable; kitten joy only near/inside its rescue context; and goblin hit/surrender only for a visible or imminent goblin encounter. No frame is Tier 3 merely because it belongs to the MVP, and no optional decode may delay an immediate action: the selector uses its semantic static fallback.

Current `preloadLevelArt` already knows the selected level’s families. Extend its collector to return animation candidates by tier rather than flattening every frame into the old `preloadSources` set. Avoid document-level `<link rel="preload">` for optional frames; over-preloading competes with truly critical resources ([web.dev, image preload guidance](https://web.dev/articles/preload-responsive-images); accessed 2026-09-02).

The collector also receives consumption context (`field` or `presentation`) and chooses exactly one rendition. Field is the default even inside a set piece at current board sizes; 512 is not a synonym for “important.” Animation registers with the performance-owned shared image queue when that queue lands and never creates a parallel queue. The sprite subsystem may occupy **at most two active decode slots across all of its tiers**; its Tier 2 may occupy only one slot and only after its Tier 1 drains. This is intentionally stricter for sprite work than Plan 07’s whole-image-queue allowance of two foreground plus one background slot: animation neither removes capacity needed by other art nor turns that allowance into three sprite decodes.

### 13.3 Budgets

- **Per-rendition transfer:** field-256 ≤100 KiB; optional presentation-512 ≤220 KiB, matching the shared art plan. Oversize needs an explicit quality proof and performance approval.
- **Eager/Tier-1 transfer:** at most 1.0 MiB of animation files above current static level art before or during the first likely interaction.
- **Cumulative one-level animation transfer:** at most 1.5 MiB after every animation-supported action in that level has occurred; never load unrelated family/direction/rendition files.
- **Total MVP animation pack:** at most 1.6 MiB encoded for the 16 field renditions. The earlier approximately 2.8 MiB estimate was a conservative 512-pixel measurement; real 256 outputs, not extrapolation, decide acceptance.
- **Strong decoded animation cache:** at most 16 field-equivalent units. A 256 RGBA frame costs one unit (256 KiB); a 512 frame costs four. This caps CPU RGBA at 4 MiB and should be budgeted as about 8 MiB with a comparable GPU/compositor copy.
- **Global animation decode concurrency:** two; Tier 2 may use at most one of those slots after Tier 1 drains.
- **No App/grid animation render budget:** frame ticks update only mounted sprite renderers. Dev instrumentation must show zero maze-grid commits caused by an idle blink/step frame swap.
- **No unbounded loop budget:** one scheduler and one visibility/media-query subscription for the document, regardless of sprite count.

Decoded memory is driven by dimensions, not compressed bytes (`width × height × 4` for RGBA8), and browser/compositor copies can add more ([MDN Canvas pixel data](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas); accessed 2026-09-02).

When the strong-reference cap is exceeded, evict least-recently-used decoded records with `refCount === 0`; dropping the `Image` reference permits browser reclamation but does not pretend to clear the HTTP cache or prove browser/GPU reclamation. Visible/current frames are pinned. Plans 05 and 07 now share the 16-field-equivalent-unit/4 MiB CPU/~8 MiB CPU+GPU animation cap; it is a maximum, not permission to raise the measured six-tile working set. The performance owner’s measured renderer/process plateau and combined VFX/lighting/UI trace are authoritative. Version/hash URLs can receive long immutable cache headers in deployed builds ([MDN Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control); accessed 2026-09-02).

The pack also participates in the performance plan’s global release ledger: total runtime assets must remain at or below 66,997,573 bytes, the active-still/media reduction target remains at least 25%, every family growing more than 5% needs an offset or explicit performance exception, and `dist`/portable/NSIS package totals must pass. Runtime JavaScript (current gzip freeze 115,820 bytes) and CSS (29,107 bytes) need an approved feature allocation or demonstrated offset before enablement; generated manifest data counts, while dev-only `jsdom` does not. Sprite-local caps cannot waive any global limit.

### 13.4 Visibility and lifecycle

- `document.hidden`: the shared visibility provider notifies both systems. PresentationDirector—not animation—issues `visibility-hidden`, resolves each director transient to its semantic final/static result, and releases its lock. The animation-owned local-playback adapter aborts only its visual signals, causing step/blocked/pickup/power once-clips to select their declared exits and unregister. Animation also cancels ambient deadlines and Tier 2/3 queue handles, retains visible/fallback URLs, and releases unreferenced decoded records toward the cap.
- Visibility return: rebase ambient loops/blink deadlines. A terminal local occurrence keeps its aborted signal until `playbackId` changes, and a cancelled director occurrence keeps the director's final recipe; neither resumes or catches up.
- Level/navigation generation change: cancel queue handles, unregister renderers, release their references, and ignore late decode completions.
- Obscuring modal/backdrop: derive board obscuration from Plan 08's canonical `InputContext`/`getInteractionPolicy()` state (controls owns the type/policy; UI owns the modal markup) and pass `paused`/`visible` into sprites. Pause board ambience and postcritical preloads while obscured. On close, rebase ambience with no catch-up. Do not abort a still-semantic director run unless the director/input policy says the run itself is cancelled.
- `IntersectionObserver`: use only for genuinely offscreen catalogue/modal content. The maze already avoids mounting far-off large-board objects; do not add an observer per visible tile.
- Window resize/stage scale changes never reload or choose a different natural frame; fixed-canvas CSS scaling is presentation only.

The browser normally pauses rAF in hidden tabs, but Page Visibility remains the explicit cache/queue/director-cancellation signal ([MDN Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API); accessed 2026-09-02).

### 13.5 Performance telemetry and promotion gate

Development-only counters should expose active sprite subscribers, scheduled deadline, decoded/in-flight/failed URLs, strong decoded bytes, evictions, fallback hits, and animation-caused React commits. Before expanding beyond the MVP, capture:

- cold and warm load on desktop/browser build;
- first movement, first blocked attempt, first rescue, and first combat with slow decode emulation;
- hide/return during each one-shot, proving director abort, semantic final state, released lock, and no resume;
- peak decoded working set for a large visible maze;
- actual encoded totals and any sheet experiment using approved frames.

Use the performance plan’s exact lanes and gates. Per pull request, run deterministic asset/build/manifest checks, fallback/cancellation tests, and full/reduced Playwright behavior; do not put shared-host wall-clock assertions in PR CI. On the quiet recorded nightly/pre-release hardware profiles, run S03 first playable/waterfall, S07 reference play, and S09 retention serially. Reference play must meet p95 ≤20 ms, p99 ≤33.3 ms, and <1% frames over 33.3 ms; the low-end profile must meet p95 ≤33.3 ms and p99 ≤50 ms; no gameplay task may exceed 50 ms. S09 must show ≤10% unexplained retained-heap growth and no increasing slope. S03 must prove core visible art decodes, first-playable/input occurs, and only then Tier-1 animation begins without delaying music or first input.

Every hashed frame must appear in the generated build inventory, resolve by direct static-host URL, and decode with networking disabled in the packaged Tauri/WebView2 build. Missing dynamic paths fail build/CI even though the runtime still has a visual fallback. The deployment owner decides immutable media headers; animation does not assume headers from the development server.

Do not promote an atlas or trim implementation based on theoretical request count. Require at least 15% measured end-to-end improvement for the exact family/state and no regression in first-visible-frame time, error isolation, memory, or rollback. Any sheet experiment stays outside shipping `public/` and package inputs; if approved, it replaces the discrete family atomically. Never package sheet and discrete representations as a hedge, and compare exact `dist`, portable, and installer deltas rather than transfer alone.

## 14. Static and reduced-motion behavior

### 14.1 Mode resolution

Consume the single UI/accessibility preference provider defined by the concurrent UI/VFX plans: `MotionPreference = "system" | "full" | "reduced"`, resolving to shared `MotionMode = "full" | "reduced"`. `system` follows a live `matchMedia("(prefers-reduced-motion: reduce)")`; an explicit full/reduced choice overrides it. The sprite layer does not persist a second preference.

`SpriteQuality = "animated" | "static"` is separate, stable availability/performance policy. Feature disable or asset failure is a third, legacy fallback path. Do not auto-downgrade quality after a slow frame; performance owns a stable device/release decision.

The current app samples the media query only at event start. The shared provider subscribes to changes and cleans up the listener. UI owns the control surface, but a persistent Full/Reduced control is a Phase-2 gate for automatic idle/breath/blink loops. Until that surface exists, `allowAmbientAnimation` is false and only bounded interaction/set-piece clips may run.

Every clip variant requires `full`, a meaningful `staticFrameId`, and an explicit `reduced` definition when reduced behavior is timed. Do not rely on the current global `0.001ms` CSS rule to race through frames. Keep that rule as a defensive net while selecting intentional frames in JavaScript.

### 14.2 Exact MVP fallback table

| State | Full + animated quality | Reduced + animated quality | Static sprite quality | Feature-off / required asset failure |
|---|---|---|---|---|
| Idle/breathe/blink | Idle loop plus sparse blink, only after persistent control ships | `ame.neutral`; no timer or suppressed-frame preload | Meaningful neutral frame | Canonical `SpriteArt.src`. |
| Step | 72 ms contact + 48 ms neutral | Semantic armed/neutral result immediately; reduced spatial policy comes from shared provider | Armed/neutral state frame; no cycling | Canonical still/current weapon overlay. |
| Blocked | 80 ms blocked + settle | Blocked key pose for at most 120 ms, no translate/scale, then neutral | Blocked state frame for the bounded acknowledgement, then neutral | Canonical neutral; existing message/sound still communicates block. |
| Pickup/armed | Exact weapon/potion clip, then persistent result | Immediate persistent semantic result only | Persistent armed/power result frame | Canonical Ame still + current weapon overlay. |
| Combat | Exact multi-pose 2,220 ms map | 0–95 ms: Ame contact + goblin hit; 95–180 ms: Ame joy + goblin hidden behind the result seal; no cycling/lunge | The same two semantic holds and hidden result at 95 ms, without spatial motion | Current reduced composition using canonical stills. |
| Rescue | Timed joy/release frames plus director set piece | Freed joy result held for the director’s 140 ms replacement; no hop/cage travel | Freed joy tableau | Current reduced endpoint using canonical static art. |
| Victory | Joy hold inside the UI/VFX-owned finite completion plan | Joy hold | Joy hold | Existing completion UI. |

Reduced/static mode freezes ambient breathing, blink, creature waddle/bob/sway, follower dance, portal cycling, treasure shimmer, and nonessential scale/translate/rotate. It preserves meaning through an intentional semantic hold—armed, blocked, rescued, arrived, surrendered, or victorious—or the finite combat contact→result reconciliation defined above. Suppressed frames are not preloaded.

The table assumes canonical `src` is valid. A canonical URL failure tries the unexpired rollout URL once, then shows the same code-native neutral silhouette in every motion/quality mode. This last-resort renderer shape is not an animation frame and triggers no timer or download.

This follows `prefers-reduced-motion` guidance and WCAG’s requirement that interaction-triggered nonessential motion be disableable ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion), [W3C WCAG 2.3.3](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html); accessed 2026-09-02). No clip may flash more than three times per second. Automatic ambient loops stay disabled until the persistent control satisfies the pause/reduction requirement ([W3C WCAG 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html); accessed 2026-09-02).

## 15. Test and validation plan

### 15.1 Pure unit tests

Create these focused suites under `src/animation/`:

| Suite | Required cases |
|---|---|
| `manifest.test.ts` | Unique manifest/frame/clip IDs and exact family/catalogue-key/art-ID cross-resolution; valid 512 registration and 256 field rendition; every referenced rendition exists; every timed-step duration is a positive finite integer; loops cannot contain hidden steps; hidden once-steps use only the `result` marker and a valid hidden/frame exit; every clip has meaningful static/full and valid reduced playback; expected duration equals step sum; hash/encoded/decoded bytes, source record, owner, route/authored/generated-selector reachability, base tier, CSS-size/DPR and offline metadata present; generated selectors exhaustively match finite generator catalogues; normalized pivot/socket/bounds, Plan-03 safe inset or exact approved legacy exception, alpha≥8 bounds, 2–4 px RGB dilation ring, alpha fringe and hard gutter valid; ambient interruption references/ranges valid; explicit four-direction resolution; compatible weapon IDs/registration classes are valid and every compatible action/static fallback frame has a socket; global inventory finds no dynamic omission/orphan. |
| `selectSpriteFrame.test.ts` | Loop modulo and negative-time clamp; long delayed timestamp skips missed frames; once/hold plus frame/hidden exit behavior; explicit static semantic playback; reduced/static selection; deterministic seeded idle/blink schedule; blink resumes the preserved host epoch; no reset when props rerender with same `playbackId`; reset on new `playbackId`; direction map precedes variant lookup; fallback never inherits an implicit mirror; typed asset-state/feature flag inputs and ordered `fallbackPath`; selected canonical/rollout/frame geometry reaches the immutable result; missing action socket retries static socket then ends at canonical + legacy overlay; hidden result produces no image request. |
| `combatSpriteMapping.test.ts` | Exact frame at 329/330, 379/380, 559/560, 759/760, 809/810, 1,199/1,200, 1,259/1,260, 1,499/1,500, 1,729/1,730, 1,899/1,900, and 2,219/2,220 ms; goblin remains neutral through 1,729 and cannot pre-announce surrender; surrender begins at imported transfer end and goblin is hidden from imported victory cue; reduced boundaries are exact at 94/95 and 179/180; contact never precedes an exported impact; total remains equal to `COMBAT_VICTORY_DURATION_MS`; reduced map equals the exported reduced duration. |
| `rescueSpriteMapping.test.ts` | Ame joy at the shared 150 ms rescue cue; kitten remains worried at `FRIEND_RELEASE_JOY_AT_MS - 1` and changes exactly at the imported constant; visible sequence totals 870 ms while director run remains 900 ms; reduced/static select freed joy with no hop/cage travel. |
| `fallback.test.ts` | Missing manifest → canonical art static URL; missing clip → manifest fallback then canonical if needed, with a distinct reason; missing requested direction → declared unmirrored fallback; incompatible, legacy-only, and missing-socket weapons → neutral/static compatibility path with distinct reasons; missing presentation rendition → same frame's field rendition; missing active frame → clip static; missing clip static → manifest fallback; pending versus failed frame → `asset-not-ready` versus `decode-failed`; frame error → canonical `src`; canonical error → one unexpired rollout fallback attempt using the rollout source's own natural size/geometry; missing/expired/invalid-version rollout → `rollout-ineligible` + code-native silhouette; failed rollout → `rollout-src-failed` + silhouette; no recursion/broken/empty box; feature-off bypasses manifest/decode and requests no legacy duplicate on the normal path; `fallbackPath` is exact and empty for direct success; same inputs always resolve identically. |
| `presentationAdapter.test.ts` | Move parity only increments on success; blocked uses requested direction; exact `sword-collected`/`potion-collected` mappings; armed composes without stealing priority; active presentation priority; jump/rescue and jump/door current serialization; feature-off characterizes current jump+portal omission; Stage-3 Plan-02 composite lands jump then begins portal departure from that tile with each event/announcement once and unchanged gameplay order; reload facing defaults to down; level-won still waits on current gate; adapter cannot mutate/extend `InputContext` or interaction policy. |
| `assetLoader.test.ts` | Concurrent dedupe; resolve only after `decode()`; reject/fallback; one bounded retry; priority order; sprite jobs occupy at most two shared-queue slots and Tier 2 never overlaps undrained sprite Tier 1; cancelling one subscriber leaves another live; stale load-attempt generation cannot notify; zero-demand late decode drops strong ref; LRU protects referenced/visible frames; rendition-unit accounting; hidden/modal-obscured state pauses background queue. |
| `spritePolicy.test.ts` | Consumes/mocks the shared provider; explicit Full/Reduced overrides system; live media-query change; static quality remains separate; no automatic quality downgrade; suppressed clips produce no preload candidates; shared-listener cleanup remains provider-owned. |
| `animationClock.test.ts` | One earliest ambient/local deadline; canonical `PresentationClockSnapshot` with numeric run ID/signal equality advances projected elapsed at a later paint without a React rerender; absolute-time catch-up; hidden/modal-obscured ambient rebase; page hide aborts a local pickup/power visual to its declared exit and it cannot resume until a new `playbackId`; director abort resolves final and never resumes; subscriber removal cancels its local timer/rAF/controller. |

Use fake monotonic time and a fake `Image`/`decode()` implementation; do not make unit tests depend on network or real image decoding.

### 15.2 Component lifecycle and accessibility

The repository currently uses Vitest’s Node environment and has no DOM test dependency. Add `jsdom` as a pinned development dependency. Use React’s `createRoot`/`act`; Testing Library is optional and should not be added unless it provides a demonstrated need.

Required `SpriteRenderer.test.tsx` cases:

- initial render immediately displays `SpriteArt.src` while an optional animation frame decodes;
- decoded frame/body and attached-weapon transform commit together; a forced missing socket commits canonical body plus the legacy static overlay atomically;
- load error never produces broken-image or recursive error behavior;
- canonical plus rollout failure produces the stable code-native silhouette using canonical geometry/pivot, without a changing accessibility label;
- unmount cancels component registration and its scheduler/visibility/motion/director/decode subscriptions, pending local deadline, and late-decode notification; shared visibility/media listeners remain provider-owned and singular;
- React Strict Mode mount-cleanup-remount leaves exactly one active subscription;
- swapping `playbackId` restarts; swapping unrelated class/parent props does not;
- page hide aborts a local pickup occurrence to its declared persistent result; return does not replay it, and a new `playbackId` can start normally;
- a decorative sprite always renders `alt=""` and `aria-hidden="true"`; a meaningful non-board sprite requires stable alt text that does not change per frame;
- reduced/static mode never cycles suppressed frames and never adds their URLs to the decode request set.
- opening an obscuring modal pauses board ambience/postcritical requests; closing rebases with no catch-up and leaves exactly one shared provider listener.

Existing nearby-position text/live regions receive regression assertions at the App adapter boundary. Animation-frame names must never leak to assistive technology.

### 15.3 Asset and visual validation

`python scripts/art_pipeline.py animation --source-record ... --check` is a required CI/local release gate. Test the shared checker with fixtures for missing frame, stale generated manifest, wrong hash, wrong dimensions/rendition, bad duration, mismatched identity keys, normalized pivot outside canvas, baseline drift, safe-inset violation, clipped hard gutter, wrong alpha threshold/dilation ring, nontransparent edge, chroma fringe, oversized family, and unsupported weapon pair.

Human acceptance uses a generated-to-temp contact sheet and in-app tester:

- 103 px board capture and 2× capture on warm/cool/light/dark tiles;
- silhouette-only strip and 50% onion-skin strip;
- all exact timing boundaries at normal and throttled rendering;
- comet spear and star sword attachment strip for every compatible Ame frame;
- full/reduced/static comparison;
- slow decode, one missing file, hidden-tab resume, resize, and level-change mid-action;
- React Profiler proof that App/grid do not rerender on idle frame changes;
- browser memory/transfer evidence against the budgets in section 13.

No snapshot test can substitute for the actual-size identity/acting review.

## 16. Implementation phases, files, gates, and rollback

### Phase 0 — freeze contracts and recover masters

**Work**

- Approve this scope, state names, exact MVP pose list, timing map, and ownership contracts.
- Recover the Ame, kitten, and goblin candidates by the recorded SHA values into portable, versioned source locations, or reconstruct an art-approved compliant master; create all three model sheets, pivot/landmark overlays, and provenance records.
- Create/complete art-owned source records for current `/assets/sword.png` (`star-sword`) and `/assets/weapon-comet-spear-v1.png` (`comet-spear`). When an original is unavailable, mark Star Sword as an explicit legacy-runtime-only source, hash the runtime evidence, record the provenance gap, and block destructive regeneration until a master is approved.
- Measure and approve ground pivot, display scale, content envelope, Ame body sockets, and comet-spear/star-sword grips/axes/scales/rotations/z-orders; record their measured safe-inset exceptions or approve re-registration, including rotated clipping proofs. Register all other currently reachable weapons as `legacy-static-only` before migrating their render sites.
- Define the animation extension to the shared art source-record schema and pipeline without generating runtime frames or a second manifest.

**Future affected files**

- `docs/source-assets/characters/ame/v01/*`
- `docs/source-assets/friends/animal-kitten/v01/*`
- `docs/source-assets/enemies/goblin/v01/*`
- `docs/source-assets/weapons/star-sword/v01/*`
- `docs/source-assets/weapons/comet-spear/v01/*`
- `docs/source-assets/weapons/{flower-sabre,moon-wand,leaf-blade,sun-mallet,bubble-bow,cupcake-mace}/v01/*` for hash-locked `legacy-static-only` compatibility records; no animation frames or new weapon derivatives
- shared `docs/source-assets/manifest.json` and source-record schema
- `scripts/art_pipeline.py`
- shared art-owned `scripts/art_pipeline/requirements.lock.txt` with Python/package wheel hashes and verified encoder fingerprint
- `scripts/art_pipeline/animation.py` plus shared `encode.py`, `validate.py`, and `proofs.py`
- `.github/workflows/ci.yml` Windows art-check setup/gate; Ubuntu retains platform-neutral checks

**Dependencies/gate**

- Art direction approves identity master/model sheet and child-friendly pose thumbnails.
- Art direction records any legacy-resolution/safe-inset exception for the recovered 1254 Ame/kitten/goblin candidates or approves identity-safe 2048/1536 reconstructions; it separately approves exact Star Sword/Comet Spear weapon exceptions or safe re-registration.
- Animation engineering signs off pivots/sockets, 512 registration, Plan-03 safe insets or explicit family exception, alpha thresholds/dilation, and the hard encoder gutter.
- Art/catalogue resolves source records and complete static compatibility geometry for all eight reachable `WeaponStyle` values; only Star Sword and Comet Spear may receive `approved` action registration in MVP, and the remaining six are `legacy-static-only`.
- If any recovered/reconstructed source does not reproduce its current actor faithfully, Phase 0 stops for that family; because all three are required by the stated MVP, either resolve it or explicitly reapprove the reduced MVP/file count before Phase 1 content integration.

**Acceptance**

- Every source/evidence record is repo-relative and hash-locked; reconstructable derivatives are reproducible and `--check` can run without writing. A documented legacy-runtime-only weapon record is evidence, not permission to regenerate from a missing master.
- No runtime/code path references a user-scoped generated-image directory.

**Rollback**

- Source/provenance work is isolated and unused by runtime. Remove the unapproved v01 source folder; current game is untouched.

### Phase 1 — runtime shell with static fixtures only

**Work**

- Implement types, source-record-to-generated-TS manifest check, pure selector, shared deadline clock, loader, shared-motion consumer/sprite-quality policy, renderer, presentation adapter, and tests.
- Add the missing `AME_ART` catalogue record and route `ASSETS.ame` through it before changing any Ame render site.
- Point a development-only fixture manifest at copied/current static images; keep production `animationId` values absent and the feature flag off.
- Separate inner registration/weapon layers from outer board transforms.

**Future affected files**

- `src/animation/types.ts`
- `src/animation/generatedManifests.ts`
- `src/animation/manifest.ts`
- `src/animation/selectSpriteFrame.ts`
- `src/animation/animationClock.ts`
- `src/animation/localPlaybackLifecycle.ts`
- `src/animation/assetLoader.ts`
- `src/animation/spritePolicy.ts` (consumes the shared provider; does not persist preference)
- `src/animation/presentationAdapter.ts`
- `src/animation/SpriteRenderer.tsx`
- colocated `*.test.ts` / `*.test.tsx`
- `src/vfx/types.ts`, `src/vfx/presentationDirector.ts`, and their tests, changed by/with the PresentationDirector owner only to expose the canonical numeric-ID clock snapshot
- `src/artCatalog.ts`, `src/artCatalog.test.ts`
- `src/assets.ts`, `src/assets.test.ts`
- `src/styles/sprite-animation.css` for structural sprite rules and UI-owned `src/styles/motion.css` for all motion/keyframes; `src/styles.css` only for an import/removal seam if the UI stylesheet migration has not landed
- `package.json`, lockfile, `tsconfig`/Vitest config only if needed for `jsdom`

**Dependencies/gate**

- Add only the pinned `jsdom` development dependency.
- No runtime library is required; React and browser primitives are sufficient.
- Shared `MotionMode`, cancellation reasons, `PresentationClockSnapshot`, and any document-visibility lifecycle type in canonical `src/vfx/types.ts` must land before director-owned sprite integration; do not duplicate them under `src/animation` or a new presentation module. Modal/top-layer obscuration is instead derived from Plan 08's canonical `src/inputContext.ts` and `getInteractionPolicy()`, then passed into sprites as `paused`/`visible`. The numeric run ID and signal exactly match `PresentationRun`; the director owns the monotonic origin, abort, final recipe, and lock release, while animation only projects the read-only snapshot to paint time.
- Re-read `HEAD`: pure selector/loader modules may land before the UI extraction, but DOM migration must target the accepted `MazeScene`/game-screen owner and declared stylesheet layers rather than competing with simultaneous `App.tsx` restructuring.
- Before any player/battle render site migrates, every `WeaponStyle` reachable at that site resolves a complete art-owned source record and geometry; only Star Sword/Comet Spear are action-approved, and all others must take the tested neutral/static path.

**Acceptance**

- Feature-off screenshots/behavior match the inspected game.
- All fallback, timing, cancellation, Strict Mode, memory-accounting, and accessibility tests pass.
- An idle fixture tick produces no App/grid commit.

**Rollback**

- Remove the optional renderer path and new animation folder; `SpriteArt.src` and all static `<img>` paths still work.

### Phase 2 — MVP art pack and first-session integration

**Work**

- Produce and approve the 16 runtime files in section 7 using the workflow in section 12.
- Register `ame-v01`, `kitten-v01`, and `goblin-v01` manifests.
- For the exact new `AME_ART`, existing `ANIMAL_ART.kitten`, and existing `ENEMY_ART.goblin` records, atomically set the approved neutral rendition as canonical `src`, add `animationId`, and retain the prior static URL only as an error-only, one-release `rolloutFallback` with an enforced expiry.
- Replace only base player, relevant battle duplicates, first-level kitten/rescue/follower, and goblin battle layers with `SpriteRenderer`.
- Connect current-level tiered preload/decode, the performance-owned runtime inventory/shared queue, top-layer pausing, and dev telemetry.
- Retain current CSS outer movement/combat/rescue transforms where they do not duplicate the new inner pose job.

**Future affected files**

- `public/assets/sprites/ame/v01/*.webp`
- `public/assets/sprites/kitten/v01/*.webp`
- `public/assets/sprites/goblin/v01/*.webp`
- approved source frames/source records under the art-owned `docs/source-assets/{characters,friends,enemies}/.../v01/` layout
- generated manifest TS and the Phase-1 runtime files
- `src/App.tsx`, structural `src/styles/sprite-animation.css`, and UI-owned `src/styles/motion.css`; delete migrated legacy selectors from `src/styles.css` in the same change if it is still active
- `src/combatPresentation.test.ts` only for mapping assertions; combat semantics remain unchanged

**Dependencies/gate**

- Phase 0 identity/pivot approvals and Phase 1 runtime/tests complete.
- The shared persistent `Motion: Full / Reduced` control/provider is available before enabling idle breath/blink loops; otherwise ship the action slice with ambient disabled.
- Art direction, gameplay/presentation, accessibility, and performance reviewers sign their contracts.

**Acceptance**

- Exact section-7 timing; no outcome or input-cadence change.
- Comet spear and star sword approved; unsupported weapons deterministically use neutral/current overlay.
- Field renditions ≤100 KiB, no unproved presentation renditions, ≤1.6 MiB total pack, ≤1.0 MiB eager/Tier-1 transfer, ≤1.5 MiB cumulative one-level transfer, and ≤16 field-equivalent decoded units.
- Missing any one animation URL, enabling reduced/static mode, hiding the tab, and changing level mid-action all end in the correct semantic static state.
- Actual-size art reads clearly and remains on-model.
- S03 proves no optional animation request starts before first playable/input; direct static-host and network-disabled packaged builds resolve/decode every generated runtime URL.
- The feature fits the global runtime-media/package and JavaScript/CSS gzip budgets or carries explicit performance-owner exceptions/offsets; the quiet S07/S09 cohorts meet section 13.5 frame, long-task, and heap gates.

**Rollout/rollback**

- Enable by the exported `SPRITE_ANIMATION_V1_ENABLED` kill switch after tester approval. Soft rollback is one flag change and retains catalogue links plus the new approved neutral stills. Hard rollback atomically restores the previous three catalogue `src` values, removes their animation IDs and generated registry/reachability entries, and removes the 16 runtime files plus their active source declarations—or carries a release-owner-approved dormant allow-list with an explicit expiry. After the one-release legacy cleanup, the hard rollback change first restores old files from the tagged prior release. The inventory must pass in the same change; no permanent duplicate or orphan is accepted.

### Phase 3 — traversal, followers, and important objects

**Work**

- Add Ame jump, landing, portal-arrival, armed/pickup refinements; friend follower step and victory dance; cage open; goal completion; one portal family; and the highest-value pickup/treasure contacts.
- Derive follower facing from presentation trail deltas without adding gameplay state.
- Integrate `src/jumpPresentation.ts`, portal/rescue presentation records, and completion UI slots through adapters. For coincident jump+portal, consume Plan 02's one director-owned landing→departure composite: characterize the current omission only in feature-off tests, preserve engine event/announcement order and cardinality, and never synthesize a second portal occurrence.

**Future affected files**

- additional versioned source/runtime family assets and manifests
- `src/App.tsx`, `src/jumpPresentation.ts` tests/adapters, `src/assets.ts`
- `src/game/followerTrail.ts` only if it exposes presentation-safe deltas; no pathfinding semantics change
- `src/game/visualPersonality.ts` to select frame family/outer-motion compatibility

**Acceptance**

- Each new action has an explicit static/reduced result and authoritative timeline mapping.
- Jump+portal lands before departure exactly once, with the Plan-02 director/run clock as the only presentation lifetime and no gameplay-order change.
- Full-level preload/memory budgets still pass; no whole-catalogue loading.
- VFX/lighting agree on clean transparent frames and marker/timestamp ownership.

**Rollback**

- Disable per-family manifest entries. Each migrated site retains `src`; current CSS/object effects remain the fallback.

### Phase 4 — breadth and story acting

**Work**

- Expand friends/enemies by visibility and reusable body archetype, then keys/doors/objects.
- Add explicit authored story `emotion`/`pose` beat data with narrative/UI ownership; never sentiment-infer at runtime.
- Retire redundant CSS personality deformation only after equivalent frame/static coverage exists.

**Dependencies/gate**

- Measured MVP retention/performance value, approved family archetype strategy, and story schema contract.

**Acceptance**

- Every catalogue `animationId` is exhaustive and validated, while unanimated entries remain first-class.
- No family ships “complete” four-frame sets merely for parity; each drawing has a documented job and reuse case.

**Rollback**

- Family-level removal is independent; never require global manifest/atlas rollback.

### Phase 5 — measured optimization only

**Work**

- Experiment outside shipping `public/`/package inputs with trim reconstruction or a family/state-local sheet only when telemetry crosses section-13 thresholds.
- Compare discrete versus candidate packaging using exact approved frames, cold/warm loads, decoded memory, error isolation, rollback, and exact `dist`/portable/installer deltas. An approved representation replaces the old one atomically.

**Acceptance**

- At least 15% end-to-end improvement with no first-frame, memory, reduced-mode, cache-invalidation, package-size, offline, or fallback regression; sheet and discrete forms never ship together.

**Rollback**

- Generated semantic frame IDs remain stable; repoint manifest URLs to discrete files and delete the optional renderer branch.

## 17. Coordination contracts

These contracts were reconciled against the concurrent Plans 01 (UI), 02 (VFX), 03 (art direction), 04 (lighting), 06 (gameplay), 07 (performance), and 08 (controls) present in the working tree. They are coordination inputs, not changes to those files. Re-read implementation-phase `HEAD` and the accepted versions of those plans before touching shared DOM/CSS/catalogue/pipeline seams.

| Partner | They provide/own | Sprite-animation provides/owns | Boundary test |
|---|---|---|---|
| Art direction | Canonical identity/model sheet, art version/recipe/source record, Plan-03 `ArtFamily`, and `resolveSpriteArt` output including body geometry plus weapon grip/axis/scale/rotation/z-order/registration, palette, silhouette/acting and mirror approval. | Pose vocabulary, clip timing, per-frame normalized body hand socket, animation family version, actual-size proofs. | No second geometry/provenance truth; no frame enters runtime manifest without identity + acting sign-off; no reachable weapon render site migrates without a complete art-owned record. |
| Gameplay/controls | Outcome/state/events, collision, power, rescue, pickup, jump/portal travel, event order, stable object IDs, `InputContext`/interaction policy and input cadence. | Pure mapping from authoritative presentation records to clips; local visuals may outlive/supersede without locks. | Disable animation and all outcomes, locks, legal inputs, and cadence remain identical. |
| Combat/presentation | `PresentationDirector`, `CombatVictoryPlan`, run ID, monotonic `{ elapsedAtSampleMs, sampledAtMs }` snapshot, `AbortSignal`, cancellation reasons, cue semantics, and input locks. | Pure projected-elapsed frame lookup and discrete paint boundary subscription. | A later paint advances without a React timing update; boundary tests import exported duration/clash values; contact begins at impact; no copied CSS percentages or second run lifetime. |
| VFX/audio/PresentationDirector | Shared application lifecycle provider owns the single visibility listener; PresentationDirector consumes it and solely owns transient run/origin, cancellation/final recipe, `AbortSignal`, input-lock release, sparks, trails, particles, and sound cues. | Clean unbaked frames, discrete paint deadlines, ambient/local clock, optional read-only visual markers; subscribe to lifecycle/director state and consume abort/final only. | `visibility-hidden` produces exactly one director abort/final recipe and lock release; sprites never call it, merely unsubscribe/render it, and never resume. |
| Lighting | Board/world light direction, contact/cast shadow siblings, caster classes, lift-to-shadow response, material integration. | Neutral transparent edges; no baked light/shadow/rim; stable normalized bounds/pivot; `--entity-lift` output for owned motion. | Composite review on warm/cool/light/dark backgrounds and no reuse of shadow pseudos. |
| UI/accessibility | Scene/root slots, target display sizes, single persistent Full/Reduced provider/control, stable labels/live regions, modal markup/state inputs to the controls-owned `InputContext` policy, finite completion plan, and motion CSS/cascade ownership. | Registration box, decorative/meaningful prop contract, `SpriteQuality`, static/reduced frame, `paused`/`visible` consumer behavior, and namespaced motion rules contributed to UI-owned `motion.css`. | Structural sprite CSS stays separate; all keyframes/animation/transitions use the UI motion layer; obscuration derived through `getInteractionPolicy()` pauses/rebases board ambience/preloads; frames add no announcements or competing lifetime/layout. |
| Performance | Browser/device targets, generated global asset inventory/shared image queue, aggregate media/package/JS/CSS budgets, profiling lanes/approval, and cache-header/deployment policy. | Cross-resolved rendition metadata, tier candidates, loader telemetry, strict 16-field-equivalent-unit LRU and kill switch. | S03/S07/S09 and static-host/offline/package gates in section 13 pass; local limits do not waive global budgets or measured renderer/GPU plateau. |
| Narrative | Explicit emotion/pose beat IDs and context. | Approved clip/portrait mapping and fallback. | No runtime sentiment inference; unknown beat uses neutral portrait. |

## 18. Risks and mitigations

| Risk | Impact | Mitigation / rollback trigger |
|---|---|---|
| AI identity drift | Beautiful but inconsistent Ame/friends across poses. | Immutable master + model sheet + pose construction, no chained generations, human cleanup, mask invariants, actual-size/onion-skin gate. Reject rather than average incompatible frames. |
| Missing source provenance | Future edits cannot reproduce current identity. | Phase-0 SHA archive is a hard gate. No production pose work from runtime-only files if the recovered master fails. |
| Frame jitter | Feet/head/weapon pop at every swap. | Locked canvas/pivot/scale, ±1 px baseline, sockets/grips, onion skin and automated geometry check. Family version bump for contract changes. |
| Weapon disconnect or clipping | Combat looks worse than static art. | Explicit compatible-pair matrix; unsupported pairs use neutral/current overlay. Review all compatible frames across the section-11 size/DPR matrix. |
| Duplicate animation clocks | Combat visuals drift from numbers/audio/VFX. | Absolute shared presentation timestamp; adapter imports existing plans; no gameplay callback/independent CSS percentages. |
| React render storm | Idle animation rerenders the maze. | Isolated renderer/shared deadline scheduler; profiler gate of zero App/grid commits. Feature flag off on failure. |
| Decode/memory growth | Pressure from many frames or accidental 512 rendition duplication. | Tiered current-level loads, 16-field-equivalent-unit LRU, one rendition per consumer, no catalogue preload, immutable URLs, aggregate telemetry gate. Reduce frame breadth before resolution/quality. |
| Slow/missing asset | Broken image or late action pop. | Static image paints first, decode readiness, deterministic ladder, prewarm likely action, deduplicated error, one bounded retry. |
| Permanent duplicate fallback | Old PNG and new neutral WebP silently grow every package. | Canonical neutral replaces `src`; old URL is error-only for one release, inventory-enforced expiry, then deletion. Soft and hard rollback are distinct. |
| Hidden-tab replay | Old contacts/release beats replay on return. | Director aborts transient to semantic final and releases lock; ambient alone rebases; aborted one-shot never resumes. |
| Reduced-motion regression | Rapid cycling or spatial motion persists. | Manifest static/reduced frame required, live preference, no suppressed preload, current CSS global rule retained as defense. |
| CSS transform conflict | Inner pose alignment competes with movement/VFX. | Strict outer-position/inner-registration ownership and targeted CSS consolidation; do not append another global override layer. |
| Direction/mirror identity error | Flower, backpack, handedness, or light flips incorrectly. | `mirrorX` explicit per family/direction; MVP is non-mirrored default view. |
| Atlas over-optimization | Larger files, coupled failures, all-frame decode. | Discrete default; measured ≥15% family-local threshold; stable semantic IDs permit instant URL rollback. |
| Event combinations | A valid portal/rescue visual is silently dropped or duplicated. | Characterize current feature-off arbitration, then consume Plan 02's approved jump-landing→portal-departure composite in Stage 3. Assert event/announcement cardinality and unchanged gameplay order; animation never invents either event. |
| Scope creep | Frames start redesigning VFX, light, UI, or outcomes. | Coordination table, clean unbaked assets, independent rollback/acceptance owners. |

## 19. Exact affected-file map and dependencies

This is the consolidated implementation map; phases above define when each entry becomes eligible.

| Path | Planned change |
|---|---|
| `src/artCatalog.ts` | Add `AME_ART`; add optional animation/rollout fields; exact Ame/kitten/goblin animation registrations only in MVP; own `ArtFamily`, `ResolvedSpriteArt`/`ResolvedWeaponGeometry`, and `resolveSpriteArt`; provide complete static compatibility records for all reachable weapons before their sites migrate. |
| `src/artCatalog.test.ts` | Animation ID validity; canonical natural-size/geometry completeness; rollout source's independent natural-size/geometry and strict version expiry; source-record/weapon-registration exhaustiveness; static fallback resolution. |
| `src/assets.ts` | Current-level animation candidate collection; leave existing non-animation preload behavior compatible. |
| `src/assets.test.ts` | Tier collection/dedupe/no-whole-catalogue assertions; authored IDs and generated kitten/goblin selectors resolve from a concrete `LevelDefinition` and match finite generator catalogues. |
| `src/animation/*` | New types, generated registry, validator bridge, pure selector/result contract, clock, loader, shared-motion/sprite-quality consumer, adapter, renderer, and tests. |
| `src/vfx/types.ts`, `src/vfx/presentationDirector.ts` | Director-owner amendment for canonical `PresentationClockSnapshot` with numeric run ID; director constructs it and keeps cancel/lock methods private from sprites. |
| `src/App.tsx` | Incremental replacement of exact player/battle/rescue/follower sites; capture presentation start/playback IDs; no gameplay outcome edits. |
| `src/styles/sprite-animation.css` | Animation-owned namespaced structural registration/body/weapon/code-placeholder rules only; no keyframes, animation declarations, or transitions. |
| `src/styles/motion.css` | UI-owned destination for animation’s namespaced secondary-motion/keyframe/transition rules and reduced-motion selectors. |
| `src/styles.css` | Migration seam only: remove migrated legacy selectors/import the layered sheet if still required; never append another late override block. |
| `src/combatPresentation.ts` | Prefer no semantic change; export/use existing plan data as needed by adapter. |
| `src/combatPresentation.test.ts` | Exact sprite-mapping duration/boundary contract. |
| `src/jumpPresentation.ts` | Stage-3 adapter consumes its duration/motion data and Plan-02 jump-landing→portal-departure composite; no gameplay jump/portal semantic or ordering change. |
| `src/magicEffects.ts` | No sprite-owned change expected; remains the deterministic lock-colour/particle recipe consumed by the VFX director. |
| `src/game/visualPersonality.ts` | Later compatibility mapping between frame clips and retained outer CSS motion. |
| `src/game/followerTrail.ts` | Optional presentation-safe direction/delta exposure in Stage 3; no trail/path behavior change. |
| `scripts/art_pipeline.py`, `scripts/art_pipeline/animation.py` | Shared art entry point plus animation build/`--check`; no parallel processor. |
| `scripts/art_pipeline/requirements.lock.txt` | Single art-owned Python/Pillow/optional-NumPy wheel lock and Python/libwebp/zlib fingerprint gate used by all art subcommands. |
| `scripts/art_pipeline/{cutout,encode,validate,proofs}.py` | Reused deterministic processing, validation, and ignored proof outputs; extend rather than fork. |
| performance-owned `scripts/performance/**` asset/bundle/package harnesses and generated runtime asset manifest | Cross-resolve every animation URL/source record; owner/route/level/tier/CSS-size/DPR/offline/byte/hash checks; S03/S07/S09 and package reports. Use the exact accepted Plan-07 path once its Phase 0 lands rather than creating an animation-only inventory. |
| shared art source-record schema and `docs/source-assets/manifest.json` | Animation clip/frame lineage extends the art source of truth; generated inventory must stay current. |
| `docs/source-assets/{characters,friends,enemies}/**` | Approved masters, model sheets, pose inputs, cleaned source frames, and source records. |
| `docs/source-assets/weapons/{star-sword,comet-spear}/v01/**` | MVP action-compatible weapon evidence/master records, hashes, geometry, exact safe-inset exception or re-registration decision, and rotated clipping proofs; no new runtime weapon derivative is required by the 16-file frame pack. |
| `docs/source-assets/weapons/{flower-sabre,moon-wand,leaf-blade,sun-mallet,bubble-bow,cupcake-mace}/v01/**` | Hash-locked current-runtime evidence and complete `legacy-static-only` compatibility records before those render sites migrate; no animation frames or new derivatives. |
| `public/assets/sprites/**` | Immutable content-hashed lossless WebP runtime frames. |
| `package.json` and lockfile | Shared `art:check`/targeted animation check command and pinned `jsdom` development dependency. |
| `.github/workflows/ci.yml` | Run the locked derivative/hash check in the Windows job; keep Ubuntu on platform-neutral manifest/URL/build checks until cross-platform byte identity is proven. |

No new runtime dependency is planned. Optional ImageMagick/FFmpeg tools remain user-scoped/ephemeral and cannot be a build or CI prerequisite.

## 20. Definition of done

The MVP is complete only when all of the following are true:

- The 16-file/13-new-drawing scope is unchanged or explicitly reapproved; nothing is bulk-filled merely to complete a catalogue.
- Ame, kitten, and goblin pass identity, silhouette, pivot, scale, alpha, weapon, actual-size, and reduced/static reviews.
- `AME_ART`, `ANIMAL_ART.kitten`, and `ENEMY_ART.goblin` resolve through the shared catalogue; family/catalogue-key/art-ID/animation-ID values cross-resolve without filename inference.
- Star Sword and Comet Spear have hash-locked art-owned records, complete approved weapon geometry, and exact safe-inset/re-registration evidence; the other six reachable weapons resolve as `legacy-static-only` before their render sites migrate, so no action pose uses guessed geometry.
- Every frame passes its Plan-03 safe inset (or approved family-wide legacy exception), strict encoder gutter, alpha≥8 bounds/fringe, and 2–4 px transparent-RGB dilation policy after final resize.
- Section-7 frame boundaries derive from the current presentation plans and all timing boundary tests pass.
- Canonical `SpriteArt.src` works with the feature disabled and after every simulated manifest/frame/decode failure; the prior URL is requested only after canonical failure and is removed after one verified release; dual URL failure produces the stable code-native silhouette.
- Sprite presentation imports `MotionMode`/`PresentationClockSnapshot` only from `src/vfx/types.ts`; numeric run ID/signal equality and a later-paint elapsed projection are tested, and no sprite receives director cancel/lock methods.
- Gameplay outcomes, event order, input cadence, audio/VFX semantics, and victory gating are byte-for-behavior equivalent with animation enabled/disabled.
- MVP feature-off tests preserve current jump+portal characterization. The Plan-02 landing→departure feature-on contract remains a Stage-3 acceptance gate, not a prerequisite for declaring the Phase-2 MVP complete.
- Frame ticks produce zero App/maze-grid commits.
- Every field rendition is ≤100 KiB; eager/Tier-1 transfer is ≤1.0 MiB, cumulative one-level transfer is ≤1.5 MiB, total MVP pack is ≤1.6 MiB, and the strong decoded animation cache is ≤16 field-equivalent units.
- Page hide, level switch, navigation, unmount, Strict Mode, slow decode, and late decode cannot replay a stale action or update an unmounted renderer.
- Obscuring modals pause board ambience/postcritical preloads and closing them rebases without catch-up.
- Reduced/static modes select meaningful poses, stop nonessential loops/spatial motion, and do not request suppressed frames.
- Board sprites remain decorative and current semantic labels/live regions pass regression checks.
- Structural rules are isolated in `sprite-animation.css`; all sprite motion/keyframes/transitions and reduced-motion rules are reviewed in UI-owned `motion.css`.
- The generated global inventory has no missing/orphan/dynamic URL, every frame passes direct static-host and offline packaged decode, and the pack stays within global runtime-media/portable/NSIS and per-family growth limits or has an explicit approved offset/exception.
- Runtime JS/CSS has an approved gzip allocation/offset; PR runs deterministic asset/build/fallback/cancellation/full+reduced checks, while quiet recorded S03/S07/S09 cohorts meet the exact section-13.5 frame/long-task/retained-memory gates.
- Processor `--check`, unit/component tests, production build, the correct nonflaky performance lanes, `git diff --check`, and final repository-scope audit all pass.
- The kill switch and per-family manifest rollback have been exercised, not merely documented.
- Hard rollback passes the generated reachability inventory in the same change: no removed catalogue consumer leaves a manifest, runtime file, or active source declaration orphaned, and post-cleanup rollback restores tagged legacy files first.

## 21. Planning-tool audit

- **In-app browser:** used against a temporary local Vite server to inspect computed motion timings, action presentation, and actual board sprite sizes. No screenshots/assets were added.
- **ImageGen:** used for two preview-only precise-edit assays. Both exposed unacceptable global redraw/canvas/background drift; outputs stayed outside the repo and directly informed the source-master/mask/human-cleanup workflow.
- **Skill search:** the curated skill installer catalogue and experimental location were searched for a precise sprite-animation, game-animation, image-sequence, or asset-pipeline skill. No trusted scoped match was available, so no skill was installed; user skill state and repository state were left unchanged.
- **Pillow/tooling:** all inventory and PNG/WebP comparisons were read-only/in-memory. Existing terrain texture and dressing `--check` paths passed. The observed user-scoped stack was Python 3.14.3, Pillow 12.2.0, bundled libwebp 1.6.0, zlib-ng `1.3.1.zlib-ng`, and NumPy 2.5.2; these observations informed the future shared lock but did not modify it. ImageMagick/FFmpeg were evaluated as optional QA/preview aids but were absent and unnecessary for this planning pass.

## 22. Research access log

All sources in this section were accessed 2026-09-02.

### Limited animation and acting

- [Kitamura et al., “Motion Frame Omission for Cartoon-like Effects” (2014)](https://www.cgg.cs.tsukuba.ac.jp/projects/2013/motion_frame_omission/index.html)
- [Byron Fong, “Animating for Interactivity” (2023)](https://doi.org/10.1177/17468477231182910)
- [Game Developer, “12 principles for game animation” (2021)](https://www.gamedeveloper.com/game-platforms/12-principles-for-game-animation)
- [Walt Disney Animation Studios, “Animation”](https://www.disneyanimation.com/process/animation/)
- [Animation Mentor, “Anticipation”](https://www.animationmentor.com/blog/anticipation-the-12-basic-principles-of-animation/)
- [Animation Mentor, “Why All Animators Need to Master the Moving Hold”](https://www.animationmentor.com/blog/why-all-animators-need-to-master-the-moving-hold/)

### State, timing, and lifecycle

- [Unity 6, “State machine basics”](https://docs.unity3d.com/6000.0/Documentation/Manual/StateMachineBasics.html)
- [Godot, `AnimatedSprite2D`](https://docs.godotengine.org/en/stable/classes/class_animatedsprite2d.html)
- [MDN, `requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)
- [React, `useEffect`](https://react.dev/reference/react/useEffect)
- [MDN, Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)

### Formats, registration, and delivery

- [MDN, image file type and format guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types)
- [web.dev, content delivery networks / HTTP/2](https://web.dev/articles/content-delivery-networks)
- [Unity, Sprite Atlas](https://docs.unity3d.com/2018.3/Documentation/Manual/class-SpriteAtlas.html)
- [Phaser, Textures](https://docs.phaser.io/phaser/concepts/textures)
- [Phaser, Game Object Components](https://docs.phaser.io/phaser/concepts/gameobjects/components)
- [TexturePacker, texture atlas settings](https://www.codeandweb.com/texturepacker/documentation/texture-settings)
- [Google, WebP FAQ](https://developers.google.com/speed/webp/faq)
- [Google, `cwebp` documentation](https://developers.google.com/speed/webp/docs/cwebp)
- [MDN, `HTMLImageElement.decode()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode)
- [web.dev, preload responsive images](https://web.dev/articles/preload-responsive-images)
- [MDN, Canvas pixel manipulation](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas)
- [MDN, AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [MDN, `ImageBitmap.close()`](https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap/close)
- [MDN, Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control)

### Reduced motion and AI-assisted consistency

- [MDN, `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- [W3C, WCAG 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
- [W3C, WCAG 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
- [OpenAI, “The new ChatGPT Images is here” (2025)](https://openai.com/index/new-chatgpt-images-is-here/)
- [“The Chosen One: Consistent Characters in Text-to-Image Diffusion Models” (2023)](https://arxiv.org/abs/2311.10093)
- [DreamBooth, CVPR 2023](https://openaccess.thecvf.com/content/CVPR2023/html/Ruiz_DreamBooth_Fine_Tuning_Text-to-Image_Diffusion_Models_for_Subject-Driven_Generation_CVPR_2023_paper.html)
- [SketchBetween (2022)](https://arxiv.org/abs/2209.00185)

## 23. Final verification record

Final verification was run from `C:\maze-game` after the temporary Vite server was stopped. Port 51827 had no listener.

- `git rev-parse HEAD` → `c6b6628b6e651d18161a4d1302935d3096f665c6`; branch remained `main`, and `git rev-list --left-right --count HEAD...origin/main` remained `0 0`.
- `git diff --check` → exit `0`, with no output.
- Because Git does not include untracked files in `git diff --check`, a separate full-document scan found zero trailing-whitespace lines; 23 level-two sections and 28 balanced backtick-fence delimiters were present.
- `git diff --name-only` → no output.
- `git diff --cached --name-only` → no output. Nothing was staged or committed.
- `git status --short` produced exactly:

  ```text
  ?? docs/plans/
  ```

- `git status --short --untracked-files=all` produced exactly:

  ```text
  ?? docs/plans/01-ui-ux-layout-overhaul.md
  ?? docs/plans/02-graphics-vfx-overhaul.md
  ?? docs/plans/03-magical-girl-art-direction.md
  ?? docs/plans/04-lighting-wall-depth.md
  ?? docs/plans/05-limited-sprite-animation.md
  ?? docs/plans/06-game-design-gameplay-ux-mechanics-plan.md
  ?? docs/plans/07-performance-web-tauri-plan.md
  ?? docs/plans/08-controls-xbox-steam-deck-plan.md
  ```

**Exact changed-file statement:** this sprite-animation planning task created and edited only `docs/plans/05-limited-sprite-animation.md`. It did not modify or stage any other path, did not generate or integrate production frames, and did not create a commit. The seven sibling untracked planning documents shown above were concurrent work and were preserved without edits.
