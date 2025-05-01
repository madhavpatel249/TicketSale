import React from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 pt-24">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#0E131F] mb-6">
          Welcome to MyTix
        </h2>

        <div className="space-y-4">
          <button
            onClick={handleSignUpClick}
            className="w-full py-3 bg-[#0E131F] text-white rounded-full hover:bg-[#38405F] transition-all duration-300"
          >
            Sign Up
          </button>

          <button
            onClick={handleLoginClick}
            className="w-full py-3 bg-white text-[#0E131F] border border-[#0E131F] rounded-full hover:bg-gray-100 transition-all duration-300"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
