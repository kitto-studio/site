import { readFileSync } from "node:fs";
import { renderToString } from "preact-render-to-string";
import { describe, expect, it } from "vitest";
import { Logo } from "../../src/components/Logo";

const SOURCE = "assets/brand/wordmark/vector/kitto-wordmark.svg";

const attributes = (svg: string, name: string): string[] =>
  [...svg.matchAll(new RegExp(`\\s${name}="([^"]*)"`, "g"))].map(match => match[1] ?? "");

// Catches: a redrawn, retraced or edited wordmark. The brand allows only the exact source vector.
describe("Logo", () => {
  it("draws the wordmark with the source file's paths, transforms and viewBox, byte for byte", () => {
    const source = readFileSync(SOURCE, "utf8");
    const rendered = renderToString(<Logo />);

    expect(attributes(rendered, "d")).toEqual(attributes(source, "d"));
    expect(attributes(rendered, "transform")).toEqual(attributes(source, "transform"));
    expect(attributes(rendered, "viewBox")).toEqual(attributes(source, "viewBox"));
    expect(attributes(rendered, "data-part")).toEqual(["k", "i", "tt", "o", "dot"]);
    expect(attributes(rendered, "data-fill")).toEqual(["ink", "ink", "ink", "ink", "dot"]);
  });
});
