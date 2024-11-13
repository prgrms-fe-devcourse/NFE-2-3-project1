// routes : URL 주소를 일괄 관리하는 Map 객체 생성
export const routes = new Map();
// routes 객체에 Home URL 등록
// routes.set("/", "<h1>Home</h1><p>Welcome to the Home Page</p>");
routes.set("/", {
  title: "Home",
  content: "Welcome to the Home Page"
});

// 라우터
// export const router = () => {
//   const path = window.location.pathname;
//   const content =
//     routes.get(path) || "<h1>404 Not Found</h1><p>The page does not exist.</p>";
//   document.getElementById("editor__body").innerHTML = content;
// };

export const router = () => {
  const path = window.location.pathname;
  const pageData = routes.get(path);
  
  const titleElement = document.getElementById("editor__title-input");
  const contentElement = document.getElementById("editor__content-input");

  if (pageData) {
    // 페이지 데이터가 있는 경우
    titleElement.value = pageData.title || '';
    contentElement.value = pageData.content || '';
  } else {
    // 404 페이지
    titleElement.value = '404 Not Found';
    contentElement.value = 'The page does not exist.';
    
    // 404 페이지에서는 수정 불가능하도록 설정
    titleElement.disabled = true;
    contentElement.disabled = true;
  }

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
