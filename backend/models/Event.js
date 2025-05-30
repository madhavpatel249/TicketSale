const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  generalTickets: { type: Number, default: 100 },
  vipTickets: { type: Number, default: 20 },
  generalPrice: { type: Number, required: true },
  vipPrice: { type: Number, required: true }
});

module.exports = mongoose.model('Event', eventSchema);
