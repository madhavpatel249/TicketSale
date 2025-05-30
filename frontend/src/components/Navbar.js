import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

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
    <nav className="fixed top-0 left-0 w-full py-4 px-6 z-50 bg-primary/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-semibold tracking-wide hover:text-accent transition-colors">
          Evently
        </Link>

        <div className="flex space-x-4 items-center">
          {(!user || user.role === 'host') && (
            <Link to="/host-event" className={navLinkClass}>
              Host Event
            </Link>
          )}

          {user ? (
            <>
              <Link to="/my-cart" className={navLinkClass}>My Cart</Link>
              <Link to="/profile" className={navLinkClass}>Profile</Link>
              <button onClick={handleLogout} className={buttonClass}>
                Log Out
              </button>
            </>
          ) : (
            <Link to="/register" className={navLinkClass}>Register</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
