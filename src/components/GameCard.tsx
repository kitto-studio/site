/**
 * @file GameCard (design-context §6 A3): one game of the catalog. The key art as a printed photo
 * taped to the sheet, then the name, genre, premise, release status and the one orange button.
 * The print, the name and the button all lead to the game page in the page's locale; hovering
 * either link lifts the print.
 */
import type { VNode } from "preact";
import { t } from "../i18n";
import type { Locale } from "../i18n/languages";
import { typeset } from "../lib/typography";
import { urls } from "../routes";
import { Button } from "./Button";
import { DotMark } from "./DotMark";

/** GameCard props. */
export type GameCardProps = {
  /** Page locale: strings and the link to the game page. */
  locale: Locale;
  /** Id of the game name heading, for the `aria-labelledby` of the sheet around it. */
  headingId: string;
};

/** Intrinsic size of the game's key art, px. */
const WARD_SIZE = { width: 1448, height: 1086 };

/**
 * Render the A Memory Missing card.
 *
 * @param props - GameCard props.
 * @param props.locale - Page locale.
 * @param props.headingId - Id of the game name heading.
 * @returns The print beside the card copy.
 * @example
 * ```tsx
 * <PaperSheet labelledBy="games-memory-missing">
 *   <GameCard locale="en" headingId="games-memory-missing" />
 * </PaperSheet>
 * ```
 */
export function GameCard({ locale, headingId }: GameCardProps): VNode {
  const strings = t(locale);
  const card = strings.games.card;
  const text = (value: string): string => typeset(value, locale);
  const gameUrl = urls.toUrl("memoryMissing", { lang: locale });
  return (
    <div data-component="game-card">
      {/* The print repeats the name link for the pointer: named by the heading, skipped by Tab. */}
      <a href={gameUrl} data-card-art tabIndex={-1} aria-labelledby={headingId}>
        <span data-card-print>
          <span data-card-tape="left" />
          <span data-card-tape="right" />
          <img
            src="/media/game/ward.webp"
            alt=""
            width={WARD_SIZE.width}
            height={WARD_SIZE.height}
            decoding="async"
          />
        </span>
      </a>
      <div data-card-copy>
        <h2 id={headingId}>
          <a href={gameUrl} data-link-alone>
            {strings.game.name}
          </a>
        </h2>
        <p data-card-genre>{text(card.genre)}</p>
        <p>{text(card.teaser)}</p>
        <p data-card-status>
          <DotMark />
          <span>{text(card.status)}</span>
        </p>
        <p data-card-action>
          <Button href={gameUrl}>{text(card.cta)}</Button>
        </p>
      </div>
    </div>
  );
}
