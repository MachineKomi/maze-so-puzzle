# Sol–Astra disposition ledger — Opus v4 and v0.22.0 response

Date: 2026-09-05. **Astra and Sol independent assessments complete; joint routing reconciled below.**
Astra inspected documentation HEAD `5f7f8c957f1b42095d96248eae3eb77d038768a9`;
Sol inspected `db1139cb792db2d67b54e1f82d653dd8186a13a6`. Runtime remains unchanged at
`68e303da680d5aec0ba71154949c5a2a0d1697ae`.

Sources: [Opus v4](external/2026-09-05-claude-opus5-maze-so-puzzle-review-v4.md), [focused response](external/2026-09-05-claude-opus5-v0220-feedback-response.md), [exact provenance](external/2026-09-05-v0220-review-pack-provenance.json), [Human raw feedback](../user-playtests/v0220-playtest-feedback.md), and [Astra's evidence/intake/next-step assessment](2026-09-05-astra-v0220-review.md).

The Human explicitly assigned **Astra the first turn**, superseding the prior
Sol-first handoff. Three delegated read-only reviewers assisted Astra; none
supplied Sol's later independent position. The **Astra position** column records
that first assessment; the **Sol position** and **Joint decision** fields now
record the reconciled routing. The ledger still does not authorize blanket
runtime implementation. The Human's explicit requirements remain authoritative
even where Claude's explanation is mistaken.

## Coverage and decision rules

- **88 unique rows:** all 80 historical rows plus BUG-01/02/03, FEEL-07, PERF-05b/12/12a and UI-17.
- Historical quick-win aliases DESIGN-04a, JUICE-05a, UI-02a/02b remain traceable although no longer explicitly headed in v4. UI-16 now occurs only in the abbreviated index. There is no PERF-08 finding; mentions of its absence are not a row.
- The [v3 skeleton](2026-09-05-sol-astra-opus5-disposition.md) and immutable v3 source remain historical. Its uncommitted/fef baseline warning does not describe v4, which names 5f7f8c9.
- Astra read both complete current reports, the raw Human feedback plus its attributed summary, and all 51 supplied images. The reports' stated 53-image inventory is not the supplied folder's count.
- Sol independently considered the complete sources and current evidence. Its
  detailed synthesis is [the Sol review](2026-09-05-sol-v0220-review.md); the
  final column records agreement, modification or disagreement rather than a
  ceremonial approval.
- Final joint outcomes must distinguish adoption, modified adoption, already addressed in code versus only planned, experiment, named deferral, and rejection. Disagreement needs an evidence/test/decision path, not manufactured consensus.
- Routing is a proposal for existing ownership, not authorization to implement every row now. Specific execution briefs/spec changes follow reconciliation; avoid duplicating the complete specialist plans here.
- Source assertions labelled verified by Opus are still source assertions. Code can establish a mechanism, not physical-device performance or family delight.

## Movement and camera

| ID | Astra position and rationale | Proposed owner / acceptance gate | Sol position |
| --- | --- | --- | --- |
| CR-FEEL-01 | Experiment, not a new default. Adaptive 9–15-tile FOV changes information reveal and readable sprite scale; Human likes the current primary-device composition. | 08/PT32: retain approved optional 4/5/6/7, default 6; compare alternatives with Human before changing. | Agree with stronger closure: reject 9–15 as a current-program default; retain PT32's future 4/5/6/7, default 6. |
| CR-FEEL-01b | Experiment separately. Rectangular visibility is not required to fix short-height UI; it changes fog, camera and map composition. | 08 + 07: review rectangular comparison, visibility rules and actual painted workload. | Agree. A rectangular comparison is a later experiment, not a prerequisite for short-height UI fit. |
| CR-FEEL-02 | Defer camera comparison until contention is measured. Exponential follow is first-order smoothing, not the claimed second-order critically damped spring. | 08: same-route A/B, first taps/corners/reversals; no mandatory dead zone. | Agree. Diagnose performance first; compare follow models only if comfort remains, with no mandatory dead zone. |
| CR-FEEL-03 | Adapt: coordinate intent, repeat cadence and presentation. An rAF accumulator is not automatically Plan 10's deterministic rules clock. | 08/10: one-move authority, no catch-up after stalls, ordering/cancellation tests. | Agree. Unify semantic intent/presentation ownership, not rules, CSS and audio in one mega-clock. |
| CR-FEEL-04 | Experiment, not automatic speed-up. A 120 ms cadence may harm precision or comfort. | 08: child/device comparison after performance fixes; preserve gentle acceleration and deliberate taps. | Agree. Cadence is a play-feel choice requiring device/family comparison after frame pacing is stable. |
| CR-FEEL-05 | Experiment on PT33 seams. Pixel snapping can trade seam shimmer for quantized travel; baking does not guarantee elimination. | 04/07: inspect fractional positions at actual DPRs, camera movement and contrasting themes. | Agree. Pixel snapping and seams need actual-DPR evidence; neither quantization nor baking is a guaranteed fix. |
| CR-FEEL-06 | Measure before changing the shared timestamp policy; preserve the verified first-step correction. | 08: timestamp/retarget trace plus first-tap and rapid-reversal video evidence. | Agree. Preserve the first-step correction and measure before changing timestamp policy. |
| CR-FEEL-07 | Adopt with lifecycle constraints: suspend repeat, retain eligible live held intent through successful interactions, never queue catch-up. | Near-term input correction / 08: release, steering, cancel, blur, modal and scene-switch tests. | Agree; this is already specified desired behaviour and currently an implementation defect. Resume success only; fresh input after a block. |

## Performance

| ID | Astra position and rationale | Proposed owner / acceptance gate | Sol position |
| --- | --- | --- | --- |
| CR-PERF-01 | Already addressed in current code: terrain/world-window stabilization landed. Do not repeat the historical fix. | 07: preserve memoization; instrument actual invalidations if it regresses. | Agree. Preserve the landed terrain stabilization and do not book it again as new work. |
| CR-PERF-02 | Adopt bounded derivation stabilization. MiniMap receives a freshly filtered objects array; legitimate movement still changes visibility/cursor. | Near-term / 07: no cursor-only minimap rebuild; preserve complete reveal and semantic markers. | Agree; high-confidence near-term correction with exact reveal, marker and nonvisual-semantic tests. |
| CR-PERF-03 | Adopt for board-touch cursor state. ThumbPad already handles cursor coordinates locally and parent steering on direction changes. | Near-term / 07–08: no extra whole-App commits solely from same-direction cursor motion; test both input surfaces. | Agree. Fix board-coordinate commits; do not misattribute the same defect to the fixed ThumbPad. |
| CR-PERF-04 | Adopt scoped scene binding invalidation; useSceneTravel queries on every commit. A dependency list alone must not miss new followers/overlays. | Near-term / 07: bind on node-set change, retarget separately; rescue/transition/resize tests. | Agree, instrument first. Split node discovery from retargeting only with full follower/resize/discontinuity coverage. |
| CR-PERF-05 | Experiment with containment only where safe. Paint containment can clip glows and change stacking; compositor promotion is not guaranteed. | 07/04: compare paint/layer traces and visual bounds before retaining. | Agree. Containment is a measured trial because glow clipping and stacking are product regressions. |
| CR-PERF-05a | Experiment, not free optimization. will-change can consume memory; lack of the property does not prove lack of promotion. | 07: target measured layer bottlenecks, remove hints that do not help. | Agree. Add compositor hints only where traces earn their memory/layer cost. |
| CR-PERF-05b | Same caution for strict containment: layout, sizing and off-edge art may change. | 07/01: validate intrinsic size, layering, overlays and memory. | Agree. Strict containment is not a free global optimization. |
| CR-PERF-06 | Adapt delivery audit; full public bytes are not startup network or resident memory. Existing tracks are Human-authored, not assumed duplicates. | 07/12: classify actual requests/retention; preserve approved OST and archive gates. | Agree. Separate package/public inventory from initial requests and resident memory; preserve the approved OST. |
| CR-PERF-07 | Adapt shared timing ownership, semantic events and cancellation. Do not force CSS, audio scheduling and rules into one rAF. | 02/08/10: one authoritative action, cancellable presentations, no orphaned effects. | Agree. Share semantic presentation timing/cancellation later without forcing every subsystem into one rAF. |
| CR-PERF-09 | Adopt meaningful scene quality tiers. Lite currently scarcely affects the scene; quality and reduced motion must be independent. | Near-term / 07 with 02/04: explicit disabled-cost matrix, visible parity, matched-device improvement. | Agree with refinement: deliver a real Lite scene recipe now; keep Full as the visual reference and Motion as a separate concern. |
| CR-PERF-10 | Experiment only if traces justify cached raster terrain. Memory/upload/DPR/invalidation costs remain; Plan 04 already has a renderer gate. | Before 04: compare current stable SVG, simpler SVG and bounded raster; preserve neutral art and dynamic lighting. | Agree. Run a renderer decision experiment before Plan 04 adds cost, only if the bounded first tranche leaves terrain implicated. |
| CR-PERF-11 | Adopt measurement, revise metrics. Less than five renders/second conflicts with legitimate movement; Chromium heap APIs are not iPad gates. | 07: extra commits, frame tails/stalls, input latency, matched fresh/sustained routes, device/power metadata. | Agree. Use commits, action-to-paint, frame tails, long tasks and supported resource trends; physical iPad remains a Human gate. |
| CR-PERF-12 | Strong profiling suspect, not proven GPU diagnosis. CSS occurrence counts are not simultaneous passes; static filters plus transforms need not reraster every frame. | Near-term / 07: separate terrain/filter/follower toggles and 0/2/5 follower cohorts. | Agree as a profiling suspect only. Reject baking directional casts into canonical sprites; retain runtime underlay/filter-tier trials. |
| CR-PERF-12a | Trial removing/gating live joystick backdrop blur; preserve its legible anchor. | Near-term / 07–08: compare drag workload and appearance, not a claim this alone fixes iPad. | Agree. Trial removing/gating live joystick blur while preserving anchor legibility. |

## Effects and animation

| ID | Astra position and rationale | Proposed owner / acceptance gate | Sol position |
| --- | --- | --- | --- |
| CR-JUICE-01 | Adopt selective ambient life, not universal perpetual motion. Proximity may govern decoration, never discovery or collision. | 02/05: bounded simultaneous effects, low-cost/reduced/static variants. | Agree. Selective proximity life later; never make semantic discovery/collision depend on presentation. |
| CR-JUICE-02 | Adopt modest anticipation on isolated presentation transforms; avoid reintroducing the rejected hopping gait. | 05: approved registration and readable first-tap travel. | Agree. Small anticipation may help after performance, without restoring the rejected hopping gait. |
| CR-JUICE-03 | Experiment with brief presentation hitstop only; never lose held intent or stall authoritative input bookkeeping. | 02/08: success continuation/release tests and family comfort. | Agree as a later measured presentation experiment; authoritative input and held intent must never be lost. |
| CR-JUICE-04 | Adopt follower charm after legality fixes. Do not hide trail defects behind animation. | 02/05/PT40: valid trail positions, capped active effects, static parity. | Agree. Fix follower legality first, then add bounded charm under Plans 02/05. |
| CR-JUICE-05 | Adapt significance-based celebration. Routine pickups stay fluent; major rescues/victory deserve emphasis; Human asked for longer door effects. | 02/01: readable arithmetic and immediate available actions without forced waits. | Agree. Victory/rescue significance increases now where requested; richer shared effects remain with 02/05. |
| CR-JUICE-05a | Historical quick-win alias folded into JUICE-05; no separate universal shorter-duration rule. | 02: per-event timing contract and Human preference, not one blanket duration. | Agree. Event-specific timing, not a blanket shorter/longer rule. |
| CR-JUICE-06 | Adopt art-directed semantic particles rather than platform-dependent emoji glyphs where appropriate. | 02: reuse approved motifs, bounded particles/trails and accessibility alternatives. | Agree. Prefer authored/code-native semantic motifs over platform emoji where they aid consistency. |
| CR-JUICE-07 | Defer additional poses/idle frames to approved animation production, not another immediate art overhaul. | 05: model-sheet/landmark registration and playback/decoded-memory budgets. | Agree. Defer new pose/frame production to Plan 05 and preserve approved identities. |

## Audio

| ID | Astra position and rationale | Proposed owner / acceptance gate | Sol position |
| --- | --- | --- | --- |
| CR-AUDIO-01 | Adapt a measured mix/headroom review. Current voice cap/gains do not prove clipping; a compressor is not automatically a limiter. | 02 creative + 07 qualification: listen/measure layered SFX and BGM on actual speakers. | Agree. Measure and listen; current gains do not prove clipping and a compressor is not automatically correct. |
| CR-AUDIO-02 | Trial a coherent timbre palette; do not accept arbitrary oscillator/reverb settings as better sound. | 02: small comparative sound set, comfort and BGM intelligibility. | Agree. Trial a coherent palette under Plan 02 rather than adopt arbitrary synthesis settings. |
| CR-AUDIO-03 | Adopt restrained footsteps/material variation if it improves play; decoration must not affect engine RNG. | 02: repeat/volume fatigue listening, bounded voices and cleanup. | Agree. Footstep variation is optional presentation, bounded and gameplay-RNG independent. |
| CR-AUDIO-03a | Historical variation alias: use controlled cosmetic variation, not random detuning of every semantic cue. | 02: stable recognizable cues, deterministic tests where needed. | Agree. Controlled variation must preserve cue recognition. |
| CR-AUDIO-04 | Experiment with capped pickup-chain musical escalation; avoid an annoying endless pitch climb. | 02: reset window, ceiling, burst overlap and family listening. | Agree. A capped chain can be tested later; avoid endless pitch escalation. |
| CR-AUDIO-05 | Trial subtle contextual ducking without gaps or overriding mute/user levels. | 02/music + 07: smooth restore, overlapping cues and interrupted transitions. | Agree. Contextual ducking is a later measured mix trial that must preserve mute and gapless continuity. |
| CR-AUDIO-06 | Already owned in part: Plans 02 and 07 cover timing/SFX/mix. Clarify creative palette vs device qualification rather than create an ownerless-work claim. | 02 timbre/variation; 07 loudness/performance; update existing MUSIC/effect contracts. | Agree. Existing Plans 02/07 own creative and qualification responsibilities. |

## UI and UX

| ID | Astra position and rationale | Proposed owner / acceptance gate | Sol position |
| --- | --- | --- | --- |
| CR-UI-01 | Adapt numeric bounds as evidence, not a substitute for art direction and Human visual acceptance. | 01 follow-up: measured geometry plus side-by-side approved desktop/iPad screenshots. | Agree. Geometry numbers support rather than replace visual judgment and Human acceptance. |
| CR-UI-02 | Adopt coordinated short-height sizing. Height rules already exist; fixed minima and width-driven pieces are insufficiently coordinated. | 01 follow-up: actual viewport/safe-area matrix, usable hits/text zoom; prototype before global scale rewrite. | Agree. Prioritize coordinated short-height sizing, prototype first, and preserve the successful landscape topology and hit targets. |
| CR-UI-02a | Historical scaling alias: fold into UI-02; no untested numeric minima become authority. | 01: preserve successful primary-device composition. | Agree. Fold into the shared short-height contract; no untested constants become authority. |
| CR-UI-02b | Historical clamp alias: fold into UI-02; distinguish font/art optical size from control hit bounds. | 01: computed bounds and real short-phone review. | Agree. Optical size and accessible hit bounds must be independent. |
| CR-UI-03 | Reject a universal two-action limit. Stay / Next / Restart, later Garden, are explicit Human requirements. | 01: one clear default with discoverable alternatives; no unsafe whole-dialog click-through. | Agree; reject the universal limit. Human-required victory alternatives remain. |
| CR-UI-04 | Adapt tactile hover/press while preserving clear keyboard/assistive focus and forced-colour support. | 01: subtle glow/lift/press, no replacement with colour-only feedback. | Agree. Add warm lift/glow/press while retaining distinct keyboard and forced-colour focus. |
| CR-UI-05 | Adopt existing anchored board-joystick requirement; fixed ThumbPad is distinct and already much improved. | 08: origin-relative drag, player-relative tap, steering/cancel lifecycle. | Agree. Preserve the improved pad and correct anchored-board semantics. |
| CR-UI-06 | Preserve stable HUD/transient regions. Empty reserved feedback space is not inherently a defect requiring filler. | 01/02: zero message-induced layout jump; larger iPad message optics where requested. | Agree. Stable quiet space is valuable; do not add filler merely because it is empty. |
| CR-UI-07 | Preserve existing high-resolution presentation renditions; use appropriate derivatives, not always-largest textures. | 01/07: crisp real delivery sizes and bounded decoded cost. | Agree. Use consumer-appropriate derivatives and keep enlarged presentation art only where justified. |
| CR-UI-08 | Defer broad diegetic-kit redesign. Human now likes the UI; small targeted treatments may help without reopening it. | 01/11: show a focused visual comparison before materially replacing the successful kit. | Reject for the current programme rather than merely defer. Reopen a broad HUD redesign only with new Human/child evidence. |
| CR-UI-09 | Defer decorative minimap redesign; current minimap is explicitly liked. Preserve schematic clarity and required guidance. | 01/04: any later theme must retain accessible symbols/legibility and useful map area. | Reject for the current programme rather than merely defer. Preserve the Human-liked schematic minimap. |
| CR-UI-10 | Preserve Power emphasis; do not hide keepsake counters simply because the future economy is absent. | 01: retain current clear hierarchy and Human-requested totals. | Agree. Keep Power and wanted keepsake totals visible. |
| CR-UI-11 | Adapt picture-first actionable objectives, with text support; avoid spoilers and unexplored-object disclosures. | 01/13: child can identify next action; accessibility and hint-tier consistency. | Agree with spoiler constraints. Picture-first goals need text/nonvisual support and hint consistency. |
| CR-UI-12 | Adopt brief comprehension playtests, not a rigid one-second pass/fail metric. | Human sessions / 09: record child understanding, intervention and enjoyment. | Agree. Use short observational comprehension sessions, not a rigid one-second metric. |
| CR-UI-13 | Adopt a small consistent motion vocabulary, not motion everywhere. | 02/05: meanings, cancellation, reduced/static alternatives and simultaneous-effect budgets. | Agree. Small meaningful motion vocabulary, bounded and cancellable. |
| CR-UI-14 | Adapt TV scale testing; pixels/resolution alone do not establish couch readability. | 01/08: actual distance/controller review remains pending, preserve tablet/desktop. | Agree. TV readability requires distance/controller evidence, not resolution inference. |
| CR-UI-15 | Defer extra first/return greetings to polish/opportunity review; do not add compulsory interruptions. | 13/14: brief optional warmth, no new blocking flow. | Agree to named later opportunity only; no compulsory greeting interruption. |
| CR-UI-16 | Historical deck-width proposal superseded by current v4 height-aware problem. Width expansion helped desktop; blindly shrinking it is not the phone fix. | 01: retain primary-device balance; jointly solve available height and deck geometry. | Agree. Solve coordinated height/minima; do not blindly undo the deck width that improved desktop. |
| CR-UI-17 | Adopt scoped prevention of gameplay text/image selection and iOS callouts; preserve real editable fields and deliberate content scrolling. | Near-term / 01–08: physical touch/mouse selection checks plus keyboard/accessibility. | Agree; include scoped selection/drag/callout prevention in the first correction. |

## Art and lighting

| ID | Astra position and rationale | Proposed owner / acceptance gate | Sol position |
| --- | --- | --- | --- |
| CR-ART-01 | Adopt existing wall-depth goal through Plan 04; not a new unbounded renderer mandate. | 04 after performance/PT36 gates: representative themes and wall top/side readability. | Agree. Plan 04 owns the existing bounded depth goal after the correction gates. |
| CR-ART-02 | Experiment on raster softness; integer placement/promotion and larger sources each have tradeoffs. | 04/07: inspect real DPR, moving camera, art scale and encoded/decoded costs. | Agree. Raster softness needs actual-DPR evidence and cost comparison. |
| CR-ART-03 | Adopt cohesive poison/terrain material treatment without animating expensive whole-maze filters. | 02/04: periodicity, hazard identity, contrast and quality-tier cost. | Agree. Improve material identity without whole-maze expensive animation. |
| CR-ART-04 | Preserve subtle motif/material hierarchy; functional keys, doors and flower portals must remain distinct. | Art Bible / 04/11: readability before decorative literal repetition. | Agree. Preserve functional distinction and subordinate motif repetition. |
| CR-ART-05 | Adopt broad value/temperature lighting principles, preserving neutral-light canonical cutouts and character identity. | 04: restrained warm/cool depth, hazard readability, multiple light directions. | Agree. Runtime lighting can add restrained value/temperature depth while canonical cutouts remain neutral. |
| CR-ART-06 | Experiment with theme grading/vignettes; no blanket costly filter or darkening of puzzle information. | 04: measured composition/performance comparison and contrast. | Agree as an experiment only; never darken puzzle information or assume a cheap global filter. |
| CR-ART-07 | Defer optional depth falloff until core grounding works; distant objects must not become unreadable. | 04: fog/visibility and information parity across quality settings. | Agree. Core grounding and readability precede optional depth falloff. |
| CR-ART-08 | Adapt effect priority and spatial budgets, not an absolute ban on concurrent legitimate rewards. | 02: important cues remain readable during combined rescue/combat/pickup moments. | Agree. Use priority/spatial budgets rather than banning legitimate combined rewards. |

## Game design and content

| ID | Astra position and rationale | Proposed owner / acceptance gate | Sol position |
| --- | --- | --- | --- |
| CR-DESIGN-01 | Reject 'no interesting choice without spending a resource' as an absolute. Retain a bounded mechanics comparison; consumable keys/Power contradict current rules. | 09/PT44: compare existing-rule puzzles and new candidates; Human/solver/recoverability gate. | Agree. Reject the claimed spending prerequisite; keep PT44's bounded, solver-safe mechanics comparison. |
| CR-DESIGN-02 | Correct tree-only premise: current widened rooms create cycles. Explore meaningful corridor alternatives, not a universal braiding quota. | 09/13: topology/route metrics, purposeful loops, no prerequisite bypass or forced complexity. | Agree. The tree-only premise is false; measure meaningful alternate routes and author purposeful loops. |
| CR-DESIGN-03 | Defer economy expansion; Gold/Science are deliberately keepsakes, Science-to-Egg belongs to Garden. Do not hide wanted totals. | 10 / 14: persistence, cadence and Human price/feature gates before implementation. | Agree. Keep economy/progression with Plans 10/14 and retain visible totals. |
| CR-DESIGN-04 | Adopt readable true combat arithmetic and actionable growth advice; equality already wins. | 02/09: addition and max(0, enemyPower - AmePower), no misleading extra point. | Agree with clarification: combat addition is already present; remaining work is explicit deficit/action wording and terminal receipt. |
| CR-DESIGN-04a | Historical arithmetic quick-win alias folded into DESIGN-04, not a new numerical rule. | 02: correct labels and child-readable presentation. | Agree. Fold into DESIGN-04; equality wins and no extra point is invented. |
| CR-DESIGN-05 | Adopt existing campaign variety/rare-large-maze intent; size alone is not difficulty. | 09/13: authored rhythm, rooms, decision quality and family endurance evidence. | Agree. Preserve the campaign rhythm/rare-large-maze contract; size is not difficulty. |
| CR-DESIGN-06 | Adapt event-gap review; avoid mechanical eight-tile filler quotas and preserve useful quiet observation. | 09/13: route-quality reports plus child playtest, not pickup density alone. | Agree. Review event gaps without mechanical filler quotas. |
| CR-DESIGN-07 | Adopt optional battle/reward rooms within solver-safe routing; no compulsory rescue or loot RNG dependency. | 09/13: variety, optionality, reward value and recovery. | Agree. Optional battle/reward rooms remain solver-safe and non-mandatory. |
| CR-CONTENT-01 | Adapt picture-first hints/simple blocker copy; preserve story warmth and the Human's planned short VN/cast review. | 01 presentation; 09/PT30 narrative/cast; 13 residual polish: actionable child comprehension, optional reading and skip. | Agree. Picture-first brevity plus optional warm VN sequences under existing narrative ownership. |
| CR-CONTENT-02 | Adopt inspirations as principles for wonder/comedy, never asset imitation or a checklist of borrowed mechanics. | 09/10/13: original coherent world and playful level situations. | Agree. Translate inspirations into original principles, not copied mechanics or presentation. |
| CR-CONTENT-03 | Adopt companion celebration/personality without compulsory chatter or unbounded always-on effects. | 02/05/10: readable rescues, joyful Garden and limited optional flavour. | Agree. Add bounded companion personality without compulsory chatter or perpetual cost. |

## Architecture, sequence and reported bugs

| ID | Astra position and rationale | Proposed owner / acceptance gate | Sol position |
| --- | --- | --- | --- |
| CR-RISK-01 | Adapt extraction around the next required seam. Reject an arbitrary App line-count target or five-way simultaneous hub rewrite. | Execution owner: bounded change with regression evidence and explicit file ownership. | Agree. Extract only around the next proven seam; no arbitrary line-count rewrite. |
| CR-RISK-02 | Adopt the FOV dependency warning; no automatic adaptive-default change. | 08/09/07: visibility, authored onboarding, save/solver and performance review. | Agree. FOV is a separate dependency-bearing future choice. |
| CR-RISK-03 | Adopt existing solver/recovery gates; atomic ice movement alone does not prove trivial state-space impact. | 09/13/10: landing/chains/boundaries, reachable exits, no increased search limits to hide regressions. | Agree. New traversal rules need exact solver/recovery coverage. |
| CR-RISK-04 | Adapt input/presentation seams for co-op. Plan 10 specifies building its missing clock; React use is not proof of incompatibility. | 08 then 10 greybox: deterministic Duo rules, Solo compatibility, semantic publication. | Agree. Plan 10 builds its deterministic Duo foundation; React alone does not make that impossible. |
| CR-RISK-05 | Adopt a concise living entry point plus durable decisions/history. Do not replace required specifications with a lossy summary. | Joint orchestration: current state, linked evidence, clear active owner/next action. | Agree. Keep a concise live entry point plus durable evidence/history. |
| CR-RISK-06 | Adopt an explicit terrain-render decision before adding cost. Current Plan 04 already prefers cached per-edge SVG with a measured fallback. | 04/07: evidence-backed option/rollback, not mandatory canvas. | Agree. Decide terrain representation before adding Plan-04 cost, using evidence rather than mandatory canvas. |
| CR-RISK-07 | Already specified, not implemented: Plan 10 has Surprise completion journaling and prepared/apply/acknowledge persistence tests. | 10: preserve and qualify minimal non-resumable completion banking. | Agree. Already specified; implementation and qualification remain Plan 10 work. |
| CR-RISK-08 | Adopt canonical semantic intent with device adapters; avoid making every input path identical in implementation. | Near-term / 08/10: continuation matrix, two seats, last-direction ordering and cancellation. | Agree. Share semantic intent while allowing device-appropriate adapters. |
| CR-RISK-09 | Adopt bringing a bounded performance/input slice forward. Reject making all speculative rewrites prerequisites for another playable build. | Joint next tranche: measured small correction before 04; preserve rest of programme. | Agree. Bring forward the bounded performance/input correction, not every speculative rewrite. |
| CR-RISK-10 | Already one runtime writer; reinforce path ownership and serial heavy verification on this host. | Joint orchestration: reviewer read-only, checkpoint before ownership transfer. | Agree. One runtime writer and serial heavy verification remain mandatory. |
| CR-BUG-01 | Confirmed explicit old policy: strong-enemy modal only on first bump; capability modal escalates to third. New Human intent supersedes both. | Near-term / 08: one explanation per fresh deliberate failed attempt, no continuous-held modal flood. | Agree. Human intent supersedes old policy: explain every fresh deliberate failure, never a continuous-held flood. |
| CR-BUG-02 | Correct diagnosis: normal final clear already calls makeSurprise; modulo wrap is tester-only. Human's reported surprise still deserves reproduction. | Near-term: test normal/replay/tester finale, label/action truth, save isolation; decide tester wrap explicitly. | Agree with Astra's correction. Reproduce normal/replay/tester paths; do not patch the already-correct normal branch speculatively. |
| CR-BUG-03 | Adapt toast scale; Human likes mobile prominence and wants larger desktop feedback. 1.5 tiles is not approved and can obscure FOV6. | 01/02: bounded art/text optics across actual screenshots, preserved arithmetic and gameplay visibility. | Agree. Use the liked phone prominence as the target direction for desktop, with viewport-safe optical bounds rather than a fixed 1.5-tile law. |

## Cross-cutting response proposals without additional CR IDs

- **Preserve the successful v0.22.0 UI.** Human feedback, not a new global aesthetic theory, is the regression reference.
- **Bestiary only:** discovered entries in canonical ID order, one friendly empty state and a counter. Do not automatically hide undiscovered Friends; the Human likes that collection.
- **Victory:** larger companion hero treatment, longer bounded/replenished celebration under full motion, immediately available actions, reduced/static parity. Not a five-band receipt or mandatory unskippable reveal.
- **Performance cause:** GPU/fill-rate, CPU reconciliation, retained resources, decoding and thermal/session effects require isolation; no confirmed single diagnosis or promise of free shadow baking.
- **Roadmap:** support a small correction before 04. Reject moving Plan 10 after release candidate as suggested in Opus §11 Phase D: preserve Human programme 09 → 10 → 11 → 13 → 12 → RC → 14 → 15 and the existing Garden/branding/retirement dependencies.
- **Mechanics:** retain the existing Plan 09/PT44 comparison. Do not silently make consumable keys, Power spending, persistent XP or adaptive FOV the price of fixing present defects.
- **Human acceptance:** supplied positive feedback is substantial, but iPad near-unplayable sustained behaviour means FP-UI1 is not fully accepted. No new release, runtime test pass, hardware qualification or Agent 04 start is claimed here.

## Joint decision

The two independent reviews agree on the core product diagnosis and execution
order. This is **joint routing authority**, not a claim that any runtime fix has
landed:

1. Preserve v0.22.0's praised desktop/iPad visual system and current square FOV6
   gameplay contract.
2. Run [V22-PERF-01](../plans/V22-PERF-01-sustained-play-and-live-input.md)
   first: Astra writes; Sol reviews read-only. It measures fresh/sustained input,
   followers, scene work and synchronous persistence; removes only evidenced
   hot-path waste; makes Lite truthful; fixes held-success continuation, fresh
   blocker explanations and selection safety; and characterizes finale routes.
3. After technical review and affected-iPad evidence, Sol writes the bounded
   [V22-UI-01](../plans/V22-UI-01-short-height-and-reward.md)
   short-height/Book/pad/pickup/victory tranche; Astra reviews input and
   performance safety. Victory's no-scroll hero/reward treatment is required,
   not optional polish.
4. If the first tranche does not materially improve sustained play, isolate
   terrain/filter/follower/retained-resource cohorts in a second technical slice
   before changing layout or beginning Plan 04.
5. Claude is not needed again until measured evidence creates a consequential
   question. Reject its current-program 9–15 FOV, broad HUD/minimap redesign,
   baked canonical cast shadows, early economy and reordered co-op proposal.

The Human retains final product/device/family acceptance. Agent 04 remains held.
