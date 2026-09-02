# Controls, Xbox Controller, and Steam Deck Plan

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

- Add feature-detected, user-adjustable haptics with a complete no-haptics path.
- Add Playwright browser integration coverage once a repository test dependency is approved.
- Make the hosted app installable/offline-capable as a separately scoped PWA packaging task.

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

## 3. Evidence and audit record

### Repository and test evidence

- Initial inspection: **main** at **c6b6628b6e651d18161a4d1302935d3096f665c6**, clean working tree.
- No **AGENTS.md** was present.
- A read-only focused baseline run passed 59/59 tests in **movementControls.test.ts**, **pointerControls.test.ts**, **navigation.test.ts**, and **stageScale.test.ts**.
- The repository has React 19, Vite 8, TypeScript 7, and Vitest 4. It does not currently install Playwright, Vitest Browser Mode, jsdom, happy-dom, or Testing Library.
- The requested skill search found the exact trusted OpenAI-curated **playwright** skill. It was installed at user scope under the Codex skill directory, outside this repository. The documented experimental catalog path was unavailable. The installed skill becomes usable in a later turn; it is not a package dependency and changed no repository file.

### In-app browser audit

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
| **src/movementControls.ts:9-63** | Shared held-move authority: immediate edge, 320ms initial delay, then a smooth 260ms-to-160ms repeat curve over 16 repeats; direction change resets cadence. Reuse it for controller gameplay. |
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

### Existing correctness defects to resolve before adding a fourth input source

1. **No canonical modal gate.** **modalOpen** includes level/reset pickers and result states, but **attemptMove**, the keyboard eligibility check, and the held-input clearing effect use different boolean subsets. Arrow/WASD can move behind some inert dialogs. Controller integration must first derive one **InputContext** and **gameplayInputAllowed** policy.
2. **Corner-assist authority is contradictory.** Project documentation and this brief call it pointer-only, but **attemptMove** currently routes keyboard and on-screen directions through the same resolver. The target decision is explicit: free-form board steering (mouse/touch) retains corner assist; discrete keyboard, controller, and on-screen buttons issue exact cardinals without assist. This restores the documented contract and makes direct-input fairness predictable.
3. **Presentation carry-over is underspecified.** The current latest-only **queuedMove** can survive short locks and some presentations. Controller holds must never replay after a rescue, combat, door, portal, jump, modal, or route transition.
4. **Book focus starts on an invisible non-action heading.** **Adventure Book** receives focus at an H1 with **tabIndex=-1**, while controller needs a safe actionable default and persistent focus indicator.
5. **Restart is a timing-based two-activation control.** The 2.2-second “Restart/Again!” state is weak for a controller and vulnerable to naïve repeated activation. Replace it with the same safe confirmation architecture used elsewhere.

## 5. Interactive inventory and target focus behavior

| Context | Current controls and focus | Current keyboard/pointer behavior | Controller target and current blocker |
|---|---|---|---|
| **Title** | Sound; Begin/Continue; Choose maze; Book; Surprise; Reset; secret version/tester. Play is force-focused although Sound is first in DOM. | Native Tab/Shift+Tab and Enter/Space; pointer clicks. | Default Begin/Continue. D-pad/stick traverse the visual grid; A activates; View opens Book. No current controller source. |
| **Story** | One Start button, auto-focused; card/backdrop. | Start, pointer anywhere, or almost any key dismisses. | A advances/starts; X skips; B closes/skips; scroll controls if overflow. Opening input is quarantined. |
| **Gameplay: Normal** | Optional tester picker; Story; Big; New maze; board; Hint; on-screen directions; Home/Mazes/Book/Help/Sound/Restart. Board is force-focused. | Arrow/WASD move; pointer/touch steer; arrows can hold. Tab reaches HUD/actions; header controls sit before board. | D-pad/left stick move. Y Hint, X Story, View Book, Menu game menu. A is intentionally unbound during free movement because interactions are movement-driven. |
| **Gameplay: Big Maze** | Compact status, tester/story/Normal/New, board, map. Sidebar utilities are hidden. | Movement still works; Escape exits Big only when no higher surface. | Same movement and shortcuts. B exits Big; Menu always exposes Resume, view mode, Home, Mazes, Book, Help, Sound, Restart. |
| **Game menu (new P0 surface)** | Does not exist. | Utilities are individual buttons, and some disappear in Big. | Safe default Resume; declarative actions for Normal/Big, Hint, Story, Mazes, Book, Help, Sound, Restart, Home. Menu/B close. Input is paused/blocked while open; game-design owns whether simulation is described as “pause.” |
| **Hint** | Close X first; Got it. | Modal trap; Escape/X/Got it closes and restores trigger. | Default Got it; A acknowledges; B closes; no opening-edge fall-through. |
| **Help** | Close X first; long instructions; Let’s explore. | Modal scroll. At 720p content/action overflows initial view. | Default Let’s explore; D-pad focus; right stick or triggers scroll; B closes; focus stays visible. |
| **Missing item** | Close X; explanatory copy; acknowledgement. | Auto-opens after blocked move, clears some held input, returns to board. | Default acknowledgement; A or B closes; all movement is cleared and neutral-gated. |
| **Too strong** | One acknowledgement; no X/Escape close. | Auto-opens after encounter and clears hold. | A acknowledges; B performs the same safe close. No haptic-only information. |
| **Choose maze** | X; unlocked authored levels; Surprise. Scrollable list. | Modal trap and Escape. Choosing another run may open protected confirmation. | Default current/first unlocked maze, not X. D-pad/stick navigate; A chooses; B closes; triggers page-scroll. |
| **Tester picker** | X; all 16 story levels; Back. Scrollable list. | Modal trap; tester runs suppress story, progress writes, and rewards. | Same picker rules. Current maze gets default focus; all 16 entries and Back are reachable. Debug-only visibility remains UI-plan owned. |
| **Different-maze confirmation** | X; Keep this maze; Start the new maze. | First focus is X. | Safe default Keep this maze. A executes only after neutral gate; B cancels. |
| **Reset-progress confirmation** | X; Keep my adventure; Yes, reset everything. | First focus is X; destructive action is adjacent. | Safe default Keep my adventure. Destructive action requires explicit navigation plus a new A edge after neutral; never a long hold as the only method. |
| **Restart confirmation (replace armed state)** | Current Restart becomes Again! for 2.2s. | Second click/activation restarts. | Open a real confirmation with Keep playing default and Restart maze secondary. It follows modal generation/release rules for every modality. |
| **Victory/rewards** | Next maze/test maze/Surprise default; Play again. Normal victory also shows reward breakdown/new rewards. No X/Escape return. | A focused action works by keyboard; background inert. | Default Next. D-pad reaches Replay and a visible Return Home action; A activates; B returns Home as labelled. View/other global shortcuts are suppressed while this top layer is active. |
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
 └─ win ─> Victory ─> next Story/new Game, Replay, or Title
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

The UI plan currently proposes **DialogShell**, **UtilityNav**, **GameScreen**, **TesterTools**, a layered CSS tree, and **getInteractionPolicy()**. Do not create a competing policy or dialog shell. Controls owns the types and state transitions; UI owns the responsive component/layout implementation and consumes stable IDs such as **data-control-id**, **data-focus-group**, and optional neighbour overrides.

### Core types

~~~ts
export type InputMode = "controller" | "keyboard" | "pointer" | "touch";
export type InputSource =
  | "gamepad-dpad"
  | "gamepad-stick"
  | "keyboard"
  | "board-pointer"
  | "board-touch"
  | "onscreen-direction";

export type InputContext =
  | "title"
  | "story"
  | "gameplay"
  | "gameplay-presentation"
  | "game-menu"
  | "help"
  | "hint"
  | "missing-item"
  | "too-strong"
  | "level-picker"
  | "tester-picker"
  | "switch-confirm"
  | "restart-confirm"
  | "reset-confirm"
  | "victory"
  | "book"
  | "controller-disconnected";

export type InputAction =
  | { type: "move"; direction: Direction; phase: "edge" | "repeat"; source: InputSource }
  | { type: "navigate"; direction: Direction }
  | { type: "confirm" }
  | { type: "back" }
  | { type: "menu" }
  | { type: "book" }
  | { type: "hint" }
  | { type: "story" }
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
5. Stop RAF and clear all raw/held/repeat/haptic state on blur, hidden, teardown, or unsupported permissions. RAF is normally suspended in background tabs, but explicit clearing prevents stale holds.
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

- Enumerate all pads but support one active player.
- With no owner, the first standard pad that produces deliberate input after a neutral sample wins. If multiple qualify in the same poll, the lowest current index wins.
- Ownership is sticky while connected; drift or input on another pad cannot steal it.
- Represent ownership as **{ index, connectionGeneration }**, never a persisted identity.
- On active disconnect: clear movement/actions/haptics immediately; open a non-destructive reconnect layer; preserve the game/session; do not let another pad's pre-held state act.
- A reconnected or replacement standard pad claims through neutral plus deliberate input. Its claim press dismisses/acknowledges ownership only when it arrived held; the next press resumes. Restore the last valid focus, otherwise the context fallback.
- Test a physical/virtual duplicate pair under Steam Input. A second enumerated entry must not double-dispatch.

### Clearing table

Every item below increments the context/input generation and clears button edges, stick/D-pad latch, movement/UI repeat, prior direction, queued controller action, and pending haptic:

- blur or **document.visibilityState === "hidden"**;
- entry to or exit from any modal, story, game menu, picker, feedback, or victory layer;
- screen/route navigation, level load, restart, reset, Home, Book, tester swap;
- active controller disconnect, reconnect generation, or controller swap;
- start and end of a gameplay presentation lock;
- unmount/teardown.

Keyboard, pointer, touch, and on-screen held state should be cleared through this same policy. This fixes the existing background-movement gap rather than creating a gamepad-only workaround.

## 9. Maze movement algorithm

### Digital edge and hold

- A D-pad rising edge or left-stick direction activation immediately calls **attemptMove(direction, source)** exactly once.
- Holding the same direction then uses **HELD_MOVE_INITIAL_DELAY_MS = 320** and the existing 260ms-to-160ms curve from **movementControls.ts**.
- A release before 320ms is a one-square tap.
- A late RAF may emit at most one due repeat and then schedule from “now.” It never emits a burst to catch up.
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
- a perpendicular rolled-stick change must beat the current axis by 0.15 for two consecutive polls, then emits one immediate edge and restarts cadence;
- an intentional opposite-direction reversal at or beyond 0.55 may switch after one sample because its sign change is unambiguous.

The resolver returns zero or one cardinal direction per sample. It never returns a diagonal and never emits two moves for the two axes.

### D-pad arbitration

- Opposing buttons on one axis cancel that axis.
- If perpendicular buttons are held, the most recently pressed direction wins.
- A same-poll perpendicular tie uses the same vertical tie-break.
- Releasing the winning direction may activate the still-held direction once, immediately, and restart cadence; it cannot replay historical repeats.

### Presentation and modal behavior

- Free gameplay is the only context in which controller movement can dispatch.
- During the short 64ms moved and 45ms bump gates, scheduler time continues but cannot generate catch-up moves; the next normal due time may attempt.
- Rescue, combat, door, portal, jump, story, modal, navigation, victory, and reconnect transitions clear controller movement and require neutral. Inputs during those locks are dropped, not queued.
- Holding the stick across unlock does not move Ame. The player must return to neutral, then deliberately move again.
- Modal entry clears existing keyboard, pointer, touch, and on-screen holds too; opening a picker can no longer allow background Arrow/WASD movement.

### Corner assistance and fairness

Controller input receives **no corner assistance**. D-pad, left stick after cardinal resolution, keyboard, and on-screen directional buttons all express an exact cardinal choice and go directly to **movePlayer** through **attemptMove**.

Only free-form pointer/touch steering on the maze board keeps the existing one-tile, wall-only corner assist, because that modality asks the app to infer intent from a continuous point. This is fair by intent class: every discrete cardinal source has identical collision/rule/cadence behavior, while imprecise direct steering retains its small usability aid. Update tests and architecture documentation so the behavior can no longer drift accidentally.

## 10. Xbox mapping by context

The invariant rules are: **A confirms**, **B closes/backtracks one layer**, **Menu opens the game menu**, **View opens/toggles the Book**, **Y is Hint**, and **X is Story**. Buttons with no valid action do nothing and are omitted from prompts.

| Context | D-pad / left stick | A | B | X | Y | View | Menu | LB/RB | LT/RT / right stick |
|---|---|---|---|---|---|---|---|---|---|
| Title | Move focus | Activate | No action at root | No action | No action | Open Book | No action | No action | Scroll only if a responsive title surface overflows |
| Story | Focus/page direction if needed | Advance; final page starts maze | Skip/close to game | Skip story | No action | No action | No action | Previous/next page if stories later paginate | Page/continuous scroll when card overflows |
| Gameplay Normal | Move Ame | No action | Open game menu | Read chapter | Hint | Open Book | Open game menu | No action | No action |
| Gameplay Big | Move Ame | No action | Return to Normal | Read chapter | Hint | Open Book | Open game menu | No action | No action |
| Game menu | Move focus | Activate item | Resume/close | As labelled only | As labelled only | Open Book if enabled | Resume/close | Change explicit menu tabs only if added | Scroll |
| Help/Hint/Missing | Move focus | Acknowledge/activate | Close | No action | No action | No action | No action | No action | Page/scroll |
| Too strong | Move focus (one action) | Acknowledge | Acknowledge/close | No action | No action | No action | No action | No action | Scroll if required |
| Maze/tester picker | Navigate list/grid | Select | Close/back | No action | No action | No action | No action | Previous/next logical list section/page | Page/continuous scroll |
| Switch/Restart/Reset confirm | Select safe/destructive action | Activate after release gate | Cancel/keep | No action | No action | No action | No action | No action | Scroll if required |
| Victory | Select Next/Replay/Home | Activate | Return Home | No action | No action | No action while modal is topmost | No action while modal is topmost | Move reward pages only if UI later paginates | Scroll rewards |
| Adventure Book | Navigate actionable controls/records | Activate | Return to prior screen | No action | No action | Return to prior screen | Open game menu when a run exists | Previous/next Book section | Page up/down; right stick continuous scroll |
| Reconnect layer | No game action | Acknowledge after controller is armed | No game action | No game action | No game action | No game action | No game action | No game action | No game action |

Context-sensitive actions are limited to their named domain:

- B always removes the topmost layer. Big Maze is a view layer, so B returns to Normal; Normal gameplay's next layer is the game menu.
- X always concerns story: open it during play, skip it while it is open.
- View always concerns the Adventure Book: open it, or return from it.
- Shoulder/trigger actions exist only where the visible prompt names a section/page/scroll affordance.
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

- Title: Continue/Begin.
- Story: Start/Continue.
- Gameplay: board logical movement focus.
- Game menu: Resume.
- Informational feedback: acknowledgement action.
- Picker: current maze, else first enabled maze.
- Switch/Restart/Reset: safe cancel/keep action.
- Victory: Next.
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
- if the primary browser cannot start audio from controller-only input, the game remains fully playable silently and the release note is honest. A wrapper autoplay policy may be investigated separately without weakening web security.

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

- Reinspect **App.tsx**, the UI plan's **DialogShell/getInteractionPolicy**, current tests, and all concurrent changes.
- Establish **src/inputContext.ts** as the single input/top-layer contract, with controls owning types/state and UI owning markup/layout.
- Add failing regressions for movement behind level/reset pickers and stale input crossing presentations.
- Encode the chosen assist policy: pointer/touch board steering only; discrete directions exact.
- Capture screen/focus IDs and a controller-only journey fixture.

Dependencies: existing Vitest only.<br>
Rollback: test-only and pure-policy changes can be reverted without state migration.<br>
Exit: every current top layer maps to exactly one context; no movement behind any top layer.

### Phase 1 — Pure gamepad core

Work:

- Add **gamepadControls.ts/test.ts**.
- Implement standard mapping, normalization, neutral gate, button edges, active ownership, stick latch, D-pad arbitration, gameplay/UI repeat clocks, and reset reasons.
- Reuse/export **movementControls.ts** cadence rather than copy values.

Dependencies: none.<br>
Rollback: module is unreferenced until Phase 2.<br>
Exit: all unit matrices pass with injected pads/timestamps; zero browser globals in the pure module.

### Phase 2 — Browser lifecycle and semantic dispatch

Work:

- Add **useGamepadControls.ts**.
- Implement events, discovery probe, RAF, current snapshots, visibility/focus cleanup, StrictMode-safe teardown, and errors/status.
- Route output through typed **InputAction**, then into existing navigation handlers and **attemptMove** with explicit **InputSource**.
- Consolidate all modality clearing under the canonical policy.
- Add a temporary internal feature switch or isolated hook mount so controller input can be disabled without reverting unrelated refactors.

Dependencies: browser Gamepad API only.<br>
Rollback: disable/unmount the gamepad hook; keyboard/pointer/touch remain intact.<br>
Exit: mocked unit/browser harness can connect, arm, move, clear, disconnect, and reconnect without duplicate listeners or state replay.

### Phase 3 — Focus, prompts, and controller-first surfaces

Work:

- Add **controllerNavigation.ts**, stable control IDs/groups, defaults, remembered focus, auto-scroll, and explicit modal generation.
- Add controller prompt view models and accessible Xbox badges.
- Add the game menu and a real restart confirmation.
- Make title, Story, Normal/Big gameplay, Help, Hint, feedback, both pickers, switch/reset/restart confirmations, victory, and Book complete.
- Add visible Return Home on victory.
- Update board/help accessible copy to name controller controls.
- Add explicit controller focus CSS in the UI plan's current style structure.

Dependencies: UI plan's component/DialogShell landing order. No package dependency.<br>
Rollback: controller surfaces are behind the hook/feature switch; retain stable semantic IDs for keyboard tests.<br>
Exit: scripted controller-only journey has no dead end at 720p/800p/1080p, and all scroll/focus remains visible.

### Phase 4 — Automated browser boundary

Preferred option:

- Add **@playwright/test** as a dev dependency only after approval.
- Add **playwright.config.ts**, **tests/controller.e2e.ts**, and an init-script gamepad mock.
- Run Chromium in CI; keep pure Vitest as the broad state-machine suite.

Alternative: Vitest Browser Mode with **@vitest/browser-playwright**, but do not add both initially.

The user-scoped Codex Playwright skill installed during planning is tooling guidance, not a repository dependency.

Rollback: remove the optional integration lane without changing runtime controller code; unit/manual gates remain.<br>
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
- Only then decide whether to add manifest/service-worker PWA work.
- If the web route fails a release requirement, qualify Linux Tauri AppImage as the one fallback.
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
- hold begins at 320ms and follows the exact shared repeat curve;
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
- perpendicular roll needs 0.15 advantage for two polls;
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
- blur, hidden, navigation, modal entry/exit, presentation start/end, and teardown clear all state;
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
- input-mode jitter filters and controller return rules.

**Corner/fairness**

- controller, keyboard, and on-screen exact cardinals receive no assist;
- board mouse/touch retains current safe wall-only assist;
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
- controller opens Hint, Story, Book, game menu, Big/Normal;
- Help/Book/pickers page and auto-scroll with focus visible;
- protected switch, restart, and reset cannot receive opening A;
- missing-item and too-strong feedback acknowledge safely;
- scripted level-one win reaches rewards, Next, Replay, Home;
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
- Normal and Big Maze; D-pad and stick taps; long holds; rapid direction changes; exact diagonals; near-threshold drift.
- Hint, Help, game menu, Home, Mazes, Book, Sound, Restart.
- Book focus navigation, section jumps, page/continuous scroll from top and bottom.
- Every confirmation with A held while opening; confirm no fall-through.
- Missing item, too-strong enemy, rescue/pickup/presentation locks.
- Victory rewards, Next, Replay, Return Home.
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
- Verify sound mute state, cold audio activation behavior, HDMI output, and silent fallback.
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

1. **UI/UX layout:** owns PlayShell/HUD geometry, command/focus deck, More surface, target sizes, DialogShell markup, and responsive styles. Controls supplies **InputContext**, stable focus IDs/groups, game-menu action requirements, prompt view model, and controller focus state. Land one shared interaction policy.
2. **Game design:** owns gameplay rules/difficulty and the language of “pause.” Controls fixes the direct-input assist policy to exact cardinal movement; game design signs off on the documented pointer-only exception and no queued move across presentations.
3. **Performance:** owns measured CPU/battery/render budgets. Controls provides poll/action/commit instrumentation and enforces no idle React commits.
4. **VFX:** owns visual feedback. It exposes semantic start/end/cancel events; controls clears/neutral-gates at presentation boundaries and may request haptic hooks without dictating visuals.
5. **Animation:** owns motion timing/flourish. Controls requires deterministic input-lock lifetime, reduced-motion parity, cancellation, and no stale replay.
6. **Audio:** retains trusted user-activation, mute, and failure-isolation contracts. Controls may request audio but cannot manufacture trusted activation from Gamepad polling.
7. **Delivery/release:** owns PWA manifest/service worker, Steam shortcut artwork/packaging, Linux CI/AppImage, and release evidence. Controls defines Gamepad/Steam Input requirements and runs the controller hardware matrix; packaging does not fork controller behavior.

The inspected concurrent UI plan also proposes moving tester tools behind **?debug=mazes**, replacing whole-stage gameplay scaling, and giving Big Maze a focus deck. This plan depends only on stable semantic controls and scroll containers, not their final placement.

## 21. Acceptance criteria

### Controller-only completion

- [ ] Given the application has been opened from its supported Steam shortcut, an Xbox controller alone can expose/connect, focus Begin/Continue, and complete every major flow.
- [ ] No essential action requires hover, touch, mouse, keyboard, trackpad, or Deck touchscreen.
- [ ] Title, maze selection, tester selection, Story, Normal/Big gameplay, Hint, Help, game menu, Home, Mazes, Book, Sound, Restart, confirmations, feedback, victory, rewards, Next, Replay, Return Home, and Reset are controller-complete.
- [ ] Every controller-navigable element has a clearly visible, on-screen focus state suitable for television viewing.
- [ ] B removes exactly one topmost layer; A confirms; displayed prompts always match the action.

### Movement

- [ ] D-pad Up/Down/Left/Right taps each attempt exactly one maze square.
- [ ] Left-stick cardinal taps each attempt exactly one maze square.
- [ ] Held movement uses the shared 320ms/260→160ms cadence and is smooth/predictable.
- [ ] Stick drift below the deadzone never moves Ame or changes prompts.
- [ ] A diagonal produces at most one deterministic cardinal direction and never a double move.
- [ ] Direction changes are immediate under the specified arbitration and reset repeat timing.
- [ ] Controller, keyboard, and on-screen directions have identical exact-cardinal engine behavior; pointer/touch board steering alone receives documented corner assist.

### Safety and lifecycle

- [ ] Modal confirmations cannot be activated by the same button press that opened them.
- [ ] Reset and Restart default to the safe action and require explicit selection/new A edge for destructive action.
- [ ] No gameplay input reaches the maze behind a modal, Story, picker, game menu, victory, reconnect layer, or presentation.
- [ ] Blur, hidden, modal/context transition, navigation, disconnect, controller swap, and presentation start/end clear input; returning never replays a held move.
- [ ] Wired/Bluetooth connect, active disconnect, replacement, and reconnect are graceful and never corrupt/save unintended state.
- [ ] Multiple pads use deterministic first-deliberate ownership and never double-dispatch.

### Compatibility and performance

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
- **UI/controls owners:** agree merge order and exact location of **InputContext/getInteractionPolicy**, DialogShell, game menu, and stable control IDs.
- **Game-design owner:** sign off the explicit pointer/touch-only corner assist correction.
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
