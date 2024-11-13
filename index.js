const listPages = document.querySelectorAll(".list__page");
const mainPage = document.querySelector(".document");

const pages = {
  home: `<h1>시작 페이지</h1>
      <p>TEAM5의 노션입니다.</p>`,
};

async function getContent(id) {
  try {
    //get data
    const url = `https://kdt-api.fe.dev-cos.com/documents/${id}`;
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

listPages.forEach((listPage) => {
  listPage.addEventListener("click", (e) => {
    e.preventDefault();
    const id = e.currentTarget.dataset.id;
    if (id === "home") {
      // home인 경우 바로 렌더링
      history.pushState({ page: id }, "", `/`);
      mainPage.innerHTML = pages[id];
    } else {
      // 다른 페이지인 경우 데이터 가져오기
      //
      getContent(id);
    }
  });
});

// 뒤로가기 로직
window.addEventListener("popstate", (e) => {
  const id = e.state?.page || "home";
  mainPage.innerHTML = pages[id];
});
