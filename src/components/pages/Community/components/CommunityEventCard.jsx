import React, { useState } from "react";
import { message } from "antd";
import api from "@/services/api/axios";

const CommunityEventCard = ({ event, user }) => {
  const [isAttending, setIsAttending] = useState(event.isAttending || false);
  const [attendeeCount, setAttendeeCount] = useState(event.attendeeCount || 0);

  const eventDate = new Date(event.startDate);
  const isUpcoming = eventDate > new Date();

  const handleAttendEvent = async () => {
    try {
      if (isAttending) {
        await api.delete(`/communities/events/${event._id}/attend`);
        setIsAttending(false);
        setAttendeeCount((prev) => prev - 1);
        message.success("Đã hủy tham gia sự kiện");
      } else {
        await api.post(`/communities/events/${event._id}/attend`);
        setIsAttending(true);
        setAttendeeCount((prev) => prev + 1);
        message.success("Đăng ký tham gia thành công!");
      }
    } catch (error) {
      message.error("Không thể thực hiện hành động này");
    }
  };

  const formatEventDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="event-card">
      <div className="event-content">
        <div className="event-date">
          <div className="event-date-day">{eventDate.getDate()}</div>
          <div className="event-date-month">Th{eventDate.getMonth() + 1}</div>
        </div>

        <div className="event-info">
          <div className="event-header">
            <h3 className="event-title">{event.title}</h3>
            <span className={`event-status ${!isUpcoming ? "past" : ""}`}>
              {isUpcoming ? "Sắp diễn ra" : "Đã kết thúc"}
            </span>
          </div>

          <p className="event-description">{event.description}</p>

          <div className="event-details">
            <div className="event-detail">
              📅 {formatEventDate(event.startDate)}
            </div>

            {event.location && (
              <div className="event-detail">📍 {event.location}</div>
            )}

            <div className="event-detail">
              👥 {attendeeCount} người tham gia
            </div>
          </div>

          <div className="event-actions">
            <button
              className={`event-attend-button ${
                isAttending ? "attending" : ""
              }`}
              onClick={handleAttendEvent}
              disabled={!isUpcoming}
            >
              {isAttending ? "Đã đăng ký" : "Tham gia"}
            </button>

            <button className="event-share-button">🔗</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityEventCard;
