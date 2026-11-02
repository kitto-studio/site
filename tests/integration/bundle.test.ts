import { spawnSync } from "node:child_process";
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { privacyEn } from "../../src/i18n/legal/privacy/en";
import { en } from "../../src/i18n/locales/en";

/** The client entry, as `build.clientEntry` names it. */
const CLIENT_ENTRY = "src/spa.tsx";

/**
 * Source paths that must never reach the browser: the string tables, the legal documents, the
 * server-rendered pages, components and layout, the site's Node plugins, the Node composition and
 * the OG card renderers.
 */
const SERVER_ONLY =
  /^src\/(?:i18n\/(?:index\.ts|locales\/|legal\/)|pages\/|components\/|layouts\/|plugins\/|og\/|app\.ts)|node_modules\/(?:satori|@resvg|sharp)\//;

/** A static `import … from "node:…"` (a dynamic `import("node:…")` of the framework is lazy). */
const STATIC_NODE_IMPORT = /\b(?:from|import)\s*["']node:/;

/** The bundle metafile, as far as this test reads it. */
type Metafile = {
  /** Every module of the graph, by project-relative path. */
  inputs: Record<string, unknown>;
};

let outDir = "";
let code = "";
let modules: string[] = [];

// The build's own bundle step needs the Bun runtime and vitest runs on Node, so the client entry is
// bundled by the Bun CLI with the build's settings: browser target, code splitting, minified.
beforeAll(async () => {
  outDir = await mkdtemp(path.join(tmpdir(), "kitto-client-"));
  const metafile = path.join(outDir, "meta.json");
  const result = spawnSync(
    "bun",
    [
      "build",
      CLIENT_ENTRY,
      "--target=browser",
      "--splitting",
      "--minify",
      `--outdir=${path.join(outDir, "assets")}`,
      `--metafile=${metafile}`
    ],
    { encoding: "utf8" }
  );
  if (result.status !== 0) throw new Error(`bun build failed:\n${result.stderr}`);
  const files = await readdir(path.join(outDir, "assets"));
  const chunks = await Promise.all(
    files
      .filter(file => file.endsWith(".js"))
      .map(file => readFile(path.join(outDir, "assets", file), "utf8"))
  );
  code = chunks.join("\n");
  const meta = JSON.parse(await readFile(metafile, "utf8")) as Metafile;
  modules = Object.keys(meta.inputs);
}, 60_000);

afterAll(async () => {
  await rm(outDir, { recursive: true, force: true });
});

// Catches: an island or the route table importing the string registry, a page or a Node module,
// which puts every locale's strings and legal documents (or Node code) into the client bundle.
describe("client bundle", () => {
  it("carries no string table, legal text, page or Node-only module", () => {
    expect(modules).toContain(CLIENT_ENTRY);
    expect(modules.filter(module => SERVER_ONLY.test(module))).toEqual([]);
  });

  // A boolean, not `toContain`: a failure would print the whole bundle.
  it("contains no legal sentence and no page copy", () => {
    expect(code.includes(privacyEn.intro.slice(0, 60)), "privacy policy text").toBe(false);
    expect(code.includes(en.meta.about.description), "about page copy").toBe(false);
  });

  it("has no static node: import", () => {
    expect(code).not.toMatch(STATIC_NODE_IMPORT);
  });
});
