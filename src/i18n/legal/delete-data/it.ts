/**
 * @file Italian «Elimina i tuoi dati», translated from `en.ts`.
 *
 * Same sections, blocks, slots and tags as `en.ts`; only the words are translated. Menu labels are
 * the ones Android and iOS show in Italian. The mail subject stays «Delete my data», the same as
 * `deleteData.mailSubject` in `locales/it.ts`.
 */
import type { LegalDocument } from "../../types";

/** The Italian «Delete your data» document. */
export const deleteDataIt: LegalDocument = {
  intro: "Questa pagina spiega come eliminare i tuoi dati dai giochi creati da Kitto Studio.",
  inShort: [
    "Non ci sono account, quindi non c’è nessun account da eliminare.",
    "Non conserviamo dati di gioco sui nostri server.",
    "I dati di gioco si trovano solo sul tuo dispositivo. Puoi eliminarli in autonomia con pochi tocchi.",
    "Se ci hai scritto, eliminiamo le tue email entro 30 giorni dalla tua richiesta."
  ],
  sections: [
    {
      id: "nothing",
      heading: "Nessun account, niente sui nostri server",
      blocks: [
        {
          kind: "paragraph",
          html: "I nostri giochi non hanno account e non ci inviano alcun dato. Progressi e impostazioni vengono salvati solo sul tuo dispositivo."
        },
        {
          kind: "paragraph",
          html: "Quindi da parte nostra non c’è niente da eliminare. Hai il pieno controllo dei tuoi dati di gioco."
        }
      ]
    },
    {
      id: "android",
      heading: "Eliminare i dati di gioco su Android",
      blocks: [
        {
          kind: "steps",
          items: [
            "Apri <b>Impostazioni</b> sul telefono.",
            "Tocca <b>App</b>.",
            "Trova il gioco e toccalo, ad esempio <b>A Memory Missing: Merge Game</b>.",
            "Tocca <b>Spazio di archiviazione</b>.",
            "Tocca <b>Cancella spazio di archiviazione</b>."
          ]
        },
        {
          kind: "paragraph",
          html: "Oppure disinstalla il gioco: in questo modo tutti i suoi dati vengono rimossi dal telefono. I nomi dei menu possono variare leggermente da un telefono all’altro."
        }
      ]
    },
    {
      id: "iphone",
      heading: "Eliminare i dati di gioco su iPhone",
      blocks: [
        {
          kind: "steps",
          items: [
            "Tocca e tieni premuta l’icona del gioco nella schermata Home.",
            "Tocca <b>Rimuovi app</b>.",
            "Tocca <b>Elimina app</b>, poi <b>Elimina</b>."
          ]
        },
        {
          kind: "paragraph",
          html: "Se elimini l’app, tutti i suoi dati vengono rimossi dall’iPhone."
        }
      ]
    },
    {
      id: "email",
      heading: "Se ci hai scritto",
      blocks: [
        {
          kind: "paragraph",
          html: "Se ci hai inviato un’email, abbiamo il tuo indirizzo email e i tuoi messaggi. Per farli eliminare:"
        },
        {
          kind: "steps",
          items: [
            "Scrivi a {email:delete} dallo stesso indirizzo che hai usato in precedenza.",
            "Usa l’oggetto «Delete my data».",
            "Eliminiamo i tuoi messaggi entro 30 giorni e ti inviamo una conferma."
          ]
        }
      ]
    },
    {
      id: "kept",
      heading: "Cosa viene eliminato e cosa viene conservato",
      blocks: [
        {
          kind: "list",
          items: [
            "I progressi e le impostazioni di gioco. Li elimini tu sul tuo dispositivo.",
            "Le tue email e il tuo indirizzo email. Li eliminiamo quando ce lo chiedi."
          ]
        }
      ]
    },
    {
      id: "questions",
      heading: "Domande",
      blocks: [
        {
          kind: "paragraph",
          html: 'Scrivi a {email:delete}. Come trattiamo i dati è spiegato nella nostra <a href="{route:privacy}">Informativa sulla privacy</a>.'
        }
      ]
    }
  ]
};
