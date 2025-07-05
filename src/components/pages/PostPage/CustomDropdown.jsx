import { useState, useEffect, useRef } from 'react';

export default function CustomDropdown({ trigger, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Effect to handle clicks outside the component to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleTriggerClick = () => {
    setIsOpen(prev => !prev);
  };

  const handleOptionClick = () => {
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger element */}
      <div onClick={handleTriggerClick}>
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20 py-1 border border-gray-100"
          onClick={handleOptionClick}
        >
          {children}
        </div>
      )}
    </div>
  );
}