// @vitest-environment happy-dom
import type { VNode } from "preact";
import { renderToString } from "preact-render-to-string";
import { describe, expect, it } from "vitest";
import { DotMark } from "../../src/components/DotMark";
import { Logo } from "../../src/components/Logo";
import { SiteLayout } from "../../src/layouts/SiteLayout";

/** Render a component to static markup inside a detached host, to query it like a page. */
function render(vnode: VNode): HTMLElement {
  const host = document.createElement("div");
  host.innerHTML = renderToString(vnode);
  return host;
}

/** Every value of one attribute in a markup string, in order. */
const attributes = (markup: string, name: string): string[] =>
  [...markup.matchAll(new RegExp(`\\s${name}="([^"]*)"`, "g"))].map(match => match[1] ?? "");

describe("chrome markup", () => {
  // Catches: a page that loads with no current mark (or the wrong one) before any navigation.
  it("marks the current page at build time: Games on the game page, the footer link on a legal page", () => {
    const game = render(
      <SiteLayout locale="en" page="memoryMissing">
        <p />
      </SiteLayout>
    );
    const marked = [...game.querySelectorAll("a[aria-current]")];
    expect(
      marked.map(link => [link.getAttribute("href"), link.getAttribute("aria-current")])
    ).toEqual([
      ["/en/games/", "true"],
      ["/en/games/", "true"]
    ]);

    const privacy = render(
      <SiteLayout locale="en" page="privacy">
        <p />
      </SiteLayout>
    );
    const current = privacy.querySelector('footer a[aria-current="page"]');
    expect(current?.getAttribute("href")).toBe("/en/privacy/");
    expect(current?.querySelector("[data-dot-mark]")).not.toBeNull();
  });

  // Catches: a redrawn or edited dot. The brand allows only the wordmark's own dot as the marker.
  it("draws the dot marker with the wordmark's dot path and transform, byte for byte", () => {
    const logo = renderToString(<Logo />);
    const logoDot = logo.slice(logo.indexOf('data-part="dot"'));
    const dot = renderToString(<DotMark />);

    expect(attributes(dot, "d")).toEqual(attributes(logoDot, "d"));
    expect(attributes(dot, "transform")).toEqual(attributes(logoDot, "transform"));
    expect(attributes(dot, "viewBox")).toEqual(["320 392 75 74"]);
  });
});
