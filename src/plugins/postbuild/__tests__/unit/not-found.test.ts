import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { writeNotFoundPages } from "../../not-found";

const CSS = '<link rel="stylesheet" href="/assets/main-1a2b.css">';
const JS = '<script type="module" src="/assets/spa-3c4d.js"></script>';
const LOCALES = ["en", "ru", "uk", "es", "pt", "de", "fr", "it", "ja", "ko", "zh"];

let outDir = "";

beforeEach(async () => {
  outDir = await mkdtemp(path.join(tmpdir(), "kitto-404-"));
});

afterEach(async () => {
  await rm(outDir, { recursive: true, force: true });
});

// Catches: a locale without its 404 (Cloudflare would fall back to the English root page), a page
// in the wrong language, and 404s that lose the fingerprinted bundle of the build.
describe("writeNotFoundPages", () => {
  it("writes the root 404 and {lang}/404.html for all 11 locales with the build's assets", async () => {
    await writeFile(path.join(outDir, "404.html"), `<body>${CSS}<div></div>${JS}</body>`);

    const files = await writeNotFoundPages(outDir, "src/index.html");

    expect(files).toEqual(["404.html", ...LOCALES.map(locale => `${locale}/404.html`)]);
    for (const locale of LOCALES) {
      const html = await readFile(path.join(outDir, locale, "404.html"), "utf8");
      expect(html).toContain(`<html lang="${locale}">`);
      expect(html).toContain(CSS + JS);
    }
    expect(await readFile(path.join(outDir, "404.html"), "utf8")).toContain('<html lang="en">');
  });

  // Catches: unstyled, script-less 404 pages shipped without a word when the placeholders are lost.
  it("stops when the built 404 has no asset tags to copy", async () => {
    await writeFile(path.join(outDir, "404.html"), "<body><h1>404</h1></body>");

    await expect(writeNotFoundPages(outDir, "src/index.html")).rejects.toThrow(/no asset tags/);
  });
});
