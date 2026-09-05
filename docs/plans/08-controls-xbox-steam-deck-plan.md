# Controls, Xbox Controller, and Steam Deck Plan

**Latest Human continuation override, v0.22.0 feedback, 2026-09-05:**
[V22-04/09](../reviews/2026-09-05-astra-v0220-review.md) supersede the old
door-only exception and first/third-bump explanatory policies. This is a desired
behaviour correction, **not a claim of implementation**. Preserve live held intent
through eligible successful in-maze interactions; observe steering and release
while attempts are suspended. Failed requirements explain on every fresh deliberate
attempt, never by repeatedly reopening from one continuous blocked hold. Root's
bounded pre-04 repair is now the build-ready
[V22-PERF-01](V22-PERF-01-sustained-play-and-live-input.md): Astra implements
the current keyboard/fixed-pad/board-pointer correction and Sol reviews it.
This later controller pass consumes the accepted live-intent/suspension contract
rather than rebuilding or weakening it.

**Latest Human-directed correction, 2026-09-05:** UI-03 advances the anchored bottom-right hybrid D-pad, legal tap/hold/drag input and cancellation. Big/Normal is removed permanently. PT32 remains a separate future 4–7 tile camera view preference, default 6 (two tiles closer/one farther). Preserve the new pad while implementing controllers, device hints and remaining control scope.

**Current movement/layout contract for the next fresh task:** ordinary first,
isolated-tap and repeated steps all use the shared `STEP_TRAVEL_MS = 160` in
`src/movementControls.ts`. Input commits one legal cardinal move; the existing
travel owner presents it smoothly and samples at the actual callback time,
never a future scheduled deadline. A late callback may attempt one due move,
then schedules from its actual time without catch-up. Preserve this measured
contract until root accepts a deliberate change; gentle acceleration remains a
Human-permitted option, not a reason to restore the old first-step timing split.
The board uses maximum useful layout space at the existing six-tile camera span.
There is no Normal/Big state, toggle or Back layer. PT32's future 4/5/6/7 view
preference changes framing, not the HUD layout or gameplay/reveal rules.

## 0. Manager-reviewed execution addendum

Read `docs/GAME_VISION_AND_DESIGN_SPEC.md`, `docs/plans/00-integrated-implementation-roadmap.md`, the accepted Gameplay, Art, UI/UX, Lighting, VFX and UI-02 Book/focus specs, this complete plan, and current code before implementation. Execution occurs after Plans 07A, 06, 03, root checkpoint 03M, 01, root movement checkpoint MOVE-01, 04, 02, and UI-02, and before Plan 05 animation. `UI-02-adventure-book-and-focus-polish.md` owns the bounded intervening UI return; this does not expand Agent 01's running assignment.

### Ownership and architecture amendments

- Controls owns pure input intent, input-source normalization, semantic actions, held cadence, neutral/release gates, anchored board-touch steering, the hybrid thumb-pad interaction, gamepad polling/ownership/deadzones, controller prompts, and focus navigation. MOVE-01 owns accepted camera/actor travel; Controls sends discrete cardinal attempts and never interpolates world positions or changes collision into analogue movement.
- UI owns overlay state, DialogShell/game-menu markup, stable focusable semantic IDs/groups, scroll containers, layout, and visual focus treatment. Gameplay owns legal action semantics. Controls consumes both; it does not invent a parallel modal/menu UI.
- Controls owns canonical `src/inputContext.ts`, structured `InputContext`, `InputAction`/`InputSource`, and `getInteractionPolicy()`. The policy consumes Plan 01's typed `src/ui/interactionState.ts` top-overlay/focus truth, Plan 02's presentation-busy lease, and Plan 06's gameplay-legality truth. It does not duplicate or mutate their source state. This supersedes any original wording that also assigns `getInteractionPolicy()` to UI.
- Consume Plan 01's single Sound-menu disclosure and the root-frozen
  `MusicTransportPort` landed at checkpoint 03M; do not create another audio
  panel or player. Controls defines semantic Sound actions (`open`,
  `toggle-mute`, `previous-track`, `next-track`, `shuffle-track`, and approved
  `toggle-loop`) rather than simulating clicks or inferring behavior from
  icon/text. Test them against the canonical fake and current adapter. `back`/close
  removes only that overlay and returns focus to the exact stable invoker when
  it still exists, otherwise to the screen's declared safe default.
- Entering or leaving the Sound menu clears held movement/navigation, increments the input/context generation, and requires a neutral/new edge before any action. The opening A press can only open it; it cannot also mute or change track. While the menu is topmost, every gameplay action is blocked and only Sound-menu navigation/transport/back actions are eligible. Plan 07B later replaces or extends the current adapter behind the same port and verifies contextual selection, audible transport, prefetch, fades, and failure isolation; Plan 08 proves the unchanged semantic controller contract without depending on Plan 07B landing first.
- Derive maze/tester lists from the canonical campaign order and stable campaign IDs. No controller focus graph, test, copy, or acceptance gate may assume a fixed sixteen-level campaign; newly inserted Plan-09 levels become reachable without changing controls code.
- Model context as structured state—screen, top overlay/focus scope, presentation lock, and controller status—not a flat union that loses the underlying story/dialog/victory state. A disconnect/reconnect must restore the correct underlying context.
- Make held scheduling modality-neutral after intent normalization. Keyboard, hybrid pad, anchored joystick and gamepad share cadence/neutral gates; only the explicitly retained free-board tap/steering mode receives safe corner assist.
- Consume Plan 02's presentation-busy lease and cancellation boundaries. Successful combat, rescue, stationary door, jump and same-run portal presentations suspend attempts while retaining eligible physical held intent; on completion revalidate the current source, direction, run and context before normal cadence resumes. Victory, navigation, actual modal/overlay entry, blur, hidden, disconnect, reconnect, release/cancel and level changes clear safely and require a fresh edge. No catch-up or queued replay. Failed encounters follow the fresh-deliberate-attempt explanation gate, not successful continuation.

### Programme refinement — 2026-09-05

Historical context: this paragraph was written while Agent 01 was active.
That assignment is finished; UI-03 and the latest reviewed checkpoint now
control the UI/movement baseline. Start in a fresh task and reconcile root's
accepted checkpoint on entry. Plan 07A's shared harness already exists; extend
`scripts/performance/` and its pinned ephemeral Playwright setup rather than
creating another runner, lockfile change, or approval gate for existing tooling.

The player outcome is effortless, comfortable direction: a deliberate tap is
predictable, a corridor hold does not require repeated tapping, a corner never
steals direction, and reading a menu never moves Ame. Ship the touch and digital
input repairs as P0 with controller support; do not let the long platform
research below hide `PT-20260902-08`.

Implement in this bounded order: accepted-contract audit → one semantic policy
and input-generation reset → anchored board gesture/hybrid pad → standard
gamepad adapter → complete focus journeys → hardware qualification. Reuse
UI-owned menu, restart, completion and achievement-detail surfaces. Missing
mandatory UI contracts return to their owner with an exact gap; Controls does
not grow a parallel interface. Haptics stays optional and cannot postpone P0.

**Successful-interaction continuation.** Keep physical input identity separate
from the repeat timer and presentation lock. Observe releases, cancellation and
steering throughout successful combat/rescue/door/jump/portal presentations.
After all eligible presentation locks complete, revalidate live source generation,
current direction, level/run and gameplay context, then permit at most one normal
due attempt, scheduled from current time without catch-up. A changed direction
uses current intent, never the old stored direction. Taps are not continued.
Release/cancel, source loss, blur, hidden, actual modal/navigation/victory,
disconnect/reconnect and level change invalidate continuation. Chained effects
must finish with successful same-run eligibility; no intermediate unlock dispatch.
The stationary door still commits `moved: false` and keeps Ame visible at origin
throughout; continuation is a later legal attempt, never an opening replay.
Blocked requirements instead require a fresh deliberate attempt before another
explanation; dismissing a modal while the old gesture is held must not flood it.
Test all input adapters, steering/release during each effect, cancellation and
focus/context transitions. There is no generic queued movement.

**MOVE-01 compatibility.** Polling and gesture code own intent, the engine owns
integer grid results, and the accepted travel owner owns displayed actor/camera
coordinates. Do not restart an accepted travel tween on unchanged input, wait
for drawing/decoding to authorize a legal action, create a second follow clock,
or alter held cadence to hide frame stalls. Test input-to-attempt,
attempt-to-first-visible-travel and endpoint separately. Use the accepted scene
coordinate snapshot for board hit testing; raw pointer input must not repeatedly
measure layout or read a CSS transform back as gameplay truth.

**Completion and Book.** Consume 03M's recoverable pending exit choice: Stay
here / Next maze / Restart, with Stay default when friends remain and Next
otherwise. B performs the documented safe Stay action, never banks rewards or
silently returns Home. Only explicit Next crosses the durable completion
boundary. Any additional post-commit Home action must already be authorized by
Gameplay. Earned-achievement detail opens from its stable Book item and B closes
only the viewer; locked rewards remain concealed. Compact story dialogue uses
the accepted advance/skip/replay actions, not an unrestricted any-key handler.

**Acceptance packet.** Return a requirement-to-evidence map for touch, direct
cardinals, successful-interaction continuation, MOVE-01 parity, all current UI journeys, polling
cost and lifecycle. Record hardware rows as passed, failed, or pending with a
reproducible checklist. Shared-app implementation may be accepted with explicit
unavailable hardware rows; a Steam Deck/TV/controller-audio support claim cannot.
Root owns commit/push, versioning and public preview/deployment transactions.

### Final Book, victory and focus consumer — 2026-09-05 wishlist

Read `UI-02-adventure-book-and-focus-polish.md` and the accepted implementation
report for `PT-20260905-34`, `35` and `37`. UI-02 runs after 02 and before this
plan so Controls qualifies the actual final interaction surfaces. UI-02 owns
Book/victory composition and visual focus; Plan 02 owns celebration recipes;
this plan owns semantic input and modality truth. Do not build another Book,
reintroduce the old combined long page or recreate a completion dialog here.

- Navigate all five Book tabs — Mazes, Friends, Bestiary, Stats, Achievements —
  using their accepted native semantic actions and stable IDs. Keep current tab,
  focused entry and page-local reading position through detail/Sound overlays.
  Native keyboard tab behaviour and controller navigation must agree on which
  panel is active; inactive panels never enter the focus graph.
- Every discovered guardian and available friend card is controller-operable.
  B closes the card and returns to its exact stable entry; if that entry has
  disappeared, use the accepted page fallback. A later B leaves the Book through
  the documented route. Undiscovered identities and locked achievements remain
  concealed; focus discovery must not expose hidden card names or art.
- Page-local Book reading uses the accepted bounded scroller or pagination.
  Tab navigation, reading and card dismissal never issue maze movement. Reset
  remains a separate protected action, and browsing never changes encounter,
  currency, reward or campaign truth.
- Consume UI-02's component-specific focus attributes/tokens. Programmatic
  controller focus is explicit and couch-visible; pointer/touch does not leave
  the same persistent board-navigation ring. Switching source updates treatment
  without losing focus or activating/moving anything. Preserve keyboard focus,
  forced-colours and actual-surface contrast rather than replacing the ring with
  a faint decorative glow. No second modality detector is introduced.
- Qualify UI-02's no-scroll completion composition, exact Stay/Next defaults and
  safe B behaviour with all available controls visible. Controller scrolling
  cannot conceal an unresolved victory layout defect. Plan 02/05 dance playback
  neither steals focus nor commits the pending completion transaction.
- Extend the shared controller-only journey with empty/partial/full Book states,
  open-card disconnect/reconnect, layered Sound, input-source switching,
  maximum rewards and dense completion. Keep physical rows honestly pending.

Plan 09 later completes the final roster, lore and 24-chapter data. Its root
acceptance must repeat tab/card navigation, discovery/reset and return-focus
journeys using those exact data, including longest copy and an encounter earned
during ordinary play. It consumes these interfaces without hard-coded roster
counts or another input system. Plan 10 additionally proves the Garden
completion destination without displacing Stay/Next/Restart or their defaults.

### Human-authorized future camera preference — 2026-09-05

`PT-20260905-32` adds a bounded implementation tranche to this plan. It does not
extend Agent 01 or root MOVE-01, and is excluded from FP-UI1. Read the exact
intake `../playtests/2026-09-05-adjustable-camera-zoom.md` and backlog card.

**Outcome and controls.** Support camera spans from 4 through 7 tiles with
default 6 along each side of the current square camera. The endpoints and default
are Human-requested; one-tile steps including 5 are the adopted UX proposal.
The offsets are total span changes, not per-edge changes. Put one compact
Camera view row in the accepted game menu: Zoom in, Default and Zoom out, with
the current descriptive selection, disabled limit actions and stable focus IDs.
Keep the rest of the UI at its established size. Keyboard, pointer/touch and
controller use the same actions; no pinch, chord, extra HUD cluster or new
overlay is required. Fresh/invalid preferences select Default.

**Ownership and truth.** Controls owns selection and a validated local display
preference; the accepted MOVE-01 owner consumes its span through the scene
geometry contract. Do not create another travel loop or give gamepad polling
camera-transform ownership. `src/game/exploration.ts` currently shares an
optional size across camera and reveal helpers: separate display framing from
discovery at the call boundary. Preserve existing reveal rules and saved
exploration; a wider camera may include still-concealed tiles. Prove known map
terrain and objects beyond the default crop are visible at Wide, rather than
simply adding blank borders. Zooming never
calls a larger reveal window, changes collision/cadence or updates rewards.
Wider discovery requires a separate explicit gameplay decision.

**Geometry and lifecycle.** Retain the current stable odd/even centring policy,
clamp to world edges and small/narrow maps, keep Ame visible and preserve tile
and sprite aspect ratio. Document effective dimensions when either map axis
is smaller than the selected span, without overwriting the stored choice.
Preserve UI-03's single maximized board and deliberate landscape regimes;
changing device aspect must not stretch tiles or create a device-specific rule set.
Resize/camera selection updates bounds, fog, culling gutters, lighting/effect
anchors and pointer geometry as one scene snapshot. The menu already blocks
movement: changing or leaving it clears holds and requires the accepted new
edge. Never move the player, replay an event or let the selection hit the board.
Reduced motion changes the view without a zoom tween. Any full-motion change
uses the accepted camera owner's bounded recipe and is checked for comfort.

**Preference and cost.** Store an enum separately from campaign progress and
retain it through restart/Reset Progress. Missing, invalid or unwritable
storage falls back safely; no progress-schema migration or cross-host sync is
implied. Measure all four spans with the existing harness before acceptance:
Wide increases visible content while Close increases consumer pixel size. Use
the existing semantic rendition resolver and bounded loading; do not preload
the catalogue or regenerate approved art automatically. Return any exact
rendition/budget gap to its owner. Plan 07B requalifies the integrated geometry,
effects, motion and decoded/paint costs against the accepted travel baseline.

**Execution and proof.** In Phase 0 freeze camera/reveal fixtures; after the
semantic input and UI-menu integration in Phase 3, implement one 4/5/6/7 canary
and then extend to the common viewport matrix. Test edges, narrow/tiny maps,
travel interruption, portal/jump, fog boundaries, maximized landscape, resize, restart,
resume, storage failure and safe return to gameplay. The same committed route
must retain identical legal moves, rewards and reveal history across zoom
choices. Add keyboard/touch/mock-controller selection journeys and compare
pointer hit positions after every change; hardware and family comfort rows
remain honestly pending until exercised. Publish the span/preference API and
proof in `docs/CONTROLS_AND_STEAM_DECK.md` for Plan 07B and later content owners.

### Product and platform amendments

- Xbox-controller-only completion after launch is a primary requirement, including title, story, all gameplay, Hint, Help, Book, scrolling, menus, confirmations, victory, replay, and return.
- TV, desktop, and iPad/tablet use the same logical focus order, commands, prompts, and region order. Phone may compact presentation but retains every essential action. Geometric focus discovery is a fallback and must not create different logical navigation on primary devices.
- P0 is shared web/Tauri controller support plus a tested Steam Deck launch/setup guide. Hosted Chromium/PWA and Linux Tauri remain delivery choices; this plan does not automatically authorize a service worker, Linux release pipeline, Steamworks, or Proton claim.
- A controller-only TV route is not called fully qualified if browser activation leaves it permanently silent. Real hardware must prove audio after controller-only launch, document an honest one-time setup gesture, or leave the gate pending for a separately approved native route.
- Do not claim Steam Deck, Bluetooth, USB, haptics, or couch-distance success without physical evidence. Provide a precise user-run checklist and keep unrun rows explicitly unverified.
- Keep haptics P1 until core navigation/movement and semantic VFX events pass. Preferences for motion, haptics, input mode, and similar accessibility choices remain separate from campaign progress and survive Reset Progress.
- Expand the test matrix to 40/60/90Hz, Xbox USB/Bluetooth, two pads, active-pad disconnect/reconnect, `mapping === ""`, Steam overlay focus loss, 1280×800 Deck, 1920×1080 TV, and input-to-visible-step latency.

### Documentation and completion

Create and maintain `docs/CONTROLS_AND_STEAM_DECK.md`. Update README controls/setup, architecture input contracts, preference/accessibility behavior, project audit, and release checklist only with proven implementation/hardware status. Repair stale generic release-checklist assumptions as part of the owned documentation update rather than extending contradictions.

Completion requires controller-only deterministic coverage for every app surface, no regression to keyboard/pointer/touch/on-screen controls, stable A/B/Menu/View behavior, visible couch focus, safe destructive actions, modality-neutral cadence, no idle App renders, honest audio/hardware qualification, and full web/Tauri project gates.

**Status:** implementation-ready planning and research only; no controller code is implemented by this document<br>
**Prepared:** 2026-09-02<br>
**Primary scenario:** the game is already open on a television through a Steam Deck, and the player completes every flow with a wired or Bluetooth Xbox controller<br>
**Repository snapshot inspected:** branch **main**, commit **c6b6628b6e651d18161a4d1302935d3096f665c6**<br>
**Initial working tree:** clean; **git status --short** returned no entries before concurrent planning files appeared

## 1. Decision summary

Controller support should be implemented once in the shared React application against the standard browser Gamepad API. It must feed semantic actions into one canonical input-context layer; Gamepad polling, Xbox indices, focus movement, and modal safety must not be scattered through **App.tsx**.

The primary Steam Deck delivery route is:

1. deploy the shared web build at a stable HTTPS origin;
2. qualify Chrome Stable Flatpak first, with Edge Flatpak as a documented alternate Chromium host;
3. add a dedicated browser or installed-PWA launcher to Steam as a non-Steam game;
4. select Steam Input's plain **Gamepad** template, not mouse/keyboard emulation; and
5. launch and play in SteamOS Gaming Mode.

The current project is a hosted web app, not yet a complete installable/offline PWA: there is no web manifest or service worker. PWA installation and offline caching are a separate packaging increment, not a prerequisite for the shared controller implementation. Microsoft's documented Edge-on-Deck setup proves the browser-shortcut pattern and the need to expose controller devices to a Flatpak, while Valve documents that Chromium websites can receive Deck controls [R18][R19].

The one supported fallback candidate is an x86_64 Linux Tauri 2 AppImage, but only after a dedicated Steam Deck/WebKitGTK hardware gate. Tauri uses WebView2 on Windows and WebKitGTK on Linux, so a passing Windows build says nothing about the Linux Gamepad path [R12]. The current Windows NSIS executable through Proton is exploratory only and must not be advertised as a release route: WebView2 does not support Linux/Wine, Microsoft's open Proton/Wine request remains low-priority, and current Wine reports show WebView2 compositor failures [R26][R27].

Core controller work has no new runtime dependency, no Steamworks dependency, no native Tauri plugin, and no progress-schema migration.

## 2. Problem, goals, and non-goals

### Problem

The application has good keyboard, pointer, touch, and on-screen direction inputs, but no gamepad source, controller focus model, Xbox prompts, or disconnect lifecycle. Every non-gameplay flow currently depends on pointer activation or native keyboard focus. A player launching on a television through Steam Deck therefore becomes blocked at the title screen even when Steam and the browser can see the Xbox controller.

### P0 goals

- Complete 100% of the title, story, maze, Book, modal, feedback, victory, replay, and return journeys with an Xbox controller after the app has opened.
- Make a D-pad or left-stick tap cause exactly one cardinal action; make a hold use the existing shared gameplay cadence without drift, diagonal leakage, or burst catch-up.
- Give every controller-reachable control a persistent, high-contrast, couch-visible focus treatment and an accurate prompt.
- Recover safely from focus loss, visibility loss, controller disconnect/reconnect, controller ownership changes, modal changes, navigation, and presentation locks.
- Preserve keyboard, pointer, touch, on-screen buttons, audio failure isolation, save integrity, reduced-motion behavior, and all engine rules.
- Add deterministic unit and browser-boundary coverage; gate all platform claims on real Xbox-controller/Steam Deck hardware.

### P1 goals

- Implement the Human-authorized 4–7 camera framing range, default 6, from
  `PT-20260905-32`, preserving MOVE-01 and existing exploration rules.
- Add feature-detected, user-adjustable haptics with a complete no-haptics path.
- Reuse the mandatory existing browser harness for deeper device-boundary coverage; no second test framework is needed.
- Explore installable/offline PWA packaging only after a separate Human scope decision; it is not an implied deliverable here.

### Non-goals

- Do not emulate keyboard or mouse events as the primary controller architecture. Steam Input should expose a gamepad, and React should consume the Gamepad API.
- Do not change maze rules, difficulty, rewards, collision, save semantics, or presentation design.
- Do not build a general remapping UI in v1. The semantic-action boundary must permit future remapping, and Steam Input remains an external accessibility fallback.
- Do not guess arbitrary non-standard controller layouts. V1 supports **mapping === "standard"** plus an explicit adapter registry for individually qualified exceptions.
- Do not make the Linux Tauri package, PWA/offline work, Steamworks integration, or Proton support part of the core controller pull request.
- Do not require haptics, audio, hover, simultaneous button chords, rapid presses, or long holds for any essential action.

### User stories

- As a couch player, I can expose or reconnect my Xbox controller, see that it is active, and start or continue without touching the Deck.
- As a player in a maze, I can tap or hold the D-pad/stick and always predict the one cardinal direction Ame will take.
- As a player reading a story, Help, rewards, or the Adventure Book, I can advance, scroll, go back, and return to play without a pointer.
- As a player facing a warning or destructive confirmation, an opening press cannot also confirm the new surface.
- As a player who switches between controller, keyboard, touch, and mouse, the current prompts and focus recover without changing game state.
- As a player whose controller sleeps or disconnects, movement stops immediately and a replacement/reconnected standard controller can safely resume.

## 3. Historical 2026-09-02 evidence and audit record

Sections 3–5 retain the research snapshot for comparison. Source-line references,
old UI inventories and then-missing infrastructure describe `c6b6628`, not the
accepted implementation at execution. Current source and the manager addendum
supersede them; resolved defects are regression fixtures, not rebuild tasks.

### Repository and test evidence

- Initial inspection: **main** at **c6b6628b6e651d18161a4d1302935d3096f665c6**, clean working tree.
- No **AGENTS.md** was present.
- A read-only focused baseline run passed 59/59 tests in **movementControls.test.ts**, **pointerControls.test.ts**, **navigation.test.ts**, and **stageScale.test.ts**.
- The repository has React 19, Vite 8, TypeScript 7, and Vitest 4. It does not currently install Playwright, Vitest Browser Mode, jsdom, happy-dom, or Testing Library.
- The requested skill search found the exact trusted OpenAI-curated **playwright** skill. It was installed at user scope under the Codex skill directory, outside this repository. The documented experimental catalog path was unavailable. The installed skill becomes usable in a later turn; it is not a package dependency and changed no repository file.

### In-app browser audit

This is the historical pre-UI-03 audit. Its Normal/Big observations and old
screen geometry document the comparison build, not controls to recreate.

The unmodified Vite app was inspected with the requested in-app browser at 1920×1080 and 1280×720, using fresh origins to avoid depending on existing saved state. DOM/ARIA state, initial focus, focus restoration, keyboard activation, Escape behavior, long-surface scrolling, maze movement, and all reachable state transitions were checked.

Observed states included:

- fresh and continuing title screens;
- normal and tester maze pickers;
- first-entry and next-chapter story cards;
- normal and Big Maze gameplay;
- keyboard one-square movement and pickup feedback;
- Hint and Help;
- Adventure Book;
- protected maze-switch and reset-progress confirmations;
- two-step Restart state;
- missing-weapon and too-strong-enemy dialogs;
- normal and tester victory, rewards, replay, and next-maze flow.

At 1280×720, Help measured 476px client height against 516px content height; its final action sits below the initial viewport. The Book measured 455px client height against 1,656px content height. Controller scrolling is therefore a P0 requirement. At 1920×1080 the title's focused primary action was visually strong, while Big Maze removed the utility sidebar and exposed the known unused/right-track layout problem owned by the UI plan.

## 4. Current control-system architecture

~~~text
Keyboard keydown/up ─┐
Board pointer steer ─┼─> App.tsx modality-specific held timers ─> attemptMove()
On-screen arrows ────┘                                      │
                                                           ├─> resolvePointerMoveDirection()
                                                           ├─> movePlayer(level, state, direction)
                                                           ├─> presentation locks / queuedMove
                                                           ├─> feedback + audio
                                                           └─> session/progress writes

Title / Book / native buttons ─> React onClick handlers
Generic Modal ─> first-control focus + Tab trap + Escape + focus restore
StoryInterlude ─> separate autoFocus + any-key / pointer dismissal

Gamepad ─> no source, no polling, no normalization, no action mapping
Controller focus/prompts/reconnect/haptics ─> absent
~~~

| Current boundary | Evidence and implication |
|---|---|
| **src/main.tsx:1-15** | StrictMode mounts a single App. Any polling hook must have idempotent setup and cleanup. |
| **src/App.tsx:1086-3350** | App owns screen state, modal booleans, every input source, focus, navigation, audio calls, presentation locks, and most markup. It is the integration point, not the right place for raw Gamepad parsing. |
| **AppScreen**, **src/App.tsx:219** | Only **title**, **game**, and **achievements** are first-class screens. Modals and presentations are independent booleans, causing fragmented input gates. |
| Input refs, **src/App.tsx:1150-1168** | Board focus, lock/queue, keyboard hold, on-screen hold, and board-pointer hold are separate mutable systems. |
| **src/movementControls.ts:9-63** | Historical audit: immediate edge, 320ms delay and 260ms-to-160ms repeat curve. UI-03 supersedes these timings with shared 160ms ordinary first/repeated steps and actual-callback sampling; consume current exports, never copy the historical values. |
| Keyboard effect, **src/App.tsx:1980-2078** | Arrow/WASD edges move immediately; browser repeat is ignored; most-recent held key wins; release falls back to the previous held key. Blur/hidden clears. Native Tab/Enter/Space handle UI. |
| Pointer steering, **src/App.tsx:2096-2223** | Pointer intent is relative to Ame, steps immediately on press/direction change, and then uses shared cadence. |
| On-screen directions, **src/App.tsx:2225-2261** | Pointer capture/hold uses shared cadence. Keyboard-generated button click steps once. |
| **src/pointerControls.ts:25-169** | Pointer intent has a 0.34-tile deadzone, dominant-axis resolution, horizontal exact-diagonal tie-break, 20% prior-axis hysteresis, and a one-tile wall-only corner assist. |
| **attemptMove**, **src/App.tsx:1685-1970** | This is the gameplay action seam. It calls immutable **movePlayer**, handles feedback, persistence, and presentations, but currently applies the pointer resolver without an input-source distinction. |
| **src/game/engine.ts:98-390** | One cardinal attempt per call. Combat can resolve without movement; straight hole jumping is one game action. The engine needs no controller concepts or changes. |
| **clearHeldInput**, **src/App.tsx:1359-1392** | Clears current input systems, but calls are distributed and not derived from one context transition. |
| Focus effects, **src/App.tsx:1637-1644** | Screen changes focus title Play, Book heading, or board. |
| **Modal**, **src/App.tsx:3757-3805** | Focuses the first control, traps Tab, supports optional Escape, and restores focus. A close X is normally the first/default focus. |
| **StoryInterlude**, **src/App.tsx:3689-3746** | Separate dialog behavior: Start auto-focus, primary-pointer backdrop dismiss, and almost any key dismiss. It needs the shared controller/modal generation gate. |
| **src/navigation.ts:3-46** | Story continuation and protected maze-switch policy only; no focus graph. Preserve these rules. |
| **src/session.ts:381-493** | Persists active normal runs and progress. Controller state must remain transient. |
| **src/sound.ts**, **src/music.ts:221-252** | Audio starts synchronously from trusted click/tap/key where possible and safely returns false on autoplay rejection. Gamepad polling is not portable HTML user activation [R4]. |
| **src/stageScale.ts:1-34** | Current fixed 960×540 stage scaling affects focus/control size. The UI plan owns its replacement. |
| **src/styles.css:65-74** | Current focus treatment is a 3px teal **:focus-visible** outline. Programmatic controller focus cannot rely on browser focus-visible heuristics alone. |
| **src-tauri** | Bare Tauri shell; Windows WebView2/NSIS only, 1280×720 default, 960×540 minimum. No native gamepad plugin or Linux bundle/CI path. |

### Historical correctness findings to recheck before adding a fourth input source

1. **No canonical modal gate.** **modalOpen** includes level/reset pickers and result states, but **attemptMove**, the keyboard eligibility check, and the held-input clearing effect use different boolean subsets. Arrow/WASD can move behind some inert dialogs. Controller integration must first derive one **InputContext** and **gameplayInputAllowed** policy.
2. **Corner-assist authority is contradictory.** Project documentation and this brief call it pointer-only, but **attemptMove** currently routes keyboard and on-screen directions through the same resolver. The target decision is explicit: free-form board steering (mouse/touch) retains corner assist; discrete keyboard, controller, and on-screen buttons issue exact cardinals without assist. This restores the documented contract and makes direct-input fairness predictable.
3. **Presentation carry-over needs explicit state ownership.** The historical latest-only **queuedMove** could survive locks. Never replay queued attempts; eligible live held intent may instead continue after successful in-maze interactions under the latest manager contract. Actual modal or route transitions clear it.
4. **Book focus starts on an invisible non-action heading.** **Adventure Book** receives focus at an H1 with **tabIndex=-1**, while controller needs a safe actionable default and persistent focus indicator.
5. **Restart is a timing-based two-activation control.** The 2.2-second “Restart/Again!” state is weak for a controller and vulnerable to naïve repeated activation. Replace it with the same safe confirmation architecture used elsewhere.

## 5. Interactive inventory and target focus behavior

The current-controls columns preserve the original audit. UI-03 supersedes its
two gameplay modes, duplicate close controls and old Book composition. The
current gameplay/menu rows below and the accepted semantic UI inventory govern
controller integration; historical names do not authorize reintroducing them.

| Context | Current controls and focus | Current keyboard/pointer behavior | Controller target and current blocker |
|---|---|---|---|
| **Title** | Sound; Begin/Continue; Choose maze; Book; Surprise; Reset; secret version/tester. Play is force-focused although Sound is first in DOM. | Native Tab/Shift+Tab and Enter/Space; pointer clicks. | Default Begin/Continue. D-pad/stick traverse the visual grid; A on Sound opens the shared Sound menu; View opens Book. No current controller source. |
| **Story** | One Start button, auto-focused; card/backdrop. | Start, pointer anywhere, or almost any key dismisses. | A advances/starts; X skips; B closes/skips; scroll controls if overflow. Opening input is quarantined. |
| **Gameplay: maximized** | UI-03's board, portrait/counters, map, collection shelves and anchored thumb pad. Primary landscape exposes utilities; compact landscape has More. No board-size toggle. | Exact keyboard/pad steps; shared 160ms ordinary tap/held travel; free-board pointer assistance remains separately bounded. | D-pad/left stick move. Y Hint, X Story, View Book, Menu/B game menu. A is intentionally unbound during free movement because interactions are movement-driven. |
| **Gameplay: Big Maze — historical only** | The old separate view mode is removed by UI-03. | No current Normal/Big transition or Escape-to-Normal behavior. | No controller action recreates the removed mode. |
| **Game menu (P0 controller integration)** | Consume the accepted utility/More actions and UI-owned menu seam. | Existing utilities retain their semantics across landscape regimes. | Safe default Resume; declarative actions for Hint, Story, Mazes, Book, Help, Sound, Restart and Home, plus the future PT32 Camera view row. Sound opens the shared Sound menu; Menu/B close. Input is blocked while open; game-design owns whether simulation is described as “pause.” |
| **Sound menu** | Shared UI surface supplied by Plan 01; no controller behavior yet. | Mute plus contextual previous/next/shuffle and approved loop controls; exact visual layout remains UI-owned. | Opening action is separate from transport. D-pad/stick move focus; A issues the focused semantic Sound action; B closes exactly this menu and restores its stable invoker. No move/hint/story/global shortcut leaks through, and the opening edge cannot activate the default item. |
| **Hint** | Close X first; Got it. | Modal trap; Escape/X/Got it closes and restores trigger. | Default Got it; A acknowledges; B closes; no opening-edge fall-through. |
| **Help** | Close X first; long instructions; Let’s explore. | Modal scroll. At 720p content/action overflows initial view. | Default Let’s explore; D-pad focus; right stick or triggers scroll; B closes; focus stays visible. |
| **Missing item** | Close X; explanatory copy; acknowledgement. | Auto-opens after blocked move, clears some held input, returns to board. | Default acknowledgement; A or B closes; all movement is cleared and neutral-gated. |
| **Too strong** | One acknowledgement; no X/Escape close. | Auto-opens after encounter and clears hold. | A acknowledges; B performs the same safe close. No haptic-only information. |
| **Choose maze** | X; unlocked authored levels; Surprise. Scrollable list. | Modal trap and Escape. Choosing another run may open protected confirmation. | Default current/first unlocked maze, not X. D-pad/stick navigate; A chooses; B closes; triggers page-scroll. |
| **Tester picker** | X; every entry from canonical campaign order; Back. Scrollable list. | Modal trap; tester runs suppress story, progress writes, and rewards. | Same picker rules. Current maze gets default focus; every canonical campaign entry and Back are reachable by stable ID. Debug-only visibility remains UI-plan owned. |
| **Different-maze confirmation** | X; Keep this maze; Start the new maze. | First focus is X. | Safe default Keep this maze. A executes only after neutral gate; B cancels. |
| **Reset-progress confirmation** | X; Keep my adventure; Yes, reset everything. | First focus is X; destructive action is adjacent. | Safe default Keep my adventure. Destructive action requires explicit navigation plus a new A edge after neutral; never a long hold as the only method. |
| **Restart confirmation (replace armed state)** | Current Restart becomes Again! for 2.2s. | Second click/activation restarts. | Open a real confirmation with Keep playing default and Restart maze secondary. It follows modal generation/release rules for every modality. |
| **Victory/rewards** | Historical Next/Replay flow, superseded by 03M pending completion. | Current Gameplay spec owns durable choices and safe defaults. | Stay here / Next maze / Restart; B safely stays. Consume accepted defaults and exactly-once Next; suppress unrelated shortcuts. |
| **Adventure Book** | Title; Sound; conditional Resume; New maze; focusable 1,656px scroll region at 720p; unlocked record buttons; Make Surprise; Reset. Initial focus is non-action H1. | Native scroll/Tab/click. | Default Resume if valid, else New maze, else Title. B/View returns to prior screen. D-pad navigates controls, LB/RB jumps sections, LT/RT pages, right stick scrolls. Focused records auto-scroll into view. |
| **Rotate message** | Status only. | No action. | Remains status-only; controller prompts must not suggest an action. |

### Focus transition contract

~~~text
Title
 ├─ Begin/Continue ─> Story when required ─> Game/board
 ├─ Choose/Surprise ─> Picker ─> optional Switch Confirm ─> Story or Game
 ├─ Book ─> Adventure Book ─> Resume/New/record ─> Game or confirmation
 └─ Reset ─> Reset Confirm ─> fresh Title

Game/board
 ├─ Y ─> Hint ─> board
 ├─ X ─> Story ─> board
 ├─ Menu/B ─> Game Menu ─> invoker or destination
 ├─ Mazes/New ─> Picker/Confirm ─> board or new run
 ├─ View/Book ─> Book ─> board
 ├─ blocked/strong ─> Feedback ─> board
 └─ exit ─> Pending completion ─> Stay, Next via durable commit, or safe Restart
~~~

Every transition increments an input-generation number, clears transient movement/repeat state, establishes a declared focus default, and refuses actions from the previous generation. Closing restores the invoker by stable control ID when it still exists, otherwise the context fallback.

## 6. Proposed module and type boundary

### Files

| File | Responsibility |
|---|---|
| **src/gamepadControls.ts** | Pure types and algorithms: standard mapping, button/axis normalization, edge/release state, active-pad selection, stick latch, D-pad arbitration, repeat clock, neutral gate, reset reasons. No React, DOM, navigator, or audio. |
| **src/gamepadControls.test.ts** | Exhaustive Node/Vitest table tests with structural Gamepad-like fixtures and injected timestamps. |
| **src/useGamepadControls.ts** | Browser lifecycle adapter: feature detection, connect/disconnect listeners, focus/visibility, discovery timer, RAF, one fresh **getGamepads()** snapshot per poll, cleanup, callback refs. |
| **src/inputContext.ts** | Canonical **InputContext**, **InputAction**, **InputSource**, **getInteractionPolicy()**, context priority, gameplay gate, clear/neutral reasons. This is the single contract shared with the UI plan's DialogShell. |
| **src/inputContext.test.ts** | Every screen/modal/presentation combination; exactly one top layer; movement allowed only in free gameplay; Escape/B hierarchy; clear-on-transition matrix. |
| **src/controllerNavigation.ts** | Pure focus-candidate selection plus DOM adapter/registry, remembered stable IDs, safe defaults, scroll/page actions, activation gating. |
| **src/controllerNavigation.test.ts** | Directional geometry/list behavior, explicit neighbours, disabled/hidden/inert exclusion, no unintended wrap, restoration and safe defaults. |
| **src/ControllerPrompts.tsx** | Context-derived Xbox/keyboard/pointer/touch prompt model and accessible text fallback. If the UI plan lands first, place this under its screen/component tree. |
| **src/haptics.ts** | P1 no-op-compatible feature-detected port; intensity policy and reset. |
| **src/App.tsx** | Derive context, dispatch semantic actions into existing handlers/**attemptMove**, register focusable controls, expose status/prompts. It must contain no raw button indices. |
| **src/movementControls.ts** | Keep existing gameplay cadence as authority; optionally expose a modality-neutral timestamp state machine rather than duplicating constants. |
| **src/pointerControls.ts** | Keep pointer/touch steering and corner assist, but call it only for free-form board steering. |
| **src/styles.css** or UI-plan **src/styles/controls.css** | Explicit controller focus state, prompt badges, connection/reconnect status. UI/UX owns sizing/placement. |

The accepted UI plan supplies **DialogShell**, **UtilityNav**, **GameScreen**,
**TesterTools**, a layered CSS tree, typed `src/ui/interactionState.ts`, stable
focusable IDs/groups and a narrow pre-controller input blocker. Do not create a
competing dialog shell or UI state model. Controls owns canonical
`src/inputContext.ts`, `getInteractionPolicy()`, semantic input types/actions,
controller navigation state and optional neighbour overrides; it consumes the
UI IDs/state and replaces the narrow blocker only after cross-input parity tests.

### Core types

~~~ts
export type InputMode = "controller" | "keyboard" | "pointer" | "touch";
export type InputSource =
  | "gamepad-dpad"
  | "gamepad-stick"
  | "keyboard"
  | "board-pointer"
  | "board-touch"
  | "anchored-joystick"
  | "onscreen-direction"
  | "thumb-pad";

// Names for domain/action routing only; this is not the complete app state.
export type InputDomain =
  | "front-door"
  | "title"
  | "home"
  | "story"
  | "gameplay"
  | "gameplay-presentation"
  | "game-menu"
  | "sound-menu"
  | "help"
  | "hint"
  | "missing-item"
  | "too-strong"
  | "level-picker"
  | "tester-picker"
  | "switch-confirm"
  | "restart-confirm"
  | "reset-confirm"
  | "pending-completion"
  | "book"
  | "achievement-detail"
  | "controller-disconnected";

export interface InputContext {
  readonly ui: UiInteractionState; // imported from the accepted UI owner
  readonly domain: InputDomain; // derived from ui and the locks below
  readonly presentationLease: PresentationLease | null; // accepted Plan-02 type
  readonly controllerStatus: "absent" | "arming" | "active" | "disconnected";
  readonly focusScopeId: string;
  readonly generation: number;
}

export type InputAction =
  | { type: "move"; direction: Direction; phase: "edge" | "repeat"; source: InputSource }
  | { type: "navigate"; direction: Direction }
  | { type: "confirm" }
  | { type: "back" }
  | { type: "menu" }
  | { type: "book" }
  | { type: "hint" }
  | { type: "story" }
  | {
      type: "sound-menu";
      action:
        | "open"
        | "toggle-mute"
        | "previous-track"
        | "next-track"
        | "shuffle-track"
        | "toggle-loop";
    }
  | { type: "page"; direction: "previous" | "next" }
  | { type: "section"; direction: "previous" | "next" };

export interface GamepadLike {
  readonly id: string;
  readonly index: number;
  readonly connected: boolean;
  readonly mapping: string;
  readonly timestamp: number;
  readonly axes: readonly number[];
  readonly buttons: readonly GamepadButtonLike[];
}

export interface PadRef {
  readonly index: number;
  readonly connectionGeneration: number;
}

export type ResetReason =
  | "blur"
  | "hidden"
  | "context-change"
  | "modal-entry"
  | "navigation"
  | "presentation-start"
  | "presentation-end"
  | "disconnect"
  | "controller-swap"
  | "teardown";
~~~

**gamepadControls.ts** returns semantic intents and connection/status changes. It accepts snapshots and time as inputs. It never calls React setters, DOM methods, audio, persistence, or the game engine.

The `sound-menu` action is resolved only against the current structured context. `open` is valid from a visible registered Sound control; transport actions are valid only while the Sound menu is topmost. Closing uses the ordinary `back` action so the context owner can restore the captured semantic invoker. If loop is not part of the accepted music UI at execution time, `toggle-loop` remains unsupported and is neither registered nor prompted; controls must not create an invisible capability.

**useGamepadControls.ts** owns all browser side effects. It keeps raw samples, prior button states, latch state, repeat timers, active controller, and generation in refs. It calls React only when a discrete action, connection state, prompt mode, or focus ID changes.

## 7. Standard mapping and normalization

The W3C standard layout supplies stable positions for recognized devices, with axes in [-1, 1], buttons in [0, 1], and **mapping === "standard"** when the browser has normalized the device [R1][R2]. V1 maps that standard layout to Xbox labels:

| Standard index | Xbox label | Semantic use |
|---:|---|---|
| Button 0 | A | Confirm, activate, story advance, acknowledge |
| Button 1 | B | Back, cancel, close, exit current top layer |
| Button 2 | X | Story/open chapter; skip while story is open |
| Button 3 | Y | Hint during free gameplay |
| Button 4 / 5 | LB / RB | Previous/next section or tab where advertised |
| Button 6 / 7 | LT / RT | Page up/down or accelerated scroll where advertised |
| Button 8 | View | Toggle Adventure Book/current prior view |
| Button 9 | Menu | Open/close the game menu |
| Button 10 / 11 | LS / RS click | Unassigned in v1; never essential |
| Button 12–15 | D-pad U/D/L/R | Cardinal movement or digital UI navigation |
| Button 16 | Xbox/Home | OS/Steam-reserved; never bind an essential action |
| Axes 0 / 1 | Left stick X/Y | Cardinal movement or UI navigation |
| Axes 2 / 3 | Right stick X/Y | Vertical reading scroll only; no maze movement |

### Button normalization

- For ordinary buttons, trust **pressed**; accept **value >= 0.50** only as a defensive fallback when **pressed** is false/inconsistent.
- Treat LT/RT as analog: enter at 0.55 and release at 0.35.
- A/B/X/Y/Menu/View generate rising-edge actions only and never repeat.
- D-pad and UI-navigation axes repeat under the explicit repeat schedulers below.
- Button state is armed only after a release/neutral sample. No millisecond “debounce” is added to responsive taps.
- A too-short browser sample can still be missed by any polling API; one poll per visible RAF is the best-practice boundary [R1]. Hardware qualification must cover quick taps.

### Unsupported mappings

- **mapping === "standard"** is the P0 acceptance path for wired/Bluetooth Xbox and Steam's virtual gamepad.
- A controller with **mapping === ""** may appear in status, but it cannot claim active control in v1. Show: “Controller found, but its layout is not recognised. On Steam Deck, choose the Steam Input Gamepad template.”
- Do not parse serial-like identity from **id**, persist **id/index**, or assume index 0. The standard leaves ID format unspecified and permits index reuse after disconnect [R1].
- Keep an adapter registry keyed only to separately tested browser/platform match rules. Adding an adapter requires USB and Bluetooth fixtures, manual hardware evidence, and its own tests.

## 8. Polling, ownership, and lifecycle algorithm

### Lifecycle

1. Feature-detect **navigator.getGamepads**. If absent, leave every existing input active and show a nonblocking unsupported-browser status when controller mode is requested.
2. Register **gamepadconnected**, **gamepaddisconnected**, **window.blur**, **window.focus**, and **document.visibilitychange** exactly once; StrictMode cleanup must be symmetrical.
3. While visible/focused with no exposed standard pad, use an advisory 4Hz discovery probe plus connection events. This accounts for browsers that expose a preconnected controller only after a button/axis gesture [R1][R2].
4. With one or more exposed pads, run one RAF loop and call **getGamepads()** once per frame. Fetch the current object by index every poll; do not retain an event's Gamepad object as current state.
5. Stop RAF and the discovery timer, and clear all raw/held/repeat/haptic state on blur, hidden, teardown, or unsupported permissions. RAF is normally suspended in background tabs, but explicit clearing prevents stale holds.
6. On focus/visible return, re-enumerate, seed current states, and require neutral before actions. Never calculate catch-up repeats from elapsed hidden time.
7. Catch **SecurityError** from permissions policy and expose a diagnostic status. Hosted production should serve HTTPS and may send **Permissions-Policy: gamepad=(self)** after validating its hosting configuration [R3].

### Exposure and arming

The Gamepad specification intentionally returns no exposed pads before a gamepad gesture for fingerprinting protection [R1]. Therefore:

- Always render a static title hint such as “Xbox controller: press any button to connect” even before enumeration.
- If the first observed snapshot already has a held button/axis, treat it as the exposure handshake, choose the deterministic candidate, seed prior state, consume the press, and wait for full neutral.
- Neutral means buttons 0–15 below their release thresholds, both sticks inside 0.24 radial magnitude, and D-pad released. Ignore the OS-reserved center button.
- Once neutral is observed, arm the pad and focus the title's safe default. The next deliberate input acts normally. Thus a common cold launch is “press once to expose, release, press A to Begin,” not an accidental one-press start.
- A controller already exposed and sampled neutral may claim ownership and dispatch its first deliberate action immediately.

### Multiple controllers

- Enumerate all pads but support one active player in this tranche. Keep identity/normalization reusable by Plan 10's later two-seat registry, without implementing joining, seat routing or co-op now.
- With no owner, the first standard pad that produces deliberate input after a neutral sample wins. If multiple qualify in the same poll, the lowest current index wins.
- Ownership is sticky while connected; drift or input on another pad cannot steal it.
- Represent ownership as **{ index, connectionGeneration }**, never a persisted identity.
- On active disconnect: clear movement/actions/haptics immediately; expose UI-owned non-destructive reconnect status over the preserved context; do not let another pad's pre-held state act. Keyboard/touch remain usable and can deliberately dismiss that status/take over without pretending a controller reconnected. Disconnecting an inactive pad never blocks the active input source.
- A reconnected or replacement standard pad claims through neutral plus deliberate input. Its claim press dismisses/acknowledges ownership only when it arrived held; the next press resumes. Restore the last valid focus, otherwise the context fallback.
- Test a physical/virtual duplicate pair under Steam Input. A second enumerated entry must not double-dispatch.

### Clearing table

Every cancellation boundary below increments the context/input generation and clears button edges, stick/D-pad latch, movement/UI repeat, prior direction, queued controller action, and pending haptic. Successful in-maze presentation locks are a separate suspension category, not cancellation:

- blur or **document.visibilityState === "hidden"**;
- entry to or exit from an actual modal, story, game menu, picker, blocking explanation, or victory layer (not a nonmodal HUD message or eligible successful effect);
- screen/route navigation, level load, restart, reset, Home, Book, tester swap;
- active controller disconnect, reconnect generation, or controller swap;
- cancellation/failure of a gameplay presentation or an incompatible context change;
- unmount/teardown.

Keyboard, pointer, touch, and on-screen held state use the same cancellation policy. Successful combat/rescue/door/jump/portal locks pause repeat scheduling while input adapters still observe direction/release. Resume only current live intent after all eligible locks finish; no old deadline catch-up or queued replay. Modal dismissal does not rearm a still-held blocked gesture. This protects background movement without requiring a new press after every successful interaction.

## 9. Maze movement algorithm

### Anchored board gesture and hybrid thumb pad — P0

`PT-20260902-08` requires a real gesture state machine, not only a corrected
guide graphic. Store raw active pointer, immutable client-space anchor,
down-time/geometry snapshot and gesture generation in refs; publish only a
changed semantic direction/status. Idle pointer samples cause no App commit.

- Board press begins pending. A release within the documented CSS-pixel slop
  emits one tap attempt relative to Ame using the accepted scene mapping. Once
  displacement crosses slop, classify it as a drag, consume tap eligibility,
  and derive every direction from current pointer minus the original anchor.
  A drag cannot also emit a speculative pointer-down tap or pointer-up step.
- Choose and record a bounded slop/deadzone from real finger trials; keep it in
  CSS pixels with normalized pad geometry, rather than scaling it with an
  unrelated world sprite. Touch near an edge must still have useful range.
- Camera following, Ame moving and crossing camera clamps never move the
  joystick origin. The displayed anchor/knob uses exactly the same coordinates
  as intent. Capture the primary pointer, ignore additional pointers, and clear
  on `lostpointercapture`, `pointercancel`, blur, hidden, overlay, geometry
  invalidation or teardown. Resizing/rotation cancels rather than rebases a hold.
- The UI-owned rounded-square pad has four named, keyboard-accessible cardinal
  targets. A dedicated-region press may step immediately and then hold using
  the shared cadence; dragging it changes the same hold's anchored direction,
  never produces a second initial action, and does not become free movement.
  Its logical targets and accessible labels remain available without dragging.
- Deferred board taps versus immediate dedicated-pad presses is a **proposed
  interaction resolution**, not Human-accepted feel. In the pad trial, explicitly
  test a drag that begins in one region and rolls toward another: the first step
  must match a deliberate press rather than surprise the player. Physical iPad
  and family validation decide whether this tradeoff works. If it fails,
  present a bounded gesture-classification alternative and its response-time
  cost; do not quietly change shared digital cadence or mark PT08 accepted.
- Dedicated-pad and anchored-joystick directions are exact cardinal inputs.
  Only the deliberately retained free-board tap/steering mode may use the
  documented safe corner assist. Keep this policy explicit in `InputSource`.
- Use one source-ownership rule across keyboard, gamepad and captured pointer
  holds: a deliberate modality takeover clears the previous hold; concurrent
  timers never add repeat rates. Compatibility mouse events cannot duplicate
  a touch action. Browser scrolling/zoom outside movement surfaces still works.

Cover pending tap, drag slop crossing, distant-from-Ame origin, camera movement,
thumb-pad hold-to-drag, reversal, narrow corners, capture loss, second finger and
overlay cancellation. A physical landscape iPad comparison is the comfort gate;
desktop emulation proves geometry and events only.

### Digital edge and hold

- A D-pad rising edge or left-stick direction activation immediately calls **attemptMove(direction, source)** exactly once.
- Holding the same direction uses the current shared **STEP_TRAVEL_MS = 160** for initial and repeated ordinary steps. The old 320ms delay and 260ms-to-160ms curve are historical and must not be restored.
- Releasing before the first repeat leaves one committed square with the same smooth 160ms travel as a held first step. Do not snap its presentation on ordinary release.
- A late RAF may emit at most one due repeat and then schedule from “now.” It never emits a burst to catch up.
- Sample travel at the actual callback timestamp. A future due time is scheduling metadata, never the time used to advance the actor/camera sample.
- A direction change emits one immediate attempt and restarts the held cadence.
- D-pad and stick never both emit in one sample; D-pad owns the sample while any D-pad direction is active.

### Stick deadzone, hysteresis, and cardinal resolution

The following values are implementation starting points, not platform mandates. They must be tuned with several Xbox controllers over both transports:

- radial drift deadzone: 0.24;
- direction enters when resultant magnitude and selected dominant-axis magnitude are at least 0.55;
- a latched direction releases at resultant/dominant magnitude at or below 0.35;
- compare **abs(x)** and **abs(y)**; if their difference exceeds 0.12, choose the larger;
- inside the 0.12 tie band, keep the currently latched direction;
- with no latch, use the axis that crossed the activation threshold first; if both first cross in the same sample, use a documented vertical tie-break;
- a perpendicular rolled-stick change must beat the current axis by 0.15 for a short elapsed-time qualification, initially 25ms, then emits one edge and restarts cadence; record/tune this on hardware rather than requiring two polls whose duration changes at 40/60/90Hz;
- an intentional opposite-direction reversal at or beyond 0.55 may switch after one sample because its sign change is unambiguous.

The resolver returns zero or one cardinal direction per sample. It never returns a diagonal and never emits two moves for the two axes.

### D-pad arbitration

- Opposing buttons on one axis cancel that axis.
- If perpendicular buttons are held, the most recently pressed direction wins.
- A same-poll perpendicular tie uses the same vertical tie-break.
- Releasing the winning direction may activate the still-held direction once, immediately, and restart cadence; it cannot replay historical repeats.

### Presentation and modal behavior

- Free gameplay is the only context in which controller movement can dispatch.
- During accepted short move/bump gates, scheduler time continues but cannot generate catch-up moves; the next normal due time may attempt. Resolve durations from the accepted MOVE-01/gameplay contract, not historical 64ms/45ms literals.
- Successful rescue/combat/portal/jump/door effects suspend repeat attempts but retain eligible live intent under the manager contract above. Story, actual modal, navigation, victory and reconnect clear and require a fresh neutral/edge. Release/cancel always cancels continuation; attempted moves are never queued.
- Holding the stick across an eligible successful presentation resumes normal movement in its currently resolved direction, once all locks end and current source/run/context still match. Failed blockers rearm only on fresh deliberate intent, not merely because a held gesture outlasted the explanation.
- Modal entry clears existing keyboard, pointer, touch, and on-screen holds too; opening a picker can no longer allow background Arrow/WASD movement.

### Corner assistance and fairness

Controller input receives **no corner assistance**. D-pad, left stick after cardinal resolution, keyboard, and on-screen directional buttons all express an exact cardinal choice and go directly to **movePlayer** through **attemptMove**.

Only the explicitly retained free-board tap/steering mode keeps the existing one-tile, wall-only corner assist, because that mode asks the app to infer intent from a world point. Anchored joystick and dedicated-pad directions join keyboard and controller as exact cardinals. Update source-specific tests and architecture documentation so the policy cannot drift accidentally; requalify the MOVE-01 corner/comfort scenarios without changing the engine.

## 10. Xbox mapping by context

The invariant rules are: **A confirms**, **B closes/backtracks one layer**, **Menu opens the game menu**, **View opens/toggles the Book**, **Y is Hint**, and **X is Story**. Buttons with no valid action do nothing and are omitted from prompts.

| Context | D-pad / left stick | A | B | X | Y | View | Menu | LB/RB | LT/RT / right stick |
|---|---|---|---|---|---|---|---|---|---|
| Front door | Move focus among accepted Play/Exit actions | Activate | No unadvertised browser-close action | No action | No action | No action | No action | No action | Only if the accepted surface overflows |
| Home | Move focus | Activate | Return to front door only if an accepted visible action exists | No action | No action | Open Book | No action | No action | Scroll only if the accepted Home surface overflows |
| Story | Focus/page direction if needed | Advance; final page starts maze | Skip/close to game | Skip story | No action | No action | No action | Previous/next page if stories later paginate | Page/continuous scroll when card overflows |
| Gameplay: maximized | Move Ame | No action | Open game menu | Read chapter | Hint | Open Book | Open game menu | No action | No action |
| Game menu | Move focus | Activate item | Resume/close | As labelled only | As labelled only | Open Book if enabled | Resume/close | Change explicit menu tabs only if added | Scroll |
| Sound menu | Move focus | Issue focused mute/previous/next/shuffle/approved-loop action | Close and restore Sound invoker | No action | No action | No action | No action | No action | Scroll only if the responsive surface genuinely overflows |
| Help/Hint/Missing | Move focus | Acknowledge/activate | Close | No action | No action | No action | No action | No action | Page/scroll |
| Too strong | Move focus (one action) | Acknowledge | Acknowledge/close | No action | No action | No action | No action | No action | Scroll if required |
| Maze/tester picker | Navigate list/grid | Select | Close/back | No action | No action | No action | No action | Previous/next logical list section/page | Page/continuous scroll |
| Switch/Restart/Reset confirm | Select safe/destructive action | Activate after release gate | Cancel/keep | No action | No action | No action | No action | No action | Scroll if required |
| Pending completion | Select Stay here/Next maze/Restart | Activate selected action | Stay here, without committing rewards | No action | No action | No action while modal is topmost | No action while modal is topmost | Only accepted UI affordances | Scroll rewards |
| Earned-achievement detail | Navigate registered viewer controls | Activate | Close only viewer; restore exact Book invoker | No action | No action | No action while viewer is topmost | No action | Only accepted UI affordances | Scroll if needed |
| Adventure Book | Navigate actionable controls/records | Activate | Return to prior screen | No action | No action | Return to prior screen | Open game menu when a run exists | Previous/next Book section | Page up/down; right stick continuous scroll |
| Reconnect layer | No game action | Acknowledge after controller is armed | No game action | No game action | No game action | No game action | No game action | No game action | No game action |

Context-sensitive actions are limited to their named domain:

- B closes the topmost dialog/menu; in unobstructed gameplay it opens the game menu. The historical Big-to-Normal Back layer no longer exists.
- X always concerns story: open it during play, skip it while it is open.
- View always concerns the Adventure Book: open it, or return from it.
- Shoulder/trigger actions exist only where the visible prompt names a section/page/scroll affordance.
- The Sound control always opens the shared menu; it never directly toggles mute. Its opening edge is quarantined, transport commands are semantic actions valid only in the topmost Sound context, and B restores the originating Sound control without exposing a gameplay edge.
- Guide/Xbox, stick clicks, and unprompted buttons never carry essential behavior.

## 11. Controller navigation, prompts, and input-mode switching

### Focus registry and navigation

Each interactive component registers a stable control ID, focus group, DOM element, and optional explicit neighbour IDs. The resolver:

1. excludes disabled, hidden, disconnected, **inert**, and zero-size candidates;
2. follows an explicit neighbour override when declared;
3. for ordered lists, uses item order for Up/Down and declared row metadata for Left/Right;
4. otherwise considers candidate centres in the requested half-plane and scores **primary distance + 2 × perpendicular distance**;
5. breaks equal scores by stable DOM/registration order;
6. does not wrap at an edge unless that specific group declares wrap; and
7. leaves focus in place when no candidate exists.

This geometry fallback adapts to the UI plan's responsive layouts, while overrides resolve ambiguous title/header/dialog paths. UI navigation repeats immediately, pauses 350ms, then repeats every 120ms without acceleration. Face buttons never repeat. Trigger page scrolling may use 350ms initial/180ms repeat; every late frame emits at most one page step.

On focus change, call **focus({ preventScroll: true })**, then scroll the nearest named one-axis container so the element is fully visible. Use instant scrolling under reduced motion; avoid focus animations or scale that obscure adjacent controls. The Book remembers the last focus ID and section for the session. Modals do not inherit a background focus.

### Safe defaults

- Front door: Play. Home: Continue/Begin.
- Story: Start/Continue.
- Gameplay: board logical movement focus.
- Game menu: Resume.
- Informational feedback: acknowledgement action.
- Picker: current maze, else first enabled maze.
- Switch/Restart/Reset: safe cancel/keep action.
- Pending completion: Stay here while any friend remains, otherwise Next maze; Restart enters the shared safe confirmation.
- Earned-achievement detail: declared safe close control, restoring its exact Book invoker and scroll position.
- Book: Resume when valid; otherwise New maze; otherwise Title.
- Reconnect: non-action status until a pad is armed, then restore the prior valid control.

If controller input arrives and DOM focus is absent/invalid, a directional action may establish the fallback and then navigate. A first A press establishes focus only and does not also activate. This prevents surprise activation after mouse/touch focus changes.

### Visible focus

- Set a root **data-input-mode="controller"** attribute on meaningful controller input.
- Give the actually focused registered control an explicit controller class/data state; do not depend solely on **:focus-visible**.
- Target a two-layer indicator: at least a 3px high-contrast inner or outer boundary plus a contrasting separation/shadow that survives light, dark, textured, and animated backgrounds.
- Indicator geometry must remain fully visible at 1280×720, 1280×800, 1920×1080, and 200% text zoom; it may not be clipped by transformed containers or scrollports.
- Do not encode focus only by colour, motion, glow, or size. Microsoft calls for a highly visible, always-on-screen focus indicator for distant players [R8][R9].

### Prompts

Render prompts from **{ context, focusedControl, inputMode, controllerFamily }**, not hard-coded copy inside screens.

- Controller mode uses familiar text/glyph badges such as **A Select**, **B Back**, **Y Hint**, **X Story**, **Menu Options**, **View Book**, and only valid contextual shoulder/trigger actions.
- Every glyph has adjacent text and an accessible label; no action is communicated through an image alone.
- For standard Xbox/Steam-virtual input, Xbox labels are correct. For an unsupported non-standard pad, do not falsely display Xbox-specific actions as usable.
- Keyboard mode retains Arrow/WASD/Enter/Escape copy; pointer and touch retain their own steering/activation copy.
- Help must include controller discovery, full mapping, held movement, Book/menu navigation, disconnect recovery, and the fact that Steam Input should use the Gamepad template.
- Prompts remain stable in position as the UI plan allows, avoid repeating animation, and update by the next paint after a meaningful modality change.

### Active input mode

The newest **meaningful** input changes prompts:

- controller: button/D-pad edge or stick crossing 0.55, never drift;
- keyboard: non-modifier keydown relevant to the app;
- touch: touch/pen pointerdown;
- pointer: mouse pointerdown, or at least 8 CSS px accumulated intentional movement within 250ms.

Rules:

- Mouse subpixel jitter, stick values below threshold, button touch without press, and passive connection events do not change mode.
- After touch, ignore compatibility mouse movement/click for 750ms.
- For 500ms after a controller action, ignore mouse-move-only mode changes so Steam's incidental cursor cannot make prompts flicker; a real mouse button press still wins immediately.
- Switching modes never changes the maze, clears progress, or activates a control.
- Returning to controller restores the context's last valid focus. A direction can both restore and navigate; A without valid focus only restores.
- Pointer/touch may visually de-emphasise the controller focus decoration, but semantic DOM focus and keyboard **:focus-visible** remain correct.

## 12. Audio and optional haptics

### Audio activation

The Gamepad API's exposure gesture is not the HTML user-activation model. HTML lists trusted keyboard, mouse, pointer, and touch events as activation-triggering; polled gamepad state is absent [R4]. A synthetic **click()** dispatched from polling is not a trusted activation.

Therefore:

- preserve **music.ts** and **sound.ts** synchronous trusted-click/key behavior and rejection handling;
- controller semantic actions may request the existing audio-start function, but failure remains nonfatal and must not loop/retry every RAF;
- never claim that controller A unlocks Web Audio, fullscreen, or popups in every hosted browser;
- test cold launch, muted/unmuted state, HDMI audio, browser autoplay policy, PWA, Gaming Mode, WebView2, and WebKitGTK on real hardware;
- if the primary browser cannot start audio from controller-only input, preserve a playable silent fallback but leave the fully qualified couch-audio route pending. Record a proven one-time setup gesture or seek a separately approved delivery solution; silence is not evidence that the primary audiovisual experience passed. A wrapper autoplay policy may be investigated separately without weakening web security.

### Haptics (P1, never a ship blocker)

The Gamepad specification includes a vibration actuator/effect model, but browser/platform support is limited and effects reject while hidden or unsupported [R1][R10].

Implement **HapticsPort** with a no-op default:

- feature-test actuator, supported effects, and **playEffect**;
- catch synchronous errors and rejected promises;
- best-effort reset on blur, hidden, context change, disconnect, controller swap, and teardown;
- allow **Off**, **Low**, **Medium**, and **High** (or 0–100%) in controller settings; default Medium only after a capability is proven;
- persist this as a preference separate from adventure progress, and do not erase it during progress reset;
- keep reduced motion and haptics as independent settings.

Proposed restrained hooks:

- blocked wall: 40–60ms, weak magnitude about 0.15;
- pickup/rescue: 80–120ms, light dual rumble;
- enemy defeat: short two-part cue, only if VFX/audio owners expose a semantic event;
- victory: at most 180ms;
- no rumble for ordinary focus movement.

Every haptic has existing visual/text feedback and, when audio is enabled, an audio counterpart. Haptics never communicate essential state alone, and players never have to endure repeated vibration [R10].

## 13. Steam Deck delivery research and route

These are five separate layers and must remain separately releasable:

| Layer | Decision |
|---|---|
| **1. Shared React controller support** | P0. Standard Gamepad API, semantic actions, focus, prompts, device lifecycle. No Steamworks/Tauri dependency. |
| **2. Hosted or installed web app** | Primary runtime family. Stable HTTPS origin and persistent browser profile. Installed PWA/offline cache is a later packaging enhancement because the current repo has no manifest/service worker. |
| **3. Add web app to Steam** | Primary consumer launch. Dedicated Chrome/PWA shortcut as a non-Steam game; Edge is a documented alternate. Gaming Mode for play. |
| **4. Native SteamOS/Linux Tauri** | Fallback candidate only after AppImage/WebKitGTK/libmanette/input/audio/save hardware qualification. |
| **5. Windows build through Proton** | Exploratory, unsupported route. Do not make it a fallback or require WebView2/protontricks setup. |

### Why the Chromium web route is primary

- Valve says Chromium-based browsers gained native support so websites can detect Deck controls [R18].
- Microsoft documents the exact non-Steam browser shortcut pattern, a read-only **/run/udev** Flatpak override for controller access, URL kiosk launch, and returning to Gaming Mode [R19].
- Steam Input can expose an Xbox-like emulated gamepad upstream of the browser; its plain Gamepad template preserves native Gamepad semantics [R17].
- This route reuses the existing hosted artifact and keeps controller fixes in one React codebase.
- Browser and SteamOS updates are still moving targets, so release qualification must record versions.

Edge-the-browser and an embedded Edge WebView2 host are separate qualification targets. WebView2 embeds Chromium content, but Microsoft does not publish a blanket Gamepad compatibility guarantee for every host. An open WinUI/UWP WebView2 report documents Xbox input reaching Edge but not that embedded host; it is not evidence that Tauri's Win32 host is broken, but it is evidence that a normal browser pass cannot waive the Windows Tauri hardware gate [R30]. Linux Tauri is different again because it uses WebKitGTK rather than WebView2 [R12].

### Primary setup recipe

1. In Desktop Mode, install current Chrome Stable Flatpak through Discover/Steam's browser flow. Record package and Chromium versions.
2. Validate the Chrome Flatpak's controller-device permission. Do not blindly copy Edge's application ID. Document the exact Chrome **flatpak --user override --filesystem=/run/udev:ro ...** command only if the current package needs it.
3. Prefer an installed PWA launcher once manifest, service worker, stable icon/name, offline/update behavior, and Steam discoverability are proven.
4. Until then, add Chrome itself as a non-Steam game and configure a dedicated shortcut to the production HTTPS URL in app/kiosk mode. Microsoft's **--kiosk "URL"** example is a pattern; do not copy its 1024×640 cloud-gaming dimensions for television play [R19].
5. Use a persistent, non-private browser profile and one stable origin so progress survives relaunches.
6. Select Steam Input **Gamepad**. Do not select “Gamepad with Mouse Trackpad” for the supported configuration; synthetic mouse output would fight active-mode/focus arbitration.
7. Add game artwork/name, return to Gaming Mode, and validate launch, overlay return, suspend/resume, exit, and save behavior with only the Xbox controller.
8. Setup may require keyboard/mouse/Deck controls once in Desktop Mode. The consumer acceptance boundary begins when the player selects Play in Gaming Mode and the app opens.

### Gaming Mode versus Desktop Mode

- Gaming Mode is the supported ten-foot play environment and must handle every normal session with the Xbox controller.
- Desktop Mode is installation, troubleshooting, and diagnostics. Valve warns desktop work can still require keyboard/mouse, while desktop applications can be added to Steam for Gaming Mode use [R20].
- Opening/closing Steam or Quick Access overlays, display re-handshake, suspend/resume, and focus return must clear held input and restore controller focus without a click.
- Use Steam Input's gamepad path. The application cannot reliably infer whether the visible Xbox-like pad is physical Xbox hardware, Deck controls, or Steam's virtual device.

### Linux Tauri fallback qualification

Tauri uses WebKitGTK on Linux and does not bundle one universal webview [R12]. An AppImage is feasible, but it introduces a second browser engine and Linux packaging/input surface.

Keep it behind this gate:

- build x86_64 AppImage in Linux CI against an old-enough compatible base such as Ubuntu 22.04/Debian 12 guidance [R23][R24];
- record runtime WebKitGTK version and verify Gamepad support, **libmanette**, sandbox/device permissions, USB, Bluetooth, Deck built-in, and Steam-virtual pads;
- test button-first and axis-first discovery, standard mapping, hot-plug, reconnect, overlays, suspend/resume, focus, haptics, audio/GStreamer, HDMI, rendering, and scrolling;
- add the exact AppImage as a non-Steam game and test both Desktop and Gaming Modes;
- verify local save persistence/update paths; browser-origin and Tauri-webview storage are separate;
- if JavaScript Gamepad delivery fails, stop and reassess. Do not silently expand P0 into a Rust native-gamepad bridge.

### Why Proton is not the fallback

Valve can run many non-Steam Windows applications through Proton, but the current desktop artifact depends on WebView2. WebView2's supported platform is Windows; its Proton/Wine request is not on a near-term path, and Wine has documented current blank/black composition failures [R26][R27]. A one-machine Proton-GE success would not constitute a repeatable release route. Keep one exploratory matrix row only.

## 14. Implementation phases, dependencies, and rollback

Because parallel plans are changing App/layout boundaries, every implementation phase starts by re-reading HEAD, status, the UI interaction-policy contract, and affected symbols. Never overwrite unrelated plan or code changes.

### Phase 0 — Reconcile contracts and freeze fixtures

Work:

- Reinspect **App.tsx**, the UI-owned **DialogShell/interactionState/getCurrentInputBlock**, the Controls-owned **getInteractionPolicy**, current tests, and all concurrent changes.
- Establish **src/inputContext.ts** as the single derived input policy; Controls owns semantic input state, while UI retains screen/overlay/focus-scope truth and Plan 02 retains its presentation lease.
- Reproduce historical picker/presentation defects first. Keep predecessor fixes and their regression coverage; add only missing source/context cases.
- Encode the chosen assist policy: pointer/touch board steering only; discrete directions exact.
- Capture screen/focus IDs and a controller-only journey fixture.
- Freeze separate camera-framing and exploration-reveal fixtures for PT32;
  record the accepted span/scene-coordinate API and existing preference store.

Dependencies: existing Vitest and shared Plan-07A browser fixtures.<br>
Rollback: test-only and pure-policy changes can be reverted without state migration.<br>
Exit: every current top layer maps to exactly one context; no movement behind any top layer.

### Phase 1 — Pure gamepad core

Work:

- Add **gamepadControls.ts/test.ts**.
- Implement standard mapping, normalization, neutral gate, button edges, active ownership, stick latch, D-pad arbitration, gameplay/UI repeat clocks, and reset reasons.
- Reuse/export **movementControls.ts** cadence rather than copy values.
- Implement the pure anchored-gesture/hybrid-pad state machine from section 9 and source-aware assistance policy before browser integration. Keep raw geometry separate from semantic attempts.

Dependencies: none.<br>
Rollback: module is unreferenced until Phase 2.<br>
Exit: all unit matrices pass with injected pads/timestamps; zero browser globals in the pure module.

### Phase 2 — Browser lifecycle and semantic dispatch

Work:

- Add **useGamepadControls.ts**.
- Implement events, discovery probe, RAF, current snapshots, visibility/focus cleanup, StrictMode-safe teardown, and errors/status.
- Route output through typed **InputAction**, then into existing navigation handlers and **attemptMove** with explicit **InputSource**.
- Consolidate all modality clearing under the canonical policy.
- Integrate anchored board steering and the UI-owned hybrid pad, exclusive hold ownership, and the successful-interaction live-intent contract. Re-run accepted MOVE-01 straight/corner/release/edge cases and interaction steering/cancel cases across the affected input sources.
- Add a temporary internal feature switch or isolated hook mount so controller input can be disabled without reverting unrelated refactors.

Dependencies: browser Gamepad API only.<br>
Rollback: disable/unmount the gamepad hook; keyboard/pointer/touch remain intact.<br>
Exit: mocked unit/browser harness can connect, arm, move, clear, disconnect, and reconnect without duplicate listeners or state replay.

### Phase 3 — Focus, prompts, and controller-first surfaces

Work:

- Add **controllerNavigation.ts**, consuming UI-owned stable control IDs/groups and adding optional neighbours, remembered focus, auto-scroll, and explicit input generation.
- Add controller prompt view models and accessible Xbox badges.
- Wire the accepted game menu and safe restart confirmation. Where a required control is missing, request a bounded UI contract repair rather than creating a second menu or confirmation.
- Make title, Story, maximized gameplay in both landscape regimes, Help, Hint, feedback, both pickers, switch/reset/restart confirmations, victory, and Book complete.
- Preserve the 03M pending completion choices and durable reward boundary; integrate achievement-detail and story dialogue navigation through their existing stable actions.
- Update board/help accessible copy to name controller controls.
- Add explicit controller focus CSS in the UI plan's current style structure.
- Add PT32's Camera view row to the same game menu and integrate Close/Default/
  Wide through the accepted travel/scene owner. Prove a representative 4/5/6/7
  canary before widening coverage; preserve discovery and progression truth.

Dependencies: UI plan's component/DialogShell landing order. No package dependency.<br>
Rollback: controller surfaces are behind the hook/feature switch; retain stable semantic IDs for keyboard tests.<br>
Exit: scripted controller-only journey has no dead end at 720p/800p/1080p, and all scroll/focus remains visible.

### Phase 4 — Automated browser boundary

Extend the existing `scripts/performance/playwright.config.mjs`, stable semantic
scenario fixtures and production-build provenance checks. Add an init-script
Gamepad mock and touch-gesture/controller journey cases in that harness. Use
its documented pinned ephemeral Playwright installation; do not introduce a
second configuration/framework or casually add a persistent dependency.

Pure Vitest covers the broad state machines; browser coverage is mandatory for
focus, capture, event isolation and real DOM wiring. Raw evidence remains
outside runtime delivery with compact hash-linked summaries.

Rollback: disable the runtime adapter if browser parity fails; retain regression evidence and working keyboard/touch paths rather than deleting the acceptance lane.<br>
Exit: browser boundary verifies polling, focus, prompts, flow safety, scroll, and reconnect with no hardware.

### Phase 5 — Optional haptics

Work:

- Add **haptics.ts/test.ts**, capability detection, settings UI, and semantic hooks.
- Coordinate timing only through VFX/audio semantic events.

Dependencies: none; web API only.<br>
Rollback: no-op port or setting Off.<br>
Exit: unsupported/rejecting actuators never affect input or completion.

### Phase 6 — Steam Deck delivery qualification

Work:

- Document production Chrome/Edge Flatpak IDs, permissions, launch flags, Steam Input layout, and persistent profile.
- Run the complete primary-route hardware checklist and store versioned evidence.
- If a release requirement needs PWA or native packaging, present the observed failure and a bounded option to the Human/root owner. Neither service-worker work nor a Linux pipeline starts implicitly from a failed test.
- Keep Proton exploratory.

Dependencies: physical Steam Deck, Xbox controllers, television/dock, production HTTPS host. Linux Tauri additionally needs Linux CI/WebKitGTK/AppImage build dependencies.<br>
Rollback: packaging routes are independent; controller support remains valid in shared React/browser targets.<br>
Exit: release checklist signed with exact hardware/software versions.

### Expected file impact

Likely core additions/changes:

- **src/gamepadControls.ts**
- **src/gamepadControls.test.ts**
- **src/useGamepadControls.ts**
- **src/inputContext.ts**
- **src/inputContext.test.ts**
- **src/controllerNavigation.ts**
- **src/controllerNavigation.test.ts**
- **src/ControllerPrompts.tsx** or UI-plan equivalent
- **src/App.tsx** or extracted UI components
- **src/movementControls.ts/test.ts**
- **src/pointerControls.ts/test.ts**
- current controller/help styles
- **docs/ARCHITECTURE.md**
- **docs/RELEASE_CHECKLIST.md**

Files that should not need gameplay changes:

- **src/game/engine.ts**
- **src/game/levels.ts**
- **src/session.ts**
- **src/navigation.ts**, except only if a shared return-stack helper is demonstrably needed
- **src/sound.ts** and **src/music.ts**, except an optional idempotent request boundary that preserves trusted-activation behavior
- **src-tauri/** during core controller phases

## 15. Automated test plan

### Pure unit tests

**Mapping and normalization**

- all standard Xbox button indices and four axes;
- missing buttons/axes default neutral without throwing;
- **pressed** and value fallback;
- trigger enter/release hysteresis;
- standard accepted, empty mapping rejected, adapter registry isolated;
- ID/index never treated as durable identity.

**Edges and holds**

- first exposure press quarantined;
- neutral arms exactly once;
- A/B/X/Y/Menu/View rising edges fire once until release;
- D-pad/stick tap emits one move;
- the first repeat is due at the shared 160ms interval, matching first-step travel; later ordinary repeats use the same current export;
- actual callback sampling never advances travel to a future scheduled time;
- direction change emits one immediate step and resets cadence;
- frame delay emits one repeat, never catch-up bursts;
- face buttons never repeat.

**Axes**

- below 0.24 drift produces no input or mode change;
- 0.55 enter and 0.35 release boundaries;
- horizontal/vertical dominance;
- 0.12 tie band retains latch;
- exact first-sample diagonal uses vertical tie-break;
- threshold-crossing order wins;
- perpendicular roll qualifies by elapsed time with 0.15 advantage at 40/60/90Hz, and never double-dispatches;
- opposite reversal is responsive;
- at most one cardinal output per poll.

**D-pad arbitration**

- D-pad overrides stick;
- opposing directions cancel;
- perpendicular most-recent wins;
- same-poll tie deterministic;
- releasing winner activates remaining held direction once.

**Ownership/lifecycle**

- zero, one, and multiple pad arrays with null holes;
- simultaneous claims choose lowest index;
- non-active drift/input cannot steal;
- active disconnect clears and enters reconnect context;
- index reuse increments generation;
- reconnect held press quarantined;
- swap requires neutral;
- blur, hidden, navigation, actual modal entry/exit, incompatible/cancelled presentation and teardown clear input state; eligible successful presentation start/end suspend and revalidate live intent rather than erasing it;
- permission/API errors leave other input working.

**Input context/focus**

- every modal/top layer blocks movement;
- only free gameplay allows movement;
- B closes exactly one highest layer;
- modal opening action cannot activate the new surface;
- disabled/hidden/inert/zero-size controls are skipped;
- geometry scoring, explicit neighbours, ordered lists, edge non-wrap;
- safe default and last-focus restoration;
- Book section/page actions and scroll target;
- Sound-menu open edge cannot activate its default item; each registered semantic transport action dispatches exactly once only in the topmost Sound context; B restores the captured invoker or safe default; move/hint/story/menu actions cannot leak through;
- maze/tester focus registration enumerates canonical campaign order and stable IDs, including an inserted-level fixture, without a fixed count;
- input-mode jitter filters and controller return rules.

**Corner/fairness**

- controller, keyboard, and on-screen exact cardinals receive no assist;
- only the documented free-board mode retains safe wall-only assist; anchored joystick and hybrid pad produce exact cardinals;
- board pending-tap/drag classification, immutable guide/intent anchor, exclusive cross-source hold, capture cancellation and compatibility mouse events never add an unintended move;
- stationary-door taps remain at origin; successful door/combat/rescue/jump/portal presentations permit only current live held intent at fresh normal cadence, with no queued or stale-direction action; release/cancel during any lock prevents later movement;
- engine output and one-action semantics are unchanged.

**Haptics**

- unsupported actuator no-op;
- effects list absent;
- synchronous throw/rejected promise swallowed and reported diagnostically;
- intensity/off scaling;
- clear/reset lifecycle;
- cues never gate gameplay.

### Browser integration without physical hardware

WebDriver and CDP currently have keyboard/pointer/touch/wheel inputs but no standard gamepad injection [R13][R14]. CI should mock the application boundary, not claim OS-driver coverage.

Use **page.addInitScript()** before navigation to:

- replace **Navigator.prototype.getGamepads** with a test-owned nullable array;
- expose a test helper that changes structural button/axis snapshots and timestamps;
- dispatch synthetic **gamepadconnected/gamepaddisconnected** events with a structural **gamepad** property when a real constructor is unavailable;
- control rAF/time with Playwright Clock where suitable [R15][R16].

Browser scenarios:

- cold title: exposure press consumed, A begins, Story A starts;
- D-pad and stick taps move exactly one grid coordinate;
- held movement follows cadence; diagonal/drift do not leak;
- controller opens Hint, Story, Book and game menu, then selects the future PT32 camera spans without recreating Normal/Big;
- Help/Book/pickers page and auto-scroll with focus visible;
- protected switch, restart, and reset cannot receive opening A;
- missing-item and too-strong feedback acknowledge safely;
- scripted exit reaches pending completion; Stay preserves position/run, Next banks once, Restart safely confirms without rewards; earned detail returns to the precise Book focus/scroll;
- disconnect during movement/modal/Book stops actions; replacement reconnect restores;
- controller → mouse/touch/keyboard → controller changes prompts/focus correctly;
- idle and unchanged polling causes zero whole-App React commits;
- hidden/focus return never replays a move.

Playwright can also connect to a launched WebView2 host through CDP for a Windows shell smoke test, but mocked JavaScript state still does not prove physical Gamepad delivery [R25].

## 16. Manual hardware test matrix

Record for every run: Deck LCD/OLED model; SteamOS channel/build; Steam client; dock firmware; browser/PWA/Tauri build and engine version; controller model/firmware; USB/Bluetooth; TV model; resolution/refresh; Steam Input template; Flatpak permissions; production origin/profile.

### Required combinations

| Route | Mode | Controller | Display | Status |
|---|---|---|---|---|
| Windows hosted Edge/Chrome | Normal browser | Xbox USB + Bluetooth | Desktop/TV | Shared-app hardware gate; separate from Deck |
| Windows Tauri portable/installed | Native WebView2 | Xbox USB + Bluetooth | Desktop/TV | Shared-app hardware gate; no browser equivalence claim |
| Chrome hosted/browser shortcut | Gaming Mode | Xbox USB | Deck 1280×800 and TV 720p/1080p60 | Primary release gate |
| Chrome hosted/browser shortcut | Gaming Mode | Xbox Bluetooth | Deck and TV 720p/1080p60 | Primary release gate |
| Installed Chrome PWA, if packaged | Gaming Mode | Xbox USB + Bluetooth | Deck and TV | PWA gate |
| Edge documented alternate | Gaming Mode | Xbox USB + Bluetooth | Deck and TV | Primary-route alternate |
| Chrome/Edge | Desktop Mode | Xbox USB + Bluetooth | Deck and TV | Diagnostic/setup comparison |
| Linux Tauri AppImage | Gaming + Desktop | Xbox USB + Bluetooth | Deck and TV | Fallback gate only |
| Windows NSIS via selected Proton | Gaming Mode | Xbox USB + Bluetooth | Deck and TV | Exploratory; never promotes from one pass |

Add 4K60 as a scaling/latency stress case, not the minimum supported output. Check overscan/safe area, TV Game Mode, motion smoothing disabled, HDMI audio, input latency, display unplug/replug, and source switching [R22].

### Journey checklist for each release candidate

- Cold boot and launch shortcut from Gaming Mode with Xbox controller only.
- Preconnected pad, connect after launch, first button exposure, first axis exposure.
- Begin/Continue, title grid, picker, tester picker where enabled.
- Read/advance/skip Story.
- Maximized primary/compact landscape and all future PT32 spans; D-pad and stick taps; long holds; rapid direction changes; exact diagonals; near-threshold drift.
- Hint, Help, game menu, Home, Mazes, Book, Sound-menu open/close, mute, previous, next, shuffle, approved loop, and Restart. Verify focus returns to each originating Sound control and no gameplay action leaks while the menu is topmost.
- Book focus navigation, section jumps, page/continuous scroll from top and bottom.
- Every confirmation with A held while opening; confirm no fall-through.
- Missing item, too-strong enemy, rescue/pickup/presentation locks.
- Pending completion, Stay here, Next maze, safe Restart and save/reopen while pending; earned-achievement detail and return to its Book item.
- Reset-progress safe default and explicit destructive selection.
- Xbox Guide/Steam and Quick Access overlays; return without stuck/replayed input.
- Suspend/resume on title, gameplay, story, Book, and confirmation.
- Active-pad power-off/unplug; Bluetooth sleep/reconnect; USB replug; switch USB↔Bluetooth.
- External Xbox plus Deck built-in; two external controllers; inspect duplicate physical/virtual entries.
- Steam Input Gamepad default/on/off comparison; confirm no supported configuration requires mouse emulation.
- Return to controller after real keyboard, mouse, touch, and Deck trackpad activity.
- Exit back to Steam with controller only and ensure browser/app process closes.

### Save/network/audio matrix

- Online cold load and repeat launch from the persistent profile.
- Network loss during play.
- Warm-cache relaunch; if PWA is claimed offline, fully offline cold relaunch.
- Browser/PWA/service-worker update with existing save.
- Normal exit, forced Steam exit, Deck reboot, suspend, browser update.
- Verify no private/kiosk profile is ephemeral.
- Verify Sound-menu state/focus restoration, mute, previous/next/shuffle/approved-loop semantics, cold audio activation behavior, HDMI output, and silent fallback. Plan 08 may leave physical audibility rows pending, but mocked/controller journeys must still prove exactly one typed command per new button edge.
- For Tauri, verify separate local storage path and no implied migration from browser origin.

Hardware evidence is mandatory because mocked CI cannot prove USB/Bluetooth drivers, Flatpak permissions, Steam Input virtualization, WebView host delivery, transport-specific mapping, rumble, or television latency.

## 17. Performance constraints

The performance plan owns final profiling budgets; controller implementation must satisfy these architectural constraints:

- at most one **navigator.getGamepads()** call per active RAF;
- no active RAF while hidden/unfocused; only a 4Hz visible/focused discovery probe when no exposed pad exists;
- bounded work over the small returned pad set and standard 17-button/4-axis layout;
- no **setState** or external-store notification for unchanged per-frame raw values;
- zero whole-App React commits caused by idle controller polling;
- React updates only for semantic actions, connection/status changes, prompt-mode changes, or focus changes;
- movement dispatch occurs in the next poll with no arbitrary debounce;
- no accumulated repeat catch-up after frame stalls;
- avoid per-frame arrays/objects/closures where practical; reuse mutable refs/typed structures internally and publish immutable discrete events;
- haptic promises never block input;
- instrument poll duration, action latency, RAF count, and React commits on Steam Deck. Proposed target for normalization/dispatch is below 0.5ms p95 on target hardware, subject to the performance owner's measured budget.

Existing gameplay renders on actual movement/feedback, which is appropriate. The ban is on frame-rate React rendering simply because a controller is connected.

## 18. Accessibility and reduced-motion requirements

- All functions are available through digital D-pad/button input; analog sticks/triggers are accelerators, never the only method [R7][R8].
- No simultaneous chord, rapid mash, or long hold is required. Destructive actions use safe default + explicit navigation + new press; a long hold is not the only safeguard [R7][R11].
- Focus order follows visible layout, remains on screen, and can always move away using the same controller.
- A and B semantics stay consistent. Prompts are visible and programmatically named.
- At 720p/800p/1080p and normal couch distance, focus and essential prompt text remain readable; general UI sizing remains the UI/UX owner's responsibility.
- Controller focus is not color-only; status such as connected/disconnected, selected/current, lock, and error is text/icon plus visual treatment.
- Modal focus is contained; background gameplay is inert both semantically and at the input dispatcher.
- Right-stick scrolling has D-pad/trigger alternatives. Focus auto-scroll avoids trapping the player in a scroll area.
- Reduced motion removes focus/prompt pulsing, smooth auto-scroll, and nonessential controller-triggered animation. It does not change input timing or silently disable a separate haptic preference [R21].
- Haptics Off and intensity are available if haptics ship, and every cue has non-haptic feedback [R10].
- Preserve keyboard Enter/Space/Tab/Escape, pointer cancellation, touch controls, ARIA names, and screen-reader announcements.
- The semantic action architecture must permit future in-app remapping even though remapping UI is not v1.

## 19. Risks, mitigations, and migration

| Risk | Mitigation / rollback |
|---|---|
| Browser exposes pad only after interaction | Static “press any button” copy; events + probe; consume exposure press; neutral arm. |
| Gamepad press does not create HTML user activation | Preserve audio contract; no synthetic-activation claim; hardware-test and accept silent fallback. |
| Stick drift causes movement/prompt flicker | 0.24 radial deadzone, 0.55/0.35 hysteresis, deliberate-only mode switching, hardware tuning. |
| Diagonal or duplicate movement | Single cardinal resolver, one intent per sample, D-pad priority, active-owner generation. |
| Modal opening press confirms new modal | Context generation + release/neutral gate + safe default. |
| Background movement under dialogs | One canonical **getInteractionPolicy()** used by every source; regression tests. |
| Presentation/overlay returns with held input | Clear on both edges of lock/visibility/context; drop rather than queue; no catch-up. |
| Responsive UI changes break focus graph | Stable semantic IDs/groups, geometry fallback, explicit overrides only for ambiguity; coordinate with UI owner. |
| Steam Input supplies duplicate or synthetic pointer | Sticky deliberate owner; one pad only; 500ms mouse-move suppression; supported template is Gamepad. |
| Non-standard mapping | Fail visibly/safely; explicit tested adapters only. |
| WebView2/Tauri host differs from browser | Independent hardware gates; keep core web implementation host-neutral. |
| Haptics reject or vary | No-op port, catch all failures, separate setting, never essential. |
| PWA/offline claim loses saves | Stable origin/profile, service-worker version tests, packaging kept separate. |
| Browser ↔ Tauri route changes lose progress | Treat stores as distinct. Decide/export/import migration before promoting a different route; never imply automatic transfer. |
| App monolith/concurrent plans create merge conflicts | Reinspect HEAD; land pure modules first; integrate through UI plan's extracted contracts; never overwrite unrelated work. |
| Corner-assist behavior correction surprises keyboard users | Explicit source tests, release note, game-design signoff; rollback is source-policy flag, not engine change. |

Controller ID, active index, raw states, focus history, input mode, and repeat state are session-transient and are not written into **session.ts**. Optional haptic preference is separate from progress and survives Reset Progress. No save-version bump is needed for core support.

## 20. Coordination with the other seven plans

1. **UI/UX layout:** owns PlayShell/HUD geometry, the persistent information/control deck, More surface, target sizes, DialogShell markup, typed UI/top-overlay state, base stable focus IDs/groups, and responsive styles. Controls supplies canonical **InputContext/getInteractionPolicy**, game-menu action requirements, optional navigation-neighbour metadata, prompt view model, and controller focus state. Land one shared semantic policy over the UI-owned state.
2. **Game design:** owns gameplay rules/difficulty and the language of “pause.” Controls fixes the direct-input assist policy to exact cardinal movement; game design signs off on the documented pointer-only exception and no queued move across presentations.
3. **Performance:** owns measured CPU/battery/render budgets. Controls provides poll/action/commit instrumentation and enforces no idle React commits.
4. **VFX:** owns visual feedback. It exposes semantic start/end/cancel events; controls suspends eligible live intent during successful in-maze effects, cancels on incompatible boundaries, and may request haptic hooks without dictating visuals.
5. **Animation:** owns motion timing/flourish. Controls requires deterministic input-lock lifetime, reduced-motion parity, cancellation, and no stale replay.
6. **Audio:** retains trusted user-activation, mute, and failure-isolation contracts. Controls may request audio but cannot manufacture trusted activation from Gamepad polling.
7. **Delivery/release:** owns PWA manifest/service worker, Steam shortcut artwork/packaging, Linux CI/AppImage, and release evidence. Controls defines Gamepad/Steam Input requirements and runs the controller hardware matrix; packaging does not fork controller behavior.

Historical UI-plan notes proposed a Big Maze focus deck. UI-03 instead removes
the two-mode distinction and supplies the maximized landscape composition.
Consume current tester visibility, stable semantic controls and scroll containers;
do not recreate the historical placement or mode.

## 21. Acceptance criteria

### Controller-only completion

- [ ] Given the application has been opened from its supported Steam shortcut, an Xbox controller alone can expose/connect, focus Begin/Continue, and complete every major flow.
- [ ] No essential action requires hover, touch, mouse, keyboard, trackpad, or Deck touchscreen.
- [ ] Separate title and Home, maze/tester selection, compact Story dialogue, maximized primary/compact landscape gameplay, Hint, Help, game menu, Book and earned-detail viewer, the complete Sound menu, Restart, confirmations, feedback, pending completion and Reset are controller-complete against the accepted UI inventory.
- [ ] Stay here / Next maze / Restart use Gameplay's default focus and exactly-once durable boundaries. B safely stays without rewards; returning from a viewer/menu restores its exact valid invoker and scroll context.
- [ ] Sound opens through a distinct semantic action; mute/previous/next/shuffle/approved-loop each dispatch exactly once only while that menu is topmost; B restores the exact stable invoker or declared safe fallback; the opening/closing edge never activates a transport or gameplay action.
- [ ] Every controller-navigable element has a clearly visible, on-screen focus state suitable for television viewing.
- [ ] B removes exactly one topmost layer; A confirms; displayed prompts always match the action.

### Movement

- [ ] D-pad Up/Down/Left/Right taps each attempt exactly one maze square.
- [ ] Left-stick cardinal taps each attempt exactly one maze square.
- [ ] Ordinary first taps and held/repeated steps use the current shared 160ms interval and remain equally smooth. Actual callback sampling never substitutes a future deadline or creates a catch-up burst; historical 320ms/260→160ms timing is not restored.
- [ ] Stick drift below the deadzone never moves Ame or changes prompts.
- [ ] A diagonal produces at most one deterministic cardinal direction and never a double move.
- [ ] Direction changes are immediate under the specified arbitration and reset repeat timing.
- [ ] Controller, keyboard, hybrid pad and anchored joystick have identical exact-cardinal engine behavior; only the explicitly retained free-board mode receives documented corner assist.
- [ ] Board tap/anchored drag and hybrid-pad tap/hold/drag satisfy PT08 without duplicate moves, moving anchors or camera-relative drift; physical iPad evidence is recorded honestly.
- [ ] MOVE-01 actor/camera travel remains comfortable under normalized keyboard, touch, pad and controller attempts; no cadence change, second interpolation clock or frame-rate App publication is introduced.

### Safety and lifecycle

- [ ] Modal confirmations cannot be activated by the same button press that opened them.
- [ ] Reset and Restart default to the safe action and require explicit selection/new A edge for destructive action.
- [ ] No gameplay input reaches the maze behind a modal, Story, picker, game menu, victory, reconnect layer, or presentation.
- [ ] No gameplay or global shortcut reaches the maze behind the Sound menu; opening/closing it clears held input, changes generation, and requires a neutral/new edge.
- [ ] Blur, hidden, actual modal/context transition, navigation, disconnect, controller swap and cancelled/incompatible presentations clear input; returning never replays stale intent. Eligible successful in-maze effects suspend rather than erase live intent.
- [ ] Wired/Bluetooth connect, active disconnect, replacement, and reconnect are graceful and never corrupt/save unintended state.
- [ ] Multiple pads use deterministic first-deliberate ownership and never double-dispatch.
- [ ] Successful door/combat/rescue/jump/portal continuation revalidates the still-live source/run/generation and current direction after all locks end. Steering is observed during the effect; release/cancel prevents movement; taps never traverse automatically. Every fresh deliberate failed attempt explains again, but a continuous blocked hold cannot flood modals.
- [ ] Controller disconnect never traps keyboard/touch users or discards the underlying dialog/story/Book state.

### Compatibility and performance

- [ ] All spans 4/5/6/7, default 6, are reachable with keyboard, touch/pointer and
  controller in the existing game menu, with visible selection, safe focus
  return and no gameplay leakage. Default selection and stored/clamped behavior
  match PT32 without resizing the HUD or reintroducing the removed Big/Normal modes.
- [ ] Zoom preserves identical legal moves/rewards/reveal history, correct
  pointer/effect geometry, edge/small-map clamps and MOVE-01 comfort across
  primary/compact landscape sizes and motion modes. Preference reload/reset/error
  paths are proven separately from campaign saves.
- [ ] Existing shared-harness measurements cover all four spans and report
  visible workload, rendition/decoded/paint cost and input/travel regressions;
  Plan 07B receives exact evidence for final integrated requalification.
- [ ] Keyboard, pointer, touch, and on-screen direction controls continue to work.
- [ ] Existing movement, pointer, navigation, engine, session, story, audio, and progress tests remain green.
- [ ] Controller polling causes no continuous whole-application React rerenders and zero idle polling commits.
- [ ] Polling stops while hidden/unfocused and never catches up repeats.
- [ ] Audio activation/mute failure isolation, save integrity, reduced-motion behavior, and gameplay rules do not regress.
- [ ] Unsupported mappings/haptics fail visibly or silently as specified without breaking other input.

### Steam Deck release

- [ ] The primary Chrome/Chromium hosted/PWA non-Steam route is documented with exact current package/version, permissions, launch options, profile, and Steam Input Gamepad layout.
- [ ] Gaming Mode launch-to-exit works controller-only with Xbox USB and Bluetooth on real Steam Deck/TV hardware.
- [ ] Desktop Mode setup is explicitly separated from the normal consumer journey.
- [ ] Linux Tauri is not promoted until its full WebKitGTK/AppImage hardware gate passes.
- [ ] Windows WebView2 through Proton is not presented as a supported fallback.
- [ ] The recommended Steam Deck route is verified through the documented real-hardware checklist before release.

## 22. Open gates

These do not block pure shared-app implementation, but block a release claim:

- **Delivery owner:** confirm the exact current Chrome Flatpak application ID and whether **/run/udev:ro** is required on the chosen SteamOS channel.
- **Audio owner + hardware QA:** determine whether each qualified browser/webview starts current Web Audio from controller-only navigation; document silent fallback where it does not.
- **UI/controls integration:** verify canonical `src/inputContext.ts` and
  `getInteractionPolicy()` consume—not duplicate—UI-owned DialogShell,
  `src/ui/interactionState.ts`, game-menu markup and stable control IDs.
- **Game-design/root owner:** verify the explicit free-board-only corner assist policy against accepted MOVE-01/Gameplay tests; changed rule semantics require a Human decision, but the existing exact-cardinal direction is already adopted.
- **Performance owner:** replace the provisional 0.5ms p95 polling target with measured Deck evidence.
- **Release owner:** decide whether offline PWA is required for launch or a hosted connection is acceptable.
- **Tauri owner:** if fallback qualification starts, define Linux CI baseline, AppImage support policy, WebKitGTK/libmanette evidence, and browser-to-webview save migration.

## 23. Sources

All web sources were accessed **2026-09-02**. Numeric deadzones, hysteresis, tie bands, repeat timings other than the repository's existing gameplay cadence, ownership policy, and route recommendation are engineering proposals informed by these sources, not requirements imposed by them.

- **[R1]** [W3C Gamepad Working Draft, 10 July 2025](https://www.w3.org/TR/gamepad/) — API model, snapshots, exposure gesture, fully active document, standard mapping, indices, events, RAF polling, permissions, haptics.
- **[R2]** [MDN: Using the Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API) — focused-page exposure, connect/disconnect practice, mapping and normalized values.
- **[R3]** [MDN: Permissions-Policy gamepad](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy/gamepad) — policy and default allowlist.
- **[R4]** [HTML Living Standard: activation-triggering input event](https://html.spec.whatwg.org/multipage/interaction.html#activation-triggering-input-event) — trusted activation inputs; Gamepad is not listed.
- **[R5]** [Chromium standard gamepad mappings source](https://chromium.googlesource.com/chromium/src/+/HEAD/device/gamepad/gamepad_standard_mappings.h) — Chromium's platform mapping implementation.
- **[R6]** [Microsoft: Gamepad and vibration](https://learn.microsoft.com/en-us/windows/uwp/gaming/gamepad-and-vibration) — Xbox controls, radial deadzone discussion, and vibration hardware.
- **[R7]** [Xbox Accessibility Guideline 107: Input](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/107) — digital/analog alternatives and single non-simultaneous presses.
- **[R8]** [Xbox Accessibility Guideline 112: UI navigation](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/112) — full controller navigation, predictable focus, A/B and section/page conventions.
- **[R9]** [Xbox Accessibility Guideline 113: UI focus handling](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/113) — visible, on-screen focus for distant/low-vision players.
- **[R10]** [Xbox Accessibility Guideline 110: Haptic feedback](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/110) and [MDN: Gamepad vibrationActuator](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad/vibrationActuator) — off/intensity alternatives and limited browser support.
- **[R11]** [Xbox Accessibility Guideline 115: Error messages and destructive actions](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/115) — confirmation/error prevention; hold cannot be the only safeguard.
- **[R12]** [Tauri 2: Webview versions](https://v2.tauri.app/reference/webview-versions/) and [Tauri process model](https://v2.tauri.app/concept/process-model/) — WebView2 on Windows, WebKitGTK on Linux, runtime variability.
- **[R13]** [W3C WebDriver Working Draft: input sources](https://www.w3.org/TR/webdriver2/#input-sources) — no gamepad input source.
- **[R14]** [Chrome DevTools Protocol: Input domain](https://chromedevtools.github.io/devtools-protocol/tot/Input/) — no gamepad injection command.
- **[R15]** [Playwright: Mock browser APIs](https://playwright.dev/docs/mock-browser-apis) — init-script API mocking.
- **[R16]** [Playwright: Clock](https://playwright.dev/docs/clock) — deterministic timers, performance time, and RAF tests.
- **[R17]** [Steam Input: Gamepad emulation best practices](https://partner.steamgames.com/doc/features/steam_controller/steam_input_gamepad_emulation_bestpractices) and [Steam Input concepts](https://partner.steamgames.com/doc/features/steam_controller/concepts) — virtual gamepad and legacy remapping behavior.
- **[R18]** [Valve: Steam Deck updates, including Chromium controller support for websites](https://www.steamdeck.com/en/news?p=141) — browser/Deck input collaboration.
- **[R19]** [Microsoft: Xbox Cloud Gaming in Edge with Steam Deck](https://support.microsoft.com/en-us/edge/xbox-cloud-gaming-in-microsoft-edge-with-steam-deck) — Discover install, non-Steam shortcut, **/run/udev** override, kiosk URL, controller layout, Gaming Mode.
- **[R20]** [Steam Deck Desktop FAQ](https://help.steampowered.com/en/faqs/view/671A-4453-E8D2-323C) and [Steam Deck software](https://www.steamdeck.com/en/software) — Desktop versus Gaming Mode and adding desktop apps.
- **[R21]** [Xbox Accessibility Guideline 117: Visual distractions and motion](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/117) and [WCAG 2.2](https://www.w3.org/TR/WCAG22/) — reduced motion and focus/consistent-input foundations.
- **[R22]** [Valve: Steam Deck docking guidance](https://help.steampowered.com/en/faqs/view/4C18-08B5-DEC9-3AF4) and [Deck compatibility review](https://partner.steamgames.com/doc/steamhardware/compat) — television latency, glyph, controller, launcher, and text expectations.
- **[R23]** [Tauri 2: AppImage](https://v2.tauri.app/distribute/appimage/) and [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) — Linux bundle and WebKitGTK build requirements.
- **[R24]** [Tauri 2: GitHub Actions](https://v2.tauri.app/distribute/pipelines/github/) — Linux build pipeline guidance.
- **[R25]** [Playwright: WebView2](https://playwright.dev/docs/webview2) — CDP connection to a WebView2 host.
- **[R26]** [Microsoft WebView2 overview](https://learn.microsoft.com/en-us/microsoft-edge/webview2/) and [WebView2Feedback issue 3127: Proton/Wine compatibility](https://github.com/MicrosoftEdge/WebView2Feedback/issues/3127) — Windows support boundary and unresolved Linux/Wine request.
- **[R27]** [Wine bug 59370: WebView2 blank/black rendering](https://list.winehq.org/hyperkitty/list/wine-bugs@list.winehq.org/thread/UDZKZTMP5WYISOAUDGEOMFOSU7X73JND/) — current compositor limitation.
- **[R28]** [web.dev: PWA installation](https://web.dev/learn/pwa/installation) — Linux desktop PWA install surface; installability is distinct from offline capability.
- **[R29]** [WebKit Gamepad implementation issue](https://bugs.webkit.org/show_bug.cgi?id=133847) and [WebKitGTK 2.44.2 release notes](https://webkitgtk.org/2024/05/16/webkitgtk2.44.2-released.html) — Linux WebKit Gamepad history and axis-first discovery fix.
- **[R30]** [Microsoft: WebView2 feature/API overview](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/overview-features-apis) and [WebView2Feedback issue 4366: Xbox controllers in an embedded host](https://github.com/MicrosoftEdge/WebView2Feedback/issues/4366) — embedded-host architecture and evidence that controller delivery can differ from Edge-the-browser.
