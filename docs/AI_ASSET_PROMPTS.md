# AI art prompt set

All artwork in `public/assets/` was generated for this project with the built-in
OpenAI image-generation tool. Tile and interactive assets were prepared as
512 × 512 PNGs; the wide title illustration has a 1672 × 941 PNG master and an
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

The feedback update added a second generated art pass. These PNGs use the same chunky anime storybook JRPG direction as the original set. Character, cage, currency, sticker, and medal art has a transparent background; the two environment textures are opaque seamless tiles. The active `floor` and `wall` entries in `src/assets.ts` now point to the v2 textures.

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

At runtime these files are served from their matching `/assets/...` URLs and are all included by `preloadGameArt()`.
