const bcrypt = require('bcryptjs');
const User = require('../models/User');

// User signup
exports.signup = async (req, res) => {
  const { username, email, password, role } = req.body;

  // Input validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (username.length < 3 || username.length > 30) {
    return res.status(400).json({ error: 'Username must be between 3 and 30 characters' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Validate role
  if (role && !['host', 'attendee'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role. Must be either "host" or "attendee"' });
  }

  try {
    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ 
        error: existingUser.username === username ? 'Username taken' : 'Email taken' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'attendee',
      tickets: [],
      cart: []
    });

    // Remove password from response
    const userResponse = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    };

    res.status(201).json({ 
      message: 'User created successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Signup error:', error);
    // Check for specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Cart management
exports.addToCart = async (req, res) => {
  try {
    const { eventId, ticketType } = req.body;
    req.user.cart.push({ eventId, type: ticketType });
    await req.user.save();
    res.json({ cart: req.user.cart });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

exports.getCart = (req, res) => res.json({ cart: req.user.cart });

// Purchase management
exports.purchase = async (req, res) => {
  try {
    const purchased = req.user.cart.map(item => ({
      eventId: item.eventId,
      type: item.type,
      purchasedAt: new Date()
    }));

    if (purchased.some(ticket => !ticket.eventId || !ticket.type)) {
      return res.status(400).json({ error: 'Invalid cart data' });
    }

    req.user.tickets.push(...purchased);
    req.user.cart = [];
    await req.user.save();

    res.json({ tickets: req.user.tickets });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ error: 'Purchase failed' });
  }
};

exports.getTickets = (req, res) => res.json({ tickets: req.user.tickets });

exports.purchaseSingle = async (req, res) => {
  const { eventId, ticketType, quantity } = req.body;

  if (!eventId || !ticketType || !quantity || quantity < 1) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const cartItems = req.user.cart.filter(
      item => item.eventId.toString() === eventId && item.type === ticketType
    );

    if (cartItems.length < quantity) {
      return res.status(400).json({ error: 'Not enough items' });
    }

    req.user.cart = req.user.cart.filter(
      item => !(item.eventId.toString() === eventId && item.type === ticketType)
    );

    const newTickets = Array(quantity).fill().map(() => ({
      eventId,
      type: ticketType,
      purchasedAt: new Date()
    }));
    req.user.tickets.push(...newTickets);

    await req.user.save();
    res.json({ message: `Purchased ${quantity} tickets` });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ error: 'Purchase failed' });
  }
};

// Cart item management
exports.removeCartItem = async (req, res) => {
  try {
    const { eventId, ticketType } = req.body;
    req.user.cart = req.user.cart.filter(
      item => !(item.eventId.toString() === eventId && item.type === ticketType)
    );
    await req.user.save();
    res.json({ message: 'Item removed' });
  } catch (error) {
    console.error('Remove error:', error);
    res.status(500).json({ error: 'Failed to remove item' });
  }
};

exports.updateCartItem = async (req, res) => {
  const { eventId, ticketType, action } = req.body;

  if (!eventId || !ticketType || !['increase', 'decrease'].includes(action)) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    if (action === 'increase') {
      req.user.cart.push({ eventId, type: ticketType });
    } else {
      const index = req.user.cart.findIndex(
        item => item.eventId.toString() === eventId && item.type === ticketType
      );
      if (index !== -1) {
        req.user.cart.splice(index, 1);
      }
    }

    await req.user.save();
    res.json({ cart: req.user.cart });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
}; 