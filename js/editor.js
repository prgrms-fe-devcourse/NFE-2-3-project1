import { handleUpdateDoc } from "./client.js";
import { loadSidebarDocs, makePathDir } from "./utils.js";
// 텍스트 에디터

// 새 editable 블록 생성 (타입 정할 수 있음)
function createNewEditableBlock(type) {
  const newBlock = document.createElement(type);
  newBlock.contentEditable = "true";
  newBlock.classList.add("text-block");
  return newBlock;
}

///////////////////////////////////////////////////////

// 이전 블록이 ul 또는 ol인지 확인하는 함수
function isPreviousBlockList(block) {
  return block && (block.tagName === "UL" || block.tagName === "OL");
}
///////////////////////////////////////////////////////

let isComposing = true;

document.querySelector("#editor").addEventListener("compositionstart", () => {
  isComposing = false;
});
document.querySelector("#editor").addEventListener("compositionend", () => {
  isComposing = true;
});

///////////////////////////////////////////////////////
// Enter 키를 누를 때 동작

document.querySelector("#editor").addEventListener("keydown", function (e) {
  const currentBlock = document.activeElement; // 현재 포커스가 있는 블록을 가져옴
  const previousBlock = currentBlock.previousElementSibling;
  const titleInput = document.getElementById("title-input");

  // Enter 키가 눌렸을 때
  if (isComposing && e.key === "Enter") {
    e.preventDefault();

    // 현재 포커스가 Text input일 때
    if (currentBlock === titleInput) {
      startTextEditor();
    }

    // 현재 블록이 text-block일 경우, 새 블록을 생성
    if (currentBlock.classList.contains("text-block")) {
      addDefaultBlock(currentBlock);
    }

    // 리스트 블록일 경우 li를 계속함
    if (currentBlock.tagName === "LI") {
      const parentBlock = currentBlock.parentElement;
      continueLiBlock(parentBlock);
    }
  }
  //////////////////////////////////////////////////////

  // 키 업/다운 이동 처리
  // 리펙토링시 previousBlock으로 바꾸기
  if (e.key === "ArrowUp" && currentBlock.previousElementSibling) {
    currentBlock.previousElementSibling.focus();
    setCaretToEnd(currentBlock.previousElementSibling);
  }

  if (e.key === "ArrowDown" && currentBlock.nextElementSibling) {
    currentBlock.nextElementSibling.focus();
  }

  ///////////////////////////////////////////////////////
  // 현재 블록 빈 블록일 때 Delete/Backspace 처리
  if (
    (e.key === "Delete" || e.key === "Backspace") &&
    currentBlock.textContent.trim() === ""
  ) {
    const previousBlock = currentBlock.previousElementSibling;
    const textContainer = document.querySelector("#text-container");

    // 1. 첫 번째 텍스트 블록일 때
    if (currentBlock === document.querySelectorAll(".text-block")[0]) {
      e.preventDefault();
      titleInput.focus();
    }

    // 2. 현재 블록이 기본 블록일 때
    if (
      currentBlock.tagName === "DIV" ||
      currentBlock.tagName === "H2" ||
      currentBlock.tagName === "H3" ||
      currentBlock.tagName === "H4"
    ) {
      e.preventDefault();
      // 2.1 이전 요소가 listHead 일 때
      if (isPreviousBlockList(previousBlock)) {
        e.preventDefault(); // 기본 동작 방지
        currentBlock.remove(); // 현재 빈 div 블록 삭제
        //이전 ul/ol의 마지막 자식 요소를 찾고 포커스 이동
        const preBlocklastChild = previousBlock.lastElementChild;
        if (preBlocklastChild) {
          preBlocklastChild.focus(); // 마지막 li에 포커스 이동
          setCaretToEnd(preBlocklastChild); // 마지막 글자 뒤로 커서 이동
        }
      } else if (previousBlock.tagName === "HR") {
        previousBlock.remove();
        previousBlock.focus();
        setCaretToEnd(previousBlock);
      }
      // 2.2 이전 요소가 listHead가 아닐때
      else {
        // e.preventDefault(); // 기본 동작 방지
        currentBlock.remove(); // 현재 빈 div 블록 삭제
        if (previousBlock) {
          previousBlock.focus(); // 이전 블록으로 포커스 이동
          setCaretToEnd(previousBlock); // 이전 블록의 끝으로 커서 이동
        }
      }
    }

    // 3. 현재 태그가 li일 때 ul/ol 내 li 삭제
    if (
      currentBlock.tagName === "LI" &&
      currentBlock.textContent.trim() === ""
    ) {
      const parentEl =
        currentBlock.parentElement.tagName === "UL" ? "ul" : "ol";
      deleteListItem(parentEl);
    }
  }
});

// 커서를 마지막에 위치시키는 함수
function setCaretToEnd(element) {
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}
// 텍스트 입력 처리시 반응하는 이벤트 리스너
document.querySelector("#editor").addEventListener(
  "input",
  debounce(async function (e) {
    const currentBlock = document.activeElement;
    const titleInput = document.getElementById("title-input");
    const pathname = window.location.pathname;
    const id = pathname.split("/").pop();

    if (e.target === titleInput) {
      await handleUpdateDoc(
        id,
        JSON.stringify({ title: e.target.value.trim() })
      ).then(() => makePathDir(id));
      const targetA = document.querySelector(`a[data-url="${id}"]`);
      targetA.textContent = e.target.value.trim();
    } else if (
      e.target.parentElement &&
      document.getElementById("text-container")
    ) {
      await handleUpdateDoc(
        id,
        JSON.stringify({
          content: document.getElementById("text-container").innerHTML.trim(),
        })
      );
    }

    // 텍스트 블록 내에서만 처리
    if (currentBlock && currentBlock.classList.contains("text-block")) {
      const textContent = currentBlock.textContent;

      // Markdown 인식 (트리거 인식)
      if (e.data === " ") {
        if (textContent.startsWith("###") && textContent.length >= 4) {
          // '### ' -> h3
          convertToHeaderBlock(currentBlock, "h4", 4);
        } else if (textContent.startsWith("##") && textContent.length >= 3) {
          // '## ' -> h2
          convertToHeaderBlock(currentBlock, "h3", 3);
        } else if (textContent.startsWith("#") && textContent.length >= 2) {
          // '# ' -> h1
          convertToHeaderBlock(currentBlock, "h2", 2);
        } else if (/^\d+\./.test(textContent.trim())) {
          // Ordered list 처리 (숫자 목록 처리)
          createNewOlItem(currentBlock); // createNewOlItem로 변경
        } else if (
          (textContent.startsWith("-") ||
            textContent.startsWith("*") ||
            textContent.startsWith("+")) &&
          textContent.length >= 2
        ) {
          // Unordered list 처리
          createNewUlItem(currentBlock);
        } else if (
          textContent.trim().length >= 3 &&
          /^-+$/.test(textContent.trim())
        ) {
          // 구분선 처리
          createHorizontalRule(currentBlock);
        }
      }
    }
  }, 100)
);

// 텍스트 에디터 시작시 새로운 텍스트 블록을 자동으로 생성

function startTextEditor() {
  const newTextBlock = createNewEditableBlock("div");
  document.getElementById("text-container").prepend(newTextBlock);
  newTextBlock.focus();
}

// 새로운 텍스트 블록 생성 함수 (추가와 포커스)
// 이 커렌트 블록은 매개변수로 받고 인수로 전달해야 맞는 것이다!
function addDefaultBlock(currentBlock) {
  const newTextBlock = createNewEditableBlock("div");
  currentBlock.parentNode.insertBefore(newTextBlock, currentBlock.nextSibling);
  newTextBlock.focus();
}

// Markdown 형식으로 변환 (트리거 인식후 변환)

function convertToHeaderBlock(block, headerTag, sliceLength) {
  const remainingText = block.textContent.slice(sliceLength); // Markdown 기호 제거
  const headerBlock = createNewEditableBlock(headerTag);
  headerBlock.textContent = remainingText;
  headerBlock.classList.add("text-block");

  block.replaceWith(headerBlock);
  headerBlock.contentEditable = "true";
  headerBlock.focus();
}

function createNewUlItem(block) {
  // <li> 태그로 사용할 새로운 목록 항목 생성
  const newListItem = document.createElement("li");
  newListItem.contentEditable = "true";
  newListItem.textContent = block.textContent.trim().slice(2); // 기존 텍스트에서 Markdown 기호 제거

  // 새로 생성된 <ul> 태그에 <li> 항목 추가
  const newListhead = document.createElement("ul");
  newListhead.appendChild(newListItem);

  // 기존 블록을 <ul>로 감싸인 <li>로 대체
  block.replaceWith(newListhead);

  // 새 목록 항목을 편집 가능하게 설정하고 포커스 이동

  newListItem.focus();
}

function createNewOlItem(block) {
  // <ol> 태그를 생성하고 <li> 항목을 추가
  const newListhead = document.createElement("ol");
  const newListItem = document.createElement("li");

  // <ol> 안에 새로운 <li> 항목 추가
  newListhead.appendChild(newListItem);

  // 기존 블록을 <ol>로 감싸인 <li>로 대체
  block.replaceWith(newListhead);

  // 기존 텍스트에서 숫자와 마침표 제거 후 <li>에 텍스트 설정
  newListItem.textContent = block.textContent
    .trim()
    .slice(block.textContent.indexOf(".") + 1)
    .trim();

  // 새 목록 항목을 편집 가능하게 설정하고 포커스 이동
  newListItem.contentEditable = "true";
  newListItem.focus();
}

// 리스트 블록 다음 Enter 치면 li 블록이 이어지는 함수

function continueLiBlock(parentEl) {
  const newListItem = document.createElement("li"); // 새로운 li 생성
  newListItem.contentEditable = "true"; // 새 li를 편집 가능하게 설정
  parentEl.appendChild(newListItem); // ul/ol의 자식으로 새 li를 추가
  newListItem.focus(); // 새 li에 포커스를 이동
}

///////////////////////////// /////////////
// li 요소를 지우고 기본 블록으로 바꾸는 함수

function deleteListItem(parentEl) {
  // 1. 기본 변수 세팅: 현재 li의 부모 엘리먼트 + ul 또는 ol 다음 형제 요소 + 부모 리스트의 이전 형제 요소
  // 여기 currentBlock은 있어야 한다..!
  const currentBlock = document.activeElement;
  const parentList = currentBlock.closest(parentEl);

  // 2. 기본 블록 만들어서 지워진 li 블록 대체
  // 새로운 기본 블록 생성
  const newTextBlock = createNewEditableBlock("div");

  // li 블록을 대체
  currentBlock.replaceWith(newTextBlock);
  // parentList의 다음 형제로 삽입
  if (parentList.nextSibling) {
    parentList.parentNode.insertBefore(newTextBlock, parentList.nextSibling);
  } else {
    parentList.parentNode.appendChild(newTextBlock);
  }

  // 새로운 블록에 포커스 이동
  newTextBlock.focus();
  setCaretToEnd(newTextBlock);

  // 부모 요소에 li가 남아있지 않으면
  if (parentList.querySelectorAll("li").length == 0) {
    parentList.remove();
    newTextBlock.focus();
    setCaretToEnd(newTextBlock);
  }
}
// 구분선 생성 함수
function createHorizontalRule(block) {
  const hrBlock = createNewEditableBlock("hr");
  block.replaceWith(hrBlock);

  const newTextBlock = document.createElement("div");
  newTextBlock.classList.add("text-block");
  newTextBlock.contentEditable = "true";

  hr.parentNode.insertBefore(newTextBlock, hr.nextSibling);

  newTextBlock.focus();
  setCaretToEnd(newTextBlock);
}
