# Sol independent review — cold reward opening

**Status:** accepted for a bounded Chromium web release from the frozen source.
This is a source, Chromium pixel and Windows-host performance review. It is not
physical Apple, WebKit, native-package, Human-feel or universal performance
acceptance.

## Reviewed identity and behavior

I reviewed frozen runtime
`d4720370a7e6d6407f35e5c5188e86817e71259c`, runtime-input SHA-256
`8ad63a5bab828854922f9a7ae5949db0e03e8b3d5302e4dcd0cb5c94d31690c0`
and dist fingerprint
`214d7e76fe9033759d6964e85d90e8dba5dc9a3e15f09477d4ad454412c91d2d`.
The retained performance reports say both runtime inputs and dist match.

The change is narrow and coherent:

- Gold and Science counts use a shared `720x128` ten-digit Canvas atlas. Power
  keeps its existing dynamically sized text and actual-Ame target measurement.
- Reward Canvas allocation uses the owning `ResponsiveStage` scale. The target
  position still reads the actually presented Ame rectangle while tokens exist.
- If the auxiliary atlas cannot obtain a 2D context, count drawing uses the
  prior text path. If the main Canvas cannot obtain a context, the existing SVG
  fallback remains. Invalid amounts and non-finite drawing inputs produce no
  atlas draw.
- The board `ResizeObserver` compares its content size with the current logical
  Canvas allocation. Its initial unchanged-size notification therefore cannot
  cancel a synchronously emitted Power burst. A real size change still cancels
  stale animation state and wakes resting loot with the updated scene size.
  Cleanup disconnects the observer and removes the matching listeners.
- The atlas is constructed once per page after the main reward Canvas succeeds.
  Its ideal RGBA storage is 368,640 bytes plus browser implementation overhead.
  An empty ledger still leaves the main reward Canvas at `1x1` with no reward
  running transition; the auxiliary atlas means total reward storage is not zero.

The source changes do not alter reward value, ledger claims, save writes,
collection radius, drop timing, Power credit, camera geometry or movement rules.
The final `reward-cold-corrected-browser` report contains 43 passed, zero failed
and zero skipped cases (report SHA-256
`26e3f6cd6182d224fe7379151a1f7c6d7a22e807b1565dee3a4f8d5b2c8996d0`).
The matrix includes the corrected dense immediate-Power case and empty-ledger
phone/tablet resizing; the earlier 42/43 run is superseded rather than additive.

## Pixel review

I inspected the actual DPR1/2/3 count captures, atlas-null fallback captures and
the composed numeral comparison under
`reward-cold-corrected-browser/reward-numbers`. The Gold count is centered and
readable in the 780, 844 and 1080 gameplay captures, and the atlas-null result is
visually equivalent at the actual 844 target size. There is no release-blocking
clipping or alignment fault in those images.

The atlas is not pixel-identical to the prior text at every artificial rack
size: its proportional outline is thinner at 11px and thicker at 66px than the
old fixed 3px stroke. The actual target captures, rather than the rack extremes,
support the bounded visual disposition. This is my fresh image review, not Human
art acceptance.

## Entry and first-opening tradeoff

`reward-cold-loot-frames/report.json` has 24 rows: one separate warmup and five
alternating measured pairs per profile at CPU4. It is untraced and has no Canvas
or prototype wrappers. Its separate 800ms Continue sampler does add a small rAF
callback and DOM observer to both sides, so mount numbers are same-harness
diagnostics rather than pristine presentation timings. All measured mount
samples contain 26–31 timestamps and a finite terrain observation. Report
SHA-256 is
`525101e42cc8ada062236f10cdbb4a562d5a4920f64be245127a7dec8d186b21`.

| Five measured runs, public 18 to candidate 19 | 844x390 DPR3 | 1080x810 DPR2 |
| --- | ---: | ---: |
| Opening max median / worst | 66.7 / 66.7ms to 50.0 / 50.1ms | 66.7 / 66.734ms to 50.0 / 50.0ms |
| Opening intervals over 34ms | 5 to 5 | 5 to 4 |
| Mount max median / worst | 270.4 / 287.2ms to 282.9 / 293.7ms | 253.6 / 257.6ms to 281.5 / 313.7ms |
| Terrain-DOM median | 250.9ms to 257.2ms | 237.6ms to 256.6ms |
| Combined sampled intervals over 34ms | 20 to 17 | 20 to 19 |
| Combined sampled intervals over 20ms | 31 to 34 | 27 to 27 |

The first loot response improves by one CPU4 frame tier in every phone pair and
four of five tablet pairs; the remaining tablet pair is 50ms on both sides.
Opening p95 remains at or below 16.8ms. The first response still contains a
roughly 50ms interval, so the hitch is reduced rather than removed.

Entry becomes slower. The tablet mount maximum regresses in all five pairs and
retains the 313.7ms candidate outlier. Combining two separated sampled windows
does not establish a faster end-to-end cold journey: the phone over-20 count
rises and the combined worst rises for both profiles. I accept this only as an
explicit trade of slower pre-play board presentation for a more responsive first
loot interaction. It must not be described as a net cold-start speed win.

## Loot-route work

`reward-cold-loot-work/report.json` also has 24 rows with five measured pairs per
profile and exact frozen source/dist identity. Report SHA-256 is
`b385fdc2cfd72dfd1ecae0fcaee48ccdbd23b18d9f100136b06836cc78f139e1`.
Every measured row returns the expected four-step route, Gold 8, zero Science,
zero terrain mutations and zero broken images.

| Median trace work, public 18 to candidate 19 | 844x390 DPR3 | 1080x810 DPR2 |
| --- | ---: | ---: |
| RasterTask | 614.060 to 629.297ms (+2.48%) | 892.866 to 886.890ms (-0.67%) |
| Paint | 186.289 to 186.028ms | 189.979 to 192.718ms |
| Layout | 45.992 to 45.889ms | 61.510 to 63.818ms |
| UpdateLayoutTree | 322.610 to 345.018ms | 324.669 to 313.899ms |
| Intervals over 20ms | 13 to 10 | 9 to 8 |
| Intervals over 34ms | 5 to 5 | 5 to 5 |
| Worst interval | 66.7 to 50.1ms | 66.7 to 50.0ms |

The phone RasterTask increase is small in absolute route context and is not
paired with worse Paint, Layout, p95 or long-frame counts. Tablet RasterTask and
UpdateLayoutTree improve while Paint and Layout rise slightly. This supports the
narrow reward trade, but traced work does not replace the untraced frame packet
as timing authority and does not establish device-level causality.

## Ordinary-camera controls

The untraced `reward-cold-camera-frames/report.json` contains 24 rows with five
measured pairs per profile and exact frozen source/dist identity. Report SHA-256
is `91ebf3863de28fd6273cd18850e39d4b934c8abb46864b90dfc00971bfc49478`.
Both profiles keep p95 at or below 16.8ms. Phone worst is 33.5 to 33.4ms and
tablet worst is 33.4 to 33.5ms; intervals over 20ms fall from 7 to 5 for each
profile, with zero over 34ms. Every rebase-adjacent interval is at most 16.8ms.
The candidate main reward Canvas remains `1x1` and not running before and after
the route. There are zero terrain mutations, page errors and broken images.

The traced `reward-cold-camera-work/report.json` also contains 24 rows and exact
frozen source/dist identity. Report SHA-256 is
`4bbda92d17499aa556fa4e4016dd3b1fa7a7b5676d2ffa1f97c72111b7bf0c32`.

| Median trace work, public 18 to candidate 19 | 844x390 DPR3 | 1080x810 DPR2 |
| --- | ---: | ---: |
| RasterTask | 751.093 to 767.148ms (+2.14%) | 1058.777 to 1062.004ms (+0.31%) |
| Paint | 199.878 to 201.771ms | 217.082 to 218.612ms |
| Layout | 81.393 to 87.462ms | 126.847 to 126.098ms |
| UpdateLayoutTree | 362.957 to 361.684ms | 338.658 to 343.737ms |
| Intervals over 20ms | 6 to 8 | 10 to 8 |
| Intervals over 34ms | 0 to 0 | 0 to 0 |
| Worst interval | 33.3 to 33.4ms | 33.4 to 33.4ms |

The phone traced Layout median rises by 6.069ms across the full route, alongside
a 16.055ms RasterTask increase. Those are retained costs, but the untraced timing
authority does not show a tail regression and the tablet trace is close to
neutral. These controls are sufficient to rule out a material unrelated-camera
regression on this host; they do not establish physical-device parity.

## Final disposition and limits

I find no source, preservation, Chromium-pixel or measured web-performance
blocker in the frozen reward candidate. The first loot response improves
consistently, reward-route work remains bounded, and the ordinary-camera controls
do not show a material timing regression. I therefore accept frozen `d472037`
for the scoped Chromium web release with the slower board-entry phase and atlas
cache cost disclosed. This decision accepts that measured trade; it does not
reclassify it as a net cold-start speed improvement.

The following remain open after any web release:

- affected-device iPhone 13 and iPad 8 entry and first-opening observation;
- WebKit, GPU-memory, 3GB-memory, thermal and native-package behavior;
- the retained slower tablet entry and 313.7ms CPU4 mount outlier;
- whether users prefer the board-entry delay in exchange for the reduced first
  reward hitch.

The evidence does not justify further renderer or prewarming work before the
affected-device observations. If the trade is later rejected, the atlas/stage-
scale presentation seam can be reverted without changing v4 reward ledger or
save semantics.
