const Event = require('../models/Event');

// Create event
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ event });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// Get all events with filtering
exports.getEvents = async (req, res) => {
  try {
    const { date, venue, search } = req.query;
    const query = {};

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

// Get single event
exports.getEvent = (req, res) => res.json(req.event);

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json({ event });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    await req.event.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
}; 