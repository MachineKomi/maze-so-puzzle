# Maze so Puzzle — joint orchestration state

State date: 2026-09-06. Current operating state for **Sol Astra MsP Collab**.
Replace this state when it changes; keep history in dated records and Git.
Human instructions outrank repository assumptions. This file owns current status;
the vision/specifications own product contracts and the roadmap owns dependencies.

## 1. Checkpoints and acceptance

- **Current preview: v0.22.8 HOLE-01A, Phase 1 published and verified.**
  Frozen runtime `3acaf5872dd921f15929c330eeae46053b2a6362`; root Astra and
  actual Sol accepted source/browser/native. CI34022523242 and Production6290975438
  succeeded; canonical web bytes and all four public downloads match tested files.
  Single-width crossings use rules3, `surprise-v6` / generated revision2, eight
  hole-to-floor edits in seven maps. Existing pit art remains. Older-rules
  unfinished runs restart with a notice; durable progress/history survives.
  [Acceptance](reviews/2026-09-06-v0228-engineering-acceptance.md),
  [Sol final review](reviews/2026-09-06-hole01a-sol-native-final-review.md),
  [receipt](../release/HOLE-01A-v0.22.8-release-verification.json).
  Release packaging/docs checkpoint `a02dbd9e5cc4597e617e68af40e267d0dc0fee64`
  is pushed; the later receipt binds those Git blobs to the uploaded attachments.
  P12 and P5–P11 remain open. Current bounded 04-A wall-only work is independently
  runnable; Phase2/PT36 still gate ditch/region and actor/held integration, not
  all lighting work. See §3 and §5. No iPad-camera acceptance.

- **Immediate published fallback: v0.22.7 AUDIO-01A.**
  Frozen runtime `9b822281197c9e9e65a8c9467fe5bd578dce1cbd` is pushed to main.
  Root Astra and actual Sol accepted source, browser and locked native evidence.
  Exact-source CI/Production and canonical raw-byte parity passed; all four
  public downloads are independently byte/hash verified in the
  [receipt](../release/AUDIO-01A-v0.22.7-release-verification.json).
  [Acceptance](reviews/2026-09-06-v0227-engineering-acceptance.md),
  [Sol final review](reviews/2026-09-06-audio01a-sol-native-final-review.md).
  Current plus one prepared track, confirmed 400ms handover and bounded failure/
  retarget/recovery; no media/camera/gameplay/save-rule change. 578 tests passed;
  final20 focused browser transitions plus separate inherited603-second resource
  evidence. Actual native controls and two normal closes/reopen passed. P11 and
  physical/hidden-page/acoustic/mastering gates remain open. This is the historical
  audio checkpoint; Phase1 holes are now delivered above.

- **Historical published fallback: v0.22.6 AUDIO-01V2**, frozen source
  `e628898bb4e501034f184a7a92c9e5e6d2b7a4aa`. Engineering and actual native
  controls/save/reopen are accepted by root Astra and actual Sol. Web is published
  with exact-source CI/Production success and canonical raw-byte parity.
  **Windows is published and all four public downloads are independently
  byte/hash verified**. See [acceptance](reviews/2026-09-06-v0226-engineering-acceptance.md),
  [frozen manifest](../release/AUDIO-01V2-v0.22.6-manifest.json) and
  [playtest note](../release/AUDIO-01V2-v0.22.6-PLAYTEST.md) and
  [publication receipt](../release/AUDIO-01V2-v0.22.6-release-verification.json).
  P10 is available on web/Windows; P5–P9 and the iPad camera gate remain open.
  This was the fully published fallback after AUDIO-01A publication.
- **Historical published fallback: v0.22.5 V22-PHONE1**, source
  `7282665f8631051785176b701b1a7f14b7fe24a3`. Web and Windows are published;
  final native checks and all four independent public downloads passed.
  Compact gameplay/Book and real native Title Exit are the only new runtime scope.
  [Final acceptance](reviews/2026-09-06-v0225-engineering-acceptance.md),
  [frozen manifest](../release/V22-PHONE1-v0.22.5-manifest.json),
  [publication receipt](../release/V22-PHONE1-v0.22.5-release-verification.json).
  No additional save/rules/content/camera/FOV/audio change or restart from v0.22.4.
  P9 is new; P5–P8 and the existing iPad camera failure remain open.
- **Historical immutable rollback: v0.22.4 V22-RESCUE1**, source
  `45d843774d0335aa0ae1ee51aa9ca2f70f235b31`. PLAY-B stationary rescue is
  independently accepted and merged. Web and Windows are published; all four
  downloads are independently byte/hash verified. See the
  [publication receipt](../release/V22-RESCUE1-v0.22.4-release-verification.json),
  [Astra acceptance](reviews/2026-09-06-play-b-astra-review.md) and
  [Sol handback](reviews/2026-09-06-v22-play01b-stationary-rescue-candidate.md).
  Rules revision 2 changes all sixteen authored fingerprints: older unfinished
  authored runs restart with the updated-maze notice, while durable completions,
  unlocks, rewards and historical bests survive. P7 and all applicable inherited
  physical/family checks remain open. No camera or native Title Exit fix is included.
- **Historical rollback: v0.22.3 V22-COMFORT1**, frozen `b834a8e6775ec024fc9f854c7a7ced8c096b6627`.
  Accepted Tessera field alpha repair + PLAY-A Chill/Regular/Zippy + AUDIO-01V
  independent Music/SFX levels. Exact-source CI/deployment,519 project tests,
  136 art tests,12 canonical journeys and native normal close/reopen passed.
  [Final acceptance](reviews/2026-09-06-v0223-engineering-acceptance.md).
  Web and Windows are published; all four public downloads verified byte-identical.
  [Publication receipt](../release/V22-COMFORT1-v0.22.3-release-verification.json).
  P5/P6/P8 Human acceptance remains open; **no iPad camera fix** is included.
  The canonical web address may advance before Windows publication; verify its
  displayed build and exact bytes rather than assuming both channels agree.

- **Latest audio intake, 2026-09-06:** iPad SFX are much quieter against BGM than
  on phone/laptop/native. Independent per-device Music/Sound effects sliders
  were implemented by Astra and reviewed by Sol in AUDIO-01V after PLAY-A.
  Implemented and qualified in v0.22.3; physical listening remains separately
  tracked. AUDIO-01V2 below supersedes the original default-mix choice; verify
  real gain behavior before blaming hardware.
  [Source](user-playtests/2026-09-06-ipad-audio-balance.md).

- **Latest Human intake, 2026-09-06:** the
  [v0.22.3/v0.22.4 routing record](playtests/2026-09-06-v0223-v0224-intake.md)
  captures all fourteen items and the pace/glow follow-up. V23-01 queues the
  separate early AUDIO-01V2 calibrated 75%/75% controls before AUDIO-01A, with
  the default perceived mix matching old Music10%/SFX100% and versioned conversion
  preserving existing users' chosen effective gains. V23-04 belongs to later
  UI HUD pace/settings work, not the completed Exit repair. V23-12 is Plan14
  exploration after RC-01; no JRPG/progression rewrite is authorized now. Positive
  pace feedback is not a blanket physical/camera/save/rescue acceptance.

- [Primary WebKit research](reviews/2026-09-06-ipad-webkit-research.md) finds
  relevant repaint/composition, SVG and layer-memory risks, not evidence that
  smooth scrolling is impossible on this iPad or a matching confirmed bug.
  The [completed PERF-02C triplet](reviews/2026-09-06-perf02c-triplet-review.md)
  isolated the extra world layer on Edge but demonstrated no improvement:
  Paint count fell while summed Paint duration rose; rAF p95 was unchanged.
  No layer hint is shipped and no automatic larger matrix is authorized.

- **Recorded v0.22.2 physical result, 2026-09-06:** [Human feedback](user-playtests/v0222-playtest-feedback.md) reports no obvious regression, perhaps slight improvement, but scrolling still stutters on iPad. Character/animation movement is smooth while the camera stays clamped; desktop browser does not exhibit the same symptom. The iPad gate is **not passed**. Possible thin lines need investigation, not a fabricated regression verdict. Moving-terrain/filter isolation remains a separate serial workstream; completed pace work is not its remedy. Texture-scale and Lanternlight level-design steer is routed in backlog/roadmap.

- **Historical preview: v0.22.2 V22-CAMERA1**, runtime/tag `820ed39f00e8c6bd808a0c084ccc2c67396ebb13`. Astra implemented fixed-origin, resize-safe percentage camera translation; actual GPT-5.6 Sol High independently approved source, geometry, final test observer and disclosed native Exit exception. It is a controlled experiment, **not a proven physical-iPad fix**. No pace, FOV, engine/content/save, art, audio or dependency change. Frozen attachment/test-observer checkpoint: `b0e6e7c42b2d3fec6656d3e12590bc36563e1f9c`. [Historical receipt](../release/V22-CAMERA1-v0.22.2-release-verification.json).
- **Prior immutable preview: v0.22.1 V22-PERF1**, runtime/tag source `8442b79db11a59e23f23c59f213116e7b8f54592`. This is the independently accepted R1 runtime `91678d1a7f97055dc2f167f8a3e7106226817306` with only seven coordinated version fields changed across six files.
- Sol's pushed review checkpoint is `c19128b7a45bc2179370bf55cfc8ab5851dbf008`; its [R1 verdict](reviews/2026-09-05-sol-v22-perf01-r1-review.md) accepts preview promotion, not sustained performance or physical-device success. Original [candidate](reviews/2026-09-05-v22-perf01-candidate.md), [R1 response](reviews/2026-09-05-v22-perf01-r1-response.md), rejected attempts and hash-bound measurements remain history.
- Astra completed the bounded publication transaction from an isolated worktree. Main fast-forwarded from `461cab02b065a1d0f654c49189ed24108c22c5a8`; frozen attachment documentation is `487afcffb2f91b433f79cc67d5ce4fd29a013552`. Later publication documentation is separate. The [receipt](../release/V22-PERF1-v0.22.1-release-verification.json) binds the immutable public artifacts and exact runtime CI/deployment.
- Frozen prior UI-03 / FP-UI1 runtime is `68e303da680d5aec0ba71154949c5a2a0d1697ae`, **v0.22.0**. Its tag, release, four attachments and earlier binaries are untouched. v0.21.0 remains Human-rejected; v0.20.1 remains a comparison baseline.
- Human disposition remains **POSITIVE, WITH OPEN CORRECTIONS**. The praised desktop/iPad composition is preserved. Sustained affected-iPad performance, phone scaling and later interaction/UI corrections are not accepted by publication. No Amelia/family qualification is claimed.
- Release worktrees use locked dependencies and external browser tooling, without Playwright junctions in their dependency trees. The original candidate checkout's ignored tooling junctions remain local-only history. Native QA used a hash-verified private copy of the FP-UI1 profile; all 334 original files remained unchanged.
- Discover this handoff's exact documentation commit with `git log -1 --format=%H -- docs/JOINT_ORCHESTRATION_STATE.md`. Inspect branch, HEAD, origin and `git status --short --branch` on arrival; dated receipts do not imply the current checkout is clean.

## 2. Release and deployment

### Current v0.22.8 HOLE-01A — web/Windows published and independently verified

- Frozen source/tag `3acaf5872dd921f15929c330eeae46053b2a6362`.
- Exact-source CI34022523242 verify/desktop success and Production6290975438
  success; canonical HTML/JS/CSS hashes equal the clean locked release build.
- GitHub prerelease383518285: [v0.22.8](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.22.8).
  Four independent public downloads equal their frozen manifest; unsigned x64
  portable173469696B, SHA-256
  `a99fcfc30f587a961659ff555d559b883b8cb8b0d6c5068edac24ada2b6058e9`.
- [Manifest](../release/HOLE-01A-v0.22.8-manifest.json),
  [playtest](../release/HOLE-01A-v0.22.8-PLAYTEST.md),
  [receipt](../release/HOLE-01A-v0.22.8-release-verification.json).
- 623 project tests,48 final focused/fixture assertions; fresh art136 unit tests.
  Full art validator is inherited only:1535 tracked art inputs identical to
  validated v25/v27. Fresh validator failed on ignored-proof/EOL authority;
  do not report a fresh pass or self-contained-clone proof. Repair before Phase2.
- Production20/20, synthetic compound15/15, pointer3/3; actual native96→99
  three jumps and normal close/reopen preserve exact raw game/progress/Zippy.
  Two transient native captures lacked Ame/weapon before a later complete frame;
  continuous actor visibility remains a visual follow-up, not claimed solved.
- Public/media/CSS unchanged; JSgzip9 157169/157357 (93B smaller). No camera,
  general UI or audio change. P12 and cumulative family/device gates stay open.

### Historical v0.22.7 AUDIO-01A — immediate published fallback

- Runtime/tag `9b822281197c9e9e65a8c9467fe5bd578dce1cbd`; packaging commit
  `a5ee980d7d6aa4c866d9efc9db5fa109b3e3ae90`. Runtime CI34018756990 and
  Production6290315074 succeeded; raw HTML/JS/CSS equal the frozen build.
- GitHub prerelease383498636: [v0.22.7](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.22.7).
  All four independent downloads match the frozen attachments. Unsigned x64
  portable **173,470,208 bytes**, SHA-256
  `5cff755c021134aaa67409751613131c9dd3c809b8b2241b6cce81809ab39b00`.
  [Manifest](../release/AUDIO-01A-v0.22.7-manifest.json),
  [playtest](../release/AUDIO-01A-v0.22.7-PLAYTEST.md),
  [receipt](../release/AUDIO-01A-v0.22.7-release-verification.json).
- 578 tests, build/static/audit, locked native and actual controls/save/reopen
  accepted independently. JSgzip9 +1560B; CSS/public unchanged. Final20 browser
  transitions and separate inherited pre-envelope53/603-second resource evidence
  are not a final-source25/10-minute or rendered-waveform qualification.
- Frozen checkout `C:/GameDev/maze-game-v0227-release` remains clean; packaging
  evidence `C:/GameDev/maze-game-qa/releases/v0227`, browser/source evidence
  `C:/GameDev/maze-game-qa/audio01a`. Native apps and owned browser previews closed.
- P11 listening and P5–P10 remain open. Actual hidden-tab, physical Safari/iPad,
  acoustic onset/clicks, all-range combined-mix/true-peak, clean-host/offline,
  installer/signing and iPad-camera acceptance are not implied. v0.22.6 fallback
  preserves the same save rules and preferences; never erase player data.

### Immediate fallback v0.22.6 AUDIO-01V2 — published and independently verified

- Frozen runtime/tag: `e628898bb4e501034f184a7a92c9e5e6d2b7a4aa`.
  [Root acceptance](reviews/2026-09-06-v0226-engineering-acceptance.md) and
  [actual Sol final review](reviews/2026-09-06-audio01v2-sol-final-review.md)
  qualify the bounded preview, including actual Windows controls and normal
  close/reopen in fresh and synthetic legacy profiles. No Human profile changed.
- Runtime CI **34014896142** and Production **6289670118** succeeded; canonical
  raw HTML/entry-JS/CSS match the frozen build. The
  [manifest](../release/AUDIO-01V2-v0.22.6-manifest.json),
  [playtest](../release/AUDIO-01V2-v0.22.6-PLAYTEST.md) and
  [checksums](../release/AUDIO-01V2-v0.22.6-SHA256SUMS.txt) were frozen and pushed
  in packaging commit `3d0d44cfa17abd7a606058c79f80f814d560439b`.
- Unsigned x64 portable: **173,468,672 B**, SHA-256
  `847502332571c2a9d0afc3fe8f8e2f850e497a17bab0e586eee76a04bbf45dc9`.
  Source/stage/final copies match. [GitHub prerelease383480270](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.22.6)
  is published; all four attachments were independently downloaded and verified.
  The [receipt](../release/AUDIO-01V2-v0.22.6-release-verification.json) binds public
  bytes to the frozen source/packaging documents. External work is under
  `C:/GameDev/maze-game-qa/releases/v0226`.
- This is calibrated controls and conservative preference migration, not OST
  mastering or the broader readiness work. Very high combined levels can distort;
  source-derived peak checks do not establish all-range or physical-speaker safety.
  No new iPad camera, engine/content/save-rule, artwork or OST-file change.
- Safe published fallback: v0.22.5 `7282665f8631051785176b701b1a7f14b7fe24a3`.
  Older code may clamp boosted SFX if it rewrites settings; do not promise
  byte-identical presentation preferences through a downgrade. Never clear saves.

### Historical fallback v0.22.5 — published and independently downloaded

- Frozen runtime `7282665f8631051785176b701b1a7f14b7fe24a3`; accepted native
  Exit runtime `e5a4a77` and corrected compact UI `840293d`, evidence `517667d`.
  [Astra final acceptance](reviews/2026-09-06-v0225-engineering-acceptance.md).
- 543 project tests, fresh art validation (0 errors / 429 warnings), inherited
  136 art tests, build/static/locked desktop/audit pass. Eight-view final browser
  3/3, canonical 23/23, separate volume-range/reload two-view pass. Runtime CI
  34009976109 and Production 6288858311 succeeded; canonical raw entry bytes match.
- Final unsigned x64 portable 173,468,160 B, SHA-256
  `bf0ab23182999b6ef95c050d2a6ba7bcd4cfe86636f6e95c16334a43b856e987`.
  Actual WebView2 152.0.4191.62: 53 stationary-rescue samples, preserved run/settings
  after normal close/reopen. Real cold pointer Exit PID23560 and saved keyboard
  Exit PID36288 close; reopened PID13448 preserves state/preferences. Observer
  failures and reuse of one completed cold subcheck are explicitly retained.
- Packaging documentation `d65bfc9419d3ca499a189b34e70285c80795a015` is pushed.
  [GitHub prerelease 383463903](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.22.5)
  has four independently downloaded, byte/hash-matched attachments. The
  [receipt](../release/V22-PHONE1-v0.22.5-release-verification.json) records them.
- No new media, save/content/camera/FOV/audio behavior. Final JSgzip9
  155307/155362, CSS23976/30693, public165031011/165031011. Physical P9 and prior
  family gates remain open. No installer/signing/sustained performance claim.

### Historical v0.22.4 — independently downloaded

- Frozen source: `45d843774d0335aa0ae1ee51aa9ca2f70f235b31`; accepted PLAY-B
  runtime `f3f090a7f8a5b8eb76382f31161345eb8a3d630f`, Sol evidence handback
  `b6f0003e4bfb71c332c42f6437a3ae8b9ea7ab8d`.
- At this checkpoint, Exit and UI-01A were separate candidates; both subsequently
  shipped in v0.22.5. This subsection preserves the v0.22.4 evidence.
- Exact-source CI34004670826 and Production6287989870 passed. Canonical raw
  HTML/JS/CSS match.533 project tests,22 canonical journeys and actual Windows
  rescue/normal-close/reopen pass;136 art tests are inherited from byte-unchanged
  inputs, not rerun. [Final acceptance](reviews/2026-09-06-v0224-engineering-acceptance.md).
- [GitHub prerelease383434235](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.22.4)
  has four independently verified downloads. Unsigned x64 portable173424640B,
  SHA256 `9888f8f2bbd4f6c2f6210e3eecf0104d852f3928cc03a74b338772647e28e7c0`.
  Packaging commit `804d42e4deafb92ac28b6443fede0df4a208a24e` is pushed;
  [receipt](../release/V22-RESCUE1-v0.22.4-release-verification.json) binds its text
  blobs to public downloads. WebView2 152.0.4191.62,52 native rescue-origin
  samples; exact rescued run and Zippy/Music12/SFX64 restored after normal close.
- Scope: stationary adjacent rescue, truthful cage/hole traversal, follower
  joining, save/navigation guards and distinct route-input/movement-step metrics.
  Accepted implementation allocation: +215 gzip9 JS bytes; zero CSS/public/
  decoded-image/dependency growth. Release-version bytes are measured separately.
- Inherits v0.22.3 Tessera repair, pace and audio controls. No camera, short-height,
  Title Exit, signing/installer or physical-device acceptance is implied.
- Immediate rollback is the complete v0.22.3 release below; never roll back only
  the rules fingerprint while retaining PLAY-B engine/save behavior.

### Historical v0.22.3

- [Web](https://maze-so-puzzle.vercel.app/): exact raw frozen HTML/JS/CSS match;
  CI34001890372 and Production6287529696 passed at `b834a8e`.
- Windows portable173424128 bytes, unsigned x64, version0.22.3; SHA-256
  `3d1d2f5d1f00e3f94d4d7f5c5a7baf74485783d0ecca2c73baf808a29b042110`.
  [Release](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.22.3).
  GitHub prerelease383420350 has four independently downloaded and hash-matched
  attachments. Packaging documentation `c77e7d7` is pushed and byte-identical.
  [Publication receipt](../release/V22-COMFORT1-v0.22.3-release-verification.json).
- [Manifest](../release/V22-COMFORT1-v0.22.3-manifest.json) and
  [playtest note](../release/V22-COMFORT1-v0.22.3-PLAYTEST.md) preserve scope,
  exact checks, byte budgets, failed attempts and rollback to v0.22.2.
- Native WebView2 152.0.4191.62: new synthetic profile, seeded Maze2, live settings,
  normal OS close/reopen twice, same run/pace/levels restored. Title Exit still
  needs its separately queued repair. No signing/installer/physical listening pass.

### Historical v0.22.2 — experiment delivered, iPad scrolling still unresolved

- [Web](https://maze-so-puzzle.vercel.app/), visible 0.22.2 and exact raw
  HTML/JS/CSS parity against final same-SHA LF-entry dist. Runtime CI
  [33997389203](https://github.com/MachineKomi/maze-so-puzzle/actions/runs/33997389203)
  verify/desktop passed; Vercel production `2BdmrPnd1rho9P1Agcj9WJHxgaLR`,
  GitHub deployment `6286775028`, succeeded. Later docs deployments are separate.
- [Windows download](https://github.com/MachineKomi/maze-so-puzzle/releases/download/v0.22.2/Maze-so-Puzzle-0.22.2-V22-CAMERA1-820ed39-locked-portable.exe),
  unsigned x64 PE, file/product 0.22.2, 173,379,584 bytes, SHA-256
  `e6753a7a62ad2f6f8525154b578b3ac3068342b52f795779f01d2391288ea7e9`.
- [GitHub prerelease](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.22.2)
  `383399096`: all four portable/manifest/playtest/checksum downloads were
  independently verified. Tag is runtime, not packaging/receipt documentation.
- 499 project tests; 96 mount/resize and 76 moving geometry samples; final
  selected input evidence 18+1; canonical journeys 6/6 after test-only observer
  correction. Old 5/6 canonical result, clock setup failure and earlier
  contention/diagnostic errors remain evidence, not omitted or relabelled passes.
- Locked native compile and 7m25s optimized build; actual WebView2 152.0.4191.62
  Maze-2 moves, OS normal close/reopen/resume at eight steps. A new synthetic
  profile was used; no Human profile read/copied/modified. **Title Exit is not
  qualified**: it leaves a native window after closing web content. Use X/Alt+F4;
  UI-NATIVE-EXIT-01 is queued with Sol/Astra, not silently fixed in this binary.
- JS gzip9 153,274/153,307 (33 bytes left), CSS 23,512/30,227, public
  164,988,031/164,988,031. No new media/allocation. LayoutCount did not improve;
  desktop callback timings are report-only. No iPad/native timing/family pass.

Exact checks, provenance, failed attempts and raw-evidence hashes:
[manifest](../release/V22-CAMERA1-v0.22.2-manifest.json),
[receipt](../release/V22-CAMERA1-v0.22.2-release-verification.json),
[playtest note](../release/V22-CAMERA1-v0.22.2-PLAYTEST.md).
External raw evidence: `C:/GameDev/maze-game-qa/releases/v0222` and
`C:/GameDev/maze-game-qa/output/playwright/perf02`; private profiles stay external.
Same preview namespace and progress-v6/active-v3 schemas. Rollback is intact
v0.22.1 `8442b79`, not a rewrite of it. A clone contains compact records, not all
ignored raw screenshots or private profiles.

### Historical v0.22.1 publication evidence

Public download verification: **2026-09-05T21:00:52.875Z**. See the immutable
[manifest](../release/V22-PERF1-v0.22.1-manifest.json), short
[playtest note](../release/V22-PERF1-v0.22.1-PLAYTEST.md),
[checksums](../release/V22-PERF1-v0.22.1-SHA256SUMS.txt) and later
[publication receipt](../release/V22-PERF1-v0.22.1-release-verification.json).

| Surface | Verified identity/status |
| --- | --- |
| Web | [Canonical playable site](https://maze-so-puzzle.vercel.app/), HTTP 200, visible v0.22.1; exact raw HTML/JS/CSS parity with the clean same-SHA LF-entry web reference. Canonical URL moves with deployment. |
| Runtime production deployment | Vercel `6XHZa3JELH5SKtUoGc1j2X8Src4c`, success status `53609530882`; GitHub Production deployment `6285663984`, exact runtime `8442b79`. The earlier same-source Preview deployment is separately identified in the manifest. |
| Runtime CI | [33991271551](https://github.com/MachineKomi/maze-so-puzzle/actions/runs/33991271551), exact `8442b79`; verify `101373827057` and desktop `101373826857` both succeeded. |
| Windows | `Maze-so-Puzzle-0.22.1-V22-PERF1-8442b79-locked-portable.exe`, unsigned x64 PE, file/product version 0.22.1; **173,379,584 bytes**, SHA-256 `8e1e2e692efc38823bc32e56c3d559db3fe2bc8e8c27830340fbed4f567ac92c`. Source/stage/final bytes match. |
| GitHub | [v0.22.1 prerelease](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.22.1), release `383372738`, published `2026-09-05T21:00:39Z`; lightweight tag targets the full runtime SHA above. Exactly four public assets were independently downloaded and byte/hash checked. |

The native build passed `cargo check --locked` (2m26s) and an optimized
`tauri build --no-bundle --ci -- --locked` (10m31s). The 24.5-second actual
Windows WebView2 smoke verified Title→Home→existing saved maze, a real
solver-derived normal battle with held continuation, release stopping movement,
normal close/reopen/resume at ten steps and the true 960×540 client minimum.
This is functional evidence, not native performance qualification.

Windows checkout CRLF produced different HTML line terminators from Vercel's
committed LF source. The native portable remains immutable. A second clean
same-SHA reference with committed LF entry HTML passed a separate 493-test/build/
static check and exact canonical HTML/JS/CSS comparison. Both builds' JavaScript
and CSS are byte-identical; their separate source/dist fingerprints and original
failed comparisons are recorded. No normalized-byte match substitutes for the
canonical raw-byte check.

Final gates: **493/493 tests across 49 files**, four scenario fixtures, TypeScript/
build, **87 input passes / two unchanged unavailable authored fixture skips**,
shared browser cohort **1/1**, canonical saved-run/input journeys **26/26**,
locked native compile/build/smoke, production audit **0 vulnerabilities** and
`git diff --check` passed. JS gzip9 **153,261 / 153,307** leaves **46 bytes**;
CSS **23,512 / 30,227**; public **164,988,031 / 164,988,031**. No new allocation,
asset, dependency, content or save-schema change was made.

The three text attachments are frozen before upload; do not rewrite them.
Documentation-only later deployments must be identified separately from the
runtime tag and verified to preserve these runtime bytes. The FP-UI1 namespace
`com.ame.mazesopuzzle.preview.fpui1` is preserved for the comparison run.
No installer, signing, clean-machine, offline, physical-iPad or family acceptance
is claimed. Raw evidence and private profile copies remain external under
`C:/GameDev/maze-game-qa/releases/v0221`; private profiles are not published.

## 3. Active work and next decision gate

**Current checkpoint complete: v0.22.8 HOLE-01A Phase1 published and independently
verified.** Exact source, CI, web parity and four public downloads are in §2.
Keep the frozen release checkout clean; do not repeat accepted audio or rules work.

**Preparation checkpoint complete:** root Astra implemented explicit legacy/current art
checks, exact approved-v14 archive/recovery, field-level manifest diagnostics and
two clean pit originals. Actual Sol conditionally accepted the source repair,
requiring documented clean-checkout recovery/validation before a portability
claim. That condition is met at final source `96b898d`: mandatory validation
fails before recovery, restores49 original bound files, then passes0errors/
429historical warnings.142 art tests and21terrain tests pass. See
[checkpoint evidence](reviews/2026-09-06-hole02-proof-and-source-checkpoint.md).
Human selected rounded-square **B** and explicitly delegated design/implementation
while busy; no repeated approval question is needed. Connected geometry preview
is source-only and not a shipped art replacement. Runtime v0.22.8 is unchanged.

**Next delivery:** isolated **04-A** wall/floor value and scale, filter-free wall
form/light-facing edges; qualified HOLE-02 integration; reward-first Plan02.
The [Astra/Sol next-focus review](reviews/2026-09-06-v0228-next-focus-disposition.md)
supersedes the blanket Phase2/PT36 hold. Only their affected ditch/receiver and
actor/held surfaces remain gated; do not claim full Plan04 acceptance. Preserve
rules3, `surprise-v6`/revision2, current input/travel/save and calibrated audio.
Family P12/P5–P11 may remain pending during safe delivery.

Latest Human device report: wife compared Chrome/Safari on iPad at ~08:30 today,
unknown build/settings; Chrome smoother but residual camera stutter. Record is
[here](user-playtests/2026-09-06-ipad-chrome-safari-comparison.md). It is not a
controlled engine diagnosis or acceptance. Claude's full-world mask premise is
confirmed in source, actual raster cost unmeasured. Existing audio has shared
gain buses and a24-voice cap; it is not direct-to-destination per voice.

Remaining V22-UI-01 propagation includes Home/dialog/victory, full200% text,
HUD pace/settings art and remaining optical refinements. Preserve the praised
primary composition, six-tile camera and reviewed input/rescue contracts.
The [completed assignment](plans/EXECUTION_PROMPTS.md#ui-01a--completed-compact-fit-assignment-history)
is historical; later propagation needs its own bounded review.

**PERF-02C completed as a diagnostic, not a runtime candidate.** The
[three-row review](reviews/2026-09-06-perf02c-triplet-review.md) preserves all
failed harness attempts, successful restoration and unchanged source/build.
One warm-cache, low-memory Edge triplet cannot establish iPad benefit. No further
experiment is queued automatically. Any future Safari/camera trial needs a new
explicit bounded assignment and matched source/geometry; independent UI/audio
work continues. The [audio-calibration preflight](reviews/2026-09-06-audio01v2-preflight.md)
is historical preparation; the later conditional peak decision does not provide
physical-speaker qualification. Current native/publication evidence is in §2.

Physical iPad scrolling acceptance remains open after the reported v0.22.1 and
v0.22.2 failures. Do not demand another reproduction of an already reported
failure, blame device age, or call Chill pace a camera remedy. Original
performance limits remain: unexplained recovery timeout, mixed Full sustained
tails, missing causal attribution, and unqualified multi-maze/resource/native
timing. Contaminated desktop evidence cannot close those gates.

The Human authorizes safe progress while playtesting is deferred; missing
physical results do not blanket-block these independent engineering seams.
AUDIO-01A, V22-HOLE-01, root PT36 and the later programme remain in §5. Only
the bounded wall-only 04-A slice is released; full Plan04 is not. Maintain the cumulative
[PLAYTEST_CHECKLIST](PLAYTEST_CHECKLIST.md) and
[HUMAN_DECISIONS](HUMAN_DECISIONS.md); record concrete Human answers separately
and never infer acceptance from silence.

## 4. Binding Human decisions and experience to preserve

- Aim for a warm, beautiful, tactile, readable all-ages puzzle adventure: fun, discovery, satisfying rewards and learning through play. Inspirations include Trails in the Sky, Mario Wonder/Party and Kirby; they are quality references, not assets to copy or a quota of effects/menus.
- Landscape iPad and desktop are primary; phones are secondary but must remain playable. Keep authored landscape layouts, with a rotate invitation in portrait. No requirement for a continuously morphing portrait layout.
- Preserve two-stage Title/Home: large logo/actions use the background's left negative space, cast belongs on the right path. Keep approved logo/cast identities and correct cutouts.
- Maximize the existing maze area; **no Big/Normal toggle**. Future zoom is separately scoped: **4/5/6/7 visible tiles, default 6**, Plan 08/PT32, with 07B workload requalification.
- First tap and held movement must both look smooth and feel responsive; gentle acceleration is allowed. No first-tile flash/camera jerk or old hopping gait. Retain precise tile legality unless a later reviewed decision changes it. No full analog rewrite has been agreed.
- Provide exactly three player-selectable movement pace modes: **Chill**, **Regular** (default, likely slightly slower than v0.22.0) and **Zippy** (faster than v0.22.0). Pace changes presentation/repeat cadence, never tile legality, interactions or solver truth; it applies consistently to keyboard, touch, fixed pad and later controllers, persists safely and is performance-qualified at Zippy.
- Latest V22-04/09: keep genuinely held direction through eligible successful interactions, observing release/steering while paused; never replay queued moves. Failed requirements explain on each fresh deliberate attempt, not once per enemy or only on the third bump. One continuous blocked gesture must not flood modals. Menus, cancellation, blur, hidden pages, disconnects and level changes still clear safely.
- A cage rescue follows the same stationary-contact principle as a door or battle: resolve while Player 1 remains on the adjacent origin tile; only a later or still-genuinely-held eligible step enters the cleared tile. Ordinary consumables remain walk-over pickups.
- Keep large readable art/type, Ame's Power portrait, useful minimap, cages/faded inventory becoming full colour without tick badges, stable HUD/feedback bounds and the bottom-right tap/hold/drag thumb pad.
- Preserve Book pages, large friend/guardian details, grey real locked achievement art, restrained modality-aware focus, round story portraits, clear primary actions/Enter progression, joyful bounded victory and motion preferences.
- Pickup amounts should be discovered on collection, not advertised in tiny tile-corner labels. Preserve readable post-pickup arithmetic and puzzle-critical enemy/player/gate information.
- Preserve Sound settings and convenient quick mute. Current compact-phone More menu is a declared layout tradeoff for family review, not blanket approval of every phone screen.
- Ame remains recognizably young, blonde and blue-eyed; clean chunky JRPG art uses material-local coloured contours. Do not reopen completed art approvals or resurrect rejected calibration/outline work.
- Alex is a Human-approved future optional Player-1 character for the Human's son, with blue eyes and blonde to slightly brown-blonde hair; Ame remains the default. His model/canon and runtime selection require a later Human gate, equal capabilities and an ALT-P1-01 seam before Plans 08/05/09/10 consume the selected lead and Plan 11 may depict him. Chill pace—not a weaker ruleset—provides beginner comfort.
- All 32 friends have authored rescues in the existing 16 mazes and generated eligibility; Unicorn appears in Maze 1 and Tea-Time Skeleton in Maze 2. The tea-drinking skeleton is a friend. Home v05 preserves the corrected horn and adds the expressly authorized precise alpha cleanup; do not restore earlier damaged cutouts.
- Tessera Dolphin's 256px field alpha defect was repaired and published in v0.22.3 from the approved recovery master. Preserve that versioned repair and character identity; P5 remains the separate Human field/follower check.
- Campaign growth is 16→24 (four inserted, four later), with purposeful asset ecology, harmonious floor/wall pairings, deeper intuitive solvable puzzles, varied rooms, optional decisions and gentle teaching. New mechanics require design/solver/family gates; wishlist wording is not immediate runtime authorization.
- Mimic surprise must never create an unsolvable route. Loot colours/sound, room variety, difficulty icons, original cute spooky cast and other wishlist details remain owned by their backlog cards/plans.
- Preserve the original contextual OST and existing music transport. Optional co-op keeps single-player default; greybox/family review must show shared laughter rather than sibling distress before costly production.
- AUDIO-01A advances bounded preparation/continuity and SFX readiness before
  Plan 04 after queued V22 corrections. Plan 02 owns the reconciled Claude sound
  palette/variation/mix trials; 07B qualifies the integrated result. Prompt phone
  v0.22.0 playback has no established cause and is not evidence of an audio fix.
- V22-HOLE-01 restricts crossing depth to one hole tile along the movement axis,
  preserving long one-tile-wide dividing trenches and T/+ path choices. Produce
  cleaner joined ditch art with truthful cardinal adjacency and safe landings;
  rules/content/saves and presentation must change together before 04/02/05/09.
- Persistent XP, sprinting, wall hopping and other Plan 14 opportunities are hypotheses, not approved systems. Asset retirement requires copy-first/hash-verified external backup and Human confirmation before removal.
- Future specialists use fresh tasks/current prompts; do not restart old Agent 01 tasks. Do not repeat the earlier Codex-update reminder; the Human deliberately held that update.

## 5. Remaining programme sequence

Completed foundations: 07A measurement; 06 gameplay/save/hints/content identity; 03 art; root 03M music compatibility; 01/MOVE-01 engineering history; UI-03 technical FP-UI1 release. These do not imply every future performance or family gate passed.

After the joint review and required Human decisions, retain the existing sequence until explicitly reconciled/approved:

1. v0.22.8 HOLE-01A Phase1 is published at `3acaf5872dd921f15929c330eeae46053b2a6362`; v0.22.7 is fallback. Do not repeat accepted audio/Exit/UI/rules work. PERF-02C demonstrated no benefit and no camera hint ships; iPad scrolling remains unresolved.
2. Finish bounded proof repair qualification; **04-A wall-only depth/value** may proceed independently of HOLE-02/PT36. Human-selected B/connected-ditch integration qualifies separately. **04-B** consumes accepted ditch/region boundaries; **04-C actor/held grounding** waits for PT36. Keep one runtime writer and actual independent review; these are scoped slices, not waived full-plan gates.
3. **02 reward-first** prototype, then publication against accepted 04-A scene/performance seams; later complete remaining VFX/lifecycle/material and **UI-02** polish. New drop rules need root's engine/save review; persistent XP remains Plan14. UI-03 already delivered Book/tab/detail/focus/victory foundations; preserve them.
4. **ALT-P1-01** Human-gated Alex model/canon and equal optional lead-player integration.
5. **08** normalized input, controllers/Xbox/Steam Deck and bounded zoom.
6. **05** limited sprite animation.
7. **07B** integrated performance/audio/delivery qualification → **FP-CORE2**.
8. **09** campaign expansion/content ecology/deeper puzzles → **FP-CAMPAIGN**.
9. **10** optional co-op/Friend Garden, greybox and Human gate → **FP-COOP**.
10. **11** branding/front-door audit → **13** backlog polish → **12** archive-first asset retirement.
11. **RC-01** integrated qualification → **14** planning-only opportunities → Human-approved follow-ons, if any → **15** final `docs/REUSABLE_AGENTIC_GAME_DEV_PLAYBOOK.md`.

Read the full roadmap, specialist plan and manager addenda before executing. Plan IDs are not execution-prompt section numbers. The prepared [Agent 04 prompt](plans/AGENT04-after-FP-UI1.md) remains unissued/held.

## 6. Historical v0.22.0 evidence and continuing practical limits

- Locked project check: **488 tests / 49 files**, TypeScript/Vite passed, 55.85 s. Prior **131 art tests** apply to unchanged art/Python inputs; not rerun after npm lock restoration. Locked desktop compilation and optimized portable build passed.
- Art validation: **0 errors, 430 classified warnings** (420 earlier + 10 proof/master records), not warning-free. Production dependency audit: 0 vulnerabilities; 11 scenario/9 owner/3 report performance contracts passed.
- Browser r6: **62/63**, with an observer race in a short reduced-motion rescue. Helper corrected, **r7 5/5 targeted**, **r8 17/17 UI/proof**, **r9 2/2 fresh/saved Home** (seven landscapes × normal/200% text). Do not report a nonexistent full 63/63 rerun.
- Locked local production **6/6, 46.793 s** and canonical production **6/6, 52.006 s**: movement, saved Home, Book/discovery/reload, dialog/victory and tester-profile isolation. Served entries and all 47 new art files matched expected bytes.
- Exact locked native portable: Title/Home, saved 37→38-step movement, Hint/Escape, normal close/reopen/resume at 38, 960×540 resize/layout; captures 30–37. Native compilation alone was not used as this evidence.
- Bounded modal review: 12 × 2.5 s blur/no-blur samples at desktop DPR1 and iPad-sized DPR2; p95 16.8–16.9 ms, no observed >50 ms frames/long tasks. CPU trace differences are not GPU measurements, sustained performance or physical iPad qualification.
- Static victory: zero active animations and identical screenshots across a 4-second sample; 12 stationary clipped confetti tips were recorded. Full/reduced motion and centered close affordance were separately observed. Compact decorative omissions and 200% accessible reader behaviour are documented, not hidden.
- Final gzip9: **152,379 JS / 23,130 CSS bytes**; public delivery **164,988,031 bytes**. Ceilings **152,557 / 30,227 / 164,988,031**: that historical build left 178 JS bytes and filled public allocation; the later v0.22.1 left 46 JS bytes under its own reviewed allocation (§2). Neither is current headroom. Additional work needs measured allocation decisions, not silent budget growth.
- Release documentation and committed proofs are cross-device. Some raw traces, full native captures and private profile backups remain local under `C:/Users/hellb/Documents/Maze so Puzzle/release-evidence/FP-UI1-v0.22.0`; the manifest records hashes/paths. A Git clone cannot reconstruct all ignored/local evidence. Never publish private profiles.

Open risks/gates:

| Area | Current unresolved boundary |
| --- | --- |
| Product/visual/family | Detailed Human findings and 51 images received and independently Astra/Sol-reviewed. Desktop/iPad presentation is strongly positive; V22 correction slices, physical sustained comfort and final family acceptance remain open. |
| Movement/input | Physical touch, single taps/holds/corners, long follower chains and comfort still require family evidence; controller/Steam Deck, couch/TV and screen-reader speech remain unqualified. Plan 08 owns the future canonical input policy. |
| Architecture | Astra and Sol independently checked and reconciled the current Opus claims, including explicit corrections. Preserve scene/coordinate/layer/motion seams, effect cancellation and one writer. No speculative full clock/renderer/hub rewrite is approved. |
| Performance | Tiny remaining JS budget/full public allocation; bounded timing only. Human evidence shows reduced effects/movement help on iPad without solving responsiveness; laptop web and Tauri are also imperfect. Terrain/effects/zoom/animation need integrated low-end sustained measurement before 07B qualification. |
| Solver/content | More mechanics, procedural loops/difficulty and Mimic RNG must preserve solver tractability and solvability. No code-review suggestion is automatically good family puzzle design. |
| PT36 visuals | Ring attachment currently uses layer 1 vs actor 2/other weapons 3; root must review canonical attachment metadata/composition before Agent 04 grounding. Do not infer a renderer defect or fix by weapon-name CSS. |
| Delivery/save | Unsigned portable, no clean-host install or offline qualification. Schema 6 protects future-version saves and preview isolation, but downgrade safety is not promised. |

## 7. Authoritative reading and exact evidence

Read in this order, then only the relevant owned plan/backlog slices:

1. This state, [complete Human feedback](user-playtests/v0220-playtest-feedback.md), [follow-up Human intake](user-playtests/2026-09-05-v0220-follow-up.md), [Astra review](reviews/2026-09-05-astra-v0220-review.md), [Sol review](reviews/2026-09-05-sol-v0220-review.md), [V22-PERF-01 candidate review](reviews/2026-09-05-sol-v22-perf01-candidate-review.md), [V22-PERF-01](plans/V22-PERF-01-sustained-play-and-live-input.md), [current source provenance](reviews/external/2026-09-05-v0220-review-pack-provenance.json), [current joint ledger](reviews/2026-09-05-sol-astra-opus5-v4-disposition.md), both linked complete Opus reports and the external screenshots. The earlier initial-feedback/v3 records remain history.
2. [Vision](GAME_VISION_AND_DESIGN_SPEC.md), [roadmap](plans/00-integrated-implementation-roadmap.md), [execution prompts](plans/EXECUTION_PROMPTS.md), [owned backlog](PLAYTEST_BACKLOG.md).
3. [Architecture](ARCHITECTURE.md), [gameplay specification](GAMEPLAY_DESIGN_SPEC.md), [Story Bible](STORY_BIBLE.md), [Art Bible](ART_BIBLE.md), [UI contracts](UI_UX_SPEC.md), [performance budgets](PERFORMANCE_BUDGETS.md).
4. [UI-03 plan](plans/UI-03-fp-ui1-correction.md), [61-row Human intake](playtests/2026-09-05-v021-ui-correction-intake.md), [feedback audit](reviews/2026-09-05-ui03-feedback-audit.md), [root review](reviews/2026-09-05-ui03-root-review.md), [modal-cost review](reviews/2026-09-05-ui03-final-modal-cost.md), [dialog review](reviews/2026-09-05-ui03-dialog-review.md), [inspiration research](reviews/2026-09-05-ui-inspiration-research.md).
5. [MOVE-01 contract](plans/MOVE-01-smooth-travel-and-camera.md), [earlier movement review](reviews/2026-09-05-move01-review.md); UI-03's later correction evidence supersedes earlier claims about first-tap quality.
6. Current v0.22.8 qualification in §2, [manifest](../release/HOLE-01A-v0.22.8-manifest.json), [acceptance](reviews/2026-09-06-v0228-engineering-acceptance.md), [receipt](../release/HOLE-01A-v0.22.8-release-verification.json) and [Sol final review](reviews/2026-09-06-hole01a-sol-native-final-review.md). Also read the [cumulative checklist](PLAYTEST_CHECKLIST.md), [feedback template](playtests/FP-UI1-feedback-template.md) and [release checklist](RELEASE_CHECKLIST.md).

Historical Agent 01 assignments and approvals remain evidence, not instructions to rerun them. UI-03 art additions reuse approved actors: 44 larger actor renditions, authorized Home alpha cleanup and contextual Tessera repair; field identities were retained. Consult publication/provenance records before any later asset work.

## 8. Rollback and recovery

| Checkpoint | Immutable source/release and artifact identity |
| --- | --- |
| v0.20.1 baseline | Runtime `d6b11c026ead3d75565e10490c10307a5a14cfd0`; annotated tag object `04a1f40dd649469db7420828e4159ed0b0bfc1b3` peels to docs receipt `4bca5322b6026e6a03a5b5a0f8e44aac1655d58a`. [Public release](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.20.1) ID `382945842`. Portable 160,436,224 bytes, SHA-256 `1ff30c2d5f58a60a2d4fad44443a1d61d5a3b7df66d4a96e86858e725d2b8777`; installer 154,642,433 bytes, SHA-256 `09208147ae5ffb7ded0640257b6978adb9a79210619e469f821d9d055757f143`. |
| v0.21.0 rejected | Source `2924fd73f60229dd244eeba21c05f66afb4eb8b0` in GitHub history. Local `release/Maze-so-Puzzle-0.21.0-FP-UI1-2924fd7-portable.exe`, 165,352,448 bytes, SHA-256 `9d353f8b055afb883da5cb2bf4f51f7fea669279ed4e946a0acf4e7c69be000c`. **No public tag/release**; historical planned download links are unpublished drafts. Source recovery is cross-device; this local binary is not. |
| v0.22.0 rollback | Frozen `68e303da680d5aec0ba71154949c5a2a0d1697ae` and [immutable prior release](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.22.0). Withheld same-version `2f8fa6a` (Home clipping) and non-locked `68e303d` binaries are not approved substitutes. |

Current v0.22.8 and immediate v0.22.7 fallback identities are in §2, followed by earlier releases. Close the preview before switching binaries; the unchanged FP-UI1 namespace shares progress. v0.22.8 rules3 intentionally restarts older-rules unfinished campaign/generated mazes with the update notice; durable progress survives and bests become historical. The v0.22.6 presentation marker/boosted SFX retain their older-downgrade caveat. Never clear Human saves, restore only the old traversal loop or promise arbitrary downgrade safety. Fresh full-art validation needs the recorded ignored-proof/EOL repair; a clone alone currently lacks those ignored historical proofs.

Historical Vercel identities: v0.20.1 `6tAUShfZgbNfnNhcCkCjAjrbMmGi`; v0.21.0 `5MHu8ECwrntLAkCDczWQGun5STib`. Do not confuse those recorded deployments with today's canonical URL or promise their permanent availability.

Use an isolated checkout for historical source; never reset shared main/user work. Preserve and privately back up app profiles before comparisons. FP-UI1 v0.21/v0.22 use `com.ame.mazesopuzzle.preview.fpui1`; v0.20.1 uses `com.ame.mazesopuzzle.preview`. Executable folders do not isolate saves. Do not run older code against newer saves without a recovery plan.

## 9. Sol–Astra collaboration protocol

- The Human can switch **GPT-5.6 Sol / GPT-6 Astra** in this shared task. Under
  their continuing self-organization authorization, an explicitly selected actual
  Sol/Astra model may also take a bounded delegated turn. Record model, scope and
  reviewed evidence; never label a same-model audit as the other model's opinion.
  Repository records carry decisions across tasks/devices.
- Both models own the product outcome. Sol's proposed next emphasis is player experience/UI; Astra's is performance/input/technical risk. These are task assignments, not permanent restrictions or claims of inherent model superiority.
- Use **one proposes → the other independently challenges → reconcile → name one writer**. Do not require two full planning rounds for routine fixes. Record disagreements and their resolution; review actual returned code/evidence before asserting consensus.
- **Only one runtime writer.** Name the execution owner and paths; other agents
  review read-only or work on separately owned documentation. ART-HOTFIX-01 is an
  actual GPT-5.6 Sol isolated candidate with parent Astra review, not an invented
  Sol assessment. The latest Human instruction permits this work while they sleep.
- The Human governs vision, final family/visual/play-feel acceptance and material scope choices. The models lead routine implementation and tell the Human the next useful action. Claude is an occasional bounded independent reviewer, not an implementation resource or mandatory reviewer of every output.
- Before a handoff, update this state, owned backlog/evidence and the joint ledger, inspect exact diffs, run proportionate checks, commit/push a meaningful reviewed checkpoint and verify remote agreement. Preserve unrelated work and immutable release/source-art records.
- Use existing harnesses; do not weaken tests to hide failures. Run expensive browser/art/solver/build work serially on this memory-constrained host and distinguish host contention from product regressions.
- Responses identify the active model (`# Astra:` or `# Sol:`), name the next
  owner/action, and end with the cumulative playtest and Human-decision links.
  Continue safe queued work while physical results are pending; Astra evaluates
  them when supplied. Do not create/resume historical specialist tasks.
- The independent Human/Opus review is complete. No runtime or Agent 04 launch occurred during either documentation turn. A fresh task can resume from this file without reconstructing the conversation.
