# v0.22.16 Book, MOVE and HAZARD-03 — independent Sol final review

Sol, September 7, 2026. I independently reviewed frozen source
`09d5475c522c410cbe723d4e0dd8bd76945400f6`, the final Chromium browser
packet and both five-pair performance reports. I recommend this exact candidate
for the bounded web preview. I found no remaining source, routing, visual or
current-host frame blocker. This is not raster parity: Full-mode idle hazard
work remains materially higher, especially at the larger viewport, and must be
kept in the release record.

## Source and behavior

The Book correction preserves the existing completion finalizer. Next maze or
Surprise maze is always the primary/default action for partial and perfect
clears; Stay here remains explicit. A tester session is neither presented as the
Book's active run nor resumed by selecting the same chapter, so the Book starts
that chapter normally. Save denial still leaves the pending completion at the
exit for retry, and a future progress profile remains byte-exact while the
temporary session advances. The revised future-profile copy does not promise a
write. MOVE-02 removes the legacy yellow step pseudo-element and unused pulse
state while retaining the steady ground shadow and Full-mode travel sway.

HAZARD-03 uses one rounded union of all non-floor terrain as its shore path and
clips the two floor-pattern strokes separately to each liquid. This leaves the
opaque `.04`-tile bank and `.03`-tile transition only at ordinary-floor/liquid
interfaces. It does not paint a false safe strip at liquid/liquid, wall or pit
contacts. A separate receiver admits floor, bank, transition and liquid to wall
cast/contact paint while excluding the physical wall footprint and pit voids.
Collision, terrain rules, save data, wall geometry and actor layering do not
change.

The base texture wraps with two copies and a one-period horizontal CSS
translation. CSS `steps(...)` limits Full-mode offsets to 20 per second and at
most `.00375` tile per update; there is no script timer or new React state.
Lite freezes that current and omits local FX. Reduced and Static freeze all
ambient hazard animations while keeping the texture, bank and shade.

The final compressed inventory is 166,072 gzip-9 JavaScript bytes and 24,074
CSS bytes, with 155,542,751 public bytes unchanged. That is +170 JavaScript and
-142 CSS bytes against web0.22.15, within the explicit 200-byte HAZARD-03
JavaScript allocation. Package and Tauri manifest changes are release-version
fields; this slice adds no dependency or media.

## Browser and pixel evidence

[`playwright-report.json`](../../../maze-game-qa/performance/v02216-final-browser-20260907/playwright-report.json)
records 38/38 passes with no skip, flake or unexpected result (SHA-256
`ba757948ce53af4bf6bdbebcebce8167a4050017828670113fc6f2b4e6a8d90`).
The matrix includes ten Book cases, four MOVE mode cases, ten HAZARD-03 cases,
twelve retained jump cases and two existing completion journeys.

I freshly inspected the final 780 and 1194 Full campaign captures for water,
lava and poison, the Static and grayscale poison captures, both final shape
sheets and representative cadence phase frames. The materials remain crisp and
distinct; the connected silhouettes and rounded corners are coherent at single,
strip, L, T, cross and ring shapes. The mixed water/lava/poison sample has no
floor seam between materials, while the ordinary-floor bank remains visible.
Wall casts continue through the bank and poison remains distinguishable in the
provided grayscale frame. I found no visual release blocker in this packet.

Both theme JSONs cover eight light directions and three receiver fixtures per
direction with zero errors. All receiver samples pass; wall/pit exclusion,
shared cast/contact clip and lip-before-cast ordering pass. The explicit shore
probe reports material, wall and pit false and ordinary floor true. For every
material in both themes, phases 0, .25, .5 and .75 have distinct pixel hashes
and phase 1 exactly equals phase 0. Full has a bounded nonzero cadence; Lite,
Reduced and Static report zero active hazard animations.

## Independent performance calculation

The candidate identity is the same in both reports: head `09d5475c`, Chromium
151, candidate JS `6593a81e58d373faee015a29b91fd2ea9c246ca060c85a2fbe6cd390c137cd64`
(598,960 bytes) and CSS
`d421c025b8ceaa4730a21d0a4f37d89611231cdf8c8ae53b40c1011c4e145a5a`
(119,811 bytes). The comparison is frozen web0.22.15 source `1e8b465d`, JS
`9efdebdfa194e6ed6a084d437ff888550a37b5ff308c43fe5cd3786f9b119148`.

Each report contains five measured candidate/baseline pairs per viewport plus
one warmup pair per viewport. Percentages below distinguish the ratio of the two
cohort medians from the median of the five paired percentage changes.

| Route / viewport | RasterTask median totals | Ratio of medians | Paired median (range) | Paint ratio / paired median |
| --- | ---: | ---: | ---: | ---: |
| idle 780 | 2450.290 → 2694.909 ms | +9.983% | +9.520% (+6.305% to +30.057%) | +1.909% / +1.843% |
| idle 1193 | 6644.433 → 7674.052 ms | +15.496% | +16.591% (+13.723% to +17.210%) | +2.764% / +2.213% |
| moving 780 | 1418.125 → 1488.552 ms | +4.966% | +5.624% (-9.262% to +10.298%) | +0.971% / +1.595% |
| moving 1193 | 4254.128 → 4392.269 ms | +3.247% | +1.982% (-0.849% to +13.961%) | +2.635% / +1.350% |

Across both reports, all 40 measured rows and all eight warmup rows have a
16.8 ms or lower maximum interval, aggregate measured p99 is 16.8 ms, and no
interval exceeds 20 or 34 ms. Idle preserves steps and position with one camera
transform; moving performs sixteen ordinary steps and returns to the exact
starting position. Both have zero terrain mutations, page errors and broken
images. Trace durations overlap and are not additive, and RasterTask duration
is not GPU time.

The idle report SHA-256 is
`cb005ebe35b8ee7056c8d89c4bdc1d4d95afa1f840c9bacd13117d790649d664`;
the moving report SHA-256 is
`8501d9ed6fbf5a0fc960f573fe720edaaca45ba633e8e9afe878bacdf5e435b7`.
The moving report names fixture `hazard-moving` but does not embed its visible
cell count. The exact fixture used by the surrounding packet records four
visible hazard cells at
[`fixtures.json`](../../../maze-game-qa/performance/v02216-final-browser-20260907/hazards/fixtures.json),
SHA-256 `2e8fce2d80116ef80acf5e803adc2a8f64f041a9982540969c6d680d864fb691`.
The qualification receipt should preserve that path and hash; this provenance
correction does not require another run.

## Disposition and limits

I accept the Full-mode idle RasterTask increase for this bounded Chromium web
preview because the source limits ambient resampling to 20 Hz, the final pixels
show a clear connected-surface improvement, moving work is much smaller, every
measured frame tail remains bounded on this host, and three lower-motion/quality
choices stop the current. The desktop idle increase is consistent across all
five pairs and must not be described as noise, parity or free animation. It is
the main residual engineering cost and should remain visible when later work
touches terrain paint.

This review does not qualify physical iPad or phone behavior, WebKit, the native
build, low-end hardware, thermals, GPU cost, acoustic behavior, family play or
Human beauty acceptance. The browser evidence uses headless local Chromium on
one host. Publication, public verification and any later acceptance remain
separate root/Human decisions.
