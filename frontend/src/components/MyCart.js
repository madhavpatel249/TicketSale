import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { AuthContext } from '../components/AuthContext';
import { CartContext } from '../components/CartContext';

function MyCart() {
  const { clearCart } = useContext(CartContext);
  const { user, token } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [eventMap, setEventMap] = useState({});
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchCart();
  }, [user, token]);

  const updateCart = async (eventId, ticketType, action) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/users/${user.id}/cart-item`,
        { eventId, ticketType, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
    } catch (err) {
      console.error('Update cart error:', err);
      alert('Failed to update cart.');
    }
  };

  const handleDelete = async (item) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${user.id}/cart-item`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          eventId: item.eventId,
          ticketType: item.type,
        },
      });
      await fetchCart();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to remove item.');
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

  return (
    <div className="min-h-screen bg-gray-100 pt-24">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-[#0E131F] mb-6">My Cart</h2>
        {loading ? (
          <p className="text-gray-600">Loading cart...</p>
        ) : groupedCartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {groupedCartItems.map((item, index) => {
              const event = eventMap[item.eventId];
              return (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center bg-white shadow rounded-xl border border-gray-200 p-4 w-full"
                >
                  
                  <div className="w-full sm:w-48 h-32 bg-gray-200 rounded overflow-hidden mr-6">
                    {event?.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.style.display = 'none')}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300"></div>
                    )}
                  </div>

                  
                  <div className="flex-1 space-y-1 text-left mt-3 sm:mt-0">
                    <h3 className="text-xl font-semibold text-[#38405F]">{event?.title}</h3>
                    <p className="text-sm text-gray-600">Date: {new Date(event?.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">Location: {event?.location}</p>
                    <p className="text-sm text-gray-700">
                      Ticket Type: <strong>{item.type}</strong>
                    </p>
                  </div>

                  
                  <div className="flex flex-col items-center gap-2 mt-4 sm:mt-0">
                    <div className="flex items-center border border-yellow-400 rounded-full px-3 py-1">
                      <button
                        className="text-lg px-2"
                        onClick={() => updateCart(item.eventId, item.type, 'decrease')}
                      >
                        –
                      </button>
                      <span className="mx-2 font-semibold">{item.count}</span>
                      <button
                        className="text-lg px-2"
                        onClick={() => updateCart(item.eventId, item.type, 'increase')}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleDelete(item)}
                      className="text-sm text-blue-600 underline hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCart;
