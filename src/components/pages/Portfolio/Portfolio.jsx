import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  Modal,
  Button,
  Input,
  Checkbox,
  message,
  DatePicker,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAuthContext } from '../../../contexts/AuthContext';
import {
  createPortfolio,
  getAllPortfolios,
  updatePortfolio,
  deletePortfolio
} from '../../../services/api/portfolio/portfolio';
import PortfolioDetail from './PortfolioDetail';

export default function PostPortfolioPage() {
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const defaultForm = {
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
  };

  const [form, setForm] = useState({ ...defaultForm });
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
    if (!title || !summary || !description || !myRole) {
      message.error('Vui lòng điền tất cả các trường bắt buộc');
      return;
    }

    const formData = new FormData();
    
    // Add all form fields except arrays
    for (const key in form) {
      if (key !== 'technologies' && key !== 'tags') {
        formData.append(key, form[key]);
      }
    }

    // Handle technologies and tags arrays
    if (form.technologies) {
      form.technologies.split(',').forEach(t => {
        const trimmed = t.trim();
        if (trimmed) formData.append('technologies', trimmed);
      });
    }

    if (form.tags) {
      form.tags.split(',').forEach(t => {
        const trimmed = t.trim();
        if (trimmed) formData.append('tags', trimmed);
      });
    }

    // Handle cover image
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    // Handle gallery files
    if (gallery) {
      Array.from(gallery).forEach(img => formData.append('gallery', img));
    }

    // IMPORTANT FIX: When editing and no new gallery files are selected,
    // don't send the existing gallery data as it will cause JSON parsing error
    // The backend will preserve existing gallery if no new files are provided

    setLoading(true);
    try {
      if (editingId) {
        await updatePortfolio(editingId, formData);
        message.success('Cập nhật thành công!');
      } else {
        await createPortfolio(formData);
        message.success('Đăng thành công!');
      }
      setOpen(false);
      setForm({ ...defaultForm });
      setCoverImage(null);
      setGallery(null);
      setEditingId(null);
      fetchPortfolios();
    } catch (err) {
      message.error('Có lỗi xảy ra.');
      console.error('Submit error:', err);
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
          onClick={() => {
            setForm({ ...defaultForm });
            setCoverImage(null);
            setGallery(null);
            setEditingId(null);
            setOpen(true);
          }}
        >
          Đăng Portfolio
        </Button>
      </div>

      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          setForm({ ...defaultForm });
          setCoverImage(null);
          setGallery(null);
          setEditingId(null);
        }}
        onOk={handleSubmit}
        okText={editingId ? 'Cập nhật' : 'Đăng dự án'}
        cancelText="Hủy"
        confirmLoading={loading}
        width={900}
        title={editingId ? 'Chỉnh sửa Portfolio' : 'Tạo Portfolio Mới'}
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
            value={form.projectStartDate ? dayjs(form.projectStartDate) : null}
            onChange={(date, dateString) =>
              setForm({ ...form, projectStartDate: dateString })
            }
          />
          <DatePicker
            placeholder="Ngày kết thúc"
            className="w-full"
            value={form.projectEndDate ? dayjs(form.projectEndDate) : null}
            onChange={(date, dateString) =>
              setForm({ ...form, projectEndDate: dateString })
            }
          />

          <div className="md:col-span-2">
            <label>Ảnh bìa {!editingId && '*'}</label>
            <Input type="file" onChange={(e) => setCoverImage(e.target.files[0])} />
            {editingId && (
              <small className="text-gray-500">Để trống nếu không muốn thay đổi ảnh bìa</small>
            )}
          </div>

          <div className="md:col-span-2">
            <label>Thư viện ảnh</label>
            <Input type="file" multiple onChange={(e) => setGallery(e.target.files)} />
            {editingId && (
              <small className="text-gray-500">Để trống nếu không muốn thay đổi thư viện ảnh</small>
            )}
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
            className="bg-white rounded-lg p-4 shadow hover:shadow-md cursor-pointer transition relative"
          >
            <img
              src={item.coverImage?.url}
              alt={item.title}
              className="w-full h-40 object-cover rounded mb-3"
              onClick={() => {
                setSelectedPortfolio(item);
                setDetailVisible(true);
              }}
            />
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.summary}</p>
            <div className="flex justify-between items-center mt-3">
              <Button size="small" onClick={() => {
                const { _id, gallery, coverImage, ...rest } = item; // Exclude gallery and coverImage
                setEditingId(_id);
                setForm({
                  ...rest,
                  technologies: item.technologies?.join(', ') || '',
                  tags: item.tags?.join(', ') || '',
                });
                setCoverImage(null); // Don't preset files
                setGallery(null); // Don't preset files
                setOpen(true);
              }}>
                Sửa
              </Button>

              <Button
                size="small"
                danger
                onClick={async () => {
                  try {
                    await deletePortfolio(item._id);
                    message.success('Đã xoá portfolio');
                    fetchPortfolios();
                  } catch (err) {
                    console.error(err);
                    message.error('Xoá thất bại');
                  }
                }}
              >
                Xoá
              </Button>
            </div>
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