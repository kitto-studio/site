/**
 * @file Postbuild API: `run` writes every post-build file into a built output directory, and the
 * `build:complete` handler starts the same run after each build. One run per directory at a time:
 * a second call while a run is in progress gets that run.
 */
import path from "node:path";
import { writeNotFoundPages } from "./not-found";
import { writeOgCards } from "./og";
import { writeRedirects } from "./redirects";
import { writeSitemap } from "./sitemap";
import type { Api, PostbuildContext, PostbuildResult } from "./types";

/**
 * Join the run in progress under a key, or start one. The run leaves the map when it settles,
 * resolved or rejected, so the next call starts fresh.
 *
 * @param runs - Runs in progress, by key.
 * @param key - The run's key.
 * @param start - Starts the run when none is in progress.
 * @returns The run in progress.
 */
export function joinRun<Result>(
  runs: Map<string, Promise<Result>>,
  key: string,
  start: () => Promise<Result>
): Promise<Result> {
  const pending = runs.get(key);
  if (pending) return pending;
  const run = start().finally(() => runs.delete(key));
  runs.set(key, run);
  return run;
}

/**
 * Write every post-build file. The 404 pages go first: they read the build's own output, so a
 * broken build stops the run before anything else is written. The pages come from the config,
 * and the OG cards drawn by an earlier run come from the state.
 *
 * @param ctx - Plugin context.
 * @param outputDirectory - The built output directory.
 * @returns Every file written, relative to `outputDirectory`.
 */
async function writePostbuildFiles(
  ctx: PostbuildContext,
  outputDirectory: string
): Promise<string[]> {
  const { pages, template } = ctx.config;
  const notFound = await writeNotFoundPages(outputDirectory, template);
  const sitemap = await writeSitemap(outputDirectory, pages);
  const redirects = await writeRedirects(outputDirectory, pages);
  const cards = await writeOgCards(outputDirectory, ctx.state.cards);
  return [...notFound, ...sitemap, ...redirects, ...cards];
}

/**
 * Run the post-build steps into a built output directory, or join the run in progress there.
 *
 * @param ctx - Plugin context.
 * @param outputDirectory - The built output directory.
 * @returns Every file written, relative to `outputDirectory`.
 */
export function runPostbuild(
  ctx: PostbuildContext,
  outputDirectory: string
): Promise<PostbuildResult> {
  return joinRun(ctx.state.runs, path.resolve(outputDirectory), async () => {
    const files = await writePostbuildFiles(ctx, outputDirectory);
    ctx.log.info("postbuild:done", { outDir: outputDirectory, files: files.length });
    return { files };
  });
}

/**
 * The `build:complete` handler: run the post-build steps into the build's output directory. The
 * framework does not await events, so a failure is logged here and fails the process exit code,
 * instead of leaving a green build without its sitemap or 404 pages.
 *
 * @param ctx - Plugin context.
 * @param outputDirectory - The output directory of the finished build.
 * @returns Settles when the run has finished, never rejects.
 */
export async function handleBuildComplete(
  ctx: PostbuildContext,
  outputDirectory: string
): Promise<void> {
  try {
    await runPostbuild(ctx, outputDirectory);
  } catch (error) {
    const cause = error instanceof Error ? error : new Error(String(error));
    ctx.log.error("postbuild:failed", { outDir: outputDirectory }, cause);
    process.exitCode = 1;
  }
}

/**
 * Build the postbuild API.
 *
 * @param ctx - Plugin context.
 * @returns The API mounted as `app.postbuild`.
 */
export function createPostbuildApi(ctx: PostbuildContext): Api {
  return {
    run: (outputDirectory = ctx.config.outDir) => runPostbuild(ctx, outputDirectory)
  };
}
