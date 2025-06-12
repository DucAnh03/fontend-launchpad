import { useState, useEffect } from "react";
import { Form, Input, Button, message, Card, Modal, Upload, Space, Popconfirm, Tag } from "antd";
import { UploadOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import InfiniteScroll from 'react-infinite-scroll-component';
import api from "@/services/api/axios";
import { useAuthContext } from "@/contexts/AuthContext";

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
        
        // Kiểm tra xem còn bài post nào để load không
        setHasMore(posts.length + newPosts.length < total);
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
      formData.append("content", values.content);
      
      // Handle tags
      if (values.tags) {
        const tagsArray = values.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        formData.append("tags", JSON.stringify(tagsArray));
      }
      
      // Handle images
      let mediaUrls = [];
      fileList.forEach((file) => {
        if (file.originFileObj) {
          // New uploaded files
          formData.append("images", file.originFileObj);
        } else if (file.url) {
          // Existing files that weren't deleted
          mediaUrls.push(file.url);
        }
      });

      if (editingPost) {
        // Always send mediaUrls as a JSON stringified array
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
      fetchPosts();
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
      fetchPosts();
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
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {editingPost ? "Chỉnh sửa bài viết" : "Tạo bài Post mới"}
          </h1>

          {/* Search Bar */}
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Tìm kiếm theo tiêu đề hoặc tags..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onPressEnter={handleSearch}
              className="flex-1"
              prefix={<SearchOutlined className="text-gray-400" />}
            />
            <Button 
              type="primary"
              onClick={handleSearch}
              loading={isSearching}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Tìm kiếm
            </Button>
          </div>
        </div>

        {user && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <Form 
              form={form}
              layout="vertical" 
              onFinish={onFinish}
              className="space-y-6"
            >
              <Form.Item 
                name="title" 
                label={<span className="text-gray-700 font-medium">Tiêu đề</span>} 
                rules={[{ required: true }]}
              >
                <Input className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </Form.Item>
              
              <Form.Item 
                name="content" 
                label={<span className="text-gray-700 font-medium">Nội dung</span>} 
                rules={[{ required: true }]}
              >
                <Input.TextArea 
                  rows={6} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </Form.Item>

              <Form.Item 
                name="tags" 
                label={<span className="text-gray-700 font-medium">Tags (phân cách bằng dấu phẩy)</span>}
              >
                <Input 
                  placeholder="Ví dụ: học tập, công nghệ, chia sẻ"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-gray-700 font-medium">Hình ảnh</span>}
              >
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
                  className="w-full"
                >
                  <div>
                    <UploadOutlined />
                    <div className="mt-2">Chọn ảnh</div>
                  </div>
                </Upload>
              </Form.Item>

              <div className="flex items-center gap-4">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  className="bg-blue-500 text-white hover:bg-blue-600 px-6 py-2 rounded-md"
                >
                  {editingPost ? "Cập nhật" : "Đăng Post"}
                </Button>
                {editingPost && (
                  <Button 
                    onClick={handleCancel}
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-2 rounded-md"
                  >
                    Hủy
                  </Button>
                )}
              </div>
            </Form>
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {searchKeyword ? `Kết quả tìm kiếm cho "${searchKeyword}"` : "Danh sách bài viết"}
          </h2>
          
          <InfiniteScroll
            dataLength={posts.length}
            next={loadMoreData}
            hasMore={hasMore}
            loader={
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              </div>
            }
            endMessage={
              <div className="text-center py-4 text-gray-500">
                {posts.length > 0 ? "Đã hiển thị tất cả bài viết" : "Không tìm thấy bài viết nào"}
              </div>
            }
          >
            {posts.map((post) => (
              <div 
                key={post._id} 
                className="bg-white rounded-lg shadow-sm overflow-hidden mb-6"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
                    {user && post.authorId && String(post.authorId._id) === String(user._id) && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-blue-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50"
                        >
                          <EditOutlined />
                        </button>
                        <Popconfirm
                          title="Bạn có chắc muốn xóa bài viết này?"
                          onConfirm={() => handleDelete(post._id)}
                          okText="Có"
                          cancelText="Không"
                        >
                          <button className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50">
                            <DeleteOutlined />
                          </button>
                        </Popconfirm>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4 whitespace-pre-wrap">{post.content}</p>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <Tag key={index} color="blue">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  )}
                  
                  {post.mediaUrls?.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                      {post.mediaUrls.map((image, index) => (
                        <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                          <img 
                            src={image}
                            alt={`Post image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
}
