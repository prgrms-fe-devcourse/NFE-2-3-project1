"use strict";
// ** Notion 이름짓기 */
const propMsg = "노션방 이름을 지어주세요.";
const result = window.prompt(propMsg, "");
console.log(result);
const title = document.getElementById("logo");
title.textContent = `${result || "아무개"}의 Notion`;
