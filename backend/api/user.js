const express = require('express');
const router = express.Router();
const User = require('../model/User');

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { email, username, password, name } = req.body;
    const user = new User({ email, username, password, name });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
