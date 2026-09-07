# LOOT-03 A — independent Sol final review

I independently reviewed frozen runtime
`85f49eaf5c2e53d01491b6e7916b3c9bcc7e6523` for the bounded Chromium web
release. Astra remained the sole runtime writer. My review covered the final
source, corrected visual packet, browser records and four paired performance
reports. I recommend this exact runtime for that web scope. I found no remaining
source, visual or current-host frame blocker.

This is an engineering disposition. It is not Human acceptance of the loot feel
or appearance, and it is not physical iPhone, iPad, Safari, WebKit or native
qualification.

## Source and persistence disposition

The final implementation keeps currency authority in the saved run rather than
in Canvas or animation callbacks. Authored Gold and Science values are split
without loss into stable source/drop IDs. A grounded drop becomes `claiming`
only after it has been represented for the required readable interval, is within
the `1.75`-tile collection radius and has a clear collection line. Accepted
claims settle through the reducer, so a quality change, animation cancellation,
missing Canvas or reload cannot erase or duplicate their value.

The representation and capacity boundaries are coherent:

- levels with invalid reward amounts, unsafe totals or more than 64 authored
  reward sources fail structural validation;
- one bundle is reserved for every unopened authored source, while a source may
  expand into as many as four bundles when capacity allows;
- Full and Lite draw/admit the same stable represented-ID set, capped at 20 and
  8 loot bundles respectively, with four separate Power presentation slots;
- unrepresented grounded bundles remain saved value and cannot be claimed
  invisibly;
- an empty ledger does not start Canvas or collection polling work.

The final timing requires at least 750 ms from first representation and at least
250 ms after a 350–550 ms throw, giving a 750–800 ms minimum before collection.
The representation neighborhood is a logical five-tile bound; it does not prove
that every pixel stayed visible for that duration.

Active-run schema 4 and gameplay rules revision 4 preserve a valid rules-3 v3
run, including its `runId`, route and progress. Existing authored pickups become
credited tombstones during that migration, preventing reward replay. A v2 run
receives a stable migrated identity. Migration writes authoritative v4 first,
then removes older keys from oldest to newest and stops on cleanup failure; v4
continues to shadow any older key left behind. The separate `clearActiveRun`
path also removes oldest keys first and v4 last. Malformed and future records
remain protected from destructive replacement, while known-obsolete records may
be discarded under the narrow established-content policy. The special clear
guard is limited to genuinely migratable v2/v3 records.

Completion settles accepted claims, writes the won active-run journal, then
records the idempotent profile receipt. A denied journal or profile write holds
Next for retry. Stay preserves the active run; explicit Next may leave optional
grounded loot behind. Those semantics make the physical collection choice
honest without changing immediate combat Power authority.

## Visual review

I inspected the corrected Full phone/tablet and fallback captures in
`loot03-browser-r3` and `loot03-final-browser`. Gold and Science have distinct
small non-emoji glyphs, their value labels are centered and readable, and the
settled labels survive the foreground-wall pass. The opening toast says the
reward scattered rather than claiming it was already collected. The transient
burst can overlap Ame, but the settled state remains legible and the overlap is
consistent with the requested forceful radial opening.

This fresh review supersedes the earlier r2 packet whose count placement and
toast were still wrong. Screenshots establish presentation at the captured
states; they do not establish collection feel, continuous readability or Apple
rendering.

## Functional evidence

I verified the retained Playwright summaries:

- `loot03-browser-r3/playwright-report.json` records 41 expected, 41 passed,
  zero skipped, unexpected or flaky cases. It covers Book/completion, MOVE,
  camera/map, physical loot and Power/overlay behavior.
- `loot03-final-browser/playwright-report.json` records 11 expected, 11 passed,
  zero skipped, unexpected or flaky cases on the final runtime. It covers Full,
  Lite, Reduced, Static, missing Canvas, migration, 64-source admission,
  accepted-claim recovery and denied completion-journal retry.

The two packets overlap and therefore are not 52 distinct final-runtime cases.
The synthetic 64-source case establishes the supported capacity boundary; it is
not representative campaign content or a performance fixture.

The final compressed-JavaScript growth is 4,922 bytes over public 0.22.17,
within the named 5,200-byte allocation. The change adds no CSS, media or runtime
dependency. That byte result does not waive timing or memory review.

## Paired performance evidence

All four reports use Windows Chromium 151 at CPU throttle 4, with five measured
pairs plus a separate warmup pair at 844×390 DPR3 and 1080×810 DPR2. Frame
cohorts are untraced; work cohorts capture trace categories without layer/picture
snapshots. Candidate build identity matches runtime `85f49ea`, runtime inputs
`d737dd40736a1ada859e27a5f75b52de60b274ee46d57f906c8dc039b5cc91f0`
and dist fingerprint
`48855d240ab011ea77fbfe165a0a64206d412ac163bf5894e1c6bc3a1a137c4e`.
Every route returned to the expected position and currency state with zero
terrain mutations, page errors or broken images.

The ordinary 16-step camera control is effectively neutral in traced raster
work: phone median RasterTask is 756.044→756.359 ms (+0.042%) and tablet is
1039.442→1039.858 ms (+0.040%). The untraced phone candidate retains one
50.034 ms interval versus a 33.4 ms baseline worst; tablet worst remains 33.4 ms.
This isolated phone interval is not present in the traced control cohort and is
not evidence of broad camera parity on Apple hardware, but neither cohort shows
a systematic control-route regression.

The roughly 4.3-second loot route performs more work than the old immediate-credit
route. Its measured trace medians are:

| Profile | Paint | RasterTask | Layout | UpdateLayoutTree |
| --- | ---: | ---: | ---: | ---: |
| 844×390 DPR3 | 177.332→190.105 ms (+7.203%) | 600.275→630.185 ms (+4.983%) | 27.990→49.088 ms (+21.098 ms; +75.377%) | 314.361→333.868 ms (+6.205%) |
| 1080×810 DPR2 | 197.711→203.758 ms (+3.059%) | 841.128→817.125 ms (−2.854%) | 39.073→71.366 ms (+32.293 ms; +82.648%) | 323.169→343.751 ms (+6.369%) |

These trace categories overlap and cannot be added as CPU or GPU time. The
layout percentage is large because its baseline is small; the absolute increase
is 21.098/32.293 ms across the complete route, with 10 layout events instead of
6. Paint and UpdateLayoutTree also rise. I accept these bounded costs as
proportionate to the longer physical presentation and separate claim/credit
transitions. I do not characterize the change as cost parity.

In the untraced loot cohort, every measured row has p95 at or below 16.8 ms.
Phone >20 ms intervals change 10/1293→12/1295 and tablet 13/1292→10/1302.
Each version/profile has five >34 ms intervals, exactly one in each measured run;
phone worst remains 66.7 ms and tablet worst remains 83.3 ms. Thus the candidate
does not worsen untraced p95, >34 count or per-profile worst, although it adds
two phone >20 ms intervals.

The traced loot cohort also has exactly five >34 ms intervals per version/profile.
Phone >20 ms changes 17→12 with worst 66.7 ms on both sides. Tablet stays 11→11,
but its worst rises from 50.1 to 83.3 ms. Every long interval occurs at the cold
source opening, normally at delta index 0; one candidate phone row records it at
index 1. This is one cold-opening hitch per run, not a 33 ms ceiling across the
route. Warmup traces point toward input handling followed by first reward-layer
layout/draw work, but they do not apportion the cause.

| Report | SHA-256 |
| --- | --- |
| `loot03-browser-r3/playwright-report.json` | `7153558b31b495af5212708594211302c97c17f568619f7f1006386fee1b634e` |
| `loot03-final-browser/playwright-report.json` | `bc4545b13ec3db13ddfe697ef8187579d4bf689fe06474b704a048ea37393218` |
| `loot03-camera-frames/report.json` | `b66cdd8bf5a6b8dd5173edf609a1bc6e634b1ff5ad3e9952c98bfe245e599605` |
| `loot03-camera-work/report.json` | `d9db44595366ac02033f2c486d060209b0216966d2e98bcd4affb62a31c6164b` |
| `loot03-loot-frames/report.json` | `9a7a046c7ec311d329ad2fcf684489cf95a2ed45a5804682f17ad48d915dac77` |
| `loot03-loot-work/report.json` | `fcf069e0134ba4f4c9dd411dfb40628a96e338fd0ea5500bc4e57bfe3aac15ee` |

## Disposition and remaining checks

I support publication of the exact frozen runtime for the bounded web preview.
The source and recovery contracts are coherent, the corrected presentation is
readable in the inspected Chromium captures, and the paired evidence shows a
bounded increase in work without a new sustained untraced frame-tail regression.

The cold-opening hitch remains a release follow-up rather than a reason for
another speculative optimization before affected-device evidence. The next
physical iPhone 13 and iPad 8 check should exercise both first source opening and
the longer vacuum route, while also rechecking the existing camera complaint.
The reported smooth iPhone 17 experience does not establish a RAM threshold.
Q05 should separately ask whether the burst, settling, walk-up collection speed,
glyphs and value feedback feel satisfying.

These Windows Chromium checks do not qualify Safari/WebKit, native wrappers,
3 GB memory behavior, GPU residency, thermal behavior, sustained battery cost,
accessibility on physical devices or Human beauty/feel acceptance. Publication
and lifecycle advancement remain Astra/Human decisions.
