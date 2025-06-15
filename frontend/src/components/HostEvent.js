import React, { useState, useContext } from 'react';
import { Calendar, MapPin, Image, Tag, Type, Upload, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from './AuthContext';
import API_BASE_URL from '../config/apiConfig';
import apiClient from './services/apiService';
import { useNavigate } from 'react-router-dom';

function HostEvent() {
  const { user, token } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    category: '',
    image: ''
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setShowError(true);
      setErrorMessage('Please upload an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setShowError(true);
      setErrorMessage('Image size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const response = await apiClient.post('/api/events/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFormData(prev => ({ ...prev, image: response.data.imageUrl }));
      setImagePreview(URL.createObjectURL(file));
    } catch (error) {
      console.error('Error uploading image:', error);
      setShowError(true);
      setErrorMessage('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !token) {
      setShowError(true);
      setErrorMessage('Please log in to host an event');
      return;
    }

    // Validate required fields 
    const requiredFields = ['title', 'date', 'location', 'category'];
    const missingFields = requiredFields.filter(field => !formData[field]);     
    
    if (missingFields.length > 0) {
      setShowError(true);
      setErrorMessage(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    if (!formData.image) {
      setShowError(true);
      setErrorMessage('Please upload an event image');
      return;
    }

    setUploading(true);
    setShowError(false);
    setErrorMessage('');

    try {
      const eventData = {
        title: formData.title,
        date: formData.date,
        location: formData.location,
        category: formData.category,
        image: formData.image,
        userId: user.id
      };

      const response = await apiClient.post('/api/events', eventData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error creating event:', error);
      setShowError(true);
      setErrorMessage(error.response?.data?.error || 'Failed to create event. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-lightGray pt-12 pb-8">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">
          Host an Event
        </h2>

        {showError && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
            <span className="text-sm">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="title" className="flex items-center gap-1 text-sm font-medium text-primary">
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
              <label htmlFor="date" className="flex items-center gap-1 text-sm font-medium text-primary">
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
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="location" className="flex items-center gap-1 text-sm font-medium text-primary">
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
              <label htmlFor="category" className="flex items-center gap-1 text-sm font-medium text-primary">
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
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-1 text-sm font-medium text-primary">
              <Image size={16} />
              Event Image
            </label>
            <div className="relative">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="image"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-primary/50 transition-all duration-200"
              >
                <Upload size={18} className="text-gray-400" />
                <span className="text-gray-500">
                  {uploading ? 'Uploading...' : 'Click to upload image'}
                </span>
              </label>
            </div>
            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="Event preview"
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={uploading}
            className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 active:bg-primary/80 transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Host Event'}
          </motion.button>
        </form>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-white p-4 rounded-lg shadow-lg border border-gray-100 flex items-center gap-3"
          >
            <AlertCircle className="text-warning" size={20} />
            <p className="text-sm font-medium text-gray-700">
              You need to be logged in as a host
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HostEvent;
