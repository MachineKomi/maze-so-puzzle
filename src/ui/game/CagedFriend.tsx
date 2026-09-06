import type { CSSProperties } from "react";
import { measureFieldArt } from "../../fieldArtLayout";
import { CatalogueImage } from "../CatalogueImage";
import { resolveUiArt } from "../art";

const pct = (n: number) => `${n * 100}%`;
// Visually reviewed upper-body window offsets. These are presentation crops,
// not face/eye/foot measurements and never affect a free friend's geometry.
const CAGED_REVEAL: Readonly<Record<string,number>> = {
  bunny:.50, fox:.36, duckling:.37, hedgehog:.43,
  'mallowmusk-aroma-wisp':.62, 'breezeling-sylph':.48, 'rainbow-horn-unicorn':.43,
};
/** Preserve the approved square cage. Its registered bay occludes a full-scale
 * friend; reveal their upper silhouette, without inventing anatomical landmarks. */
export function cageComposition(friendSrc: string, cageSrc: string) {
  const art = resolveUiArt(friendSrc)!, friend = art.geometry!, cage = resolveUiArt(cageSrc)!.geometry!;
  const frame = measureFieldArt(cage), pet = measureFieldArt(friend);
  const [bx, by, bw, bh] = cage.openBay!;
  const bay = { x: frame.left + bx * frame.scale, y: frame.top + by * frame.scale,
    width: bw * frame.scale, height: bh * frame.scale };
  // A display crop of the upper body, not a claimed anatomical face landmark.
  const petTop = bay.y + Math.min(.015, bay.height / 2 - pet.visibleHeight * (CAGED_REVEAL[art.id] ?? .30))
    - friend.visibleBounds[1] * pet.scale;
  return {
    cageStyle: { position: "absolute", inset: "auto", left: pct(frame.left), top: pct(frame.top),
      width: pct(frame.scale), height: "auto", maxWidth: "none" } as CSSProperties,
    bayStyle: { left: pct(bay.x), top: pct(bay.y), width: pct(bay.width), height: pct(bay.height) },
    petStyle: { inset: "auto", left: pct((pet.left - bay.x) / bay.width), top: pct((petTop - bay.y) / bay.height),
      width: pct(pet.scale / bay.width), height: "auto", maxWidth: "none" } as CSSProperties,
    rescueStyle: { "--rescue-start-y": pct((petTop - pet.top) / pet.scale),
      "--rescue-clip": `inset(${pct((bay.y-petTop)/pet.scale)} ${pct(1-(bay.x+bay.width-pet.left)/pet.scale)} ${pct(1-(bay.y+bay.height-petTop)/pet.scale)} ${pct((bay.x-pet.left)/pet.scale)})` } as CSSProperties,
  };
}
export function CagedFriend({ friendSrc, cageSrc }: { friendSrc: string; cageSrc: string }) {
  const frame = cageComposition(friendSrc, cageSrc);
  return <>
    <div className="cage-friend-bay" style={frame.bayStyle}>
      <CatalogueImage usage="field" fieldDetail className="animal-sprite" src={friendSrc} style={frame.petStyle} alt="" />
    </div>
    <CatalogueImage usage="field" className="animal-cage" src={cageSrc} style={frame.cageStyle} alt="" />
  </>;
}
