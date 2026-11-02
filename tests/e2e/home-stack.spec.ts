/**
 * @file The home sheet stack on a phone, in every engine: each sheet shows whole before the next
 * one covers it, a sheet taller than the window sticks by its bottom, and the footer never slides
 * over the last sheet. Safari laid the sheets out after the island measured them, and pinned them
 * thousands of px above the window.
 */
import { expect, onlyForm, test, visit } from "./_fixtures";

onlyForm("phone");

/** Room kept under a sheet taller than the window, px (`PIN_MARGIN` in the sheet-stack island). */
const PIN_MARGIN = 16;

test("every home sheet shows whole and none slides under the footer", async ({ page }) => {
  await visit(page, "/en/");

  // A pinned sheet sticks by its bottom: its sticky top is the window minus its height.
  const pins = await page.evaluate(margin => {
    return [...document.querySelectorAll<HTMLElement>("[data-stack]")].map(sheet => {
      const top = Number.parseFloat(getComputedStyle(sheet).top);
      return { top, expected: innerHeight - sheet.offsetHeight - margin, pinned: top < 0 };
    });
  }, PIN_MARGIN);
  for (const [index, pin] of pins.entries()) {
    if (pin.pinned) expect(Math.abs(pin.top - pin.expected), `sheet ${index}`).toBeLessThan(3);
  }

  // Scroll the page through: each sheet's bottom comes into view, and the footer stays below.
  const scan = await page.evaluate(async () => {
    const sheets = [...document.querySelectorAll<HTMLElement>("[data-stack]")];
    const footer = document.querySelector("[data-component=footer]");
    const seen = sheets.map(() => false);
    let underFooter = 0;
    const height = document.documentElement.scrollHeight;
    for (let y = 0; y <= height - innerHeight; y += 20) {
      scrollTo(0, y);
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const boxes = sheets.map(sheet => sheet.getBoundingClientRect());
      for (const [index, box] of boxes.entries()) {
        const next = boxes[index + 1];
        if (box.bottom <= innerHeight && (!next || next.top >= box.bottom - 2)) seen[index] = true;
      }
      const last = boxes.at(-1);
      if (footer && last && last.bottom > footer.getBoundingClientRect().top + 2) underFooter += 1;
    }
    return { seen, underFooter };
  });

  expect(scan.seen, "every sheet's bottom came into view").toEqual(scan.seen.map(() => true));
  expect(scan.underFooter, "frames with the last sheet under the footer").toBe(0);
});
