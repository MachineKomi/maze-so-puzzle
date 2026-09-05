# UI-03 final modal cost and Static victory observation

Recorded 2026-09-05 against the existing locked production build from runtime
source `68e303da680d5aec0ba71154949c5a2a0d1697ae`. This closes the missing bounded
observation for intake **UC-13** and **UC-29**, and supplies a current **UC-10**
round-close proof. It does not qualify universal performance or Human taste.
The preview server and both browser sessions were closed after observation.

The actual Hint modal maintained approximately 60 Hz rAF cadence with its
14px backdrop blur at both sampled sizes. No sampled interval exceeded 50ms and
no long task was observed. Renderer CPU work was somewhat higher with blur;
GPU execution time was not measured. The actual ordinary Static victory had
zero active animations for the complete four-second observation and stayed
readable without scrolling. Twelve confetti nodes remain as stationary clipped
colored tips; there is no falling confetti. This is recorded as an authored
Static appearance for Human review, not incorrectly described as absent nodes.

## Source, host and method

- Existing locked `dist` served by `node node_modules/vite/bin/vite.js preview
  --host 127.0.0.1 --port 4173 --strictPort`; no build, installation, runtime
  source change or dependency change was made. Build provenance is copied into
  the external measurement record.
- External Playwright **1.62.1**, Node **24.13.1**, headless Microsoft Edge
  **152.0.4191.62** on Windows. CDP reports ANGLE Direct3D11 on **Intel Iris Xe**,
  driver **30.0.101.1692**. These are Windows measurements at emulated dimensions
  and DPR, not a physical iPad or WebView2 timing claim.
- Fresh disposable browser context per size: **1920×1080 DPR1** and
  **1194×834 DPR2**. Ordinary Play → Begin → Start → HUD Hint, with no seeded
  save, test scene or production instrumentation. Full motion and full surface
  quality stayed enabled; the actual background scene continued animating.
- Compared the actual fullscreen `.modal-backdrop` computed
  `blur(14px) saturate(0.85)` with a temporary browser-only inline
  `backdrop-filter:none`. The same modal content, tint, surface and scene stayed
  mounted. The original inline state was restored before closing the context.
  This isolated the blur comparison; it was not presented as the actual Static
  fallback, whose stronger tint was observed separately during victory.
- Six 2.5-second rAF windows per size, ordered **blur / none / none / blur /
  blur / none**, with 400ms settling after each change. Each window supplied
  151 frame intervals. Screenshots were outside the measurement windows.
  `Performance.getMetrics` before/after supplied renderer main-thread task,
  script, layout and style work; a Long Tasks observer supplied long-task data.
- The final DPR2 pair additionally recorded `devtools.timeline` and frame trace
  categories. Nested trace event durations are listed independently and must
  not be added into a fabricated total. No GPU timer queries were taken.

## Actual modal measurements

All windows had a median rAF interval of approximately 16.6–16.7ms. Individual
CPU totals below are milliseconds over approximately 2,514ms, not milliseconds
per frame. The first desktop blur window had materially higher task work and
one 33.3ms interval; warm-up and host variation prevent attributing that entire
difference to the filter. No sample was discarded.

| Size / DPR | Window | Condition | rAF p95 ms | Maximum ms | Renderer task ms | Trace |
|---|---:|---|---:|---:|---:|---|
| 1920×1080 / 1 | 0 | Blur | 16.8 | 33.3 | 766.472 | No |
| 1920×1080 / 1 | 1 | None | 16.8 | 16.9 | 362.147 | No |
| 1920×1080 / 1 | 2 | None | 16.8 | 16.9 | 276.100 | No |
| 1920×1080 / 1 | 3 | Blur | 16.8 | 16.9 | 309.258 | No |
| 1920×1080 / 1 | 4 | Blur | 16.8 | 17.0 | 318.709 | No |
| 1920×1080 / 1 | 5 | None | 16.9 | 17.0 | 244.902 | No |
| 1194×834 / 2 | 0 | Blur | 16.9 | 17.1 | 257.178 | No |
| 1194×834 / 2 | 1 | None | 16.8 | 17.0 | 237.734 | No |
| 1194×834 / 2 | 2 | None | 16.8 | 16.9 | 212.210 | No |
| 1194×834 / 2 | 3 | Blur | 16.9 | 17.0 | 240.248 | No |
| 1194×834 / 2 | 4 | Blur | 16.9 | 17.1 | 279.736 | Yes |
| 1194×834 / 2 | 5 | None | 16.9 | 17.0 | 246.527 | Yes |

The adjacent traced DPR2 pair differed by **33.209ms of renderer task CPU over
the approximately 2.514-second window**, or approximately **0.22ms per recorded
frame interval**, with unchanged 16.9ms p95 cadence. This is a bounded observed
delta including the background scene, browser instrumentation and scheduling;
it is not an isolated shader cost, a GPU duration or a repeatable universal
0.22ms filter allowance.

The traced DPR2 pair recorded the following CPU events. `Paint`/`RasterTask`
duration events were not present in this category capture; their absence does
not establish zero painting, compositing or GPU work.

| Event | Blur total ms | None total ms | Blur maximum ms | None maximum ms |
|---|---:|---:|---:|---:|
| UpdateLayoutTree | 49.576 | 44.130 | 0.626 | 0.733 |
| Layout | 8.869 | 8.102 | 0.116 | 0.232 |
| PrePaint | 27.019 | 24.302 | 0.659 | 0.598 |
| Layerize | 55.257 | 46.890 | 0.862 | 0.999 |

Visual review of both actual captures confirms the full blur separates the
foreground text/card from the maze substantially more than the controlled
no-blur comparison. The cream text field, generous Hint art and soft outer glow
remain legible in both. The bounded evidence does not indicate a filter-induced
frame-pacing failure requiring a runtime correction. It also does not establish
a universal filter budget: this is one settled Hint over one animated level,
with short repeated windows on one host, no modal-entry latency measurement,
no GPU duration, no battery/thermal run, and no physical-device qualification.
Plan 07B and the family/device review retain those responsibilities.

## Static victory: complete ordinary observation

Selected **static Surface quality through the real Sound & comfort radio**;
motion remained full and the OS preference remained no-preference. This proves
Static independently suppresses animation rather than relying on Reduced.
Started an ordinary fresh Little Star Trail and pressed Right, Right, Right,
Up, Up, Up. Its actual rescue, six-step completion and three newly earned
keepsakes were produced by normal play. No outcome or reward was injected.

A MutationObserver armed before the final move began the recording when the
actual victory mounted. Across **241 rAF samples from 2.6ms to 4,009.6ms**, the
victory subtree had **zero active animations**. There was no moving friend,
falling confetti, animated transition or backdrop blur. The four full-screen
captures were byte-identical (SHA-256
`e5f8bee5b41eadb8452c63e2b67447d6298b0680d8e99cae823804e26fd07d72`).
Capture filenames contain requested offsets; JSON records actual elapsed
timestamps, which include screenshot completion overhead.

The twelve confetti DOM nodes have `animation:none` and are positioned mostly
above their clipping area. Their colored lower tips form a stationary dotted
accent at the top of the celebration content. This small visible distinction
is disclosed to root/Human review; the sequence is not described as having no
confetti nodes or as an animation failure. The broad gradient friend card,
golden star, perfect-rescue emphasis and earned artwork retain celebratory
meaning without movement.

Root independently inspected the final 1194px and 568px captures, acknowledged
these stationary tips and accepted the composition without a runtime change.
That engineering disposition does not claim the family's visual acceptance.

At **1194×834 DPR2**, the dialog body measured **619px client / 619px scroll**.
The whole story, six-step summary, rescued unicorn, perfect-rescue text,
**+24 gold stars**, reward arithmetic, total 24 and all three named keepsakes
were visible, together with Next maze, Stay here and Restart.

The same real victory was then inspected at **568×320**: body **188px client /
188px scroll**, dialog bottom **299.19px**, footer bottom **297.19px** within
the 320px viewport. The authored emergency layout retains the large friend,
complete story, +24, total, reward arithmetic, three keepsake pictures and all
three actions. Decorative greeting/chapter metadata/step summary and visible
keepsake names use the already documented compact treatment; they are not
claimed simultaneously visible. This is the existing compact disposition,
not a new exception or a test of every maximum-content victory.

## Remaining round-close proof

Opened the real ordinary **Choose a maze** dialog at 1194×834 DPR2. Its close
control measured **48×48 CSS px**; its **20×20** inner span is centered with
equal 14px offsets. The two 22×3px code-native strokes cross at the span's
center. Normal, hover and keyboard captures were inspected: the X reads
centered within the circle. Escape closed the picker. This is a meaningful
remaining X because the picker contains alternative maze actions; the ordinary
Hint continues to have its single Got it acknowledgment.

## Evidence and reproduction

External evidence directory:
`C:/Users/hellb/Documents/Maze so Puzzle/review-evidence/ui03-final-modal-cost/`

- `measurement.json`: exact provenance/host, all raw frame intervals, long-task
  observations, CPU deltas, traces' summaries, Static samples/content/geometry.
- `hint-1194-blur-trace.json`, `hint-1194-none-trace.json`: complete CDP traces.
- `hint-{1920,1194}-dpr{1,2}-{blur,none}.png`: actual controlled modal comparison.
- `static-victory-1194-{0,500,1500,3500}ms.png` and `static-victory-568.png`:
  actual Static sequence and compact composition.
- `maze-picker-round-close.png`, `round-close-{normal,hover,keyboard}.png`,
  `round-close.json`: close-control appearance, measured geometry and Escape.

The bounded runners are outside the repository at
`C:/Users/hellb/AppData/Local/Temp/maze-ui03-final-modal-cost.cjs` and
`C:/Users/hellb/AppData/Local/Temp/maze-ui03-final-modal-close.cjs`. They require
the existing external Playwright 1.62.1 path recorded in their imports and the
unchanged production preview on port 4173. They do not install or rebuild.
No page errors were observed. This report is the only repository file created
by this final observation task; no runtime or release state was changed.
