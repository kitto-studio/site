# postbuild

The site's post-build steps. Node only: composed into `src/app.ts`, never into `src/spa.tsx`.

**Tier:** Complex. The OG cards are a sub-domain in `og/` (`og/index.ts`, `og/fonts.ts`,
`og/types.ts`); the other steps are one file each.

After every build the framework emits `build:complete`; this plugin then writes into the build's
output directory:

| File | What |
|---|---|
| `404.html`, `{lang}/404.html` | The 404 page as a complete document from the page shell (`src/index.html`), English at the root and one per locale (12). Cloudflare Pages serves the nearest `404.html` up the path. |
| `sitemap.xml`, `robots.txt` | Every page in every locale plus the root (89 URLs), each with 12 `xhtml:link` alternates: the 11 locales and `x-default` on the English page. `robots.txt` names the sitemap. |
| `_redirects` | The bare path of every page, with and without its trailing slash, answers 302 with the English page (`/about/ /en/about/ 302`). `/` stays the root language page. |
| `og/{lang}/{home,game}.png` | The OG cards, 1200 × 630 (22). Satori lays out `src/og/OgCard.tsx`, resvg rasterises it. |

The 404 pages go first: they copy the fingerprinted asset tags from the root `404.html` the
framework wrote (`build.notFound.body` is `notFoundBody("en")`, which carries the
`<!--moku:assets:css-->` and `<!--moku:assets:js-->` placeholders). The page heads link the same
OG card paths and the same alternates (`src/lib/head.ts`).

## Config

| Key | Type | Default | Description |
|---|---|---|---|
| `outDir` | `string` | `"dist"` | Output directory `run()` writes into when it gets none. |
| `template` | `string` | `"src/index.html"` | The page shell (`build.template`) the 404 pages are composed from. |
| `pages` | `readonly string[]` | `[]` | URL pattern of every localized page (`/{lang}/about/`), for the sitemap and `_redirects`. |

`src/app.ts` passes `template` from the same constant as `build.template`, and `pages` as
`pagePatterns(routes)`. The plugin exports that helper; it never reads the route table itself.

## API

### `run(outDir?: string): Promise<PostbuildResult>`

Writes every file above into a built output directory and resolves with the written files,
relative to it. While the `build:complete` run for the same directory is in progress, `run`
returns that run instead of starting a second one.

## Events

Emits none. Listens to `build:complete` (`{ outDir, pageCount, durationMs }`) from `build`.

## Dependencies

- `build` — declares `build:complete`; the edge types the hook. Nothing is required from it.

## Failures

The framework does not await event handlers. A failed run is logged (`postbuild:failed`) and sets
`process.exitCode = 1`. `scripts/build.ts` also awaits `app.postbuild.run(outDir)` after the build:
that call joins the run `build:complete` started and rejects when it fails. Either way
`bun run build` fails instead of shipping a site without its sitemap, 404 pages or cards.

## Fonts

The card fonts come from the pinned `@fontsource` dev dependencies: Nunito 900 (headline), Golos
Text 500 (text), and behind them on ja / ko / zh cards M PLUS Rounded 1c, Gothic A1 or Noto Sans SC
(800 headline, 500 text). Each package splits a face into woff slices by `unicode-range`; a card
loads only the slices its text needs. A character no slice of the card's faces covers stops the
build with the character and its code point.

## Cost

About 0.4 s per card, mostly resvg drawing the sheet's shadows: some 9 s per build for 22 cards. The
state keeps every drawn card for the life of the process (`cards`, keyed `{kind}/{locale}`). The
dev server's rebuilds emit `build:complete` too; they write the kept cards again without drawing
them. The card words come from string tables loaded once per process, so a kept card never goes
stale; a restart draws them all again.
