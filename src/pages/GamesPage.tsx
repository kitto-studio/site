/**
 * @file Games catalog page (design-context §6 A3): «Our games» on the paper sky over the paper
 * band, then two still sheets: the A Memory Missing card, and an honest empty slot for the next
 * game with the gift sticker beside it. No invented games. A pointer to Support closes the page.
 *
 * Motion: the band settles once (CSS) and the gift folds up (`popup-sticker`). Without the island,
 * or with reduced motion, the page is complete and still.
 */
import type { VNode } from "preact";
import { ComingSoonSlot } from "../components/ComingSoonSlot";
import { GameCard } from "../components/GameCard";
import { PaperBand } from "../components/PaperBand";
import { PaperSheet } from "../components/PaperSheet";
import { PopupSticker } from "../components/PopupSticker";
import { t } from "../i18n";
import type { Locale } from "../i18n/languages";
import { splitSlot } from "../lib/legal";
import { typeset } from "../lib/typography";
import { urls } from "../routes";

/** GamesPage props. */
type GamesPageProps = {
  /** Page locale. */
  locale: Locale;
};

/** Ids that tie headings to their sections; the page CSS finds the sheets by them. */
const IDS = {
  title: "games-title",
  game: "games-memory-missing",
  slot: "games-slot"
} as const;

/**
 * Render the Games catalog page content.
 *
 * @param props - GamesPage props.
 * @param props.locale - Page locale.
 * @returns The page content for the `[data-page]` region.
 * @example
 * ```tsx
 * <GamesPage locale="en" />
 * ```
 */
export function GamesPage({ locale }: GamesPageProps): VNode {
  const strings = t(locale).games;
  const text = (value: string): string => typeset(value, locale);
  const [helpBefore, helpAfter] = splitSlot(text(strings.help), "link");
  return (
    <div data-component="games-page">
      <section data-page-head aria-labelledby={IDS.title}>
        <div data-container>
          <h1 id={IDS.title}>{text(strings.title)}</h1>
          <p data-lead>{text(strings.lead)}</p>
        </div>
        <PaperBand />
      </section>
      <PaperSheet labelledBy={IDS.game}>
        <GameCard locale={locale} headingId={IDS.game} />
      </PaperSheet>
      <PaperSheet labelledBy={IDS.slot}>
        <div data-games-next>
          <div id={IDS.slot}>
            <ComingSoonSlot name={text(strings.slot.name)} status={text(strings.slot.soon)} />
          </div>
          <p>{text(strings.slot.note)}</p>
          <div data-games-gift>
            <PopupSticker sticker="gift-box" />
          </div>
        </div>
      </PaperSheet>
      <p data-games-help>
        {helpBefore}
        <a href={urls.toUrl("support", { lang: locale })}>{text(strings.helpLink)}</a>
        {helpAfter}
      </p>
    </div>
  );
}
