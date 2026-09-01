export type SoundName =
  | "step"
  | "bump"
  | "pickup"
  | "power"
  | "powerTick"
  | "unlock"
  | "rescue"
  | "friendRescue"
  | "jump"
  | "combatClash"
  | "combatSparks"
  | "combatImpact"
  | "combatPowerUp"
  | "combatVictory"
  | "win"
  | "reward"
  | "lose"
  | "title"
  | "menu"
  | "select"
  | "achievement"
  | "stamp";

type MelodyNote = readonly [
  frequency: number,
  delay: number,
  length: number,
  peakVolume?: number,
  waveform?: OscillatorType,
  endFrequency?: number,
];

let audioContext: AudioContext | undefined;
const activeVoices = new Set<OscillatorNode>();
const MAX_ACTIVE_VOICES = 24;

function safelyDisconnect(node: AudioNode | undefined): void {
  try {
    node?.disconnect();
  } catch {
    // A closed or interrupted browser audio graph may already be disconnected.
  }
}

function context(): AudioContext | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const AudioContextConstructor = window.AudioContext;
    if (!AudioContextConstructor) return undefined;
    if (!audioContext || audioContext.state === "closed") {
      audioContext = new AudioContextConstructor();
      activeVoices.clear();
    }
    return audioContext;
  } catch {
    return undefined;
  }
}

const melodies: Readonly<Record<SoundName, readonly MelodyNote[]>> = {
  step: [[420, 0, 0.045]],
  bump: [[180, 0, 0.07]],
  pickup: [[620, 0, 0.07], [840, 0.07, 0.1]],
  power: [[520, 0, 0.07], [660, 0.07, 0.07], [820, 0.14, 0.11]],
  powerTick: [[620, 0, 0.065, 0.022, "triangle", 920]],
  unlock: [[410, 0, 0.07], [610, 0.08, 0.13]],
  rescue: [[659, 0, 0.08], [784, 0.07, 0.1], [1047, 0.15, 0.18]],
  friendRescue: [
    [523, 0, 0.08, 0.024, "triangle", 659],
    [659, 0.07, 0.08, 0.025, "triangle", 784],
    [784, 0.14, 0.1, 0.026, "triangle", 1047],
    [1047, 0.23, 0.12, 0.028, "sine", 1319],
    [784, 0.34, 0.18, 0.019, "sine"],
    [1047, 0.34, 0.18, 0.022, "sine"],
    [1319, 0.34, 0.24, 0.027, "sine", 1568],
  ],
  // A compact spring launch, bright stretch and rubbery rebound. The final
  // voice ends at 280ms so the cue reads as one crisp "boing" within the
  // 540ms hop presentation, without masking a sound made on landing.
  jump: [
    [165, 0, 0.145, 0.04, "triangle", 660],
    [330, 0.012, 0.16, 0.018, "sine", 990],
    [1175, 0.035, 0.055, 0.009, "sine", 880],
    [660, 0.09, 0.19, 0.032, "sine", 300],
  ],
  combatClash: [
    [185, 0, 0.12, 0.045, "sawtooth", 92],
    [980, 0, 0.08, 0.025, "square", 620],
    [1320, 0.025, 0.07, 0.018, "triangle", 760],
  ],
  combatSparks: [
    [1480, 0, 0.045, 0.018, "square", 1120],
    [1880, 0.045, 0.045, 0.017, "square", 1420],
    [2260, 0.09, 0.055, 0.015, "triangle", 1680],
    [1720, 0.14, 0.05, 0.014, "square", 1240],
  ],
  combatImpact: [
    [150, 0, 0.2, 0.052, "sawtooth", 58],
    [88, 0.015, 0.24, 0.045, "triangle", 42],
    [720, 0, 0.075, 0.018, "square", 260],
  ],
  combatPowerUp: [
    [440, 0, 0.07, 0.02, "triangle", 554],
    [523, 0.095, 0.07, 0.021, "triangle", 659],
    [622, 0.18, 0.07, 0.022, "triangle", 784],
    [740, 0.25, 0.07, 0.023, "triangle", 932],
    [880, 0.31, 0.08, 0.025, "triangle", 1109],
    [1047, 0.36, 0.14, 0.028, "sine", 1397],
  ],
  combatVictory: [
    [523, 0, 0.09, 0.023, "triangle"],
    [659, 0.07, 0.09, 0.024, "triangle"],
    [784, 0.14, 0.11, 0.025, "triangle"],
    [1047, 0.23, 0.2, 0.029, "sine", 1319],
    [1319, 0.34, 0.16, 0.022, "sine", 1568],
  ],
  win: [
    [523, 0, 0.1],
    [659, 0.09, 0.1],
    [784, 0.18, 0.12],
    [659, 0.3, 0.22, 0.022],
    [784, 0.3, 0.22, 0.024],
    [1047, 0.3, 0.28, 0.04],
    [1319, 0.48, 0.18, 0.025],
  ],
  reward: [
    [880, 0, 0.08, 0.028],
    [1175, 0.05, 0.1, 0.03],
    [1397, 0.12, 0.14, 0.032],
    [1760, 0.21, 0.18, 0.026],
  ],
  lose: [[310, 0, 0.11], [245, 0.12, 0.18]],
  title: [
    [523, 0, 0.11, 0.018],
    [659, 0.1, 0.11, 0.019],
    [784, 0.2, 0.13, 0.02],
    [1047, 0.31, 0.2, 0.026],
    [1319, 0.45, 0.17, 0.018],
  ],
  menu: [[740, 0, 0.055, 0.018]],
  select: [[587, 0, 0.065, 0.02], [784, 0.055, 0.095, 0.022]],
  achievement: [
    [659, 0, 0.09, 0.023],
    [784, 0.08, 0.09, 0.024],
    [988, 0.16, 0.14, 0.026],
    [1319, 0.28, 0.22, 0.03],
  ],
  stamp: [
    [196, 0, 0.075, 0.022, "triangle"],
    [784, 0.08, 0.075, 0.017],
    [1175, 0.14, 0.13, 0.023],
  ],
};

function scheduleNote(
  ctx: AudioContext,
  name: SoundName,
  note: MelodyNote,
  now: number,
): void {
  if (activeVoices.size >= MAX_ACTIVE_VOICES) return;

  const [frequency, delay, length, peakVolume = 0.045, waveform, endFrequency] = note;
  let oscillator: OscillatorNode | undefined;
  let gain: GainNode | undefined;

  try {
    oscillator = ctx.createOscillator();
    gain = ctx.createGain();
    oscillator.type = waveform ?? (name === "bump" ? "triangle" : "sine");
    oscillator.frequency.setValueAtTime(frequency, now + delay);
    if (endFrequency !== undefined) {
      oscillator.frequency.exponentialRampToValueAtTime(
        Math.max(1, endFrequency),
        now + delay + length * 0.82,
      );
    }
    gain.gain.setValueAtTime(0.0001, now + delay);
    gain.gain.exponentialRampToValueAtTime(peakVolume, now + delay + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + length);
    oscillator.connect(gain);
    gain.connect(ctx.destination);

    const scheduledOscillator = oscillator;
    const scheduledGain = gain;
    activeVoices.add(scheduledOscillator);
    scheduledOscillator.addEventListener(
      "ended",
      () => {
        activeVoices.delete(scheduledOscillator);
        safelyDisconnect(scheduledOscillator);
        safelyDisconnect(scheduledGain);
      },
      { once: true },
    );
    scheduledOscillator.start(now + delay);
    scheduledOscillator.stop(now + delay + length + 0.02);
  } catch {
    if (oscillator) activeVoices.delete(oscillator);
    safelyDisconnect(oscillator);
    safelyDisconnect(gain);
  }
}

export function playSound(name: SoundName, muted: boolean): void {
  if (muted) return;
  const ctx = context();
  if (!ctx) return;

  try {
    if (ctx.state !== "running") {
      void ctx.resume().catch(() => undefined);
    }
    const now = ctx.currentTime;
    melodies[name].forEach((note) => scheduleNote(ctx, name, note, now));
  } catch {
    // Audio is a bonus: browser policy or a suspended device must never stop play.
  }
}
