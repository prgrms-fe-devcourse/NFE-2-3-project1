export async function editContent(id, title, content) {
  const data = await fetch(`https://kdt-api.fe.dev-cos.com/documents/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-username": "team6",
    },
    body: JSON.stringify({
      title,
      content,
    }),
  });
  const parse = await data.json();
  return parse;
}
