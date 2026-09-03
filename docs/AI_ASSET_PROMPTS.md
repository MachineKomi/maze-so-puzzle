# AI art prompt set

> **Current identity authority (2026-09-03):** this file preserves historical
> prompts and production provenance; earlier wording such as “blonde bob” is not
> a future design lock. Before generating or editing new art, read
> `docs/GAME_VISION_AND_DESIGN_SPEC.md`, `docs/ART_BIBLE.md`, and
> `docs/characters/AME_MODEL_SHEET.md`. Ame must have golden-blonde hair and
> clearly blue irises in every depiction. Candidate C's shoulder-brushing,
> softly layered hair and preserved mint/lavender adventure identity are the
> approved static v02 design direction; the v01 runtime pointer remains active
> until the versioned derivative and live-context gate pass. Never rewrite the
> exact historical prompts below; append new versioned records instead.

All base artwork in `public/assets/` was generated for this project with the
built-in OpenAI image-generation tool. Runtime resizing, chroma removal, WebP
conversion, palette optimization, periodic Poisson correction, and the older
hazard mirror compositions are programmatic derivatives of those generated
sources. Early tile and interactive assets were prepared as 512 × 512 PNGs;
the periodic terrain textures are 1024 × 1024 PNGs; the wide title illustration
has a 1672 × 941 PNG master and an
optimized WebP runtime derivative. Interactive assets were requested on a flat
`#ff00ff` chroma-key background or, for the new 0.9.0 traversal sprites, as
native transparent RGBA cutouts. Most early sprites arrived as clean RGBA
cutouts. The sword-holding Ame variant needed the documented connected-edge
chroma-removal pass; alpha extrema and transparent corners were validated before
integration. Texture tiles, the portrait, and the title illustration are opaque.

## Shared character and item direction

```text
Use case: stylized-concept
Asset type: square game sprite or icon
Style/medium: polished 2D hand-painted anime storybook RPG art, chunky rounded/chibi proportions, subtle paper texture, clean dark-plum outline, high-end children's mobile game art, readable at game-tile size
Composition/framing: exactly one centered subject in a square with generous even padding and a strong simple silhouette
Lighting/mood: bright soft studio light, cozy, magical, cute, and low-stakes
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background for background removal
Constraints: no text; no number; no cast shadow; no ground; no border; no frame; no scenery; no watermark; background must be one uniform #ff00ff with no gradients, texture, reflections, floor plane, or lighting variation; crisp edges; do not use #ff00ff in the subject
```

Asset-specific primary requests combined with that direction:

- `ame.png`: “A cute little female fantasy maze adventurer for a gentle children's game, blonde bob haircut, tiny lavender backpack, mint tunic, lilac capelet, coral boots, holding nothing; full body; front three-quarter view; cheerful brave smile.”
- `goblin.png`: “An adorable harmless little moss-green fantasy goblin, round ears, leaf-green tunic, small tan belt pouch, silly determined eyebrows, friendly toothy grin, empty hands; full body; not scary.”
- `sword.png`: “A friendly toy-like short adventurer sword with a silver leaf-shaped blade, golden star pommel, lavender grip, completely non-threatening.”
- `potion.png`: “A round corked Power potion bottle filled with glowing coral-orange liquid, small cream heart emblem on the glass, cute and magical.”
- `boots.png`: “A matching pair of adorable chunky teal rain boots with small golden wing emblems; protective adventure boots.”
- `star-key.png`: “One magical sky-blue key whose bow is a clearly readable five-point star shape, short chunky gold-edged design.”
- `star-door.png`: “One closed rounded-top magical sky-blue wooden dungeon door, centered golden five-point star lock plate, chunky toy-like proportions, front orthographic view.”
- `goal.png`: “One magical golden five-point star portal standing upright, a puffy cream-and-gold star surrounded by a small lavender sparkle ring, friendly finish marker.”

## Portrait prompt

```text
Use case: stylized-concept
Asset type: square player avatar portrait for game sidebar
Primary request: close-up portrait of the same cute little female fantasy maze adventurer: blonde bob haircut, lavender backpack straps, mint tunic collar, lilac capelet, rosy cheeks and a cheerful brave smile
Subject: one young chibi adventurer from chest up, facing slightly right, friendly expressive eyes
Style/medium: polished 2D hand-painted anime storybook RPG portrait, chunky rounded shapes, subtle paper texture, clean dark-plum outline, high-end children's mobile game art
Composition/framing: centered square bust portrait, head fully visible, generous padding, readable at 160 pixels
Scene/backdrop: soft circular cream-and-peach sunburst with tiny subtle stars, contained inside the square
Lighting/mood: warm, cozy, confident, magical
Color palette: blonde gold, mint, lavender, coral, cream, peach, dark plum
Constraints: exactly one character; no text; no number; no weapons; no watermark; no UI border; no extra people
```

## Tile prompts

All tile prompts used `Use case: stylized-concept`, a square seamless game-tile asset, a polished 2D hand-painted anime storybook RPG finish, a purely top-down orthographic view, edge-to-edge composition, and constraints of no characters, items, text, border, frame, or watermark.

- `floor.png`: “Pale cream cobblestone maze floor, four to six large rounded stones with tiny lavender grout and a few subtle golden sparkles; quiet low-contrast surface for readable sprites.”
- `wall.png`: “Chunky lavender hedge-stone maze wall, dense rounded blocks with mint leaves and tiny cream flowers, clearly solid and impassable; strong dark-plum outer creases.”
- `water.png`: “Shallow aqua water with large rounded ripples, a few tiny cream bubbles and soft mint highlights, friendly and safe-looking; no shore.”
- `lava.png`: “Magical strawberry-orange lava with slow rounded golden swirls and tiny cream sparkle bubbles, warm and whimsical rather than dangerous; no shore, black, or scary fire.”

## Version 3 title-screen illustration

The title art was generated with the built-in OpenAI image-generation tool in
`stylized-concept` mode. The existing Ame portrait, bunny, fox, and kitten art
were supplied as identity references. Title lettering and buttons are rendered
by the game rather than baked into the illustration.

- Generated source basename:
  `exec-d71060ee-5236-4fb8-aa7b-b03165fae498.png`
- Archived PNG master: `docs/source-assets/title-background-v1.png`
- Optimized in-game derivative: `public/assets/title-background-v1.webp`
- Runtime URL: `/assets/title-background-v1.webp`
- Built-in mode: `Use case: stylized-concept`

The 2,502,491-byte PNG master is retained outside the production asset folder
for provenance and future edits. The
game serves the 256,684-byte WebP derivative to reduce title-screen transfer and
decode cost while preserving the wide illustration.

Exact generation prompt:

```text
Use case: stylized-concept
Asset type: 16:9 game title-screen background illustration
Input images: Image 1 is Ame's identity and outfit reference; Images 2-4 are the bunny, fox, and kitten identity references.
Primary request: Create a brand-new enchanting title-screen scene for a gentle children's maze adventure. Ame, the same smiling young blonde adventurer with lavender cape and backpack from Image 1, stands full-body on the right side inviting the player forward. The same three tiny animal friends from Images 2-4 gather happily near her. A winding top-down-inspired stone maze path leads through a dreamy pastel meadow toward a sparkling golden star portal, with one tiny harmless cute goblin peeking from far away.
Style/medium: lovely polished chunky anime fantasy JRPG storybook illustration, clean rounded shapes, hand-painted game key art, suitable for a five-year-old.
Composition/framing: wide 16:9 landscape; Ame and friends grouped on the right half; calm luminous negative space on the left half for code-rendered title and menu buttons; strong readable silhouettes; foreground, middle-ground maze path, distant magical portal.
Lighting/mood: warm peach-and-gold morning glow, lavender shadows, mint foliage, cheerful, safe, adventurous, celebratory.
Constraints: preserve Ame's blonde bob, teal tunic, lavender cape and backpack; preserve each animal's recognizable species, colors and neck accessory; no cages; no weapons in hand; no fear or danger; no text, letters, logo, UI, frame, border, watermark, or signature.
Avoid: photorealism, dark horror mood, clutter on the left, hard-edged pixel art, complex tiny details.
```

## Version 4 sword-holding Ame variant

This variant was created with the built-in OpenAI image-generation tool as a
precise edit, using `public/assets/ame.png` and `public/assets/sword.png` as the
identity and prop references.

- First edit output: `exec-f1b181ca-09d3-4f4c-a424-b3b6d07c9cf6.png`
- Final chroma output: `exec-6cda387d-cd9d-4ae9-bce1-b887880edd16.png`
- Archived 1254 x 1254 generated master:
  `docs/source-assets/ame-sword-master.png`
- Programmatically cut-out 512 x 512 runtime sprite:
  `public/assets/ame-sword.png`
- Runtime URL: `/assets/ame-sword.png`
- Built-in mode: precise image edit

Exact final edit prompt:

```text
Use case: stylized-concept. Edit the supplied Ame gameplay sprite into a production game-sprite variant. Keep exactly the same cute blonde adventurer, face, chibi proportions, mint tunic, lilac capelet, lavender backpack, coral boots, full-body three-quarter pose, linework, palette, lighting, padding, and chunky anime storybook JRPG rendering. Put the supplied friendly toy-like silver sword with lavender grip and golden star pommel clearly in Ame's hand, held upright beside her body, without covering her face. Exactly one character and one sword. Replace the entire background with perfectly flat uniform solid #ff00ff chroma magenta suitable for programmatic removal: no transparency checkerboard, gradient, texture, shadow, ground, scenery, glow, border, text, number, watermark, or extra object. Do not use #ff00ff on the subject. Keep the silhouette crisp and readable in one square maze tile; cheerful, gentle, and suitable for a five-year-old.
```

The generated background contained slight near-magenta variation, so the active
sprite was produced by removing chroma pixels connected to the canvas edges,
cleaning the remaining fringe without erasing enclosed character colours, and
resizing to 512 x 512. The master remains unchanged for future edits.

## Source-to-production mapping

| Production asset | Built-in generated source |
|---|---|
| `ame.png` | `exec-4a073da0-4d41-4349-9b08-1e943b5a959a.png` |
| `ame-sword.png` | `exec-6cda387d-cd9d-4ae9-bce1-b887880edd16.png` |
| `goblin.png` | `exec-04a30af7-a15a-4691-a3d0-66bda29f9347.png` |
| `ame-portrait.png` | `exec-4e0a7b4b-6cd5-458c-8011-3e689049c80f.png` |
| `sword.png` | `exec-1c70b1b5-3955-44eb-97d1-aa37af41cd59.png` |
| `potion.png` | `exec-dd59ffa4-fa99-4bf0-ae9e-c30b882f6161.png` |
| `boots.png` | `exec-8fbc256b-20f9-471f-9a2f-bf10c9a82e1b.png` |
| `star-key.png` | `exec-3c4232bc-0331-44e8-9881-247a32b9feb3.png` |
| `star-door.png` | `exec-af7f0336-24fe-47ad-bc90-264cd3fea21a.png` |
| `floor.png` | `exec-8b9c9ccb-52ba-453d-b848-48a5bb6de7a0.png` |
| `wall.png` | `exec-f87d9c4d-3698-4d83-896f-12b922d8c6be.png` |
| `water.png` | `exec-f198154f-ff0e-4275-8d0f-8aac2eb0b2c5.png` |
| `lava.png` | `exec-c9e5a708-2bf4-4f4d-9107-4fe641b6da84.png` |
| `goal.png` | `exec-e63823e2-de5a-46b6-a7dc-25f9ee57d926.png` |
| `title-background-v1.png` / `.webp` | `exec-d71060ee-5236-4fb8-aa7b-b03165fae498.png` |

`docs/source-assets/app-icon.png` is a locally resized 1024 x 1024 derivative of
`goal.png`. The lightweight browser icons at `public/favicon-64.png` and
`public/apple-touch-icon.png`, plus the Windows/macOS icon files under
`src-tauri/icons/`, were generated from that derivative and inherit the
documented `goal.png` provenance.

Original generated files remain in the Codex image-generation store. The title
master and unused v1 floor/wall tiles are also archived under
`docs/source-assets/`; the game references only optimized active copies under
`public/assets/`.

## Version 2 environment, rescue, and reward art

The feedback update added a second generated art pass. These PNGs use the same chunky anime storybook JRPG direction as the original set. Character, cage, currency, sticker, and medal art has a transparent background; the two environment textures are opaque seamless tiles. The v2 floor and wall remain historical runtime sources; build 0.6.0 supersedes them with the v3 terrain materials documented below.

| Project path | Concise generation prompt |
|---|---|
| `public/assets/wall-v2.png` | Seamless top-down field of large rounded lavender-blue stone slabs with deep plum grout and tiny moss accents; a single tiling stone texture, never a picture or map of a maze. |
| `public/assets/floor-v2.png` | Seamless top-down warm cream sandstone paving with broad softly rounded stones, peach grout, gentle watercolor texture, and quiet low contrast for sprite readability. |
| `public/assets/animal-bunny.png` | One cheerful cream lop-eared baby bunny with warm brown eyes and a mint neckerchief, seated in a centered 1:1 transparent game tile. |
| `public/assets/animal-fox.png` | One friendly orange baby fox with a fluffy cream-tipped tail and lavender flower neckerchief, seated in a centered 1:1 transparent game tile. |
| `public/assets/animal-kitten.png` | One smiling silver tabby kitten with bright blue eyes and a tiny golden bell bow, seated in a centered 1:1 transparent game tile. |
| `public/assets/animal-cage.png` | One empty ornate rounded golden rescue cage with heart and wing details plus a friendly heart-shaped lock, centered on transparency and readable at tile size. |
| `public/assets/coin-pouch.png` | A plump lavender drawstring pouch overflowing with shiny gold star coins, chunky rounded icon silhouette on transparency. |
| `public/assets/reward-trail-sticker.png` | A glossy golden star achievement sticker featuring a mint adventurer boot, leafy sprigs, sparkles, and a coral bow. |
| `public/assets/reward-brave-medal.png` | A polished blue-and-gold bravery medal featuring a toy-like silver sword, smiling star, laurels, and a purple ribbon. |
| `public/assets/reward-splash-sticker.png` | A joyful aqua water-drop sticker wearing tiny winged adventure boots, surrounded by friendly splashes and golden sparkles. |
| `public/assets/reward-rescue-medal.png` | An ornate coral heart rescue medal with three colorful paw emblems, cream wings, mint-and-lilac ribbon, and celebratory gold trim. |

At runtime these files are served from their matching `/assets/...` URLs. Art
warming is level-scoped or deferred rather than loading the whole catalogue on
the title screen.

## Version 6 seamless terrain materials

Build 0.6.0 replaces the large-slab v2 terrain with smaller-scale materials and
renders them as globally aligned SVG `userSpaceOnUse` patterns. The SVG geometry
owns the shape of walls and hazards; the generated bitmap supplies only the
continuous illustrated material. This separation allows exact rounded convex
and concave bends, connected water/lava regions, and a flat floor-colour hazard
lip without baking borders, shadows, or maze shapes into the art.

### Wall v3

- Generated source: `exec-e2b61d30-91a2-4223-b4a4-097a8fd9c3ae.png`
- Archived 1254 × 1254 master:
  `docs/source-assets/wall-v3-master.png`
- Optimized periodic runtime texture: `public/assets/wall-v3.png`
- Runtime URL: `/assets/wall-v3.png`

Generation request:

```text
Use case: stylized-concept. Create one genuinely seamless, purely top-down square fantasy stone material for a children's maze game. Show roughly 10 to 14 small rounded cobblestones across the image, using lavender-blue and periwinkle stones, plum-purple mortar, tiny sparse moss accents, and soft diffuse lighting. Lovely polished hand-painted chunky anime fantasy RPG / storybook game art, friendly and readable behind small sprites. The image must tile perfectly on every edge and contain only a continuous stone material: no maze diagram, path, wall silhouette, frame, border, lip, cast shadow, perspective, giant slabs, characters, objects, text, or watermark.
```

### Floor v3

- Generated source: `exec-4984c443-517f-43fa-833e-a67319dc18a4.png`
- Archived 1254 × 1254 master:
  `docs/source-assets/floor-v3-master.png`
- Optimized periodic runtime texture: `public/assets/floor-v3.png`
- Runtime URL: `/assets/floor-v3.png`

Generation request:

```text
Use case: stylized-concept. Create one genuinely seamless, purely top-down square fantasy floor material for a children's maze game. Show roughly 10 to 14 small softly rounded limestone pavers across the image, using buttercream, warm honey-gold, and pale apricot tones that harmonize clearly with lavender-blue walls. Lovely polished hand-painted chunky anime fantasy RPG / storybook game art, quiet enough for characters and items to remain readable, with soft diffuse lighting. The image must tile perfectly on every edge and contain only a continuous paving material: no maze diagram, path, wall, frame, border, lip, cast shadow, perspective, giant slabs, characters, objects, text, or watermark.
```

The current v3 runtime files are built from their masters by
`scripts/process_terrain_textures.py`. Each master is resized directly to
1024 × 1024 and passed through a periodic-plus-smooth decomposition. The script
solves the boundary mismatch as a smooth periodic Poisson problem and subtracts
that low-frequency component from the painting. This retains single, crisp
stone outlines—unlike mirroring or broad alpha blending—while making the repeat
boundary weaker than ordinary neighbouring detail. The result is quantized to
a 256-colour palette for a modest mobile download.

### Periodic hazards

`public/assets/water-v2.png` and `public/assets/lava-v2.png` are not new scene
generations. They are 1024 × 1024 exact-periodic 2 × 2 mirror compositions made
from the prior AI-generated `water.png` and `lava.png` sources, using the same
512-pixel working tile and 256-colour, no-dither optimization. The SVG renderer
joins neighbouring hazard cells before applying these patterns, so the runtime
art needs no per-tile shore, rounded box, blur, or drop shadow.

## Version 7 themed maze collection

Build 0.7.0 adds a coordinated material and sprite collection generated with
the built-in ImageGen workflow. All masters are archived under
`docs/source-assets/`; runtime copies live under `public/assets/`. The visual
brief throughout was: lovely soft-pastel, chunky anime fantasy RPG art with the
friendly clarity of a children's storybook or handheld JRPG, no text, no
watermark, and a strong silhouette at one-square maze-tile size.

### Floor and wall materials

| Runtime asset | Concise generation prompt |
|---|---|
| `floor-rose-brick-v1.png` | Uniform top-down rose, peach, and cream storybook brick paving; small quiet masonry; edge-to-edge with no border, perspective, shadow, scenery, or maze diagram. |
| `floor-moon-slate-v1.png` | Uniform top-down powder-blue and moon-lilac slate cobbles; softly varied small pavers; edge-to-edge and quiet behind sprites. |
| `floor-meadow-grass-v1.png` | Uniform top-down spring-green meadow turf with tiny pastel flowers and leaves; fine repeatable detail rather than large clumps or a landscape. |
| `floor-woodland-dirt-v1.png` | Uniform top-down warm biscuit-brown woodland dirt path with tiny pebbles and subtle leaf flecks; no path boundary or scenery. |
| `wall-sandstone-v1.png` | Uniform top-down clean honey-cream sandstone brickwork; rounded small blocks with soft pastel grout; no wall silhouette or maze picture. |
| `wall-dark-dungeon-v1.png` | Uniform top-down old midnight-plum dungeon masonry; readable small blocks, gently softened for a child-friendly game. |
| `wall-hedge-v1.png` | Uniform top-down dense storybook hedge foliage with tiny mint leaves and sparse pastel flowers; no hedge outline or scenery. |
| `wall-mossy-ruin-v1.png` | Uniform top-down pale sage ruin stonework with moss between small blocks; soft, friendly, and seamless-looking. |

The current generated 1254 × 1254 masters are converted into 1024 × 1024
periodic runtime textures by `scripts/process_terrain_textures.py`, using the
same periodic-plus-smooth Poisson correction as the v3 floor and wall. All ten
floor and wall materials are fully opaque. The script validates their
dimensions and compares
the mean colour transition at each wrap boundary with ordinary adjacent-pixel
transitions inside the image; this catches a discontinuous seam without
requiring opposite pixels to be artificially identical.

Rebuild and validate the material set with:

```powershell
python -m pip install Pillow numpy
python scripts/process_terrain_textures.py
python scripts/process_terrain_textures.py --check
```

### Sparse terrain dressing

Build 0.9.1 adds two native-transparent ImageGen overlays that break up broad
material areas without disguising paths, adding tile borders, or changing
collision. Their generated masters are retained at
`docs/source-assets/terrain-dressing-garden-v1-master.png` and
`docs/source-assets/terrain-dressing-vines-v1-master.png`; the 512 x 512 runtime
copies live under `public/assets/`. The built-in ImageGen workflow used
`stylized-concept` mode for both masters and `background-extraction` mode for a
targeted alpha cleanup of the vine source.

- Garden generation: `exec-ae3746f9-e9f6-4645-b8dd-9e62eec4a10f.png`.
- Original vine generation: `exec-f3e661b4-a5e0-4cb9-8998-1aefeb3ca2b5.png`.
- Retained vine cleanup edit: `exec-3109df52-36c4-4c10-a9eb-af24fc9903df.png`.

Garden overlay prompt:

```text
Use case: stylized-concept. Create a transparent top-down game terrain set-dressing overlay for light garden and woodland maze floors: sparse isolated clusters of tiny grass tufts, rounded clover leaves, miniature moss cushions, a few tiny blush-pink and cream wildflowers, and occasional small smooth pebbles. Use lovely cute polished chunky anime fantasy JRPG game art with soft hand-painted storybook rendering for a young child's maze game. Compose an orthographic square texture with many small irregular clusters, generous transparent negative space, no single focal object, and decoration small enough to sit inside grid-floor tiles. Use soft sage, mint, pale cream, dusty pink, and muted lavender-gray. Preserve genuine transparent alpha and soft clean edges. Keep decoration comfortably away from the outermost edge. No cast shadows, border, frame, text, logo, watermark, opaque background, large plants, tile grid lines, hard square patches, photorealism, or dramatic lighting.
```

Ivy overlay prompt:

```text
Use case: stylized-concept. Create a transparent top-down game terrain set-dressing overlay for old stone and hedge maze walls: sparse curling ivy tendrils, tiny rounded leaves, delicate moss patches, a few tiny star-shaped pale flowers, and subtle lichen flecks. Use lovely cute polished chunky anime fantasy JRPG game art with soft hand-painted storybook rendering for a young child's maze game. Compose an orthographic square texture with several small irregular clusters, generous transparent negative space, no single focal object, and decoration small enough to remain readable on maze wall tiles. Use deep sage, soft moss green, pale mint highlights, and tiny lavender and cream flowers. Preserve genuine transparent alpha and soft clean edges. Keep decoration comfortably away from the outermost edge. No cast shadows, border, frame, text, logo, watermark, opaque background, large branches, tile grid lines, hard square patches, photorealism, or dramatic lighting.
```

The retained vine master came from a targeted edit that removed neon spill while
preserving the painted leaves, flowers, moss, and natural alpha edges. Runtime
copies are rebuilt deterministically with:

```powershell
python scripts/process_terrain_dressing.py
python scripts/process_terrain_dressing.py --check
```

The overlays repeat over 13 world tiles at deliberately low opacity. Garden
dressing is limited to Star Garden and Wishing Woods, and vine dressing to
Lantern Ruins. There the green ivy stays sparse and subordinate to its dark
indigo wall, rather than changing the wall's dominant colour or path contrast.

### Weapons and friendly opponents

| Runtime asset | Concise generation prompt |
|---|---|
| `weapon-flower-sabre-v1.png` | One elegant toy-like silver flower sabre with pink blossoms and ribbon, diagonal, centered, transparent, no character or scenery. |
| `weapon-moon-wand-v1.png` | One crescent-moon crystal wand with stars and lavender ribbons, diagonal, centered, transparent, magical but not dangerous. |
| `weapon-leaf-blade-v1.png` | One glossy leaf-shaped green fantasy blade with curled storybook hilt and jewel, diagonal, centered, transparent. |
| `weapon-sun-mallet-v1.png` | One chunky golden sun mallet with coral handle and lavender bow, centered on transparency, cheerful and toy-like. |
| `enemy-blueberry-slime-v1.png` | One smiling blueberry-blue slime with leafy sprout, bright eyes, full-body tile sprite on transparency. |
| `enemy-mushroom-imp-v1.png` | One tiny cheerful mushroom child with red spotted cap and little twig, full-body tile sprite on transparency. |
| `enemy-moon-bat-v1.png` | One fluffy lavender moon bat with starry wings and friendly expression, full-body tile sprite on transparency. |
| `enemy-pebble-golem-v1.png` | One sturdy but sweet flower-covered pebble golem, readable as a friendly mini-boss, full-body tile sprite on transparency. |

Each master is 1254 × 1254. Runtime sprites are 512 × 512 RGBA PNGs produced by
high-quality downsampling and centering on a transparent square canvas. No
upscaling was used.

### New animal friends and cages

| Runtime asset | Concise generation prompt |
|---|---|
| `animal-puppy-v1.png` | One golden floppy-eared puppy with a lilac neckerchief, seated and smiling on transparency. |
| `animal-duckling-v1.png` | One fluffy yellow duckling with a mint bow, standing happily on transparency. |
| `animal-hedgehog-v1.png` | One round baby hedgehog with a tiny flower, seated with visible paws on transparency. |
| `animal-fawn-v1.png` | One gentle spotted baby fawn with a mint flower collar, seated on transparency. |
| `animal-red-panda-v1.png` | One fluffy baby red panda with a sky-blue bow, seated with curled striped tail on transparency. |
| `cage-storybook-wood-v1.png` | One empty rounded warm-wood-and-gold storybook rescue cage with visible interior, heart details, and transparent background. |
| `cage-moon-silver-v1.png` | One empty domed moon-silver rescue cage with crescent, star, and crystal details, visible interior, transparent background. |
| `cage-garden-vine-v1.png` | One empty rounded garden-vine cage with leaves, tiny flowers, heart latch, visible interior, transparent background. |

These also use 1254 × 1254 generation masters and 512 × 512 downsampled RGBA
runtime sprites with transparent corners and full alpha range. The three cage
masters came from built-in generations
`exec-223814d2-b544-429d-9cb1-dc6f749755b5.png`,
`exec-7a007e9c-1264-4bcb-8a7b-3d0d45db8ab7.png`, and
`exec-514e2d47-2993-44f2-a1ac-9bcea20d111d.png` respectively.

## Version 8 opaque cage-front layers

Build 0.8.0 replaces the translucent whole-cage runtime sprites with four
purpose-built front overlays. They were created with the built-in ImageGen
workflow in image-edit/reference mode, using each established cage design as
the visual reference. The common request preserved material, palette, lighting,
camera, scale, and placement while isolating only the front bars, door, lock,
base rail, and front-facing ornaments. Open spaces remain transparent; the
visible cage structure is fully opaque so an animal reads naturally behind it.

Common prompt intent:

```text
Create a centered 1:1 cute chunky anime fantasy JRPG sprite matching the supplied cage reference. Preserve its exact material, lighting, palette, camera, scale, and placement, but output only the fully opaque front bars, front door, lock, base rail, and front-facing ornaments. Keep every opening transparent and omit all rear cage geometry. No animal, text, watermark, external shadow, frame, scenery, or redesign.
```

| Cage style | Archived 1254 × 1254 master | 512 × 512 runtime overlay |
|---|---|---|
| Golden Heart | `docs/source-assets/cage-golden-heart-front-v2-master.png` | `public/assets/cage-golden-heart-front-v2.png` |
| Storybook Wood | `docs/source-assets/cage-storybook-wood-front-v2-master.png` | `public/assets/cage-storybook-wood-front-v2.png` |
| Moon Silver | `docs/source-assets/cage-moon-silver-front-v2-master.png` | `public/assets/cage-moon-silver-front-v2.png` |
| Garden Vine | `docs/source-assets/cage-garden-vine-front-v2-master.png` | `public/assets/cage-garden-vine-front-v2.png` |

Runtime copies were downsampled and alpha-cleaned for tile-size layering over
the existing animal sprites; no upscaling was used. The concise per-style record
is also retained at `docs/source-assets/cage-front-layer-prompts.md`. These cage
overlays are AI-generated bitmap assets; the stronger floor/wall contrast,
outline-free hazard rendering, follower motion, and responsive layout in 0.8.0
are code-native presentation changes rather than new generated artwork. The
0.8.0 local release pass checked the archived/runtime sources and verified the
opaque front-layer effect in play through normal rescue controls.

## Version 9 Spring Boots and ground-hole traversal art

Build 0.9.0 adds two purpose-built square traversal sprites generated with the
built-in OpenAI ImageGen workflow. Both generations returned native RGBA with a
fully transparent background, so no chroma-key removal or synthetic background
cutout was needed. The generated masters are retained unchanged for provenance;
`scripts/process_traversal_assets.py` validates alpha extrema and creates the
512 × 512 runtime PNGs with a high-quality Lanczos downsample. No upscaling is
performed.

### Spring Boots

- Built-in generated source:
  `exec-ed4e1058-de7f-4dbf-9579-c135c1122e6f.png`
- Archived generated master:
  `docs/source-assets/spring-boots-v1-master.png`
- Optimized runtime sprite: `public/assets/spring-boots-v1.png`
- Runtime URL: `/assets/spring-boots-v1.png`
- Runtime format: 512 × 512 RGBA PNG with alpha extrema `(0, 255)`

Prompt record (faithfully retained; whitespace normalized):

```text
Use case: stylized-concept. Create one square production game-item sprite for a gentle children's fantasy maze game: a matching pair of adorable chunky coral-pink Spring Boots, each boot fitted with a clearly readable polished golden coil spring beneath the sole and decorated with tiny mint star details. Lovely polished 2D hand-painted chunky anime fantasy RPG / storybook JRPG art, rounded toy-like shapes, subtle cream highlights, clean dark-plum linework, cheerful and magical, suitable for a five-year-old. Pure front three-quarter item view, exactly one matching pair, centred with generous even padding and a strong simple silhouette that remains readable inside one 1:1 maze tile. Output a genuine transparent RGBA background. No character, feet, ground, floor plane, cast shadow, scenery, border, frame, text, number, logo, watermark, duplicate pair, cropped parts, or background colour.
```

### Ground hole

- Built-in generated source:
  `exec-11534dc6-1466-42c3-8fa3-602a4ac2b452.png`
- Archived generated master:
  `docs/source-assets/ground-hole-v1-master.png`
- Optimized runtime sprite: `public/assets/ground-hole-v1.png`
- Runtime URL: `/assets/ground-hole-v1.png`
- Runtime format: 512 × 512 RGBA PNG with alpha extrema `(0, 255)`

Prompt record (faithfully retained; whitespace normalized):

```text
Use case: stylized-concept. Create one square production terrain-overlay sprite for a gentle children's fantasy maze game: a single cute top-down ground hole or shallow magical pit, with a dark plum oval centre, soft taupe and dusty-lilac inner earth rings, a slightly irregular rounded organic edge, and a few tiny friendly stone nubs. Lovely polished 2D hand-painted chunky anime fantasy RPG / storybook JRPG art, soft pastel colour, readable at one 1:1 maze tile, safe and whimsical rather than frightening. Purely top-down orthographic view, one centred compact hole with generous transparent padding so neighbouring holes can form a clean row. Output a genuine transparent RGBA background and softly antialiased silhouette. No floor texture outside the rim, coloured outline, glow, drop shadow, raised platform, lava, water, spikes, character, item, scenery, frame, text, number, logo, or watermark.
```

The runtime renderer places the hole as a flat terrain overlay without a CSS
shadow, filter, or coloured outline. Collision and multi-square jumping are
code-native mechanics; only the illustrated hole and boots are generated bitmap
art.

## Version 10 poison and Antidote Leaf art

Build 0.10.0 adds two bitmap assets produced with the built-in OpenAI ImageGen
workflow in new-image mode (no reference image). The original generated files
remain in the Codex generation store and are copied unchanged into
`docs/source-assets` for provenance.

### Magical poison texture

- Built-in generated source:
  `C:/Users/hellb/.codex/generated_images/01a05916-8b99-7721-bceb-35b3a6460521/exec-01bc00e3-9cfe-42c9-b014-f6bed1642d81.png`
- Archived master: `docs/source-assets/terrain-poison-v1-master.png`
- Periodic runtime texture: `public/assets/terrain-poison-v1.png`
- Processing: 1024 × 1024 RGB resize, periodic-plus-smooth Poisson boundary
  correction, and optimized 256-colour PNG output through
  `scripts/process_terrain_textures.py`

Exact prompt:

```text
Create a single square 1:1 game texture asset for a cute children's fantasy maze game titled "Maze so Puzzle: For Ame to Solve!".
SUBJECT: a top-down magical poison puddle surface texture, soft lilac and grape-purple liquid with small mint-green bubbles and gentle pearly highlights. It must feel harmless, whimsical, and clearly different from water and lava.
STYLE: lovely simple chunky anime fantasy JRPG art, soft pastel palette, polished 3DS-era storybook game rendering, rounded painted forms, subtle material depth, suitable for a five-year-old.
COMPOSITION: texture fills the entire square canvas uniformly; orthographic top-down view; no horizon and no perspective; evenly distributed small motifs; quiet center and edges so repeated copies do not reveal a focal point.
TILING: designed as a seamless repeatable material; left edge must naturally continue into right edge and top edge into bottom edge; no border, frame, lip, rim, shadow, vignette, tile outline, large central blob, path, floor around it, objects, characters, icons, letters, or text.
BACKGROUND/OUTPUT: opaque full-bleed texture, clean high-resolution square PNG. The game will programmatically inset and softly feather connected poison regions over a floor texture.
```

### Antidote Leaf

- Built-in generated source:
  `C:/Users/hellb/.codex/generated_images/01a05916-8b99-7721-bceb-35b3a6460521/exec-adc496d8-70eb-4fa4-8d50-5f7d8042ea70.png`
- Archived master: `docs/source-assets/antidote-leaf-v1-master.png`
- Runtime sprite: `public/assets/antidote-leaf-v1.png`
- Processing: 512 × 512 RGBA Lanczos downsample with the source transparency
  validated and preserved by `scripts/process_traversal_assets.py`

Exact prompt:

```text
Create one isolated inventory and maze pickup sprite for a cute children's fantasy maze game titled "Maze so Puzzle: For Ame to Solve!".
SUBJECT: a magical antidote leaf — one plump mint-and-teal leaf with a softly glowing pale vein, a tiny lavender ribbon tied around its short stem, and two small sparkling dew drops. It should immediately read as a friendly protective herb that lets a child cross purple poison.
STYLE: lovely simple chunky anime fantasy JRPG sprite, soft pastel colors, rounded toy-like forms, polished 3DS-era storybook game rendering, crisp silhouette, bright and cheerful, suitable for a five-year-old.
COMPOSITION: centered single object, fully visible, roughly 75% of the square, balanced 1:1 tile silhouette, readable at tiny game-sprite size. Front/top three-quarter icon view with no scene and no floor.
BACKGROUND/OUTPUT: transparent background with clean antialiased cutout edges and no cast shadow outside the object. No frame, badge, circle, pedestal, hand, character, extra plants, letters, labels, numbers, or text. High-resolution square PNG.
```

Both runtime assets are preloaded only for levels that use them. Connected
poison geometry, collision gating, the leaf's inventory state, and the soft
inset/feathered region mask are code-native behavior rather than generated art.

## Version 10.3 lock pairs and sparse cage fronts

Build 0.10.3 adds four dedicated lock sprites and replaces all four active cage
fronts with much sparser v4 overlays. All eight images were produced through the
built-in OpenAI ImageGen workflow in **image-edit/reference mode**: an existing
key, door, or cage was supplied as Image 1 so the new object retained the game's
established chunky anime storybook JRPG rendering. This was not new-image mode.
The existing `star-key.png` and `star-door.png` remain the Blue Star pair and
were not regenerated in this pass.

Each built-in result is a native 1254 × 1254 RGBA image. The generated output is
archived unchanged in `docs/source-assets`; a 512 × 512 RGBA downsample with the
source alpha preserved is shipped from `public/assets`. Archived v4 filenames
deliberately do not use a `-master` suffix.

### Exact generated-output and production mapping

| Asset | Built-in generated source | Archived generated source | Production runtime asset |
|---|---|---|---|
| Golden Heart cage front v4 | `C:/Users/hellb/.codex/generated_images/01a05916-8b99-7721-bceb-35b3a6460521/exec-297f2f0d-81f8-42e5-a8f9-7cda4f0858bf.png` | `docs/source-assets/cage-golden-heart-front-v4.png` | `public/assets/cage-golden-heart-front-v4.png` |
| Storybook Wood cage front v4 | `C:/Users/hellb/.codex/generated_images/01a05916-8b99-7721-bceb-35b3a6460521/exec-74946821-4baf-4000-aabc-4ffc07fa2405.png` | `docs/source-assets/cage-storybook-wood-front-v4.png` | `public/assets/cage-storybook-wood-front-v4.png` |
| Moon Silver cage front v4 | `C:/Users/hellb/.codex/generated_images/01a05916-8b99-7721-bceb-35b3a6460521/exec-03be4f48-93fe-460c-87c7-b3cdcd17dcc9.png` | `docs/source-assets/cage-moon-silver-front-v4.png` | `public/assets/cage-moon-silver-front-v4.png` |
| Garden Vine cage front v4 | `C:/Users/hellb/.codex/generated_images/01a05916-8b99-7721-bceb-35b3a6460521/exec-652f9c72-66b6-4ae0-bd74-ef7231fb9d86.png` | `docs/source-assets/cage-garden-vine-front-v4.png` | `public/assets/cage-garden-vine-front-v4.png` |
| Rose Heart Key | `C:/Users/hellb/.codex/generated_images/01a05916-8b99-7721-bceb-35b3a6460521/exec-86954c5b-6374-49c8-9a79-4cc7bb169446.png` | `docs/source-assets/key-rose-heart-v1.png` | `public/assets/key-rose-heart-v1.png` |
| Sunny Sun Key | `C:/Users/hellb/.codex/generated_images/01a05916-8b99-7721-bceb-35b3a6460521/exec-019d8827-84af-4e30-a6ac-ceae04e26602.png` | `docs/source-assets/key-sunny-sun-v1.png` | `public/assets/key-sunny-sun-v1.png` |
| Rose Heart Door | `C:/Users/hellb/.codex/generated_images/01a05916-8b99-7721-bceb-35b3a6460521/exec-11992432-0fb9-4fe4-80d3-3345b90fb405.png` | `docs/source-assets/door-rose-heart-v1.png` | `public/assets/door-rose-heart-v1.png` |
| Sunny Sun Door | `C:/Users/hellb/.codex/generated_images/01a05916-8b99-7721-bceb-35b3a6460521/exec-9460311e-8212-4124-9bf5-4151ee32592f.png` | `docs/source-assets/door-sunny-sun-v1.png` | `public/assets/door-sunny-sun-v1.png` |

The runtime catalogue pairs these with the retained Blue Star art as follows:

| Engine colour | Child-readable pair | Key | Door |
|---|---|---|---|
| `red` | Rose Heart | `public/assets/key-rose-heart-v1.png` | `public/assets/door-rose-heart-v1.png` |
| `blue` | Blue Star | `public/assets/star-key.png` | `public/assets/star-door.png` |
| `yellow` | Sunny Sun | `public/assets/key-sunny-sun-v1.png` | `public/assets/door-sunny-sun-v1.png` |

### Exact key and door prompts

Rose Heart Key:

```text
Use case: precise object edit for a browser game tile sprite.
Image 1 is the edit target and rendering/style reference. Preserve the cute chunky anime fantasy JRPG asset quality, readable proportions, polished pastel materials, and square transparent sprite layout.
Redesign the object as a pink heart-shaped key: large faceted rose-pink heart bow, tiny cream wings, warm gold shaft, clearly heart-shaped silhouette; no star anywhere. The key and its matching door must be instantly distinguishable by motif and dominant color at very small tile size.
Output one centered isolated object only, true transparent background, no text, no label, no scenery, no floor, no cast shadow, no extra objects.
```

Sunny Sun Key:

```text
Use case: precise object edit for a browser game tile sprite.
Image 1 is the edit target and rendering/style reference. Preserve the cute chunky anime fantasy JRPG asset quality, readable proportions, polished pastel materials, and square transparent sprite layout.
Redesign the object as a sunny yellow sun-shaped key: large round golden-yellow smiling sun bow with eight chunky rays, orange-gold shaft, clearly sun-shaped silhouette; no star or heart anywhere. The key and its matching door must be instantly distinguishable by motif and dominant color at very small tile size.
Output one centered isolated object only, true transparent background, no text, no label, no scenery, no floor, no cast shadow, no extra objects.
```

Rose Heart Door:

```text
Use case: precise object edit for a browser game tile sprite.
Image 1 is the edit target and rendering/style reference. Preserve the cute chunky anime fantasy JRPG asset quality, readable proportions, polished pastel materials, and square transparent sprite layout.
Redesign the object as a magical pink heart door: cream-and-rose arched door with one huge faceted pink heart crest and heart-shaped lock, warm gold trim; no star anywhere. The key and its matching door must be instantly distinguishable by motif and dominant color at very small tile size.
Output one centered isolated object only, true transparent background, no text, no label, no scenery, no floor, no cast shadow, no extra objects.
```

Sunny Sun Door:

```text
Use case: precise object edit for a browser game tile sprite.
Image 1 is the edit target and rendering/style reference. Preserve the cute chunky anime fantasy JRPG asset quality, readable proportions, polished pastel materials, and square transparent sprite layout.
Redesign the object as a magical sunny yellow sun door: pale yellow and warm orange arched door with one huge round sun crest with eight chunky rays and sun-shaped lock, warm gold trim; no star or heart anywhere. The key and its matching door must be instantly distinguishable by motif and dominant color at very small tile size.
Output one centered isolated object only, true transparent background, no text, no label, no scenery, no floor, no cast shadow, no extra objects.
```

### Exact sparse cage-front prompts

Golden Heart:

```text
Use case: precise object simplification for a browser game tile sprite.
Image 1 is the edit target and style reference. Keep its lovely chunky anime JRPG rendering and warm pastel gold with tiny pink heart gems, but make the cage front dramatically sparser so a separate cute animal sprite behind it stays clearly visible at 80-pixel tile size.
Required exact structure: one low decorative base rail occupying only the bottom 18% of the square; two narrow side posts; EXACTLY THREE narrow, evenly spaced vertical front bars rising from the base and ending separately near 72% height. Add one tiny centered lock ornament on the base only. At least 70% of the central area must remain fully transparent.
Completely remove the central door panel, door arch, top rail, curved roof, dome, rear bars, rear floor, broad frame, and any horizontal piece above the base. Bars must be thin and must not connect across the top.
Output one centered 1:1 sprite with true transparent background. No animal, no text, no label, no scenery, no ground, no cast shadow, no checkerboard.
```

Storybook Wood:

```text
Use case: precise object simplification for a browser game tile sprite.
Image 1 is the edit target and style reference. Keep its lovely chunky anime JRPG rendering and warm pastel honey wood with tiny carved flower details, but make the cage front dramatically sparser so a separate cute animal sprite behind it stays clearly visible at 80-pixel tile size.
Required exact structure: one low decorative base rail occupying only the bottom 18% of the square; two narrow side posts; EXACTLY THREE narrow, evenly spaced vertical front bars rising from the base and ending separately near 72% height. Add one tiny centered lock ornament on the base only. At least 70% of the central area must remain fully transparent.
Completely remove the central door panel, door arch, top rail, curved roof, dome, rear bars, rear floor, broad frame, and any horizontal piece above the base. Bars must be thin and must not connect across the top.
Output one centered 1:1 sprite with true transparent background. No animal, no text, no label, no scenery, no ground, no cast shadow, no checkerboard.
```

Moon Silver:

```text
Use case: precise object simplification for a browser game tile sprite.
Image 1 is the edit target and style reference. Keep its lovely chunky anime JRPG rendering and cool pastel moon-silver with tiny pale-blue crescent gems, but make the cage front dramatically sparser so a separate cute animal sprite behind it stays clearly visible at 80-pixel tile size.
Required exact structure: one low decorative base rail occupying only the bottom 18% of the square; two narrow side posts; EXACTLY THREE narrow, evenly spaced vertical front bars rising from the base and ending separately near 72% height. Add one tiny centered lock ornament on the base only. At least 70% of the central area must remain fully transparent.
Completely remove the central door panel, door arch, top rail, curved roof, dome, rear bars, rear floor, broad frame, and any horizontal piece above the base. Bars must be thin and must not connect across the top.
Output one centered 1:1 sprite with true transparent background. No animal, no text, no label, no scenery, no ground, no cast shadow, no checkerboard.
```

Garden Vine:

```text
Use case: precise object simplification for a browser game tile sprite.
Image 1 is the edit target and style reference. Keep its lovely chunky anime JRPG rendering and pastel gold and green vines with only a few tiny pink flowers, but make the cage front dramatically sparser so a separate cute animal sprite behind it stays clearly visible at 80-pixel tile size.
Required exact structure: one low decorative base rail occupying only the bottom 18% of the square; two narrow side posts; EXACTLY THREE narrow, evenly spaced vertical front bars rising from the base and ending separately near 72% height. Add one tiny centered lock ornament on the base only. At least 70% of the central area must remain fully transparent.
Completely remove the central door panel, door arch, top rail, curved roof, dome, rear bars, rear floor, broad frame, and any horizontal piece above the base. Bars must be thin and must not connect across the top.
Output one centered 1:1 sprite with true transparent background. No animal, no text, no label, no scenery, no ground, no cast shadow, no checkerboard.
```

The v4 cage assets supersede the v2 runtime overlays documented above; the v2
section remains as provenance for the earlier build. Lock matching, key/door
labels, asset resolution, preloading, cage layering, and pickup presentation are
code-native behavior rather than additional generated imagery.

## Version 11 paired flower portals

Build 0.11.0 adds three paired-portal floor-pad sprites. The Rose Heart portal
was produced with the built-in OpenAI ImageGen workflow in **new-image mode**.
The Mint Clover and Violet Moon variants were then produced in
**image-edit/reference mode**, each using the Rose Heart output as Image 1 so
all three retain the same silhouette, camera angle, scale, and material style.

| Portal | Built-in generated source | Archived generated source | Production runtime asset |
|---|---|---|---|
| Rose Heart | `C:/Users/hellb/.codex/generated_images/01a05916-8b99-7721-bceb-35b3a6460521/exec-b5a75e5d-edc0-4150-a749-13af8cce5546.png` | `docs/source-assets/portal-rose-heart-v1.png` | `public/assets/portal-rose-heart-v1.png` |
| Mint Clover | `C:/Users/hellb/.codex/generated_images/01a05916-8b99-7721-bceb-35b3a6460521/exec-3e60d023-5ef8-4a36-9a3c-f45f04431569.png` | `docs/source-assets/portal-mint-clover-v1.png` | `public/assets/portal-mint-clover-v1.png` |
| Violet Moon | `C:/Users/hellb/.codex/generated_images/01a05916-8b99-7721-bceb-35b3a6460521/exec-2e1ca49f-8995-4494-847e-745eb1b1f314.png` | `docs/source-assets/portal-violet-moon-v1.png` | `public/assets/portal-violet-moon-v1.png` |

The generated sources are archived unchanged. Rose Heart contains genuine
alpha; the Mint Clover and Violet Moon edits visualised transparency as a
near-white neutral checkerboard. `scripts/process_portal_assets.py` removes only
that edge-connected neutral field, leaving the enclosed cream petals opaque,
then places a 470 × 470 high-quality Lanczos downsample on a transparent 512 ×
512 canvas. All runtime files have transparent outer edges and full alpha range. Pairing,
teleportation, minimap motifs, hints, fog reveal, save validation, sound, and
the programmatic warp animation are code-native behavior.

### Rose Heart exact prompt

```text
Use case: stylized-concept
Asset type: transparent 1:1 game-object sprite for a browser maze tile
Primary request: a single magical paired-portal floor pad shaped like a five-petal flower, with a very clear pink heart motif in its glowing centre. It should read instantly as a friendly warp pad that Ame can step onto.
Scene/backdrop: none; genuinely transparent background
Subject: one low-profile circular flower portal pad only, seen from a mostly top-down three-quarter game-camera angle; chunky petals form the outer ring, luminous heart-shaped centre, tiny restrained sparkles contained close to the object
Style/medium: lovely cute simple chunky anime fantasy JRPG sprite, cheerful polished 3DS-era adventure-game rendering, soft painterly 3D illustration, child-friendly
Composition/framing: perfectly centred in a square canvas, complete object visible, generous transparent padding, object fills about 80% of the tile and sits visually flat on a floor tile
Lighting/mood: warm magical glow, joyful and safe, high readability at small size
Color palette: soft rose pink, peach, cream and small gold highlights; strong readable separation between outer petals and heart centre
Constraints: actual alpha transparency; clean cutout edges; no square backing tile; no cast shadow beyond the object; no character; no animal; no text; no number; no UI frame; no scenery; no watermark; one object only
Avoid: photorealism, thin delicate linework, dark ominous portal, large bloom obscuring the silhouette, side view, floating ring
```

### Mint Clover exact edit prompt

```text
Use case: stylized-concept
Asset type: transparent 1:1 game-object sprite variant
Input images: Image 1 is the edit target and exact structural/style reference
Primary request: change the pink heart flower portal into a mint-green clover portal for the matching second portal pair
Subject: preserve the exact same low-profile five-petal floor-pad geometry, camera angle, scale, padding, chunky materials, lighting quality and transparent cutout; replace the central heart vortex with one unmistakable four-leaf clover shape; change the palette to soft mint, turquoise, cream and small gold highlights
Constraints: change only the palette and central/ornamental motif; keep the full object silhouette, proportions, rendering style, alpha transparency and framing unchanged; actual transparent background; no square tile; no text; no character; no scenery; no watermark
Avoid: heart shapes remaining anywhere, dark green, extra objects, taller side-view structure
```

### Violet Moon exact edit prompt

```text
Use case: stylized-concept
Asset type: transparent 1:1 game-object sprite variant
Input images: Image 1 is the edit target and exact structural/style reference
Primary request: change the pink heart flower portal into a violet crescent-moon portal for the matching third portal pair
Subject: preserve the exact same low-profile five-petal floor-pad geometry, camera angle, scale, padding, chunky materials, lighting quality and transparent cutout; replace the central heart vortex with one unmistakable crescent moon and small four-point star; replace every small heart ornament on the petals with simple crescent or star flourishes; change the palette to soft lilac, violet, periwinkle, cream and small gold highlights
Constraints: change only the palette and motifs; keep the full object silhouette, proportions, rendering style, alpha transparency and framing unchanged; actual transparent background; no square tile; no text; no character; no scenery; no watermark
Avoid: any heart or clover shapes, dark ominous magic, extra objects, taller side-view structure
```

## Build 0.12.0: treasure and navigation art

Build 0.12.0 uses the built-in OpenAI ImageGen workflow in
**referenced-image mode**. Collectibles used `public/assets/coin-pouch.png` as a
style reference; navigation symbols used `public/assets/reward-trail-sticker.png`.
The reference established rendering language only—the outputs are new objects.
Generated PNG masters are archived unchanged, and
`scripts/process_v12_assets.py` makes lossless transparent WebP runtime copies.

| Asset | Built-in generated source | Archived master | Runtime asset |
|---|---|---|---|
| Gold chest | `C:/Users/hellb/.codex/generated_images/01a05916-8b99-7721-bceb-35b3a6460521/exec-07733947-b7d6-48c8-adca-4c7390f7b6ff.png` | `docs/source-assets/treasure-gold-chest-v1-master.png` | `public/assets/treasure-gold-chest-v1.webp` |
| Science gears | `C:/Users/hellb/.codex/generated_images/01a05916-8b99-7721-bceb-35b3a6460521/exec-c989f299-ed59-4f41-91df-c7cb5a65c560.png` | `docs/source-assets/treasure-science-gears-v1-master.png` | `public/assets/treasure-science-gears-v1.webp` |
| Science beaker | `C:/Users/hellb/.codex/generated_images/01a05916-8b99-7721-bceb-35b3a6460521/exec-983f0bee-6b37-46d3-8096-876386e0d7ce.png` | `docs/source-assets/treasure-science-beaker-v1-master.png` | `public/assets/treasure-science-beaker-v1.webp` |
| Home | `C:/Users/hellb/.codex/generated_images/01a05916-8b99-7721-bceb-35b3a6460521/exec-4e3d28ca-e427-45bc-9d04-23b3574aaa67.png` | `docs/source-assets/nav-home-v1-master.png` | `public/assets/nav-home-v1.webp` |
| Mazes | `C:/Users/hellb/.codex/generated_images/01a05916-8b99-7721-bceb-35b3a6460521/exec-cc1dd1ed-87d9-4a39-99b5-f442426ece7f.png` | `docs/source-assets/nav-mazes-v1-master.png` | `public/assets/nav-mazes-v1.webp` |
| Book | `C:/Users/hellb/.codex/generated_images/01a05916-8b99-7721-bceb-35b3a6460521/exec-74d5de50-12fb-4614-8a71-9b0d76b1ebf9.png` | `docs/source-assets/nav-book-v1-master.png` | `public/assets/nav-book-v1.webp` |
| Help | `C:/Users/hellb/.codex/generated_images/01a05916-8b99-7721-bceb-35b3a6460521/exec-4f02dfc8-26f8-4d9b-9478-1ff5c77b95bf.png` | `docs/source-assets/nav-help-v1-master.png` | `public/assets/nav-help-v1.webp` |
| Sound | `C:/Users/hellb/.codex/generated_images/01a05916-8b99-7721-bceb-35b3a6460521/exec-0fc28be2-4065-4b4c-b7a4-de84e9aa5b4b.png` | `docs/source-assets/nav-sound-v1-master.png` | `public/assets/nav-sound-v1.webp` |
| Restart | `C:/Users/hellb/.codex/generated_images/01a05916-8b99-7721-bceb-35b3a6460521/exec-d22fd5bb-88b1-46a2-99de-b994e21a3fe8.png` | `docs/source-assets/nav-restart-v1-master.png` | `public/assets/nav-restart-v1.webp` |

### Collectible common prompt prefix

Each collectible prompt is this exact prefix followed immediately by its exact
object block below.

```text
Use case: stylized-concept
Asset type: transparent 1:1 game-object sprite for Maze so Puzzle
Input images: Image 1 is a style reference only; create a new object with the same lovely polished chunky anime fantasy JRPG rendering, warm gold trim, soft pastel materials, clean dark-plum outline and child-friendly 3DS-era storybook finish
Scene/backdrop: none; genuinely transparent background
Composition/framing: one centred isolated object, complete silhouette visible, generous even transparent padding, readable in one square maze tile
Lighting/mood: cheerful soft studio sparkle, magical and rewarding
Constraints: actual alpha transparency; no square backing tile; no floor; no cast shadow outside the object; no character; no animal; no text; no number; no UI frame; no watermark; one object only
```

#### Gold chest exact object block

```text
Primary request: a small open treasure chest overflowing with chunky golden star coins, a lavender wooden chest body, cream inner lining and one large star-shaped golden latch
Color palette: lavender, cream, peach and luminous gold
Avoid: closed lid, realistic money, gems dominating the chest, weapon, bag
```

#### Science gears exact object block

```text
Primary request: a compact cluster of three friendly magical science gears, one mint gear, one lilac gear and one warm-gold gear, with a tiny four-point sparkle and clear interlocking teeth
Color palette: mint, turquoise, lilac, cream and warm gold
Avoid: industrial grime, machinery scene, clock face, bag, chest, letters
```

#### Science beaker exact object block

```text
Primary request: one cute round laboratory beaker with a short glass neck, filled with glowing turquoise-and-lilac bubbly liquid, a tiny golden star stopper charm and two contained sparkles
Color palette: transparent pale-blue glass, mint, turquoise, lilac, cream and warm gold
Avoid: danger symbols, poison, realistic laboratory scene, red liquid, letters
```

### Navigation common prompt prefix

Each navigation prompt is this exact prefix followed immediately by its exact
symbol block below.

```text
Use case: stylized-concept
Asset type: transparent square game UI navigation icon for Maze so Puzzle
Input images: Image 1 is a style reference only; create a new simple pictogram with the same polished chunky anime fantasy JRPG rendering, creamy enamel, lavender-plum outline, small warm-gold trim and soft pastel 3DS storybook finish
Scene/backdrop: none; genuinely transparent background
Composition/framing: one large centred pictogram only, bold simple silhouette, generous transparent padding, readable at 28 pixels
Lighting/mood: bright, friendly, calm
Constraints: actual alpha transparency; no circular button backing; no square backing; no words; no letters; no numbers; no character; no scenery; no watermark; one symbol only
```

#### Home exact symbol block

```text
Primary request: a tiny cosy storybook cottage silhouette with a heart-shaped doorway and one small chimney
Color palette: cream, blush pink, lavender and warm gold
Avoid: landscape, trees, text, multiple buildings
```

#### Mazes exact symbol block

```text
Primary request: one cute folded miniature maze map with a simple winding lavender path and a tiny golden destination star, composed as one unified pictogram
Color palette: cream paper, lavender path, mint accent and warm gold
Avoid: compass, readable writing, landscape, multiple maps, question mark
```

#### Book exact symbol block

```text
Primary request: one open magical adventure book with a small golden star on the left page and a tiny paw print on the right page
Color palette: cream pages, lavender cover, blush ribbon and warm gold
Avoid: readable writing, loose pages, library scene, text
```

#### Help exact symbol block

```text
Primary request: one friendly glowing idea lantern shaped like a rounded flower bud, with a small golden sparkle in its centre; it must communicate help and hints without using a question mark
Color palette: cream, sunny gold, peach and lavender
Avoid: question mark, text, hand, character, dark metal lantern
```

#### Sound exact symbol block

```text
Primary request: one small lavender music bell with two floating golden musical notes, composed as one unified pictogram
Color palette: lavender, cream, blush and warm gold
Avoid: speaker box, headphones, text, more than two notes
```

#### Restart exact symbol block

```text
Primary request: one circular curling lavender ribbon arrow wrapped around a small golden four-point sparkle, clearly communicating restart
Color palette: lavender, cream, mint accent and warm gold
Avoid: text, clock face, multiple arrows, red warning color
```

## Build 0.13.0: Puzzlewild story portraits

Build 0.13.0 uses the built-in OpenAI ImageGen workflow in
**referenced-image generation mode**. Image 1 was
public/assets/ame-portrait.png and served only as the visual style reference;
both outputs are wholly new characters. The generated PNG masters are archived
unchanged. scripts/process_v13_story_assets.py creates 512 × 512, quality-92
WebP runtime portraits while retaining the original medallion backgrounds.

| Character | Built-in generated source | Archived master | Runtime asset |
|---|---|---|---|
| Professor Poggle | C:/Users/hellb/.codex/generated_images/01a05916-8b99-7721-bceb-35b3a6460521/exec-f11f29ef-f7a0-4ba3-9e3f-e3a934ce62e2.png | docs/source-assets/story-professor-poggle-v1-master.png | public/assets/story-professor-poggle-v1.webp |
| Sprig | C:/Users/hellb/.codex/generated_images/01a05916-8b99-7721-bceb-35b3a6460521/exec-0241a443-4442-482b-a9af-e56eb9be661e.png | docs/source-assets/story-sprig-v1-master.png | public/assets/story-sprig-v1.webp |

### Professor Poggle exact prompt

~~~text
Use case: stylized-concept
Asset type: square story-dialogue character portrait for Maze so Puzzle
Primary request: create Professor Poggle, a tiny round tawny owl fantasy cartographer with oversized teal spectacles, a lavender scholar cape, a cream waistcoat, and a little rolled map tucked under one wing
Input images: Image 1 is a visual style reference only for the same polished chunky anime fantasy JRPG portrait rendering, warm storybook lighting, expressive child-friendly face, clean dark-plum outlines and soft 3DS-era painted finish; create a wholly new character
Scene/backdrop: warm cream-and-mint radial storybook medallion with a few restrained golden stars
Subject: one cheerful owl professor, chest-up, looking toward the viewer, delighted and slightly silly, spectacles sitting a little crooked
Style/medium: cute chunky anime fantasy JRPG painted character portrait
Composition/framing: centred 1:1 portrait, complete ears/feather tufts and cape visible, generous safe padding for a circular UI crop
Lighting/mood: warm, magical, clever, comical and safe
Color palette: tawny caramel, cream, mint, teal, lavender and warm gold
Constraints: no text; no letters; no numbers; no watermark; no human; no extra character; no border outside the medallion
Avoid: realistic bird photography, scary talons, stern expression, graduation cap, dark background
~~~

### Sprig exact prompt

~~~text
Use case: stylized-concept
Asset type: square story-dialogue character portrait for Maze so Puzzle
Primary request: create Sprig, a tiny round baby cloud-dragon whose harmless glitter sneeze tangled the magical Star Map, with two soft mint horns, lilac winglets, peachy cream scales, a star-shaped golden nose freckle and a bashful happy expression
Input images: Image 1 is a visual style reference only for the same polished chunky anime fantasy JRPG portrait rendering, warm storybook lighting, expressive child-friendly face, clean dark-plum outlines and soft 3DS-era painted finish; create a wholly new character
Scene/backdrop: pale sky-blue-and-lilac radial storybook medallion with tiny puffy clouds and restrained golden sparkles
Subject: one cute baby dragon, chest-up, looking toward the viewer, cheeks puffed as if trying not to sneeze, absolutely friendly
Style/medium: cute chunky anime fantasy JRPG painted character portrait
Composition/framing: centred 1:1 portrait, complete horns and winglets visible, generous safe padding for a circular UI crop
Lighting/mood: sweet, magical, silly, apologetic and safe
Color palette: peach cream, mint, lilac, sky blue and warm gold
Constraints: no text; no letters; no numbers; no watermark; no fire; no extra character; no border outside the medallion
Avoid: reptilian realism, sharp teeth, scary eyes, dark background, large adult dragon
~~~
## Build 0.15.0: rescue-friend, enemy, and weapon variety

Build 0.15.0 used the built-in OpenAI ImageGen workflow in `stylized-concept`
mode. Each output was generated as a distinct asset. Existing local sprites were
supplied only as style/finish references; no existing subject was edited.

### Rescue-friend prompt template

Reference image role: style reference only,
`public/assets/animal-red-panda-v1.png`.

```text
Use case: stylized-concept
Asset type: transparent 1:1 rescue-friend game sprite
Primary request: Create one production sprite of <SUBJECT>.
Input image: the supplied red panda sprite is a style and finish reference only; create a completely new animal subject.
Style/medium: lovely polished 2D hand-painted chunky anime fantasy RPG / child-friendly JRPG art; rounded plush toy-like anatomy, clean dark-plum linework, soft dimensional shading, detailed but readable at small size.
Composition/framing: exactly one full-body animal, front three-quarter view, centred, generous even transparent padding, strong simple silhouette fitting a square maze tile.
Lighting/mood: soft warm studio light, safe, cuddly and joyful.
Color palette: soft harmonious pastels with warm natural fur.
Constraints: genuine transparent RGBA background; preserve clean softly antialiased edges; no cage because cage bars are layered separately.
Avoid: scenery, ground, floor plane, cast shadow, border, frame, text, number, logo, watermark, duplicate animal, cropped ears, feet or tail, weapon, enemy pose, photorealism.
```

| ID | `<SUBJECT>` | Built-in output | Runtime |
| --- | --- | --- | --- |
| Otter | a tiny cuddly river otter sitting upright, warm cocoa-brown fur, cream muzzle and tummy, round sparkling amber eyes, little mint neckerchief, friendly excited smile, compact tail curled beside it | `exec-950f3c3f-789b-47c0-a67e-a7c155fc2e60.png` | `public/assets/animal-otter-v1.png` |
| Lamb | a tiny cuddly lamb sitting upright, fluffy cream wool, peach-pink ears and nose, round sparkling violet eyes, little lavender neck ribbon with a gold star bell, sweet happy smile | `exec-57f084d6-ce40-4f97-bf53-54bad6882337.png` | `public/assets/animal-lamb-v1.png` |
| Capybara | a tiny cuddly baby capybara sitting upright, soft caramel-brown fur, rounded muzzle and ears, round sparkling dark eyes, tiny sky-blue satchel scarf, gentle cheerful smile | `exec-cba746d6-882e-4c8b-80cb-75a874415880.png` | `public/assets/animal-capybara-v1.png` |

### Friendly-enemy prompt template

Reference image role: style reference only,
`public/assets/enemy-mushroom-imp-v1.png`.

```text
Use case: stylized-concept
Asset type: transparent 1:1 friendly enemy game sprite
Primary request: Create one production sprite of <SUBJECT>.
Input image: the supplied mushroom imp sprite is a style and finish reference only; create a completely new enemy subject.
Style/medium: lovely polished 2D hand-painted chunky anime fantasy RPG / child-friendly JRPG art; rounded toy-like anatomy, clean dark-plum linework, soft dimensional shading, readable at small size.
Composition/framing: exactly one full-body enemy, front three-quarter view, centred, generous even transparent padding, strong silhouette fitting a square maze tile.
Lighting/mood: soft warm studio light; silly, low-stakes and cute rather than threatening.
Color palette: harmonious soft fantasy pastels with clear contrast.
Constraints: genuine transparent RGBA background; clean softly antialiased edges; full subject visible.
Avoid: scenery, ground, floor plane, cast shadow, border, frame, text, number, logo, watermark, duplicate creature, cropped parts, blood, injury, realistic violence, frightening teeth, photorealism.
```

| ID | `<SUBJECT>` | Built-in output | Runtime |
| --- | --- | --- | --- |
| Acorn Knight | a tiny mischievous acorn knight creature, round polished acorn-cap helmet, warm chestnut body, leafy green cape, stubby wooden spoon lance, sturdy little boots, playful determined grin | `exec-cabb2a1c-012b-4b60-8b25-e7f34d9216e8.png` | `public/assets/enemy-acorn-knight-v1.png` |
| Bubble Dragon | a tiny mischievous bubble dragon, round lavender-blue body, small mint wings, pearly bubble scales, curled tail, tiny harmless horns, playful competitive grin and bright teal eyes | `exec-fb52ea12-5734-4e41-a5d0-a50fd20fb91b.png` | `public/assets/enemy-bubble-dragon-v1.png` |
| Candy Mimic | a tiny mischievous candy treasure-chest mimic, rounded strawberry-pink chest body with cream frosting trim, little mitten hands and booted feet, a lid-mouth with one harmless marshmallow tooth, playful bright-eyed grin | `exec-169372b7-88cf-44cd-8407-0f00028affaf.png` | `public/assets/enemy-candy-mimic-v1.png` |

### Weapon prompt template

Reference image role: style reference only,
`public/assets/weapon-flower-sabre-v1.png`.

```text
Use case: stylized-concept
Asset type: transparent 1:1 collectible weapon game sprite
Primary request: Create one production item sprite of <SUBJECT>.
Input image: the supplied Flower Sabre sprite is a style, polish and framing reference only; create a completely new weapon.
Style/medium: lovely polished 2D hand-painted chunky anime fantasy RPG / child-friendly JRPG inventory art; rounded toy-like forms, clean dark-plum linework, soft dimensional shading, jewel-like highlights.
Composition/framing: exactly one complete weapon, diagonal lower-left to upper-right where practical, centred, generous transparent padding, strong silhouette readable in one square maze tile and as a held overlay.
Lighting/mood: bright magical studio highlights, cheerful and non-threatening.
Color palette: harmonious soft fantasy pastels with gold accents and clear contrast.
Constraints: genuine transparent RGBA background; clean softly antialiased edges; every part fully visible.
Avoid: character, hand, scenery, ground, floor plane, cast shadow, border, frame, text, number, logo, watermark, duplicate weapon, cropped parts, blood, damage, realistic violence, photorealism.
```

| ID | `<SUBJECT>` | Built-in output | Runtime |
| --- | --- | --- | --- |
| Comet Spear | an adorable magical Comet Spear with a polished pale-blue crystal spearhead shaped like a smiling shooting star, a lavender shaft, gold fittings, and two short coral-and-mint ribbon tails | `exec-b5375e5e-a3db-4e42-81ff-0bb0211693d5.png` | `public/assets/weapon-comet-spear-v1.png` |
| Bubble Bow | an adorable magical Bubble Bow, a compact pearly aqua and lavender fantasy bow with rounded cloudlike limbs, a taut golden string, tiny floating bubble gems built into the tips, and a central heart grip; bow only, no arrow | `exec-cd32e254-7053-49ea-bd73-81695670a31d.png` | `public/assets/weapon-bubble-bow-v1.png` |
| Cupcake Mace | an adorable magical Cupcake Mace with a strawberry-pink frosted cupcake head, colourful star sprinkles, a golden wrapper-shaped guard, lavender handle, and mint ribbon pommel; clearly a soft toy-like fantasy weapon | `exec-82dc31d4-7eb1-4017-bd81-e80b8cccfc98.png` | `public/assets/weapon-cupcake-mace-v1.png` |

Raw generated exports are archived non-destructively as matching
`docs/source-assets/*-master.png` files. `scripts/process_v15_sprite_variety.py`
downsamples each runtime image to transparent 512×512 PNG. The Lamb and
Capybara exports contained a rendered pale checkerboard rather than alpha; the
script removes only edge-connected neutral background pixels and softly
antialiases the resulting cut-out. The other seven exports preserve their
original generated alpha.

## Build 0.16.0: living friends and enchanted places

Build 0.16.0 used the built-in OpenAI ImageGen workflow in
`stylized-concept` mode (not the fallback CLI). Every sprite was generated as a
separate call. Existing Otter/Lamb, Acorn Knight, terrain, and dressing assets
were supplied only as style references; none were composited into the outputs.

### Friend prompt set

```text
Use case: stylized-concept. Create one production-ready transparent 1:1 game
sprite of <FRIEND>. Match the supplied rescue-friend references only for polish,
proportions, line quality, soft dimensional shading, and chunky child-friendly
anime fantasy JRPG style. Exactly one complete animal, front three-quarter view,
centred, generous transparent padding, strong silhouette readable in a small
square tile. Lovely clean dark-plum linework, soft pastel colour, warm magical
studio highlights, sweet expressive face, tiny personality-rich pose. Genuine
transparent RGBA background and softly antialiased edges. Avoid cage, scenery,
floor, cast shadow, frame, text, watermark, duplicate animal, cropped parts,
photorealism, or frightening details.
```

`<FRIEND>` substitutions:

- Chinchilla: a silver-grey baby chinchilla with huge rounded ears, plush round
  cheeks, pink paws, a curled fluffy tail, and coral star neckerchief.
- Alpaca: a cream baby alpaca with cloudlike fleece, long neck, rosy cheeks,
  violet eyes, and a mint bow with a tiny gold bell.
- Penguin: a round charcoal-and-cream penguin chick with stubby flippers,
  orange feet, blue eyes, and a lavender snowflake scarf.
- Koala: a seated mist-grey baby koala with fluffy ears, gentle eyes, peach
  inner ears, a eucalyptus sprig, and sunny-yellow neckerchief.

### Enemy prompt set

```text
Use case: stylized-concept. Create one production-ready transparent 1:1 enemy
game sprite of <ENEMY>. Match the supplied Acorn Knight reference only for
polish, proportions, line quality, soft dimensional shading, and chunky
child-friendly anime fantasy JRPG style. Exactly one complete tiny creature,
front three-quarter view, centred with transparent padding; playful, cheeky and
safe for a five-year-old, never scary. Clean dark-plum linework, toy-like rounded
forms, pastel fantasy colours, readable silhouette, expressive action pose,
genuine transparent RGBA background. Avoid scenery, ground, cast shadow, frame,
text, number, logo, watermark, duplicate creature, cropped parts, blood,
weapons aimed at camera, horror, or photorealism.
```

`<ENEMY>` substitutions:

- Cloud Gremlin: a tiny periwinkle cloud gremlin with puffy cloud ears, a curled
  mist tail, gold star freckles, mitten paws, and a windy delighted grin.
- Pumpkin Sprite: a tiny round apricot pumpkin sprite with a leafy cap, curled
  vine arms, little boots, rosy cheeks, and a mischievous harvest grin.
- Clockwork Crab: a toy-like coral-and-turquoise clockwork crab with rounded
  harmless claws, brass gears, a wind-up key, jewel eyes, and a proud stance.
- Jelly Sorcerer: a translucent lavender jelly sorcerer with a floppy teal star
  hat, tiny wand, rounded jelly feet, sparkly bubbles, and an impish smile.

### Terrain and dressing prompt set

All terrain calls used: `seamless square 1:1 orthographic game texture, no
perspective, no border, no objects, no text, edges tile perfectly, soft pastel
hand-painted chunky fantasy JRPG material, readable at small scale, even light`.
The exact material subjects were:

- Pearl shell floor: small interlocking ivory, blush, and pale-aqua shell-stone
  pavers with subtle pearl glints and fine grout.
- Amethyst crystal wall: rounded lavender and deep-plum crystal blocks with soft
  violet facets, dark readable mortar, and gentle edge highlights.
- Peach leafstone floor: small warm peach and cream leaf-shaped stone pavers,
  pale grout, and occasional muted coral petals.
- Berry bramble wall: rounded dusty-berry masonry woven with sparse mauve
  brambles, tiny rose hips, deep plum joints, and no bright green foliage.

Both dressing calls used: `one sparse transparent 1:1 orthographic overlay sheet,
genuine RGBA, details isolated with generous empty space, no base texture, no
border, no text, no cast shadow, suitable for quiet repeated set dressing`.
Crystal dressing requested tiny pale-violet crystal chips, pearl glints, and
star dust; autumn dressing requested coral petals, muted berry leaves, tiny rose
hips, and gold specks.

### Generated and saved files

| Asset | Built-in output | Archived master | Runtime |
| --- | --- | --- | --- |
| Chinchilla | `exec-5dc0e838-4bfc-4f8e-b617-00bec9ffe79a.png` | `docs/source-assets/animal-chinchilla-v1-master.png` | `public/assets/animal-chinchilla-v1.webp` |
| Alpaca | `exec-0a1e2e47-8f45-4f57-9c46-0e8eaabd9ef2.png` | `docs/source-assets/animal-alpaca-v1-master.png` | `public/assets/animal-alpaca-v1.webp` |
| Penguin | `exec-57840d2f-9524-4aee-a7ba-f35b160b13dd.png` | `docs/source-assets/animal-penguin-v1-master.png` | `public/assets/animal-penguin-v1.webp` |
| Koala | `exec-62685adc-87de-4d5a-9616-a4acfdeb18b6.png` | `docs/source-assets/animal-koala-v1-master.png` | `public/assets/animal-koala-v1.webp` |
| Cloud Gremlin | `exec-ce7d9308-c0b6-4ba4-8838-16e352f063cc.png` | `docs/source-assets/enemy-cloud-gremlin-v1-master.png` | `public/assets/enemy-cloud-gremlin-v1.webp` |
| Pumpkin Sprite | `exec-4431dd4f-f35d-4006-897f-06ca7702f539.png` | `docs/source-assets/enemy-pumpkin-sprite-v1-master.png` | `public/assets/enemy-pumpkin-sprite-v1.webp` |
| Clockwork Crab | `exec-39ad8202-37d0-47de-85f9-b738e021be6a.png` | `docs/source-assets/enemy-clockwork-crab-v1-master.png` | `public/assets/enemy-clockwork-crab-v1.webp` |
| Jelly Sorcerer | `exec-e98b62d2-0c64-4462-945b-10093bf3f047.png` | `docs/source-assets/enemy-jelly-sorcerer-v1-master.png` | `public/assets/enemy-jelly-sorcerer-v1.webp` |
| Pearl shell floor | `exec-dab1b7bb-4106-405e-a8c8-ba1ac22c8bcf.png` | `docs/source-assets/floor-pearl-shell-v1-master.png` | `public/assets/floor-pearl-shell-v1.png` |
| Amethyst crystal wall | `exec-d6cc7d1e-b441-41b9-8f11-4a25d113d94d.png` | `docs/source-assets/wall-amethyst-crystal-v1-master.png` | `public/assets/wall-amethyst-crystal-v1.png` |
| Peach leafstone floor | `exec-d468d3c8-d9b2-4c16-ab5e-f9e6d2495bce.png` | `docs/source-assets/floor-peach-leafstone-v1-master.png` | `public/assets/floor-peach-leafstone-v1.png` |
| Berry bramble wall | `exec-4e55ce83-6c43-482e-b7ec-97f2280c5cee.png` | `docs/source-assets/wall-berry-bramble-v1-master.png` | `public/assets/wall-berry-bramble-v1.png` |
| Crystal dressing | `exec-5b660b52-632e-427f-bd7b-6bfed0d54d29.png` | `docs/source-assets/terrain-dressing-crystal-v1-master.png` | `public/assets/terrain-dressing-crystal-v1.png` |
| Autumn dressing | `exec-3310f2e7-3f66-4671-94ab-2bfc22c7b28c.png` | `docs/source-assets/terrain-dressing-autumn-v1-master.png` | `public/assets/terrain-dressing-autumn-v1.png` |

`scripts/process_v16_variety_assets.py` creates the transparent lossless 512 x
512 WebP character files and removes only the Alpaca export's edge-connected
neutral checker. The existing Poisson seam processor creates the four repeatable
terrain PNGs, and the dressing processor creates transparent 512 x 512 overlays.

## Build 0.17.0: illustrated keepsake shelf

Build 0.17.0 used the built-in OpenAI ImageGen workflow in
`stylized-concept` mode. Each collectible was generated in a separate call.
`public/assets/reward-trail-sticker.png` was supplied as a reference for style,
polish, linework, material, and framing only; it was never composited into a new
asset.

### Sticker and medal prompt

The following exact shared prompt was used, with one of the primary requests
listed beneath it appended to each call:

```text
Use case: stylized-concept
Asset type: transparent 1:1 collectible achievement sprite for Maze so Puzzle
Input image: the supplied golden boot-star sticker is a style, polish, linework,
material, and framing reference only; create a completely new design.
Style/medium: gorgeous polished 2D hand-painted chunky anime fantasy JRPG
achievement art for a five-year-old; rounded toy-like forms, clean dark-plum
linework, soft dimensional shading, enamel-and-gold materials, jewel highlights,
gentle pastel colours.
Composition/framing: exactly one complete collectible badge or sticker,
centered, strong readable silhouette, generous transparent padding, fills about
82 percent of the square.
Lighting/mood: warm magical studio highlights, celebratory, sweet and
non-threatening.
Constraints: genuine transparent RGBA background, clean softly antialiased
edges, no text, no numerals, no character body, no scenery, no floor plane, no
cast shadow, no frame beyond the collectible itself, no watermark, no duplicate
objects, no cropped parts.
```

Primary requests:

- Animal Friend Sticker: `a soft coral heart, with a smiling cream bunny face
  and tiny golden paw-print, mint leaves, and lavender sparkle accents; clearly
  an adhesive enamel sticker rather than a medal.`
- Surprise Sparkle Sticker: `a rounded violet maze-cloud, winding golden path
  leading to a bright star, tiny mystery gift bow, aqua and coral sparkles;
  clearly an adhesive enamel sticker rather than a medal.`
- Helping Paw Medal: `a warm rose-gold paw-print medallion surrounded by exactly
  five small star gems, short mint and peach ribbons, and a tiny heart jewel.`
- Rainbow Rescue Medal: `a pearly silver medallion with a pastel rainbow arch
  sheltering a tiny golden paw, a ring of sparkling gems, and lavender and aqua
  ribbons.`
- Golden Guardian Medal: `a magnificent warm-gold winged shield medallion with a
  tiny crown, central heart-shaped paw jewel, ring of star gems, and rich coral
  and violet ribbons; this is the grandest medal.`

### Embroidered achievement-patch prompt

The following exact shared prompt was used for the nine patches, with the
appropriate primary request appended:

```text
Use case: stylized-concept
Asset type: transparent 1:1 collectible achievement sprite for Maze so Puzzle
Input image: the supplied golden boot-star sticker is a style, polish, linework,
material, and framing reference only; create a completely new design.
Style/medium: gorgeous polished 2D hand-painted chunky anime fantasy JRPG
achievement art for a five-year-old; rounded toy-like forms, clean dark-plum
linework, soft dimensional shading, embroidered fabric and enamel-and-gold
materials, jewel highlights, gentle pastel colours.
Composition/framing: exactly one complete collectible badge, centered, strong
readable silhouette, generous transparent padding, fills about 82 percent of the
square.
Lighting/mood: warm magical studio highlights, celebratory, sweet and
non-threatening.
Constraints: genuine transparent RGBA background, clean softly antialiased
edges, no text, no numerals, no character body, no scenery, no floor plane, no
cast shadow, no frame beyond the collectible itself, no watermark, no duplicate
objects, no cropped parts.
```

Primary requests:

- Pathfinder Patch: `a rounded rose-and-mint embroidered fabric patch showing a
  cute golden compass above one clear winding path, cream stitching, and tiny
  leaf accents.`
- Maze Mapper Badge: `a rounded sky-blue and lavender embroidered patch showing
  an unfurled parchment maze map with one coral route line and a tiny gold
  destination star, with cream stitching.`
- Grand Explorer Badge: `a prestigious rounded indigo embroidered patch with a
  pastel rainbow arch over a tiny golden maze crest and three floating stars,
  with cream stitching and gold edging.`
- Surprise Scout: `a playful rounded violet embroidered patch showing a magical
  gift box whose ribbon unfolds into a tiny maze path and starburst, with aqua
  and coral accents and cream stitching.`
- Mighty Adventurer: `a rounded warm-orange embroidered patch showing one cute
  polished golden gauntlet proudly holding a glowing star crystal, with coral
  rays, lavender jewels, and cream stitching; friendly magical strength.`
- Twinkle Toes: `a rounded blush-pink and aqua embroidered patch showing a pair
  of tiny winged adventure boots leaping through gold sparkles, with cream
  stitching.`
- Bunny Buddy: `a rounded peach-and-cream embroidered fabric patch showing an
  adorable smiling cream bunny face with floppy ears, nestled in a tiny carrot,
  heart, and leaf wreath, with lavender jewel sparkles and cream stitching.`
- Fox Friend: `a rounded warm-russet and mint embroidered fabric patch showing
  an adorable smiling orange fox face with fluffy cheeks and a tail-tip motif,
  nestled in a tiny leaf, heart, and gold-star wreath, with aqua jewel sparkles
  and cream stitching.`
- Kitten Pal: `a rounded lavender-and-aqua embroidered fabric patch showing an
  adorable smiling fluffy cream kitten face with a tiny pink nose and curled
  tail motif, nestled with one mint yarn ball, tiny hearts, and gold stars, with
  coral jewel sparkles and cream stitching. Output genuine transparent RGBA
  outside the patch silhouette; do not paint or simulate a checkerboard or
  background field.`

### Generated and saved files

| Collectible | Built-in output | Archived master | Runtime |
| --- | --- | --- | --- |
| Animal Friend Sticker | `exec-1b57bbd7-0dc7-4035-b73b-d93742db2afc.png` | `docs/source-assets/reward-animal-friend-sticker-v2-master.png` | `public/assets/reward-animal-friend-sticker-v2.webp` |
| Surprise Sparkle Sticker | `exec-bf26996c-7e87-40cf-9dfe-a7de4f87dbc7.png` | `docs/source-assets/reward-surprise-sparkle-sticker-v2-master.png` | `public/assets/reward-surprise-sparkle-sticker-v2.webp` |
| Helping Paw Medal | `exec-d4b45361-8e46-4ecc-94bd-3c6118282556.png` | `docs/source-assets/reward-helping-paw-medal-v2-master.png` | `public/assets/reward-helping-paw-medal-v2.webp` |
| Rainbow Rescue Medal | `exec-79b0133a-444f-4bc7-8476-be22b76a9d44.png` | `docs/source-assets/reward-rainbow-rescue-medal-v2-master.png` | `public/assets/reward-rainbow-rescue-medal-v2.webp` |
| Golden Guardian Medal | `exec-d8ecd115-2eaf-4c80-a784-12655aa618d7.png` | `docs/source-assets/reward-golden-guardian-medal-v2-master.png` | `public/assets/reward-golden-guardian-medal-v2.webp` |
| Pathfinder Patch | `exec-c8b56815-c9c7-46a4-bac7-671c17171a05.png` | `docs/source-assets/badge-pathfinder-v1-master.png` | `public/assets/badge-pathfinder-v1.webp` |
| Maze Mapper Badge | `exec-e9566b02-3b6d-490b-827f-d1a6c32cafa2.png` | `docs/source-assets/badge-maze-mapper-v1-master.png` | `public/assets/badge-maze-mapper-v1.webp` |
| Grand Explorer Badge | `exec-a00ec6eb-a1af-4d17-8666-6b907a8686ca.png` | `docs/source-assets/badge-grand-explorer-v1-master.png` | `public/assets/badge-grand-explorer-v1.webp` |
| Surprise Scout | `exec-989079b4-00ec-4d0c-9afc-452018ae885b.png` | `docs/source-assets/badge-surprise-scout-v1-master.png` | `public/assets/badge-surprise-scout-v1.webp` |
| Mighty Adventurer | `exec-f9f2e3fa-d491-40ae-a49b-02d2e78020e0.png` | `docs/source-assets/badge-mighty-adventurer-v1-master.png` | `public/assets/badge-mighty-adventurer-v1.webp` |
| Twinkle Toes | `exec-f92de3c1-7334-46ff-ac76-f71e9c0128f2.png` | `docs/source-assets/badge-twinkle-toes-v1-master.png` | `public/assets/badge-twinkle-toes-v1.webp` |
| Bunny Buddy | `exec-415a6a36-c8c7-490c-b2ed-d7c5f00a0fac.png` | `docs/source-assets/badge-bunny-buddy-v1-master.png` | `public/assets/badge-bunny-buddy-v1.webp` |
| Fox Friend | `exec-0b364964-8603-4552-8c6e-0a0bd2739d32.png` | `docs/source-assets/badge-fox-friend-v1-master.png` | `public/assets/badge-fox-friend-v1.webp` |
| Kitten Pal | `exec-9f8569fa-9054-4fa9-b4a4-60fa3b341989.png` | `docs/source-assets/badge-kitten-pal-v1-master.png` | `public/assets/badge-kitten-pal-v1.webp` |

`scripts/process_v17_achievement_assets.py` exports every master as a transparent
512 x 512 lossless WebP. The Mighty Adventurer and Twinkle Toes masters arrived
with a pale neutral checker field, and the Kitten Pal master arrived on solid
black; the deterministic processor removes only edge-connected background
pixels and preserves the illustrated silhouettes. A first Kitten Pal attempt
with a painted checkerboard was rejected and is not part of the project.

## Build 0.18.0: complete friend-cage fronts

Build 0.18.0 used the built-in OpenAI ImageGen workflow in
`stylized-concept` mode. Each generation treated its v4 cage as Image 1, the
material/style reference and edit target, and the user's rough cage drawing at
`C:/Users/hellb/AppData/Local/Temp/codex-clipboard-c483bd01-d336-4d9b-ac77-e215742b7740.png`
as Image 2, the structural reference. The intention was not to reproduce the
sketch's rendering, only its unmistakable top-rail/bars/lock/bottom-rail
silhouette.

### Shared final prompt contract

```text
Use case: stylized-concept
Asset type: transparent square game sprite overlay for a friend rescue cage
Input images: Image 1 is the existing [VARIANT] cage style and material reference; Image 2 is the user's rough structural reference.
Primary request: redesign the [VARIANT] cage as a complete, clearly locked front face. Preserve Image 1's polished chunky cute anime fantasy JRPG rendering and the variant details listed below. Follow Image 2's enclosure structure: a substantial decorated top rail spanning the full width, a substantial decorated bottom rail spanning the full width, five evenly spaced vertical bars connecting top to bottom, and a clearly visible central themed padlock fixed over the middle bar.
Composition/framing: straight-on orthographic front view, centered, full cage fills a square tile with comfortable transparent margins. The empty spaces between bars must stay transparent so a large animal sprite can be layered behind it.
Materials/textures: preserve the variant materials and palette listed below, with readable highlights and thick clean outlines.
Constraints: genuinely transparent background and genuinely transparent gaps between every bar; complete top and bottom rails fully visible; no back wall, no floor, no animal, no door swung open, no scenery, no text, no watermark. The silhouette must read instantly at small tile size as a secure closed cage, not a fence and not a half-cage.
```

Variant-specific prompt text:

- Golden Heart: preserve golden metal, pink heart jewel, wing and scrollwork
  details; use glossy storybook gold with soft pastel pink enamel and gemstones.
- Storybook Wooden: preserve honey-gold storybook wood and metal, tiny stars,
  purple leaves, and warm heart lock; use softly polished golden wood with warm
  metal joints and pastel purple and peach accents.
- Moon Silver: preserve pearly moonlit silver-blue metal, golden trim, crescent
  moons, stars, leaves, and sapphire crystals; use glossy storybook silver and
  icy periwinkle enamel with small gold fittings and blue-violet gems.
- Garden Vine: preserve warm golden bars, friendly curling green vines, pink
  blossoms, and heart jewel; use glossy storybook gold, soft green leaves and
  vines, and pastel pink flowers and enamel. Vines may decorate the rails and
  outer posts but must not fill or obscure the open spaces.

### Output mapping

| Variant | Built-in output | Archived master | Runtime asset |
| --- | --- | --- | --- |
| Golden Heart | `exec-1a27919f-d02d-478e-a68c-3d50ed50cb97.png` | `docs/source-assets/cage-golden-heart-front-v5-master.png` | `public/assets/cage-golden-heart-front-v5.webp` |
| Storybook Wood | `exec-fbf62c28-bff0-46d2-8e34-0da0d8115298.png` | `docs/source-assets/cage-storybook-wood-front-v5-master.png` | `public/assets/cage-storybook-wood-front-v5.webp` |
| Moon Silver | `exec-abb23b08-d03e-4cfd-bd50-983045647c75.png` | `docs/source-assets/cage-moon-silver-front-v5-master.png` | `public/assets/cage-moon-silver-front-v5.webp` |
| Garden Vine | `exec-c05b9f83-ecae-4ab7-8b53-77cbb0422973.png` | `docs/source-assets/cage-garden-vine-front-v5-master.png` | `public/assets/cage-garden-vine-front-v5.webp` |

`scripts/process_v18_cage_assets.py` preserves the genuine alpha in the Golden
Heart and Storybook masters. Moon Silver and Garden Vine arrived with a painted
neutral checker field; the deterministic processor flood-fills only neutral
background connected to the canvas edges and the four enclosed open bays. All
runtime copies are 512 x 512 lossless WebP with alpha extrema 0 and 255.

## Plan 03 / Ame v02 Human-gate studies (2026-09-02)

This section is append-only provenance for unapproved source studies. It does
not amend the historical prompts above, change the active runtime sprite, or
claim Human/Ame approval.

Candidate C (`exec-6732e5ce-ce9c-47df-b2ca-45c02a7f99b4.png`) is the art
director's recommendation for the open Human/Ame gate. It preserves the warm
young face, golden-blonde shoulder-brushing layered hair, mint tunic, lavender
cape/backpack, flower/braid, practical straps and pouch, and coral boots while
making the irises remain clearly blue at gameplay size. Candidate A is retained
as its visual rollback ingredient; Candidate B is retained as a conservative
comparison. All three remain source-only and unapproved.

The exact Candidate B, Candidate C, Candidate C turnaround, and Candidate C
expression requests; reference roles and hashes; every output ID; the concise
rather than fabricated Candidate A evidence; and rejection notes are preserved
verbatim in:

`docs/source-assets/characters/ame/v02/AME_V02_PROMPTS.md`

The generator returned opaque RGB files with painted checkerboards despite the
alpha requests. Immutable originals are retained. `scripts/art_pipeline.py`
creates no public output for the pending candidate: deterministic cutout,
registration, alpha-edge, actual-size, comparison, and context proofs live only
under the ignored `artifacts/art-proofs/` tree. The structured authority is
`docs/source-assets/records/ame-v02-source.json`.

No model/version, seed, or hidden request parameter is inferred. Candidate C is
a new global reference-led generation, not a truly local eye-only edit, even
though its subject envelope stayed visually on model. Any future revision must
receive a new candidate/output record; never overwrite these sources or silently
rewrite this history.

The Human subsequently approved Candidate C as the canonical static Ame v02
design direction on 2026-09-03. The paragraphs above remain the truthful state
and wording of the 2026-09-02 generation/review handoff; design approval does
not retroactively approve a cutout, derivative, runtime pointer, rights review,
animation frame, portrait, or other dependent asset.

## Plan 03 / `mgjrpg-02` craft-calibration canary (2026-09-03)

This append-only production recipe translates the transferable craft discipline
from the Human-supplied PPBA specification into original Maze-native language.
The source review and originality boundary are in
`docs/research/2026-09-03-ppba-art-craft-synthesis.md`. No PPBA name, image,
prompt, character, palette, object, composition, interface, or asset ID is a
generation reference. `mgjrpg-02` is a canary recipe until its consolidated
cross-family comparison receives Human approval; existing `mgjrpg-01` records
remain unchanged.

### Shared visual lock

```text
Use case: stylized-concept
World: an original child-friendly magical-girl storybook maze JRPG about
pocket-sized courage, friendship, noticing, trying again, and warm funny
adventure.

Visual construction: clean expressive anime face; rounded compact/chibi body;
one unmistakable silhouette anchor; two to four large colour masses that read at
the stated minimum size; one local midtone, one broad grouped shadow, and one
broad light mass. Use restrained tactile cel-painterly texture, broad
locks/folds/tufts/clusters, and only highlights that explain the material.

Contour: one solid continuous local-material contour harmonized toward warm
deep plum. Shift it deliberately to aubergine around lavender, russet-plum
around coral/leather/gold, blue-plum around cool material, and leaf-plum around
foliage. Reserve the darkest plum for pupils, mouth, deep occlusion, and critical
separation.

Hierarchy: make the face, required interaction, or narrative subject the one
clearest focal area. Keep support areas quieter. Use exactly one approved primary
Maze motif and no more than one supporting motif.

Material: preserve the approved family recipe. Cloth is matte with broad folds;
fur/feather uses grouped tufts; hair uses grouped locks; wood uses sparse broad
grain; stone uses broad blocks; metal uses a narrow highlight; gem uses three to
five large facets; liquid uses one large directional rhythm.

Lighting: gentle neutral upper-left/front form modelling only. No floor shadow,
directional cast shadow, spotlight, broad halo, or external particles. Runtime
owns contact/cast shadow and outer magic effects.

Exclude: no named-franchise or living-artist imitation; no recognizable
character, costume, logo, prop, composition, UI skin, or other project's trade
dress; no mature anatomy, glamour pose, horror, gore, cruelty, extra subject,
limb, prop, accessory, motif, generated text/numeral, fake logo, signature,
watermark, pure-black uniform perimeter, rainbow edge, broken/translucent
outline, white field-sprite halo, plastic 3D gloss, generic airbrush gradient,
photographic noise, vector-flat drift, or detail that vanishes at minimum size.
```

### Asset and reference block

Append this completed block to the shared visual lock for every candidate:

```text
Catalogue ID and family: {id}; {family}
Gameplay function and emotional read: {function}
Minimum display size and first-read requirement: {size}; {read}
Approved view, proportions, pose/facing: {geometry}
Safe area, pivot/baseline, face/grip/motif anchors: {registration}
Approved palette, material, primary/supporting motif: {tokens}

Identity reference: {exact immutable source, SHA-256, identity invariants}
Rendering/family reference: {exact immutable source, SHA-256, craft invariants}
Change only: {one declared variable}

Delivery intent: one isolated subject with the approved padding and alpha intent;
no text, frame, floor, scenery, cast shadow, broad glow, or watermark. The
deterministic art pipeline creates and validates normalized derivatives.
```

Do not omit a reference slot silently. Write `none — new identity candidate`
where appropriate and use the identical locked brief for both independent
candidates.

### Semantic UI sticker add-on

Use only for semantic UI icons, buttons, badges, prompts, anime emotion/reaction
glyphs, and explicitly UI-context rewards—not for field characters, world
items, terrain, walls, doors, hazards, or story art.

```text
Render as unmistakably flat 2D die-cut storybook signal art: a strong cream-white
outer paper cutline surrounding the solid local-material inner contour, two to
four large graphic regions, one focal symbol, and at most two tiny accents. Keep
the silhouette readable on paper, dark plum, middle gray, and busy gameplay.
No cast shadow, floor, background plaque, glow cloud, baked label, letter, or
numeral.
```

### Cutout-source add-on

```text
Exactly one complete isolated subject, centered with comfortable even clear
space and its documented baseline. Preserve pale internal details. Request a
genuinely transparent RGBA background. No painted checkerboard, chroma-key
colour, background texture, border, clipped flourish, floor, contact shadow,
drop shadow, reflection, environmental light, haze, or loose sparkle outside the
approved subject envelope.
```

Transparency remains a delivery request, never an assumption. Preserve the
immutable returned source even when it violates the request; create any cutout
as a separately hashed deterministic derivative and review it on the full alpha
board.

### Candidate and state protocol

- A fresh identity receives exactly two independent candidates from the same
  locked brief and equivalent pinned references. Candidate A never sees B and B
  never sees A. Preserve both with exact request/output evidence.
- The Human may select one, reject both, or request one objective-defect
  correction. If that correction fails, return to the brief rather than creating
  an unbounded reroll chain.
- A pose, expression, material, or state of an approved identity starts from its
  selected immutable identity source plus the rendering/family anchor. Never use
  an expressive state, cleaned cutout, correction, runtime derivative, or
  rejected candidate as a new identity anchor.
- Normal/powered/selected/tired/emotional state pairs preserve silhouette,
  pivot, baseline, alpha footprint, safe area, scale, camera, and identity
  landmarks unless a reviewed state contract explicitly changes one. Apparent
  internal emission belongs in the art; external halo/rays/motes belong to VFX.
- Generated lettering is never accepted. Generate blank shells/marks and overlay
  real application text and numerals with deterministic optical centring.

## Plan 03 / `mgjrpg-02` colour-aware-contour calibration addendum v1 (2026-09-03)

This is a forward-only refinement to the reusable canary recipe above. It does
not rewrite any historical prompt, relabel a returned image, approve a rendering
profile, or authorize production volume. The Human has approved Candidate C's
identity/construction and has directed this rendering assay; only the resulting
surface treatment is at the open Human gate.

The adopted technique is colour-aware local contouring. It is a production-craft
principle learned from the Human-supplied PPBA specification, not permission to
reuse that project's pixels, prompt wording, characters, palette, motifs, props,
composition, UI layout, asset names, logo, brand, or trade dress. All wording and
colour families below are Maze-native.

### Ordered-reference and run record

Complete this block verbatim for each generation/edit request. Reference order
is semantic and immutable, not incidental:

```text
Rendering-profile candidate: mgjrpg-02 / storybook-local-contour-v1
Run intent: {rendering assay | independent identity candidate | family candidate}
Change only: {one bounded surface/construction variable}
Minimum delivered sizes: {ordered pixel sizes}

Reference 1 — IDENTITY AUTHORITY:
role `identity-authority`; authorityKind `{immutable-generator-original |
approved-source-master}`; {immutable path or output ID}; SHA-256 {hash};
preserve {locked identity facts}
Reference 2 — RENDERING/FAMILY AUTHORITY:
role `{rendering-authority | family-authority}`; authorityKind
`{approved-rendering-anchor | approved-source-master}`; {immutable path or
output ID}; SHA-256 {hash}; preserve {locked craft facts}
Reference 3 — GEOMETRY/REGISTRATION AUTHORITY, when required:
role `construction-authority`; authorityKind `{approved-model-sheet |
approved-source-master}`; {immutable path or output ID}; SHA-256 {hash};
preserve {bounds/pivot/anchors}

Lineage: editOfEdit `false`; identityAuthorityEligible `{true|false}`;
renderingAuthorityEligible `{true|false}`.

If a role has no reference, write exactly `none — {reason}`. Do not reorder
roles, invent a role/authority kind, silently substitute a derivative, or use a cleaned cutout, edit,
expression, pose, rejected candidate, or runtime downsample as a new identity
authority. Preserve the exact submitted text, ordered references and hashes,
returned output ID/file/hash, generator facts only when known, selection or
rejection reason, derivative recipe, measurements, and rollback source.
```

An edit result is never fed back as Reference 1. A later bounded assay starts
again from the immutable identity original plus the approved rendering/family
authority. Generator originals remain unchanged even when they contain an
opaque checkerboard, bad alpha, halo, or other defect.

### Colour-aware contour lock

Append this exact block to every cutout canary request:

```text
Use clean, continuous, confident colour-aware contours. For each stable contour
section, derive hue from the nearest interior material or colour region that the
section encloses, then make it darker and slightly richer while harmonising it
through Maze's deep-plum family. Use warm golden-brown/plum around golden-blonde
hair and gold; aubergine around lavender; blue-plum around blue, cyan, silver,
or other cool material; russet-plum around coral, leather, skin-adjacent warm
cloth, or warm wood; leaf-plum around mint cloth, leaves, moss, and foliage; and
cream-mauve around white fur, cream cloth, paper, or pale neutral material.

Reserve the darkest ink-plum for pupils, mouth, deep occlusion, very small
critical separations, and a silhouette segment that otherwise fails essential
contrast. Change contour family only at a real material boundary or construction
joint. Merge tiny edge islands into the dominant neighbouring section. Never use
pure black or one dead uniform perimeter; never dither hue pixel by pixel; never
produce rainbow-fragmented edges, gaps, soft airbrushed borders, chromatic halos,
white/gray/magenta matte, or low-contrast pale edging.

At delivered size, maintain 3–5 px outer and 1.5–3 px structural contours at
512 px; 2–3 px and 1–2 px at 256 px; 2 px and 1 px at 128/103/84 px; and a
continuous 1.5–2 px optical silhouette at 77/64/56/40 px, with internal marks
omitted when they cannot remain one clean pixel. Measure the delivered raster,
not the source request. The essential silhouette edge must remain readable
against paper, dark plum, middle gray, saturated magenta/cyan, and named
in-game backgrounds.

Ordinary field characters, friends, enemies, weapons, items, props, locks,
doors, cages, and portals receive no cream or white sticker cutline. Only semantic UI
icons, badges, prompts, reaction symbols, and explicitly UI-context reward
flourishes may add one clean cream paper cutline outside their colour-aware
inner contour: 2 px at 64/48 px, 1.5 px at 32 px, and 1 px at 24/16 px.
```

### Terrain, wall, liquid, and hazard boundary lock

Append this instead of the cutout contour block for periodic art:

```text
Do not enclose terrain, floors, walls, liquids, or hazards in a character-like
outline. Use material-aware darker local boundaries, value steps, patterns, and
construction seams within the painted material. Floor remains quiet and broad;
wall solidity comes from larger masses and joints; water reads through asymmetric
elliptical/horizontal ripple flow; lava through asymmetric directional S-flow
and sparse bright cores; poison through violet/aubergine eddies plus sparse
non-green bubbles. No mirror, kaleidoscope, obvious central symmetry, unique
landmark, directional spotlight, or baked cast shadow. Opposing tile edges must
remain exactly periodic after deterministic processing, and a 3x3/5x5 repeat
must not reveal a cross-band, enclosing rim, seam, or character-style contour.
```

### Canary roster and immutable Ame exception

The required packet contains Approved Ame Candidate C; Fox and Alpaca; Goblin
and Jelly Sorcerer; Moon Wand; Rose Heart lock/key token, door, and portal;
First Star; Home and Help; Sunny Stone floor/wall; Wishing Woods floor/hedge;
and representative water, lava, and poison. Do not substitute a more convenient
family member without recording the packet as incomplete.

For Ame, append this lock after all shared text:

```text
Candidate C is the immutable Human-approved Ame v02 identity and construction
authority. Preserve exactly her warm young face and expression, clearly blue
irises, golden-blonde shoulder-brushing softly layered hair, crown curl, left
braid and flower, chibi proportions, pose/anatomy, mint tunic, cream layers,
lavender cape and backpack, brown strap/belt/pouch, coral boots, gold hardware,
silhouette, registration envelope, and emotional character. Change rendering
surface only. Reject rather than rationalise any output that changes identity,
construction, pose, accessory count, colour allocation, camera, scale, pivot, or
safe zones. No edit-of-edit becomes identity or rendering authority.
```

## Plan 03 / `mgjrpg-02` authored-options correction addendum v2 (2026-09-03)

This forward-only addendum supersedes the **production method and darkness
target** in the v1 canary assay above. It does not alter that historical prompt
or its returned evidence. The Human rejected the v08 result as an art direction:
adding a mostly dark contour to retained `mgjrpg-01` pixels did not constitute a
meaningful new rendering treatment. V08 remains rejection and rollback evidence,
not a rendering authority, production master, or shortcut for future assets.

The open gate is now a comparison among independently authored rendering
directions. The exact text, reference order, output IDs, hashes, defects, and
lineage for the current v02 option runs are preserved in
`docs/source-assets/calibrations/mgjrpg-02/v02/PROMPTS.md` and its adjacent
`run-record.json`. Those immutable records—not this reusable synopsis—are the
authority for reconstructing those runs.

### Authored-pixel requirement

Append this block to every future `mgjrpg-02` character, creature, object, or
semantic-icon source request:

```text
Author the complete subject in the selected Maze rendering direction from the
start. Build silhouette, two to four large colour masses, three broad value
groups, facial hierarchy, material transitions, interior separations and
material-local contours as one coherent painting. Do not take an existing
mgjrpg-01 raster and merely add, recolour, expand or filter an outline. Do not
trace old pixels, apply a global stroke, posterize a finished sprite, or treat a
deterministic contour pass as art direction. The delivered source must remain a
credible complete design even when its contour layer is mentally removed.

For a new family identity, work from the locked written construction brief and
approved family/model references, never from a rejected candidate. For an
approved identity such as Ame Candidate C, repaint from the immutable identity
and construction authority while preserving every locked landmark; rendering
novelty never licenses redesign. Never use an edit-of-an-edit as identity or
rendering authority.
```

Deterministic processing may extract alpha, register, scale, encode, assemble
proofs, and measure edges. It may not invent or repair the selected style by
synthesising a perimeter contour. A candidate that needs such repair returns to
source generation or bounded source editing.

### Brighter colour-aware contour lock

The contour is a painted material edge, not dark ink with barely perceptible
hue. Append this block after the authored-pixel requirement:

```text
Paint clean, continuous, confident colour-aware contours whose hue is obvious
at the stated minimum delivery size. Each stable section follows the adjacent
material it encloses: medium golden-ochre or warm plum for blonde hair and gold;
clear berry-aubergine for lavender; saturated blue-violet for blue and cool
metal; warm terracotta/russet for coral, leather and wood; leafy teal-plum for
mint and foliage; soft rose-mauve for cream and skin-adjacent edges. Harmonise
the set through Maze's plum family without collapsing every section into the
same near-black ink.

Target roughly 35–55% HSL lightness on long non-facial outer sections, and
38–55% for Ame, subject to measured background contrast. Let colour and painted
mass dominate the line. Reserve the darkest ink-plum only for pupils, mouth,
tiny deep occlusions and the minimum critical separation needed for access.
Pure black, charcoal-looking default perimeters, one uniform dark stroke,
doubled outlines, muddy low-contrast edges, rainbow fragments, pixel-by-pixel
hue switching, airbrushed borders and chromatic/white/magenta halos are failures.

Change contour family only at a real material boundary or construction joint.
Use material-aware internal separation where needed; never insert arbitrary
black dividers. Inspect every source at 100% and every derivative on paper,
dark-plum, middle-gray, saturated-magenta/cyan and representative in-game
backgrounds. If the hue cannot be recognised at 64 px, or the silhouette fails
without near-black, revise the source painting rather than adding another
stroke.
```

Terrain, floors, walls, liquids and hazards continue to use material-local value,
pattern, boundary and seam treatment without character-like enclosing contours.
They must be authored for periodic processing; a perimeter, medallion, mirror,
baked directional shadow or post-stroked tile edge is a rejection.

### Authored direction options at the open gate

The three current comparison directions deliberately vary more than outline
colour. They share Maze identity but test different complete rendering systems:

- **A — Luminous Storybook Cel:** crisp opaque gouache/cel planes, sparse
  dry-brush life inside broad shapes, medium-thin bright contours, warm clarity,
  and the strongest balance of painterly authorship with handheld readability.
- **B — Soft Jewel Gouache:** softer faceted values, finer coloured contours,
  restrained paper grain and pearly material cues; the warmest and most
  painterly option, with small-size softness as its principal risk.
- **C — Chunky Enamel Adventure:** the fewest internal marks, bold matte masses
  and thick bright contours; the strongest thumbnail read, with excess toy-like
  simplification as its principal risk. Ame's proportions may not change.

Do not average these before the Human gate. Record the Human's selected direction
and reasons first; only then may a new versioned rendering recipe become an
authority for broader production.

### Clean semantic-UI sticker contract

Only semantic UI icons, badges, prompts, reaction symbols and explicitly
UI-context reward flourishes use sticker construction:

```text
Author a clean flat die-cut storybook symbol from two or three large graphic
masses and one unmistakable focal glyph. Paint a visibly coloured material-local
inner contour, then one even cream-white paper cutline outside the entire joined
silhouette. The cream cutline must read immediately at 16, 24, 32, 48 and 64 px,
without swallowing openings or making multiple disconnected stickers. Use no
plaque, floor, drop shadow, cast shadow, glow cloud, tiny filigree, baked label,
letter, numeral, fake logo or generated text.
```

Ordinary field characters, friends, enemies, weapons, items, cages, locks,
doors, portals, terrain and story art receive no cream/white sticker cutline.

### Human-directed future enemy prompt roster

These are future **source-identity briefs**, not shipped catalogue entries,
approved designs, placements, mechanics, animation promises, or permission to
copy a franchise monster. Every candidate also receives the current shared
visual lock, authored-pixel requirement, brighter contour lock, child-safety
contract, registration block and provenance block. All opponents are friendly
guardians or comic rivals under the Polite Sword Rule; weapons and folklore cues
communicate challenge only.

| Planned ID | Reusable primary-request kernel | Hard exclusions |
| --- | --- | --- |
| `green-tea-skeleton` | One courteous toy-ivory skeleton calmly drinking visible green tea from a small mint ceramic teacup and saucer; one steam curl; the original joke is a spooky dungeon archetype doing something politely ordinary. | No copied character, pose, costume or composition; no realistic bone, gore, broken anatomy, void sockets or horror. |
| `classic-slime` | One traditional low rounded fantasy gel creature with a broad friendly face plane and the simplest unmistakable slime silhouette; no accessory. | No franchise-specific droplet, face construction, palette dependency or brand cue. |
| `lizard-swordsman` | One stout mint-scaled upright lizard guardian with a broad tail, coral scarf and blunt leaf-shaped practice sword held sideways. | No blade toward camera, wound, aggression or implied special attack. |
| `lizard-spearman` | The same approved lizard species construction, with a side-facing padded spear creating a clean diagonal/horizontal silhouette distinct from the sword sibling. | No improvised second species, thrust toward camera, reach or ranged mechanic implication. |
| `succubus` | One wholesome lilac/plum night guardian with small rounded bat wings, curled horns, fully covered layered tunic, cape, leggings and boots, plus a warm competitive expression. | No adult anatomy, cleavage, lingerie coding, exposed torso, glamour pose, seduction, kiss/charm magic or automatic heart clutter; public label requires Human/rating review. |
| `t-rex` | One compact cheerful T-rex challenger with a large head, thick tail, tiny arms, planted oversized feet, blunt toy-like teeth and proud curiosity. | No predation, gore, chase pose or realistic menace. |
| `cultist` | One overenthusiastic fictional Star Map follower with a rounded hood, fully visible friendly face and one original affiliation mark. | No real religion, hate/occult symbol, sacrifice, knife, faceless menace or ritual violence; public label requires Human/rating review. |
| `lamia` | One fully clothed anime guardian with expressive face and hands above a broad readable coiled-serpent base and sparse scale pattern. | No pin-up curvature, sensual anatomy, constriction or hypnosis implication. |
| `soda-slime` | One fizzy coral-and-aqua gel creature with a simple friendly face, a few large internal bubbles and one bendy-straw silhouette accent. | No real brand, can/label trade dress, ingestion instruction or poison-green dependency. |
| `orc-chieftain` | One broad rounded green guardian whose calm planted posture and simple ceremonial mantle or crest communicate leadership. | No skull trophies, rage, dehumanising caricature, pseudo-tribal stereotype or violence. |
| `cyclops` | One rounded guardian with a single large expressive eye, clear iris/catchlight and readable friendly competitive face. | No veins, grotesque eyelids, body horror or dark empty socket. |
| `minotaur` | One friendly labyrinth caretaker with short broad horns, rounded muzzle, planted hooves and one quiet Maze cloth affiliation cue. | No rage pose, nose ring, giant axe or suffering/labyrinth-victim implication. |
| `warrior-skeleton` | The same approved toy-bone anatomy as the Tea-Time Skeleton, upright with a blunt training weapon and simple lavender tabard. | No separate bone grammar, realistic anatomy, breakage or weapon aimed at camera. |
| `kappa` | One respectful rounded river guardian with head dish, shell, gentle beak, playful expression and a Maze-native water palette. | No crude folklore joke, existing mascot resemblance, caricature or drowning implication. |
| `classic-mimic` | One warm wooden treasure chest that reads as visibly alive: one large friendly eye, plum lid-mouth, broad toy-like teeth, gold fittings and short grounded feet. | No hidden/reveal requirement, child in a chest, gore, saliva, tongue attack or needle teeth. |

The Tea-Time and Warrior skeletons share one approved toy-bone construction;
the two lizard guards share one approved body/scale/tail sheet; the slime family
shares one gel-material grammar without erasing the existing Blueberry Slime or
Jelly Sorcerer identities. Contact-sheet cells are review evidence only and may
not be cropped into masters. Each eventual identity begins with independent
source runs from one locked brief and receives a new versioned source record,
generator original, deterministic derivative recipe, measurements, selection or
rejection reason, and rollback pointer before any runtime catalogue proposal.

## Plan 03 / `mgjrpg-02` Human-selection addendum v3 (2026-09-03)

This is a forward-only correction. The v02 exact prompts and their outputs stay
immutable. Exact submitted prompts, ordered reference roles, output IDs and
source defects for the new work live in
`docs/source-assets/calibrations/mgjrpg-02/v03/PROMPTS.md` and
`run-record.json`.

The Human selected a per-family recipe:

- Ame: Direction B surface appeal, with a new first-generation clean-base test;
  prior B is the fallback. Candidate C remains the sole identity/construction
  authority. Never supply prior B or another fresh attempt as a generation
  input.
- Core sampler: A by default; C only for Tea-Time Skeleton, Classic Slime and
  Lizard Sword Guard.
- Current family: A construction, detail ceiling, chroma and contours; B may
  influence broad interior colour and three-value shading only.
- Future extension: B concept cues for T-Rex, Kappa and Mimic; A concept cues
  for Wholesome Succubus; redraw the set into the selected A-family/B-colour
  treatment.
- Portals: low flower-petal floor pads are a locked category. Do not turn them
  into upright magical doors or arches.

### Clean-base anti-accumulation block

Append this to future character and enemy source generations. It supersedes any
request for visible paper grain at field-sprite scale:

```text
Begin from a blank canvas. Do not edit, trace, repaint, transform, filter,
sharpen, composite, or reuse pixels from a prior rendering candidate. Identity
references control design and construction only; selected family boards control
high-level rendering craft only. Use two to four dominant colour masses. Give
each material exactly one smooth midtone, one connected broad shadow group and
one connected broad light group. Soft painterly warmth comes from those large
opaque colour planes, never accumulated surface noise. Keep face and skin
completely quiet. Permit at most one or two low-frequency gouache variations on
one large material, and only when each mark survives at 64 px. Reject
micro-facets, polygon chatter, grain clouds, stipple, mottling, brush specks,
nested highlight bands, repeated glints, colour fringing, sharpening halos,
edge chatter, watercolour blooms, compression-like grit, overpaint residue and
“deep-fried” AI texture. If the clean result changes a locked face, silhouette,
pose, hand socket, registration or costume landmark, reject it rather than
silently accepting the redesign.
```

### Selected r03 contour anchors

Use these as visible colour targets rather than a pixel-quantisation palette:

| Material neighbour | Target anchor |
| --- | --- |
| Blonde hair, gold | warm honey `#A86249` or the lighter Ame-specific `#B56B4F` |
| Lavender | aubergine `#80549A` or Ame-specific orchid `#9865AD` |
| Cool blue | blue-plum `#4D69A8` or Ame-specific cornflower `#607AB9` |
| Coral, leather, warm wood | coral-russet `#A95361` / `#B6616F` |
| Mint, foliage | leaf-plum `#4C7D68` / `#5F8875` |
| Cream, pale cloth | cream-mauve `#8C6984` / `#99788F` |
| Eyes, mouths, true occlusion only | ink-plum `#34203F` |

Long outer runs should normally land around 40–58% HSL lightness and retain an
obvious hue at 64 px. Use the ink-plum sparingly; never darken every target to
one perimeter simply to gain contrast. UI sticker cutlines remain separate
cream paper shapes outside a coloured inner contour. Field sprites, enemies,
props and floor portals receive no sticker cutline.

## Plan 03 / `mgjrpg-02` v03 review constraints (2026-09-03)

This forward-only note records the art-direction assessment of the v03 outputs;
it does not modify their exact prompts or assert Human approval.

- Neither Ame fresh study may become identity, rendering, or edit authority.
  Both reduce accumulated texture, but both change Candidate C's face, hair,
  cape, stance, registration, or hand socket. Prior Direction B is the proposed
  fallback until the Human explicitly decides.
- A future isolated Succubus source must preserve the selected Direction A
  broad friendly silhouette and readable magical gesture. The v03 hybrid board
  is not sufficient evidence for that requirement.
- Kappa production prompts must remove small leaf clusters, shell marks, and
  basket contents until only two to four large masses survive at 40 px.
  Treasure Mimic prompts likewise cap teeth, rivets, and plank seams to a few
  broad construction cues.
- Portal prompts preserve a shallow horizontal flower-pad silhouette. Reduce
  central sparkle count and petal filigree; use a stronger rose/mauve local edge
  on light floors. The existing portal remains the retain candidate until an
  isolated replacement materially improves it.

Any next request starts again from the immutable identity/construction source
and the selected family references. Do not use a v03 board, extracted cell,
cleaned proof cutout, or rejected fresh Ame as a new generation input.

## Plan 03 / `mgjrpg-02` Human approval and production addendum v4 (2026-09-03)

This is a forward-only decision record. It does not alter any exact historical
prompt, ordered reference list, output ID, source defect, or assessment above.
The exact pre-decision review and recipe bytes are preserved at:

- `docs/source-assets/calibrations/mgjrpg-02/v03/mgjrpg-02-canary-review-v14-pending.json`
- `docs/source-assets/calibrations/mgjrpg-02/v03/mgjrpg-02-recipe-r03-candidate.json`

The complete Human decision is recorded in
`docs/source-assets/calibrations/mgjrpg-02/v04/human-decision.json`.

The Human approved the composite `mgjrpg-02` revision 4 rendering recipe for
controlled, family-by-family source production with these binding selections:

- **Ame:** Fresh B-led 01 is the selected static rendering reference because it
  is clearer and more distinct at Ame's common small gameplay scale. Fresh
  B-led 02 is appealing at higher resolution but is not selected. Candidate C
  remains the sole identity/construction authority; Fresh 01 controls rendering
  craft only and may not change her face, age, golden-blonde shoulder-length
  hair, blue irises, proportions, mint/lavender costume, backpack, silhouette,
  registration, hand socket, or emotional character.
- **Rose Heart teleporter:** the fresh flower-petal floor-pad construction is
  selected. Its final isolated source must make the heart brighter and more
  clearly defined and use a verifiably uniform plain extraction matte. A
  painted checkerboard, matte tint inside translucent colour, or checker bleed
  is a source defect, never intentional transparency.
- **Future enemies:** the v03 Wholesome Succubus, Pocket T-Rex, Kappa, and
  Treasure Mimic are approved concept and rendering-family references. They are
  not crop masters. Generate each independently as one isolated asset from its
  locked brief and role-separated authorities.

### Ame production reference roles

For a fresh Ame static source, keep the roles closed and ordered:

1. Candidate C generator original — **identity and construction only**.
2. Candidate C model-sheet studies — **landmarks and registration only** when
   the exact task needs that view; never use an expression cell as a new face.
3. Fresh B-led 01 generator original — **approved rendering craft only**:
   clean small-scale massing, broad three-value colour, visibly chromatic local
   contours, and restrained painterly warmth.

Begin from a blank canvas. Do not edit, trace, overpaint, filter, composite, or
clean up Fresh B-led 01 into a new authority. Do not provide Fresh B-led 02,
prior Direction B, a proof cutout, or another production attempt as an
additional identity/rendering input. If identity and rendering guidance
conflict, Candidate C wins and the output is rejected rather than averaged.

### Flat-matte source block

Append this block to isolated cutout generation requests:

```text
Place the one complete isolated subject on a single perfectly flat, fully opaque,
uniform extraction matte whose colour is far from every subject material. The
matte must be one solid RGB value from corner to corner: no checkerboard, paper,
canvas grain, gradient, vignette, floor plane, cast shadow, glow cloud, bloom,
texture, transparency simulation, reflected colour, or subject-coloured fringe.
Keep at least the declared clear gutter around the full silhouette and every
weapon, tail, horn, wing, ear, petal, and sparkle. The matte is processing aid
only and must not appear inside translucent or reflective subject materials.
```

For the Rose Heart pad, also append:

```text
Make the central heart one simple, bright cream-gold focal shape with an
unbroken rose-plum local contour. It must remain recognisable at the declared
delivery size and clearly separate from the surrounding aperture. Keep the pad
low and horizontal; do not turn it into an arch, doorway, hovering ring, or
upright portal. Reduce sparkles and petal filigree before increasing contrast.
```

### Batch review and publication boundary

Prioritise authored sources and genuine replacements over elaborate review
presentation. A production batch uses one lightweight HTML page at one declared
sprite scale with the exact asset name below each image. After an explicit
Human response, every unlisted asset in that reviewed batch is approved by
default; named exceptions are rejected and regenerated independently in the
next batch. Silence, an unsubmitted page, or an asset absent from the page is
not approval.

Recipe approval authorizes source generation and deterministic derivative
preparation only. It does not approve an unreviewed cleaned cutout, rights,
public bytes, a catalogue pointer, preload, runtime publication, animation, or
retirement. During Plan 03, classify superseded files in the retirement ledger
without moving or deleting runtime assets. Keep versioned rollback files until
Plan 12 after all later consumers and catalogue pointers are final, and never
place an archive beneath `public/assets`.

## Plan 03 production batches 02–10 — forward-only source record

The exact prompts, ordered reference roles, immutable generator output IDs,
hashes, byte counts, dispositions, and rollback boundaries for current volume
production live beside their source masters:

- `docs/source-assets/production/mgjrpg-02/batch-02/` — navigation stickers,
  app icon, water/lava/poison, rejected flat hole, and pending deep-hole v03.
- `docs/source-assets/production/mgjrpg-02/batch-03-friends/` — independent
  candidate pairs for all fifteen established animal friends. Human-selected
  sources through Red Panda have approved 512 px derivatives; the remaining
  species await bulk review.
- `docs/source-assets/production/mgjrpg-02/batch-04-mythic-friends/` — original
  yokai/fantasy/Greek-and-Roman-inspired collectible friends. The leaf-fringe
  Kappa attempt is rejected evidence; the corrected water-cap Kappa and the
  rest await bulk review.
- `docs/source-assets/production/mgjrpg-02/batch-05-weapons/` — fresh
  constructions for all eight held-weapon identities. The ornate Bubble Bow
  and extra-star Moon Wand attempts are rejected evidence; their simplified
  replacements and the other weapons await bulk review.
- `docs/source-assets/production/mgjrpg-02/batch-06-cages/` — fresh shared-anatomy
  constructions for all four cage materials. Constraint failures and the
  Storybook Wood attempt with a baked offset layer remain rejected evidence;
  corrected three-bar, neutral-lighting candidates await bulk review.
- `docs/source-assets/production/mgjrpg-02/batch-07-locks-doors/` — fresh
  shape-and-colour-coded Heart, Star, and Sun keys and doors. The preferred
  doors share a two-hinge, two-leaf, cream-stone anatomy; four-hinge attempts
  remain rejected evidence.
- `docs/source-assets/production/mgjrpg-02/batch-08-enemy-refresh/` — fresh
  Blueberry Slime, Pebble Golem, Candy Mimic, and Cloud Gremlin sources that
  address the four current-enemy outliers identified by Plan 03.
- `docs/source-assets/production/mgjrpg-02/batch-09-item-refresh/` — fresh
  Spring Boots, Antidote Leaf, and Science Gears sources with one dominant
  function cue, fewer motifs, and cleaner item-scale silhouettes.
- `docs/source-assets/production/mgjrpg-02/batch-10-environment-canaries/` —
  fresh Sunny Stone and Wishing Woods floor/wall paintings. Preferred sources
  passed the deterministic Poisson seam thresholds; three technically seamless
  but visibly stamped attempts remain rejected macro-repeat evidence.

Do not reconstruct a source from this summary. The adjacent `PROMPTS.md` files
are the exact historical prompt authority, and each `run-record.json` binds
those blocks to output bytes. New iterations append a run or batch; they never
rewrite an old prompt or turn a rejected output into a rendering/identity
reference.

Reusable production constraints reinforced by these batches:

- Begin on a blank canvas. Existing runtime art supplies semantic identity or
  species/category landmarks only; approved `mgjrpg-02` sources supply rendering
  craft only.
- Use two to four large colour masses, three broad connected values, one clear
  silhouette feature, restrained painterly variation, and bright continuous
  material-local contours. Dark ink-plum is limited to tiny critical
  separations.
- Ordinary friends receive no arbitrary magical motif. Mythic friends receive
  only folklore-defining landmarks, simplified until readable as pet-scale
  companions. Friend and enemy Kappa designs differ in posture, expression,
  scale, and role while both preserve the water-dish landmark.
- A weapon gets one functional silhouette, one motif, at most one gem/core and
  one ribbon/tassel, plus a visually clear cylindrical hand-grip segment. Added
  motifs or filigree that compromise the named identity or held-size read are
  rejection defects.
- Every isolated source uses a literal uniform matte or genuine alpha. A
  painted checkerboard is invalid. Field sprites receive no cream sticker
  cutline; that cutline remains exclusive to semantic UI art.
- Cage openings are transparency, not dark recesses: bars may carry local form
  shading and occlusion at their joinery, but no duplicate/drop-shadow layer
  may sit behind them. All material variants preserve exactly three slim inner
  bars, two outer posts, one top rail, one bottom rail, and one centered lock.
- Key/door families repeat one large semantic motif and one shared construction;
  colour is reinforced by the Heart, Star, or Sun silhouette rather than being
  the only cue. Paired floor portals remain the existing flower-pad category and
  are not regenerated merely to acquire an `mgjrpg-02` label.
- A Candy Mimic must read as a living chest, not a child inside a costume. Pale
  Cloud Gremlin materials require a strong blue-plum contour; the Pebble Golem
  uses fewer rounded stone masses and avoids foreshortened threatening fists.
- Spring Boots reserve visual priority for their coils; Antidote Leaf adds a
  lavender band and cream droplet as a non-green medicine cue; Science Gears
  use exactly three broad interlocks with one optional focal spark. First Star
  keeps its approved 512 px shelf art and receives deterministic optical sizes
  instead of a gratuitous new identity.
- Terrain approval requires both seam metrics and a 3x3/5x5 repeat judgement.
  A mathematically clean wrap still fails when a dominant central stone, unique
  masonry arrangement, rosette, or accent cluster exposes the repeat period.
