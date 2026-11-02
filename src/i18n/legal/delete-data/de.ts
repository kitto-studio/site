/**
 * @file German «Daten löschen», translated from `en.ts`.
 *
 * Same sections, blocks, slots and tags as `en.ts`; only the words are translated. Menu labels are
 * the ones Android and iOS show in German. The mail subject stays «Delete my data», the same as
 * `deleteData.mailSubject` in `locales/de.ts`.
 */
import type { LegalDocument } from "../../types";

/** The German «Delete your data» document. */
export const deleteDataDe: LegalDocument = {
  intro: "Auf dieser Seite erfährst du, wie du deine Daten aus Spielen von Kitto Studio löschst.",
  inShort: [
    "Es gibt kein Konto, also auch kein Konto zum Löschen.",
    "Wir speichern keine Spieldaten auf unseren Servern.",
    "Spieldaten liegen nur auf deinem Gerät. Du kannst sie mit ein paar Fingertipps selbst löschen.",
    "Wenn du uns geschrieben hast, löschen wir deine E-Mails innerhalb von 30 Tagen nach deiner Anfrage."
  ],
  sections: [
    {
      id: "nothing",
      heading: "Kein Konto, nichts auf unseren Servern",
      blocks: [
        {
          kind: "paragraph",
          html: "Unsere Spiele haben keine Konten und senden uns keine Daten. Dein Fortschritt und deine Einstellungen werden nur auf deinem Gerät gespeichert."
        },
        {
          kind: "paragraph",
          html: "Auf unserer Seite gibt es also nichts zu löschen. Du hast die volle Kontrolle über deine Spieldaten."
        }
      ]
    },
    {
      id: "android",
      heading: "Spieldaten auf Android löschen",
      blocks: [
        {
          kind: "steps",
          items: [
            "Öffne auf deinem Handy die <b>Einstellungen</b>.",
            "Tippe auf <b>Apps</b>.",
            "Suche das Spiel und tippe darauf, zum Beispiel <b>A Memory Missing: Merge Game</b>.",
            "Tippe auf <b>Speicher</b>.",
            "Tippe auf <b>Speicherinhalt löschen</b>."
          ]
        },
        {
          kind: "paragraph",
          html: "Oder deinstalliere das Spiel: Dann werden alle seine Daten von deinem Handy entfernt. Die Menünamen können sich je nach Handy etwas unterscheiden."
        }
      ]
    },
    {
      id: "iphone",
      heading: "Spieldaten auf dem iPhone löschen",
      blocks: [
        {
          kind: "steps",
          items: [
            "Lege auf dem Home-Bildschirm den Finger auf das Symbol des Spiels und halte ihn gedrückt.",
            "Tippe auf <b>App entfernen</b>.",
            "Tippe auf <b>App löschen</b> und dann auf <b>Löschen</b>."
          ]
        },
        {
          kind: "paragraph",
          html: "Wenn du die App löschst, werden alle ihre Daten von deinem iPhone entfernt."
        }
      ]
    },
    {
      id: "email",
      heading: "Wenn du uns geschrieben hast",
      blocks: [
        {
          kind: "paragraph",
          html: "Wenn du uns eine E-Mail geschickt hast, haben wir deine E-Mail-Adresse und deine Nachrichten. So lässt du sie löschen:"
        },
        {
          kind: "steps",
          items: [
            "Schreib an {email:delete}, und zwar von der Adresse, die du vorher verwendet hast.",
            "Verwende den Betreff „Delete my data“.",
            "Wir löschen deine Nachrichten innerhalb von 30 Tagen und schicken dir eine Bestätigung."
          ]
        }
      ]
    },
    {
      id: "kept",
      heading: "Was gelöscht wird und was bleibt",
      blocks: [
        {
          kind: "list",
          items: [
            "Dein Spielfortschritt und deine Einstellungen. Du löschst sie auf deinem Gerät.",
            "Deine E-Mails und deine E-Mail-Adresse. Wir löschen sie, wenn du darum bittest."
          ]
        }
      ]
    },
    {
      id: "questions",
      heading: "Fragen",
      blocks: [
        {
          kind: "paragraph",
          html: 'Schreib an {email:delete}. Wie wir mit Daten umgehen, erklären wir in unserer <a href="{route:privacy}">Datenschutzerklärung</a>.'
        }
      ]
    }
  ]
};
