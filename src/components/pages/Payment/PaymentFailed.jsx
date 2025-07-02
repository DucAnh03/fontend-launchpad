import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PaymentFailed = () => {
  const query = useQuery();
  const orderId = query.get('orderId');
  const reason = query.get('reason');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 via-orange-50 to-pink-100 px-4 relative overflow-hidden">
      {/* Sad floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/6 w-3 h-3 bg-red-300/60 transform rotate-45 animate-pulse opacity-40"></div>
        <div className="absolute top-40 right-1/4 w-2 h-2 bg-orange-300/50 rounded-full animate-bounce delay-500 opacity-50"></div>
        <div className="absolute bottom-32 left-1/4 w-4 h-4 bg-pink-300/40 transform rotate-45 animate-pulse delay-1000 opacity-30"></div>
        <div className="absolute top-60 right-1/3 w-2 h-2 bg-red-400/60 rounded-full animate-bounce delay-700 opacity-60"></div>
        <div className="absolute bottom-40 right-1/5 w-3 h-3 bg-orange-400/50 transform rotate-45 animate-pulse delay-300 opacity-40"></div>
      </div>
  
      {/* Gentle sad aura */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-200/10 via-transparent to-orange-200/10 animate-pulse"></div>
  
      {/* Failure card with Steven Universe styling */}
      <div className="relative group">
        {/* Soft glow aura - less intense than success */}
        <div className="absolute -inset-4 bg-gradient-to-r from-red-300 via-orange-300 to-pink-400 rounded-3xl opacity-10 group-hover:opacity-15 blur-xl transition-all duration-1000"></div>
        
        {/* Main failure card */}
        <div className="relative bg-gradient-to-br from-white via-red-50/30 to-orange-50/30 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/60 p-10 max-w-lg w-full text-center transition-all duration-700 hover:scale-105">
          
          {/* Gentle floating elements around the card */}
          <div className="absolute -top-3 -left-3 w-4 h-4 text-red-400/60 animate-pulse">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="absolute -top-2 -right-4 w-3 h-3 text-orange-400/50 animate-bounce delay-300">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="absolute -bottom-3 -left-2 w-3 h-3 text-pink-400/60 animate-pulse delay-700">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="absolute -bottom-2 -right-3 w-2 h-2 text-red-400/50 animate-bounce delay-1000">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
  
          {/* Steven's cracked shield failure icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-red-400 to-orange-400 rounded-full flex items-center justify-center shadow-2xl">
              <div className="w-16 h-16 bg-gradient-to-r from-red-300 to-orange-300 rounded-full flex items-center justify-center relative">
                {/* Cracked shield effect */}
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {/* Crack lines */}
                <div className="absolute inset-0 opacity-30">
                  <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
                    <path d="M20 15 L35 30 L25 45" stroke="white" strokeWidth="1" opacity="0.6"/>
                    <path d="M44 20 L30 35 L40 50" stroke="white" strokeWidth="1" opacity="0.4"/>
                  </svg>
                </div>
              </div>
            </div>
            {/* Gentle warning rings */}
            <div className="absolute inset-0 w-20 h-20 mx-auto border-2 border-red-300/30 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-20 h-20 mx-auto border border-orange-300/20 rounded-full animate-pulse delay-500"></div>
          </div>
  
          {/* Failure title with gentle Steven Universe styling */}
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-500 via-orange-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
            😔 Thanh toán thất bại
          </h1>
  
          {/* Failure message with empathy */}
          <div className="mb-6 space-y-4">
            <p className="text-gray-700 text-lg leading-relaxed">
              <span className="text-2xl">💔</span> Đừng lo lắng! Mọi Crystal Gem đều gặp khó khăn đôi khi.
            </p>
            
            {/* Order details */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
              <p className="text-sm text-gray-600 mb-2">Mã đơn hàng:</p>
              <div className="font-mono text-sm font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent break-words" style={{ overflowWrap: 'anywhere' }}>
                {orderId}
              </div>
            </div>
  
            {/* Reason with gentle styling */}
            <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-4 border border-orange-200">
              <p className="text-sm text-gray-600 mb-2">Lý do:</p>
              <span className="text-red-600 font-medium">
                {reason || 'Không xác định'}
              </span>
            </div>
  
         
          </div>
  
          {/* Action buttons with gentle gem styling */}
          <div className="space-y-4">
            <button
              className="relative w-full bg-gradient-to-r from-rose-400 via-purple-500 to-pink-500 hover:from-rose-500 hover:via-purple-600 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group overflow-hidden"
              onClick={() => navigate('/subscription')}
            >
              {/* Button shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              
              <span className="relative z-10 flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Thử lại!
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </span>
            </button>
  
            <button
              className="relative w-full bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 font-semibold px-6 py-3 rounded-full border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 hover:scale-105 group"
              onClick={() => navigate('/')}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Về nhà nghỉ ngơi
              </span>
            </button>
          </div>
  
          {/* Bottom encouraging message */}
          <div className="mt-8 pt-6 border-t border-red-100">
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <span className="text-lg">🌟</span>
              Đừng bỏ cuộc! Crystal Gems luôn ở đây hỗ trợ bạn
              <span className="text-lg">🌟</span>
            </p>
          </div>
        </div>
      </div>
  
      {/* Gentle floating comfort elements */}
      <div className="absolute top-1/4 left-1/4 w-6 h-6 text-blue-300/60 animate-bounce delay-1000 opacity-50">
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </svg>
      </div>
      <div className="absolute bottom-1/4 right-1/4 w-5 h-5 text-purple-300/50 animate-pulse delay-1500 opacity-60">
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </svg>
      </div>
    </div>
  );
};

export default PaymentFailed; 