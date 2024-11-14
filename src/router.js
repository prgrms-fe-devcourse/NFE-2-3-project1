import { autoSaveDocument, manualSaveDocument } from "./editor.js";
import { renderEditor, renderSidebar } from "./rendering.js";
import { createNewPage } from "./sidebar.js";
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

// 링크를 클릭했을 때 실행되는 함수
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

// 페이지 로드 시 렌더링
document.addEventListener("DOMContentLoaded", () => render("", "sidebar"));

document.body.addEventListener("click", async (e) => {
  e.preventDefault();
  const target = e.target;

  // 하위 문서 추가 버튼 클릭 시
  if (target.parentElement.classList.contains("doc-item__add")) {
    const clickedDocLink =
      target.parentElement.parentElement.querySelector("a");
    const parentId = clickedDocLink.dataset.id; // 현재 문서 ID를 parentId로 사용
    await createNewPage(parentId);
  }
  // 링크 클릭 시
  else if (target.tagName === "A") {
    const id = target.dataset.id;
    const pathname = new URL(target.href).pathname;
    console.log(`클릭한 문서 ID : `, id);

    // 이전에 선택된 문서 하이라이팅 비활성화
    const prevSelectedDoc = document.querySelector(".selected");
    if (prevSelectedDoc) {
      prevSelectedDoc.classList.remove("selected");
    }

    // 문서 링크일 경우
    if (id) {
      // 현재 선택된 문서를 하이라이팅
      const currentDoc = document.querySelector(
        `div.flex:has([data-id='${id}'])`
      );
      currentDoc.classList.add("selected");

      const childDocs = currentDoc.parentElement.parentElement;
      if (childDocs.classList.contains("hidden")) {
        childDocs.classList.remove("hidden");
      }

      // 하위 항목 리스트 토글 처리
      const subList = currentDoc.nextElementSibling;
      subList.classList.toggle("hidden");

      // 하위 페이지가 비어있을 경우 "하위 페이지 없음" 메시지 표시
      const isEmpty = subList.children.length === 0;
      const isNotHidden = !subList.classList.contains("hidden");
      if (isEmpty && isNotHidden) {
        const message = document.createElement("p");
        message.classList.add("no-sub-pages");
        message.textContent = "하위 페이지 없음";
        subList.appendChild(message);
      } else {
        // "하위 페이지 없음" 메시지가 있으면 제거
        const noSubPagesMessage = subList.querySelector(".no-sub-pages");
        if (noSubPagesMessage) {
          noSubPagesMessage.remove();
        }
      }

      // 클릭된 .flex 요소에 active 클래스를 추가하여 아이콘 회전 효과를 주기
      const toggleIcon = currentDoc.querySelector(".toggle-icon");
      if (toggleIcon) {
        toggleIcon.classList.toggle("active");
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
