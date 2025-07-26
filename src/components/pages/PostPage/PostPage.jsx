import { useRef, useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Card,
  Modal,
  Upload,
  Space,
  Popconfirm,
  Tag,
  Avatar,
  Divider,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  MessageOutlined,
  LikeOutlined,
  DislikeOutlined,
  SendOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import api from "@/services/api/axios";
import { useAuthContext } from "@/contexts/AuthContext";
import axios from "axios";
import { useSocket } from "@/contexts/SocketContext";
import { useNavigate } from "react-router-dom";
import {
  startConversation,
  getMessagesByConversationId,
} from "@/services/api/Chat/chatservice";
import ChatWindow from "@/components/elements/ChatWindow/ChatWindow";

const { TextArea } = Input;

export default function PostPage() {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [form] = Form.useForm();
  const [editingPost, setEditingPost] = useState(null);
  const { user } = useAuthContext();
  const [fileList, setFileList] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [chatWindows, setChatWindows] = useState([]);
  // Comment states
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [comments, setComments] = useState({}); // postId -> comments array
  const [commentTexts, setCommentTexts] = useState({}); // postId -> comment text
  const [commentLoading, setCommentLoading] = useState({});
  const navigate = useNavigate();

  const fetchPosts = async (page = 1, isNewSearch = false) => {
    try {
      setLoading(true);
      let response;

      if (searchKeyword) {
        response = await api.get(
          `/posts/search?keyword=${searchKeyword}&page=${page}&limit=10`
        );
      } else {
        response = await api.get(`/posts?page=${page}&limit=10`);
      }

      if (response.data.success && response.data.data) {
        const newPosts = response.data.data.posts || [];
        const total = response.data.data.pagination.total;

        if (isNewSearch) {
          setPosts(newPosts);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        }

        setHasMore(posts.length + newPosts.length < total);
        setCurrentPage(page);
      }
    } catch (err) {
      message.error(
        err.response?.data?.message || "Không thể tải danh sách bài viết!"
      );
    } finally {
      setLoading(false);
    }
  };

  // Comment Functions
  const fetchComments = async (postId) => {
    try {
      const response = await api.get(`/comments/post/${postId}?limit=10`);
      if (response.data.success) {
        setComments((prev) => ({
          ...prev,
          [postId]: response.data.data.comments,
        }));
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const toggleComments = async (postId) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
      // Fetch comments if not already loaded
      if (!comments[postId]) {
        await fetchComments(postId);
      }
    }
    setExpandedComments(newExpanded);
  };

  const handleCreateComment = async (postId) => {
    if (!user) {
      message.warning("Vui lòng đăng nhập để bình luận");
      return;
    }

    const content = commentTexts[postId];
    if (!content || !content.trim()) {
      message.warning("Vui lòng nhập nội dung bình luận");
      return;
    }

    try {
      setCommentLoading((prev) => ({ ...prev, [postId]: true }));
      const response = await api.post("/comments", {
        postId,
        content: content.trim(),
      });

      if (response.data.success) {
        // Clear comment text
        setCommentTexts((prev) => ({ ...prev, [postId]: "" }));
        // Refresh comments
        await fetchComments(postId);
        message.success("Đã gửi bình luận thành công");
      }
    } catch (error) {
      console.error("Error creating comment:", error);
      message.error("Có lỗi xảy ra khi gửi bình luận");
    } finally {
      setCommentLoading((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    try {
      const response = await api.delete(`/comments/${commentId}`);
      if (response.data.success) {
        // Remove comment from local state
        setComments((prev) => ({
          ...prev,
          [postId]: prev[postId].filter((comment) => comment._id !== commentId),
        }));
        message.success("Đã xóa bình luận");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      message.error("Có lỗi xảy ra khi xóa bình luận");
    }
  };

  const handleVoteComment = async (commentId, voteType, postId) => {
    if (!user) {
      message.warning("Vui lòng đăng nhập để vote");
      return;
    }

    try {
      const response = await api.post(`/comments/${commentId}/${voteType}`);
      if (response.data.success) {
        // Update comment vote counts in local state
        setComments((prev) => ({
          ...prev,
          [postId]: prev[postId].map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  upvotes: response.data.upvotes,
                  downvotes: response.data.downvotes,
                }
              : comment
          ),
        }));
      }
    } catch (error) {
      console.error("Error voting comment:", error);
      message.error("Có lỗi xảy ra khi vote");
    }
  };

  useEffect(() => {
    fetchPosts(1, true);
  }, [user]);

  const handleSearch = async () => {
    setIsSearching(true);
    setCurrentPage(1);
    setPosts([]);
    await fetchPosts(1, true);
    setIsSearching(false);
  };

  const loadMoreData = () => {
    if (!loading && hasMore) {
      fetchPosts(currentPage + 1);
    }
  };

  const onFinish = async (values) => {
    if (!user) {
      message.error("Vui lòng đăng nhập để thực hiện chức năng này!");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);

      if (values.tags) {
        const tagsArray = values.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);
        const tagsJson = JSON.stringify(tagsArray);
        formData.append("tags", tagsJson);
      }

      let mediaUrls = [];
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("images", file.originFileObj);
        } else if (file.url) {
          mediaUrls.push(file.url);
        }
      });

      if (editingPost) {
        formData.append("mediaUrls", JSON.stringify(mediaUrls));
        await api.put(`/posts/${editingPost._id}`, formData);
        message.success("Cập nhật bài viết thành công!");
      } else {
        await api.post("/posts", formData);
        message.success("Tạo bài viết thành công!");
      }

      form.resetFields();
      setFileList([]);
      setEditingPost(null);
      setCurrentPage(1);
      setPosts([]);
      fetchPosts(1, true);
    } catch (err) {
      console.error("Error details:", err.response?.data);
      message.error(
        editingPost ? "Cập nhật thất bại!" : "Tạo bài viết thất bại!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!user) {
      message.error("Vui lòng đăng nhập để thực hiện chức năng này!");
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/posts/${postId}`);
      message.success("Xóa bài viết thành công!");
      setCurrentPage(1);
      setPosts([]);
      fetchPosts(1, true);
    } catch (err) {
      message.error("Xóa bài viết thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post) => {
    if (!user) {
      message.error("Vui lòng đăng nhập để thực hiện chức năng này!");
      return;
    }

    setEditingPost(post);
    form.resetFields();

    const existingImages =
      post.mediaUrls?.map((url, index) => ({
        uid: `-${index}`,
        name: `image-${index}`,
        status: "done",
        url: url,
        thumbUrl: url,
        type: "image/jpeg",
        size: 0,
        response: { url: url },
        xhr: { status: 200 },
      })) || [];

    setFileList(existingImages);
    form.setFieldsValue({
      title: post.title,
      content: post.content,
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
    });
  };

  const handleCancel = () => {
    setEditingPost(null);
    setFileList([]);
    form.resetFields();
  };

  const openChatWithUser = async (otherUser) => {
    try {
      const conv = await startConversation(otherUser._id);
      if (!conv) return;

      setChatWindows((prev) => {
        if (prev.some((c) => c.conv.id === conv._id)) return prev;
        return [
          ...prev,
          {
            conv: {
              id: conv._id,
              name: otherUser.name,
              avatar: otherUser.avatar?.url || "",
              participants: conv.participants,
            },
          },
        ];
      });
    } catch (error) {
      message.error("Không thể mở cuộc trò chuyện!");
    }
  };

  const closeChatWindow = (convId) => {
    setChatWindows((prev) => prev.filter((c) => c.conv.id !== convId));
  };

  const navigateToUserProfile = (userId) => {
    if (userId) {
      navigate(`/profile/id/${userId}`);
    }
  };

  const handleUpvote = async (postId) => {
    try {
      const res = await api.post(`/vote/post/${postId}/upvote`);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, upvotes: res.data.upvotes, downvotes: res.data.downvotes }
            : p
        )
      );
    } catch (err) {
      message.error(err.response?.data?.message || "Upvote thất bại!");
    }
  };

  const handleDownvote = async (postId) => {
    try {
      const res = await api.post(`/vote/post/${postId}/downvote`);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, upvotes: res.data.upvotes, downvotes: res.data.downvotes }
            : p
        )
      );
    } catch (err) {
      message.error(err.response?.data?.message || "Downvote thất bại!");
    }
  };

  // Comment Component
  const CommentItem = ({ comment, postId }) => (
    <div className="flex gap-3 p-3 border-b border-gray-50">
      <Avatar src={comment.authorId?.avatar?.url} size={32}>
        {comment.authorId?.name?.[0]}
      </Avatar>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm text-gray-900">
            {comment.authorId?.name || "Unknown User"}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
          </span>
        </div>

        <p className="text-sm text-gray-700 mb-2">{comment.content}</p>

        <div className="flex items-center gap-4">
          <button
            onClick={() => handleVoteComment(comment._id, "upvote", postId)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600"
          >
            <LikeOutlined />
            {comment.upvotes || 0}
          </button>

          <button
            onClick={() => handleVoteComment(comment._id, "downvote", postId)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600"
          >
            <DislikeOutlined />
            {comment.downvotes || 0}
          </button>

          {user &&
            (user._id === comment.authorId?._id || user.role === "admin") && (
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa bình luận này?"
                onConfirm={() => handleDeleteComment(comment._id, postId)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <button className="text-xs text-red-500 hover:text-red-700">
                  <DeleteOutlined />
                </button>
              </Popconfirm>
            )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
            {editingPost ? "Chỉnh sửa bài viết" : "Bảng tin"}
          </h1>

          {/* Search Bar */}
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Input
                placeholder="Tìm kiếm bài viết..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onPressEnter={handleSearch}
                className="w-full pl-10 pr-4 py-3 rounded-full border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              />
              <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <Button
              type="primary"
              onClick={handleSearch}
              loading={isSearching}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none rounded-full px-6 h-12 shadow-md transition-all duration-200"
            >
              Tìm kiếm
            </Button>
          </div>
        </div>

        {user && (
          <>
            {/* Create Post Button */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0) || "U"}
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex-1 text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-all duration-200"
                >
                  Bạn đang nghĩ gì?
                </button>
                <Button
                  type="primary"
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none rounded-full px-6 shadow-md"
                >
                  Tạo bài
                </Button>
              </div>
            </div>

            {/* Modal Form */}
            {(editingPost || showCreateModal) && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {editingPost
                          ? "Chỉnh sửa bài viết"
                          : "Tạo bài viết mới"}
                      </h3>
                      <button
                        onClick={() => {
                          handleCancel();
                          setShowCreateModal(false);
                        }}
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {user.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.name || "Người dùng"}
                        </div>
                        <div className="text-xs text-gray-500">Công khai</div>
                      </div>
                    </div>

                    <Form
                      form={form}
                      layout="vertical"
                      onFinish={onFinish}
                      className="space-y-4"
                    >
                      <Form.Item
                        name="title"
                        rules={[
                          { required: true, message: "Vui lòng nhập tiêu đề" },
                        ]}
                      >
                        <Input
                          placeholder="Tiêu đề bài viết..."
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                        />
                      </Form.Item>

                      <Form.Item name="content">
                        <Input.TextArea
                          rows={4}
                          placeholder="Bạn đang nghĩ gì?"
                          className="w-full px-4 py-3 border-none focus:ring-0 focus:border-none transition-all duration-200 resize-none"
                          style={{ boxShadow: "none" }}
                        />
                      </Form.Item>

                      <Form.Item name="tags">
                        <Input
                          placeholder="Thêm tags... (ví dụ: học tập, công nghệ)"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                        />
                      </Form.Item>

                      <Form.Item>
                        <Upload
                          listType="picture-card"
                          maxCount={20}
                          beforeUpload={() => false}
                          fileList={fileList}
                          onChange={({ fileList }) => {
                            const updatedFileList = fileList.map((file) => {
                              if (file.originFileObj) {
                                return {
                                  ...file,
                                  url: URL.createObjectURL(file.originFileObj),
                                  thumbUrl: URL.createObjectURL(
                                    file.originFileObj
                                  ),
                                };
                              }
                              return file;
                            });
                            setFileList(updatedFileList);
                          }}
                          className="w-full upload-modern"
                        >
                          <div className="flex flex-col items-center justify-center p-4">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                              <UploadOutlined className="text-blue-500 text-lg" />
                            </div>
                            <div className="text-sm text-gray-600">
                              Thêm ảnh
                            </div>
                          </div>
                        </Upload>
                      </Form.Item>
                    </Form>
                  </div>

                  <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-2xl">
                    <div className="flex items-center justify-end gap-3">
                      <Button
                        onClick={() => {
                          handleCancel();
                          setShowCreateModal(false);
                        }}
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200 px-6 py-2.5 h-auto rounded-full transition-all duration-200"
                      >
                        Hủy
                      </Button>
                      <Form.Item className="mb-0">
                        <Button
                          type="primary"
                          onClick={() => form.submit()}
                          loading={loading}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none text-white px-8 py-2.5 h-auto rounded-full shadow-md transition-all duration-200 font-medium"
                        >
                          {editingPost ? "Cập nhật" : "Đăng bài"}
                        </Button>
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className="space-y-5">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
            {searchKeyword
              ? `Kết quả tìm kiếm cho "${searchKeyword}"`
              : "Bài viết"}
          </h2>

          <InfiniteScroll
            dataLength={posts.length}
            next={loadMoreData}
            hasMore={hasMore}
            loader={
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto"></div>
              </div>
            }
            endMessage={
              <div className="text-center py-6 text-gray-500 text-sm">
                {posts.length > 0
                  ? "Bạn đã xem hết tất cả bài viết"
                  : "Không tìm thấy bài viết nào"}
              </div>
            }
          >
            {posts.map((post) => {
              const commentsExpanded = expandedComments.has(post._id);
              const postComments = comments[post._id] || [];

              return (
                <div
                  key={post._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5 transition-all duration-200 hover:shadow-md"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-200"
                        onClick={() =>
                          navigateToUserProfile(post.authorId?._id)
                        }
                      >
                        {post.authorId?.name?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4
                              className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                              onClick={() =>
                                navigateToUserProfile(post.authorId?._id)
                              }
                            >
                              {post.authorId?.name || "Người dùng"}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {new Date(post.createdAt).toLocaleDateString(
                                "vi-VN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                          <PostMenu
                            onMessage={() => openChatWithUser(post.authorId)}
                            onEdit={() => handleEdit(post)}
                            onDelete={() => handleDelete(post._id)}
                            isOwner={
                              user &&
                              post.authorId &&
                              String(post.authorId._id) === String(user._id)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {post.title}
                    </h3>
                    {post.content && post.content !== "undefined" && (
                      <p className="text-gray-700 mb-4 whitespace-pre-wrap leading-relaxed">
                        {post.content}
                      </p>
                    )}

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, index) => (
                          <Tag
                            key={index}
                            className="bg-blue-50 text-blue-600 border-blue-100 rounded-full px-3 py-1 text-xs font-medium"
                          >
                            #{tag}
                          </Tag>
                        ))}
                      </div>
                    )}

                    {post.mediaUrls?.length > 0 && (
                      <div
                        className={`grid gap-2 mt-4 ${
                          post.mediaUrls.length === 1
                            ? "grid-cols-1"
                            : post.mediaUrls.length === 2
                            ? "grid-cols-2"
                            : post.mediaUrls.length === 3
                            ? "grid-cols-2"
                            : "grid-cols-2 sm:grid-cols-3"
                        }`}
                      >
                        {post.mediaUrls.map((image, index) => {
                          if (post.mediaUrls.length === 3 && index === 0) {
                            return (
                              <div
                                key={index}
                                className="col-span-2 aspect-video relative rounded-xl overflow-hidden"
                              >
                                <img
                                  src={image || "/placeholder.svg"}
                                  alt={`Post image ${index + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                                />
                              </div>
                            );
                          }
                          return (
                            <div
                              key={index}
                              className={`${
                                post.mediaUrls.length === 1
                                  ? "aspect-video"
                                  : "aspect-square"
                              } relative rounded-xl overflow-hidden`}
                            >
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`Post image ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-8 mt-5 pt-4 border-t border-gray-100">
                      <button
                        className="flex flex-col items-center gap-1 text-gray-600 hover:text-green-500 transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-green-50 group"
                        onClick={() => handleUpvote(post._id)}
                      >
                        <svg
                          className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                        <span className="text-xs font-medium">Upvote</span>
                        <span className="text-xs text-gray-400">
                          {post.upvotes || 0}
                        </span>
                      </button>

                      <button
                        className="flex flex-col items-center gap-1 text-gray-600 hover:text-red-500 transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-red-50 group"
                        onClick={() => handleDownvote(post._id)}
                      >
                        <svg
                          className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                        <span className="text-xs font-medium">Downvote</span>
                        <span className="text-xs text-gray-400">
                          {post.downvotes || 0}
                        </span>
                      </button>

                      <button
                        className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-500 transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-blue-50 group"
                        onClick={() => toggleComments(post._id)}
                      >
                        <CommentOutlined className="text-lg group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-xs font-medium">
                          {commentsExpanded ? "Ẩn bình luận" : "Bình luận"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {postComments.length}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {commentsExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50">
                      {/* Comment Input */}
                      {user && (
                        <div className="p-4 border-b border-gray-100 bg-white">
                          <div className="flex gap-3">
                            <Avatar src={user.avatar?.url} size={32}>
                              {user.name?.charAt(0)}
                            </Avatar>
                            <div className="flex-1">
                              <TextArea
                                value={commentTexts[post._id] || ""}
                                onChange={(e) =>
                                  setCommentTexts((prev) => ({
                                    ...prev,
                                    [post._id]: e.target.value,
                                  }))
                                }
                                placeholder="Viết bình luận..."
                                rows={2}
                                className="mb-2"
                              />
                              <div className="flex justify-end">
                                <Button
                                  type="primary"
                                  size="small"
                                  loading={commentLoading[post._id]}
                                  onClick={() => handleCreateComment(post._id)}
                                  icon={<SendOutlined />}
                                  className="bg-blue-500 hover:bg-blue-600"
                                >
                                  Gửi
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Comments List */}
                      <div className="max-h-96 overflow-y-auto">
                        {postComments.length > 0 ? (
                          postComments.map((comment) => (
                            <CommentItem
                              key={comment._id}
                              comment={comment}
                              postId={post._id}
                            />
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500 text-sm">
                            Chưa có bình luận nào
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </InfiniteScroll>
        </div>
      </div>

      {/* Chat Windows */}
      <div className="fixed bottom-4 right-4 flex flex-row-reverse gap-4 z-[9999]">
        {chatWindows.map((c) => (
          <ChatWindow
            key={c.conv.id}
            conv={c.conv}
            onClose={() => closeChatWindow(c.conv.id)}
          />
        ))}
      </div>
    </div>
  );
}

function PostMenu({ onMessage, onEdit, onDelete, isOwner }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
        onClick={() => setOpen((v) => !v)}
        aria-label="Mở menu"
      >
        <svg width={20} height={20} fill="currentColor" viewBox="0 0 20 20">
          <circle cx={4} cy={10} r={2} />
          <circle cx={10} cy={10} r={2} />
          <circle cx={16} cy={10} r={2} />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 z-20">
          <button
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => {
              setOpen(false);
              onMessage();
            }}
          >
            <svg
              className="w-4 h-4 mr-2 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z"
              />
            </svg>
            Nhắn tin
          </button>
          {isOwner && (
            <>
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setOpen(false);
                  onEdit();
                }}
              >
                <svg
                  className="w-4 h-4 mr-2 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L3 10.828a2 2 0 010-2.828l6.586-6.586a2 2 0 012.828 0z"
                  />
                </svg>
                Chỉnh sửa
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
