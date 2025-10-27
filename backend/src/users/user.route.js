const express = require('express');
const router = express.Router();
const User = require('./user.model');
const userController = require('./user.controller');
const mongoose = require('mongoose');

/**
 * Validate user ID middleware
 * Checks if the user exists and attaches it to req.user
 */
const validateUser = async (req, res, next) => {
  try {
    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('User validation error:', error);
    res.status(500).json({ error: 'Failed to validate user' });
  }
};

/**
 * Validate cart input middleware
 * Checks required fields for cart operations
 */
const validateCartInput = (req, res, next) => {
  const { eventId, ticketType } = req.body;
  
  if (!eventId || !ticketType) {
    return res.status(400).json({ error: 'Missing required fields: eventId, ticketType' });
  }

  // Validate ticketType enum
  if (!['general', 'vip'].includes(ticketType)) {
    return res.status(400).json({ error: 'Invalid ticket type. Must be "general" or "vip"' });
  }

  // Validate eventId format
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ error: 'Invalid event ID format' });
  }

  next();
};

/**
 * User Routes
 */
// Signup route
router.post('/signup', userController.signup);

/**
 * Cart Routes
 * All cart routes require user validation
 */
// Add item to cart
router.post('/:userId/cart', validateUser, validateCartInput, userController.addToCart);

// Get user's cart
router.get('/:userId/cart', validateUser, userController.getCart);

// Remove item from cart
router.delete('/:userId/cart-item', validateUser, validateCartInput, userController.removeCartItem);

// Update cart item quantity
router.patch('/:userId/cart-item', validateUser, userController.updateCartItem);

/**
 * Purchase Routes
 */
// Purchase all items in cart
router.post('/:userId/purchase', validateUser, userController.purchase);

// Get user's purchased tickets
router.get('/:userId/tickets', validateUser, userController.getTickets);

// Purchase a single ticket with quantity
router.post('/:userId/purchase-single', validateUser, userController.purchaseSingle);

module.exports = router;