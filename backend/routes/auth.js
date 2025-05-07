const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; 


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      
      const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
        expiresIn: '1h', 
      });

      
      return res.status(200).json({ 
        message: "Login successful!", 
        token, 
        user: { id: user._id, username: user.username } 
      });
    } else {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.log("Error during login:", error);
    return res.status(500).send("Error logging in");
  }
});

module.exports = router;
