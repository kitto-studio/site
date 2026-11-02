# postbuild

The site's post-build steps. Node only: composed into `src/app.ts`, never into `src/spa.tsx`.

**Tier:** Standard. Each step is one file (`not-found.ts`, `sitemap.ts`, `redirects.ts`).

After every build the framework emits `build:complete`; this plugin then writes into the build's
output directory:

| File | What |
|---|---|
| `404.html`, `{lang}/404.html` | The 404 page as a complete document from the page shell (`src/index.html`), English at the root and one per locale (12). Cloudflare Pages serves the nearest `404.html` up the path. |
| `sitemap.xml`, `robots.txt` | Every page in every locale plus the root (89 URLs), each with 12 `xhtml:link` alternates: the 11 locales and `x-default` on the English page. `robots.txt` names the sitemap. |
| `_redirects` | The bare path of every page, with and without its trailing slash, answers 302 with the English page (`/about/ /en/about/ 302`). `/` stays the root language page. |

The 404 pages go first: they copy the fingerprinted asset tags from the root `404.html` the
framework wrote (`build.notFound.body` is `notFoundBody("en")`, which carries the
`<!--moku:assets:css-->` and `<!--moku:assets:js-->` placeholders). The page heads link the same
alternates (`src/lib/head.ts`).

The OG cards are not a post-build step. `bun run og` (`app.assets.og()`) draws them ahead into
`public/og/{lang}/{card}.png`, they are committed, and the build copies `public/` as it is.

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
`bun run build` fails instead of shipping a site without its sitemap or 404 pages.
