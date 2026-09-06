# AUDIO-01V2 — reconciled next implementation boundary

## Measured preview decision — 2026-09-06

Root Astra and actual Sol have now reviewed source-bound native OfflineAudioContext
cue/engine-overlap renders and decoded-OST PCM combinations at 48kHz and 44.1kHz.
Approve SFX ceiling4/3 for a **qualified preview**, conditional on browser/native
integration checks; this is not final all-range clip-free qualification. At the
new Music.10 default, the worst selected boosted mix sample peak was .21278/.21407
respectively, with no full-scale overshoots. The adversarial24-voice SFX-only
stress remained below .352. At Music1, even the existing SFX1 mix can exceed full
scale (worst1.08459/1.08623); ceiling4/3 increases this to1.11278/1.11472.

Keep visible truthful guidance near the controls: very high Music and Sound
effects together may distort; lower either if heard. Preserve existing raw gains;
do not silently lower legacy choices, add an unreviewed compressor, or claim
that sample peaks establish acoustic quality, inter-sample peaks, every phase
alignment or iPad behavior. Unified output headroom/mastering belongs in AUDIO-01
before final audio qualification. Physical listening remains P8. The earlier
preflight below is historical; its unapproved-headroom gate is resolved only to
this bounded preview disposition, not blanket loudness acceptance.

## Original build-ready boundary

2026-09-06. Astra read actual [Sol's independent review](2026-09-06-audio01v2-sol-review.md)
and accepts its calibration/persistence approach. This is a build-ready direction,
not implemented audio or measured headroom. v0.22.5 remains UI/Exit only.

Use Sol's C1 piecewise music curve rather than the original single-power
preflight proposal: below UI75%, gain `.10*(u/.75)^2`; above, `x=4u-3` and
gain `.10+x/15+5*x*x/6`. Test exact zero/75/unity anchors, monotonicity,
inverse/round trips and native keyboard steps. This gives useful adjustment
below the default instead of placing half the slider near silence.

Stored/API/graph values remain raw effective gain. New/malformed profiles default
to `.10/1` displayed75/75; recognizable older profiles retain exact old chosen
gains and their implicit `.22/1` when audio fields were absent. A version2
calibration marker does not rename the preference key. Future versions must be
protected by an actual writer refusal; unrelated edits and rounded display must
not round-trip gain. No campaign reset/migration or changed music owner.

The SFX maximum above1 is **not approved yet**. First render actual authored cue
envelopes and reachable dense/repeated overlaps at default and proposed4/3
ceiling, including overlap with music. Distinguish loose source bounds, actual
sample peaks and speaker listening. If peak protection or cue mastering is
needed, return the measured case for a bounded root decision rather than adding
an unreviewed compressor or changing the selected default mix. A cosmetic upper
quarter silently clamped at1 does not fulfil the Human's requested headroom.

Next writer: root Astra, actual Sol independent review. Start only when root's
v0.22.5 publication/heavy slot hands back; keep the frozen release immutable.
Read the preflight, Sol review, MUSIC, audio plan, motion/storage/provider,
audioMix/sound/music and SoundDialog before editing. Limit runtime to calibration,
version-aware persistence, channel-specific validation and existing slider UI.
No AUDIO-01A readiness, new cues/assets, dependencies, VFX, UI redesign or camera
experiments in this seam. Prototype maximum +1600 JS gzip9, zero CSS/media/deps;
allocate only the measured reviewed increase with rollback evidence.

Return focused numeric/storage/graph tests, muted/zero/hidden/failure behavior,
no seek/restart, no per-tick Test sound, production pointer/keyboard/reload/Reset
checks, sample-peak evidence, exact full/build/perf/desktop results and raw-gain
rollback limits. Physical listening remains P8; no new Human answer is needed to
implement the selected balance. Root reviews/packages only after Sol acceptance.
