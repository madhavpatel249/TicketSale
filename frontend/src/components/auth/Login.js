import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/apiService';
import { AuthContext } from '../../context/AuthContext';
import { User, Lock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../common/Navbar';

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
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary/5 via-secondary/5 to-lightGray pt-24 pb-12 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md"
        >
          <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-center text-darkGray mb-8">Sign in to your account</p>
          
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
              <label htmlFor="username" className="flex items-center gap-2 text-sm font-semibold text-primary">
                <User size={16} />
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 text-darkGray placeholder-gray-400"
                placeholder="Enter your username"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Lock size={16} />
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 text-darkGray placeholder-gray-400"
                placeholder="Enter your password"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-shadow duration-150 font-semibold shadow-md"
            >
              Log In
            </motion.button>
          </form>

          <p className="text-center text-sm text-darkGray mt-6">
            Don't have an account?{' '}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
              onClick={handleSignupClick}
              className="text-secondary hover:text-primary font-semibold transition-colors duration-150"
            >
              Sign Up
            </motion.button>
          </p>
        </motion.div>
      </div>
    </>
  );
}

export default Login;
