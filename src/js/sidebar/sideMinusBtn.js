import { request } from "../api/api.js";
import { navigate } from "../spa/spa.js";

document.addEventListener("click", async (event) => {
  // - 버튼 클릭 시
  if (event.target.closest(".removeButton")) {
    const deleteButton = event.target.closest(".removeButton");
    const documentItem = deleteButton.closest(".documentItem");
    const documentLink = documentItem.querySelector(".documentTitle");
    const documentId = documentLink.getAttribute("href").split("/")[2];

    console.log("deleteBtn", deleteButton);
    console.log("doctItem", documentItem);
    console.log("doctId", documentId);

    if (!documentId) {
      console.error("Document ID를 찾을 수 없습니다.");
      return;
    }

    console.log(`문서 ID ${documentId} 삭제 시작...`);
    await deleteDocumentWithChildren(documentId);

    documentItem.remove();
    console.log(`Document ID ${documentId} 요소가 DOM에서 제거되었습니다.`);
  }

  // Toggle 버튼 클릭 동작
  if (event.target.closest(".rotateButton")) {
    const toggleButton = event.target.closest(".rotateButton");
    const upperPost = toggleButton.closest(".documentItem");
    const childList = upperPost.querySelector(".documentList");

    toggleButton.classList.toggle("rotate");

    if (childList) {
      if (childList.style.display === "none" || !childList.style.display) {
        childList.style.display = "block";
        toggleButton.classList.add("rotate");
      } else {
        childList.style.display = "none";
        toggleButton.classList.remove("rotate");
      }
    }
  }
});

// 문서와 하위 문서 삭제 함수
async function deleteDocumentWithChildren(documentId) {
  try {
    console.log(`Document ID ${documentId} 데이터 가져오는 중...`);
    const documentData = await request({ method: "GET" }, documentId);

    if (!documentData) {
      console.error("Document 데이터를 가져오지 못했습니다.");
      return;
    }

    for (const childDocument of documentData.documents) {
      await updateDocumentParent(childDocument.id);
    }

    await request({ method: "DELETE" }, documentId);
    console.log(`Document ID ${documentId} 삭제 완료`);
    navigate("/");
    // history.back()
  } catch (error) {
    console.error(`Document ID ${documentId} 삭제 중 오류 발생:`, error);
  }
}

// 하위 문서의 parent를 null로 업데이트하는 함수
async function updateDocumentParent(documentId) {
  try {
    console.log(`Document ID ${documentId}의 parent를 null로 변경 중...`);
    const updatedDocument = { parent: null };

    await request(
      {
        method: "PUT",
        body: JSON.stringify(updatedDocument),
        headers: {
          "Content-Type": "application/json",
          "x-username": "isix",
        },
      },
      documentId
    );
    console.log(`Document ID ${documentId}의 parent를 null로 변경 완료`);
  } catch (error) {
    console.error(
      `Document ID ${documentId}의 parent 업데이트 중 오류 발생:`,
      error
    );
  }
}
