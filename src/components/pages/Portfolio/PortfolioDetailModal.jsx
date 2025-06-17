import React, { useState, useEffect } from 'react';
// Đảm bảo đường dẫn này đúng với cấu trúc dự án của bạn
import { getPortfolioById } from '../../../services/api/portfolio/portfolio';

// Component nhận 2 props:
// 1. itemId: ID của dự án cần hiển thị
// 2. onClose: Hàm để đóng modal, được gọi từ component cha
export default function PortfolioDetailModal({ itemId, onClose }) {
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Sử dụng useEffect để gọi API mỗi khi itemId thay đổi
    useEffect(() => {
        if (!itemId) return;

        const fetchItemDetails = async () => {
            try {
                setLoading(true);
                const fetchedItem = await getPortfolioById(itemId);
                setItem(fetchedItem);
            } catch (err) {
                setError("Không thể tải chi tiết dự án.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchItemDetails();
    }, [itemId]);

    // Thêm chức năng đóng modal khi nhấn phím Escape
    useEffect(() => {
        const handleEsc = (event) => {
           if (event.key === 'Escape') {
              onClose();
           }
        };
        window.addEventListener('keydown', handleEsc);

        // Dọn dẹp event listener khi component bị unmount
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);


    return (
        // Lớp phủ nền mờ
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 animate-fade-in"
            onClick={onClose} // Đóng modal khi click ra ngoài
        >
            {/* Nội dung Modal */}
            <div 
                className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()} // Ngăn việc click vào form làm đóng modal
            >
                {/* Nút đóng */}
                <button 
                    onClick={onClose}
                    className="sticky top-4 right-4 float-right text-gray-500 hover:text-gray-800 text-3xl z-10 bg-white/50 rounded-full w-10 h-10 flex items-center justify-center"
                >
                    &times;
                </button>

                {loading && <div className="p-10 text-center font-semibold">Đang tải chi tiết dự án...</div>}
                {error && <div className="p-10 text-center text-red-500 font-semibold">{error}</div>}

                {/* --- HIỂN THỊ DỮ LIỆU KHI CÓ ITEM --- */}
                {item && (
                    <div>
                        <img src={item.coverImage.url} alt={item.coverImage.altText} className="w-full h-80 object-cover" />
                        
                        <div className="p-8 md:p-10">
                            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-gray-900">{item.title}</h1>
                            <p className="text-lg text-gray-500 mb-6">Vai trò: <span className="font-medium text-gray-700">{item.myRole}</span></p>

                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-3 border-b pb-2">Tóm tắt</h3>
                                <p className="text-gray-700 leading-relaxed">{item.summary}</p>
                            </div>
                            
                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-3 border-b pb-2">Mô tả chi tiết</h3>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{item.description}</p>
                            </div>

                             <div className="mb-8">
                                <h3 className="text-xl font-bold mb-3 border-b pb-2">Công nghệ sử dụng</h3>
                                <div className="flex flex-wrap gap-3">
                                    {item.technologies.map(tech => (
                                        <span key={tech} className="bg-sky-100 text-sky-800 text-sm font-semibold px-4 py-1.5 rounded-full">{tech}</span>
                                    ))}
                                </div>
                            </div>
                            
                            {item.gallery && item.gallery.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold mb-3 border-b pb-2">Thư viện ảnh</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {item.gallery.map((img, index) => (
                                            <a key={index} href={img.url} target="_blank" rel="noopener noreferrer">
                                                <img src={img.url} alt={img.caption} className="rounded-lg object-cover w-full h-40 transform hover:scale-105 transition-transform duration-300" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-4 mt-8 border-t pt-6">
                                {item.liveUrl && (
                                    <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                                        Xem Live Demo
                                    </a>
                                )}
                                {item.sourceCodeUrl && (
                                    <a href={item.sourceCodeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-black transition-colors font-semibold">
                                        Xem mã nguồn
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}