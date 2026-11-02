/**
 * @file Motion with reduced motion off (the rest of the suite runs reduced): the home parallax
 * moves its planes on scroll, pop-up stickers spring up in view and replay on a click, the kana
 * drop replays, a board merge animates, and the lightbox animates open and closed, all error-free.
 * With reduced motion on, the same parts stand still and stay visible.
 */
import { expect, isPhone, test, visit } from "./_fixtures";

test.describe("motion on", () => {
  test.use({ contextOptions: { reducedMotion: "no-preference" } });

  test("home parallax moves the planes and sinks the headline on scroll", async ({ page }) => {
    await visit(page, "/en/");
    const near = page.locator('[data-plane="near"]');
    const text = page.locator("[data-hero-text]");
    const before = await near.evaluate(element => element.style.transform);
    const textBefore = await text.evaluate(element => element.style.transform);
    await page.mouse.wheel(0, 320);
    await expect.poll(() => near.evaluate(element => element.style.transform)).not.toBe(before);
    await expect.poll(() => text.evaluate(element => element.style.transform)).not.toBe(textBefore);
    // Scroll the whole page: the sheet stack and stickers run without errors.
    for (let step = 0; step < 12; step += 1) await page.mouse.wheel(0, 400);
    await page.waitForTimeout(600);
  });

  test("a pop-up sticker springs up in view and replays on a click", async ({ page }) => {
    await visit(page, "/en/support/");
    const sticker = page.locator('[data-sticker="envelope"]');
    const stand = sticker.locator("[data-sticker-stand]");
    await sticker.scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 10);
    await expect
      .poll(() => stand.evaluate(element => element.style.transform), { timeout: 6000 })
      .toBe("rotateX(0deg)");
    await sticker.click({ force: true });
    await expect
      .poll(() => stand.evaluate(element => element.style.transform))
      .not.toBe("rotateX(0deg)");
    await expect
      .poll(() => stand.evaluate(element => element.style.transform), { timeout: 6000 })
      .toBe("rotateX(0deg)");
  });

  test("the kana drop replays on a click", async ({ page }) => {
    await visit(page, "/en/about/");
    const kana = page.locator('[data-island="kana-drop"]');
    await kana.scrollIntoViewIfNeeded();
    await kana.click({ force: true });
    await expect(kana).toHaveAttribute("data-kana", "drop");
  });

  test("a merge animates and the lightbox animates open and closed", async ({ page }) => {
    test.skip(isPhone(test.info().project.name), "mouse drag path");
    await visit(page, "/en/games/memory-missing/");
    await page.locator("[data-gallery-slide]:not([inert]) [data-gallery-open]").click();
    const dialog = page.locator("[data-gallery-lightbox]");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(dialog.locator("[data-lightbox-number]")).toHaveText("2 / 2");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    const sheet = page.locator("[data-board-sheet]");
    await sheet.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    const codes = await page
      .locator("[data-board-grid] [data-cell]")
      .evaluateAll(cells =>
        cells.map(each => each.querySelector<HTMLElement>("[data-item]")?.dataset.item ?? "")
      );
    const from = codes.findIndex((code, index) => code !== "" && codes.includes(code, index + 1));
    const to = codes.indexOf(codes[from] ?? "-", from + 1);
    const start = await page.locator(`[data-cell="${from}"]`).boundingBox();
    const end = await page.locator(`[data-cell="${to}"]`).boundingBox();
    if (start === null || end === null) throw new Error("board cells have no box");
    await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2);
    await page.mouse.down();
    await page.mouse.move(start.x + start.width / 2 + 20, start.y + start.height / 2, { steps: 4 });
    await expect(page.locator("html")).toHaveAttribute("data-board-dragging", "");
    await page.mouse.move(end.x + end.width / 2, end.y + end.height / 2, { steps: 10 });
    await page.mouse.up();
    await expect(page.locator(`[data-cell="${to}"] [data-item]`)).toHaveAttribute(
      "data-item",
      /-2$/
    );
    await page.waitForTimeout(1200);
  });
});

test.describe("motion reduced", () => {
  test("stickers stand, the hero stays put", async ({ page }) => {
    await visit(page, "/en/");
    const stands = page.locator("[data-sticker-stand]");
    for (const index of [0, 1, 2]) {
      expect(await stands.nth(index).evaluate(element => element.style.transform)).toBe("");
    }
    await expect(page.locator("[data-hero-text]")).toBeVisible();
  });
});
