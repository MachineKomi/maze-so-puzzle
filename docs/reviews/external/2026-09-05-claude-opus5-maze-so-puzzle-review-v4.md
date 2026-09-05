# Maze so Puzzle — independent design & engineering review (v4)

**For:** GPT6 Astra (orchestrator) and the specialist agents
**From:** Claude Opus 5, independent read-only review
**Review date:** 2026-09-05 (fourth pass)
**Reviewed state:** `main` @ `5f7f8c9`, clean tree, `package.json` 0.22.0 — the shipped FP-UI1 release
**Also reviewed this pass:** the v0.22.0 playtest transcript and 53 screenshots across iPad / desktop / mobile

**Companion document:** `V0220-FEEDBACK-RESPONSE.md` — a focused response to the v0.22.0 feedback, with per-item diagnosis and proposals. **If you are planning the next slice, read that one first.** This file is the standing review: the longer-arc findings that outlive any single build.

**Changes in v4:** re-verified everything against the shipped release; recorded the Human's verdict; **the performance section is substantially rewritten with new evidence** (§3); four new items added (`CR-PERF-12`, `CR-FEEL-07`, `CR-UI-17`, `CR-BUG-01…03`); the UI scale finding is now resolved into a single concrete proposal (§6.1).

---

## How to read this — please argue with it

**Everything here is a proposal, not an instruction.** I have read the repository carefully and studied the v0.22.0 screenshots, but I have not played the game and have not seen it on the iPad where the loudest complaint lives. You have both. Where a proposal conflicts with what you know from actual play, actual play wins — and I would rather you take a *diagnosis* and reject its *remedy* than adopt a remedy that doesn't fit.

- **Diagnoses are testable.** Every code claim cites `file:line`. If one is wrong, that matters and I'd want it corrected.
- **Remedies are one option.** I try to give the reasoning so you can evaluate a different remedy against the same logic, and I name alternatives I considered and rejected so you can re-open those choices.
- **Numbers are hypotheses** unless labelled **Measured**.
- **Some of this is taste**, and it's labelled.

**Evidence labels:** **Verified** (read in shipped source) · **Measured** (computed from current constants) · **Assessed** (design judgement) · **Proposal** (needs selection) · **Taste** (preference).

**Item IDs are stable across versions** so decisions can be tracked.

---

## 0. Status

### 0.1 — The Human's verdict on v0.22.0

> *"Overall I think v0220 is a huge improvement. Massive."*
> *"huge improvements everywhere. Really appreciate all the hard work. Huge payoff, much, much closer to the vision and intent, which is awesome."*

That is the right read of these screenshots. The desktop and iPad compositions are the first version that looks like the game the vision document describes. Specifically working now: deck composition and icon scale on wide screens; the Adventure Book with real tabs and lore cards; story cards with circular portraits; the analogue thumb pad ("huge improvement"); the fonts ("really like the fonts now"); the focus treatment ("major improvement over the old oversized green outline"); the separated mute / sound controls; the taster maze picker.

### 0.2 — What has closed since v3

| ID | Item | Evidence |
|---|---|---|
| CR-PERF-01 | `MazeTerrain` memo | ✅ `worldWindow` now stable (`App.tsx:799, :2263`) |
| CR-UI-04 | Modality-aware focus | ✅ `:focus-visible` with `forced-colors` support (`base.css:9-12`) |
| CR-UI-07 | Largest rendition in detail views | ✅ DPR-aware `CatalogueImage`; lore cards shipped |
| PT-37 | Book pages / bestiary / lore cards | ✅ ARIA tabs, per-page scroll retention |
| PT-34 | Restrained focus | ✅ |
| PT-35 | No-scroll victory + friend dances | ✅ composition; ⚠️ see CR-JUICE-05 for why it still reads flat |
| CR-DESIGN-04 | Arithmetic teaching | 🟡 potions show `2 + 3 = 5`; combat and the too-strong gap still missing |
| CR-UI-05 | Anchored stick | 🟡 `ThumbPad` correct; board drag still anchors to Ame |

### 0.3 — What has not moved, in the shipped build

All **Verified** against `5f7f8c9`:

| ID | Finding | Evidence |
|---|---|---|
| CR-FEEL-01 | `DEFAULT_FOV_SIZE = 6`, square | `exploration.ts:4, :77-78` |
| CR-FEEL-02 | No camera dead zone | `tileTravel.ts:75` |
| CR-FEEL-03 | Movement still on `setTimeout` cadence | `movementControls.ts:28` |
| CR-PERF-02 | `MiniMap` memo defeated by two inline allocations | `App.tsx:2539-2540` |
| CR-PERF-03 | `setTouchCursor` on every `pointermove` | `App.tsx:1696` |
| CR-PERF-04 | `useSceneTravel` layout effect has no deps | `useSceneTravel.ts:100` |
| CR-PERF-05 | No `will-change` / `contain` anywhere | grep: zero, only three `will-change: auto` resets |
| CR-PERF-06 | ~151 MB payload; 97 MB OST | unchanged |
| CR-PERF-09 | Quality tiers undefined — **and now proven inert**, see §3.3 | `grep -c 'data-quality="lite"' scene.css` → **0** |
| CR-UI-01 | No numeric UI scale contract | vision spec §4.1 |
| CR-UI-02 | Deck container is `inline-size`; height invisible | `hud.css:2` |
| CR-AUDIO-01…06 | No master chain; `gain.connect(ctx.destination)` | `sound.ts:216` |
| CR-JUICE-01…07 | No ambient life; glyph particles; flat 2 220 ms combat | `magicEffects.ts:16-29`, `combatPresentation.ts:10` |
| CR-ART-01, 05–08 | Wall depth still blur + full-perimeter stroke | `MazeTerrain.tsx:228-258` |
| CR-DESIGN-01…03, 05–07 | Rules, braiding, currency sink untouched | `engine.ts`, `generator.ts:188` |
| CR-RISK-01 | `App.tsx` 2 853 lines | `wc -l` |

### 0.4 — The finding that should shape the next slice

**Every performance defect in this review is present in the shipped build, and performance is now the Human's #1 complaint on all three devices.**

More importantly, I believe I can now explain the two symptoms that looked mysterious:

- **"Turning Surface Quality to Lite didn't help."** Because Lite genuinely does nothing to the maze scene — it adjusts two shadow tokens and one modal backdrop. **Zero** `lite` rules exist in `scene.css`. The performance escape hatch the game offers does not touch anything that costs.
- **"It gets worse the longer you play."** Every rescued friend adds a sprite that carries **both** a `drop-shadow` filter **and** an infinite motion animation — a combination that forces per-frame re-rasterisation. Going 0 → 5 friends permanently adds five of these. Later mazes are also larger, and two of the largest costs scale with maze area.

Full treatment in §3 and in the companion document.

---

## Contents

- §1 Quick wins and sequencing
- §2 Movement, camera, and game feel
- §3 Runtime performance — **substantially rewritten**
- §4 Look and feel: juice, life, impact
- §5 Audio and sound design
- §6 UI and UX — **§6.1 resolved into one proposal**
- §7 Visuals, lighting, effects, animation
- §8 Core game design depth
- §9 Content, story, copy, edutainment
- §10 Programme risks, gaps, discrepancies
- §11 Proposed roadmap revision
- §12 What is working well
- Appendices

---

## 1. Quick wins and sequencing

### 1.1 — Do-now (hours; no visual change; no pending decision)

| ID | Change | Effort |
|---|---|---|
| **CR-PERF-02** | `useMemo` both `MiniMap` props (`App.tsx:2539-2540`) | 2 lines |
| **CR-PERF-03** | Move `touchCursor` to a ref + CSS custom properties | ~20 lines |
| **CR-PERF-05a** | `will-change: transform; contain: paint;` on `.camera-world`, toggled by `data-travel-state` | ~4 lines |
| **CR-PERF-05b** | `contain: strict` on the minimap card | 1 line |
| **CR-PERF-04** | Split `useSceneTravel`'s layout effect | ~15 lines |
| **CR-PERF-12a** | Drop `backdrop-filter` on the touch-joystick marker (`scene.css:580`) | 1 line |
| **CR-UI-17** | Broad `user-select: none` with opt-in text selection | ~6 lines |
| **CR-AUDIO-01** | Master gain → compressor → destination | ~10 lines |
| **CR-AUDIO-03a** | ±5 % pitch jitter on `step`, `bump`, `pickup` | 1 line |
| **CR-BUG-02** | Campaign wrap: branch to surprise instead of `% length` | ~5 lines |
| **CR-BUG-01** | Too-strong pop-up on every deliberate bump | ~5 lines |

### 1.2 — Near-term, needs a decision or design

| ID | Change | Depends on |
|---|---|---|
| **CR-PERF-09** | Make Lite / Static actually reduce cost (§3.3) | a tier definition |
| **CR-PERF-12** | Replace per-sprite `drop-shadow` with baked or `::after` shadows | art pipeline call |
| **CR-FEEL-07** | Held input survives interruptions (`suspendHeldRepeat`) | one design call (§2.7) |
| **CR-UI-02** | `--ui-scale` replaces breakpoints (§6.1) | Human sign-off on scale targets |
| **CR-FEEL-01 + 01b** | Adaptive, rectangular field of view | Human decision + CR-RISK-02 doc/test updates |
| **CR-FEEL-02/03** | Dead zone + rAF movement pump | design *with* Plan 08 and *as* Plan 10's clock |
| **CR-PERF-10** | Terrain bake decision | **must precede Plan 04** |

### 1.3 — Decisions to make before the work they gate

| Decision | Gates | Why now |
|---|---|---|
| **Terrain: live SVG or baked raster?** | Plan 04, 02, 07B | Plan 04 adds lighting to the most expensive surface on screen. Baking makes ambition affordable; deciding later means redoing Plan 04 |
| **Fixed or adaptive FOV; square or rectangular?** | Plan 01 diagrams, Plan 03's art-review scale, Plan 04's analysis, `exploration.test.ts:25` | Four plans encode "6 × 6" |
| **Does the rule set gain a costed mechanic?** | Plan 09's brief | "Much harder and more puzzly" is not achievable under current rules (§8.1) |
| **Who owns SFX?** | juice work in 02, 05, 09 | No plan owns it |
| **Does the movement pump become the co-op fixed clock?** | Plan 10 | Free now, a rewrite later |

---

## 2. Movement, camera, and game feel

### CR-FEEL-01 — The 6 × 6 field of view
**Verified / Measured.** `exploration.ts:4`, unchanged.

| Target | Board px | Tile px | Scroll rate @ 160 ms | Visible fraction of 23×23 |
|---|---|---|---|---|
| 1280×720 | 720 | 120 | 750 px/s | 6.8 % |
| 1194×834 iPad | 706 | 118 | 735 px/s | 6.8 % |
| 1920×1080 TV | 1080 | 180 | **1 125 px/s** | 6.8 % |

With the camera hard-locked, Ame is stationary in screen space and 100 % of the motion signal is background. Reference handhelds sit around 150–250 px/s. At 6.8 % visibility you can never see a junction *and* what lies beyond it, which is why the minimap has had to become a first-class puzzle tool — it compensates for a camera that shows almost nothing.

**Proposal.** Derive the window from board pixels: `fov = clamp(oddNearest(boardPx / 80), 7, 15)`, capped at level size. At 720 px → FOV 9 (80 px tiles, 81 tiles visible, 500 px/s). Whole-maze display for mazes ≤ 13 falls out for free and is probably delightful.

**Note the interaction with performance.** A larger FOV means more objects on screen, which under the current per-sprite filter cost (§3.2) makes things *worse*. **Do the performance work first**, then raise the FOV. With the "only animate near Ame" rule from §3.3, a larger FOV becomes affordable.

### CR-FEEL-01b — The camera window is square, and it wastes space on every device
**Verified / Measured.** `getCameraWindow` applies one `fovSize` to both axes (`exploration.ts:77-78`), forcing `.maze-board { aspect-ratio: 1 }` (`shell.css:9`).

| Target | Board | Available height | Unused |
|---|---|---|---|
| iPad 1194×834 | 706 × 706 | 834 | **128 px** |
| Phone 780×312 | 312 × 312 | 312 | 0 — but **132 px of width** unused |

**Proposal.** Independent `fovWidth` / `fovHeight` derived from the board's actual aspect, and drop `aspect-ratio: 1`. `travelCamera` (`tileTravel.ts:77-78`) and the minimap frame (`MiniMap.tsx:79-82`) already treat axes independently; `getVisibleTileKeys` / `revealVisibleTiles` would need the same. A rectangular reveal changes fog-of-war shape for existing saves — it only ever reveals more, so it should be forward-compatible, but it deserves an explicit decision.

### CR-FEEL-02 — No camera dead zone
**Verified.** `travelCamera` recentres every frame with no hysteresis. **Proposal:** a ± 1.5-tile dead zone inside which the camera does not move, plus critically-damped follow outside it (`camera += (target − camera) × (1 − exp(−dt/τ))`, τ ≈ 140 ms). Keep the existing hard-settle discontinuity path (`useSceneTravel.settle`) — that logic is correct.

### CR-FEEL-03 — Two unsynchronised clocks
**Verified.** Commits from `setTimeout`; presentation from rAF; `TileTraveller.retarget` compensates for phase drift by **changing tween speed** (`tileTravel.ts:70`), so per-step on-screen speed varies by design.

**Proposal — one rAF pump owns time; input expresses intent only:**
```
progress += dt / STEP_TRAVEL_MS
while (progress >= 1) {
  progress -= 1                              // carry remainder, capped at one step
  const dir = freshBuffered() ?? heldDirection
  if (!dir) { progress = 0; break }
  movePlayer(level, state, dir)              // one engine call, rules unchanged
}
```
Constant speed, no first-step-fast-then-pause, frame-rate independent, and reliable cornering via a ~120 ms input buffer. **Please consider building this as Plan 10's fixed clock (CR-RISK-04)** — it already is one.

### CR-FEEL-04 — Cruising speed
After CR-FEEL-01, try ~120–130 ms per step while keeping a single tap identical. At FOV 9 / 125 ms that is 8 tiles/s and 640 px/s — faster *and* calmer than today.

### CR-FEEL-05 — The faint moving dark line (PT-33)
**Verified.** `.camera-world` is percentage-sized then translated by fractional pixels; tile children are percentage-positioned, so edges land on fractional device pixels and antialiasing changes each frame. Snap the composite translate to whole device pixels (`Math.round(v * dpr) / dpr`); give adjacent terrain layers ~0.5 px overlap. A baked terrain raster (§3.4) removes the class entirely.

### CR-FEEL-06 — The rAF timestamp workaround
**Verified.** `useSceneTravel` paints from `performance.now()` rather than the rAF timestamp, with a comment describing main-thread contention. The diagnosis is correct — but it is a workaround for contention whose causes (CR-PERF-02/03/12) are still present. In the healthy case it trades "occasional jerk under load" for small continuous jitter, since `performance.now()` inside the callback varies with callback ordering while the rAF timestamp is shared across the frame. **Re-test once contention is fixed**, and settle it with a measurement (log both clocks for 200 frames under load) rather than an argument.

### CR-FEEL-07 — Held input dies on every interruption *(new in v4)*
**Verified.** `clearHeldInput()` is called at **17 sites** in `App.tsx`, including every interruption path (`:1378, :1415, :1429, :1451, :1454`). It clears timers *and* calls `clearDpadHold()` + `clearBoardPointer()`, discarding pointer-capture and gesture state. So a still-pressed finger produces nothing after a door, a battle or a rescue — the player must lift and re-touch.

The documented intent is legitimate: *"Every safe collision requires a fresh deliberate press. Otherwise one held input floods the live region and bump audio at accelerated cadence."* The remedy is simply too blunt — it discards the *physical input state* along with the *repeat schedule*.

**Proposal.** Split into `suspendHeldRepeat()` (cancels timers, clears queued move and cadence, sets a suspended flag; leaves pointer state intact) and the existing `clearHeldInput()` (retained for genuine boundaries: level load, modal open, visibility change, blur, restart). At interruption sites call the former, then on resolution re-derive direction from the live pointer position and resume from a fresh first-step delay.

**One design call worth making explicitly:** resume automatically after *successful* interactions (door opened, enemy defeated, friend rescued, portal used), and require a re-press only after a genuine *block* (too-strong enemy, locked door). That preserves the anti-flood intent exactly, and matches the Human's description — they are complaining about doors and fights, which are successes.

---

## 3. Runtime performance

*Substantially rewritten in v4 with new evidence. The full per-symptom treatment is in the companion document; this section carries the standing findings.*

### 3.1 — The remaining render defects

**CR-PERF-02 — `MiniMap` memo defeated.** `App.tsx:2539-2540` allocates a fresh `Set` and a fresh filtered array each render, so `memo()` never hits. `MiniMap` renders one `<i>` per tile — up to **576 elements** with up to three `<b>` children each (`MiniMap.tsx:55`). Also worth moving fog/terrain to canvas and keeping only markers as DOM, especially since the Human wants the map *bigger*.

**CR-PERF-03 — Every `pointermove` re-renders the App.** `setTouchCursor` at `App.tsx:1696`, before the direction-changed early exit at `:1660`. Combined with CR-PERF-02, one finger drag reconciles up to 576 elements at up to 120 Hz. The cursor needs no reconciliation — write it to CSS custom properties in the existing rAF, as `useSceneTravel` already does for travel.

**CR-PERF-04 — `useSceneTravel` layout effect has no deps.** Runs on every render doing `querySelectorAll` + three `querySelector`s. Split into a cheap retarget path and a binding path keyed on `[board, runKey]`.

**CR-PERF-05 — No compositor promotion or containment.** Zero `will-change`, zero `contain`, zero `content-visibility` across all stylesheets. The per-frame `translate` is written directly from rAF rather than declared as a CSS animation, so the browser has no advance signal to promote the layer, and a large filtered region is plausibly repainting on the main thread every frame.

### 3.2 — CR-PERF-12 — Filter and animation cost is the dominant GPU load *(new in v4)*

**Measured across the stylesheets:** **47** `drop-shadow` uses, **46** `infinite` animations, **3** `backdrop-filter` uses, **64** `box-shadow` uses.

**Verified — every maze object sprite carries a filter:**
```
scene.css:47    .maze-object                       filter: drop-shadow(...)
scene.css:112   .object-portal                     filter: drop-shadow(...)
scene.css:176   .object-kind-animal .animal-sprite filter: drop-shadow(...)
scene.css:507   .animal-stack .animal-sprite       filter: drop-shadow(...)
scene.css:625   .pet-follower-image                filter: drop-shadow(...)
scene.css:1063  .object-treasure                   filter: drop-shadow(...)
```
Several of these elements *also* carry infinite animations (`item-shine`, `goblin-bob`, `portal-pad-breathe`, `pet-follower-bob`, six `friend-motion-*`, seven `enemy-motion-*`). **A filtered element that is also animating must be re-rasterised each frame rather than merely re-composited** — this is a fill-rate cost, and fill rate is precisely where an older iPad differs most from a current flagship phone.

`scene.css:1115` chains **three** drop-shadows on one element. `scene.css:580` puts a live `backdrop-filter: blur(2px)` on the touch-joystick origin marker — active exactly during touch movement, when frames matter most.

**This also explains "it gets worse the longer you play":** each rescued friend permanently adds one filtered + animated sprite to every frame for the rest of the maze. 0 → 5 friends adds five.

**Proposals, cheapest first:**
1. **Bake the soft shadow into the sprite art.** Zero runtime cost, visually near-identical, and the art pipeline is already capable of it. This is the single biggest available win.
2. **Or** replace with a static elliptical `::after` under each sprite — reads nearly identically at gameplay scale, costs nothing.
3. **Only animate within ~2 tiles of Ame.** Very cheap, and it arguably looks *better* — a world that wakes as you approach is the ambient-life idea from §4, turning a performance measure into a charm feature. It also makes a larger FOV (CR-FEEL-01) affordable.
4. Drop the joystick backdrop blur, or gate it behind Full quality.

### 3.3 — CR-PERF-09 — The quality tiers are inert *(hard evidence in v4)*

**Verified.** `grep -c 'data-quality="lite"' src/ui/styles/scene.css` returns **0**. Across every stylesheet, `lite` appears exactly twice:
```
comfort.css:7    two shadow tokens simplified
dialogs.css:161  modal backdrop-filter removed
```
**"Surface quality: Lite" does nothing to the maze scene.** And `static` — the strongest setting — only disables *animations*; all 47 drop-shadow filters and the filtered terrain SVG remain fully active. The Human turned the performance escape hatch on, got no relief, and reported exactly that.

**Proposal — define the ladder, then implement it:**

| | **Full** | **Lite** | **Static** |
|---|---|---|---|
| Object `drop-shadow` | as now | baked-in or `::after` ellipse | none |
| Terrain SVG filters | as now | **off** — flat hazard edges | off |
| Wall depth blur | as now | hard offset fill | flat |
| Infinite object animations | all | **only within ~2 tiles of Ame** | none |
| Follower motion loops | all | first 2 only | none |
| Backdrop blur | modals only | none | none |
| Particles / confetti | full | ~40 % | none |

Then assert each tier still communicates the same semantic events. This turns quality tiers from scattered overrides into a contract, and gives Plans 02 and 04 somewhere to put fallbacks rather than inventing them per effect.

### 3.4 — CR-PERF-10 — The terrain decision (before Plan 04)

**Measured.** The terrain SVG surface is `board × (level.width ÷ camera.width)`. A 23-wide maze at FOV 6 on a 706 px board is **≈ 2 706² px ≈ 7.3 MP**, carrying two Gaussian blurs, one morphology filter, three masks and four raster pattern fills.

**Option A — bake once per level** into an `OffscreenCanvas` / `ImageBitmap`, then translate one bitmap. Terrain cost becomes **independent of maze size** (killing the "worse on larger mazes" symptom at the root); all of Plan 04's lighting becomes **free at runtime** because it bakes; the sub-pixel seam class disappears; animated hazards move to a thin separately-budgetable overlay. Cost: a level-load hit, probably 20–80 ms, hideable behind the story card.

**Option B — stay live SVG.** Simpler and fully dynamic, at the cost of a permanent per-frame budget that grows with every effect 04 and 02 add.

**My view, held loosely:** Option A — Plan 04's purpose is adding expensive-looking lighting to the most expensive surface on screen, and baking is what makes that affordable on the device that is already struggling. **But if Plan 04 intends *dynamic* light** — a moving source, or light responding to Ame — Option A is wrong and you should know that now.

### 3.5 — CR-PERF-06 — Asset payload
**Measured, unchanged:** OST 42 tracks / 96.9 MB (every track shipped in A *and* B variants); 88 PNGs / 31.4 MB (twelve terrain textures at 700–890 KB, used only as tiled `<pattern>` fills at a few tiles' period); 232 WebP / 25.6 MB; `public/` ≈ 151 MB, copied verbatim into `dist/`.

### 3.6 — CR-PERF-07 — Three presentation clocks
**Verified.** rAF (travel), `setTimeout` (presentation lifecycles), and 69 + 7 CSS keyframes. Three sources of drift. **Proposal (Plan 02-sized):** one presentation clock — the travel rAF — with presentations expressed as *plans* rather than timers, in the style `combatPresentation.ts` already uses. That file is the model.

### 3.7 — CR-PERF-11 — What to measure

| Metric | Catches | Target |
|---|---|---|
| Long tasks > 50 ms over a 40-step traverse | CR-PERF-02, -12 | 0 |
| Renders/second during a pointer drag | CR-PERF-03 | < 5 |
| Per-step duration σ across 40 held steps | the "stuttery" report | < 8 ms |
| Frames where `.camera-world` repaints | CR-PERF-05 | ~0 while travelling |
| Three-maze session vs fresh load: DOM nodes, JS heap, audio voices | the "gets worse" report | flat |
| Level-load → first interactive frame | guards a terrain bake | < 400 ms |

**Capture these on the actual iPad.** That is where the complaint lives and it is the device the current evidence set does not cover.

---

## 4. Look and feel: juice, life, impact

None of this has started, and the v0.22.0 victory work proves the craft exists — 32 authored species signatures, grounded, translation-and-rotation only. The proposal is to spend that craft in *ordinary play*.

### CR-JUICE-01 — The world is static between events
**Verified.** Of 69 keyframes, the ambient ones are all *object* animation. Nothing reacts to Ame passing; terrain doesn't breathe; empty space has no incidental motion.

**Proposals, cheapest first:** **(a) Proximity reaction** — decorative elements within ~1 tile lean, wobble or brighten. Highest juice-per-line item in this document, and it composes with the "only animate near Ame" performance rule in §3.3. **(b) Terrain breathing** — ≤ 1 % oscillation at 6–10 s, desynchronised. **(c) Sparse themed motes.** **(d) Board reaction reserved for genuinely big moments**, as a transform on an inner layer, never the layout box.

**Discipline:** if a reviewer can describe an ambient animation unprompted, it's too strong.

### CR-JUICE-02 — Movement lacks anticipation and follow-through
Linear interpolation is correct for the camera and wrong for the character. **Proposals:** ease the *sprite* while keeping authoritative position linear; ~60 ms / 4 % squash on arrival; 40–60 ms anticipation lean on turn; ~80 ms follow-through on stop; and reconsider the vertical hop, which reads well with discrete movement and fights continuous movement.

**For Plan 05:** most of this needs **no new frames** — it is timing and transforms on existing art. That may change how Plan 05 should be scoped.

### CR-JUICE-03 — Impact language
Hitstop (40–80 ms freeze on contact), an impact flash (`brightness(3) saturate(0)` for ~50 ms), a directional knock, and a single expanding ring. All should read as sparkle and light, never violence — the Polite Sword Rule fiction is doing valuable work.

### CR-JUICE-04 — The follower chain is the best asset and is barely used
The ripple (staggered delighted hop down the line on treasure/defeat/door — scales with the player's success); gather-and-string (bunch when idle, string when moving — the Chao-garden feeling, and it would **mask several PT-40 trail edge cases**); occasional glances; rare lines using the `visualPersonality` greetings that already exist and are unused in play.

### CR-JUICE-05 — Celebration should scale with significance
**Verified.** `COMBAT_VICTORY_DURATION_MS = 2220`, flat. `RESCUE_PRESENTATION_MS = 900`, `DOOR_OPEN_PRESENTATION_MS = 1320`, all flat. This is in direct tension with the Human's own "more battles" request — at 2.2 s each, more battles means more waiting.

**Proposal — a significance model** from data the engine already emits: relative Power gain, closeness of the fight, first-of-kind (now available via `game/discovery.ts`), milestones. **The walkover case is where the "Level 2 Cheat Skill" fantasy lives:** it should be shorter *and funnier* — Ame taps the guardian, it falls over delighted.

**This also applies to the victory screen** (see the companion document §5): it currently reads as a receipt — five stacked bands of equal weight, the rescued friend small and centred, the reward at the bottom. It needs a hero, a sequenced reveal, a counting-up number, and confetti that doesn't just stop.

### CR-JUICE-06 — Particles are Unicode glyphs
**Verified.** `magicEffects.ts:16-29` uses `♥ ✦ ❀ ★ ◆ ☀ •` as door-burst particles; `ThumbPad.tsx:4` uses `▲ ◀ ▶ ▼`; the touch cursor falls back to `"✦"`. These resolve through the font stack, so several may render as full-colour emoji on iPadOS and monochrome on Windows — **the effect art may look materially different on the two primary review devices**, which is invisible in a screenshot comparison but reads as unpolished in motion. Also an art-direction mismatch: a project producing 512 px authored renditions of everything has typography for sparkles.

**Five-minute check:** screenshot a door burst on iPad and Windows side by side. **Fix:** inline SVG shapes via `<use>`, then a small authored particle set with a documented vocabulary (gold = reward, mint = friend, lilac = magic, coral = impact).

### CR-JUICE-07 — Ame needs an idle and a discovery pose
Idle breathing (~2 % at ~3 s); a long idle after ~8 s; a held ~400 ms discovery pose on pickup/rescue so *she* is the subject rather than the UI. Three poses, not three animations — which matches the vision spec's own "strong held poses over frame count".

---

## 5. Audio and sound design

Nothing has changed here, and **no plan owns SFX** — the roadmap mentions it once, in passing.

**CR-AUDIO-01 — No master chain.** `sound.ts:216` connects each voice's gain **directly to `ctx.destination`**. Up to 24 raw oscillators sum linearly and can clip — worst exactly when the game is most exciting. **~10 lines:** master gain (~0.8) → `DynamicsCompressorNode` (threshold −18, ratio 4, attack 0.003, release 0.15) → destination.

**CR-AUDIO-02 — Pure tones only.** Every voice is sine/triangle/square/saw with an exponential envelope. No noise, no filter, no space. This is the ceiling on how the game can sound. **~100–150 lines, zero payload:** a white-noise buffer through a `BiquadFilterNode`; a lowpass envelope on tonal voices; a procedurally-generated 0.6 s convolution impulse or a cheap feedback delay; and layering (transient + body + tail — `doorOpen` already does this and is the best cue in the file).

**CR-AUDIO-03 — The step sound.** `step: [[420, 0, 0.045]]` — one 45 ms sine at fixed pitch, 6–8× per second, the sound the child hears most. Pitch jitter (one line); filtered noise instead of a tone; per-terrain variation (lovely world-building — the child learns the floor changed by ear).

**CR-AUDIO-04 — The ascending pickup chain.** The established answer to *"must not get annoying when hoovering"*: consecutive pickups within ~900 ms step up a pentatonic scale, capped at 8–12, then reset. Repetition becomes progression; collecting many feels *better* than collecting one. **Highest-value audio item, and it serves a stated requirement.**

**CR-AUDIO-05 — Ducking.** Music down ~3–4 dB for ~400 ms under significant cues.

**CR-AUDIO-06 — Ownership.** A short plan, or a named workstream in Plan 02 (a sparkle and its sound are one event). **Practical note:** iPad speakers roll off below ~500 Hz, and `combatImpact` runs 150 → 58 Hz — likely near-inaudible on the primary target device.

---

## 6. UI and UX

### 6.1 — CR-UI-02 — One root cause produces both the good desktop result and the bad mobile result *(resolved in v4)*

**Measured.** The mobile screenshots are 2340 × 936 device pixels ≈ **780 × 312 CSS px** in landscape.

```
layout.ts:  compact     = h < 600 || w < 800     →  true
            minimumDeck = 440
            board       = min(312, 780−440−8)    = 312
            deck        = 780 − 312 − 8          = 460
```
**The deck is larger than the maze board.** `mobile-maze01.jpg` confirms it: the board is ~27 % of screen width; deck plus thumb pad take ~72 %.

The Adventure Book (`book.css:125-128`) responds **only to width**, via breakpoints at 1500 / 1280 / 900 / 700 px. At 780 px wide it takes the small-tablet branch and renders tablet-sized cards into a **312 px tall** viewport — hence `mobile-beastiary.jpg`: three enormous cards, one row visible, page heading and counter scrolled away, and "Achievements" wrapping to "Achieveme / nts".

The deck still declares `container: adventure-deck / inline-size` (`hud.css:2`), so **height is invisible** to every `cqw` clamp.

**So one root cause — width-only responsive reasoning — produced both results.** Desktop improved this round largely because `minimumDeck` rose to 480–520, widening the deck and pushing the `cqw` clamps into a useful range. That worked on wide screens and backfired on short ones.

**Proposal — one scale factor instead of breakpoints.** This is what the Human's *"same layout, smaller elements"* means mechanically:

```css
--ui-scale: clamp(0.55, min(100cqw / 1280, 100cqh / 800), 1.6);
```
Sizes become `calc(96px * var(--ui-scale))` rather than `clamp(44px, 9cqw, 80px)`.

| Device | Scale | Result |
|---|---|---|
| Phone 780×312 | ~0.55 | Same layout at 55 % — exactly what was asked for |
| iPad 1194×834 | ~0.93 | Close to today's good result |
| Desktop 1280×720 | ~0.90 | Close to today |
| TV 1920×1080 | ~1.35 | Scales **up** for couch distance — currently capped by clamp maxima |

Supporting changes: `container-type: size` on `.adventure-hud`; retire the Book's four width breakpoints in favour of the same scale plus one or two genuine `cqmin`-driven column changes; keep a floor (~0.5) below which the existing emergency composition takes over.

The appeal is that this is *fewer* rules than today — one variable replaces a large set of breakpoints and clamps, and it makes the Human's stated preference the default rather than something engineered per screen.

**Also rebalance board vs deck on short viewports** (`deck = w × clamp(0.34, 480/w, 0.42)`), and let the camera be rectangular (CR-FEEL-01b) so the board fills its rectangle. At 780 × 312 that gives deck ≈ 328, board ≈ 444 — the maze becomes the largest thing on screen.

### CR-UI-01 — A numeric scale contract
**Assessed, unchanged.** Every UI requirement is a property — "generously sized", "as much useful space as the screen permits". None is falsifiable.

**Proposal — a table in the vision spec, checkable with a screenshot and a ruler:**

| Element | 1280×720 | 1194×834 | 1920×1080 | 844×390 |
|---|---|---|---|---|
| Minimap edge | ≥ 300 | ≥ 300 | ≥ 420 | ≥ 120 |
| Friend / bag slot | ≥ 88 | ≥ 88 | ≥ 120 | ≥ 48 |
| Utility button icon | ≥ 44 | ≥ 44 | ≥ 60 | ≥ 30 |
| Ame portrait / Power | ≥ 96 | ≥ 96 | ≥ 130 | ≥ 48 |
| Body text (glyph height) | ≥ 16 | ≥ 16 | ≥ 20 | ≥ 14 |
| Unallocated vertical space in deck | ≤ 24 | ≤ 24 | ≤ 32 | ≤ 16 |

*(CSS px. **Replace with your own numbers** — the value is that numbers exist.)* Xbox's guidance measures **visible glyph body height**, not declared font-size: a 44 px button with a thin 11 px label is not a large control.

Plus: **the deck's content scales with the deck's size; unallocated space in the deck is a defect, not a layout outcome.** And a **visual gate** — a side-by-side contact sheet at five viewports, Human-approved, as a named deliverable. With `--ui-scale` in place, a build check that prints computed sizes at five viewports to JSON and diffs against this table makes the whole thing mechanical.

### CR-UI-17 — Text selection during gameplay *(new in v4)*
**Verified.** `user-select: none` appears in exactly **two** places — `.maze-board` (`shell.css:9`) and `.thumb-pad` (`hud.css:85`). Everything else is selectable, so any drag beginning on or crossing the deck starts a selection. The Human reports this on both touch and desktop.

**Proposal:** broad `user-select: none` at shell/book level, re-enabled only where selecting text is useful (story body, lore card prose, `[data-selectable]`). Add `-webkit-touch-callout: none` on board and pad to suppress the iOS long-press callout, and `-webkit-tap-highlight-color: transparent`.

### CR-UI-03 — One moment, one obvious action
Partly done. **Proposal — the rule, so it stops recurring:** every dialog has exactly one primary action and at most one secondary; a dismissal control exists only when dismissing means something *different*; clicking anywhere on an acknowledgement dialog performs its primary action.

### CR-UI-04 — Focus ✅ done
`:focus-visible` with plum outlines, component-specific insets, `forced-colors` support. **Remaining, from v0.22.0 feedback:** the Human notes a dark border reads as a *boundary* rather than an *invitation*. Suggest a soft warm glow plus a 2–3 px lift and ~2 % scale on **hover**, keeping the plum/gold ring for `:focus-visible` only. `--button-depth` already exists to build the lift from. Most of a button's "juice" is in the *press*, which currently gets less treatment than the hover.

### CR-UI-05 — Board drag anchors to Ame
**Verified.** `moveDirectionFromPointer` (`App.tsx:1632-1633`) computes the origin from Ame's screen position. **`ThumbPad.thumbDirection` (`ThumbPad.tsx:6-11`) already implements the correct behaviour** with a 0.20 deadzone and diagonal hysteresis — the board drag can reuse that exact function, substituting `pointer.origin` (already stored at `:1689`) above a small movement threshold while keeping tap-relative-to-Ame below it.

### CR-UI-06 — Transients must never affect layout
Done for the feedback band. **Generalise as a rule** so it can't regress. Note the reserved band is empty most of the time (`desktop-maze-large.jpg`) — consider a resting state (the objective in miniature, or the last event) so the space is never dead.

### CR-UI-07 — Largest rendition ✅ infrastructure done
**Remaining contract to state:** any detail view resolves the largest crisp rendition, never an enlarged field sprite; locked achievements show greyed real artwork, not `?`. Worth writing down so a future agent doesn't tidy it back.

### 6.2 — Ambitious proposals (argue with these hardest)

**CR-UI-08 — Diegetic UI: the deck is Ame's adventure kit.** The map as folded paper with creases; the bag as actual pockets; friends peeking over a basket edge; Power as a pinned badge; utilities as enamel pins. Trails' notebook and Kirby's UI read as *game* rather than *app* because they are objects with implied physicality. Maze's tokens already contain the vocabulary (`--rim`, `--button-depth`, `--surface-depth`). Committing to the *metaphor* also solves "what goes in the empty space" automatically — an object has natural composition; a dashboard doesn't. **Discipline: material and shape are diegetic; text and hit targets stay ruthlessly clean.** Cheapest test is a single static mockup before any code.

**CR-UI-09 — Reconsider the minimap as a minimap.** *(Taste, held loosely.)* An abstract grid of coloured squares with a 0.75 rem legend is a hard abstraction for a young child — and the presence of a legend is itself a signal. A treasure-map treatment (hand-drawn path, tiny sprite landmarks, parchment fog, Ame as a small version of *her*) would be more readable and more beautiful. **Risks:** at 23×23 in a 300 px map, cells are ~13 px — sprites need a dedicated tiny-icon set. A hybrid (schematic terrain, pictorial landmarks) is probably the sweet spot, and canvas would suit it better than 576 DOM nodes.

**CR-UI-10 — Power should be the hero.** It is the core mechanic, the core educational content, and the number the game is about — currently one pill among pills, sharing a visual language with two currencies that do nothing (§8.3). Give it its own tier: larger, differently shaped, adjacent to Ame's portrait, animated on every change. If gold and Science stay sinkless, consider whether they belong on the play HUD at all.

**CR-UI-11 — The objective should be a picture.** *"Build Power 99, bring home the Sunny Key, and return for the Rainbow Guardian!"* is lovely writing and unreadable to the target player. Render it as `[key] × 1 · [star]` with minimal text; keep the prose for the parent. The engine already knows exactly what is required (`hints.ts:98`).

**CR-UI-12 — The one-glance test.** Show a screenshot for one second, then hide it: can someone say what to do next? Cheap, fast, catches what numbers miss.

**CR-UI-13 — A small motion vocabulary.** Appeared / changed / became available / waiting / consumed / panel-enters, each with one consistent treatment. Test: could a player learn what a motion *means* without being told?

**CR-UI-14 — Couch and TV distance.** 1080p currently hits the clamp *maxima*, so a TV gets desktop sizing. Large viewports should signal *scale up*, not *add columns* — `--ui-scale` handles this directly.

**CR-UI-15 — The moments around play.** First run (the first step Ame ever takes should feel like the game noticed) and returning ("Welcome back!" with the last friend rescued). `PlayerProgress` holds everything needed.

---

## 7. Visuals, lighting, effects, animation

**CR-ART-01 — Wall depth needs extrusion, not a drop shadow.** **Verified unchanged** (`MazeTerrain.tsx:228-258`): a flat fill offset 0.10 tiles and Gaussian blurred, plus a white stroke applied to the **entire** path including unlit edges. That reads as a sticker floating above the floor. **Proposal:** an offset side-face copy clipped to the union; a directional top-face gradient; a short tight contact shadow rather than a drop shadow; edge highlight on **lit sides only**; ambient occlusion at the floor seam. `lightVector()` already resolves one light per level. **Sequencing depends entirely on §3.4** — if terrain bakes, all of this is free at runtime.

**CR-ART-05 — A cheap lighting model.** Three values rather than a gradient (already the Art Bible's language for characters; applying it to terrain would unify a scene that has painterly characters on flat ground); a warm/cool split (does more for perceived depth than any blur, and is what makes stylised art look *painted* rather than *tinted*); a subtle hero light on Ame (she becomes the brightest thing on screen — important as FOV grows); and a check that the level light direction actually agrees with how sprites were lit in source art.

**CR-ART-06 — Per-theme colour grading and vignette.** Twelve themes differentiated mainly by texture. A per-theme grade changes *how the place feels* rather than *what things look like* — a stronger axis. One filter and one overlay per theme, defined beside the existing `floorTreatment`/`wallTreatment`. **Caution:** check the darkest theme against the smallest UI text over the board.

**CR-ART-07 — Depth cueing.** Subtle contrast/saturation falloff away from Ame. Can share the CR-ART-05 overlay. More valuable as FOV grows.

**CR-ART-08 — Effect hierarchy and simultaneity budget.** Ambient (always on, below notice) / Incidental (< 400 ms, may overlap) / **Event (at most one at a time)**. What makes big moments feel big is not that they are louder but that everything else gets quieter. Gives Plan 02 a decision framework rather than a list, and gives the quality ladder a natural axis to degrade along.

**CR-ART-02 — Sprite blur during animation (PT-38).** Set `will-change: transform` *before* the animation starts; avoid animating scale upward from rest; check no ancestor applies a fractional `scale` alongside a fractional `translate`.

**CR-ART-03 — Poison bubbles.** **Verified unchanged** — four circles in a single tiled `<pattern>` (`MazeTerrain.tsx:104-111`), so every tile is identical and in phase. A pattern fundamentally cannot vary per instance. Use a larger multi-tile pattern with hand-varied phase, speed and size; slow it substantially; vary radius, speed and opacity *together*.

**CR-ART-04 — Two principles for the Art Bible.** A motif on everything stops being a motif. Symbols should be stylised, not literal.

---

## 8. Core game design depth

*Unchanged — nothing here has moved, and this is the section that most needs the Human's own judgement.*

### 8.1 — CR-DESIGN-01 — Nothing is ever spent, so no decision has a cost
**Verified.** Power is monotonically increasing; sword/boots/spring boots/antidote leaf are permanent booleans; keys are permanent **and explicitly reusable** (`hints.ts:50`); gold and Science have **no sink**; there is no health, no lives, no timer. With no opportunity cost there is never a choice between two goods, so the dominant strategy in every maze is *explore exhaustively, collect everything, leave*.

**This is the ceiling on the whole game.** Plan 09 can add twenty-four beautiful themed mazes and they will all still be solved by walking everywhere.

**Options, by depth ÷ frustration risk. Pick one.**
- **Option B — Ice and momentum (recommended; already PT-14).** Makes *movement itself* the puzzle. High depth of a different kind to Power arithmetic; teaches prediction and consequence, which the vision spec names as targets. Very low frustration risk. **Low solver risk — a slide is one atomic transition** (CR-RISK-03).
- **Option A — Single-use keys with a confirmation.** Creates the classic legible "which door?" decision and makes the minimap load-bearing. **Significant solver risk**, and only interesting *after* braiding — in a tree, "which door" has no texture.
- **Option C — Counted currency gates.** Better as a currency sink (§8.3) than as puzzle depth.
- **Option D — Consumable Power. Not recommended** — inverts the emotional promise, creates unwinnable states, contradicts the Polite Sword Rule.

**If no rule change is accepted**, the campaign should lean fully into being a warm exploration-and-collection game — a legitimate product the art, music, friends and story carry easily. But then **Plan 09's "much harder and more puzzly" brief should be revised**, because setting a specialist a goal the rules cannot support will produce another round of disappointment.

### 8.2 — CR-DESIGN-02 — Generated mazes are trees; braid them
**Verified.** `carvePerfectMaze` (`generator.ts:188-247`) never re-opens a wall; `carveDeadEndRooms` adds explicitly single-doorway chambers. Topology remains a tree: exactly one path between any two tiles, so **no route choice exists**; every wrong turn is fully retraced; every leaf is a pure penalty; followers must reverse through the player's own trail.

**Proposal — ~30 lines.** After carving, before object placement: enumerate dead ends (`floorNeighbors` already does this); for a seeded 35–50 % knock out one wall connecting to a *different* corridor, preferring the longest new loop; never remove a border wall; never create a 2×2 open block outside a room; re-run the existing solver validation. **Apply a loop budget to authored levels too** — measurable from the terrain grid, therefore gateable in tests.

### 8.3 — CR-DESIGN-03 — Gold and Science have no sink
**Verified.** No spend, cost, purchase or exchange path exists. The only proposed sink is Science → Friend Eggs in Plan 10, the last major plan. **Proposals:** pull Science → Egg forward, decoupled from co-op (a minimal version needs no garden simulation and makes Science *"the currency that collects friends"*); or gold buys Book cosmetics. Otherwise consider hiding the second currency until it means something.

### 8.4 — CR-DESIGN-04 — Teach the subtraction 🟡 half done
`mapNotices.ts:33` now shows `Power Potion! 2 + 3 = 5`. **Two halves remain:** combat still shows only `+5!` (`:53`) though `powerBefore`/`powerAfter` are in the event; and the too-strong dialog shows a side-by-side comparison but **not the gap** — *"Ame needs 5 more Power!"* is the teachable fact and should be the animated star of the moment.

### 8.5–8.7 — Size ladder, interest rhythm, guarded optional battles
Encode "mazes over 16×16 should be rare" as a rule (the generator's difficulty ceilings at `generator.ts:122-127` scale primarily by *size*, contradicting the vision spec). Adopt a measurable interest-rhythm constraint (something notable every ~8 tiles between required objectives). Make optional guardians visibly *guard* something.

---

## 9. Content, story, copy, edutainment

### CR-CONTENT-01 — Two voices, and one a child cannot read
**Verified, unchanged.** The feedback voice is excellent (*"Spring boots found! Boing!"*). The hint and blocker voice is not:
- `hints.ts:105` — *"The next required goal is the maze weapon. Friends and treasure are optional adventures."*
- `hints.ts:53` — *"Matching flower portals are a persistent pair…"*
- `App.tsx:1422` — *"Goblin: 12 Power. Ame is safe at 7; explore, then return."*
- `App.tsx:2689` — the secondary button reads **"Show Required Path"**

**Proposals:** rewrite hints in the feedback voice; make Tier 0 **picture-first**; show direction *spatially* (pulse the thumb pad, arrow on the board) rather than "Try left"; rename "Required Path" to something a child could ask for. **Keep the story interludes exactly as they are** — read-together adult voice, and genuinely lovely. The rule: **story = adult read-aloud; feedback and hints = child-direct.**

### CR-CONTENT-02 — Ame's favourites into mechanics
Numberjacks → give Power numbers a face at key moments. *Killing Slimes* → the game's true genre; argues for no-fail design and a visible long-term collection. *Level 2 Cheat Skill* → **reward over-preparation**; a walkover should be short *and funny*. Ragnarök/Idle Poring → reward showers + pickup chains; bestiary as a *collection* with a "New!" moment. Trails → followers occasionally speak (greetings exist and are unused). Pokémon/Fantasy Life → habitat logic is the emotional reason authored rescue ecology matters. Gurumin → impact language. Paw Patrol/Peppa → one clear problem per chapter as the campaign grows to 24.

### CR-CONTENT-03 — Celebrate the friends
See CR-JUICE-04. The victory screen proves the craft exists; the proposal is to spend it in ordinary play.

---

## 10. Programme risks, gaps, discrepancies

**CR-RISK-01 — `App.tsx` is 2 853 lines.** 13 % of the source tree in one file, owning game state, presentation timers, input, modal state, scene render and HUD wiring. Plans 02, 04, 05, 08, 10 and UI-02 all need to modify it. **Proposal — one bounded, behaviour-preserving extraction before Plans 04/02/05/08:** `usePresentationQueue`, `useMovementInput` (home for the rAF pump), `useLevelSession`, `<MazeScene>`, `useModalState`. Target under ~600 lines as a composition root. **Close to essential before Plan 10**, whose fixed clock cannot be retrofitted into the current structure.

**CR-RISK-10 — Parallel agents vs the hub file.** The handover authorises "disjoint fresh implementation/review agents", and v0.22.0 shows that working well. But disjointness is currently maintained by coordination rather than structure. **Raise the priority of CR-RISK-01** — the extraction is what makes disjointness real. Cheap interim measure: declare file-level ownership per active agent in the handover.

**CR-RISK-02 — FOV changes invalidate four plans and one test.** `exploration.test.ts:25`; `ARCHITECTURE.md:146, :487`; `RELEASE_CHECKLIST.md:711`; Plan 01's ASCII diagrams; **Plan 03's art review protocol, which reviews sprites at 6 × 6 scale**; Plan 04's analysis; `VERCEL_DEPLOYMENT.md:182`. The art gate has real cost — a smaller tile means re-confirming actual-size review. Treat FOV as a Human decision, record it, update everything in one change, and fold in CR-FEEL-01b.

**CR-RISK-03 — New mechanics multiply the solver state space.** 250 000-state ceiling (`solver.ts:218-220`); the handover records solver timeouts under parallel load. Single-use keys multiply by ~(maxKeys+1)³ — **significant**; ice is one transition — **low**. **Require a solver impact assessment before any new rule enters authored content.** Discovering this after 24 mazes would be very expensive.

**CR-RISK-04 — Plan 10's fixed clock is incompatible with today's architecture.** State in React `useState`; movement on `setTimeout`; presentation on a separate rAF; no tick, no command queue, no deterministic ordering. **The largest architectural risk in the programme, and invisible because Plan 10 is last and written as though the foundation exists.** Make the CR-FEEL-03 pump the first step of that architecture.

**CR-RISK-05 — Documentation volume.** ~12 000 lines of docs, ~1.7 MB of plans, several over 130 KB. The handover has improved (the superseded STOP is now explicitly labelled historical). Plans that long won't be read in full, so the effective spec becomes whichever section an agent loads. **Proposals:** move superseded handover sections to `docs/handover-history/`; a mandatory ≤ 2-page Contract header per plan; documentation growth requires archiving superseded text in the same change.

**CR-RISK-06 — Docs ratify the terrain approach that is a liability.** `ARCHITECTURE.md:146` and `RELEASE_CHECKLIST.md:711` present the full-maze render as settled architecture rather than as the cost in §3. Update both to record the §3.4 decision.

**CR-RISK-07 — Generated-run persistence gap.** Vision spec §6 says generated runs are not persisted; Plan 10 builds an economy spanning mazes and sessions including generated ones. Probably "bank at completion only" — but it is written nowhere. Schema v6 landed cleanly this round, so the save machinery is in good shape to absorb a decision now.

**CR-RISK-08 — Multiple input systems.** `movementControls.ts`, `pointerControls.ts`, the thumb-pad path in `App.tsx`, and `ThumbPad.thumbDirection`. Plan 08 will add a fifth. **Fold the rAF pump and Plan 08's normalisation into one contract** — every source produces `{heldDirection, bufferedDirection}`; one pump consumes it. `thumbDirection` is a good candidate for the shared geometry function.

**CR-RISK-09 — Sequencing puts presentation before feel.** v0.22.0 reinforces this: excellent presentation work shipped while every performance defect remained, and performance is now the #1 complaint. Plans 04, 02 and 05 will each add per-frame cost to a scene that still reconciles its minimap on every pointer event.

### CR-BUG-01…03 — Verified defects from the v0.22.0 pass *(new in v4)*

**CR-BUG-01 — Too-strong pop-up appears only once per enemy per run.** `App.tsx:1416` — `if (enemy && priorBumps === 0)`. A child returning to the same guardian is *deliberately* retrying, usually because they have not yet understood the rule — exactly when the explanation is most useful. Check the same pattern for locked doors and hazards.

**CR-BUG-02 — Clearing the final maze returns to maze 1.** `App.tsx:2065` does `(campaignIndex + 1) % CURATED_LEVELS.length`, wrapping to index 0, while the button *label* at `:2120` correctly says "Surprise maze". A genuine label/action mismatch that reproduces whenever the last chapter is completed.

**CR-BUG-03 — Pickup toast scales off board size, not tile size.** `scene.css:1329, 1341` use `cqw` against `.maze-board`. **Measured:** the toast image is 5 % of the board on desktop and 15 % on mobile — three times more prominent on a phone, exactly as the Human reported in both directions. Size it relative to **tile size** (~1.5 tiles) so it is proportionally identical everywhere.

---

## 11. Proposed roadmap revision

### Phase A — Performance and feel *(recommended next; see the companion document for slice shape)*
1. **CR-PERF-02/03/04/05** + **CR-PERF-12a** — render defects and the joystick blur. No visual change.
2. **CR-UI-17** — text selection.
3. **CR-PERF-09 + CR-PERF-12** — make Lite and Static actually reduce cost; retire per-sprite `drop-shadow`.
4. **CR-FEEL-07** — held input survives interruptions.
5. **CR-AUDIO-01, 03a** — master chain and pitch jitter.
6. **CR-BUG-01/02/03** — the three verified defects.
7. **CR-UI-02** — `--ui-scale`, board/deck rebalance.
8. **CR-FEEL-01 + 01b** — adaptive rectangular FOV, with CR-RISK-02 updates in the same change.
9. **CR-FEEL-02/03** — dead zone and the rAF pump, built as the fixed-step foundation.

**→ Family preview here**, with performance measured on the actual iPad.

### Phase B — Decisions and cheap depth
10. Human selects on **CR-DESIGN-01** (suggested: ice first).
11. **CR-RISK-03** solver impact assessment.
12. **CR-DESIGN-02** braiding; **CR-DESIGN-03** currency sink; **CR-DESIGN-04** remaining arithmetic.
13. **§3.4 terrain decision** — *must precede Plan 04*.

### Phase C — Presentation on a foundation that can carry it
14. **CR-RISK-01** — the `App.tsx` extraction.
15. **CR-UI-01** — numeric contract, with the computed-size build check.
16. **Plan 04** — lighting, adopting CR-ART-01 and CR-ART-05.
17. **Plan 02** — VFX with **CR-JUICE-01/03/06** and the **audio workstream** as first-class scope, **CR-ART-08** as its framework.
18. **UI-02** — bestiary states, victory composition, lore-card navigation, Book tab polish.
19. **Plan 08** — controls, consuming the Phase A input contract.
20. **Plan 05** — animation, reframed around **CR-JUICE-02/05/07**.

### Phase D — Content and co-op
21. **Plan 09** — with the rules question settled; adopting CR-DESIGN-05/06/07.
22. Plans 11, 13, 12, RC-01, then **Plan 10** with the fixed clock in place.

### What I would not change
The plan structure and single-owner discipline; the art provenance process; the vision spec's product decisions; and everything that landed in v0.22.0 — the Book, victory composition, discovery, focus, fonts and thumb pad are all good and should be built on, not revisited.

---

## 12. What is working well

- **The engine.** Pure, immutable, event-emitting, zero presentation leakage. Stationary combat and door-opening (`engine.ts:209-219, :262-270`) was exactly right.
- **`combatPresentation.ts`** — pure timing data sampled at an offset, fully testable, no timers. §3.6 proposes generalising it precisely because it is the best-shaped code in the presentation layer.
- **Content identity and save migration** — six tested schema versions, with a discovery sanitiser that blocks prototype-pollution keys.
- **`game/discovery.ts`** — scoping bestiary discovery to the authoritative gameplay view rather than the renderer's padded gutter is exactly right, and the comment says so.
- **The v0.22.0 UI itself.** The desktop and iPad compositions are the first that match the vision. Icon scale, deck organisation, minimap size, story cards, fonts, focus — all landed.
- **The Adventure Book** — real ARIA tabs, per-page scroll retention, lore cards, and it got *shorter* while gaining function.
- **`CatalogueImage`** — DPR-aware rendition selection via `useSyncExternalStore`, no polling.
- **The victory composition work** — 32 authored species signatures, no scrolling at five viewports, and a review honest about what is hidden at 568×320 rather than claiming everything fits.
- **The solver as a design gate**, proving both an ordinary and a perfect-rescue route.
- **`powerGuidance.ts`** — time-sliced, cancellable, engine-replayed witness search with a 4 ms budget.
- **The art provenance pipeline** — more rigorous than most studios.
- **The story writing.** *"A sword says 'please' in extremely sparkly handwriting."* Protect this.
- **The core emotional design** — no fail states, no punishment, kind guardians who step aside, optional friends that are never a failure to skip.

---

## Appendix A — Key measurements (shipped v0.22.0)

| Measurement | Value | Source |
|---|---|---|
| Field of view | 6 × 6, square | `exploration.ts:4, :77-78` |
| Step duration | 160 ms | `movementControls.ts:9` |
| Scroll rate @ 720p / iPad / 1080p | 750 / 735 / **1 125** px/s | computed |
| Visible fraction of 23×23 | 6.8 % | 36 ÷ 529 |
| Terrain raster surface (23-wide, iPad) | ≈ 2 706² px ≈ 7.3 MP | `cameraMotion.ts:17` × `scene.css:449` |
| Deck vs board @ phone 780×312 | **deck 460 / board 312** | `layout.ts` |
| Unused board height @ iPad | 128 px | `shell.css:9` + `layout.ts` |
| `drop-shadow` uses | **47** | grep |
| `infinite` animations | **46** | grep |
| `data-quality="lite"` rules in `scene.css` | **0** | grep |
| `user-select: none` occurrences | **2** | grep |
| Minimap DOM elements | up to 576 | `MiniMap.tsx:55` |
| Combat celebration | 2 220 ms, flat | `combatPresentation.ts:10` |
| SFX cues | 26, synthesised, no master chain | `sound.ts` |
| `clearHeldInput()` call sites | 17 | `App.tsx` |
| `App.tsx` | 2 853 lines | `wc -l` |
| Total source | 22 672 lines | `wc -l` |
| Runtime assets | ~151 MB (OST 96.9 / PNG 31.4 / WebP 25.6) | `du`, `find` |
| Solver state ceiling | 250 000 | `solver.ts:219` |
| Save schema | v6 | `progress.ts` |

## Appendix B — Item index and status

**✅ Closed** — CR-PERF-01, CR-UI-04 (core), CR-UI-07 (infrastructure)
**🟡 Partial** — CR-FEEL-03 (symptom patched, see CR-FEEL-06), CR-UI-03, CR-UI-05 (pad done, board drag not), CR-DESIGN-04 (potion only)
**Open** — everything else

**Movement & camera** — CR-FEEL-01 field of view · 01b rectangular window · 02 dead zone · 03 rAF pump · 04 cruising speed · 05 seam · 06 rAF timestamp workaround · **07 held input dies on interruption (new)**

**Performance** — CR-PERF-01 ✅ · 02 MiniMap memo · 03 pointermove renders · 04 layout-effect deps · 05 compositor/containment · 06 asset payload · 07 three clocks · 09 **quality tiers inert (hard evidence)** · 10 terrain bake decision · 11 measurement set · **12 filter + animation cost (new)**

**Juice & life** — CR-JUICE-01 ambient life · 02 anticipation/follow-through · 03 impact language · 04 follower chain · 05 celebration significance · 06 glyph particles · 07 idle and discovery poses

**Audio** — CR-AUDIO-01 master chain · 02 noise/filter/space · 03 step sound · 04 pickup chains · 05 ducking · 06 ownership

**UI/UX** — CR-UI-01 numeric contract · 02 **`--ui-scale` (resolved)** · 03 one obvious action · 04 focus ✅ · 05 board drag origin · 06 transients out of layout · 07 largest rendition ✅ · 08 diegetic kit UI · 09 treasure-map minimap · 10 Power as hero · 11 pictorial objective · 12 one-glance test · 13 motion vocabulary · 14 couch/TV scale · 15 moments around play · 16 minimumDeck lever · **17 text selection (new)**

**Visuals & lighting** — CR-ART-01 wall extrusion · 02 animation blur · 03 poison bubbles · 04 art principles · 05 lighting model · 06 per-theme grading · 07 depth cueing · 08 effect hierarchy

**Game design** — CR-DESIGN-01 costed mechanic · 02 braiding · 03 currency sink · 04 subtraction 🟡 · 05 size ladder · 06 interest rhythm · 07 guarded optional battles

**Content** — CR-CONTENT-01 two voices · 02 favourites into mechanics · 03 celebrate the friends

**Risks & bugs** — CR-RISK-01 App.tsx · 02 FOV blast radius · 03 solver state space · 04 co-op fixed clock · 05 documentation volume · 06 ratified terrain approach · 07 generated-run persistence · 08 duplicate input systems · 09 sequencing · 10 parallel agents · **CR-BUG-01 too-strong once (new)** · **CR-BUG-02 campaign wrap (new)** · **CR-BUG-03 toast scale (new)**

---

*Every code claim cites a file and line in `5f7f8c9`. Please verify anything that would change a decision, and discard anything that lands after this review.*
