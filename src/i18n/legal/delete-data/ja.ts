/**
 * @file Japanese «Delete your data», translated from the English text.
 *
 * Keeps every slot of the English document: `{email:delete}` and `{route:privacy}`. The menu labels
 * in the steps are the ones Android and iOS show in Japanese. The subject in the `email` steps is
 * the `deleteData.mailSubject` string of `locales/ja.ts`.
 */
import type { LegalDocument } from "../../types";

/** The Japanese «Delete your data» document. */
export const deleteDataJa: LegalDocument = {
  intro: "このページでは、Kitto Studio のゲームのデータを削除する方法を説明します。",
  inShort: [
    "アカウントがないため、削除するアカウントもありません。",
    "ゲームのデータを私たちのサーバーには保存していません。",
    "ゲームのデータはお使いの端末にのみ保存されています。数回のタップで、ご自身で削除できます。",
    "メールをいただいた場合は、ご依頼から30日以内にメールを削除します。"
  ],
  sections: [
    {
      id: "nothing",
      heading: "アカウントなし、サーバーにもデータなし",
      blocks: [
        {
          kind: "paragraph",
          html: "私たちのゲームにはアカウントがなく、私たちにデータを送信することもありません。進行状況と設定は、お使いの端末にのみ保存されます。"
        },
        {
          kind: "paragraph",
          html: "そのため、私たちの側で削除するものはありません。ゲームのデータは、すべてお客様ご自身で管理できます。"
        }
      ]
    },
    {
      id: "android",
      heading: "Android でゲームのデータを削除する",
      blocks: [
        {
          kind: "steps",
          items: [
            "スマートフォンで<b>設定</b>を開きます。",
            "<b>アプリ</b>をタップします。",
            "ゲームを探してタップします（例：<b>A Memory Missing: Merge Game</b>）。",
            "<b>ストレージ</b>をタップします。",
            "<b>ストレージを消去</b>をタップします。"
          ]
        },
        {
          kind: "paragraph",
          html: "または、ゲームをアンインストールしてください。ゲームのデータがすべてスマートフォンから削除されます。メニューの名前は、機種によって多少異なる場合があります。"
        }
      ]
    },
    {
      id: "iphone",
      heading: "iPhone でゲームのデータを削除する",
      blocks: [
        {
          kind: "steps",
          items: [
            "ホーム画面でゲームのアイコンを長押しします。",
            "<b>Appを削除</b>をタップします。",
            "もう一度<b>Appを削除</b>をタップし、続けて<b>削除</b>をタップします。"
          ]
        },
        {
          kind: "paragraph",
          html: "App を削除すると、そのデータもすべて iPhone から削除されます。"
        }
      ]
    },
    {
      id: "email",
      heading: "メールをいただいた場合",
      blocks: [
        {
          kind: "paragraph",
          html: "メールをいただいた場合、私たちはお客様のメールアドレスとメッセージを保有しています。削除をご希望の場合は、次の手順に従ってください。"
        },
        {
          kind: "steps",
          items: [
            "以前に使用したアドレスから {email:delete} にメールを送ってください。",
            "件名は「データの削除依頼」としてください。",
            "30日以内にメッセージを削除し、確認のメールをお送りします。"
          ]
        }
      ]
    },
    {
      id: "kept",
      heading: "削除されるものと残るもの",
      blocks: [
        {
          kind: "list",
          items: [
            "ゲームの進行状況と設定。お使いの端末で、ご自身で削除します。",
            "メールとメールアドレス。ご依頼に応じて、私たちが削除します。"
          ]
        }
      ]
    },
    {
      id: "questions",
      heading: "ご質問",
      blocks: [
        {
          kind: "paragraph",
          html: '{email:delete} までご連絡ください。データの取り扱いについては、<a href="{route:privacy}">プライバシーポリシー</a>で説明しています。'
        }
      ]
    }
  ]
};
