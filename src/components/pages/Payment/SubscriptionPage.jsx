import React, { useState, useEffect } from "react";
import api from "@/services/api/axios";

const SubscriptionPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Lấy danh sách gói từ backend khi load trang
  // Trong SubscriptionPage.jsx, thay đổi:
  useEffect(() => {
    api
      .get("/subscription-plans/active")
      .then((res) => {
        console.log("Response:", res.data);

        // Handle response structure
        let plansData = [];
        if (res.data.success && res.data.data) {
          plansData = res.data.data;
        } else if (Array.isArray(res.data)) {
          plansData = res.data;
        }

        setPlans(plansData);
      })
      .catch((err) => {
        console.error("Error:", err);
        setError("Không lấy được danh sách gói");
      });
  }, []);

  const handlePay = async (plan) => {
    setLoading(true);
    setError("");
    console.log("Payment request:", {
      planId: plan._id,
      userToken: localStorage.getItem("token"),
      planData: plan,
    });
    try {
      const { data } = await api.post("/payment/create", {
        planId: plan._id,
      });
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        setError(data.message || "Không lấy được link thanh toán");
      }
    } catch (err) {
      setError("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-purple-50 to-pink-100 py-12 relative overflow-hidden">
      {/* Crystal gem sparkles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/6 w-3 h-3 bg-rose-300 transform rotate-45 animate-pulse opacity-40"></div>
        <div className="absolute top-40 right-1/4 w-2 h-2 bg-purple-300 rounded-full animate-bounce delay-300 opacity-50"></div>
        <div className="absolute bottom-32 left-1/3 w-4 h-4 bg-pink-300 transform rotate-45 animate-ping delay-700 opacity-30"></div>
        <div className="absolute top-60 right-1/2 w-2 h-2 bg-blue-300 rounded-full animate-pulse delay-500 opacity-60"></div>
        <div className="absolute bottom-20 right-1/5 w-3 h-3 bg-yellow-300 transform rotate-45 animate-bounce delay-1000 opacity-40"></div>
      </div>

      {/* Magical aura overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-rose-200/20 via-transparent to-purple-200/20 animate-pulse"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Steven Universe inspired title */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4 drop-shadow-lg">
              ✨ Chọn gói truy cập Community ✨
            </h1>
            {/* Star decorations */}
            <div className="absolute -top-2 -left-4 w-6 h-6 text-yellow-400 animate-spin">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-6 w-4 h-4 text-pink-400 animate-pulse">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 text-lg">
            Khám phá sức mạnh của Crystal Gems! 💎
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-lg shadow-md">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan, index) => {
            const gemThemes = [
              {
                name: "Rose Quartz",
                gradient: "from-rose-400 to-pink-500",
                bgGradient: "from-rose-50 to-pink-50",
                borderGradient: "from-rose-300 to-pink-400",
              },
              {
                name: "Amethyst",
                gradient: "from-purple-400 to-indigo-500",
                bgGradient: "from-purple-50 to-indigo-50",
                borderGradient: "from-purple-300 to-indigo-400",
              },
              {
                name: "Pearl",
                gradient: "from-blue-400 to-cyan-500",
                bgGradient: "from-blue-50 to-cyan-50",
                borderGradient: "from-blue-300 to-cyan-400",
              },
              {
                name: "Garnet",
                gradient: "from-red-400 to-purple-500",
                bgGradient: "from-red-50 to-purple-50",
                borderGradient: "from-red-300 to-purple-400",
              },
            ];

            const theme = gemThemes[index % gemThemes.length];

            return (
              <div key={plan._id} className="relative group">
                {/* Magical aura */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${theme.borderGradient} rounded-2xl opacity-0 group-hover:opacity-30 blur transition-all duration-700`}
                ></div>

                {/* Main card */}
                <div
                  className={`relative bg-gradient-to-br ${theme.bgGradient} backdrop-blur-sm rounded-2xl shadow-xl border-2 border-white/50 p-8 flex flex-col items-center transition-all duration-500 hover:scale-105 hover:shadow-2xl`}
                >
                  {/* Crystal sparkle decoration */}
                  <div className="absolute top-4 right-4 w-3 h-3 bg-white/60 transform rotate-45 animate-ping"></div>

                  {/* Plan name with gem theme */}
                  <h2
                    className={`text-2xl font-bold mb-3 bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent drop-shadow-sm`}
                  >
                    {plan.planName}
                  </h2>

                  {/* Price with magical styling */}
                  <div className="relative mb-4">
                    <div
                      className={`text-4xl font-bold bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent drop-shadow-lg`}
                    >
                      {plan.price.toLocaleString()}₫
                    </div>
                    {/* Price glow effect */}
                    <div
                      className={`absolute inset-0 text-4xl font-bold bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent opacity-50 blur-sm`}
                    >
                      {plan.price.toLocaleString()}₫
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6 text-gray-600 text-center font-medium px-2">
                    {plan.description}
                  </div>

                  {/* Features with gem bullets */}
                  <ul className="mb-8 text-sm text-gray-700 space-y-2 w-full">
                    {(plan.features || []).map((f, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 bg-gradient-to-r ${theme.gradient} rounded-full mt-2 flex-shrink-0`}
                        ></div>
                        <span className="leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Magical payment button */}
                  <button
                    className={`relative w-full bg-gradient-to-r ${theme.gradient} hover:shadow-xl text-white font-bold px-8 py-4 rounded-full transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group`}
                    onClick={() => handlePay(plan)}
                    disabled={loading}
                  >
                    {/* Button shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

                    {/* Button content */}
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Thanh toán qua VNPay
                        </>
                      )}
                    </span>
                  </button>

                  {/* Bottom sparkle */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/40 rounded-full animate-bounce delay-1000"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom magical decoration */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-gray-500">
            <div className="w-2 h-2 bg-rose-300 rounded-full animate-pulse"></div>
            <span className="text-sm">
              Được bảo vệ bởi sức mạnh Crystal Gems
            </span>
            <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse delay-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
