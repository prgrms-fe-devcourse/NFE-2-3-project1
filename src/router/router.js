import { showLandingPage } from "../components/ShowLandingPage.js";

export const routes = new Map();

// 기본 라우트 설정
routes.set("/", {
  title: "Home",
  content: "Welcome to the Home Page",
});

// 현재 window.location.pathname 값을 기준으로 해당 경로에 맞는 페이지 데이터를 가져와 렌더링
export const router = () => {
  const titleElement = document.getElementById("editor__title-input");
  const contentElement = document.getElementById("editor__content-input");
  const path = window.location.pathname;
  let pageData = routes.get(path);

 // routes에 없는 경로의 경우와 동적 문서 경로 처리
if (!pageData) {
  if (path.startsWith("/documents/")) {
    return; // 동적 문서 경로는 별도 처리
  } else {
    pageData = {
      title: "404 Not Found",
      content: "The page does not exist.",
      disabled: true,
    };
  }
}

  if (!titleElement || !contentElement) return;

  titleElement.disabled = !!pageData.disabled;
  contentElement.disabled = !!pageData.disabled;

  titleElement.value = pageData.title || "";
  contentElement.value = pageData.content || "";
};

// URL 경로를 변경하면서 router를 호출
export const navigate = (path) => {
  path = decodeURIComponent(path);
  window.history.pushState({}, path, window.location.origin + path);
  router();
};

// popstate 이벤트 리스너
window.addEventListener("popstate", router);

showLandingPage();
