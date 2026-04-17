const express = require('express');
const router = express.Router();
const Message = require('../models/MessageModel');

// POST /api/messages
router.post('/', async (req, res) => {
  try {
    const { name, email, message, role } = req.body;
    console.log("📩 Feedback received:", req.body);
    const newMessage = new Message({ name, message, email, role });
    await newMessage.save();
    res.status(201).json({ message: 'Message saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
