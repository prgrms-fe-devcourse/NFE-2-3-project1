import { handleGetAllDocs, handleGetDocById } from "./client.js";
let docList = [];
const sidebarItems = document.querySelector(".sidebar-nav ul");

export async function loadSidebarDocs() {
  sidebarItems.innerHTML = "";
  const documents = await handleGetAllDocs();
  docList = documents;

  let items = "";
  documents.forEach(async (doc) => {
    items += makeItem(doc).outerHTML;
  });
  sidebarItems.innerHTML = items;
}
async function addDoc(doc) {
  sidebarItems.appendChild(makeItem(doc));
}
function makeItem(doc, depth = 1) {
  const li = document.createElement("li");
  li.classList.add("sidebar-item");
  const closeArr = localStorage.getItem("closeArr");
  const convertedCloseArr = closeArr ? JSON.parse(closeArr) : [];
  if (convertedCloseArr.includes(doc.id.toString())) li.classList.add("close");

  const divContent = document.createElement("div");
  divContent.classList.add("sidebar-item-content");

  const btnToggle = document.createElement("button");
  btnToggle.classList.add("sidebar-item-toggle");

  const a = document.createElement("a");
  a.href = `/documents/${doc.id}`;
  a.dataset.url = doc.id;
  a.textContent = doc.title;

  const divBtns = document.createElement("div");
  divBtns.classList.add("sidebar-item-btns");

  const btnAdd = document.createElement("button");
  btnAdd.classList.add("sidebar-item-add");

  const btnRemove = document.createElement("button");
  btnRemove.classList.add("sidebar-item-remove");

  // depth가 3이상이면 추가버튼 x
  if (depth < 3) {
    divContent.prepend(btnToggle);
    divBtns.appendChild(btnAdd);
  }
  divBtns.appendChild(btnRemove);

  divContent.appendChild(a);
  divContent.appendChild(divBtns);

  li.appendChild(divContent);

  // 링크 클릭 시 새로운 페이지 로드 처리
  // a.addEventListener("click", (e) => {
  //   e.preventDefault();
  //   const id = e.currentTarget.dataset.url;
  //   history.pushState({ page: id }, "", `/documents/${id}`);
  //   loadTextEditor(id);
  // });

  if (doc.documents.length !== 0 && depth < 3) {
    const childList = document.createElement("ul");
    doc.documents.forEach((childDoc) =>
      childList.appendChild(makeItem(childDoc, depth + 1))
    );
    li.appendChild(childList);
  }
  return li;
}

export function loadEditorScript() {
  const id = `editor-script`;
  if (!document.getElementById(id)) {
    const newScript = document.createElement("script");
    newScript.id = id;
    newScript.src = `/js/editor.js`;
    newScript.type = "module";
    document.body.appendChild(newScript);
  }
}

export async function makePath(id) {
  let dirContent = '<a href="/">Home</a>';
  let paths = [];
  if (id && id !== "Content") {
    paths = await pathfromRoot(id, docList);
  }
  paths.forEach((item) => {
    dirContent += `<span>/</span><a href="/documents/${item.id}" data-url="${item.id}">${item.title}</a>`;
  });
  return dirContent;
}

export async function makePathDir(id) {
  const dir = document.querySelector(".editor-dir");
  if (dir) dir.innerHTML = await makePath(id);
}

// URL에 맞는 콘텐츠 로드 (동적으로 콘텐츠를 로드하는 함수)
export async function loadTextEditor(id) {
  const dirContent = await makePath(id);
  let data = id !== "Content" && (await handleGetDocById(id));
  const EDITOR_TEMP = `
  <div class="editor-content">
    <input
      id="title-input"
      class="title-input"
      placeholder="제목"
      value="${data ? data.title : "제목없음"}"
    />
    <div id="text-container">
    ${
      data && data.content !== null
        ? data.content
        : '<div class="text-block" contenteditable="true"></div>'
    }
    </div>
  </div>
`;
  // 하위 문서들

  const subDocs = data && data.documents;

  let subDocsLink = "";
  if (subDocs) {
    subDocs.forEach((doc) => {
      subDocsLink += `<a href="/documents/${doc.id}" data-url="${doc.id}">${doc.title}</a>`;
    });
  }

  const content =
    id === "Content"
      ? `
      <div class="editor-top">
        <div class="editor-dir">${dirContent}</div>
      </div>
      <div class="intro">Hello World</div>`
      : id
      ? `
      <div class="editor-top">
        <div class="editor-dir">${dirContent}</div>
      </div>
      ${EDITOR_TEMP}
      <div class="editor-bottom">
       ${subDocsLink}
      </div>
  `
      : "<h1>페이지를 찾을 수 없습니다.</h1>";
  document.querySelector("#editor").innerHTML = content;

  // 하위 링크들 클릭시 이동
  const editorBottom = document.querySelector(".editor-bottom");
  editorBottom &&
    editorBottom.addEventListener("click", (e) => {
      e.preventDefault();
      if (e.target.tagName === "A") {
        const id = e.target.dataset.url;
        history.pushState({ page: id }, "", `/documents/${id}`);
        loadTextEditor(id);
      }
    });

  // 경로 읽기
  document.querySelector(".editor-dir").addEventListener("click", (e) => {
    e.preventDefault();
    const id = e.target.dataset.url;
    if (!id) {
      history.pushState({ page: "/" }, "", `/`); // root로 이동
      loadTextEditor("Content");
    } else {
      history.pushState({ page: id }, "", `/documents/${id}`);
      loadTextEditor(id);
    }
  });
  loadEditorScript();
  const isMenuClose = localStorage.getItem("isMenuClose");
  if (isMenuClose === "true") {
    makeOpenSidebarBtn();
    handleMenuClose();
  }
}

document.getElementById("toggleSidebar").addEventListener("click", () => {
  handleMenuClose();
  makeOpenSidebarBtn();
});
function handleMenuClose() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.add("hidden"); // 사이드바 접기/펼치기
  localStorage.setItem("isMenuClose", true);
}
function makeOpenSidebarBtn() {
  const editorTop = document.querySelector(".editor-top");
  const openBtn = document.createElement("button");
  openBtn.classList.add("sidebar-btn");
  openBtn.classList.add("openBtn");
  openBtn.id = "sidebarOpenBtn";
  openBtn.addEventListener("click", function () {
    sidebar.classList.remove("hidden");
    localStorage.setItem("isMenuClose", false);
    this.remove();
  });
  editorTop.prepend(openBtn);
}

// 현재 문서에서부터 최상위 문서까지 루트 찾기
async function pathfromRoot(docId, docList) {
  const path = [];
  let currentDoc = await handleGetDocById(docId);

  // 최상위 문서 도달할때까지 반복
  while (currentDoc) {
    path.unshift(currentDoc);
    currentDoc = findParentDoc(currentDoc.id, docList);
  }

  return path;
}

// 재귀적으로 부모 문서 찾기
function findParentDoc(childId, docs) {
  for (const doc of docs) {
    if (doc.documents.some((subDoc) => subDoc.id === childId)) {
      return doc;
    }
    // 하위문서 더 있는 경우
    const parentDoc = findParentDoc(childId, doc.documents);
    if (parentDoc) return parentDoc;
  }
  return null;
}
