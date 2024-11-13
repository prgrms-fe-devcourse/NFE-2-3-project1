import { getRootDocuments, postNewDocument } from "../api/api.js";
import { navigate, routes } from "../router/router.js";



// 문서 목록을 가져와 동적 링크 생성
// let isListCreated = false;

export const createDocumentsList = async (documentList) => {
  // if (isListCreated) return;
  // isListCreated = true;

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
export const createDocumentItem = (docId, docTitle, parentElement) => {
  const path = `/documents/${docId}`;

  // 라우트 등록
  routes.set(path, `<h1>${docTitle}</h1><p>내용 없음</p>`);

  // 문서 항목 생성
  const newDocumentItem = document.createElement("li");
  newDocumentItem.classList.add("sidebar__menuWrapper--document");

  newDocumentItem.innerHTML = `
  <div id="document-container-${docId}">
  <a href="#" class="document-link" data-  url="doc${docId}">
      ${docTitle}
    </a>
    <button class="add-subdoc-btn" data-parent-id="${docId}">+</button>
    </div>
    <ul class="sub-document-list"></ul>
  `;

  parentElement.appendChild(newDocumentItem);

  // 링크 클릭 시 라우팅
  newDocumentItem.querySelector(".document-link").onclick = (event) => {
    event.preventDefault();
    navigate(path);
  };
};

// Root Document 생성
export const addRootDoc = async () => {
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
  const parentElement = document.getElementById(`document-container-${parentId}`);
  const subDocumentList = parentElement.nextElementSibling; // `<ul>` 요소

  try {
    const newDocument = await postNewDocument("제목 없음", parentId);
    createDocumentItem(newDocument.id, newDocument.title, subDocumentList);
    navigate(`/documents/${newDocument.id}`);
  } catch (error) {
    console.error("하위 페이지 생성 실패:", error);
    alert("하위 페이지 생성에 실패했습니다.");
  }
};









