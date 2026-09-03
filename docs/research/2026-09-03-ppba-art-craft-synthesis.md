# PPBA craft-system synthesis for Maze so Puzzle

Status: **manager-reviewed research and adoption record**

Decision date: 2026-09-03

Source supplied by the Human: `https://github.com/MachineKomi/ppba-rebirth-spec`

Source revision inspected: `dacc8cf644d24d56aae34ba757efb4fac5f9d341`

## Purpose and authority

The Human asked Maze so Puzzle to benefit from the visual-system work already
completed for PPBA while retaining its own cast, story, palette, motifs, age,
tone, gameplay needs, and stated inspirations. This document records what was
actually inspected and separates source evidence from Maze-specific decisions.

The PPBA repository is a **craft-calibration source**, not Maze canon and not a
runtime dependency. Maze's Human decisions, `docs/GAME_VISION_AND_DESIGN_SPEC.md`,
`docs/ART_BIBLE.md`, approved character model sheets, and current source remain
authoritative. No PPBA pixel, prompt, character, world element, UI skin, logo,
palette, or branded motif is imported by this decision.

## Material inspected

The private repository was read at the exact revision above. The relevant
authority and production files were:

- [`spec/v0.13/README.md`](https://github.com/MachineKomi/ppba-rebirth-spec/blob/dacc8cf644d24d56aae34ba757efb4fac5f9d341/spec/v0.13/README.md)
  and [`spec/v0.13/00-status-and-authority.md`](https://github.com/MachineKomi/ppba-rebirth-spec/blob/dacc8cf644d24d56aae34ba757efb4fac5f9d341/spec/v0.13/00-status-and-authority.md);
- [`spec/v0.13/09a-visual-motion-ui-system.md`](https://github.com/MachineKomi/ppba-rebirth-spec/blob/dacc8cf644d24d56aae34ba757efb4fac5f9d341/spec/v0.13/09a-visual-motion-ui-system.md);
- [`spec/v0.13/09b-key-asset-family-contracts.md`](https://github.com/MachineKomi/ppba-rebirth-spec/blob/dacc8cf644d24d56aae34ba757efb4fac5f9d341/spec/v0.13/09b-key-asset-family-contracts.md);
- [`spec/v0.13/09d-full-preproduction-asset-contract.md`](https://github.com/MachineKomi/ppba-rebirth-spec/blob/dacc8cf644d24d56aae34ba757efb4fac5f9d341/spec/v0.13/09d-full-preproduction-asset-contract.md);
- [`assets/guides/SPRITE_CONTOUR_STANDARD.md`](https://github.com/MachineKomi/ppba-rebirth-spec/blob/dacc8cf644d24d56aae34ba757efb4fac5f9d341/assets/guides/SPRITE_CONTOUR_STANDARD.md);
- [`assets/prompts/IMAGE_ASSET_PROMPTS.md`](https://github.com/MachineKomi/ppba-rebirth-spec/blob/dacc8cf644d24d56aae34ba757efb4fac5f9d341/assets/prompts/IMAGE_ASSET_PROMPTS.md); and
- [`FULL_PREPRODUCTION_ART_ASSET_SPRINT.md`](https://github.com/MachineKomi/ppba-rebirth-spec/blob/dacc8cf644d24d56aae34ba757efb4fac5f9d341/FULL_PREPRODUCTION_ART_ASSET_SPRINT.md).

This was a specification and pipeline review, not permission to copy its
creative identity. Historical prompts were read as provenance and production
evidence; they are not pasted into Maze prompts.

## Adopt, adapt, and reject

| Disposition | PPBA lesson | Maze so Puzzle decision |
| --- | --- | --- |
| Adopt | Design at minimum display size, beginning with silhouette and two to four large colour masses | Every family is judged at its smallest real field/UI size before source-size polish |
| Adopt | Use a few confident shadow groups and material-specific highlights | Preserve Maze's three-value cel-painterly construction and remove airbrushed micro-gradients |
| Adopt | Local-colour contours improve material unity and avoid a dead uniform black perimeter | Use `storybook-local-contour-v1`: continuous plum-harmonised contours whose hue/value follows the adjacent material |
| Adopt | Separate painterly world art, functional panel material, sticker-like semantic UI, and transient effects | Field actors/items/world remain painted cutouts; only semantic UI icons, badges, prompts, and reaction glyphs receive the cream paper-cut sticker layer |
| Adopt | Normal and powered states keep identical geometry; apparent internal emission and external VFX are separate | State pairs lock silhouette, pivot, alpha footprint, and registration; Plan 02 owns halos, rays, motes, and animated emission outside the static object |
| Adopt | Generated lettering is unreliable and should not be baked into reusable art | Generate blank shells and symbols; the app overlays real, deterministic text and numerals with optical centring |
| Adopt | Small coherent review packets, hard representative pilots, immutable candidates, exact provenance, and rollback prevent drift | Plan 03 must pass a cross-family canary calibration before broad production and preserve accepted/rejected evidence |
| Adapt | PPBA uses a late-1990s painterly fantasy-anime/JRPG grammar | Maze uses a brighter magical-girl storybook cel-painterly hybrid with rounder child-safe shapes and stronger handheld-maze legibility |
| Adapt | PPBA's contour standard follows unrestricted local material hues | Maze contours stay inside a controlled deep-plum-tinted family so varied contour colour still reads as one game |
| Adapt | PPBA uses sea-glass, ceramic, sandstone, harbour, pet, and gem UI language | Maze uses paper, enamel, cloth, painted wood, soft magical glass, hearts, stars, ribbons, leaves, moons, and its established mint/lilac/coral/plum palette |
| Adapt | PPBA review sizes and widescreen composition follow its own product | Maze retains its own 16–48 px UI, 40–84 px friend/actor, tile, phone, iPad, desktop, and TV proof matrix |
| Reject | Copying PPBA characters, creatures, geography, props, compositions, logos, palette, icon metaphors, prompt text, or asset IDs | Every Maze asset remains an original member of its own world and provenance graph |
| Reject | Turning every object into a glossy gem, sticker, glass panel, or maximum-intensity effect | Materials stay materially truthful; signal layers are scoped; feedback intensity follows gameplay importance |

## Calibrated Maze rendering contract

The following rules are now the intended `mgjrpg-02` production calibration.
They refine future pixel-producing work and do not relabel historical
`mgjrpg-01` sources.

1. **Minimum-size first.** Establish silhouette, pose, face, and two to four
   large colour masses at the smallest delivery size before adding texture.
2. **One focal hierarchy.** Give the face, required interaction, or narrative
   subject the clearest contrast and chroma. Quiet supporting surfaces may be
   attractive but cannot compete with it.
3. **Broad value grouping.** Use a local midtone, one grouped shadow mass, and
   one light mass. A small highlight exists only to explain a material.
4. **Plum-harmonised local contours.** Outer and structural edges are solid,
   continuous, and locally coloured: aubergine around lavender, warm russet-plum
   around coral/leather/gold, blue-plum around cool materials, leaf-plum around
   foliage. `ink-900` is reserved for eyes, mouths, deep occlusion, and critical
   separation. Pure black and a single uniform perimeter colour are failures.
5. **Controlled surface frequency.** Hair reads as locks, fur as grouped tufts,
   foliage as clusters, stone as broad blocks, and fabric as broad folds. Detail
   that vanishes or flickers at delivery size is removed.
6. **Material truth before gloss.** Cloth stays matte, wood fibrous but simple,
   metal uses narrow highlights, gems use a few facets, and liquid uses a large
   directional rhythm. Generic plastic shine and smooth AI gradient polish are
   failures.
7. **Layer truth.** In-world art has no cream sticker halo. Semantic UI art may
   use one strong cream-white outer cutline around its local-colour inner
   contour. Runtime effects never repair an unreadable base asset.
8. **Geometry-locked states.** Normal, active, powered, selected, tired, or
   emotional variants preserve approved silhouette, pivot, baseline, safe area,
   identity landmarks, and apparent material volume unless the state explicitly
   calls for a reviewed silhouette change.

## Originality boundary

The desired relationship is **shared production taste, distinct fictional
identity**. A reviewer may recognise the same preference for chunky silhouettes,
clear faces, tactile paint, disciplined detail, material-specific rendering,
and excellent small-size readability. They should not mistake Maze so Puzzle
for PPBA or identify a transplanted character, world, palette, prop, interface,
or brand treatment.

Maze's immutable identity remains:

- pocket-sized courage, friendship, noticing, trying again, and warm comedy;
- golden-blonde, blue-eyed Ame and her mint/lavender practical-adventurer design;
- an original cute magical-girl anime storybook JRPG rather than a pet arena;
- heart, star, ribbon, gem, sun, moon, clover, leaf, and flower meanings defined
  by the Maze Art Bible; and
- game-first readability across maze tiles, minimap, portrait, story, iPad,
  desktop, television, and secondary phone presentation.

## Production and review consequences

- Candidate C remains the approved **identity and construction** anchor. This
  research does not revoke or retroactively relabel that approval.
- `mgjrpg-01` remains the truthful recipe on existing sources. New or materially
  rerendered pixels using this calibration receive `mgjrpg-02` records.
- Before broad Plan 03 generation, run the complete canary set under the
  calibrated rules. Current retained pixels may pass unchanged; no asset is
  regenerated merely to satisfy a version label.
- If calibration materially changes Candidate C's face, hair, eyes, body,
  costume, silhouette, registration, or actual-size read, preserve the approved
  source and return the new derivative to the Human/Ame gate.
- Review the canary packet together: Ame C; Fox and Alpaca; Goblin and Jelly
  Sorcerer; Moon Wand; Rose Heart lock/door/portal; First Star; Home and Help;
  Sunny Stone and Wishing Woods; and representative water/lava/poison.
- Score silhouette, large colour masses, contour continuity/locality, three-value
  grouping, focal contrast, saturation allocation, surface frequency, material,
  perspective, motif ceiling, face/emotion, family coherence, alpha, seams,
  bytes, grayscale/CVD behaviour, and actual-context recognition.
- The packet compares `mgjrpg-01` anchors with `mgjrpg-02` candidates and marks
  each outcome `retain`, `adopt`, `revise`, or `reject`. It must not silently
  replace a successful retained asset.
- The first broad production batch waits for canary approval. Later family
  review packets stay small enough to compare all candidates and states at once.

## Candidate and prompt discipline

For a new identity-bearing asset or a replacement that changes identity,
create exactly two independent candidates from the same locked brief. Neither
candidate may see the other. Preserve both and record the selection/rejection
reason. If both fail the same requirement, revise the brief instead of rolling
indefinitely. One bounded correction may address an objective defect; further
failure returns to the brief or Human decision.

Constrained variants of an already approved identity instead use the approved
identity anchor plus one family/rendering anchor and change only the named pose,
expression, state, or material variable. Reusable art contains no generated
labels, letters, numerals, fake logos, signatures, or watermarks.

## Typography implication

PPBA's font work strengthens the existing Maze requirement for a soft, rounded,
readable UI face. `Fredoka` v2.001 is the leading Plan 01 evaluation candidate
for headings, buttons, counters, and interaction feedback because it fits the
chunky friendly geometry. It is not declared shipped by this research pass.
Plan 01 must compare real locally packaged weights at actual sizes, retain
`font-synthesis: none`, verify numerals and arithmetic, measure layout/bytes,
record licence provenance, and keep a highly legible body fallback where dense
copy needs it.

## Verification for this documentation pass

The PPBA craft synthesis changes specifications only. It must not change runtime
asset pointers, pixels, lighting, VFX, animation, layout, co-op content, or
package contents. The contemporaneous Candidate C approval-state reconciliation
may update metadata, schema, validation, proof-generation, source-record, and
manifest contracts, but it may not publish Candidate C or change runtime art.
All production changes remain with their named plans and review gates.

## Human correction after the first contour assay

The first deterministic canary demonstrated that a locally coloured contour can
be measured, but it did **not** demonstrate the desired art direction. Applying
a largely near-black perimeter to retained `mgjrpg-01` sprites left the source
construction, value grouping and material painting almost unchanged; at normal
gameplay size, many comparisons were effectively identical. That v08 packet is
therefore retained as rejected evidence, not as a production technique or
rendering authority.

For Maze, adopting PPBA's contour craft now explicitly means **authoring the
whole image coherently from the start**: silhouette, two-to-four colour masses,
three-value structure, face hierarchy, material rendering, internal separation
and brighter material-local contours are designed together. Deterministic tools
may cut out, register, resize, encode and measure those authored pixels, but may
not manufacture the style by adding a contour to an otherwise unchanged old
sprite. Ame remains Candidate C in identity and construction; only her rendering
surface may be calibrated.

The target contours must show their hue at delivery size rather than merely
avoiding literal black: golden ochre, berry aubergine, blue violet, terracotta,
teal plum and rose mauve remain harmonised with Maze, while the darkest ink-plum
is confined to facial marks, deep occlusion and rare critical separation.
Semantic UI symbols form a separate clean sticker family with a cream paper
cutline; field sprites and terrain do not. This is still craft adoption only—no
PPBA pixel, prompt, character, palette, motif, UI composition or branded identity
is a generation reference.
