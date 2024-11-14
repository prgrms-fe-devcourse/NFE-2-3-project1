import { autoSaveDocument, manualSaveDocument } from "./editor.js";
import { renderEditor, renderSidebar } from "./rendering.js";
import { fetchDocumentContent, fetchDocuments } from "./utils.js";

/**
 *
 * @param {*} docId
 * @param {*} renderingTarget "all" | "editor" | "sidebar" | "none"
 */
const render = async (docId = "", renderingTarget = "none") => {
  const pathname = window.location.pathname;
  toggleTrashIcon(pathname);

  if (pathname === "/") {
    document.getElementById("doc-title__input").innerText = `🥔 감자의 Notion`;
    document.querySelector(".doc__title-box").innerHTML = `🥔 감자의 Notion`;
    document.getElementById(
      "doc-contents"
    ).innerText = `🥔 감자의 Notion에 오신 것을 환영합니다!
작성한 문서를 확인해보세요! 새로운 문서를 추가하거나 기존 문서를 삭제하는 것도 가능합니다.
    `;
    document.querySelector(".doc__childDocs").innerHTML = "";
  }

  switch (renderingTarget) {
    case "all":
      const documentsForAll = await fetchDocuments();
      renderSidebar(documentsForAll);

      if (!docId) return;
      const documentContentForAll = await fetchDocumentContent(docId);
      renderEditor(documentContentForAll);
      break;

    case "sidebar":
      const documentsForSidebar = await fetchDocuments();
      renderSidebar(documentsForSidebar);
      break;

    case "editor":
      const documentContentForEditor = await fetchDocumentContent(docId);
      renderEditor(documentContentForEditor);
      break;

    case "none":
      break;
  }
};

// 페이지를 렌더링하는 함수
export const navigateTo = async (state = { id: null }, pathname = "/") => {
  history.pushState(state, null, pathname);

  if (pathname === "/") {
    render(state.id, "sidebar");
  } else {
    render(state.id, "editor");

    autoSaveDocument(state.id);
    manualSaveDocument(state.id);
  }
};

// 페이지 로드 시 라우터 실행
document.addEventListener("DOMContentLoaded", () => render("", "sidebar"));

document.body.addEventListener("click", (e) => {
  e.preventDefault();
  const target = e.target;
  const id = target.dataset.id;

  if (target.tagName === "A") {
    console.log(`클릭한 문서 ID : `, id);
    const pathname = new URL(target.href).pathname;

    // 이전에 선택된 문서가 있을 시, 비활성화
    const prevSelectedDoc = document.querySelector(".selected");
    if (prevSelectedDoc) {
      prevSelectedDoc.classList.remove("selected");
    }

    if (id) {
      // 현재 선택된 문서를 활성화
      const currentDoc = document.querySelector(
        `div.flex:has([data-id='${id}'])`
      );
      currentDoc.classList.add("selected");

      const childDocs = currentDoc.parentElement.parentElement;
      if (childDocs.classList.contains("hidden")) {
        childDocs.classList.remove("hidden");
      }
    }

    navigateTo({ id }, pathname);
  }
});

// popstate 이벤트에서 현재 경로를 전달하여 렌더링
window.addEventListener("popstate", async (e) => {
  const id = e.state?.id;

  if (id) {
    // 이전에 선택된 문서가 있을 시, 비활성화
    const prevSelectedDoc = document.querySelector(".selected");
    if (prevSelectedDoc) {
      prevSelectedDoc.classList.remove("selected");
    }

    // 현재 선택된 문서를 활성화
    const currentDoc = document.querySelector(
      `div.flex:has([data-id='${id}'])`
    );
    currentDoc.classList.add("selected");
  }

  render(id, "editor");
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
