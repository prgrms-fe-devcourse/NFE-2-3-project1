// editor.js
const renderEditor = (doc) => {
  console.log(`문서 내용 : `, doc);

  const displayDocumentContent = (doc) => {
    const docTitleInput = document.getElementById("doc-title__input");
    const docContents = document.getElementById("doc-contents");

    if (!doc) {
      console.error("문서 내용이 존재하지 않습니다.");
      return;
    }

    // 문서 제목과 내용 표시
    docTitleInput.value = doc.title || "제목 없음";
    docContents.value = doc.content || "아름다운 글을 작성해보세요!!";
  };

  displayDocumentContent(doc);
};

export default renderEditor;
