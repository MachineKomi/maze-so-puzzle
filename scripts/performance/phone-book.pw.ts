/** PHONE-02/BOOK-02A production-browser regression and review evidence. */
import { test, expect, type Page } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { CURATED_LEVELS } from "../../src/game/levels";
import { createInitialGameState } from "../../src/game/engine";
import { createDefaultPlayerProgress, PLAYER_PROGRESS_STORAGE_KEY } from "../../src/progress";
import { createActiveRunSnapshot, ACTIVE_RUN_STORAGE_KEY } from "../../src/session";
import { BOOK_FRIEND_IDS, BOOK_GUARDIAN_IDS } from "../../src/bookRoster";
import { DEFAULT_PRESENTATION_PREFERENCES, PRESENTATION_PREFERENCES_KEY } from "../../src/motion";
import { deriveRoute, selectTesterLevel, readUiRouteState, expectUiRouteState, keyForDirection } from "./gameplay-browser";
import { solveLevel } from "../../src/game/solver";

const output = resolve(process.env.MAZE_PERF_EVIDENCE_DIR!, "phone-book");
test.beforeAll(() => mkdir(output, { recursive: true }));
const errors = new WeakMap<Page, string[]>();
test.beforeEach(({ page }) => { const list: string[] = []; errors.set(page, list); page.on("pageerror", e => list.push(e.message)); });
test.afterEach(({ page }) => { expect(errors.get(page)).toEqual([]); });
async function home(page: Page) {
  await page.goto("/"); await page.getByRole("button", { name: "Play", exact: true }).click();
}
async function capture(page: Page, name: string) {
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].filter(i => i.complete).map(i => i.decode().catch(() => {}))); });
  await page.screenshot({ path: resolve(output, `${name}.png`) });
}

test("PHONE02 cold and resized threshold layouts agree and phone advice stays readable", async ({ page }) => {
  for (const height of [449,450,451,312]) {
    await page.setViewportSize({width:780,height}); await page.goto("/");
    const expected = height < 450;
    await expect.poll(() => page.locator(".game-stage").evaluate(e => e.hasAttribute("data-phone-fit"))).toBe(expected);
    const cold = await page.locator(".game-stage").evaluate(e => ({w:e.clientWidth,h:e.clientHeight}));
    if (expected) {
      const advice=page.locator(".large-screen-note"); await expect(advice).toBeVisible();
      expect(await advice.evaluate(e => parseFloat(getComputedStyle(e).fontSize)*e.getBoundingClientRect().width/(e as HTMLElement).offsetWidth)).toBeGreaterThanOrEqual(10.9);
    }
    await page.setViewportSize({width:780,height:600});
    await expect.poll(() => page.locator(".game-stage").evaluate(e => e.hasAttribute("data-phone-fit"))).toBe(false);
    await page.setViewportSize({width:780,height});
    await expect.poll(() => page.locator(".game-stage").evaluate(e => ({w:e.clientWidth,h:e.clientHeight}))).toEqual(cold);
  }
});

test("BOOK02 unavailable silhouette art stays neutral without granting discoveries", async ({ page }) => {
  await page.setViewportSize({width:780,height:312}); await home(page);
  await page.route("**/*", route => route.request().resourceType()==="image" ? route.abort() : route.continue());
  await page.getByRole("button", {name:"Ame's adventure book",exact:true}).click();
  await page.getByRole("tab",{name:"Friends",exact:true}).click();
  await expect(page.locator(".book-count")).toHaveText("0 / 32 met");
  await expect.poll(() => page.locator(".book-silhouette .art-fallback").count()).toBeGreaterThan(0);
  expect(await page.locator(".book-silhouette .art-fallback").evaluateAll(es => es.every(e => getComputedStyle(e).color === "rgba(0, 0, 0, 0)"))).toBe(true);
  await expect(page.locator("button.book-character-card")).toHaveCount(0);
  await capture(page,"missing-friend-art");
});

test("BOOK02 mounted field-art memory stays bounded on phone DPR3 and tablet DPR2", async ({ browser }) => {
  const rows = [];
  for (const [width,height,deviceScaleFactor] of [[780,312,3],[1194,834,2]]) {
    const context=await browser.newContext({viewport:{width,height},deviceScaleFactor,baseURL:"http://127.0.0.1:4173"});
    try {
      const page=await context.newPage(); const faults:string[]=[]; page.on("pageerror",e=>faults.push(e.message));
      await home(page); await page.getByRole("button",{name:"Ame's adventure book",exact:true}).click();
      for (const [tab,total] of [["Friends",32],["Bestiary",12]] as const) {
        await page.getByRole("tab",{name:tab,exact:true}).click();
        await expect(page.locator(".book-unknown-card")).toHaveCount(total);
        await page.waitForTimeout(300);
        const images=await page.locator(".book-character-grid img").evaluateAll(es=>es.map(e=>{const i=e as HTMLImageElement;return {url:i.currentSrc,width:i.naturalWidth,height:i.naturalHeight};}));
        expect(images.filter(i=>i.width>0).length).toBeGreaterThan(0);
        const decoded=images.reduce((sum,i)=>sum+i.width*i.height*4,0);
        expect(decoded).toBeLessThanOrEqual(total*256*256*4);
        expect(images.every(i=>!i.url.includes("/presentation/"))).toBe(true);
        rows.push({width,height,deviceScaleFactor,tab,decoded,images});
      }
      expect(faults).toEqual([]);
    } finally { await context.close(); }
  }
  await writeFile(resolve(output,"retina-book-resources.json"),JSON.stringify(rows,null,2));
});

for (const [width, height, inset] of [[780,312,0],[844,390,0],[568,320,0],[780,312,12],[844,390,12],[1194,834,0],[1280,720,0],[960,540,0]]) {
  test(`PHONE02 composed geometry ${width}x${height} inset${inset}`, async ({ page }) => {
    await page.setViewportSize({ width: width!, height: height! });
    const rows = [];
    for (const index of [0,7,10,11,15]) {
      await selectTesterLevel(page, CURATED_LEVELS[index]!);
      if (inset) await page.addStyleTag({ content: `:root { --safe-left:${inset}px;--safe-right:${inset}px;--safe-top:${inset}px;--safe-bottom:${inset}px; }` });
      await expect.poll(() => page.locator('.game-stage').evaluate(e => Math.round(e.getBoundingClientRect().height))).toBe(height! - (height! < 450 ? inset! * 2 : 0));
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(200);
      const geometry = await page.evaluate(() => {
        const box = (selector: string) => document.querySelector(selector)!.getBoundingClientRect().toJSON();
        const hud = document.querySelector(".adventure-hud")!;
        return { board: box(".maze-board"), deck: box(".adventure-hud"), overview: box(".adventure-overview"), map: box(".maze-map-card"), bag: box(".adventure-equipment"), pad: box(".thumb-pad"), feedback: box(".deck-feedback"),
          scroll: hud.scrollHeight - hud.clientHeight,
          targets: [...hud.querySelectorAll("button")].map(e => { const r = e.getBoundingClientRect(); return { name: e.getAttribute("data-focus-id"), rect: r.toJSON(), hit: e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)) }; }) };
      });
      rows.push({ maze: CURATED_LEVELS[index]!.id, ...geometry });
      await writeFile(resolve(output, `geometry-${width}-${height}-${inset}.json`), JSON.stringify(rows,null,2));
      expect(geometry.scroll).toBeLessThanOrEqual(1);
      expect(Math.abs(geometry.board.width - geometry.board.height)).toBeLessThan(1);
      for (const r of [geometry.map,geometry.bag,geometry.pad]) {
        expect(r.top).toBeGreaterThanOrEqual(geometry.deck.top - 1); expect(r.bottom).toBeLessThanOrEqual(geometry.deck.bottom + 1);
        expect(r.left).toBeGreaterThanOrEqual(geometry.deck.left - 1); expect(r.right).toBeLessThanOrEqual(geometry.deck.right + 1);
      }
      expect(geometry.map.bottom).toBeLessThanOrEqual(geometry.feedback.top + 1);
      expect(geometry.bag.bottom).toBeLessThanOrEqual(geometry.feedback.top + 1);
      expect(geometry.targets.every(t => t.hit)).toBe(true);
      expect(geometry.deck.left).toBeGreaterThanOrEqual(inset!); expect(geometry.deck.bottom).toBeLessThanOrEqual(height! - inset! + 1);
      if (height! < 450) { expect(geometry.pad.width).toBeGreaterThan(78); await expect(page.locator(".utility-row")).toBeVisible(); }
      if (index === 10 || index === 11) await capture(page, `game-${width}-${height}-${inset}-${index+1}`);
    }
  });
}

for (const cohort of ["empty", "partial", "full"] as const) for (const [width,height] of [[780,312],[1194,834]]) {
  test(`BOOK02 ${cohort} discovery pages ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width: width!, height: height! });
    const progress = { ...createDefaultPlayerProgress(),
      discoveredFriendIds: cohort === "full" ? BOOK_FRIEND_IDS : cohort === "partial" ? ["bunny", "tessera-dolphin"] : [],
      discoveredEnemyIds: cohort === "full" ? BOOK_GUARDIAN_IDS : cohort === "partial" ? ["goblin"] : [] };
    await page.addInitScript(({ key, progress }) => localStorage.setItem(key, JSON.stringify(progress)), { key: PLAYER_PROGRESS_STORAGE_KEY, progress });
    await home(page); await page.getByRole("button", { name: "Ame's adventure book", exact: true }).click();
    const resources = [];
    for (const [tab, total, known] of [["Friends",32,progress.discoveredFriendIds.length],["Bestiary",12,progress.discoveredEnemyIds.length]] as const) {
      await page.getByRole("tab", { name: tab, exact: true }).click();
      await expect(page.locator(".book-count")).toContainText(`${known} / ${total} met`);
      await expect(page.locator(".book-unknown-card")).toHaveCount(total-known);
      expect(await page.locator(".book-unknown-card").evaluateAll(cards => cards.every(c => c.textContent === "" && !c.querySelector("button,[tabindex],strong") && [...c.querySelectorAll("img")].every(i => i.alt === "" && getComputedStyle(i).filter === "brightness(0)")))).toBe(true);
      await page.waitForTimeout(250); await capture(page, `${cohort}-${tab}-${width}`);
      resources.push(await page.evaluate(() => ({ images: [...document.querySelectorAll<HTMLImageElement>(".book-character-grid img")].map(i => ({src:i.currentSrc,width:i.naturalWidth,height:i.naturalHeight,role:i.dataset.artRole,complete:i.complete})), requests: performance.getEntriesByType("resource").filter(e => /\/assets\//.test(e.name)).map(e => ({url:e.name,bytes:(e as PerformanceResourceTiming).encodedBodySize})) })));
      if (known) {
        const card = page.locator("button.book-character-card").first(); await card.click(); await expect(page.getByRole("dialog")).toBeVisible();
        await page.keyboard.press("Escape"); await expect(card).toBeFocused();
      }
    }
    await writeFile(resolve(output, `resources-${cohort}-${width}.json`), JSON.stringify(resources,null,2));
  });
}

test("BOOK02 normal caged encounter survives reload, while tester and Book visits grant nothing", async ({ page }) => {
  await page.setViewportSize({width:780,height:312}); await home(page);
  await page.getByRole("button", {name:"Ame's adventure book",exact:true}).click(); await page.getByRole("tab",{name:"Friends",exact:true}).click();
  await expect(page.locator(".book-count")).toHaveText("0 / 32 met");
  await page.locator(".book-back").click(); await page.locator(".title-play-button").click();
  await expect(page.locator(".dialog-story")).toBeVisible();
  const read = () => page.evaluate(key => JSON.parse(localStorage.getItem(key) ?? "null"), PLAYER_PROGRESS_STORAGE_KEY);
  expect((await read())?.discoveredFriendIds ?? []).toEqual([]);
  await page.locator('.dialog-story [data-focus-id="story-advance"]').click();
  const friend = CURATED_LEVELS[0]!.objects.find(o => o.kind === "animal")!;
  await expect.poll(async () => (await read())?.discoveredFriendIds).toEqual([friend.kind === "animal" ? friend.species : ""]);
  expect((await read()).totalAnimalsRescued).toBe(0);
  const stored = await read(); await page.reload(); await home(page);
  expect(await read()).toEqual(stored);
  await selectTesterLevel(page,CURATED_LEVELS[15]!); await page.waitForTimeout(250); expect(await read()).toEqual(stored);
});

test("PHONE02 scaled board taps, captured pad drag, dialog isolation and rotation cancel input", async ({ browser }) => {
  const ctx = await browser.newContext({viewport:{width:780,height:312},deviceScaleFactor:3,hasTouch:true});
  const page = await ctx.newPage();
  try {
    const level = CURATED_LEVELS[10]!;
    const route = deriveRoute(level, solveLevel(level,{requireAllAnimals:false}).directions);
    await selectTesterLevel(page, level); await page.emulateMedia({reducedMotion:"reduce"});
    const initial = await readUiRouteState(page), first = route[0]!;
    const target = await page.locator('.player-layer').evaluate((e, direction) => { const r=e.getBoundingClientRect(), board=e.closest('.maze-board')!.getBoundingClientRect(); const cell=board.width/6; return {x:r.x+r.width/2+(direction==="right"?cell:direction==="left"?-cell:0),y:r.y+r.height/2+(direction==="down"?cell:direction==="up"?-cell:0)}; }, first.direction);
    await page.touchscreen.tap(target.x,target.y); await expectUiRouteState(page,first.result.state);
    const after = await readUiRouteState(page); expect(after.steps).not.toBe(initial.steps);
    await page.locator('[data-focus-id="sound"]').click(); const paused=await readUiRouteState(page);
    await page.keyboard.press("ArrowRight"); expect(await readUiRouteState(page)).toEqual(paused);
    await page.setViewportSize({width:312,height:780}); await expect(page.locator(".modal-backdrop")).toHaveAttribute("inert", "");
    await page.setViewportSize({width:780,height:312}); await expect(page.locator(".modal-backdrop")).not.toHaveAttribute("inert"); await page.keyboard.press("Escape");
    await expect(page.locator('[data-focus-id="sound"]')).toBeFocused();
    const pad=page.locator('.thumb-pad'), box=(await pad.boundingBox())!;
    await page.mouse.move(box.x+box.width/2,box.y+box.height/2); await page.mouse.down(); await page.mouse.move(box.x+box.width-3,box.y+box.height/2); await page.waitForTimeout(240); await page.mouse.up();
    const released=await readUiRouteState(page); await page.waitForTimeout(350); expect(await readUiRouteState(page)).toEqual(released);
  } finally { await ctx.close(); }
});

test("PHONE02 recommended audio balance is explicit, preserves mute and does not restart progress", async ({ page }) => {
  await page.setViewportSize({width:780,height:312}); await home(page); await page.locator('.quick-sound-settings').click();
  await expect(page.locator('#music-volume')).toHaveValue("65"); await expect(page.locator('#sfx-volume')).toHaveValue("85");
  await page.locator('#music-volume').fill("20"); await page.locator('#sfx-volume').fill("0");
  await page.locator('[data-focus-id="sound:mute"]').click();
  const muted=await page.locator('[data-focus-id="sound:mute"]').getAttribute("aria-pressed");
  await page.getByRole('button',{name:'Recommended balance',exact:true}).click();
  await expect(page.locator('#music-volume')).toHaveValue("65"); await expect(page.locator('#sfx-volume')).toHaveValue("85");
  await expect(page.locator('[data-focus-id="sound:mute"]')).toHaveAttribute("aria-pressed",muted!);
  await capture(page,'sound-recommended-phone');
  const prefs=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),PRESENTATION_PREFERENCES_KEY);
  expect(prefs).toMatchObject({musicVolume:DEFAULT_PRESENTATION_PREFERENCES.musicVolume,sfxVolume:DEFAULT_PRESENTATION_PREFERENCES.sfxVolume});
});
