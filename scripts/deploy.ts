/** @file Cloudflare Pages deploy (`bun run deploy`); `--cli` takes the direct, CI-safe path. */
import { app } from "../src/app";

await app.cli.deploy({ guided: !process.argv.includes("--cli") });
