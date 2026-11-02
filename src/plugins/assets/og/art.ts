/**
 * @file OG card art: the webp pictures of the media folder (`public/media`), cut to what a card shows and handed to
 * satori as PNG `data:` URLs (satori and resvg read no webp). A print's crop is stated the way the
 * design states it: the picture drawn at `width × height`, offset `x, y` inside the 300 × 390 photo
 * window. A sticker is decoded at the size the card draws it; satori places and turns it. Every
 * locale's card shows the same art, so each piece is read once per run.
 */
import path from "node:path";
import sharp from "sharp";
import { PHOTO_SIZE, STAMP_ART_SIZE } from "../../../og/tokens";
import type { OgArtImages, OgCardSpec } from "../../../og/types";
import type { ArtStore, CropWindow } from "./types";

/** Fully transparent, the background of a contained sticker and of stacked layers. */
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

/** A picture drawn at a size and offset inside the photo window. */
type Placement = Pick<CropWindow, "width" | "height"> & {
  /** Left edge of the picture inside the window, px. */
  x: number;
  /** Top edge of the picture inside the window, px. */
  y: number;
};

/**
 * Hold a value inside a range.
 *
 * @param value - The value.
 * @param low - Smallest allowed value.
 * @param high - Largest allowed value.
 * @returns The value, moved to the nearer end when it is outside.
 */
function clamp(value: number, low: number, high: number): number {
  return Math.min(Math.max(value, low), high);
}

/**
 * The part of a placed picture the photo window shows. A window that would leave the picture is
 * moved back inside it, so sharp never cuts past an edge.
 *
 * @param placement - Size the picture is drawn at and its offset inside the window.
 * @returns The rectangle to cut from the picture drawn at its size.
 * @example
 * ```ts
 * cropWindow({ width: 820, height: 547, x: -250, y: -70 }); // { left: 250, top: 70, width: 300, height: 390 }
 * ```
 */
export function cropWindow(placement: Placement): CropWindow {
  const width = Math.min(PHOTO_SIZE.width, placement.width);
  const height = Math.min(PHOTO_SIZE.height, placement.height);
  return {
    left: clamp(-placement.x, 0, placement.width - width),
    top: clamp(-placement.y, 0, placement.height - height),
    width,
    height
  };
}

/**
 * A PNG as a `data:` URL.
 *
 * @param png - PNG bytes.
 * @returns The `data:` URL.
 */
function pngDataUrl(png: Buffer): string {
  return `data:image/png;base64,${png.toString("base64")}`;
}

/**
 * Read one art file, draw it at its placed size and cut the photo window from it.
 *
 * @param mediaDirectory - The art folder.
 * @param image - The art file, without `.webp`.
 * @param placement - Size and offset of the picture.
 * @returns The window as PNG bytes.
 */
function cutWindow(mediaDirectory: string, image: string, placement: Placement): Promise<Buffer> {
  return sharp(path.join(mediaDirectory, `${image}.webp`))
    .resize(placement.width, placement.height, { fit: "fill" })
    .extract(cropWindow(placement))
    .png()
    .toBuffer();
}

/**
 * Cut every layer the same way and stack them, the first (farthest) at the bottom.
 *
 * @param mediaDirectory - The art folder.
 * @param images - The art files, far first.
 * @param placement - Size and offset shared by every layer.
 * @returns The stacked window as PNG bytes.
 */
async function stackLayers(
  mediaDirectory: string,
  images: readonly string[],
  placement: Placement
): Promise<Buffer> {
  const layers = await Promise.all(
    images.map(image => cutWindow(mediaDirectory, image, placement))
  );
  const { width, height } = cropWindow(placement);
  return sharp({ create: { width, height, channels: 4, background: TRANSPARENT } })
    .composite(layers.map(input => ({ input })))
    .png()
    .toBuffer();
}

/**
 * Read one sticker at the size it is drawn, contained in its square.
 *
 * @param mediaDirectory - The art folder.
 * @param image - The art file, without `.webp`.
 * @param size - Width and height, px.
 * @returns The sticker as PNG bytes.
 */
function readSticker(mediaDirectory: string, image: string, size: number): Promise<Buffer> {
  return sharp(path.join(mediaDirectory, `${image}.webp`))
    .resize(size, size, { fit: "contain", background: TRANSPARENT })
    .png()
    .toBuffer();
}

/**
 * Create an art store: each piece is read once per store and kept as a PNG `data:` URL.
 *
 * @param mediaDirectory - The art folder: the assets plugin's `outDir`, `public/media`.
 * @returns A store for one run.
 * @example
 * ```ts
 * const art = await loadArt(OG_CARDS.home, createArtStore("public/media"));
 * ```
 */
export function createArtStore(mediaDirectory: string): ArtStore {
  const pieces = new Map<string, Promise<string>>();

  /**
   * The kept piece under a key, or the one `read` makes.
   *
   * @param key - What the piece is.
   * @param read - Reads the piece as PNG bytes.
   * @returns The piece as a `data:` URL.
   */
  const keep = (key: string, read: () => Promise<Buffer>): Promise<string> => {
    const piece = pieces.get(key) ?? read().then(png => pngDataUrl(png));
    pieces.set(key, piece);
    return piece;
  };

  const store: ArtStore = {
    sticker: (image, size) =>
      keep(`sticker ${image} ${size}`, () => readSticker(mediaDirectory, image, size)),
    art: art => {
      if (art.kind === "sticker") return store.sticker(art.image, art.size);
      const key = JSON.stringify(art);
      if (art.kind === "crop") return keep(key, () => cutWindow(mediaDirectory, art.image, art));
      return keep(key, () => stackLayers(mediaDirectory, art.images, art));
    }
  };
  return store;
}

/**
 * Load the art of one card: the stamp's sticker and, on a postcard, the print's art and the card's
 * own sticker.
 *
 * @param card - The card's row.
 * @param store - The run's art store.
 * @returns The art as PNG `data:` URLs.
 * @example
 * ```ts
 * const { stamp, print } = await loadArt(OG_CARDS.game, store);
 * ```
 */
export async function loadArt(card: OgCardSpec, store: ArtStore): Promise<OgArtImages> {
  const stamp = await store.sticker(card.stamp.image, STAMP_ART_SIZE);
  if (card.layout === "letter") return { stamp };

  const images: OgArtImages = { stamp, print: await store.art(card.art) };
  if (card.sticker !== undefined) {
    images.sticker = await store.sticker(card.sticker.image, card.sticker.size);
  }
  return images;
}

/**
 * The art files one card shows: its stamp's sticker and, on a postcard, the print's pictures and
 * the card's own sticker. A change to any of them redraws the card.
 *
 * @param card - The card's row.
 * @returns The art files under the media folder, without `.webp`, in drawing order.
 * @example
 * ```ts
 * artImages(OG_CARDS.home); // ["stickers/phone", "scenes/diorama-day"]
 * ```
 */
export function artImages(card: OgCardSpec): string[] {
  if (card.layout === "letter") return [card.stamp.image];

  const print = card.art.kind === "layers" ? card.art.images : [card.art.image];
  const sticker = card.sticker === undefined ? [] : [card.sticker.image];
  return [card.stamp.image, ...print, ...sticker];
}
