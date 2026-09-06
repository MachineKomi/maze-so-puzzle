import { activateAudioFromUserGesture, audioEpoch, disconnectAudio, onAudioSilence, readyEffectsOutput } from "./audioMix";

export type SoundName =
  | "step"
  | "bump"
  | "pickup"
  | "treasure"
  | "science"
  | "power"
  | "powerTick"
  | "unlock"
  | "doorOpen"
  | "rescue"
  | "friendRescue"
  | "jump"
  | "portal"
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

const activeVoices = new Map<OscillatorNode, GainNode>();
const MAX_ACTIVE_VOICES = 24;

function safelyDisconnect(node: AudioNode | undefined): void {
  disconnectAudio(node);
}

onAudioSilence(() => {
  for (const [voice, gain] of activeVoices) {
    try { voice.stop(); } catch { /* A finished voice is already silent. */ }
    safelyDisconnect(voice); safelyDisconnect(gain);
  }
  activeVoices.clear();
});

const melodies: Readonly<Record<SoundName, readonly MelodyNote[]>> = {
  step: [[420, 0, 0.045]],
  bump: [[180, 0, 0.07]],
  pickup: [[620, 0, 0.07], [840, 0.07, 0.1]],
  treasure: [
    [784, 0, 0.06, 0.024, "triangle"],
    [1047, 0.055, 0.07, 0.026, "triangle"],
    [1319, 0.11, 0.08, 0.027, "sine"],
    [1568, 0.18, 0.14, 0.024, "sine"],
  ],
  science: [
    [440, 0, 0.06, 0.02, "square", 660],
    [660, 0.07, 0.06, 0.021, "square", 990],
    [990, 0.14, 0.08, 0.022, "triangle", 1320],
    [1320, 0.22, 0.14, 0.022, "sine"],
  ],
  power: [[520, 0, 0.07], [660, 0.07, 0.07], [820, 0.14, 0.11]],
  powerTick: [[620, 0, 0.065, 0.022, "triangle", 920]],
  unlock: [[410, 0, 0.07], [610, 0.08, 0.13]],
  doorOpen: [
    [196, 0, 0.18, 0.025, "triangle", 392],
    [523, 0.06, 0.12, 0.023, "sine", 784],
    [659, 0.18, 0.13, 0.026, "triangle", 988],
    [784, 0.31, 0.15, 0.027, "triangle", 1175],
    [1047, 0.46, 0.18, 0.03, "sine", 1568],
    [1568, 0.68, 0.22, 0.022, "sine", 1047],
    [2093, 0.84, 0.28, 0.019, "sine", 1319],
  ],
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
  portal: [
    [440, 0, 0.11, 0.022, "sine", 660],
    [659, 0.07, 0.12, 0.024, "triangle", 988],
    [988, 0.15, 0.13, 0.026, "sine", 1480],
    [1480, 0.24, 0.08, 0.018, "sine", 740],
    [740, 0.31, 0.17, 0.026, "triangle", 1175],
    [1175, 0.41, 0.2, 0.024, "sine", 1568],
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
  output: GainNode,
  name: SoundName,
  note: MelodyNote,
  now: number,
): OscillatorNode | undefined {
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
    gain.connect(output);

    const scheduledOscillator = oscillator;
    const scheduledGain = gain;
    activeVoices.set(scheduledOscillator, scheduledGain);
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
    return scheduledOscillator;
  } catch {
    if (oscillator) activeVoices.delete(oscillator);
    safelyDisconnect(oscillator);
    safelyDisconnect(gain);
  }
}

export interface SoundHandle { cancel(): void }

/** One soft, pitched grouped arrival through the existing calibrated bus/cap.
 * This owns only its note; cancelling it cannot silence a combat/music owner. */
export function playRewardArrival(step: number, muted: boolean): SoundHandle {
  const empty = { cancel() {} };
  if (muted) return empty;
  const ready = readyEffectsOutput();
  if (!ready) return empty;
  const frequency = [784, 880, 1047, 1175, 1319][Math.max(0, Math.min(4, Math.floor(step)))]!;
  const oscillator = scheduleNote(ready.context, ready.output, "powerTick",
    [frequency, 0, .065, .018, "sine", frequency * 1.12], ready.context.currentTime);
  let cancelled = false;
  return { cancel() {
    if (!oscillator || cancelled) return;
    cancelled = true;
    const gain = activeVoices.get(oscillator);
    if (!gain) return;
    try {
      const now = ready.context.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setTargetAtTime(.0001, now, .004);
      oscillator.stop(now + .016);
    } catch { /* Already ended or device disconnected. */ }
  } };
}

export function playSound(name: SoundName, muted: boolean): void {
  if (muted) return;
  const ready = readyEffectsOutput();
  if (!ready) return; // Expire cues, never replay them after a delayed resume.
  const ctx = ready.context;

  try {
    const now = ctx.currentTime;
    melodies[name].forEach((note) => scheduleNote(ctx, ready.output, name, note, now));
  } catch {
    // Audio is a bonus: browser policy or a suspended device must never stop play.
  }
}

/** An explicit preview may wait briefly for activation, but never outlive mute/hide. */
export async function testSoundFromUserGesture(muted: boolean, signal?: AbortSignal): Promise<void> {
  if (muted || signal?.aborted) return;
  const token = audioEpoch();
  if (await activateAudioFromUserGesture() && token === audioEpoch() && !signal?.aborted) playSound("select", false);
}
