// Community.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api/axios";
import CommunityDashboard from "@/components/Community/CommunityDashboard";

export default function Community() {
  const [hasAccess, setHasAccess] = useState(null); // null: loading
  const [subscription, setSubscription] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    checkCommunityAccess();
  }, []);

  const checkCommunityAccess = async () => {
    try {
      // Check if user has active subscription
      const subRes = await api.get("/payment/subscription");

      if (subRes.data.success && subRes.data.data) {
        const sub = subRes.data.data;
        setSubscription(sub);

        // Check if subscription is active and has community access
        const isActive =
          sub.status === "active" && new Date(sub.expiresAt) > new Date();
        const hasCommunityAccess =
          sub.plan?.permissions?.includes("community_access");

        if (isActive && hasCommunityAccess) {
          // Double check with community access endpoint
          const accessRes = await api.get("/communities/access");
          setHasAccess(accessRes.data.hasAccess);
        } else {
          setHasAccess(false);
        }
      } else {
        setHasAccess(false);
      }
    } catch (err) {
      console.error("Error checking community access:", err);
      if (err.response?.status === 404) {
        // No subscription found
        setHasAccess(false);
      } else {
        setError("Lỗi kết nối server");
      }
    }
  };

  // Loading state
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
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
            <svg
              className="w-8 h-8 text-white animate-spin"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>

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

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-orange-50 to-pink-100 px-4">
        <div className="bg-gradient-to-br from-white via-red-50/30 to-orange-50/30 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/60 p-8 max-w-md w-full text-center">
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
          <button
            onClick={checkCommunityAccess}
            className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // No access - show subscription plans
  if (!hasAccess) {
    return (
      <div className="relative h-full w-full flex items-center justify-center overflow-hidden min-h-screen">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-100 via-pink-50 to-rose-100" />

        {/* Sparkles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/6 w-4 h-4 bg-purple-300 transform rotate-45 animate-bounce opacity-40"></div>
          <div className="absolute top-32 right-1/4 w-3 h-3 bg-pink-300 rounded-full animate-ping delay-300 opacity-60"></div>
          <div className="absolute bottom-40 left-1/4 w-5 h-5 bg-rose-300 transform rotate-45 animate-pulse delay-700 opacity-50"></div>
          <div className="absolute top-60 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-500 opacity-70"></div>
        </div>

        <div className="relative group max-w-2xl w-full mx-4">
          <div className="absolute -inset-6 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-500 rounded-3xl opacity-20 group-hover:opacity-30 blur-xl transition-all duration-1000 animate-pulse"></div>

          <div className="relative bg-gradient-to-br from-white via-purple-50/50 to-pink-50/50 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/60 p-12 text-center transition-all duration-700 hover:scale-105">
            {/* Crystal icon */}
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
              <div className="absolute inset-0 w-24 h-24 mx-auto border-4 border-purple-300/40 rounded-full animate-ping"></div>
            </div>

            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent drop-shadow-lg">
              🌟 Lời mời tham gia Crystal Gems! 🌟
            </h1>

            <div className="mb-8 space-y-4">
              <p className="text-xl text-gray-700 leading-relaxed">
                <span className="text-3xl">💎</span> Bạn chưa có quyền truy cập
                vào cộng đồng của chúng tôi
              </p>

              {subscription && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-gray-600">
                  <p className="font-semibold text-yellow-800 mb-1">
                    Thông tin gói hiện tại:
                  </p>
                  <p>Gói: {subscription.plan?.planName || "Không xác định"}</p>
                  <p>
                    Trạng thái:{" "}
                    {subscription.status === "active"
                      ? "Đang hoạt động"
                      : "Không hoạt động"}
                  </p>
                  {subscription.expiresAt && (
                    <p>
                      Hết hạn:{" "}
                      {new Date(subscription.expiresAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white font-bold px-12 py-5 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 group overflow-hidden text-lg"
              onClick={() => navigate("/subscription-plans/active")}
            >
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
      </div>
    );
  }

  // Has access - show community dashboard
  return <CommunityDashboard subscription={subscription} />;
}
