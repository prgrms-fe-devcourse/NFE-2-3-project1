import { request } from "../../api/api.js";

export async function bread(getPostId) {
  // api 데이터
  const postData = await request({ method: "GET" });
  // console.log(postData);

  //data 경로 탐색
  function findId(postData, targetId, path = []) {
    for (const post of postData) {
      // 탈출 조건: 현재 데이터의 id가 목표 id와 일치하면 타이틀 반환
      if (post.id === targetId) return [...path, post.title];

      // documents 배열 탐색하여 재귀 호출
      if (post.documents) {
        const result = findId(post.documents, targetId, [...path, post.title]);
        if (result) return result; // 목표 ID를 찾으면 결과 반환
      }
    }
    return null; // 목표를 찾지 못한 경우
  }

  //배열값 3개만 가져와서 표시
  const pathTitle = (postId) => {
    const path = findId(postData, postId);
    if (path.length === 1) {
      return path;
    } else {
      return path.slice(-3).map((v) => {
        //5자 말줄임표로 하기로 했는데 공간이 많이 남아서 7로 했어요!
        return v.length > 7 ? `${v.slice(0, 7)}...` : v;
      });
    }
  };

  return pathTitle(Number(getPostId));
}

// console.log(pathTitle(139656));
