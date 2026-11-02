/**
 * @file The legal letter layout: a sheet folded in three, with a margin line, ruled lines, the
 * page title and text at the top, the site address as the signature, the stamp in the top right
 * corner and the postmark over the lower rules. No print: a legal page has no picture.
 */
import type { VNode } from "preact";
import { Desk } from "./parts/Desk";
import { Postmark } from "./parts/Postmark";
import { Stamp } from "./parts/Stamp";
import { Headline, Message } from "./parts/Words";
import { COLOR } from "./tokens";
import type { OgCardProps, OgLetterSpec } from "./types";

/**
 * The letter's text block: its place and width on the card, px.
 *
 * @example
 * ```ts
 * LETTER_TEXT.width; // 600
 * ```
 */
export const LETTER_TEXT = { x: 310, y: 78, width: 600 } as const;

/** Most message lines on a letter: more would run under the postmark. */
const LETTER_MESSAGE_LINES = 3;

/** Margin line down the sheet, px. */
const MARGIN_LINE = { x: 278, y: 24, width: 2, height: 582 } as const;

/** The two folds across the sheet: a shade, then a highlight, px. */
const FOLD = {
  x: 28,
  width: 1144,
  height: 26,
  tops: [250, 432],
  shade:
    "linear-gradient(180deg, rgba(85, 60, 47, 0), rgba(85, 60, 47, 0.055) 48%, rgba(255, 255, 255, 0.9) 52%, rgba(255, 255, 255, 0))"
} as const;

/** The ruled lines, px. */
const RULES = { x: 310, width: 830, height: 2, tops: [330, 388, 446, 504, 562] } as const;

/**
 * Places of the signature, the stamp and the postmark, px. The postmark sits beside the signature
 * line, below the three message lines a letter allows.
 */
const PLACES = {
  signature: { x: 314, y: 512 },
  stamp: { x: 1010, y: 58 },
  postmark: { x: 720, y: 440 }
} as const;

/** Legal letter props: the card props with a letter row. */
type LegalLetterProps = OgCardProps & {
  /** The card's row. */
  card: OgLetterSpec;
};

/**
 * Render a legal letter.
 *
 * @param props - Legal letter props.
 * @param props.card - The card's row.
 * @param props.text - The words on the card.
 * @param props.site - The site address, written as the signature.
 * @param props.art - The art images; a letter has only the stamp.
 * @param props.families - Font lists of the text styles.
 * @param props.headlineSize - Headline size.
 * @param props.isCjk - Whether the card is set in a CJK locale.
 * @returns The card tree for satori.
 * @example
 * ```tsx
 * <LegalLetter card={privacy} text={text} site="kitto.studio" art={art} families={families} headlineSize={84} isCjk={false} />
 * ```
 */
export function LegalLetter({
  card,
  text,
  site,
  art,
  families,
  headlineSize,
  isCjk
}: LegalLetterProps): VNode {
  return (
    <Desk>
      {FOLD.tops.map(top => (
        <div
          key={top}
          style={{
            position: "absolute",
            left: FOLD.x,
            top,
            width: FOLD.width,
            height: FOLD.height,
            backgroundImage: FOLD.shade
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: MARGIN_LINE.x,
          top: MARGIN_LINE.y,
          width: MARGIN_LINE.width,
          height: MARGIN_LINE.height,
          backgroundColor: COLOR.letterMargin
        }}
      />
      {RULES.tops.map(top => (
        <div
          key={top}
          style={{
            position: "absolute",
            left: RULES.x,
            top,
            width: RULES.width,
            height: RULES.height,
            backgroundColor: COLOR.letterRule
          }}
        />
      ))}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          left: LETTER_TEXT.x,
          top: LETTER_TEXT.y,
          width: LETTER_TEXT.width
        }}
      >
        <Headline
          text={text.headline}
          size={headlineSize}
          family={families.heading}
          isCjk={isCjk}
          paddingTop={0}
        />
        <Message
          text={text.message}
          size={32}
          color={COLOR.letterText}
          family={families.message}
          isCjk={isCjk}
          maxLines={LETTER_MESSAGE_LINES}
        />
      </div>
      <Stamp x={PLACES.stamp.x} y={PLACES.stamp.y} ground={card.stamp.ground} image={art.stamp} />
      <div
        style={{
          display: "flex",
          position: "absolute",
          left: PLACES.signature.x,
          top: PLACES.signature.y,
          fontFamily: families.strong,
          fontWeight: 600,
          fontSize: 32,
          color: COLOR.ink
        }}
      >
        {site}
      </div>
      <Postmark x={PLACES.postmark.x} y={PLACES.postmark.y} />
    </Desk>
  );
}
