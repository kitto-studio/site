/**
 * @file PaperSheet (design-context §6 G): a sheet of paper with sheen, grain and a real shadow, a
 * second sheet peeking out under it. Still by default; in the home stack (`stack`) it slides up,
 * lands and sinks as the next sheet covers it, driven by the `sheet-stack` island. With `art` the
 * face splits into copy and an art column sized for a pop-up sticker.
 */
import type { ComponentChildren, VNode } from "preact";

/** Position of a sheet in the home stack, top first. */
export type StackPosition = 0 | 1 | 2;

/** PaperSheet props. */
export type PaperSheetProps = {
  /** The sheet's copy. */
  children: ComponentChildren;
  /** Art beside the copy, usually a `PopupSticker`. */
  art?: ComponentChildren;
  /** Put the art on the left on wide screens. */
  flip?: boolean;
  /** Position in the home stack; omit for a still sheet. */
  stack?: StackPosition;
  /** Id of the sheet's heading. */
  labelledBy?: string;
};

/**
 * Render a paper sheet.
 *
 * @param props - PaperSheet props.
 * @param props.children - The copy.
 * @param props.art - Optional art column.
 * @param props.flip - Art on the left on wide screens.
 * @param props.stack - Position in the home stack.
 * @param props.labelledBy - Id of the heading that names the sheet.
 * @returns A `<section>` holding the sheet face.
 * @example
 * ```tsx
 * <PaperSheet stack={1} flip labelledBy="home-about" art={<PopupSticker sticker="tea-mug" trigger="sheet" />}>
 *   <h2 id="home-about">{strings.home.about.title}</h2>
 * </PaperSheet>
 * ```
 */
export function PaperSheet({
  children,
  art,
  flip = false,
  stack,
  labelledBy
}: PaperSheetProps): VNode {
  const hasArt = art !== undefined;
  return (
    <section data-component="paper-sheet" data-stack={stack} aria-labelledby={labelledBy}>
      <div data-sheet-face data-split={hasArt ? "" : undefined} data-flip={flip ? "" : undefined}>
        <div data-sheet-copy>{children}</div>
        {hasArt ? <div data-sheet-art>{art}</div> : undefined}
      </div>
    </section>
  );
}
