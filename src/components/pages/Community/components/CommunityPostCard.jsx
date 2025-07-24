import React, { useState } from "react";
import { message } from "antd";
import api from "@/services/api/axios";

// Icons
const LikeIcon = ({ filled = false }) => (
  <svg
    className="w-5 h-5"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const CommentIcon = () => (
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
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z"
    />
  </svg>
);

const ShareIcon = () => (
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
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
    />
  </svg>
);

const MoreIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
  </svg>
);

const PinIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0v-3a3 3 0 013-3h2.75L6.2 7.6A1 1 0 017 6h2z"
      clipRule="evenodd"
    />
  </svg>
);

const CommunityPostCard = ({ post, user }) => {
  const [liked, setLiked] = useState(post.userLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showMenu, setShowMenu] = useState(false);

  const isAuthor = user && post.author && post.author._id === user._id;
  const isAdmin = user && ["admin", "super_admin"].includes(user.role);

  const handleLike = async () => {
    try {
      if (liked) {
        await api.delete(`/communities/posts/${post._id}/like`);
        setLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        await api.post(`/communities/posts/${post._id}/like`);
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Like error:", error);
      message.error("Không thể thực hiện hành động này");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.content,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        message.success("Đã sao chép link!");
      }
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Vừa xong";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} giờ trước`;
    } else {
      return date.toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  };

  return (
    <div className="post-card">
      {/* Header */}
      <div className="post-header">
        <div className="post-author">
          <div className="author-avatar">
            {post.author?.avatar?.url ? (
              <img src={post.author.avatar.url} alt={post.author.name} />
            ) : (
              <div className="avatar-placeholder">
                {post.author?.name?.charAt(0) || "U"}
              </div>
            )}
          </div>

          <div className="author-info">
            <div className="author-name">
              {post.author?.name || "Unknown User"}
              {post.author?.role === "admin" && (
                <span className="admin-badge">✓</span>
              )}
              {post.isPinned && (
                <span className="pin-badge">
                  <PinIcon />
                </span>
              )}
            </div>
            <div className="post-time">{formatDate(post.createdAt)}</div>
          </div>
        </div>

        <div className="post-menu">
          <button
            className="menu-button"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreIcon />
          </button>

          {showMenu && (
            <div className="menu-dropdown">
              {(isAuthor || isAdmin) && (
                <>
                  <button className="menu-item">Chỉnh sửa</button>
                  <button className="menu-item text-red-600">Xóa</button>
                  {isAdmin && (
                    <button className="menu-item">
                      {post.isPinned ? "Bỏ ghim" : "Ghim bài viết"}
                    </button>
                  )}
                </>
              )}
              <button className="menu-item">Báo cáo</button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="post-content">
        <h3 className="post-title">{post.title}</h3>
        {post.content && <p className="post-text">{post.content}</p>}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag, index) => (
              <span key={index} className="post-tag">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div
            className={`post-images ${
              post.images.length === 1 ? "single" : "multiple"
            }`}
          >
            {post.images.slice(0, 4).map((image, index) => (
              <div key={index} className="image-container">
                <img
                  src={image.url}
                  alt={`Post image ${index + 1}`}
                  loading="lazy"
                />
                {post.images.length > 4 && index === 3 && (
                  <div className="image-overlay">+{post.images.length - 4}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="post-actions">
        <button
          className={`action-button ${liked ? "liked" : ""}`}
          onClick={handleLike}
        >
          <LikeIcon filled={liked} />
          <span>{likesCount}</span>
        </button>

        <button className="action-button">
          <CommentIcon />
          <span>{post.commentsCount || 0}</span>
        </button>

        <button className="action-button" onClick={handleShare}>
          <ShareIcon />
          <span>Chia sẻ</span>
        </button>
      </div>
    </div>
  );
};

export default CommunityPostCard;
