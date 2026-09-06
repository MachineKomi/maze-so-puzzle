# AUDIO-01A / v0.22.7 — engineering acceptance

Runtime freeze: `9b822281197c9e9e65a8c9467fe5bd578dce1cbd`.
Root: Astra. Independent reviewer: actual GPT-5.6 Sol High, separate source,
envelope, browser and native review. Publication status belongs to the joint
state and release receipt; this record does not itself claim deployment.

## Scope and decision

Accept the bounded music-readiness seam for a versioned family preview. The
[independent final native review](2026-09-06-audio01a-sol-native-final-review.md)
accepts the exact source/portable; exact-source release gates remain separate. Prepare
one likely next track, retain outgoing music until incoming playback is confirmed,
then use a complementary 400 ms Web Audio fade. One alternate attempt follows
an incoming failure; permission refusal waits for permitted interaction. Rapid
retargeting, mute, suspension, timeout and cancellation have bounded ownership.

No new media, PCM cache, service worker, library, limiter, mastering, art,
gameplay/save rule, camera/FOV, content or layout change. Existing SFX activation,
epoch cancellation and voice bounds remain unchanged. The transport says
“Selected” because selection is not proof of audibility. Full audible history,
automatic playlist succession and loop UI are not included.

## Checks and evidence

- Final source-equivalent `npm run check`: **578/578**, 53 files, TypeScript and
  production build. The log precedes the final commit; its runtime inputs are
  the committed final files. Final-source headed browser and native dist are
  byte-identical. See `project-check-final.log` and build provenance below.
- Focused audio: 68 tests, including 26 playback lifecycle cases. A discovered
  interrupted-fade envelope ordering issue was fixed before final freeze; it is
  not hidden by the initial 16deeb2 candidate's passing resource run.
- `npm run perf:check`: 11 scenarios, 9 allocation owners, 3 evidence files;
  JS gzip9 **157,262 / 157,357 B**, CSS **23,980 / 30,697 B**, public
  **165,031,011 / 165,031,011 B**. JS grows 1,560 B from v0.22.6 within the
  named 1,600 B allocation; CSS/public bytes are unchanged. Timing is report-only.
- Locked native no-bundle release build passed (5m08s); production audit: zero
  vulnerabilities. The >500 kB Vite chunk warning is retained, not suppressed.
- Art validation is inherited from v0.22.5/v0.22.6, not rerun: public art,
  sources, pipeline and catalogues have identical Git objects. That preserves
  the fresh validator's 0 errors / 429 historical warnings and the inherited
  136 art tests. Input equivalence is not new visual or device qualification.
- [Independent envelope review](2026-09-06-audio01a-sol-envelope-review.md)
  accepts the nonnegative complementary-gain bound and decreasing-first,
  shared-time updates. This is not a new rendered waveform/true-peak or whole-
  mix maximum-level qualification. Existing high-Music/SFX distortion remains.
- [Final headed browser report](2026-09-06-audio01a-browser-review.md): 20
  focused real-UI transitions, prepared Victory reuse, delayed/failed incoming
  continuity, rapid retargeting, mute and induced context-suspension recovery;
  max two media lanes and no unbounded retries. The 603-second/53-transition
  pre-envelope r1 run supports unchanged resource/lifecycle behavior only.
  Do not relabel it a final-source 10-minute waveform run or combine counts to
  pretend the final r2 run alone achieved its 25-transition target.

## Actual Windows qualification

Unsigned x64 portable: **173,470,208 bytes**, SHA-256
`5cff755c021134aaa67409751613131c9dd3c809b8b2241b6cce81809ab39b00`.
Built from a clean detached LF checkout at the freeze, with locked dependencies.
Final native/browser dist fingerprint:
`8022a4138ff5a56895ea1c560d7e6d162c0f5fa266d77165c51ceb5c4c96ddc1`.
Raw input fingerprints differ across CRLF/LF checkouts; both are individually
bound to the same Git source and delivered bytes, not falsely declared equal.

Astra used actual Windows Computer Use in an isolated synthetic profile:
Title → Home; defaults75/75; Next song; Music50/SFX75; mute/unmute; Test sound;
Story → Maze1; one real movement input; normal Alt+F4 close; reopen; Home Continue
at one step; restored50/75; resume at exactly `(1,3)`; finish with five more real
inputs; Victory → Stay → Book → Home; second normal close. Both bound processes
and debugging listeners exited. No Human profile or OS audio/network setting was
altered. Native passive graph/media observation confirms current-plus-one bounds,
correct saved calibration, playback and prepared Victory reuse, not speaker onset.
WebView2 may request the same prepared URL again at play: preload is a hint, not
a guaranteed no-refetch cache. Same-turn muted AudioParam getters can retain an
old value while ordered calls already set both masters to zero; those calls do
not by themselves prove rendered silence.

The first reopened Play attempt lacked coordinate geometry and performed no
confirmed action. Its pre-retry Title capture is retained; refreshed screenshot
and one retry produced the actual Home capture. No failed evidence was replaced.

Victory→Stay→Book displayed zero banked completions: this is the existing
documented provisional-completion boundary, not an audio save regression. The
reward wording merits a narrow PT-20260902-10 comprehension follow-up. This
run proves active-run/settings persistence, not a fresh banked-completion test.

## Evidence location and open gates

External evidence: `C:/GameDev/maze-game-qa/releases/v0227` (logs, portable stage,
input equivalence, native-readiness-attempts/fresh-01, acceptance/native summary)
and `C:/GameDev/maze-game-qa/audio01a` (baseline, r1/r2, independent reviews).
The frozen manifest hashes all evidence it cites. Large captures/profiles stay
outside runtime and Git; compact reviews and receipts are committed.

Physical Safari/iPad/phone/speaker listening, acoustic onset/clicks/leading silence,
actual hidden-tab production behavior, clean-host sustained heap/performance,
all-controls-max mix/true-peak, offline clean-machine installation and signing
remain unqualified. Browser tab-switch attempts did not make document.hidden
true; no hidden-page pass is invented. The known iPad camera issue remains open.

P11 adds readiness listening; P5–P10 remain cumulative. No Human answer blocks
this engineering preview. After publication, next is V22-HOLE-01: an atomic
single-width rules/content correction, then connected ditch rendering/art review.
Keep v0.22.6 immutable as the immediate rollback; preserve player data.
