# V22-UI-01 — short-height fit, collections and reward warmth

Latest Human refinement2026-09-06: [V23-02/04 intake](../playtests/2026-09-06-v0223-v0224-intake.md)
adds visible right-panel Chill/walk/Zippy control, Regular default, and coherent
speaker+cog settings icon. The bounded UI-01A correction addresses the reported
phone pad/minimap overlap; physical P9 acceptance remains open. These
belong to the short-height/control composition slice, not the independent native
Exit fix; preserve praised desktop/iPad placement and existing focus contracts.

Checkpoint 2026-09-06: native Exit `19f08a1` and compact gameplay/Book UI-01A
`840293d` (evidence `517667d`) are independently accepted; see the
[Exit review](../reviews/2026-09-06-ui-native-exit-01-astra-review.md) and
[UI review](../reviews/2026-09-06-ui01a-astra-review.md). v0.22.5 V22-PHONE1 is
frozen at `7282665f8631051785176b701b1a7f14b7fe24a3`.
Web and Windows published; final native checks and all four public downloads
independently verified. No camera/FOV/audio/save/gameplay/content change or additional
unfinished-run restart from v0.22.4. P9 covers compact fit/Book/native Exit;
P5–P8 remain cumulative, and physical iPad camera acceptance stays open.

Next runtime writer: root Astra for the separate
[AUDIO-01V2 joint decision](../reviews/2026-09-06-audio01v2-joint-decision.md),
with actual Sol reviewing; v0.22.5 publication is complete. Do not restart
the UI-01A prototype. Remaining Home/dialog/victory propagation, full 200% text
coverage, HUD pace/settings art and optical refinements need later scoped review;
the full UI plan and root PT36-before-04 gate are not closed by this checkpoint.

Remaining UI owner: **GPT-5.6 Sol**, when separately assigned
Independent reviewer: **GPT-6 Astra**

## 1. Outcome

Preserve the praised v0.22.0 desktop/iPad interface while making landscape phone
screens feel like the same game at a smaller, coordinated scale—not an oversized
scrolling web page. Complete the Human's requested Bestiary, pad, Book, pickup
and victory refinements without changing puzzle framing or input semantics.

Engineering prerequisite reconciliation, Astra 2026-09-06: V22-PERF-01/R1 and
PERF-02A are reviewed/published; the Human's iPad scrolling result still fails.
Under the latest express continuation authority, that physical feedback gate
does not block independent Exit/UI corrections indefinitely. PLAY-B is released
in v0.22.4; native Exit and bounded UI-01A are now independently accepted. Further
short-height work uses an explicitly frozen source and reference views, with no
matched camera measurement/correction simultaneously in flight. Preserve the six-tile camera,
cadence, renderer and accepted performance constraints. Rebase/remeasure later
camera experiments against the actual UI source; never reuse unmatched timing.

The historical [technical preflight](../reviews/2026-09-06-v22-ui01-preflight.md)
identified the native close bridge/permission and conflicting compact deck/map/pad
minima addressed by the accepted seams. Preserve their reviewed close and existing
height-aware fit owners; do not start a replacement scaling engine. Further
propagation needs its own review. Actual final-native process exit/reopen remains
a release gate, not a mocked browser close or compile-only assertion.

## 2. Locked preservation

- Title/Home composition, warm rounded type, large maze/minimap, Power hierarchy,
  stable feedback area, picture-led Friends/Bag and quick sound access.
- The square six-tile gameplay camera and exact engine/solver/save rules.
- Hybrid pad tap/hold/drag behavior and full invisible hit sectors.
- Friends page visibility policy; Bestiary hiding does not apply to Friends.
- Mobile's liked movement/audio and generous pickup-feedback prominence.
- Full/reduced/static accessibility semantics and distinct keyboard focus.

## 3. Work

### 3.1 Short-height system

UI-01A's bounded gameplay/Book fit was accepted at 844×390, 780×312 and 568×320, with
primary geometry preserved and 960×540 covered. Keep that evidence; remaining
Home/dialog/victory propagation is not yet accepted. Coordinate available height,
deck minima, typography, optical art and internal spacing; a global scalar is an option, not authority.
Never shrink required hit areas with the visible art/text.

At normal text size:

- gameplay simultaneously exposes the complete square board plus Power/currency,
  objective, minimap, feedback, Hint, More and bottom-right pad, without document
  or deck scrolling, clipping or a black area left by a scrolled-away board;
- Home preserves left actions/right cast and exposes actions/progress without
  page scrolling;
- the Book header/tabs fit without mid-word breaks; only the collection body
  scrolls and at least one complete maze/friend/guardian/achievement card is
  visible;
- short lore and Sound/Comfort fit with their actions; long story text may use
  one bounded body scroller with a fixed unobscured action;
- victory never scrolls.

At enlarged text, the documented accessible reader/overflow treatment may be
used; do not claim normal-text failure is accessibility behavior.

### 3.2 Exact Human refinements

- UI-NATIVE-EXIT-01: platform-aware normal close with browser-safe fallback is
  published in v0.22.5. Final-release pointer/keyboard process exit and save/settings
  reopen passed root's native qualification; physical P9 remains separate. Normal OS X/Alt+F4 is the workaround
  for older builds without the repair.

- Replace four boxed pad buttons at rest with larger open dark-plum code-native
  chevrons that feel drawn into the pad. Keep ≥48px sectors and clear pressed,
  suggested, focus and disabled states.
- Bestiary: at zero, one charming message, one anonymous silhouette and `0/N`;
  partial, only discovered entries in canonical ID order and `n/N`; complete, a
  restrained acknowledgement. Do not disclose unknown identity or use encounter
  order.
- Add previous/next navigation within the eligible ordered lore collection,
  keyboard/pad compatibility and an optional robust touch swipe. Preserve focus,
  return scroll and undiscovered filtering.
- Show the **current generated level's** actual `width × height` in its in-game
  label. Do not show pre-generation settings as resolved truth.
- Optically enlarge Book mute/settings glyphs inside existing circles; prevent
  tab seam/notch artifacts and mid-word labels; slightly improve card art/action
  hierarchy without reducing useful density.
- Use restrained warm glow/lift and a convincing press-down for pointer states;
  retain a separate obvious `:focus-visible`/forced-colour signal.
- Make the accepted `More` disclosure open and close smoothly without a flash,
  abrupt geometry jump, late reflow or awkward focus/scroll movement.
- Bring desktop pickup art/text toward the liked phone prominence. Do not shrink
  phone feedback or obscure adjacent puzzle information.
- Recompose victory around large rescued-friend art as the hero, prominent reward
  and subordinate story/detail. Keep Next/Stay/Restart immediately available.
  Full motion uses staggered or gently replenished bounded celebration that is
  still visibly alive around four seconds; reduced/static remain complete and
  lovely without motion. Scale celebration by meaningful completion state only
  if existing data supports it without new reward rules.

Only after the phone contract passes, compare the supplied 1194×834 and 1024×768
iPad references and modestly enlarge the specific V22-14/15 targets: locked-door
art; Play/Resume and best-step information; friend sprites; and feedback-band
text/icons. Preserve card density, minimap/bag space and the quiet feedback
band's stable bounds. Do not let these optical adjustments undo the successful
primary composition or introduce filler.

## 4. Exclusions

- No FOV/window-shape/camera/cadence change, controller architecture or input
  lifecycle rewrite.
- No new art generation, UI skin, broad HUD/minimap redesign, terrain/lighting,
  presentation director, sound redesign or reward/gameplay rule.
- No Bestiary-style concealment on Friends and no filler in the quiet feedback
  band.
- No App-wide refactor, persistence schema, campaign, generator or media change.

## 5. Acceptance matrix

- 1920×1080, 1280×720, 1194×834 and 1024×768 retain the approved Title/Home,
  maze/map/HUD and Book density in side-by-side captures.
- 960×540, 844×390, 780×312 and 568×320, including safe-area cases and the physical
  Samsung, meet every normal-text fit rule above.
- 0/1/partial/all Bestiary, all five Book tabs, maximum card copy, friend/enemy
  lore edges, Sound/Comfort, long story and maximum-content victory are covered.
- Pad tap/hold/drag, board drag, keyboard, focus, scroll ownership, swipe conflict,
  modal return, 200% text and reduced/static motion remain correct.
- `More` opens and closes attractively without jump, flash, late reflow or lost
  focus; disclosure motion respects reduced/static settings.
- Side-by-side 1194×834 and 1024×768 evidence shows the requested locked-door,
  Play/Resume/best-step, friend-sprite and feedback-band optical increases without
  a density, fit, minimap or Bag regression.
- Full celebration has bounded nodes/timers and no retained work after close;
  performance counters do not regress the accepted V22-PERF-01 baseline.
- Run focused tests, `npm run check`, `npm run perf:check`, relevant production
  browser matrices, `npm run check:desktop` and `git diff --check` serially.

Sol preserves a green candidate on a recoverable `codex/` branch. Astra reviews
the exact diff/evidence before main/release promotion. Human desktop/iPad/phone
playtest is final product acceptance; unresolved low-priority Stats/PT39 work is
routed honestly rather than claimed complete.
