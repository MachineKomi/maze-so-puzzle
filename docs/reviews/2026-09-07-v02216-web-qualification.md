# v0.22.16 — Book progression, clean movement and living liquids

Frozen runtime **09d5475c522c410cbe723d4e0dd8bd76945400f6**, PR7,
`codex/book-completion-hazard-refinement`. Astra sole runtime writer; actual Sol
independently reviews source, pixels and raw paired reports. Qualification is
accepted by Astra and [actual Sol](2026-09-07-v02216-sol-final-review.md).
Publication completed at release815deb052e8e921e0a10356870af3c0e02d9f84f after exact
release CI34075470855 passed. [Public verification](2026-09-07-v02216-public-verification.md)
binds both origins and two fresh browser journeys.
The exact preceding public build is0.22.15/1e8b465.

Book completion now makes Next/Surprise primary after partial or perfect rescue.
Explicit Stay and Restart remain, and tester same-ID Book selection starts normal
play instead of resuming tester mode. The transaction itself is unchanged: exactly
one completion receipt, supported save-denial retry and newer-profile byte
protection. The old explicit Next index calculation was already correct; we
reproduced the old Stay focus/tester classification, not every detail of the
Human's original interaction. Normal visible-friend discovery remains legitimate.

The moving yellow dot was an old amber step-spark pseudo-element. Its movement
pulse/classes/keyframes are removed; player ground paint stays steady in all
four tested modes, including Lite's gradient. Jump/camera/actor presentation and
Power rewards retain their existing owners. [Book/MOVE evidence](2026-09-07-book03-move02-candidate.md).

HAZARD-03 restores phase-matched floor banks and transition at ordinary-floor
boundaries, with continuous wall shade across liquid/bank/floor. One non-floor
union prevents false floor at mixed hazard/wall/pit contacts. Two wrapped image
instances, slow20Hz ambient offsets and local water/lava/poison cues replace the
rejected marching dashes. Full has restrained motion; Lite/Reduced/Static retain
clear still materials and edges. No blur/morphology, new asset, dependency, rules,
save migration, gameplay RNG or timer. Accepted15 wall/foreground/actor geometry
is unchanged. [Design/cost trail](2026-09-07-hazard03-candidate.md).

## Frozen source and browser checks

664 tests/67files, TypeScript/build, budget/contracts/evidence schema, production
dependency audit(0 vulnerabilities) and deployment guard pass. Guard has nine
default passes/three explicitly skipped history cases. Exact source CI34074434881
verify and Windows compilation both succeed; compilation is not native release
acceptance. Latest published Windows remains0.22.9, native0.22.10 separately held.

Final browser packet `v02216-final-browser-20260907` contains38 passed cases,
zero unexpected/skipped/flaky results:10 Book save/routing,4 MOVE comfort variants,
10 hazard geometry/phase/campaign/mode,12 jump/shared-clock boundaries and2 prior
completion journeys. Final chapter proof restores engine-derived late snapshots
after actual Book launch; it is not a full final-maze browser replay.

Hazard proof includes8 connected shapes per material, two bright/dark themes,
eight lights, actual campaign surfaces at780×312/1194×834, and Full/Lite/Reduced/
Static. Mixed interfaces have no floor stroke; ordinary floor does. Cast samples
span floor/lip/transition/liquid, with wall/pit exclusion. Quarter-loop pixel
hashes differ and the full loop returns exactly to its first hash. World SVG
markup stays unchanged during actual moves; cadence plateaus/advances are bounded.
No page/broken-image errors, morphology or active ambient animation in still modes.

## Exact entry bytes

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| index.html |1070|8dc2fabc1e2ee5fde148827f9ce15d180fd02e32325dc11ba4a0af6fd6bd31b6|
| assets/index-aQLG22Mg.js |598960|6593a81e58d373faee015a29b91fd2ea9c246ca060c85a2fbe6cd390c137cd64|
| assets/index-DFsBSc8z.css |119811|d421c025b8ceaa4730a21d0a4f37d89611231cdf8c8ae53b40c1011c4e145a5a|

Gzip9 JS166072/166257 ceiling, CSS24074/31158; public155542751B unchanged.
Versus15, JS+170B/CSS−142B. The explicit200JS allocation has evidence/rollback;
it grants no timing waiver. No extra checkout or media copy was created.

## Five-pair performance result

Serialized nonempty idle and sixteen-step reversible moving cohorts, each with
five measured pairs plus separate warmups at780×312 and1193×833/DPR2, Chromium151
on this host. Four visible mixed hazards in Moonlit Friendship Quest, with matched
saved state/route/return. Frozen15 entry files share unchanged public media.
These are scoped headless frame/CPU trace observations, not GPU time, physical
phone/iPad/Safari/WebKit, low-end, thermal or native measurements.

| Cohort / viewport | RasterTask baseline→candidate median ms | Ratio of medians | Median paired change (range) | Paint ratio of medians |
| --- | ---: | ---: | --- | ---: |
| Idle780 |2450.290→2694.909|+9.983%|+9.520% (+6.305…+30.057%)|+1.909%|
| Idle1193 |6644.433→7674.052|+15.496%|+16.591% (+13.723…+17.210%)|+2.764%|
| Moving780 |1418.125→1488.552|+4.966%|+5.624% (−9.262…+10.298%)|+0.971%|
| Moving1193 |4254.128→4392.269|+3.247%|+1.982% (−0.849…+13.961%)|+2.635%|

All40 measured samples have maximum16.8ms and zero intervals over20/34ms; all
eight warmups also stay within16.8ms. Idle retains zero steps/one camera transform;
movement makes16 steps and returns, with no terrain mutations, page errors or
broken images. Overlapping trace durations are not additive. Ratio of medians
and median paired change are explicitly distinct; no outlier pair is discarded.

The continuous Full-mode idle increase is real, especially the consistent desktop
cost. It is not parity and is not excused by steady headless frames. Astra accepts
this bounded visual improvement after reducing the first prototype's work and
confirming that movement does not compound it. Actual Sol independently accepts
the same bounded cost with the stated limits. Still modes remove the ambient current and
physical/low-end/thermal qualification remains open. The older held R1 decision
and15's accepted jump cost are separate unchanged historical comparisons.

Raw reports/traces under `C:/GameDev/maze-game-qa/performance/`:
`v02216-final-idle-20260907/report.json` SHA256
cb005ebe35b8ee7056c8d89c4bdc1d4d95afa1f840c9bacd13117d790649d664;
`v02216-final-moving-20260907/report.json` SHA256
8501d9ed6fbf5a0fc960f573fe720edaaca45ba633e8e9afe878bacdf5e435b7.
Each has24rows and exact served hashes. All owned browsers/servers stopped.
The moving report names the fixture but does not inline its visible-cell count.
Its actual input is `v02216-final-browser-20260907/hazards/fixtures.json`, SHA256
2e8fce2d80116ef80acf5e803adc2a8f64f041a9982540969c6d680d864fb691, recording four
visible mixed hazard cells. No fresh run is needed for this provenance detail.

The Vercel guard remains intact. Promote once through Git integration, verify
both origins and fresh isolated public journeys, then close documentation using
that actual successful release as guard baseline. No cleanup/archive is authorized.
Next is the complete [authored physical-loot slice](2026-09-07-loot03-readiness.md),
with migration/conservation first; the [Human queue](../HUMAN_REVIEW_QUEUE.md)
keeps changed-build beauty/feel and device observations separate.
