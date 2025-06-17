// src/pages/dashboard/PortfolioDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import CreatePortfolioModal from '../../../components/pages/Portfolio/CreatePortfolioModal';
import PortfolioList from '../../../components/pages/Portfolio/PortfolioList';

// Component thông báo thành công
const SuccessNotification = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000); // Tự động đóng sau 3 giây
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-5 right-5 bg-green-500 text-white py-3 px-5 rounded-lg shadow-lg z-50 animate-slide-in-right">
            {message}
        </div>
    );
};

export default function PortfolioDashboardPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleCreateSuccess = () => {
        setIsModalOpen(false); 
        setRefreshKey(oldKey => oldKey + 1);
        setShowSuccess(true); // Hiển thị thông báo thành công
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            {showSuccess && (
                <SuccessNotification 
                    message="Đăng portfolio thành công!" 
                    onClose={() => setShowSuccess(false)}
                />
            )}
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Portfolio Dashboard</h1>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Đăng tải Portfolio
                    </button>
                </div>

                {/* Truyền `key` để React re-render component này khi dữ liệu mới được tạo */}
                <PortfolioList key={refreshKey} />

                {isModalOpen && (
                    <CreatePortfolioModal 
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={handleCreateSuccess}
                    />
                )}
            </div>
        </div>
    );
}