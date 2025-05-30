import { useState, useEffect } from 'react';
import axios from 'axios';

const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    date: null,
    venue: '',
    search: ''
  });

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.date) params.append('date', filters.date);
      if (filters.venue) params.append('venue', filters.venue);
      if (filters.search) params.append('search', filters.search);

      const response = await axios.get(`/api/events?${params.toString()}`);
      setEvents(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const getEvent = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/events/${id}`);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/events', eventData);
      await fetchEvents();
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (id, eventData) => {
    try {
      setLoading(true);
      const response = await axios.put(`/api/events/${id}`, eventData);
      await fetchEvents();
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/events/${id}`);
      await fetchEvents();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    events,
    loading,
    error,
    filters,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    updateFilters,
    refreshEvents: fetchEvents
  };
};

export default useEvents; 