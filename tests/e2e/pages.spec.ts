/**
 * @file Page content (U3–U5, design context §6 A1–A5, F1, F2, F9): the parts each page must show,
 * in English and in a sample of locales, from the inventory, not from the string tables.
 */
import { expect, test, visit } from "./_fixtures";
import { SAMPLE_LOCALES } from "./_site";

test("home: hero, three sheets, stamp, slot and three stickers", async ({ page }) => {
  await visit(page, "/en/");
  const hero = page.locator('[data-island="home-hero"]');
  await expect(hero.locator("h1")).toHaveText("Surely worth playing.");
  for (const plane of ["sun", "far", "mid", "near"]) {
    await expect(hero.locator(`[data-plane="${plane}"]`)).toHaveCount(1);
  }
  await expect(page.locator("#home-games")).toHaveText("Our games");
  await expect(page.locator("#home-about")).toHaveText("About us");
  await expect(page.locator("#home-support")).toHaveText("Need help?");
  await expect(page.locator('[data-component="paper-photo"]')).toBeVisible();
  await expect(page.locator('[data-component="coming-soon-slot"]')).toBeVisible();
  for (const sticker of ["gift-box", "tea-mug", "envelope"]) {
    await expect(page.locator(`[data-sticker="${sticker}"]`)).toHaveCount(1);
  }
});

test("about: kana meaning, three points, the mug", async ({ page }) => {
  await visit(page, "/en/about/");
  await expect(page.locator('[data-component="paper-band"]')).toBeVisible();
  await expect(page.locator('[data-component="kitto-meaning"]')).toContainText("きっと");
  await expect(page.locator('[data-sticker="tea-mug"]')).toHaveCount(1);
});

test("games: the game card and the coming-soon slot", async ({ page }) => {
  await visit(page, "/en/games/");
  const card = page.locator('[data-component="game-card"]');
  await expect(card).toContainText("A Memory Missing");
  await expect(card.getByRole("link", { name: "About the game" })).toHaveAttribute(
    "href",
    "/en/games/memory-missing/"
  );
  await expect(page.locator('[data-component="coming-soon-slot"]')).toBeVisible();
  await expect(page.locator('[data-sticker="gift-box"]')).toHaveCount(1);
});

test("game page: tags, story, where to play, board, features, help", async ({ page }) => {
  await visit(page, "/en/games/memory-missing/");
  await expect(page.locator('[data-component="breadcrumb"] a')).toHaveAttribute(
    "href",
    "/en/games/"
  );
  await expect(page.locator('[data-component="tag"]')).toHaveCount(4);
  for (const id of [
    "game-story",
    "game-platforms",
    "merge-board-title",
    "game-features",
    "game-help"
  ]) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
  await expect(page.getByRole("heading", { name: "Merge to find clues" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Plays offline" })).toBeVisible();
});

for (const locale of SAMPLE_LOCALES.filter(each => each !== "en")) {
  test(`${locale}: pages are translated, not English`, async ({ page }) => {
    await visit(page, `/${locale}/`);
    await expect(page.locator("h1")).not.toHaveText("Surely worth playing.");
    await visit(page, `/${locale}/support/`);
    await expect(page.locator("h1")).not.toHaveText("Need help? Write to us.");
    await expect(page.locator("[data-email-address]")).toHaveText("support@kitto.studio");
    await visit(page, `/${locale}/privacy/`);
    await expect(page.locator("[data-legal-fallback]")).toHaveCount(0);
  });
}
