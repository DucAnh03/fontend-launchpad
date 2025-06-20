import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api/axios';

export default function Community() {
  const [hasAccess, setHasAccess] = useState(null); // null: loading, false: không có quyền, true: có quyền
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/communities/access')
      .then(res => {
        if (res.data.hasAccess) setHasAccess(true);
        else setHasAccess(false);
      })
      .catch(err => {
        if (err.response && err.response.status === 403) {
          setHasAccess(false);
        } else {
          setError('Lỗi kết nối server');
        }
      });
  }, []);

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  if (hasAccess === null) {
    return <div className="p-8 text-center">Đang kiểm tra quyền truy cập...</div>;
  }
  if (!hasAccess) {
    return (
      <section className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Bạn chưa đăng ký gói Community</h1>
        <p className="mb-4 text-gray-600">Vui lòng đăng ký gói để truy cập các tính năng cộng đồng.</p>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded"
          onClick={() => navigate('/subscription')}
        >
          Đăng ký ngay
        </button>
      </section>
    );
  }
  // Nếu có quyền truy cập
  return (
    <section style={{ padding: 24 }}>
      <h1>Community</h1>
      <p>Đây là nơi hiển thị các bài viết, thảo luận hoặc nhóm cộng đồng.</p>
    </section>
  );
}
