import { test, expect, type Page } from "@playwright/test";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { movePlayer } from "../../src/game/engine";
import { CURATED_LEVELS } from "../../src/game/levels";
import { DIRECTIONS, type Direction } from "../../src/game/types";
import { createDefaultPlayerProgress, PLAYER_PROGRESS_STORAGE_KEY } from "../../src/progress";
import { ACTIVE_RUN_STORAGE_KEY } from "../../src/session";
import { routeCheckpoints, savedFixture, successFixture } from "./v22-input-fixtures";

const root = resolve(import.meta.dirname, "../..");
const output = resolve(process.env.MAZE_UI_EVIDENCE_DIR!);
const source = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
const viewports = [
  { name: "844x390", width: 844, height: 390, safe: { top: 8, right: 12, bottom: 10, left: 12 } },
  { name: "780x312", width: 780, height: 312, safe: { top: 6, right: 10, bottom: 8, left: 10 } },
  { name: "568x320", width: 568, height: 320, safe: { top: 8, right: 14, bottom: 10, left: 14 } },
  { name: "960x540", width: 960, height: 540, safe: { top: 0, right: 0, bottom: 0, left: 0 } },
] as const;

const checkpoints = routeCheckpoints().filter(checkpoint => checkpoint.before.status === "playing");
const dense = checkpoints.sort((a, b) => {
  const score = (checkpoint: (typeof checkpoints)[number]) => checkpoint.before.rescuedAnimalIds.length * 1_000
    + checkpoint.before.collectedObjectIds.length * 100 + checkpoint.level.objective.length + checkpoint.level.width * checkpoint.level.height;
  return score(b) - score(a);
})[0]!;
const snapshot = savedFixture(dense, "v22-ui-compact");
const progress = createDefaultPlayerProgress(CURATED_LEVELS.length);
const feedback = successFixture("animal-rescued");
const feedbackSnapshot = savedFixture(feedback, "v22-ui-compact-feedback");
const longestObjective = CURATED_LEVELS.reduce((best, level) => level.objective.length > best.objective.length ? level : best);
const content = checkpoints.filter(checkpoint => checkpoint.level.id === longestObjective.id).reduce((best, checkpoint) => {
  const total = (state: typeof checkpoint.before) => state.power * 1_000_000 + state.goldStarsCollected * 1_000 + state.sciencePointsCollected;
  return total(checkpoint.before) > total(best.before) ? checkpoint : best;
});
const contentSnapshot = savedFixture(content, "v22-ui-compact-content");
const blocked = DIRECTIONS.find(direction => !movePlayer(dense.level, dense.before, direction).moved);
const keys: Record<Direction, string> = { up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight" };

type Rect = { x: number; y: number; width: number; height: number; right: number; bottom: number };

async function settle(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>(done => requestAnimationFrame(() => requestAnimationFrame(() => done())));
  });
}

async function load(page: Page, selected = snapshot, selectedProgress = progress) {
  await page.addInitScript(({ runKey, progressKey, selected, selectedProgress }) => {
    localStorage.clear();
    localStorage.setItem(runKey, JSON.stringify(selected));
    localStorage.setItem(progressKey, JSON.stringify(selectedProgress));
  }, { runKey: ACTIVE_RUN_STORAGE_KEY, progressKey: PLAYER_PROGRESS_STORAGE_KEY, selected, selectedProgress });
}

async function enter(page: Page, screen: "gameplay" | "book", safe: (typeof viewports)[number]["safe"]) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.addStyleTag({ content: `:root{--safe-top:${safe.top}px!important;--safe-right:${safe.right}px!important;--safe-bottom:${safe.bottom}px!important;--safe-left:${safe.left}px!important}` });
  await page.locator(".front-door-play").click();
  if (screen === "gameplay") {
    await page.locator(".title-play-button").click();
    await expect(page.locator(".play-shell")).toBeVisible();
  } else {
    await page.getByRole("button", { name: "Ame's adventure book", exact: true }).click();
    await page.getByRole("tab", { name: "Achievements", exact: true }).click();
    await expect(page.locator(".badge-card").first()).toBeVisible();
  }
  await page.addStyleTag({ content: "*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition-duration:0s!important}" });
  await settle(page);
}

async function gameplayMetrics(page: Page) {
  return page.evaluate(() => {
    const rect = (element: Element): Rect => {
      const box = element.getBoundingClientRect();
      return { x: box.x, y: box.y, width: box.width, height: box.height, right: box.right, bottom: box.bottom };
    };
    const one = (selector: string) => rect(document.querySelector<HTMLElement>(selector)!);
    const equipment = [...document.querySelectorAll<HTMLElement>(".rescue-card h3,.bag-card h3,.rescue-friend,.inventory-slot")]
      .map(element => ({ label: element.textContent?.replace(/\s+/g, " ").trim() ?? "", ...rect(element) }));
    const sectors = [...document.querySelectorAll<HTMLElement>(".thumb-pad button")].map(element => rect(element));
    const hud = document.querySelector<HTMLElement>(".adventure-hud")!;
    const root = document.documentElement;
    return {
      map: one(".maze-map-card"), feedback: one(".deck-feedback"), pad: one(".thumb-pad"), board: one(".maze-board"),
      hud: { ...rect(hud), clientHeight: hud.clientHeight, scrollHeight: hud.scrollHeight }, equipment, sectors,
      pageOverflow: { width: root.scrollWidth - root.clientWidth, height: root.scrollHeight - root.clientHeight },
    };
  });
}

async function bookMetrics(page: Page) {
  await page.locator(".badge-card").first().evaluate(element => element.scrollIntoView({ block: "start" }));
  await settle(page);
  return page.evaluate(() => {
    const root = document.documentElement;
    const screen = document.querySelector<HTMLElement>(".achievements-screen")!;
    const scroll = document.querySelector<HTMLElement>(".book-scroll")!;
    const card = document.querySelector<HTMLElement>(".badge-card")!;
    const sr = scroll.getBoundingClientRect(), cr = card.getBoundingClientRect();
    return {
      pageOverflow: { width: root.scrollWidth - root.clientWidth, height: root.scrollHeight - root.clientHeight },
      screenOverflow: screen.scrollHeight - screen.clientHeight,
      cardFullyVisible: cr.top >= sr.top - .5 && cr.bottom <= sr.bottom + .5,
      tabs: [...document.querySelectorAll<HTMLElement>(".book-tabs button span")].map(label => {
        const range = document.createRange(); range.selectNodeContents(label);
        return { label: label.textContent, lineCount: range.getClientRects().length, clientWidth: label.clientWidth, scrollWidth: label.scrollWidth };
      }),
    };
  });
}

test.beforeAll(async () => mkdir(output, { recursive: true }));

test("compact gameplay and Book geometry", async ({ browser }) => {
  const cases = [];
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await load(page);
    await enter(page, "gameplay", viewport.safe);
    if (blocked) {
      await page.locator(".maze-board").focus();
      await page.keyboard.press(keys[blocked]);
      await settle(page);
    }
    const gameplay = await gameplayMetrics(page);
    await page.screenshot({ path: resolve(output, `${viewport.name}-gameplay.png`) });
    const separated = (a: Rect, b: Rect) => a.right <= b.x + .5 || b.right <= a.x + .5 || a.bottom <= b.y + .5 || b.bottom <= a.y + .5;
    expect(gameplay.pageOverflow, `${viewport.name} gameplay page scroll`).toEqual({ width: 0, height: 0 });
    expect(gameplay.board.width, `${viewport.name} square board`).toBeCloseTo(gameplay.board.height, 5);
    expect(gameplay.hud.scrollHeight, `${viewport.name} HUD clipping`).toBeLessThanOrEqual(gameplay.hud.clientHeight);
    expect(gameplay.sectors.every(sector => sector.width >= 47.9 && sector.height >= 47.9), `${viewport.name} pad sectors`).toBe(true);
    expect(gameplay.equipment.every(item => item.x >= gameplay.hud.x - .5 && item.right <= gameplay.hud.right + .5 && item.y >= gameplay.hud.y - .5 && item.bottom <= gameplay.hud.bottom + .5), `${viewport.name} collection containment`).toBe(true);
    expect(gameplay.equipment.every(item => separated(gameplay.map, item)), `${viewport.name} full map/equipment overlap: ${JSON.stringify(gameplay.equipment)}`).toBe(true);
    expect(separated(gameplay.map, gameplay.pad), `${viewport.name} map/pad overlap`).toBe(true);
    expect(separated(gameplay.map, gameplay.feedback), `${viewport.name} map/feedback overlap`).toBe(true);
    expect(separated(gameplay.feedback, gameplay.pad), `${viewport.name} feedback/pad overlap`).toBe(true);

    await enter(page, "book", viewport.safe);
    const book = await bookMetrics(page);
    await page.screenshot({ path: resolve(output, `${viewport.name}-book-achievements.png`) });
    expect(book.pageOverflow, `${viewport.name} Book page scroll`).toEqual({ width: 0, height: 0 });
    expect(book.screenOverflow, `${viewport.name} Book deck scroll`).toBe(0);
    expect(book.cardFullyVisible, `${viewport.name} complete Book card`).toBe(true);
    expect(book.tabs.every(tab => tab.lineCount === 1 && tab.scrollWidth <= tab.clientWidth), `${viewport.name} whole Book tabs`).toBe(true);
    cases.push({ viewport, gameplay, book });
    await context.close();
  }
  await writeFile(resolve(output, "geometry.json"), JSON.stringify({ source, fixture: {
    levelId: dense.level.id, revision: dense.level.contentRevision, fingerprint: dense.level.gameplayFingerprint,
    steps: dense.before.steps, prefixSha256: createHash("sha256").update(JSON.stringify(dense.prefix)).digest("hex"),
  }, cases }, null, 2));
});

test("compact real instructional copy and large values", async ({ browser }) => {
  const viewport = viewports[2];
  const feedbackContext = await browser.newContext({ viewport });
  const feedbackPage = await feedbackContext.newPage();
  await load(feedbackPage, feedbackSnapshot);
  await enter(feedbackPage, "gameplay", viewport.safe);
  await feedbackPage.locator(".maze-board").focus();
  await feedbackPage.keyboard.press(keys[feedback.direction]);
  await expect(feedbackPage.locator(".deck-feedback .feedback-bar span")).toContainText("is free! What a lovely friend!");
  await settle(feedbackPage);
  const fit = await feedbackPage.evaluate(() => {
    const within = (child: HTMLElement, parent: HTMLElement) => {
      const c = child.getBoundingClientRect(), p = parent.getBoundingClientRect();
      return c.x >= p.x - .5 && c.right <= p.right + .5 && c.y >= p.y - .5 && c.bottom <= p.bottom + .5;
    };
    const deck = document.querySelector<HTMLElement>(".deck-feedback")!;
    const bar = deck.querySelector<HTMLElement>(".feedback-bar")!;
    const text = bar.querySelector<HTMLElement>("span")!;
    return { bar: { clientHeight: bar.clientHeight, scrollHeight: bar.scrollHeight, within: within(bar, deck) }, text: { clientHeight: text.clientHeight, scrollHeight: text.scrollHeight, within: within(text, deck) } };
  });
  expect(fit.bar.scrollHeight).toBeLessThanOrEqual(fit.bar.clientHeight);
  expect(fit.text.scrollHeight).toBeLessThanOrEqual(fit.text.clientHeight);
  expect(fit.bar.within && fit.text.within, "instructional feedback bounds").toBe(true);
  await feedbackPage.screenshot({ path: resolve(output, `${viewport.name}-long-feedback.png`) });
  await feedbackContext.close();

  const contentContext = await browser.newContext({ viewport });
  const contentPage = await contentContext.newPage();
  await load(contentPage, contentSnapshot, { ...progress, gold: 9_999, sciencePoints: 9_999 });
  await enter(contentPage, "gameplay", viewport.safe);
  await expect(contentPage.locator(".objective-card p")).toHaveText(longestObjective.objective);
  const contentFit = await contentPage.evaluate(() => {
    const within = (child: HTMLElement, parent: HTMLElement) => {
      const c = child.getBoundingClientRect(), p = parent.getBoundingClientRect();
      return c.x >= p.x - .5 && c.right <= p.right + .5 && c.y >= p.y - .5 && c.bottom <= p.bottom + .5;
    };
    const objective = document.querySelector<HTMLElement>(".objective-card")!, text = objective.querySelector<HTMLElement>("p")!;
    const counters = [...document.querySelectorAll<HTMLElement>(".power-counter,.wallet-pill")];
    return { objective: { clientHeight: text.clientHeight, scrollHeight: text.scrollHeight, within: within(text, objective) }, counters: counters.map(counter => ({ clientWidth: counter.clientWidth, scrollWidth: counter.scrollWidth, within: [...counter.children].filter(child => child.getBoundingClientRect().width > 0).every(child => within(child as HTMLElement, counter)) })) };
  });
  expect(contentFit.objective.scrollHeight).toBeLessThanOrEqual(contentFit.objective.clientHeight);
  expect(contentFit.objective.within, "long objective bounds").toBe(true);
  expect(contentFit.counters.every(counter => counter.scrollWidth <= counter.clientWidth && counter.within), `large counter bounds: ${JSON.stringify(contentFit.counters)}`).toBe(true);
  await contentPage.screenshot({ path: resolve(output, `${viewport.name}-long-content.png`) });
  await writeFile(resolve(output, "content-fit.json"), JSON.stringify({ source, feedback: { levelId: feedback.level.id, direction: feedback.direction, fit }, content: { levelId: content.level.id, objective: longestObjective.objective, fit: contentFit } }, null, 2));
  await contentContext.close();
});
