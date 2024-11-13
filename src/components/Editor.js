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

      if (!response.ok) throw new Error("document 불러오기 실패");

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
export const initializeEditor = () => {
  // URL에서 /documents/ 이하의 dcument ID 추출
  const documentId = window.location.pathname.split("/documents/")[1];
  if (!documentId) return;

  // ** 추후 id명 추가하고 getElementByID로 수정하기
  const titleElement = document.querySelector("h1");
  const contentElement = document.querySelector("textarea");

  // 제목, 내용 중 하나라도 없으면(null이면) 함수 종료
  if (!titleElement || !contentElement) return;

  // contenteditable 속성 부여 => 편집 가능하게 만들기
  titleElement.contentEditable = "true";
  contentElement.contentEditable = "true";

  // 제목이 수정될 때마다 자동 저장
  titleElement.addEventListener("input", () => {
    debounceSave(documentId, titleElement.innerText, contentElement.innerText);
  });

  // 내용이 수정될 때마다 자동 저장
  contentElement.addEventListener("input", () => {
    debounceSave(documentId, titleElement.innerText, contentElement.innerText);
  });
};
