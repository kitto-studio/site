/**
 * @file Playwright e2e and visual suite. The webServer builds the real site into `dist` (the site
 * has no external data, so its own content is the frozen corpus) and serves it with the framework
 * preview on a dedicated port, with its output teed to `e2e-server.log` for the server-side error
 * scan. Chromium runs every spec and owns the visual goldens; webkit and firefox run the boot guard.
 */
import { defineConfig, devices } from "@playwright/test";

/** Port of the e2e preview server, away from the cli default 4173. */
const PORT = Number(process.env.PORT ?? 4317);

/** Origin the suite drives. */
const BASE_URL = `http://localhost:${PORT}`;

/** Server stdout and stderr, scanned by the global teardown. */
const SERVER_LOG = "e2e-server.log";

/** Desktop frame of the design context (1440 wide). */
const DESKTOP = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 };

/** Phone frame of the design context (390 wide), touch. */
const MOBILE = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true
};

/** Stable chromium text and colour rendering for the goldens. */
const CHROMIUM_FLAGS = ["--font-render-hinting=none", "--force-color-profile=srgb"];

/** Specs the other engines run: boot crashes are engine-specific. Goldens are chromium-only. */
const ENGINE_SPECS = /no-js-errors\.spec\.ts$/;

export default defineConfig({
  testDir: "tests/e2e",
  outputDir: "test-results",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : [["list"]],
  globalTeardown: "./tests/e2e/global-teardown.ts",
  expect: {
    timeout: 7000,
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      scale: "css",
      maxDiffPixelRatio: 0.02
    }
  },
  use: {
    baseURL: BASE_URL,
    colorScheme: "light",
    contextOptions: { reducedMotion: "reduce" },
    locale: "en-US",
    timezoneId: "UTC",
    trace: "on-first-retry",
    video: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"], ...DESKTOP, launchOptions: { args: CHROMIUM_FLAGS } }
    },
    {
      name: "chromium-mobile",
      use: { ...devices["Pixel 7"], ...MOBILE, launchOptions: { args: CHROMIUM_FLAGS } }
    },
    {
      name: "webkit-desktop",
      testMatch: ENGINE_SPECS,
      use: { ...devices["Desktop Safari"], ...DESKTOP }
    },
    {
      name: "webkit-mobile",
      testMatch: ENGINE_SPECS,
      use: { ...devices["iPhone 15"], ...MOBILE }
    },
    {
      name: "firefox-desktop",
      testMatch: ENGINE_SPECS,
      use: { ...devices["Desktop Firefox"], ...DESKTOP }
    },
    {
      // Firefox has no isMobile emulation: the phone frame only.
      name: "firefox-mobile",
      testMatch: ENGINE_SPECS,
      use: { ...devices["Desktop Firefox"], viewport: MOBILE.viewport, deviceScaleFactor: 1 }
    }
  ],
  webServer: {
    command: `(bun run build && bun run preview --port ${PORT}) 2>&1 | tee ${SERVER_LOG}`,
    url: `${BASE_URL}/en/`,
    reuseExistingServer: !process.env.CI && !process.env.PW_FRESH_SERVER,
    timeout: 180_000,
    stdout: "pipe",
    stderr: "pipe"
  }
});
