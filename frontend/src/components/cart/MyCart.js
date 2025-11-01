import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { CalendarDays, MapPin, Ticket, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import API_BASE_URL from '../../config/apiConfig';
import Navbar from '../common/Navbar';

function MyCart() {
  const { user, token } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [eventMap, setEventMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/${user.id}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Cart API Response:', res.data); // Debug log

        const cartData = res.data.cart || [];
        console.log('Cart Data:', cartData); // Debug log
        
        const eventIds = cartData.map(item => item.eventId);
        
        if (eventIds.length > 0) {
          const eventResponses = await Promise.all(
            eventIds.map(id => axios.get(`${API_BASE_URL}/api/events/${id}`))
          );

          const eventMap = {};
          eventResponses.forEach(response => {
            eventMap[response.data._id] = response.data;
          });

          setEventMap(eventMap);
        }
        
        setCart(cartData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setLoading(false);
      }
    };

    if (user && token) {
      fetchCart();
    }
  }, [user, token]);

  const handleQuantityChange = async (eventId, ticketType, newQuantity) => {
    // Find current count for this item
    const currentCount = cart.filter(item => item.eventId === eventId && item.type === ticketType).length;
    
    // Prevent going below 1 - if trying to decrease from 1, remove item instead
    if (newQuantity < 1) {
      handleRemoveItem(eventId, ticketType);
      return;
    }

    try {
      const res = await axios.patch(
        `${API_BASE_URL}/api/users/${user.id}/cart-item`,
        {
          eventId,
          ticketType: ticketType,
          action: newQuantity > currentCount ? 'increase' : 'decrease'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Use the updated cart from the response
      setCart(res.data.cart);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (eventId, ticketType) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/api/users/${user.id}/cart-item`, {
        data: { eventId, ticketType },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Use the updated cart from the response
      setCart(res.data.cart);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleCheckout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/users/${user.id}/purchase`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCart([]);
      alert('Purchase successful!');
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Failed to complete purchase. Please try again.');
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
  const groupedCartItems = Object.values(groupedCart).sort((a, b) => {
    // Sort by event title alphabetically
    const eventA = eventMap[a.eventId]?.title || 'Unnamed Event';
    const eventB = eventMap[b.eventId]?.title || 'Unnamed Event';
    return eventA.localeCompare(eventB);
  });

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
          `${API_BASE_URL}/api/users/${user.id}/purchase-single`,
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
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary/5 to-lightGray pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-10">
            <h2 className="text-4xl font-bold mb-2 flex items-center gap-3 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              <ShoppingCart size={32} className="text-primary" />
              My Cart
            </h2>
            <p className="text-darkGray">Review your selected tickets</p>
          </div>

          {loading ? (
            <div className="text-center text-darkGray bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="text-lg font-semibold text-primary">Loading cart...</div>
            </div>
          ) : groupedCartItems.length === 0 ? (
            <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-gray-100">
              <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
              <div className="text-xl font-semibold text-primary mb-2">Your cart is empty</div>
              <p className="text-darkGray">Add some events to get started!</p>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Cart Items List */}
              <div className="flex-1 flex flex-col gap-4 max-h-[68vh] overflow-y-auto pr-2 scrollbar-thin">
                {groupedCartItems.map((item, index) => {
                  const event = eventMap[item.eventId];
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row gap-4 items-center relative card-hover"
                    >
                      <button
                        onClick={() => handleRemoveItem(item.eventId, item.type)}
                        className="absolute top-4 right-4 text-darkGray hover:text-warning transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>

                      <div className="w-full sm:w-36 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-md">
                        {event?.image ? (
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover"
                            onError={(e) => (e.target.style.display = 'none')}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <Ticket className="text-gray-400" size={32} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 text-left">
                        <h3 className="text-lg font-bold text-primary mb-2">{event?.title}</h3>
                        <div className="flex flex-wrap items-center text-darkGray gap-4 mb-2">
                          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                            <CalendarDays size={16} className="text-primary" />
                            <span className="text-sm font-medium">{new Date((event?.date || '') + 'T12:00:00').toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                            <MapPin size={16} className="text-primary" />
                            <span className="text-sm font-medium">{event?.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center mt-2 text-secondary font-semibold">
                          <Ticket size={18} className="mr-2" />
                          <span className="text-sm">{item.type.toUpperCase()} Ticket</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
                          <button
                            className="p-2.5 hover:bg-primary/10 text-primary transition-colors"
                            onClick={() => handleQuantityChange(item.eventId, item.type, item.count - 1)}
                          >
                            <Minus size={18} />
                          </button>
                          <span className="px-5 py-2.5 font-bold text-primary bg-gray-50">{item.count}</span>
                          <button
                            className="p-2.5 hover:bg-primary/10 text-primary transition-colors"
                            onClick={() => handleQuantityChange(item.eventId, item.type, item.count + 1)}
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Checkout Summary */}
              <div className="w-full lg:w-80 bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-20 self-start">
                <h3 className="text-xl font-bold text-primary mb-6">Checkout Summary</h3>
                <div className="space-y-4 text-darkGray mb-6">
                  {Object.entries(eventGroups).map(([eventId, group], i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-xl">
                      <p className="font-medium text-primary mb-2">{group.eventName}</p>
                      <ul className="ml-2 space-y-1">
                        {Object.entries(group.tickets).map(([type, count], j) => (
                          <li key={j} className="text-sm font-medium">
                            {count} × {type.toUpperCase()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <hr className="my-6 border-gray-200" />
                <div className="flex justify-between items-center mb-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
                  <span className="font-bold text-lg text-primary">{groupedCartItems.reduce((acc, item) => acc + item.count, 0)} tickets</span>
                  <span className="font-bold text-xl text-primary">
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
                  className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all duration-150 font-bold shadow-md hover:scale-[1.02]"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MyCart;
