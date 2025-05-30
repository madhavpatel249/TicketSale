import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../components/AuthContext';
import { CalendarDays, MapPin, Ticket, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';

function MyCart() {
  const { user, token } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [eventMap, setEventMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user || !token) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${user.id}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cartItems = res.data.cart;
        setCart(cartItems);

        const eventIds = [...new Set(cartItems.map(item => item.eventId))];
        const responses = await Promise.all(
          eventIds.map(id => axios.get(`http://localhost:5000/api/events/${id}`))
        );

        const map = {};
        responses.forEach(res => {
          map[res.data._id] = res.data;
        });

        setEventMap(map);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch cart:', err);
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, token]);

  const updateCart = async (eventId, ticketType, action) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/users/${user.id}/cart-item`,
        { eventId, ticketType, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.reload();
    } catch (err) {
      console.error('Update cart error:', err);
    }
  };

  const handleDelete = async (item) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${user.id}/cart-item`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { eventId: item.eventId, ticketType: item.type },
      });
      window.location.reload();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const groupedCart = {};
  cart.forEach((item) => {
    const key = `${item.eventId}-${item.type}`;
    if (!groupedCart[key]) {
      groupedCart[key] = { ...item, count: 1 };
    } else {
      groupedCart[key].count += 1;
    }
  });
  const groupedCartItems = Object.values(groupedCart);

  const eventGroups = {};
  groupedCartItems.forEach((item) => {
    if (!eventGroups[item.eventId]) {
      eventGroups[item.eventId] = {
        eventName: eventMap[item.eventId]?.title || 'Unnamed Event',
        tickets: {},
      };
    }
    if (!eventGroups[item.eventId].tickets[item.type]) {
      eventGroups[item.eventId].tickets[item.type] = 0;
    }
    eventGroups[item.eventId].tickets[item.type] += item.count;
  });

  const handlePurchaseAll = async () => {
    try {
      for (const item of groupedCartItems) {
        await axios.post(
          `http://localhost:5000/api/users/${user.id}/purchase`,
          {
            eventId: item.eventId,
            ticketType: item.type,
            quantity: item.count,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      window.location.reload();
    } catch (err) {
      console.error('Purchase all error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-lightGray pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary flex items-center gap-2">
            <ShoppingCart size={24} />
            My Cart
          </h2>
        </div>

        {loading ? (
          <div className="text-center text-darkGray animate-fade-in">
            Loading cart...
          </div>
        ) : groupedCartItems.length === 0 ? (
          <div className="text-center text-darkGray animate-fade-in">
            Your cart is empty.
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 animate-fade-in">
            {/* Cart Items List */}
            <div className="flex-1 flex flex-col gap-4 max-h-[68vh] overflow-y-auto pr-2 scrollbar-hide">
              {groupedCartItems.map((item, index) => {
                const event = eventMap[item.eventId];
                return (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row gap-4 items-center"
                  >
                    <button
                      onClick={() => handleDelete(item)}
                      className="absolute top-4 right-4 text-darkGray hover:text-warning transition-colors duration-200"
                    >
                      <Trash2 size={18} />
                    </button>

                    <div className="w-full sm:w-36 h-24 bg-gray-100 rounded-lg overflow-hidden">
                      {event?.image ? (
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

                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-semibold text-primary">{event?.title}</h3>
                      <div className="flex items-center text-darkGray mt-2 gap-4">
                        <div className="flex items-center gap-1">
                          <CalendarDays size={16} />
                          <span className="text-sm">{new Date(event?.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span className="text-sm">{event?.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center mt-2 text-secondary">
                        <Ticket size={16} className="mr-1" />
                        <span className="text-sm font-medium">{item.type.toUpperCase()} Ticket</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          className="p-2 hover:bg-primary/10 text-primary transition-colors"
                          onClick={() => updateCart(item.eventId, item.type, 'decrease')}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-2 font-medium text-primary">{item.count}</span>
                        <button
                          className="p-2 hover:bg-primary/10 text-primary transition-colors"
                          onClick={() => updateCart(item.eventId, item.type, 'increase')}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Checkout Summary */}
            <div className="w-full lg:w-80 bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-20 self-start">
              <h3 className="text-lg font-semibold text-primary mb-4">Checkout Summary</h3>
              <div className="space-y-4 text-darkGray">
                {Object.entries(eventGroups).map(([eventId, group], i) => (
                  <div key={i}>
                    <p className="font-medium text-primary">{group.eventName}</p>
                    <ul className="ml-4 mt-1 space-y-1">
                      {Object.entries(group.tickets).map(([type, count], j) => (
                        <li key={j} className="text-sm">
                          {count} × {type}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <hr className="my-6 border-gray-100" />
              <div className="flex justify-between font-semibold text-primary">
                <span>{groupedCartItems.reduce((acc, item) => acc + item.count, 0)} tickets</span>
                <span>
                  $
                  {groupedCartItems
                    .reduce((acc, item) => {
                      const price = eventMap[item.eventId]?.pricing?.[item.type] || 0;
                      return acc + item.count * price;
                    }, 0)
                    .toFixed(2)}
                </span>
              </div>
              <button
                onClick={handlePurchaseAll}
                className="mt-6 w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 active:bg-primary/80 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCart;
