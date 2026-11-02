/**
 * @file Simplified Chinese «Terms of Use», translated from the English text (formal 您).
 *
 * Keeps every slot of the English document: `{email:support}` and `{route:privacy}`.
 */
import type { LegalDocument } from "../../types";

/** The Simplified Chinese «Terms of Use» document. */
export const termsZh: LegalDocument = {
  intro:
    "当您使用 Kitto 游戏和 kitto.studio 网站时，适用本条款。使用即表示您同意本条款。条款很短，请您阅读。",
  inShort: [
    "您可以将我们的游戏和网站用于个人、非商业用途。",
    "游戏及其中的一切归 Kitto Studio 所有。",
    "购买通过 App Store 或 Google Play 进行，并适用其条款。",
    "请公平游戏，不要滥用游戏或网站。"
  ],
  sections: [
    {
      id: "who",
      heading: "我们是谁",
      blocks: [
        {
          kind: "paragraph",
          html: "Kitto Studio 是一家小小的家庭工作室，专为手机制作益智游戏。Kitto Studio 由个人 Hanna Kucherenko 运营，地址：Calle Ventura Selva González 9, Bungalow 28, 03130 Gran Alacant, Santa Pola (Alicante), Spain。本条款是您与我们之间的协议。您可以通过 {email:support} 联系我们。"
        }
      ]
    },
    {
      id: "licence",
      heading: "您的许可",
      blocks: [
        {
          kind: "paragraph",
          html: "我们授予您一项个人的、非独占的、不可转让的许可，允许您为个人、非商业用途下载和使用我们的游戏和网站。"
        },
        {
          kind: "paragraph",
          html: "未经我们书面许可，您不得将其用于任何商业目的。"
        }
      ]
    },
    {
      id: "content",
      heading: "我们的内容",
      blocks: [
        {
          kind: "paragraph",
          html: "我们的游戏、网站及其中的一切，包括美术作品、角色、音乐、文字、代码以及 Kitto 名称和标志，均归 Kitto Studio 所有，并受知识产权法保护。"
        },
        {
          kind: "paragraph",
          html: "除上述许可外，本条款不授予您任何相关权利。"
        }
      ]
    },
    {
      id: "purchases",
      heading: "购买",
      blocks: [
        {
          kind: "paragraph",
          html: "如果游戏提供购买项目，将由 Apple App Store 或 Google Play 进行销售和处理。付款和退款适用其条款。如需退款，请联系您购买时所用的商店。"
        },
        { kind: "paragraph", html: "我们永远不会收到您的支付信息。" }
      ]
    },
    {
      id: "use",
      heading: "合理使用",
      blocks: [
        {
          kind: "paragraph",
          html: "使用我们的游戏和网站时，请不要："
        },
        {
          kind: "list",
          items: [
            "复制、出售、出租或再分发我们的游戏或其内容；",
            "对游戏进行逆向工程、反编译或修改，法律允许的情况除外；",
            "使用干扰游戏正常运行的工具；",
            "利用我们的游戏或网站违反法律或伤害他人；",
            "试图干扰我们的网站或未经授权访问网站。"
          ]
        }
      ]
    },
    {
      id: "as-is",
      heading: "游戏按“现状”提供",
      blocks: [
        {
          kind: "paragraph",
          html: "我们用心制作游戏。在法律允许的范围内，我们按“现状”和“现有”基础提供游戏。我们不保证游戏没有错误或始终可用。"
        },
        {
          kind: "paragraph",
          html: "本条款中的任何内容均不限制您作为消费者依法不可被限制的权利。"
        }
      ]
    },
    {
      id: "liability",
      heading: "责任限制",
      blocks: [
        {
          kind: "paragraph",
          html: "在法律允许的范围内，对于因您使用我们的游戏或网站而产生的间接损失或后果性损失，Kitto Studio 不承担责任。"
        },
        {
          kind: "paragraph",
          html: "您的进度仅保存在您的设备上。如果您删除游戏或清除其数据，进度将会丢失，我们无法恢复。"
        },
        {
          kind: "paragraph",
          html: "本条款中的任何内容均不排除依法不可排除的责任。"
        }
      ]
    },
    {
      id: "law",
      heading: "适用法律",
      blocks: [
        { kind: "paragraph", html: "本条款受西班牙法律管辖。" },
        {
          kind: "paragraph",
          html: "如果您是消费者，您仍受您居住国家强制性法律的保护。"
        }
      ]
    },
    {
      id: "privacy",
      heading: "隐私",
      blocks: [
        {
          kind: "paragraph",
          html: '我们如何处理信息，请参阅我们的<a href="{route:privacy}">隐私政策</a>。简单来说：我们的游戏把所有数据都保存在您的设备上，我们不收集个人数据。'
        }
      ]
    },
    {
      id: "changes",
      heading: "本条款的变更",
      blocks: [
        {
          kind: "paragraph",
          html: "我们可能会更新本条款。届时，我们会更新本页面以及页面顶部的“最后更新”日期。如果您在条款变更后继续使用我们的游戏，即适用更新后的条款。"
        }
      ]
    },
    {
      id: "contact",
      heading: "联系我们",
      blocks: [{ kind: "paragraph", html: "对本条款有疑问？请写信至 {email:support}。" }]
    }
  ]
};
