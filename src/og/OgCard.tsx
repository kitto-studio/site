/**
 * @file The OG card, 1200 × 630, drawn by satori at build time (never shipped to the browser): a
 * postcard from the studio lying on the paper desk. The card's row picks the layout: the taped
 * photo postcard, or the folded letter of the legal pages. Measures and colours live in
 * `tokens.ts`, the pieces in `parts/`.
 */
import type { VNode } from "preact";
import { LETTER_TEXT, LegalLetter } from "./LegalLetter";
import { POSTCARD_SIDES, Postcard } from "./Postcard";
import type { OgCardProps, OgCardSpec } from "./types";

/**
 * The width of a card's headline column, px: the letter's text block, or the writing side of a
 * postcard.
 *
 * @param card - The card's row.
 * @returns The column width.
 * @example
 * ```ts
 * headlineWidth(OG_CARDS.home); // 500
 * headlineWidth(OG_CARDS.game); // 540
 * ```
 */
export function headlineWidth(card: OgCardSpec): number {
  return card.layout === "letter" ? LETTER_TEXT.width : POSTCARD_SIDES[card.side].writing.width;
}

/**
 * Render the OG card in its row's layout.
 *
 * @param props - OG card props.
 * @returns The card tree for satori.
 * @example
 * ```tsx
 * <OgCard card={OG_CARDS.home} text={text} site="kitto.studio" art={art} families={families} headlineSize={74} isCjk={false} />
 * ```
 */
export function OgCard(props: OgCardProps): VNode {
  const { card } = props;
  if (card.layout === "letter") return <LegalLetter {...props} card={card} />;
  return <Postcard {...props} card={card} />;
}
