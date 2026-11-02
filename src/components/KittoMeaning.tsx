/**
 * @file KittoMeaning (design-context §6 A2): the «Why the name Kitto» part of the About page. The
 * copy on one side, the large きっと cut from paper on the other, with its Latin reading under it.
 *
 * The kana use the "Kitto Kana" face (M PLUS Rounded 1c 800, only き っ と) in every locale. They
 * drop in one by one when they come into view, and again on a click (the `kana-drop` island).
 * Without the island, or with reduced motion, they simply stand.
 */
import type { VNode } from "preact";
import { t } from "../i18n";
import type { Locale } from "../i18n/languages";
import { typeset } from "../lib/typography";

/** KittoMeaning props. */
export type KittoMeaningProps = {
  /** Page locale. */
  locale: Locale;
  /** Id of the heading, for the `aria-labelledby` of the sheet around it. */
  headingId: string;
};

/**
 * Render the meaning of the studio name.
 *
 * @param props - KittoMeaning props.
 * @param props.locale - Page locale.
 * @param props.headingId - Id of the section heading.
 * @returns The heading and copy beside the large kana, the mount point of the `kana-drop` island.
 * @example
 * ```tsx
 * <PaperSheet labelledBy="about-name">
 *   <KittoMeaning locale="en" headingId="about-name" />
 * </PaperSheet>
 * ```
 */
export function KittoMeaning({ locale, headingId }: KittoMeaningProps): VNode {
  const strings = t(locale).about.name;
  const text = (value: string): string => typeset(value, locale);
  return (
    <div data-component="kitto-meaning">
      <div data-meaning-copy>
        <h2 id={headingId}>{text(strings.title)}</h2>
        <p data-meaning-text="big">{text(strings.first)}</p>
        <p>{text(strings.second)}</p>
      </div>
      <p data-meaning-kana data-island="kana-drop">
        <span data-kana-glyphs lang="ja" aria-hidden="true">
          {Array.from(strings.kana, (glyph, index) => (
            <span key={`${glyph}-${index}`}>{glyph}</span>
          ))}
        </span>
        <span data-visually-hidden lang="ja">
          {strings.kana}
        </span>
        <span data-kana-reading>{text(strings.reading)}</span>
      </p>
    </div>
  );
}
