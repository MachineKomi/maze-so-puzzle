# AI art prompt set

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
