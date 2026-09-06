import { expect, it } from "vitest";
import { DEFAULT_PRESENTATION_PREFERENCES, PRESENTATION_PREFERENCES_KEY, readPresentationPreferences, resolveMotion, writePresentationPreferences } from "./motion";
it("defaults, clamps and round-trips device channel levels without changing progress", () => {
  let saved = JSON.stringify({musicVolume: -1, sfxVolume: 2});
  const storage = {getItem: () => saved, setItem: (_key: string, value: string) => { saved = value; }};
  expect(readPresentationPreferences(storage)).toMatchObject({musicVolume: 0, sfxVolume: 1});
  saved = JSON.stringify({musicVolume: "100", sfxVolume: null});
  expect(readPresentationPreferences(storage)).toMatchObject({musicVolume: .22, sfxVolume: 1});
  writePresentationPreferences({...DEFAULT_PRESENTATION_PREFERENCES, musicVolume: .08, sfxVolume: .91}, storage);
  expect(readPresentationPreferences(storage)).toMatchObject({musicVolume: .08, sfxVolume: .91});
});
it("resolves explicit motion independently of OS and quality", () => {
  expect(resolveMotion("system",true)).toBe("reduced");
  expect(resolveMotion("full",true)).toBe("full");
  expect(resolveMotion("reduced",false)).toBe("reduced");
});
it("handles malformed and denied preference storage without touching progress", () => {
  const values = new Map<string,string>();
  const storage = { getItem:(key:string) => values.get(key) ?? null, setItem:(key:string,value:string) => { values.set(key,value); } };
  expect(writePresentationPreferences({...DEFAULT_PRESENTATION_PREFERENCES,motion:"reduced",quality:"lite",pace:"zippy"},storage)).toBe(true);
  expect([...values.keys()]).toEqual([PRESENTATION_PREFERENCES_KEY]);
  expect(readPresentationPreferences(storage)).toEqual({...DEFAULT_PRESENTATION_PREFERENCES,motion:"reduced",quality:"lite",pace:"zippy"});
  values.set(PRESENTATION_PREFERENCES_KEY,JSON.stringify({motion:"full",quality:"static"}));
  expect(readPresentationPreferences(storage)).toEqual({...DEFAULT_PRESENTATION_PREFERENCES,motion:"full",quality:"static",pace:"regular"});
  values.set(PRESENTATION_PREFERENCES_KEY,JSON.stringify({motion:"reduced",quality:"lite",pace:"turbo"}));
  expect(readPresentationPreferences(storage)).toEqual({...DEFAULT_PRESENTATION_PREFERENCES,motion:"reduced",quality:"lite",pace:"regular"});
  values.set(PRESENTATION_PREFERENCES_KEY,"not-json");
  expect(readPresentationPreferences(storage)).toEqual(DEFAULT_PRESENTATION_PREFERENCES);
  expect(writePresentationPreferences(DEFAULT_PRESENTATION_PREFERENCES,{setItem:() => { throw Error("denied"); }})).toBe(false);
});
