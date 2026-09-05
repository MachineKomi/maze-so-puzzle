# Maze so Puzzle — independent design & engineering review (v3)

**For:** GPT6 Astra (orchestrator) and the specialist agents
**From:** Claude Opus 5, independent read-only review
**Review date:** 2026-09-05 (third pass)
**Reviewed state:** HEAD `fef5e56` + the full uncommitted UI-03 working tree; `package.json` version `0.22.0`
**Changes since v2:** re-verified every prior finding against the current tree; recorded what has landed; **sharpened the UI scale diagnosis considerably** (§6.1 — the numbers are now exact); added three new findings; retired one.

---

## How to read this — please argue with it

**Everything here is a proposal, not an instruction.** I read the repository carefully but I have never played the game, never watched Ame play, and have not seen it on an iPad. You have all three. Where a proposal conflicts with what you know from actual play, actual play wins — and I would rather you take a *diagnosis* and reject its *remedy* than adopt a remedy that doesn't fit.

- **Diagnoses are testable.** Every code claim cites `file:line`. If one is wrong, that matters and I'd want it corrected.
- **Remedies are one option.** I've tried to give reasoning so you can evaluate a different remedy against the same logic, and I list alternatives I considered and rejected so you can re-open those choices.
- **Numbers are hypotheses** unless labelled **Measured**.
- **Some of this is taste**, and it's labelled.

**Evidence labels:** **Verified** (read in current source) · **Measured** (computed from current constants) · **Assessed** (design judgement) · **Proposal** (needs selection) · **Taste** (preference).

**Item IDs are stable across versions** so you can track decisions. New in v3: `CR-UI-16`, `CR-FEEL-06`, `CR-RISK-10`. Retired in v3: none, but several are now marked ✅ or 🟡.

---

## 0. Status since the last pass

The UI-03 slice has added roughly **4,000 lines** across 63 changed files plus 16 new ones, and the version has moved to `0.22.0`. HEAD has not moved, so this is all uncommitted.

### 0.1 — What has landed, and it's good work

| Area | Status | Note |
|---|---|---|
| **Adventure Book pages** (PT-37) | ✅ Done well | Proper ARIA `tablist`/`tab`/`tabpanel`, per-page scroll retention, five destinations. `AdventureBook.tsx` got *shorter* (278→205 lines) while gaining function — that's a good sign |
| **Bestiary discovery** | ✅ Done well | `game/discovery.ts` scopes discovery to the authoritative gameplay view, explicitly not the padded travel gutter. Persisted via schema v6 with a migration and a key sanitiser that blocks `prototype`/`constructor`. Careful work |
| **Victory composition** (PT-35) | ✅ Done well | 32 species-specific motion signatures, measured no-body-scroll at five viewports, reduced-motion verified as `animation-name: none` across 17 actors. The dialog review is honest about what is hidden at 568×320 rather than claiming everything fits |
| **Focus treatment** (PT-34, CR-UI-04) | ✅ Substantially done | `:focus-visible` only, plum outline, component-specific insets, `forced-colors` handling (`base.css:9-12`). The heavy green ring is gone |
| **Rendition selection** (CR-UI-07) | ✅ Infrastructure done | `CatalogueImage` now DPR-aware via `useSyncExternalStore` with no polling and a `device-pixel-content-box` observer. Genuinely good engineering |
| **Thumb pad** (PT-08) | 🟡 Half done | `ThumbPad.tsx` implements correct anchored-stick behaviour with a deadzone and diagonal hysteresis. **The board drag still anchors to Ame** — see CR-UI-05 |
| **Potion arithmetic** (CR-DESIGN-04) | 🟡 Half done | `mapNotices.ts:33` now reads `Power Potion! 2 + 3 = 5`. Combat still shows only `+5!` (`:53`), and the too-strong dialog shows a comparison but **not the gap** |
| **`MazeTerrain` memo** (CR-PERF-01) | ✅ **Fixed** | `worldWindow` is now a stable memoised prop with a comment citing the memo (`App.tsx:799`, `:2263`) |
| **Travel timestamp** (CR-FEEL-03) | 🟡 Symptom patched | `useSceneTravel` now paints from `performance.now()` rather than the rAF timestamp — see CR-FEEL-06, this is treating a symptom |

### 0.2 — What has not moved

Everything below is **Verified as still present** in the current tree.

| ID | Finding | Evidence |
|---|---|---|
| CR-FEEL-01 | `DEFAULT_FOV_SIZE = 6` | `exploration.ts:4` |
| CR-FEEL-02 | No camera dead zone | `tileTravel.ts:75` |
| CR-FEEL-03 | Movement still on `setTimeout` cadence | `movementControls.ts:28`, `App.tsx` repeat schedulers |
| CR-PERF-02 | `MiniMap` memo defeated by two inline allocations | `App.tsx:2539-2540` |
| CR-PERF-03 | `setTouchCursor` fires on every `pointermove` | `App.tsx:1696` |
| CR-PERF-05 | No `will-change`/`contain` on the scroll layer | only three `will-change: auto` resets in `scene.css` |
| CR-PERF-06 | ~151 MB payload; 97 MB OST; terrain PNGs | unchanged |
| CR-UI-01 | UI spec still property-based, no numeric contract | vision spec §4.1, UI-03 |
| CR-UI-02 | `container: adventure-deck / inline-size`; `align-content: center` | `hud.css:2`, `:27` |
| CR-UI-05 | Board drag anchors to Ame, not the touch point | `App.tsx:1632-1633` |
| CR-AUDIO-01…06 | No master chain; `gain.connect(ctx.destination)` | `sound.ts:216` |
| CR-JUICE-01…07 | No ambient life, glyph particles, flat 2 220 ms combat | `magicEffects.ts:16-29`, `combatPresentation.ts:10` |
| CR-ART-01, 05–08 | Wall depth still blur+stroke; no lighting model | `MazeTerrain.tsx:228-258` |
| CR-DESIGN-01…03, 05–07 | Rules, braiding, currency sink untouched | `engine.ts`, `generator.ts:188` |
| CR-RISK-01 | `App.tsx` now **2,853 lines** (was 2,797) | `wc -l` |

None of the review themes appear in the planning docs yet — the backlog is still at PT-44 and there is no FOV, memoisation, braiding, or audio entry. That's consistent with the Human not having passed the review on.

### 0.3 — The headline for this pass

**The UI-03 slice has delivered features, not scale — and §6.1 now shows precisely why.**

The Human's loudest v0.21.0 complaint was that everything is too small and vertical space is wasted. UI-03 has produced excellent Book tabs, a beautiful victory, a proper thumb pad and a bestiary. But **on the primary target device every container-query size in the HUD is pinned at its floor value.** Not near it — at it. The responsive sizing system is doing literally nothing on an iPad. The exact arithmetic is in §6.1 and I'd suggest it is the single most actionable thing in this document.

---

## Contents

- §1 Quick wins and sequencing — **read first if planning work**
- §2 Movement, camera, and game feel
- §3 Runtime performance
- §4 Look and feel: juice, life, impact
- §5 Audio and sound design
- §6 UI and UX
- §7 Visuals, lighting, effects, animation
- §8 Core game design depth
- §9 Content, story, copy, edutainment
- §10 Programme risks, gaps, discrepancies
- §11 Proposed roadmap revision
- §12 What is working well
- Appendices

---

## 1. Quick wins and sequencing

### 1.1 — Do-now quick wins (hours; no plan dependency; no pending decision)

| ID | Change | Effort | Status |
|---|---|---|---|
| ~~CR-PERF-01~~ | ~~Memoise `MazeTerrain`'s camera prop~~ | — | ✅ **done** |
| **CR-PERF-02** | `useMemo` both `MiniMap` props (`App.tsx:2539-2540`) | 2 lines | open |
| **CR-PERF-03** | Move `touchCursor` out of React state into a ref + CSS variables | ~20 lines | open |
| **CR-PERF-05a** | `will-change: transform; contain: paint;` on `.camera-world`, toggled by `data-travel-state` | ~4 lines | open |
| **CR-UI-02a** | `container-type: size` on `.adventure-hud`; `cqw` → `cqmin` | ~10 lines | open |
| **CR-UI-02b** | **Recalibrate the clamp coefficients — see §6.1, they are all at their floors** | ~12 lines | open |
| **CR-AUDIO-01** | Master `GainNode` → `DynamicsCompressorNode` → destination | ~10 lines | open |
| **CR-AUDIO-03a** | ±5 % pitch jitter on `step`, `bump`, `pickup` | 1 line | open |
| **CR-DESIGN-04a** | Add the gap sentence to the too-strong dialog and the sum to combat | ~15 lines | half done |
| **CR-JUICE-05a** | Scale combat celebration by significance rather than flat 2 220 ms | ~20 lines | open |

**Roughly one to two focused days for the whole list.** I'd land CR-PERF-02/03/05a and CR-UI-02a/b first and take a build to the iPad before anything else — those five change the baseline every later judgement is made against.

### 1.2 — Near-term, needs a decision or some design

| ID | Change | Depends on | Suggested home |
|---|---|---|---|
| **CR-FEEL-01** | Adaptive field of view — **now with rectangular windows, see CR-FEEL-01b** | Human decision + CR-RISK-02 doc/test updates | A named MOVE-02 slice, before Plan 04 |
| **CR-FEEL-02** | Camera dead zone + damped follow | CR-FEEL-01 | Same slice |
| **CR-FEEL-03** | Single rAF movement pump | Design *with* Plan 08's input contract and *as* Plan 10's fixed clock | Same slice, scoped as architecture |
| **CR-UI-05** | Board drag anchors to touch point | none | MOVE-02 (the ThumbPad already does it right — reuse `thumbDirection`) |
| **CR-JUICE-01** | Ambient world life | none | Plan 02, but a first slice could land early |
| **CR-AUDIO-02** | Filtered-noise voices + a small space | CR-AUDIO-01 | Needs an owner — CR-AUDIO-06 |
| **CR-ART-03** | Poison bubbles | none | Plan 02 |
| **CR-PERF-06** | Bounded asset payload slice | confirm OST "B" variants | Pull from 07B, before next preview |

### 1.3 — Decisions to make before the work they gate

| Decision | Gates | Why now |
|---|---|---|
| **Terrain: live SVG or baked raster?** | Plan 04, Plan 02, 07B | Plan 04 is about to add lighting to a surface already too expensive. Baking makes ambitious lighting free; deciding after Plan 04 means redoing Plan 04 |
| **Does the rule set gain a costed mechanic?** | Plan 09's brief | Plan 09 is asked for "much harder and more puzzly", which current rules cannot support (§8.1) |
| **Fixed or adaptive FOV — and square or rectangular?** | Plan 01 diagrams, Plan 03's art-review scale, Plan 04's analysis, one test | Four plans encode "6 × 6". Changing later invalidates the actual-size art gate |
| **Who owns SFX?** | Juice work in 02, 05, 09 | No plan owns it. Reward showers, combat, rescue and victory all imply sound design nobody is scoped for |
| **Does the movement pump become the co-op fixed clock?** | Plan 10's architecture | Free now, a rewrite later |
| **Parallel agents vs one runtime writer** | everything touching `App.tsx` | New — see CR-RISK-10 |

---

## 2. Movement, camera, and game feel

### CR-FEEL-01 — The 6 × 6 field of view
**Verified / Measured.** `exploration.ts:4`, unchanged. `shouldUseExplorationView` (`:15`) enables the following camera for any grid over 6.

Recomputed against the **current** `layout.ts` (which changed this pass — `minimumDeck` is now `max(480, min(w×0.40, 520))`):

| Target | Board px | Tile px @ FOV 6 | Scroll rate @ 160 ms | Visible fraction of 23×23 |
|---|---|---|---|---|
| 1280×720 | 720 | 120 | **750 px/s** | 6.8 % |
| 1194×834 iPad | 706 | 118 | **735 px/s** | 6.8 % |
| 1920×1080 | 1080 | 180 | **1 125 px/s** | 6.8 % |

Note the 1080p row: on a TV, the whole-screen scroll rate is **1,125 px/s**. That is the couch scenario, and it is the worst case.

Two consequences, which I think explain several separate complaints:

**(a) Optical flow.** With the camera hard-locked, Ame is stationary in screen space and 100 % of the motion signal is background. The reference handhelds sit around 150–250 px/s. I suspect this is the origin of "nauseating".

**(b) Spatial reasoning is impossible.** At 6.8 % visibility you can never see a junction *and* what lies beyond it. All spatial inference is displaced onto the minimap — which is why the minimap has had to be promoted to "first-class puzzle tool". It is compensating for a camera that shows almost nothing.

**Proposal.** Derive the window from board pixels:

```
targetTilePx = 80                                     // hypothesis; 72–96 plausible
fov = clamp(oddNearest(boardPx / targetTilePx), 7, 15)
fov = min(fov, levelSize)
```

At 720 px → FOV 9 (80 px tiles, 81 tiles visible, 500 px/s). At 1080 px → FOV 13 (83 px tiles, 640 px/s).

**Alternatives I'd be happy to be argued out of:** keeping FOV 6 and slowing movement (rejected — the Human asked twice for faster); relying on smoothing alone (roughly what MOVE-01 did — smoothing reduces jerk, not quantity of motion); whole-maze always (tempting, and early builds the Human liked did this, but 23×23 on a 720 px board gives 31 px tiles — probably too small; **however, whole-maze for mazes ≤ 13 falls out of the adaptive formula for free and is probably delightful**).

### CR-FEEL-01b — The camera window is square, and that is why the board wastes vertical space *(new in v3)*
**Verified / Measured.** `getCameraWindow` takes a single `fovSize` and applies it to both axes (`exploration.ts:77-78`). Consequently `.maze-board` is forced square (`aspect-ratio: 1`, `shell.css:9`), and `layout.ts` computes `board = min(h, w − deck − gap)`.

**The cost, measured on the primary device:**

| Target | Board | Available height | **Unused height in the board column** |
|---|---|---|---|
| 1194×834 iPad | 706 × 706 | 834 | **128 px** |
| 1280×720 | 720 × 720 | 720 | 0 |
| 1920×1080 | 1080 × 1080 | 1080 | 0 |

So on iPad — the *first* priority device — 128 px of vertical space beside the maze is structurally unusable, purely because the camera window is square.

**Proposal.** Let `getCameraWindow` accept independent `fovWidth`/`fovHeight`, derived from the board's actual aspect:

```
fovWidth  = clamp(oddNearest(boardW / targetTilePx), 7, 17)
fovHeight = clamp(oddNearest(boardH / targetTilePx), 7, 17)
```

Then drop `aspect-ratio: 1` from `.maze-board` and let the board fill its available rectangle.

Three benefits at once: the 128 px of iPad waste disappears; more of the maze is visible (a wider window suits corridor scanning); and the board grows in area without taking width from the deck — which is the exact trade `layout.ts` is currently making badly (see CR-UI-16).

**Things to check:** `travelCamera` already handles width and height separately (`tileTravel.ts:77-78`) so it should need no change. `MiniMap`'s `map-camera-frame` already uses `camera.width`/`camera.height` independently (`MiniMap.tsx:79-82`). `getVisibleTileKeys` / `revealVisibleTiles` take `fovSize` and would need the same two-axis treatment. The fog-of-war reveal shape would change from square to rectangular, which is a **save-visible** change worth thinking about — though it only makes reveals more generous, so it should be forward-compatible.

**Risk to weigh:** a rectangular reveal changes the exploration record for existing saves. Probably benign (more revealed, never less), but it deserves an explicit decision rather than a silent one.

### CR-FEEL-02 — No camera dead zone
**Verified, unchanged.** `travelCamera` (`tileTravel.ts:75`) recentres every frame with no hysteresis. Ame is pinned to the board centre except at maze boundaries.

**Assessed.** Even with a larger FOV, a hard-locked camera will feel worse than a windowed one, because the avatar carries none of the motion. The team's own inspiration research cites *Scroll Back* on camera windows and lists a dead zone as a "tuning candidate"; I'd argue it belongs in the core.

**Proposal.** Dead zone of ± *d* tiles (hypothesis 1.5) inside which the camera does not move at all, plus critically-damped follow outside it: `camera += (target − camera) × (1 − exp(−dt / τ))`, τ ≈ 140 ms. With FOV 9 and *d* = 1.5, most individual steps become camera-stationary.

**Care:** keep the existing hard-settle discontinuity path (`useSceneTravel.settle`, `:90`) — that logic is correct. Drive the minimap frame from the *presented* camera. Test rapid reversals specifically; if it feels swimmy, reduce τ before reducing *d*.

### CR-FEEL-03 — Two unsynchronised clocks
**Verified, unchanged.** Commits from `setTimeout` (`App.tsx` repeat schedulers, `movementControls.heldMoveRepeatDelay` now a flat 160 ms); presentation from rAF. When a retarget lands off-phase, `TileTraveller.retarget` compensates by **changing tween speed** (`tileTravel.ts:70`), so per-step on-screen speed varies by design.

**Proposal — invert ownership.** One rAF pump owns time; input expresses intent only:

```
heldDirection:     Direction | null
bufferedDirection: { dir, atMs } | null

progress += dt / STEP_TRAVEL_MS
while (progress >= 1) {
  progress -= 1                          // carry remainder, capped at one step
  const dir = freshBuffered() ?? heldDirection
  if (!dir) { progress = 0; break }
  movePlayer(level, state, dir)           // one engine call, rules unchanged
}
```

Constant speed; no first-step-fast-then-pause; frame-rate independent; and cornering becomes reliable because a mid-step tap is buffered and consumed at the boundary. **Please consider building this as Plan 10's fixed clock (CR-RISK-04)** — the shape above already is one.

Guardrails: engine untouched; carried remainder capped so a background tab can't burst-commit; buffer window ~120 ms (needs play-testing).

### CR-FEEL-06 — The rAF timestamp change treats a symptom *(new in v3)*
**Verified.** `useSceneTravel.ts` now does:

```js
frame.current = requestAnimationFrame(() => {
  // React commits retarget against performance.now(). Use that same clock when
  // this callback actually runs: a busy frame's rAF timestamp may be old, which
  // otherwise paints an old fraction then jerks ahead on the next healthy frame
  // after the main thread becomes available.
  if (token === generation.current) paint(performance.now());
});
```

**Assessed.** The diagnosis in that comment is correct and well-observed — but read what it says: *"after the main thread becomes available"*. This is a workaround for **main-thread contention**, and the two largest causes of that contention are still present (CR-PERF-02 and CR-PERF-03).

Two things worth weighing:

1. **It should become unnecessary.** Once the minimap stops reconciling 576 nodes per render and pointer moves stop re-rendering the app, frames should not be arriving late, and the rAF timestamp should be fine.
2. **In the healthy case it is slightly worse.** The rAF timestamp is the frame's shared start time — identical for every callback in that frame. `performance.now()` inside the callback is *when this callback happened to run*, which varies with how much other rAF work executed first. So this trades "occasional jerk under load" for "small continuous jitter proportional to callback ordering".

**Proposal.** Fix the contention (CR-PERF-02/03), then re-test whether this workaround still earns its place. If it does, keep it — but knowingly. If the team disagrees with my reading of rAF timestamp semantics, that's worth resolving with a measurement rather than an argument: log both clocks for 200 frames under load and compare.

### CR-FEEL-04 — Cruising speed
**Assessed.** `STEP_TRAVEL_MS = 160` = 6.25 tiles/s. The Human asked twice for faster; the team can't safely oblige while FOV 6 produces 750 px/s. After CR-FEEL-01, try ~120–130 ms while keeping a single tap the same duration. At FOV 9 / 125 ms that's 8 tiles/s and 640 px/s — faster *and* calmer than today.

### CR-FEEL-05 — The "faint moving dark line" (PT-33)
**Verified, unchanged.** `.camera-world` is percentage-sized then translated by fractional pixels; tile children are percentage-positioned. Where `camera.width` doesn't divide the board evenly, child edges land on fractional device pixels and antialiasing changes every frame.

Cheapest first: snap the composite translate to whole device pixels (`Math.round(v * dpr) / dpr`); give adjacent terrain layers ~0.5 px overlap; if it persists, expand the SVG filter region (`MazeTerrain.tsx:112`) by a tile. A baked terrain raster (§3.4) removes the class entirely.

---

## 3. Runtime performance

### 3.1 — Remaining render defects

#### ~~CR-PERF-01~~ ✅ Fixed
`worldWindow` is now stable (`App.tsx:799`, `:2263`) with an explanatory comment. Good.

#### CR-PERF-02 — `MiniMap`'s `memo()` still never hits
**Verified.** `App.tsx:2539-2540`:
```tsx
currentView={explorationMode ? currentViewTiles : new Set(level.terrain.flatMap(...))}
objects={activeObjects.filter(object => object.kind !== "treasure")}
```
Both allocate fresh values every render, so `memo()` (`MiniMap.tsx:21`) never hits — in exploration mode *and* whole-maze mode. `MiniMap` renders one `<i>` per tile, up to **576 elements** with up to three `<b>` children each.

**Fix:** memoise both (hoist the whole-maze `Set` keyed on `level`; the filtered array keyed on `activeObjects`). Worth also considering canvas for fog/terrain with markers as DOM — 576 elements is a lot for a decorative square, and the Human wants the map *bigger*.

#### CR-PERF-03 — Every `pointermove` still re-renders the App
**Verified.** `setTouchCursor({...})` at `App.tsx:1696`, inside `onBoardPointerMove`, before the direction-changed early exit.

With CR-PERF-02 unfixed, one finger drag on an iPad (up to 120 events/s) triggers a full App render plus 576 minimap reconciliations per event. I believe this is the main reason iPad touch "feels broken", separate from the direction bug.

**Fix:** the touch cursor needs no reconciliation. Write it to a ref-held node or CSS custom properties inside the rAF pump, as `useSceneTravel` already does for travel. Note the render already consumes it as CSS variables (`App.tsx:2324-2327`), so the change is mostly mechanical.

#### CR-PERF-04 — `useSceneTravel` layout effect still has no dependency array
**Verified.** Runs on every render, doing `querySelectorAll` + three `querySelector`s. Deliberate (it's how retargeting happens) but it makes every unrelated render do DOM work.

**Proposal:** split into a cheap retarget path keyed on position/followers, and a binding/`ResizeObserver` path keyed on `[board, runKey]`, with follower nodes cached in a `Map`.

### 3.2 — CR-PERF-05 — Still no compositor promotion or containment
**Verified.** Only three `will-change: auto` resets in `scene.css`; no `contain`, no `content-visibility`. The per-frame `translate` is written directly from rAF rather than declared as a CSS animation, so the browser has no advance signal to promote the layer.

**Proposal:** `will-change: transform; contain: paint;` on `.camera-world`, toggled by the existing `data-travel-state` so a 7.6 MP surface isn't permanently promoted. `contain: strict` or `content-visibility: auto` on the minimap card. Verify with paint-flashing and layer borders, not test counts.

### 3.3 — CR-PERF-07 — Presentation still runs on three clocks
**Verified.** rAF (travel), `setTimeout` (presentation lifecycles, `App.tsx` `schedulePresentationTimer`), and 69 CSS keyframes in `scene.css` (plus 7 in `dialogs.css`). Three sources of drift.

**Proposal (Plan 02-sized).** One presentation clock — the travel rAF — with presentations expressed as *plans* rather than timers, in the style `combatPresentation.ts` already uses. That file is the model: pure timing data, sampled at an offset, testable. Generalised: every presentation is `{ durationMs, sampleAt(t) → frame }`; the pump samples active ones once per frame; cancellation is set removal; reduced motion is a different plan, not a different code path.

Don't do it in the same slice as the movement pump — but design the movement pump so it can host presentation plans later.

### 3.4 — CR-PERF-10 — The terrain decision (please make before Plan 04)
**Assessed, unchanged and now more urgent.** Terrain is static for a level's whole life, yet is a live SVG with filters and masks, re-rasterised at ~7.6 MP on invalidation and translated every frame on the main thread.

**Option A — bake once per level** into an `OffscreenCanvas`/`ImageBitmap`, then translate one bitmap. Terrain cost becomes independent of maze size and frame rate; **all of CR-ART-01/05's lighting becomes free at runtime because it's baked**; the sub-pixel seam class disappears; animated hazards move to a thin overlay (arguably better — separately budgetable); a level-load cost appears (20–80 ms, needs measuring) which can hide behind the story card.

**Option B — stay live SVG.** Simpler and fully dynamic, at the cost of a permanent per-frame budget that grows with every effect 04 and 02 add.

**My view, held loosely:** Option A, because Plan 04's purpose is adding expensive-looking lighting and baking is what makes that affordable on an iPad. But if Plan 04 intends *dynamic* light — moving sources, day/night, light responding to Ame — Option A is wrong and you should know that now. **Decide before Plan 04 starts.**

### 3.5 — CR-PERF-09 — Define the quality-tier ladder
**Verified.** `data-quality` and `data-motion` are set from preferences and appear across the stylesheets; the UI-03 dialog review confirms Static disables victory animation. What I still can't find is a *statement of what each tier costs and preserves*.

**Proposal — write it down:**

| Tier | Terrain | Ambient life | Event VFX | Particles | Blur |
|---|---|---|---|---|---|
| Full | Baked + animated hazard overlay | All | Full choreography | Full budget | Backdrop blur on modals only |
| Reduced | Baked + slowed hazards | Low-amplitude only, no loops > 2 s | Same beats, shorter, no camera punch | ~40 % | Opaque fallbacks |
| Static | Baked only | None | Held pose + instant state change | None | None |

Then assert each tier communicates the same semantic events. This turns quality tiers from scattered CSS overrides into a contract, and gives Plans 02 and 04 somewhere to put fallbacks rather than inventing them per effect.

### 3.6 — CR-PERF-06 — Asset payload
**Measured, unchanged:** OST 42 tracks / 96.9 MB (avg 2.31 MB, every track shipped in A *and* B variants); 88 PNGs / 31.4 MB (twelve terrain textures at 700–890 KB, used only as tiled `<pattern>` fills at a few tiles' period); 232 WebP / 25.6 MB; `public/` ≈ 151 MB, copied verbatim to `dist/`.

**Why before Plan 07B:** family previews happen on an iPad over wifi. A 2.3 MB music fetch on context change and multi-hundred-KB texture fetches on level load will produce hitches during exactly the sessions meant to judge *feel* — risking contamination of the feedback the programme depends on.

### 3.7 — CR-PERF-11 — What to measure

| Metric | Why | Target (hypothesis) |
|---|---|---|
| Input → first visible motion | "does it respond" | < 50 ms p95 |
| Per-step duration **variance** (σ over 40 held steps) | The exact CR-FEEL-03 defect | σ < 8 ms |
| Long tasks (> 50 ms) during a 40-step traverse | Catches CR-PERF-02 | 0 |
| Renders/second during a pointer drag | Catches CR-PERF-03 | < 5 |
| Frames where `.camera-world` repaints | Catches CR-PERF-05 | ~0 while travelling |
| Level-load → first interactive frame | Guards a terrain bake | < 400 ms |
| Peak simultaneous animated elements | Guards effect creep | budgeted per tier |

The second and fourth encode the Human's complaints as numbers and neither is currently captured.

---

## 4. Look and feel: juice, life, and impact

**Status: none of this has been started, and the victory work shows the team can do it well.** The 32 species-specific victory signatures are exactly the right instinct — distinct, grounded, translation-and-rotation only, no scale/warp, no random timing. That craft applied to *ordinary play* is what §4 is about.

**The organising idea:** great-feeling games aren't the ones with the most effects — they're the ones where every action has a visible and audible consequence, and the world behaves as if it notices you. Maze so Puzzle has excellent *event* feedback and almost no *ambient* or *incidental* feedback.

### CR-JUICE-01 — The world is static between events
**Verified.** Of 69 keyframes in `scene.css`, ambient ones are `goal-glow`, `item-shine`, `goblin-bob`, `portal-pad-breathe`, `pet-follower-bob`, `terrain-ambient-drift`, six friend-motion loops, seven enemy-motion loops, and hazard shimmers. All *object* animation. Missing: terrain that breathes, anything reacting to Ame *passing*, incidental drift in empty space.

**Proposals, cheapest first — independent, take any subset:**

**(a) Proximity reaction — "the world notices Ame".** Decorative elements within ~1 tile lean away, wobble, or brighten. Drivable from the sub-tile position the travel pump already computes, or more simply from `data-near` attributes updated at tile boundaries. **Highest juice-per-line item in this document** — grass that leans, a lantern that swings, a flower that bobs. Only a handful of elements are ever near the player, so cost is negligible.

**(b) Terrain breathing.** A ≤ 1 % scale or brightness oscillation on the floor-dressing layer at a 6–10 s period, desynchronised across regions. Nearly subliminal; stops the world feeling like a printed image.

**(c) Sparse ambient motes.** Themed per terrain — dust in ruins, pollen in meadow, embers near lava. `terrain-ambient-drift` exists; this is about density and pacing. Sparse and slow is the whole trick.

**(d) Board reaction reserved for big moments.** The Human disliked the maze view resizing on ordinary events and is right — but a brief small transform on an *inner* layer (never the layout box, CR-UI-06) is exactly right for a genuinely big moment. `battle-camera-punch` exists; the discipline is reserving it for significance.

**Failure mode to guard:** everything moving at once reads as busy, not alive. **If a reviewer can describe an ambient animation unprompted, it's too strong.**

### CR-JUICE-02 — Movement has no anticipation or follow-through
**Verified.** Travel is linear interpolation (`tileTravel.ts:35`) with a decorative sway and hop keyframes.

Linear interpolation is *correct* for the camera and *wrong* for the character. Anticipation, follow-through and squash/stretch all concern what happens at the *start* and *end* of a motion, which is exactly where linear says nothing.

**Proposals — motion design, cheap, independent of the pump:**
- **(a) Ease the sprite, not the position.** Keep authoritative position linear (camera and pointer maths depend on it) but give the *sprite* a small lead/lag offset that eases out at step start and settles at the end.
- **(b) Squash on arrival** — ~60 ms, ~4 % vertical. The most reliable "feels good" trick in 2D character motion, and almost free.
- **(c) Anticipation on turn** — 40–60 ms lean into the new direction before the step. Makes cornering read as intentional, and pairs beautifully with CR-FEEL-03's input buffer.
- **(d) Follow-through on stop** — ~80 ms overshoot-and-settle.
- **(e) Reconsider the hop.** A vertical hop reads well when movement is *discrete* (it hides the teleport) and badly when movement is *continuous* (it fights it). The Human's instinct here matches the team's own inspiration research. Shoulder sway + (b) is likely the better vocabulary.

**Note for Plan 05:** most of this needs **no new frames** — it's timing and transforms on existing art. That might substantially change how Plan 05 is scoped: its value may lie more in motion design than in drawing.

### CR-JUICE-03 — Impact language
**Assessed.** `combatPresentation.ts` is a well-built 2 220 ms set piece. What's missing is the micro-vocabulary that makes hits feel physical:
- **(a) Hitstop** — freeze everything for 40–80 ms on contact, then resume. A very small change with a disproportionate effect. Because `combatPresentation` is a sampled plan rather than timers, hitstop is a discontinuity in the sample function — a clean place to put it.
- **(b) Impact flash** — one or two frames of `filter: brightness(3) saturate(0)` on the struck sprite. Reads as *light*, not damage — important for the child-safe framing.
- **(c) Directional knock** — both combatants displace ~6 % away from contact and return.
- **(d) An expanding ring** — one element, scale 0.2 → 1.6, opacity 1 → 0 over 180 ms. Cheapest possible "something happened here".

**Child-safety:** all of this should read as sparkle and surprise, not violence. Bright, warm, no red, no shake suggesting pain. A guardian who is *dazzled* and steps aside is the right read, and it serves the Polite Sword Rule fiction well.

### CR-JUICE-04 — The follower chain is the game's best asset and is barely used
**Verified.** Followers follow and bob. Each species has an authored `greeting` and `flourish` (`visualPersonality.ts:21+`). The victory screen now uses 32 authored signatures — **so the data and the craft both exist; they're just confined to the victory dialog.**

**Proposals, ascending cost:**
- **(a) The ripple.** On treasure, defeat, or door-open, each follower does a small delighted hop **in sequence**, staggered ~70 ms down the line. Per line of code, one of the most charming things you can add — and it *scales with the player's success*, because more rescued friends means a bigger celebration.
- **(b) Gather and string.** When Ame stops, followers bunch around her over ~600 ms; when she moves, they string into the trail. Currently they hold trail positions regardless. This is the Chao-garden feeling the Human loves, and it makes an idle screen look like a group of friends rather than a queue. **It would also mask several PT-40 trail edge cases**, since most of the visible weirdness is followers holding stale positions — not a fix for the logic, but a real improvement in perceived quality while the logic is sorted.
- **(c) Glances.** A follower occasionally looks at something nearby — even as a horizontal flip plus a flourish, this reads as attention.
- **(d) A rare line.** `visualPersonality` greetings exist and are unused in play. A short speech bubble when something notable happens would be delightful. *Rare* is the key word — once every minute or two.

### CR-JUICE-05 — Celebration length should scale with significance
**Verified.** `COMBAT_VICTORY_DURATION_MS = 2220`, flat, for every defeat. `RESCUE_PRESENTATION_MS = 900`, `DOOR_OPEN_PRESENTATION_MS = 1320`, `PORTAL_PRESENTATION_MS = 720`, all flat.

**Assessed.** A genuine tension with the Human's own "more battles" request: at 2.2 s per battle, more battles means more waiting, and a five-year-old feels that long before an adult does. Flat-duration celebrations are the classic reason a game feels great for ten minutes and tiring after thirty.

**Proposal — a significance model** from data the engine already emits:

| Signal | Source | Effect |
|---|---|---|
| Power gained relative to current | `enemyPower / powerBefore` | Bigger relative gain → longer |
| Close fight | `powerBefore − enemyPower` small | Full three clashes |
| Walkover | `powerBefore ≫ enemyPower` | **One clash, ~500 ms, and a *funnier* animation** |
| First of its kind | now available via `game/discovery.ts` | Full set piece + "New!" |
| Milestone | crossing 10/25/50/99 | Extra flourish |

**The walkover row is where the "Level 2 Cheat Skill" fantasy lives.** A walkover shouldn't just be shorter — it should be funnier. Ame taps the guardian, it falls over delighted. That converts over-preparation from "made the game trivial" into "a joke you're in on", which is exactly the named favourite.

Same principle for rescues (first-of-species deserves more than a repeat), doors, and pickups.

### CR-JUICE-06 — Particles are Unicode glyphs
**Verified, unchanged.** `magicEffects.ts:16-29` — door burst particles are text characters (`♥ ✦ ❀ ★ ◆ ☀ •`); `createDoorBurstParticles` produces 18 DOM elements carrying glyphs. `visualPersonality` uses the same approach for flourishes. The touch cursor also falls back to a literal `"✦"` (`App.tsx:2337`).

**Two problems:**
1. **Cross-platform inconsistency.** These resolve through the font stack. On iPadOS several (`❀`, `☀`, `◆`) are likely to fall through to the system emoji font and render full-colour, while Windows renders them monochrome. **The particle art may look materially different on the Human's two primary review devices.** That's the kind of thing invisible in a screenshot comparison but reads as unpolished in motion, and it could be part of the unquantifiable "something's off" feeling.
2. **Art-direction mismatch.** The project has an exceptional pipeline producing 512 px authored renditions of everything, and its sparkles are typography. The Art Bible's material language has no expression in the effect layer.

**Proposals:** *(a)* five-minute check — screenshot a door burst on iPad and Windows side by side; *(b)* cheap fix — inline SVG shapes defined once and referenced via `<use>`, deterministic and art-directable; *(c)* better — a small authored particle set (6–10 shapes in the Maze material language) with a documented vocabulary of which shape means what (gold = reward, mint = friend, lilac = magic, coral = impact).

### CR-JUICE-07 — Ame needs an idle and a discovery pose
**Assessed.** No idle behaviour found. When the player stops, Ame stops.

Three small states: **idle breathing** (~2 % scale at ~3 s — nearly free, and the difference between a sprite and a character); **long idle** after ~8 s (looks around, adjusts her backpack — the moment a child looks up and says "look, she's doing something"); **discovery pose**, a held ~400 ms reaction on pickup/rescue, making *her* the subject rather than the UI.

**For Plan 05:** these are three poses, not three animations. The vision spec's own framing — *"strong held poses and readable expressions matter more than high frame count"* — is right, and I'd argue idle + discovery + reaction outrank any walk cycle.

---

## 5. Audio and sound design

**Status: nothing here has changed, and no plan owns it.** A grep of the roadmap finds one incidental SFX mention. Given the Human wants satisfying reward showers, a more elaborate door sound, and a hoover that "must not get annoying", this is a real scoping gap.

### CR-AUDIO-01 — There is no master chain
**Verified.** `sound.ts:216` — each voice's gain connects **directly to `ctx.destination`**. No master gain, no compressor, no limiter, no buses. `MAX_ACTIVE_VOICES = 24`.

With up to 24 raw oscillators summing straight into output, overlapping cues sum linearly and can clip — worst exactly when the game is most exciting (combat victory 5 voices + treasure 4 + step 1 + rescue 7). Reward showers will make it worse.

**Proposal (~10 lines, do it now):** `master = createGain()` (~0.8) → `DynamicsCompressorNode` (threshold −18, ratio 4, attack 0.003, release 0.15) → destination; route every voice through `master`. Prerequisite for everything below.

### CR-AUDIO-02 — Everything is a pure tone
**Verified.** Every voice is `sine | triangle | square | sawtooth` with an exponential gain envelope and an optional frequency ramp. No noise, no filter, no space.

This is the ceiling on how the game can sound. Pure tones read as electronic beeps — the vocabulary of a 1980s handheld. Kirby's character comes from noise, filtering, and space: a footstep is filtered noise; a sparkle is high noise through a resonant filter; a magical sound is tone *plus* noise *plus* reverb.

**Proposals:** *(a)* a white-noise `AudioBuffer` created once, played through a `BiquadFilterNode` (~20 lines — unlocks steps that sound like steps, impacts that thud, sparkles that shimmer); *(b)* a lowpass with a quick envelope on tonal voices, turning a beep into a pluck; *(c)* a cheap space — a `ConvolverNode` with a procedurally generated 0.6 s impulse (~15 lines, no asset) or a `DelayNode` + feedback + lowpass; *(d)* layering — transient + body + tail. `doorOpen` already does something like this with 7 voices and is the best-sounding cue in the file, which supports the argument.

All procedural, zero payload, works offline. Perhaps 100–150 lines for a transformative change.

### CR-AUDIO-03 — The step sound repeats identically several times per second
**Verified.** `step: [[420, 0, 0.045]]` — one 45 ms sine at a fixed 420 Hz, on every step. At 8 tiles/s that's 8 identical beeps per second, and it's the sound the child hears more than any other by an enormous margin.

**Proposals:** *(a)* pitch jitter — `frequency × (1 + (random() − 0.5) × 0.1)`, one line; *(b)* make it a filtered noise burst rather than a tone; *(c)* vary by terrain — stone, grass, wood — nearly free once (b) exists, and lovely world-building (the child learns the floor changed *by ear*); *(d)* a gentle volume duck on sustained movement.

### CR-AUDIO-04 — The ascending-pickup chain
**Assessed.** The Human's requirement — *"deeply satisfying… must not get annoying even when you're hoovering up a lot"* — has an established solution: **consecutive pickups within a short window step up a scale, then reset.** Mario coins, Sonic rings, Banjo notes.

It works because repetition becomes musical *progression*; because collecting many things then feels *better* than collecting one, which is the desired emotion; and because it self-limits — cap at 8–12 steps and hold, so a huge shower resolves rather than escalating painfully.

**Proposal:** track `lastPickupAt` and `chainIndex`; within ~900 ms advance and transpose up a pentatonic step (pentatonic never sounds wrong); beyond the window reset. Optionally a small resolving flourish on completing a long chain — deeply satisfying, and it teaches without words that gathering quickly is rewarded. **Highest-value audio item, and it directly serves a stated requirement.**

### CR-AUDIO-05 — Music and SFX have no relationship
**Verified.** `musicTransport` and `playSound` are independent — no shared bus, no ducking.

**Proposal:** duck music ~3–4 dB for ~400 ms under significant cues. Cheap, and it makes big moments feel big without making them louder.

### CR-AUDIO-06 — SFX needs an owner
**Proposal.** A short dedicated plan, or a named workstream inside Plan 02 — since a sparkle and its sound are one event, not two. Scope: master chain and buses; synthesis vocabulary; a documented cue-design language (what "reward" sounds like vs "block" vs "discovery"); the pickup chain; ducking; per-terrain footsteps; and the mix, checked at low volume on tablet speakers.

**One practical note:** iPad speakers roll off below ~500 Hz. `combatImpact` starts at 150 Hz and ramps to 58 Hz — **it will be nearly inaudible on the primary target device.** Worth checking the whole cue set on real hardware and re-voicing anything living too low.

---

## 6. UI and UX

### 6.1 — CR-UI-02 — The scale problem, now with exact numbers *(sharpened in v3)*

This is the most important section in this update.

**Verified.** `.adventure-hud` still declares `container: adventure-deck / inline-size` (`hud.css:2`), so **container queries cannot see height at all**. And `.adventure-overview` still uses `flex: 1 0 auto` with `align-content: center` (`hud.css:27`), which converts spare height into equal empty bands by design.

**Measured — and this is the part I'd most like you to check.** Using the *current* `layout.ts`:

| Target | `minimumDeck` | Board | **Deck width (= `100cqw`)** |
|---|---|---|---|
| 1194×834 iPad | 480 | 706 | **480 px** |
| 1280×720 | 512 | 720 | **548 px** |
| 1920×1080 | 520 | 1080 | **832 px** |

Now resolve every clamp at those deck widths:

| Element | Declared | iPad (480) | 720p (548) | 1080p (832) |
|---|---|---|---|---|
| `.power-counter img` | `clamp(44px, 9cqw, 80px)` | 43 → **44 (floor)** | 49 | 75 |
| `.wallet-pill img` | `clamp(36px, 7cqw, 62px)` | 34 → **36 (floor)** | 38 | 58 |
| `.utility-row img` | `clamp(30px, 5cqw, 48px)` | 24 → **30 (floor)** | 27 → **30 (floor)** | 42 |
| `.hud-title h2` | `clamp(1.15rem, 2.8cqw, 1.6rem)` | 13 → **18.4 (floor)** | 15 → **18.4 (floor)** | 23 |
| `.thumb-pad` | `clamp(152px, 25cqw, 190px)` | 120 → **152 (floor)** | 137 → **152 (floor)** | 190 (cap) |
| `--slot-size` | `clamp(48px, (100cqw − map − 58)/3, 112px)` | ≈ 67 | ≈ 79 | 131 → **112 (cap)** |
| Minimap (`--map-size`, from `layout.ts`) | — | 220 | 253 | 380 |

**On the primary target device, every single container-query size resolves below its floor.** The responsive system is inert on an iPad; the HUD renders at its designed *minimum* everywhere. At 720p, four of six are still at the floor. Only at 1080p do the units do anything — and then two hit their *caps*.

**This is the precise, mechanical answer to "everything is tiny", and I think it is more useful than any amount of design discussion.** The coefficients are calibrated for a container roughly twice the width the layout actually produces. To land the power icon at ~96 px on a 480 px deck you need about **20cqw**, not 9cqw.

**Proposal — four changes, roughly 25 lines total:**
1. `container-type: size` on `.adventure-hud` (safe — it already has a definite block size).
2. `cqw` → `cqmin` throughout, so a tall deck contributes.
3. **Recalibrate every coefficient against the real 480–832 px deck range** so mid-range lands mid-clamp rather than at the floor. Roughly doubling most coefficients is the starting point.
4. Raise the caps (`--slot-size` 112 → 160, power icon 80 → 130, utility icon 48 → 64) so 1080p/TV can breathe.

Then replace `align-content: center` with a grid whose rows are `fr`-distributed, so surplus height becomes *bigger art* rather than *bigger gaps*.

**A suggested verification, because this is easy to get wrong twice:** print the computed pixel size of six named elements at the five review viewports into a JSON artifact, and diff it against the target table in CR-UI-01. That turns "is it big enough?" from a taste argument into a build check.

### 6.2 — CR-UI-16 — `minimumDeck` was raised, and I think it is the wrong lever *(new in v3)*
**Verified.** `layout.ts` changed this pass: `minimumDeck` went from `360` to `Math.max(480, Math.min(w × 0.40, 520))`, and `compact` now triggers below 600 px height rather than 450.

**Assessed.** I read this as an attempt to solve the scale complaint by giving the deck more width — which does help, because every size is `cqw`-based. But:

1. **It trades the wrong thing.** The Human also asked for the maze to be as large as possible and for Big/Normal to be removed in favour of "always big". Widening the deck by 120 px shrinks the board on width-constrained targets.
2. **It doesn't actually work.** Per §6.1, even at 480–548 px the clamps are still at their floors. The deck got wider and the icons stayed the same size.
3. **The vertical space is still unused.** On iPad the board is 706 × 706 in an 834 px column — 128 px wasted (CR-FEEL-01b) — while the deck's own surplus height is invisible to the stylesheet.

**Proposal.** Reverse the trade: fix the container type and coefficients (§6.1) so the deck can be *narrower* and still render large art, make the camera window rectangular (CR-FEEL-01b) so the board uses the full available rectangle, and let `minimumDeck` return toward ~400–440. That gives a bigger maze *and* bigger icons — which is what was actually asked for.

I could be wrong about the intent behind the change; if there's a reason the deck needs ≥ 480 px that I can't see from the code, that reason should probably be written down, because it's a significant constraint on the board.

### 6.3 — CR-UI-01 — Replace the property-based spec with a numeric contract
**Assessed, unchanged.** Every UI requirement is a property — "generously sized", "as much useful space as the screen permits", "enlarge map, portrait, inventory, friends". None is falsifiable. An agent producing a 220 px minimap can defend it as generous; the Human disagrees; the cycle repeats.

**Proposal — a table in the vision spec, checkable with a screenshot and a ruler:**

| Element | 1280×720 | 1194×834 iPad | 1920×1080 | 844×390 phone |
|---|---|---|---|---|
| Minimap edge | ≥ 300 | ≥ 300 | ≥ 420 | ≥ 120 |
| Friend / bag slot | ≥ 88 | ≥ 88 | ≥ 120 | ≥ 48 |
| Utility button icon | ≥ 44 | ≥ 44 | ≥ 60 | ≥ 30 |
| Ame portrait / Power | ≥ 96 | ≥ 96 | ≥ 130 | ≥ 48 |
| Body text (glyph height) | ≥ 16 | ≥ 16 | ≥ 20 | ≥ 14 |
| Label text (glyph height) | ≥ 14 | ≥ 14 | ≥ 17 | ≥ 12 |
| Unallocated vertical space in deck | ≤ 24 total | ≤ 24 total | ≤ 32 | ≤ 16 |

*(CSS px. **Please replace with your own numbers** — the value is that numbers exist, not that mine are right. Current actuals are in §6.1 for comparison: the minimap is 220 vs 300, the power icon 44 vs 96, utility icons 30 vs 44.)*

The team's inspiration research makes an excellent point I'd fold in: Xbox's guidance measures **visible glyph body height**, not declared font-size. A 44 px button with a thin 11 px label is not a large control.

Plus the sentence that captures the intent behind every complaint:

> **The deck's content scales with the deck's size.** If the deck grows, the art inside it grows. Unallocated space in the deck is a defect, not a layout outcome.

**And a visual gate.** Automated checks can't detect "this looks like a dashboard". A side-by-side contact sheet at the five viewports, Human-approved, should be a named deliverable rather than an ad-hoc rescue.

### 6.4 — Remaining mechanical items

#### CR-UI-06 — Transients must never affect layout
**Verified / done for the feedback band** (`.deck-feedback` reserves 48 px). **Proposal — generalise as a rule** so it can't regress: no transient presentation participates in layout; everything transient is absolutely positioned in a reserved box or is transform/opacity only. This also covers "the maze view gets bigger and smaller during animations".

#### CR-UI-03 — One moment, one obvious action
**Partly done.** Several dialogs simplified in UI-03. **Proposal — the rule, so it stops recurring:** every dialog has exactly one primary action and at most one secondary; a dismissal control exists only when dismissing means something *different* from the primary; clicking anywhere on an acknowledgement dialog performs its primary action. For a pre-reader, two buttons that do the same thing is a comprehension failure.

#### CR-UI-04 — Modality-aware focus ✅ substantially done
`:focus-visible` with plum outlines, component-specific insets, and `forced-colors` support (`base.css:9-12`). The maze board retains a subtle inset lilac ring, which I think is acceptable. Remaining nicety: a `data-input-modality` attribute would let gamepad focus differ from keyboard focus, which matters for the couch scenario — but this is now a polish item, not a defect.

#### CR-UI-05 — Board drag still anchors to Ame
**Verified.** `moveDirectionFromPointer` (`App.tsx:1632-1633`) still computes `centerX/centerY` from Ame's screen position, so you must drag past her to steer.

**Good news:** the new `ThumbPad` already implements the correct behaviour — `thumbDirection(x, y, previous)` with a 0.20 deadzone and diagonal hysteresis (`ThumbPad.tsx:6-11`). **The board drag can reuse that exact function.** The change is: below a small movement threshold, keep tap-relative-to-Ame (correct today); above it, switch to `pointer.origin` (already stored at `App.tsx:1689`) as the anchor and call `thumbDirection`.

#### CR-UI-07 — Largest rendition in detail views ✅ infrastructure done
`CatalogueImage` is now DPR-aware with proper external-store subscription. **Remaining contract to state:** any detail view (friend, bestiary, item, blocker) resolves the largest crisp rendition, never an enlarged field sprite — and locked achievements show greyed real artwork, not `?`. Worth writing down so a future agent doesn't "tidy" it back.

### 6.5 — Ambitious proposals (argue with these hardest)

#### CR-UI-08 — Make the interface diegetic: the deck is Ame's adventure kit
**Taste / Proposal.** The vision spec asks for *"a polished, authored video-game UI… not a generic clean web dashboard with themed images."* I think the reliable route is to stop making a panel with sections and start making **an object from the world**.

The map is a folded paper map — creases, slight rotation, soft edges. The bag is actual pockets on her backpack; an empty slot is an empty pocket, not a dashed rectangle. Friends peek over the edge of a basket; unrescued ones are silhouettes in a locket. Power is a badge, physically pinned. Utility buttons are enamel pin badges.

**Why this matters more than it sounds:** Trails' notebook and Kirby's UI read as *game* rather than *app* because they are objects with implied physicality — thickness, material, edges that aren't perfect rectangles. Maze's tokens already contain the vocabulary (`--rim`, `--button-depth`, `--surface-depth`, the pearl/paper language). What's missing is committing to the *metaphor*, so every element has an obvious material answer rather than needing a fresh aesthetic decision. It also solves "what goes in the empty space" automatically — an object has natural composition; a dashboard doesn't.

**Cost:** mostly art direction and CSS. Could be prototyped as a single static mockup before any code, which is probably the cheapest way to get the Human's reaction.

**Counter-argument to weigh:** diegetic UI can hurt legibility and accessibility if pushed too far. The discipline would be: **material and shape are diegetic; text and hit targets are ruthlessly clean.**

#### CR-UI-09 — Reconsider whether the minimap should be a minimap
**Taste / Proposal, held loosely.** The minimap is an abstract grid of coloured squares (`MiniMap.tsx:55-75`) with a legend at 0.75 rem. For an adult it's instantly readable. For a young child, *"this small coloured square is that big place you were standing"* is a genuinely hard abstraction — and the presence of a legend is itself a sign the abstraction isn't self-evident.

**Consider making it feel like a treasure map:** explored corridors as a hand-drawn path with a slightly wobbly stroke; landmarks as tiny versions of the *actual sprites* rather than coloured dots; unexplored area as parchment or mist; Ame's position as a small version of *her*; the camera frame as a soft highlight.

**Costs and risks:** at 23×23 in a 300 px map, cells are ~13 px — sprites will look bad without a dedicated tiny-icon set, which is a real art cost. A hybrid (schematic terrain, pictorial landmarks) is probably the sweet spot. Performance would favour canvas over 576 DOM nodes (CR-PERF-02).

**Cheaper alternative if the full idea is too costly:** keep the grid, replace marker dots with tiny sprite icons, soften the fog. Most of the readability win for a fraction of the cost.

#### CR-UI-10 — Power should be the hero of the HUD
**Assessed.** Power is the core mechanic, the core educational content, and the number the game is about. In the HUD it's one pill among pills, sharing a row and a visual language with two currencies that currently do nothing (§8.3).

**Proposal.** Its own visual tier: distinctly larger, distinctly different in shape from the wallet pills, adjacent to Ame's portrait so identity and capability read as one thing, and animated on every change — count-up, scale pulse, colour warm-up. The rainbow treatment above 99 exists (`legendary-rainbow`); the principle should extend downward so *every* Power change feels like the event it is.

**Corollary:** if gold and Science stay sinkless, consider whether they belong on the play HUD at all, or only on the victory screen and in the Book. Two prominent counters that don't matter dilute the one that does.

#### CR-UI-11 — The objective should be a picture
**Verified.** Objectives are prose — *"Build Power 99, bring home the Sunny Key, and return for the Rainbow Guardian!"* (`levels.ts:1098`). Lovely writing, unreadable to the target player.

**Proposal.** Render it as a row of pictures with minimal text: `[key sprite] × 1 · [star sprite]`. Keep the prose for the parent and for reading aloud, but make the *primary* representation pictorial, because that's the one the child can act on alone. The engine already knows exactly what's required (`hints.ts:98`, `getRequiredPath`).

#### CR-UI-12 — The "one glance" test
**Proposal.** One qualitative gate alongside the numeric contract:

> Show a screenshot to someone unfamiliar for one second, then hide it. Can they say what the player should do next?

If not, the hierarchy is wrong regardless of measurements. Cheap, fast, runnable on any adult in the room, and it directly encodes the product goal.

#### CR-UI-13 — A small motion vocabulary
**Proposal.** UI motion exists but doesn't follow a stated grammar. A tiny consistent vocabulary makes an interface feel authored:

| Meaning | Motion | Duration (hypothesis) |
|---|---|---|
| Appeared | Scale 0.85 → 1, slight overshoot | 220 ms |
| Changed | Pulse 1 → 1.08 → 1 + brief brightness | 180 ms |
| Became available | Gentle rise, shadow deepens | 200 ms |
| Waiting for you | Very slow breathing, ≤ 2 % | 2.4 s |
| Consumed / spent | Scale down + fade + drift toward target | 260 ms |
| Panel enters | Slide 12 px + fade, eased out | 240 ms |

Consistency matters more than the values. Test: could a player learn what a motion *means* without being told?

#### CR-UI-14 — Couch and TV distance
**Assessed.** TV via Steam Deck is a named primary context, and §6.1 shows 1080p is the one size where the clamps actually engage — but they then hit their *caps*, so a TV gets 1080p-desktop sizing rather than couch sizing.

**Proposal.** Treat large viewports as a signal to *scale up*, not to *add columns*. At 1080p the interface should be roughly 1.4–1.6× the 720p sizes. This is where the numeric contract earns its keep — without it, "responsive" naturally produces more content at the same size, which is exactly wrong for couch distance. Also worth checking TV overscan safe areas.

#### CR-UI-15 — The moments around play
**Assessed.** Two moments carry disproportionate weight and no plan owns them.

**(a) First run.** The first thirty seconds decide delight or confusion. Worth designing explicitly: what's on screen, what moves, what invites a touch, how the very first successful movement is celebrated. The first step Ame ever takes should feel like the game noticed.

**(b) Returning.** *"Welcome back!"* with the last friend rescued and the current maze does more for a child's sense of continuity than a Continue button. `PlayerProgress` holds everything needed.

---

## 7. Visuals, lighting, effects, animation

### CR-ART-01 — Wall depth needs extrusion, not a drop shadow
**Verified, unchanged.** `MazeTerrain.tsx:228-258`: the wall path filled flat `#332b58` at 34 % opacity, offset 0.10 tiles, Gaussian blurred; plus a 0.045 white stroke offset the other way, applied to the **entire** path including edges facing away from the light.

That's a drop shadow and a full-perimeter rim light. It reads as a sticker floating above the floor, which I think is why walls don't feel three-dimensional despite the effort.

**Proposal — a solid with a top face, a side face, and grounded contact.** All achievable in the existing SVG:
1. **Extrusion body** — draw the path twice: an offset copy along the light-opposite vector (~0.18 tiles) in a darker material tone as the side face, behind and clipped to the union so it only shows on lit-away sides; the main path on top as the top face.
2. **Directional top-face gradient** along the light vector, so long runs aren't uniform.
3. **Contact shadow, not drop shadow** — short (~0.06 tiles), tight, denser near the wall.
4. **Edge highlight on lit sides only** — probably the biggest readability gain per unit effort.
5. **Ambient occlusion at the floor seam** — a very short dark gradient.

`lightVector()` (`MazeTerrain.tsx:15`) already resolves one light direction per level; this uses it properly. **Sequencing depends entirely on §3.4** — if terrain bakes, all of this is free at runtime and you can be far more ambitious.

### CR-ART-05 — A concrete, cheap lighting model
**Proposal.** Stylised, three parts:
- **(a) Three values, not a gradient.** Group into lit / mid / shadow rather than smooth shading. This is how the reference styles read *clean* rather than *rendered*, and it's already the Art Bible's language for characters — applying it to *terrain* would unify a scene that currently has painterly characters on comparatively flat ground.
- **(b) A warm/cool split.** Lit surfaces shift warm; shadows shift cool toward the plum family. Does more for perceived three-dimensionality than any amount of blur, and it's the trick that makes stylised art look *painted* rather than *tinted*.
- **(c) A hero light on Ame.** A soft radial lift within ~2 tiles falling to neutral. Ame becomes the brightest thing on screen (the eye finds her instantly — important once FOV grows), the world gains depth, and the maze gets a "pool of light" quality suiting a magical storybook. One radial-gradient overlay following the player in `screen` or `soft-light`. **Must be subtle** — if a reviewer notices "there's a light around her", it's too strong.
- **(d) Per-region light consistency.** Worth checking the level light direction actually agrees with how object sprites were lit in their source art. A mismatch reads as slightly wrong in a way nobody can name — a common cause of unquantifiable "something's off" feedback.

### CR-ART-06 — Per-theme colour grading and vignette
**Proposal.** Twelve terrain themes exist, differentiated mainly by texture. A per-theme **grade** — subtle global tint, contrast, saturation, plus a soft vignette — would make Ember Keep feel warm and close, Moonlit Moat cool and open, Pearl Grotto luminous. Themes currently change *what things look like*; grading changes *how the place feels*, which is a stronger axis. One filter and one overlay per theme, defined beside the existing `floorTreatment`/`wallTreatment` values.

**Caution:** must not compromise sprite readability. Check the darkest theme against the smallest UI text overlaying the board.

### CR-ART-07 — Depth cueing
**Proposal.** A subtle reduction in contrast and saturation further from Ame — atmospheric perspective for a top-down view. Draws the eye to the player's immediate options and gives the maze a sense of extent. Especially valuable once FOV increases. Can share the CR-ART-05(c) overlay.

### CR-ART-08 — An effect hierarchy and simultaneity budget
**Assessed.** With 69 keyframes in `scene.css` plus 7 in `dialogs.css` and more coming from 02/04/05, the risk isn't any single effect but several firing at once. The Human has stated the principle — *"variety should come from meaningful combinations and pacing, not indiscriminate simultaneous clutter"* — but nothing enforces it.

**Proposal — three tiers with a budget:**

| Tier | Examples | Rule |
|---|---|---|
| **Ambient** | breathing, drift, sway, shimmer | Always on; below conscious notice; never competes |
| **Incidental** | step dust, proximity reaction, pickup pop, follower ripple | Frequent; < 400 ms; never blocks input; may overlap |
| **Event** | combat, rescue, door, portal, victory | **At most one at a time.** Others queue or suppress. May take focus |

Only one Event-tier effect at once, and Event effects suppress Incidental ones in their focus area. This is what makes big moments feel big — not that they're louder, but that everything else gets quieter. It also gives Plan 02 a decision framework rather than a list, and gives the quality ladder (§3.5) a natural axis to degrade along.

### CR-ART-02 — Sprite blur during programmatic animation (PT-38)
**Assessed.** Usual cause: the browser rasterises once, then GPU-scales during a transform animation. Set `will-change: transform` *before* the animation starts and remove after; avoid animating scale *upward* from rest — render at the largest size reached and scale *down*. Also check no ancestor applies a fractional `scale` alongside a fractional `translate`, which compounds resampling — plausible given `.camera-world`'s percentage sizing.

### CR-ART-03 — Poison bubbles
**Verified, unchanged.** Four `<circle>`s in a single `<pattern>` (`MazeTerrain.tsx:104-111`) tiled across all poison, so **every tile shows identical bubbles in identical phase** — the reported "racing columns". A tiled pattern fundamentally cannot vary per instance.

**Proposal:** a larger pattern (4–6 tiles) with many bubbles at hand-varied phases, speeds and sizes — cheap and probably sufficient. Slow them substantially, and vary radius, speed and opacity *together*.

### CR-ART-04 — Two principles worth recording in the Art Bible
1. **A motif that appears on everything stops being a motif** (the Lamia leaf note).
2. **Symbols should be stylised, not literal** (the teleporter pads) — the original clover/spade readings were preferred because they were *inspired by* card suits rather than being card suits.

---

## 8. Core game design depth

*(Unchanged since v2 — nothing here has moved, and this is the section that most needs the Human's own judgement.)*

### 8.1 — CR-DESIGN-01 — Nothing is ever spent, so no decision has a cost
**Verified.** Full audit of `engine.ts:103-404` and `types.ts:219-238`: Power is monotonically increasing; sword/boots/spring boots/antidote leaf are permanent booleans; keys are permanent **and explicitly reusable** (`hints.ts:50`); gold and Science accumulate with **no sink**; there is no health, no lives, no timer.

With no opportunity cost, there is never a choice between two goods, so the dominant strategy in every maze is *explore exhaustively, collect everything, leave*. That is a pleasant, safe, genuinely child-friendly experience — and it is also why the mazes aren't puzzles.

**This is the ceiling on the whole game.** Plan 09 can add twenty-four beautiful themed mazes and they will all still be solved by walking everywhere.

**Options, ranked by depth ÷ frustration risk. Pick one.**

**Option B — Ice and momentum (recommended; already PT-14).** Sliding until you hit something makes *movement itself* the puzzle. High depth, of a different kind to Power arithmetic; teaches prediction and consequence, which the vision spec names as targets. Very low frustration risk. **Low solver risk — a slide is one atomic transition** (important, CR-RISK-03). Soft-lock risk is small and handled by authoring discipline plus solver coverage. Best value-for-risk, already requested, already backlogged.

**Option A — Single-use keys with a confirmation.** The blocker dialog becomes *"Use your Rose Heart Key here?"* with the key's large art and **Yes / Not yet**. Creates the classic legible "which door?" decision and makes the minimap load-bearing. Frustration controlled by the confirmation — every commitment deliberate, and a natural parent-child conversation. **But significant solver risk**, and it only becomes interesting *after* braiding (§8.2) — in a tree, "which door" has no texture.

**Option C — Counted currency gates.** Better considered as a currency sink (§8.3) than as puzzle depth.

**Option D — Consumable Power.** **Not recommended** — inverts the emotional promise, creates unwinnable states, contradicts the Polite Sword Rule. Noted only to record it was considered.

**If no rule change is accepted**, the honest position is that the campaign should lean fully into being a warm exploration-and-collection game — a completely legitimate product that the art, music, friends and story carry easily. But then **Plan 09's "much harder and more puzzly" brief should be revised**, because setting a specialist a goal the rules can't support will produce another round of disappointment.

### 8.2 — CR-DESIGN-02 — Generated mazes are trees; braid them
**Verified, unchanged.** `carvePerfectMaze` (`generator.ts:188-247`) is a recursive backtracker that never re-opens a wall. `carveDeadEndRooms` (`:291`) widens 1–4 dead ends into explicitly single-doorway chambers. Global topology remains a tree.

Consequences, all independently reported by the Human: exactly one path between any two tiles → **no route choice exists**; every wrong turn fully retraced; every leaf a pure penalty; followers forced to reverse through the player's trail in one-tile corridors.

**Proposal — a braiding pass** after carving, before object placement: enumerate dead ends (`floorNeighbors` already does this); for a seeded fraction (35–50 %, difficulty-tuned) knock out one wall connecting to a *different* corridor, preferring the longest new loop; never remove a border wall; never create a 2×2 open block outside a room; re-run the existing solver validation. ~30 lines.

**Apply to authored levels too** — an explicit **loop budget** per chapter, measurable from the terrain grid and therefore gateable in tests.

### 8.3 — CR-DESIGN-03 — Gold and Science have no sink
**Verified, unchanged.** No spend, cost, purchase or exchange path exists. The only proposed sink is Science → Friend Eggs in Plan 10, the last major plan.

A child who collects a number that never does anything learns the number doesn't matter — and stops caring about the treasure level designers use to reward exploration.

**Proposals:** *(1)* pull Science → Egg forward, decoupled from co-op. A minimal version — spend Science, hatch an egg, permanently add a friend to the Book with a lovely reveal — needs no garden simulation and reuses the friend catalogue and Book surface. It makes Science *"the currency that collects friends"*, which is the emotional heart. *(2)* gold buys Book cosmetics — sticker frames, covers, a trophy shelf; zero balance risk, reuses PT-27/28 art. Otherwise, consider hiding the second currency until it means something.

### 8.4 — CR-DESIGN-04 — Teach the subtraction 🟡 half done
**Verified.** `mapNotices.ts:33` now shows `Power Potion! 2 + 3 = 5` — good, and exactly the requested phrasing. **Two halves remain:**

1. **Combat still shows only `+5!`** (`mapNotices.ts:53`). `enemy-defeated` already carries `powerBefore` and `powerAfter` (`engine.ts:249-255`), so `7 + 5 = 12!` is available for free.
2. **The too-strong dialog shows a comparison, not the gap.** `App.tsx:2691-2694` renders a side-by-side `power-equation` (Ame 7 · Guardian 12). That's comparison. The subtraction — **"Ame needs 5 more Power!"** — is the teachable fact and it isn't there. It should be the animated star of the moment, with the gold/rainbow treatment used for rewards.

### 8.5–8.7 — Size ladder, interest rhythm, guarded optional battles
**Unchanged.** Encode the "mazes over 16×16 should be rare" instinct as a rule (note the generator's difficulty ceilings at `generator.ts:122-127` scale primarily by *size*, contradicting the vision spec). Adopt a measurable interest-rhythm constraint (something notable every ~8 tiles on any route between required objectives) so "not boring" becomes a gate. Make optional guardians visibly *guard* something, converting skip-or-fight into a legible trade.

---

## 9. Content, story, copy, edutainment

### CR-CONTENT-01 — Two voices, and one a child can't read
**Verified, unchanged — and the new UI-03 copy continues the pattern.** Compare the feedback voice (*"Spring boots found! Boing!"*) with:

- `hints.ts:105` — *"The next required goal is the maze weapon. Friends and treasure are optional adventures."*
- `hints.ts:53` — *"Matching flower portals are a persistent pair: stepping on one always arrives at its twin."*
- `App.tsx:1422` (**new this pass**) — *"Goblin: 12 Power. Ame is safe at 7; explore, then return."* — a semicolon, and "explore, then return".
- `App.tsx:2689` (**new this pass**) — the secondary button reads **"Show Required Path"**, which is exactly the meta-vocabulary flagged last time.

**Proposals:** rewrite hints in the feedback voice; make Tier 0 **picture-first** (an image of what you need plus two or three words); show direction *spatially* — pulse the correct direction on the thumb pad and put an arrow on the board rather than saying "Try left"; rename "Required Path" to something a child could ask for (*"Show me the way"*). **Keep the story interludes exactly as they are** — those are read-together adult voice and they're genuinely lovely. The rule: **story = adult read-aloud voice; feedback and hints = child-direct voice.**

### CR-CONTENT-02 — Translating Ame's favourites into mechanics
| Source | What's appealing | Original expression |
|---|---|---|
| **Numberjacks** | Numbers as characters | Give Power numbers a face at key moments; the "needs 5 more" beat could star a numeral character |
| **Killing Slimes 300 Years** | Cosy, gentle accumulation | The game's true genre; argues *for* no-fail design and a visible long-term collection |
| **Level 2 Cheat Skill** | Being absurdly overpowered | **Reward over-preparation** — CR-JUICE-05: a walkover should be short *and funny* |
| **Ragnarök / Idle Poring** | Collectible monsters; drop-and-hoover | PT-22 showers + CR-AUDIO-04 chains; bestiary as a *collection* with a "New!" moment (now possible via `discovery.ts`) |
| **Trails in the Sky** | Warm cast who comment; book UI | CR-JUICE-04(d): followers occasionally speak. Greetings exist and are unused |
| **Pokémon / Fantasy Life** | Every creature has an entry and a habitat | Plan 09's authored rescue ecology — this is the emotional reason it matters |
| **Gurumin** | Chunky world, tactile impact | CR-JUICE-03 |
| **Paw Patrol / Peppa Pig** | One clear problem, one clear resolution per episode | Keep each chapter as one legible "problem of the day" as the campaign grows to 24 |

### CR-CONTENT-03 — Celebrate the friends
See CR-JUICE-04. The victory screen now proves the craft exists — 32 authored signatures. The proposal is to spend that craft in *ordinary play* too: the ripple, gathering when idle, glances, and rare lines.

---

## 10. Programme risks, gaps, discrepancies

### CR-RISK-01 — `App.tsx` is now 2,853 lines and growing
**Verified.** Up from 2,797 last pass. Still 13 % of the source tree in one file, owning game state, presentation timers, input, modal state, scene render and HUD wiring.

Plans 02, 04, 05, 08, 10 and UI-02 all need to modify it. **Proposal — one bounded, behaviour-preserving extraction before Plans 04/02/05/08.** Natural seams: `usePresentationQueue` (presentation lifecycles, natural home for §3.3), `useMovementInput` (natural home for the CR-FEEL-03 pump), `useLevelSession` (the seam co-op needs), `<MazeScene>` (pure presentation), `useModalState` (already half-extracted into `interactionState.ts`). Target under ~600 lines as a composition root.

**Doing this before Plan 10 is close to essential** — co-op's fixed clock can't be retrofitted into the current structure.

### CR-RISK-10 — Parallel agents now authorised while the hub file grows *(new in v3)*
**Verified.** The handover now reads: *"Root integrates disjoint fresh implementation/review agents under the Human's subsequent explicit parallel-work authorization."* That's a change from the earlier "only one runtime implementation agent at a time".

**Assessed.** Parallel work is clearly delivering — this pass produced ~4,000 lines across a lot of surface. But the two facts sit uncomfortably together: the programme has moved to parallel agents *at the same time* as its single largest file grew, and "disjoint" is hard to guarantee when six plans all need `App.tsx`.

**Proposal.** If parallel work is continuing — and it looks productive, so I'd expect it to — **raise the priority of CR-RISK-01.** The extraction is what actually makes disjointness real: once presentation, input, session and scene are separate modules, two agents can genuinely work without collision. Right now "disjoint" is being maintained by careful coordination rather than by structure, and that is the kind of thing that works until it suddenly doesn't.

A cheap interim measure: declare file-level ownership per active agent in the handover, so collisions are at least visible before they happen.

### CR-RISK-02 — Changing the FOV invalidates four plans and one test
**Verified, unchanged.** `exploration.test.ts:25` (`expect(DEFAULT_FOV_SIZE).toBe(6)` — will fail); `ARCHITECTURE.md:146, :487`; `RELEASE_CHECKLIST.md:711`; Plan 01's ASCII diagrams (`:598, :709`); **Plan 03's art review protocol, which reviews sprites at 6 × 6 scale** (`:295, :682`); Plan 04's analysis (`:305`); `VERCEL_DEPLOYMENT.md:182`.

The art gate has real cost: a smaller tile means re-confirming actual-size review. Cheap, but must be planned. **Treat FOV as a Human decision, record it in the vision spec, update everything in one change.** If CR-FEEL-01b (rectangular windows) is also adopted, the same change should cover it.

### CR-RISK-03 — New mechanics multiply the solver state space
**Verified, unchanged.** BFS over `progressionStateSignature` with a 250,000-state ceiling (`solver.ts:218-220`), returning `state-limit` treated as validation failure. The handover records solver timeouts on this laptop under parallel load, so the margin isn't generous — **and parallel agents (CR-RISK-10) increase that load.**

Impact: single-use keys multiply states by ~(maxKeys+1)³ — **significant**; ice/momentum is one transition — **low**; currency gates add a dimension; larger mazes multiply the position term.

**Proposal.** Before any new rule enters authored content, require a **solver impact assessment**: implement it, run the 16 campaign mazes plus generated seeds, record `visitedStates` distributions before and after. If the ceiling is approached, address it before content is built — iterative deepening, A* with an admissible heuristic, or decomposing validation into per-objective reachability. Discovering this after 24 mazes are authored would be very expensive.

### CR-RISK-04 — Plan 10's fixed clock is incompatible with today's architecture
**Verified, unchanged.** Plan 10 §7.2 requires a fixed clock and command ordering. Today: state in React `useState`; movement on `setTimeout`; presentation on a separate rAF writing directly to DOM; no tick, no command queue, no deterministic ordering.

A deterministic two-seat simulation can't be layered on that — it requires inverting ownership. **This remains the largest architectural risk in the programme, and it's invisible because Plan 10 is last and written as though the foundation exists.**

**Proposal.** Make the CR-FEEL-03 pump *the first step of that architecture*. Solo feel is fixed now; co-op inherits a working clock later; two incompatible pieces of work become one. Costs nothing today.

### CR-RISK-05 — Documentation volume
**Measured, and the handover has improved slightly.** The top section now explicitly labels the superseded STOP as *"Historical STOP before the subsequent UI-03 authorization"*, which is a genuine improvement in readability. The mojibake noted last time is fixed.

Still: `docs/*.md` ≈ 12,000+ lines, `docs/plans/` ≈ 1.7 MB across 29 files, several over 130 KB. Plans that long won't be read in full, so the effective specification becomes whichever section an agent loads — plausibly a contributing cause of the scale miss documented in §6.1, since the "make it bigger" requirement is spread across several documents in prose form and nowhere as a number.

**Proposals:** move superseded handover sections to `docs/handover-history/`; give every plan a mandatory **≤ 2-page Contract header** (what changes, what must not change, acceptance criteria, files it may touch); adopt *documentation growth requires archiving superseded text in the same change*.

### CR-RISK-06 — Docs ratify the terrain approach that is a liability
**Verified, unchanged.** `ARCHITECTURE.md:146` and `RELEASE_CHECKLIST.md:711` present "the 6 × 6 camera clips and translates one full rendered maze world" as settled architecture. Technically accurate, but presented as a virtue rather than the cost in §3. A future agent reading a ticked checklist will treat it as approved. **Update both to state the cost and record the §3.4 decision.**

### CR-RISK-07 — Generated-run persistence gap
**Verified, unchanged.** Vision spec §6 says generated active runs are not persisted; Plan 10 builds a letters→eggs→friends economy spanning mazes and sessions including generated ones. Either rewards accrue only from authored mazes, or generated runs gain persistence, or rewards bank at completion only. The third is probably intended and cheapest — but it's written nowhere. **Record it before Plan 10 begins.**

Note this pass added schema v6 with a clean migration, so the save machinery is in good shape to absorb a decision — which is a reason to make it now rather than later.

### CR-RISK-08 — Multiple input systems
**Verified, and now three.** `movementControls.ts` (held cadence), `pointerControls.ts` (pointer intent), the thumb-pad path in `App.tsx`, and now `ThumbPad.tsx`'s own `thumbDirection` with independent deadzone and hysteresis. Plan 08 will make a fifth.

**Proposal.** Fold the CR-FEEL-03 pump and Plan 08's normalisation into one contract defined before either is built: every source produces the same `{heldDirection, bufferedDirection}` intent; one pump consumes it. **`ThumbPad.thumbDirection` is a good candidate for the shared geometry function** — it already has the deadzone and hysteresis the board drag needs (CR-UI-05).

### CR-RISK-09 — Sequencing puts presentation before feel
**Assessed, unchanged and reinforced by this pass.** UI-03 has produced a lot of good presentation work while the movement and performance findings sit untouched. Plans 04, 02 and 05 will each add per-frame cost to a scene that still rebuilds its minimap on every pointer event. Every family preview until 07B is judged on a build that stutters for reasons unrelated to the work being reviewed.

---

## 11. Proposed roadmap revision

### Phase A — Feel and foundation *(small, contained, unblocks everything)*
1. **CR-PERF-02/03/04** — remaining render defects.
2. **CR-PERF-05a** — compositor promotion.
3. **CR-UI-02a/b** — container-type, coefficient recalibration, cap raise. *Could fold into UI-03 now.*
4. **CR-AUDIO-01, 03a** — master chain + pitch jitter.
5. **CR-FEEL-01 + 01b** — adaptive, **rectangular** field of view, with CR-RISK-02 updates in the same change.
6. **CR-FEEL-02** — dead zone + damped follow.
7. **CR-FEEL-03** — the rAF pump, built as the fixed-step foundation and defining the input contract.
8. **CR-FEEL-06** — re-test the `performance.now()` workaround once contention is gone.
9. **CR-UI-05** — board drag reuses `thumbDirection`.
10. **CR-PERF-06** — bounded asset payload slice.

**→ Family preview here.** Phase A should change the Human's experience more than anything else in this document.

### Phase B — Decisions and cheap depth
11. Human selects on **CR-DESIGN-01** (suggested: ice first).
12. **CR-RISK-03** solver impact assessment.
13. **CR-DESIGN-02** braiding + loop budget.
14. **CR-DESIGN-03** currency sink.
15. **CR-DESIGN-04** the remaining two halves of the arithmetic.
16. **§3.4 terrain decision** — *must precede Plan 04*.

### Phase C — Presentation on a foundation that can carry it
17. **CR-RISK-01** — the `App.tsx` extraction *(raised in priority by CR-RISK-10)*.
18. **CR-UI-01** — numeric scale contract into the vision spec, with the §6.1 computed-size check as a build gate.
19. **Plan 04** — lighting, adopting CR-ART-01 and CR-ART-05.
20. **Plan 02** — VFX with **CR-JUICE-01/03/06** and the **audio workstream** as first-class scope, and **CR-ART-08** as its decision framework.
21. **UI-02** — remaining Book work; consider CR-UI-08/09.
22. **Plan 08** — controls, consuming the Phase A input contract.
23. **Plan 05** — animation, reframed around **CR-JUICE-02/05/07**.

### Phase D — Content and co-op
24. **Plan 09** — with the rules question settled; adopting CR-DESIGN-05/06/07.
25. Plans 11, 13, 12, RC-01, then **Plan 10** with the fixed clock in place.

### What I would not change
The plan structure and single-owner discipline; the art provenance process; the vision spec's product decisions; Plan 03's completed art; and the UI-03 work already landed — the Book, victory, discovery and focus work are all good and should be kept.

---

## 12. What is working well

- **The engine.** Pure, immutable, event-emitting, zero presentation leakage. Stationary combat and door-opening (`engine.ts:209-219`, `:262-270`) was exactly right.
- **`combatPresentation.ts`** — pure timing data, sampled at an offset, fully testable, no timers. §3.3 proposes generalising this precisely because it's the best-shaped code in the presentation layer.
- **Content identity and save migration** — now six tested schema versions, with a discovery sanitiser that blocks prototype-pollution keys. Careful work.
- **`game/discovery.ts`** — scoping bestiary discovery to the authoritative gameplay view rather than the renderer's padded gutter is exactly the right instinct, and the comment says so explicitly.
- **The victory composition.** 32 authored species signatures, no scale/warp, no random timing, measured no-scroll at five viewports, reduced-motion verified. And the review is *honest* about what's hidden at 568×320 rather than claiming everything fits — that kind of honesty is worth more than the feature.
- **`CatalogueImage`** — DPR-aware rendition selection via `useSyncExternalStore`, no polling, shared observers.
- **The Adventure Book rewrite** — proper ARIA tabs with per-page scroll retention, and it got *shorter* while gaining function.
- **The solver as a design gate**, proving both an ordinary and a perfect-rescue route.
- **`powerGuidance.ts`** — time-sliced, cancellable, engine-replayed witness search with a 4 ms budget and a comment noting absence must lead to Required Path rather than "none exist".
- **The art provenance pipeline** — more rigorous than most studios.
- **`docs/reviews/2026-09-05-ui-inspiration-research.md`** — genuinely good primary-source work, honest about what its evidence supports.
- **The story writing.** *"A sword says 'please' in extremely sparkly handwriting."* Protect this.
- **The core emotional design** — no fail states, no punishment, kind guardians who step aside, optional friends that are never a failure to skip.

---

## Appendix A — Key measurements (current tree)

| Measurement | Value | Source |
|---|---|---|
| Field of view | 6 × 6, square | `exploration.ts:4`, `:77-78` |
| Step duration | 160 ms | `movementControls.ts:9` |
| Scroll rate @ 720p / iPad / 1080p | 750 / 735 / **1 125** px/s | computed |
| Visible fraction of 23×23 | 6.8 % | 36 ÷ 529 |
| Deck width @ 720p / iPad / 1080p | 548 / **480** / 832 px | `layout.ts` |
| Unused board height @ iPad | **128 px** | `shell.css:9` + `layout.ts` |
| Power icon @ iPad | **44 px (at floor)** | `hud.css:13` |
| Utility icon @ iPad and 720p | **30 px (at floor)** | `hud.css:82` |
| Minimap @ iPad | 220 px | `layout.ts` |
| Minimap DOM elements | up to 576 | `MiniMap.tsx:55` |
| Combat celebration | 2 220 ms, flat | `combatPresentation.ts:10` |
| Keyframes | 69 scene + 7 dialogs | grep |
| SFX cues | 26, all synthesised, no master chain | `sound.ts` |
| `App.tsx` | **2 853 lines** (was 2 797) | `wc -l` |
| Total source | 22 600 lines | `wc -l` |
| Runtime assets | ~151 MB (OST 96.9 / PNG 31.4 / WebP 25.6) | `du`, `find` |
| Solver state ceiling | 250 000 | `solver.ts:219` |
| Save schema | v6 (was v5) | `progress.ts` |

## Appendix B — Item index and status

**✅ Done** — CR-PERF-01, CR-UI-04, CR-UI-07 (infrastructure)
**🟡 Partial** — CR-FEEL-03 (symptom patched → see CR-FEEL-06), CR-UI-03, CR-UI-05 (pad done, board drag not), CR-DESIGN-04 (potion only)
**Open** — everything else

**Movement & camera** — CR-FEEL-01 field of view · **01b rectangular window (new)** · 02 dead zone · 03 rAF pump · 04 cruising speed · 05 dark-line seam · **06 rAF timestamp workaround (new)**

**Performance** — CR-PERF-01 ✅ · 02 MiniMap memo · 03 pointermove renders · 04 layout-effect deps · 05 compositor/containment · 06 asset payload · 07 three presentation clocks · 09 quality-tier ladder · 10 terrain bake decision · 11 measurement set

**Juice & life** — CR-JUICE-01 ambient life · 02 anticipation/follow-through · 03 impact language · 04 follower chain · 05 celebration significance · 06 glyph particles · 07 idle and discovery poses

**Audio** — CR-AUDIO-01 master chain · 02 noise/filter/space · 03 the step sound · 04 ascending pickup chains · 05 music ducking · 06 SFX ownership

**UI/UX** — CR-UI-01 numeric contract · 02 container-type + **coefficient calibration (sharpened)** · 03 one obvious action · 04 focus ✅ · 05 touch drag origin · 06 transients out of layout · 07 largest rendition ✅ · 08 diegetic adventure-kit UI · 09 treasure-map minimap · 10 Power as hero · 11 pictorial objective · 12 one-glance test · 13 motion vocabulary · 14 couch/TV scale · 15 first-run and returning · **16 minimumDeck is the wrong lever (new)**

**Visuals & lighting** — CR-ART-01 wall extrusion · 02 animation blur · 03 poison bubbles · 04 art principles · 05 lighting model · 06 per-theme grading · 07 depth cueing · 08 effect hierarchy

**Game design** — CR-DESIGN-01 costed mechanic · 02 braiding · 03 currency sink · 04 subtraction 🟡 · 05 size ladder · 06 interest rhythm · 07 guarded optional battles

**Content** — CR-CONTENT-01 two voices · 02 favourites into mechanics · 03 celebrate the friends

**Risks** — CR-RISK-01 App.tsx · 02 FOV blast radius · 03 solver state space · 04 co-op fixed clock · 05 documentation volume · 06 ratified terrain approach · 07 generated-run persistence · 08 duplicate input systems · 09 sequencing · **10 parallel agents vs hub file (new)**

---

*Every code claim cites a file and line in the tree as of this pass. Please verify anything that would change a decision, and discard anything that lands after this review.*
