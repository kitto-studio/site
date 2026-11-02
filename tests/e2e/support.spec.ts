/**
 * @file Support page (U7, design context §6 A5, F3): the address as large selectable text, «Write a
 * letter» as mailto, «Copy address» copies it and shows «Copied» with a status note, then resets;
 * when the clipboard fails, the address is selected and the note says so.
 */

import { expect, test, visit } from "./_fixtures";
import { EMAILS } from "./_site";

test("Copy address copies, confirms and resets", async ({ page, context, baseURL }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: baseURL ?? "" });
  await visit(page, "/en/support/");
  const card = page.locator('[data-island="copy-email"]');
  await expect(card).toHaveAttribute("data-ready", "");
  await expect(card.locator("[data-email-address]")).toHaveText(EMAILS.support);
  await expect(card.getByRole("link", { name: "Write a letter" })).toHaveAttribute(
    "href",
    `mailto:${EMAILS.support}`
  );
  const button = card.locator("[data-copy-button]");
  await expect(button).toHaveText("Copy address");

  await button.click();
  await expect(button).toHaveAttribute("data-state", "done");
  await expect(card.locator("[data-copy-label]")).toHaveText("Copied");
  await expect(card.locator("[data-copy-note]")).toHaveText("The address is on your clipboard.");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(EMAILS.support);
  await expect(card.locator("[data-mail-actions]")).toHaveScreenshot("copy-confirmed.png");

  await expect(card.locator("[data-copy-label]")).toHaveText("Copy address", { timeout: 5000 });
  await expect(button).not.toHaveAttribute("data-state", "done");
  await expect(card.locator("[data-copy-note]")).toHaveText("");
});

test("a blocked clipboard selects the address instead", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("blocked")) },
      configurable: true
    });
  });
  await visit(page, "/en/support/");
  const card = page.locator('[data-island="copy-email"]');
  await expect(card).toHaveAttribute("data-ready", "");
  await card.locator("[data-copy-button]").click();
  await expect(card.locator("[data-copy-note]")).toHaveText(
    "Select the address above and copy it."
  );
  expect(await page.evaluate(() => document.getSelection()?.toString().trim())).toBe(
    EMAILS.support
  );
  await expect(card.locator("[data-copy-label]")).toHaveText("Copy address");
});

test("the three short answers and the delete link are there", async ({ page }) => {
  await visit(page, "/en/support/");
  await expect(page.locator('[data-component="faq"]')).toBeVisible();
  await page.locator('main a[href="/en/delete-data/"]').first().click();
  await page.waitForURL(url => url.pathname === "/en/delete-data/");
});
