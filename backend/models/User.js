const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  type: { type: String, enum: ['general', 'vip'], required: true },
  purchasedAt: { type: Date, default: Date.now }
});

const cartItemSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  type: { type: String, enum: ['general', 'vip'], required: true }
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['host', 'attendee'], default: 'attendee' },
  cart: [cartItemSchema],
  tickets: [ticketSchema]
});

module.exports = mongoose.model('User', userSchema);
