const express = require('express');
const router = express.Router();
const { upload, processImage } = require('../middleware/upload');
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

// Upload image route
router.post('/upload-image', upload, processImage, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Convert the processed image buffer to base64
    const base64Image = `data:image/webp;base64,${req.file.processedBuffer.toString('base64')}`;
    
    res.json({ 
      imageUrl: base64Image,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Create event route
router.post('/', async (req, res) => {
  try {
    const { title, date, location, category, image, generalPrice, vipPrice } = req.body;

    // Validate required fields
    if (!title || !date || !location || !category || !image) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new event
    const event = await Event.create({
      title,
      date,
      location,
      category,
      image,
      generalPrice: Number(generalPrice) || 0,
      vipPrice: Number(vipPrice) || 0
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Event routes
router.put('/:id', validateEvent, validateEventInput, eventController.updateEvent);
router.delete('/:id', validateEvent, eventController.deleteEvent);

module.exports = router;
