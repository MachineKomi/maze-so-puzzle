# PERF-02C — world-layer hint preflight, not an iPad fix

Date: 2026-09-06. Delegated read-only source/evidence review for Astra.
**Decision: a single CSS-only layer-hint experiment is justified; implementation,
publication and performance acceptance are not established by this review.**
Only this document was created. No runtime edits, browser runs, builds, tests,
dependency installation, commits or publication were performed.

## Baseline and evidence boundary

- Requested release baseline: v0.22.3 `b834a8e`; documentation checkpoint
  `c77e7d7e428e1db17ef4fd223cfc9c5614bbe638`. During review HEAD advanced to
  `d6c9fa61fd6f66e66966620b8915097ee2c03bb2`. `git diff b834a8e HEAD -- src`
  was empty. Pin the actual accepted source again after PLAY-B hands back;
  do not mix its stationary-rescue work into a camera comparison.
- Read the [current PERF-02 plan](../plans/V22-PERF-02-moving-camera-isolation.md),
  [root PERF-02B review](2026-09-06-perf02b-moving-terrain-review.md) and its
  [complete 15-row compact receipt](2026-09-06-perf02b-desktop-probes.json).
  The probe baseline is **820ed39**, not v0.22.3. The files `cameraMotion.ts`,
  `useSceneTravel.ts`, `scene.css` and `comfort.css` have no diff between
  `820ed39` and `c77e7d7`; later accepted art, pace and audio still require a
  fresh matched baseline, with Regular pace selected explicitly.
- [Physical v0.22.2 feedback](../user-playtests/v0222-playtest-feedback.md)
  distinguishes smooth clamped-camera actor/animation motion from ugly moving-
  camera stutter. Texture resolution is the Human's hypothesis, not a finding.
  Thin lines are uncertain; related seam reports predate the coordinate change.
- The desktop probe demonstrated correct override/restoration and geometry:
  15 rows, 120 legal moves, zero geometry violations. It did **not** reproduce
  the iPad fault. All rAF p95 values were approximately 16.8–17.0ms.
- Adjacent baseline / hint / restored baseline Paint counts were 417 / 260 /
  343, summed Paint trace times 380.090 / 276.267 / 348.514ms, and post-move
  layer counts 21 / 22 / 21. The hinted 1250×1250 Chrome world layer reported
  `Trivial3DTransform`, with paintCount 1→1 across eight moves. This supports a
  **repaint/composition isolation hypothesis**, not a causal diagnosis, frame-
  delivery speedup, measured GPU-memory saving or Safari result.
- One short row per override on a shared, memory-variable host is report-only.
  Trace boundaries/instrumentation and ambient animation contaminate comparison;
  paint totals omit complete raster/composition cost. Terrain/filter/solid-fill
  results were inconclusive. No source-resolution reduction is justified.

## Exact smallest candidate

After the sole runtime writer hands back, trial only this rule beside
`.camera-world` in [scene.css](../../src/ui/styles/scene.css):

```css
/* PERF-02C experiment: preserve travel-owned individual translate. */
:root:is([data-quality="full"],[data-quality="lite"]) .maze-board.exploration-camera .camera-world {
  transform: translateZ(0);
}
```

This is the same declaration as the verified external hint, with an explicitly
narrower eligibility selector that itself needs checking. It does not guarantee
promotion in every browser. Do not add `will-change`, `contain`, `isolation`,
`backface-visibility`, a new wrapper or another transform at the same time.

Source justification and restrictions:

- [cameraMotion.ts](../../src/cameraMotion.ts) fixes world `left/top` at zero,
  scales its box to full-level dimensions, and supplies fractional full-world
  percentage translation. [useSceneTravel.ts](../../src/ui/game/useSceneTravel.ts)
  is the single rAF owner of individual `style.translate`; never replace it with
  a transform string, restore the whole inline style, round it, or add a second
  camera clock. CSS `transform` currently has no world owner to conflict with.
- [App.tsx](../../src/App.tsx) assigns `exploration-camera` only when a grid
  exceeds the default six-tile view. Do not promote Maze 1 just to match a global
  selector. Do not change FOV, board layout, input cadence, lag limit or easing.
- Full and Lite remain full-quality-content comparisons within their accepted
  recipes. Reduced motion remains eligible: ordinary smooth travel is still
  enabled unless quality is Static. The existing Reduced/Static world rule sets
  only `will-change:auto` and `transition:none`; it would **not** cancel a new
  transform. Explicitly excluding Static prevents an accidental permanent hint
  there without weakening its existing presentation policy.
- Keep eligibility stable for a mounted exploration world, including clamped
  positions. Do not toggle on every `data-travel-state` change: repeated
  promotion/allocation at each first tap would be another untested mechanism.
  Removal when the world unmounts or quality becomes Static must be checked.
- The world includes terrain, holes/goal, culled world objects and followers;
  this is **not** a terrain-only layer. Player/replacement actors and anchored
  presentations have separate placement. Preserve all identities, z-order,
  shadows, masks, blends, authored textures and sprite renditions. Animated
  descendants could still invalidate work; a zero-follower row cannot settle it.
- No UA/device-age heuristic, per-sprite hints, texture resizing, filter removal,
  whole-maze bake, renderer migration, persistence/audio change or general CSS
  cleanup belongs in this candidate. PT15 texture/dressing scale remains separate.
  Rollback is removal of this one rule from the candidate checkpoint.

## Risks that must remain visible

**Area and lifetime.** The world is larger than the clipped viewport. At the
prior 682×682 CSS-pixel board and FOV6, a square world has side
`682 * gridSize / 6`. A single unpadded RGBA surface would have arithmetic size
`worldWidthCSS * worldHeightCSS * DPR² * 4` bytes:

| World | CSS side, approximately | DPR1 RGBA illustration | DPR2 RGBA illustration |
| --- | ---: | ---: | ---: |
| Maze 2, 11×11 | 1250px | 6.25MB | 25.0MB |
| Largest current authored/generated size, 23×23 | 2614px | 27.34MB | 109.35MB |

These are decimal-byte arithmetic illustrations, **not allocated GPU memory,
an upper bound, or an assertion that a browser uses a single full-size surface**.
Tiling, clipping, scale, padding, extra buffers, filters and browser policy can
change costs. The 23×23 inventory is supported by
[authored size expectations](../../src/game/levels.test.ts) and
[generator bounds](../../src/game/generator.ts); the absolute supported grid
ceiling is 24. Record actual world/layer bounds and device DPR rather than
treating the old 682px board as every viewport. Unchanged assets/JS heap do not
prove unchanged raster/compositor memory. Retained worlds, first-raster stalls,
tile churn/checkerboarding and memory-pressure reloads remain risks.

**Fractional sampling and composition.** The existing seven-decimal percentage
translation and continuous rounded SVG wall union must stay intact. Promotion
could change sampling of patterns, the tiny highlight stroke and blurred depth,
or blending/clipping with descendant/sibling layers. It might shift work rather
than reduce it. Prior settled captures differed at 249/476100 pixels by more than
5/255; they were not pixel-identical and do not establish moving-edge safety.
Inspect fractional moving frames at actual DPR, both axes and clamps. No blanket
tile overlap, pixel snapping, nearest-neighbour or hidden effects to make a seam
comparison pass; the [accepted PT33 disposition](2026-09-05-sol-astra-opus5-v4-disposition.md)
already rejects assuming snapping or baking is a guaranteed fix.

## Decisive measurement contract

No measurement starts alongside Sol's runtime work or another heavy host job.
Use one named production baseline/candidate pair with exact commit, clean-tree,
served-artifact hashes, browser/version, viewport/DPR, host contention/free-memory,
cache/warmup and audio playback state recorded. Reuse existing external helpers;
do not install another browser/test framework or instrument the product hot loop.

1. **First execution slice: identity and mechanism, not a release.** Apply the
   single rule in an isolated candidate worktree and review its diff. At Full
   quality/full motion/Regular pace, repeat one short baseline→hint→baseline
   triplet on fresh `shiny-sword`, zero followers. Engine-replay/verify spawn
   (9,9), Left Left Up Up to (7,7), then Up to (7,6). The camera changes from
   (5,5) to (5,4); Down/Up provides the same eight-move scrolling row. Compare
   (9,9)↔(8,9) separately as the clamped-camera control. Do not silently reuse a
   route after a content fingerprint changes.
2. **Verify the intervention before timing.** Record computed world transform,
   independent translate, layout origin/size, quality/motion/pace and DOM/image
   inventory before and after every row. Baseline restoration changes only the
   probe-owned transform. Require exact legal move counts, end position, camera,
   follower count and state restoration. Record scene/player/camera coordinates
   separately from timing. Any mismatch invalidates the row before interpretation.
3. **Measure mechanism without manufacturing a speedup.** Bounded numeric rAF
   intervals, long-task information and separate CDP paint/layout/layer snapshots
   are sufficient for the first triplet. No per-frame DOM/computed-style reads,
   screenshots or logging in timing windows. Record world layer identity/bounds,
   compositing reason and paint count, total layer count and available memory
   indicators. Missing GPU/compositor measurements are `unavailable`, not zero.
   Keep a profiler-off comparison separate. If the hint is ineffective, or merely
   exchanges fewer Paint events for worse stalls/resources, stop and review.
4. **Pre-publication mechanical/visual/resource gate.** Cover DPR1 and DPR2 plus
   the eventual device's recorded native DPR; both axes, reversals, clamps, first
   tap after idle, resize/orientation and blur/hide/resume. Include Maze 1, Maze 2,
   a 23×23 authored world and one fixed largest generated fixture; use current
   engine-derived routes. Pairwise cover 0/2/5 followers, rescue insertion,
   hazard/dressing and battle/door/jump/portal anchors; the stable IDs
   `rainbow-power-parade` and `twilight-treasure-loop` remain seam sentinels.
   Check Full/Lite with Full/Reduced motion, and Static explicitly unhinted.
   Compare matched settled and fractional moving frames outside timing. Reject
   new seams/shimmer, cropping/z-order drift, blur, lost input or first-tap stalls.
   Inspect three bounded enter/play/leave cycles for retained world layers and
   growing resource indicators; this is a leak sentinel, not sustained qualification.
5. **Evidence and engineering decision before publication.** Preserve compact
   JSON, exact commands/hashes, selected visual pairs and rejection reasons;
   retain raw material externally. A triplet is a diagnostic, not a qualified
   timing cohort. Any release performance claim needs the existing at-least-five-
   runs-per-row contract and accepted host/variance policy in
   [performance budgets](../PERFORMANCE_BUDGETS.md); timings remain report-only
   until that policy permits otherwise. Run the focused camera/travel/input tests,
   serial full tests/build, inventory/budget checks and relevant browser journeys.
   Require independent review of measured layer/resource cost and visual evidence,
   exact byte allocation if needed, source/artifact identity and one-rule rollback.
   If memory tooling is unavailable, expose that limitation and have root explicitly
   judge preview risk; do not mark the memory gate measured/pass by proxy.
6. **Physical acceptance stays separate.** Only a mechanically reviewed, clearly
   named experimental preview may then be offered for the existing brief iPad P1
   comparison. Baseline/candidate/baseline use the same device, orientation, fresh
   Maze 2 route, Full quality, recorded motion/audio settings and Regular pace.
   Compare clamped versus scrolling taps/holds, first tap and both axes, then one
   later larger world. Require a repeatable improvement in visible scrolling with
   no new lines, blur, lost precision or reloads, and retain a known-good phone
   regression check. Actual Safari inspection, if available, is a separate cohort;
   Chrome promotion or desktop WebKit is not iPad proof. Unchanged or ambiguous
   iPad feedback leaves PERF-02 open, without blaming art resolution or counting
   Chill pace as a rendering fix. No need to repeat the already-reported failure
   before the safe engineering slice can begin.

The next action is the single-rule isolated engineering experiment **after
writer handoff**, not another broad terrain probe matrix or a published fix.
