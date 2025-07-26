// components/Community/CreateEventModal.jsx
import React, { useState, useEffect, useRef } from "react";
import api from "@/services/api/axios";

export default function CreateEventModal({
  projects,
  selectedProject,
  onClose,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    projectId: selectedProject || "",
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    isOnline: false,
    meetingLink: "",
    maxAttendees: "",
    category: "meeting",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const modalRef = useRef(null);
  const projectDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  const categories = [
    { value: "meeting", label: "Meeting", icon: "👥" },
    { value: "workshop", label: "Workshop", icon: "🛠️" },
    { value: "seminar", label: "Seminar", icon: "📚" },
    { value: "standup", label: "Standup", icon: "🏃" },
    { value: "review", label: "Review", icon: "✅" },
    { value: "planning", label: "Planning", icon: "📋" },
    { value: "other", label: "Khác", icon: "📅" },
  ];

  // Close modal when clicking outside or pressing escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        projectDropdownRef.current &&
        !projectDropdownRef.current.contains(event.target)
      ) {
        setProjectDropdownOpen(false);
      }
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setCategoryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Set default date/time
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const endTime = new Date(tomorrow);
    endTime.setHours(11, 0, 0, 0);

    setFormData((prev) => ({
      ...prev,
      startDate: tomorrow.toISOString().slice(0, 16),
      endDate: endTime.toISOString().slice(0, 16),
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!formData.tags.includes(newTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleProjectSelect = (projectId) => {
    setFormData((prev) => ({
      ...prev,
      projectId,
    }));
    setProjectDropdownOpen(false);
  };

  const handleCategorySelect = (category) => {
    setFormData((prev) => ({
      ...prev,
      category,
    }));
    setCategoryDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.projectId) {
      setError("Vui lòng chọn project");
      return;
    }

    if (!formData.title.trim()) {
      setError("Vui lòng nhập tiêu đề");
      return;
    }

    if (!formData.description.trim()) {
      setError("Vui lòng nhập mô tả");
      return;
    }

    if (!formData.startDate) {
      setError("Vui lòng chọn thời gian bắt đầu");
      return;
    }

    // Validate dates
    const startDate = new Date(formData.startDate);
    const endDate = formData.endDate ? new Date(formData.endDate) : null;

    if (endDate && endDate <= startDate) {
      setError("Thời gian kết thúc phải sau thời gian bắt đầu");
      return;
    }

    if (formData.isOnline && !formData.meetingLink.trim()) {
      setError("Vui lòng nhập link meeting cho sự kiện online");
      return;
    }

    if (!formData.isOnline && !formData.location.trim()) {
      setError("Vui lòng nhập địa điểm cho sự kiện offline");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const submitData = {
        ...formData,
        maxAttendees: formData.maxAttendees
          ? parseInt(formData.maxAttendees)
          : null,
      };

      const res = await api.post("/communities/events", submitData);
      if (res.data.success) {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra khi tạo sự kiện");
    } finally {
      setLoading(false);
    }
  };

  const selectedProjectData = projects.find(
    (p) => p._id === formData.projectId
  );
  const selectedCategory = categories.find(
    (c) => c.value === formData.category
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <svg
                className="w-6 h-6"
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
              Tạo sự kiện mới
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors duration-200"
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

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-6">
                {/* Project selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project <span className="text-red-500">*</span>
                  </label>
                  <div className="relative" ref={projectDropdownRef}>
                    <button
                      type="button"
                      onClick={() =>
                        setProjectDropdownOpen(!projectDropdownOpen)
                      }
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {selectedProjectData ? (
                            <>
                              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                              <span className="text-gray-900 font-medium">
                                {selectedProjectData.name}
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                              <span className="text-gray-500">
                                Chọn project
                              </span>
                            </>
                          )}
                        </div>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                            projectDropdownOpen ? "transform rotate-180" : ""
                          }`}
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
                      </div>
                    </button>

                    {projectDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                        {projects.length > 0 ? (
                          projects.map((project) => (
                            <button
                              key={project._id}
                              type="button"
                              onClick={() => handleProjectSelect(project._id)}
                              className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 ${
                                formData.projectId === project._id
                                  ? "bg-blue-100 text-blue-700"
                                  : "text-gray-700"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    project.status === "active"
                                      ? "bg-gradient-to-r from-green-400 to-blue-400"
                                      : project.status === "completed"
                                      ? "bg-gradient-to-r from-purple-400 to-pink-400"
                                      : "bg-gradient-to-r from-yellow-400 to-orange-400"
                                  }`}
                                ></div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">
                                    {project.name}
                                  </p>
                                  <p className="text-xs text-gray-500 capitalize">
                                    {project.status}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center text-gray-500">
                            <p className="text-sm">Chưa có project nào</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Nhập tiêu đề sự kiện..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors duration-200"
                    maxLength={200}
                  />
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {formData.title.length}/200
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại sự kiện
                  </label>
                  <div className="relative" ref={categoryDropdownRef}>
                    <button
                      type="button"
                      onClick={() =>
                        setCategoryDropdownOpen(!categoryDropdownOpen)
                      }
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">
                            {selectedCategory?.icon}
                          </span>
                          <span className="text-gray-900 font-medium">
                            {selectedCategory?.label}
                          </span>
                        </div>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                            categoryDropdownOpen ? "transform rotate-180" : ""
                          }`}
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
                      </div>
                    </button>

                    {categoryDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                        {categories.map((category) => (
                          <button
                            key={category.value}
                            type="button"
                            onClick={() => handleCategorySelect(category.value)}
                            className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 ${
                              formData.category === category.value
                                ? "bg-blue-100 text-blue-700"
                                : "text-gray-700"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{category.icon}</span>
                              <span className="font-medium">
                                {category.label}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Online/Offline toggle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Hình thức tổ chức
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="eventType"
                        checked={!formData.isOnline}
                        onChange={() =>
                          setFormData((prev) => ({ ...prev, isOnline: false }))
                        }
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="text-gray-700 font-medium">Offline</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="eventType"
                        checked={formData.isOnline}
                        onChange={() =>
                          setFormData((prev) => ({ ...prev, isOnline: true }))
                        }
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="text-gray-700 font-medium">Online</span>
                    </label>
                  </div>
                </div>

                {/* Location or Meeting Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.isOnline ? "Link meeting" : "Địa điểm"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name={formData.isOnline ? "meetingLink" : "location"}
                    value={
                      formData.isOnline
                        ? formData.meetingLink
                        : formData.location
                    }
                    onChange={handleInputChange}
                    placeholder={
                      formData.isOnline
                        ? "https://meet.google.com/..."
                        : "Nhập địa điểm tổ chức..."
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors duration-200"
                  />
                </div>

                {/* Max attendees */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số người tham gia tối đa
                  </label>
                  <input
                    type="number"
                    name="maxAttendees"
                    value={formData.maxAttendees}
                    onChange={handleInputChange}
                    placeholder="Để trống nếu không giới hạn"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors duration-200"
                  />
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                {/* Start date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors duration-200"
                  />
                </div>

                {/* End date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian kết thúc
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors duration-200"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Mô tả chi tiết về sự kiện..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-colors duration-200"
                    maxLength={2000}
                  />
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {formData.description.length}/2000
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Nhập tag và nhấn Enter..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors duration-200"
                  />

                  {/* Tags display */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-blue-200 transition-colors duration-200"
                          >
                            <svg
                              className="w-3 h-3"
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
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              loading ||
              !formData.projectId ||
              !formData.title.trim() ||
              !formData.description.trim() ||
              !formData.startDate
            }
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang tạo...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
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
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
