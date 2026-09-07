# CAMERA-17 initial diagnostics — not release qualification

Baseline: verified web0.22.16, release815deb0. See the
[implementation plan](../plans/CAMERA-17-bounded-scene-performance.md) for the
Human report, Claude report identity, authoritative research and acceptance.
The current branch is `codex/bounded-camera-performance`; no candidate is live.

The first bounded-window candidate retained a single animated terrain surface.
One measured four-times-CPU pair at844×390/DPR3 increased RasterTask total from
1984.790 to2442.207ms (+23.05%); at1080×810/DPR2 it fell3485.315→2337.886ms
(-32.92%). Reject this as the release candidate. There were eight paint-window
rebases in each16-step return journey, no path mutation, exact state/return and
no errors. Chromium layer inventory demonstrated the bound: the largest maze
layer fell2668→1160 CSS pixels on phone and2177→947 on tablet. These dimensions
are not a measured Apple allocation or total memory footprint.

A second candidate separated animated liquids from static terrain: liquid
underlay; opaque floor clipped to the liquid complement; banks/casts/walls above;
actors and final foreground unchanged. World-space patterns and all window
origins remain synchronized. The same one-pair traced diagnostic reduced raster
2002.373→1595.807ms phone (-20.30%) and3530.457→1779.148ms tablet (-49.61%).
Paint/frame tails did not establish a release win. Both early pilots enabled
heavy layer/picture tracing and LayerTree reporting; their frame intervals are
instrumented diagnostics, not unbiased playability measurements.

The third candidate additionally groups minimap terrain into paths with two
visibility clips and sparse markers. An untraced, no-LayerTree four-times-CPU
pilot retained all game rules,16 moves and exact return. Its measured phone
intervals over20ms fell5→2; tablet12→2. Both candidate p95s were16.8ms, worst
33.4/33.3ms, zero over34ms. Every rebase-adjacent sample was at most16.8ms.
Warmups are separate. This is encouraging but only one measured pair per layout.
The harness now explicitly separates frame, trace and layer-inspection cohorts;
never compare their absolute frame times as one population.

Initial functional run:24/28 pass. Six dry/large/hazard movement+map journeys,
ten hazard shape/material/mode cases and eight production jump cases pass.
Four isolated jump-harness cases failed because that deliberately minimal world
has no terrain SVG and the new travel owner assumed one. Repair makes terrain
binding optional; production fixtures still require actual terrain/masks and
prove bounded synchronized surfaces. Full rerun remains required.

Initial unit run:667/669 pass; two expected-string checks disagreed solely in
the last decimal of166.66666666666666 versus166.66666666666669. Geometry tolerances
and pixel-projection tests passed. String expressions are corrected; this is
not a product coordinate or rounding repair.

Actual Sol independently reviewed the report and dirty source. Root adopted
local liquid clip definitions to avoid introducing new cross-SVG clip dependencies,
retained one marker per tile when active objects overlap, and aligned foreground
comfort hints. The static map's muted treatment remains bounded to the small
map surface; it is measured rather than presumed free. Existing WALL-04C's
foreground paint reuse is retained. Next: promotion ablation, final correctness,
frozen five-pair work/frame cohorts and genuine final independent review.

All raw outputs are under `C:/GameDev/maze-game-qa/performance/` in the named
camera17 baseline/window-pilot/split-pilot/map-frames-pilot/functional folders.
Small candidate entry snapshots preserve the first two measured renderers;
media is shared, not cloned. Inventory belongs to the
[artifact ledger](../LOCAL_ARTIFACT_LEDGER.md). No files were deleted/archived.
Physical iPhone13/iPad8, WebKit, low-memory and thermal acceptance remain open.
