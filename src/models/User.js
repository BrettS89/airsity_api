const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  date: { type: Number, required: true },
  firstName: { type: String },
  isoDate: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);
