/**
 * @file Legal pages (U8, design context §6 A6–A8, C2, D3): numbered sections, the «In short» box,
 * the contents rail on desktop (always open, current section marked as you read) and the sticky
 * contents bar on the phone (shows the current section, opens the list, closes on choice or Esc).
 */
import { expect, onlyForm, settle, test, visit } from "./_fixtures";
import { EMAILS, LEGAL_SECTIONS } from "./_site";

for (const [id, count] of Object.entries(LEGAL_SECTIONS)) {
  test(`${id}: ${count} numbered sections, In short, contents`, async ({ page }) => {
    await visit(page, `/en/${id}/`);
    await expect(page.locator('[data-component="legal-section"]')).toHaveCount(count);
    await expect(page.locator('[data-component="in-short"]')).toBeVisible();
    await expect(page.locator("[data-legal-meta] time")).toHaveAttribute(
      "datetime",
      /^\d{4}-\d{2}-\d{2}$/
    );
    const links = page.locator('[data-island="legal-toc"] [data-toc-rail] a');
    await expect(links).toHaveCount(count);
    for (let index = 0; index < count; index += 1) {
      const hash = await links.nth(index).getAttribute("href");
      await expect(page.locator(`section${hash ?? ""}`)).toHaveCount(1);
    }
  });
}

test("delete-data: steps and the deletion request mail", async ({ page }) => {
  await visit(page, "/en/delete-data/");
  await expect(page.locator('[data-component="step-list"]')).toHaveCount(3);
  const request = page.locator(`main a[href^="mailto:${EMAILS.delete}?subject="]`);
  await expect(request).toHaveText("Email a deletion request");
  await expect(request).toHaveAttribute("data-legal-action");
});

test.describe("desktop rail", () => {
  onlyForm("desktop");

  test("the rail stays open and sticky and marks the section you read", async ({ page }) => {
    await visit(page, "/en/privacy/");
    const toc = page.locator('[data-island="legal-toc"]');
    const details = toc.locator("details[data-toc]");
    await expect(details).toHaveAttribute("open", "");
    await expect(toc.locator('a[aria-current="true"]')).toHaveCount(1);

    await toc.locator('a[href="#children"]').click();
    await expect(page).toHaveURL(/#children$/);
    await expect(toc.locator('a[href="#children"]')).toHaveAttribute("aria-current", "true");
    await expect(toc.locator("[data-toc-dot]")).toHaveAttribute("data-visible", "");
    await expect(toc.locator("[data-toc-rail]")).toBeInViewport();

    // A click on the summary does not fold the rail on desktop.
    await toc.locator("summary").click();
    await expect(details).toHaveAttribute("open", "");

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect(toc.locator('a[href="#contact"]')).toHaveAttribute("aria-current", "true");
    await expect(toc.locator("[data-toc-rail]")).toBeInViewport();
  });
});

test.describe("phone contents bar", () => {
  onlyForm("phone");

  test("the bar shows the current section, opens, closes on choice and Esc", async ({ page }) => {
    await visit(page, "/en/terms/");
    const toc = page.locator('[data-island="legal-toc"]');
    const details = toc.locator("details[data-toc]");
    await expect(details).not.toHaveAttribute("open", "");
    await expect(toc.locator("[data-toc-now]")).not.toHaveText("");

    await toc.locator("summary").tap();
    await expect(details).toHaveAttribute("open", "");
    await settle(page);
    await expect(page).toHaveScreenshot("legal-bar-open.png");
    const third = toc.locator("[data-toc-rail] a").nth(2);
    const hash = (await third.getAttribute("href")) ?? "";
    await third.tap();
    await expect(details).not.toHaveAttribute("open", "");
    await expect(page).toHaveURL(new RegExp(`${hash}$`));
    await expect(toc.locator(`a[href="${hash}"]`)).toHaveAttribute("aria-current", "true");
    await expect(toc.locator("summary")).toBeInViewport();

    // Open the list again and close it with Esc: the page stays at the chosen section, which stays
    // current, in the bar too. A raw tap: `locator.tap()` first scrolls the sticky bar "into view".
    const chosen = await page.evaluate(() => Math.round(scrollY));
    const name = await toc.locator(`a[href="${hash}"]`).textContent();
    const bar = await toc.locator("summary").boundingBox();
    await page.touchscreen.tap((bar?.x ?? 0) + 40, (bar?.y ?? 0) + (bar?.height ?? 0) / 2);
    await expect(details).toHaveAttribute("open", "");
    // Into the list with the keyboard, so Esc has to bring the focus back to the bar.
    await page.keyboard.press("Tab");
    await expect(toc.locator("[data-toc-rail] a").first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(details).not.toHaveAttribute("open", "");
    await expect(toc.locator("summary")).toBeFocused();
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => Math.round(scrollY))).toBe(chosen);
    await expect(toc.locator(`a[href="${hash}"]`)).toHaveAttribute("aria-current", "true");
    await expect(toc.locator("[data-toc-now]")).toHaveText(name ?? "");
  });
});
