import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { motion } from 'framer-motion';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = "px-4 py-2 rounded-md text-white hover:bg-secondary/80 transition-all duration-200 hover:scale-105";
  const buttonClass = "px-4 py-2 rounded-md text-white bg-warning hover:bg-warning/90 active:bg-warning/80 transition-all duration-200 hover:scale-105";

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="fixed top-0 left-0 w-full py-4 px-6 z-50 bg-primary/95 backdrop-blur-sm shadow-sm"
    >
      <div className="container mx-auto flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" className="text-white text-xl font-semibold tracking-wide hover:text-accent transition-colors">
            Evently
          </Link>
        </motion.div>

        <div className="flex space-x-4 items-center">
          {(!user || user.role === 'host') && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/host-event" className={navLinkClass}>
                Host Event
              </Link>
            </motion.div>
          )}

          {user ? (
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/my-cart" className={navLinkClass}>My Cart</Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/profile" className={navLinkClass}>Profile</Link>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className={buttonClass}
              >
                Log Out
              </motion.button>
            </>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/register" className={navLinkClass}>Register</Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
