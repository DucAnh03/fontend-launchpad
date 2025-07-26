import React, { useState, useEffect } from "react";
import {
  List,
  Card,
  Avatar,
  Button,
  Input,
  message,
  Spin,
  Typography,
  Space,
  Tooltip,
  Divider,
  Empty,
} from "antd";
import {
  LikeOutlined,
  DislikeOutlined,
  MessageOutlined,
  DeleteOutlined,
  SendOutlined,
  LikeFilled,
  DislikeFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useAuthContext } from "@/contexts/AuthContext";
import { commentService } from "@/services/api/comments/commentService";

const { TextArea } = Input;
const { Text } = Typography;

// Comment API functions - sử dụng commentService
const commentAPI = commentService;

// Comment Item Component
const CommentItem = ({
  comment,
  onReply,
  onVote,
  onDelete,
  currentUser,
  level = 0,
}) => {
  const [userVote, setUserVote] = useState(null);
  const [voteData, setVoteData] = useState({
    upvotes: comment.upvotes || 0,
    downvotes: comment.downvotes || 0,
  });
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    if (currentUser && comment._id) {
      fetchUserVote();
    }
  }, [comment._id, currentUser]);

  const fetchUserVote = async () => {
    try {
      const result = await commentAPI.getUserVote(comment._id);
      if (result.success) {
        setUserVote(result.vote);
        setVoteData({
          upvotes: result.upvotes,
          downvotes: result.downvotes,
        });
      }
    } catch (error) {
      console.error("Error fetching user vote:", error);
    }
  };

  const handleVote = async (voteType) => {
    if (!currentUser) {
      message.warning("Vui lòng đăng nhập để vote");
      return;
    }

    try {
      let result;
      if (voteType === "upvote") {
        result = await commentAPI.upvoteComment(comment._id);
      } else {
        result = await commentAPI.downvoteComment(comment._id);
      }

      if (result.success) {
        setUserVote(result.vote);
        setVoteData({
          upvotes: result.upvotes,
          downvotes: result.downvotes,
        });
        if (onVote) onVote(comment._id, result);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi vote");
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) {
      message.warning("Vui lòng nhập nội dung phản hồi");
      return;
    }

    setSubmittingReply(true);
    try {
      await onReply(comment._id, replyContent);
      setReplyContent("");
      setShowReplyInput(false);
      message.success("Đã gửi phản hồi thành công");
    } catch (error) {
      message.error("Có lỗi xảy ra khi gửi phản hồi");
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleDelete = async () => {
    try {
      await commentAPI.deleteComment(comment._id);
      if (onDelete) onDelete(comment._id);
      message.success("Đã xóa bình luận");
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa bình luận");
    }
  };

  const canDelete =
    currentUser &&
    (currentUser._id === comment.authorId?._id || currentUser.role === "admin");

  return (
    <div className={`comment-item ${level > 0 ? "ml-8" : ""}`}>
      <div className="flex gap-3 p-4 bg-white rounded-lg border border-gray-100">
        <Avatar src={comment.authorId?.avatar?.url} size={level > 0 ? 32 : 40}>
          {comment.authorId?.name?.[0]}
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Text strong className="text-gray-900">
              {comment.authorId?.name || "Unknown User"}
            </Text>
            <Text type="secondary" className="text-xs">
              {dayjs(comment.createdAt).format("DD/MM/YYYY HH:mm")}
            </Text>
          </div>

          <div className="mb-3">
            <Text className="whitespace-pre-wrap">{comment.content}</Text>
          </div>

          <div className="flex items-center gap-4">
            <Space>
              <Button
                size="small"
                type="text"
                icon={userVote === "upvote" ? <LikeFilled /> : <LikeOutlined />}
                onClick={() => handleVote("upvote")}
                className={`flex items-center gap-1 ${
                  userVote === "upvote" ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {voteData.upvotes}
              </Button>

              <Button
                size="small"
                type="text"
                icon={
                  userVote === "downvote" ? (
                    <DislikeFilled />
                  ) : (
                    <DislikeOutlined />
                  )
                }
                onClick={() => handleVote("downvote")}
                className={`flex items-center gap-1 ${
                  userVote === "downvote" ? "text-red-600" : "text-gray-500"
                }`}
              >
                {voteData.downvotes}
              </Button>
            </Space>

            {currentUser && (
              <Button
                size="small"
                type="text"
                icon={<MessageOutlined />}
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="text-gray-500 hover:text-blue-600"
              >
                Phản hồi
              </Button>
            )}
          </div>

          {showReplyInput && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <TextArea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Viết phản hồi..."
                rows={3}
                className="mb-2"
              />
              <div className="flex gap-2 justify-end">
                <Button size="small" onClick={() => setShowReplyInput(false)}>
                  Hủy
                </Button>
                <Button
                  size="small"
                  type="primary"
                  loading={submittingReply}
                  onClick={handleReply}
                  icon={<SendOutlined />}
                >
                  Gửi
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Comments Component
const RecruitmentComments = ({ recruitmentPostId, visible = true }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const { user: currentUser } = useAuthContext();

  useEffect(() => {
    if (visible && recruitmentPostId) {
      fetchComments();
    }
  }, [recruitmentPostId, visible]);

  const fetchComments = async (page = 1) => {
    setLoading(true);
    try {
      const result = await commentAPI.getCommentsByRecruitmentPost(
        recruitmentPostId,
        null,
        page,
        10
      );
      if (result.success) {
        if (page === 1) {
          setComments(result.data.comments);
        } else {
          setComments((prev) => [...prev, ...result.data.comments]);
        }
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      message.error("Không thể tải bình luận");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComment = async () => {
    if (!currentUser) {
      message.warning("Vui lòng đăng nhập để bình luận");
      return;
    }

    if (!newComment.trim()) {
      message.warning("Vui lòng nhập nội dung bình luận");
      return;
    }

    setSubmitting(true);
    try {
      const result = await commentAPI.createComment({
        recruitmentPostId,
        content: newComment,
        parentId: null,
      });

      if (result.success) {
        setNewComment("");
        // Refresh comments to get the new one
        await fetchComments(1);
        message.success("Đã gửi bình luận thành công");
      }
    } catch (error) {
      console.error("Error creating comment:", error);
      message.error("Có lỗi xảy ra khi gửi bình luận");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId, content) => {
    try {
      const result = await commentAPI.createComment({
        recruitmentPostId,
        content,
        parentId,
      });

      if (result.success) {
        // Refresh comments to show the new reply
        await fetchComments(1);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleVote = (commentId, voteResult) => {
    // Update local state if needed
    setComments((prev) =>
      prev.map((comment) =>
        comment._id === commentId
          ? {
              ...comment,
              upvotes: voteResult.upvotes,
              downvotes: voteResult.downvotes,
            }
          : comment
      )
    );
  };

  const handleDelete = (commentId) => {
    setComments((prev) => prev.filter((comment) => comment._id !== commentId));
  };

  const loadMoreComments = () => {
    if (pagination.page < pagination.totalPages) {
      fetchComments(pagination.page + 1);
    }
  };

  if (!visible) return null;

  return (
    <div className="recruitment-comments bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MessageOutlined className="mr-2 text-blue-600" />
          Bình luận ({pagination.total})
        </h3>

        {/* Comment Input */}
        {currentUser ? (
          <div className="comment-input-section">
            <div className="flex gap-3 mb-4">
              <Avatar src={currentUser.avatar?.url} size={40}>
                {currentUser.name?.[0]}
              </Avatar>
              <div className="flex-1">
                <TextArea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Viết bình luận của bạn..."
                  rows={3}
                  className="mb-2"
                />
                <div className="flex justify-end">
                  <Button
                    type="primary"
                    loading={submitting}
                    onClick={handleCreateComment}
                    icon={<SendOutlined />}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none rounded-full px-6"
                  >
                    Gửi bình luận
                  </Button>
                </div>
              </div>
            </div>
            <Divider />
          </div>
        ) : (
          <div className="text-center p-4 bg-gray-50 rounded-lg mb-4">
            <Text type="secondary">
              Vui lòng đăng nhập để tham gia bình luận
            </Text>
          </div>
        )}

        {/* Comments List */}
        <div className="comments-list">
          {loading && comments.length === 0 ? (
            <div className="text-center py-8">
              <Spin size="large" />
              <div className="mt-2">
                <Text type="secondary">Đang tải bình luận...</Text>
              </div>
            </div>
          ) : comments.length === 0 ? (
            <Empty
              description="Chưa có bình luận nào"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment._id}
                    comment={comment}
                    onReply={handleReply}
                    onVote={handleVote}
                    onDelete={handleDelete}
                    currentUser={currentUser}
                    level={0}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {pagination.page < pagination.totalPages && (
                <div className="text-center mt-6">
                  <Button
                    type="default"
                    loading={loading}
                    onClick={loadMoreComments}
                    className="rounded-full px-6"
                  >
                    Xem thêm bình luận
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruitmentComments;
