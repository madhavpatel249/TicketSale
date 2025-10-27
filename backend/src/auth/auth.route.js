const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

/**
 * Validate login input middleware
 * Checks username and password format before processing
 */
const validateLoginInput = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid input type' });
  }

  if (username.length < 3 || username.length > 30) {
    return res.status(400).json({ error: 'Username must be between 3 and 30 characters' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  next();
};

/**
 * Authentication Routes
 */
// Login route
router.post('/login', validateLoginInput, authController.login);

// Logout route
router.post('/logout', authController.logout);

// Verify token route
router.get('/verify', authController.verifyToken);

module.exports = router;