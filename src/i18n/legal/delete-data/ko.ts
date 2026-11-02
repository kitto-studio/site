/**
 * @file Korean «Delete your data», translated from the English text in the formal style (합니다체).
 *
 * Keeps every slot of the English document: `{email:delete}` and `{route:privacy}`. The menu labels
 * in the steps are the ones Android and iOS show in Korean. The subject in the `email` steps is the
 * `deleteData.mailSubject` string of `locales/ko.ts`.
 */
import type { LegalDocument } from "../../types";

/** The Korean «Delete your data» document. */
export const deleteDataKo: LegalDocument = {
  intro: "이 페이지는 Kitto Studio가 만든 게임에서 데이터를 삭제하는 방법을 설명합니다.",
  inShort: [
    "계정이 없으므로 삭제할 계정도 없습니다.",
    "저희 서버에는 게임 데이터를 보관하지 않습니다.",
    "게임 데이터는 기기에만 있습니다. 몇 번의 탭으로 직접 삭제할 수 있습니다.",
    "저희에게 메일을 보내셨다면, 요청 후 30일 이내에 메일을 삭제합니다."
  ],
  sections: [
    {
      id: "nothing",
      heading: "계정 없음, 저희 서버에도 데이터 없음",
      blocks: [
        {
          kind: "paragraph",
          html: "저희 게임에는 계정이 없으며 저희에게 어떤 데이터도 보내지 않습니다. 진행 상황과 설정은 기기에만 저장됩니다."
        },
        {
          kind: "paragraph",
          html: "따라서 저희 쪽에서 삭제할 것은 없습니다. 게임 데이터는 전적으로 이용자가 관리합니다."
        }
      ]
    },
    {
      id: "android",
      heading: "Android에서 게임 데이터 삭제",
      blocks: [
        {
          kind: "steps",
          items: [
            "휴대폰에서 <b>설정</b>을 엽니다.",
            "<b>앱</b>을 탭합니다.",
            "게임을 찾아 탭합니다(예: <b>A Memory Missing: Merge Game</b>).",
            "<b>저장용량</b>을 탭합니다.",
            "<b>저장용량 비우기</b>를 탭합니다."
          ]
        },
        {
          kind: "paragraph",
          html: "또는 게임을 제거하면 휴대폰에서 게임 데이터가 모두 삭제됩니다. 메뉴 이름은 휴대폰마다 조금씩 다를 수 있습니다."
        }
      ]
    },
    {
      id: "iphone",
      heading: "iPhone에서 게임 데이터 삭제",
      blocks: [
        {
          kind: "steps",
          items: [
            "홈 화면에서 게임 아이콘을 길게 누릅니다.",
            "<b>앱 제거</b>를 탭합니다.",
            "<b>앱 삭제</b>를 탭한 다음 <b>삭제</b>를 탭합니다."
          ]
        },
        {
          kind: "paragraph",
          html: "앱을 삭제하면 iPhone에서 앱의 데이터가 모두 삭제됩니다."
        }
      ]
    },
    {
      id: "email",
      heading: "저희에게 메일을 보내셨다면",
      blocks: [
        {
          kind: "paragraph",
          html: "메일을 보내셨다면 저희는 이용자의 이메일 주소와 메시지를 보유하고 있습니다. 삭제를 원하시면 다음과 같이 하십시오."
        },
        {
          kind: "steps",
          items: [
            "이전에 사용한 주소로 {email:delete}에 메일을 보내 주십시오.",
            "제목은 “내 데이터 삭제”로 해 주십시오.",
            "저희는 30일 이내에 메시지를 삭제하고 확인 메일을 보내 드립니다."
          ]
        }
      ]
    },
    {
      id: "kept",
      heading: "삭제되는 것과 보관되는 것",
      blocks: [
        {
          kind: "list",
          items: [
            "게임 진행 상황과 설정. 이용자가 기기에서 직접 삭제합니다.",
            "메일과 이메일 주소. 요청하시면 저희가 삭제합니다."
          ]
        }
      ]
    },
    {
      id: "questions",
      heading: "문의",
      blocks: [
        {
          kind: "paragraph",
          html: '{email:delete}로 메일을 보내 주십시오. 데이터 처리 방식은 <a href="{route:privacy}">개인정보 처리방침</a>에 설명되어 있습니다.'
        }
      ]
    }
  ]
};
