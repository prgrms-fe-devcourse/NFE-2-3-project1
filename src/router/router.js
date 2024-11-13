export const routes = new Map();
routes.set("/", "<h1>Home</h1><p>Welcome to the Home Page</p>");

// 라우터
export const router = () => {
  const path = window.location.pathname;
  const content =
    routes.get(path) || "<h1>404 Not Found</h1><p>The page does not exist.</p>";
  document.getElementById("editor__body").innerHTML = content;
};

// 페이지 이동 함수
export const navigate = (path) => {
  path = decodeURIComponent(path);
  window.history.pushState({}, path, window.location.origin + path);
  router();
};

// 초기 이벤트 리스너
window.addEventListener("popstate", router);
document.addEventListener("DOMContentLoaded", router);
