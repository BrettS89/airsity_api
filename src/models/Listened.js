const mongoose = require('mongoose');

const listenedSchema = new mongoose.Schema({
  date: { type: Number, required: true },
  isoDate: { type: String, required: true },
  song: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', },
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    type: String, required: true,
  },
});

module.exports = mongoose.model('Listened', listenedSchema);
