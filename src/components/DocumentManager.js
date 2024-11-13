import {
  getRootDocuments,
  postNewDocument,
  initializeDocumentContent,
  getTargetContent
} from "../api/api.js";
import { navigate, routes } from "../router/router.js";

// 문서 목록을 가져와 동적 링크 생성
export const createDocumentsList = async (documentList) => {
  try {
    const docsJSON = await getRootDocuments();
    docsJSON.forEach((doc) => {
      createDocumentItem(doc.id, doc.title, documentList);
    });
  } catch (error) {
    console.error("문서 목록 가져오기 실패:", error);
  }
};

// 문서 생성 및 사이드바에 링크 추가
export const createDocumentItem = (docId, docTitle, parentElement = null) => {
  const path = `/documents/${docId}`;
  const initialDocData = initializeDocumentContent(docId);

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
  <div id="document-container-${docId}">
    <a href="#" class="document-link" data-url="doc${docId}">
      ${docTitle}
    </a>
    <button class="add-subdoc-btn" data-parent-id="${docId}">+</button>
  </div>
  <ul class="sub-document-list"></ul>
  `;

  parentElement.appendChild(newDocumentItem);

  // 링크 클릭 시 라우팅 및 내용 불러오기
  newDocumentItem.querySelector(".document-link").onclick = async (event) => {
    event.preventDefault();
    navigate(path);
  
    // 문서 내용 가져오기
    const docData = await getTargetContent(docId);
  
    // 편집기 영역에 제목과 내용 표시
    const titleElement = document.getElementById("editor__title-input");
    const contentElement = document.getElementById("editor__content-input");
    titleElement.value = docData.title || '';
    contentElement.value = docData.content || '';
    
    // 편집 가능한 상태로 설정
    titleElement.disabled = false;
    contentElement.disabled = false;
  };
  
};


// Root Document 생성
export const addRootDoc = async (documentList) => {
  try {
    const newDocument = await postNewDocument("제목 없음");
    createDocumentItem(newDocument.id, newDocument.title, documentList);
  } catch (error) {
    console.error("새 페이지 생성 실패:", error);
    alert("페이지 생성에 실패했습니다.");
  }
};

// 하위 페이지 생성
export const addDoc = async (parentId) => {
  const parentElement = document.getElementById(
    `document-container-${parentId}`
  );
  const subDocumentList = parentElement.nextElementSibling;

  try {
    const newDocument = await postNewDocument("제목 없음", parentId);
    createDocumentItem(newDocument.id, newDocument.title, subDocumentList);
    navigate(`/documents/${newDocument.id}`);
  } catch (error) {
    console.error("하위 페이지 생성 실패:", error);
    alert("하위 페이지 생성에 실패했습니다.");
  }
};
