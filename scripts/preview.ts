/**
 * @file Static preview server (`bun run preview`) over the built output dir. `--port <n>` binds
 * another port than the cli default, so the e2e suite never reuses a preview someone left running.
 */
import { app } from "../src/app";

const portFlag = process.argv.indexOf("--port");
const port = portFlag === -1 ? undefined : Number(process.argv[portFlag + 1]);

await app.cli.preview(port === undefined || Number.isNaN(port) ? {} : { port });
