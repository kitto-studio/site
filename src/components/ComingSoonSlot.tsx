/**
 * @file ComingSoonSlot (design-context §6 F1): a window cut into the paper for a game that has no
 * name or art yet. Two lines of text, no picture.
 */
import type { VNode } from "preact";

/** ComingSoonSlot props. */
export type ComingSoonSlotProps = {
  /** The slot's name, such as «New game». */
  name: string;
  /** The status under it, such as «Coming soon». */
  status: string;
};

/**
 * Render an empty game slot recessed into the sheet.
 *
 * @param props - ComingSoonSlot props.
 * @param props.name - The slot's name.
 * @param props.status - The status line.
 * @returns The recessed slot with its two lines.
 * @example
 * ```tsx
 * <ComingSoonSlot name={strings.home.games.slot} status={strings.home.games.comingSoon} />
 * ```
 */
export function ComingSoonSlot({ name, status }: ComingSoonSlotProps): VNode {
  return (
    <div data-component="coming-soon-slot">
      <strong data-slot-name>{name}</strong>
      <span data-slot-status>{status}</span>
    </div>
  );
}
