# PLAY-A independent engineering acceptance

Astra, 2026-09-06. **Accept the bounded pace implementation for successor
integration, not as a deployed build or physical-iPad/family acceptance.**

Actual Sol authored runtime `07897d9`, then evidence/allocation checkpoint
`c766228ff25064c1df973bfb9b2bd2940ca86fce` on pushed clean branch
`codex/v22-tessera-integration`. This also retains the separately accepted
Tessera field repair (`f6d54e1`, feedback merge `a653a7b`). Main's runtime and
published v0.22.2 are unchanged.

## Independent review performed

Astra read the complete runtime diff and new browser cases, inspected the
1194×834 and scrolled 568×320 Sound screens, reran all 15 motion/cadence/travel
unit tests and the complete static performance contract on this exact clean
candidate. Both reruns passed. The four browser report SHA-256/byte counts match
Sol's committed report: final pace6/6, inherited regression5/5, UI/reset1/1 and
the earlier isolated corrected mid-travel1/1. These are reviewed existing
browser runs, not newly executed independent browser cohorts. Sol's complete
502/502 test/build result remains attributed to his run.

Read-only reviewer Gauss found a genuine mid-travel settings snap: disabling the
traveller at Sound entry settled the already-committed destination immediately.
Sol corrected only Sound's travel-enabling boundary while input stays inert and
is cleared. The corrected production test starts Chill, opens Sound at80ms,
changes to Zippy, confirms the old tile still moving at319ms and settling on the
next frame, then verifies no canceled intent replays and fresh movement uses
120ms. Astra accepts this narrow correction; unrelated modal policies remain.

Shared duration selection feeds keyboard/board/ThumbPad and the admission
unlock, closing the fixed160ms rapid-tap bypass. Captured duration and320ms lag
bound preserve Chill. Preference migration is additive and separate from saves;
no engine/content/schema change. Representative tests cover all three speeds
and three sources, not an exhaustive nine-way hardware matrix.

Measured JS153514/153537 (+230 exact named allocation), CSS23510/30227 (-2),
public165031011/165031011 (unchanged). No new dependency, artwork or audio in
PLAY-A. The preauthorized700-byte ceiling was not used as blanket reserve.

## Next owner and limits

Sol explicitly handed ownership back; **Astra is now sole runtime owner**.
Next bounded work is AUDIO-01V's independent Music/SFX gain/settings seam, with
Sol review, while the separate camera-layer hypothesis remains experimental.
Merge main's latest documentation into the isolated candidate before further
implementation. Do not merge unversioned runtime into main or mutate the frozen
v0.22.2 tag/downloads. A successor web/Windows package needs its own version,
clean-source build, native checks, CI/deployment/download verification and P5/P6
checklist entries. No new playable build or slider availability is claimed here.

The pace change is not an iPad lag fix. PLAY-B stationary rescue, native Exit,
phone UI, audio listening and sustained device gates remain open. If audio needs
more work than a bounded checkpoint, publish the independently accepted pace/art
preview without implying that deferred audio or camera changes are included.

Candidate report: `docs/reviews/2026-09-06-v22-play01-pace-candidate.md` at
[the exact branch checkpoint](https://github.com/MachineKomi/maze-so-puzzle/blob/c766228ff25064c1df973bfb9b2bd2940ca86fce/docs/reviews/2026-09-06-v22-play01-pace-candidate.md).
