import axios from 'axios';
import { auth } from '../config/firebase';

let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ensure /api is added only once
if (!apiUrl.endsWith('/api')) {
  apiUrl += '/api';
}

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

// 🔥 FIXED INTERCEPTOR
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;

      if (user) {
        // 🔥 force refresh token
        const token = await user.getIdToken(true);

        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn("No Firebase user found");
      }

      return config;
    } catch (error) {
      console.error("Error attaching token:", error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;