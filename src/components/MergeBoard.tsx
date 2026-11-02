/**
 * @file MergeBoard (design-context §6 F7, F8, G merge cell and case list; §7): a small playable piece
 * of A Memory Missing. A taped paper sheet holds a 5 × 4 board of recessed cells with the first board
 * already dealt, so the page is complete without script; beside it the case list shows what each chain
 * becomes, the missing clues as dashed slots, then the memory. The `merge-board` island plays it: drag,
 * tap-tap and keyboard, the pop and paper confetti, the refill, the win.
 *
 * Renders standalone, with no outer margin or width: the page places it in its grid. One board per
 * page (its ids are fixed).
 */
import type { VNode } from "preact";
import { t } from "../i18n";
import type { Locale } from "../i18n/languages";
import type { BoardStrings, ItemStrings } from "../i18n/types";
import { writeBoardStrings } from "../lib/board-strings";
import {
  CELL_COUNT,
  type Cell,
  CHAINS,
  type Chain,
  clueArt,
  FIRST_BOARD_SEED,
  fillSlots,
  itemCode,
  itemKey,
  MEMORY_ART,
  newGame,
  seededRandom
} from "../lib/merge";
import { Button } from "./Button";

/** Element ids the board's labels point at. */
const IDS = {
  title: "merge-board-title",
  keys: "merge-board-keys",
  caseTitle: "merge-board-case",
  winTitle: "merge-board-win"
};

/** The board's cells by position, row by row: a cell is known by where it is. */
const CELL_POSITIONS = Array.from({ length: CELL_COUNT }, (_, index) => index);

/** Size of the clue thumbnails, px. */
const THUMB_SIZE = 256;

/** Size of the full memory art, px. */
const FULL_SIZE = 1024;

/** MergeBoard props. */
export type MergeBoardProps = {
  /** Page locale. */
  locale: Locale;
};

/** Props of one board cell. */
type BoardCellProps = {
  /** Cell index, row by row. */
  index: number;
  /** The item dealt into it, if any. */
  cell: Cell;
  /** Board strings. */
  board: BoardStrings;
  /** Item names. */
  items: ItemStrings;
};

/**
 * One recessed cell of the board, with its item when it holds one. A button: pressed while its item
 * is picked up. The first cell is the board's tab stop; the island moves it (roving focus).
 *
 * @param props - Cell props.
 * @param props.index - Cell index.
 * @param props.cell - Its item.
 * @param props.board - Board strings.
 * @param props.items - Item names.
 * @returns The cell button.
 */
function BoardCell({ index, cell, board, items }: BoardCellProps): VNode {
  return (
    <button
      type="button"
      data-cell={index}
      tabIndex={index === 0 ? 0 : -1}
      aria-label={cell === undefined ? board.empty : items[itemKey(cell)]}
      aria-pressed="false"
    >
      {cell === undefined ? undefined : (
        <span data-item={itemCode(cell)}>
          <img
            src={clueArt(cell)}
            alt=""
            width={THUMB_SIZE}
            height={THUMB_SIZE}
            draggable={false}
            loading="lazy"
            decoding="async"
          />
        </span>
      )}
    </button>
  );
}

/** Props of one chain of the case list. */
type CaseChainProps = {
  /** The chain. */
  chain: Chain;
  /** Board strings. */
  board: BoardStrings;
  /** Item names. */
  items: ItemStrings;
};

/**
 * One chain of the case list: tier 1 › tier 2 › the missing clue as a dashed slot.
 *
 * @param props - Chain props.
 * @param props.chain - The chain.
 * @param props.board - Board strings.
 * @param props.items - Item names.
 * @returns A case list entry.
 */
function CaseChain({ chain, board, items }: CaseChainProps): VNode {
  const clue = { chain, tier: 3 } as const;
  return (
    <li data-case-chain>
      {([1, 2] as const).map(tier => [
        <span key={`mini-${tier}`} data-case-mini aria-hidden="true">
          <img
            src={clueArt({ chain, tier })}
            alt=""
            width={THUMB_SIZE}
            height={THUMB_SIZE}
            loading="lazy"
            decoding="async"
          />
        </span>,
        <span key={`arrow-${tier}`} data-case-arrow aria-hidden="true" />
      ])}
      <span
        data-case-goal={chain}
        role="img"
        aria-label={fillSlots(board.missing, { item: items[itemKey(clue)] })}
      >
        <img
          src={clueArt(clue)}
          alt=""
          width={THUMB_SIZE}
          height={THUMB_SIZE}
          loading="lazy"
          decoding="async"
        />
      </span>
    </li>
  );
}

/**
 * The shuffle mark of the New board button, drawn for this site.
 *
 * @returns A decorative 18 px icon in the text colour.
 */
function ShuffleIcon(): VNode {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M4 7h3c2.5 0 3.5 1.6 5 5s2.5 5 5 5h3" />
      <path d="M4 17h3c1.4 0 2.3-.5 3-1.4M20 7h-3c-1.4 0-2.3.5-3 1.4" />
      <path d="m17.5 4.5 2.5 2.5-2.5 2.5M17.5 14.5l2.5 2.5-2.5 2.5" />
    </svg>
  );
}

/**
 * Render the merge board section: heading and lead, the taped board with its win overlay, and the
 * case list with the progress line and the New board button. The section carries the strings the
 * island writes after the first paint (`data-board-strings`), so the client needs no string table.
 *
 * @param props - MergeBoard props.
 * @param props.locale - Page locale.
 * @returns The board section, an island root (`data-island="merge-board"`).
 * @example
 * ```tsx
 * <div data-container>
 *   <MergeBoard locale={locale} />
 * </div>
 * ```
 */
export function MergeBoard({ locale }: MergeBoardProps): VNode {
  const { board, items } = t(locale).game;
  const { cells } = newGame(seededRandom(FIRST_BOARD_SEED));
  return (
    <section
      data-component="merge-board"
      data-island="merge-board"
      data-board-strings={writeBoardStrings(board, items)}
      aria-labelledby={IDS.title}
    >
      <div data-board-text>
        <h2 id={IDS.title}>{board.title}</h2>
        <p data-board-lead>{board.lead}</p>
      </div>

      <div data-board-stage>
        <div data-board-sheet>
          <span data-board-tape="left" aria-hidden="true" />
          <span data-board-tape="right" aria-hidden="true" />
          <fieldset data-board-grid aria-labelledby={IDS.title} aria-describedby={IDS.keys}>
            {CELL_POSITIONS.map(index => (
              <BoardCell
                key={index}
                index={index}
                cell={cells[index]}
                board={board}
                items={items}
              />
            ))}
          </fieldset>
          <fieldset data-board-win aria-labelledby={IDS.winTitle} hidden>
            <div data-board-orb>
              <img
                src={MEMORY_ART.full}
                srcset={`${MEMORY_ART.thumb} ${THUMB_SIZE}w, ${MEMORY_ART.full} ${FULL_SIZE}w`}
                sizes="230px"
                alt=""
                width={FULL_SIZE}
                height={FULL_SIZE}
                loading="lazy"
                decoding="async"
              />
            </div>
            <h3 id={IDS.winTitle}>{board.winTitle}</h3>
            <p>{board.winText}</p>
            <Button data-board-again="">{board.again}</Button>
          </fieldset>
          <div data-board-fx aria-hidden="true" />
        </div>
        <p id={IDS.keys} data-visually-hidden>
          {board.keys}
        </p>
        <p data-board-live data-visually-hidden aria-live="polite" />
      </div>

      <div data-board-side>
        <h3 id={IDS.caseTitle}>{board.caseTitle}</h3>
        <ul data-board-case aria-labelledby={IDS.caseTitle}>
          {CHAINS.map(chain => (
            <CaseChain key={chain} chain={chain} board={board} items={items} />
          ))}
          <li data-case-memory>
            <span
              data-case-goal="memory"
              role="img"
              aria-label={fillSlots(board.missing, { item: items.memory })}
            >
              <img
                src={MEMORY_ART.thumb}
                alt=""
                width={THUMB_SIZE}
                height={THUMB_SIZE}
                loading="lazy"
                decoding="async"
              />
            </span>
            <p data-board-progress>{fillSlots(board.progress, { n: 0 })}</p>
          </li>
        </ul>
        <div data-board-actions>
          <Button variant="paper" data-board-new="">
            <ShuffleIcon />
            <span>{board.newBoard}</span>
          </Button>
          <p data-board-hint>
            <span data-hint="touch">{board.hint}</span>
            <span data-hint="mouse">{board.hintMouse}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
