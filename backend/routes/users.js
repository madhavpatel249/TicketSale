const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');


router.post('/signup', async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      tickets: [],
      cart: []
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/:userId/cart', async (req, res) => {
  const { eventId, ticketType } = req.body;

  if (!eventId || !ticketType) {
    return res.status(400).json({ error: 'Event ID and ticket type are required' });
  }

  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.cart.push({ eventId, type: ticketType });
    await user.save();

    res.status(200).json({ message: 'Ticket added to cart', cart: user.cart });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});


router.get('/:userId/cart', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ cart: user.cart });
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});


router.post('/:userId/purchase', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const purchased = user.cart.map(item => ({
      eventId: item.eventId || item.event?._id,
      type: item.type,
      purchasedAt: new Date()
    }));

    const invalid = purchased.find(t => !t.eventId || !t.type);
    if (invalid) {
      return res.status(400).json({ error: 'Cart contains invalid ticket data' });
    }

    user.tickets.push(...purchased);
    user.cart = [];
    await user.save();

    res.status(200).json({ message: 'Purchase completed', tickets: user.tickets });
  } catch (err) {
    console.error('Purchase error:', err);
    res.status(500).json({ error: 'Purchase failed' });
  }
});


router.get('/:userId/tickets', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ tickets: user.tickets });
  } catch (err) {
    console.error('Get tickets error:', err);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});


router.post('/:userId/purchase-single', async (req, res) => {
  const { eventId, ticketType, quantity } = req.body;

  if (!eventId || !ticketType || !quantity) {
    return res.status(400).json({ error: 'Missing eventId, ticketType, or quantity' });
  }

  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let removed = 0;
    user.cart = user.cart.filter(item => {
      if (
        removed < quantity &&
        item.eventId.toString() === eventId &&
        item.type === ticketType
      ) {
        removed++;
        return false;
      }
      return true;
    });

    for (let i = 0; i < quantity; i++) {
      user.tickets.push({ eventId, type: ticketType, purchasedAt: new Date() });
    }

    await user.save();
    res.status(200).json({ message: `Purchased ${quantity} tickets.` });
  } catch (err) {
    console.error('Single purchase error:', err);
    res.status(500).json({ error: 'Single ticket purchase failed' });
  }
});

router.delete('/:userId/cart-item', async (req, res) => {
  const { eventId, ticketType } = req.body;

  if (!eventId || !ticketType) {
    return res.status(400).json({ error: 'Missing eventId or ticketType' });
  }

  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.cart = user.cart.filter(
      item => !(item.eventId.toString() === eventId && item.type === ticketType)
    );

    await user.save();
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

router.patch('/:userId/cart-item', async (req, res) => {
  const { eventId, ticketType, action } = req.body;

  if (!eventId || !ticketType || !['increase', 'decrease'].includes(action)) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (action === 'increase') {
      user.cart.push({ eventId, type: ticketType });
    } else if (action === 'decrease') {
      let removed = false;
      user.cart = user.cart.filter(item => {
        if (!removed && item.eventId.toString() === eventId && item.type === ticketType) {
          removed = true;
          return false;
        }
        return true;
      });
    }

    await user.save();
    res.status(200).json({ message: 'Cart updated', cart: user.cart });
  } catch (err) {
    console.error('Cart update error:', err);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

module.exports = router;
