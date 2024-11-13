export async function getData() {
  const data = await fetch("https://kdt-api.fe.dev-cos.com/documents", {
    headers: {
      "x-username": "team6",
    },
  });
  const parse = await data.json();
  return parse;
}

export async function getContent(id) {
  const data = await fetch(`https://kdt-api.fe.dev-cos.com/documents/${id}`, {
    headers: {
      "x-username": "team6",
    },
  });
  const parse = await data.json();
  return parse;
}