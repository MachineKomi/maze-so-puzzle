# Plan 03-R1 premium utility generation prompts

Recorded 2026-09-04. These are the exact prompt components submitted to the built-in image-generation capability. Each invocation was the shared block followed immediately by the named subject block. Image order was fixed: Image 1 current icon semantic/silhouette evidence; Image 2 approved Batch 22 First Star craft authority; Image 3 approved Batch 22 Pathfinder Patch craft authority. The tool did not expose model build, seed, request envelope, or execution timestamp.

## Rejected native-alpha attempt shared block

Used for Home, Mazes, Book, and Help only. All four outputs painted a checkerboard and are retained as rejected provenance; none is a candidate or authority.

```text
Use case: stylized-concept
Asset type: fresh premium semantic UI/navigation sticker icon for Maze so Puzzle
Input roles: Image 1 is the currently published icon and supplies semantic meaning and broad silhouette evidence only. Images 2 and 3 are the approved Batch 22 achievement-sticker material/craft authority: glossy enamel, controlled metallic foil, broad restrained holographic accents, clean cream cutline, and polished material-aware contours. Generate entirely from a blank canvas. Do not edit, trace, collage, overpaint, or reuse pixels from any reference.
House style: original clean simple chunky magical-girl anime handheld-JRPG icon; two to four large colour masses; broad three-value modelling; bright material-local colour-aware contours harmonised through plum, never uniform black. One clean cream-white sticker cutline around the complete outer silhouette. Glossy enamel plus one clearly visible controlled warm-metal foil element and exactly one broad restrained iridescent/holographic segment or glint. Utility tier is one step quieter and simpler than achievements.
Composition: one centered isolated symbol, generous 10 percent safe space, consistent sturdy visual weight, no crop, no external cast shadow. Must remain instantly recognizable and clean at 64, 48, 32, 24, and 16 CSS pixels.
Background: genuinely transparent RGBA canvas through every exterior and negative-space opening. No matte, checkerboard, scenery, floor, contact shadow, cast shadow, glow, reflection, halo, or dirty alpha.
Constraints: no frame, generic badge plate, text, letters, watermark, tiny facets, glitter dust, rainbow noise, chromatic aberration, microtexture, filigree, internal cream outlines, repeated motifs, muddy edge, soft airbrushed border, or black outline. Functional silhouette wins over decoration.
```

Rejected outputs:

- `nav-home-v04-alpha-attempt-01-generator-original.png` — `exec-20fc3d8f-08fc-4c3a-a780-338c3ec0a53f.png`
- `nav-mazes-v05-alpha-attempt-01-generator-original.png` — `exec-f07cea77-cbb9-4816-afb0-1f52a93bc800.png`
- `nav-book-v03-alpha-attempt-01-generator-original.png` — `exec-6784f4c4-d364-4b05-a994-2047a5e4164c.png`
- `nav-help-v03-alpha-attempt-01-generator-original.png` — `exec-e9274a47-929f-4766-bddf-94c54b81767e.png`

## Selected-for-review chroma-matte shared block

```text
Use case: stylized-concept
Asset type: fresh premium semantic UI/navigation sticker icon for Maze so Puzzle
Input roles: Image 1 is the currently published icon and supplies semantic meaning and broad silhouette evidence only. Images 2 and 3 are the approved Batch 22 achievement-sticker material/craft authority: glossy enamel, controlled metallic foil, broad restrained holographic accents, clean cream cutline, and polished material-aware contours. Generate entirely from a blank canvas. Do not edit, trace, collage, overpaint, or reuse pixels from any reference.
House style: original clean simple chunky magical-girl anime handheld-JRPG icon; two to four large colour masses; broad three-value modelling; bright material-local colour-aware contours harmonised through plum, never uniform black. One clean cream-white sticker cutline around the complete outer silhouette. Glossy enamel plus one clearly visible controlled warm-metal foil element and exactly one broad restrained iridescent/holographic segment or glint. Utility tier is one step quieter and simpler than achievements.
Composition: one centered isolated symbol, generous 10 percent safe space, consistent sturdy visual weight, no crop, no external cast shadow. Must remain instantly recognizable and clean at 64, 48, 32, 24, and 16 CSS pixels.
Background: one perfectly flat uniform solid saturated chroma-green #00FF00 matte covering every pixel behind and through negative-space openings. No gradient, texture, lighting, checkerboard, scenery, floor, contact shadow, cast shadow, glow, reflection, green spill, halo, or #00FF00 inside the icon. Crisp separated edge suitable for deterministic connected-background cutout.
Constraints: no frame, generic badge plate, text, letters, watermark, tiny facets, glitter dust, rainbow noise, chromatic aberration, microtexture, filigree, internal cream outlines, repeated motifs, muddy edge, soft airbrushed border, or black outline. Functional silhouette wins over decoration.
```

## Subject blocks and outputs

### Home / `batch-23-nav-home-premium-utility-v04-a`

```text
Subject: a simple literal cozy home silhouette. Coral-peach triangular roof, warm cream rounded-square house body, one mint arched door, one tiny warm-gold foil door knob, and one short broad iridescent segment along the roof edge. No chimney, heart, window, tree, path, fence, secondary sparkle, or decorative extras.
```

Output: `nav-home-v04-candidate-a-matte-01-generator-original.png` / `exec-a276d9d4-0bfc-4022-901c-4619262bc690.png`

### Mazes / `batch-23-nav-mazes-premium-utility-v05-a`

```text
Subject: a literal top-down rounded-square maze silhouette with one clear open entrance and one clear open exit. Use three or four broad mint-aqua maze walls on a lavender enamel base, large simple negative channels, one warm-gold foil exit cap, and one broad iridescent upper outer-edge segment. No letter S, map pin, compass, text, loose star, or secondary sparkle.
```

Output: `nav-mazes-v05-candidate-a-matte-01-generator-original.png` / `exec-6571705b-62e5-41a9-8692-240f73449dda.png`

### Book / `batch-23-nav-book-premium-utility-v03-a`

```text
Subject: one open book silhouette with two broad warm-cream pages, a lavender cover/rim, a mint spine, one small warm-gold foil five-point star on the right page, and one broad iridescent segment on the lower cover edge. No writing, page lines, bookmarks, quill, loose sparkle, or second motif.
```

Output: `nav-book-v03-candidate-a-matte-01-generator-original.png` / `exec-f9c5665d-0ea9-4ba6-a0b0-a031604a3891.png`

### Help / `batch-23-nav-help-premium-utility-v03-a`

```text
Subject: one chunky upright question mark and its round dot as a single unmistakable help symbol. Lavender enamel question-mark body with one broad mint inner highlight, a warm-gold foil dot, and one broad iridescent segment on the upper curve. No speech bubble, book, star, text, letters, or extra punctuation.
```

Output: `nav-help-v03-candidate-a-matte-01-generator-original.png` / `exec-8d995571-7620-48a3-83fb-bd66f2868817.png`

### Sound / `batch-23-nav-sound-premium-utility-v04-a`

```text
Subject: one simple right-facing speaker with a blue enamel rear block, mint-aqua cone, exactly two thick lavender sound waves, one warm-gold foil rear cap, and one broad iridescent segment on the cone rim. No music note, third wave, text, loose sparkle, or extra control symbol.
```

Output: `nav-sound-v04-candidate-a-matte-01-generator-original.png` / `exec-569817d0-deac-4669-b4a1-c20bb2ad9fe9.png`

### Muted / `batch-23-nav-muted-premium-utility-v03-a`

```text
Subject: an obvious sibling of the Sound icon: the same right-facing speaker with blue enamel rear block, mint-aqua cone, warm-gold foil rear cap, and one broad iridescent cone-rim segment, but ZERO sound waves. A single thick decisive coral slash runs from upper left to lower right and extends beyond the speaker silhouette so the muted state is non-colour-only. No X, music note, residual wave, text, or loose sparkle.
```

Output: `nav-muted-v03-candidate-a-matte-01-generator-original.png` / `exec-7a30d2f3-ebc1-4724-8be3-934c8a7c3f6c.png`

### Restart / `batch-23-nav-restart-premium-utility-v03-a`

```text
Subject: one bold clockwise circular restart arrow with a large open centre, chunky coral enamel body, warm-gold foil arrowhead, and one broad short iridescent segment on the upper-left arc. No second arrow, clock face, inner sparkle, text, letter, or decorative extras.
```

Output: `nav-restart-v03-candidate-a-matte-01-generator-original.png` / `exec-42f14134-4988-4ddf-a83d-850f1a5dcaf8.png`

## Logo construction

No ImageGen output supplies final lettering. `game-logo-v02-candidate-a-deterministic-master.png` is rebuilt by `scripts/art_pipeline/mgjrpg02_plan03_r1_review.py` from exact local strings (`Maze`, `so`, `Puzzle`), the vendored Fredoka variable font set to SemiBold, and deterministic colour/mask parameters. Batch 21 Logo Candidate A supplies only the Human-approved compositional and material starting direction. The yellow maze-route line is intentionally absent.

## Exact invocation index

Each heading below binds one output to the exact concatenation already preserved above. “Alpha shared + subject” means the Rejected native-alpha attempt shared block immediately followed by that identity's Subject block. “Matte shared + subject” means the Selected-for-review chroma-matte shared block immediately followed by that identity's Subject block. No other prompt text intervened.

## `nav-home-native-alpha-attempt-01`

Exact prompt: Alpha shared + Home subject. Output `exec-20fc3d8f-08fc-4c3a-a780-338c3ec0a53f.png`.

## `nav-home-premium-utility-candidate-a-matte-01`

Exact prompt: Matte shared + Home subject. Output `exec-a276d9d4-0bfc-4022-901c-4619262bc690.png`.

## `nav-mazes-native-alpha-attempt-01`

Exact prompt: Alpha shared + Mazes subject. Output `exec-f07cea77-cbb9-4816-afb0-1f52a93bc800.png`.

## `nav-mazes-premium-utility-candidate-a-matte-01`

Exact prompt: Matte shared + Mazes subject. Output `exec-6571705b-62e5-41a9-8692-240f73449dda.png`.

## `nav-book-native-alpha-attempt-01`

Exact prompt: Alpha shared + Book subject. Output `exec-6784f4c4-d364-4b05-a994-2047a5e4164c.png`.

## `nav-book-premium-utility-candidate-a-matte-01`

Exact prompt: Matte shared + Book subject. Output `exec-f9c5665d-0ea9-4ba6-a0b0-a031604a3891.png`.

## `nav-help-native-alpha-attempt-01`

Exact prompt: Alpha shared + Help subject. Output `exec-e9274a47-929f-4766-bddf-94c54b81767e.png`.

## `nav-help-premium-utility-candidate-a-matte-01`

Exact prompt: Matte shared + Help subject. Output `exec-8d995571-7620-48a3-83fb-bd66f2868817.png`.

## `nav-sound-premium-utility-candidate-a-matte-01`

Exact prompt: Matte shared + Sound subject. Output `exec-569817d0-deac-4669-b4a1-c20bb2ad9fe9.png`.

## `nav-muted-premium-utility-candidate-a-matte-01`

Exact prompt: Matte shared + Muted subject. Output `exec-7a30d2f3-ebc1-4724-8be3-934c8a7c3f6c.png`.

## `nav-restart-premium-utility-candidate-a-matte-01`

Exact prompt: Matte shared + Restart subject. Output `exec-42f14134-4988-4ddf-a83d-850f1a5dcaf8.png`.
