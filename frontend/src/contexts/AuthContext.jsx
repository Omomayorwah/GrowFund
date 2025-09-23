import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('growfund_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/user/dashboard');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('growfund_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      const { token, user: newUser } = response.data;
      
      localStorage.setItem('growfund_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(newUser);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('growfund_token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
