/**
 * @file The stamp in the card's top corner: a perforated stamp on its soft ground, the page's
 * sticker on a lighter face, and three wavy cancel lines across its lower half.
 */
import type { VNode } from "preact";
import { COLOR, STAMP_ART_SIZE } from "../tokens";

/** The stamp's size, padding and face, px. */
const STAMP = { width: 124, height: 148, padding: 9, face: { width: 106, height: 130 } } as const;

/**
 * The perforated edge: surface-coloured dots on a 12 px grid from the stamp's top-left corner, so
 * they bite into its edges; the face covers the ones inside. The design's dot is solid to 4.2 px
 * and fades out by 4.8 px; satori draws no repeated radial gradient, so each dot is a 4.5 px circle.
 */
const PERFORATION = { grid: 12, radius: 4.5 } as const;

/** The soft white light on the face. */
const FACE_HIGHLIGHT =
  "radial-gradient(circle at 50% 40%, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0) 70%)";

/** The cancel lines: their box on the stamp, px, and the wave in the units of its own 170 × 56 box. */
const WAVES = {
  left: -20,
  top: 88,
  width: 140,
  height: 46,
  box: { width: 170, height: 56 },
  lines: [10, 28, 46],
  /** Half a wave: its length and how far its control point lifts the line. */
  half: { length: 28, lift: 8 },
  halves: 6,
  stroke: 2.4
} as const;

/**
 * The perforation as an SVG image the size of the stamp.
 *
 * @returns A `data:` URL of the dots in the surface colour.
 */
function perforation(): string {
  const { grid, radius } = PERFORATION;
  const dots: string[] = [];
  for (let y = 0; y <= STAMP.height; y += grid) {
    for (let x = 0; x <= STAMP.width; x += grid)
      dots.push(`<circle cx="${x}" cy="${y}" r="${radius}"/>`);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${STAMP.width}" height="${STAMP.height}" fill="${COLOR.surface}">${dots.join("")}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/**
 * The three cancel lines as an SVG image: each line one half wave up, then mirrored half waves.
 *
 * @returns A `data:` URL of the lines in the ink colour.
 */
function cancelLines(): string {
  const { half, halves, stroke, box } = WAVES;
  const wave = `q${half.length / 2} ${-half.lift} ${half.length} 0${` t${half.length} 0`.repeat(halves - 1)}`;
  const paths = WAVES.lines.map(y => `<path d="M2 ${y} ${wave}"/>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${box.width} ${box.height}" fill="none" stroke="${COLOR.ink}" stroke-width="${stroke}" stroke-linecap="round">${paths}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/** Stamp props. */
type StampProps = {
  /** Left edge on the card, px. */
  x: number;
  /** Top edge on the card, px. */
  y: number;
  /** The stamp's ground colour. */
  ground: string;
  /** The sticker as a PNG `data:` URL, 96 × 96. */
  image: string;
};

/**
 * Render the stamp, turned 2°.
 *
 * @param props - Stamp props.
 * @param props.x - Left edge on the card.
 * @param props.y - Top edge on the card.
 * @param props.ground - Ground colour.
 * @param props.image - The sticker image.
 * @returns The stamp with its cancel lines.
 * @example
 * ```tsx
 * <Stamp x={1010} y={58} ground={OG_CARDS.home.stamp.ground} image={phone} />
 * ```
 */
export function Stamp({ x, y, ground, image }: StampProps): VNode {
  return (
    <div
      style={{
        display: "flex",
        position: "absolute",
        left: x,
        top: y,
        width: STAMP.width,
        height: STAMP.height,
        padding: STAMP.padding,
        backgroundColor: ground,
        transform: "rotate(2deg)"
      }}
    >
      <img
        src={perforation()}
        alt=""
        width={STAMP.width}
        height={STAMP.height}
        style={{ position: "absolute", left: 0, top: 0 }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: STAMP.face.width,
          height: STAMP.face.height,
          overflow: "hidden",
          border: "3px solid rgba(255, 255, 255, 0.85)",
          borderRadius: 2,
          backgroundColor: ground,
          backgroundImage: FACE_HIGHLIGHT
        }}
      >
        <img
          src={image}
          alt=""
          width={STAMP_ART_SIZE}
          height={STAMP_ART_SIZE}
          style={{ objectFit: "contain" }}
        />
      </div>
      <img
        src={cancelLines()}
        alt=""
        width={WAVES.width}
        height={WAVES.height}
        style={{ position: "absolute", left: WAVES.left, top: WAVES.top, opacity: 0.5 }}
      />
    </div>
  );
}
