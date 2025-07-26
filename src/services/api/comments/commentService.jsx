// @/services/api/comments/commentService.js

import api from "@/services/api/axios";

export const commentService = {
  // Lấy comments cho recruitment post
  getCommentsByRecruitmentPost: async (
    recruitmentPostId,
    parentId = null,
    page = 1,
    limit = 10
  ) => {
    const params = {
      parentId: parentId || "",
      page: page.toString(),
      limit: limit.toString(),
    };

    const response = await api.get(
      `/comments/recruitment-post/${recruitmentPostId}`,
      { params }
    );
    return response.data;
  },

  // Lấy comments cho post thường
  getCommentsByPost: async (postId, parentId = null, page = 1, limit = 10) => {
    const params = {
      parentId: parentId || "",
      page: page.toString(),
      limit: limit.toString(),
    };

    const response = await api.get(`/comments/post/${postId}`, { params });
    return response.data;
  },

  // Lấy replies cho một comment
  getReplies: async (commentId, page = 1, limit = 5) => {
    const params = {
      page: page.toString(),
      limit: limit.toString(),
    };

    const response = await api.get(`/comments/replies/${commentId}`, {
      params,
    });
    return response.data;
  },

  // Tạo comment mới
  createComment: async (data) => {
    const response = await api.post("/comments", data);
    return response.data;
  },

  // Xóa comment
  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },

  // Vote functions
  upvoteComment: async (commentId) => {
    const response = await api.post(`/comments/${commentId}/upvote`);
    return response.data;
  },

  downvoteComment: async (commentId) => {
    const response = await api.post(`/comments/${commentId}/downvote`);
    return response.data;
  },

  removeVote: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}/vote`);
    return response.data;
  },

  getUserVote: async (commentId) => {
    const response = await api.get(`/comments/${commentId}/vote`);
    return response.data;
  },
};
