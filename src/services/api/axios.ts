// src/services/api/axios.ts
import axios from "axios";
import { constants } from "@/settings/constants";

const api = axios.create({
  baseURL: 'http://localhost:3001/api', 
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
