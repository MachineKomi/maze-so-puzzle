# Plan 03-R2 home composition prompts

## Home Splash B — larger tea skeleton

Tool: OpenAI built-in image generation capability. Provider model/build, seed,
request ID and exact execution timestamp were not exposed.

Use case: precise-object-edit. Image 1 was the immutable approved Home Splash B
generator original and sole composition/identity authority. Change only the
friendly green-tea-drinking skeleton at lower left: render the same skeleton
approximately 65% larger, anchored to the same seated ground position and
lower-left compositional role. Preserve its expression, unclothed construction,
pose, traditional handleless Japanese tea cup, saucer, child-friendly character
and material-local contours. Preserve Ame, rabbit, unicorn, book, stars, crop,
lighting, palette and vivid green extraction matte. Do not add, remove, move or
redesign other elements; no text, watermark, shadow, scenery or checkerboard.

Selected output:
`home-hero-splash-v02-larger-tea-skeleton-generator-original.png`

## Transparency processing

Built-in background-extraction trials were made for both sources. The logo trial
returned alpha but weakened alpha authority; the splash trial baked a visible
checkerboard and was rejected. Runtime transparency therefore uses the existing
deterministic `flat-impossible-matte-alpha-unblend-v1` pipeline on the selected
green-matte originals. This is derivative processing only and does not redraw
the approved art.
