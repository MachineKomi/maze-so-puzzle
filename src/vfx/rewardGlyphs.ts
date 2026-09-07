import type { RewardKind } from "./rewardPhysics";

export const REWARD_COLORS: Record<RewardKind, string> = { gold: "#f5bf4f", science: "#42aaa7", power: "#ee82bc" };
// Small drops have their own visual scale, independent of field actors/items.
export const REWARD_DIAMETER: Record<RewardKind, number> = { gold: .28, science: .28, power: .22 };

/** Original effect glyphs. Draw once to a small atlas, not every animation frame.
 * Broad values and coloured material contours; no glow filter or white cutline. */
export function rewardGlyph(kind: RewardKind): HTMLCanvasElement {
  const canvas = document.createElement("canvas"); canvas.width = canvas.height = 128;
  const c = canvas.getContext("2d")!;
  c.scale(2, 2); c.translate(32, 32); c.lineJoin = "round"; c.lineCap = "round";
  c.lineWidth = 3;
  if (kind === "gold") {
    c.beginPath();
    for (let i = 0; i < 10; i++) {
      const angle = i * Math.PI / 5 - Math.PI / 2, radius = i % 2 ? 13 : 27;
      c.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    c.closePath(); c.fillStyle = "#f5bf4f"; c.fill(); c.strokeStyle = "#b9773f"; c.stroke();
    for (let i=0;i<5;i++) {
      const a=i*Math.PI*2/5-Math.PI/2, b=a+Math.PI/5;
      c.beginPath(); c.moveTo(0,0); c.lineTo(Math.cos(a)*25,Math.sin(a)*25);
      c.lineTo(Math.cos(b)*12,Math.sin(b)*12); c.closePath();
      c.fillStyle=["#fff1a2","#ffe079","#e8a02c","#d38e25","#ffda65"][i]!; c.fill();
    }
    c.beginPath(); c.moveTo(0, -20); c.lineTo(-7, -3); c.lineTo(-17, -2);
    c.strokeStyle = "#fff0aa"; c.lineWidth = 5; c.stroke();
  } else if (kind === "science") {
    c.strokeStyle = "#458a94"; c.lineWidth = 5;
    for (const angle of [0, Math.PI / 3, -Math.PI / 3]) {
      c.beginPath(); c.ellipse(0, 0, 26, 10, angle, 0, Math.PI * 2); c.stroke();
    }
    c.beginPath(); c.arc(0, 0, 8, 0, Math.PI * 2); c.fillStyle = "#a8efce"; c.fill();
    c.strokeStyle = "#54957f"; c.lineWidth = 3; c.stroke();
    c.beginPath(); c.arc(23, -5, 4, 0, Math.PI * 2); c.fillStyle = "#fff0bb"; c.fill();
  } else {
    c.beginPath(); c.moveTo(0, -27); c.quadraticCurveTo(27, -9, 24, 4);
    c.quadraticCurveTo(18, 26, 0, 27); c.quadraticCurveTo(-24, 18, -24, 4);
    c.quadraticCurveTo(-27, -9, 0, -27);
    c.fillStyle = "#e981c0"; c.fill(); c.strokeStyle = "#a95798"; c.stroke();
    c.beginPath(); c.moveTo(0, -18); c.lineTo(-12, 3); c.lineTo(0, 18); c.lineTo(12, 3);
    c.closePath(); c.fillStyle = "#ffc8ed"; c.fill();
    c.beginPath(); c.moveTo(-11, -11); c.lineTo(-16, -3);
    c.strokeStyle = "#fff0d8"; c.lineWidth = 4; c.stroke();
  }
  return canvas;
}
