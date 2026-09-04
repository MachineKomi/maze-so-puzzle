# UI/UX and Layout Overhaul Plan

## 0. Manager-reviewed execution addendum

This addendum is execution authority and supersedes any conflicting recommendation below. The original status and baseline text describe the research pass; a later manager execution prompt authorizes implementation within this scope.

Read `docs/GAME_VISION_AND_DESIGN_SPEC.md` and `docs/plans/00-integrated-implementation-roadmap.md` first, then re-read this plan in full and inspect current `HEAD`. Execution is gated on completed Plan 07A instrumentation, Plan 06 semantic/gameplay foundations, Plan 03 art/catalogue/safe-bound contracts, and root checkpoint 03M's green compatibility/gameplay-contract baseline.

### Adopted product amendments

- Preserve one recognisable landscape composition across TV, desktop, 960×540 Tauri, and iPad/tablet: square maze on the left, persistent information/control deck on the right, and the same section/action order everywhere. Track sizes may adapt, but primary-device controls must not jump between a special rail and deck or disappear into `More`.
- Retain the plan's accessible real-CSS-pixel architecture, square maze, stable DOM order, content-driven sizing, and removal of the historical override cascade. “Near-identical” does not mean scaling a broken fixed HUD; it means stable topology and behaviour with responsive dimensions.
- Permit one constrained compact-phone fallback. It may use `More`, tighter cells, and smaller art, but it retains every essential action and the same logical order. A larger-device recommendation is acceptable; functional loss is not.
- Re-run the geometry study. The original five-regime relocation model and its exact table are not implementation authority where they conflict with this addendum.
- Make the minimap the largest feasible square after the full Objective and complete state indicators are guaranteed. Starting targets are at least 192px at 1280×720/ordinary TV, 160–176px at 960×540 and normal iPad/tablet, 120–144px on ordinary landscape phones, and 96px only at 568×320. The original 160px ceiling and 152px-wide inconsistency are superseded.
- Keep all one-to-seven Adventure Bag slots and one-to-five friend states simultaneously visible and contained. Never solve density by clipping, horizontal scrolling, silent omission, or hover-only detail.
- Eliminate accidental negative space around the minimap and maze. Big Maze uses all remaining width for a larger board or purposeful focus deck; it never reserves a hidden sidebar track.
- Add 1920×1080 TV/couch and 1194×834 iPad coverage. Verify TV-safe margins, couch-readable focus/labels/controller glyphs, and consistent logical focus order.
- Supply per-slot VFX anchors such as `bag:<semantic-slot-id>` plus a generic Bag fallback, not one fixed Bag coordinate.
- Resolve every enemy, friend, item, weapon, cage, portal and environment label/
  image through the final semantic catalogue. Do not freeze Plan-01 components
  to the pre-Plan-03 roster with exhaustive UI switches or asset filenames;
  unknown/dormant identities receive an explicit accessible fallback. The
  five-friend HUD limit is the current per-maze display maximum, not the size of the
  collectable species roster.
- Drive the Bag from the typed level/equipment registry. It must fit all current
  one-to-seven persistent slots and pass a synthetic larger-roster wrap fixture
  so a later approved traversal capability does not require another UI
  architecture. This is presentation headroom, not authorization to add rules.
- Provide one shared catalogue-image primitive that selects an approved optical
  rendition from semantic role, rendered size and DPR while respecting visible
  bounds, safe inset, face box, pivot and aspect metadata. Add a test-only
  integration rack for every UI-consumed family, longest labels, fallback and
  smallest declared delivery size; it must not make production preload the
  complete catalogue.
- Keep the MazeViewport host capable of rendering Plan-04 named visual-region
  layers in one world transform. The minimap remains topology-first and does not
  reproduce detailed floor/wall textures merely because a level has multiple
  regions; expose a quiet semantic region cue only when Plan 09 explicitly
  marks it as puzzle-relevant.
- Replace separate permanent audio buttons with one compact accessible Sound
  disclosure in the canonical action order. It presents Mute/Unmute, Previous,
  Next and Shuffle/Random, reserving Loop only if the Human approves it. This
  plan owns disclosure/focus/geometry—not playback history or track selection.
  Invoke only the `MusicTransportPort` frozen at checkpoint 03M; do not reach
  into an audio element, recreate history, or assume Plan 07B has already landed.
- Treat `PT-20260903-25` as a Plan-01 acceptance tranche, not optional polish.
  The rebuilt shell must look like an authored Maze video-game interface from
  the same visual world as the final sprites, rather than a generic clean web
  dashboard with illustrated content. Reference games communicate joyful
  hierarchy and console-grade finish only; do not reproduce their UI skins,
  layouts, logos, type treatments, transitions or trade dress.
- Implement a small tokenized surface/edge/ornament family from the final Art
  Bible's “paper-cut signals over magical surfaces over painted world” model.
  The leading treatment is softly frosted white/pearl magical glass with quiet
  text centres, a luminous inner rim, controlled world tint/depth and sparse
  storybook edge ornament. Avoid uniform repeated cards, default pills/forms,
  excessive nested translucency and equal emphasis everywhere.
- Provide full/lite/static recipes for every surface family. Literal
  `backdrop-filter` or equivalent transmission is bounded to a measured small
  number of static overlays in full quality; lite/static reproduce the same
  material through opaque colour, gradients, borders and highlights. Never
  continuously blur the moving maze behind the persistent HUD.
- Freeze a compact, locally packaged typography system with Art-Bible approval,
  licence provenance, exact real weights, no synthetic weights, required text/
  arithmetic glyph coverage, stable figures where useful, fallback and byte/
  loading policy. Test its expressive display/control voice and legible prose
  treatment at couch distance, every minimum text size, 200% resize and the
  text-spacing override; font personality never excuses reduced readability.
- Extend the shared catalogue-image primitive with an explicit `presentation`
  role. Contextual blocker feedback prominently displays the exact required
  item's large approved rendition plus concise real text. Preserve the current
  blocker interaction and migrate its direct 112px `itemSrc` field-image
  coupling rather than adding another dialog/state. Too-strong guidance,
  newly met friends/enemies, item details, Adventure Book, important rewards,
  victory and selected story moments may use it when it adds recognition or
  emotion. Routine HUD cells keep their optical renditions. Never upscale a
  small field sprite as modal art.
- Use one reusable semantic `CatalogueImage`/`PresentationArt` consumer and typed
  dialog variants such as standard, blocker, hint, story, and celebration rather
  than a boolean visual special case or hard-coded URL in each dialog. At the
  960×540 reference stage, the blocker subject occupies at least 144 CSS px;
  compact layouts preserve at least 96 CSS px unless measured available geometry
  proves that impossible, in which case the UI spec records the reviewed band.
- Presentation renditions load only for the visible or bounded-imminent surface,
  reserve stable responsive geometry before decode and fall back to the correct
  semantic optical art/text on missing or failed media. Opening one dialog must
  not preload the complete presentation catalogue or block its primary action.
- Integrate the individually approved Plan-03 title illustration, home splash
  and logo as the first front-door set, preserving their crop/safe zones and
  separate overlay text/logo semantics. The current `title` surface already
  serves as Home: assign the illustrations distinct background/foreground or
  responsive roles, or explicitly reserve one, without adding a screen merely
  to show both. Treat generated lettering as concept-only until the exact
  “Maze so Puzzle” wordmark is reconstructed through controlled local type or
  vector/raster lettering, passes spelling/legibility/optical checks and receives
  Human approval. Plan 11 later audits rather than automatically replaces that
  set. After Plan-01 acceptance, produce the
  preferred Family Preview 1 unless the manager records a red or disproportionate
  packaging gate under `PT-20260903-26`.

### Shared ownership

- Plan 06 owns required/optional semantics, HUD view-model truth, and legal gameplay-input truth.
- This plan owns shell/dialog markup, overlay state, focusable semantic IDs, layout anchors, CSS import/layer order, and the shared motion preference/provider. It creates canonical neutral `src/motion.ts`, exporting `MotionPreference = "system" | "full" | "reduced"` and resolved `MotionMode = "full" | "reduced"`; downstream systems import these rather than define them again. Forced static presentation remains a separate quality/fallback policy, not a third persisted preference.
- Store the motion preference through a small presentation/accessibility preference contract separate from campaign progress and active-run state. `Reset Progress` must preserve it. Plan 08 extends that same preference store for haptics/input choices; it must not have to migrate motion out of `progress.ts` later. Original placement suggestions that mix the preference into campaign progress are superseded.
- Centralize typed UI surface/top-overlay truth in `src/ui/interactionState.ts` (or the final path recorded in the UI spec) and expose a narrow current-input blocking selector so keyboard/pointer/touch cannot move behind the top layer before Plan 08 lands. This plan does **not** define canonical `InputContext`, `InputAction`, `InputSource`, or `getInteractionPolicy()`; references to that name in the original body are superseded.
- Plan 08 owns input-source normalization, held cadence, gamepad actions, and focus navigation; it consumes this plan's focus surfaces.
- Plan 08 also owns canonical `src/inputContext.ts` and `getInteractionPolicy()`, combining this plan's typed UI/top-overlay state with Plan-02 presentation locks and Plan-06 gameplay legality. It replaces the narrow compatibility selector only after parity tests prove every existing source stays blocked correctly.
- Plan 04 owns terrain topology/rendering and scene grounding; this plan supplies the MazeViewport host and declared layer slots.
- Plan 02 owns VFX timelines/keyframes inside its declared layer. Plan 05 owns sprite-frame motion inside its declared layer. Neither creates a competing CSS layer manifest or motion preference.
- Plan 07A owns the common browser/performance harness. Extend it; do not add a rival framework.

### Documentation and completion

Create and maintain `docs/UI_UX_SPEC.md`, including the final UI material,
shape, ornament, typography, state and presentation-rendition grammar. Update
`docs/ARCHITECTURE.md`, the README device/layout description,
`docs/PROJECT_AUDIT.md`, and `docs/RELEASE_CHECKLIST.md` only as the new layout
becomes true. Remove obsolete fixed-stage claims when cutover is complete rather
than leaving contradictory authorities.

The implementation is not complete without automated geometry/state coverage,
live screenshots for the shared viewport matrix, a Human-reviewable styled
component/state proof sheet, Normal/Big/dialog/controller-focus checks, exact
blocker presentation art, font/contrast/quality-tier evidence, full objective
and inventory containment, no accidental card bands, no legacy override layer,
and `npm run check` plus `npm run check:desktop` passing.

Status: planning and research only; no UI implementation is included in this change.

Plan date: 2026-09-02

Repository state inspected: branch `main`, commit `c6b6628b6e651d18161a4d1302935d3096f665c6`

Initial working tree: clean (`git status --short` returned no entries)

Runtime inspected: local Vite development server at `/?debug=mazes`

Application context: React 19 / Vite frontend shared with Tauri 2; Tauri default window 1280×720 and minimum window 960×540.

## 1. Decision summary

The UI should evolve from one uniformly scaled 960×540 application canvas to an adaptive DOM play shell while retaining a fixed-reference, square maze viewport and the existing gameplay coordinate model.

The manager-adopted direction is a **board-first square maze plus one persistent information/control deck**. The three-zone command-rail concept below is retained only as research evidence:

- Keep the 6×6 camera square, its global maze coordinates, its cell proportions, and rect-based pointer conversion.
- Stop scaling the entire HUD, text, dialogs, and touch controls as part of the 960×540 scene.
- At every primary landscape size, place view actions, steps, controls,
  contextual feedback and status in the same right-hand deck and logical order.
- At phone sizes, compact and wrap that deck without creating a separate rail or
  removing essential actions.
- In Big Maze, give the board the largest square that the actual viewport permits and turn all remaining width into an explicit focus deck. Never position the minimap outside a clipped maze panel.
- Make Objective, Rescue, Bag, Power, and map orientation continuously visible. Keep currency compact. Move help content, item detail, utility navigation, and tester tools into deliberate contextual surfaces.
- Replace the chronological 7,262-line stylesheet cascade with component-oriented styles and one declared cascade order. Do not append another late override section.

The first implementation gate should repair the seven-slot bag and contradictory objective sizing within the new component/CSS structure. The final migration should remove whole-stage scaling from gameplay HUD and dialogs, because the current model renders a 23px logical Hint control as 13.6px and 8px objective text as 4.7px at 568×320. That cannot meet the requested child-friendly touch, legibility, or text-scaling requirements.

## 2. Scope and evidence contract

### In scope

- Gameplay layout and information hierarchy.
- Normal and Big Maze composition.
- Objective, rescue, Adventure Bag, currency, Power, minimap, control, feedback, and utility-navigation ergonomics.
- React component and DOM structure.
- CSS architecture, layout regimes, container queries, safe areas, and overflow behavior.
- Keyboard, pointer, touch, focus, dialog, text-fit, reduced-motion, and screen-reader requirements.
- Test fixtures, geometry assertions, viewport/state QA, rollout, rollback, and coordination requirements.

### Explicitly out of scope

- Redesigning static artwork, sprites, texture assets, VFX appearance, lighting, fog, terrain rendering, or animation art direction.
- Changing movement, camera/FOV, combat, collection, rescue, level, scoring, or puzzle rules.
- Changing authored objectives or level topology merely to make the UI fit.
- Adding frontend/design/test dependencies during this planning phase.

Where this plan requires another track, it requests an interface contract rather than prescribing that track's creative work. In particular, the VFX track must replace hard-coded HUD destination coordinates, but this plan does not redesign the treasure-flight effect.

### Evidence labels used below

- **Observed** means measured in the live browser with `getBoundingClientRect()`, computed styles, scroll dimensions, or a captured screenshot.
- **Source-confirmed** means traced to code or data at the inspected commit.
- **Documented** means stated in current project documentation; historical claims are not treated as proof of current behavior.
- **Research-backed** means supported by the cited external source.
- **Recommendation** is the proposed design decision or inference.

### Live-audit artifacts

To satisfy the requirement that the repository diff contain only this plan, screenshots and raw measurement exports were saved outside the repository and are intentionally untracked:

`C:\Users\hellb\.codex\visualizations\2026\09\02\01a06193-a3e1-7963-8408-a27bdce433c9\ui-audit`

The evidence set contains:

- Historical normal-mode audit screenshots for Mazes 1, 8, 12, 15, and 16 at the five planning-time viewports, named `maze-{01|08|12|15|16}-{1280x720|960x540|1024x768|844x390|568x320}.png`; the adopted execution matrix later in this plan contains seven base viewports.
- Historical Big Maze screenshots for Maze 12 at those five audit viewports, named `maze-12-big-{viewport}.png`.
- Historical Help-modal screenshots at those five audit viewports.
- Hint, tester-picker, and Maze 16 story-dialog screenshots at representative desktop and minimum-phone sizes.
- Raw `measurements.json`, `variable-measurements.json`, and `modal-measurements.json` exports.

Representative evidence:

- `maze-12-960x540.png`: fourth Adventure Bag cell is absent because it lies outside the detail column; the long objective is visibly truncated; five rescue portraits are squeezed into narrow tracks; minimap card has large empty bands.
- `maze-12-big-960x540.png`: the board sits in the left portion of the stage while the entire right portion is blank; the intended compact minimap is clipped outside the maze panel.
- `maze-12-568x320.png`: the same logical defects persist after scaling and controls/text become physically too small.
- `modal-help-568x320.png`: close and primary targets render at 22.5px high; content is scaled rather than responsively composed.

The live browser reported no warning or error console entries during the audit. That is useful runtime evidence, but it does not negate internal clipping or accessibility defects.

The curated skill catalog was also inspected through the user-scoped skill installer. It offered general screenshot and Playwright/browser-testing candidates but no exact UI-accessibility audit skill that added useful capability beyond the already available in-app browser inspection, screenshots, DOM bounds, computed styles, and accessibility checks. This UI track did not request or install another skill: an installation would only become available on a later turn and would not improve this completed live audit. Any user-scoped skills installed concurrently by other work are outside the repository and were left untouched.

## 3. Current-state source audit

### Files and symbols inspected

| File | Relevant authority and findings |
| --- | --- |
| `src/App.tsx` | `App` begins at line 1086 and owns state, input, modal state, fixed-stage observation, and almost the entire game view. The inline game DOM spans approximately lines 2594–3235. Existing extraction candidates include `MazeTerrain` (630–884), `MiniMap` (886–977), `InventorySlot` (3667–3683), `StoryInterlude` (3689–3747), and `Modal` (3749–3807). |
| `src/styles.css` | 7,262 lines and 123 `!important` declarations. Historical passes are interleaved from the base rules through V2, V3, V5, V7.1, V8, V10.3, V12, the final V13 cascade, and V17. Frequently redefined selectors include `.exploration-dashboard` (77 occurrences), `.objective-card` (29), `.utility-row` (22), and `.modal-card` (23). |
| `src/stageScale.ts` | `LOGICAL_STAGE_WIDTH = 960`, `LOGICAL_STAGE_HEIGHT = 540`; `calculateStageScale()` at lines 11–24 applies `min(availableWidth / 960, availableHeight / 540)` and `getScaledStageSize()` derives the fitted rectangle. |
| `src/stageScale.test.ts` | Lines 8–50 cover the scale math at 1280×720, 1024×768, 844×390, and 568×320 plus invalid inputs. There is no DOM, safe-inset, target-size, zoom, text-fit, or container-query assertion. |
| `src/navigation.ts` | `getNextStoryIndex()` (line 9) and `shouldConfirmMazeSwitch()` (line 38) define campaign continuation and protected cross-maze switching. These contracts must remain unchanged. |
| `src/pointerControls.ts` | `normalizedBoardPoint()` (line 25), `pointerIntentFromTileOffset()` (line 42), and `resolvePointerMoveDirection()` (line 137) derive input from the board's live rect. This is already resilient to a square board changing size and should be retained. |
| `src/movementControls.ts` | `heldMoveRepeatDelay()` (line 26), `advanceHeldMoveCadence()` (line 45), and `beginHeldMoveCadence()` (line 61) implement the shared immediate/held cadence. UI work must not alter it. |
| `docs/ARCHITECTURE.md` | Lines 33–36 and 145–150 explicitly make the 960×540 uniformly scaled stage an architectural decision and deliberately letterbox extra space. Evolving it requires an architecture update, not an incidental CSS patch. |
| `docs/PROJECT_AUDIT.md` | Current status claims no document overflow, while lines 418–430 still list automated accessibility, 200% zoom, visual regression, touch-target, D-pad, and physical-device work as open. No document overflow is not evidence that nested cards do not clip. |
| `docs/RELEASE_CHECKLIST.md` | Current evidence covers 1280×720 and 1024×768 and explicitly leaves physical-device and accessibility work unclaimed (lines 12–17). Historical line 482 says 960×540 has no clipping, but the current seven-slot live state contradicts that check. Big Maze remains unchecked at lines 495–496. |

### State and content envelope

The authored campaign itself proves that the overhaul needs true variable-content behavior, not special handling for Maze 12.

| Maze | Level | Objective length | Friends | Persistent Bag slots | Stress characteristic |
| ---: | --- | ---: | ---: | ---: | --- |
| 1 | Little Star Trail | 29 | 1 | 1 | Minimum rescue/bag content. |
| 8 | Ame's Grand Parade | 51 | 3 | 6 | First representative item-heavy case; current fourth slot is already clipped. |
| 12 | Moonlit Friendship Quest | 74 | 5 | 7 | Maximum friends and bag: weapon, Splash Boots, Spring Boots, Antidote Leaf, and three keys. |
| 15 | Friendship Crown Vault | 62 | 5 | 7 | Maximum content plus three portal pairs and portal-specific Help content. |
| 16 | Rainbow Power Parade | 78 | 5 | 2 | Longest campaign objective, many enemies, and a credible displayed Power value up to 301. |

Across all 16 curated mazes, rescue counts cover 1–5 and persistent Bag slot counts cover every value from 1–7. Source locations are `src/game/levels.ts:302–322`, `497–537`, `694–750`, `830–937`, with campaign order at `938–955`.

The current Bag count is not the count represented by its slots. `src/App.tsx:3044` displays `game.collectedObjectIds.length`, while the engine also adds consumed potions and currency treasure to collected IDs. Maze 12 can therefore show 13 beside seven persistent slots. The overhaul should display `found persistent slots / total persistent slots`; if a historical pickup count is retained, it must be separately labelled as “Pickups,” not “Adventure Bag.”

Key slots currently follow first occurrence in level-object order, which varies between levels. The recommendation is a stable child-facing order based on the existing color/shape vocabulary: Red Heart, Yellow Sun, Blue Star. This changes presentation order only, not gameplay.

## 4. Live layout audit

### 4.1 Uniform-stage behavior at the required viewports

All measurements below are CSS pixels at device pixel ratio 1. The board values are border-box measurements; targets are rendered post-transform dimensions.

| Viewport | Current stage rectangle | Letterbox | Board | Approx. unused maze side rail, each side | D-pad / top action | Hint | Utility height |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| 1280×720 | 1280×720; scale 1.333 | none | 682.7×682.7 | 88.0 | 40.0 | 30.7 | 58.7 |
| 960×540 | 960×540; scale 1.000 | none | 512×512 | 66.0 | 30.0 | 23.0 | 44.0 |
| 1024×768 | 1024×576; scale 1.067; y=96 | 96 top and bottom | 546.1×546.1 | 70.4 | 32.0 | 24.5 | 46.9 |
| 844×390 | 693.3×390; scale 0.722; x=75.3 | 75.3 left and right | 369.8×369.8 | 47.7 | 21.7 | 16.6 | 31.8 |
| 568×320 | 568×319.5; scale 0.592; y≈0.25 | negligible | 302.9×302.9 | 39.1 | 17.8 | 13.6 | 26.0 |

The same composition is preserved, but physical usability is not. The 8px logical objective becomes about 4.7px at 568×320; 6px utility and wallet labels become about 3.6px. A 30px logical D-pad target becomes 17.8px and the Help modal close target becomes 22.5px. Even though direct dragging on the board remains a large target, the alternate input and navigation UI fail the requested ergonomics.

The stage is also its own container (`src/styles.css:86–113`). Because it remains 960×540 before transform, container queries respond to that logical box rather than the physical viewport. Rules such as `max-width: 1050px` and `max-height: 600px` always match; `max-width: 760px` and `max-height: 420/430px` never match. This is why the apparent responsive stylesheet does not actually select a phone composition.

Browser zoom is likely to cancel its own benefit: zoom reduces the effective viewport, the scale observer shrinks the stage, and browser magnification enlarges it again. This must be formally verified in implementation, but the architecture cannot be considered compliant with 200% text resize until the HUD is decoupled.

### 4.2 Effective 960×540 normal-mode composition

At the logical minimum, the final computed geometry is:

| Selector | Observed border box / track | Finding |
| --- | --- | --- |
| `.game-layout` | 958×538; columns `644px 296px`, gap 6px, padding 6px | Late V12 `!important` rule at `src/styles.css:6153–6157` determines every mode. |
| `.maze-panel` | 644×526 | Board is 512px square, centred at x=73; about 66px is unused on both sides. |
| `.sidebar` | 296×526 | Flex stack is forcibly clipped by `overflow: hidden` at lines 6159–6164. |
| `.brand-and-wallet` | 296×34 | Two 146px currency cells. |
| `.hero-card` | 296×48 | Power receives a whole fixed row. |
| `.exploration-dashboard` | 296×320; columns `142px 150px` | The minimap and all Objective/Rescue/Bag content are forced into one tall two-column track. |
| `.adventure-details` | 150×320; rows `38px 70px 204px` | Objective and Rescue are fixed; Bag receives the rest whether or not its content fits. |
| `.maze-map-card` | 142×320 | A max-132px minimap is centred in the flexible middle row. |
| `.controls-card` | 296×64 | Text plus 92×60 D-pad containing 30px targets. |
| `.utility-row` | 296×44 | Six dense buttons with 6px labels. |

This is a density problem and a hierarchy problem: cards receive space because of inherited fixed tracks rather than content priority.

### 4.3 Adventure Bag failure

**Observed and source-confirmed.** The current inner Bag grid has a 136px client width and a 169px scroll width:

`4 × 40px slots + 3 × 3px gaps = 169px`

The forcing rules are `src/styles.css:6243–6246`:

- `.bag-card { overflow: hidden; }`
- `.inventory-grid { grid-template-columns: repeat(4, 40px) !important; gap: 3px !important; }`

In Maze 12 at 960×540, slot rectangles are approximately:

| Slot | Left–right | Relative result |
| ---: | --- | --- |
| 1 | 810–850 | inside |
| 2 | 853–893 | inside |
| 3 | 896–936 | inside |
| 4 | 939–979 | extends 26px beyond the Bag card's right edge at x=953 and is clipped |
| 5–7 | next row | rendered, but the grid still exceeds its clipping ancestors |

The visual result shows only three items in the first row; the fourth is inaccessible. The defect reproduces in Maze 8 with six slots and Mazes 12/15 with seven slots at every required viewport because uniform scaling preserves the logical mismatch. Nested `overflow: hidden` on the Bag, dashboard, sidebar, stage, frame, and body prevents any recovery.

`InventorySlot` renders a generic `<div>` containing only an image, with its full label/status available through `aria-label` and `title`. CSS for `.inventory-slot > span` is dead. This gives no visible item name and no focus/tap detail path; `title` is not a touch solution.

### 4.4 Minimap bands

**Observed and source-confirmed.** At 960×540, `.maze-map-card` is 142×320 and `.maze-minimap` is 128×128. Its top begins approximately 98px below the card top and leaves approximately 94px below it. The card uses `grid-template-rows: auto minmax(0, 1fr) auto` (`src/styles.css:4153–4162`) while V12 caps the map to 132px (`6218–6229`). The flexible middle row absorbs height that the map cannot use.

The minimap should be a max-content component containing a heading, square map, and short legend/status. Extra panel height belongs to other information; it should never become symmetric blank bands inside the map card.

### 4.5 Objective and rescue compression

**Observed and source-confirmed.** The details grid assigns the Objective 38px at line 6233, but the final V13 cascade forces `.objective-card { min-height: 52px !important; }` at lines 6713–6717 and clamps its text to two lines at 6724–6731. This is an internally contradictory size contract.

The objective text element has only about 112 logical pixels of content width. Observed text-element scroll widths were 176px for Maze 8, 250px for Maze 12, 203px for Maze 15, and 268px for Maze 16. The full objective remains in the DOM but is visibly truncated. A child should not need a hint modal to recover the basic objective.

For five rescues, the 136px rescue grid creates five approximately 25.6px tracks plus 2px gaps, while later rules force `.rescue-icon` to 38×38 and `.cage-mini` to 40×40 (`src/styles.css:6237–6242`). The outer friend cells stay within the card, but their imagery is cropped by overflow. Rescue status also relies heavily on grayscale/opacity and has no visible names.

### 4.6 Big Maze is structurally defeated by the final cascade

Earlier Big Maze rules correctly request a single-column layout and hide the sidebar (`src/styles.css:1929–1946`). V12 later forces every `.game-layout`, including `.big-maze`, back to `minmax(0, 1fr) 296px !important`. The sidebar is hidden, but its grid track remains.

The maze panel is independently capped to a square-like width. At 960×540:

- normal board: 512×512;
- Big Maze board: 471×471, so “Big” is actually smaller;
- maze panel: x=66–592;
- layout right edge: x=959;
- unused right region: approximately 367px;
- `.big-maze-minimap` is positioned at x≈597–731, entirely beyond the maze panel's right edge and clipped by the panel.

| Viewport | Big board | Approx. unused region to panel's right |
| --- | ---: | ---: |
| 1280×720 | 628×628 | 489.4px |
| 960×540 | 471×471 | 367.0px |
| 1024×768 | 502.4×502.4 | 391.4px |
| 844×390 | 340.2×340.2 | 265.0px |
| 568×320 | 278.7×278.7 | 217.1px |

The compact Big HUD also gives the Maze 12 title only about 10px of usable width in one measured state. It omits the full objective, currencies, D-pad, and utility navigation; key progress is aggregated without key color/shape. Big Maze therefore loses both scale and information quality.

### 4.7 Modal and input-state audit

The shared `Modal` implementation correctly provides a dialog role, initial focus, a Tab trap, optional Escape close, background `inert`, and focus restoration. A visible focused close button had a 3px teal outline with a 3px offset. These are valuable contracts to preserve.

However, whole-stage scaling defeats the target and text size:

| Modal state | 960×540 | 568×320 | Finding |
| --- | --- | --- | --- |
| Help | card 480×482; inner client height 476, scroll height 516 | card 284×285 | Internal vertical scrolling is reasonable, but the primary action reaches beyond the visible card at 960 and renders 22.5px high at minimum phone. Close is also 22.5px. |
| Tester picker | card 480×482; grid viewport 423×300, scroll height 510; buttons 206.5×58 | grid ≈259×177.5; buttons ≈122×34.3 | Intentional inner scrolling works, but rows/targets are too small on phone. |
| Maze 16 story | card ≈846×451; Start ≈251×44 | card ≈500.5×266.8; Start ≈148.5×26 | Copy fits, but the custom dialog scales to 9.5px text and a 26px primary target. It does not share the common focus-trap/restore implementation and dismisses on pointer-down. |

`modalOpen` at `src/App.tsx:1332–1343` includes reset progress, tester, level picker, pending adventure, story, Help, Hint, blocker, too-strong, and result states. The movement guard at `1685–1697` does **not** include `levelPickerOpen` or `resetProgressOpen`. Because keyboard movement listens on `window`, `inert` does not stop it. Arrow/WASD input can therefore move Ame behind those dialogs. Escape propagation can also close a modal and exit Big Maze in one event. A single interaction policy must control movement, held-input cleanup, inertness, and top-layer Escape handling.

`GameStatus` includes a dormant `lost` value. The current engine does not appear to produce it, but `modalOpen` can make the background inert while no corresponding loss surface renders. Implementation must either provide a reachable, tested loss dialog or remove/exclude the unreachable state with gameplay-owner approval; it may not leave an inert screen with no active dialog.

The custom story surface must move onto the common dialog shell. A pointer-down anywhere should not dismiss a reading surface; use explicit Start/Close activation on release.

### 4.8 Existing strengths to protect

- The 6×6 camera is a clear, square play surface; every curated maze uses exploration mode, and camera coordinates remain presentation-only.
- Pointer conversion is based on the live board rect, not hard-coded pixels, and tests cover scaling/hysteresis/corner assistance.
- Keyboard, board pointer, and D-pad inputs share the same game move function and held cadence.
- Normal cross-maze navigation protects an active moved run through `shouldConfirmMazeSwitch()`.
- The visible minimap is `aria-hidden` and paired with textual player/exit/landmark status; this is the correct high-level pattern, though guided-marker parity needs improvement.
- Shared dialogs already establish most of the desired semantic/focus foundation.
- No page-level overflow appeared at the five audited sizes and no browser warnings/errors appeared. The overhaul should preserve that while also eliminating internal clipping.

## 5. Research synthesis

All external sources in this section were accessed on 2026-09-02. Sources are used for principles and constraints, not for visual imitation.

### Child-centred play and comprehension

- UNICEF Innocenti's RITEC work links child-centred digital play to agency, competence, relationships, creativity, inclusion, safety, solving puzzles, exercising control, and collecting/curating. For this game, the interface should make the next goal, meaningful progress, choices, action feedback, and recovery obvious without automating the puzzle. [Responsible Innovation in Technology for Children, UNICEF Innocenti](https://www.unicef.org/innocenti/projects/responsible-innovation-technology-children) (accessed 2026-09-02).
- Anthony's multi-study synthesis of children's touchscreen behavior found materially lower accuracy on small targets and recommends platform-sized targets, larger forgiving hit areas, separation, simple gestures, and salient accepted-input feedback. [Physical Dimensions of Children's Touchscreen Interactions](https://init.cise.ufl.edu/wp-content/uploads/sites/775/2019/03/anthony-et-al-IJHCS2019-MTAGIC-final-preprint.pdf), [DOI](https://doi.org/10.1016/j.ijhcs.2019.02.005) (accessed 2026-09-02).
- Research with younger children suggests that decorative or informal symbols can impose extra interpretation cost. Although the age range is narrower than this project's entire audience, it supports pairing unfamiliar item/action icons with short labels or a persistent tap/focus detail path. [Hidden Symbols](https://faculty.washington.edu/alexisr/HiddenSymbols.pdf) (accessed 2026-09-02).

The resulting play loop should be legible as: **notice goal → choose → act → see confirmation → recover or continue**.

### Touch ergonomics

- WCAG 2.2 AA requires at least 24×24 CSS pixels unless a defined exception applies. [Understanding SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) (accessed 2026-09-02).
- WCAG's enhanced target is 44×44 CSS pixels; Apple recommends 44×44pt controls, and Android recommends a 48×48dp touch area. These units are not identical, but they converge on a substantially larger design target than the current minimum-phone controls. [Understanding SC 2.5.5](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html), [Apple HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility), [Android app accessibility](https://developer.android.com/guide/topics/ui/accessibility/views/apps-views) (accessed 2026-09-02).
- Xbox's game-specific guidance is more conservative still and recommends adjustable touch controls, reinforcing that frequent movement deserves more room than incidental utility actions. [XAG 107 Input](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/107) (accessed 2026-09-02).

Project target: 48×48 rendered CSS pixels for frequent movement, Hint, pause/close, and primary actions; 44×44 for other direct controls; about 8px between unrelated targets where space permits. The 24×24 AA value is a hard floor, not the design target.

Utility controls should activate on release/click so a user can slide away to cancel. Movement may activate on pointer-down for responsiveness, but it must terminate on `pointerup`, `pointercancel`, lost capture, blur, and visibility loss. [Understanding SC 2.5.2 Pointer Cancellation](https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html), [Understanding SC 2.5.7 Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) (accessed 2026-09-02).

### Inventory, minimap, and puzzle-interface patterns

First-party handheld game manuals show useful, recurring separation between glanceable play status and detailed management:

- *The Legend of Zelda: A Link Between Worlds* keeps immediately usable item slots near play while moving the full inventory to its own surface; its map prioritizes current position, target, and user markers. [Nintendo manual](https://www.nintendo.com/eu/media/downloads/games_8/emanuals/nintendo_3ds_2/the_legend_of_zelda_a_link_between_worlds/ElectronicManual_TheLegendOfZeldaALinkBetweenWorlds_EN.pdf) (accessed 2026-09-02).
- *Dragon Quest VIII* separates glanceable party/gold state from item explanation and sorting. [Nintendo manual](https://csassets.nintendo.com/noaext/image/private/t_KA_PDF/manual-3DS-Dragon_Quest_VIII-en?_a=DATC1RAAZAA0) (accessed 2026-09-02).
- *Super Pokémon Rumble* changes minimap content by context and limits its legend to actionable markers. [Nintendo quick-start guide](https://www.nintendo.com/eu/media/downloads/games_8/quick_start_guide/QuickStartGuide_3DS_SuperPokemonRumble_EN.pdf) (accessed 2026-09-02).
- *Professor Layton and the Azran Legacy* stages puzzle information while keeping description, submit, undo, restart, hints, and quit-for-later discoverable in the solving context. [Nintendo manual](https://www.nintendo.com/eu/media/downloads/games_8/emanuals/nintendo_3ds_2/professor_layton_and_the_azran_legacy/ElectronicManual_Nintendo3DS_ProfessorLaytonAndTheAzranLegacy_EN.pdf) (accessed 2026-09-02).

The project-specific inference is not to copy those skins. It is to keep all seven small persistent Bag states visible, put verbose item explanation on focus/tap, limit the minimap to actionable spatial state, and keep recovery actions discoverable without making them visually equal to the maze.

### Responsive fixed-reference interfaces

Uniform fit scaling is valid for a game canvas, but not sufficient for responsive text and controls. CSS container queries should respond to the actual play shell, `aspect-ratio: 1` should enforce square board/map geometry, and safe-area variables should pad real viewport edges. [MDN Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries), [MDN Aspect Ratios](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Box_sizing/Aspect_ratios), [MDN `env()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env), [Phaser Scale Manager](https://docs.phaser.io/phaser/concepts/scale-manager) (accessed 2026-09-02).

### Accessibility, text, focus, and motion

- Text must resize to 200% without clipping or loss, survive the WCAG text-spacing override, and reflow at 320 CSS pixels. The maze may qualify as essential two-dimensional content, but ordinary HUD text/cards do not. [Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html), [Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html), [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), and [viewport-unit failure F94](https://www.w3.org/WAI/WCAG22/Techniques/failures/F94) (accessed 2026-09-02).
- Normal text needs 4.5:1 contrast; large text, meaningful controls, focus boundaries, and graphical markers need the applicable 3:1 threshold. Color cannot be the only status cue. [Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html), [Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) (accessed 2026-09-02).
- Focus must be visible and not obscured. DOM order should match visual order, buttons must retain Enter/Space behavior, and modal dialogs must contain focus, close predictably, and restore focus. [Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html), [Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html), [WAI-ARIA keyboard practice](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/), [APG Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/), [APG Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) (accessed 2026-09-02).
- Pickup, rescue, and Power changes should use polite status messages without announcing every movement tick. [Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) (accessed 2026-09-02).
- Detect `prefers-reduced-motion` and provide a persistent in-game override. Reduced mode should remove slide, bounce, pulse, hover scaling, parallax, shake, and rotation tweening while retaining immediate static state feedback. [MDN `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion), [WCAG Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html), [XAG 117](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/117) (accessed 2026-09-02).

## 6. Information-priority model

The play surface should allocate space according to how quickly a child needs the information, not according to the order in which features were added.

### Priority 0: continuously visible during active play

1. **Maze and Ame's local state.** The square camera is the primary decision surface.
2. **Immediate objective.** Show the entire authored objective; wrap it naturally. Hint is adjacent but visually secondary.
3. **Movement input and accepted-input feedback.** Keyboard and board gesture remain primary where available; an accessible on-screen alternative remains present.
4. **Power.** Keep the number and visual identity visible, including three digits; do not truncate at 99.
5. **Rescue progress.** Show `rescued / total` and all 1–5 friend states.
6. **Persistent Bag state.** Show every persistent slot declared by the current level in stable semantic order, including missing/found state; the shipped envelope is 1–7 and the layout is not capped there.
7. **Orientation.** Keep a square minimap plus the player's position, explored amount, and actionable goal/marker state.
8. **Current feedback.** Blocked reason, pickup, rescue, combat result, and route guidance must be perceivable visually and through the status region.

### Priority 1: compact and persistent

- Level/chapter name and step count.
- Gold and Science totals.
- Normal/Big view state.
- Sound state.
- A short first-use control reminder. Once acknowledged or after movement begins, this can collapse to a labelled control icon without losing Help access.

### Priority 2: contextual but one action away

- Full item names/descriptions and found-state explanation.
- Full map legend and textual landmark list.
- Story replay, Help, Hint content, Adventure Book, maze picker, Home, sound options, restart, and new-maze action.
- Tester/debug controls. These belong under a visibly separate “Tester tools” disclosure available only with `?debug=mazes`; they must not occupy child-facing play hierarchy by default.

### Priority 3: modal or episodic

- Story interlude, too-strong comparison, reset/switch confirmation, completion/reward, blocker explanation, and detailed Help.
- These surfaces suspend gameplay input, receive focus, provide an explicit exit/primary action, and restore focus.

No continuously visible information may depend on hover. Contextual details must be available on keyboard focus and tap and must remain present until dismissed or focus moves intentionally.

## 7. Credible layout directions

### Direction A — Adaptive command rail plus information deck (research option; superseded)

This was the research recommendation. The Human/manager decision now uses a
square board plus one persistent information/control deck at every primary
landscape size. The analysis below is retained as evidence only and must not be
implemented as a third layout track.

Benefits:

- Uses current maze-side space for existing functions without stretching or obscuring tiles.
- Keeps every Priority 0 item visible.
- Gives Bag, rescue, and objective genuine content-driven dimensions.
- Makes Big Maze structurally explicit and prevents the hidden reserved track.
- Lets touch targets and text use real CSS pixels on phones.
- Supports DOM order that is stable across modes: board → live status → HUD sections → controls/navigation.

Costs and risks:

- Requires the deliberate stage-architecture migration described in Section 8.
- The adopted primary and compact regimes need geometry tests rather than relying on one screenshot.
- VFX destinations coupled to the old HUD must switch to measured anchors.
- At 568×320, visual rescue and Bag thumbnails must be compact non-interactive status cells; full labels move to one accessible detail surface.

### Direction B — Maximum board with overlaid status ribbon and slide-out drawers

This alternative lets the board consume nearly the whole viewport. A top ribbon shows Objective/Power/rescue summary; Bag, minimap, controls, and utilities open as edge trays or overlays.

Benefits:

- Largest possible board at every size.
- Very dramatic Big Maze presentation.
- Fewer persistent cards and less apparent density.

Costs and reasons not to recommend it:

- Hides Bag slots or the minimap precisely when item-heavy mazes require them for planning.
- Overlays can cover actionable maze cells, especially at 568×320.
- Requires more open/close actions and adds focus-management complexity.
- Makes simultaneous comparison of objective, keys, rescue state, and map harder for children.
- A persistent overlay large enough to show all seven items recreates the current maze-obstruction problem in another form.

Direction B may inform the contextual “More,” item-detail, and map-legend surfaces, but it should not be the primary play layout.

## 8. Fixed-stage architecture decision

### Decision

Retain 960×540 as a **legacy reference and minimum desktop design envelope**, not as a uniformly scaled canvas for the entire interface.

Specifically:

- Preserve the logical maze/camera model, square board, 6×6 cell grid, terrain SVG world coordinates, and `getBoundingClientRect()`-based pointer normalization.
- Mount gameplay UI in an actual-size `PlayViewport` that fills the safe viewport. Its CSS container dimensions are the post-safe-area physical CSS dimensions.
- Let the maze square size with CSS `aspect-ratio: 1`; keep its six rows and columns equal. Rendering may use fractional CSS pixels, but width and height must be the same.
- Restrict any internal reference transform to the scene/presentation layer that truly needs logical coordinates. Do not transform HUD, dialogs, focus rings, or direct controls.
- Keep title and Adventure Book migration separable. They may temporarily remain on the legacy stage while the game screen moves first, provided dialogs invoked over gameplay live outside the transformed scene.
- Preserve Tauri's 1280×720 default and 960×540 minimum window configuration. The desktop minimum is not permission to ignore smaller web/PWA landscape viewports.

### Why the old model is no longer appropriate

The current model guarantees visual sameness, but it also guarantees that every target and font shrinks at the same rate. It prevents actual phone container queries, does not permit useful 200% text growth, letterboxes 1024×768 while the HUD is starved, and preserves internal clipping at every scale. These are architectural, not cosmetic, limitations.

### Migration seam

Introduce these layers:

1. `AppViewport`: safe-area and orientation shell in real CSS pixels.
2. `PlayShell`: actual-size query container selecting layout regime.
3. `MazeViewport`: square, resize-observed board surface.
4. `MazeScene`: current terrain, objects, sprites, and presentation overlays.
5. `AdventureHud`: untransformed semantic DOM.
6. `DialogLayer`: untransformed top layer shared by all modal states.

`MazeViewport` supplies its live rect to existing pointer logic exactly as the current `boardRef` does. It also publishes named DOM anchors or measured refs for VFX destinations. No engine or solver coordinate changes are required.

### Compatibility and rollback

Build the adaptive game surface behind a temporary development-only `data-layout-version="2"` switch. This is not a late override: legacy and new markup must use separate roots and separate style entry points. Each migration phase can switch back to the legacy game view without changing save data or gameplay state. Remove the switch and legacy game styles only after the full matrix passes.

## 9. Recommended layout specification

### 9.1 Shared shell rules

- `PlayViewport` fills `100dvi × 100dvb`. Each logical edge takes the maximum of regime padding and its corresponding safe-area variable—for example, `padding-inline-start: max(var(--regime-padding), env(safe-area-inset-left, 0px))`; safe-area and regime padding are not added together. `--regime-padding` begins at 8px for primary landscape and 4px for compact landscape, then may grow into TV-safe margin without changing topology.
- Landscape gameplay uses no document scroll at the seven base target sizes. At 200% text resize, the deck may scroll vertically in one dimension; the square board remains an essential two-dimensional region and stays usable.
- `PlayShell` is the query container: `container-type: size; container-name: play-shell`. Do not query the fixed scene.
- Base gap is 8–12px in primary landscape and 4–8px in compact landscape.
- The board is `aspect-ratio: 1`, `inline-size: var(--board-size)`, `block-size: var(--board-size)`, with equal `repeat(6, minmax(0, 1fr))` tracks. It is never stretched to fill a rectangular track.
- Panel backgrounds may fill remaining space, but cards use `block-size: max-content` unless the content itself is an intentional scroll region.
- Overlay feedback is constrained to the board or a named feedback row and must not intercept board input outside its own controls.

### 9.2 Target geometry at the required viewports

The manager-reviewed authority replaces the planning-era three-column and five-
regime model. Use one canonical two-region topology at TV, desktop, Tauri and
iPad/tablet sizes: the largest practical square board on the left and one
persistent information/control deck on the right. Normal and Big modes vary the
board/deck emphasis without introducing or reserving a separate command rail.
The implementation must measure exact tracks from final content and safe bounds;
the old `152px` rail and numeric table are historical evidence, not targets.

At 1920×1080, 1280×720, 1194×834, 1024×768 and 960×540, keep the same deck
section/action order and expose ordinary utilities directly. At 844×390 and the
568×320 emergency floor, retain the same board/deck relationship and logical
order but permit tighter wrapping, one bounded deck scroller and `More` for
secondary utilities. Do not move controls into a third track.

Regimes are selected from the actual `PlayShell`, not a device name:

| Regime | Purpose | Invariant structure |
| --- | --- | --- |
| `primary-landscape` | TV, desktop, Tauri and iPad/tablet | Square board + one persistent right deck; all ordinary actions in canonical order. |
| `compact-landscape` | Playable phone fallback | Square board + one compact right deck; identical logical order, bounded wrapping/scroll and optional `More`. |

Use size container queries and `clamp()` for track interpolation. Do not scale
the HUD, make the board rectangular, hide required state, or shrink the minimap
below the manager-approved targets merely to preserve an old board size.

When safe-area insets are nonzero, subtract them before selecting a regime and apply this priority order: preserve 48/44px targets and the deck's minimum usable width; preserve text sizes; reduce the square board; then reduce decorative gaps/padding to their stated minimum. Do not scale the deck. Measured board targets may reduce by the inset amount, but containment, square geometry, and target-size criteria are not waived. If vertical safe space cannot contain the complete compact deck, use one bounded vertical deck scroller with sticky 48px movement controls and a sticky Objective/Hint header; no content may clip or require horizontal scrolling.

### 9.3 Canonical landscape wireframe

```text
┌────────────────────────── PlayShell ──────────────────────────┐
│ ┌────────── square MazeViewport ──────────┐ ┌── Right deck ─┐ │
│ │                                         │ │ Level / Power │ │
│ │                                         │ │ Objective     │ │
│ │              6 × 6 board                │ │ Large minimap │ │
│ │                                         │ │ Friends / Bag │ │
│ │                                         │ │ Controls      │ │
│ │                                         │ │ Utilities     │ │
│ └─────────────────────────────────────────┘ └───────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

In DOM order, put the board's descriptive/live status immediately after the
board, then the deck heading and sections, controls and navigation. Level/step,
view actions, movement, utilities and feedback all belong to the one deck or a
named board overlay; no empty track is reserved when feedback is absent.

### 9.4 HUD deck anatomy

Use this consistent semantic order in every regime:

1. `HudHeader`: level name, Power, currency totals, and `More` where utilities are collapsed.
2. `ObjectiveCard`: full objective plus one 48px Hint button.
3. `ExplorationStatus`: `MiniMapCard`, `RescueTracker`, and `AdventureBag`.
4. `ControlDock`: always occupies its canonical place in the right deck.
5. `UtilityNav`: full row/grid in primary landscape or one 44px `More` disclosure when the compact deck cannot contain secondary utilities.

Size internal tracks from content rather than reusing the planning-era rail
width. Give the minimap the largest square left after the Objective, all current
friend states, the complete one-to-seven-slot Bag and required controls fit.
The starting minimap targets in the manager addendum are acceptance floors, not
fixed maxima. Bag cells use four columns where that preserves readable art and
three columns when the measured deck is narrower; all seven slots wrap.

At the 568×320 emergency floor, a representative compact arrangement is:

```text
┌────────────────── compact deck ───────────────┐
│ Level + Power/currency                  More  │ 44
│ Full objective (wrap; grows into spare space)│ ≥48
│ ┌─ 96px map ─┐ ┌ five friends ─────────────┐ │
│ │             │ │ Bag label + 4 cells       │ │ 120
│ │             │ │             3 cells       │ │
│ └─────────────┘ └───────────────────────────┘ │
│       ↑       ←       ↓       →              │ 48
└───────────────────────────────────────────────┘
```

The compact direction strip contains four 48×48 buttons with 4px gaps and remains in a stable order with explicit accessible labels. A cross is preferable when space permits; the strip is the minimum-phone fallback. `More` lives in the header so it does not consume movement width.

Compact Bag thumbnails and rescue portraits are status indicators, not separate tiny buttons. Their parent lists remain semantically exposed. A single 44px “Bag details” / “Friends details” control in the contextual sheet provides named, operable rows. If individual slots become operable, they must instead expose non-overlapping ≥44px hit areas and the grid must be re-budgeted.

The smallest compact `MiniMapCard` combines “Map” and exploration percentage in one short header and may move its longer legend into `More`, while retaining concise screen-reader spatial status. Even there, the square uses all available safe space up to the competing required-content constraints and never leaves decorative bands above or below it.

### 9.5 Variable-content rules

#### Objective

- `block-size: auto; min-block-size: 56px` on primary layouts; 48px minimum at the smallest compact size.
- No `white-space: nowrap`, `text-overflow: ellipsis`, `overflow: hidden`, or line clamp on objective text.
- `overflow-wrap: anywhere` is a last-resort safeguard; authored words should normally wrap at spaces.
- Allow the longest current 78-character objective plus the Hint target without overlap at each target width.
- Use 16–18px rendered text for core objective/action copy. No essential text below 14px rendered; optional tiny labels must be at least 12px and may be removed rather than shrunk.
- Hint content is contextual; the full objective is not.

#### Rescue tracker

- Render a semantic list with 1–5 children and a visible `rescued / total` label.
- Primary landscape: `repeat(var(--friend-count), minmax(40px, 48px))` with 6–8px gaps.
- Compact: distribute 1–5 cells with a 32px minimum visual cell; the 568×320 fallback may use 24–28px non-interactive portraits plus a textual count.
- Never force a 38/40px image into a 25.6px track. Each art image uses `max-inline-size: 100%; max-block-size: 100%; object-fit: contain` and remains wholly inside its cell.
- Found/waiting state uses at least two cues: check/cage shape plus text/status; grayscale/opacity alone is insufficient.
- Full animal names and status appear in the contextual Friends detail and screen-reader list.

#### Adventure Bag

- Derive a typed, stable `HudInventorySlot[]` view model from the level and game state.
- Always render every persistent slot declared by the current level, including missing items. The current envelope is 1–7; do not render potions/treasure as persistent slots.
- Display count as `found / total`, not `collectedObjectIds.length`.
- Stable order: weapon, Splash Boots, Spring Boots, Antidote Leaf, Red Heart Key, Yellow Sun Key, Blue Star Key, omitting absent categories.
- The Bag card is its own inline-size container. Use an explicit 3- or 4-column regime; never an inflexible grid wider than its content box.
- Use four columns so seven wraps 4+3 when cells remain readable; use three columns so seven wraps 3+3+1 in a narrower measured deck. Never reserve or infer the removed 152px rail.
- `overflow: visible` within the grid and `overflow: clip/hidden` only where decorative painting, not content, requires it. Geometry tests must prove children are contained before any ancestor clipping is allowed.
- Pair icons with short visible labels when the card is wide enough. At compact sizes, focus/tap opens a persistent detail containing full item name and found/missing status; do not rely on `title`.

#### Minimap

- `MiniMapCard` uses `grid-template-rows: max-content var(--map-size) max-content` and `block-size: max-content`.
- Starting minimum map sizes are 192px at 1280×720/ordinary TV, 160–176px at 960×540 and normal iPad/tablet, 120–144px on ordinary landscape phones, and 96px only at 568×320; always `aspect-ratio: 1`. Larger viewports should grow the map when required content already fits. Compact mode may combine the label and exploration percentage and expose the longer visual legend contextually.
- Header, square, and legend/status are adjacent. The card's block size may exceed their summed size only by its declared padding/gaps (acceptance tolerance below).
- Show actionable state: Ame/current camera, exit if discovered, guided target, rescue/item/lock landmarks where already part of gameplay, and exploration percentage. Do not add decorative markers.
- Pair marker color with shape/icon. Provide textual player position, remaining friends, exit discovery, and guided target. If map rotation is introduced by another track, default to fixed north or provide a setting.

#### Power and currency

- Power is the stronger visual signal and supports at least `0–999` without reflow.
- Gold and Science share one compact wallet cluster; each supports at least four digits.
- Changes may animate in standard mode but must retain a static outline/value transition in reduced mode.

#### Controls and utilities

- Keep board gesture and keyboard descriptions concise after first movement; full instructions live in Help.
- Frequent movement controls are 48px rendered; other direct controls are 44px rendered minimum.
- Home, Mazes, Book, Help, Sound, and Restart remain available. Primary landscape shows them in the deck; compact landscape may put secondary utilities in a `More` dialog/sheet with ≥44px rows.
- Restart preserves its armed/confirm behavior. Maze switching preserves the active-run confirmation rule.
- Tester tools never displace production navigation. Under `?debug=mazes`, expose a separate disclosure containing Pick Maze and Skip; identify tester-preview status clearly.

### 9.6 Big Maze treatment

Big Maze is a layout mode, not an absolute-positioning exception.

```text
┌────────────────────────── PlayShell ──────────────────────────┐
│ ┌──────── maximum square board ────────┐ gap ┌─ Focus deck ─┐ │
│ │                                      │     │ Level/Power  │ │
│ │               6 × 6                  │     │ Objective    │ │
│ │                                      │     │ Map/Rescue   │ │
│ │                                      │     │ Bag/controls │ │
│ └──────────────────────────────────────┘     └──────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

- Big board size is `min(available block-size, available inline-size - focus-deck - gap)`.
- It is never smaller than the corresponding Normal board. At a height-constrained viewport it may only gain a few pixels; it must still simplify chrome and use all remaining space deliberately.
- The focus deck is an explicit second grid track. It contains all Priority 0 information and a compact exit from Big mode; no minimap is absolutely placed outside the board panel.
- At 1280×720 target a 704px board and 548px deck. At 960×540 target a 512px board and 424px deck. At 1024×768, reduce the deck to 292px to permit a 704px board. At 844×390 and 568×320, the deck reuses the compact rules.
- Feedback sits either in the focus deck or in a board-bottom toast with an 8px inset and no overlap with critical controls.
- Escape exits Big Maze only when no modal or contextual surface is open. The Normal control is always a real ≥44px button.

### 9.7 Dialog and contextual-surface specification

- All modal states use one `DialogShell` rendered outside the maze transform.
- Default width: `min(560px, calc(100dvi - safe-left - safe-right - 16px))`; story may use `min(860px, ...)` when its illustration/copy needs it.
- Maximum height: `calc(100dvb - safe-top - safe-bottom - 16px)`. Use a three-row grid: sticky/max-content header, single vertical-scrolling body, sticky/max-content footer.
- Close and primary actions are at least 48px rendered. They always remain inside the visible card.
- At the smallest compact size, tester/maze lists become one column with ≥44px rows. Two 122px-wide tester cards are not retained.
- Opening moves focus to a meaningful heading or first action; Tab/Shift+Tab remain inside; Escape closes only the top layer; closing restores the invoker if it still exists.
- Story uses the same shell. It does not close on arbitrary pointer-down and preserves Tab/modified-key behavior.
- Background gameplay is `inert` and `aria-hidden`; the same centralized policy blocks keyboard, pointer, D-pad, and queued/repeating movement.
- Non-modal item/friend details may use a popover when space permits and a small sheet/dialog in compact mode. It is available on focus/tap, dismissible, and not hover-only.

## 10. React and DOM refactoring plan

`App.tsx` should remain the orchestration/controller boundary for campaign state, game state, audio, progress, navigation, and presentation timelines. It should stop being the owner of all layout markup.

### Proposed component boundaries

| Component/module | Responsibility | Inputs / constraints |
| --- | --- | --- |
| `GameScreen` | Connect App state/actions to the play surface; select normal/Big layout. | Receives immutable view model plus callbacks; no engine mutations. |
| `PlayViewport` | Safe area, orientation, actual-size observation, dialog portal host. | Replaces gameplay use of the whole transformed `.game-stage`. |
| `PlayShell` | Select layout regime and expose CSS container. | No device sniffing; dimensions only. |
| `MazeViewport` | Square board wrapper, board ref, accessible label/status references, feedback anchor. | Preserves current pointer/ref behavior and `role="application"` only if testing confirms it remains helpful. |
| `MazeScene` | Current terrain, camera world, object/sprite layers, and presentation visuals. | Extract current lines 2652–2936 without changing game rules or art. |
| `AdventureHud` | Semantic heading and ordered Priority 0/1 sections. | Layout-only; no raw level scanning in render. |
| `HudHeader` | Level, Power, currency, More. | Supports long name, 3-digit Power, 4-digit wallets. |
| `ObjectiveCard` | Full objective and Hint trigger. | Auto height; no clamp. |
| `MiniMapCard` | Existing memoized minimap plus heading/legend/text status. | Max-content; one visual minimap instance per mode. |
| `RescueTracker` | Semantic list, progress count, compact/detail representations. | 1–5 entries; all art contained. |
| `AdventureBag` | Semantic list and wrapping slot grid. | All level-declared stable slots; current 1–7 plus larger synthetic fixture; `found/total`; focus/tap detail. |
| `MovementControls` | D-pad/cross/strip presentation over existing handlers. | Does not reimplement cadence; ≥48px targets. |
| `UtilityNav` | Home, Mazes, Book, Help, Sound, Restart; responsive row/grid/More surface. | DOM order stays stable; preserves protected navigation. |
| `DialogShell` | All modal focus, inert, Escape, scroll, and restore behavior. | Replace divergent Story shell; stack-aware top-layer handling. |
| `TesterTools` | Debug-only Pick Maze/Skip controls and preview notice. | Not mounted without exact debug query. |

Suggested locations:

```text
src/ui/game/
  GameScreen.tsx
  PlayViewport.tsx
  PlayShell.tsx
  MazeViewport.tsx
  MazeScene.tsx
  AdventureHud.tsx
  ObjectiveCard.tsx
  MiniMapCard.tsx
  RescueTracker.tsx
  AdventureBag.tsx
  MovementControls.tsx
  UtilityNav.tsx
  TesterTools.tsx
  hudModel.ts
  interactionState.ts
src/ui/dialogs/
  DialogShell.tsx
  StoryDialog.tsx
```

Do not extract a component merely to move five lines. These boundaries are proposed because each owns independent content variability, semantics, geometry, or interaction behavior.

### View models

Add a pure `buildAdventureHudModel(level, game, progress, options)` returning:

- full objective and hint availability;
- `power`, gold, Science, step count, level label;
- ordered rescue entries with species/name/found status;
- ordered persistent Bag slots with type, color/shape, label, image reference, and found status;
- `bagFound`, `bagTotal`, `rescued`, `rescueTotal`;
- minimap textual status, including a guided-but-unseen target when gameplay says it has been marked;
- debug and view-mode flags.

This removes repeated object scanning from presentation components, makes the current seven-slot and future larger-roster wrapping contracts unit-testable, and prevents count semantics from drifting again.

Add a pure narrow `getCurrentInputBlock(uiState)` compatibility selector
returning only the UI-owned facts required before Plan 08 lands:

- `gameplayInputAllowed`;
- `backgroundInert`;
- `topLayer`;
- whether held keyboard/pointer/D-pad input must be cleared.

Every current movement entry point uses this temporary blocker. Plan 08 later
owns canonical `InputContext`, semantic actions, Escape/Back hierarchy, focus
return strategy and `getInteractionPolicy()` by combining UI state with gameplay
and presentation truth. No individual guard carries a private modal list.

### DOM semantics and order

- One `<main>` for gameplay; maze region and HUD receive labelled headings.
- Objective is a section with a heading, not anonymous strong text.
- Rescue and Bag are `<ul>`/`<li>` or equivalent list semantics. Status text is real text, not generated CSS content.
- Controls are native buttons with type, accessible names, pressed/expanded state where appropriate, and no positive `tabindex`.
- Utility navigation uses `<nav aria-label="Game">`.
- Visual reordering must not diverge from focus/read order. Prefer grid-area changes that retain a sensible source sequence.
- Keep the board's nearby-cell description. Reassess `role="application"` with screen-reader testing; if retained, scope it to the board only and announce available keys succinctly.
- Polite live region announces pickups, rescue, Power changes, blockers, and completion transitions, not every step.

## 11. CSS architecture and cascade consolidation

### Target structure

Replace the single chronological stylesheet with one imported style entry point and explicit layers:

```text
src/styles/
  index.css
  tokens.css
  reset.css
  viewport.css
  maze.css
  hud.css
  controls.css
  dialogs.css
  screens.css
  motion.css
```

`index.css` declares the cascade once:

```css
@layer reset, tokens, base, components, states, utilities;
```

Each file contributes to those declared layers. `main.tsx` imports `src/styles/index.css`. Component selectors should generally have one class of specificity; use `:where()` for parent context. State belongs in `data-*`, `aria-*`, or a single modifier class, not descendant selector escalation.

### Consolidation method

1. Inventory the currently effective declaration for every game selector using the captured computed styles.
2. Copy only the desired effective declarations into the new component file under the new root; do not copy historical override blocks wholesale.
3. Mount the new DOM against only the new game styles during local comparison.
4. Once a component passes geometry/visual/interaction checks, delete all legacy selectors for that component from `src/styles.css` in the same phase.
5. After title/Book/dialog migration, remove the legacy file or reduce it to no-op imports. Do not leave both implementations active.

Specific obsolete/conflicting rules to retire include:

- global V12 `.game-layout` two-column `!important` at 6153–6157;
- dashboard fixed 142/150 tracks and clipping at 6205–6212;
- 38/70/flexible detail rows at 6233;
- forced 4×40 Bag grid and slot dimensions at 6243–6246;
- forced 38/40 rescue imagery at 6237–6242;
- final V13 Objective 52px/23px-helper rail at 6713–6755;
- absolute negative-right `.big-maze-minimap` rules around 4545–4569 and 4608–4613;
- dead `.inventory-slot > span` styling;
- repeated target-size rules that are later undone by V12;
- container queries attached to the fixed `.game-stage` rather than actual play space.

### CSS constraints

- No new trailing “final fix” block.
- No `!important` in new game UI except a documented accessibility utility that cannot be expressed through layer order; target is zero.
- No fixed-height text card unless its content has a proven maximum and a resize-text test.
- No `overflow: hidden` on a semantic content container without a geometry assertion and a documented decorative purpose.
- Use `min-width: 0` / `min-height: 0` only to permit grid/flex sizing; do not combine them with hidden overflow to conceal failure.
- Use logical properties, real safe-area insets, `clamp()` for bounded spacing/type, and component container queries.
- Avoid viewport-only font sizes. Rem units plus bounded container adjustment must still respond to browser text zoom.
- The board and map use `aspect-ratio: 1`; images use `object-fit: contain` unless an art owner explicitly specifies crop behavior.
- Publish board/HUD anchor positions through refs or CSS custom properties, not duplicated magic constants.

## 12. Accessibility and interaction requirements

### Keyboard and focus

- Arrow keys and WASD move only when `gameplayInputAllowed` is true and focus is not in an editable/native control requiring those keys.
- Tab and Shift+Tab are never consumed by story or movement logic.
- Enter/Space activate native buttons once; keyboard activation of D-pad produces one move unless held behavior is deliberately and accessibly implemented.
- Focus indication uses a two-color 2–3px ring/halo that remains visible on illustrated light and dark backgrounds and is not clipped.
- Focus order follows board status → objective/hint → map/status detail → controls → utility navigation, adjusted only when a modal opens.
- Opening any dialog clears held/queued input. Closing restores its invoker or a documented fallback such as the board.
- Escape closes exactly the topmost contextual/modal surface. It never simultaneously exits Big Maze, dismisses two surfaces, or moves Ame.

### Pointer and touch

- Board retains primary-pointer-only capture, immediate first move, hold/repeat, drag steering, dead zone, hysteresis, and safe corner-assist behavior.
- Recalculate direction from the live square board rect; add tests at scales 0.592 and 1.333.
- Movement controls clean up on `pointerup`, `pointercancel`, lost capture, `blur`, visibility loss, and modal entry.
- Non-movement actions activate on release/click and allow slide-away cancellation.
- Do not apply `touch-action: none` to the entire game stage. Scope it to the active board/control surface; allow browser zoom and expected navigation behavior elsewhere. Use `touch-action: manipulation` on ordinary buttons.
- No task depends on drag alone; on-screen buttons provide the alternative.

### Text and visual communication

- Core objective/action/status copy renders at 16–18px; secondary text at least 14px; optional labels at least 12px.
- Support browser text zoom to 200%, the WCAG text-spacing override, Windows text scaling, and Tauri/WebView2 font scaling without lost content.
- Never encode rescue, item, key, objective, focus, current, or locked state using color alone. Retain the existing color/shape key language and add icon/text state.
- Verify 4.5:1 normal-text contrast and 3:1 large-text/control/focus/essential-marker contrast against the actual painted backgrounds.
- Avoid all-caps for sentences and avoid long centred body copy. Keep headings playful but status language direct.

### Reduced motion

- Keep OS `prefers-reduced-motion` support and add a persistent in-game `Motion: Full / Reduced` preference whose default follows the OS.
- Reduced mode removes HUD/card entrance slides, repeating pulse/bounce, hover/focus scale, screen shake, parallax, minimap rotation tweening, and nonessential particles.
- Use immediate value changes, static checkmarks/outlines, and restrained opacity transitions for essential feedback.
- Do not remove gameplay state, timing rules, or information; only change presentation. Coordinate JS duration constants and CSS selectors so the refactor does not leave orphaned animation rules.

### Minimap and nonvisual equivalence

- Keep the visual grid hidden from screen readers and maintain a concise textual spatial description.
- Include Ame position, discovered exit status/location, remaining rescue count, and a guided target that the blocker flow claims is marked—even if it was not otherwise revealed.
- Avoid dumping every minimap cell. The existing nearby-cell board description plus concise landmark summary is the right granularity.

## 13. Implementation phases, tests, and rollback points

Each phase is independently reviewable. No save schema or gameplay migration is required.

### Phase 0 — Characterization and fixture contract

Work:

- Preserve the current evidence set and add a documented measurement checklist.
- Add pure fixtures/view-model expectations for 1–5 friends, every current 1–7 persistent Bag count plus a larger synthetic registry, the 78-character objective, 3-digit Power, four-digit currency, debug/non-debug controls, and every modal state.
- Add an audit-only state selector or deterministic fixture harness under the exact debug query if needed; it must not ship production controls.
- Extend `stageScale.test.ts` with explicit 960×540, safe-inset subtraction, 0.592/1.333 reference cases, and characterization of the legacy behavior before changing it.

Affected files: existing tests; likely new `src/ui/game/hudModel.test.ts` fixture data; no visual CSS.

Exit tests:

- Current targeted tests remain green (audit run: 70/70 across stage scale, navigation, pointer, movement, story, and exploration).
- Fixtures prove the campaign envelope and current count mismatch.

Rollback: test-only revert; no runtime impact.

### Phase 1 — View models, semantic components, and centralized UI state

Work:

- Add `buildAdventureHudModel()`, typed `src/ui/interactionState.ts`, and the
  narrow temporary current-input blocker; do not create Plan 08's policy/types.
- Extract `GameScreen`, HUD sections, controls, and `DialogShell` while keeping legacy layout appearance for comparison.
- Move Story onto `DialogShell`.
- Route current movement blocking, held-input cleanup and background inertness
  through the narrow selector. Keep existing Escape behaviour until Plan 08
  replaces it through the canonical semantic policy.
- Correct Bag count semantics and establish stable key order.

Affected files: `src/App.tsx`, proposed `src/ui/game/*`, `src/ui/dialogs/*`; `src/navigation.ts`, `src/pointerControls.ts`, and `src/movementControls.ts` should normally remain unchanged.

Exit tests:

- Pure model tests for all content counts and values.
- Movement disallowed for every modal/contextual state, including level picker and reset.
- Opening any modal clears keyboard/pointer/D-pad repeat.
- Escape produces exactly one top-layer action.
- DOM semantics contain labelled sections/lists/nav and all current control names.

Rollback: switch `GameScreen` back to legacy render; state/view models are pure and may remain.

### Phase 2 — New CSS foundation and urgent content fixes

Work:

- Create the layered stylesheet structure and tokens.
- Establish the authored-interface token layer here rather than as a terminal
  override: Maze-native pearl/milky surfaces, luminous inner rims, material-
  coloured borders, depth, highlight, focus and typography tokens. Implement
  full, lite and static surface recipes whose hierarchy survives with
  `backdrop-filter` disabled; never require continuously animated blur.
- Build a development-only styled component rack covering panel, card, button,
  icon button, dialog, menu, toast/notice, selected, focused, disabled, warning,
  celebration and reduced/static states on representative bright/dark art.
- Implement content-driven Objective, Rescue, Bag, map, controls, and dialogs under the new component root.
- Eliminate the 4×40/136px Bag contradiction; implement 3/4-column wrapping.
- Remove objective clamps and fixed row contradiction.
- Make the minimap card max-content.
- Contain rescue art in actual tracks.
- Delete corresponding legacy rules in the same change; do not append overrides.

Affected files: `src/styles/*`, `src/styles.css`, `src/main.tsx`, extracted components.

Exit tests:

- Maze 12 and 15 display seven visible contained Bag slots at 960×540.
- All objective text is visible; all rescue art is contained.
- Map card has no flexible empty middle track.
- Shared dialog footer remains within card.
- The component rack proves the full/lite/static recipes, text/focus contrast,
  readable hierarchy and no transparent text region across representative art.
- New game selectors contain zero `!important`.

Rollback: use the separate legacy style entry/root. Do not mix old and new component rules.

### Phase 3 — Canonical normal-mode shell

Work:

- Introduce actual-size `PlayViewport`/`PlayShell` and move gameplay HUD/dialogs out of the global scale transform.
- Implement the manager-approved `primary-landscape` and `compact-landscape`
  regimes with one persistent information/control deck and measured geometry.
- Scope `touch-action: none` to the board and preserve live-rect pointer math.
- Update `stageScale.ts` to describe only legacy/title or scene-reference behavior; add a new pure layout calculation module if JavaScript is needed. Prefer CSS sizing for presentation.

Affected files: `src/App.tsx`, `src/stageScale.ts`, `src/stageScale.test.ts`, `src/ui/game/PlayViewport.tsx`, `PlayShell.tsx`, `MazeViewport.tsx`, viewport/maze/HUD CSS, `docs/ARCHITECTURE.md` when implementation ships.

Exit tests:

- Exact five-viewport Normal geometry within tolerance.
- Board stays square and cells undistorted.
- Targets meet rendered thresholds; essential text meets rendered minimum.
- 1024×768 uses its available height without retaining the old 96px stage letterbox.
- Pointer mapping and held controls remain behaviorally identical.

Rollback: restore legacy gameplay stage root. No engine or save rollback needed.

### Phase 4 — Big Maze and contextual utilities

Work:

- Replace the absolute Big minimap and hidden reserved sidebar with board + focus-deck tracks.
- Ensure Big board is never smaller than Normal at every regime.
- Implement `More`, item/friend detail, map legend, and debug-only Tester tools.
- Ensure Normal/Big transitions preserve focus, current game state, and board input.

Affected files: `GameScreen`, `PlayShell`, `AdventureHud`, `UtilityNav`,
`TesterTools`, related CSS; remove all legacy `.big-maze*` positioning rules.

Exit tests:

- Target Big geometry at all seven required viewports.
- No blank reserved right column and no off-panel minimap.
- All Priority 0 information remains visible.
- Escape hierarchy and Normal control work with every modal open/closed combination.

Rollback: disable Big-v2 layout only; Normal-v2 remains independently shippable.

### Phase 4A — art-directed interface, contextual art, Sound, and front door

Work:

- Apply the approved authored-interface recipes to the extracted shell and
  shared components. Preserve the same information topology while giving panels,
  dialogs, buttons, focus states, notices and menus the polish of the final Maze
  art family; do not imitate a named commercial game's exact layout or skin.
- Evaluate the Art Bible's rounded display/body-font candidates, confirm licence
  and redistribution, package the selected WOFF2 subsets locally with real used
  weights, retain a metric-safe fallback, and verify numerals/operators at maze,
  handheld and couch sizes. Do not fetch a remote font or synthesize weights.
- Consume Plan 03's semantic presentation-art catalogue. Add one deterministic
  resolver by usage and actual rendered physical-pixel need; in blocker dialogs,
  place the exact required item above the short copy at >=144 logical px in the
  960×540 reference layout and >=96px in compact layouts. Preserve aspect ratio,
  safe bounds and a field-art fallback. Warm only the encountered item's needed
  rendition, never the whole presentation catalogue.
- Implement the single compact, accessible Sound disclosure in the canonical
  action order and wire Mute/Unmute, Previous, Next and Shuffle solely through
  checkpoint 03M's `MusicTransportPort`. Reserve Loop unless Human-approved.
- Integrate the approved title illustration, home splash/hero and brand mark into
  distinct purposeful roles on the existing title/home route, or explicitly
  reserve an asset if a second placement adds clutter. Use responsive/focal/copy-
  safe variants without distortion or double-loading. Keep the exact “Maze so
  Puzzle” title as controlled application-rendered lettering and accessible live
  text; generated lettering remains concept evidence only.
- Make every earned Adventure Book achievement a semantic, input-parity detail
  action. Open a focused celebration surface with the correct on-demand
  presentation-scale sticker, its name and earned description; keep locked
  rewards concealed behind their established locked treatment. Provide the
  structural full/lite/static material hooks for Plan 02's bounded rainbow-
  holographic shimmer, including a beautiful non-animated reduced-motion state.
  Do not implement the separately scoped free-placement sticker book here.
- Extend the shared browser scenarios with the front door, compact Sound menu,
  and an exact-item blocker flow. Capture the styled component rack and runtime
  states at the required viewport/DPR/effects matrix, including disabled blur,
  reduced motion and static quality.

Affected files: extracted UI/front-door/dialog/Sound components, layered style
files and local font declarations/assets; typed catalogue/resolver and narrow
preload helpers/tests where Plan 03 did not already supply them; shared browser
fixtures; relevant Art/UI/Architecture/Performance documentation and allocation
ledger.

Exit tests:

- The component rack and live UI read as one authored Maze-native game system in
  full, lite and static profiles; dialog copy remains >=4.5:1 and visible focus
  remains >=3:1 on the representative background set.
- The blocker flow displays the correct large item without crop, distortion,
  blank fallback, unrelated preloads or focus/input regressions at every required
  viewport.
- Keyboard, touch and pointer can open, operate and dismiss the one Sound
  disclosure; calls match the 03M port conformance fake exactly, and stable
  focus/action semantics are exposed for Plan 08 without implementing gamepad
  polling here.
- Title/background/splash/brand selection preserves focal subjects and copy-safe
  regions, fetches only selected sources, retains exact semantic title text and
  contains no unreviewed generated lettering.
- Earned achievements open the correct large rendition without blurry thumbnail
  scaling or whole-catalogue preload; locked achievements reveal no art/content;
  pointer, touch and keyboard interaction, focus trap/return, Back/Cancel and
  reduced-motion/static presentation all pass. Plan 08 can consume the same
  semantic actions without simulated clicks.
- Local fonts work offline in Web and Tauri, use only packaged real weights,
  remain legible at 200% zoom and couch distance, and stay inside the approved
  JS/CSS/runtime-asset allocation.

Rollback: switch the authored theme, font, presentation resolver, Sound surface,
or front-door composition independently to their declared fallback; retain the
accessible structural shell and semantic title/action markup.

### Phase 5 — Accessibility, text scaling, dialog, and motion hardening

Work:

- Verify focus ring contrast/containment and logical focus order.
- Complete text resize/spacing/reflow work and meaningful non-color states.
- Add persistent motion preference and map every moved selector/JS presentation to it.
- Complete screen-reader status and guided-marker parity.
- Verify pointer cancellation and physical target sizes.

Affected files: components, dialog/control/motion CSS, preference/progress module if the motion setting persists, accessibility descriptions in `App.tsx`/view model.

Exit tests:

- Keyboard-only full route, all dialog traps/restores, 200% zoom, text-spacing override, reduced motion, and screen-reader spot checks pass.
- No game step changes behind any modal.

Rollback: accessibility changes should normally remain; motion preference can be feature-gated independently if persistence migration is problematic.

### Phase 6 — Remove legacy cascade and release hardening

Work:

- Delete old component rules and temporary layout switch.
- Remove dead CSS and obsolete comments; re-count `!important` and duplicate selectors.
- Rebaseline screenshots and update architecture/audit/release documentation with current evidence, explicitly distinguishing page overflow from nested content containment.
- Run full unit/build/audit/Tauri smoke and physical-device checks.
- Hand the accepted, clean, committed and pushed checkpoint to the root release
  manager for the roadmap's required `FP-UI1` transaction: GitHub CI, Vercel
  production deployment/smoke, versioned portable Windows build, manifest/hash/
  playtest note and GitHub pre-release assets. The UI agent does not publish or
  relabel a build itself.

Affected files: `src/styles.css` deletion/reduction, `src/styles/*`, `docs/ARCHITECTURE.md`, `docs/PROJECT_AUDIT.md`, `docs/RELEASE_CHECKLIST.md`; test/evidence files.

Exit tests:

- Full project check passes.
- New UI CSS is the only active game layout implementation.
- Viewport/state acceptance matrix is signed off in browser and Tauri.
- `FP-UI1` is either published from the exact accepted SHA or has an explicit
  red-gate blocker and retry point recorded by the root release manager.

Rollback: revert the phase before removing the development switch. Do not retain an undocumented half-legacy cascade.

## 14. Test strategy

### Dependency-free unit and structure tests

Use the existing Vitest setup for pure modules; do not add Playwright or a design system as part of this plan.

- `hudModel.test.ts`: exact current campaign slot/friend envelope plus a larger synthetic equipment registry; stable semantic slot order; found/total semantics; max objective; Power 301; currencies; debug visibility.
- `interactionState.test.ts`: every modal/context state, including the dormant `lost` case; current input blocking/clearing and background inertness. Plan 08 later owns semantic Escape/Back and complete interaction-policy tests.
- Extend `stageScale.test.ts`: explicit minimum, safe insets, legacy characterization, and new layout calculator if present.
- Extend `pointerControls.test.ts`: normalized input at 568×320 and 1280×720 equivalents; no change to dead zone, hysteresis, hazards, doors, enemies, or corner assistance.
- Keep `movementControls.test.ts` cadence values unchanged.
- Structure snapshot/server-render checks may verify headings, lists, native buttons, names, and debug omission with existing React packages. Geometry remains a real-browser responsibility.
- Add a small CSS contract check that rejects `!important` in new game style files and flags forbidden Objective/Bag clipping declarations.

### Live-browser geometry assertions

Run against `npm run dev` and `?debug=mazes`, using actual rendered bounds:

- For every slot: `slot.left >= grid.left - 1`, `slot.right <= grid.right + 1`, equivalent vertical checks, and no slot-pair overlap.
- For rescue art: image/cage rect is contained in its friend-cell rect.
- For semantic panels: `scrollWidth <= clientWidth` and `scrollHeight <= clientHeight`, except named intentional one-axis scrollers such as dialog body, tester list, Book, or a 200%-zoom HUD column.
- For Objective: no clamp/ellipsis; text element's full scroll height fits its rendered content box.
- For map: width/height differ by ≤1px; card block size is no more than header + map + legend/status + declared padding/gaps + 8px tolerance.
- For board: width/height differ by ≤1px; six computed columns/rows are equal within 0.5px; scene images do not stretch.
- For controls: assert post-transform/post-layout target rects, not logical CSS declarations.
- For Big Maze: board area is ≥ Normal area, focus deck is present, and no persistent UI rect lies outside `PlayShell`.

Save screenshots and JSON reports with commit, browser/WebView version, viewport, DPR, query, maze, state, mode, and timestamp metadata. The implementation PR may choose a repository evidence policy; this planning diff intentionally stores them externally.

### Input integration checks

- Arrow/WASD immediate move, held cadence, latest-key change, and release.
- Keyboard activation of each D-pad direction.
- Primary pointer only; press, hold, drag, recenter, release; right/middle do nothing.
- `pointercancel`, lost capture, blur, visibility loss, and modal entry stop movement.
- Open each modal with held input; game position and step count remain unchanged until close.
- Tab/Shift+Tab, Enter, Space, and Escape through Normal, Big, Story, Help, Hint, pickers, confirmation, too-strong, and completion.
- Verify focus restoration after the invoker remains mounted and the documented fallback after it does not.
- At 200% zoom and text-spacing override, repeat keyboard and close/scroll checks.

### Visual and assistive checks

- Screenshot comparison at all matrix cells below, using consistent game state.
- Keyboard-only route from title → story → game → Hint/Help → Mazes confirmation → Book → resume.
- Screen-reader spot checks in at least one Chromium/WebView environment and one browser accessibility tree inspection.
- Forced-colors/high-contrast spot check where supported.
- OS reduced motion plus explicit Full/Reduced override.
- Physical iPad and landscape phone checks remain release gates; emulation cannot prove finger ergonomics or WebView focus behavior.

## 15. Viewport and state QA matrix

### Content fixtures

| Fixture | Purpose |
| --- | --- |
| Maze 1 fresh/partial | 1 friend, 1 Bag slot, story and first-use guidance. |
| Maze 2 | Explicit 2-friend/2-slot coverage. |
| Maze 8 empty/partial/full | 3 friends, 6 slots, confirms first item-heavy wrap. |
| Maze 11 | Explicit 4-friend/6-slot coverage. |
| Maze 12 empty/partial/full | 5 friends, 7 slots, 74-character objective, blocker Hint at first and third bump. |
| Maze 14 | Second 4-friend shape with fewer Bag slots. |
| Maze 15 empty/perfect/completed | 5 friends, 7 slots, portals, portal Help, rewards. |
| Maze 16 start/late/win | 5 friends, 78-character objective, 2 slots, Power 99 and 301, normal/tester completion. |

### Required execution matrix

| Viewport | Normal mode | Big mode | Modal/context coverage | Input/a11y emphasis |
| --- | --- | --- | --- | --- |
| 1920×1080 TV | All content extremes and the catalogue integration rack | Max-content states | Story, Help, Hint, completion, More and Sound disclosure | TV-safe margins, couch legibility, focus visibility and no decorative empty tracks. |
| 1280×720 Tauri default | Mazes 1, 8, 12, 15, 16; all content extremes | Mazes 12, 15, 16 | Story, Help, Hint, blocker, too-strong, level/tester picker, switch/reset confirm, normal/tester completion, dormant loss handling | Keyboard, mouse hold/drag, full utility row, Tauri focus/inert. |
| 1194×834 iPad landscape | All content extremes | Max-content states | Story, Help, Hint, picker, completion, Sound and item/friend details | Coarse pointer, safe area, touch ergonomics and identical deck order. |
| 960×540 logical/Tauri minimum | All representative mazes and max states | Mazes 12, 15, 16 | Every modal; long Help and a synthetic 24-entry canonical campaign list | Exact minimum geometry, target sizes, no clipping, focus rings. |
| 1024×768 tablet | Mazes 1, 12, 16 | Mazes 12 and 16 | Story, Help, Hint, picker, completion | Primary landscape, no old 96px letterbox, coarse pointer, 200% text. |
| 844×390 landscape phone | Mazes 1, 8, 12, 15, 16 | Mazes 12 and 16 | Story, Help, Hint, tester, More/item detail | Compact touch targets, safe areas, board drag/cancel, focus not obscured. |
| 568×320 minimum landscape phone | Mazes 1, 8, 12, 15, 16 | Mazes 12 and 16 | Every modal/context surface in its compact form | 48px movement strip, 44/48px actions, full Objective, 7-slot wrap, one-axis reflow. |

Before Plan 09 exists, the listed current mazes provide reproducible fixtures.
Also test a synthetic 24-entry canonical campaign picker and catalogue-driven
content extremes so this UI does not bake in the current chapter or roster
count; Plan 09 will replace synthetic rows with final stable IDs.

For each viewport, repeat the most content-heavy Normal/Big cases with:

- `?debug=mazes` on and off;
- pointer fine and coarse emulation where available;
- browser text zoom 100% and 200%;
- default and WCAG text-spacing override;
- full and reduced motion;
- at least one safe-area inset simulation;
- muted and unmuted state;
- no Hint, Hint open, and guided marker state.

## 16. Measurable acceptance criteria

### Geometry and content

- **Zero clipped Bag items:** every level-declared slot is visible, contained, and non-overlapping in Normal and Big modes at all seven viewports. Maze 12/15 must show all seven current slots, and the synthetic larger registry must wrap or use one explicit bounded detail surface without loss. Grid and card have no unintended horizontal overflow.
- **Correct Bag semantics:** count reads `found / total persistent slots`; potion/treasure collection cannot increase it. Slot order is stable across levels.
- **Full objectives:** all five representative objectives, including Maze 16's 78 characters, render in full without ellipsis/clamp/overlap at base text size and remain available at 200% text resize.
- **Contained rescues:** all 1–5 friend cells and their complete art remain inside the Rescue card; found/missing is perceivable without color.
- **No empty minimap bands caused by oversized tracks:** card height follows the variable-content contract in Section 9.5; map remains square and adjacent to heading/status.
- **Zero unintended overflow or overlap:** body, PlayShell, board, HUD, and non-scroll cards satisfy `scrollWidth <= clientWidth` and `scrollHeight <= clientHeight` within 1px. Intentional scrollers are named, one-axis, keyboard usable, and visibly bounded.
- **Square undistorted tiles:** board width and height differ by ≤1px; row/column track sizes are equal within 0.5px; tile/sprite art aspect ratio is preserved.
- **Useful side space:** Normal and Big modes use one explicit right-hand deck;
  no blank grid track remains from a hidden sidebar or removed command rail.
- **Big means non-smaller:** Big board width/area is never less than Normal at
  the same viewport; final measured targets in `UI_UX_SPEC.md` are met.

### Input and accessibility

- Frequent movement, Hint, Close, and primary actions are ≥48×48 rendered CSS px; all other direct controls are ≥44×44. No control falls below the WCAG 24×24 hard floor.
- Core text renders at least 16px, secondary text at least 14px, optional labels at least 12px at every base viewport.
- Page supports 200% text resize and the WCAG text-spacing override without loss of content/function. HUD may scroll vertically at zoom; no ordinary UI requires two-dimensional scrolling.
- Every operable element is reachable and usable with keyboard alone; focus is visibly at least a 2px-equivalent contrasting perimeter and never clipped/fully obscured.
- Every dialog traps focus, closes through its documented explicit control/Escape behavior, and restores focus. Story conforms to the same contract.
- With any modal/context layer open, repeated Arrow/WASD/pointer/D-pad input changes neither `game.position` nor `game.steps`.
- One Escape event performs one action. It never closes a dialog and exits Big mode together.
- Pointer movement cadence and safe corner-assist tests remain unchanged; cancel/lost-capture/blur/visibility/modal paths clear all queued input.
- Board-only `touch-action: none` prevents play gestures from panning the page while the surrounding UI still permits expected browser zoom/accessibility behavior.
- Rescue, Bag, map, lock/key, current, and focus states never rely only on color; accessible names/status are present.
- Polite status announcements cover pickup/rescue/Power/blocker/completion and do not announce every movement tick.
- Reduced mode contains no nonessential repeating motion, shake, parallax, hover scale, or rotating/tweened map; essential state feedback remains.

### Regression and quality

- Human review of the styled component/state rack and live common-viewport
  captures confirms a cohesive Maze-native video-game interface—not an unstyled
  semantic shell or a generic dashboard with repeated rounded cards.
- Every persistent/contextual surface resolves a documented material, edge,
  ornament and state recipe. Full/lite/static modes retain hierarchy and
  identity; text/control contrast is measured against the actual composited
  background.
- The shipped locally packaged fonts have licence/source records, exact real
  weights, complete required glyph/arithmetic coverage, stable fallback and
  measured load bytes. Headings, prose, buttons and counters pass smallest-size,
  couch-distance, 200% resize and text-spacing checks without synthetic weight
  or value-width jitter that harms Power readability.
- Every blocker fixture resolves the exact semantic required item to a large
  presentation rendition and real text. Delayed/missing/decode-failed art keeps
  reserved geometry, usable actions and a correct optical fallback; no field
  rendition is enlarged into visibly soft artwork and no dialog triggers
  whole-catalogue loading.
- Blocker presentation measures at least 144 CSS px in the 960×540 reference
  stage and at least 96 CSS px in the compact proof (or the Human-reviewed final
  bands recorded in `docs/UI_UX_SPEC.md`), without crop or distortion. The shared
  browser/performance fixture proves one blocker requests only its own selected
  rendition.
- No warning/error browser logs at the full matrix.
- Normal and Big mode mount one minimap visual each, not hidden duplicates.
- Existing navigation, engine, solver, exploration, pointer, movement, story-skip, persistence, and reward tests pass.
- Tauri 1280×720 default and 960×540 minimum smoke tests pass, including focus/inert behavior in WebView2.
- New game UI CSS has zero `!important`, no duplicated historical component passes, and no dead label selectors.
- Updated documentation records current evidence and removes/qualifies obsolete “no clipping” claims.

## 17. Coordination notes and dependencies

### Art agent

- Plan 01 does not generate or redesign static art. It consumes the accepted
  Plan-03 front-door set, sticker icons, surface/type tokens and field/optical/
  presentation catalogue. If a required presentation rendition is absent, use
  the documented fallback and return the gap to Art rather than painting or
  upscaling a substitute inside UI code.
- Provide/confirm intrinsic safe bounds and intended aspect behavior for inventory items, friend/cage portraits, map markers, wallet icons, and nav art.
- Layout will use `object-fit: contain`; any exception requiring crop must be explicit.
- If compact labels need alternate pictograms, retain existing key color/shape semantics and avoid decorative-only symbols. Do not redesign sprites during this track.

### Lighting agent

- Board viewport size changes, but lighting/fog calculations must continue in global maze/camera coordinates.
- Confirm that square clipping, camera gutter, fog edge, and overlay masks remain correct at fractional rendered tile sizes.
- Do not use HUD geometry to drive lighting.

### VFX agent

- `treasureFlightStyle` in `src/App.tsx:2538–2548` currently uses hard-coded board dimensions and target x values around 735/850. Replace these with measured source/destination refs or named anchors supplied by `MazeViewport`/`HudHeader`.
- Rescue, battle, jump, portal, and door presentations remain within the scene layer; verify they are not clipped by the new board wrapper.
- Provide reduced-motion equivalents after selectors move. This plan does not change VFX art or event timing rules.

### Animation agent

- Preserve state meaning when removing or reducing motion. A static changed-value outline/check must replace any pulse that currently carries information.
- Consolidate keyframes into `motion.css`; map every animation to both OS preference and explicit setting.
- Do not use transform scale on focused/touch controls in a way that changes hit geometry or obscures adjacent content.

### Gameplay agent

- No changes to FOV size, movement cadence, engine rules, item acquisition, objective text, rescue optionality, key/door semantics, or win logic.
- Approve only the presentation-level stable key ordering and corrected `found/total persistent slots` count.
- Expose a clean item/rescue view model if ownership is shared, but keep engine state authoritative.
- Review typed UI/top-overlay state and the narrow current-input blocker; Plan 08
  later owns the centralized cross-source `getInteractionPolicy()` contract.

### Performance agent

- Preserve `MiniMap` memoization and render only the active visual instance.
- Watch 21×23 / 23×23 minimap updates for layout thrash when its card is container-sized.
- Resize observation should occur at the PlayShell and board boundaries, not per card or per tile.
- Use CSS layout for regime changes; avoid React state updates on every resize tick unless a non-CSS calculation truly needs them.
- Profile Normal/Big transition, fog/minimap reveal, and item/rescue updates in Tauri and mobile Chromium. The overhaul must not cause full maze-world remounts.

### Release/Tauri agent

- Keep current Tauri default/minimum window values unless product explicitly changes them.
- Re-run WebView2 keyboard focus, `inert`, safe-area, zoom/text scaling, and window-resize smoke tests.
- Physical iPad/phone touch and listening/feel remain explicit release gates.

## 18. Risks and mitigations

| Risk | Impact | Mitigation / gate |
| --- | --- | --- |
| Adaptive shell changes scene coordinates accidentally | Broken pointer/VFX alignment | Keep engine/global coordinates unchanged; retain live-rect pointer mapping; isolate `MazeScene`; add scale-extreme tests. |
| New CSS loads alongside legacy cascade | Another override layer and unpredictable regressions | Separate roots/style entry points during development; delete migrated legacy selectors in the same phase; final single source of truth. |
| Minimum-phone deck becomes too dense | Legibility/target regression | Use content-measured compact status cells, a 48px movement strip, contextual details/More, one bounded scroller and actual bounds assertions. |
| Big mode hides important state to maximize board | Puzzle planning worsens | Priority 0 contract is non-negotiable; use explicit focus deck; Big board may grow only as available space permits. |
| Objective/card growth steals board space | Smaller or unstable play area | Board track is fixed by regime first; HUD absorbs content and may use one-axis scroll only at zoom/extreme text settings. |
| Saved progress/preferences migration | Settings loss | Layout has no save migration. If persistent motion setting is added, use a backward-compatible optional field/default. |
| Focus behavior differs in Tauri/WebView2 | Keyboard trap or lost focus | Common DialogShell, centralized policy, WebView2 smoke at both window sizes, physical/manual gate. |
| Artwork has large transparent padding | Icons appear too small despite larger cells | Art agent supplies intrinsic/safe-bound inventory; adjust image box, not crop or distort art. |
| Hard-coded treasure/VFX anchors | Effects fly to old sidebar | Block adaptive cutover until measured anchor interface is implemented and tested. |
| Performance regression from responsive duplication | Extra 529-cell minimap work / rerenders | One active minimap, memoized view model, CSS regimes, profiler gate. |
| Historical docs create false confidence | Regression accepted because “no overflow” was checked | Rebaseline nested containment separately from document overflow and attach viewport/state metadata. |

## 19. Affected-file forecast

Expected implementation touch points, subject to keeping each phase narrow:

- `src/App.tsx`: shrink to orchestration, connect extracted game UI, typed UI state/current-input blocker, measured VFX anchors.
- `src/main.tsx`: import the new layered stylesheet entry.
- `src/stageScale.ts` and `src/stageScale.test.ts`: narrow legacy responsibility and/or add actual PlayShell layout calculation tests.
- `src/navigation.ts`: no behavior change expected; retain tests.
- `src/pointerControls.ts`: no behavior change expected; extend scale-extreme tests and update stale comments if present.
- `src/movementControls.ts`: no behavior change expected; retain cadence tests.
- `src/ui/game/*`: new play/HUD components, pure view model and typed UI interaction state.
- `src/ui/dialogs/*`: common dialog and Story integration.
- `src/styles/*`: new tokens, viewport, maze, HUD, controls, dialogs, screens, motion.
- `src/styles.css`: progressively remove migrated legacy rules, then delete or reduce to a temporary legacy import.
- Tests adjacent to the new modules plus existing navigation/pointer/movement/story/exploration coverage.
- `docs/ARCHITECTURE.md`, `docs/PROJECT_AUDIT.md`, and `docs/RELEASE_CHECKLIST.md`: update only when implementation and evidence ship.
- `src-tauri/tauri.conf.json`: no change expected; smoke against its existing 1280×720/960×540 contract.

No package dependency is required for the proposed implementation. If the team later wants a repository-owned E2E/visual runner, evaluate it as a separate dependency decision after the component/CSS architecture is stable.

## 20. Definition of done

The overhaul is complete only when:

1. the adaptive shell decision and new component/CSS architecture have replaced the legacy game cascade;
2. every measurable criterion in Section 16 passes at all seven target viewports;
3. the state matrix covers 1–5 rescues, every current 1–7 Bag count plus a larger synthetic registry, longest objective, Power 301, tester controls, every modal, Normal, and Big;
4. current input/gameplay behavior remains covered and unchanged;
5. art, lighting, VFX, animation, gameplay, performance, and Tauri dependencies have signed off on their interfaces;
6. browser, Tauri, 200% text, reduced-motion, keyboard, coarse-pointer, and physical-device evidence is recorded; and
7. no legacy override block or temporary layout switch remains.
