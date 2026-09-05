# Sol–Astra disposition ledger — Opus v4 and v0.22.0 response

Date: 2026-09-05. **Astra first assessment complete; Sol and joint dispositions pending.**
Inspected documentation HEAD: `5f7f8c957f1b42095d96248eae3eb77d038768a9`; unchanged runtime: `68e303da680d5aec0ba71154949c5a2a0d1697ae`.

Sources: [Opus v4](external/2026-09-05-claude-opus5-maze-so-puzzle-review-v4.md), [focused response](external/2026-09-05-claude-opus5-v0220-feedback-response.md), [exact provenance](external/2026-09-05-v0220-review-pack-provenance.json), [Human raw feedback](../user-playtests/v0220-playtest-feedback.md), and [Astra's evidence/intake/next-step assessment](2026-09-05-astra-v0220-review.md).

The Human explicitly assigned **Astra the first turn**, superseding the prior Sol-first handoff. Three delegated read-only reviewers assisted Astra; none supplies Sol's independent position. All proposals below are Astra's assessment, not joint approval or runtime implementation authority. The Human's explicit requirements remain authoritative even where Claude's explanation is mistaken.

## Coverage and decision rules

- **88 unique rows:** all 80 historical rows plus BUG-01/02/03, FEEL-07, PERF-05b/12/12a and UI-17.
- Historical quick-win aliases DESIGN-04a, JUICE-05a, UI-02a/02b remain traceable although no longer explicitly headed in v4. UI-16 now occurs only in the abbreviated index. There is no PERF-08 finding; mentions of its absence are not a row.
- The [v3 skeleton](2026-09-05-sol-astra-opus5-disposition.md) and immutable v3 source remain historical. Its uncommitted/fef baseline warning does not describe v4, which names 5f7f8c9.
- Astra read both complete current reports, the raw Human feedback plus its attributed summary, and all 51 supplied images. The reports' stated 53-image inventory is not the supplied folder's count.
- Sol should independently consider the complete sources and current evidence, then fill the last column with agreement, modification or disagreement and reasons. Do not rubber-stamp this table.
- Final joint outcomes must distinguish adoption, modified adoption, already addressed in code versus only planned, experiment, named deferral, and rejection. Disagreement needs an evidence/test/decision path, not manufactured consensus.
- Routing is a proposal for existing ownership, not authorization to implement every row now. Specific execution briefs/spec changes follow reconciliation; avoid duplicating the complete specialist plans here.
- Source assertions labelled verified by Opus are still source assertions. Code can establish a mechanism, not physical-device performance or family delight.

## Movement and camera

| ID | Astra position and rationale | Proposed owner / acceptance gate | Sol position |
| --- | --- | --- | --- |
| CR-FEEL-01 | Experiment, not a new default. Adaptive 9–15-tile FOV changes information reveal and readable sprite scale; Human likes the current primary-device composition. | 08/PT32: retain approved optional 4/5/6/7, default 6; compare alternatives with Human before changing. | Pending |
| CR-FEEL-01b | Experiment separately. Rectangular visibility is not required to fix short-height UI; it changes fog, camera and map composition. | 08 + 07: review rectangular comparison, visibility rules and actual painted workload. | Pending |
| CR-FEEL-02 | Defer camera comparison until contention is measured. Exponential follow is first-order smoothing, not the claimed second-order critically damped spring. | 08: same-route A/B, first taps/corners/reversals; no mandatory dead zone. | Pending |
| CR-FEEL-03 | Adapt: coordinate intent, repeat cadence and presentation. An rAF accumulator is not automatically Plan 10's deterministic rules clock. | 08/10: one-move authority, no catch-up after stalls, ordering/cancellation tests. | Pending |
| CR-FEEL-04 | Experiment, not automatic speed-up. A 120 ms cadence may harm precision or comfort. | 08: child/device comparison after performance fixes; preserve gentle acceleration and deliberate taps. | Pending |
| CR-FEEL-05 | Experiment on PT33 seams. Pixel snapping can trade seam shimmer for quantized travel; baking does not guarantee elimination. | 04/07: inspect fractional positions at actual DPRs, camera movement and contrasting themes. | Pending |
| CR-FEEL-06 | Measure before changing the shared timestamp policy; preserve the verified first-step correction. | 08: timestamp/retarget trace plus first-tap and rapid-reversal video evidence. | Pending |
| CR-FEEL-07 | Adopt with lifecycle constraints: suspend repeat, retain eligible live held intent through successful interactions, never queue catch-up. | Near-term input correction / 08: release, steering, cancel, blur, modal and scene-switch tests. | Pending |

## Performance

| ID | Astra position and rationale | Proposed owner / acceptance gate | Sol position |
| --- | --- | --- | --- |
| CR-PERF-01 | Already addressed in current code: terrain/world-window stabilization landed. Do not repeat the historical fix. | 07: preserve memoization; instrument actual invalidations if it regresses. | Pending |
| CR-PERF-02 | Adopt bounded derivation stabilization. MiniMap receives a freshly filtered objects array; legitimate movement still changes visibility/cursor. | Near-term / 07: no cursor-only minimap rebuild; preserve complete reveal and semantic markers. | Pending |
| CR-PERF-03 | Adopt for board-touch cursor state. ThumbPad already handles cursor coordinates locally and parent steering on direction changes. | Near-term / 07–08: no extra whole-App commits solely from same-direction cursor motion; test both input surfaces. | Pending |
| CR-PERF-04 | Adopt scoped scene binding invalidation; useSceneTravel queries on every commit. A dependency list alone must not miss new followers/overlays. | Near-term / 07: bind on node-set change, retarget separately; rescue/transition/resize tests. | Pending |
| CR-PERF-05 | Experiment with containment only where safe. Paint containment can clip glows and change stacking; compositor promotion is not guaranteed. | 07/04: compare paint/layer traces and visual bounds before retaining. | Pending |
| CR-PERF-05a | Experiment, not free optimization. will-change can consume memory; lack of the property does not prove lack of promotion. | 07: target measured layer bottlenecks, remove hints that do not help. | Pending |
| CR-PERF-05b | Same caution for strict containment: layout, sizing and off-edge art may change. | 07/01: validate intrinsic size, layering, overlays and memory. | Pending |
| CR-PERF-06 | Adapt delivery audit; full public bytes are not startup network or resident memory. Existing tracks are Human-authored, not assumed duplicates. | 07/12: classify actual requests/retention; preserve approved OST and archive gates. | Pending |
| CR-PERF-07 | Adapt shared timing ownership, semantic events and cancellation. Do not force CSS, audio scheduling and rules into one rAF. | 02/08/10: one authoritative action, cancellable presentations, no orphaned effects. | Pending |
| CR-PERF-09 | Adopt meaningful scene quality tiers. Lite currently scarcely affects the scene; quality and reduced motion must be independent. | Near-term / 07 with 02/04: explicit disabled-cost matrix, visible parity, matched-device improvement. | Pending |
| CR-PERF-10 | Experiment only if traces justify cached raster terrain. Memory/upload/DPR/invalidation costs remain; Plan 04 already has a renderer gate. | Before 04: compare current stable SVG, simpler SVG and bounded raster; preserve neutral art and dynamic lighting. | Pending |
| CR-PERF-11 | Adopt measurement, revise metrics. Less than five renders/second conflicts with legitimate movement; Chromium heap APIs are not iPad gates. | 07: extra commits, frame tails/stalls, input latency, matched fresh/sustained routes, device/power metadata. | Pending |
| CR-PERF-12 | Strong profiling suspect, not proven GPU diagnosis. CSS occurrence counts are not simultaneous passes; static filters plus transforms need not reraster every frame. | Near-term / 07: separate terrain/filter/follower toggles and 0/2/5 follower cohorts. | Pending |
| CR-PERF-12a | Trial removing/gating live joystick backdrop blur; preserve its legible anchor. | Near-term / 07–08: compare drag workload and appearance, not a claim this alone fixes iPad. | Pending |

## Effects and animation

| ID | Astra position and rationale | Proposed owner / acceptance gate | Sol position |
| --- | --- | --- | --- |
| CR-JUICE-01 | Adopt selective ambient life, not universal perpetual motion. Proximity may govern decoration, never discovery or collision. | 02/05: bounded simultaneous effects, low-cost/reduced/static variants. | Pending |
| CR-JUICE-02 | Adopt modest anticipation on isolated presentation transforms; avoid reintroducing the rejected hopping gait. | 05: approved registration and readable first-tap travel. | Pending |
| CR-JUICE-03 | Experiment with brief presentation hitstop only; never lose held intent or stall authoritative input bookkeeping. | 02/08: success continuation/release tests and family comfort. | Pending |
| CR-JUICE-04 | Adopt follower charm after legality fixes. Do not hide trail defects behind animation. | 02/05/PT40: valid trail positions, capped active effects, static parity. | Pending |
| CR-JUICE-05 | Adapt significance-based celebration. Routine pickups stay fluent; major rescues/victory deserve emphasis; Human asked for longer door effects. | 02/01: readable arithmetic and immediate available actions without forced waits. | Pending |
| CR-JUICE-05a | Historical quick-win alias folded into JUICE-05; no separate universal shorter-duration rule. | 02: per-event timing contract and Human preference, not one blanket duration. | Pending |
| CR-JUICE-06 | Adopt art-directed semantic particles rather than platform-dependent emoji glyphs where appropriate. | 02: reuse approved motifs, bounded particles/trails and accessibility alternatives. | Pending |
| CR-JUICE-07 | Defer additional poses/idle frames to approved animation production, not another immediate art overhaul. | 05: model-sheet/landmark registration and playback/decoded-memory budgets. | Pending |

## Audio

| ID | Astra position and rationale | Proposed owner / acceptance gate | Sol position |
| --- | --- | --- | --- |
| CR-AUDIO-01 | Adapt a measured mix/headroom review. Current voice cap/gains do not prove clipping; a compressor is not automatically a limiter. | 02 creative + 07 qualification: listen/measure layered SFX and BGM on actual speakers. | Pending |
| CR-AUDIO-02 | Trial a coherent timbre palette; do not accept arbitrary oscillator/reverb settings as better sound. | 02: small comparative sound set, comfort and BGM intelligibility. | Pending |
| CR-AUDIO-03 | Adopt restrained footsteps/material variation if it improves play; decoration must not affect engine RNG. | 02: repeat/volume fatigue listening, bounded voices and cleanup. | Pending |
| CR-AUDIO-03a | Historical variation alias: use controlled cosmetic variation, not random detuning of every semantic cue. | 02: stable recognizable cues, deterministic tests where needed. | Pending |
| CR-AUDIO-04 | Experiment with capped pickup-chain musical escalation; avoid an annoying endless pitch climb. | 02: reset window, ceiling, burst overlap and family listening. | Pending |
| CR-AUDIO-05 | Trial subtle contextual ducking without gaps or overriding mute/user levels. | 02/music + 07: smooth restore, overlapping cues and interrupted transitions. | Pending |
| CR-AUDIO-06 | Already owned in part: Plans 02 and 07 cover timing/SFX/mix. Clarify creative palette vs device qualification rather than create an ownerless-work claim. | 02 timbre/variation; 07 loudness/performance; update existing MUSIC/effect contracts. | Pending |

## UI and UX

| ID | Astra position and rationale | Proposed owner / acceptance gate | Sol position |
| --- | --- | --- | --- |
| CR-UI-01 | Adapt numeric bounds as evidence, not a substitute for art direction and Human visual acceptance. | 01 follow-up: measured geometry plus side-by-side approved desktop/iPad screenshots. | Pending |
| CR-UI-02 | Adopt coordinated short-height sizing. Height rules already exist; fixed minima and width-driven pieces are insufficiently coordinated. | 01 follow-up: actual viewport/safe-area matrix, usable hits/text zoom; prototype before global scale rewrite. | Pending |
| CR-UI-02a | Historical scaling alias: fold into UI-02; no untested numeric minima become authority. | 01: preserve successful primary-device composition. | Pending |
| CR-UI-02b | Historical clamp alias: fold into UI-02; distinguish font/art optical size from control hit bounds. | 01: computed bounds and real short-phone review. | Pending |
| CR-UI-03 | Reject a universal two-action limit. Stay / Next / Restart, later Garden, are explicit Human requirements. | 01: one clear default with discoverable alternatives; no unsafe whole-dialog click-through. | Pending |
| CR-UI-04 | Adapt tactile hover/press while preserving clear keyboard/assistive focus and forced-colour support. | 01: subtle glow/lift/press, no replacement with colour-only feedback. | Pending |
| CR-UI-05 | Adopt existing anchored board-joystick requirement; fixed ThumbPad is distinct and already much improved. | 08: origin-relative drag, player-relative tap, steering/cancel lifecycle. | Pending |
| CR-UI-06 | Preserve stable HUD/transient regions. Empty reserved feedback space is not inherently a defect requiring filler. | 01/02: zero message-induced layout jump; larger iPad message optics where requested. | Pending |
| CR-UI-07 | Preserve existing high-resolution presentation renditions; use appropriate derivatives, not always-largest textures. | 01/07: crisp real delivery sizes and bounded decoded cost. | Pending |
| CR-UI-08 | Defer broad diegetic-kit redesign. Human now likes the UI; small targeted treatments may help without reopening it. | 01/11: show a focused visual comparison before materially replacing the successful kit. | Pending |
| CR-UI-09 | Defer decorative minimap redesign; current minimap is explicitly liked. Preserve schematic clarity and required guidance. | 01/04: any later theme must retain accessible symbols/legibility and useful map area. | Pending |
| CR-UI-10 | Preserve Power emphasis; do not hide keepsake counters simply because the future economy is absent. | 01: retain current clear hierarchy and Human-requested totals. | Pending |
| CR-UI-11 | Adapt picture-first actionable objectives, with text support; avoid spoilers and unexplored-object disclosures. | 01/13: child can identify next action; accessibility and hint-tier consistency. | Pending |
| CR-UI-12 | Adopt brief comprehension playtests, not a rigid one-second pass/fail metric. | Human sessions / 09: record child understanding, intervention and enjoyment. | Pending |
| CR-UI-13 | Adopt a small consistent motion vocabulary, not motion everywhere. | 02/05: meanings, cancellation, reduced/static alternatives and simultaneous-effect budgets. | Pending |
| CR-UI-14 | Adapt TV scale testing; pixels/resolution alone do not establish couch readability. | 01/08: actual distance/controller review remains pending, preserve tablet/desktop. | Pending |
| CR-UI-15 | Defer extra first/return greetings to polish/opportunity review; do not add compulsory interruptions. | 13/14: brief optional warmth, no new blocking flow. | Pending |
| CR-UI-16 | Historical deck-width proposal superseded by current v4 height-aware problem. Width expansion helped desktop; blindly shrinking it is not the phone fix. | 01: retain primary-device balance; jointly solve available height and deck geometry. | Pending |
| CR-UI-17 | Adopt scoped prevention of gameplay text/image selection and iOS callouts; preserve real editable fields and deliberate content scrolling. | Near-term / 01–08: physical touch/mouse selection checks plus keyboard/accessibility. | Pending |

## Art and lighting

| ID | Astra position and rationale | Proposed owner / acceptance gate | Sol position |
| --- | --- | --- | --- |
| CR-ART-01 | Adopt existing wall-depth goal through Plan 04; not a new unbounded renderer mandate. | 04 after performance/PT36 gates: representative themes and wall top/side readability. | Pending |
| CR-ART-02 | Experiment on raster softness; integer placement/promotion and larger sources each have tradeoffs. | 04/07: inspect real DPR, moving camera, art scale and encoded/decoded costs. | Pending |
| CR-ART-03 | Adopt cohesive poison/terrain material treatment without animating expensive whole-maze filters. | 02/04: periodicity, hazard identity, contrast and quality-tier cost. | Pending |
| CR-ART-04 | Preserve subtle motif/material hierarchy; functional keys, doors and flower portals must remain distinct. | Art Bible / 04/11: readability before decorative literal repetition. | Pending |
| CR-ART-05 | Adopt broad value/temperature lighting principles, preserving neutral-light canonical cutouts and character identity. | 04: restrained warm/cool depth, hazard readability, multiple light directions. | Pending |
| CR-ART-06 | Experiment with theme grading/vignettes; no blanket costly filter or darkening of puzzle information. | 04: measured composition/performance comparison and contrast. | Pending |
| CR-ART-07 | Defer optional depth falloff until core grounding works; distant objects must not become unreadable. | 04: fog/visibility and information parity across quality settings. | Pending |
| CR-ART-08 | Adapt effect priority and spatial budgets, not an absolute ban on concurrent legitimate rewards. | 02: important cues remain readable during combined rescue/combat/pickup moments. | Pending |

## Game design and content

| ID | Astra position and rationale | Proposed owner / acceptance gate | Sol position |
| --- | --- | --- | --- |
| CR-DESIGN-01 | Reject 'no interesting choice without spending a resource' as an absolute. Retain a bounded mechanics comparison; consumable keys/Power contradict current rules. | 09/PT44: compare existing-rule puzzles and new candidates; Human/solver/recoverability gate. | Pending |
| CR-DESIGN-02 | Correct tree-only premise: current widened rooms create cycles. Explore meaningful corridor alternatives, not a universal braiding quota. | 09/13: topology/route metrics, purposeful loops, no prerequisite bypass or forced complexity. | Pending |
| CR-DESIGN-03 | Defer economy expansion; Gold/Science are deliberately keepsakes, Science-to-Egg belongs to Garden. Do not hide wanted totals. | 10 / 14: persistence, cadence and Human price/feature gates before implementation. | Pending |
| CR-DESIGN-04 | Adopt readable true combat arithmetic and actionable growth advice; equality already wins. | 02/09: addition and max(0, enemyPower - AmePower), no misleading extra point. | Pending |
| CR-DESIGN-04a | Historical arithmetic quick-win alias folded into DESIGN-04, not a new numerical rule. | 02: correct labels and child-readable presentation. | Pending |
| CR-DESIGN-05 | Adopt existing campaign variety/rare-large-maze intent; size alone is not difficulty. | 09/13: authored rhythm, rooms, decision quality and family endurance evidence. | Pending |
| CR-DESIGN-06 | Adapt event-gap review; avoid mechanical eight-tile filler quotas and preserve useful quiet observation. | 09/13: route-quality reports plus child playtest, not pickup density alone. | Pending |
| CR-DESIGN-07 | Adopt optional battle/reward rooms within solver-safe routing; no compulsory rescue or loot RNG dependency. | 09/13: variety, optionality, reward value and recovery. | Pending |
| CR-CONTENT-01 | Adapt picture-first hints/simple blocker copy; preserve story warmth and the Human's planned short VN/cast review. | 01 presentation; 09/PT30 narrative/cast; 13 residual polish: actionable child comprehension, optional reading and skip. | Pending |
| CR-CONTENT-02 | Adopt inspirations as principles for wonder/comedy, never asset imitation or a checklist of borrowed mechanics. | 09/10/13: original coherent world and playful level situations. | Pending |
| CR-CONTENT-03 | Adopt companion celebration/personality without compulsory chatter or unbounded always-on effects. | 02/05/10: readable rescues, joyful Garden and limited optional flavour. | Pending |

## Architecture, sequence and reported bugs

| ID | Astra position and rationale | Proposed owner / acceptance gate | Sol position |
| --- | --- | --- | --- |
| CR-RISK-01 | Adapt extraction around the next required seam. Reject an arbitrary App line-count target or five-way simultaneous hub rewrite. | Execution owner: bounded change with regression evidence and explicit file ownership. | Pending |
| CR-RISK-02 | Adopt the FOV dependency warning; no automatic adaptive-default change. | 08/09/07: visibility, authored onboarding, save/solver and performance review. | Pending |
| CR-RISK-03 | Adopt existing solver/recovery gates; atomic ice movement alone does not prove trivial state-space impact. | 09/13/10: landing/chains/boundaries, reachable exits, no increased search limits to hide regressions. | Pending |
| CR-RISK-04 | Adapt input/presentation seams for co-op. Plan 10 specifies building its missing clock; React use is not proof of incompatibility. | 08 then 10 greybox: deterministic Duo rules, Solo compatibility, semantic publication. | Pending |
| CR-RISK-05 | Adopt a concise living entry point plus durable decisions/history. Do not replace required specifications with a lossy summary. | Joint orchestration: current state, linked evidence, clear active owner/next action. | Pending |
| CR-RISK-06 | Adopt an explicit terrain-render decision before adding cost. Current Plan 04 already prefers cached per-edge SVG with a measured fallback. | 04/07: evidence-backed option/rollback, not mandatory canvas. | Pending |
| CR-RISK-07 | Already specified, not implemented: Plan 10 has Surprise completion journaling and prepared/apply/acknowledge persistence tests. | 10: preserve and qualify minimal non-resumable completion banking. | Pending |
| CR-RISK-08 | Adopt canonical semantic intent with device adapters; avoid making every input path identical in implementation. | Near-term / 08/10: continuation matrix, two seats, last-direction ordering and cancellation. | Pending |
| CR-RISK-09 | Adopt bringing a bounded performance/input slice forward. Reject making all speculative rewrites prerequisites for another playable build. | Joint next tranche: measured small correction before 04; preserve rest of programme. | Pending |
| CR-RISK-10 | Already one runtime writer; reinforce path ownership and serial heavy verification on this host. | Joint orchestration: reviewer read-only, checkpoint before ownership transfer. | Pending |
| CR-BUG-01 | Confirmed explicit old policy: strong-enemy modal only on first bump; capability modal escalates to third. New Human intent supersedes both. | Near-term / 08: one explanation per fresh deliberate failed attempt, no continuous-held modal flood. | Pending |
| CR-BUG-02 | Correct diagnosis: normal final clear already calls makeSurprise; modulo wrap is tester-only. Human's reported surprise still deserves reproduction. | Near-term: test normal/replay/tester finale, label/action truth, save isolation; decide tester wrap explicitly. | Pending |
| CR-BUG-03 | Adapt toast scale; Human likes mobile prominence and wants larger desktop feedback. 1.5 tiles is not approved and can obscure FOV6. | 01/02: bounded art/text optics across actual screenshots, preserved arithmetic and gameplay visibility. | Pending |

## Cross-cutting response proposals without additional CR IDs

- **Preserve the successful v0.22.0 UI.** Human feedback, not a new global aesthetic theory, is the regression reference.
- **Bestiary only:** discovered entries in canonical ID order, one friendly empty state and a counter. Do not automatically hide undiscovered Friends; the Human likes that collection.
- **Victory:** larger companion hero treatment, longer bounded/replenished celebration under full motion, immediately available actions, reduced/static parity. Not a five-band receipt or mandatory unskippable reveal.
- **Performance cause:** GPU/fill-rate, CPU reconciliation, retained resources, decoding and thermal/session effects require isolation; no confirmed single diagnosis or promise of free shadow baking.
- **Roadmap:** support a small correction before 04. Reject moving Plan 10 after release candidate as suggested in Opus §11 Phase D: preserve Human programme 09 → 10 → 11 → 13 → 12 → RC → 14 → 15 and the existing Garden/branding/retirement dependencies.
- **Mechanics:** retain the existing Plan 09/PT44 comparison. Do not silently make consumable keys, Power spending, persistent XP or adaptive FOV the price of fixing present defects.
- **Human acceptance:** supplied positive feedback is substantial, but iPad near-unplayable sustained behaviour means FP-UI1 is not fully accepted. No new release, runtime test pass, hardware qualification or Agent 04 start is claimed here.

## Joint decision

**Pending Sol's independent review.** No two-model agreement is recorded yet.
