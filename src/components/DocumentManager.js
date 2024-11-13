import {
  getRootDocuments,
  postNewDocument,
  initializeDocumentContent,
  getTargetContent,
} from "../api/api.js";
import { navigate, routes } from "../router/router.js";

// 문서 목록을 가져와 동적 링크 생성
export const createDocumentsList = async (documentList) => {
  try {
    const docsJSON = await getRootDocuments();
    docsJSON.forEach((doc) => {
      createDocumentItem(doc, documentList);
    });
  } catch (error) {
    console.error("문서 목록 가져오기 실패:", error);
  }
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

  newDocumentItem.innerHTML = `
  <div id="document-container-${doc.id}">
    <a href="#" class="document-link" data-url="doc${doc.id}">
      ${doc.title}
    </a>
    <button class="add-subdoc-btn" data-parent-id="${doc.id}">+</button>
  </div>
  <ul class="sub-document-list" style="display: none;"></ul> <!-- 기본적으로 숨기기 -->
  `;

  if (parentElement) {
    parentElement.appendChild(newDocumentItem);
  } else {
    document.querySelector("#document-list").appendChild(newDocumentItem);
  }

  // 하위 문서가 있으면 하위 문서를 재귀적으로 추가
  if (doc.documents && doc.documents.length > 0) {
    const subDocList = newDocumentItem.querySelector(".sub-document-list");
    doc.documents.forEach((subdoc) => {
      createDocumentItem(subdoc, subDocList);
    });
  }

  // 문서 링크 클릭 시, 해당 문서의 내용 불러오기
  newDocumentItem.querySelector(".document-link").addEventListener("click", async (event) => {
    event.preventDefault();
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
  });

  // 하위 문서 리스트 토글 (드롭다운 기능)
  const documentLink = newDocumentItem.querySelector(".document-link");
  documentLink.addEventListener("click", (event) => {
    const subDocumentList = newDocumentItem.querySelector(".sub-document-list");
    subDocumentList.style.display = subDocumentList.style.display === "none" ? "block" : "none";
  });
};

// Root Document 생성
export const addRootDoc = async (documentList) => {
  try {
    const newDocument = await postNewDocument("untitled");
    createDocumentItem(newDocument, documentList);
    navigate(`/documents/${newDocument.id}`);
  } catch (error) {
    console.error("새 페이지 생성 실패:", error);
  }
};

// 하위 페이지 생성
export const addDoc = async (parentId) => {
  const parentElement = document.getElementById(
    `document-container-${parentId}`
  );
  const subDocumentList =
    parentElement.nextElementSibling || document.createElement("ul");

  try {
    const newDocument = await postNewDocument("untitled", parentId);
    createDocumentItem(newDocument, subDocumentList);
    navigate(`/documents/${newDocument.id}`);
  } catch (error) {
    console.error("하위 페이지 생성 실패:", error);
  }
};
