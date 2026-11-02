/**
 * @file Korean «Terms of Use», translated from the English text in the formal style (합니다체).
 *
 * Keeps every slot of the English document: `{email:support}` and `{route:privacy}`.
 */
import type { LegalDocument } from "../../types";

/** The Korean «Terms of Use» document. */
export const termsKo: LegalDocument = {
  intro:
    "이 약관은 Kitto 게임과 웹사이트 kitto.studio를 이용할 때 적용됩니다. 이를 이용하면 이 약관에 동의하는 것으로 간주됩니다. 약관이 짧으니 꼭 읽어 주십시오.",
  inShort: [
    "저희 게임과 사이트는 개인적이고 비상업적인 용도로 이용할 수 있습니다.",
    "게임과 게임 속 모든 것은 Kitto Studio에 귀속됩니다.",
    "구매는 App Store 또는 Google Play를 통해 각 스토어의 약관에 따라 이루어집니다.",
    "공정하게 플레이하고 게임이나 사이트를 악용하지 마십시오."
  ],
  sections: [
    {
      id: "who",
      heading: "저희 소개",
      blocks: [
        {
          kind: "paragraph",
          html: "Kitto Studio는 휴대폰용 퍼즐 게임을 만드는 작은 가족 스튜디오입니다. Kitto Studio는 개인인 Hanna Kucherenko(주소: Calle Ventura Selva González 9, Bungalow 28, 03130 Gran Alacant, Santa Pola (Alicante), Spain)가 운영합니다. 이 약관은 이용자와 저희 사이의 계약입니다. {email:support}로 연락하실 수 있습니다."
        }
      ]
    },
    {
      id: "licence",
      heading: "이용 허락",
      blocks: [
        {
          kind: "paragraph",
          html: "저희는 이용자가 개인적이고 비상업적인 용도로 저희 게임과 웹사이트를 다운로드하고 이용할 수 있도록 개인적이고 비독점적이며 양도할 수 없는 라이선스를 부여합니다."
        },
        {
          kind: "paragraph",
          html: "저희의 서면 허락 없이 이를 상업적 목적으로 이용할 수 없습니다."
        }
      ]
    },
    {
      id: "content",
      heading: "저희 콘텐츠",
      blocks: [
        {
          kind: "paragraph",
          html: "저희 게임과 웹사이트, 그리고 그 안의 모든 것(아트워크, 캐릭터, 음악, 텍스트, 코드, Kitto 이름과 로고 포함)은 Kitto Studio에 귀속되며 지식재산권법의 보호를 받습니다."
        },
        {
          kind: "paragraph",
          html: "이 약관은 위의 라이선스를 넘어서는 어떠한 권리도 이용자에게 부여하지 않습니다."
        }
      ]
    },
    {
      id: "purchases",
      heading: "구매",
      blocks: [
        {
          kind: "paragraph",
          html: "게임에서 구매를 제공하는 경우, Apple App Store 또는 Google Play가 이를 판매하고 처리합니다. 결제와 환불에는 해당 스토어의 약관이 적용됩니다. 환불을 요청하려면 구매한 스토어에 문의하십시오."
        },
        { kind: "paragraph", html: "저희는 이용자의 결제 정보를 받지 않습니다." }
      ]
    },
    {
      id: "use",
      heading: "허용되는 이용",
      blocks: [
        {
          kind: "paragraph",
          html: "저희 게임과 웹사이트를 이용할 때 다음 행위를 하지 마십시오."
        },
        {
          kind: "list",
          items: [
            "저희 게임이나 그 콘텐츠를 복제, 판매, 대여 또는 재배포하는 행위",
            "법률이 허용하는 경우를 제외하고 게임을 리버스 엔지니어링, 디컴파일 또는 수정하는 행위",
            "게임의 작동을 방해하는 도구를 사용하는 행위",
            "저희 게임이나 웹사이트를 이용해 법을 위반하거나 타인에게 해를 끼치는 행위",
            "저희 웹사이트를 방해하거나 무단으로 접근하려는 행위"
          ]
        }
      ]
    },
    {
      id: "as-is",
      heading: "게임의 ‘있는 그대로’ 제공",
      blocks: [
        {
          kind: "paragraph",
          html: "저희는 정성을 다해 게임을 만듭니다. 법률이 허용하는 범위에서 저희는 게임을 ‘있는 그대로’, ‘이용 가능한 상태로’ 제공합니다. 오류가 없거나 항상 이용할 수 있다고 보장하지 않습니다."
        },
        {
          kind: "paragraph",
          html: "이 약관의 어떠한 내용도 법률상 제한할 수 없는 소비자로서의 권리를 제한하지 않습니다."
        }
      ]
    },
    {
      id: "liability",
      heading: "책임의 제한",
      blocks: [
        {
          kind: "paragraph",
          html: "법률이 허용하는 범위에서 Kitto Studio는 저희 게임이나 웹사이트 이용으로 인해 발생하는 간접적 손해 또는 결과적 손해에 대해 책임지지 않습니다."
        },
        {
          kind: "paragraph",
          html: "진행 상황은 기기에만 저장됩니다. 게임을 삭제하거나 게임 데이터를 지우면 진행 상황이 사라지며, 저희는 이를 복원할 수 없습니다."
        },
        {
          kind: "paragraph",
          html: "이 약관의 어떠한 내용도 법률상 배제할 수 없는 책임을 배제하지 않습니다."
        }
      ]
    },
    {
      id: "law",
      heading: "준거법",
      blocks: [
        { kind: "paragraph", html: "이 약관은 스페인 법률의 적용을 받습니다." },
        {
          kind: "paragraph",
          html: "소비자인 경우, 거주하는 국가의 강행 법규에 따른 보호도 그대로 받습니다."
        }
      ]
    },
    {
      id: "privacy",
      heading: "개인정보",
      blocks: [
        {
          kind: "paragraph",
          html: '정보를 처리하는 방식은 <a href="{route:privacy}">개인정보 처리방침</a>에 설명되어 있습니다. 간단히 말해, 저희 게임은 모든 데이터를 기기에 보관하며 저희는 개인정보를 수집하지 않습니다.'
        }
      ]
    },
    {
      id: "changes",
      heading: "약관 변경",
      blocks: [
        {
          kind: "paragraph",
          html: "저희는 이 약관을 업데이트할 수 있습니다. 이 경우 이 페이지와 상단의 ‘최종 업데이트’ 날짜를 업데이트합니다. 변경 후에도 저희 게임을 계속 이용하면 업데이트된 약관이 적용됩니다."
        }
      ]
    },
    {
      id: "contact",
      heading: "문의",
      blocks: [
        {
          kind: "paragraph",
          html: "이 약관에 관한 질문이 있으신가요? {email:support}로 메일을 보내 주십시오."
        }
      ]
    }
  ]
};
