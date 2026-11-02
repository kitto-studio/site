/**
 * @file The photo print of a postcard: a white print with a soft drop, a strip of tape across its
 * top edge, and the page's art in the 300 × 390 photo window. Also the cut-out sticker, drawn in a
 * print's window (support) or on the card over the print's corner (games).
 */
import type { VNode } from "preact";
import { COLOR, PHOTO_SIZE } from "../tokens";
import type { OgArt, OgPrint, OgSide, OgSticker } from "../types";

/** White border around the photo, px. */
const PRINT_PADDING = 16;

/** The print's drop on the sheet. */
const PRINT_SHADOW = "0 1px 1px rgba(85, 60, 47, 0.14), 0 16px 30px -10px rgba(85, 60, 47, 0.34)";

/** The tape strip, centred on the print's top edge and turned against the print's own tilt. */
const TAPE = {
  width: 150,
  height: 42,
  top: -20,
  /** Turn on a left print and on a right print, degrees. */
  rotate: { left: 4, right: -5 },
  background:
    "linear-gradient(90deg, rgba(236, 223, 197, 0.88), rgba(244, 234, 214, 0.82) 50%, rgba(232, 217, 190, 0.88))",
  shadow: "0 1px 2px rgba(85, 60, 47, 0.12)"
} as const;

/** Sticker props. */
type StickerProps = {
  /** Size, place and turn of the sticker inside its box. */
  sticker: OgSticker;
  /** The sticker as a PNG `data:` URL at its size. */
  image: string;
};

/**
 * Render a cut-out sticker at its place inside the positioned box that holds it.
 *
 * @param props - Sticker props.
 * @param props.sticker - Size, place and turn.
 * @param props.image - The sticker image.
 * @returns The turned sticker.
 * @example
 * ```tsx
 * <Sticker sticker={{ image: "stickers/puzzle-piece", size: 130, x: 20, y: 440, rotate: -14 }} image={piece} />
 * ```
 */
export function Sticker({ sticker, image }: StickerProps): VNode {
  return (
    <img
      src={image}
      alt=""
      width={sticker.size}
      height={sticker.size}
      style={{
        position: "absolute",
        left: sticker.x,
        top: sticker.y,
        transform: `rotate(${sticker.rotate}deg)`
      }}
    />
  );
}

/** Print props. */
type PrintProps = {
  /** Top-left corner of the print on the card, px. */
  x: number;
  /** Top edge of the print on the card, px. */
  y: number;
  /** The side of the card the print is on; turns the tape. */
  side: OgSide;
  /** Tilt and ground of the print. */
  print: OgPrint;
  /** The art the window shows. */
  art: OgArt;
  /** The art as a PNG `data:` URL: the cut window, or the sticker at its size. */
  image: string;
};

/**
 * Render a photo print with its tape. A cut window fills the photo; a sticker lies on the print's
 * ground at its own place and turn.
 *
 * @param props - Print props.
 * @param props.x - Left edge on the card.
 * @param props.y - Top edge on the card.
 * @param props.side - The card side, for the tape's turn.
 * @param props.print - Tilt and ground.
 * @param props.art - The art the window shows.
 * @param props.image - The art image.
 * @returns The turned print.
 * @example
 * ```tsx
 * <Print x={50} y={88} side="left" print={OG_CARDS.home.print} art={OG_CARDS.home.art} image={studio} />
 * ```
 */
export function Print({ x, y, side, print, art, image }: PrintProps): VNode {
  const photo =
    art.kind === "sticker" ? (
      <Sticker sticker={art} image={image} />
    ) : (
      <img src={image} alt="" width={PHOTO_SIZE.width} height={PHOTO_SIZE.height} />
    );

  return (
    <div
      style={{
        display: "flex",
        position: "absolute",
        left: x,
        top: y,
        padding: PRINT_PADDING,
        borderRadius: 4,
        backgroundColor: COLOR.print,
        boxShadow: PRINT_SHADOW,
        transform: `rotate(${print.rotate}deg)`
      }}
    >
      <div
        style={{
          display: "flex",
          position: "relative",
          width: PHOTO_SIZE.width,
          height: PHOTO_SIZE.height,
          overflow: "hidden",
          borderRadius: 2,
          background: print.ground
        }}
      >
        {photo}
      </div>
      <div
        style={{
          position: "absolute",
          left: PRINT_PADDING + PHOTO_SIZE.width / 2 - TAPE.width / 2,
          top: TAPE.top,
          width: TAPE.width,
          height: TAPE.height,
          borderRadius: 2,
          backgroundImage: TAPE.background,
          boxShadow: TAPE.shadow,
          transform: `rotate(${TAPE.rotate[side]}deg)`
        }}
      />
    </div>
  );
}
