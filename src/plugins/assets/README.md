# assets

The site's committed media. Node only: composed into `src/app.ts`, never into `src/spa.tsx`.

**Tier:** Complex. The OG cards are a sub-domain in `og/` (`art.ts`, `fit.ts`, `fonts.ts`,
`hash.ts`, `render.ts`, `write.ts`, `types.ts`); images and icons are one file each.

`bun run images`, `bun run icons` and `bun run og` call this plugin (`scripts/images.ts`,
`scripts/icons.ts`, `scripts/og.ts` are one-line passthroughs). The build never runs it: the
outputs are committed under `public/`.

| Method | Reads | Writes |
|---|---|---|
| `images()` | the Astra masters in `assets/site-art/**` | the webp files in `public/media/**` |
| `icons()` | `public/favicon.svg` | `public/apple-touch-icon.png` (180), `public/icon-512.png` (512) |
| `og()` | `OG_CARDS`, the locale strings, the card code, the art in `public/media/**` | the cards in `public/og/{lang}/{card}.png`, `assets/og-manifest.json` |

## Config

| Key | Type | Default | Description |
|---|---|---|---|
| `sourceDir` | `string` | `"assets/site-art"` | Folder of the masters (PNG) and the game's own webp art. |
| `outDir` | `string` | `"public/media"` | Folder the served files go to, with the same subfolders. |
| `quality` | `number` | `82` | webp quality of every output. |
| `maxSize` | `number` | `1600` | Longer side of a full-size output, px. Never enlarged. |
| `thumbSize` | `number` | `256` | Longer side of a thumbnail, px, also its suffix: `<name>-256.webp`. |
| `thumbFolders` | `readonly string[]` | `["clues", "game"]` | Top-level folders whose images also get a thumbnail (merge board clues, gallery). |
| `icons` | `readonly Icon[]` | 180 and 512 px | Icon files and sizes: `{ output, size }`. |
| `ogDir` | `string` | `"public/og"` | Folder of the OG cards, `<ogDir>/<lang>/<card>.png`, served as `/og/…`. |
| `ogManifest` | `string` | `"assets/og-manifest.json"` | The input hash of every drawn card, keyed `{card}/{lang}`. Outside `public/`, so never served. |

Paths are relative to the project root, where the scripts run.

## API

### `images(): Promise<ImagesResult>`

- Every PNG becomes a webp at `quality`, fitted into `maxSize`.
- A webp (`game/*.webp`) is copied unchanged.
- An image in a `thumbFolders` folder also gets a `<name>-<thumbSize>.webp`.
- Hidden files and anything not PNG or webp (the `manifest.json` files) are left out.
- An output newer than its source is skipped. The encoder is deterministic, so a forced rerun
  writes the same bytes.

Prints `images: N written, M up to date` and resolves with `{ written, upToDate }`.

### `icons(): Promise<IconsResult>`

Each icon is the light favicon centred on the paper colour (`#F6F2EA`), at 78 % of the side, with
room around it for the rounded mask iOS and Android draw. Opaque PNG, deterministic. Prints one
`icons: <file> (<size>×<size>)` line per icon and resolves with `{ files }`.

### `og(): Promise<OgResult>`

- One 1200 × 630 PNG per row of `OG_CARDS` (`src/og/cards.ts`) in every locale. Satori lays out
  `src/og/OgCard.tsx`, resvg rasterises it, sharp packs it into a palette.
- Each card has an input hash (`og/hash.ts`): its row, its words, the card sources (`src/og/**`,
  `src/plugins/assets/og/**`, `src/config.ts`, `src/lib/typography.ts`), the installed satori,
  resvg, sharp and `@fontsource` versions, and the bytes of the art it shows.
- A card whose hash matches `ogManifest` and whose PNG exists is skipped. The rest are drawn one at
  a time. The manifest is written last, so a failed run draws its cards again next time.
- Art comes from `outDir`: run `bun run images` first when a picture changed.

Prints `og: N written, M up to date` and resolves with `{ written, upToDate }`.

## Events

Emits none, listens to none.

## Dependencies

None. `sharp` (dev dependency) does the encoding. The OG cards also use `satori`,
`@resvg/resvg-js` and the `@fontsource` packages (dev dependencies).

## OG card fonts

The card fonts come from the pinned `@fontsource` dev dependencies: Nunito 900 (headline), Golos
Text 500 (text), and behind them on ja / ko / zh cards M PLUS Rounded 1c, Gothic A1 or Noto Sans SC
(800 headline, 500 text). Each package splits a face into woff slices by `unicode-range`; a card
loads only the slices its text needs. A character no slice of the card's faces covers stops
`bun run og` with the character and its code point.
