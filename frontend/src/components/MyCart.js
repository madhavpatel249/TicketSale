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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); 

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
      setShowConfirmModal(false);
      await fetchCart();
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Purchase all error:', err);
      alert('Failed to complete purchase.');
    }
  };

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
          <>
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex-1 flex flex-col gap-4">
                {groupedCartItems.map((item, index) => {
                  const event = eventMap[item.eventId];
                  const price = event?.pricing?.[item.type] || 0;
                  return (
                    <div
                      key={index}
                      className="relative flex flex-col sm:flex-row items-center bg-white shadow rounded-xl border border-gray-200 p-4"
                    >
                      <button
                        onClick={() => handleDelete(item)}
                        className="absolute top-2 right-3 text-xl text-gray-400 hover:text-red-500"
                      >
                        ×
                      </button>

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
                          <button className="text-lg px-2" onClick={() => updateCart(item.eventId, item.type, 'decrease')}>–</button>
                          <span className="mx-2 font-semibold">{item.count}</span>
                          <button className="text-lg px-2" onClick={() => updateCart(item.eventId, item.type, 'increase')}>+</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="w-full lg:w-64">
                <h3 className="text-xl font-semibold mb-4">Checkout Summary</h3>
                <div className="space-y-4 text-sm">
                  {Object.entries(eventGroups).map(([eventId, group], i) => (
                    <div key={i}>
                      <p className="font-semibold">{group.eventName}</p>
                      <ul className="ml-4 list-disc text-gray-700">
                        {Object.entries(group.tickets).map(([type, count], j) => (
                          <li key={j}>
                            {count} × {type}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <hr className="my-4" />
                <div className="flex justify-between font-bold text-lg">
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
                  onClick={() => setShowConfirmModal(true)}
                  className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Confirm Purchase</h2>
            <p className="mb-6 text-gray-700">Are you sure you want to complete this purchase?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handlePurchaseAll}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4">Purchase Successful</h2>
            <p className="mb-6 text-gray-700">Your tickets have been purchased!</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyCart;
