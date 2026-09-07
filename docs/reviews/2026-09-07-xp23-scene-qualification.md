# Adventure XP and SCENE-23 qualification

Frozen candidate **6ee51c4a3f1d6b18c39e309cea26111aff1e3df3**, branch
`codex/adventure-xp`, [PR14](https://github.com/MachineKomi/maze-so-puzzle/pull/14).
Astra owns runtime; [actual independent Sol review](2026-09-07-xp23-sol-review.md)
owns its disposition. **All four source-matched performance cohorts are complete;
Sol supports bounded web promotion. Web22 remains live until reviewed-head CI
and Git promotion.**

## Scope and preservation

The [five-point Human scene intake](../user-playtests/2026-09-07-doors-depth-power-and-jump.md)
is implemented by [SCENE-23](../plans/SCENE-23-depth-and-scale.md). Doors use
natural-proportion tall frames, with alpha-visible height1.25–1.35 tiles and
jamb width at most1.12 tiles. All eight floor weapon families match their own
held canvas scale; visible widths0.582–0.734 tile retain corridor clearance.
Objects, friends, Ame and solid replacement presentations share a bounded
ground-Y ordering. Opening doors dissolve below solid actors. Accepted balanced
wall geometry, collision, lighting and outer closure remain unchanged.

Ame's sole Power label sits above walls and solids and shares travel/pose clocks.
Its34%-tile font and1.6%-tile stroke avoid the old fixed pre-stage font cap.
The tested physical line height is17.0896px at780x312 and32.1875px at1080x810,
about0.34 tile in each case. Jumping Ame stays above walls, her grounded effect
below them, and her label above both. Boots imagery/attachment styling is removed
from jumps; the actual pickup, inventory and ability remain. There is one scene
travel owner, with four cached jump CSS handles, no new frame layout read or
React frame update. The added actor plane shares the retained view+4-tile window;
its practical performance cost is reviewed below, not assumed free.

[LOOT-03 C](../plans/LOOT-03C-adventure-xp-execution.md) adds rainbow physical XP
only on final enemy/Mimic defeats, preserving immediate puzzle Power and existing
Gold/Science random outputs. Enemy XP is2/4/6/10 by Power band; Mimics double it.
Collected XP banks with solve10 only through the existing Next completion receipt.
Stay/re-win does not duplicate a receipt; grounded loot stays optional and unbanked.
Book Stats shows saved Adventure Level; completion shows pending progress. Level
is recognition only, with no stat, purchase or progression lock. One campaign
pass supplies160 solve XP and at most210 physical XP, reaching Level5–8. Level99
is a numeric safety cap, not a target/checklist. Inventory must precede rare eggs.

Profile8 and active-run7 keep their established storage keys. Old profiles get
XP0 without invented history; old resolved encounters retire only their new XP
channel. Gold/Science and exact historical layouts remain protected. The new
all-phase regression found and fixed a real v6 chest migration bug: only versions
before6 may synthesize an empty chest array. Revealed/open/defeated v6 receipts
now survive. Future/malformed/denied-write profiles and runs remain protected.
The restart warning includes collected but unbanked XP even with an empty floor.

## Source and art checks

757 project tests pass in77 files. TypeScript/Vite build, performance contracts,
byte budgets and locked art check pass. Runtime CI
[34131320576](https://github.com/MachineKomi/maze-so-puzzle/actions/runs/34131320576)
passes both web verification and desktop compilation. Compilation is not native
release acceptance; final reviewed-head CI remains a separate release check.

Final JSgzip9 is178580 bytes (+1962 versus22), CSSgzip9 is24665 (+369), public
runtime155555324 bytes (+12573). These fit178669/31622/165031011 ceilings,
including the explicit400-byte scene allocation. No dependency was added.
Runtime input SHA-256 **793236438ae68281d8ea50d8f6e4b0f59112e7c126d184c1e621d7b6faecdd2d**;
dist fingerprint **327e3474136558dab6c72cd9813b8de1fb3380afe3efa3974050470c31b38836**.

The new original generated crystal has a preserved prompt, immutable generator
source and [strict source record](../source-assets/records/adventure-xp-v1-source.json).
The128-square derivative is12573 bytes/65536 decoded RGBA bytes and loads lazily
on an XP-capable scene; a code facet fallback remains available. Sol checked
native alpha, exact hashes and a tiny/grayscale board. Mounted phone proofs on
light and Twilight terrain measure19.7539px canvas at alpha1; combining its draw
transform with frozen51x114/128 alpha geometry gives7.8707x17.5933px visible ink.
This is source-geometry/draw-size plus visual proof, not rendered pixel-alpha
sampling. The pointed silhouette survives; facets are secondary at this scale.
Human art acceptance and ART-REWARD-01 proper Gold/Science/Power art remain open.

## Browser evidence

`xp23-final-browser` passes120 of122 contracts. Two painted-position assertions
were tighter than browser1/64 CSS-pixel quantization (differences below0.01px).
Their corrected follow-up uses a bounded0.025 painted-pixel tolerance while
retaining engine-state assertions. `xp23-final-scene` passes26/26, including
those cases and all affected final font/stroke, edge/follower, jump, replacement,
door and weapon checks. Together these cover122 distinct contracts, **not one
clean122-pass run**. The later runtime change is only the final proportional
Power font/stroke. Earlier101/117 and interrupted XP-only packets are retained
as development evidence, not final qualification.

The combined matrix covers XP completion/Stay/re-win/Book and denied run/profile/
clear transactions; all three genuine v22 chest migrations; real chest and enemy
rewards; historical layouts; canvas failure, capacity and cleanup; ordinary and
reversed movement, touch/resize/blur/hidden handoffs; bounded camera rebases;
followers, portal/battle/rescue, jump departure/apex/landing and edge labels.
Engine goal-entry proof confirms accepted claims are already settled before App
sees the won result; Sol retracted the suspected stale-preview defect accordingly.

Astra and Sol independently inspected the final phone/tablet images. Complete
Power strokes remain within the tested board edges; larger doors, matching weapon
scale and boot-free jumps are coherent. Jump data binds actor27 > wall26 > ground25,
with label60 and synchronized three actor/ground handles plus one label handle.

## Paired performance

Four serial five-pair cohorts compare frozen published22 with the exact candidate:
camera and ordinary enemy combat, each with separate untraced frames and traced
work. Each expects24 contexts: four warmups and five measured pairs per profile,
CPU4,844x390/DPR3 and1080x810/DPR2,500ms entry settle. The unchanged camera route
is16 reversible steps. Combat is the same final defeat and two reversible steps;
XP is an explicit added third currency, not an identical-effect claim. One exact
candidate-only media hash is allowed; unchanged historical media is required.
Work cohorts also record layer metadata; their trace overhead is not frame timing.

All96 contexts completed with zero page errors, broken images or terrain
mutations; routes returned to their exact starting positions. All measured p95
values are16.8ms or below. Each cell below compares baseline22 → candidate23.
Frame timing is taken only from the untraced cohorts.

| Route/profile | Median maximum ms | Worst maximum ms | Frames >20ms | Frames >34ms |
| --- | ---: | ---: | ---: | ---: |
| Enemy844 |49.834 →33.300|66.868 →33.700|10 →4|5 →0|
| Enemy1080 |49.834 →16.938|66.800 →33.400|8 →2|5 →0|
| Camera844 |33.300 →16.900|33.500 →33.400|4 →1|0 →0|
| Camera1080 |33.200 →17.000|33.400 →33.500|3 →2|0 →0|

Separate traced-work medians, milliseconds per complete route:

| Route/profile | Paint | RasterTask | Layout | UpdateLayoutTree |
| --- | ---: | ---: | ---: | ---: |
| Enemy844 |566.005 →581.629|35.240 →35.597|98.061 →96.319|324.583 →343.820|
| Enemy1080 |571.806 →585.417|31.022 →31.520|117.506 →124.653|306.951 →316.333|
| Camera844 |349.615 →341.664|19.690 →18.409|101.285 →102.643|357.527 →391.781|
| Camera1080 |359.883 →352.612|18.687 →17.402|146.324 →150.668|322.790 →355.155|

Trace categories overlap and must not be added as total CPU/GPU time. The actor
plane/label has a measurable cost: combat Paint rises about2.4–2.8%; camera
UpdateLayoutTree rises about9.6–10.0%. Camera Paint/Raster medians decrease.
Layer counts rise17→18/16→17 in combat and20→22/19→21 on the camera route.
Maximum reported layer areas remain1,345,600/896,809 CSS pixels. Counts/areas
are metadata, not measured RAM; the additional plane is not free. Astra finds
this bounded tradeoff acceptable given improved ordering/readability and no
observed frame regression. Sol independently recomputed the reports and supports
bounded web promotion with the same limits.

The external `xp23-summary/paired-summary.json` and `integrity.json` bind all
four raw-report SHA-256 identities, exact24-row/5-pair counts, runtime/dist
fingerprints and final HTML/JS/CSS/crystal bytes. `summarize.mjs` reproduces
the compact summary without rerunning browsers. Only the declared crystal
media exception differs from the historical served-media identities. The raw
harness scope text still says "candidate dual-currency conservation" for enemy
routes; this is stale wording. Actual candidate rows contain and conserve all
three Gold, Science and XP channels, versus two in the baseline.

Physical iPhone13/iPad8/3GB, cold first-Power, native and
Human play acceptance remain separate open items. Chromium CPU4 is not a memory
limit or Apple/WebKit qualification. Published Windows remains0.22.9 and native
0.22.10 qualification remains unfinished. [Artifact ledger](../LOCAL_ARTIFACT_LEDGER.md).
