import React, { useState, useEffect } from 'react';
import { getPortfolioById, IPortfolioItem } from '../../../../services/api/portfolio/portfolio'; 
import * as Fe from 'react-icons/fi';

interface PortfolioDetailModalProps {
  itemId: string;
  onClose: () => void;
}

export default function PortfolioDetailModal({ itemId, onClose }: PortfolioDetailModalProps) {
    const [item, setItem] = useState<IPortfolioItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
              onClose();
           }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl z-10"
                >
                   
                    {/* @ts-ignore */}
                    <Fe.FiX />
                </button>

                {loading && <div className="p-20 text-center font-semibold">Đang tải chi tiết...</div>}
                {error && <div className="p-20 text-center text-red-500 font-semibold">{error}</div>}

                {item && (
                    <div>
                        <img src={item.coverImage.url} alt={item.coverImage.altText} className="w-full h-72 object-cover rounded-t-lg" />
                        <div className="p-8">
                            <h1 className="text-4xl font-bold mb-4 text-gray-900">{item.title}</h1>
                            <p className="text-lg text-gray-600 mb-6">{item.summary}</p>

                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-3 border-b pb-2">Mô tả chi tiết</h3>
                                <div className="text-gray-700 whitespace-pre-wrap prose max-w-none">{item.description}</div>
                            </div>
                            
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-3 border-b pb-2">Bài học kinh nghiệm</h3>
                                <p className="text-gray-700 italic">{item.lessonsLearned || "Chưa có"}</p>
                            </div>

                             <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-3 border-b pb-2">Công nghệ</h3>
                                <div className="flex flex-wrap gap-2">
                                    {item.technologies.map(tech => (
                                        <span key={tech} className="bg-sky-100 text-sky-800 text-sm font-medium px-3 py-1 rounded-full">{tech}</span>
                                    ))}
                                </div>
                            </div>
                            
                            {item.gallery && item.gallery.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold mb-3 border-b pb-2">Thư viện ảnh</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {item.gallery.map((img, index) => (
                                            <img key={index} src={img.url} alt={img.caption} className="rounded-lg object-cover w-full h-32" />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-4 mt-8 border-t pt-6">
                                {item.liveUrl && (
                                    <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                        {/* @ts-ignore */}
                                        <Fe.FiExternalLink />
                                        Live Demo
                                    </a>
                                )}
                                {item.sourceCodeUrl && (
                                    <a href={item.sourceCodeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors">
                                        {/* @ts-ignore */}
                                        <Fe.FiGithub />
                                        Source Code
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