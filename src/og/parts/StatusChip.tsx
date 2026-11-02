/**
 * @file The status chip of the game card: a paper pill with the orange dot and the store status.
 */
import type { VNode } from "preact";
import { COLOR } from "../tokens";

/**
 * The orange dot and its soft ring, px. The design draws the ring as a `0 0 0 5px` shadow; satori
 * draws a spread shadow square, so the ring is a round disc behind the dot, its negative margin
 * keeping the dot's 16 px place in the chip.
 */
const DOT = { size: 16, ring: 5, ringColor: "rgba(217, 101, 58, 0.18)" } as const;

/** Status chip props. */
type StatusChipProps = {
  /** The status line. */
  text: string;
  /** `font-family` list of the line. */
  family: string;
};

/**
 * Render the status chip, on one line above the headline.
 *
 * @param props - Status chip props.
 * @param props.text - The status line.
 * @param props.family - Font list.
 * @returns The chip.
 * @example
 * ```tsx
 * <StatusChip text={strings.game.tags.status} family={families.strong} />
 * ```
 */
export function StatusChip({ text, family }: StatusChipProps): VNode {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        alignSelf: "flex-start",
        flexShrink: 0,
        gap: 12,
        margin: "-6px 0 14px",
        padding: "10px 20px 10px 16px",
        borderRadius: 999,
        border: `1.5px solid ${COLOR.line}`,
        backgroundColor: COLOR.paper,
        fontFamily: family,
        fontWeight: 600,
        fontSize: 27,
        color: COLOR.ink,
        whiteSpace: "nowrap"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: DOT.size + 2 * DOT.ring,
          height: DOT.size + 2 * DOT.ring,
          margin: -DOT.ring,
          borderRadius: DOT.size / 2 + DOT.ring,
          backgroundColor: DOT.ringColor
        }}
      >
        <div
          style={{
            width: DOT.size,
            height: DOT.size,
            borderRadius: DOT.size / 2,
            backgroundColor: COLOR.dot
          }}
        />
      </div>
      <div style={{ display: "flex" }}>{text}</div>
    </div>
  );
}
