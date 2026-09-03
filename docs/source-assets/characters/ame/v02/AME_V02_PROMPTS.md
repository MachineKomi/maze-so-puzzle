# Ame v02 Human-gate prompt record

Status: **Candidate C identity/construction design approved 2026-09-03;
source-only; runtime-publish and rights approval pending**.

Generation workflow: built-in OpenAI image generation, identity-preserving or
reference-led mode as described below. The exact backend model/version, seed,
and request envelope were not exposed and are not inferred.

Generation session date: 2026-09-02 (execution evidence, not reconstructed from
repository first-seen time).

The references are original project Ame assets/studies. No named franchise,
character, costume, logo, composition, or artist was used in a production
request. Candidate C is recommended for Human/Ame review, not approved.

That sentence records the 2026-09-02 generation state. After reviewing the
comparison, actual-size, and model-study sheets on 2026-09-03, the Human said,
“I've reviewed the images and comparison sheets and I'm happy with the
reccomendations.” The recorded outcome is that Candidate C is the canonical
static Ame v02 identity/construction direction. This does not approve a cutout,
runtime derivative/pointer, rights review, animation frame, portrait, or other
dependent art.

## Output map

| Role | Output ID | Archived source | SHA-256 |
| --- | --- | --- | --- |
| Recovered historical identity reference | `exec-4a073da0-4d41-4349-9b08-1e943b5a959a.png` | `../v01/ame-v01-generator-original.png` | `9abf1df3d5b4f383a4d66d8e9f39f05f867caa0bfe1962f5a1e9f5d44647f498` |
| Candidate A, longer-hair exploration/rollback | `exec-81260f9b-bd41-45f0-b242-a3d0f2534bbc.png` | `ame-v02-candidate-a-generator-original.png` | `50828e9413b813bc36ba89c5bc0eba5e155db151aed8ab6acda321776105365f` |
| Candidate B, conservative comparison | `exec-b23d0d39-1aa5-4a90-974d-14adb3144dfe.png` | `ame-v02-candidate-b-generator-original.png` | `ab2db1543297bc05283687f7e54697d72ce5e15df638a231d1edfd102d730c5e` |
| Candidate B turnaround study | `exec-403540e2-c5c8-416f-9da4-a91e0c4bdbab.png` | `ame-v02-candidate-b-turnaround-study.png` | `d70eb2c6739dd2845b4f87dc90c4f2fe95edd4b38d2f642089c6f19fb7097383` |
| Candidate B expression study | `exec-360df614-c90c-4829-b513-96962844c2d2.png` | `ame-v02-candidate-b-expression-study.png` | `47e1ec330115c49c0c14e738e2266379681838ae05912f6296199b6e56b0a479` |
| Candidate C, design approved / runtime pending | `exec-6732e5ce-ce9c-47df-b2ca-45c02a7f99b4.png` | `ame-v02-candidate-c-generator-original.png` | `b676c173d696d3b306db0b70589b50bf93f4db76352d87b7c390d16a1cf0ded1` |
| Candidate C turnaround study | `exec-eab5d3f9-afb6-4e3c-8dfa-332e6420dede.png` | `ame-v02-candidate-c-turnaround-study.png` | `22b312e19731718146e3a836afdf28884bec7210c49233a55090592cc275fe09` |
| Candidate C expression study | `exec-dd081b94-69f7-48be-be15-70d36055f5bb.png` | `ame-v02-candidate-c-expression-study.png` | `8a5b1e27604e09e63b18b0bc030d5b4a6543877b0c2abbcb92d05603cbba25c7` |

Candidate A was generated before the final provenance record was established.
Its exact input text is unavailable in retained execution evidence, so it is
honestly classified `concise`, not reconstructed and mislabelled exact. Known
request facts: current field Ame was the identity/costume anchor; current
portrait and title Ame were warmth references; the only intended changes were a
restrained shoulder-brushing softly layered golden-blonde hairstyle and clearly
blue irises; the request prohibited adultisation, named-franchise imitation,
new costume elements, text, shadows, and non-transparent scenery. Candidate A
is retained only as a comparison/rollback ingredient.

## Candidate B exact prompt

```text
Use case: identity-preserving edit for Human/Ame approval, not final production.
Asset type: canonical static full-body field character sprite candidate for an original child-friendly magical-girl storybook JRPG.
Reference priority:
1. Image 1 is the immutable identity, pose, anatomy, costume, colour-blocking, proportions, and rendering anchor. Preserve it extremely closely.
2. Image 2 is a disposable exploratory target ONLY for the restrained shoulder-skimming softly layered hair length and clearly blue iris hue. Do not inherit Image 2's face, body, pose, costume redraw, canvas background, or altered proportions.

Required bounded changes to Image 1:
- Keep Ame's hair unmistakably warm golden blonde. Extend the existing short bob only slightly to a soft shoulder-skimming layered shape, with restrained tapered ends; retain the left-side braid, white flower with yellow centre, leaf, side-swept fringe, crown cowlick, and warm recognisable hair mass. Do not make it long, glamorous, adult, voluminous, or windblown.
- Change both irises to an unambiguous saturated cornflower/sapphire blue, matched left/right. No teal, turquoise, cyan-green, emerald, hazel, or green cast. Keep dark pupils and the same friendly catchlight logic.
- Preserve Ame's exact warm, recognisable young face, round cheeks, eye placement, brows, nose, smile, head-to-body ratio, stance, hands, and child age.
- Preserve the mint tunic, cream undershirt and shorts, lavender hooded cape, lavender backpack, brown straps/belt/pouch, coral boots, flower clasp, hem motifs, folds, and every costume landmark from Image 1.
- Preserve the original front three-quarter field-facing pose and neutral grounded presentation.

Rendering lock:
Clean, simple, chunky anime/JRPG sprite; broad cel-like value groups; controlled deep-plum linework; restrained texture; friendly, authored warmth. Simplify only microtexture that disappears at 48–72 px. No new accessory, motif, text, watermark, signature, prop, weapon, cast shadow, floor shadow, glow, or directional spotlight. Neutral front/top form modelling suitable for later runtime lighting.

Canvas/delivery:
One isolated full-body character, centered with generous even transparent padding and complete boots/cape/backpack. Genuine transparent RGBA background. Do not draw or simulate a checkerboard. If true transparency is impossible, use one perfectly flat uniform #FF00FF background with no texture, gradient, shadow, or anti-aliased background pattern so it can be deterministically keyed. No border and no crop.

Originality:
Use only the supplied Ame references and high-level genre principles. Do not imitate or reference any named franchise, character, costume, logo, composition, or artist.
```

References:

1. Recovered v01 generator original, identity/costume authority, SHA-256
   `9abf1df3d5b4f383a4d66d8e9f39f05f867caa0bfe1962f5a1e9f5d44647f498`.
2. Candidate A, hair/eye target only, SHA-256
   `50828e9413b813bc36ba89c5bc0eba5e155db151aed8ab6acda321776105365f`.

The output remained globally regenerated and arrived as RGB with a painted
checkerboard despite the alpha request. It is a comparison, not a local edit.

## Candidate B turnaround exact prompt

```text
Use case: identity-locked model-sheet exploration for Human/Ame review only; not production poses.
Asset type: clean three-view character turnaround for an original child-friendly magical-girl storybook JRPG.
Reference: Image 1 is the sole identity and costume authority. Preserve Ame's exact warm young face construction, golden-blonde shoulder-skimming softly layered hair, clearly saturated cornflower/sapphire blue irises, proportions, mint tunic, cream undershirt and shorts, lavender hooded cape, lavender backpack, brown straps/belt/pouch, coral boots, flower clasp, left braid, white flower and leaf.

Layout:
- One quiet cream model-sheet canvas, landscape composition with three equally scaled, uncropped full-body neutral construction views: FRONT, TRUE LEFT SIDE, BACK.
- Put all feet on one shared horizontal baseline and all crowns on one shared height line.
- Neutral relaxed stance, arms slightly separated from torso so costume seams and hand positions are readable. No action pose.
- Keep the same childlike 2.9–3.1-head field-model proportion in every view.
- The side and back views must logically reconstruct the same design, not invent a new hairstyle, cape, bag, trim, footwear, accessory, or body shape.
- Hair ends at the shoulder line with soft restrained layers. The braid and white flower/leaf remain on Ame's left. Back view clearly shows the lavender backpack and the cape dividing around it.
- Show the cape and backpack relationship, crossing chest strap, belt and pouch, tunic hem motif, cream cuffs/shorts, sock cuffs, and boot buckles consistently.
- Eyes visible in front and profile must be clearly blue, never teal/green.

Rendering:
Precise clean anime model-sheet drawing, broad cel-like value groups, controlled deep-plum linework, restrained texture, neutral front/top form modelling, no cast shadow, glow, environment, decorative filigree, weapon, prop, text labels, watermark, logo, or signature. High consistency matters more than polish. Keep generous safe margins around every view.

Originality:
Use only the supplied Ame reference and high-level genre principles. Do not imitate any named franchise, character, costume, logo, composition, or artist.
```

Sole reference: Candidate B. This sheet is retained as rejected-comparison
construction evidence and is not Candidate C model authority.

## Candidate B expression exact prompt

```text
Use case: identity-locked facial model-sheet exploration for Human/Ame review only; not production story art.
Asset type: eight-expression anime facial construction chart for the same original child character.
Reference: Image 1 is the sole identity authority. Preserve Ame's exact young round face, golden-blonde shoulder-skimming softly layered hair, left-side braid with white flower/leaf, clearly saturated cornflower/sapphire blue irises, eyebrow shape, nose placement, warm cheek shape, and deep-plum linework.

Layout:
- One quiet cream sheet with eight equally sized head-and-shoulders busts in a strict 4-column by 2-row grid.
- Same straight-on camera, crown height, face scale, shoulder crop, hair silhouette, costume collar, eye colour, and line weight in every cell.
- Expressions, in this exact order: neutral attentive; open joy; quiet determination; worried concentration; gentle surprise; soft sadness without distress; relieved smile; playful annoyance.
- Communicate emotion through brows, eyelids, pupil direction, cheeks, and a simple mouth. Keep the child kind and recognisable in every expression.
- Blue irises remain unmistakably blue in all eight; golden-blonde hair remains identical.

Rendering:
Precise clean anime model-sheet drawing, broad cel-like value groups, controlled deep-plum linework, restrained texture, neutral front/top form modelling. No crying streams, fear, pain, anger, menace, glamour makeup, adult aging, new accessory, text labels, speech bubbles, prop, weapon, decorative frame, watermark, logo, or signature. Generous margins and gutters.

Originality:
Use only the supplied Ame reference and high-level genre principles. Do not imitate any named franchise, character, costume, logo, composition, or artist.
```

Sole reference: Candidate B. This sheet is retained as rejected-comparison
expression evidence and is not Candidate C model authority.

## Candidate C exact prompt — recommended pending Human

The heading above preserves the candidate's state when this exact prompt was
run. Candidate C later passed the separate 2026-09-03 identity/construction
gate described at the top of this record.

```text
Use case: identity-preserving bounded revision for Human/Ame approval; not final production.
Asset type: canonical static full-body field sprite candidate for an original child-friendly magical-girl storybook JRPG.
Reference priority:
1. Image 1 is the recommended candidate and sole design, pose, silhouette, crop, costume, face, hair, proportions, and rendering authority.
2. Image 2 is the immutable historical Ame identity reference only. Use it to preserve the same warm young recognisable character; do not restore its short bob or teal-green eye colour.

Make only these two changes to Image 1:
- Refine both irises into an unmistakable matched sapphire/cornflower blue using a deep navy-blue rim, #347FD1 mid blue, #69AFE8 light blue, and near-white catchlights. Preserve the exact eye shape, size, position, lashes, pupils, highlights, brows, cheeks, nose, and smile. No teal, turquoise, cyan-green, emerald, violet, grey, or green cast.
- Remove the painted checkerboard. Deliver genuine transparent RGBA behind the single character. Do not draw or simulate a checkerboard. If true transparency is impossible, use one perfectly flat uniform #FF00FF background with no texture, gradient, shadow, or pattern so it can be deterministically keyed.

Absolutely preserve from Image 1:
Ame's warm recognisable young face and child age; golden-blonde shoulder-brushing softly layered hair; restrained hair volume and length; left-side braid, white flower with yellow centre, green leaves, side-swept fringe, crown cowlick; mint tunic and geometric cream hem; cream undershirt and shorts; lavender hooded cape and lavender backpack; brown diagonal strap, belt and pouch; gold flower clasp and buckles; coral boots; exact front three-quarter stance, hands, anatomy, head-to-body ratio, and complete uncropped silhouette.

Rendering lock:
Clean simple chunky anime/JRPG field art; broad cel-like value groups; controlled deep-plum linework; restrained texture; neutral front/top form modelling. No redraw, restyle, pose change, facial change, costume change, extra accessory, extra motif, text, watermark, signature, prop, weapon, cast shadow, floor shadow, glow, environmental light, border, or crop.

Originality:
Use only the supplied Ame references and high-level genre principles. Do not imitate or reference any named franchise, character, costume, logo, composition, or artist.
```

References:

1. Candidate A, design/crop authority, SHA-256
   `50828e9413b813bc36ba89c5bc0eba5e155db151aed8ab6acda321776105365f`.
2. Recovered v01, historical identity warmth only, SHA-256
   `9abf1df3d5b4f383a4d66d8e9f39f05f867caa0bfe1962f5a1e9f5d44647f498`.

The output is a global generative repaint, not the requested deterministic local
revision. Its subject envelope stayed within roughly two pixels of Candidate A
and its actual-size blue read improved, so it advanced to Human review and later
received identity/construction approval. It still arrived as RGB with a painted
checkerboard and requires the recorded deterministic cutout/registration proof
before any runtime proposal.

## Candidate C turnaround exact prompt

```text
Use case: identity-locked model-sheet exploration for Human/Ame review only; not production poses.
Asset type: clean three-view character turnaround for an original child-friendly magical-girl storybook JRPG.
Reference: Image 1 is the sole identity and costume authority. Preserve Ame's exact warm young face construction, golden-blonde shoulder-brushing softly layered hair, clearly saturated sapphire/cornflower blue irises, proportions, mint tunic, cream undershirt and shorts, lavender hooded cape, lavender backpack, brown straps/belt/pouch, coral boots, gold flower clasp, left-side braid, white flower and green leaves.

Layout:
- One quiet cream model-sheet canvas, landscape composition with three equally scaled, uncropped full-body neutral construction views: FRONT, TRUE LEFT SIDE, BACK.
- Put all feet on one shared horizontal baseline and all crowns on one shared height line.
- Neutral relaxed stance, arms slightly separated from the torso so costume seams and hand positions are readable. No action pose.
- Keep the same childlike 2.9–3.1-head field-model proportion in every view.
- The side and back views must logically reconstruct the same design; do not invent a new hairstyle, cape, bag, trim, footwear, accessory, or body shape.
- Hair ends at the shoulder line with restrained tapered layers. The braid and white flower/leaf remain on Ame's left. Back view clearly shows the lavender backpack and the cape dividing around it.
- Show the cape/backpack relationship, crossing chest strap, belt and pouch, tunic hem motif, cream cuffs/shorts, sock cuffs, and boot buckles consistently.
- Eyes visible in front and profile must be clearly sapphire/cornflower blue, never teal, turquoise, or green.

Rendering:
Precise clean anime model-sheet drawing, broad cel-like value groups, controlled deep-plum linework, restrained texture, neutral front/top form modelling, no cast shadow, glow, environment, decorative filigree, weapon, prop, text labels, watermark, logo, or signature. High consistency matters more than polish. Keep generous safe margins around every view.

Originality:
Use only the supplied Ame reference and high-level genre principles. Do not imitate any named franchise, character, costume, logo, composition, or artist.
```

Sole reference: Candidate C. This is a construction study, not three approved
production poses.

## Candidate C expression exact prompt

```text
Use case: identity-locked facial model-sheet exploration for Human/Ame review only; not production story art.
Asset type: eight-expression anime facial construction chart for the same original child character.
Reference: Image 1 is the sole identity authority. Preserve Ame's exact young round face, golden-blonde shoulder-brushing softly layered hair, left-side braid with white flower and green leaves, clearly saturated sapphire/cornflower blue irises, eyebrow shape, nose placement, warm cheek shape, and deep-plum linework.

Layout:
- One quiet cream sheet with eight equally sized head-and-shoulders busts in a strict four-column by two-row grid.
- Same straight-on camera, crown height, face scale, shoulder crop, hair silhouette, costume collar, eye colour, and line weight in every cell.
- Expressions, in this exact order: neutral attentive; open joy; quiet determination; worried concentration; gentle surprise; soft sadness without distress; relieved smile; playful annoyance.
- Communicate emotion through brows, eyelids, pupil direction, cheeks, and a simple mouth. Keep the child kind and recognisable in every expression.
- Blue irises remain unmistakably sapphire/cornflower blue in all eight; golden-blonde hair remains identical.

Rendering:
Precise clean anime model-sheet drawing, broad cel-like value groups, controlled deep-plum linework, restrained texture, neutral front/top form modelling. No crying streams, fear, pain, anger, menace, glamour makeup, adult ageing, new accessory, text labels, speech bubbles, prop, weapon, decorative frame, watermark, logo, or signature. Generous margins and gutters.

Originality:
Use only the supplied Ame reference and high-level genre principles. Do not imitate any named franchise, character, costume, logo, composition, or artist.
```

Sole reference: Candidate C. This is an expression construction study, not a
production portrait family.

## Rejection and gate notes

- All candidates arrived with a painted pale checkerboard despite explicit
  alpha requests. The RGB files are immutable source evidence; do not overwrite
  them or call them transparent masters.
- Candidate B's hair remains too close to freezing the historical short bob, so
  it is not recommended. Candidate A established the stronger hair silhouette.
- Candidate C preserves Candidate A's hair/identity and improves blue-eye
  saturation at 56–64 px. It was the sole recommendation and is now the
  Human-approved static identity/construction direction; runtime-publish and
  rights approval remain pending.
- No source here authorizes a runtime pointer, dependent pose family, portrait,
  title/story variant, promotion image, or animation frame.

## Rejected Candidate C background-cleanup assay

This ImageGen edit was a preview-only attempt to obtain true alpha while
preserving Candidate C exactly. It is retained here as negative production
evidence: the result globally repainted the character, returned another painted
checker, and changed the face, eyes, hair, costume, and stance. It therefore
cannot become a source, master, derivative, or reference anchor. The rejected
binary remains outside the repository.

Exact prompt:

```text
Use case: background-extraction
Asset type: preview-only cleanup assay for a transparent game character sprite; keep the generated result outside the repository.
Input image: Image 1 is the sole edit target and sole visual reference.
Primary request: Remove only the painted checkerboard background, the colored drop shadow, all halo/fringe pixels outside the character, and every pixel outside the existing deep-plum outer contour. Deliver a genuinely transparent RGBA background.
Subject invariants: Preserve the character inside the deep-plum contour exactly: identical face identity and warm young age; identical clearly blue irises and eye shapes; identical golden-blonde softly layered shoulder-length hair, crown curl, flower, leaves, braid, and every hair tip; identical mint tunic, lavender cape and backpack, brown straps/belt/pouch, gold clasp/buckles, cream trim, coral boots; identical pose, hands, anatomy, proportions, silhouette, linework, shading, texture, canvas position, scale, and crop. Do not repaint, redraw, relight, recolor, sharpen, soften, rescale, translate, rotate, or reinterpret any part of the character.
Edge requirement: The existing deep-plum contour is the final outer boundary. Keep the contour intact and opaque. Outside it, alpha must be zero with no white/checker/magenta/cyan fringe, glow, colored drop shadow, or halo. Preserve enclosed intentional negative spaces as transparent only where they are truly outside the character.
Fallback only if true alpha cannot be produced: use one perfectly flat, antialias-free #FF00FF background with no gradient, texture, shadow, or halo.
Avoid: any new object, text, watermark, floor, cast shadow, outline replacement, pose change, facial change, eye change, hairstyle change, costume change, or generative restyling.
```

Sole reference: `ame-v02-candidate-c-generator-original.png`, SHA-256
`b676c173d696d3b306db0b70589b50bf93f4db76352d87b7c390d16a1cf0ded1`.

Rejected output:

- Output ID: `exec-c81f684b-6548-4f52-a9da-b82c4f620110.png`.
- External review path at generation time:
  `C:\Users\hellb\.codex\generated_images\01a063e9-6e88-7570-9470-40a8439a0c6a\exec-c81f684b-6548-4f52-a9da-b82c4f620110.png`.
- SHA-256:
  `61ee4b32f62e8759b20bdfa54a9602c53211a66029f43b2c68d3610625426859`.
- Dimensions/mode/bytes: 1254 × 1254, RGB, 1,453,364 bytes.
- Pixel audit against the sole reference: mean absolute RGB difference 19.04
  per channel; the output is not a pixel-local or alpha-only edit.
- Decision: **REJECTED**. Do not copy it into the repository or use it as a
  future consistency reference.
