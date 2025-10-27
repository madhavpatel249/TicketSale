const bcrypt = require('bcryptjs');
const User = require('./user.model');

/**
 * User signup controller
 * Creates a new user with validation
 */
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

/**
 * Add item to cart
 */
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

/**
 * Get user's cart
 */
exports.getCart = (req, res) => res.json({ cart: req.user.cart });

/**
 * Purchase all items in cart
 */
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

/**
 * Get user's tickets
 */
exports.getTickets = (req, res) => res.json({ tickets: req.user.tickets });

/**
 * Purchase a single ticket type with quantity
 */
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
      return res.status(400).json({ error: 'Not enough items in cart' });
    }

    // Remove purchased items from cart
    req.user.cart = req.user.cart.filter(
      item => !(item.eventId.toString() === eventId && item.type === ticketType)
    );

    // Add new tickets
    const newTickets = Array(quantity).fill().map(() => ({
      eventId,
      type: ticketType,
      purchasedAt: new Date()
    }));
    req.user.tickets.push(...newTickets);

    await req.user.save();
    res.json({ message: `Purchased ${quantity} tickets successfully` });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ error: 'Purchase failed' });
  }
};

/**
 * Remove item from cart
 */
exports.removeCartItem = async (req, res) => {
  try {
    const { eventId, ticketType } = req.body;
    req.user.cart = req.user.cart.filter(
      item => !(item.eventId.toString() === eventId && item.type === ticketType)
    );
    await req.user.save();
    res.json({ message: 'Item removed from cart', cart: req.user.cart });
  } catch (error) {
    console.error('Remove error:', error);
    res.status(500).json({ error: 'Failed to remove item' });
  }
};

/**
 * Update cart item quantity (increase/decrease)
 */
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
      } else {
        return res.status(404).json({ error: 'Item not found in cart' });
      }
    }

    await req.user.save();
    res.json({ cart: req.user.cart });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
};