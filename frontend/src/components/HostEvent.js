import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Image, Tag, Type } from 'lucide-react';

function HostEvent() {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    category: '',
    image: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/events', formData);
      console.log('Event created successfully:', response.data);
      setFormData({
        title: '',
        date: '',
        location: '',
        category: '',
        image: '',
      });
      alert('Event hosted successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to host event');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-lightGray pt-24 pb-12">
      <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-primary mb-8">
          Host an Event
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-primary">
              <Type size={16} />
              Event Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              placeholder="Enter event title"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="date" className="flex items-center gap-2 text-sm font-medium text-primary">
              <Calendar size={16} />
              Event Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="flex items-center gap-2 text-sm font-medium text-primary">
              <MapPin size={16} />
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              placeholder="Enter event location"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="flex items-center gap-2 text-sm font-medium text-primary">
              <Tag size={16} />
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            >
              <option value="">Select a category</option>
              <option value="concert">Concert</option>
              <option value="sports">Sports</option>
              <option value="theater">Theater</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="image" className="flex items-center gap-2 text-sm font-medium text-primary">
              <Image size={16} />
              Image URL
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Enter event image URL"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 active:bg-primary/80 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            Host Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default HostEvent;
