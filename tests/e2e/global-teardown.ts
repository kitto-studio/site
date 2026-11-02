/**
 * @file Server-side error scan. The webServer tees the build and the preview server's stdout and
 * stderr into `e2e-server.log`; after the run any error-level line fails the suite. A reused
 * server writes no log, so a missing file is reported and skipped.
 */
import { existsSync, readFileSync } from "node:fs";

/** The log the webServer command writes. */
const SERVER_LOG = "e2e-server.log";

/** Error-level lines of the build, the postbuild plugin and the preview server. */
const ERROR_LINE =
  /level: "(error|fatal)"|\bError\b|Unhandled|uncaught|EADDRINUSE|\bexception\b|✗|FAILED/i;

/**
 * Fail when the server log holds an error line.
 *
 * @throws {Error} When the server logged an error during the run.
 */
export default function globalTeardown(): void {
  if (!existsSync(SERVER_LOG)) {
    console.warn(`[e2e] ${SERVER_LOG} missing (reused server): server-side scan skipped`);
    return;
  }
  const errors = readFileSync(SERVER_LOG, "utf8")
    .split("\n")
    .filter(line => ERROR_LINE.test(line));
  if (errors.length > 0) {
    throw new Error(`[e2e] the server logged errors:\n${errors.join("\n")}`);
  }
}
