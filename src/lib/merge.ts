/**
 * @file The merge board's rules (design-context §6 F7, F8, §7), as pure functions over an immutable
 * game. A 5 × 4 board holds clues of three chains (note, key, photo) in tiers 1 → 2 → 3. Two identical
 * items below tier 3 merge into the next tier where the second one lay. A tier 3 is a finished clue:
 * it stays out of play until it is collected into its slot of the case list. All three found wins
 * the memory. After every merge one tier-1 item drops into an empty cell, chosen so a pair exists, so
 * play never gets stuck. The `MergeBoard` component draws the first board from {@link FIRST_BOARD_SEED};
 * the `merge-board` island plays every move through these functions.
 */

/** The three clue chains, in case-list order. */
export const CHAINS = ["note", "key", "photo"] as const;

/** One clue chain. */
export type Chain = (typeof CHAINS)[number];

/** The tier of an item: 1 and 2 merge on, 3 is a finished clue. */
export type Tier = 1 | 2 | 3;

/** An item on the board. */
export type Item = {
  /** The chain the item belongs to. */
  readonly chain: Chain;
  /** Its tier in the chain. */
  readonly tier: Tier;
};

/** A cell of the board: an item, or `undefined` when empty. */
export type Cell = Item | undefined;

/** Which chains have their finished clue collected. */
export type Found = Readonly<Record<Chain, boolean>>;

/** The whole state of one game. */
export type Game = {
  /** The board, row by row, {@link CELL_COUNT} cells. */
  readonly cells: readonly Cell[];
  /** Collected clues. */
  readonly found: Found;
};

/** A source of random numbers in `[0, 1)`, such as `Math.random`. */
export type Random = () => number;

/** The result of a refill: the new game and the cells that received a new item, in drop order. */
export type Refill = {
  /** The game after the drops. */
  readonly game: Game;
  /** Indexes of the cells that received an item. */
  readonly dropped: readonly number[];
};

/** Key of an item's name in the string table (`game.items`). */
export type ItemKey = `${Chain}${Tier}`;

/** Columns of the board. */
export const COLUMNS = 5;

/** Rows of the board. */
export const ROWS = 4;

/** Cells of the board. */
export const CELL_COUNT = COLUMNS * ROWS;

/** The finished tier: it never merges further and is collected. */
const TOP_TIER = 3;

/** Opening items per chain, dealt to the chains in a shuffled order: ten tier-1 items. */
const OPENING_COUNTS = [4, 3, 3] as const;

/** The tier a merge makes. A tier 3 never merges, so its entry is never read. */
const NEXT_TIER: Record<Tier, Tier> = { 1: 2, 2: 3, 3: 3 };

/** Seed of the board drawn at build time: the same first board for every visitor. */
export const FIRST_BOARD_SEED = 7;

/** Nothing collected. */
const NONE_FOUND: Found = { note: false, key: false, photo: false };

/** Folder of the clue art under `public/`. */
const CLUE_FOLDER = "/media/clues/";

/** The art of every item (`public/media/clues/<name>-256.webp`). */
const CLUE_ART: Record<Chain, Record<Tier, string>> = {
  note: {
    1: "note-1-torn-paper-scrap",
    2: "note-2-folded-note-paper-clip",
    3: "note-3-letter-orange-wax-seal"
  },
  key: { 1: "key-1-plain-key", 2: "key-2-key-ring-tag", 3: "key-3-locked-wooden-box" },
  photo: {
    1: "photo-1-torn-photo-corner",
    2: "photo-2-half-photo-tape",
    3: "photo-3-framed-landscape-photo"
  }
};

/** The memory orb: a 256 px thumbnail for the case list, the full art for the win. */
export const MEMORY_ART = {
  /** 256 px thumbnail. */
  thumb: `${CLUE_FOLDER}memory-glowing-orb-256.webp`,
  /** Full 1024 px art. */
  full: `${CLUE_FOLDER}memory-glowing-orb.webp`
};

/**
 * A seeded random number generator (mulberry32): the same seed gives the same sequence.
 *
 * @param seed - Any integer.
 * @returns A {@link Random} source.
 * @example
 * ```ts
 * const random = seededRandom(7);
 * newGame(random); // the same board on every call with seed 7
 * ```
 */
export function seededRandom(seed: number): Random {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d_2b_79_f5) >>> 0;
    let mixed = Math.imul(state ^ (state >>> 15), state | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4_294_967_296;
  };
}

/**
 * One random entry of a list.
 *
 * @param list - The candidates.
 * @param random - The random source.
 * @returns An entry, or `undefined` for an empty list.
 */
function pick<T>(list: readonly T[], random: Random): T | undefined {
  return list[Math.floor(random() * list.length)];
}

/**
 * A shuffled copy of a list (Fisher–Yates).
 *
 * @param list - The entries.
 * @param random - The random source.
 * @returns The same entries in a random order.
 */
function shuffled<T>(list: readonly T[], random: Random): T[] {
  const result = [...list];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    const here = result[index];
    const there = result[other];
    if (here !== undefined && there !== undefined) {
      result[index] = there;
      result[other] = here;
    }
  }
  return result;
}

/**
 * A fresh game: ten tier-1 items, 4 + 3 + 3 over the chains, in random cells.
 *
 * @param random - The random source (`Math.random`, or {@link seededRandom} for a fixed board).
 * @returns The opening game, nothing found.
 * @example
 * ```ts
 * const game = newGame(seededRandom(FIRST_BOARD_SEED));
 * game.cells.filter(Boolean).length; // 10
 * ```
 */
export function newGame(random: Random): Game {
  // Fill the bag: the opening counts, dealt to the chains in a random order.
  const counts = shuffled(OPENING_COUNTS, random);
  const bag = CHAINS.flatMap((chain, index) =>
    Array.from({ length: counts[index] ?? 0 }, (): Item => ({ chain, tier: 1 }))
  );

  // Draw a random cell for each item of the bag.
  const places = shuffled(
    Array.from({ length: CELL_COUNT }, (_, index) => index),
    random
  ).slice(0, bag.length);

  // Lay the board out row by row: an item where one was placed, empty elsewhere.
  const cells = Array.from({ length: CELL_COUNT }, (_, index): Cell => {
    const place = places.indexOf(index);
    return place === -1 ? undefined : bag[place];
  });
  return { cells, found: NONE_FOUND };
}

/**
 * A game on a board that is already dealt, nothing found yet: how the island picks up the board the
 * page was built with.
 *
 * @param cells - The board, row by row.
 * @returns The game.
 * @example
 * ```ts
 * const game = gameFrom([parseItem("note-1"), undefined, parseItem("note-1")]);
 * hasMove(game.cells); // true
 * ```
 */
export function gameFrom(cells: readonly Cell[]): Game {
  return { cells, found: NONE_FOUND };
}

/**
 * Whether two cells hold identical items that can still merge.
 *
 * @param first - One cell.
 * @param second - The other cell.
 * @returns True for the same chain and tier, below tier 3.
 * @example
 * ```ts
 * canMerge({ chain: "key", tier: 1 }, { chain: "key", tier: 1 }); // true
 * canMerge({ chain: "key", tier: 1 }, { chain: "note", tier: 1 }); // false
 * ```
 */
export function canMerge(first: Cell, second: Cell): boolean {
  return (
    first !== undefined &&
    second !== undefined &&
    first.chain === second.chain &&
    first.tier === second.tier &&
    first.tier < TOP_TIER
  );
}

/**
 * Whether an item can be picked up, dragged or moved: everything but a finished clue.
 *
 * @param cell - A cell.
 * @returns True for an item below tier 3.
 * @example
 * ```ts
 * isMovable({ chain: "photo", tier: 3 }); // false: it waits for its slot
 * ```
 */
export function isMovable(cell: Cell): boolean {
  return cell !== undefined && cell.tier < TOP_TIER;
}

/**
 * A copy of the board with one cell changed.
 *
 * @param cells - The board.
 * @param index - The cell to change.
 * @param item - Its new item; without one the cell becomes empty.
 * @returns The new board.
 */
function place(cells: readonly Cell[], index: number, item?: Item): Cell[] {
  return cells.map((cell, at) => (at === index ? item : cell));
}

/**
 * Merge the item in `from` onto its twin in `to`.
 *
 * @param game - The game.
 * @param from - The cell of the item that is moved.
 * @param to - The cell of its twin, which receives the merged item.
 * @returns The game with the next-tier item in `to` and `from` empty, or `undefined` when the two
 *   cells cannot merge.
 * @example
 * ```ts
 * const next = merge(game, 0, 6);
 * next?.cells[6]; // { chain: "key", tier: 2 } when both cells held a tier-1 key
 * ```
 */
export function merge(game: Game, from: number, to: number): Game | undefined {
  const target = game.cells[to];
  const isBlocked = from === to || target === undefined || !canMerge(game.cells[from], target);
  if (isBlocked) return undefined;
  const merged: Item = { chain: target.chain, tier: NEXT_TIER[target.tier] };
  return { ...game, cells: place(place(game.cells, from), to, merged) };
}

/**
 * Move an item into an empty cell.
 *
 * @param game - The game.
 * @param from - The cell of the item.
 * @param to - An empty cell.
 * @returns The game with the item moved, or `undefined` when `from` holds nothing movable or `to` is
 *   taken.
 * @example
 * ```ts
 * move(game, 0, 7)?.cells[7]; // the item that was in cell 0
 * ```
 */
export function move(game: Game, from: number, to: number): Game | undefined {
  const source = game.cells[from];
  const isTaken = game.cells[to] !== undefined;
  const cannotMove = from === to || source === undefined || !isMovable(source) || isTaken;
  if (cannotMove) return undefined;
  return { ...game, cells: place(place(game.cells, from), to, source) };
}

/**
 * Whether the board holds at least one pair that can merge.
 *
 * @param cells - The board.
 * @returns True when a move that merges exists.
 * @example
 * ```ts
 * hasMove(newGame(Math.random).cells); // true: the opening always has pairs
 * ```
 */
export function hasMove(cells: readonly Cell[]): boolean {
  return cells.some((cell, index) =>
    cells.some((other, at) => at > index && canMerge(cell, other))
  );
}

/**
 * Chains that still need items: not found, and with no finished clue waiting on the board.
 *
 * @param game - The game.
 * @returns The open chains.
 */
function openChains(game: Game): Chain[] {
  const hasFinishedClue = (chain: Chain): boolean =>
    game.cells.some(cell => cell?.chain === chain && cell.tier === TOP_TIER);
  return CHAINS.filter(chain => !game.found[chain] && !hasFinishedClue(chain));
}

/**
 * Drop one tier-1 item of an open chain into a random empty cell. A chain with an odd number of
 * tier-1 items is preferred, so the new item completes a pair.
 *
 * @param game - The game.
 * @param random - The random source.
 * @returns The new game and the cell that received the item, or `undefined` when no chain is open or
 *   no cell is empty.
 */
function dropOne(game: Game, random: Random): { game: Game; index: number } | undefined {
  // Read the board: the chains that still need items and the cells that are empty.
  const open = openChains(game);
  const empty = game.cells.flatMap((cell, index) => (cell === undefined ? [index] : []));

  // Prefer a chain whose tier-1 items are odd in number, so the new item completes a pair.
  const tierOnes = (chain: Chain): number =>
    game.cells.filter(cell => cell?.chain === chain && cell.tier === 1).length;
  const odd = open.filter(chain => tierOnes(chain) % 2 === 1);

  // Pick the cell, then the chain, and place the item; nothing drops without both.
  const index = pick(empty, random);
  const chain = pick(odd.length > 0 ? odd : open, random);
  if (index === undefined || chain === undefined) return undefined;
  return { game: { ...game, cells: place(game.cells, index, { chain, tier: 1 }) }, index };
}

/**
 * Drop items only while the board has no pair, so play never gets stuck. Used after a clue is
 * collected.
 *
 * @param game - The game.
 * @param random - The random source.
 * @returns The game with a pair (or with no open chain left) and the cells that were filled.
 * @example
 * ```ts
 * keepPlayable(gameFrom([parseItem("note-1"), parseItem("note-1")]), seededRandom(1)).dropped; // []: the notes still pair
 * ```
 */
export function keepPlayable(game: Game, random: Random): Refill {
  let current = game;
  const dropped: number[] = [];
  while (!hasMove(current.cells)) {
    const drop = dropOne(current, random);
    if (drop === undefined) break;
    current = drop.game;
    dropped.push(drop.index);
  }
  return { game: current, dropped };
}

/**
 * The refill after a merge: one tier-1 item drops into an empty cell, then more until a pair exists.
 *
 * @param game - The game right after a merge.
 * @param random - The random source.
 * @returns The refilled game and the cells that were filled, in drop order.
 * @example
 * ```ts
 * refill(gameFrom([parseItem("key-1"), parseItem("key-1"), undefined]), seededRandom(1)).dropped; // [2]: the one empty cell
 * ```
 */
export function refill(game: Game, random: Random): Refill {
  const first = dropOne(game, random);
  if (first === undefined) return { game, dropped: [] };
  const rest = keepPlayable(first.game, random);
  return { game: rest.game, dropped: [first.index, ...rest.dropped] };
}

/**
 * Collect a finished clue into its slot of the case list.
 *
 * @param game - The game.
 * @param index - The cell of a tier-3 item.
 * @returns The game with the cell empty and the clue's chain found, or `undefined` when the cell holds
 *   no finished clue.
 * @example
 * ```ts
 * collect(game, 6)?.found.key; // true when cell 6 held the locked box
 * ```
 */
export function collect(game: Game, index: number): Game | undefined {
  const clue = game.cells[index];
  if (clue === undefined || clue.tier !== TOP_TIER) return undefined;
  return {
    cells: place(game.cells, index),
    found: { ...game.found, [clue.chain]: true }
  };
}

/**
 * How many clues are found.
 *
 * @param game - The game.
 * @returns 0 to 3.
 * @example
 * ```ts
 * foundCount(newGame(Math.random)); // 0
 * ```
 */
export function foundCount(game: Game): number {
  return CHAINS.filter(chain => game.found[chain]).length;
}

/**
 * Whether the game is won: all three clues found.
 *
 * @param game - The game.
 * @returns True once every chain is found.
 * @example
 * ```ts
 * isWon(newGame(Math.random)); // false
 * ```
 */
export function isWon(game: Game): boolean {
  return CHAINS.every(chain => game.found[chain]);
}

/**
 * Where a navigation key moves the focus on the board: arrows step within the 5 × 4 grid and stop at
 * its edges, Home and End jump to the ends of the row.
 *
 * @param index - The focused cell.
 * @param key - `KeyboardEvent.key`.
 * @returns The cell to focus (the same one at an edge), or `undefined` for any other key.
 * @example
 * ```ts
 * nextCell(7, "ArrowDown"); // 12
 * nextCell(4, "ArrowRight"); // 4: the row ends here
 * ```
 */
export function nextCell(index: number, key: string): number | undefined {
  const column = index % COLUMNS;
  switch (key) {
    case "ArrowLeft": {
      return column > 0 ? index - 1 : index;
    }
    case "ArrowRight": {
      return column < COLUMNS - 1 ? index + 1 : index;
    }
    case "ArrowUp": {
      return index >= COLUMNS ? index - COLUMNS : index;
    }
    case "ArrowDown": {
      return index < CELL_COUNT - COLUMNS ? index + COLUMNS : index;
    }
    case "Home": {
      return index - column;
    }
    case "End": {
      return index - column + COLUMNS - 1;
    }
    default: {
      return undefined;
    }
  }
}

/**
 * The code of an item in the board markup (`data-item`).
 *
 * @param item - An item.
 * @returns `<chain>-<tier>`, such as `note-2`.
 * @example
 * ```ts
 * itemCode({ chain: "note", tier: 2 }); // "note-2"
 * ```
 */
export function itemCode(item: Item): string {
  return `${item.chain}-${item.tier}`;
}

/**
 * Narrow a number to a tier.
 *
 * @param value - Any number.
 * @returns True for 1, 2 or 3.
 */
function isTier(value: number): value is Tier {
  return value === 1 || value === 2 || value === TOP_TIER;
}

/**
 * Read an item code of the board markup back into an item.
 *
 * @param code - A `data-item` value, or `undefined` for an empty cell.
 * @returns The item, or `undefined` when the code names no item.
 * @example
 * ```ts
 * parseItem("key-3"); // { chain: "key", tier: 3 }
 * ```
 */
export function parseItem(code: string | undefined): Item | undefined {
  const [name, tierText] = code?.split("-") ?? [];
  const chain = CHAINS.find(each => each === name);
  const tier = Number(tierText);
  return chain === undefined || !isTier(tier) ? undefined : { chain, tier };
}

/**
 * The key of an item's name in the string table.
 *
 * @param item - An item.
 * @returns The `game.items` key, such as `note2`.
 * @example
 * ```ts
 * t("en").game.items[itemKey({ chain: "note", tier: 2 })]; // "Folded note"
 * ```
 */
export function itemKey(item: Item): ItemKey {
  return `${item.chain}${item.tier}`;
}

/**
 * The 256 px art of an item.
 *
 * @param item - An item.
 * @returns Its URL under `public/`.
 * @example
 * ```ts
 * clueArt({ chain: "key", tier: 1 }); // "/media/clues/key-1-plain-key-256.webp"
 * ```
 */
export function clueArt(item: Item): string {
  return `${CLUE_FOLDER}${CLUE_ART[item.chain][item.tier]}-256.webp`;
}

/**
 * Fill the `{name}` slots of a board string.
 *
 * @param template - A string from the table, such as `"{n} of 3 clues found"`.
 * @param values - The value of each slot.
 * @returns The string with every known slot filled; unknown slots stay as written.
 * @example
 * ```ts
 * fillSlots("Merged: {item}.", { item: "Key ring" }); // "Merged: Key ring."
 * ```
 */
export function fillSlots(template: string, values: Record<string, string | number>): string {
  return template.replaceAll(/\{(\w+)\}/g, (slot, name: string) => String(values[name] ?? slot));
}
