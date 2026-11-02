/**
 * @file Simplified Chinese «Delete your data», translated from the English text (formal 您).
 *
 * Keeps every slot of the English document: `{email:delete}` and `{route:privacy}`. The menu labels
 * in the steps are the ones Android and iOS show in Simplified Chinese. The subject in the `email`
 * steps is the `deleteData.mailSubject` string of `locales/zh.ts`.
 */
import type { LegalDocument } from "../../types";

/** The Simplified Chinese «Delete your data» document. */
export const deleteDataZh: LegalDocument = {
  intro: "本页面说明如何删除 Kitto Studio 所制作游戏中的数据。",
  inShort: [
    "没有账号，因此也没有需要删除的账号。",
    "我们的服务器上不保存任何游戏数据。",
    "游戏数据只保存在您的设备上。您只需轻点几下即可自行删除。",
    "如果您给我们写过信，我们会在您提出请求后 30 天内删除您的邮件。"
  ],
  sections: [
    {
      id: "nothing",
      heading: "没有账号，我们的服务器上也没有数据",
      blocks: [
        {
          kind: "paragraph",
          html: "我们的游戏没有账号，也不会向我们发送任何数据。您的进度和设置只保存在您的设备上。"
        },
        {
          kind: "paragraph",
          html: "因此，我们这边没有任何需要删除的内容。您可以完全掌控自己的游戏数据。"
        }
      ]
    },
    {
      id: "android",
      heading: "在 Android 上删除游戏数据",
      blocks: [
        {
          kind: "steps",
          items: [
            "打开手机上的<b>设置</b>。",
            "点按<b>应用</b>。",
            "找到并点按该游戏，例如 <b>A Memory Missing: Merge Game</b>。",
            "点按<b>存储</b>。",
            "点按<b>清除存储空间</b>。"
          ]
        },
        {
          kind: "paragraph",
          html: "或者卸载游戏：这会从您的手机上删除它的全部数据。不同手机的菜单名称可能略有不同。"
        }
      ]
    },
    {
      id: "iphone",
      heading: "在 iPhone 上删除游戏数据",
      blocks: [
        {
          kind: "steps",
          items: [
            "在主屏幕上按住游戏图标。",
            "轻点<b>移除 App</b>。",
            "轻点<b>删除 App</b>，然后轻点<b>删除</b>。"
          ]
        },
        {
          kind: "paragraph",
          html: "删除 App 会从您的 iPhone 上移除它的全部数据。"
        }
      ]
    },
    {
      id: "email",
      heading: "如果您给我们写过信",
      blocks: [
        {
          kind: "paragraph",
          html: "如果您给我们发过邮件，我们会持有您的邮箱地址和邮件内容。如需删除："
        },
        {
          kind: "steps",
          items: [
            "使用您之前用过的邮箱地址写信至 {email:delete}。",
            "使用邮件主题“删除我的数据”。",
            "我们会在 30 天内删除您的邮件，并向您发送确认邮件。"
          ]
        }
      ]
    },
    {
      id: "kept",
      heading: "哪些会被删除，哪些会被保留",
      blocks: [
        {
          kind: "list",
          items: [
            "您的游戏进度和设置。由您在设备上自行删除。",
            "您的邮件和邮箱地址。我们会应您的要求删除。"
          ]
        }
      ]
    },
    {
      id: "questions",
      heading: "问题",
      blocks: [
        {
          kind: "paragraph",
          html: '请写信至 {email:delete}。我们如何处理数据，请参阅我们的<a href="{route:privacy}">隐私政策</a>。'
        }
      ]
    }
  ]
};
