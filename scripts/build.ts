/**
 * @file SSG build entry (`bun run build`). Thin passthrough to the framework cli plugin; the site's
 * post-build steps run inside the build through the postbuild plugin.
 */
import { app } from "../src/app";

const { outDir } = await app.cli.build();
// `build:complete` starts the post-build run, but events are not awaited: join that run, so a
// failed step fails this command.
await app.postbuild.run(outDir);
