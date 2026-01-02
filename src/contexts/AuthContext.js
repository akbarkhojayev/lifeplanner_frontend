import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState(null);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Foydalanuvchi ma'lumotlarini olish
      fetchUser();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Background image ni yuklash
  useEffect(() => {
    if (user?.background_image_url) {
      setBackgroundImage(user.background_image_url);
    } else {
      setBackgroundImage(null);
    }
  }, [user?.background_image_url]);

  const fetchUser = async () => {
    try {
      // Profil ma'lumotlarini olish
      const response = await api.get('/profile/');
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('User ma\'lumotlarini olishda xatolik:', error);
      logout();
    }
  };

  const login = async (username, password) => {
    try {
      const response = await api.post('/token/', {
        username,
        password
      });
      
      const { access } = response.data;
      setToken(access);
      localStorage.setItem('token', access);
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      // Real user ma'lumotlarini olish
      try {
        const userResponse = await api.get('/profile/');
        setUser(userResponse.data);
      } catch (userError) {
        console.error('User ma\'lumotlarini olishda xatolik:', userError);
        setUser({ username });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login xatoligi:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login xatoligi yuz berdi' 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const updateBackgroundImage = (imageUrl) => {
    setBackgroundImage(imageUrl);
  };

  const value = {
    token,
    user,
    loading,
    backgroundImage,
    login,
    logout,
    updateUser,
    updateBackgroundImage
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};