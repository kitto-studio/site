/**
 * @file Types of the OG card step: the card fonts read from the `@fontsource` packages, the words on
 * a card, and the cache that keeps the drawn cards for the life of the process.
 */

/** Font weights the OG cards use. */
export type OgFontWeight = 500 | 800 | 900;

/** One font face from a pinned `@fontsource` package. */
export type FontFace = {
  /** Family name, also the start of every slice name. */
  family: string;
  /** Package name under `@fontsource/`. */
  pkg: string;
  /** Weight of the woff files to read. */
  weight: OgFontWeight;
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

/** The words on one OG card. */
export type OgCardText = {
  /** The big line: the slogan or the game title. */
  headline: string;
  /** The line under it. */
  lead: string;
  /** A status line with the dot, on the game card. */
  status?: string;
};

/**
 * The drawn card PNGs, keyed `{kind}/{locale}` (`home/ja`). The card words come from string tables
 * loaded once per process, so a card drawn once stays right until the process ends.
 */
export type CardCache = Map<string, Buffer>;

/** What writing one card needs from its run. */
export type CardRun = {
  /** The built output directory. */
  outputDirectory: string;
  /** The drawn cards of the process; a card missing from it is drawn and added. */
  cards: CardCache;
  /** The run's font store. */
  store: FontStore;
};
