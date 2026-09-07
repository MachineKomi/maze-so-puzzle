import type { RewardKind } from "./rewardPhysics";

export const XP_CRYSTAL_SRC = "/assets/adventure-xp-v1.png";
export const REWARD_COLORS: Record<RewardKind, string> = { gold: "#f5bf4f", science: "#42aaa7", power: "#ee82bc", xp: "#9675e9" };
// Small drops have their own visual scale, independent of field actors/items.
export const REWARD_DIAMETER: Record<RewardKind, number> = { gold: .28, science: .28, power: .22, xp: .28 };

let crystal: HTMLImageElement | undefined;
/** One tiny decoded source, only when the first XP-capable scene asks for it. */
export function loadXpGlyph(canvas: HTMLCanvasElement, ready: () => void): () => void {
  crystal ??= new Image();
  const draw = () => {
    const context = canvas.getContext("2d");
    if (context && crystal?.naturalWidth) {
      context.setTransform(1,0,0,1,0,0); context.clearRect(0,0,128,128);
      context.drawImage(crystal,0,0,128,128); ready();
    }
  };
  if (crystal.complete && crystal.naturalWidth) draw();
  else { crystal.addEventListener("load",draw); if (!crystal.src) crystal.src = XP_CRYSTAL_SRC; }
  return () => crystal?.removeEventListener("load",draw);
}

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
  } else if (kind === "xp") {
    // Original broad-facet fallback remains legible during loading or failure.
    c.beginPath(); c.moveTo(0,-28); c.lineTo(15,-9); c.lineTo(13,13); c.lineTo(0,28); c.lineTo(-13,13); c.lineTo(-15,-9); c.closePath();
    c.fillStyle="#9461cf"; c.fill(); c.strokeStyle="#67559d"; c.stroke();
    c.beginPath(); c.moveTo(0,-25); c.lineTo(12,-8); c.lineTo(0,24); c.lineTo(-8,-8); c.closePath(); c.fillStyle="#a9eedb"; c.fill();
    c.beginPath(); c.moveTo(12,-8); c.lineTo(11,12); c.lineTo(0,24); c.closePath(); c.fillStyle="#ffd279"; c.fill();
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
