import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('attendee'); // Default role
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/signup', {
        username,
        email,
        password,
        role, 
      });
      console.log('Signup successful:', response.data);
      
    } catch (error) {
      console.error('Error signing up:', error.response?.data || error.message);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#6f1ab1] mb-6">
          Create an Account
        </h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6f1ab1] focus:border-[#6f1ab1]"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6f1ab1] focus:border-[#6f1ab1]"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6f1ab1] focus:border-[#6f1ab1]"
              placeholder="Enter your password"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <div className="flex items-center">
              <input
                type="radio"
                id="host"
                name="role"
                value="host"
                checked={role === 'host'}
                onChange={(e) => setRole(e.target.value)}
                className="mr-2"
              />
              <label htmlFor="host" className="mr-4">
                Host
              </label>
              <input
                type="radio"
                id="attendee"
                name="role"
                value="attendee"
                checked={role === 'attendee'}
                onChange={(e) => setRole(e.target.value)}
                className="mr-2"
              />
              <label htmlFor="attendee">
                Attendee
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#6f1ab1] text-white rounded-full hover:bg-[#5c1698] transition-all duration-300"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <button
            onClick={handleLoginClick}
            className="text-[#6f1ab1] hover:underline focus:outline-none"
          >
            Click here to Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signup;
