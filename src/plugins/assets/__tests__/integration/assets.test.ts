import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createApp } from "@moku-labs/web";
import sharp from "sharp";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SITE } from "../../../../config";
import { LOCALES } from "../../../../i18n/languages";
import { OG_CARD_NAMES } from "../../../../lib/head";
import { assetsPlugin } from "../..";
import { cardHash, ogInputs } from "../../og/hash";
import type { OgManifest } from "../../og/types";

let root = "";

beforeEach(async () => {
  root = await mkdtemp(path.join(tmpdir(), "kitto-assets-"));
});

afterEach(async () => {
  vi.restoreAllMocks();
  await rm(root, { recursive: true, force: true });
});

/** Write a solid master image under the temporary `art/` folder. */
const writeMaster = async (relative: string): Promise<void> => {
  const file = path.join(root, "art", relative);
  await mkdir(path.dirname(file), { recursive: true });
  const image = sharp({ create: { width: 8, height: 8, channels: 3, background: "#d94f30" } });
  await (relative.endsWith(".webp") ? image.webp() : image.png()).toFile(file);
};

/**
 * The app as `src/app.ts` composes the plugin, over the temporary folders.
 *
 * @param outDir - The served art folder; the temporary one unless a test reads the site's art.
 */
const createAssetsApp = (outDir = path.join(root, "media")) =>
  createApp({
    plugins: [assetsPlugin],
    pluginConfigs: {
      site: SITE,
      assets: {
        sourceDir: path.join(root, "art"),
        outDir,
        icons: [{ output: path.join(root, "apple-touch-icon.png"), size: 180 }],
        ogDir: path.join(root, "og"),
        ogManifest: path.join(root, "og-manifest.json")
      }
    }
  });

// Catches: the plugin not mounted as `app.assets`, the default thumbnail folders losing the clues
// or the gallery's game art, the configured folders ignored, and the lines `bun run images` and
// `bun run icons` print gone.
describe("assets plugin", () => {
  it("writes the served art with the default thumbnail folders and prints the summary", async () => {
    const print = vi.spyOn(console, "log").mockImplementation(() => undefined);
    await writeMaster("clues/key.png");
    await writeMaster("game/ward.webp");
    await writeMaster("scenes/desk.png");
    const app = createAssetsApp();

    const { written } = await app.assets.images();

    const served = [
      "clues/key.webp",
      "clues/key-256.webp",
      "game/ward.webp",
      "game/ward-256.webp",
      "scenes/desk.webp"
    ];
    expect(written).toEqual(served.map(relative => path.join(root, "media", relative)));
    expect(print).toHaveBeenCalledWith(expect.stringContaining("images: 5 written, 0 up to date"));
  });

  it("draws the configured icons and names each one", async () => {
    const print = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const app = createAssetsApp();

    const { files } = await app.assets.icons();

    const icon = path.join(root, "apple-touch-icon.png");
    expect(files).toEqual([icon]);
    expect(print).toHaveBeenCalledWith(expect.stringContaining(`icons: ${icon} (180×180)`));
  });

  // Catches: `og` not mounted on `app.assets`, the configured card folder or manifest ignored (the
  // run would draw into `public/og`), and the line `bun run og` prints gone.
  it("draws no card when the manifest matches every card", async () => {
    const print = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const inputs = await ogInputs("public/media");
    const manifest: OgManifest = {};
    for (const name of OG_CARD_NAMES) {
      for (const locale of LOCALES) {
        manifest[`${name}/${locale}`] = cardHash(name, locale, inputs);
        await mkdir(path.join(root, "og", locale), { recursive: true });
        await writeFile(path.join(root, "og", locale, `${name}.png`), "drawn");
      }
    }
    const manifestFile = path.join(root, "og-manifest.json");
    await writeFile(manifestFile, JSON.stringify(manifest));
    const app = createAssetsApp("public/media");

    const result = await app.assets.og();

    const cards = OG_CARD_NAMES.length * LOCALES.length;
    expect(result).toEqual({ written: [], upToDate: cards });
    expect(JSON.parse(await readFile(manifestFile, "utf8"))).toEqual(manifest);
    expect(print).toHaveBeenCalledWith(
      expect.stringContaining(`og: 0 written, ${cards} up to date`)
    );
  });
});
