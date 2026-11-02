import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const WORDMARK = "assets/brand/wordmark/vector/kitto-wordmark.svg";
const FAVICON = "public/favicon.svg";

const attributes = (svg: string, name: string): string[] =>
  [...svg.matchAll(new RegExp(`\\s${name}="([^"]*)"`, "g"))].map(match => match[1] ?? "");

// Catches: a redrawn, retraced or simplified favicon. The small mark is the wordmark's own k, i stem
// and dot, cropped, never drawn again.
describe("favicon", () => {
  it("uses the wordmark's k, i stem and dot paths and transforms, byte for byte", () => {
    const wordmark = readFileSync(WORDMARK, "utf8");
    const favicon = readFileSync(FAVICON, "utf8");
    // The wordmark's parts in order: k, i stem, tt, o, dot.
    const parts = attributes(wordmark, "d");
    const [transform] = attributes(wordmark, "transform");

    expect(attributes(favicon, "d")).toEqual([parts[0], parts[1], parts[4]]);
    expect(attributes(favicon, "transform")).toEqual([transform, transform, transform]);
  });
});
