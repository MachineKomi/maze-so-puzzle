# DELIGHT-26 calm pickup presence — independent Sol review

Review date: 2026-09-07  
Reviewer: Sol (GPT-5.6), independent and read-only for runtime code  
Status: final independent bounded-web promotion disposition

## Scope reviewed

I reviewed the CSS-only candidate against clean published25 source `0565df3`, the frozen runtime `fd1f9e64abe93135a58c810e461f9efe0f52618a`, the execution contract in `docs/plans/DELIGHT-26-calm-pickup-presence.md`, the 14 matched Full-mode baseline captures in `presence26-baseline/pickup-presence`, and the candidate captures and computed-style receipts in `presence26-browser`, `presence26-final-browser` and `presence26-dense-r2`. I freshly inspected all seven phone Full composites; representative phone/desktop Lite, Reduced and Static composites; blue and yellow keys; expanded, folded and Classic dense compositions; physical-loot isolation; and held-weapon presentation. This is my own source and image review; it is not Human beauty approval, physical Apple testing, native acceptance or final performance qualification.

## Source disposition

The candidate covers the complete intended authored-pickup set: sword, potion, ordinary boots, spring boots, antidote leaf, key and legacy treasure. The selector is limited to those `object-kind-*` wrappers. It does not include doors, chests or Mimics, enemies, portals, goals, held equipment, or physical Gold, Science, XP and Power drops.

The implementation removes `item-shine`, the higher-specificity coloured-key animation, and `treasure-idle` from the affected images. A static radial backing is painted by each existing object wrapper, and a static two-edge image shadow replaces the moving filter states. There is no new component, DOM node, timer, animation, frame callback, canvas, image or game-state owner. The backing remains when Lite removes image filters, while Reduced and Static preserve the same nonanimated emphasis. The wrapper remains in the existing ground-Y scene plane, so this diff does not alter pickup position, field-art sizing, collision, discovery, collection or save ownership.

The broad `z-index: -1` backing is safe in the reviewed captures because each positioned object layer already has its own non-auto depth value. The final dense captures exercise the backing at foreground walls and camera edges: the art and light clip together at the viewport, retain ground-depth ordering, and do not paint over the wall foreground. That is adequate for this bounded CSS change.

## Visual disposition

The candidate produces a clear but calm improvement. Sword, potion, both boot families, leaf, key and treasure retain a continuous warm field instead of depending on a sampled point in a breathing animation. The backing is contained within one square cell and does not resemble another walkable tile. The art keeps its previous scale and grounding. Key colour remains evident from the approved art and the key-specific glow variable; the existing text motif stays readable. On the dark Moonlit and Friendship Crown scenes, the field separates the collectible from the floor without competing with Ame, enemies, doors or the objective. On the bright Little Star floor, the sword improvement is subtler but its silhouette remains legible. Lite loses only the static image edge and keeps the useful backing.

The evidence receipts report zero subtree animations, `transform: none`, full opacity, a nonfiltered/nonanimated backing and stable geometry across the sampled 0/1400/2800 ms phases for all 56 initial candidate cases. Each tested collection removes its object and saves the authoritative collected ID. The source-matched final browser work provides 91 distinct passing affected contracts: 90 cases in the first final matrix and the corrected dense case in `presence26-dense-r2`. The final matrix also covers blue/yellow key identity, Scene depth, physical-loot isolation and Explore resizing. One dense fixture failed before page launch with `TypeError: visible.has is not a function`; after the array-to-Set correction, its first selection constraint was impossible because it demanded three nearby pickups and a hazard. The corrected selector maximizes actual pickups independently and passes on Moonlit with three visible pickups, zero hazards and four ordinary moves. I retain both harness failures as evidence history rather than calling this one clean 91-case run.

The dense expanded, folded and Classic images are coherent. The top-edge potion is clipped by the viewport with its backing rather than leaving an orphan glow; the sword and antidote leaf remain readable beside and partly behind foreground wall volumes. Folded and Classic change composition without changing tile-relative art or glow. Blue and yellow keys preserve their approved colour, motif label and distinct `--lock-glow`. The physical Gold screenshot has no authored-pickup backing, and the held sword keeps its established presentation, confirming the selector boundary visually.

## Performance evidence

The final serialized packet contains four reports with 24 rows each: four warmups and five measured baseline/candidate pairs for each of 844×390 and 2560×1080 at DPR2 under CPU4. Both sides use the folded layout, the same Moonlit state, three visible authored pickups and 351 DOM nodes. All 96 rows complete the requested route and return to the same position with no page error, broken image or terrain mutation. The published25 baseline has two running pickup animations; the candidate has zero. The reports bind runtime-input SHA-256 `bb4d917ec5b9feaa0fabbfcd0baf9c559df08d249739d41d45272ae845e92381` and dist SHA-256 `4095859750cb36f88141ff881513931b1eef24402010b043630af7ef2e67de4a` to frozen source `fd1f9e64`.

| Cohort | Report SHA-256 | Key measured result |
| --- | --- | --- |
| moving frames | `c68f231f4e66adc1688643a26241cab754080e87b5819bd37258beb0c15a0711` | Median p95 16.8 ms in every group |
| moving work | `864d5eec3de6dcab8785f0002e4885f2d5ab8b8e9af26a65f5930d79e566fa7c` | 22 candidate layers versus 26 baseline; largest layer area unchanged |
| idle frames | `e02c2751793581416a59bcb0bfb49a7186e73e8e6a8b2cb8156c417a01a13ef4` | All 20 measured rows have zero intervals over 20 ms |
| idle work | `f4a25bcf04046c482b0c472223ad74c2fa86dbad18c1bd05c9deebfbe9cccc56` | Style work falls materially in both layouts; one traced-only candidate interval reaches 33.4 ms |

The moving traced medians are neutral to better at phone size: Paint 808.382→791.287 ms, RasterTask 46.395→46.087 ms, Layout 84.622→82.729 ms and UpdateLayoutTree 582.057→536.399 ms. At 2560, Paint rises 768.829→777.844 ms (+1.17%) and Layout 121.376→122.171 ms (+0.66%), while RasterTask falls 24.457→24.237 ms and UpdateLayoutTree falls 502.631→490.013 ms. Idle phone Paint and Layout rise slightly, 953.692→958.229 ms (+0.48%) and 82.278→83.341 ms (+1.29%), while UpdateLayoutTree falls 646.658→569.549 ms. Idle 2560 Paint, RasterTask, Layout and UpdateLayoutTree all fall: 999.031→995.040, 26.097→24.976, 87.001→83.882 and 677.861→584.887 ms.

The untraced moving phone totals are baseline 4 intervals over 20 ms/1 over 34 ms versus candidate 4/0. One disturbed 2560 pair has the same 33.3 ms p95 and 50.1 ms worst on both sides, but baseline records 15/1 and candidate 18/3 intervals over 20/34 ms. The other four 2560 pairs together favour the candidate, baseline 5/0 versus candidate 2/0. This retained cluster prevents a universal tail-improvement claim; it does not show a sustained candidate regression. The traced idle candidate has one 33.4 ms 2560 interval, while the untraced idle authority has zero intervals over 20 ms in every measured run. Trace durations overlap and do not represent additive CPU or GPU time.

The entry identity lists version 0.22.26, unchanged JS bytes, CSS gzip9 26,582, and no public-media change. Removing the animated pickup filters also reduces the observed layer count from 26 to 22 without changing the largest CSS layer area (2,152,960 at phone size and 5,655,040 at 2560). This is useful bounded browser evidence, not allocated-memory or physical-device proof.

## Final disposition

I support promotion of frozen `fd1f9e64` for the bounded web scope. The candidate delivers the specified calm, continuous presence for all seven authored pickup kinds, preserves visual and gameplay ownership, removes two continuous pickup animations and four observed layers, and shows no material frame or traced-work regression in the controlled five-pair comparison. The isolated shared moving-tail cluster and traced-idle interval are disclosed above and do not justify more renderer work for this CSS-only change.

This closes DELIGHT-02B checkpoint A only. Durable-earned keepsake fanfare C remains next. Q12/P26 Human play judgment, affected-device Apple testing, native acceptance, GPU allocation and thermal behaviour remain open; this review supplies none of those approvals.
