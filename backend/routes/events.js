const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const eventController = require('../controllers/eventController');

// Middleware for event validation
const validateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    req.event = event;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to validate event' });
  }
};

// Input validation middleware
const validateEventInput = (req, res, next) => {
  const { name, date, venue, description, ticketTypes } = req.body;
  
  if (!name || !date || !venue || !description || !ticketTypes) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!Array.isArray(ticketTypes) || ticketTypes.length === 0) {
    return res.status(400).json({ error: 'Invalid ticket types' });
  }

  const invalidTicketType = ticketTypes.find(type => 
    !type.name || !type.price || !type.quantity || type.quantity < 0
  );

  if (invalidTicketType) {
    return res.status(400).json({ error: 'Invalid ticket type data' });
  }

  next();
};

// Event routes
router.post('/', validateEventInput, eventController.createEvent);
router.get('/', eventController.getEvents);
router.get('/:id', validateEvent, eventController.getEvent);
router.put('/:id', validateEvent, validateEventInput, eventController.updateEvent);
router.delete('/:id', validateEvent, eventController.deleteEvent);

module.exports = router;
