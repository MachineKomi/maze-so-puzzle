# v0.22.3 V22-COMFORT1 — final engineering acceptance

Owner/release decision: Astra, 2026-09-06. Exact frozen runtime:
`b834a8e6775ec024fc9f854c7a7ced8c096b6627`. Accepted for a versioned family preview;
physical iPad camera performance and listening/pace comfort are not accepted.

## Review chain and scope

The actual Sol reviewer independently accepted Tessera field repair, PLAY-A and
the final AUDIO-01V source after four audio corrections. Astra integrated and
verified them. Audio runtime is `9674814`; the final freeze changes coordinated
version fields and immutable-release checkout attributes only. Sol did not run
the frozen checks below; these are Astra's observed final release checks.
See [audio review](2026-09-06-audio01v-candidate.md) and
[pace acceptance](2026-09-06-play-a-astra-acceptance.md).

Delivered: corrected Dolphin field alpha, Chill/Regular/Zippy (320/200/120ms),
independent Music/SFX levels with unchanged 22/100 defaults and Test sound.
No camera repair, stationary rescue, phone UI overhaul, predictive BGM loading,
new game content, save-schema change or new dependency is included.

## Final observed checks

Fresh detached exact-source checkout: `C:/GameDev/maze-game-v0223-release`.
External evidence: `C:/GameDev/maze-game-qa/releases/v0223`.

| Check | Result |
| --- | --- |
| Locked npm install and production audit | Passed; zero vulnerabilities; locked Rolldown1.2.6 |
| Serial full project suite | 519/519 across50 files; 68.13 seconds |
| TypeScript and production build | Passed; repeated by native beforeBuild |
| Performance contract | Passed; JS gzip9 154875/154898; CSS23563/30280; public165031011/165031011 |
| Art validation / tests | Zero errors,429 disclosed historical warnings;136/136 tests |
| Locked Cargo check / optimized no-bundle build | Passed;2m35s /6m54s |
| Canonical production browser journeys | 12/12;58sec; saved runs, Home, Book, story/victory, movement and PLAY-A |
| Native WebView2 smoke | 152.0.4191.62; synthetic Maze2 run, sliders/mute/Test dispatch, Zippy, normal OS close/reopen twice; identical restored settings and7-step run; zero page errors |
| Exact-source CI | Browser build34001890372: verify and desktop success |
| Vercel production | Deployment6287529696; canonical raw HTML/JS/CSS exactly equal frozen dist |

The native portable is173424128 bytes, unsigned x64 PE, file/product0.22.3.
Source/stage/final SHA-256:
`3d1d2f5d1f00e3f94d4d7f5c5a7baf74485783d0ecca2c73baf808a29b042110`.
Native title Exit remains unqualified; smoke used actual OS X/Alt+F4.
No Human profile was read/copied/changed; fresh synthetic profiles were used.

The browser audio probe additionally verified Reset Progress preserves settings;
denying presentation storage leaves the new in-memory level effective and shows
the warning without silently changing the stored value. Settled graph-level RMS
proves attenuation, not perceived loudness through a physical iPad speaker.

## Rejected attempts and reproducibility

- First native smoke timed out waiting for root normal OS closure during context
  recovery. Its partial evidence remains `native-failed-2026-09-06T00-45-33.722Z.json`.
  It is not a pass. Root normally closed the owned app, then attempt r2 used a new
  synthetic profile and completed both real close/reopen checks.
- First art checks failed because Windows checkout converted the manifest's
  exact LF prompt input to CRLF. A partial normalization still failed. Final full
  line-ending-only normalization matched the already-recorded152455-byte hash
  `57d8bce4969893401a8e053d56091c31f612778d4611d03cea2cef3332b62cc3`.
  No manifest authority, prompt content or art was changed. Final r3 check passed.
  Explicit prompt/HTML LF attributes are added only in the later docs checkpoint.
- Art proof checks use preserved external/ignored v14 proof inputs. Git contains
  compact records, not every raw proof or private test profile.

The release manifest binds actual logs, machine records and this observation
summary by SHA-256. This summary is not a fabricated raw test transcript.

## Open gates and next owner

Family P5/P6/P8: Dolphin silhouette, preferred movement speed, physical low-volume
mix and mute/background recovery. Check first post-interruption Mute/Next for an
unwanted brief old-track fragment. iPad scrolling remains a separate failed gate.
No installer/signing/clean-machine/offline/sustained-performance qualification.
No answer is needed before further bounded work. PLAY-B stationary rescue is next,
subject to its independent preflight; V22-UI-01 and AUDIO-01A remain queued, with
PERF-02 moving-terrain experiments separately controlled. Only one runtime writer.
