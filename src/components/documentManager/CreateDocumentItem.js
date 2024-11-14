import { initializeDocumentContent, getTargetContent } from "../../api/api.js";
import { navigate, routes } from "../../router/router.js";
import { updateBreadcrumb } from "../breadcrumb.js";
import { addDoc, removeAllActiveClasses } from "./HandleDocFuncs.js";

export const createDocumentItem = async (doc, parentElement = null) => {
  const path = `/documents/${doc.id}`;
  const initializeCurrentDocData = await initializeDocumentContent(doc.id);
  routes.set(path, {
    id: initializeCurrentDocData.id,
    title: initializeCurrentDocData.title,
    content: initializeCurrentDocData.content,
    parent: initializeCurrentDocData.parent,
  });

  const initializeNewDocItem = (doc) => {
    const newDocument = document.createElement("li");
    newDocument.classList.add("sidebar__menuWrapper--document");
    newDocument.id = `document-container-${doc.id}`;
    newDocument.innerHTML = `
      <div class="document-content">
        <a href="#" class="document-link" data-url="doc${doc.id}">
          ${doc.title}
        </a>
        <button class="add-subdoc-btn" data-parent-id="${doc.id}">+</button>
      </div>
      <ul class="sub-document-list" style="display: none;"></ul>
    `;
    return newDocument;
  };

  const newDocumentItem = initializeNewDocItem(doc);

  if (parentElement) {
    parentElement.appendChild(newDocumentItem);
  } else {
    const documentList = document.getElementById("document-list");
    if (documentList) {
      documentList.appendChild(newDocumentItem);
    } else {
      console.error("document-list 요소를 찾을 수 없습니다.");
    }
  }

  if (doc.documents && doc.documents.length > 0) {
    const subDocList = newDocumentItem.querySelector(".sub-document-list");
    doc.documents.forEach((subdoc) => {
      createDocumentItem(subdoc, subDocList);
    });
  }

  // 추가 : hover 이벤트 추가
  newDocumentItem.addEventListener("mouseenter", () => {
    newDocumentItem.classList.add("hover__document-item");
  });

  newDocumentItem.addEventListener("mouseleave", () => {
    newDocumentItem.classList.remove("hover__document-item");
  });

  // 수정 : 문서 클릭 이벤트 로직 개선
  newDocumentItem.addEventListener("click", async (event) => {
    // 추가 : 하위 문서 클릭 시 이벤트 전파 중단
    if (event.target.closest(".sub-document-list")) {
      event.stopPropagation(); // 버블링은 막되
      // 필요한 네비게이션과 문서 로드는 실행되도록
      const clickedLink = event.target.closest(".document-link");
      if (clickedLink) {
        const docId = clickedLink.dataset.url.replace("doc", "");
        navigate(`/documents/${docId}`);

        // 문서 내용 가져오기
        const docData = await getTargetContent(docId);

        // 편집기에 내용 표시
        const titleElement = document.getElementById("editor__title-input");
        const contentElement = document.getElementById("editor__content-input");
        titleElement.value = docData.title || "";
        contentElement.value = docData.content || "";

        // breadcrumb 업데이트도 필요하다면
        await updateBreadcrumb(docId);
      }
      return;
    }
    // 추가 : + 버튼 클릭 시 이벤트 중단
    if (event.target.closest(".add-subdoc-btn")) return;

    event.preventDefault();

    // 추가 : active 클래스 관리
    removeAllActiveClasses();
    newDocumentItem.classList.add("acitve__document-item");

    navigate(path);

    const docData = await getTargetContent(doc.id);

    const titleElement = document.getElementById("editor__title-input");
    const contentElement = document.getElementById("editor__content-input");
    titleElement.value = docData.title || "";
    contentElement.value = docData.content || "";

    titleElement.disabled = false;
    contentElement.disabled = false;

    // 추가 : breadcrumb 업데이트
    await updateBreadcrumb(doc.id);

    // 수정 : 하위 문서 리스트 토글 통합
    const subDocumentList = newDocumentItem.querySelector(".sub-document-list");
    subDocumentList.style.display =
      subDocumentList.style.display === "none" ? "block" : "none";
  });

  // 수정 : document 추가 버튼 이벤트 개선
  const addButton = newDocumentItem.querySelector(".add-subdoc-btn");
  if (addButton) {
    addButton.addEventListener("click", async (event) => {
      event.stopPropagation(); // 추가 : 이벤트 버블링 방지
      const parentId = event.target.dataset.parentId;
      if (parentId) {
        await addDoc(parentId);
      }
    });
  }
};
