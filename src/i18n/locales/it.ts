/** @file Italian UI strings, from the prototype draft copy reviewed against `en.ts`; the rest translated by hand. */
import type { UIStrings } from "../types";

/** Italian strings. */
export const it: UIStrings = {
  meta: {
    root: {
      title: "Scegli la lingua",
      description:
        "Kitto Studio è un piccolo studio di famiglia. Creiamo giochi rompicapo per smartphone."
    },
    home: {
      title: "Vale sicuramente la pena giocarci.",
      description:
        "Siamo Kitto Studio, un piccolo studio di famiglia. Creiamo giochi rompicapo per smartphone."
    },
    about: {
      title: "Chi siamo",
      description:
        "Kitto Studio siamo Alex e Hanna. Creiamo giochi rompicapo per smartphone, insieme e con i nostri tempi."
    },
    games: {
      title: "Giochi",
      description: "Creiamo giochi rompicapo per smartphone. Ecco a cosa stiamo lavorando ora."
    },
    memoryMissing: {
      title: "A Memory Missing: Merge Game",
      description:
        "Un giovane si sveglia in ospedale e non ricorda nulla. Accanto al letto lo aspetta già un detective."
    },
    support: {
      title: "Assistenza",
      description:
        "Un solo indirizzo per tutto: domande, problemi in un gioco, idee e richieste sui tuoi dati. Leggiamo ogni messaggio."
    },
    privacy: {
      title: "Informativa sulla privacy",
      description:
        "I giochi di Kitto Studio salvano i tuoi progressi sul tuo dispositivo. Niente account, analisi, pubblicità o tracciamento."
    },
    terms: {
      title: "Termini di utilizzo",
      description: "Le condizioni per usare i giochi di Kitto Studio e il sito web kitto.studio."
    },
    deleteData: {
      title: "Elimina i tuoi dati",
      description:
        "Come eliminare i tuoi dati dai giochi di Kitto Studio: nessun account, niente sui nostri server, li cancelli dal tuo dispositivo."
    },
    notFound: {
      title: "Pagina non trovata",
      description: "Questa pagina non esiste o è stata spostata."
    }
  },
  chrome: {
    skip: "Vai al contenuto",
    homeLabel: "Kitto Studio, home",
    navLabel: "Menu principale",
    nav: { games: "Giochi", about: "Chi siamo", support: "Assistenza" },
    footer: {
      label: "Note legali e assistenza",
      privacy: "Informativa sulla privacy",
      terms: "Termini di utilizzo",
      deleteData: "Elimina i tuoi dati",
      support: "Assistenza",
      copyright: "© 2026 Kitto Studio"
    },
    theme: { label: "Tema", system: "Sistema", light: "Chiaro", dark: "Scuro" },
    language: { label: "Lingua" },
    menu: { open: "Menu", close: "Chiudi" }
  },
  root: {
    heading: "Scegli la lingua"
  },
  home: {
    hero: {
      title: "Vale sicuramente la pena giocarci.",
      lead: "Siamo Kitto Studio, un piccolo studio di famiglia. Creiamo giochi rompicapo per smartphone."
    },
    games: {
      title: "I nostri giochi",
      lead: "Il nostro primo gioco è in sviluppo. Altri arriveranno.",
      comingSoon: "In arrivo",
      slot: "Nuovo gioco",
      genre: "Un gioco investigativo in cui unisci gli indizi",
      platforms: "Per iPhone e Android"
    },
    about: {
      title: "Chi siamo",
      text: "Kitto Studio siamo noi, Alex e Hanna. Creiamo ogni gioco insieme, con i nostri tempi.",
      kitto: "きっと (kitto) in giapponese significa «sicuramente».",
      more: "Scopri di più sullo studio"
    },
    support: {
      title: "Ti serve aiuto?",
      text: "Scrivici a {email}. Leggiamo ogni messaggio.",
      cta: "Scrivici"
    }
  },
  about: {
    title: "Un piccolo studio di famiglia",
    lead: "Kitto Studio siamo Alex e Hanna. Creiamo giochi rompicapo per smartphone, insieme e con i nostri tempi.",
    who: {
      title: "Chi siamo",
      first: "Siamo in due. Siamo una famiglia, e lo studio è il lavoro che condividiamo.",
      second:
        "Ogni gioco nasce al nostro tavolo. Lo pensiamo insieme, lo costruiamo e ci giochiamo tante volte prima che lo veda qualcun altro.",
      dioramaAlt:
        "Una piccola stanza-studio di carta con due scrivanie una di fronte all’altra, due portatili e due tazze di tè."
    },
    name: {
      title: "Perché il nome Kitto",
      first:
        "In giapponese きっと (kitto) significa «sicuramente». Si dice quando si crede che qualcosa accadrà: andrà sicuramente bene.",
      second:
        "Ci piace questa fiducia tranquilla. Un gioco richiede molto tempo. Crediamo che ognuno, sicuramente, arriverà in fondo.",
      kana: "きっと",
      reading: "kitto"
    },
    how: {
      title: "Come lavoriamo",
      small: {
        title: "Piccoli per scelta",
        text: "Siamo solo in due, quindi ogni dettaglio passa dalle nostre mani."
      },
      care: {
        title: "Cura per ogni rompicapo",
        text: "Testiamo ogni rompicapo finché non risulta giusto e chiaro. Se non è ancora pronto, aspetta."
      },
      pace: {
        title: "Con i nostri tempi",
        text: "Non abbiamo fretta. Un gioco esce quando è buono, non quando lo dice il calendario."
      }
    },
    hello: {
      title: "Salutaci",
      text: "Domande, idee o solo una parola gentile: scrivi a {email}. Leggiamo ogni messaggio.",
      support: "Ti serve aiuto con un gioco? Vai alla pagina {link}.",
      supportLink: "Assistenza"
    }
  },
  games: {
    title: "I nostri giochi",
    lead: "Creiamo giochi rompicapo per smartphone. Ecco a cosa stiamo lavorando ora.",
    card: {
      genre: "Un gioco investigativo di fusione",
      teaser:
        "Un giovane si sveglia in ospedale e non ricorda nulla. Accanto al letto lo aspetta già un detective.",
      status: "In arrivo su iPhone e Android",
      cta: "Scopri il gioco"
    },
    slot: {
      name: "Nuovo gioco",
      soon: "In arrivo",
      note: "Altri giochi compariranno qui quando saranno pronti."
    },
    help: "Domande sui nostri giochi? Vai alla pagina {link}.",
    helpLink: "Assistenza"
  },
  game: {
    name: "A Memory Missing: Merge Game",
    breadcrumb: { label: "Percorso di navigazione", games: "Giochi" },
    tags: { genre: "Gioco investigativo di fusione", status: "In arrivo su iPhone e Android" },
    gallery: {
      title: "Screenshot e illustrazioni",
      wardLabel: "Illustrazione principale",
      wardAlt:
        "Illustrazione principale: una stanza d’ospedale di notte. Un giovane dorme nel letto mentre un detective e una donna parlano accanto a lui.",
      splashLabel: "Schermata di caricamento",
      splashAlt:
        "La schermata di caricamento del gioco: il giovane dorme in un letto d’ospedale, visto dentro una cornice rotonda. Sotto ci sono il titolo del gioco e una barra di caricamento piena.",
      previous: "Immagine precedente",
      next: "Immagine successiva",
      open: "Apri a schermo intero",
      show: "Mostra l’immagine {n} di {total}: {label}",
      count: "{n} di {total}",
      viewer: "Visualizzatore di immagini",
      close: "Chiudi"
    },
    story: {
      title: "La storia",
      premise:
        "Un giovane si sveglia in ospedale e non ricorda nulla. Accanto al letto lo aspetta già un detective. Unisci gli indizi, recupera pezzo dopo pezzo i ricordi perduti e scopri cosa è successo la notte che ha dimenticato."
    },
    platforms: {
      title: "Dove giocare",
      iphone: "iPhone",
      android: "Android",
      soon: "In arrivo",
      note: "Non c’è ancora una data di uscita. Aggiungeremo qui i link agli store quando il gioco sarà disponibile."
    },
    features: {
      title: "Nel gioco",
      merge: {
        title: "Unisci per trovare indizi",
        text: "Combina gli oggetti sul tabellone. Le piccole cose diventano indizi."
      },
      memories: {
        title: "Ricordi, pezzo dopo pezzo",
        text: "Ogni indizio riporta alla luce una parte della notte che ha dimenticato."
      },
      solve: {
        title: "Una storia da risolvere",
        text: "Metti insieme i pezzi e scopri cosa è successo davvero."
      },
      offline: {
        title: "Si gioca offline",
        text: "Non serve la connessione. I tuoi progressi vengono salvati sul tuo dispositivo."
      }
    },
    help: {
      title: "Assistenza e privacy",
      text: "Domande o problemi con il gioco? Scrivici dalla {supportLink}. Come il gioco tratta i tuoi dati è spiegato nell’{privacyLink}.",
      supportLink: "pagina di assistenza",
      privacyLink: "Informativa sulla privacy"
    },
    board: {
      title: "Unisci qualche indizio",
      lead: "Trascina un oggetto sul suo gemello per unirli e completa tutte e tre le catene per far tornare un ricordo.",
      hint: "Oppure tocca un oggetto e poi il suo gemello.",
      hintMouse: "Oppure fai clic su un oggetto e poi sul suo gemello.",
      keys: "Le frecce spostano tra le caselle. Invio o Spazio prende un oggetto e lo posa. Esc lo rimette a posto.",
      caseTitle: "Indizi da trovare",
      progress: "Indizi trovati: {n} su 3",
      newBoard: "Nuovo tabellone",
      empty: "Casella vuota",
      picked: "Hai preso: {item}. Scegli il gemello o una casella vuota.",
      merged: "Nuovo oggetto: {item}.",
      found: "Indizio trovato: {item}.",
      missing: "{item}: ancora da trovare",
      winTitle: "Un ricordo è tornato.",
      winText: "Un pezzo della notte che ha dimenticato. Il resto è nel gioco.",
      again: "Gioca ancora"
    },
    items: {
      note1: "Pezzo di carta strappato",
      note2: "Biglietto piegato",
      note3: "Lettera sigillata",
      key1: "Vecchia chiave",
      key2: "Mazzo di chiavi",
      key3: "Scatola chiusa a chiave",
      photo1: "Angolo di foto",
      photo2: "Mezza foto",
      photo3: "Foto incorniciata",
      memory: "Ricordo"
    }
  },
  support: {
    title: "Ti serve aiuto? Scrivici.",
    lead: "Un solo indirizzo per tutto: domande, problemi in un gioco, idee e richieste sui tuoi dati. Leggiamo ogni messaggio.",
    mail: {
      title: "La nostra email",
      write: "Scrivi un’email",
      copy: "Copia indirizzo",
      copied: "Copiato",
      copiedNote: "L’indirizzo è negli appunti.",
      copyFail: "Seleziona l’indirizzo qui sopra e copialo."
    },
    letter: {
      title: "Cosa scrivere nel messaggio",
      lead: "Pochi dettagli ci aiutano a trovare il problema più in fretta.",
      game: "Il nome del gioco",
      device: "Il modello del tuo telefono o tablet",
      os: "La versione di iOS o Android (la trovi in Impostazioni)",
      what: "Cosa è successo e cosa ti aspettavi. Uno screenshot aiuta molto."
    },
    faq: {
      title: "Domande frequenti",
      progressQuestion: "Dove vengono salvati i miei progressi?",
      progressAnswer:
        "Sul tuo dispositivo. I progressi restano sul telefono o tablet su cui giochi. Se elimini il gioco, vengono eliminati anche i progressi.",
      deleteQuestion: "Come elimino i miei dati?",
      deleteAnswer: "Segui i passaggi della pagina {link}. Puoi anche scriverci e ti aiuteremo.",
      deleteLink: "Elimina i tuoi dati",
      privacyQuestion: "Come gestite la mia privacy?",
      privacyAnswer: "La nostra {link} spiega quali dati usano i nostri giochi e perché.",
      privacyLink: "Informativa sulla privacy"
    }
  },
  legal: {
    titles: {
      privacy: "Informativa sulla privacy",
      terms: "Termini di utilizzo",
      deleteData: "Elimina i tuoi dati"
    },
    contents: "Indice",
    inShort: "In breve",
    updated: "Ultimo aggiornamento: {date}",
    draft: "Bozza. I campi evidenziati, come {placeholder}, non sono ancora compilati.",
    fallback: "Questa pagina è disponibile in inglese."
  },
  deleteData: {
    facts: {
      developer: "Sviluppatore",
      apps: "App",
      appsValue: "A Memory Missing: Merge Game e i futuri giochi Kitto",
      ids: "ID delle app"
    },
    cta: "Richiedi l’eliminazione",
    mailSubject: "Delete my data",
    deleted: "Eliminato",
    kept: "Conservato",
    nothing: "Niente.",
    nothingNote: "Dopo l’eliminazione non conserviamo nessuno dei tuoi dati."
  },
  notFound: {
    title: "Pagina non trovata",
    text: "Questa pagina non esiste o è stata spostata.",
    home: "Vai alla home page"
  }
};
