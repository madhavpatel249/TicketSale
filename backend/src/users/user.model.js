const mongoose = require('mongoose');

/**
 * Ticket Schema
 * Represents a purchased ticket for an event
 */
const ticketSchema = new mongoose.Schema({
  eventId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['general', 'vip'], 
    required: true 
  },
  purchasedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { _id: true });

/**
 * Cart Item Schema
 * Represents an item in the user's shopping cart
 */
const cartItemSchema = new mongoose.Schema({
  eventId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['general', 'vip'], 
    required: true 
  }
}, { _id: true });

/**
 * User Schema
 * Represents a user in the system (host or attendee)
 */
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: 6,
    select: false // Don't include password in queries by default
  },
  role: { 
    type: String, 
    enum: ['host', 'attendee'], 
    default: 'attendee' 
  },
  // Login security fields (for rate limiting)
  loginAttempts: { 
    type: Number, 
    default: 0 
  },
  lockUntil: { 
    type: Date 
  },
  // User shopping cart
  cart: [cartItemSchema],
  // User purchased tickets
  tickets: [ticketSchema],
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Indexes for better query performance
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);