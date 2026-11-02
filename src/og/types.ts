/**
 * @file Types of the OG cards: a row of the card table (`OG_CARDS` in `cards.ts`), the art of a
 * photo print, and the props the layouts take. Every number of a row is card px (1200 × 630).
 */
import type { PageId } from "../i18n/types";
import type { OgCardText } from "../plugins/assets/og/types";

/** A page whose head copy a card shows: every page with a `meta` entry. */
export type OgCardPage = Exclude<PageId, "root" | "notFound">;

/** The side of a postcard the photo print is on; the writing takes the other side. */
export type OgSide = "left" | "right";

/**
 * A cut-out sticker, decoded at `size × size` and turned by `rotate` degrees around its centre.
 *
 * @example
 * ```ts
 * const envelope: OgSticker = { image: "stickers/envelope", size: 290, x: 5, y: 40, rotate: -7 };
 * ```
 */
export type OgSticker = {
  /** The art file under `public/media`, without `.webp`. */
  image: string;
  /** Width and height, px. */
  size: number;
  /** Left edge inside its box, px. */
  x: number;
  /** Top edge inside its box, px. */
  y: number;
  /** Turn, degrees. */
  rotate: number;
};

/**
 * The art inside a print's 300 × 390 photo window. `crop` and `layers` state the picture the way
 * the design does: drawn at `width × height`, offset `x, y` inside the window.
 *
 * @example
 * ```ts
 * const studio: OgArt = { kind: "crop", image: "scenes/diorama-day", width: 820, height: 547, x: -250, y: -70 };
 * ```
 */
export type OgArt =
  | {
      /** One picture, cut to the window. */
      kind: "crop";
      /** The art file under `public/media`, without `.webp`. */
      image: string;
      /** Width the picture is drawn at, px. */
      width: number;
      /** Height the picture is drawn at, px. */
      height: number;
      /** Left edge of the picture inside the window, px (0 or less). */
      x: number;
      /** Top edge of the picture inside the window, px (0 or less). */
      y: number;
    }
  | {
      /** Several pictures, each cut the same way, stacked far to front. */
      kind: "layers";
      /** The art files, far first. */
      images: readonly string[];
      /** Width every picture is drawn at, px. */
      width: number;
      /** Height every picture is drawn at, px. */
      height: number;
      /** Left edge of every picture inside the window, px. */
      x: number;
      /** Top edge of every picture inside the window, px. */
      y: number;
    }
  | ({
      /** A sticker on the print's ground. */
      kind: "sticker";
    } & OgSticker);

/** The stamp in the top corner: a sticker on its own soft ground. */
export type OgStamp = {
  /** The art file under `public/media`, without `.webp`. */
  image: string;
  /** Ground colour of the stamp. */
  ground: string;
};

/** The photo print's tilt and the ground the art lies on. */
export type OgPrint = {
  /** Turn of the print, degrees. */
  rotate: number;
  /** CSS background of the photo window: a colour or a gradient. */
  ground: string;
};

/**
 * A postcard: a taped photo print on one side, the writing on the other.
 *
 * @example
 * ```ts
 * const about: OgPostcardSpec = { page: "about", layout: "postcard", side: "right", headline: 96, print, art, stamp };
 * ```
 */
export type OgPostcardSpec = {
  /** The page whose title and description the card shows. */
  page: OgCardPage;
  /** Layout. */
  layout: "postcard";
  /** The side the photo print is on. */
  side: OgSide;
  /** Headline size of the design, px; Latin and Cyrillic cards start there. */
  headline: number;
  /** Most lines the headline may take; 2 when absent, so the message keeps its room. */
  headlineLines?: number;
  /**
   * Most space between the headline and the message, px. The prototype lets a short headline fill
   * the free height, which satori cannot do safely: the gap takes a share of the free height up to
   * this, and none when a long headline or message leaves no room.
   */
  messageGap?: number;
  /** The photo print. */
  print: OgPrint;
  /** The art in the print. */
  art: OgArt;
  /** The stamp. */
  stamp: OgStamp;
  /** A sticker on the card, over the print's corner. */
  sticker?: OgSticker;
  /** Shows the game's store status in a chip above the headline. */
  status?: boolean;
  /** Writes the support address on the address line. */
  email?: boolean;
};

/**
 * A legal letter: a folded sheet with ruled lines and the signature, no print.
 *
 * @example
 * ```ts
 * const privacy: OgLetterSpec = { page: "privacy", layout: "letter", headline: 84, stamp };
 * ```
 */
export type OgLetterSpec = {
  /** The page whose title and description the card shows. */
  page: OgCardPage;
  /** Layout. */
  layout: "letter";
  /** Headline size of the design, px. */
  headline: number;
  /** The stamp. */
  stamp: OgStamp;
};

/** One row of the card table. */
export type OgCardSpec = OgPostcardSpec | OgLetterSpec;

/** The two card layouts. */
export type OgLayout = OgCardSpec["layout"];

/** The art of one card as PNG `data:` URLs, each at the size it is drawn. */
export type OgArtImages = {
  /** The stamp's sticker. */
  stamp: string;
  /** The print's art: the cut window, or the sticker on the print's ground. Postcards only. */
  print?: string;
  /** The sticker on the card, when the row has one. */
  sticker?: string;
};

/** The `font-family` lists of a card's four text styles. */
export type OgFamilies = {
  /** The headline. */
  heading: string;
  /** The message. */
  message: string;
  /** Address, support email, status chip, signature. */
  strong: string;
  /** The second address line of the support card. */
  quiet: string;
};

/** Props of the OG card and its two layouts. */
export type OgCardProps = {
  /** The card's row. */
  card: OgCardSpec;
  /** The words on the card. */
  text: OgCardText;
  /** The site address, `kitto.studio`. */
  site: string;
  /** The art, as PNG `data:` URLs. */
  art: OgArtImages;
  /** Font lists of the text styles. */
  families: OgFamilies;
  /** Headline size that fits the column, px. */
  headlineSize: number;
  /** Lines the headline takes at that size. */
  headlineLines: number;
  /** Whether the card is set in a CJK locale: taller lines, open tracking, smaller message. */
  isCjk: boolean;
};
