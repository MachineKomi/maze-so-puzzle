import { createElement, createRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ASSETS, STICKER_ART } from "../../assets";
import { resolveEnemyArt } from "../../artCatalog";
import { ENEMY_BOOK_LORE } from "../../bookLore";
import { CURATED_LEVELS } from "../../game/levels";
import { ENEMY_STYLE_IDS } from "../../game/types";
import { createDefaultPlayerProgress } from "../../progress";
import { AchievementsScreen, BookBestiary, BookKeepsakes } from "./AdventureBook";

const noDetail = () => {};

describe("Book earned discovery and keepsakes", () => {
  it("does not reveal or request any undiscovered guardian identity", () => {
    const markup = renderToStaticMarkup(createElement(BookBestiary, { discoveredEnemyIds: [], onDetail: noDetail }));
    for (const id of ENEMY_STYLE_IDS) {
      expect(markup).not.toContain(resolveEnemyArt(id).src);
      expect(markup).not.toContain(resolveEnemyArt(id).label);
      expect(markup).not.toContain(ENEMY_BOOK_LORE[id]);
    }
    expect(markup.match(/class="book-character-card book-unknown-card"/g)).toHaveLength(12);
    expect(markup).toContain("0 / 12 met");
  });

  it("shows only genuinely discovered current guardians without granting unknown IDs", () => {
    const markup = renderToStaticMarkup(createElement(BookBestiary, { discoveredEnemyIds: ["moon-bat", "moon-bat", "a-future-monster"], onDetail: noDetail }));
    expect(markup).toContain(resolveEnemyArt("moon-bat").src);
    expect(markup).toContain("Moon Bat");
    expect(markup).toContain("1 / 12 met");
    expect(markup).toContain("book-guardian:moon-bat");
    expect(markup).not.toContain(resolveEnemyArt("goblin").src);
    expect(markup).not.toContain("a-future-monster");
  });

  it("shows recognizable unearned achievement artwork and criteria without claiming or enabling a reward", () => {
    const markup = renderToStaticMarkup(createElement(BookKeepsakes, { progress: createDefaultPlayerProgress(), onDetail: noDetail }));
    expect(markup).toContain(STICKER_ART["first-star"]);
    expect(markup).toContain("My First Maze");
    expect(markup).toContain("Solve the first story maze.");
    expect(markup).toContain("Not earned yet");
    expect(markup).toContain("0 / 15 earned");
    expect(markup).not.toContain("A mystery keepsake");
    expect(markup).not.toContain("data-focus-id=\"achievement:first-star\"");
  });

  it("makes an earned keepsake inspectable while leaving the remaining collection unearned", () => {
    const progress = { ...createDefaultPlayerProgress(), stickers: ["first-star"] as const };
    const markup = renderToStaticMarkup(createElement(BookKeepsakes, { progress, onDetail: noDetail }));
    expect(markup).toContain("data-focus-id=\"achievement:first-star\"");
    expect(markup).toContain("Earned Sticker");
    expect(markup).toContain("1 / 15 earned");
    expect(markup.match(/class="badge-card locked"/g)).toHaveLength(14);
  });

  it("opens one Maze page with five labeled tabs and no eager hidden collection content", () => {
    const markup = renderToStaticMarkup(createElement(AchievementsScreen, {
      progress: createDefaultPlayerProgress(), onDetail: noDetail, unlockedLevelIds: [CURATED_LEVELS[0]!.id],
      activeRun: null, blocked: false, headingRef: createRef<HTMLHeadingElement>(), muted: false,
      onHome: noDetail, onResume: noDetail, onPlayLevel: noDetail, onSurprise: noDetail,
      onRequestReset: noDetail, onToggleSound: noDetail,
    }));
    expect(markup.match(/role="tab"/g)).toHaveLength(5);
    expect(markup.match(/role="tabpanel"/g)).toHaveLength(1);
    expect(markup.match(/aria-selected="true"/g)).toHaveLength(1);
    expect(markup).toContain('data-book-page="mazes"');
    expect(markup).toContain("Your first surprise is waiting.");
    expect(markup).not.toContain("Reset progress");
    expect(markup).not.toContain('class="badge-card');
    expect(markup).not.toContain('class="book-character-card');
    // Poggle's existing portrait is allowed for the Bestiary tab; a hidden enemy source is not.
    expect(markup).toContain(ASSETS.storyProfessorPoggle);
    expect(markup).not.toContain(resolveEnemyArt("goblin").src);
  });
});
