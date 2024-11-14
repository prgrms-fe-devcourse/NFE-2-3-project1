const DEFAULT_TITLE = "Team5의 Notion 🥳";
const DEFAULT_CONTENT = "문서를 생성하거나 선택하여 내용을 작성해보세요!";

const documentTitle = document.getElementById("document-title");
const documentDetail = document.getElementById("document-detail");
const documentTable = document.getElementById("document-table");
const documentTableCreatedAt = document.getElementById(
  "document-table-created-at"
);
const documentTableUpdatedAt = document.getElementById(
  "document-table-updated-at"
);
const documentTitlePreview = document.getElementById("document-title-preview");
const deleteButton = document.getElementById("document-delete-button");
const documentFooter = document.getElementById("document-footer");

// util: debounce 함수
function debounce(func) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), 700);
  };
}

const debounceUpdateDocument = debounce(() => updateDocument());

window.addEventListener("popstate", handlePopState); // 앞으로 & 뒤로가기 이벤트 핸들러
window.addEventListener("loadDocument", handleLoadDocument); // url 변경 시 발생하는 이벤트 핸들러
window.addEventListener("loadDefault", handleLoadDefault); // 홈으로 이동 시 발생하는 이벤트 핸들러
deleteButton.addEventListener("click", handleDeleteButtonClick); // 삭제 버튼 클릭 시 발생하는 이벤트 핸들러
documentTitle.addEventListener("input", handleTitleInput);
documentDetail.addEventListener("input", handleContentInput);
documentDetail.addEventListener("keydown", handleEnterKey);
documentTitle.addEventListener("keydown", function (event) {
  // Prevent the default action for Enter key
  if (event.key === "Enter") {
    event.preventDefault();
  }
});

// URL 상태에 따른 페이지 이동 처리
function handlePopState(event) {
  if (!event.state?.documentId) {
    window.dispatchEvent(new Event("loadDefault"));
  } else {
    window.dispatchEvent(new Event("loadDocument"));
  }
}

// 문서 내용 렌더링
async function handleLoadDocument() {
  const data = await getDocument(history.state.documentId);

  if (!data) {
    //삭제된 문서에 접근
    alert("문서를 불러오는데 실패했습니다. 홈으로 이동합니다.");
    history.pushState({}, "", "/");
    window.dispatchEvent(new Event("loadDefault"));
  }

  setDocumentData(data);
  handlePlaceholderClass(documentTitle, data.title);
  handlePlaceholderClass(documentDetail, data.content);
  renderChildDocuments(data.documents);
}

// 디폴트 페이지 렌더링
function handleLoadDefault() {
  documentTitle.innerText = DEFAULT_TITLE;
  documentDetail.innerText = DEFAULT_CONTENT;
  documentTitlePreview.innerText = DEFAULT_TITLE;
  deleteButton.style.display = "none"; // 시작 페이지는 삭제 버튼을 보여주지 않습니다.

  documentTableCreatedAt.innerText = "";
  documentTableUpdatedAt.innerText = "";
  documentTable.style.display = "none";

  documentTitle.contentEditable = "false";
  documentDetail.contentEditable = "false";

  documentTitle.classList.remove("document__content--empty");
  documentDetail.classList.remove("document__content--empty");
}

// 문서 삭제
function handleDeleteButtonClick() {
  if (!confirm("이 문서를 삭제하시겠습니까?")) return;
  if (deleteDocument(history.state.documentId)) {
    alert("문서가 삭제되었습니다.");
    history.pushState({}, "", "/");
    window.dispatchEvent(new Event("loadDefault"));
    getContentList();
  } else {
    alert("문서를 삭제하는데 실패했습니다.");
  }
}

// 제목 입력 이벤트 핸들러
function handleTitleInput(event) {
  const title = event.currentTarget.innerText;
  const documentId = history.state.documentId;
  const documentElement = document.querySelector(
    `li[data-id="${documentId}"] a p`
  );
  if (documentElement)
    documentElement.textContent = title === "" ? "새 페이지" : title;
  documentTitlePreview.innerText = title;
  handlePlaceholderClass(documentTitle, title);
  debounceUpdateDocument();
  updateTimestamp();
}

// 내용 입력 이벤트 핸들러
function handleContentInput(event) {
  const content = event.currentTarget.textContent;
  handlePlaceholderClass(documentDetail, content);
  debounceUpdateDocument();
  updateTimestamp();
}

// 내용 입력 중 엔터 입력시 줄바꿈 해주는 이벤트 핸들러
function handleEnterKey(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    insertTextAtCursor();
  }
}

// placeholder 클래스 설정
function handlePlaceholderClass(element, content) {
  if (content) {
    element.classList.remove("document__content--empty");
  } else {
    element.classList.add("document__content--empty");
  }
}

// 하위 문서 목록 렌더링
function renderChildDocuments(childDocuments) {
  documentFooter.innerHTML = "";
  childDocuments.forEach((childDocument) => {
    const documentElement = createChildDocumentElement(childDocument);
    documentFooter.appendChild(documentElement);
  });
}

// 커서 위치 이동 함수
function insertTextAtCursor() {
  const selection = document.getSelection();
  const range = selection.getRangeAt(0);

  const br = document.createElement("br");
  const textNode = document.createTextNode("\u200C");
  range.insertNode(br);
  range.collapse(false);
  range.insertNode(textNode);

  range.selectNodeContents(textNode);
  range.collapse(true);

  selection.removeAllRanges();
  selection.addRange(range);
}

// 문서 내용 렌더링
function setDocumentData(data) {
  documentTitle.innerText = data.title;
  documentDetail.innerText = data.content;
  documentTitlePreview.innerText = data.title;
  documentTitle.contentEditable = "true";
  documentDetail.contentEditable = "true";
  deleteButton.style.display = "flex";
  documentTable.style.display = "block";
  documentTableCreatedAt.innerText = new Date(data.createdAt)
    .toLocaleString("ko-KR")
    .slice(0, -3);
  documentTableUpdatedAt.innerText = new Date(data.updatedAt)
    .toLocaleString("ko-KR")
    .slice(0, -3);
}

// 하위 문서 목록 생성
function createChildDocumentElement(childDocument) {
  const element = document.createElement("p");
  element.innerText = childDocument.title;
  element.classList.add("document__content--sub");
  element.dataset.documentId = childDocument.id;
  element.role = "button";
  element.addEventListener("click", function () {
    history.pushState(
      { documentId: childDocument.id },
      "",
      `/${childDocument.id}`
    );
    window.dispatchEvent(new Event("loadDocument"));
  });
  return element;
}

const updateTimestamp = () => {
  const updatedAt = new Date().toLocaleString("ko-KR").slice(0, -3);
  documentTableUpdatedAt.innerText = updatedAt;
};
