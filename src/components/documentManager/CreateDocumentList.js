import { getRootDocuments } from "../../api/api.js";
import { createDocumentItem } from "./CreateDocumentItem.js";
export const createDocumentsList = async () => {
  const documentList = document.getElementById("document-list");
  // document-list 요소 존재 여부 확인
  if (!documentList) {
    console.error("document-list 요소를 찾을 수 없습니다.");
    return;
  }

  try {
    const docsJSON = await getRootDocuments();
    docsJSON.forEach((doc) => {
      createDocumentItem(doc, documentList);
    });
  } catch (error) {
    console.error("문서 목록 가져오기 실패:", error);
  }
};