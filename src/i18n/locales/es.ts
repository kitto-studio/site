/** @file Spanish (Spain) UI strings, from the prototype draft copy reviewed against `en.ts`; the rest translated by hand. */
import type { UIStrings } from "../types";

/** Spanish strings. */
export const es: UIStrings = {
  meta: {
    home: {
      title: "Sin duda, vale la pena jugar.",
      description:
        "Somos Kitto Studio, un pequeño estudio familiar. Hacemos juegos de puzles para móviles."
    },
    about: {
      title: "Sobre nosotros",
      description:
        "Kitto Studio somos Alex y Hanna. Hacemos juegos de puzles para móviles, juntos y a nuestro ritmo."
    },
    games: {
      title: "Juegos",
      description:
        "Hacemos juegos de puzles para móviles. Aquí puedes ver en qué estamos trabajando ahora."
    },
    memoryMissing: {
      title: "A Memory Missing: Merge Game",
      description:
        "Un joven despierta en un hospital y no recuerda nada. Un detective ya lo espera junto a su cama."
    },
    support: {
      title: "Soporte",
      description:
        "Una sola dirección para todo: preguntas, problemas en un juego, ideas y solicitudes sobre tus datos. Leemos todos los mensajes."
    },
    privacy: {
      title: "Política de privacidad",
      description:
        "Los juegos de Kitto Studio guardan tu progreso en tu dispositivo. Sin cuentas, sin analíticas, sin anuncios, sin rastreo."
    },
    terms: {
      title: "Condiciones de uso",
      description:
        "Las condiciones para usar los juegos de Kitto Studio y el sitio web kitto.studio."
    },
    deleteData: {
      title: "Eliminar tus datos",
      description:
        "Cómo eliminar tus datos de los juegos de Kitto Studio: sin cuenta, nada en nuestros servidores, bórralos en tu dispositivo."
    },
    notFound: {
      title: "Página no encontrada",
      description: "Esta página no existe o se ha movido."
    }
  },
  chrome: {
    skip: "Saltar al contenido",
    homeLabel: "Kitto Studio, inicio",
    navLabel: "Principal",
    nav: { games: "Juegos", about: "Nosotros", support: "Soporte" },
    footer: {
      label: "Información legal y soporte",
      privacy: "Política de privacidad",
      terms: "Condiciones de uso",
      deleteData: "Eliminar tus datos",
      support: "Soporte",
      copyright: "© 2026 Kitto Studio"
    },
    theme: { label: "Tema", system: "Sistema", light: "Claro", dark: "Oscuro" },
    language: { label: "Idioma" },
    menu: { open: "Menú", close: "Cerrar" }
  },
  root: {
    heading: "Elige tu idioma"
  },
  home: {
    hero: {
      title: "Sin duda, vale la pena jugar.",
      lead: "Somos Kitto Studio, un pequeño estudio familiar. Hacemos juegos de puzles para móviles."
    },
    games: {
      title: "Nuestros juegos",
      lead: "Nuestro primer juego está en desarrollo. Vendrán más.",
      comingSoon: "Próximamente",
      slot: "Nuevo juego",
      genre: "Un juego de detectives en el que combinas pistas",
      platforms: "Para iPhone y Android"
    },
    about: {
      title: "Sobre nosotros",
      text: "Kitto Studio somos Alex y Hanna. Hacemos cada juego juntos, a nuestro ritmo.",
      kitto: "きっと (kitto) significa «sin duda» en japonés.",
      more: "Más sobre el estudio"
    },
    support: {
      title: "¿Necesitas ayuda?",
      text: "Escríbenos a {email}. Leemos todos los mensajes.",
      cta: "Escríbenos"
    }
  },
  about: {
    title: "Un pequeño estudio familiar",
    lead: "Kitto Studio somos Alex y Hanna. Hacemos juegos de puzles para móviles, juntos y a nuestro ritmo.",
    who: {
      title: "Quiénes somos",
      first: "Somos dos. Somos una familia, y el estudio es el trabajo que compartimos.",
      second:
        "Cada juego empieza en nuestra mesa. Lo ideamos juntos, lo construimos y lo jugamos muchas veces antes de que nadie más lo vea.",
      dioramaAlt:
        "Un pequeño estudio de papel con dos escritorios enfrentados, dos portátiles y dos tazas de té."
    },
    name: {
      title: "Por qué nos llamamos Kitto",
      first:
        "En japonés, きっと (kitto) significa «sin duda». Se dice cuando uno cree que algo va a pasar: sin duda saldrá bien.",
      second:
        "Nos gusta esa confianza tranquila. Hacer un juego lleva mucho tiempo. Creemos que cada uno, sin duda, llegará a buen puerto.",
      kana: "きっと",
      reading: "kitto"
    },
    how: {
      title: "Cómo trabajamos",
      small: {
        title: "Pequeños a propósito",
        text: "Solo somos dos, así que cada detalle pasa por nuestras manos."
      },
      care: {
        title: "Con cuidado en cada puzle",
        text: "Probamos cada puzle hasta que resulta justo y claro. Si aún no está listo, espera."
      },
      pace: {
        title: "A nuestro ritmo",
        text: "No tenemos prisa. Un juego sale cuando está bien, no cuando lo dice el calendario."
      }
    },
    hello: {
      title: "Escríbenos",
      text: "Preguntas, ideas o simplemente unas palabras amables: escribe a {email}. Leemos todos los mensajes.",
      support: "¿Necesitas ayuda con un juego? Consulta la página de {link}.",
      supportLink: "Soporte"
    }
  },
  games: {
    title: "Nuestros juegos",
    lead: "Hacemos juegos de puzles para móviles. Aquí puedes ver en qué estamos trabajando ahora.",
    card: {
      genre: "Un juego de detectives y fusión",
      teaser:
        "Un joven despierta en un hospital y no recuerda nada. Un detective ya lo espera junto a su cama.",
      status: "Próximamente en iPhone y Android",
      cta: "Sobre el juego"
    },
    slot: {
      name: "Nuevo juego",
      soon: "Próximamente",
      note: "Aquí aparecerán más juegos cuando estén listos."
    },
    help: "¿Preguntas sobre nuestros juegos? Consulta la página de {link}.",
    helpLink: "Soporte"
  },
  game: {
    name: "A Memory Missing: Merge Game",
    breadcrumb: { label: "Ruta de navegación", games: "Juegos" },
    tags: { genre: "Juego de detectives y fusión", status: "Próximamente en iPhone y Android" },
    gallery: {
      title: "Capturas y arte",
      wardLabel: "Arte principal",
      wardAlt:
        "Arte principal: una habitación de hospital de noche. Un joven duerme en la cama mientras un detective y una mujer hablan a su lado.",
      splashLabel: "Pantalla de carga",
      splashAlt:
        "La pantalla de carga del juego: el joven duerme en una cama de hospital, dentro de un marco redondo. Debajo aparecen el título del juego y una barra de carga completa.",
      previous: "Imagen anterior",
      next: "Imagen siguiente",
      open: "Abrir a pantalla completa",
      show: "Mostrar la imagen {n} de {total}: {label}",
      count: "{n} de {total}",
      viewer: "Visor de imágenes",
      close: "Cerrar"
    },
    story: {
      title: "La historia",
      premise:
        "Un joven despierta en un hospital y no recuerda nada. Un detective ya lo espera junto a su cama. Fusiona pistas, recupera pieza a pieza los recuerdos perdidos y descubre qué pasó la noche que olvidó."
    },
    platforms: {
      title: "Dónde jugar",
      iphone: "iPhone",
      android: "Android",
      soon: "Próximamente",
      note: "Aún no hay fecha de lanzamiento. Cuando el juego salga, añadiremos aquí los enlaces a las tiendas."
    },
    features: {
      title: "En el juego",
      merge: {
        title: "Fusiona para encontrar pistas",
        text: "Combina objetos en el tablero. Las cosas pequeñas se convierten en pistas."
      },
      memories: {
        title: "Recuerdos, pieza a pieza",
        text: "Cada pista devuelve una parte de la noche que olvidó."
      },
      solve: {
        title: "Una historia por resolver",
        text: "Une las piezas y descubre qué pasó de verdad."
      },
      offline: {
        title: "Se juega sin conexión",
        text: "No necesitas conexión. Tu progreso se guarda en tu dispositivo."
      }
    },
    help: {
      title: "Ayuda y privacidad",
      text: "¿Preguntas o problemas con el juego? Escríbenos desde la {supportLink}. Cómo trata el juego tus datos se explica en la {privacyLink}.",
      supportLink: "página de soporte",
      privacyLink: "Política de privacidad"
    },
    board: {
      title: "Fusiona unas cuantas pistas",
      lead: "Arrastra un objeto sobre su gemelo para fusionarlos y completa las tres cadenas para recuperar un recuerdo.",
      hint: "O toca un objeto y luego su gemelo.",
      hintMouse: "O haz clic en un objeto y luego en su gemelo.",
      keys: "Las flechas te mueven entre casillas. Intro o Espacio coge un objeto y lo suelta. Escape lo devuelve a su sitio.",
      caseTitle: "Pistas por encontrar",
      progress: "{n} de 3 pistas encontradas",
      newBoard: "Nuevo tablero",
      empty: "Casilla vacía",
      picked: "Has cogido: {item}. Elige su gemelo o una casilla vacía.",
      merged: "Nuevo objeto: {item}.",
      found: "Pista encontrada: {item}.",
      missing: "{item}: aún sin encontrar",
      winTitle: "Un recuerdo ha vuelto.",
      winText: "Una pieza de la noche que olvidó. El resto está en el juego.",
      again: "Jugar otra vez"
    },
    items: {
      note1: "Papel rasgado",
      note2: "Nota doblada",
      note3: "Carta lacrada",
      key1: "Llave antigua",
      key2: "Llavero",
      key3: "Caja cerrada con llave",
      photo1: "Esquina de foto",
      photo2: "Media foto",
      photo3: "Foto enmarcada",
      memory: "Recuerdo"
    }
  },
  support: {
    title: "¿Necesitas ayuda? Escríbenos.",
    lead: "Una sola dirección para todo: preguntas, problemas en un juego, ideas y solicitudes sobre tus datos. Leemos todos los mensajes.",
    mail: {
      title: "Nuestro correo",
      write: "Escribir un correo",
      copy: "Copiar dirección",
      copied: "Copiada",
      copiedNote: "La dirección está en tu portapapeles.",
      copyFail: "Selecciona la dirección de arriba y cópiala."
    },
    letter: {
      title: "Qué incluir en tu mensaje",
      lead: "Unos pocos detalles nos ayudan a encontrar el problema antes.",
      game: "El nombre del juego",
      device: "El modelo de tu teléfono o tableta",
      os: "La versión de iOS o Android (la encontrarás en Ajustes)",
      what: "Qué pasó y qué esperabas. Una captura de pantalla ayuda mucho."
    },
    faq: {
      title: "Preguntas frecuentes",
      progressQuestion: "¿Dónde se guarda mi progreso?",
      progressAnswer:
        "En tu dispositivo. Tu progreso se queda en el teléfono o la tableta donde juegas. Si borras el juego, el progreso se borra con él.",
      deleteQuestion: "¿Cómo elimino mis datos?",
      deleteAnswer:
        "Sigue los pasos de la página {link}. También puedes escribirnos y te ayudaremos.",
      deleteLink: "Eliminar tus datos",
      privacyQuestion: "¿Cómo protegéis mi privacidad?",
      privacyAnswer: "Nuestra {link} explica qué datos usan nuestros juegos y por qué.",
      privacyLink: "Política de privacidad"
    }
  },
  legal: {
    titles: {
      privacy: "Política de privacidad",
      terms: "Condiciones de uso",
      deleteData: "Eliminar tus datos"
    },
    contents: "Índice",
    inShort: "En resumen",
    updated: "Última actualización: {date}",
    draft: "Borrador. Los campos resaltados, como {placeholder}, aún no están completos.",
    fallback: "Esta página está disponible en inglés."
  },
  deleteData: {
    facts: {
      developer: "Desarrollador",
      apps: "Apps",
      appsValue: "A Memory Missing: Merge Game y los futuros juegos de Kitto",
      ids: "ID de las apps"
    },
    cta: "Enviar solicitud de eliminación",
    mailSubject: "Delete my data",
    deleted: "Se elimina",
    kept: "Se conserva",
    nothing: "Nada.",
    nothingNote: "Tras la eliminación, no conservamos ninguno de tus datos."
  },
  notFound: {
    title: "Página no encontrada",
    text: "Esta página no existe o se ha movido.",
    home: "Ir a la página de inicio"
  }
};
