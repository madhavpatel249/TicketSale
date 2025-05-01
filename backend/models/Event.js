const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  date: String,
  location: String,
  image: String,
  category: String, // concert, sports, theater
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
