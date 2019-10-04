const jwt = require('jsonwebtoken');
const keys = require('../config');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../services/authService');
const mixpanel = require('../services/mixpanel');
const twilio = require('../services/twilio');

exports.signup = async (req, res) => {
  try {
    const { email, date, isoDate, firstName, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('User exists');
    if (!email || !date || !isoDate || !password || !firstName) {
      throw new Error('Did not provide all fields');
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ firstName, date, isoDate, email, password: hashedPassword });
    const savedUser = await newUser.save();
    const userId = { _id: savedUser._id };
    const token = jwt.sign({ user: userId }, keys.secret);
    res.status(200).json({ status: 'success', token });
    twilio.signupSMS(firstName);
    mixpanel.track('signup', savedUser._id);
  }

  catch(e) {
    console.log(e);
    res.status(500).json({ error: 'an error occured' });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if(user) {
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).json({ error: 'Invalid login credentials' })
      }
      const userId = { _id: user._id };
      const token = jwt.sign({ user: userId }, keys.secret);
      return res.status(200).json({ status: 'success', token, streamingService: user.streamingService });
    }
    res.status(404).json({ error: 'no user was found' });
  }

  catch(e) {
    console.log(e);
    res.status(500).json({ error: 'an error occured' });
  }
};

exports.facebookAuth = async (req, res) => {
  try {
    const { email, id, name, date, isoDate } = req.body;
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      const userId = { _id: foundUser._id };
      const token = jwt.sign({ user: userId }, keys.secret);
      res.status(200).json({ status: 'success', token, streamingService: foundUser.streamingService });
    } else {
      const newUser = new User({ 
        firstName: name.split(' ')[0], date, isoDate, email, password: bcrypt.hashSync(id)
      });
      const savedUser = await newUser.save();
      const userId = { _id: savedUser._id };
      const token = jwt.sign({ user: userId }, keys.secret);
      res.status(200).json({ status: 'success', token, streamingService: savedUser.streamingService });
      twilio.signupSMS(name.split(' ')[0]);
      mixpanel.track('facebookSignup', savedUser._id);
    }
  }

  catch(e) {
    console.log(e);
    res.status(500).json({ error: 'an error occured' });
  }
};

exports.setStreamingService = async (req, res) => {
  try {
    const { user, token } = await auth.verifyToken(req);
    const foundUser = await User.findById(user._id);
    foundUser.streamingService = req.body.streamingService;
    const savedUser = await foundUser.save();
    res.status(200).json({ streamingService: savedUser.streamingService });
  }

  catch(e) {
    res.status(500).json({ error: 'an error occured' });
    console.log('Set streaming service error: ', e);
  }
};

exports.isLoggedIn = async (req, res) => {
  try {
    const { user, token } = await auth.verifyToken(req);
    const foundUser = await User.findById(user._id);
    const streamingService = foundUser.streamingService ? foundUser.streamingService : false;
    res.status(200).json({ status: true, streamingService });
    mixpanel.track('login', user._id);
    twilio.loginSMS(foundUser.firstName);
  } catch(e) {
    res.status(500).json({ error: 'not authenticated' });
  }
};

exports.setPushToken = async (req, res) => {
  try {
    console.log(req.body);
    const { user, token } = await auth.verifyToken(req);
    const foundUser = await User.findById(user._id);
    foundUser.pushToken = req.body.token;
    await foundUser.save();
    res.status(200).json({ message: 'push token saved' });
  } catch(e) {
    res.status(500).json({ error: 'an error occured' });
    console.log('setPushTokenError', e);
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if(user) {
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).json({ error: 'Invalid login credentials' });
      }
      if (user._id.toString() === keys.brett || user._id.toString() === keys.kevin) {
        const userId = { _id: user._id };
        const token = jwt.sign({ user: userId }, keys.secret, { expiresIn: 28800 });
        return res.status(200).json({ status: 'success', token });
      } else {
        throw new Error('not admin');
      }
    }
    res.status(404).json({ error: 'no user was found' });
  } catch(e) {
    res.status(500).json({ error: 'login error' });
  }
};
