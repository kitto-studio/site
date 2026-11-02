// @vitest-environment happy-dom
import { existsSync } from "node:fs";
import path from "node:path";
import type { VNode } from "preact";
import { renderToString } from "preact-render-to-string";
import { describe, expect, it } from "vitest";
import { AboutPage } from "../../src/pages/AboutPage";
import { GamesPage } from "../../src/pages/GamesPage";
import { PrivacyPage } from "../../src/pages/PrivacyPage";
import { SupportPage } from "../../src/pages/SupportPage";

/** Render a page to static markup inside a detached host, to query it like a page. */
function render(vnode: VNode): HTMLElement {
  const host = document.createElement("div");
  host.innerHTML = renderToString(vnode);
  return host;
}

/** The `href` of every link inside `root`, in order. */
const hrefs = (root: Element): (string | null)[] =>
  [...root.querySelectorAll("a")].map(link => link.getAttribute("href"));

describe("About and Games markup", () => {
  // Catches: a card link left on another locale or a hardcoded path, so a reader changes language.
  it("leads every link of the game card to the game page in the page's locale", () => {
    const page = render(<GamesPage locale="ru" />);
    const card = page.querySelector('[data-component="game-card"]');
    expect(card).not.toBeNull();
    expect(hrefs(card as Element)).toEqual([
      "/ru/games/memory-missing/",
      "/ru/games/memory-missing/",
      "/ru/games/memory-missing/"
    ]);
  });

  // Catches: a `{link}` or `{email}` slot printed as text, or filled with a link of another locale.
  it("fills the contact slots with the mail link and the Support page of the locale", () => {
    const about = render(<AboutPage locale="uk" />);
    const hello = about.querySelector("[data-about-hello]");
    expect(hrefs(hello as Element)).toEqual(["mailto:support@kitto.studio", "/uk/support/"]);
    expect(hello?.querySelector('a[href^="mailto:"]')?.textContent).toBe("support@kitto.studio");

    const games = render(<GamesPage locale="uk" />);
    expect(hrefs(games.querySelector("[data-games-help]") as Element)).toEqual(["/uk/support/"]);

    for (const page of [about, games]) {
      expect(page.textContent).not.toMatch(/\{\w+\}/);
    }
  });

  // Catches: an image pointing at art that is not shipped, such as a layer name that does not exist.
  it("shows only art that exists in public/", () => {
    const sources = [<AboutPage locale="en" />, <GamesPage locale="en" />].flatMap(page =>
      [...render(page).querySelectorAll("img")].map(image => image.getAttribute("src") ?? "")
    );
    expect(sources.length).toBeGreaterThan(0);
    const missing = sources.filter(src => !existsSync(path.join("public", src)));
    expect(missing).toEqual([]);
  });

  // Catches: the kana rendered as one block, so they cannot drop in one by one.
  it("cuts the large kana into one element per glyph on the kana-drop island", () => {
    const kana = render(<AboutPage locale="en" />).querySelector('[data-island="kana-drop"]');
    const glyphs = [...(kana?.querySelectorAll("[data-kana-glyphs] > span") ?? [])];
    expect(glyphs.map(glyph => glyph.textContent)).toEqual(["き", "っ", "と"]);
  });

  // Catches: the band dropped from a page, or moved away from the sheet that tucks over it.
  it("puts the paper band right before the legal sheet and inside the Support page head", () => {
    const legal = render(<PrivacyPage locale="en" />);
    const band = legal.querySelector<HTMLElement>('[data-component="paper-band"]');
    const next = band?.nextElementSibling;
    expect(band?.dataset.edge).toBe("cut");
    expect(next instanceof HTMLElement ? next.dataset.component : undefined).toBe("legal-document");

    const support = render(<SupportPage locale="en" />);
    expect(
      support.querySelector('[data-page-head] > [data-component="paper-band"]')
    ).not.toBeNull();
  });

  // Catches: a class attribute sneaking into the markup (styling goes through data attributes).
  it("renders no class attribute", () => {
    for (const page of [<AboutPage locale="en" />, <GamesPage locale="en" />]) {
      expect(renderToString(page)).not.toMatch(/\sclass(Name)?=/);
    }
  });
});
