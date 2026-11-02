import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { OG_CARD_NAMES } from "../../../../lib/head";
import { OG_CARDS } from "../../../../og/cards";
import { artImages } from "../../og/art";
import { cardHash, codeHash, hashFiles, installedVersions, ogInputs } from "../../og/hash";
import type { OgInputs } from "../../og/types";

let root = "";

beforeEach(async () => {
  root = await mkdtemp(path.join(tmpdir(), "kitto-hash-"));
});

afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});

/** Write a file under the temporary folder, with its folders. */
const put = async (relative: string, content: string | Buffer): Promise<void> => {
  const file = path.join(root, relative);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, content);
};

// Catches: an edit of a nested card source that redraws no card, and a Finder `.DS_Store` or
// another hidden file that redraws every card.
describe("hashFiles", () => {
  it("changes with the bytes of a nested file and ignores hidden files", async () => {
    await put("og/parts/Stamp.tsx", "stamp");
    await put("config.ts", "site");
    const sources = [path.join(root, "og"), path.join(root, "config.ts")];
    const before = await hashFiles(sources);

    await put("og/.DS_Store", "finder");
    await put("og/.cache/parts.json", "{}");
    expect(await hashFiles(sources)).toBe(before);

    await put("og/parts/Stamp.tsx", "stamp, moved 2 px");
    expect(await hashFiles(sources)).not.toBe(before);
  });
});

// Catches: a version read from another package or another field, so an update of satori, resvg,
// sharp or a font package does not redraw the cards it changes.
describe("installedVersions", () => {
  it("reads the installed version of every drawing package", async () => {
    const pinned: { devDependencies: Record<string, string> } = JSON.parse(
      await readFile("package.json", "utf8")
    );
    const versions = await installedVersions();

    expect(Object.keys(versions)).toHaveLength(8);
    for (const [name, version] of Object.entries(versions)) {
      expect(version, name).toBe(pinned.devDependencies[name]);
    }
  });
});

// Catches: an update of a drawing package that redraws no card.
describe("codeHash", () => {
  it("changes with the sources and with an installed version", () => {
    const versions = { satori: "0.19.1", sharp: "0.35.5" };
    const before = codeHash("sources", versions);

    expect(codeHash("edited sources", versions)).not.toBe(before);
    expect(codeHash("sources", { ...versions, satori: "0.19.2" })).not.toBe(before);
  });
});

// Catches: a picture edit that redraws no card, or one that redraws the cards that do not show it.
describe("ogInputs", () => {
  it("changes the art hash of exactly the rows that show a changed picture", async () => {
    const images = new Set(Object.values(OG_CARDS).flatMap(card => artImages(card)));
    for (const image of images) {
      await mkdir(path.dirname(path.join(root, `${image}.webp`)), { recursive: true });
      await copyFile(path.join("public/media", `${image}.webp`), path.join(root, `${image}.webp`));
    }
    const before = await ogInputs(root);

    await put("stickers/plant.webp", "another plant");
    const after = await ogInputs(root);

    expect(after.code).toBe(before.code);
    for (const name of OG_CARD_NAMES) {
      const showsPlant = artImages(OG_CARDS[name]).includes("stickers/plant");
      expect(after.art.get(name) !== before.art.get(name), name).toBe(showsPlant);
    }
  });
});

// Catches: a card hash that ignores the drawing code (a satori update redraws nothing), ignores its
// own art, or takes another card's art (one picture edit redrawing the wrong card).
describe("cardHash", () => {
  afterEach(() => {
    vi.doUnmock("../../../../config");
  });

  it("changes with the code and with the card's own art only", () => {
    const inputs: OgInputs = {
      code: "code",
      art: new Map([
        ["home", "home art"],
        ["game", "game art"]
      ])
    };
    const newCode: OgInputs = { ...inputs, code: "satori update" };
    const newGameArt: OgInputs = {
      ...inputs,
      art: new Map([...inputs.art, ["game", "new game art"]])
    };

    expect(cardHash("home", "en", newCode)).not.toBe(cardHash("home", "en", inputs));
    expect(cardHash("game", "en", newGameArt)).not.toBe(cardHash("game", "en", inputs));
    expect(cardHash("home", "en", newGameArt)).toBe(cardHash("home", "en", inputs));
  });
  // Catches: a new site address left out of the hash, so every card keeps the old address
  // (the address is read from `SITE`, no longer from the hashed config file).
  it("changes with the site address", async () => {
    const inputs: OgInputs = { code: "code", art: new Map([["home", "home art"]]) };
    const before = cardHash("home", "en", inputs);
    vi.resetModules();
    vi.doMock("../../../../config", async importOriginal => {
      const config = await importOriginal<typeof import("../../../../config")>();
      return { ...config, SITE: { ...config.SITE, url: "https://kitto.example" } };
    });
    const moved = await import("../../og/hash");

    expect(moved.cardHash("home", "en", inputs)).not.toBe(before);
  });
});
