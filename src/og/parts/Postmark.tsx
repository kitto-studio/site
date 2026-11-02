/**
 * @file The round postmark on the seam between print and writing. It carries the card's only
 * logo: the `kitto` wordmark, the exact vector of `Logo`, between two thin bars.
 */
import type { VNode } from "preact";
import { renderToString } from "preact-render-to-string";
import { Logo } from "../../components/Logo";
import { COLOR } from "../tokens";

/** The outer circle and the inner ring, px. */
const POSTMARK = { size: 162, ring: 138, gap: 6 } as const;

/** The bars above and below the wordmark, px. */
const BAR = { width: 96, height: 1.5, color: "rgba(85, 60, 47, 0.35)" } as const;

/** Wordmark size in the postmark, px; the height follows the vector's 850 × 340 box. */
const WORDMARK = { width: 108, height: 43 } as const;

/**
 * The wordmark as an SVG image: the `Logo` vector with its fills set, since satori draws no CSS.
 *
 * @returns A `data:` URL of the coloured wordmark.
 * @example
 * ```tsx
 * <img src={wordmarkImage()} alt="" width={108} height={43} />
 * ```
 */
export function wordmarkImage(): string {
  const svg = renderToString(<Logo />)
    .replaceAll('data-fill="ink"', `fill="${COLOR.ink}"`)
    .replaceAll('data-fill="dot"', `fill="${COLOR.dot}"`);
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/**
 * Render a thin bar of the postmark.
 *
 * @returns The bar.
 */
function Bar(): VNode {
  return <div style={{ width: BAR.width, height: BAR.height, backgroundColor: BAR.color }} />;
}

/** Postmark props. */
type PostmarkProps = {
  /** Left edge on the card, px. */
  x: number;
  /** Top edge on the card, px. */
  y: number;
};

/**
 * Render the postmark, turned −9°.
 *
 * @param props - Postmark props.
 * @param props.x - Left edge on the card.
 * @param props.y - Top edge on the card.
 * @returns The postmark with the wordmark.
 * @example
 * ```tsx
 * <Postmark x={302} y={412} />
 * ```
 */
export function Postmark({ x, y }: PostmarkProps): VNode {
  return (
    <div
      style={{
        display: "flex",
        position: "absolute",
        left: x,
        top: y,
        alignItems: "center",
        justifyContent: "center",
        width: POSTMARK.size,
        height: POSTMARK.size,
        borderRadius: POSTMARK.size / 2,
        border: "3px solid rgba(85, 60, 47, 0.62)",
        backgroundColor: "rgba(255, 253, 248, 0.72)",
        transform: "rotate(-9deg)"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: POSTMARK.gap,
          width: POSTMARK.ring,
          height: POSTMARK.ring,
          borderRadius: POSTMARK.ring / 2,
          border: "1.5px solid rgba(85, 60, 47, 0.45)"
        }}
      >
        <Bar />
        <img src={wordmarkImage()} alt="" width={WORDMARK.width} height={WORDMARK.height} />
        <Bar />
      </div>
    </div>
  );
}
