# Batch 29 — Home hero final transparency and horn correction

## Scope and authority

- The v03 approved home-hero source remains the composition, character-identity, rendering, and pixel-continuity authority.
- Built-in image generation was used only to correct the unicorn horn attachment.
- The selected generator output is not published wholesale. A deterministic, tightly bounded difference mask transfers only the horn and the minimum adjacent mane pixels onto the approved v03 source.
- Exterior white matte and two explicitly measured, enclosed white background pockets are removed deterministically. Intentional white materials—fur, bone, eyes, map paper, highlights, and stars—remain opaque.

## Attempt 01 — rejected transparent edit

Provider output ID: `exec-c19c9ebb-c7fa-48d9-a476-ee12ed49f4a2.png`

Exact prompt:

> Use case: precise-object-edit
> Asset type: production transparent home-screen hero illustration for Maze so Puzzle
> Input images: Image 1 is the sole edit target and composition/identity authority.
> Primary request: Correct only two defects. First, move and redraw the unicorn's rainbow horn so it emerges anatomically from the exact centre of the forehead, centred between and above the eyes, following the head's centreline; it must no longer emerge above one eyebrow. Preserve the horn's rainbow colours, size, angle, material and charming style. Second, remove the entire white background as genuine transparency, including every enclosed white background pocket and narrow negative-space gap between or around the characters, skeleton bones, limbs, map, stars, hair, ears and tail.
> Style/medium: preserve the existing clean chunky cute magical-girl anime JRPG cel-gouache rendering and colour-aware contours exactly.
> Composition/framing: preserve the exact canvas aspect ratio, character placement, scale, crop, poses, expressions, hand positions, map, stars, tea cup, clothing and silhouettes.
> Constraints: change only the unicorn horn attachment/position and background transparency. Keep Ame, the bunny, Tea-Time Skeleton, unicorn, map, two stars and every foreground detail unchanged. Do not redraw faces, anatomy, clothing, props, lighting, outlines, palette, texture or composition. No added or removed foreground object. No white matte, checkerboard, halo, fringe, glow, text, logo, watermark, cast shadow or background scene. Output a genuine RGBA image with transparent background and clean anti-aliased edges; preserve intentional white character materials such as fur, bone, eyes, clothing highlights, map paper and stars.

Disposition: rejected. The provider returned an opaque checkerboard and introduced broader redraw drift, so the file is provenance evidence only and never an edit target or runtime source.

## Attempt 02 — selected as bounded horn donor only

Provider output ID: `exec-75d90974-e6ac-4910-b0d5-9da045b09abd.png`

Exact prompt:

> Use case: precise-object-edit
> Asset type: approved Maze so Puzzle home-screen hero illustration
> Input images: Image 1 is the sole edit target and exact authority.
> Primary request: Correct only the unicorn horn attachment. Move/redraw only the rainbow horn so its base emerges anatomically from the exact centre of the unicorn's forehead, centred between and above both eyes along the head centreline. It must not emerge above either eyebrow. Preserve the same horn height, tapered spiral construction, rainbow colour order, materials, lighting and outline style.
> Scene/backdrop: preserve the existing plain white background exactly; background removal will be handled separately.
> Constraints: change only the small horn and the minimum immediately occluded pink mane pixels needed beneath its base. Pixel-faithfully preserve the canvas, composition, Ame, bunny, Tea-Time Skeleton, unicorn face/eyes/ears/body/mane/tail, map, tea cup, two stars, poses, expressions, scale, placement, lighting, contours, palette, texture and every other detail. No transparency, checkerboard, glow, text, logo, watermark, added or removed object, character redesign, anatomy change, crop, rescale or composition shift.

Disposition: selected only as a horn/mane donor inside the recorded deterministic mask. The full generated frame is not a composition or identity authority and is not published wholesale.

## Deterministic delivery contract

- Base: `batch-27-v0201-corrective-art/home-hero-splash-v03-alpha-correction-generator-original.png`
- Horn donor: `home-hero-splash-v04-centered-horn-generator-original.png`
- Horn transfer: fixed source-space polygon, absolute per-channel difference threshold, bounded dilation, and feathered blend.
- Alpha recovery: edge-connected exterior white removal plus seeded clearing of only the two Human-reported enclosed background pockets.
- Output: versioned transparent master and lossless 1024×768 WebP runtime derivative.
- No previous source, derivative, or runtime file is overwritten or deleted.
