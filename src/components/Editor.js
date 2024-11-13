import { getTargetContent, AutoSave } from "../api/api.js";

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
