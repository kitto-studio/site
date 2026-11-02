/**
 * @file LegalDocument: the one paper sheet of a legal page (A6–A8).
 *
 * The head: title, «Last updated» with the publish date, the draft line while placeholders are open
 * (F5), the lead, optional facts and the «In short» box. Then the contents, a sticky rail with the
 * sliding orange dot on wide screens and a sticky bar on the phone (D3, C2; behaviour in the
 * `legal-toc` island), and the numbered sections.
 *
 * Every string goes through the locale's typography, and legal HTML gets its slots filled with
 * links in the page's locale. A locale without its own translation shows the English text, marked
 * as English, under a note (F6).
 */
import { type ComponentChildren, Fragment, type VNode } from "preact";
import { LEGAL_UPDATED } from "../config";
import { t } from "../i18n";
import type { Locale } from "../i18n/languages";
import type { LegalDocumentId } from "../i18n/types";
import {
  firstPlaceholder,
  formatLegalDate,
  isPlaceholder,
  LEGAL_ADDRESS,
  legalDocument,
  renderLegalHtml,
  splitSlot
} from "../lib/legal";
import { typeset } from "../lib/typography";
import { urls } from "../routes";
import { InShort } from "./InShort";
import { LegalSection, type SectionOptions } from "./LegalSection";
import { PaperBand } from "./PaperBand";
import { Placeholder } from "./Placeholder";

/** LegalDocument props. */
type LegalDocumentProps = {
  /** Page locale: UI strings, links and the date. */
  locale: Locale;
  /** Which legal document. */
  id: LegalDocumentId;
  /** Extra head content between the lead and «In short», such as the delete page's facts card. */
  facts?: ComponentChildren;
  /** The page's adjustments of single sections, by section id. */
  sections?: Partial<Record<string, SectionOptions>>;
};

/** Contents props. */
type ContentsProps = {
  /** The «Contents» label, already typeset. */
  label: string;
  /** Section ids and typeset headings, in page order. */
  entries: readonly { id: string; heading: string }[];
  /** Language of the headings when it differs from the page (the English fallback). */
  lang: string | undefined;
};

/**
 * The globe of the «available in English» note.
 *
 * @returns A decorative globe icon.
 */
function GlobeIcon(): VNode {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" data-legal-globe>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.6 2.4 3.6 5.3 3.6 8.5s-1 6.1-3.6 8.5M12 3.5C9.4 5.9 8.4 8.8 8.4 12s1 6.1 3.6 8.5" />
    </svg>
  );
}

/**
 * The contents: one link per section. Closed in the markup, so the phone bar starts closed; wide
 * screens show the list as a rail (CSS), and the `legal-toc` island keeps it open there.
 *
 * @param props - Contents props.
 * @param props.label - The «Contents» label.
 * @param props.entries - Section ids and headings.
 * @param props.lang - Language of the headings when it differs from the page.
 * @returns The contents navigation, the mount point of the `legal-toc` island.
 */
function Contents({ label, entries, lang }: ContentsProps): VNode {
  return (
    <nav data-island="legal-toc" aria-labelledby="legal-contents-label">
      <details data-toc>
        <summary>
          <span id="legal-contents-label">{label}</span>
          <span data-toc-now aria-hidden="true" />
          <svg viewBox="0 0 10 10" aria-hidden="true" data-toc-chevron>
            <path d="M1.5 3.5 5 7l3.5-3.5" />
          </svg>
        </summary>
        <div data-toc-rail>
          <ol lang={lang}>
            {entries.map((entry, index) => (
              <li key={entry.id}>
                <a href={`#${entry.id}`}>
                  <span data-toc-number>{index + 1}</span> <span>{entry.heading}</span>
                </a>
              </li>
            ))}
          </ol>
          <span data-toc-dot aria-hidden="true" />
        </div>
      </details>
    </nav>
  );
}

/**
 * The studio's postal address, for the Contact section of the privacy policy and the terms.
 *
 * @returns An `<address>` with one line per entry of `LEGAL_ADDRESS`, placeholders highlighted.
 * @example
 * ```tsx
 * <LegalDocument locale="en" id="terms" sections={{ contact: { after: <LegalAddress /> } }} />
 * ```
 */
export function LegalAddress(): VNode {
  return (
    <address data-legal-address>
      {LEGAL_ADDRESS.map((line, index) => (
        <Fragment key={line}>
          {index > 0 && <br />}
          {isPlaceholder(line) ? <Placeholder text={line} /> : line}
        </Fragment>
      ))}
    </address>
  );
}

/**
 * Render a legal document on its paper sheet.
 *
 * @param props - LegalDocument props.
 * @param props.locale - Page locale.
 * @param props.id - Which legal document.
 * @param props.facts - Extra head content between the lead and «In short».
 * @param props.sections - The page's adjustments of single sections, by section id.
 * @returns The `<article>` of the page.
 * @example
 * ```tsx
 * <LegalDocument locale="ru" id="privacy" sections={{ games: { bullets: "dot" } }} />
 * ```
 */
export function LegalDocument({ locale, id, facts, sections }: LegalDocumentProps): VNode {
  const strings = t(locale).legal;
  const { document, isFallback } = legalDocument(locale, id);
  const contentLocale: Locale = isFallback ? "en" : locale;
  const contentLang = isFallback ? "en" : undefined;
  const placeholder = firstPlaceholder(document);

  const text = (value: string): string => typeset(value, locale);
  const contentText = (value: string): string => typeset(value, contentLocale);
  const contentHtml = (value: string): string =>
    renderLegalHtml(value, contentLocale, target => urls.toUrl(target, { lang: locale }));

  const [updatedBefore, updatedAfter] = splitSlot(text(strings.updated), "date");
  const [draftBefore, draftAfter] = splitSlot(text(strings.draft), "placeholder");

  return (
    <>
      <PaperBand edge="cut" />
      <article data-component="legal-document" aria-labelledby="legal-title">
        <div data-sheet>
          <header data-legal-head>
            {isFallback && (
              <p data-legal-fallback>
                <GlobeIcon />
                <span>{text(strings.fallback)}</span>
              </p>
            )}
            <h1 id="legal-title">{text(strings.titles[id])}</h1>
            <p data-legal-meta>
              {updatedBefore}
              <time dateTime={LEGAL_UPDATED}>{formatLegalDate(LEGAL_UPDATED, locale)}</time>
              {updatedAfter}
            </p>
            {placeholder !== undefined && (
              <p data-legal-draft>
                {draftBefore}
                <Placeholder text={placeholder} />
                {draftAfter}
              </p>
            )}
            <p
              data-legal-lead
              lang={contentLang}
              dangerouslySetInnerHTML={{ __html: contentHtml(document.intro) }}
            />
            {facts}
            <InShort
              title={text(strings.inShort)}
              items={document.inShort.map(item => contentHtml(item))}
              lang={contentLang}
            />
          </header>
          <Contents
            label={text(strings.contents)}
            entries={document.sections.map(section => ({
              id: section.id,
              heading: contentText(section.heading)
            }))}
            lang={contentLang}
          />
          <div data-legal-body lang={contentLang}>
            {document.sections.map((section, index) => (
              <LegalSection
                key={section.id}
                section={section}
                number={index + 1}
                renderHtml={contentHtml}
                renderText={contentText}
                options={sections?.[section.id]}
              />
            ))}
          </div>
        </div>
      </article>
    </>
  );
}
