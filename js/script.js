import { getData } from "./getdata.js";
getData().then((data) => {
  console.log(data);
});

function hideMenuToggle() {
  const selectUser = document.querySelector(".selectUser");
  const selectUser__hideMenuBox = document.querySelector(
    ".selectUser__hideMenuBox"
  );
  selectUser.addEventListener("click", function () {
    selectUser__hideMenuBox.classList.toggle("on");
  });
}
hideMenuToggle();

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
