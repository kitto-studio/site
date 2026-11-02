/**
 * @file EmailCard (design-context §6 A5, F3): the support address as the hero of a paper sheet.
 * The address is large selectable text; «Write a letter» opens the mail app and «Copy address»
 * copies it (the `copy-email` island), with the envelope sticker standing beside them.
 *
 * The island's translated states ride on its root as data attributes, so the client bundle needs
 * no string table. Without JavaScript the copy button stays hidden and the address is still there
 * to select.
 */
import type { VNode } from "preact";
import { EMAILS } from "../config";
import { t } from "../i18n";
import type { Locale } from "../i18n/languages";
import { typeset } from "../lib/typography";
import { Button } from "./Button";
import { PaperSheet } from "./PaperSheet";
import { PopupSticker } from "./PopupSticker";

/**
 * `translate="no"` for the address. Preact types `translate` as a boolean, but HTML wants the word
 * `no`, and a `false` is dropped from the markup.
 */
const NO_TRANSLATE: Record<string, string> = { translate: "no" };

/** EmailCard props. */
type EmailCardProps = {
  /** Page locale. */
  locale: Locale;
};

/**
 * The copy icon and the check that replaces it after a copy. Decorative.
 *
 * @returns Both icons; CSS shows one at a time.
 */
function CopyIcons(): VNode {
  return (
    <>
      <svg viewBox="0 0 24 24" data-icon="copy" aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
          <rect x="9" y="9" width="11" height="11" rx="2.5" />
          <path d="M15 5.6V5a1.5 1.5 0 0 0-1.5-1.5h-8A2 2 0 0 0 3.5 5.5v8A1.5 1.5 0 0 0 5 15h.6" />
        </g>
      </svg>
      <svg viewBox="0 0 24 24" data-icon="done" aria-hidden="true">
        <path
          d="M5 12.5l5 5L19 7"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </>
  );
}

/**
 * Render the support email card.
 *
 * @param props - EmailCard props.
 * @param props.locale - Page locale.
 * @returns The paper sheet with the address, its two actions, the status line and the sticker.
 * @example
 * ```tsx
 * <EmailCard locale="en" />
 * ```
 */
export function EmailCard({ locale }: EmailCardProps): VNode {
  const mail = t(locale).support.mail;
  const text = (value: string): string => typeset(value, locale);
  // A phone breaks the address after the @, never inside a word.
  const [local, domain] = EMAILS.support.split("@");
  return (
    <div data-component="email-card">
      <PaperSheet labelledBy="support-mail" art={<PopupSticker sticker="envelope" />}>
        <div
          data-island="copy-email"
          data-copied-label={text(mail.copied)}
          data-copied-note={text(mail.copiedNote)}
          data-fail-note={text(mail.copyFail)}
        >
          <h2 id="support-mail">{text(mail.title)}</h2>
          <p data-email-address {...NO_TRANSLATE}>
            {local}@<wbr />
            {domain}
          </p>
          <div data-mail-actions>
            <Button href={`mailto:${EMAILS.support}`}>{text(mail.write)}</Button>
            <Button variant="paper" data-copy-button="">
              <CopyIcons />
              <span data-copy-label>{text(mail.copy)}</span>
            </Button>
            <p data-copy-note role="status" aria-live="polite" />
          </div>
        </div>
      </PaperSheet>
    </div>
  );
}
