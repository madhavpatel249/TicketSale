import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

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
      <div className="flex items-center justify-center min-h-screen bg-lightGray pt-24 pb-12">
        <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-primary mb-8">
            Welcome to Evently
          </h2>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSignUpClick}
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 active:bg-primary/80 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <UserPlus size={18} />
              Sign Up
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLoginClick}
              className="w-full py-3 bg-white text-primary border border-primary rounded-lg hover:bg-primary/5 active:bg-primary/10 transition-all duration-200 font-medium flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              Log In
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register; 