import React from 'react';
import { Link } from 'react-router-dom'; 

function Navbar({ scrolled }) {
  return (
    <nav 
      className={`fixed top-0 left-0 w-full py-6 px-8 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#38405F] shadow-md' : 'bg-[#0E131F]'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center rounded-full">
        {/* Left Side */}
        <div className="flex items-center">
          <Link 
            to="/" 
            className="text-lg px-5 py-3 rounded-full border border-transparent hover:border-gray-300 hover:bg-[#38405F] hover:text-white transition-all duration-300 text-white"
          >
            Home
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex space-x-5">
          <Link 
            to="/host-event" 
            className="text-lg px-5 py-3 rounded-full border border-transparent hover:border-gray-300 hover:bg-[#38405F] hover:text-white transition-all duration-300 text-white"
          >
            Host Event
          </Link>
          <Link 
            to="/register" 
            className="text-lg px-5 py-3 rounded-full border border-transparent hover:border-gray-300 hover:bg-[#38405F] hover:text-white transition-all duration-300 text-white"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
