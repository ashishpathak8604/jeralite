import axiosInstance from './axiosInstance';
import { saveToken, removeToken } from '../utils/tokenHelper';

// Login user with email and password
export const loginUser = async (email, password) => {
  try {
    const res = await axiosInstance.post('/auth/login', { email, password });
    if (res.data.token) {
      saveToken(res.data.token);
    }
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Register new user
export const registerUser = async (name, email, password) => {
  try {
    const res = await axiosInstance.post('/auth/register', { name, email, password });
    if (res.data.token) {
      saveToken(res.data.token);
    }
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Logout user
export const logoutUser = () => {
  removeToken();
};
