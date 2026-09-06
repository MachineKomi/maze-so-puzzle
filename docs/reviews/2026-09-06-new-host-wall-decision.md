# New-host wall decision — HOLD R1

Astra and actual Sol independently retain R1 as an optimization candidate. The
authorized phone/audio/Book release proceeds with the accepted v0.22.10 wall
implementation. R1 remains committed on the migration branch; separation is an
explicit new branch and source restoration commit, not discarded work.

At `0c951e68624782cce7bbb09144fd6704f2e7cb60`, the frozen paired harness
`scripts/performance/new-host-wall-ab.mjs` completed twelve routes, including
warmups: three alternating desktop pairs and one compact pair. All routes made
exactly sixteen steps and returned to their start, with no terrain mutations,
console/page errors or broken images. Frame p95 was 16.7–16.8ms in both modes.
Desktop mean RasterTask duration totals were 5921ms baseline / 8134ms R1 (+37.4%);
compact was 1563ms / 2147ms (+37.4%). Task counts were essentially unchanged.

These overlapping trace durations are a raster-work proxy, not GPU time or a
37% user-latency claim. Headless Chromium maintaining vsync does not establish
equivalent device headroom. One compact pair is corroboration, not replication.
The older laptop's concerning frame comparison remains valid evidence. The
later cast-shadow isolation did not establish a shadow-specific cause.

Sol freshly inspected all four captures and found meaningful added face/lower
edge depth. This is source/screenshot review, not motion, Human beauty, physical
iPad or native acceptance. Next bounded wall experiment: attribute candidate
cost by hiding only side/foot/contour passes, then top shade/highlight/dressing
passes, with alternating paired routes. Optimize the implicated pass before
considering a backend rewrite. Next formal comparison hashes every served asset
and adds a reverse-order compact pair. This run's baseline asset fallback uses
unchanged current public media; it must not be reused after media changes.

Evidence: `output/playwright/new-host-wall-ab-20260906/report.json`, SHA-256
`3517cb5e22258763592141587aec47c64477d141bec2f72872e826f513df42ec`, plus raw
traces and four captures in that directory. Script records exact entry hashes.
Live web remains 0.22.10; published Windows 0.22.9; native 0.22.10 remains a
separate unfinished qualification. No deployment occurs at this checkpoint.
