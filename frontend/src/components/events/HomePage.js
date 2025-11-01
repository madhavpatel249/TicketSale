import React, { useState, useContext, useRef, useEffect } from 'react';
import Navbar from '../common/Navbar';
import EventGallery from './EventGallery';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useRipples } from 'use-ripples';
import { Plus, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const hostBtnRef = useRef(null);
  const browseBtnRef = useRef(null);
  useRipples(hostBtnRef, {
    duration: 600,
    color: 'rgba(255,255,255,0.2)',
  });
  useRipples(browseBtnRef, {
    duration: 600,
    color: 'rgba(255,255,255,0.2)',
  });

  const handleHostEventClick = () => {
    // Check if user is logged in and has host role
    if (!user) {
      // User is not logged in, redirect to login
      navigate('/login');
      return;
    }
    
    if (user.role !== 'host') {
      // User is logged in but not a host, redirect to login (or show error)
      navigate('/login');
      return;
    }
    
    // User is logged in as host, allow navigation
    navigate('/host-event');
  };

  const handleBrowseEventsClick = () => {
    navigate('/browse-events');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-lightGray">
      <Navbar scrolled={scrolled} />

      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-grow relative pt-24 flex flex-col items-center justify-center min-h-[85vh] bg-gradient-to-b from-primary/5 via-secondary/5 to-lightGray overflow-hidden"
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="text-center px-6 max-w-5xl mx-auto relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent drop-shadow-sm"
          >
            Discover and Host Amazing Events
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-darkGray mb-12 font-light"
          >
            Concerts, Sports, Theater — Everything Near You
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
          >
            {(!user || user.role === 'host') && (
              <motion.button
                ref={hostBtnRef}
                onClick={handleHostEventClick}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="relative flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold shadow-lg hover:shadow-xl text-lg transition-shadow duration-150"
              >
                <Plus className="w-5 h-5" />
                Host an Event
              </motion.button>
            )}
            <motion.button
              ref={browseBtnRef}
              onClick={handleBrowseEventsClick}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="relative flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-secondary to-accent text-white rounded-xl font-semibold shadow-lg hover:shadow-xl text-lg transition-shadow duration-150"
            >
              <Search className="w-5 h-5" />
              Browse Events
            </motion.button>
          </motion.div>
        </div>
      </motion.main>

      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-b from-lightGray via-white to-primary/5 py-20"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-2xl"></div>
        </div>
        <div className="relative z-10">
          <EventGallery />
        </div>
      </motion.section>

      <footer className="relative bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-t-2 border-secondary/20 text-primary text-center py-10 mt-auto overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="relative z-10">
          <p className="text-lg font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Evently &copy; {new Date().getFullYear()}
          </p>
          <p className="text-sm text-darkGray mt-2 font-medium">Discover amazing events near you</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
