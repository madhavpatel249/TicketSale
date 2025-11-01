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

  const navLinkClass = "px-4 py-2 rounded-lg text-white font-medium hover:bg-white/20 transition-all duration-150 hover:scale-105";
  const buttonClass = "px-4 py-2 rounded-lg text-white bg-warning hover:bg-warning/90 active:bg-warning/80 transition-all duration-150 hover:scale-105 font-semibold";

  return (
    <nav className="fixed top-0 left-0 w-full py-4 px-6 z-50 bg-gradient-to-r from-primary via-secondary/95 to-secondary backdrop-blur-md shadow-xl border-b-2 border-secondary/40">
      <div className="container mx-auto flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" onClick={handleLogoClick} className="text-white text-2xl font-bold tracking-wide hover:text-accent transition-all duration-300 flex items-center gap-2">
            <span className="bg-gradient-to-r from-accent to-highlight bg-clip-text text-transparent">Evently</span>
          </Link>
        </motion.div>

        <div className="hidden lg:flex space-x-3 items-center">
          {(!user || user.role === 'host') && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
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
                transition={{ duration: 0.15 }}
              >
                <Link to="/my-cart" className={navLinkClass}>My Cart</Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <Link to="/profile" className={navLinkClass}>Profile</Link>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
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
              transition={{ duration: 0.15 }}
            >
              <Link to="/register" className={navLinkClass}>Register</Link>
            </motion.div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-primary/95 backdrop-blur-md"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 mt-2 border-t border-white/10">
              <Link
                to="/"
                className="block text-white hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/browse-events"
                className="block text-white hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Browse Events
              </Link>
              {user ? (
                <>
                  {(!user || user.role === 'host') && (
                    <Link
                      to="/host-event"
                      onClick={(e) => {
                        handleHostClick(e);
                        setIsOpen(false);
                      }}
                      className="block text-white hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium transition-colors"
                    >
                      Host Event
                    </Link>
                  )}
                  <Link
                    to="/my-cart"
                    className="block text-white hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    My Cart
                  </Link>
                  <Link
                    to="/profile"
                    className="block text-white hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left text-white hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-white hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block text-white hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium transition-colors"
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
