import { fetchDeleteDocument, navigateTo } from "./utils.js";

const deleteButton = document.getElementById("icon__delete");
const deleteModal = document.getElementById("deleteModal");
const confirmDeleteButton = document.getElementById("confirmDelete");
const cancelDeleteButton = document.getElementById("cancelDelete");

// 삭제 버튼 클릭 시 커스텀 모달 열기
deleteButton.addEventListener("click", function (e) {
  e.preventDefault();
  if (!history.state) return;

  deleteModal.style.display = "block";
});

// 모달의 "확인" 버튼 클릭 시 삭제 진행
confirmDeleteButton.addEventListener("click", async function () {
  const docId = history.state.id;
  await fetchDeleteDocument(docId);

  const target = document.querySelector(`[data-id='${docId}']`);
  const deleteTarget = target.parentElement.parentElement;
  deleteTarget.remove();

  deleteModal.style.display = "none"; // 모달 닫기
  alert("삭제되었습니다."); // 삭제 완료 메시지
  navigateTo("", "/");
});

// 모달의 "취소" 버튼 클릭 시 모달 닫기
cancelDeleteButton.addEventListener("click", function () {
  deleteModal.style.display = "none";
});

// 모달 외부를 클릭했을 때도 모달 닫기
window.addEventListener("click", function (e) {
  if (e.target === deleteModal) {
    deleteModal.style.display = "none";
  }
});
