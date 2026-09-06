# VFX-02A reward-first — Sol source review

Date: 2026-09-06
Reviewer: actual Sol, independent read-only source review
Baseline: clean `7ad381670ffd7a362324a871fb00e266fda43608`
Candidate state: uncommitted v0.22.10 working tree; this is not a native,
release, physical-device or Human-art acceptance

## Disposition

The current bounded source design is conditionally acceptable for qualification.
I found no remaining engine, reward-conservation, save-schema, solver, camera-write
or unbounded-resource blocker in the reviewed files. Gold, Science and maze-Power
remain committed by the existing engine before this cancellable presentation runs.
The Canvas layer is decorative and `aria-hidden`; the existing exact notice,
Power display and wallet/save truth remain authoritative.

This disposition became possible after three review findings were corrected:

- all three combat bursts are now admitted once at battle start with absolute
  `bornAt` values derived from the same presentation clock as the typed Power
  steps, so delayed callbacks cannot shift reward deadlines;
- cancellation clears active and future combat tokens together, while new event
  admission rejects hidden or unfocused contexts; and
- the collision envelope is now `.18` tile, conservatively enclosing the maximum
  `.3 * 1.1`-tile glyph, with a bounded 14-tile/second homing cap and 8 ms
  collision substeps.

The uniquely active `data-reward-anchor="ame"` wrapper is appropriate. It selects
the ordinary rendered actor or the battle-lunging replacement without selecting
the hidden ordinary actor. Jump and portal deliberately cancel to the exact static
fallback. The current reward-first authority asks for Ame's presented position;
an in-tile wrapper/body landmark is safer at wall-adjacent and top-row cells than
the visually elevated Power-number badge.

The old chest-to-wallet flight and old battle transfer motes are removed rather
than layered beneath the new effect. Standard combat number updates still come
only from `CombatTransferStep`; zero-delta clashes emit no beads, representative
values sum to the committed enemy Power, and cancellation returns the display to
committed `game.power`. Full-motion per-step `powerTick` timers are suppressed in
favour of the reward owner's grouped cue, limited to one cue per 80 ms through
the existing calibrated SFX bus and 24-voice cap. Reduced motion retains its
existing atomic result.

I subsequently reviewed the source-bound browser evidence described below. It
closes the bounded local browser/source gate with no new blocker and supports
advancing this exact runtime to native/frozen qualification. It does not promote
the candidate to a release by itself.

## Bounds reviewed

- One board-sized Canvas; no level-sized surface, dependency, media or public
  asset. Backing dimensions are limited by DPR 1.5 and 1536 pixels per axis.
- One token array and one animation callback, with a shared ceiling of 24 Full or
  12 Lite tokens. Large values are integer-partitioned across representatives.
- Presentation-only deterministic seed; no gameplay/generator RNG consumption.
- Tile-space wall collision against static terrain, read-only projection from
  `sceneTravel`, and no actor/camera/world-transform writes.
- Stalled frames expire decoration rather than catching up or producing late
  collection audio. Missing/invalid anchors, blur, hide, resize, navigation,
  level/presentation cancellation, static/reduced mode and unmount release work.
- No engine event, drop table, persistent progression, save format, solver or
  completion-delay change.

The Human-requested teal atom and the rose Power bead are original code-native
effect symbols. This review does not describe them as approved bitmap/source art
or reopen any approved world-sprite family.

## Browser evidence reviewed

The final 24-case production matrix covers legal engine-derived Gold, Science,
potion and combat events across Full, Lite, Static and Reduced configurations,
desktop/compact viewports and DPR 1/2. Every Full/Lite representative in this
cohort arrived naturally: Gold `8/8`, Science `4/4`, potion `2/2`, and combat
`12/12` in each moving configuration. Static and Reduced produced zero moving
tokens while retaining exact receipts. Every case ended at a `1x1` backing
surface, stayed within its Full/Lite cap, retained exactly one active Ame anchor,
reported no broken image or page error, made zero terrain mutations, matched the
engine-derived saved game, and conserved every displayed combat Power pair.

The separate real React/Canvas/rAF harness passed 100 cycles of direct cancel,
synthetic blur and active-preference teardown with future combat contacts already
admitted. No future token reappeared and no animation callback remained. A fresh
event worked after cancellation; preference teardown/remount and unmount again
left a `1x1` surface, zero tokens and zero pending callbacks. This is meaningful
lifecycle evidence, but synthetic blur is not hidden-tab or native lifecycle
proof.

The superseding renderer comparison applies the same 24 glyphs, trails, shadows,
group labels and deterministic physics to both approaches. On the loaded host,
Canvas used one node and approximately `0.8 ms` drawing-work p95; the reused DOM/
SVG pool used 97 nodes and approximately `1.0–1.6 ms` work p95. Both had about
`17 ms` frame p95. Trace Paint events favoured Canvas strongly, but Canvas GPU
work is not represented by those Paint events. With that limitation explicit,
the node/write bound, measured CPU work and actual production scenes make Canvas
a reasonable selection for this tranche; the evidence does not establish a
general renderer rule or physical-device performance.

I independently inspected the supplied Gold and combat stills. They support
basic contrast, semantic distinction and composition around Ame, but the capture
cohort is not used as timing or natural-arrival evidence because screenshot work
can correctly trigger the visible-frame stall-expiry rule.

The recorded serial project result is 640/640 across 58 files before the
version-only v0.22.10 metadata bump. The current art check records zero errors
and 429 inherited warnings. Candidate inventory records unchanged public assets;
the final candidate ledger reports JS gzip +2,645 bytes, CSS gzip -386 bytes and
zero public growth, inside its named +2,700/0/0 allocation and earlier prototype
ceiling. These are local candidate gates, not clean-host or release provenance.

## Remaining qualification

Native keyboard/pad play, cancellation/navigation, exact whole-storage save and
reopen, tested portable identity, frozen commit/build provenance, final post-bump
gates, CI/Production and public downloads remain open. So do physical iPad/
Safari/Chrome performance, a real hidden-tab/background lifecycle, acoustic and
combined-mix listening, continuous endpoint-motion judgement, family comfort and
Human beauty acceptance. The matrix proves the named legal cases, not every seed,
maze geometry or rapid real-route combination. Keep the 80-seed pure collision
coverage, shared-cap tests and lifecycle harness as the broader deterministic
guardrails, and make future matrix runs fail—not merely report—if a required
natural stationary representative expires.

## Reviewed working-file hashes

These hashes still match the runtime files used by the reviewed browser cohort.
They bind only this uncommitted state and must be replaced or superseded after any
runtime edit or by the final frozen commit/build identity:

| File | SHA-256 |
|---|---|
| `src/App.tsx` | `95d66075836a51313f1a8690ab4ee6baf7099bae4bc57d748b28004e19610095` |
| `src/combatPresentation.ts` | `2624b310f12ab26fd243c88f898cb35700debeb52739091901daf585ccecdd06` |
| `src/sound.ts` | `99987cd5bc85149f0d1fac34c8dd8a3cc335c27a5d2e8bac8096868dfd4744c1` |
| `src/vfx/rewardPhysics.ts` | `c0aa0154e93d3e3acfa3ed3a9d16bb5201ead8b6f2a2aa77ee14592a072e9c56` |
| `src/vfx/RewardLayer.tsx` | `70b390d50e43fa5c70df2ab23a1f317846cdb8c9705f867333001320b19afc23` |
| `src/vfx/rewardGlyphs.ts` | `b55d53d78b1237eb23ac577684586346d2da5d92d4ecc28d2aeef107e8ca033e` |
| `src/vfx/rewards.css` | `cfcf119b9aa22d1cf3260b3c56aa06d2d4c255694fff487642eebc40d38bcfb9` |
