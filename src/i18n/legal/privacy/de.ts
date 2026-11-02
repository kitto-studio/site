/**
 * @file German «Datenschutzerklärung», translated from `en.ts`.
 *
 * Same sections, blocks, slots and tags as `en.ts`; only the words are translated. The text says
 * «du», the same as the rest of the German site.
 */
import type { LegalDocument } from "../../types";

/** The German «Privacy Policy» document. */
export const privacyDe: LegalDocument = {
  intro:
    "Diese Erklärung beschreibt, was mit deinen Informationen passiert, wenn du Spiele von Kitto spielst, kitto.studio besuchst oder uns schreibst. Kurz gesagt: Unsere Spiele speichern alles auf deinem Gerät, und wir erheben keine personenbezogenen Daten.",
  inShort: [
    "Unsere Spiele speichern Fortschritt und Einstellungen nur auf deinem Gerät.",
    "Keine Konten, keine Analyse, keine Werbung, kein Tracking.",
    "Wir erheben und verkaufen keine personenbezogenen Daten.",
    "Wenn du uns schreibst, nutzen wir deine Adresse nur, um dir zu antworten."
  ],
  sections: [
    {
      id: "who",
      heading: "Wer wir sind",
      blocks: [
        {
          kind: "paragraph",
          html: "Kitto Studio ist ein kleines Familienstudio. Wir machen Puzzlespiele fürs Handy. Kitto Studio wird von einer Privatperson betrieben: Hanna Kucherenko, Calle Ventura Selva González 9, Bungalow 28, 03130 Gran Alacant, Santa Pola (Alicante), Spanien. Sie ist Verantwortliche für die Verarbeitung der in dieser Erklärung beschriebenen Informationen. Du erreichst uns unter {email:support}."
        }
      ]
    },
    {
      id: "scope",
      heading: "Wofür diese Erklärung gilt",
      blocks: [
        { kind: "paragraph", html: "Diese Erklärung gilt für:" },
        {
          kind: "list",
          items: [
            'Unsere Spiele. Ihre App-IDs beginnen mit studio.kitto, zum Beispiel <span translate="no">studio.kitto.memorymissing</span>. Unser erstes Spiel ist A Memory Missing: Merge Game. Es ist noch nicht erschienen.',
            "Unsere Website, kitto.studio.",
            "E-Mails, die du an {email:support} schickst."
          ]
        }
      ]
    },
    {
      id: "games",
      heading: "Unsere Spiele",
      blocks: [
        {
          kind: "paragraph",
          html: "Unsere Spiele speichern deinen Fortschritt und deine Einstellungen nur auf deinem Gerät. Sie senden sie weder an uns noch an andere."
        },
        {
          kind: "list",
          items: [
            "<strong>Keine Konten.</strong> Du musst dich nie registrieren oder anmelden.",
            "<strong>Keine Analyse.</strong> Wir messen nicht, wie du spielst.",
            "<strong>Keine Werbung.</strong> Unsere Spiele zeigen keine Anzeigen.",
            "<strong>Kein Tracking.</strong> Wir verfolgen dich nicht über Apps oder Websites hinweg.",
            "<strong>Keine datensammelnden SDKs.</strong> Wir nutzen keine SDKs von Drittanbietern, die personenbezogene Daten erheben."
          ]
        },
        {
          kind: "paragraph",
          html: "Wir erheben über unsere Spiele keine personenbezogenen Daten. Deshalb haben wir auch keine, die wir verkaufen oder weitergeben könnten."
        }
      ]
    },
    {
      id: "purchases",
      heading: "Käufe",
      blocks: [
        {
          kind: "paragraph",
          html: "Wenn ein Spiel Käufe anbietet, wickelt der Apple App Store oder Google Play sie nach eigenen Bedingungen ab. Wir erhalten nie deine Zahlungsdaten."
        },
        {
          kind: "paragraph",
          html: 'Wie Apple und Google mit deinen Daten umgehen, erfährst du in der <a href="https://www.apple.com/legal/privacy/" rel="noopener">Datenschutzrichtlinie von Apple</a> und der <a href="https://policies.google.com/privacy" rel="noopener">Datenschutzerklärung von Google</a>.'
        }
      ]
    },
    {
      id: "email",
      heading: "Wenn du uns schreibst",
      blocks: [
        {
          kind: "paragraph",
          html: "Wenn du an {email:support} schreibst, erhalten wir deine E-Mail-Adresse und deine Nachricht. Wir nutzen sie nur, um dir zu antworten."
        },
        {
          kind: "paragraph",
          html: "Wir bewahren sie nur so lange auf, wie wir sie brauchen, um dir zu helfen. Auf deinen Wunsch löschen wir sie."
        }
      ]
    },
    {
      id: "website",
      heading: "Unsere Website",
      blocks: [
        {
          kind: "paragraph",
          html: "kitto.studio ist eine statische Website. Sie verwendet keine Cookies und keine Analyse-Tools."
        },
        {
          kind: "paragraph",
          html: "Sie merkt sich dein gewähltes Design und deine Sprache im lokalen Speicher deines Browsers. Diese Angaben bleiben in deinem Browser, und wir können sie nicht sehen. Du kannst sie jederzeit in den Einstellungen deines Browsers löschen."
        },
        {
          kind: "paragraph",
          html: 'Unser Hosting-Anbieter Cloudflare kann technische Daten wie IP-Adressen in Server-Logs verarbeiten, um die Website sicher zu halten und sie an dich auszuliefern. Lies dazu die <a href="https://www.cloudflare.com/privacypolicy/" rel="noopener">Datenschutzrichtlinie von Cloudflare</a>.'
        }
      ]
    },
    {
      id: "children",
      heading: "Kinder",
      blocks: [
        {
          kind: "paragraph",
          html: "Unsere Spiele richten sich an Spielerinnen und Spieler ab 13 Jahren. Sie sind nicht für Kinder unter 13 Jahren bestimmt, und wir erheben nicht wissentlich personenbezogene Daten von Kindern. Tatsächlich erheben unsere Spiele von niemandem personenbezogene Daten."
        }
      ]
    },
    {
      id: "rights",
      heading: "Deine Rechte",
      blocks: [
        {
          kind: "paragraph",
          html: "Je nachdem, wo du lebst, zum Beispiel nach der DSGVO, der UK GDPR oder dem CCPA, hast du das Recht:"
        },
        {
          kind: "list",
          items: [
            "Auskunft über die personenbezogenen Daten zu erhalten, die wir über dich gespeichert haben;",
            "sie berichtigen zu lassen;",
            "sie löschen zu lassen;",
            "der Art, wie wir sie nutzen, zu widersprechen;",
            "dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren."
          ]
        },
        {
          kind: "paragraph",
          html: 'In der Praxis könnte eine E-Mail, die du uns geschickt hast, die einzigen personenbezogenen Daten sein, die wir von dir haben. Um eines dieser Rechte auszuüben, schreib an {email:support}. Um deine Daten zu löschen, sieh dir die Seite <a href="{route:deleteData}">Daten löschen</a> an.'
        }
      ]
    },
    {
      id: "changes",
      heading: "Änderungen dieser Erklärung",
      blocks: [
        {
          kind: "paragraph",
          html: "Wenn wir diese Erklärung ändern, aktualisieren wir diese Seite und das Datum „Zuletzt aktualisiert“ oben."
        }
      ]
    },
    {
      id: "contact",
      heading: "Kontakt",
      blocks: [{ kind: "paragraph", html: "Fragen zum Datenschutz? Schreib an {email:support}." }]
    }
  ]
};
