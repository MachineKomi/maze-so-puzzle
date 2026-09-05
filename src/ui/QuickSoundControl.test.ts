import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { ASSETS } from "../assets";
import { QuickSoundControl } from "./QuickSoundControl";

it("presents immediate mute/unmute separately from sound settings with truthful state art", () => {
  for (const muted of [false, true]) {
    const markup = renderToStaticMarkup(createElement(QuickSoundControl, { muted, onToggleMuted: () => {}, onOpenSettings: () => {} }));
    expect(markup.match(/<button /g)).toHaveLength(2);
    expect(markup).toContain(`aria-label="${muted ? "Unmute sound" : "Mute sound"}"`);
    expect(markup).toContain(muted ? ASSETS.navMuted : ASSETS.navSound);
    expect(markup).toContain('aria-label="Open Sound and comfort"');
    expect(markup).toContain('aria-haspopup="dialog"');
    expect(markup.match(/min-width:44px;min-height:44px/g)).toHaveLength(2);
  }
});

it("does not advertise a mute action when a legacy caller only supplies the settings callback", () => {
  const markup = renderToStaticMarkup(createElement(QuickSoundControl, { muted: false, onOpenSettings: () => {} }));
  expect(markup.match(/<button /g)).toHaveLength(1);
  expect(markup).toContain('aria-label="Open Sound and comfort"');
  expect(markup).not.toContain('aria-label="Mute sound"');
});
