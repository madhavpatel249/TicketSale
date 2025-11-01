import React, { useState, useContext } from 'react';
import { Calendar, MapPin, Image, Tag, Type, Upload, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../config/apiConfig';
import apiClient from '../../api/apiService';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';

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
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-primary/5 via-secondary/5 to-lightGray pt-24 pb-12 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg p-8 space-y-6 bg-white rounded-2xl shadow-xl border border-gray-100"
        >
          <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Host an Event
          </h2>
          <p className="text-center text-darkGray mb-8">Create and share your event with the world</p>

          {showError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-50 text-red-700 rounded-xl border-2 border-red-200 flex items-center gap-3 shadow-md"
            >
              <AlertCircle size={20} />
              <span className="font-medium">{errorMessage}</span>
            </motion.div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-primary">
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 text-darkGray placeholder-gray-400"
                  placeholder="Enter event title"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="date" className="flex items-center gap-2 text-sm font-semibold text-primary">
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 text-darkGray"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="location" className="flex items-center gap-2 text-sm font-semibold text-primary">
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 text-darkGray placeholder-gray-400"
                  placeholder="Enter event location"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Tag size={16} />
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 text-darkGray"
                >
                  <option value="">Select a category</option>
                  <option value="concert">Concert</option>
                  <option value="sports">Sports</option>
                  <option value="theater">Theater</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-primary">
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
                  className="flex items-center justify-center gap-2 w-full px-4 py-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-200 bg-gray-50"
                >
                  <Upload size={20} className="text-primary" />
                  <span className="text-darkGray font-medium">
                    {uploading ? 'Uploading...' : 'Click to upload image'}
                  </span>
                </label>
              </div>
              {imagePreview && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 rounded-xl overflow-hidden shadow-md border-2 border-gray-200"
                >
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    className="w-full h-48 object-cover"
                  />
                </motion.div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              type="submit"
              disabled={uploading}
              className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-shadow duration-150 font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Host Event'}
            </motion.button>
          </form>
        </motion.div>
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
    </>
  );
}

export default HostEvent;
