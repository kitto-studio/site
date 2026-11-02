/** @file Dev loop (`bun run dev`): build, serve, watch and live-reload. */
import { app } from "../src/app";

await app.cli.serve();
