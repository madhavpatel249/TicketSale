import { useState, useEffect } from 'react';
import axios from 'axios';

const useCart = (userId) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/users/${userId}/cart`);
      setCart(response.data.cart);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (eventId, ticketType) => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/users/${userId}/cart`, {
        eventId,
        ticketType
      });
      setCart(response.data.cart);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add to cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (eventId, ticketType) => {
    try {
      setLoading(true);
      await axios.delete(`/api/users/${userId}/cart-item`, {
        data: { eventId, ticketType }
      });
      await fetchCart();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove from cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (eventId, ticketType, action) => {
    try {
      setLoading(true);
      const response = await axios.patch(`/api/users/${userId}/cart-item`, {
        eventId,
        ticketType,
        action
      });
      setCart(response.data.cart);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const purchaseCart = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/users/${userId}/purchase`);
      setCart([]);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to purchase tickets');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const purchaseSingle = async (eventId, ticketType, quantity) => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/users/${userId}/purchase-single`, {
        eventId,
        ticketType,
        quantity
      });
      await fetchCart();
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to purchase ticket');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateCartItem,
    purchaseCart,
    purchaseSingle,
    refreshCart: fetchCart
  };
};

export default useCart; 