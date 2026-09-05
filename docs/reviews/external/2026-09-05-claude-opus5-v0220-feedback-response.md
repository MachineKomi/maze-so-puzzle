# v0.22.0 feedback — diagnosis and proposals

**For:** GPT6 Astra and the specialist agents
**From:** Claude Opus 5, independent read-only review
**Date:** 2026-09-05
**Reviewed:** `main` @ `5f7f8c9` (clean tree, `package.json` 0.22.0), the v0.22.0 playtest transcript, and 53 screenshots across iPad / desktop / mobile
**Companion:** `MAZE-SO-PUZZLE-DETAILED-REVIEW-FOR-ASTRA.md` (v4) — the standing review. This file is scoped to the v0.22.0 feedback only.

---

## How to read this

**These are proposals, not instructions.** I've verified every diagnosis in the shipped source and cited `file:line` so you can check it in minutes. Where I propose a remedy, I've tried to explain *why* it should work so you can pick a different one against the same reasoning. Numbers are hypotheses to tune in play unless labelled **Measured**.

**First, the headline that matters most:** v0.22.0 is a genuine step change. The desktop and iPad layouts in these screenshots are the first version that looks like the game described in the vision document — the deck composition, the icon scale, the Adventure Book, the story cards, the focus treatment, the fonts. Whatever process produced this round, it worked.

**And the finding that should probably reshape the next slice:** every performance defect flagged in the previous review is still present in the shipped build, and I now believe I can explain all four of the Human's performance symptoms — including the two that look mysterious ("worse over a session", "turning quality down doesn't help"). Details in §1. It is not a device-age problem.

---

## Contents

| § | Topic | Human's priority |
|---|---|---|
| 1 | Performance — the whole story | **#1 issue** |
| 2 | Mobile layout: "same layout, smaller elements" | **#2 issue** |
| 3 | Controls: held-input interruption, text selection, pad look | High |
| 4 | Bestiary empty state | Medium |
| 5 | Victory screen — why it still reads flat | Medium |
| 6 | Verified bugs (small, concrete) | Mixed |
| 7 | Polish items | Low |
| 8 | Suggested slice shape and sequencing | — |

---

## 1. Performance

The Human's report, condensed:

> iPad struggles on larger mazes, movement gets stuttery; **it gets worse the longer you play**; a newer Samsung phone is fine; **desktop also has slight issues on a reasonable laptop**; *"if I do surface quality lite and then movement reduced… doesn't really make it feel buttery smooth"*; *"surely this game could run on pretty much any consumer device from the last five years."*

The last sentence is the right instinct and I think it's achievable. The game is not doing a lot of *logic* — but it is doing a great deal of *compositing*, and almost none of it is currently avoidable.

### 1.1 — The cost model (Verified / Measured)

Everything below is per-frame or per-render cost during ordinary movement.

| # | Cost | Evidence | Scales with |
|---|---|---|---|
| 1 | **Terrain SVG re-rasterised at up to ~7.6 MP**, carrying 2 Gaussian blurs + 1 morphology filter + 3 masks + 4 raster pattern fills | `MazeTerrain.tsx:52-55, 112-126`; surface = board × (level.width ÷ camera.width), so 23-wide maze on a 706 px board ≈ 2 706² px | **maze size²** |
| 2 | **Minimap reconciles one `<i>` per tile — up to 576 elements — on every App render**, because both its memo props are freshly allocated | `App.tsx:2539-2540`; `MiniMap.tsx:55` | **maze size²** |
| 3 | **Every `pointermove` triggers a full App render**, hence #2, at up to 120 Hz while a finger is down | `App.tsx:1696` (`setTouchCursor` before the direction-changed early-exit at `:1660`) | pointer rate |
| 4 | **Every maze object sprite carries `filter: drop-shadow(...)`** — `.maze-object`, `.object-portal`, `.object-treasure`, `.animal-sprite`, `.pet-follower > img`, `.pet-follower-image`, and more. **47 `drop-shadow` uses across the stylesheets** | `scene.css:47, 112, 176, 507, 625, 1063, …` | **object count** |
| 5 | **46 `infinite` animations.** Many run on the same elements as #4 — a filtered element that is also animating must be re-rasterised, not just re-composited | `scene.css` (`item-shine`, `goblin-bob`, `portal-pad-breathe`, `pet-follower-bob`, 6 friend-motion + 7 enemy-motion loops) | **object count** |
| 6 | **`backdrop-filter: blur(2px)` on the touch-joystick origin marker** — live *during* touch movement, which is exactly when frames matter most | `scene.css:580` | touch only |
| 7 | **No compositor promotion or containment anywhere.** Zero `will-change`, zero `contain`, zero `content-visibility` (only three `will-change: auto` *resets*) | grep across `src/ui/styles/*.css` | always |
| 8 | `useSceneTravel`'s layout effect has no dependency array, so every render does `querySelectorAll` + three `querySelector`s | `useSceneTravel.ts:100` | render rate |

### 1.2 — This explains all four symptoms

**"Worse on larger mazes."** Costs #1 and #2 both scale with maze area, and #4/#5 scale with object count. A 23×23 maze has ~4× the terrain surface and ~4× the minimap nodes of an 11×11.

**"iPad bad, newer Samsung fine."** Costs #4, #5 and #6 are GPU fill-rate and filter-throughput bound. That is precisely the axis on which an older iPad differs most from a current flagship phone — not CPU, not RAM. It also explains why a mid-range laptop shows *slight* issues: it has the CPU but modest integrated graphics.

**"Gets worse the longer you play."** This is the one that looks like a leak but probably isn't. Two compounding effects, both mechanical:
- **Rescued friends accumulate.** Each follower is a sprite with a `drop-shadow` filter *and* a per-species infinite motion animation (`scene.css:625`, `pet-follower-bob`, `friend-motion-*`). Going from 0 to 5 rescued friends adds five continuously-animating filtered elements to every frame, permanently, for the rest of the maze.
- **Later mazes are larger**, so #1/#2 grow as the campaign progresses.

That said, I could not rule out a genuine accumulation, and it is worth one explicit check: **play three mazes without reloading and compare `performance.memory` / DOM node count / active `AudioContext` voice count against a fresh load of maze three.** If the numbers differ materially, there is a leak on top of the mechanical explanation. If they match, the two effects above are the whole story.

**"Lite quality and reduced motion didn't help."** *(This is the finding I'd most want checked, because if I'm right it's a quick and very visible win.)*

**Verified:** `grep -c 'data-quality="lite"' src/ui/styles/scene.css` returns **0**. Across the entire stylesheet set, `lite` appears exactly twice:

```
comfort.css:7   :root[data-quality="lite"] { --surface-depth: …; --button-depth: …; }   /* two shadow tokens */
dialogs.css:161 :root[data-quality="lite"] .modal-backdrop { backdrop-filter: none; }   /* modal only */
```

**"Surface quality: Lite" does nothing whatsoever to the maze scene.** It simplifies two shadow tokens and removes a modal backdrop blur. Meanwhile `static` — the strongest setting — only disables *animations*; it leaves all 47 drop-shadow filters and the filtered terrain SVG fully active. So the Human turned the performance escape hatch on, got no relief, and reported exactly that. The setting is currently close to cosmetic.

### 1.3 — Proposals

Grouped by effort. My rough confidence on impact is given, but the honest position is that these need measuring rather than believing.

#### Tier 1 — Hours of work, no visual change at all

| Fix | Change | Expected |
|---|---|---|
| **Memoise the two `MiniMap` props** (`App.tsx:2539-2540`) | 2 lines | Removes up to 576 element reconciliations per render. Large on big mazes |
| **Move `touchCursor` out of React state** into a ref + CSS custom properties, written in the existing rAF | ~20 lines | Removes the per-pointer-event render storm. Should be the single biggest touch-device win |
| **`will-change: transform; contain: paint;` on `.camera-world`**, toggled by the existing `data-travel-state` so the layer is not permanently promoted | ~4 lines CSS | Likely moves world scrolling from main-thread repaint to compositor |
| **`contain: strict` or `content-visibility: auto` on the minimap card** | 1 line | Isolates minimap invalidation from the rest of the deck |
| **Split `useSceneTravel`'s layout effect** — cheap retarget path vs. binding path keyed on `[board, runKey]` | ~15 lines | Removes 4 DOM queries per render |
| **Drop the `backdrop-filter` on the touch-joystick marker** (`scene.css:580`), or gate it behind Full quality | 1 line | Removes a live blur pass during touch movement |

I'd do these six first and re-test on the iPad before anything else, because they change nothing visually and they change the baseline every later judgement is made against.

#### Tier 2 — Make the quality tiers actually do something

This is the fix that most directly answers the Human's complaint, and it is mostly CSS.

**Proposal — define what each tier costs, then implement it.** A starting shape:

| | **Full** | **Lite** | **Static** |
|---|---|---|---|
| Object `drop-shadow` | as now | **replaced by a baked shadow in the sprite art, or a cheap `::after` ellipse** | none |
| Terrain SVG filters (blur, morphology) | as now | **off** — flat hazard edges | off |
| Wall depth blur | as now | **replaced by a hard offset fill** | flat |
| Infinite object animations | all | **only within ~2 tiles of Ame** | none |
| Follower motion loops | all | first 2 followers only | none |
| Backdrop blur | modals only | none | none |
| Confetti / particles | full | ~40 % | none |

Two things worth saying about this:

1. **The `drop-shadow` row is the important one.** A per-sprite drop-shadow is a full-element blur pass; when the element is also animating, it re-rasterises every frame. The cheapest replacement that preserves the look almost exactly is a **pre-baked soft shadow in the sprite PNG/WebP itself** — zero runtime cost, and the art pipeline is already capable of it. Failing that, a static elliptical `::after` under each sprite reads nearly identically at gameplay scale and costs nothing.

2. **"Only animate near Ame"** is a very cheap, very effective rule. At FOV 6 almost everything on screen is near her, but as the field of view grows (see §2.4) this becomes a large saving. It also arguably looks *better* — the world waking up as you approach is the ambient-life idea from the standing review, and it turns a performance measure into a charm feature.

#### Tier 3 — The structural decision

**Bake the terrain once per level** instead of keeping a live filtered SVG in the scroll path.

Terrain is static for a level's entire life. Rendering it once into an `OffscreenCanvas` / `ImageBitmap` at level load and translating that single bitmap would:
- make terrain cost **independent of maze size** — killing the "worse on larger mazes" symptom at the root;
- make all of the wall-depth and lighting work in Plan 04 **free at runtime**, because it bakes;
- eliminate the sub-pixel seam bug (PT-33);
- move animated hazards to a thin separate overlay, which is separately budgetable and arguably cleaner.

Cost: a level-load hit, probably 20–80 ms, which can hide behind the story card.

**This decision should be made before Plan 04 starts.** Plan 04's purpose is adding expensive-looking lighting to a surface that is already the most expensive thing on screen. If terrain bakes, Plan 04 can be ambitious. If it stays live, every effect Plan 04 adds is a permanent per-frame tax on the device that is already struggling. Deciding after Plan 04 means redoing Plan 04.

**One caveat I can't resolve from the code:** if Plan 04 intends *dynamic* lighting — a moving light source, or light that responds to Ame's position — baking is the wrong choice and you should know that now rather than later.

#### What to measure

The Human's symptoms are all about *consistency*, not average frame rate, so averages will hide them:

| Metric | Catches | Suggested target |
|---|---|---|
| Long tasks > 50 ms during a 40-step traverse | #1, #2 | 0 |
| Renders per second during a pointer drag | #3 | < 5 |
| Per-step duration σ across 40 held steps | the "stuttery" report | < 8 ms |
| Frames where `.camera-world` repaints | #7 | ~0 while travelling |
| Same three-maze session vs. fresh load: DOM nodes, JS heap, active audio voices | the "gets worse" report | flat |

Ideally captured on the actual iPad, since that is where the complaint lives and it is the device the current evidence set does not cover.

---

## 2. Mobile layout — "same layout, smaller elements"

The Human's request is unusually precise and, I think, exactly right:

> *"I would still much prefer that everything was just smaller on a mobile phone and that the UI was the same on a mobile phone as it was on an iPad or on a desktop… I would prefer that the icons were just smaller versus having everything move around and have to scroll."*

### 2.1 — Root cause: everything responsive keys on width; the binding constraint on a landscape phone is height

**Measured.** The mobile screenshots are 2340 × 936 device pixels. At a typical Samsung landscape DPR that is roughly **780 × 312 CSS px**.

Now look at what the code does with that:

**The play layout** (`layout.ts`):
```
compact      = h < 600 || w < 800        →  true (h = 312)
emergency    = w < 650                   →  false (w = 780)
minimumDeck  = 440                       (compact branch)
board        = min(312, 780 − 440 − 8)   = 312
deck         = 780 − 312 − 8             = 460
```
**The deck (460 px) is larger than the maze board (312 px).** The `mobile-maze01.jpg` screenshot confirms it exactly — the board occupies ~27 % of the screen width while the deck plus thumb pad take ~72 %. For a game whose entire subject is the maze, that is the wrong allocation, and it is why everything else feels cramped.

**The Adventure Book** (`book.css:125-128`) is worse, because it responds *only* to width via four breakpoints (1500 / 1280 / 900 / 700 px) that change column counts. At 780 px wide it takes the "small tablet" branch — 3 columns, tablet-sized cards, tablet-sized type — and then renders that into a **312 px tall** viewport. Hence `mobile-beastiary.jpg`: three enormous cards, one row visible, the page heading and the "0/12 met" counter scrolled entirely out of view, and the Achievements tab label wrapping to "Achieveme / nts".

**The HUD deck** still declares `container: adventure-deck / inline-size` (`hud.css:2`), so container queries **cannot see height at all**. Every `cqw` clamp resolves against a 460 px width and produces iPad-sized elements in a viewport a third of an iPad's height.

So one root cause — **width-only responsive reasoning** — produces both the good desktop result *and* the bad mobile result. Desktop got better this round largely because `minimumDeck` was raised to 480–520, which widened the deck and pushed the `cqw` clamps into a useful range. That worked on wide screens and backfired on short ones.

### 2.2 — Proposal: one scale factor instead of breakpoints

This is what "same layout, smaller elements" means mechanically.

**Derive a single `--ui-scale` from the smaller constraint, and express every size in terms of it.**

```css
/* set once on the play shell / book root, from measured viewport or via cqmin */
--ui-scale: clamp(0.55, min(100cqw / 1280, 100cqh / 800), 1.6);
```

Then sizes become `calc(96px * var(--ui-scale))` rather than `clamp(44px, 9cqw, 80px)`. Consequences:

| Device | Approx. scale | Result |
|---|---|---|
| Landscape phone 780 × 312 | ~0.55 | Same layout, everything 55 % size — exactly what was asked for |
| iPad 1194 × 834 | ~0.93 | Very close to today's good result |
| Desktop 1280 × 720 | ~0.90 | Close to today |
| TV 1920 × 1080 | ~1.35 | Scales *up* for couch distance (currently capped by the clamp maxima) |

Three supporting changes:
1. **`container-type: size`** on `.adventure-hud` so height participates at all.
2. **Retire the Book's four width breakpoints** in favour of the same scale factor plus one or two genuine layout changes (column count) driven by `cqmin`, not raw width.
3. **Keep a floor** (~0.5) below which the game switches to the existing emergency composition, so there is still a defined behaviour for very small screens.

The appeal of this approach is that it is *fewer* rules than today, not more — one variable replaces a large set of breakpoints and clamps, and it makes the Human's stated preference the default behaviour rather than something to be engineered per screen.

### 2.3 — Rebalance board vs deck on short viewports

Independently of scaling, the 460/312 split needs reversing. A proposal:

```
deckShare  = clamp(0.34, 480 / w, 0.42)      // deck is a share of width, floor-and-ceiling bounded
deck       = w * deckShare
board      = w - deck - gap                   // board takes the rest, no longer forced square (see 2.4)
```

At 780 × 312 that gives deck ≈ 328, board ≈ 444 — the maze becomes the largest thing on screen, which is what it should be.

### 2.4 — Let the camera window be rectangular

**Verified.** `getCameraWindow` applies a single `fovSize` to both axes (`exploration.ts:77-78`), which forces `.maze-board { aspect-ratio: 1 }` (`shell.css:9`).

**Measured cost on iPad:** board is 706 × 706 inside an 834 px column — **128 px of vertical space beside the maze is structurally unusable.** On a landscape phone the square board is what caps the maze at 312 px wide when 444 px of width is available.

Letting `getCameraWindow` take independent `fovWidth` / `fovHeight` derived from the board's actual aspect would recover that space on every device, show more maze, and let the board fill its rectangle. `travelCamera` (`tileTravel.ts:77-78`) and the minimap camera frame (`MiniMap.tsx:79-82`) already treat the axes independently, so the change is contained — `getVisibleTileKeys` / `revealVisibleTiles` would need the same two-axis treatment.

**One thing to decide deliberately:** a rectangular reveal changes the fog-of-war shape for existing saves. It only ever reveals *more*, never less, so it should be forward-compatible — but it deserves an explicit decision rather than being discovered later.

### 2.5 — What "collapsing is fine" means

The Human explicitly accepted collapsible secondary content on mobile — *"as long as that's present and looks good, which has a little bit of jank to it, that's better."* Combined with the above, a reasonable mobile hierarchy would be:

- **Always visible:** maze, Power, objective, minimap, thumb pad, feedback line.
- **Collapsed behind "More":** Friends and Bag detail, utility buttons, chapter metadata.
- **Never:** rearranged into a different composition, or scrolled to reach a core control.

That preserves "same layout, smaller" while acknowledging that a 312 px tall viewport genuinely cannot show everything at once.

---

## 3. Controls

### 3.1 — Held input dies on every interruption (Verified — this is the one I'd fix first)

> *"as soon as my character's movement is interrupted, because I open a door or I have a fight… I have to stop touching the screen, let go, and then touch it again."*

**Cause found.** `clearHeldInput()` is called at **17 sites** in `App.tsx`, including every interruption path — too-strong encounter (`:1415`), rescue (`:1429`), and others at `:1378, :1451, :1454`. Its implementation (`App.tsx`, `const clearHeldInput`) does:

```js
heldKeys.current.clear();  heldKeyOrder.current = [];  queuedMove.current = null;
heldKeyCadence.current = IDLE_HELD_MOVE_CADENCE;  lastMovedDirection.current = null;
clearTimeout(heldKeyTimer.current);
clearDpadHold();          // ← drops pad gesture state
clearBoardPointer();      // ← drops pointer capture state
```

The intent is documented and legitimate: *"Every safe collision requires a fresh deliberate press. Otherwise one held input floods the live region and bump audio at accelerated cadence."* The problem is that the remedy discards the **physical input state** (finger still down, at a known position) along with the **repeat schedule**.

**Proposal — separate "stop repeating" from "forget the finger".**

Split into two functions:
- `suspendHeldRepeat()` — cancels timers, clears the queued move and cadence, sets a `repeatSuspended` flag. Does **not** touch pointer capture or gesture state.
- `clearHeldInput()` — the current behaviour, retained only for genuine boundaries: level load, modal open, visibility change, blur, restart.

Then at interruption sites call `suspendHeldRepeat()`, and when the interruption resolves, **re-derive the direction from the live pointer position** (which `ActiveBoardPointer` / the thumb-pad gesture ref still hold) and resume the cadence from a fresh first-step delay.

This preserves the anti-flood intent exactly — no accelerated repeat through a blocked encounter, one deliberate press per *safe collision* — while making a held finger continue to work. It also fixes the same problem for held keyboard input, which has it too.

**One design question worth deciding explicitly:** should a still-held input resume automatically after a *blocked* interaction (too-strong enemy, locked door with no key)? Auto-resuming would re-bump immediately, which is the flood the comment is guarding against. My suggestion: **resume automatically after successful interactions** (door opened, enemy defeated, friend rescued, portal used) and **require a re-press only after a genuine block**. That matches the Human's description — they are complaining about doors and fights, which are successes.

### 3.2 — Accidental text selection (Verified)

> *"you can be trying to use the touch controls and then accidentally select a bunch of text on screen."*

`user-select: none` appears in exactly **two** places: `.maze-board` (`shell.css:9`) and `.thumb-pad` (`hud.css:85`). Everything else — the deck, headings, labels, dialog text, Book content — is selectable, so any drag that begins on or crosses the deck starts a selection.

**Proposal.** Apply `user-select: none` broadly at the shell level and re-enable it only where selecting text is actually useful:

```css
.play-shell, .achievements-screen, .book-page { user-select: none; -webkit-user-select: none; }
.story-body, .lore-card p, .sr-only, [data-selectable] { user-select: text; }
```

Also worth adding `-webkit-touch-callout: none` on the board and pad to suppress the iOS long-press callout, and `-webkit-tap-highlight-color: transparent` to remove the grey flash on tap.

### 3.3 — Thumb pad appearance

> *"more subtle arrows, like maybe bigger, dark, little purple or black arrows, like outline arrows, without the boxes in that pad… like a greater-than sign… an arrow that doesn't have a bottom drawn for it."*

**Verified.** `.thumb-pad button` (`hud.css:86`) currently carries a gradient background, a border, a border-radius and a box-shadow, with a Unicode glyph (`▲ ◀ ▶ ▼`, `ThumbPad.tsx:4`) at `1.2rem`.

**Proposal.** Strip the button chrome and draw chevrons directly on the pad:

```css
.thumb-pad button { background: none; border: none; box-shadow: none; color: #4c2d5d99; }
```
…with the glyph replaced by an **inline SVG chevron** (two strokes meeting at a point, `stroke-linecap: round`, `stroke-width` ~3, no fill), sized ~40 % larger than the current glyph.

Two reasons to prefer SVG over the Unicode arrows here beyond the visual request: the current `▲ ◀ ▶ ▼` glyphs resolve through the font stack and may render differently on iPadOS vs Windows vs Android, and an SVG chevron can carry the "no bottom drawn" open-arrow shape the Human described, which no standard Unicode arrow does.

Keep the pressed and `suggested-move` states as a **fill/opacity change on the chevron plus a soft radial glow behind it**, rather than a solid button background — that preserves the feedback while losing the boxes.

Hit targets should stay at full sector size regardless of how small the chevron looks; the visual and the target are separate concerns.

---

## 4. Bestiary empty state

> *"it just looks a bit rubbish with all of the question marks and the repeating text… I'd prefer that when the bestiary is empty it just has a little fun message… and then as you encounter new enemies, they get added in their natural ID order… maybe with a counter saying you've seen two out of a total."*

**Confirmed in `desktop-adventurebook-beastiary.jpg`:** twelve identical cards reading "A guardian to meet / A new story is waiting somewhere in the Puzzlewild. / Not met yet". The repetition of the *sentence* is what makes it feel cheap — twelve question marks alone would read as deliberate mystery; twelve identical paragraphs read as a placeholder that was never finished.

**Proposal — three states, closely following what was asked for:**

1. **Empty (0 discovered).** No grid. A single friendly panel: Poggle's field-note voice, one enemy **silhouette** as art, and a line like *"No guardians met yet. Go and say hello to one!"* Plus the counter at `0 / 12`.
2. **Partial.** Show **only discovered entries**, sorted by their natural catalogue ID order (not encounter order), with the `n / 12 met` counter carried through. `game/discovery.ts` and the `discoveredEnemyIds` field added in schema v6 already provide exactly this data, and the enemy order is fixed by `ENEMY_STYLE_IDS` in `types.ts`.
3. **Complete.** A small "all met" flourish — this is a collection, and completing it should be acknowledged.

**One judgement call to make:** hiding undiscovered entries removes the visible sense of *how much is left*. The counter carries that information, but a grid of twelve does it more viscerally. A middle option worth considering: show discovered entries as cards, then a **single** summary tile reading *"7 more guardians to meet"* — one tile, not seven placeholders. That keeps the completionist pull without the repetition.

The same treatment probably suits the Friends tab, which has 32 entries and will look far worse than the Bestiary when mostly empty.

---

## 5. Victory screen

> *"still doesn't quite feel as exciting and good and rewarding as I feel like it should… the friend sprites are still smaller than they need to be… at least you got one little go of the confetti, but I mean surely."*

The composition work here is genuinely good — 32 authored species signatures, no scrolling at five viewports, honest reduced-motion handling. So the remaining problem is not craft; I think it is **structure**.

### 5.1 — Why it reads flat

Looking at `desktop-victory.jpg`: the dialog is a **vertical stack of five rectangular bands of near-equal visual weight** — heading, friend, perfect-rescue notice, chapter story, reward. Same width, similar height, similar corner radius, similar background treatment. The eye has no reason to go anywhere in particular.

Three specific consequences:
- **The rescued friend** — the emotional payload — sits small and centred in a wide band with large empty margins either side.
- **The reward** (`+19 gold stars`) is at the **bottom**, in the least prominent position on the card.
- **Nothing is sequenced.** Everything arrives at once, so nothing feels earned.

It reads as a **receipt**: an itemised list of what happened. Which is accurate, and not celebratory.

### 5.2 — Proposals

**(a) Give it a hero.** One subject, large, at the top: the rescued friend (or friends), at 2–3× current size, doing their dance. Everything else becomes subordinate — smaller, lighter, arranged around it. The Human asked for bigger sprites twice, on two devices; I'd take that literally.

**(b) Sequence the reveal.** Rather than showing the whole card at once, stage it over ~1.2 s: heading → friends arrive and dance → confetti burst → reward **counts up** → actions become available. Staging costs nothing but timing and it is most of what makes a level-clear feel like an event. `combatPresentation.ts` is already the perfect model for expressing this as sampled timing data rather than nested timers.

**(c) Make the number the event.** `+19 gold stars` should count up from zero with the gold sparkle treatment, and land with a sound. A number that ticks up is intrinsically satisfying and it is also the arithmetic moment — this is a maths game, and the reward screen currently states a total rather than performing it.

**(d) Confetti that doesn't just stop.** The Human noticed it falls once. Options in ascending cost: extend to two or three staggered bursts; or run a gentle continuous drift at low density after the initial burst, ending when the dialog closes. Either is cheap; the current single burst reads as an animation that failed rather than a celebration that finished.

**(e) Break the band rhythm.** Vary the weight and shape: the chapter story could be a smaller, quieter caption rather than a full panel of equal weight to the reward. Not everything on a celebration screen needs a box.

**(f) Scale the celebration to the achievement.** A perfect rescue, a first completion, or a personal-best step count deserve visibly more than an ordinary repeat clear. The data is all in `completion.reward.goldBreakdown` already. This also stops the screen feeling identical every time, which is part of why it fades.

---

## 6. Verified bugs

Each of these I traced to a specific line.

### 6.1 — Too-strong pop-up appears only once per enemy per run

**Verified.** `App.tsx:1416`:
```js
const priorBumps = strongEnemyBumps.current.get(tooStrongEvent.objectId) ?? 0;
strongEnemyBumps.current.set(tooStrongEvent.objectId, priorBumps + 1);
…
if (enemy && priorBumps === 0) { setTooStrongEncounter(...); }   // modal only on the very first bump
else if (enemy) { setFeedback({...}); }                          // thereafter, a one-line notice
```

The Human's reasoning is sound — a child returning to the same guardian is *deliberately* retrying, usually because they have not yet understood the rule, which is exactly when the explanation is most useful.

**Proposal.** Show the modal whenever the player is **still under-powered and the state has changed since they last saw it** — i.e. re-arm the counter when Power increases, or simply when the player leaves and returns to that tile. A pure "always show" is also defensible; the only risk is a held input re-triggering it repeatedly, and §3.1's `suspendHeldRepeat` already handles that. I'd lean to **always show on a fresh deliberate bump**, since it is the simplest rule to explain and the Human explicitly asked for it.

Worth checking the same pattern for locked doors and hazards — the Human said *"I think that's the same for other things as well."*

### 6.2 — Clearing the final maze returns to maze 1

**Verified — a genuine label/action mismatch.**
```js
App.tsx:2120   : campaignIndex + 1 < CURATED_LEVELS.length ? "Next maze" : "Surprise maze"   // label
App.tsx:2065   const nextIndex = campaignIndex >= 0 ? (campaignIndex + 1) % CURATED_LEVELS.length : 0;  // action
```
The button correctly *says* "Surprise maze" after the final chapter, but the modulo wraps `nextIndex` to `0` — the first campaign maze. So this is not a picker artefact; it reproduces whenever the last chapter is completed.

**Proposal.** When `campaignIndex + 1 >= CURATED_LEVELS.length`, branch to the surprise-maze generator rather than wrapping the index. Worth also confirming what should happen to `campaignIndex` at that point so Continue and the chapter label stay truthful.

### 6.3 — Surprise maze size no longer shown

> *"I liked seeing that it was a six by six, or a ten by ten, or a twenty-four by twenty-four surprise map. That was just useful information."*

`surpriseSettings()` (`App.tsx:563`) computes the size and difficulty, but I could not find it surfaced anywhere in the current UI.

**Proposal.** Show it in two places: on the surprise-maze launch affordance *before* generating (so it sets expectations), and in the in-maze chapter line where story mazes show "Story maze 4 of 16" — e.g. **"Surprise maze · 13 × 13"**. Cheap, and it restores information the Human valued. If the difficulty selector from PT-42 lands later, this is where it belongs too.

### 6.4 — Pickup toast is too small on desktop and huge on mobile

**Verified.** `.map-pickup-toast > img` is `clamp(46px, 5.2cqw, 76px)` and `.notice-anchored` font is `clamp(24px, 3.8cqw, 52px)` (`scene.css:1329, 1341`), where `cqw` resolves against **`.maze-board`** (`container: maze-board / size`, `shell.css:9`).

| Device | Board | Toast image | **As % of board** |
|---|---|---|---|
| Desktop | ~980 px | 51 px | **5 %** |
| Mobile | ~312 px | 46 px (at floor) | **15 %** |

So it is three times more prominent on mobile — which is exactly the Human's report, in both directions at once. The floor dominates on small boards and the coefficient is too small on large ones.

**Proposal.** Size the toast relative to **tile size** rather than board size. It is an in-world notice attached to a tile, so ~1.5 tiles tall is the natural unit and it stays proportionally identical on every device. Tile size is already derivable (`board ÷ camera.width`) and could be published as a CSS custom property from the travel pump, which would also serve several other in-world overlays.

The Human said the mobile scale "looks good" — so tuning the constant so that *desktop matches mobile's current proportion* is probably the right target, not the average.

---

## 7. Polish items

Smaller things from the transcript, with what I'd suggest.

| Item | Human's note | Proposal |
|---|---|---|
| **Book header icons** | Mute and Settings icons "weirdly super small" inside their circles | Confirmed in `desktop-adventurebook-beastiary.jpg`. The two icon-only circular buttons use a much smaller glyph than the labelled buttons beside them. Size the icon to the button, not to the label row |
| **Book tabs** | "the line-breaking… inside of where the tab is"; tabs "could look and feel better" | Two separate things: (a) the active tab's seam against the panel reads as a notch rather than a join; (b) on mobile "Achievements" wraps to "Achieveme / nts" (`mobile-beastiary.jpg`). Fix (b) with the §2.2 scale approach plus `text-wrap: balance` or a shorter mobile label; fix (a) by extending the active tab's background 1–2 px into the panel and removing its bottom border |
| **Lore cards** | "swipe through them… previous and next arrows on either side" | Add prev/next within the current filtered, ordered list, with keyboard arrows and touch swipe. Worth doing alongside §4, since the ordering rule is the same |
| **Hover / focus state** | Dark border "much better" but "is a dark border really the best practice?" | Agreed. A dark outline reads as a *boundary*, not an *invitation*. Suggest: a soft warm glow plus a 2–3 px lift and a ~2 % scale on hover, and a distinct plum/gold ring only for `:focus-visible` (keyboard/gamepad). This keeps the accessibility signal while making pointer hover feel tactile. `--button-depth` already exists to build the lift from |
| **Title screen buttons** | "could be even juicier and yummier" | The lift-and-glow vocabulary above, plus a press-down state that actually compresses the shadow. Most of the "juice" in a button is in the *press*, which currently has less treatment than the hover |
| **Mazes tab** | Locked-door icon small; Play / Resume / "6 steps best" could be bigger | Falls out of §2.2 scaling; worth an explicit pass on that card's internal hierarchy at the same time |
| **Friends tab** | Friend sprites could be larger | Same |
| **Message box (iPad)** | Text and icons "could be a little bit bigger" | Same — and note the box currently sits empty most of the time (visible in `desktop-maze-large.jpg`). Consider a resting state: the current objective in miniature, or the last event, so the reserved space is never dead |
| **Stats screen** | "a lot of wasted space… but also looks pretty good" | Low priority. If touched, the `fr`-row approach from the standing review applies |
| **Friend sprite style** | Earlier art-consistency feedback "still stands, not critical" | Already tracked as PT-39 |

---

## 8. Suggested slice shape

Offered as a proposal — the ordering reflects (a) what the Human ranked highest, (b) what unblocks later work, and (c) what changes the baseline other judgements are made against.

### Slice 1 — Performance, no visual change *(recommended first, on its own)*
§1.3 Tier 1 (six items) + §3.2 text selection. Nothing looks different; everything should feel different. **Measure on the actual iPad before and after**, using the metrics in §1.3 — this is the one slice where the evidence must come from the complaining device.

### Slice 2 — Controls and quality tiers
§3.1 held-input suspension, §3.3 thumb pad chevrons, §1.3 Tier 2 (make Lite and Static actually reduce cost). These are independent of layout and directly address two of the three loudest complaints.

### Slice 3 — Responsive scale
§2.2 `--ui-scale`, §2.3 board/deck rebalance, §2.4 rectangular camera, and the Book breakpoint retirement. This is the largest of the three and touches the most surface, so it benefits from Slices 1–2 landing first. **The rectangular camera and the FOV question should be decided together**, since they change the same function and share a documentation blast radius (Plan 01 diagrams, Plan 03's art-review scale, Plan 04's analysis, and `exploration.test.ts:25` all encode "6 × 6").

### Slice 4 — Content and celebration
§4 Bestiary states, §5 victory composition, §6.3 surprise size, §7 lore-card navigation, Book tab polish.

### Anytime — the small verified bugs
§6.1 too-strong pop-up, §6.2 campaign wrap, §6.4 toast scaling. Each is contained and could ride along with any slice.

### Decision needed before Plan 04
§1.3 Tier 3 — bake terrain or keep live SVG. This is the one that gets more expensive to answer the longer it waits.

---

## Appendix — verification index

Every claim in this document, with where to check it.

| Claim | Location |
|---|---|
| Lite quality does nothing to the scene | `grep -c 'data-quality="lite"' src/ui/styles/scene.css` → 0; only `comfort.css:7`, `dialogs.css:161` |
| 47 drop-shadow uses, 46 infinite animations | `grep -o "drop-shadow\|infinite" src/ui/styles/*.css` |
| Every object sprite is filtered | `scene.css:47, 112, 176, 507, 625, 1063` |
| Backdrop blur during touch movement | `scene.css:580` |
| MiniMap memo defeated | `App.tsx:2539-2540` |
| pointermove re-renders App | `App.tsx:1696` vs early-exit at `:1660` |
| No will-change / contain | `grep -rn "will-change\|contain:" src/ui/styles/*.css` |
| Deck wider than board on phone | `layout.ts` with w=780, h=312 |
| Deck container is inline-size | `hud.css:2` |
| Book responds only to width | `book.css:125-128` |
| Camera window is square | `exploration.ts:77-78`; `shell.css:9` |
| 128 px unused height on iPad | `layout.ts` with w=1194, h=834 |
| clearHeldInput drops pointer state | `App.tsx`, `const clearHeldInput`, 17 call sites |
| user-select only on 2 elements | `shell.css:9`, `hud.css:85` |
| Too-strong shows once | `App.tsx:1416` |
| Campaign wraps to maze 1 | `App.tsx:2065` vs label at `:2120` |
| Toast scales off board, not tile | `scene.css:1329, 1341`; `shell.css:9` |
| Thumb pad uses Unicode glyphs in styled buttons | `ThumbPad.tsx:4`, `hud.css:86` |

---

*Read-only review. No repository files were modified. Please discard anything that lands after `5f7f8c9`.*
