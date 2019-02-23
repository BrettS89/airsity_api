const jwt = require('jsonwebtoken');
const keys = require('../config');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../services/authService');

exports.signup = async (req, res) => {
  try {
    const newUser = new User({
      date: req.body.date,
      isoDate: req.body.isoDate,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    });

    const savedUser = await newUser.save();

    const userId = {
      _id: savedUser._id,
    };

    const token = jwt.sign({ user: userId }, keys.secret);
    res.status(200).json({ status: 'success', token });
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

      const userId = {
        _id: user._id,
      };

      const token = jwt.sign({ user: userId }, keys.secret);
      return res.status(200).json({ status: 'success', token });
    }
    res.status(404).json({ error: 'no user was found' });
  }

  catch(e) {
    console.log(e);
    res.status(500).json({ error: 'an error occured' });
  }
};

exports.isLoggedIn = async (req, res) => {
  try {
    const { user, token } = await auth.verifyToken(req);
    res.status(200).json({ status: true })
  }

  catch(e) {
    res.status(200).json({ status: false });
  }
};
