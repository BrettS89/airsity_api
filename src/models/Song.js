const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  date: { type: Number, required: true },
  isoDate: { type: String, required: true },
  title: { type: String, required: true },
  artist: { type: String },
  album: { type: String },
  photo: { type: String },
  thumbnail: { type: String },
  audio: { type: String, required: true },
  genre: { type: String, required: true },
  popularity: { type: Number },
  releaseDate: { type: String },
  year: { type: Number },
  spotifyId: { type: String },
  openInSpotify: { type: String },
  playlistAdds: { type: Number },
});

module.exports = mongoose.model('Song', songSchema);
