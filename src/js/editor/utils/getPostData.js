import { request } from "../../api/api.js";

export const getPostData = async (postId) => {
  const response = await request({}, postId);
  return response;
};
