/**
 * @file The paper desk every card lies on: the grained paper background, a darker sheet turned
 * under the card, and the cream sheet the card is written on.
 */
import type { ComponentChildren, VNode } from "preact";
import { COLOR, OG_CARD_SIZE } from "../tokens";

/** Paper grain (tokens.css `--grain`, light), as a tile resvg draws. */
const GRAIN = `data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .33 0 0 0 0 .24 0 0 0 0 .18 0 0 0 .075 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>"
)}`;

/** The sheet under the card: placed, turned 1.4° and shaded as the design sets it. */
const UNDER_SHEET = {
  left: 34,
  top: 30,
  width: 1132,
  height: 570,
  shadow: "0 10px 24px -14px rgba(85, 60, 47, 0.35)"
} as const;

/** The card's sheet: placed and lifted as the design sets it. */
const SHEET = {
  left: 28,
  top: 24,
  width: 1144,
  height: 582,
  shadow:
    "0 1px 0 #e3dacc, 0 4px 10px rgba(85, 60, 47, 0.06), 0 26px 48px -22px rgba(85, 60, 47, 0.42)"
} as const;

/** Corner radius of both sheets, px. */
const SHEET_RADIUS = 24;

/** Desk props. */
type DeskProps = {
  /** What lies on the sheet, positioned in card px. */
  children: ComponentChildren;
};

/**
 * Render the card's root: the paper desk with both sheets, and the card's contents on top.
 *
 * @param props - Desk props.
 * @param props.children - What lies on the sheet.
 * @returns The 1200 × 630 root of the card.
 * @example
 * ```tsx
 * <Desk><Stamp x={1010} y={58} ground="#efcdb6" image={phone} /></Desk>
 * ```
 */
export function Desk({ children }: DeskProps): VNode {
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: OG_CARD_SIZE.width,
        height: OG_CARD_SIZE.height,
        overflow: "hidden",
        backgroundColor: COLOR.paper,
        backgroundImage: `url("${GRAIN}")`,
        backgroundSize: "240px 240px"
      }}
    >
      <div
        style={{
          position: "absolute",
          left: UNDER_SHEET.left,
          top: UNDER_SHEET.top,
          width: UNDER_SHEET.width,
          height: UNDER_SHEET.height,
          borderRadius: SHEET_RADIUS,
          backgroundColor: COLOR.underSheet,
          boxShadow: UNDER_SHEET.shadow,
          transform: "rotate(1.4deg)"
        }}
      />
      <div
        style={{
          position: "absolute",
          left: SHEET.left,
          top: SHEET.top,
          width: SHEET.width,
          height: SHEET.height,
          borderRadius: SHEET_RADIUS,
          backgroundColor: COLOR.surface,
          boxShadow: SHEET.shadow
        }}
      />
      {children}
    </div>
  );
}
