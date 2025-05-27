const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate emails
    index: true,  // Speeds up queries on email
    lowercase: true, // Normalizes email for consistency
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate usernames
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = mongoose.model('User', userSchema);
