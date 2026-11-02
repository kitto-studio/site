/**
 * @file Privacy Policy page (A6): the store Privacy URL of the App Store and Google Play. Ten
 * numbered sections; «Our games» lists its promises with dot bullets, Contact ends with the address.
 */
import type { VNode } from "preact";
import { LegalAddress, LegalDocument } from "../components/LegalDocument";
import type { Locale } from "../i18n/languages";

/** PrivacyPage props. */
type PrivacyPageProps = {
  /** Page locale. */
  locale: Locale;
};

/**
 * Render the Privacy Policy page content.
 *
 * @param props - PrivacyPage props.
 * @param props.locale - Page locale.
 * @returns The page content for the `[data-page]` region.
 * @example
 * ```tsx
 * <PrivacyPage locale="en" />
 * ```
 */
export function PrivacyPage({ locale }: PrivacyPageProps): VNode {
  return (
    <LegalDocument
      locale={locale}
      id="privacy"
      sections={{ games: { bullets: "dot" }, contact: { after: <LegalAddress /> } }}
    />
  );
}
