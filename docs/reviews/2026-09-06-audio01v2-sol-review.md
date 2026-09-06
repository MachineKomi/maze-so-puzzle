# AUDIO-01V2 — Sol independent preflight review

Date: 2026-09-06. Read-only source/spec review against current main
`7c467284d2964c3185c54b8437bfa4645e4423d3` and the AUDIO-01V2 preflight. This
records Sol's independent engineering recommendation; it is not joint agreement,
runtime acceptance, listening evidence or permission to publish. No runtime,
test, browser, build, audio or shared-state action was performed.

## Verdict

Proceed with one bounded calibration/persistence checkpoint, separate from
AUDIO-01A. Keep stored `musicVolume` and `sfxVolume` as effective linear gains.
The same raw music gain must continue through `PresentationProvider`,
`setAudioLevels`, `configureMusic`, the Web Audio path and the direct-media
fallback. Do not convert the graph to UI percentages or add another audio owner.

Fresh/malformed preferences should use gain **0.10 / 1.00**, displayed as
**75% / 75%**. Valid unversioned preferences retain their old effective values:
Music clamps to `[0,1]`, SFX clamps to `[0,1]`, and missing audio fields in a
recognizable older motion/quality/pace payload retain the old implicit `.22/1`.
Version 2 may use a separately selected SFX maximum above one. This means a
legacy saved `.22` correctly displays above 75%, because preserving audible gain
is stronger than making every existing profile look like the new default.

## Required storage boundary

Add an `audioCalibrationVersion: 2` marker without renaming the existing storage
key. Define “recognizable legacy payload” explicitly rather than treating every
parsed object as valid. Reading may normalize a recognized legacy value into a
version-2 in-memory shape, but only an actual preference edit should persist it.

Unknown future calibration versions must remain byte-preserved in storage. The
writer therefore needs a concrete refusal rule, not just tolerant parsing. It
should either inspect the existing stored version before `setItem`, or carry a
future/read-only marker through the provider and reject that write; on refusal,
the in-memory choice remains usable and the existing save warning appears.
Restrict UI update patches from changing the calibration marker. Campaign Reset
must continue excluding this key.

Opening Sound, moving focus, changing pace/quality, or rendering a rounded
percentage must never convert the rounded thumb value back into gain. Only a
real slider input applies the forward curve. A native one-percent range step and
rounded output/`aria-valuetext` are reasonable if the raw value remains untouched
until that input.

## Music curve challenge

The preflight's single-power proposal, `g = u^a` with
`a = log(.10) / log(.75)`, is monotone, reversible and anchor-correct. I do not
recommend silently accepting it as the product curve: 50% becomes about `.0039`
(-48 dB), so roughly half the physical slider has little practical adjustment.

A bounded smoother alternative with exact zero, `.75 <-> .10`, unity maximum
and continuous slope at 75% is:

```text
u <= .75: g = .10 * (u / .75)^2
u >  .75: x = 4u - 3
           g = .10 + x/15 + 5x^2/6
```

It gives about `.0444` at 50%, `.10` at 75%, `.44` at 90% and `1` at 100%.
Its inverse is direct (square root below `.10`, positive quadratic root above),
so exact round-trip tests remain small. Root may choose a different monotone
curve, but the 0/75/100 anchors, inverse, keyboard behavior and lower-half
usability must be explicit acceptance evidence rather than inferred from the
formula.

## SFX headroom is the promotion gate

The proposed linear map `g = 4u/3` correctly makes gain `1` display as 75% and
offers +2.50 dB at 100%. `audioMix.audioLevel()` currently clamps both channels
to one, so implementation must split music `[0,1]` and SFX `[0, selectedMax]`
validation or the upper quarter will be cosmetic.

I do not approve `4/3` as safe from source inspection alone. The current graph
has no output peak-protection stage; authored `combatImpact` starts peaks of
`.052 + .045 + .018`, and the global 24-voice ceiling permits larger overlaps
across repeated cues. The loose `24 * .052 * 4/3 = 1.664` bound does not prove
clipping, but it prevents a safety claim. Keep the maximum as one named candidate
constant, exercise default and maximum with actual rendered/sample peak evidence
for reachable dense overlaps and repeated Test sound, then lower the maximum or
bring one separately reviewed output-stage decision if peaks are unacceptable.
Do not add a compressor, remaster OST files or attenuate the old default mix in
this first seam without evidence.

Older releases clamp a newly stored SFX gain above one if they later rewrite the
preferences. Disclose that rollback limitation; opening an old version alone
must not be described as destructive.

## Smallest implementation and checks

Limit source changes to pure calibration helpers, `motion.ts` migration/writer,
channel-specific `audioMix.ts` validation, and `SoundDialog` display/input
mapping. `music.ts`, `sound.ts`, App activation/lifecycle and the transport should
need only expectation changes unless a focused test exposes a regression.

Required focused evidence:

- exact 0/75/100 anchors, monotonicity and inverse round trips, including tiny
  positive and fractional gains;
- absent, malformed, recognizable legacy, version-2, out-of-range, denied and
  future-version storage; unrelated preference changes preserve exact raw gains;
- SFX above one reaches its GainNode, while music remains bounded to one and the
  streamed element stays at unity only behind the graph;
- mute/change/unmute, zero/hide cancellation, no queued SFX, direct-media
  fallback, and volume-only changes preserve current track identity/time;
- browser pointer/keyboard slider steps, rounded accessible text without storage
  drift, Test sound not firing per tick, reload and Reset independence;
- default/max dense-overlap peak capture plus later phone/iPad/laptop/native
  listening. Automated fake GainNodes do not close the acoustic gate.

The appropriate next seam is **AUDIO-01V2 calibration and migration only**. Stop
before AUDIO-01A preparation/crossfade, new cues, mastering, layout redesign,
assets, dependencies or general controller work. Measure and allocate its actual
JS/CSS delta, preserve rollback to raw AUDIO-01V preferences, and keep physical
listening explicitly open.
