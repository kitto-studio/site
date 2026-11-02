import { type FunctionComponent, h } from "preact";
import { renderToString } from "preact-render-to-string";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LEGAL_UPDATED } from "../../src/config";
import { LEGAL } from "../../src/i18n";
import { LOCALES, type Locale } from "../../src/i18n/languages";
import type { LegalDocument, LegalDocumentId } from "../../src/i18n/types";
import {
  deletionRequestHref,
  formatLegalDate,
  legalDocument,
  renderLegalHtml,
  splitSlot
} from "../../src/lib/legal";
import { activeSectionIndex } from "../../src/lib/toc";
import { DeleteDataPage } from "../../src/pages/DeleteDataPage";
import { PrivacyPage } from "../../src/pages/PrivacyPage";
import { TermsPage } from "../../src/pages/TermsPage";

const PAGES: Record<LegalDocumentId, FunctionComponent<{ locale: Locale }>> = {
  privacy: PrivacyPage,
  terms: TermsPage,
  deleteData: DeleteDataPage
};
const DOCUMENT_IDS = Object.keys(PAGES) as LegalDocumentId[];

const render = (id: LegalDocumentId, locale: Locale): string =>
  renderToString(h(PAGES[id], { locale }));
const captures = (html: string, pattern: RegExp): string[] =>
  [...html.matchAll(pattern)].map(match => match[1] ?? "");
const duplicates = (values: string[]): string[] =>
  values.filter((value, index) => values.indexOf(value) !== index);
const contentsOf = (html: string): string =>
  html.match(/<nav data-island="legal-toc"[\s\S]*?<\/nav>/)?.[0] ?? "";

describe("legal pages in every locale", () => {
  // Catches: a section id that repeats (in one locale or across a translation) or collides with a
  // heading id, so an anchor jumps to the wrong place and aria-labelledby names the wrong element.
  it.each(DOCUMENT_IDS)("%s: every id on the page is unique", id => {
    for (const locale of LOCALES) {
      const ids = captures(render(id, locale), /\sid="([^"]+)"/g);
      expect(duplicates(ids), `${id} in ${locale}`).toEqual([]);
    }
  });

  // Catches: contents built from another list than the body, so an entry points nowhere or a
  // section has no entry.
  it.each(DOCUMENT_IDS)("%s: the contents list every section, in order", id => {
    for (const locale of LOCALES) {
      const html = render(id, locale);
      const sections = captures(html, /<section[^>]*\sid="([^"]+)"/g);
      expect(captures(contentsOf(html), /href="#([^"]+)"/g), `${id} in ${locale}`).toEqual(
        sections
      );
      expect(sections).toHaveLength(LEGAL[locale][id].sections.length);
    }
  });

  // Catches: an email or page slot left as raw text, or a link that leaves the reader's language.
  it.each(DOCUMENT_IDS)("%s: fills every slot with a link in the page's locale", id => {
    for (const locale of LOCALES) {
      const html = render(id, locale);
      expect(html, `${id} in ${locale}`).not.toMatch(/\{[a-z]+:[A-Za-z]+\}/);
      for (const href of captures(html, /href="(\/[^"]*)"/g)) {
        expect(href, `${id} in ${locale}`).toMatch(new RegExp(`^/${locale}/`));
      }
    }
  });
});

describe("legal page content", () => {
  // Catches: a placeholder that reaches the page as plain text, so an unfinished policy looks done.
  it("ships no unfilled placeholder and no draft line on any legal page", () => {
    for (const id of ["privacy", "terms", "deleteData"] as const) {
      const html = render(id, "en");
      expect(html.match(/\[[A-Z]+\]/g) ?? [], id).toEqual([]);
      expect(html, id).not.toContain("Draft.");
      if (id !== "deleteData") expect(html, id).toContain("Gran Alacant");
    }
  });

  // Catches: «Last updated» showing a stale or hardcoded date instead of the publish date.
  it("dates the document with the publish date", () => {
    const html = render("privacy", "en");
    expect(html).toContain(
      `<time datetime="${LEGAL_UPDATED}">${formatLegalDate(LEGAL_UPDATED, "en")}</time>`
    );
  });

  // Catches: the deletion button without its address or subject, and a ledger that drops the list of
  // what is deleted when it wraps the section.
  it("gives the delete page its request button and its deleted-and-kept ledger", () => {
    const html = render("deleteData", "en");
    expect(html).toContain('href="mailto:delete@kitto.studio?subject=Delete%20my%20data"');
    const ledger = html.match(/<div data-legal-ledger[\s\S]*?<\/section>/)?.[0] ?? "";
    expect(ledger).toContain("Your game progress and settings. You delete them on your device.");
    expect(ledger).toContain("Your emails and email address. We delete them when you ask.");
    expect(ledger).toContain("Nothing.");
  });
});

const linkTo = (target: string): string => `/xx/${target}/`;

describe("renderLegalHtml", () => {
  // Catches: a mistyped slot (`{emial:support}`) shipped as visible text instead of failing the build.
  it("refuses a slot it does not know", () => {
    expect(() => renderLegalHtml("Write to {emial:support}.", "en", linkTo)).toThrow(
      "[kitto] Unknown slot {emial:support} in a legal text."
    );
    expect(() => renderLegalHtml('<a href="{route:blog}">Blog</a>', "en", linkTo)).toThrow(
      "[kitto] Unknown slot {route:blog} in a legal text."
    );
  });

  // Catches: legal text rendered without its locale's typography, or typography that bends links.
  it("sets the text in the locale's typography before filling slots", () => {
    expect(renderLegalHtml('См. <a href="{route:privacy}">в политике</a>', "ru", linkTo)).toBe(
      'См. <a href="/xx/privacy/">в\u{A0}политике</a>'
    );
  });
});

describe("formatLegalDate", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // Catches: a build machine west of UTC printing the day before the publish date.
  it("prints the publish day in any time zone", () => {
    vi.stubEnv("TZ", "America/Los_Angeles");
    expect(formatLegalDate("2026-11-02", "en")).toBe("November 2, 2026");
    expect(formatLegalDate("2026-11-02", "ru")).toBe("2 ноября 2026 г.");
  });
});

describe("activeSectionIndex", () => {
  // Catches: the contents dot marking the wrong section while reading, or never reaching the last
  // short section at the bottom of the page.
  it("marks the last section whose heading passed the reading line", () => {
    expect(activeSectionIndex([300, 900, 1500], 140, false)).toBe(0);
    expect(activeSectionIndex([-500, 140, 700], 140, false)).toBe(1);
    expect(activeSectionIndex([-900, -300, 700], 140, true)).toBe(2);
    expect(activeSectionIndex([], 140, false)).toBe(-1);
  });
});

describe("legalDocument", () => {
  const own: LegalDocument = { intro: "Своё", inShort: [], sections: [] };
  const english = LEGAL.en.privacy;
  const table = {
    ...LEGAL,
    ru: { ...LEGAL.ru, privacy: own },
    uk: { ...LEGAL.uk, privacy: english }
  };

  // Catches: the «available in English» note missing over untranslated text, or shown over a real
  // translation.
  it("flags a locale that still shows the English text", () => {
    expect(legalDocument("ru", "privacy", table)).toEqual({ document: own, isFallback: false });
    expect(legalDocument("uk", "privacy", table)).toEqual({ document: english, isFallback: true });
    expect(legalDocument("en", "privacy", table)).toEqual({ document: english, isFallback: false });
  });
});

describe("splitSlot", () => {
  // Catches: a translation that lost its `{date}` slot dropping the date from the page.
  it("splits at the slot, or keeps the whole text before the value when the slot is gone", () => {
    expect(splitSlot("Last updated: {date}", "date")).toEqual(["Last updated: ", ""]);
    expect(splitSlot("Mis à jour", "date")).toEqual(["Mis à jour", ""]);
    expect(splitSlot("Обновлено {date} г.", "date")).toEqual(["Обновлено ", " г."]);
  });
});

describe("deletionRequestHref", () => {
  // Catches: an unencoded subject that mail apps cut at the first space or garble in Cyrillic.
  it("encodes the subject of the deletion request", () => {
    expect(deletionRequestHref("Удалить мои данные")).toBe(
      "mailto:delete@kitto.studio?subject=%D0%A3%D0%B4%D0%B0%D0%BB%D0%B8%D1%82%D1%8C%20%D0%BC%D0%BE%D0%B8%20%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5"
    );
  });
});
