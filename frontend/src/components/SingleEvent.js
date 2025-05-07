import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { AuthContext } from '../components/AuthContext';
import { CartContext } from '../components/CartContext';

function SingleEvent() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [clickedButton, setClickedButton] = useState(null);
  const [imageError, setImageError] = useState(false);
  const { user, token } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error('Error fetching event:', err);
      }
    };
    fetchEvent();
  }, [id]);

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
      console.log('Ticket added to backend cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }

    setTimeout(() => setClickedButton(null), 500);
  };

  if (!event) {
    return (
      <div className="pt-24 text-center text-gray-500 text-lg">
        Loading event details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-24">
      <Navbar />
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
        
        <div className="lg:col-span-2">
          <div className="w-full h-64 bg-gray-200 rounded-xl overflow-hidden mb-6 border border-gray-200 hover:shadow-md flex items-center justify-center">
            {!imageError && event.image ? (
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gray-300"></div>
            )}
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{event.title}</h1>
          <div className="text-gray-700 space-y-2 mb-6">
            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p><strong>Location:</strong> {event.location}</p>
          </div>
          <hr className="my-6" />
          <p className="text-gray-800">{event.description}</p>
        </div>

        
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-[#0E131F] mb-2">Buy Tickets</h2>

          
          <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
            <p className="font-semibold text-lg text-gray-800">General Admission</p>
            <p className="text-sm text-gray-500 mb-3">Access to main event area</p>
            <button
              onClick={() => handleAddToCart('general')}
              className={`w-full px-4 py-2 rounded-lg font-medium text-sm flex justify-center items-center
                ${clickedButton === 'general'
                  ? 'bg-green-500 text-white'
                  : 'bg-[#38405F] text-white hover:bg-[#0E131F]'}`}
            >
              {clickedButton === 'general' ? '✔ Added' : 'Add to Cart'}
            </button>
          </div>

          
          <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
            <p className="font-semibold text-lg text-gray-800">VIP Ticket</p>
            <p className="text-sm text-gray-500 mb-3">Front row & backstage access</p>
            <button
              onClick={() => handleAddToCart('vip')}
              className={`w-full px-4 py-2 rounded-lg font-medium text-sm flex justify-center items-center
                ${clickedButton === 'vip'
                  ? 'bg-green-500 text-white'
                  : 'bg-[#38405F] text-white hover:bg-[#0E131F]'}`}
            >
              {clickedButton === 'vip' ? '✔ Added' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleEvent;
