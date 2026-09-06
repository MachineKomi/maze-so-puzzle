import { DEFAULT_MUSIC_VOLUME, DEFAULT_SFX_VOLUME } from "./audioCalibration";
import { expect, it } from "vitest";
import { DEFAULT_PRESENTATION_PREFERENCES, PRESENTATION_PREFERENCES_KEY, readPresentationPreferences, resolveMotion, writePresentationPreferences } from "./motion";
it("defaults, clamps and round-trips device channel levels without changing progress", () => {
  let saved = JSON.stringify({musicVolume: -1, sfxVolume: 2});
  const storage = {getItem: () => saved, setItem: (_key: string, value: string) => { saved = value; }};
  expect(readPresentationPreferences(storage)).toMatchObject({musicVolume: 0, sfxVolume: 1});
  saved = JSON.stringify({musicVolume: "100", sfxVolume: null});
  expect(readPresentationPreferences(storage)).toMatchObject({musicVolume: DEFAULT_MUSIC_VOLUME, sfxVolume: DEFAULT_SFX_VOLUME});
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
  expect(readPresentationPreferences(storage)).toEqual({...DEFAULT_PRESENTATION_PREFERENCES,motion:"full",quality:"static",pace:"regular",musicVolume:.22,sfxVolume:1});
  values.set(PRESENTATION_PREFERENCES_KEY,JSON.stringify({motion:"reduced",quality:"lite",pace:"turbo"}));
  expect(readPresentationPreferences(storage)).toEqual({...DEFAULT_PRESENTATION_PREFERENCES,motion:"reduced",quality:"lite",pace:"regular",musicVolume:.22,sfxVolume:1});
  values.set(PRESENTATION_PREFERENCES_KEY,"not-json");
  expect(readPresentationPreferences(storage)).toEqual(DEFAULT_PRESENTATION_PREFERENCES);
  expect(writePresentationPreferences(DEFAULT_PRESENTATION_PREFERENCES,{getItem:() => null,setItem:() => { throw Error("denied"); }})).toBe(false);
});
it("distinguishes fresh/malformed data from recognizable legacy preferences without writing on read", () => {
  for (const raw of [null, "garbage", "null", "42", "[]", "{}", '{"unrelated":true}', '{"motion":"invalid","musicVolume":"loud"}']) {
    expect(readPresentationPreferences({getItem:() => raw})).toEqual(DEFAULT_PRESENTATION_PREFERENCES);
  }
  for (const value of [{motion:"system"}, {quality:"full"}, {pace:"regular"}, {sfxVolume:.6}, {audioCalibrationVersion:1,motion:"full"}]) {
    expect(readPresentationPreferences({getItem:() => JSON.stringify(value)}).musicVolume).toBe(.22);
  }
  expect(readPresentationPreferences({getItem:() => '{"audioCalibrationVersion":2}'})).toEqual(DEFAULT_PRESENTATION_PREFERENCES);
  expect(readPresentationPreferences({getItem:() => {throw Error("read denied");}})).toEqual(DEFAULT_PRESENTATION_PREFERENCES);
});
it("preserves exact legacy gains through unrelated writes but only widens current SFX", () => {
  for (const musicVolume of [0, 1e-20, .010123456789, .1, .22, .5123456789, 1]) {
    let saved = JSON.stringify({motion:"full",quality:"lite",pace:"zippy",musicVolume,sfxVolume:.642314159});
    const original = saved;
    const storage = {getItem:() => saved,setItem:(_key:string,value:string) => {saved=value;}};
    const parsed = readPresentationPreferences(storage);
    expect(saved).toBe(original);
    expect(writePresentationPreferences({...parsed,pace:"chill"},storage)).toBe(true);
    expect(JSON.parse(saved)).toMatchObject({audioCalibrationVersion:2,musicVolume,sfxVolume:.642314159,pace:"chill"});
    expect(readPresentationPreferences(storage)).toEqual({...parsed,pace:"chill"});
  }
  expect(readPresentationPreferences({getItem:() => '{"sfxVolume":1.3}'}).sfxVolume).toBe(1);
  expect(readPresentationPreferences({getItem:() => '{"audioCalibrationVersion":2,"sfxVolume":1.3}'}).sfxVolume).toBe(1.3);
  expect(readPresentationPreferences({getItem:() => '{"audioCalibrationVersion":2,"sfxVolume":9}'}).sfxVolume).toBe(4/3);
});
it("refuses to overwrite unknown versions, including a newer payload arriving after read", () => {
  let saved = '{"audioCalibrationVersion":2,"musicVolume":0.1234567}';
  let writes = 0;
  const storage = {getItem:() => saved,setItem:(_key:string,value:string) => {writes++;saved=value;}};
  const parsed = readPresentationPreferences(storage);
  for (const version of [3, 99, "future", null]) {
    saved = JSON.stringify({audioCalibrationVersion:version,musicVolume:.2,futureOnly:"keep exact"});
    const original = saved;
    expect(writePresentationPreferences({...parsed,musicVolume:.08},storage)).toBe(false);
    expect(saved).toBe(original);
    expect(writes).toBe(0);
  }
  expect(writePresentationPreferences(parsed,{getItem:() => {throw Error("read denied");},setItem:() => {writes++;}})).toBe(false);
  expect(writes).toBe(0);
});
