//textArea.js
// 미완성
import { getContent } from "./getdata.js";
import { editContent } from "./putdata.js";

const notionSection = document.querySelector(".notionWrap__section");

const notionWrapSection = document.querySelector(".notionWrap__section_text");

export function textAreaAll(id) {
  //content 받아오기
  getContent(id).then((data) => {
    console.log(data);
    const titleInputEl = document
      .querySelector(".notionWrap__section_title")
      .querySelector("input");
    titleInputEl.value = data.title;

    const contentArr = data.content.split("\n\n");

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

  // 초기 상태 확인 후, textarea가 없다면 하나 생성
  function initializeTextarea() {
    if (notionWrapSection.querySelectorAll("textarea").length === 0) {
      createTextarea();
    }
  }

  function createTextarea(content = "", showPlaceholder = true) {
    // 새로운 div 생성 (textarea와 버튼을 포함할 래퍼)
    const textareaWrapper = document.createElement("div");
    textareaWrapper.classList.add("textarea-wrapper");

    // 새로운 textarea 생성
    const newTextarea = document.createElement("textarea");
    newTextarea.className = "gothic-a1-regular";
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
    notionWrapSection.appendChild(textareaWrapper);

    // 생성한 textarea에 포커스
    newTextarea.focus();

    // 초기높이조절
    adjustTextareaHeight(newTextarea);
  }

  // 이벤트 리스너 설정
  notionWrapSection.addEventListener("keydown", function (event) {
    const target = event.target;

    if (target.tagName !== "TEXTAREA") return;

    if (event.key === "Enter") {
      if (event.shiftKey) {
        // Shift + Enter는 줄바꿈
        adjustTextareaHeight(target);
        return;
      } else {
        // Enter만 누르면 새로운 textarea 생성
        event.preventDefault();
        createTextarea();
      }
    }

    if (event.key === "Backspace") {
      if (target.value === "") {
        // 빈 textarea일 경우 삭제 처리
        const textareas = Array.from(
          notionWrapSection.querySelectorAll("textarea")
        );
        const index = textareas.indexOf(target);

        if (index > 0) {
          event.preventDefault();
          target.remove();
          textareas[index - 1].focus();
        }
      } else {
        // Backspace 입력 시 크기 조정
        adjustTextareaHeight(target);
      }
    }
  });

  // focus와 blur 이벤트로 placeholder 토글
  notionWrapSection.addEventListener(
    "focus",
    (event) => {
      if (event.target.tagName === "TEXTAREA") {
        event.target.placeholder =
          "Write something, or press 'space' for AI, '/' for commands...";
      }
    },
    true
  );
  notionWrapSection.addEventListener(
    "blur",
    (event) => {
      if (event.target.tagName === "TEXTAREA") {
        event.target.placeholder = "";
      }
    },
    true
  );

  // 최하단의 `textarea`에 포커스
  function focusLastTextarea() {
    const textareas = notionWrapSection.querySelectorAll("textarea");
    if (textareas.length > 0) {
      textareas[textareas.length - 1].focus();
    } else {
      // `textarea`가 없으면 새로 생성 후 포커스
      createTextarea();
    }
  }
  notionSection.addEventListener("click", (event) => {
    // 빈 공간 클릭인지 확인
    if (event.target === notionSection || event.target === notionWrapSection) {
      focusLastTextarea();
    }
  });

  // 텍스트 영역 높이 자동 조정 함수
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

  // 페이지 로드 시 각 textarea의 높이를 자동으로 맞추기
  document.querySelectorAll("textarea").forEach((textarea) => {
    adjustTextareaHeight(textarea); // 초기화 시 높이 맞추기
  });

  // 입력이 있을 때마다 높이 자동 조정, put으로 제목, 내용 수정
  const titleInputEl = document
    .querySelector(".notionWrap__section_title")
    .querySelector("input");

  notionWrapSection.addEventListener("input", function (event) {
    const target = event.target;

    if (target.tagName === "TEXTAREA") {
      adjustTextareaHeight(target); // 텍스트가 입력될 때마다 높이 자동 맞추기
    }

    const textareas = document.querySelectorAll(
      ".notionWrap__section_text textarea"
    );
    let combinedText = "";
    textareas.forEach((textarea, index) => {
      // textarea의 값을 가져와서 추가
      combinedText += textarea.value;

      // 마지막 textarea가 아니면 줄바꿈 추가
      if (index !== textareas.length - 1) {
        combinedText += "\n\n";
      }
    });
    editContent(138711, titleInputEl.value, combinedText);
  });

  titleInputEl.addEventListener("input", function (e) {
    const textareas = document.querySelectorAll(
      ".notionWrap__section_text textarea"
    );
    let combinedText = "";
    textareas.forEach((textarea, index) => {
      // textarea의 값을 가져와서 추가
      combinedText += textarea.value;

      // 마지막 textarea가 아니면 줄바꿈 추가
      if (index !== textareas.length - 1) {
        combinedText += "\n\n";
      }
    });
    editContent(138711, e.target.value, combinedText);
  });
}
