import { addRootDoc, addDoc } from "../components/DocumentManager.js"

export const setEventListener = (documentList, createDocumentButton) => {
  // 새 문서 생성
  createDocumentButton.addEventListener("click", () => addRootDoc(documentList));
  
  // 하위 문서 생성
  documentList.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-subdoc-btn")) {
      const parentId = event.target.getAttribute("data-parent-id");
      addDoc(parentId);
    }
  });

}