# v0.22.17 CAMERA-17 — independent Sol final review

Sol, September 7, 2026. I independently reviewed frozen source
`eff0530820760fa7a5f22ac5ae68327dad626653`, its corrected visual packet and
the completed paired performance records against public web 0.22.16 source
`815deb052e8e921e0a10356870af3c0e02d9f84f` / runtime
`09d5475c522c410cbe723d4e0dd8bd76945400f6`. I recommend this exact candidate
for the bounded Chromium web release. I found no remaining source, rendered
continuity, minimap or current-host frame blocker.

This is a scoped engineering disposition. The reported iPhone 13 and
eighth-generation iPad stutter is not closed until the changed public build is
played on those devices. This review does not qualify physical Apple hardware,
WebKit, native packaging, GPU memory, low-memory residency, thermals or Human
visual acceptance.

## Source and behavior

The candidate retains at most the camera field of view plus two tiles on each
edge, four tiles per axis. The existing travel owner updates the integer world
origin, three SVG viewBoxes, user-space masks and shared fractional translation
in one pre-paint animation-frame pass. Normal interpolation remains continuous; only
the retained window rebases. Full-world collision, terrain identity, wall
geometry and texture phase remain stable.

Animated liquid paint is isolated in a lower SVG while dry floor, shore,
casts, walls and foreground paint remain in the static and foreground SVGs.
The new liquid SVG owns local copies of the clip definitions it consumes. The
preserved foreground still reuses wall-volume definitions across roots, and
existing cross-root clip dependencies remain. Objects, followers and holes use
the retained origin; the player and replacement presentation remain
camera-anchored. I found no
concrete run-key, restart, jump, portal, resize or hidden-page path that leaves
the production nodes bound to a stale window. The retained functional and
rebase cases exercise those transitions.

The minimap replaces the per-tile HTML terrain grid with grouped SVG terrain
paths and sparse HTML markers. Current view, remembered terrain, mystery fog,
guidance, player and overlapping-object semantics remain separate. The change
does not alter solver rules, movement, save/progress data, level identity,
audio or public media.

The frozen entry is `assets/index-CTYfMU9E.js`, 602,800 bytes, SHA-256
`060cd653186d4888965c047858c1a6e1eae64282da478e89c115646f513118fe`,
and `assets/index-BVffqDNp.css`, 120,280 bytes, SHA-256
`050565a839dbd47fb285909012a0e2b9a596bbc268f0a4f3b212204b6e501c7b`.
The saved runtime-input and distribution fingerprints match the candidate in
every final comparison report.

## Corrected visual and functional evidence

I freshly inspected the corrected DPR1 and DPR3 map-palette frames, the
844-pixel Shiny Sword gameplay frame and representative DPR1/2/3 rebase pairs.
The rebase pairs show the camera advancing `.08` tile while the retained origin
moves two tiles. Floor, liquid, banks, wall caps/faces/casts, foreground,
actors, followers, cage, item and hole stay continuous. I saw no exposed strip,
phase jump, independent layer movement or foreground seam.

My earlier visual impression that the first grouped minimap preserved its
palette was wrong and is retracted. Root correctly found that CSS descendant
fills did not paint reliably through SVG `use` instances; the revealed map was
nearly black. Frozen `eff0530` assigns the fill intrinsically to each terrain
path. The corrected DPR1 and DPR3 probes both sample floor `246/217/145`, wall
`116/115/162`, remembered `189/176/148` and mystery `58/55/79`. The repaired
map is visibly readable in
[`shiny-sword-844.png`](../../../maze-game-qa/performance/camera17-reviewed-browser/camera-window/shiny-sword-844.png).
The corrected 11-case camera/map/resize/rebase packet passes with no unexpected
result; its report SHA-256 is
`d04d7bcc05dd4b50a0bac11f945be4176018ef5d33271b62d07b7a3c32b1dc94`.

The expanded source-matched browser run first passed 72 of 73 cases. Its only
failure was a follower computed-position difference of about `.011` painted
pixel against a sub-quantum probe tolerance. The revised bound remains strict
at `.025` painted pixel, below two 1/64 CSS-pixel quantization steps, and both
complete five-friend journeys subsequently pass. I treat this as a corrected
measurement assumption, not evidence of a runtime follower displacement.

The controlled rebase images pause ambient and pose animation and use a fixed
16 ms clock. They qualify alignment and continuity only. They are not real-time
performance samples or Apple-device evidence.

## Independent performance calculation

The six final route reports each contain five measured baseline/candidate pairs
and one warmup pair per layout. They alternate order, use Chromium 151 on one
Windows host at CPU throttle 4, bind exact served hashes, perform sixteen
ordinary steps and return to the exact starting point. Frame cohorts disable
trace and LayerTree capture. Work cohorts capture normal Paint/Raster traces
without layer-picture snapshots. All rows report zero terrain mutations, page
errors and broken images.

| Route / layout | Untraced intervals over 20 ms, 16 → 17 | Frames, 16 → 17 | RasterTask median totals, 16 → 17 | Ratio of medians |
| --- | ---: | ---: | ---: | ---: |
| Four visible hazards, 844×390 DPR3 | 47 → 12 | 1329 → 1322 | 2177.299 → 1602.918 ms | -26.380% |
| Four visible hazards, 1080×810 DPR2 | 77 → 9 | 1317 → 1324 | 3999.052 → 1822.382 ms | -54.430% |
| Shiny Sword, 844×390 DPR3 | 4 → 6 | 1285 → 1282 | 1796.390 → 742.564 ms | -58.664% |
| Shiny Sword, 1080×810 DPR2 | 7 → 7 | 1289 → 1284 | 3054.273 → 1044.086 ms | -65.816% |
| Lanternlight, 844×390 DPR3 | 4 → 4 | 1330 → 1292 | 2110.384 → 952.185 ms | -54.881% |
| Lanternlight, 1080×810 DPR2 | 11 → 6 | 1332 → 1287 | 3952.168 → 1171.719 ms | -70.353% |

Every candidate sample in the three untraced five-pair cohorts has p95 at or
below 16.8 ms, worst at or below 33.4 ms and no interval over 34 ms. Shiny Sword
does not improve its already-small Chromium tail count consistently, but the
separate traces show materially less repeated raster and paint work at both
layouts. Paint median totals fall 41.588% phone and 42.908% tablet. Its phone
UpdateLayoutTree median rises 9.663%, while tablet falls 1.475%; Layout falls
5.624% phone and rises 14.717% tablet. Those categories overlap and cannot be
added.

The hazard work cohort retains one candidate tablet trace interval of 50 ms
while that traced baseline's worst interval is 33.4 ms. This outlier does not
appear in the separate untraced five-pair frame cohort, where candidate tablet
worst is 33.4 ms and no interval exceeds 34 ms. It remains a real limitation,
not a value to average away. Paint is +1.611% phone and -3.009% tablet in the
hazard trace cohort. Lanternlight Paint falls 20.812% and 18.235%; its phone
UpdateLayoutTree rises 11.168% while tablet falls 5.444%. RasterTask and Paint
durations overlap, are sensitive to tracing, and are neither GPU time nor a
percentage of user-perceived latency.

The exact final report hashes are:

| Evidence | SHA-256 |
| --- | --- |
| `camera17-reviewed-hazard-frames/report.json` | `67b62204379eb7263a9177ac019cfabfeec77b012454b49fb720667317620af5` |
| `camera17-reviewed-hazard-work/report.json` | `3b6d05fdd688491989694655e5efe9d57a936eb72de44232b195abc2e78131fd` |
| `camera17-reviewed-maze2-frames/report.json` | `1d547d0aaf585d56b96d5012231b724d5d38d88efad3637302437ce3529e9105` |
| `camera17-reviewed-maze2-work/report.json` | `181919cb988e5846ed5ffb80f602ffe9bf5d3465cbb3b01d1289a6a7562f9d08` |
| `camera17-reviewed-maze10-frames/report.json` | `09bb4064e6562843a1b364984665dc9261fa16a6e915b23755c2abf8de9c5f03` |
| `camera17-reviewed-maze10-work/report.json` | `18ce6cc78228ad7176ff321a3794410aeeb53d02ff711d611f423c78646e5ef9` |

## Sustained, reference and compositing limits

The unthrottled Chromium reference contains five pairs at 844×390 DPR3 and
1280×720 DPR1. All 20 measured baseline/candidate samples have worst intervals
at or below 16.8 ms and zero over 20 or 34 ms. Report SHA-256:
`d1c4d4cf11fe7364f1e10fb7e4f9b4d1a41a27d70be670a42564958dce99dd0d`.

The separate CPU4 sustained diagnostic performs exactly 256 steps over 16
repetitions. Intervals over 20 ms fall from 61/4283 to 4/4156; both sides have a
33.4 ms worst interval and zero over 34 ms. Candidate duration is 69.331 seconds
versus 72.397 seconds, with 128 rebases, exact return, no mutation/error and no
growth beyond the normal first-discovery endpoint. Nodes move 350→361 and
images 36→39 for the candidate; the browser-rounded heap stays 10 MB on both
sides. Report SHA-256:
`a39fc7926dc93cd58800e96e94ca80613a0b5a3db6d9bcc1934c78e0381f8223`.
This is useful repeated-route evidence, not a thermal soak or memory profile.

Layer snapshots expose a material tradeoff. On the large hazard scene, layers
increase 20→26 phone and 19→25 tablet. The largest content rectangle falls from
2668²→1160² and 2177²→947² CSS pixels, while the sum of all `drawsContent`
rectangles falls only 3.41% and 3.56%. On Shiny Sword, layers increase 13→20 and
12→19, and the rectangle sum rises 58.57% and 60.69%. These rectangles overlap,
include roots and filters, and are not allocated memory or Apple compositor
residency. They prevent any claim of an 81% total-RAM reduction or universal
memory improvement. The large and small layer report SHA-256 values are
`9d2c3846a41d05b36c90a1affdf14cf8cc04018b8a41d2af79690f04cc66b993`
and `1c7efbd00af24344711d8ca06f7529248d7364e279bb9ba8b7a9ba5a87c1e7ec`.

The promotion controls justify retaining that disclosed layer cost for this
candidate:

- Removing all four promotion hints on Shiny Sword reduces the one-pair layer
  snapshot from 20→13 and the phone rectangle sum from 6.682M→3.931M, but the
  same-source five-pair phone work comparison raises RasterTask median from
  730.618 to 1740.518 ms (+138.22%, 2.382×) and Paint from 194.609 to
  231.960 ms (+19.19%). Frame tails are effectively equal at 6/1293 versus
  6/1289 over 20 ms. The five-pair report SHA-256 is
  `d10be92d059e6d6cbb2edf3635227cb66513ea9a2519037d81a4d3739c4eb2ee`.
- Removing only world/foreground promotion is a one-pair pilot and raises
  RasterTask 783.434→959.262 ms (+22.45%) phone and
  1114.745→1640.138 ms (+47.13%) tablet. It does not establish a useful middle
  policy. Report SHA-256:
  `6b82a3caf3d69ddad8c0189e86cdbd3d60fce07bce65743af60ebb733c589b6e`.
- Removing only terrain/liquid promotion saves two small-scene layers but only
  0.22%/0.25% of the summed rectangles. On the hazard one-pair trace control,
  the same removal raises RasterTask 52.87% phone and 26.74% tablet. These are
  pilots, so they support the selected aggregate rather than attributing a
  causal share to one layer.

Most directly, the full live-16 versus promoted-17 Shiny Sword work comparison
shows RasterTask reductions of 58.664% phone and 65.816% tablet and Paint
reductions of 41.588% and 42.908%. This repeated work evidence is more relevant
to the reported movement stutter than a browser layer-rectangle proxy. I do not
recommend a small-maze downgrade or conditional promotion policy before this
release.

## Disposition and remaining gate

I accept the extra bounded surfaces for this web candidate because the exact
live comparison substantially reduces raster work on Shiny Sword, the large
hazard and Lanternlight routes also improve, all untraced candidate tails stay
bounded on this host, the sustained journey remains stable, and the controls
show that removing promotion gives the raster work back. The minimap palette
blocker is corrected and the rebase frames show no visible continuity defect.

The conclusion is limited to publishing this exact Chromium-tested web build.
Windows CPU throttling does not emulate an iPhone 13, iPad 8, Safari/WebKit,
3 GB memory pressure, Apple GPU tile memory, battery state or thermal load. The
installed Playwright WebKit runtime could not run because Windows Application
Control blocked its `libsharpyuv.dll`; no security bypass was attempted. The
iPhone 17 observation is a useful control but does not establish a memory floor
or prove the affected devices fixed.

The required product check is a changed-build playtest on the reported iPhone
13 and iPad 8, covering Maze 2 ordinary camera travel and a later large/hazard
maze over a sustained route. If either device still stutters, this review must
not be cited as physical resolution; preserve the evidence, compare the exact
public build, and decide whether to revert or continue with device-observed
profiling. Publication, public verification and Human acceptance remain
separate Astra/Human decisions.
