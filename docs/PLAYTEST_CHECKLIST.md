# Family playtest checklist

Updated: 2026-09-06. Owner: Sol/Astra orchestrators.
The Human will test when available; safe development continues meanwhile.
Keep completed observations and build identities when newer builds arrive.

## Start here

- [Play online](https://maze-so-puzzle.vercel.app/) — this address follows the
  latest deployment; note the version shown before reporting.
- [Download the v0.22.3 Windows portable](https://github.com/MachineKomi/maze-so-puzzle/releases/download/v0.22.3/Maze-so-Puzzle-0.22.3-V22-COMFORT1-b834a8e-locked-portable.exe)
  — Dolphin repair, movement speeds and separate audio levels. Its
  [release page](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.22.3)
  has instructions/checksums. Close Windows with X or Alt+F4; the title Exit
  button has a separately queued native-window issue.
- [Decisions/steer list](HUMAN_DECISIONS.md) — no blocking answer needed today.

You do not need to complete everything in one sitting. The affected iPad movement
comparison remains open; for v0.22.3, P6 pace and P8 audio are most useful.
This build does not change the camera. Please do not clear game data
to create a cold test; preserving your progress is more important.

## Build register

| Build | Available / scope | Requested checks |
| --- | --- | --- |
| v0.22.0 | Prior release; reported phone still showed this version when BGM became prompt | Audio observation below is useful context, not a v0.22.1 performance result. |
| v0.22.1 V22-PERF1, runtime `8442b79` | Published web/Windows performance and input preview | P1–P4 below. Music, speeds, stationary rescue and Dolphin pixels are unchanged. |
| v0.22.2 V22-CAMERA1, runtime `820ed39` | Published web/Windows camera-origin experiment | P1 is the priority: Maze 2 iPad taps and scenery scrolling. P2/P4 regression checks as convenient. No new audio, pace, rescue, Dolphin or phone-UI change. |
| v0.22.3 V22-COMFORT1, runtime `b834a8e` | Web/Windows comfort preview: Dolphin field repair, Chill/Regular/Zippy and independent Music/SFX | P5/P6/P8; P2/P4 regression as convenient. No camera or stationary-rescue fix claimed. |

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

Current v0.22.1 rescue still moves into the cage tile. Its separately requested
stationary-rescue correction is pending; report only unexpected input behavior
here. Pending.

### P3 — Music timing (observations, correction pending)

- [ ] Listen during Title/Home → Story → Maze → Victory → Book on phone,
  iPad or laptop when convenient. Which transitions have silence or late music?
- [ ] Does a first visit differ from revisiting the same screen/track? Does
  returning after backgrounding differ? Note the displayed build version.
- [ ] At victory, was music ready as the scene appeared? Was the win sound heard?
  Does a held movement finishing the maze behave differently from a single tap?

Phone v0.22.0 prompt playback and the new v0.22.1 phone/iPad prompt playback are
recorded as positive; the cause remains unknown. Remembered laptop victory silence
remains an open issue. No audio-code fix is claimed in v0.22.1. AUDIO-01A will
add a build-specific comparison when it ships.

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

### P7 — Stationary rescue (not yet shipped)

PLAY-B will add a build-specific check when Ame remains beside a cage throughout
rescue, then either turns away or moves forward on the next accepted input.
v0.22.3 still has the previous rescue behavior; do not retest it as a correction.

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

These are physical listening checks; automated gain measurements passed but do
not prove the balance through the iPad speakers. Do not buy new hardware for this test.

## Easy reply format

`Build / device / browser or Windows app / maze / settings / check ID / what I saw`

A few plain-language sentences are enough. We will transfer your feedback into
the build register, keep unresolved rows open, and tell you which new checks
matter next. Planned hole art, pace choices and later sound design are added as
testable rows only when there is a concrete candidate/build to assess.
