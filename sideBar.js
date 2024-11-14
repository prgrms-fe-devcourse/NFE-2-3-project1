const newDocumentButton = document.querySelector(".sidebar__newContent");
const documentsContainer = document.querySelector(".list__container");
getContentList();

// 최적화용
document.addEventListener("DOMContentLoaded", () => {
  newDocumentButton.addEventListener("click", async () => {
    const { id: newDocumentId } = await createDocument();
    // history.pushState({ documentId: newDocumentId }, "", `/${newDocumentId}`);
    // window.dispatchEvent(new Event("loadDocument"));
  });

  documentsContainer.addEventListener("click", async (e) => {
    const listItem = e.target.closest(".list__page");
    if (!listItem) return;
    const id = listItem.dataset.id;

    // 화살표 아이콘 클릭 시
    if (e.target.classList.contains("arrow-icon")) {
      e.preventDefault(); // 기본 이벤트(페이지 이동) 방지
      const nextElement = listItem.nextElementSibling;
      if (nextElement && nextElement.classList.contains("child-documents")) {
        nextElement.classList.toggle("hidden");
        e.target.classList.toggle("rotated");
      }
      return; // 화살표 클릭 시 다른 이벤트 처리하지 않음
    }

    // 나머지 아이콘 클릭 처리
    // 페이지 넣기
    if (e.target.classList.contains("add-icon")) {
      const { id: newDocumentId } = await createDocument(id);
      history.pushState({ documentId: newDocumentId }, "", `/${newDocumentId}`);
      window.dispatchEvent(new Event("loadDocument"));
    } else if (e.target.classList.contains("trash-icon")) {
      //문서 삭제 아이콘 넣기
      console.log();
      if (
        window.confirm(
          `"${e.target.parentElement.parentElement.innerText}" 문서를 삭제하시겠습니까?`
        )
      ) {
        try {
          const url = `https://kdt-api.fe.dev-cos.com/documents/${id}`;
          const response = await fetch(url, {
            method: "DELETE",
            headers: {
              "x-username": "team5",
            },
          });
          if (!response.ok) throw new Error("error");
          else alert("문서 삭제에 성공하셨습니다.");
        } catch (err) {
          console.error(err);
        } finally {
          getContentList();
        }
      }
    }
  });
});

async function getContentList() {
  try {
    const url = `https://kdt-api.fe.dev-cos.com/documents/`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-username": "team5",
      },
    });
    if (!response.ok) throw new Error("error");
    const data = await response.json();

    const documentsContainer = document.querySelector(".list__container");
    documentsContainer.innerHTML = "";

    // 문서 목록 생성
    for (const doc of data) {
      const docHtml = createDocumentHtml(doc);
      documentsContainer.innerHTML += docHtml;
    }
  } catch (err) {
    console.error(err);
  }
}

async function createDocument(parentId = null) {
  try {
    const url = "https://kdt-api.fe.dev-cos.com/documents/";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-username": "team5",
      },
      body: JSON.stringify({
        title: parentId ? "새 하위 문서" : "새 문서",
        parent: parentId,
      }),
    });

    if (!response.ok) throw new Error("error");
    getContentList();
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

function createDocumentHtml(doc, level = 0) {
  const { id, title, documents } = doc;
  const hasChildren = documents && documents.length > 0;

  let html = `
    <li class="list__page" data-id="${id}">
      <a href="/" class="page__link">
        <img src="./img/notion_project_file_icon.svg" class="file-icon default-icon" alt="File">
        ${
          hasChildren
            ? `<img src="./img/notion_project_arrow.svg" class="arrow-icon" alt="Arrow">`
            : ""
        }
        <p class="link__title">${title}</p>
      </a>
      <div class="icon-container">
        <img src="./img/notion_project_add_icon.svg" class="add-icon" alt="Add">
        <img src="./img/notion_project_trash_icon.svg" class="trash-icon" alt="Delete">
      </div>
    </li>
  `;

  if (hasChildren) {
    html += `<div class="child-documents">`;

    for (const childDoc of documents) {
      html += createDocumentHtml(childDoc, level + 1);
    }
    html += `</div>`;
  }

  return html;
}
