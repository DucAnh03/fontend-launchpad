import { useState, useEffect } from "react";
import { Form, Input, Button, message, Card, Modal, Upload, Space, Popconfirm, Tag } from "antd";
import { UploadOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import InfiniteScroll from 'react-infinite-scroll-component';
import api from "@/services/api/axios";
import { useAuthContext } from "@/contexts/AuthContext";
import CommentSection from "@/components/pages/PostPage/CommentSection";
import PostVote from "@/components/pages/PostPage/PostVote";

export default function PostPage() {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [form] = Form.useForm();
  const [editingPost, setEditingPost] = useState(null);
  const { user } = useAuthContext();
  const [fileList, setFileList] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchPosts = async (page = 1, isNewSearch = false) => {
    try {
      setLoading(true);
      let response;
      if (searchKeyword) {
        response = await api.get(`/posts/search?keyword=${searchKeyword}&page=${page}&limit=10`);
      } else {
        response = await api.get(`/posts?page=${page}&limit=10`);
      }
      if (response.data.success && response.data.data) {
        const newPosts = response.data.data.posts || [];
        const total = response.data.data.pagination.total;
        if (isNewSearch) {
          setPosts(newPosts);
        } else {
          setPosts(prevPosts => [...prevPosts, ...newPosts]);
        }
        // Fix: pagination should consider isNewSearch for correct count
        setHasMore((isNewSearch ? 0 : posts.length) + newPosts.length < total);
        setCurrentPage(page);
      }
    } catch (err) {
      message.error(err.response?.data?.message || "Không thể tải danh sách bài viết!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1, true);
    // eslint-disable-next-line
  }, [user]);

  const handleSearch = async () => {
    setIsSearching(true);
    setCurrentPage(1);
    setPosts([]);
    await fetchPosts(1, true);
    setIsSearching(false);
  };

  const loadMoreData = () => {
    if (!loading && hasMore) {
      fetchPosts(currentPage + 1);
    }
  };

  const onFinish = async (values) => {
    if (!user) {
      message.error("Vui lòng đăng nhập để thực hiện chức năng này!");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content || "");
      // Handle tags
      if (values.tags) {
        const tagsArray = values.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        const tagsJson = JSON.stringify(tagsArray);
        formData.append("tags", tagsJson);
      }
      // Handle images
      let mediaUrls = [];
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("images", file.originFileObj);
        } else if (file.url) {
          mediaUrls.push(file.url);
        }
      });
      if (editingPost) {
        formData.append("mediaUrls", JSON.stringify(mediaUrls));
        await api.put(`/posts/${editingPost._id}`, formData);
        message.success("Cập nhật bài viết thành công!");
      } else {
        await api.post("/posts", formData);
        message.success("Tạo bài viết thành công!");
      }
      form.resetFields();
      setFileList([]);
      setEditingPost(null);
      setCurrentPage(1);
      setPosts([]);
      fetchPosts(1, true);
    } catch (err) {
      console.error('Error details:', err.response?.data);
      message.error(editingPost ? "Cập nhật thất bại!" : "Tạo bài viết thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!user) {
      message.error("Vui lòng đăng nhập để thực hiện chức năng này!");
      return;
    }
    try {
      setLoading(true);
      await api.delete(`/posts/${postId}`);
      message.success("Xóa bài viết thành công!");
      setCurrentPage(1);
      setPosts([]);
      fetchPosts(1, true);
    } catch (err) {
      message.error("Xóa bài viết thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post) => {
    if (!user) {
      message.error("Vui lòng đăng nhập để thực hiện chức năng này!");
      return;
    }
    setEditingPost(post);
    form.resetFields();
    // Convert existing images to fileList format
    const existingImages = post.mediaUrls?.map((url, index) => ({
      uid: `-${index}`,
      name: `image-${index}`,
      status: 'done',
      url: url,
      thumbUrl: url,
      type: 'image/jpeg',
      size: 0,
      response: { url: url },
      xhr: { status: 200 }
    })) || [];
    setFileList(existingImages);
    form.setFieldsValue({
      title: post.title,
      content: post.content,
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : ''
    });
  };

  const handleCancel = () => {
    setEditingPost(null);
    setFileList([]);
    form.resetFields();
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
            {editingPost ? "Chỉnh sửa bài viết" : "Bảng tin"}
          </h1>
          {/* Search Bar */}
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Input
                placeholder="Tìm kiếm bài viết..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onPressEnter={handleSearch}
                className="w-full pl-10 pr-4 py-3 rounded-full border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              />
              <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <Button 
              type="primary"
              onClick={handleSearch}
              loading={isSearching}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none rounded-full px-6 h-12 shadow-md transition-all duration-200"
            >
              Tìm kiếm
            </Button>
          </div>
        </div>
        {user && (
          <>
            {/* Create Post Button */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="flex-1 text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-all duration-200"
                >
                  Bạn đang nghĩ gì?
                </button>
                <Button 
                  type="primary"
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none rounded-full px-6 shadow-md"
                >
                  Tạo bài
                </Button>
              </div>
            </div>
            {/* Modal Form - Only show when creating/editing */}
            {(editingPost || showCreateModal) && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {editingPost ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
                      </h3>
                      <button 
                        onClick={handleCancel}
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name || 'Người dùng'}</div>
                        <div className="text-xs text-gray-500">Công khai</div>
                      </div>
                    </div>
                    <Form 
                      form={form}
                      layout="vertical" 
                      onFinish={onFinish}
                      className="space-y-4"
                    >
                      <Form.Item 
                        name="title" 
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                      >
                        <Input 
                          placeholder="Tiêu đề bài viết..."
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200" 
                        />
                      </Form.Item>
                      <Form.Item 
                        name="content"
                      >
                        <Input.TextArea 
                          rows={4} 
                          placeholder="Bạn đang nghĩ gì?"
                          className="w-full px-4 py-3 border-none focus:ring-0 focus:border-none transition-all duration-200 resize-none"
                          style={{ boxShadow: 'none' }}
                        />
                      </Form.Item>
                      <Form.Item name="tags">
                        <Input 
                          placeholder="Thêm tags... (ví dụ: học tập, công nghệ)"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                        />
                      </Form.Item>
                      <Form.Item>
                        <Upload
                          listType="picture-card"
                          maxCount={20}
                          beforeUpload={() => false}
                          fileList={fileList}
                          onChange={({ fileList }) => {
                            const updatedFileList = fileList.map(file => {
                              if (file.originFileObj) {
                                return {
                                  ...file,
                                  url: URL.createObjectURL(file.originFileObj),
                                  thumbUrl: URL.createObjectURL(file.originFileObj)
                                };
                              }
                              return file;
                            });
                            setFileList(updatedFileList);
                          }}
                          className="w-full upload-modern"
                        >
                          <div className="flex flex-col items-center justify-center p-4">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                              <UploadOutlined className="text-blue-500 text-lg" />
                            </div>
                            <div className="text-sm text-gray-600">Thêm ảnh</div>
                          </div>
                        </Upload>
                      </Form.Item>
                    </Form>
                  </div>
                  <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-2xl">
                    <div className="flex items-center justify-end gap-3">
                      <Button 
                        onClick={handleCancel}
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200 px-6 py-2.5 h-auto rounded-full transition-all duration-200"
                      >
                        Hủy
                      </Button>
                      <Form.Item className="mb-0">
                        <Button 
                          type="primary" 
                          onClick={() => form.submit()}
                          loading={loading}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none text-white px-8 py-2.5 h-auto rounded-full shadow-md transition-all duration-200 font-medium"
                        >
                          {editingPost ? "Cập nhật" : "Đăng bài"}
                        </Button>
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
            {searchKeyword ? `Kết quả tìm kiếm cho "${searchKeyword}"` : "Bài viết"}
          </h2>
          <InfiniteScroll
            dataLength={posts.length}
            next={loadMoreData}
            hasMore={hasMore}
            loader={
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto"></div>
              </div>
            }
            endMessage={
              <div className="text-center py-6 text-gray-500 text-sm">
                {posts.length > 0 ? "Bạn đã xem hết tất cả bài viết" : "Không tìm thấy bài viết nào"}
              </div>
            }
          >
            {posts.map((post) => (
              <div 
                key={post._id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5 transition-all duration-200 hover:shadow-md"
              >
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {post.authorId?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{post.authorId?.name || 'Người dùng'}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        {user && post.authorId && String(post.authorId._id) === String(user._id) && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEdit(post)}
                              className="text-gray-400 hover:text-blue-500 p-2 rounded-full hover:bg-blue-50 transition-all duration-200"
                            >
                              <EditOutlined />
                            </button>
                            <Popconfirm
                              title="Bạn có chắc muốn xóa bài viết này?"
                              onConfirm={() => handleDelete(post._id)}
                              okText="Có"
                              cancelText="Không"
                              placement="bottomRight"
                            >
                              <button className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-all duration-200">
                                <DeleteOutlined />
                              </button>
                            </Popconfirm>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{post.title}</h3>
                  {post.content && post.content !== "undefined" && (
                    <p className="text-gray-700 mb-4 whitespace-pre-wrap leading-relaxed">{post.content}</p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <Tag 
                          key={index} 
                          className="bg-blue-50 text-blue-600 border-blue-100 rounded-full px-3 py-1 text-xs font-medium"
                        >
                          #{tag}
                        </Tag>
                      ))}
                    </div>
                  )}
                  {post.mediaUrls?.length > 0 && (
                    <div className={`grid gap-2 mt-4 ${
                      post.mediaUrls.length === 1 ? 'grid-cols-1' :
                      post.mediaUrls.length === 2 ? 'grid-cols-2' :
                      post.mediaUrls.length === 3 ? 'grid-cols-2' :
                      'grid-cols-2 sm:grid-cols-3'
                    }`}>
                      {post.mediaUrls.map((image, index) => {
                        if (post.mediaUrls.length === 3 && index === 0) {
                          return (
                            <div key={index} className="col-span-2 aspect-video relative rounded-xl overflow-hidden">
                              <img 
                                src={image || "/placeholder.svg"}
                                alt={`Post image ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                              />
                            </div>
                          );
                        }
                        return (
                          <div key={index} className={`${post.mediaUrls.length === 1 ? 'aspect-video' : 'aspect-square'} relative rounded-xl overflow-hidden`}>
                            <img 
                              src={image || "/placeholder.svg"}
                              alt={`Post image ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {/* Phần Vote cho bài viết */}
                  <PostVote
                    postId={post._id}
                    initialUpvotes={post.upvotedBy?.length || 0}
                    initialDownvotes={post.downvotedBy?.length || 0}
                  />
                  {/* Comment section */}
                  <div className="mt-6 px-2">
                    <CommentSection postId={post._id} />
                  </div>
                </div>
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
}