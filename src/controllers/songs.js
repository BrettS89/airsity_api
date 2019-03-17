const Song = require('../models/Song');
const Listened = require('../models/Listened');
const auth = require('../services/authService');

// add a new song //
exports.add = async (req, res) => {
  try {
    const { user, token } = await auth.verifyToken(req);
    const newSong = new Song({
      date: req.body.date,
      isoDate: req.body.isoDate,
      title: req.body.title,
      artist: req.body.artist,
      photo: req.body.photo,
      audio: req.body.audio,
    });

    await newSong.save();
    res.status(200).json({ status: 'success' });
  }

  catch(e) {
    console.log(e);
    res.status(500).json({ error: 'an error occured' });
  }
};

// get unlistened to songs //
exports.get = async (req, res) => {
  const genre = req.params.genre === 'hiphop' ? 'Hip hop' : req.params.genre;
  try {
    const { user, token } = await auth.verifyToken(req);
    let songs = await Song.aggregate([
      {
        '$match': { 'genre': { '$eq': genre } }
      },
      {
        '$lookup': {
          'from': 'listeneds',
          'let': { 'id': "$_id" },
          'pipeline': [
            { '$match':
               { '$expr':
                  { '$and':
                     [
                       { '$eq': [ "$song",  "$$id" ] },
                       { '$eq': [ "$user", user._id ] }
                     ]
                  }
               }
            },
         ],
          'as': "listenedArray",
        },
      },
      {
        '$match': { 'listenedArray': { '$eq': [] } }
      },
    ])
    .sort({ releaseDate: 'desc' })
    .limit(50)
    .exec();

    if (songs.length === 0) {
      songs = [
        {
          _id: 'out',
          date: 123,
          isoDate: '123',
          title: 'Check back soon for more songs',
          artist: '  ',
        },
      ];
    }
    res.status(200).json(songs);
  }

  catch(e) {
    console.log(e);
    res.status(500).json({ error: 'an error occured' });
  }
};

exports.getNonMember = async (req, res) => {
  try {
    const genre = req.params.genre === 'hiphop' ? 'Hip hop' : req.params.genre;
    const songs = await Song.find({ genre })
      .sort({ releaseDate: 'desc' })
      .limit(15)
      .exec();
    res.status(200).json(songs);
  }

  catch(e) {
    console.log(e);
    res.status(500).json({ error: 'an error occured' });
  }
};
