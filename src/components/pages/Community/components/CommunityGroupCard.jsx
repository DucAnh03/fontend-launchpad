import React, { useState } from "react";
import { message } from "antd";
import api from "@/services/api/axios";

const CommunityGroupCard = ({ group, user }) => {
  const [isMember, setIsMember] = useState(group.isMember || false);
  const [memberCount, setMemberCount] = useState(group.memberCount || 0);

  const handleJoinGroup = async () => {
    try {
      const response = await api.post(`/communities/groups/${group._id}/join`);

      if (response.data.success) {
        if (group.requireApproval) {
          message.success("Đã gửi yêu cầu tham gia nhóm!");
        } else {
          setIsMember(true);
          setMemberCount((prev) => prev + 1);
          message.success("Tham gia nhóm thành công!");
        }
      }
    } catch (error) {
      message.error("Không thể tham gia nhóm");
    }
  };

  return (
    <div className="group-card">
      <div className="group-cover">
        {group.coverImage?.url && (
          <img src={group.coverImage.url} alt={group.name} />
        )}
        <div className="group-avatar">
          {group.avatar?.url ? (
            <img src={group.avatar.url} alt={group.name} />
          ) : (
            group.name?.charAt(0) || "G"
          )}
        </div>
      </div>

      <div className="group-content">
        <h3 className="group-name">{group.name}</h3>
        <p className="group-description">{group.description}</p>

        <div className="group-stats">
          <span>{memberCount} thành viên</span>
          <span>•</span>
          <span>{group.isPrivate ? "Riêng tư" : "Công khai"}</span>
        </div>

        <button
          className={`group-join-button ${isMember ? "joined" : ""}`}
          onClick={handleJoinGroup}
          disabled={isMember}
        >
          {isMember ? "Đã tham gia" : "Tham gia"}
        </button>
      </div>
    </div>
  );
};

export default CommunityGroupCard;
