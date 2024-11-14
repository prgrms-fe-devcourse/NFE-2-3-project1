import { request } from "../../api/api.js";
import { loadTitles } from "../../spa/spa.js";
import { getPostData } from "./getPostData.js";

export const upDatePost = async (data, postId) => {
  const response = await request(
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    postId
  );
  console.log(response);
};

// 제목과 내용 업데이트하는 함수
export const postTitleContentUpdate = async (postId) => {
  const mainTitleInputEl = document.querySelector(".titleInput");
  const mainContentInputEl = document.querySelector(".contentInput");

  // 저장 완료 박스
  const saveBoxEl = document.querySelector(".save__box");

  // 메인 제목부분 실시간 저장
  let timeOutTitleFn;

  const oldPElement = document.querySelector(".subLinks__title");

  mainTitleInputEl.addEventListener("input", (e) => {
    // 제목 부분 data
    const titleData = {
      title: !e.target.value.length ? "제목 없음" : e.target.value.trim(),
    };

    clearTimeout(timeOutTitleFn);

    timeOutTitleFn = setTimeout(async () => {
      await upDatePost(titleData, postId);
      // 클래스 추가
      // 추가
      saveBoxEl.classList.add("on");
      console.log(titleData);

      const response = await getPostData(postId);
      console.log(response);
      console.log("끝");
      // 추가
      setTimeout(() => {
        saveBoxEl.classList.remove("on");
      }, 2000);
      loadTitles();

      const pElement = document.createElement("p");
      pElement.classList.add("subLinks__title"); // p 태그에 클래스 추가 (필요할 경우)
      pElement.textContent = `${response.title}의 하위 문서`;

      if (oldPElement && oldPElement.parentNode) {
        oldPElement.parentNode.replaceChild(pElement, oldPElement);
      }
    }, 2000);
  });

  // 메인 글 부분 실시간 저장
  let timeOutContentFn;

  mainContentInputEl.addEventListener("input", (e) => {
    // 글 부분 Data
    const contentData = {
      content: !e.target.value.length ? "내용 없음" : e.target.value.trim(),
    };

    clearTimeout(timeOutContentFn);

    timeOutContentFn = setTimeout(async () => {
      await upDatePost(contentData, postId);
      // 추가
      saveBoxEl.classList.add("on");
      console.log(contentData);
      // 추가
      setTimeout(() => {
        saveBoxEl.classList.remove("on");
      }, 2000); // 2초 뒤에 "on" 클래스 제거
    }, 3000);
  });
};
