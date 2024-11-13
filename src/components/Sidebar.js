// 사이드바 숨이는 함수
const sideBarHide = () => {
  const sideBar = document.getElementById("sidebar");
  const hideButton = document.getElementById("sideBar__hideButton");
  hideButton.addEventListener("click", () => {
    console.log("hi");
    sideBar.classList.toggle("sidebar__hide"); // 'hidden' 클래스를 추가/제거하여 사이드바를 숨기거나 나타냄
  });
};
sideBarHide();
