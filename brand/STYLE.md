# Kitto Studio — brand system

The one place for the studio's visual language: the site, store graphics, icons, social images
and future game marketing. Distilled from the approved site prototype and [BRAND.md](BRAND.md).
BRAND.md stays the short source of colours, fonts and logo rules; this file is the full system.

## 1. Idea in one line

A small studio's desk made of paper. Warm cut paper and felt, real paper shadows, one orange dot.
Calm, crafted, never cute. The logo and its «Прыжок» are the one playful note; motion answers the
reader, it never decorates.

## 2. Logo

- Wordmark: lowercase `kitto`, orange dot over the i. Source: `assets/brand/wordmark/vector/kitto-wordmark.svg`.
  Five `.part` groups: k, i stem, tt, o, dot. Fill only by CSS. On the site `src/components/Logo.tsx`
  draws the vector and `Logo.css` fills it: `[data-fill="ink"]{fill:var(--ink)} [data-fill="dot"]{fill:var(--dot)}`.
- Never redraw, trace, outline, shadow, tilt or recolour the dot. Clear space: one dot diameter. Min width 96 px.
- «Прыжок»: letters drop one by one, 80 ms apart, with a small bounce; the dot drops last at 700 ms
  and squashes on contact. Code: `src/lib/jump.ts` (the drop-bounce physics) and
  `src/islands/logo-jump.ts`. Plays on every page view, click replays it. Reduced motion: no animation.
- The dot alone (`viewBox="320 392 75 74"`, same path; `src/components/DotMark.tsx` on the site) is
  the brand's marker: current item, bullets, status.
- Small mark (favicon, app icons): the «ki with dot» crop of the same vector, `public/favicon.svg`.
  `bun run icons` renders `public/apple-touch-icon.png` and `public/icon-512.png` from it.

## 3. Colour

| Token | Light | Dark | Use |
|---|---|---|---|
| paper | `#F6F2EA` | `#211B18` | page background (with paper grain) |
| surface | `#FFFDF8` | `#2A2420` | sheets, cards, menus |
| ink | `#553C2F` | `#EDE3D3` | logo letters, headings |
| text | `#3B2C24` | `#E6DCCD` | body text |
| muted | `#8A7D72` | `#A39486` | decoration only (fails AA for small text in light) |
| quiet | muted 70% + text | same | small secondary text that must pass AA |
| line | `#E3DACC` | `#3A322C` | hairlines, header border |
| dot | `#D9653A` | `#E2703F` | logo dot, accent, active outline |
| link | `#B4502A` | `#F08A5D` | links |

In code: `src/styles/tokens.css`. Primitives are `--color-<name>-light` and `--color-<name>-dark`;
the semantic tokens (`--paper`, `--ink`, `--dot` …) pick one with `light-dark()`.

Derived tones are only `color-mix` tints of these (well, cut, sheen); no new hues.
Orange is an accent: the dot, links, the active-item outline, one filled button per screen.

## 4. Type

Faces: **Nunito** 800–900 for headings (rounded ends echo the logo), **Golos Text** 400–600 for
text. Both cover Latin and Cyrillic. CJK, loaded only on that locale's pages: **M PLUS Rounded 1c**
(ja), **Gothic A1** (ko), **Noto Sans SC** (zh).

Font files are vendored woff2 in `public/fonts/<family>/`. Latin faces are declared in
`src/styles/fonts.css`; the CJK faces in `public/css/fonts-{ja,ko,zh}.css`, linked only on that
locale's pages. `public/fonts/mplus/mplus-kitto-subset.woff2` holds only き っ と, for the large
kana on the About page in every locale.

| Role | Font | Size | Line height |
|---|---|---|---|
| Display (home hero) | Nunito 900 | clamp(52px, 6.1vw, 94px) | 0.98 |
| Page title (h1) | Nunito 900 | clamp(34px, 5vw, 64px) | 1.08 |
| Section (h2) | Nunito 800 | clamp(30px, 3vw, 42px) | 1.12 |
| Card / item (h3) | Nunito 800 | 19–22px | 1.25 |
| Lead | Golos 400 | clamp(18px, 1.45vw, 21px) | 1.55 |
| Body | Golos 400 | 17px (16px phone) | 1.6 |
| Small / caption | Golos 500 | 14–15px | 1.35 |
| Nav | Nunito 800 | 16px | 1 |

Rules: sentence case, no all-caps labels, `text-wrap: balance` on headings and `pretty` on text,
55–72 ch lines. RU/UK: «ёлочки», spaced em dash, no-break space after short words and before a dash.
FR: narrow no-break space before `; : ! ?`. `src/lib/typography.ts` adds these spaces when a page
renders, so the string tables stay plain text.

## 5. Space, radius, grid

- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.
- Radius scale: 4, 8, 12, 16, 24. Active outline and pills of the menu use 12.
- Grid: `min(1240px, 100% − 2 × gutter)`, gutter 40 px (20 px phone). Header, content and footer share one left edge.
- Header: sticky, 76 px (64 px phone), always on a paper plate (paper 92% + blur, hairline bottom).

## 6. Paper, light and depth

- Paper grain over every paper surface (SVG noise, 7.5% light / 4% dark).
- `cut-shadow` for things lying on the paper; `lift-shadow` for a sheet in the air. Light comes from
  the top in light theme; in dark the shadows are black and soft, like lamp light.
- Wells: recessed slots (`well` tone + inset shadow) for empty places: «Coming soon», merge cells.
- Tape strips hold printed photos. Die-cut stickers stand on a glued paper tab.

## 7. Components

- **Active item**: orange outline `inset 0 0 0 2px var(--dot)`, radius 12 — menu, breadcrumb, gallery thumbnail.
- **Paper sheet**: surface + sheen + grain, radius 16–24, `lift-shadow`; sections stack as sheets.
- **Pop-up sticker**: die-cut object on a paper tab, folds up with a spring as it comes into view.
- **Paper photo**: print with a white border and one or two tape strips.
- **Coming soon slot**: a window cut into the paper, no art, label «Coming soon».
- **Buttons**: one filled orange per screen (text white, ≥ 46 px tall); secondary is ink outline.
- **Menus**: paper popover for languages (native names), sun / system / moon disc for theme;
  phone menu is a paper sheet sliding down with large Nunito items.

Each one is a component in `src/components/` with its own `.css`.

## 8. Motion

- Easing: spring `cubic-bezier(.34,1.45,.55,1)`, out `cubic-bezier(.22,1,.36,1)`. Day/night crossfade 0.9 s.
- One orchestrated moment per page: the home parallax hero (four paper layers, the headline sinks
  behind the hills, sheets slide up as a stack). Inner pages are still.
- Reduced motion: no movement, a complete composed page.

## 9. Art library

Masters (PNG, from Astra) live in `assets/site-art/`. `bun run images` turns them into the webp the
site serves from `public/media/`, with the same folder names.

| Set | Files | Style | Use |
|---|---|---|---|
| Paper landscape layers | `layers/{day,night}-{far,mid,near,front}` | cut paper and felt, transparent, stack exactly | home hero, page bands |
| Studio diorama | `scenes/diorama-{day,night}` | isometric paper-craft room | About |
| Stickers | `stickers/{tea-mug,envelope,gift-box,phone,plant,puzzle-piece,sketchbook,desk-lamp}` | soft 3D paper objects, transparent | pop-ups, icons |
| Clues | `clues/{note,key,photo}-{1,2,3}-…`, `memory-glowing-orb` | painterly detective items | Memory Missing merge board |
| Game art | `game/ward`, `game/game-splash` | Hanna's game art | game page gallery only |

Prompts and sizes for every generated file are in the `manifest.json` beside it in
`assets/site-art/<set>/`, so new icons and objects can be drawn in the same style. Brief for new
icons: «soft rounded paper objects, subtle shading, thin soft shadow, transparent background,
palette above, one orange detail, no text».

## 10. Voice

Plain, warm, short. Sentence case. Speak as two people («we»). No hype, no invented numbers.
Store-facing pages are complete and honest: progress lives on the device, no accounts, no ads, no analytics.
