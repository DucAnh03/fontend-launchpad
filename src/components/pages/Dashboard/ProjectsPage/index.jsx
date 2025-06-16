import React, { useState, useEffect } from 'react';
import { getAllPortfolios } from '../../../../services/api/portfolio/portfolio';
import PortfolioDetailModal from '../ProjectsPage/PortfolioDetailModal'; // Import component modal
import { Card } from 'antd'; // Import Card component


export default function ProjectsPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // STATE ĐỂ QUẢN LÝ MODAL
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            // ... logic fetch data giữ nguyên ...
            try {
                setLoading(true);
                const portfolioItems = await getAllPortfolios();
                setItems(portfolioItems);
            } catch (err) {
                setError("Không thể tải danh sách dự án.");
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    // HÀM ĐỂ MỞ MODAL
    const handleViewDetails = (id) => {
        setSelectedItemId(id);
        setIsModalOpen(true);
    };

    // HÀM ĐỂ ĐÓNG MODAL
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItemId(null);
    };

    if (loading) return <div className="text-center p-20">Đang tải...</div>;
    if (error) return <div className="text-center p-20 text-red-600">{error}</div>;

    return (
        <div className="p-4"> {/* Thêm padding cho nội dung chung */}
            <Card
                title="Dự án của tôi"
                className="shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300"
                headStyle={{ fontSize: '1.25rem', fontWeight: 'bold', borderBottom: '2px solid #f0f0f0' }}
            >
                <section className="bg-slate-50 py-16 px-4">
                    <div className="max-w-screen-xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">My Projects Showcase</h1>
                            <p className="text-lg text-gray-500 mt-4">Những dự án tâm huyết tôi đã thực hiện.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {items.map(item => (
                                <div key={item._id} className="bg-white rounded-lg shadow-lg overflow-hidden group">
                                    <img src={item.coverImage.url} alt={item.coverImage.altText} className="w-full h-56 object-cover cursor-pointer" onClick={() => handleViewDetails(item._id)} />
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4 h-24 overflow-auto">{item.summary}</p>
                                        <div className="mt-5">
                                            {/* SỬA LẠI NÚT NÀY ĐỂ MỞ MODAL */}
                                            <button 
                                                onClick={() => handleViewDetails(item._id)}
                                                className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                                            >
                                                Xem chi tiết →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                {/* Đảm bảo PortfolioDetailModal được render bên ngoài Card nếu nó là một overlay toàn màn hình */}
                {isModalOpen && (
                    <PortfolioDetailModal itemId={selectedItemId} onClose={handleCloseModal} />
                )}
            </Card>
        </div>
    );
}