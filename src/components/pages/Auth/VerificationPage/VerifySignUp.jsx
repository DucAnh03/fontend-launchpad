import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEnvelope, FaKey, FaUserShield } from "react-icons/fa";
import "../SignUpPage/SignUp.css";
import api from "@/services/api/axios";
import { useAuthContext } from "@/contexts/AuthContext";

export default function VerifySignUp() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuthContext();

    // Get email from either query params or state
    const params = new URLSearchParams(location.search);
    const emailFromQuery = params.get('email');
    const emailFromState = location.state?.email;
    const passwordFromState = location.state?.password;

    const [formData, setFormData] = useState({
        email: emailFromQuery || emailFromState || "",
        code: params.get('code') || "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            await api.post("/auth/verify-signup", {
                email: formData.email,
                code: formData.code,
            });
            setSuccess("Xác thực thành công! Bạn có thể đăng nhập.");

            // If we have password in state, attempt auto login after 4s
            if (passwordFromState) {
                setTimeout(async () => {
                    try {
                        await login(formData.email, passwordFromState);
                        navigate("/", { replace: true });
                    } catch (err) {
                        // If auto login fails, redirect to signin
                        navigate("/signin", { replace: true });
                    }
                }, 4000);
            } else {
                // If no password, redirect to signin after 2s
                setTimeout(() => {
                    navigate("/signin", { replace: true });
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Xác thực thất bại!");
        } finally {
            setLoading(false);
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
                        <h1 className="text-3xl font-bold mb-2">Xác thực tài khoản</h1>
                        <p className="opacity-80">Nhập email và mã xác thực đã gửi về email của bạn</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg text-sm">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
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
                                <label htmlFor="code" className="block text-sm font-medium mb-1">Mã xác thực</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaKey className="opacity-70" />
                                    </div>
                                    <input
                                        id="code"
                                        name="code"
                                        type="text"
                                        value={formData.code}
                                        onChange={handleChange}
                                        className="input-field w-full py-3 pl-10 pr-4 rounded-lg text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30"
                                        placeholder="Nhập mã xác thực"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3 px-4 rounded-lg font-semibold text-white relative overflow-hidden"
                        >
                            {loading ? "Đang xác thực..." : "Xác thực"}
                        </button>
                    </form>
                </div>
                <div className="mt-6 text-center text-white text-opacity-70 text-xs">
                    <p>Bạn đã xác thực? <a href="/signin" className="hover:underline">Đăng nhập</a></p>
                </div>
            </div>
        </div>
    );
} 