/**
 * @file Paper confetti of the merge board (design-context §6 F7, F8): a ring and a burst of paper
 * bits from a merged item, a finished clue or the memory, in the board's effect layer. The bits'
 * paths come from `src/lib/board-motion.ts`. Nothing bursts when the reader asked for reduced motion.
 */
import { flightOf, type Point } from "../../lib/board-motion";
import { prefersReducedMotion } from "../motion-pref";
import { whenOver } from "./motion";

/** Paper colours of the confetti: the dot, paper, line and cut tones and two tints of them. */
const CONFETTI_TONES = [
  "var(--dot)",
  "var(--surface)",
  "var(--line)",
  "var(--cut)",
  "color-mix(in srgb, var(--dot) 45%, var(--surface))",
  "color-mix(in srgb, var(--ink) 45%, var(--surface))"
];

/** How far the win's bits fly, px. */
const WIN_REACH = 150;

/** Least distance a merge's bits fly, px; past it the reach is {@link REACH_SHARE} of the item. */
const MIN_REACH = 46;

/** How far a merge's bits fly, as a share of the item's width. */
const REACH_SHARE = 0.75;

/** Size of the ring, as a share of the item's shorter side: a merge, the win. */
const RING_SIZE = { merge: 0.8, win: 0.9 };

/** Duration of the ring, ms: a merge, the win. */
const RING_MS = { merge: 460, win: 700 };

/** Easing of the ring. */
const RING_EASING = "cubic-bezier(.2,.7,.3,1)";

/** The motion of a paper bit: its easing, and the share of the throw at which it tops out. */
const BIT_MOTION = { easing: "cubic-bezier(.15,.75,.4,1)", apexAt: 0.42 };

/**
 * Spread a ring out from the burst's centre, fading as it grows.
 *
 * @param layer - The effect layer.
 * @param center - The burst's centre in the layer, px.
 * @param size - Width and height of the ring, px.
 * @param wide - The win: a slower ring.
 * @returns {void} Nothing; the ring plays and removes itself.
 */
function showRing(layer: HTMLElement, center: Point, size: number, wide: boolean): void {
  const ring = document.createElement("span");
  ring.dataset.boardRing = "";
  Object.assign(ring.style, {
    left: `${center.x - size / 2}px`,
    top: `${center.y - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`
  });
  layer.append(ring);
  const motion = ring.animate(
    [
      { transform: "scale(.45)", opacity: 0.9 },
      { transform: "scale(1.35)", opacity: 0 }
    ],
    { duration: wide ? RING_MS.win : RING_MS.merge, easing: RING_EASING }
  );
  whenOver(motion, () => ring.remove());
}

/**
 * Throw one paper bit up and let it fall, spinning.
 *
 * @param layer - The effect layer.
 * @param center - Where it starts, in the layer, px.
 * @param reach - How far bits fly, px.
 * @param wide - The win: larger, slower bits.
 * @param tone - Its colour.
 * @returns {void} Nothing; the bit flies and removes itself.
 */
function throwBit(
  layer: HTMLElement,
  center: Point,
  reach: number,
  wide: boolean,
  tone: string
): void {
  // Cut the bit and lay it on the burst's centre.
  const flight = flightOf(reach, wide, Math.random);
  const bit = document.createElement("span");
  bit.dataset.boardBit = flight.round ? "round" : "";
  Object.assign(bit.style, {
    left: `${center.x - flight.width / 2}px`,
    top: `${center.y - flight.height / 2}px`,
    width: `${flight.width}px`,
    height: `${flight.height}px`,
    background: tone
  });
  layer.append(bit);

  // Throw it to its apex, let it fall and fade, then take it away.
  const { apex, landing } = flight;
  const motion = bit.animate(
    [
      { transform: "translate(0, 0) rotate(0deg) scale(.5)", opacity: 1 },
      {
        transform: `translate(${apex.x}px, ${apex.y}px) rotate(${apex.spin}deg) scale(1)`,
        opacity: 1,
        offset: BIT_MOTION.apexAt
      },
      {
        transform: `translate(${landing.x}px, ${landing.y}px) rotate(${landing.spin}deg) scale(.9)`,
        opacity: 0
      }
    ],
    { duration: flight.duration, easing: BIT_MOTION.easing }
  );
  whenOver(motion, () => bit.remove());
}

/**
 * Paper confetti and a ring bursting from an element, in the board's effect layer.
 *
 * @param layer - The effect layer over the sheet.
 * @param target - The element the burst comes from.
 * @param count - Number of paper bits.
 * @param wide - The win: a wider, slower burst.
 * @returns {void} Nothing; the ring and the bits play in the layer.
 */
export function burst(layer: HTMLElement, target: Element, count: number, wide: boolean): void {
  // Guard: no confetti with reduced motion.
  if (prefersReducedMotion()) return;

  // Find the target's centre inside the effect layer.
  const frame = layer.getBoundingClientRect();
  const box = target.getBoundingClientRect();
  const center = {
    x: box.left + box.width / 2 - frame.left,
    y: box.top + box.height / 2 - frame.top
  };

  // A ring first, then the bits, each in the next paper tone.
  const ringShare = wide ? RING_SIZE.win : RING_SIZE.merge;
  showRing(layer, center, Math.min(box.width, box.height) * ringShare, wide);
  const reach = wide ? WIN_REACH : Math.max(MIN_REACH, box.width * REACH_SHARE);
  for (let index = 0; index < count; index += 1) {
    const tone = CONFETTI_TONES[index % CONFETTI_TONES.length] ?? "var(--dot)";
    throwBit(layer, center, reach, wide, tone);
  }
}
