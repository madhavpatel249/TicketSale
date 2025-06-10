import React, { useEffect, useState, useRef } from "react";
import { api } from './services/apiService';
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EventGallery = () => {
  const [events, setEvents] = useState([]);
  const scrollRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.getEvents();
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const getScrollAmount = () => {
    const visibleCards = Math.min(events.length, 5); 
    return 260 * visibleCards;
  };

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const maxScroll = current.scrollWidth - current.clientWidth;
      let newScrollPosition =
        scrollPosition + (direction === "left" ? -getScrollAmount() : getScrollAmount());

      newScrollPosition = Math.max(0, Math.min(newScrollPosition, maxScroll));

      current.scrollTo({ left: newScrollPosition, behavior: "smooth" });
      setScrollPosition(newScrollPosition);
    }
  };

  const renderEventCard = (event, index) => (
    <motion.div
      key={event._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Link to={`/events/${event._id}`} className="flex-shrink-0 w-[250px]">
        <motion.div 
          className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ease-in-out group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-full h-[140px] bg-gray-200 relative overflow-hidden">
            <motion.img
              src={event.image || ''}
              alt={event.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div className="p-4">
            <h3 className="text-base font-medium text-primary mb-1 line-clamp-1">{event.title}</h3>
            <p className="text-sm text-darkGray mb-1">{new Date(event.date).toLocaleDateString()}</p>
            <p className="text-sm text-darkGray mb-3 line-clamp-1">{event.location}</p>
            <motion.div 
              className="text-sm px-4 py-2 bg-primary text-white rounded-md text-center hover:bg-primary/90 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Event
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-12 px-8 xl:px-16"
    >
      <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-primary mb-6"
      >
        Sports Tickets Near You
      </motion.h2>
      <div className="relative">
        {events.length > 5 && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-primary/90 text-white p-2 rounded-full shadow-sm hover:bg-primary hover:shadow-md transition-all duration-200"
            onClick={() => scroll("left")}
            style={{ zIndex: 10 }}
          >
            <ChevronLeft size={20} />
          </motion.button>
        )}
        <motion.div
          ref={scrollRef}
          className="flex gap-6 overflow-x-scroll scroll-smooth p-4 rounded-lg"
          style={{ scrollSnapType: "x mandatory", overflow: "hidden" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {events.filter(event => event.category === "sports").map((event, index) => renderEventCard(event, index))}
        </motion.div>
        {events.length > 5 && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-primary/90 text-white p-2 rounded-full shadow-sm hover:bg-primary hover:shadow-md transition-all duration-200"
            onClick={() => scroll("right")}
            style={{ zIndex: 10 }}
          >
            <ChevronRight size={20} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default EventGallery;
