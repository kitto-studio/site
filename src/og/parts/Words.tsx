/**
 * @file The written words of a card: the headline in Nunito Black and the message in Golos Text,
 * each with the locale's CJK face behind it. CJK cards set both in taller lines; the headline
 * gets open tracking instead of the Latin tight tracking.
 */
import type { VNode } from "preact";
import { COLOR } from "../tokens";

/** Headline line height and tracking (em), Latin and CJK. */
const HEADLINE = {
  latin: { lineHeight: 1.03, tracking: -0.012 },
  cjk: { lineHeight: 1.18, tracking: 0.02 }
} as const;

/** Message line height, Latin and CJK, and the CJK size, px. */
const MESSAGE = {
  lineHeight: { latin: 1.38, cjk: 1.6 },
  cjkSize: 29,
  gap: 20,
  maxLines: 5
} as const;

/** Headline props. */
type HeadlineProps = {
  /** The headline; a written line break is kept. */
  text: string;
  /** Font size that fits the column, px. */
  size: number;
  /** `font-family` list. */
  family: string;
  /** Whether the card is set in a CJK locale. */
  isCjk: boolean;
  /** Space above the first line, px. */
  paddingTop: number;
};

/**
 * Render the headline.
 *
 * @param props - Headline props.
 * @param props.text - The headline.
 * @param props.size - Font size.
 * @param props.family - Font list.
 * @param props.isCjk - Whether the card is set in a CJK locale.
 * @param props.paddingTop - Space above the first line.
 * @returns The headline block.
 * @example
 * ```tsx
 * <Headline text="Surely worth playing." size={74} family={families.heading} isCjk={false} paddingTop={10} />
 * ```
 */
export function Headline({ text, size, family, isCjk, paddingTop }: HeadlineProps): VNode {
  const style = isCjk ? HEADLINE.cjk : HEADLINE.latin;
  return (
    <div
      style={{
        display: "flex",
        flexShrink: 0,
        paddingTop,
        fontFamily: family,
        fontWeight: 900,
        fontSize: size,
        lineHeight: style.lineHeight,
        letterSpacing: style.tracking * size,
        color: COLOR.ink,
        whiteSpace: "pre-wrap"
      }}
    >
      {text}
    </div>
  );
}

/** Message props. */
type MessageProps = {
  /** The message. */
  text: string;
  /** Latin and Cyrillic font size, px; CJK cards use 29. */
  size: number;
  /** Text colour. */
  color: string;
  /** `font-family` list. */
  family: string;
  /** Whether the card is set in a CJK locale. */
  isCjk: boolean;
  /** Most lines; five when absent, a safety net no real postcard text reaches. */
  maxLines?: number;
};

/**
 * Render the message under the headline, cut with an ellipsis after its last allowed line.
 *
 * @param props - Message props.
 * @param props.text - The message.
 * @param props.size - Latin and Cyrillic font size.
 * @param props.color - Text colour.
 * @param props.family - Font list.
 * @param props.isCjk - Whether the card is set in a CJK locale.
 * @param props.maxLines - Most lines.
 * @returns The message block.
 * @example
 * ```tsx
 * <Message text={text.message} size={31} color={COLOR.text} family={families.message} isCjk={false} />
 * ```
 */
export function Message({
  text,
  size,
  color,
  family,
  isCjk,
  maxLines = MESSAGE.maxLines
}: MessageProps): VNode {
  return (
    <div
      style={{
        display: "block",
        flexShrink: 0,
        marginTop: MESSAGE.gap,
        fontFamily: family,
        fontWeight: 400,
        fontSize: isCjk ? MESSAGE.cjkSize : size,
        lineHeight: isCjk ? MESSAGE.lineHeight.cjk : MESSAGE.lineHeight.latin,
        color,
        lineClamp: maxLines
      }}
    >
      {text}
    </div>
  );
}
