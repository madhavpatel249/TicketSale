import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { AuthContext } from '../components/AuthContext';
import { CalendarDays, MapPin, Ticket, User, AlertCircle } from 'lucide-react';
import Confetti from 'react-confetti';

function Profile() {
  const { user, token } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [eventsMap, setEventsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user || !token) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${user.id}/tickets`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const rawTickets = res.data.tickets;
        const eventIds = [...new Set(rawTickets.map(t => t.eventId))];

        const responses = await Promise.all(eventIds.map(id =>
          axios.get(`http://localhost:5000/api/events/${id}`)
        ));

        const map = {};
        responses.forEach(res => {
          map[res.data._id] = res.data;
        });

        rawTickets.sort((a, b) => {
          const dateA = new Date(map[a.eventId]?.date || 0);
          const dateB = new Date(map[b.eventId]?.date || 0);
          return dateA - dateB;
        });

        if (tickets.length > 0 && rawTickets.length > tickets.length) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }

        setEventsMap(map);
        setTickets(rawTickets);
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

  const groupTicketsByMonth = () => {
    const groups = {};
    tickets.forEach(ticket => {
      const event = eventsMap[ticket.eventId];
      if (!event) return;

      const eventDate = new Date(event.date);
      const monthYear = eventDate.toLocaleString('default', { month: 'long', year: 'numeric' });

      if (!groups[monthYear]) groups[monthYear] = [];
      groups[monthYear].push({ ticket, event });
    });
    return groups;
  };

  const groupedTickets = groupTicketsByMonth();

  return (
    <div className="min-h-screen bg-lightGray pt-24 pb-12">
      <Navbar />
      {showConfetti && <Confetti />}
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary flex items-center gap-2">
            <User size={24} />
            My Tickets
          </h2>
        </div>

        {loading ? (
          <div className="text-center text-darkGray animate-fade-in">
            Loading your tickets...
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-warning bg-warning/10 p-3 rounded-lg animate-fade-in">
            <AlertCircle size={18} />
            <p className="text-sm">{error}</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center text-darkGray animate-fade-in">
            You haven't purchased any tickets yet.
          </div>
        ) : (
          Object.entries(groupedTickets).map(([monthYear, items]) => (
            <div key={monthYear} className="mb-10 animate-fade-in">
              <h3 className="text-xl font-semibold text-primary mb-6">{monthYear}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(({ ticket, event }, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden mb-4">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                          onError={(e) => (e.target.style.display = 'none')}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200"></div>
                      )}
                    </div>

                    <h4 className="text-lg font-semibold text-primary mb-3">{event.title}</h4>
                    
                    <div className="space-y-2 text-darkGray">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span className="text-sm">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-secondary">
                        <Ticket size={16} />
                        <span className="text-sm font-medium">{ticket.type.toUpperCase()} Ticket</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-darkGray">
                        Purchased: {new Date(ticket.purchasedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;
