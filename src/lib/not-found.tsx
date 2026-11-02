/**
 * @file The 404 page as HTML: the body for `build.notFound` (the framework's root `dist/404.html`)
 * and the complete per-locale document the postbuild plugin writes to `dist/{lang}/404.html`.
 *
 * The framework wraps `build.notFound.body` in a minimal document without the shell's asset links,
 * so the body carries the stylesheet and script placeholders the build substitutes. The full
 * document is the site's page shell (`src/index.html`): favicon, theme colours and the no-flash
 * theme script come with it, the asset tags are taken from the built root 404.
 */
import { renderToString } from "preact-render-to-string";
import { SITE } from "../config";
import { t } from "../i18n";
import type { Locale } from "../i18n/languages";
import { SiteLayout } from "../layouts/SiteLayout";
import { NotFoundPage } from "../pages/NotFoundPage";
import { cjkFontHref } from "./head";

/** Build placeholder replaced by the fingerprinted stylesheet `<link>`. */
const STYLESHEET_PLACEHOLDER = "<!--moku:assets:css-->";

/** Build placeholder replaced by the fingerprinted client `<script>`: islands, the chrome. */
const SCRIPT_PLACEHOLDER = "<!--moku:assets:js-->";

/**
 * Render the 404 page of one locale inside the site chrome.
 *
 * @param locale - Locale of the page text and links.
 * @returns The page markup.
 */
function renderNotFoundPage(locale: Locale): string {
  return renderToString(
    <SiteLayout locale={locale} page="notFound">
      <NotFoundPage locale={locale} />
    </SiteLayout>
  );
}

/**
 * Render the `<head>` content of a 404 document: title, description, `noindex` and, on CJK
 * locales, the font stylesheet.
 *
 * @param locale - The page locale.
 * @returns The head markup for the shell's head placeholder.
 */
function renderNotFoundHead(locale: Locale): string {
  const { title, description } = t(locale).meta.notFound;
  const fontHref = cjkFontHref(locale);
  return renderToString(
    <>
      <title>{`${title} — ${SITE.name}`}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="noindex" />
      {fontHref && <link rel="stylesheet" href={fontHref} />}
    </>
  );
}

/**
 * Render the 404 body of one locale for `build.notFound`.
 *
 * @param locale - Locale of the page text and links.
 * @returns The stylesheet placeholder, the 404 page inside the site chrome, then the script
 *   placeholder.
 * @example
 * ```ts
 * build: { notFound: { body: notFoundBody("en") } }
 * ```
 */
export function notFoundBody(locale: Locale): string {
  return STYLESHEET_PLACEHOLDER + renderNotFoundPage(locale) + SCRIPT_PLACEHOLDER;
}

/**
 * Compose the complete 404 document of one locale from the site's page shell.
 *
 * @param shell - The page shell (`src/index.html`) with its `<!--moku:*-->` placeholders.
 * @param locale - Locale of the document.
 * @param assetTags - The fingerprinted stylesheet and script tags of the build.
 * @returns The 404 document.
 * @example
 * ```ts
 * notFoundDocument(shell, "ru", '<link rel="stylesheet" href="/assets/main-1a2b.css">');
 * // '<!DOCTYPE html>\n<html lang="ru">…<title>Page not found — Kitto Studio</title>…'
 * ```
 */
export function notFoundDocument(shell: string, locale: Locale, assetTags: string): string {
  // Replacer functions, so a `$` in the markup is never read as a replacement pattern.
  return shell
    .replaceAll("<!--moku:lang-->", () => locale)
    .replaceAll("<!--moku:head-->", () => renderNotFoundHead(locale))
    .replaceAll("<!--moku:assets-->", () => assetTags)
    .replaceAll("<!--moku:body-->", () => renderNotFoundPage(locale));
}
