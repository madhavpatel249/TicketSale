import { useState, useEffect } from 'react';
import axios from 'axios';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    try {
      const response = await axios.get('/api/auth/verify');
      setUser(response.data.user);
      setError(null);
    } catch (err) {
      setUser(null);
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/login', { username, password });
      setUser(response.data.user);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await axios.post('/api/auth/logout');
      setUser(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    verifyToken
  };
};

export default useAuth; 