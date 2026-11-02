// @vitest-environment happy-dom
import { existsSync } from "node:fs";
import path from "node:path";
import { renderToString } from "preact-render-to-string";
import { describe, expect, it } from "vitest";
import type { Locale } from "../../src/i18n/languages";
import { MemoryMissingPage } from "../../src/pages/MemoryMissingPage";

/** Render the game page to static markup inside a detached host, to query it like a page. */
function render(locale: Locale): HTMLElement {
  const host = document.createElement("div");
  host.innerHTML = renderToString(<MemoryMissingPage locale={locale} />);
  return host;
}

describe("A Memory Missing page markup", () => {
  // Catches: a link left on another locale or a hardcoded path, or a `{slot}` printed as text.
  it("leads every link to a page in the page's locale and fills every slot", () => {
    const page = render("uk");
    const links = [...page.querySelectorAll("a")].map(link => link.getAttribute("href"));
    expect(links).toEqual(["/uk/games/", "/uk/support/", "/uk/privacy/"]);
    expect(page.textContent).not.toMatch(/\{\w+\}/);
  });

  // Catches: the gallery or the merge board rendered without its island root, so nothing plays.
  it("hosts the gallery and the merge board, the board after the story", () => {
    const page = render("en");
    const gallery = page.querySelector('[data-island="gallery"]');
    const story = page.querySelector("[data-game-story]");
    const board = page.querySelector('[data-island="merge-board"]');
    expect(gallery).not.toBeNull();
    expect(board).not.toBeNull();
    expect(story?.compareDocumentPosition(board as Node)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  // Catches: an image pointing at art that is not shipped, such as a thumbnail name that does not exist.
  it("shows only art that exists in public/", () => {
    const sources = [...render("en").querySelectorAll("img")].map(
      image => image.getAttribute("src") ?? ""
    );
    expect(sources.length).toBeGreaterThan(0);
    const missing = sources.filter(src => !existsSync(path.join("public", src)));
    expect(missing).toEqual([]);
  });
});
