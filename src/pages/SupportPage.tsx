/**
 * @file Support page (design-context §6 A5), the App Store Support URL: «Need help? Write to us.»,
 * the email card, what to put in a letter, and three short answers that link the data deletion
 * page and the privacy policy in the page's locale.
 */
import type { VNode } from "preact";
import { EmailCard } from "../components/EmailCard";
import { Faq } from "../components/Faq";
import { PaperBand } from "../components/PaperBand";
import { PaperSheet } from "../components/PaperSheet";
import { t } from "../i18n";
import type { Locale } from "../i18n/languages";
import { splitSlot } from "../lib/legal";
import { typeset } from "../lib/typography";
import { urls } from "../routes";

/** SupportPage props. */
type SupportPageProps = {
  /** Page locale. */
  locale: Locale;
};

/**
 * Put a link into the `{link}` slot of an answer.
 *
 * @param template - The answer with its `{link}` slot, already typeset.
 * @param label - The link text, already typeset.
 * @param href - The link target.
 * @returns The answer with the link in place of the slot.
 */
function answerWithLink(template: string, label: string, href: string): VNode {
  const [before, after] = splitSlot(template, "link");
  return (
    <>
      {before}
      <a href={href}>{label}</a>
      {after}
    </>
  );
}

/**
 * Render the Support page content.
 *
 * @param props - SupportPage props.
 * @param props.locale - Page locale.
 * @returns The page content for the `[data-page]` region.
 * @example
 * ```tsx
 * <SupportPage locale="en" />
 * ```
 */
export function SupportPage({ locale }: SupportPageProps): VNode {
  const strings = t(locale).support;
  const text = (value: string): string => typeset(value, locale);
  const { letter, faq } = strings;
  return (
    <div data-component="support-page">
      <section data-page-head aria-labelledby="support-title">
        <div data-container>
          <h1 id="support-title">{text(strings.title)}</h1>
          <p data-lead>{text(strings.lead)}</p>
        </div>
        <PaperBand />
      </section>
      <EmailCard locale={locale} />
      <div data-support-help>
        <PaperSheet labelledBy="support-letter">
          <h2 id="support-letter">{text(letter.title)}</h2>
          <p>{text(letter.lead)}</p>
          <ul data-checklist>
            <li>{text(letter.game)}</li>
            <li>{text(letter.device)}</li>
            <li>{text(letter.os)}</li>
            <li>{text(letter.what)}</li>
          </ul>
        </PaperSheet>
        <Faq
          id="support-faq"
          title={text(faq.title)}
          items={[
            { question: text(faq.progressQuestion), answer: text(faq.progressAnswer) },
            {
              question: text(faq.deleteQuestion),
              answer: answerWithLink(
                text(faq.deleteAnswer),
                text(faq.deleteLink),
                urls.toUrl("deleteData", { lang: locale })
              )
            },
            {
              question: text(faq.privacyQuestion),
              answer: answerWithLink(
                text(faq.privacyAnswer),
                text(faq.privacyLink),
                urls.toUrl("privacy", { lang: locale })
              )
            }
          ]}
        />
      </div>
    </div>
  );
}
