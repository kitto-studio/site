/**
 * @file Types of the OG cards: the card fonts read from the `@fontsource` packages, the art read
 * from the media folder, the words on a card, the inputs a card's hash is made of and the manifest
 * of drawn cards.
 */
import type { OgCardName } from "../../../og/cards";
import type { OgArt } from "../../../og/types";

export type { OgCardText } from "../../../og/types";

/** Font weights the OG cards use. */
export type OgFontWeight = 400 | 500 | 600 | 800 | 900;

/** One font face from a pinned `@fontsource` package. */
export type FontFace = {
  /** Family name, also the start of every slice name. */
  family: string;
  /** Package name under `@fontsource/`. */
  pkg: string;
  /** Weight of the woff files to read. */
  weight: OgFontWeight;
};

/** The font stacks of a card's four text styles, each in fallback order. */
export type CardStacks = {
  /** The headline. */
  heading: FontFace[];
  /** The message. */
  message: FontFace[];
  /** Address, support email, status chip, signature. */
  strong: FontFace[];
  /** The second address line of the support card. */
  quiet: FontFace[];
};

/** A font face with the code point ranges of each of its slices. */
export type FaceRanges = {
  /** The face. */
  face: FontFace;
  /** Code point ranges per slice, keyed as in the package's `unicode.json` (`latin`, `[12]`). */
  slices: Readonly<Record<string, readonly CodePointRange[]>>;
};

/** An inclusive range of Unicode code points. */
export type CodePointRange = {
  /** First code point. */
  start: number;
  /** Last code point. */
  end: number;
};

/** One slice picked for a card. */
export type PickedSlice = {
  /** The face the slice belongs to. */
  face: FontFace;
  /** The slice key, as in `unicode.json`. */
  slice: string;
};

/** A font as satori takes it. */
export type CardFont = {
  /** Unique name, used in `fontFamily`. */
  name: string;
  /** The woff bytes. */
  data: Buffer;
  /** Weight of the face. */
  weight: OgFontWeight;
  /** Always upright. */
  style: "normal";
};

/** The fonts that draw one text of a card. */
export type LoadedStack = {
  /** CSS `font-family` list of the picked slices, in fallback order. */
  family: string;
  /** The picked slices. */
  fonts: readonly CardFont[];
};

/** Reads and caches what the font steps load during one run. */
export type FontStore = {
  /** The slice ranges of a package. */
  slices(pkg: string): Promise<FaceRanges["slices"]>;
  /** The bytes of one woff file. */
  file(path: string): Promise<Buffer>;
};

/** The part of a picture a print shows: a rectangle of the picture as drawn, px. */
export type CropWindow = {
  /** Left edge. */
  left: number;
  /** Top edge. */
  top: number;
  /** Width. */
  width: number;
  /** Height. */
  height: number;
};

/** Reads the card art of one run; each piece is decoded once and kept as a PNG `data:` URL. */
export type ArtStore = {
  /** A print's art: the cut photo window, or a sticker at its size. */
  art(art: OgArt): Promise<string>;
  /** A sticker decoded at `size × size`. */
  sticker(image: string, size: number): Promise<string>;
};

/** The stores one card is drawn from. */
export type CardStores = {
  /** The run's font store. */
  fonts: FontStore;
  /** The run's art store. */
  art: ArtStore;
};

/**
 * What every card is drawn from, hashed once per run: the drawing code and the installed drawing
 * packages, and the art of each row.
 */
export type OgInputs = {
  /** Hash of the card sources and the installed versions of the drawing packages. */
  code: string;
  /** Hash of the art bytes each row shows, by card. */
  art: ReadonlyMap<OgCardName, string>;
};

/**
 * The input hash of every drawn card, keyed `{card}/{locale}` (`game/zh`): the content of
 * `assets/og-manifest.json`.
 */
export type OgManifest = Record<string, string>;
