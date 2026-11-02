/**
 * @file Home page (design-context §6 A1): the four-plane paper hero with the slogan, then three
 * paper sheets that enter as a stack: Games (A Memory Missing as a taped photo with a «Coming soon»
 * stamp, and an empty slot), the About teaser and Support. Each sheet carries a pop-up sticker.
 *
 * Motion lives in three islands: `home-hero` (parallax, headline sink, frame placement),
 * `sheet-stack` (the Stack entrance) and `popup-sticker`. Without them, or with reduced motion,
 * the page is complete and still.
 */
import type { VNode } from "preact";
import { Button } from "../components/Button";
import { ComingSoonSlot } from "../components/ComingSoonSlot";
import { PaperPhoto } from "../components/PaperPhoto";
import { PaperSheet } from "../components/PaperSheet";
import { PopupSticker } from "../components/PopupSticker";
import { EMAILS } from "../config";
import { t } from "../i18n";
import type { Locale } from "../i18n/languages";
import type { HomeStrings } from "../i18n/types";
import type { PlaneName } from "../lib/parallax";
import { urls } from "../routes";

/** HomePage props. */
type HomePageProps = {
  /** Page locale. */
  locale: Locale;
};

/** One art plane of the hero: the plane and the layer file it shows. */
type HeroPlaneProps = {
  /** Which plane. */
  plane: PlaneName;
  /** Layer file name: the sun plane shows the far layer, cropped to the sky. */
  layer: "far" | "mid" | "near" | "front";
  /** Load first: the first image a reader sees. */
  priority?: boolean;
};

/** Intrinsic size of every landscape layer, px. */
const LAYER_SIZE = { width: 1536, height: 1024 };

/** Intrinsic size of the game's key art, px. */
const WARD_SIZE = { width: 1448, height: 1086 };

/** Ids that tie headings and descriptions to their regions. */
const IDS = {
  title: "home-title",
  games: "home-games",
  about: "home-about",
  support: "home-support",
  gameName: "home-game-name",
  gameGenre: "home-game-genre",
  gameStatus: "home-game-status",
  gamePlatforms: "home-game-platforms"
} as const;

/**
 * Render one hero plane: the day art and the night art over it, crossfaded by theme.
 *
 * @param props - HeroPlane props.
 * @param props.plane - Which plane.
 * @param props.layer - Layer file name.
 * @param props.priority - Fetch the day image first.
 * @returns The plane with its two images, hidden from assistive technology.
 */
function HeroPlane({ plane, layer, priority = false }: HeroPlaneProps): VNode {
  return (
    <div data-plane={plane} aria-hidden="true">
      <img
        data-art="day"
        src={`/media/layers/day-${layer}.webp`}
        alt=""
        width={LAYER_SIZE.width}
        height={LAYER_SIZE.height}
        decoding="async"
        fetchpriority={priority ? "high" : undefined}
      />
      <img
        data-art="night"
        src={`/media/layers/night-${layer}.webp`}
        alt=""
        width={LAYER_SIZE.width}
        height={LAYER_SIZE.height}
        decoding="async"
      />
    </div>
  );
}

/**
 * Render the paper hero: sun or moon, far hills, the headline, then the mid, near and front planes.
 *
 * @param props - Hero props.
 * @param props.hero - The hero strings.
 * @returns The hero section, labelled by the slogan.
 */
function HomeHero({ hero }: { hero: HomeStrings["hero"] }): VNode {
  return (
    <section data-hero data-island="home-hero" aria-labelledby={IDS.title}>
      <HeroPlane plane="sun" layer="far" priority />
      <HeroPlane plane="far" layer="far" />
      <div data-hero-text data-container>
        <h1 id={IDS.title} data-display>
          {hero.title}
        </h1>
        <p data-lead>{hero.lead}</p>
      </div>
      <HeroPlane plane="mid" layer="mid" />
      <HeroPlane plane="near" layer="near" />
      <HeroPlane plane="front" layer="front" />
    </section>
  );
}

/**
 * Render the A Memory Missing card: the taped key-art photo with its stamp, name, genre and
 * platforms, all one link to the game page.
 *
 * @param props - Card props.
 * @param props.locale - Page locale.
 * @param props.name - The game name.
 * @param props.games - The Games sheet strings.
 * @returns The card link.
 */
function HomeGameCard({
  locale,
  name,
  games
}: {
  locale: Locale;
  name: string;
  games: HomeStrings["games"];
}): VNode {
  return (
    <a href={urls.toUrl("memoryMissing", { lang: locale })} data-home-game>
      <PaperPhoto
        src="/media/game/ward.webp"
        width={WARD_SIZE.width}
        height={WARD_SIZE.height}
        stamp={games.comingSoon}
        stampId={IDS.gameStatus}
      />
      <span data-game-text>
        <span data-game-name id={IDS.gameName}>
          {name}
        </span>
        <span data-game-genre id={IDS.gameGenre}>
          {games.genre}
        </span>
        <span data-game-platforms id={IDS.gamePlatforms}>
          {games.platforms}
        </span>
      </span>
    </a>
  );
}

/**
 * Render the support line with its `{email}` slot filled by the address as a mail link.
 *
 * @param props - Support text props.
 * @param props.text - The string with the `{email}` slot.
 * @returns The text around a selectable mail link.
 */
function SupportText({ text }: { text: string }): VNode {
  const [before, after = ""] = text.split("{email}");
  return (
    <p data-text="big">
      {before}
      <a href={`mailto:${EMAILS.support}`}>{EMAILS.support}</a>
      {after}
    </p>
  );
}

/**
 * Render the Home page content.
 *
 * @param props - HomePage props.
 * @param props.locale - Page locale.
 * @returns The hero and the stack of sheets, for the `[data-page]` region.
 * @example
 * ```tsx
 * <HomePage locale="en" />
 * ```
 */
export function HomePage({ locale }: HomePageProps): VNode {
  const strings = t(locale);
  const { hero, games, about, support } = strings.home;
  return (
    <div data-component="home-page">
      <HomeHero hero={hero} />
      <div data-sheet-stack data-island="sheet-stack">
        <span data-stack-mark />
        <PaperSheet
          stack={0}
          labelledBy={IDS.games}
          art={<PopupSticker sticker="gift-box" trigger="sheet" />}
        >
          <h2 id={IDS.games}>{games.title}</h2>
          <p>{games.lead}</p>
          <div data-home-games>
            <HomeGameCard locale={locale} name={strings.game.name} games={games} />
            <ComingSoonSlot name={games.slot} status={games.comingSoon} />
          </div>
        </PaperSheet>
        <span data-stack-mark />
        <PaperSheet
          stack={1}
          flip
          labelledBy={IDS.about}
          art={<PopupSticker sticker="tea-mug" trigger="sheet" />}
        >
          <h2 id={IDS.about}>{about.title}</h2>
          <p data-text="big">{about.text}</p>
          <p data-text="quiet">{about.kitto}</p>
          <a href={urls.toUrl("about", { lang: locale })} data-more>
            {about.more}
          </a>
        </PaperSheet>
        <span data-stack-mark />
        <PaperSheet
          stack={2}
          labelledBy={IDS.support}
          art={<PopupSticker sticker="envelope" trigger="sheet" />}
        >
          <h2 id={IDS.support}>{support.title}</h2>
          <SupportText text={support.text} />
          <Button href={`mailto:${EMAILS.support}`}>{support.cta}</Button>
        </PaperSheet>
      </div>
    </div>
  );
}
