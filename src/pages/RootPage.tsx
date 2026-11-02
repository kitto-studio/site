/**
 * @file The root language page (`/`), the x-default target of every page.
 *
 * Its inline script runs first in the body and sends the reader to their language at once: the
 * saved `kitto-lang` choice, else the first supported entry of `navigator.languages`, else English
 * (`src/lib/locale.ts`). Without JavaScript the page itself is the fallback: the logo and every
 * language as a link to its home page. No site chrome, so a language link is a full page load.
 */
import type { VNode } from "preact";
import { Logo } from "../components/Logo";
import { SITE } from "../config";
import { t } from "../i18n";
import { DEFAULT_LOCALE, HTML_LANG, LOCALES, NATIVE_NAMES } from "../i18n/languages";
import { ROOT_REDIRECT_SCRIPT } from "../lib/locale";
import { urls } from "../routes";

/**
 * Render the root page: the redirect script, then the logo and the list of languages.
 *
 * @returns The whole root page body.
 * @example
 * ```tsx
 * route("/").render(() => <RootPage />);
 * ```
 */
export function RootPage(): VNode {
  const strings = t(DEFAULT_LOCALE);
  return (
    <>
      {/* A build-time constant with no input in it. */}
      <script dangerouslySetInnerHTML={{ __html: ROOT_REDIRECT_SCRIPT }} />
      <main id="main" data-component="root-page" aria-labelledby="root-title">
        <Logo label={SITE.name} />
        <h1 id="root-title">{strings.root.heading}</h1>
        <ul data-languages>
          {LOCALES.map(locale => (
            <li key={locale}>
              <a href={urls.toUrl("home", { lang: locale })} lang={HTML_LANG[locale]}>
                {NATIVE_NAMES[locale]}
              </a>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
