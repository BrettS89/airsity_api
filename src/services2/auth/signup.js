const axios = require('axios');
const keys = require('../../config');

exports.addUserToMailchimp = async (email, firstName) => {
  const body = {
    email_address: email,
    status: 'subscribed',
    merge_fields: {
      'FNAME': firstName,
    },
  };
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    auth: {
      // username: keys.mailchimpApiKey,
      password: keys.mailchimpApiKey,
    },
  }
  const res = await axios.post(`${keys.mailchimpURI}/lists/${keys.mailchimpListId}/members`, body, config);
};
