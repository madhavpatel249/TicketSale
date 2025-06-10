import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Image, Tag, Type } from 'lucide-react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/apiConfig';

function HostEvent() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    category: '',
    image: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (JPEG or PNG)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return null;

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post(`${API_BASE_URL}/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || user.role !== 'host') {
      setError('Only hosts can create events');
      return;
    }

    try {
      setUploading(true);
      setError('');

      // Upload image first if selected
      let imageUrl = formData.image;
      if (selectedFile) {
        imageUrl = await uploadImage();
      }

      // Create event with image URL
      const eventData = {
        ...formData,
        image: imageUrl
      };

      const response = await axios.post(`${API_BASE_URL}/events`, eventData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Event created successfully:', response.data);
      setFormData({
        title: '',
        date: '',
        location: '',
        category: '',
        image: '',
      });
      setSelectedFile(null);
      alert('Event hosted successfully!');
      navigate('/browse-events');
    } catch (error) {
      console.error('Error creating event:', error);
      setError(error.response?.data?.error || 'Failed to host event');
    } finally {
      setUploading(false);
    }
  };

  if (!user || user.role !== 'host') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-lightGray pt-24 pb-12">
        <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Access Denied</h2>
          <p className="text-gray-600">Only hosts can create events. Please log in as a host to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-lightGray pt-24 pb-12">
      <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-primary mb-8">
          Host an Event
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

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
              Event Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              accept="image/jpeg,image/png"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
            <p className="text-xs text-gray-500">Upload a JPEG or PNG image (max 5MB)</p>
            {selectedFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Selected file: {selectedFile.name}</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={uploading}
            className={`w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 active:bg-primary/80 transition-all duration-200 font-medium shadow-sm hover:shadow-md ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? 'Creating Event...' : 'Host Event'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default HostEvent;
