import { BASE_URL, x_username } from "../constants/urls.js";

export const getRootDocuments = async () => {
  try {
    const response = await fetch(BASE_URL, {
      headers: {
        "x-username": x_username,
      },
    });
    if (!response.ok) throw new Error("document 불러오기 실패");
    return await response.json();
  } catch (error) {
    console.error("Document 불러오기 실패:", error);
  }
};

export const getTargetContent = async (docId) => {
  try {
    const response = await fetch(`${BASE_URL}/${docId}`, {
      headers: {
        "x-username": x_username,
      },
    });
    if (!response.ok) throw new Error("document 불러오기 실패");
    return await response.json();
  } catch (error) {
    console.error("Document 불러오기 실패:", error);
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

    if (!response.ok) throw new Error("Document 생성에 실패했습니다.");
    return await response.json();
  } catch (error) {
    console.error("Document 생성 중 오류 발생:", error);
  }
};

export const initializeDocumentContent = async (docId) => {
  try {
    const response = await fetch(`${BASE_URL}/${docId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-username": x_username,
      },
      body: JSON.stringify({ title: "제목", content: "내용" }),
    });
    return response;
  } catch (error) {
    console.error("Document 초기화 중 오류 발생:", error);
  }
};

export const AutoSave = async (docId, title, content) => {
  try {
    const response = await fetch(`${BASE_URL}/${docId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-username": x_username,
      },
      body: JSON.stringify({ title, content }),
    });

    if (!response.ok) throw new Error("document 수정 실패");

    const savedDoc = await response.json();
    console.log("Document 수정됨:", savedDoc);
    return savedDoc;
  } catch (error) {
    console.error("Document 수정 실패:", error);
  }
};
