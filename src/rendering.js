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
          <div class="flex relative">
            <img src="./assets/toggle-icon.svg" alt="토글 아이콘" class="toggle-icon" />
            <a href="${title}" class="doc-item" data-id="${doc.id}">${title}</a>
            <button class="doc-item__add">
              <img src="./assets/plus-icon.svg" alt="새 페이지 추가 버튼" class="icon" />
            </button>
          </div>
        `;

      const subList = document.createElement("ul");
      subList.classList.add("hidden");

      // 하위 문서가 있을 경우, 하위 문서 목록 생성
      if (doc.documents.length > 0) {
        subList.classList.add("indent");
        makeDocuments(doc.documents, subList);
      }

      listItem.appendChild(subList);
      parentsElement.appendChild(listItem);
    });
  };

  const navListEl = document.getElementById("side-bar__nav-list");
  navListEl.innerHTML = "";

  makeDocuments(docs);
  navListEl.addEventListener("click", async (e) => {
    e.preventDefault();
    const target = e.target;
    const id = target.dataset.id;
    const pathname = new URL(target.href).pathname;

    if (target.tagName === "A") {
      console.log(`클릭한 문서 ID : `, id);
      // 이전에 선택된 문서가 있을 시, 비활성화
      const prevSelectedDoc = document.querySelector(".selected");
      if (prevSelectedDoc) {
        prevSelectedDoc.classList.remove("selected");
      }

      // 현재 선택된 문서를 활성화
      target.parentElement.classList.add("selected");
      navigateTo({ id }, pathname);
    }
  });

  const toggleButtons = document.querySelectorAll(".flex");

  toggleButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      // 클릭된 버튼 내의 .indent 요소를 찾아 토글
      const subList = button.nextElementSibling;
      subList.classList.toggle("hidden");

      // 하위 페이지가 비어있을 경우 "하위 페이지 없음" 메시지 표시
      const isEmpty = subList.children.length === 0;
      const isNotHidden = !subList.classList.contains("hidden");
      if (isEmpty && isNotHidden) {
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

      // 클릭된 .flex 요소에 active 클래스를 추가하여 아이콘 회전 효과를 주기
      const toggleIcon = button.querySelector(".toggle-icon");
      if (toggleIcon) {
        toggleIcon.classList.toggle("active");
      }
    });
  });
};
