import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

function Navbar({ scrolled }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full py-6 px-8 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#38405F] shadow-md' : 'bg-[#0E131F]'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center rounded-full">
        
        <div className="flex items-center">
          <Link
            to="/"
            className="text-lg px-5 py-3 rounded-full border border-transparent hover:border-gray-300 hover:bg-[#38405F] hover:text-white transition-all duration-300 text-white"
          >
            Home
          </Link>
        </div>

        
        <div className="flex space-x-5 items-center">
          {(!user || user.role === 'host') && (
            <Link
              to="/host-event"
              className="text-lg px-5 py-3 rounded-full border border-transparent hover:border-gray-300 hover:bg-[#38405F] hover:text-white transition-all duration-300 text-white"
            >
              Host Event
            </Link>
          )}

          {user ? (
            <>
              <Link
                to="/my-cart"
                className="text-lg px-5 py-3 rounded-full border border-transparent hover:border-gray-300 hover:bg-[#38405F] hover:text-white transition-all duration-300 text-white"
              >
                My Cart
              </Link>
              <Link
                to="/profile"
                className="text-lg px-5 py-3 rounded-full border border-transparent hover:border-gray-300 hover:bg-[#38405F] hover:text-white transition-all duration-300 text-white"
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-lg px-5 py-3 rounded-full bg-white text-[#0E131F] hover:bg-gray-100 transition-all duration-300"
              >
                Log Out
              </button>
            </>
          ) : (
            <Link
              to="/register"
              className="text-lg px-5 py-3 rounded-full border border-transparent hover:border-gray-300 hover:bg-[#38405F] hover:text-white transition-all duration-300 text-white"
            >
              Register
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
