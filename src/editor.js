import { fetchDeleteDocument, navigateTo } from "./utils.js";

document
  .getElementById("icon__delete")
  .addEventListener("click", async function (e) {
    e.preventDefault();
    if (!history.state) return;

    const docId = history.state.id;
    await fetchDeleteDocument(docId);

    const target = document.querySelector(`[data-id='${docId}']`);
    const deleteTarget = target.parentElement.parentElement;
    deleteTarget.remove();

    navigateTo("", "/");
  });
