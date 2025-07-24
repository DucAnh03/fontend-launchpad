import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const CustomDropdown = ({
  options = [],
  value,
  onChange,
  placeholder = "Chọn...",
  className = "",
  disabled = false,
  multiple = false,
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Filter options based on search term
  const filteredOptions =
    searchable && searchTerm
      ? options.filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

  // Get display value
  const getDisplayValue = () => {
    if (multiple) {
      if (!value || value.length === 0) return placeholder;
      if (value.length === 1) {
        const option = options.find((opt) => opt.value === value[0]);
        return option ? option.label : placeholder;
      }
      return `${value.length} mục đã chọn`;
    } else {
      const option = options.find((opt) => opt.value === value);
      return option ? option.label : placeholder;
    }
  };

  // Handle option click
  const handleOptionClick = (optionValue) => {
    if (multiple) {
      const newValue = value || [];
      if (newValue.includes(optionValue)) {
        // Remove from selection
        const updatedValue = newValue.filter((v) => v !== optionValue);
        onChange(updatedValue);
      } else {
        // Add to selection
        onChange([...newValue, optionValue]);
      }
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  // Check if option is selected
  const isOptionSelected = (optionValue) => {
    if (multiple) {
      return value && value.includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          relative w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-left cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${
            disabled
              ? "bg-gray-100 cursor-not-allowed"
              : "hover:border-gray-400"
          }
          ${isOpen ? "ring-2 ring-blue-500 border-blue-500" : ""}
        `}
      >
        <span
          className={`block truncate ${
            !value || (multiple && (!value || value.length === 0))
              ? "text-gray-500"
              : "text-gray-900"
          }`}
        >
          {getDisplayValue()}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </span>
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
          {/* Search Input */}
          {searchable && (
            <div className="px-3 py-2 border-b border-gray-200">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Options List */}
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-gray-500 text-sm">
              {searchTerm ? "Không tìm thấy kết quả" : "Không có tùy chọn"}
            </div>
          ) : (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOptionClick(option.value)}
                className={`
                  w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                  ${
                    isOptionSelected(option.value)
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-900"
                  }
                  ${
                    option.disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }
                `}
                disabled={option.disabled}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{option.label}</span>
                  {multiple && isOptionSelected(option.value) && (
                    <svg
                      className="h-4 w-4 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                {option.description && (
                  <div className="text-xs text-gray-500 mt-1">
                    {option.description}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// Custom Tags Input (for multiple selection display)
export const CustomTagsInput = ({
  value = [],
  onChange,
  placeholder = "Nhập tags...",
  maxTags = 10,
  className = "",
}) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      // Remove last tag when backspace on empty input
      const newTags = [...value];
      newTags.pop();
      onChange(newTags);
    }
  };

  const addTag = () => {
    const tag = inputValue.trim();
    if (tag && !value.includes(tag) && value.length < maxTags) {
      onChange([...value, tag]);
      setInputValue("");
    }
  };

  const removeTag = (indexToRemove) => {
    const newTags = value.filter((_, index) => index !== indexToRemove);
    onChange(newTags);
  };

  return (
    <div
      className={`flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 ${className}`}
    >
      {/* Existing Tags */}
      {value.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
        >
          #{tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="ml-1 hover:text-blue-600 focus:outline-none"
          >
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </span>
      ))}

      {/* Input for new tags */}
      {value.length < maxTags && (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-20 bg-transparent border-none outline-none text-sm"
        />
      )}
    </div>
  );
};

export default CustomDropdown;
