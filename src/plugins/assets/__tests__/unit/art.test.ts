import { mkdtemp, rm, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { OgCardSpec } from "../../../../og/types";
import { artImages, createArtStore, cropWindow, loadArt } from "../../og/art";

type Colour = { r: number; g: number; b: number; alpha: number };

const RED: Colour = { r: 255, g: 0, b: 0, alpha: 1 };
const GREEN: Colour = { r: 0, g: 255, b: 0, alpha: 1 };
const BLUE: Colour = { r: 0, g: 0, b: 255, alpha: 1 };
const YELLOW: Colour = { r: 255, g: 255, b: 0, alpha: 1 };

let media = "";

/** Write a 40 × 30 picture, lossless so its colours come back exact. */
async function writePicture(name: string, colour: Colour, rightHalf: Colour = colour) {
  const half = { create: { width: 20, height: 30, channels: 4 as const, background: rightHalf } };
  await sharp({ create: { width: 40, height: 30, channels: 4, background: colour } })
    .composite([{ input: half, left: 20, top: 0 }])
    .webp({ lossless: true })
    .toFile(path.join(media, `${name}.webp`));
}

/** Decode a PNG `data:` URL: its size and the RGB of one pixel. */
async function inspect(dataUrl: string, x: number, y: number) {
  expect(dataUrl.startsWith("data:image/png;base64,")).toBe(true);
  const png = Buffer.from(dataUrl.slice("data:image/png;base64,".length), "base64");
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const offset = (y * info.width + x) * 4;
  return {
    width: info.width,
    height: info.height,
    rgb: [data[offset], data[offset + 1], data[offset + 2]]
  };
}

beforeAll(async () => {
  media = await mkdtemp(path.join(tmpdir(), "kitto-art-"));
  await writePicture("halves", RED, BLUE);
  await writePicture("far", RED);
  await writePicture("mid", GREEN);
  await writePicture("near", BLUE);
  await writePicture("front", YELLOW);
  await writePicture("sticker", GREEN);
  await writePicture("once", BLUE);
});

afterAll(async () => {
  await rm(media, { recursive: true, force: true });
});

// Catches: art cut from the wrong place (the design's offset read with the wrong sign), and a sharp
// error on an offset that would put the window past the picture's edge.
describe("cropWindow", () => {
  it("cuts the 300 × 390 window where the design offsets the picture", () => {
    expect(cropWindow({ width: 820, height: 547, x: -250, y: -70 })).toEqual({
      left: 250,
      top: 70,
      width: 300,
      height: 390
    });
  });

  it("keeps a window that would leave the picture inside it", () => {
    expect(cropWindow({ width: 820, height: 547, x: 40, y: -400 })).toEqual({
      left: 0,
      top: 157,
      width: 300,
      height: 390
    });
  });
});

describe("createArtStore", () => {
  // Catches: the window cut before the picture is drawn at its size (another part of the picture,
  // or a sharp error), and webp handed to satori, which reads no webp.
  it("cuts a crop from the picture drawn at its size, as a PNG", async () => {
    const store = createArtStore(media);
    const crop = await store.art({
      kind: "crop",
      image: "halves",
      width: 800,
      height: 600,
      x: -500,
      y: -100
    });

    expect(await inspect(crop, 150, 195)).toEqual({ width: 300, height: 390, rgb: [0, 0, 255] });
  });

  // Catches: layers stacked in the wrong order, the far hills drawn over the front ones.
  it("stacks layers far to front", async () => {
    const store = createArtStore(media);
    const layers = await store.art({
      kind: "layers",
      images: ["far", "mid", "near", "front"],
      width: 600,
      height: 450,
      x: -100,
      y: -30
    });

    const topLeft = await inspect(layers, 0, 0);
    expect(topLeft.rgb).toEqual([255, 255, 0]);
  });

  // Catches: every locale's card decoding the same art again (slow builds).
  it("reads each piece once per run", async () => {
    const store = createArtStore(media);
    const first = await store.sticker("once", 96);
    await unlink(path.join(media, "once.webp"));

    expect(await store.sticker("once", 96)).toBe(first);
  });
});

describe("loadArt", () => {
  // Catches: a sticker decoded at the wrong size (blurred or cut), the card sticker or the print
  // art left out, and a letter asking for a print it does not have.
  it("decodes each sticker at the size the card draws it", async () => {
    const store = createArtStore(media);
    const postcard: OgCardSpec = {
      page: "support",
      layout: "postcard",
      side: "left",
      headline: 96,
      print: { rotate: -2.8, ground: "#fff8ec" },
      art: { kind: "sticker", image: "sticker", size: 290, x: 5, y: 40, rotate: -7 },
      stamp: { image: "sticker", ground: "#d3dddd" },
      sticker: { image: "sticker", size: 130, x: 20, y: 440, rotate: -14 }
    };
    const art = await loadArt(postcard, store);

    const sizes = await Promise.all(
      [art.stamp, art.print ?? "", art.sticker ?? ""].map(async image => {
        const { width, height } = await inspect(image, 0, 0);
        return `${width} × ${height}`;
      })
    );
    expect(sizes).toEqual(["96 × 96", "290 × 290", "130 × 130"]);

    const letter = await loadArt(
      { page: "terms", layout: "letter", headline: 84, stamp: postcard.stamp },
      store
    );
    expect(letter).toEqual({ stamp: art.stamp });
  });
});

// Catches: a picture a card shows left out of its hash, so an edit of that picture never redraws
// the card.
describe("artImages", () => {
  it("lists the stamp, every print layer and the card's sticker", () => {
    const games: OgCardSpec = {
      page: "games",
      layout: "postcard",
      side: "left",
      headline: 96,
      print: { rotate: -2.8, ground: "#fff8ec" },
      art: { kind: "layers", images: ["far", "near"], width: 600, height: 450, x: 0, y: 0 },
      stamp: { image: "stamp", ground: "#d3dddd" },
      sticker: { image: "piece", size: 130, x: 20, y: 440, rotate: -14 }
    };
    const home: OgCardSpec = {
      page: "home",
      layout: "postcard",
      side: "left",
      headline: 74,
      print: games.print,
      art: { kind: "crop", image: "scene", width: 820, height: 547, x: 0, y: 0 },
      stamp: games.stamp
    };

    expect(artImages(games)).toEqual(["stamp", "far", "near", "piece"]);
    expect(artImages(home)).toEqual(["stamp", "scene"]);
    expect(
      artImages({ page: "terms", layout: "letter", headline: 84, stamp: games.stamp })
    ).toEqual(["stamp"]);
  });
});
