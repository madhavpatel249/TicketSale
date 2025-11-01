import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../common/Navbar';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { Calendar, MapPin, Clock, CheckCircle, X, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import API_BASE_URL from '../../config/apiConfig';

const SingleEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [clickedButton, setClickedButton] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [cartItem, setCartItem] = useState(null);
  const ticketRef = useRef(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      setEvent(null);
      try {
        console.log('Fetching event with ID:', id);
        console.log('API URL:', `${API_BASE_URL}/api/events/${id}`);
        const res = await axios.get(`${API_BASE_URL}/api/events/${id}`);
        console.log('API Response:', res.data);
        if (res.data && res.data._id) {
          setEvent(res.data);
        } else {
          console.error('Event data is invalid:', res.data);
          setError('Event not found.');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        console.error('Error response:', err.response);
        setError('Could not load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleAddToCart = async (type) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/api/users/${user.id}/cart`,
        {
          eventId: id,
          quantity: 1,
          ticketType: type
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      addToCart(event, type);
      setClickedButton(type);
      setCartItem({ type, event });
      setShowCartModal(true);
      setTimeout(() => setShowCartModal(false), 4000);
    } catch (error) {
      console.error('Add to cart error:', error.response?.data || error.message);
      setShowError(true);
      setErrorMessage('An error occurred while adding to cart. Please try again later.');
      setTimeout(() => setShowError(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary/5 to-lightGray pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-primary text-xl font-semibold mb-2">Loading event details...</div>
          <div className="text-darkGray">Please wait</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary/5 to-lightGray pt-24 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md">
          <div className="text-warning text-xl font-semibold mb-2">{error}</div>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-shadow duration-150 font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary/5 to-lightGray pt-24 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md">
          <div className="text-primary text-xl font-semibold mb-2">No event found.</div>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-shadow duration-150 font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary/5 to-lightGray pt-24">
      <Navbar scrolled={true} />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            <div className="w-full lg:w-2/3 rounded-xl overflow-hidden border border-gray-100 shadow-lg">
              <div className="relative aspect-video">
                {!imageError && event.image ? (
                  <img
                    src={event.image}
                    alt={event.title || 'Event image'}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <p className="text-gray-500 font-medium">No image available</p>
                  </div>
                )}
              </div>
            </div>
            <div ref={ticketRef} className="w-full lg:w-1/3 flex flex-col space-y-6 p-6 lg:p-8">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-6">
                  {event.title || "No title"}
                </h1>
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex items-center gap-3 text-darkGray bg-gray-50 p-3 rounded-lg">
                    <Calendar size={18} className="text-primary" />
                    <p className="font-medium">{event.date ? new Date(event.date + 'T12:00:00').toLocaleDateString() : "No date"}</p>
                  </div>
                  <div className="flex items-center gap-3 text-darkGray bg-gray-50 p-3 rounded-lg">
                    <Clock size={18} className="text-primary" />
                    <p className="font-medium">{event.date ? new Date(event.date + 'T12:00:00').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "No time"}</p>
                  </div>
                  <div className="flex items-center gap-3 text-darkGray bg-gray-50 p-3 rounded-lg">
                    <MapPin size={18} className="text-primary" />
                    <p className="font-medium">{event.location || "No location"}</p>
                  </div>
                </div>
                <hr className="my-6 border-gray-200" />
                <p className="text-darkGray leading-relaxed mb-6">
                  {event.description || "No description available."}
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary mb-6">
                  Buy Tickets
                </h2>
                <div className="border border-gray-100 rounded-xl p-6 bg-white shadow-sm transition-all duration-200 hover:shadow-md mb-4">
                  <p className="font-medium text-lg text-primary">General Admission</p>
                  <p className="text-sm text-darkGray mb-3">Access to main event area</p>
                  <button
                    onClick={() => handleAddToCart('general')}
                    className={`w-full px-4 py-3 rounded-xl font-semibold text-sm flex justify-center items-center transition-all duration-150 shadow-md hover:shadow-lg
                      ${clickedButton === 'general'
                        ? 'bg-gradient-to-r from-secondary to-accent text-white'
                        : 'bg-gradient-to-r from-primary to-secondary text-white hover:scale-[1.02]'}`}
                  >
                    {clickedButton === 'general' ? '✔ Added to Cart' : 'Add to Cart'}
                  </button>
                </div>
                <div className="border border-gray-100 rounded-xl p-6 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
                  <p className="font-medium text-lg text-primary">VIP Ticket</p>
                  <p className="text-sm text-darkGray mb-3">Front row & backstage access</p>
                  <button
                    onClick={() => handleAddToCart('vip')}
                    className={`w-full px-4 py-3 rounded-xl font-semibold text-sm flex justify-center items-center transition-all duration-150 shadow-md hover:shadow-lg
                      ${clickedButton === 'vip'
                        ? 'bg-gradient-to-r from-secondary to-accent text-white'
                        : 'bg-gradient-to-r from-primary to-secondary text-white hover:scale-[1.02]'}`}
                  >
                    {clickedButton === 'vip' ? '✔ Added to Cart' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Cart Success Modal */}
      {showCartModal && cartItem && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    Added to Cart!
                  </h3>
                  <button
                    onClick={() => setShowCartModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {cartItem.type === 'vip' ? 'VIP Ticket' : 'General Admission'} for {event.title}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      setShowCartModal(false);
                      navigate('/my-cart');
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-xs rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    View Cart
                  </button>
                  <button
                    onClick={() => setShowCartModal(false)}
                    className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showError && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
          <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <X className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-red-900">
                    Error
                  </h3>
                  <button
                    onClick={() => setShowError(false)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  {errorMessage}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleEvent;
