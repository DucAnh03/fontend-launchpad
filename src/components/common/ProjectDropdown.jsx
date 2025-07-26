// components/Common/ProjectDropdown.jsx
import React, { useState, useRef, useEffect } from "react";

export default function ProjectDropdown({
  projects = [],
  selectedProject,
  onProjectChange,
  placeholder = "Chọn project",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedProjectData = projects.find((p) => p._id === selectedProject);

  const handleSelect = (projectId) => {
    onProjectChange(projectId);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-left shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 min-w-48"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectedProjectData ? (
              <>
                <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                <span className="text-gray-900 font-medium truncate">
                  {selectedProjectData.name}
                </span>
              </>
            ) : (
              <>
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-gray-500">{placeholder}</span>
              </>
            )}
          </div>

          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
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

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {/* All projects option */}
          <div
            onClick={() => handleSelect(null)}
            className={`px-4 py-3 cursor-pointer hover:bg-purple-50 transition-colors duration-150 ${
              !selectedProject
                ? "bg-purple-100 text-purple-700"
                : "text-gray-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div>
                <p className="font-medium">Tất cả projects</p>
                <p className="text-xs text-gray-500">
                  Xem nội dung từ tất cả projects
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          {projects.length > 0 && (
            <div className="border-t border-gray-100"></div>
          )}

          {/* Project options */}
          {projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project._id}
                onClick={() => handleSelect(project._id)}
                className={`px-4 py-3 cursor-pointer hover:bg-purple-50 transition-colors duration-150 ${
                  selectedProject === project._id
                    ? "bg-purple-100 text-purple-700"
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
                    <p className="font-medium truncate">{project.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="capitalize">{project.status}</span>
                      {project.members && (
                        <>
                          <span>•</span>
                          <span>{project.members.length} thành viên</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-gray-500">
              <svg
                className="w-8 h-8 mx-auto mb-2 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-sm">Chưa có project nào</p>
              <p className="text-xs">Tạo project để tham gia community</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
