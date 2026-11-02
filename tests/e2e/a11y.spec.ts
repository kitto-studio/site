/**
 * @file Accessibility: an axe WCAG 2.1 AA scan of every English page and the 404 page, light and
 * dark, desktop and phone, plus the roles and names of the key controls.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, isPhone, test, visit } from "./_fixtures";
import { PAGES, pageUrl } from "./_site";

for (const theme of ["light", "dark"] as const) {
  for (const sitePage of PAGES) {
    test(`${sitePage.id} has no WCAG 2.1 AA violations (${theme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme });
      await visit(page, pageUrl("en", sitePage));
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      const summary = results.violations.map(
        violation =>
          `${violation.id} (${violation.impact}): ${violation.nodes
            .slice(0, 4)
            .map(node => node.target.join(" "))
            .join(" | ")}`
      );
      expect(summary).toEqual([]);
    });
  }
}

test("key controls have roles and names", async ({ page }) => {
  await visit(page, "/en/games/memory-missing/");
  await expect(page.locator("[data-brand]")).toHaveAccessibleName("Kitto Studio, home");
  if (isPhone(test.info().project.name)) {
    await expect(page.locator("[data-menu-toggle]")).toHaveRole("button");
    await expect(page.locator("[data-menu-toggle]")).toHaveAccessibleName(/Menu/);
  } else {
    await expect(page.getByRole("navigation", { name: /main|site/i }).first()).toBeVisible();
    await expect(page.locator("[data-lang-toggle]")).toHaveAccessibleName("Language EN");
  }
  await expect(page.locator('[data-gallery-step="next"]')).toHaveAccessibleName("Next image");
  await expect(page.locator("[data-cell]").first()).toHaveRole("button");
  await expect(page.locator("[data-board-new]")).toHaveAccessibleName(/New board/);
  await expect(page.locator("[data-board-live]")).toHaveAttribute("aria-live", "polite");
});
