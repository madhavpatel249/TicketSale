import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { AuthContext } from '../components/AuthContext';

function Profile() {
  const { user, token } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [eventsMap, setEventsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user || !token) return;

      try {
        const res = await axios.get(`http://localhost:5000/api/users/${user.id}/tickets`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setTickets(res.data.tickets);

        const eventIds = [...new Set(res.data.tickets.map(t => t.eventId))];
        const responses = await Promise.all(eventIds.map(id =>
          axios.get(`http://localhost:5000/api/events/${id}`)
        ));

        const map = {};
        responses.forEach(res => {
          map[res.data._id] = res.data;
        });

        setEventsMap(map);
        setError('');
      } catch (err) {
        console.error('Failed to fetch tickets:', err);
        setError('Failed to load your tickets.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user, token]);

  return (
    <div className="min-h-screen bg-gray-100 pt-24">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-[#0E131F] mb-6">My Tickets</h2>

        {loading ? (
          <p className="text-gray-600">Loading your tickets...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : tickets.length === 0 ? (
          <p className="text-gray-600">You haven’t purchased any tickets yet.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-6">
            {tickets.map((ticket, index) => {
              const event = eventsMap[ticket.eventId];
              return (
                <li key={index} className="bg-white p-5 rounded-lg shadow border border-gray-200">
                  <p className="text-lg font-semibold text-[#38405F]">
                    {event?.title || 'Event not found'}
                  </p>
                  {event && (
                    <>
                      <p className="text-sm text-gray-700">
                        Date: {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-700">Location: {event.location}</p>
                    </>
                  )}
                  <p className="text-sm text-gray-700">Ticket Type: {ticket.type}</p>
                  <p className="text-sm text-gray-500">
                    Purchased: {new Date(ticket.purchasedAt).toLocaleDateString()}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Profile;
