import { autoSaveDocument, manualSaveDocument } from "./editor.js";
import { renderEditor, renderSidebar } from "./rendering.js";
import { fetchDocumentContent, fetchDocuments } from "./utils.js";

const render = async (docId = "") => {
  const pathname = window.location.pathname;

  if (pathname === "/") {
    document.getElementById("doc-title__input").value = `🥔 감자의 Notion`;
    document.getElementById("doc__title").innerText = `🥔 감자의 Notion`;
    document.getElementById(
      "doc-contents"
    ).value = `🥔 감자의 Notion에 오신 것을 환영합니다!
작성한 문서를 확인해보세요! 새로운 문서를 추가하거나 기존 문서를 삭제하는 것도 가능합니다.
    `;
    const documents = await fetchDocuments();
    renderSidebar(documents);
  } else {
    const documents = await fetchDocuments();
    const documentContent = await fetchDocumentContent(docId);
    renderSidebar(documents);
    renderEditor(documentContent);
  }
};

// 페이지를 렌더링하는 함수
export const navigateTo = async (state = { id: null }, pathname) => {
  history.pushState(state, null, pathname);

  if (pathname === "/") {
    render(state.id);
  } else {
    const documentContent = await fetchDocumentContent(state.id);
    renderEditor(documentContent);

    autoSaveDocument(state.id);
    manualSaveDocument(state.id);
  }
};

// 페이지 로드 시 라우터 실행
document.addEventListener("DOMContentLoaded", render);

document.body.addEventListener("click", (e) => {
  e.preventDefault();
  const target = e.target;
  const id = target.dataset.id;

  if (target.tagName === "A") {
    const pathname = new URL(target.href).pathname;
    navigateTo({ id }, pathname);
  }
});

// popstate 이벤트에서 현재 경로를 전달하여 렌더링
window.addEventListener("popstate", (e) => {
  render(e.state?.id);
});

// 기본 페이지 휴지통 삭제
document.addEventListener("DOMContentLoaded", function () {
  // 페이지 로드 시 아이콘 상태 초기화
  toggleTrashIcon();
});

document.body.addEventListener("click", function (e) {
  e.preventDefault(); // 기본 동작을 막음 (링크 클릭 시 페이지 이동을 막음)
  const target = e.target;

  // 다른 링크 클릭 시
  if (target.tagName === "A") {
    const pathname = new URL(target.href).pathname; // 링크의 경로 가져오기
    // 경로가 기본 페이지인지 확인하고 아이콘 처리
    toggleTrashIcon(pathname);
  }
});

// 기본 페이지인지 확인하고 아이콘을 숨기거나 보이게 처리하는 함수
function toggleTrashIcon(pathname) {
  const iconDelete = document.getElementById("icon__delete");

  if (!iconDelete) {
    console.error("휴지통 아이콘을 찾을 수 없습니다.");
    return;
  }

  // 경로가 기본 페이지('/')일 경우 아이콘 숨기기
  if (pathname === "/") {
    iconDelete.classList.add("hidden"); // 기본 페이지에서 아이콘 숨기기
  } else {
    iconDelete.classList.remove("hidden"); // 기본 페이지가 아니면 아이콘 보이기
  }
}
