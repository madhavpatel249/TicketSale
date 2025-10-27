import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, AlertCircle } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleHostClick = (e) => {
    if (!user || user.role !== 'host') {
      e.preventDefault();
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
    }
  };

  const handleLogoClick = () => {
    // Always scroll to top when logo is clicked
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinkClass = "px-4 py-2 rounded-md text-white hover:bg-secondary/80 transition-all duration-200 hover:scale-105";
  const buttonClass = "px-4 py-2 rounded-md text-white bg-warning hover:bg-warning/90 active:bg-warning/80 transition-all duration-200 hover:scale-105";

  return (
    <nav className="fixed top-0 left-0 w-full py-4 px-6 z-50 bg-primary/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" onClick={handleLogoClick} className="text-white text-xl font-semibold tracking-wide hover:text-accent transition-colors">
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
                onClick={logout}
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

        {/* Mobile menu button */}
        <div className="sm:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/events"
                className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Events
              </Link>
              {user ? (
                <>
                  <Link
                    to="/host-event"
                    onClick={(e) => {
                      handleHostClick(e);
                      setIsOpen(false);
                    }}
                    className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md text-base font-medium"
                  >
                    Host Event
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left text-gray-700 hover:text-primary px-3 py-2 rounded-md text-base font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-white p-4 rounded-lg shadow-lg border border-gray-100 flex items-center gap-3"
          >
            <AlertCircle className="text-warning" size={20} />
            <p className="text-sm font-medium text-gray-700">
              You need to be logged in as a host
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
