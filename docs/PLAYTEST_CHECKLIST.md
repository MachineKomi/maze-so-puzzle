# Family playtest checklist

Updated: 2026-09-05. Owner: Sol/Astra orchestrators.
The Human will test when available; safe development continues meanwhile.
Keep completed observations and build identities when newer builds arrive.

## Start here

- [Play online](https://maze-so-puzzle.vercel.app/) — this address follows the
  latest deployment; note the version shown before reporting.
- [v0.22.1 Windows preview](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.22.1)
  — fixed comparison download, with the original playtest instructions.
- [Decisions/steer list](HUMAN_DECISIONS.md) — no blocking answer needed today.

You do not need to complete everything in one sitting. The affected iPad movement
comparison below is the most useful first check. Please do not clear game data
to create a cold test; preserving your progress is more important.

## Build register

| Build | Available / scope | Requested checks |
| --- | --- | --- |
| v0.22.0 | Prior release; reported phone still showed this version when BGM became prompt | Audio observation below is useful context, not a v0.22.1 performance result. |
| v0.22.1 V22-PERF1, runtime `8442b79` | Published web/Windows performance and input preview | P1–P4 below. Music, speeds, stationary rescue and Dolphin pixels are unchanged. |
| ART-HOTFIX-01 successor | In development; no new build claimed here yet | P5 becomes testable only after its exact build/link is recorded. |

## Specific checks and results

### P1 — Movement on the affected iPad (highest value)

In the same large maze with about five followers, compare:

- [ ] Full quality + Full motion, first entering and after several minutes.
- [ ] Lite quality + Full motion.
- [ ] Lite quality + Reduced motion.

Report each as smooth/responsive, better but still stuttering, or poor. Notice
straight holds, frequent turns and whether it worsens as you play through mazes.
Include iPad model, iPadOS, browser/home-screen app, charging/Low Power Mode and
rough play duration. A short natural session is useful; a longer session can
come later. Pending — no physical acceptance claimed.

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

Phone v0.22.0 prompt playback is recorded as positive; its cause is unknown.
Remembered laptop victory silence remains an open issue. No audio fix is claimed
in v0.22.1. AUDIO-01A will add a build-specific comparison when it ships.

### P4 — Laptop comparison and ordinary recovery

- [ ] Web and Windows app: smooth holds/turns, then close normally and reopen.
  Does the same saved maze return without lost progress or extra movement?
- [ ] Any regression in the already-liked desktop/iPad layout? Report device,
  maze and version; screenshots/video are optional, not a prerequisite.

### P5 — Dolphin field repair (wait for successor build)

- [ ] After ART-HOTFIX-01 is available, find Tessera Dolphin in a cage, then as a
  follower. Are the coral tail and flippers complete instead of transparent?
- [ ] Does the Dolphin remain the expected size and position? Book/detail art
  should keep its already-correct appearance.

Pending build; do not expect v0.22.1 to pass this repair check.

## Easy reply format

`Build / device / browser or Windows app / maze / settings / check ID / what I saw`

A few plain-language sentences are enough. We will transfer your feedback into
the build register, keep unresolved rows open, and tell you which new checks
matter next. Planned hole art, pace choices and later sound design are added as
testable rows only when there is a concrete candidate/build to assess.
