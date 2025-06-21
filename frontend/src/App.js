import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import {
  HomePage,
  Register,
  Signup,
  Login,
  Navbar,
  HostEvent,
  BrowseEvents,
  SingleEvent,
  MyCart,
  Profile
} from './components';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/host-event" element={<HostEvent />} />
        <Route path="/browse-events" element={<BrowseEvents />} />
        <Route path="/events/:id" element={<SingleEvent />} />
        <Route path="/my-cart" element={<MyCart />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
