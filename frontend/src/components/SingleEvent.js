import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { AuthContext } from '../components/AuthContext';
import { CartContext } from '../components/CartContext';
import { Calendar, MapPin, Clock } from 'lucide-react';
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
          type: type
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      addToCart(event, type);
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
      <div className="pt-24 text-center text-primary text-lg">
        Loading event details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 text-center text-red-500 text-lg">
        {error}
      </div>
    );
  }

  if (!event) {
    return (
      <div className="pt-24 text-center text-primary text-lg">
        No event found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lightGray pt-24">
      <Navbar scrolled={true} />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            <div className="w-full lg:w-2/3 rounded-xl overflow-hidden border border-gray-100">
              <div className="relative">
                <div className="w-full h-full bg-gray-200 flex items-center justify-center p-4">
                  <p className="text-gray-500 text-center">Image rendering is temporarily disabled for debugging.</p>
                </div>
              </div>
            </div>
            <div ref={ticketRef} className="w-full lg:w-1/3 flex flex-col space-y-6 p-6">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-4">
                  {event.title || "No title"}
                </h1>
                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex items-center gap-2 text-darkGray">
                    <Calendar size={18} />
                    <p>{event.date ? new Date(event.date).toLocaleDateString() : "No date"}</p>
                  </div>
                  <div className="flex items-center gap-2 text-darkGray">
                    <Clock size={18} />
                    <p>{event.date ? new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "No time"}</p>
                  </div>
                  <div className="flex items-center gap-2 text-darkGray">
                    <MapPin size={18} />
                    <p>{event.location || "No location"}</p>
                  </div>
                </div>
                <hr className="my-6 border-gray-100" />
                <p className="text-darkGray leading-relaxed mb-6">
                  {event.description || "No description available."}
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  Buy Tickets
                </h2>
                <div className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm transition-all duration-200 hover:shadow-md mb-4">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleEvent;
