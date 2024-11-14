export const API_KEY = "https://kdt-api.fe.dev-cos.com/documents/";

export const request = async (options, postId = "") => {
  try {
    const response = await fetch(`${API_KEY}${postId}`, {
      ...options,
      headers: {
        "x-username": "isix",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("API 오류");

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};
