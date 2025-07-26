// components/Community/EventsList.jsx
import React, { useState, useEffect } from "react";
import api from "@/services/api/axios";
import EventCard from "@/components/Community/EventCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function EventsList({
  selectedProject,
  searchQuery = "",
  searchMode = false,
  onStatsChange,
}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    loadEvents();
  }, [selectedProject, searchQuery, pagination.page]);

  const loadEvents = async () => {
    setLoading(true);
    setError("");

    try {
      let url;
      let params = {
        page: pagination.page,
        limit: pagination.limit,
        status: "published",
      };

      if (searchMode && searchQuery) {
        // Search mode
        url = "/communities/search";
        params.q = searchQuery;
        params.type = "events";
        if (selectedProject) {
          params.projectId = selectedProject;
        }
      } else {
        // Events mode - get events by project
        url = "/communities/events";
        if (selectedProject) {
          params.projectId = selectedProject;
        }
      }

      const res = await api.get(url, { params });

      if (res.data.success) {
        if (searchMode) {
          setEvents(res.data.data.events || []);
          setPagination((prev) => ({
            ...prev,
            total: res.data.data.events?.length || 0,
            totalPages: Math.ceil(
              (res.data.data.events?.length || 0) / prev.limit
            ),
          }));
        } else {
          setEvents(res.data.data.events || []);
          setPagination((prev) => ({
            ...prev,
            ...res.data.data.pagination,
          }));
        }
      }
    } catch (err) {
      console.error("Error loading events:", err);
      setError("Không thể tải sự kiện");
    } finally {
      setLoading(false);
    }
  };

  const handleAttendEvent = async (eventId) => {
    try {
      const res = await api.post(`/communities/events/${eventId}/attend`);
      if (res.data.success) {
        // Update event in list
        setEvents((prev) =>
          prev.map((event) =>
            event._id === eventId
              ? {
                  ...event,
                  attendees: event.attendees.includes(res.data.userId)
                    ? event.attendees.filter((id) => id !== res.data.userId)
                    : [...event.attendees, res.data.userId],
                }
              : event
          )
        );
        onStatsChange?.();
      }
    } catch (error) {
      console.error("Error attending event:", error);
    }
  };

  const loadMore = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  if (loading && events.length === 0) {
    return <LoadingSpinner text="Đang tải sự kiện..." />;
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
          onClick={loadEvents}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (events.length === 0 && !loading) {
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {searchMode ? "Không tìm thấy sự kiện" : "Chưa có sự kiện nào"}
        </h3>
        <p className="text-gray-500">
          {searchMode
            ? `Không có sự kiện nào khớp với "${searchQuery}"`
            : "Hãy tạo sự kiện đầu tiên để kết nối với team!"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Events grid */}
      <div className="grid gap-6">
        {events.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            onAttend={handleAttendEvent}
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
              `Xem thêm (${pagination.total - events.length} sự kiện)`
            )}
          </button>
        </div>
      )}

      {/* Pagination info */}
      {events.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Hiển thị {events.length} / {pagination.total} sự kiện
        </div>
      )}
    </div>
  );
}
