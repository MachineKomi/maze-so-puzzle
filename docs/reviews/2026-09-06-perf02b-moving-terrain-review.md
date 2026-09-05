# PERF-02B — moving-terrain diagnostic, no iPad fix established

Astra review, 2026-09-06. Read-only external probe delegated to Parfit; Astra
inspected source findings, compact results, exact evidence hashes and the two
settled board images. Frozen runtime `820ed39f00e8c6bd808a0c084ccc2c67396ebb13`
is unchanged. [Machine-readable compact receipt](2026-09-06-perf02b-desktop-probes.json).

## Result and decision

The laptop does not reproduce the Human's affected-iPad scrolling defect. None
of these short desktop rows proves its cause or warrants lowering approved
source-art resolution globally. A single world-layer hint is a useful next
**candidate experiment**, not a shipping fix or accepted optimization.

Fifteen interleaved baseline/probe rows completed 120 legal scrolling moves in
fresh tester Maze 2 with zero followers, Full quality/motion and unchanged 160ms
cadence. Overrides were individually verified and restored. Geometry was checked
outside timing windows; zero geometry violations. Probes hid terrain, removed
floor/wall filters separately, removed depth filtering, normalized highlight
blending, used solid fills, and applied `transform: translateZ(0)` to the world
without replacing its independent travel-owned `translate`.

All rAF p95 values remained approximately 16.8–17.0ms. These measure callbacks,
not displayed frames. The host was shared and free RAM ranged 389,156,864 to
1,805,639,680 bytes; there is one short row per override, not a qualified cohort.
Terrain/filter/solid-fill changes did not separate decisively from baselines.

| Adjacent comparison | Paint events | Paint trace total, ms | Layer count after |
| --- | ---: | ---: | ---: |
| Baseline before hint | 417 | 380.090 | 21 |
| World layer hint | 260 | 276.267 | 22 |
| Restored baseline | 343 | 348.514 | 21 |

The hinted 1250×1250 world layer reported `Trivial3DTransform` and paintCount
1→1 over eight moves. This is Chrome layer/trace evidence, not Safari behavior
or measured GPU memory. Trace totals include boundary work and omit complete GPU
raster/composition cost. Zero CompositeLayers entries mean unavailable in this
capture, not zero composition. The 249/476100 settled-board pixels differing by
more than 5/255 require moving/DPR seam checks; they are not pixel-identical.

## Next bounded camera step

After the active writer hands back, independently trial a single layer hint at
unchanged cadence/FOV/art against the frozen baseline. Check both camera axes,
clamps, fractional translation, resize, effects/followers, Full/Lite/Static and
largest authored worlds at DPR1/2. Inspect extra layer area, repeat-play retention
and thin-line/shimmer risk. Do not add per-sprite layer hints or assume one giant
layer is free. Reject the candidate if resource/visual costs outweigh its benefit.

If mechanically accepted, publish it as a specifically identified experiment
with a rollback, and request the existing brief iPad P1 comparison. Pace and
audio changes must remain separately identified; slower movement is not proof
of faster rendering. Physical iPad acceptance remains failed/open. No need for
the Human to repeat today's already-reported failure before safe work proceeds.

## Provenance and limitations

External root: `C:/GameDev/maze-game-qa/performance/v22-perf02b`. The compact
receipt pins full summary, audit, geometry, commands and screenshots, plus every
row hash. Raw traces/profile stay outside Git. Served HTML/JS/CSS matched that
worktree's dist; source hashes were unchanged. This does not claim canonical
deployed-byte re-verification. The probe's browser and port4184 preview were
closed; other sessions were untouched.

One rejected preflight restored stale world translation by copying a whole
inline style. It was caught before timing and preserved in `rejected-restoration`.
The corrected probe restores only its own transform and restarts fresh state.
Tester runs omit normal active-save persistence; no save/audio/long-session
qualification follows from these results. All timings are report-only.

Profiler interpretation references: [WebKit Layers](https://webkit.org/web-inspector/layers-tab/)
and [WebKit Timelines](https://webkit.org/web-inspector/timelines-tab/).
