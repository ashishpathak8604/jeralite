import axios from 'axios';
import { auth } from '../config/firebase';

let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (apiUrl && !apiUrl.endsWith('/api')) {
  apiUrl += '/api';
}

const axiosInstance = axios.create({
  baseURL: apiUrl,
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
