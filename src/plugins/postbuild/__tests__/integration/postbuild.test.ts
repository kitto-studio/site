import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { buildPlugin, createApp, createPlugin } from "@moku-labs/web";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SITE } from "../../../../config";
import { I18N_CONFIG } from "../../../../i18n/languages";
import { routes } from "../../../../routes";
import { pagePatterns, postbuildPlugin } from "../..";

/**
 * Stands in for the end of a real build: vitest runs on Node, and the build's bundle step needs
 * Bun. It emits the build plugin's own `build:complete` event.
 */
const buildEndPlugin = createPlugin("buildEnd", {
  depends: [buildPlugin],
  api: ctx => ({
    complete: (outDir: string) =>
      ctx.emit("build:complete", { outDir, pageCount: 89, durationMs: 1 })
  })
});

const ASSETS =
  '<link rel="stylesheet" href="/assets/main-1a2b.css"><script type="module" src="/assets/spa-3c4d.js"></script>';

let outDir = "";

beforeEach(async () => {
  outDir = await mkdtemp(path.join(tmpdir(), "kitto-build-"));
  // What the framework leaves behind: the root 404 with its asset tags.
  await writeFile(path.join(outDir, "404.html"), `<body>${ASSETS}</body>`);
});

afterEach(async () => {
  await rm(outDir, { recursive: true, force: true });
});

// Catches: the hook on the wrong event, or not wired at all (a build without sitemap, redirects,
// 404s or cards), and a run that writes somewhere else than the build's output directory.
describe("postbuild plugin", () => {
  it("writes every post-build file into the build's output directory on build:complete", async () => {
    const app = createApp({
      plugins: [buildPlugin, postbuildPlugin, buildEndPlugin],
      pluginConfigs: {
        site: SITE,
        i18n: I18N_CONFIG,
        router: { routes },
        postbuild: { pages: pagePatterns(routes) }
      }
    });
    await app.start();

    app.buildEnd.complete(outDir);
    await vi.waitFor(
      () => expect(app.log.trace().some(entry => entry.event === "postbuild:done")).toBe(true),
      { timeout: 60_000, interval: 50 }
    );

    for (const file of [
      "sitemap.xml",
      "robots.txt",
      "_redirects",
      "ru/404.html",
      "og/ja/home.png"
    ]) {
      expect(existsSync(path.join(outDir, file)), file).toBe(true);
    }
    expect(await readFile(path.join(outDir, "ko/404.html"), "utf8")).toContain(ASSETS);
    await app.stop();
  }, 90_000);
});
