import React, { useEffect, useState } from 'react';
import { Spin, message, Modal } from 'antd';
import api from '@/services/api/axios';
import { useAuthContext } from '@/contexts/AuthContext';
import PortfolioDetail from '../Portfolio/PortfolioDetail';

export default function PortfolioList() {
  const { user } = useAuthContext();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const fetchPortfolios = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const res = await api.get(`/portfolio/author/${user._id}`);
      setPortfolios(res.data.data || []);
    } catch (err) {
      message.error('Không load được portfolio');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchPortfolios();
  }, [user]);

  if (!user)
    return (
      <p className="text-center py-8">
        Bạn cần đăng nhập để sử dụng chức năng này.
      </p>
    );

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
        Portfolio của bạn
      </h2>
      {/* Danh sách portfolio */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {portfolios.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-8">Bạn chưa có portfolio nào.</div>
        ) : (
          portfolios.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg p-4 shadow hover:shadow-md cursor-pointer transition"
              onClick={() => {
                setSelectedPortfolio(item);
                setDetailVisible(true);
              }}
            >
              <img
                src={item.coverImage?.url}
                alt={item.title}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.summary}</p>
            </div>
          ))
        )}
      </div>
      <Modal
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={900}
      >
        <PortfolioDetail portfolio={selectedPortfolio} />
      </Modal>
    </div>
  );
} 