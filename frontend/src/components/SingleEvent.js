import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { AuthContext } from '../components/AuthContext';
import { CartContext } from '../components/CartContext';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../config/apiConfig';

function SingleEvent() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [similarEvents, setSimilarEvents] = useState([]);
  const [clickedButton, setClickedButton] = useState(null);
  const [imageError, setImageError] = useState(false);
  const { user, token } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  const ticketRef = useRef();
  const scrollRef = useRef();
  const [imageHeight, setImageHeight] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/events/${id}`);
        setEvent(res.data);
        // Fetch similar events
        const similarRes = await axios.get(`${API_BASE_URL}/api/events?category=${res.data.category}`);
        setSimilarEvents(similarRes.data.filter(e => e._id !== id));
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (ticketRef.current) {
      setImageHeight(ticketRef.current.clientHeight);
    }
  }, [event]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/users/${user.id}/cart`,
        {
          eventId: id,
          quantity: 1
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      addToCart(event);
      setClickedButton('cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const scrollGallery = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const maxScroll = current.scrollWidth - current.clientWidth;
      const scrollAmount = 260 * 3; // Scroll 3 cards at a time
      let newScrollPosition = scrollPosition + (direction === "left" ? -scrollAmount : scrollAmount);
      newScrollPosition = Math.max(0, Math.min(newScrollPosition, maxScroll));
      
      current.scrollTo({ left: newScrollPosition, behavior: "smooth" });
      setScrollPosition(newScrollPosition);
    }
  };

  if (!event) {
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
          {/* Image and Buy Tickets Row */}
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            {/* Image */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              className="w-full lg:w-2/3 rounded-xl overflow-hidden border border-gray-100"
              style={{ height: imageHeight ? `${imageHeight}px` : 'auto' }}
            >
              {!imageError && event.image ? (
                <motion.img
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gray-200"></div>
              )}
            </motion.div>

            {/* Buy Tickets */}
            <motion.div 
              variants={itemVariants}
              ref={ticketRef} 
              className="w-full lg:w-1/3 flex flex-col justify-between space-y-6 p-6"
            >
              <motion.h2 
                variants={itemVariants}
                className="text-2xl font-semibold text-primary"
              >
                Buy Tickets
              </motion.h2>

              <motion.div 
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
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
          </div>

          {/* Event Details */}
          <motion.div 
            variants={itemVariants}
            className="p-6"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-4xl font-bold text-primary mb-6"
            >
              {event.title}
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
                <p>{new Date(event.date).toLocaleDateString()}</p>
              </motion.div>
              <motion.div 
                variants={itemVariants}
                className="flex items-center gap-2 text-darkGray"
              >
                <Clock size={18} />
                <p>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </motion.div>
              <motion.div 
                variants={itemVariants}
                className="flex items-center gap-2 text-darkGray"
              >
                <MapPin size={18} />
                <p>{event.location}</p>
              </motion.div>
            </motion.div>
            <hr className="my-6 border-gray-100" />
            <motion.p 
              variants={itemVariants}
              className="text-darkGray leading-relaxed"
            >
              {event.description}
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Similar Events Gallery */}
        {similarEvents.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-2xl font-bold text-primary mb-6"
            >
              Similar Events
            </motion.h2>
            <div className="relative">
              {similarEvents.length > 3 && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-primary/90 text-white p-2 rounded-full shadow-sm hover:bg-primary hover:shadow-md transition-all duration-200 z-10"
                  onClick={() => scrollGallery("left")}
                >
                  <ChevronLeft size={20} />
                </motion.button>
              )}
              <motion.div
                ref={scrollRef}
                className="flex gap-6 overflow-x-scroll scroll-smooth p-4 rounded-lg"
                style={{ scrollSnapType: "x mandatory", overflow: "hidden" }}
              >
                {similarEvents.map((similarEvent, index) => (
                  <motion.div
                    key={similarEvent._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Link
                      to={`/events/${similarEvent._id}`}
                      className="flex-shrink-0 w-[250px]"
                    >
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ease-in-out group"
                      >
                        <div className="w-full h-[140px] bg-gray-200 relative overflow-hidden">
                          <motion.img
                            src={similarEvent.image || ''}
                            alt={similarEvent.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-base font-medium text-primary mb-1 line-clamp-1">{similarEvent.title}</h3>
                          <p className="text-sm text-darkGray mb-1">{new Date(similarEvent.date).toLocaleDateString()}</p>
                          <p className="text-sm text-darkGray mb-3 line-clamp-1">{similarEvent.location}</p>
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-sm px-4 py-2 bg-primary text-white rounded-md text-center hover:bg-primary/90 transition-colors duration-200"
                          >
                            View Event
                          </motion.div>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
              {similarEvents.length > 3 && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-primary/90 text-white p-2 rounded-full shadow-sm hover:bg-primary hover:shadow-md transition-all duration-200 z-10"
                  onClick={() => scrollGallery("right")}
                >
                  <ChevronRight size={20} />
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default SingleEvent;
