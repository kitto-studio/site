import { describe, expect, it } from "vitest";
import {
  CELL_COUNT,
  type Cell,
  CHAINS,
  type Chain,
  canMerge,
  collect,
  type Found,
  type Game,
  hasMove,
  type Item,
  isWon,
  keepPlayable,
  merge,
  move,
  newGame,
  nextCell,
  parseItem,
  type Random,
  refill,
  seededRandom,
  type Tier
} from "../../src/lib/merge";

/** Shorthand for an item. */
const item = (chain: Chain, tier: Tier): Item => ({ chain, tier });

/** Nothing found yet. */
const NONE_FOUND: Found = { note: false, key: false, photo: false };

/** A game whose board holds `placed` (cell index → item) and is otherwise empty. */
function gameWith(placed: Record<number, Item>, found: Found = NONE_FOUND): Game {
  const cells: Cell[] = Array.from({ length: CELL_COUNT }, (_, index) => placed[index]);
  return { cells, found };
}

/** The items on the board, ignoring empty cells. */
const itemsOf = (game: Game): Item[] => game.cells.filter(cell => cell !== undefined);

/** Every pair of cells that can merge, as `[from, to]`. */
function pairsOf(game: Game): Array<[number, number]> {
  const pairs: Array<[number, number]> = [];
  for (let from = 0; from < CELL_COUNT; from += 1) {
    for (let to = from + 1; to < CELL_COUNT; to += 1) {
      if (canMerge(game.cells[from], game.cells[to])) pairs.push([from, to]);
    }
  }
  return pairs;
}

/**
 * One move of the island, in its order: merge, refill (the new tier 3 still waits on the board),
 * then collect the tier 3 and keep the board playable.
 */
function playMerge(game: Game, from: number, to: number, random: Random): Game {
  const merged = merge(game, from, to);
  if (merged === undefined) throw new Error(`no merge ${from} -> ${to}`);
  const refilled = refill(merged, random).game;
  const collected = collect(refilled, to);
  return collected === undefined ? refilled : keepPlayable(collected, random).game;
}

describe("newGame", () => {
  // Catches: a wrong opening board (count, tiers or the 4 + 3 + 3 split the spawn rule relies on).
  it("starts with ten tier-1 items, 4 + 3 + 3 over the chains, nothing found", () => {
    const game = newGame(seededRandom(11));
    const items = itemsOf(game);

    expect(game.cells).toHaveLength(CELL_COUNT);
    expect(items).toHaveLength(10);
    expect(items.every(each => each.tier === 1)).toBe(true);
    const counts = CHAINS.map(chain => items.filter(each => each.chain === chain).length);
    expect(counts.toSorted()).toEqual([3, 3, 4]);
    expect(game.found).toEqual(NONE_FOUND);
  });

  // Catches: a seed that is ignored, so the board drawn at build changes on every build.
  it("draws the same board from the same seed and another from another seed", () => {
    expect(newGame(seededRandom(7))).toEqual(newGame(seededRandom(7)));
    expect(newGame(seededRandom(7)).cells).not.toEqual(newGame(seededRandom(8)).cells);
  });
});

describe("canMerge", () => {
  // Catches: chains or tiers mixed up in the rule, or the top tier merging into a tier 4.
  it("pairs only identical items below tier 3", () => {
    expect(canMerge(item("note", 1), item("note", 1))).toBe(true);
    expect(canMerge(item("key", 2), item("key", 2))).toBe(true);
    expect(canMerge(item("note", 1), item("key", 1))).toBe(false);
    expect(canMerge(item("photo", 1), item("photo", 2))).toBe(false);
    expect(canMerge(item("photo", 3), item("photo", 3))).toBe(false);
    expect(canMerge(item("note", 1), undefined)).toBe(false);
  });
});

describe("merge", () => {
  // Catches: the new item landing in the source cell, the source kept, or a tier skipped.
  it("turns two equal tier-1 items into one tier-2 in the target cell and empties the source", () => {
    const game = gameWith({ 0: item("key", 1), 6: item("key", 1), 9: item("note", 1) });
    const merged = merge(game, 0, 6);

    expect(merged?.cells[6]).toEqual(item("key", 2));
    expect(merged?.cells[0]).toBeUndefined();
    expect(merged?.cells[9]).toEqual(item("note", 1));
    expect(itemsOf(game)).toHaveLength(3);
  });

  // Catches: a merge of different chains, or a refused merge that still changes the board.
  it("refuses items of different chains and leaves the board as it was", () => {
    const game = gameWith({ 0: item("key", 1), 1: item("photo", 1) });

    expect(merge(game, 0, 1)).toBeUndefined();
    expect(merge(game, 0, 0)).toBeUndefined();
    expect(game.cells[0]).toEqual(item("key", 1));
  });

  // Catches: a finished clue that can be merged or moved again instead of being collected.
  it("keeps a tier 3 out of play until it is collected into its slot", () => {
    const game = gameWith({
      0: item("photo", 2),
      1: item("photo", 2),
      2: item("photo", 3),
      3: item("note", 1)
    });
    const merged = merge(game, 0, 1);
    if (merged === undefined) throw new Error("expected a merge");

    expect(merged.cells[1]).toEqual(item("photo", 3));
    expect(merge(merged, 1, 2)).toBeUndefined();
    expect(move(merged, 1, 5)).toBeUndefined();
    expect(collect(merged, 3)).toBeUndefined();

    const collected = collect(merged, 1);
    expect(collected?.cells[1]).toBeUndefined();
    expect(collected?.found).toEqual({ note: false, key: false, photo: true });
  });
});

describe("move", () => {
  // Catches: a move that overwrites another item or copies instead of moving.
  it("moves an item into an empty cell only", () => {
    const game = gameWith({ 0: item("note", 2), 1: item("key", 1) });

    const moved = move(game, 0, 7);
    expect(moved?.cells[7]).toEqual(item("note", 2));
    expect(moved?.cells[0]).toBeUndefined();
    expect(move(game, 0, 1)).toBeUndefined();
    expect(move(game, 4, 7)).toBeUndefined();
  });
});

describe("refill", () => {
  // Catches: a refill that drops nothing, several items, or a tier above 1 when a pair is left.
  it("drops one tier-1 item into an empty cell after a merge", () => {
    const game = gameWith({ 0: item("note", 1), 1: item("note", 1), 2: item("key", 2) });
    const { game: next, dropped } = refill(game, seededRandom(3));

    expect(dropped).toHaveLength(1);
    const [index] = dropped;
    if (index === undefined) throw new Error("expected a drop");
    expect(game.cells[index]).toBeUndefined();
    expect(next.cells[index]?.tier).toBe(1);
    expect(itemsOf(next)).toHaveLength(4);
  });

  // Catches: a drop that leaves the board without a pair, or one of a chain that is already done.
  it("drops items of open chains only, until a pair exists", () => {
    const found: Found = { note: true, key: false, photo: false };
    const game = gameWith({ 0: item("photo", 3), 5: item("key", 2), 6: item("note", 1) }, found);

    for (let seed = 1; seed <= 20; seed += 1) {
      const { game: next, dropped } = refill(game, seededRandom(seed));
      expect(hasMove(next.cells)).toBe(true);
      for (const index of dropped) expect(next.cells[index]).toEqual(item("key", 1));
    }
  });

  // Catches: keepPlayable dropping items onto a board that still has a pair.
  it("keepPlayable drops nothing while a pair is left", () => {
    const game = gameWith({ 0: item("key", 1), 1: item("key", 1) });

    expect(keepPlayable(game, seededRandom(1))).toEqual({ game, dropped: [] });
  });

  // Catches: a board that stalls (no pair and not won) or a game that can never be won.
  it("never leaves a dead board: 200 seeded games always have a move and end won", () => {
    for (let seed = 1; seed <= 200; seed += 1) {
      const random = seededRandom(seed);
      let game = newGame(random);
      let steps = 0;
      while (!isWon(game) && steps < 400) {
        expect(hasMove(game.cells)).toBe(true);
        const pairs = pairsOf(game);
        const [from, to] = pairs[Math.floor(random() * pairs.length)] ?? [0, 0];
        game = playMerge(game, from, to, random);
        steps += 1;
      }
      expect(isWon(game)).toBe(true);
    }
  });
});

describe("isWon", () => {
  // Catches: a win declared before the third clue, or never declared.
  it("is won only once all three clues are found", () => {
    let game = gameWith({ 0: item("note", 3), 1: item("key", 3), 2: item("photo", 3) });
    for (const index of [0, 1]) {
      game = collect(game, index) ?? game;
      expect(isWon(game)).toBe(false);
    }
    game = collect(game, 2) ?? game;

    expect(isWon(game)).toBe(true);
  });
});

describe("nextCell", () => {
  // Catches: arrows wrapping into the next row, leaving the board, or Home/End missing the row.
  it("walks the 5 x 4 grid, stops at its edges and jumps to the row ends", () => {
    expect(nextCell(7, "ArrowRight")).toBe(8);
    expect(nextCell(7, "ArrowDown")).toBe(12);
    expect(nextCell(7, "ArrowLeft")).toBe(6);
    expect(nextCell(7, "ArrowUp")).toBe(2);
    expect(nextCell(4, "ArrowRight")).toBe(4);
    expect(nextCell(5, "ArrowLeft")).toBe(5);
    expect(nextCell(2, "ArrowUp")).toBe(2);
    expect(nextCell(17, "ArrowDown")).toBe(17);
    expect(nextCell(7, "Home")).toBe(5);
    expect(nextCell(7, "End")).toBe(9);
    expect(nextCell(7, "Enter")).toBeUndefined();
  });
});

describe("parseItem", () => {
  // Catches: the island reading the build's board wrongly, or inventing an item from bad markup.
  it("reads the item codes of the board markup and nothing else", () => {
    expect(parseItem("note-2")).toEqual(item("note", 2));
    expect(parseItem("photo-3")).toEqual(item("photo", 3));
    expect(parseItem("note-4")).toBeUndefined();
    expect(parseItem("memory-1")).toBeUndefined();
    expect(parseItem(undefined)).toBeUndefined();
  });
});
