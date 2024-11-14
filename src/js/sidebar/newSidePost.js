import { navigate, loadTitles } from "../spa/spa.js";

const bottomNewButton = document.querySelector(".newDocumentButton");

const newSidePost = async () => {
  try {
    const upperPost = {
      title: "제목 없음",
      parent: null,
    };
    const response = await fetch("https://kdt-api.fe.dev-cos.com/documents", {
      method: "POST",
      headers: {
        "x-username": "isix",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(upperPost),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    navigate(`/documents/${data.id}`);

    // 도큐먼트 생성하고나서 사이드바 새로 로드
    setTimeout(() => {
      loadTitles();
    }, 0);
    console.log("New Document", data);
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error.message);
  }
};

bottomNewButton.addEventListener("click", newSidePost);
