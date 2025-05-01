import React, { useState } from 'react';
import axios from 'axios';

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 pt-24">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#38405F] mb-6">
          Host an Event
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Event Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#38405F] focus:border-[#38405F]"
              placeholder="Enter event title"
            />
          </div>

          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Event Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#38405F] focus:border-[#38405F]"
            />
          </div>

          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#38405F] focus:border-[#38405F]"
              placeholder="Enter event location"
            />
          </div>

          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#38405F] focus:border-[#38405F]"
            >
              <option value="">Select a category</option>
              <option value="concert">Concert</option>
              <option value="sports">Sports</option>
              <option value="theater">Theater</option>
            </select>
          </div>

          
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Enter event image URL"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#38405F] focus:border-[#38405F]"
            />
          </div>

          
          <button
            type="submit"
            className="w-full py-2 bg-[#38405F] text-white rounded-full hover:bg-[#0E131F] transition-all duration-300 font-semibold"
          >
            Host Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default HostEvent;
