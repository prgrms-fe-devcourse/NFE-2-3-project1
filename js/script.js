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
  });
}
getPages();

// 신규 페이지 추가 버튼(페이지 최상단 버튼, 개인 페이지 버튼)
function MakeNewPage(className) {
  const buildBtn = document.querySelector(`.${className}`);
  const notionWrap__section = document.querySelector(".notionWrap__section");
  const personalPage__PageList = document.querySelector(
    ".personalPage__PageList"
  );

  buildBtn.addEventListener("click", function () {
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
    });
  });
}
MakeNewPage("ListItem__buildBtn");
MakeNewPage("buildIcon");

//////////////////////////////////////////////
// 하위 페이지 추가 버튼(리스트의 +버튼들) 보류
function MakeUnderPage() {
  const notionWrap__section = document.querySelector(".notionWrap__section");
  const ListItem__addBtn = document.querySelectorAll(".ListItem__addBtn");
  ListItem__addBtn.forEach((list, idx) => {
    list.replaceWith(list.cloneNode(true));

    const newList = document.querySelectorAll(".ListItem__addBtn")[idx];

    newList.addEventListener("click", function () {
      const targetA = document.querySelectorAll(".ListItem__pageLink");
      const url = targetA[idx].dataset.url;
      postData(url).then((data) => {
        console.log(underList(data.id, data.title));
        pages[url] = underList(data.id, data.title);
        history.pushState({ page: url, custom: "test" }, "", `/${url}`);
        notionWrap__section.innerHTML = newPage(data.title);
        targetA[idx].parentElement.after(underList(data.id, data.title));
        resetClickEventAll(
          addDeleteListeners,
          pageGo,
          underPageToggle,
          MakeUnderPage
        );
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
      delData(e.target.id);
    })
  );
}

// 개인 페이지 리스트 클릭 기능(개인 페이지의 페이지 클릭시 해당 id값에 맞는 페이지 SPA로 보여주기)
function pageGo() {
  const notionWrap__section = document.querySelector(".notionWrap__section");
  const ListItem__pageLink = document.querySelectorAll(".ListItem__pageLink");

  // 페이지 이동 시 기존 이벤트 리스너 제거
  function removeEventListeners() {
    // 기존 이벤트 리스너를 제거할 부분이 여기입니다.
    notionWrap__section.removeEventListener("keydown", keydownListener);
    notionWrap__section.removeEventListener("input", inputListener);
    notionWrap__section.removeEventListener("focus", focusListener, true);
    notionWrap__section.removeEventListener("blur", blurListener, true);
    notionWrap__section.removeEventListener("click", clickListener);
  }

  // 키보드, 입력, 포커스 등 이벤트 리스너 정의
  let keydownListener,
    inputListener,
    focusListener,
    blurListener,
    clickListener;

  ListItem__pageLink.forEach((list) => {
    list.addEventListener("click", function (e) {
      e.preventDefault();
      const url = e.currentTarget.dataset.url;

      // 기존의 이벤트 리스너 제거
      removeEventListeners();

      // 새로운 페이지 콘텐츠 로드
      getContent(url).then((data) => {
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

        // 제목(input) 변경 시 PUT 요청
        const titleInput = notionWrap__section.querySelector(
          ".notionWrap__section_title input"
        );
        titleInput.addEventListener("input", function () {
          const updatedTitle = titleInput.value;
          const updatedContent = getAllTextareasContent();
          editContent(url, updatedTitle, updatedContent);
        });

        // 콘텐츠 영역에서 textarea의 내용이 변경될 때마다 업데이트
        inputListener = function (event) {
          const target = event.target;
          if (target.tagName === "TEXTAREA") {
            const updatedTitle = titleInput.value;
            const updatedContent = getAllTextareasContent();
            console.log(updatedContent);
            editContent(url, updatedTitle, updatedContent);
          }
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
              updatePlaceholders();
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
    notionWrap__section.appendChild(textareaWrapper);

    newTextarea.focus();
    adjustTextareaHeight(newTextarea);
    updatePlaceholders();
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

  // placeholder가 최하단의 textarea에만 나타나도록 처리
  function updatePlaceholders() {
    const textareas = notionWrap__section.querySelectorAll("textarea");
    textareas.forEach((textarea, index) => {
      textarea.placeholder =
        index === textareas.length - 1
          ? "Write something, or press 'space' for AI, '/' for commands..."
          : "";
    });
  }

  // 텍스트 영역 높이 자동 조정 함수
  function adjustTextareaHeight(textarea) {
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10);
    const textLength = textarea.value.split("\n").length;
    const calculatedHeight = lineHeight * textLength;
    textarea.style.height = `${calculatedHeight}px`;
  }

  // 페이지 로드 시 각 textarea의 높이를 자동으로 맞추기
  document.querySelectorAll("textarea").forEach((textarea) => {
    adjustTextareaHeight(textarea); // 초기화 시 높이 맞추기
  });

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
      <img
        class="docIcon icon"
        src="./img/document.png"
        alt="문서 아이콘"
      />
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
    <!-- 타이틀 영역  -->
    <h1 class="notionWrap__section_title">
      <input placeholder="여기에 제목 입력" value="${title}" />
    </h1>
    <!-- 컨텐츠 영역 -->
    <section class="notionWrap__section_text">
      <textarea
        placeholder="여기에 내용 입력"
        value="${content}"
      ></textarea>
    </section>
    <!-- 하위 페이지 생성시 예시 -->
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
    <!-- 하위 페이지 생성시 예시 -->
  `;
  return pageTemplet;
}

///////////////////////////////////////////////////예정

// 하위 페이지 토글
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
    newList.addEventListener("click", function () {
      if (!newList.classList.contains("seen")) {
        newList.classList.add("seen");
        const url = ListItem__pageLink[idx].dataset.url;
        getContent(url).then((content) => {
          const docs = content.documents;
          docs.forEach((doc) => {
            console.log(doc);
            getContent(doc.id).then((content) => {
              pages[doc.id] = newPage(content.title, content.content);
            });
            newList.parentElement.after(underList(doc.id, doc.title));
          });
          resetClickEventAll(
            addDeleteListeners,
            pageGo,
            underPageToggle,
            MakeUnderPage
          );
        });
      } else {
        newList.classList.remove("seen");
        if (newList.parentElement.nextElementSibling) {
          while (
            newList.parentElement.nextElementSibling &&
            newList.parentElement.nextElementSibling.classList.value ===
              "personalPage__ListItem--next"
          ) {
            newList.parentElement.nextElementSibling.remove();
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
          <img
            class="docIcon icon"
            src="./img/document.png"
            alt="문서 아이콘"
          />
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
