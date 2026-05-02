import axios from 'axios';
import { auth } from '../config/firebase';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get the current user's Firebase token
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
