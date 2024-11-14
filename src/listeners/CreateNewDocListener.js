import {
  addRootDoc,
  addDoc,
} from "../components/documentManager/HandleDocFuncs.js";

export const setEventListener = (documentList, createDocumentButton) => {
  // 새 문서 생성
  createDocumentButton.addEventListener("click", () =>
    addRootDoc(documentList)
  );

  // 하위 문서 생성
  documentList.addEventListener("click", (event) => {
    // 버튼을 직접 클릭했거나, 버튼 내부의 이미지를 클릭했을 경우를 모두 처리
    const addButton = event.target.classList.contains("add-subdoc-btn")
      ? event.target
      : event.target.closest(".add-subdoc-btn");

    if (addButton) {
      const parentId = addButton.dataset.parentId;
      addDoc(parentId);
    }
  });
};
