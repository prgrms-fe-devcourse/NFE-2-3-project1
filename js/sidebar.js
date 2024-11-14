"use strict";

import { handleCreateDoc, handleDeleteDoc } from "./client.js";

import { loadTextEditor, loadSidebarDocs } from "./utils.js";

const sidebarItems = document.querySelector(".sidebar-nav ul");
const addDocBtn = document.querySelector("#createDocBtn");

// 뒤로 가기/앞으로 가기 시 페이지 로드 처리
window.addEventListener("popstate", function (event) {
  const id = event.state?.page || "Content";
  loadTextEditor(id); // ID값에 맞는 콘텐츠 로드
});

// 부모 문서 추가 (문서 추가 시 사이드바에 표시)
addDocBtn.addEventListener("click", async () => {
  await handleCreateDoc(JSON.stringify({ title: "새 페이지", parent: null }));
  loadSidebarDocs(); // 모든 문서 다시 로드
});

// 페이지 로드 시 문서들을 가져오는 코드
window.onload = async function () {
  await loadSidebarDocs();
};

// 유틸리티 함수: 로컬 스토리지에서 배열 데이터를 관리
const updateLocalStorageArray = (key, value, shouldAdd) => {
  const storedData = localStorage.getItem(key);
  const dataArray = storedData ? JSON.parse(storedData) : [];

  const updatedArray = shouldAdd
    ? [...dataArray, value]
    : dataArray.filter((item) => item !== value);

  localStorage.setItem(key, JSON.stringify(updatedArray));
};

// 핸들러: 토글 버튼 클릭
const handleToggleClick = (li, parentId) => {
  li.classList.toggle("close");
  const isClosed = li.classList.contains("close");
  updateLocalStorageArray("closeArr", parentId, isClosed);
};

// 핸들러: 하위 페이지 추가
const handleAddClick = async (parentId) => {
  await handleCreateDoc(
    JSON.stringify({ title: "하위 페이지", parent: parentId })
  );
  loadSidebarDocs(); // 모든 문서 다시 로드
};

// 핸들러: 페이지 삭제
const handleRemoveClick = async (parentId) => {
  await handleDeleteDoc(parentId);
  loadSidebarDocs(); // 모든 문서 다시 로드
};

// 메인 이벤트 리스너
sidebarItems.addEventListener("click", async (e) => {
  e.preventDefault();
  const target = e.target;
  const li = target.closest("li");
  const parentLink = li.querySelector("a");
  const parentId = parentLink ? parentLink.dataset.url : null;

  if (!parentId) return;
  if (target.classList.contains("sidebar-item-toggle")) {
    handleToggleClick(li, parentId);
  } else if (target.classList.contains("sidebar-item-add")) {
    await handleAddClick(parentId);
  } else if (target.classList.contains("sidebar-item-remove")) {
    await handleRemoveClick(parentId);
  } else if (target.tagName === "A") {
    const id = target.dataset.url;
    history.pushState({ page: id }, "", `/documents/${id}`);
    loadTextEditor(id);
  }
});
