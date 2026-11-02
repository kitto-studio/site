/**
 * @file The headline size of an OG card. A page title is longer in some locales than in others, so
 * each card starts at its design size and steps down by 2 px until the headline fits its column in
 * the lines the card allows, never below a readable floor. The width is an estimate per character,
 * read before satori lays the card out: 0.58 em for a Latin or Cyrillic letter, 0.3 em for a space,
 * 1 em for a CJK character, 0.5 em for anything else.
 */
import { CJK, type Locale } from "../../../i18n/languages";
import { headlineWidth } from "../../../og/OgCard";
import type { OgCardSpec } from "../../../og/types";

/** Headline size of a CJK card, px (design A8); a row with a smaller design size keeps its own. */
const CJK_BASE = 58;

/** Smallest headline, px, by script. */
const FLOOR = { latin: 48, cjk: 44 } as const;

/** How much each try shrinks the headline, px. */
const STEP = 2;

/** Lines a headline may take when its row names none: two, so the message keeps its room. */
const DEFAULT_LINES = 2;

/** Estimated widths, em. */
const EM = { letter: 0.58, space: 0.3, cjk: 1, other: 0.5 } as const;

/** CJK scripts and their punctuation: every such character is its own break opportunity. */
const CJK_CLASS = String.raw`\p{scx=Han}\p{scx=Hiragana}\p{scx=Katakana}\p{scx=Hangul}\u{3000}-\u{303F}\u{FF00}-\u{FFEF}`;

/** One CJK character. */
const CJK_CHARACTER = new RegExp(`[${CJK_CLASS}]`, "u");

/** A Latin or Cyrillic letter. */
const LETTER = /[\p{Script=Latin}\p{Script=Cyrillic}]/u;

/** Any space, the no-break ones included. */
const SPACE = /\s/u;

/**
 * One piece a line may break before: the ordinary spaces in front of it, then a word or a single
 * CJK character. A no-break space stays inside its word.
 */
const PIECE = new RegExp(`( *)([${CJK_CLASS}]|[^ ${CJK_CLASS}]+)`, "gu");

/** The headline box of one card. */
export type HeadlineFrame = {
  /** Design size of the row, px. */
  base: number;
  /** Most lines the headline may take. */
  maxLines: number;
  /** Width of the headline column, px. */
  width: number;
};

/**
 * The estimated width of one character.
 *
 * @param character - One character.
 * @returns Its width, em.
 */
function characterWidth(character: string): number {
  if (SPACE.test(character)) return EM.space;
  if (CJK_CHARACTER.test(character)) return EM.cjk;
  if (LETTER.test(character)) return EM.letter;
  return EM.other;
}

/**
 * The estimated width of a run of characters.
 *
 * @param text - The run.
 * @returns Its width, em.
 */
function textWidth(text: string): number {
  let width = 0;
  for (const character of text) width += characterWidth(character);
  return width;
}

/**
 * The lines one paragraph takes, filled greedily as a browser fills them.
 *
 * @param paragraph - Text without a written line break.
 * @param size - Font size, px.
 * @param width - Column width, px.
 * @returns The line count; infinite when a word is wider than the column.
 */
function paragraphLines(paragraph: string, size: number, width: number): number {
  let lines = 1;
  let lineWidth = 0;
  for (const [, spaces = "", word = ""] of paragraph.matchAll(PIECE)) {
    const wordWidth = textWidth(word) * size;
    if (wordWidth > width) return Number.POSITIVE_INFINITY;

    const gap = spaces.length * EM.space * size;
    if (lineWidth > 0 && lineWidth + gap + wordWidth > width) {
      lines += 1;
      lineWidth = wordWidth;
    } else {
      lineWidth += (lineWidth > 0 ? gap : 0) + wordWidth;
    }
  }
  return lines;
}

/**
 * The estimated lines of a headline: every written line break starts a new line.
 *
 * @param text - The headline.
 * @param size - Font size, px.
 * @param width - Column width, px.
 * @returns The line count; infinite when a word is wider than the column.
 * @example
 * ```ts
 * headlineLines("Surely worth playing.", 72, 500); // 2
 * headlineLines("きっと、\n遊ぶ価値がある。", 58, 500); // 2
 * ```
 */
export function headlineLines(text: string, size: number, width: number): number {
  let lines = 0;
  for (const paragraph of text.split("\n")) lines += paragraphLines(paragraph, size, width);
  return lines;
}

/**
 * The headline size that fits a column: the base size (a CJK card at most 58), stepped down by
 * 2 px until the headline takes at most `maxLines`, but never below 48 px (44 px CJK).
 *
 * @param text - The headline.
 * @param locale - The card locale.
 * @param base - The row's design size, px.
 * @param maxLines - Most lines the headline may take.
 * @param width - Column width, px.
 * @returns The size, px.
 * @example
 * ```ts
 * fitHeadline("Непременно стоит сыграть.", "ru", 74, 2, 500); // 62
 * ```
 */
export function fitHeadline(
  text: string,
  locale: Locale,
  base: number,
  maxLines: number,
  width: number
): number {
  const isCjk = CJK.has(locale);
  const floor = isCjk ? FLOOR.cjk : FLOOR.latin;
  let size = isCjk ? Math.min(CJK_BASE, base) : base;
  while (size > floor && headlineLines(text, size, width) > maxLines) size -= STEP;
  return Math.max(size, floor);
}

/**
 * The headline box of a card: its design size, its line limit and its column width.
 *
 * @param card - The card's row.
 * @returns The frame `fitHeadline` fits the headline into.
 * @example
 * ```ts
 * headlineFrame(OG_CARDS.game); // { base: 54, maxLines: 3, width: 540 }
 * ```
 */
export function headlineFrame(card: OgCardSpec): HeadlineFrame {
  const maxLines = card.layout === "postcard" ? card.headlineLines : undefined;
  return {
    base: card.headline,
    maxLines: maxLines ?? DEFAULT_LINES,
    width: headlineWidth(card)
  };
}
