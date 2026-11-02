/**
 * @file Italian «Termini di utilizzo», translated from `en.ts`.
 *
 * Same sections, blocks, slots and tags as `en.ts`; only the words are translated.
 */
import type { LegalDocument } from "../../types";

/** The Italian «Terms of Use» document. */
export const termsIt: LegalDocument = {
  intro:
    "Questi termini si applicano quando usi i giochi Kitto e il sito web kitto.studio. Usandoli, accetti questi termini. Sono brevi, quindi ti chiediamo di leggerli.",
  inShort: [
    "Puoi usare i nostri giochi e il nostro sito per uso personale e non commerciale.",
    "I giochi e tutto ciò che contengono appartengono a Kitto Studio.",
    "Gli acquisti passano dall’App Store o da Google Play, secondo i loro termini.",
    "Gioca in modo corretto e non fare un uso improprio dei giochi o del sito."
  ],
  sections: [
    {
      id: "who",
      heading: "Chi siamo",
      blocks: [
        {
          kind: "paragraph",
          html: "Kitto Studio è un piccolo studio di famiglia che crea giochi rompicapo per smartphone. Kitto Studio è gestito da una persona fisica, Hanna Kucherenko, Calle Ventura Selva González 9, Bungalow 28, 03130 Gran Alacant, Santa Pola (Alicante), Spagna. Questi termini sono un accordo tra te e noi. Puoi contattarci all’indirizzo {email:support}."
        }
      ]
    },
    {
      id: "licence",
      heading: "La tua licenza",
      blocks: [
        {
          kind: "paragraph",
          html: "Ti concediamo una licenza personale, non esclusiva e non trasferibile per scaricare e usare i nostri giochi e il nostro sito web per uso personale e non commerciale."
        },
        {
          kind: "paragraph",
          html: "Non puoi usarli per scopi commerciali senza la nostra autorizzazione scritta."
        }
      ]
    },
    {
      id: "content",
      heading: "I nostri contenuti",
      blocks: [
        {
          kind: "paragraph",
          html: "I nostri giochi, il nostro sito web e tutto ciò che contengono, inclusi illustrazioni, personaggi, musica, testi, codice e il nome e il logo Kitto, appartengono a Kitto Studio. Sono protetti dalle leggi sulla proprietà intellettuale."
        },
        {
          kind: "paragraph",
          html: "Questi termini non ti danno alcun diritto su di essi oltre alla licenza indicata sopra."
        }
      ]
    },
    {
      id: "purchases",
      heading: "Acquisti",
      blocks: [
        {
          kind: "paragraph",
          html: "Se un gioco offre acquisti, questi vengono venduti ed elaborati dall’App Store di Apple o da Google Play. Ai pagamenti e ai rimborsi si applicano i loro termini. Per chiedere un rimborso, contatta lo store in cui hai effettuato l’acquisto."
        },
        { kind: "paragraph", html: "Non riceviamo mai i tuoi dati di pagamento." }
      ]
    },
    {
      id: "use",
      heading: "Uso consentito",
      blocks: [
        {
          kind: "paragraph",
          html: "Quando usi i nostri giochi e il nostro sito web, ti chiediamo di non:"
        },
        {
          kind: "list",
          items: [
            "copiare, vendere, noleggiare o ridistribuire i nostri giochi o i loro contenuti;",
            "decodificare, decompilare o modificare i giochi, salvo nei casi consentiti dalla legge;",
            "usare strumenti che interferiscono con il funzionamento dei giochi;",
            "usare i nostri giochi o il nostro sito web per violare la legge o danneggiare altre persone;",
            "tentare di disturbare il funzionamento del nostro sito web o di accedervi senza autorizzazione."
          ]
        }
      ]
    },
    {
      id: "as-is",
      heading: "Giochi «così come sono»",
      blocks: [
        {
          kind: "paragraph",
          html: "Creiamo i nostri giochi con cura. Nei limiti consentiti dalla legge, li forniamo «così come sono» e «secondo disponibilità». Non garantiamo che siano privi di errori o sempre disponibili."
        },
        {
          kind: "paragraph",
          html: "Nulla in questi termini limita i tuoi diritti di consumatore che non possono essere limitati per legge."
        }
      ]
    },
    {
      id: "liability",
      heading: "Limitazione di responsabilità",
      blocks: [
        {
          kind: "paragraph",
          html: "Nei limiti consentiti dalla legge, Kitto Studio non è responsabile per danni indiretti o consequenziali derivanti dall’uso dei nostri giochi o del nostro sito web."
        },
        {
          kind: "paragraph",
          html: "I tuoi progressi sono salvati solo sul tuo dispositivo. Se elimini un gioco o ne cancelli i dati, i progressi vanno persi e non possiamo ripristinarli."
        },
        {
          kind: "paragraph",
          html: "Nulla in questi termini esclude la responsabilità che non può essere esclusa per legge."
        }
      ]
    },
    {
      id: "law",
      heading: "Legge applicabile",
      blocks: [
        { kind: "paragraph", html: "Questi termini sono regolati dalla legge spagnola." },
        {
          kind: "paragraph",
          html: "Se sei un consumatore, mantieni anche la tutela delle norme imperative del Paese in cui risiedi."
        }
      ]
    },
    {
      id: "privacy",
      heading: "Privacy",
      blocks: [
        {
          kind: "paragraph",
          html: 'Come trattiamo le informazioni è spiegato nella nostra <a href="{route:privacy}">Informativa sulla privacy</a>. In breve: i nostri giochi conservano tutto sul tuo dispositivo e non raccogliamo dati personali.'
        }
      ]
    },
    {
      id: "changes",
      heading: "Modifiche a questi termini",
      blocks: [
        {
          kind: "paragraph",
          html: "Possiamo aggiornare questi termini. Quando lo facciamo, aggiorniamo questa pagina e la data di «Ultimo aggiornamento» in alto. Se continui a usare i nostri giochi dopo una modifica, si applicano i termini aggiornati."
        }
      ]
    },
    {
      id: "contact",
      heading: "Contatti",
      blocks: [{ kind: "paragraph", html: "Domande su questi termini? Scrivi a {email:support}." }]
    }
  ]
};
