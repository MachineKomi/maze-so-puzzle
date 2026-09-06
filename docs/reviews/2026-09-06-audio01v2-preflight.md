# AUDIO-01V2 — gain calibration preflight

Date: 2026-09-06. Astra-team read-only source preparation at
`bcaab812026d6e24bb37e10e263681b612b8842f`, using `write-spec`.
Only this note was created. No runtime edit, browser/audio test, build,
measurement, dependency installation or acoustic acceptance occurred.

Authority: [V23-01 intake](../playtests/2026-09-06-v0223-v0224-intake.md)
and [AUDIO-01V2 scope](../plans/AUDIO-01-readiness-and-sound-design.md).
Root chooses the final curve after bounded qualification; Sol's active native
Exit assignment is unchanged. Do not expand this into AUDIO-01A readiness.

## Recommendation: keep effective gains authoritative

Keep `PresentationPreferences.musicVolume/sfxVolume`, `AudioLevels` and
`configureMusic({volume})` in **effective linear gain units**, not UI percentages.
Add pure forward/inverse calibration helpers for SoundDialog. New defaults are
Music gain **0.10** and SFX gain **1.00**, displayed as **75% / 75%**. This matches
the requested old control gains without altering cue envelopes or OST files;
equal perceived balance on every device is not established by that calculation.

For normalized slider position `u` in `[0,1]`, one small coherent candidate is:

```text
musicGain(u) = u <= .75 ? .10 * u / .75
                            : .10 + .90 * (u - .75) / .25
musicPosition(g) = g <= .10 ? .75 * g / .10
                              : .75 + .25 * (g - .10) / .90

sfxGain(u) = (4 / 3) * u
sfxPosition(g) = .75 * g
```

The SFX ceiling `4/3` is a **provisional approximately +2.50 dB headroom** choice,
not a proven safe maximum. Preserve the same inverse formula if root selects a
different monotone curve; lock it with exact endpoints and round-trip tests.

| Value | Music gain / display | SFX gain / display |
| --- | --- | --- |
| Silence | 0 / 0% | 0 / 0% |
| New default | .10 / 75% | 1 / 75% |
| Legacy shipped defaults | .22 / approximately 78.333% | 1 / 75% |
| Candidate maximum | 1 / 100% | 4/3 / 100% |

The music upper segment is deliberately steeper: it preserves the entire old
`[0,1]` gain range. A simple linear `.10 at 75%` curve ending at `.1333` cannot
represent old `.22`, `.50` or `1.0` settings. Do not saturate those values or show
100% while secretly playing above the represented range. Inspect keyboard/touch
adjustment near 75%; a smoother monotone curve is an option if this seam feels
too abrupt, not justification for a new audio architecture.

## Storage and migration

**Smallest option:** retain `maze-so-puzzle-presentation-v1` and its raw-gain
fields, adding an explicit `audioCalibrationVersion: 2`. The key's historical
suffix need not redefine its existing fields. No numerical gain conversion is
needed: the version records the control calibration and widened SFX bound.

- An unversioned valid legacy payload is read with **old** finite clamping and
  fallback rules: Music `[0,1]`, SFX `[0,1]`, old fallbacks `.22/1`. Preserve
  motion, quality and pace. A legacy `.22` cannot be identified as default versus
  a deliberate choice, so do not reset it merely because it equals the default.
- A genuinely absent or malformed profile uses new `.10/1` defaults. A valid
  older preferences object missing audio fields can retain old implicit `.22/1`
  to avoid changing its effective mix during migration. Document this distinction.
- Version 2 validates Music `[0,1]` and SFX `[0,4/3]` for this candidate. Legacy
  out-of-range SFX `2` must still normalize to its old effective `1`, **not** gain
  new loudness by using the wider bound before migration.
- Keep migrated gains unchanged in memory and JSON, including fractional values.
  Stamp recognized version 2 on a successful preference write; migration/read
  need not write storage synchronously. Denial leaves effective in-memory choices
  usable and uses the existing save warning. Preserve unknown future payloads;
  do not silently overwrite them as version 2.
- Display may round its percentage text, but rendering/opening Sound or changing
  pace/quality must never round-trip the rounded number back into gain. Only an
  actual audio-slider change applies the forward map. Keep range focus IDs and
  keyboard support; decide fractional thumb/ARIA representation explicitly.
- Reset Progress's allow-list already excludes presentation preferences; retain
  that behavior. Do not make a campaign reset restore the new audio defaults.
  Preserve the master mute override while changing/migrating gains; zero remains
  immediate silence. Current mute is transport/session state, not a persisted
  preference—this calibration alone must not claim persistent mute on reopen.

Alternative: a new versioned preferences key storing calibrated slider positions
also works, but requires an inverse migration plus full-precision positions and
one gain conversion boundary. It touches more consumers and creates rollback/
source-precedence questions; raw gains plus a calibration marker are simpler.
Older executables cannot represent new SFX gain above 1; disclose that rollback
limit rather than promising cross-version preservation of newly boosted choices.

## Exact consumers and pitfalls

- [motion.ts](../../src/motion.ts): versioned reader/defaults/writer; don't reuse
  a widened SFX clamp for unversioned legacy normalization.
- [audioMix.ts](../../src/audioMix.ts): split normalized-control validation from
  channel-specific gain bounds. `audioLevel()` currently clamps everything to 1;
  leaving it on SFX would silently flatten the entire 75–100% headroom range.
  Keep one lazy graph, 20 ms gain ramps, immediate zero/mute/hidden silence,
  cancellation epoch and node teardown. Apply both stored gains directly.
- [PresentationProvider](../../src/ui/PresentationProvider.tsx): currently calls
  both `setAudioLevels(preferences)` and `configureMusic({volume: musicVolume})`.
  Both must receive the **same raw music gain**, not one raw/one normalized value;
  the second call otherwise overwrites the calibrated graph target.
- [music.ts](../../src/music.ts): retain raw gain semantics. Music remains at
  unity media-element volume behind its one Web Audio gain path; the direct-media
  fallback uses raw gain once. Its existing `[0,1]` clamp covers this proposal.
  Volume-only configuration must not dispose, seek or restart the player.
- [SoundDialog](../../src/ui/SoundDialog.tsx): only the forward/inverse display
  mapping changes. Preserve mute, Test sound cancellation and input isolation.
  [App](../../src/App.tsx)'s trusted gesture activation and transport mute path
  do not need a second activation/controller implementation.
- [sound.ts](../../src/sound.ts): retain authored envelopes, 24-voice cap and
  expiry-on-mute/zero/hide behavior. Calibration is one channel gain, not a gain
  multiplier pasted into every cue. Update source-derived browser/native fixture
  expectations: previously “12%” was raw `.12`, which no longer displays as 12%.

## Headroom and release gate

The present music and SFX gains connect directly to `context.destination`; there
is no shared peak-protection stage. The largest authored note peak is `.052`.
The deliberately loose sum bound `24 × .052 × 4/3 = 1.664` already exceeds full
scale before music. This is **not evidence that those peaks actually coincide**,
but it prevents certifying “safe” solely from the voice cap or fake GainNode values.

Before choosing boosted SFX as release behavior, measure representative loud OST
segments with worst reachable cue overlaps, repeated Test sound, Zippy encounters,
and slider ramps at defaults/maxima. Use actual rendered/sample peak evidence,
not only gain API mocks. If unacceptable clipping appears, revise the maximum
or bring root one bounded output-protection decision; do not silently lower all
old gains, master the OST, add a library, or claim an ordinary compressor is a
proven brick-wall limiter. Even the old Music1/SFX1 mix needs honest qualification.

Required focused checks: gain/position endpoints, monotonic inverse round-trips;
legacy/new/malformed/denied storage; fractional choices after unrelated preference
changes; reset independence; mute/change/unmute; zero cancellation; current track
identity/time unchanged; direct-media and real graph response; native close/reopen.
Physical iPad/phone/desktop listening remains separate. No two-lane preparation,
new sound palette, art, layout or dependency is required for this calibration.
