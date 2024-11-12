import { getData } from "./getdata.js";
getData().then((data) => {
  console.log(data);
});
function hideMenuToggle() {
  const selectUser = document.querySelector(".selectUser");
  const hideMenuBox = document.querySelector(".hideMenuBox");
  selectUser.addEventListener("click", function () {
    hideMenuBox.classList.toggle("on");
  });
}
hideMenuToggle();

function personalPageToggle() {
  const personalPage__toggleBtn = document.querySelector(
    ".personalPage__toggleBtn"
  );
  const personalPage__PageList = document.querySelector(
    ".personalPage__PageList"
  );
  personalPage__toggleBtn.addEventListener("click", function () {
    personalPage__PageList.classList.toggle("on");
  });
}
personalPageToggle();
// async function getData() {
//   const data = await fetch("https://kdt-api.fe.dev-cos.com/documents", {
//     headers: {
//       "x-username": "team6",
//     },
//   });
//   const parse = await data.json();
//   console.log(parse);
// }
// getData();
// try {
//   getData().then((data) => {
//     data.forEach((e) => {
//       const titleEl = document.createElement("");
//     });
//   });
// } catch (error) {
//   console.log("fetch error");
// }

// class App {
//   constructor() {
//     this.data = null;
//     this.init();
//   }
//   async init() {
//     await this.getData();
//     this.render();
//   }
//   async getData() {
//     const data = await fetch("https://kdt-api.fe.dev-cos.com/documents", {
//       headers: {
//         "x-username": "team6",
//       },
//     });
//     this.data = await data.json();
//   }
//   render() {
//     document.getElementById("result").textContent = JSON.stringify(this.data);
//   }
// }
// new App();
