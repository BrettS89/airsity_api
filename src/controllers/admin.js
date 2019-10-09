const Song = require('../models/Song');
const User = require('../models/User');
const Playlist = require('../models/Playlist');
const Listen = require('../models/Listened');
const spotifyService = require('../utils/spotify');
const awsService = require('../services/aws');
const authService = require('../services/authService');
const userAnalyticsService = require('../services2/admin/userAnalytics');
const { Expo } = require('expo-server-sdk');
let expo = new Expo();

exports.addSongs = async (req, res) => {
  try {
    await authService.verifyTokenAdmin(req);
    let songsAdded = 0;
    let offset = 0;
    let size = 1

    for (let i = 0; i <= size; i++) {
      const access_token = await spotifyService.getAccessToken();
      const playlist = await spotifyService.getPlaylist(access_token, req.body.playlist, offset);
      if (playlist.length === 100) size += 1;
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
    console.log('add songs controller error', e);
    res.status(500).json({ error: e.message });
  }
};

exports.sendPushNotifications = async (req, res) => {
  try {
    await authService.verifyTokenAdmin(req);
    let date = Date.now();

    while (true) {
      const foundUsers = await User.find({ 
        pushToken: { $exists: true },
        date: { $lt: date },
      })
        .sort({ date: 'desc' })
        .limit(50)
        .exec();
      if (foundUsers.length === 0) break;
      const messages = foundUsers.map(u => {
        return {
          to: u.pushToken,
          sound: 'default',
          body: req.body.message,
        };
      });

      let chunks = expo.chunkPushNotifications(messages);

      for (let chunk of chunks) {
        await expo.sendPushNotificationsAsync(chunk);
      }
      date = foundUsers[foundUsers.length - 1].date;
    }
    res.status(200).json({ message: 'push notifications sent' });
  } catch(e) {
    res.status(500).json({ error: e.message });
    console.log('sendSMS error', e);
  }
};

exports.userAnalytics = async (req, res) => {
  try {
    await authService.verifyTokenAdmin(req);
    const activeUsers = await User.find()
      .sort({ logins: 'desc' })
      .limit(15)
      .lean()
      .exec();
    const inactiveUsers = await User.find({ logins: { $gt: 0, $lt: 3 } })
      .sort({ logins: 'asc' })
      .limit(15)
      .lean()
      .exec();

    const activeUserWithData = await Promise.all(activeUsers.map(async u => {
      const listens = await Listen.find({ user: u._id }).count();
      const playlists = await Playlist.find({ user: u._id }).count();
      const percentage = playlists / listens;
      const hiphopListens = await userAnalyticsService.getGenreListensCount(u._id, 'hiphop');
      const popListens = await userAnalyticsService.getGenreListensCount(u._id, 'pop');
      const edmListens = await userAnalyticsService.getGenreListensCount(u._id, 'edm');
      const rnbListens = await userAnalyticsService.getGenreListensCount(u._id, 'rnb');
      return {
        ...u,
        listens,
        playlistsAdds: playlists,
        percentage,
        hiphopListenPercentage: hiphopListens / listens,
        popListenPercentage: popListens / listens,
        edmListenPercentage: edmListens / listens,
        rnbListenPercentage: rnbListens / listens,
      };
    }));

    const inactiveUsersWithData = await Promise.all(inactiveUsers.map(async u => {
      const listens = await Listen.find({ user: u._id }).count();
      const playlists = await Playlist.find({ user: u._id }).count();
      const percentage = playlists / listens;
      const hiphopListens = await userAnalyticsService.getGenreListensCount(u._id, 'hiphop');
      const popListens = await userAnalyticsService.getGenreListensCount(u._id, 'pop');
      const edmListens = await userAnalyticsService.getGenreListensCount(u._id, 'edm');
      const rnbListens = await userAnalyticsService.getGenreListensCount(u._id, 'rnb');
      return {
        ...u,
        listens,
        playlistsAdds: playlists,
        percentage,
        hiphopListenPercentage: hiphopListens / listens,
        popListenPercentage: popListens / listens,
        edmListenPercentage: edmListens / listens,
        rnbListenPercentage: rnbListens / listens,
      };
    }));

    const data = { active: activeUserWithData, inactive: inactiveUsersWithData };
    res.status(200).json({ data });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
};
