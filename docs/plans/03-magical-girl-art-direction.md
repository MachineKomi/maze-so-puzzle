# Magical-girl art direction and graphic-design plan

Status (2026-09-04): **implementation complete — Human-approved `mgjrpg-02`
static art published, catalogue cut over, lifecycle/provenance closed, and live
runtime validation complete.** Plan 04 lighting, Plan 05 animation/landmarks,
Plan 11 front-door branding, and Plan 12 physical retirement remain separate.

## 0. Manager-reviewed execution addendum

Implementation checkpoint (2026-09-02): the Art Bible, model-sheet candidate,
catalogue/source contracts, structured provenance, deterministic proof pipeline,
and safe canary evidence have been implemented against
`ee176f52ab79e08e818fc919f44b7723f9fc9865`. Candidate C is the art-direction
recommendation and remains source-only at that checkpoint. On 2026-09-03, after
reviewing the comparison, actual-size and model-study proofs, the Human made the
  manager-normalized design outcome: **Candidate C is the canonical static Ame
  v02 design direction.** The Human's actual approval wording is preserved in
  `docs/playtests/2026-09-03-ost-delivery-art-approval-and-asset-retirement.md`.
The active Ame pointer is still v01 and runtime/live-context acceptance remains
open at that historical checkpoint. The later 2026-09-04 v6 publication decision
supersedes that runtime status: Ame v02 and the approved static catalogue are
now published through versioned pointers. Candidate C's earlier design approval
alone did not accept Plan 03 or release Plan 01; the publication, live-context,
validation, isolated-commit, and push gates below remain the completion authority.

This addendum records direct Human decisions and supersedes conflicting identity or style statements below. Read `docs/GAME_VISION_AND_DESIGN_SPEC.md`, `docs/plans/00-integrated-implementation-roadmap.md`, the current Gameplay spec, this plan in full, current asset/provenance documentation, and current source before implementation. Plan 07A and Plan 06 must already be accepted.

### Ame identity is non-negotiable

- Every depiction of Ame must have clearly **blonde/golden hair and blue irises**: field sprite, portrait, title/story art, UI art, future animation frames, promotional art, and every optical derivative. Blue does not mean teal, green, violet, or grey at actual display scale.
- Preserve Ame's recognisable face, warmth, young age-appropriate design, mint tunic, lavender/cape/backpack adventure identity, and the character the real Ame already loves.
- The historical bob silhouette was not immutable. Candidate C settles the
  restrained shoulder-brushing, softly layered hair direction closer to the real
  Ame; its exact landmarks and actual-size proof now live in the approved model
  sheet and bind broad Ame production.
- `docs/characters/AME_MODEL_SHEET.md` must record golden-blonde and blue-eye swatches, front/side/back silhouette, hair-length decision, facial landmarks, eye shape, expression vocabulary, costume anchors, proportions, baseline, pivot, face-safe zone, hand socket, secondary-motion envelope, and gameplay/portrait-size proofs.
- Historical runtime images and hashes are provenance/reference, not the source of truth for new frames. No Ame animation, story-image family, or broad pose family proceeds without the final static model-sheet design. If live Human/Ame approval cannot occur within the execution turn, mark that gate honestly and do not imply it passed.
- Candidate C is the selected canonical model-sheet/static-sprite direction.
  Promote it through versioned runtime derivatives, live actual-size proofs and
  rollback-preserving catalogue change before calling the runtime asset
  accepted. Plan 01 still does not start until the remaining Plan 03 gates pass
  manager review.
- The Human later selected **Fresh B-led 01** as Ame's `mgjrpg-02` rendering
  reference because it reads most clearly at normal field scale. This does not
  reopen or replace Candidate C's identity/construction authority. The detailed
  selection record and current production status live in `docs/ART_BIBLE.md`;
  older pending-language in the chronological canary record below is historical
  evidence, not the current decision.

### Refined art north star

- Prioritize clean, simple, chunky, unmistakably anime character design; larger expressive faces; strong silhouettes; controlled plum-rooted local-material linework; broad cel-like three-value groups; and restrained painterly texture.
- Reduce excessive jewels, filigree, sparkles, ribbons, and micro-detail before sacrificing readability or individual personality.
- Add a “Human references translated into original principles” section to the Art Bible. The named taste references communicate cosy optimistic fantasy, bright clean anime faces, expressive ensemble warmth, appealing SD/chibi proportions, readable fantasy icons, and warm story-led handheld-JRPG presentation.
- Preserve the complete named reference set in that analysis: *Chillin' in Another World with Level 2 Super Cheat Powers*, *I've Been Killing Slimes for 300 Years and Maxed Out My Level*, *Ragnarök Online: New World*, *Idle Poring*, *Ragnarök M: Eternal Love*, and *Trails in the Sky*.
- Keep franchise names and reference images out of generation prompts. Do not reproduce a protected character, costume, prop, logo, composition, UI skin, or signature. Translate principles into original descriptive constraints.
- Static field assets use soft, mostly neutral front/top form modelling without a baked cast shadow or strong fixed rim. Plan 04 owns directional maze lighting. Story/key art may retain a declared cinematic light.

### PPBA-informed craft calibration — 2026-09-03

The Human supplied the private `MachineKomi/ppba-rebirth-spec` repository after
Phase 1. Its current art/asset authority was inspected at
`dacc8cf644d24d56aae34ba757efb4fac5f9d341`. This is timely calibration, not a
restart: Candidate C remains the approved Ame identity/construction direction,
and the selective retain/refine/replace decisions remain intact.

Before broad Phase 2–5 generation, consume the exact adopt/adapt/reject record in
`docs/research/2026-09-03-ppba-art-craft-synthesis.md` and the reconciled
`docs/ART_BIBLE.md`. Test the proposed `mgjrpg-02` production grammar on the full
canary set. In particular, compare `storybook-local-contour-v1`, two-to-four
large colour masses, one focal hierarchy, restrained surface frequency,
material truth, visual-layer separation, and geometry-locked state pairs against
the current `mgjrpg-01` anchors.

This does not authorize importing PPBA assets, prompts, characters, palette,
motifs, compositions, UI skin, brand, IDs, or fictional world. Maze's Ame,
cast, storybook-maze identity, mint/lilac/coral/plum palette, child-safe tone,
motif meanings, actual-size bands, and named inspirations remain authoritative.
Existing sources keep their truthful `mgjrpg-01` records. Pixels produced with
the proposed calibration are recorded as `recipeVersion: mgjrpg-02` with their
candidate/pending status; Human approval promotes the recipe's production
authority rather than retroactively changing its label. An existing asset that
passes unchanged is retained, not regenerated for bookkeeping.

The canary packet is a Human gate before volume production. It does not reopen
Candidate C's identity approval. If applying the calibrated rendering materially
changes Ame's face, hair, eyes, costume, silhouette, registration, or actual-size
read, preserve Candidate C and return the changed derivative for bounded Human
review rather than silently calling it the same art.

The Human's 2026-09-03 contour direction is explicit: Maze adopts the
colour-aware outline *technique* as part of `storybook-local-contour-v1` and the
proposed `mgjrpg-02` rendering profile. Each stable contour section follows the
nearest enclosed interior material, becomes a darker/slightly richer member of
Maze's own deep-plum family, and changes hue only at a meaningful material or
construction boundary. It is neither uniform black nor pixel-by-pixel rainbow
sampling. Darkest ink-plum is reserved for eyes, mouth, deep occlusion, critical
micro-separation, or an edge that genuinely needs the extra contrast. No PPBA
pixel, prompt, character, palette, motif, prop, composition, UI layout, logo,
brand element, or trade dress may be copied; this is craft adoption, not project
identity.

Characters, friends, enemies, weapons, items, props, cages, doors, portals, and
semantic UI cutouts use the family-appropriate local contour system. Cream paper
cutlines are exclusive to semantic UI icons, badges, prompts, reaction symbols,
and UI-context reward flourishes. Periodic terrain, floors, walls, liquids, and
hazards instead use related material-aware boundaries, values, patterns, and
seams; they never receive an enclosing character outline. Static field art keeps
neutral front/top form modelling with no baked directional cast shadow.

### Human rendering correction — v08 rejected, authored-options gate required

On 2026-09-03 the Human rejected the v08 deterministic comparison as a useful
style-choice gate. Although its enlarged crops proved that contour pixels could
follow neighbouring material, its actual-size result was effectively the old
art with a near-black post-process perimeter. Nineteen minimally changed pairs
did not offer a meaningful preference and do not constitute a coherent redraw.
This finding rejects the packet's production proposition, not Candidate C's
approved identity/construction and not the general goal of colour-aware edges.

The corrective gate is a **from-scratch authored rendering-direction gate**:

- Historical/runtime pixels appear only as context. They are not edit targets
  for replacement families and never receive a synthetic production outline.
- Options A/B/C are independently generated from the same written family brief.
  They must differ in silhouette/mass handling, value design, material paint,
  detail frequency and edge character—not merely line hue or palette.
- Long material contours target visibly chromatic 38–55% lightness at delivery
  size. Rebalance adjacent fills before making a whole edge darker. `ink-900`
  is a facial/deep-occlusion exception, ideally no more than 5% and never more
  than 10% of the outer perimeter with written contrast justification.
- A is Luminous Storybook Cel: crisp broad cel-gouache groups and the clearest
  handheld anime read. B is Soft Jewel Gouache: softer faceted matte paint and
  the warmest storybook read. C is Chunky Enamel Adventure: the boldest simple
  shapes, thick bright local contours and most graphic sticker UI.
- Contact sheets are decision evidence only. Their cells may not be cropped into
  masters. Candidate C receives separate rendering-only options from her one
  immutable original; any face, hair, eye, costume, pose, silhouette or
  registration drift is rejected rather than offered.
- v08 and its recipe hash remain historical evidence. The review stays pending
  until the Human selects, narrows or rejects an authored direction. No runtime
  pointer, broad family production or cleanup follows from generating a proof
  packet. The current immutable packet is `v11`; `v09` and `v10` were proof
  presentation preflights and are not recommended evidence.

The Human also directed a future enemy set: Classic Slime, Lizard Sword Guard,
Lizard Spear Guard, Wholesome Succubus, Pocket T-Rex, Cultist (public label
pending), Lamia, Soda Slime, Orc Chieftain, Cyclops, Minotaur, Warrior Skeleton,
Kappa and Treasure Mimic. Tea-Time Skeleton was subsequently and explicitly
classified as a rescue-and-collect friend, not an enemy. Exact child-safe
construction lives in `docs/enemies/ENEMY_FAMILY_SHEET.md`. These are source-only
identities at this gate; no runtime IDs, chapter placements or new mechanics are
implied.

### Human-authorized front-door and presentation extension — 2026-09-03

The Human subsequently authorized Plan 03 to produce and publish an early
front-door set so the refreshed art direction can appear in the next sensible
family-playable build. This extension is recorded in
`docs/playtests/2026-09-03-art-directed-ui-and-playable-checkpoints.md` and
backlog items `PT-20260903-25` and `PT-20260903-26`.

- Produce three independently addressable roles: an opaque responsive title
  background, a transparent home/hero splash composition, and the exact
  **Maze so Puzzle** visual logo/wordmark. The current application has one
  combined title/home/menu surface; these roles compose on that surface and do
  not justify inventing a second startup screen or shipping an unused duplicate.
- Keep the illustration, transparent hero composition, non-text brand mark, and
  exact wordmark separable. Generated lettering is concept evidence only. Any
  shipped wordmark is deliberately reconstructed with controlled local
  type/vector/raster artwork and must pass exact spelling, small-size
  readability, originality, and Human review. A real semantic application
  heading remains present even when a visual lockup is displayed.
- Create approved `presentation` renditions for the characters, friends,
  enemies, items, equipment, blockers, rewards, and other contextual art that
  Plan 01 will deliberately show large. Do not preload both field and
  presentation families or generate a bespoke large source where an approved
  existing source already passes the measured physical-pixel target.
- Record focal points, copy-safe rectangles, contain/crop policy, responsive
  intent, catalogue identities, provenance, encoded/decoded cost, fallbacks,
  and rollback for every published front-door or presentation asset.
- Plan 03 owns the pixels, derivatives, semantic catalogue records, and art
  proof. Plan 01 owns composition and responsive UI integration; Plan 07B owns
  loading, font, decode, LCP, Web/Tauri, and low-end qualification. Plan 11 later
  performs an audit-first final-canon pass and retains successful early work by
  default; it is not a mandatory regeneration phase.

### Execution and documentation gate

Create `docs/ART_BIBLE.md`, `docs/characters/AME_MODEL_SHEET.md`, structured source records/manifest, and the shared reproducible art pipeline before broad replacements. Preserve `docs/research/2026-09-03-ppba-art-craft-synthesis.md` as the exact cross-project adoption record. Append new versioned sections to `docs/AI_ASSET_PROMPTS.md`; never rewrite historical exact prompts. Update `docs/STORY_BIBLE.md` so Ame's blonde hair, blue eyes, and approved hair silhouette are narrative/visual canon.

Plan 03 owns static identity, catalogue schema, geometry metadata, source/provenance, and art pipeline, including the authorized front-door set and contextual presentation renditions. Plan 01 implements runtime UI tokens and composition; Plan 04 owns directional light; Plan 02 consumes tokens for VFX; Plan 05 later extends the approved pipeline for frames. Actual-size, context, responsive-crop, grayscale, cage, held-weapon, byte/decode, alpha, seam, and rollback proofs are release gates, not optional polish.

Before handoff, publish a versioned content-integration manifest assigning every
Human-approved source a stable semantic identity, lifecycle, proposed content
role, intended owner/consumer, loading intent, and any explicit Human deferral or
blocked return gate. The historic fifteen-friend count is a baseline, not a cap:
reconcile the complete approved ordinary, mythic, yokai, fantasy, Greek/Roman,
unicorn, enemy, Mimic, environment, traversal, pickup, navigation, brand, and UI
slate. Plan 09—not this art plan—makes the separate final campaign/generated
gameplay-eligibility and placement decisions.

- Historical status when prepared: planning and research only. The execution
  checkpoint above records the implemented foundation and later Human decisions.
  The original G1 blocking language in the chronological phase record has been
  superseded by the approved `mgjrpg-02` recipe, Candidate-C construction,
  Fresh-B-led-01 Ame rendering reference, and per-batch Human approvals recorded
  in the Art Bible and source review records. Remaining runtime publication and
  integration gates still apply asset by asset.
- Prepared: 2026-09-02, Europe/London
- Repository state inspected: main at c6b6628b6e651d18161a4d1302935d3096f665c6
- Application version inspected: 0.19.0
- Initial working tree: clean; git status --short returned no entries
- Implementation authority: this document does not authorize asset generation, replacement, deletion, catalogue edits, or runtime changes

## 1. Decision summary

The project already has a charming core. Ame, the warm title illustration, the colour-and-shape lock pairs, the portal trio, and the broad storybook palette feel welcoming and authored. The work is therefore a controlled unification, not a wholesale reboot.

The creative north star is:

> **Pocket-sized courage made visible.** An optimistic storybook maze where friendship magic turns hearts, stars, ribbons, gems, moons, and leaves into a consistent visual language. Rounded, chunky silhouettes and tactile pastel paint keep the world safe and inviting; deep-plum edges, decisive poses, and jewel-bright semantic accents preserve the clarity and heroic energy of a polished handheld JRPG.

The implementation sequence is:

1. Establish an asset contract, model sheets, family DNA cards, semantic colour tokens, provenance records, and automated checks before replacing pixels.
2. Fix the smallest and most semantic art first: navigation, app-icon optical variants, hazards, friend/cage composites, pivots, safe zones, and weapon grips.
3. Unify friends, selected enemies, props, and locks around approved anchors.
4. Normalize terrain frequency and material rendering without discarding the working periodic pipeline.
5. Create right-sized runtime derivatives, roll them out family by family through
   versioned catalogue pointers, and classify proven retirement candidates for
   Plan 12's later copy-first handoff; Plan 03 removes no physical file.

No Figma work is proposed. A trusted curated-skill search on 2026-09-02 found broad Figma skills but no exact art-direction, asset-audit, or image-pipeline skill. The repository contains no Figma source or concrete Figma library workflow. Installing a Figma skill or connecting Figma would therefore add process without an authoritative source. No skill was installed.

## 2. Scope and ownership

This plan owns:

- The visual identity, creative north star, art bible, family DNA cards, static-asset standards, graphic-design tokens, and motif semantics.
- Catalogue metadata needed to describe, validate, select, and trace static art.
- Generation and edit prompt templates, consistency anchors, exact prompt retention, provenance, source-master handling, derivative generation, and static visual QA.
- The order in which current assets are retained, refined, replaced, or retired.
- Static-art handoff requirements for lighting, animation, accessibility, and performance owners.

This plan does not own:

- HUD layout or responsive composition.
- Effect or transition timing.
- Wall-lighting implementation or the runtime lighting algorithm.
- Sprite animation states, animation timing, or state-machine design.
- Gameplay mechanics, balance, collision, progression, or rating decisions.

Where those systems consume art, this plan defines the static inputs and review contract only.

## 3. Audit method and baseline

### 3.1 Repository and pipeline inspection

The audit covered:

- src/artCatalog.ts, including 12 terrain themes, 8 weapons, 12 enemies, 15 animal species, 4 active cage fronts, 3 key/door pairs, and 3 paired portals.
- src/assets.ts, including direct asset aliases, preload groups, rewards, badges, treasure, story art, and navigation art.
- Runtime rendering and display rules in src/App.tsx, src/styles.css, cameraMotion.ts, and the level definitions.
- All image files directly under public/assets, all source images under docs/source-assets, docs/AI_ASSET_PROMPTS.md, and every Pillow processor under scripts.
- The existing catalogue and asset tests.

Baseline inventory:

| Surface | Count | Encoded size | Notes |
| --- | ---: | ---: | --- |
| Runtime images in public/assets | 125 | 39,173,427 B / 37.36 MiB | 87 PNG, 38 WebP; audio excluded |
| Literal source-referenced runtime names | 109 | 34,464,438 B / 32.87 MiB | An upper bound, because some declared aliases are not consumed |
| Clearly superseded and unreferenced runtime images | 16 | 4,708,989 B / 4.49 MiB | Old cages plus floor-v2, wall-v2, water.png, and lava.png |
| Additional declaration-only candidates | 4 | about 1.11 MiB | ame-sword.png and three old reward files; prove dead before retirement |
| Source images in docs/source-assets | 104 | 165,695,455 B / 158.02 MiB | Predominantly 1254 × 1254 generation outputs |

Runtime dimensions and formats currently follow production-pass history:

- 17 palette PNG terrain/hazard textures at 1024 × 1024.
- 65 RGBA PNG and 5 RGB PNG images at 512 × 512.
- 26 RGBA WebP images at 512 × 512.
- 6 RGBA navigation WebPs at 192 × 192.
- 3 RGBA treasure WebPs at 384 × 384.
- 2 RGB story portraits at 512 × 512.
- One 1672 × 941 RGB title WebP.

If every runtime image were decoded simultaneously, the approximate RGBA surface would be 174.5 MiB. The game does not load everything simultaneously, but that figure explains why encoded compression alone is not a memory strategy.

### 3.2 Visual inspection at source and gameplay scale

Assets were inspected:

- Individually on transparency and representative light, dark, and terrain contexts.
- In the in-app browser on the live title screen and representative 6 × 6 scenes: Shiny Sword, Toasty Toes, Wishing Woods, Lanternlight Labyrinth, and Moonlit Friendship Quest.
- At the game’s compact 960 × 540 target, where the board is about 504 px wide and a tile is about 84 px. Ame is about 77 px high, enemies about 69 px, pickups about 59 px, and cages/doors about 82 px.
- At an 844 × 390 landscape phone viewport. The fixed canvas shrinks to roughly 694 × 390, and dashboard/navigation art is commonly only 18–32 px.

The title art remains attractive and coherent when scaled. The live maze makes the central issue obvious: board art must work at 59–84 px, while the same richly painted source may be reused at 18–40 px in navigation, the rescue list, inventory, or rewards. A single detailed 512 px render is not an optical system.

The existing read-only terrain checks were also run:

- python scripts/process_terrain_textures.py --check: all 15 managed periodic textures passed current wrap/local-difference thresholds.
- python scripts/process_terrain_dressing.py --check: all 4 dressings passed 512 × 512 RGBA and clear-edge checks.

Passing these checks proves technical wrapping and alpha basics; it does not prove consistent material scale, silhouette, contrast, or perceptual repetition.

### 3.3 Reference-led ImageGen exploration

Two preview-only explorations were generated outside the repository. The first used current Ame, fox, blueberry slime, moon wand, and rose-brick art as references for a new generic character/friend/enemy/tool/environment calibration board. It successfully converged on one contour, palette, and shading family, but overused hearts, bows, wings, gems, and stars.

A targeted second edit assigned one meaning to each motif and simplified the opponent. The result became substantially clearer at its tiny comparison row, but it also changed unrequested heroine landmarks, including hair/costume details. This is direct evidence for the proposed workflow:

- Reference-led iteration is useful for family cohesion.
- Exact locked landmarks and one-change edit instructions are necessary.
- Human comparison against the preceding approved image is mandatory.
- A generated style board is evidence, never an automatic production asset.

Neither exploratory output is part of the repository or an approved design.

## 4. Severity model and highest-risk findings

Severity describes player impact, not artistic taste:

- **S0 — semantic blocker:** can obscure gameplay meaning, accessibility, or a critical interaction at supported scale.
- **S1 — high:** breaks character/world cohesion, grounding, identity, or reproducibility across a frequently seen family.
- **S2 — major polish:** noticeably weakens hierarchy or quality but remains understandable.
- **S3 — maintenance:** latent drift, weight, or workflow debt with limited immediate player impact.

The most important findings are:

1. **S0/S1: there is no canonical optical-size system.** Navigation, badge, reward, cage, and inventory art is often shown at 18–40 px even when sourced from a highly detailed 192–512 px illustration. Help reads as a lantern, Sound reads as a notification bell, and dense gold/purple rewards become similar round shapes.
2. **S1: the 15 friends form several rendering families.** Dark-plum cartoon cutouts, soft plush renders, pale-edged renders, seated poses, standing poses, head ratios, eye ratios, fur density, accessory logic, and canvas occupancy all vary. The species remain readable, but they do not look born of one model sheet.
3. **S1: no canonical content box, baseline, pivot, face-safe zone, or grip exists.** Every board object is positioned by broad kind. Visible bounds range from Ame occupying about 52% of canvas width to a Golden Heart cage occupying about 99%; weapon flourishes approach the image edge. That directly causes scale, grounding, cage-face, and held-weapon inconsistency.
4. **S1: the source and provenance chain is incomplete.** Sixteen active foundational assets have no repository-local lossless master. The prompt document contains 91 generated-output IDs and 25 user-machine paths, but no structured model/version/date/reference/hash record.
5. **S1/S2: the environment is technically seamless but artistically non-uniform.** Material scale runs from broad sunny cobbles to micro-speckled dirt and dense botanical walls. Amethyst reads more like glossy pebbles or grapes than crystal; hedge and bramble compete with actors.
6. **S1/S2: cages are functional composites but inconsistent objects.** Bar count, bar position, frame width, material, feet, and ornament density vary. Storybook Wood reads as polished gold metal, and several bars/locks cross the animal face zone at gameplay and rescue-list sizes.
7. **S1/S2: the current format strategy follows chronology.** Similar 512 px cutouts use PNG or lossless WebP based on the release pass, not edge character or display size. Several 240–331 KiB rewards are usually shown around 49–52 px.
8. **S2: painted highlights and runtime lighting do not share a declared rule.** Runtime lighting varies by level and adds wall highlights and contact shadows, while source assets contain different fixed studio-light assumptions.
9. **S3: public/assets retains obsolete files.** Sixteen unreferenced files are certain superseded candidates; ame-sword.png and three old rewards are likely declaration-only. They add package weight and create uncertainty about the canonical revision.

## 5. Complete visual-consistency audit

### 5.1 Family-by-family audit

| Family | Coverage and representative examples | Finding | Severity | Direction |
| --- | --- | --- | --- | --- |
| Character | ame.png, ame-portrait.png, ame-sword.png | Ame’s field sprite is iconic, cheerful, and clear at about 77 px. Portrait, field, title, and obsolete sword-holding render vary in proportions, costume micro-detail, edge strength, and format. No local master exists for the two active Ame images. | S1 | Retain Ame as the identity anchor; make a canonical model sheet and source record. Replace no identity. Retire ame-sword only after proving the composited held-weapon path is canonical. |
| Friends | 15 species; animal-fox.png, animal-red-panda-v1.png, animal-puppy-v1.png, animal-alpaca-v1.webp, animal-chinchilla-v1.webp | Fox/red panda have decisive plum-edged silhouettes; puppy/lamb/capybara lean plush and near-3D; pale animals lose contour; sitting/standing and occupancy vary. Small display preserves species but loses personality unevenly. | S1 | Retain every species, colours, and recognisable accessory; replace the rendering with one family pass. Use fox/red-panda readability plus Ame’s edge/shading recipe, not either asset literally. |
| Enemies | 12; goblin.png, enemy-mushroom-imp-v1.png, enemy-blueberry-slime-v1.png, enemy-pebble-golem-v1.png, enemy-clockwork-crab-v1.webp | Generally cheerful and readable, but threat, gloss, detail, scale, and grounding vary. Pebble Golem’s fists/brow are markedly more forceful; Cloud Gremlin is pale; Blueberry Slime is glossy; Candy Mimic reads like a child in a chest at small scale. | S1/S2 | Retain concepts and most silhouettes; refine selected outliers. Use round masses plus one or two controlled challenge accents. |
| Weapons | 8; sword.png, weapon-flower-sabre-v1.png, weapon-moon-wand-v1.png, weapon-bubble-bow-v1.png, weapon-cupcake-mace-v1.png | The seven newer weapons share diagonal presentation, gold fittings, gems, and ribbons, but are much denser than the simple Star Sword. Fine filigree collapses when held around 49 px. Several bounds nearly touch the 512 px canvas, and no individual grip is recorded. | S1 | Retain concepts; refine/thicken silhouettes and motif counts; bring Star Sword into the family. Add grip, held angle, scale, and z-order metadata before new held art. |
| Items and treasure | potion.png, boots.png, spring-boots-v1.png, antidote-leaf-v1.png, coin-pouch.png, three 384 px treasure WebPs | Major silhouettes are distinct. Spring Boots carry too many motifs; Antidote Leaf can merge with foliage; Science Gears are too dense in wallet-scale reuse. Early items are glossier than some late painterly art. | S2 | Retain concepts. Simplify and create optical derivatives; strengthen medicine identity without relying on green alone. |
| Cages | 4 active v5 fronts plus 11 older runtime variants; all four active fronts inspected | The transparent-front solution works. Geometry, bar count, material, feet, lock scale, and ornament vary; thick bars obscure friends. Storybook Wood does not read as wood. Golden Heart nearly touches the canvas edge. | S1 | Retain the compositing contract. Replace Storybook Wood and refine the other three around common geometry, a face-safe opening, and thinner bars. Retire v1/v2/v4 runtime files after proof. |
| Locks and doors | 3 colour+shape pairs; star-key.png/star-door.png, rose and sun pairs | Redundant colour and silhouette cues are strong. Blue Star is an earlier density/polish pass; door filigree is excessive at one tile; some doors touch the top edge. Current parallel maps can drift apart. | S1/S2 | Retain all identities; unify one paired record, motif scale, gold recipe, safe margin, and detail ceiling. |
| Paired portals and goal | 3 flower portals plus goal.png | The flower trio is one of the strongest coherent edited families. Distinct hue+motif survives reduction. Rose has a different extraction lineage. The upright star goal is clear but shares dense star/gold/purple language with rewards and the app icon. | S2 | Retain portal trio; normalize edge processing and drawn motif. Protect the goal’s unique finish silhouette and create simpler small-scale derivatives rather than redesigning its identity first. |
| Rewards and badges | 3 active stickers, 3 medals, 9 badges; reward-trail-sticker.png and v2 reward WebPs | Large shelf art is attractive and celebratory, but detail, gold, and purple converge at 18–48 px. First Star is from a different pass. Four old reward files remain declared or present without active map use. | S1/S2 | Retain large designs; replace/refine First Star to the current family; author 32/48/64 optical variants. Prove and retire dead old rewards separately. |
| Floors | 7 active periodic floors; floor-v3.png, floor-rose-brick-v1.png, floor-meadow-grass-v1.png, floor-woodland-dirt-v1.png | All active floors pass current seam checks. Rose, pearl, and peach are quiet; meadow/dirt are high-frequency; stone size and brush texture vary substantially. floor-v2 must not return. | S2 | Retain theme concepts and current technical pipeline. Repaint/normalize material scale, value range, and landmark density in a later environment pass. |
| Walls | 6 active walls plus dormant sandstone; wall-v3.png, wall-mossy-ruin-v1.png, wall-hedge-v1.png, wall-amethyst-crystal-v1.png, wall-berry-bramble-v1.png | Runtime geometry helps them read as walls, but source textures often resemble floor material. Hedge/bramble are noisy; amethyst lacks a decisive facet language; sandstone is too light to activate safely. | S1/S2 | Retain concepts; refine frequency, boundary value, and material recipe. Keep sandstone dormant until darkened and revalidated. Never reactivate wall-v2. |
| Dressings | 4; garden, vines, crystal, autumn | Clear-edge and alpha checks pass, and 0.08–0.17 opacity keeps them subordinate. Their 13–14 tile periods make some details soft or effectively invisible at the six-tile camera. | S3 | Retain; review density and resolution in context. Increase resolution or shorten the authored period only when a gameplay-scale proof shows benefit worth the bytes. |
| Hazards | water-v2.png, lava-v2.png, terrain-poison-v1.png, ground-hole-v1.png | Hue and full-size pattern differ, and runtime overlays add waves, shimmer, and bubbles. Water/lava use exact mirrored edges that reveal kaleidoscopic macro-symmetry; poison uses a different painterly recipe. All liquid hazards share a rounded boundary. Hole is top-down but its brown rim can merge with woodland dirt. | S0/S1 | Preserve semantics; replace water/lava masters with non-kaleidoscopic periodic siblings, harmonize poison, and refine the hole rim. Require hue+luminance+pattern/edge differentiation and reduced-motion legibility. |
| Story art | title-background-v1.webp, story-professor-poggle-v1.webp, story-sprig-v1.webp | The title is the strongest whole-world presentation: warm, inviting, and correctly reserves left-side copy space. Poggle is strongly inked; Sprig is softer and paler. Story-tier proportions may be richer than field sprites but need a documented relation. | S2 | Retain title and both characters. Normalize bust crop, light, edge, and Ame portrait treatment; do not force story art into field-sprite proportions. |
| Navigation icons | 6 192 px WebPs; nav-home-v1.webp, nav-help-v1.webp, nav-sound-v1.webp | The family is colourful and polished but too literal/detailed for 18–25 px. Help resembles a lantern; Sound a bell; there is no mute-specific silhouette. Labels currently rescue comprehension. | S0/S1 | Retain concepts but replace the small optical art. Use literal one-subject symbols, a distinct muted state, and 16/24/32 variants. |
| Brand and app icon | docs/source-assets/app-icon.png and derivatives; goal.png relationship | The star outline is recognisable; inner galaxy, clouds, filigree, orbit, and many sparkles merge below 32 px. | S1 | Retain the star silhouette and gold/plum relationship. Draw dedicated 16/32/64 optical marks; do not mechanically shrink the 1024 px illustration. |
| UI ornament and colour system | src/styles.css root palette plus many later hard-coded colours and gradients | The initial cream/plum/lilac/mint/coral/gold palette is coherent. Later surfaces introduce many one-off hex values and gradients, so semantic state and decorative identity are not separated. | S1/S2 | Keep layout unchanged. Consolidate graphic tokens and ornament rules; migrate values only with screenshot and contrast review. |

### 5.2 Reconciling apparently conflicting evidence

Two observations are both true:

- The active terrain set is technically healthy and currently playable.
- The environment family has the largest cross-asset material-scale drift.

Therefore terrain is **retained operationally** while its concepts are **refined visually** in a later controlled pass. It is not an emergency wholesale replacement.

Likewise, rewards and navigation art are attractive at source size, yet fail differently when reduced. The solution is not to discard the large illustration; it is to add purpose-built optical variants.

## 6. Art bible

### 6.1 World grammar

Magical power is warm, relational, and purposeful. It expands the silhouette, clarifies intent, and celebrates care rather than making a character look aggressive.

Construct every small asset in this order: outer silhouette and gesture; two to
four large colour masses; secondary construction/material; then one expendable
accent tier. Assign one focal area—the face, required interaction, or narrative
subject—the clearest value edge and highest useful chroma. Group hair into locks,
fur/feather into a few tufts, foliage into clusters, stone into broad blocks, and
fabric into broad folds. Detail that vanishes or flickers at its real delivery
size is a defect.

Each magical family uses a static visual grammar:

| Motif | Meaning | Approved uses | Do not use for |
| --- | --- | --- | --- |
| Heart | Care, rescue, bond | Friends, rescue cages, Rose route, helping rewards | Generic filler on every weapon or button |
| Star | Agency, navigation, earned achievement | Ame, goal, navigation accent, completion reward | Repeated confetti inside already complex art |
| Ribbon | Connection, motion, release | One directional tail on a tool, bond or portal flow | Multiple bows on every joint or corner |
| Gem | Stored or focused magic | Weapon core, lock core, power-bearing prop | Decorative studs without hierarchy |
| Sun | Courage, warmth, persistence | Sunny lock route and warm power family | Generic gold ornament |
| Moon | Reflection, mystery, calm | Moon route, portal, quiet magic | Default decoration on unrelated families |
| Clover/leaf/flower | Growth, chance, nature | Mint portal, plant families, healing items | Substituting for a clear functional symbol |

Use one primary motif and at most one supporting motif per asset. A motif repeated at different scales still counts as one allocation only when the repetitions form one clear emblem; otherwise it is ornament.

For transformation-related illustrations, document:

1. **Trigger:** the object or feeling that begins the change.
2. **Medium:** ribbon, light, petal, water, or other carrier.
3. **Marker:** the single motif that confirms identity.
4. **Result:** the new readable silhouette or state.

This is a static-design handoff. The effects owner chooses timing and motion.

### 6.2 Palette roles

The existing palette remains the identity base. New semantic inks prevent pastel fills from carrying information alone.

| Token | Value | Role and rule |
| --- | --- | --- |
| paper-0 | #FFFDF5 | Primary light surface and proof background |
| cream-1 | #FFF9E9 | Warm secondary surface |
| ink-900 | #34203F | Critical outline and normal text; 14.48:1 on paper-0 |
| ink-700 | #4C2D5D | Standard plum outline and headings; 10.85:1 on cream-1 |
| lilac-300 | #C7A9E5 | Soft identity field, never essential text |
| mint-300 | #A8DFC8 | Friendly identity field, never essential text |
| coral-300 | #EE826F | Warm decorative fill; only 2.56:1 on paper-0, so never small text or the sole state cue |
| teal-400 | #42AAA7 | Decorative interactive fill; only 2.73:1 on paper-0, so pair with ink and shape |
| gold-400 | #F5BF4F | Magic/reward highlight, not text on a light surface |
| sky-300 | #73C9E6 | Water/sky accent, not a sole semantic cue |
| safe-700 | #167C77 | Safe/ally semantic ink; 4.93:1 on paper-0 |
| danger-700 | #B9474C | Warning/hazard semantic ink; 5.07:1 on paper-0 |
| magic-700 | #6A4696 | Active magic/focus semantic ink; 7.04:1 on paper-0 |
| warning-800 | #9B5E00 | Gold-family semantic ink; 5.16:1 on paper-0 |
| poison-700 | #7A3E98 | Poison semantic ink; 6.94:1 on paper-0 |
| locked-700 | #6D6478 | Disabled/locked semantic ink; 5.51:1 on paper-0 |

Contrast policy:

- Ordinary runtime text targets 4.5:1; large text targets 3:1.
- Essential non-text boundaries, icons, and state markers target 3:1 against adjacent colours.
- Decorative paint is allowed below those ratios only when a compliant outline, shape, pattern, icon, or label carries the meaning.
- Never rely on red versus green alone.
- Test all terrain and state art in grayscale and protanopia, deuteranopia, and tritanopia simulation; simulation complements rather than replaces human testing.
- Reserve the highest chroma for interactables, active magic, rewards, and hazards. Floors and inactive ornament stay quieter.

### 6.3 Edge and line treatment

- The proposed `mgjrpg-02` canary uses `storybook-local-contour-v1`:
  solid, continuous contours whose hue/value follows the adjacent material but
  remains harmonised toward Maze's plum inks. Use aubergine around lavender,
  russet-plum around leather/coral/gold, blue-plum around cool material, and
  leaf-plum around foliage—not unrestricted rainbow edging.
- Outer actor/prop contour at a 512 px derivative: 3–5 px. Internal structural
  line at 512 px: 1.5–3 px; omit any line that becomes sub-pixel at the intended
  output. Reserve the darkest `ink-900` for pupils, mouths, deep occlusion, and
  critical separation rather than one uniform perimeter.
- At 64 px, preserve a 1.5–2 px silhouette edge and remove most internal
  linework. Light fur and cream surfaces receive a locally appropriate
  plum/mauve boundary; do not substitute a white glow.
- Terrain has painted material boundaries, not character outlines.
- Do not add a baked white sticker edge to field sprites or world pickups.
  Semantic UI icons, badges, prompts, anime reaction glyphs, and UI-context
  rewards may use one deliberate cream paper-cut border around a local-colour
  inner contour.
- Transparent art must have a clean colour-dilated edge beneath alpha, not magenta, white, gray, or black matte contamination.

Contour assignment and delivery rules are measurable:

- Sample the nearest stable interior material 1–3 delivered pixels inside the
  alpha silhouette, classify the material region, then select the darker/richer
  Maze contour family. Use warm-gold plum for blonde/gold, aubergine for
  lavender, blue-plum for cool blue/silver, russet-plum for coral/leather/warm
  wood, leaf-plum for mint/foliage, and cream-mauve for pale fur/cloth.
- Switch families at construction joints, not at individual sampled pixels.
  Merge tiny edge islands into the dominant adjacent section. A halo, dithered
  hue fringe, broken contour, muddy pale edge, or arbitrary black divider fails.
- Essential silhouette sections target at least 3:1 against the nearest fill and
  representative proof backgrounds. If a local hue cannot meet it, darken it
  toward `ink-700`/`ink-900` without changing material family.

| Delivered use | Outer/local contour | Structural line | Cream UI cutline |
| --- | ---: | ---: | ---: |
| 512 px presentation cutout | 3–5 px | 1.5–3 px | semantic UI only |
| 256 px field/prop cutout | 2–3 px | 1–2 px | semantic UI only |
| 128/103/84 px actor/object | 2 px | 1 px or omit | semantic UI only |
| 77/64/56/40 px actor/friend | 1.5–2 px | 1 px or omit | never |
| 64/48 px semantic icon/reward | 1.5 px inner | 1 px or omit | 2 px |
| 32 px semantic icon | 1 px inner | omit | 1.5 px |
| 24/16 px semantic icon | 1 px inner | omit | 1 px |

These are optical widths in the delivered raster. Fractional antialiased strokes
must retain a continuous opaque-equivalent core; sub-pixel haze does not count.

### 6.4 Shading and light

- Use three readable value groups: light, local midtone, and grouped shadow. Add a small accent highlight only when it explains material.
- Character and prop reference light is soft upper-left/front: approximately 315° azimuth and 45° elevation.
- Static cutouts contain no floor cast shadow and no broad glow halo; runtime owns contact shadow and active glow.
- Terrain and dressings are near-neutral diffuse/albedo paintings. Small ambient occlusion in cracks is allowed; directional cast shadows and spotlights are not.
- Emissive art must retain a readable unlit base. Reduced-motion or disabled effects cannot erase its meaning.
- Specular width is a material rule, not a universal polish layer.
- Normal and powered/glowing static states preserve silhouette, pivot, baseline,
  safe area, and alpha footprint. Apparent light begins within the represented
  material volume; Plan 02 owns outer halo, rays, motes, pulses, and animated
  emission. A blurred duplicate or exposure wash is not a powered-state master.

### 6.5 Material recipes

| Material | Recipe |
| --- | --- |
| Gold alloy | Warm ochre midtone, amber occlusion, one narrow cream highlight, at most one white pin; no mirror chrome |
| Silver | Blue-violet midtone, plum occlusion, narrow cool highlight; keep value distinct from white fur |
| Gem | Three to five large facets, one dominant internal hue shift, one primary highlight; no confetti sparkle field |
| Fabric/ribbon | Matte, broad folds, restrained edge light, consistent V-notch ribbon tail |
| Leather | Warm brown, broad bevel, sparse stitching; no plastic gloss |
| Fur/feathers | Grouped tufts around silhouette and joints, calmer face plane, species texture in two or three masses |
| Wood | Rounded construction, visible but sparse grain, darker end grain and joints |
| Stone | Broad value blocks, scale consistent with a tile, sparse cracks, no photographic micro-noise |
| Foliage | Clustered leaf masses with selected edge leaves; do not render every leaf |
| Liquid magic | Large directional pattern and a clear value rhythm; animation overlay is supplementary |

### 6.6 Perspective and scale tiers

- Field characters, friends, enemies, and carried props: front three-quarter with a slight elevated view, no lens distortion, one shared ground plane.
- Doors and cage fronts: near-frontal orthographic, with only enough top plane to explain volume.
- Portals and holes: top-down orthographic.
- Floors, walls, hazards, and dressings: strictly top-down orthographic and tile-periodic.
- Story art: cinematic three-quarter perspective may be richer, but character identity landmarks and material recipes remain locked.
- UI/navigation: flat or shallow three-quarter only; one perspective per family.

Proportions:

- Ame field model: 2.9–3.1 heads tall.
- Story/key-art Ame: 4.5–5.0 heads tall, explicitly a story tier rather than a redesign.
- Friends: 1.6–2.0 head units, with species-specific ears/horns excluded from head measurement.
- Small enemies: 1.5–2.25 head units; larger enemies may reach 2.75 while retaining a broad, rounded center of mass.
- Hands, feet, tools, ears, and tails may be slightly oversized for action and species readability.

### 6.7 Silhouette, face, pose, and costume

- Every character or creature needs one unmistakable silhouette anchor: Ame's
  shoulder-brushing layered hair/cape/backpack, a friend's ears/tail, or an
  enemy's one defining prop/mass.
- A solid-black 64 px silhouette must remain identifiable within its family.
- Keep the face inside the central face-safe zone; no cage bar, weapon, hair ornament, or hand may cross both eyes.
- Eyes use a consistent highlight count and pupil logic. Brows must remain visible at field scale; mouths use simple shapes.
- Required expression sheet for principal characters: neutral, joy, determination, worry, surprise, sadness, relief, and annoyance.
- Poses communicate challenge through stance, direction, and clear gesture. Avoid pin-up posture, adultized anatomy, or costume emphasis inappropriate for children.
- Ame’s costume logic is practical adventure wear plus one magical identity layer: tunic, capelet, backpack, belt/pouch, sturdy boots, and one principal clasp. Additions must replace an existing ornament allocation rather than accumulate.

### 6.8 Ornament density and typography relationship

Ornament ceilings:

- Hero field sprite: 3 major identity anchors and no more than 5 micro accents.
- Friend: species silhouette, one neck/head accessory, one tiny motif maximum.
- Enemy: defining mass, one challenge accent, one environmental affiliation.
- Weapon: one primary motif, one gem/core, one ribbon or tassel maximum.
- Door/cage/portal: one central emblem, one repeated construction border, limited corner accents.
- Navigation icon: one literal subject and at most one small magical modifier.
- Panel/frame art: ornament belongs at corners and edges; the central content zone remains quiet.

Text is rendered by the application:

- Do not bake labels, letters, numbers, or faux type into reusable art.
- Leave defined copy-safe regions in story/key art.
- Static ornament must not mimic letterforms closely enough to read as accidental text.
- The runtime rounded humanist sans relationship remains: friendly, compact,
  and highly legible. `Fredoka` v2.001 is Plan 01's leading evaluation candidate
  for headings, controls, counters, arithmetic, and interaction feedback, not a
  shipped-font claim. Test real locally packaged weights, licence, layout,
  numerals, actual sizes, and bytes with `font-synthesis: none`; dense body copy
  may use a more legible companion. Art supplies a calm edge and colour context;
  it does not compete with text using equal detail or contrast.

### 6.9 UI icon rules

Keep four material layers distinct: cel-painterly world/content; opaque or
near-opaque cream paper, enamel, cloth, or restrained frosted-magic functional
surfaces; cream-cut semantic sticker signals; and rare transparent runtime
accents. “Paper-cut signals over magical surfaces over painted world” is the
relationship. Do not stack decorative glass behind dense copy or apply one
material treatment to everything.

- Author separate optical designs for 16, 24, 32, and 48 px. Do not call a mechanical downsample an optical variant.
- Subject occupies approximately 80% of the canvas, leaving about 10% on each side.
- Use one literal metaphor and a consistent view, stroke, corner radius, and detail level.
- A state uses at least two of shape, fill, outline, badge, pattern, or label. Colour is never the only channel.
- Modifier badge, when needed, stays in one documented corner and never exceeds 30% of the icon area.
- Semantic UI art uses the signal/sticker layer: one cream-white paper-cut edge
  surrounding the local-material inner contour. Keep in-world characters,
  items, terrain, and hazards in the painterly world layer; not every attractive
  object becomes a sticker.
- Validate at 1× on paper, dark plum, noisy terrain, grayscale, and every supported colour-vision simulation.
- Navigation-specific requirements: Home is a simplified roof/door; Mazes is a simple path; Book is an open book; Help is a question/spark rather than a lantern; Sound is a speaker/wave; Muted is the same speaker with a decisive slash; Restart is one circular arrow. Magical detail is a notch or four-point sparkle, not filigree.

## 7. Family production standards

### Character

- Ame’s approved identity sheet is the primary style anchor and includes field front three-quarter, side/back reference, height grid, neutral pose, expression row, hand/grip views, costume callouts, palette, visible bounds, and locked landmarks.
- Locked landmarks: Candidate C shoulder-brushing layered hair silhouette and
  forelock, eye shape/spacing, capelet length, backpack volume, tunic hem,
  belt/pouch position, boot height, and clasp.
- A weapon is a separate layer. A dedicated Ame-with-weapon render is not produced unless animation or occlusion cannot be solved with the documented grip system.
- Portrait/story versions may add brush richness but cannot invent accessories or change colour allocation.

### Friends

- Preserve the original fifteen species and every later Human-approved
  rescue-and-collect friend, with each identity's recognisable colour/accessory
  rules.
- Default to a shared three-quarter pose and baseline; use seated or standing only by an explicit species rule.
- One accessory per friend. Use heart only when the asset is specifically communicating bond/rescue.
- Eye, brow, nose, mouth, cheek, paw/hoof, and fur-group recipes come from one friend model sheet.
- Check every friend both free and behind every active cage at 40, 56, and 84 px.

### Enemies

- Rounded, squat core masses dominate. One or two angular cues may communicate challenge: brow angle, tool, shell, crystal, or stance.
- Visible pupils and a mischievous/competitive expression are required.
- No realistic wounds, exposed anatomy, needle-like teeth, oppressive horror light, or suffering.
- Larger Power is communicated by silhouette scale, material, posture, and controlled warning accents, not gore or hostility.
- Defeat-compatible edges should work with abstract stars, petals, puffs, or crystal dispersal; timing remains outside this plan.

### Weapons

- Every weapon has one clear functional silhouette before ornament.
- Family diagonal is lower-left to upper-right in catalogue art; held presentation uses recorded grip and angle, not a universal transform.
- Thin blades, strings, and ribbons must be at least 2 px at their smallest intended derivative.
- A weapon may use one motif, one gem/core, and one ribbon/tassel. Cupcake Mace and Moon Wand require the most simplification.
- Never aim a sharp weapon toward the viewer.

### Items and treasure

- One object, centered, no cast shadow, clear use silhouette.
- Potion reads by bottle/liquid; boots by paired footwear; Spring Boots by spring shape; antidote by medicine cue plus leaf, not leaf alone.
- Currency and science items use distinct outline and value profiles as well as colour.
- Wallet/inventory reuse receives a 24/32/48 px optical variant rather than the 384/512 master.

### Cages

- One shared front-frame geometry: consistent outer proportions, bar count, central face-safe bay, lock position, feet, and baseline.
- Material variants change surface construction, not frame anatomy.
- Minimum open bay around the face is 36% of canvas width and 32% of canvas height at the friend’s approved face zone.
- Bars remain visually solid at 40 px but do not exceed 8% of total canvas width each.
- Lock and one motif are the only high-chroma focal points.

### Locks and doors

- Store each key and door as one semantic pair with colour token, drawn motif, motif label, and glyph fallback.
- Key and door share exact motif geometry, gem cut, gold alloy, and hue.
- The key remains identifiable without colour; the door lock plate repeats that silhouette at a larger scale.
- Door structure is quieter than its central lock plate. Decorative scrolls cannot compete with the motif.

### Portals and goal

- Paired portals share one flower-pad geometry, top-down camera, ring width, central aperture, gem count, and value structure.
- Heart, clover, and moon are drawn shapes; text glyphs are fallback metadata only.
- The goal retains its upright star silhouette and is kept distinct from paired floor portals.
- The central aperture remains the highest-contrast region. Runtime glow may amplify it but cannot be required for recognition.

### Rewards and badges

- Large shelf art may keep embroidery, sticker edging, and celebratory richness.
- A small derivative keeps the central achievement symbol, outer shape, and one accent; remove wreath leaves, tiny stars, and secondary jewels first.
- Stickers, medals, and embroidered patches must retain different edge/material recipes.
- Locked art keeps its silhouette at 3:1 where essential; grayscale fading cannot make it disappear.

### Floors

- Broad, quiet, low-frequency material with no unique landmark more often than once per repeat.
- A 1024 repeat represents a documented number of tiles; stone/leaf size is calibrated against an 84 px tile before approval.
- Floor local contrast is lower than actors, interactables, and hazards.
- No directional highlight, spotlight, path arrow, or accidental face-like cluster.

### Walls

- Medium local contrast and a decisive boundary value against the paired floor.
- The texture should explain an impassable mass: denser clusters, darker joints, or larger constructed forms.
- Foliage walls render leaf clusters rather than every leaf. Crystal walls use decisive planar facets rather than rounded berries/pebbles.
- Every theme pair passes both the catalogue lightness rule and a live 6 × 6 screenshot review.

### Dressings

- Sparse, non-semantic, and subordinate. No dressing may resemble a key, hazard, reward, or navigation marker.
- Keep exact transparent edges and no baked cast shadow.
- Use a density map with quiet travel lanes; avoid the tile center where actors stand.
- Approve at final opacity in context, not as an isolated full-opacity image.

### Hazards

- Water: cyan value field, horizontal/elliptical ripple language.
- Lava: coral/orange field, directional S-flow and bright cores.
- Poison: violet field, spotted/bubble language with a secondary non-green cue.
- Hole: near-plum void, broken radial rim, high-value inner edge.
- Each differs from floor on hue, luminance, and pattern/edge shape. Runtime motion is supplementary.
- Every hazard is reviewed on every active floor and in reduced-motion, grayscale, and colour-vision simulations.

### Story art

- Story art uses the same identity, motif, palette, materials, and upper-left light, with richer backgrounds and 4.5–5.0-head character proportions.
- The new front-door background preserves an approved copy-safe region and 8%
  outer safety across its responsive crops. The historical title remains a
  rollback/comparison anchor, not the default final pixel authority.
- The transparent home/hero splash is a separate compositing asset with a
  declared focal subject, safe bounds, and contain-first policy. It must work on
  the existing combined title/home/menu surface without duplicating navigation.
- Story portraits use a consistent bust crop, medallion/background treatment, eye level, and edge strength.
- No baked UI or dialogue text.

### Navigation and brand icons

- Follow the optical rules in section 6.9.
- Preserve a tiny shared four-point sparkle or plum notch as family signature only when it survives 16 px.
- The app-icon direction is the Human-approved simplified Ame-face source from
  Batch 13, with golden-blonde hair and blue eyes preserved at actual size and
  at most one tiny guiding-star accent. Author distinct 16/32/64 px optical
  variants rather than shrinking the old galaxy-star art or a portrait.
- Keep the non-text brand mark separate from the exact `Maze so Puzzle`
  wordmark. Image-generated letterforms cannot become runtime authority; rebuild
  and review the exact lockup locally, preserve a semantic heading, and prove it
  at compact, desktop, iPad, and TV sizes.

## 8. Retain, refine, replace, and retire matrix

Definitions:

- **Retain:** approved concept and current pixels may ship; metadata/re-encoding is allowed.
- **Refine:** preserve identity and composition but repaint, simplify, normalize bounds, or author optical variants.
- **Replace rendering:** retain catalogue identity and gameplay meaning while producing a new master.
- **Retire:** unpublish and classify only after dependency, build, and rollback
  gates. Physical files go to Plan 12's archive-first, Human-confirmed process;
  Plan 03 never removes them.

| Family or subset | Decision | Priority | Rationale |
| --- | --- | --- | --- |
| Ame field identity | Retain + refine contract | P0/P1 | Strongest player anchor; needs model sheet, master status, bounds, and provenance before siblings |
| Ame portrait | Refine | P2 | Strong image but opaque PNG, no local master, and story-tier relation undocumented |
| ame-sword.png | Retire candidate | P3 | Current runtime composites Ame and selected weapon; declaration/test evidence suggests no presentation consumer |
| Original 15 friend identities plus every later Human-approved rescue-and-collect friend | Replace/refine rendering as individually approved; retain identities | P1 | Largest visible family break; later mythic/yokai/fantasy/Greek/Roman/unicorn approvals expand rather than replace the baseline roster |
| Goblin, Mushroom Imp, Acorn Knight | Retain anchors | P1 | Clear child-friendly challenge language |
| Cloud Gremlin, Pebble Golem, Blueberry Slime, Candy Mimic | Refine | P1 | Edge, menace/detail, gloss, and small-read issues |
| Seven newer weapons | Retain + optical/silhouette refine | P1 | Shared family works; fine ornament and grips do not |
| Star Sword | Refine/replace rendering | P1 | Too simple and stylistically earlier beside current weapons |
| Potion, Splash Boots, treasures | Retain + optical derivatives | P2 | Strong functional silhouettes |
| Spring Boots, Antidote Leaf, Science Gears | Refine | P1/P2 | Motif overload or environment/small-scale ambiguity |
| Storybook Wood cage | Replace rendering | P1 | Fails material identity and is too similar to gold cage |
| Other v5 cages | Refine | P1 | Functional structure; normalize bars, face zone, material, and bounds |
| Keys and doors | Retain + refine | P1 | Strong colour+shape redundancy; unify pair records and detail |
| Paired portals | Retain | P2 | Most cohesive derived-edit family |
| Goal | Retain + optical refine | P1/P2 | Clear finish silhouette; brand/reward overlap only at small scale |
| v2 rewards and v1 badges | Retain large + refine small | P1 | Strong shelf art, excessive icon-scale complexity and weight |
| First Star reward | Replace/refine rendering | P1 | Active legacy visual pass |
| Historical title background | Retain as rollback/comparison | P0/P1 | Strong holistic reference, but the Human has authorized a new early front-door background rather than treating these pixels as final |
| New title background, home/hero splash, and exact logo/wordmark | Produce, review, publish, then retain by default into Plan 11 | P0/P1 | Needed for the next coherent playable build; roles stay separable and must fit the existing combined title/home/menu surface |
| Poggle and Sprig | Retain + normalize story recipe | P2 | Polished but different edge/value treatment |
| Active floors | Retain concepts and technical derivatives; refine pixels | P2 | Seam-safe and playable, but material scale varies |
| Active walls | Retain concepts; refine pixels | P1/P2 | Hedge/bramble noise and ambiguous amethyst material |
| Dormant sandstone | Keep dormant; refine before use | P3 | Too light for several floors; explicitly inactive |
| Dressings | Retain + context refine | P3 | Technically clean and subordinate; density/resolution needs proof |
| Water/lava v2 | Replace masters, retain semantics | P1 | Exact mirror seams create obvious kaleidoscopic repetition |
| Poison | Refine into hazard family | P1 | Technically periodic but painterly recipe differs |
| Ground hole | Refine | P1 | Earth rim can merge with woodland floor and bound touches edge |
| Navigation family | Replace optical rendering, retain concepts | P0/P1 | Literal recognition at 16–32 px is a functional issue |
| App/favicons | Replace with approved simplified Ame-face direction and authored optical variants | P0/P1 | The Human rejected the generic guiding-star identity for the app icon; Ame must remain readable at 16/32/64 px |
| 16 certain superseded runtime files | Retire after gate | P3 | 4.49 MiB and no source references |
| Four declaration-only candidates and dormant sandstone | Prove/deprecate, then retire if safe | P3 | About 1.7 MiB combined; avoid assumptions based only on text search |

## 9. Canonical source and derivative contract

### 9.1 Master and runtime profiles

Original generator output is immutable. A normalized working master may be created non-destructively.

| Profile | Canonical working master | Runtime derivatives | Alpha | Intended use |
| --- | --- | --- | --- | --- |
| character-field | 2048 × 2048 RGBA | 256 and 512 WebP | Straight alpha | Board and presentation |
| friend-field | 1536 × 1536 RGBA | 256 and 512 WebP | Straight alpha | Board, cages, rescue presentation |
| enemy-field | 1536 × 1536 RGBA | 256 and 512 WebP | Straight alpha | Board and battle presentation |
| prop-field | 1536 × 1536 RGBA | 256 and 512 WebP | Straight alpha | Weapons, keys, items |
| structure-field | 2048 × 2048 RGBA | 256 and 512 WebP | Straight alpha | Doors, cages, goal, portals |
| reward-large | 1536 × 1536 RGBA | 256 WebP plus optical 48/64 | Straight alpha | Shelf/modal and compact reuse |
| navigation-optical | 1024 × 1024 design master plus hand-authored 16/24/32/48 optical masters at 4× | 16/24/32/48 lossless WebP or PNG after A/B | Straight alpha | Navigation and utility symbols |
| story-portrait | 1536 × 1536 RGB/RGBA | 256 and 512 lossy WebP | Opaque unless composition requires alpha | Story portrait |
| front-door/title-background | 3840 × 2160 RGB layered/lossless | responsive quality-tuned WebP sources selected from measured layouts | Opaque | Full-bleed combined title/home surface with recorded focal and copy-safe regions |
| front-door/hero-splash | Approved native composition, normally at least 2048 px on its long axis | 512/1024/1536 WebP as justified by rendered size and DPR | Straight alpha | Contain-first hero or ensemble composition over the title background |
| brand-lockup | Layered/lossless exact local reconstruction | approved compact and large WebP/PNG/SVG outputs | Straight alpha or opaque by consumer | Exact wordmark plus optional separable non-text mark; never accepted generated lettering |
| terrain-periodic | 2048 × 2048 RGB | 1024 PNG or lossless WebP after seam A/B | Opaque | Floor, wall, liquid hazard |
| dressing-periodic | 2048 × 2048 RGBA | 512 or 1024 lossless WebP/PNG based on proof | Straight alpha | Sparse multi-tile overlay |
| ground-overlay | 1536 × 1536 RGBA | 256 and 512 WebP | Straight alpha | Hole or floor-local overlay |
| app-icon | 1024 × 1024 RGBA/RGB | Platform-generated set plus authored 16/32/64 optical marks | Platform rule | Desktop/web/mobile identity |

Do not upscale a legacy runtime file and label it a source master. Mark it legacy-runtime-only until a genuine source is recovered or a replacement is approved.

### 9.2 Pivots, anchors, and safe zones

Coordinates are normalized from 0 to 1:

| Class | Pivot/contact | Safe zone | Required anchors |
| --- | --- | --- | --- |
| Grounded actor | (0.50, 0.90) | 8% left/right/top, 6% bottom | visibleBounds, faceBox, eyeLine, groundLine |
| Floating actor | (0.50, 0.84) | 10% all sides including hover envelope | visibleBounds, faceBox, floatCenter |
| Friend behind cage | (0.50, 0.90) | 10% sides/top, 6% bottom | faceBox must fit common open bay |
| Weapon | grip-specific | 8% around rotated extent | gripPoint, forwardAxis, heldScale, heldRotation, zOrder |
| Item/treasure | (0.50, 0.55) visual center | 10% all sides | visualCenter |
| Door/cage | (0.50, 0.94) | 6% all sides | baseLine, motifBox, face/open bay for cage |
| Portal/goal | (0.50, 0.82) for standing goal; (0.50, 0.50) for floor portal | 6% all sides plus glow envelope | apertureBox, motifBox |
| Ground hole | (0.50, 0.50) | 8% all sides | rimBox, voidBox |
| Icon | (0.50, 0.50) | 10% all sides | opticalBounds, optional modifierBox |

Values are initial production targets. The canary gate may adjust them once; after approval, changes require an art-recipe version bump.

### 9.3 Transparency and colour

- Masters are flattened lossless sRGB RGBA PNG with straight/unassociated alpha, alongside any layered editable source.
- Never ship a chroma-key background. Native transparency is preferred.
- If extraction is unavoidable, remove only edge-connected background, then review enclosed openings manually.
- Resample transparent images through an alpha-aware premultiplied path and return to straight alpha for delivery.
- Dilate subject RGB 2–4 runtime pixels beneath transparency to prevent bilinear fringe.
- Require an outer border of at least 2 fully transparent pixels in the runtime derivative and the profile safe margin inside that border.
- Reject white/dark/magenta matte, pinholes, semi-transparent dust, clipped flourishes, and a missing opaque core where the material should be solid.
- Test over white, black, mid-gray, saturated magenta/cyan, and representative busy terrain.
- Record ICC/sRGB handling. Current files mostly omit explicit colour chunks, so the new pipeline must normalize rather than silently inherit.

### 9.4 Filenames and versioning

Use lowercase ASCII kebab-case:

- Original output: family-id-vNN-original.ext
- Normalized working master: family-id-vNN-master.png
- Runtime derivative: family-id-vNN-profile-size.ext
- Source record: family-id-vNN-source.json

Examples:

- animal-fox-v02-master.png
- animal-fox-v02-field-256.webp
- animal-fox-v02-presentation-512.webp
- nav-help-v02-optical-24.webp

Rules:

- Catalogue ID is stable and separate from the pixel revision.
- Increase vNN whenever pixels or silhouette change. Encoder-only rebuilds increase a derivative revision in the source record without pretending the art changed.
- Never overwrite the preceding approved runtime asset.
- No spaces, machine paths, or generated-output UUIDs in runtime names.
- Generated-output IDs remain in provenance records.
- Keep the previous approved runtime revision available for one release; after
  rollback expiry, classify it and hand it to Plan 12 rather than physically
  removing it here.

### 9.5 Format and byte budgets

Initial budgets are gates, not permission to damage art:

| Derivative | Target encoded ceiling |
| --- | ---: |
| 256 px field cutout | 100 KiB |
| 512 px presentation cutout | 220 KiB |
| 1024 px presentation cutout | 480 KiB initial review ceiling |
| 1536 px presentation cutout | 700 KiB initial review ceiling |
| 16–48 px optical icon | 12 KiB |
| 128 px compact reward/badge | 45 KiB |
| 256 px reward/badge | 100 KiB |
| 256 px story portrait | 55 KiB |
| 512 px story portrait | 120 KiB |
| 1024 px periodic terrain | 650 KiB |
| 1920 × 1080 front-door/title art | 350 KiB initial review ceiling |

Use:

- Lossless or near-lossless WebP for cutouts and painted icons after alpha-edge comparison.
- Quality-tuned lossy WebP for opaque story art and portraits.
- PNG or lossless WebP for periodic textures; accept WebP only if decoded opposing edges and 5 × 5 visual repeats still pass.
- JPEG only for opaque full-bleed art when materially smaller and visually superior to the WebP candidate; never for alpha.

Decoded memory is always reported beside transfer bytes. A 512 RGBA image is about 1 MiB decoded; a 1024 image about 4 MiB; a 1920 × 1080 image about 7.9 MiB.

## 10. Catalogue and metadata plan

src/artCatalog.ts currently gives a general sprite only src and label. Terrain already models period, fallback, dominant colour, lightness, dressing, and render treatment; use that maturity as the pattern.

Runtime catalogue entry:

~~~ts
type ArtFamily =
  | "character" | "friend" | "enemy" | "weapon" | "item"
  | "cage" | "lock" | "portal" | "reward" | "terrain"
  | "dressing" | "hazard" | "story" | "navigation" | "brand";

interface RuntimeArtVariant {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly format: "png" | "webp" | "jpg";
  readonly usage: "optical" | "field" | "presentation";
  readonly minDisplayPx: number;
  readonly maxDisplayPx: number;
}

interface ArtGeometry {
  readonly pivot: readonly [number, number];
  readonly visibleBounds: readonly [number, number, number, number];
  readonly safeInset: readonly [number, number, number, number];
  readonly faceBox?: readonly [number, number, number, number];
  readonly gripPoint?: readonly [number, number];
  readonly forwardAxisDegrees?: number;
}

interface SpriteArt {
  readonly id: string;
  readonly family: ArtFamily;
  readonly label: string;
  readonly artVersion: number;
  readonly recipeVersion: string;
  readonly variants: readonly RuntimeArtVariant[];
  readonly geometry: ArtGeometry;
  readonly alphaMode: "opaque" | "straight";
  readonly view: "top-down" | "front" | "front-three-quarter";
  readonly lightProfile: "neutral-albedo" | "upper-left-soft" | "emissive";
  readonly castsRuntimeShadow: boolean;
  readonly motifToken?: string;
  readonly paletteToken?: string;
  readonly sourceRecordId: string;
}
~~~

Only metadata used by rendering or runtime assertions belongs in the TypeScript bundle. The heavier production record remains under docs/source-assets.

Specific model changes:

- Replace parallel KEY_ART and DOOR_ART authority with one lock-pair record containing key, door, colour token, motif token, human label, and drawn-glyph reference.
- Keep a compatibility resolver during migration.
- Give hazards terrain-equivalent period, fallback colour, measured luminance, pattern cue, and reduced-motion cue.
- Add optical variants to navigation, reward, treasure, and inventory art.
- Add grounded/floating class, baseline, face box, and grip metadata where applicable.
- Add derivative usage, authored-optical-versus-derived status, measured display
  range/DPR intent, focal point, copy-safe rectangle, and explicit
  `contain`/approved-crop policy where a front-door or presentation consumer
  needs them. Add nine-slice metadata only if a reviewed raster frame genuinely
  needs it; Plan 01's code-native surfaces remain the default.
- Classify `title-*`, `home-splash-*`, `logo-*`, and `brand-*` sources explicitly
  in the shared pipeline and loading phases; never let the default filename
  branch misclassify them as ordinary items.
- Require aspect-matched sources or a recorded crop/contain operation. A builder
  must not force opaque art into arbitrary width and height and distort it.
- Make active, dormant, deprecated, and legacy-runtime-only status explicit.
- Keep preload intent in src/assets.ts; choose only the derivative needed for the consuming context and do not preload both 256 and 512 versions.
- Select runtime renditions from actual rendered CSS size × effective DPR with
  deterministic non-overlapping boundaries and fallback. One contextual request
  must never warm the whole presentation catalogue.

The planning draft originally proposed a compact `status`/`original` JSON
sketch. Do not copy it: implementation replaced it with the stricter current
contract in `docs/source-assets/schema/art-source.schema.json`. Start from that
schema and use `docs/source-assets/records/ame-v02-source.json` only as a
historical provenance/geometry example. It remains schema v1 because its
approved identity was generated under `mgjrpg-01`; every new `mgjrpg-02`
candidate or production record must use schema v2 / `strict-v2`, family-correct
treatment fields, closed ordered roles and authority kinds, and direct
non-edit-of-edit lineage. Replace every asset fact with measured evidence.
Runtime, source, design, runtime-publish, rights,
derivative, and rollback states remain independent. `npm run art:check` must
validate the finished record before it can enter a review packet.

## 11. Source-master, provenance, and derivative workflow

### 11.1 Authority

- Immutable original output plus exact source record is historical evidence.
- Approved normalized master is pixel authority.
- Family DNA card and art-recipe version are style authority.
- artCatalog.ts is runtime selection authority.
- docs/source-assets/manifest.json is generated inventory and hash index, not a second hand-edited source of truth.
- docs/AI_ASSET_PROMPTS.md remains the human-readable recipe/history index. Migrate exact historical prompts without rewriting them, and link each new entry to its source record.

For missing originals:

- The known active set is ame.png, ame-portrait.png, animal-bunny.png, animal-fox.png, animal-kitten.png, goblin.png, sword.png, potion.png, boots.png, star-key.png, star-door.png, goal.png, coin-pouch.png, water-v2.png, lava-v2.png, and reward-trail-sticker.png.
- Search existing retained generation outputs and backups without changing files.
- If not found, record status legacy-runtime-only, the known prompt/ID, current runtime hash, and uncertainty.
- Do not invent a model, seed, date, reference, or source hash.
- Use the current runtime art only as a visible identity reference for a future replacement.

### 11.2 Preventing one-off drift

No production asset enters public/assets unless it has:

1. A stable catalogue ID and family.
2. An approved family DNA card.
3. An approved anchor/model sheet.
4. An art-recipe version.
5. Exact prompt and reference roles/hashes.
6. A source record and immutable original.
7. A normalized master with geometry anchors.
8. Generated derivatives from a named encoder recipe.
9. Contact-sheet and live-game review.
10. Explicit status and reviewer.

Global recipe changes first run on a canary set:

- Ame Candidate C as the immutable identity/reference anchor.
- Fox and Alpaca.
- Goblin and Jelly Sorcerer.
- Moon Wand.
- Rose Heart lock/key token, door, and portal.
- First Star reward.
- Sunny Stone floor/wall and Wishing Woods floor/hedge.
- Home and Help icons.
- Water, lava, and poison.

If a canary change improves one family but shifts identity, edge, material, or motif elsewhere, reject the global change and make a family-specific recipe.

The art-director's pre-`v11` recommendation slate, retained as historical
decision context, was:

- **Retain current pixels:** Candidate C identity/construction source, Fox, Goblin,
  and the 512 px First Star shelf art.
- **Refine without geometry/identity drift:** Jelly Sorcerer; Rose Heart door
  and portal; Sunny Stone; poison; and authored
  64/48/32 px First Star optical siblings.
- **Replace rendering while locking semantics/construction:** Alpaca; Moon Wand;
  Rose Heart key optical art; Home and Help optical icons; Wishing Woods floor
  and hedge; water and lava periodic
  masters.

This slate was comparison guidance, not production authorization. The Human's
subsequent `v11` review supersedes it where the two differ:

- **Ame:** prefer Direction B's rendering. Because its accumulated edit texture
  is visible at source size, test a genuinely fresh base that preserves
  Candidate C exactly; if the fresh base is worse, retain the prior Direction B
  candidate. Candidate C's face, age, golden-blonde shoulder-length hair, blue
  eyes, proportions, costume, backpack, silhouette, registration, and emotional
  identity are not reopened.
- **Core sampler:** use Direction A, except use Direction C for the traditional
  JRPG slime, sword lizard man, and green-tea-drinking skeleton.
- **Current-family transfer:** Direction A is acceptable now for its chunky
  clarity, strong chroma, and material-local contours; future production may
  borrow a restrained amount of Direction B's colour and shading without
  softening A's large masses or line clarity.
- **Future-enemy extension:** retain Direction B's concepts, except Direction A
  for the wholesome succubus, but do not use any existing extension sheet as a
  volume style authority. Re-author that roster using the current-family A
  construction/contour grammar with only the approved B colour-and-shading
  influence.
- **Portals:** retain the existing top-down flower-petal floor-pad category. Do
  not replace paired teleporters with upright portal-door silhouettes.

The bounded `v14` response packet at
`artifacts/art-proofs/mgjrpg-02/v14/` is source-only evidence for that narrowed
recipe. Its two independent fresh Ame studies both drift Candidate C's locked
construction; the art-direction recommendation is therefore to fall back to the
prior Direction B Ame candidate, pending explicit Human confirmation. Its
future-enemy hybrid is direction evidence pending simplification, and its
flower-pad hybrid confirms the retained portal category while still requiring a
quieter, shallower, cleaner production pass. None is a production master. A
retained asset is not regenerated merely to acquire an `mgjrpg-02` label.

Every canary row receives a 1–5 score for small-size recognition/silhouette;
two-to-four large colour masses and three-value grouping; focal hierarchy;
colour-aware contour continuity, locality, and contrast; material truth and
surface-detail frequency; Maze palette/motif discipline; face/expression
preservation where applicable; family coherence; alpha quality/edge
contamination; terrain repetition/seams where applicable; and grayscale plus
colour-vision-independent readability. `5` is release-anchor quality, `4` passes,
`3` is a bounded refine/conditional result, and `1–2` fails for volume use.
Identity, alpha, seam, and minimum-size recognition are hard gates, not averages;
an attractive source-size image cannot compensate for one of those failures.

Show the truthful immutable/native source view for both sides wherever a new
generator original exists, then compare `mgjrpg-01` and proposed `mgjrpg-02` at
every actual use for that family: 512/256 plus 40/56/64/84 for actor cutouts;
the recorded 56/64/77/84/103 Ame contexts; 16/24/32/48 for navigation; 32/48/64
for First Star; the catalogue sizes for locks/doors/portal/weapons; and
1x/3x3/5x5 at represented world scale for terrain/hazards. A legacy 512 px
runtime image may be shown at native size but is never upscaled and relabelled as
a source master. Close contour crops cover light, dark, middle, saturated, and
representative in-game backgrounds.

Record exact encoded bytes, dimensions and decoded RGBA upper bound rather than
scoring them aesthetically. For Web, Tauri, iPad, and TV, report expected
transfer, decode/residency, filtering/edge, and composition impact as
improved/neutral/regressed with evidence and confidence. A proposed treatment
must not reduce a passing `mgjrpg-01` anchor merely to make it look newer.

Candidate/reference discipline for all work after the approved Ame v02 study:

- Keep a rendering/family anchor and subject identity anchor as separate,
  explicitly labelled references. One source may fill both roles only when that
  is stated and justified.
- A fresh identity-bearing asset receives exactly two independent candidates
  from the same locked brief and equivalent pinned references. Neither candidate
  may use or see the other.
- Preserve both candidates and record the exact Human selection, rejection, or
  bounded correction request. If both fail the same requirement, revise the
  brief instead of generating indefinitely. One objective-defect correction is
  allowed before returning to the brief/Human gate.
- An approved identity's pose, expression, or state starts from the selected
  identity source plus the family rendering anchor. Never make an edit-of-edit
  chain from an expressive state, cleaned cutout, correction, runtime
  derivative, or rejected candidate.
- The completed A/B/C Ame exploration remains truthful historical evidence and
  is not relabelled or invalidated by this forward-looking two-candidate rule.

### 11.3 Pipeline consolidation

The release-number scripts preserve useful history but are not a reusable pipeline. In particular:

- process_v12_assets.py, process_v13_story_assets.py, and process_v15_sprite_variety.py depend on hard-coded C:\Users\hellb generated-image folders.
- v15, v16, v17, and v18 repeat slightly different background extraction logic.
- Only terrain and dressing processors have a non-writing check mode.
- Several early core assets have neither a retained processor nor a straightforward source counterpart.

Create:

- scripts/art_pipeline.py — manifest-driven entry point; non-writing --check by default, explicit --build required.
- scripts/art_pipeline/cutout.py — connected-background removal, premultiplied resize, colour dilation, alpha normalization.
- scripts/art_pipeline/periodic.py — retain the current Poisson method and seam metrics.
- scripts/art_pipeline/encode.py — deterministic PNG/WebP/JPEG profiles with encoder version capture.
- scripts/art_pipeline/validate.py — schema, existence, hash, dimensions, colour, alpha, bounds, anchor, budget, duplicate, and pairing checks.
- scripts/art_pipeline/proofs.py — contact sheets and size/context proofs written to ignored temporary output.
- scripts/art_pipeline/migrate_legacy.py — one-time non-destructive metadata migration; never guesses missing facts.

Retain old scripts as historical wrappers until parity is proven. Mark them deprecated; do not delete or silently repoint them during the first implementation phase.

Add package scripts:

- art:check — non-writing validation.
- art:proof — historical Candidate-C proof sheets and screenshot fixture setup.
- art:proof:mgjrpg02 — deterministic consolidated rendering comparison packet.
- art:build -- explicit mutation for named IDs only.

### 11.4 Validation expectations

Automated:

- Catalogue and manifest IDs are unique and cross-resolve.
- Runtime/source files exist; untracked generated files are never selected.
- Encoded width, height, format, mode, sRGB treatment, and bytes match records.
- SHA-256 links original, master, and each derivative.
- Alpha extrema, opaque-core expectation, two-pixel clear border, connected dust, and under-alpha fringe colour pass.
- visibleBounds and safe inset pass; anchors fall inside visible content.
- Grounded family baselines and face boxes stay within approved tolerance.
- Weapon grip and rotated extent remain in bounds.
- Lock pair shares motif/colour tokens and has distinct non-colour silhouettes.
- Periodic assets pass numerical seam/local-detail thresholds and 3 × 3/5 × 5 repeat generation.
- Runtime files do not duplicate hashes under different active IDs without an intentional alias.
- Byte and decoded-memory budgets pass or cite an approved exception.
- Deprecated files cannot return to an active catalogue by fallback.

Generated proof sheets:

- All actors at 64 and 84 px on paper, dark plum, and each representative terrain.
- Friends at 40/56/84 px behind all four cages.
- Every weapon held by Ame at field and presentation scale.
- Icons at 16/24/32/48 px in normal, selected, locked, and disabled states.
- Rewards at 32/48/64/256 px in colour and grayscale.
- Each floor/wall/hazard at 1× and in 5 × 5 repeats.
- Alpha fringe board on white, black, mid-gray, magenta, cyan, and noisy terrain.

Human:

- Art-direction review.
- Accessibility review including simulations and target-user testing.
- Live browser screenshots at 960 × 540, 1280 × 720, 844 × 390 landscape, and the supported large-stage view.
- No approval from full-size source art alone.

## 12. Reusable ImageGen templates

### 12.1 Locked world header

The block below is the original `mgjrpg-01` planning template and remains
historical recipe evidence. Do not silently modify a source record that used it.

~~~text
[ORIGINAL WORLD]
An original child-friendly magical-girl storybook JRPG world.
No named or recognizable franchise, character, costume, logo, composition,
or living-artist imitation.

[WORLD RECIPE — LOCKED]
Pocket-sized courage made visible. Chunky rounded silhouettes; tactile pastel
paint; deep-plum outer edges; three grouped values; soft upper-left/front light;
matte cloth and fur; one controlled highlight per hard material.
Motif semantics are fixed. Use exactly one primary motif and no more than one
supporting motif. No decorative motif soup.

[ASSET AND FUNCTION]
Catalogue ID: {id}
Family: {family}
Gameplay function and emotional read: {function}

[SILHOUETTE AND PROPORTIONS]
{approved family ratio, mass distribution, silhouette anchor, pose, facing}

[CAMERA AND GEOMETRY]
{view and elevation}
Content safe zone: {insets}
Pivot/contact: {coordinates}
Locked anchors: {face, grip, motif, baseline}

[MATERIAL AND PALETTE]
{approved tokens and material recipe}

[DELIVERY INTENT]
One isolated subject; no cast shadow; no text; no frame; clean transparent
background requested. Master will be normalized and validated separately.

[CONSISTENCY REFERENCES]
Image 1: {role and exact locked features}
Image 2: {role and exact locked features}
Do not redesign the references. Preserve every listed invariant.

[EXCLUDE]
No extra subjects, limbs, props, motifs, text, signature, watermark, horror,
gore, sexualization, photorealism, hard 3D/plastic finish, baked spotlight,
white/magenta/dark matte fringe, or unapproved costume/accessory.
~~~

### 12.1a Proposed `mgjrpg-02` production calibration

Use this Maze-native block for the pre-volume canary packet. It becomes broad
production authority only after the consolidated canary review is approved.
The PPBA project name and assets do not enter this prompt.

~~~text
[ORIGINAL WORLD]
An original child-friendly magical-girl storybook maze JRPG about pocket-sized
courage, friendship, noticing, trying again, and warm funny adventure. Do not
imitate any named franchise, living artist, recognizable character, costume,
logo, prop, composition, interface, or other project's trade dress.

[MAZE STORYBOOK-CHUNKY RECIPE — MGJRPG-02 CANARY]
Clean expressive anime face; rounded compact/chibi construction; one unmistakable
silhouette anchor; two to four large colour masses readable at the named minimum
size; local midtone, one broad grouped shadow, and one broad light mass. Use
tactile restrained cel-painterly texture, materially truthful surfaces, broad
locks/folds/tufts/clusters, and only highlights that explain material. Reject
airbrushed micro-gradients, plastic 3D gloss, photographic noise, vector-flat
drift, and equally sharp detail everywhere.

[CONTOUR — STORYBOOK-LOCAL-CONTOUR-V1]
Use a solid continuous contour whose hue and value follow the adjacent material
while staying harmonized toward warm deep plum: aubergine for lavender, warm
russet-plum for coral/leather/gold, blue-plum for cool materials, and leaf-plum
for foliage. Reserve the darkest plum for pupils, mouth, deep occlusion, and
critical separation. No pure black uniform perimeter, rainbow edging, broken
outline, white field-sprite halo, or semitransparent contour fragments.

[FOCAL AND MOTIF HIERARCHY]
Give the face, required interaction, or narrative subject the strongest useful
contrast and chroma. Supporting areas remain quiet. Use exactly one primary
Maze motif and no more than one supporting motif from the asset's approved DNA
card. No jewel, ribbon, sparkle, filigree, or texture soup.

[ASSET AND FUNCTION]
Catalogue ID: {id}
Family: {family}
Gameplay function and emotional read: {function}
Minimum display size and required first read: {size and read}

[IDENTITY AND RENDERING REFERENCES]
Identity reference: {exact approved source, immutable features, hash, role}
Rendering/family reference: {exact approved source, rendering features, hash, role}
Change only: {one declared variable}

[CAMERA, GEOMETRY, AND DELIVERY]
{approved view, proportions, pose/facing, safe zone, pivot, baseline, face/grip/
motif anchors, alpha intent, and profile}. One isolated subject; no cast shadow,
floor, scenery, broad glow, text, numeral, frame, signature, or watermark.
Runtime will own contact/cast shadow and external magic effects.

[EXCLUDE]
No extra subject, limb, prop, accessory, motif, mature anatomy, glamour pose,
horror, gore, cruelty, copied design, generated lettering, fake logo, baked
spotlight, matte fringe, checker residue, chroma contamination, or detail that
vanishes at the stated minimum size.
~~~

### 12.2 Character/friend/enemy template

~~~text
For the calibration packet, pair this family template with the proposed
`mgjrpg-02` canary header. Outside that packet, continue using approved
`mgjrpg-01` until the Human gate; after it, use the recorded winning recipe.
Asset type: {field character | animal friend | friendly opponent}
Primary request: {identity and action}
Proportions: {heads tall}; face stays inside {faceBox}; hands/feet/paws readable.
Silhouette anchor: {one anchor}.
Expression: {clear emotion}; pupils visible; brows readable at 64 px.
Accessory allocation: {one accessory or none}.
Challenge language for enemy only: one or two controlled angular cues,
otherwise rounded and low-menace.
Invariants: preserve {identity list}; change only {single requested change}.
~~~

### 12.3 Prop, lock, cage, portal, reward, and icon template

~~~text
For the calibration packet, pair this family template with the proposed
`mgjrpg-02` canary header. Outside that packet, continue using approved
`mgjrpg-01` until the Human gate; after it, use the recorded winning recipe.
Asset type: {weapon | item | lock pair | cage front | portal | reward | icon}
Primary functional silhouette: {shape before ornament}.
Construction: {shared family geometry and material}.
Primary motif: {one motif}; supporting motif: {zero or one}.
Optical target: {16/24/32/48/64/84/256 px}.
Required anchors/openings: {grip, face-safe bay, aperture, motif box}.
Remove any detail that becomes sub-pixel at the optical target.
For a family variant, change only material, approved palette, and primary motif;
preserve geometry, perspective, light, bounds, and line recipe.
~~~

### 12.4 Periodic environment template

~~~text
For the calibration packet, pair this family template with the proposed
`mgjrpg-02` canary header. Outside that packet, continue using approved
`mgjrpg-01` until the Human gate; after it, use the recorded winning recipe.
Asset type: seamless top-down periodic {floor | wall | hazard | dressing}.
Material: {family recipe}; represented scale: {tiles per repeat}.
Hierarchy: broad quiet masses; local contrast below actors/interactables.
Pattern cue: {large readable cue}; landmark density: {ceiling}.
Lighting: neutral diffuse/albedo; no directional cast shadows or spotlight.
Opposing edges must describe continuous material, but avoid mirror,
kaleidoscope, cross-band, or obvious central symmetry.
No characters, faces, items, arrows, letters, borders, frames, or watermark.
The deterministic periodic processor remains responsible for final wrapping.
~~~

### 12.5 Story-art template

~~~text
For the calibration packet, pair this family template with the proposed
`mgjrpg-02` canary header. Outside that packet, continue using approved
`mgjrpg-01` until the Human gate; after it, use the recorded winning recipe.
Asset type: {16:9 key art | square story portrait}.
Narrative beat and emotion: {beat}.
Identity invariants: {face, silhouette, costume, proportions tier}.
Composition: {focal placement}; copy-safe region: {rectangle}; safe outer margin.
Perspective and light: cinematic but consistent with upper-left/front world light.
Materials and motifs: use the same family recipes as field art.
No text, logo, UI, signature, watermark, recognizable franchise reference,
or extra story element.
~~~

### 12.6 Iteration protocol

- Start from an approved identity anchor plus the appropriate rendering/family
  anchor, not a text-only reroll or edit-of-edit chain.
- Label every reference by one role: identity, rendering/style, material,
  composition, or edit target.
- One iteration changes one concern. Repeat all invariants every time.
- Compare new versus approved for face geometry, silhouette, costume, palette, bounds, motif count, and perspective before judging polish.
- If the model changes an invariant, reject or repair from the last approved image; do not promote the drift as a new design.
- A family variant is generated as a constrained edit of the anchor when possible, not as an independent prompt.
- A genuinely new identity follows the exactly-two-independent-candidate and
  one-bounded-correction rule in section 11.2.
- Prompts never name a copyrighted character, costume, logo, composition, franchise, or living artist.

## 13. Cross-discipline coordination

### 13.1 Lighting handoff

Art supplies:

- lightProfile, painted-light direction, shadow policy, emissive regions, and neutral-albedo statement.
- A light-neutral and dark-neutral proof for every cutout/material.
- Terrain without baked directional illumination.

Lighting owner validates:

- Runtime light disabled, default, and strongest supported states.
- No opposing highlight direction, double shadow, clipped glow, or loss of hazard meaning.
- Wall geometry/highlight remains consistent with the paint.

This plan does not change the level light vector or wall-lighting implementation.

### 13.2 Animation handoff

Art supplies:

- Model sheet, exact canvas, visible bounds, pivot/contact, eye line, face box, grip, weapon axis, layer order, and secondary-motion envelope.
- Locked landmark overlays for every planned frame.
- Explicit allowed squash/stretch exceptions.

Animation owner supplies state list and timing. Frame review rejects:

- eye-line drift, face-width drift, changing boot/hand scale, costume accessories appearing/disappearing, unapproved hue shift, baseline jitter, clipped hair/ribbon, or weapon/grip separation.

This plan does not add animation states or timing.

### 13.3 Performance handoff

- Phase 0 records active transfer, decoded working set, request count, and context display sizes.
- The initial target is at least 25% lower active still-image encoded weight without increasing the six-tile decoded working set. Any family increasing bytes by more than 5% needs a visible-quality exception.
- Do not preload both field and presentation derivatives. src/assets.ts remains level-selective and context-selective.
- Use 2× the largest normal display as the default raster ceiling; justify more with zoom/presentation evidence.
- Compare cold title, first maze, reward shelf, and late-game three-friend/five-friend scenes.
- Record proven-dead files as Plan-12 candidates after catalogue/build proof;
  Plan 03 does not move or remove them.

## 14. Execution phases and review gates

### Phase 0 — freeze and evidence

Affected files proposed:

- New docs/ART_BIBLE.md.
- New docs/source-assets/schema/art-source.schema.json.
- New docs/source-assets/manifest.json, generated from source records.
- New ignored proof directory convention, not committed.
- No runtime asset changes.

Work:

- Hash and classify all 125 runtime images and 104 source images.
- Mark active, dormant, deprecated, superseded, and legacy-runtime-only.
- Capture golden screens for title, all 16 tester mazes, story, book, rewards, and compact/large viewports.
- Record actual CSS display ranges and current load/decoded baselines.

Gate G0:

- Every catalogue ID and direct ASSETS entry resolves to a status.
- Missing-master uncertainty is recorded without invented facts.
- Current runtime screenshots and current hashes are reproducible.

### Phase 1 — system foundation and canaries

Affected files proposed:

- src/artCatalog.ts and src/artCatalog.test.ts.
- src/assets.ts and src/assets.test.ts.
- docs/ART_BIBLE.md.
- docs/AI_ASSET_PROMPTS.md.
- docs/source-assets/** source records, schema, and manifest.
- New scripts/art_pipeline/** and package.json commands.
- Existing scripts remain intact except for documented wrapper/deprecation work in a later sub-change.

Work:

- Approve art bible, family DNA cards, colour/motif tokens, geometry contract, and naming.
- Migrate provenance for canary assets.
- Add non-writing validator and proof generator.
- Extend the source schema/pipeline with front-door classification, responsive
  focal/copy-safe/crop metadata, aspect-safe derivative operations, and explicit
  usage/display intent before publishing the authorized title/home/logo set.
- Reconcile the PPBA-informed adopt/adapt/reject record, create the consolidated
  `mgjrpg-01` versus proposed `mgjrpg-02` canary packet, and decide whether the
  plum-rooted local-material contour is a global or family-specific rule.
- Create no broad family replacements until canaries pass.

Gate G1:

- Canary set passes 40/56/64/84 px actor/friend, 16/24/32/48 px icon,
  two-to-four large-mass, contour continuity/locality, three-value, focal
  hierarchy, surface-frequency, material, alpha, bounds, grip, seam, palette,
  grayscale/CVD, provenance, and unchanged-retained-anchor checks.
- The Human reviews the consolidated packet and approves, narrows, or rejects
  `mgjrpg-02` before any broad replacement batch. Candidate C remains the
  identity anchor even if the surface-treatment experiment is rejected.
- Art director, accessibility reviewer, animation owner, lighting owner, and performance owner sign their respective handoff.
- Historical rejected post-process evidence remains at
  `artifacts/art-proofs/mgjrpg-02/v08/`; the Human-reviewed A/B/C narrowing
  packet remains at `artifacts/art-proofs/mgjrpg-02/v11/`. The current ignored
  bounded-response packet is `artifacts/art-proofs/mgjrpg-02/v14/`. It compares
  Candidate C, the prior preferred Direction B Ame, and two independently
  generated fresh bases at 155/103/84/77/64/56/40 px, in contour/background
  crops, and as full sprites at 103/77/56/40 px across five backgrounds; it also
  records the proposed future-enemy hybrid and retained flower-floor-pad portal
  category. Exact v03 prompts, ordered reference roles,
  immutable generator originals, hashes, measurements, and run records are
  tracked under `docs/source-assets/calibrations/mgjrpg-02/v03/`.
- The `v14` evidence remains `pending-human`. Both fresh Ame attempts drift the
  approved Candidate C construction, so the recommended gate outcome is the
  prior Direction B fallback. The enemy hybrid is recipe evidence pending
  simplification, and the flower-pad hybrid is category evidence rather than an
  approved master. Composite cells are never masters; opaque RGB boards do not
  pass production alpha or periodic-seam QA.
- All `v08`, `v11`, `v12`, `v13`, and `v14` source-only calibration evidence adds zero
  `public/` bytes and zero runtime decoded-image residency; any future runtime
  delta requires its own Plan 07A allocation.

### Phase 2 — P0/P1 semantic and optical pass

Affected files proposed:

- public/assets navigation/app-icon optical revisions.
- Hazard masters and runtime derivatives.
- src/artCatalog.ts, src/assets.ts, relevant tests.
- docs/source-assets records and docs/AI_ASSET_PROMPTS.md.
- src-tauri/icons/**, public/favicon-64.png, public/apple-touch-icon.png only after brand optical approval.

Work:

- Redraw navigation optical family including distinct Sound and Muted.
- Produce app/favicon optical marks.
- Replace water/lava periodic masters, harmonize poison, and refine hole rim.
- Add hazard metadata and reduced-motion proofs.

Gate G2:

- All icons pass literal recognition at intended size.
- Hazards differ from floor and one another on hue, luminance, and pattern/edge in colour, grayscale, and simulations.
- Current gameplay mechanics and layout are unchanged.
- Cold-start and first-level preload do not regress.

### Phase 3 — character, friends, cages, enemies, and weapons

Affected files proposed:

- docs/source-assets model sheets and family source records.
- public/assets versioned character/friend/cage/enemy/weapon derivatives.
- src/artCatalog.ts, src/assets.ts, relevant tests.
- No animation-state implementation.

Work:

- Approve Ame model sheet without redesigning her.
- Rerender and publish the complete execution-time Human-approved friend
  catalogue; the original fifteen are a baseline, not a cap.
- Replace Storybook Wood cage and normalize all cage fronts.
- Refine selected enemy outliers.
- Normalize Star Sword, weapon silhouettes, and all grips.

Gate G3:

- All friends pass free/caged 40/56/84 px sheets.
- No bar or lock crosses both eyes.
- Actors share baseline and size band.
- Every weapon meets Ame’s recorded hand at field and presentation scale without crop.
- Child-friendly challenge review passes.

### Phase 4 — environment and structure normalization

Affected files proposed:

- Versioned floor, wall, dressing, key, door, portal, and goal masters/derivatives.
- src/artCatalog.ts and terrain tests.
- scripts/art_pipeline periodic and proof modules.

Work:

- Normalize material scale, frequency, value bands, and wall solidity.
- Redesign amethyst facets and reduce hedge/bramble microcontrast.
- Keep sandstone dormant until it passes.
- Normalize lock pairs and portal processing.
- Review dressings at final opacity.

Gate G4:

- Every theme passes numerical wrapping plus 5 × 5 repeat review.
- Player, friend, enemy, key, door, and hazard remain dominant where intended.
- Painted/runtime light agree.
- No dormant or deprecated asset becomes active accidentally.

### Phase 5 — rewards, portraits, story, and optimization

Affected files proposed:

- Versioned reward/badge/treasure/story and contextual presentation derivatives.
- ame portrait source/derivative.
- Human-authorized responsive title background, transparent home/hero splash,
  separable brand mark, and exact reconstructed `Maze so Puzzle` wordmark.
- src/artCatalog.ts, src/assets.ts, preload tests.

Work:

- Author reward/badge optical variants and harmonize First Star.
- Right-size treasure and Science Gears.
- Convert Ame portrait to an approved WebP profile after A/B.
- Normalize Poggle/Sprig/story portrait recipe without gratuitous regeneration.
- Publish the approved early front-door set through distinct semantic catalogue
  identities with focal/copy-safe/crop metadata, deterministic fallback, and
  rollback. Compose nothing into one irreversible baked screen.
- Produce only the presentation renditions justified by named runtime contexts;
  field and presentation resolution selection remains context-specific.

Gate G5:

- Reward identity survives 32/48/64 px and grayscale.
- Story and front-door identity match model sheets while preserving the title’s
  warmth, exact wordmark spelling, responsive copy-safe space, and readable
  focal hierarchy.
- Actual-size proofs cover title/home composition bands and every named large-art
  context. No proof or preload fetches the whole presentation catalogue.
- Active still-image bytes are at least 25% below G0 or every exception is reviewed.

### Phase 6 — deprecation, release, and Plan-12 handoff

Affected files proposed:

- lifecycle records for individually proven superseded `public/assets` files;
  no physical archive or removal in this plan.
- Historical processor documentation/wrappers.
- docs/source-assets manifest/status.
- docs/RELEASE_CHECKLIST.md and tests.

Work:

- Ship new catalogue pointers while retaining preceding runtime files for one release.
- Compare telemetry/performance and target-user review.
- After rollback expiry, record exact hashes, replacements, consumers and restore
  requirements for proven candidates and hand them to Plan 12's non-runtime
  archive → Human external-backup confirmation → separately authorized
  repository-removal workflow.
- Preserve original masters, prompts, source records, and Git history.

Gate G6:

- npm test, npm run build, art:check, visual regression, supported-device checks, and manual review pass.
- No broken cache path, missing preload, transparent fringe, seam, or visual-semantic regression.
- Rollback pointer and old files are verified before Plan-12 handoff.

## 15. Visual acceptance criteria

An asset/family is accepted only when:

- It matches the north star and its family DNA card without a named-franchise or living-artist reference.
- It remains identifiable as a solid 64 px silhouette, resolves into two to four
  large colour masses, and has one clear focal hierarchy; navigation remains
  literal at 16/24/32 px.
- In a five-second recognition check, at least 4 of 5 reviewers identify the intended object/action without a label. Target-age playtesting with a guardian is required before final release claims.
- Every friend species is distinguishable at 40 px and retains face/emotion behind every cage.
- Every key matches its door by shape in grayscale.
- Every hazard is distinguishable from safe floor and other hazards in still/reduced-motion presentation.
- Essential boundaries meet the internal 3:1 target; normal and large text retain 4.5:1 and 3:1 respectively in the consuming UI.
- Outer/internal contour continuity and material locality, three-value shading,
  surface frequency, material, camera, motif count, and upper-left form light
  match the approved recipe.
- visibleBounds, safe zones, baseline, pivot, face box, and grip checks pass.
- No visible halo or matte appears at 1×; 400% inspection shows no contamination, holes, dust, or hard clip.
- Periodic art passes numerical edges and 3 × 3/5 × 5 perceptual repeat review.
- File and decoded-memory budgets pass or have an explicit reviewed exception.
- Exact prompt, generator/model/version if available, date, reference roles/hashes, human edits, rights notes, reviewer, and derivative hashes are present.
- Live screenshots pass at 960 × 540, 1280 × 720, 844 × 390, and supported large-stage presentation.
- Approval is based on the runtime derivative in the actual game, never only the source master.
- Front-door art preserves approved focal subjects, copy-safe space, and
  readable exact branding across compact, iPad, desktop, and TV layouts; no
  unreviewed generated lettering ships.
- Each named large-art UI context resolves one appropriate `presentation`
  rendition with stable geometry and a deterministic missing/decode-failed
  fallback rather than requesting the full catalogue.

## 16. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| AI iteration changes identity while appearing more polished | Locked landmark list, one-change edits, previous-approved comparison, and rejection on invariant drift |
| Reference prompt becomes too close to copyrighted work | Original-world clause; genre principles only; no named character, costume, logo, composition, franchise, or living artist |
| Over-standardization removes personality | Lock family construction, not identical poses; preserve one silhouette anchor and species/material-specific asymmetry |
| Motif soup makes every object interchangeable | Fixed semantics, one primary plus one support ceiling, motif review in manifest |
| Pastel colour reduces accessibility | Dark semantic inks; colour-independent pattern/shape/label channels; simulation and human testing |
| Simplified icons look detached from world | Retain one shared edge, corner, and sparkle/notch signature after literal silhouette works |
| Alpha cleanup erases pale fur or enclosed cage bays | Native alpha first; connected-background only; opaque-core/fringe metrics; light/dark/cage composites |
| Lossy encoding damages faces, outlines, or wrap edges | Per-family A/B at actual scale; keep lossless where required; decode-edge validation |
| Static paint fights runtime lighting | Neutral terrain, one declared key direction, no baked cast shadow/halo, disabled/default/max lighting review |
| New art increases preload or decoded memory | Context derivatives, no dual preload, byte/decoded budgets, before/after route capture |
| Legacy references break during cleanup | Versioned URLs, status/deprecation phase, dependency scan, build test, separate cleanup commit |
| Historical prompt record remains non-portable | Source-side JSON with hashes and output IDs; local path retained only as historical note, never as dependency |
| Figma introduces a second source of truth | Do not add Figma without a concrete authoritative design-system workflow and ownership decision |

## 17. Rollback strategy

- Every new asset gets a new versioned filename; never overwrite the approved prior file.
- Catalogue switches are atomic by family and isolated from source-generation commits.
- Keep the previous runtime revision in public/assets for one release and retain all masters/source records permanently unless a separate retention policy is approved.
- Before each switch, record previous catalogue pointers and hashes in the manifest.
- A rollback is a pointer reversal in src/artCatalog.ts/src/assets.ts plus the matching tests; it does not require regenerating art.
- Cleanup is always a later, separate change after the rollback window. If cleanup has occurred, Git plus immutable source records reconstruct the exact prior derivative.
- Golden screenshots and proof sheets are compared before and after rollback.
- If only encoding regresses, revert the derivative recipe while retaining the approved art master and artVersion.

## 18. Research basis

All sources below were accessed 2026-09-02. Source facts inform the rules; project-specific dimensions, motif meanings, palettes, thresholds, and priorities are art-direction decisions.

### Magical-girl grammar and agency

- Han, A Study on the Structural Transformation of Magical Girl Anime Transformation Sequences, 2026, supports treating transformation as a structured trigger/medium/marker/result system: [KCI](https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003358550).
- Saito, Magic, Shōjo, and Metamorphosis, published online 2014-01-02, gives historical/cultural context for transformation and identity: [Cambridge University Press](https://www.cambridge.org/core/journals/journal-of-asian-studies/article/abs/magic-shojo-and-metamorphosis-magical-girl-anime-and-the-challenges-of-changing-gender-identities-in-japanese-society/AAA8B9C5895D35A48C9EFC28495D4F9B).
- Perea, Girl Cartoons Second Wave, first published 2015-10-19, supports friendship, emotional capability, and confidence as agency: [SAGE](https://journals.sagepub.com/doi/10.1177/1746847715608561).

### Cuteness, expression, pose, and non-menacing challenge

- Borgi et al., Baby schema in human and animal faces, May 2014, reports the effect of large heads/eyes, round faces, and compact features on perceived cuteness and attention: [Frontiers in Psychology](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2014.00411/full).
- Toon Boom’s Character Proportions production lesson supports deliberate proportion systems: [Toon Boom Learn](https://learn.toonboom.com/modules/characterdesign/topic/character-proportions).
- Walt Disney Animation’s hand-drawn process emphasizes pose, expression, cleanup, and on-model consistency: [Walt Disney Animation Studios](https://www.disneyanimation.com/process/hand-drawn-animation/).
- Bar and Neta, Humans prefer curved visual objects, August 2006, supports using rounded forms as the baseline and sharp transitions sparingly for threat: [PubMed](https://pubmed.ncbi.nlm.nih.gov/16913943/).
- Child-friendly challenge constraints are informed by the [ESRB Ratings Guide](https://www.esrb.org/ratings-guide/) and [PEGI descriptor guidance via Ask About Games](https://askaboutgames.com/need-to-know/what-are-content-descriptors/).

### Cohesion, iconography, ornament, and colour

- Official production guidance supports documenting one visual language across shape, colour, material, purpose, and status: [Roblox Creator Hub — Choose an art style](https://create.roblox.com/docs/tutorials/curriculums/user-interface-design/choose-an-art-style) and [Paradox Interactive — Making Art in FOUNDRY, 2024-02-23](https://www.paradoxinteractive.com/games/foundry/news/dev-blog-48-making-art-in-foundry).
- UI ornament should reinforce hierarchy rather than compete with content: [Roblox Creator Hub — UI and UX design](https://create.roblox.com/docs/production/game-design/ui-ux-design) and [Asmodee Digital — Art Direction and User Interface](https://doc.asmodee.net/art-and-ui).
- Apple recommends simple, immediately recognisable icon concepts with clear margins and platform-aware rendering: [Apple Human Interface Guidelines — Icons](https://developer.apple.com/design/human-interface-guidelines/icons).
- Microsoft recommends consistent metaphors, geometry, stroke, detail, and size-specific treatment: [Fluent 2 — Iconography](https://fluent2.microsoft.design/iconography).
- WCAG 2.2 informs colour-independent communication and the internal contrast targets: [Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html), [Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html), and [Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), published 2023-10-05.
- Xbox accessibility guidance requires critical colour coding to have another channel and cautions that simulation does not replace testing: [XAG 103](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/103) and [XAG 102](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/102), updated 2026-03-04.

### AI-assisted production and provenance

- OpenAI documents reference-led generation/editing and notes continuing limitations in recurring-character consistency and precise structured composition: [OpenAI Image Generation Guide](https://developers.openai.com/api/docs/guides/image-generation).
- C2PA defines provenance relationships among ingredients, parents, components, and derived assets: [C2PA Specification 2.4](https://spec.c2pa.org/specifications/specifications/2.4/index.html).
- IPTC recommends identifying fully AI-generated media with trainedAlgorithmicMedia metadata: [IPTC guidance, 2023-05-09](https://iptc.org/news/iptc-publishes-metadata-guidance-for-ai-generated-synthetic-media/).

### Runtime image engineering

- WebP supports lossy/lossless compression and transparency: [Google — An image format for the Web](https://developers.google.com/speed/webp) and [WebP FAQ](https://developers.google.com/speed/webp/faq).
- PNG uses lossless storage and unassociated alpha: [W3C PNG Specification, Third Edition](https://www.w3.org/TR/png-3/).
- Bilinear filtering averages neighbouring texels, which explains contamination from hidden RGB under transparent edges: [Microsoft — Bilinear texture filtering](https://learn.microsoft.com/en-us/windows/uwp/graphics-concepts/bilinear-texture-filtering).
- Atlas padding guidance reinforces keeping transparent colour bleed and separation around filtered sprites: [Unity 6 — AtlasSettings.paddingPower](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Sprites.AtlasSettings-paddingPower.html).
- Compression must be selected by visual comparison and intended use, not extension alone: [web.dev — Choose the correct level of compression](https://web.dev/articles/compress-images).

### Human-supplied related-project production evidence

On 2026-09-03 the private `MachineKomi/ppba-rebirth-spec` repository was read at
exact commit `dacc8cf644d24d56aae34ba757efb4fac5f9d341`. The current authority and
relevant production evidence included `spec/v0.13/09a-visual-motion-ui-system.md`,
`spec/v0.13/09b-key-asset-family-contracts.md`,
`spec/v0.13/09d-full-preproduction-asset-contract.md`,
`assets/guides/SPRITE_CONTOUR_STANDARD.md`,
`assets/prompts/IMAGE_ASSET_PROMPTS.md`, and
`FULL_PREPRODUCTION_ART_ASSET_SPRINT.md`. The exact transferable lessons,
Maze-specific adaptations, rejected identity elements, and originality boundary
are preserved in `docs/research/2026-09-03-ppba-art-craft-synthesis.md`. These
files are related-project process/craft evidence, not external scientific
authority, a runtime dependency, or permission to import their assets/prompts.

## 19. Definition of complete implementation

The art-direction implementation is complete only when:

- Every active static asset family is represented in the manifest and catalogue contract.
- The PPBA-informed craft calibration has an explicit adopt/adapt/reject record;
  the approved recipe version and canary decision are frozen without
  retroactively relabelling historical sources.
- Every P0/P1 decision has passed its review gate.
- The complete Human-approved rescue-and-collect friend family, cage composites,
  hazards, navigation, and pivotal character/weapon anchors are coherent at
  actual display size; the historical fifteen-friend phrase is not a roster cap.
- Every early title, home/hero, logo, and application-icon study is either
  promoted through exact-wordmark, responsive, catalogue, byte, fallback, and
  rollback gates or explicitly Human-deferred with an owner and return gate.
  The v6 decision takes the latter path: Batch 21 and the Ame-face icon remain
  source-only for Plan 11 and are not Plan 03 runtime dependencies.
- The active environment set uses consistent material scale and passes seam, contrast, and hierarchy review.
- No new asset lacks an exact reproducible record and approved derivative.
- Every approved source is accounted for in the versioned content-integration
  manifest as published, explicitly Human-deferred, or blocked with a precise
  owner and return gate; no approved asset silently disappears between source
  review and downstream implementation.
- Active transfer weight is reduced by at least 25% from the measured Phase 0
  baseline or every exception is explicitly approved, allocated, measured, and
  justified by the Human-required replacement catalogue.
- The preceding art set can be restored by catalogue pointer change.
- No out-of-scope HUD layout, effect timing, wall-lighting, animation-state, or gameplay-mechanics change has been folded into the art pass.

## 20. Publication closeout — 2026-09-04

Plan 03 meets the definition above for its static-art scope. The forward-only
v6 Human decision selects 144 immutable approved sources. The deterministic
publisher produced 100 active and 44 dormant versioned WebP derivatives,
strict-v2 records, and one generated semantic catalogue projection. All 100
superseded runtime predecessors remain byte-for-byte present and restorable;
the 116-entry ledger marks every old/candidate file `rollback-hold`, with zero
assets eligible for movement or deletion before Plan 12.

The publication totals 9,366,734 encoded bytes and 107,937,792 decoded-RGBA
bytes as an all-files upper bound. Active entries account for 7,068,346 encoded
/ 92,471,296 decoded bytes; dormant catalogue-only entries account for
2,298,388 / 15,466,496 and are not preloaded. The final runtime inventory is
269 images / 48,540,161 encoded / 290,949,024 decoded bytes. This deliberate
growth is registered to the Plan 03 feature allocation rather than hidden from
the shared performance contract.

The exact source → derivative → semantic-ID authority is
`docs/source-assets/publication/mgjrpg-02-plan03-runtime-map.json`; measured
pixels and lifecycle results are in the adjacent publication report, visual
integration report, validation report, transparent-dressing correction record,
and Plan 12 ledger. Production-preview QA exercised all 144 URLs and sampled
active families across 1920 × 1080, 1280 × 720, 1194 × 834, 1024 × 768,
844 × 390, and 568 × 320. A normal non-tester completion additionally proved
the live victory reward and mixed unlocked/locked Adventure Book identities.
No broken request, visible fallback, legacy URL in the sampled mazes, or browser
warning/error was observed.

One transient prepublication defect was caught rather than normalized: the
opaque periodic helper had flattened the alpha of four sparse dressing overlays.
The invalid uncommitted derivatives were hash-recorded and moved outside the
repository for recoverable inspection; fresh RGBA-preserving derivatives were
then generated directly from the approved immutable sources. No approved or
legacy repository asset was overwritten, moved, or deleted.

All Plan 03 art, catalogue, provenance, alpha, dimension, registration, seam,
reference, documentation, TypeScript, build, performance, desktop-compile, and
native-build checks pass. The final canonical `npm run check` passed all 407
tests across 35 files. An earlier run made concurrently with cold Rust/linker
work exceeded four fixed gameplay-solver per-test timeouts, including the same
generator timeout in the untouched starting commit; the validation record keeps
that resource-contention evidence rather than concealing it. Both affected test
files and the full suite passed once the competing compiler load ended. Plan 03
introduces no new unexplained validation failure.

Downstream contracts remain explicit. Plan 04 supplies directional light,
contact grounding, and animated environmental light without repainting static
directional shadows. Plan 05 must manually register the 56 deferred non-Ame
face/eye/ground landmark sets before producing animation frames or automating
cage-face masking. Plan 11 owns the exact logo/title/home/application-icon
decision; Batch 21 remains source-only. Plan 12 alone may archive or delete the
recorded retirement candidates after every consumer and pointer is final.
