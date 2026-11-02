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
  about: {
    page: "about",
    layout: "postcard",
    side: "right",
    headline: 96,
    messageGap: 47,
    print: { rotate: 2.6, ground: "#f3ecdf" },
    art: { kind: "crop", image: "scenes/diorama-day", width: 960, height: 640, x: -400, y: -200 },
    stamp: { image: "stickers/tea-mug", ground: "#d6dfcb" }
  },
  games: {
    page: "games",
    layout: "postcard",
    side: "left",
    headline: 96,
    messageGap: 47,
    print: { rotate: -2.2, ground: "linear-gradient(180deg, #fbf4e8, #f4e9d6)" },
    art: {
      kind: "layers",
      images: ["layers/day-far", "layers/day-mid", "layers/day-near", "layers/day-front"],
      width: 780,
      height: 520,
      x: -330,
      y: -110
    },
    sticker: { image: "stickers/puzzle-piece", size: 130, x: 20, y: 440, rotate: -14 },
    stamp: { image: "stickers/sketchbook", ground: "#e7d8be" }
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
  },
  support: {
    page: "support",
    layout: "postcard",
    side: "left",
    headline: 96,
    messageGap: 35,
    messageLines: 4,
    print: {
      rotate: -2.8,
      ground: "radial-gradient(circle at 50% 42%, #fff8ec 0%, #f1e5d1 60%, #e6d6bc 100%)"
    },
    art: { kind: "sticker", image: "stickers/envelope", size: 290, x: 5, y: 40, rotate: -7 },
    stamp: { image: "stickers/desk-lamp", ground: "#d3dddd" },
    email: true
  },
  privacy: {
    page: "privacy",
    layout: "letter",
    headline: 84,
    stamp: { image: "stickers/plant", ground: "#e2dccd" }
  },
  terms: {
    page: "terms",
    layout: "letter",
    headline: 84,
    stamp: { image: "stickers/plant", ground: "#e2dccd" }
  },
  "delete-data": {
    page: "deleteData",
    layout: "letter",
    headline: 84,
    stamp: { image: "stickers/plant", ground: "#e2dccd" }
  }
} as const satisfies Record<string, OgCardSpec>;

/** The name of an OG card, also its file name. */
export type OgCardName = keyof typeof OG_CARDS;
