const hamburger = document.getElementById("sideBar__hamburger");
const sideBar = document.getElementById("sidebar");

// 사이드바 숨이는 함수
const onclickSideBarHide = () => {
  const hideButton = document.getElementById("sideBar__hideButton");

  hideButton.addEventListener("click", () => {
    sideBar.classList.toggle("sidebar__hide");

    hamburger.style.display = "block";
  });
};
// hover햇을때 햄버거 이미지 바꾸기
const HamburgerHandler = () => {
  const hamburgerImg = document.querySelector("#sideBar__hamburger img");
  hamburger.addEventListener("mouseover", () => {
    hamburgerImg.src = "/src/asset/sideBar-open.svg";
  });
  hamburger.addEventListener("mouseout", () => {
    hamburgerImg.src = "/src/asset/menu-burger.svg";
  });
  hamburger.addEventListener("click", () => {
    sideBar.classList.toggle("sidebar__hide");
    hamburger.style.display = "none";
  });
};
onclickSideBarHide();
HamburgerHandler();
