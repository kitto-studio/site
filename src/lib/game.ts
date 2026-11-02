/**
 * @file A Memory Missing data for its page: the gallery, in the order it is shown.
 *
 * To add a screenshot, add an entry: the full image and its 256 px thumbnail from
 * `public/media/game/` (written by `scripts/images.ts`), their pixel sizes, the string keys of its
 * alt text and caption (add both to `game.gallery` in every locale), and its kind:
 * - `art`: landscape art, shown as a print;
 * - `phone`: a portrait phone screenshot, shown in a soft phone frame drawn in CSS.
 */
import type { GameStrings } from "../i18n/types";

/** How a gallery picture is framed. */
export type GalleryKind = "art" | "phone";

/** The string keys of a picture's alt text and caption in `game.gallery`. */
export type GalleryTextKey = Extract<
  keyof GameStrings["gallery"],
  `${string}Alt` | `${string}Label`
>;

/** An image file and its pixel size (reserves the space before it loads). */
export type GalleryImage = {
  /** URL under `public/`. */
  src: string;
  /** Width, px. */
  w: number;
  /** Height, px. */
  h: number;
};

/** One picture of the gallery. */
export type GalleryItem = GalleryImage & {
  /** The 256 px copy for the thumbnail strip. */
  thumb: GalleryImage;
  /** Alt text key. */
  altKey: GalleryTextKey;
  /** Caption key. */
  labelKey: GalleryTextKey;
  /** How it is framed. */
  kind: GalleryKind;
};

/**
 * The game page gallery: Hanna's key art and the game's loading screen, until screenshots arrive.
 */
export const GALLERY: readonly GalleryItem[] = [
  {
    src: "/media/game/ward.webp",
    w: 1448,
    h: 1086,
    thumb: { src: "/media/game/ward-256.webp", w: 256, h: 192 },
    altKey: "wardAlt",
    labelKey: "wardLabel",
    kind: "art"
  },
  {
    src: "/media/game/game-splash.webp",
    w: 780,
    h: 1688,
    thumb: { src: "/media/game/game-splash-256.webp", w: 118, h: 256 },
    altKey: "splashAlt",
    labelKey: "splashLabel",
    kind: "phone"
  }
];
