# Family playtest checklist

Updated: 2026-09-06. Owner: Sol/Astra orchestrators.
The Human will test when available; safe development continues meanwhile.
Keep completed observations and build identities when newer builds arrive.

## Start here

- [Play online](https://maze-so-puzzle.vercel.app/) — this address follows the
  latest deployment; note the version shown before reporting.
- **Current: v0.22.7 AUDIO-01A**, frozen
  `9b822281197c9e9e65a8c9467fe5bd578dce1cbd`. Web and Windows are published;
  all four release downloads are independently verified. **P11 is the new music-
  readiness check**; P5–P10 remain cumulative.
  [Download Windows](https://github.com/MachineKomi/maze-so-puzzle/releases/download/v0.22.7/Maze-so-Puzzle-0.22.7-AUDIO-01A-9b82228-locked-portable.exe) ·
  [Short playtest note](../release/AUDIO-01A-v0.22.7-PLAYTEST.md) ·
  [Publication receipt](../release/AUDIO-01A-v0.22.7-release-verification.json).
- **Fallback: v0.22.6 AUDIO-01V2**, frozen
  `e628898bb4e501034f184a7a92c9e5e6d2b7a4aa`, is engineering-accepted and web-
  published. **Windows is published with all four downloads independently
  verified**. P10 is ready on either platform. [Download Windows](https://github.com/MachineKomi/maze-so-puzzle/releases/download/v0.22.6/Maze-so-Puzzle-0.22.6-AUDIO-01V2-e628898-locked-portable.exe) · see its
  [playtest note](../release/AUDIO-01V2-v0.22.6-PLAYTEST.md) and
  [frozen manifest](../release/AUDIO-01V2-v0.22.6-manifest.json) and
  [publication receipt](../release/AUDIO-01V2-v0.22.6-release-verification.json).
- v0.22.5 V22-PHONE1, frozen `7282665f8631051785176b701b1a7f14b7fe24a3`:
  Web and Windows published; final native checks and all four public downloads
  independently verified. Compact gameplay/Book and native Title Exit are the
  new P9 checks. [Download Windows](https://github.com/MachineKomi/maze-so-puzzle/releases/download/v0.22.5/Maze-so-Puzzle-0.22.5-V22-PHONE1-7282665-locked-portable.exe)
  · [Short playtest note](../release/V22-PHONE1-v0.22.5-PLAYTEST.md).
- [v0.22.4 Windows release](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.22.4)
  — stationary rescue, plus inherited Dolphin repair, speeds and audio levels.
  Published; all four downloads independently byte/hash verified.
  The [v0.22.4 playtest note](../release/V22-RESCUE1-v0.22.4-PLAYTEST.md)
  has instructions/checksums. This remains an older rollback; on v0.22.4
  close Windows with X or Alt+F4 because its title Exit can leave the window open.
- [Decisions/steer list](HUMAN_DECISIONS.md) — no blocking answer needed today.

You do not need to complete everything in one sitting. The affected iPad movement
comparison remains open; P11 is the new readiness check and P5–P10 remain
cumulative. v0.22.7 changes music readiness, not camera/FOV, saves, gameplay or content.
Please do not clear game data to create a cold test; preserving your progress
is more important.

**Save compatibility:** all sixteen old-rules unfinished campaign saves restart
through updated-maze messaging in v0.22.4. Durable completions, unlocks, earned
friends, rewards and currency survive; old bests remain historical. v0.22.5 adds
no further unfinished-run restart. Close older Windows builds before using this
one; they share a save namespace.

## Build register

| Build | Available / scope | Requested checks |
| --- | --- | --- |
| v0.22.0 | Prior release; reported phone still showed this version when BGM became prompt | Audio observation below is useful context, not a v0.22.1 performance result. |
| v0.22.1 V22-PERF1, runtime `8442b79` | Published web/Windows performance and input preview | P1–P4 below. Music, speeds, stationary rescue and Dolphin pixels are unchanged. |
| v0.22.2 V22-CAMERA1, runtime `820ed39` | Published web/Windows camera-origin experiment | P1 is the priority: Maze 2 iPad taps and scenery scrolling. P2/P4 regression checks as convenient. No new audio, pace, rescue, Dolphin or phone-UI change. |
| v0.22.3 V22-COMFORT1, runtime `b834a8e` | Web/Windows comfort preview: Dolphin field repair, Chill/Regular/Zippy and independent Music/SFX | P5/P6/P8; P2/P4 regression as convenient. No camera or stationary-rescue fix claimed. |
| v0.22.4 V22-RESCUE1, runtime `45d8437` | Published web/Windows. Stationary rescue with unchanged steps and deliberate follow-up movement | P7 first; P5/P6/P8 remain cumulative. Not a new camera/phone-layout/audio-default fix. |
| v0.22.5 V22-PHONE1, frozen `7282665` | Published web/Windows; all four downloads verified. Bounded compact gameplay/Book and native Title Exit | P9 new; P5–P8 cumulative. No camera/FOV/audio/save/gameplay/content change or additional restart from v0.22.4. |
| v0.22.6 AUDIO-01V2, frozen `e628898` | Engineering/native accepted; web/Windows published with all four public downloads verified | P10 now; P5–P9 remain cumulative. No iPad camera fix or completed readiness/mastering. |
| v0.22.7 AUDIO-01A, frozen `9b82228` | Web/Windows published; four public downloads verified. Prepare one next song, confirmed fades and bounded fallback/recovery | P11 new; P5–P10 cumulative. Not final physical/hidden-page/acoustic/mastering or iPad camera acceptance. |

## Specific checks and results

### Received — Human's quick v0.22.1 web test, 2026-09-05

Original feedback: [v0221-playtest-feedback.md](user-playtests/v0221-playtest-feedback.md),
preserved without editing. Phone: movement felt buttery smooth and improved;
music prompt; known compact-phone UI issues remain. Eighth-generation iPad,
32GB **storage**: Maze 1 smooth; movement severely laggy from Maze 2, including
single steps. Menus, door/battle/rescue/pickup presentation and BGM were reported
responsive. Windows was not tested because the Human had not found its download.

Later clarification: minimum graphics/motion settings helped only slightly;
the iPad movement remained poor. The phone is a Samsung S25 Plus or similar.
See the [follow-up record](user-playtests/2026-09-05-v0221-graphics-minimum-follow-up.md).
This is meaningful physical evidence, not a blanket mobile pass. Exact iPadOS,
browser/home-screen mode and named Quality/Motion values were not supplied. The
iPad movement gate **failed this observed run**; prioritize V22-PERF-02 camera/
moving-scene isolation. Do not ask the Human to reproduce the already-reported
failure before implementation can proceed.

### P1 — Movement on the affected iPad (highest value)

For **v0.22.2**, begin with Maze 2 (Shiny Sword), not only a
late 23×23 level: ordinary straight movement, frequent turns and a single tap.
Report whether the maze scrolling and Ame's movement now feel coordinated. If
convenient, compare early edge-clamped movement with movement where the scenery
scrolls. Optional short route from a fresh Maze-2 start: Left, Left, Up, Up
stays in the clamped-camera area; the next Up starts scenery scrolling. Compare
Down/Up there if convenient. Do not reset an existing run just to perform this.
Then, in the same large maze with about five followers, compare:

- [ ] Full quality + Full motion, first entering and after several minutes.
- [ ] Lite quality + Full motion.
- [ ] Lite quality + Reduced motion.

Report each as smooth/responsive, better but still stuttering, or poor. Notice
straight holds, frequent turns and whether it worsens as you play through mazes.
Include iPad model, iPadOS, browser/home-screen app, charging/Low Power Mode and
rough play duration. A short natural session is useful; a longer session can
come later. v0.22.1's reported iPad run failed; the individual settings comparison
and any successor-build acceptance remain pending.

v0.22.2 outcome received 2026-09-06: **camera smoothness remains unfulfilled**.
Human reports no obvious regression and possibly slight improvement; Ame and
animations are buttery smooth while the camera is clamped, but scrolling still
stutters on iPad. Desktop browser does not show that symptom. Possible thin lines
are uncertain, not a confirmed regression. [Verbatim feedback](user-playtests/v0222-playtest-feedback.md).
No other checklist item is implicitly passed. Do not repeat this failed build
just for us: the next useful P1 comparison needs an identified successor or
bounded diagnostic. Next isolate moving terrain/filters at unchanged camera,
FOV and cadence. Pace is a separate comfort feature, not a claimed camera repair.

### P2 — Holding through interactions

- [ ] Hold into a door, successful battle, rescue and Spring jump as encountered.
  Does movement resume if you are still holding, and stop if you release?
- [ ] Try changing direction during the animation. Does the next movement match
  what you intend, without an extra queued step?
- [ ] On laptop, try touch/drag pad then keyboard or board control. Does the old
  pad release cleanly? No need to force this if your device cannot combine inputs.

Historical v0.22.1–3 rescue moved into the cage tile. v0.22.4 changes this; use
P7 alongside these held-input checks. Physical acceptance remains pending.

### P3 — Music timing (historical observations; v0.22.7 comparison at P11)

- [ ] Listen during Title/Home → Story → Maze → Victory → Book on phone,
  iPad or laptop when convenient. Which transitions have silence or late music?
- [ ] Does a first visit differ from revisiting the same screen/track? Does
  returning after backgrounding differ? Note the displayed build version.
- [ ] At victory, was music ready as the scene appeared? Was the win sound heard?
  Does a held movement finishing the maze behave differently from a single tap?

Phone v0.22.0 prompt playback and the new v0.22.1 phone/iPad prompt playback are
recorded as positive; the cause remains unknown. Remembered laptop victory silence
remains a physical listening gate. No audio-code fix is claimed in v0.22.1.
AUDIO-01A now ships in v0.22.7; P11 gives the build-specific comparison.

Audio balance follow-up, 2026-09-06: the Human already reports very quiet iPad
SFX against music at low system volume; phone/laptop/Windows are broadly balanced.
No need to reproduce that observation now. Independent Music/Sound effects
sliders are delivered as AUDIO-01V in v0.22.3. See P8 below. They were not
available in v0.22.2; timely cross-screen BGM handover is still separate AUDIO-01A.

### P4 — Laptop comparison and ordinary recovery

- [ ] Web and Windows app: smooth holds/turns, then close normally and reopen.
  Does the same saved maze return without lost progress or extra movement?
- [ ] Any regression in the already-liked desktop/iPad layout? Report device,
  maze and version; screenshots/video are optional, not a prerequisite.

### P5 — Dolphin field repair (v0.22.3)

- [ ] Find Tessera Dolphin (Maze9, Springstep Sky Hollow) in a cage, then as a
  follower. Are the coral tail and flippers complete instead of transparent?
- [ ] Does the Dolphin remain the expected size and position? Book/detail art
  should keep its already-correct appearance.

Available in v0.22.3; Human acceptance pending.

### P6 — Choose a comfortable pace (v0.22.3)

- [ ] Open Sound & comfort; cycle Movement pace: Chill, Regular, Zippy. Which
  suits Alex, Ame and you? Regular is the middle choice; Chill is slower, Zippy faster.
- [ ] Try single taps, holds and turns. No extra steps after release or bursts
  after a pause. Doors/battles/rescues should keep their own readable timing.
- [ ] Reopen: does the chosen pace persist? On iPad distinguish slower pacing
  feeling nicer from actual scenery scrolling becoming smooth. No camera fix claimed.

### P7 — Stationary rescue (v0.22.4)

- [ ] Tap into Maze1's unicorn cage (or any friend), then release. Ame stays
  visible beside it, cheers, rescues once and gains no movement step.
- [ ] Turn away, or move into the now-cleared tile. Existing followers should
  not collapse; the new friend joins from the cage.
- [ ] Hold into another cage, release or change direction during the effect.
  Does subsequent movement match your intention without an unwanted extra step?
- [ ] Close normally and reopen after rescue. Same new-rules run and rescued
  friend should return. No need to interrupt an animation deliberately.

These checks are ready for v0.22.4; no Human rescue acceptance is claimed yet.

### P8 — Device audio balance (v0.22.3)

- [ ] At comfortable low device volume, use separate Music/Sound effects sliders
  in Sound & comfort. Does lowering Music make pickups, doors, battles and rescues
  clear on iPad? Test sound is a convenient first check. Tell us preferred percentages.
- [ ] Mute/unmute, change levels while muted, and reopen. Levels should persist;
  moving a slider while muted must not unmute the game. A slider must not move Ame.
- [ ] Background and return, then tap normally. Any missing music, burst of old
  sound effects, or brief unwanted old song when your first action is Mute/Next?
- [ ] Phone/laptop/Windows: any new distortion, clipping, unwanted volume jumps
  or disrupted track playback? Defaults remain Music22% / Sound effects100%.

Received quick v0.22.3/24 feedback: sliders and three paces feel good; preferred
phone/desktop mix is old Music10%/SFX100%. Calibrated75/75 controls and visible
right-panel pace are queued, not in v0.22.5. The separate next audio slice follows
the [AUDIO-01V2 joint decision](reviews/2026-09-06-audio01v2-joint-decision.md).
iPad camera remains unsmooth; do not repeat the known failure just for us.
Possible phone pad/minimap overlap
and Sky Hollow floor/wall confusion are routed. [Full intake](playtests/2026-09-06-v0223-v0224-intake.md).

These are physical listening checks; automated gain measurements passed but do
not prove the balance through the iPad speakers. Do not buy new hardware for this test.

### P9 — Compact phone fit and native Title Exit (v0.22.5)

- [ ] On a landscape phone (especially 780×312, 844×390 or 568×320), can you see
  the whole board, full minimap including its heading, Friends/Bag, feedback and
  pad together? Try a rescue/long message: nothing should overlap or require
  page/deck scrolling, and the pad should remain easy to tap/hold/drag.
- [ ] In the Book, do the header and tabs stay fixed while only the collection
  body scrolls? Labels should not split words, and at least one complete card
  should fit. Report the tab and device if something is cut off.
- [ ] In the published v0.22.5 Windows download, try Title Exit by pointer,
  then by keyboard on another visit. Does the window actually close? Reopen and
  check the same saved run and Sound & comfort preferences return.
- [ ] On desktop/iPad, has the familiar board/HUD/Book placement stayed intact?

The bounded engineering candidates are accepted: [compact UI `840293d`, evidence
`517667d`](reviews/2026-09-06-ui01a-astra-review.md) and
[native Exit `19f08a1`](reviews/2026-09-06-ui-native-exit-01-astra-review.md).
Final native qualification/publication passed; physical P9 acceptance is separate.
Home/dialog/victory propagation, full 200% text coverage, visible HUD pace,
settings artwork and other optical refinements remain open; P9 does not close them.

### P10 — Calibrated Music/SFX balance (v0.22.6)

Frozen runtime: `e628898bb4e501034f184a7a92c9e5e6d2b7a4aa`. Engineering/native
acceptance and web/Windows publication passed, including all four independent
public downloads. Please try when convenient:

- [ ] Your existing volume choices should sound unchanged when you first open
  it, though the percentages may look different. Opening/closing Sound, changing
  pace/quality and reopening the app should not change the chosen balance.
- [ ] For the requested new balance, set **Music75% and Sound effects75%** in
  Sound & comfort. This corresponds to old Music10%/SFX100%. No Reset Progress
  is needed. Is it comfortable on phone, iPad, laptop web and Windows, especially
  at low device volume? Tell us which balance you prefer on each device.
- [ ] Adjust each slider independently; try Test sound, mute/change/unmute and
  zero. There should be no unexpected burst, click, track restart or lost choice.
  Above75% effects can get louder. If very high settings sound crackly, lower
  either slider; all-controls-maximum mixing is not yet finally mastered.

P5–P9 remain cumulative. This build does not change the iPad camera or close its
known stuttering issue. Physical listening is separate from engineering checks.

### P11 — Prepared music and confirmed fades (v0.22.7 AUDIO-01A)

Frozen runtime `9b822281197c9e9e65a8c9467fe5bd578dce1cbd`; web/Windows are
published and all four downloads verified. This row is ready when convenient.

- [ ] Home → Story → Maze → Victory → Book: does music arrive promptly with a
  pleasant short fade? At a win, listen for unwanted silence or a distracting
  tail from the previous song. First visits and later visits are both useful.
- [ ] Try Next, Previous and Shuffle, including two quick changes. The latest
  selection should take over without a pile-up, wrong song or loudness jump.
- [ ] Mute during a change, then unmute. Your balance should remain intact and
  no old effects should burst out. Background briefly, return and tap once if
  audio needs permission to resume; report persistent silence or wrong music.
- [ ] Windows: close normally and reopen. Same run and comfort choices return.

A short natural session on any convenient device is enough. Mention speakers
versus headphones and the scene if something sounds wrong. Media/graph checks
are not speaker measurements; physical iPad/Safari and all-range mastering are
still open. There is no new camera change, so do not repeat that known failure
just for this release. P5–P10 remain cumulative; no progress reset needed.

## Easy reply format

`Build / device / browser or Windows app / maze / settings / check ID / what I saw`

A few plain-language sentences are enough. We will transfer your feedback into
the build register, keep unresolved rows open, and tell you which new checks
matter next. Planned hole art, HUD pace placement and later sound design are added as
testable rows only when there is a concrete candidate/build to assess.
