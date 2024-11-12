export async function getData() {
  const data = await fetch("https://kdt-api.fe.dev-cos.com/documents", {
    headers: {
      "x-username": "team6",
    },
  });
  const parse = await data.json();
  return parse;
}
