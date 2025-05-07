import { createContext, useState, useContext } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (event, type) => {
    setCart(prev => [...prev, { eventId: event._id, title: event.title, type }]);
  };

  const removeFromCart = (eventId) => {
    setCart(prev => prev.filter(item => item.eventId !== eventId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
