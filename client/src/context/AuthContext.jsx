import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { getToken, removeToken, isTokenExpired } from '../utils/tokenHelper';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();

      if (token && !isTokenExpired()) {
        // Token exists and is valid
        try {
          const res = await axiosInstance.get('/users/me');
          setCurrentUser({ email: res.data.email });
          setDbUser(res.data);
        } catch (error) {
          console.error('Error fetching user data from backend:', error);
          removeToken();
          setCurrentUser(null);
          setDbUser(null);
        }
      } else {
        // No valid token
        removeToken();
        setCurrentUser(null);
        setDbUser(null);
      }

      setAuthLoading(false);
    };

    initializeAuth();
  }, []);

  const logout = async () => {
    setDbUser(null);
    setCurrentUser(null);
    removeToken();
  };

  const value = {
    currentUser,
    dbUser,
    authLoading,
    logout,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
