# v0.22.8 next-focus review — Astra and Sol

2026-09-06. Human wants visible wall depth/lighting and rewarding wall-aware loot
showers while preserving performance. This is a bounded scheduling/technical
review, not adoption of every external proposal or a new game release.

Inputs: Claude's local `V0228-STATE-REVIEW-AND-NEXT-FOCUS.md`, 30,285 bytes,
SHA-256 `c1de770eb2dc574450441585f89681566395ae25f35555fa4bea0040f78db46f`,
reviewing `5b97434`; current source; existing PT36/art-proof preflights; and
the [new Human browser comparison](../user-playtests/2026-09-06-ipad-chrome-safari-comparison.md).
The full original remains at `C:/GameDev/maze-game-claude-review/`; this record
preserves the reviewed implications and source boundaries for other devices.

## Dispositions

| Proposal / claim | Joint disposition and delivery owner |
| --- | --- |
| Start visible walls before all ditch/weapon work | Adopt a tightly scoped **04-A**: environment value/scale, filter-free wall form and light-facing edges. Ditch joins/regions and actor/weapon grounding remain later gates; do not call all Plan04 unblocked. Astra writes, actual Sol reviews. |
| Full-world hazard masks may contribute to iPad stutter | Confirmed source structure: App passes `worldWindow = fullLevelWindow(level)` to MazeTerrain inside the scaled camera world. Its water/lava/poison masks use morphology+blur. The nominal 23/6-scaled CSS extent is not measured GPU raster cost; causal attribution remains a hypothesis. Integrate a same-build/same-route diagnostic with 04-A; do not declare WebKit a proven cause. |
| Chrome test should show no difference / says nothing | Reject that conclusion. Human reports Chrome smoother with residual stutter. Unknown build/settings limit inference but do not invalidate observation. Apple allows alternative engines under specific conditions; engine identity is not known from the app name alone. |
| Retry Lite because Human only tested v0.22.0 | Correct the history: Human retried reduced options on v0.22.1 and later. Do not create another unchanged test chore. Retain exact version/settings in the next new diagnostic. |
| PT36 is a one-line zOrder fix | Reject simplification. Rear order was deliberate to protect Ame's face; top-edge, sway and jump compositions have distinct attachment paths. A bounded equipped comparison is still required. Hold actor/weapon grounding on it, not all wall-only work. |
| Extrusion is cheaper and prettier | Strong design candidate, not a benchmark result. Prefer shared solid faces/contact bands and selective highlights over full-perimeter blur. Preserve one-tile floor width, source texture clarity, concave corners and Lite/static depth. Measure node/raster/rebuild/paint behavior before claiming a performance win. |
| Brightness multiplier proves floor/wall hierarchy | Reject as a sufficient test. Decode art and inspect composite luminance/texture/dressing at field size and grayscale; different source pixels invalidate a multiplier-only assertion. The light-floor/darker-wall intent remains binding. |
| Add will-change/contain as a four-line fix | Experimental only. Large promoted layers can increase memory, and containment can clip effects. No blanket runtime hint without matched evidence/rollback. |
| Canvas for wall-aware reward showers | Preferred candidate to compare with a capped reused-DOM pool, not predetermined winner. One viewport-sized surface, bounded DPR/particle count, no new physics dependency, one lifecycle owner. Avoid per-token React state/timers/filter chains. Plan02's first visible tranche. |
| Current audio voices go straight to destination; compressor required | Source correction: per-note gain routes to the shared calibrated SFX bus; music has its own bus; 24 oscillator voices are already capped. No common master/compressor exists, but a compressor is a measured mix choice, not an automatic prerequisite. Aggregate/throttle/pitch bounded collection cues and test peaks/listening with existing gain/mute/hide behavior. |
| Physics + magnet + Power count-up | Adopt presentation-only scatter of committed awards, tile-wall collisions, bounded settle/collection, target the presented Ame position, and settle displayed totals on interruption. No collision/animation can lose or award currency. Use exact text/grouped tokens for large values. Persistent account XP is still Plan14, not secretly implemented here. |
| Economy sink, braiding, ambient life, App extraction | Keep existing Plan09/10/14 ownership. Do not require a new economy before improving feedback. New effect code gets a bounded owner outside App; broader game redesign is not this tranche. |

## Why this changes the queue

The Human repeatedly prioritizes delight and visible progress. Dependency gates
should protect the affected surface, not serialize unrelated work. After the
bounded proof repair, **04-A may prototype and ship independently of new ditch
art and PT36**, excluding their geometry/actor-light contracts. 04-B consumes
accepted ditch topology and addresses region/receiver integration; actor/held
grounding waits for PT36. Reward-first Plan02 may prototype early and publish
against accepted 04-A scene/performance seams without requiring unrelated region
authoring. Full Plan04/02 completion still requires their remaining checklists.

Suggested provisional particle ceiling is 64 across the scene, not one per unit;
profile it before adopting. No declared source-count or nominal megapixel budget
is a measured device frame-time result. Keep reduced/static exact outcomes and
the existing six-tile camera/precise gameplay rules.

## Independent review and correction

Actual Sol reviewed read-only via the existing review agent. Both models support
the scoped 04-A / reward-first split and the cautions above. Sol initially inferred
camera clipping from MazeTerrain's parameter name; Astra challenged it by tracing
the App call. Sol explicitly retracted that statement after confirming full-world
props. The table records the corrected result, not manufactured first-pass consensus.
No tests or device measurements were claimed by Sol's source review.

Primary references checked 2026-09-06:
[Apple alternative-engine conditions](https://developer.apple.com/support/alternative-browser-engines/),
[WebKit layer inspection](https://webkit.org/web-inspector/layers-tab/) and
[Apple layer memory guidance](https://developer.apple.com/library/archive/documentation/AppleApplications/Conceptual/Safari_Developer_Guide/ResourcesandtheDOM/ResourcesandtheDOM.html).
These justify conditional browser/layer reasoning, not a diagnosis of this iPad.
