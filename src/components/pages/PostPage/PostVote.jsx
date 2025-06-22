import { useState, useEffect } from "react";
import { Button, message, Tooltip } from "antd";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import api from "@/services/api/axios";
import { useAuthContext } from "@/contexts/AuthContext";

export default function PostVote({ postId, initialUpvotes = 0, initialDownvotes = 0 }) {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [vote, setVote] = useState(null); // 'upvote' | 'downvote' | null
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);

  // Lấy trạng thái vote hiện tại của user
  useEffect(() => {
    if (!user) return;
    api.get(`/vote/post/${postId}/vote`).then(res => {
      if (res.data.success) {
        setVote(res.data.vote);
        setUpvotes(res.data.upvotes || 0);
        setDownvotes(res.data.downvotes || 0);
      }
    });
    // eslint-disable-next-line
  }, [postId, user]);

  const handleVote = async (type) => {
    if (!user) {
      message.error("Vui lòng đăng nhập để vote!");
      return;
    }
    setLoading(true);
    try {
      if (vote === type) {
        // Bỏ vote
        await api.delete(`/vote/post/${postId}/vote`);
        setVote(null);
        const res = await api.get(`/vote/post/${postId}/vote`);
        setUpvotes(res.data.upvotes || 0);
        setDownvotes(res.data.downvotes || 0);
        message.success("Đã bỏ vote!");
      } else {
        await api.post(`/vote/post/${postId}/${type}`);
        setVote(type);
        const res = await api.get(`/vote/post/${postId}/vote`);
        setUpvotes(res.data.upvotes || 0);
        setDownvotes(res.data.downvotes || 0);
        message.success(type === "upvote" ? "Upvote thành công!" : "Downvote thành công!");
      }
    } catch (err) {
      message.error("Lỗi vote. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      gap: 8,
      margin: "12px 0",
      width: '100%',
      justifyContent: 'flex-start',
    }}>
      <Tooltip title={vote === "upvote" ? "Bỏ Upvote" : "Upvote"}>
        <Button
          icon={<LikeOutlined />}
          type={vote === "upvote" ? "primary" : "default"}
          onClick={() => handleVote("upvote")}
          loading={loading}
          disabled={loading}
          style={{
            flex: "1 1 0",
            minWidth: 0,
            width: "50%",
            justifyContent: 'center',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 6,
            fontWeight: 500
          }}
        >
          {upvotes}
        </Button>
      </Tooltip>
      <Tooltip title={vote === "downvote" ? "Bỏ Downvote" : "Downvote"}>
        <Button
          icon={<DislikeOutlined />}
          type={vote === "downvote" ? "primary" : "default"}
          onClick={() => handleVote("downvote")}
          loading={loading}
          disabled={loading}
          style={{
            flex: "1 1 0",
            minWidth: 0,
            width: "50%",
            justifyContent: 'center',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 6,
            fontWeight: 500
          }}
        >
          {downvotes}
        </Button>
      </Tooltip>
    </div>
  );
}