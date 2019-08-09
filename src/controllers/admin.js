const Song = require('../models/Song');
const spotifyService = require('../utils/spotify');
const awsService = require('../services/aws');

exports.addSongs = async (req, res) => {
  try {
    let songsAdded = 0;
    let offset = 0;
    let size = 1
    
    for (let i = 0; i <= size; i++) {
      const access_token = await spotifyService.getAccessToken();
      const playlist = await spotifyService.getPlaylist(access_token, req.body.playlist, offset);
      if (playlist.length === 100) size += 1;
      console.log(playlist);
      const added = await Promise.all(playlist.map(async t => {
        const existingSongs = await Song.find({ genre: req.body.genre }).where('spotifyId').equals(t.track.id).exec();
        if (t.track.preview_url && existingSongs.length === 0) {
          const airsityAudio = await awsService.getFile(t.track.preview_url, 'audio/mpeg', t.track.name, 'songs');
          const airsityPhoto = await awsService.getFile(t.track.album.images[0].url, 'image/jpeg', t.track.name, 'albumart');
          const airsityThumbnail = await awsService.getFile(t.track.album.images[2].url, 'image/jpeg', t.track.name, 'thumbnails');
          const addSong = new Song({
            date: Date.now(),
            isoDate: new Date(Date.now()).toISOString(),
            title: t.track.name,
            artist: spotifyService.formatArtists(t.track.artists),
            photo: t.track.album.images[0].url,
            airsityPhoto,
            thumbnail: t.track.album.images[2].url,
            airsityThumbnail,
            audio: t.track.preview_url,
            airsityAudio,
            genre: req.body.genre,
            popularity: t.track.popularity,
            releaseDate: t.track.album.release_date,
            year: Number(t.track.album.release_date.split('-')[0]),
            spotifyId: t.track.id,
            openInSpotify: t.track.external_urls.spotify,
          });
          await addSong.save();
          return true;
        }
        return false;
      }));
      const didAdd = added.filter(t => t);
      songsAdded += didAdd.length;
      offset += 100;
    }

    res.status(200).json({ songsAdded });
  }

  catch(e) {
    console.log(e);
    res.status(500).json({ error: 'an error occured' });
  }
};
