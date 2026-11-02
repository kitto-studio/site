/**
 * @file PopupSticker (design-context §6 F9): a die-cut paper object on a glued paper tab. It folds
 * up from the sheet with a spring when it comes into view and replays on click (the
 * `popup-sticker` island). It stands by default: without the island, with reduced motion, in print.
 *
 * Reusable on any page: it fills the width of its box and is square, so the parent sizes it. The
 * hinge sits at each sticker's own art bottom and every sticker shares one floor, so stickers side
 * by side stand on the same line (geometry in `PopupSticker.css`).
 */
import type { VNode } from "preact";

/** The die-cut stickers with measured hinge geometry, named like their art in `media/stickers/`. */
export type StickerName = "gift-box" | "tea-mug" | "envelope";

/**
 * What makes the sticker spring up: `view` when it scrolls into view (inner pages), `sheet` when
 * its sheet lands in the home stack (the `sheet-stack` island decides).
 */
export type StickerTrigger = "view" | "sheet";

/** Intrinsic size of every sticker image, px. */
const ART_SIZE = 1024;

/** PopupSticker props. */
export type PopupStickerProps = {
  /** Which sticker. */
  sticker: StickerName;
  /** What makes it spring up, `view` by default. */
  trigger?: StickerTrigger;
};

/**
 * Render a pop-up sticker. Decorative: hidden from assistive technology.
 *
 * @param props - PopupSticker props.
 * @param props.sticker - Which sticker.
 * @param props.trigger - `view` (default) or `sheet` in the home stack.
 * @returns The square sticker rig: cast shadow, glued tab, and the standing cut-out with its tongue.
 * @example
 * ```tsx
 * <div data-games-sticker>
 *   <PopupSticker sticker="gift-box" />
 * </div>
 * ```
 */
export function PopupSticker({ sticker, trigger = "view" }: PopupStickerProps): VNode {
  const src = `/media/stickers/${sticker}.webp`;
  return (
    <div
      data-component="popup-sticker"
      data-island="popup-sticker"
      data-sticker={sticker}
      data-trigger={trigger}
      aria-hidden="true"
    >
      <div data-sticker-rig>
        <img
          data-sticker-cast
          src={src}
          alt=""
          width={ART_SIZE}
          height={ART_SIZE}
          loading="lazy"
          decoding="async"
        />
        <span data-sticker-tab />
        <div data-sticker-stand>
          <div data-sticker-cutout>
            <span data-sticker-tongue />
            <img
              data-sticker-piece
              src={src}
              alt=""
              width={ART_SIZE}
              height={ART_SIZE}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
