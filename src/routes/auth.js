const express = require('express');
const auth = require('../controllers/auth');
const router = express.Router();

router.post('/signup', auth.signup);

router.post('/login', auth.login);

router.post('/facebook', auth.facebookAuth);

router.get('/isloggedin', auth.isLoggedIn);

module.exports = router;
