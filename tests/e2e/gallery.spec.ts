/**
 * @file Game page gallery (U5, design context §4, §6 E1, §7): main view with arrows, tilted
 * thumbnails with the active outline, caption «label n / total», ← → keys, scroll-snap swipe, and
 * the lightbox: Esc, outside click and close button, arrows and keys inside, focus restored.
 */
import { expect, onlyForm, settle, test, visit } from "./_fixtures";

test("arrows, thumbnails and keys move the main view", async ({ page }) => {
  await visit(page, "/en/games/memory-missing/");
  const gallery = page.locator('[data-component="gallery"]');
  await expect(gallery).toHaveAttribute("data-ready", "");
  const number = gallery.locator("[data-gallery-number]");
  const thumbs = gallery.locator("[data-gallery-thumb]");
  const next = gallery.locator('[data-gallery-step="next"]');
  const previous = gallery.locator('[data-gallery-step="previous"]');
  await expect(number).toHaveText("1 / 2");
  await expect(thumbs).toHaveCount(2);
  await expect(thumbs.first()).toHaveAttribute("aria-current", "true");
  await expect(previous).toHaveAttribute("aria-disabled", "true");

  await thumbs.nth(1).click();
  await expect(number).toHaveText("2 / 2");
  await expect(thumbs.nth(1)).toHaveAttribute("aria-current", "true");
  await expect(next).toHaveAttribute("aria-disabled", "true");
  await expect(previous).toHaveAttribute("aria-disabled", "false");

  await thumbs.nth(1).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(number).toHaveText("1 / 2");
  await expect(thumbs.first()).toBeFocused();
  await page.keyboard.press("End");
  await expect(number).toHaveText("2 / 2");
  await page.keyboard.press("Home");
  await expect(number).toHaveText("1 / 2");
});

test.describe("desktop arrows and lightbox", () => {
  onlyForm("desktop");

  test("main view arrows step and stop at the ends", async ({ page }) => {
    await visit(page, "/en/games/memory-missing/");
    const gallery = page.locator('[data-component="gallery"]');
    const number = gallery.locator("[data-gallery-number]");
    await gallery.locator('[data-gallery-step="next"]').click();
    await expect(number).toHaveText("2 / 2");
    await expect(gallery.locator("[data-gallery-slide]").nth(1)).not.toHaveAttribute("inert", "");
    await expect(gallery.locator("[data-gallery-slide]").first()).toHaveAttribute("inert", "");
    await gallery.locator('[data-gallery-step="previous"]').click();
    await expect(number).toHaveText("1 / 2");
  });

  test("lightbox opens, steps, closes by Esc, close button and outside click", async ({ page }) => {
    await visit(page, "/en/games/memory-missing/");
    const gallery = page.locator('[data-component="gallery"]');
    const dialog = gallery.locator("[data-gallery-lightbox]");
    const opener = gallery.locator("[data-gallery-slide]:not([inert]) [data-gallery-open]");
    await expect(dialog).toBeHidden();

    await opener.click();
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleName("Image viewer");
    await expect(dialog.locator("[data-lightbox-close]")).toBeFocused();
    await expect(dialog.locator("[data-lightbox-number]")).toHaveText("1 / 2");
    await expect(dialog.locator("[data-lightbox-stage] img")).toBeVisible();
    await settle(page);
    await expect(page).toHaveScreenshot("lightbox.png");

    await page.keyboard.press("ArrowRight");
    await expect(dialog.locator("[data-lightbox-number]")).toHaveText("2 / 2");
    await expect(dialog.locator('[data-lightbox-step="next"]')).toHaveAttribute(
      "aria-disabled",
      "true"
    );
    await dialog.locator('[data-lightbox-step="previous"]').click();
    await expect(dialog.locator("[data-lightbox-number]")).toHaveText("1 / 2");
    await dialog.locator('[data-lightbox-step="next"]').click();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    // Closing on the second shot leaves the main view there, focus back on its opener.
    await expect(gallery.locator("[data-gallery-number]")).toHaveText("2 / 2");
    await expect(
      gallery.locator("[data-gallery-slide]:not([inert]) [data-gallery-open]")
    ).toBeFocused();

    await gallery.locator("[data-gallery-slide]:not([inert]) [data-gallery-open]").click();
    await expect(dialog).toBeVisible();
    await dialog.locator("[data-lightbox-close]").click();
    await expect(dialog).toBeHidden();

    await gallery.locator("[data-gallery-slide]:not([inert]) [data-gallery-open]").click();
    await expect(dialog).toBeVisible();
    await page.mouse.click(30, 450);
    await expect(dialog).toBeHidden();
  });

  test("Tab stays inside the open lightbox", async ({ page }) => {
    await visit(page, "/en/games/memory-missing/");
    const dialog = page.locator("[data-gallery-lightbox]");
    await page.locator("[data-gallery-slide]:not([inert]) [data-gallery-open]").click();
    await expect(dialog).toBeVisible();
    for (let step = 0; step < 6; step += 1) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(
        () => document.activeElement?.closest("[data-gallery-lightbox]") !== null
      );
      expect(inside).toBe(true);
    }
  });
});

test.describe("phone swipe", () => {
  onlyForm("phone");

  test("a swipe of the main view settles on the next shot", async ({ page }) => {
    await visit(page, "/en/games/memory-missing/");
    const gallery = page.locator('[data-component="gallery"]');
    const view = await gallery.locator("[data-gallery-view]").boundingBox();
    expect(view && Math.abs(view.width - view.height) < 2).toBe(true);
    await gallery.locator("[data-gallery-track]").evaluate(track => {
      track.scrollTo({ left: track.clientWidth, behavior: "auto" });
    });
    await expect(gallery.locator("[data-gallery-number]")).toHaveText("2 / 2");
    await gallery.locator("[data-gallery-slide]:not([inert]) [data-gallery-open]").tap();
    await expect(gallery.locator("[data-gallery-lightbox]")).toBeVisible();
    await expect(gallery.locator("[data-lightbox-number]")).toHaveText("2 / 2");
    await gallery.locator("[data-lightbox-close]").tap();
    await expect(gallery.locator("[data-gallery-lightbox]")).toBeHidden();
  });
});
