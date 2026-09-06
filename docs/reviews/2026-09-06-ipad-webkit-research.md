# iPad / WebKit moving-world research — mechanisms, not a diagnosis

Date: 2026-09-06. Bounded primary-source research and local source review for
Astra. **There are documented WebKit rendering trade-offs and reproducible bugs
that make a moving large DOM/SVG world a credible investigation target. Nothing
found establishes that this game cannot run smoothly on the eighth-generation
iPad, or identifies one of those bugs as its cause.**

The synthesis skill was used to separate Human observation, local source facts,
maintainer explanations, reporter claims and inference. Evidence is a targeted
selection of official Apple/WebKit documentation and their public bug tracker,
not a comprehensive bug inventory or independent reproduction. Bug status below
was checked on this date; a fix landed on WebKit main is not proof of inclusion
in the Human's installed Safari. No browser, benchmark, build or runtime change
was performed. Only this research document was created; no commit or publication.

## Local evidence and the question it actually supports

Source inspected at `45d843774d0335aa0ae1ee51aa9ca2f70f235b31`; concurrent
documentation edits were left untouched. The inspected camera/terrain/style
files have no diff from v0.22.3 `b834a8e`:
[cameraMotion.ts](../../src/cameraMotion.ts),
[useSceneTravel.ts](../../src/ui/game/useSceneTravel.ts),
[MazeTerrain.tsx](../../src/ui/game/MazeTerrain.tsx),
[scene.css](../../src/ui/styles/scene.css), and
[comfort.css](../../src/ui/styles/comfort.css).

- The camera translates an oversized full-world HTML `div` using the individual
  CSS `translate` property. Its layout origin stays zero; one existing rAF owner
  drives camera and actor coordinates. It does not animate scale or an SVG
  pattern's transform. No positive world layer hint is currently installed.
- Its SVG terrain has image-backed patterns, floor/wall CSS color filters,
  SVG blurred wall depth and a blended thin highlight. The full-world rendering
  box expands with maze size even though the visible FOV remains six tiles.
  Small actor images and separate effect layers are not equivalent workloads.
- [Human v0.22.2 feedback](../user-playtests/v0222-playtest-feedback.md) identifies
  smooth actors/animations with a clamped camera and stuttering when the camera
  scrolls. Texture resolution and thin-line artifacts remain hypotheses.
  [v0.22.3 feedback](../user-playtests/v0223-playtest-feedback.md) says slower
  movement feels smoother; that does not measure render throughput or isolate
  the affected iPad. Samsung/desktop success remains an important regression
  reference, not proof that browser engine alone explains the difference.
- The [PERF-02B review](2026-09-06-perf02b-moving-terrain-review.md) records a
  Chrome layer/paint response to one world hint, but no reproduced iPad fault
  and no decisive terrain/filter/solid-fill result. The
  [PERF-02C preflight](2026-09-06-perf02c-layer-preflight.md) remains the operative
  experiment/resource/seam contract, not an accepted fix.

## Findings ranked by relevance

### 1. Repainting a large moving world versus recompositing a retained layer

**Documented mechanism: high confidence. Application to this fault: unproven.**
WebKit explains that an element's own layer can sometimes avoid repainting when
it moves, while layers consume memory; excessive layers can be particularly
costly on constrained devices. Its Layers panel exposes creation reasons,
dimensions, cumulative paint counts, memory and paint flashing.
[WebKit Layers](https://webkit.org/web-inspector/layers-tab/)

Apple's archived Safari guide also describes large layers being tiled and
recommends checking whether scrolling repaints nodes repeatedly. The guide is
from 2018, so its promotion heuristics are historical guidance, not a guarantee
for every modern Safari build.
[Apple Layers guidance](https://developer.apple.com/library/archive/documentation/AppleApplications/Conceptual/Safari_Developer_Guide/ResourcesandtheDOM/ResourcesandtheDOM.html)

**Inference:** the Human's clamped/moving split fits a larger repaint/composition
workload without implying broken actor animation. This is the best-supported
next mechanism to discriminate. `translateZ(0)` is a probe of actual layer
behavior, not a universal GPU switch, and fewer Paint events alone are not a win.

### 2. Surface area and density matter independently of source-file resolution

**Documented resource categories: high confidence. Actual iPad allocation: unknown.**
WebKit distinguishes decoded image memory from graphics-layer/tile memory and
JavaScript heap. A small heap or unchanged encoded assets cannot establish a
small graphics working set; memory and timing profiling themselves should be
kept separate where possible.
[WebKit memory categories and profiling cautions](https://webkit.org/blog/6425/memory-debugging-with-web-inspector/)

For the same CSS dimensions, doubling raster density multiplies pixel area by
four. Applying the local full-world formula to the prior 682px board, one
unbuffered RGBA illustration is about 25MB for 11×11 at DPR2 and 109MB for 23×23
at DPR2. These are arithmetic illustrations from the preflight, **not measured
memory, a peak bound, or proof of one enormous allocated surface**. Actual
clipping, tiling, retained buffers and filters must be observed. Lowering a source
texture's dimensions would not necessarily reduce a same-size output layer.

Apple specifies a 2160×1620 Retina display and A12 for this iPad. Its 32GB option
is listed as storage capacity, not available renderer RAM. The physical display
spec does not tell us the tested CSS viewport, zoom or active layer raster scale.
[Eighth-generation iPad specifications](https://support.apple.com/en-ie/118451)

No reviewed primary source establishes a fixed eighth-generation iPad DOM/SVG
layer limit that this scene has exceeded. Do not substitute a Canvas/WebGL size
limit, storage size, or an assumed GPU-memory allowance for measurements.

### 3. Concrete WebKit bugs establish risks, not a matching diagnosis

These tracker reports include reduced test cases and/or maintainer investigation.
They were not executed here. Their differing triggers and status are material.

| Primary record | What is established in that record | Relevance and boundary |
| --- | --- | --- |
| [238943: SVG/canvas map resource failure](https://bugs.webkit.org/show_bug.cgi?id=238943), NEW; reported April 2022 | On an M1 Mac/macOS 12.3.1, Simon Fraser identified per-SVG `translate3d` layers becoming tiled during zoom and creating high memory demand. He suggested grouping under one enclosing layer; the reporter still reproduced trouble afterward. | Strong warning against per-sprite/per-SVG promotion and assuming one hint is free. Different device, zooming and renderer; not proof of this iPad's stutter or of a complete workaround. |
| [233421: transform compositing/paint invalidation](https://bugs.webkit.org/show_bug.cgi?id=233421), RESOLVED FIXED; 2021–22 | A maintainer reproduced the issue on iPad/iPhone but not Mac. Becoming composited with `translate3d` used the new scale for an old backing's repaint rectangle, leaving an incorrect region. | Real example of platform-specific invalidation and why promotion boundaries need visual checks. Historical fixed defect involving scale/promotion transitions, not evidence our fixed-scale steady camera hits it. |
| [245416: composited SVG pixel snapping](https://bugs.webkit.org/show_bug.cgi?id=245416), RESOLVED FIXED September 2022 | LBSE's composited and non-composited paths applied device-pixel alignment differently, breaking SVG content; a fix was landed. | Supports actual-DPR seam checks. This explicitly concerns the layer-based SVG engine; neither its flag/deployment state on the Human's device nor recurrence is established. |
| [27684: scaled composited content pixelation](https://bugs.webkit.org/show_bug.cgi?id=27684), ASSIGNED | Long-running scale/raster-resolution issue; later reports include iPadOS 18.3.2 on a tenth-generation iPad. | Relevant to blur during scale/resize and the candidate's visual guardrails. This game translates a fixed-size world during ordinary movement, so the scale trigger is not a match. Do not label it the camera cause. |
| [228312: large CSS blur performance](https://bugs.webkit.org/show_bug.cgi?id=228312), NEW; 2021 report with January 2026 update | Original example applies a 300px CSS blur to a large transformed box. A later iOS 26.2 report was followed by a maintainer acknowledging a reverted performance change. | Shows that exact OS/Safari versions matter. Maze 2 uses CSS color filters and a small SVG Gaussian blur, not that large CSS blur. No basis to disable all filters or assume software/GPU paths from this report. |
| [314999: clipped SVG-filter black square](https://bugs.webkit.org/show_bug.cgi?id=314999), RESOLVED FIXED on main June 2026 | Reduced offscreen-filter case reported on iOS 26.4.2/iPad ninth generation; maintainer identified incorrect clipped filter-region logic. The reporter later reproduced it on Mac too when viewport height changed. | Concrete recent filter/clip correctness issue, but a black square is not the Human's uncertain thin-line/stutter symptom. The corrected Mac observation is important: viewport can confound an apparent platform-only bug. Installed-release fix coverage remains unknown. |

### 4. A browser label and a smooth rAF trace do not settle presentation behavior

**Measurement guidance: high confidence; causal interpretation remains conditional.**
Safari's Layout & Rendering timeline separates invalidation, layout, composite
and paint; its Frames view groups that work. Some other timelines impose enough
overhead to be disabled initially. Measure a short rendering pass separately
from memory inspection, and compare a profiler-off physical view.
[WebKit Timelines](https://webkit.org/web-inspector/timelines-tab/)

The current camera is still driven by JavaScript, so promoting its world does
not turn that rAF code into a browser-owned independent animation. If camera
samples stall, inspect the travel/main-thread path. If coordinates and actor
samples are consistent but the world visibly stalls, investigate paint/raster/
composition. Neither branch is proved by the existing desktop p95 figures.

## Feasible next discriminating check — preserve the serial plan

1. Record the affected device's exact iPadOS/browser version, browser-tab versus
   home-screen mode, orientation, zoom/viewport/DPR and quality/motion/pace/audio
   settings. This is context for matching known bugs, not a request to prove the
   already-reported failure again or to buy/replace hardware.
2. After root's release/native/browser workload hands back, run only the prepared
   PERF-02C desktop triplet against the exact frozen release. Keep Full/Full,
   Regular200, FOV6 and all approved art; pre-row font/image readiness is untimed.
   Verify transform-only restoration and current-engine legality. Its clamped
   segment is untimed setup, not a measured A/B row, and steps intentionally
   advance 5→13→21→29. This can verify the intervention, not Safari efficacy.
3. The most decisive later Safari check is the **same tiny moving-camera route**
   on the actual iPad, baseline/hint/restored baseline, observing the world layer's
   paint count, bounds and layer-memory change. If a Mac is available, WebKit
   documents remote inspection of a connected iOS device through Safari's Develop
   menu. No such Mac/device connection is assumed available here.
   [Official remote-inspection setup](https://webkit.org/web-inspector/enabling-web-inspector/)

Interpret that future check narrowly:

- Fewer world repaints **and** repeatably smoother scrolling, with acceptable
  resource use and unchanged crispness/seams, supports the retained-layer approach.
- Fewer repaints but unchanged/worse scrolling points beyond repaint counts:
  raster/composition, memory or sampling still needs isolation; do not stack hints.
- No layer/paint change means the intervention may not have changed Safari's
  relevant path. It does not prove that textures or the iPad are at fault.
- Bad coordinates or late script samples return investigation to the existing
  travel owner. Correct coordinates with new visual artifacts fail the candidate.

Without remote inspection, a separately reviewed named iPad preview can still
provide the visible comparison; layer/memory attribution remains unavailable.
Do not expand the current tiny experiment into filter removal, source-resolution
downgrades, a renderer rewrite or a new camera model on the strength of this
research. Hardware suitability and Safari cause remain unverified.
