const Playlist = require('../models/Playlist');
const Listened = require('../models/Listened');
const auth = require('../services/authService');

// add a song to your playlist //
exports.add = async (req, res) => {
  try {
    if(req.body.song === 'out') {
      return res.status(200).json({ status: 'out of songs' });
    }
    const { user, token } = await auth.verifyToken(req);
    const playlistTrack = new Playlist({
      date: req.body.date,
      isoDate: 'iso',
      song: req.body.song,
      genre: req.body.genre,
      user: user._id,
    });

    const listened = new Listened({
      date: req.body.date,
      isoDate: 'test',
      song: req.body.song,
      genre: req.body.genre,
      user: user._id,
    });

    await listened.save();
    await playlistTrack.save();
    res.status(200).json({ status: 'success' });
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
    const genre = req.params.genre === 'hiphop' ? 'Hip hop' : req.params.genre;
    let playlist;
    if (req.params.genre === 'all') {
      playlist = await Playlist.find({ user: user._id })
        .sort({ date: 'desc' })
        .populate('song', ['_id', 'title', 'artist', 'album', 'photo', 'genre', 'audio', 'year'])
        .lean()
        .exec();
    } else {
      playlist = await Playlist.find({ user: user._id, genre })
        .sort({ date: 'desc' })
        .populate('song', ['_id', 'title', 'artist', 'album', 'photo', 'genre', 'audio', 'year'])
        .limit(50)
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
