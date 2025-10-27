const express = require('express');
const router = express.Router();
const Event = require('./event.model');
const eventController = require('./event.controller');
const uploadMiddleware = require('../../utils/upload');
const mongoose = require('mongoose');

/**
 * Validate event ID middleware
 * Checks if the event exists and attaches it to req.event
 */
const validateEvent = async (req, res, next) => {
  try {
    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid event ID format' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    req.event = event;
    next();
  } catch (error) {
    console.error('Event validation error:', error);
    res.status(500).json({ error: 'Failed to validate event' });
  }
};

/**
 * Validate event input middleware
 * Checks required fields for event creation/update
 */
const validateEventInput = (req, res, next) => {
  const { title, date, location, category, generalPrice, vipPrice } = req.body;
  
  if (!title || !date || !location || !category) {
    return res.status(400).json({ error: 'Missing required fields: title, date, location, category' });
  }

  if (!generalPrice || !vipPrice) {
    return res.status(400).json({ error: 'Missing required fields: generalPrice, vipPrice' });
  }

  if (typeof generalPrice !== 'number' || typeof vipPrice !== 'number') {
    return res.status(400).json({ error: 'Prices must be valid numbers' });
  }

  if (generalPrice < 0 || vipPrice < 0) {
    return res.status(400).json({ error: 'Prices cannot be negative' });
  }

  next();
};

/**
 * Event Routes
 */
// Upload image route
router.post('/upload-image', uploadMiddleware, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imageUrl = `${process.env.API_URL || ''}/uploads/${req.file.filename}`;
    return res.json({ 
      message: 'Image uploaded successfully',
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Create event route
router.post('/', validateEventInput, async (req, res) => {
  try {
    const { title, date, location, category, image, generalPrice, vipPrice } = req.body;

    // Validate required fields
    if (!image) {
      return res.status(400).json({ error: 'Event image is required' });
    }

    // Create new event
    const event = await Event.create({
      title,
      date,
      location,
      category,
      image,
      generalPrice: Number(generalPrice),
      vipPrice: Number(vipPrice)
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Get all events
router.get('/', eventController.getEvents);

// Get single event by ID
router.get('/:id', validateEvent, eventController.getEvent);

// Update event route
router.put('/:id', validateEvent, validateEventInput, eventController.updateEvent);

// Delete event route
router.delete('/:id', validateEvent, eventController.deleteEvent);

module.exports = router;