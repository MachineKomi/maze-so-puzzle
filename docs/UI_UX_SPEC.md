# UI / UX implementation specification

## V22-PERF-01 candidate interaction and quality contract

This candidate preserves the praised Full-quality geometry, six-tile view,
approved art and 160 ms ordinary travel. It is not Human/device acceptance.
Keyboard, fixed-pad and board gestures retain live identity during successful
door/combat/rescue/portal/jump presentations, including a chained presentation.
Steering/release still update that identity; attempts remain suspended until the
whole lock ends and a fresh 160 ms cadence begins. No presentation action queue
is replayed. The newest deliberate input source takes ownership and clears older
source gestures; two adapters cannot resume competing directions. Blocker/modal, blur/hidden, resize, cancellation and level boundaries
still clear input. Every fresh missing-capability/underpowered attempt explains
the requirement once; a continuously blocked hold cannot reopen it.

Board taps remain player-relative. After the 6 CSS-pixel drag threshold, the
visible touch-down origin owns direction, with an 8-pixel neutral region and
axis hysteresis. Pointer coordinates update the guide without App commits.
The bounded perpendicular drag offset retains the existing safe corner choice;
it grants no new collision or obstacle bypass.
Control/HUD labels and images do not select/drag/call out; story/help/Book prose,
real fields, deliberate scrolling and keyboard/assistive access remain intact.

Lite is now a named scene recipe, separate from Motion Reduced and Static:

| Cost | Lite treatment | Preserved |
| --- | --- | --- |
| Ambient field-object/friend/goal motion and flourishes | Stop ambient loops and hide decorative flourishes | Engine travel, follower route/order, bounded success acting |
| Live field-image filters and ellipse blur | Remove field drop-shadows; use unfiltered radial-gradient grounding | Approved image pixels, silhouettes, numbers and semantic colours |
| Wall-depth SVG blur | Unfiltered existing depth path | Topology, offset, texture and highlight |
| Water/lava/poison decorative overlays | Hide overlays and stop their pattern animations | Base hazard textures, masks, contours and equipment rules |
| Active board-joystick backdrop blur | Remove backdrop blur | Visible anchor, arrow and immediate steering |

Full/Static art and motion recipes are unchanged. Desktop isolation supports
ambient-work reduction, not a claim that each removed filter improved frame
time on this host. Affected-iPad Full/Lite testing remains decisive. The tester
finale explicitly offers **Surprise test maze**, remains unbanked and preserves
the normal saved profile; ordinary/replay finales keep the existing generated
next-maze path.

**Latest Human-directed correction, 2026-09-05:** UI-03 supersedes the historical Big/Normal mode, concealed locked achievement artwork, horizontal arrows, thin default type and reversed Home composition below. Current implementation and review are in `plans/UI-03-fp-ui1-correction.md` and its 61-row intake. Schema 6 adds truthful guardian discovery. The earlier v0.21 engineering checkpoint was rejected by Human playtest; it is not current visual acceptance.

**v0.22.0 Human acceptance update, 2026-09-05:** the corrected desktop/iPad
visual system is a praised regression baseline, but the physical phone evidence
reopens the short-height normal-text fit claims below. At normal text the compact
gameplay deck must not require document/deck scrolling or leave the completed
board area black while core HUD controls remain below it. Preserve the existing
square board and landscape topology; solve coordinated height, minima and
optical sizing without shrinking accessible hit targets. The build-ready
`plans/V22-PERF-01-sustained-play-and-live-input.md` runs first so layout changes
do not contaminate the performance baseline. The following Sol-owned
`plans/V22-UI-01-short-height-and-reward.md` tranche must also deliver the exact Human-requested Bestiary
states, open pad chevrons, current generated dimensions, lore navigation, Book
optics, larger desktop pickup feedback and a no-scroll friend-led victory whose
celebration remains visibly alive. See the independent Astra/Sol reviews and
the reconciled ledger. Do not apply Bestiary hiding to Friends, add filler to
the stable feedback band or reopen the broadly accepted HUD/minimap design.

## Current UI-03 landscape geometry — 2026-09-05

This section supersedes the older Plan 01 geometry and phone-cell dimensions
preserved below. It describes the final source submitted for the production
integration run, **not a passed production run or Human/device acceptance**.

`PlayShell` measures the safe-area content box; `calculatePlayLayout` uses
physical CSS pixels. Primary and compact landscape share one maximized square
board on the left and one deck on the right. There is no Big/Normal switch and
no camera-zoom change. Compact applies below 600px content height or 800px
content width; emergency applies below 650px content width. Deck minimums are
480–520px primary (40% of content width clamped to that interval), 440px compact
and 352px emergency. The board uses the remaining width after the 8px gap (4px
emergency), capped by available height. Existing shell padding and safe insets
remain authoritative. Portrait presents the rotate invitation.

The deck's header, objective, fixed 48px primary feedback region and control
area consume their real content heights. The overview receives the remaining
height. `AdventureHud` owns one bounded `ResizeObserver` for this fit: it watches
the overview, header, objective, controls and both collection headings. It runs
once on attachment and then on observed geometry changes, disconnecting on
cleanup. Friend/bag count changes reattach the observer. It reads layout only
in this geometry path, writes local CSS custom properties, and never reads
layout on the movement animation clock or changes engine/save/camera state.

For primary layout, map chrome is the measured heading/legend space around the
square minimap. The map is capped by the overview's remaining height. Candidate
collection column counts are evaluated against actual equipment width, heading
heights/margins, the 16px group gap and 6px cell gaps. Cells are capped at 112px
and never fall below 48px interactive size. If the ideal map leaves cells below
64px, surplus map width is progressively traded for collection width until
64px is possible or the map floor is reached: 192px at window widths at least
1280px, otherwise 164px. Thus a dense iPad maze can have a smaller map than a
sparse one; **map enlargement is not universal**. Primary controls omit their
redundant keyboard-caption line at heights 601–800px to preserve usable art
space while keeping every control.

Compact layout keeps the 152px thumb pad anchored at the bottom right, with
48px direction buttons, Hint and More. Short landscape uses full-width labelled
Friends and Bag picture rows above the map/pad region; taller compact layouts
retain their two collection columns. Compact summaries are noninteractive
`role="img"` spans; the More surface supplies named full-size inspection actions.
The map caps itself against the remaining overview height and collection
shelf, retaining its 128px floor (96px emergency). At 568×320, the authored
352px deck leaves an approximately 204px board, or 188px with 12px safe insets.
The emergency summary strip uses 24px pictures, compact labels and text-only
Power/Gold/Science counters; its full objective remains 16px. Those deliberate
emergency differences do not reduce primary iPad/desktop art sizes. Compact
feedback uses the existing map notice instead of a separate deck notice row.

At enlarged primary text, collection fitting gives way to the bounded readable
deck overflow. Compact Objective & Hint and movement retain their existing
docked reader contract. Counter chips now retain their full intrinsic number
width, their images do not shrink, and whole chips wrap to subsequent rows;
tabular digits must not overlap the next chip. Accessible reading overflow at
200% is distinct from normal-text simultaneous visibility.

Final bounded DEV observations (`http://127.0.0.1:1422`, source before the root
production run): all 50 cases—mazes 1/8/12/15/16 at 1920×1080, 1280×720,
1194×834, 1024×768, 960×540, 844×390 and 568×320, plus 12px safe insets on the
three compact targets—had no horizontal/vertical deck overflow, no collection
rectangle overlap with the pad, uncovered compact summary corners and targets
at least 48px. No page errors were observed. Seven synthetic 200% text-spacing
cases had equal scroll/client widths for the HUD, counters, objective, friends
and bag. These are scoped geometry observations, not physical-device,
performance, whole-product visual or production-release qualification.

| Dense maze 12 viewport | Square map | Collection cell | Interpretation |
| --- | ---: | ---: | --- |
| 1920×1080 | 380px | 92px | Primary desktop |
| 1280×720 | 192px | 57px | Primary height constraint |
| 1194×834 | 164px | 62px | Primary iPad art/map tradeoff |
| 1024×768 | 164px | 54px | Primary iPad height constraint |
| 960×540 | 192px | 48px | Compact summary; same at 12px insets |
| 844×390 | 128px | 44px | Compact summary; same at 12px insets |
| 568×320 | 96px | 24px | Emergency summary; same at 12px insets |

Exact rectangles are in
`C:/Users/hellb/Documents/Maze so Puzzle/review-evidence/2026-09-05-ui03-dialogs/hud-final-geometry.json`;
text extents are in adjacent `hud-final-enlarged.json`. Actual-view screenshots
are `hud-final-1920-0.png`, `hud-final-1194-0.png`, `hud-final-844-12.png` and
`hud-final-568-12.png`. Root reviewed the 1194/1920 dense tradeoff; Human visual
and physical-device review remain pending. The integrated production result
must be recorded separately by root.

Plan 01, 2026-09-05. **Root engineering checkpoint accepted; FP-UI1 and Human/device
qualification pending.**

## Root delivery closeout — 2026-09-05

The [later root return review](reviews/2026-09-05-plan01-return-review.md)
supersedes the historical candidate-only art/allocation status below. Fourteen
equipment and fifteen earned-reward 512px renditions now have hash-bound root
technical publication approvals from unchanged approved originals. Exact
per-file and aggregate allocations are recorded separately. Root's added
reward selection keeps 256px delivery where sufficient and uses 512px only for
larger/DPR2 presentation; short-phone initial selection matches the compact CSS
breakpoint before ResizeObserver measurement. The shared browser suite verifies
all 29 identities at both representative sizes and DPRs.

Source identities and field/optical art remain unchanged. Final integrated
checks passed: 453 project / 121 art tests, production build, locked Cargo and
static performance gates. Family/device/comfort review and FP-UI1
publication remain pending; original candidate sections below are preserved
as the specialist's dated handoff evidence.

## Authority and inspected state

Initial clean main/pushed-main checkpoint: `6493110795d83bd799481e0efa5a5fd228360098`.
Execution resumed with explicit Human authority at `47bfff4ef6d2c973e7aae6d5d2ddbd646e9f2017`.
Correction resumed at authorized `09413c175c5776044e4ab5dd6eddf31804d33d34`; `git diff --name-only 47bfff4..HEAD` verified 25 changed documentation files, with no runtime HEAD change. The complete bounded review prompt and root review were read. The intervening `4f59321` / `47bfff4` commits are intentional documentation-only orchestration checkpoints. Existing implementation was preserved. No branch/reset/commit/push/version/tag/package/deployment transaction was performed.

This implements the canonical Agent 01 prompt and Plan 01 manager addendum. It consumes Gameplay, Art Bible/Ame model, Story, performance and 03M contracts. The original research plan remains intact as historical design/evidence. The updated orchestrator handover, roadmap §5.13A and PT-20260902-07 supersede older travel scheduling: **root reviews/checkpoints UI, then owns smooth actor/camera travel before FP-UI1**. Plan 01 does not implement that interpolation.

The runtime retains final Goblin/Violet Moon, all 32 authored friend placements, Rainbow-Horn Unicorn in Maze 1, Tea-Time Skeleton in Maze 2, generated roster, final Poggle/Sprig portraits, generated v06 wordmark exception and guarded transparent Home hero v04. Approved source/optical catalogue pointers, content placements, sprite frames, lighting, reward/save rules and cadence remain unchanged. The review follow-up narrowly authorizes 14 deterministic presentation candidates and current-adapter compatibility repairs; these are documented below, not described as unchanged media or full Plan 07B.

## Outcome and acceptance boundaries

The physical-CSS-pixel shell replaces uniformly scaled UI. One square board remains left; one content-sized information/control deck remains right. Seven bag slots wrap; five friends are represented without a fixed species switch; the minimap is square and content-height; Big never hides a retained track. Title, Home and Book are extracted, not collapsed. Dialogs share focus/input isolation. Earned keepsakes open semantic detail; locked art stays concealed. Story supports typed short sequences without rewriting scripts. Sound uses only MusicTransportPort.

Open mandatory gates are not waivers:

- **ART-UI-PRESENTATION:** fourteen approved-source 512 px candidates now meet measured subject size and DPR 2 delivery; root must review the actual-size/alpha proofs, approve candidates, and resolve four inherited per-file overruns. Candidate art validation remains red, not waived. Fifteen additional earned-reward DPR 2 renditions are an exact out-of-scope return.
- **BUDGET-UI01:** root approved the existing 4,500 gzip9 JS / 0 CSS / 43,795 public allowance at 09413c1. Corrected code and new presentation bytes exceed it; the separate incremental request and unchanged checker failure are in [review evidence](UI_UX_REVIEW_EVIDENCE.md).
- **PHONE-SIMULTANEITY:** corrected through 28 px noninteractive status cells and grouped 44/48 px More details, not a waiver or undersized buttons. Normal text authored cases must pass simultaneous containment/occlusion tests; 200%/extreme text uses the explicit reader/dock below.

- Human material/typography/comprehension, physical iPad/Safari, WebView2/Windows text scaling, couch/TV, gamepad and low-end qualification remain pending. Browser dimensions are not devices. Locked Cargo is not a desktop UI smoke.
- PT-27 shimmer belongs to Plan 02, controller normalization to Plan 08, two/three-turn canon to Plan 09. Static iridescent celebration hooks and accessible structure are ready.

## Information and spatial grammar

Play priority order / DOM order: chapter/name and Power/Gold/Science → full Right now objective + Hint → map adjacent to Friends then Bag → movement → utilities → meaningful feedback. Progression/rescue/key meaning never depends solely on hue; icons have live names, counts, missing/found marks and detail actions.

Primary utilities remain Home, Mazes, Book, Help, Sound, Restart, Story, Big/Normal, then tester picker when enabled. At compact-phone dimensions, one 44 px More action exposes all utilities in that same order, then labelled Bag/Friend detail actions. Hint stays directly available at 48 px. The compact visible chapter label is shortened to “Maze N of 16”; its accessible name retains Story/tester/not-saved meaning, and full level name appears in More. No automatic controller polling or new input taxonomy.

`calculatePlayLayout` consumes the safe-area content box measured by ResizeObserver. All dimensions below are CSS px, not logical pixels:

- Shell padding 8 primary / 4 compact / 24 TV≥1600×900, using max(padding, safe inset) on each side rather than adding two padding layers. PlayShell measures its content box synchronously before first paint, then observes resize.
- Grid: `var(--board-size) minmax(0,1fr)`, gap 8 (4 at emergency width <650).
- Primary minimum deck 360; compact minimum 464; emergency minimum 304.
- Compact when content height <450 or width <800.
- Square board = min(content height minus 28 Normal / 8 Big, content width minus minimum deck minus gap).
- Map: 164 primary; width ≥1200 uses min(240, floor(deck × .4)); compact 128; emergency 96. One map only, never a hidden duplicate.
- Overview: map-size + minmax(0, 1fr), align-start. Map card flex-column has 4 px gaps, heading/map/legend only; no fractional-height track.
- Primary inventory/friends: repeat(auto-fit, 44 px), 4 px gaps, increasing to 52 px in deck containers≥500. Compact: 28 px role=img spans, 2 px gaps; Bag four 28 px columns wrapping to a second row; Friends auto-fit 28 px. No compact cell is focusable/clickable. More provides the full named/status detail actions at ≥48 px. No overflow-hidden bag or ellipsis. Registry order weapon, boots, spring-boots, antidote-leaf, red/yellow/blue keys.
- Found count is persistent equipment found / level-declared persistent slots; potions and treasure do not change it. Future 12-slot fixture is presentation headroom, not new equipment.
- Full objective wraps with overflow-wrap:anywhere. Core text 1rem; secondary .875rem; optional .75rem. Root 16 px, TV 20 px.
- Normal/Big topology and focus order are identical. Width-limited tablets/phones may have equal board sizes; Big is never smaller. Removed side rails become actual deck width.
- Primary and compact authored normal-text content fits without HUD scrolling. At compact computed objective font ≥24 px or objective length>160, one labelled focusable hud-reader scrolls header/full objective/statuses, with Objective & Hint dock above and 48 px movement outside below. Focus clears held intent; native Arrow/Page/Home/End/Space scroll keys do not reach gameplay. The objective is repeated in the Hint dialog for fixed access. Primary enlarged/extreme content retains one bounded deck scroller. No two-dimensional UI scrolling.
- Portrait has a single-column emergency safeguard, not a newly qualified primary game orientation.

Measured before/after geometry and Normal/Big/safe-area tables are in [current review evidence](UI_UX_REVIEW_EVIDENCE.md), with raw rectangle/clip/occlusion JSON beside screenshots. Original 6493110 audit remains the comparison source. The old oversized map-card bands are gone: only the heading, square map and applicable legend contribute height. Compact omits visual legend/nudge, preserving the map's accessible spatial description. Width-limited Big may equal Normal; no tile is stretched.

## Component and cascade ownership

`src/App.tsx` remains the state/lifecycle orchestrator and existing transient scene producer. Extracted boundaries:

| Module | Contract |
| --- | --- |
| ui/game/PlayShell + layout | physical sizing / canonical two-column topology |
| ui/game/MazeViewport + sceneGeometry | scene host, coordinate helpers, revisioned measured anchors |
| ui/game/MazeTerrain | extracted existing SVG terrain; no topology/lighting rewrite |
| ui/game/MiniMap | topology-first revealed/remembered map |
| ui/game/hudModel + AdventureHud | typed equipment/friend view model, counters, controls and detail actions |
| ui/game/powerGuidance + usePowerGuidance | shared engine-witness iterator, 2048-state bound, deferred/cancellable 4 ms slices and exact-snapshot results |
| ui/screens/* | distinct title, Home, Book |
| ui/dialogs/DialogShell | typed standard/blocker/hint/story/celebration surfaces |
| ui/dialogs/StoryDialog | speaker/portrait/line, Next, Skip, final begin |
| ui/SoundDialog | transport snapshot/subscription, exact port commands |
| ui/art + CatalogueImage | semantic lookup, role/size/DPR rendition selection and failure boundary |
| motion + PresentationProvider | one persisted motion/quality contract |
| ui/interactionState | narrow typed screen/top-overlay blocking selector |
| ui/TabularNumber | equal advance boxes for unchanged proportional Fredoka digits |
| ui/testing/UiProofRack | DEV-only actual-component fixtures; compiled out of production |

`src/styles.css` is the sole import/layer manifest: reset → tokens → scene → shell → hud → screens → dialogs → comfort. Historical same-selector cascade passes were consolidated into the owning files, not followed with another overriding block. The scene layer retains existing world/effect recipes and clocks; CSS ownership is explicit. All new UI CSS has zero !important. `stageScale.ts` and its compatibility tests remain, but App no longer imports the fixed-stage scaler.

Surface family: pearl/cream dense-text centres, bright white inner rim, plum structural edge, shallow paper-cut depth; gold primary actions, pale lilac secondary controls, mint selected/found states, dashed missing equipment, restrained storybook edge colour. Heading/objective/control emphasis differs; not every section is a separate elevated card. Celebration adds a static pastel iridescent backing. Full uses gradients/rims/shallow shadows; lite retains opaque colour/rim and one depth edge; static retains colour/rim without moving decoration. **No backdrop-filter on the UI panels** in any tier. The inherited scene touch-joystick ring retains its 2 px blur; this is not a claim of zero blur throughout the scene. Plan 02/07B own later scene-effect/material qualification.

States: normal, hover, pressed, selected, disabled, focus, missing, found, locked and safe default are independently visible. Focus is 3 px teal with cream clearance halo; forced-colours uses system borders/Highlight. Real labels remain legible without art/motion/sound.

## Dialog / input / accessibility contract

One portal DialogShell owns heading + close, one labelled focusable body (`role=region`, `tabIndex=0`) inside the Tab trap, and non-scrolling actions. Native PageDown/PageUp/Home/End can read the body through its final paragraph before moving to the footer. Invoker is captured before the opening commit makes its parent inert, and restored after inertness clears. Width 680 (blocker 600, celebration 740), constrained to viewport minus safe padding. Close and primary/Hint/movement targets ≥48; other direct controls ≥44. Dialog footer wraps actions without hiding them; header/copy use rem, not stage scale.

Opening is a focus transaction: safe primary action or explicit initial/body control; Tab/Shift-Tab trapped; lower stacked dialog inert; Escape consumes exactly one close and does not also exit Big. Closing restores a connected invoker or a legal board/title fallback after React clears inertness. Background PlayShell/front-door/Home/Book are inert and aria-hidden while covered. Overlay entry clears held input; keyboard, pointer, touch and on-screen movement consult the same narrow block. Arrow/WASD remain usable after returning to a HUD button; native Space activates movement buttons once. Browser scrolling/zoom remains available outside movement surfaces. Existing cancel/lost-capture/blur/hidden-tab handlers and cadence are preserved.

Meaningful pickup/rescue/Power/blocker/completion announcements are polite and atomic; ordinary movement/select feedback is not live. Board coordinate description remains available on demand. Manual screen-reader speech quality is still a physical review gate.

Motion preference key: `maze-so-puzzle-presentation-v1`, separate from progress-v5 and active-run-v3. Preference system|full|reduced resolves to full|reduced. Quality full|lite|static is separate, not a third motion preference. System changes resolve through matchMedia and html data attributes before paint. Reduced/static remove nonessential animation/transition; reset leaves preferences untouched. Storage failures retain usable current-session settings and display a warning.

Sound has Mute/Unmute, Previous, Next, Shuffle and no Loop. It reads/subscribes to MusicTransportPort snapshots, invokes that port and its user-gesture start, never audio elements/history. Gameplay/menu contextual transport remains owned by the existing adapter. The narrow correction applies selected title URL even on same-context/fresh gesture, synchronizes mute on adapter replacement, and reuses createMazeMusicPicker's shuffled no-repeat maze bag across entries/returns/manual selection. Previous is disabled across its existing context boundary. Port signatures remain unchanged; music.ts is unchanged. Actual native media URL and displayed snapshot are tested; no crossfade, preload or Loop policy is added.

Earned Book detail uses correct semantic art/name/description, on-demand presentation and normal focus restoration. Locked keepsakes expose only mystery/locked copy, not hidden sticker content. No free-placement sticker book. Story turns are local presentation state, never campaign progress; Advance/Skip/Escape cannot duplicate rewards or move Ame. Existing chapters retain their single authored turn; DEV rack proves three turns.

PT-09: exact Ame Power < enemy Power remains. The exact Power equation and Required Path render immediately. A shared generator search (2048 admitted states, only on encounter) replays movePlayer and uses the existing progression signature. It excludes any state defeating the blocker and advertises only an undefeated enemy beatable at initial Power with a weapon, or an uncollected potion with a legal witness. Search-budget exhaustion means “not shown”, never “unavailable”. After two animation frames, a cancellable timer drains approximately 4 ms work slices plus one indivisible engine transition. Close, replacement encounter, game/level change and unmount cancel it; results are also identity-checked before rendering so one stale frame cannot leak. `data-search-state=pending|complete` and exhaustion metadata permit non-vacuous proof. Required Path remains available. Synchronous reference and scheduled CPU, admission/transition counts and production modal latency are separately recorded in the review evidence; state count alone is not a time guarantee. The gameplay owner should consume/review this conservative UI selector before generalizing it; no gameplay rules were added. Family ≥90% teaching-comprehension remains untested.

## Semantic art and return gate

CatalogueImage resolves semantic identity or the existing semantic URL projection, selects the smallest sufficient declared variant (approved delivery plus the explicitly root-authorized review candidates) by role and rendered size × DPR, otherwise the largest available role or correct optical fallback. One shared ResizeObserver measures actual image content boxes after initial layout; only size changes publish, with no travel-frame layout reads. The supplied displayPx is a first-render estimate, not a permanent measurement. Insufficient role resolution is exposed as data-art-resolution-sufficient=false, including under-density field/reward renditions. It preserves intrinsic aspect, contain/approved background crop, focal metadata and exposes geometry/safe-inset/visible-bounds metadata without inventing face/pivot data. Each presentation candidate carries its own measured visible bounds/visual centre; field hand sockets remain existing heldWeaponStyle contracts. Failures blacklist true currentSrc, including responsive compact candidates, then clear srcSet/sizes and try a bounded explicit source chain. Failed presentation falls back to the same identity's 64 px optical image; total failure preserves its live semantic name. No responsive candidate can keep reselecting a failed URL. Unknown/dormant/failed art must retain accessible semantic text, never another identity.

PresentationArt reserves 200×200 on primary / 128×128 on short phone before decode. Missing role: correct optical image capped at 64×64 with real name in the reserved box. Failed optical: accessible text fallback. Published story portraits (512) and explicit reward-presentation-256 profiles are reused; arbitrary prop-field-256 records are NOT relabelled as approved large art. Reward 256 supports a 200 px box at DPR 1; ≥2x full-size reward detail needs an additional approved ≥400 px rendition for pixel-density parity. This is included in the art return, not hidden by DPR tests.

Fourteen new 512 px candidates add 1,367,574 encoded bytes and 14,680,064 theoretical decoded bytes, not simultaneous residency. Removed entry-time whole-reward/Book warming; current level entry warmup remains. Importing catalogue metadata does not decode it. DEV rack demonstrates every family at 24/44/96 and cannot preload production. Contextual network evidence distinguishes already cached zero-image requests from a bounded single chosen rendition; it does not assert zero decoded memory.

Equipment source inventory: existing optical delivery remains 256×256 prop-field-256. Thirteen masters are 1254×1254 matte originals; Splash Boots is 1312×1199 native-alpha and is never chroma-keyed. The same-task `ui_presentation_candidates.py` extension reuses the approved processor, validates immutable hashes, reproduces each optical derivative byte-exactly, then prepares 512 px from the ORIGINAL rather than upscaling field art. All entries are already approved identities/sources, **not approved presentation derivatives**:

| Semantic ID | Immutable source relative to docs/source-assets/production/mgjrpg-02/ |
| --- | --- |
| `star-sword` | `batch-05-weapons/weapon-star-sword-v02-candidate-a-matte-01-generator-original.png` |
| `flower-sabre` | `batch-05-weapons/weapon-flower-sabre-v02-candidate-a-matte-01-generator-original.png` |
| `moon-wand` | `batch-05-weapons/weapon-moon-wand-v02-candidate-b-matte-01-generator-original.png` |
| `leaf-blade` | `batch-13-ui-portals-equipment/weapon-leaf-blade-v03-candidate-a-matte-01-generator-original.png` |
| `sun-mallet` | `batch-05-weapons/weapon-sun-mallet-v02-candidate-a-matte-01-generator-original.png` |
| `comet-spear` | `batch-05-weapons/weapon-comet-spear-v02-candidate-a-matte-01-generator-original.png` |
| `bubble-ring-blade` | `batch-13-ui-portals-equipment/weapon-bubble-ring-blade-v01-candidate-a-matte-01-generator-original.png` |
| `cupcake-mace` | `batch-05-weapons/weapon-cupcake-mace-v02-candidate-a-matte-01-generator-original.png` |
| `key-rose-heart` | `batch-07-locks-doors/key-rose-heart-v02-candidate-a-matte-01-generator-original.png` |
| `key-blue-star` | `batch-07-locks-doors/key-blue-star-v02-candidate-a-matte-01-generator-original.png` |
| `key-sunny-sun` | `batch-07-locks-doors/key-sunny-sun-v02-candidate-a-matte-01-generator-original.png` |
| `spring-boots` | `batch-09-item-refresh/item-spring-boots-v02-candidate-a-matte-01-generator-original.png` |
| `antidote-leaf` | `batch-09-item-refresh/item-antidote-leaf-v02-candidate-a-matte-01-generator-original.png` |
| `splash-boots` | `batch-15-chests-pickups-hazards/item-normal-boots-v02-generator-original.png` |

Exact immutable source paths/hashes/bytes, source-record IDs, optical reproduction hashes, extraction/registration/encoder settings, candidate hashes/geometry, per-file gates and byte totals are in [ui01-presentation-candidates.json](source-assets/publication/ui01-presentation-candidates.json). The 14 new records end in `-ui01-presentation-candidate-r01-source`, retain candidate approval/dormant status, and never overwrite historical approvals. All longest subjects measure 167.96875 px at 200 and 107.5 px at 128; 512 delivery is sufficient at DPR 2. Four inherited 102,400-byte ceilings fail: Bubble Ring Blade 123,658, Splash Boots 162,478, Spring Boots 182,130, Antidote Leaf 118,676. Root decides these allocations/proofs; neither source approval nor successful deterministic replay grants derivative acceptance.

Eight weapon identities are included even though each maze has one weapon slot. Keys map red→key-rose-heart, yellow→key-sunny-sun, blue→key-blue-star. No dormant Hard Leather Work Boots slot is invented. Additional 15 earned-reward source hashes and required ≥400 px/usually512 delivery are returned in [review evidence](UI_UX_REVIEW_EVIDENCE.md); 256 px at 200/DPR 2 is explicitly insufficient.

Friend/enemy detail likewise uses correct 64 px optical fallback unless explicitly published presentation exists; do not promote field resolution as art authority. The full missing-role JSON in evidence lists every family for later owner triage.

## Typography / allocation

Fredoka is the Art Bible rounded-family candidate and an already vendored, provenance-recorded source, not a remote fetch. Local deterministic packaging instantiates wdth=100 and preserves genuine wght 300–700. UI uses 400/600 (existing scene bold capped to real 700), font-synthesis:none, font-display:swap; Trebuchet MS/system-ui/sans-serif fallback. No runtime font library. Full source cmap retained, not an English-only subset that silently drops operators.

Source: `docs/source-assets/fonts/fredoka/FONT_PROVENANCE.md`, upstream Google Fonts commit `35c584ff23450c9bcdf8819706e12fcdeefe1712`, retrieved 2026-09-04; source SHA256 `2ba02e68b152868aef9ba28e24b3648c7d457fe6f25c761f2c2c53fb61a73fc8`. SIL OFL 1.1 local redistribution licence is shipped unchanged. Rebuild: `python scripts/build-ui-font.py` with fontTools 4.63.0 + Brotli; those are tooling, not package.json dependencies.

WOFF2 39,408 bytes; OFL text 4,387; total public addition **43,795 bytes**. WOFF2 SHA256 `2ee6e9db3c840d967c5fa0828878a85640d3c29ae629c9a8c71f44a0cf4470e6`. One local font request on first text use, cache by static host policy; no remote service/preload catalogue. Font can be removed independently with a fallback-theme review.

Full cmap 320 codepoints includes A–Z/a–z/0–9, punctuation and + − × ÷ = < >. **U+2264 ≤ and U+2265 ≥ are absent from Fredoka** and use the platform fallback (shown explicitly in proof); do not claim font coverage for them. Current exact Power comparison uses <. Font has no tnum feature: equal .66em digit boxes provide stable advances without substituting/mangling glyphs or falsely claiming OpenType support. Four-digit currency and three-digit Power fixtures cover wrap/spacing. Physical fallback-glyph and couch readability approval remains pending.

Root's 09413c1 decision approves `ui-plan01-physical-shell-font`: 4,500 gzip9 JS, 0 CSS, 43,795 public, without changing older allocations. The resulting ceilings are 139,018 JS / 30,227 CSS / 152,925,510 public. This is not authority for new art or corrected code above that cap.

[Current review evidence](UI_UX_REVIEW_EVIDENCE.md) contains exact raw/gzip9/Brotli/hash/source/build/public/font measurements, the 6493110 runtime-equivalent comparison build, new incremental request, rationale and rollback. The historical pre-correction candidate was 138,938 JS + 15,742 CSS gzip9 (combined 154,680), with only 43,795 new public bytes; root's approval was based on that specific reviewed evidence, not a future allowance. CSS savings cannot self-approve another budget category.

## Scene, coordinates, layers and downstream travel handoff

### Root MOVE-01 contract (supersedes the historical CSS-travel inventory below)

The reviewed UI prerequisite is372e7d9. Root's subsequent implementation uses
`useSceneTravel`/`TileTraveller` as the sole ordinary travel owner. Its frame
loop writes individual CSS `translate` on the world, player, replacement battle
actor, tagged camera anchors and stable follower nodes. Local sprite `transform`
and presentation clocks remain with their owners. The old120ms camera/player
and78ms follower positional transitions are removed.

Consumers read the ref snapshot `{position,camera,cameraEnvelope,contentSize,
followers}`. Content size excludes the board border; pointer origins add
`clientLeft/clientTop` to the event-time board rectangle. No frame loop measures
layout. Culling includes the swept pending camera envelope and new logical view;
fog eligibility remains authoritative. Treasure flight origins capture the
rendered camera once at the event; the single anchored notice clips against the
board rather than disappearing at a logical-camera boundary.

Taps112ms; held durations retain260→160ms input cadence and320ms startup pause;
remaining presentation lag≤280ms after retarget. Path corners are orthogonal.
Modal/navigation/blur/hidden/resize/unmount settles/cancels; run/portal/jump
boundaries reset. Reduced retains smooth essential travel; Static settles at
once. Followers retain stable breadcrumb slots offscreen and gather at explicit
discontinuities, hiding through jump/portal effects. Engine/save/FOV unchanged.
See `reviews/2026-09-05-move01-review.md` for exact rules, evidence and pending
Human comfort. Later04/02/05/08/07B must consume this owner, not revive the
historical CSS owner described in the original Plan01 handoff.

- Authoritative engine positions, collision, solver, fog/revealed tiles, stationary doors, goal rearm, completion receipts, saves and pointer cardinal intent remain integer GLOBAL tiles.
- `src/cameraMotion.ts::worldLayerStyle` maps tile x/y to full-level percentages. `cameraWorldStyle` sizes full world by level / camera width and offsets by -camera.left/top / camera width. These files are unchanged.
- `ui/game/sceneGeometry::cameraLayerStyle` maps actor/transient tile to viewport percentage via (point − camera origin) / camera size. `cameraNoticeStyle` adds centre/.18-tile text anchoring. These are extracted existing formulas.
- `.maze-board` is the square clipped scene/hit region. `.camera-world[data-scene-slot=world]` contains terrain and world object/follower positioning. `.player-layer[data-scene-slot=actors]` remains viewport-relative. Each battle/rescue/door/jump/portal root has effects slot metadata without an extra wrapper/transform. Feedback and viewport slots are explicit. There is not yet a new common interpolated camera clock.
- Current scene CSS still transitions camera-world/player left/top for 120 ms independently. Existing 320 ms initial hold, 260→160 ms repeat ramp, scene deadlines and presentation locks are unchanged. Root PT-07 must replace/coordinate those owners, not layer another transform on top. Plan 01 does NOT claim smooth-travel acceptance.
- Existing world children use global anchoring; future named visual regions should be inserted inside the world plane once. MiniMap is topology-first, not painted terrain or per-frame visual interpolation.
- `UI_ANCHOR_REVISION=1`: `[data-ui-anchor=power|gold|science|bag]` and `bag:weapon|boots|spring-boots|antidote-leaf|key-red|key-yellow|key-blue`. Measure current bounding rectangles at presentation trigger; never retain old 960-stage coordinates. `measuredFlight` computes board fraction start and target centre relative to shell origin. Re-measure after resize/Big; future moving-camera flights need the root's accepted presentation clock. Generic bag is fallback if a per-slot anchor is absent/offscreen.
- Plan 04 owns terrain topology, world light/shadow and named visual regions; Plan 02 owns effects/timelines/celebration shimmer; Plan 05 owns sprite frames inside actor art. All consume neutral MotionMode and quality attributes, not a second preference/provider/layer manifest.
- Plan 08 owns canonical inputContext/getInteractionPolicy, normalized gamepad/haptic/pointer source/cadence. It consumes typed UI/top overlay, stable data-focus-id/group, focusable native controls and current engine legality. It must prove parity before replacing the narrow compatibility blocker.
- Root travel comparison must cover straight holds/taps, turns/narrow gaps/reversals, edge clamp, release, pointer alignment, overlays/cancel/resize/Big/DPR 1/2 and reduced motion; compare static Maze 1 comfort. No double interpolation/transform contention or frame-loop layout work. Plan 07B requalifies the accepted root slice later, not a duplicate refactor.

## Evidence, QA matrix and handoff

The maintained [review evidence and allocation return](UI_UX_REVIEW_EVIDENCE.md) is the exact final command/result, viewport/state matrix, current source/build/hash/working-tree and proof-sheet index. The earlier 18-test `maze-ui01-reviewed-r2-20260905` and targeted Book run remain historical candidate evidence, not current acceptance. Root's default 9-timeout and single-worker 3-timeout results are preserved separately from earlier 444-pass and new correction runs. No timeout, injected resource failure, dirty-host timing or pending physical row is relabelled success.

Automated coverage is not a full Cartesian product. It includes authored 1/8/12/15/16×seven viewports×Normal/Big, phone safe areas and simultaneous vertical/occlusion checks, actual overlays at each mode/viewport, all typed variants at 200%, long keyboard reading, one–seven and future 12 slots, five friends/mixed states, all six motion/quality pairs, earned Book keyboard/touch detail, title/Home/v06 failures, current Sound/actual media, cold DPR 1/2 presentation selection, delayed decode and semantic fallback, and legal too-strong engine witnesses/deferred feedback.

Human material/child comprehension, real Safari/iPad, Tauri/WebView2/offline/OS text enlargement, low-end/retained resources, screen-reader speech, physical controller and couch-distance review remain open. Geometry is not taste/comfort/assistive-technology certification.

Rollback is selective and root-owned: preserve newer planning documents and corrected original catalogue/hero pointers. Revert reviewed UI theme/components in a scoped checkpoint, not a shared-tree reset. Font-only fallback can repay 43,795 public bytes with fallback-type review; remove the 14 candidate variant bindings to return equipment detail to 64 px optical/name fallback, then retire only those candidate files under explicit root authority. Keep approved originals. Async suggestions can be disabled while retaining exact Power/Required Path; do not restore synchronous render work. Motion's additive key is ignored by older runtime; no game/save migration is needed. Retest input, save, geometry and byte/art gates after rollback.

Root reviews corrected UI/proofs/allocation, checkpoints accepted UI, then owns MOVE-01 smooth travel before FP-UI1. This candidate did not commit, push, change versions/tags, package a distributable or publish.
