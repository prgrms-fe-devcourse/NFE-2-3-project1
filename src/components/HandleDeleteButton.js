export const deleteBtnHandler = () => {
  const deleteBtn = document.getElementById("breadCrumb__deleteButton");
  const currentDocId = window.location.pathname;
  const onDeleteBynClick = (DocId) => {
    console.log(DocId);
  };
  deleteBtn.addEventListener("click", () => {
    onDeleteBynClick(currentDocId);
  });
};

deleteBtnHandler();
