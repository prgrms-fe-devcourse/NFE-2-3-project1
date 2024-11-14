// NEW 작성!! 추가
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector("aside");
  const closeSidebarButton = document.querySelector(".closeSidebarButton");
  const openSidebarButton = document.querySelector(".openSidebarButton");

  // 사이드바 닫기
  closeSidebarButton.addEventListener("click", () => {
    sidebar.classList.add("closed"); // 사이드바 닫기
    openSidebarButton.classList.remove("hidden"); // 햄버거 버튼 보이기
  });

  // 사이드바 열기
  openSidebarButton.addEventListener("click", () => {
    sidebar.classList.remove("closed"); // 사이드바 열기
    openSidebarButton.classList.add("hidden"); // 햄버거 버튼 숨기기
  });
});
