import { getTargetContent, AutoSave, editF } from "../api/api.js";

let debounceTimeout = null;

const debounceSave = async (docId, title, content) => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  debounceTimeout = setTimeout(async () => {
    await AutoSave(docId, title, content);
  }, 2000);
};

export const initializeEditor = async () => {
  const documentId = window.location.pathname.split("/documents/")[1];
  if (!documentId) return;

  const titleElement = document.getElementById("editor__title-input");
  const contentElement = document.getElementById("editor__content-input");

  if (!titleElement || !contentElement) return;

  const document = await getTargetContent(documentId);

  titleElement.value = document?.title || "";
  contentElement.value = document?.content || "";

  titleElement.addEventListener("input", () => {
    debounceSave(documentId, titleElement.value, contentElement.value);
  });

  contentElement.addEventListener("input", () => {
    debounceSave(documentId, titleElement.value, contentElement.value);
  });
};

// 11.14 수정
export const tempF = async () => {
  const documentList1 = document.querySelectorAll("#document-list li");
  documentList1.forEach((item) => {
    item.addEventListener("click", async () => {
      console.log(item.dataset.id);
      const temp = await getTargetContent(item.dataset.id);
      const title = document.querySelector(
        `#editor__title-input[data-id="${item.dataset.id}"]`
      );
      console.log(title);
      const content = document.querySelector(
        `#editor__content-input[data-id="${item.dataset.id}"]`
      );
      // 제목그리기
      title.addEventListener("keyup", async (e) => {
        console.log(e.currentTarget.value);
        await editF(item.dataset.id, e.currentTarget.value, temp.content);
        // const titleSide = document.querySelector(
        //   `#document-container-${item.dataset.id} div a`
        // );
        // console.log("title", titleSide);
      });
      content.addEventListener("keyup", async (e) => {
        await editF(item.dataset.id, temp.title, e.currentTarget.value);
      });
    });
  });
};
