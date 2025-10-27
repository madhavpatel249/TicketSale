// Auth components
export { default as Login } from './auth/Login';
export { default as Register } from './auth/Register';
export { default as Signup } from './auth/Signup';
export { default as Profile } from './auth/Profile';

// Event components
export { default as HomePage } from './events/HomePage';
export { default as HostEvent } from './events/HostEvent';
export { default as BrowseEvents } from './events/BrowseEvents';
export { default as EventGallery } from './events/EventGallery';
export { default as SingleEvent } from './events/SingleEvent';

// Cart components
export { default as MyCart } from './cart/MyCart';

// Common components
export { default as Navbar } from './common/Navbar';

// Context providers
export { AuthContext, AuthProvider } from '../context/AuthContext';
export { CartContext, CartProvider, useCart } from '../context/CartContext';
