const Mixpanel = require('mixpanel');
const keys = require('../config');

const ourIds = ['5ca384ccf28c230017f763e6', '5bcd279bc0e7160013a6abf7'];

const mixpanel = Mixpanel.init(keys.mixpanelToken, {
  protocol: 'https'
});

exports.track = (event, id) => {
  if (!ourIds.includes(id)) {
    mixpanel.track(event, {
      distinct_id: id,
    });
  }
};

exports.trackListen = (event, genre, id, action) => {
  if (!ourIds.includes(id)) {
    mixpanel.track(event, {
      distinct_id: id,
      genre,
      action,
    });
  }
};
