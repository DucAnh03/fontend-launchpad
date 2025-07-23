import axios from "./axios";

// Type definitions
export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: 'user' | 'leader' | 'admin';
  avatar?: {
    url: string;
    filename?: string;
  };
  isVerified: boolean;
  bio?: string;
  level?: number;
  points?: number;
  userRank?: string;
  isUnlimited?: boolean;
  subscription?: {
    status: 'active' | 'expired' | 'cancelled' | 'trial';
    planId?: string;
    startDate?: string;
    endDate?: string;
  };
  skills?: Array<{
    skill: string;
    level: number;
  }>;
  followerCount?: number;
  followingCount?: number;
}

export interface LoginResponse {
  accessToken: string;
  profileHash: string;
  user: User;
}

export interface AuthResponse {
  metadata: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  metadata: T;
}

export interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface OAuthCallbackData {
  code: string;
  redirectUri: string;
}

/**
 * Login user with email and password
 */
export async function postLogin(email: string, password: string): Promise<LoginResponse> {
  try {
    const { data } = await axios.post<ApiResponse<LoginResponse>>("/auth/login", { 
      email, 
      password 
    });
    
    // Expected backend response structure:
    // {
    //   success: true,
    //   metadata: {
    //     accessToken: "jwt_token",
    //     profileHash: "hash_string",
    //     user: { id, name, email, role, avatar, isVerified, ... }
    //   }
    // }
    
    return data.metadata;
  } catch (error: any) {
    console.error("Login API error:", error);
    throw new Error(
      error.response?.data?.message || 
      "Đăng nhập thất bại. Vui lòng thử lại."
    );
  }
}

/**
 * Check current authentication status
 */
export async function checkAuth(): Promise<AuthResponse> {
  try {
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      throw new Error("No access token found");
    }

    const { data } = await axios.get<ApiResponse<User>>("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Expected backend response:
    // {
    //   success: true,
    //   metadata: { user_data }
    // }
    
    return { metadata: data.metadata };
  } catch (error: any) {
    console.error("Auth check error:", error);
    
    // Clear invalid token
    localStorage.removeItem("accessToken");
    localStorage.removeItem("profileHash");
    
    throw new Error(
      error.response?.data?.message || 
      "Phiên đăng nhập đã hết hạn"
    );
  }
}

/**
 * Register new user account
 */
export async function postRegister(userData: RegisterData): Promise<User> {
  try {
    const { data } = await axios.post<ApiResponse<User>>("/auth/register", userData);
    return data.metadata;
  } catch (error: any) {
    console.error("Register API error:", error);
    throw new Error(
      error.response?.data?.message || 
      "Đăng ký thất bại. Vui lòng thử lại."
    );
  }
}

/**
 * Logout user (optional API call if backend tracks sessions)
 */
export async function postLogout(): Promise<void> {
  try {
    const token = localStorage.getItem("accessToken");
    
    if (token) {
      await axios.post("/auth/logout", {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  } catch (error: any) {
    console.error("Logout API error:", error);
    // Don't throw error for logout, just log it
  } finally {
    // Always clear local storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("profileHash");
  }
}

/**
 * Request password reset
 */
export async function postForgotPassword(email: string): Promise<{ message: string }> {
  try {
    const { data } = await axios.post<ApiResponse<{ message: string }>>("/auth/forgot-password", { email });
    return data.metadata;
  } catch (error: any) {
    console.error("Forgot password API error:", error);
    throw new Error(
      error.response?.data?.message || 
      "Yêu cầu đặt lại mật khẩu thất bại"
    );
  }
}

/**
 * Reset password with token
 */
export async function postResetPassword(token: string, newPassword: string): Promise<{ message: string }> {
  try {
    const { data } = await axios.post<ApiResponse<{ message: string }>>("/auth/reset-password", {
      token,
      password: newPassword
    });
    return data.metadata;
  } catch (error: any) {
    console.error("Reset password API error:", error);
    throw new Error(
      error.response?.data?.message || 
      "Đặt lại mật khẩu thất bại"
    );
  }
}

/**
 * Verify email with token
 */
export async function postVerifyEmail(token: string): Promise<{ message: string; user?: User }> {
  try {
    const { data } = await axios.post<ApiResponse<{ message: string; user?: User }>>("/auth/verify-email", { token });
    return data.metadata;
  } catch (error: any) {
    console.error("Email verification API error:", error);
    throw new Error(
      error.response?.data?.message || 
      "Xác thực email thất bại"
    );
  }
}

/**
 * Resend verification email
 */
export async function postResendVerification(email: string): Promise<{ message: string }> {
  try {
    const { data } = await axios.post<ApiResponse<{ message: string }>>("/auth/resend-verification", { email });
    return data.metadata;
  } catch (error: any) {
    console.error("Resend verification API error:", error);
    throw new Error(
      error.response?.data?.message || 
      "Gửi lại email xác thực thất bại"
    );
  }
}

/**
 * Refresh access token
 */
export async function postRefreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken?: string }> {
  try {
    const { data } = await axios.post<ApiResponse<{ accessToken: string; refreshToken?: string }>>("/auth/refresh", { refreshToken });
    return data.metadata;
  } catch (error: any) {
    console.error("Refresh token API error:", error);
    throw new Error(
      error.response?.data?.message || 
      "Làm mới token thất bại"
    );
  }
}

/**
 * Change user password (when logged in)
 */
export async function postChangePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
  try {
    const token = localStorage.getItem("accessToken");
    
    const { data } = await axios.post<ApiResponse<{ message: string }>>("/auth/change-password", {
      currentPassword,
      newPassword
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return data.metadata;
  } catch (error: any) {
    console.error("Change password API error:", error);
    throw new Error(
      error.response?.data?.message || 
      "Đổi mật khẩu thất bại"
    );
  }
}

// OAuth related configurations and functions
export interface OAuthConfig {
  google: {
    clientId?: string;
    redirectUri: string;
  };
  facebook: {
    appId?: string;
    redirectUri: string;
  };
}

export const oAuthConfig: OAuthConfig = {
  google: {
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    redirectUri: `${window.location.origin}/oauth-callback`,
  },
  facebook: {
    appId: process.env.REACT_APP_FACEBOOK_APP_ID,
    redirectUri: `${window.location.origin}/oauth-callback`,
  }
};

/**
 * Handle OAuth callback
 */
export async function postOAuthCallback(
  provider: 'google' | 'facebook', 
  code: string
): Promise<LoginResponse> {
  try {
    const { data } = await axios.post<ApiResponse<LoginResponse>>(`/auth/oauth/${provider}/callback`, {
      code,
      redirectUri: oAuthConfig[provider]?.redirectUri
    });
    
    return data.metadata;
  } catch (error: any) {
    console.error(`OAuth ${provider} callback error:`, error);
    throw new Error(
      error.response?.data?.message || 
      `Đăng nhập ${provider} thất bại`
    );
  }
}

/**
 * Update user profile
 */
export async function putUpdateProfile(profileData: Partial<User>): Promise<User> {
  try {
    const token = localStorage.getItem("accessToken");
    
    const { data } = await axios.put<ApiResponse<User>>("/auth/profile", profileData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return data.metadata;
  } catch (error: any) {
    console.error("Update profile API error:", error);
    throw new Error(
      error.response?.data?.message || 
      "Cập nhật thông tin thất bại"
    );
  }
}

/**
 * Upload user avatar
 */
export async function postUploadAvatar(file: File): Promise<User> {
  try {
    const token = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append('avatar', file);
    
    const { data } = await axios.post<ApiResponse<User>>("/auth/upload-avatar", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return data.metadata;
  } catch (error: any) {
    console.error("Upload avatar API error:", error);
    throw new Error(
      error.response?.data?.message || 
      "Tải lên avatar thất bại"
    );
  }
}

/**
 * Get user by ID (for admin or public profiles)
 */
export async function getUserById(userId: string): Promise<User> {
  try {
    const token = localStorage.getItem("accessToken");
    
    const { data } = await axios.get<ApiResponse<User>>(`/users/${userId}`, {
      headers: token ? {
        Authorization: `Bearer ${token}`
      } : {}
    });
    
    return data.metadata;
  } catch (error: any) {
    console.error("Get user by ID API error:", error);
    throw new Error(
      error.response?.data?.message || 
      "Không thể tải thông tin người dùng"
    );
  }
}

// Default export with all functions
const authApi = {
  postLogin,
  checkAuth,
  postRegister,
  postLogout,
  postForgotPassword,
  postResetPassword,
  postVerifyEmail,
  postResendVerification,
  postRefreshToken,
  postChangePassword,
  postOAuthCallback,
  putUpdateProfile,
  postUploadAvatar,
  getUserById,
  oAuthConfig
};

export default authApi;