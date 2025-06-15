import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from './services/apiService';
import { AuthContext } from '../components/AuthContext';
import { User, Lock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/api/auth/login', {
        username,
        password,
      });
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      console.error('Error logging in:', err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1
    }
  };

  const itemVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-lightGray pt-24 pb-12">
      <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-primary mb-8">
          Welcome Back
        </h2>
        
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 text-warning bg-warning/10 p-3 rounded-lg mb-6"
            >
              <AlertCircle size={18} />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="flex items-center gap-2 text-sm font-medium text-primary">
              <User size={16} />
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              placeholder="Enter your username"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-primary">
              <Lock size={16} />
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              placeholder="Enter your password"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 active:bg-primary/80 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            Log In
          </motion.button>
        </form>

        <p className="text-center text-sm text-darkGray mt-6">
          Don't have an account?{' '}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSignupClick}
            className="text-secondary hover:text-secondary/80 font-medium transition-colors duration-200"
          >
            Sign Up
          </motion.button>
        </p>
      </div>
    </div>
  );
}

export default Login;
