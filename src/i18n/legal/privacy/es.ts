/**
 * @file Spanish (Spain) «Política de privacidad», translated from `en.ts`.
 *
 * Same sections, blocks, slots and tags as `en.ts`; only the words are translated.
 */
import type { LegalDocument } from "../../types";

/** The Spanish «Privacy Policy» document. */
export const privacyEs: LegalDocument = {
  intro:
    "Esta política explica qué ocurre con tu información cuando juegas a los juegos de Kitto, visitas kitto.studio o nos escribes. En pocas palabras: nuestros juegos guardan todo en tu dispositivo y no recopilamos datos personales.",
  inShort: [
    "Nuestros juegos guardan el progreso y los ajustes solo en tu dispositivo.",
    "Sin cuentas, sin analíticas, sin publicidad, sin rastreo.",
    "No recopilamos ni vendemos datos personales.",
    "Si nos escribes, usamos tu dirección solo para responderte."
  ],
  sections: [
    {
      id: "who",
      heading: "Quiénes somos",
      blocks: [
        {
          kind: "paragraph",
          html: "Kitto Studio es un pequeño estudio familiar. Hacemos juegos de puzles para móviles. Kitto Studio está gestionado por una persona física, Hanna Kucherenko, Calle Ventura Selva González 9, Bungalow 28, 03130 Gran Alacant, Santa Pola (Alicante), España, que es la responsable del tratamiento de la información descrita en esta política. Puedes contactar con nosotros en {email:support}."
        }
      ]
    },
    {
      id: "scope",
      heading: "Qué cubre esta política",
      blocks: [
        { kind: "paragraph", html: "Esta política se aplica a:" },
        {
          kind: "list",
          items: [
            'Nuestros juegos. Sus ID de app empiezan por studio.kitto, por ejemplo <span translate="no">studio.kitto.memorymissing</span>. Nuestro primer juego es A Memory Missing: Merge Game. Aún no se ha publicado.',
            "Nuestro sitio web, kitto.studio.",
            "Los correos que envíes a {email:support}."
          ]
        }
      ]
    },
    {
      id: "games",
      heading: "Nuestros juegos",
      blocks: [
        {
          kind: "paragraph",
          html: "Nuestros juegos guardan tu progreso y tus ajustes solo en tu dispositivo. No nos los envían ni a nosotros ni a nadie más."
        },
        {
          kind: "list",
          items: [
            "<strong>Sin cuentas.</strong> Nunca te registras ni inicias sesión.",
            "<strong>Sin analíticas.</strong> No medimos cómo juegas.",
            "<strong>Sin publicidad.</strong> Nuestros juegos no muestran anuncios.",
            "<strong>Sin rastreo.</strong> No te seguimos a través de otras apps ni sitios web.",
            "<strong>Sin SDK que recopilen datos.</strong> No usamos SDK de terceros que recopilen datos personales."
          ]
        },
        {
          kind: "paragraph",
          html: "No recopilamos datos personales a través de nuestros juegos, así que no tenemos ninguno que vender o compartir."
        }
      ]
    },
    {
      id: "purchases",
      heading: "Compras",
      blocks: [
        {
          kind: "paragraph",
          html: "Si un juego ofrece compras, las procesa el App Store de Apple o Google Play según sus propias condiciones. Nunca recibimos tus datos de pago."
        },
        {
          kind: "paragraph",
          html: 'Para saber cómo tratan tus datos Apple y Google, lee la <a href="https://www.apple.com/legal/privacy/" rel="noopener">Política de privacidad de Apple</a> y la <a href="https://policies.google.com/privacy" rel="noopener">Política de privacidad de Google</a>.'
        }
      ]
    },
    {
      id: "email",
      heading: "Cuando nos escribes",
      blocks: [
        {
          kind: "paragraph",
          html: "Si escribes a {email:support}, recibimos tu dirección de correo electrónico y tu mensaje. Solo los usamos para responderte."
        },
        {
          kind: "paragraph",
          html: "Los conservamos solo mientras los necesitemos para ayudarte. Los eliminamos cuando nos lo pidas."
        }
      ]
    },
    {
      id: "website",
      heading: "Nuestro sitio web",
      blocks: [
        {
          kind: "paragraph",
          html: "kitto.studio es un sitio web estático. No usa cookies ni analíticas."
        },
        {
          kind: "paragraph",
          html: "Recuerda el tema y el idioma que eliges en el almacenamiento local de tu navegador. Esta información se queda en tu navegador y nosotros no podemos verla. Puedes borrarla cuando quieras en los ajustes del navegador."
        },
        {
          kind: "paragraph",
          html: 'Nuestro proveedor de alojamiento, Cloudflare, puede tratar datos técnicos, como direcciones IP, en los registros del servidor para mantener el sitio seguro y servírtelo. Lee la <a href="https://www.cloudflare.com/privacypolicy/" rel="noopener">Política de privacidad de Cloudflare</a>.'
        }
      ]
    },
    {
      id: "children",
      heading: "Menores",
      blocks: [
        {
          kind: "paragraph",
          html: "Nuestros juegos están pensados para jugadores de 13 años o más. No están dirigidos a menores de 13 años y no recopilamos a sabiendas datos personales de menores. De hecho, nuestros juegos no recopilan datos personales de nadie."
        }
      ]
    },
    {
      id: "rights",
      heading: "Tus derechos",
      blocks: [
        {
          kind: "paragraph",
          html: "Según dónde vivas, por ejemplo en virtud del RGPD, del RGPD del Reino Unido o de la CCPA, tienes derecho a:"
        },
        {
          kind: "list",
          items: [
            "acceder a los datos personales que tenemos sobre ti;",
            "rectificarlos;",
            "solicitar su supresión;",
            "oponerte a la forma en que los usamos;",
            "presentar una reclamación ante una autoridad de control en materia de protección de datos."
          ]
        },
        {
          kind: "paragraph",
          html: 'En la práctica, los únicos datos personales que podríamos tener son los de un correo que nos hayas enviado. Para ejercer cualquiera de estos derechos, escribe a {email:support}. Para eliminar tus datos, consulta <a href="{route:deleteData}">Eliminar tus datos</a>.'
        }
      ]
    },
    {
      id: "changes",
      heading: "Cambios en esta política",
      blocks: [
        {
          kind: "paragraph",
          html: "Si cambiamos esta política, actualizaremos esta página y la fecha de «Última actualización» que aparece arriba."
        }
      ]
    },
    {
      id: "contact",
      heading: "Contacto",
      blocks: [
        { kind: "paragraph", html: "¿Preguntas sobre privacidad? Escribe a {email:support}." }
      ]
    }
  ]
};
