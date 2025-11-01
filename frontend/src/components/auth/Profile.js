import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Navbar from '../common/Navbar';
import { AuthContext } from '../../context/AuthContext';
import { CalendarDays, MapPin, Ticket, User, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import API_BASE_URL from '../../config/apiConfig';

function Profile() {
  const { user, token } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/${user.id}/tickets`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Tickets API Response:', res.data); // Debug log
        const ticketsData = res.data.tickets || [];
        console.log('Tickets Data:', ticketsData); // Debug log

        if (ticketsData.length === 0) {
          setTickets([]);
          setLoading(false);
          return;
        }

        const ticketsWithEvents = await Promise.all(
          ticketsData.map(async (ticket) => {
            const eventRes = await axios.get(`${API_BASE_URL}/api/events/${ticket.eventId}`);
            return {
              ...ticket,
              event: eventRes.data
            };
          })
        );

        setTickets(ticketsWithEvents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setError('Failed to load tickets');
        setLoading(false);
      }
    };

    if (user && token) {
      fetchTickets();
    }
  }, [user, token]);

  const groupTicketsByMonth = () => {
    const groups = {};
    tickets.forEach(ticket => {
      const event = ticket.event;
      if (!event || !ticket.purchasedAt) return;

      // Group by purchase date, not event date
      // Parse date properly to avoid timezone issues
      const purchaseDate = new Date(ticket.purchasedAt);
      
      // Check if date is valid
      if (isNaN(purchaseDate.getTime())) {
        console.error('Invalid date:', ticket.purchasedAt);
        return;
      }
      
      // Ensure we get the full month name
      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const month = monthNames[purchaseDate.getMonth()];
      const year = purchaseDate.getFullYear();
      const monthYear = `${month} ${year}`;

      if (!groups[monthYear]) groups[monthYear] = [];
      groups[monthYear].push({ ticket, event });
    });
    return groups;
  };

  const groupedTickets = groupTicketsByMonth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary/5 to-lightGray pt-24 pb-12">
      <Navbar />
      {showConfetti && <Confetti />}
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-4xl font-bold mb-2 flex items-center gap-3 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            <User size={32} className="text-primary" />
            My Tickets
          </h2>
          <p className="text-darkGray">View all your purchased tickets</p>
        </div>

        {loading ? (
          <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="text-lg font-semibold text-primary">Loading your tickets...</div>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 text-warning bg-warning/10 p-4 rounded-xl border border-warning/20 shadow-md">
            <AlertCircle size={20} />
            <p className="font-medium">{error}</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-gray-100">
            <Ticket size={48} className="mx-auto text-gray-300 mb-4" />
            <div className="text-xl font-semibold text-primary mb-2">You haven't purchased any tickets yet.</div>
            <p className="text-darkGray">Browse events to get started!</p>
          </div>
        ) : (
          Object.entries(groupedTickets).map(([monthYear, items]) => (
            <motion.div 
              key={monthYear} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold text-primary mb-8 pb-2 border-b-2 border-gray-200">{monthYear}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(({ ticket, event }, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 card-hover"
                  >
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden mb-4 shadow-md">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                          onError={(e) => (e.target.style.display = 'none')}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <Ticket className="text-gray-400" size={48} />
                        </div>
                      )}
                    </div>

                    <h4 className="text-xl font-bold text-primary mb-4">{event.title}</h4>
                    
                    <div className="space-y-2 text-darkGray mb-4">
                      <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                        <CalendarDays size={16} className="text-primary" />
                        <span className="text-sm font-medium">{new Date(event.date + 'T12:00:00').toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                        <MapPin size={16} className="text-primary" />
                        <span className="text-sm font-medium">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-secondary bg-secondary/10 p-2 rounded-lg">
                        <Ticket size={16} />
                        <span className="text-sm font-medium">{ticket.type.toUpperCase()} Ticket</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-darkGray font-medium">
                        Purchased: {new Date(ticket.purchasedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;
