const Song = require('../models/Song');
const auth = require('../services/authService');
const mixpanel = require('../services/mixpanel');

exports.getTop25 = async (req, res) => {
  try {
    await auth.verifyToken(req);
    const songs = await Song.find()
      .sort({ playlistAdds: 'desc' })
      .limit(25)
      .lean()
      .exec()
    res.status(200).json({ data: songs });
  } catch(e) {
    console.log(e);
    res.status(500).json({ error: 'an error occured' });
  }
};
