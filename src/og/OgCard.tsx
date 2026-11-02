/**
 * @file The OG card, 1200 × 630, drawn by satori at build time (never shipped to the browser).
 *
 * A paper sheet on the paper background, the `kitto` wordmark (the exact vector of `Logo`), the
 * headline (slogan or game title) in Nunito with the locale's CJK face behind it, a lead line in
 * Golos Text, and the site address. Satori reads inline styles only, so the brand colours are
 * written here as values (brand-system §3, light theme) instead of CSS tokens.
 */
import type { VNode } from "preact";
import { renderToString } from "preact-render-to-string";
import { Logo } from "../components/Logo";

/** Card size, px. */
export const OG_CARD_SIZE = { width: 1200, height: 630 } as const;

/** Brand colours, light theme (brand-system §3). */
const COLOR = {
  paper: "#f6f2ea",
  surface: "#fffdf8",
  ink: "#553c2f",
  text: "#3b2c24",
  /** `quiet`: muted 70% over text, small text that passes AA. */
  quiet: "#72655b",
  line: "#e3dacc",
  dot: "#d9653a"
} as const;

/** The sheet's `lift-shadow` (tokens.css), on the light paper. */
const LIFT_SHADOW =
  "0 1px 1px rgba(85, 60, 47, 0.08), 0 8px 18px -6px rgba(85, 60, 47, 0.22), 0 24px 48px -18px rgba(85, 60, 47, 0.3)";

/** Paper grain (tokens.css `--grain`, light), as a tile resvg draws. */
const GRAIN = `data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .33 0 0 0 0 .24 0 0 0 0 .18 0 0 0 .075 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>"
)}`;

/** Wordmark width on the card, px; the height follows the vector's 850 × 340 box. */
const WORDMARK_WIDTH = 220;

/**
 * The wordmark as an SVG image: the `Logo` vector with its fills set, since satori draws no CSS.
 *
 * @returns A `data:` URL of the coloured wordmark.
 */
function wordmarkImage(): string {
  const svg = renderToString(<Logo />)
    .replaceAll('data-fill="ink"', `fill="${COLOR.ink}"`)
    .replaceAll('data-fill="dot"', `fill="${COLOR.dot}"`);
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/** OG card props. */
type OgCardProps = {
  /** The big line: the slogan or the game title. */
  headline: string;
  /** The line under it. */
  lead: string;
  /** A status line with the dot (the game card). */
  status?: string | undefined;
  /** The site address in the corner. */
  site: string;
  /** `font-family` list of the headline. */
  headingFamily: string;
  /** `font-family` list of the other text. */
  textFamily: string;
  /** CJK headline: no negative tracking and a taller line, as on the site. */
  isCjk: boolean;
};

/**
 * Render the OG card.
 *
 * @param props - OG card props.
 * @param props.headline - The big line.
 * @param props.lead - The line under it.
 * @param props.status - Optional status line with the dot.
 * @param props.site - The site address.
 * @param props.headingFamily - Headline font list.
 * @param props.textFamily - Font list of the other text.
 * @param props.isCjk - Whether the headline is set in a CJK face.
 * @returns The card tree for satori.
 * @example
 * ```tsx
 * <OgCard headline="Surely worth playing." lead="We are Kitto Studio…" site="kitto.studio"
 *   headingFamily="Nunito 900 latin" textFamily="Golos Text 500 latin" isCjk={false} />
 * ```
 */
export function OgCard({
  headline,
  lead,
  status,
  site,
  headingFamily,
  textFamily,
  isCjk
}: OgCardProps): VNode {
  return (
    <div
      style={{
        display: "flex",
        width: OG_CARD_SIZE.width,
        height: OG_CARD_SIZE.height,
        padding: 40,
        backgroundColor: COLOR.paper,
        backgroundImage: `url("${GRAIN}")`,
        backgroundSize: "240px 240px"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          padding: "56px 72px 52px",
          borderRadius: 24,
          border: `1px solid ${COLOR.line}`,
          backgroundColor: COLOR.surface,
          boxShadow: LIFT_SHADOW
        }}
      >
        <img
          src={wordmarkImage()}
          alt=""
          width={WORDMARK_WIDTH}
          height={(WORDMARK_WIDTH * 340) / 850}
        />
        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
          <div
            style={{
              fontFamily: headingFamily,
              fontWeight: 900,
              fontSize: 76,
              lineHeight: isCjk ? 1.2 : 1.04,
              letterSpacing: isCjk ? 0 : -1.9,
              color: COLOR.ink,
              maxWidth: 1000
            }}
          >
            {headline}
          </div>
          <div
            style={{
              marginTop: 22,
              fontFamily: textFamily,
              fontWeight: 500,
              fontSize: 30,
              lineHeight: 1.45,
              color: COLOR.text,
              maxWidth: 900,
              lineClamp: 2
            }}
          >
            {lead}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 34,
              fontFamily: textFamily,
              fontWeight: 500,
              fontSize: 24
            }}
          >
            <div style={{ display: "flex", alignItems: "center", color: COLOR.text }}>
              {status && (
                <div
                  style={{
                    width: 14,
                    height: 14,
                    marginRight: 14,
                    borderRadius: 7,
                    backgroundColor: COLOR.dot
                  }}
                />
              )}
              {status}
            </div>
            <div style={{ color: COLOR.quiet }}>{site}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
