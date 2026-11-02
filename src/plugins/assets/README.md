# assets

The site's committed media. Node only: composed into `src/app.ts`, never into `src/spa.tsx`.

**Tier:** Standard

`bun run images` and `bun run icons` call this plugin (`scripts/images.ts`, `scripts/icons.ts` are
one-line passthroughs). The build never runs it: the outputs are committed under `public/`.

| Method | Reads | Writes |
|---|---|---|
| `images()` | the Astra masters in `assets/site-art/**` | the webp files in `public/media/**` |
| `icons()` | `public/favicon.svg` | `public/apple-touch-icon.png` (180), `public/icon-512.png` (512) |

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

## Events

Emits none, listens to none.

## Dependencies

None. `sharp` (dev dependency) does the encoding.
