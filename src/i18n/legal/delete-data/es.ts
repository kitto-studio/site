/**
 * @file Spanish (Spain) «Eliminar tus datos», translated from `en.ts`.
 *
 * Same sections, blocks, slots and tags as `en.ts`; only the words are translated. Menu labels are
 * the ones Android and iOS show in Spanish (Spain). The mail subject stays «Delete my data», the same
 * as `deleteData.mailSubject` in `locales/es.ts`.
 */
import type { LegalDocument } from "../../types";

/** The Spanish «Delete your data» document. */
export const deleteDataEs: LegalDocument = {
  intro: "Esta página explica cómo eliminar tus datos de los juegos de Kitto Studio.",
  inShort: [
    "No hay cuentas, así que no hay ninguna cuenta que eliminar.",
    "No guardamos datos de los juegos en nuestros servidores.",
    "Los datos de los juegos están solo en tu dispositivo. Puedes eliminarlos por tu cuenta con unos pocos toques.",
    "Si nos has escrito, eliminamos tus correos en un plazo de 30 días desde tu solicitud."
  ],
  sections: [
    {
      id: "nothing",
      heading: "Sin cuentas y nada en nuestros servidores",
      blocks: [
        {
          kind: "paragraph",
          html: "Nuestros juegos no tienen cuentas y no nos envían ningún dato. Tu progreso y tus ajustes se guardan solo en tu dispositivo."
        },
        {
          kind: "paragraph",
          html: "Por eso no hay nada que eliminar por nuestra parte. Tienes el control total de los datos de tus juegos."
        }
      ]
    },
    {
      id: "android",
      heading: "Eliminar los datos del juego en Android",
      blocks: [
        {
          kind: "steps",
          items: [
            "Abre <b>Ajustes</b> en tu teléfono.",
            "Toca <b>Aplicaciones</b>.",
            "Busca el juego y tócalo, por ejemplo <b>A Memory Missing: Merge Game</b>.",
            "Toca <b>Almacenamiento</b>.",
            "Toca <b>Borrar almacenamiento</b>."
          ]
        },
        {
          kind: "paragraph",
          html: "O desinstala el juego: así se eliminan todos sus datos del teléfono. Los nombres de los menús pueden variar un poco según el teléfono."
        }
      ]
    },
    {
      id: "iphone",
      heading: "Eliminar los datos del juego en iPhone",
      blocks: [
        {
          kind: "steps",
          items: [
            "Mantén pulsado el icono del juego en la pantalla de inicio.",
            "Toca <b>Eliminar app</b>.",
            "En la ventana que aparece, toca <b>Eliminar app</b> y, después, <b>Eliminar</b>."
          ]
        },
        {
          kind: "paragraph",
          html: "Al eliminar la app, se borran todos sus datos del iPhone."
        }
      ]
    },
    {
      id: "email",
      heading: "Si nos has escrito",
      blocks: [
        {
          kind: "paragraph",
          html: "Si nos has enviado un correo, tenemos tu dirección de correo electrónico y tus mensajes. Para que los eliminemos:"
        },
        {
          kind: "steps",
          items: [
            "Escribe a {email:delete} desde la misma dirección que usaste antes.",
            "Pon como asunto «Delete my data».",
            "Eliminaremos tus mensajes en un plazo de 30 días y te enviaremos una confirmación."
          ]
        }
      ]
    },
    {
      id: "kept",
      heading: "Qué se elimina y qué se conserva",
      blocks: [
        {
          kind: "list",
          items: [
            "El progreso y los ajustes de tus juegos. Los eliminas tú en tu dispositivo.",
            "Tus correos y tu dirección de correo electrónico. Los eliminamos cuando nos lo pidas."
          ]
        }
      ]
    },
    {
      id: "questions",
      heading: "Preguntas",
      blocks: [
        {
          kind: "paragraph",
          html: 'Escribe a {email:delete}. Cómo tratamos los datos se explica en nuestra <a href="{route:privacy}">Política de privacidad</a>.'
        }
      ]
    }
  ]
};
