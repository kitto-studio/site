// @vitest-environment happy-dom
import { type IslandHandle, mountIsland } from "@moku-labs/web/testing";
import { h } from "preact";
import { renderToString } from "preact-render-to-string";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MergeBoard } from "../../../src/components/MergeBoard";
import { t } from "../../../src/i18n";
import { mergeBoardIsland } from "../../../src/islands/merge-board";
import { COLUMNS, itemKey, parseItem } from "../../../src/lib/merge";

/** One frame of the fake clock: the live region writes its message on the next frame. */
const FRAME = 16;

/** Longer than every delay of a move with reduced motion (refill, collect, win). */
const SETTLE = 1000;

/** The English board strings and item names. */
const { board, items } = t("en").game;

let handle: IslandHandle | undefined;

/**
 * Mount the island on the server-rendered English board. The island reads the board's texts from
 * the section's data attributes at mount, so the host carries them before the harness mounts it.
 * The host sits outside `<body>`, which the harness clears before it mounts.
 */
function mountBoard(): HTMLElement {
  const template = document.createElement("template");
  template.innerHTML = renderToString(h(MergeBoard, { locale: "en" }));
  const section = template.content.firstElementChild;
  if (!(section instanceof HTMLElement)) throw new Error("missing the merge board section");
  const host = document.createElement("div");
  Object.assign(host.dataset, section.dataset);
  document.documentElement.append(host);
  handle = mountIsland(mergeBoardIsland, { el: host, html: section.innerHTML, locale: "en" });
  return handle.el;
}

/** The element matching `selector` inside `root`; fails the test when it is missing. */
function find(root: ParentNode, selector: string): HTMLElement {
  const element = root.querySelector(selector);
  if (!(element instanceof HTMLElement)) throw new Error(`missing ${selector}`);
  return element;
}

/** The 20 cells, row by row. */
const cellsOf = (root: Element): HTMLElement[] => [
  ...root.querySelectorAll<HTMLElement>("[data-cell]")
];

/** The cell at `index`; fails the test when it is missing. */
function cellAt(root: Element, index: number): HTMLElement {
  const cell = cellsOf(root)[index];
  if (cell === undefined) throw new Error(`missing cell ${index}`);
  return cell;
}

/** The item code (`note-1`) in a cell, or `undefined` when it is empty. */
const codeAt = (cell: HTMLElement): string | undefined =>
  cell.querySelector<HTMLElement>("[data-item]")?.dataset.item;

/** The display name of an item code. */
function nameOf(code: string | undefined): string {
  const item = parseItem(code);
  if (item === undefined) throw new Error(`no item ${code}`);
  return items[itemKey(item)];
}

/** The code of the next tier: `note-1` → `note-2`. */
const nextTier = (code: string | undefined): string =>
  (code ?? "").replace(/\d$/, tier => String(Number(tier) + 1));

/** The first two cells holding identical items below tier 3. */
function twinPair(root: Element): [number, number] {
  const codes = cellsOf(root).map(cell => codeAt(cell));
  for (const [from, code] of codes.entries()) {
    if (code === undefined || code.endsWith("-3")) continue;
    const to = codes.indexOf(code, from + 1);
    if (to !== -1) return [from, to];
  }
  throw new Error("no pair on the board");
}

/** Press a key on whatever has focus (the event bubbles like a real key press). */
function press(key: string): void {
  const target = document.activeElement ?? document.body;
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

/** Walk the keyboard focus from cell `from` to cell `to` with the arrow keys. */
function walk(from: number, to: number): void {
  const rows = Math.floor(to / COLUMNS) - Math.floor(from / COLUMNS);
  const columns = (to % COLUMNS) - (from % COLUMNS);
  for (let step = 0; step < Math.abs(rows); step += 1) press(rows > 0 ? "ArrowDown" : "ArrowUp");
  for (let step = 0; step < Math.abs(columns); step += 1) {
    press(columns > 0 ? "ArrowRight" : "ArrowLeft");
  }
}

/** A pointer event of the first finger at `x`. */
const pointer = (type: string, x: number): PointerEvent =>
  new PointerEvent(type, {
    pointerId: 1,
    pointerType: "touch",
    clientX: x,
    clientY: 10,
    bubbles: true,
    cancelable: true
  });

/** Tap a cell: press and release without moving. */
function tap(cell: HTMLElement): void {
  cell.dispatchEvent(pointer("pointerdown", 10));
  cell.dispatchEvent(pointer("pointerup", 10));
}

/** Drag the item of cell `from` and drop it where `elementFromPoint` says the finger is. */
function drag(root: Element, from: number, over: number): void {
  vi.spyOn(document, "elementFromPoint").mockReturnValue(cellAt(root, over));
  const source = cellAt(root, from);
  source.dispatchEvent(pointer("pointerdown", 10));
  source.dispatchEvent(pointer("pointermove", 40));
  source.dispatchEvent(pointer("pointermove", 60));
}

/** The text of the progress line. */
const progressOf = (root: Element): string => find(root, "[data-board-progress]").textContent;

/** Play first pairs by tapping until `count` clues are found. */
function playUntilFound(root: Element, count: number): void {
  const goal = board.progress.replace("{n}", String(count));
  for (let step = 0; step < 200 && progressOf(root) !== goal; step += 1) {
    const [from, to] = twinPair(root);
    tap(cellAt(root, from));
    tap(cellAt(root, to));
    vi.advanceTimersByTime(SETTLE);
  }
  expect(progressOf(root)).toBe(goal);
}

beforeEach(() => {
  vi.useFakeTimers({
    toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame"]
  });
  // Reduced motion: every move lands at once, so the board can be read right after it.
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query.includes("reduce"),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {}
  }));
});

afterEach(() => {
  handle?.unmount();
  handle?.el.remove();
  handle = undefined;
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("merge-board island: keyboard", () => {
  // Catches: Enter not picking up, the arrows losing the cell, the drop not merging, or a merge the
  // live region never announces (keyboard and screen reader players would be stuck).
  it("Enter picks an item, the arrows reach its twin, Enter merges there and it is announced", () => {
    const root = mountBoard();
    const live = find(root, "[data-board-live]");
    const [from, to] = twinPair(root);
    const code = codeAt(cellAt(root, from));

    cellAt(root, 0).focus();
    walk(0, from);
    expect(document.activeElement).toBe(cellAt(root, from));
    press("Enter");
    vi.advanceTimersByTime(FRAME);
    expect(cellAt(root, from).getAttribute("aria-pressed")).toBe("true");
    expect(cellAt(root, to).dataset.twin).toBe("");
    expect(live.textContent).toBe(board.picked.replace("{item}", nameOf(code)));

    walk(from, to);
    press("Enter");
    vi.advanceTimersByTime(FRAME);
    expect(codeAt(cellAt(root, to))).toBe(nextTier(code));
    // The source cell may be refilled at random right away; "source empties" is covered in merge.test.ts.
    expect(cellAt(root, to).getAttribute("aria-label")).toBe(nameOf(nextTier(code)));
    expect(live.textContent).toBe(board.merged.replace("{item}", nameOf(nextTier(code))));

    // One tier-1 item drops in after the merge: the board keeps its ten items.
    vi.advanceTimersByTime(SETTLE);
    expect(root.querySelectorAll("[data-cell] [data-item]")).toHaveLength(10);
  });

  // Catches: Escape ignored, so a picked item and its twin marks stay on the board.
  it("Escape puts the picked item back", () => {
    const root = mountBoard();
    const [from] = twinPair(root);

    cellAt(root, from).focus();
    press("Enter");
    expect(cellAt(root, from).getAttribute("aria-pressed")).toBe("true");
    expect(root.querySelectorAll("[data-twin]").length).toBeGreaterThan(0);
    press("Escape");

    expect(cellAt(root, from).getAttribute("aria-pressed")).toBe("false");
    expect(root.querySelectorAll("[data-twin]")).toHaveLength(0);
  });
});

describe("merge-board island: drag", () => {
  // Catches: a drop on the twin that does not merge, or the ghost left floating on the page.
  it("dropping a dragged item on its twin merges them and removes the ghost", () => {
    const root = mountBoard();
    const [from, to] = twinPair(root);
    const code = codeAt(cellAt(root, from));

    drag(root, from, to);
    expect(document.querySelector("[data-board-ghost]")).not.toBeNull();
    expect(cellAt(root, to).dataset.over).toBe("");
    cellAt(root, from).dispatchEvent(pointer("pointerup", 60));

    expect(codeAt(cellAt(root, to))).toBe(nextTier(code));
    expect(codeAt(cellAt(root, from))).toBeUndefined();
    expect(document.querySelector("[data-board-ghost]")).toBeNull();
    expect(document.documentElement.dataset.boardDragging).toBeUndefined();
  });

  // Catches: a drop on a different item that overwrites it, or an item left lifted after it.
  it("dropping on a different item changes nothing and puts the item back", () => {
    const root = mountBoard();
    const codes = cellsOf(root).map(cell => codeAt(cell));
    const from = codes.findIndex(code => code !== undefined);
    const other = codes.findIndex(code => code !== undefined && code !== codes[from]);

    drag(root, from, other);
    expect(find(cellAt(root, from), "[data-item]").dataset.lifted).toBe("");
    expect(cellAt(root, other).dataset.over).toBeUndefined();
    cellAt(root, from).dispatchEvent(pointer("pointerup", 60));

    expect(cellsOf(root).map(cell => codeAt(cell))).toEqual(codes);
    expect(root.querySelectorAll("[data-lifted]")).toHaveLength(0);
    expect(document.querySelector("[data-board-ghost]")).toBeNull();
  });
});

describe("merge-board island: clues and the win", () => {
  // Catches: New board keeping the old count, the found slots or the old items.
  it("New board resets the count, the case list and the board", () => {
    const root = mountBoard();
    playUntilFound(root, 1);
    expect(root.querySelectorAll("[data-case-goal][data-found]")).toHaveLength(1);

    find(root, "[data-board-new]").click();

    expect(progressOf(root)).toBe(board.progress.replace("{n}", "0"));
    expect(root.querySelectorAll("[data-found]")).toHaveLength(0);
    const codes = cellsOf(root)
      .map(cell => codeAt(cell))
      .filter(code => code !== undefined);
    expect(codes).toHaveLength(10);
    expect(codes.every(code => code.endsWith("-1"))).toBe(true);
  });

  // Catches: a third clue that never shows the memory, or Play again that leaves the board locked.
  it("the third clue brings the memory and Play again; Play again starts over", () => {
    const root = mountBoard();
    const win = find(root, "[data-board-win]");
    playUntilFound(root, 3);
    vi.advanceTimersByTime(FRAME);

    expect(win.hidden).toBe(false);
    expect(find(root, "[data-board-grid]").inert).toBe(true);
    expect(find(root, '[data-case-goal="memory"]').dataset.found).toBe("");
    expect(find(root, "[data-board-live]").textContent).toBe(`${board.winTitle} ${board.winText}`);

    find(root, "[data-board-again]").click();

    expect(win.hidden).toBe(true);
    expect(find(root, "[data-board-grid]").inert).toBe(false);
    expect(progressOf(root)).toBe(board.progress.replace("{n}", "0"));
  });
});
