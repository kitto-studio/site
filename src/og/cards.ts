/**
 * @file The OG card table: one row per card, the plain data each card is drawn from. The art,
 * crops, tilts, stamps and sizes are the numbers of the approved postcard design (design context
 * §6 G). Every card is written to `og/{locale}/{card}.png` in every locale; a page without a row
 * links the home card (`ogCardOf` in `src/lib/head.ts`).
 */
import type { OgCardSpec } from "./types";

/**
 * The OG cards, by name.
 *
 * @example
 * ```ts
 * OG_CARDS.game.page; // "memoryMissing"
 * ```
 */
export const OG_CARDS = {
  home: {
    page: "home",
    layout: "postcard",
    side: "left",
    headline: 74,
    print: { rotate: -3, ground: "#f3ecdf" },
    art: { kind: "crop", image: "scenes/diorama-day", width: 820, height: 547, x: -250, y: -70 },
    stamp: { image: "stickers/phone", ground: "#efcdb6" }
  },
  game: {
    page: "memoryMissing",
    layout: "postcard",
    side: "right",
    headline: 54,
    headlineLines: 3,
    print: { rotate: 2.4, ground: "#2b3550" },
    art: { kind: "crop", image: "game/ward", width: 560, height: 420, x: -246, y: -14 },
    stamp: { image: "clues/memory-glowing-orb", ground: "#d9d3e6" },
    status: true
  }
} as const satisfies Record<string, OgCardSpec>;

/** The name of an OG card, also its file name. */
export type OgCardName = keyof typeof OG_CARDS;
