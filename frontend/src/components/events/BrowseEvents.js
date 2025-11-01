import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import { Link } from 'react-router-dom';
import Navbar from '../common/Navbar';
import { Search, Filter, Calendar, MapPin, Tag, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

function BrowseEvents() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState({ category: '', country: '', sort: 'date' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/events`);
        setEvents(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
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

  const resetFilters = () => {
    setFilter({ category: '', country: '', sort: 'date' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary/5 to-lightGray pt-24 pb-12">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent"
        >
          Browse All Events
        </motion.h2>
        <p className="text-center text-darkGray mb-10">Discover amazing events happening near you</p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-10"
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
                <Tag size={16} />
                Category
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                value={filter.category}
                onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              >
                <option value="">All Categories</option>
                <option value="concert">Concert</option>
                <option value="sports">Sports</option>
                <option value="theater">Theater</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
                <MapPin size={16} />
                Location
              </label>
              <input
                type="text"
                placeholder="Search by country"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                value={filter.country}
                onChange={(e) => setFilter({ ...filter, country: e.target.value })}
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
                <Calendar size={16} />
                Sort By
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                value={filter.sort}
                onChange={(e) => setFilter({ ...filter, sort: e.target.value })}
              >
                <option value="date">Date (Soonest First)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2.5 bg-gray-100 text-darkGray rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-all duration-200 font-medium flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Reset
              </button>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center text-darkGray animate-fade-in">
            Loading events...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center text-darkGray animate-fade-in">
            No events found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
              <Link to={`/events/${event._id}`}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden group card-hover">
                  <div className="w-full h-48 bg-gray-100 relative overflow-hidden">
                    <img
                      src={event.image || ''}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-primary mb-2 line-clamp-1">{event.title}</h3>
                    <div className="space-y-2 text-darkGray">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span className="text-sm">{new Date(event.date + 'T12:00:00').toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span className="text-sm line-clamp-1">{event.location}</span>
                      </div>
                    </div>

                    {event.pricing && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm font-medium text-secondary">
                          From ${Math.min(...Object.values(event.pricing)) || 0}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BrowseEvents;
