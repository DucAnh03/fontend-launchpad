import { useState } from "react";
import { Input, Button, Popconfirm, message } from "antd";
import { DeleteOutlined, LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import api from "@/services/api/axios";
import { useAuthContext } from "@/contexts/AuthContext";

const COMMENTS_LIMIT = 5;
const REPLIES_LIMIT = 5;

// Helper: fetch vote state for a comment
async function getUserVote(commentId) {
  try {
    const res = await api.get(`/comments/${commentId}/vote`);
    if (res.data.success) {
      return { vote: res.data.vote, upvotes: res.data.upvotes, downvotes: res.data.downvotes };
    }
  } catch (err) {}
  return { vote: null, upvotes: 0, downvotes: 0 };
}

export default function CommentSection({ postId }) {
  const { user } = useAuthContext();

  const [commentInputs, setCommentInputs] = useState({});
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [commentPage, setCommentPage] = useState(1);
  const [replies, setReplies] = useState({});
  const [replyPage, setReplyPage] = useState({});
  const [showReplies, setShowReplies] = useState({});
  // Track vote state per comment
  const [commentVotes, setCommentVotes] = useState({}); // { [commentId]: { vote, upvotes, downvotes } }
  const [voteLoading, setVoteLoading] = useState({}); // { [commentId]: bool }

  // Fetch top-level comments
  const fetchComments = async (page = 1) => {
    setLoadingComments(true);
    try {
      const response = await api.get(`/comments/post/${postId}?parentId=null&page=${page}&limit=${COMMENTS_LIMIT}`);
      if (response.data.success) {
        const data = response.data.data;
        setComments(page === 1 ? data : [...comments, ...data]);
        setCommentPage(page);
        // Fetch vote state for new comments
        if (user) {
          for (const c of data) {
            fetchCommentVote(c._id);
          }
        }
      } else {
        message.warning(response.data.message || "Không thể tải bình luận");
      }
    } catch (err) {
      message.error("Không thể tải bình luận");
    } finally {
      setLoadingComments(false);
    }
  };

  // Fetch replies for a comment
  const fetchReplies = async (commentId, page = 1) => {
    try {
      const response = await api.get(`/comments/replies/${commentId}?page=${page}&limit=${REPLIES_LIMIT}`);
      if (response.data.success) {
        setReplies(prev => ({
          ...prev,
          [commentId]: page === 1 ? response.data.data : [...(prev[commentId] || []), ...response.data.data]
        }));
        setReplyPage(prev => ({ ...prev, [commentId]: page }));
        // Fetch vote state for replies
        if (user) {
          for (const r of response.data.data) {
            fetchCommentVote(r._id);
          }
        }
      }
    } catch (err) {
      message.error("Không thể tải phản hồi");
    }
  };

  // Fetch vote state for a comment (or reply)
  const fetchCommentVote = async (commentId) => {
    if (!user) return;
    const res = await getUserVote(commentId);
    setCommentVotes(prev => ({
      ...prev,
      [commentId]: {
        vote: res.vote,
        upvotes: res.upvotes,
        downvotes: res.downvotes,
      }
    }));
  };

  // Submit comment/reply
  const handleCommentSubmit = async () => {
    if (!user) {
      message.error("Vui lòng đăng nhập để bình luận!");
      return;
    }
    const content = commentInputs[postId]?.trim();
    if (!content) return;
    try {
      const parentComment = replyingTo;
      await api.post('/comments', {
        postId,
        content,
        parentId: parentComment?._id || null
      });
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      setReplyingTo(null);
      if (parentComment) {
        fetchReplies(parentComment._id, 1);
      } else {
        fetchComments(1);
      }
      message.success("Bình luận thành công!");
    } catch (err) {
      message.error("Gửi bình luận thất bại!");
    }
  };

  // Delete comment/reply
  const handleDeleteComment = async (comment) => {
    if (!user) {
      message.error("Vui lòng đăng nhập để thực hiện chức năng này!");
      return;
    }
    try {
      await api.delete(`/comments/${comment._id}`);
      message.success("Xóa bình luận thành công!");
      if (comment.parentId) {
        fetchReplies(comment.parentId, 1);
      } else {
        fetchComments(1);
      }
      // Cập nhật lại state vote
      setCommentVotes(prev => {
        const cpy = { ...prev };
        delete cpy[comment._id];
        return cpy;
      });
    } catch (err) {
      message.error("Xóa bình luận thất bại!");
    }
  };

  // Vote comment/reply (vote API mới)
  const handleVote = async (commentId, type, parentId) => {
    if (!user) {
      message.error("Vui lòng đăng nhập để vote!");
      return;
    }
    setVoteLoading(prev => ({ ...prev, [commentId]: true }));
    try {
      const current = commentVotes[commentId] || {};
      // Nếu đã vote kiểu này rồi -> bỏ vote
      if (current.vote === type) {
        await api.delete(`/comments/${commentId}/vote`);
        message.success(`Bỏ ${type === "upvote" ? "Upvote" : "Downvote"} thành công!`);
      } else {
        await api.post(`/comments/${commentId}/${type}`);
        message.success(`${type === "upvote" ? "Upvote" : "Downvote"} thành công!`);
      }
      // Reload vote state from server
      await fetchCommentVote(commentId);
      // Reload comments/replies
      if (parentId) {
        fetchReplies(parentId, 1);
      } else {
        fetchComments(1);
      }
    } catch (err) {
      message.error("Vote thất bại!");
    } finally {
      setVoteLoading(prev => ({ ...prev, [commentId]: false }));
    }
  };

  // Render comment list
  function CommentList() {
    const page = commentPage;
    const canLoadMore = comments.length === page * COMMENTS_LIMIT;
    return (
      <div>
        {comments.map(comment =>
          <CommentItem
            key={comment._id}
            comment={comment}
          />
        )}
        {canLoadMore && (
          <Button
            type="link"
            size="small"
            onClick={() => fetchComments(page + 1)}
            loading={loadingComments}
          >
            Xem thêm bình luận
          </Button>
        )}
      </div>
    );
  }

  // Render single comment/reply (recursive)
  function CommentItem({ comment }) {
    const replyArr = replies[comment._id] || [];
    const page = replyPage[comment._id] || 1;
    const canLoadMore = replyArr.length === page * REPLIES_LIMIT;
    const isRepliesShown = !!showReplies[comment._id];

    // Kiểm tra quyền xóa: user phải tồn tại và là owner của comment
    const isCommentOwner =
      user &&
      (String(user._id) === String(comment.authorId?._id || comment.authorId));

    // Lấy vote state từ state riêng, fallback sang comment
    const voteState = commentVotes[comment._id] || {};
    const upvoted = voteState.vote === "upvote";
    const downvoted = voteState.vote === "downvote";
    const upvotes = voteState.upvotes !== undefined ? voteState.upvotes : comment.upvotes || 0;
    const downvotes = voteState.downvotes !== undefined ? voteState.downvotes : comment.downvotes || 0;

    return (
      <div style={{ marginTop: 8 }}>
        <div className="border-b border-gray-50 py-2 text-sm flex items-start gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center font-semibold">
            {comment.authorId?.name?.charAt(0) || "U"}
          </div>
          <div style={{ flex: 1 }}>
            <div className="font-semibold">{comment.authorId?.name || "Người dùng"}</div>
            <div className="text-gray-700">{comment.content}</div>
            <div className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString('vi-VN')}</div>
            <div className="flex gap-2 items-center mt-1">
              <Button
                icon={<LikeOutlined />}
                size="small"
                type={upvoted ? "primary" : "default"}
                disabled={voteLoading[comment._id]}
                onClick={() => handleVote(comment._id, "upvote", comment.parentId)}
                className="!flex gap-1 items-center border"
                style={{ borderColor: "#d9d9d9", borderRadius: 6, minWidth: 52, justifyContent: "center" }}
              >
                {upvotes}
              </Button>
              <Button
                icon={<DislikeOutlined />}
                size="small"
                type={downvoted ? "primary" : "default"}
                disabled={voteLoading[comment._id]}
                onClick={() => handleVote(comment._id, "downvote", comment.parentId)}
                className="!flex gap-1 items-center border"
                style={{ borderColor: "#d9d9d9", borderRadius: 6, minWidth: 52, justifyContent: "center" }}
              >
                {downvotes}
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => setReplyingTo(comment)}
                style={{ padding: 0, height: 22 }}
              >
                Trả lời
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  setShowReplies(prev => ({
                    ...prev,
                    [comment._id]: !prev[comment._id]
                  }));
                  if (!isRepliesShown) fetchReplies(comment._id, 1);
                }}
              >
                {isRepliesShown ? "Ẩn phản hồi" : `Xem phản hồi (${comment.replyCount || 0})`}
              </Button>
              {isCommentOwner && (
                <Popconfirm
                  title="Bạn có chắc muốn xóa bình luận này?"
                  onConfirm={() => handleDeleteComment(comment)}
                  okText="Có"
                  cancelText="Không"
                  placement="bottomRight"
                >
                  <Button
                    icon={<DeleteOutlined />}
                    size="small"
                    type="text"
                    danger
                    style={{ marginLeft: 4 }}
                  />
                </Popconfirm>
              )}
            </div>
            {/* Reply lồng nhau phân trang */}
            {isRepliesShown && replyArr.length > 0 && (
              <div style={{ marginLeft: 24, marginTop: 8 }}>
                {replyArr.map(r =>
                  <CommentItem
                    key={r._id}
                    comment={r}
                  />
                )}
                {canLoadMore && (
                  <Button
                    type="link"
                    size="small"
                    onClick={() => fetchReplies(comment._id, page + 1)}
                  >
                    Xem thêm phản hồi
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Input
          placeholder={replyingTo ? "Phản hồi bình luận..." : "Viết bình luận..."}
          value={commentInputs[postId] || ''}
          onChange={e => 
            setCommentInputs(prev => ({
              ...prev,
              [postId]: e.target.value
            }))
          }
          onPressEnter={handleCommentSubmit}
          className="flex-1"
        />
        <Button
          type="primary"
          onClick={handleCommentSubmit}
          disabled={!commentInputs[postId]?.trim()}
        >
          Gửi
        </Button>
      </div>
      {replyingTo && (
        <div className="mb-2 text-xs text-blue-600">
          Đang trả lời <b>{replyingTo.authorId?.name || "Người dùng"}</b>: "{replyingTo.content}"
          <Button 
            type="link" 
            size="small" 
            style={{ marginLeft: 8, padding: 0, height: 20 }} 
            onClick={() => setReplyingTo(null)}
          >
            Hủy
          </Button>
        </div>
      )}
      <Button
        type="link"
        size="small"
        onClick={() => fetchComments(1)}
        loading={loadingComments}
        className="mb-2"
      >
        {comments.length ? "Làm mới bình luận" : "Xem bình luận"}
      </Button>
      <CommentList />
    </div>
  );
}