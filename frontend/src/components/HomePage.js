import React, { useState, useContext, useRef, useEffect } from 'react';
import Navbar from './Navbar';
import EventGallery from './EventGallery';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import { useRipples } from 'use-ripples';
import { Plus, Search, Ticket } from 'lucide-react';

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

  return (
    <div className="min-h-screen flex flex-col bg-lightGray">
      <Navbar scrolled={scrolled} />

      <main className="flex-grow relative pt-24 flex flex-col items-center justify-center min-h-[80vh] animate-fade-in">
        <div className="text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 animate-slide-down">
            Discover and Host Amazing Events
          </h1>
          <p className="text-lg text-darkGray mb-10 animate-slide-down delay-100">
            Concerts, Sports, Theater — Everything Near You
          </p>
          <div className="flex justify-center space-x-6 animate-slide-up">
            {(!user || user.role === 'host') && (
              <button
                ref={hostBtnRef}
                onClick={handleHostEventClick}
                className="relative flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 ease-in-out overflow-hidden"
              >
                <Plus className="w-5 h-5" />
                Host an Event
              </button>
            )}
            <button
              ref={browseBtnRef}
              onClick={handleBrowseEventsClick}
              className="relative flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 ease-in-out overflow-hidden"
            >
              <Search className="w-5 h-5" />
              Browse Events
            </button>
          </div>
        </div>
      </main>

      <section className="bg-white py-16">
        <EventGallery />
      </section>

      <footer className="bg-primary/5 text-primary text-center py-6 mt-auto">
        <p className="text-base font-medium hover:text-secondary transition-colors duration-200">
          Evently &copy; {new Date().getFullYear()}
        </p>
      </footer>

      {showScrollBtn && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white/90 text-accent hover:text-accent/80 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Ticket className="w-6 h-6" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

export default HomePage;
