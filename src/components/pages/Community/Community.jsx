// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "@/services/api/axios";

// export default function Community() {
//   const [hasAccess, setHasAccess] = useState(null); // null: loading, false: không có quyền, true: có quyền
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     api
//       .get("/communities/access")
//       .then((res) => {
//         if (res.data.hasAccess) setHasAccess(true);
//         else setHasAccess(false);
//       })
//       .catch((err) => {
//         if (err.response && err.response.status === 403) {
//           setHasAccess(false);
//         } else {
//           setError("Lỗi kết nối server");
//         }
//       });
//   }, []);

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-orange-50 to-pink-100 px-4 relative overflow-hidden">
//         {/* Sad floating elements */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute top-20 left-1/6 w-3 h-3 bg-red-300/40 transform rotate-45 animate-pulse opacity-50"></div>
//           <div className="absolute bottom-32 right-1/4 w-2 h-2 bg-orange-300/50 rounded-full animate-bounce delay-700 opacity-40"></div>
//           <div className="absolute top-60 left-1/3 w-4 h-4 bg-pink-300/30 transform rotate-45 animate-pulse delay-1000 opacity-60"></div>
//         </div>

//         <div className="relative bg-gradient-to-br from-white via-red-50/30 to-orange-50/30 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/60 p-8 max-w-md w-full text-center">
//           {/* Error gem icon */}
//           <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-400 to-orange-400 rounded-full flex items-center justify-center shadow-xl">
//             <svg
//               className="w-8 h-8 text-white"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </div>
//           <div className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent font-bold text-lg">
//             💔 Oops! Có lỗi xảy ra
//           </div>
//           <p className="mt-2 text-gray-600">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (hasAccess === null) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 px-4 relative overflow-hidden">
//         {/* Loading sparkles */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute top-20 left-1/6 w-2 h-2 bg-blue-300 rounded-full animate-ping delay-100 opacity-60"></div>
//           <div className="absolute top-40 right-1/4 w-3 h-3 bg-purple-300 transform rotate-45 animate-pulse delay-300 opacity-50"></div>
//           <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-pink-300 rounded-full animate-bounce delay-500 opacity-70"></div>
//           <div className="absolute top-60 right-1/2 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-700 opacity-80"></div>
//         </div>

//         <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/60 p-8 max-w-md w-full text-center">
//           {/* Loading gem with spinning effect */}
//           <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
//             <svg
//               className="w-8 h-8 text-white animate-spin"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//             </svg>
//           </div>

//           {/* Loading rings */}
//           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-blue-300/30 rounded-full animate-ping"></div>
//           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-purple-300/20 rounded-full animate-ping delay-300"></div>

//           <div className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-bold text-lg">
//             ✨ Đang kiểm tra quyền truy cập...
//           </div>
//           <p className="mt-2 text-gray-600">
//             Crystal Gems đang xác thực sức mạnh của bạn!
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!hasAccess) {
//     return (
//       <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
//         {/* Background phủ kín content Community */}
//         <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-100 via-pink-50 to-rose-100" />
//         {/* Invitation sparkles */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute top-20 left-1/6 w-4 h-4 bg-purple-300 transform rotate-45 animate-bounce opacity-40"></div>
//           <div className="absolute top-32 right-1/4 w-3 h-3 bg-pink-300 rounded-full animate-ping delay-300 opacity-60"></div>
//           <div className="absolute bottom-40 left-1/4 w-5 h-5 bg-rose-300 transform rotate-45 animate-pulse delay-700 opacity-50"></div>
//           <div className="absolute top-60 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-500 opacity-70"></div>
//           <div className="absolute bottom-32 right-1/5 w-3 h-3 bg-pink-400 transform rotate-45 animate-ping delay-1000 opacity-40"></div>
//           <div className="absolute top-40 left-1/2 w-2 h-2 bg-rose-400 rounded-full animate-pulse delay-200 opacity-80"></div>
//         </div>

//         {/* Magical invitation aura */}
//         <div className="absolute inset-0 bg-gradient-to-r from-purple-200/20 via-transparent to-pink-200/20 animate-pulse"></div>

//         <div className="relative group max-w-2xl w-full">
//           {/* Magical glow aura */}
//           <div className="absolute -inset-6 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-500 rounded-3xl opacity-20 group-hover:opacity-30 blur-xl transition-all duration-1000 animate-pulse"></div>

//           {/* Main invitation card */}
//           <div className="relative bg-gradient-to-br from-white via-purple-50/50 to-pink-50/50 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/60 p-12 text-center transition-all duration-700 hover:scale-105">
//             {/* Floating stars around the card */}
//             <div className="absolute -top-4 -left-4 w-8 h-8 text-purple-400 animate-spin">
//               <svg fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//               </svg>
//             </div>
//             <div className="absolute -top-3 -right-5 w-6 h-6 text-pink-400 animate-pulse">
//               <svg fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//               </svg>
//             </div>
//             <div className="absolute -bottom-4 -left-3 w-7 h-7 text-rose-400 animate-bounce delay-500">
//               <svg fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//               </svg>
//             </div>
//             <div className="absolute -bottom-3 -right-4 w-5 h-5 text-purple-400 animate-ping delay-700">
//               <svg fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//               </svg>
//             </div>

//             {/* Crystal Gems invitation icon */}
//             <div className="relative mb-8">
//               <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
//                 <div className="w-20 h-20 bg-gradient-to-r from-purple-300 to-pink-400 rounded-full flex items-center justify-center">
//                   <svg
//                     className="w-12 h-12 text-white"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//               </div>
//               {/* Invitation rings */}
//               <div className="absolute inset-0 w-24 h-24 mx-auto border-4 border-purple-300/40 rounded-full animate-ping"></div>
//               <div className="absolute inset-0 w-24 h-24 mx-auto border-2 border-pink-300/30 rounded-full animate-ping delay-300"></div>
//             </div>

//             {/* Invitation title */}
//             <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent drop-shadow-lg">
//               🌟 Lời mời tham gia Crystal Gems! 🌟
//             </h1>

//             {/* Invitation message */}
//             <div className="mb-8 space-y-4">
//               <p className="text-xl text-gray-700 leading-relaxed">
//                 <span className="text-3xl">💎</span> Bạn chưa có quyền truy cập
//                 vào cộng đồng của chúng tôi
//               </p>
//             </div>

//             {/* Magical join button */}
//             <button
//               className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white font-bold px-12 py-5 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 group overflow-hidden text-lg"
//               onClick={() => navigate("/subscription-plans/active")}
//             >
//               {/* Button shimmer effect */}
//               <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

//               <span className="relative z-10 flex items-center justify-center gap-3">
//                 <svg
//                   className="w-6 h-6"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                 </svg>
//                 Gia nhập Crystal Gems ngay!
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M13 7l5 5m0 0l-5 5m5-5H6"
//                   />
//                 </svg>
//               </span>
//             </button>
//           </div>
//         </div>

//         {/* Large floating magical elements */}
//         <div className="absolute top-1/6 left-1/6 w-10 h-10 text-purple-300/50 animate-bounce delay-1000 opacity-60">
//           <svg fill="currentColor" viewBox="0 0 20 20">
//             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//           </svg>
//         </div>
//         <div className="absolute bottom-1/6 right-1/6 w-8 h-8 text-pink-300/60 animate-pulse delay-1500 opacity-70">
//           <svg fill="currentColor" viewBox="0 0 20 20">
//             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//           </svg>
//         </div>
//       </div>
//     );
//   }
//   // Nếu có quyền truy cập
//   return (
//     <section style={{ padding: 24 }}>
//       <h1>Community</h1>
//       <p>Đây là nơi hiển thị các bài viết, thảo luận hoặc nhóm cộng đồng.</p>
//     </section>
//   );
// }

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { message, Spin } from "antd";
import api from "@/services/api/axios";
import { useAuthContext } from "@/contexts/AuthContext";
import "./Community.css";

// Import components
import CommunityPostCard from "./components/CommunityPostCard";
import CommunityGroupCard from "./components/CommunityGroupCard";
import CommunityEventCard from "./components/CommunityEventCard";
import CommunityMemberCard from "./components/CommunityMemberCard";
import CreateContentModal from "./components/CreateContentModal";

// Icons (sử dụng SVG thay vì Antd icons)
const SearchIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default function Community() {
  // States
  const [hasAccess, setHasAccess] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(false);

  // Data states
  const [communityPosts, setCommunityPosts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);

  // UI states
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const { user } = useAuthContext();
  const navigate = useNavigate();

  // Tab configuration
  const tabs = [
    {
      key: "posts",
      label: "Bài viết",
      icon: "📝",
      count: communityPosts.length,
    },
    { key: "groups", label: "Nhóm", icon: "👥", count: groups.length },
    { key: "members", label: "Thành viên", icon: "👤", count: members.length },
    { key: "events", label: "Sự kiện", icon: "⭐", count: events.length },
  ];

  // Check community access
  useEffect(() => {
    const checkAccess = async () => {
      try {
        console.log("🔍 Checking community access...");
        const response = await api.get("/communities/access");
        console.log("✅ Access response:", response.data);

        if (response.data.hasAccess) {
          setHasAccess(true);
        } else {
          setHasAccess(false);
        }
      } catch (err) {
        console.error("❌ Access error:", err);
        if (err.response && err.response.status === 403) {
          setHasAccess(false);
        } else {
          setError("Lỗi kết nối server");
        }
      }
    };

    if (user) {
      checkAccess();
    }
  }, [user]);

  // Fetch community data
  const fetchCommunityData = useCallback(
    async (tab = activeTab, page = 1, isNewSearch = false) => {
      if (!hasAccess) return;

      try {
        setLoading(true);
        const endpoint = `/communities/${tab}`;

        const params = {
          page,
          limit: 10,
          ...(searchKeyword && { keyword: searchKeyword }),
        };

        console.log(`🚀 Fetching ${tab} data:`, params);
        const response = await api.get(endpoint, { params });

        if (response.data.success) {
          const data = response.data.data;
          const newItems = data.items || data[tab] || [];
          const pagination = data.pagination;

          console.log(`📦 Received ${newItems.length} ${tab}`);

          // Update state based on tab
          const updateState = {
            posts: setCommunityPosts,
            groups: setGroups,
            members: setMembers,
            events: setEvents,
          };

          if (updateState[tab]) {
            if (isNewSearch || page === 1) {
              updateState[tab](newItems);
            } else {
              updateState[tab]((prev) => [...prev, ...newItems]);
            }
          }

          if (pagination) {
            setHasMore(pagination.hasNext);
            setCurrentPage(page);
            setTotalCount(pagination.total || 0);
          }
        }
      } catch (err) {
        console.error(`❌ Error fetching ${tab}:`, err);
        message.error(`Không thể tải dữ liệu ${tab}`);
      } finally {
        setLoading(false);
      }
    },
    [hasAccess, activeTab, searchKeyword]
  );

  // Load data when tab changes
  useEffect(() => {
    if (hasAccess) {
      fetchCommunityData(activeTab, 1, true);
    }
  }, [hasAccess, activeTab]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCommunityData(activeTab, 1, true);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchCommunityData(activeTab, currentPage + 1);
    }
  };

  // Handle tab change
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setCurrentPage(1);
    setSearchKeyword("");
  };

  // Render loading state
  if (hasAccess === null) {
    return (
      <div className="community-loading">
        <div className="loading-container">
          <div className="loading-gem">
            <div className="gem-sparkle"></div>
            <div className="gem-sparkle"></div>
            <div className="gem-sparkle"></div>
          </div>
          <Spin size="large" />
          <p className="loading-text">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="community-error">
        <div className="error-container">
          <div className="error-icon">💔</div>
          <h2 className="error-title">Có lỗi xảy ra</h2>
          <p className="error-message">{error}</p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Render no access state
  if (!hasAccess) {
    return (
      <div className="community-no-access">
        <div className="no-access-background">
          <div className="floating-gems">
            <div className="floating-gem gem-1">💎</div>
            <div className="floating-gem gem-2">✨</div>
            <div className="floating-gem gem-3">🌟</div>
            <div className="floating-gem gem-4">💫</div>
          </div>
        </div>

        <div className="no-access-content">
          <div className="access-card">
            <div className="access-icon">
              <div className="gem-icon">💎</div>
            </div>

            <h1 className="access-title">
              🌟 Chào mừng đến Crystal Gems Community! 🌟
            </h1>

            <div className="access-description">
              <p className="access-text">
                💎 Bạn chưa có quyền truy cập vào cộng đồng độc quyền của chúng
                tôi
              </p>
              <p className="access-subtext">
                Hãy nâng cấp tài khoản để tham gia cộng đồng Crystal Gems và
                khám phá những tính năng tuyệt vời!
              </p>
            </div>

            <button
              className="upgrade-button"
              onClick={() => navigate("/subscription-plans/active")}
            >
              <StarIcon />
              <span>Gia nhập Crystal Gems ngay!</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render main community interface
  return (
    <div className="community-page">
      <div className="community-container">
        {/* Header */}
        <div className="community-header">
          <div className="header-content">
            <div className="header-info">
              <h1 className="community-title">🌟 Crystal Gems Community</h1>
              <p className="community-subtitle">
                Kết nối, chia sẻ và phát triển cùng nhau
              </p>
            </div>

            <button
              className="create-button"
              onClick={() => setShowCreateModal(true)}
            >
              <PlusIcon />
              <span>Tạo mới</span>
            </button>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <SearchIcon />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder={`Tìm kiếm ${tabs
                  .find((t) => t.key === activeTab)
                  ?.label.toLowerCase()}...`}
                className="search-input"
              />
            </div>
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? "Đang tìm..." : "Tìm kiếm"}
            </button>
          </form>
        </div>

        {/* Tabs */}
        <div className="community-tabs">
          <div className="tab-list">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`tab-button ${
                  activeTab === tab.key ? "active" : ""
                }`}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
                <span className="tab-count">{tab.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="community-content">
          <div className="content-header">
            <h2 className="content-title">
              {searchKeyword
                ? `Kết quả tìm kiếm cho "${searchKeyword}" (${totalCount})`
                : `${
                    tabs.find((t) => t.key === activeTab)?.label
                  } (${totalCount})`}
            </h2>
          </div>

          <div className="content-body">
            {activeTab === "posts" && (
              <CommunityPostsList
                posts={communityPosts}
                loading={loading}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                user={user}
              />
            )}

            {activeTab === "groups" && (
              <CommunityGroupsList
                groups={groups}
                loading={loading}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                user={user}
              />
            )}

            {activeTab === "members" && (
              <CommunityMembersList
                members={members}
                loading={loading}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                user={user}
              />
            )}

            {activeTab === "events" && (
              <CommunityEventsList
                events={events}
                loading={loading}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                user={user}
              />
            )}
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateContentModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchCommunityData(activeTab, 1, true);
          }}
          user={user}
        />
      )}
    </div>
  );
}

// Component Lists
const CommunityPostsList = ({ posts, loading, hasMore, onLoadMore, user }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>Chưa có bài viết nào</h3>
        <p>Hãy là người đầu tiên tạo bài viết trong cộng đồng!</p>
      </div>
    );
  }

  return (
    <div className="posts-list">
      {posts.map((post) => (
        <CommunityPostCard key={post._id} post={post} user={user} />
      ))}

      {hasMore && (
        <div className="load-more-container">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="load-more-button"
          >
            {loading ? "Đang tải..." : "Xem thêm"}
          </button>
        </div>
      )}
    </div>
  );
};

const CommunityGroupsList = ({
  groups,
  loading,
  hasMore,
  onLoadMore,
  user,
}) => {
  if (!groups || groups.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">👥</div>
        <h3>Chưa có nhóm nào</h3>
        <p>Tạo nhóm đầu tiên để kết nối với mọi người!</p>
      </div>
    );
  }

  return (
    <div className="groups-grid">
      {groups.map((group) => (
        <CommunityGroupCard key={group._id} group={group} user={user} />
      ))}

      {hasMore && (
        <div className="load-more-container">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="load-more-button"
          >
            {loading ? "Đang tải..." : "Xem thêm"}
          </button>
        </div>
      )}
    </div>
  );
};

const CommunityMembersList = ({
  members,
  loading,
  hasMore,
  onLoadMore,
  user,
}) => {
  if (!members || members.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">👤</div>
        <h3>Chưa có thành viên nào</h3>
        <p>Mời bạn bè tham gia cộng đồng!</p>
      </div>
    );
  }

  return (
    <div className="members-grid">
      {members.map((member) => (
        <CommunityMemberCard key={member._id} member={member} user={user} />
      ))}

      {hasMore && (
        <div className="load-more-container">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="load-more-button"
          >
            {loading ? "Đang tải..." : "Xem thêm"}
          </button>
        </div>
      )}
    </div>
  );
};

const CommunityEventsList = ({
  events,
  loading,
  hasMore,
  onLoadMore,
  user,
}) => {
  if (!events || events.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">⭐</div>
        <h3>Chưa có sự kiện nào</h3>
        <p>Tạo sự kiện đầu tiên cho cộng đồng!</p>
      </div>
    );
  }

  return (
    <div className="events-list">
      {events.map((event) => (
        <CommunityEventCard key={event._id} event={event} user={user} />
      ))}

      {hasMore && (
        <div className="load-more-container">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="load-more-button"
          >
            {loading ? "Đang tải..." : "Xem thêm"}
          </button>
        </div>
      )}
    </div>
  );
};
