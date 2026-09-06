# PT36 attachment preflight — metadata intent established, visual gate open

2026-09-06; source inspected at `db072b39e50e4748543400814d211d49c2d04e5c`.
Read-only source/provenance synthesis and inspection of three existing images.
No browser, native, test, build, performance, generation or runtime/asset edit.
This is preparation for root review, **not PT36 acceptance or Plan04 launch**.

## What is established

**The ring's rear order is deliberate, not an accidental UI override.** The
publisher explains why: its closed loop was put behind Ame to avoid crossing
both eyes (`scripts/art_pipeline/mgjrpg02_publish.py:77–93`). The source record,
generated field catalogue and presentation derivative all retain `zOrder:1`;
the other seven weapons use3 and Ame's body uses2. The shared helper forwards
that value without a weapon-name branch. The Human's later report that it looks
wrong remains unresolved; historical publication and tests retaining1 do not
overrule it. [PT36](../PLAYTEST_BACKLOG.md#pt-20260905-36--bubble-ring-blade-held-layering),
[Human item5](../playtests/2026-09-05-v0201-wishlist.md),
[Plan04 gate](../plans/04-lighting-wall-depth.md) lines117–124.

The remaining decision is **whether the authored hand/body/ring occlusion is
visually acceptable, and which canonical registration change, if any, produces
the requested readable foreground composition without hiding the face**. Merely
proving the value reaches CSS no longer resolves a downstream unknown.

## Exact attachment and registration inputs

| Authority | Canonical facts |
| --- | --- |
| `ame-mgjrpg02-v02-source` / `AME_ART` | Single front-three-quarter static actor; hand socket `[0.66,0.58]`, pivot `[0.5,0.9]`, groundLine0.9, faceBox `[0.39,0.19,0.25,0.2]`; neutral-albedo, runtime shadow eligible. |
| `bubble-ring-blade-mgjrpg02-v01-source` | 256×256 field derivative; weapon grip `[0.5,0.836]`, forward axis−90°, heldScale0.576, clockwise rotation35°, local layer1. |
| `bubble-ring-blade-ui01-presentation-candidate-r01-source` | Approved 512×512 contextual derivative from the same immutable original; same grip/axis/scale/rotation/order, separately measured alpha bounds. |

The ring source is registered into targetBox `[0.08,0.08,0.92,0.92]`, centred
`[0.5,0.5]`, alpha threshold3; Ame uses `[0.12,0.06,0.88,0.94]`, alignment
`[0.5,1]`, threshold3. The landmarks refer to these **registered canvases**, not
the unprocessed generator bitmap or alpha silhouette. The intended held-family
axis is−55° (−90+35); `forwardAxisDegrees` is source/validation information,
while CSS applies `heldRotationDegrees` about the weapon grip.

[heldWeaponPresentation.ts](../../src/heldWeaponPresentation.ts) uses actor
canvas `(scale,left,top)` = `(0.92,0.04,0.09)` in field and `(0.94,0.03,0.07)`
in battle/portal. It computes `size=actor.scale*heldScale` and positions the
weapon grip exactly at `actor.offset+actor.scale*Ame.gripPoint`. Normal field
therefore projects the declared hand to `[0.6472,0.6236]` and declared ground
point to `[0.5,0.918]` in the actor tile; these are arithmetic projections,
**not newly measured anatomical landmarks**. Tests prove that algebra, not
whether the socket matches the visible hand during every pose.

Field, battle and portal held consumers (`App.tsx:2504,2602,2616`) all request
`usage="field"`. `ui/art.ts:52–60` filters renditions by usage, so the ring's
separate512px presentation approval is not evidence that those consumers use it
or that their attachment was visually approved. Preserve source identity and
the one-way historical `bubble-bow` alias; do not introduce another weapon.

## Existing visual evidence: useful but insufficient

I inspected these existing local images, without regenerating them:

- [Held actual-size sheet](../../artifacts/art-proofs/mgjrpg-02/publication/held-weapon-calibration/held-weapons-actual-size.png): static family comparison including77px and56px rows. The ring's right-hand-side loop remains visible and the face is clear. This shows the chosen composition, not that the Human accepts its rear placement.
- [Construction sheet](../../artifacts/art-proofs/mgjrpg-02/publication/held-weapon-calibration/held-weapons-construction.png): larger static composites label the ring z1. It is historical calibration evidence, not an exact-current render: its ring scale label rounds to0.577, whereas current metadata is0.576. No current motion, mirroring or contact-shadow proof is present.
- [Historical Twilight runtime capture](../../artifacts/art-proofs/mgjrpg-02/runtime-integration/phone-844-twilight-treasure.png): Ame is visibly **unequipped**. The linked publication integration report lists compact silhouettes/doors/cages/UI, not a held-ring test. This image cannot close PT36.

The v06 Human decision approves exact source publication, while the later
UI01 presentation approval explicitly covers technical rendition delivery, not
new Human visual/device acceptance. Source and derivative SHA256 spot checks
matched both ring records and Ame's record; this was not a full art validation.
The three image hashes, in the order above, are:

```text
0272b1119c1d77ae7d399f6f6617e01e4990fb4e2ef14631fafa74af8bec775f
34e39211c1ccc1d2e3d1c9ea08605012e044f023ba39da7829f1e917ed89fe77
23788231fb7d2220d29cda2427bd8f7d1f6e510adfeaa17d9ab1047f84d50e28
```

## Three source exceptions the small visual gate must include

These are demonstrated **source-contract differences**, not newly reproduced
visual defects or reasons to blame the ring metadata:

1. `scene.css:1141` moves only the top-edge player sprite from bottom−1% to−7%.
   Its visible body canvas moves down6% of a tile, but the sibling held weapon
   still uses the normal-field socket placement. A centred idle proof misses it.
2. `scene.css:476–477` applies ±1° Full-motion travel sway only to `.player-sprite`;
   the sibling weapon does not receive that local pose rotation. Shared world
   travel is still shared; exact posed hand alignment is not guaranteed by the
   helper's static algebra.
3. `App.tsx:2582` / `scene.css:941` jump weapon bypasses the shared helper entirely:
   fixed z7,57% size, right−1%, bottom7%, rotation−7°. Twilight has authored spring
   boots/holes, making this a relevant attachment handoff rather than a hypothetical
   weapon context. Field/battle/portal metadata changes alone do not cover jump.

Current field rendering has one static facing and no direction-selected or
mirrored weapon/actor rendition in these consumers. Check its actual cardinal
travel/attack directions; do not invent four approved directional sprites.
Plan05 must later validate any newly introduced mirrored/facing sockets.

## Smallest remaining gate and Plan04 handoff

At a separately authorized visual slot, use equipped **Twilight Treasure Loop**
(`contentRevision:3`, `weaponStyle:bubble-ring-blade`) at one real field size and
one enlarged inspection size. First inspect current idle centrally and at the
top camera edge, one travel interval, representative battle swish extremes and
the jump replacement/return; include portal entry/exit only in an existing
legal ring fixture. Review face/hand/body/loop occlusion and socket continuity at
the same rendered timestamp. Static fallback and actual supported direction
classes remain acceptance requirements, not a request for a broad art history
or new frame generation.

If a controlled comparison is needed, root can authorize **one** foreground
order-only metadata candidate against the unchanged rear baseline; keep grip,
scale, registration, pixels and pose phase fixed. If it crosses the face or
fails hand occlusion, return that exact evidence before considering an art-owned
grip/rotation/scale adjustment. No name-specific CSS fix, automatic z3 approval,
new source design or asset-wide shadow rule follows from this preflight.

Before accepting held grounding, Plan04 needs root's explicit keep/correct
disposition, pinned source/derivative IDs and registration, the accepted posed
attachment contract and visual proof above. It must consume the existing rendered
travel/ground-plane position and dedicated contact/cast layers, not the logical
target or a second position tween. Ame provides a canonical ground landmark and
shadow eligibility, but artCatalog does not yet supply Plan04's complete
grounded/floating/flush, semantic height/lift and emissive policy for every class.
Do not reinterpret a weapon grip, alpha bottom, heldScale or local zOrder as its
physical ground pivot/height. A carried weapon and a ground pickup are different
scene roles; any missing role-specific grounding authority returns by exact ID,
without inventing foot landmarks or reopening approved pixels.

Thus this preflight retires the *why rear / which rendition / what old proof
covers* unknowns and identifies existing pose exceptions. PT36 stays
P1 / Routed / Not retested pending root's actual visual review and disposition;
Plan04 and Plan05 acceptance are not granted here.

## Root review

Astra independently read the publisher's measured registration table, shared
held-placement helper, top-edge and jump CSS, and inspected the historical
actual-size family sheet. The source distinctions above are substantiated;
the sheet is not a current moving-scene acceptance. Carry the bounded equipped
comparison into PT36 before Plan04; no runtime change or layer approval follows.
