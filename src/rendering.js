import { autoSaveDocument, manualSaveDocument } from "./editor.js";
import { navigateTo } from "./utils.js";

export const renderEditor = (doc) => {
  console.log("문서 내용 : ", doc);

  const displayDocumentContent = (doc) => {
    const docTitleInput = document.getElementById("doc-title__input");
    const docContents = document.getElementById("doc-contents");
    const docTitle = document.getElementById("doc__title");

    if (!doc) {
      console.error("문서 내용이 존재하지 않습니다.");
      return;
    }

    // 문서 제목과 내용 표시
    docTitleInput.value = doc.title || "제목 없음";
    docTitle.innerText = doc.title || "제목 없음";
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

      // 리스트 항목의 HTML 구조 생성
      listItem.innerHTML = `
        <div class="flex">
          <img src="./assets/toggle-icon.svg" alt="토글 아이콘" class="toggle-icon" />
          <a href="${title}" class="doc-item" data-id="${doc.id}">${title}</a>
        </div>
      `;

      // 하위 문서가 있을 경우, 하위 문서 목록 생성
      if (doc.documents && doc.documents.length > 0) {
        const subList = document.createElement("ul");
        subList.classList.add("indent", "visible");
        listItem.appendChild(subList);

        makeDocuments(doc.documents, subList);
      } else {
        // 하위 페이지가 없으면 "하위 페이지 없음" 메시지 표시
        const message = document.createElement("p");
        message.classList.add("no-sub-pages");
        message.textContent = "하위 페이지 없음";
        listItem.appendChild(message);
      }

      parentsElement.appendChild(listItem);
    });
  };

  const navListEl = document.getElementById("side-bar__nav-list");
  navListEl.innerHTML = "";

  makeDocuments(docs);
  navListEl.addEventListener("click", async (e) => {
    e.preventDefault();
    const target = e.target.closest("div");
    if (target) {
      const prevSelectedDoc = document.querySelector(".selected");
      if (prevSelectedDoc) {
        prevSelectedDoc.classList.remove("selected");
      }

      const id = e.target.dataset.id;
      const pathname = new URL(e.target.href).pathname;
      const prevDocTitle = target.innerText;

      console.log(`클릭한 문서 ID : `, id);
      target.classList.add("selected");

      navigateTo({ id, prevDocTitle }, pathname);
    }
  });

  const toggleButtons = document.querySelectorAll(".flex");

  toggleButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      // 클릭된 버튼 내의 .indent 요소를 찾아 토글
      const subList = button.nextElementSibling;

      if (subList && subList.classList.contains("indent")) {
        // 하위 페이지가 비어있을 경우 "하위 페이지 없음" 메시지 표시
        if (
          subList.children.length === 0 &&
          !subList.querySelector(".no-sub-pages")
        ) {
          const message = document.createElement("p");
          message.classList.add("no-sub-pages");
          message.textContent = "하위 페이지 없음";
          subList.appendChild(message);
        } else {
          // "하위 페이지 없음" 메시지가 있으면 제거
          const noSubPagesMessage = subList.querySelector(".no-sub-pages");
          if (noSubPagesMessage) {
            noSubPagesMessage.remove();
          }
        }
      }

      // 클릭된 .flex 요소에 active 클래스를 추가하여 아이콘 회전 효과를 주기
      const toggleIcon = button.querySelector(".toggle-icon");
      if (toggleIcon) {
        toggleIcon.classList.toggle("active");
      }
    });
  });
};
