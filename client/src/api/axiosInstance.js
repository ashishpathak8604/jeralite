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
 * Waits for Firebase Auth to fully initialize and returns the current user.
 *
 * CRITICAL FIX: auth.currentUser starts as `null` (NOT `undefined`) during
 * the initialization window. The only reliable way to know when Firebase has
 * truly resolved is to listen for the first onAuthStateChanged event.
 */
const waitForAuthReady = () => {
  return new Promise((resolve) => {
    // onAuthStateChanged fires once immediately with the resolved state.
    // Unsubscribing right after ensures we only use it as a one-shot check.
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Request interceptor — always waits for Firebase to be ready before attaching the token
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const user = await waitForAuthReady();
      if (user) {
        // force=true ensures we always get a fresh, non-expired token
        const token = await user.getIdToken(true);
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
