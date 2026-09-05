# v0.21.0 UI correction — full Human intake

Date: 2026-09-05. Source: the Human's spoken/written comparison of v0.20.1 and
v0.21.0, including fifteen supplied screenshots and the final movement/layout
clarifications. Status: **captured for implementation and retest; not accepted**.
This expands `2026-09-05-fp-ui1-initial-rejection.md`; it does not erase that result.

**Subsequent Human clarification during this correction:** removing Big/Normal
means keeping its useful extra layout space by default, not changing camera zoom.
Movement need not use mathematically constant speed: gentle acceleration is
acceptable if it feels better. The non-negotiable is equally smooth first-tap and
held travel, without an initial flash/camera jerk followed by a comparative crawl.

The Human has now authorized a correction plan, implementation, visual and motion
review, and a new verified playable build. The earlier request to stop for
discussion is superseded. The result must be a substantial improvement over both
builds, with the best existing work preserved. A wholesale return to v0.20.1 is
explicitly not the request. Root owns integration, review, checkpoint and release;
future specialist work starts in fresh tasks with current handovers.

## Evidence and authority

The observations below are Human evidence about the played builds. A screenshot
can confirm the pictured composition, scale and visible state; it cannot establish
animation timing, frame pacing, focus behavior, persistence or the cause of a jump.
The comparison builds have different progress and tester states in several images:
do not infer a lost reward or changed level roster from those differences alone.

The vision remains the warm, magical, funny, original Maze world described in
`../GAME_VISION_AND_DESIGN_SPEC.md`. Approved character identities, exact logo,
and accepted art selection remain closed. The two explicitly identified residual
Home cutout islands are a bounded new correction request, not a reopened art vote.

The rows use stable `UC-01`–`UC-61` identifiers. A completed implementation report
must link each row to the actual change and evidence, or an explicit Human
disposition. “Tests passed” alone cannot close visual quality or play-feel rows.
All rows were initially **Open**. Current implementation, exact evidence and compact differences are recorded for every row in [the root engineering audit](../reviews/2026-09-05-ui03-feedback-audit.md). Human visual/comfort acceptance remains separate.

## Traceable correction requirements

### Authored composition and visual language

| ID | Human observation and required outcome | Review evidence / existing relationship |
|---|---|---|
| UC-01 | The first Play/Exit screen puts the v0.21 logo in the center over the characters. Place the large logo and actions on the **left**, where its approved background deliberately leaves open space; preserve the right-hand character scene. | Compare screenshots 3/4 with the corrected screen at desktop, iPad and landscape phone. PT25/26; front-door approval remains closed. |
| UC-02 | Make Play and Exit large, readable and tactile, with warm attractive gradients, chunky shape and clear action hierarchy. The old buttons were easier to see and more satisfying than the small flat replacement. | Normal, hover, press, keyboard focus and touch states; optical icon and text sizes, not merely hit-box dimensions. |
| UC-03 | Home/menu must place logo, Continue, secondary actions and progress on the **left**, and the transparent cast splash on the **right**, seated on the illustration's intended path. | Screenshots 5/6; inspect image landmarks and safe crops at all landscape ratios. |
| UC-04 | Keep the newer Home's tidy grouped menu panel, but give it stronger art direction and integrate it with the correct left-hand composition. | Compare before/after without covering the path, portal or faces. Preserve Continue and progress semantics. |
| UC-05 | Retain the successful unicorn-horn correction and cutout improvements. Remove the two remaining small unwanted white islands: one in Ame's hair and one in the skeleton's arm. | Identify exact affected source/derivative and pixels visually; bounded corrected proof with source/provenance/byte accounting. Do not replace the approved splash or identities. |
| UC-06 | Rounded bold headings are promising; thin regular text and small secondary copy are not. Establish a warmer, heavier, larger readable type hierarchy for controls, body, hints, teaching copy and labels. A different font is optional, not required if the existing family can achieve the result. | Inspect real glyph size, weight, line breaks, arithmetic coverage and 200% text behavior. Couch/physical readability remains honestly pending until tested. PT25. |
| UC-07 | Approved UI icons must be large enough to recognize and enjoy. Increase their actual visible artwork, especially Book, navigation, Power/Gold/Science, Hint and Help. Do not fill space with larger invisible boxes around tiny art. | Optical bounds measured at actual display scale and DPR 1/2; compare sparse and dense states. |
| UC-08 | Replace the bland, thin, corporate-looking finish with original Maze-native warmth: colorful but disciplined gradients, inviting depth, clear hierarchy, rounded tactile controls and crafted details. | Inspect a full journey and component-state sheet. Taste references are Kirby, Mario Wonder, Mario Party Jamboree and Trails; copy no franchise assets or interface skin. PT25. |
| UC-09 | Remove the heavy uniform green/teal focus outline, including the ring around the maze and story text. Use beautiful component-appropriate, modality-aware focus that remains easy to locate with keyboard/controller. Mouse/touch should not leave a distracting keyboard ring. | Keyboard traversal, mouse→keyboard→touch changes, forced colors, focus return and board activation; selection/hover/press are distinct. PT34. |
| UC-10 | Fix off-center close X glyphs and awkward circular hover styling wherever a close button is still meaningful. | Pixel/optical centering and all interaction states; no duplicate dismissal control retained solely for framework consistency. |

### Sound and shared popup behavior

| ID | Human observation and required outcome | Review evidence / existing relationship |
|---|---|---|
| UC-11 | Preserve the useful Sound & Comfort disclosure, while restoring a convenient one-action way to mute/unmute. Do not make a basic sound toggle require navigating a settings form. | Both quick toggle and fuller settings are discoverable, semantic, touch/keyboard usable; shared sound state stays truthful. |
| UC-12 | Sound & Comfort should fit its ordinary supported landscape sizes without a marginal, unnecessary scrollbar; give its controls deliberate spacing and readable sizes. | Test actual popup at relevant browser scale and landscape widths/heights, not just one screenshot. Enlarged text remains usable. |
| UC-13 | Blocker and similar popups should read as **heavily frosted magical glass with a soft outer glow**, with quiet readable text areas. Current flat bland surfaces miss the requested material. | Bright/dark maze backgrounds; full/reduced/static and a performant no-blur fallback. Measure any backdrop-filter cost on the actual modal layer. |
| UC-14 | Simple popups with a clear acknowledgment such as “I'll go find it” should not also need an equivalent X button. Keep one obvious dismissal action; preserve Escape/back semantics and focus restoration. | Blocker, hint, Help and detail flows audited individually, not a global removal of every close action. |
| UC-15 | Blocker/acknowledgment button text and body copy are too small and thin. Scale them with the available popup space and show the exact required item at a generous, crisp size. | Real long labels, required item variants, cold/failed image delivery and smallest landscape layout. Existing large-art provenance remains valid. |

### Adventure Book and collection pleasure

| ID | Human observation and required outcome | Review evidence / existing relationship |
|---|---|---|
| UC-16 | Replace the one long combined Book page with deliberate **Mazes, Friends, Bestiary, Stats, Achievements** pages/tabs and a lovely original book metaphor. | Five discoverable labeled/icon tabs, one active page, correct keyboard semantics, retained page/card return state. Earlier UI-02/PT37 scope is now part of the corrective direction. |
| UC-17 | Friend entries should display substantially larger sprites and use less cramped density. The new layout has some merits, but cramming many tiny friends onto one screen defeats the collection. | Empty/partial/full collection; choose readable page-local scroll or pagination instead of global long-page packing. Preserve existing friend access and counts. |
| UC-18 | Selecting a friend or an encountered enemy should reveal a beautiful large, crisp canonical sprite with concise original lore/flavor and the correct identity. | HUD and Book detail consistency; selected art demand-loading; bestiary discovery comes from legitimate encounters, not catalogue loading, tester play or invented historical records. PT37 persistence contract applies. |
| UC-19 | Locked achievements should show **recognizable greyed artwork**, with earned achievements becoming colorful and inviting. Universal question marks and repeated “mystery keepsake” cards are rejected. | Locked/earned side-by-side proof, including accessible state text. Supersedes the old achievement artwork-concealment rule; does not automatically reveal undiscovered bestiary identities. |
| UC-20 | Restore/improve the appealing gradient achievement cards and generous art, avoiding narrow columns of thin text. Earned rewards should feel worth admiring. | Screenshots 11/12; earned viewer, long titles and collection grid at actual size. PT27 showcase retained. |
| UC-21 | Book heading/stat icons, Home, Resume and New Maze controls should have confident scale and tactile styling. The old large colorful navigation was easier to appreciate. | Header remains visible/useful without consuming the reading area; no overlapping buttons at compact sizes. |
| UC-22 | Preserve the useful new maze-card information and selection behavior, but improve warmth/readability and enlarge the friend art within those cards. | Current, completed, locked and preview contexts; compare screenshot 9/10 at equal progress when making behavior claims. |
| UC-23 | The Surprise/Procedural Scrapbook area should feel like an intentional part of the Book, including when empty, rather than an unstyled explanatory footer. | First visit, first recorded surprise maze and populated memories. Keep technical implementation wording out of player copy. |

### Story and victory

| ID | Human observation and required outcome | Review evidence / existing relationship |
|---|---|---|
| UC-24 | Present Sprig/Poggle and other circular story portraits as attractive circular medallions that respect the source art, not hard-edged square crops. | Intro, replay, chapter completion and victory portraits; preserve character identity and visible silhouette. |
| UC-25 | Story and Puzzle Power guidance must be comfortably readable. Keep the successful rounded bold heading direction and the removal of the redundant decorative star. | Long legitimate chapter text and teaching lines at all supported landscape sizes. |
| UC-26 | A single-turn story does not need equivalent Start Maze, Skip Story and X actions. Give it one obvious primary action; make future multi-turn advance/skip semantics coherent without redundant exits. | Single-turn and synthetic multi-turn host; all story remains skippable without a reading requirement or gameplay leakage. |
| UC-27 | Clicking/tapping the story's non-control surface should advance it. Enter should still advance after clicking its body/background; a user must not need to reselect the button. | Pointer-to-keyboard change, rapid activation, text selection and nested control handling; exactly one advance per input and no maze movement beneath it. |
| UC-28 | Retain easy story replay from gameplay, but use an icon distinct from the Adventure Book. | Story reopen/close returns to unchanged run and correct invoker. |
| UC-29 | Victory must be a joyful reward: confetti, expressive individual little friend dances, attractive composition and celebratory visual emphasis. The bland v0.21 replacement is an emotional regression. | Watch actual full/reduced/static sequences, not a single still. Preserve exact-once rewards and make reduced/static modes lovely in their own right. PT35/02. |
| UC-30 | Victory popup should **never require scrolling**, and all intended content/actions should remain visible at supported landscape sizes. Do not achieve this by making everything tiny. | Maximum friends, long story/reward copy, ordinary/preview/generated/finale, safe areas and text enlargement. Record any actual unsatisfied geometry instead of claiming a pass. PT35. |
| UC-31 | Enter should allow straightforward victory continuation even after clicking an inert part of the popup. Intentional alternative actions must still work and retain their meaning. | Normal Next behavior plus Stay/restart, optional friends/pending exit, keyboard traversal, body click and duplicate-input protection. Avoid a global Enter handler that overrides an intentionally focused alternative. |

### Gameplay composition and controls

| ID | Human observation and required outcome | Review evidence / existing relationship |
|---|---|---|
| UC-32 | Keep the cleaner, larger main maze and removal of the old redundant top/bar text. Give the maze the maximum **useful** available space while preserving readable adjacent tools. | Equal-viewport old/new comparison, square tiles, clipping and scene edges. |
| UC-33 | Remove the **Big Maze / Normal** toggle entirely. Its slight extra use of otherwise wasted layout space is simply better and should be the default. **This is not a request to change camera zoom.** | Button and obsolete presentation state removed or safely migrated; maximize useful layout space at the existing zoom, with no change to gameplay/solver rules. The separately requested future camera zoom is not cancelled. |
| UC-34 | Fix the whole maze view growing/shrinking during bumps, fights or other effects. Actor feedback must not resize the viewport or change its framing accidentally. | Trace board bounds, tile scale and camera during wall bump, combat, pickup, door and portal sequences; identify and correct the cause. |
| UC-35 | Fix the right-hand panel jumping up/down when a potion/equation or other notice appears/disappears. Reserve a stable feedback region or another stable composition. | Before/during/after multiple notice lengths and quick consecutive events; measure deck and board bounds over time. |
| UC-36 | Reclaim excessive empty space above/below the right panel and within it for meaningful content. It should feel composed across the available height rather than a tiny centered dashboard. | Sparse and maximum real-content HUD at desktop, iPad, native minimum and landscape phone. Empty space may support grouping, but must not force tiny key information. |
| UC-37 | Make the minimap visibly more generous and useful. The Human cannot see a worthwhile increase and sees room for much more. | Equal scale before/after optical map area and visibility; various maze shapes, fog/legend and maximum content. Do not enlarge a mostly empty container. |
| UC-38 | Restore a meaningful prominent Ame portrait/Power presentation, building on the old portrait's appeal while retaining a readable semantic Power icon/value. | Correct portrait, clear value, stable layout as digits change; avoid redundant competing Power blocks. |
| UC-39 | Enlarge the Power, Gold and Science art and values. They are essential family-game information, not tiny secondary dashboard badges. | Actual art/glyph bounds and long values; same currencies and banking semantics. |
| UC-40 | Enlarge rescued/waiting friend art substantially. The Human suggested roughly four or five times the currently tiny appearance where space permits. | Prove real content capacity, including existing five-friend maxima and sensible future headroom; treat the ratio as expressed scale intent, not permission to clip everything. |
| UC-41 | Enlarge Adventure Bag items substantially; the Human suggested roughly three or four times their tiny appearance where space permits. All items remain visible and recognizable. | Existing seven-item maximum plus documented future capacity; no clipping or tiny packing to accommodate invented limits. |
| UC-42 | Remove redundant ticks, circular status marks, question badges and similar overlays that obscure friends/items. Unrescued friends are greyed/caged; missing items are faded; obtained art is clear full color. | Found/missing/rescued states remain understandable without relying solely on color; accessible state text and counts retained outside the artwork. |
| UC-43 | Friend HUD detail popup currently gives a tiny sprite while equipment gets larger art. Make the friend the clear visual subject at an appropriate large optical size. | Compare friend and equipment detail side by side; correct approved rendition, no falsely claimed sharpness from upscaling a tiny asset. |
| UC-44 | Navigation and action icons such as Home, Mazes, Book, Help and Sound should be larger and beautifully presented. | Touch target and visible sprite measurements are separate; long labels, keyboard/controller focus and compact layouts. |
| UC-45 | Replace the horizontal four-arrow row with a **fat rounded directional pad**: up at top, left/right at sides, down at bottom, toward the bottom right for the iPad thumb. | Actual iPad/landscape composition and comfortable reach; high-contrast direction shapes without tiny text instructions. This advances the bounded anchored-pad portion of Plan 08. |
| UC-46 | The same pad must support tap-to-step and press/drag steering as a joystick anchored within that control. It should feel natural, predictable and responsive. | Tap, hold, drag across directions, release, dead zone, diagonal intent, lost pointer capture, blur and modal opening; same legal tile movement and reliable cancellation. |
| UC-47 | Help's “move” and “wear boots” should use distinct appropriate icons; Story and Book should not share an indistinguishable icon. | Approved catalogue audit for semantic alternatives; do not introduce unnecessary new generated art. |
| UC-48 | Enlarge the Hint question mark in the action and the useful art in the hint itself; keep the improved hint utility. | Hint launch, progressive hint content, popup dismissal and return to play without layout movement. |
| UC-49 | The two-press Restart confirmation is tentatively acceptable. Keep its clarity, cancellation and safety; it is not an instruction to add another compulsory modal. | First/second press, timeout/cancel and successful restart preserve/reset the correct data. |

### Movement, orientation and release quality

| ID | Human observation and required outcome | Review evidence / existing relationship |
|---|---|---|
| UC-50 | First/tapped movement still appears to jump, then slow down. **Every ordinary step must start smoothly**, including the first step after idle, with no initial camera snap. | Frame-by-frame first tap after idle, isolated repeated taps, first held step, camera tracking versus clamp, and input-to-motion latency. Human comfort remains a separate check. |
| UC-51 | Use a coherent comfortable travel cadence, a little faster than the current average. **Latest clarification allows gentle acceleration if it feels better**; strict constant speed is not required. A single tap and the first held step must receive the same smooth treatment, with no flash followed by a pause/comparative crawl. | Distance/time traces from first tap through long hold, interrupted hold and reversals; document the selected cadence and why. Supersedes the earlier literal constant-speed wording and treats the old tap/hold timing split as replaceable. |
| UC-52 | Preserve precise tile-based puzzle legality if it can feel visually/input-smooth; the Human is open to analog movement but has not required a replacement rules system. | Corners, narrow gaps, rapid reversals, obstacle approach and stop responsiveness; prove no wall crossing, accidental extra moves or camera drift. |
| UC-53 | Ame's pronounced up/down decorative hop now conflicts with smooth travel. Give her restrained, pleasing motion closer to the successful followers' travel animation, while retaining personality and crispness. | Full animation cycles at actual field sizes and DPR 1/2; no board/camera bounce caused by the actor's acting. |
| UC-54 | Preserve the improvements in follower travel and the partial reduction of nauseating held movement. New changes must improve the remaining flaws without reintroducing teleporting followers or jerky camera holds. | Corridor path/reversal/off-camera follower tests plus watched long-travel sequences. PT40 and MOVE-01 contract remain relevant. |
| UC-55 | Do not print tiny pre-pickup “+3”/amount text on potion, Science or other reward pickups. Rewards may be a pleasant discovery on collection; the distant tile-corner label is also visually wrong. | Inspect every reward pickup type before collection. Preserve puzzle-critical enemy/player Power and genuine gate information; this is not blanket removal of all world numbers. |
| UC-56 | Reveal pickup results through clear, attractive, stable **post-pickup** feedback, including useful arithmetic where appropriate. | Collection to HUD/wallet response remains truthful and exact-once; no unreadable floating preview or shifting HUD. |
| UC-57 | Design for **landscape**, approximately 16:9 while working well across iPad, desktop and landscape phone ratios. Portrait gameplay is not required. | Consistent information hierarchy across 1920×1080, 1280×720, 1194×834, 1024×768, 960×540, 844×390 and 568×320, with safe areas and native behavior. |
| UC-58 | Avoid arbitrary continuous morphing between unrelated portrait/landscape layouts. If portrait is ever added, it needs a separately considered mode. A clear rotate-to-landscape state is acceptable now. | Rotation leaves the run safe, cancels held input and returns to the same deliberate landscape layout; do not spend this correction on a portrait redesign. |
| UC-59 | Conduct actual visual and movement review against the supplied comparisons and named inspirations. Inspect composition, scale, motion and delight, not just screenshot counts or passing geometry assertions. | Matched progress/state comparisons, contact sheets plus watched sequences, and a row-by-row correction report. Root labels Human/physical checks as pending until performed. |
| UC-60 | Continue through a verified improved playable build, with meaningful accepted checkpoints backed up and truthful release/deployment evidence. Give the Human the correct build and concise focused playtest/feedback instructions. | Exact source/version, clean build, checksums, web deployment and native evidence; no reused v0.21.0 tag or overwritten historical binary, no claim family acceptance from automation. |
| UC-61 | Update documentation/plans/backlog as work changes contracts. Future specialists should receive fresh tasks and current bounded prompts instead of carrying stale mixed-model context forward. | Root updates vision/roadmap/owner contracts and handover, records promoted/deferred slices and open gates, and supplies the next fresh specialist prompt after preview disposition. |

## Explicit supersessions and remaining boundaries

1. **Execution:** resume root corrective work now; the discussion HOLD remains
   historical. Agent04 and later programme work still wait for the corrected UI
   checkpoint and preview disposition.
2. **Orientation:** landscape-first is decisive. The existing vision already
   permits a rotate-to-landscape interstitial; portrait layout coverage is not a
   reason to shrink the primary interface or postpone corrections.
3. **Board modes:** remove Big/Normal by making its useful extra layout space the
   default, at the existing camera zoom. PT32's future 4–7-tile camera preference
   is a separate requested feature and stays owned by its implementation plan.
4. **Achievement visibility:** greyed recognizable locked achievement art wins
   over PT27/UI-02's historical concealment clauses. Earned full admiration
   presentation remains valuable. Undiscovered bestiary secrecy is separate.
5. **Materials/focus:** strong frosted modal glass and restrained modality focus
   are required. An old blanket no-blur rule or existing green-ring snapshot is
   not immutable. Cost, contrast and accessible focus still require evidence.
6. **Cadence:** smooth first/tap/held travel and a comfortable slightly faster
   ordinary pace supersede the historical timing split. The Human subsequently
   clarified that gentle acceleration is welcome if it improves feel; constant
   speed is not mandatory. No initial flash/jerk followed by comparative crawl.
   Exact tile rules and shared cancellation remain.
7. **Scope order:** root must explicitly advance the bounded Book/focus/victory
   and anchored-pad corrections now, recording what remains for Plans 02/05/08
   and UI-02. “Scheduled later” is not a resolution to this detailed request.
8. **Art:** preserve final approvals. Only the identified Home alpha islands and
   appropriate rendition selection are newly requested here; no broad art redo.
9. **Game rules:** no authorization here adds analog collision, XP, new currencies,
   new campaign mechanics or reward farming. Earlier room/puzzle/zoom wishlists
   remain live with their existing owners and Human gates.

## Improvements specifically worth preserving

- The corrected unicorn horn and most of the Home splash extraction.
- The tidier grouped Home menu and promising rounded bold headings.
- Sound & Comfort's useful consolidated options.
- Some improved Friend/maze-card organization and the useful tester maze picker.
- A larger, cleaner main maze without the redundant former bars/text.
- The more comfortable direction of interpolated travel, and the followers'
  pleasing ordinary movement; first-step timing still needs correction.
- Useful hints, clicking HUD friends/items for details, and story replay.
- Removal of the redundant story star and the viable two-press Restart pattern.

These positives are narrow Human observations, not acceptance of the surrounding
surface or a guarantee that every state is correct.

## Screenshot inventory

All original files were supplied from `C:/Users/hellb/AppData/Local/Temp/`.
The IDs below match the attachment order. Root should archive the original
comparisons with release review evidence rather than relying on Temp durability.

| Image | File | Pictured evidence |
|---|---|---|
| 1 | `codex-clipboard-ad908893-7a7e-4b86-a1bf-9b3c1c88e79b.png` | v0.21 Rose Heart HUD: tiny art, empty panel area, horizontal arrows. |
| 2 | `codex-clipboard-8299b5fa-b913-4cba-b46e-af64edef10df.png` | v0.20 Rose Heart HUD: larger portrait/slot/navigation art; older board bars/margins. |
| 3 | `codex-clipboard-ecd793a2-8d17-4212-8c05-9e4bb561d2c4.png` | v0.20 title: left logo/actions, right cast. |
| 4 | `codex-clipboard-b36eee85-cbaf-492d-bc4f-2e9575fbeacb.png` | v0.21 title: centered logo/actions. |
| 5 | `codex-clipboard-d5beed57-b8d0-4a31-ac15-0cb400a5acdc.png` | v0.20 Home: left menu, right cast/path composition. |
| 6 | `codex-clipboard-1c679752-3634-4c16-9f1d-2e8a1df31739.png` | v0.21 Home: reversed menu/cast composition. |
| 7 | `codex-clipboard-b239afc8-6e91-40c8-b7b1-beec871a8bd9.png` | v0.20 Book: warm friend cards and large header controls. |
| 8 | `codex-clipboard-2d942205-854e-41d4-8206-8c9ac0d9a511.png` | v0.21 Book: dense small friend art. |
| 9 | `codex-clipboard-99bba14a-4a5e-4b85-8615-2d78ba7fb1fa.png` | v0.20 Book maze-record rows. |
| 10 | `codex-clipboard-d2a7eeec-fc8b-4bf4-b0f1-4f49f3914b18.png` | v0.21 maze cards and scrapbook. |
| 11 | `codex-clipboard-56f1248a-648e-4b12-a6bf-9b63a0a50d34.png` | v0.21 achievements: narrow text columns and question placeholders. |
| 12 | `codex-clipboard-331b1c7f-9a26-4494-b7ff-e78a4fd8fabb.png` | v0.20 achievements: colored earned/greyed locked art on warm cards. |
| 13 | `codex-clipboard-d8f75e43-18b9-4746-992a-f2dff1725062.png` | v0.20 victory: expressive large art/material; also a scrollbar. |
| 14 | `codex-clipboard-bd6ac9ce-e4a6-4477-805f-eb132042d1f7.png` | v0.21 tester victory: subdued composition, square storyteller portrait. |
| 15 | `codex-clipboard-34c6b0d1-b9bd-4728-aa68-17e6a20358c5.png` | v0.21 Clover: distant tiny potion +3 badge and underused HUD space. |

## Completion record required from root

The corrective report should record the reviewed source SHA, new build identity,
changed contracts, row coverage, matched screenshots and movement sequences,
behavior/performance results and exact remaining Human/physical checks. Prior
v0.21.0 automated passes remain historical engineering evidence. The new build
must earn its own visual, behavior and deployment evidence; Human/Amelia review
alone can close the final family-quality gate.
