# Original Maze UI direction — focused primary-source research

Date: 2026-09-05. Purpose: translate the Human's named game references and detailed
v0.21.0 rejection into practical, original correction principles. This is a
bounded design review, not a claim of exhaustive research or comparative testing
of the referenced games. The implementation intake is
`../playtests/2026-09-05-v021-ui-correction-intake.md`.

## What the evidence actually supports

The Human's fifteen screenshots are direct evidence of Maze's composition and
art-size differences. Their play account supplies the motion and interaction
findings that stills cannot establish. The external sources below are official
publisher/developer sites and standards guidance consulted on this date. Game
pages establish the described features and give useful reference galleries;
they do not publish the proprietary UI implementation or prove an exact timing,
font, shader or camera technique. Nintendo image fetches were unavailable through
the research browser, so this note does not claim frame-level examination of
those external galleries or trailers.

### Named inspirations

| Primary source | Verified feature / evidence | Original Maze application (design inference) |
|---|---|---|
| [Trails in the Sky 1st Chapter — official Notebooks page](https://trailsfirstchapter.com/system/notebook/) | The official page separates quest/story records, enemy information, recipes and reading collections. Completed quests can receive a commemorative image and character comment; enemy records are registered through battle events. | Make the Book an organized memory of play: five distinct destinations, large selected art and short characterful lore. Keep discovery tied to actual encounters, with conservative old-save migration. The value is easy retrieval plus affection, not an encyclopedic text wall. |
| [Super Mario Bros. Wonder — official game site](https://supermariobroswonder.nintendo.com/) | The presentation centers readable character/power-up identities and surprising Wonder transformations. It also identifies beginner-friendly character choices. | Keep the ordinary interface and controls predictable, and spend surprise on authored discoveries and rewards. A victory may bloom with character and color, but the board and HUD should not unpredictably resize when a routine event happens. |
| [Super Mario Party Jamboree — official Nintendo page](https://www.nintendo.com/us/store/products/super-mario-party-jamboree-switch/) | The page presents Stars, coins and reactions as distinct meaningful signals. It describes Party/Pro choices and configurable difficulty and motion-minigame participation. | Give Maze's Power, Gold, Science and completion reward different readable silhouettes and a clear hierarchy. Comfort/input choices should be obvious and understandable. Do not import competitive loss, randomness or party-game rules into Maze's fair puzzle contract. |
| [Kirby and the Forgotten Land — official Nintendo page](https://www.nintendo.com/en-gb/Games/Nintendo-Switch-games/Kirby-and-the-Forgotten-Land-2045110.html) | Nintendo presents an inviting character-led adventure with discovery, transformed abilities and rescued Waddle Dees. | Rescued friends should be visible characters worth caring about, not tiny inventory metadata. Make a friend detail or victory dance an affectionate reward while keeping the moment concise and optional to admire. |
| [Kirby's Return to Dream Land Deluxe — official Play Nintendo introduction](https://play.nintendo.com/news-tips/game-releases/kirbys-return-to-dream-land-deluxe-game-now-available-switch/) | Nintendo describes solo/cooperative adventure and additional activities in Merry Magoland around its central cast. | Retain a coherent warm visual family across play, help, Book and victory, with scale and expressive states that remain readable in shared play. Keep controls simple and actions visibly inviting. |

These are principles, not a request to clone a menu, logo, typeface, character,
panel outline or animation. Maze keeps its own approved mint/lilac/coral/plum
world, exact wordmark, cast, icons and magical pearl/paper material language.

### Accessibility and interaction sources

1. [Microsoft Xbox Accessibility Guideline 101 — Text display](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/101)
   treats readable body text, labels, HUD information and prompts as part of
   access to the game. Its reference measurements use **visible glyph body
   height**, not just a CSS font-size declaration: it gives 18 px at 1080p for
   PC and 26 px at 1080p for console, and discusses 200% scaling. **Maze
   application:** measure actual output and context. A 44 px button containing a
   tiny thin label is not a large readable control. Text and semantic icons should
   scale together; primary iPad/desktop/couch review must not be sacrificed to
   unnecessary portrait packing. These figures are reference guidance, not a
   blanket claim that every Maze label already meets a certification standard.
2. [W3C — Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced)
   explains the 44×44 CSS-pixel target criterion and why larger frequent/coarse
   targets help. **Maze application:** distinguish hit area from visible optical
   art; both matter. Give the hybrid directional pad generous reachable sectors,
   rather than four tiny arrows or a large empty hit area with miniature symbols.
3. [W3C — Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
   describes sufficient visible focus area and contrast. It does not prescribe
   green rings. **Maze application:** replace the heavy teal treatment with an
   original component-specific plum/gold or high-contrast inset treatment that
   remains visible with keyboard input; distinguish it from hover and selection.
4. [Microsoft Xbox Accessibility Guideline 117 — Visual distractions and motion settings](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/117)
   discusses unprompted moving UI, camera movement and motion comfort, including
   quiet/opaque text backgrounds. **Maze application:** the camera and board
   should not inherit an actor's decorative bob. Reserve stable notice geometry,
   keep text readable over frosted surfaces, and let reduced/static presentation
   keep its meaning and beauty. A timed trace can identify a snap; family play
   determines whether the corrected feel is comfortable.
5. [W3C ARIA Authoring Practices — Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
   provides the tablist/tab/tabpanel model and keyboard navigation behavior.
   **Maze application:** make the Book's five pages real tabs with one active
   panel, consistent focus and clear selection. Preserve the selected page and
   card return position. Choose automatic activation only where panel switching
   is prompt; do not preload every large collection asset to manufacture it.
6. [W3C — Focus Not Obscured (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-enhanced.html)
   explains keeping a focused control fully visible. **Maze application:** fixed
   Book tabs, dialog actions and decorative frames must not obscure the current
   action when text grows or the viewport changes.

### Movement and camera sources

| Primary technical source | Supported principle | Bounded Maze recommendation |
|---|---|---|
| [MDN — requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) | Animation progress should be calculated from elapsed timestamps so it does not run faster on higher-refresh displays. The callback shares the display's timing and is commonly paused in hidden documents. | Sample actor and camera together from one elapsed-time owner. Test variable frame intervals and return from hidden/blurred states; do not advance a fixed amount per callback or replay accumulated held input after a pause. |
| [Glenn Fiedler — Fix Your Timestep](https://gafferongames.com/post/fix_your_timestep/) | Simulation and rendering can be separated; interpolating simulation states addresses visible mismatch between discrete updates and display frames. Unbounded catch-up work can worsen overload. | Keep Maze's discrete legal tile transitions authoritative and render a continuous path between them. Do not make browser frame time decide tile legality or rewards. Bound queued travel and diagnose stalls separately. This physics article does not require adding a physics engine to Maze. |
| [Itay Keren — Scroll Back, GDC 2015 slides](https://media.gdcvault.com/gdc2015/presentations/Keren_Itay_ScrollBack.pdf), [official session description](https://www.gdcvault.com/play/1022243/Scroll-Back-The-Theory-and) | The author distinguishes camera windows, smoothing, focus and boundary transitions, and emphasizes selecting techniques for the game's actual mechanics. Slides 31–35 and 79–86 contrast gradual catch-up and tailored framing. | Maze needs readable cardinal turns and predictable edge clamping, not platformer jump anticipation. Compare a camera following the continuously displayed actor with a small controlled lag only if it improves comfort. Test reversal and boundary behavior; do not combine independent easings that multiply lag or produce a first-step snap. |
| [Godot — Camera2D documentation](https://docs.godotengine.org/en/stable/classes/class_camera2d.html) | Smoothing and limits can make a camera's displayed screen center differ from its logical target; the API explicitly distinguishes them. | Use Maze's actual displayed camera for screen/world coordinate conversion and attached effects. Test pointer steering, culling and pickup anchors during movement and at clamped edges. This is a conceptual reference, not an instruction to port Godot's camera implementation. |

**Movement proposal, not a predetermined recipe:** start with one comfortable
ordinary travel duration and identical first-tap/first-held interpolation; then
compare a gentle continuous acceleration option if it improves responsiveness.
The latest Human clarification permits that acceleration. The unacceptable
pattern is an initial flash or camera jerk followed by a long relative slowdown.
Avoid resetting easing at every tile boundary during a hold. Do not smooth across
wall corners or true portal/jump discontinuities as though they were legal
ordinary segments. Acceleration, a camera dead zone and input buffering are
tuning candidates, not automatic additions to scope.

Measure input-to-first-visible-motion, first and steady tile durations, velocity
continuity, camera-relative actor movement, frame-time distribution, stop/reversal
distance and queued travel separately. Capture tap/hold/release/turns with the
same route and camera position. Averages alone conceal the exact first-step
defect the Human describes; “60 fps” alone cannot establish pleasant movement.

## Concrete design decisions to test in Maze

### 1. Begin with the painting's composition

The supplied old title/Home screenshots clearly reserve the left for interface
and the right for characters/path. Restore that relationship first. Put the
grouped Home menu in the left open region; make primary actions bold, warm and
substantial. Allow the approved cast to remain the emotional subject on the
right. Do not attempt to compensate for wrong placement with more shadows,
blur or smaller art. The reference is the actual approved Maze illustration.

### 2. Spend useful space on things a child recognizes

An enlarged friend face, sword silhouette or minimap tile communicates more than
another tiny label. Use the real current content envelope to compose the HUD;
increase optical friend/item/stat/navigation art before adding decoration. The
minimap should occupy useful area with the correct aspect ratio. Empty tracks
and centered compact content are not a compositional success merely because
all elements fit inside the viewport.

Starting design hypotheses, subject to measured fit: three clear vertical HUD
zones—identity/objective, map/collection, actions/steering—with a reserved quiet
feedback line and the pad at the lower right. A larger sparse-state inventory
must still have a deliberate dense-state layout. Do not promise arbitrary fixed
multipliers before seeing the complete composition at every required size.

### 3. Make pearl glass readable and restrained

Use a small number of purposeful surface roles: calm pearl HUD, a richer raised
primary action, warm paper Book pages, and strongly frosted modal glass. Give
text a quiet center, a bright inner rim, soft depth and a bounded outer glow.
Use actual backdrop blur only where it contributes to the requested modal
material, with a coherent opaque fallback; avoid nested continuously blurred
surfaces over a moving maze. Neither a cost prohibition nor a glow alone should
be mistaken for material design. Verify contrast and compositing cost.

### 4. Let the collected character be the reward

Book entries should have room to breathe and open into an affectionate large
portrait/card with short original lore. Earned achievements gain warm color and
depth; locked achievements remain recognizable grey art. Bestiary mystery is a
separate earned-discovery rule. Preserve existing achievements, currencies and
records; admiration should never silently create another grind or bonus system.

### 5. Simplify the action, enrich the response

A one-turn story needs one visible forward action, click/tap advancement over its
non-control content and robust Enter behavior. A small blocker needs one obvious
acknowledgment. Use a close control when it has a distinct useful job. Center
remaining glyphs optically. Avoid extra navigation effort disguised as flexible
framework controls. Preserve intentional alternative actions and safe focus
return rather than intercepting every key globally.

### 6. Celebrate with a composed finite beat

Make victory a little stage: a clear success heading, prominent rescued friends,
an individual short dance language, a restrained confetti arrival, concise reward
truth and a confident next action. Keep the whole composition visible without
scrolling. Full, reduced and static presentation should each look intentional.
The emotional emphasis comes from scale, timing and character; continuously
animating every border or spraying particles over the reading area is not needed.

### 7. Separate locomotion, camera and acting

Use one coherent cadence for ordinary first/tap/held travel, with a slightly
faster ordinary pace as requested. The Human's latest clarification permits
gentle acceleration if it improves feel; it does not require constant velocity.
The first tap must still share the smooth treatment of a held step, without an
initial flash/camera jerk and comparative crawl. Tile legality may remain exact while the visible
position progresses smoothly. Decorative hop/squash must not influence measured
board geometry or camera coordinates. A calm shoulder/sway treatment can give Ame
personality without a large repetitive vertical jump. Test camera-clamped and
tracking states separately; watch first steps, turns and rapid reversals.

### 8. Judge a complete family journey

Review Title → Home → story → play → blocker/help → pickup → rescue → victory →
next maze → Book → Resume as one experience. Capture matched progress and viewport
states when comparing versions, then watch the movement and transient events.
Include a plain first-time profile and a populated profile. A good surface must
survive ordinary play state changes, not just a staged attractive screenshot.

## Required evidence before the next preview claim

- Every `UC` intake row has an implementation/evidence disposition.
- Matched screenshots cover composition, optical scale, state styling and real
  dense content; animation samples cover first travel, notice changes, combat,
  bump, rescue and victory.
- Layout bounds stay fixed through effects and notices; legal movement and
  exact-once save/reward behavior survive the control/dialog changes.
- Runtime image selection is crisp at the display size without unbounded
  catalogue preload; budgets and modal-compositing cost are measured.
- Keyboard/touch and supported landscape sizes are verified; physical iPad,
  controller/couch and Amelia's judgment remain explicitly pending where no
  direct session has taken place.
- Root publishes a new exact-source build with deployment/package evidence and
  a short family playtest path. Visual enthusiasm is not a substitute for that
  evidence, and automated passes are not a substitute for the family response.
