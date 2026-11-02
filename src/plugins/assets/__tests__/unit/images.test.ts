import { mkdir, mkdtemp, readFile, rm, utimes, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { jobsFor, runJob, writeImages } from "../../images";
import type { Config } from "../../types";

/** The plugin's settings over relative folders, for plans that touch no file. */
const PLAN: Config = {
  sourceDir: "art",
  outDir: "media",
  quality: 82,
  maxSize: 1600,
  thumbSize: 256,
  thumbFolders: ["clues", "game"],
  icons: [],
  ogDir: "og",
  ogManifest: "og-manifest.json"
};

let root = "";

beforeEach(async () => {
  root = await mkdtemp(path.join(tmpdir(), "kitto-images-"));
});

afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});

/** The plugin's settings over the temporary project. */
const config = (): Config => ({
  ...PLAN,
  sourceDir: path.join(root, "art"),
  outDir: path.join(root, "media")
});

/** Write a solid master image under the temporary `art/` folder. */
const writeMaster = async (relative: string, width: number, height: number): Promise<string> => {
  const file = path.join(root, "art", relative);
  await mkdir(path.dirname(file), { recursive: true });
  const image = sharp({ create: { width, height, channels: 3, background: "#d94f30" } });
  await (relative.endsWith(".webp") ? image.webp() : image.png()).toFile(file);
  return file;
};

/** An output path under the temporary `media/` folder. */
const media = (relative: string): string => path.join(root, "media", relative);

// Catches: merge-board clues or gallery art without the thumbnail their components load, a
// thumbnail nobody loads for the other art, and the game's own webp re-encoded instead of copied.
describe("jobsFor", () => {
  it("plans a webp per PNG, a copy per webp, and a thumbnail in the thumbnail folders", () => {
    expect(jobsFor("clues/key-1-plain-key.png", PLAN)).toEqual([
      {
        source: "art/clues/key-1-plain-key.png",
        output: "media/clues/key-1-plain-key.webp",
        size: 1600
      },
      {
        source: "art/clues/key-1-plain-key.png",
        output: "media/clues/key-1-plain-key-256.webp",
        size: 256
      }
    ]);
    expect(jobsFor("game/ward.webp", PLAN)).toEqual([
      { source: "art/game/ward.webp", output: "media/game/ward.webp" },
      { source: "art/game/ward.webp", output: "media/game/ward-256.webp", size: 256 }
    ]);
    expect(jobsFor("scenes/diorama-day.png", PLAN)).toEqual([
      { source: "art/scenes/diorama-day.png", output: "media/scenes/diorama-day.webp", size: 1600 }
    ]);
  });
});

describe("runJob", () => {
  // Catches: a small master enlarged past its own size, a crop instead of a fit, and an output
  // that is not webp.
  it("fits a PNG into the longer side as webp and never enlarges a smaller one", async () => {
    const source = await writeMaster("scenes/wide.png", 40, 20);

    await runJob({ source, output: media("scenes/fitted.webp"), size: 16 }, 82);
    await runJob({ source, output: media("scenes/kept.webp"), size: 100 }, 82);

    const fitted = await sharp(media("scenes/fitted.webp")).metadata();
    const kept = await sharp(media("scenes/kept.webp")).metadata();
    expect(fitted).toMatchObject({ format: "webp", width: 16, height: 8 });
    expect(kept).toMatchObject({ format: "webp", width: 40, height: 20 });
  });

  // Catches: the game's own art re-encoded (a second lossy pass) instead of copied.
  it("copies a job without a size byte for byte", async () => {
    const source = await writeMaster("game/ward.webp", 24, 24);

    await runJob({ source, output: media("game/ward.webp") }, 82);

    expect(await readFile(media("game/ward.webp"))).toEqual(await readFile(source));
  });
});

describe("writeImages", () => {
  // Catches: every run rewriting every output (the staleness check skipped or inverted), an edited
  // master whose old outputs are kept, and a manifest fed to the encoder.
  it("writes missing outputs, skips up-to-date ones, and rewrites an edited master's", async () => {
    const key = await writeMaster("clues/key.png", 40, 20);
    await writeMaster("scenes/desk.png", 40, 20);
    await writeFile(path.join(root, "art/clues/manifest.json"), "{}");

    const first = await writeImages(config());
    const second = await writeImages(config());
    const later = new Date(Date.now() + 60_000);
    await utimes(key, later, later);
    const third = await writeImages(config());

    const keyOutputs = [media("clues/key.webp"), media("clues/key-256.webp")];
    expect(first).toEqual({ written: [...keyOutputs, media("scenes/desk.webp")], upToDate: 0 });
    expect(second).toEqual({ written: [], upToDate: 3 });
    expect(third).toEqual({ written: keyOutputs, upToDate: 1 });
  });

  // Catches: a macOS `._name.png` resource fork (copied from an external drive) fed to the encoder,
  // which stops the whole run.
  it("skips hidden files and folders", async () => {
    await writeMaster("stickers/plant.png", 8, 8);
    await mkdir(path.join(root, "art/stickers/.cache"), { recursive: true });
    await writeFile(path.join(root, "art/stickers/._plant.png"), "not an image");
    await writeFile(path.join(root, "art/stickers/.cache/plant.png"), "not an image");

    const result = await writeImages(config());

    expect(result.written).toEqual([media("stickers/plant.webp")]);
  });
});
