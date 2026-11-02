import { describe, expect, it } from "vitest";
import { routes } from "../../../../routes";
import { pagePatterns } from "../../pages";
import { buildRobots, buildSitemap } from "../../sitemap";

const sitemap = buildSitemap(pagePatterns(routes));
const urls = sitemap.split("<url>").slice(1);

const alternatesOf = (loc: string): string[] => {
  const entry = urls.find(url => url.includes(`<loc>${loc}</loc>`)) ?? "";
  return [...entry.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map(
    ([, lang, href]) => `${lang} ${href}`
  );
};

// Catches: a page or a locale missing from the sitemap, or a url without its language alternates.
describe("sitemap", () => {
  it("lists every page in every locale plus the root once, each with 12 alternates", () => {
    expect(urls).toHaveLength(89);
    expect(sitemap.match(/<loc>https:\/\/kitto\.studio\/<\/loc>/g)).toHaveLength(1);
    expect(sitemap).toContain("<loc>https://kitto.studio/zh/games/memory-missing/</loc>");
    for (const url of urls) expect(url.match(/<xhtml:link /g)).toHaveLength(12);
  });

  // Catches: x-default on the bare path (a 302) or on the page's own locale instead of /en/.
  it("points x-default at the English page", () => {
    const alternates = alternatesOf("https://kitto.studio/ru/delete-data/");

    expect(alternates).toContain("uk https://kitto.studio/uk/delete-data/");
    expect(alternates.at(-1)).toBe("x-default https://kitto.studio/en/delete-data/");
    expect(alternatesOf("https://kitto.studio/").at(-1)).toBe("x-default https://kitto.studio/en/");
  });

  // Catches: robots.txt that crawlers cannot use to find the sitemap.
  it("names the sitemap in robots.txt", () => {
    expect(buildRobots()).toContain("Sitemap: https://kitto.studio/sitemap.xml");
  });
});
