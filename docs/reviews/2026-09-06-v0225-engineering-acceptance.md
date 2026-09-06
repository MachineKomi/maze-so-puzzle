# v0.22.5 V22-PHONE1 — final engineering acceptance

2026-09-06. Frozen runtime `7282665f8631051785176b701b1a7f14b7fe24a3`.
**Accepted for a versioned family preview.** Publication/download verification
is a subsequent transaction, not inferred here. Actual Sol implemented the
bounded [native Exit](2026-09-06-ui-native-exit-01-astra-review.md) and
[compact UI](2026-09-06-ui01a-astra-review.md); root Astra independently reviewed
their source/screens and qualified this frozen integration.

## Delivered scope

Compact landscape gameplay keeps the whole minimap card, Friends/Bag, feedback
and thumb pad disjoint. At 780×312 the labelled equipment shelf shares a horizontal
band. Short-height Book chrome stays fixed, tabs keep whole words and the
collection body alone scrolls. The praised desktop/iPad geometry remains intact.
Native Title Exit now closes the owning Tauri window/process; browser failure
guidance leaves Play usable. This is not the complete UI plan.

Exact committed-byte comparison against v0.22.4 protects engine/content, rules
fingerprints, save schemas, camera/FOV, pace, audio and runtime media. No additional
unfinished-run restart is introduced. Earlier pre-v0.22.4 migration rules remain.

## Frozen checks

- Locked install; 543/543 project tests across 51 files; TypeScript/production
  build, locked Cargo check and optimized no-bundle Windows build passed.
- JS gzip9 155307/155362 bytes, CSS 23976/30693; public runtime
  165031011/165031011. Eleven performance scenarios valid. Timing report-only.
- Fresh art validator: zero errors, 429 declared historical warnings. The 136
  art unit tests are inherited from byte-unchanged inputs, not rerun here.
- Production dependency audit: zero findings. Source and final dist guards pass.
- Eight-view final-source browser proof: 3/3, including dense current-engine
  content, actual long rescue/objective copy, safe-area cases and input/readers.
  Root inspected final compact gameplay/Book and primary screenshots. Exact
  geometry comparator is Exit-base `033f8748`, whose primary layout is unchanged
  from v0.22.4; it is not a newly captured v0.22.4 baseline.
- Deployed canonical browser: 23/23 selected native-fallback, pace, stationary
  rescue, cancellation/reload, tester isolation, chrome and compact-layout checks.
  Separate real keyboard/pointer volume-range and reload checks passed at
  844×390 and 1194×834. These are not acoustic measurements.
- Actual final Windows portable, WebView2 152.0.4191.62: 53 rescue-origin
  visibility samples, one rescue/unchanged movement steps, deliberate turn-away
  and cleared-cage entry. Same rescued run and Zippy/Music12/SFX64 restored through
  normal OS close/reopen. This inherited regression is separate from Title Exit.
- Root Computer Use: real cold pointer Title Exit (PID23560/window7936866) and
  real Tab/Enter saved-profile Exit (PID36288/window8002908) closed their actual
  processes/windows. Reopened PID13448 preserved exact engine state and
  Reduced/Lite/Zippy/Music12/SFX64; final normal OS cleanup completed.
- Runtime CI34009976109 verify/desktop and Production6288858311 succeeded;
  canonical raw HTML/JS/CSS exactly match the frozen native-build dist.

Portable: unsigned Windows x64, 173468160 bytes, SHA-256
`bf0ab23182999b6ef95c050d2a6ba7bcd4cfe86636f6e95c16334a43b856e987`.
External evidence: `C:/GameDev/maze-game-qa/releases/v0225`. The frozen manifest
binds logs, fixture, native summaries, browser results and acceptance envelopes.

## Failed attempts retained; no runtime change to make tests pass

The first fresh art validation lacked ignored historical v14 proofs; restoring
those unchanged external proofs allowed validation. This exposes a clone-only
evidence dependency, not newly broken runtime art. Tauri rewrote Cargo.toml file
metadata/EOL state: the normalized diff was empty and Git content hashes matched;
refreshing the index cleared the false dirty gate without a source change.

Native Exit attempt1 timed out during orchestration recovery. Attempts2/3 closed
the actual windows but console-only input observation was lost around shutdown.
Only attempt2's already-completed, source/portable-bound cold-pointer subcheck
is reused. Attempt4 independently validates real trusted Enter/click facts saved
synchronously by an observational listener in a QA-only synthetic-profile key,
then read after actual reopen. It does not manufacture input, intercept closing,
delay the game or relabel the earlier overall attempts as passes. Root also
observed the real focus ring, activated Exit and verified window disappearance.
No Human profile was accessed or modified.

Physical phone/iPad comfort, iPad camera stutter, 200% text/all-screen UI coverage,
listening, sustained native performance, PT36 attachments, signing, installer,
offline and clean-machine qualification remain open. More-menu/very-small-board
phone tradeoffs need family review. No layer hint, audio-default recalibration,
new loot system, enemy placement or broader art change ships in this checkpoint.

Next: Astra implements the separate [AUDIO-01V2 joint decision](2026-09-06-audio01v2-joint-decision.md),
actual Sol reviews. [P9 and cumulative checks](../PLAYTEST_CHECKLIST.md) remain
Human acceptance, not prerequisites to safe independent work.
