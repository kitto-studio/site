/**
 * @file Japanese «Privacy Policy», translated from the English text.
 *
 * Keeps every slot of the English document: `{email:support}` and `{route:deleteData}`.
 */
import type { LegalDocument } from "../../types";

/** The Japanese «Privacy Policy» document. */
export const privacyJa: LegalDocument = {
  intro:
    "このポリシーでは、Kitto のゲームで遊ぶとき、kitto.studio を訪れるとき、または私たちにメールを送るときに、お客様の情報がどう扱われるかを説明します。簡単に言えば、私たちのゲームはすべてのデータをお使いの端末に保存し、私たちは個人データを収集しません。",
  inShort: [
    "ゲームは、進行状況と設定をお使いの端末にのみ保存します。",
    "アカウント、分析、広告、トラッキングはありません。",
    "個人データを収集したり販売したりすることはありません。",
    "メールをいただいた場合、そのアドレスは返信のためにのみ使用します。"
  ],
  sections: [
    {
      id: "who",
      heading: "私たちについて",
      blocks: [
        {
          kind: "paragraph",
          html: "Kitto Studio は家族で営む小さなスタジオで、スマートフォン向けのパズルゲームを作っています。Kitto Studio は個人である Hanna Kucherenko（住所：Calle Ventura Selva González 9, Bungalow 28, 03130 Gran Alacant, Santa Pola (Alicante), Spain）が運営しており、このポリシーに記載された情報について責任を負います。ご連絡は {email:support} までお願いします。"
        }
      ]
    },
    {
      id: "scope",
      heading: "このポリシーの対象",
      blocks: [
        { kind: "paragraph", html: "このポリシーは、次のものに適用されます。" },
        {
          kind: "list",
          items: [
            'ゲーム。アプリ ID は studio.kitto で始まります（例：<span translate="no">studio.kitto.memorymissing</span>）。最初のゲームは A Memory Missing: Merge Game で、まだリリースされていません。',
            "ウェブサイト kitto.studio。",
            "{email:support} に送られたメール。"
          ]
        }
      ]
    },
    {
      id: "games",
      heading: "ゲームについて",
      blocks: [
        {
          kind: "paragraph",
          html: "ゲームは、進行状況と設定をお使いの端末にのみ保存します。それらを私たちやほかの誰かに送信することはありません。"
        },
        {
          kind: "list",
          items: [
            "<strong>アカウントなし。</strong>登録やログインは一切不要です。",
            "<strong>分析なし。</strong>プレイの仕方を計測しません。",
            "<strong>広告なし。</strong>ゲームに広告は表示されません。",
            "<strong>トラッキングなし。</strong>アプリやウェブサイトをまたいでお客様を追跡しません。",
            "<strong>データを収集する SDK なし。</strong>個人データを収集するサードパーティ製 SDK は使用しません。"
          ]
        },
        {
          kind: "paragraph",
          html: "ゲームを通じて個人データを収集しないため、販売や共有できるデータもありません。"
        }
      ]
    },
    {
      id: "purchases",
      heading: "購入",
      blocks: [
        {
          kind: "paragraph",
          html: "ゲーム内で購入ができる場合、その処理は Apple の App Store または Google Play が、それぞれの規約に基づいて行います。私たちがお客様の支払い情報を受け取ることはありません。"
        },
        {
          kind: "paragraph",
          html: 'Apple と Google によるデータの取り扱いについては、<a href="https://www.apple.com/legal/privacy/" rel="noopener">Apple のプライバシーポリシー</a>と<a href="https://policies.google.com/privacy" rel="noopener">Google のプライバシーポリシー</a>をご覧ください。'
        }
      ]
    },
    {
      id: "email",
      heading: "メールをいただいた場合",
      blocks: [
        {
          kind: "paragraph",
          html: "{email:support} にメールを送ると、私たちはお客様のメールアドレスとメッセージを受け取ります。これらは返信のためにのみ使用します。"
        },
        {
          kind: "paragraph",
          html: "保存するのは、対応に必要な期間だけです。ご依頼があれば削除します。"
        }
      ]
    },
    {
      id: "website",
      heading: "ウェブサイトについて",
      blocks: [
        {
          kind: "paragraph",
          html: "kitto.studio は静的なウェブサイトです。Cookie も分析ツールも使用していません。"
        },
        {
          kind: "paragraph",
          html: "テーマと言語の選択は、ブラウザのローカルストレージに保存されます。この情報はブラウザ内にとどまり、私たちが見ることはできません。ブラウザの設定から、いつでも消去できます。"
        },
        {
          kind: "paragraph",
          html: 'ホスティングプロバイダーの Cloudflare は、サイトの安全を保ち、サイトをお届けするために、IP アドレスなどの技術データをサーバーログで処理することがあります。<a href="https://www.cloudflare.com/privacypolicy/" rel="noopener">Cloudflare のプライバシーポリシー</a>をご覧ください。'
        }
      ]
    },
    {
      id: "children",
      heading: "お子様について",
      blocks: [
        {
          kind: "paragraph",
          html: "私たちのゲームは、13歳以上のプレイヤーを対象としています。13歳未満のお子様を対象としたものではなく、お子様から個人データを故意に収集することはありません。そもそも、私たちのゲームは誰からも個人データを収集しません。"
        }
      ]
    },
    {
      id: "rights",
      heading: "お客様の権利",
      blocks: [
        {
          kind: "paragraph",
          html: "お住まいの地域によっては、GDPR、UK GDPR、CCPA などに基づき、お客様には次の権利があります。"
        },
        {
          kind: "list",
          items: [
            "私たちが保有するお客様の個人データにアクセスする権利",
            "それを訂正する権利",
            "それを削除してもらう権利",
            "その利用に異議を唱える権利",
            "データ保護監督機関に苦情を申し立てる権利"
          ]
        },
        {
          kind: "paragraph",
          html: '実際には、私たちが保有している可能性のある個人データは、お客様から届いたメールだけです。これらの権利を行使するには、{email:support} までご連絡ください。データを削除するには、<a href="{route:deleteData}">データの削除</a>をご覧ください。'
        }
      ]
    },
    {
      id: "changes",
      heading: "このポリシーの変更",
      blocks: [
        {
          kind: "paragraph",
          html: "このポリシーを変更する場合は、このページと、ページ上部の「最終更新日」を更新します。"
        }
      ]
    },
    {
      id: "contact",
      heading: "お問い合わせ",
      blocks: [
        {
          kind: "paragraph",
          html: "プライバシーに関するご質問は、{email:support} までお寄せください。"
        }
      ]
    }
  ]
};
