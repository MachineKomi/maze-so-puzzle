import { createContext, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { readPresentationPreferences, resolveMotion, writePresentationPreferences, type MotionMode, type PresentationPreferences, type PresentationPatch } from "../motion";
import { setAudioLevels } from "../audioMix";
import { configureMusic } from "../music";

const PresentationContext = createContext<{
  preferences: PresentationPreferences;
  motion: MotionMode;
  saveFailed: boolean;
  update: (patch: PresentationPatch) => void;
} | null>(null);

export function PresentationProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState(readPresentationPreferences);
  const [systemReduced, setSystemReduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [saveFailed, setSaveFailed] = useState(false);
  const motion = resolveMotion(preferences.motion, systemReduced);
  useLayoutEffect(() => {
    setAudioLevels(preferences);
    configureMusic({ volume: preferences.musicVolume });
  }, [preferences.musicVolume, preferences.sfxVolume]);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setSystemReduced(query.matches);
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  useLayoutEffect(() => {
    document.documentElement.dataset.motion = motion;
    document.documentElement.dataset.quality = preferences.quality;
  }, [motion, preferences.quality]);
  return <PresentationContext value={{ preferences, motion, saveFailed, update: (patch) => {
    const next = { ...preferences, ...patch };
    setPreferences(next);
    setSaveFailed(!writePresentationPreferences(next));
  } }}>{children}</PresentationContext>;
}

export function usePresentation() {
  const context = useContext(PresentationContext);
  if (!context) throw new Error("PresentationProvider is required");
  return context;
}
