import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import API_BASE_URL from '../../config/apiConfig';

const EventGallery = () => {
  const [events, setEvents] = useState([]);
  const scrollRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/events`);
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

  const renderEventCard = (event) => (
    <div key={event._id}>
      <Link to={`/events/${event._id}`} className="flex-shrink-0 w-[250px]">
        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ease-in-out group">
          <div className="w-full h-[140px] bg-gray-200 relative overflow-hidden">
            <img
              src={event.image || ''}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div className="p-4">
            <h3 className="text-base font-medium text-primary mb-1 line-clamp-1">{event.title}</h3>
            <p className="text-sm text-darkGray mb-1">{new Date(event.date + 'T12:00:00').toLocaleDateString()}</p>
            <p className="text-sm text-darkGray mb-3 line-clamp-1">{event.location}</p>
            <div className="text-sm px-4 py-2 bg-primary text-white rounded-md text-center hover:bg-primary/90 transition-colors duration-200">
              View Event
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  return (
    <div className="mt-12 px-8 xl:px-16">
      <h2 className="text-2xl font-bold text-primary mb-6">
        Featured Events
      </h2>
      <div className="relative">
        {events.length > 5 && (
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-primary/90 text-white p-2 rounded-full shadow-sm hover:bg-primary hover:shadow-md transition-all duration-200"
            onClick={() => scroll("left")}
            style={{ zIndex: 10 }}
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-scroll scroll-smooth p-4 rounded-lg"
          style={{ scrollSnapType: "x mandatory", overflow: "hidden" }}
        >
          {events.filter(event => event.category === "sports").map((event) => renderEventCard(event))}
        </div>
        {events.length > 5 && (
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-primary/90 text-white p-2 rounded-full shadow-sm hover:bg-primary hover:shadow-md transition-all duration-200"
            onClick={() => scroll("right")}
            style={{ zIndex: 10 }}
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default EventGallery;
