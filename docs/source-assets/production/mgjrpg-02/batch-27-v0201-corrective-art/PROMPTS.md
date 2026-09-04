# v0.20.1 corrective-art generation record

Recorded 2026-09-04. The built-in image-generation tool did not expose a model
build, seed, or exact execution timestamp. All inputs were repository-owned
Maze so Puzzle sources. The immutable provider outputs sit beside this file.

## Professor Poggle v02

Output ID: `exec-d3a13d2d-f3f0-4b18-8999-e0cede23ee62.png`

References, in order:

1. `docs/source-assets/story-professor-poggle-v1-master.png` — identity and construction authority.
2. `docs/source-assets/production/mgjrpg-02/batch-20-final-coverage/ame-portrait-v02-candidate-a-generator-original.png` — immutable source behind the final portrait crop and rendering authority.
3. `docs/source-assets/production/mgjrpg-02/batch-03-friends/approved/friend-bunny-v02-512.png` — immutable small-scale contour and colour-mass authority.

Prompt:

> Create a new, from-scratch square 1:1 story-dialogue portrait of Professor
> Poggle for the children's magical-girl anime JRPG “Maze so Puzzle”. Preserve
> the established tiny round tawny owl cartographer identity: oversized teal
> round spectacles, warm amber/tawny feathers, cream face and chest, lavender
> scholar cape with warm gold trim, cream waistcoat, teal ribbon and brooch
> accents, and a rolled parchment map under one wing. Match Ame's final portrait
> crop, background family, finish and lighting. Use clean, chunky, readable
> storybook-cel art, two to four major colour masses, broad cel-gouache values,
> restrained painterly texture, and bright material-local colour-aware contours.
> Reserve deepest ink-plum for eyes, mouth, occlusion and critical separations.
> Centre a large bust on a warm cream background with a pale mint radial
> medallion and restrained gold sparkles. Opaque background; no text, logo,
> border, cast shadow, extra character, photorealism, or global black outline.

## Sprig v02

Output ID: `exec-0fc90a9c-69aa-4fbf-93fd-008603bd13ce.png`

References, in order:

1. `docs/source-assets/story-sprig-v1-master.png` — identity and construction authority.
2. `docs/source-assets/production/mgjrpg-02/batch-20-final-coverage/ame-portrait-v02-candidate-a-generator-original.png` — immutable source behind the final portrait crop and rendering authority.
3. `docs/source-assets/production/mgjrpg-02/batch-03-friends/approved/friend-bunny-v02-512.png` — immutable small-scale contour and colour-mass authority.

Prompt:

> Create a new, from-scratch square 1:1 story-dialogue portrait of Sprig for the
> children's magical-girl anime JRPG “Maze so Puzzle”. Preserve the established
> tiny round baby cloud-dragon identity: peach-cream cloudlike scales, exactly
> two soft mint horns, two small lilac winglets, violet eyes, a tiny golden
> star-shaped nose freckle, puffy cheeks, and bashful joyful expression. Match
> Ame's final portrait crop, background family, finish and lighting. Use clean,
> chunky, readable storybook-cel art, broad cel-gouache values, restrained
> painterly texture, and bright material-local colour-aware contours. Reserve
> deepest ink-plum for eyes, mouth, occlusion and critical separations. Centre a
> large bust on a pale sky-blue background with a cream/lilac radial medallion,
> soft clouds and restrained gold sparkles. Opaque background; no text, logo,
> border, cast shadow, extra character, photorealism, or global black outline.

## Home hero v03 cleanup attempts

Output IDs:

- `exec-8768336f-c238-4bcf-a9bd-a1fbfeeb3631.png` — rejected because the provider painted a checkerboard into RGB.
- `exec-aea53678-f3c7-46c6-b8ed-6e44acade992.png` — selected as the clean exterior-matte source; the provider still returned RGB, so deterministic edge-connected matte extraction is required.

References:

1. `docs/source-assets/production/mgjrpg-02/batch-26-plan03-r2-home-composition/home-hero-splash-v02-larger-tea-skeleton-generator-original.png` — approved composition and identity authority.
2. `docs/source-assets/production/mgjrpg-02/batch-26-plan03-r2-home-composition/home-hero-splash-v02-transparent-master.png` — defect reference only.

Prompt intent was strictly bounded: preserve the complete approved composition
and every character/object, remove the matte, repair the chopped/green-fringed
silhouette, keep generous exterior padding, and return actual alpha with no
baked glow. The provider twice returned opaque RGB; neither output is described
as native alpha. Runtime alpha is therefore a recorded delivery operation, not
an invented generator claim.
