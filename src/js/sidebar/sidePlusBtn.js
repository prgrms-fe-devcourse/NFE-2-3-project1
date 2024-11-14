import { navigate } from "../spa/spa.js";

document.addEventListener("click", async (event) => {
  if (event.target.closest(".addButton")) {
    console.log("찍히나요?");
    //클릭된 버튼이 addButton인지 확인
    const addButton = event.target.closest(".addButton");
    const upperPost = addButton.closest(".documentItem");

    if (!upperPost) {
      console.error("부모 요소를 찾을 수 없습니다.");
      return;
    }

    // 추가
    const titleLink = upperPost.querySelector(".documentTitle");
    const documentId = titleLink
      ? titleLink.getAttribute("href").split("/")[2]
      : null;

    console.log("부모 아이디", documentId);

    if (!documentId) {
      console.error("부모 id 못 찾아요~");
      return;
    }

    const newChildPost = {
      title: "제목 없음",
      parent: documentId,
    };

    try {
      const response = await fetch("https://kdt-api.fe.dev-cos.com/documents", {
        method: "POST",
        headers: {
          "x-username": "isix",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newChildPost),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      //DOM에 자식 요소 추가
      const childElement = document.createElement("li");
      childElement.className = "documentItem";
      childElement.setAttribute("data-id", data.id);
      childElement.innerHTML = `
        <div class="rotateAndPage">
          <button class="rotateButton">
            <img src="/assets/right_arrow.svg" />
          </button>
          <a href="/documents/${data.id}">${data.title}</a>
        <div class="documentButton">
          <button class="addButton"><img src="/assets/add.svg" /></button>
          <button class="removeButton">
            <img src="/assets/remove.png" />
          </button>
          </div>
        </div>
    `;
      //하위 도큐먼트 들여쓰기
      childElement.style.marginLeft = "20px";

      // 하위 도큐먼트 클래스명 추가(css 스타일 조정)
      childElement
        .querySelector(".rotateAndPage a")
        .classList.add("documentTitle");

      //상위 도큐먼트의 하위 도큐먼트로 추가 (1114)
      let childList = upperPost.querySelector(".documentList");
      if (!childList) {
        childList = document.createElement("ul");
        childList.className = "documentList";
        upperPost.appendChild(childList);
      }
      childList.appendChild(childElement);

      // 아코디언 토글 상태 유지(NEW 작성 추가!!!)
      const toggleButton = upperPost.querySelector(".rotateButton");
      if (toggleButton) {
        toggleButton.classList.add("rotate"); // addButton 클릭 시 항상 회전 상태 유지
      }

      // 하위 도큐먼트 생성하자마자 이동
      navigate(`/documents/${data.id}`);

      // 하위 도큐먼트 클릭했을 때 이동
      const link = childElement.querySelector("a");
      link.addEventListener("click", (event) => {
        event.preventDefault(); // 기본 링크 클릭 동작 방지
        const documentId = link.getAttribute("href").split("/")[2];

        // navigate 함수로 해당 문서 페이지로 이동
        navigate(`/documents/${documentId}`);
      });
    } catch (error) {
      console.error("API 요청 중 오류 발생:", error.message);
    }
  }

  // toggleButton 클릭 동작
  if (event.target.closest(".rotateButton")) {
    const toggleButton = event.target.closest(".rotateButton");
    const upperPost = toggleButton.closest(".documentItem");
    const childList = upperPost.querySelector(".documentList");

    // 추가
    toggleButton.classList.toggle("rotate"); // 회전 상태 유지

    if (childList) {
      if (childList.style.display === "none" || !childList.style.display) {
        childList.style.display = "block"; // 하위 도큐먼트 보이기
        toggleButton.classList.add("rotate"); // 회전 상태 유지
      } else {
        childList.style.display = "none"; // 하위 도큐먼트 숨기기
        toggleButton.classList.remove("rotate"); // 원상태로 돌아오기
      }
    }
  }
});
