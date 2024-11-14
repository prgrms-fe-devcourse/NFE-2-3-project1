import { handleGetAllDocs } from "./client.js";
import { loadTextEditor } from "./utils.js";

// 검색 기능
const searchBtn = document.querySelector(".sidebar-search");
const modalOverlay = document.querySelector(".modal-overlay");
const modal = document.querySelector(".modal");
const searchForm = document.querySelector(".modal-search");
const modalContents = document.querySelector(".modal-contents");

searchBtn.addEventListener("click", () => {
  modalOverlay.style.display = "block";
  modal.style.display = "flex";
  modalContents.innerHTML = "";
});

modalOverlay.addEventListener("click", () => {
  modalOverlay.style.display = "none";
  modal.style.display = "none";
});

modal.addEventListener("click", (e) => {
  e.stopPropagation();
});

// 검색 버튼
searchForm.addEventListener("submit", async (e) => {
  const searchDocInput = document.querySelector(".modal-search input");
  const term = searchDocInput.value.replace(/\s/g, ""); // 검색어 전달

  e.preventDefault();
  if (term === "") {
    alert("비어있으면 안돼!");
    searchDocInput.value = "";
    return;
  }

  //  검색 결과들
  const allDocs = await handleGetAllDocs();
  const results = searchDocs(allDocs, term);

  let contents = "";
  results.forEach((doc) => {
    contents += `
        <a class="modal-content" href="/documents/${doc.id}" data-url="${doc.id}">
            <span>${doc.title}</span>
        </a>
    `;
  });

  modalContents.innerHTML = contents || "정보를 찾지 못했습니다.";
  searchDocInput.value = "";
});

function searchDocs(docs, searchTerm) {
  let results = [];

  // 각 문서에 대해 확인

  docs.forEach((doc) => {
    const title = doc.title.replace(/\s/g, "");
    // 검색어가 제목이나 내용에 포함되어 있으면 결과에 추가
    if (title.includes(searchTerm)) {
      results.push(doc);
    }

    // 하위 문서가 있을 경우, 재귀적으로 확인
    if (doc.documents.length > 0) {
      results = results.concat(searchDocs(doc.documents, searchTerm));
    }
  });

  return results;
}

modalContents.addEventListener("click", (e) => {
  e.preventDefault();

  // 클릭된 요소가 a 태그가 아니면, a 태그를 찾아 클릭 이벤트를 강제로 발생시킴
  const clickedElement = e.target.closest("a");

  if (clickedElement) {
    const id = clickedElement.dataset.url;
    loadTextEditor(id);
    modalOverlay.style.display = "none";
    modal.style.display = "none";
  }
});
