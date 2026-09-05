import { expect, it } from "vitest";
import { DEFAULT_PRESENTATION_PREFERENCES, PRESENTATION_PREFERENCES_KEY, readPresentationPreferences, resolveMotion, writePresentationPreferences } from "./motion";
it("resolves explicit motion independently of OS and quality", () => {
  expect(resolveMotion("system",true)).toBe("reduced");
  expect(resolveMotion("full",true)).toBe("full");
  expect(resolveMotion("reduced",false)).toBe("reduced");
});
it("handles malformed and denied preference storage without touching progress", () => {
  const values = new Map<string,string>();
  const storage = { getItem:(key:string) => values.get(key) ?? null, setItem:(key:string,value:string) => { values.set(key,value); } };
  expect(writePresentationPreferences({motion:"reduced",quality:"lite"},storage)).toBe(true);
  expect([...values.keys()]).toEqual([PRESENTATION_PREFERENCES_KEY]);
  expect(readPresentationPreferences(storage)).toEqual({motion:"reduced",quality:"lite"});
  values.set(PRESENTATION_PREFERENCES_KEY,"not-json");
  expect(readPresentationPreferences(storage)).toEqual(DEFAULT_PRESENTATION_PREFERENCES);
  expect(writePresentationPreferences(DEFAULT_PRESENTATION_PREFERENCES,{setItem:() => { throw Error("denied"); }})).toBe(false);
});
