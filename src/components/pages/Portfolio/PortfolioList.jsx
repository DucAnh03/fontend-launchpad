import React, { useState, useEffect } from 'react';
// Đảm bảo các đường dẫn import này là chính xác
import { getAllPortfolios } from '../../../services/api/portfolio/portfolio';
import PortfolioDetailModal from '../../../components/pages/Portfolio/PortfolioDetailModal';

export default function PortfolioList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ----- PHẦN 1: STATE QUẢN LÝ MODAL -----
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
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

    // ----- PHẦN 2: CÁC HÀM XỬ LÝ SỰ KIỆN -----
    // Hàm này được gọi bởi nút "Xem chi tiết →"
    const handleViewDetails = (id) => {
        setSelectedItemId(id); // Lưu ID của item được chọn
        setIsModalOpen(true);  // Mở modal
    };

    // Hàm này được truyền vào Modal để nó có thể tự đóng lại
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItemId(null);
    };

    if (loading) return <div className="text-center p-20">Đang tải...</div>;
    if (error) return <div className="text-center p-20 text-red-600">{error}</div>;

    return (
        <>
            {items.length > 0 ? (
                <div className="flex flex-col gap-8"> 
                    {items.map(item => (
                        <div key={item._id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row group transition-shadow duration-300 hover:shadow-2xl">
                                <div className="md:w-1/3 lg:w-2/5">
                                <img src={item.coverImage.url} alt={item.coverImage.altText} className="w-full max-h-56 md:h-full object-cover cursor-pointer" onClick={() => handleViewDetails(item._id)} />
                            </div>
                            
                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                    <p className="text-gray-600 text-base mb-4">{item.summary}</p>
                                </div>
                                <div className="mt-6 flex justify-end">
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
            ) : (
                <p>Chưa có dự án nào để hiển thị.</p>
            )}
            {isModalOpen && selectedItemId && (
                <PortfolioDetailModal itemId={selectedItemId} onClose={handleCloseModal} />
            )}
        </>
    );
}