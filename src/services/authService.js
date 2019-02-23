const jwt = require('jsonwebtoken');
const keys = require('../config');

// verify token and get user id //
exports.verifyToken = async (req) => {
  const receivedToken = req.header('authorization');

  if(!receivedToken) {
    throw { error: 'Unauthorized', status: 401 }; 
  }

  try {
    await jwt.verify(receivedToken, keys.secret);
  }
  catch(e) {
    const error = (e.toString().split(' ')[2]);

    if(error === 'signature') {
      throw new Error('Wrong signature');
    }
  }

  const decodedUser = jwt.decode(receivedToken);

  if(decodedUser === null) {
    throw { error: 'Unauthorized', status: 401 };
  }

  const token = jwt.sign({ user: decodedUser.user }, keys.secret, { expiresIn: 1 });
  return { user: decodedUser.user, token };
};

// handle errors //
exports.handleError = (e, res) => {
  if(!e.status) {
    return res.status(500).json(e);
  }
  res.status(e.status).json(e);
};
