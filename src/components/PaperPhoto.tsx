/**
 * @file PaperPhoto (design-context §6 F2, G): a printed photo with a paper border, held to the
 * sheet by a strip of tape, slightly tilted, with an optional stamp such as «Coming soon». Inside a
 * link it straightens and lifts while the link is hovered.
 */
import type { VNode } from "preact";

/** PaperPhoto props. */
export type PaperPhotoProps = {
  /** Image URL under `public/`. */
  src: string;
  /** Intrinsic image width, px (reserves the space before the image loads). */
  width: number;
  /** Intrinsic image height, px. */
  height: number;
  /** Alt text; empty when a surrounding link already names the picture. */
  alt?: string;
  /** Text of the stamp over the photo's corner. */
  stamp?: string;
  /** Id of the stamp, for an `aria-describedby` on the surrounding link. */
  stampId?: string;
};

/**
 * Render a taped paper print.
 *
 * @param props - PaperPhoto props.
 * @param props.src - Image URL.
 * @param props.width - Intrinsic width.
 * @param props.height - Intrinsic height.
 * @param props.alt - Alt text, empty by default.
 * @param props.stamp - Optional stamp text.
 * @param props.stampId - Optional stamp id.
 * @returns The print as phrasing content, safe inside a link.
 * @example
 * ```tsx
 * <PaperPhoto src="/media/game/ward.webp" width={1448} height={1086} stamp={strings.home.games.comingSoon} />
 * ```
 */
export function PaperPhoto({
  src,
  width,
  height,
  alt = "",
  stamp,
  stampId
}: PaperPhotoProps): VNode {
  return (
    <span data-component="paper-photo">
      <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
      <span data-photo-tape aria-hidden="true" />
      {stamp === undefined ? undefined : (
        <span data-photo-stamp id={stampId}>
          {stamp}
        </span>
      )}
    </span>
  );
}
