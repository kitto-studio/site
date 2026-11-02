/**
 * @file The postcard layout: the photo print on one side, the writing on the other, the stamp in
 * the top corner away from the print, and the postmark on the seam over the print's lower corner.
 * Headline, message, address and postmark stay inside the centre band x 285 to 915, so a square
 * crop of the card keeps them.
 */
import type { VNode } from "preact";
import { Address } from "./parts/Address";
import { Desk } from "./parts/Desk";
import { Postmark } from "./parts/Postmark";
import { Print, Sticker } from "./parts/Print";
import { Stamp } from "./parts/Stamp";
import { StatusChip } from "./parts/StatusChip";
import { Headline, Message } from "./parts/Words";
import { COLOR } from "./tokens";
import type { OgCardProps, OgPostcardSpec } from "./types";

/**
 * Where everything goes on a postcard with its print on the left or on the right, in card px. The
 * writing column is placed by its left edge and width; its address is indented on a left card.
 *
 * @example
 * ```ts
 * POSTCARD_SIDES.right.writing.width; // 540
 * ```
 */
export const POSTCARD_SIDES = {
  left: {
    print: { x: 50, y: 88 },
    writing: { x: 400, width: 500, indent: 90 },
    stamp: { x: 1010, y: 58 },
    postmark: { x: 302, y: 412 }
  },
  right: {
    print: { x: 836, y: 84 },
    writing: { x: 300, width: 540, indent: 0 },
    stamp: { x: 60, y: 58 },
    postmark: { x: 740, y: 424 }
  }
} as const;

/** The writing column's top and bottom edges on the card, px. */
const WRITING_EDGES = { top: 64, bottom: 572 } as const;

/** Postcard props: the card props with a postcard row. */
type PostcardProps = OgCardProps & {
  /** The card's row. */
  card: OgPostcardSpec;
};

/**
 * Render a postcard.
 *
 * @param props - Postcard props.
 * @param props.card - The card's row.
 * @param props.text - The words on the card.
 * @param props.site - The site address.
 * @param props.art - The art images.
 * @param props.families - Font lists of the text styles.
 * @param props.headlineSize - Headline size.
 * @param props.headlineLines - Lines the headline takes.
 * @param props.isCjk - Whether the card is set in a CJK locale.
 * @returns The card tree for satori.
 * @example
 * ```tsx
 * <Postcard card={OG_CARDS.home} text={text} site="kitto.studio" art={art} families={families} headlineSize={74} headlineLines={2} isCjk={false} />
 * ```
 */
export function Postcard({
  card,
  text,
  site,
  art,
  families,
  headlineSize,
  headlineLines,
  isCjk
}: PostcardProps): VNode {
  const side = POSTCARD_SIDES[card.side];
  const writing = side.writing;

  return (
    <Desk>
      {art.print !== undefined && (
        <Print
          x={side.print.x}
          y={side.print.y}
          side={card.side}
          print={card.print}
          art={card.art}
          image={art.print}
        />
      )}
      {card.sticker !== undefined && art.sticker !== undefined && (
        <Sticker sticker={card.sticker} image={art.sticker} />
      )}
      <Stamp x={side.stamp.x} y={side.stamp.y} ground={card.stamp.ground} image={art.stamp} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          left: writing.x,
          top: WRITING_EDGES.top,
          width: writing.width,
          height: WRITING_EDGES.bottom - WRITING_EDGES.top
        }}
      >
        {text.status !== undefined && <StatusChip text={text.status} family={families.strong} />}
        <Headline
          text={text.headline}
          size={headlineSize}
          family={families.heading}
          isCjk={isCjk}
          paddingTop={10}
        />
        {/* The prototype's gap is under a one-line headline; a longer one leaves no room for it. */}
        {card.messageGap !== undefined && headlineLines === 1 && (
          <div style={{ flexGrow: 1, maxHeight: card.messageGap }} />
        )}
        <Message
          text={text.message}
          size={31}
          color={COLOR.text}
          family={families.message}
          isCjk={isCjk}
        />
        <div style={{ flexGrow: 1 }} />
        <div style={{ display: "flex", flexShrink: 0, paddingLeft: writing.indent }}>
          <Address site={site} email={text.email} strong={families.strong} quiet={families.quiet} />
        </div>
      </div>
      <Postmark x={side.postmark.x} y={side.postmark.y} />
    </Desk>
  );
}
