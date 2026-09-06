# AUDIO-01V2 — calibrated controls candidate

2026-09-06. Root Astra implementation in `codex/audio-calibration` from
`b837e74b7d5fa7d6193779c8464410580cafaffc`. **Not accepted or published yet.**
The write-spec workflow reconciled the implementation against the
[joint decision](2026-09-06-audio01v2-joint-decision.md); no new audio architecture,
content, assets, camera or layout scope is included.

## Implemented candidate

- Sol's C1 music curve: useful lower-half range, gain .10 at UI75%, unity at100%.
- SFX gain1 at75%; candidate ceiling4/3 at100%, pending actual rendered-peak review.
- Stored/API values remain raw gains. Version2 marker uses the same comfort key.
  Fresh/malformed profiles default .10/1; recognizable legacy enum or finite gain
  payloads retain exact choices and old implicit .22/1. Legacy out-of-range SFX
  still clamps to1; only version2 accepts the proposed new ceiling.
- Read/mount does not write. Unrelated preference changes never round-trip the
  displayed whole percentage. Writes recheck storage and refuse any unknown
  calibration marker, including a newer payload arriving since mount. The
  existing nonblocking warning and usable in-memory settings remain.
  This refusal deliberately includes malformed explicit markers (null/string/0):
  an unfamiliar declared format is not assumed safe to overwrite. Malformed JSON,
  absent markers or unrecognized ordinary fields still use repairable defaults.
- Only actual range changes convert UI position into gain. Zero, mute, hidden
  cancellation, existing20ms ramps, one streamed-music graph and per-cue envelopes
  remain unchanged. Test sound remains explicitly triggered, not per slider tick.

## Current evidence and gates

Initial focused numeric/storage/music/mix/sound/reset run:57 tests across6 files
passed; TypeScript and Vite production build passed. Added real-ceiling graph and
campaign-Reset exclusion cases; focused rerun59/59 and TypeScript passed.
Candidate JSgzip9 is155649 versus
frozen v0.22.5's155307: **+342 bytes**. CSS23976 and public165031011 are unchanged.
The unallocated first performance run correctly rejected a287-byte ceiling overrun;
that failed run is not relabelled passed. Root allocates only the measured342-byte
increment within the previously authorized1600-byte prototype maximum.

Independent actual Sol source review, actual cue/overlap/OST sample-peak review,
production pointer/keyboard/reload/future-storage/Reset checks, full project tests,
final budget/desktop and native calibration/save-reopen remain required before
promotion. Physical listening remains P8, not inferred from numeric gains or
offline rendered samples. No default or maximum loudness acceptance yet.

Preliminary actual Sol source review found no runtime blocker. It requested an
explicit unknown-marker repair policy (above), inverse samples above SFX1 (added),
and actual browser proof of fractional gains through unrelated changes. Full
promotion/headroom review remains open. The first post-allocation perf invocation
found matching byte limits but correctly rejected stale build provenance after
tests/ledger changed; a fresh build and complete rerun are required.

## Rollback and compatibility

Revert this calibration/persistence/UI mapping together to the complete v0.22.5
baseline; do not mix raw gain with calibrated percentages. Campaign saves,
fingerprints and reset allow-list are unchanged. Earlier builds can read the raw
music choices but clamp SFX above1 if they subsequently rewrite preferences;
opening an earlier build alone is not claimed to rewrite them. Never overwrite
the frozen v0.22.5 tag, binaries, manifest or receipt.
