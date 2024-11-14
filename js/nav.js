const ListItem__pageLink = document.querySelectorAll(".ListItem__pageLink");

ListItem__pageLink.forEach((list) => {
  list.addEventListener("click", function (e) {
    e.preventDefault();
    const url = e.currentTarget.dataset.url;
    console.log(url);
  });
});
