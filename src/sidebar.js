// 새 페이지 생성
document.addEventListener("DOMContentLoaded", function () {
  // 이벤트 리스너
  const button = document.getElementById("new-page__button");
  if (button) {
    button.addEventListener("click", async function (e) {
      e.preventDefault();
      console.log("새 페이지 버튼이 클릭되었습니다!");
      await createNewPage(null);
    });
  } else {
    console.log("버튼을 찾을 수 없습니다.");
  }
});
//
// api입력
export async function createNewPage(parentId) {
  try {
    const response = await fetch("https://kdt-api.fe.dev-cos.com/documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-username": "potatoes",
      },
      body: JSON.stringify({
        title: "",
        content: "",
        parent: parentId, // parentId 추가
      }),
    });
    if (!response.ok) {
      alert("새 페이지 생성에 실패했습니다. 다시 시도해주세요.");
      throw new Error("새 페이지 생성에 실패했습니다.");
    }
    const newPageData = await response.json();
    console.log("API 응답 데이터:", newPageData);

    const id = newPageData.id;
    const title = newPageData.title || "제목 없음";
    const parentDoc = document.querySelector(
      `div.flex:has([data-id='${parentId}'])`
    );

    if (parentDoc) {
      const parentUl = parentDoc.nextElementSibling;
      const parentLink = parentDoc.querySelector(".doc-item");
      const pathname = parentLink.href + `/${id}`;

      const listItem = document.createElement("li");
      listItem.innerHTML = `
      <div class="flex relative">
        <img src="/assets/toggle-icon.svg" alt="토글 아이콘" class="toggle-icon" />
        <a href="${pathname}" class="doc-item" data-id="${id}">${title}</a>
        <button class="doc-item__add">
          <img src="/assets/plus-icon.svg" alt="새 페이지 추가 버튼" class="icon" />
        </button>
      </div>
    `;

      parentUl.classList.add("indent");
      const subList = document.createElement("ul");

      listItem.appendChild(subList);
      parentUl.appendChild(listItem);

      if (parentUl.classList.contains("hidden")) {
        parentUl.classList.remove("hidden");
      }

      // 하위 페이지가 비어있을 경우 "하위 페이지 없음" 메시지 표시
      const isEmpty = parentUl.children.length === 0;
      const isNotHidden = !parentUl.classList.contains("hidden");
      if (isEmpty && isNotHidden) {
        const message = document.createElement("p");
        message.classList.add("no-sub-pages");
        message.textContent = "하위 페이지 없음";
        parentUl.appendChild(message);
      } else {
        // "하위 페이지 없음" 메시지가 있으면 제거
        const noSubPagesMessage = parentUl.querySelector(".no-sub-pages");
        if (noSubPagesMessage) {
          noSubPagesMessage.remove();
        }
      }
    } else {
      const navListEl = document.getElementById("side-bar__nav-list");
      const pathname = `/documents/${id}`;

      const listItem = document.createElement("li");
      listItem.innerHTML = `
      <div class="flex relative">
        <img src="/assets/toggle-icon.svg" alt="토글 아이콘" class="toggle-icon" />
        <a href="${pathname}" class="doc-item" data-id="${id}">${title}</a>
        <button class="doc-item__add">
          <img src="/assets/plus-icon.svg" alt="새 페이지 추가 버튼" class="icon" />
        </button>
      </div>
    `;

      const subList = document.createElement("ul");
      subList.classList.add("hidden");

      listItem.appendChild(subList);
      navListEl.appendChild(listItem);
    }
  } catch (error) {
    console.error("페이지 생성 중 오류 발생:", error);
    alert("페이지 생성 중 오류가 발생했습니다. 네트워크 상태를 확인해주세요.");
  }
}

// 사이드바 열고 닫기
document.addEventListener("DOMContentLoaded", function () {
  const closeSidebarBtn = document.getElementById("close-sidebar-btn");
  const openSidebarBtn = document.getElementById("open-sidebar-btn");
  const sidebar = document.getElementById("side-bar");
  // 사이드바 닫기 버튼 클릭 시
  closeSidebarBtn.addEventListener("click", function () {
    sidebar.classList.add("closed");
    openSidebarBtn.classList.remove("hidden");
  });

  // 메뉴 버튼 클릭 시 사이드바 열기
  openSidebarBtn.addEventListener("click", function () {
    sidebar.classList.remove("closed");
    openSidebarBtn.classList.add("hidden");
  });
});
