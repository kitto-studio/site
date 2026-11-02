/**
 * @file Italian «Informativa sulla privacy», translated from `en.ts`.
 *
 * Same sections, blocks, slots and tags as `en.ts`; only the words are translated.
 */
import type { LegalDocument } from "../../types";

/** The Italian «Privacy Policy» document. */
export const privacyIt: LegalDocument = {
  intro:
    "Questa informativa spiega cosa succede alle tue informazioni quando giochi ai giochi Kitto, visiti kitto.studio o ci scrivi. In breve: i nostri giochi conservano tutto sul tuo dispositivo e non raccogliamo dati personali.",
  inShort: [
    "I nostri giochi salvano progressi e impostazioni solo sul tuo dispositivo.",
    "Niente account, niente analisi, niente pubblicità, niente tracciamento.",
    "Non raccogliamo né vendiamo dati personali.",
    "Se ci scrivi, usiamo il tuo indirizzo solo per risponderti."
  ],
  sections: [
    {
      id: "who",
      heading: "Chi siamo",
      blocks: [
        {
          kind: "paragraph",
          html: "Kitto Studio è un piccolo studio di famiglia. Creiamo giochi rompicapo per smartphone. Kitto Studio è gestito da una persona fisica, Hanna Kucherenko, Calle Ventura Selva González 9, Bungalow 28, 03130 Gran Alacant, Santa Pola (Alicante), Spagna, che è titolare del trattamento delle informazioni descritte in questa informativa. Puoi contattarci all’indirizzo {email:support}."
        }
      ]
    },
    {
      id: "scope",
      heading: "A cosa si applica questa informativa",
      blocks: [
        { kind: "paragraph", html: "Questa informativa si applica a:" },
        {
          kind: "list",
          items: [
            'I nostri giochi. I loro ID app iniziano con studio.kitto, ad esempio <span translate="no">studio.kitto.memorymissing</span>. Il nostro primo gioco è A Memory Missing: Merge Game. Non è ancora uscito.',
            "Il nostro sito web, kitto.studio.",
            "Le email che invii a {email:support}."
          ]
        }
      ]
    },
    {
      id: "games",
      heading: "I nostri giochi",
      blocks: [
        {
          kind: "paragraph",
          html: "I nostri giochi salvano progressi e impostazioni solo sul tuo dispositivo. Non li inviano né a noi né a nessun altro."
        },
        {
          kind: "list",
          items: [
            "<strong>Niente account.</strong> Non devi mai registrarti né accedere.",
            "<strong>Niente analisi.</strong> Non misuriamo come giochi.",
            "<strong>Niente pubblicità.</strong> I nostri giochi non mostrano annunci.",
            "<strong>Niente tracciamento.</strong> Non ti seguiamo tra app o siti web.",
            "<strong>Niente SDK che raccolgono dati.</strong> Non usiamo SDK di terze parti che raccolgono dati personali."
          ]
        },
        {
          kind: "paragraph",
          html: "Non raccogliamo dati personali tramite i nostri giochi, quindi non ne abbiamo da vendere o condividere."
        }
      ]
    },
    {
      id: "purchases",
      heading: "Acquisti",
      blocks: [
        {
          kind: "paragraph",
          html: "Se un gioco offre acquisti, questi vengono elaborati dall’App Store di Apple o da Google Play secondo i rispettivi termini. Non riceviamo mai i tuoi dati di pagamento."
        },
        {
          kind: "paragraph",
          html: 'Per sapere come Apple e Google trattano i tuoi dati, leggi l’<a href="https://www.apple.com/legal/privacy/" rel="noopener">Informativa sulla privacy di Apple</a> e le <a href="https://policies.google.com/privacy" rel="noopener">Norme sulla privacy di Google</a>.'
        }
      ]
    },
    {
      id: "email",
      heading: "Quando ci scrivi",
      blocks: [
        {
          kind: "paragraph",
          html: "Se scrivi a {email:support}, riceviamo il tuo indirizzo email e il tuo messaggio. Li usiamo solo per risponderti."
        },
        {
          kind: "paragraph",
          html: "Li conserviamo solo per il tempo necessario ad aiutarti. Li eliminiamo quando ce lo chiedi."
        }
      ]
    },
    {
      id: "website",
      heading: "Il nostro sito web",
      blocks: [
        {
          kind: "paragraph",
          html: "kitto.studio è un sito web statico. Non usa cookie né strumenti di analisi."
        },
        {
          kind: "paragraph",
          html: "Ricorda il tema e la lingua che scegli nella memoria locale (local storage) del tuo browser. Questa informazione resta nel tuo browser e noi non possiamo vederla. Puoi cancellarla in qualsiasi momento dalle impostazioni del browser."
        },
        {
          kind: "paragraph",
          html: 'Il nostro fornitore di hosting, Cloudflare, può trattare dati tecnici, come gli indirizzi IP, nei log del server, per mantenere il sito sicuro e fartelo arrivare. Leggi l’<a href="https://www.cloudflare.com/privacypolicy/" rel="noopener">Informativa sulla privacy di Cloudflare</a>.'
        }
      ]
    },
    {
      id: "children",
      heading: "Minori",
      blocks: [
        {
          kind: "paragraph",
          html: "I nostri giochi sono pensati per giocatori dai 13 anni in su. Non sono rivolti a minori di 13 anni e non raccogliamo consapevolmente dati personali di minori. Anzi, i nostri giochi non raccolgono dati personali di nessuno."
        }
      ]
    },
    {
      id: "rights",
      heading: "I tuoi diritti",
      blocks: [
        {
          kind: "paragraph",
          html: "A seconda di dove vivi, ad esempio ai sensi del GDPR, dello UK GDPR o del CCPA, hai il diritto di:"
        },
        {
          kind: "list",
          items: [
            "accedere ai dati personali che conserviamo su di te;",
            "rettificarli;",
            "ottenerne la cancellazione;",
            "opporti al modo in cui li usiamo;",
            "proporre reclamo a un’autorità di controllo per la protezione dei dati."
          ]
        },
        {
          kind: "paragraph",
          html: 'In pratica, gli unici dati personali che potremmo avere sono quelli di un’email che ci hai inviato. Per esercitare uno di questi diritti, scrivi a {email:support}. Per eliminare i tuoi dati, vai alla pagina <a href="{route:deleteData}">Elimina i tuoi dati</a>.'
        }
      ]
    },
    {
      id: "changes",
      heading: "Modifiche a questa informativa",
      blocks: [
        {
          kind: "paragraph",
          html: "Se modifichiamo questa informativa, aggiorniamo questa pagina e la data di «Ultimo aggiornamento» in alto."
        }
      ]
    },
    {
      id: "contact",
      heading: "Contatti",
      blocks: [{ kind: "paragraph", html: "Domande sulla privacy? Scrivi a {email:support}." }]
    }
  ]
};
