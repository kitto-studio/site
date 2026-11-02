/**
 * @file OG cards, the postbuild sub-domain: every row of `OG_CARDS` drawn as a 1200 × 630 postcard
 * PNG in every locale (`og/{lang}/{card}.png`, the paths `pageHead` links).
 *
 * - `render.ts`: the words, fonts, art and headline size of one card, laid out by satori.
 * - `write.ts`: the loop over cards and locales, with the process's card cache.
 * - `art.ts`, `fit.ts`, `fonts.ts`: the art, the headline size and the font slices.
 */
export { cardStacks, cardText, renderOgCard } from "./render";
export { writeOgCards } from "./write";
