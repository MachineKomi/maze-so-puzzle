# MOVE-01 final motion comparison — 2026-09-05

The final sampled runtime removes the repeated stationary gaps observed in the
legacy held-movement routes after the deliberate first-hold pause. Frame intervals
also improved in these three recordings. This is report-only browser evidence;
it does not establish clean-host performance qualification or Human comfort.

## Comparable cohort and results

Both cohorts use the same engine-derived keyboard-held routes, 1280×720 viewport,
full motion, 676×676 board border box and zero followers. Route positions, segment
lengths and terminal geometry/step counts match. All six recordings have strictly
increasing unique frame timestamps and no missing sampled geometry or step labels.

Values are milliseconds, **before → final after**.

| Route / committed segment | Hold-window frame p95 / maximum | Keydown to first sampled world change | Repeat stationary spans ≥33.3ms |
| --- | --- | --- | --- |
| Lanternlight Labyrinth / 4 left | 33.2 / 33.5 → 17.0 / 17.1 | 71.1 → 22.2 | 2 → 0 |
| Rainbow Power Parade / 3 up | 33.7 / 49.6 → 16.9 / 16.9 | 32.0 → 20.0 | 1 → 0 |
| Twilight Treasure Loop / 6 right | 33.4 / 49.9 → 17.0 / 17.1 | 34.8 → 20.9 | 4 → 0 |

The legacy repeat stationary spans were 99.8/83.1ms, 116.3ms, and
116.3/66.8/116.6/100.1ms respectively. None meet the same threshold in the final
cohort. The intentional initial hold pause remains. Recorded longtasks: **zero
in every before/after trace**. A long frame interval is not itself a recorded
main-thread longtask.

After the final sampled commitment, terminal geometry is reached in
149.8 → 283.0ms, 133.2 → 266.4ms and 166.5 → 249.9ms respectively. The after values
also match the first sampled `settled` state. They include sampling/commit-display
phase and are not direct measurements of the pure traveller's lag limit.

## Calculation method

- The hold window starts at the recorded keydown and ends at the first frame with
  the final step label. Include consecutive frame intervals whose ending timestamp
  lies within that window. Interval counts are 46 → 53, 29 → 36 and 64 → 83;
  window durations are 836.7 → 871.7ms, 598.4 → 602.7ms and 1367.2 → 1386.4ms.
- Report nearest-rank p95: sorted interval at `ceil(0.95 * count) - 1`.
  This excludes unequal idle tails from the primary comparison. Full-capture p95
  is 17.1 → 17.0ms, 33.5 → 16.9ms and 33.4 → 17.0ms respectively.
- First sampled world change is the first post-keydown frame with Euclidean
  world-rectangle displacement greater than 0.05px from its preceding sample.
- A stationary interval changes both world and player rectangle positions by at
  most 0.05px. Sum consecutive stationary intervals and retain runs ≥33.3ms,
  from the first repeat's sampled commitment to final geometric settling. This
  excludes the initial hold pause and the terminal idle tail.
- Final geometric settling is the earliest post-final-commit sample within
  0.05px of the terminal world/player positions with all subsequent samples also
  remaining within that tolerance.

## Interpretation limits

Per-frame `getBoundingClientRect()` reads add measurement overhead. Actor pose
transforms affect player rectangles; the first-change column therefore uses the
world/camera rectangle. Pose motion can also conceal very short stationary spans,
so the pause metric describes this sampling method rather than proving perfectly
constant velocity.

Several traces lack a clean pre-input baseline. rAF timestamps represent a frame
time and can precede the event whose DOM changes the callback reads. The
first-change values are observed sample delays, **not input-to-photon latency**.
Sample counts are small; one run per route cannot isolate scheduler or host
variation from implementation effects. No clean-host attestation, physical-device
qualification, follower-load qualification or Human comfort acceptance follows
from these traces. The wider interaction/follower suite is separate evidence.

## Source evidence and provenance

Sampler: `scripts/performance/movement-review.pw.ts` (`sampleMotion` and the three
`MOVE comparison held route` cases). This review only reads existing JSON and
writes this document; it runs no browser suite or build.

Before directory:
`C:/Users/hellb/AppData/Local/Temp/maze-move01-before-372e7d9/movement`

Final after directory:
`C:/Users/hellb/AppData/Local/Temp/maze-move01-full-final/movement`

Each contains `{before|after}-{lanternlight-labyrinth|rainbow-power-parade|twilight-treasure-loop}.json`.
The earlier `maze-move01-after-r1` comparison is superseded by this final cohort.
Archive these source files with the root checkpoint evidence before temporary
storage is cleared.

Both provenance records name HEAD `372e7d983b00ae6ea929ef51fd78988fec0b9672`;
runtime hashes distinguish the uncommitted final candidate from that baseline:

| Provenance | Before | Final after |
| --- | --- | --- |
| Build time UTC | 2026-09-05T03:02:43.135Z | 2026-09-05T03:34:41.243Z |
| Runtime inputs SHA-256 | `43206642e0fc3b38629f73cf6cadf7fd35251e7b44d54d057c844ca5b287da28` | `71911d5f5512c608ed7355bf04506da01abf65fa86ca8ba0d4c7cc62fd9eb7df` |
| Dist fingerprint SHA-256 | `74b5602ef2169ab0b23e782fa609c5aff13dcc3d28c3c6ba1c0144cd6a6db83c` | `da6f4dca00ca9ee45eecf1b2a8d2604ac918e72b3bd54e592bce9d4797878dbb` |

These measurements apply to the identified runtime inputs; subsequent runtime
changes need their own evidence or an explicit scope-based review.
