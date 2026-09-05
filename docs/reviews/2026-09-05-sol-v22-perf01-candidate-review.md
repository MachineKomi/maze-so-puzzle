# Sol review — V22-PERF-01 candidate

Date: 2026-09-05
Reviewer: GPT-5.6 Sol
Candidate branch: `codex/v22-perf-01-astra`
Documentation checkpoint reviewed: `cd3ac18616c1daa9d9e320a514fa7ea5fb4075f6`
Runtime candidate reviewed: `a92257a2ecb234c314b00ddaafb15c4d206771c2`
Frozen v0.22.0 runtime comparison: `68e303da680d5aec0ba71154949c5a2a0d1697ae`

## Verdict

**Revise before promotion or device-preview publication.** The candidate contains
worthwhile, well-scoped work and its ordinary input paths are substantially better
covered than v0.22.0. It is not yet correctness-green because a delayed chained
presentation can release held movement before its final phase actually completes.
The performance evidence also does not support saying that Full-quality sustained
stutter is fixed.

This is a narrow return, not a rejection of the approach. Astra should correct the
presentation-completion ownership and the stale reverse-takeover pad state on this
candidate branch, add the missing focused tests, and return the exact new runtime
SHA for a short Sol re-review. Do not merge, version, release or deploy this
checkpoint yet.

## Evidence classification

The conclusions below deliberately distinguish three kinds of information:

- **Direct Human evidence:** on the affected iPad, disabling effects/movement in
  v0.22.0 did improve smoothness, but did not make play reliably responsive. The
  v0.22.0 web build on the Human's laptop behaves broadly like Tauri: materially
  better than the iPad, but still not consistently buttery. These observations
  establish that motion/effect work is material but not the only demonstrated
  contributor.
- **Measured candidate evidence:** the committed counter, matrix and soak summaries
  are reproducible records of the stated desktop Edge runs. They show removed work
  and a much more truthful Lite recipe. Their timing remains contaminated and
  report-only.
- **Engineering inference:** likely renderer, raster, MiniMap, persistence or host
  contributors remain hypotheses until a matched isolation or affected-device
  result distinguishes them.

## Accepted parts

1. **The redundant-work changes are real.** Neutral board jitter no longer commits
   the whole App; unrelated Sound-menu commits no longer rebuild the 529-cell map
   or rescan scene bindings; normal movement retains authoritative React/game/save
   commits. Stable active-object, map and follower inputs preserve semantic changes.
2. **Anchored drag now has the right reference frame.** Once a board gesture becomes
   a drag, direction is derived from the touch-down origin rather than Ame or the
   moving camera. Release, neutral steering and ordinary source ownership are
   sensible and generation-guarded.
3. **Success continuation is directionally correct on healthy schedules.** Physical
   intent and repeat scheduling are separated; releases and steering update the live
   source while presentation is suspended; resumption uses a fresh initial delay
   and does not replay a queued burst.
4. **Fresh blocker behavior matches the Human decision.** Each new deliberate
   missing-capability or under-powered attempt explains the obstacle, while one held
   blocked gesture cannot flood dialogs.
5. **Scene binding reuse is appropriately bounded.** Node discovery is keyed to the
   run, mounted presentation/anchor set and follower identity order, while ordinary
   retargeting reuses nodes. Resize, hidden-page, run and discontinuity boundaries
   retain explicit reset paths.
6. **Lite is now an honest scene mode.** It removes named filtered images, ambient
   animation, hazard overlays, filtered grounding and joystick blur while retaining
   puzzle semantics and ordinary travel. The reviewed Lite proof remains attractive;
   its three-minute result warrants physical testing after the correctness return.
7. **The tester finale repair is scoped correctly.** Normal final completion was
   already correct; the changed tester path truthfully starts a Surprise test maze
   rather than wrapping to Maze 1.
8. **The allocation is accepted for this candidate only.** The named 650-byte gzip9
   JavaScript allocation covers the measured 561-byte deficit with 89 bytes of
   variation headroom. It authorizes no additional feature work, public media,
   dependency, version or save-schema change.

## Required correction before acceptance

### P1 — chained presentation can unlock early after a main-thread stall

Jump-to-battle, jump-to-rescue and jump-to-door schedule their second phase from a
handoff callback. The second phase's own clear timer therefore starts when that
callback actually executes. Movement unlock, however, is independently scheduled
once from the original nominal sum of both durations.

If the event loop stalls across the handoff—and the recorded baseline contains
stalls long enough to make this plausible—the handoff callback starts phase two
late, then the already-due aggregate unlock callback can run immediately. It clears
`presentationSuspended` and schedules held movement while the final animation is
still active. That violates the acceptance rule that an eligible hold resumes only
after the complete presentation and never catches up through an interrupted phase.

Required remedy:

- make the actual final phase completion own unlock/resume, or reschedule the lock
  from the final phase's real start;
- guard completion by the existing presentation/input generation so cancellation,
  level change, hidden page and a superseding presentation cannot resurrect input;
- add deterministic stalled-handoff coverage for a real jump-to-rescue fixture;
- retain healthy jump chains, simple door/combat/rescue, reduced-motion timing and
  release/steer-during-presentation coverage.

### P2 — reverse source takeover leaves ThumbPad UI/capture stale

App-level `clearDpadHold` clears its semantic direction and timer, but the ThumbPad
component separately owns its gesture object, highlighted direction and pointer
capture. Pad-to-keyboard or pad-to-board takeover prevents stale movement, but can
leave the old pad visibly engaged and holding capture until its terminal pointer
event. This is lower severity, yet it contradicts the receipt's broad statement
that takeover clears the previous gesture/capture.

Required remedy: give the component a bounded reset signal/callback, or implement
an equivalent single-owner reset that releases its capture and visual state on
source takeover. Add reverse-takeover coverage; do not merely narrow the claim while
leaving visible stale input.

## Performance disposition

The performance part remains **promising but unqualified**:

- The 36+36 short matrix shows narrower candidate p95/p99 ranges and no LongTask
  API entries, but includes a 582.9 ms frame interval and some worse individual
  candidate tails. A LongTask `self` label cannot attribute compositor/GPU stalls.
- The completed ten-minute Full sample reduced catastrophic extremes but worsened
  p95/p99 from 16.9/33.3 ms to 33.3/50.0 ms. The runs straddle a Codex crash and
  radically different free-memory conditions, so neither a causal improvement nor
  a causal regression can be claimed.
- The first recovery timed out; the next identical-runtime diagnostic completed.
  The cause remains unknown and must stay recorded.
- Both soaks repeat one corridor in one 23×23 maze. They do not satisfy the requested
  multi-maze transition/resource/music-retention case.
- Every observed task over 50 ms remains functionally unattributed. No physical
  iPad, Safari/WebKit or timed Tauri/WebView2 result exists.
- The three-minute Lite supplement is a useful positive signal, not a qualified
  device result. It proves that substantial work was disabled; it does not prove
  the affected iPad is fixed.

After the correctness return passes review, publish the exact candidate only as a
clearly labelled v0.22.1 performance/input preview. The Human should then compare,
on the affected iPad and the same five-follower large maze:

1. Full quality + Full motion, fresh and after sustained play;
2. Lite quality + Full motion; and
3. Lite quality + Reduced motion.

Record device/iPadOS/browser, charging and low-power state, duration, approximate
route/maze transitions, follower count and whether each mode is responsive—not
only whether it is better. Keep V22-UI-01 and Agent 04 held until that result.

If Lite + Reduced still stutters, run one small V22-PERF-02 isolation rather than
guessing: fixed or muted BGM, large versus small maze, and alternating A/B/A runs
that separately decouple the MiniMap's 529-cell grid and disable scene
filters/ambient paint. Capture Long Animation Frame or trace-level main-thread/
paint/raster evidence rather than relying only on the LongTask API. The physical
mode split should determine which factor is investigated first.

## New Human feedback routed alongside this review

The same Human turn adds four requirements. None belongs inside the already
measured V22-PERF-01 runtime diff:

- three player-selectable movement pace modes, elevated into a small early
  play-feel slice after the performance baseline;
- Alex as a future optional Player-1 character, with Ame remaining the default;
- a confirmed Tessera Dolphin field-alpha defect; and
- stationary cage rescue from the adjacent tile, while ordinary consumables remain
  walk-over pickups.

Their durable acceptance and dependency routing are recorded in the dated Human
intake, backlog and roadmap. The Dolphin diagnosis is particularly concrete: the
published field rendition still contains the old missing coral regions, while its
later 512px presentation rendition demonstrates that the repository already has a
bounded corrected-alpha master. Repair the field derivative; do not regenerate the
approved character.

## Exact next action

**Astra remains the sole runtime writer for one V22-PERF-01-R1 correctness return.**
Change only the chained completion/unlock ownership, ThumbPad takeover reset and
their focused tests/evidence. Preserve runtime performance behavior, Full/Lite
recipes, cadence, engine/content, save schemas, media and version. Re-run focused
input tests plus the serial locked project/performance/desktop checks required by
the existing brief. Commit and push the exact candidate branch; do not merge or
publish. Sol then performs a short diff-and-test review before recommending the
device-test preview.
