/**
 * @file Terms of Use page (A7): eleven numbered sections; Contact ends with the address.
 */
import type { VNode } from "preact";
import { LegalAddress, LegalDocument } from "../components/LegalDocument";
import type { Locale } from "../i18n/languages";

/** TermsPage props. */
type TermsPageProps = {
  /** Page locale. */
  locale: Locale;
};

/**
 * Render the Terms of Use page content.
 *
 * @param props - TermsPage props.
 * @param props.locale - Page locale.
 * @returns The page content for the `[data-page]` region.
 * @example
 * ```tsx
 * <TermsPage locale="en" />
 * ```
 */
export function TermsPage({ locale }: TermsPageProps): VNode {
  return (
    <LegalDocument locale={locale} id="terms" sections={{ contact: { after: <LegalAddress /> } }} />
  );
}
