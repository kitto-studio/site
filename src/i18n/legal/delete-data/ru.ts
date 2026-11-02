/**
 * @file Russian «Удаление данных», from the approved prototype text.
 *
 * Same sections, blocks, slots and tags as `en.ts`; only the words are translated. Menu labels are
 * the ones Android and iOS show in Russian. The mail subject stays «Delete my data», the same as
 * `deleteData.mailSubject` in `locales/ru.ts`.
 */
import type { LegalDocument } from "../../types";

/** The Russian «Delete your data» document. */
export const deleteDataRu: LegalDocument = {
  intro: "Здесь рассказано, как удалить свои данные из игр Kitto Studio.",
  inShort: [
    "Аккаунтов нет, поэтому удалять аккаунт не нужно.",
    "Мы не храним данные игр на своих серверах.",
    "Данные игры хранятся только на вашем устройстве. Вы можете удалить их сами за пару касаний.",
    "Если вы писали нам, мы удалим ваши письма в течение 30 дней после запроса."
  ],
  sections: [
    {
      id: "nothing",
      heading: "Нет аккаунтов и ничего на наших серверах",
      blocks: [
        {
          kind: "paragraph",
          html: "В наших играх нет аккаунтов, и они ничего нам не отправляют. Прогресс и настройки хранятся только на вашем устройстве."
        },
        {
          kind: "paragraph",
          html: "Поэтому с нашей стороны удалять нечего. Данные игры полностью в ваших руках."
        }
      ]
    },
    {
      id: "android",
      heading: "Как удалить данные игры на Android",
      blocks: [
        {
          kind: "steps",
          items: [
            "Откройте <b>Настройки</b> на телефоне.",
            "Нажмите <b>Приложения</b>.",
            "Найдите и откройте игру, например <b>A Memory Missing: Merge Game</b>.",
            "Нажмите <b>Хранилище</b>.",
            "Нажмите <b>Очистить хранилище</b>."
          ]
        },
        {
          kind: "paragraph",
          html: "Или просто удалите игру — вместе с ней с телефона удалятся все её данные. Названия пунктов меню на разных телефонах могут немного отличаться."
        }
      ]
    },
    {
      id: "iphone",
      heading: "Как удалить данные игры на iPhone",
      blocks: [
        {
          kind: "steps",
          items: [
            "Коснитесь значка игры на экране «Домой» и удерживайте его.",
            "Нажмите <b>Удалить приложение</b>.",
            "В появившемся окне нажмите <b>Удалить приложение</b>, затем <b>Удалить</b>."
          ]
        },
        {
          kind: "paragraph",
          html: "Вместе с приложением с iPhone удаляются все его данные."
        }
      ]
    },
    {
      id: "email",
      heading: "Если вы писали нам",
      blocks: [
        {
          kind: "paragraph",
          html: "Если вы писали нам, у нас есть ваш адрес электронной почты и ваши письма. Чтобы мы их удалили:"
        },
        {
          kind: "steps",
          items: [
            "Напишите на {email:delete} с того же адреса, с которого писали раньше.",
            "Укажите тему «Delete my data».",
            "Мы удалим ваши письма в течение 30 дней и пришлём подтверждение."
          ]
        }
      ]
    },
    {
      id: "kept",
      heading: "Что удаляется и что остаётся",
      blocks: [
        {
          kind: "list",
          items: [
            "Прогресс и настройки игры. Вы удаляете их на своём устройстве.",
            "Ваши письма и адрес электронной почты. Мы удаляем их по вашей просьбе."
          ]
        }
      ]
    },
    {
      id: "questions",
      heading: "Вопросы",
      blocks: [
        {
          kind: "paragraph",
          html: 'Напишите на {email:delete}. Как мы обращаемся с данными, описано в нашей <a href="{route:privacy}">Политике конфиденциальности</a>.'
        }
      ]
    }
  ]
};
