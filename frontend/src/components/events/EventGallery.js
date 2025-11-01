import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import API_BASE_URL from '../../config/apiConfig';

const EventGallery = () => {
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const scrollRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/events`);
        const allEvents = response.data;
        setEvents(allEvents);
        
        // Filter sports events and shuffle them
        const sportsEvents = allEvents.filter(event => event.category === "sports");
        
        // Shuffle array using Fisher-Yates algorithm
        const shuffled = [...sportsEvents].sort(() => Math.random() - 0.5);
        
        // Take max 4 events
        setFeaturedEvents(shuffled.slice(0, 4));
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const getScrollAmount = () => {
    const visibleCards = Math.min(featuredEvents.length, 4); 
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

  const renderEventCard = (event) => (
    <div key={event._id}>
      <Link to={`/events/${event._id}`} className="flex-shrink-0 w-[250px]">
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 ease-in-out group card-hover">
          <div className="w-full h-[160px] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
            <img
              src={event.image || ''}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div className="p-4">
            <h3 className="text-base font-semibold text-primary mb-2 line-clamp-1">{event.title}</h3>
            <p className="text-sm text-darkGray mb-1 font-medium">{new Date(event.date + 'T12:00:00').toLocaleDateString()}</p>
            <p className="text-sm text-darkGray mb-4 line-clamp-1">{event.location}</p>
            <div className="text-sm px-4 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg text-center hover:shadow-md transition-all duration-200 font-medium">
              View Event
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  return (
    <div className="mt-12 px-8 xl:px-16">
      <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
        Featured Events
      </h2>
      <p className="text-darkGray mb-8">Discover what's happening around you</p>
      <div className="relative">
        {featuredEvents.length > 4 && (
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-primary to-secondary text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 z-10"
            onClick={() => scroll("left")}
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-scroll scroll-smooth p-4 rounded-lg scrollbar-thin"
          style={{ scrollSnapType: "x mandatory", overflowX: "auto", overflowY: "hidden" }}
        >
          {featuredEvents.map((event) => renderEventCard(event))}
        </div>
        {featuredEvents.length > 4 && (
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-primary to-secondary text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 z-10"
            onClick={() => scroll("right")}
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default EventGallery;
