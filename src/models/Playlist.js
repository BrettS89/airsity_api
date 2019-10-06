const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  date: { type: Number, required: true },
  isoDate: { type: String, required: true },
  song: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', },
  genre: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    type: String, required: true,
  },
  plays: { type: Number, default: 0 },
  fullPlays: { type: Number, default: 0 },
});

module.exports = mongoose.model('Playlist', playlistSchema);
