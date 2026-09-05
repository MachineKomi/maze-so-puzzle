# UI-03 dialog composition review — 2026-09-05

This bounded implementation review supports [UI-03](../plans/UI-03-fp-ui1-correction.md) and the Human's [correction intake](../playtests/2026-09-05-v021-ui-correction-intake.md), especially UC-29 and UC-30. It is development-browser evidence, not release qualification or Human acceptance. Root still owns the integrated production checks and release decision.

## Changes and ownership

- `src/ui/styles/dialogs.css`: authored landscape victory compositions, more spacious Sound layout, and 32 species-specific celebration signatures.
- `src/ui/SoundDialog.tsx`: explicit music-controls section and shared layout wrapper around the existing controls. Existing audio authority, radio values, persistence and callbacks are preserved.
- Root's `App.tsx` supplies the existing motion family, actual friend count and `data-species` on each victory card. Dialog logic, focus restoration, progression and exact-once rewards remain separately owned by root and the movement/dialog logic specialist.

Victory is a warm illustrated reward with a full parade, confetti, story, currency and new keepsakes. Six existing grounded motion families now have 32 authored signatures: duration, initial phase, horizontal reach, tilt and hop differ by species. A slow Tea-Time Skeleton sway, a fast Fox scamper, Kitten sway, Dragonling waddle and Unicorn prance were sampled in the actual five-friend finale. They do not share one synchronized motion. The signatures use translation and rotation, without scale/warp, filters, camera movement or random timing. Future multi-sprite animation remains [Plan 05](../plans/05-limited-sprite-animation.md); these are programmatic signatures, not new sprite sheets.

The saved reduced-motion sample reports `animation-name: none` for all 17 sampled victory actors and confetti elements. The final comfort layer also disables animations in Static quality. Static behavior is source-reviewed here; the integrated shared suite must provide its own production evidence.

## Normal landscape geometry

The manual browser used the existing repository Playwright dependency, headless Edge and development server `http://localhost:1422`. A separate ephemeral context played Rainbow Power Parade through ordinary keyboard input. Only campaign access was seeded; game completion, friends, currency and achievements were not fabricated. The solver supplied 78 inputs, and the engine finished with 70 movement steps, five friends, the long finale outro, +42 gold stars, total 50, and two new keepsakes. Screenshots were inspected visually after the CSS changes.

| Viewport | Victory body scroll height / client height | Result |
| --- | --- | --- |
| 1920 × 1080 | 713 / 713 | No body scrolling |
| 1194 × 834 | 640 / 640 | No body scrolling |
| 960 × 540 | 343 / 343 | No body scrolling |
| 844 × 390 | 278 / 278 | No body scrolling |
| 568 × 320 | 205 / 205 | No body scrolling |

The normal-size Sound and Comfort dialog likewise has no body scrolling at 1194 × 834, 960 × 540, 844 × 390 and 568 × 320. Its short landscape variant places music, Motion and Surface quality into three authored columns. All interactive controls retain at least 48px targets. The short-layout persistence note is visually hidden but remains available to assistive technology; an actual save failure stays visible.

## Explicit compact differences and reading limits

At 844 × 390, the victory keeps five 80px portraits; only decorative friend greetings are visually hidden. At 568 × 320, the authored emergency spread retains five recognizable 64px portraits, the complete 14px finale story, gold amount/currency/total, the complete 14px reward arithmetic, recognized new-keepsake artwork, and the same 48px actions. The decorative congratulations/steps/portal summary, perfect-rescue praise banner, greetings, chapter metadata and written keepsake labels are visually hidden but remain in the accessible content. The story portrait is omitted in that smallest composition. This is an explicit compact variant, not a claim that every desktop decoration stays visible.

At 200% text on 960 × 540, Sound uses its independent dialog reader: measured scroll height 393px, client height 338px, and a successful nonzero scroll position. Its footer remains fully visible (bottom 526px within the 540px viewport). Preserving readable enlarged text requires this accessible overflow; the evidence does not claim that all content is simultaneously visible at 200%.

The longer Help reference also retains an independently scrollable reader at short landscape sizes. Its picture-led instructions and persistent footer were visually inspected. These are not simple acknowledgement popups, and this review does not claim all Help instructions fit without scrolling.

## Evidence

Local evidence directory: `C:/Users/hellb/Documents/Maze so Puzzle/review-evidence/2026-09-05-ui03-dialogs/`.

- `after-victory-{1920,1194,960,844,568}.png`: final ordinary five-friend finale composition at each target.
- `after-victory-geometry.json`: actual input fixture and measured final geometry.
- `victory-signatures.json`: five computed signatures, eight sampled translation/rotation frames and the reduced-motion result.
- `after-victory-reduced-844.png`: static composition under reduced motion.
- `after-sound-{1194,960,844,568}.png` and `after-geometry.json`: Sound layouts and geometry.
- `after-sound-200percent-960.png` and `enlarged-reading.json`: enlarged text reader and visible footer.
- `after-help-{1194,960,844,568}.png`: long Help reader review.
- `after-story-*` / `before-story-*`: introductory story composition and circular portrait review.

All bounded manual browser processes are closed. `git diff --check` passed for the dialog source files. No commit, push, version change, package or publication was performed by this specialist. Production shared-suite results, other victory variants, physical-device input and Human visual/play-feel acceptance must be reported from their actual evidence by root.
