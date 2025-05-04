import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EventGallery.css";
import { Link } from "react-router-dom";

const EventGallery = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const concerts = events.filter(event => event.category === "concert");
  const sports = events.filter(event => event.category === "sports");

  const renderEventCard = (event) => (
    <Link to={`/events/${event._id}`} key={event._id} className="w-[250px]">
      <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition w-full">
        <div className="w-full h-[140px] bg-gray-300">
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
          <h3 className="text-base font-semibold text-[#0E131F] line-clamp-2 mb-1">{event.title}</h3>
          <p className="text-sm text-gray-500 mb-1">{new Date(event.date).toLocaleDateString()}</p>
          <p className="text-sm text-gray-500 mb-2 line-clamp-1">{event.location}</p>
          <div className="text-sm px-3 py-1 bg-[#38405F] text-white rounded-full text-center hover:bg-[#0E131F] transition duration-300 inline-block">
            View Event
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="mt-12 px-10 xl:px-20">
      <h2 className="text-2xl font-bold text-[#0E131F] mb-4">Popular Concerts</h2>
      <div className="flex flex-wrap gap-6 justify-start mb-10">
        {concerts.map(renderEventCard)}
      </div>

      <h2 className="text-2xl font-bold text-[#0E131F] mb-4">Sports Tickets Near You</h2>
      <div className="flex flex-wrap gap-6 justify-start mb-10">
        {sports.map(renderEventCard)}
      </div>
    </div>
  );
};

export default EventGallery;
