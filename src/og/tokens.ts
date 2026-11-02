/**
 * @file The OG card's fixed measures and colours, read by the layouts, the parts and the assets
 * plugin's art step. Satori reads inline styles only, so the brand colours are written here as
 * values (brand-system §3, light theme, and the paper tones of the postcard design) instead of CSS
 * tokens.
 */

/** Card size, px. */
export const OG_CARD_SIZE = { width: 1200, height: 630 } as const;

/** The photo window inside a print, px. */
export const PHOTO_SIZE = { width: 300, height: 390 } as const;

/** Width and height of the stamp's sticker, px. */
export const STAMP_ART_SIZE = 96;

/** Brand colours, light theme (brand-system §3), and the paper tones of the postcard design. */
export const COLOR = {
  paper: "#f6f2ea",
  surface: "#fffdf8",
  ink: "#553c2f",
  text: "#3b2c24",
  /** `quiet`: muted 70% over text, small text that passes AA. */
  quiet: "#72655b",
  line: "#e3dacc",
  dot: "#d9653a",
  /** The white border of a photo print. */
  print: "#ffffff",
  /** The darker sheet under the card. */
  underSheet: "#eadfcb",
  /** Ruled lines of the legal letter. */
  letterRule: "#ece4d6",
  /** Message of the legal letter. */
  letterText: "#5a4a40",
  /** Margin line of the legal letter. */
  letterMargin: "rgba(217, 101, 58, 0.38)"
} as const;
