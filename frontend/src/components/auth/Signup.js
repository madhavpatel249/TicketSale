import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiService';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, UserPlus, LogIn } from 'lucide-react';
import Navbar from '../common/Navbar';

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary/5 via-secondary/5 to-lightGray pt-24 pb-12 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg"
        >
          <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Create an Account
          </h2>
          <p className="text-center text-darkGray mb-8">Join Evently and start discovering events</p>

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

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="grid grid-cols-1 gap-5">
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
                  placeholder="Enter username"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Mail size={16} />
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 text-darkGray placeholder-gray-400"
                  placeholder="Enter email"
                />
              </div>
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
                placeholder="Enter password"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-primary">
                <UserPlus size={16} />
                Role
              </label>
              <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
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
                  <span className="text-darkGray font-medium group-hover:text-primary transition-colors duration-200">Host</span>
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
                  <span className="text-darkGray font-medium group-hover:text-primary transition-colors duration-200">Attendee</span>
                </label>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-shadow duration-150 font-semibold shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : (
                <>
                  <UserPlus size={18} />
                  Sign Up
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-darkGray mt-6">
            Already have an account?{' '}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
              onClick={handleLoginClick}
              className="text-secondary hover:text-primary font-semibold transition-colors duration-150 flex items-center gap-1 inline-flex"
            >
              <LogIn size={16} />
              Click here to Login
            </motion.button>
          </p>
        </motion.div>
      </div>
    </>
  );
}

export default Signup;
