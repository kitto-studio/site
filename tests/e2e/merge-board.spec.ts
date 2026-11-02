/**
 * @file Merge board (U6, design context §4, §6 F7–F8, §7): a 5×4 board of 10 tier-1 clues; drag an
 * item onto its twin (mouse), tap-tap (touch) or use the keyboard (arrows, Enter/Space, Esc).
 * Finishing the three chains wins the memory orb with «Play again». Every path is played to a win.
 */
import type { Page } from "@playwright/test";
import { expect, onlyForm, test, visit } from "./_fixtures";

/** One move on the board, from a cell to a cell. */
type Mover = (from: number, to: number) => Promise<void>;

/** Board width in cells. */
const COLUMNS = 5;

/** Longest game the test allows (a win needs 9 merges plus the refills). */
const MAX_MOVES = 120;

/**
 * A cell of the board.
 *
 * @param page - The page.
 * @param index - Cell index, row by row.
 * @returns The cell button.
 */
function cell(page: Page, index: number): import("@playwright/test").Locator {
  return page.locator(`[data-board-grid] [data-cell="${index}"]`);
}

/**
 * Read the board: the item code of every cell (`note-1`), "" for an empty cell.
 *
 * @param page - The page.
 * @returns One code per cell.
 */
function readBoard(page: Page): Promise<string[]> {
  return page
    .locator("[data-board-grid] [data-cell]")
    .evaluateAll(cells =>
      cells.map(each => each.querySelector<HTMLElement>("[data-item]")?.dataset.item ?? "")
    );
}

/**
 * Find two twins that can merge (same chain and tier, below the top tier).
 *
 * @param cells - The board.
 * @returns The two cell indexes, or undefined.
 */
function findTwins(cells: readonly string[]): [number, number] | undefined {
  for (const [index, code] of cells.entries()) {
    if (code === "" || code.endsWith("-3")) continue;
    const twin = cells.findIndex((other, at) => at > index && other === code);
    if (twin !== -1) return [index, twin];
  }
  return undefined;
}

/**
 * Whether two board reads are the same.
 *
 * @param first - One read.
 * @param second - The other read.
 * @returns True when every cell holds the same code.
 */
function isSame(first: readonly string[], second: readonly string[]): boolean {
  return first.every((code, index) => code === second[index]);
}

/**
 * Play merges with one input method until the memory orb is won.
 *
 * @param page - The page.
 * @param move - The input method.
 * @returns How many merges it took.
 */
async function playToWin(page: Page, move: Mover): Promise<number> {
  const win = page.locator("[data-board-win]");
  let merges = 0;
  for (let step = 0; step < MAX_MOVES; step += 1) {
    if (await win.isVisible()) break;
    const before = await readBoard(page);
    const twins = findTwins(before);
    // A finished clue is waiting to fly to the case list (and maybe win): let it land first.
    const isCollecting = before.some(code => code.endsWith("-3"));
    if (twins === undefined || isCollecting) {
      await page.waitForTimeout(100);
      continue;
    }
    await move(twins[0], twins[1]);
    await expect
      .poll(async () => (await win.isVisible()) || !isSame(await readBoard(page), before))
      .toBe(true);
    merges += 1;
  }
  await expect(win).toBeVisible();
  return merges;
}

/**
 * The centre of a cell in page coordinates.
 *
 * @param page - The page.
 * @param index - Cell index.
 * @returns The centre point.
 */
async function centre(page: Page, index: number): Promise<{ x: number; y: number }> {
  const box = await cell(page, index).boundingBox();
  if (box === null) throw new Error(`cell ${index} has no box`);
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

/**
 * Drag with the mouse (pointer events) from one cell onto another.
 *
 * @param page - The page.
 * @returns The mover.
 */
function dragMover(page: Page): Mover {
  return async (from, to) => {
    const start = await centre(page, from);
    const end = await centre(page, to);
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(start.x + 12, start.y + 8, { steps: 3 });
    await page.mouse.move(end.x, end.y, { steps: 8 });
    await page.mouse.up();
  };
}

/**
 * Move the keyboard focus to a cell with the arrow keys.
 *
 * @param page - The page.
 * @param index - Target cell.
 */
async function arrowTo(page: Page, index: number): Promise<void> {
  let current = await page.evaluate(() => {
    const active = document.activeElement;
    return active instanceof HTMLElement && active.dataset.cell !== undefined
      ? Number(active.dataset.cell)
      : -1;
  });
  if (current === -1) {
    await page.locator('[data-board-grid] [data-cell][tabindex="0"]').focus();
    current = Number(
      await page.locator('[data-board-grid] [data-cell][tabindex="0"]').getAttribute("data-cell")
    );
  }
  const rows = Math.floor(index / COLUMNS) - Math.floor(current / COLUMNS);
  const columns = (index % COLUMNS) - (current % COLUMNS);
  for (let step = 0; step < Math.abs(rows); step += 1) {
    await page.keyboard.press(rows > 0 ? "ArrowDown" : "ArrowUp");
  }
  for (let step = 0; step < Math.abs(columns); step += 1) {
    await page.keyboard.press(columns > 0 ? "ArrowRight" : "ArrowLeft");
  }
  await expect(cell(page, index)).toBeFocused();
}

/**
 * Pick with Enter and put with Space, by keyboard only.
 *
 * @param page - The page.
 * @returns The mover.
 */
function keyboardMover(page: Page): Mover {
  return async (from, to) => {
    await arrowTo(page, from);
    await page.keyboard.press("Enter");
    await expect(cell(page, from)).toHaveAttribute("aria-pressed", "true");
    await arrowTo(page, to);
    await page.keyboard.press(" ");
  };
}

/**
 * Tap one cell, then the other (touch).
 *
 * @param page - The page.
 * @returns The mover.
 */
function tapMover(page: Page): Mover {
  return async (from, to) => {
    await cell(page, from).tap();
    await expect(cell(page, from)).toHaveAttribute("aria-pressed", "true");
    await cell(page, to).tap();
  };
}

/**
 * Open the game page with the board in view.
 *
 * @param page - The page.
 */
async function openBoard(page: Page): Promise<void> {
  await visit(page, "/en/games/memory-missing/");
  await page.locator("[data-board-sheet]").scrollIntoViewIfNeeded();
}

/**
 * Check the won state: orb, celebration, three clues and the memory found.
 *
 * @param page - The page.
 */
async function expectWon(page: Page): Promise<void> {
  const win = page.locator("[data-board-win]");
  await expect(win.locator("h3")).toHaveText("A memory is back.");
  await expect(page.locator("[data-board-progress]")).toContainText("3");
  for (const chain of ["note", "key", "photo", "memory"]) {
    await expect(page.locator(`[data-case-goal="${chain}"]`)).toHaveAttribute("data-found", "");
  }
  await expect(page.locator("[data-board-grid]")).toHaveAttribute("inert", "");
}

test("the first board: 20 cells, 10 tier-1 clues, case list at zero", async ({ page }) => {
  await openBoard(page);
  const board = await readBoard(page);
  expect(board).toHaveLength(20);
  expect(board.filter(code => code !== "")).toHaveLength(10);
  expect(board.every(code => code === "" || code.endsWith("-1"))).toBe(true);
  await expect(page.locator("[data-board-progress]")).toHaveText("0 of 3 clues found");
  await expect(page.locator("[data-board-case] [data-case-goal]")).toHaveCount(4);
  await expect(page.locator("[data-board-win]")).toBeHidden();
});

test.describe("desktop", () => {
  onlyForm("desktop");

  test("winnable by mouse drag", async ({ page }) => {
    await openBoard(page);
    const merges = await playToWin(page, dragMover(page));
    expect(merges).toBeGreaterThanOrEqual(9);
    await expectWon(page);
    await expect(page.locator("[data-board-win]")).toHaveScreenshot("board-won.png", {
      mask: [page.locator("[data-board-fx]")]
    });
  });

  test("winnable by keyboard; Play again starts a new board", async ({ page }) => {
    await openBoard(page);
    await page.locator('[data-board-grid] [data-cell][tabindex="0"]').focus();
    await playToWin(page, keyboardMover(page));
    await expectWon(page);
    const again = page.locator("[data-board-again]");
    await expect(again).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("[data-board-win]")).toBeHidden();
    await expect(page.locator("[data-board-progress]")).toHaveText("0 of 3 clues found");
    await expect(cell(page, 0)).toBeFocused();
    const board = await readBoard(page);
    expect(board.filter(code => code !== "")).toHaveLength(10);
  });

  test("a drag onto a different clue is refused and nothing changes", async ({ page }) => {
    await openBoard(page);
    const board = await readBoard(page);
    const from = board.findIndex(code => code !== "");
    const to = board.findIndex(code => code !== "" && code !== board[from]);
    await dragMover(page)(from, to);
    await page.waitForTimeout(300);
    expect(await readBoard(page)).toEqual(board);
  });

  test("keyboard: a clue moves to an empty cell; Esc puts a pick back", async ({ page }) => {
    await openBoard(page);
    const board = await readBoard(page);
    const from = board.findIndex(code => code !== "");
    const empty = board.indexOf("");
    await page.locator('[data-board-grid] [data-cell][tabindex="0"]').focus();
    await arrowTo(page, from);
    await page.keyboard.press("Enter");
    await expect(cell(page, from)).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("Escape");
    await expect(cell(page, from)).toHaveAttribute("aria-pressed", "false");

    await page.keyboard.press("Enter");
    await arrowTo(page, empty);
    await page.keyboard.press("Enter");
    await expect
      .poll(async () => {
        const now = await readBoard(page);
        return now[empty];
      })
      .toBe(board[from]);
    const after = await readBoard(page);
    expect(after[from]).toBe("");
  });

  test("Esc puts back a clue picked with the mouse when focus left the grid", async ({ page }) => {
    await openBoard(page);
    const board = await readBoard(page);
    const from = board.findIndex(code => code !== "");
    await cell(page, from).click();
    await expect(cell(page, from)).toHaveAttribute("aria-pressed", "true");
    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    });
    await page.keyboard.press("Escape");
    await expect(cell(page, from)).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator("[data-board-grid] [data-twin]")).toHaveCount(0);
    expect(await readBoard(page)).toEqual(board);
  });

  test("picking a clue marks its twins", async ({ page }) => {
    await openBoard(page);
    const board = await readBoard(page);
    const twins = findTwins(board);
    expect(twins).toBeDefined();
    const [from, to] = twins ?? [0, 0];
    await cell(page, from).click();
    await expect(cell(page, from)).toHaveAttribute("aria-pressed", "true");
    await expect(cell(page, to)).toHaveAttribute("data-twin", "");
    await cell(page, from).click();
    await expect(cell(page, from)).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator("[data-board-grid] [data-twin]")).toHaveCount(0);
  });

  test("New board deals a fresh opening", async ({ page }) => {
    await openBoard(page);
    await playToWinPartly(page);
    await page.locator("[data-board-new]").click();
    await expect(page.locator("[data-board-progress]")).toHaveText("0 of 3 clues found");
    const board = await readBoard(page);
    expect(board.filter(code => code !== "")).toHaveLength(10);
    expect(board.every(code => code === "" || code.endsWith("-1"))).toBe(true);
  });
});

test.describe("phone", () => {
  onlyForm("phone");

  test("winnable by tap-tap", async ({ page }) => {
    await openBoard(page);
    await playToWin(page, tapMover(page));
    await expectWon(page);
    await page.locator("[data-board-again]").tap();
    await expect(page.locator("[data-board-win]")).toBeHidden();
  });

  test("the board sits below its text and fits the phone", async ({ page }) => {
    await openBoard(page);
    const text = await page.locator("[data-board-text]").boundingBox();
    const grid = await page.locator("[data-board-grid]").boundingBox();
    expect(text && grid && grid.y > text.y).toBe(true);
    expect(grid && grid.x >= 0 && grid.x + grid.width <= 390).toBe(true);
    const box = await cell(page, 0).boundingBox();
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
  });
});

/**
 * Make one merge, so the board is not at its opening.
 *
 * @param page - The page.
 */
async function playToWinPartly(page: Page): Promise<void> {
  const before = await readBoard(page);
  const twins = findTwins(before);
  if (twins === undefined) return;
  await dragMover(page)(twins[0], twins[1]);
  await expect.poll(() => readBoard(page)).not.toEqual(before);
}

/**
 * Wait until every motion on the page has finished (drops, pops, flights, confetti).
 *
 * @param page - The page.
 */
async function motionDone(page: Page): Promise<void> {
  await expect.poll(() => page.evaluate(() => document.getAnimations().length)).toBe(0);
}

/**
 * Read what a board leaves behind: floating copies on `<body>`, lifted or hidden items, a cell with
 * two items, the drag mark on `<html>`.
 *
 * @param page - The page.
 * @returns The counts; all zero or false on a tidy board.
 */
function leftovers(page: Page): Promise<Record<string, number | boolean>> {
  return page.evaluate(() => ({
    ghosts: document.querySelectorAll("[data-board-ghost]").length,
    flights: document.querySelectorAll("[data-board-flight]").length,
    lifted: document.querySelectorAll("[data-board-grid] [data-lifted]").length,
    hidden: [...document.querySelectorAll<HTMLElement>("[data-board-grid] [data-item]")].filter(
      item => item.style.visibility === "hidden"
    ).length,
    doubled: [...document.querySelectorAll("[data-board-grid] [data-cell]")].filter(
      each => each.querySelectorAll("[data-item]").length > 1
    ).length,
    dragging: "boardDragging" in document.documentElement.dataset
  }));
}

/** A board with nothing left behind. */
const TIDY = { ghosts: 0, flights: 0, lifted: 0, hidden: 0, doubled: 0, dragging: false };

test.describe("desktop, with motion: input that races the animations", () => {
  onlyForm("desktop");
  test.use({ contextOptions: { reducedMotion: "no-preference" } });

  test("a drag released off the board floats back and leaves nothing behind", async ({ page }) => {
    await openBoard(page);
    await motionDone(page);
    const board = await readBoard(page);
    const start = await centre(
      page,
      board.findIndex(code => code !== "")
    );
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(start.x + 12, start.y + 8, { steps: 3 });
    // Over the sticky header, outside the board, then let go.
    await page.mouse.move(start.x, 20, { steps: 8 });
    await page.mouse.up();
    await motionDone(page);
    expect(await leftovers(page)).toEqual(TIDY);
    expect(await readBoard(page)).toEqual(board);
  });

  test("fast drags with no pause keep one item per cell and nothing floating", async ({ page }) => {
    await openBoard(page);
    await motionDone(page);
    for (let round = 0; round < 15; round += 1) {
      const board = await readBoard(page);
      const twins = findTwins(board);
      const from = twins?.[0] ?? board.findIndex(code => code !== "" && !code.endsWith("-3"));
      const to = round % 2 === 0 && twins ? twins[1] : board.indexOf("");
      const start = await centre(page, from);
      const end = await centre(page, to);
      await page.mouse.move(start.x, start.y);
      await page.mouse.down();
      await page.mouse.move(end.x, end.y, { steps: 2 });
      await page.mouse.up();
    }
    await motionDone(page);
    expect(await leftovers(page)).toEqual(TIDY);
  });

  test("New board while a finished clue flies to the case list starts clean", async ({ page }) => {
    await openBoard(page);
    await motionDone(page);
    const flight = page.locator("[data-board-flight]");
    for (let step = 0; step < MAX_MOVES; step += 1) {
      const board = await readBoard(page);
      const twins = findTwins(board);
      if (twins === undefined) {
        await page.waitForTimeout(100);
        continue;
      }
      await cell(page, twins[0]).click();
      await cell(page, twins[1]).click();
      // Two tier-2 twins make a finished clue, which flies to its slot.
      if (board[twins[0]]?.endsWith("-2")) break;
      await expect.poll(() => readBoard(page)).not.toEqual(board);
    }
    await expect(flight).toHaveCount(1);
    await page.locator("[data-board-new]").click();
    await expect(flight).toHaveCount(0);
    await motionDone(page);
    // The stale landing must not count the clue on the new board.
    await page.waitForTimeout(1500);
    await expect(page.locator("[data-board-progress]")).toHaveText("0 of 3 clues found");
    expect(await leftovers(page)).toEqual(TIDY);
    const board = await readBoard(page);
    expect(board.filter(code => code !== "")).toHaveLength(10);
    expect(board.every(code => code === "" || code.endsWith("-1"))).toBe(true);
  });
});
