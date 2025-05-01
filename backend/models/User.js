const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['host', 'attendee'], default: 'attendee' }, // Add role field
});
const User = mongoose.model('User', userSchema);

module.exports = User;
