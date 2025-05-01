import React, { useState } from 'react';
import Navbar from './Navbar';
import EventGallery from './EventGallery';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const handleHostEventClick = () => {
    navigate('/host-event');
  };

  const handleBrowseEventsClick = () => {
    navigate('/browse-events');
  };

  return (
    <div className="min-h-screen">
      <Navbar scrolled={scrolled} />

      <main className="relative pt-24 flex flex-col items-center justify-center bg-gray-100 min-h-[80vh]">
        <div className="text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Discover and Host Amazing Events
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Concerts, Sports, Theater — Everything Near You
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleHostEventClick}
              className="px-6 py-3 bg-[#38405F] text-white rounded-full font-semibold hover:bg-[#0E131F] transition-all duration-300"
            >
              Host an Event
            </button>
            <button
              onClick={handleBrowseEventsClick}
              className="px-6 py-3 bg-[#38405F] text-white rounded-full font-semibold hover:bg-[#0E131F] transition-all duration-300"
            >
              Browse Events
            </button>
          </div>
        </div>
      </main>

      <section className="bg-white pb-10">
        <EventGallery />
      </section>
    </div>
  );
}

export default HomePage;
