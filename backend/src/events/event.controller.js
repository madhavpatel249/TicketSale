const Event = require('./event.model');

/**
 * Create event controller
 * Creates a new event
 */
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ event });
  } catch (error) {
    console.error('Create event error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({ error: 'Failed to create event' });
  }
};

/**
 * Get all events with optional filtering
 * Supports filtering by date, venue, and search query
 */
exports.getEvents = async (req, res) => {
  try {
    const { date, venue, search } = req.query;
    const query = {};

    // Build query filters
    if (date) query.date = { $gte: new Date(date) };
    if (venue) query.venue = { $regex: venue, $options: 'i' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(query)
      .sort({ date: 1 })
      .select('-__v');

    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

/**
 * Get single event by ID
 * Event should be attached to req.event by middleware
 */
exports.getEvent = (req, res) => {
  res.json(req.event);
};

/**
 * Update event controller
 * Updates an existing event
 */
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ event });
  } catch (error) {
    console.error('Update event error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({ error: 'Failed to update event' });
  }
};

/**
 * Delete event controller
 * Deletes an event (should be attached to req.event by middleware)
 */
exports.deleteEvent = async (req, res) => {
  try {
    await req.event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};