# Kitto Studio site

The studio site for https://kitto.studio. A Layer-3 static site on `@moku-labs/web`.

## Package Manager

Use `bun` exclusively. Never npm, yarn or pnpm.

## Scripts

- `bun run build` — static build to `dist/`, with the post-build steps
- `bun run dev` — build, serve, watch and live-reload (port 4173)
- `bun run preview` — serve the built `dist/`
- `bun run images` — `assets/site-art/**` PNG masters → `public/media/**` webp (idempotent, outputs committed)
- `bun run icons` — `public/favicon.svg` → `public/apple-touch-icon.png` and `public/icon-512.png`
- `bun run og` — redraw the stale OG cards → `public/og/**` PNG + `assets/og-manifest.json` (idempotent, outputs committed). Run it after a change to a card's row, words, art or code
- `bun run lint` — Biome check + oxlint (`lint:fix` writes the fixes)
- `bun run format` — Biome format
- `bun run typecheck` — `tsc --noEmit` (TypeScript 7)
- `bun run test` — vitest unit + integration (`test:coverage` is what CI runs)
- `bun run deploy` — Cloudflare Pages. Only after Alex agrees. Steps: `docs/runbook.md`

## Architecture

Two compositions share one route table:

- `src/app.ts` — Node app: `createApp` from `@moku-labs/web` with the build, deploy and cli plugins and the site's `postbuild` plugin. Calls `attachPages(routes)`
- `src/spa.tsx` — browser app (`build.clientEntry`): islands and same-locale HTML-fetch navigation. No `dataPlugin`, no pages, no string tables (guarded by `tests/integration/bundle.test.ts`)
- `src/routes.tsx` — the one route table: 9 routes, every page under a required `{lang}`, plus `urls` for every link
- `src/config.ts` — site identity (`SITE`), mail addresses (`EMAILS`), legal date
- `src/index.html` — page shell: no-flash theme script, favicon, manifest

Code:

- `src/pages/` — one `*Page.tsx` (+ `.css`) per route; `index.tsx` has `attachPages`, which records each page's layout, body and head on the route table (build only)
- `src/layouts/SiteLayout.tsx` — skip link, header, `<main><div data-page>`, footer
- `src/components/` — SSG markup, one `.tsx` + `.css` each (`@scope` on `data-component`, no class selectors)
- `src/islands/` — client behaviour; `index.ts` is the registry. Bigger islands split into a folder (`chrome/`, `gallery/`, `merge-board/`). Islands read their strings from `data-*` attributes written at build time
- `src/lib/` — pure helpers: locale pick, Jump physics, parallax, gallery, merge game, typography, legal, head, 404 body, `game.ts` (`GALLERY`)
- `src/plugins/assets/` — Node-only Layer-3 plugin: `app.assets.images()` (Astra PNG masters in `assets/site-art` → `public/media` webp + thumbs), `app.assets.icons()` (apple-touch and 512 icons) and `app.assets.og()` (OG cards, satori + resvg, `src/og/OgCard.tsx`, code in `og/` → `public/og` PNG + `assets/og-manifest.json`, only the stale cards). `scripts/images.ts`, `scripts/icons.ts` and `scripts/og.ts` are one-line passthroughs. `__tests__/unit/og-manifest.test.ts` fails on a stale card
- `src/plugins/postbuild/` — Node-only Layer-3 plugin on `build:complete`: per-locale 404s, hreflang sitemap, `robots.txt`, `_redirects`. Tests in its `__tests__/`
- `src/i18n/` — `languages.ts` (11 locales), `types.ts` (`UIStrings`), `locales/<code>.ts`, `legal/{privacy,terms,delete-data}/<code>.ts`, `index.ts` (`t(locale)`, `LEGAL`)
- `src/styles/` — `main.css` layer order `reset, tokens, base, components, animations, utilities`; `tokens.css` primitives + semantic tokens; `fonts.css` Latin faces
- `scripts/*.ts` — `build`, `serve`, `preview`, `deploy` are thin entries over `app.cli.*`; `images` and `icons` are sharp pipelines

Assets:

- `public/` — served as is: `fonts/` (vendored woff2), `css/fonts-{ja,ko,zh}.css`, `media/` (generated webp), icons, `_headers`
- `assets/site-art/` — Astra PNG masters with `manifest.json` per set; source of `public/media/`
- `assets/brand/` — logo masters

Tests:

- `tests/unit/` — `lib/` modules, markup, islands (`mountIsland`, happy-dom)
- `tests/integration/` — the real Node app, the build, the client bundle guard

## Docs

- `README.md` — URL map, store URLs, how to add a game, a picture, a language, art
- `docs/runbook.md` — Cloudflare: deploy, rollback, mail routing, redirects
- `docs/translations.md` — languages, review passes, open questions

## Brand

- `brand/BRAND.md` is the source of colors, fonts and logo rules. `brand/STYLE.md` is the full brand system.
- The logo comes only from `assets/brand/wordmark/vector/kitto-wordmark.svg`. Never redraw it.
