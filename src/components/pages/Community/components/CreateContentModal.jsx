import React, { useState } from "react";
import { message } from "antd";
import api from "@/services/api/axios";
import CustomDropdown, { CustomTagsInput } from "./CustomDropdown";

// Icons
const CloseIcon = () => (
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
);

const ImageIcon = () => (
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
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const CalendarIcon = () => (
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
);

const CreateContentModal = ({ onClose, onSuccess, user }) => {
  const [contentType, setContentType] = useState("post");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [],
    category: "",
    isPrivate: false,
    requireApproval: false,
    startDate: "",
    endDate: "",
    location: "",
    isOnline: false,
    maxAttendees: "",
  });
  const [files, setFiles] = useState([]);

  // Content type options
  const contentTypes = [
    { value: "post", label: "Bài viết", icon: "📝" },
    { value: "group", label: "Nhóm", icon: "👥" },
    { value: "event", label: "Sự kiện", icon: "⭐" },
  ];

  // Category options for groups
  const categoryOptions = [
    { value: "technology", label: "Công nghệ" },
    { value: "business", label: "Kinh doanh" },
    { value: "education", label: "Giáo dục" },
    { value: "lifestyle", label: "Phong cách sống" },
    { value: "hobbies", label: "Sở thích" },
    { value: "other", label: "Khác" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxFiles = contentType === "post" ? 10 : 5;

    if (selectedFiles.length > maxFiles) {
      message.warning(`Chỉ được chọn tối đa ${maxFiles} ảnh`);
      return;
    }

    setFiles(selectedFiles);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      message.error("Vui lòng nhập tiêu đề");
      return;
    }

    if (!formData.description.trim()) {
      message.error("Vui lòng nhập mô tả");
      return;
    }

    if (contentType === "group" && !formData.category) {
      message.error("Vui lòng chọn danh mục nhóm");
      return;
    }

    if (contentType === "event" && !formData.startDate) {
      message.error("Vui lòng chọn ngày bắt đầu sự kiện");
      return;
    }

    try {
      setLoading(true);

      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);

      // Add specific fields based on content type
      if (contentType === "post") {
        if (formData.tags.length > 0) {
          submitData.append("tags", JSON.stringify(formData.tags));
        }
      } else if (contentType === "group") {
        submitData.append("category", formData.category);
        submitData.append("isPrivate", formData.isPrivate);
        submitData.append("requireApproval", formData.requireApproval);
      } else if (contentType === "event") {
        submitData.append("startDate", formData.startDate);
        if (formData.endDate) {
          submitData.append("endDate", formData.endDate);
        }
        if (formData.location) {
          submitData.append("location", formData.location);
        }
        submitData.append("isOnline", formData.isOnline);
        if (formData.maxAttendees) {
          submitData.append("maxAttendees", formData.maxAttendees);
        }
      }

      // Add files
      files.forEach((file) => {
        submitData.append("images", file);
      });

      const endpoint = `/communities/${contentType}s`;
      await api.post(endpoint, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      message.success(`Tạo ${getContentTypeLabel()} thành công!`);
      onSuccess();
    } catch (error) {
      console.error("Submit error:", error);
      message.error(`Tạo ${getContentTypeLabel()} thất bại!`);
    } finally {
      setLoading(false);
    }
  };

  const getContentTypeLabel = () => {
    const type = contentTypes.find((t) => t.value === contentType);
    return type ? type.label.toLowerCase() : "nội dung";
  };

  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-user">
            <div className="modal-avatar">
              {user?.avatar?.url ? (
                <img src={user.avatar.url} alt={user.name} />
              ) : (
                <div className="avatar-placeholder">
                  {user?.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
            <div className="modal-user-info">
              <div className="modal-username">{user?.name || "User"}</div>
              <div className="modal-user-role">
                {contentType === "post"
                  ? "Tạo bài viết mới"
                  : contentType === "group"
                  ? "Tạo nhóm mới"
                  : "Tạo sự kiện mới"}
              </div>
            </div>
          </div>

          <button className="modal-close" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {/* Content Type Selector */}
        <div className="content-type-selector">
          {contentTypes.map((type) => (
            <button
              key={type.value}
              className={`type-button ${
                contentType === type.value ? "active" : ""
              }`}
              onClick={() => setContentType(type.value)}
            >
              <span className="type-icon">{type.icon}</span>
              <span className="type-label">{type.label}</span>
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Title */}
          <div className="form-group">
            <input
              type="text"
              placeholder={`Tiêu đề ${getContentTypeLabel()}...`}
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="form-input title-input"
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <textarea
              placeholder={`Mô tả chi tiết về ${getContentTypeLabel()}...`}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="form-textarea"
              rows={4}
              maxLength={
                contentType === "event"
                  ? 2000
                  : contentType === "post"
                  ? 5000
                  : 1000
              }
            />
          </div>

          {/* Post specific fields */}
          {contentType === "post" && (
            <div className="form-group">
              <label className="form-label">Tags</label>
              <CustomTagsInput
                value={formData.tags}
                onChange={(tags) => handleInputChange("tags", tags)}
                placeholder="Thêm tags để dễ tìm kiếm..."
                maxTags={10}
              />
            </div>
          )}

          {/* Group specific fields */}
          {contentType === "group" && (
            <>
              <div className="form-group">
                <label className="form-label">Danh mục *</label>
                <CustomDropdown
                  options={categoryOptions}
                  value={formData.category}
                  onChange={(value) => handleInputChange("category", value)}
                  placeholder="Chọn danh mục nhóm..."
                />
              </div>

              <div className="form-group">
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.isPrivate}
                      onChange={(e) =>
                        handleInputChange("isPrivate", e.target.checked)
                      }
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">Nhóm riêng tư</span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.requireApproval}
                      onChange={(e) =>
                        handleInputChange("requireApproval", e.target.checked)
                      }
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">
                      Cần phê duyệt để tham gia
                    </span>
                  </label>
                </div>
              </div>
            </>
          )}

          {/* Event specific fields */}
          {contentType === "event" && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Ngày bắt đầu *</label>
                  <input
                    type="datetime-local"
                    value={formatDateForInput(formData.startDate)}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                    className="form-input"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Ngày kết thúc</label>
                  <input
                    type="datetime-local"
                    value={formatDateForInput(formData.endDate)}
                    onChange={(e) =>
                      handleInputChange("endDate", e.target.value)
                    }
                    className="form-input"
                    min={
                      formData.startDate ||
                      new Date().toISOString().slice(0, 16)
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Địa điểm</label>
                <input
                  type="text"
                  placeholder="Nhập địa điểm tổ chức sự kiện..."
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="form-input"
                  maxLength={200}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Số lượng tối đa</label>
                  <input
                    type="number"
                    placeholder="Để trống nếu không giới hạn"
                    value={formData.maxAttendees}
                    onChange={(e) =>
                      handleInputChange("maxAttendees", e.target.value)
                    }
                    className="form-input"
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.isOnline}
                      onChange={(e) =>
                        handleInputChange("isOnline", e.target.checked)
                      }
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">Sự kiện online</span>
                  </label>
                </div>
              </div>
            </>
          )}

          {/* File Upload */}
          <div className="form-group">
            <label className="form-label">
              {contentType === "post"
                ? "Hình ảnh"
                : contentType === "group"
                ? "Ảnh đại diện/Cover"
                : "Ảnh sự kiện"}
            </label>

            <div className="file-upload-area">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
                id="file-upload"
                max={contentType === "post" ? 10 : 5}
              />
              <label htmlFor="file-upload" className="file-upload-label">
                <ImageIcon />
                <span>Chọn ảnh để tải lên</span>
                <span className="file-upload-hint">
                  Tối đa {contentType === "post" ? 10 : 5} ảnh
                </span>
              </label>
            </div>

            {/* File Preview */}
            {files.length > 0 && (
              <div className="file-preview">
                {files.map((file, index) => (
                  <div key={index} className="preview-item">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="preview-image"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="remove-file"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="action-button secondary"
              disabled={loading}
            >
              Hủy
            </button>

            <button
              type="submit"
              className="action-button primary"
              disabled={loading}
            >
              {loading
                ? "Đang tạo..."
                : contentType === "post"
                ? "Đăng bài"
                : contentType === "group"
                ? "Tạo nhóm"
                : "Tạo sự kiện"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContentModal;
