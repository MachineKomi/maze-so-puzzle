// One small shared atlas replaces repeated font resolution and text shaping in
// physical-loot frames. Power keeps its separately sized, existing labels.
const FONT = 96, SLOT = 72, HEIGHT = 128, BASELINE = 108;
let cached: { canvas: HTMLCanvasElement; advances: number[] } | undefined;

export function rewardNumbers() {
  if (cached) return cached;
  const canvas = document.createElement("canvas");
  canvas.width = SLOT * 10; canvas.height = HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.font = `bold ${FONT}px sans-serif`;
  context.textAlign = "center"; context.lineJoin = "round";
  context.strokeStyle = "#fff9e9"; context.fillStyle = "#553677";
  context.lineWidth = 11;
  const advances = Array.from({ length: 10 }, (_, digit) => {
    const text = String(digit), x = digit * SLOT + SLOT / 2;
    context.strokeText(text, x, BASELINE); context.fillText(text, x, BASELINE);
    return context.measureText(text).width;
  });
  return cached = { canvas, advances };
}

export function drawRewardNumber(context: CanvasRenderingContext2D, atlas: ReturnType<typeof rewardNumbers>,
  value: number, x: number, baseline: number, fontSize: number) {
  if (!Number.isSafeInteger(value) || value < 1 || !Number.isFinite(x + baseline + fontSize) || fontSize <= 0) return;
  const text = String(value);
  // An auxiliary surface can fail even when the main reward Canvas works.
  // Preserve the original visible count in that case; never lose reward value.
  if (!atlas) {
    context.font = `bold ${fontSize}px sans-serif`; context.textAlign = "center";
    context.lineWidth = 3; context.strokeStyle = "#fff9e9"; context.fillStyle = "#553677";
    context.strokeText(text, x, baseline); context.fillText(text, x, baseline);
    return;
  }
  const digits = Array.from(text, Number), scale = fontSize / FONT;
  const width = digits.reduce((sum, digit) => sum + atlas.advances[digit]!, 0);
  let left = x - width * scale / 2;
  for (const digit of digits) {
    const advance = atlas.advances[digit]!;
    context.drawImage(atlas.canvas, digit * SLOT, 0, SLOT, HEIGHT,
      left + (advance - SLOT) * scale / 2, baseline - BASELINE * scale, SLOT * scale, HEIGHT * scale);
    left += advance * scale;
  }
}
