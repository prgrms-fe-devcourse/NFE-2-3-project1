import renderEditor from "./editor.js";
import renderSidebar from "./sidebar.js";
import utils from "./utils.js";

const { navigateTo, fetchDocumentContent, fetchDocuments } = utils;

const render = async (docId = "") => {
  const documents = await fetchDocuments();
  const documentContent = await fetchDocumentContent(docId);
  renderSidebar(documents);
  renderEditor(documentContent);
};

// 페이지 로드 시 라우터 실행
document.addEventListener("DOMContentLoaded", () => {
  render();
});

// popstate 이벤트에서 현재 경로를 전달하여 렌더링
window.addEventListener("popstate", (e) => {
  render(e.state?.id);
});
