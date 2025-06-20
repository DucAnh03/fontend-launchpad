import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PaymentSuccess = () => {
  const query = useQuery();
  const orderId = query.get('orderId');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-100 via-purple-50 to-pink-100 px-4 relative overflow-hidden">
      {/* Celebration sparkles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/6 w-4 h-4 bg-yellow-300 transform rotate-45 animate-bounce opacity-60"></div>
        <div className="absolute top-32 right-1/4 w-3 h-3 bg-pink-300 rounded-full animate-ping delay-300 opacity-70"></div>
        <div className="absolute bottom-40 left-1/4 w-5 h-5 bg-purple-300 transform rotate-45 animate-pulse delay-700 opacity-50"></div>
        <div className="absolute top-60 right-1/3 w-2 h-2 bg-blue-300 rounded-full animate-bounce delay-500 opacity-80"></div>
        <div className="absolute bottom-32 right-1/5 w-4 h-4 bg-rose-300 transform rotate-45 animate-ping delay-1000 opacity-60"></div>
        <div className="absolute top-40 left-1/2 w-3 h-3 bg-green-300 rounded-full animate-pulse delay-200 opacity-70"></div>
      </div>
  
      {/* Magical celebration aura */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/20 via-transparent to-pink-200/20 animate-pulse"></div>
  
      {/* Success card with Steven Universe styling */}
      <div className="relative group">
        {/* Magical glow aura */}
        <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 rounded-3xl opacity-20 group-hover:opacity-30 blur-xl transition-all duration-1000 animate-pulse"></div>
        
        {/* Main success card */}
        <div className="relative bg-gradient-to-br from-white via-yellow-50/50 to-pink-50/50 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/60 p-10 max-w-lg w-full text-center transition-all duration-700 hover:scale-105">
          
          {/* Floating stars around the card */}
          <div className="absolute -top-3 -left-3 w-6 h-6 text-yellow-400 animate-spin">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div className="absolute -top-2 -right-4 w-4 h-4 text-pink-400 animate-pulse">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div className="absolute -bottom-3 -left-2 w-5 h-5 text-purple-400 animate-bounce delay-500">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div className="absolute -bottom-2 -right-3 w-3 h-3 text-rose-400 animate-ping delay-700">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
  
          {/* Steven's star shield success icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white animate-spin" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            {/* Celebration rings */}
            <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-yellow-300/50 rounded-full animate-ping"></div>
            <div className="absolute inset-0 w-20 h-20 mx-auto border-2 border-pink-300/30 rounded-full animate-ping delay-300"></div>
          </div>
  
          {/* Success title with Steven Universe styling */}
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
            🎉 Thanh toán thành công! 🎉
          </h1>
  
          {/* Success message */}
          <div className="mb-6 space-y-3">
            <p className="text-gray-700 text-lg leading-relaxed">
              <span className="text-2xl">💎</span> Chào mừng bạn đến với Crystal Gems Community!
            </p>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border border-purple-200">
              <p className="text-sm text-gray-600 mb-2">Mã đơn hàng của bạn:</p>
              <span className="font-mono text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent break-words" style={{ overflowWrap: 'anywhere' }}>
                {orderId}
              </span>
            </div>
          </div>
  
          {/* Action buttons with gem styling */}
          <div className="space-y-4">
            <button
              className="relative w-full bg-gradient-to-r from-rose-400 via-purple-500 to-pink-500 hover:from-rose-500 hover:via-purple-600 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group overflow-hidden"
              onClick={() => navigate('/community')}
            >
              {/* Button shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              
              <span className="relative z-10 flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Khám phá Community ngay!
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
  
            <button
              className="relative w-full bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 font-semibold px-6 py-3 rounded-full border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 hover:scale-105 group"
              onClick={() => navigate('/')}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay về trang chủ
              </span>
            </button>
          </div>
  
          {/* Bottom celebration message */}
          <div className="mt-8 pt-6 border-t border-purple-100">
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <span className="text-lg">✨</span>
              Cảm ơn bạn đã tin tưởng Crystal Gems!
              <span className="text-lg">✨</span>
            </p>
          </div>
        </div>
      </div>
  
      {/* Floating celebration elements */}
      <div className="absolute top-1/4 left-1/4 w-8 h-8 text-yellow-300 animate-bounce delay-1000 opacity-60">
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>
      <div className="absolute bottom-1/4 right-1/4 w-6 h-6 text-pink-300 animate-pulse delay-1500 opacity-70">
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>
    </div>
  );
};

export default PaymentSuccess; 