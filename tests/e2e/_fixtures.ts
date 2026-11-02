/**
 * @file Shared e2e fixtures. Every test gets the browser-side error capture automatically:
 * `pageerror`, `console.error`, `console.warn`, failed requests and 4xx/5xx responses are collected
 * for the whole test, every interaction included, and the test fails on any of them unless the
 * test allowed that exact line with a reason. The server side is scanned in the global teardown.
 */
import { test as base, expect, type Locator, type Page } from "@playwright/test";

/** The error capture of one test. */
export type Issues = {
  /** Everything captured so far. */
  readonly list: string[];
  /**
   * Allow a captured line, with the reason it is expected.
   *
   * @param pattern - Matches the captured line.
   * @param reason - Why this line is not a defect.
   */
  allow: (pattern: RegExp, reason: string) => void;
};

/** Request failures that are navigation side effects, not defects (cancelled lazy loads). */
const ABORTED = /ERR_ABORTED|cancelled|NS_BINDING_ABORTED|Load request cancelled/i;

/**
 * Start capturing browser errors on a page.
 *
 * @param page - The page to watch.
 * @returns The capture list it fills.
 */
export function watchErrors(page: Page): string[] {
  const list: string[] = [];
  page.on("pageerror", error => list.push(`pageerror: ${error.message}`));
  page.on("console", message => {
    const type = message.type();
    if (type === "error" || type === "warning") {
      list.push(`console.${type}: ${message.text()} @ ${message.location().url}`);
    }
  });
  page.on("response", response => {
    if (response.status() >= 400) list.push(`HTTP ${response.status()} ${response.url()}`);
  });
  page.on("requestfailed", request => {
    const reason = request.failure()?.errorText ?? "";
    if (!ABORTED.test(reason)) list.push(`requestfailed: ${request.url()} ${reason}`);
  });
  return list;
}

/**
 * Fail when a capture list holds a line no pattern allows.
 *
 * @param list - The captured lines.
 * @param allowed - Allowed patterns.
 */
export function expectNoErrors(list: readonly string[], allowed: readonly RegExp[] = []): void {
  const real = list.filter(line => !allowed.some(pattern => pattern.test(line)));
  expect(real, "browser errors, warnings or failed requests").toEqual([]);
}

/** The test with the automatic error capture. */
export const test = base.extend<{ issues: Issues }>({
  issues: [
    async ({ page }, use) => {
      const list = watchErrors(page);
      const allowed: RegExp[] = [];
      await use({ list, allow: pattern => allowed.push(pattern) });
      expectNoErrors(list, allowed);
    },
    { auto: true }
  ]
});

export { expect } from "@playwright/test";

/**
 * Open a page and wait until it is booted: loaded, network quiet, islands mounted, fonts in.
 *
 * @param page - The page.
 * @param url - Site-relative URL.
 */
export async function visit(page: Page, url: string): Promise<void> {
  const response = await page.goto(url);
  expect(response?.status(), `status of ${url}`).toBeLessThan(400);
  await booted(page);
}

/**
 * Wait until the current document is booted.
 *
 * @param page - The page.
 */
export async function booted(page: Page): Promise<void> {
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)));
  });
}

/** Longest wait for one image while settling a page for a golden. */
const IMAGE_WAIT = 8000;

/**
 * Settle a page for a screenshot: every lazy image loaded and decoded, fonts ready, at the top.
 *
 * @param page - The page.
 */
export async function settle(page: Page): Promise<void> {
  await page.evaluate(async wait => {
    const images = [...document.images];
    for (const image of images) image.loading = "eager";
    // Runs in the page: the helper must live inside the serialized function.
    // oxlint-disable-next-line unicorn/consistent-function-scoping
    const loaded = (image: HTMLImageElement): Promise<unknown> =>
      image.complete
        ? image.decode().catch(() => undefined)
        : new Promise(resolve => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", resolve, { once: true });
          });
    const timeout = new Promise(resolve => setTimeout(resolve, wait));
    await Promise.race([Promise.all(images.map(image => loaded(image))), timeout]);
    await document.fonts.ready;
  }, IMAGE_WAIT);
  await page.waitForLoadState("networkidle");
}

/**
 * Whether a project is a phone project.
 *
 * @param projectName - `testInfo.project.name`.
 * @returns True for the `*-mobile` projects.
 */
export function isPhone(projectName: string): boolean {
  return projectName.endsWith("-mobile");
}

/**
 * Click a control until a check holds. A click before the island mounts does nothing, so the
 * click repeats only while the check still fails.
 *
 * @param control - The control to click.
 * @param check - Resolves when the effect is there.
 */
export async function clickUntil(control: Locator, check: () => Promise<void>): Promise<void> {
  await expect(async () => {
    try {
      await check();
    } catch {
      await control.click();
      await check();
    }
  }).toPass({ timeout: 8000, intervals: [100, 250, 500] });
}

/**
 * The page's horizontal overflow in CSS px.
 *
 * @param page - The page.
 * @returns How far the document is wider than the viewport.
 */
export function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
}

/**
 * Run the tests of the current describe on one project only (HTTP-level and build checks that do
 * not depend on the engine or the viewport).
 *
 * @param projectName - The project that runs them.
 */
export function onlyOn(projectName: string): void {
  test.beforeEach(() => {
    test.skip(test.info().project.name !== projectName, `runs on ${projectName} only`);
  });
}

/**
 * Run the tests of the current describe on desktop or on phone projects only.
 *
 * @param form - Which form factor runs them.
 */
export function onlyForm(form: "desktop" | "phone"): void {
  test.beforeEach(() => {
    const phone = isPhone(test.info().project.name);
    test.skip(form === "phone" ? !phone : phone, `${form} only`);
  });
}
