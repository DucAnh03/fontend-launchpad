import React, { useState } from 'react';
import { useAuthContext } from '../../../contexts/AuthContext';
import { createPortfolio } from '../../../services/api/portfolio/portfolio';

export default function PostPortfolioPage() {
  const { user } = useAuthContext();

  // State cho tất cả các trường trong form
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [myRole, setMyRole] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [tags, setTags] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [sourceCodeUrl, setSourceCodeUrl] = useState('');
  const [projectStartDate, setProjectStartDate] = useState('');
  const [projectEndDate, setProjectEndDate] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [gallery, setGallery] = useState(null);
  const [isPublished, setIsPublished] = useState(true);

  // State cho loading và error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!title || !summary || !description || !myRole || !coverImage) {
      setError('Vui lòng điền tất cả các trường có dấu *');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('description', description);
    formData.append('myRole', myRole);
    formData.append('lessonsLearned', lessonsLearned);
    formData.append('liveUrl', liveUrl);
    formData.append('sourceCodeUrl', sourceCodeUrl);
    formData.append('projectStartDate', projectStartDate);
    formData.append('projectEndDate', projectEndDate);
    formData.append('isPublished', isPublished);

    technologies.split(',').forEach(tech => {
      if (tech.trim()) formData.append('technologies', tech.trim());
    });

    tags.split(',').forEach(tag => {
      if (tag.trim()) formData.append('tags', tag.trim());
    });

    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    if (gallery) {
      for (let i = 0; i < gallery.length; i++) {
        formData.append('gallery', gallery[i]);
      }
    }
    
    try {
      await createPortfolio(formData);
      setSuccess('Tạo portfolio thành công! Bạn có thể làm mới trang để tạo dự án khác.');
    } catch (err) {
      setError('Có lỗi xảy ra, không thể tạo portfolio.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  if (!user) {
    return <p className="p-8 text-center">Bạn cần đăng nhập để sử dụng chức năng này.</p>
  }

  return (
    <section className="bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl space-y-6">
          <h1 className="text-3xl font-bold text-center mb-6">Tạo dự án Portfolio mới</h1>

          {/* ----- CÁC TRƯỜNG BẮT BUỘC ----- */}
          <div className="space-y-1">
            <label htmlFor="title" className="font-semibold">Tiêu đề dự án *</label>
            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 border rounded-lg" />
          </div>
          <div className="space-y-1">
            <label htmlFor="summary" className="font-semibold">Tóm tắt *</label>
            <textarea id="summary" value={summary} onChange={e => setSummary(e.target.value)} className="w-full p-3 border rounded-lg" />
          </div>
          <div className="space-y-1">
            <label htmlFor="description" className="font-semibold">Mô tả chi tiết *</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={6} className="w-full p-3 border rounded-lg" />
          </div>
          <div className="space-y-1">
            <label htmlFor="myRole" className="font-semibold">Vai trò của bạn *</label>
            <input type="text" id="myRole" value={myRole} onChange={e => setMyRole(e.target.value)} className="w-full p-3 border rounded-lg" />
          </div>
          <div className="space-y-1">
            <label htmlFor="coverImage" className="font-semibold">Ảnh bìa *</label>
            <input type="file" id="coverImage" onChange={e => setCoverImage(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
          </div>

          {/* ----- CÁC TRƯỜNG TÙY CHỌN (ĐÃ ĐƯỢC THÊM ĐẦY ĐỦ) ----- */}
          <div className="space-y-1">
            <label htmlFor="lessonsLearned" className="font-semibold">Bài học kinh nghiệm</label>
            <textarea id="lessonsLearned" value={lessonsLearned} onChange={e => setLessonsLearned(e.target.value)} rows={3} className="w-full p-3 border rounded-lg" />
          </div>
          <div className="space-y-1">
            <label htmlFor="technologies" className="font-semibold">Công nghệ (cách nhau bởi dấu phẩy)</label>
            <input type="text" id="technologies" value={technologies} onChange={e => setTechnologies(e.target.value)} placeholder="React, Node.js, MongoDB..." className="w-full p-3 border rounded-lg" />
          </div>
           <div className="space-y-1">
            <label htmlFor="tags" className="font-semibold">Tags (cách nhau bởi dấu phẩy)</label>
            <input type="text" id="tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="Education, E-commerce..." className="w-full p-3 border rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-1">
                <label htmlFor="liveUrl" className="font-semibold">Live URL</label>
                <input type="url" id="liveUrl" value={liveUrl} onChange={e => setLiveUrl(e.target.value)} className="w-full p-3 border rounded-lg" />
             </div>
             <div className="space-y-1">
                <label htmlFor="sourceCodeUrl" className="font-semibold">Source Code URL</label>
                <input type="url" id="sourceCodeUrl" value={sourceCodeUrl} onChange={e => setSourceCodeUrl(e.target.value)} className="w-full p-3 border rounded-lg" />
             </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-1">
                  <label htmlFor="projectStartDate" className="font-semibold">Ngày bắt đầu</label>
                  <input type="date" id="projectStartDate" value={projectStartDate} onChange={e => setProjectStartDate(e.target.value)} className="w-full p-3 border rounded-lg" />
             </div>
             <div className="space-y-1">
                  <label htmlFor="projectEndDate" className="font-semibold">Ngày kết thúc</label>
                  <input type="date" id="projectEndDate" value={projectEndDate} onChange={e => setProjectEndDate(e.target.value)} className="w-full p-3 border rounded-lg" />
             </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="gallery" className="font-semibold">Thư viện ảnh (chọn nhiều file)</label>
            <input type="file" id="gallery" multiple onChange={e => setGallery(e.target.files)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
          </div>
          <div className="flex items-center">
             <input type="checkbox" id="isPublished" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
             <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">Công khai dự án này</label>
          </div>
          
          {/* ----- SUBMIT & MESSAGES ----- */}
          {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}
          {success && <p className="text-center text-green-500 bg-green-100 p-3 rounded-lg">{success}</p>}

          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-400">
            {loading ? 'Đang đăng...' : 'Đăng dự án'}
          </button>
        </form>
      </div>
    </section>
  );
}