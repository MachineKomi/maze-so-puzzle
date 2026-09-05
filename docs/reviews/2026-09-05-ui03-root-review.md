# UI-03 — root integration and release review

Date: 2026-09-05. **v0.22.0 FP-UI1 is published and technically verified for family
playtesting. Human acceptance remains open.** This report supersedes the engineering assessment of
v0.21.0 for current UI work. The Human rejected that build's visual result, and
its earlier automated passes remain historical evidence, not family acceptance.

## What the correction changes

The title and Home are composed around their approved illustrations: large
logo/actions on the left and Home's cast on the right-hand path. The grouped
menu remains. Existing Fredoka type now has substantial body weight, with
warmer gradient controls, soft depth and restrained keyboard focus. The two
authorized Home matte islands are removed through the approved exact mask.

Gameplay has one maximum useful square board at the existing six-tile view.
Big/Normal is removed. The deck restores Ame's portrait/Power, larger picture
groups and a bottom-right directional pad. Status art uses cages/fading/full
colour without the rejected little ticks or question badges. Feedback has a
stable home; actor acting no longer scales the board. Uncollected reward
amounts are gone; collected Power arithmetic remains readable.

Single taps and held steps share a 160ms interval. The first step no longer
uses the old short tap duration followed by a long repeat pause. A shared
actual-callback animation clock moves the player, camera and corridor followers;
terrain receives a stable memoized world window. Ame's pronounced hop is
replaced by restrained acting. Exact tile rules, legal corners, portal/jump
handoffs and interruption rules remain protected.

The Book has five pages, spacious keepsake cards, grey locked achievement art,
large contextual friend/guardian art and original concise lore. New bestiary
records are truthful normal-play encounters. Schema 6 migrates old saves without
inventing encounters; future-schema profiles and their active-run bytes are
protected from incidental writes. No engine rules, campaign content, currencies
or reward receipts were changed by this correction.

Stories use circular medallions and coherent single/multi-turn actions. Their
non-control surface and Enter advance without requiring button refocus. Simple
acknowledgements do not have duplicate X actions. Frosted dialogs, larger detail
art, quick mute and Sound & Comfort are integrated. Victory restores finite
confetti and 32 authored friend dance signatures with reduced/static alternatives.

## Authority, review and traceability

- Full Human intake: `../playtests/2026-09-05-v021-ui-correction-intake.md`,
  UC-01–UC-61. The companion `2026-09-05-ui03-feedback-audit.md` maps every row
  to implementation and evidence, with explicit limitations.
- Plan: `../plans/UI-03-fp-ui1-correction.md`. Official reference research and
  the movement reasoning are in `2026-09-05-ui-inspiration-research.md`.
- Root integrated disjoint fresh agents under the Human's explicit parallel
  authorization, reviewed actual source and screenshots, and serialized heavy
  checks on this 8GB host. Future specialists start fresh tasks.
- Exact art decisions, proofs, source hashes and per-file ceilings are in
  `../source-assets/publication/ui-correction-art-delivery-request.json`.
  Approved identities/field pixels remain unchanged. The 47 new delivery files
  total 8,008,395 bytes; 512px art is demand-loaded for contextual views.

Original Human comparison files are archived byte-exactly at
`C:/Users/hellb/Documents/Maze so Puzzle/review-evidence/2026-09-05-ui03-human-comparison/`.
Raw browser evidence stays outside Git; maintained reports preserve results,
source identity, commands and relevant limitations.

## Verification record

This section records failed attempts as well as later corrections. A later
pass qualifies only the source and scenario actually exercised.

| Check | Current evidence |
| --- | --- |
| Project suite | 488 tests in 49 files passed with `npm test -- --maxWorkers=2`; final runtime run took45.68s. The earlier default run timed out one pure campaign solver test at its unchanged 5s timeout under host contention (487 passed); no gameplay assertion failed. Exact-source default CI remains required. |
| Production build | TypeScript and Vite passed for v0.22.0. Final source fingerprint/bytes are recorded after the last correction. |
| Full browser r4 | 49/62 passed. Rejected primary/compact overflow, stale minimap-spacing assertions, derived missing proof sheet and DPR-only fallback recovery. No failed row is treated as accepted. |
| Movement r4 | All 17 MOVE checks plus UI03 first-tap/hold, pad cancellation, secondary-touch, Story/Enter, ordinary discovery and future-profile preservation passed. |
| Geometry r5 | 9/17 passed after corrections; all six UI03 landscape cases and the longest five-friend ordinary victory passed. Busy maze12/legacy geometry exposed remaining deck and enlarged-text issues, corrected and passed in r6. |
| Final production r6 | 62/63 passed in8.9m: every layout/text/DPR/image/input/Book/story/victory check passed. One reduced-rescue setup observation raced its150ms lifetime before the full jump handoff. The test observer is now armed before input; r7 targeted retest passed all five interaction/save cases in54.4s. |
| Art | Canonical proof regeneration and art validation passed: zero errors, 430 classified warnings (420 existing plus ten new proof/master evidence records). Final131 art unit tests passed in146.278s. An earlier130/131 run rejected a stale v04 Home expectation; the six-test group and final full suite passed after aligning it with the authorized v05 pointer. Updating that pipeline test invalidated the canary/index; normal proof and manifest regeneration restored the final zero-error check. |
| Desktop compilation | `npm run check:desktop` passed locked Cargo for0.22.0 in28.46s. Actual portable packaging/journeys remain separate. |
| Proof/geometry r8 | All17 UI overhaul checks passed in2.2m after fixing the DEV-only proof host; root inspected the regenerated full-material reference. Production JS/CSS filenames and bytes remain identical to r6. |
| Static release gates | Performance contracts, exact JS/CSS/public budgets and all3 maintained evidence files passed. Production dependency audit: zero vulnerabilities. Publication/artifact identity follows separately. |

R4 evidence:
`C:/Users/hellb/Documents/Maze so Puzzle/review-evidence/2026-09-05-ui03-full-r4/`.
R6 evidence:
`C:/Users/hellb/Documents/Maze so Puzzle/review-evidence/2026-09-05-ui03-full-r6/`.
R5 evidence:
`C:/Users/hellb/Documents/Maze so Puzzle/review-evidence/2026-09-05-ui03-geometry-r5/`.
R7 movement/setup-observer recheck:
`C:/Users/hellb/Documents/Maze so Puzzle/review-evidence/2026-09-05-ui03-recheck-r7/`.
R8 final UI/reference proof:
`C:/Users/hellb/Documents/Maze so Puzzle/review-evidence/2026-09-05-ui03-proof-r8/`.
Actual dialog compositions and animation review are detailed in
`2026-09-05-ui03-dialog-review.md`.

Root directly inspected r4 Title/Home at desktop, iPad, minimum window and
568px landscape; Sprig's intro at iPad/568px; and the iPad Book spread. The
logo/actions occupy the illustration's left negative space, the cast remains
on the right path, and primary controls are visibly large and substantial.
Home retains its tidy panel without covering the cast. Sprig's round medallion,
heavier story copy, one Start and blurred/glowing backdrop address the specific
comparison; the long intro has an accessible reader on the shortest phone.
The Book's tabs, spacious coloured cards and paper/spine treatment are materially
different from the cramped v0.21 page. The rejected r5 HUD screenshots were
also inspected: oversized map/collection tracks genuinely pushed controls below
the deck. Root rejected those compositions and reviewed the corrected real-maze results.
R6 now passes those strict geometry/content checks. Root inspected final iPad/
desktop busy decks, both compact safe-area captures, grey Book keepsakes, long
DPR2 equipment detail, full-motion ordinary victory and longest five-friend
1024px victory. The latter has all story/reward/action content visible. Root
also found a broken standalone DEV component rack in the generated proof sheet;
that fixture was corrected independently of the passing actual gameplay and its regenerated r8 reference was inspected.

Before native preview testing, root made and hash-verified a local backup of the
existing FP-UI1 WebView profile (317 files, 32,744,117 bytes). It is private local
rollback evidence under the v0.22.0 release-evidence directory, never a release
asset. Existing profile contents were not reset or deleted.

The lightweight r6 first-tap/held sample recorded no callback intervals above
50ms; maxima were35.1ms and23.9ms respectively (held p95:21.6ms). Heavy trace/LongTaskObserver
instrumentation was disabled in that cohort after the inspector itself caused
a 132ms callback inside a 242ms task. Empty diagnostic arrays do not establish
zero long tasks. These measurements are browser observations, not universal
frame-time qualification or a substitute for physical iPad comfort testing.

## Deliberate compact and accessibility differences

Landscape is the authored mode; portrait gives a rotate invitation and safely
pauses interaction. Compact phones keep objective, map, status pictures and a
48px-sector thumb pad, while secondary actions/details move into More. At the
smallest 568px landscape, currency art and decorative metadata are reduced or
hidden; this does not qualify identical desktop art scale or couch readability.
The smallest568px layout reserves a352px deck and about204px board (188px with
12px insets), with24px noninteractive status pictures. The dense1194px iPad
case fits62px collection pictures and164px map;1920px fits92px and380px. These
are deliberate content/control tradeoffs, not universal promises of a larger map.
Primary landscape keeps direct mute; compact gameplay places mute in More,
taking two actions. Root accepts this compact hierarchy for the preview.
Compact feedback uses the readable map toast rather than an extra deck row.
Its geometry remains independent of notification contents.

Ordinary victory fits the tested landscape targets. Short layouts retain the
full outro, parade, award/total, arithmetic, keepsake art and 48px actions, while
decorative praise/greetings/metadata are selectively absent visually. Enlarged
text and long Help content retain accessible independent reading scroll instead
of clipping text to claim literal no-scroll compliance. These distinctions are
recorded explicitly for Human review.

## Final static allocation

The r6 production measurement is152,377 gzip9 JS /23,099 CSS /164,988,031 public
bytes. Root reviewed the additional layout/DPR correction code and raised only
the UI03 JS allowance from7,100 to7,950 bytes: final JS ceiling152,557 leaves180
bytes of compression variance. CSS stays below30,227 and public bytes exactly
match the separate reviewed allocation. No new library is added. The bytes do
not certify blur/compositing or low-end performance.

## Release and next owner

### Native candidate rejection and Home correction

The first clean candidate, `2f8fa6a927618885f2b34ff170046961d2d9c08c`, passed
GitHub verify/desktop and produced a versioned portable. Root's actual WebView2
journey then exposed clipped Home progress labels and a scrollbar at the default
1280×720 client size with a saved Continue subtitle. That portable is preserved
as a **withheld attempt**, not a published release. Passing browser checks did
not cover this exact composition and did not override the native finding.

Home now sizes its menu row from content and gives the logo the remaining space.
The narrowest landscape composition uses a little more menu width and smaller
gaps, retaining 48px actions. Root inspected the corrected 1920×1080,1280×720 and
568×320 screenshots. Both new production regression tests passed in28.2s (r9):
fresh and valid engine-produced saved35-step states across seven landscapes,
each at normal size and200% text plus spacing. Normal menus have no scrolling
or clipped labels; enlarged text remains accessible through the bounded reader.
TypeScript/Vite and static gates passed again:152,377 gzip9 JS,23,130 CSS,
164,988,031 public bytes. No other runtime source changed in this correction.

Before replacing the candidate, root verified native save migration/resume,
one keyboard step (35→36), Hint movement isolation, Sound & Comfort, a large
Puppy card, Book/Bestiary, story replay/Enter with unchanged36-step run, and the
960×540 minimum client layout. The earlier resize attempts did not change the
height and are not minimum-layout evidence; `15-supported-minimum-960x540`
is the successful capture. All raw native captures remain under the private
release-evidence directory. Replacement-source native Home and release receipts
are still required below.

### Locked-toolchain provenance correction

The corrected `68e303d` candidate then passed native Home,37-step save/reopen
and six canonical-web journeys. Strict entry-byte comparison nevertheless found
a seven-byte JavaScript difference (CSS was identical). Investigation found
local installed Rolldown1.2.7/Oxc0.148.0 versus committed lock1.2.6/0.147.0;
the source was clean but installed build dependencies were not lock-identical.
The differing Boolean rewrites were not used as a waiver. Root withheld that
portable as well, preserved its bytes and observations, ran `npm ci`, and
restored the exact committed toolchain without changing the lockfile.

The final handoff uses the distinct
`Maze-so-Puzzle-0.22.0-FP-UI1-68e303d-locked-portable.exe` filename. Previous
source-qualified candidate files remain untouched. Release qualification requires
the locked rebuild, exact local/canonical JS/CSS parity, current native checks
and downloaded release-asset comparison. The initial mismatch diagnostic remains
in `web/entry-mismatch-2026-09-05T09-48-15-651Z.json`; earlier passing observations
remain candidate evidence rather than false lockfile provenance.

The immutable preview is **v0.22.0 FP-UI1**. Its frozen manifest and PLAYTEST
note identify the clean source, Windows bytes, web deployment, CI and
verified journeys. Existing v0.20.1/v0.21.0 files remain untouched. The Windows
FP-UI1 profile is retained and remains separate from the older v0.20.1 profile.

Family material/readability/comprehension, actual iPad/Safari touch and comfort,
screen-reader speech, controller/couch use and qualified low-end timing remain
Human/device checks. This report does not claim perfection or Human acceptance.
After feedback passes, root records that evidence and completes the prepared
fresh Agent04 lighting prompt. No specialist starts automatically.

### Final locked artifact and native result

The release runtime is `68e303da680d5aec0ba71154949c5a2a0d1697ae`.
After `npm ci`, the final 488 project tests passed in 55.85s. The locked local
production browser cohort passed all six focused journeys in 46.793s; the
canonical deployment passed the same six in 52.006s. These supplement r6/r7/r8
and the r9 Home regressions rather than pretending the earlier failures did
not happen. Locked optimized Cargo packaging completed in 3m08s.

The final portable is 173,378,560 bytes, SHA-256
`b230c5681806737e884e1638fce0fdadf1a3155952e35cc5d73b8b76bdf77329`, with
PE file/product version 0.22.0. Its distinct `-locked-portable.exe` name is
mandatory: neither withheld candidate is interchangeable with it.

Root inspected the actual locked Windows title and saved Home at 1280×720,
resumed a 37-step run, and made one Down input to 38 steps. Hint displayed the
readable frosted card with one acknowledgement; Escape returned to the same
position and counters. A normal close/reopen retained all observed progress,
inventory and rescue state at 38 steps. Resizing the final executable to the
supported 960×540 client retained the board, objective, status art, map, thumb
pad, Hint and More without clipping or a position change. Captures 30–37 and
the locked native summary bind these observations to this exact artifact.
Snapshot evidence proves settled results; browser movement sampling supplies
the separate timing evidence. No physical iPad or native frame-time guarantee
is inferred from these checks.

Exact-source CI run [33958357582](https://github.com/MachineKomi/maze-so-puzzle/actions/runs/33958357582)
passed both verify and desktop. Canonical entry JS/CSS is byte-identical to the
locked production build, and all 47 new art delivery files passed HTTP/hash
checks. Final gzip9 is **152,379 JS / 23,130 CSS / 164,988,031 public bytes**;
the JS ceiling leaves 178 bytes. The earlier section records r6's measurement.

The frozen manifest, playtest note and checksums identify the release. The
later [publication receipt](../../release/FP-UI1-v0.22.0-release-verification.json)
records GitHub publication and all four public-download hash comparisons.

### Final bounded modal and Static review

The last acceptance review identified UC-13's missing actual-modal cost
comparison and UC-29's separately observed Static victory. Both were completed
before the manifest froze. The [dedicated report](2026-09-05-ui03-final-modal-cost.md)
records twelve 2.5-second actual Hint windows at desktop and iPad-sized DPR2
dimensions, with blur and no-blur controls. P95 frame intervals were 16.8–16.9ms;
none exceeded 50ms and no long task was observed. The traced pair's additional
33.209ms of renderer task CPU over approximately 2.514s is an observed host
delta, not an isolated GPU duration or universal performance budget.

The real ordinary Static victory had zero active animations across 241 samples
over four seconds; four images were byte-identical. Root inspected the 1194px
and 568px results: the declared content and controls fit. Twelve stationary
clipped confetti tips remain as decoration and are explicitly accepted for
this preview; there is no falling confetti in Static. Root also inspected the
meaningful maze-picker X, centered in its round 48px control. These bounded
checks close the missing engineering observations; family and physical-device
qualification remain separate.

### Published handoff

[v0.22.0 FP-UI1](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.22.0)
was published as a prerelease at **2026-09-05 10:51:24 UTC**, release ID
383217101, tag resolved to the exact runtime commit above. At **10:52:59 UTC**,
root downloaded all four public URLs without authentication and matched their
lengths and SHA-256 values to the frozen local stage. The source CI and latest
Vercel success were rechecked before publication. The Windows portable,
manifest, PLAYTEST and checksum file are the exact four release attachments.
The separate receipt records the later transaction so the immutable manifest
can honestly retain its pre-upload freeze state.

The web and Windows builds are ready for the family checklist. Report feedback
in this existing Astra task; a passing session should name the device, input,
comfort/clarity verdict and any untested checks. Root reviews that evidence and
PT36's held attachment preflight before releasing the fresh Agent 04 prompt.
No later specialist has been started by this publication.
