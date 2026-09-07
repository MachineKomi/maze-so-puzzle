# FIELD-21 independent Sol review

Status: **accepted for bounded web publication**.

I reviewed frozen runtime `6cc9f86bf6f21f741c3fc75f40ea408612e2726f`
independently of Astra's implementation. The reviewed runtime-input SHA-256 is
`fe526de999fdee6d036d99bd0f1aba088c125f26c1d5e6eb8d12d543cd68be6e` and
the dist fingerprint is
`7b42516916d0b991c8917838787d40dfddd9dd580ec7f9df65757657ccd70d38`.
This review does not reopen the Human's acceptance of the balanced interior wall
shape and lighting. It evaluates the subsequent scale, reward-size, jump-depth
and perimeter corrections. It is not Human approval of those corrections.

## Source disposition

The shared field-art measurement is a coherent repair. Visible alpha bounds now
remain at most `0.9` tile wide, actors are capped at `1.35` tiles high, and items
at `0.9` high without aspect distortion. Registered ground lines, baselines and
pivots still own placement. The same measurement feeds field rendering,
rendition demand and held-weapon registration, avoiding a second scale formula.
The 61-entry audit records one player, 12 enemies, 32 friends, eight items and
eight weapons. Ame changes from `1.7763` to `1.35` tiles high and from `0.9` to
about `0.684` visible width. Enemies are unchanged; three unusually tall friends,
six items and all eight ground-weapon presentations receive the height cap.

This is appropriately selective. It corrects Ame's relative dominance while
preserving broad and short silhouettes. It also keeps tall friends distinct.
Cage presentation remains a crop of the same registered art rather than a newly
invented face or foot landmark.

Gold and Science use a `0.28`-tile presentation diameter and Power uses `0.22`.
Canvas glyphs, trails, shadows, grounded counts and the SVG fallback derive from
those values. Reward quantities, committed-ledger ownership, landing, collection,
capacity and save rules are untouched. The code-drawn symbols remain interim
art; this slice does not deliver the requested generated reward sprites.
`ART-REWARD-01` therefore remains required and separate.

Jump depth is now correctly split. The airborne body, boots, held weapon and
badge are on layer 27, above the wall foreground on 26. The shadow and launch
ring are in a separate ground root on 25. `useSceneTravel` translates both roots
from the same cached jump point and samples the three `spring-jump-*` animations
on one paused absolute clock. Landing, cancellation, hidden-page and comfort-mode
paths still return to the ordinary grounded actor. This avoids the earlier error
of lifting the ground shadow over a foreground wall.

The perimeter change is restricted to exterior cap coordinates. Interior wall
height `0.81`, cap width `0.47`, rear overlap `0.28`, skew and lighting remain
unchanged. Open boundary cells are not converted to walls. The exterior strips
extend beyond the clipped board so side gutters, rounded corners and the lifted
south edge are covered without changing logical collision or level identity.

I found no source correctness blocker in these changes. The reported gzip growth
is bounded: JS `174011` and CSS `24191`, respectively `+182` and `+21` versus
web 0.22.20; media and dependencies are unchanged.

## Fresh visual and browser review

I freshly inspected the exact-source images in
`C:\GameDev\maze-game-qa\performance\field21-final-browser` and
`C:\GameDev\maze-game-qa\performance\field21-final-loot`. This is my own
visual review, not inherited acceptance.

The corridor comparisons show Ame at a credible scale beside all 12 enemies and
all 32 friends. Squat creatures remain squat, and tall friends such as Tidecurl,
Lanternling and Ripplecap remain visibly tall without overwhelming a tile.
Items and ground weapons are smaller and remain recognizable. The four cage
families keep bunny, alpaca, Mallowmusk and Tidecurl faces readable through the
bay; rescue-side full sprites preserve their proportions.

At both 780 and 1280 proof sizes, departure, apex and landing frames keep the
complete airborne actor and equipment in front of the tall wall. The ground
effects remain on the floor side of that wall. The 1280 controlled-clock record
reports actor/ground/wall layers `27/25/26`, identical actor and ground travel
translation, and three clocks aligned at each checkpoint. This proves the
sampled depth and clock contract, not real-time smoothness.

The perimeter images at DPR1, DPR2 and DPR3 show no exterior sliver around the
closed boundary walls. Native SVG membership rows report no gaps on any of the
four edges under all eight light directions. Interior corridors retain the
accepted wall shape and lighting in the reviewed frames.

The refreshed Gold and Science burst/settled frames at phone and tablet sizes
show small, distinct marks that remain findable against both warm floor and dark
wall materials. Counts remain readable, including the SVG fallback. The
presentation is now proportionate to actors and tiles. This visual correction
does not resolve the Human's objection to the placeholder art style.

The final browser packets pass 46/46 scene/rack cases and 32/32 loot, reward,
save and cleanup cases, with no skips, flakes or unexpected results. The earlier
73/73 browser packet predates the ground-root split and is supporting history,
not final evidence. The exact-source reports reviewed here have SHA-256
`00c35d31c070581774605c246cc79efcc707a2cb785fe6d71cf53fd58744ade8`
for the 46-case packet and
`b640604c2069be19e1b5e907d4e8dcc3e91198fbea60f8bc4fbb03b749dca643`
for the 32-case packet. The proportion audit SHA-256 is
`9a479d232550f4e09bd2b29e69c862b51ca3853f220857c87ea5f1f9dd4c2bb9`.

The additional source-identical marker packet closes the initial rack omission.
Its 2/2 cases show all three keys under the item cap in both corridor orientations
and the unchanged three doors, three portals and goal. All images load. Key
visible dimensions are `0.775`–`0.883` tile wide and `0.900` high. I found them
distinct and readable beside Ame. The marker report SHA-256 is
`de8e66ef45957b84ff1d4db761743da609d460a4b1e2089d8340b969b58ad144`.

The helper-only rack extension asserts every image load, all six key instances
and all 14 door/portal/goal instances. The optional published-jump configuration
accepts only the canonical and Vercel alias origins, disables the local preview
server for that mode and otherwise retains the local default. It introduces no
runtime change. Selected real-route camera and controlled jump-depth cases can
therefore be reused after deployment; this is a useful public verification seam,
not pre-publication evidence.

## Paired performance and final disposition

I independently checked all four raw CPU4 reports. Each contains five alternating
measured pairs per 844x390 DPR3 and 1080x810 DPR2 profile plus one warmup per side,
24 rows in total. All bind source `6cc9f86`, runtime-input and dist fingerprints
above, baseline JS SHA-256
`626728c3b8dae0c37c177ce72b4b51b20eaa97f0f40a15f94a5bb6ed8be2e205`
and candidate JS SHA-256
`dd9fa47e6b713b49f96afb8ef636548e3339203e5b59dcfada48d31df1d63b4b`.
All measured routes return to their starting position with the expected step
change, zero terrain mutations, errors and broken images. Camera rebase-adjacent
intervals are at most `16.8 ms`.

Untraced frame results, which are the timing authority, are:

| Route/profile | baseline >20 / >34 / worst | candidate >20 / >34 / worst | result |
| --- | ---: | ---: | --- |
| enemy 844 | 14 / 5 / 66.7 ms | 12 / 5 / 66.7 ms | retained opening hitch, no worse worst or >34 count |
| enemy 1080 | 10 / 5 / 66.7 ms | 12 / 5 / 50.006 ms | retained opening hitch, lower worst |
| camera 844 | 11 / 0 / 33.4 ms | 7 / 0 / 33.4 ms | neutral tail |
| camera 1080 | 9 / 0 / 33.4 ms | 8 / 0 / 33.4 ms | neutral tail |

Every measured-row p95 is at most `16.8 ms`. The enemy route's cold/opening tail
is common to both versions and remains a follow-up; this slice does not solve it.

Ratios below compare the median trace totals. Trace categories overlap and are
not additive or GPU-time:

| Route/profile | Paint | RasterTask | Layout | UpdateLayoutTree |
| --- | ---: | ---: | ---: | ---: |
| enemy 844 | -0.392% | +5.993% | -2.177% | -2.377% |
| enemy 1080 | +1.726% | -3.025% | +1.560% | -2.213% |
| camera 844 | +2.755% | +0.483% | +12.278% (`+11.734 ms`) | -1.448% |
| camera 1080 | -0.257% | -1.986% | +4.563% (`+7.030 ms`) | +1.172% |

The camera 844 trace includes one candidate `50.1 ms` interval where its baseline
has none over 34 ms; the 1080 trace reverses that pattern, baseline `50.0 ms`
and candidate `33.4 ms`. These trace-only events are retained rather than used
to override the untraced frame result. The enemy traces retain one >34 ms event
per measured run on both sides, except one extra baseline phone event.

The four raw report SHA-256 values are:

- enemy frames: `cb72d5a41ca844ae81794e40f922819b2a1d659895044d5f53a8f235344abe2e`
- enemy work: `3e8d4d0686a2ea5e6f44f81ea7df54b527802ae53bce40e9b4e8d3fad9a5e57c`
- camera frames: `360674c16bed5fce0f9769d45ad0faa62332441e160eebb337940c600592b876`
- camera work: `7deeb4b962ce03c5889d9d92122c5ce21553e7f9498f7fc5bb3a6ffb2c1d866d`

My independent judgment is that the measured work changes are bounded and
proportionate to the requested visual correction. The ordinary-camera frame
tails remain neutral, reward-route tails do not worsen materially, and the
source/visual contracts close the reported scale, airborne-wall and perimeter
defects. I therefore support publishing this exact runtime to the bounded web
preview, subject to Astra's normal identity guard and public smoke checks.

No local Chromium result establishes physical iPhone or iPad, Apple/WebKit,
3 GB memory, thermal, native or Human acceptance. The retained cold-entry reward
limitation remains open. Generated replacement reward artwork remains a separate
deliverable and is not implied by this recommendation.
