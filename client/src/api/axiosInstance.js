import axios from 'axios';
import { auth } from '../config/firebase';

let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (apiUrl && !apiUrl.endsWith('/api')) {
  apiUrl += '/api';
}

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

/**
 * Returns a Promise that resolves with the current Firebase user
 * once auth state has been fully initialized.
 * This is the key fix: instead of reading auth.currentUser (which is null
 * during the brief initialization window), we wait for the first
 * onAuthStateChanged event to fire.
 */
const getCurrentUser = () => {
  return new Promise((resolve) => {
    // If Firebase has already resolved, return immediately
    if (auth.currentUser !== undefined) {
      return resolve(auth.currentUser);
    }
    // Otherwise wait for the first auth state change event
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Request interceptor — waits for Firebase to initialize before attaching token
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const user = await getCurrentUser();
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Failed to attach auth token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
