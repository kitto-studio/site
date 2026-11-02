/**
 * @file The geometry of the merge board's motion (design-context §6 F7, F8): the throw of one paper
 * bit of confetti and the arc of a finished clue flying into its slot. Pure numbers; the
 * `merge-board` island turns them into keyframes.
 */
import type { Random } from "./merge";

/** A point on the page or in the board's effect layer, px. */
export type Point = {
  /** Left, px. */
  readonly x: number;
  /** Top, px. */
  readonly y: number;
};

/** A box on the page, as `getBoundingClientRect` gives it, px. */
export type Box = {
  /** Left edge, px. */
  readonly left: number;
  /** Top edge, px. */
  readonly top: number;
  /** Width, px. */
  readonly width: number;
  /** Height, px. */
  readonly height: number;
};

/** One pose of a paper bit along its throw: how far it is from where it started, and its turn. */
export type BitPose = Point & {
  /** Turn, degrees. */
  readonly spin: number;
};

/** The throw of one paper bit of confetti. */
export type BitFlight = {
  /** Cut round instead of square. */
  readonly round: boolean;
  /** Width, px. */
  readonly width: number;
  /** Height, px. */
  readonly height: number;
  /** The top of the throw. */
  readonly apex: BitPose;
  /** Where it fades out, fallen back below the apex. */
  readonly landing: BitPose;
  /** Duration of the whole throw, ms. */
  readonly duration: number;
};

/** The arc of a finished clue flying from its cell into its slot of the case list. */
export type Arc = {
  /** Where the copy starts: the cell's top-left corner, px. */
  readonly start: Point;
  /** The top of the arc, px. */
  readonly middle: Point;
  /** Where the copy lands: its box centred on the slot, px. */
  readonly end: Point;
  /** Its scale at the top of the arc. */
  readonly middleScale: number;
  /** Its scale on landing: it fits the slot and never grows past its cell. */
  readonly scale: number;
};

/** Share of the paper bits cut round instead of square. */
const ROUND_BITS = 0.22;

/** Size of a bit: least width and random extra width (a merge, the win), px; height per width. */
const BIT = {
  minWidth: 4,
  extraWidth: { merge: 4, win: 6 },
  minAspect: 1.2,
  extraAspect: 0.9
};

/**
 * The throw of a bit: its aim in degrees (straight up is -90) and the spread around it; how far it
 * flies and falls as a share of the reach (least and random extra); the range of its turn in
 * degrees, the share of the turn done at the apex, and how much further it drifts while it falls.
 */
const THROW = {
  aim: -95,
  spread: 210,
  minDistance: 0.45,
  extraDistance: 0.75,
  minFall: 0.5,
  extraFall: 0.5,
  spin: 760,
  apexSpin: 0.55,
  drift: 1.18
};

/** Duration of a throw, ms: a merge, the win, and the random extra. */
const THROW_MS = { merge: 760, win: 1100, extra: 420 };

/**
 * The arc of a clue: how far its top rises above the higher end, px; how much of the slot the
 * landed copy fills; how much it swells at the top.
 */
const ARC = { rise: 70, fit: 0.95, swell: 1.08 };

/**
 * The throw of one paper bit: its cut, its apex and its landing, from the burst's centre.
 *
 * @param reach - How far the burst's bits fly, px.
 * @param wide - The win: larger, slower bits.
 * @param random - The random source (`Math.random` on the page).
 * @returns The bit's size and its path.
 * @example
 * ```ts
 * flightOf(100, false, () => 0.5).duration; // 970
 * ```
 */
export function flightOf(reach: number, wide: boolean, random: Random): BitFlight {
  // Cut the bit: round or square, larger for the win.
  const round = random() < ROUND_BITS;
  const width = BIT.minWidth + random() * (wide ? BIT.extraWidth.win : BIT.extraWidth.merge);
  const height = width * (BIT.minAspect + random() * BIT.extraAspect);

  // Aim it mostly upward, spread wide, and throw it part of the reach.
  const angle = ((THROW.aim + (random() - 0.5) * THROW.spread) * Math.PI) / 180;
  const distance = reach * (THROW.minDistance + random() * THROW.extraDistance);
  const dx = Math.cos(angle) * distance;
  const dy = Math.sin(angle) * distance;

  // Spin it, let it fall back past the apex, and give the win's bits more time.
  const spin = (random() - 0.5) * THROW.spin;
  const fall = reach * (THROW.minFall + random() * THROW.extraFall);
  const duration = (wide ? THROW_MS.win : THROW_MS.merge) + random() * THROW_MS.extra;

  return {
    round,
    width,
    height,
    apex: { x: dx, y: dy, spin: spin * THROW.apexSpin },
    landing: { x: dx * THROW.drift, y: dy + fall, spin },
    duration
  };
}

/**
 * The arc of a finished clue from its cell into its slot: up over both ends, down into the slot.
 *
 * @param from - The box of the clue in its cell.
 * @param to - The box of the slot.
 * @returns The start, top and end of the arc and the copy's scale along it.
 * @example
 * ```ts
 * arcPoints({ left: 0, top: 200, width: 100, height: 100 }, { left: 300, top: 0, width: 50, height: 50 }).end; // { x: 275, y: -25 }
 * ```
 */
export function arcPoints(from: Box, to: Box): Arc {
  // Land the copy centred on the slot, shrunk to fit it but never grown past its cell.
  const scale = Math.min(1, (to.width / from.width) * ARC.fit);
  const end = {
    x: to.left + to.width / 2 - from.width / 2,
    y: to.top + to.height / 2 - from.height / 2
  };

  // Peak halfway across, above the higher of the two ends, a little swollen.
  const middle = { x: (from.left + end.x) / 2, y: Math.min(from.top, end.y) - ARC.rise };
  const middleScale = ((1 + scale) / 2) * ARC.swell;

  return { start: { x: from.left, y: from.top }, middle, end, middleScale, scale };
}
