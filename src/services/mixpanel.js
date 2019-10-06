const Mixpanel = require('mixpanel');
const keys = require('../config');

const ourIds = ['5ca384ccf28c230017f763e6', '5cb2941be3a7ac00177714e3', '5cc231b33da1a6001797d338'];

const mixpanel = Mixpanel.init(keys.mixpanelToken, {
  protocol: 'https'
});

exports.track = (event, id) => {
  if (!ourIds.includes(id) && keys.environment === 'production') {
    mixpanel.track(event, {
      distinct_id: id,
    });
  }
};

exports.trackListen = (event, genre, id, action) => {
  if (!ourIds.includes(id) && keys.environment === 'production') {
    mixpanel.track(event, {
      distinct_id: id,
      genre,
      action,
    });
  }
};

exports.trackPlaylistPlay = async (event, genre, id) => {
  if (!ourIds.includes(id) && keys.environment === 'production') {
    mixpanel.track(event, {
      distinct_id: id,
      genre,
    });
  }
};

