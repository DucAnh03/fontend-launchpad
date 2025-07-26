// components/Community/CommunityDashboard.jsx
import React, { useState, useEffect } from "react";
import api from "@/services/api/axios";
import PostsList from "@/components/Community/PostsList";
import EventsList from "@/components/Community/EventsList";
import CreatePostModal from "@/components/Community/CreatePostModal";
import CreateEventModal from "@/components/Community/CreateEventModal";
import ProjectDropdown from "@/components/common/ProjectDropdown";

export default function CommunityDashboard({ subscription }) {
  const [activeTab, setActiveTab] = useState("feed");
  const [selectedProject, setSelectedProject] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadUserProjects();
    loadStats();
  }, []);

  const loadUserProjects = async () => {
    try {
      const res = await api.get("/projects/my");
      if (res.data.success) {
        setUserProjects(res.data.data);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  const loadStats = async () => {
    try {
      const res = await api.get(
        selectedProject
          ? `/communities/stats?projectId=${selectedProject}`
          : "/communities/stats"
      );
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const tabs = [
    { id: "feed", label: "📰 Bảng tin", icon: "feed" },
    { id: "posts", label: "📝 Bài viết", icon: "posts" },
    { id: "events", label: "📅 Sự kiện", icon: "events" },
    { id: "search", label: "🔍 Tìm kiếm", icon: "search" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-gradient-to-r from-purple-400 to-pink-400">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Title & Subscription info */}
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                <span className="text-4xl">💎</span>
                Crystal Gems Community
              </h1>
              {subscription && (
                <p className="text-sm text-gray-600 mt-1">
                  Gói:{" "}
                  <span className="font-semibold text-purple-600">
                    {subscription.plan?.planName}
                  </span>
                  {subscription.expiresAt && (
                    <span className="ml-2">
                      • Hết hạn:{" "}
                      {new Date(subscription.expiresAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Project selector & Stats */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <ProjectDropdown
                projects={userProjects}
                selectedProject={selectedProject}
                onProjectChange={setSelectedProject}
                placeholder="Tất cả projects"
              />

              {stats && (
                <div className="flex gap-4 text-sm">
                  <div className="bg-purple-100 px-3 py-1 rounded-full">
                    <span className="text-purple-700 font-semibold">
                      {stats.myPosts || stats.posts || 0} bài viết
                    </span>
                  </div>
                  <div className="bg-pink-100 px-3 py-1 rounded-full">
                    <span className="text-pink-700 font-semibold">
                      {stats.myEvents || stats.events || 0} sự kiện
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-600 bg-purple-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowCreatePost(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tạo bài viết
          </button>

          <button
            onClick={() => setShowCreateEvent(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Tạo sự kiện
          </button>
        </div>
      </div>

      {/* Search bar for search tab */}
      {activeTab === "search" && (
        <div className="max-w-7xl mx-auto px-4 pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết, sự kiện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {activeTab === "feed" && (
          <PostsList
            selectedProject={selectedProject}
            feedMode={true}
            onStatsChange={loadStats}
          />
        )}

        {activeTab === "posts" && (
          <PostsList
            selectedProject={selectedProject}
            feedMode={false}
            onStatsChange={loadStats}
          />
        )}

        {activeTab === "events" && (
          <EventsList
            selectedProject={selectedProject}
            onStatsChange={loadStats}
          />
        )}

        {activeTab === "search" && searchQuery && (
          <div className="space-y-6">
            <PostsList
              selectedProject={selectedProject}
              searchQuery={searchQuery}
              searchMode={true}
              onStatsChange={loadStats}
            />
            <EventsList
              selectedProject={selectedProject}
              searchQuery={searchQuery}
              searchMode={true}
              onStatsChange={loadStats}
            />
          </div>
        )}

        {activeTab === "search" && !searchQuery && (
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500">
              Nhập từ khóa để tìm kiếm bài viết và sự kiện
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreatePost && (
        <CreatePostModal
          projects={userProjects}
          selectedProject={selectedProject}
          onClose={() => setShowCreatePost(false)}
          onSuccess={() => {
            setShowCreatePost(false);
            loadStats();
          }}
        />
      )}

      {showCreateEvent && (
        <CreateEventModal
          projects={userProjects}
          selectedProject={selectedProject}
          onClose={() => setShowCreateEvent(false)}
          onSuccess={() => {
            setShowCreateEvent(false);
            loadStats();
          }}
        />
      )}
    </div>
  );
}
