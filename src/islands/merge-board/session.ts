/**
 * @file The merge board island's per-instance session: the parts of the board markup it drives, the
 * game in play and the input in progress. Read once from the server-rendered board at mount, strings
 * included: the board carries them in `data-board-strings`, so the client bundle has no string table.
 */
import { type IslandBoardStrings, readBoardStrings } from "../../lib/board-strings";
import { CELL_COUNT, type Chain, type Game, gameFrom, parseItem } from "../../lib/merge";

/** The slots of the case list: one per chain, then the memory. */
export type Goals = Record<Chain | "memory", HTMLElement>;

/** The parts of the board markup (`MergeBoard.tsx`) the island drives. */
export type BoardView = {
  /** The board section, the island root. */
  root: HTMLElement;
  /** The grid of cells. */
  grid: HTMLElement;
  /** The cells, row by row. */
  cells: HTMLElement[];
  /** The taped sheet, watched for the first view. */
  sheet: HTMLElement;
  /** The layer for confetti and the pop ring. */
  fx: HTMLElement;
  /** The win overlay. */
  win: HTMLElement;
  /** The memory orb in the win overlay. */
  orb: HTMLElement;
  /** The Play again button. */
  again: HTMLElement;
  /** The live region for announcements. */
  live: HTMLElement;
  /** The progress line. */
  progress: HTMLElement;
  /** The case list slots. */
  goals: Goals;
};

/** An item being dragged. */
export type Drag = {
  /** The item element left in its cell, faded while it is in the hand. */
  item: HTMLElement;
  /** The copy that follows the pointer. */
  ghost: HTMLElement;
  /** Where the pointer grabbed the item, from its left edge, px. */
  offsetX: number;
  /** Where the pointer grabbed the item, from its top edge, px. */
  offsetY: number;
  /** The cell under the pointer, if any. */
  over: number | undefined;
};

/** A pointer pressed on a cell: a tap until it moves far enough, then a drag. */
export type Press = {
  /** The pointer's id. */
  id: number;
  /** The cell it pressed. */
  index: number;
  /** Where it pressed, px. */
  x: number;
  /** Where it pressed, px. */
  y: number;
  /** True when the cell holds an item that can be picked up. */
  movable: boolean;
  /** True for a mouse (a shorter distance starts a drag). */
  mouse: boolean;
  /** The drag, once it started. */
  drag: Drag | undefined;
};

/** Everything one mounted board knows. */
export type BoardSession = {
  /** The board markup. */
  view: BoardView;
  /** Board strings of the page locale, as the board wrote them. */
  board: IslandBoardStrings["board"];
  /** Item names of the page locale, as the board wrote them. */
  items: IslandBoardStrings["items"];
  /** The game in play. */
  game: Game;
  /** True from the win until a new board. */
  won: boolean;
  /** The picked-up cell (tap-tap and keyboard), if any. */
  selected: number | undefined;
  /** The cell that is the grid's tab stop. */
  focus: number;
  /** The pointer pressed on the board, if any. */
  press: Press | undefined;
  /** Counts boards: a delayed step of an older board does nothing. */
  round: number;
  /** Pending delayed steps. */
  timers: Set<ReturnType<typeof setTimeout>>;
  /** Ghosts and flying clues on `<body>`, removed with the board. */
  floating: Set<HTMLElement>;
};

/**
 * Find the parts of the board markup.
 *
 * @param root - The island root.
 * @returns The parts, or `undefined` when the markup is not a whole board.
 */
function readView(root: Element): BoardView | undefined {
  // Guard: the island root is an HTML element.
  if (!(root instanceof HTMLElement)) return undefined;

  // Look up every part of the board and of the case list.
  const query = (selector: string): HTMLElement | null => root.querySelector(selector);
  const grid = query("[data-board-grid]");
  const sheet = query("[data-board-sheet]");
  const fx = query("[data-board-fx]");
  const win = query("[data-board-win]");
  const orb = query("[data-board-orb]");
  const again = query("[data-board-again]");
  const live = query("[data-board-live]");
  const progress = query("[data-board-progress]");
  const note = query('[data-case-goal="note"]');
  const key = query('[data-case-goal="key"]');
  const photo = query('[data-case-goal="photo"]');
  const memory = query('[data-case-goal="memory"]');
  const cells = [...root.querySelectorAll<HTMLElement>("[data-cell]")];

  // Guard: a whole board — every cell, every part and every slot of the case list.
  const hasEveryCell = cells.length === CELL_COUNT;
  const hasEveryPart =
    grid !== null &&
    sheet !== null &&
    fx !== null &&
    win !== null &&
    orb !== null &&
    again !== null &&
    live !== null &&
    progress !== null;
  const hasEverySlot = note !== null && key !== null && photo !== null && memory !== null;
  if (!hasEveryCell || !hasEveryPart || !hasEverySlot) return undefined;

  // Assemble the view.
  const goals: Goals = { note, key, photo, memory };
  return { root, grid, cells, sheet, fx, win, orb, again, live, progress, goals };
}

/**
 * Start a session on a server-rendered board: its parts, the board it was dealt, the page's strings.
 *
 * @param root - The island root.
 * @returns The session, or `undefined` when the markup is not a whole board or carries no strings.
 */
export function readSession(root: Element): BoardSession | undefined {
  // Guard: a whole board that carries the page's strings.
  const view = readView(root);
  const strings = readBoardStrings(view?.root.dataset.boardStrings);
  if (view === undefined || strings === undefined) return undefined;

  // Read the dealt items off the cells and the cell that holds the tab stop.
  const { board, items } = strings;
  const cells = view.cells.map(cell =>
    parseItem(cell.querySelector<HTMLElement>("[data-item]")?.dataset.item)
  );
  const focus = Math.max(
    0,
    view.cells.findIndex(cell => cell.tabIndex === 0)
  );

  // Assemble a fresh session: nothing selected, pressed, scheduled or won yet.
  return {
    view,
    board,
    items,
    game: gameFrom(cells),
    won: false,
    selected: undefined,
    focus,
    press: undefined,
    round: 0,
    timers: new Set(),
    floating: new Set()
  };
}
