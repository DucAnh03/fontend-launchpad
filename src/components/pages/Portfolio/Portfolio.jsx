import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Input,
  Upload,
  Checkbox,
  message,
  DatePicker,
} from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useAuthContext } from '../../../contexts/AuthContext';
import {
  createPortfolio,
  getAllPortfolios,
} from '../../../services/api/portfolio/portfolio';
import PortfolioDetail from './PortfolioDetail';

export default function PostPortfolioPage() {
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const [form, setForm] = useState({
    title: '',
    summary: '',
    description: '',
    myRole: '',
    lessonsLearned: '',
    technologies: '',
    tags: '',
    liveUrl: '',
    sourceCodeUrl: '',
    projectStartDate: '',
    projectEndDate: '',
    isPublished: true,
  });

  const [coverImage, setCoverImage] = useState(null);
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const fetchPortfolios = async () => {
    try {
      const res = await getAllPortfolios();
      setPortfolios(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) fetchPortfolios();
  }, [user]);

  const handleSubmit = async () => {
    const { title, summary, description, myRole } = form;
    if (!title || !summary || !description || !myRole || !coverImage) {
      message.error('Vui lòng điền tất cả các trường bắt buộc');
      return;
    }

    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }

    form.technologies.split(',').forEach((t) =>
      formData.append('technologies', t.trim())
    );
    form.tags.split(',').forEach((t) => formData.append('tags', t.trim()));

    formData.append('coverImage', coverImage);
    if (gallery) {
      Array.from(gallery).forEach((img) => formData.append('gallery', img));
    }

    setLoading(true);
    try {
      await createPortfolio(formData);
      message.success('Đăng thành công!');
      setOpen(false);
      fetchPortfolios();
    } catch (err) {
      message.error('Có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return (
      <p className="text-center py-8">
        Bạn cần đăng nhập để sử dụng chức năng này.
      </p>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="text-right mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        >
          Đăng Portfolio
        </Button>
      </div>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        okText="Đăng dự án"
        cancelText="Hủy"
        confirmLoading={loading}
        width={900}
        title="Tạo Portfolio Mới"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="title" placeholder="Tiêu đề *" value={form.title} onChange={handleInput} />
          <Input name="summary" placeholder="Tóm tắt *" value={form.summary} onChange={handleInput} />
          <Input.TextArea name="description" placeholder="Mô tả chi tiết *" rows={3} value={form.description} onChange={handleInput} className="md:col-span-2" />
          <Input name="myRole" placeholder="Vai trò *" value={form.myRole} onChange={handleInput} />
          <Input name="lessonsLearned" placeholder="Bài học kinh nghiệm" value={form.lessonsLearned} onChange={handleInput} />
          <Input name="technologies" placeholder="Công nghệ (phẩy ,)" value={form.technologies} onChange={handleInput} />
          <Input name="tags" placeholder="Tags (phẩy ,)" value={form.tags} onChange={handleInput} />
          <Input name="liveUrl" placeholder="Live URL" value={form.liveUrl} onChange={handleInput} />
          <Input name="sourceCodeUrl" placeholder="Source Code URL" value={form.sourceCodeUrl} onChange={handleInput} />
          <DatePicker
            placeholder="Ngày bắt đầu"
            className="w-full"
            onChange={(date, dateString) =>
              setForm({ ...form, projectStartDate: dateString })
            }
          />
          <DatePicker
            placeholder="Ngày kết thúc"
            className="w-full"
            onChange={(date, dateString) =>
              setForm({ ...form, projectEndDate: dateString })
            }
          />

          <div className="md:col-span-2">
            <label>Ảnh bìa *</label>
            <Input type="file" onChange={(e) => setCoverImage(e.target.files[0])} />
          </div>

          <div className="md:col-span-2">
            <label>Thư viện ảnh</label>
            <Input type="file" multiple onChange={(e) => setGallery(e.target.files)} />
          </div>

          <div className="md:col-span-2">
            <Checkbox name="isPublished" checked={form.isPublished} onChange={handleInput}>
              Công khai dự án này
            </Checkbox>
          </div>
        </div>
      </Modal>

      {/* Danh sách portfolio */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {portfolios.map((item) => (
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
        ))}
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
