import { describe, expect, it } from "vitest";
import { arcPoints, flightOf } from "../../src/lib/board-motion";

/** A clue's cell low on the board. */
const CELL = { left: 0, top: 300, width: 100, height: 100 };

describe("arcPoints", () => {
  // Catches: a clue that lands off-centre in its slot, or grows past its cell in a larger slot.
  it("lands the copy centred on its slot, shrunk to fit and never scaled up", () => {
    const small = { left: 400, top: 20, width: 60, height: 60 };
    const large = { left: 400, top: 20, width: 200, height: 200 };

    const into = arcPoints(CELL, small);
    // The copy scales around its own centre, so its centre is its landing corner plus half its box.
    expect(into.end.x + CELL.width / 2).toBe(small.left + small.width / 2);
    expect(into.end.y + CELL.height / 2).toBe(small.top + small.height / 2);
    expect(CELL.width * into.scale).toBeLessThan(small.width);

    expect(arcPoints(CELL, large).scale).toBe(1);
  });

  // Catches: an arc that dips through the case list instead of rising over it.
  it("peaks above both ends, halfway across", () => {
    const arc = arcPoints(CELL, { left: 400, top: 20, width: 60, height: 60 });

    expect(arc.start).toEqual({ x: CELL.left, y: CELL.top });
    expect(arc.middle.y).toBeLessThan(Math.min(arc.start.y, arc.end.y));
    expect(arc.middle.x).toBe((arc.start.x + arc.end.x) / 2);
  });
});

describe("flightOf", () => {
  // Catches: confetti thrown down into the board, past the burst's reach, or never falling back.
  it("throws a bit up within the reach, then lets it fall below its apex", () => {
    const flight = flightOf(100, false, () => 0.5);

    expect(flight.apex.y).toBeLessThan(0);
    expect(Math.hypot(flight.apex.x, flight.apex.y)).toBeLessThanOrEqual(100 * 1.2);
    expect(flight.landing.y).toBeGreaterThan(flight.apex.y);
    expect(flight.round).toBe(false);
  });

  // Catches: the win's burst losing its larger, slower paper, or no bit ever cut round.
  it("cuts larger, slower bits for the win than for a merge, some of them round", () => {
    const merge = flightOf(100, false, () => 0.1);
    const win = flightOf(100, true, () => 0.1);

    expect(win.width).toBeGreaterThan(merge.width);
    expect(win.duration).toBeGreaterThan(merge.duration);
    expect(merge.round).toBe(true);
  });
});
