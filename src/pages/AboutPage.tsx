/**
 * @file About page (design-context §6 A2): «A small family studio» on the paper sky over the paper
 * band, then three still paper sheets: «Who we are» with the studio diorama as a taped print (day
 * art in light, night art in dark), the meaning of きっと with the large kana, and «How we work»
 * with the mug sticker standing on the sheet's edge. A contact line closes the page.
 *
 * Motion: the band settles once (CSS), the kana drop in (`kana-drop`), the mug folds up
 * (`popup-sticker`). Without the islands, or with reduced motion, the page is complete and still.
 */
import type { VNode } from "preact";
import { KittoMeaning } from "../components/KittoMeaning";
import { PaperBand } from "../components/PaperBand";
import { PaperSheet } from "../components/PaperSheet";
import { PopupSticker } from "../components/PopupSticker";
import { EMAILS } from "../config";
import { t } from "../i18n";
import type { Locale } from "../i18n/languages";
import type { TitledText } from "../i18n/types";
import { splitSlot } from "../lib/legal";
import { typeset } from "../lib/typography";
import { urls } from "../routes";

/** AboutPage props. */
type AboutPageProps = {
  /** Page locale. */
  locale: Locale;
};

/** Ids that tie headings to their sections; the page CSS finds the sheets by them. */
const IDS = {
  title: "about-title",
  who: "about-who",
  name: "about-name",
  how: "about-how",
  hello: "about-hello"
} as const;

/** Intrinsic size of the diorama art, px. */
const DIORAMA_SIZE = { width: 1536, height: 1024 };

/** Diorama props. */
type DioramaProps = {
  /** Alt text of the scene, already typeset. */
  alt: string;
};

/**
 * Render the studio diorama as a taped print: the day scene under the night scene.
 *
 * @param props - Diorama props.
 * @param props.alt - Alt text of the scene.
 * @returns The print figure.
 */
function Diorama({ alt }: DioramaProps): VNode {
  return (
    <figure data-about-print>
      <span data-print-tape="left" aria-hidden="true" />
      <span data-print-tape="right" aria-hidden="true" />
      <span data-print-photo>
        <img
          data-art="day"
          src="/media/scenes/diorama-day.webp"
          alt={alt}
          width={DIORAMA_SIZE.width}
          height={DIORAMA_SIZE.height}
          loading="lazy"
          decoding="async"
        />
        <img
          data-art="night"
          src="/media/scenes/diorama-night.webp"
          alt=""
          width={DIORAMA_SIZE.width}
          height={DIORAMA_SIZE.height}
          loading="lazy"
          decoding="async"
        />
      </span>
    </figure>
  );
}

/**
 * Render one way of working: a short heading and its text.
 *
 * @param props - Way props.
 * @param props.item - The heading and text, already typeset.
 * @returns The list item.
 */
function Way({ item }: { item: TitledText }): VNode {
  return (
    <li>
      <h3>{item.title}</h3>
      <p>{item.text}</p>
    </li>
  );
}

/**
 * Render the About page content.
 *
 * @param props - AboutPage props.
 * @param props.locale - Page locale.
 * @returns The page content for the `[data-page]` region.
 * @example
 * ```tsx
 * <AboutPage locale="en" />
 * ```
 */
export function AboutPage({ locale }: AboutPageProps): VNode {
  const strings = t(locale).about;
  const text = (value: string): string => typeset(value, locale);
  const titled = (item: TitledText): TitledText => ({
    title: text(item.title),
    text: text(item.text)
  });
  const { who, how, hello } = strings;
  const [mailBefore, mailAfter] = splitSlot(text(hello.text), "email");
  const [supportBefore, supportAfter] = splitSlot(text(hello.support), "link");
  return (
    <div data-component="about-page">
      <section data-page-head aria-labelledby={IDS.title}>
        <div data-container>
          <h1 id={IDS.title}>{text(strings.title)}</h1>
          <p data-lead>{text(strings.lead)}</p>
        </div>
        <PaperBand />
      </section>
      <PaperSheet labelledBy={IDS.who}>
        <div data-about-who>
          <Diorama alt={text(who.dioramaAlt)} />
          <div>
            <h2 id={IDS.who}>{text(who.title)}</h2>
            <p data-about-text="big">{text(who.first)}</p>
            <p>{text(who.second)}</p>
          </div>
        </div>
      </PaperSheet>
      <PaperSheet labelledBy={IDS.name}>
        <KittoMeaning locale={locale} headingId={IDS.name} />
      </PaperSheet>
      <PaperSheet labelledBy={IDS.how}>
        <h2 id={IDS.how}>{text(how.title)}</h2>
        <div data-about-mug>
          <PopupSticker sticker="tea-mug" />
        </div>
        <ul data-about-ways>
          <Way item={titled(how.small)} />
          <Way item={titled(how.care)} />
          <Way item={titled(how.pace)} />
        </ul>
      </PaperSheet>
      <section data-about-hello aria-labelledby={IDS.hello}>
        <h2 id={IDS.hello}>{text(hello.title)}</h2>
        <p data-about-text="big">
          {mailBefore}
          <a href={`mailto:${EMAILS.support}`}>{EMAILS.support}</a>
          {mailAfter}
        </p>
        <p>
          {supportBefore}
          <a href={urls.toUrl("support", { lang: locale })}>{text(hello.supportLink)}</a>
          {supportAfter}
        </p>
      </section>
    </div>
  );
}
