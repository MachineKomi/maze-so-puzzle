export type SoundName =
  | "step"
  | "bump"
  | "pickup"
  | "power"
  | "unlock"
  | "rescue"
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
  unlock: [[410, 0, 0.07], [610, 0.08, 0.13]],
  rescue: [[659, 0, 0.08], [784, 0.07, 0.1], [1047, 0.15, 0.18]],
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

  const [frequency, delay, length, peakVolume = 0.045, waveform] = note;
  let oscillator: OscillatorNode | undefined;
  let gain: GainNode | undefined;

  try {
    oscillator = ctx.createOscillator();
    gain = ctx.createGain();
    oscillator.type = waveform ?? (name === "bump" ? "triangle" : "sine");
    oscillator.frequency.setValueAtTime(frequency, now + delay);
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
