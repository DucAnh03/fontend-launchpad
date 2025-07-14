// src/components/modals/PostPortfolioModal.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import PortfolioForm from '../portfolio/PortfolioForm'; // Import form component

export default function PostPortfolioModal({ isOpen, onClose, onPortfolioCreated }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all scale-100 opacity-100">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          aria-label="Đóng"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <PortfolioForm
          onClose={onClose} // Truyền onClose xuống form để có nút đóng trong form
          onSubmitSuccess={onPortfolioCreated} // Truyền callback khi tạo thành công
        />
      </div>
    </div>,
    document.body // Portal into the body to avoid z-index issues
  );
}