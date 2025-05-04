import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

function SingleEvent() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [clickedButton, setClickedButton] = useState(null); // 'general admssion' or 'vip'
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error('Error fetching single event:', err);
      }
    };
    fetchEvent();
  }, [id]);

  const handlePurchase = (type) => {
    setClickedButton(type);
    setTimeout(() => setClickedButton(null), 400);
  };

  if (!event)
    return (
      <div className="pt-24 text-center text-gray-500 text-lg">
        Loading event details...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-24">
      <Navbar />

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
        
        <div className="lg:col-span-2">
          
          <div className="w-full h-64 bg-gray-200 rounded-xl overflow-hidden mb-6 border border-gray-200 hover:shadow-md transition duration-300 flex items-center justify-center">
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
            <p>
              <span className="font-semibold">Date:</span>{' '}
              {new Date(event.date).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Time:</span>{' '}
              {new Date(event.date).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p>
              <span className="font-semibold">Location:</span> {event.location}
            </p>
          </div>

          <hr className="my-6" />

          <p className="text-gray-800 leading-relaxed text-[16px]">
            {event.description}
          </p>
        </div>

        
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-[#0E131F] mb-2">Buy Tickets</h2>

          
          <div className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition bg-white">
            <div className="mb-3">
              <p className="font-semibold text-lg text-gray-800">General Admission</p>
              <p className="text-sm text-gray-500">Access to main event area</p>
            </div>
            <button
              onClick={() => handlePurchase('general')}
              className={`w-full px-4 py-2 rounded-lg font-medium transition flex justify-center items-center text-sm
                ${clickedButton === 'general'
                  ? 'bg-green-500 text-white'
                  : 'bg-[#38405F] text-white hover:bg-[#0E131F]'}`}
            >
              {clickedButton === 'general' ? '✔' : 'Buy'}
            </button>
          </div>

          
          <div className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition bg-white">
            <div className="mb-3">
              <p className="font-semibold text-lg text-gray-800">VIP Ticket</p>
              <p className="text-sm text-gray-500">Front row & backstage access</p>
            </div>
            <button
              onClick={() => handlePurchase('vip')}
              className={`w-full px-4 py-2 rounded-lg font-medium transition flex justify-center items-center text-sm
                ${clickedButton === 'vip'
                  ? 'bg-green-500 text-white'
                  : 'bg-[#38405F] text-white hover:bg-[#0E131F]'}`}
            >
              {clickedButton === 'vip' ? '✔' : 'Buy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleEvent;
