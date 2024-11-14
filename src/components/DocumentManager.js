import {
  getRootDocuments,
  postNewDocument,
  initializeDocumentContent,
  getTargetContent,
} from "../api/api.js";
import { navigate, routes } from "../router/router.js";
// 추가 : breadcrumb 업데이트 기능 추가
import { updateBreadcrumb } from "./breadcrumb.js";

export const createDocumentsList = async () => {
  try {
    // 추가 : DOM 요소 존재 여부 검증 로직
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

// 추가 : active 클래스 관리를 위한 새로운 함수
const removeAllActiveClasses = () => {
  document
    .querySelectorAll(".sidebar__menuWrapper--document")
    .forEach((container) => {
      container.classList.remove("acitve__document-item");
    });
};

export const createDocumentItem = async (doc, parentElement = null) => {
  const path = `/documents/${doc.id}`;
  const initialDocData = await initializeDocumentContent(doc.id);

  routes.set(path, {
    id: initialDocData.id,
    title: initialDocData.title,
    content: initialDocData.content,
    parent: initialDocData.parent,
  });

  const newDocumentItem = document.createElement("li");
  newDocumentItem.classList.add("sidebar__menuWrapper--document");
  // 수정 : id를 li 태그로 이동
  newDocumentItem.id = `document-container-${doc.id}`;

  // 수정 : HTML 구조 변경 - document-content div 추가
  newDocumentItem.innerHTML = `
    <div class="document-content">
      <a href="#" class="document-link" data-url="doc${doc.id}">
        ${doc.title}
      </a>
      <button class="add-subdoc-btn" data-parent-id="${doc.id}">+</button>
    </div>
    <ul class="sub-document-list" style="display: none;"></ul>
  `;

  // 수정 : 부모 요소 처리 로직 강화
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

// 추가 : 주석 처리된 이벤트 리스너
// document.addEventListener("DOMContentLoaded", () => {
//   const createButton = document.getElementById(
//     "sidebar__createDocument--button"
//   );
//   if (createButton) {
//     createButton.addEventListener("click", addRootDoc);
//   }
// });
