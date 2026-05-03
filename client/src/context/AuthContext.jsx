import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import axiosInstance from '../api/axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  // authLoading = true until Firebase has fully resolved + backend call complete
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          // Firebase user is confirmed present here, so axiosInstance
          // will successfully attach the token via its interceptor.
          const res = await axiosInstance.get('/users/me');
          setDbUser(res.data);
        } catch (error) {
          console.error('Error fetching user data from backend:', error);
          // Don't block the app if the backend call fails —
          // the user is still Firebase-authenticated.
          setDbUser(null);
        }
      } else {
        setDbUser(null);
      }

      // Only mark auth as ready after BOTH firebase + backend have resolved
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    setDbUser(null);
    setCurrentUser(null);
    return signOut(auth);
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
