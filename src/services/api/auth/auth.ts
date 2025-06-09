
import axios from "../axios";

export interface LoginResponse {
  accessToken: string;
  profileHash: string;
  user: any; // hoặc UserInfo
}

export async function postLogin(email: string, password: string): Promise<LoginResponse> {
  const { data } = await axios.post("/auth/login", { email, password });
  return data.metadata;  // giả định backend trả về { metadata: { accessToken, profileHash, user } }
}

export async function checkAuth(): Promise<{ metadata: any }> {
  const { data } = await axios.get("/auth/me");
  return data;
}
