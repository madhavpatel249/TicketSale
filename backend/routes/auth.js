const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Input validation middleware
const validateLoginInput = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  if (username.length < 3 || username.length > 30) {
    return res.status(400).json({ error: 'Invalid username length' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password too short' });
  }

  next();
};

// Auth routes
router.post('/login', validateLoginInput, authController.login);
router.post('/logout', authController.logout);
router.get('/verify', authController.verifyToken);

module.exports = router;
