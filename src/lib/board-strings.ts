/**
 * @file The merge board's strings, carried from the build to the island in one data attribute.
 *
 * The island names items and announces moves in the page's language, yet the client bundle carries
 * no string table: `MergeBoard` writes the strings the island needs into `data-board-strings` when
 * the page is built ({@link writeBoardStrings}), and the island reads them back at mount
 * ({@link readBoardStrings}).
 */
import type { BoardStrings, ItemStrings } from "../i18n/types";
import { CHAINS, itemKey, type Tier } from "./merge";

/** The board strings the island writes after the first paint. */
const BOARD_KEYS = [
  "empty",
  "picked",
  "merged",
  "found",
  "missing",
  "progress",
  "winTitle",
  "winText"
] as const;

/** Every tier of a chain. */
const TIERS: readonly Tier[] = [1, 2, 3];

/** Every item name: each tier of each chain, then the memory. */
const ITEM_KEYS: readonly (keyof ItemStrings)[] = [
  ...CHAINS.flatMap(chain => TIERS.map(tier => itemKey({ chain, tier }))),
  "memory"
];

/** What the island says: the board strings it writes after the first paint and every item name. */
export type IslandBoardStrings = {
  /** Cell, case list, progress and live region strings of the page locale. */
  board: Pick<BoardStrings, (typeof BOARD_KEYS)[number]>;
  /** Item names of the page locale. */
  items: ItemStrings;
};

/**
 * Write the strings the island needs, for the board's `data-board-strings` attribute.
 *
 * @param board - Board strings of the page locale.
 * @param items - Item names of the page locale.
 * @returns The strings as JSON.
 * @example
 * ```ts
 * // MergeBoard writes the English strings on the board; only the 8 the island uses are kept.
 * const { board, items } = t("en").game;
 * writeBoardStrings(board, items); // '{"board":{"empty":"Empty cell",…},"items":{"note1":"Torn scrap",…}}'
 * ```
 */
export function writeBoardStrings(board: BoardStrings, items: ItemStrings): string {
  const strings: IslandBoardStrings = {
    board: {
      empty: board.empty,
      picked: board.picked,
      merged: board.merged,
      found: board.found,
      missing: board.missing,
      progress: board.progress,
      winTitle: board.winTitle,
      winText: board.winText
    },
    items
  };
  return JSON.stringify(strings);
}

/**
 * Parse JSON without throwing.
 *
 * @param json - Any text.
 * @returns The parsed value, or `undefined` when the text is not JSON.
 */
function parseJson(json: string): unknown {
  try {
    return JSON.parse(json);
  } catch {
    return undefined;
  }
}

/**
 * Check that a parsed value holds a string under every key.
 *
 * @param value - A parsed JSON value.
 * @param keys - The keys it must hold.
 * @returns True when every key holds a string.
 */
function hasStrings<K extends string>(
  value: unknown,
  keys: readonly K[]
): value is Record<K, string> {
  if (typeof value !== "object" || value === null) return false;
  const entries = new Map(Object.entries(value));
  return keys.every(key => typeof entries.get(key) === "string");
}

/**
 * Read the board's strings back from its `data-board-strings` attribute.
 *
 * @param json - The attribute value, or `undefined` when the board has none.
 * @returns The strings, or `undefined` when the attribute is missing, not JSON or lacks a string.
 * @example
 * ```ts
 * readBoardStrings(root.dataset.boardStrings)?.items.memory; // "Memory" on an English page
 * ```
 */
export function readBoardStrings(json: string | undefined): IslandBoardStrings | undefined {
  const parsed = json === undefined ? undefined : parseJson(json);
  if (typeof parsed !== "object" || parsed === null) return undefined;
  if (!("board" in parsed) || !("items" in parsed)) return undefined;
  const { board, items } = parsed;
  return hasStrings(board, BOARD_KEYS) && hasStrings(items, ITEM_KEYS)
    ? { board, items }
    : undefined;
}
