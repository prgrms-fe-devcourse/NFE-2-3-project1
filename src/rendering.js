export const renderEditor = (doc) => {
  console.log("문서 내용 : ", doc);

  const displayDocumentContent = (doc) => {
    const docTitleInput = document.getElementById("doc-title__input");
    const docContents = document.getElementById("doc-contents");
    const docTitleBox = document.querySelector(".doc__title-box");
    const pathnames = window.location.pathname.split("/").slice(2);

    docTitleBox.innerHTML = "";
    pathnames.forEach((pathname) => {
      const sidebarLinkEl = document.querySelector(`[data-id='${pathname}']`);
      const docName = sidebarLinkEl.innerText;
      const href = sidebarLinkEl.href;
      const id = sidebarLinkEl.dataset.id;

      const aEl = document.createElement("a");
      aEl.setAttribute("id", "doc__title");
      aEl.setAttribute("data-id", id);
      aEl.setAttribute("href", href);
      aEl.textContent = docName;
      docTitleBox.appendChild(aEl);
    });

    if (!doc) {
      console.error("문서 내용이 존재하지 않습니다.");
      return;
    }

    // 문서 제목과 내용 표시
    docTitleInput.innerText = doc.title;
    docContents.innerText = doc.content;
  };

  const displayChildDocs = (childDocs) => {
    const childDocsEl = document.querySelector(".doc__childDocs");
    const pathname = window.location.pathname;
    childDocsEl.innerHTML = "";

    childDocs.forEach((childDoc) => {
      const title = childDoc.title || "제목 없음";
      const id = childDoc.id;

      const html = `
        <div class="doc__childDoc">
            <img src="./assets/file-icon.svg" class="icon" />
            <a href="${pathname}/${id}" data-id="${id}">${title}</a>
        </div>
      `;
      childDocsEl.innerHTML += html;
    });
  };

  displayDocumentContent(doc);
  displayChildDocs(doc.documents);
};

export const renderSidebar = (docs) => {
  const makeDocuments = (
    docs,
    parentsElement = document.getElementById("side-bar__nav-list"),
    pathnames = []
  ) => {
    docs.forEach((doc) => {
      const listItem = document.createElement("li");
      const title = doc.title || "제목 없음";
      const id = doc.id;
      console.log(id, title);
      const pathname = pathnames.length ? `${pathnames.join("/")}/${id}` : id;

      // 리스트 항목의 HTML 구조 생성
      listItem.innerHTML = `
          <div class="flex relative">
            <img src="./assets/toggle-icon.svg" alt="토글 아이콘" class="toggle-icon" />
            <a href="/documents/${pathname}" class="doc-item" data-id="${id}">${title}</a>
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
        makeDocuments(doc.documents, subList, [...pathnames, id]);
      } else {
        listItem.appendChild(subList);
      }

      listItem.appendChild(subList);
      parentsElement.appendChild(listItem);
    });
  };

  const navListEl = document.getElementById("side-bar__nav-list");
  navListEl.innerHTML = "";
  makeDocuments(docs);
};
