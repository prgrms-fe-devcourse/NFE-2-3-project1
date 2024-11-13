import { getContent, getData, postData } from "./getdata.js";

// API데이터 가져오기
getData().then((data) => {
  console.log(data);
});

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

// // spa 연습
// function SPA(className) {
//   const target = document.querySelector(className);
//   const notionWrap__section = document.querySelector(".notionWrap__section");

//   target.addEventListener("click", function (e) {
//     e.preventDefault();
//     const url = e.currentTarget.dataset.url;
//     history.pushState({ page: url, custom: "test" }, "", `/${url}`);
//     notionWrap__section.innerHTML = pages[url];
//   });
// }
// SPA(".buildIcon");

// 페이지 전역변수
const pages = {};

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
    pageGo();
  });
}
getPages();

// 개인 페이지 리스트 클릭 기능(개인 페이지의 페이지 클릭시 해당 id값에 맞는 페이지 SPA로 보여주기)
function pageGo() {
  const notionWrap__section = document.querySelector(".notionWrap__section");
  const ListItem__pageLink = document.querySelectorAll(".ListItem__pageLink");
  ListItem__pageLink.forEach((list) => {
    list.addEventListener("click", function (e) {
      e.preventDefault();
      const url = e.currentTarget.dataset.url;
      getContent(url).then((data) => {
        console.log(data);
        const title = data.title;
        const content = data.content || ""; // content가 null이면 빈 문자열로 설정
        console.log(title, content);
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
        console.log("wtf", contentArr);
        // content가 존재하면 최상단에 textarea 생성하지 않도록 처리
        if (contentArr.length > 0 && contentArr[0] !== "") {
          contentArr.forEach((content) => {
            createTextarea(content);
          });
        } else {
          // content가 없다면 최상단 textarea 생성
          initializeTextarea();
        }
      });
      history.pushState({ page: url, custom: "test" }, "", `/${url}`);

      function initializeTextarea() {
        if (notionWrap__section.querySelectorAll("textarea").length === 0) {
          createTextarea();
        }
      }

      function createTextarea(content = "", showPlaceholder = true) {
        // 새로운 div 생성 (textarea와 버튼을 포함할 래퍼)
        const textareaWrapper = document.createElement("div");
        textareaWrapper.classList.add("textarea-wrapper");

        // 새로운 textarea 생성
        const newTextarea = document.createElement("textarea");
        newTextarea.className = "gothic-a1-regular textareas";
        newTextarea.placeholder = showPlaceholder
          ? "Write something, or press 'space' for AI, '/' for commands..."
          : "";

        // 만약 content가 있으면, 그 내용을 textarea에 설정
        if (content) {
          newTextarea.value = content;
        }

        // textarea를 textareaWrapper에 추가
        textareaWrapper.appendChild(newTextarea);

        // notionWrapSection에 새 textarea가 포함된 div 추가
        notionWrap__section.appendChild(textareaWrapper);

        // 생성한 textarea에 포커스
        newTextarea.focus();

        // 초기높이조절
        adjustTextareaHeight(newTextarea);
      }

      function adjustTextareaHeight(textarea) {
        // textarea의 line-height 값을 가져옵니다.
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10);

        // 텍스트 길이를 기준으로 줄 수를 계산합니다.
        const textLength = textarea.value.split("\n").length;

        // 계산된 줄 수에 따라 높이를 설정
        const calculatedHeight = lineHeight * textLength; // 줄 수에 따른 높이 계산

        // 높이를 설정
        textarea.style.height = `${calculatedHeight}px`;
      }
    });
  });
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

// 개인 페이지에 신규 페이지 추가 버튼
function presonalPage_MakeNewPage() {
  const ListItem__buildBtn = document.querySelector(".ListItem__buildBtn");
  const notionWrap__section = document.querySelector(".notionWrap__section");
  ListItem__buildBtn.addEventListener("click", function () {
    postData().then((data) => {
      const url = data.id;
      pages[url] = newPage(data.title);
      console.log(pages);
      history.pushState({ page: url, custom: "test" }, "", `/${url}`);
      notionWrap__section.innerHTML = newPage(data.title);
    });
  });
}
presonalPage_MakeNewPage();

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
