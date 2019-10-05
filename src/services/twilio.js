const twilio = require('twilio');
const keys = require('../config');
const ourIds = ['5ca384ccf28c230017f763e6', '5cb2941be3a7ac00177714e3', '5cc231b33da1a6001797d338'];

const client = new twilio(keys.twilioAccountSid, keys.twilioAuthToken);

exports.signupSMS = name => {
  const body = `New Airsity signup! ${name} just joined`;
  if (keys.environment === 'production') {
    try {
      client.messages.create({ body, to: '+16092131708', from: '+12679145215' });
      client.messages.create({ body, to: '+16098024463', from: '+12679145215' });
    } catch(e) {
      console.log(e);
    }
  }
};

exports.loginSMS = user => {
  const body = `${user.firstName} just opened the app`;
  if (keys.environment === 'production') {
    try {
      if (!ourIds.includes(user._id.toString())) {
        client.messages.create({ body, to: '+16092131708', from: '+12679145215' });
        client.messages.create({ body, to: '+16098024463', from: '+12679145215' });
      }
    } catch(e) {
      console.log(e);
    }
  }
}