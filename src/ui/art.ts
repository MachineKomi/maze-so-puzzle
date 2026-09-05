import { MGJRPG02_ART, FRONT_DOOR_ART, type ArtGeometry, type ArtReference, type RuntimeArtVariant, type RuntimeArtUsage } from "../artCatalog";
import { UI_PRESENTATION_CANDIDATES } from "../generated/uiPresentationArt";
import { UI_REWARD_PRESENTATION_CANDIDATES } from "../generated/uiRewardPresentationArt";

const presentationVariants: Readonly<Record<string, RuntimeArtVariant>> = {
  ...UI_PRESENTATION_CANDIDATES, ...UI_REWARD_PRESENTATION_CANDIDATES,
};

export interface UiArt extends ArtReference {
  readonly id: string;
  readonly family?: string;
  readonly profile?: string;
  readonly width?: number;
  readonly height?: number;
  readonly runtimeStatus?: string;
  readonly geometry?: ArtGeometry;
  readonly variants?: readonly RuntimeArtVariant[];
  readonly fit?: "cover" | "contain";
  readonly focalPoint?: readonly [number, number];
}
/** Compatibility projection from explicit geometry, never filename guessing. */
function withRenditions(art: UiArt): UiArt {
  if (!art.width || !art.height) return art;
  const width = art.width;
  const height = art.height;
  const optical: RuntimeArtVariant = { src: art.src, width, height, format: "webp", usage: "optical", minDisplayPx: 16, maxDisplayPx: 64 };
  const presentation = art.geometry?.class === "portrait" || art.profile === "reward-presentation-256";
  const variants = art.variants?.length ? art.variants : [optical, { ...optical, usage: "field" as const, maxDisplayPx: width },
    ...(presentation ? [{ ...optical, usage: "presentation" as const, maxDisplayPx: 256 }] : [])];
  // Root-authorized deterministic candidates, not new source-art approval.
  // Keep the optical/field projection and all scene sockets unchanged.
  const candidate = presentationVariants[art.id];
  return { ...art, variants: candidate && !variants.some(v => v.src === candidate.src) ? [...variants, candidate] : variants };
}
// Metadata only. Importing this index does not fetch/decode any image.
export const UI_ART: readonly UiArt[] = [
  ...Object.values(MGJRPG02_ART),
  ...Object.values(FRONT_DOOR_ART).flatMap<UiArt>((value) => "src" in value ? [value as UiArt] : Object.values(value) as UiArt[]),
].map(withRenditions);
const byId = new Map(UI_ART.map((art) => [art.id, art]));
const bySrc = new Map(UI_ART.map((art) => [art.src, art]));
export function resolveUiArt(identity: string | UiArt): UiArt | undefined {
  return typeof identity === "string" ? byId.get(identity) ?? bySrc.get(identity)
    : withRenditions({ ...bySrc.get(identity.src), ...identity });
}
export function selectArtRendition(art: UiArt, usage: RuntimeArtUsage, displayPx: number, dpr = 1) {
  const physicalNeed = Math.max(1, displayPx) * Math.max(1, Math.min(4, dpr));
  const candidates = [...(art.variants ?? [])].filter((variant) => variant.usage === usage)
    .sort((a, b) => Math.max(a.width, a.height) - Math.max(b.width, b.height));
  const selected = candidates.find((variant) => Math.max(variant.width, variant.height) >= physicalNeed) ?? candidates.at(-1);
  return { src: selected?.src ?? art.src, role: selected?.usage ?? "optical", physicalNeed, fallback: !selected,
    geometry: selected?.geometry,
    sufficientResolution: selected ? Math.max(selected.width, selected.height) >= physicalNeed : false } as const;
}
