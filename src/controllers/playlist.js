const Playlist = require('../models/Playlist');
const Listened = require('../models/Listened');
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
    await playlistTrack.save();
    res.status(200).json({ status: 'success' });
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
        .populate('song', ['_id', 'title', 'artist', 'album', 'photo', 'genre', 'audio', 'year'])
        .limit(30)
        .lean()
        .exec();
    } else {
      playlist = await Playlist.find({ user: user._id, genre, date: { $lt: req.params.date } })
        .sort({ date: 'desc' })
        .populate('song', ['_id', 'title', 'artist', 'album', 'photo', 'genre', 'audio', 'year'])
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
