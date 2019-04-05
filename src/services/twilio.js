const twilio = require('twilio');
const keys = require('../config');

const client = new twilio(keys.twilioAccountSid, keys.twilioAuthToken);

exports.signupSMS = (name) => {
  console.log(name)
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
