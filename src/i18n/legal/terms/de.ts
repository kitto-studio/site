/**
 * @file German «Nutzungsbedingungen», translated from `en.ts`.
 *
 * Same sections, blocks, slots and tags as `en.ts`; only the words are translated. The text says
 * «du», the same as the rest of the German site.
 */
import type { LegalDocument } from "../../types";

/** The German «Terms of Use» document. */
export const termsDe: LegalDocument = {
  intro:
    "Diese Bedingungen gelten, wenn du Spiele von Kitto und die Website kitto.studio nutzt. Mit der Nutzung stimmst du diesen Bedingungen zu. Sie sind kurz, also lies sie bitte.",
  inShort: [
    "Du darfst unsere Spiele und unsere Website privat und nicht kommerziell nutzen.",
    "Die Spiele und alle ihre Inhalte gehören Kitto Studio.",
    "Käufe laufen über den App Store oder Google Play, nach deren Bedingungen.",
    "Spiel fair und missbrauche weder die Spiele noch die Website."
  ],
  sections: [
    {
      id: "who",
      heading: "Wer wir sind",
      blocks: [
        {
          kind: "paragraph",
          html: "Kitto Studio ist ein kleines Familienstudio, das Puzzlespiele fürs Handy macht. Kitto Studio wird von einer Privatperson betrieben: Hanna Kucherenko, Calle Ventura Selva González 9, Bungalow 28, 03130 Gran Alacant, Santa Pola (Alicante), Spanien. Diese Bedingungen sind eine Vereinbarung zwischen dir und uns. Du erreichst uns unter {email:support}."
        }
      ]
    },
    {
      id: "licence",
      heading: "Deine Lizenz",
      blocks: [
        {
          kind: "paragraph",
          html: "Wir gewähren dir eine persönliche, nicht ausschließliche und nicht übertragbare Lizenz, unsere Spiele und unsere Website für deine private, nicht kommerzielle Nutzung herunterzuladen und zu nutzen."
        },
        {
          kind: "paragraph",
          html: "Ohne unsere schriftliche Erlaubnis darfst du sie nicht für kommerzielle Zwecke nutzen."
        }
      ]
    },
    {
      id: "content",
      heading: "Unsere Inhalte",
      blocks: [
        {
          kind: "paragraph",
          html: "Unsere Spiele, unsere Website und alle ihre Inhalte, darunter Grafiken, Figuren, Musik, Texte, Code sowie der Name und das Logo Kitto, gehören Kitto Studio. Sie sind durch Gesetze zum Schutz des geistigen Eigentums geschützt."
        },
        {
          kind: "paragraph",
          html: "Diese Bedingungen geben dir daran keine Rechte über die oben genannte Lizenz hinaus."
        }
      ]
    },
    {
      id: "purchases",
      heading: "Käufe",
      blocks: [
        {
          kind: "paragraph",
          html: "Wenn ein Spiel Käufe anbietet, werden sie über den Apple App Store oder Google Play verkauft und abgewickelt. Für Zahlungen und Erstattungen gelten deren Bedingungen. Wenn du eine Erstattung möchtest, wende dich an den Store, in dem du den Kauf getätigt hast."
        },
        { kind: "paragraph", html: "Wir erhalten nie deine Zahlungsdaten." }
      ]
    },
    {
      id: "use",
      heading: "Zulässige Nutzung",
      blocks: [
        {
          kind: "paragraph",
          html: "Wenn du unsere Spiele und unsere Website nutzt, unterlasse bitte Folgendes:"
        },
        {
          kind: "list",
          items: [
            "das Kopieren, Verkaufen, Vermieten oder Weiterverbreiten unserer Spiele oder ihrer Inhalte;",
            "das Zurückentwickeln (Reverse Engineering), Dekompilieren oder Verändern der Spiele, soweit das Gesetz es nicht erlaubt;",
            "den Einsatz von Tools, die die Funktionsweise der Spiele beeinträchtigen;",
            "die Nutzung unserer Spiele oder unserer Website, um gegen Gesetze zu verstoßen oder anderen zu schaden;",
            "Versuche, unsere Website zu stören oder dir unbefugt Zugang zu ihr zu verschaffen."
          ]
        }
      ]
    },
    {
      id: "as-is",
      heading: "Spiele „wie besehen“",
      blocks: [
        {
          kind: "paragraph",
          html: "Wir machen unsere Spiele mit Sorgfalt. Soweit gesetzlich zulässig, stellen wir sie „wie besehen“ und „wie verfügbar“ bereit. Wir versprechen nicht, dass sie fehlerfrei oder immer verfügbar sind."
        },
        {
          kind: "paragraph",
          html: "Nichts in diesen Bedingungen schränkt deine Rechte als Verbraucher ein, die gesetzlich nicht eingeschränkt werden können."
        }
      ]
    },
    {
      id: "liability",
      heading: "Haftungsbeschränkung",
      blocks: [
        {
          kind: "paragraph",
          html: "Soweit gesetzlich zulässig, haftet Kitto Studio nicht für indirekte Schäden oder Folgeschäden, die sich aus deiner Nutzung unserer Spiele oder unserer Website ergeben."
        },
        {
          kind: "paragraph",
          html: "Dein Fortschritt wird nur auf deinem Gerät gespeichert. Wenn du ein Spiel löschst oder seine Daten entfernst, ist dein Fortschritt weg, und wir können ihn nicht wiederherstellen."
        },
        {
          kind: "paragraph",
          html: "Nichts in diesen Bedingungen schließt eine Haftung aus, die gesetzlich nicht ausgeschlossen werden kann."
        }
      ]
    },
    {
      id: "law",
      heading: "Anwendbares Recht",
      blocks: [
        { kind: "paragraph", html: "Für diese Bedingungen gilt spanisches Recht." },
        {
          kind: "paragraph",
          html: "Wenn du Verbraucher bist, behältst du zusätzlich den Schutz der zwingenden Vorschriften des Landes, in dem du lebst."
        }
      ]
    },
    {
      id: "privacy",
      heading: "Datenschutz",
      blocks: [
        {
          kind: "paragraph",
          html: 'Wie wir mit Informationen umgehen, erklären wir in unserer <a href="{route:privacy}">Datenschutzerklärung</a>. Kurz gesagt: Unsere Spiele speichern alles auf deinem Gerät, und wir erheben keine personenbezogenen Daten.'
        }
      ]
    },
    {
      id: "changes",
      heading: "Änderungen dieser Bedingungen",
      blocks: [
        {
          kind: "paragraph",
          html: "Wir können diese Bedingungen aktualisieren. Dann aktualisieren wir diese Seite und das Datum „Zuletzt aktualisiert“ oben. Wenn du unsere Spiele nach einer Änderung weiter nutzt, gelten die aktualisierten Bedingungen."
        }
      ]
    },
    {
      id: "contact",
      heading: "Kontakt",
      blocks: [
        { kind: "paragraph", html: "Fragen zu diesen Bedingungen? Schreib an {email:support}." }
      ]
    }
  ]
};
