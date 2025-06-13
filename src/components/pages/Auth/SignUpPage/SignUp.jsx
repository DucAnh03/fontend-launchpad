import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  FaUser,
  FaUserCircle,
} from "react-icons/fa";
import "./SignUp.css";
import { postRegister } from "@/services/api/auth/register";

export default function SignUp() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithFacebook, loading } = useAuthContext();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      await postRegister({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      navigate("/verify-signup", { state: { email: formData.email, password: formData.password } });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Đăng ký thất bại");
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
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="opacity-80">Join our community today</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="opacity-70" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field w-full py-3 pl-10 pr-4 rounded-lg text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserCircle className="opacity-70" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className="input-field w-full py-3 pl-10 pr-4 rounded-lg text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30"
                    placeholder="johndoe"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="opacity-70" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
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
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
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

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="opacity-70" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 px-4 rounded-lg font-semibold text-white relative overflow-hidden"
            >
              {loading ? "Creating Account..." : "Create Account"}
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
            <p>Already have an account? <a href="/signin" className="font-medium hover:underline">Sign in</a></p>
          </div>
        </div>

        <div className="mt-6 text-center text-white text-opacity-70 text-xs">
          <p>By continuing, you agree to our <a href="#" className="hover:underline">Terms of Service</a> and <a href="#" className="hover:underline">Privacy Policy</a>.</p>
        </div>
      </div>
    </div>
  );
}
