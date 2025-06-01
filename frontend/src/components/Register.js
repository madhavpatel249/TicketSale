import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

function Register() {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/signup');
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
        staggerChildren: 0.2
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
          Welcome to MyTix
        </motion.h2>

        <div className="space-y-4">
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSignUpClick}
            className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 active:bg-primary/80 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            <UserPlus size={18} />
            Sign Up
          </motion.button>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLoginClick}
            className="w-full py-3 bg-white text-primary border border-primary rounded-lg hover:bg-primary/5 active:bg-primary/10 transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            <LogIn size={18} />
            Log In
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Register;
