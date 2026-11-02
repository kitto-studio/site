/**
 * @file Phone fit (design context §5): no horizontal scroll on any page at 390 and at 320 in the
 * sample locales (long Russian and German words, CJK), the header and footer tap targets reach
 * 44 px, and the footer links stack.
 */
import { booted, expect, horizontalOverflow, onlyForm, test, visit } from "./_fixtures";
import { LOCALES, PAGES, pageUrl, SAMPLE_LOCALES } from "./_site";

onlyForm("phone");

for (const width of [390, 320]) {
  for (const locale of SAMPLE_LOCALES) {
    test(`no horizontal scroll at ${width} in ${locale}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      for (const sitePage of PAGES) {
        await visit(page, pageUrl(locale, sitePage));
        const overflow = await horizontalOverflow(page);
        expect(
          overflow,
          `${pageUrl(locale, sitePage)} overflows by ${overflow}px`
        ).toBeLessThanOrEqual(0);
      }
    });
  }
}

/**
 * The text boxes that stick out of the screen sideways. A sheet with `overflow: hidden` keeps the
 * document from scrolling, so a box wider than the screen is cut off without any scroll to show it.
 *
 * @param page - The page.
 * @returns One line per text box past either edge.
 */
function textPastEdges(page: import("@playwright/test").Page): Promise<string[]> {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const hidden = "[hidden], [inert], [aria-hidden='true'], [data-visually-hidden], dialog";
    return [...document.querySelectorAll("main :is(h1, h2, h3, p, li, dt, dd)")]
      .filter(element => element.closest(hidden) === null)
      .filter(element => {
        const box = element.getBoundingClientRect();
        return box.width > 0 && (box.left < -1 || box.right > width + 1);
      })
      .map(element => `${element.tagName} «${element.textContent?.trim().slice(0, 30)}»`);
  });
}

for (const locale of SAMPLE_LOCALES) {
  test(`no text is cut off at the screen edge at 320 in ${locale}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    for (const sitePage of PAGES) {
      await visit(page, pageUrl(locale, sitePage));
      expect(await textPastEdges(page), pageUrl(locale, sitePage)).toEqual([]);
    }
  });
}

test("tap targets of the header, the menu and the footer reach 44 px", async ({ page }) => {
  await visit(page, "/en/privacy/");
  const targets = [
    "[data-brand]",
    "[data-menu-toggle]",
    "footer nav a",
    '[data-island="legal-toc"] summary'
  ];
  for (const selector of targets) {
    const boxes = await page
      .locator(selector)
      .evaluateAll(elements =>
        elements.map(element => element.getBoundingClientRect().toJSON() as DOMRect)
      );
    for (const box of boxes) {
      expect(Math.round(box.height), `${selector} height`).toBeGreaterThanOrEqual(44);
      expect(Math.round(box.width), `${selector} width`).toBeGreaterThanOrEqual(44);
    }
  }
  const footer = await page
    .locator("footer nav a")
    .evaluateAll(elements => elements.map(element => element.getBoundingClientRect().left));
  expect(new Set(footer.map(left => Math.round(left))).size, "footer links stack").toBe(1);
});

for (const locale of LOCALES) {
  test(`the home sun stays right of the headline in ${locale}`, async ({ page }) => {
    await visit(page, pageUrl(locale, "/"));
    const gap = await page.evaluate(() => {
      const text = document.querySelector("[data-hero-text]");
      const sun = document.querySelector('[data-plane="sun"]');
      if (!text || !sun) return Number.NaN;
      let right = 0;
      const words = document.createTreeWalker(text, NodeFilter.SHOW_TEXT);
      for (let node = words.nextNode(); node; node = words.nextNode()) {
        const range = document.createRange();
        range.selectNodeContents(node);
        for (const rect of range.getClientRects()) right = Math.max(right, rect.right);
      }
      const box = sun.getBoundingClientRect();
      // The disc starts at 69.8% of the frame width.
      return box.left + box.width * 0.698 - right;
    });
    expect(gap, `sun to headline gap in ${locale}`).toBeGreaterThanOrEqual(11);
  });
}

/**
 * The links that stand alone on their line and are shorter than 44 px.
 *
 * @param page - The page.
 * @returns One line per such link.
 */
function shortStandaloneLinks(page: import("@playwright/test").Page): Promise<string[]> {
  return page.evaluate(() => {
    // oxlint-disable-next-line unicorn/consistent-function-scoping -- runs in the page: it must live inside this callback
    const shares = (row: Element, link: Element, rects: DOMRect[]): boolean => {
      const words = document.createTreeWalker(row, NodeFilter.SHOW_TEXT);
      for (let node = words.nextNode(); node; node = words.nextNode()) {
        if (link.contains(node) || !node.textContent?.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        const onLine = [...range.getClientRects()].some(rect =>
          rects.some(
            own =>
              Math.min(rect.bottom, own.bottom) - Math.max(rect.top, own.top) > own.height * 0.4
          )
        );
        if (onLine) return true;
      }
      return false;
    };
    const short = (link: Element): boolean => {
      const rects = [...link.getClientRects()];
      const height = Math.min(...rects.map(rect => rect.height));
      const row = link.closest("p, li, dd, dt, h2, h3, div");
      return height < 43.5 && row !== null && !shares(row, link, rects);
    };
    return [...document.querySelectorAll("main a")]
      .filter(link => short(link))
      .map(link => `«${link.textContent?.trim().slice(0, 24)}»`);
  });
}

test("a link alone on its line is a 44 px target, in every locale and page", async ({
  page,
  issues
}) => {
  test.setTimeout(180_000);
  issues.allow(
    /(HTTP 404|status of 404|404 \(Not Found\)).*\/no-such-page\/$/,
    "the 404 page answers 404"
  );
  const short: string[] = [];
  for (const locale of LOCALES) {
    const urls = [...PAGES.map(sitePage => pageUrl(locale, sitePage)), `/${locale}/no-such-page/`];
    for (const url of urls) {
      await page.goto(url);
      await booted(page);
      const found = await shortStandaloneLinks(page);
      short.push(...found.map(line => `${url} ${line}`));
    }
  }
  expect(short, "standalone links under 44 px").toEqual([]);
});

test("the gallery arrows are 44 px targets", async ({ page }) => {
  await visit(page, "/en/games/memory-missing/");
  const sizes = await page
    .locator("[data-gallery-step]")
    .evaluateAll(arrows =>
      arrows.map(arrow => [(arrow as HTMLElement).offsetWidth, (arrow as HTMLElement).offsetHeight])
    );
  expect(sizes.length).toBe(2);
  for (const [width, height] of sizes) {
    expect(width).toBeGreaterThanOrEqual(44);
    expect(height).toBeGreaterThanOrEqual(44);
  }
});

test("the phone menu marks the current page with the orange outline, not a dot", async ({
  page
}) => {
  await visit(page, "/en/about/");
  await page.locator("[data-menu-toggle]").click();
  const current = page.locator('[data-menu-sheet] nav a[aria-current="page"]');
  await expect(current).toBeVisible();
  await expect(current.locator("[data-dot-mark]")).toHaveCount(0);
  const shadow = await current.evaluate(link => getComputedStyle(link).boxShadow);
  expect(shadow).toContain("inset");
  expect(shadow).toContain("2px");
});
