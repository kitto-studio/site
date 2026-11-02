/**
 * @file Motion of the merge board's items (design-context §6 F7, F8): the pop, the drop, the nudge of
 * a refused drop, the slide into an empty cell and the flight of a finished clue to its slot. The
 * paper confetti is in `confetti.ts`. Every function does nothing, or finishes at once, when the
 * reader asked for reduced motion, so the board then changes instantly.
 */
import { arcPoints } from "../../lib/board-motion";
import { prefersReducedMotion } from "../motion-pref";

/**
 * How long each item motion lasts, ms: the pop of a merge and the bigger pop of a finished clue or
 * the memory, the drop of a new item, the turn of a picked-up item, the shake of a refused drop, the
 * slide into an empty cell and the float of a refused ghost back to its cell.
 */
const DURATION = {
  pop: 560,
  bigPop: 820,
  drop: 640,
  wiggle: 300,
  nudge: 320,
  slide: 260,
  floatBack: 240
};

/** Easing of a slide into place. */
const SETTLE_EASING = "cubic-bezier(.22,1,.36,1)";

/**
 * The flight of a finished clue to its slot: duration in ms, easing, the tilt at the top of the arc
 * in degrees, and the share of the flight at which it gets there.
 */
const FLIGHT = { ms: 700, easing: "cubic-bezier(.45,0,.25,1)", tilt: -8, apexAt: 0.45 };

/**
 * Run a keyframe animation unless motion is reduced.
 *
 * @param element - The element to animate, if any.
 * @param keyframes - The keyframes.
 * @param options - Duration, easing, delay, fill.
 * @returns The animation, or `undefined` when nothing runs.
 */
function play(
  element: Element | null | undefined,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions
): Animation | undefined {
  if (!element || prefersReducedMotion()) return undefined;
  return element.animate(keyframes, options);
}

/**
 * Call `done` once when an animation finishes or is cancelled.
 *
 * @param animation - The animation.
 * @param done - What to do after it.
 * @returns {void} Nothing; `done` runs later, once.
 */
export function whenOver(animation: Animation, done: () => void): void {
  animation.addEventListener("finish", done, { once: true });
  animation.addEventListener("cancel", done, { once: true });
}

/**
 * The pop of a merge: squash and stretch from the item's foot, the logo's Jump in miniature.
 *
 * @param element - The new item.
 * @param big - A finished clue or the memory: a larger, slower pop.
 * @returns {void} Nothing; the item pops.
 */
export function pop(element: Element | null | undefined, big: boolean): void {
  const strength = big ? 1.4 : 1;
  play(
    element,
    [
      { transform: "scale(.3)", opacity: 0.3 },
      {
        transform: `scale(${1 + 0.24 * strength}, ${1 - 0.16 * strength})`,
        opacity: 1,
        offset: 0.32
      },
      { transform: `scale(${1 - 0.1 * strength}, ${1 + 0.1 * strength})`, offset: 0.54 },
      { transform: "scale(1.04, .96)", offset: 0.74 },
      { transform: "scale(.99, 1.01)", offset: 0.88 },
      { transform: "none" }
    ],
    { duration: big ? DURATION.bigPop : DURATION.pop, easing: "ease-out" }
  );
}

/**
 * The drop of a new item: it falls into its recess and bounces twice, like a letter of the logo.
 *
 * @param element - The new item.
 * @param delay - Wait before it falls, ms.
 * @returns {void} Nothing; the item drops in.
 */
export function drop(element: Element | null | undefined, delay: number): void {
  play(
    element,
    [
      { transform: "translateY(-70%) scale(.9)", opacity: 0 },
      { transform: "translateY(-70%) scale(.9)", opacity: 1, offset: 0.05 },
      { transform: "translateY(0) scale(1.14, .86)", offset: 0.42, easing: "ease-out" },
      { transform: "translateY(-14%) scale(.97, 1.03)", offset: 0.6, easing: "ease-in" },
      { transform: "translateY(0) scale(1.05, .95)", offset: 0.78, easing: "ease-out" },
      { transform: "translateY(-3%)", offset: 0.88, easing: "ease-in" },
      { transform: "none" }
    ],
    { duration: DURATION.drop, delay, easing: "cubic-bezier(.5,0,.75,0)", fill: "backwards" }
  );
}

/**
 * The little turn of an item that is picked up.
 *
 * @param element - The item.
 * @returns {void} Nothing; the item turns.
 */
export function wiggle(element: Element | null | undefined): void {
  play(element, [{ rotate: "0deg" }, { rotate: "-4deg" }, { rotate: "3deg" }, { rotate: "0deg" }], {
    duration: DURATION.wiggle,
    easing: "ease-out"
  });
}

/**
 * The shake of an item that refused a drop.
 *
 * @param element - The item.
 * @returns {void} Nothing; the item shakes.
 */
export function nudge(element: Element | null | undefined): void {
  play(
    element,
    [
      { transform: "none" },
      { transform: "translateX(-7%) rotate(-4deg)" },
      { transform: "translateX(6%) rotate(3deg)" },
      { transform: "translateX(-3%)" },
      { transform: "none" }
    ],
    { duration: DURATION.nudge, easing: "ease-out" }
  );
}

/**
 * Slide an item that moved to an empty cell from where it was.
 *
 * @param element - The item in its new cell.
 * @param from - The box of its old cell.
 * @returns {void} Nothing; the item slides across.
 */
export function slideFrom(element: Element | null | undefined, from: DOMRect): void {
  if (!element) return;
  const to = element.getBoundingClientRect();
  play(
    element,
    [
      { transform: `translate(${from.left - to.left}px, ${from.top - to.top}px)` },
      { transform: "none" }
    ],
    { duration: DURATION.slide, easing: SETTLE_EASING }
  );
}

/**
 * A copy of an item's art that floats over the page: the ghost in the hand or a clue in flight.
 *
 * @param item - The item element.
 * @param kind - `ghost` or `flight`.
 * @returns The copy, not yet on the page.
 */
export function floatingCopy(item: HTMLElement, kind: "ghost" | "flight"): HTMLElement {
  const copy = document.createElement("span");
  if (kind === "ghost") copy.dataset.boardGhost = "";
  else copy.dataset.boardFlight = "";
  const image = document.createElement("img");
  image.src = item.querySelector("img")?.src ?? "";
  image.alt = "";
  copy.append(image);
  return copy;
}

/**
 * Fly a finished clue in an arc from its cell into its slot of the case list.
 *
 * @param item - The clue's item element; hidden while its copy flies.
 * @param goal - The slot.
 * @param done - Called with the flying copy once the clue has landed. Never called with reduced
 *   motion.
 * @returns The flying copy on `<body>`, or `undefined` with reduced motion: nothing flies, the
 *   caller lands the clue at once.
 */
export function flyTo(
  item: HTMLElement,
  goal: Element,
  done: (flight: HTMLElement) => void
): HTMLElement | undefined {
  // Guard: with reduced motion nothing flies.
  if (prefersReducedMotion()) return undefined;

  // Lay a copy of the clue over its cell and hide the clue itself.
  const from = item.getBoundingClientRect();
  const to = goal.getBoundingClientRect();
  const flight = floatingCopy(item, "flight");
  flight.style.width = `${from.width}px`;
  flight.style.height = `${from.height}px`;
  document.body.append(flight);
  item.style.visibility = "hidden";

  // Fly the copy along the arc, then take it away and hand over to the landing.
  const { start, middle, end, middleScale, scale } = arcPoints(from, to);
  const motion = flight.animate(
    [
      { transform: `translate(${start.x}px, ${start.y}px) scale(1)` },
      {
        transform: `translate(${middle.x}px, ${middle.y}px) scale(${middleScale}) rotate(${FLIGHT.tilt}deg)`,
        offset: FLIGHT.apexAt
      },
      { transform: `translate(${end.x}px, ${end.y}px) scale(${scale})` }
    ],
    { duration: FLIGHT.ms, easing: FLIGHT.easing, fill: "forwards" }
  );
  whenOver(motion, () => {
    flight.remove();
    done(flight);
  });
  return flight;
}

/**
 * Float a dragged item's ghost back to its own cell after a drop that was refused.
 *
 * @param ghost - The ghost.
 * @param home - The item left in its cell.
 * @param done - Called once it is back (at once with reduced motion).
 * @returns {void} Nothing; the ghost floats home, then `done` runs.
 */
export function floatBack(ghost: HTMLElement, home: Element, done: () => void): void {
  if (prefersReducedMotion()) {
    done();
    return;
  }
  const box = home.getBoundingClientRect();
  const motion = ghost.animate(
    [{ transform: ghost.style.transform }, { transform: `translate(${box.left}px, ${box.top}px)` }],
    { duration: DURATION.floatBack, easing: SETTLE_EASING, fill: "forwards" }
  );
  whenOver(motion, done);
}
