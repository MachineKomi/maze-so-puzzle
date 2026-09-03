# `mgjrpg-02` production Batch 01 — exact ImageGen prompts

Date: 2026-09-03

Status: source-only production candidates. Human approval of the v14 rendering
gate does not itself publish any file below `public/assets/`.

Every prompt below is preserved exactly as submitted to the built-in image
generation/editing capability. Ordered reference paths, hashes, returned output
IDs, and dispositions are recorded in the adjacent run record after execution.

## `ame-static-v02-b-led-01-alpha`

```text
Use case: background-extraction
Asset type: canonical static field-sprite source cutout for a child-friendly anime JRPG
Input images: Image 1 is the Human-selected Ame Fresh B-led 01 generator original and is the only edit target.
Primary request: Remove only the painted checkerboard background and return the exact same Ame as a clean isolated cutout with genuine alpha transparency.
Subject invariants: Preserve every visible character pixel and the complete approved B-led 01 design: warm young face, clearly blue irises, golden-blonde shoulder-length softly layered hair with side braid and white flower, mint tunic, cream trim and shorts, lavender cape, lavender backpack, brown cross-body strap and belt, coral-red boots, proportions, pose, expression, hands, silhouette, material-coloured outlines, highlights, and broad shading. Do not redraw, beautify, sharpen, denoise, recolour, relight, re-pose, re-register, or add detail.
Edge treatment: Keep the existing clean coloured contour. Remove checker squares, pale matte, grey fringe, and halo completely. Preserve fine hair and cape tips. No white or cream sticker border.
Scene/backdrop: Actual transparent pixels outside the character. Do not depict or simulate a checkerboard. Do not add a floor, cast shadow, glow, particles, scenery, or framing device.
Composition/framing: Keep the complete head-to-boots figure centered with the same scale and generous transparent padding; square canvas.
Constraints: This is background extraction only. No text, watermark, logo, extra object, extra limb, missing feature, or identity change.
```

## `portal-rose-heart-v02-candidate-02`

```text
Use case: precise-object-edit
Asset type: top-down/three-quarter field teleporter floor-pad source for a child-friendly anime JRPG
Input images: Image 1 is the Human-approved fresh Rose Heart flower-floor-pad construction and the only edit target.
Primary request: Preserve the approved flower-petal floor-pad construction and rendering, while making the central heart symbol brighter, cleaner, more crisply defined, and immediately readable at small gameplay size. Remove only excess visual ambiguity in the heart; keep it a luminous cream-gold heart bounded by a clear warm pink inner contour against the magenta portal pool.
Construction invariants: Keep the same low horizontal six-petal flower pad, shallow floor-plane perspective, circular gold inner rim, cream and rose petals, four small magenta rim gems, lower diamond registration point, overall proportions, symmetry, broad three-value grouping, and material-aware coloured contours. Do not turn it into an upright door, arch, fountain, raised dais, or sticker.
Detail control: Slightly simplify tiny sparkles and microtexture so the central heart is the focal point. Preserve clean chunky forms and restrained painterly facets. No baked directional cast shadow, floor shadow, glow outside the silhouette, particles outside the pad, text, logo, or watermark.
Scene/backdrop: Genuine alpha transparency outside the pad; do not draw or simulate a checkerboard. If genuine alpha is unavailable, use one perfectly uniform solid #00E5E5 matte with no texture, gradient, vignette, shadow, or colour variation.
Composition/framing: One complete centered floor pad, square canvas, generous even padding, nothing cropped.
```

## `enemy-tea-time-skeleton-v01`

```text
Use case: stylized-concept
Asset type: isolated production-candidate enemy field sprite for a child-friendly anime JRPG
Input images: Image 1 is the Human-selected Direction C Tea-Time Skeleton construction reference. Image 2 is the Human-approved four-enemy hybrid and defines the final chunky clean family rendering. Image 3 is the selected Direction A current-family reference for chroma and material-local contour craft.
Primary request: Generate a new independent single Tea-Time Skeleton sprite from a blank canvas. Preserve the selected concept: a courteous toy-ivory skeleton sitting or kneeling calmly, wearing a simple leaf-green headscarf and soft moss-green dungeon tunic, holding one small mint ceramic teacup of green tea and a matching saucer, with one simple steam curl. The comedy is polite tea in an early dungeon, never horror.
Style/medium: Original clean chunky magical-girl storybook JRPG anime sprite; simple confident shapes, two to four major colour masses, three broad cel-like values, restrained painterly facets, expressive friendly face, strong 40–84 px silhouette.
Contours: Clearly visible brighter colour-aware outlines authored into the art—not black and not a post-process halo. Use warm tea-brown/plum around ivory and ceramics, leaf-plum around cloth/leaves, and ink-plum only for the eyes, mouth, deepest socket separation, and tiny critical gaps. Keep contour runs continuous and material-local.
Pose/camera: Compact front three-quarter field pose, entire character and tea set visible, one-tile registration, calm friendly eyeline, no weapon, no attack.
Scene/backdrop: Genuine alpha transparency; never draw checkerboard. If alpha is unavailable, use one perfectly uniform solid #00E5E5 matte. No ground plane, cast shadow, glow, particles, scenery, text, logo, or watermark.
Avoid: realistic anatomy, void-black sockets, broken bones, gore, menace, muddy microtexture, stippling, filigree, cream sticker cutline, franchise-specific costume or composition.
```

## `enemy-classic-slime-v01`

```text
Use case: stylized-concept
Asset type: isolated production-candidate enemy field sprite for a child-friendly anime JRPG
Input images: Image 1 is the Human-selected Direction C traditional slime construction reference. Image 2 is the Human-approved four-enemy hybrid and defines the final chunky clean family rendering. Image 3 is the selected Direction A current-family reference for chroma and material-local contour craft.
Primary request: Generate a new independent single classic fantasy slime sprite from a blank canvas: one low rounded translucent mint-aqua gel mound, broad simple face plane, two large friendly dark eyes with clear catchlights, tiny cheerful mouth, and one very small detached gel droplet only if it strengthens the silhouette. No accessory, hat, wand, beverage, or elemental theme.
Style/medium: Original clean chunky magical-girl storybook JRPG anime sprite; very simple confident geometry, two to three major colour masses, three broad values, restrained painterly gel facets, unmistakable at 40–84 px.
Contours: Bright colour-aware gel contour in a darker richer teal/blue-plum, continuous and clearly chromatic rather than black. Reserve ink-plum for eyes and mouth only. Interior gel edges are sparse, broad, and material-aware.
Pose/camera: Low front three-quarter field view, centered, complete silhouette, one-tile registration.
Scene/backdrop: Genuine alpha transparency; never draw checkerboard. If alpha is unavailable, use one perfectly uniform solid #FF40C8 matte. No floor, cast shadow, glow outside the body, particles, scenery, text, logo, or watermark.
Avoid: franchise-specific droplet silhouette or face, elaborate bubbles, realism, slime trail, menace, muddy microtexture, cream sticker cutline.
```

## `enemy-lizard-sword-guard-v01`

```text
Use case: stylized-concept
Asset type: isolated production-candidate enemy field sprite for a child-friendly anime JRPG
Input images: Image 1 is the Human-selected Direction C Lizard Sword Guard construction reference. Image 2 is the Human-approved four-enemy hybrid and defines the final chunky clean family rendering. Image 3 is the selected Direction A current-family reference for chroma and material-local contour craft.
Primary request: Generate a new independent single Lizard Sword Guard sprite from a blank canvas. Preserve the selected stout young lizard guardian construction: rounded mint and leaf-green scales, broad tail, large amber eyes, coral scarf, simple warm leather belt and bracers, compact cream-metal shoulder guard, small leaf-emblem round shield, and a blunt short leaf-shaped practice sword held safely sideways.
Style/medium: Original clean chunky magical-girl storybook JRPG anime sprite; expressive friendly-competitive face, two to four major colour masses, three broad values, restrained painterly facets, clean silhouette readable at 40–84 px.
Contours: Brighter material-local coloured outlines: leaf-plum around scales, russet-plum around scarf/leather, warm golden-brown around metal, blue-plum only where cool material requires it, and darkest ink-plum only for eyes, mouth, deep occlusion, and tiny critical gaps. No uniform black perimeter.
Pose/camera: Compact front three-quarter planted guard pose, full body and tail visible, sword never aimed at camera, one-tile registration.
Scene/backdrop: Genuine alpha transparency; never draw checkerboard. If alpha is unavailable, use one perfectly uniform solid #FF40C8 matte. No ground, cast shadow, glow, action effect, scenery, text, logo, or watermark.
Avoid: aggression, wounds, realistic reptile horror, dense scales, too many armour plates, filigree, cream sticker cutline, franchise-specific design.
```

## `enemy-lizard-spear-guard-v01`

```text
Use case: stylized-concept
Asset type: isolated production-candidate enemy field sprite for a child-friendly anime JRPG
Input images: Image 1 is the Human-selected Direction C Lizard Sword Guard construction reference and supplies the sibling anatomy. Image 2 is the Human-approved four-enemy hybrid and defines the final chunky clean family rendering. Image 3 is the selected Direction A current-family reference for chroma and material-local contour craft.
Primary request: Generate a new independent single Lizard Spear Guard sprite from a blank canvas. Use the same stout young lizard species, head, large amber eyes, mint and leaf-green scale masses, broad tail, coral scarf, warm leather pieces, cream-metal shoulder guard, proportions, and registration as the selected Sword Guard, but give this sibling a simple padded short spear held horizontally across the body and no shield. The spear has a blunt leaf-bud tip and reads as ceremonial training equipment, not an attack.
Style/medium: Original clean chunky magical-girl storybook JRPG anime sprite; expressive friendly-competitive face, two to four major colour masses, three broad values, restrained painterly facets, clean silhouette readable at 40–84 px.
Contours: Brighter material-local coloured outlines: leaf-plum around scales, russet-plum around scarf/leather and shaft, warm golden-brown around fittings, and darkest ink-plum only for eyes, mouth, deep occlusion, and tiny critical gaps. No uniform black perimeter.
Pose/camera: Compact front three-quarter planted guard pose, complete body, tail, hands and spear visible, spear parallel to picture plane and never pointed at camera, one-tile registration.
Scene/backdrop: Genuine alpha transparency; never draw checkerboard. If alpha is unavailable, use one perfectly uniform solid #FF40C8 matte. No ground, cast shadow, glow, action effect, scenery, text, logo, or watermark.
Avoid: separate species redesign, long dangerous weapon reach, aggression, wounds, dense scales, excessive armour, filigree, cream sticker cutline, franchise-specific design.
```

## `enemy-wholesome-succubus-v01`

```text
Use case: stylized-concept
Asset type: isolated production-candidate enemy field sprite for a child-friendly anime JRPG
Input images: Image 1 is the Human-approved four-enemy hybrid and is the exact design and final family-rendering reference for the top-left wholesome succubus. Image 2 is the selected Direction A current-family reference for chroma and material-local contour craft.
Primary request: Generate a new independent isolated master of the approved wholesome succubus from a blank canvas, preserving her compact child-safe proportions, warm confident face, large plum eyes, lilac layered bob, small rounded dark-purple horns, small rounded bat wings, heart-tipped tail, modest lavender tunic with coral belt and trim, dark plum leggings, lavender boots, and heart brooch. Keep the approved friendly stance and hand-near-cheek gesture.
Style/medium: Match the approved sprite's clean chunky magical-girl storybook JRPG anime rendering: two to four colour masses, three broad values, restrained painterly facets, clear chroma, sparse detail, strong 40–84 px silhouette.
Contours: Preserve bright continuous material-aware contours: aubergine around lavender cloth/hair, blue-plum around cool wing membranes, russet-plum around coral accents, and darkest ink-plum only for eyes, mouth, deep occlusion, and tiny critical separations. No black perimeter.
Pose/camera: Front three-quarter full-body field pose, one-tile registration, every wing/tail tip visible.
Scene/backdrop: Genuine alpha transparency; never draw checkerboard. If alpha is unavailable, use one perfectly uniform solid #00E5E5 matte. No floor, cast shadow, aura, heart particles, scenery, text, logo, or watermark.
Avoid: adult anatomy, cleavage, lingerie, exposed torso, glamour pose, seduction, kiss/charm magic, ornate costume, cream sticker cutline, franchise-specific design.
```

## `enemy-pocket-trex-v01`

```text
Use case: stylized-concept
Asset type: isolated production-candidate enemy field sprite for a child-friendly anime JRPG
Input images: Image 1 is the Human-approved four-enemy hybrid and is the exact design and final family-rendering reference for the top-right Pocket T-Rex. Image 2 is the selected Direction A current-family reference for chroma and material-local contour craft.
Primary request: Generate a new independent isolated master of the approved Pocket T-Rex from a blank canvas, preserving the huge friendly orange-red head, expressive warm brown eye and brow, rounded muzzle, few blunt cream teeth, tiny arms, compact body, oversized planted feet, thick curled tail, sparse plum body markings, blue neckerchief, and gold star medal.
Style/medium: Match the approved sprite's clean chunky magical-girl storybook JRPG anime rendering: two to four colour masses, three broad values, restrained painterly facets, clear chroma, sparse detail, strong 40–84 px silhouette.
Contours: Preserve bright continuous material-aware contours: russet-plum around orange hide, blue-plum around the scarf, warm golden-brown around medal/teeth/claws, and darkest ink-plum only for eye, mouth, deep occlusion, and tiny critical separations. No black perimeter.
Pose/camera: Front three-quarter full-body planted field pose, one-tile registration, entire tail and feet visible.
Scene/backdrop: Genuine alpha transparency; never draw checkerboard. If alpha is unavailable, use one perfectly uniform solid #00E5E5 matte. No floor, cast shadow, attack effect, scenery, text, logo, or watermark.
Avoid: predation, chase pose, gore, realistic reptile texture, needle teeth, aggression, dense spots, cream sticker cutline, franchise-specific dinosaur design.
```

## `enemy-kappa-v01`

```text
Use case: stylized-concept
Asset type: isolated production-candidate enemy field sprite for a child-friendly anime JRPG
Input images: Image 1 is the Human-approved four-enemy hybrid and is the exact design and final family-rendering reference for the bottom-left Kappa. Image 2 is the selected Direction A current-family reference for chroma and material-local contour craft.
Primary request: Generate a new independent isolated master of the approved Kappa from a blank canvas, preserving the rounded turquoise-green body, large friendly blue-grey eyes, gentle yellow beak, leafy dark-green hair framing a simple water-filled head dish, spiral-pattern turtle shell, navy scarf with teal heart clasp, webbed yellow-tipped hands and feet, one cucumber held upright, and a very simple small woven cucumber basket.
Style/medium: Match the approved sprite's clean chunky magical-girl storybook JRPG anime rendering: two to four colour masses, three broad values, restrained painterly facets, clear chroma, strong 40–84 px silhouette. Simplify the leaf count, shell pattern, basket weave, and cucumber speckles relative to the board so they survive small scale.
Contours: Preserve bright continuous material-aware contours: leaf-plum around greens, blue-plum around turquoise and navy, warm golden-brown around beak/dish/basket, and darkest ink-plum only for eyes, mouth, deep occlusion, and tiny critical separations. No black perimeter.
Pose/camera: Front three-quarter full-body field pose, one-tile registration, complete shell, dish, cucumber and feet visible.
Scene/backdrop: Genuine alpha transparency; never draw checkerboard. If alpha is unavailable, use one perfectly uniform solid #FF40C8 matte. No water splash, floor, cast shadow, action effect, scenery, text, logo, or watermark.
Avoid: caricature, crude folklore joke, mascot copying, drowning implication, over-detailed foliage or basket, cream sticker cutline.
```

## `enemy-treasure-mimic-v01`

```text
Use case: stylized-concept
Asset type: isolated production-candidate enemy field sprite for a child-friendly anime JRPG
Input images: Image 1 is the Human-approved four-enemy hybrid and is the exact design and final family-rendering reference for the bottom-right Treasure Mimic. Image 2 is the selected Direction A current-family reference for chroma and material-local contour craft.
Primary request: Generate a new independent isolated master of the approved Treasure Mimic from a blank canvas, preserving the chest-first chunky warm russet wood construction, rounded gold bands and fittings, plum interior, one huge friendly central eye with purple iris and bright catchlight, a small set of broad blunt cream teeth, simple keyhole plate, and short grounded feet. Keep it visibly alive and mischievous rather than frightening.
Style/medium: Match the approved sprite's clean chunky magical-girl storybook JRPG anime rendering: two to four colour masses, three broad values, restrained painterly facets, clear chroma, strong 40–84 px silhouette. Reduce tooth count, rivets, plank seams, and tiny highlight facets relative to the board.
Contours: Preserve bright continuous material-aware contours: russet-plum around wood, warm golden-brown around metal/teeth, aubergine around the interior, and darkest ink-plum only for eye, mouth cavity, deep occlusion, and tiny critical separations. No black perimeter.
Pose/camera: Front three-quarter object-creature field pose, one-tile registration, complete lid and feet visible.
Scene/backdrop: Genuine alpha transparency; never draw checkerboard. If alpha is unavailable, use one perfectly uniform solid #00E5E5 matte. No floor, cast shadow, saliva, tongue, attack effect, scenery, text, logo, or watermark.
Avoid: needle teeth, gore, child emerging from chest, hidden/reveal composition, excessive hardware or wood grain, cream sticker cutline, franchise-specific mimic design.
```

## Matte correction runs

The built-in generator returned the preceding ten requests as opaque RGB with a
painted checker or pale backdrop despite the explicit alpha request. Those
outputs remain immutable evidence. The following runs return to each original
authority—not to a preceding failed output—and deliberately request a visible,
uniform chroma matte for deterministic extraction.

### `ame-static-v02-b-led-01-matte-02`

```text
Use case: precise-object-edit
Asset type: canonical static field-sprite source on a chroma-key matte
Input images: Image 1 is the Human-selected Ame Fresh B-led 01 generator original and is the only edit target. Do not use any previous cleanup attempt.
Primary request: Keep the exact same Ame and replace only the checkerboard background with one completely flat, solid, opaque #FF00FF chroma-magenta background.
Subject invariants: Preserve every visible character pixel and the complete approved B-led 01 design: warm young face, clearly blue irises, golden-blonde shoulder-length softly layered hair with side braid and white flower, mint tunic, cream trim and shorts, lavender cape, lavender backpack, brown cross-body strap and belt, coral-red boots, proportions, pose, expression, hands, silhouette, material-coloured outlines, highlights, and broad shading. Do not redraw, beautify, sharpen, denoise, recolour, relight, re-pose, re-register, or add detail.
Backdrop contract: The entire background must be exactly one visually uniform vivid chroma-magenta colour with no checkerboard, transparency simulation, pattern, gradient, vignette, texture, glow, halo, cast shadow, contact shadow, floor, or scenery. Keep a clean hard subject-to-matte boundary without magenta spill.
Composition/framing: Complete head-to-boots figure centered at the same scale with generous even matte padding; square canvas.
Constraints: Change only the background. No text, watermark, logo, extra object, extra limb, missing feature, or identity change.
```

### `portal-rose-heart-v02-matte-02`

```text
Use case: precise-object-edit
Asset type: top-down/three-quarter field teleporter floor-pad source on a chroma-key matte
Input images: Image 1 is the Human-approved fresh Rose Heart flower-floor-pad construction and the only edit target. Do not use any previous correction attempt.
Primary request: Preserve the approved flower-petal floor-pad construction and rendering, while making the central heart symbol brighter, cleaner, more crisply defined, and immediately readable at small gameplay size. Keep it a luminous cream-gold heart bounded by a clear warm pink inner contour against the magenta portal pool.
Construction invariants: Keep the same low horizontal six-petal flower pad, shallow floor-plane perspective, circular gold inner rim, cream and rose petals, four small magenta rim gems, lower diamond registration point, overall proportions, symmetry, broad three-value grouping, and material-aware coloured contours. Do not turn it into an upright door, arch, fountain, raised dais, or sticker.
Detail control: Slightly simplify tiny sparkles and microtexture so the central heart is the focal point. Preserve clean chunky forms and restrained painterly facets. No baked directional cast shadow, floor shadow, exterior glow, or particles outside the pad.
Backdrop contract: Use one completely flat, solid, opaque #00E600 chroma-green background across the entire canvas. No checkerboard, transparency simulation, pattern, gradient, vignette, texture, shadow, floor, scenery, or green spill on the object.
Composition/framing: One complete centered floor pad, square canvas, generous even matte padding, nothing cropped.
Constraints: No text, logo, watermark, or additional object.
```

### `enemy-classic-slime-v01-matte-02`

```text
Use case: stylized-concept
Asset type: isolated production-candidate enemy field sprite on a chroma-key matte for a child-friendly anime JRPG
Input images: Image 1 is the Human-selected Direction C traditional slime construction reference. Image 2 is the Human-approved four-enemy hybrid and defines the final chunky clean family rendering. Image 3 is the selected Direction A current-family reference for chroma and material-local contour craft. Do not use the previous failed slime output.
Primary request: Generate a new independent single classic fantasy slime sprite from a blank canvas: one low rounded translucent mint-aqua gel mound, broad simple face plane, two large friendly dark eyes with clear catchlights, tiny cheerful mouth, and one very small detached gel droplet only if it strengthens the silhouette. No accessory, hat, wand, beverage, or elemental theme.
Style/medium: Original clean chunky magical-girl storybook JRPG anime sprite; very simple confident geometry, two to three major colour masses, three broad values, restrained painterly gel facets, unmistakable at 40–84 px.
Contours: Bright colour-aware gel contour in a darker richer teal/blue-plum, continuous and clearly chromatic rather than black. Reserve ink-plum for eyes and mouth only. Interior gel edges are sparse and broad. The slime is internally self-contained and must not visually transmit, reflect, checker, or blend with the background colour.
Backdrop contract: Use one completely flat, solid, opaque #FF00FF chroma-magenta background across the entire canvas. No checkerboard, transparency simulation, pattern, gradient, vignette, texture, floor, cast shadow, glow, scenery, or magenta spill in the gel.
Pose/camera: Low front three-quarter field view, centered, complete silhouette, one-tile registration, generous even matte padding.
Avoid: franchise-specific droplet silhouette or face, elaborate bubbles, realism, slime trail, menace, muddy microtexture, cream sticker cutline, text, logo, watermark.
```

### `enemy-tea-time-skeleton-v01-matte-02`

```text
Use case: stylized-concept
Asset type: isolated production-candidate enemy field sprite on a chroma-key matte for a child-friendly anime JRPG
Input images: Image 1 is the Human-selected Direction C Tea-Time Skeleton construction reference. Image 2 is the Human-approved four-enemy hybrid and defines the final chunky clean family rendering. Image 3 is the selected Direction A current-family reference for chroma and material-local contour craft. Do not use the previous failed skeleton output.
Primary request: Generate a new independent single Tea-Time Skeleton sprite from a blank canvas: a courteous toy-ivory skeleton sitting or kneeling calmly, wearing a simple leaf-green headscarf and soft moss-green dungeon tunic, holding one small mint ceramic teacup of green tea and a matching saucer, with one simple steam curl. The comedy is polite tea in an early dungeon, not horror.
Style/medium: Original clean chunky magical-girl storybook JRPG anime sprite; simple confident shapes, two to four major colour masses, three broad cel-like values, restrained painterly facets, expressive friendly face, strong 40–84 px silhouette.
Contours: Clearly visible brighter colour-aware outlines authored into the art—not black and not a post-process halo. Use warm tea-brown/plum around ivory and ceramics, leaf-plum around cloth/leaves, and ink-plum only for eyes, mouth, deepest socket separation, and tiny critical gaps. Keep contour runs continuous and material-local.
Pose/camera: Compact front three-quarter field pose, entire character and tea set visible, one-tile registration, calm friendly eyeline, no weapon or attack.
Backdrop contract: Use one completely flat, solid, opaque #FF00FF chroma-magenta background across the entire canvas. No checkerboard, transparency simulation, pattern, gradient, vignette, texture, floor, cast shadow, glow, scenery, or magenta spill on the subject.
Avoid: realistic anatomy, void-black sockets, broken bones, gore, menace, muddy microtexture, stippling, filigree, cream sticker cutline, text, logo, watermark, franchise-specific costume or composition.
```

### `enemy-lizard-sword-guard-v01-matte-02`

```text
Use case: stylized-concept
Asset type: isolated production-candidate enemy field sprite on a chroma-key matte for a child-friendly anime JRPG
Input images: Image 1 is the Human-selected Direction C Lizard Sword Guard construction reference. Image 2 is the Human-approved four-enemy hybrid and defines the final chunky clean family rendering. Image 3 is the selected Direction A current-family reference for chroma and material-local contour craft. Do not use the previous failed sword-guard output.
Primary request: Generate a new independent single Lizard Sword Guard from a blank canvas: stout young guardian anatomy, rounded mint and leaf-green scales, broad tail, large amber eyes, coral scarf, simple warm leather belt and bracers, compact cream-metal shoulder guard, small leaf-emblem round shield, and a blunt short leaf-shaped practice sword held safely sideways.
Style/medium: Original clean chunky magical-girl storybook JRPG anime sprite; expressive friendly-competitive face, two to four major colour masses, three broad values, restrained painterly facets, clean 40–84 px silhouette.
Contours: Brighter material-local outlines: leaf-plum around scales, russet-plum around scarf/leather, warm golden-brown around metal, and darkest ink-plum only for eyes, mouth, deep occlusion, and tiny critical gaps. No uniform black perimeter.
Pose/camera: Compact front three-quarter planted guard pose, complete body and tail visible, sword never aimed at camera, one-tile registration.
Backdrop contract: Use one completely flat, solid, opaque #FF00FF chroma-magenta background across the entire canvas. No checkerboard, transparency simulation, pattern, gradient, vignette, texture, floor, cast shadow, glow, action effect, scenery, or magenta spill on the subject.
Avoid: aggression, wounds, realistic reptile horror, dense scales, excessive armour, filigree, cream sticker cutline, text, logo, watermark, franchise-specific design.
```

### `enemy-lizard-spear-guard-v01-matte-02`

```text
Use case: stylized-concept
Asset type: isolated production-candidate enemy field sprite on a chroma-key matte for a child-friendly anime JRPG
Input images: Image 1 is the Human-selected Direction C Lizard Sword Guard construction reference and supplies sibling anatomy. Image 2 is the Human-approved four-enemy hybrid and defines the final chunky clean family rendering. Image 3 is the selected Direction A current-family reference for chroma and material-local contour craft. Do not use the previous failed spear-guard output.
Primary request: Generate a new independent single Lizard Spear Guard from a blank canvas. Use the same stout young lizard species, head, large amber eyes, mint and leaf-green scale masses, broad tail, coral scarf, warm leather pieces, cream-metal shoulder guard, proportions, and registration as the selected Sword Guard, but give this sibling a simple padded short spear held horizontally across the body and no shield. The spear has a blunt leaf-bud tip and reads as ceremonial training equipment, not an attack.
Style/medium: Original clean chunky magical-girl storybook JRPG anime sprite; expressive friendly-competitive face, two to four major colour masses, three broad values, restrained painterly facets, clean 40–84 px silhouette.
Contours: Brighter material-local outlines: leaf-plum around scales, russet-plum around scarf/leather and shaft, warm golden-brown around fittings, and darkest ink-plum only for eyes, mouth, deep occlusion, and tiny critical gaps. No uniform black perimeter.
Pose/camera: Compact front three-quarter planted guard pose, complete body, tail, hands, and spear visible; spear parallel to the picture plane and never pointed at camera; one-tile registration.
Backdrop contract: Use one completely flat, solid, opaque #FF00FF chroma-magenta background across the entire canvas. No checkerboard, transparency simulation, pattern, gradient, vignette, texture, floor, cast shadow, glow, action effect, scenery, or magenta spill on the subject.
Avoid: separate species redesign, long dangerous reach, aggression, wounds, dense scales, excessive armour, filigree, cream sticker cutline, text, logo, watermark, franchise-specific design.
```

### `enemy-wholesome-succubus-v01-matte-02`

```text
Use case: stylized-concept
Asset type: isolated production-candidate enemy field sprite on a chroma-key matte for a child-friendly anime JRPG
Input images: Image 1 is the Human-approved four-enemy hybrid and is the exact design and family-rendering authority for the top-left wholesome succubus. Image 2 is the selected Direction A current-family reference for contour craft. Do not use the previous failed isolated output.
Primary request: Generate a new independent isolated version from a blank canvas, preserving her compact child-safe proportions, warm confident face, large plum eyes, lilac layered bob, small rounded dark-purple horns, small rounded bat wings, heart-tipped tail, modest lavender tunic with coral belt and trim, dark plum leggings, lavender boots, heart brooch, friendly stance, and hand-near-cheek gesture.
Style/medium: Match the approved sprite's clean chunky magical-girl storybook JRPG anime rendering: two to four colour masses, three broad values, restrained painterly facets, clear chroma, sparse detail, strong 40–84 px silhouette.
Contours: Bright continuous material-aware contours: aubergine around lavender cloth/hair, blue-plum around cool wing membranes, russet-plum around coral, and darkest ink-plum only for eyes, mouth, deep occlusion, and tiny critical separations. No black perimeter.
Pose/camera: Front three-quarter full-body field pose, one-tile registration, every wing and tail tip visible.
Backdrop contract: Use one completely flat, solid, opaque #00E600 chroma-green background across the entire canvas. No checkerboard, transparency simulation, pattern, gradient, vignette, texture, floor, cast shadow, aura, particles, scenery, or green spill on the subject.
Avoid: adult anatomy, cleavage, lingerie, exposed torso, glamour pose, seduction, kiss/charm magic, ornate costume, cream sticker cutline, text, logo, watermark, franchise-specific design.
```

### `enemy-pocket-trex-v01-matte-02`

```text
Use case: stylized-concept
Asset type: isolated production-candidate enemy field sprite on a chroma-key matte for a child-friendly anime JRPG
Input images: Image 1 is the Human-approved four-enemy hybrid and is the exact design and family-rendering authority for the top-right Pocket T-Rex. Image 2 is the selected Direction A current-family reference for contour craft. Do not use the previous failed isolated output.
Primary request: Generate a new independent isolated version from a blank canvas, preserving the huge friendly orange-red head, expressive warm brown eye and brow, rounded muzzle, few blunt cream teeth, tiny arms, compact body, oversized planted feet, thick curled tail, sparse plum body markings, blue neckerchief, and gold star medal.
Style/medium: Match the approved sprite's clean chunky magical-girl storybook JRPG anime rendering: two to four colour masses, three broad values, restrained painterly facets, clear chroma, sparse detail, strong 40–84 px silhouette.
Contours: Bright continuous material-aware contours: russet-plum around orange hide, blue-plum around scarf, warm golden-brown around medal/teeth/claws, and darkest ink-plum only for eye, mouth, deep occlusion, and tiny critical separations. No black perimeter.
Pose/camera: Front three-quarter full-body planted field pose, one-tile registration, entire tail and feet visible.
Backdrop contract: Use one completely flat, solid, opaque #00E600 chroma-green background across the entire canvas. No checkerboard, transparency simulation, pattern, gradient, vignette, texture, floor, cast shadow, attack effect, scenery, or green spill on the subject.
Avoid: predation, chase pose, gore, realistic reptile texture, needle teeth, aggression, dense spots, cream sticker cutline, text, logo, watermark, franchise-specific dinosaur design.
```

### `enemy-kappa-v01-matte-02`

```text
Use case: stylized-concept
Asset type: isolated production-candidate enemy field sprite on a chroma-key matte for a child-friendly anime JRPG
Input images: Image 1 is the Human-approved four-enemy hybrid and is the exact design and family-rendering authority for the bottom-left Kappa. Image 2 is the selected Direction A current-family reference for contour craft. Do not use the previous failed isolated output.
Primary request: Generate a new independent isolated version from a blank canvas, preserving the rounded turquoise-green body, large friendly blue-grey eyes, gentle yellow beak, leafy dark-green hair framing a simple water-filled head dish, spiral-pattern turtle shell, navy scarf with teal heart clasp, webbed yellow-tipped hands and feet, one cucumber held upright, and a very simple small woven cucumber basket.
Style/medium: Match the approved sprite's clean chunky magical-girl storybook JRPG anime rendering: two to four colour masses, three broad values, restrained painterly facets, clear chroma, strong 40–84 px silhouette. Simplify leaf count, shell pattern, basket weave, and cucumber speckles for small scale.
Contours: Bright continuous material-aware contours: leaf-plum around greens, blue-plum around turquoise/navy, warm golden-brown around beak/dish/basket, and darkest ink-plum only for eyes, mouth, deep occlusion, and tiny critical separations. No black perimeter.
Pose/camera: Front three-quarter full-body field pose, one-tile registration, complete shell, dish, cucumber, basket, and feet visible.
Backdrop contract: Use one completely flat, solid, opaque #FF00FF chroma-magenta background across the entire canvas. No checkerboard, transparency simulation, pattern, gradient, vignette, texture, water splash, floor, cast shadow, action effect, scenery, or magenta spill on the subject.
Avoid: caricature, crude folklore joke, mascot copying, drowning implication, excess foliage/basket detail, cream sticker cutline, text, logo, watermark.
```

### `enemy-treasure-mimic-v01-matte-02`

```text
Use case: stylized-concept
Asset type: isolated production-candidate enemy field sprite on a chroma-key matte for a child-friendly anime JRPG
Input images: Image 1 is the Human-approved four-enemy hybrid and is the exact design and family-rendering authority for the bottom-right Treasure Mimic. Image 2 is the selected Direction A current-family reference for contour craft. Do not use the previous failed isolated output.
Primary request: Generate a new independent isolated version from a blank canvas, preserving the chest-first chunky warm russet wood construction, rounded gold bands and fittings, plum interior, one huge friendly central eye with purple iris and bright catchlight, a small set of broad blunt cream teeth, simple keyhole plate, and short grounded feet. Keep it visibly alive and mischievous rather than frightening.
Style/medium: Match the approved sprite's clean chunky magical-girl storybook JRPG anime rendering: two to four colour masses, three broad values, restrained painterly facets, clear chroma, strong 40–84 px silhouette. Reduce tooth count, rivets, plank seams, and tiny facets.
Contours: Bright continuous material-aware contours: russet-plum around wood, warm golden-brown around metal/teeth, aubergine around interior, and darkest ink-plum only for eye, mouth cavity, deep occlusion, and tiny critical separations. No black perimeter.
Pose/camera: Front three-quarter object-creature field pose, one-tile registration, complete lid and feet visible.
Backdrop contract: Use one completely flat, solid, opaque #00E5E5 chroma-cyan background across the entire canvas. No checkerboard, transparency simulation, pattern, gradient, vignette, texture, floor, cast shadow, saliva, attack effect, scenery, or cyan spill on the subject.
Avoid: needle teeth, gore, child emerging from chest, hidden/reveal composition, excessive hardware/wood grain, cream sticker cutline, text, logo, watermark, franchise-specific mimic design.
```

## New family members — blank-canvas production candidates

These requests use the approved family boards as rendering references only. Each
enemy is a new independent construction and does not derive from an earlier
isolated output.

### `enemy-soda-slime-v01-matte-01`

```text
Use case: stylized-concept
Asset type: isolated production-candidate enemy field sprite on a chroma-key matte for a child-friendly anime JRPG
Input images: Image 1 is the Human-approved four-enemy hybrid and defines the final clean chunky enemy-family rendering. Image 2 is the Human-selected Direction A core sampler and supplies two-to-four-mass economy and bright material-local contour confidence. Image 3 is the selected Direction A current-family transfer and supplies field scale and simplified surface detail.
Primary request: Generate a new independent Soda Slime from a blank canvas: one squat bubbly coral-pink gel creature shaped like a friendly fizzy mound, with two large plum eyes and bright catchlights, a tiny cheerful mouth, a simple cream bottle-cap crest sitting on top, and exactly three large round bubbles contained within the gel. It must read first as a classic slime and second as sparkling fruit soda; no branded can, bottle, label, straw, text, or logo.
Style/medium: Original clean chunky magical-girl storybook JRPG anime sprite; two to three dominant colour masses, exactly three broad cel-like values, restrained softly painted colour transitions, very few internal lines, strong recognition at 40–84 px. No deep-fried texture.
Contours: Bright continuous material-local contours authored into the drawing: saturated raspberry-plum around coral gel, warm golden-brown around the cream cap, and darkest ink-plum only for eyes, mouth, deep occlusion, and tiny critical separations. Clearly chromatic, never a black perimeter or post-process halo.
Pose/camera: Low front three-quarter field view, centered, complete compact silhouette, one-tile registration.
Backdrop contract: One completely flat solid opaque #00E600 chroma-green background. No checkerboard, pattern, gradient, vignette, texture, floor, cast shadow, exterior glow, scenery, or green spill on the subject.
Avoid: real beverage branding, photoreal bubbles, translucent background bleed, slime trail, menace, microtexture, cream sticker cutline, text, watermark, franchise-specific slime design.
```

### `enemy-kindly-cultist-v01-matte-01`

```text
Use case: stylized-concept
Asset type: isolated production-candidate enemy field sprite on a chroma-key matte for a child-friendly anime JRPG
Input images: Image 1 is the Human-approved four-enemy hybrid and defines the final clean chunky enemy-family rendering. Image 2 is the Human-selected Direction A core sampler and supplies two-to-four-mass economy and bright material-local contour confidence. Image 3 is the selected Direction A current-family transfer and supplies field scale and simplified surface detail.
Primary request: Generate a new independent child-friendly moon-club Cultist from a blank canvas. Make a short rounded fantasy figure in an oversized lavender hooded robe, face fully visible and warm rather than hidden, with large friendly amber eyes, round cheeks, simple cream collar, coral sash, soft plum mittens and boots, and one small cardboard-looking moon-and-star club badge pinned to the robe. They hold a stubby unlit candle safely upright in one hand and make an earnest overdramatic pledge gesture with the other. The joke is enthusiastic secret-club member, never religious menace or horror.
Style/medium: Original clean chunky magical-girl storybook JRPG anime sprite; two to four dominant colour masses, exactly three broad cel-like values, restrained soft gouache warmth, sparse surface detail, expressive face, readable at 40–84 px.
Contours: Bright continuous material-local contours: aubergine around lavender cloth, russet-plum around coral sash, golden-brown around cream paper/wax, and darkest ink-plum only for eyes, mouth, deep hood occlusion, and tiny critical separations. No black void face and no uniform black perimeter.
Pose/camera: Compact front three-quarter full-body field pose, one-tile registration, both hands and feet visible.
Backdrop contract: One completely flat solid opaque #00E600 chroma-green background. No checkerboard, pattern, gradient, vignette, texture, floor, cast shadow, candle glow, aura, particles, scenery, or green spill.
Avoid: real-world religious symbols, occult marks, sacrifice, chanting text, faceless hood, weapon, menace, adult proportions, filigree, cream sticker cutline, logo, watermark, franchise-specific costume.
```

### `enemy-lamia-v01-matte-01`

```text
Use case: stylized-concept
Asset type: isolated production-candidate enemy field sprite on a chroma-key matte for a child-friendly anime JRPG
Input images: Image 1 is the Human-approved four-enemy hybrid and defines the final clean chunky enemy-family rendering. Image 2 is the Human-selected Direction A core sampler and supplies two-to-four-mass economy and bright material-local contour confidence. Image 3 is the selected Direction A current-family transfer and supplies field scale and simplified surface detail.
Primary request: Generate a new independent wholesome Lamia maze guide from a blank canvas. She is a compact young fantasy person with a clearly child-safe, fully covered design: warm friendly face, large teal-blue eyes, short dark-plum wavy hair with one mint leaf clip, modest coral tunic with cream collar and short lavender capelet, transitioning at the waist into one broad mint-green snake tail that forms a simple grounded S-curve. Give the tail only three large leaf-shaped markings. She holds a small rolled maze map tied with a ribbon and looks helpful but competitive.
Style/medium: Original clean chunky magical-girl storybook JRPG anime sprite; two to four dominant colour masses, exactly three broad cel-like values, restrained painterly facets, sparse detail, strong face and S-curve silhouette at 40–84 px.
Contours: Bright continuous material-local contours: leaf-plum around mint scales, russet-plum around coral cloth, aubergine around hair/lavender, golden-brown around the map, and darkest ink-plum only for eyes, mouth, waist occlusion, and tiny critical separations. No uniform black perimeter.
Pose/camera: Front three-quarter full-body field pose, one-tile registration, complete tail tip and map visible, upright friendly eyeline.
Backdrop contract: One completely flat solid opaque #FF00FF chroma-magenta background. No checkerboard, pattern, gradient, vignette, texture, floor, cast shadow, aura, particles, scenery, or magenta spill.
Avoid: adult curves, cleavage, bare midriff, glamour pose, constriction, forked tongue, fangs, weapon, excessive scales, filigree, cream sticker cutline, text, logo, watermark, franchise-specific lamia design.
```

### `enemy-orc-chieftain-v01-matte-01`

```text
Use case: stylized-concept
Asset type: isolated production-candidate enemy field sprite on a chroma-key matte for a child-friendly anime JRPG
Input images: Image 1 is the Human-approved four-enemy hybrid and defines the final clean chunky enemy-family rendering. Image 2 is the Human-selected Direction A core sampler and supplies two-to-four-mass economy and bright material-local contour confidence. Image 3 is the selected Direction A current-family transfer and supplies field scale and simplified surface detail.
Primary request: Generate a new independent Orc Chieftain from a blank canvas: a broad squat moss-green fantasy orc with a big friendly-competitive face, large warm amber eyes, two tiny rounded lower tusks, thick dark-leaf eyebrows, a coral woven headband with one cream feather, simple russet leather shoulder cape, plum trousers, and a chunky wooden ceremonial spoon held like a proud badge of office. Add one simple gold heart clasp. Powerful silhouette without threat; no battle axe.
Style/medium: Original clean chunky magical-girl storybook JRPG anime sprite; two to four dominant colour masses, exactly three broad cel-like values, restrained soft gouache facets, sparse detail, strong 40–84 px silhouette.
Contours: Bright continuous material-local contours: leaf-plum around green skin, russet-plum around leather/wood/coral, warm golden-brown around tusks/feather/clasp, and darkest ink-plum only for eyes, mouth, deep occlusion, and tiny critical separations. Clearly coloured rather than black.
Pose/camera: Compact front three-quarter planted full-body field pose, one-tile registration, spoon angled safely across the torso, feet and all costume edges visible.
Backdrop contract: One completely flat solid opaque #FF00FF chroma-magenta background. No checkerboard, pattern, gradient, vignette, texture, floor, cast shadow, aura, action effect, scenery, or magenta spill.
Avoid: rage, gore, skull trophies, realistic muscle anatomy, huge weapon, facial scars, spikes, dense armour, racist coding, cream sticker cutline, text, logo, watermark, franchise-specific orc design.
```

### `enemy-cyclops-v01-matte-01`

```text
Use case: stylized-concept
Asset type: isolated production-candidate enemy field sprite on a chroma-key matte for a child-friendly anime JRPG
Input images: Image 1 is the Human-approved four-enemy hybrid and defines the final clean chunky enemy-family rendering. Image 2 is the Human-selected Direction A core sampler and supplies two-to-four-mass economy and bright material-local contour confidence. Image 3 is the selected Direction A current-family transfer and supplies field scale and simplified surface detail.
Primary request: Generate a new independent young Cyclops stonemason from a blank canvas: one squat round lavender-skinned fantasy giant with a single very large clear sapphire-blue eye centered in the face, warm expressive brow, tiny nose and friendly determined mouth, tousled coral hair, simple cream work tunic, russet apron and boots, and a small foam-looking stone mallet resting safely on one shoulder. Add a single gold star buckle. Keep the one eye inviting and emotionally readable, never grotesque.
Style/medium: Original clean chunky magical-girl storybook JRPG anime sprite; two to four dominant colour masses, exactly three broad cel-like values, restrained painterly facets, sparse material detail, strong 40–84 px silhouette and face.
Contours: Bright continuous material-local contours: aubergine around lavender skin, russet-plum around coral/leather/wood, blue-plum around the sapphire iris, golden-brown around cream/gold, and darkest ink-plum only for pupil, mouth, deep occlusion, and tiny critical separations. No uniform black perimeter.
Pose/camera: Front three-quarter full-body planted field pose, one-tile registration, complete mallet and boots visible, mallet not swung.
Backdrop contract: One completely flat solid opaque #00E600 chroma-green background. No checkerboard, pattern, gradient, vignette, texture, floor, cast shadow, attack effect, scenery, or green spill.
Avoid: bloodshot eye, realistic giant, skull imagery, rage, wounds, weapon attack, dense stone texture, filigree, cream sticker cutline, text, logo, watermark, franchise-specific cyclops design.
```

### `enemy-minotaur-v01-matte-01`

```text
Use case: stylized-concept
Asset type: isolated production-candidate enemy field sprite on a chroma-key matte for a child-friendly anime JRPG
Input images: Image 1 is the Human-approved four-enemy hybrid and defines the final clean chunky enemy-family rendering. Image 2 is the Human-selected Direction A core sampler and supplies two-to-four-mass economy and bright material-local contour confidence. Image 3 is the selected Direction A current-family transfer and supplies field scale and simplified surface detail.
Primary request: Generate a new independent Minotaur maze marshal from a blank canvas: a stout rounded cinnamon-brown bull person with a big soft muzzle, large friendly teal eyes, two short blunt cream horns, small rounded ears, dark-russet forelock, simple mint scarf, lavender waistcoat, cream shorts, and sturdy coral boots. They hold a small square wooden maze sign on a short pole, pointing sideways as if confidently giving directions. Strong and funny rather than scary.
Style/medium: Original clean chunky magical-girl storybook JRPG anime sprite; two to four dominant colour masses, exactly three broad cel-like values, restrained soft painted facets, sparse fur/material detail, strong 40–84 px silhouette.
Contours: Bright continuous material-local contours: russet-plum around brown fur/wood/coral, leaf-plum around mint scarf, aubergine around lavender cloth, golden-brown around horns/cream fabric, and darkest ink-plum only for eyes, mouth, nostrils, deep occlusion, and tiny critical separations. No uniform black perimeter.
Pose/camera: Compact front three-quarter full-body planted field pose, one-tile registration, complete horns, sign, hands, feet and tail-tip visible.
Backdrop contract: One completely flat solid opaque #00E5E5 chroma-cyan background. No checkerboard, pattern, gradient, vignette, texture, floor, cast shadow, dust, action effect, scenery, or cyan spill.
Avoid: charge pose, nose ring, giant axe, rage, realistic bovine anatomy, skulls, spikes, excessive fur strands, cream sticker cutline, text, logo, watermark, franchise-specific minotaur design.
```

### `enemy-warrior-skeleton-v01-matte-01`

```text
Use case: stylized-concept
Asset type: isolated production-candidate enemy field sprite on a chroma-key matte for a child-friendly anime JRPG
Input images: Image 1 is the Human-approved four-enemy hybrid and defines the final clean chunky enemy-family rendering. Image 2 is the Human-selected Direction A core sampler and supplies two-to-four-mass economy and bright material-local contour confidence. Image 3 is the selected Direction A current-family transfer and supplies field scale and simplified surface detail.
Primary request: Generate a new independent Warrior Skeleton from a blank canvas: a compact toy-ivory skeleton with rounded child-friendly bones, visible warm amber pupils in friendly eye sockets, determined brows, a simple mint padded vest, coral scarf, lavender belt, small cream-metal shoulder guard, and a blunt wooden practice sword held down and across the body. Give it a tiny heart-shaped shield in the other hand. It should feel like the Tea-Time Skeleton's energetic adventuring cousin, never undead horror.
Style/medium: Original clean chunky magical-girl storybook JRPG anime sprite; two to four dominant colour masses, exactly three broad cel-like values, restrained painterly facets, sparse detail, expressive face and clear 40–84 px silhouette.
Contours: Bright continuous material-local contours: warm tea-brown/plum around ivory bones and cream metal, leaf-plum around mint, russet-plum around scarf/wood, aubergine around lavender, and darkest ink-plum only for pupils, mouth, deepest socket separation, and tiny critical gaps. No uniform black perimeter or black eye voids.
Pose/camera: Compact front three-quarter planted full-body field pose, one-tile registration, complete sword, shield and feet visible; no attack swing.
Backdrop contract: One completely flat solid opaque #FF00FF chroma-magenta background. No checkerboard, pattern, gradient, vignette, texture, floor, cast shadow, aura, action effect, scenery, or magenta spill.
Avoid: gore, broken bones, exposed corpse tissue, realistic anatomy, menacing void sockets, sharp blade, skull trophies, dense armour, cream sticker cutline, text, logo, watermark, franchise-specific skeleton design.
```
