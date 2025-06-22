import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from './services/apiService';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, UserPlus, LogIn } from 'lucide-react';
import Navbar from './Navbar';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('attendee');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

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
      const errorMessage = error.response?.data?.error || 
                         error.response?.data?.details?.join(', ') || 
                         'Signup failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
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
      <div className="flex items-center justify-center min-h-screen bg-lightGray pt-24 pb-8">
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg">
          <h2 className="text-xl font-bold text-center text-primary mb-4">
            Create an Account
          </h2>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 text-warning bg-warning/10 p-2 rounded-lg mb-4"
              >
                <Lock size={16} />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSignup} className="space-y-3">
            <div className="grid grid-cols-1 gap-4">
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
                  placeholder="Enter username"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Mail size={16} />
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-base"
                  placeholder="Enter email"
                />
              </div>
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
                placeholder="Enter password"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-primary">
                <UserPlus size={16} />
                Role
              </label>
              <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    id="host"
                    name="role"
                    value="host"
                    checked={role === 'host'}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span className="text-darkGray group-hover:text-primary transition-colors duration-200">Host</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    id="attendee"
                    name="role"
                    value="attendee"
                    checked={role === 'attendee'}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span className="text-darkGray group-hover:text-primary transition-colors duration-200">Attendee</span>
                </label>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 active:bg-primary/80 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2 mt-2"
            >
              <UserPlus size={18} />
              Sign Up
            </motion.button>
          </form>

          <p className="text-center text-sm text-darkGray mt-5">
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
          </p>
        </div>
      </div>
    </>
  );
}

export default Signup;
