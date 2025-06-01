import React, { useState, useContext, useRef, useEffect } from 'react';
import Navbar from './Navbar';
import EventGallery from './EventGallery';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import { useRipples } from 'use-ripples';
import { Plus, Search, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(true); 
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

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-lightGray">
      <Navbar scrolled={scrolled} />

      <motion.main 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex-grow relative pt-24 flex flex-col items-center justify-center min-h-[80vh]"
      >
        <div className="text-center px-6 max-w-4xl mx-auto">
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-primary mb-6"
          >
            Discover and Host Amazing Events
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-lg text-darkGray mb-10"
          >
            Concerts, Sports, Theater — Everything Near You
          </motion.p>
          <motion.div 
            variants={itemVariants}
            className="flex justify-center space-x-6"
          >
            {(!user || user.role === 'host') && (
              <motion.button
                ref={hostBtnRef}
                onClick={handleHostEventClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 shadow-sm hover:shadow-md transform transition-all duration-200 ease-in-out overflow-hidden"
              >
                <Plus className="w-5 h-5" />
                Host an Event
              </motion.button>
            )}
            <motion.button
              ref={browseBtnRef}
              onClick={handleBrowseEventsClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 shadow-sm hover:shadow-md transform transition-all duration-200 ease-in-out overflow-hidden"
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
        className="bg-white py-16"
      >
        <EventGallery />
      </motion.section>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-primary/5 text-primary text-center py-6 mt-auto"
      >
        <p className="text-base font-medium hover:text-secondary transition-colors duration-200">
          Evently &copy; {new Date().getFullYear()}
        </p>
      </motion.footer>

      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleScrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white/90 text-accent hover:text-accent/80 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Ticket className="w-6 h-6" strokeWidth={2} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HomePage;
