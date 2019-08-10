exports.formatArtists = artists => {
  const artistsArr = [];
  for (let i = 0; i < artists.length; i++) {

    if (i === 0) {
      artistsArr.push(artists[i].name);
    }

    if (i === 1 && artists.length === 2) {
      artistsArr.push(`feat. ${artists[i].name}`);
    }

    if (i === 1 && artists.length > 2) {
      artistsArr.push(`feat. ${artists[i].name},`);
    }

    if (i > 1 && i + 1 === artists.length) {
      artistsArr.push(artists[i].name);
    }

    if (i > 1 && i + 1 !== artists.length) {
      artistsArr.push(`${artists[i].name},`);
    }
  }
  return artistsArr.join(' ');
};

const axios = require('axios');
const keys = require('../config');
const GET_ACCESS_TOKEN = 'https://accounts.spotify.com/api/token';

const tokenOptions = {
  url: GET_ACCESS_TOKEN,
  method: 'post',
  params: {
    grant_type: 'client_credentials'
  },
  headers: {
    'Accept':'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  auth: {
    username: keys.spotifyClientId,
    password: keys.spofityClientSecret
  }
};

exports.getAccessToken = async () => {
  try {
    const { data } = await axios(tokenOptions);
    return data.access_token;
  } catch(e) {
    console.log(e);
    throw e;
  }
};

exports.getPlaylist = async (accessToken, playlistId, offset) => {
  const PLAYLIST_URI = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  const playlistOptions = {
    url: PLAYLIST_URI,
    method: 'get',
    params: {
      limit: 100,
      offset,
      market: 'US'
    },
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
  };

  try {
    const { data } = await axios(playlistOptions);
    return data.items;
  } catch(e) {
    console.log(e);
    throw e;
  }
};
