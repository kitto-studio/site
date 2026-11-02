/**
 * @file Ukrainian «Видалення даних», from the approved prototype text.
 *
 * Same sections, blocks, slots and tags as `en.ts`; only the words are translated. Menu labels are
 * the ones Android and iOS show in Ukrainian. The mail subject stays «Delete my data», the same as
 * `deleteData.mailSubject` in `locales/uk.ts`.
 */
import type { LegalDocument } from "../../types";

/** The Ukrainian «Delete your data» document. */
export const deleteDataUk: LegalDocument = {
  intro: "Тут пояснюємо, як видалити свої дані з ігор Kitto Studio.",
  inShort: [
    "Облікових записів немає, тож видаляти обліковий запис не треба.",
    "Ми не зберігаємо дані ігор на своїх серверах.",
    "Дані гри зберігаються лише на вашому пристрої. Ви можете видалити їх самі кількома дотиками.",
    "Якщо ви писали нам, ми видалимо ваші листи протягом 30 днів після запиту."
  ],
  sections: [
    {
      id: "nothing",
      heading: "Немає облікових записів і нічого на наших серверах",
      blocks: [
        {
          kind: "paragraph",
          html: "У наших іграх немає облікових записів, і вони нічого нам не надсилають. Прогрес і налаштування зберігаються лише на вашому пристрої."
        },
        {
          kind: "paragraph",
          html: "Тож з нашого боку видаляти нічого. Дані гри повністю у ваших руках."
        }
      ]
    },
    {
      id: "android",
      heading: "Як видалити дані гри на Android",
      blocks: [
        {
          kind: "steps",
          items: [
            "Відкрийте <b>Налаштування</b> на телефоні.",
            "Натисніть <b>Додатки</b>.",
            "Знайдіть і відкрийте гру, наприклад <b>A Memory Missing: Merge Game</b>.",
            "Натисніть <b>Пам’ять</b>.",
            "Натисніть <b>Очистити пам’ять</b>."
          ]
        },
        {
          kind: "paragraph",
          html: "Або просто видаліть гру — разом із нею з телефона зникнуть усі її дані. Назви пунктів меню на різних телефонах можуть трохи відрізнятися."
        }
      ]
    },
    {
      id: "iphone",
      heading: "Як видалити дані гри на iPhone",
      blocks: [
        {
          kind: "steps",
          items: [
            "Торкніться значка гри на початковому екрані й утримуйте його.",
            "Натисніть <b>Вилучити програму</b>.",
            "Натисніть <b>Видалити програму</b>, потім <b>Видалити</b>."
          ]
        },
        {
          kind: "paragraph",
          html: "Разом із програмою з iPhone видаляються всі її дані."
        }
      ]
    },
    {
      id: "email",
      heading: "Якщо ви писали нам",
      blocks: [
        {
          kind: "paragraph",
          html: "Якщо ви писали нам, у нас є ваша електронна адреса й ваші листи. Щоб ми їх видалили:"
        },
        {
          kind: "steps",
          items: [
            "Напишіть на {email:delete} з тієї самої адреси, з якої писали раніше.",
            "Вкажіть тему «Delete my data».",
            "Ми видалимо ваші листи протягом 30 днів і надішлемо підтвердження."
          ]
        }
      ]
    },
    {
      id: "kept",
      heading: "Що видаляється і що залишається",
      blocks: [
        {
          kind: "list",
          items: [
            "Прогрес і налаштування гри. Ви видаляєте їх на своєму пристрої.",
            "Ваші листи й електронна адреса. Ми видаляємо їх на ваше прохання."
          ]
        }
      ]
    },
    {
      id: "questions",
      heading: "Питання",
      blocks: [
        {
          kind: "paragraph",
          html: 'Напишіть на {email:delete}. Як ми поводимося з даними, описано в нашій <a href="{route:privacy}">Політиці конфіденційності</a>.'
        }
      ]
    }
  ]
};
