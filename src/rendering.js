import { autoSaveDocument, manualSaveDocument } from "./editor.js";
import { navigateTo } from "./utils.js";

export const renderEditor = (doc) => {
  console.log(`문서 내용 : `, doc);

  const displayDocumentContent = (doc) => {
    const docTitleInput = document.getElementById("doc-title__input");
    const docContents = document.getElementById("doc-contents");

    if (!doc) {
      console.error("문서 내용이 존재하지 않습니다.");
      return;
    }

    // 문서 제목과 내용 표시
    docTitleInput.value = doc.title || "제목 없음";
    docContents.value = doc.content || "아름다운 글을 작성해보세요!!";
  };

  displayDocumentContent(doc);

  //자동 저장, 수동 저장
  autoSaveDocument();
  manualSaveDocument();
};

export const renderSidebar = (docs) => {
  const makeDocuments = (
    docs,
    parentsElement = document.getElementById("side-bar__nav-list")
  ) => {
    docs.forEach((doc) => {
      const listItem = document.createElement("li");
      const title = doc.title || "제목 없음";

      listItem.innerHTML = `
          <div class="flex">
            <img src="./assets/toggle-icon.svg" alt="토글 아이콘" class="toggle-icon" />
            <a href="${title}" class="doc-item" data-id="${doc.id}">${title}</a>
          </div>
        `;

      if (doc.documents && doc.documents.length > 0) {
        const subList = document.createElement("ul");
        subList.classList.add("indent");
        listItem.appendChild(subList);

        makeDocuments(doc.documents, subList);
      }

      parentsElement.appendChild(listItem);
    });
  };

  const navListEl = document.getElementById("side-bar__nav-list");
  if (navListEl.childElementCount === 0) {
    makeDocuments(docs);
    navListEl.addEventListener("click", async (e) => {
      e.preventDefault();
      const target = e.target;
      if (target.tagName === "A") {
        const id = e.target.dataset.id;
        const pathname = new URL(e.target.href).pathname;
        console.log(`클릭한 문서 ID : `, id);
        navigateTo({ id }, pathname);
      }
    });
  }
};
