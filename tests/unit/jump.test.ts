import { describe, expect, it } from "vitest";
import { dropBounce, JUMP_PARTS, partState, partTransform } from "../../src/lib/jump";

/** The four letters, in the order the Jump drops them. */
const LETTERS = JUMP_PARTS.filter(part => part !== "dot");

/** A point in the wordmark's viewBox units. */
type Point = { x: number; y: number };

/**
 * Apply an SVG transform list of `translate(a b)` and `scale(a b)` steps to a point. The rightmost
 * step applies first, as in SVG.
 */
function applyTransform(transform: string, point: Point): Point {
  const steps = [...transform.matchAll(/(translate|scale)\((-?[\d.]+) (-?[\d.]+)\)/g)].toReversed();
  let { x, y } = point;
  for (const [, kind, first, second] of steps) {
    if (kind === "scale") {
      x *= Number(first);
      y *= Number(second);
    } else {
      x += Number(first);
      y += Number(second);
    }
  }
  return { x, y };
}

describe("dropBounce", () => {
  // Catches: a wrong gravity term, so a letter starts below its height or lands off the baseline.
  it("falls from the full height and lands on y = 0 at the end of the fall", () => {
    expect(dropBounce(0, 420, 430).y).toBe(420);
    expect(dropBounce(215, 420, 430).y).toBeGreaterThan(0);
    // The fall itself reaches the ground: no jump down at the moment of impact.
    expect(dropBounce(429.9, 420, 430).y).toBeLessThan(1);
    expect(dropBounce(430, 420, 430).y).toBe(0);
  });

  // Catches: a Jump that never reports done (it runs to the time cap) or stops mid-bounce.
  it("settles at y = 0 and stays done", () => {
    let doneAt = 0;
    while (!dropBounce(doneAt, 420, 430).done && doneAt < 4000) doneAt += 1;

    expect(doneAt).toBeGreaterThan(430);
    expect(doneAt).toBeLessThan(4000);
    expect(dropBounce(doneAt - 1, 420, 430).done).toBe(false);
    for (let ms = doneAt; ms < doneAt + 2000; ms += 10) {
      expect(dropBounce(ms, 420, 430)).toEqual({ y: 0, contact: 0, done: true });
    }
  });
});

describe("partState", () => {
  // Catches: the dot dropping together with the letters instead of last.
  it("starts the dot at 700 ms", () => {
    expect(partState(699, "dot").opacity).toBe(0);
    expect(partState(701, "dot").opacity).toBeGreaterThan(0);
  });

  // Catches: letters dropping all at once, or out of the k, i, tt, o order.
  it("starts the letters 80 ms apart, in reading order", () => {
    for (const [index, letter] of LETTERS.entries()) {
      const start = 80 * index;
      expect(partState(start - 1, letter).opacity).toBe(0);
      expect(partState(start + 1, letter).opacity).toBeGreaterThan(0);
    }
  });

  // Catches: a part drawn, moved or squashed before its turn, so the logo flashes before the drop.
  it("keeps a part invisible and untouched before its start", () => {
    expect(partState(100, "o")).toEqual({ dy: 0, scaleX: 1, scaleY: 1, opacity: 0, done: false });
  });
});

describe("partTransform", () => {
  // Catches: a squash around the wrong origin, which slides the dot sideways or lifts it off the i.
  it("squashes the dot around its bottom centre when it lands", () => {
    const landing = partState(700 + 470, "dot");
    expect(landing.scaleX).toBeGreaterThan(1);
    expect(landing.scaleY).toBeLessThan(1);

    const transform = partTransform("dot", landing);
    const bottom = applyTransform(transform, { x: 357.5, y: 466 });
    const top = applyTransform(transform, { x: 357.5, y: 392 });

    expect(bottom.x).toBeCloseTo(357.5, 2);
    expect(bottom.y).toBeCloseTo(466, 2);
    expect(top.y).toBeGreaterThan(392);
  });
});
