const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  role: String
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
