import utils from "./utils.js";

const { navigateTo } = utils;

const renderSidebar = (docs) => {
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

  const addDocClickListener = () => {
    const docItems = document.querySelectorAll(".doc-item");
    console.log(`문서 항목들 : `, docItems);

    docItems.forEach((item) => {
      item.addEventListener("click", async (e) => {
        e.preventDefault();
        const id = e.target.dataset.id;
        const pathname = new URL(e.currentTarget.href).pathname;
        navigateTo({ id }, pathname);

        console.log(`클릭한 문서 ID : `, id);
      });
    });
  };

  const navListEl = document.getElementById("side-bar__nav-list");
  if (navListEl.childElementCount === 0) {
    makeDocuments(docs);
    addDocClickListener();
  }
};

export default renderSidebar;
