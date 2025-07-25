import React, { useEffect, useState } from 'react';
import { Spin, Tag, message } from 'antd';
import api from '@/services/api/axios';
import { useAuthContext } from '@/contexts/AuthContext';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function PostsList({ userId: propUserId }) {
  const { user } = useAuthContext();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Fetch posts by author with pagination
  const fetchPosts = async (page = 1) => {
    const id = propUserId || user?._id;
    if (!id) return;
    try {
      setLoading(true);
      const res = await api.get(`/posts/author/${id}?page=${page}&limit=${limit}`);
      const newPosts = res.data.data.posts || [];
      const total = res.data.data.pagination?.total || 0;
      if (page === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      setHasMore(posts.length + newPosts.length < total);
      setCurrentPage(page);
    } catch (err) {
      message.error('Không load được posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = propUserId || user?._id;
    if (id) fetchPosts(1);
    // eslint-disable-next-line
  }, [propUserId, user]);

  const loadMoreData = () => {
    if (!loading && hasMore) {
      fetchPosts(currentPage + 1);
    }
  };

  if (loading && posts.length === 0) return (
    <div className="flex justify-center items-center min-h-[200px]">
      <Spin size="large" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
        Các Bài Viết Đã Đăng
      </h2>
      {posts.length === 0 ? (
        <div className="text-center py-6 text-gray-500 text-sm">
          Bạn chưa đăng bài viết nào.
        </div>
      ) : (
        <InfiniteScroll
          dataLength={posts.length}
          next={loadMoreData}
          hasMore={hasMore}
          loader={
            <div className="text-center py-6">
              <Spin />
            </div>
          }
          endMessage={
            <div className="text-center py-6 text-gray-500 text-sm">
              {posts.length > 0 ? "Bạn đã xem hết tất cả bài viết" : "Không tìm thấy bài viết nào"}
            </div>
          }
        >
          <div className="space-y-5">
            {posts.map((post) => (
              <div key={post._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5 transition-all duration-200 hover:shadow-md">
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
                    <div className={`grid gap-2 mt-4 ${post.mediaUrls.length === 1 ? 'grid-cols-1' :
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
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
} 