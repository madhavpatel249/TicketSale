const express = require('express');
const router = express.Router();

// Profile route to check session
router.get('/', (req, res) => {
  // Check if user is authenticated by checking the session
  if (req.session && req.session.user) {
    // If authenticated, send user data
    res.json({ user: req.session.user });
  } else {
    // If no session or user, send a 401 unauthorized status
    res.status(401).json({ message: 'Not authenticated' });
  }
});

module.exports = router;
