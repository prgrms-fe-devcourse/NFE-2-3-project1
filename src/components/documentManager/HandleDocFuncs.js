import { postNewDocument } from "../../api/api.js";
import { navigate } from "../../router/router.js";
import { createDocumentItem } from "./CreateDocumentItem.js";

// 추가 : active 클래스 관리를 위한 새로운 함수
export const removeAllActiveClasses = () => {
  document
    .querySelectorAll(".sidebar__menuWrapper--document")
    .forEach((container) => {
      container.classList.remove("acitve__document-item");
    });
};

// 수정 : Root Document 생성 함수 개선
export const addRootDoc = async () => {
  try {
    const newDocument = await postNewDocument("untitled");
    const documentList = document.getElementById("document-list");
    if (documentList) {
      await createDocumentItem(newDocument, documentList);
      navigate(`/documents/${newDocument.id}`);
    }
  } catch (error) {
    console.error("새 페이지 생성 실패:", error);
  }
};

// 수정 : 하위 페이지 생성 함수 개선
export const addDoc = async (parentId) => {
  // 추가 : 부모 요소 검증 강화
  const parentElement = document.getElementById(
    `document-container-${parentId}`
  );
  if (!parentElement) {
    console.error("부모 요소를 찾을 수 없습니다.");
    return;
  }

  const subDocumentList = parentElement.querySelector(".sub-document-list");
  if (!subDocumentList) {
    console.error("하위 문서 목록 요소를 찾을 수 없습니다.");
    return;
  }

  try {
    const newDocument = await postNewDocument("untitled", parentId);
    await createDocumentItem(newDocument, subDocumentList);
    navigate(`/documents/${newDocument.id}`);

    // 추가 : 하위 문서 목록 표시 처리
    if (subDocumentList.style.display === "none") {
      subDocumentList.style.display = "block";
    }
  } catch (error) {
    console.error("하위 페이지 생성 실패:", error);
  }
};
