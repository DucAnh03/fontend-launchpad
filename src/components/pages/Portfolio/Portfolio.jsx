import React, { useState } from 'react';
import CreatePortfolioModal from '../../../components/pages/Portfolio/CreatePortfolioModal';
import PortfolioList from '../../../components/pages/Portfolio/PortfolioList'; // Giả sử bạn có component này để hiển thị danh sách

export default function PortfolioDashboardPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // State để trigger PortfolioList render lại
    const [refreshKey, setRefreshKey] = useState(0);

    const handleCreateSuccess = () => {
        setIsModalOpen(false);
        setRefreshKey(oldKey => oldKey + 1);
        alert("Đăng portfolio thành công!");
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Portfolio Dashboard</h1>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                    + Đăng tải Portfolio
                </button>
            </div>
            <PortfolioList key={refreshKey} />
            {isModalOpen && (
                <CreatePortfolioModal 
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleCreateSuccess}
                />
            )}
        </div>
    );
}