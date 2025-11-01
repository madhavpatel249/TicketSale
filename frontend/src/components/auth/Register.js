import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../common/Navbar';

function Register() {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleLoginClick = () => {
    navigate('/login');
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
            Welcome to Evently
          </h2>
          <p className="text-center text-darkGray mb-8">Get started by creating an account or signing in</p>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              onClick={handleSignUpClick}
              className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-shadow duration-150 font-semibold shadow-md flex items-center justify-center gap-2"
            >
              <UserPlus size={18} />
              Sign Up
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              onClick={handleLoginClick}
              className="w-full py-3.5 bg-white text-primary border-2 border-primary rounded-xl hover:bg-primary/5 active:bg-primary/10 transition-all duration-150 font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <LogIn size={18} />
              Log In
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default Register; 