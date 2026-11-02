import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createPostbuildApi, handleBuildComplete, joinRun } from "../../api";
import { createPostbuildState } from "../../state";
import type { PostbuildContext } from "../../types";

let outDir = "";

beforeEach(async () => {
  outDir = await mkdtemp(path.join(tmpdir(), "kitto-postbuild-"));
});

afterEach(async () => {
  await rm(outDir, { recursive: true, force: true });
});

/** A context over the output directory; with no build in it, every run fails at once. */
const createCtx = (pages: readonly string[] = []): PostbuildContext => ({
  config: { outDir, template: "src/index.html", pages },
  state: createPostbuildState(),
  log: { info: vi.fn(), error: vi.fn() }
});

// Catches: two runs writing the same files at once (the build's and a caller's), and a finished or
// failed run that blocks every later one.
describe("joinRun", () => {
  it("returns the run in progress for the same key and starts fresh once it settles", async () => {
    const runs = new Map<string, Promise<number>>();
    const start = vi.fn(() => Promise.resolve(1));

    const first = joinRun(runs, "dist", start);
    expect(joinRun(runs, "dist", start)).toBe(first);
    await first;
    await joinRun(runs, "dist", start);

    expect(start).toHaveBeenCalledTimes(2);
  });

  it("forgets a failed run", async () => {
    const runs = new Map<string, Promise<number>>();

    await expect(joinRun(runs, "dist", () => Promise.reject(new Error("boom")))).rejects.toThrow();

    expect(runs.size).toBe(0);
  });
});

// Catches: a failed post-build step after the build that leaves a green exit code and no message
// (the framework does not await events), and `run()` ignoring the configured directory.
describe("postbuild runs", () => {
  it("logs a failed run after build:complete and fails the exit code", async () => {
    const ctx = createCtx();
    const previous = process.exitCode;
    try {
      await handleBuildComplete(ctx, outDir);

      expect(ctx.log.error).toHaveBeenCalledWith("postbuild:failed", { outDir }, expect.any(Error));
      expect(process.exitCode).toBe(1);
    } finally {
      process.exitCode = previous;
    }
  });

  it("runs into the configured directory when run() gets none", async () => {
    await expect(createPostbuildApi(createCtx()).run()).rejects.toThrow(outDir);
  });
});

const ASSETS =
  '<link rel="stylesheet" href="/assets/main-1a2b.css"><script type="module" src="/assets/spa-3c4d.js"></script>';

// Runs over a built output directory: the framework's root 404 with its asset tags is there.
describe("a run over a built directory", () => {
  beforeEach(async () => {
    await writeFile(path.join(outDir, "404.html"), `<body>${ASSETS}</body>`);
  });

  // Catches: _redirects and the sitemap built from something else than the configured pages.
  it("lists the configured pages", async () => {
    await createPostbuildApi(createCtx(["/{lang}/", "/{lang}/about/"])).run();

    expect(await readFile(path.join(outDir, "_redirects"), "utf8")).toBe(
      "/about/ /en/about/ 302\n/about /en/about/ 302\n"
    );
  });
});
