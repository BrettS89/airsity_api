const Listened = require('../models/Listened');
const Song = require('../models/Song');
const auth = require('../services/authService');
const mixpanel = require('../services/mixpanel');

// create a listened record for a song //
exports.add = async (req, res) => {
  try {
    if(req.body.song === 'out') {
      return res.status(200).json({ status: 'out of songs' });
    }
    const { user, token } = await auth.verifyToken(req);
    const listened = new Listened({
      date: Date.now(),
      isoDate: 'test',
      song: req.body.song,
      user: user._id,
    });

    await listened.save();
    res.status(200).json({ status: 'success' });
    
    const song = await Song.findById(req.body.song);
    mixpanel.trackListen('listen', song.genre, user._id, 'dismiss');
  }

  catch(e) {
    console.log(e);
    res.status(500).json({ error: 'an error occured' });
  }
};
