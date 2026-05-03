import axios from 'axios';
import { getToken, removeToken } from '../utils/tokenHelper';

let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (apiUrl && !apiUrl.endsWith('/api')) {
  apiUrl += '/api';
}

const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // Required for cross-origin requests with cookies/auth
});

// Request interceptor — attach JWT token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear it
      removeToken();
      // Optionally redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
