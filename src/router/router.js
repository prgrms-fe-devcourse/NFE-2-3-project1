export const routes = new Map();
routes.set("/", {
  title: "Home",
  content: "Welcome to the Home Page",
});

export const router = () => {
  const path = window.location.pathname;
  const pageData = routes.get(path);
  
  const titleElement = document.getElementById("editor__title-input");
  const contentElement = document.getElementById("editor__content-input");

  if (pageData) {
    titleElement.disabled = false;
    contentElement.disabled = false;
    titleElement.value = pageData.title || '';
    contentElement.value = pageData.content || '';
  } else {
    titleElement.value = '404 Not Found';
    contentElement.value = 'The page does not exist.';
    titleElement.disabled = true;
    contentElement.disabled = true;
  }
};

export const navigate = (path) => {
  path = decodeURIComponent(path);
  window.history.pushState({}, path, window.location.origin + path);
  router();
};

window.addEventListener("popstate", router);
document.addEventListener("DOMContentLoaded", router);
