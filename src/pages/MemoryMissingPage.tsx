/**
 * @file A Memory Missing game page (design-context §6 A4, §7). The breadcrumb back to Games, the
 * game's name and its tags; the gallery on a paper sheet; the story beside «Where to play» (iPhone
 * and Android, both «Coming soon», no store badges yet); the playable merge board; the four features
 * on a second sheet; the help line pointing to Support and the Privacy Policy.
 *
 * No paper band here: the approved prototype keeps this page's head on the paper sky alone. The
 * gallery (`gallery`) and the board (`merge-board`) are islands; without them, or with reduced
 * motion, the page is complete and still.
 */
import type { VNode } from "preact";
import { Breadcrumb } from "../components/Breadcrumb";
import { Gallery } from "../components/Gallery";
import { MergeBoard } from "../components/MergeBoard";
import { PaperSheet } from "../components/PaperSheet";
import { Tag } from "../components/Tag";
import { t } from "../i18n";
import type { Locale } from "../i18n/languages";
import type { TitledText } from "../i18n/types";
import { GALLERY } from "../lib/game";
import { splitSlot } from "../lib/legal";
import { typeset } from "../lib/typography";
import { urls } from "../routes";

/** MemoryMissingPage props. */
type MemoryMissingPageProps = {
  /** Page locale. */
  locale: Locale;
};

/** Ids that tie headings to their sections; the page CSS finds the sheets by them. */
const IDS = {
  gallery: "game-gallery",
  story: "game-story",
  platforms: "game-platforms",
  features: "game-features",
  help: "game-help"
} as const;

/** The two platform rows and the outline of each phone, drawn for this site. */
const PLATFORMS = [
  {
    key: "iphone",
    icon: (
      <>
        <rect x="6.5" y="2.5" width="11" height="19" rx="2.8" />
        <path d="M10.5 5.3h3" />
      </>
    )
  },
  {
    key: "android",
    icon: (
      <>
        <rect x="6.5" y="2.5" width="11" height="19" rx="1.8" />
        <path d="M11.2 18.3h1.6" />
      </>
    )
  }
] as const;

/**
 * Render the A Memory Missing game page content.
 *
 * @param props - MemoryMissingPage props.
 * @param props.locale - Page locale.
 * @returns The page content for the `[data-page]` region.
 * @example
 * ```tsx
 * <MemoryMissingPage locale="en" />
 * ```
 */
export function MemoryMissingPage({ locale }: MemoryMissingPageProps): VNode {
  const strings = t(locale).game;
  const text = (value: string): string => typeset(value, locale);
  const { features, help, platforms } = strings;
  const [helpStart, helpRest] = splitSlot(text(help.text), "supportLink");
  const [helpMiddle, helpEnd] = splitSlot(helpRest, "privacyLink");
  const featureList: readonly TitledText[] = [
    features.merge,
    features.memories,
    features.solve,
    features.offline
  ];
  return (
    <div data-component="memory-missing-page">
      <header data-game-head data-container>
        <Breadcrumb
          href={urls.toUrl("games", { lang: locale })}
          label={text(strings.breadcrumb.games)}
          navLabel={text(strings.breadcrumb.label)}
        />
        <h1>{strings.name}</h1>
        <p data-game-tags>
          <Tag tone="line">{text(strings.tags.genre)}</Tag>
          <Tag tone="line" dot>
            {text(strings.tags.status)}
          </Tag>
        </p>
      </header>

      <PaperSheet labelledBy={IDS.gallery}>
        <Gallery locale={locale} items={GALLERY} headingId={IDS.gallery} />
      </PaperSheet>

      <div data-game-story data-container>
        <section aria-labelledby={IDS.story}>
          <h2 id={IDS.story}>{text(strings.story.title)}</h2>
          <p data-game-premise>{text(strings.story.premise)}</p>
        </section>
        <aside data-game-platforms aria-labelledby={IDS.platforms}>
          <h2 id={IDS.platforms}>{text(platforms.title)}</h2>
          <ul>
            {PLATFORMS.map(platform => (
              <li key={platform.key}>
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                >
                  {platform.icon}
                </svg>
                <span>{platforms[platform.key]}</span>
                <Tag compact>{text(platforms.soon)}</Tag>
              </li>
            ))}
          </ul>
          <p>{text(platforms.note)}</p>
        </aside>
      </div>

      <div data-game-play data-container>
        <MergeBoard locale={locale} />
      </div>

      <PaperSheet labelledBy={IDS.features}>
        <h2 id={IDS.features}>{text(features.title)}</h2>
        <ul data-game-features>
          {featureList.map(feature => (
            <li key={feature.title}>
              <h3>{text(feature.title)}</h3>
              <p>{text(feature.text)}</p>
            </li>
          ))}
        </ul>
      </PaperSheet>

      <section data-game-help data-container aria-labelledby={IDS.help}>
        <h2 id={IDS.help}>{text(help.title)}</h2>
        <p>
          {helpStart}
          <a href={urls.toUrl("support", { lang: locale })}>{text(help.supportLink)}</a>
          {helpMiddle}
          <a href={urls.toUrl("privacy", { lang: locale })}>{text(help.privacyLink)}</a>
          {helpEnd}
        </p>
      </section>
    </div>
  );
}
