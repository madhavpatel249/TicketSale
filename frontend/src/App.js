import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import './App.css'; 
import HomePage from './components/HomePage';
import Register from './components/Register'; 
import Signup from './components/Signup'; 
import Login from './components/Login'; 
import Navbar from './components/Navbar'; 
import HostEvent from './components/HostEvent';
import BrowseEvents from './components/BrowseEvents';

function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/host-event" element={<HostEvent />} />
        <Route path="/browse-events" element={<BrowseEvents />} />

      </Routes>
    </Router>
  );
}

export default App;
