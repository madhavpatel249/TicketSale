import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { AuthContext } from '../components/AuthContext';
import { CartContext } from '../components/CartContext';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock } from 'lucide-react';

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
        const res = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(res.data);
        // Fetch similar events
        const similarRes = await axios.get(`http://localhost:5000/api/events?category=${res.data.category}`);
        setSimilarEvents(similarRes.data.filter(e => e._id !== id));
      } catch (err) {
        console.error('Error fetching event:', err);
      }
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (ticketRef.current) {
      setImageHeight(ticketRef.current.clientHeight);
    }
  }, [event]);

  const handleAddToCart = async (type) => {
    if (!user) {
      alert('Please log in to add tickets to your cart.');
      return;
    }

    setClickedButton(type);
    addToCart({ ...event, type });

    try {
      await axios.post(
        `http://localhost:5000/api/users/${user.id}/cart`,
        { eventId: event._id, ticketType: type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error adding to cart:', error);
    }

    setTimeout(() => setClickedButton(null), 500);
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
      <div className="pt-24 text-center text-primary text-lg animate-fade-in">
        Loading event details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lightGray pt-24">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-fade-in">
          {/* Image and Buy Tickets Row */}
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            {/* Image */}
            <div
              className="w-full lg:w-2/3 rounded-xl overflow-hidden border border-gray-100 transition-transform duration-300 hover:scale-[1.01]"
              style={{ height: imageHeight ? `${imageHeight}px` : 'auto' }}
            >
              {!imageError && event.image ? (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gray-200"></div>
              )}
            </div>

            {/* Buy Tickets */}
            <div ref={ticketRef} className="w-full lg:w-1/3 flex flex-col justify-between space-y-6 p-6">
              <h2 className="text-2xl font-semibold text-primary">Buy Tickets</h2>

              <div className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
                <p className="font-medium text-lg text-primary">General Admission</p>
                <p className="text-sm text-darkGray mb-3">Access to main event area</p>
                <button
                  onClick={() => handleAddToCart('general')}
                  className={`w-full px-4 py-2.5 rounded-lg font-medium text-sm flex justify-center items-center transition-all duration-200
                    ${clickedButton === 'general'
                      ? 'bg-secondary text-white'
                      : 'bg-primary text-white hover:bg-primary/90'}`}
                >
                  {clickedButton === 'general' ? '✔ Added' : 'Add to Cart'}
                </button>
              </div>

              <div className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
                <p className="font-medium text-lg text-primary">VIP Ticket</p>
                <p className="text-sm text-darkGray mb-3">Front row & backstage access</p>
                <button
                  onClick={() => handleAddToCart('vip')}
                  className={`w-full px-4 py-2.5 rounded-lg font-medium text-sm flex justify-center items-center transition-all duration-200
                    ${clickedButton === 'vip'
                      ? 'bg-secondary text-white'
                      : 'bg-primary text-white hover:bg-primary/90'}`}
                >
                  {clickedButton === 'vip' ? '✔ Added' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="p-6">
            <h1 className="text-4xl font-bold text-primary mb-6">{event.title}</h1>
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex items-center gap-2 text-darkGray">
                <Calendar size={18} />
                <p>{new Date(event.date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2 text-darkGray">
                <Clock size={18} />
                <p>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div className="flex items-center gap-2 text-darkGray">
                <MapPin size={18} />
                <p>{event.location}</p>
              </div>
            </div>
            <hr className="my-6 border-gray-100" />
            <p className="text-darkGray leading-relaxed">{event.description}</p>
          </div>
        </div>

        {/* Similar Events Gallery */}
        {similarEvents.length > 0 && (
          <div className="mt-12 animate-slide-up">
            <h2 className="text-2xl font-bold text-primary mb-6">Similar Events</h2>
            <div className="relative">
              {similarEvents.length > 3 && (
                <button
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-primary/90 text-white p-2 rounded-full shadow-sm hover:bg-primary hover:shadow-md transition-all duration-200 z-10"
                  onClick={() => scrollGallery("left")}
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-scroll scroll-smooth p-4 rounded-lg"
                style={{ scrollSnapType: "x mandatory", overflow: "hidden" }}
              >
                {similarEvents.map((similarEvent) => (
                  <Link
                    to={`/events/${similarEvent._id}`}
                    key={similarEvent._id}
                    className="flex-shrink-0 w-[250px] animate-fade-in"
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ease-in-out group">
                      <div className="w-full h-[140px] bg-gray-200 relative overflow-hidden">
                        <img
                          src={similarEvent.image || ''}
                          alt={similarEvent.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-base font-medium text-primary mb-1 line-clamp-1">{similarEvent.title}</h3>
                        <p className="text-sm text-darkGray mb-1">{new Date(similarEvent.date).toLocaleDateString()}</p>
                        <p className="text-sm text-darkGray mb-3 line-clamp-1">{similarEvent.location}</p>
                        <div className="text-sm px-4 py-2 bg-primary text-white rounded-md text-center hover:bg-primary/90 transition-colors duration-200">
                          View Event
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {similarEvents.length > 3 && (
                <button
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-primary/90 text-white p-2 rounded-full shadow-sm hover:bg-primary hover:shadow-md transition-all duration-200 z-10"
                  onClick={() => scrollGallery("right")}
                >
                  <ChevronRight size={20} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SingleEvent;
