# Translations

The site speaks 11 languages. English is the source. Every other language has the same key tree,
the same legal sections and the same `{slot}` tokens; `tests/unit/i18n.test.ts` fails when one
drifts.

Files per language: `src/i18n/locales/<code>.ts` (UI strings) and
`src/i18n/legal/{privacy,terms,delete-data}/<code>.ts` (the legal pages).

## Languages

| Code | `lang` | Name | Quality | Register |
|---|---|---|---|---|
| `en` | `en` | English | source | — |
| `ru` | `ru` | Русский | hand quality | «вы» |
| `uk` | `uk` | Українська | hand quality | «ви» |
| `es` | `es` | Español | machine, 3 passes | tú (Spain) |
| `pt` | `pt-BR` | Português | machine, 3 passes | você (Brazil) |
| `de` | `de` | Deutsch | machine, 3 passes | du, also in legal |
| `fr` | `fr` | Français | machine, 3 passes | vous |
| `it` | `it` | Italiano | machine, 3 passes | tu |
| `ja` | `ja` | 日本語 | machine, 3 passes | です/ます |
| `ko` | `ko` | 한국어 | machine, 3 passes | 해요체 in UI, 합니다체 in legal |
| `zh` | `zh-Hans` | 简体中文 | machine, 3 passes | 你 in UI, 您 in legal |

- **Hand quality** (`ru`, `uk`): the approved prototype copy, read and fixed by hand with the same
  three passes.
- **Machine** (the other 8): translated from `en`, then checked in three review passes. Nobody who
  speaks the language has read them yet.

Approved slogans, used verbatim:

| | Slogan |
|---|---|
| en | Surely worth playing. |
| ru | Непременно стоит сыграть. |
| uk | Неодмінно варто зіграти. |
| es | Sin duda, vale la pena jugar. |
| pt | Com certeza vale a pena jogar. |
| de | Ganz sicher spielenswert. |
| fr | Ça vaut sûrement le coup d’y jouer. |
| it | Vale sicuramente la pena giocarci. |
| ja | きっと、遊ぶ価値がある。 |
| ko | 틀림없이 해 볼 만한 게임. |
| zh | 一定值得一玩。 |

## The three passes

Each pass runs over every string, in this order.

1. **Meaning.** Translate every string back to English and compare it with `en`, key by key. Fix
   drift: a dropped word («Old key» → «key»), a wrong gender, a double negative, a page name that
   reads as a different thing.
2. **Fluency and terms.** One term per idea per language, written down in a term list. Natural
   phrasing for a small studio. Typography of the language: «ёлочки», „…“, full-width punctuation
   in ja and zh.
3. **Legal accuracy and layout.** Every fact is present in every legal text: owner Hanna
   Kucherenko, the address in Gran Alacant, law of Spain, audience 13+, progress only on the
   device, no accounts, ads, analytics or tracking, purchases through the stores, both mail
   addresses, 30 days and a confirmation, no cookies, Cloudflare server logs, the app ID
   `studio.kitto.memorymissing`. Slots and tags are the same as in `en`. Nav labels and buttons
   stay short.

A script also compares every file with `en`: the same keys, array lengths, section ids, block
kinds, slots and HTML tags. Result: no differences in any language.

Rules that hold in every language:

- «A Memory Missing: Merge Game» is never translated.
- App IDs sit in `<span translate="no">`.
- The legal name-and-address line keeps «Hanna Kucherenko» in Latin.
- Write plain text. `src/lib/typography.ts` adds the no-break spaces of ru, uk and fr when a page
  renders.

## Open: check on a real phone

The delete-data page names the menu items of Android and iOS. They were written from memory of
Pixel phones (Android 12+) and iOS 17–18. The page already says menu names differ between phones.
One look on a real phone per language closes each item.

| Locale | Android | iOS |
|---|---|---|
| uk | «Пам’ять» / «Очистити пам’ять». Pixel shows «Пам’ять і кеш»; Samsung «Пам’ять» › «Очистити дані». | «Вилучити програму» for Remove App. |
| es | — | Step 1 wording («Mantén pulsado»). |
| pt | «Apps» (Pixel). Older phones show «Aplicativos». | — |
| de | «Speicherinhalt löschen» (Pixel). Samsung shows «Speicher» › «Daten löschen». | — |
| fr | — | Step 1 wording («Maintenez le doigt»). |
| it | — | Step 1 wording («Tocca e tieni premuta»). |
| ja | «ストレージ». Pixel shows «ストレージとキャッシュ». | — |
| ko | «저장용량» / «저장용량 비우기». Pixel shows «저장용량 및 캐시»; Samsung «저장공간» › «데이터 삭제». | — |

## Open: questions for Alex

| Locale | Question | Today |
|---|---|---|
| de | Legal pages in «du» or «Sie»? | «du», like the rest of the German site. To switch, change the three `de` legal files. |
| pt | Name Brazil's LGPD in the privacy policy? | Not named. The policy names GDPR, UK GDPR and CCPA, like `en`. Adding it is a content change for every locale, not a translation fix. |
| zh | One register for the whole site? | 你 in the UI, 您 in the legal pages. To unify, change the legal files to 你. |
| zh | Names in Latin or Chinese? | Latin «Alex 和 Hanna». The drafts had «亚历克斯和汉娜». |
| uk | Hanna's name in the legal who-line in Cyrillic? | Latin «Hanna Kucherenko», as a name-and-address line. Site prose says «Ганна». |
| all | Mail subject «Delete my data» stays English in ru, uk, es, pt, de, fr, it? | Yes, as in the approved prototype. ja, ko, zh use a translated subject. The button and the step always match. |
