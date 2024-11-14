//getdata.js
// API GET
export async function getData() {
  try {
    const data = await fetch("https://kdt-api.fe.dev-cos.com/documents", {
      headers: {
        "x-username": "other",
      },
    });
    const parse = await data.json();
    return parse;
  } catch (error) {
    const err = "에러발생";
    return err;
  }
}

// API POST
export async function postData(parent = null) {
  try {
    const data = await fetch("https://kdt-api.fe.dev-cos.com/documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-username": "other",
      },
      body: JSON.stringify({
        title: "추가할게요",
        parent: parent,
      }),
    });
    const parse = await data.json();
    console.log(parse);
    return parse;
  } catch (error) {
    const err = "에러발생";
    return err;
  }
}

// API DELETE
export async function delData(targetId) {
  try {
    const data = await fetch(
      `https://kdt-api.fe.dev-cos.com/documents/${targetId}`,
      {
        method: "DELETE",
        headers: {
          "x-username": "other",
        },
      }
    );
    const parse = await data.json();
    return parse;
  } catch (error) {
    const err = "에러발생";
    return err;
  }
}

export async function getContent(id) {
  const data = await fetch(`https://kdt-api.fe.dev-cos.com/documents/${id}`, {
    headers: {
      "x-username": "other",
    },
  });
  const parse = await data.json();
  return parse;
}
