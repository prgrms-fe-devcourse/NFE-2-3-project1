import { BASE_URL, x_username } from "../constants/urls.js";
// api.js
// API GET 요청으로 문서 목록 가져오기
export const getRootDocuments = async () => {
  try {
    const response = await fetch(BASE_URL, {
      headers: {
        "x-username": x_username,
      },
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const getTargetContent = async (docId) => {
  try {
    const response = await fetch(BASE_URL, {
      headers: {
        "x-username": x_username,
      },
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const postNewDocument = async (title, parentId = null) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "x-username": x_username,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        parent: parentId,
      }),
    });

    if (!response.ok) {
      throw new Error("Document 생성에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Document 생성 중 오류 발생:", error);
    throw error;
  }
};
