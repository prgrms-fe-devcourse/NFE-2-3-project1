import {
  getRootDocuments,
  postNewDocument,
  initializeDocumentContent,
  getTargetContent,
} from "../api/api.js";
import { navigate, routes } from "../router/router.js";
import { updateBreadcrumb } from "./breadcrumb.js";

// 문서 목록을 가져와 동적 링크 생성
export const createDocumentsList = async () => {
  try {
    // 문서 목록을 추가할 ul 요소 찾기
    const documentList = document.getElementById("document-list");
    if (!documentList) {
      console.error("document-list 요소를 찾을 수 없습니다.");
      return;
    }

    const docsJSON = await getRootDocuments();
    docsJSON.forEach((doc) => {
      createDocumentItem(doc, documentList);
    });
  } catch (error) {
    console.error("문서 목록 가져오기 실패:", error);
  }
};

// 모든 active 클래스 제거 함수
const removeAllActiveClasses = () => {
  document
    .querySelectorAll(".sidebar__menuWrapper--document")
    .forEach((container) => {
      container.classList.remove("acitve__document-item");
    });
};

// 문서 생성 및 사이드바에 링크 추가
export const createDocumentItem = async (doc, parentElement = null) => {
  const path = `/documents/${doc.id}`;
  const initialDocData = await initializeDocumentContent(doc.id);

  // 라우트 등록
  routes.set(path, {
    id: initialDocData.id,
    title: initialDocData.title,
    content: initialDocData.content,
    parent: initialDocData.parent,
  });

  // 문서 항목 생성
  const newDocumentItem = document.createElement("li");
  newDocumentItem.classList.add("sidebar__menuWrapper--document");
  newDocumentItem.id = `document-container-${doc.id}`;

  newDocumentItem.innerHTML = `
    <div class="document-content">
      <a href="#" class="document-link" data-url="doc${doc.id}">
        ${doc.title}
      </a>
      <button class="add-subdoc-btn" data-parent-id="${doc.id}">+</button>
    </div>
    <ul class="sub-document-list" style="display: none;"></ul>
  `;

  // 부모 요소가 있으면 그 안에, 없으면 document-list에 추가
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

  // 하위 문서가 있으면 하위 문서를 재귀적으로 추가
  if (doc.documents && doc.documents.length > 0) {
    const subDocList = newDocumentItem.querySelector(".sub-document-list");
    doc.documents.forEach((subdoc) => {
      createDocumentItem(subdoc, subDocList);
    });
  }

  // hover 이벤트 추가
  newDocumentItem.addEventListener("mouseenter", () => {
    newDocumentItem.classList.add("hover__document-item");
  });

  newDocumentItem.addEventListener("mouseleave", () => {
    newDocumentItem.classList.remove("hover__document-item");
  });

  // 문서 클릭 이벤트
  newDocumentItem.addEventListener("click", async (event) => {
    if (event.target.closest(".add-subdoc-btn")) return; // + 버튼 클릭시 이벤트 중단

    event.preventDefault();

    // 모든 active 클래스 제거
    removeAllActiveClasses();

    // 현재 클릭된 항목에 active 클래스 추가
    newDocumentItem.classList.add("acitve__document-item");

    navigate(path);

    // 문서 내용 가져오기
    const docData = await getTargetContent(doc.id);

    // 편집기 영역에 제목과 내용 표시
    const titleElement = document.getElementById("editor__title-input");
    const contentElement = document.getElementById("editor__content-input");
    titleElement.value = docData.title || "";
    contentElement.value = docData.content || "";

    // 편집 가능한 상태로 설정
    titleElement.disabled = false;
    contentElement.disabled = false;

    // breadcrumb 업데이트
    await updateBreadcrumb(doc.id);

    // 하위 문서 리스트 토글
    const subDocumentList = newDocumentItem.querySelector(".sub-document-list");
    subDocumentList.style.display =
      subDocumentList.style.display === "none" ? "block" : "none";
  });

  // document 추가 버튼 클릭 이벤트
  const addButton = newDocumentItem.querySelector(".add-subdoc-btn");
  if (addButton) {
    addButton.addEventListener("click", async (event) => {
      event.stopPropagation(); // 이벤트 버블링 방지
      const parentId = event.target.dataset.parentId;
      if (parentId) {
        await addDoc(parentId);
      }
    });
  }
};

// Root Document 생성
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

// 하위 페이지 생성
export const addDoc = async (parentId) => {
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

    // 하위 문서 목록이 숨겨져 있다면 보이게 설정
    if (subDocumentList.style.display === "none") {
      subDocumentList.style.display = "block";
    }
  } catch (error) {
    console.error("하위 페이지 생성 실패:", error);
  }
};

// Root Document 생성 버튼에 이벤트 리스너 추가
document.addEventListener("DOMContentLoaded", () => {
  const createButton = document.getElementById(
    "sidebar__createDocument--button"
  );
  if (createButton) {
    createButton.addEventListener("click", addRootDoc);
  }
});
