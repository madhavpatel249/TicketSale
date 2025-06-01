import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from './services/apiService';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, UserPlus, LogIn } from 'lucide-react';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('attendee');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/api/users/signup', {
        username,
        email,
        password,
        role,
      });
      console.log('Signup successful:', response.data);
      navigate('/login');
    } catch (error) {
      console.error('Error signing up:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex items-center justify-center min-h-screen bg-lightGray pt-24 pb-12"
    >
      <motion.div 
        variants={itemVariants}
        className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md"
      >
        <motion.h2 
          variants={itemVariants}
          className="text-2xl font-bold text-center text-primary mb-8"
        >
          Create an Account
        </motion.h2>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-warning bg-warning/10 p-3 rounded-lg mb-6"
            >
              <Lock size={18} />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form 
          variants={itemVariants}
          onSubmit={handleSignup} 
          className="space-y-6"
        >
          <motion.div variants={itemVariants} className="space-y-2">
            <label htmlFor="username" className="flex items-center gap-2 text-sm font-medium text-primary">
              <User size={16} />
              Username
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              placeholder="Enter your username"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-primary">
              <Mail size={16} />
              Email
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              placeholder="Enter your email"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-primary">
              <Lock size={16} />
              Password
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              placeholder="Enter your password"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-primary">
              <UserPlus size={16} />
              Role
            </label>
            <motion.div 
              className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg"
              whileHover={{ scale: 1.01 }}
            >
              <motion.label 
                className="flex items-center gap-2 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <input
                  type="radio"
                  id="host"
                  name="role"
                  value="host"
                  checked={role === 'host'}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                />
                <span className="text-darkGray">Host</span>
              </motion.label>

              <motion.label 
                className="flex items-center gap-2 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <input
                  type="radio"
                  id="attendee"
                  name="role"
                  value="attendee"
                  checked={role === 'attendee'}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                />
                <span className="text-darkGray">Attendee</span>
              </motion.label>
            </motion.div>
          </motion.div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 active:bg-primary/80 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            <UserPlus size={18} />
            Sign Up
          </motion.button>
        </motion.form>

        <motion.p 
          variants={itemVariants}
          className="text-center text-sm text-darkGray mt-6"
        >
          Already have an account?{' '}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLoginClick}
            className="text-secondary hover:text-secondary/80 font-medium transition-colors duration-200 flex items-center gap-1"
          >
            <LogIn size={16} />
            Click here to Login
          </motion.button>
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export default Signup;
