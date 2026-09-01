# AI art prompt set

All base artwork in `public/assets/` was generated for this project with the
built-in OpenAI image-generation tool. Runtime resizing, chroma removal, WebP
conversion, palette optimization, and exact-periodic mirror composition are
programmatic derivatives of those generated sources. Early tile and interactive
assets were prepared as 512 × 512 PNGs; the 0.6.0 periodic terrain textures are
1024 × 1024 PNGs; the wide title illustration has a 1672 × 941 PNG master and an
optimized WebP runtime derivative. Interactive assets were requested on a flat
`#ff00ff` chroma-key background. Most early sprites arrived as clean RGBA
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
- Optimized exact-periodic runtime texture: `public/assets/wall-v3.png`
- Runtime URL: `/assets/wall-v3.png`

Generation request:

```text
Use case: stylized-concept. Create one genuinely seamless, purely top-down square fantasy stone material for a children's maze game. Show roughly 10 to 14 small rounded cobblestones across the image, using lavender-blue and periwinkle stones, plum-purple mortar, tiny sparse moss accents, and soft diffuse lighting. Lovely polished hand-painted chunky anime fantasy RPG / storybook game art, friendly and readable behind small sprites. The image must tile perfectly on every edge and contain only a continuous stone material: no maze diagram, path, wall silhouette, frame, border, lip, cast shadow, perspective, giant slabs, characters, objects, text, or watermark.
```

### Floor v3

- Generated source: `exec-4984c443-517f-43fa-833e-a67319dc18a4.png`
- Archived 1254 × 1254 master:
  `docs/source-assets/floor-v3-master.png`
- Optimized exact-periodic runtime texture: `public/assets/floor-v3.png`
- Runtime URL: `/assets/floor-v3.png`

Generation request:

```text
Use case: stylized-concept. Create one genuinely seamless, purely top-down square fantasy floor material for a children's maze game. Show roughly 10 to 14 small softly rounded limestone pavers across the image, using buttercream, warm honey-gold, and pale apricot tones that harmonize clearly with lavender-blue walls. Lovely polished hand-painted chunky anime fantasy RPG / storybook game art, quiet enough for characters and items to remain readable, with soft diffuse lighting. The image must tile perfectly on every edge and contain only a continuous paving material: no maze diagram, path, wall, frame, border, lip, cast shadow, perspective, giant slabs, characters, objects, text, or watermark.
```

For each v3 material, the generated master was resized to a 512 × 512 working
tile and mirrored into a 2 × 2 periodic composition. The resulting 1024 × 1024
PNG was quantized to a 256-colour palette without dithering. This guarantees an
exact matching edge period for the world-coordinate SVG pattern while retaining
the AI-painted interior detail.

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

The generated 1254 × 1254 masters were downsampled to a 512 × 512 working
tile, mirrored into a 2 × 2 1024 × 1024 exact-periodic composition, and
quantized to a 256-colour palette without dithering. This was a downsample and
periodic composition only—no upscaling was applied. Opposite runtime edges were
verified byte-for-byte, and all textures are fully opaque.

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
