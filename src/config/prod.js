module.exports = {
  mongoURI: process.env.MONGO_URI,
  secret: process.env.SECRET,
  mixpanelToken: process.env.MIXPANEL_TOKEN,
  environment: process.env.ENVIRONMENT,
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
};
