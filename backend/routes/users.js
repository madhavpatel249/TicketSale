const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const userController = require('../controllers/userController');

// Middleware for user validation
const validateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to validate user' });
  }
};

// Input validation middleware
const validateCartInput = (req, res, next) => {
  const { eventId, ticketType } = req.body;
  if (!eventId || !ticketType) {
    return res.status(400).json({ error: 'Missing cart data' });
  }
  next();
};

// User routes
router.post('/signup', userController.signup);

// Cart routes
router.post('/:userId/cart', validateUser, validateCartInput, userController.addToCart);
router.get('/:userId/cart', validateUser, userController.getCart);

// Purchase routes
router.post('/:userId/purchase', validateUser, userController.purchase);
router.get('/:userId/tickets', validateUser, userController.getTickets);
router.post('/:userId/purchase-single', validateUser, userController.purchaseSingle);

// Cart management routes
router.delete('/:userId/cart-item', validateUser, validateCartInput, userController.removeCartItem);
router.patch('/:userId/cart-item', validateUser, userController.updateCartItem);

module.exports = router;
