const mongoose = require('mongoose');

/**
 * Event Schema
 * Represents an event that can be hosted and tickets purchased for
 */
const eventSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: 100
  },
  date: { 
    type: String, 
    required: [true, 'Event date is required']
  },
  location: { 
    type: String, 
    required: [true, 'Event location is required'],
    trim: true
  },
  image: { 
    type: String, 
    required: [true, 'Event image is required']
  },
  category: { 
    type: String, 
    required: [true, 'Event category is required'],
    enum: {
      values: ['music', 'sports', 'theater', 'comedy', 'food', 'other'],
      message: 'Invalid event category'
    },
    lowercase: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  // Ticket inventory
  generalTickets: { 
    type: Number, 
    default: 100,
    min: 0
  },
  vipTickets: { 
    type: Number, 
    default: 20,
    min: 0
  },
  // Ticket pricing
  generalPrice: { 
    type: Number, 
    required: [true, 'General price is required'],
    min: 0
  },
  vipPrice: { 
    type: Number, 
    required: [true, 'VIP price is required'],
    min: 0
  },
  // Event host
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Indexes for better query performance
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ location: 1 });
eventSchema.index({ createdAt: -1 }); // For sorting recent events

module.exports = mongoose.model('Event', eventSchema);