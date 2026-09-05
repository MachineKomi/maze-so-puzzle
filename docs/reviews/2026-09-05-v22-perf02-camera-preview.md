# PERF-02A — camera-origin experiment

Owner/writer: Astra. Independent reviewer: actual GPT-5.6 Sol High.
Prepared 2026-09-05 from `05c8da441f9fb4a42692bd5485204c3148e7a321`.
Intended version: **0.22.2 V22-CAMERA1**. This record freezes the source decision;
the later release receipt owns publication and exact artifact qualification.
Do not infer release completion from this document alone.

## Decision and scope

Accept for a narrowly labelled experimental preview after the remaining local
and delivery gates pass. **Physical iPad benefit is not established.** The
Human's eighth-generation iPad movement failure remains open; minimum graphics
helped only slightly. Phone improvement and prompt BGM remain positive findings.

`cameraWorldStyle` keeps the full world's layout origin at zero. The existing
travel owner expresses the entire sampled camera offset as percentages of the
full-world box, using separate grid width/height denominators. This has the same
output coordinates and scales immediately with layout, before ResizeObserver
refreshes cached pixel geometry. Actors/anchors/followers retain their existing
coordinate ownership. No new frame loop or layout read is introduced.

The change does not alter engine rules, pace, FOV, input timers, R1 unlock/source
ownership, content, saves, art, audio, dependencies or runtime preferences.
Seven release-version fields change across six metadata files; the unrelated
`base64 0.22.1` Cargo dependency is untouched. Tessera repair and PLAY-01 remain
separate follow-ons. No new public bytes or budget allocation.

## Evidence and honest limits

Raw diagnostics are external at
`C:/GameDev/maze-game-qa/output/playwright/perf02`; the adjacent evidence index
binds final source files, served bundles and retained reports by SHA-256.
The browser is local Edge/Chromium, not physical iPad/Safari. All timings are
report-only on this busy shared host; neither rAF intervals nor CDP task metrics
measure the Human's displayed-frame latency.

The final targeted input/lifecycle run passed 18/19. The remaining test failed
in Playwright's clock setup (`pauseAt` rejected a time already in the past),
before the tested interaction. Its unchanged isolated rerun passed 1/1. Thus
all 19 selected behaviors have passing evidence, not a single all-green 19-case
run. Preserve the failed setup report as well as that rerun.

- The preliminary pixel-offset implementation passed a matched seven-step
  Maze-2 geometry pair (77 moving samples each). Its 20-step pair removed 20
  observed world left/top mutations, but **LayoutCount was 278 → 280**, not an
  improvement. Do not advertise its p95/p99 differences as a performance gain.
- Preliminary 24 title/Home/five-follower-maze captures across four viewports
  preserved every major rectangle and asset/count identity. Animated follower
  bounds varied up to 1.43px; screenshot animation suppression ends before the
  later geometry read. These are gross regression checks, not pixel equality.
- Sol checked the source algebra and recomputed those geometry/metric results
  independently, then recommended the percentage refinement to eliminate the
  world's new dependency on ResizeObserver pixel refresh during resizing.
- A pre-ResizeObserver rAF probe of the preliminary pixel variant observed
  temporary stale offsets. Twelve post-observer readings were correct and
  sampled Chromium compositor captures showed the correct scene crop. The
  diagnostic's pre-observer readings were not proof of a displayed flash.
  Percentage translation removes even those stale-world observations: the final
  normal-save Full/Static mount, return and two-size resize probe passed all
  **96 samples with zero geometry violations**.
- Final percentage variant: seven legal Maze-2 steps, **76 moving samples**,
  no sampled camera/player/path violations. Its separate 20-step observation
  again reports **zero world left/top mutations**. LayoutCount 285 and p95
  about 20.1ms do not demonstrate a performance win. The original baseline,
  earlier pixel experiment and later percentage sample are separately retained.
- Four new unit cases combine non-square grids, fractional camera samples,
  full-grid viewing and two physical board sizes. Existing interaction geometry
  checks now validate the composed camera, rather than assuming zero world
  translation. They retain exact actor/follower target tolerances and assert the
  fixed origin; `%` and omitted zero-Y CSSOM serialization are handled explicitly.

## Rejected attempts and regressions checked

The first diagnostic route accidentally attempted a third Left into a Maze-2
wall; it was rejected and corrected to the current engine-verified route.
An initial rAF probe reused a live callback between steps; generation tokens
fixed it and only the corrected cohort counts are cited. A CLI fixture-result
parser initially encountered Vite logging before JSON. These are harness errors,
not gameplay observations.

The preliminary full browser run passed 82 cases, skipped the same two absent
authored jump-door/jump-combat fixtures and failed five geometry cases because
the new test helper assumed CSSOM always supplied two translate components.
The parser was corrected; all five reruns passed. No gameplay fix, tolerance
increase or test removal was used. Final percentage/lifecycle reruns are recorded
separately in the evidence index; do not claim a nonexistent all-89 green rerun.

A concurrent-load project run passed 494 assertions and timed out one unchanged
campaign solver test at its unchanged five-second bound. Serial exact-source
qualification is required; no timeout/state limit was increased.

## Remaining gates and next action

Before promotion: finish the final targeted input/lifecycle checks, serial
project/build/static checks, locked native build/functional smoke and exact
CI/web/download verification. Preserve v0.22.1 artifacts. No signing, installer,
clean-machine, sustained native performance or physical-device pass is implied.

Then ask for **P1: Maze 2 on the affected iPad**, especially separated taps and
the transition from edge-clamped movement to scenery scrolling. If it is still
poor, proceed with the next isolated moving-surface/terrain-cost probe in
[PERF-02](../plans/V22-PERF-02-moving-camera-isolation.md), not a blanket renderer
rewrite or slower pace as a substitute. Safe independent work may continue.

[Playtest checklist](../PLAYTEST_CHECKLIST.md) · [Decisions/steer](../HUMAN_DECISIONS.md)
