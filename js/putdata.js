//putdata.js

export async function editContent(id, title, content) {
  const data = await fetch(`https://kdt-api.fe.dev-cos.com/documents/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-username": "other",
    },
    body: JSON.stringify({
      title,
      content,
    }),
  });
  const parse = await data.json();
  return parse;
}
