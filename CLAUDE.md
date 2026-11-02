# Kitto Studio site

The studio site for https://kitto.studio. A Layer-3 static site on `@moku-labs/web`.

## Package Manager

Use `bun` exclusively. Never npm, yarn or pnpm.

## Scripts

- `bun run build` — static build to `dist/`
- `bun run dev` — build, serve, watch and live-reload
- `bun run preview` — serve the built `dist/`
- `bun run lint` — Biome check + oxlint
- `bun run typecheck` — `tsc --noEmit` (TypeScript 7)
- `bun run test` — vitest unit + integration
- `bun run deploy` — Cloudflare Pages. Only after Alex agrees.

## Architecture

- `src/app.ts` — `createApp` from `@moku-labs/web` with the Node-only build, deploy and cli plugins
- `src/routes.tsx` — the one route table
- `src/config.ts` — site identity
- `scripts/*.ts` — thin entries over `app.cli.*`

## Brand

- `brand/BRAND.md` is the source of colors, fonts and logo rules.
- The logo comes only from `assets/brand/wordmark/vector/kitto-wordmark.svg`. Never redraw it.
