// components/Community/PostsList.jsx
import React, { useState, useEffect } from "react";
import api from "@/services/api/axios";
import PostCard from "@/components/Community/PostCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function PostsList({
  selectedProject,
  feedMode = false,
  searchQuery = "",
  searchMode = false,
  onStatsChange,
}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    loadPosts();
  }, [selectedProject, searchQuery, pagination.page]);

  const loadPosts = async () => {
    setLoading(true);
    setError("");

    try {
      let url;
      let params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (searchMode && searchQuery) {
        // Search mode
        url = "/communities/search";
        params.q = searchQuery;
        params.type = "posts";
        if (selectedProject) {
          params.projectId = selectedProject;
        }
      } else if (feedMode) {
        // Feed mode - get posts from all user's projects
        url = "/communities/feed";
      } else {
        // Posts mode - get posts by project
        url = "/communities/posts";
        if (selectedProject) {
          params.projectId = selectedProject;
        }
      }

      const res = await api.get(url, { params });

      if (res.data.success) {
        if (searchMode) {
          setPosts(res.data.data.posts || []);
          setPagination((prev) => ({
            ...prev,
            total: res.data.data.posts?.length || 0,
            totalPages: Math.ceil(
              (res.data.data.posts?.length || 0) / prev.limit
            ),
          }));
        } else {
          setPosts(res.data.data.posts || []);
          setPagination((prev) => ({
            ...prev,
            ...res.data.data.pagination,
          }));
        }
      }
    } catch (err) {
      console.error("Error loading posts:", err);
      setError("Không thể tải bài viết");
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const res = await api.post(`/communities/posts/${postId}/like`);
      if (res.data.success) {
        // Update post in list
        setPosts((prev) =>
          prev.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  likes: post.likes.includes(res.data.userId)
                    ? post.likes.filter((id) => id !== res.data.userId)
                    : [...post.likes, res.data.userId],
                }
              : post
          )
        );
        onStatsChange?.();
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handlePinPost = async (postId) => {
    try {
      const res = await api.post(`/communities/posts/${postId}/pin`);
      if (res.data.success) {
        // Refresh posts to show pin status
        loadPosts();
        onStatsChange?.();
      }
    } catch (error) {
      console.error("Error pinning post:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      return;
    }

    try {
      const res = await api.delete(`/communities/posts/${postId}`);
      if (res.data.success) {
        setPosts((prev) => prev.filter((post) => post._id !== postId));
        onStatsChange?.();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const loadMore = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  if (loading && posts.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-400 to-orange-400 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadPosts}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (posts.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {searchMode ? "Không tìm thấy bài viết" : "Chưa có bài viết nào"}
        </h3>
        <p className="text-gray-500">
          {searchMode
            ? `Không có bài viết nào khớp với "${searchQuery}"`
            : "Hãy tạo bài viết đầu tiên để chia sẻ với team!"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Posts grid */}
      <div className="grid gap-6">
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onLike={handleLikePost}
            onPin={handlePinPost}
            onDelete={handleDeletePost}
          />
        ))}
      </div>

      {/* Load more */}
      {pagination.page < pagination.totalPages && (
        <div className="text-center py-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-8 py-3 rounded-full font-medium shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Đang tải...
              </div>
            ) : (
              `Xem thêm (${pagination.total - posts.length} bài viết)`
            )}
          </button>
        </div>
      )}

      {/* Pagination info */}
      {posts.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Hiển thị {posts.length} / {pagination.total} bài viết
        </div>
      )}
    </div>
  );
}
