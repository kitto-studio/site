import { describe, expect, it } from "vitest";
import { t } from "../../src/i18n";
import { readBoardStrings, writeBoardStrings } from "../../src/lib/board-strings";

/** The English board strings and item names. */
const { board, items } = t("en").game;

describe("board strings", () => {
  // Catches: the board writing the strings in a shape the island does not read back, so cells lose
  // their names and the live region stays silent.
  it("reads back every string the board wrote", () => {
    const strings = readBoardStrings(writeBoardStrings(board, items));

    expect(strings?.items).toEqual(items);
    expect(strings?.board).toEqual({
      empty: board.empty,
      picked: board.picked,
      merged: board.merged,
      found: board.found,
      missing: board.missing,
      progress: board.progress,
      winTitle: board.winTitle,
      winText: board.winText
    });
  });

  // Catches: the island throwing on a stale or missing attribute, or announcing «undefined» when a
  // string is missing, instead of leaving the server-rendered board as it is.
  it("gives nothing for a missing, broken or incomplete attribute", () => {
    const { memory: _memory, ...withoutMemory } = items;

    expect(readBoardStrings(undefined)).toBeUndefined();
    expect(readBoardStrings("{")).toBeUndefined();
    expect(readBoardStrings("null")).toBeUndefined();
    expect(readBoardStrings(JSON.stringify({ board }))).toBeUndefined();
    expect(readBoardStrings(JSON.stringify({ board, items: withoutMemory }))).toBeUndefined();
    expect(
      readBoardStrings(JSON.stringify({ board: { ...board, empty: 1 }, items }))
    ).toBeUndefined();
  });
});
