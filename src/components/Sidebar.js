const hamburger = document.getElementById("sideBar__hamburger");
const sideBar = document.getElementById("sidebar");
const mainSection = document.getElementById("mainSection");
// 사이드바 숨기는 함수
const onclickSideBarHide = () => {
  const hideButton = document.getElementById("sideBar__hideButton");

  hideButton.addEventListener("click", () => {
    sideBar.classList.add("sidebar__hide");
    mainSection.classList.toggle("margin-left250");
    hamburger.style.display = "block";
  });
};

// hover햇을때 햄버거 이미지 바꾸기
const HamburgerHandler = () => {
  const hamburgerImg = document.querySelector("#sideBar__hamburger img");
  let hoverTimer;
  let leaveTimer;
  let isHovered = false;

  hamburger.addEventListener("mouseenter", () => {
    hamburgerImg.src = "/src/asset/sideBar-open.svg";
    // 이미 hover 상태인 경우 무시
    // if (isHovered) return;

    hoverTimer = setTimeout(() => {
      sideBar.classList.add("screen_miniSidebar");
      sideBar.classList.remove("sidebar__hide");
      isHovered = true; // hover 상태로 설정
    }, 1000); // 1초 후에 동작 실행
  });
  hamburger.addEventListener("mouseleave", (event) => {
    hamburgerImg.src = "/src/asset/menu-burger.svg";
    clearTimeout(hoverTimer); // 타이머 초기화
    leaveTimer = setTimeout(() => {
      if (hamburger.style.display === "none") return;
      if (sideBar.contains(event.relatedTarget)) return;
      sideBar.classList.remove("screen_miniSidebar");
      sideBar.classList.add("sidebar__hide");
      // isHovered = false; // hover 상태 초기화
    }, 1000); // 1초 후에 동작 실행
  });
  // 햄버거 클릭했을 때 사이드바 나오게하기
  hamburger.addEventListener("click", () => {
    clearTimeout(leaveTimer); // 타이머 초기화
    clearTimeout(hoverTimer); // 타이머 초기화
    sideBar.classList.remove("sidebar__hide");
    sideBar.classList.remove("screen_miniSidebar");
    mainSection.classList.toggle("margin-left250");
    hamburger.style.display = "none";
  });

  // sideBar에서 mouseleave 발생 시
  sideBar.addEventListener("mouseleave", () => {
    // sideBar가 screen_miniSidebar 클래스를 가지고 있을 때만 동작 실행
    if (
      sideBar.classList.contains("screen_miniSidebar") &&
      !sideBar.contains(event.relatedTarget)
    ) {
      setTimeout(() => {
        sideBar.classList.remove("screen_miniSidebar");
        sideBar.classList.add("sidebar__hide");
        // isHovered = false; // hover 상태 초기화
      }, 1000); // 1초 뒤에 동작 실행
    }
  });
};
onclickSideBarHide();
HamburgerHandler();
