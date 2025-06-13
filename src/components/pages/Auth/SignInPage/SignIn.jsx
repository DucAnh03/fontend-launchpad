// src/pages/auth/SignIn.tsx
import React, { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebookF,
  FaApple,
  FaUserShield,
  FaExclamationCircle,
} from "react-icons/fa";
import "./SignIn.css";

export default function SignIn() {
  const { login, loginWithGoogle, loginWithFacebook, loading } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    try {
      await login(email, password);
    } catch (err) {
      setError("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
    }
  };

  // Add animation on component mount
  useEffect(() => {
    const formElements = document.querySelectorAll('.glass-card > *');
    formElements.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `all 0.5s ease ${i * 0.1}s`;
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 100);
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute w-64 h-64 rounded-full bg-purple-300 opacity-20 -top-32 -left-32 floating"></div>
        <div className="absolute w-96 h-96 rounded-full bg-indigo-300 opacity-20 -bottom-48 -right-48 floating-2"></div>
        <div className="absolute w-80 h-80 rounded-full bg-pink-300 opacity-20 top-1/3 -right-20 floating-3"></div>
        <div className="absolute w-72 h-72 rounded-full bg-blue-300 opacity-20 bottom-1/4 left-20 floating"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card p-8 text-white">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUserShield className="text-3xl" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="opacity-80">Sign in to access your account</p>
          </div>

          {error && (
            <div className="error-message bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg p-3 flex items-center space-x-2">
              <FaExclamationCircle className="text-red-400" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="opacity-70" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field w-full py-3 pl-10 pr-4 rounded-lg text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="opacity-70" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field w-full py-3 pl-10 pr-10 rounded-lg text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  >
                    {showPassword ? <FaEyeSlash className="opacity-70 hover:opacity-100" /> : <FaEye className="opacity-70 hover:opacity-100" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded bg-white bg-opacity-20 border-white border-opacity-30 focus:ring-white focus:ring-opacity-30"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm">Remember me</label>
                </div>
                <a href="#" className="text-sm font-medium hover:underline">Forgot password?</a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 px-4 rounded-lg font-semibold text-white relative overflow-hidden"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-white border-opacity-30"></div>
              <span className="flex-shrink mx-4 text-sm opacity-70">OR CONTINUE WITH</span>
              <div className="flex-grow border-t border-white border-opacity-30"></div>
            </div>

            <div className="flex justify-center space-x-6">
              <button
                type="button"
                onClick={loginWithGoogle}
                className="social-icon w-12 h-12 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20"
              >
                <FaGoogle className="text-xl" />
              </button>
              <button
                type="button"
                className="social-icon w-12 h-12 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20"
              >
                <FaApple className="text-xl" />
              </button>
              <button
                type="button"
                onClick={loginWithFacebook}
                className="social-icon w-12 h-12 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20"
              >
                <FaFacebookF className="text-xl" />
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <p>Don't have an account? <a href="/signup" className="font-medium hover:underline">Sign up</a></p>
          </div>
        </div>

        <div className="mt-6 text-center text-white text-opacity-70 text-xs">
          <p>By continuing, you agree to our <a href="#" className="hover:underline">Terms of Service</a> and <a href="#" className="hover:underline">Privacy Policy</a>.</p>
        </div>
      </div>
    </div>
  );
}
