import { navigate } from "../../spa/spa.js";
import { bread } from "../utils/breadCrumb.js";
import { getPostData } from "../utils/getPostData.js";
import { deletePost } from "../utils/postDelete.js";
import { postTitleContentUpdate } from "../utils/postUpdate.js";

export const posts = async (documentId) => {
  const getMainEl = document.querySelector("main");

  const getPostId = documentId;

  // getPostId는 해당 URL을 가져온 후 뒤에만 잘라내서 getPostData()에 인자로 들어갑니다.
  const response = await getPostData(getPostId);

  console.log("response", response);

  // 하단에 하위 경로를 표시하기 위한 자식 도큐먼트를 가져옵니다.
  const childPosts = await response.documents;

  console.log("child", childPosts);

  // html Main 부분에 들어갑니다.
  getMainEl.innerHTML = `
  <nav class="nav">
  <ul class="breadCrumb">
  </ul>
  <button class="deleteBtn">
  <img src="/assets/trash.svg" alt="쓰레기통" />
  </button>
  </nav>
  <!-- 글 입력창 -->
  <article>
  <div class="save__box">작성 중인 글이 저장되었습니다</div>
  <div>
  <textarea
  class="titleInput"
  placeholder="제목을 입력해 주세요"
  >${response.title}</textarea>
  <textarea
  class="contentInput"
  placeholder="내용을 입력해 주세요"
  >${response.content ? response.content : ""}</textarea>
  </div>
  </article>
  <!-- 하위 문서(고정) -->
  <div class="subLinks">
  <p class="subLinks__title">${response.title}의 하위 문서</p>
  <ul class="subLinks__lists">
  </ul>
  </div>
  `;

  // 추가
  // textarea 자동 높이 조절
  const adjustTextareaHeight = (textareaEl) => {
    textareaEl.style.height = "auto"; // 높이를 초기화
    textareaEl.style.height = `${textareaEl.scrollHeight}px`; // 내용에 맞는 높이로 설정
  };

  const textareaEls = document.querySelectorAll("textarea");

  // 페이지 로드 시 textarea 높이 조절
  textareaEls.forEach((textareaEl) => {
    adjustTextareaHeight(textareaEl);

    // 입력 시 높이 자동 조절
    textareaEl.addEventListener("input", (e) => {
      adjustTextareaHeight(e.target);

      if (e.target.value.length === 0) {
        e.target.style.height = "90px"; // 초기화 높이 설정
      }
    });
  });

  // 글 제목, 내용 실시간 업데이트 함수
  postTitleContentUpdate(getPostId);

  // 파일 경로 상단 nav

  const pathArr = await bread(getPostId);
  console.log(pathArr);
  const breadCrumbCon = document.querySelector(".breadCrumb");

  if (pathArr.length) {
    pathArr.forEach((title) => {
      console.log(title);
      breadCrumbCon.innerHTML += `<li><a href=>${title}</a></li>`;
    });
  }

  // 자식 도큐먼트가 있으면 list를 추가합니다.
  const getSubLinksEl = document.querySelector(".subLinks__lists");

  if (Array.isArray(childPosts) && childPosts.length !== 0) {
    childPosts.forEach((post) => {
      let title = post.title;
      if (title.length > 9) {
        title = `${title.slice(0, 9)}...`;
      }

      getSubLinksEl.innerHTML += `
        <li>
          <a href="/documents/${post.id}" data-id="${post.id}" class="subLinks__lists--link">${title}</a>
        </li>
      `;
    });
  }

  document.querySelectorAll(".subLinks__lists--link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // 기본 링크 동작 막기
      const postId = event.target.getAttribute("data-id");
      navigate(`/documents/${postId}`);
    });
  });

  // 휴지통 클릭하면 삭제
  deletePost(getPostId);
};
