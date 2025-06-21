import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { AuthContext } from '../components/AuthContext';
import { CartContext } from '../components/CartContext';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import API_BASE_URL from '../config/apiConfig';

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
  const ticketRef = useRef(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      setEvent(null);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/events/${id}`);
        if (res.data && res.data._id) {
          setEvent(res.data);
        } else {
          setError('Event not found.');
        }
      } catch (err) {
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
          type: type
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      addToCart(event);
      setClickedButton(type);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setShowError(true);
      setErrorMessage('An error occurred while adding to cart. Please try again later.');
      setTimeout(() => setShowError(false), 3000);
    }
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pt-24 text-center text-primary text-lg"
      >
        Loading event details...
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pt-24 text-center text-red-500 text-lg"
      >
        {error}
      </motion.div>
    );
  }

  if (!event) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pt-24 text-center text-primary text-lg"
      >
        No event found.
      </motion.div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-lightGray pt-24"
    >
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              className="w-full lg:w-2/3 rounded-xl overflow-hidden border border-gray-100"
            >
              <motion.div
                className="relative"
              >
                {!imageError && event.image ? (
                  <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    src={event.image}
                    alt={event.title || 'Event image'}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200"></div>
                )}
              </motion.div>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              ref={ticketRef} 
              className="w-full lg:w-1/3 flex flex-col space-y-6 p-6"
            >
              <motion.div variants={itemVariants}>
                <motion.h1 
                  variants={itemVariants}
                  className="text-3xl font-bold text-primary mb-4"
                >
                  {event.title || "No title"}
                </motion.h1>
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-col gap-3 mb-6"
                >
                  <motion.div 
                    variants={itemVariants}
                    className="flex items-center gap-2 text-darkGray"
                  >
                    <Calendar size={18} />
                    <p>{event.date ? new Date(event.date).toLocaleDateString() : "No date"}</p>
                  </motion.div>
                  <motion.div 
                    variants={itemVariants}
                    className="flex items-center gap-2 text-darkGray"
                  >
                    <Clock size={18} />
                    <p>{event.date ? new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "No time"}</p>
                  </motion.div>
                  <motion.div 
                    variants={itemVariants}
                    className="flex items-center gap-2 text-darkGray"
                  >
                    <MapPin size={18} />
                    <p>{event.location || "No location"}</p>
                  </motion.div>
                </motion.div>
                <hr className="my-6 border-gray-100" />
                <motion.p 
                  variants={itemVariants}
                  className="text-darkGray leading-relaxed mb-6"
                >
                  {event.description || "No description available."}
                </motion.p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <motion.h2 
                  variants={itemVariants}
                  className="text-2xl font-semibold text-primary mb-4"
                >
                  Buy Tickets
                </motion.h2>
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm transition-all duration-200 hover:shadow-md mb-4"
                >
                  <p className="font-medium text-lg text-primary">General Admission</p>
                  <p className="text-sm text-darkGray mb-3">Access to main event area</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAddToCart('general')}
                    className={`w-full px-4 py-2.5 rounded-lg font-medium text-sm flex justify-center items-center transition-all duration-200
                      ${clickedButton === 'general'
                        ? 'bg-secondary text-white'
                        : 'bg-primary text-white hover:bg-primary/90'}`}
                  >
                    {clickedButton === 'general' ? '✔ Added' : 'Add to Cart'}
                  </motion.button>
                </motion.div>
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <p className="font-medium text-lg text-primary">VIP Ticket</p>
                  <p className="text-sm text-darkGray mb-3">Front row & backstage access</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAddToCart('vip')}
                    className={`w-full px-4 py-2.5 rounded-lg font-medium text-sm flex justify-center items-center transition-all duration-200
                      ${clickedButton === 'vip'
                        ? 'bg-secondary text-white'
                        : 'bg-primary text-white hover:bg-primary/90'}`}
                  >
                    {clickedButton === 'vip' ? '✔ Added' : 'Add to Cart'}
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default SingleEvent;
