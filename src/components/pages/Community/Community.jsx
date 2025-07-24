import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api/axios";

export default function Community() {
  const [hasAccess, setHasAccess] = useState(null); // null: loading, false: không có quyền, true: có quyền
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/communities/access")
      .then((res) => {
        if (res.data.hasAccess) setHasAccess(true);
        else setHasAccess(false);
      })
      .catch((err) => {
        if (err.response && err.response.status === 403) {
          setHasAccess(false);
        } else {
          setError("Lỗi kết nối server");
        }
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-orange-50 to-pink-100 px-4 relative overflow-hidden">
        {/* Sad floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/6 w-3 h-3 bg-red-300/40 transform rotate-45 animate-pulse opacity-50"></div>
          <div className="absolute bottom-32 right-1/4 w-2 h-2 bg-orange-300/50 rounded-full animate-bounce delay-700 opacity-40"></div>
          <div className="absolute top-60 left-1/3 w-4 h-4 bg-pink-300/30 transform rotate-45 animate-pulse delay-1000 opacity-60"></div>
        </div>

        <div className="relative bg-gradient-to-br from-white via-red-50/30 to-orange-50/30 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/60 p-8 max-w-md w-full text-center">
          {/* Error gem icon */}
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-400 to-orange-400 rounded-full flex items-center justify-center shadow-xl">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent font-bold text-lg">
            💔 Oops! Có lỗi xảy ra
          </div>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (hasAccess === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 px-4 relative overflow-hidden">
        {/* Loading sparkles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/6 w-2 h-2 bg-blue-300 rounded-full animate-ping delay-100 opacity-60"></div>
          <div className="absolute top-40 right-1/4 w-3 h-3 bg-purple-300 transform rotate-45 animate-pulse delay-300 opacity-50"></div>
          <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-pink-300 rounded-full animate-bounce delay-500 opacity-70"></div>
          <div className="absolute top-60 right-1/2 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-700 opacity-80"></div>
        </div>

        <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/60 p-8 max-w-md w-full text-center">
          {/* Loading gem with spinning effect */}
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
            <svg
              className="w-8 h-8 text-white animate-spin"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>

          {/* Loading rings */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-blue-300/30 rounded-full animate-ping"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-purple-300/20 rounded-full animate-ping delay-300"></div>

          <div className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-bold text-lg">
            ✨ Đang kiểm tra quyền truy cập...
          </div>
          <p className="mt-2 text-gray-600">
            Crystal Gems đang xác thực sức mạnh của bạn!
          </p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
        {/* Background phủ kín content Community */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-100 via-pink-50 to-rose-100" />
        {/* Invitation sparkles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/6 w-4 h-4 bg-purple-300 transform rotate-45 animate-bounce opacity-40"></div>
          <div className="absolute top-32 right-1/4 w-3 h-3 bg-pink-300 rounded-full animate-ping delay-300 opacity-60"></div>
          <div className="absolute bottom-40 left-1/4 w-5 h-5 bg-rose-300 transform rotate-45 animate-pulse delay-700 opacity-50"></div>
          <div className="absolute top-60 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-500 opacity-70"></div>
          <div className="absolute bottom-32 right-1/5 w-3 h-3 bg-pink-400 transform rotate-45 animate-ping delay-1000 opacity-40"></div>
          <div className="absolute top-40 left-1/2 w-2 h-2 bg-rose-400 rounded-full animate-pulse delay-200 opacity-80"></div>
        </div>

        {/* Magical invitation aura */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-200/20 via-transparent to-pink-200/20 animate-pulse"></div>

        <div className="relative group max-w-2xl w-full">
          {/* Magical glow aura */}
          <div className="absolute -inset-6 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-500 rounded-3xl opacity-20 group-hover:opacity-30 blur-xl transition-all duration-1000 animate-pulse"></div>

          {/* Main invitation card */}
          <div className="relative bg-gradient-to-br from-white via-purple-50/50 to-pink-50/50 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/60 p-12 text-center transition-all duration-700 hover:scale-105">
            {/* Floating stars around the card */}
            <div className="absolute -top-4 -left-4 w-8 h-8 text-purple-400 animate-spin">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="absolute -top-3 -right-5 w-6 h-6 text-pink-400 animate-pulse">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="absolute -bottom-4 -left-3 w-7 h-7 text-rose-400 animate-bounce delay-500">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="absolute -bottom-3 -right-4 w-5 h-5 text-purple-400 animate-ping delay-700">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>

            {/* Crystal Gems invitation icon */}
            <div className="relative mb-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-300 to-pink-400 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              {/* Invitation rings */}
              <div className="absolute inset-0 w-24 h-24 mx-auto border-4 border-purple-300/40 rounded-full animate-ping"></div>
              <div className="absolute inset-0 w-24 h-24 mx-auto border-2 border-pink-300/30 rounded-full animate-ping delay-300"></div>
            </div>

            {/* Invitation title */}
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent drop-shadow-lg">
              🌟 Lời mời tham gia Crystal Gems! 🌟
            </h1>

            {/* Invitation message */}
            <div className="mb-8 space-y-4">
              <p className="text-xl text-gray-700 leading-relaxed">
                <span className="text-3xl">💎</span> Bạn chưa có quyền truy cập
                vào cộng đồng của chúng tôi
              </p>
            </div>

            {/* Magical join button */}
            <button
              className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white font-bold px-12 py-5 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 group overflow-hidden text-lg"
              onClick={() => navigate("/subscription-plans/active")}
            >
              {/* Button shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

              <span className="relative z-10 flex items-center justify-center gap-3">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Gia nhập Crystal Gems ngay!
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Large floating magical elements */}
        <div className="absolute top-1/6 left-1/6 w-10 h-10 text-purple-300/50 animate-bounce delay-1000 opacity-60">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <div className="absolute bottom-1/6 right-1/6 w-8 h-8 text-pink-300/60 animate-pulse delay-1500 opacity-70">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </div>
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
