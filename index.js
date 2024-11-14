// const listPages = document.querySelectorAll(".list__page");
// const mainPage = document.querySelector(".document");

// const pages = {
//   home: `<h1>시작 페이지</h1>
//       <p>TEAM5의 노션입니다.</p>`,
// };

// 전체 페이지 로직
async function getContent(id) {
  try {
    //get data
    const url = `${BASE_URL}/${id}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-username": "team5",
      },
    });
    if (!response.ok) throw new Error("error");
    const data = await response.json();
    // 데이터 업데이트 및 표시
    const title = data.title;
    const content = data.content;
    pages[id] = `<h1>${title}</h1><p>${content}</p>`;
    history.pushState({ page: id }, "", `/${title}`);
    mainPage.innerHTML = pages[id];
  } catch (err) {
    console.error(err);
  }
}

// listPages.forEach((listPage) => {
//   listPage.addEventListener("click", (e) => {
//     e.preventDefault();
//     const id = e.currentTarget.dataset.id;
//     if (id === "home") {
//       // home인 경우 바로 렌더링
//       history.pushState({ page: id }, "", `/`);
//       mainPage.innerHTML = pages[id];
//     } else {
//       // 다른 페이지인 경우 데이터 가져오기
//       //
//       getContent(id);
//     }
//   });
// });

// // 뒤로가기 로직
// window.addEventListener("popstate", (e) => {
//   const id = e.state?.page || "home";
//   mainPage.innerHTML = pages[id];
// });

const BASE_URL = "https://kdt-api.fe.dev-cos.com/documents";

// 에디터 로직
async function getDocument(documentId) {
  const url = `${BASE_URL}/${documentId}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-username": "team5",
      },
    });

    if (!response.ok) throw new Error("error");
    const data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

// 문서 수정
async function updateDocument() {
  const url = `${BASE_URL}/${history.state.documentId}`;
  const title = documentTitle.innerText;
  const content = documentDetail.innerText;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-username": "team5", // 임시
      },
      body: JSON.stringify({
        title,
        content: documentDetail.textContent === "" ? "" : content,
      }),
    });
    if (!response.ok) throw new Error("error");
  } catch (e) {
    console.error(e);
  }
}

async function deleteDocument(documentId) {
  const url = `${BASE_URL}/${documentId}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "x-username": "team5", // 임시
      },
    });

    return response.ok;
  } catch (e) {
    console.error(e);
  }
}

// sidebar logic
// 이벤트 위임을 사용하여 동적으로 생성된 리스트 항목에 클릭 이벤트 추가
const listContainer = document.querySelector(".list__container");

listContainer.addEventListener("click", (e) => {
  const listItem = e.target.closest(".list__page, .list__content");
  if (listItem) {
    e.preventDefault();
    const id = listItem.dataset.id;
    if (id === "home") {
      // home인 경우 바로 렌더링
      history.pushState({}, "", "/");
      window.dispatchEvent(new Event("loadDefault"));
    } else {
      history.pushState({ documentId: id }, "", `/${id}`);
      window.dispatchEvent(new Event("loadDocument"));
    }
  }
});
