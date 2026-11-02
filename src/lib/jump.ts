/**
 * @file The logo «Прыжок» (Jump): the drop-and-bounce physics of the brand kit, as pure functions of
 * time. The letters k, i, tt, o drop one by one, 80 ms apart, with a small bounce; the dot drops last
 * at 700 ms and squashes on contact. Units are milliseconds and the wordmark's viewBox units. The
 * `logo-jump` island paints these states frame by frame.
 */

/** The five parts of the wordmark (`data-part` in `Logo.tsx`), in the order the Jump drops them. */
export const JUMP_PARTS = ["k", "i", "tt", "o", "dot"] as const;

/** One part of the wordmark. */
export type JumpPart = (typeof JUMP_PARTS)[number];

/** Height and squash of a falling part at one moment. */
export type Bounce = {
  /** Height above the resting line, in viewBox units (0 = resting). */
  y: number;
  /** Strength of the ground contact, 0 (none) to 1 (the first impact), fading out after each hit. */
  contact: number;
  /** True once the part has stopped bouncing and rested long enough. */
  done: boolean;
};

/** How to draw one part at one moment. */
export type PartState = {
  /** Vertical offset in viewBox units (negative = above its place). */
  dy: number;
  /** Horizontal scale around the part's bottom centre. */
  scaleX: number;
  /** Vertical scale around the part's bottom centre. */
  scaleY: number;
  /** Opacity, 0 to 1. */
  opacity: number;
  /** True once the part rests in place. */
  done: boolean;
};

/** One part's drop: when it starts, how high it falls from, how long the fall takes, how much it squashes. */
type Drop = {
  /** Start, in ms after the Jump begins. */
  delay: number;
  /** Drop height in viewBox units. */
  height: number;
  /** Duration of the first fall in ms. */
  fall: number;
  /** Squash factor at full contact. */
  squash: number;
};

/** A part's box in the wordmark's viewBox: x, y, width, height. */
type Box = readonly [x: number, y: number, width: number, height: number];

/** Time between two letters. */
const LETTER_GAP_MS = 80;

/** The drop of every letter (k, i, tt, o), started {@link LETTER_GAP_MS} apart. */
const LETTER_DROP = { height: 420, fall: 430, squash: 0.05 };

/** The dot drops last, higher, and squashes more. */
const DOT_DROP: Drop = { delay: 700, height: 560, fall: 470, squash: 0.14 };

/** Bounces after the first impact. */
const BOUNCES = 3;

/** Share of the speed a part keeps after each impact. */
const RESTITUTION = 0.38;

/** How long the squash of an impact lasts. */
const CONTACT_MS = 90;

/** How long a part rests after its last bounce before it counts as done. */
const SETTLE_MS = 120;

/** Fade-in at the start of a part's drop. */
const FADE_IN_MS = 80;

/** A Jump never runs longer than this, whatever the frames say. */
export const JUMP_TIMEOUT_MS = 4000;

/** Each part's box in the wordmark's viewBox (from the brand kit); the squash pivots on its bottom centre. */
const BOXES: Record<JumpPart, Box> = {
  k: [113, 392, 197, 299],
  i: [320, 479, 74, 211],
  tt: [398, 400, 313, 290],
  o: [695, 465, 228, 228],
  dot: [320, 392, 75, 74]
};

/** The state of a part that has not started: in place, unsquashed and invisible. */
const WAITING: PartState = { dy: 0, scaleX: 1, scaleY: 1, opacity: 0, done: false };

/**
 * Clamp a number to 0..1.
 *
 * @param value - Any number.
 * @returns The value limited to the range 0..1.
 */
function clampUnit(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/**
 * The height and contact of a part dropped from `height` that lands after `fall` ms, then bounces
 * three times, losing most of its speed at each impact.
 *
 * @param time - Time since the part started falling, in ms.
 * @param height - Drop height in viewBox units.
 * @param fall - Duration of the first fall in ms.
 * @returns The part's height above its resting line, its contact strength and whether it is done.
 * @example
 * ```ts
 * dropBounce(0, 420, 430).y;   // 420: the full height
 * dropBounce(430, 420, 430).y; // 0: it lands
 * ```
 */
export function dropBounce(time: number, height: number, fall: number): Bounce {
  const gravity = (2 * height) / (fall * fall);
  if (time < fall) return { y: height - 0.5 * gravity * time * time, contact: 0, done: false };

  const impactSpeed = gravity * fall;
  let speed = impactSpeed;
  let sinceImpact = time - fall;
  for (let bounce = 0; bounce < BOUNCES; bounce += 1) {
    const hit = speed / impactSpeed;
    speed *= RESTITUTION;
    const airtime = (2 * speed) / gravity;
    if (sinceImpact < airtime) {
      return {
        y: speed * sinceImpact - 0.5 * gravity * sinceImpact * sinceImpact,
        contact: hit * clampUnit(1 - sinceImpact / CONTACT_MS),
        done: false
      };
    }
    sinceImpact -= airtime;
  }
  return { y: 0, contact: 0, done: sinceImpact > SETTLE_MS };
}

/**
 * The drop of one part: the letters start {@link LETTER_GAP_MS} apart in reading order, the dot last.
 *
 * @param part - A wordmark part.
 * @returns Its start, height, fall time and squash.
 */
function dropOf(part: JumpPart): Drop {
  if (part === "dot") return DOT_DROP;
  return { ...LETTER_DROP, delay: LETTER_GAP_MS * JUMP_PARTS.indexOf(part) };
}

/**
 * How to draw one part of the wordmark at a moment of the Jump.
 *
 * @param elapsed - Time since the Jump began, in ms.
 * @param part - The wordmark part.
 * @returns Its offset, squash, opacity and whether it rests in place.
 * @example
 * ```ts
 * partState(650, "dot").opacity; // 0: the dot starts at 700 ms
 * partState(2000, "k").done;     // true: every letter rests by then
 * ```
 */
export function partState(elapsed: number, part: JumpPart): PartState {
  const drop = dropOf(part);
  const time = elapsed - drop.delay;
  if (time < 0) return WAITING;
  const bounce = dropBounce(time, drop.height, drop.fall);
  return {
    dy: -bounce.y,
    scaleX: 1 + drop.squash * bounce.contact,
    scaleY: 1 - drop.squash * bounce.contact,
    opacity: clampUnit(time / FADE_IN_MS),
    done: bounce.done
  };
}

/**
 * The SVG `transform` that draws a part in a state: raised by its offset and squashed around its
 * bottom centre, so it lands on the line it rests on.
 *
 * @param part - The wordmark part.
 * @param state - The part's state at this moment.
 * @returns A `transform` attribute value for the part's `<g>`.
 * @example
 * ```ts
 * partTransform("dot", partState(1170, "dot")); // the dot squashed as it lands on the i
 * ```
 */
export function partTransform(part: JumpPart, state: PartState): string {
  const [x, y, width, height] = BOXES[part];
  const pivotX = x + width / 2;
  const pivotY = y + height;
  return (
    `translate(0 ${state.dy.toFixed(2)}) translate(${pivotX} ${pivotY}) ` +
    `scale(${state.scaleX.toFixed(4)} ${state.scaleY.toFixed(4)}) translate(${-pivotX} ${-pivotY})`
  );
}

/**
 * Narrow a `data-part` value to a wordmark part.
 *
 * @param value - The attribute value.
 * @returns True when the value names one of the five parts.
 * @example
 * ```ts
 * isJumpPart("dot"); // true
 * isJumpPart("x");   // false
 * ```
 */
export function isJumpPart(value: string | undefined): value is JumpPart {
  return JUMP_PARTS.some(part => part === value);
}
