import { expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { UI_ART, resolveUiArt, selectArtRendition, type UiArt } from "./art";
import { CatalogueImage, PresentationArt } from "./CatalogueImage";
import { ANIMAL_SPECIES } from "../game/types";
import { resolveAnimalArt, PICKUP_ART } from "../artCatalog";
import { UI_PRESENTATION_CANDIDATES } from "../generated/uiPresentationArt";
import { UI_REWARD_PRESENTATION_CANDIDATES } from "../generated/uiRewardPresentationArt";
it("resolves every authored friend and every catalogue family without filename inference", () => {
  for (const species of ANIMAL_SPECIES) expect(resolveUiArt(resolveAnimalArt(species).src)?.id).toBeTruthy();
  expect(ANIMAL_SPECIES).toHaveLength(32);
  for (const art of UI_ART) {
    expect(resolveUiArt(art.src)?.id).toBe(art.id);
    if (art.geometry) expect(art.geometry.visibleBounds).toHaveLength(4);
    else expect(art.fit).toBe("cover"); // approved title entrance has a focal/copy-safe contract, not sprite bounds
  }
});
it("selects the smallest sufficient approved rendition for role, size and DPR", () => {
  const art: UiArt = {id:"test",label:"Test",src:"field",variants:[128,256,512].map(width=>({src:`p${width}`,width,height:width,format:"webp",usage:"presentation",minDisplayPx:1,maxDisplayPx:512}))};
  expect(selectArtRendition(art,"presentation",144,2).src).toBe("p512");
  expect(selectArtRendition(art,"presentation",120,1).src).toBe("p128");
  expect(selectArtRendition(art,"optical",48,1).fallback).toBe(true);
});
it("does not invent presentation art or enlarge an equipment fallback", () => {
  const art = {id:"absent-approved-presentation",src:"/optical-only.webp",label:"Named equipment",width:256,height:256};
  const markup = renderToStaticMarkup(createElement(PresentationArt,{art,label:art.label}));
  expect(markup).toContain('data-presentation-available="false"');
  expect(markup).toContain('data-art-role="optical"');
  expect(markup).toContain(art.label);
});
it("keeps all fourteen optical sources and selects measured 512px presentation candidates at DPR2", () => {
  expect(Object.keys(UI_PRESENTATION_CANDIDATES)).toHaveLength(14);
  for (const [id,candidate] of Object.entries(UI_PRESENTATION_CANDIDATES)) {
    const art=resolveUiArt(id)!;
    expect(selectArtRendition(art,"optical",28,2).src).toBe(art.src);
    for (const size of [128,200]) {
      const rendition=selectArtRendition(art,"presentation",size,2);
      expect(rendition.src).toBe(candidate.src);expect(rendition.sufficientResolution).toBe(true);
      expect(Math.max(...rendition.geometry!.visibleBounds.slice(2))*size).toBeGreaterThanOrEqual(size===128?96:144);
    }
  }
});
it("renders catalogue imagery without requiring browser globals", () => {
  expect(renderToStaticMarkup(createElement(CatalogueImage,{art:PICKUP_ART.boots}))).toContain('data-art-geometry="item"');
});
it("keeps earned reward optical delivery while supplying sharp 200px DPR2 details", () => {
  expect(Object.keys(UI_REWARD_PRESENTATION_CANDIDATES)).toHaveLength(15);
  for (const [id, variant] of Object.entries(UI_REWARD_PRESENTATION_CANDIDATES)) {
    const art = resolveUiArt(id)!;
    expect(selectArtRendition(art, "optical", 48, 2).src).toBe(art.src);
    expect(selectArtRendition(art, "presentation", 128, 2).src).toBe(art.src);
    const detail = selectArtRendition(art, "presentation", 200, 2);
    expect(detail.src).toBe(variant.src);
    expect(detail.sufficientResolution).toBe(true);
    expect(detail.geometry?.class).toBe("icon");
  }
});
