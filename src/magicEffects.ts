import type { KeyColor } from "./game/types";

export interface LockMagicEffect {
  readonly core: string;
  readonly glow: string;
  readonly pale: string;
  readonly symbols: readonly [string, string, string];
}

/** Colour and shape language shared by keys, doors, and opening particles. */
export const LOCK_MAGIC_EFFECTS = {
  red: {
    core: "#ff6f9f",
    glow: "rgba(255, 86, 145, 0.92)",
    pale: "#ffe5f0",
    symbols: ["♥", "✦", "❀"],
  },
  blue: {
    core: "#57c9ff",
    glow: "rgba(58, 171, 255, 0.94)",
    pale: "#e4f8ff",
    symbols: ["★", "✦", "◆"],
  },
  yellow: {
    core: "#ffd75b",
    glow: "rgba(255, 184, 38, 0.94)",
    pale: "#fff8c9",
    symbols: ["☀", "✦", "•"],
  },
} as const satisfies Readonly<Record<KeyColor, LockMagicEffect>>;

export interface DoorBurstParticle {
  readonly glyph: string;
  readonly x: string;
  readonly y: string;
  readonly delayMs: number;
  readonly scale: number;
}

/** A deterministic radial shower avoids runtime randomness and visual reflows. */
export function createDoorBurstParticles(
  color: KeyColor,
  count = 18,
): readonly DoorBurstParticle[] {
  const safeCount = Math.max(1, Math.floor(count));
  const theme = LOCK_MAGIC_EFFECTS[color];
  return Array.from({ length: safeCount }, (_, index) => {
    const angle = ((index / safeCount) * Math.PI * 2) - (Math.PI / 2);
    const radius = 40 + ((index * 17) % 18);
    return {
      glyph: theme.symbols[index % theme.symbols.length]!,
      x: `${(Math.cos(angle) * radius).toFixed(2)}%`,
      y: `${(Math.sin(angle) * radius).toFixed(2)}%`,
      delayMs: (index % 6) * 22,
      scale: 0.76 + ((index * 7) % 5) * 0.1,
    };
  });
}
