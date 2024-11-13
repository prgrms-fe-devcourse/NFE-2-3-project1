// 자동 저장을 위한 디바운스 타이머
// 여러번 수정하더라도 마지막 수정 후 2초 뒤에 한 번만 저장되도록 함

let debounceTimeout = null;

// 문서 자동 저장 함수
// 제목이나 내용이 수정될 때마다 서버에 저장 요청을 보냄
const debounceSave = async (documentId, title, content) => {
  // 이전 타이머가 있다면 취소하기
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  // 2초 후에 저장 실행
  debounceTimeout = setTimeout(async () => {
    try {
      // Document 수정 API 구현(PUT 요청)
      const response = await fetch(
        `https://kdt-api.fe.dev-cos.com/documents/${documentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-username": "teamouse",
          },
          body: JSON.stringify({ title, content }),
        }
      );

      if (!response.ok) throw new Error("document 수정 실패");

      const savedDoc = await response.json();
      console.log("document 수정됨", savedDoc);
    } catch (error) {
      console.error("document 수정 실패", error);
    }
  }, 2000); // 2초 디바운스
};

//  editor 초기화 함수
//  contentEditable로 문서의 제목과 내용을 수정 가능한 상태로 만들고 수정 시 자동 저장
//  router.js에서 페이지 전환 시마다 호출
export const initializeEditor = async () => {
  // URL에서 /documents/ 이하의 dcument ID 추출
  const documentId = window.location.pathname.split("/documents/")[1];
  if (!documentId) return;

  const titleElement = document.getElementById("editor__title-input");
  const contentElement = document.getElementById("editor__content-input");

  // 제목, 내용 중 하나라도 없으면(null이면) 함수 종료
  if (!titleElement || !contentElement) return;

  // titleElement, contentElement에 textContent로 API 응답 넣어주기
  // change 이벤트로 수정 감지 => 디바운스 타이머 시간에 따라 자동 저장
  try {
    // 문서 데이터 가져오기
    const response = await fetch(
      `https://kdt-api.fe.dev-cos.com/documents/${documentId}`,
      {
        headers: {
          "x-username": "teamouse",
        },
      }
    );

    if (!response.ok) throw new Error("document 불러오기 실패");

    const document = await response.json();

    // input 요소의 value 설정
    titleInput.value = document.title || "";
    contentInput.value = document.content || "";

    // 제목이 수정될 때마다 자동 저장
    titleInput.addEventListener("input", () => {
      debounceSave(documentId, titleInput.value, contentInput.value);
    });

    // 내용이 수정될 때마다 자동 저장
    contentInput.addEventListener("input", () => {
      debounceSave(documentId, titleInput.value, contentInput.value);
    });
  } catch (error) {
    console.error("문서 초기화 실패:", error);
  }
};
