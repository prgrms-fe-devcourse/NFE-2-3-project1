import { navigateTo } from "./router.js";
import { fetchDeleteDocument } from "./utils.js";

const deleteButton = document.getElementById("icon__delete");
const deleteModal = document.getElementById("deleteModal");
const confirmDeleteButton = document.getElementById("confirmDelete");
const cancelDeleteButton = document.getElementById("cancelDelete");
const deleteAlert = document.getElementById("deleteAlert");
const closeAlertButton = document.getElementById("closeAlert");

const BASE_URL = `https://kdt-api.fe.dev-cos.com/documents`;
const username = `potatoes`;

let autoSaveInterval;

const docTitleInput = document.getElementById("doc-title__input");
const docContents = document.getElementById("doc-contents");

export const createAndSaveBlocks = async (id) => {
  const title = docTitleInput.innerText;
  const blocks = docContents.innerText.split("\n").join("\n"); //줄바꿈으로 블록 처리
  console.log("저장할 제목:", title);
  console.log("블록 단위로 나눔:", blocks);

  try {
    if (!id) {
      throw new Error("문서 ID가 제공되지 않았습니다.");
    }
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-username": username,
      },

      body: JSON.stringify({ title, content: blocks }),
    });

    if (!response.ok) {
      throw new Error("블록 저장을 실패했습니다.");
    }
    console.log("✅블록을 성공적으로 저장하였습니다");
  } catch (error) {
    console.log("❌블록 저장 실패", error);
  }
};

// 자동 저장
export const autoSaveDocument = (id) => {
  clearInterval(autoSaveInterval);
  autoSaveInterval = setInterval(() => {
    console.log("10초마다 자동 저장 중");
    createAndSaveBlocks(id);
  }, 10000); // 10초마다 자동 저장
};

function handleTitleInput() {
  const id = history.state?.id;
  const currentLink = document.querySelector(`[data-id='${id}']`);
  docTitleInput.textContent = docTitleInput.textContent.replaceAll("\n", "");
  currentLink.textContent = docTitleInput.textContent || "제목 없음";

  if (docTitleInput.innerText.trim() !== "") {
    docTitleInput.classList.add("has-content");
  } else {
    docTitleInput.classList.remove("has-content");
  }
}
function handleContentsInput() {
  docContents.textContent = docContents.textContent.replaceAll("\n", "");
  if (docContents.innerText.trim() !== "") {
    docContents.classList.add("has-content");
  } else {
    docContents.classList.remove("has-content");
  }
}

//수동 저장 (Ctrl + s or Command + s)
function handleManualSave(event) {
  const id = history.state?.id;
  if ((event.ctrlKey || event.metaKey) && event.key === "s") {
    event.preventDefault();
    console.log("수동 저장 중");
    createAndSaveBlocks(id);
  }
}
export const manualSaveDocument = () => {
  document.removeEventListener("keydown", handleManualSave);
  document.addEventListener("keydown", handleManualSave);
};

// contenteditable 처리
docTitleInput.addEventListener("input", handleTitleInput);
docContents.addEventListener("input", handleContentsInput);

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

  deleteModal.style.display = "none"; // 모달 닫기
  deleteAlert.style.display = "block"; // 삭제 완료 알림 표시

  navigateTo({ id: docId }, "/");
});

// 모달의 "취소" 버튼 클릭 시 모달 닫기
cancelDeleteButton.addEventListener("click", function () {
  deleteModal.style.display = "none";
});

// 알림창의 "닫기" 버튼 클릭 시 알림창 닫기
closeAlertButton.addEventListener("click", function () {
  deleteAlert.style.display = "none";
});

// 모달 외부 클릭 시 모달 닫기
window.addEventListener("click", function (e) {
  if (e.target === deleteModal) {
    deleteModal.style.display = "none";
  }
});

//버튼 눌러서 화면 맨 위로 올라가기
const toTopButton = document.getElementById("toTop");
toTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
