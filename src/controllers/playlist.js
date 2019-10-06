const Playlist = require('../models/Playlist');
const Listened = require('../models/Listened');
const Song = require('../models/Song');
const auth = require('../services/authService');
const mixpanel = require('../services/mixpanel');

// add a song to your playlist //
exports.add = async (req, res) => {
  try {
    if(req.body.song === 'out') {
      return res.status(200).json({ status: 'out of songs' });
    }
    const { user, token } = await auth.verifyToken(req);
    const { date, isoDate, song, genre } = req.body;
    const playlistTrack = new Playlist({ date, isoDate, song, genre, user: user._id });
    const listened = new Listened({ date, isoDate, song, genre, user: user._id });
    await listened.save();
    let playlistRecord = await playlistTrack.save();
    const fullRecord = await Playlist.populate(playlistRecord, { path: 'song' });
    res.status(200).json(fullRecord);
    const s = await Song.findById(song);
    s.playlistAdds = s.playlistAdds ? s.playlistAdds + 1 : 1;
    await s.save();
    mixpanel.trackListen('listen', req.body.genre, user._id, 'add');
  }

  catch(e) {
    console.log(e);
    res.status(500).json({ error: 'an error occured' });
  }
};

// get your playlist //
exports.get = async (req, res) => {
  try {
    const { user, token } = await auth.verifyToken(req);
    const genre = req.params.genre;
    let playlist;
    if (req.params.genre === 'all') {
      playlist = await Playlist.find({ user: user._id, date: { $lt: req.params.date } })
        .sort({ date: 'desc' })
        .populate('song', ['_id', 'title', 'artist', 'album', 'photo', 'genre', 'audio', 'year', 'openInSpotify'])
        .limit(30)
        .lean()
        .exec();
    } else {
      playlist = await Playlist.find({ user: user._id, genre, date: { $lt: req.params.date } })
        .sort({ date: 'desc' })
        .populate('song', ['_id', 'title', 'artist', 'album', 'photo', 'genre', 'audio', 'year', 'openInSpotify'])
        .limit(30)
        .lean()
        .exec();
    }

    res.status(200).json(playlist);
  }

  catch(e) {
    console.log('get playlist error:', e);
    res.status(500).json({ error: 'an error occured' });
  }
};

exports.play = async (req, res) => {
  try {
    const { user, token } = await auth.verifyToken(req);
    mixpanel.trackPlaylistPlay('playlistPlay', req.params.genre, user._id);
    res.status(200).json({ status: 'success' });
  } 
  
  catch(e) {
    console.log('trackPlay error: ', e);
    res.status(500).json({ error: 'an error occured' });
    mixpanel.trackPlaylistPlay('playlistPlay', req.params.genre, user._id);
  }
};

exports.play2 = async (req, res) => {
  try {
    const { user, token } = await auth.verifyToken(req);
    const playlist = await Playlist.findById(req.body.id);
    playlist.plays += 1;
    await playlist.save();
    mixpanel.trackPlaylistPlay('playlistPlay', req.body.genre, user._id);
    res.status(200).json({ message: 'success' });
  } catch(e) {
    console.log('trackPlay error: ', e);
    res.status(500).json({ error: 'an error occured' });
  }
};

exports.fullPlay = async (req, res) => {
  try {
    const { user, token } = await auth.verifyToken(req);
    const playlist = await Playlist.findById(req.body.id);
    playlist.fullPlays += 1;
    await playlist.save();
    mixpanel.trackPlaylistPlay('fullSong', req.body.genre, user._id);
    res.status(200).json({ message: 'success' });
  } catch(e) {
    console.log('fullTrack error: ', e);
    res.status(500).json({ error: 'an error occured' });
  }
};
