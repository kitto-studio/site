/**
 * @file Delete your data page (A8): the Google Play data deletion URL. Six numbered sections plus
 * the developer and app card, the Android, iPhone and email steps as step tokens, the one orange
 * «Email a deletion request» button and the deleted-and-kept ledger.
 */
import type { ComponentChildren, VNode } from "preact";
import { LegalDocument } from "../components/LegalDocument";
import { SITE } from "../config";
import { t } from "../i18n";
import type { Locale } from "../i18n/languages";
import { deletionRequestHref, LEGAL_OWNER } from "../lib/legal";
import { typeset } from "../lib/typography";

/** The app ID form, kept out of machine translation. */
const APP_IDS_HTML = '<span translate="no">studio.kitto.memorymissing</span>';

/** DeleteDataPage props. */
type DeleteDataPageProps = {
  /** Page locale. */
  locale: Locale;
};

/**
 * Render the Delete your data page content.
 *
 * @param props - DeleteDataPage props.
 * @param props.locale - Page locale.
 * @returns The page content for the `[data-page]` region.
 * @example
 * ```tsx
 * <DeleteDataPage locale="en" />
 * ```
 */
export function DeleteDataPage({ locale }: DeleteDataPageProps): VNode {
  const strings = t(locale).deleteData;
  const text = (value: string): string => typeset(value, locale);

  const facts = (
    <dl data-legal-facts>
      <dt>{text(strings.facts.developer)}</dt>
      <dd>
        {SITE.name}
        <br />
        {LEGAL_OWNER}
      </dd>
      <dt>{text(strings.facts.apps)}</dt>
      <dd>{text(strings.facts.appsValue)}</dd>
      <dt>{text(strings.facts.ids)}</dt>
      <dd dangerouslySetInnerHTML={{ __html: APP_IDS_HTML }} />
    </dl>
  );

  const requestButton = (
    <a data-legal-action href={deletionRequestHref(strings.mailSubject)}>
      {text(strings.cta)}
    </a>
  );

  // The section's own list is the «Deleted» column; «Kept» is always nothing.
  const ledger = (deleted: ComponentChildren): VNode => (
    <div data-legal-ledger>
      <div>
        <h3>{text(strings.deleted)}</h3>
        {deleted}
      </div>
      <div>
        <h3>{text(strings.kept)}</h3>
        <p data-ledger-none>{text(strings.nothing)}</p>
        <p>{text(strings.nothingNote)}</p>
      </div>
    </div>
  );

  return (
    <LegalDocument
      locale={locale}
      id="deleteData"
      facts={facts}
      sections={{ email: { after: requestButton }, kept: { wrap: ledger } }}
    />
  );
}
