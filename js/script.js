import { getContent, getData, postData, delData } from "./getdata.js";
import { editContent } from "./putdata.js";
////////////////////////////////////전역변수//////////////////////////////
// 페이지 전역변수
const pages = {};
////////////////////////////////////전역변수//////////////////////////////

// 최상단 버튼 숨겨진 메뉴 나타내기
function hideMenuToggle() {
  const selectUser = document.querySelector(".selectUser");
  const hideMenuBox = document.querySelector(".hideMenuBox");
  selectUser.addEventListener("click", function () {
    hideMenuBox.classList.toggle("on");
  });
}
hideMenuToggle();

// 개인페이지 토글 슬라이드
function personalPageToggle() {
  const personalPage__toggleBtn = document.querySelector(
    ".personalPage__toggleBtn"
  );
  const personalPage__PageList = document.querySelector(
    ".personalPage__PageList"
  );
  personalPage__toggleBtn.addEventListener("click", function () {
    personalPage__PageList.classList.toggle("on");
  });
}
personalPageToggle();

// 사이드바 토글 슬라이드
function sidebarToggle() {
  document.querySelector(".arrowIcon").addEventListener("click", function () {
    const sidebar = document.querySelector(".notionWrap__sideBar");
    const openBtn = document.querySelector(".openBtn");
    const selectUser = document.querySelector(".selectUser");
    const hideMenuBox = document.querySelector(".hideMenuBox");
    const personalPage = document.querySelector(".personalPage");

    sidebar.classList.add("hidden");
    personalPage.style.visibility = "hidden";
    hideMenuBox.classList.remove("on");
    selectUser.style.visibility = "hidden";
    setTimeout(() => {
      openBtn.style.display = "block";
    }, 300);
  });

  document.querySelector(".openBtn").addEventListener("click", function () {
    const sidebar = document.querySelector(".notionWrap__sideBar");
    const openBtn = document.querySelector(".openBtn");
    const selectUser = document.querySelector(".selectUser");
    const personalPage = document.querySelector(".personalPage");

    sidebar.classList.remove("hidden");
    personalPage.style.visibility = "visible";
    selectUser.style.visibility = "visible";
    openBtn.style.display = "none";
  });
}
sidebarToggle();

// 처음 페이지 시작시 pages에 API 데이터 저장 + 개인 페이지 업데이트
function getPages() {
  const personalPage__PageList = document.querySelector(
    ".personalPage__PageList"
  );
  getData().then((data) => {
    const dataKeys = Object.keys(data);
    dataKeys.forEach((key) => {
      pages[data[key].id] = newPage(data[key].title, data[key].content);
      personalPage__PageList.appendChild(
        newList(data[key].id, data[key].title)
      );
    });
    resetClickEventAll(
      addDeleteListeners,
      pageGo,
      underPageToggle,
      MakeUnderPage
    );
    console.log(pages);
  });
}
getPages();

// 신규 페이지 추가 버튼(페이지 최상단 버튼, 개인 페이지 버튼)(변경사항-글생성 후 바로 글과 연결시키기 구현)
function MakeNewPage(className) {
  const buildBtn = document.querySelector(`.${className}`);
  const notionWrap__section = document.querySelector(".notionWrap__section");
  const personalPage__PageList = document.querySelector(
    ".personalPage__PageList"
  );

  buildBtn.addEventListener("click", function () {
    if (
      !document
        .querySelector(".personalPage__PageList")
        .classList.contains("on")
    ) {
      document.querySelector(".personalPage__PageList").classList.add("on");
    }
    postData().then((data) => {
      const url = data.id;
      pages[url] = newPage(data.title);
      history.pushState({ page: url, custom: "test" }, "", `/${url}`);
      notionWrap__section.innerHTML = newPage(data.title);
      personalPage__PageList.appendChild(newList(data.id, data.title));
      resetClickEventAll(
        addDeleteListeners,
        pageGo,
        underPageToggle,
        MakeUnderPage
      );
      const ListItem__pageLink = document.querySelectorAll(
        ".ListItem__pageLink"
      );
      ListItem__pageLink.forEach((e) => {
        if (Number(e.getAttribute("data-url")) === data.id) {
          e.click();
        }
      });
    });
  });
}
MakeNewPage("ListItem__buildBtn");
MakeNewPage("buildIcon");

//////////////////////////////////////////////
// 하위 페이지 추가 버튼
// (변경사항 - MakeUnderPage시 underPageToggle에서 상위폴더를 클릭하게 변경[생성후 페이지에서 글 쓰면 저장안되는 현상 때문에 변경])

function MakeUnderPage() {
  const personalPage__ListItem = document.querySelectorAll(
    ".personalPage__ListItem"
  );
  const notionWrap__section = document.querySelector(".notionWrap__section");
  const ListItem__addBtn = document.querySelectorAll(".ListItem__addBtn");
  ListItem__addBtn.forEach((list, idx) => {
    list.replaceWith(list.cloneNode(true));

    const newList = document.querySelectorAll(".ListItem__addBtn")[idx];

    newList.addEventListener("click", function () {
      const targetA = document.querySelectorAll(".ListItem__pageLink");
      const url = targetA[idx].dataset.url;
      postData(url).then(async (data) => {
        history.pushState({ page: url, custom: "test" }, "", `/${url}`);
        resetClickEventAll(
          addDeleteListeners,
          pageGo,
          underPageToggle,
          MakeUnderPage
        );
        // 하위문서 토글 버튼 클릭
        const under_btn = personalPage__ListItem[idx].querySelector(
          ".ListItem__underBtn"
        );
        under_btn.click();

        if (!under_btn.classList.contains("seen")) {
          under_btn.click();
        }
      });
    });
  });
}
//////////////////////////////////////////////

// 페이지 삭제
function addDeleteListeners() {
  const delIcons = document.querySelectorAll(".delIcon.icon");
  delIcons.forEach((delIcon) =>
    delIcon.addEventListener("click", function (e) {
      e.target.parentNode.parentNode.style.display = "none";
      if (!e.target.classList.contains("del")) {
        const id = e.target.id;
        const newPageDiv = document.getElementById("new_page_" + id);
        delData(id);
        newPageDiv.style.display = "none";
        e.target.classList.add("del");
      }
    })
  );
}

// 개인 페이지 리스트 클릭 기능(개인 페이지의 페이지 클릭시 해당 id값에 맞는 페이지 SPA로 보여주기)
function pageGo() {
  const notionWrap__section = document.querySelector(".notionWrap__section");
  const ListItem__pageLink = document.querySelectorAll(".ListItem__pageLink");

  // 페이지 이동 시 기존 이벤트 리스너 제거 용
  function removeEventListeners() {
    notionWrap__section.removeEventListener("keydown", keydownListener);
    notionWrap__section.removeEventListener("input", inputListener);
    notionWrap__section.removeEventListener("focus", focusListener, true);
    notionWrap__section.removeEventListener("blur", blurListener, true);
    notionWrap__section.removeEventListener("click", clickListener);
  }

  //이벤트 리스너 정의
  let keydownListener,
    inputListener,
    focusListener,
    blurListener,
    clickListener;

  let url = "";
  ListItem__pageLink.forEach((list) => {
    list.addEventListener("click", function (e) {
      e.preventDefault();
      const personalPage__ListItem = document.querySelectorAll(
        ".personalPage__ListItem"
      );
      // 중복 이벤트 발생 제게 추가(변경사항) ---------------------------------------------
      personalPage__ListItem.forEach((list) => {
        if (list.classList.contains("on")) {
          e.stopImmediatePropagation();
          list.classList.remove("on");
        }
      });
      e.currentTarget.parentElement.classList.add("on");
      // 중복 이벤트 발생 제게 추가 ---------------------------------------------

      url = e.currentTarget.dataset.url;

      // 기존의 이벤트 리스너 제거
      removeEventListeners();

      // 새로운 페이지 콘텐츠 로드
      getContent(url).then((data) => {
        console.log(data);
        const title = data.title;
        const content = data.content || ""; // content가 null이면 빈 문자열로 설정

        notionWrap__section.innerHTML = `
          <h1 class="notionWrap__section_title">
            <input placeholder="여기에 제목 입력" value="${title}" />
          </h1>
          <section class="notionWrap__section_text">
          </section>
        `;

        const contentArr = content.includes("\n\n")
          ? content.split("\n\n")
          : [content];

        // content가 존재하면 최상단에 textarea 생성하지 않도록 처리
        if (contentArr.length > 0 && contentArr[0] !== "") {
          contentArr.forEach((content) => {
            createTextarea(content);
          });
        } else {
          // content가 없다면 최상단 textarea 생성
          initializeTextarea();
        }

        // 제목(input) 변경 시 PUT 요청 + 제목 수정시 사이드바도 수정되도록 변경
        const titleInput = notionWrap__section.querySelector(
          ".notionWrap__section_title input"
        );
        titleInput.addEventListener("input", function () {
          const updatedTitle = titleInput.value;
          const updatedContent = getAllTextareasContent();

          // 제목 수정 후 PUT 요청을 통해 서버에 저장
          editContent(url, updatedTitle, updatedContent);
          const sidebarItem = document.querySelector(
            `.personalPage__PageList .ListItem__pageLink[data-url="${url}"]`
          );
          if (sidebarItem) {
            sidebarItem.textContent = updatedTitle;
          }
        });

        // 콘텐츠 영역에서 textarea의 내용이 변경될 때마다 업데이트
        inputListener = function (event) {
          const target = event.target;
          if (target.tagName === "TEXTAREA") {
            const updatedTitle = titleInput.value;
            const updatedContent = getAllTextareasContent();
            console.log(updatedContent);
            editContent(url, updatedTitle, updatedContent);
            //긴 한줄 문자열 줄바꿈
          }
          adjustTextareaHeight(target);
        };
        notionWrap__section.addEventListener("input", inputListener);

        // 페이지 내에서 Enter/Backspace 키 이벤트 처리
        keydownListener = function (event) {
          const target = event.target;
          if (target.tagName !== "TEXTAREA") return;

          if (event.key === "Enter") {
            if (event.shiftKey) {
              requestAnimationFrame(() => adjustTextareaHeight(target));
              return;
            } else {
              event.preventDefault();
              createTextarea();
              return;
            }
          }

          if (event.key === "Backspace") {
            if (target.value === "") {
              const textareas = Array.from(
                notionWrap__section.querySelectorAll("textarea")
              );
              const index = textareas.indexOf(target);

              if (index > 0) {
                event.preventDefault();
                target.remove();
                textareas[index - 1].focus();
              }
              //textarea 빈배열일때, backspace눌르면 수정
              const updatedTitle = titleInput.value;
              const updatedContent = getAllTextareasContent();
              editContent(url, updatedTitle, updatedContent);
            } else {
              requestAnimationFrame(() => adjustTextareaHeight(target));
            }
          }
        };
        notionWrap__section.addEventListener("keydown", keydownListener);

        // focus와 blur 이벤트로 placeholder 토글
        focusListener = function (event) {
          if (event.target.tagName === "TEXTAREA") {
            event.target.placeholder =
              "Write something, or press 'space' for AI, '/' for commands...";
          }
        };
        blurListener = function (event) {
          if (event.target.tagName === "TEXTAREA") {
            event.target.placeholder = "";
          }
        };

        notionWrap__section.addEventListener("focus", focusListener, true);
        notionWrap__section.addEventListener("blur", blurListener, true);

        // 최하단의 `textarea`에 포커스
        clickListener = function (event) {
          if (event.target === notionWrap__section) {
            focusLastTextarea();
          }
        };
        notionWrap__section.addEventListener("click", clickListener);

        // 페이지 히스토리 상태 변경
        history.pushState({ page: url, custom: "test" }, "", `/${url}`);
        // 추가부분
        if (data.documents.length > 0) {
          data.documents.forEach((doc) => {
            downPage(notionWrap__section, doc.title, doc.id);
          });
        }
        const dPage = document.querySelectorAll(
          ".notionWrap__section_downPage-text"
        );
        dPage.forEach((page) => {
          page.addEventListener("click", function (e) {
            e.preventDefault();
            const url = e.currentTarget.dataset.url;
            getContent(url).then((data) => {
              console.log(data.title, data.content);
              const title = data.title;
              const content = data.content || ""; // content가 null이면 빈 문자열로 설정

              notionWrap__section.innerHTML = `
                <!-- 타이틀 영역  -->
                <h1 class="notionWrap__section_title">
                  <input placeholder="여기에 제목 입력" value="${title}" />
                </h1>
                <!-- 컨텐츠 영역 -->
                <section class="notionWrap__section_text">
                </section>
              `;

              const contentArr = content.includes("\n\n")
                ? content.split("\n\n")
                : [content];

              // content가 존재하면 최상단에 textarea 생성하지 않도록 처리
              if (contentArr.length > 0 && contentArr[0] !== "") {
                contentArr.forEach((content) => {
                  createTextarea(content);
                });
              } else {
                // content가 없다면 최상단 textarea 생성
                initializeTextarea();
              }
              history.pushState({ page: url, custom: "test" }, "", `/${url}`);
            });
          });
        });
        // 하위 페이지 포맷
        function downPage(parent, title, id) {
          const page = `
   <div class="notionWrap__section_newPage" id="new_page_${id}">
          <svg
            role="graphics-symbol"
            viewBox="0 0 16 16"
            class="pageEmpty"
            style="
              width: 19.8px;
              height: 19.8px;
              display: block;
              fill: rgb(145, 145, 142);
              flex-shrink: 0;
            "
          >
            <path
              d="M4.35645 15.4678H11.6367C13.0996 15.4678 13.8584 14.6953 13.8584 13.2256V7.02539C13.8584 6.0752 13.7354 5.6377 13.1406 5.03613L9.55176 1.38574C8.97754 0.804688 8.50586 0.667969 7.65137 0.667969H4.35645C2.89355 0.667969 2.13477 1.44043 2.13477 2.91016V13.2256C2.13477 14.7021 2.89355 15.4678 4.35645 15.4678ZM4.46582 14.1279C3.80273 14.1279 3.47461 13.7793 3.47461 13.1436V2.99219C3.47461 2.36328 3.80273 2.00781 4.46582 2.00781H7.37793V5.75391C7.37793 6.73145 7.86328 7.20312 8.83398 7.20312H12.5186V13.1436C12.5186 13.7793 12.1836 14.1279 11.5205 14.1279H4.46582ZM8.95703 6.02734C8.67676 6.02734 8.56055 5.9043 8.56055 5.62402V2.19238L12.334 6.02734H8.95703Z"
            ></path>
          </svg>
          <a href="${id}" data-url="${id}" class="notionWrap__section_downPage-text">
          <span>${title}</span>
        </a>
        </div>
  `;
          parent.insertAdjacentHTML("beforeend", page);
        }
        // 추가부분
      });
    });
  });

  // 페이지 내에서 `textarea`를 초기화하는 함수
  function initializeTextarea() {
    if (notionWrap__section.querySelectorAll("textarea").length === 0) {
      createTextarea();
    }
  }

  // textarea 생성 함수
  function createTextarea(content = "") {
    const textareaWrapper = document.createElement("div");
    textareaWrapper.classList.add("textarea-wrapper");

    const newTextarea = document.createElement("textarea");
    newTextarea.className = "gothic-a1-regular textareas";

    if (content) {
      newTextarea.value = content;
    }

    textareaWrapper.appendChild(newTextarea);

    // 현재 포커스된 textarea를 찾음
    const currentTextarea = notionWrap__section.querySelector("textarea:focus");

    if (currentTextarea) {
      // 포커스된 textarea 뒤에 새로운 textarea를 추가
      currentTextarea.parentNode.insertBefore(
        textareaWrapper,
        currentTextarea.nextSibling
      );
    } else {
      // 포커스된 textarea가 없다면 맨 아래에 추가
      notionWrap__section.appendChild(textareaWrapper);
    }

    newTextarea.focus();
    adjustTextareaHeight(newTextarea);

    //새로운 textarea 생성했을 때 저장
    function saveContentOnChange() {
      const updatedTitle = notionWrap__section.querySelector(
        ".notionWrap__section_title input"
      ).value;
      const updatedContent = getAllTextareasContent();
      editContent(url, updatedTitle, updatedContent);
    }
    saveContentOnChange();

    // 화면 크기 변경 시에도 높이를 재조정
    window.addEventListener("resize", function () {
      adjustTextareaHeight(newTextarea); // 화면 크기가 변경될 때마다 높이 재조정
    });
  }

  // 콘텐츠가 포함된 모든 textarea의 값 가져오기
  function getAllTextareasContent() {
    const textareas = notionWrap__section.querySelectorAll("textarea");
    let combinedText = "";

    textareas.forEach((textarea, index) => {
      combinedText += textarea.value;
      if (index !== textareas.length - 1) {
        combinedText += "\n\n";
      }
    });

    return combinedText;
  }

  // 텍스트 영역 높이 자동 조정 함수
  function adjustTextareaHeight(textarea) {
    // 기본 높이를 설정 (1줄 높이)
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10);
    const minHeight = lineHeight; // 최소 높이는 한 줄 높이보다 조금 더 여유를 두기

    // 먼저 높이를 자동으로 초기화하여 계산
    if (textarea.tagName === "TEXTAREA") textarea.style.height = "20px";
    else textarea.style.height = "auto";

    // scrollHeight가 최소 높이보다 작은 경우는 최소 높이를 유지
    textarea.style.height = `${Math.max(textarea.scrollHeight, minHeight)}px`;
  }

  // 최하단의 `textarea`에 포커스
  function focusLastTextarea() {
    const textareas = notionWrap__section.querySelectorAll("textarea");
    if (textareas.length > 0) {
      textareas[textareas.length - 1].focus();
    } else {
      createTextarea();
    }
  }
}

// 뒤로가기 SPA 업데이트
function popState() {
  const notionWrap__section = document.querySelector(".notionWrap__section");
  window.addEventListener("popstate", function (e) {
    if (e.state) {
      const url = e.state.page;
      notionWrap__section.innerHTML = pages[url];
    } else {
      notionWrap__section.textContent = "";
    }
  });
}
popState();

// 개인 페이지 리스트 포맷
function newList(id, title) {
  const listTemplet = document.createElement("li");
  listTemplet.classList.add("personalPage__ListItem");
  listTemplet.classList.add("bgChange");
  listTemplet.innerHTML = `
    <div class="ListItem__underBtn bgChange">
      <div class="icon-container"> 
              <svg class="icon1" width="16px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#949491" transform="matrix(-1, 0, 0, 1, 0, 0)" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.144"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M9.29289 1.29289C9.48043 1.10536 9.73478 1 10 1H18C19.6569 1 21 2.34315 21 4V20C21 21.6569 19.6569 23 18 23H6C4.34315 23 3 21.6569 3 20V8C3 7.73478 3.10536 7.48043 3.29289 7.29289L9.29289 1.29289ZM18 3H11V8C11 8.55228 10.5523 9 10 9H5V20C5 20.5523 5.44772 21 6 21H18C18.5523 21 19 20.5523 19 20V4C19 3.44772 18.5523 3 18 3ZM6.41421 7H9V4.41421L6.41421 7ZM7 13C7 12.4477 7.44772 12 8 12H16C16.5523 12 17 12.4477 17 13C17 13.5523 16.5523 14 16 14H8C7.44772 14 7 13.5523 7 13ZM7 17C7 16.4477 7.44772 16 8 16H16C16.5523 16 17 16.4477 17 17C17 17.5523 16.5523 18 16 18H8C7.44772 18 7 17.5523 7 17Z" fill="#949494"></path> </g></svg>    
              <svg class="icon2" role="graphics-symbol" viewBox="0 0 12 12" style="width: 15px; height: 15px; display: block; fill: rgba(55, 53, 47, 0.35); flex-shrink: 0; transition: transform 200ms ease-out; transform: rotateZ(0deg);"><path d="M6.02734 8.80274C6.27148 8.80274 6.47168 8.71484 6.66211 8.51465L10.2803 4.82324C10.4268 4.67676 10.5 4.49609 10.5 4.28125C10.5 3.85156 10.1484 3.5 9.72363 3.5C9.50879 3.5 9.30859 3.58789 9.15234 3.74902L6.03223 6.9668L2.90722 3.74902C2.74609 3.58789 2.55078 3.5 2.33105 3.5C1.90137 3.5 1.55469 3.85156 1.55469 4.28125C1.55469 4.49609 1.62793 4.67676 1.77441 4.82324L5.39258 8.51465C5.58789 8.71973 5.78808 8.80274 6.02734 8.80274Z"></path></svg>
              <svg class="icon3" role="graphics-symbol" viewBox="0 0 12 12" style=" opacity:0; width: 15px; height: 15px; display: block; fill: rgba(55, 53, 47, 0.35); flex-shrink: 0; transition: transform 200ms ease-out; transform: rotateZ(0deg);"><path d="M6.02734 8.80274C6.27148 8.80274 6.47168 8.71484 6.66211 8.51465L10.2803 4.82324C10.4268 4.67676 10.5 4.49609 10.5 4.28125C10.5 3.85156 10.1484 3.5 9.72363 3.5C9.50879 3.5 9.30859 3.58789 9.15234 3.74902L6.03223 6.9668L2.90722 3.74902C2.74609 3.58789 2.55078 3.5 2.33105 3.5C1.90137 3.5 1.55469 3.85156 1.55469 4.28125C1.55469 4.49609 1.62793 4.67676 1.77441 4.82324L5.39258 8.51465C5.58789 8.71973 5.78808 8.80274 6.02734 8.80274Z"></path></svg>
            </div>
    </div>
    <a href="/${id}" data-url="${id}" class="ListItem__pageLink">
      <span>${title}</span>
    </a>
    <div class="ListItem__delBtn bgChange">
      <img
        class="delIcon icon"
        id="${id}"
        src="../img/send-to-trash.png"
        alt="삭제 아이콘"
      />
    </div>
    <div class="ListItem__addBtn bgChange">
      <img
        class="addIcon icon"
        src="../img/plus-icon.png"
        alt="추가 아이콘"
      />
    </div>
  `;
  return listTemplet;
}

// 신규 페이지 포맷
function newPage(title, content) {
  const pageTemplet = `
    <h1 class="notionWrap__section_title">
      <input placeholder="여기에 제목 입력" value="${title}" />
    </h1>
    <section class="notionWrap__section_text"></section>
    <div class="textarea-wrapper">
      <textarea 
        class="gothic-a1-regular textareas" 
        value="${content}" 
        placeholder="" 
        style="height: 24px;"
      >
      </textarea>
    </div>
    <div class="notionWrap__section_newPage">
      <svg
        role="graphics-symbol"
        viewBox="0 0 16 16"
        class="pageEmpty"
        style="
          width: 19.8px;
          height: 19.8px;
          display: block;
          fill: rgb(145, 145, 142);
          flex-shrink: 0;
        "
      >
        <path
          d="M4.35645 15.4678H11.6367C13.0996 15.4678 13.8584 14.6953 13.8584 13.2256V7.02539C13.8584 6.0752 13.7354 5.6377 13.1406 5.03613L9.55176 1.38574C8.97754 0.804688 8.50586 0.667969 7.65137 0.667969H4.35645C2.89355 0.667969 2.13477 1.44043 2.13477 2.91016V13.2256C2.13477 14.7021 2.89355 15.4678 4.35645 15.4678ZM4.46582 14.1279C3.80273 14.1279 3.47461 13.7793 3.47461 13.1436V2.99219C3.47461 2.36328 3.80273 2.00781 4.46582 2.00781H7.37793V5.75391C7.37793 6.73145 7.86328 7.20312 8.83398 7.20312H12.5186V13.1436C12.5186 13.7793 12.1836 14.1279 11.5205 14.1279H4.46582ZM8.95703 6.02734C8.67676 6.02734 8.56055 5.9043 8.56055 5.62402V2.19238L12.334 6.02734H8.95703Z"
        ></path>
      </svg>
      <p class="notionWrap__section_newPage-text">New page</p>
    </div>
  `;
  return pageTemplet;
}

///////////////////////////////////////////////////예정

// 하위 페이지 토글
// (변경사항 - MakeUnderPage시 underPageToggle에서 상위폴더를 클릭하게 변경[생성후 페이지에서 글 쓰면 저장안되는 현상 때문에 변경])
function underPageToggle() {
  const ListItem__underBtn = document.querySelectorAll(".ListItem__underBtn");
  const ListItem__pageLink = document.querySelectorAll(".ListItem__pageLink");

  // 기존 이벤트 리스너 제거 후 새로 추가
  ListItem__underBtn.forEach((list, idx) => {
    // 기존 이벤트 리스너 제거
    list.replaceWith(list.cloneNode(true));

    // 다시 querySelector로 새로 추가된 요소를 선택
    const newList = document.querySelectorAll(".ListItem__underBtn")[idx];

    // 새 이벤트 리스너 추가
    newList.addEventListener("click", function (e) {
      if (!this.classList.contains("seen")) {
        this.classList.add("seen");
        const url = ListItem__pageLink[idx].dataset.url;
        getContent(url).then((content) => {
          const docs = content.documents;
          console.log(docs);
          if (docs.length === 0) {
            this.classList.remove("seen");
          }
          docs.forEach((doc) => {
            getContent(doc.id).then((content) => {
              pages[doc.id] = newPage(content.title, content.content);
            });
            this.parentElement.after(underList(doc.id, doc.title));
          });

          resetClickEventAll(
            addDeleteListeners,
            pageGo,
            underPageToggle,
            MakeUnderPage
          );
          const ListItem__pageLink = document.querySelectorAll(
            ".ListItem__pageLink"
          );
          ListItem__pageLink.forEach((list, idx) => {
            if (Number(list.getAttribute("data-url")) === content.id) {
              ListItem__pageLink[idx].click();
            }
          });
          e.stopImmediatePropagation();
        });
      } else {
        this.classList.remove("seen");
        if (this.parentElement.nextElementSibling) {
          while (
            this.parentElement.nextElementSibling &&
            this.parentElement.nextElementSibling.classList.value ===
              "personalPage__ListItem--next"
          ) {
            this.parentElement.nextElementSibling.remove();
          }
        }
      }
    });
  });
}

// 이벤트리스너 한번에 추가하기
function resetClickEventAll(...arg) {
  arg.forEach((callback) => {
    callback();
  });
}

// 하위페이지 리스트 포맷
function underList(id, title) {
  const underListTemplet = document.createElement("li");
  underListTemplet.classList.add("personalPage__ListItem--next");
  underListTemplet.innerHTML = `
    <ul class="personalPage__PageList--next">
      <li class="personalPage__ListItem bgChange">
        <div class="ListItem__underBtn bgChange">
          <div class="icon-container"> 
              <svg class="icon1" width="16px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#949491" transform="matrix(-1, 0, 0, 1, 0, 0)" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.144"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M9.29289 1.29289C9.48043 1.10536 9.73478 1 10 1H18C19.6569 1 21 2.34315 21 4V20C21 21.6569 19.6569 23 18 23H6C4.34315 23 3 21.6569 3 20V8C3 7.73478 3.10536 7.48043 3.29289 7.29289L9.29289 1.29289ZM18 3H11V8C11 8.55228 10.5523 9 10 9H5V20C5 20.5523 5.44772 21 6 21H18C18.5523 21 19 20.5523 19 20V4C19 3.44772 18.5523 3 18 3ZM6.41421 7H9V4.41421L6.41421 7ZM7 13C7 12.4477 7.44772 12 8 12H16C16.5523 12 17 12.4477 17 13C17 13.5523 16.5523 14 16 14H8C7.44772 14 7 13.5523 7 13ZM7 17C7 16.4477 7.44772 16 8 16H16C16.5523 16 17 16.4477 17 17C17 17.5523 16.5523 18 16 18H8C7.44772 18 7 17.5523 7 17Z" fill="#949494"></path> </g></svg>    
              <svg class="icon2" role="graphics-symbol" viewBox="0 0 12 12" style="width: 15px; height: 15px; display: block; fill: rgba(55, 53, 47, 0.35); flex-shrink: 0; transition: transform 200ms ease-out; transform: rotateZ(0deg);"><path d="M6.02734 8.80274C6.27148 8.80274 6.47168 8.71484 6.66211 8.51465L10.2803 4.82324C10.4268 4.67676 10.5 4.49609 10.5 4.28125C10.5 3.85156 10.1484 3.5 9.72363 3.5C9.50879 3.5 9.30859 3.58789 9.15234 3.74902L6.03223 6.9668L2.90722 3.74902C2.74609 3.58789 2.55078 3.5 2.33105 3.5C1.90137 3.5 1.55469 3.85156 1.55469 4.28125C1.55469 4.49609 1.62793 4.67676 1.77441 4.82324L5.39258 8.51465C5.58789 8.71973 5.78808 8.80274 6.02734 8.80274Z"></path></svg>
              <svg class="icon3" role="graphics-symbol" viewBox="0 0 12 12" style=" opacity:0; width: 15px; height: 15px; display: block; fill: rgba(55, 53, 47, 0.35); flex-shrink: 0; transition: transform 200ms ease-out; transform: rotateZ(0deg);"><path d="M6.02734 8.80274C6.27148 8.80274 6.47168 8.71484 6.66211 8.51465L10.2803 4.82324C10.4268 4.67676 10.5 4.49609 10.5 4.28125C10.5 3.85156 10.1484 3.5 9.72363 3.5C9.50879 3.5 9.30859 3.58789 9.15234 3.74902L6.03223 6.9668L2.90722 3.74902C2.74609 3.58789 2.55078 3.5 2.33105 3.5C1.90137 3.5 1.55469 3.85156 1.55469 4.28125C1.55469 4.49609 1.62793 4.67676 1.77441 4.82324L5.39258 8.51465C5.58789 8.71973 5.78808 8.80274 6.02734 8.80274Z"></path></svg>
            </div>
        </div>
        <a href="${id}" data-url="${id}" class="ListItem__pageLink">
          <span>${title}</span>
        </a>
        <div class="ListItem__delBtn bgChange">
          <img
            class="delIcon icon"
            id="${id}"
            src="../img/send-to-trash.png"
            alt="삭제 아이콘"
          />
        </div>
        <div class="ListItem__addBtn bgChange">
          <img
            class="addIcon icon"
            src="../img/plus-icon.png"
            alt="추가 아이콘"
          />
        </div>
      </li>
    </ul>
  `;
  return underListTemplet;
}
