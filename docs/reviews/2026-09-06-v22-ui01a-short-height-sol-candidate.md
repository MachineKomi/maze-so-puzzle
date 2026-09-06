# UI-01A — Sol compact gameplay and Book candidate

Date: 2026-09-06. Branch: `codex/v22-ui-short-height`. Clean merged base:
`033f8748c0ca4292f86506539371e404fab7ddd0` (accepted native Exit plus current
main documentation/test repairs). Runtime checkpoint:
`6e7cfe40c858302db700d8cfa3ce18d6a4b49624`. Status: qualified candidate for
independent Astra review; it is not merged, versioned or published.

## Bounded implementation

- `layout.ts` remains the single compact minimap-size authority. The measured
  deck height selects 192/128/96 px tiers; the compact HUD no longer applies a
  second viewport-width ResizeObserver override.
- The normal-text compact HUD is one bounded grid. Its real 152 px thumb pad,
  complete friend/bag shelves, minimap, objective, counters, Hint/More and a
  40 px feedback row coexist. The feedback row sizes its actual icon and
  `.feedback-bar` child, including two-line instructional copy; it does not
  ellipsize or hide that copy.
- At heights through 420 px, the Adventure Book keeps its header and five
  minimum-48 px tabs fixed while only `.book-scroll` scrolls. One complete
  132 px achievement card fits. Narrow tabs stack icon and label, and all tab
  labels remain one unbroken line.
- Reader mode remains content-preserving for browser text enlargement. The
  production primary layout and all gameplay/camera/input/save/audio/pace/
  rescue logic are unchanged.

No engine, level, camera/FOV, movement, input lifecycle, save, audio, dependency,
media, art, version, release or native source changed. Home/dialog/victory fit,
Bestiary/lore navigation, new pad art, HUD pace, and speaker/cog art remain later
reviewed UI increments.

## Geometry and content evidence

The runner restored a real current-rules authored checkpoint before every case:
`moonlit-friendship-quest`, content revision 3, gameplay fingerprint
`g-26763d04`, step 156, five rescued friends and eleven collected objects. Its
engine-derived route prefix SHA-256 is
`9dafd5a11160d3876351a2c67a9c71787d78c99795ab30aa07b68ac540203351`.

| Viewport | Board | Map | Feedback | Pad | HUD/page overflow | Complete Book card |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| 844×390 + safe area | 372 square | 128 | 40 | 152 | 0 / 0 | 132 px, visible |
| 780×312 + safe area | 298 square | 96 | 40 | 152 | 0 / 0 | 132 px, visible |
| 568×320 + safe area | 184 square | 96 | 40 | 152 | 0 / 0 | 132 px, visible |
| 960×540 native minimum | 504 square | 192 | 40 | 152 | 0 / 0 | 158 px, visible |

Every pad direction measured at least 48 px. Every friend/bag slot stayed inside
the HUD, map/pad/feedback rectangles were pairwise disjoint, all Book tab labels
used one line, and fixed Book chrome was byte-equal geometrically before/after
body scrolling. Primary 1920×1080, 1280×720, 1194×834 and 1024×768 PlayShell,
board, HUD, map, feedback, pad, Book chrome and Book-card dimensions matched the
frozen baseline exactly.

The focused 568×320 copy proof used the actual Maze 1 stationary rescue event:
“Rainbow-Horn Unicorn is free! What a lovely friend!” Its 150×24.625 px text
box and 179×28.625 px child bar are fully inside the 187×40 px feedback host,
with no child scroll overflow. A separate current-rules final-maze checkpoint at
step 59 supplied the longest authored objective and Power 198; schema-valid
durable replay totals supplied Gold 10007 and Science 9999. All three counters
and the two-line objective fit without horizontal or vertical overflow. These
are source-derived engine/save fixtures, not rewritten DOM labels.

Frozen baseline geometry is
`C:/GameDev/maze-game-qa/ui01a/evidence/baseline/geometry.json` (SHA-256
`176cc06ae567a044d38b8466c9beb5fd14ee9db3873efcad2dd47b9928ca9d98`).
Candidate geometry is
`C:/GameDev/maze-game-qa/ui01a/evidence/candidate-final/geometry.json`
(SHA-256
`90591e30aa9451a1829f761bfa7061b7f841b28a357bfb9a7e5ddc70ee5027f9`).
The focused content record is adjacent as `content-fit.json` (SHA-256
`998d0ff21fdc9d7e3a3a7d21a9cdd82c6ade90f154fa7d357bcf1d256ccd7d3a`).

Selected visual hashes:

- final 568 gameplay `b050682cc5491d9d5c54dd378ed4b7763aac1c267f1f2626fa1cb24cd2bb176a`;
  Book `71c80a558f90e36e3559bdf2726687f0a2ccbd47c2608c99be54ffd432e18c67`;
  long feedback `94fc0c9185bdec8f651d9a63617170fb2f411cfc83353222248e3d8dee386220`;
  long content `89f2ba6adeb90188c42e4b488ed247f9dd10217035fb0bfeeeb76ac2cae6373c`.
- baseline 960 gameplay `b6952dca41c1e0ab2d7766fb76b4491de0aad6092f44887892b45e8bdedf54a9`;
  Book `d5b864f739c8d4bcfbd3f4cd924594577dfcc9a95f2fe3bce37b674d18bb2419`.
- final 960 gameplay `fd29b340a9cea9788acfba0206e93ffd6b2f68662114181447b00245a7ccdfc5`;
  Book `b7d572bbf97ef9f27d73e60e3a6be8397e84ce8657af8df105df6894a28efa8f`.

## Qualification

- Serial full project suite: 51 files, 543/543 passed in 85.17 seconds.
- Final focused layout suite: 12/12 passed.
- Production TypeScript/Vite/provenance build passed after the final CSS.
- `perf:check` and `perf:inventory` passed. Inventory reports 412 runtime assets,
  164,967,097 transfer bytes; public delivery totals 165,031,011 bytes.
- Final serial production-browser proof: 3/3 passed in 22.92 seconds. It covers
  all eight reference sizes plus 960×540, geometry/scroll/target assertions,
  actual pad movement, More and Hint dialogs, keyboard Book tabs, enlarged-text
  reader mode, actual long rescue feedback, longest objective and large totals.
  Results SHA-256:
  `cf6e8289dce3986340fed96195a2a18e41503e368826100e28248e46a086471f`.
- `git diff --check` passed apart from non-mutating Windows line-ending notices.
  Package manifests, lockfiles, public/media trees and native files have no diff.

## Exact allocation

Against accepted Exit base `033f8748`:

- JavaScript gzip-9: 155,339 → 155,307, net **−32 bytes**. Allocated JS growth:
  **0 bytes** (well inside the approved +1,200 maximum).
- CSS gzip-9: 23,563 → 23,910, net and allocated **+347 bytes** (inside the
  approved +1,800 maximum).
- Public delivery: 165,031,011 → 165,031,011; media, decoded-image inventory and
  dependencies: **zero growth**.

## Retained corrections and limits

The first fit allowed the 780 px collection shelf to overlap the map; a 24 px
feedback host also clipped its inherited 30 px child, and the first 568 px Book
capture split “Achievements” mid-word. All three were treated as product misses,
not waived: compact slots/map tiers were reconciled, feedback was sized from its
child and tested with long real copy, and tab labels are now measured unbroken.
Early observer checks also incorrectly counted hidden counter art as out of
bounds and allowed the default storage fixture to overwrite a focused fixture;
the final runner excludes zero-area descendants and uses isolated contexts.

This is Chromium desktop emulation plus source/unit/build evidence. It does not
claim physical phone/iPad comfort, native WebView acceptance, iPad camera
efficacy, or broader UI-01 completion. Root retains independent acceptance,
integration, versioning, native packaging and publication authority. Rollback is
the five-file runtime seam to `033f8748`; do not keep the compact grid while
restoring the competing ResizeObserver map override.

See the cumulative [PLAYTEST_CHECKLIST](../PLAYTEST_CHECKLIST.md) and
[HUMAN_DECISIONS](../HUMAN_DECISIONS.md) for successor-specific physical checks
and decisions.
