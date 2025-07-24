import React from "react";

const CommunityMemberCard = ({ member, user }) => {
  const isCurrentUser = user && member._id === user._id;

  const formatJoinDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="member-card">
      <div className="member-avatar">
        {member.avatar?.url ? (
          <img src={member.avatar.url} alt={member.name} />
        ) : (
          member.name?.charAt(0) || "U"
        )}
      </div>

      <h3 className="member-name">{member.name}</h3>
      <p className="member-title">{member.title || "Thành viên"}</p>

      {member.badges && member.badges.length > 0 && (
        <div className="member-badges">
          {member.badges.map((badge, index) => (
            <span key={index} className="member-badge">
              {badge.name}
            </span>
          ))}
        </div>
      )}

      <div className="member-joined">
        Tham gia từ {formatJoinDate(member.joinedAt || member.createdAt)}
      </div>

      {!isCurrentUser && (
        <div className="member-actions">
          <button className="member-action-button">Kết bạn</button>
          <button className="member-action-button secondary">💬</button>
        </div>
      )}
    </div>
  );
};

export default CommunityMemberCard;
