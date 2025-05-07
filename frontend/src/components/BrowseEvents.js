import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import Navbar from './Navbar';

function BrowseEvents() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState({ category: '', country: '', sort: 'date' });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/events');
        setEvents(res.data);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = [...events]
    .filter(event => !filter.category || event.category === filter.category)
    .filter(event => !filter.country || event.location.toLowerCase().includes(filter.country.toLowerCase()))
    .sort((a, b) => {
      if (filter.sort === 'date') {
        return new Date(a.date) - new Date(b.date);
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-100 pt-24">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#0E131F] mb-6 text-center">Browse All Events</h2>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <select
            className="px-4 py-2 rounded border border-gray-300"
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="concert">Concert</option>
            <option value="sports">Sports</option>
            <option value="theater">Theater</option>
          </select>
          <input
            type="text"
            placeholder="Search by country"
            className="px-4 py-2 rounded border border-gray-300"
            value={filter.country}
            onChange={(e) => setFilter({ ...filter, country: e.target.value })}
          />
          <select
            className="px-4 py-2 rounded border border-gray-300"
            value={filter.sort}
            onChange={(e) => setFilter({ ...filter, sort: e.target.value })}
          >
            <option value="date">Date (Soonest First)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredEvents.map(event => (
            <Link to={`/events/${event._id}`} key={event._id}>
              <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer">
                <div className="w-full h-40 bg-gray-300 rounded overflow-hidden">
                  <img
                    src={event.image || ''}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <h3 className="text-xl font-semibold mt-4 text-[#0E131F]">{event.title}</h3>
                <p className="text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                <p className="text-gray-600">{event.location}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BrowseEvents;
